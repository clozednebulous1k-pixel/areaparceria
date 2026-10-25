import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import PageMotion from './components/PageMotion'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Solucoes from './pages/Solucoes'
import Unidades from './pages/Unidades'
import Noticias from './pages/Noticias'
import Noticia from './pages/Noticia'
import Contato from './pages/Contato'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <>
    <ScrollToTop />
    <PageMotion />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/a-area" element={<Sobre />} />
        <Route path="/solucoes" element={<Solucoes />} />
        <Route path="/unidades" element={<Unidades />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:slug" element={<Noticia />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </>
  )
}
