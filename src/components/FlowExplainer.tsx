import { useState, useEffect } from 'react'

export default function FlowExplainer() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      num: '01',
      title: 'Envio da Lista Técnica',
      desc: 'Você envia a planilha de materiais, códigos ou memorial descritivo da obra ou do lote.',
      letter: 'A',
      letterWord: 'AGILIDADE',
      badge: 'Cotação Express',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Engenharia de Separação',
      desc: 'Nossa equipe confere compatibilidade técnica (normas ABNT, bitolas e homologações).',
      letter: 'R',
      letterWord: 'RIGOR TÉCNICO',
      badge: 'Conformidade',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Logística & Expedição',
      desc: 'Saída direta do centro de distribuição mais próximo com embalagem e rastreio por lote.',
      letter: 'E',
      letterWord: 'EFICIÊNCIA',
      badge: 'Frota Própria & CD',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Entrega no Canteiro',
      desc: 'Descarga no prazo programado com nota fiscal unificada para o cronograma não atrasar.',
      letter: 'A',
      letterWord: 'ATENDIMENTO TOTAL',
      badge: 'Sem Paradas',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ]

  // Animação contínua e suave do caminhão entre as etapas
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [steps.length])

  return (
    <section className="flow-explainer-section">
      <div className="wrap">
        <div className="section-head center-text" data-motion="up">
          <div className="section-index">Como Funciona o Fornecimento</div>
          <h2>Conexão do pedido ao canteiro de obras.</h2>
          <p className="flow-explainer-subtitle">
            Acompanhe a rota do caminhão AREA ligando cada etapa e formando o compromisso oficial da nossa entrega.
          </p>
        </div>

        <div className="flow-grid-container">
          {/* PISTA / RODOVIA LOCALIZADA ACIMA DOS CARDS COM O CAMINHÃO CORRETO */}
          <div className="truck-highway-track" aria-hidden="true">
            <div className="highway-road-line">
              <span className="highway-road-stripe" />
            </div>

            {/* Marcadores de parada na rodovia */}
            <div className="highway-stations">
              {steps.map((_, i) => (
                <div
                  key={`station-${i}`}
                  className={`highway-station-dot ${activeStep >= i ? 'visited' : ''} ${activeStep === i ? 'current' : ''}`}
                  onClick={() => setActiveStep(i)}
                />
              ))}
            </div>

            {/* O Caminhãozinho com proporções perfeitas e rodas no chão */}
            <div
              className="truck-vehicle-runner"
              style={{
                left: `${12.5 + activeStep * 25}%`,
              }}
            >
              <div className="truck-sprite">
                <svg
                  viewBox="0 0 110 52"
                  className="truck-precise-svg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="truckBodyGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#061a3a" />
                      <stop offset="100%" stopColor="#0a2a5c" />
                    </linearGradient>
                    <linearGradient id="cabinGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>

                  {/* Sombra realista sob as rodas */}
                  <ellipse cx="55" cy="48" rx="48" ry="3" fill="rgba(10, 42, 92, 0.25)" />

                  {/* 1. Baú / Carroceria do Caminhão */}
                  <rect x="4" y="6" width="62" height="32" rx="4" fill="url(#truckBodyGrad)" stroke="#16407a" strokeWidth="1.5" />
                  
                  {/* Placa metálica com a logo AREA+ */}
                  <rect x="8" y="10" width="54" height="24" rx="2" fill="#0d3166" />
                  <text
                    x="35"
                    y="26"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="900"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    letterSpacing="1.2"
                  >
                    AREA+
                  </text>

                  {/* 2. Cabine Frontal do Caminhão */}
                  <path
                    d="M66 18 H84 C88 18 91 21 93 25 L98 31 C99.5 32.8 100 34.5 100 36.5 V38 H66 V18 Z"
                    fill="url(#cabinGrad)"
                    stroke="#1d4ed8"
                    strokeWidth="1.2"
                  />

                  {/* Janela / Pára-brisa */}
                  <path
                    d="M70 21 H83 C85.5 21 87.5 22.8 88.5 25 L92 30 H70 V21 Z"
                    fill="#dbeafe"
                    stroke="#93c5fd"
                    strokeWidth="0.8"
                  />

                  {/* Farol Dianteiro Aceso com Luz */}
                  <path d="M100 32 L108 28 L108 36 Z" fill="rgba(254, 240, 138, 0.45)" />
                  <circle cx="99" cy="33" r="2" fill="#facc15" />

                  {/* Para-choque dianteiro */}
                  <rect x="94" y="37" width="7" height="3" rx="1" fill="#475569" />

                  {/* Chassi inferior */}
                  <rect x="6" y="38" width="88" height="2.5" fill="#334155" />

                  {/* 3. RODAS NO LUGAR CORRETO (APOIADAS NA BASE) */}
                  {/* Roda Traseira 1 */}
                  <g className="wheel-group">
                    <circle cx="18" cy="40" r="7.5" fill="#1e293b" />
                    <circle cx="18" cy="40" r="4.2" fill="#94a3b8" />
                    <circle cx="18" cy="40" r="1.8" fill="#0f172a" />
                  </g>

                  {/* Roda Traseira 2 */}
                  <g className="wheel-group">
                    <circle cx="34" cy="40" r="7.5" fill="#1e293b" />
                    <circle cx="34" cy="40" r="4.2" fill="#94a3b8" />
                    <circle cx="34" cy="40" r="1.8" fill="#0f172a" />
                  </g>

                  {/* Roda Dianteira */}
                  <g className="wheel-group">
                    <circle cx="82" cy="40" r="7.5" fill="#1e293b" />
                    <circle cx="82" cy="40" r="4.2" fill="#94a3b8" />
                    <circle cx="82" cy="40" r="1.8" fill="#0f172a" />
                  </g>
                </svg>

                {/* Fumacinha animada no escapamento */}
                <span className="truck-smoke s1" />
                <span className="truck-smoke s2" />
              </div>
            </div>
          </div>

          {/* Cards dos 4 passos conectados logo abaixo da pista */}
          <div className="flow-cards-wrapper">
            {steps.map((step, index) => {
              const isActive = activeStep === index
              const isPast = activeStep >= index

              return (
                <div
                  key={step.num}
                  className={`flow-step-card ${isActive ? 'is-truck-active' : ''} ${isPast ? 'is-passed' : ''}`}
                  onClick={() => setActiveStep(index)}
                  style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
                >
                  <div className="flow-card-header">
                    <div className="flow-icon-bubble">
                      {step.icon}
                      {isActive && <span className="flow-icon-ping" />}
                    </div>
                    <span className="flow-step-num">{step.num}</span>
                  </div>

                  <div className="flow-card-content">
                    <div className="flow-meta-row">
                      <span className="flow-card-badge">{step.badge}</span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* A PALAVRA 'A - R - E - A' CONECTANDO TODOS OS COMPONENTES ABAIXO DOS CARDS */}
          <div className="area-connect-strip" data-motion="up">
            <div className="area-connect-wire">
              <span
                className="area-wire-current"
                style={{
                  left: `${12.5 + activeStep * 25}%`,
                }}
              />
            </div>

            <div className="area-letters-grid">
              {steps.map((step, index) => {
                const isSelected = activeStep === index
                return (
                  <button
                    key={`letter-${index}`}
                    type="button"
                    className={`area-letter-box ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setActiveStep(index)}
                    aria-label={`Passo ${step.num}: ${step.letter} - ${step.letterWord}`}
                  >
                    <span className="area-letter-char">{step.letter}</span>
                    <span className="area-letter-word">{step.letterWord}</span>
                    <span className="area-letter-indicator" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
