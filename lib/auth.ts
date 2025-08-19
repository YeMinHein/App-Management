import { jwtVerify, SignJWT } from "jose"

const secret = new TextEncoder().encode("your-secret-key-change-in-production")

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthTokens {
  accessToken: string
  user: User
}

// Mock user database - in production, use a real database
const users: Array<User & { password: string }> = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    password: "password123", // In production, hash passwords
  },
]

export async function createToken(user: User): Promise<string> {
  return await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    const user = users.find((u) => u.id === payload.userId)
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    throw new Error("User already exists")
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // In production, hash this
    name,
  }

  users.push(newUser)

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  }
}
