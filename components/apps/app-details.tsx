"use client"

import type { App } from "@/lib/database"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Calendar, Key, Tag, User } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useState } from "react"

interface AppDetailsProps {
  app: App | null
  isOpen: boolean
  onClose: () => void
}

export function AppDetails({ app, isOpen, onClose }: AppDetailsProps) {
  const [copiedKey, setCopiedKey] = useState(false)

  if (!app) return null

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production":
        return "bg-red-100 text-red-800"
      case "staging":
        return "bg-yellow-100 text-yellow-800"
      case "development":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {app.appTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Environment</span>
              </div>
              <Badge className={getEnvironmentColor(app.appEnv)}>{app.appEnv}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">App Key</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-3 py-1 rounded font-mono">{app.appKey}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(app.appKey)}>
                  <Copy className="h-3 w-3" />
                  {copiedKey ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created By</span>
              </div>
              <span className="text-sm text-muted-foreground">{app.loginUser}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created Date</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{format(new Date(app.createdDate), "MMM dd, yyyy")}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(app.createdDate), { addSuffix: true })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">App ID</span>
              </div>
              <code className="text-sm bg-muted px-2 py-1 rounded">{app.appID}</code>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
