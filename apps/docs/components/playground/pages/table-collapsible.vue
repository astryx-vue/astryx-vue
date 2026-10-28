<script setup lang="ts">
import {
  Badge,
  Button,
  Card,
  Collapsible,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  pixel,
  ProgressBar,
  proportional,
  SegmentedControl,
  SegmentedControlItem,
  StackItem,
  Table,
  Text,
  Token,
  useTableRowExpansion,
  useTableSortable,
  useTableSortableState,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { PlaygroundAreaChart } from '@astryx-vue/playground-charts'
import { computed, defineComponent, h, ref } from 'vue'

type RangeId = '1W' | '1M' | '3M' | 'YTD' | '1Y'

interface AccountRecord extends Record<string, unknown> {
  id: string
  trend: number
}

interface BankAccount extends AccountRecord {
  name: string
  institution: string
  mask: string
  kind: string
  availableCents: number
}

interface CreditCardAccount extends AccountRecord {
  name: string
  issuer: string
  mask: string
  balanceCents: number
  limitCents: number
}

interface ProcessorAccount extends AccountRecord {
  name: string
  merchantId: string
  pendingPayoutCents: number
  feesMtdCents: number
}

interface InvestmentAccount extends AccountRecord {
  name: string
  custodian: string
  marketValueCents: number
  costBasisCents: number
}

const RANGE_IDS: RangeId[] = ['1W', '1M', '3M', 'YTD', '1Y']
const RANGE_DAYS: Record<RangeId, number> = { '1W': 7, '1M': 30, '3M': 90, YTD: 273, '1Y': 365 }
const SERIES_DAYS = RANGE_DAYS['1Y']

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const percentFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function money(cents: number): string {
  return currency.format(cents / 100)
}

function seedFrom(id: string): number {
  let hash = 2166136261
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function buildHistory<T extends AccountRecord>(rows: T[], pick: (row: T) => number, volatility: number): Record<string, number[]> {
  const out: Record<string, number[]> = {}
  for (const row of rows) {
    let state = seedFrom(row.id) || 1
    const random = () => {
      state ^= state << 13
      state ^= state >>> 17
      state ^= state << 5
      return ((state >>> 0) % 10000) / 10000 - 0.5
    }
    const series = new Array<number>(SERIES_DAYS)
    let value = pick(row)
    series[SERIES_DAYS - 1] = value
    for (let day = SERIES_DAYS - 2; day >= 0; day--) {
      value /= 1 + row.trend + random() * volatility
      series[day] = Math.max(1, Math.round(value))
    }
    out[row.id] = series
  }
  return out
}

const BANK_ACCOUNTS: BankAccount[] = [
  { id: 'bank-1', name: 'Operating', institution: 'First Meridian Bank', mask: '••4417', kind: 'Checking', availableCents: 84_215_600, trend: 0.00022 },
  { id: 'bank-2', name: 'Payroll', institution: 'First Meridian Bank', mask: '••8830', kind: 'Checking', availableCents: 21_940_800, trend: 0.00004 },
  { id: 'bank-3', name: 'Tax reserve', institution: 'Harborline Credit Union', mask: '••1265', kind: 'Savings', availableCents: 47_500_000, trend: 0.00009 },
  { id: 'bank-4', name: 'Treasury sweep', institution: 'Northgate Financial', mask: '••7702', kind: 'Money market', availableCents: 132_800_000, trend: 0.00033 },
]

const CREDIT_CARDS: CreditCardAccount[] = [
  { id: 'card-1', name: 'Corporate — Engineering', issuer: 'Meridian Business Card', mask: '••2041', balanceCents: 4_182_300, limitCents: 15_000_000, trend: 0.00042 },
  { id: 'card-2', name: 'Corporate — Travel', issuer: 'Meridian Business Card', mask: '••6688', balanceCents: 9_640_500, limitCents: 12_000_000, trend: 0.00071 },
  { id: 'card-3', name: 'Vendor payments', issuer: 'Northgate Commercial', mask: '••3319', balanceCents: 1_205_000, limitCents: 25_000_000, trend: -0.00018 },
]

const PROCESSORS: ProcessorAccount[] = [
  { id: 'proc-1', name: 'Stripe', merchantId: 'acct_1Qf82LmR', pendingPayoutCents: 18_442_900, feesMtdCents: 612_400, trend: 0.00058 },
  { id: 'proc-2', name: 'PayPal Commerce', merchantId: 'MRC-88214-XT', pendingPayoutCents: 3_218_650, feesMtdCents: 148_900, trend: -0.00024 },
  { id: 'proc-3', name: 'Adyen', merchantId: 'AD-NORTHWIND-01', pendingPayoutCents: 7_905_100, feesMtdCents: 233_050, trend: 0.00031 },
]

const INVESTMENTS: InvestmentAccount[] = [
  { id: 'inv-1', name: 'Short-duration treasuries', custodian: 'Northgate Asset Management', marketValueCents: 245_180_000, costBasisCents: 240_000_000, trend: 0.00012 },
  { id: 'inv-2', name: 'Corporate bond ladder', custodian: 'Northgate Asset Management', marketValueCents: 98_420_000, costBasisCents: 100_000_000, trend: -0.00006 },
  { id: 'inv-3', name: 'Money market fund', custodian: 'Harborline Capital', marketValueCents: 61_050_000, costBasisCents: 61_000_000, trend: 0.00003 },
]

const HISTORY: Record<string, number[]> = {
  ...buildHistory(BANK_ACCOUNTS, a => a.availableCents, 0.014),
  ...buildHistory(CREDIT_CARDS, c => c.balanceCents, 0.016),
  ...buildHistory(PROCESSORS, p => p.pendingPayoutCents, 0.04),
  ...buildHistory(INVESTMENTS, i => i.marketValueCents, 0.008),
}

const range = ref<RangeId>('YTD')

const bankOpen = ref(true)
const cardsOpen = ref(true)
const processorsOpen = ref(true)
const investmentsOpen = ref(true)
const expandedRows = ref<ReadonlySet<string>>(new Set())

function toggleRow(key: string): void {
  const next = new Set(expandedRows.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  expandedRows.value = next
}

const ALL_ROW_IDS = [...BANK_ACCOUNTS, ...CREDIT_CARDS, ...PROCESSORS, ...INVESTMENTS].map(record => record.id)

function changePercent(id: string): number {
  const points = HISTORY[id].slice(-RANGE_DAYS[range.value])
  const start = points[0]
  if (start === 0)
    return 0
  return ((points[points.length - 1] - start) / Math.abs(start)) * 100
}

function windowOf(id: string): number[] {
  return HISTORY[id].slice(-RANGE_DAYS[range.value])
}

const TODAY = Date.UTC(2025, 8, 30)
const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

function dayLabel(daysAgo: number): string {
  const date = new Date(TODAY)
  date.setUTCDate(date.getUTCDate() - daysAgo)
  return dayFormat.format(date)
}

function axisTicks(count: number): number[] {
  const stops = Math.min(5, count)
  if (stops < 2)
    return [0]
  return Array.from({ length: stops }, (_, stop) => Math.round((stop * (count - 1)) / (stops - 1)))
}

/** 展开行里的历史曲线：涨用绿、跌用红（负债反过来），虚线是窗口起点。 */
const DetailChart = defineComponent({
  props: {
    id: { type: String, required: true },
    isLiability: { type: Boolean, default: false },
  },
  setup(props) {
    return () => {
      const points = windowOf(props.id)
      const delta = points[points.length - 1] - points[0]
      const isGood = props.isLiability ? delta <= 0 : delta >= 0
      const color = isGood ? 'var(--astryx-color-data-categorical-green, #0B991F)' : 'var(--astryx-color-data-categorical-red, #F5394F)'
      const data = points.map((value, day) => ({ day, value: value / 100 }))
      const values = data.map(item => item.value)
      return h(PlaygroundAreaChart, {
        data,
        xKey: 'day',
        yKey: 'value',
        color,
        height: 132,
        yDomain: [Math.min(...values), Math.max(...values)],
        xDomain: [0, data.length - 1],
        xTicks: axisTicks(data.length),
        xTickFormat: (day: number) => dayLabel(points.length - 1 - day),
        hasYAxis: false,
        hasGrid: false,
        referenceValue: values[0],
        fillOpacity: [0.2, 0],
        padInline: 16,
      })
    }
  },
})

function changeCell(id: string, isLiability = false) {
  const pct = changePercent(id)
  const isUp = pct >= 0
  const isGood = isLiability ? !isUp : isUp
  return h(HStack, { hAlign: 'end' }, () => h(Token, {
    size: 'sm',
    color: isGood ? 'green' : 'red',
    label: `${isUp ? '+' : '−'}${percentFormat.format(Math.abs(pct))}%`,
  }))
}

const totals = computed(() => {
  const banks = BANK_ACCOUNTS.reduce((s, a) => s + a.availableCents, 0)
  const cards = CREDIT_CARDS.reduce((s, c) => s + c.balanceCents, 0)
  const pending = PROCESSORS.reduce((s, p) => s + p.pendingPayoutCents, 0)
  const investments = INVESTMENTS.reduce((s, i) => s + i.marketValueCents, 0)
  return { banks, cards, pending, investments, net: banks + pending + investments - cards }
})

function money2(cents: number) {
  return h(Text, { hasTabularNumbers: true }, () => money(cents))
}

function nameCell(title: string, subtitle: string) {
  return h(VStack, { gap: 0 }, () => [
    h(Text, {}, () => title),
    h(Text, { type: 'supporting' }, () => subtitle),
  ])
}

/** 涨跌幅排序走窗口内的百分比，随时间范围变。 */
const byChange = (a: { id: string }, b: { id: string }): number => changePercent(a.id) - changePercent(b.id)

const bankColumns: TableColumn<BankAccount>[] = [
  { key: 'name', header: 'Account', width: proportional(2), sortable: { compare: (a, b) => a.name.localeCompare(b.name) }, renderCell: a => nameCell(a.name, `${a.institution} · ${a.mask}`) },
  { key: 'kind', header: 'Type', width: pixel(150), sortable: { compare: (a, b) => a.kind.localeCompare(b.kind) }, renderCell: a => h(Text, {}, () => a.kind) },
  { key: 'available', header: 'Available', width: pixel(150), align: 'end', sortable: { compare: (a, b) => a.availableCents - b.availableCents }, renderCell: a => money2(a.availableCents) },
  { key: 'change', header: 'Change', width: pixel(110), align: 'end', sortable: { compare: byChange }, renderCell: a => changeCell(a.id) },
]

const creditColumns: TableColumn<CreditCardAccount>[] = [
  { key: 'name', header: 'Card', width: proportional(2), sortable: { compare: (a, b) => a.name.localeCompare(b.name) }, renderCell: c => nameCell(c.name, `${c.issuer} · ${c.mask}`) },
  {
    key: 'utilization',
    header: 'Utilization',
    width: pixel(150),
    sortable: { compare: (a, b) => a.balanceCents / a.limitCents - b.balanceCents / b.limitCents },
    renderCell: (card) => {
      const percent = Math.round((card.balanceCents / card.limitCents) * 100)
      return h(HStack, { gap: 2, vAlign: 'center' }, () => [
        h(StackItem, { size: 'fill' }, () => h(ProgressBar, { label: `${card.name} utilization`, isLabelHidden: true, value: percent, variant: 'neutral' })),
        h(Text, { hasTabularNumbers: true }, () => `${percent}%`),
      ])
    },
  },
  { key: 'balance', header: 'Balance', width: pixel(150), align: 'end', sortable: { compare: (a, b) => a.balanceCents - b.balanceCents }, renderCell: c => money2(c.balanceCents) },
  { key: 'limit', header: 'Limit', width: pixel(150), align: 'end', sortable: { compare: (a, b) => a.limitCents - b.limitCents }, renderCell: c => money2(c.limitCents) },
  { key: 'change', header: 'Change', width: pixel(110), align: 'end', sortable: { compare: byChange }, renderCell: c => changeCell(c.id, true) },
]

const processorColumns: TableColumn<ProcessorAccount>[] = [
  { key: 'name', header: 'Processor', width: proportional(2), sortable: { compare: (a, b) => a.name.localeCompare(b.name) }, renderCell: p => nameCell(p.name, p.merchantId) },
  { key: 'pendingPayout', header: 'Pending payout', width: pixel(150), align: 'end', sortable: { compare: (a, b) => a.pendingPayoutCents - b.pendingPayoutCents }, renderCell: p => money2(p.pendingPayoutCents) },
  { key: 'feesMtd', header: 'Fees (MTD)', width: pixel(150), align: 'end', sortable: { compare: (a, b) => a.feesMtdCents - b.feesMtdCents }, renderCell: p => money2(p.feesMtdCents) },
  { key: 'change', header: 'Change', width: pixel(110), align: 'end', sortable: { compare: byChange }, renderCell: p => changeCell(p.id) },
]

const investmentColumns: TableColumn<InvestmentAccount>[] = [
  { key: 'name', header: 'Account', width: proportional(2), sortable: { compare: (a, b) => a.name.localeCompare(b.name) }, renderCell: a => nameCell(a.name, a.custodian) },
  { key: 'marketValue', header: 'Market value', width: pixel(150), align: 'end', sortable: { compare: (a, b) => a.marketValueCents - b.marketValueCents }, renderCell: a => money2(a.marketValueCents) },
  { key: 'costBasis', header: 'Cost basis', width: pixel(150), align: 'end', sortable: { compare: (a, b) => a.costBasisCents - b.costBasisCents }, renderCell: a => money2(a.costBasisCents) },
  { key: 'change', header: 'Change', width: pixel(110), align: 'end', sortable: { compare: byChange }, renderCell: a => changeCell(a.id) },
]

/** 每组一张表：排序加展开，展开后画这一行的历史曲线。 */
function useGroupTable<T extends AccountRecord>(data: T[], columns: TableColumn<T>[], isLiability = false) {
  const { sortedData, sortConfig } = useTableSortableState<T>({ data, columns })
  const sort = useTableSortable<T>(sortConfig)
  const expansion = useTableRowExpansion<T>(() => ({
    expandedKeys: expandedRows.value,
    onToggle: toggleRow,
    getRowKey: item => item.id,
    renderExpanded: item => h(DetailChart, { id: item.id, isLiability }),
  }))
  return { sortedData, plugins: { sort, expansion } }
}

const bankTable = useGroupTable(BANK_ACCOUNTS, bankColumns)
const cardTable = useGroupTable(CREDIT_CARDS, creditColumns, true)
const procTable = useGroupTable(PROCESSORS, processorColumns)
const invTable = useGroupTable(INVESTMENTS, investmentColumns)

const isEverythingOpen = computed(() =>
  bankOpen.value && cardsOpen.value && processorsOpen.value && investmentsOpen.value
  && expandedRows.value.size === ALL_ROW_IDS.length,
)

function toggleAll(): void {
  const next = !isEverythingOpen.value
  bankOpen.value = next
  cardsOpen.value = next
  processorsOpen.value = next
  investmentsOpen.value = next
  expandedRows.value = next ? new Set(ALL_ROW_IDS) : new Set()
}
</script>

<template>
  <Layout height="auto" :content-width="1200" class="wash">
    <template #header>
      <LayoutHeader :padding="4">
        <HStack :gap="3" align="center" wrap="wrap">
          <StackItem size="fill">
            <VStack :gap="0.5">
              <Heading :level="1">
                Connected accounts
              </Heading>
              <Text type="supporting">
                Net position {{ money(totals.net) }} across 13 accounts
              </Text>
            </VStack>
          </StackItem>
          <Button :label="isEverythingOpen ? 'Collapse all' : 'Expand all'" variant="ghost" @click="toggleAll" />
          <SegmentedControl v-model="range" label="Time range">
            <SegmentedControlItem v-for="id in RANGE_IDS" :key="id" :value="id" :label="id" />
          </SegmentedControl>
        </HStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="4">
      <VStack :gap="4">
        <Card :padding="2">
          <Collapsible v-model:is-open="bankOpen">
            <template #trigger>
              <HStack :gap="2" align="center" justify="between" class="group-trigger">
                <HStack :gap="2" align="center">
                  <span class="category-tile"><Icon icon="i-heroicons-building-library" size="sm" /></span>
                  <Text weight="semibold">
                    Bank accounts
                  </Text>
                  <Badge variant="neutral" :label="String(BANK_ACCOUNTS.length)" />
                </HStack>
                <HStack :gap="2" align="center">
                  <Text color="secondary">
                    Available
                  </Text>
                  <Text weight="semibold" has-tabular-numbers>
                    {{ money(totals.banks) }}
                  </Text>
                </HStack>
              </HStack>
            </template>
            <VStack :padding-block-start="3" :gap="2">
              <div class="fixed-table"><Table :data="bankTable.sortedData.value" :columns="bankColumns" id-key="id" density="compact" dividers="rows" :plugins="bankTable.plugins" /></div>
            </VStack>
          </Collapsible>
        </Card>

        <Card :padding="2">
          <Collapsible v-model:is-open="cardsOpen">
            <template #trigger>
              <HStack :gap="2" align="center" justify="between" class="group-trigger">
                <HStack :gap="2" align="center">
                  <span class="category-tile"><Icon icon="i-heroicons-credit-card" size="sm" /></span>
                  <Text weight="semibold">
                    Credit cards
                  </Text>
                  <Badge variant="neutral" :label="String(CREDIT_CARDS.length)" />
                </HStack>
                <HStack :gap="2" align="center">
                  <Text color="secondary">
                    Outstanding
                  </Text>
                  <Text weight="semibold" has-tabular-numbers>
                    {{ money(totals.cards) }}
                  </Text>
                </HStack>
              </HStack>
            </template>
            <VStack :padding-block-start="3">
              <div class="fixed-table"><Table :data="cardTable.sortedData.value" :columns="creditColumns" id-key="id" density="compact" dividers="rows" :plugins="cardTable.plugins" /></div>
            </VStack>
          </Collapsible>
        </Card>

        <Card :padding="2">
          <Collapsible v-model:is-open="processorsOpen">
            <template #trigger>
              <HStack :gap="2" align="center" justify="between" class="group-trigger">
                <HStack :gap="2" align="center">
                  <span class="category-tile"><Icon icon="i-heroicons-arrows-right-left" size="sm" /></span>
                  <Text weight="semibold">
                    Payment processors
                  </Text>
                  <Badge variant="neutral" :label="String(PROCESSORS.length)" />
                </HStack>
                <HStack :gap="2" align="center">
                  <Text color="secondary">
                    Pending payout
                  </Text>
                  <Text weight="semibold" has-tabular-numbers>
                    {{ money(totals.pending) }}
                  </Text>
                </HStack>
              </HStack>
            </template>
            <VStack :padding-block-start="3">
              <div class="fixed-table"><Table :data="procTable.sortedData.value" :columns="processorColumns" id-key="id" density="compact" dividers="rows" :plugins="procTable.plugins" /></div>
            </VStack>
          </Collapsible>
        </Card>

        <Card :padding="2">
          <Collapsible v-model:is-open="investmentsOpen">
            <template #trigger>
              <HStack :gap="2" align="center" justify="between" class="group-trigger">
                <HStack :gap="2" align="center">
                  <span class="category-tile"><Icon icon="i-heroicons-presentation-chart-line" size="sm" /></span>
                  <Text weight="semibold">
                    Investment accounts
                  </Text>
                  <Badge variant="neutral" :label="String(INVESTMENTS.length)" />
                </HStack>
                <HStack :gap="2" align="center">
                  <Text color="secondary">
                    Market value
                  </Text>
                  <Text weight="semibold" has-tabular-numbers>
                    {{ money(totals.investments) }}
                  </Text>
                </HStack>
              </HStack>
            </template>
            <VStack :padding-block-start="3">
              <div class="fixed-table"><Table :data="invTable.sortedData.value" :columns="investmentColumns" id-key="id" density="compact" dividers="rows" :plugins="invTable.plugins" /></div>
            </VStack>
          </Collapsible>
        </Card>

      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
/* 原版 Table 的数据模式默认 `table-layout: fixed`，列宽严格按声明的比例分；core 目前是 auto，列宽按内容算、行高有 0.5px 的小数。 */
.fixed-table :deep(.astryx-table) {
  table-layout: fixed;
}

.wash {
  background: var(--astryx-color-background-body);
}
.category-tile {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: var(--astryx-radius-inner);
  background: var(--astryx-color-background-muted);
}
.group-trigger {
  width: 100%;
  padding: var(--astryx-spacing-2) var(--astryx-spacing-2);
}
</style>
