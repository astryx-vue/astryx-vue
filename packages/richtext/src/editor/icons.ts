import type { Component } from 'vue'
import { defineComponent, h } from 'vue'

/**
 * 工具栏每个控件用的图标键。主题可以用 `defineTheme({ icons: { 'richtext:bold': 'lucide:bold' } })`
 * 按键换成自己的图标；没换的就用下面包内自带的图形。
 * 键带 `richtext:` 前缀，不会和 core 的语义图标名冲突。
 */
export const RICHTEXT_ICON_KEYS = {
  bold: 'richtext:bold',
  italic: 'richtext:italic',
  underline: 'richtext:underline',
  strikethrough: 'richtext:strikethrough',
  code: 'richtext:code',
  link: 'richtext:link',
  paragraph: 'richtext:paragraph',
  h1: 'richtext:h1',
  h2: 'richtext:h2',
  h3: 'richtext:h3',
  quote: 'richtext:quote',
  bullet: 'richtext:bullet',
  number: 'richtext:number',
  undo: 'richtext:undo',
  redo: 'richtext:redo',
} as const

export type RichTextIconName = keyof typeof RICHTEXT_ICON_KEYS

type Shape = { tag: 'path', attrs: Record<string, string> } | { tag: 'circle', attrs: Record<string, string> } | { tag: 'text', attrs: Record<string, string>, text: string }

const STROKE = { 'stroke': 'currentColor', 'stroke-width': '2' }
const ROUND = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

function path(d: string, extra: Record<string, string> = {}): Shape {
  return { tag: 'path', attrs: { d, fill: 'none', ...STROKE, ...extra } }
}

/** 24×24 画布上的线条图形，和上游工具栏内置的那套一致。 */
const SHAPES: Partial<Record<RichTextIconName, Shape[]>> = {
  bold: [path('M6 4h7a4 4 0 0 1 0 8H6zM6 12h8a4 4 0 0 1 0 8H6z', { 'stroke-linejoin': 'round' })],
  italic: [path('M10 4h6M8 20h6M14 4l-4 16', { 'stroke-linecap': 'round' })],
  underline: [path('M6 4v6a6 6 0 0 0 12 0V4M5 21h14', { 'stroke-linecap': 'round' })],
  strikethrough: [path('M4 12h16M8 6a4 3 0 0 1 8 0M8 16a4 3 0 0 0 8 0', { 'stroke-linecap': 'round' })],
  code: [path('M9 8l-4 4 4 4M15 8l4 4-4 4', ROUND)],
  link: [path('M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5', ROUND)],
  quote: [path('M6 17h3l2-4V7H5v6h3zM15 17h3l2-4V7h-6v6h3z', { 'stroke-linejoin': 'round' })],
  bullet: [
    path('M9 6h11M9 12h11M9 18h11', { 'stroke-linecap': 'round' }),
    ...[6, 12, 18].map((cy): Shape => ({ tag: 'circle', attrs: { cx: '4.5', cy: String(cy), r: '1.5', fill: 'currentColor' } })),
  ],
  number: [
    path('M10 6h10M10 12h10M10 18h10', { 'stroke-linecap': 'round' }),
    ...([['1', 8], ['2', 14], ['3', 20]] as const).map(([text, y]): Shape => ({ tag: 'text', text, attrs: { 'x': '2', 'y': String(y), 'font-size': '6', 'fill': 'currentColor' } })),
  ],
  undo: [path('M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10', ROUND)],
  redo: [path('M15 7l5 5-5 5M20 12H9a5 5 0 0 0 0 10', ROUND)],
}

/** 段落和标题没有图形，用一小段文字当图标。 */
const TEXT_LABELS: Partial<Record<RichTextIconName, string>> = {
  paragraph: '¶',
  h1: 'H1',
  h2: 'H2',
  h3: 'H3',
}

/** 包内自带的图标：线条图形或文字，画在 16px 的盒子里，颜色跟随文字。 */
export function builtInIcon(name: RichTextIconName): Component {
  const label = TEXT_LABELS[name]
  if (label !== undefined) {
    return defineComponent({
      name: `RichTextGlyph_${name}`,
      setup: () => () => h('span', { 'class': 'astryx-richtext-toolbar__text-glyph', 'aria-hidden': 'true' }, label),
    })
  }
  const shapes = SHAPES[name] ?? []
  return defineComponent({
    name: `RichTextIcon_${name}`,
    setup: () => () => h('svg', { 'width': 16, 'height': 16, 'viewBox': '0 0 24 24', 'fill': 'none', 'aria-hidden': 'true' }, shapes.map(shape =>
      h(shape.tag, shape.attrs, shape.tag === 'text' ? shape.text : undefined))),
  })
}
