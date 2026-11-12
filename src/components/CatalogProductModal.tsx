import { useEffect } from 'react'
import type { ProjectItem } from '../data'

interface CatalogProductModalProps {
  item: ProjectItem | null
  onClose: () => void
  onSelectForQuote: (item: ProjectItem) => void
}

export default function CatalogProductModal({ item, onClose, onSelectForQuote }: CatalogProductModalProps) {
  useEffect(() => {
    if (!item) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div className="product-modal-overlay catalog-modal-theme" onClick={onClose} role="presentation">
      <div
        className="product-modal-card catalog-product-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-modal-title"
      >
        <button
          type="button"
          className="product-modal-close"
          onClick={onClose}
          aria-label="Fechar card do catálogo"
        >
          ✕
        </button>

        <div className="product-modal-grid catalog-modal-grid">
          {/* Lado Esquerdo: Card Oficial AREA do Catálogo */}
          <div className="catalog-modal-media">
            <div className="catalog-modal-card-preview">
              <img
                src={item.image}
                alt={item.name}
                loading="eager"
              />
            </div>
            <div className="catalog-modal-media-caption">
              <span>Card Oficial · Homologado AREA</span>
            </div>
          </div>

          {/* Lado Direito: Especificações e Opção de Cotação */}
          <div className="product-modal-info">
            <div className="product-modal-meta">
              <span className="product-modal-code">{item.code}</span>
              {item.category && <span className="product-modal-category">{item.category}</span>}
            </div>

            <h3 id="catalog-modal-title" className="product-modal-title">
              {item.name}
            </h3>

            {item.description && (
              <p className="product-modal-desc">{item.description}</p>
            )}

            {item.specs && item.specs.length > 0 && (
              <div className="product-modal-specs-box">
                <h4>Ficha Técnica do Material:</h4>
                <ul>
                  {item.specs.map((spec, i) => (
                    <li key={i}>
                      <span className="spec-bullet">✓</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.unit && (
              <div className="product-modal-unit-row">
                <span className="unit-label">Unidade de fornecimento:</span>
                <strong className="unit-val">{item.unit}</strong>
              </div>
            )}

            {/* Ações do Catálogo */}
            <div className="product-modal-actions">
              <button
                type="button"
                className="btn btn-navy product-modal-quote-btn"
                onClick={() => {
                  onSelectForQuote(item)
                  onClose()
                }}
              >
                <span>Cotar item do catálogo</span>
                <span className="btn-arrow">→</span>
              </button>

              <button
                type="button"
                className="btn btn-outline product-modal-cancel-btn"
                onClick={onClose}
              >
                Fechar e continuar navegando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
