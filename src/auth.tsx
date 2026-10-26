import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type User = {
  name: string
  email: string
  isAdmin: boolean
}

type AuthCtx = {
  user: User | null
  login: (email: string, password: string, requireAdmin?: boolean) => string | null
  logout: () => void
  isAdmin: boolean
}

const KEY = 'area-auth'
const Ctx = createContext<AuthCtx | null>(null)

export type AdminCredential = {
  email: string
  passwordHash?: string
  addedAt: string
}

const ADMIN_STORAGE_KEY = 'area_admin_credentials'
const DEFAULT_ADMIN_EMAIL = 'areaadmin@gmail.com'
const DEFAULT_ADMIN_PASS = '#area2026'

export function getAdminCredentials(): Record<string, string> {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {}
  return {
    [DEFAULT_ADMIN_EMAIL]: DEFAULT_ADMIN_PASS,
    'admin@eletricaarea.com.br': '#area2026',
    'alesi@eletricaarea.com.br': '#area2026',
  }
}

export function saveAdminCredentials(creds: Record<string, string>) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(creds))
}

export function checkIsAdmin(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  const creds = getAdminCredentials()
  return (
    Boolean(creds[normalized]) ||
    normalized.startsWith('admin@') ||
    normalized.includes('admin') ||
    normalized === DEFAULT_ADMIN_EMAIL
  )
}

function readUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      ...parsed,
      isAdmin: parsed.isAdmin ?? checkIsAdmin(parsed.email),
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readUser())

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      isAdmin: Boolean(user?.isAdmin),
      login: (email, password, requireAdmin = false) => {
        const cleanEmail = email.trim().toLowerCase()
        if (!cleanEmail.includes('@') || password.length < 4) {
          return 'Informe um e-mail válido e senha com pelo menos 4 caracteres.'
        }

        const creds = getAdminCredentials()
        const isAdmin = checkIsAdmin(cleanEmail)

        // Se o login exigir perfil exclusivo de Administrador (para o CRM / Painel)
        if (requireAdmin && !isAdmin) {
          return 'Acesso negado: apenas administradores autorizados podem acessar o CRM Corporativo.'
        }

        // Validação de senha cadastrada para o admin
        if (creds[cleanEmail] && creds[cleanEmail] !== password) {
          return 'Senha incorreta para este usuário administrador.'
        }

        const next: User = {
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          isAdmin,
        }

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
