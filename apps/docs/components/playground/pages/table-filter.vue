<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  ComplexSelector,
  Divider,
  DropdownMenu,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutHeader,
  Link,
  MultiSelector,
  OverflowList,
  pixel,
  Popover,
  proportional,
  Section,
  Selector,
  Slider,
  StackItem,
  StatusDot,
  Table,
  Text,
  TextInput,
  ToggleButton,
  Token,
  useTableGroupedRows,
  useTableSelection,
  useTableSelectionState,
  useTableSortable,
  useTableSortableState,
  useTableStickyColumns,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

type JobStatus = 'scheduled' | 'in_progress' | 'on_hold' | 'overdue' | 'completed'
type Priority = 'urgent' | 'high' | 'normal'

/** 优先级和状态按紧急程度排，不按字母排：升序时 Urgent、Overdue 在最前。 */
const PRIORITY_RANK: Record<Priority, number> = { urgent: 0, high: 1, normal: 2 }
const STATUS_RANK: Record<JobStatus, number> = { overdue: 0, on_hold: 1, in_progress: 2, scheduled: 3, completed: 4 }

interface SeedJob {
  id: string
  summary: string
  customer: string
  address: string
  technician: string
  status: JobStatus
  priority: Priority
  /** ISO 时间戳，日期列按它排序。 */
  scheduledAt: string
  /** 报价，整数美元，便于筛选和排序。 */
  quoted: number
  equipment: string
}

interface ServiceJob extends SeedJob, Record<string, unknown> {
  /** 和 `scheduledAt` 同一时刻，日期筛选读这个字段。 */
  scheduledOn: Date
}

const STATUS_META: Record<JobStatus, { label: string, badge: 'neutral' | 'blue' | 'teal' | 'green' | 'red' }> = {
  scheduled: { label: 'Scheduled', badge: 'blue' },
  in_progress: { label: 'In progress', badge: 'teal' },
  on_hold: { label: 'On hold', badge: 'neutral' },
  overdue: { label: 'Overdue', badge: 'red' },
  completed: { label: 'Completed', badge: 'green' },
}

/** 优先级是往下读的三档，用圆点把红色挑出来就够，不必读字。 */
const PRIORITY_META: Record<Priority, { label: string, dot: 'neutral' | 'warning' | 'error' }> = {
  urgent: { label: 'Urgent', dot: 'error' },
  high: { label: 'High', dot: 'warning' },
  normal: { label: 'Normal', dot: 'neutral' },
}

const seedJobs: SeedJob[] = [
  {
    id: 'SJ-2148',
    summary: 'No cooling — rooftop unit 3',
    customer: 'Harborview Grand Hotel',
    address: '1200 Harbor Blvd, Bayside',
    technician: 'Luis Camarena',
    status: 'in_progress',
    priority: 'urgent',
    scheduledAt: '2026-07-02T08:00:00Z',
    quoted: 1480,
    equipment: 'Trane RTU-3, 25-ton (2019)',
  },
  {
    id: 'SJ-2147',
    summary: 'Quarterly preventive maintenance',
    customer: 'Northgate Dental Group',
    address: '88 Northgate Mall, Suite 210',
    technician: 'Dana Whitfield',
    status: 'scheduled',
    priority: 'normal',
    scheduledAt: '2026-07-02T10:30:00Z',
    quoted: 420,
    equipment: 'Carrier split system, 5-ton',
  },
  {
    id: 'SJ-2146',
    summary: 'Walk-in freezer overshooting setpoint',
    customer: 'Beacon Street Bistro',
    address: '412 Beacon St',
    technician: 'Marcus Osei',
    status: 'on_hold',
    priority: 'high',
    scheduledAt: '2026-07-01T13:00:00Z',
    quoted: 2150,
    equipment: 'Kolpak walk-in, Copeland compressor',
  },
  {
    id: 'SJ-2145',
    summary: 'Thermostat replacement, suite 400',
    customer: 'Pinnacle Property Mgmt',
    address: '500 Commerce Tower, Floor 4',
    technician: 'Dana Whitfield',
    status: 'scheduled',
    priority: 'normal',
    scheduledAt: '2026-07-02T14:00:00Z',
    quoted: 310,
    equipment: 'Honeywell T6 Pro (2 units)',
  },
  {
    id: 'SJ-2144',
    summary: 'Boiler pilot fails to stay lit',
    customer: 'Elm & 5th Lofts',
    address: '501 Elm St',
    technician: 'Luis Camarena',
    status: 'overdue',
    priority: 'high',
    scheduledAt: '2026-07-01T09:00:00Z',
    quoted: 760,
    equipment: 'Weil-McLain CGa boiler (2011)',
  },
  {
    id: 'SJ-2143',
    summary: 'Condenser coil cleaning',
    customer: 'Riverside Athletic Club',
    address: '9 Riverside Way',
    technician: 'Priya Raman',
    status: 'scheduled',
    priority: 'normal',
    scheduledAt: '2026-07-03T07:30:00Z',
    quoted: 540,
    equipment: 'Lennox RTU, 20-ton (2018)',
  },
  {
    id: 'SJ-2142',
    summary: 'Intermittent short cycling',
    customer: 'Harborview Grand Hotel',
    address: '1200 Harbor Blvd, Bayside',
    technician: 'Marcus Osei',
    status: 'on_hold',
    priority: 'high',
    scheduledAt: '2026-07-01T15:30:00Z',
    quoted: 890,
    equipment: 'Trane RTU-1, 25-ton (2019)',
  },
  {
    id: 'SJ-2141',
    summary: 'Emergency steam leak, basement',
    customer: 'Elm & 5th Lofts',
    address: '501 Elm St',
    technician: 'Priya Raman',
    status: 'in_progress',
    priority: 'urgent',
    scheduledAt: '2026-07-01T06:00:00Z',
    quoted: 3200,
    equipment: 'Weil-McLain CGa boiler (2011)',
  },
  {
    id: 'SJ-2140',
    summary: 'Annual fire damper inspection',
    customer: 'Pinnacle Property Mgmt',
    address: '500 Commerce Tower, Floor 4',
    technician: 'Dana Whitfield',
    status: 'scheduled',
    priority: 'normal',
    scheduledAt: '2026-07-06T09:00:00Z',
    quoted: 1250,
    equipment: 'Building-wide duct network',
  },
  {
    id: 'SJ-2139',
    summary: 'Ice machine not producing',
    customer: 'Beacon Street Bistro',
    address: '412 Beacon St',
    technician: 'Luis Camarena',
    status: 'overdue',
    priority: 'urgent',
    scheduledAt: '2026-06-30T11:00:00Z',
    quoted: 680,
    equipment: 'Hoshizaki KM-660, air cooled',
  },
  {
    id: 'SJ-2138',
    summary: 'Makeup air unit rebalancing',
    customer: 'Northgate Dental Group',
    address: '88 Northgate Mall, Suite 210',
    technician: 'Priya Raman',
    status: 'scheduled',
    priority: 'normal',
    scheduledAt: '2026-07-07T13:00:00Z',
    quoted: 495,
    equipment: 'Greenheck MAU, 4000 CFM',
  },
  {
    id: 'SJ-2137',
    summary: 'Chiller low refrigerant alarm',
    customer: 'Summit Medical Plaza',
    address: '77 Summit Ridge Rd',
    technician: 'Marcus Osei',
    status: 'in_progress',
    priority: 'urgent',
    scheduledAt: '2026-07-01T08:30:00Z',
    quoted: 4100,
    equipment: 'Daikin air-cooled chiller, 80-ton',
  },
  {
    id: 'SJ-2136',
    summary: 'VAV box actuator replacement',
    customer: 'Summit Medical Plaza',
    address: '77 Summit Ridge Rd',
    technician: 'Dana Whitfield',
    status: 'scheduled',
    priority: 'high',
    scheduledAt: '2026-07-03T10:00:00Z',
    quoted: 720,
    equipment: 'Titus VAV, zones 12–15',
  },
  {
    id: 'SJ-2135',
    summary: 'Exhaust fan bearing noise',
    customer: 'Riverside Athletic Club',
    address: '9 Riverside Way',
    technician: 'Luis Camarena',
    status: 'on_hold',
    priority: 'normal',
    scheduledAt: '2026-06-30T14:30:00Z',
    quoted: 380,
    equipment: 'Greenheck exhaust fan, pool deck',
  },
  {
    id: 'SJ-2134',
    summary: 'Humidifier control board fault',
    customer: 'Summit Medical Plaza',
    address: '77 Summit Ridge Rd',
    technician: 'Priya Raman',
    status: 'overdue',
    priority: 'high',
    scheduledAt: '2026-06-29T09:30:00Z',
    quoted: 1340,
    equipment: 'DriSteem steam humidifier',
  },
  {
    id: 'SJ-2133',
    summary: 'Rooftop economizer stuck closed',
    customer: 'Northgate Dental Group',
    address: '88 Northgate Mall, Suite 210',
    technician: 'Marcus Osei',
    status: 'scheduled',
    priority: 'normal',
    scheduledAt: '2026-07-08T08:00:00Z',
    quoted: 610,
    equipment: 'Carrier split system, 5-ton',
  },
  {
    id: 'SJ-2132',
    summary: 'Hot water recirculation pump seized',
    customer: 'Elm & 5th Lofts',
    address: '501 Elm St',
    technician: 'Dana Whitfield',
    status: 'in_progress',
    priority: 'high',
    scheduledAt: '2026-07-01T12:00:00Z',
    quoted: 950,
    equipment: 'Taco 007 circulator',
  },
  {
    id: 'SJ-2131',
    summary: 'Split system quote, new tenant build',
    customer: 'Pinnacle Property Mgmt',
    address: '500 Commerce Tower, Floor 4',
    technician: 'Priya Raman',
    status: 'scheduled',
    priority: 'normal',
    scheduledAt: '2026-07-09T11:00:00Z',
    quoted: 8600,
    equipment: 'Proposed: Mitsubishi VRF, 6 zones',
  },
  {
    id: 'SJ-2101',
    summary: 'Compressor contactor replacement',
    customer: 'Harborview Grand Hotel',
    address: '1200 Harbor Blvd, Bayside',
    technician: 'Marcus Osei',
    status: 'completed',
    priority: 'high',
    scheduledAt: '2026-06-24T09:00:00Z',
    quoted: 640,
    equipment: 'Trane RTU-3, 25-ton (2019)',
  },
  {
    id: 'SJ-2095',
    summary: 'Pool dehumidifier service',
    customer: 'Riverside Athletic Club',
    address: '9 Riverside Way',
    technician: 'Dana Whitfield',
    status: 'completed',
    priority: 'normal',
    scheduledAt: '2026-06-22T08:00:00Z',
    quoted: 720,
    equipment: 'Seresco NP series dehumidifier',
  },
  {
    id: 'SJ-2088',
    summary: 'Refrigerant leak diagnostic',
    customer: 'Beacon Street Bistro',
    address: '412 Beacon St',
    technician: 'Luis Camarena',
    status: 'completed',
    priority: 'normal',
    scheduledAt: '2026-06-18T11:00:00Z',
    quoted: 390,
    equipment: 'Kolpak walk-in, Copeland compressor',
  },
  {
    id: 'SJ-2081',
    summary: 'Chiller annual certification',
    customer: 'Summit Medical Plaza',
    address: '77 Summit Ridge Rd',
    technician: 'Priya Raman',
    status: 'completed',
    priority: 'high',
    scheduledAt: '2026-06-15T07:00:00Z',
    quoted: 2450,
    equipment: 'Daikin air-cooled chiller, 80-ton',
  },
  {
    id: 'SJ-2067',
    summary: 'RTU belt and filter service',
    customer: 'Pinnacle Property Mgmt',
    address: '500 Commerce Tower, Floor 4',
    technician: 'Dana Whitfield',
    status: 'completed',
    priority: 'normal',
    scheduledAt: '2026-06-12T08:30:00Z',
    quoted: 280,
    equipment: 'York RTU, 15-ton (2016)',
  },
  {
    id: 'SJ-2044',
    summary: 'Cooling tower fan bearing replacement',
    customer: 'Harborview Grand Hotel',
    address: '1200 Harbor Blvd, Bayside',
    technician: 'Marcus Osei',
    status: 'completed',
    priority: 'high',
    scheduledAt: '2026-05-28T07:30:00Z',
    quoted: 1120,
    equipment: 'BAC cooling tower, cell 2',
  },
  {
    id: 'SJ-2019',
    summary: 'Spring maintenance visit',
    customer: 'Northgate Dental Group',
    address: '88 Northgate Mall, Suite 210',
    technician: 'Dana Whitfield',
    status: 'completed',
    priority: 'normal',
    scheduledAt: '2026-04-15T10:00:00Z',
    quoted: 420,
    equipment: 'Carrier split system, 5-ton',
  },
];

const DAY_MS = 86_400_000

/** 只读一次，预置筛选取到的值才稳定。 */
const NOW_MS = Date.now()

/** 把整批日期平移，让积压跨过今天，最新的活儿大约在三周后。 */
const DATE_SHIFT_MS = NOW_MS + 21 * DAY_MS - Math.max(...seedJobs.map(j => Date.parse(j.scheduledAt)))

/** 过去的活儿不可能还在等， authored 状态只在日期撑得住时保留。 */
function statusForDate(authored: JobStatus, when: number): JobStatus {
  if (when > NOW_MS)
    return 'scheduled'
  const isRecent = when > NOW_MS - 45 * DAY_MS
  if (authored === 'scheduled')
    return isRecent ? 'overdue' : 'completed'
  if (authored === 'in_progress' && !isRecent)
    return 'completed'
  return authored
}

/** 原始几条按日历往回循环五轮，凑出一条更长的积压。 */
const allJobs: ServiceJob[] = Array.from({ length: 5 }, (_, cycle) =>
  seedJobs.map((job, index) => {
    const cycleDays = cycle === 0 ? 0 : cycle * 37 + ((index * 13) % 29)
    const when = Date.parse(job.scheduledAt) + DATE_SHIFT_MS - cycleDays * DAY_MS
    const scheduledOn = new Date(when)
    return {
      ...job,
      id: cycle === 0 ? job.id : `SJ-${1999 - (cycle - 1) * seedJobs.length - index}`,
      status: statusForDate(job.status, when),
      scheduledAt: scheduledOn.toISOString(),
      scheduledOn,
      quoted: cycle === 0 ? job.quoted : job.quoted + ((index * 17) % 9) * 10,
    }
  }),
).flat()

const TECHNICIANS = Array.from(new Set(allJobs.map(j => j.technician))).sort()
const CUSTOMERS = Array.from(new Set(allJobs.map(j => j.customer))).sort()

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatTime(iso: string): string {
  const d = new Date(iso)
  const hours = d.getUTCHours()
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')
  const suffix = hours < 12 ? 'am' : 'pm'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${minutes}${suffix}`
}

function formatDate(iso: string, withYear = false): string {
  const d = new Date(iso)
  const base = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
  return withYear ? `${base}, ${d.getUTCFullYear()}` : base
}

const formatScheduled = (iso: string): string => `${formatDate(iso)}, ${formatTime(iso)}`
const formatMoney = (amount: number): string => `$${amount.toLocaleString('en-US')}`

// ============= 筛选状态 =============

const query = ref('')
const isUpcoming = ref(false)
const statusFilter = ref<string[]>(['scheduled', 'in_progress', 'on_hold', 'overdue'])
const customerFilter = ref<string[]>([])
const technicianFilter = ref<string[]>([])
const priorityFilter = ref<string | null>(null)
const collapsedGroups = ref<ReadonlySet<string>>(new Set())

const QUOTE_MIN = 0
const QUOTE_MAX = Math.ceil(Math.max(...allJobs.map(j => j.quoted)) / 500) * 500
const QUOTE_STEP = 100
/** 拖动中的区间；松手后才写进 `quoteRange`，和原版一致。 */
const quoteDraft = ref<[number, number]>([QUOTE_MIN, QUOTE_MAX])
const quoteRange = ref<[number, number]>([QUOTE_MIN, QUOTE_MAX])
const hasQuoteFilter = computed(() => quoteRange.value[0] > QUOTE_MIN || quoteRange.value[1] < QUOTE_MAX)

function commitQuote(next: [number, number]): void {
  quoteDraft.value = next
  quoteRange.value = next
}

const visibleJobs = computed(() => {
  const term = query.value.trim().toLowerCase()
  const [low, high] = quoteRange.value
  return allJobs.filter((job) => {
    if (isUpcoming.value && job.scheduledOn.getTime() < NOW_MS)
      return false
    if (statusFilter.value.length > 0 && !statusFilter.value.includes(job.status))
      return false
    if (customerFilter.value.length > 0 && !customerFilter.value.includes(job.customer))
      return false
    if (technicianFilter.value.length > 0 && !technicianFilter.value.includes(job.technician))
      return false
    if (priorityFilter.value != null && job.priority !== priorityFilter.value)
      return false
    if (job.quoted < low || job.quoted > high)
      return false
    if (term !== '' && !job.summary.toLowerCase().includes(term) && !job.id.toLowerCase().includes(term))
      return false
    return true
  })
})

/** 有任何筛选就显示「Clear all」。 */
const hasFilters = computed(() =>
  query.value !== ''
  || isUpcoming.value
  || statusFilter.value.length > 0
  || customerFilter.value.length > 0
  || technicianFilter.value.length > 0
  || priorityFilter.value != null
  || hasQuoteFilter.value,
)

/** 多选的收起文字：第一项加「+N」，和原版一样。 */
function multiLabel(items: { label: string }[]): string {
  return items.length > 1 ? `${items[0].label}, +${items.length - 1}` : items[0].label
}

/** 区间收起后的整句，没动过就是占位的「Quote」。 */
const quoteLabel = computed(() => {
  if (!hasQuoteFilter.value)
    return undefined
  const [low, high] = quoteRange.value
  if (low > QUOTE_MIN && high < QUOTE_MAX)
    return `Quote ${formatMoney(low)} – ${formatMoney(high)}`
  return low > QUOTE_MIN ? `Quote over ${formatMoney(low)}` : `Quote under ${formatMoney(high)}`
})

function clearAll(): void {
  query.value = ''
  isUpcoming.value = false
  statusFilter.value = []
  customerFilter.value = []
  technicianFilter.value = []
  priorityFilter.value = null
  commitQuote([QUOTE_MIN, QUOTE_MAX])
}

function toggleGroup(key: string): void {
  const next = new Set(collapsedGroups.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  collapsedGroups.value = next
}

// ============= 表格 =============

const selectedKeys = ref<ReadonlySet<string>>(new Set())

const columns: TableColumn<ServiceJob>[] = [
  {
    key: 'summary',
    header: 'Job',
    width: proportional(2, { minWidth: 240 }),
    sortable: { compare: (a, b) => a.summary.localeCompare(b.summary) },
    renderCell: job => h(VStack, { gap: 0 }, () => [
      h(Text, { type: 'body' }, () => job.summary),
      h(Text, { type: 'supporting', color: 'secondary' }, () => job.id),
    ]),
  },
  {
    key: 'customer',
    header: 'Customer',
    width: proportional(1, { minWidth: 180 }),
    sortable: { compare: (a, b) => a.customer.localeCompare(b.customer) },
    renderCell: job => h(Text, { type: 'body' }, () => job.customer),
  },
  {
    key: 'technician',
    header: 'Technician',
    width: pixel(200),
    sortable: { compare: (a, b) => a.technician.localeCompare(b.technician) },
    renderCell: job => h(HStack, { gap: 2, vAlign: 'center' }, () => [
      h(Avatar, { name: job.technician, size: 'sm' }),
      h(Text, { type: 'body' }, () => job.technician),
    ]),
  },
  {
    key: 'status',
    header: 'Status',
    width: pixel(150),
    sortable: { compare: (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] },
    renderCell: job => h(Badge, {
      label: STATUS_META[job.status].label,
      variant: STATUS_META[job.status].badge,
    }),
  },
  {
    key: 'priority',
    header: 'Priority',
    width: pixel(120),
    sortable: { compare: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] },
    renderCell: job => h(HStack, { gap: 2, vAlign: 'center' }, () => [
      h(StatusDot, {
        variant: PRIORITY_META[job.priority].dot,
        label: PRIORITY_META[job.priority].label,
        isPulsing: job.priority === 'urgent',
      }),
      h(Text, { type: 'body' }, () => PRIORITY_META[job.priority].label),
    ]),
  },
  {
    key: 'scheduledAt',
    header: 'Scheduled',
    width: pixel(160),
    sortable: { compare: (a, b) => a.scheduledAt.localeCompare(b.scheduledAt) },
    renderCell: job => h(Text, { type: 'body' }, () => formatScheduled(job.scheduledAt)),
  },
  {
    key: 'quoted',
    header: 'Quote',
    width: pixel(110),
    align: 'end',
    sortable: { compare: (a, b) => a.quoted - b.quoted },
    renderCell: job => h(Text, { type: 'body' }, () => formatMoney(job.quoted)),
  },
]

const { sortedData, sortConfig } = useTableSortableState<ServiceJob>({
  data: () => visibleJobs.value,
  columns: () => columns,
  defaultSort: [{ sortKey: 'priority', direction: 'ascending' }],
})

const { selectionConfig } = useTableSelectionState<ServiceJob>({
  data: sortedData,
  idKey: 'id',
  selectedKeys,
  setSelectedKeys(keys) {
    selectedKeys.value = keys
  },
})
const selectionPlugin = useTableSelection<ServiceJob>({
  ...selectionConfig,
  getRowLabel: job => `${job.id} ${job.summary}`,
  hasRowHighlight: false,
})

const { data: groupedData, plugin: groupedPlugin } = useTableGroupedRows<ServiceJob>(() => ({
  data: sortedData.value,
  groupBy: job => job.customer,
  groupOrder: CUSTOMERS,
  collapsedGroups: collapsedGroups.value,
  onToggleGroup: toggleGroup,
  getRowKey: job => job.id,
}))

const sortPlugin = useTableSortable<ServiceJob>(() => ({
  sort: sortConfig.sort,
  onSortChange: sortConfig.onSortChange,
  allowUnsortedState: true,
  isMultiSortEnabled: true,
}))

/** 首列钉在左边，横向滚动时 Job 一直在。 */
const stickyPlugin = useTableStickyColumns<ServiceJob>({ startKeys: ['summary'] })

const CUSTOMER_OPTIONS = CUSTOMERS.map(name => ({ value: name, label: name }))
const TECHNICIAN_OPTIONS = TECHNICIANS.map(name => ({ value: name, label: name }))
const PRIORITY_OPTIONS = (['urgent', 'high', 'normal'] as Priority[]).map(value => ({
  value,
  label: PRIORITY_META[value].label,
}))
const STATUS_OPTIONS = (['scheduled', 'in_progress', 'on_hold', 'overdue', 'completed'] as JobStatus[]).map(value => ({
  value,
  label: STATUS_META[value].label,
}))

const viewOptionItems = [
  { label: 'Columns', onClick: () => {} },
  { label: 'Density', onClick: () => {} },
  { label: 'Sticky Columns', onClick: () => {} },
  { label: 'Grouping', onClick: () => {} },
]

/** 筛选行里的每个子句：OverflowList 按下标收起放不下的，面板和行读同一份数组。 */
const filterClauses = ['upcoming', 'status', 'customer', 'technician', 'priority', 'quote'].map(key => ({ id: key, label: key }))

/** 搜索框起始位置的放大镜，供 `TextInput` 的 `startIcon` 使用。 */
function SearchIcon() {
  return h(Icon, { icon: 'search', size: 'sm' })
}
</script>

<template>
  <Layout height="fill" class="tf-shell">
    <template #header>
      <LayoutHeader has-divider label="Job filters and table actions">
        <Section variant="transparent" :padding="4" class="tf-toolbar">
          <VStack :gap="4">
            <HStack :gap="3" align="center">
              <StackItem size="fill">
                <Heading :level="1">
                  Service jobs
                </Heading>
              </StackItem>
              <Button label="New job" variant="primary" />
            </HStack>

            <HStack :gap="3" align="center" wrap="wrap">
              <StackItem size="fill" class="tf-primary">
                <HStack :gap="2" align="center" wrap="nowrap" :min-height="32" class="tf-filter-row">
                  <StackItem class="tf-search">
                    <TextInput
                      v-model="query"
                      label="Search jobs"
                      is-label-hidden
                      placeholder="Job name"
                      size="sm"
                      width="100%"
                      :start-icon="SearchIcon"
                    />
                  </StackItem>
                  <StackItem class="tf-overflow-slot">
                    <OverflowList :items="filterClauses" behavior="observeParent" :gap="2" :min-visible-items="1">
                      <template #item="{ item }">
                        <ToggleButton
                          v-if="item.id === 'upcoming'"
                          v-model:is-pressed="isUpcoming"
                          label="Upcoming"
                          size="sm"
                          class="tf-chrome"
                          :class="isUpcoming ? 'tf-value' : 'tf-empty tf-surface'"
                        />
                        <MultiSelector
                          v-else-if="item.id === 'status'"
                          v-model="statusFilter"
                          label="Status filter"
                          is-label-hidden
                          placeholder="Status"
                          size="sm"
                          has-clear
                          trigger-display="labels"
                          :format-value="multiLabel"
                          :options="STATUS_OPTIONS"
                          :control-class="statusFilter.length > 0 ? 'tf-fill' : undefined"
                        />
                        <MultiSelector
                          v-else-if="item.id === 'customer'"
                          v-model="customerFilter"
                          label="Customer filter"
                          is-label-hidden
                          placeholder="Customer"
                          size="sm"
                          has-clear
                          trigger-display="labels"
                          :format-value="multiLabel"
                          :options="CUSTOMER_OPTIONS"
                          :control-class="customerFilter.length > 0 ? 'tf-fill' : undefined"
                        />
                        <MultiSelector
                          v-else-if="item.id === 'technician'"
                          v-model="technicianFilter"
                          label="Technician filter"
                          is-label-hidden
                          placeholder="Technician"
                          size="sm"
                          has-clear
                          trigger-display="labels"
                          :format-value="multiLabel"
                          :options="TECHNICIAN_OPTIONS"
                          :control-class="technicianFilter.length > 0 ? 'tf-fill' : undefined"
                        />
                        <Selector
                          v-else-if="item.id === 'priority'"
                          v-model="priorityFilter"
                          label="Priority filter"
                          is-label-hidden
                          placeholder="Priority"
                          size="sm"
                          has-clear
                          :options="PRIORITY_OPTIONS"
                          :control-class="priorityFilter != null ? 'tf-fill' : undefined"
                        >
                          <template #selected="{ option }">
                            {{ option ? `Priority is ${option.label}` : 'Priority' }}
                          </template>
                        </Selector>
                        <ComplexSelector
                          v-else
                          :model-value="quoteDraft"
                          label="Quote filter"
                          is-label-hidden
                          placeholder="Quote"
                          :trigger-label="quoteLabel"
                          size="sm"
                          :control-class="hasQuoteFilter ? 'tf-fill' : undefined"
                          @change="commitQuote"
                        >
                          <template #default="{ commit, close }">
                            <VStack :gap="4" :width="268">
                              <VStack :gap="0">
                                <Text type="label">
                                  Quote range
                                </Text>
                                <Text type="large" has-tabular-numbers>
                                  {{ formatMoney(quoteDraft[0]) }} – {{ formatMoney(quoteDraft[1]) }}
                                </Text>
                              </VStack>
                              <VStack :gap="1">
                                <Slider
                                  v-model="quoteDraft"
                                  label="Quote range"
                                  is-label-hidden
                                  :min="QUOTE_MIN"
                                  :max="QUOTE_MAX"
                                  :step="QUOTE_STEP"
                                  value-display="none"
                                  :format-value="formatMoney"
                                  :min-steps-between-thumbs="1"
                                  width="100%"
                                  @change-end="commit"
                                />
                                <HStack h-align="between" align="center">
                                  <Text type="supporting" color="secondary">
                                    {{ formatMoney(QUOTE_MIN) }}
                                  </Text>
                                  <Text type="supporting" color="secondary">
                                    {{ formatMoney(QUOTE_MAX) }}
                                  </Text>
                                </HStack>
                              </VStack>
                              <Divider />
                              <HStack :gap="2" h-align="between" align="center">
                                <Button
                                  label="Clear"
                                  variant="ghost"
                                  size="sm"
                                  :is-disabled="!hasQuoteFilter"
                                  @click="commit([QUOTE_MIN, QUOTE_MAX])"
                                />
                                <Button label="Done" variant="secondary" size="sm" @click="close" />
                              </HStack>
                            </VStack>
                          </template>
                        </ComplexSelector>
                      </template>
                      <template #overflow="{ items }">
                        <Button
                          :label="`+${items.length}`"
                          :tooltip="`${items.length} more ${items.length === 1 ? 'filter' : 'filters'}`"
                          variant="ghost"
                          size="sm"
                          class="tf-chrome tf-surface"
                        />
                      </template>
                    </OverflowList>
                    <HStack :gap="2" align="center" class="tf-meta">
                      <IconButton label="Advanced search" tooltip="Advanced search" variant="ghost" size="sm">
                        <Icon name="heroicons:adjustments-horizontal" size="sm" />
                      </IconButton>
                      <Text type="supporting" color="secondary">
                        {{ visibleJobs.length }} {{ visibleJobs.length === 1 ? 'result' : 'results' }}
                      </Text>
                      <template v-if="hasFilters">
                        <Text type="supporting" color="secondary">
                          •
                        </Text>
                        <Link type="supporting" @click="clearAll">
                          Clear all
                        </Link>
                      </template>
                    </HStack>
                  </StackItem>
                </HStack>
              </StackItem>

              <HStack :gap="3" align="center" class="tf-end">
                <DropdownMenu has-chevron size="sm" :items="viewOptionItems" :button="{ label: 'View options', size: 'sm', variant: 'ghost' }" />
                <IconButton label="Create saved view" tooltip="Create saved view" variant="ghost" size="sm">
                  <Icon name="heroicons:bookmark" size="sm" />
                </IconButton>
                <IconButton label="Saved views" tooltip="Saved views" variant="ghost" size="sm">
                  <Icon name="heroicons:bookmark" size="sm" />
                </IconButton>
              </HStack>
            </HStack>
          </VStack>
        </Section>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="4" label="Service jobs">
      <Table
        :data="groupedData"
        :columns="columns"
        id-key="id"
        density="balanced"
        dividers="rows"
        has-hover
        text-overflow="wrap"
        vertical-align="top"
        :row-count="visibleJobs.length"
        :plugins="{ selection: selectionPlugin, sortable: sortPlugin, sticky: stickyPlugin, grouped: groupedPlugin }"
      />
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.tf-shell {
  background: var(--astryx-color-background-surface);
}

.tf-toolbar {
  container: toolbar / inline-size;
}

.tf-primary {
  flex-basis: 0;
}

@container toolbar (max-width: 860px) {
  .tf-primary {
    flex-basis: 100%;
  }
}

.tf-end {
  margin-inline-start: auto;
}

.tf-filter-row {
  row-gap: 6px;
}

.tf-search {
  flex-shrink: 1;
  width: 120px;
  min-width: 120px;
  transition: width var(--astryx-duration-fast) var(--astryx-ease-standard);
}

.tf-search:focus-within {
  width: 240px;
}

.tf-overflow-slot {
  display: flex;
  flex-grow: 1;
  flex-shrink: 100;
  align-items: center;
  min-width: 228px;
  padding-inline-end: 184px;
}

.tf-meta {
  flex-shrink: 0;
  margin-inline: 8px -184px;
}

.tf-chrome {
  border: var(--astryx-border-width) solid var(--astryx-color-border-emphasized);
  border-radius: var(--astryx-radius-element);
}

.tf-surface {
  background-color: var(--astryx-color-background-surface);
}

.tf-value {
  font-weight: var(--astryx-font-weight-normal);
}

.tf-empty {
  font-weight: var(--astryx-font-weight-normal);
  color: var(--astryx-color-text-secondary);
}

.tf-fill {
  background-color: var(--astryx-color-overlay-pressed);
}
</style>
