<script setup lang="ts">
import type { TableColumn, TablePlugin } from '@astryx-vue/core'
import type { Component, PropType } from 'vue'
import {
  applyTableFilters,
  Banner,
  Button,
  Divider,
  EmptyState,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  MetadataList,
  MetadataListItem,
  pixel,
  proportional,
  SegmentedControl,
  SegmentedControlItem,
  StackItem,
  Table,
  Text,
  TextInput,
  useHoverCard,
  useTableFiltering,
  useTableFilterState,
  useTableSortable,
  useTableSortableState,
  VStack,
} from '@astryx-vue/core'
import { computed, defineComponent, h, ref, shallowReactive, Teleport, watchEffect } from 'vue'

type LineCategory = 'design' | 'development' | 'content' | 'project'
type BillingBasis = 'hourly' | 'fixed'

interface LineItem extends Record<string, unknown> {
  id: string
  description: string
  category: LineCategory
  basis: BillingBasis
  quantity: number
  unitPriceCents: number
}

interface InvoiceRow extends LineItem {
  amountCents: number
}

const LINE_ITEMS: LineItem[] = [
  {
    id: 'li-01',
    description: 'Discovery workshop',
    category: 'design',
    basis: 'fixed',
    quantity: 1,
    unitPriceCents: 240_000,
  },
  {
    id: 'li-02',
    description: 'Stakeholder interviews',
    category: 'design',
    basis: 'hourly',
    quantity: 12,
    unitPriceCents: 14_500,
  },
  {
    id: 'li-03',
    description: 'User research synthesis',
    category: 'design',
    basis: 'hourly',
    quantity: 18,
    unitPriceCents: 14_500,
  },
  {
    id: 'li-04',
    description: 'Wireframes — key templates',
    category: 'design',
    basis: 'hourly',
    quantity: 34,
    unitPriceCents: 14_500,
  },
  {
    id: 'li-05',
    description: 'Visual design system',
    category: 'design',
    basis: 'fixed',
    quantity: 1,
    unitPriceCents: 680_000,
  },
  {
    id: 'li-06',
    description: 'Page designs — 14 templates',
    category: 'design',
    basis: 'hourly',
    quantity: 62,
    unitPriceCents: 14_500,
  },
  {
    id: 'li-07',
    description: 'Prototype & usability testing',
    category: 'design',
    basis: 'hourly',
    quantity: 22,
    unitPriceCents: 14_500,
  },
  {
    id: 'li-08',
    description: 'Frontend build — component library',
    category: 'development',
    basis: 'hourly',
    quantity: 88,
    unitPriceCents: 16_500,
  },
  {
    id: 'li-09',
    description: 'Frontend build — page templates',
    category: 'development',
    basis: 'hourly',
    quantity: 104,
    unitPriceCents: 16_500,
  },
  {
    id: 'li-10',
    description: 'CMS setup & content modelling',
    category: 'development',
    basis: 'hourly',
    quantity: 40,
    unitPriceCents: 16_500,
  },
  {
    id: 'li-11',
    description: 'Search & filtering integration',
    category: 'development',
    basis: 'hourly',
    quantity: 26,
    unitPriceCents: 16_500,
  },
  {
    id: 'li-12',
    description: 'Analytics & tag manager setup',
    category: 'development',
    basis: 'hourly',
    quantity: 10,
    unitPriceCents: 16_500,
  },
  {
    id: 'li-13',
    description: 'Accessibility audit & remediation',
    category: 'development',
    basis: 'fixed',
    quantity: 1,
    unitPriceCents: 320_000,
  },
  {
    id: 'li-14',
    description: 'Cross-browser QA',
    category: 'development',
    basis: 'hourly',
    quantity: 24,
    unitPriceCents: 13_500,
  },
  {
    id: 'li-15',
    description: 'Copywriting — 14 pages',
    category: 'content',
    basis: 'hourly',
    quantity: 36,
    unitPriceCents: 12_500,
  },
  {
    id: 'li-16',
    description: 'Content migration',
    category: 'content',
    basis: 'hourly',
    quantity: 28,
    unitPriceCents: 9_500,
  },
  {
    id: 'li-17',
    description: 'Stock photography licences',
    category: 'content',
    basis: 'fixed',
    quantity: 24,
    unitPriceCents: 1_800,
  },
  {
    id: 'li-18',
    description: 'Project management — 12 weeks',
    category: 'project',
    basis: 'fixed',
    quantity: 12,
    unitPriceCents: 85_000,
  },
  {
    id: 'li-19',
    description: 'Training & handover session',
    category: 'project',
    basis: 'fixed',
    quantity: 2,
    unitPriceCents: 120_000,
  },
]

const ROWS: InvoiceRow[] = LINE_ITEMS.map(item => ({
  ...item,
  amountCents: item.quantity * item.unitPriceCents,
}))

const CATEGORY_LABEL: Record<LineCategory, string> = {
  design: 'Design',
  development: 'Development',
  content: 'Content',
  project: 'Project management',
}

const BASIS_FILTERS = [
  { value: 'all' as const, label: 'All lines' },
  { value: 'hourly' as const, label: 'Hourly' },
]

const FILTER_FIELDS = [
  { key: 'description', label: 'Description', type: 'string' as const },
  {
    key: 'category',
    label: 'Category',
    type: 'enum' as const,
    options: [
      { value: 'design', label: 'Design' },
      { value: 'development', label: 'Development' },
      { value: 'content', label: 'Content' },
      { value: 'project', label: 'Project management' },
    ],
  },
  { key: 'quantity', label: 'Quantity', type: 'number' as const, isIntegerOnly: true },
]

const TAX_RATE = 0.0875

const INVOICE_DETAILS = [
  { label: 'Billed to', value: 'Brightwater Coffee Co.' },
  { label: 'Project', value: 'Website redesign' },
  { label: 'Issue date', value: 'Mar 31, 2026' },
  { label: 'Due date', value: 'Apr 30, 2026' },
  { label: 'Payment terms', value: 'Net 30' },
  { label: 'Purchase order', value: 'PO-4471' },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const decimal = new Intl.NumberFormat('en-US')

/** 搜索框起始位置的放大镜，供 `TextInput` 的 `startIcon` 使用。 */
function SearchIcon() {
  return h(Icon, { icon: 'search', size: 'sm' })
}

function formatCents(cents: number): string {
  return currency.format(cents / 100)
}

const ROWS_TOTAL_CENTS = LINE_ITEMS.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0)

const BASIS_LABEL: Record<BillingBasis, string> = {
  hourly: 'Hourly',
  fixed: 'Fixed fee',
}

/**
 * 行元素登记处。表格的行级扩展点 `rowPatch.ref` 在 `<tr>` 挂上、卸下时写这里，
 * 单元格按 id 取到自己那一行，再把 `useHoverCard` 挂到整行上。
 */
const rowElements = shallowReactive(new Map<string, HTMLTableRowElement>())

/**
 * 整行悬停详情。卡片挂在整行而不是单元格上，指针从行移到卡片上时不会被关掉，
 * 所以卡片里的 Dispute 按钮点得到。
 */
const DescriptionCell = defineComponent({
  props: { item: { type: Object as PropType<InvoiceRow>, required: true } },
  setup(props) {
    const card = useHoverCard({
      placement: 'below',
      alignment: 'start',
      label: `${props.item.description} details`,
      // 行挂上 hook 的那一刻还不是可聚焦元素，交给 auto 判断会连焦点事件都绑不上。
      focusTrigger: 'always',
    })

    watchEffect(() => {
      const row = rowElements.get(props.item.id) ?? null
      card.triggerRef.value = row
      if (row)
        row.tabIndex = 0
    })

    const share = computed(() => (props.item.amountCents / ROWS_TOTAL_CENTS) * 100)

    return () => [
      h(Text, { maxLines: 1 }, () => props.item.description),
      h(Teleport, { to: 'body' }, [
        h('div', {
          ...card.contentProps.value,
          ref: card.contentRef,
          class: 'astryx-hover-card',
          style: { ...card.contentStyle.value, display: card.isOpen.value ? undefined : 'none' },
        }, [
          h('div', { class: 'astryx-hover-card__content' }, [
            h(VStack, { gap: 3, width: 280 }, () => [
              h(Heading, { level: 3, accessibilityLevel: 2 }, () => props.item.description),
              h(MetadataList, { label: { position: 'start' } }, () => [
                h(MetadataListItem, { label: 'Category' }, () => CATEGORY_LABEL[props.item.category]),
                h(MetadataListItem, { label: 'Billing' }, () => BASIS_LABEL[props.item.basis]),
                h(MetadataListItem, { label: 'Calculation' }, () => `${decimal.format(props.item.quantity)} \u00D7 ${formatCents(props.item.unitPriceCents)}`),
                h(MetadataListItem, { label: 'Amount' }, () => formatCents(props.item.amountCents)),
                h(MetadataListItem, { label: 'Share of invoice' }, () => `${share.value.toFixed(1)}%`),
              ]),
              h(Button, { label: 'Dispute this line', variant: 'secondary', width: '100%' }),
            ]),
          ]),
        ]),
      ]),
    ]
  },
})

/** 首尾两列的单元格内边距归零，让表格文字和上面的 MetadataList 落在同一条内容线上。 */
const flushEdgesPlugin: TablePlugin<InvoiceRow> = {
  cellPatch({ column, columns }) {
    if (column.key === columns[0]?.key)
      return { style: { paddingInlineStart: 0 } }
    if (column.key === columns[columns.length - 1]?.key)
      return { style: { paddingInlineEnd: 0 } }
    return null
  },
}

/** 行级插件：登记每一行的元素，并把详情卡片所在的行标记成可聚焦。 */
const rowPlugin: TablePlugin<InvoiceRow> = {
  rowPatch(item) {
    return {
      ref: (element) => {
        if (element)
          rowElements.set(item.id, element)
        else
          rowElements.delete(item.id)
      },
    }
  },
}

const query = ref('')
const basis = ref<'all' | BillingBasis>('all')

const { filters: columnFilters, onFilterChange, clearAll } = useTableFilterState()

const filterPlugin = useTableFiltering<InvoiceRow>(() => ({
  filters: columnFilters.value,
  onFilterChange,
  fields: FILTER_FIELDS,
  variant: 'popover',
}))

const visible = computed(() => {
  let matched = applyTableFilters(ROWS, columnFilters.value, FILTER_FIELDS)
  if (basis.value !== 'all')
    matched = matched.filter(item => item.basis === basis.value)
  const term = query.value.trim().toLowerCase()
  if (term)
    matched = matched.filter(item => item.description.toLowerCase().includes(term))
  return matched
})

const columns: TableColumn<InvoiceRow>[] = [
  {
    key: 'description',
    header: 'Description',
    width: proportional(3),
    sortable: { compare: (a, b) => a.description.localeCompare(b.description) },
    filter: 'description',
    renderCell: item => h(DescriptionCell as Component, { item }),
  },
  {
    key: 'category',
    header: 'Category',
    width: pixel(160),
    sortable: { compare: (a, b) => CATEGORY_LABEL[a.category].localeCompare(CATEGORY_LABEL[b.category]) },
    filter: 'category',
    renderCell: item => h(Text, { color: 'secondary', maxLines: 1 }, () => CATEGORY_LABEL[item.category]),
  },
  {
    key: 'quantity',
    header: 'Qty',
    width: pixel(80),
    align: 'end',
    sortable: { compare: (a, b) => a.quantity - b.quantity },
    filter: 'quantity',
    renderCell: item => h(Text, { hasTabularNumbers: true }, () => decimal.format(item.quantity)),
  },
  {
    key: 'unitPrice',
    header: 'Rate',
    width: pixel(120),
    align: 'end',
    sortable: { sortKey: 'unitPriceCents', compare: (a, b) => a.unitPriceCents - b.unitPriceCents },
    renderCell: item => h(Text, { hasTabularNumbers: true }, () => formatCents(item.unitPriceCents)),
  },
  {
    key: 'amount',
    header: 'Amount',
    width: pixel(132),
    align: 'end',
    sortable: { sortKey: 'amountCents', compare: (a, b) => a.amountCents - b.amountCents },
    renderCell: item => h(Text, { hasTabularNumbers: true }, () => formatCents(item.amountCents)),
  },
]

const { sortedData, sortConfig } = useTableSortableState<InvoiceRow>({ data: visible, columns })
const sortPlugin = useTableSortable<InvoiceRow>(sortConfig)

const subtotalCents = computed(() => visible.value.reduce((sum, item) => sum + item.amountCents, 0))
const taxCents = computed(() => Math.round(subtotalCents.value * TAX_RATE))
const totalCents = computed(() => subtotalCents.value + taxCents.value)

const activeFilterCount = computed(() =>
  (query.value.trim() === '' ? 0 : 1)
  + Object.keys(columnFilters.value).length
  + (basis.value === 'all' ? 0 : 1),
)

function clearEverything(): void {
  query.value = ''
  basis.value = 'all'
  clearAll()
}

const AMOUNT_COLUMN_WIDTH = 132
</script>

<template>
  <Layout height="fill" :content-width="960">
    <LayoutContent :padding="0">
      <VStack :gap="8" :padding="4">
        <VStack :gap="6" :padding-block-end="4">
          <HStack :gap="3" align="center" wrap="wrap">
            <StackItem size="fill">
              <Heading :level="1">
                Invoice INV-2043
              </Heading>
            </StackItem>
            <Button label="Download PDF" variant="secondary">
              <template #icon>
                <Icon icon="i-heroicons-arrow-down-tray" size="sm" />
              </template>
            </Button>
          </HStack>
          <MetadataList columns="multi" orientation="vertical" :label="{ position: 'top' }">
            <MetadataListItem v-for="detail in INVOICE_DETAILS" :key="detail.label" :label="detail.label">
              {{ detail.value }}
            </MetadataListItem>
          </MetadataList>
        </VStack>

        <HStack :gap="3" align="center" justify="between" wrap="wrap">
          <SegmentedControl v-model="basis" label="Filter by billing basis">
            <SegmentedControlItem
              v-for="filter in BASIS_FILTERS"
              :key="filter.value"
              :value="filter.value"
              :label="filter.label"
            />
          </SegmentedControl>
          <VStack :width="300">
            <TextInput
              v-model="query"
              label="Search line items"
              is-label-hidden
              placeholder="Search…"
              :start-icon="SearchIcon"
            />
          </VStack>
        </HStack>

        <VStack :gap="6">
          <EmptyState
            v-if="visible.length === 0"
            title="No matching line items"
            description="No line on this invoice matches the current filters."
          >
            <template #actions>
              <Button label="Clear filters" variant="secondary" @click="clearEverything" />
            </template>
          </EmptyState>
          <VStack v-else :gap="4">
            <div class="invoice-table">
              <Table
                :data="sortedData"
                :columns="columns"
                id-key="id"
                density="balanced"
                dividers="none"
                has-hover
                text-overflow="truncate"
                :plugins="{ sort: sortPlugin, filter: filterPlugin, rows: rowPlugin, flush: flushEdgesPlugin }"
              />
            </div>
            <VStack :gap="3">
              <Divider />
              <HStack :gap="6" justify="end" align="center">
                <Text>Subtotal</Text>
                <VStack :width="AMOUNT_COLUMN_WIDTH">
                  <Text justify="end" display="block" has-tabular-numbers>
                    {{ formatCents(subtotalCents) }}
                  </Text>
                </VStack>
              </HStack>
              <HStack :gap="6" justify="end" align="center">
                <Text color="secondary">
                  Tax (8.75%)
                </Text>
                <VStack :width="AMOUNT_COLUMN_WIDTH">
                  <Text justify="end" display="block" has-tabular-numbers color="secondary">
                    {{ formatCents(taxCents) }}
                  </Text>
                </VStack>
              </HStack>
              <Divider />
              <HStack :gap="6" justify="end" align="center">
                <Text weight="semibold">
                  Total due
                </Text>
                <VStack :width="AMOUNT_COLUMN_WIDTH">
                  <Text justify="end" display="block" has-tabular-numbers weight="semibold">
                    {{ formatCents(totalCents) }}
                  </Text>
                </VStack>
              </HStack>
              <Divider />
            </VStack>
          </VStack>
          <Banner
            v-if="visible.length > 0 && activeFilterCount > 0"
            status="warning"
            title="Filtered view — these totals are partial"
            :description="`Showing ${visible.length} of ${ROWS.length} lines. The subtotal, tax, and total due above cover only the lines currently visible.`"
          >
            <template #end>
              <Button label="Clear all filters" variant="secondary" @click="clearEverything" />
            </template>
          </Banner>
        </VStack>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
/* 原版 Table 的数据模式默认 `table-layout: fixed`，列宽严格按声明的比例分；core 目前是 auto，列宽按内容算、行高有 0.5px 的小数。 */
.invoice-table :deep(.astryx-table) {
  table-layout: fixed;
}
</style>
