import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

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
      <form className="form auth-card" onSubmit={onSubmit}>
        <div className="section-index">Área Administrativa</div>
        <h1>CRM & Atendimento AREA</h1>
        <p className="auth-lead">
          Acesso restrito a administradores para gestão de leads, conexões do WhatsApp e suporte.
        </p>
        <label>
          E-mail de Administrador
          <input type="email" name="email" required placeholder="admin@eletricaarea.com.br" />
        </label>
        <label>
          Senha
          <input type="password" name="password" required placeholder="••••••••" minLength={4} />
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
