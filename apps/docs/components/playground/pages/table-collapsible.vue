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
  useTableSortable,
  useTableSortableState,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { PlaygroundSparkline } from '@astryx-vue/playground-charts'
import { computed, h, ref } from 'vue'

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
const chartAccountId = ref<string | null>('bank-1')

const bankOpen = ref(true)
const cardsOpen = ref(true)
const processorsOpen = ref(true)
const investmentsOpen = ref(true)

function changePercent(id: string): number {
  const points = HISTORY[id].slice(-RANGE_DAYS[range.value])
  const start = points[0]
  if (start === 0)
    return 0
  return ((points[points.length - 1] - start) / Math.abs(start)) * 100
}

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

const bankColumns: TableColumn<BankAccount>[] = [
  {
    key: 'name',
    header: 'Account',
    width: proportional(2),
    sortable: { compare: (a, b) => a.name.localeCompare(b.name) },
    renderCell: account => h(VStack, { gap: 0 }, () => [
      h(Text, {}, () => account.name),
      h(Text, { type: 'supporting' }, () => `${account.institution} · ${account.mask}`),
    ]),
  },
  { key: 'kind', header: 'Type', width: pixel(150), sortable: { compare: (a, b) => a.kind.localeCompare(b.kind) }, renderCell: a => h(Text, {}, () => a.kind) },
  { key: 'available', header: 'Available', width: pixel(150), align: 'end', sortable: { compare: (a, b) => a.availableCents - b.availableCents }, renderCell: a => h(Text, { hasTabularNumbers: true }, () => money(a.availableCents)) },
  { key: 'change', header: 'Change', width: pixel(110), align: 'end', renderCell: a => changeCell(a.id) },
]

const creditColumns: TableColumn<CreditCardAccount>[] = [
  {
    key: 'name',
    header: 'Card',
    width: proportional(2),
    sortable: { compare: (a, b) => a.name.localeCompare(b.name) },
    renderCell: card => h(VStack, { gap: 0 }, () => [
      h(Text, {}, () => card.name),
      h(Text, { type: 'supporting' }, () => `${card.issuer} · ${card.mask}`),
    ]),
  },
  {
    key: 'utilization',
    header: 'Utilization',
    width: pixel(150),
    renderCell: (card) => {
      const percent = Math.round((card.balanceCents / card.limitCents) * 100)
      return h(HStack, { gap: 2, vAlign: 'center' }, () => [
        h(StackItem, { size: 'fill' }, () => h(ProgressBar, { label: 'Utilization', isLabelHidden: true, value: percent, variant: 'neutral' })),
        h(Text, { hasTabularNumbers: true }, () => `${percent}%`),
      ])
    },
  },
  { key: 'balance', header: 'Balance', width: pixel(150), align: 'end', sortable: { compare: (a, b) => a.balanceCents - b.balanceCents }, renderCell: c => h(Text, { hasTabularNumbers: true }, () => money(c.balanceCents)) },
  { key: 'change', header: 'Change', width: pixel(110), align: 'end', renderCell: c => changeCell(c.id, true) },
]

const processorColumns: TableColumn<ProcessorAccount>[] = [
  {
    key: 'name',
    header: 'Processor',
    width: proportional(2),
    renderCell: p => h(VStack, { gap: 0 }, () => [h(Text, {}, () => p.name), h(Text, { type: 'supporting' }, () => p.merchantId)]),
  },
  { key: 'pending', header: 'Pending payout', width: pixel(150), align: 'end', renderCell: p => h(Text, { hasTabularNumbers: true }, () => money(p.pendingPayoutCents)) },
  { key: 'fees', header: 'Fees (MTD)', width: pixel(150), align: 'end', renderCell: p => h(Text, { hasTabularNumbers: true }, () => money(p.feesMtdCents)) },
  { key: 'change', header: 'Change', width: pixel(110), align: 'end', renderCell: p => changeCell(p.id) },
]

const investmentColumns: TableColumn<InvestmentAccount>[] = [
  {
    key: 'name',
    header: 'Account',
    width: proportional(2),
    renderCell: a => h(VStack, { gap: 0 }, () => [h(Text, {}, () => a.name), h(Text, { type: 'supporting' }, () => a.custodian)]),
  },
  { key: 'market', header: 'Market value', width: pixel(150), align: 'end', renderCell: a => h(Text, { hasTabularNumbers: true }, () => money(a.marketValueCents)) },
  { key: 'cost', header: 'Cost basis', width: pixel(150), align: 'end', renderCell: a => h(Text, { hasTabularNumbers: true }, () => money(a.costBasisCents)) },
  { key: 'change', header: 'Change', width: pixel(110), align: 'end', renderCell: a => changeCell(a.id) },
]

const { sortedData: bankData, sortConfig: bankSortConfig } = useTableSortableState({ data: BANK_ACCOUNTS, columns: bankColumns })
const bankPlugin = useTableSortable(bankSortConfig)
const { sortedData: cardData, sortConfig: cardSortConfig } = useTableSortableState({ data: CREDIT_CARDS, columns: creditColumns })
const cardPlugin = useTableSortable(cardSortConfig)
const { sortedData: procData, sortConfig: procSortConfig } = useTableSortableState({ data: PROCESSORS, columns: processorColumns })
const procPlugin = useTableSortable(procSortConfig)
const { sortedData: invData, sortConfig: invSortConfig } = useTableSortableState({ data: INVESTMENTS, columns: investmentColumns })
const invPlugin = useTableSortable(invSortConfig)

const chartSeries = computed(() => {
  if (!chartAccountId.value)
    return []
  return HISTORY[chartAccountId.value]?.slice(-RANGE_DAYS[range.value]) ?? []
})

const chartColor = computed(() => {
  if (!chartAccountId.value)
    return 'var(--color-data-categorical-green, #0B991F)'
  const points = chartSeries.value
  if (points.length < 2)
    return 'var(--color-data-categorical-green, #0B991F)'
  const delta = points[points.length - 1] - points[0]
  const liability = chartAccountId.value.startsWith('card-')
  const good = liability ? delta <= 0 : delta >= 0
  return good ? 'var(--color-data-categorical-green, #0B991F)' : 'var(--color-data-categorical-red, #F5394F)'
})

function toggleAll(): void {
  const allOpen = bankOpen.value && cardsOpen.value && processorsOpen.value && investmentsOpen.value
  const next = !allOpen
  bankOpen.value = next
  cardsOpen.value = next
  processorsOpen.value = next
  investmentsOpen.value = next
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
          <Button label="Expand / collapse all" variant="ghost" @click="toggleAll" />
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
                  <Icon icon="i-heroicons-building-library" size="sm" />
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
              <Table :data="bankData" :columns="bankColumns" id-key="id" density="compact" dividers="rows" :plugins="{ sort: bankPlugin }" has-hover />
            </VStack>
          </Collapsible>
        </Card>

        <Card :padding="2">
          <Collapsible v-model:is-open="cardsOpen">
            <template #trigger>
              <HStack :gap="2" align="center" justify="between" class="group-trigger">
                <HStack :gap="2" align="center">
                  <Icon icon="i-heroicons-credit-card" size="sm" />
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
              <Table :data="cardData" :columns="creditColumns" id-key="id" density="compact" dividers="rows" :plugins="{ sort: cardPlugin }" has-hover />
            </VStack>
          </Collapsible>
        </Card>

        <Card :padding="2">
          <Collapsible v-model:is-open="processorsOpen">
            <template #trigger>
              <HStack :gap="2" align="center" justify="between" class="group-trigger">
                <HStack :gap="2" align="center">
                  <Icon icon="i-heroicons-arrows-right-left" size="sm" />
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
              <Table :data="procData" :columns="processorColumns" id-key="id" density="compact" dividers="rows" :plugins="{ sort: procPlugin }" />
            </VStack>
          </Collapsible>
        </Card>

        <Card :padding="2">
          <Collapsible v-model:is-open="investmentsOpen">
            <template #trigger>
              <HStack :gap="2" align="center" justify="between" class="group-trigger">
                <HStack :gap="2" align="center">
                  <Icon icon="i-heroicons-presentation-chart-line" size="sm" />
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
              <Table :data="invData" :columns="investmentColumns" id-key="id" density="compact" dividers="rows" :plugins="{ sort: invPlugin }" />
            </VStack>
          </Collapsible>
        </Card>

        <Card v-if="chartAccountId && chartSeries.length" :padding="4">
          <VStack :gap="2">
            <Text type="label">
              Balance trend ({{ range }})
            </Text>
            <PlaygroundSparkline :data="chartSeries" :color="chartColor" :height="100" />
          </VStack>
        </Card>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.wash {
  background: var(--color-background-body);
}
.group-trigger {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-2);
}
</style>
