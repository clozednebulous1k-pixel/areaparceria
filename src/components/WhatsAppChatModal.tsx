import { useState, useEffect, useRef, type FormEvent } from 'react'
import {
  sendWhatsAppMessage,
  subscribeMessages,
  type ChatMessage,
} from '../services/evolutionService'
import { type SupportLead } from '../services/supportService'

interface WhatsAppChatModalProps {
  lead: SupportLead
  onClose: () => void
}

export default function WhatsAppChatModal({ lead, onClose }: WhatsAppChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [statusNotice, setStatusNotice] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Inscrição em tempo real para as mensagens desse telefone
  useEffect(() => {
    const unsubscribe = subscribeMessages(lead.phone, (msgs) => {
      setMessages(msgs)
    })
    return () => unsubscribe()
  }, [lead.phone])

  // Rolar para o fim quando novas mensagens chegam
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!inputText.trim() || isSending) return

    const text = inputText.trim()
    setInputText('')
    setIsSending(true)
    setStatusNotice('Enviando via WhatsApp...')

    const res = await sendWhatsAppMessage(lead.phone, text, lead.id, 'AREA Central')

    if (res.success) {
      setStatusNotice('✅ Mensagem entregue no WhatsApp!')
      setTimeout(() => setStatusNotice(null), 3000)
    } else {
      setStatusNotice('⚠️ Enviada localmente (Evolution API offline ou conectando)')
      setTimeout(() => setStatusNotice(null), 4000)
    }

    setIsSending(false)
  }

  // Disparo de mensagem rápida automática de primeiro contato
  async function handleSendTemplate(text: string) {
    setInputText(text)
  }

  return (
    <div className="wa-chat-overlay" onClick={onClose}>
      <div className="wa-chat-window" onClick={(e) => e.stopPropagation()}>
        {/* Topo do Chat */}
        <div className="wa-chat-header">
          <div className="wa-chat-user-info">
            <div className="wa-chat-avatar">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>{lead.name}</h3>
              <span className="wa-chat-phone">
                📱 {lead.phone} • {lead.subject}
              </span>
            </div>
          </div>
          <button type="button" className="wa-chat-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Notificação rápida de status */}
        {statusNotice && <div className="wa-chat-notice">{statusNotice}</div>}

        {/* Histórico de Mensagens */}
        <div className="wa-chat-body">
          {/* Mensagem inicial do Lead no site */}
          <div className="wa-chat-lead-context">
            <span className="context-title">📌 Solicitação inicial enviada pelo site:</span>
            <p className="context-text">"{lead.message}"</p>
            <span className="context-date">
              {new Date(lead.createdAt).toLocaleString('pt-BR')}
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="wa-chat-empty">
              <p>Nenhuma mensagem trocada com este cliente ainda.</p>
              <span>Envie uma mensagem abaixo para iniciar a conversa no WhatsApp!</span>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`wa-chat-bubble ${m.fromMe ? 'bubble-me' : 'bubble-client'}`}
              >
                <div className="bubble-sender">{m.senderName}</div>
                <div className="bubble-text">{m.text}</div>
                <div className="bubble-meta">
                  <span className="bubble-time">
                    {new Date(m.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {m.fromMe && <span className="bubble-status">✓✓</span>}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Sugestões Rápidas de Resposta */}
        <div className="wa-quick-replies">
          <button
            type="button"
            className="quick-chip"
            onClick={() =>
              handleSendTemplate(
                `Olá ${lead.name.split(' ')[0]}, tudo bem? Sou da AREA Material Elétrico. Vi que você precisa de informações sobre ${lead.subject}. Como posso te ajudar agora?`
              )
            }
          >
            ⚡ Apresentação
          </button>
          <button
            type="button"
            className="quick-chip"
            onClick={() =>
              handleSendTemplate(
                `Olá ${lead.name.split(' ')[0]}! Estou separando seu orçamento aqui na AREA. Poderia me enviar a lista dos materiais e quantidades?`
              )
            }
          >
            📋 Pedir Lista
          </button>
          <button
            type="button"
            className="quick-chip"
            onClick={() =>
              handleSendTemplate(
                `Seu orçamento já foi pré-calculado com condições especiais para atacado. Deseja fechar o pedido ou prefere entrega na obra?`
              )
            }
          >
            💰 Condições Comerciais
          </button>
        </div>

        {/* Campo de Envio de Mensagem */}
        <form className="wa-chat-footer" onSubmit={handleSend}>
          <input
            type="text"
            className="wa-chat-input"
            placeholder="Digite a mensagem para o WhatsApp do cliente..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className="wa-chat-send-btn"
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? '...' : 'Enviar ➤'}
          </button>
        </form>
      </div>
    </div>
  )
}
