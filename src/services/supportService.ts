import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'

export interface SupportLead {
  id: string
  name: string
  phone: string
  email?: string
  cnpj?: string
  destination?: string // Cidade / Estado / Obra de destino
  materialType?: string // Tipo de material solicitado
  subject: string
  message: string
  source: 'widget' | 'contact_form' | 'direct'
  status: 'novo' | 'em_atendimento' | 'chamado' | 'finalizado'
  createdAt: string
  notes?: string
}

export interface WhatsAppConfig {
  corporateNumber: string
  defaultGreeting: string
  autoReplyMessage: string
  isConnected: boolean
  connectedAt?: string
  connectedNumber?: string
}

const LEADS_STORAGE_KEY = 'area_support_leads'
const WA_CONFIG_KEY = 'area_whatsapp_config'
const FIRESTORE_LEADS_COLLECTION = 'support_leads'
const FIRESTORE_SETTINGS_COLLECTION = 'system_settings'

export const DEFAULT_WA_CONFIG: WhatsAppConfig = {
  corporateNumber: '551530327900',
  defaultGreeting: 'Olá! Vim pelo site da AREA Material Elétrico e gostaria de suporte/atendimento.',
  autoReplyMessage: 'Olá! Recebemos sua solicitação em nossa central da AREA. Um consultor especialista entrará em contato em instantes.',
  isConnected: false,
}

const INITIAL_MOCK_LEADS: SupportLead[] = [
  {
    id: 'LEAD-101',
    name: 'Carlos Mendes (Construtora Alpha)',
    phone: '15998765432',
    email: 'carlos@alphaeng.com.br',
    subject: 'Cotação de Cabos e Eletrodutos',
    message: 'Gostaria de verificar a disponibilidade de 2.000m de cabo flex 2,5mm e curvas PVC para obra em Sorocaba.',
    source: 'widget',
    status: 'novo',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'LEAD-102',
    name: 'Mariana Duarte - Arq. Interiores',
    phone: '11987651234',
    email: 'mariana@duarte.arq.br',
    subject: 'Especificação Iluminação LED',
    message: 'Preciso de ajuda com o dimensionamento dos perfis LED e temperatura de cor para projeto comercial.',
    source: 'widget',
    status: 'em_atendimento',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'LEAD-103',
    name: 'Eng. Roberto Silva',
    phone: '19991238844',
    email: 'roberto@mogiinstalacoes.com',
    subject: 'Dúvida sobre entrega em Mogi Guaçu',
    message: 'Qual o prazo de separação e entrega para quadros de distribuição montados?',
    source: 'contact_form',
    status: 'chamado',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

// Carrega Leads (Tenta Firestore primeiro; se offline ou não configurado, usa localStorage)
export async function fetchLeads(): Promise<SupportLead[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, FIRESTORE_LEADS_COLLECTION), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const firestoreLeads: SupportLead[] = []
        snapshot.forEach((d) => {
          firestoreLeads.push(d.data() as SupportLead)
        })
        // Sincroniza localmente para cache
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(firestoreLeads))
        return firestoreLeads
      }
    } catch (err) {
      console.warn('Erro ao carregar do Firestore, carregando local:', err)
    }
  }

  return getStoredLeads()
}

export function getStoredLeads(): SupportLead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LEADS))
      return INITIAL_MOCK_LEADS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_MOCK_LEADS
  }
}

// Salva Lead no Firestore e no cache local
export async function saveLead(
  lead: Omit<SupportLead, 'id' | 'createdAt' | 'status'> & Partial<SupportLead>,
): Promise<SupportLead> {
  const leads = getStoredLeads()
  const newLead: SupportLead = {
    id: `LEAD-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString(),
    status: 'novo',
    ...lead,
  }

  // Grava localmente de imediato
  const updated = [newLead, ...leads]
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Falha ao salvar no cache local:', err)
  }

  // Grava no Firestore se configurado
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, FIRESTORE_LEADS_COLLECTION, newLead.id), newLead)
    } catch (err) {
      console.warn('Erro ao persistir no Firebase Firestore:', err)
    }
  }

  return newLead
}

export async function updateLeadStatus(
  id: string,
  status: SupportLead['status'],
  notes?: string,
): Promise<SupportLead[]> {
  const leads = getStoredLeads()
  const updated = leads.map((l) =>
    l.id === id ? { ...l, status, ...(notes !== undefined ? { notes } : {}) } : l,
  )

  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Falha ao atualizar no cache local:', err)
  }

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, FIRESTORE_LEADS_COLLECTION, id)
      const dataToUpdate: any = { status }
      if (notes !== undefined) dataToUpdate.notes = notes
      await updateDoc(ref, dataToUpdate)
    } catch (err) {
      console.warn('Erro ao atualizar no Firestore:', err)
    }
  }

  return updated
}

export async function deleteLead(id: string): Promise<SupportLead[]> {
  const leads = getStoredLeads()
  const updated = leads.filter((l) => l.id !== id)

  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Falha ao excluir no cache local:', err)
  }

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, FIRESTORE_LEADS_COLLECTION, id))
    } catch (err) {
      console.warn('Erro ao excluir no Firestore:', err)
    }
  }

  return updated
}

export function getWhatsAppConfig(): WhatsAppConfig {
  try {
    const raw = localStorage.getItem(WA_CONFIG_KEY)
    if (!raw) {
      localStorage.setItem(WA_CONFIG_KEY, JSON.stringify(DEFAULT_WA_CONFIG))
      return DEFAULT_WA_CONFIG
    }
    return { ...DEFAULT_WA_CONFIG, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_WA_CONFIG
  }
}

export async function saveWhatsAppConfig(config: Partial<WhatsAppConfig>): Promise<WhatsAppConfig> {
  const current = getWhatsAppConfig()
  const updated = { ...current, ...config }

  try {
    localStorage.setItem(WA_CONFIG_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Falha ao salvar config do WhatsApp local:', err)
  }

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, FIRESTORE_SETTINGS_COLLECTION, 'whatsapp'), updated, { merge: true })
    } catch (err) {
      console.warn('Erro ao salvar config no Firestore:', err)
    }
  }

  return updated
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function buildWhatsAppLink(phone: string, text: string): string {
  let clean = cleanPhone(phone)
  if (clean.length === 10 || clean.length === 11) {
    clean = '55' + clean
  }
  const encodedText = encodeURIComponent(text)
  return `https://wa.me/${clean}?text=${encodedText}`
}
