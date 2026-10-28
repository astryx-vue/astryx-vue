<script setup lang="ts">
import {
  Button,
  Card,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  pixel,
  ProgressBar,
  proportional,
  Selector,
  StackItem,
  Switch,
  Table,
  Text,
  Tooltip,
  useTableGroupedRows,
  useTableStickyColumns,
  VisuallyHidden,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { computed, defineComponent, h, ref } from 'vue'
import type { VNodeChild } from 'vue'

type Modality = 'text' | 'image' | 'audio' | 'video' | 'document'

const MODALITY_ORDER: Modality[] = ['text', 'image', 'audio', 'video', 'document']

/** 原版用 lucide 描边图标；这里按 lucide 的路径自绘成组件，颜色走 currentColor。 */
function lucideIcon(nodes: Array<[string, Record<string, string | number>]>, strokeWidth = 2) {
  return () => h('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'width': '1em',
    'height': '1em',
    'aria-hidden': 'true',
    'style': { fill: 'none' },
  }, nodes.map(([tag, attrs]) => h(tag, attrs)))
}

const TextTypeIcon = lucideIcon([
  ['path', { d: 'M12 4v16' }],
  ['path', { d: 'M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2' }],
  ['path', { d: 'M9 20h6' }],
], 1.5)
const ImageIcon = lucideIcon([
  ['rect', { width: 18, height: 18, x: 3, y: 3, rx: 2, ry: 2 }],
  ['circle', { cx: 9, cy: 9, r: 2 }],
  ['path', { d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' }],
])
const AudioLinesIcon = lucideIcon([['path', { d: 'M2 10v3m4-7v11m4-14v18m4-13v7m4-10v13m4-8v3' }]])
const VideoIcon = lucideIcon([
  ['path', { d: 'm16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5' }],
  ['rect', { width: 14, height: 12, x: 2, y: 6, rx: 2 }],
])
const FileTextIcon = lucideIcon([
  ['path', { d: 'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z' }],
  ['path', { d: 'M14 2v5a1 1 0 0 0 1 1h5M10 9H8m8 4H8m8 4H8' }],
])

/** 布尔格的「支持 / 不支持」，和原版一样是描边圆形图标（lucide circle-check / circle-x）。 */
function outlineCircle(paths: string[]) {
  return lucideIcon([['circle', { cx: 12, cy: 12, r: 10 }], ...paths.map((d): [string, Record<string, string>] => ['path', { d }])])
}
const CircleCheckIcon = outlineCircle(['m9 12 2 2 4-4'])
const CircleXIcon = outlineCircle(['m15 9-6 6', 'm9 9 6 6'])

const MODALITY_ICON = {
  text: TextTypeIcon,
  image: ImageIcon,
  audio: AudioLinesIcon,
  video: VideoIcon,
  document: FileTextIcon,
}

/** 选择器里每个提供商的图标。 */
const PROVIDER_ICON: Record<string, string> = {
  'Northwind': 'i-heroicons-cpu-chip',
  'Calder Labs': 'i-heroicons-sparkles',
  'Halcyon': 'i-heroicons-bolt',
  'Sable AI': 'i-heroicons-cube',
}

const MODALITY_LABEL: Record<Modality, string> = {
  text: 'Text',
  image: 'Image',
  audio: 'Audio',
  video: 'Video',
  document: 'Document',
}

interface Model {
  id: string
  name: string
  provider: string
  context: number
  maxOutput: number
  cutoff: string
  inputModalities: Modality[]
  outputModalities: Modality[]
  hasOpenWeights: boolean
  inputPrice: number
  outputPrice: number
  cachedPrice: number
  speed: number
  latency: number
  mmlu: number
  humanEval: number
  math: number
  rateLimit: number
  hasStreaming: boolean
  hasTools: boolean
  hasFineTuning: boolean
}

const MODELS: Model[] = [
  { id: 'atlas-4-flash', name: 'Atlas 4 Flash', provider: 'Northwind', context: 1_000_000, maxOutput: 65_536, cutoff: 'Mar 2026', inputModalities: ['text', 'image'], outputModalities: ['text'], hasOpenWeights: false, inputPrice: 0.1, outputPrice: 0.4, cachedPrice: 0.025, speed: 186, latency: 0.28, mmlu: 78.4, humanEval: 84.1, math: 71.2, rateLimit: 4_000, hasStreaming: true, hasTools: true, hasFineTuning: true, },
  { id: 'atlas-4-pro', name: 'Atlas 4 Pro', provider: 'Northwind', context: 2_000_000, maxOutput: 131_072, cutoff: 'Mar 2026', inputModalities: ['text', 'image', 'audio', 'document'], outputModalities: ['text', 'audio'], hasOpenWeights: false, inputPrice: 1.25, outputPrice: 5.0, cachedPrice: 0.31, speed: 74, latency: 0.62, mmlu: 88.7, humanEval: 93.4, math: 89.1, rateLimit: 1_000, hasStreaming: true, hasTools: true, hasFineTuning: false, },
  { id: 'meridian-2-5-flash', name: 'Meridian 2.5 Flash', provider: 'Calder Labs', context: 1_048_576, maxOutput: 8_192, cutoff: 'Jan 2026', inputModalities: ['text', 'image', 'video'], outputModalities: ['text'], hasOpenWeights: false, inputPrice: 0.075, outputPrice: 0.3, cachedPrice: 0.019, speed: 214, latency: 0.24, mmlu: 76.9, humanEval: 81.7, math: 68.4, rateLimit: 2_000, hasStreaming: true, hasTools: true, hasFineTuning: true, },
  { id: 'meridian-2-5-pro', name: 'Meridian 2.5 Pro', provider: 'Calder Labs', context: 2_097_152, maxOutput: 65_536, cutoff: 'Jan 2026', inputModalities: ['text', 'image', 'audio', 'video', 'document'], outputModalities: ['text', 'image', 'audio'], hasOpenWeights: false, inputPrice: 1.25, outputPrice: 10.0, cachedPrice: 0.31, speed: 62, latency: 0.71, mmlu: 89.3, humanEval: 92.8, math: 91.6, rateLimit: 360, hasStreaming: true, hasTools: true, hasFineTuning: false, },
  { id: 'orion-mini-3', name: 'Orion Mini 3', provider: 'Halcyon', context: 262_144, maxOutput: 32_768, cutoff: 'Nov 2025', inputModalities: ['text'], outputModalities: ['text'], hasOpenWeights: true, inputPrice: 0.05, outputPrice: 0.2, cachedPrice: 0.012, speed: 248, latency: 0.19, mmlu: 71.2, humanEval: 74.6, math: 58.9, rateLimit: 8_000, hasStreaming: true, hasTools: true, hasFineTuning: true, },
  { id: 'orion-3-ultra', name: 'Orion 3 Ultra', provider: 'Halcyon', context: 524_288, maxOutput: 65_536, cutoff: 'Nov 2025', inputModalities: ['text', 'image', 'document'], outputModalities: ['text', 'image'], hasOpenWeights: true, inputPrice: 0.9, outputPrice: 2.7, cachedPrice: 0.22, speed: 96, latency: 0.48, mmlu: 85.1, humanEval: 89.2, math: 82.3, rateLimit: 1_200, hasStreaming: true, hasTools: true, hasFineTuning: true, },
  { id: 'kestrel-v4-turbo', name: 'Kestrel V4 Turbo', provider: 'Sable AI', context: 400_000, maxOutput: 16_384, cutoff: 'Feb 2026', inputModalities: ['text', 'image', 'document'], outputModalities: ['text'], hasOpenWeights: false, inputPrice: 0.3, outputPrice: 1.2, cachedPrice: 0.075, speed: 142, latency: 0.33, mmlu: 82.6, humanEval: 87.3, math: 77.8, rateLimit: 3_000, hasStreaming: true, hasTools: true, hasFineTuning: false, },
  { id: 'kestrel-v4-lite', name: 'Kestrel V4 Lite', provider: 'Sable AI', context: 128_000, maxOutput: 8_192, cutoff: 'Feb 2026', inputModalities: ['text'], outputModalities: ['text'], hasOpenWeights: false, inputPrice: 0.04, outputPrice: 0.16, cachedPrice: 0.01, speed: 265, latency: 0.17, mmlu: 68.4, humanEval: 70.1, math: 54.2, rateLimit: 10_000, hasStreaming: true, hasTools: false, hasFineTuning: false, },
]

const DEFAULT_SLOTS = ['atlas-4-flash', 'meridian-2-5-flash', 'kestrel-v4-turbo']
const MIN_SLOTS = 2

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })
const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 3 })
const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

type GroupKey = 'Overview' | 'Pricing' | 'Performance' | 'Availability' | 'Benchmarks' | 'Limits'

interface SpecRow extends Record<string, unknown> {
  id: string
  label: string
  group: GroupKey
  better?: 'higher' | 'lower'
  get: (model: Model) => number | string | boolean
  format?: (value: number) => string
  unit?: string
  isScore?: boolean
  /** 整格自绘（跳过排名）。 */
  renderValue?: (model: Model) => VNodeChild
  /** 模态行：格子位置固定，缺的项画成暗色。 */
  modalities?: (model: Model) => Modality[]
}

// ===== 30 天可用性条 =====

const UPTIME_DAYS = 30
const UPTIME_END = new Date('2026-09-07T00:00:00Z')
const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
const uptimeFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** 用模型 id 做种子的 xorshift：每个模型有自己固定的故障历史。 */
function dailyUptime(seed: number, days: number): number[] {
  let state = seed || 1
  const next = () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return Math.abs(state % 1000) / 1000
  }
  const rough = next()
  const outageOdds = 0.01 + rough * 0.05
  const degradedOdds = outageOdds + 0.03 + rough * 0.09
  const out: number[] = []
  for (let i = 0; i < days; i++) {
    const roll = next()
    if (roll < outageOdds)
      out.push(96.5 + next() * 2.4)
    else if (roll < degradedOdds)
      out.push(99.0 + next() * 0.9)
    else
      out.push(99.95 + next() * 0.05)
  }
  return out
}

function hashId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++)
    hash = (hash << 5) - hash + id.charCodeAt(i)
  return hash
}

function uptimeStatus(value: number): { color: string, status: string } {
  if (value >= 99.95)
    return { color: 'var(--astryx-color-success)', status: 'Operational' }
  if (value >= 99)
    return { color: 'var(--astryx-color-warning)', status: 'Degraded' }
  return { color: 'var(--astryx-color-error)', status: 'Outage' }
}

/** 一行文字（平均值，悬停时换成当天读数）加一条 30 根的日柱。 */
const UptimeStrip = defineComponent({
  props: { modelId: { type: String, required: true } },
  setup(props) {
    const hovered = ref<number | null>(null)
    const days = computed(() => dailyUptime(hashId(props.modelId), UPTIME_DAYS).map((uptime, i) => {
      const date = new Date(UPTIME_END)
      date.setUTCDate(date.getUTCDate() - (UPTIME_DAYS - 1 - i))
      return { uptime, date: dayFormat.format(date), ...uptimeStatus(uptime) }
    }))
    const average = computed(() => days.value.reduce((total, day) => total + day.uptime, 0) / days.value.length)
    /** 颜色是日柱唯一的编码，读屏用户拿到的是同一份统计。 */
    const spoken = computed(() => {
      const tally: Record<string, number> = {}
      for (const day of days.value)
        tally[day.status] = (tally[day.status] ?? 0) + 1
      return `Last ${UPTIME_DAYS} days: ${['Operational', 'Degraded', 'Outage'].filter(status => tally[status] > 0).map(status => `${tally[status]} ${status.toLowerCase()}`).join(', ')}.`
    })
    return () => {
      const day = hovered.value == null ? undefined : days.value[hovered.value]
      return h(VStack, { gap: 1, hAlign: 'end', width: '100%' }, () => [
        h(VisuallyHidden, null, () => spoken.value),
        h(HStack, { height: 24, vAlign: 'center' }, () => h(Text, { type: 'body', color: 'primary' }, () =>
          day == null ? `${uptimeFormat.format(average.value)}% average` : `${day.date} · ${uptimeFormat.format(day.uptime)}% · ${day.status}`)),
        h('div', { style: { display: 'flex', width: '100%', height: '28px' }, role: 'img', ariaLabel: `Last ${UPTIME_DAYS} days uptime`, onMouseleave: () => { hovered.value = null } },
          days.value.map((d, i) => h('div', { key: i, style: { flex: '1 1 0', minWidth: 0, padding: '0 1px', display: 'flex' }, onMouseenter: () => { hovered.value = i } },
            h('div', { style: { flex: 1, borderRadius: '2px', background: d.color } })))),
      ])
    }
  },
})

const SPEC_ROWS: SpecRow[] = [
  { id: 'provider', group: 'Overview', label: 'Provider', get: m => m.provider },
  { id: 'context', group: 'Overview', label: 'Context window', unit: 'tokens', better: 'higher', get: m => m.context, format: v => compact.format(v) },
  { id: 'max-output', group: 'Overview', label: 'Max output', unit: 'tokens', better: 'higher', get: m => m.maxOutput, format: v => compact.format(v) },
  { id: 'cutoff', group: 'Overview', label: 'Knowledge cutoff', get: m => m.cutoff },
  { id: 'input-modalities', group: 'Overview', label: 'Input modalities', get: () => '', modalities: m => m.inputModalities },
  { id: 'output-modalities', group: 'Overview', label: 'Output modalities', get: () => '', modalities: m => m.outputModalities },
  { id: 'open-weights', group: 'Overview', label: 'Open weights', get: m => m.hasOpenWeights },
  { id: 'input-price', group: 'Pricing', label: 'Input', unit: '/1M', better: 'lower', get: m => m.inputPrice, format: v => price.format(v) },
  { id: 'output-price', group: 'Pricing', label: 'Output', unit: '/1M', better: 'lower', get: m => m.outputPrice, format: v => price.format(v) },
  { id: 'cached-price', group: 'Pricing', label: 'Cached input', unit: '/1M', better: 'lower', get: m => m.cachedPrice, format: v => price.format(v) },
  { id: 'blended', group: 'Pricing', label: 'Blended (3:1)', unit: '/1M', better: 'lower', get: m => (m.inputPrice * 3 + m.outputPrice) / 4, format: v => price.format(v) },
  { id: 'speed', group: 'Performance', label: 'Output speed', unit: 'tok/s', better: 'higher', get: m => m.speed, format: v => String(Math.round(v)) },
  { id: 'latency', group: 'Performance', label: 'Time to first token', unit: 'sec', better: 'lower', get: m => m.latency, format: v => decimal.format(v) },
  { id: 'mmlu', group: 'Benchmarks', label: 'MMLU-Pro', better: 'higher', get: m => m.mmlu, format: v => decimal.format(v), isScore: true },
  { id: 'human-eval', group: 'Benchmarks', label: 'HumanEval', better: 'higher', get: m => m.humanEval, format: v => decimal.format(v), isScore: true },
  { id: 'math', group: 'Benchmarks', label: 'MATH', better: 'higher', get: m => m.math, format: v => decimal.format(v), isScore: true },
  { id: 'rate-limit', group: 'Limits', label: 'Rate limit', unit: '/min', better: 'higher', get: m => m.rateLimit, format: v => whole.format(v) },
  { id: 'streaming', group: 'Limits', label: 'Streaming', get: m => m.hasStreaming },
  { id: 'tools', group: 'Limits', label: 'Function calling', get: m => m.hasTools },
  { id: 'fine-tuning', group: 'Limits', label: 'Fine-tuning', get: m => m.hasFineTuning },
  { id: 'usage', group: 'Availability', label: 'Uptime (30d)', get: m => m.name, renderValue: m => h(UptimeStrip, { modelId: m.id }) },
]

const GROUP_ORDER: GroupKey[] = ['Overview', 'Pricing', 'Performance', 'Availability', 'Benchmarks', 'Limits']

const slots = ref<string[]>([...DEFAULT_SLOTS])
const highlightBest = ref(true)

const modelById = new Map(MODELS.map(m => [m.id, m]))

const selectedModels = computed(() =>
  slots.value.map(id => modelById.get(id)).filter((m): m is Model => m != null),
)

const bestByRow = computed(() => {
  const best = new Map<string, number>()
  for (const row of SPEC_ROWS) {
    if (!row.better)
      continue
    const values = selectedModels.value
      .map(row.get)
      .filter((v): v is number => typeof v === 'number')
    if (!values.length)
      continue
    best.set(row.id, row.better === 'higher' ? Math.max(...values) : Math.min(...values))
  }
  return best
})

function selectSlot(index: number, modelId: string): void {
  slots.value = slots.value.map((current, i) => (i === index ? modelId : current))
}

function removeSlot(index: number): void {
  if (slots.value.length <= MIN_SLOTS)
    return
  slots.value = slots.value.filter((_, i) => i !== index)
}

function addModel(): void {
  const next = MODELS.find(m => !slots.value.includes(m.id))
  if (next)
    slots.value = [...slots.value, next.id]
}

const collapsedGroups = ref(new Set<string>())

function toggleGroup(key: string): void {
  const next = new Set(collapsedGroups.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  collapsedGroups.value = next
}

const grouped = useTableGroupedRows<SpecRow>(() => ({
  data: SPEC_ROWS,
  groupBy: row => row.group,
  groupOrder: GROUP_ORDER,
  collapsedGroups: collapsedGroups.value,
  onToggleGroup: toggleGroup,
  getRowKey: row => row.id,
  renderGroupHeader: groupKey => h(HStack, { gap: 2, vAlign: 'center', style: { position: 'sticky', insetInlineStart: 'var(--astryx-spacing-6)', width: 'fit-content' } }, () =>
    h(Heading, { level: 3, accessibilityLevel: 2 }, () => groupKey),
  ),
}))

const sticky = useTableStickyColumns<SpecRow>({ startKeys: ['spec'] })

/** 正被悬停或聚焦的模型列；清除（即移除该列）只在这时出现。 */
const activeHeader = ref<number | null>(null)

/** 模型列的表头就是一个选择器；已被其它列选中的模型不可再选，保留至少 MIN_SLOTS 列时才显示清除。 */
function renderModelHeader(index: number, modelId: string) {
  const setActive = (value: boolean) => {
    activeHeader.value = value ? index : (activeHeader.value === index ? null : activeHeader.value)
  }
  return h('div', {
    class: 'model-header',
    style: { flex: '1 1 100%', minWidth: 0 },
    onMouseenter: () => setActive(true),
    onMouseleave: () => setActive(false),
    onFocusin: () => setActive(true),
    onFocusout: () => setActive(false),
  }, h(Selector, {
    'modelValue': modelId,
    'label': `Model ${index + 1}`,
    'isLabelHidden': true,
    'size': 'lg',
    'hasClear': activeHeader.value === index && slots.value.length > MIN_SLOTS,
    'options': MODELS.map(option => ({
      value: option.id,
      label: option.name,
      description: option.provider,
      icon: PROVIDER_ICON[option.provider],
      disabled: option.id !== modelId && slots.value.includes(option.id),
    })),
    'onUpdate:modelValue': (next: string | number | null) => next == null ? removeSlot(index) : selectSlot(index, String(next)),
  }))
}

const columns = computed<TableColumn<SpecRow>[]>(() => [
  {
    key: 'spec',
    header: 'Models',
    width: pixel(220),
    renderCell: row => h(HStack, { vAlign: 'center', height: 24 }, () => h(Text, { type: 'label', color: 'secondary' }, () => row.label)),
  },
  ...slots.value.map((modelId, index) => {
    const model = modelById.get(modelId)
    return {
      key: `slot-${index}`,
      width: proportional(1, { minWidth: 236 }),
      align: 'end' as const,
      header: () => renderModelHeader(index, modelId),
      renderCell: (row: SpecRow) => {
        if (!model)
          return h(Text, { type: 'supporting' }, () => '—')
        if (row.renderValue)
          return row.renderValue(model)
        if (row.modalities) {
          const included = row.modalities(model)
          const explanation = MODALITY_ORDER.map(modality => `${MODALITY_LABEL[modality]}: ${included.includes(modality) ? 'supported' : 'not supported'}`).join('; ')
          return h(Tooltip, { content: explanation, hasHoverIndication: false, touchTrigger: 'tap' }, () => h(HStack, { gap: 3, vAlign: 'center', hAlign: 'end', height: 24, tabindex: 0, role: 'group', ariaLabel: 'Model modalities' }, () => MODALITY_ORDER.map(modality =>
            h(HStack, { width: 20, height: 20, hAlign: 'center', vAlign: 'center' }, () => h(Icon, {
              icon: MODALITY_ICON[modality],
              size: 'md',
              color: included.includes(modality) ? 'primary' : 'disabled',
            })),
          )))
        }
        const value = row.get(model)
        if (typeof value === 'boolean') {
          return h(HStack, { gap: 1, hAlign: 'end', vAlign: 'center', height: 24 }, () => h(Icon, {
            icon: value ? CircleCheckIcon : CircleXIcon,
            label: value ? 'Supported' : 'Not supported',
            size: 'md',
            color: value ? 'success' : 'error',
          }))
        }
        if (typeof value === 'string') {
          return h(HStack, { gap: 1, vAlign: 'center', hAlign: 'end', height: 24 }, () => h(Text, { type: 'large', weight: 'normal' }, () => value))
        }
        const best = bestByRow.value.get(row.id)
        const isBest = highlightBest.value && best != null && value === best
        if (row.isScore) {
          return h(HStack, { gap: 1, vAlign: 'center', hAlign: 'end', height: 24 }, () => [
            h(HStack, { width: 56, vAlign: 'center' }, () => h(ProgressBar, { label: `Score ${decimal.format(value)} out of 100`, isLabelHidden: true, value, variant: 'accent', width: '100%' })),
            h(Text, { type: 'large', hasTabularNumbers: true, weight: isBest ? 'semibold' : 'normal' }, () => row.format?.(value) ?? String(value)),
          ])
        }
        const formatted = row.format?.(value) ?? String(value)
        return h(HStack, { gap: 1, vAlign: 'center', hAlign: 'end', height: 24, class: isBest ? 'best-cell' : undefined }, () => [
          h(Text, { type: 'large', hasTabularNumbers: true, weight: isBest ? 'semibold' : 'normal' }, () => formatted),
          row.unit ? h(Text, { type: 'large', weight: 'normal', color: isBest ? 'primary' : 'secondary' }, () => row.unit) : null,
        ])
      },
    }
  }),
])

</script>

<template>
  <Layout height="auto" :content-width="1440">
    <template #header>
      <LayoutHeader :padding="4">
        <HStack :gap="3" align="center" wrap="wrap">
          <StackItem size="fill">
            <Heading :level="1">
              Compare models
            </Heading>
          </StackItem>
          <Switch v-model="highlightBest" label="Highlight best" size="sm" />
          <Button label="Add model" variant="secondary" :is-disabled="slots.length >= MODELS.length" @click="addModel">
            <template #icon>
              <Icon icon="i-heroicons-plus" size="sm" />
            </template>
          </Button>
        </HStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="4">
      <VStack :gap="4">
        <Card :padding="5" class="table-frame">
          <Table
            :data="grouped.data.value"
            :columns="columns"
            :id-key="grouped.idKey"
            density="spacious"
            dividers="grid"
            :plugins="{ grouped: grouped.plugin, sticky }"
          />
        </Card>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
/* 原版分组头单元格的内边距固定为 spacing-2 / spacing-3（起始侧 0），不随密度变；
   core 的 `.astryx-table[data-density='spacious'] :is(th, td)` 会把它撑成 12 / 16，行高 49 而不是 41。 */
.table-frame :deep(.astryx-table td.astryx-table__group:first-child) {
  padding-block: var(--astryx-spacing-2);
  padding-inline: 0 var(--astryx-spacing-3);
}

.table-frame {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

/* 胜出的格子整格铺满底色：抵掉 spacious 密度下单元格自己的内边距。 */
:deep(.best-cell) {
  box-sizing: content-box;
  background: var(--astryx-color-background-blue);
  margin-block: calc(-1 * var(--astryx-spacing-3));
  margin-inline: calc(-1 * var(--astryx-spacing-4));
  padding-block: var(--astryx-spacing-3);
  padding-inline: var(--astryx-spacing-4);
}
</style>
