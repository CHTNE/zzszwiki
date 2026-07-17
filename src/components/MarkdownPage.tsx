import { ArrowLeft, ArrowRight, CalendarDays, Clock3, ExternalLink, Link as LinkIcon } from 'lucide-react'
import { Children, isValidElement, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { Link, Navigate, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { docs, getDoc, getToc, slugify } from '../lib/documents'

const nodeText = (children: ReactNode): string =>
  Children.toArray(children).map((child) => {
    if (typeof child === 'string' || typeof child === 'number') return String(child)
    if (isValidElement<{ children?: ReactNode }>(child)) return nodeText(child.props.children)
    return ''
  }).join('')

const heading = (Tag: 'h2' | 'h3') => ({ children }: { children?: ReactNode }) => {
  const id = slugify(nodeText(children))
  return (
    <Tag id={id}>
      <a className="heading-anchor" href={`#${id}`} aria-label="复制此标题链接"><LinkIcon size={16} /></a>
      {children}
    </Tag>
  )
}

const markdownComponents: Components = {
  h2: heading('h2'),
  h3: heading('h3'),
  a: ({ href = '', children, ...props }) => {
    if (href.startsWith('/')) return <Link to={href} {...props}>{children}</Link>
    const external = href.startsWith('http')
    return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} {...props}>{children}{external && <ExternalLink className="external-icon" size={13} />}</a>
  },
  input: ({ type, ...props }) => <input type={type} {...props} disabled={type === 'checkbox' || props.disabled} />,
}

export function MarkdownPage() {
  const { '*': slug } = useParams()
  const doc = getDoc(slug)

  if (!doc) return <NotFound />

  const toc = getToc(doc.content)
  const currentIndex = docs.findIndex((item) => item.slug === doc.slug)
  const previous = docs[currentIndex - 1]
  const next = docs[currentIndex + 1]
  const readingMinutes = Math.max(1, Math.ceil(doc.content.length / 650))

  return (
    <>
      <main className="document-shell">
        <article className="document">
          <div className="breadcrumbs"><Link to="/docs/welcome">校园指南</Link><span>/</span><span>{doc.category}</span></div>
          <header className="article-header">
            <span className="article-kicker">{doc.category}</span>
            <h1>{doc.title}</h1>
            <p>{doc.description}</p>
            <div className="article-meta">
              <span><Clock3 size={14} />约 {readingMinutes} 分钟阅读</span>
              {doc.updated && <span><CalendarDays size={14} />更新于 {doc.updated}</span>}
            </div>
          </header>
          <div className="mobile-toc">
            <details>
              <summary>本页目录 · {toc.length} 个章节</summary>
              <div>{toc.map((item) => <a key={item.id} href={`#${item.id}`}>{item.text}</a>)}</div>
            </details>
          </div>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{doc.content}</ReactMarkdown>
          </div>
          <nav className="page-nav" aria-label="文档翻页">
            {previous ? <Link to={previous.path} className="page-nav-card previous"><span><ArrowLeft size={15} />上一篇</span><strong>{previous.title}</strong></Link> : <span />}
            {next ? <Link to={next.path} className="page-nav-card next"><span>下一篇<ArrowRight size={15} /></span><strong>{next.title}</strong></Link> : <span />}
          </nav>
          <footer className="article-footer">
            <p>发现内容有误或需要补充？欢迎帮助我们完善这份指南。</p>
            <a href="mailto:support@chtne.com">提交修改建议 <ArrowRight size={14} /></a>
            <p className="license-notice">
              如无特殊说明，本站所有文章均采用{' '}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans" target="_blank" rel="noreferrer">
                CC BY-SA 4.0 协议
              </a>
              。
            </p>
          </footer>
        </article>
      </main>
      <aside className="toc-sidebar">
        <div className="toc-sticky">
          <div className="toc-title">本页目录</div>
          <nav>
            {toc.map((item) => <a className={item.level === 3 ? 'toc-sub' : ''} key={item.id} href={`#${item.id}`}>{item.text}</a>)}
          </nav>
          <div className="toc-help"><span>没有找到需要的信息？</span><a href="mailto:support@chtne.com">联系我们</a></div>
        </div>
      </aside>
    </>
  )
}

function NotFound() {
  return (
    <main className="document-shell not-found">
      <div className="not-found-code">404</div>
      <h1>这页内容还没写好</h1>
      <p>它可能被移动了，也可能正等待一位热心同学来补充。</p>
      <Link className="primary-button" to="/docs/welcome">返回指南首页</Link>
    </main>
  )
}

export function DefaultRedirect() {
  return <Navigate to="/docs/welcome" replace />
}
