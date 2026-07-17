import { FileText, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchDocs } from '../lib/documents'

type SearchDialogProps = {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const results = useMemo(() => searchDocs(query).slice(0, 7), [query])

  useEffect(() => {
    if (!open) return
    window.setTimeout(() => inputRef.current?.focus(), 30)
  }, [open])

  if (!open) return null

  const select = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <section className="search-dialog" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="搜索文档">
        <div className="search-input-wrap">
          <Search size={20} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onClose()
              if (event.key === 'Enter' && results[0]) select(results[0].path)
            }}
            placeholder="搜索校内地点、学习与生活…"
          />
          <button className="icon-button" onClick={onClose} aria-label="关闭搜索"><X size={18} /></button>
        </div>
        <div className="search-results">
          <div className="results-label">{query ? `找到 ${results.length} 篇相关内容` : '推荐阅读'}</div>
          {results.length ? results.map((doc) => (
            <button className="search-result" key={doc.slug} onClick={() => select(doc.path)}>
              <span className="result-icon"><FileText size={18} /></span>
              <span><strong>{doc.title}</strong><small>{doc.description}</small></span>
              <kbd>↵</kbd>
            </button>
          )) : (
            <div className="empty-search">没有找到相关内容，换个关键词试试。</div>
          )}
        </div>
        <div className="dialog-footer"><span><kbd>↑</kbd><kbd>↓</kbd> 浏览</span><span><kbd>Esc</kbd> 关闭</span></div>
      </section>
    </div>
  )
}
