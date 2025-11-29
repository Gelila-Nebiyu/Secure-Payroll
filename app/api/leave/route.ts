import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get user's own leave requests
    const { data: myRequests, error: myError } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("employee_id", user.id)
      .order("created_at", { ascending: false })

    if (myError) {
      console.error("Error fetching my leave requests:", myError)
    }

    // If user is a manager, get team requests
    let teamRequests: unknown[] = []
    const isManager = user.roles.some((role) =>
      ["System Administrator", "HR Manager", "Department Manager"].includes(role),
    )

    if (isManager) {
      const { data: pending, error: pendingError } = await supabase
        .from("leave_requests")
        .select(`
          *,
          profiles!employee_id(username, first_name, last_name)
        `)
        .eq("status", "pending")
        .neq("employee_id", user.id)
        .order("created_at", { ascending: false })

      if (!pendingError && pending) {
        teamRequests = pending.map((req) => ({
          ...req,
          employee_name:
            (req.profiles as { first_name: string; last_name: string; username: string } | null)?.first_name &&
            (req.profiles as { first_name: string; last_name: string; username: string } | null)?.last_name
              ? `${(req.profiles as { first_name: string; last_name: string }).first_name} ${(req.profiles as { first_name: string; last_name: string }).last_name}`
              : (req.profiles as { username: string } | null)?.username || "Unknown",
          profiles: undefined,
        }))
      }
    }

    return NextResponse.json({
      myRequests: myRequests || [],
      teamRequests,
    })
  } catch (error) {
    console.error("Leave fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { leave_type, start_date, end_date, reason } = body

    if (!leave_type || !start_date || !end_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: leaveRequest, error } = await supabase
      .from("leave_requests")
      .insert({
        employee_id: user.id,
        leave_type,
        start_date,
        end_date,
        reason: reason || "",
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating leave request:", error)
      return NextResponse.json({ error: "Failed to create leave request" }, { status: 500 })
    }

    return NextResponse.json({ request: leaveRequest })
  } catch (error) {
    console.error("Leave create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
