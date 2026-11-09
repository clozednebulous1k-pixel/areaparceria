import { Link } from 'react-router-dom'

export default function Sobre() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap page-title" data-motion="up">
          <div className="section-index">A AREA</div>
          <h1>Parceiro técnico e fornecedor oficial de quem executa.</h1>
          <p>
            Capacidade de suprimento, pontualidade de canteiro e conformidade técnica:
            conheça nossa atuação nos maiores projetos de infraestrutura e conectividade do país.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap grid-2">
          <div data-motion="left">
            <h2 style={{ fontSize: '1.75rem', color: 'var(--navy)', marginBottom: 16 }}>
              Estrutura robusta para abastecer sua obra de ponta a ponta.
            </h2>
            <p>
              A <strong>AREA Material Elétrico</strong> nasceu com Alexandre e Anderson com um compromisso inegociável:
              <strong> servir obra de verdade</strong>. Não apenas vendemos produtos, somos o braço operacional de quem
              arremata lotes públicos e privados e não pode correr riscos com atrasos, falta de estoque ou material fora de norma.
            </p>
            <p>
              Operamos com uma rede integrada de <strong>6 lojas físicas e Centros de Distribuição estratégicos</strong> (São Paulo, Sorocaba,
              Mogi Guaçu, Praia Grande, Joinville e Manaus), garantindo escoamento ágil e logística dedicada do canteiro à escola em qualquer estado do Brasil.
            </p>
            <p>
              Já fornecemos centenas de quilômetros de cabeamento de rede estruturada homologado, infraestrutura em PVC e metálica pesada,
              além de proteção elétrica completa para milhares de unidades conectadas. Quando você fecha com a AREA, recebe atendimento consultivo,
              faturamento unificado e previsibilidade total no cronograma.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 24 }}>
              <Link to="/contato" className="btn btn-navy">
                Solicitar cotação oficial
              </Link>
              <Link to="/solucoes" className="btn btn-outline">
                Ver catálogo técnico
              </Link>
            </div>
          </div>
          <div className="split-video-wrap" data-motion="right">
            <iframe
              className="youtube-embed"
              src="https://www.youtube-nocookie.com/embed/XSNCU4qO_cE?autoplay=1&mute=1&loop=1&playlist=XSNCU4qO_cE&controls=1&rel=0"
              title="Apresentação Institucional AREA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Métricas e destaques de atuação */}
      <section className="section alt tight">
        <div className="wrap">
          <div className="about-metrics-grid">
            <div className="about-metric-card" data-motion="up">
              <span className="about-metric-num">30.000+</span>
              <h4>Escolas e Unidades Atendidas</h4>
              <p>Fornecimento pontual em programas nacionais de conectividade e modernização predial.</p>
            </div>
            <div className="about-metric-card" data-motion="up" style={{ '--d': '0.1s' } as React.CSSProperties}>
              <span className="about-metric-num">6 Lojas & CDs</span>
              <h4>Centros de Distribuição</h4>
              <p>Presença estratégica com estoque regulador próprio no Sudeste, Sul e Norte.</p>
            </div>
            <div className="about-metric-card" data-motion="up" style={{ '--d': '0.2s' } as React.CSSProperties}>
              <span className="about-metric-num">100%</span>
              <h4>Homologado e Normatizado</h4>
              <p>Produtos com certificações ABNT, Anatel e especificações rigorosas de engenharia.</p>
            </div>
            <div className="about-metric-card" data-motion="up" style={{ '--d': '0.3s' } as React.CSSProperties}>
              <span className="about-metric-num">Zero</span>
              <h4>Paradas no Canteiro</h4>
              <p>Montagem de kits por lote, entrega programada e canal direto com nossos engenheiros.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
