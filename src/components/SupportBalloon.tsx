import { useState, type FormEvent } from 'react'
import {
  getWhatsAppConfig,
  saveLead,
  buildWhatsAppLink,
} from '../services/supportService'

export default function SupportBalloon() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('Dúvida sobre produtos')
  const [message, setMessage] = useState('')
  const [directMessage, setDirectMessage] = useState(
    'Olá! Gostaria de tirar uma dúvida sobre materiais elétricos e orçamentos da AREA.',
  )
  const [submitted, setSubmitted] = useState(false)
  const [mode, setMode] = useState<'form' | 'direct'>('form')

  const config = getWhatsAppConfig()

  const subjects = [
    'Dúvida sobre produtos',
    'Cotação e Orçamento de Obra',
    'Prazos e Entregas',
    'Especificação Técnica / Engenharia',
    'Outro assunto',
  ]

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    // Salvar o Lead no banco do Dashboard
    saveLead({
      name: name.trim(),
      phone: phone.trim(),
      subject,
      message: message.trim() || 'Solicitação de atendimento iniciada pelo balão de suporte.',
      source: 'widget',
    })

    setSubmitted(true)

    // Redireciona o cliente para o WhatsApp Corporativo com mensagem pronta
    const readyMessage = `*Olá, Equipe AREA! Solicitação de Atendimento*\n\n` +
      `👤 *Nome:* ${name.trim()}\n` +
      `📱 *Telefone:* ${phone.trim()}\n` +
      `📌 *Assunto:* ${subject}\n` +
      (message.trim() ? `💬 *Mensagem:* ${message.trim()}\n\n` : '\n') +
      `Gostaria de falar com um especialista.`

    const waLink = buildWhatsAppLink(config.corporateNumber, readyMessage)

    setTimeout(() => {
      window.open(waLink, '_blank', 'noopener,noreferrer')
    }, 900)
  }

  function handleDirectWhatsApp() {
    if (!directMessage.trim()) return

    // Salva intenção de contato rápido
    saveLead({
      name: 'Cliente Direto (WhatsApp)',
      phone: 'Via chat direto',
      subject: 'Atendimento Rápido WhatsApp',
      message: directMessage.trim(),
      source: 'direct',
    })

    const waLink = buildWhatsAppLink(config.corporateNumber, directMessage.trim())
    window.open(waLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="wa-balloon-container">
      {/* Balão Aberto */}
      {isOpen && (
        <div className="wa-modal-card" role="dialog" aria-modal="true">
          {/* Topo do Balão */}
          <div className="wa-modal-header">
            <div className="wa-avatar-box">
              <div className="wa-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.94 5.84L2.5 22l4.33-1.41C8.38 21.43 10.14 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                </svg>
              </div>
              <div className="wa-online-pulse"></div>
            </div>
            <div className="wa-header-info">
              <div className="wa-header-title">Suporte Corporativo AREA</div>
              <div className="wa-header-status">
                <span className="dot-active"></span> Online agora • Resposta rápida
              </div>
            </div>
            <button
              className="wa-btn-close"
              onClick={() => {
                setIsOpen(false)
                setSubmitted(false)
              }}
              title="Fechar balão"
              aria-label="Fechar suporte"
            >
              ✕
            </button>
          </div>

          {/* Abas Rápidas */}
          <div className="wa-tabs">
            <button
              type="button"
              className={`wa-tab-btn ${mode === 'form' ? 'active' : ''}`}
              onClick={() => setMode('form')}
            >
              Falar com Consultor
            </button>
            <button
              type="button"
              className={`wa-tab-btn ${mode === 'direct' ? 'active' : ''}`}
              onClick={() => setMode('direct')}
            >
              WhatsApp Direto
            </button>
          </div>

          {/* Conteúdo Aba Formulário / Lead */}
          {mode === 'form' ? (
            <div className="wa-modal-body">
              {submitted ? (
                <div className="wa-success-state">
                  <div className="wa-check-icon">✓</div>
                  <h4>Informações registradas!</h4>
                  <p>
                    Seus dados foram enviados para o nosso painel. Estamos redirecionando você para o WhatsApp corporativo com a mensagem pronta...
                  </p>
                  <div className="wa-redirect-hint">
                    Caso a janela não tenha aberto, clique abaixo:
                  </div>
                  <button
                    className="wa-btn-primary"
                    onClick={() => {
                      const msg = `*Olá, Equipe AREA!*\n👤 ${name}\n📱 ${phone}\n📌 ${subject}: ${message}`
                      window.open(buildWhatsAppLink(config.corporateNumber, msg), '_blank')
                    }}
                  >
                    Abrir conversa no WhatsApp
                  </button>
                  <button
                    className="wa-btn-secondary"
                    onClick={() => {
                      setSubmitted(false)
                      setName('')
                      setPhone('')
                      setMessage('')
                    }}
                  >
                    Enviar nova solicitação
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="wa-form">
                  <p className="wa-form-intro">
                    Preencha para gravar seus dados em nosso sistema e falar direto no WhatsApp com um especialista:
                  </p>

                  <label className="wa-label">
                    <span>Seu Nome *</span>
                    <input
                      type="text"
                      className="wa-input"
                      placeholder="Ex: João da Silva / Construtora"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>

                  <label className="wa-label">
                    <span>Telefone / WhatsApp *</span>
                    <input
                      type="tel"
                      className="wa-input"
                      placeholder="Ex: (15) 99876-5432"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>

                  <label className="wa-label">
                    <span>Assunto</span>
                    <select
                      className="wa-select"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="wa-label">
                    <span>Qual a sua dúvida ou necessidade?</span>
                    <textarea
                      className="wa-textarea"
                      rows={2}
                      placeholder="Ex: Preciso de cotação de cabos e eletrodutos para lote em SP..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </label>

                  <button type="submit" className="wa-btn-primary">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.17-1.33C8.6 21.49 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm.05 17c-1.55 0-3.03-.43-4.32-1.2l-.31-.18-3.07.8.82-2.99-.2-.33A7.94 7.94 0 0 1 4.05 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-7.95 8z"/>
                    </svg>
                    Gravar e Iniciar no WhatsApp
                  </button>
                  <span className="wa-safe-note">🔒 Seus dados serão gravados em nossa central de retorno.</span>
                </form>
              )}
            </div>
          ) : (
            /* Modo WhatsApp Direto com Mensagem Pronta */
            <div className="wa-modal-body">
              <div className="wa-direct-box">
                <div className="wa-bubble-preview">
                  <div className="wa-preview-tag">Mensagem Pronta Corporativa</div>
                  <textarea
                    className="wa-textarea wa-preview-text"
                    rows={4}
                    value={directMessage}
                    onChange={(e) => setDirectMessage(e.target.value)}
                  />
                  <div className="wa-preview-meta">
                    Será enviada para: <strong>{config.corporateNumber ? `+${config.corporateNumber}` : 'Central AREA'}</strong>
                  </div>
                </div>

                <div className="wa-quick-actions">
                  <div className="wa-quick-title">Sugestões de mensagens rápidas:</div>
                  <div className="wa-chips">
                    <button
                      type="button"
                      className="wa-chip"
                      onClick={() =>
                        setDirectMessage(
                          'Olá! Gostaria de solicitar um orçamento para materiais elétricos e conectividade.',
                        )
                      }
                    >
                      📑 Orçamento Rápido
                    </button>
                    <button
                      type="button"
                      className="wa-chip"
                      onClick={() =>
                        setDirectMessage(
                          'Olá! Preciso tirar uma dúvida sobre especificações técnicas de cabos e disjuntores.',
                        )
                      }
                    >
                      ⚡ Dúvida Técnica
                    </button>
                    <button
                      type="button"
                      className="wa-chip"
                      onClick={() =>
                        setDirectMessage(
                          'Olá! Gostaria de consultar o prazo e frete para entrega na minha obra.',
                        )
                      }
                    >
                      🚚 Prazos e Entrega
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="wa-btn-primary"
                  onClick={handleDirectWhatsApp}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.17-1.33C8.6 21.49 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm.05 17c-1.55 0-3.03-.43-4.32-1.2l-.31-.18-3.07.8.82-2.99-.2-.33A7.94 7.94 0 0 1 4.05 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-7.95 8z"/>
                  </svg>
                  Enviar Mensagem no WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botão Flutuante (Balão de Suporte WhatsApp) */}
      <button
        type="button"
        className={`wa-floating-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir suporte corporativo WhatsApp"
        title="Dúvidas? Fale conosco no WhatsApp"
      >
        <div className="wa-icon-glow"></div>
        {isOpen ? (
          <span className="wa-close-icon">✕</span>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.04 7.39C8.86 7.39 8.57 7.46 8.32 7.73C8.07 8 7.37 8.65 7.37 9.97C7.37 11.29 8.33 12.56 8.47 12.75C8.6 12.94 10.32 15.68 13.03 16.74C15.28 17.62 15.74 17.44 16.22 17.4C16.7 17.35 17.78 16.75 18.01 16.11C18.24 15.47 18.24 14.92 18.17 14.81C18.1 14.7 17.92 14.63 17.65 14.5C17.38 14.36 16.06 13.71 15.81 13.62C15.57 13.53 15.39 13.48 15.22 13.75C15.04 14.02 14.54 14.63 14.39 14.81C14.23 14.99 14.08 15.01 13.81 14.88C13.54 14.74 12.67 14.46 11.64 13.54C10.83 12.82 10.28 11.93 10.12 11.66C9.97 11.39 10.1 11.24 10.24 11.11C10.36 10.98 10.51 10.79 10.65 10.63C10.79 10.47 10.83 10.35 10.92 10.17C11.01 10 10.97 9.84 10.9 9.71C10.83 9.58 10.3 8.28 10.08 7.74C9.86 7.22 9.64 7.29 9.47 7.28C9.32 7.28 9.14 7.28 8.96 7.28L9.04 7.39Z"/>
            </svg>
            <span className="wa-badge-pulse">1</span>
            <span className="wa-teaser-tooltip">Dúvidas? Fale no WhatsApp</span>
          </>
        )}
      </button>
    </div>
  )
}
