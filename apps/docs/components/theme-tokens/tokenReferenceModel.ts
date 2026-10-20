/**
 * `<TokenReference>` 要渲染的数据：把 neutral/base.css 和共用的 data.css 里的变量
 * 按分区、按颜色分组整理好，并把颜色解析成浅色和深色两个最终值。都是纯函数，组件只负责渲染。
 */
import type { ColorBucket, CustomProperty, TokenSectionId } from './parseTokens'
import type { LocalizedText, SectionCopy } from './tokenReferenceCopy'
import dataCss from '../../../../packages/themes/data.css?raw'
import baseCss from '../../../../packages/themes/neutral/base.css?raw'
import { colorBucket, parseCustomProperties, resolveStop, sectionId, splitLightDark, TOKEN_SECTION_ORDER } from './parseTokens'
import { BUCKET_COPY, SECTION_COPY } from './tokenReferenceCopy'

export interface TokenSection extends SectionCopy {
  id: TokenSectionId
  items: CustomProperty[]
}

export interface ColorGroup {
  bucket: ColorBucket
  title: LocalizedText
  items: CustomProperty[]
}

export interface Swatch {
  light: string
  dark: string
}

const BUCKET_ORDER = ['core', 'text', 'icon', 'status', 'line', 'blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow', 'data'] as const satisfies readonly ColorBucket[]

export const MOTION_NAMES = [
  'astryx-fade-in',
  'astryx-fade-out',
  'astryx-scale-in',
  'astryx-scale-out',
  'astryx-slide-in-above',
  'astryx-slide-out-above',
  'astryx-slide-in-below',
  'astryx-slide-out-below',
  'astryx-slide-in-start',
  'astryx-slide-out-start',
  'astryx-slide-in-end',
  'astryx-slide-out-end',
]

export const MOTION_SAMPLES = [
  { className: 'astryx-motion-fade-in', label: 'fade' },
  { className: 'astryx-motion-scale-in', label: 'scale' },
  { className: 'astryx-motion-slide-in-above', label: 'above' },
  { className: 'astryx-motion-slide-in-below', label: 'below' },
  { className: 'astryx-motion-slide-in-start', label: 'start' },
  { className: 'astryx-motion-slide-in-end', label: 'end' },
]

const properties = [...parseCustomProperties(baseCss), ...parseCustomProperties(dataCss)]
const byName = new Map(properties.map(property => [property.name, property.value]))

/** 按固定顺序列出分区。传了 `wanted` 就只留这些分区。 */
export function tokenSections(wanted?: readonly TokenSectionId[]): TokenSection[] {
  return TOKEN_SECTION_ORDER.flatMap((id) => {
    if (wanted != null && !wanted.includes(id))
      return []
    const items = properties.filter(property => sectionId(property.name) === id)
    return [{ id, ...SECTION_COPY[id], items }]
  })
}

/** 颜色分区再按用途和色相分组，空组不出现。 */
export function colorGroups(): ColorGroup[] {
  const colors = properties.filter(property => sectionId(property.name) === 'color')
  return BUCKET_ORDER.flatMap((bucket) => {
    const items = colors.filter(property => colorBucket(property.name) === bucket)
    if (items.length === 0)
      return []
    return [{ bucket, title: BUCKET_COPY[bucket], items }]
  })
}

/** 一个颜色 token 在浅色和深色下各自最终落到的颜色，`var()` 引用会顺着解开。 */
export function swatch(value: string): Swatch {
  const stops = splitLightDark(value)
  if (!stops) {
    const resolved = resolveStop(value, byName, 'light')
    return { light: resolved, dark: resolveStop(value, byName, 'dark') }
  }
  return {
    light: resolveStop(stops.light, byName, 'light'),
    dark: resolveStop(stops.dark, byName, 'dark'),
  }
}
