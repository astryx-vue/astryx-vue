<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  MetadataList,
  MetadataListItem,
  pixel,
  proportional,
  ResizeHandle,
  Selector,
  StackItem,
  StatusDot,
  Table,
  Text,
  TextInput,
  Token,
  useResizable,
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

interface ServiceJob extends Record<string, unknown> {
  id: string
  summary: string
  customer: string
  address: string
  technician: string
  status: JobStatus
  priority: Priority
  scheduledAt: string
  quoted: number
  equipment: string
}

const STATUS_META: Record<JobStatus, { label: string, badge: 'neutral' | 'blue' | 'teal' | 'green' | 'red' }> = {
  scheduled: { label: 'Scheduled', badge: 'blue' },
  in_progress: { label: 'In progress', badge: 'teal' },
  on_hold: { label: 'On hold', badge: 'neutral' },
  overdue: { label: 'Overdue', badge: 'red' },
  completed: { label: 'Completed', badge: 'green' },
}

const PRIORITY_META: Record<Priority, { label: string, dot: 'neutral' | 'warning' | 'error' }> = {
  urgent: { label: 'Urgent', dot: 'error' },
  high: { label: 'High', dot: 'warning' },
  normal: { label: 'Normal', dot: 'neutral' },
}

const JOBS: ServiceJob[] = [
  { id: 'SJ-2148', summary: 'No cooling — rooftop unit 3', customer: 'Harborview Grand Hotel', address: '1200 Harbor Blvd, Bayside', technician: 'Luis Camarena', status: 'in_progress', priority: 'urgent', scheduledAt: '2026-07-02T08:00:00Z', quoted: 1480, equipment: 'Trane RTU-3, 25-ton (2019)' },
  { id: 'SJ-2147', summary: 'Quarterly preventive maintenance', customer: 'Northgate Dental Group', address: '88 Northgate Mall, Suite 210', technician: 'Dana Whitfield', status: 'scheduled', priority: 'normal', scheduledAt: '2026-07-02T10:30:00Z', quoted: 420, equipment: 'Carrier split system, 5-ton' },
  { id: 'SJ-2146', summary: 'Walk-in freezer overshooting setpoint', customer: 'Beacon Street Bistro', address: '412 Beacon St', technician: 'Marcus Osei', status: 'on_hold', priority: 'high', scheduledAt: '2026-07-01T13:00:00Z', quoted: 2150, equipment: 'Kolpak walk-in, Copeland compressor' },
  { id: 'SJ-2144', summary: 'Boiler pilot fails to stay lit', customer: 'Elm & 5th Lofts', address: '501 Elm St', technician: 'Luis Camarena', status: 'overdue', priority: 'high', scheduledAt: '2026-07-01T09:00:00Z', quoted: 760, equipment: 'Weil-McLain CGa boiler (2011)' },
  { id: 'SJ-2141', summary: 'Emergency steam leak, basement', customer: 'Elm & 5th Lofts', address: '501 Elm St', technician: 'Priya Raman', status: 'in_progress', priority: 'urgent', scheduledAt: '2026-07-01T06:00:00Z', quoted: 3200, equipment: 'Weil-McLain CGa boiler (2011)' },
  { id: 'SJ-2139', summary: 'Ice machine not producing', customer: 'Beacon Street Bistro', address: '412 Beacon St', technician: 'Luis Camarena', status: 'overdue', priority: 'urgent', scheduledAt: '2026-06-30T11:00:00Z', quoted: 680, equipment: 'Hoshizaki KM-660, air cooled' },
  { id: 'SJ-2137', summary: 'Chiller low refrigerant alarm', customer: 'Summit Medical Plaza', address: '77 Summit Ridge Rd', technician: 'Marcus Osei', status: 'in_progress', priority: 'urgent', scheduledAt: '2026-07-01T08:30:00Z', quoted: 4100, equipment: 'Daikin air-cooled chiller, 80-ton' },
  { id: 'SJ-2101', summary: 'Compressor contactor replacement', customer: 'Harborview Grand Hotel', address: '1200 Harbor Blvd, Bayside', technician: 'Marcus Osei', status: 'completed', priority: 'high', scheduledAt: '2026-06-24T09:00:00Z', quoted: 640, equipment: 'Trane RTU-3, 25-ton (2019)' },
]

const CUSTOMERS = Array.from(new Set(JOBS.map(j => j.customer))).sort()

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatScheduled(iso: string): string {
  const d = new Date(iso)
  const hours = d.getUTCHours()
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')
  const suffix = hours < 12 ? 'am' : 'pm'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${hour12}:${minutes}${suffix}`
}

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

const query = ref('')
const statusFilter = ref<string | null>(null)
const priorityFilter = ref<string | null>(null)
const customerFilter = ref<string | null>(null)
const activeJobId = ref<string | null>(null)
const selectedKeys = ref(new Set<string>())

const detailWidth = useResizable({
  defaultSize: 380,
  minSize: 320,
  maxSize: 560,
})

const visible = computed(() => {
  let rows = JOBS
  const q = query.value.trim().toLowerCase()
  if (q) {
    rows = rows.filter(
      j =>
        j.summary.toLowerCase().includes(q)
        || j.customer.toLowerCase().includes(q)
        || j.id.toLowerCase().includes(q),
    )
  }
  if (statusFilter.value)
    rows = rows.filter(j => j.status === statusFilter.value)
  if (priorityFilter.value)
    rows = rows.filter(j => j.priority === priorityFilter.value)
  if (customerFilter.value)
    rows = rows.filter(j => j.customer === customerFilter.value)
  return rows
})

const activeJob = computed(() => JOBS.find(j => j.id === activeJobId.value) ?? null)

const columns: TableColumn<ServiceJob>[] = [
  {
    key: 'priority',
    header: '',
    width: pixel(36),
    renderCell: item => h(StatusDot, { variant: PRIORITY_META[item.priority].dot, label: PRIORITY_META[item.priority].label }),
  },
  {
    key: 'summary',
    header: 'Summary',
    width: proportional(2),
    sortable: { compare: (a, b) => a.summary.localeCompare(b.summary) },
    renderCell: item => h(VStack, {
      gap: 0,
      style: { cursor: 'pointer' },
      onClick: () => openJob(item),
    }, () => [
      h(Text, { weight: 'semibold', maxLines: 1 }, () => item.summary),
      h(Text, { type: 'supporting', color: 'secondary', maxLines: 1 }, () => `${item.id} · ${item.customer}`),
    ]),
  },
  {
    key: 'status',
    header: 'Status',
    width: pixel(120),
    sortable: { compare: (a, b) => a.status.localeCompare(b.status) },
    renderCell: item => h(Badge, { variant: STATUS_META[item.status].badge, label: STATUS_META[item.status].label }),
  },
  {
    key: 'technician',
    header: 'Technician',
    width: pixel(160),
    sortable: { compare: (a, b) => a.technician.localeCompare(b.technician) },
    renderCell: item => h(HStack, { gap: 2, vAlign: 'center' }, () => [
      h(Avatar, { name: item.technician, size: 'sm' }),
      h(Text, { maxLines: 1 }, () => item.technician),
    ]),
  },
  {
    key: 'scheduled',
    header: 'Scheduled',
    width: pixel(140),
    sortable: { sortKey: 'scheduledAt', compare: (a, b) => a.scheduledAt.localeCompare(b.scheduledAt) },
    renderCell: item => h(Text, { color: 'secondary', hasTabularNumbers: true }, () => formatScheduled(item.scheduledAt)),
  },
  {
    key: 'quoted',
    header: 'Quote',
    width: pixel(100),
    align: 'end',
    sortable: { compare: (a, b) => a.quoted - b.quoted },
    renderCell: item => h(Text, { hasTabularNumbers: true }, () => formatMoney(item.quoted)),
  },
]

const { sortedData, sortConfig } = useTableSortableState<ServiceJob>({ data: visible, columns })
const sortPlugin = useTableSortable<ServiceJob>(sortConfig)

const { selectionConfig } = useTableSelectionState<ServiceJob>({
  data: sortedData,
  idKey: 'id',
  selectedKeys,
  setSelectedKeys(keys) {
    selectedKeys.value = keys
  },
  hasRowHighlight: false,
})
const selectionPlugin = useTableSelection<ServiceJob>(selectionConfig)

function openJob(job: ServiceJob): void {
  activeJobId.value = job.id
}

function clearFilters(): void {
  statusFilter.value = null
  priorityFilter.value = null
  customerFilter.value = null
  query.value = ''
}

const filterChips = computed(() => [
  statusFilter.value ? { key: 'status', label: `Status is ${STATUS_META[statusFilter.value as JobStatus].label}` } : null,
  priorityFilter.value ? { key: 'priority', label: `Priority is ${PRIORITY_META[priorityFilter.value as Priority].label}` } : null,
  customerFilter.value ? { key: 'customer', label: `Customer is ${customerFilter.value}` } : null,
].filter(Boolean) as { key: string, label: string }[])
</script>

<template>
  <Layout height="fill" :content-width="1200">
    <template #header>
      <LayoutHeader has-divider :padding="4">
        <VStack :gap="4">
          <HStack :gap="3" align="center">
            <StackItem size="fill">
              <Heading :level="1">
                Service jobs
              </Heading>
              <Text type="supporting" color="secondary">
                Field dispatch queue with filter chips and detail panel
              </Text>
            </StackItem>
            <Button label="New job" variant="primary" />
          </HStack>

          <HStack :gap="2" align="center" wrap="wrap">
            <VStack :width="220">
              <Selector
                v-model="statusFilter"
                label="Status"
                placeholder="Status"
                :options="Object.entries(STATUS_META).map(([value, meta]) => ({ value, label: meta.label }))"
                has-clear
              />
            </VStack>
            <VStack :width="180">
              <Selector
                v-model="priorityFilter"
                label="Priority"
                placeholder="Priority"
                :options="Object.entries(PRIORITY_META).map(([value, meta]) => ({ value, label: meta.label }))"
                has-clear
              />
            </VStack>
            <VStack :width="240">
              <Selector
                v-model="customerFilter"
                label="Customer"
                placeholder="Customer"
                :options="CUSTOMERS.map(c => ({ value: c, label: c }))"
                has-clear
              />
            </VStack>
            <StackItem size="fill">
              <TextInput
                v-model="query"
                label="Search"
                is-label-hidden
                placeholder="Search jobs…"
              />
            </StackItem>
          </HStack>

          <HStack v-if="filterChips.length > 0" :gap="2" align="center" wrap="wrap">
            <Token
              v-for="chip in filterChips"
              :key="chip.key"
              size="sm"
              :label="chip.label"
              @click="chip.key === 'status' ? statusFilter = null : chip.key === 'priority' ? priorityFilter = null : customerFilter = null"
            />
            <Button label="Clear all" variant="ghost" size="sm" @click="clearFilters" />
            <Text type="supporting" color="secondary">
              {{ visible.length }} job{{ visible.length === 1 ? '' : 's' }}
            </Text>
          </HStack>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="0">
      <Table
        :data="sortedData"
        :columns="columns"
        id-key="id"
        density="balanced"
        dividers="rows"
        has-hover
        text-overflow="truncate"
        :plugins="{ sort: sortPlugin, selection: selectionPlugin }"
      />
    </LayoutContent>

    <template v-if="activeJob" #end>
      <ResizeHandle :resizable="detailWidth.props" is-reversed :is-always-visible="false" />
      <LayoutPanel
        has-divider
        :resizable="detailWidth.props"
        :padding="4"
        role="complementary"
        label="Job details"
      >
        <VStack :gap="4">
          <HStack :gap="2" align="center">
            <StackItem size="fill">
              <Badge :variant="STATUS_META[activeJob.status].badge" :label="STATUS_META[activeJob.status].label" />
            </StackItem>
            <Button label="Close" variant="ghost" size="sm" is-icon-only @click="activeJobId = null">
              <template #icon>
                <Icon icon="i-heroicons-x-mark" size="sm" />
              </template>
            </Button>
          </HStack>
          <Heading :level="3">
            {{ activeJob.summary }}
          </Heading>
          <Text type="supporting" color="secondary">
            {{ activeJob.id }}
          </Text>
          <MetadataList :label="{ position: 'top' }">
            <MetadataListItem label="Customer">
              {{ activeJob.customer }}
            </MetadataListItem>
            <MetadataListItem label="Address">
              {{ activeJob.address }}
            </MetadataListItem>
            <MetadataListItem label="Technician">
              <HStack :gap="2" align="center">
                <Avatar :name="activeJob.technician" size="sm" />
                <Text>{{ activeJob.technician }}</Text>
              </HStack>
            </MetadataListItem>
            <MetadataListItem label="Scheduled">
              {{ formatScheduled(activeJob.scheduledAt) }}
            </MetadataListItem>
            <MetadataListItem label="Quote">
              {{ formatMoney(activeJob.quoted) }}
            </MetadataListItem>
            <MetadataListItem label="Equipment">
              {{ activeJob.equipment }}
            </MetadataListItem>
          </MetadataList>
          <Button label="Dispatch technician" variant="primary" />
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>
