import { BookOpen, Bus, ChevronRight, Compass, Eye, FileText, Home, Info, Map, Sparkles, UsersRound, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { groupedDocs } from '../lib/documents'

const categoryIcons: Record<string, LucideIcon> = {
  '开始了解': Sparkles,
  '校园生活': Home,
  '学习指南': BookOpen,
  '校园服务': Compass,
  '交通与地图': Map,
  '社团资讯': UsersRound,
  '关于本站': Info,
}

type SidebarProps = {
  open: boolean
  onClose: () => void
  visitCount: number | null
  visitCountFailed: boolean
}

export function Sidebar({ open, onClose, visitCount, visitCountFailed }: SidebarProps) {
  return (
    <>
      <div className={`sidebar-scrim ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar-mobile-head">
          <span>浏览指南</span>
          <button className="icon-button" onClick={onClose} aria-label="关闭导航"><X size={20} /></button>
        </div>
        <div className="sidebar-scroll">
          <div className="sidebar-intro">
            <span className="eyebrow"><span className="status-dot" /> 社区维护中</span>
            <p>由三中人共同编写的校园生活手册。</p>
          </div>
          <div className="visit-counter" aria-live="polite">
            <span className="visit-counter-icon"><Eye size={16} /></span>
            <span>
              <small>累计访问次数</small>
              <strong>
                {visitCountFailed
                  ? '暂不可用'
                  : visitCount === null
                    ? '统计中…'
                    : visitCount.toLocaleString('zh-CN')}
              </strong>
            </span>
          </div>
          {Object.entries(groupedDocs).map(([category, items]) => {
            const Icon = categoryIcons[category] ?? FileText
            return (
              <section className="nav-section" key={category}>
                <div className="nav-heading"><Icon size={15} />{category}</div>
                <div className="nav-list">
                  {items.map((doc) => (
                    <NavLink
                      key={doc.slug}
                      to={doc.path}
                      onClick={onClose}
                      className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                      <span>{doc.title}</span><ChevronRight size={14} />
                    </NavLink>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
        <div className="sidebar-footer"><Bus size={15} /><span>祝你在三中的每一天都有收获</span></div>
      </aside>
    </>
  )
}
