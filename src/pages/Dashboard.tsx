import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth'
import {
  fetchLeads,
  getStoredLeads,
  updateLeadStatus,
  deleteLead,
  getWhatsAppConfig,
  saveWhatsAppConfig,
  buildWhatsAppLink,
  cleanPhone,
  type SupportLead,
  type WhatsAppConfig,
} from '../services/supportService'
import { isFirebaseConfigured } from '../firebase'

const orders = [
  { id: 'AR-10482', date: '22/10/2026', client: 'Obra Campolim', status: 'Em separação', tone: 'separacao', total: 'R$ 4.890,00' },
  { id: 'AR-10461', date: '18/10/2026', client: 'Residencial Lapa', status: 'Faturado', tone: 'faturado', total: 'R$ 1.240,50' },
  { id: 'AR-10422', date: '09/10/2026', client: 'Shopping Mogi', status: 'Entregue', tone: 'entregue', total: 'R$ 18.320,00' },
  { id: 'AR-10390', date: '28/09/2026', client: 'Loja Praia Grande', status: 'Entregue', tone: 'entregue', total: 'R$ 670,90' },
]

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth()

  const [activeTab, setActiveTab] = useState<'leads' | 'whatsapp' | 'orders'>('leads')
  const [leads, setLeads] = useState<SupportLead[]>(() => getStoredLeads())
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [config, setConfig] = useState<WhatsAppConfig>(getWhatsAppConfig())
  
  // WhatsApp QR Code simulator state
  const [qrStep, setQrStep] = useState<'disconnected' | 'pairing' | 'connected'>(
    config.isConnected ? 'connected' : 'disconnected'
  )
  const [pairingTimer, setPairingTimer] = useState<number>(30)
  const [phoneForQR, setPhoneForQR] = useState(config.corporateNumber || '551530327900')
  const [customMsgTemplate, setCustomMsgTemplate] = useState(config.defaultGreeting)

  useEffect(() => {
    async function load() {
      const data = await fetchLeads()
      setLeads(data)
    }
    load()
  }, [])

  // Atualizar contagem regressiva se estiver pareando
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (qrStep === 'pairing') {
      interval = setInterval(() => {
        setPairingTimer((prev) => {
          if (prev <= 1) {
            return 30
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [qrStep])

  // Apenas Administradores podem acessar o CRM Corporativo
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) {
    return (
      <main className="section">
        <div className="wrap text-center" style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2>Acesso Restrito ao CRM</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            A conta <strong>{user.email}</strong> não possui privilégios de administrador para gerenciar o WhatsApp e os Leads.
          </p>
          <button className="btn btn-navy" type="button" onClick={logout}>
            Sair e Entrar como Admin
          </button>
        </div>
      </main>
    )
  }

  async function handleStatusChange(id: string, newStatus: SupportLead['status']) {
    const updated = await updateLeadStatus(id, newStatus)
    setLeads(updated)
  }

  async function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir este atendimento da lista?')) {
      const updated = await deleteLead(id)
      setLeads(updated)
    }
  }

  function handleCallWhatsApp(lead: SupportLead) {
    const msg = `Olá ${lead.name}, tudo bem? Aqui é da equipe AREA Material Elétrico!\n\n` +
      `Recebemos sua mensagem em nosso portal sobre: "${lead.subject}".\n` +
      `Como posso te ajudar com o seu projeto elétrico hoje?`
    
    // Atualiza status para 'chamado' ou 'em_atendimento' automaticamente
    if (lead.status === 'novo') {
      handleStatusChange(lead.id, 'em_atendimento')
    }

    const link = buildWhatsAppLink(lead.phone, msg)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  async function handleSaveWaConfig() {
    const updated = await saveWhatsAppConfig({
      corporateNumber: cleanPhone(phoneForQR),
      defaultGreeting: customMsgTemplate,
    })
    setConfig(updated)
    alert('Configurações do WhatsApp Corporativo salvas com sucesso!')
  }

  function handleSimulateConnect() {
    setQrStep('pairing')
  }

  async function handleConfirmPairing() {
    const updated = await saveWhatsAppConfig({
      isConnected: true,
      connectedAt: new Date().toLocaleString('pt-BR'),
      connectedNumber: phoneForQR,
    })
    setConfig(updated)
    setQrStep('connected')
  }

  async function handleDisconnect() {
    if (window.confirm('Deseja desconectar a sessão do WhatsApp Corporativo?')) {
      const updated = await saveWhatsAppConfig({
        isConnected: false,
        connectedAt: undefined,
        connectedNumber: undefined,
      })
      setConfig(updated)
      setQrStep('disconnected')
    }
  }

  const filteredLeads = leads.filter((item) => {
    const matchesStatus = filterStatus === 'todos' || item.status === filterStatus
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(term) ||
      item.phone.includes(term) ||
      item.subject.toLowerCase().includes(term) ||
      item.message.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })

  const newLeadsCount = leads.filter((l) => l.status === 'novo').length

  return (
    <main className="section dash-container">
      <div className="wrap">
        {/* Topo do Dashboard */}
        <div className="dash-head">
          <div>
            <div className="section-index">Painel Corporativo</div>
            <h1 className="dash-title">Central de Atendimento & Pedidos</h1>
            <p>Gerencie orçamentos, chamados do WhatsApp e configurações de atendimento.</p>
          </div>
          <div className="dash-top-actions">
            <span className="dash-user-badge admin">
              <span className="dot-online"></span> Admin: {user.name}
            </span>
            <span className={`db-status-badge ${isFirebaseConfigured ? 'firebase' : 'local'}`}>
              {isFirebaseConfigured ? '🔥 Firebase Firestore Ativo' : '💾 Banco Local (Pronto p/ Firebase)'}
            </span>
            <button className="btn btn-outline" type="button" onClick={logout}>
              Sair
            </button>
          </div>
        </div>

        {/* Abas do Dashboard */}
        <div className="dash-nav-tabs">
          <button
            type="button"
            className={`dash-tab-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <span className="dash-tab-icon">📥</span>
            Atendimentos & Clientes
            {newLeadsCount > 0 && <span className="dash-badge-count">{newLeadsCount} novos</span>}
          </button>
          <button
            type="button"
            className={`dash-tab-item ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <span className="dash-tab-icon">📱</span>
            Conectar WhatsApp (QR Code)
            {config.isConnected ? (
              <span className="dash-badge-status-on">Conectado</span>
            ) : (
              <span className="dash-badge-status-off">Desconectado</span>
            )}
          </button>
          <button
            type="button"
            className={`dash-tab-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="dash-tab-icon">📦</span>
            Pedidos & Faturamento
          </button>
        </div>

        {/* ABA 1: LEADS & ATENDIMENTOS DO BALÃO */}
        {activeTab === 'leads' && (
          <div className="dash-tab-content">
            <div className="dash-leads-toolbar">
              <div className="dash-filters-group">
                <input
                  type="text"
                  className="dash-search-input"
                  placeholder="Buscar por cliente, telefone ou assunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="dash-filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="todos">Todos os Status</option>
                  <option value="novo">Novos Pendentes</option>
                  <option value="em_atendimento">Em Atendimento</option>
                  <option value="chamado">Já Chamados</option>
                  <option value="finalizado">Finalizados</option>
                </select>
              </div>

              <div className="dash-metrics-cards">
                <div className="metric-card">
                  <span className="metric-label">Total Registrados</span>
                  <strong className="metric-value">{leads.length}</strong>
                </div>
                <div className="metric-card alert">
                  <span className="metric-label">Aguardando Retorno</span>
                  <strong className="metric-value">{newLeadsCount}</strong>
                </div>
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="dash-empty-state">
                <div className="empty-icon">📭</div>
                <h3>Nenhum cliente encontrado</h3>
                <p>Assim que os clientes preencherem o balão no site, as informações aparecerão aqui para você chamar no WhatsApp.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="orders dash-leads-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Telefone / Contato</th>
                      <th>Assunto & Dúvida</th>
                      <th>Data / Hora</th>
                      <th>Origem</th>
                      <th>Status</th>
                      <th>Ação Rápida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((item) => (
                      <tr key={item.id} className={item.status === 'novo' ? 'row-highlight' : ''}>
                        <td>
                          <strong>{item.name}</strong>
                          {item.email && <div className="dash-subtext">{item.email}</div>}
                        </td>
                        <td>
                          <div className="phone-tag">{item.phone}</div>
                        </td>
                        <td style={{ maxWidth: '320px' }}>
                          <span className="subject-pill">{item.subject}</span>
                          <p className="lead-msg-snippet" title={item.message}>
                            {item.message}
                          </p>
                        </td>
                        <td>
                          <span className="dash-time-str">
                            {new Date(item.createdAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td>
                          <span className={`pill-source ${item.source}`}>
                            {item.source === 'widget' ? 'Balão Flutuante' : 'Formulário Site'}
                          </span>
                        </td>
                        <td>
                          <select
                            className={`status-select status-${item.status}`}
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(item.id, e.target.value as SupportLead['status'])
                            }
                          >
                            <option value="novo">Novo</option>
                            <option value="em_atendimento">Em Atendimento</option>
                            <option value="chamado">Já Chamado</option>
                            <option value="finalizado">Finalizado</option>
                          </select>
                        </td>
                        <td>
                          <div className="dash-action-buttons">
                            <button
                              type="button"
                              className="btn-wa-call"
                              onClick={() => handleCallWhatsApp(item)}
                              title="Abrir WhatsApp pronto para conversar com este cliente"
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.17-1.33C8.6 21.49 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm.05 17c-1.55 0-3.03-.43-4.32-1.2l-.31-.18-3.07.8.82-2.99-.2-.33A7.94 7.94 0 0 1 4.05 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-7.95 8z"/>
                              </svg>
                              Chamar no WhatsApp
                            </button>
                            <button
                              type="button"
                              className="btn-delete-lead"
                              onClick={() => handleDelete(item.id)}
                              title="Excluir lead"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ABA 2: CONECTAR WHATSAPP CORPORATIVO COM QR CODE */}
        {activeTab === 'whatsapp' && (
          <div className="dash-tab-content">
            <div className="wa-setup-grid">
              {/* Cartão de Pareamento QR CODE */}
              <div className="wa-qr-card">
                <div className="wa-qr-header">
                  <h3>Integração WhatsApp Web / API Corporativa</h3>
                  <p>Escaneie o QR Code com o aplicativo WhatsApp no seu celular para vincular o atendimento.</p>
                </div>

                {qrStep === 'disconnected' && (
                  <div className="wa-qr-box">
                    <div className="wa-qr-placeholder">
                      <div className="wa-qr-mock-code">
                        {/* Simulação gráfica de QR Code com logo no meio */}
                        <svg viewBox="0 0 160 160" width="160" height="160" className="qr-svg-mock">
                          <rect width="160" height="160" fill="#ffffff" rx="8" />
                          <path d="M15 15h40v40h-40z M25 25h20v20h-20z M105 15h40v40h-40z M115 25h20v20h-20z M15 105h40v40h-40z M25 115h20v20h-20z M65 20h30v15h-30z M70 45h20v20h-20z M20 65h25v30h-25z M55 65h20v20h-20z M85 65h35v15h-35z M130 65h15v25h-15z M65 95h15v25h-15z M90 90h25v20h-25z M125 100h20v20h-20z M65 130h45v15h-45z M120 130h25v15h-25z" fill="#0a2a5c" />
                          <circle cx="80" cy="80" r="18" fill="#25D366" />
                          <path d="M74 74h12v12h-12z" fill="#ffffff" />
                        </svg>
                        <div className="qr-overlay-lock">
                          <span>Clique para gerar QR Code</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-navy wa-start-pair-btn"
                      onClick={handleSimulateConnect}
                    >
                      Gerar QR Code de Conexão
                    </button>
                  </div>
                )}

                {qrStep === 'pairing' && (
                  <div className="wa-qr-box active-pairing">
                    <div className="wa-qr-placeholder live">
                      {/* Simulação animada de leitura do QR code */}
                      <div className="qr-scan-line"></div>
                      <svg viewBox="0 0 160 160" width="180" height="180" className="qr-svg-mock">
                        <rect width="160" height="160" fill="#ffffff" rx="8" />
                        <path d="M15 15h40v40h-40z M25 25h20v20h-20z M105 15h40v40h-40z M115 25h20v20h-20z M15 105h40v40h-40z M25 115h20v20h-20z M65 20h30v15h-30z M70 45h20v20h-20z M20 65h25v30h-25z M55 65h20v20h-20z M85 65h35v15h-35z M130 65h15v25h-15z M65 95h15v25h-15z M90 90h25v20h-25z M125 100h20v20h-20z M65 130h45v15h-45z M120 130h25v15h-25z" fill="#0a2a5c" />
                        <circle cx="80" cy="80" r="18" fill="#25D366" />
                        <path d="M76 73l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none" />
                      </svg>
                    </div>

                    <div className="wa-countdown-box">
                      Código expira em: <strong>{pairingTimer}s</strong>
                    </div>

                    <div className="wa-instructions-list">
                      <ol>
                        <li>Abra o WhatsApp no seu smartphone</li>
                        <li>Toque em <strong>Aparelhos conectados</strong> &gt; <strong>Conectar um aparelho</strong></li>
                        <li>Aponte a câmera para esta tela</li>
                      </ol>
                    </div>

                    <div className="wa-pairing-actions">
                      <button
                        type="button"
                        className="btn btn-navy"
                        onClick={handleConfirmPairing}
                      >
                        ✓ Simular Conexão Concluída
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setQrStep('disconnected')}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {qrStep === 'connected' && (
                  <div className="wa-qr-box is-connected">
                    <div className="connected-badge">
                      <div className="connected-icon">✓</div>
                      <h4>WhatsApp Conectado com Sucesso!</h4>
                      <p>
                        Sua conta corporativa <strong>+{phoneForQR}</strong> está sincronizada.
                      </p>
                      <div className="connected-timestamp">
                        Conectado em: {config.connectedAt || 'Hoje'}
                      </div>
                    </div>

                    <div className="wa-status-features">
                      <div className="feature-check">⚡ Redirecionamento instantâneo do balão ativo</div>
                      <div className="feature-check">💬 Mensagens pré-configuradas para o cliente</div>
                      <div className="feature-check">📥 Gravação automática dos leads no painel</div>
                    </div>

                    <div className="wa-connected-actions">
                      <button
                        type="button"
                        className="btn btn-outline danger"
                        onClick={handleDisconnect}
                      >
                        Desconectar Aparelho
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Formulário de Configurações Corporativas */}
              <div className="wa-settings-card">
                <h3>Configurações de Atendimento</h3>
                <p>Personalize o número para onde o balão do site enviará os clientes e as mensagens prontas.</p>

                <div className="settings-field">
                  <label>Número do WhatsApp Corporativo (com DDD)</label>
                  <input
                    type="text"
                    className="wa-input"
                    value={phoneForQR}
                    onChange={(e) => setPhoneForQR(e.target.value)}
                    placeholder="Ex: 551530327900 ou 5508002644022"
                  />
                  <small>Exemplo: 551530327900 (55 = Brasil, 15 = DDD Sorocaba)</small>
                </div>

                <div className="settings-field">
                  <label>Mensagem Padrão de Saudação</label>
                  <textarea
                    className="wa-textarea"
                    rows={3}
                    value={customMsgTemplate}
                    onChange={(e) => setCustomMsgTemplate(e.target.value)}
                    placeholder="Mensagem que chega pronta na tela do WhatsApp do cliente..."
                  />
                </div>

                <div className="settings-field">
                  <label>Status do Servidor WhatsApp</label>
                  <div className="server-status-box">
                    <div className="status-indicator online"></div>
                    <div>
                      <strong>Gateway de Mensagens Web: Operacional</strong>
                      <div className="dash-subtext">Protocolo HTTPS wa.me / Multi-Device Ready</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-navy"
                  style={{ width: '100%', marginTop: '16px' }}
                  onClick={handleSaveWaConfig}
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: PEDIDOS EXISTENTES */}
        {activeTab === 'orders' && (
          <div className="dash-tab-content">
            <div className="table-wrap">
              <table className="orders">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Data</th>
                    <th>Cliente / obra</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.date}</td>
                      <td>{o.client}</td>
                      <td>
                        <span className={`pill status-${o.tone}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>{o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
