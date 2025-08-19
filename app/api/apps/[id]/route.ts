import { type NextRequest, NextResponse } from "next/server"
import { getAppById, updateApp, deleteApp } from "@/lib/database"
import { getAuthenticatedUser, createAuthResponse } from "@/lib/auth-middleware"

// GET /api/apps/[id] - Get specific app
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return createAuthResponse("Authentication required")
    }

    const app = getAppById(params.id, user.email)

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    return NextResponse.json({ app })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/apps/[id] - Update app
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return createAuthResponse("Authentication required")
    }

    const body = await request.json()
    const { appTitle, appKey, appEnv } = body

    const updateData: any = {}
    if (appTitle !== undefined) updateData.appTitle = appTitle
    if (appKey !== undefined) updateData.appKey = appKey
    if (appEnv !== undefined) {
      if (!["development", "staging", "production"].includes(appEnv)) {
        return NextResponse.json(
          { error: "Invalid environment. Must be development, staging, or production" },
          { status: 400 },
        )
      }
      updateData.appEnv = appEnv
    }

    const updatedApp = updateApp(params.id, updateData, user.email)

    if (!updatedApp) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    return NextResponse.json({ app: updatedApp })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/apps/[id] - Delete app
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return createAuthResponse("Authentication required")
    }

    const success = deleteApp(params.id, user.email)

    if (!success) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "App deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
