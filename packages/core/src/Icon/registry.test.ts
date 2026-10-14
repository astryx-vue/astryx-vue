import { describe, expect, it } from 'vitest'
import { addCollection, addIcon, ASTRYX_ICON_QUEUE, getIcon, parseIconName, resetIcons, resolveCollectionIcon } from './registry.js'
import { iconToSVG, renderIconMarkup } from './svg.js'

describe('icon names', () => {
  it('reads collection:icon', () => {
    expect(parseIconName('carbon:settings', [])).toEqual({ prefix: 'carbon', name: 'settings' })
    expect(parseIconName('Material-Symbols:Home', [])).toEqual({ prefix: 'material-symbols', name: 'home' })
  })

  it('reads collection-icon only for a known prefix, and the longest prefix wins', () => {
    expect(parseIconName('carbon-settings', [])).toBeUndefined()
    expect(parseIconName('carbon-arrow-up', ['carbon'])).toEqual({ prefix: 'carbon', name: 'arrow-up' })
    expect(parseIconName('material-symbols-home', ['material', 'material-symbols'])).toEqual({
      prefix: 'material-symbols',
      name: 'home',
    })
  })

  it('resolves an alias onto its parent', () => {
    const icon = resolveCollectionIcon({
      prefix: 'carbon',
      width: 32,
      height: 32,
      icons: {
        settings: { body: '<path d="M0"/>' },
      },
      aliases: {
        cog: { parent: 'settings', hFlip: true },
      },
    }, 'cog')

    expect(icon).toMatchObject({ body: '<path d="M0"/>', width: 32, height: 32, hFlip: true })
  })

  it('lets a single icon and a collection answer getIcon', () => {
    resetIcons()
    addIcon('carbon:settings', { body: '<path d="one"/>', width: 16, height: 16 })
    expect(getIcon('carbon-settings')?.body).toBe('<path d="one"/>')

    addCollection({
      prefix: 'material-symbols',
      icons: { home: { body: '<path d="house"/>' } },
      width: 24,
      height: 24,
    })
    expect(getIcon('material-symbols-home')).toMatchObject({ body: '<path d="house"/>', width: 24, height: 24 })
    expect(getIcon('carbon:missing')).toBeUndefined()
    resetIcons()
  })

  it('takes icons the vite plugin left on the global queue', () => {
    resetIcons()
    const host = globalThis as { [ASTRYX_ICON_QUEUE]?: Array<[string, { body: string }]> }
    host[ASTRYX_ICON_QUEUE] = [['carbon:settings', { body: '<path d="q"/>' }]]
    expect(getIcon('carbon:settings')?.body).toBe('<path d="q"/>')
    expect(host[ASTRYX_ICON_QUEUE]).toEqual([])
    resetIcons()
  })

  it('builds a viewBox and prefixes ids', () => {
    expect(iconToSVG({ body: '<path/>', width: 32, height: 16, left: 1, top: 2 }).viewBox).toBe('1 2 32 16')
    const markup = renderIconMarkup({ body: '<path id="a" fill="url(#a)"/>' }, 'p1-')
    expect(markup).toContain('id="p1-a"')
    expect(markup).toContain('url(#p1-a)')
    expect(markup).toContain('aria-hidden="true"')
  })
})
