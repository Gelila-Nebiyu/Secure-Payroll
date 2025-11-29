import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { logSystemEvent } from "@/lib/audit-logger"

export async function GET() {
  try {
    const startTime = Date.now()
    const supabase = await createClient()

    // Check database connectivity
    const { data, error } = await supabase.from("roles").select("count").limit(1)

    const dbResponseTime = Date.now() - startTime

    const health = {
      status: error ? "unhealthy" : "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: error ? "fail" : "pass",
          responseTime: `${dbResponseTime}ms`,
          error: error?.message,
        },
        encryption: {
          status: process.env.ENCRYPTION_KEY ? "pass" : "warn",
          message: process.env.ENCRYPTION_KEY ? "Key configured" : "Using default key",
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          vercel: !!process.env.VERCEL,
        },
      },
      version: "1.0.0",
    }

    // Log health check for monitoring
    if (error) {
      await logSystemEvent("health_check", "Health check failed", { error: error.message }, "error")
    }

    return NextResponse.json(health, {
      status: error ? 503 : 200,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
