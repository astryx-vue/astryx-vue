import { describe, expect, it } from 'vitest'
import { isSafeDestination, isSafeUrl, sanitizeUrl } from './safeUrl.js'

describe('safeUrl', () => {
  it('接受普通地址和相对路径', () => {
    expect(isSafeUrl('https://example.com/docs')).toBe(true)
    expect(isSafeUrl('/docs')).toBe(true)
    expect(isSafeUrl('mailto:ada@example.com')).toBe(true)
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com')
  })

  it('拒绝脚本协议和会当成页面打开的 data 地址', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false)
    expect(isSafeUrl('  javascript:alert(1)')).toBe(false)
    expect(isSafeUrl('JavaScript:alert(1)')).toBe(false)
    expect(isSafeUrl('\u0000javascript:alert(1)')).toBe(false)
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false)
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    expect(isSafeUrl('data: text/html,hi')).toBe(false)
    expect(isSafeUrl('data:image/svg+xml,<svg></svg>')).toBe(true)
  })

  it('检查路由对象上的路径、href 和协议', () => {
    expect(isSafeDestination(null)).toBe(true)
    expect(isSafeDestination('/ok')).toBe(true)
    expect(isSafeDestination({ pathname: '/ok' })).toBe(true)
    expect(isSafeDestination({ pathname: 'javascript:alert(1)' })).toBe(false)
    expect(isSafeDestination({ href: 'javascript:1' })).toBe(false)
    expect(isSafeDestination({ protocol: 'javascript:', pathname: 'alert(1)' })).toBe(false)
    expect(isSafeDestination({ protocol: 'https', host: 'example.com', pathname: '/ok' })).toBe(true)
    expect(isSafeDestination(1)).toBe(false)
  })
})
