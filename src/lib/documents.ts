import categoryConfig from '../../docs/categories.json'

export type DocMeta = {
  title: string
  description: string
  category: string
  categoryPath: string
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

export type DocCategory = {
  path: string
  name: string
  order: number
  docs: Doc[]
}

type CategoryConfig = Record<string, {
  name: string
  order: number
}>

const rawDocuments = import.meta.glob<string>('/docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const configuredCategories = Object.entries(categoryConfig as CategoryConfig)
  .map(([path, category]) => ({ path, ...category }))
  .sort((a, b) => a.order - b.order || a.path.localeCompare(b.path))

const categoriesByPath = new Map(
  configuredCategories.map((category) => [category.path, category]),
)

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
    const categoryPath = slug.split('/').slice(0, -1).join('/')
    const category = categoriesByPath.get(categoryPath)

    if (!category) {
      throw new Error(
        `文档 ${path} 所在的分类目录 "${categoryPath || '(docs 根目录)'}" 未在 docs/categories.json 中配置`,
      )
    }

    return {
      title: values.title ?? slug.split('/').at(-1) ?? slug,
      description: values.description ?? '',
      category: category.name,
      categoryPath,
      order: Number(values.order ?? 999),
      updated: values.updated ?? '',
      slug,
      content,
      path: `/docs/${slug}`,
    }
  })
  .sort((a, b) =>
    (categoriesByPath.get(a.categoryPath)?.order ?? 999)
    - (categoriesByPath.get(b.categoryPath)?.order ?? 999)
    || a.order - b.order
    || a.title.localeCompare(b.title, 'zh-CN'),
  )

export const docCategories: DocCategory[] = configuredCategories
  .map((category) => ({
    ...category,
    docs: docs
      .filter((doc) => doc.categoryPath === category.path)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN')),
  }))
  .filter((category) => category.docs.length > 0)

// Keep page navigation in exactly the same order as the grouped sidebar.
export const navigationDocs = docCategories.flatMap((category) => category.docs)

export const getDoc = (slug?: string) => docs.find((doc) => doc.slug === slug)

export const getLegacyDoc = (slug?: string) => {
  if (!slug || slug.includes('/')) return undefined
  const matches = docs.filter((doc) => doc.slug.split('/').at(-1) === slug)
  return matches.length === 1 ? matches[0] : undefined
}

export const getToc = (content: string): TocItem[] =>
  content
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,3})\s+(.+)$/))
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
