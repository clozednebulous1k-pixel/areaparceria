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
              disponibilidade e prazo oficial de entrega no canteiro.
            </p>
            <p>
              <a href="mailto:luan.castro@eletricaarea.com.br">luan.castro@eletricaarea.com.br</a>
              <br />
              <a href="mailto:felipe.synthes@eletricaarea.com.br">felipe.synthes@eletricaarea.com.br</a>
              <br />
              {contact.address}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
