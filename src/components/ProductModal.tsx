import { useEffect } from 'react'
import type { ProjectItem } from '../data'

interface ProductModalProps {
  item: ProjectItem | null
  onClose: () => void
  onSelectForQuote: (item: ProjectItem) => void
}

export default function ProductModal({ item, onClose, onSelectForQuote }: ProductModalProps) {
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
    <div className="product-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="product-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <button
          type="button"
          className="product-modal-close"
          onClick={onClose}
          aria-label="Fechar detalhes do item"
        >
          ✕
        </button>

        <div className="product-modal-grid">
          {/* Lado Esquerdo: Imagem do Produto com Badge Oficial */}
          <div className="product-modal-media">
            <div className="product-modal-img-wrap">
              <img
                src={item.tickerImage || item.image}
                alt={item.name}
                loading="eager"
              />
            </div>
            <div className="product-modal-media-foot">
              <span className="product-modal-pill">Pronta-entrega</span>
              <span className="product-modal-pill blue">Homologado</span>
            </div>
          </div>

          {/* Lado Direito: Informações Detalhadas e Ações */}
          <div className="product-modal-info">
            <div className="product-modal-meta">
              <span className="product-modal-code">{item.code}</span>
              {item.category && <span className="product-modal-category">{item.category}</span>}
            </div>

            <h3 id="product-modal-title" className="product-modal-title">
              {item.name}
            </h3>

            {item.description && (
              <p className="product-modal-desc">{item.description}</p>
            )}

            {item.specs && item.specs.length > 0 && (
              <div className="product-modal-specs-box">
                <h4>Especificações do Material:</h4>
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
                <span className="unit-label">Fornecimento:</span>
                <strong className="unit-val">{item.unit}</strong>
              </div>
            )}

            {/* Ações de Cotação */}
            <div className="product-modal-actions">
              <button
                type="button"
                className="btn btn-navy product-modal-quote-btn"
                onClick={() => {
                  onSelectForQuote(item)
                  onClose()
                }}
              >
                <span>Cotar este item agora</span>
                <span className="btn-arrow">→</span>
              </button>

              <button
                type="button"
                className="btn btn-outline product-modal-cancel-btn"
                onClick={onClose}
              >
                Continuar navegando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

