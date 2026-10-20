import { describe, expect, it } from 'vitest'
import { checkUpstream, oursPageFile, preflight } from '../scripts/swarm/visual-ci.mjs'

function fakeFetch(statuses: Array<number | Error>) {
  const calls: string[] = []
  const impl = async (url: string) => {
    calls.push(url)
    const next = statuses.shift()
    if (next instanceof Error)
      throw next
    return { status: next, ok: next! >= 200 && next! < 300 } as Response
  }
  return { impl, calls }
}

describe('上游预检', () => {
  it('200 通过', async () => {
    const { impl } = fakeFetch([200])
    expect(await checkUpstream('https://u/components/Button', { fetchImpl: impl })).toEqual({ ok: true })
  })

  it('404 直接判定不存在，不重试', async () => {
    const { impl, calls } = fakeFetch([404])
    const result = await checkUpstream('https://u/components/Nope', { fetchImpl: impl })
    expect(result).toEqual({ ok: false, reason: '上游没有这个页面（HTTP 404）：https://u/components/Nope' })
    expect(calls).toHaveLength(1)
  })

  it('网络错误和 5xx 会重试', async () => {
    const { impl, calls } = fakeFetch([new Error('reset'), 503, 200])
    expect(await checkUpstream('https://u/x', { fetchImpl: impl, retries: 2 })).toEqual({ ok: true })
    expect(calls).toHaveLength(3)
  })

  it('重试用完仍失败时给出原因', async () => {
    const { impl } = fakeFetch([503, 503])
    const result = await checkUpstream('https://u/x', { fetchImpl: impl, retries: 1 })
    expect(result.ok).toBe(false)
    expect((result as { reason: string }).reason).toContain('HTTP 503')
  })
})

describe('组件预检', () => {
  it('我们没有页面时不访问上游', async () => {
    const { impl, calls } = fakeFetch([200])
    const result = await preflight('Buton', { root: '/repo', fileExists: () => false, fetchImpl: impl })
    expect(result.ok).toBe(false)
    expect((result as { reason: string }).reason).toContain('apps/docs/docs/en/components/buton/index.md')
    expect(calls).toHaveLength(0)
  })

  it('两边都在时通过，并给出统一后的名字', async () => {
    const { impl, calls } = fakeFetch([200])
    const seen: string[] = []
    const result = await preflight('dropdown-menu', {
      root: '/repo',
      upstreamOrigin: 'https://u',
      fileExists: (f: string) => {
        seen.push(f)
        return true
      },
      fetchImpl: impl,
    })
    expect(result.ok).toBe(true)
    expect(result.urls.name).toBe('DropdownMenu')
    expect(seen).toEqual([oursPageFile('dropdown-menu', '/repo')])
    expect(calls).toEqual(['https://u/components/DropdownMenu'])
  })
})
