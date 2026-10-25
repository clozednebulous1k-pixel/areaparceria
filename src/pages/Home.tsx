import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import LeadForm from '../components/LeadForm'
import { diffs, projectItems } from '../data'

const motions = ['up', 'left', 'right', 'zoom'] as const

export default function Home() {
  return (
    <main>
      <section className="hero-tri">
        <article className="hero-panel" data-motion="left">
          <img src="/img/hero.jpg" alt="Obra e instalação" />
        </article>
        <article className="hero-mid">
          <div className="hero-mid-photo" data-motion="down">
            <img src="/img/warehouse.jpg" alt="Estoque AREA" />
          </div>
          <div className="hero-center" data-motion="up">
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
        <article className="hero-panel" data-motion="right">
          <img src="/img/cables.jpg" alt="Infraestrutura de rede" />
        </article>
      </section>

      <section className="stats compact" id="projeto">
        <div className="wrap stats-grid">
          {[
            ['30 mil+', 'escolas já conectadas no programa'],
            ['Dez/26', 'início da demanda da Fase 6'],
            ['1.479', 'escolas só no Lote 9 · São Paulo'],
            ['6 lojas', 'e entrega nacional para o canteiro'],
          ].map(([n, t], i) => (
            <div key={n} className="stat" data-motion="up" style={{ '--d': `${i * 0.12}s` } as CSSProperties}>
              <strong>{n}</strong>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <div className="phase-stepper" aria-label="Fases do atendimento">
            <div className="phase-track-bar" aria-hidden="true">
              <span className="phase-track-fill" />
            </div>
            <div className="phase-steps">
              {diffs.map((d, i) => (
                <article
                  key={d.n}
                  className="phase-step"
                  data-motion={motions[i % motions.length]}
                  style={{ '--d': `${i * 0.12}s`, '--i': i } as CSSProperties}
                >
                  <div className="phase-node">
                    <span className="phase-node-ring">
                      <span className="phase-node-core" />
                    </span>
                  </div>
                  <div className="n">{d.n}</div>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section alt tight">
        <div className="wrap">
          <div className="section-head" data-motion="up">
            <div>
              <div className="section-index">Linha do projeto</div>
              <h2>O que a obra vai pedir.</h2>
            </div>
            <Link to="/solucoes" className="btn btn-outline">
              Ver catálogo
            </Link>
          </div>
          <div className="sku-grid">
            {projectItems.map((item, i) => (
              <article
                key={item.code}
                className="sku"
                data-motion={i % 2 === 0 ? 'zoom' : 'up'}
                style={{ '--d': `${(i % 4) * 0.08}s` } as CSSProperties}
              >
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
          <div data-motion="left">
            <div className="section-index">Cotação</div>
            <h2>Seja atendido como obra do projeto.</h2>
            <p>
              Envie lote, UF e a lista. Montamos disponibilidade, prazo e condição
              de fornecimento para você operar como fornecedor oficial no campo.
            </p>
          </div>
          <div data-motion="right">
            <LeadForm />
          </div>
        </div>
      </section>
    </main>
  )
}
