import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

// Configurações do Firebase obtidas das variáveis de ambiente (Vite: VITE_FIREBASE_*)
// ou com valores de fallback editáveis
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyFallbackAREA2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'area-corporativo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'area-corporativo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'area-corporativo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
}

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

// Verifica se o Firebase está com as credenciais reais configuradas
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID,
)

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)
} catch (err) {
  console.warn('Firebase inicializado em modo fallback/local:', err)
}

export { app, db, auth }
