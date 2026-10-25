import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageMotion() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Pequeno delay para garantir montagem do DOM
    const timer = setTimeout(() => {
      const nodes = document.querySelectorAll<HTMLElement>('[data-motion]')
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            entry.target.classList.toggle('is-in', entry.isIntersecting)
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
      )
      nodes.forEach((node) => io.observe(node))
      return () => io.disconnect()
    }, 40)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
