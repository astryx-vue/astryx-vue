<script setup lang="ts">
import {
  Badge,
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
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

interface Model {
  id: string
  name: string
  provider: string
  context: number
  inputPrice: number
  outputPrice: number
  speed: number
  mmlu: number
  hasTools: boolean
}

const MODELS: Model[] = [
  { id: 'atlas-4-flash', name: 'Atlas 4 Flash', provider: 'Northwind', context: 1_000_000, inputPrice: 0.1, outputPrice: 0.4, speed: 186, mmlu: 78.4, hasTools: true },
  { id: 'meridian-2-5-flash', name: 'Meridian 2.5 Flash', provider: 'Calder Labs', context: 1_048_576, inputPrice: 0.075, outputPrice: 0.3, speed: 214, mmlu: 76.9, hasTools: true },
  { id: 'kestrel-v4-turbo', name: 'Kestrel V4 Turbo', provider: 'Sable AI', context: 400_000, inputPrice: 0.3, outputPrice: 1.2, speed: 142, mmlu: 82.6, hasTools: true },
  { id: 'orion-mini-3', name: 'Orion Mini 3', provider: 'Halcyon', context: 262_144, inputPrice: 0.05, outputPrice: 0.2, speed: 248, mmlu: 71.2, hasTools: true },
  { id: 'orion-3-ultra', name: 'Orion 3 Ultra', provider: 'Halcyon', context: 524_288, inputPrice: 0.9, outputPrice: 2.7, speed: 96, mmlu: 85.1, hasTools: true },
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
}

const SPEC_ROWS: SpecRow[] = [
  { id: 'provider', group: 'Overview', label: 'Provider', get: m => m.provider },
  { id: 'context', group: 'Overview', label: 'Context window', unit: 'tokens', better: 'higher', get: m => m.context, format: v => compact.format(v) },
  { id: 'input-price', group: 'Pricing', label: 'Input', unit: '/1M', better: 'lower', get: m => m.inputPrice, format: v => price.format(v) },
  { id: 'output-price', group: 'Pricing', label: 'Output', unit: '/1M', better: 'lower', get: m => m.outputPrice, format: v => price.format(v) },
  { id: 'blended', group: 'Pricing', label: 'Blended (3:1)', unit: '/1M', better: 'lower', get: m => (m.inputPrice * 3 + m.outputPrice) / 4, format: v => price.format(v) },
  { id: 'speed', group: 'Performance', label: 'Output speed', unit: 'tok/s', better: 'higher', get: m => m.speed, format: v => String(Math.round(v)) },
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

const columns = computed<TableColumn<SpecRow>[]>(() => [
  {
    key: 'spec',
    header: 'Criteria',
    width: pixel(220),
    renderCell: row => h(Text, { type: 'label', color: 'secondary' }, () => row.label),
  },
  ...slots.value.map((modelId, index) => {
    const model = modelById.get(modelId)
    const headerModel = modelById.get(modelId)
    return {
      key: `slot-${index}`,
      width: proportional(1, { minWidth: 236 }),
      align: 'end' as const,
      header: headerModel?.name ?? `Model ${index + 1}`,
      renderCell: (row: SpecRow) => {
        if (!model)
          return h(Text, { type: 'supporting' }, () => '—')
        const value = row.get(model)
        if (typeof value === 'boolean') {
          return h(HStack, { hAlign: 'end', vAlign: 'center' }, () => h(Icon, {
            icon: value ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle',
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

const rowsByGroup = computed(() => {
  const map = new Map<GroupKey, SpecRow[]>()
  for (const row of SPEC_ROWS) {
    const list = map.get(row.group) ?? []
    list.push(row)
    map.set(row.group, list)
  }
  return map
})
</script>

<template>
  <Layout height="auto" :content-width="1440">
    <template #header>
      <LayoutHeader :padding="4">
        <HStack :gap="3" v-align="center" wrap="wrap">
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
      <VStack :gap="6">
        <HStack :gap="3" v-align="end" wrap="wrap">
          <VStack v-for="(slotId, index) in slots" :key="slotId" :width="280">
            <Selector
              :model-value="slotId"
              :label="`Model ${index + 1}`"
              size="lg"
              :options="MODELS.map(option => ({
                value: option.id,
                label: option.name,
                description: option.provider,
                disabled: option.id !== slotId && slots.includes(option.id),
              }))"
              @update:model-value="(next: string) => selectSlot(index, next)"
            />
          </VStack>
        </HStack>
        <Card v-for="group in GROUP_ORDER" :key="group" :padding="5">
          <VStack :gap="4">
            <Heading :level="3">
              {{ group }}
            </Heading>
            <Table
              :data="rowsByGroup.get(group) ?? []"
              :columns="columns"
              id-key="id"
              density="spacious"
              dividers="grid"
            />
          </VStack>
        </Card>
        <HStack :gap="2" wrap="wrap">
          <Badge v-for="(slotId, index) in slots" :key="slotId" variant="neutral" :label="`Column ${index + 1}`" />
          <Button
            v-for="(slotId, index) in slots"
            :key="`remove-${slotId}`"
            label="Remove column"
            variant="ghost"
            size="sm"
            :is-disabled="slots.length <= MIN_SLOTS"
            @click="removeSlot(index)"
          />
        </HStack>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
:deep(.best-cell) {
  background: var(--color-background-blue);
  margin-inline: calc(-1 * var(--spacing-4));
  padding-inline: var(--spacing-4);
}
</style>
