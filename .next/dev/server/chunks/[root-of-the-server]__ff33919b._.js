module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient,
    "createClient",
    ()=>createClient,
    "createServerAdminSupabaseClient",
    ()=>createServerAdminSupabaseClient,
    "createServerSupabaseClient",
    ()=>createServerSupabaseClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.86.0/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.86.0/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://ntovsgnqtxyuuyksjdet.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50b3ZzZ25xdHh5dXV5a3NqZGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODM2MDMsImV4cCI6MjA3OTc1OTYwM30.gXrk3yeNzu644W36RcIvc6SFruDO0zI-Ve4g1Y3KRYs"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Called from Server Component - handled by middleware
                }
            }
        }
    });
}
async function createAdminClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://ntovsgnqtxyuuyksjdet.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Called from Server Component - handled by middleware
                }
            }
        }
    });
}
const createServerSupabaseClient = createClient;
const createServerAdminSupabaseClient = createAdminClient;
}),
"[project]/lib/auth/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "getCurrentUser",
    ()=>getCurrentUser,
    "requireUser",
    ()=>requireUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
async function getCurrentUser() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        return null;
    }
    // Get user's profile with roles from user_roles join table
    const { data: profile } = await supabase.from("profiles").select(`
      security_label,
      department_id,
      departments (name),
      user_roles (
        roles (name)
      )
    `).eq("id", user.id).single();
    const roles = profile?.user_roles?.map((ur)=>ur.roles.name) || [];
    return {
        id: user.id,
        email: user.email,
        roles,
        securityLabel: profile?.security_label,
        department: profile?.departments?.name
    };
}
async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Authentication required");
    }
    return user;
}
async function createSession(userId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    // Update last login timestamp
    await supabase.from("profiles").update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }).eq("id", userId);
}
}),
"[project]/lib/policy-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Policy Decision Point (PDP) - Evaluates MAC, DAC, RBAC, RuBAC, ABAC policies
__turbopack_context__.s([
    "checkAccess",
    ()=>checkAccess,
    "evaluateAccess",
    ()=>evaluateAccess,
    "getUserContext",
    ()=>getUserContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
// Security label clearance levels
const CLEARANCE_LEVELS = {
    public: 0,
    internal: 1,
    confidential: 2
};
async function evaluateAccess(user, resource, action, environment) {
    // 1. Evaluate RuBAC first (time/location restrictions)
    const rulebased = await evaluateRuBAC(user, resource, action, environment);
    if (!rulebased.allowed) {
        return rulebased;
    }
    // 2. Evaluate MAC (Mandatory Access Control)
    const mac = evaluateMAC(user, resource);
    if (!mac.allowed) {
        return mac;
    }
    // 3. Evaluate RBAC (Role-Based Access Control)
    const rbac = await evaluateRBAC(user, resource.type, action);
    if (rbac.allowed) {
        return rbac;
    }
    // 4. Evaluate DAC (Discretionary Access Control)
    if (resource.id) {
        const dac = await evaluateDAC(user.userId, resource, action);
        if (dac.allowed) {
            return dac;
        }
    }
    // 5. Evaluate ABAC (Attribute-Based Access Control)
    const abac = await evaluateABAC(user, resource, action, environment);
    if (abac.allowed) {
        return abac;
    }
    return {
        allowed: false,
        reason: "Access denied: No matching policy grants access"
    };
}
// MAC: Check security label clearance
function evaluateMAC(user, resource) {
    if (!resource.securityLabel) {
        return {
            allowed: true,
            reason: "MAC: No label required"
        };
    }
    const userClearance = CLEARANCE_LEVELS[user.securityLabel] ?? 0;
    const resourceClearance = CLEARANCE_LEVELS[resource.securityLabel] ?? 0;
    if (userClearance >= resourceClearance) {
        return {
            allowed: true,
            reason: `MAC: User clearance (${user.securityLabel}) meets resource requirement (${resource.securityLabel})`
        };
    }
    return {
        allowed: false,
        reason: `MAC: Insufficient clearance. User has ${user.securityLabel}, resource requires ${resource.securityLabel}`
    };
}
// RBAC: Check role permissions
async function evaluateRBAC(user, resourceType, action) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    // Get permissions for user's roles
    const { data: permissions } = await supabase.from("role_permissions").select(`
      permissions!inner (
        resource,
        action
      ),
      roles!inner (
        name
      )
    `).in("role_id", (await supabase.from("user_roles").select("role_id").eq("user_id", user.userId)).data?.map((r)=>r.role_id) ?? []);
    const hasPermission = permissions?.some((p)=>p.permissions?.some((perm)=>perm.resource === resourceType && perm.action === action));
    if (hasPermission) {
        return {
            allowed: true,
            reason: `RBAC: Permission granted via role`,
            matchedPolicy: "RBAC"
        };
    }
    return {
        allowed: false,
        reason: "RBAC: No role permission found"
    };
}
// DAC: Check discretionary permissions
async function evaluateDAC(userId, resource, action) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: dacPermission } = await supabase.from("dac_permissions").select("*").eq("resource_type", resource.type).eq("resource_id", resource.id).eq("grantee_user_id", userId).eq("permission", action).or("expires_at.is.null,expires_at.gt.now()").single();
    if (dacPermission) {
        return {
            allowed: true,
            reason: `DAC: Permission granted by resource owner`,
            matchedPolicy: "DAC"
        };
    }
    return {
        allowed: false,
        reason: "DAC: No discretionary permission found"
    };
}
// RuBAC: Check rule-based policies (time, location, etc.)
async function evaluateRuBAC(user, resource, action, environment) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    // Get active rule policies
    const { data: rules } = await supabase.from("rule_policies").select("*").eq("is_active", true).order("priority", {
        ascending: false
    });
    if (!rules || rules.length === 0) {
        return {
            allowed: true,
            reason: "RuBAC: No rules defined"
        };
    }
    for (const rule of rules){
        // Check if rule applies to this resource/action
        if (rule.resource && rule.resource !== resource.type) continue;
        if (rule.action && rule.action !== action) continue;
        const condition = rule.condition;
        let matches = false;
        // Time-based conditions
        if (condition.time) {
            const timeCondition = condition.time;
            const currentTime = `${String(environment.currentHour).padStart(2, "0")}:00`;
            if (timeCondition.after && timeCondition.before) {
                // Outside working hours check
                matches = currentTime >= timeCondition.after || currentTime < timeCondition.before;
            }
        }
        // Attribute conditions
        if (condition.all) {
            matches = evaluateConditions(condition.all, user, environment);
        }
        if (matches && rule.effect === "deny") {
            // Check for pre-approval
            if (rule.requires_preapproval) {
                const { data: preapproval } = await supabase.from("rule_preapprovals").select("*").eq("user_id", user.userId).eq("rule_policy_id", rule.id).lte("valid_from", new Date().toISOString()).gte("valid_until", new Date().toISOString()).single();
                if (preapproval) {
                    continue; // Pre-approved, skip this deny rule
                }
            }
            return {
                allowed: false,
                reason: `RuBAC: ${rule.description || rule.name}`,
                matchedPolicy: rule.name
            };
        }
    }
    return {
        allowed: true,
        reason: "RuBAC: No blocking rules"
    };
}
// ABAC: Check attribute-based policies
async function evaluateABAC(user, resource, action, environment) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    // Get active ABAC policies for this resource and action
    const { data: policies } = await supabase.from("abac_policies").select("*").eq("resource", resource.type).eq("action", action).eq("is_active", true).order("priority", {
        ascending: false
    });
    if (!policies || policies.length === 0) {
        return {
            allowed: false,
            reason: "ABAC: No policies defined"
        };
    }
    for (const policy of policies){
        const conditions = policy.conditions;
        if (conditions.all && evaluateConditions(conditions.all, user, environment)) {
            if (policy.effect === "allow") {
                return {
                    allowed: true,
                    reason: `ABAC: ${policy.description || policy.name}`,
                    matchedPolicy: policy.name
                };
            } else {
                return {
                    allowed: false,
                    reason: `ABAC: ${policy.description || policy.name}`,
                    matchedPolicy: policy.name
                };
            }
        }
    }
    return {
        allowed: false,
        reason: "ABAC: No matching policy"
    };
}
function evaluateConditions(conditions, user, environment) {
    return conditions.every((cond)=>{
        let attrValue;
        // Get attribute value
        switch(cond.attr){
            case "role":
                attrValue = user.roles;
                break;
            case "department":
                attrValue = user.department;
                break;
            case "hour":
                attrValue = environment.currentHour;
                break;
            case "security_label":
                attrValue = user.securityLabel;
                break;
            case "employment_status":
                attrValue = user.employmentStatus;
                break;
            case "location":
                attrValue = user.location;
                break;
            default:
                attrValue = user.attributes[cond.attr];
        }
        // Evaluate operation
        switch(cond.op){
            case "eq":
                return attrValue === cond.value;
            case "neq":
                return attrValue !== cond.value;
            case "in":
                if (Array.isArray(attrValue)) {
                    return attrValue.some((v)=>cond.value.includes(v));
                }
                return cond.value.includes(attrValue);
            case "nin":
                if (Array.isArray(attrValue)) {
                    return !attrValue.some((v)=>cond.value.includes(v));
                }
                return !cond.value.includes(attrValue);
            case "gt":
                return attrValue > cond.value;
            case "lt":
                return attrValue < cond.value;
            case "between":
                const [min, max] = cond.value;
                return attrValue >= min && attrValue <= max;
            default:
                return false;
        }
    });
}
async function getUserContext(userId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: profile } = await supabase.from("profiles").select(`
      *,
      departments (name)
    `).eq("id", userId).single();
    if (!profile) return null;
    const { data: userRoles } = await supabase.from("user_roles").select(`
      roles (name)
    `).eq("user_id", userId);
    return {
        userId,
        roles: userRoles?.flatMap((ur)=>{
            const r = ur.roles;
            if (Array.isArray(r)) {
                return r.map((x)=>x.name).filter(Boolean);
            }
            return r?.name ? [
                r.name
            ] : [];
        }) ?? [],
        department: profile.departments?.name ?? null,
        securityLabel: profile.security_label,
        attributes: profile.attributes ?? {},
        employmentStatus: profile.employment_status ?? "active",
        location: profile.location
    };
}
async function checkAccess(userContext, resourceType, action, resourceId) {
    const resourceContext = {
        type: resourceType,
        id: resourceId
    };
    const now = new Date();
    const environmentContext = {
        currentHour: now.getHours(),
        currentDay: now.toLocaleDateString("en-US", {
            weekday: "long"
        }),
        ipAddress: "unknown"
    };
    return evaluateAccess(userContext, resourceContext, action, environmentContext);
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/audit-logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Unified Audit Logger with Encryption
__turbopack_context__.s([
    "auditLog",
    ()=>auditLog,
    "decryptLogMetadata",
    ()=>decryptLogMetadata,
    "encryptLogMetadata",
    ()=>encryptLogMetadata,
    "logSystemEvent",
    ()=>logSystemEvent,
    "triggerSecurityAlert",
    ()=>triggerSecurityAlert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key-change-in-production-32c";
// Ensure key is 32 bytes for AES-256
function getEncryptionKey() {
    const key = ENCRYPTION_KEY;
    if (key.length >= 32) {
        return Buffer.from(key.slice(0, 32));
    }
    return Buffer.from(key.padEnd(32, "0"));
}
function encryptLogMetadata(data) {
    try {
        const key = getEncryptionKey();
        const iv = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(16);
        const cipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createCipheriv("aes-256-gcm", key, iv);
        const jsonData = JSON.stringify(data);
        let encrypted = cipher.update(jsonData, "utf8", "hex");
        encrypted += cipher.final("hex");
        const authTag = cipher.getAuthTag();
        // Combine IV + authTag + encrypted data
        return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
    } catch (error) {
        console.error("Encryption error:", error);
        return "";
    }
}
function decryptLogMetadata(encryptedData) {
    try {
        if (!encryptedData) return {};
        const parts = encryptedData.split(":");
        if (parts.length !== 3) return {};
        const [ivHex, authTagHex, encrypted] = parts;
        const key = getEncryptionKey();
        const iv = Buffer.from(ivHex, "hex");
        const authTag = Buffer.from(authTagHex, "hex");
        const decipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return JSON.parse(decrypted);
    } catch (error) {
        console.error("Decryption error:", error);
        return {};
    }
}
async function auditLog(params) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        // Get IP and user agent from headers if not provided
        let ipAddress = params.ipAddress;
        let userAgent = params.userAgent;
        if (!ipAddress || !userAgent) {
            try {
                const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["headers"])();
                ipAddress = ipAddress || headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";
                userAgent = userAgent || headersList.get("user-agent") || "unknown";
            } catch  {
                ipAddress = ipAddress || "unknown";
                userAgent = userAgent || "unknown";
            }
        }
        // Encrypt metadata
        let encryptedMetadata = null;
        if (params.metadata && Object.keys(params.metadata).length > 0) {
            encryptedMetadata = encryptLogMetadata(params.metadata);
        }
        const { error } = await supabase.from("audit_logs").insert({
            user_id: params.userId || null,
            action: params.action,
            resource_type: params.resourceType || null,
            resource_id: params.resourceId || null,
            result: params.result || "success",
            encrypted_metadata: encryptedMetadata,
            ip_address: ipAddress,
            user_agent: userAgent
        });
        if (error) {
            console.error("Audit log insert error:", error);
        }
    } catch (error) {
        // Audit logging should never break the main flow
        console.error("Audit log error:", error);
    }
}
async function logSystemEvent(eventType, description, metadata, severity = "info") {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        let encryptedMetadata = null;
        if (metadata) {
            encryptedMetadata = encryptLogMetadata(metadata);
        }
        await supabase.from("system_events").insert({
            event_type: eventType,
            description,
            encrypted_metadata: encryptedMetadata,
            severity
        });
    } catch (error) {
        console.error("System event log error:", error);
    }
}
async function triggerSecurityAlert(alertType, details) {
    try {
        // Log to system events with critical severity
        await logSystemEvent(`security_alert_${alertType}`, `Security alert: ${alertType}`, details, "critical");
        // In production, this would also:
        // - Send email to security team
        // - Push to external monitoring (Logflare, Datadog, etc.)
        // - Trigger webhook notifications
        console.warn(`[SECURITY ALERT] ${alertType}:`, details);
    } catch (error) {
        console.error("Security alert error:", error);
    }
}
}),
"[project]/app/api/payroll/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/policy-engine.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audit-logger.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        // Get user's full profile with roles
        const { data: userProfile } = await supabase.from("users").select(`
        *,
        user_roles(roles(name, permissions:role_permissions(permissions(name, resource, action))))
      `).eq("id", user.id).single();
        const userContext = {
            userId: user.id,
            securityLabel: userProfile?.security_label || "public",
            department: userProfile?.department,
            roles: userProfile?.user_roles?.map((ur)=>ur.roles.name) || [],
            attributes: userProfile?.attributes || {},
            employmentStatus: userProfile?.employment_status || "active",
            location: userProfile?.location || null
        };
        // Check base access to payroll resource
        const accessResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkAccess"])(userContext, "payroll", "read");
        if (!accessResult.allowed) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auditLog"])({
                userId: user.id,
                action: "payroll_list",
                resourceType: "payroll",
                result: "denied",
                metadata: {
                    reason: accessResult.reason,
                    policy: accessResult.matchedPolicy
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Access denied",
                reason: accessResult.reason
            }, {
                status: 403
            });
        }
        // Fetch payroll records based on MAC clearance
        let query = supabase.from("payroll_records").select(`
        *,
        users!employee_id(username, email)
      `).order("created_at", {
            ascending: false
        });
        // MAC filtering based on security label
        const labelOrder = [
            "public",
            "internal",
            "confidential"
        ];
        const userLabelIndex = labelOrder.indexOf(userProfile?.security_label || "public");
        const accessibleLabels = labelOrder.slice(0, userLabelIndex + 1);
        query = query.in("security_label", accessibleLabels);
        // If not admin/HR, only show own records
        const isPrivileged = userContext.roles.some((r)=>[
                "System Administrator",
                "HR Manager",
                "Finance Manager",
                "Payroll Manager"
            ].includes(r));
        if (!isPrivileged) {
            query = query.eq("employee_id", user.id);
        }
        const { data: records, error } = await query;
        if (error) {
            console.error("Error fetching payroll records:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to fetch records"
            }, {
                status: 500
            });
        }
        // Transform records
        const transformedRecords = records?.map((record)=>({
                ...record,
                employee_name: record.users?.username || null,
                users: undefined
            }));
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: user.id,
            action: "payroll_list",
            resourceType: "payroll",
            result: "success",
            metadata: {
                recordCount: records?.length,
                accessLevel: userProfile?.security_label
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            records: transformedRecords
        });
    } catch (error) {
        console.error("Payroll fetch error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        // Get user context
        const { data: userProfile } = await supabase.from("users").select(`
        *,
        user_roles(roles(name))
      `).eq("id", user.id).single();
        const userContext = {
            userId: user.id,
            securityLabel: userProfile?.security_label || "public",
            department: userProfile?.department,
            roles: userProfile?.user_roles?.map((ur)=>ur.roles.name) || [],
            attributes: userProfile?.attributes || {},
            employmentStatus: userProfile?.employment_status || "active",
            location: userProfile?.location || null
        };
        // Check write access
        const accessResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkAccess"])(userContext, "payroll", "write");
        if (!accessResult.allowed) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auditLog"])({
                userId: user.id,
                action: "payroll_create",
                resourceType: "payroll",
                result: "denied",
                metadata: {
                    reason: accessResult.reason
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Access denied",
                reason: accessResult.reason
            }, {
                status: 403
            });
        }
        const body = await request.json();
        const { employee_id, salary_amount, currency, pay_period_start, pay_period_end, security_label } = body;
        // Calculate taxes (simplified US tax calculation)
        const federalTax = salary_amount * 0.22;
        const stateTax = salary_amount * 0.05;
        const socialSecurity = salary_amount * 0.062;
        const medicare = salary_amount * 0.0145;
        const totalDeductions = federalTax + stateTax + socialSecurity + medicare;
        const netPay = salary_amount - totalDeductions;
        // Get the appropriate data label ID
        const { data: labelData } = await supabase.from("data_labels").select("id").eq("label_name", security_label).single();
        const { data: record, error } = await supabase.from("payroll_records").insert({
            employee_id,
            salary_amount,
            currency: currency || "USD",
            pay_period_start,
            pay_period_end,
            tax_info: {
                federal_tax: federalTax,
                state_tax: stateTax,
                social_security: socialSecurity,
                medicare: medicare
            },
            deductions: 0,
            net_pay: netPay,
            status: "draft",
            security_label,
            label_id: labelData?.id,
            created_by: user.id
        }).select().single();
        if (error) {
            console.error("Error creating payroll record:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to create record"
            }, {
                status: 500
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: user.id,
            action: "payroll_create",
            resourceType: "payroll",
            resourceId: record.id,
            result: "success",
            metadata: {
                employee_id,
                salary_amount,
                security_label
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            record
        });
    } catch (error) {
        console.error("Payroll create error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ff33919b._.js.map