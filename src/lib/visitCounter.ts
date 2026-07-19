const endpoint = '/api/number'

let initialVisitRequest: Promise<number> | undefined

const readVisitCount = async (response: Response): Promise<number> => {
  if (!response.ok) throw new Error(`访问统计接口返回 ${response.status}`)

  const body: unknown = await response.json()
  const value = typeof body === 'number'
    ? body
    : body && typeof body === 'object'
      ? (body as Record<string, unknown>).number
        ?? (body as Record<string, unknown>).count
        ?? (body as Record<string, unknown>).value
      : undefined

  const count = typeof value === 'string' ? Number(value) : value
  if (typeof count !== 'number' || !Number.isFinite(count)) {
    throw new Error('访问统计接口返回了无法识别的数据')
  }
  return count
}

/** 记录本次页面加载，并返回更新后的累计访问次数。 */
export const recordInitialVisit = () => {
  // React StrictMode 在开发环境会重复执行 effect，共用 Promise 可避免重复计数。
  initialVisitRequest ??= (async () => {
    const updateResponse = await fetch(endpoint, { method: 'POST' })
    if (!updateResponse.ok) throw new Error(`访问统计接口返回 ${updateResponse.status}`)

    return readVisitCount(await fetch(endpoint))
  })()

  return initialVisitRequest
}
