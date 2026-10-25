import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type User = { name: string; email: string }

type AuthCtx = {
  user: User | null
  login: (email: string, password: string) => string | null
  logout: () => void
}

const KEY = 'area-auth'
const Ctx = createContext<AuthCtx | null>(null)

function readUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readUser())

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      login: (email, password) => {
        if (!email.includes('@') || password.length < 4) {
          return 'Informe um e-mail válido e senha com pelo menos 4 caracteres.'
        }
        const next = { name: email.split('@')[0], email }
        localStorage.setItem(KEY, JSON.stringify(next))
        setUser(next)
        return null
      },
      logout: () => {
        localStorage.removeItem(KEY)
        setUser(null)
      },
    }),
    [user],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('AuthProvider ausente')
  return ctx
}
