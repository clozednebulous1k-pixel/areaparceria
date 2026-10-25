import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageMotion() {
  const { pathname } = useLocation()

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-motion]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-in', entry.isIntersecting)
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [pathname])

  return null
}
