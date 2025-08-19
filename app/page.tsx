"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Database, Key, Users } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">App Management Platform</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Securely manage your applications, API keys, and environments with our comprehensive CRUD platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/auth")} size="lg">
              Get Started
            </Button>
            <Button onClick={() => router.push("/auth")} variant="outline" size="lg">
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                JWT-based authentication with secure session management and user authorization
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Database className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>CRUD Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete Create, Read, Update, Delete functionality for managing your app configurations
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Key className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>API Key Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate, manage, and secure API keys for your applications across different environments
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Multi-user support with proper authorization and user-specific data isolation
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to get started?</CardTitle>
              <CardDescription>Create your account and start managing your applications today</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/auth")} size="lg" className="w-full">
                Create Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
