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
"[project]/lib/crypto.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Encryption utilities for sensitive data (TOTP secrets, audit logs)
// Uses Web Crypto API for AES-GCM encryption
__turbopack_context__.s([
    "decrypt",
    ()=>decrypt,
    "encrypt",
    ()=>encrypt,
    "generateEncryptionKey",
    ()=>generateEncryptionKey,
    "hashToken",
    ()=>hashToken
]);
const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
// Get encryption key from environment variable
async function getEncryptionKey() {
    const keyBase64 = process.env.ENCRYPTION_KEY;
    if (!keyBase64) {
        throw new Error("ENCRYPTION_KEY environment variable is not set");
    }
    const keyBuffer = Buffer.from(keyBase64, "base64");
    return crypto.subtle.importKey("raw", keyBuffer, {
        name: ALGORITHM,
        length: KEY_LENGTH
    }, false, [
        "encrypt",
        "decrypt"
    ]);
}
async function encrypt(plaintext) {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedText = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({
        name: ALGORITHM,
        iv
    }, key, encodedText);
    // Combine IV and ciphertext, then base64 encode
    const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return Buffer.from(combined).toString("base64");
}
async function decrypt(encryptedData) {
    const key = await getEncryptionKey();
    const combined = Buffer.from(encryptedData, "base64");
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({
        name: ALGORITHM,
        iv
    }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
}
function generateEncryptionKey() {
    const key = crypto.getRandomValues(new Uint8Array(32));
    return Buffer.from(key).toString("base64");
}
async function hashToken(token) {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Buffer.from(hashBuffer).toString("hex");
}
}),
"[project]/lib/audit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Audit logging utilities with encryption
__turbopack_context__.s([
    "logAuditEvent",
    ()=>logAuditEvent,
    "logSystemEvent",
    ()=>logSystemEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/crypto.ts [app-route] (ecmascript)");
;
;
async function logAuditEvent(entry) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // Encrypt sensitive metadata
        let encryptedMetadata = null;
        if (entry.metadata) {
            encryptedMetadata = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encrypt"])(JSON.stringify(entry.metadata));
        }
        await supabase.from("audit_logs").insert({
            user_id: entry.userId,
            action: entry.action,
            resource_type: entry.resourceType,
            resource_id: entry.resourceId,
            result: entry.result,
            metadata_encrypted: encryptedMetadata,
            ip_address: entry.ipAddress,
            user_agent: entry.userAgent
        });
    } catch (error) {
        console.error("Failed to log audit event:", error);
    // Don't throw - audit logging should not break the main flow
    }
}
async function logSystemEvent(eventType, description, metadata, severity = "info") {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        await supabase.from("system_events").insert({
            event_type: eventType,
            description,
            metadata,
            severity
        });
    } catch (error) {
        console.error("Failed to log system event:", error);
    }
}
}),
"[project]/lib/policy-middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Policy Enforcement Point (PEP) - Middleware for API routes
__turbopack_context__.s([
    "checkAccess",
    ()=>checkAccess,
    "withPolicyCheck",
    ()=>withPolicyCheck
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/policy-engine.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audit.ts [app-route] (ecmascript)");
;
;
;
;
function withPolicyCheck(handler, options) {
    return async (request)=>{
        const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Authentication required"
                }, {
                    status: 401
                });
            }
            // Get user context
            const userContext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserContext"])(user.id);
            if (!userContext) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "User profile not found"
                }, {
                    status: 404
                });
            }
            // Build resource context
            const resourceContext = {
                type: options.resourceType,
                id: options.resourceId
            };
            // Get resource security label if function provided
            if (options.getResourceLabel) {
                resourceContext.securityLabel = await options.getResourceLabel(request);
            }
            // Get resource owner if function provided
            if (options.getResourceOwner) {
                resourceContext.ownerId = await options.getResourceOwner(request);
            }
            // Build environment context
            const now = new Date();
            const environmentContext = {
                currentHour: now.getHours(),
                currentDay: now.toLocaleDateString("en-US", {
                    weekday: "long"
                }),
                ipAddress,
                deviceInfo: userAgent
            };
            // Evaluate access
            const decision = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evaluateAccess"])(userContext, resourceContext, options.action, environmentContext);
            // Log the access attempt
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                userId: user.id,
                action: `${options.action}_${options.resourceType}`,
                resourceType: options.resourceType,
                resourceId: options.resourceId,
                result: decision.allowed ? "success" : "denied",
                metadata: {
                    reason: decision.reason,
                    matchedPolicy: decision.matchedPolicy,
                    userRoles: userContext.roles,
                    userSecurityLabel: userContext.securityLabel
                },
                ipAddress,
                userAgent
            });
            if (!decision.allowed) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Access denied",
                    reason: decision.reason
                }, {
                    status: 403
                });
            }
            // Access granted - proceed with handler
            return handler(request);
        } catch (error) {
            console.error("Policy check error:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Policy evaluation failed"
            }, {
                status: 500
            });
        }
    };
}
async function checkAccess(userId, resourceType, action, resourceId, resourceLabel, ipAddress) {
    const userContext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserContext"])(userId);
    if (!userContext) {
        return {
            allowed: false,
            reason: "User not found"
        };
    }
    const resourceContext = {
        type: resourceType,
        id: resourceId,
        securityLabel: resourceLabel
    };
    const now = new Date();
    const environmentContext = {
        currentHour: now.getHours(),
        currentDay: now.toLocaleDateString("en-US", {
            weekday: "long"
        }),
        ipAddress: ipAddress || "unknown"
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evaluateAccess"])(userContext, resourceContext, action, environmentContext);
}
}),
"[project]/app/api/access-request/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/policy-middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audit.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Authentication required"
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const { resourceType, resourceId, requestedAction, reason } = body;
        if (!resourceType || !requestedAction) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Resource type and requested action are required"
            }, {
                status: 400
            });
        }
        const adminSupabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // Create access request
        const { data: accessRequest, error: createError } = await adminSupabase.from("access_requests").insert({
            requester_id: user.id,
            resource_type: resourceType,
            resource_id: resourceId || null,
            requested_action: requestedAction,
            reason
        }).select().single();
        if (createError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: createError.message
            }, {
                status: 500
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
            userId: user.id,
            action: "access_request_created",
            resourceType,
            resourceId,
            result: "success",
            metadata: {
                requestedAction,
                reason
            },
            ipAddress,
            userAgent
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Access request submitted successfully",
            accessRequest
        });
    } catch (error) {
        console.error("Create access request error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create access request"
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Authentication required"
            }, {
                status: 401
            });
        }
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const forApproval = searchParams.get("forApproval") === "true";
        // Check if user can view all requests (approvers)
        const canApprove = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$policy$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkAccess"])(user.id, "access_requests", "approve", undefined, undefined, ipAddress);
        let query = supabase.from("access_requests").select(`
      *,
      requester:profiles!access_requests_requester_id_fkey (id, username, email),
      approver:profiles!access_requests_approver_id_fkey (id, username, email)
    `);
        if (forApproval && canApprove.allowed) {
            // Show pending requests for approval
            query = query.eq("status", "pending");
        } else if (!canApprove.allowed) {
            // Only show user's own requests
            query = query.eq("requester_id", user.id);
        }
        if (status) {
            query = query.eq("status", status);
        }
        const { data: requests, error } = await query.order("created_at", {
            ascending: false
        });
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            requests,
            canApprove: canApprove.allowed
        });
    } catch (error) {
        console.error("Get access requests error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch access requests"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9d831a51._.js.map