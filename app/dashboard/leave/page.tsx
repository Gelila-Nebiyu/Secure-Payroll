import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
        <p className="text-muted-foreground">Submit and track your leave requests</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Leave Management</CardTitle>
          <CardDescription>Submit vacation, sick leave, or other time-off requests</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">Leave management module coming soon.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Note: Leave requests over 10 days require HR Manager approval (RuBAC policy).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
