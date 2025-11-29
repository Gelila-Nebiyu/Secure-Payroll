import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>We&apos;ve sent a verification link to your email address</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account and complete registration. The link will expire in 24
            hours.
          </p>

          <div className="rounded-lg border bg-muted/50 p-4 text-sm">
            <p className="font-medium">Didn&apos;t receive the email?</p>
            <p className="mt-1 text-muted-foreground">
              Check your spam folder or contact support if you continue to have issues.
            </p>
          </div>

          <Link href="/auth/login">
            <Button variant="outline" className="w-full bg-transparent">
              Return to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
