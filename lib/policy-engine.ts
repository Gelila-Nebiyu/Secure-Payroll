// Policy Decision Point (PDP) - Evaluates MAC, DAC, RBAC, RuBAC, ABAC policies
import { createClient } from "./supabase/server"

export interface UserContext {
  userId: string
  roles: string[]
  department: string | null
  securityLabel: "public" | "internal" | "confidential"
  attributes: Record<string, unknown>
  employmentStatus: string
  location: string | null
}

export interface ResourceContext {
  type: string
  id?: string
  securityLabel?: "public" | "internal" | "confidential"
  ownerId?: string
}

export interface EnvironmentContext {
  currentHour: number
  currentDay: string
  ipAddress: string
  deviceInfo?: string
}

export interface PolicyDecision {
  allowed: boolean
  reason: string
  matchedPolicy?: string
}

// Security label clearance levels
const CLEARANCE_LEVELS: Record<string, number> = {
  public: 0,
  internal: 1,
  confidential: 2,
}

// Main policy evaluation function
export async function evaluateAccess(
  user: UserContext,
  resource: ResourceContext,
  action: string,
  environment: EnvironmentContext,
): Promise<PolicyDecision> {
  // 1. Evaluate RuBAC first (time/location restrictions)
  const rulebased = await evaluateRuBAC(user, resource, action, environment)
  if (!rulebased.allowed) {
    return rulebased
  }

  // 2. Evaluate MAC (Mandatory Access Control)
  const mac = evaluateMAC(user, resource)
  if (!mac.allowed) {
    return mac
  }

  // 3. Evaluate RBAC (Role-Based Access Control)
  const rbac = await evaluateRBAC(user, resource.type, action)
  if (rbac.allowed) {
    return rbac
  }

  // 4. Evaluate DAC (Discretionary Access Control)
  if (resource.id) {
    const dac = await evaluateDAC(user.userId, resource, action)
    if (dac.allowed) {
      return dac
    }
  }

  // 5. Evaluate ABAC (Attribute-Based Access Control)
  const abac = await evaluateABAC(user, resource, action, environment)
  if (abac.allowed) {
    return abac
  }

  return {
    allowed: false,
    reason: "Access denied: No matching policy grants access",
  }
}

// MAC: Check security label clearance
function evaluateMAC(user: UserContext, resource: ResourceContext): PolicyDecision {
  if (!resource.securityLabel) {
    return { allowed: true, reason: "MAC: No label required" }
  }

  const userClearance = CLEARANCE_LEVELS[user.securityLabel] ?? 0
  const resourceClearance = CLEARANCE_LEVELS[resource.securityLabel] ?? 0

  if (userClearance >= resourceClearance) {
    return {
      allowed: true,
      reason: `MAC: User clearance (${user.securityLabel}) meets resource requirement (${resource.securityLabel})`,
    }
  }

  return {
    allowed: false,
    reason: `MAC: Insufficient clearance. User has ${user.securityLabel}, resource requires ${resource.securityLabel}`,
  }
}

// RBAC: Check role permissions
async function evaluateRBAC(user: UserContext, resourceType: string, action: string): Promise<PolicyDecision> {
  const supabase = await createClient()

  // Get permissions for user's roles
  const { data: permissions } = await supabase
    .from("role_permissions")
    .select(`
      permissions!inner (
        resource,
        action
      ),
      roles!inner (
        name
      )
    `)
    .in(
      "role_id",
      (await supabase.from("user_roles").select("role_id").eq("user_id", user.userId)).data?.map((r) => r.role_id) ??
        [],
    )

  const hasPermission = permissions?.some(
    (p: { permissions: { resource: string; action: string }[]; roles: { name: string }[] }) =>
      p.permissions?.some((perm: { resource: string; action: string }) => perm.resource === resourceType && perm.action === action),
  )

  if (hasPermission) {
    return {
      allowed: true,
      reason: `RBAC: Permission granted via role`,
      matchedPolicy: "RBAC",
    }
  }

  return {
    allowed: false,
    reason: "RBAC: No role permission found",
  }
}

// DAC: Check discretionary permissions
async function evaluateDAC(userId: string, resource: ResourceContext, action: string): Promise<PolicyDecision> {
  const supabase = await createClient()

  const { data: dacPermission } = await supabase
    .from("dac_permissions")
    .select("*")
    .eq("resource_type", resource.type)
    .eq("resource_id", resource.id)
    .eq("grantee_user_id", userId)
    .eq("permission", action)
    .or("expires_at.is.null,expires_at.gt.now()")
    .single()

  if (dacPermission) {
    return {
      allowed: true,
      reason: `DAC: Permission granted by resource owner`,
      matchedPolicy: "DAC",
    }
  }

  return {
    allowed: false,
    reason: "DAC: No discretionary permission found",
  }
}

// RuBAC: Check rule-based policies (time, location, etc.)
async function evaluateRuBAC(
  user: UserContext,
  resource: ResourceContext,
  action: string,
  environment: EnvironmentContext,
): Promise<PolicyDecision> {
  const supabase = await createClient()

  // Get active rule policies
  const { data: rules } = await supabase
    .from("rule_policies")
    .select("*")
    .eq("is_active", true)
    .order("priority", { ascending: false })

  if (!rules || rules.length === 0) {
    return { allowed: true, reason: "RuBAC: No rules defined" }
  }

  for (const rule of rules) {
    // Check if rule applies to this resource/action
    if (rule.resource && rule.resource !== resource.type) continue
    if (rule.action && rule.action !== action) continue

    const condition = rule.condition as Record<string, unknown>
    let matches = false

    // Time-based conditions
    if (condition.time) {
      const timeCondition = condition.time as { after?: string; before?: string }
      const currentTime = `${String(environment.currentHour).padStart(2, "0")}:00`

      if (timeCondition.after && timeCondition.before) {
        // Outside working hours check
        matches = currentTime >= timeCondition.after || currentTime < timeCondition.before
      }
    }

    // Attribute conditions
    if (condition.all) {
      matches = evaluateConditions(condition.all as ConditionItem[], user, environment)
    }

    if (matches && rule.effect === "deny") {
      // Check for pre-approval
      if (rule.requires_preapproval) {
        const { data: preapproval } = await supabase
          .from("rule_preapprovals")
          .select("*")
          .eq("user_id", user.userId)
          .eq("rule_policy_id", rule.id)
          .lte("valid_from", new Date().toISOString())
          .gte("valid_until", new Date().toISOString())
          .single()

        if (preapproval) {
          continue // Pre-approved, skip this deny rule
        }
      }

      return {
        allowed: false,
        reason: `RuBAC: ${rule.description || rule.name}`,
        matchedPolicy: rule.name,
      }
    }
  }

  return { allowed: true, reason: "RuBAC: No blocking rules" }
}

// ABAC: Check attribute-based policies
async function evaluateABAC(
  user: UserContext,
  resource: ResourceContext,
  action: string,
  environment: EnvironmentContext,
): Promise<PolicyDecision> {
  const supabase = await createClient()

  // Get active ABAC policies for this resource and action
  const { data: policies } = await supabase
    .from("abac_policies")
    .select("*")
    .eq("resource", resource.type)
    .eq("action", action)
    .eq("is_active", true)
    .order("priority", { ascending: false })

  if (!policies || policies.length === 0) {
    return { allowed: false, reason: "ABAC: No policies defined" }
  }

  for (const policy of policies) {
    const conditions = policy.conditions as { all?: ConditionItem[] }

    if (conditions.all && evaluateConditions(conditions.all, user, environment)) {
      if (policy.effect === "allow") {
        return {
          allowed: true,
          reason: `ABAC: ${policy.description || policy.name}`,
          matchedPolicy: policy.name,
        }
      } else {
        return {
          allowed: false,
          reason: `ABAC: ${policy.description || policy.name}`,
          matchedPolicy: policy.name,
        }
      }
    }
  }

  return { allowed: false, reason: "ABAC: No matching policy" }
}

// Helper: Evaluate condition array
interface ConditionItem {
  attr: string
  op: "eq" | "neq" | "in" | "nin" | "gt" | "lt" | "between"
  value: unknown
}

function evaluateConditions(conditions: ConditionItem[], user: UserContext, environment: EnvironmentContext): boolean {
  return conditions.every((cond) => {
    let attrValue: unknown

    // Get attribute value
    switch (cond.attr) {
      case "role":
        attrValue = user.roles
        break
      case "department":
        attrValue = user.department
        break
      case "hour":
        attrValue = environment.currentHour
        break
      case "security_label":
        attrValue = user.securityLabel
        break
      case "employment_status":
        attrValue = user.employmentStatus
        break
      case "location":
        attrValue = user.location
        break
      default:
        attrValue = user.attributes[cond.attr]
    }

    // Evaluate operation
    switch (cond.op) {
      case "eq":
        return attrValue === cond.value
      case "neq":
        return attrValue !== cond.value
      case "in":
        if (Array.isArray(attrValue)) {
          return attrValue.some((v) => (cond.value as unknown[]).includes(v))
        }
        return (cond.value as unknown[]).includes(attrValue)
      case "nin":
        if (Array.isArray(attrValue)) {
          return !attrValue.some((v) => (cond.value as unknown[]).includes(v))
        }
        return !(cond.value as unknown[]).includes(attrValue)
      case "gt":
        return (attrValue as number) > (cond.value as number)
      case "lt":
        return (attrValue as number) < (cond.value as number)
      case "between":
        const [min, max] = cond.value as [number, number]
        return (attrValue as number) >= min && (attrValue as number) <= max
      default:
        return false
    }
  })
}

// Helper: Get user context from database
export async function getUserContext(userId: string): Promise<UserContext | null> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      departments (name)
    `)
    .eq("id", userId)
    .single()

  if (!profile) return null

  const { data: userRoles } = await supabase
    .from("user_roles")
    .select(`
      roles (name)
    `)
    .eq("user_id", userId)

  return {
    userId,
    roles: userRoles?.flatMap((ur: any) => {
      const r = ur.roles
      if (Array.isArray(r)) {
        return r.map((x: any) => x.name).filter(Boolean)
      }
      return r?.name ? [r.name] : []
    }) ?? [],
    department: profile.departments?.name ?? null,
    securityLabel: profile.security_label,
    attributes: profile.attributes ?? {},
    employmentStatus: profile.employment_status ?? "active",
    location: profile.location,
  }
  
}

export async function checkAccess(
  userContext: UserContext,
  resourceType: string,
  action: string,
  resourceId?: string,
): Promise<PolicyDecision> {
  const resourceContext: ResourceContext = {
    type: resourceType,
    id: resourceId,
  }

  const now = new Date()
  const environmentContext: EnvironmentContext = {
    currentHour: now.getHours(),
    currentDay: now.toLocaleDateString("en-US", { weekday: "long" }),
    ipAddress: "unknown",
  }

  return evaluateAccess(userContext, resourceContext, action, environmentContext)
}