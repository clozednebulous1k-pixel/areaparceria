import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth'
import {
  fetchLeads,
  getStoredLeads,
  saveLead,
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
import WhatsAppChatModal from '../components/WhatsAppChatModal'
import {
  createOrConnectEvolutionInstance,
  sendWhatsAppMessage,
  checkEvolutionConnection,
  logoutEvolutionInstance,
} from '../services/evolutionService'
import {
  getAdminCredentials,
  saveAdminCredentials,
} from '../auth'

const orders = [
  { id: 'AR-10482', date: '22/10/2026', client: 'Obra Campolim', status: 'Em separação', tone: 'separacao', total: 'R$ 4.890,00' },
  { id: 'AR-10461', date: '18/10/2026', client: 'Residencial Lapa', status: 'Faturado', tone: 'faturado', total: 'R$ 1.240,50' },
  { id: 'AR-10422', date: '09/10/2026', client: 'Shopping Mogi', status: 'Entregue', tone: 'entregue', total: 'R$ 18.320,00' },
  { id: 'AR-10390', date: '28/09/2026', client: 'Loja Praia Grande', status: 'Entregue', tone: 'entregue', total: 'R$ 670,90' },
]

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth()

  const [activeTab, setActiveTab] = useState<'leads' | 'whatsapp' | 'orders' | 'admins'>('leads')
  const [leads, setLeads] = useState<SupportLead[]>(() => getStoredLeads())
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [config, setConfig] = useState<WhatsAppConfig>(getWhatsAppConfig())
  const [chatLead, setChatLead] = useState<SupportLead | null>(null)
  const [evolutionQrCode, setEvolutionQrCode] = useState<string | null>(null)
  const [isCallingAuto, setIsCallingAuto] = useState<string | null>(null)

  // Modal para Adicionar Cliente Manualmente
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientCnpj, setNewClientCnpj] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newClientDest, setNewClientDest] = useState('')
  const [newClientMat, setNewClientMat] = useState('')
  const [newClientMsg, setNewClientMsg] = useState('')

  // Gestão de Administradores & Senhas
  const [adminList, setAdminList] = useState<Record<string, string>>(() => getAdminCredentials())
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPass, setNewAdminPass] = useState('')
  const [editAdminEmail, setEditAdminEmail] = useState('')
  const [editAdminNewPass, setEditAdminNewPass] = useState('')
  const [adminNotice, setAdminNotice] = useState<string | null>(null)
  
  // WhatsApp QR Code real state
  const [qrStep, setQrStep] = useState<'disconnected' | 'pairing' | 'connected'>(
    config.isConnected ? 'connected' : 'disconnected'
  )
  const [phoneForQR, setPhoneForQR] = useState(config.corporateNumber || '551530327900')
  const [customMsgTemplate, setCustomMsgTemplate] = useState(config.defaultGreeting)

  useEffect(() => {
    async function load() {
      const data = await fetchLeads()
      setLeads(data)
    }
    load()
  }, [])

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

  // Chamar cliente AUTOMATICAMENTE via Evolution API na VPS
  async function handleAutoCallCustomer(lead: SupportLead) {
    setIsCallingAuto(lead.id)
    const msg = `Olá ${lead.name}, tudo bem? Aqui é da equipe AREA Material Elétrico!\n\n` +
      `Recebemos sua mensagem em nosso portal sobre: "${lead.subject}".\n` +
      `Como posso te ajudar com o seu projeto elétrico hoje?`

    await sendWhatsAppMessage(lead.phone, msg, lead.id, 'AREA Central')

    if (lead.status === 'novo') {
      handleStatusChange(lead.id, 'chamado')
    }

    setIsCallingAuto(null)
    setChatLead(lead) // Abre a janela de chat com o histórico da conversa
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

  // Gerar QR Code Real e checar conexão
  async function handleConnectWhatsApp() {
    setQrStep('pairing')
    setEvolutionQrCode(null)

    try {
      const conn = await createOrConnectEvolutionInstance()
      if (conn.status === 'open') {
        setQrStep('connected')
        const updated = await saveWhatsAppConfig({
          isConnected: true,
          connectedAt: new Date().toLocaleString('pt-BR'),
        })
        setConfig(updated)
        return
      }

      if (conn.qrcode) {
        setEvolutionQrCode(conn.qrcode)
      }
    } catch (err) {
      console.error('Erro ao conectar WhatsApp:', err)
    }
  }

  // Monitorar se o usuário leu o QR Code no celular a cada 3 segundos
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined
    if (qrStep === 'pairing') {
      timer = setInterval(async () => {
        const isConnected = await checkEvolutionConnection()
        if (isConnected) {
          setQrStep('connected')
          setEvolutionQrCode(null)
          const updated = await saveWhatsAppConfig({
            isConnected: true,
            connectedAt: new Date().toLocaleString('pt-BR'),
            connectedNumber: phoneForQR,
          })
          setConfig(updated)
          alert('🎉 WhatsApp conectado com sucesso via QR Code!')
        }
      }, 3000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [qrStep, phoneForQR])

  // Desconectar Sessão Real
  async function handleDisconnect() {
    if (window.confirm('Deseja realmente desconectar a sessão do WhatsApp na Evolution API?')) {
      await logoutEvolutionInstance()
      const updated = await saveWhatsAppConfig({
        isConnected: false,
        connectedAt: undefined,
        connectedNumber: undefined,
      })
      setConfig(updated)
      setQrStep('disconnected')
      setEvolutionQrCode(null)
    }
  }

  // 1. Cadastrar Novo Cliente Manualmente
  async function handleAddManualClient(e: React.FormEvent) {
    e.preventDefault()
    if (!newClientName.trim() || !newClientPhone.trim()) {
      alert('Informe ao menos o Nome e Telefone do cliente.')
      return
    }

    const created = await saveLead({
      name: newClientName.trim(),
      phone: newClientPhone.trim(),
      cnpj: newClientCnpj.trim() || undefined,
      destination: newClientDest.trim() || undefined,
      materialType: newClientMat.trim() || undefined,
      subject: newClientMat ? `Material: ${newClientMat.trim()}` : 'Cliente Cadastrado Manualmente',
      message: newClientMsg.trim() || `Material: ${newClientMat || '-'} | Destino: ${newClientDest || '-'}`,
      source: 'direct',
    })

    setLeads([created, ...leads])
    setIsAddClientOpen(false)
    setNewClientName('')
    setNewClientCnpj('')
    setNewClientPhone('')
    setNewClientDest('')
    setNewClientMat('')
    setNewClientMsg('')
    alert('✅ Cliente adicionado com sucesso!')
  }

  // 2. Adicionar Novo Administrador
  function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault()
    const email = newAdminEmail.trim().toLowerCase()
    if (!email.includes('@') || newAdminPass.length < 4) {
      alert('Informe um e-mail válido e senha com pelo menos 4 dígitos.')
      return
    }

    const updated = { ...adminList, [email]: newAdminPass }
    saveAdminCredentials(updated)
    setAdminList(updated)
    setNewAdminEmail('')
    setNewAdminPass('')
    setAdminNotice(`✅ Novo administrador ${email} adicionado com sucesso!`)
    setTimeout(() => setAdminNotice(null), 4000)
  }

  // 3. Alterar Senha de Administrador Existente
  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!editAdminEmail || editAdminNewPass.length < 4) {
      alert('Selecione um administrador e defina a nova senha (mínimo 4 caracteres).')
      return
    }

    const updated = { ...adminList, [editAdminEmail]: editAdminNewPass }
    saveAdminCredentials(updated)
    setAdminList(updated)
    setEditAdminNewPass('')
    setAdminNotice(`🔑 Senha do administrador ${editAdminEmail} alterada com sucesso!`)
    setTimeout(() => setAdminNotice(null), 4000)
  }

  // 4. Remover Administrador
  function handleRemoveAdmin(emailToRemove: string) {
    if (emailToRemove === 'areaadmin@gmail.com') {
      alert('O administrador principal da AREA não pode ser removido.')
      return
    }
    if (window.confirm(`Deseja remover o acesso de administrador de ${emailToRemove}?`)) {
      const updated = { ...adminList }
      delete updated[emailToRemove]
      saveAdminCredentials(updated)
      setAdminList(updated)
      setAdminNotice(`🗑️ Administrador ${emailToRemove} removido.`)
      setTimeout(() => setAdminNotice(null), 4000)
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
          <button
            type="button"
            className={`dash-tab-item ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            <span className="dash-tab-icon">🛡️</span>
            Admins & Senhas
          </button>
        </div>

        {/* ABA 1: LEADS & ATENDIMENTOS DO BALÃO */}
        {activeTab === 'leads' && (
          <div className="dash-tab-content">
            <div className="dash-leads-toolbar">
              <div className="dash-filters-group">
                <button
                  type="button"
                  className="btn btn-navy btn-add-client"
                  onClick={() => setIsAddClientOpen(true)}
                >
                  ➕ Adicionar Cliente
                </button>
                <input
                  type="text"
                  className="dash-search-input"
                  placeholder="Buscar por cliente, CNPJ, destino ou material..."
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
                      <th>Cliente & CNPJ</th>
                      <th>Telefone / Contato</th>
                      <th>Destino (Obra / UF)</th>
                      <th>Material Solicitado</th>
                      <th>Data / Hora</th>
                      <th>Status</th>
                      <th>Ação Rápida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((item) => (
                      <tr key={item.id} className={item.status === 'novo' ? 'row-highlight' : ''}>
                        <td>
                          <strong>{item.name}</strong>
                          {item.cnpj ? (
                            <div className="dash-subtext">🏢 CNPJ: {item.cnpj}</div>
                          ) : null}
                          {item.email && <div className="dash-subtext">✉️ {item.email}</div>}
                        </td>
                        <td>
                          <div className="phone-tag">{item.phone}</div>
                          <span className={`pill-source ${item.source}`} style={{ marginTop: '4px', display: 'inline-block' }}>
                            {item.source === 'widget' ? 'Balão' : item.source === 'direct' ? 'Manual' : 'Site'}
                          </span>
                        </td>
                        <td>
                          <strong>{item.destination || '—'}</strong>
                        </td>
                        <td style={{ maxWidth: '280px' }}>
                          <span className="subject-pill">{item.materialType || item.subject}</span>
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
                              className="btn-wa-auto"
                              onClick={() => handleAutoCallCustomer(item)}
                              disabled={isCallingAuto === item.id}
                              title="Disparar mensagem no WhatsApp do cliente automaticamente e abrir chat"
                            >
                              <span className="wa-bolt-icon">⚡</span>
                              {isCallingAuto === item.id ? 'Disparando...' : 'Chamar Automático'}
                            </button>

                            <button
                              type="button"
                              className="btn-open-chat"
                              onClick={() => setChatLead(item)}
                              title="Abrir Chat com histórico deste cliente"
                            >
                              💬 Chat
                            </button>

                            <button
                              type="button"
                              className="btn-wa-call"
                              onClick={() => handleCallWhatsApp(item)}
                              title="Abrir no WhatsApp Web"
                            >
                              🔗 Link Web
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
                      onClick={handleConnectWhatsApp}
                    >
                      Gerar QR Code Real de Conexão
                    </button>
                  </div>
                )}

                {qrStep === 'pairing' && (
                  <div className="wa-qr-box active-pairing">
                    <div className="wa-qr-placeholder live">
                      {evolutionQrCode ? (
                        <img
                          src={evolutionQrCode.startsWith('data:') ? evolutionQrCode : `data:image/png;base64,${evolutionQrCode}`}
                          alt="QR Code WhatsApp Evolution"
                          style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                        />
                      ) : (
                        <div style={{ padding: '30px', textAlign: 'center' }}>
                          <div className="qr-scan-line"></div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>
                            Gerando QR Code na Evolution API...
                          </p>
                          <small style={{ color: 'var(--muted)' }}>Aguarde 3 segundos...</small>
                        </div>
                      )}
                    </div>

                    <div className="wa-countdown-box">
                      Aguardando leitura do WhatsApp no seu celular...
                    </div>

                    <div className="wa-instructions-list">
                      <ol>
                        <li>Abra o WhatsApp no seu smartphone</li>
                        <li>Toque em <strong>Aparelhos conectados</strong> &gt; <strong>Conectar um aparelho</strong></li>
                        <li>Aponte a câmera para o QR Code acima</li>
                      </ol>
                    </div>

                    <div className="wa-pairing-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setQrStep('disconnected')
                          setEvolutionQrCode(null)
                        }}
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

        {/* ABA 4: GESTÃO DE ADMINISTRADORES & SENHAS */}
        {activeTab === 'admins' && (
          <div className="dash-tab-content">
            <div className="admin-mgmt-grid">
              {/* Card 1: Lista de Admins Atuais */}
              <div className="wa-settings-card">
                <h3>Administradores Autorizados</h3>
                <p>Contas com acesso total ao painel CRM, clientes, chat e configurações do WhatsApp.</p>
                
                {adminNotice && <div className="admin-notice-bar">{adminNotice}</div>}

                <div className="admin-list-box">
                  {Object.entries(adminList).map(([email, pass]) => (
                    <div key={email} className="admin-user-item">
                      <div className="admin-user-info">
                        <span className="admin-badge-icon">🛡️</span>
                        <div>
                          <strong>{email}</strong>
                          <div className="admin-pass-preview">Senha: •••••••• ({pass.length} dígitos)</div>
                        </div>
                      </div>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          className="btn-edit-admin-pass"
                          onClick={() => {
                            setEditAdminEmail(email)
                            setEditAdminNewPass('')
                          }}
                        >
                          Trocar Senha
                        </button>
                        {email !== 'areaadmin@gmail.com' && (
                          <button
                            type="button"
                            className="btn-delete-admin"
                            onClick={() => handleRemoveAdmin(email)}
                            title="Remover Admin"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Ações de Novo Admin ou Alterar Senha */}
              <div className="wa-settings-card">
                {/* Form 1: Adicionar Novo Admin */}
                <h3>➕ Adicionar Novo Administrador</h3>
                <form onSubmit={handleAddAdmin} className="admin-form-sub">
                  <div className="settings-field">
                    <label>E-mail do Novo Admin *</label>
                    <input
                      type="email"
                      className="wa-input"
                      required
                      placeholder="novo.admin@eletricaarea.com.br"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                  </div>
                  <div className="settings-field">
                    <label>Definir Senha de Acesso *</label>
                    <input
                      type="password"
                      className="wa-input"
                      required
                      minLength={4}
                      placeholder="••••••••"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-navy" style={{ width: '100%' }}>
                    Cadastrar Novo Admin
                  </button>
                </form>

                <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--line)' }} />

                {/* Form 2: Trocar Senha */}
                <h3>🔑 Alterar Senha de Admin</h3>
                <form onSubmit={handleChangePassword} className="admin-form-sub">
                  <div className="settings-field">
                    <label>Selecione o Administrador</label>
                    <select
                      className="wa-select"
                      value={editAdminEmail}
                      onChange={(e) => setEditAdminEmail(e.target.value)}
                    >
                      <option value="">Selecione um admin...</option>
                      {Object.keys(adminList).map((em) => (
                        <option key={em} value={em}>
                          {em}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="settings-field">
                    <label>Nova Senha *</label>
                    <input
                      type="password"
                      className="wa-input"
                      required
                      minLength={4}
                      placeholder="Digite a nova senha segura..."
                      value={editAdminNewPass}
                      onChange={(e) => setEditAdminNewPass(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-navy"
                    style={{ width: '100%' }}
                    disabled={!editAdminEmail || editAdminNewPass.length < 4}
                  >
                    Salvar Nova Senha
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL PARA ADICIONAR CLIENTE MANUALMENTE */}
      {isAddClientOpen && (
        <div className="wa-chat-overlay" onClick={() => setIsAddClientOpen(false)}>
          <div className="wa-add-client-window" onClick={(e) => e.stopPropagation()}>
            <div className="wa-chat-header">
              <h3>➕ Cadastrar Novo Cliente</h3>
              <button
                type="button"
                className="wa-chat-close-btn"
                onClick={() => setIsAddClientOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddManualClient} className="wa-add-client-form">
              <label className="wa-label">
                <span>Nome / Razão Social *</span>
                <input
                  type="text"
                  className="wa-input"
                  required
                  placeholder="Nome do cliente ou empresa"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
              </label>

              <div className="wa-form-grid-2">
                <label className="wa-label">
                  <span>CNPJ</span>
                  <input
                    type="text"
                    className="wa-input"
                    placeholder="00.000.000/0001-00"
                    value={newClientCnpj}
                    onChange={(e) => setNewClientCnpj(e.target.value)}
                  />
                </label>
                <label className="wa-label">
                  <span>Telefone / WhatsApp *</span>
                  <input
                    type="tel"
                    className="wa-input"
                    required
                    placeholder="(15) 99876-5432"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                  />
                </label>
              </div>

              <div className="wa-form-grid-2">
                <label className="wa-label">
                  <span>Destino (Cidade / Obra / UF)</span>
                  <input
                    type="text"
                    className="wa-input"
                    placeholder="Ex: Sorocaba / SP"
                    value={newClientDest}
                    onChange={(e) => setNewClientDest(e.target.value)}
                  />
                </label>
                <label className="wa-label">
                  <span>Material Solicitado</span>
                  <input
                    type="text"
                    className="wa-input"
                    placeholder="Ex: Cabos elétricos, Disjuntores"
                    value={newClientMat}
                    onChange={(e) => setNewClientMat(e.target.value)}
                  />
                </label>
              </div>

              <label className="wa-label">
                <span>Observações / Detalhes da Cotação</span>
                <textarea
                  className="wa-textarea"
                  rows={2}
                  placeholder="Itens solicitados, prazos ou condições..."
                  value={newClientMsg}
                  onChange={(e) => setNewClientMsg(e.target.value)}
                />
              </label>

              <div className="wa-add-client-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsAddClientOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-navy">
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CHAT WHATSAPP INTEGRADO */}
      {chatLead && (
        <WhatsAppChatModal
          lead={chatLead}
          onClose={() => setChatLead(null)}
        />
      )}
    </main>
  )
}
