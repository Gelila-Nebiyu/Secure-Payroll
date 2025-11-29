import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { adminUnlockAccount } from "@/lib/account-lockout"
import { getUserContext, evaluateAccess } from "@/lib/policy-engine"

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"

  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if current user has permission to unlock accounts
    const userContext = await getUserContext(user.id)
    if (!userContext) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const decision = await evaluateAccess(userContext, { type: "users", id: userId }, "update", {
      currentHour: new Date().getHours(),
      currentDay: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      ipAddress,
    })

    if (!decision.allowed) {
      return NextResponse.json({ error: "You do not have permission to unlock accounts" }, { status: 403 })
    }

    await adminUnlockAccount(userId, user.id, ipAddress)

    return NextResponse.json({
      message: "Account unlocked successfully",
    })
  } catch (error) {
    console.error("Account unlock error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
