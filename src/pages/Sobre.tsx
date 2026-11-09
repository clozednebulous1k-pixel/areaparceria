import { Link } from 'react-router-dom'

export default function Sobre() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap page-title" data-motion="up">
          <div className="section-index">A AREA</div>
          <h1>Parceiro técnico de quem executa o projeto.</h1>
          <p>
            Materiais elétricos, rede e infraestrutura com estoque e entrega para
            o canteiro — do lote à escola.
          </p>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap grid-2">
          <div data-motion="left">
            <p>
              A AREA nasceu com Alexandre e Anderson para servir obra de verdade:
              lista completa, norma técnica e prazo. Hoje operamos lojas e centros
              de distribuição para atender quem ganha lote e precisa comprar
              material sem atraso.
            </p>
            <p>
              Nosso papel é claro: ser o fornecedor oficial da sua operação — um
              ponto único de pedido para eletroduto, cabo, conectividade e
              energia com suporte técnico e pronta-entrega.
            </p>
            <Link to="/contato" className="btn btn-navy" style={{ marginTop: 20 }}>
              Solicitar cotação
            </Link>
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
    </main>
  )
}
