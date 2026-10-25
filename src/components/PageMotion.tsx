import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageMotion() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Ao montar ou mudar de rota, remove is-in para reiniciar a animação
    const nodes = document.querySelectorAll<HTMLElement>('[data-motion]')
    nodes.forEach((node) => node.classList.remove('is-in'))

    // Inicia a observação no próximo frame com transição visível
    const rafId = requestAnimationFrame(() => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in')
            } else {
              entry.target.classList.remove('is-in')
            }
          }
        },
        {
          threshold: [0, 0.15],
          rootMargin: '-5% 0px -5% 0px',
        },
      )

      nodes.forEach((node) => io.observe(node))

      return () => io.disconnect()
    })

    return () => cancelAnimationFrame(rafId)
  }, [pathname])

  return null
}
