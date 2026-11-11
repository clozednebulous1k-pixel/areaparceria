import { useEffect, useState } from 'react'

const LGPD_STORAGE_KEY = 'area_lgpd_accepted_v1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(LGPD_STORAGE_KEY)
      if (!accepted) {
        // Exibir após um breve delay para suavidade
        const timer = setTimeout(() => {
          setVisible(true)
          document.body.classList.add('has-lgpd-banner')
        }, 800)
        return () => clearTimeout(timer)
      }
    } catch {
      // fallback caso localStorage esteja restrito
      setVisible(true)
      document.body.classList.add('has-lgpd-banner')
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem(LGPD_STORAGE_KEY, new Date().toISOString())
    } catch {}
    document.body.classList.remove('has-lgpd-banner')
    setVisible(false)
    setModalOpen(false)
  }

  if (!visible && !modalOpen) return null

  return (
    <>
      {visible && (
        <aside className="lgpd-banner" role="dialog" aria-live="polite" aria-label="Aviso de Privacidade e Cookies">
          <div className="wrap lgpd-banner-wrap">
            <div className="lgpd-banner-text">
              <div className="lgpd-banner-header">
                <span className="lgpd-icon" aria-hidden="true">🛡️</span>
                <strong>Privacidade e Proteção de Dados (LGPD)</strong>
              </div>
              <p>
                Utilizamos cookies e tecnologias semelhantes para aprimorar sua experiência de navegação,
                personalizar orçamentos e assegurar o cumprimento da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
                Ao continuar navegando ou clicar em "Aceitar todos", você concorda com nossos termos.
              </p>
            </div>
            <div className="lgpd-banner-actions">
              <button
                type="button"
                className="btn btn-outline lgpd-btn-secondary"
                onClick={() => setModalOpen(true)}
              >
                Ler termos
              </button>
              <button
                type="button"
                className="btn btn-navy lgpd-btn-primary"
                onClick={handleAccept}
              >
                Aceitar todos
              </button>
            </div>
          </div>
        </aside>
      )}

      {modalOpen && (
        <div className="lgpd-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="lgpd-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lgpd-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lgpd-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>📜</span>
                <h3 id="lgpd-modal-title">Termos de Privacidade e Proteção de Dados (LGPD)</h3>
              </div>
              <button
                type="button"
                className="lgpd-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Fechar termos"
              >
                ✕
              </button>
            </div>
            <div className="lgpd-modal-body">
              <h4>1. Compromisso AREA Material Elétrico</h4>
              <p>
                A AREA Material Elétrico compromete-se com a segurança, transparência e privacidade dos dados de seus
                clientes, parceiros e operadores em total conformidade com a LGPD (Lei nº 13.709/2018).
              </p>

              <h4>2. Coleta de Dados e Finalidade</h4>
              <p>
                Os dados fornecidos em formulários de cotação (como nome, e-mail, telefone corporativo e lote da obra)
                são utilizados exclusivamente para elaboração de propostas comerciais oficiais, logística de entrega e
                atendimento técnico dedicado.
              </p>

              <h4>3. Compartilhamento e Armazenamento</h4>
              <p>
                Não comercializamos seus dados com terceiros sob nenhuma circunstância. As informações são armazenadas em
                servidores seguros com criptografia e acesso restrito aos consultores autorizados da obra.
              </p>

              <h4>4. Seus Direitos como Titular</h4>
              <p>
                Você tem direito a solicitar a qualquer momento a confirmação, correção, atualização ou exclusão de seus
                dados de nossa base entrando em contato com nosso DPO / canal oficial: <strong>contato@eletricaarea.com.br</strong>.
              </p>
            </div>
            <div className="lgpd-modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setModalOpen(false)}
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-navy"
                onClick={handleAccept}
              >
                Concordar e Aceitar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

