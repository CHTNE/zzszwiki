import { Code2, Menu, Moon, Search, Sun } from 'lucide-react'
import { Logo } from './Logo'

type HeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenMenu: () => void
  onOpenSearch: () => void
}

export function Header({ theme, onToggleTheme, onOpenMenu, onOpenSearch }: HeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="icon-button mobile-menu" onClick={onOpenMenu} aria-label="打开导航">
          <Menu size={21} />
        </button>
        <Logo />
        <button className="search-trigger" onClick={onOpenSearch}>
          <Search size={16} />
          <span>搜索校园指南…</span>
          <kbd>Ctrl K</kbd>
        </button>
        <nav className="header-actions" aria-label="快捷操作">
          <a className="text-link" href="https://zzsz-wiki.chtne.com" target="_blank" rel="noreferrer">
            主页
          </a>
          <button className="icon-button" onClick={onToggleTheme} aria-label={`切换为${theme === 'light' ? '黑夜' : '白天'}主题`}>
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <a className="icon-button github-link" href="https://github.com/CHTNE/zzszwiki" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Code2 size={19} />
          </a>
        </nav>
      </div>
    </header>
  )
}
