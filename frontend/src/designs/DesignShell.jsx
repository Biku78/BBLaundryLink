import { useEffect, useRef } from 'react'
import '@fontsource/outfit/latin-400.css'
import '@fontsource/outfit/latin-600.css'
import '@fontsource/outfit/latin-700.css'
import '@fontsource/outfit/latin-800.css'
import '@fontsource/outfit/latin-900.css'
import '@fontsource/plus-jakarta-sans/latin-400.css'
import '@fontsource/plus-jakarta-sans/latin-500.css'
import '@fontsource/plus-jakarta-sans/latin-600.css'
import '@fontsource/plus-jakarta-sans/latin-700.css'
import '@fontsource/plus-jakarta-sans/latin-800.css'
import './design.generated.css'
import './integration.css'

export default function DesignShell({ children }) {
  const root = useRef(null)
  useEffect(() => {
    let active = null
    let previous = null
    let overflow = ''
    function sync() {
      const dialog = root.current?.querySelector('[data-design-dialog]')
      if (dialog === active) return
      if (active) { document.body.style.overflow = overflow; previous?.focus() }
      active = dialog
      if (dialog) {
        previous = document.activeElement
        overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        dialog.focus()
      }
    }
    function keydown(event) {
      if (!active) return
      if (event.key === 'Escape') active.parentElement.click()
      if (event.key !== 'Tab') return
      const nodes = [...active.querySelectorAll('button, input, select, a[href]')].filter(node => !node.disabled && node.getClientRects().length)
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === active)) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === active)) { event.preventDefault(); first?.focus() }
    }
    const observer = new MutationObserver(sync)
    observer.observe(root.current, { childList: true, subtree: true })
    document.addEventListener('keydown', keydown)
    return () => { observer.disconnect(); document.removeEventListener('keydown', keydown); if (active) document.body.style.overflow = overflow }
  }, [])
  return <div ref={root} className="provided-design">{children}<div className="design-preview-label" role="note">Design preview · Sample partners, reviews, wallet & tracking · Booking and payment not live</div></div>
}
