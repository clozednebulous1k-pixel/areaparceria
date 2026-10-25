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
    const msg = login(String(data.get('email') || ''), String(data.get('password') || ''))
    if (msg) setError(msg)
    else navigate('/dashboard')
  }

  return (
    <main className="auth-page">
      <form className="form auth-card" onSubmit={onSubmit}>
        <div className="section-index">Acesso</div>
        <h1>Entrar na AREA</h1>
        <p className="auth-lead">
          Acompanhe pedidos, orçamentos e o status das suas obras no painel.
        </p>
        <label>
          E-mail
          <input type="email" name="email" required placeholder="voce@empresa.com" />
        </label>
        <label>
          Senha
          <input type="password" name="password" required placeholder="••••••••" minLength={4} />
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button className="btn btn-navy" type="submit">
          Entrar
        </button>
        <p className="auth-hint">
          Demo: qualquer e-mail válido e senha com 4+ caracteres.
        </p>
        <Link to="/contato">Prefere pedir orçamento sem cadastro?</Link>
      </form>
    </main>
  )
}
