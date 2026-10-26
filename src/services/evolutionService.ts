import { db, isFirebaseConfigured } from '../firebase'
import {
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  where,
  onSnapshot,
} from 'firebase/firestore'
import { cleanPhone } from './supportService'

export interface ChatMessage {
  id: string
  leadId?: string
  phone: string
  fromMe: boolean
  senderName: string
  text: string
  timestamp: string
  status?: 'enviado' | 'entregue' | 'lido' | 'falha'
}

const MESSAGES_COLLECTION = 'whatsapp_messages'
const MESSAGES_LOCAL_KEY = 'area_whatsapp_messages'

// Configurações da Evolution API
export function getEvolutionConfig() {
  const url = import.meta.env.VITE_EVOLUTION_API_URL || 'http://187.77.254.212:8085'
  const apiKey = import.meta.env.VITE_EVOLUTION_API_KEY || 'AreaEletricaSecKey2026!'
  const instanceName = 'area_eletrica'
  return { url: url.replace(/\/$/, ''), apiKey, instanceName }
}

// 1. Criar ou Buscar Instância na Evolution API (100% REAL)
export async function createOrConnectEvolutionInstance(): Promise<{
  qrcode?: string
  status: string
  instance?: any
}> {
  const { url, apiKey, instanceName } = getEvolutionConfig()

  try {
    // 1.1 Tenta buscar status da conexão atual
    const resState = await fetch(`${url}/instance/connectionState/${instanceName}`, {
      headers: { apikey: apiKey },
    })

    if (resState.ok) {
      const stateData = await resState.json()
      if (stateData?.instance?.state === 'open') {
        return { status: 'open' }
      }
    }

    // 1.2 Se a instância já existe mas precisa conectar (gerar QR Code)
    const resConnect = await fetch(`${url}/instance/connect/${instanceName}`, {
      headers: { apikey: apiKey },
    })

    if (resConnect.ok) {
      const connData = await resConnect.json()
      const qr = connData?.base64 || connData?.qrcode?.base64 || connData?.code
      return {
        status: connData?.instance?.state || 'connecting',
        qrcode: qr,
      }
    }

    // 1.3 Se ainda não existir a instância, cria uma nova com QR Code ativado
    const resCreate = await fetch(`${url}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify({
        instanceName,
        token: apiKey,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      }),
    })

    if (resCreate.ok) {
      const createData = await resCreate.json()
      return {
        status: 'created',
        qrcode: createData?.qrcode?.base64 || createData?.base64,
      }
    }
  } catch (err) {
    console.error('Falha ao comunicar com a Evolution API:', err)
  }

  return { status: 'disconnected' }
}

// Checar status real da conexão
export async function checkEvolutionConnection(): Promise<boolean> {
  const { url, apiKey, instanceName } = getEvolutionConfig()
  try {
    const res = await fetch(`${url}/instance/connectionState/${instanceName}`, {
      headers: { apikey: apiKey },
    })
    if (res.ok) {
      const data = await res.json()
      return data?.instance?.state === 'open'
    }
  } catch {
    return false
  }
  return false
}

// Desconectar sessão real do WhatsApp
export async function logoutEvolutionInstance(): Promise<boolean> {
  const { url, apiKey, instanceName } = getEvolutionConfig()
  try {
    const res = await fetch(`${url}/instance/logout/${instanceName}`, {
      method: 'DELETE',
      headers: { apikey: apiKey },
    })
    return res.ok
  } catch {
    return false
  }
}

// 2. Enviar mensagem real pelo WhatsApp via Evolution API
export async function sendWhatsAppMessage(
  phone: string,
  text: string,
  leadId?: string,
  senderName: string = 'Atendimento AREA',
): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  let number = cleanPhone(phone)
  if (number.length === 10 || number.length === 11) {
    number = '55' + number
  }

  const { url, apiKey, instanceName } = getEvolutionConfig()

  const newMsg: ChatMessage = {
    id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    leadId,
    phone: number,
    fromMe: true,
    senderName,
    text,
    timestamp: new Date().toISOString(),
    status: 'enviado',
  }

  // Tenta enviar via Evolution API
  let apiSuccess = false
  try {
    const res = await fetch(`${url}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify({
        number,
        text,
        options: {
          delay: 1200,
          presence: 'composing',
        },
      }),
    })

    if (res.ok) {
      apiSuccess = true
      newMsg.status = 'entregue'
    } else {
      console.warn('Evolution API retornou status não-200:', await res.text())
    }
  } catch (err) {
    console.warn('Falha na requisição para a Evolution API:', err)
  }

  // Grava a mensagem no histórico do Firebase Firestore e no LocalStorage
  await recordMessage(newMsg)

  return { success: apiSuccess, message: newMsg }
}

// 3. Gravar mensagem no histórico
export async function recordMessage(msg: ChatMessage) {
  // Salva no LocalStorage
  try {
    const local = getStoredMessages()
    const updated = [...local, msg]
    localStorage.setItem(MESSAGES_LOCAL_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Erro ao salvar mensagem local:', err)
  }

  // Salva no Firestore
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, MESSAGES_COLLECTION, msg.id), msg)
    } catch (err) {
      console.warn('Erro ao gravar mensagem no Firestore:', err)
    }
  }
}

// 4. Buscar histórico de mensagens de um telefone
export function getStoredMessages(phoneFilter?: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_LOCAL_KEY)
    const list: ChatMessage[] = raw ? JSON.parse(raw) : []
    if (!phoneFilter) return list
    const clean = cleanPhone(phoneFilter)
    return list.filter((m) => m.phone.includes(clean) || clean.includes(m.phone))
  } catch {
    return []
  }
}

// 5. Escutar mensagens em tempo real para o Chat
export function subscribeMessages(
  phone: string,
  onUpdate: (messages: ChatMessage[]) => void,
) {
  const clean = cleanPhone(phone)

  // Dispara logo o local
  onUpdate(getStoredMessages(clean))

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, MESSAGES_COLLECTION),
        where('phone', '==', clean.length === 11 ? '55' + clean : clean),
        orderBy('timestamp', 'asc'),
      )
      return onSnapshot(
        q,
        (snap) => {
          const msgs: ChatMessage[] = []
          snap.forEach((d) => msgs.push(d.data() as ChatMessage))
          if (msgs.length > 0) {
            onUpdate(msgs)
          }
        },
        (err) => {
          console.warn('Snapshot listener firestore falhou:', err)
        },
      )
    } catch (e) {
      console.warn('Erro ao iniciar listener do chat:', e)
    }
  }

  return () => {}
}
