import { type NextRequest, NextResponse } from "next/server"
import { getAllApps, createApp, generateAppKey } from "@/lib/database"
import { getAuthenticatedUser, createAuthResponse } from "@/lib/auth-middleware"

// GET /api/apps - Get all apps for authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return createAuthResponse("Authentication required")
    }

    const apps = getAllApps(user.email)
    return NextResponse.json({ apps })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/apps - Create new app
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return createAuthResponse("Authentication required")
    }

    const body = await request.json()
    const { appTitle, appEnv } = body

    if (!appTitle || !appEnv) {
      return NextResponse.json({ error: "App title and environment are required" }, { status: 400 })
    }

    if (!["development", "staging", "production"].includes(appEnv)) {
      return NextResponse.json(
        { error: "Invalid environment. Must be development, staging, or production" },
        { status: 400 },
      )
    }

    const appKey = body.appKey || generateAppKey()

    const newApp = createApp({
      appTitle,
      appKey,
      appEnv,
      loginUser: user.email,
    })

    return NextResponse.json({ app: newApp }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
