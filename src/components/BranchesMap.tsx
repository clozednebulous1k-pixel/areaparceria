import { useState } from 'react'
import { Link } from 'react-router-dom'
import { stores } from '../data'
import statesData from './brazilStates.json'

// Posições calculadas com precisão exata no viewBox (0 0 450 460) do mapa oficial do Brasil
// SP Center ~ (280, 327), Manaus (AM) ~ (162, 128), Joinville (SC) ~ (274, 382)
const branchCoordinates: Record<string, { x: number; y: number; labelPos: 'top' | 'bottom' | 'left' | 'right' }> = {
  'Manaus': { x: 162, y: 128, labelPos: 'top' },
  'Mogi Guaçu': { x: 284, y: 312, labelPos: 'top' },
  'Sorocaba': { x: 268, y: 334, labelPos: 'left' },
  'São Paulo': { x: 295, y: 336, labelPos: 'right' },
  'Praia Grande': { x: 298, y: 348, labelPos: 'right' },
  'Joinville': { x: 274, y: 382, labelPos: 'bottom' },
}

export default function BranchesMap() {
  const [selectedCity, setSelectedCity] = useState<string>('São Paulo')
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  const activeBranch = stores.find((s) => s.city === (hoveredCity || selectedCity)) || stores[0]

  const branchPoints = stores.map((store) => {
    const coords = branchCoordinates[store.city] || { x: 280, y: 327, labelPos: 'right' }
    return {
      ...store,
      x: coords.x,
      y: coords.y,
      pos: coords.labelPos,
    }
  })

  // Hub principal (São Paulo)
  const hub = branchPoints.find((b) => b.city === 'São Paulo') || branchPoints[0]

  return (
    <section className="branches-section">
      <div className="wrap">
        <div className="section-head" data-motion="up">
          <div>
            <div className="section-index">Rede de Atendimento e Distribuição</div>
            <h2>Presença conectada em todo o Brasil.</h2>
            <p className="branches-subtitle">
              Clique nos pontos das unidades no mapa para ver endereço, telefone e detalhes da filial.
            </p>
          </div>
          <Link to="/unidades" className="btn btn-outline">
            Ver todas as unidades
          </Link>
        </div>

        <div className="branches-map-card" data-motion="zoom">
          {/* Grade técnica sutil */}
          <div className="map-grid-bg" />

          <div className="map-interactive-layout">
            {/* O Mapa Oficial do Brasil com cada estado vetorizado */}
            <div className="map-svg-wrap">
              <svg
                id="svg-map"
                viewBox="0 0 450 460"
                className="brazil-official-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#2563eb" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0a2a5c" stopOpacity="0.8" />
                  </linearGradient>

                  <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Todos os 27 estados do Brasil - Branco com contorno azul elegante */}
                <g className="brazil-states-layer">
                  {statesData.map((state) => {
                    // Estados que têm filial ganham um sutil destaque
                    const hasBranch = ['saopaulo', 'amazonas', 'santacatarina'].includes(state.id)
                    return (
                      <path
                        key={state.id}
                        id={state.id}
                        d={state.d}
                        className={`brazil-state ${hasBranch ? 'has-branch' : ''}`}
                      />
                    )
                  })}
                </g>

                {/* Linhas de conexão entre o centro de distribuição e as filiais */}
                <g className="brazil-connections-layer">
                  {branchPoints.map((target) => {
                    if (target.city === hub.city) return null
                    // Curva de bezier suave conectando ao Hub
                    const midX = (hub.x + target.x) / 2 + (target.y < hub.y ? -25 : 15)
                    const midY = (hub.y + target.y) / 2
                    const isTargetActive =
                      selectedCity === target.city ||
                      hoveredCity === target.city ||
                      selectedCity === hub.city ||
                      hoveredCity === hub.city

                    return (
                      <g key={`conn-${target.city}`} className="connection-pair">
                        <path
                          d={`M ${hub.x},${hub.y} Q ${midX},${midY} ${target.x},${target.y}`}
                          className={`connection-track ${isTargetActive ? 'active' : ''}`}
                        />
                        <path
                          d={`M ${hub.x},${hub.y} Q ${midX},${midY} ${target.x},${target.y}`}
                          className={`connection-flow ${isTargetActive ? 'active' : ''}`}
                        />
                      </g>
                    )
                  })}
                </g>

                {/* Pontos clicáveis de cada filial */}
                <g className="brazil-points-layer">
                  {branchPoints.map((b) => {
                    const isSelected = selectedCity === b.city
                    const isHovered = hoveredCity === b.city
                    const isActive = isSelected || isHovered
                    const isHub = b.city === 'São Paulo'

                    return (
                      <g
                        key={`pin-${b.city}`}
                        className={`branch-point-group ${isActive ? 'is-active' : ''}`}
                        transform={`translate(${b.x}, ${b.y})`}
                        onClick={() => setSelectedCity(b.city)}
                        onMouseEnter={() => setHoveredCity(b.city)}
                        onMouseLeave={() => setHoveredCity(null)}
                      >
                        {/* Efeito Radar em anel expandindo */}
                        <circle r="14" className="pulse-aura" />
                        <circle r="8" className="pulse-aura delayed" />

                        {/* Marcador Base */}
                        <circle
                          r={isHub ? 6.5 : 5.5}
                          className={`pin-base ${isHub ? 'pin-hub' : ''} ${isActive ? 'selected' : ''}`}
                        />
                        {/* Ponto interior brilhante */}
                        <circle
                          r={isHub ? 3.5 : 2.8}
                          className="pin-center"
                        />

                        {/* Rótulo com nome da filial posicionado perfeitamente */}
                        <g
                          className={`pin-tooltip pos-${b.pos}`}
                          transform={
                            b.pos === 'top'
                              ? 'translate(0, -12)'
                              : b.pos === 'bottom'
                              ? 'translate(0, 18)'
                              : b.pos === 'left'
                              ? 'translate(-12, 3)'
                              : 'translate(12, 3)'
                          }
                        >
                          <text
                            textAnchor={b.pos === 'left' ? 'end' : b.pos === 'right' ? 'start' : 'middle'}
                            className="pin-title"
                          >
                            {b.city}
                          </text>
                          <text
                            textAnchor={b.pos === 'left' ? 'end' : b.pos === 'right' ? 'start' : 'middle'}
                            y="10"
                            className="pin-subtitle"
                          >
                            {b.label}
                          </text>
                        </g>
                      </g>
                    )
                  })}
                </g>
              </svg>
            </div>

            {/* Painel lateral interativo que mostra os dados da filial clicada/selecionada */}
            <div className="branch-detail-card" data-motion="right">
              <div className="card-badge">
                <span className="live-dot" />
                Unidade Selecionada
              </div>
              <h3 className="card-city">{activeBranch.city}</h3>
              <p className="card-label">
                {activeBranch.label} — {activeBranch.uf}
              </p>

              <div className="card-info-row">
                <span className="info-icon">📍</span>
                <p className="info-text">{activeBranch.address}</p>
              </div>

              <div className="card-info-row">
                <span className="info-icon">📞</span>
                <p className="info-text">
                  <strong>{activeBranch.phone}</strong>
                </p>
              </div>

              <div className="card-actions">
                <a
                  className="btn btn-navy card-btn"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeBranch.address)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir no Google Maps ↗
                </a>
                <Link to="/unidades" className="btn btn-outline card-btn">
                  Ver no mapa de unidades
                </Link>
              </div>
            </div>
          </div>

          {/* Seletores rápidos na parte inferior */}
          <div className="branches-legend">
            {branchPoints.map((b) => (
              <button
                key={b.city}
                type="button"
                className={`legend-pill ${selectedCity === b.city ? 'is-active' : ''}`}
                onClick={() => setSelectedCity(b.city)}
                onMouseEnter={() => setHoveredCity(b.city)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                <span className="legend-dot" />
                <div className="legend-info">
                  <strong>{b.city}</strong>
                  <span>{b.label} · {b.uf}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
