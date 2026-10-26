<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  DropdownMenu,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  pixel,
  proportional,
  Selector,
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
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

type JobStatus = 'scheduled' | 'in_progress' | 'on_hold' | 'overdue' | 'completed'
type Priority = 'urgent' | 'high' | 'normal'

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
const customerFilter = ref<string | null>(null)
const technicianFilter = ref<string | null>(null)
const priorityFilter = ref<string | null>(null)
const quoteFilter = ref<string | null>(null)
const collapsedGroups = ref<ReadonlySet<string>>(new Set())

const QUOTE_BANDS = [
  { value: 'under-500', label: 'Under $500' },
  { value: '500-1500', label: '$500 – $1,500' },
  { value: '1500-3000', label: '$1,500 – $3,000' },
  { value: 'over-3000', label: 'Over $3,000' },
]

function inQuoteBand(job: ServiceJob, band: string | null): boolean {
  if (band == null)
    return true
  if (band === 'under-500')
    return job.quoted < 500
  if (band === '500-1500')
    return job.quoted >= 500 && job.quoted < 1500
  if (band === '1500-3000')
    return job.quoted >= 1500 && job.quoted < 3000
  return job.quoted >= 3000
}

const visibleJobs = computed(() => {
  const term = query.value.trim().toLowerCase()
  return allJobs.filter((job) => {
    if (isUpcoming.value && job.scheduledOn.getTime() < NOW_MS)
      return false
    if (statusFilter.value.length > 0 && !statusFilter.value.includes(job.status))
      return false
    if (customerFilter.value != null && job.customer !== customerFilter.value)
      return false
    if (technicianFilter.value != null && job.technician !== technicianFilter.value)
      return false
    if (priorityFilter.value != null && job.priority !== priorityFilter.value)
      return false
    if (!inQuoteBand(job, quoteFilter.value))
      return false
    if (term !== '' && !job.summary.toLowerCase().includes(term) && !job.id.toLowerCase().includes(term))
      return false
    return true
  })
})

const activeChipCount = computed(() =>
  (isUpcoming.value ? 1 : 0)
  + (statusFilter.value.length > 0 ? 1 : 0)
  + (customerFilter.value != null ? 1 : 0)
  + (technicianFilter.value != null ? 1 : 0)
  + (priorityFilter.value != null ? 1 : 0)
  + (quoteFilter.value != null ? 1 : 0),
)

/** 只有「Scheduled」那枚 chip 带数量与浮层，其余筛选各有自己的控件。 */
const scheduledChipLabel = computed(() => {
  const statuses = statusFilter.value
  if (statuses.length === 0)
    return 'Any status'
  const labels = statuses.map(status => STATUS_META[status as JobStatus].label)
  if (labels.length <= 1)
    return labels[0] ?? 'Any status'
  return `${labels[0]}, +${labels.length - 1}`
})

function clearAll(): void {
  query.value = ''
  isUpcoming.value = false
  statusFilter.value = []
  customerFilter.value = null
  technicianFilter.value = null
  priorityFilter.value = null
  quoteFilter.value = null
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

const { sortedData, sortConfig } = useTableSortableState<ServiceJob>({
  data: () => visibleJobs.value,
  columns: () => columns,
})

const { selectionConfig } = useTableSelectionState<ServiceJob>({
  data: sortedData,
  idKey: 'id',
  selectedKeys,
  setSelectedKeys(keys) {
    selectedKeys.value = keys
  },
})
const selectionPlugin = useTableSelection<ServiceJob>(selectionConfig)

const { data: groupedData, plugin: groupedPlugin } = useTableGroupedRows<ServiceJob>(() => ({
  data: sortedData.value,
  groupBy: job => job.customer,
  groupOrder: CUSTOMERS,
  collapsedGroups: collapsedGroups.value,
  onToggleGroup: toggleGroup,
  getRowKey: job => job.id,
  renderGroupHeader: (groupKey, count) => h(Text, { weight: 'semibold' }, () => `${groupKey} (${count})`),
}))

const sortPlugin = useTableSortable<ServiceJob>(sortConfig)

const columns: TableColumn<ServiceJob>[] = [
  {
    key: 'job',
    header: 'Job',
    width: proportional(3, { minWidth: 240 }),
    sortable: { sortKey: 'summary', compare: (a, b) => a.summary.localeCompare(b.summary) },
    renderCell: job => h(VStack, { gap: 0.5 }, () => [
      h(Text, { maxLines: 1 }, () => job.summary),
      h(Text, { type: 'supporting', color: 'secondary' }, () => job.id),
    ]),
  },
  {
    key: 'customer',
    header: 'Customer',
    width: proportional(2, { minWidth: 180 }),
    sortable: { compare: (a, b) => a.customer.localeCompare(b.customer) },
    renderCell: job => h(Text, { maxLines: 1 }, () => job.customer),
  },
  {
    key: 'technician',
    header: 'Technician',
    width: proportional(2, { minWidth: 170 }),
    sortable: { compare: (a, b) => a.technician.localeCompare(b.technician) },
    renderCell: job => h(HStack, { gap: 2, vAlign: 'center' }, () => [
      h(Avatar, { name: job.technician, size: 'sm' }),
      h(Text, { maxLines: 1 }, () => job.technician),
    ]),
  },
  {
    key: 'status',
    header: 'Status',
    width: pixel(130),
    sortable: { compare: (a, b) => STATUS_META[a.status].label.localeCompare(STATUS_META[b.status].label) },
    renderCell: job => h(Badge, {
      label: STATUS_META[job.status].label,
      variant: STATUS_META[job.status].badge,
    }),
  },
  {
    key: 'priority',
    header: 'Priority',
    width: pixel(110),
    sortable: { compare: (a, b) => a.priority.localeCompare(b.priority) },
    renderCell: job => h(HStack, { gap: 2, vAlign: 'center' }, () => [
      h(StatusDot, { variant: PRIORITY_META[job.priority].dot, label: PRIORITY_META[job.priority].label }),
      h(Text, () => PRIORITY_META[job.priority].label),
    ]),
  },
  {
    key: 'scheduled',
    header: 'Scheduled',
    width: pixel(170),
    sortable: { sortKey: 'scheduledAt', compare: (a, b) => a.scheduledAt.localeCompare(b.scheduledAt) },
    renderCell: job => h(Text, { color: 'secondary' }, () => formatScheduled(job.scheduledAt)),
  },
  {
    key: 'quoted',
    header: 'Quote',
    width: pixel(90),
    align: 'end',
    sortable: { compare: (a, b) => a.quoted - b.quoted },
    renderCell: job => h(Text, { hasTabularNumbers: true }, () => formatMoney(job.quoted)),
  },
]

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

const statusItems = STATUS_OPTIONS.map(option => ({
  label: option.label,
  onClick: () => {
    const next = statusFilter.value.includes(option.value)
      ? statusFilter.value.filter(value => value !== option.value)
      : [...statusFilter.value, option.value]
    statusFilter.value = next
  },
}))

const viewOptionItems = [
  { label: 'Columns', onClick: () => {} },
  { label: 'Density', onClick: () => {} },
  { label: 'Grouping', onClick: () => {} },
]

/** 搜索框起始位置的放大镜，供 `TextInput` 的 `startIcon` 使用。 */
function SearchIcon() {
  return h(Icon, { icon: 'search', size: 'sm' })
}

/** Stack 的内边距会通过 CSS 变量传给嵌套 Stack，所以容器留白用内联样式。 */
function spacing(step: number): string {
  return `var(--astryx-spacing-${String(step).replace('.', '-')}, ${step * 4}px)`
}
</script>

<template>
  <Layout height="fill">
    <LayoutContent :padding="0" is-scrollable>
      <VStack :gap="0">
        <HStack :gap="3" align="center" :style="{ padding: spacing(4) }">
          <StackItem size="fill">
            <Heading :level="1">
              Service jobs
            </Heading>
          </StackItem>
          <Button label="New job" variant="primary" size="sm">
            <template #icon>
              <Icon name="heroicons:plus" size="sm" />
            </template>
          </Button>
        </HStack>

        <HStack
          :gap="2"
          align="center"
          wrap="wrap"
          :style="{ paddingInline: spacing(4), paddingBlockEnd: spacing(3) }"
        >
          <VStack :width="200">
            <TextInput
              v-model="query"
              label="Job name"
              is-label-hidden
              placeholder="Job name"
              has-clear
              :start-icon="SearchIcon"
            />
          </VStack>
          <ToggleButton
            v-model:is-pressed="isUpcoming"
            label="Upcoming"
            size="sm"
            variant="secondary"
          />
          <HStack :gap="1" align="center">
            <Token
              size="md"
              :label="scheduledChipLabel"
              removable
              @remove="statusFilter = []"
            />
            <DropdownMenu has-chevron size="sm" :items="statusItems" :button="{ label: 'Status', size: 'sm', variant: 'ghost' }" />
          </HStack>
          <Selector
            v-model="customerFilter"
            label="Customer"
            is-label-hidden
            size="sm"
            placeholder="Customer"
            :options="CUSTOMER_OPTIONS"
          />
          <Selector
            v-model="technicianFilter"
            label="Technician"
            is-label-hidden
            size="sm"
            placeholder="Technician"
            :options="TECHNICIAN_OPTIONS"
          />
          <Selector
            v-model="priorityFilter"
            label="Priority"
            is-label-hidden
            size="sm"
            placeholder="Priority"
            :options="PRIORITY_OPTIONS"
          />
          <Selector
            v-model="quoteFilter"
            label="Quote"
            is-label-hidden
            size="sm"
            placeholder="Quote"
            :options="QUOTE_BANDS"
          />
          <IconButton label="More filters" variant="ghost" size="sm">
            <Icon icon="funnel" size="sm" />
          </IconButton>
          <Text type="supporting" color="secondary">
            {{ visibleJobs.length }} results
          </Text>
          <Button
            v-if="activeChipCount > 0"
            label="Clear all"
            variant="ghost"
            size="sm"
            @click="clearAll"
          />
          <StackItem size="fill" />
          <DropdownMenu has-chevron size="sm" :items="viewOptionItems" :button="{ label: 'View options', size: 'sm', variant: 'ghost' }" />
          <IconButton label="Save this view" variant="ghost" size="sm">
            <Icon name="heroicons:bookmark" size="sm" />
          </IconButton>
          <IconButton label="View settings" variant="ghost" size="sm">
            <Icon name="heroicons:adjustments-horizontal" size="sm" />
          </IconButton>
        </HStack>

        <Table
          :data="groupedData"
          :columns="columns"
          id-key="id"
          density="balanced"
          dividers="rows"
          has-hover
          text-overflow="truncate"
          :plugins="{ selection: selectionPlugin, sort: sortPlugin, grouped: groupedPlugin }"
        />
      </VStack>
    </LayoutContent>
  </Layout>
</template>
