import { Link } from 'react-router-dom'

export default function Sobre() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap page-title">
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
          <div>
            <p>
              A AREA nasceu com Alexandre e Anderson para servir obra de verdade:
              lista completa, norma técnica e prazo. Hoje operamos lojas e centros
              de distribuição para atender quem ganha lote e precisa comprar
              material sem atraso.
            </p>
            <p>
              Na Fase 6, o papel é claro: ser o fornecedor oficial da sua
              operação — um ponto de pedido para eletroduto, cabo, conectividade e
              energia.
            </p>
            <Link to="/contato" className="btn btn-navy" style={{ marginTop: 20 }}>
              Solicitar cotação
            </Link>
          </div>
          <div className="split-img">
            <img src="/img/warehouse.jpg" alt="Operação AREA" />
          </div>
        </div>
      </section>
    </main>
  )
}
