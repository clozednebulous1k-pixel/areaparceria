import { projectItems, solutions } from '../data'

export default function Solucoes() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap page-title" data-motion="up">
          <div className="section-index">Materiais</div>
          <h1>Linha para rede, energia e infraestrutura.</h1>
          <p>Itens que a obra de conectividade pede no dia a dia do canteiro.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap grid-3">
          {solutions.map((s) => (
            <article key={s.slug} className="card" id={s.slug} data-motion={s.slug.length % 2 ? 'left' : 'right'}>
              <img src={s.image} alt={s.title} />
              <div className="card-body">
                <div className="tag">{s.kicker}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section alt tight">
        <div className="wrap">
          <div className="section-head" data-motion="up">
            <div>
              <div className="section-index">Amostra da lista</div>
              <h2>Pronto para cotar a planilha.</h2>
            </div>
          </div>
          <div className="sku-grid">
            {projectItems.map((item) => (
              <article key={item.code} className="sku" data-motion="zoom">
                <img src={item.image} alt={item.name} />
                <span>{item.code}</span>
                <strong>{item.name}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
