"use client"

import { useState } from "react"
import type { App } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AppTableProps {
  apps: App[]
  onEdit: (app: App) => void
  onDelete: (appId: string) => void
  onView: (app: App) => void
}

export function AppTable({ apps, onEdit, onDelete, onView }: AppTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = async (text: string, appId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(appId)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "staging":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "development":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg">No apps found</div>
        <div className="text-sm text-muted-foreground mt-2">Create your first app to get started</div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>App Title</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>App Key</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => (
            <TableRow key={app.appID}>
              <TableCell className="font-medium">{app.appTitle}</TableCell>
              <TableCell>
                <Badge className={getEnvironmentColor(app.appEnv)}>{app.appEnv}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">{app.appKey.substring(0, 8)}...</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(app.appKey, app.appID)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {copiedKey === app.appID && <span className="text-xs text-green-600">Copied!</span>}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(app.createdDate), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(app)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(app)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(app.appID)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
