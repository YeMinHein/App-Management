import type { NextRequest } from "next/server"
import { verifyToken } from "./auth"

export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  return await verifyToken(token)
}

export function createAuthResponse(message: string, status = 401) {
  return Response.json({ error: message }, { status })
}
