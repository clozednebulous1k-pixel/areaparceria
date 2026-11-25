import { useSearchParams } from 'react-router-dom'
import LeadForm from '../components/LeadForm'
import { contact } from '../data'

export default function Contato() {
  const [searchParams] = useSearchParams()
  const preSelectedMaterial = searchParams.get('item') || ''
  const preSelectedCode = searchParams.get('codigo') || ''
  
  const initialMaterial = preSelectedMaterial
    ? preSelectedCode
      ? `${preSelectedMaterial} (${preSelectedCode})`
      : preSelectedMaterial
    : ''

  const initialNote = preSelectedMaterial
    ? `Olá, gostaria de receber cotação com pronta-entrega para o item: ${preSelectedMaterial}${preSelectedCode ? ` [Código: ${preSelectedCode}]` : ''}.`
    : ''

  return (
    <main>
      <section className="page-hero">
        <div className="wrap page-title" data-motion="up">
          <div className="section-index" style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.12em' }}>Contato</div>
          <h1>Cotar como fornecedor oficial da obra.</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.05 20.15ZM16.57 14.37C16.32 14.25 15.1 13.65 14.88 13.56C14.65 13.48 14.48 13.44 14.32 13.68C14.15 13.93 13.68 14.49 13.53 14.65C13.39 14.82 13.25 14.84 13 14.72C12.75 14.6 11.95 14.33 11 13.49C10.26 12.83 9.76 12.02 9.61 11.77C9.47 11.53 9.6 11.39 9.72 11.27C9.83 11.16 9.97 10.98 10.1 10.84C10.22 10.69 10.26 10.59 10.35 10.43C10.43 10.26 10.39 10.12 10.33 10C10.26 9.88 9.77 8.68 9.57 8.18C9.37 7.7 9.17 7.76 9.02 7.75C8.88 7.75 8.71 7.75 8.55 7.75C8.38 7.75 8.12 7.81 7.89 8.06C7.66 8.31 7.02 8.91 7.02 10.13C7.02 11.35 7.91 12.53 8.03 12.69C8.16 12.86 9.78 15.35 12.26 16.42C12.85 16.67 13.31 16.82 13.67 16.94C14.26 17.13 14.8 17.1 15.23 17.04C15.7 16.97 16.68 16.45 16.88 15.87C17.09 15.3 17.09 14.8 17.03 14.7C16.97 14.6 16.82 14.5 16.57 14.37Z" />
              </svg>
              <strong style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>{contact.phone}</strong>
            </span>
            <span>·</span>
            <span style={{ color: 'var(--muted)' }}>{contact.hours}</span>
          </p>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap form-center-container">
          <div className="form-center-header" data-motion="up">
            <div className="section-index">Atendimento Oficial</div>
            <h2>Solicite disponibilidade e prazo no canteiro.</h2>
            <p>
              Envie lote, UF e a lista de materiais. Respondemos com
              disponibilidade imediata e prazo oficial de entrega na escola ou canteiro.
            </p>
          </div>
          <div className="form-center-card" data-motion="up">
            <LeadForm initialMaterial={initialMaterial} initialNote={initialNote} />
          </div>
        </div>
      </section>
    </main>
  )
}
