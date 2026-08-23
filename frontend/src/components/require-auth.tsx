import * as React from "react"
import { Navigate, useLocation } from "react-router-dom"

import { useAuth } from "@/lib/auth-context"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === "loading") {
    return (
      <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Загрузка…</p>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
