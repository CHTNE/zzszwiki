export type DocMeta = {
  title: string
  description: string
  category: string
  order: number
  updated: string
}

export type Doc = DocMeta & {
  slug: string
  content: string
  path: string
}

export type TocItem = {
  level: number
  text: string
  id: string
}

const rawDocuments = import.meta.glob<string>('/docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const parseFrontmatter = (source: string) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  const values: Record<string, string> = {}

  if (!match) return { values, content: source }

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    values[key] = value
  }

  return { values, content: source.slice(match[0].length) }
}

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')

export const docs: Doc[] = Object.entries(rawDocuments)
  .map(([path, source]) => {
    const { values, content } = parseFrontmatter(source)
    const slug = path.replace(/^\/docs\//, '').replace(/\.md$/, '')
    return {
      title: values.title ?? slug.split('/').at(-1) ?? slug,
      description: values.description ?? '',
      category: values.category ?? '校园指南',
      order: Number(values.order ?? 999),
      updated: values.updated ?? '',
      slug,
      content,
      path: `/docs/${slug}`,
    }
  })
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN'))

export const groupedDocs = docs.reduce<Record<string, Doc[]>>((groups, doc) => {
  ;(groups[doc.category] ??= []).push(doc)
  return groups
}, {})

export const getDoc = (slug?: string) => docs.find((doc) => doc.slug === slug)

export const getToc = (content: string): TocItem[] =>
  content
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      level: match[1].length,
      text: match[2].replace(/[*_`]/g, '').trim(),
      id: slugify(match[2].replace(/[*_`]/g, '')),
    }))

export const searchDocs = (query: string) => {
  const normalized = query.trim().toLocaleLowerCase('zh-CN')
  if (!normalized) return docs
  return docs.filter((doc) =>
    [doc.title, doc.description, doc.category, doc.content]
      .join(' ')
      .toLocaleLowerCase('zh-CN')
      .includes(normalized),
  )
}
