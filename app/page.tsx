import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Users, FileText, Clock, Activity } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SecurePayroll</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Enterprise Payroll Management
          <br />
          <span className="text-primary">with Military-Grade Security</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          Secure payroll processing with comprehensive access control, multi-factor authentication, and complete audit
          trails. Built for organizations that demand the highest security standards.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="h-12 px-8">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <h2 className="text-center text-3xl font-bold text-foreground">Comprehensive Security Features</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Built with five layers of access control to protect your sensitive payroll data
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Mandatory Access Control</CardTitle>
              <CardDescription>
                System-enforced security labels classify data as Public, Internal, or Confidential
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Access determined by security clearance levels, not user discretion. Only administrators can modify
              security labels.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Role-Based Access Control</CardTitle>
              <CardDescription>
                Define roles based on job responsibilities with specific permission sets
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              HR Managers, Finance Officers, Department Heads - each role has precisely defined access rights with full
              audit trails.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Discretionary Access Control</CardTitle>
              <CardDescription>Resource owners can grant specific permissions to other users</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Share documents and records with fine-grained control. All grants are logged and can expire automatically.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Rule-Based Access Control</CardTitle>
              <CardDescription>Enforce restrictions based on time, location, and device</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Deny access outside working hours, require pre-approval for sensitive operations, and enforce contextual
              security rules.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Attribute-Based Access Control</CardTitle>
              <CardDescription>Dynamic policies using user attributes, department, and context</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Combine role, department, time, and custom attributes for fine-grained access decisions evaluated in
              real-time.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Activity className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Complete Audit Trails</CardTitle>
              <CardDescription>Every action logged with encrypted metadata and centralized monitoring</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Full activity logging, system events, role changes, and access decisions. Encrypted logs with alerting for
              anomalies.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground">Multi-Factor Authentication</h2>
            <p className="mt-4 text-muted-foreground">
              Protect accounts with password policies, TOTP authenticator apps, and WebAuthn passkeys
            </p>

            <div className="mt-12 grid gap-6 text-left sm:grid-cols-2">
              <div className="rounded-lg bg-card p-6">
                <h3 className="font-semibold text-foreground">Password Security</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• Minimum 12 characters with complexity requirements</li>
                  <li>• Argon2id hashing with salt protection</li>
                  <li>• Account lockout after failed attempts</li>
                  <li>• Common password detection</li>
                </ul>
              </div>

              <div className="rounded-lg bg-card p-6">
                <h3 className="font-semibold text-foreground">TOTP Authentication</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• Server-managed one-time passwords</li>
                  <li>• Compatible with Google Authenticator, Authy</li>
                  <li>• Encrypted secret storage</li>
                  <li>• No email-based OTP required</li>
                </ul>
              </div>

              <div className="rounded-lg bg-card p-6">
                <h3 className="font-semibold text-foreground">WebAuthn / Passkeys</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• Biometric authentication support</li>
                  <li>• Hardware security key compatible</li>
                  <li>• Phishing-resistant authentication</li>
                  <li>• Cross-platform support</li>
                </ul>
              </div>

              <div className="rounded-lg bg-card p-6">
                <h3 className="font-semibold text-foreground">Session Security</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• HttpOnly secure cookies</li>
                  <li>• Short-lived access tokens</li>
                  <li>• Refresh token rotation</li>
                  <li>• Session management dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Secure Payroll System - Addis Ababa Science and Technology University</p>
          <p className="mt-2">Department of Software Engineering - Computer System Security Project</p>
        </div>
      </footer>
    </div>
  )
}
