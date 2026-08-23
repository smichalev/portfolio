import * as React from "react"

import { graphqlRequest } from "@/lib/graphql-client"

type AuthUser = {
  id: string
  email: string
  name: string
}

type AuthPayload = {
  accessToken: string
  user: AuthUser
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user { id email name }
    }
  }
`

const REFRESH_MUTATION = `
  mutation Refresh {
    refreshToken {
      accessToken
      user { id email name }
    }
  }
`

const LOGOUT_MUTATION = `
  mutation Logout {
    logout
  }
`

function decodeJwtExpiryMs(token: string): number | null {
  try {
    const payload = token.split(".")[1]
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: number
    }
    return typeof json.exp === "number" ? json.exp * 1000 : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>("loading")
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = React.useState<string | null>(null)
  const refreshTimer = React.useRef<number | null>(null)

  const clearRefreshTimer = React.useCallback(() => {
    if (refreshTimer.current !== null) {
      window.clearTimeout(refreshTimer.current)
      refreshTimer.current = null
    }
  }, [])

  const silentRefreshRef = React.useRef<() => Promise<void>>(async () => {})

  const scheduleRefresh = React.useCallback(
    (token: string) => {
      clearRefreshTimer()
      const expiresAt = decodeJwtExpiryMs(token)
      if (!expiresAt) return
      const delay = Math.max(expiresAt - Date.now() - 60_000, 5_000)
      refreshTimer.current = window.setTimeout(() => {
        void silentRefreshRef.current()
      }, delay)
    },
    [clearRefreshTimer]
  )

  const applyAuthPayload = React.useCallback(
    (payload: AuthPayload) => {
      setAccessToken(payload.accessToken)
      setUser(payload.user)
      setStatus("authenticated")
      scheduleRefresh(payload.accessToken)
    },
    [scheduleRefresh]
  )

  const silentRefresh = React.useCallback(async () => {
    try {
      const data = await graphqlRequest<{ refreshToken: AuthPayload }>(REFRESH_MUTATION)
      applyAuthPayload(data.refreshToken)
    } catch {
      setAccessToken(null)
      setUser(null)
      setStatus("unauthenticated")
    }
  }, [applyAuthPayload])

  silentRefreshRef.current = silentRefresh

  const hasInitiatedRefresh = React.useRef(false)

  React.useEffect(() => {
    // StrictMode mounts effects twice in dev; guard so the initial
    // silent refresh only ever fires once per real app load.
    if (!hasInitiatedRefresh.current) {
      hasInitiatedRefresh.current = true
      void silentRefresh()
    }
    return clearRefreshTimer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = React.useCallback(
    async (email: string, password: string) => {
      const data = await graphqlRequest<{ login: AuthPayload }>(LOGIN_MUTATION, {
        input: { email, password },
      })
      applyAuthPayload(data.login)
    },
    [applyAuthPayload]
  )

  const logout = React.useCallback(async () => {
    try {
      await graphqlRequest(LOGOUT_MUTATION, undefined, accessToken)
    } finally {
      clearRefreshTimer()
      setAccessToken(null)
      setUser(null)
      setStatus("unauthenticated")
    }
  }, [accessToken, clearRefreshTimer])

  const value = React.useMemo<AuthContextValue>(
    () => ({ status, user, accessToken, login, logout }),
    [status, user, accessToken, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
