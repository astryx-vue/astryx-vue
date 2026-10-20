/**
 * 主题编辑面板要显示的数据：字体和字号比例的显示名、五条阶梯（字号、圆角、间距、
 * 控件高度、时长）的档位和范围、密度预设的小图标。面板里的文字和上游一样只用英文。
 */
import type { DensityPreset, ThemeState } from './theme'
import {
  createNeutralTheme,
  describeDuration,
  describeElementSize,
  describeRadius,
  describeSpacing,
  describeType,
  PLAYGROUND_FONTS,
  TYPE_SCALES,
} from './theme'

export type ScaleKey = 'typeSize' | 'radius' | 'spacing' | 'elementSize' | 'duration'

export interface ScaleStop {
  label: string
  value: number
}

export interface ScaleSpec {
  key: ScaleKey
  label: string
  control: string
  tooltip: string
  stops: ScaleStop[]
  min: number
  max: number
  step: number
  units: string
  /** Neutral's stored radius is not one of the editor stops, so the field shows an em dash. */
  unsetAt: number | null
}

export interface PresetShape {
  x: number
  y: number
  width: number
  height: number
  opacity: number
}

const FONT_LABELS: Record<string, string> = {
  'system': 'System (Default)',
  'inter': 'Inter',
  'roboto': 'Roboto',
  'dm-sans': 'DM Sans',
  'figtree': 'Figtree',
  'poppins': 'Poppins',
  'ibm-plex-sans': 'IBM Plex Sans',
  'source-sans': 'Source Sans',
  'noto-sans': 'Noto Sans',
  'georgia': 'Georgia (Serif)',
  'custom': 'Custom',
}

const FONT_ORDER = [
  'system',
  'inter',
  'roboto',
  'dm-sans',
  'figtree',
  'poppins',
  'ibm-plex-sans',
  'source-sans',
  'noto-sans',
  'georgia',
  'custom',
]

const SCALE_NAMES: Record<string, string> = {
  'minor-second': 'Minor Second',
  'major-second': 'Major Second',
  'minor-third': 'Minor Third',
  'major-third': 'Major Third',
  'perfect-fourth': 'Perfect Fourth',
  'augmented-fourth': 'Augmented Fourth',
  'perfect-fifth': 'Perfect Fifth',
  'golden': 'Golden Ratio',
}

const NEUTRAL_RADIUS = createNeutralTheme().radius

/** S、M、L、XL 四档，对应的数值依次是 `values`。 */
function sizeStops(values: [number, number, number, number]): ScaleStop[] {
  return ['S', 'M', 'L', 'XL'].map((label, index) => ({ label, value: values[index]! }))
}

const SCALE_SPECS: Array<Omit<ScaleSpec, 'tooltip'>> = [
  { key: 'typeSize', label: 'Type Size', control: 'Type size', stops: sizeStops([12, 14, 16, 18]), min: 12, max: 22, step: 1, units: 'px', unsetAt: null },
  { key: 'radius', label: 'Corner Radius', control: 'Radius', stops: sizeStops([2, 4, 6, 8]), min: 0, max: 28, step: 1, units: 'px', unsetAt: NEUTRAL_RADIUS },
  { key: 'spacing', label: 'Spacing', control: 'Spacing', stops: sizeStops([2, 4, 6, 8]), min: 2, max: 8, step: 1, units: 'px', unsetAt: null },
  { key: 'elementSize', label: 'Element Size', control: 'Element size', stops: sizeStops([28, 32, 40, 48]), min: 24, max: 48, step: 1, units: 'px', unsetAt: null },
  {
    key: 'duration',
    label: 'Duration',
    control: 'Duration',
    stops: [
      { label: '0.5×', value: 0.5 },
      { label: '1×', value: 1 },
      { label: '1.5×', value: 1.5 },
      { label: '2×', value: 2 },
    ],
    min: 0.5,
    max: 2,
    step: 0.1,
    units: '×',
    unsetAt: null,
  },
]

function scaleTooltip(key: ScaleKey, theme: ThemeState): string {
  if (key === 'typeSize')
    return `Geometric scale: size = round(base × ratio^step). ${describeType(theme, 'en')}.`
  if (key === 'radius')
    return describeRadius(theme, 'en')
  if (key === 'spacing')
    return describeSpacing(theme, 'en')
  if (key === 'elementSize')
    return describeElementSize(theme)
  return describeDuration(theme)
}

/** 五条阶梯，提示文字按当前主题现算。 */
export function scaleSpecs(theme: ThemeState): ScaleSpec[] {
  return SCALE_SPECS.map(spec => ({ ...spec, tooltip: scaleTooltip(spec.key, theme) }))
}

/** 字体下拉框的选项，按上游的顺序和显示名。 */
export function fontOptions(): Array<{ id: string, label: string }> {
  return FONT_ORDER.flatMap((id) => {
    const font = PLAYGROUND_FONTS.find(item => item.id === id)
    return font ? [{ id, label: FONT_LABELS[id] ?? font.en }] : []
  })
}

export function scaleLabel(id: string): string {
  const scale = TYPE_SCALES.find(item => item.id === id)
  if (!scale)
    return id
  return `${scale.ratio.toFixed(3)} — ${SCALE_NAMES[id] ?? scale.en}`
}

/** 表单控件的 id，标签用它和控件关联。 */
export function fieldId(key: string): string {
  return `playground-${key}`
}

/** 数字框里显示的值。Neutral 的圆角不在档位里，显示为空，由占位符给出破折号。 */
export function shownValue(spec: ScaleSpec, value: number): number | null {
  if (spec.unsetAt != null && value === spec.unsetAt && !spec.stops.some(stop => stop.value === value))
    return null
  return value
}

/** 当前值正好落在某一档上时返回它，否则返回 null，档位按钮都不高亮。 */
export function stopValue(spec: ScaleSpec, value: number): number | null {
  return spec.stops.some(stop => stop.value === value) ? value : null
}

export function formatShown(spec: ScaleSpec, value: number): string {
  const shown = shownValue(spec, value)
  if (shown == null)
    return ''
  if (spec.step >= 1)
    return String(Math.round(shown))
  return String(Math.round(shown * 10) / 10)
}

/** 把用户在数字框里输入的文字变成合法的阶梯值。不是数字时返回 null。 */
export function parseScaleInput(spec: ScaleSpec, raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '' || trimmed === '—')
    return null
  const value = Number(trimmed)
  if (!Number.isFinite(value))
    return null
  const rounded = spec.step >= 1 ? Math.round(value) : Math.round(value * 10) / 10
  return Math.min(spec.max, Math.max(spec.min, rounded))
}

/** 密度预设小图标里色块的圆角，越宽松越圆。 */
export function presetIconRadius(id: DensityPreset['id']): number {
  return presetIcon(id).radius
}

/** 密度预设小图标：一条顶栏，左边一大块，右边上下两块，间隙随密度变大。 */
export function presetShapes(id: DensityPreset['id']): PresetShape[] {
  const { gap } = presetIcon(id)
  const top = 8
  const body = 32 - top - gap
  const leftWidth = 15 - gap / 2
  const rightX = 15 + gap / 2
  const rightWidth = 32 - rightX
  const row = (body - gap) / 2
  return [
    { x: 0, y: 0, width: 32, height: top, opacity: 0.5 },
    { x: 0, y: top + gap, width: leftWidth, height: body, opacity: 1 },
    { x: rightX, y: top + gap, width: rightWidth, height: row, opacity: 0.7 },
    { x: rightX, y: top + gap + row + gap, width: rightWidth, height: row, opacity: 0.7 },
  ]
}

function presetIcon(id: DensityPreset['id']): { gap: number, radius: number } {
  if (id === 'compact')
    return { gap: 1, radius: 1 }
  if (id === 'default')
    return { gap: 2, radius: 2 }
  if (id === 'comfortable')
    return { gap: 3, radius: 3 }
  return { gap: 4, radius: 5 }
}
