import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildWeightedIcon, parseSVGPaths } from './buildWeightedIcon.js'
import { bellWeightedIcon, weightedStarterIcons } from './weightedIcons.js'
import WeightedIconSprite from './WeightedIconSprite.vue'
import WeightedSVGIcon from './WeightedSVGIcon.vue'
import { weightedIconSymbolId } from './weightedSymbol.js'

enableAutoUnmount(afterEach)

const svg = (d: string): string => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`

describe('buildWeightedIcon', () => {
  it('merges identical drawings at neighboring weights into one layer', () => {
    const icon = buildWeightedIcon('dot', {
      300: svg('M1 1'),
      400: svg('M1 1'),
      500: svg('M2 2'),
      600: svg('M3 3'),
      700: svg('M3 3'),
    })
    expect(icon.layers.map(layer => [layer.from, layer.to])).toEqual([[300, 400], [500, 500], [600, 700]])
  })

  it('covers every weight with the nearest kept drawing when weights are pruned', () => {
    const icon = buildWeightedIcon(
      'dot',
      { 300: svg('A'), 400: svg('B'), 500: svg('C'), 600: svg('D'), 700: svg('E') },
      { weights: [400, 600] },
    )
    // 300 -> 400 (nearest), 500 -> 600 (a tie goes heavier), 700 -> 600.
    expect(icon.layers.map(layer => [layer.from, layer.to, layer.paths[0]!.d])).toEqual([
      [300, 400, 'B'],
      [500, 700, 'D'],
    ])
  })

  it('keeps the even-odd fill rule and reads single-quoted attributes', () => {
    expect(parseSVGPaths('<svg><path fill-rule="evenodd" d="M0 0"/></svg>')).toEqual([{ d: 'M0 0', evenOdd: true }])
    expect(parseSVGPaths('<svg><path d=\'M1 1\' fill-rule=\'evenodd\'/></svg>')).toEqual([{ d: 'M1 1', evenOdd: true }])
  })

  it('refuses an icon with no drawing for any kept weight', () => {
    expect(() => buildWeightedIcon('none', {})).toThrow(/no drawing/)
  })

  it('demo icons cover all five weights without gaps', () => {
    expect(weightedStarterIcons).toHaveLength(15)
    for (const icon of weightedStarterIcons) {
      const covered = icon.layers.flatMap((layer) => {
        const weights: number[] = []
        for (let weight = layer.from; weight <= layer.to; weight += 100)
          weights.push(weight)
        return weights
      })
      expect(covered).toEqual([300, 400, 500, 600, 700])
    }
  })
})

describe('weightedSVGIcon', () => {
  it('draws one group per distinct drawing, inline', () => {
    const wrapper = mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon } })
    expect(wrapper.findAll('svg > g')).toHaveLength(bellWeightedIcon.layers.length)
    expect(wrapper.get('svg > g').classes()[0]).toMatch(/^astryx-weight-r\d{3}_\d{3}$/)
    expect(wrapper.find('use').exists()).toBe(false)
  })

  it('takes its size and color from the same attributes as SVGIcon', () => {
    const wrapper = mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon, size: 'lg', color: 'accent' } })
    expect(wrapper.attributes('data-size')).toBe('lg')
    expect(wrapper.attributes('data-color')).toBe('accent')
    expect(wrapper.classes()).toContain('astryx-svg-icon')
  })

  it('references the sprite symbol in sprite mode', () => {
    const id = weightedIconSymbolId(bellWeightedIcon)
    const sprite = mount(WeightedIconSprite, { props: { icons: [bellWeightedIcon] } })
    expect(sprite.find(`symbol#${id}`).exists()).toBe(true)
    expect(sprite.findAll('symbol g')).toHaveLength(bellWeightedIcon.layers.length)
    expect(sprite.attributes('aria-hidden')).toBe('true')
    const icon = mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon, sprite: true } })
    expect(icon.get('use').attributes('href')).toBe(`#${id}`)
    expect(icon.findAll('svg > g')).toHaveLength(0)
  })

  it('pins the weight through the override property', () => {
    const wrapper = mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon, weight: 700 } })
    expect((wrapper.get('svg').element as SVGElement).style.getPropertyValue('--astryx-icon-weight')).toBe('700')
    const free = mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon } })
    expect((free.get('svg').element as SVGElement).style.getPropertyValue('--astryx-icon-weight')).toBe('')
  })

  it('is decorative by default, named when labeled, and lets the caller win', () => {
    const decorative = mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon } })
    expect(decorative.get('svg').attributes('aria-hidden')).toBe('true')
    const named = mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon }, attrs: { 'aria-label': 'Alerts' } })
    expect(named.get('svg').attributes('role')).toBe('img')
    expect(named.get('svg').attributes('aria-hidden')).toBeUndefined()
    const hidden = mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon }, attrs: { 'aria-label': 'Alerts', 'aria-hidden': 'true' } })
    expect(hidden.get('svg').attributes('role')).toBeUndefined()
  })

  it('keeps a caller class beside its own', () => {
    const wrapper = mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon }, attrs: { class: 'mine' } })
    expect(wrapper.get('svg').classes()).toEqual(expect.arrayContaining(['mine', 'astryx-weighted-svg-icon__svg']))
  })
})

describe('the weight probe font', () => {
  /** Gives a document's window a FontFace and its document a font set. */
  function stubFonts(doc: Document): ReturnType<typeof vi.fn> {
    const faces = new Set<{ family: string }>()
    const add = vi.fn((face: { family: string }) => faces.add(face))
    const view = doc.defaultView as Window & { FontFace?: unknown }
    view.FontFace = class {
      family: string
      constructor(family: string) {
        this.family = family
      }

      load(): Promise<this> {
        return Promise.resolve(this)
      }
    }
    Object.defineProperty(doc, 'fonts', { configurable: true, value: { add, [Symbol.iterator]: () => faces.values() } })
    return add
  }

  it('is added once per document, even by a second copy of the module', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const frameDoc = iframe.contentDocument!
    const add = stubFonts(frameDoc)
    const first = await import('./weightProbe.js')
    vi.resetModules()
    const second = await import('./weightProbe.js')
    expect(second).not.toBe(first)
    first.registerWeightProbe(frameDoc)
    second.registerWeightProbe(frameDoc)
    first.registerWeightProbe(frameDoc)
    expect(add).toHaveBeenCalledTimes(1)
    iframe.remove()
  })

  it('is installed into the document an icon renders into', () => {
    const add = stubFonts(document)
    mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon }, attachTo: document.body })
    expect(add).toHaveBeenCalledTimes(1)
    mount(WeightedSVGIcon, { props: { icon: bellWeightedIcon }, attachTo: document.body })
    expect(add).toHaveBeenCalledTimes(1)
  })
})

describe('weighted-svg-icon.css', () => {
  const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/weighted-svg-icon.css'), 'utf8')

  it('reads the weight from the probe width through container queries', () => {
    expect(css).toContain('container-name: astryx-icon-weight')
    expect(css).toContain('@container astryx-icon-weight (width >= 1.45em) and (width < 1.55em)')
    expect(css).toContain('--astryx-icon-weight-read: 500')
  })

  it('has a rule for every contiguous range of the five weights', () => {
    expect(css.match(/\.astryx-weight-r\d{3}_\d{3} \{/g)).toHaveLength(15)
    expect(css).toContain('.astryx-weight-r300_700')
  })
})
