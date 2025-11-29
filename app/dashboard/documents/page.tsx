import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
        <p className="text-muted-foreground">Access your personal documents and files</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>View and manage your HR documents, pay stubs, and forms</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">Document management module coming soon.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Documents will be protected by DAC - owners can share with specific users.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
