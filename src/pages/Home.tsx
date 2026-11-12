import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import BranchesMap from '../components/BranchesMap'
import FlowExplainer from '../components/FlowExplainer'
import LeadForm from '../components/LeadForm'
import { diffs, projectItems } from '../data'

const motions = ['up', 'left', 'right', 'zoom'] as const

export default function Home() {
  const videoLeftRef = useRef<HTMLVideoElement>(null)
  const videoMidRef = useRef<HTMLVideoElement>(null)
  const videoRightRef = useRef<HTMLVideoElement>(null)
  const [selectedItemForQuote, setSelectedItemForQuote] = useState<{ name: string; code: string } | null>(null)

  useEffect(() => {
    // 0.85 mantém a reprodução natural com fluidez de 60fps sem engasgos de frames
    const playbackSpeed = 0.85
    if (videoLeftRef.current) videoLeftRef.current.playbackRate = playbackSpeed
    if (videoMidRef.current) videoMidRef.current.playbackRate = playbackSpeed
    if (videoRightRef.current) videoRightRef.current.playbackRate = playbackSpeed
  }, [])

  return (
    <main>
      <section className="hero-tri">
        <article className="hero-panel">
          <div className="hero-motion-down" data-motion="down">
            <video
              ref={videoLeftRef}
              src="/img/hero_left.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="hero-video-media"
            />
          </div>
        </article>
        <article className="hero-mid">
          <div className="hero-mid-photo">
            <div className="hero-motion-down" data-motion="down">
              <video
                ref={videoMidRef}
                src="/img/hero_mid.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="hero-video-media"
              />
            </div>
          </div>
          <div className="hero-center" data-motion="up">
            <span className="kicker">CONECTIVIDADE DE ESCOLAS - APRENDER CONECTADO</span>
            <h1>FORNECEDOR OFICIAL</h1>
            <p>Materiais para o seu projeto, rede, energia e infraestrutura.</p>
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
          <div className="hero-motion-down" data-motion="down">
            <video
              ref={videoRightRef}
              src="/img/hero_right.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="hero-video-media"
            />
          </div>
        </article>
      </section>

      <section className="stats compact" id="projeto">
        <div className="wrap stats-grid">
          {[
            ['30 mil+', 'escolas já conectadas no programa'],
            ['Dez/26', 'início da demanda de entrega'],
            ['1.479', 'escolas só no Lote 9 · São Paulo'],
            ['7 unidades', 'e entrega nacional para o canteiro'],
          ].map(([n, t], i) => (
            <div key={n} className="stat" data-motion="up" style={{ '--d': `${i * 0.12}s` } as CSSProperties}>
              <strong>{n}</strong>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Carrossel Infinito de Produtos Homologados */}
      <section className="product-ticker-section" aria-label="Produtos homologados em destaque">
        <div className="product-ticker-track">
          {/* Duplicamos a lista para criar o loop visualmente contínuo e infinito */}
          {[...projectItems, ...projectItems].map((item, idx) => (
            <div
              key={`${item.code}-${idx}`}
              className="product-ticker-card"
              onClick={() => {
                setSelectedItemForQuote({ name: item.name, code: item.code })
                const el = document.getElementById('cotacao')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              title={`Clique para cotar ${item.name}`}
            >
              <div className="ticker-img-wrap">
                <img src={item.image} alt={item.name} loading="lazy" />
              </div>
              <div className="ticker-card-info">
                <span className="ticker-badge">Pronta-entrega</span>
                <strong className="ticker-name">{item.name}</strong>
                <span className="ticker-action">Cotar item →</span>
              </div>
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
                  <div className="phase-card-box">
                    <div className="n">{d.n}</div>
                    <h3>{d.title}</h3>
                    <p>{d.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mapa com as filiais conectadas */}
      <BranchesMap />

      {/* Seção Animada de Conexão e Explicação do Processo do Site */}
      <FlowExplainer />

      <section className="section alt tight">
        <div className="wrap">
          <div className="section-head" data-motion="up">
            <div>
              <div className="section-index">Linha do projeto</div>
              <h2>O que a obra vai pedir.</h2>
              <p className="catalog-preview-sub">Principais itens homologados e com pronto atendimento para a sua lista técnica.</p>
            </div>
            <Link to="/solucoes" className="btn btn-outline">
              Ver catálogo completo ({projectItems.length} itens) ↗
            </Link>
          </div>
          <div className="sku-grid">
            {projectItems.slice(0, 6).map((item, i) => (
              <article
                key={item.code}
                className="sku"
                data-motion={i % 2 === 0 ? 'zoom' : 'up'}
                style={{ '--d': `${(i % 3) * 0.08}s` } as CSSProperties}
              >
                <div className="sku-thumb">
                  <img src={item.image} alt={item.name} />
                  <span className="sku-badge">Pronta-entrega</span>
                </div>
                <div className="sku-content">
                  <span className="sku-code">{item.code}</span>
                  <strong className="sku-title">{item.name}</strong>
                  <div className="sku-action">
                    <span className="sku-spec">Especificação Oficial</span>
                    <a
                      href="#cotacao"
                      className="sku-quote-link"
                      onClick={() => setSelectedItemForQuote({ name: item.name, code: item.code })}
                    >
                      Cotar item →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="catalog-cta-wrap" data-motion="up">
            <Link to="/solucoes" className="btn btn-navy catalog-see-more-btn">
              Explorar Catálogo Completo ({projectItems.length} itens)
            </Link>
          </div>

          {/* Banner / Sugestão de separação de item personalizado */}
          <div className="custom-item-card" data-motion="up">
            <div className="custom-item-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <div className="custom-item-content">
              <h3>Não encontrou o item que procura?</h3>
              <p>
                Precisa de um material específico para o seu lote? Nossa equipe técnica faz a cotação e a separação dedicada de qualquer item da sua lista.
              </p>
            </div>
            <div className="custom-item-action">
              <a href="#cotacao" className="btn btn-navy custom-item-btn">
                <span>Sugerir separação de item</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" id="cotacao">
        <div className="wrap form-center-container">
          <div className="form-center-header" data-motion="up">
            <div className="section-index">Cotação</div>
            <h2>Seja atendido como obra do projeto.</h2>
            <p>
              Envie lote, UF e a lista. Montamos disponibilidade, prazo e condição
              de fornecimento para você operar como fornecedor oficial no campo.
            </p>
          </div>
          <div className="form-center-card" data-motion="up">
            <LeadForm
              initialMaterial={
                selectedItemForQuote
                  ? `${selectedItemForQuote.name} (${selectedItemForQuote.code})`
                  : ''
              }
              initialNote={
                selectedItemForQuote
                  ? `Olá, gostaria de solicitar disponibilidade e cotação para o item: ${selectedItemForQuote.name} [Código: ${selectedItemForQuote.code}].`
                  : ''
              }
            />
          </div>
        </div>
      </section>
    </main>
  )
}
