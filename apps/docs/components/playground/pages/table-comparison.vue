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
  useTableGroupedRows,
  useTableStickyColumns,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn, TablePlugin } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

type Modality = 'text' | 'image' | 'audio' | 'video' | 'document'

const MODALITY_ORDER: Modality[] = ['text', 'image', 'audio', 'video', 'document']

/** 输入输出模态各占同一个格子位置，缺哪一项就用暗色图标占位。 */
const MODALITY_ICON: Record<Modality, string> = {
  text: 'i-carbon-letter-tt',
  image: 'i-heroicons-photo',
  audio: 'i-heroicons-speaker-wave',
  video: 'i-heroicons-video-camera',
  document: 'i-heroicons-document-text',
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
  hasTools: boolean
}

const MODELS: Model[] = [
  { id: 'atlas-4-flash', name: 'Atlas 4 Flash', provider: 'Northwind', context: 1_000_000, maxOutput: 65_536, cutoff: 'Mar 2026', inputModalities: ['text', 'image'], outputModalities: ['text'], hasOpenWeights: false, inputPrice: 0.1, outputPrice: 0.4, cachedPrice: 0.025, speed: 186, latency: 0.28, mmlu: 78.4, hasTools: true },
  { id: 'meridian-2-5-flash', name: 'Meridian 2.5 Flash', provider: 'Calder Labs', context: 1_048_576, maxOutput: 8_192, cutoff: 'Jan 2026', inputModalities: ['text', 'image', 'video'], outputModalities: ['text'], hasOpenWeights: false, inputPrice: 0.075, outputPrice: 0.3, cachedPrice: 0.019, speed: 214, latency: 0.24, mmlu: 76.9, hasTools: true },
  { id: 'kestrel-v4-turbo', name: 'Kestrel V4 Turbo', provider: 'Sable AI', context: 400_000, maxOutput: 16_384, cutoff: 'Feb 2026', inputModalities: ['text', 'image', 'document'], outputModalities: ['text'], hasOpenWeights: false, inputPrice: 0.3, outputPrice: 1.2, cachedPrice: 0.075, speed: 142, latency: 0.33, mmlu: 82.6, hasTools: true },
  { id: 'orion-mini-3', name: 'Orion Mini 3', provider: 'Halcyon', context: 262_144, maxOutput: 32_768, cutoff: 'Nov 2025', inputModalities: ['text'], outputModalities: ['text'], hasOpenWeights: true, inputPrice: 0.05, outputPrice: 0.2, cachedPrice: 0.012, speed: 248, latency: 0.19, mmlu: 71.2, hasTools: true },
  { id: 'orion-3-ultra', name: 'Orion 3 Ultra', provider: 'Halcyon', context: 524_288, maxOutput: 65_536, cutoff: 'Nov 2025', inputModalities: ['text', 'image', 'document'], outputModalities: ['text', 'image'], hasOpenWeights: true, inputPrice: 0.9, outputPrice: 2.7, cachedPrice: 0.22, speed: 96, latency: 0.48, mmlu: 85.1, hasTools: true },
]

const DEFAULT_SLOTS = ['atlas-4-flash', 'meridian-2-5-flash', 'kestrel-v4-turbo']
const MIN_SLOTS = 2

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })
const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 3 })
const decimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

type GroupKey = 'Overview' | 'Pricing' | 'Performance' | 'Benchmarks'

interface SpecRow extends Record<string, unknown> {
  id: string
  label: string
  group: GroupKey
  better?: 'higher' | 'lower'
  get: (model: Model) => number | string | boolean
  format?: (value: number) => string
  unit?: string
  isScore?: boolean
  /** 模态行：格子位置固定，缺的项画成暗色。 */
  modalities?: (model: Model) => Modality[]
}

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
  { id: 'latency', group: 'Performance', label: 'Time to first token', unit: 'sec', better: 'lower', get: m => m.latency, format: v => v.toFixed(2) },
  { id: 'mmlu', group: 'Benchmarks', label: 'MMLU-Pro', better: 'higher', get: m => m.mmlu, format: v => decimal.format(v), isScore: true },
  { id: 'tools', group: 'Benchmarks', label: 'Function calling', get: m => m.hasTools },
]

const GROUP_ORDER: GroupKey[] = ['Overview', 'Pricing', 'Performance', 'Benchmarks']

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
  renderGroupHeader: groupKey => h(Heading, { level: 3 }, () => groupKey),
}))

const sticky = useTableStickyColumns<SpecRow>({ startKeys: ['spec'] })

/** 模型列的表头是一个选择器。core 的表头只收字符串，所以用 headerPatch 在表头前面放控件。 */
const modelHeaderPlugin: TablePlugin<SpecRow> = {
  headerPatch(column) {
    const match = /^slot-(\d+)$/.exec(column.key)
    if (!match)
      return null
    const index = Number(match[1])
    const modelId = slots.value[index]
    if (modelId == null)
      return null
    return {
      before: () => h('div', { class: 'model-header' }, h(Selector, {
        'modelValue': modelId,
        'label': `Model ${index + 1}`,
        'isLabelHidden': true,
        'size': 'lg',
        'hasClear': slots.value.length > MIN_SLOTS,
        'options': MODELS.map(option => ({
          value: option.id,
          label: option.name,
          description: option.provider,
          icon: PROVIDER_ICON[option.provider],
          disabled: option.id !== modelId && slots.value.includes(option.id),
        })),
        'onUpdate:modelValue': (next: string | number | null) => next == null ? removeSlot(index) : selectSlot(index, String(next)),
      })),
    }
  },
}

const columns = computed<TableColumn<SpecRow>[]>(() => [
  {
    key: 'spec',
    header: 'Models',
    width: pixel(220),
    renderCell: row => h(Text, { type: 'label', color: 'secondary' }, () => row.label),
  },
  ...slots.value.map((modelId, index) => {
    const model = modelById.get(modelId)
    return {
      key: `slot-${index}`,
      width: proportional(1, { minWidth: 236 }),
      align: 'end' as const,
      header: `Model ${index + 1}`,
      headerHidden: true,
      renderCell: (row: SpecRow) => {
        if (!model)
          return h(Text, { type: 'supporting' }, () => '—')
        if (row.modalities) {
          const included = row.modalities(model)
          return h(HStack, { gap: 1, vAlign: 'center', hAlign: 'end' }, () => MODALITY_ORDER.map(modality =>
            h(Icon, {
              icon: MODALITY_ICON[modality],
              size: 'md',
              color: included.includes(modality) ? 'primary' : 'disabled',
              label: MODALITY_LABEL[modality],
            }),
          ))
        }
        const value = row.get(model)
        if (typeof value === 'boolean') {
          return h(HStack, { hAlign: 'end', vAlign: 'center' }, () => h(Icon, {
            icon: value ? 'i-carbon-checkmark-filled' : 'i-carbon-close-filled',
            size: 'md',
            color: value ? 'success' : 'error',
          }))
        }
        if (typeof value === 'string') {
          return h(Text, { type: 'large' }, () => value)
        }
        const best = bestByRow.value.get(row.id)
        const isBest = highlightBest.value && best != null && value === best
        if (row.isScore) {
          return h(HStack, { gap: 1, vAlign: 'center', hAlign: 'end' }, () => [
            h(HStack, { width: 56, vAlign: 'center' }, () => h(ProgressBar, { label: 'Score', isLabelHidden: true, value, variant: 'accent' })),
            h(Text, { hasTabularNumbers: true, weight: isBest ? 'semibold' : 'normal' }, () => row.format?.(value) ?? String(value)),
          ])
        }
        const formatted = row.format?.(value) ?? String(value)
        return h(HStack, { gap: 1, vAlign: 'center', hAlign: 'end', class: isBest ? 'best-cell' : undefined }, () => [
          h(Text, { type: 'large', hasTabularNumbers: true, weight: isBest ? 'semibold' : 'normal' }, () => formatted),
          row.unit ? h(Text, { type: 'large', color: 'secondary' }, () => row.unit) : null,
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
            :plugins="{ grouped: grouped.plugin, sticky, header: modelHeaderPlugin }"
          />
        </Card>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.model-header {
  width: 100%;
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
