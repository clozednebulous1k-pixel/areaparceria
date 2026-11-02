/**
 * Utilitários de Segurança e Sanitização
 * Proteção contra XSS, Injection (SQL/NoSQL), caracteres maliciosos e validações estritas.
 */

// Regex para padrões perigosos comuns de SQL Injection
const SQL_INJECTION_PATTERN = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|DECLARE|CAST)\b)|(['"\\;]|--|\/\*|\*\/)/i

// Sanitiza strings de texto removendo tags perigosas, scripts e caracteres de controle
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input
    .trim()
    .replace(/[<>]/g, '') // Previne HTML injection básico
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Caracteres de controle ASCII
}

// Sanitiza e-mails
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return ''
  return email.trim().toLowerCase().replace(/[^\w.@+-]/g, '')
}

// Verifica se uma entrada possui assinaturas de SQL Injection
export function containsSqlInjection(input: string): boolean {
  if (!input) return false
  return SQL_INJECTION_PATTERN.test(input)
}

// Higieniza dados de Lead antes de persistir no banco de dados
export function sanitizeLeadPayload<T extends Record<string, any>>(data: T): T {
  const clean: Record<string, any> = {}
  for (const [key, val] of Object.entries(data)) {
    if (typeof val === 'string') {
      clean[key] = sanitizeText(val)
    } else {
      clean[key] = val
    }
  }
  return clean as T
}
