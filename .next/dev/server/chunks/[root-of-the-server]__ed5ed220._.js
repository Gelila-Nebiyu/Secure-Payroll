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
"[externals]/argon2 [external] (argon2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("argon2", () => require("argon2"));

module.exports = mod;
}),
"[project]/lib/password.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Password validation and hashing utilities
__turbopack_context__.s([
    "PASSWORD_POLICY",
    ()=>PASSWORD_POLICY,
    "hashPassword",
    ()=>hashPassword,
    "validatePassword",
    ()=>validatePassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/argon2 [external] (argon2, cjs)");
;
const PASSWORD_POLICY = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    maxLength: 128
};
// Common passwords to disallow (subset - in production, use a larger list)
const COMMON_PASSWORDS = [
    "password123",
    "123456789012",
    "qwertyuiop12",
    "password1234",
    "letmein12345",
    "welcome12345",
    "admin1234567",
    "iloveyou1234"
];
function validatePassword(password) {
    const errors = [];
    let strengthScore = 0;
    // Length check
    if (password.length < PASSWORD_POLICY.minLength) {
        errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
    } else {
        strengthScore += 1;
        if (password.length >= 16) strengthScore += 1;
    }
    if (password.length > PASSWORD_POLICY.maxLength) {
        errors.push(`Password must not exceed ${PASSWORD_POLICY.maxLength} characters`);
    }
    // Uppercase check
    if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    } else if (/[A-Z]/.test(password)) {
        strengthScore += 1;
    }
    // Lowercase check
    if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    } else if (/[a-z]/.test(password)) {
        strengthScore += 1;
    }
    // Numbers check
    if (PASSWORD_POLICY.requireNumbers && !/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number");
    } else if (/[0-9]/.test(password)) {
        strengthScore += 1;
    }
    // Symbols check
    if (PASSWORD_POLICY.requireSymbols && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        errors.push("Password must contain at least one special character (!@#$%^&*...)");
    } else if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        strengthScore += 1;
    }
    // Common password check
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
        errors.push("This password is too common. Please choose a different one.");
    }
    // Determine strength
    let strength;
    if (strengthScore <= 2) strength = "weak";
    else if (strengthScore <= 4) strength = "fair";
    else if (strengthScore <= 5) strength = "good";
    else strength = "strong";
    return {
        isValid: errors.length === 0,
        errors,
        strength
    };
}
async function hashPassword(password) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__["hash"])(password, {
        type: 2,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4
    });
}
async function verifyPassword(password, hashedPassword) {
    try {
        return await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$argon2__$5b$external$5d$__$28$argon2$2c$__cjs$29$__["verify"])(hashedPassword, password);
    } catch  {
        return false;
    }
}
}),
"[project]/lib/captcha.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// hCaptcha verification
__turbopack_context__.s([
    "verifyCaptcha",
    ()=>verifyCaptcha
]);
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY;
const HCAPTCHA_VERIFY_URL = "https://hcaptcha.com/siteverify";
async function verifyCaptcha(token) {
    if (!HCAPTCHA_SECRET) {
        console.warn("HCAPTCHA_SECRET_KEY not configured - skipping verification");
        return {
            success: true
        };
    }
    try {
        const response = await fetch(HCAPTCHA_VERIFY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                secret: HCAPTCHA_SECRET,
                response: token
            })
        });
        const data = await response.json();
        if (data.success) {
            return {
                success: true
            };
        }
        return {
            success: false,
            error: data["error-codes"]?.join(", ") || "Captcha verification failed"
        };
    } catch (error) {
        console.error("Captcha verification error:", error);
        return {
            success: false,
            error: "Failed to verify captcha"
        };
    }
}
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
"[project]/app/api/auth/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/password.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$captcha$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/captcha.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rate-limit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/audit.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function POST(request) {
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    // Rate limiting
    const rateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkRateLimit"])(`register:${ipAddress}`, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RATE_LIMITS"].register);
    if (!rateLimit.success) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Too many registration attempts. Please try again later."
        }, {
            status: 429
        });
    }
    try {
        const body = await request.json();
        const { email, password, username, firstName, lastName, captchaToken } = body;
        // Validate required fields
        if (!email || !password || !username) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Email, password, and username are required"
            }, {
                status: 400
            });
        }
        // Verify captcha
        const captchaResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$captcha$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyCaptcha"])(captchaToken || "");
        if (!captchaResult.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Captcha verification failed. Please try again."
            }, {
                status: 400
            });
        }
        // Validate password
        const passwordValidation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validatePassword"])(password);
        if (!passwordValidation.isValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: passwordValidation.errors.join(". ")
            }, {
                status: 400
            });
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Register with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${request.nextUrl.origin}/auth/verify-email`,
                data: {
                    username,
                    first_name: firstName || "",
                    last_name: lastName || ""
                }
            }
        });
        if (error) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                action: "registration_failed",
                result: "error",
                metadata: {
                    email,
                    error: error.message
                },
                ipAddress,
                userAgent
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
            userId: data.user?.id,
            action: "user_registered",
            result: "success",
            metadata: {
                email,
                username
            },
            ipAddress,
            userAgent
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSystemEvent"])("user_registration", `New user registered: ${email}`, {
            userId: data.user?.id,
            email
        }, "info");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Registration successful. Please check your email to verify your account.",
            userId: data.user?.id
        });
    } catch (error) {
        console.error("Registration error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "An unexpected error occurred"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ed5ed220._.js.map