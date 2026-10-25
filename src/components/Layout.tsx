import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import { contact } from '../data'

const links = [
  { to: '/', label: 'Projeto', hash: 'projeto' },
  { to: '/solucoes', label: 'Materiais' },
  { to: '/unidades', label: 'Unidades' },
  { to: '/a-area', label: 'A AREA' },
  { to: '/contato', label: 'Contato' },
] as { to: string; label: string; hash?: string }[]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <header className="header">
        <div className="wrap">
          <div className="header-row intro-bar">
            <NavLink to="/" className="brand intro-logo" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="AREA Material Elétrico" />
            </NavLink>
            <div className="nav-shell intro-menu">
              <nav className="nav">
                {links.map((l) => (
                  <NavLink
                    key={l.label}
                    to={l.hash ? { pathname: l.to, hash: l.hash } : l.to}
                    end={l.to === '/'}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <div className="header-actions">
                <NavLink to={user ? '/dashboard' : '/login'} className="btn btn-outline">
                  {user ? 'Pedidos' : 'Login'}
                </NavLink>
                <NavLink to="/contato" className="btn btn-navy">
                  Cotar projeto
                </NavLink>
              </div>
            </div>
            <button
              className="menu-btn"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              type="button"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                  <path d="M1 1h18M1 7h18M1 13h18" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
          {open ? (
            <nav className="mobile-nav open">
              {links.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.hash ? { pathname: l.to, hash: l.hash } : l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
              <NavLink to={user ? '/dashboard' : '/login'} onClick={() => setOpen(false)}>
                {user ? 'Pedidos' : 'Login'}
              </NavLink>
              <NavLink to="/contato" className="btn btn-navy" onClick={() => setOpen(false)}>
                Cotar projeto
              </NavLink>
            </nav>
          ) : null}
        </div>
      </header>
      <Outlet />
      <footer className="footer">
        <span className="footer-mark" aria-hidden="true">
          AREA
        </span>
        <div className="wrap footer-grid">
          <div>
            <img src="/logo.png" alt="AREA" />
            <p>
              Fornecedor de materiais elétricos, rede e infraestrutura para obras
              de conectividade — com atendimento nacional.
            </p>
            <p>{contact.address}</p>
          </div>
          <div>
            <h4>Site</h4>
            {links.map((l) => (
              <NavLink key={l.label} to={l.to}>
                {l.label}
              </NavLink>
            ))}
          </div>
          <div>
            <h4>Atendimento</h4>
            <p>{contact.hours}</p>
            <a href="tel:08002644022">{contact.phone}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <div>
            <h4>Unidades</h4>
            <p>São Paulo · Sorocaba · Mogi Guaçu</p>
            <p>Praia Grande · Manaus · Joinville</p>
            <NavLink to="/unidades">Ver lojas</NavLink>
          </div>
        </div>
        <div className="wrap legal">
          <span>© {new Date().getFullYear()} AREA Material Elétrico</span>
          <span>CNPJ {contact.cnpj}</span>
        </div>
      </footer>
    </>
  )
}
