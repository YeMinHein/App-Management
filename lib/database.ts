export interface App {
  appID: string
  appTitle: string
  appKey: string
  appEnv: "development" | "staging" | "production"
  createdDate: string
  loginUser: string
}

export interface CreateAppData {
  appTitle: string
  appKey: string
  appEnv: "development" | "staging" | "production"
  loginUser: string
}

export interface UpdateAppData {
  appTitle?: string
  appKey?: string
  appEnv?: "development" | "staging" | "production"
}

// Mock database - in production, use a real database
const apps: App[] = [
  {
    appID: "1",
    appTitle: "Sample App",
    appKey: "sample-key-123",
    appEnv: "development",
    createdDate: new Date().toISOString(),
    loginUser: "admin@example.com",
  },
  {
    appID: "2",
    appTitle: "Production API",
    appKey: "prod-api-456",
    appEnv: "production",
    createdDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    loginUser: "admin@example.com",
  },
]

// Database operations
export function getAllApps(userEmail: string): App[] {
  return apps.filter((app) => app.loginUser === userEmail)
}

export function getAppById(appID: string, userEmail: string): App | null {
  const app = apps.find((app) => app.appID === appID)
  if (!app || app.loginUser !== userEmail) {
    return null
  }
  return app
}

export function createApp(data: CreateAppData): App {
  const newApp: App = {
    appID: Date.now().toString(),
    appTitle: data.appTitle,
    appKey: data.appKey,
    appEnv: data.appEnv,
    createdDate: new Date().toISOString(),
    loginUser: data.loginUser,
  }

  apps.push(newApp)
  return newApp
}

export function updateApp(appID: string, data: UpdateAppData, userEmail: string): App | null {
  const appIndex = apps.findIndex((app) => app.appID === appID && app.loginUser === userEmail)

  if (appIndex === -1) {
    return null
  }

  apps[appIndex] = {
    ...apps[appIndex],
    ...data,
  }

  return apps[appIndex]
}

export function deleteApp(appID: string, userEmail: string): boolean {
  const appIndex = apps.findIndex((app) => app.appID === appID && app.loginUser === userEmail)

  if (appIndex === -1) {
    return false
  }

  apps.splice(appIndex, 1)
  return true
}

export function generateAppKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
