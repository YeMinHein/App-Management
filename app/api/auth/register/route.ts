import { type NextRequest, NextResponse } from "next/server"
import { registerUser, createToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const user = await registerUser(email, password, name)
    const accessToken = await createToken(user)

    return NextResponse.json({
      accessToken,
      user,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 400 })
  }
}
