import { Link, useParams } from 'react-router-dom'
import { news } from '../data'

export default function Noticia() {
  const { slug } = useParams()
  const item = news.find((n) => n.slug === slug)

  if (!item) {
    return (
      <main className="section wrap">
        <h1>Matéria não encontrada.</h1>
        <Link to="/noticias">Voltar</Link>
      </main>
    )
  }

  return (
    <main>
      <section className="page-hero">
        <div className="wrap page-title article" data-motion="up">
          <div className="section-index">
            {item.category} · {item.date}
          </div>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap article">
          <div data-motion="zoom">
            <img
              src={item.image}
              alt=""
              style={{ width: '100%', borderRadius: 24, height: 380, objectFit: 'cover', marginBottom: 32 }}
            />
          </div>
          <p>
            Na AREA, acreditamos que especificação correta reduz retrabalho,
            aumenta a vida útil da instalação e protege quem usa o ambiente no
            dia a dia. Este conteúdo reúne pontos práticos que nossa equipe
            discute com eletricistas e projetistas nas lojas.
          </p>
          <p style={{ marginTop: 16 }}>
            Se precisar de apoio para montar a lista de materiais da sua obra,
            fale com a unidade mais próxima ou envie o orçamento pelo site.
            Temos estoque, marcas reconhecidas e orientação técnica para cada
            etapa — da infraestrutura à iluminação de acabamento.
          </p>
          <Link to="/contato" className="btn btn-navy" style={{ marginTop: 32 }}>
            Falar com a AREA
          </Link>
        </div>
      </section>
    </main>
  )
}
