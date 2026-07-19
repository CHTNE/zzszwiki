import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { MarkdownPage } from './components/MarkdownPage'
import { SearchDialog } from './components/SearchDialog'
import { Sidebar } from './components/Sidebar'
import { recordInitialVisit } from './lib/visitCounter'

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('zzsz-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [visitCount, setVisitCount] = useState<number | null>(null)
  const [visitCountFailed, setVisitCountFailed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let active = true
    recordInitialVisit()
      .then((count) => {
        if (active) setVisitCount(count)
      })
      .catch(() => {
        if (active) setVisitCountFailed(true)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('zzsz-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121816' : '#f7f7f4')
  }, [theme])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((value) => value === 'light' ? 'dark' : 'light')}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        visitCount={visitCount}
        visitCountFailed={visitCountFailed}
      />
      <div className="content-grid">
        <Routes>
          <Route path="/" element={<Navigate to="/docs/welcome" replace />} />
          <Route path="/docs/*" element={<MarkdownPage />} />
          <Route path="*" element={<Navigate to="/docs/not-found" replace />} />
        </Routes>
      </div>
      {searchOpen && <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />}
    </div>
  )
}

export default App
