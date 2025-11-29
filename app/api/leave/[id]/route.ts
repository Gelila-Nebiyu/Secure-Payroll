import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to approve/reject
    const isManager = user.roles.some((role) =>
      ["System Administrator", "HR Manager", "Department Manager"].includes(role),
    )

    if (!isManager) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { status } = body

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data: updatedRequest, error } = await supabase
      .from("leave_requests")
      .update({
        status,
        approved_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating leave request:", error)
      return NextResponse.json({ error: "Failed to update leave request" }, { status: 500 })
    }

    return NextResponse.json({ request: updatedRequest })
  } catch (error) {
    console.error("Leave update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
