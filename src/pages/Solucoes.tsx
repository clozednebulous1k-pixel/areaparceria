import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductModal from '../components/ProductModal'
import { projectItems, type ProjectItem } from '../data'

export default function Solucoes() {
  const [modalItem, setModalItem] = useState<ProjectItem | null>(null)
  const navigate = useNavigate()

  return (
    <main>
      <section className="page-hero">
        <div className="wrap page-title" data-motion="up">
          <div className="section-index">Materiais</div>
          <h1>Linha de materiais homologados para a obra.</h1>
          <p>Itens de pronta-entrega para rede, energia e infraestrutura em atendimento nacional.</p>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <div className="section-head" data-motion="up">
            <div>
              <div className="section-index">Catálogo de Itens</div>
              <h2>Materiais homologados e prontos para separação.</h2>
              <p className="catalog-preview-sub">
                Selecione os itens da sua lista ou solicite separação personalizada de qualquer produto adicional.
              </p>
            </div>
            <Link to="/contato" className="btn btn-navy">
              Cotar lista completa ↗
            </Link>
          </div>

          <div className="sku-grid">
            {projectItems.map((item) => (
              <article key={item.code} className="sku" data-motion="zoom">
                <div
                  className="sku-thumb"
                  onClick={() => setModalItem(item)}
                  title={`Clique para ver detalhes de ${item.name}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setModalItem(item)
                  }}
                >
                  <img src={item.image} alt={item.name} />
                  <span className="sku-badge">Pronta-entrega</span>
                </div>
                <div className="sku-content">
                  <span className="sku-code">{item.code}</span>
                  <strong
                    className="sku-title"
                    onClick={() => setModalItem(item)}
                    style={{ cursor: 'pointer' }}
                    title={`Clique para ver detalhes de ${item.name}`}
                  >
                    {item.name}
                  </strong>
                  <div className="sku-action">
                    <span className="sku-spec">Especificação Oficial</span>
                    <Link
                      to={`/contato?item=${encodeURIComponent(item.name)}&codigo=${encodeURIComponent(item.code)}`}
                      className="sku-quote-link"
                    >
                      Cotar item →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Banner / Botão de sugestão de separação de itens não encontrados */}
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
                Nossa equipe técnica cota e faz a separação especial de qualquer item elétrico, de rede ou infraestrutura da sua planilha.
              </p>
            </div>
            <div className="custom-item-action">
              <Link to="/contato" className="btn btn-navy custom-item-btn">
                <span>Sugerir separação de item</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Detalhes do Produto */}
      <ProductModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onSelectForQuote={(item) => {
          navigate(`/contato?item=${encodeURIComponent(item.name)}&codigo=${encodeURIComponent(item.code)}`)
        }}
      />
    </main>
  )
}
