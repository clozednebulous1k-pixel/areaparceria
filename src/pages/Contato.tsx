import LeadForm from '../components/LeadForm'
import { contact } from '../data'

export default function Contato() {
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
        <div className="wrap lead-split">
          <div data-motion="left">
            <LeadForm />
          </div>
          <div data-motion="right">
            <p>
              Envie lote, UF e a lista de materiais. Respondemos com
              disponibilidade e prazo para a Fase 6.
            </p>
            <p>
              {contact.email}
              <br />
              {contact.address}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
