import { describe, expect, it } from 'vitest'
import { parseDiffArgs, playgroundUrls, UsageError } from '../scripts/swarm/playground-diff/args.mjs'
import {
  bandLabel,
  bandStart,
  compareSides,
  diffPair,
  pairItems,
  verdict,
} from '../scripts/swarm/playground-diff/compare.mjs'
import { isDynamicText, normalizeText, parseColor, parseFontWeight, parsePx } from '../scripts/swarm/playground-diff/normalize.mjs'
import { buildJsonPayload, formatDeviation, renderReport } from '../scripts/swarm/playground-diff/report.mjs'

/** 造一个文字元素，默认两边完全一样。 */
function textItem(text: string, overrides: Record<string, unknown> = {}) {
  return {
    kind: 'text',
    text,
    order: 0,
    box: { x: 10, y: 20, w: 100, h: 18 },
    style: { fontSize: '14px', fontWeight: '400', color: 'rgb(0, 0, 0)', backgroundColor: 'rgba(0, 0, 0, 0)' },
    ...overrides,
  }
}

function iconItem(text: string, overrides: Record<string, unknown> = {}) {
  return { kind: 'icon', text, order: 0, box: { x: 10, y: 20, w: 16, h: 16 }, style: {}, ...overrides }
}

describe('文本与样式归一化', () => {
  it('合并空白、去首尾、转小写', () => {
    expect(normalizeText('  Item   One\n')).toBe('item one')
  })

  it('把时间、日期、相对时间当成动态文本', () => {
    expect(isDynamicText('10:24')).toBe(true)
    expect(isDynamicText('10:24:30')).toBe(true)
    expect(isDynamicText('2025-01-15')).toBe(true)
    expect(isDynamicText('3 minutes ago')).toBe(true)
    expect(isDynamicText('1.2s')).toBe(true)
    expect(isDynamicText('完成于 5分钟前')).toBe(true)
  })

  it('普通文案、纯数字、带单位的静态数字不算动态文本', () => {
    expect(isDynamicText('Items')).toBe(false)
    expect(isDynamicText('8,420 views')).toBe(false)
    expect(isDynamicText('12 - 12.00%')).toBe(false)
    expect(isDynamicText('')).toBe(false)
  })

  it('解析像素、字重和颜色', () => {
    expect(parsePx('14px')).toBe(14)
    expect(parsePx(3.5)).toBe(3.5)
    expect(parsePx('bold')).toBeNull()
    expect(parseFontWeight('bold')).toBe(700)
    expect(parseFontWeight('600')).toBe(600)
    expect(parseColor('rgb(71, 71, 71)')).toEqual({ r: 71, g: 71, b: 71, a: 1 })
    expect(parseColor('rgba(0, 0, 0, 0)')).toEqual({ r: 0, g: 0, b: 0, a: 0 })
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(parseColor('')).toBeNull()
  })
})

describe('配对', () => {
  it('同文字按文档顺序一一配对，多出来的记缺失和多余', () => {
    const left = [textItem('Edit', { order: 1 }), textItem('Edit', { order: 3 }), textItem('Name', { order: 5 })]
    const right = [textItem('edit', { order: 2 })]
    const { pairs, missing, extra } = pairItems(left, right)
    expect(pairs).toHaveLength(1)
    expect(pairs[0].upstream.order).toBe(1)
    expect(missing.map(item => item.text)).toEqual(['Edit', 'Name'])
    expect(extra).toEqual([])
  })

  it('文字和图标分开配对，不会互相占位置', () => {
    const left = [textItem('Add Item'), iconItem('Add Item')]
    const right = [iconItem('add item')]
    const { pairs, missing } = pairItems(left, right)
    expect(pairs).toHaveLength(1)
    expect(pairs[0].key).toBe('icon:add item')
    expect(missing).toHaveLength(1)
    expect(missing[0].kind).toBe('text')
  })
})

describe('偏差判定', () => {
  it('1px 以内不算偏差', () => {
    const upstream = textItem('Name')
    const ours = textItem('Name', { box: { x: 11, y: 21, w: 101, h: 19 } })
    expect(diffPair({ upstream, ours })).toBeNull()
  })

  it('位置超 1px 报位置，并且报差别大的那个轴', () => {
    const upstream = textItem('Name', { box: { x: 10, y: 20, w: 100, h: 18 } })
    const ours = textItem('Name', { box: { x: 10, y: 26, w: 100, h: 18 } })
    const found = diffPair({ upstream, ours })
    expect(found?.attribute).toBe('position')
    expect(found?.detail).toBe('y')
    expect(found?.upstream).toBe('20px')
    expect(found?.ours).toBe('26px')
  })

  it('尺寸、字号、字重、颜色、背景各自能报出来', () => {
    const base = textItem('Name')
    expect(diffPair({ upstream: base, ours: textItem('Name', { box: { x: 10, y: 20, w: 120, h: 18 } }) })?.attribute).toBe('size')
    expect(diffPair({ upstream: base, ours: textItem('Name', { style: { ...base.style, fontSize: '16px' } }) })?.attribute).toBe('font-size')
    expect(diffPair({ upstream: base, ours: textItem('Name', { style: { ...base.style, fontWeight: '600' } }) })?.attribute).toBe('font-weight')
    expect(diffPair({ upstream: base, ours: textItem('Name', { style: { ...base.style, color: 'rgb(120, 0, 0)' } }) })?.attribute).toBe('color')
    expect(diffPair({ upstream: base, ours: textItem('Name', { style: { ...base.style, backgroundColor: 'rgb(0, 0, 120)' } }) })?.attribute).toBe('background-color')
  })

  it('颜色通道差 4 以内不算偏差', () => {
    const upstream = textItem('Name', { style: { ...textItem('Name').style, color: 'rgb(71, 71, 71)' } })
    const ours = textItem('Name', { style: { ...textItem('Name').style, color: 'rgb(75, 68, 74)' } })
    expect(diffPair({ upstream, ours })).toBeNull()
  })

  it('图标只比位置和尺寸', () => {
    const upstream = iconItem('Reload')
    const ours = iconItem('Reload', { box: { x: 10, y: 20, w: 20, h: 20 } })
    expect(diffPair({ upstream, ours })?.attribute).toBe('size')
  })
})

describe('整体结果', () => {
  it('动态文本算缺失、多余，但不计入偏差数', () => {
    const upstream = [textItem('Items'), textItem('10:24'), textItem('Saved')]
    const ours = [textItem('Items'), textItem('10:31'), textItem('Draft')]
    const result = compareSides(upstream, ours)
    expect(result.pairCount).toBe(1)
    // 静态的「Saved / Draft」配不上，算一个缺失加一个多余；两个时间不算。
    expect(result.deviationCount).toBe(2)
    expect(result.missingCount).toBe(2)
    expect(result.extraCount).toBe(2)
    expect(result.dynamicMissingCount).toBe(1)
    expect(result.dynamicExtraCount).toBe(1)
    expect(result.staticMissingCount).toBe(1)
    expect(result.deviations.map(item => item.kind)).toEqual(['missing', 'extra', 'dynamic-missing', 'dynamic-extra'])
  })

  it('按纵向 100px 分段统计', () => {
    const upstream = [textItem('A', { box: { x: 0, y: 10, w: 10, h: 10 } }), textItem('B', { box: { x: 0, y: 150, w: 10, h: 10 } })]
    const ours = [textItem('A', { box: { x: 50, y: 10, w: 10, h: 10 } }), textItem('B', { box: { x: 50, y: 150, w: 10, h: 10 } })]
    const result = compareSides(upstream, ours)
    expect(result.bands).toEqual([{ start: 0, count: 1 }, { start: 100, count: 1 }])
    expect(bandStart(199)).toBe(100)
    expect(bandLabel(100)).toBe('y 100–199px')
  })

  it('偏差不超过 3 且没有正文缺失才算通过', () => {
    const same = [textItem('Items')]
    expect(verdict(compareSides(same, same)).passed).toBe(true)
    const shifted = [textItem('Items', { box: { x: 40, y: 20, w: 100, h: 18 } })]
    expect(verdict(compareSides(same, shifted)).passed).toBe(true)
    expect(verdict(compareSides([textItem('Saved')], [])).passed).toBe(false)
    expect(verdict(compareSides([textItem('9:41')], [])).passed).toBe(true)
  })
})

describe('报告', () => {
  const meta = {
    slug: 'table',
    scheme: 'light',
    port: 5181,
    upstreamUrl: 'https://astryx.atmeta.com/playground?template=table',
    ourUrl: 'http://127.0.0.1:5181/playground/?template=table',
    maxDeviations: 3,
  }

  it('一条偏差写成「文字 / 属性 / 原版值 / 我们的值」', () => {
    const line = formatDeviation({ kind: 'deviation', text: 'Name', attribute: 'position', detail: 'x', upstream: '10px', ours: '26px' }, 1)
    expect(line).toBe('1. 「Name」位置 x：原版 10px → 我们 26px')
  })

  it('正文报告里有总数、偏差、分段和结论', () => {
    const upstream = [textItem('Items'), textItem('Name', { box: { x: 10, y: 120, w: 100, h: 18 } })]
    const ours = [textItem('Items'), textItem('Name', { box: { x: 30, y: 120, w: 100, h: 18 } })]
    const report = renderReport(meta, compareSides(upstream, ours))
    expect(report).toContain('配成 2 对元素')
    expect(report).toContain('偏差 1 个')
    expect(report).toContain('y 100–199px：1')
    expect(report).toContain('结论：通过')
  })

  it('jSON 里有完整偏差和分段，去掉排序用的字段', () => {
    const upstream = [textItem('Items')]
    const ours = [textItem('Items', { box: { x: 40, y: 20, w: 100, h: 18 } })]
    const payload = buildJsonPayload(meta, compareSides(upstream, ours))
    expect(payload.slug).toBe('table')
    expect(payload.passed).toBe(true)
    expect(payload.deviations[0].attribute).toBe('position')
    expect(payload.deviations[0]).not.toHaveProperty('severity')
  })
})

describe('命令行参数', () => {
  it('三个位置参数加 --json', () => {
    expect(parseDiffArgs(['table', 'dark', '5181', '--json', 'out.json'])).toEqual({
      slug: 'table',
      scheme: 'dark',
      port: 5181,
      jsonPath: 'out.json',
    })
  })

  it('参数不对时报用法错', () => {
    expect(() => parseDiffArgs([])).toThrow(UsageError)
    expect(() => parseDiffArgs(['table'])).toThrow(UsageError)
    expect(() => parseDiffArgs(['table', 'sepia', '5181'])).toThrow(UsageError)
    expect(() => parseDiffArgs(['table', 'light', 'abc'])).toThrow(UsageError)
    expect(() => parseDiffArgs(['table', 'light', '5181', '--json'])).toThrow(UsageError)
    expect(() => parseDiffArgs(['table', 'light', '5181', 'extra'])).toThrow(UsageError)
  })

  it('两个要打开的地址', () => {
    const urls = playgroundUrls('table', 5181)
    expect(urls.upstreamUrl).toBe('https://astryx.atmeta.com/playground?template=table')
    expect(urls.ourUrl).toBe('http://127.0.0.1:5181/playground/?template=table')
  })
})
