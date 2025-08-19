"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { App } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppTable } from "@/components/apps/app-table"
import { AppForm } from "@/components/apps/app-form"
import { AppDetails } from "@/components/apps/app-details"
import { Plus, LogOut, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [editingApp, setEditingApp] = useState<App | null>(null)
  const [viewingApp, setViewingApp] = useState<App | null>(null)

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/apps", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setApps(data.apps)
      } else {
        setError("Failed to fetch apps")
      }
    } catch (err) {
      setError("Failed to fetch apps")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApps()
  }, [])

  const handleCreateApp = async (appData: any) => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/apps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appData),
      })

      if (response.ok) {
        await fetchApps()
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const handleUpdateApp = async (appData: any) => {
    if (!editingApp) return false

    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/apps/${editingApp.appID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appData),
      })

      if (response.ok) {
        await fetchApps()
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const handleDeleteApp = async (appId: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return

    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/apps/${appId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchApps()
      }
    } catch (err) {
      setError("Failed to delete app")
    }
  }

  const openEditForm = (app: App) => {
    setEditingApp(app)
    setShowForm(true)
  }

  const openCreateForm = () => {
    setEditingApp(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingApp(null)
  }

  const openDetails = (app: App) => {
    setViewingApp(app)
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setViewingApp(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">App Management</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Apps</CardTitle>
                <CardDescription>Manage your application configurations and API keys</CardDescription>
              </div>
              <Button onClick={openCreateForm}>
                <Plus className="mr-2 h-4 w-4" />
                Create App
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <AppTable apps={apps} onEdit={openEditForm} onDelete={handleDeleteApp} onView={openDetails} />
          </CardContent>
        </Card>

        <AppForm
          app={editingApp}
          isOpen={showForm}
          onClose={closeForm}
          onSubmit={editingApp ? handleUpdateApp : handleCreateApp}
        />

        <AppDetails app={viewingApp} isOpen={showDetails} onClose={closeDetails} />
      </div>
    </div>
  )
}
