import { describe, expect, it } from 'vitest'
import { renderIconMarkup } from './svg'

describe('renderIconMarkup', () => {
  it('prefixes ids and their references, leaving look-alike attributes alone', () => {
    const body = '<defs><linearGradient id="g" data-id="keep"/></defs>'
      + '<use href="#g" data-href="#keep" xlink:href="#g"/><path fill="url(#g)"/>'
    const markup = renderIconMarkup({ body, width: 24, height: 24 }, 'p-')
    expect(markup).toContain('id="p-g"')
    expect(markup).toContain('data-id="keep"')
    expect(markup).toContain('href="#p-g"')
    expect(markup).toContain('data-href="#keep"')
    expect(markup).toContain('xlink:href="#p-g"')
    expect(markup).toContain('url(#p-g)')
  })
})
