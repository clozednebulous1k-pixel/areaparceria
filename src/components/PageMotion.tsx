import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageMotion() {
  const { pathname } = useLocation()

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-motion]')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
          } else {
            // Só remove se estiver realmente fora da viewport ao rolar
            entry.target.classList.remove('is-in')
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: '10px 0px 10px 0px',
      },
    )

    nodes.forEach((node) => {
      // Se já está no viewport, mantém ou ativa
      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        node.classList.add('is-in')
      }
      io.observe(node)
    })

    return () => io.disconnect()
  }, [pathname])

  return null
}
