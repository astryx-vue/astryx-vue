import { describe, expect, it } from 'vitest'
import { sanitizeUrl, validateUrl } from './linkUtils.js'

describe('scheme-less hosts with a port', () => {
  it('defaults a dotted host with a port to https', () => {
    expect(sanitizeUrl('example.com:8080/path')).toBe('https://example.com:8080/path')
    expect(validateUrl('example.com:8080')).toBe(true)
  })

  it('defaults localhost with a port to https', () => {
    expect(sanitizeUrl('localhost:3000')).toBe('https://localhost:3000/')
    expect(validateUrl('localhost:3000/app?x=1')).toBe(true)
  })

  it('keeps real schemes, including a scheme with digits after the colon', () => {
    expect(sanitizeUrl('tel:911')).toBe('tel:911')
    expect(sanitizeUrl('mailto:a@b.co')).toBe('mailto:a@b.co')
    expect(sanitizeUrl('data:text/plain,hi')).toBe('about:blank')
  })
})
