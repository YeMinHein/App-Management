"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { App } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw } from "lucide-react"

interface AppFormProps {
  app?: App | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<boolean>
}

export function AppForm({ app, isOpen, onClose, onSubmit }: AppFormProps) {
  const [appTitle, setAppTitle] = useState("")
  const [appKey, setAppKey] = useState("")
  const [appEnv, setAppEnv] = useState<"development" | "staging" | "production">("development")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [generatingKey, setGeneratingKey] = useState(false)

  const isEditing = !!app

  useEffect(() => {
    if (app) {
      setAppTitle(app.appTitle)
      setAppKey(app.appKey)
      setAppEnv(app.appEnv)
    } else {
      setAppTitle("")
      setAppKey("")
      setAppEnv("development")
    }
    setError("")
  }, [app, isOpen])

  const generateNewKey = async () => {
    setGeneratingKey(true)
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/apps/generate-key", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAppKey(data.appKey)
      }
    } catch (err) {
      console.error("Failed to generate key:", err)
    } finally {
      setGeneratingKey(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = await onSubmit({
      appTitle,
      appKey,
      appEnv,
    })

    if (success) {
      onClose()
    } else {
      setError("Failed to save app. Please try again.")
    }

    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit App" : "Create New App"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the app details below." : "Fill in the details to create a new app."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="appTitle">App Title</Label>
              <Input
                id="appTitle"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
                placeholder="Enter app title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="appEnv">Environment</Label>
              <Select value={appEnv} onValueChange={(value: any) => setAppEnv(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="appKey">App Key</Label>
                <Button type="button" variant="outline" size="sm" onClick={generateNewKey} disabled={generatingKey}>
                  <RefreshCw className={`h-3 w-3 mr-1 ${generatingKey ? "animate-spin" : ""}`} />
                  Generate
                </Button>
              </div>
              <Input
                id="appKey"
                value={appKey}
                onChange={(e) => setAppKey(e.target.value)}
                placeholder="Enter or generate app key"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update App" : "Create App"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
