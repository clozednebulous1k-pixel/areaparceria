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
              Operamos com uma rede integrada de <strong>unidades físicas e Centros de Distribuição estratégicos</strong> (São Paulo, Sorocaba,
              Mogi Guaçu, Praia Grande, Joinville, Manaus e Recife), garantindo escoamento ágil e logística dedicada do canteiro à escola em qualquer estado do Brasil.
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

      {/* Galeria do Impacto em Escolas e Projetos de Conectividade */}
      <section className="section tight">
        <div className="wrap">
          <div className="section-head" data-motion="up">
            <div>
              <div className="section-index">Presença em Campo</div>
              <h2>Conectando o futuro de milhares de alunos.</h2>
              <p style={{ color: 'var(--muted)', marginTop: 8, maxWidth: 640 }}>
                Veja alguns dos ambientes, laboratórios e escolas que já utilizam infraestrutura de rede, energia e materiais fornecidos pela AREA.
              </p>
            </div>
            <Link to="/contato" className="btn btn-outline">
              Falar com nossa equipe técnica ↗
            </Link>
          </div>

          <div className="school-gallery-grid">
            <figure className="school-gallery-card featured" data-motion="zoom">
              <div className="gallery-img-wrap">
                <img src="/img/escolas_conectadas.jpg" alt="Inclusão e Acessibilidade Digital" />
                <span className="gallery-badge">Inclusão Digital</span>
              </div>
              <figcaption className="gallery-caption">
                <strong>Programa Escolas Conectadas</strong>
                <p>Acessibilidade, tablets e infraestrutura de alta velocidade para alunos com necessidades especiais.</p>
              </figcaption>
            </figure>

            <figure className="school-gallery-card" data-motion="up" style={{ '--d': '0.1s' } as React.CSSProperties}>
              <div className="gallery-img-wrap">
                <img src="/img/escola_indigena.jpg" alt="Conectividade em Comunidades Indígenas" />
                <span className="gallery-badge">Comunidades Indígenas</span>
              </div>
              <figcaption className="gallery-caption">
                <strong>Conectividade sem Fronteiras</strong>
                <p>Levando energia e internet para escolas em aldeias e áreas remotas de difícil acesso.</p>
              </figcaption>
            </figure>

            <figure className="school-gallery-card" data-motion="up" style={{ '--d': '0.2s' } as React.CSSProperties}>
              <div className="gallery-img-wrap">
                <img src="/img/escola_lab_info.jpg" alt="Laboratório de Informática Escolar" />
                <span className="gallery-badge">Laboratórios</span>
              </div>
              <figcaption className="gallery-caption">
                <strong>Salas de Informática & Redes</strong>
                <p>Cabeamento estruturado CAT6, racks, patch panels e alimentação elétrica estabilizada.</p>
              </figcaption>
            </figure>

            <figure className="school-gallery-card" data-motion="up" style={{ '--d': '0.3s' } as React.CSSProperties}>
              <div className="gallery-img-wrap">
                <img src="/img/escola_sala_aula.jpg" alt="Salas de Aula Conectadas" />
                <span className="gallery-badge">Ensino Moderno</span>
              </div>
              <figcaption className="gallery-caption">
                <strong>Capacitação e Futuro</strong>
                <p>Ambientes digitais completos para alunos desenvolverem habilidades tecnológicas.</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </main>
  )
}
