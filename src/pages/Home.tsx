import { Link } from 'react-router-dom'
import LeadForm from '../components/LeadForm'
import { diffs, projectItems } from '../data'

export default function Home() {
  return (
    <main>
      <section className="hero-tri">
        <article className="hero-panel">
          <img src="/img/hero.jpg" alt="Obra e instalação" />
        </article>
        <article className="hero-mid">
          <div className="hero-mid-photo">
            <img src="/img/warehouse.jpg" alt="Estoque AREA" />
          </div>
          <div className="hero-center">
            <span className="kicker">Conectividade de escolas · Fase 6</span>
            <h1>FORNECEDOR OFICIAL</h1>
            <p>Materiais para o seu projeto — rede, energia e infraestrutura.</p>
            <div className="hero-actions">
              <a href="#cotacao" className="btn btn-navy">
                Solicitar cotação
              </a>
              <Link to="/solucoes" className="btn btn-outline">
                Ver materiais
              </Link>
            </div>
          </div>
        </article>
        <article className="hero-panel">
          <img src="/img/cables.jpg" alt="Infraestrutura de rede" />
        </article>
      </section>

      <section className="stats compact" id="projeto">
        <div className="wrap stats-grid">
          <div className="stat">
            <strong>30 mil+</strong>
            <span>escolas já conectadas no programa</span>
          </div>
          <div className="stat">
            <strong>Dez/26</strong>
            <span>início da demanda da Fase 6</span>
          </div>
          <div className="stat">
            <strong>1.479</strong>
            <span>escolas só no Lote 9 · São Paulo</span>
          </div>
          <div className="stat">
            <strong>6 lojas</strong>
            <span>e entrega nacional para o canteiro</span>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <div className="phase-line" aria-label="Fases do atendimento">
            <div className="phase-track" aria-hidden="true">
              <span className="phase-flow" />
            </div>
            {diffs.map((d) => (
              <article key={d.n} className="phase">
                <span className="phase-dot">
                  <span className="phase-pulse" />
                </span>
                <div className="n">{d.n}</div>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt tight">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="section-index">Linha do projeto</div>
              <h2>O que a obra vai pedir.</h2>
            </div>
            <Link to="/solucoes" className="btn btn-outline">
              Ver catálogo
            </Link>
          </div>
          <div className="sku-grid">
            {projectItems.map((item) => (
              <article key={item.code} className="sku">
                <img src={item.image} alt={item.name} />
                <span>{item.code}</span>
                <strong>{item.name}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" id="cotacao">
        <div className="wrap lead-split">
          <div>
            <div className="section-index">Cotação</div>
            <h2>Seja atendido como obra do projeto.</h2>
            <p>
              Envie lote, UF e a lista. Montamos disponibilidade, prazo e condição
              de fornecimento para você operar como fornecedor oficial no campo.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>
    </main>
  )
}
