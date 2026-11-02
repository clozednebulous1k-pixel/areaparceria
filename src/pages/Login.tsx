import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    // Exige login exclusivo de Admin para acessar o Painel CRM / WhatsApp
    const msg = login(String(data.get('email') || ''), String(data.get('password') || ''), true)
    if (msg) setError(msg)
    else navigate('/dashboard')
  }

  return (
    <main className="auth-page">
      <form className="form auth-card" onSubmit={onSubmit} noValidate>
        <div className="section-index">Área Administrativa</div>
        <h1>CRM & Atendimento AREA</h1>
        <p className="auth-lead">
          Acesso restrito a administradores para gestão de leads, conexões do WhatsApp e suporte.
        </p>
        <label>
          E-mail de Administrador
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            placeholder="admin@eletricaarea.com.br"
          />
        </label>
        <label>
          Senha
          <div className="password-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              minLength={4}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button className="btn btn-navy" type="submit">
          Acessar CRM Admin
        </button>
        <p className="auth-hint">
          🛡️ Apenas contas com e-mail corporativo de administrador possuem acesso liberado.
        </p>
        <Link to="/contato">Dúvidas? Entre em contato com a equipe</Link>
      </form>
    </main>
  )
}
