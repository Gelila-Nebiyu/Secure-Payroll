// Policy Enforcement Point (PEP) - Middleware for API routes
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "./supabase/server"
import { evaluateAccess, getUserContext, type ResourceContext, type EnvironmentContext } from "./policy-engine"
import { logAuditEvent } from "./audit"

export interface PolicyCheckOptions {
  resourceType: string
  resourceId?: string
  action: string
  getResourceLabel?: (request: NextRequest) => Promise<"public" | "internal" | "confidential" | undefined>
  getResourceOwner?: (request: NextRequest) => Promise<string | undefined>
}

export function withPolicyCheck(handler: (request: NextRequest) => Promise<NextResponse>, options: PolicyCheckOptions) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    try {
      const supabase = await createClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      // Get user context
      const userContext = await getUserContext(user.id)
      if (!userContext) {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 })
      }

      // Build resource context
      const resourceContext: ResourceContext = {
        type: options.resourceType,
        id: options.resourceId,
      }

      // Get resource security label if function provided
      if (options.getResourceLabel) {
        resourceContext.securityLabel = await options.getResourceLabel(request)
      }

      // Get resource owner if function provided
      if (options.getResourceOwner) {
        resourceContext.ownerId = await options.getResourceOwner(request)
      }

      // Build environment context
      const now = new Date()
      const environmentContext: EnvironmentContext = {
        currentHour: now.getHours(),
        currentDay: now.toLocaleDateString("en-US", { weekday: "long" }),
        ipAddress,
        deviceInfo: userAgent,
      }

      // Evaluate access
      const decision = await evaluateAccess(userContext, resourceContext, options.action, environmentContext)

      // Log the access attempt
      await logAuditEvent({
        userId: user.id,
        action: `${options.action}_${options.resourceType}`,
        resourceType: options.resourceType,
        resourceId: options.resourceId,
        result: decision.allowed ? "success" : "denied",
        metadata: {
          reason: decision.reason,
          matchedPolicy: decision.matchedPolicy,
          userRoles: userContext.roles,
          userSecurityLabel: userContext.securityLabel,
        },
        ipAddress,
        userAgent,
      })

      if (!decision.allowed) {
        return NextResponse.json(
          {
            error: "Access denied",
            reason: decision.reason,
          },
          { status: 403 },
        )
      }

      // Access granted - proceed with handler
      return handler(request)
    } catch (error) {
      console.error("Policy check error:", error)
      return NextResponse.json({ error: "Policy evaluation failed" }, { status: 500 })
    }
  }
}

// Simple policy check function for use within API handlers
export async function checkAccess(
  userId: string,
  resourceType: string,
  action: string,
  resourceId?: string,
  resourceLabel?: "public" | "internal" | "confidential",
  ipAddress?: string,
): Promise<{ allowed: boolean; reason: string }> {
  const userContext = await getUserContext(userId)
  if (!userContext) {
    return { allowed: false, reason: "User not found" }
  }

  const resourceContext: ResourceContext = {
    type: resourceType,
    id: resourceId,
    securityLabel: resourceLabel,
  }

  const now = new Date()
  const environmentContext: EnvironmentContext = {
    currentHour: now.getHours(),
    currentDay: now.toLocaleDateString("en-US", { weekday: "long" }),
    ipAddress: ipAddress || "unknown",
  }

  return evaluateAccess(userContext, resourceContext, action, environmentContext)
}
