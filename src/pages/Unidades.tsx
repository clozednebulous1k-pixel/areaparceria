import { useMemo, useState } from 'react'
import { stores } from '../data'

function mapSrc(lat: number, lng: number) {
  const d = 0.035
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`
}

export default function Unidades() {
  const [active, setActive] = useState(stores[0].city)
  const store = useMemo(() => stores.find((s) => s.city === active) ?? stores[0], [active])

  return (
    <main>
      <section className="page-hero">
        <div className="wrap page-title">
          <div className="section-index">Unidades</div>
          <h1>Lojas e mapa da região.</h1>
          <p>Clique na unidade para abrir o mapa ao lado.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap units-layout">
          <div className="store-list">
            {stores.map((s) => (
              <button
                key={s.city}
                type="button"
                className={`card store store-btn ${active === s.city ? 'is-active' : ''}`}
                onClick={() => setActive(s.city)}
              >
                <div className="uf">
                  {s.uf} · {s.label}
                </div>
                <h3>{s.city}</h3>
                <p>{s.address}</p>
                <p>
                  <strong>{s.phone}</strong>
                </p>
              </button>
            ))}
          </div>
          <aside className="map-panel">
            <div className="map-caption">
              <strong>{store.city}</strong>
              <span>{store.label} — {store.uf}</span>
            </div>
            <iframe
              title={`Mapa da loja ${store.city}`}
              src={mapSrc(store.lat, store.lng)}
              loading="lazy"
            />
            <a
              className="map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              Abrir no Google Maps
            </a>
          </aside>
        </div>
      </section>
    </main>
  )
}
