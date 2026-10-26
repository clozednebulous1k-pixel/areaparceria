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

// Lista de e-mails de administradores permitidos (configurável via env ou defaults corporativos)
function getAdminEmails(): string[] {
  const envAdmins = import.meta.env.VITE_ADMIN_EMAILS
  if (envAdmins) {
    return envAdmins.split(',').map((e: string) => e.trim().toLowerCase())
  }
  return [
    'admin@eletricaarea.com.br',
    'alesi@eletricaarea.com.br',
    'admin@admin.com',
    'suporte@eletricaarea.com.br',
  ]
}

export function checkIsAdmin(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  const admins = getAdminEmails()
  return admins.includes(normalized) || normalized.startsWith('admin@') || normalized.includes('admin')
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

        const isAdmin = checkIsAdmin(cleanEmail)

        // Se o login exigir perfil exclusivo de Administrador (para o CRM / Painel)
        if (requireAdmin && !isAdmin) {
          return 'Acesso negado: apenas administradores autorizados podem acessar o CRM Corporativo.'
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
