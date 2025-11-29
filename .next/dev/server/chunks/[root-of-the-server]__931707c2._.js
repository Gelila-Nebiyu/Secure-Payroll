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
"[project]/lib/rate-limit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Simple in-memory rate limiting for serverless
// For production, consider using Upstash Redis
__turbopack_context__.s([
    "RATE_LIMITS",
    ()=>RATE_LIMITS,
    "checkRateLimit",
    ()=>checkRateLimit
]);
const rateLimitStore = new Map();
function checkRateLimit(identifier, config) {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);
    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
        cleanupExpiredEntries();
    }
    if (!entry || entry.resetAt < now) {
        // New window
        const newEntry = {
            count: 1,
            resetAt: now + config.windowMs
        };
        rateLimitStore.set(identifier, newEntry);
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetAt: newEntry.resetAt
        };
    }
    if (entry.count >= config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetAt: entry.resetAt
        };
    }
    entry.count++;
    return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt
    };
}
function cleanupExpiredEntries() {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()){
        if (entry.resetAt < now) {
            rateLimitStore.delete(key);
        }
    }
}
const RATE_LIMITS = {
    login: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 5
    },
    register: {
        windowMs: 60 * 60 * 1000,
        maxRequests: 3
    },
    api: {
        windowMs: 60 * 1000,
        maxRequests: 100
    },
    totp: {
        windowMs: 5 * 60 * 1000,
        maxRequests: 5
    }
};
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
"[project]/lib/account-lockout.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Account lockout management
__turbopack_context__.s([
    "adminUnlockAccount",
    ()=>adminUnlockAccount,
    "checkAccountLockout",
    ()=>checkAccountLockout,
    "recordFailedLogin",
    ()=>recordFailedLogin,
    "resetFailedAttempts",
    ()=>resetFailedAttempts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audit.ts [app-route] (ecmascript)");
;
;
const LOCKOUT_THRESHOLDS = [
    {
        attempts: 3,
        duration: 5 * 60 * 1000
    },
    {
        attempts: 5,
        duration: 30 * 60 * 1000
    },
    {
        attempts: 10,
        duration: 24 * 60 * 60 * 1000
    }
];
async function checkAccountLockout(userId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
    const { data: profile } = await supabase.from("profiles").select("failed_login_attempts, locked_until").eq("id", userId).single();
    if (!profile) {
        return {
            isLocked: false,
            lockedUntil: null,
            failedAttempts: 0,
            remainingAttempts: LOCKOUT_THRESHOLDS[0].attempts
        };
    }
    const now = new Date();
    const lockedUntil = profile.locked_until ? new Date(profile.locked_until) : null;
    const isLocked = lockedUntil !== null && lockedUntil > now;
    // Calculate remaining attempts
    let remainingAttempts = LOCKOUT_THRESHOLDS[0].attempts - profile.failed_login_attempts;
    for (const threshold of LOCKOUT_THRESHOLDS){
        if (profile.failed_login_attempts < threshold.attempts) {
            remainingAttempts = threshold.attempts - profile.failed_login_attempts;
            break;
        }
    }
    return {
        isLocked,
        lockedUntil,
        failedAttempts: profile.failed_login_attempts,
        remainingAttempts: Math.max(0, remainingAttempts)
    };
}
async function recordFailedLogin(userId, ipAddress) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
    // Increment failed attempts
    const { data: profile } = await supabase.from("profiles").select("failed_login_attempts").eq("id", userId).single();
    const newAttempts = (profile?.failed_login_attempts ?? 0) + 1;
    // Determine lockout duration
    let lockoutDuration = 0;
    for (const threshold of LOCKOUT_THRESHOLDS){
        if (newAttempts >= threshold.attempts) {
            lockoutDuration = threshold.duration;
        }
    }
    const lockedUntil = lockoutDuration > 0 ? new Date(Date.now() + lockoutDuration) : null;
    await supabase.from("profiles").update({
        failed_login_attempts: newAttempts,
        locked_until: lockedUntil?.toISOString()
    }).eq("id", userId);
    // Log the event
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
        userId,
        action: "login_failed",
        result: "denied",
        metadata: {
            attempts: newAttempts,
            locked: !!lockedUntil
        },
        ipAddress
    });
    return checkAccountLockout(userId);
}
async function resetFailedAttempts(userId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
    await supabase.from("profiles").update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login_at: new Date().toISOString()
    }).eq("id", userId);
}
async function adminUnlockAccount(userId, adminId, ipAddress) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
    await supabase.from("profiles").update({
        failed_login_attempts: 0,
        locked_until: null
    }).eq("id", userId);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
        userId: adminId,
        action: "admin_unlock_account",
        resourceType: "user",
        resourceId: userId,
        result: "success",
        ipAddress
    });
}
}),
"[project]/app/api/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rate-limit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$account$2d$lockout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/account-lockout.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audit.ts [app-route] (ecmascript)");
;
;
;
;
;
async function POST(request) {
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    // Rate limiting by IP
    const rateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkRateLimit"])(`login:${ipAddress}`, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RATE_LIMITS"].login);
    if (!rateLimit.success) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Too many login attempts. Please try again later."
        }, {
            status: 429
        });
    }
    try {
        const body = await request.json();
        const { email, password } = body;
        if (!email || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Email and password are required"
            }, {
                status: 400
            });
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // First, check if user exists and is locked
        const { data: existingUser } = await supabase.from("profiles").select("id, status, totp_enabled").eq("email", email).single();
        if (existingUser) {
            // Check lockout status
            const lockoutStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$account$2d$lockout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkAccountLockout"])(existingUser.id);
            if (lockoutStatus.isLocked) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Account is locked until ${lockoutStatus.lockedUntil?.toLocaleString()}`,
                    lockedUntil: lockoutStatus.lockedUntil
                }, {
                    status: 423
                });
            }
            // Check if account is suspended
            if (existingUser.status === "suspended") {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Account has been suspended. Contact administrator."
                }, {
                    status: 403
                });
            }
        }
        // Attempt login
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            // Record failed attempt if user exists
            if (existingUser) {
                const lockoutStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$account$2d$lockout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordFailedLogin"])(existingUser.id, ipAddress);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Invalid email or password",
                    remainingAttempts: lockoutStatus.remainingAttempts
                }, {
                    status: 401
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid email or password"
            }, {
                status: 401
            });
        }
        // Successful password verification - check for MFA requirement
        const { data: profile } = await supabase.from("profiles").select("id, totp_enabled, status").eq("id", data.user.id).single();
        // Check if MFA is enabled
        if (profile?.totp_enabled) {
            // Don't complete login yet - require TOTP verification
            // Sign out to prevent access before MFA
            await supabase.auth.signOut();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                mfaRequired: true,
                mfaType: "totp",
                userId: data.user.id,
                message: "Please enter your authenticator code"
            });
        }
        // No MFA - complete login
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$account$2d$lockout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resetFailedAttempts"])(data.user.id);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
            userId: data.user.id,
            action: "login_success",
            result: "success",
            metadata: {
                mfaUsed: false
            },
            ipAddress,
            userAgent
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Login successful",
            user: {
                id: data.user.id,
                email: data.user.email
            },
            session: {
                accessToken: data.session.access_token,
                expiresAt: data.session.expires_at
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "An unexpected error occurred"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__931707c2._.js.map