<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  ComplexSelector,
  Dialog,
  DialogHeader,
  Divider,
  EmptyState,
  Heading,
  HStack,
  Icon,
  IconButton,
  isTableGroupHeader,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  Link,
  MetadataList,
  MetadataListItem,
  MultiSelector,
  OverflowList,
  pixel,
  Popover,
  PowerSearch,
  proportional,
  ProgressBar,
  RadioList,
  RadioListItem,
  ResizeHandle,
  Section,
  Selector,
  Skeleton,
  Slider,
  StackItem,
  StatusDot,
  Table,
  Text,
  TextInput,
  Token,
  ToggleButton,
  usePowerSearchConfig,
  useResizable,
  useTableGroupedRows,
  useTableSelection,
  useTableSelectionState,
  useTableSortable,
  useTableSortableState,
  useTableStickyColumns,
  VStack,
} from '@astryx-vue/core'
import type { PowerSearchFilter, TableColumn, TablePlugin } from '@astryx-vue/core'
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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

/** 详情面板主按钮按状态换文案，和原版一致。 */
const NEXT_ACTION: Record<JobStatus, string> = {
  scheduled: 'Dispatch technician',
  in_progress: 'Mark complete',
  on_hold: 'Check parts order',
  overdue: 'Reschedule',
  completed: 'Create follow-up',
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
]

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

// ============= Power Search 配置 =============

/** 字段定义同时喂给筛选行的子句和高级搜索模式，两种模式读写同一组 filter。 */
const fieldDefs = [
  { key: 'summary', type: 'string', label: 'Job' },
  { key: 'id', type: 'string', label: 'ID' },
  { key: 'customer', type: 'enum', label: 'Customer', enumValues: CUSTOMERS.map(v => ({ value: v, label: v })) },
  { key: 'technician', type: 'enum', label: 'Technician', enumValues: TECHNICIANS.map(v => ({ value: v, label: v })) },
  { key: 'status', type: 'enum', label: 'Status', enumValues: (Object.keys(STATUS_META) as JobStatus[]).map(v => ({ value: v, label: STATUS_META[v].label })) },
  { key: 'priority', type: 'enum', label: 'Priority', enumValues: (Object.keys(PRIORITY_META) as Priority[]).map(v => ({ value: v, label: PRIORITY_META[v].label })) },
  { key: 'scheduledOn', type: 'date', label: 'Scheduled' },
  { key: 'quoted', type: 'number', label: 'Quote' },
] as const

const { config: searchConfig, applyFilters } = usePowerSearchConfig(fieldDefs, 'Jobs')

/** 屏幕打开时只显示进行中的活儿——除了 Completed 以外的所有状态。 */
const INITIAL_FILTERS: PowerSearchFilter[] = [
  { field: 'status', operator: 'is_any_of', value: { type: 'enum_list', value: ['scheduled', 'in_progress', 'on_hold', 'overdue'] } },
]

/** Upcoming 预置子句：排期在今天之后。 */
const UPCOMING_FILTER: PowerSearchFilter = {
  field: 'scheduledOn',
  operator: 'after',
  value: { type: 'date_absolute', unixSeconds: Math.floor(NOW_MS / 1000) },
}

const filters = ref<PowerSearchFilter[]>([...INITIAL_FILTERS])
const isPowerSearch = ref(false)
const query = ref('')

const hasFilters = computed(() => filters.value.length > 0 || query.value !== '')

function sameFilter(a: PowerSearchFilter, b: PowerSearchFilter): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** 写某个字段的单条子句；null 表示撤掉这个字段的筛选。 */
function setFieldFilter(fieldKey: string, next: PowerSearchFilter | null): void {
  activeSavedViewId.value = null
  const rest = filters.value.filter(f => f.field !== fieldKey)
  filters.value = next ? [...rest, next] : rest
}

function togglePreset(preset: PowerSearchFilter): void {
  activeSavedViewId.value = null
  filters.value = filters.value.some(f => sameFilter(f, preset))
    ? filters.value.filter(f => !sameFilter(f, preset))
    : [...filters.value.filter(f => f.field !== preset.field), preset]
}

function clearAll(): void {
  filters.value = []
  query.value = ''
  activeSavedViewId.value = null
}

const isUpcoming = computed(() => filters.value.some(f => sameFilter(f, UPCOMING_FILTER)))

// ============= 多选字段 =============

/** 多选字段共用一套读写：一条 is_any_of 子句装整个列表。 */
function readMultiValues(fieldKey: string): string[] {
  const active = filters.value.find(f => f.field === fieldKey)
  const raw = active ? (active.value as { value?: unknown }).value : null
  if (Array.isArray(raw))
    return raw.map(String)
  return raw == null ? [] : [String(raw)]
}

function writeMultiValues(fieldKey: string, next: string[]): void {
  setFieldFilter(
    fieldKey,
    next.length === 0
      ? null
      : { field: fieldKey, operator: 'is_any_of', value: { type: 'enum_list', value: next } },
  )
}

const statusFilter = computed({
  get: () => readMultiValues('status'),
  set: value => writeMultiValues('status', value),
})
const customerFilter = computed({
  get: () => readMultiValues('customer'),
  set: value => writeMultiValues('customer', value),
})
const technicianFilter = computed({
  get: () => readMultiValues('technician'),
  set: value => writeMultiValues('technician', value),
})

// ============= Priority 单选 =============

const priorityFilter = computed<string | null>({
  get: () => {
    const active = filters.value.find(f => f.field === 'priority')
    const raw = active ? (active.value as { value?: unknown }).value : null
    return raw == null ? null : String(raw)
  },
  set: (value) => {
    setFieldFilter(
      'priority',
      value == null
        ? null
        : { field: 'priority', operator: 'is', value: { type: 'enum', value } },
    )
  },
})

// ============= Quote 区间 =============

const QUOTE_MIN = 0
const QUOTE_MAX = Math.ceil(Math.max(...allJobs.map(j => j.quoted)) / 500) * 500
const QUOTE_STEP = 100

function quoteBound(operator: string, fallback: number): number {
  const found = filters.value.find(f => f.field === 'quoted' && f.operator === operator)
  return found ? Number((found.value as { value: number }).value) : fallback
}

const quoteLow = computed(() => quoteBound('greater_than_or_equal', QUOTE_MIN))
const quoteHigh = computed(() => quoteBound('less_than_or_equal', QUOTE_MAX))
const hasQuoteFilter = computed(() => quoteLow.value > QUOTE_MIN || quoteHigh.value < QUOTE_MAX)

/** 拖动中的区间；松手后才写进 filters，和原版一致。 */
const quoteDraft = ref<[number, number]>([QUOTE_MIN, QUOTE_MAX])
watch([quoteLow, quoteHigh], () => {
  quoteDraft.value = [quoteLow.value, quoteHigh.value]
})

function commitQuote(next: [number, number]): void {
  quoteDraft.value = next
  activeSavedViewId.value = null
  const rest = filters.value.filter(f => f.field !== 'quoted')
  const bounds: PowerSearchFilter[] = []
  if (next[0] > QUOTE_MIN) {
    bounds.push({ field: 'quoted', operator: 'greater_than_or_equal', value: { type: 'integer', value: next[0] } })
  }
  if (next[1] < QUOTE_MAX) {
    bounds.push({ field: 'quoted', operator: 'less_than_or_equal', value: { type: 'integer', value: next[1] } })
  }
  filters.value = [...rest, ...bounds]
}

/** 区间收起后的整句，没动过就是占位的「Quote」。 */
const quoteLabel = computed(() => {
  if (!hasQuoteFilter.value)
    return undefined
  if (quoteLow.value > QUOTE_MIN && quoteHigh.value < QUOTE_MAX)
    return `Quote ${formatMoney(quoteLow.value)} – ${formatMoney(quoteHigh.value)}`
  return quoteLow.value > QUOTE_MIN ? `Quote over ${formatMoney(quoteLow.value)}` : `Quote under ${formatMoney(quoteHigh.value)}`
})

// ============= 结果集 =============

const results = computed(() => {
  const byFilters = applyFilters(filters.value, allJobs)
  const term = query.value.trim().toLowerCase()
  if (!term)
    return byFilters
  return byFilters.filter(j =>
    j.summary.toLowerCase().includes(term)
    || j.customer.toLowerCase().includes(term)
    || j.id.toLowerCase().includes(term),
  )
})

/** 筛选或搜索一变就回到第一页，顶部进度条站一班岗。 */
const isLoading = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | undefined
watch([filters, query], () => {
  isLoading.value = true
  clearTimeout(loadingTimer)
  loadingTimer = setTimeout(() => {
    isLoading.value = false
  }, 450)
})
onBeforeUnmount(() => clearTimeout(loadingTimer))

// ============= 视图配置 =============

type Density = 'compact' | 'balanced' | 'spacious'
type StickyEdge = 'none' | 'one' | 'two'
type GroupField = 'none' | 'status' | 'priority' | 'technician' | 'customer'
type ViewSectionKey = 'columns' | 'density' | 'sticky' | 'grouping'

interface ViewState {
  columnKeys: string[]
  density: Density
  stickyStart: StickyEdge
  stickyEnd: StickyEdge
  grouping: GroupField
}

const COLUMN_LABELS: Record<string, string> = {
  summary: 'Job',
  customer: 'Customer',
  technician: 'Technician',
  status: 'Status',
  priority: 'Priority',
  scheduledAt: 'Scheduled',
  quoted: 'Quote',
  equipment: 'Equipment',
  address: 'Address',
}

const ALL_COLUMN_KEYS = ['summary', 'customer', 'technician', 'status', 'priority', 'scheduledAt', 'quoted', 'equipment', 'address']
const DEFAULT_COLUMN_KEYS = ['summary', 'customer', 'technician', 'status', 'priority', 'scheduledAt', 'quoted']

/** Job 列给每行命名，不能移除；位置仍可以拖动。 */
const LOCKED_COLUMN_KEY = 'summary'
const LOCKED_COLUMN_MESSAGE = 'Job names every row, so it cannot be removed.'

const DENSITY_OPTIONS: { value: Density, label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'spacious', label: 'Spacious' },
]
const STICKY_START_OPTIONS: { value: StickyEdge, label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'one', label: 'First column' },
  { value: 'two', label: 'First two columns' },
]
const STICKY_END_OPTIONS: { value: StickyEdge, label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'one', label: 'Last column' },
  { value: 'two', label: 'Last two columns' },
]
const GROUPING_OPTIONS: { value: GroupField, label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'technician', label: 'Technician' },
  { value: 'customer', label: 'Customer' },
]

const VIEW_SECTIONS: { key: ViewSectionKey, label: string, title: string, icon: string }[] = [
  { key: 'columns', label: 'Columns', title: 'Columns', icon: 'heroicons:view-columns' },
  { key: 'density', label: 'Density', title: 'Density', icon: 'heroicons:table-cells' },
  { key: 'sticky', label: 'Sticky Columns', title: 'Sticky Columns', icon: 'heroicons:lock-closed' },
  { key: 'grouping', label: 'Grouping', title: 'Grouping', icon: 'heroicons:rectangle-group' },
]

const INITIAL_VIEW: ViewState = {
  columnKeys: [...DEFAULT_COLUMN_KEYS],
  density: 'balanced',
  stickyStart: 'one',
  stickyEnd: 'none',
  grouping: 'customer',
}

const view = ref<ViewState>({ ...INITIAL_VIEW, columnKeys: [...INITIAL_VIEW.columnKeys] })
const viewSection = ref<ViewSectionKey>('columns')

function updateView(patch: (current: ViewState) => ViewState): void {
  view.value = patch(view.value)
}

/** 分组键用标签（状态/优先级）或原名（技师/客户），组序按紧急程度或字母。 */
const VALUE_LABELS: Record<string, string> = {
  ...Object.fromEntries((Object.keys(STATUS_META) as JobStatus[]).map(k => [k, STATUS_META[k].label])),
  ...Object.fromEntries((Object.keys(PRIORITY_META) as Priority[]).map(k => [k, PRIORITY_META[k].label])),
}

function groupKeyOf(job: ServiceJob, field: GroupField): string {
  if (field === 'none')
    return ''
  const stored = String(job[field])
  return VALUE_LABELS[stored] ?? stored
}

const GROUP_ORDERS: Record<GroupField, string[]> = {
  none: [],
  status: (Object.keys(STATUS_META) as JobStatus[]).map(k => STATUS_META[k].label),
  priority: (Object.keys(PRIORITY_META) as Priority[]).map(k => PRIORITY_META[k].label),
  technician: TECHNICIANS,
  customer: CUSTOMERS,
}

const groupField = computed(() => view.value.grouping)
const isGrouped = computed(() => groupField.value !== 'none')

// ============= 列定义 =============

function makeColumn(key: string): TableColumn<ServiceJob> {
  switch (key) {
    case 'summary':
      return {
        key: 'summary',
        header: 'Job',
        width: proportional(2, { minWidth: 240 }),
        sortable: { compare: (a, b) => a.summary.localeCompare(b.summary) },
        renderCell: job => h(VStack, { gap: 0 }, () => [
          h(Text, { type: 'body' }, () => job.summary),
          h(Text, { type: 'supporting', color: 'secondary' }, () => job.id),
        ]),
      }
    case 'customer':
      return {
        key: 'customer',
        header: 'Customer',
        width: proportional(1, { minWidth: 180 }),
        sortable: { compare: (a, b) => a.customer.localeCompare(b.customer) },
        renderCell: job => h(Text, { type: 'body' }, () => job.customer),
      }
    case 'technician':
      return {
        key: 'technician',
        header: 'Technician',
        width: pixel(200),
        sortable: { compare: (a, b) => a.technician.localeCompare(b.technician) },
        renderCell: job => h(HStack, { gap: 2, vAlign: 'center' }, () => [
          h(Avatar, { name: job.technician, size: 'sm' }),
          h(Text, { type: 'body' }, () => job.technician),
        ]),
      }
    case 'status':
      return {
        key: 'status',
        header: 'Status',
        width: pixel(150),
        sortable: { compare: (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] },
        renderCell: job => h(Badge, {
          label: STATUS_META[job.status].label,
          variant: STATUS_META[job.status].badge,
        }),
      }
    case 'priority':
      return {
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
      }
    case 'scheduledAt':
      return {
        key: 'scheduledAt',
        header: 'Scheduled',
        width: pixel(160),
        sortable: { compare: (a, b) => a.scheduledAt.localeCompare(b.scheduledAt) },
        renderCell: job => h(Text, { type: 'body' }, () => formatScheduled(job.scheduledAt)),
      }
    case 'quoted':
      return {
        key: 'quoted',
        header: 'Quote',
        width: pixel(110),
        align: 'end',
        sortable: { compare: (a, b) => a.quoted - b.quoted },
        renderCell: job => h(Text, { type: 'body' }, () => formatMoney(job.quoted)),
      }
    case 'equipment':
      return {
        key: 'equipment',
        header: 'Equipment',
        width: proportional(1, { minWidth: 200 }),
        sortable: { compare: (a, b) => a.equipment.localeCompare(b.equipment) },
        renderCell: job => h(Text, { type: 'body' }, () => job.equipment),
      }
    default:
      return {
        key: 'address',
        header: 'Address',
        width: proportional(1, { minWidth: 180 }),
        sortable: { compare: (a, b) => a.address.localeCompare(b.address) },
        renderCell: job => h(Text, { type: 'body' }, () => job.address),
      }
  }
}

const COLUMN_DEFS = new Map(ALL_COLUMN_KEYS.map(key => [key, makeColumn(key)]))

const columns = computed<TableColumn<ServiceJob>[]>(() =>
  view.value.columnKeys.map(key => COLUMN_DEFS.get(key)!).filter(Boolean),
)

const displayedColumns = computed(() => view.value.columnKeys)
const availableColumns = computed(() => ALL_COLUMN_KEYS.filter(key => !view.value.columnKeys.includes(key)))

/** 视图选项里拖动排序：按住把手，行跟着指针走，松手落位。 */
const columnRowRefs = new Map<string, HTMLElement>()
const reorderDropKey = ref<string | null>(null)

function columnRowRef(key: string) {
  return (el: unknown) => {
    if (el == null)
      columnRowRefs.delete(key)
    else
      columnRowRefs.set(key, el as HTMLElement)
  }
}

let reorderSession: { key: string, pointerId: number, fromIndex: number } | null = null

function onGripPointerDown(event: PointerEvent, key: string): void {
  const fromIndex = view.value.columnKeys.indexOf(key)
  if (fromIndex < 0)
    return
  reorderSession = { key, pointerId: event.pointerId, fromIndex }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function onGripPointerMove(event: PointerEvent): void {
  if (reorderSession == null)
    return
  const over = [...columnRowRefs.entries()].find(([, el]) => {
    const rect = el.getBoundingClientRect()
    return event.clientY >= rect.top && event.clientY <= rect.bottom
  })
  reorderDropKey.value = over?.[0] ?? null
}

function onGripPointerUp(): void {
  if (reorderSession == null)
    return
  const { key, fromIndex } = reorderSession
  const toKey = reorderDropKey.value
  reorderSession = null
  reorderDropKey.value = null
  if (toKey == null || toKey === key)
    return
  const toIndex = view.value.columnKeys.indexOf(toKey)
  if (toIndex < 0)
    return
  updateView((current) => {
    const next = [...current.columnKeys]
    next.splice(fromIndex, 1)
    next.splice(toIndex, 0, key)
    return { ...current, columnKeys: next }
  })
}

// ============= 排序 / 选择 / 分组 / 冻结 =============

const { sortedData, sortConfig } = useTableSortableState<ServiceJob>({
  data: () => results.value,
  columns,
  defaultSort: [{ sortKey: 'priority', direction: 'ascending' }],
})

const SORT_RANKS: Record<string, Record<string, number>> = {
  priority: { urgent: 0, high: 1, normal: 2 },
  status: { overdue: 0, on_hold: 1, in_progress: 2, scheduled: 3, completed: 4 },
}

/**
 * 分组时组序优先于排序键（原版 comparator 先比组），保证一个组的行连续、
 * 分页切点落在组边界；不分组时直接用排序组合的结果。
 */
const groupMajorData = computed(() => {
  if (!isGrouped.value)
    return sortedData.value
  const order = GROUP_ORDERS[groupField.value]
  const rank = new Map(order.map((key, index) => [key, index]))
  return [...results.value].sort((a, b) => {
    const byGroup = (rank.get(groupKeyOf(a, groupField.value)) ?? Number.MAX_SAFE_INTEGER)
      - (rank.get(groupKeyOf(b, groupField.value)) ?? Number.MAX_SAFE_INTEGER)
    if (byGroup !== 0)
      return byGroup
    for (const { sortKey, direction } of sortConfig.sort) {
      const av = a[sortKey]
      const bv = b[sortKey]
      const ranks = SORT_RANKS[sortKey]
      let cmp: number
      if (ranks != null) {
        cmp = (ranks[String(av)] ?? Number.MAX_SAFE_INTEGER) - (ranks[String(bv)] ?? Number.MAX_SAFE_INTEGER)
      }
      else if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv
      }
      else {
        cmp = String(av ?? '').localeCompare(String(bv ?? ''))
      }
      if (cmp !== 0)
        return direction === 'ascending' ? cmp : -cmp
    }
    return 0
  })
})

const selectedKeys = ref<ReadonlySet<string>>(new Set())

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

const selectedJobs = computed(() => allJobs.filter(job => selectedKeys.value.has(job.id)))
const selectedCount = computed(() => selectedKeys.value.size)

function unselectAll(): void {
  selectedKeys.value = new Set()
}

const collapsedGroups = ref<ReadonlySet<string>>(new Set())

function toggleGroup(key: string): void {
  const next = new Set(collapsedGroups.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  collapsedGroups.value = next
}

const { data: groupedRows, plugin: groupedPlugin, idKey: groupedIdKey } = useTableGroupedRows<ServiceJob>(() => ({
  data: pagedData.value,
  groupBy: job => groupKeyOf(job, groupField.value),
  groupOrder: GROUP_ORDERS[groupField.value],
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

/** 冻结边映射到当前显示列的头/尾。 */
const stickyStartKeys = computed<string[]>(() => {
  const keys = view.value.columnKeys
  if (view.value.stickyStart === 'one')
    return keys.slice(0, 1)
  if (view.value.stickyStart === 'two')
    return keys.slice(0, 2)
  return []
})
const stickyEndKeys = computed<string[]>(() => {
  const keys = view.value.columnKeys
  if (view.value.stickyEnd === 'one')
    return keys.slice(-1)
  if (view.value.stickyEnd === 'two')
    return keys.slice(-2)
  return []
})
const stickyPlugin = useTableStickyColumns<ServiceJob>(() => ({
  startKeys: stickyStartKeys.value,
  endKeys: stickyEndKeys.value,
}))

// ============= 无限加载 =============

const PAGE_SIZE = 15
const SKELETON_ROWS = 5

const loadedCount = ref(PAGE_SIZE)
const isLoadingNext = ref(false)
let nextTimer: ReturnType<typeof setTimeout> | undefined
let inFlight = false

/** 分组时把分页切点补齐到当前组末尾，不把一个组截成两半。 */
const visibleCount = computed(() => {
  const items = groupMajorData.value
  if (loadedCount.value >= items.length)
    return items.length
  if (!isGrouped.value)
    return loadedCount.value
  const openKey = groupKeyOf(items[loadedCount.value - 1], groupField.value)
  let end = loadedCount.value
  while (end < items.length && groupKeyOf(items[end], groupField.value) === openKey)
    end++
  return end
})

const pagedData = computed(() => groupMajorData.value.slice(0, visibleCount.value))

watch(groupMajorData, () => {
  loadedCount.value = PAGE_SIZE
  isLoadingNext.value = false
})

function loadNext(count: number): void {
  if (inFlight)
    return
  inFlight = true
  isLoadingNext.value = true
  clearTimeout(nextTimer)
  nextTimer = setTimeout(() => {
    loadedCount.value = visibleCount.value + count
    isLoadingNext.value = false
    inFlight = false
  }, 500)
}
onBeforeUnmount(() => clearTimeout(nextTimer))

const hasNext = computed(() => visibleCount.value < sortedData.value.length)

const sentinelRef = ref<HTMLElement | null>(null)
let sentinelScrollRoot: HTMLElement | null = null

/** 哨兵的滚动容器：页面滚就是 document，内容区内部滚就是那个容器。 */
function scrollRootOf(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null
  while (node != null) {
    const overflowY = getComputedStyle(node).overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight)
      return node
    node = node.parentElement
  }
  return null
}

/** 哨兵距滚动容器底部不足 240px 就取下一批，和原版的 IntersectionObserver 同语义。 */
function checkSentinel(): void {
  const el = sentinelRef.value
  if (el == null || !hasNext.value)
    return
  const elRect = el.getBoundingClientRect()
  const rootRect = sentinelScrollRoot == null
    ? { top: 0, bottom: window.innerHeight }
    : sentinelScrollRoot.getBoundingClientRect()
  if (elRect.top - rootRect.bottom < 240)
    loadNext(PAGE_SIZE)
}

function bindSentinel(el: HTMLElement | null): void {
  if (sentinelScrollRoot != null && sentinelScrollRoot !== document.scrollingElement) {
    sentinelScrollRoot.removeEventListener('scroll', checkSentinel)
    sentinelScrollRoot = null
  }
  window.removeEventListener('scroll', checkSentinel)
  window.removeEventListener('resize', checkSentinel)
  if (el == null)
    return
  sentinelScrollRoot = scrollRootOf(el)
  const root = sentinelScrollRoot ?? document.scrollingElement
  if (root != null && root !== document.scrollingElement)
    root.addEventListener('scroll', checkSentinel, { passive: true })
  window.addEventListener('scroll', checkSentinel, { passive: true })
  window.addEventListener('resize', checkSentinel)
  checkSentinel()
}

onMounted(() => bindSentinel(sentinelRef.value))

watch(sentinelRef, el => bindSentinel(el))

const tableRows = computed(() => (isGrouped.value ? groupedRows.value : pagedData.value))
const tableIdKey = computed(() => (isGrouped.value ? groupedIdKey : 'id'))

const tablePlugins = computed<Record<string, TablePlugin<ServiceJob>>>(() => {
  const plugins: Record<string, TablePlugin<ServiceJob>> = {
    selection: selectionPlugin,
    sortable: sortPlugin,
    sticky: stickyPlugin,
    activate: rowActivationPlugin,
  }
  if (isGrouped.value)
    plugins.grouped = groupedPlugin
  return plugins
})

// ============= 行激活（详情面板） =============

const activeJobId = ref<string | null>(null)
const activeJob = computed(() => allJobs.find(j => j.id === activeJobId.value) ?? null)
const siteHistory = computed(() => {
  if (activeJob.value == null)
    return []
  return allJobs
    .filter(j => j.customer === activeJob.value!.customer && j.id !== activeJob.value!.id)
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))
})

/** 点到行内控件不算点中行本身。 */
const INTERACTIVE_WITHIN_ROW = 'button, input, a, label, [role="checkbox"], [role="button"], [role="menuitem"]'

/** core 内部的选择列 key。 */
const SELECTION_COLUMN_WIDTH = 48

const rowActivationPlugin: TablePlugin<ServiceJob> = {
  rowPatch(item) {
    if (isTableGroupHeader(item))
      return null
    return {
      class: 'tf-row',
      attrs: { 'aria-current': item.id === activeJobId.value ? 'true' : undefined },
      onClick: (event) => {
        if ((event.target as HTMLElement | null)?.closest(INTERACTIVE_WITHIN_ROW))
          return
        activeJobId.value = item.id
      },
    }
  },
  cellPatch({ column, row, kind }) {
    // 选择列默认 36px，勾选框离表格边 6px；原版模板把它加宽到 48px，让勾选框落在 16px 的内容边距上。
    // core 里选择列的 36px 写在 CSS 类上，行内样式才压得过。
    if (column.key === '__select') {
      const width = `${SELECTION_COLUMN_WIDTH}px`
      return { style: { width, minWidth: width, maxWidth: width } }
    }
    if (kind !== 'body' || row == null || isTableGroupHeader(row) || row.id !== activeJobId.value)
      return null
    return { style: { backgroundColor: 'var(--astryx-color-accent-muted)' } }
  },
}

/** 详情面板宽度可拖，和原版同档：默认 380，320–560。 */
const detailWidth = useResizable({ defaultSize: 380, minSize: 320, maxSize: 560 })

// ============= 保存视图 =============

interface SavedView {
  id: string
  name: string
  filters: PowerSearchFilter[]
  view: ViewState
}

const cloneView = (snapshot: ViewState): ViewState => ({ ...snapshot, columnKeys: [...snapshot.columnKeys] })

const INITIAL_SAVED_VIEWS: SavedView[] = [
  {
    id: 'needs-dispatch',
    name: 'Needs dispatch',
    filters: [{ field: 'status', operator: 'is', value: { type: 'enum', value: 'scheduled' } }],
    view: cloneView(INITIAL_VIEW),
  },
  {
    id: 'luis-open',
    name: 'Luis’s jobs',
    filters: [{ field: 'technician', operator: 'is', value: { type: 'enum', value: 'Luis Camarena' } }],
    view: { ...cloneView(INITIAL_VIEW), columnKeys: DEFAULT_COLUMN_KEYS.filter(k => k !== 'technician'), grouping: 'status' },
  },
  {
    id: 'high-value',
    name: 'High value',
    filters: [{ field: 'quoted', operator: 'greater_than_or_equal', value: { type: 'integer', value: 1000 } }],
    view: { ...cloneView(INITIAL_VIEW), density: 'compact', stickyEnd: 'one' },
  },
]

/** 深拷贝一条筛选子句，保持联合类型不被打散。 */
function cloneFilter(filter: PowerSearchFilter): PowerSearchFilter {
  return JSON.parse(JSON.stringify(filter)) as PowerSearchFilter
}

function cloneFilters(list: readonly PowerSearchFilter[]): PowerSearchFilter[] {
  return list.map(cloneFilter)
}

const savedViews = ref<SavedView[]>(INITIAL_SAVED_VIEWS.map(saved => ({
  ...saved,
  filters: cloneFilters(saved.filters),
  view: cloneView(saved.view),
})))
const isSavedViewsBarOpen = ref(false)
const activeSavedViewId = ref<string | null>(null)
const creatingName = ref<string | null>(null)
const editing = ref<SavedView | null>(null)

/**
 * 应用一个保存视图：null 是 All，只丢筛选，列配置保持现状。
 * 保存视图带结构化筛选，高级搜索表达不了，所以应用视图时退出高级搜索。
 */
function applySavedView(saved: SavedView | null): void {
  activeSavedViewId.value = saved?.id ?? null
  filters.value = saved ? cloneFilters(saved.filters) : []
  isPowerSearch.value = false
  if (saved == null)
    return
  view.value = cloneView(saved.view)
}

let savedViewSeq = 1
function createSavedView(name: string): void {
  const trimmed = name.trim()
  if (trimmed === '')
    return
  const id = `custom-${savedViewSeq++}`
  savedViews.value = [
    ...savedViews.value,
    { id, name: trimmed, filters: cloneFilters(filters.value), view: cloneView(view.value) },
  ]
  activeSavedViewId.value = id
  creatingName.value = null
  isSavedViewsBarOpen.value = true
}

function saveEditedView(saved: SavedView): void {
  savedViews.value = savedViews.value.map(item => (item.id === saved.id ? { ...saved, filters: cloneFilters(saved.filters), view: cloneView(saved.view) } : item))
  editing.value = null
}

function deleteSavedView(id: string): void {
  savedViews.value = savedViews.value.filter(item => item.id !== id)
  if (activeSavedViewId.value === id)
    activeSavedViewId.value = null
  editing.value = null
}

const activeSavedView = computed(() => savedViews.value.find(saved => saved.id === activeSavedViewId.value) ?? null)

function startEditSavedView(): void {
  const found = activeSavedView.value
  if (found == null)
    return
  editing.value = {
    ...found,
    filters: cloneFilters(found.filters),
    view: cloneView(found.view),
  }
}

function onSavedViewsToggle(next: boolean): void {
  isSavedViewsBarOpen.value = next
  if (next)
    isPowerSearch.value = false
}

// ============= 保存视图摘要（创建/编辑对话框里用） =============

const OPERATOR_LABELS: Record<string, string> = {
  is: 'is',
  is_any_of: 'is any of',
  greater_than_or_equal: '≥',
  less_than_or_equal: '≤',
  after: 'after',
}

function filterValueText(filter: PowerSearchFilter): string {
  const raw = (filter.value as { value?: unknown }).value
  const label = (v: unknown) => {
    const keyValue = String(v ?? '')
    return VALUE_LABELS[keyValue] ?? keyValue
  }
  return Array.isArray(raw) ? raw.map(label).join(', ') : label(raw)
}

/** 一条子句按高级搜索的说法拼成一句，保存视图在任何地方读法一致。 */
function filterTokenLabel(filter: PowerSearchFilter): string {
  const field = fieldDefs.find(f => f.key === filter.field)
  const name = field?.label ?? filter.field
  const operator = OPERATOR_LABELS[filter.operator] ?? filter.operator
  const raw = filter.value as { value?: unknown, unixSeconds?: number }
  let value: string
  if (typeof raw.unixSeconds === 'number') {
    value = formatDate(new Date(raw.unixSeconds * 1000).toISOString(), true)
  }
  else if (Array.isArray(raw.value) && raw.value.length > 1) {
    const [first, ...rest] = raw.value.map(v => VALUE_LABELS[String(v)] ?? String(v))
    value = `${first} +${rest.length}`
  }
  else if (field?.type === 'number' && typeof raw.value === 'number') {
    value = formatMoney(raw.value)
  }
  else {
    value = filterValueText(filter)
  }
  return `${name} ${operator} ${value}`
}

function labelOf(options: { value: string, label: string }[], value: string): string {
  return options.find(option => option.value === value)?.label ?? value
}

// ============= 批量操作 =============

const BULK_EDIT_ACTIONS: { key: string, label: string, icon: string }[] = [
  { key: 'assign', label: 'Assign', icon: 'heroicons:user-plus' },
  { key: 'reschedule', label: 'Reschedule', icon: 'heroicons:calendar-days' },
  { key: 'cancel', label: 'Cancel', icon: 'heroicons:no-symbol' },
]

function runBulkAction(key: string): void {
  const ids = selectedJobs.value.map(job => job.id).join(', ')
  if (key === 'assign')
    alert(`Assign technician: ${ids}`)
  else if (key === 'reschedule')
    alert(`Reschedule: ${ids}`)
  else
    alert(`Cancel: ${ids}`)
}

// ============= 骨架行 =============

const DENSITY_PADDING: Record<Density, number> = { compact: 8, balanced: 12, spacious: 16 }

function skeletonCellStyle(key: string): Record<string, string> {
  const column = COLUMN_DEFS.get(key)
  const width = column?.width as { type?: string, value?: number, minWidth?: number } | undefined
  if (width?.type === 'pixel')
    return { width: `${width.value}px`, flexShrink: '0' }
  if (width?.type === 'proportional')
    return { flex: `${width.value ?? 1} 1 ${width.minWidth ?? 120}px` }
  return { flex: '1 1 120px' }
}

// ============= 高级搜索切换 =============

const powerSearchLabel = computed(() =>
  isPowerSearch.value ? 'Switch to filter tokens' : 'Advanced search',
)

// ============= 选项与工具 =============

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

/** 多选的收起文字：第一项加「+N」，和原版一样。 */
function multiLabel(items: { label: string }[]): string {
  return items.length > 1 ? `${items[0].label}, +${items.length - 1}` : items[0].label
}

/** 筛选行里的每个子句：OverflowList 按下标收起放不下的，面板和行读同一份数组。 */
const filterClauses = ['upcoming', 'status', 'customer', 'technician', 'priority', 'quote'].map(key => ({ id: key, label: key }))

/** 搜索框起始位置的放大镜，供 `TextInput` 的 `startIcon` 使用。 */
function SearchIcon() {
  return h(Icon, { icon: 'search', size: 'sm' })
}
</script>

<template>
  <Layout height="fill" class="tf-shell">
    <template v-if="activeJob != null" #end>
      <ResizeHandle
        :resizable="detailWidth.props"
        is-reversed
        :is-always-visible="false"
        label="Resize job details"
      />
      <LayoutPanel
        :resizable="detailWidth.props"
        has-divider
        :padding="0"
        label="Job details"
      >
        <div class="tf-detail">
          <Section variant="transparent" :padding="4">
            <VStack :gap="4">
              <HStack :gap="2">
                <StackItem size="fill">
                  <VStack :gap="2">
                    <HStack :gap="2" align="center">
                      <Badge
                        :variant="STATUS_META[activeJob.status].badge"
                        :label="STATUS_META[activeJob.status].label"
                      />
                      <StatusDot
                        :variant="PRIORITY_META[activeJob.priority].dot"
                        :label="`${PRIORITY_META[activeJob.priority].label} priority`"
                        :is-pulsing="activeJob.priority === 'urgent'"
                      />
                      <Text type="supporting" color="secondary">
                        {{ PRIORITY_META[activeJob.priority].label }} · {{ activeJob.id }}
                      </Text>
                    </HStack>
                    <Heading :level="2">
                      {{ activeJob.summary }}
                    </Heading>
                  </VStack>
                </StackItem>
                <IconButton
                  label="Close details"
                  tooltip="Close details"
                  variant="ghost"
                  size="sm"
                  @click="activeJobId = null"
                >
                  <Icon name="heroicons:x-mark" size="sm" />
                </IconButton>
              </HStack>

              <HStack :gap="2">
                <Button :label="NEXT_ACTION[activeJob.status]" size="sm" width="100%" />
                <Button label="Edit job" variant="secondary" size="sm" width="100%" />
              </HStack>
            </VStack>
          </Section>

          <Divider />

          <Section variant="transparent" :padding="4">
            <MetadataList columns="single" :label="{ position: 'start', width: 104 }">
              <MetadataListItem label="Customer">
                <Text type="body">
                  {{ activeJob.customer }}
                </Text>
              </MetadataListItem>
              <MetadataListItem label="Site address">
                <Text type="body">
                  {{ activeJob.address }}
                </Text>
              </MetadataListItem>
              <MetadataListItem label="Technician">
                <Text type="body">
                  {{ activeJob.technician }}
                </Text>
              </MetadataListItem>
              <MetadataListItem label="Scheduled">
                <Text type="body">
                  {{ formatDate(activeJob.scheduledAt, true) }}, {{ formatTime(activeJob.scheduledAt) }}
                </Text>
              </MetadataListItem>
              <MetadataListItem label="Equipment">
                <Text type="body">
                  {{ activeJob.equipment }}
                </Text>
              </MetadataListItem>
              <MetadataListItem label="Quote">
                <Text type="body">
                  {{ formatMoney(activeJob.quoted) }}
                </Text>
              </MetadataListItem>
            </MetadataList>
          </Section>

          <Divider />

          <Section variant="transparent" :padding="4">
            <VStack :gap="2">
              <Heading :level="3">
                Site history
              </Heading>
              <Text v-if="siteHistory.length === 0" type="supporting" color="secondary">
                No other visits on file for this site.
              </Text>
              <VStack v-else :gap="0">
                <button
                  v-for="related in siteHistory"
                  :key="related.id"
                  type="button"
                  class="tf-history-row"
                  @click="activeJobId = related.id"
                >
                  <StackItem size="fill">
                    <VStack :gap="0">
                      <Text type="body">
                        {{ related.summary }}
                      </Text>
                      <Text type="supporting" color="secondary">
                        {{ formatDate(related.scheduledAt, true) }} · {{ related.technician }}
                      </Text>
                    </VStack>
                  </StackItem>
                  <Badge
                    :variant="STATUS_META[related.status].badge"
                    :label="STATUS_META[related.status].label"
                  />
                </button>
              </VStack>
            </VStack>
          </Section>
        </div>
      </LayoutPanel>
    </template>

    <template #header>
      <LayoutHeader has-divider label="Job filters and table actions">
        <VStack :gap="0">
          <ProgressBar
            v-if="isLoading"
            label="Loading jobs"
            is-label-hidden
            is-indeterminate
            class="tf-progress"
          />

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

              <Section v-if="selectedCount > 0" variant="muted" :padding-inline="3" :padding-block="1.5" class="tf-bulk">
                <HStack :gap="3" align="center" wrap="wrap" :min-height="32">
                  <StackItem size="fill">
                    <HStack :gap="1" align="center">
                      <Button
                        v-for="action in BULK_EDIT_ACTIONS"
                        :key="action.key"
                        :label="action.label"
                        variant="ghost"
                        size="sm"
                        @click="runBulkAction(action.key)"
                      >
                        <template #icon>
                          <Icon :name="action.icon" size="sm" />
                        </template>
                      </Button>
                    </HStack>
                  </StackItem>
                  <HStack :gap="3" align="center">
                    <Text type="body">
                      {{ selectedCount }} {{ selectedCount === 1 ? 'job' : 'jobs' }} selected
                    </Text>
                    <Text type="supporting" color="secondary">
                      •
                    </Text>
                    <Button label="Unselect All" variant="ghost" size="sm" @click="unselectAll" />
                  </HStack>
                </HStack>
              </Section>

              <HStack v-else :gap="3" align="center" wrap="wrap">
                <StackItem v-if="isPowerSearch" size="fill" class="tf-primary">
                  <!-- 高级搜索模式：整行换成 token 输入框，filter 子句写进同一个 filters。 -->
                  <PowerSearch
                    :config="searchConfig"
                    :filters="filters"
                    placeholder='Try "quote > 1000" or "status is Overdue"'
                    :result-count="`${results.length} ${results.length === 1 ? 'result' : 'results'}`"
                    @update:filters="filters = $event"
                  />
                </StackItem>
                <StackItem v-else-if="isSavedViewsBarOpen" size="fill" class="tf-primary">
                  <HStack
                    :gap="2"
                    align="center"
                    wrap="nowrap"
                    :min-height="32"
                    class="tf-saved-bar"
                  >
                    <Text type="label" class="tf-saved-label">
                      Saved views:
                    </Text>
                    <StackItem size="fill" class="tf-saved-slot">
                      <HStack :gap="2" align="center" wrap="nowrap" class="tf-saved-scroller">
                        <ToggleButton
                          label="All"
                          size="sm"
                          :is-pressed="activeSavedViewId == null"
                          class="tf-chrome"
                          :class="activeSavedViewId == null ? 'tf-value' : 'tf-empty tf-surface'"
                          @pressed-change="applySavedView(null)"
                        >
                          <template #icon>
                            <Icon name="heroicons:bookmark" size="sm" />
                          </template>
                        </ToggleButton>
                        <ToggleButton
                          v-for="saved in savedViews"
                          :key="saved.id"
                          :label="saved.name"
                          size="sm"
                          :is-pressed="activeSavedViewId === saved.id"
                          class="tf-chrome"
                          :class="activeSavedViewId === saved.id ? 'tf-value' : 'tf-empty tf-surface'"
                          @pressed-change="(next: boolean) => applySavedView(next ? saved : null)"
                        >
                          <template #icon>
                            <Icon name="heroicons:bookmark" size="sm" />
                          </template>
                        </ToggleButton>
                        <IconButton
                          v-if="activeSavedView != null"
                          label="Edit saved view"
                          tooltip="Edit saved view"
                          variant="ghost"
                          size="sm"
                          class="tf-saved-edit"
                          @click="startEditSavedView()"
                        >
                          <Icon name="heroicons:pencil-square" size="sm" />
                        </IconButton>
                      </HStack>
                    </StackItem>
                  </HStack>
                </StackItem>
                <StackItem v-else size="fill" class="tf-primary">
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
                            :is-pressed="isUpcoming"
                            label="Upcoming"
                            size="sm"
                            class="tf-chrome"
                            :class="isUpcoming ? 'tf-value' : 'tf-empty tf-surface'"
                            @pressed-change="togglePreset(UPCOMING_FILTER)"
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
                                  <HStack align="center" h-align="between">
                                    <Text type="supporting" color="secondary">
                                      {{ formatMoney(QUOTE_MIN) }}
                                    </Text>
                                    <Text type="supporting" color="secondary">
                                      {{ formatMoney(QUOTE_MAX) }}
                                    </Text>
                                  </HStack>
                                </VStack>
                                <Divider />
                                <HStack :gap="2" align="center" h-align="between">
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
                        <ToggleButton
                          :label="powerSearchLabel"
                          :tooltip="powerSearchLabel"
                          is-icon-only
                          size="sm"
                          :is-pressed="isPowerSearch"
                          @pressed-change="isPowerSearch = $event"
                        >
                          <template #icon>
                            <Icon :name="isPowerSearch ? 'heroicons:adjustments-horizontal-solid' : 'heroicons:adjustments-horizontal'" size="sm" />
                          </template>
                        </ToggleButton>
                        <Text type="supporting" color="secondary">
                          {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }}
                        </Text>
                        <template v-if="hasFilters">
                          <Text type="supporting" color="secondary">
                            •
                          </Text>
                          <Text type="supporting">
                            <Link color="primary" @click="clearAll">
                              Clear all
                            </Link>
                          </Text>
                        </template>
                      </HStack>
                    </StackItem>
                  </HStack>
                </StackItem>

                <HStack :gap="3" align="center" class="tf-end">
                  <ToggleButton
                    v-if="isPowerSearch"
                    :label="powerSearchLabel"
                    :tooltip="powerSearchLabel"
                    is-icon-only
                    size="sm"
                    :is-pressed="isPowerSearch"
                    @pressed-change="isPowerSearch = $event"
                  >
                    <template #icon>
                      <Icon name="heroicons:adjustments-horizontal-solid" size="sm" />
                    </template>
                  </ToggleButton>

                  <Popover
                    placement="below"
                    alignment="end"
                    :width="660"
                    label="View options"
                  >
                    <template #content>
                      <HStack :gap="0" class="tf-view-popover">
                        <Section variant="transparent" :padding="1" :dividers="['end']" class="tf-view-rail">
                          <VStack :gap="1">
                            <Button
                              v-for="section in VIEW_SECTIONS"
                              :key="section.key"
                              :label="section.label"
                              :variant="viewSection === section.key ? 'secondary' : 'ghost'"
                              class="tf-rail-item"
                              @click="viewSection = section.key"
                            >
                              <template #icon>
                                <Icon :name="section.icon" size="sm" />
                              </template>
                            </Button>
                          </VStack>
                        </Section>

                        <StackItem size="fill" class="tf-view-pane">
                          <VStack :gap="0" :padding="4" :padding-block-end="3">
                            <Heading :level="3">
                              {{ VIEW_SECTIONS.find(s => s.key === viewSection)?.title }}
                            </Heading>
                          </VStack>

                          <!-- Columns：两栏穿梭列表，拖动把手排序。 -->
                          <VStack v-if="viewSection === 'columns'" :gap="0" class="tf-transfer">
                            <HStack :gap="0" class="tf-transfer-panels">
                              <VStack :gap="0" class="tf-transfer-panel">
                                <HStack
                                  :gap="2"
                                  align="center"
                                  h-align="between"
                                  :padding-block="2"
                                  class="tf-transfer-head tf-transfer-pad-start"
                                >
                                  <Text type="label" color="secondary">
                                    Displayed columns
                                  </Text>
                                  <Button
                                    label="Restore"
                                    variant="ghost"
                                    size="sm"
                                    class="tf-transfer-head-action"
                                    @click="updateView(v => ({ ...v, columnKeys: [...DEFAULT_COLUMN_KEYS] }))"
                                  />
                                </HStack>
                                <VStack :gap="0" class="tf-transfer-body">
                                  <VStack
                                    v-if="displayedColumns.length === 0"
                                    :gap="0"
                                    align="center"
                                    h-align="center"
                                    :padding-block="4"
                                    class="tf-transfer-empty tf-transfer-pad-start"
                                  >
                                    <Text type="supporting" color="secondary">
                                      No columns are displayed.
                                    </Text>
                                  </VStack>
                                  <template v-else>
                                    <div
                                      v-for="key in displayedColumns"
                                      :key="key"
                                      :ref="columnRowRef(key)"
                                      class="tf-transfer-row tf-transfer-pad-start"
                                      :class="{ 'tf-transfer-row--drop': reorderDropKey === key }"
                                    >
                                      <IconButton
                                        :label="`Reorder ${COLUMN_LABELS[key]}`"
                                        variant="ghost"
                                        size="sm"
                                        class="tf-transfer-grip"
                                        @pointerdown="onGripPointerDown($event, key)"
                                        @pointermove="onGripPointerMove"
                                        @pointerup="onGripPointerUp"
                                        @pointercancel="onGripPointerUp"
                                      >
                                        <Icon name="heroicons:grip-vertical" size="sm" />
                                      </IconButton>
                                      <StackItem size="fill">
                                        <Text type="body">
                                          {{ COLUMN_LABELS[key] }}
                                        </Text>
                                      </StackItem>
                                      <IconButton
                                        :label="`Remove ${COLUMN_LABELS[key]}`"
                                        :tooltip="key === LOCKED_COLUMN_KEY ? LOCKED_COLUMN_MESSAGE : undefined"
                                        variant="ghost"
                                        size="sm"
                                        :is-disabled="key === LOCKED_COLUMN_KEY"
                                        class="tf-transfer-end-action"
                                        @click="updateView(v => ({ ...v, columnKeys: v.columnKeys.filter(k => k !== key) }))"
                                      >
                                        <Icon name="heroicons:x-mark" size="sm" />
                                      </IconButton>
                                    </div>
                                  </template>
                                </VStack>
                              </VStack>

                              <VStack :gap="0" class="tf-transfer-panel tf-transfer-panel--divider">
                                <HStack
                                  :gap="2"
                                  align="center"
                                  h-align="between"
                                  :padding-block="2"
                                  class="tf-transfer-head tf-transfer-pad-end"
                                >
                                  <Text type="label" color="secondary">
                                    Available columns
                                  </Text>
                                  <Button
                                    label="Select all"
                                    variant="ghost"
                                    size="sm"
                                    class="tf-transfer-head-action"
                                    :is-disabled="view.columnKeys.length === ALL_COLUMN_KEYS.length"
                                    @click="updateView(v => ({ ...v, columnKeys: [...v.columnKeys, ...ALL_COLUMN_KEYS.filter(k => !v.columnKeys.includes(k))] }))"
                                  />
                                </HStack>
                                <VStack :gap="0" class="tf-transfer-body">
                                  <VStack
                                    v-if="availableColumns.length === 0"
                                    :gap="0"
                                    align="center"
                                    h-align="center"
                                    :padding-block="4"
                                    class="tf-transfer-empty tf-transfer-pad-end"
                                  >
                                    <Text type="supporting" color="secondary">
                                      All columns are displayed.
                                    </Text>
                                  </VStack>
                                  <div
                                    v-for="key in availableColumns"
                                    :key="key"
                                    class="tf-transfer-row tf-transfer-pad-end"
                                  >
                                    <StackItem size="fill">
                                      <Text type="body">
                                        {{ COLUMN_LABELS[key] }}
                                      </Text>
                                    </StackItem>
                                    <IconButton
                                      :label="`Add ${COLUMN_LABELS[key]}`"
                                      variant="ghost"
                                      size="sm"
                                      class="tf-transfer-end-action"
                                      @click="updateView(v => ({ ...v, columnKeys: [...v.columnKeys, key] }))"
                                    >
                                      <Icon name="heroicons:plus" size="sm" />
                                    </IconButton>
                                  </div>
                                </VStack>
                              </VStack>
                            </HStack>
                          </VStack>

                          <VStack v-else-if="viewSection === 'density'" :gap="0" :padding-inline="4" :padding-block-end="4">
                            <RadioList v-model="view.density" label="Density" is-label-hidden>
                              <RadioListItem
                                v-for="option in DENSITY_OPTIONS"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                              />
                            </RadioList>
                          </VStack>

                          <VStack v-else-if="viewSection === 'sticky'" :gap="4" :padding-inline="4" :padding-block-end="4">
                            <RadioList v-model="view.stickyStart" label="First columns">
                              <RadioListItem
                                v-for="option in STICKY_START_OPTIONS"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                              />
                            </RadioList>
                            <RadioList v-model="view.stickyEnd" label="Last columns">
                              <RadioListItem
                                v-for="option in STICKY_END_OPTIONS"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                              />
                            </RadioList>
                          </VStack>

                          <VStack v-else :gap="0" :padding-inline="4" :padding-block-end="4">
                            <RadioList v-model="view.grouping" label="Grouping" is-label-hidden>
                              <RadioListItem
                                v-for="option in GROUPING_OPTIONS"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                              />
                            </RadioList>
                          </VStack>
                        </StackItem>
                      </HStack>
                    </template>
                    <Button label="View options" variant="ghost" size="sm">
                      <template #end>
                        <Icon name="heroicons:chevron-down" size="sm" />
                      </template>
                    </Button>
                  </Popover>

                  <template v-if="!isSavedViewsBarOpen">
                    <IconButton
                      label="Create saved view"
                      tooltip="Create saved view"
                      variant="ghost"
                      size="sm"
                      @click="creatingName = ''"
                    >
                      <Icon name="heroicons:bookmark" size="sm" />
                    </IconButton>
                  </template>

                  <ToggleButton
                    label="Saved views"
                    tooltip="Saved views"
                    is-icon-only
                    size="sm"
                    :is-pressed="isSavedViewsBarOpen"
                    @pressed-change="onSavedViewsToggle"
                  >
                    <template #icon>
                      <Icon name="heroicons:bookmark" size="sm" />
                    </template>
                    <template #pressedIcon>
                      <Icon name="heroicons:bookmark-solid" size="sm" />
                    </template>
                  </ToggleButton>
                </HStack>
              </HStack>
            </VStack>
          </Section>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="4" label="Service jobs">
      <EmptyState
        v-if="results.length === 0"
        title="No jobs match these filters"
        description="Try clearing a filter, or switch to power search to build a broader query."
      >
        <template #icon>
          <Icon name="heroicons:magnifying-glass" size="lg" />
        </template>
        <template #actions>
          <Button label="Clear all" @click="clearAll" />
          <Button label="Power search" variant="secondary" @click="isPowerSearch = true" />
        </template>
      </EmptyState>

      <template v-else>
        <Table
          :data="tableRows"
          :columns="columns"
          :id-key="tableIdKey"
          :density="view.density"
          dividers="rows"
          has-hover
          text-overflow="wrap"
          vertical-align="top"
          :row-count="results.length"
          :plugins="tablePlugins"
        />

        <div v-if="hasNext" ref="sentinelRef" class="tf-sentinel">
          <div v-if="isLoadingNext" class="tf-skeleton" role="status" aria-label="Loading more jobs">
            <div
              v-for="row in SKELETON_ROWS"
              :key="row"
              class="tf-skeleton-row"
              :style="{ paddingInline: `${DENSITY_PADDING[view.density]}px` }"
            >
              <div class="tf-skeleton-cell tf-skeleton-cell--select">
                <Skeleton :width="16" :height="16" :radius="1" :index="row" />
              </div>
              <div
                v-for="(key, index) in view.columnKeys"
                :key="key"
                class="tf-skeleton-cell"
                :style="skeletonCellStyle(key)"
              >
                <VStack v-if="key === 'summary' && view.density !== 'compact'" :gap="2">
                  <Skeleton :height="14" :index="row * 4 + index" />
                  <Skeleton width="40%" :height="11" :index="row * 4 + index + 1" />
                </VStack>
                <Skeleton v-else :height="12" :index="row * 4 + index" />
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="results.length > PAGE_SIZE" class="tf-loaded">
          <Text type="supporting" color="secondary">
            All {{ results.length }} jobs loaded
          </Text>
        </div>
      </template>
    </LayoutContent>
  </Layout>

  <!-- 创建保存视图 -->
  <Dialog :is-open="creatingName != null" purpose="form" :width="400" @open-change="creatingName = $event ? '' : null">
    <DialogHeader
      title="Create new saved view"
      subtitle="Captures the filters and the table configuration as they are now."
      has-divider
      @open-change="creatingName = $event ? '' : null"
    />
    <Section variant="transparent" :padding="4">
      <VStack :gap="4">
        <TextInput :model-value="creatingName ?? ''" label="Name" has-auto-focus @update:model-value="creatingName = $event" />
        <VStack :gap="1">
          <Text type="label">
            This view saves
          </Text>
          <MetadataList columns="single" :label="{ position: 'start', width: 104 }">
            <MetadataListItem label="Filters">
              <Text v-if="filters.length === 0" type="body">
                None
              </Text>
              <HStack v-else :gap="1" wrap="wrap">
                <Token
                  v-for="(filter, index) in filters"
                  :key="`${filter.field}-${filter.operator}-${index}`"
                  :label="filterTokenLabel(filter)"
                  :description="`${filter.field} ${filter.operator} ${filterValueText(filter)}`"
                  size="sm"
                />
              </HStack>
            </MetadataListItem>
            <MetadataListItem label="Columns">
              <Text type="body">
                {{ view.columnKeys.length }} of {{ ALL_COLUMN_KEYS.length }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Density">
              <Text type="body">
                {{ labelOf(DENSITY_OPTIONS, view.density) }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Grouping">
              <Text type="body">
                {{ labelOf(GROUPING_OPTIONS, view.grouping) }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Frozen start">
              <Text type="body">
                {{ labelOf(STICKY_START_OPTIONS, view.stickyStart) }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Frozen end">
              <Text type="body">
                {{ labelOf(STICKY_END_OPTIONS, view.stickyEnd) }}
              </Text>
            </MetadataListItem>
          </MetadataList>
        </VStack>
        <HStack h-align="end">
          <Button
            label="Create"
            variant="primary"
            :is-disabled="(creatingName ?? '').trim() === ''"
            @click="createSavedView(creatingName ?? '')"
          />
        </HStack>
      </VStack>
    </Section>
  </Dialog>

  <!-- 编辑保存视图（只改名，配置是保存时定格的） -->
  <Dialog :is-open="editing != null" purpose="form" :width="400" @open-change="!$event && (editing = null)">
    <DialogHeader
      title="Edit saved view"
      subtitle="Renaming only. The configuration is what was captured when the view was saved."
      has-divider
      @open-change="!$event && (editing = null)"
    />
    <Section v-if="editing != null" variant="transparent" :padding="4">
      <VStack :gap="4">
        <TextInput v-model="editing.name" label="Name" />
        <VStack :gap="1">
          <Text type="label">
            This view saves
          </Text>
          <MetadataList columns="single" :label="{ position: 'start', width: 104 }">
            <MetadataListItem label="Filters">
              <Text v-if="editing.filters.length === 0" type="body">
                None
              </Text>
              <HStack v-else :gap="1" wrap="wrap">
                <Token
                  v-for="(filter, index) in editing.filters"
                  :key="`${filter.field}-${filter.operator}-${index}`"
                  :label="filterTokenLabel(filter)"
                  :description="`${filter.field} ${filter.operator} ${filterValueText(filter)}`"
                  size="sm"
                />
              </HStack>
            </MetadataListItem>
            <MetadataListItem label="Columns">
              <Text type="body">
                {{ editing.view.columnKeys.length }} of {{ ALL_COLUMN_KEYS.length }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Density">
              <Text type="body">
                {{ labelOf(DENSITY_OPTIONS, editing.view.density) }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Grouping">
              <Text type="body">
                {{ labelOf(GROUPING_OPTIONS, editing.view.grouping) }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Frozen start">
              <Text type="body">
                {{ labelOf(STICKY_START_OPTIONS, editing.view.stickyStart) }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Frozen end">
              <Text type="body">
                {{ labelOf(STICKY_END_OPTIONS, editing.view.stickyEnd) }}
              </Text>
            </MetadataListItem>
          </MetadataList>
        </VStack>
        <HStack :gap="2" align="center">
          <Button label="Delete" variant="destructive" @click="deleteSavedView(editing.id)" />
          <StackItem size="fill">
            <HStack h-align="end">
              <Button label="Save" variant="primary" @click="saveEditedView(editing)" />
            </HStack>
          </StackItem>
        </HStack>
      </VStack>
    </Section>
  </Dialog>
</template>

<style scoped>
.tf-shell {
  background: var(--astryx-color-background-surface);
}

.tf-progress {
  position: absolute;
  inset-inline: 0;
  inset-block-start: 0;
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

/* 批量操作条：弱化底、上下 6px 内边距。 */
.tf-bulk {
  border-radius: var(--astryx-radius-element);
}

/* 保存视图条：标签留在滚动区外，chips 横向滚动。 */
.tf-saved-bar {
  min-width: 0;
}

.tf-saved-label {
  flex-shrink: 0;
}

.tf-saved-slot {
  min-width: 0;
}

.tf-saved-scroller {
  overflow-x: auto;
}

/* 视图选项弹层：左侧栏 + 右侧面板。 */
.tf-view-popover {
  min-height: 280px;
}

.tf-view-rail {
  flex-shrink: 0;
}

.tf-rail-item {
  justify-content: start;
  width: 100%;
}

.tf-view-pane {
  min-width: 0;
}

.tf-transfer {
  min-height: 0;
}

.tf-transfer-panels {
  min-height: 0;
}

.tf-transfer-panel {
  flex: 1 1 0;
  min-width: 0;
}

.tf-transfer-panel--divider {
  border-inline-start: var(--astryx-border-width) solid var(--astryx-color-border);
}

.tf-transfer-head {
  padding-inline: 16px;
}

.tf-transfer-pad-end {
  padding-inline: 16px;
}

.tf-transfer-head-action {
  flex-shrink: 0;
}

.tf-transfer-body {
  min-height: 120px;
}

.tf-transfer-empty {
  flex: 1;
}

.tf-transfer-row {
  display: flex;
  gap: var(--astryx-spacing-1);
  align-items: center;
  min-height: 32px;
}

.tf-transfer-row--drop {
  box-shadow: inset 0 2px 0 0 var(--astryx-color-accent);
}

.tf-transfer-grip {
  cursor: grab;
  touch-action: none;
}

.tf-transfer-end-action {
  flex-shrink: 0;
}

/* 详情面板：分区自带 16px  gutter，分隔线拉满宽。 */
.tf-detail {
  height: 100%;
  overflow-y: auto;
}

.tf-history-row {
  display: flex;
  gap: var(--astryx-spacing-2);
  align-items: center;
  width: 100%;
  padding: var(--astryx-spacing-2);
  font: inherit;
  text-align: start;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--astryx-radius-element);
}

.tf-history-row:hover {
  background-color: var(--astryx-color-overlay-hover);
}

/* 无限加载：哨兵给足高度，骨架行按列宽铺满。 */
.tf-sentinel {
  min-height: 56px;
}

.tf-skeleton-row {
  display: flex;
  gap: 0;
  align-items: center;
}

.tf-skeleton-cell {
  display: flex;
  align-items: center;
  min-width: 0;
  padding-block: 14px;
}

.tf-skeleton-cell--select {
  width: 48px;
  flex-shrink: 0;
  justify-content: center;
}

.tf-loaded {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

/* 整行可点。 */
.tf-row {
  cursor: pointer;
}
</style>
