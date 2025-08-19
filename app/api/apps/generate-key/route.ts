import { type NextRequest, NextResponse } from "next/server"
import { generateAppKey } from "@/lib/database"
import { getAuthenticatedUser, createAuthResponse } from "@/lib/auth-middleware"

// POST /api/apps/generate-key - Generate new app key
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return createAuthResponse("Authentication required")
    }

    const newKey = generateAppKey()
    return NextResponse.json({ appKey: newKey })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
