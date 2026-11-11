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
          <div className="section-index">Contato</div>
          <h1>Cotar como fornecedor oficial da obra.</h1>
          <p>
            {contact.phone} · {contact.hours}
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
