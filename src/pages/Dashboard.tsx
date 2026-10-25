import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth'

const orders = [
  { id: 'AR-10482', date: '22/10/2026', client: 'Obra Campolim', status: 'Em separação', tone: 'separacao', total: 'R$ 4.890,00' },
  { id: 'AR-10461', date: '18/10/2026', client: 'Residencial Lapa', status: 'Faturado', tone: 'faturado', total: 'R$ 1.240,50' },
  { id: 'AR-10422', date: '09/10/2026', client: 'Shopping Mogi', status: 'Entregue', tone: 'entregue', total: 'R$ 18.320,00' },
  { id: 'AR-10390', date: '28/09/2026', client: 'Loja Praia Grande', status: 'Entregue', tone: 'entregue', total: 'R$ 670,90' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  return (
    <main className="section">
      <div className="wrap">
        <div className="dash-head">
          <div>
            <div className="section-index">Painel</div>
            <h1 className="dash-title">Olá, {user.name}</h1>
            <p>Aqui ficam os pedidos e orçamentos da sua conta.</p>
          </div>
          <button className="btn btn-outline" type="button" onClick={logout}>
            Sair
          </button>
        </div>
        <div className="table-wrap">
          <table className="orders">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Data</th>
                <th>Cliente / obra</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.date}</td>
                  <td>{o.client}</td>
                  <td>
                    <span className={`pill status-${o.tone}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>{o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
