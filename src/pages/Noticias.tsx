import { Link } from 'react-router-dom'
import { news } from '../data'

export default function Noticias() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap page-title" data-motion="up">
          <div className="section-index">Notícias</div>
          <h1>Atualizações do projeto e da obra.</h1>
          <p>Novidades, guias e boas práticas do universo elétrico.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid-3">
          {news.map((n) => (
            <Link key={n.slug} to={`/noticias/${n.slug}`} className="card" data-motion="zoom">
              <img src={n.image} alt="" />
              <div className="card-body">
                <div className="tag">
                  {n.category} · {n.date}
                </div>
                <h3>{n.title}</h3>
                <p>{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
