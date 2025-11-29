import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Clock, Shield, AlertTriangle, CheckCircle, Activity } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      user_roles (
        roles (name)
      )
    `)
    .eq("id", user?.id)
    .single()

  const userRoles = profile?.user_roles?.map((ur: { roles: { name: string } }) => ur.roles.name) || []
  const isAdmin = userRoles.some((role: string) =>
    ["System Administrator", "HR Manager", "Finance Manager"].includes(role),
  )

  // Get stats for admin users
  let stats = {
    totalUsers: 0,
    pendingRequests: 0,
    recentPayrolls: 0,
    activeAlerts: 0,
  }

  if (isAdmin) {
    const [usersResult, requestsResult, payrollsResult] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("access_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("payroll_records").select("id", { count: "exact", head: true }),
    ])

    stats = {
      totalUsers: usersResult.count || 0,
      pendingRequests: requestsResult.count || 0,
      recentPayrolls: payrollsResult.count || 0,
      activeAlerts: 0,
    }
  }

  // Get user's pending leave requests
  const { data: leaveRequests } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("employee_id", user?.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get recent audit logs for the user
  const { data: recentActivity } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {profile?.first_name || profile?.username}</p>
      </div>

      {/* Role badges */}
      <div className="flex flex-wrap gap-2">
        {userRoles.map((role: string) => (
          <Badge key={role} variant="secondary">
            {role}
          </Badge>
        ))}
      </div>

      {/* Admin Stats */}
      {isAdmin && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Payroll Records</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentPayrolls}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Secure</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Leave Requests
            </CardTitle>
            <CardDescription>Your submitted leave requests awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            {leaveRequests && leaveRequests.length > 0 ? (
              <div className="space-y-3">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{request.leave_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.start_date} - {request.end_date}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No pending leave requests</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your recent actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        log.result === "success"
                          ? "bg-green-500"
                          : log.result === "denied"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{log.action.replace(/_/g, " ")}</p>
                      <p className="text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Notice for MFA */}
      {!profile?.totp_enabled && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Security Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700">
              Your account does not have two-factor authentication enabled. We strongly recommend enabling TOTP or
              passkeys for enhanced security.
            </p>
            <a href="/dashboard/security" className="mt-2 inline-block text-sm font-medium text-yellow-800 underline">
              Enable MFA in Security Settings
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
