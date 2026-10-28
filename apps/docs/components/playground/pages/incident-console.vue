<script setup lang="ts">
import type { PowerSearchFilter } from '@astryx-vue/core'
import {
  Button,
  Divider,
  EmptyState,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  List,
  ListItem,
  MetadataList,
  MetadataListItem,
  PowerSearch,
  ResizeHandle,
  SegmentedControl,
  SegmentedControlItem,
  StackItem,
  StatusDot,
  Text,
  Timestamp,
  Token,
  useMediaQuery,
  usePowerSearchConfig,
  useResizable,
  VStack,
} from '@astryx-vue/core'
import { computed, ref } from 'vue'

type Severity = 'sev1' | 'sev2' | 'sev3'
type Status = 'investigating' | 'mitigated' | 'resolved'

interface TimelineEvent {
  at: string
  label: string
  detail: string
}

interface Incident extends Record<string, unknown> {
  id: string
  title: string
  service: string
  severity: Severity
  status: Status
  commander: string
  startedAt: string
  impact: string
  timeline: TimelineEvent[]
}

const INCIDENTS: Incident[] = [
  {
    id: 'INC-2417',
    title: 'Checkout API elevated 5xx rate',
    service: 'checkout-api',
    severity: 'sev1',
    status: 'investigating',
    commander: 'Priya Raman',
    startedAt: '2026-06-30T21:14:00Z',
    impact: '12% of checkout requests failing in us-east',
    timeline: [
      { at: '2026-06-30T21:14:00Z', label: 'Incident declared', detail: 'Paging monitor: checkout-api 5xx > 5% for 10m' },
      { at: '2026-06-30T21:19:00Z', label: 'Commander assigned', detail: 'Priya Raman took command' },
      { at: '2026-06-30T21:31:00Z', label: 'Suspect identified', detail: 'Deploy 8f31c2 correlates with error onset' },
    ],
  },
  {
    id: 'INC-2416',
    title: 'Search indexing lag above 30 minutes',
    service: 'search-indexer',
    severity: 'sev2',
    status: 'investigating',
    commander: 'Marcus Webb',
    startedAt: '2026-06-30T19:42:00Z',
    impact: 'New listings not searchable; stale results served',
    timeline: [
      { at: '2026-06-30T19:42:00Z', label: 'Incident declared', detail: 'Indexing lag alarm crossed 30m threshold' },
      { at: '2026-06-30T20:05:00Z', label: 'Mitigation attempted', detail: 'Doubled indexer worker pool; lag still climbing' },
    ],
  },
  {
    id: 'INC-2415',
    title: 'Webhook delivery retries exhausting queue',
    service: 'webhooks',
    severity: 'sev3',
    status: 'investigating',
    commander: 'Ana Duarte',
    startedAt: '2026-06-30T18:20:00Z',
    impact: 'Third-party webhook delivery delayed up to 15m',
    timeline: [
      { at: '2026-06-30T18:20:00Z', label: 'Incident declared', detail: 'Queue depth alarm on webhook-delivery' },
    ],
  },
  {
    id: 'INC-2414',
    title: 'Payments settlement job stalled',
    service: 'payments',
    severity: 'sev1',
    status: 'mitigated',
    commander: 'Priya Raman',
    startedAt: '2026-06-30T14:03:00Z',
    impact: 'Settlement batch delayed; no customer-visible impact',
    timeline: [
      { at: '2026-06-30T14:03:00Z', label: 'Incident declared', detail: 'Settlement job heartbeat missed twice' },
      { at: '2026-06-30T14:26:00Z', label: 'Mitigated', detail: 'Job restarted on standby worker; batch draining' },
    ],
  },
  {
    id: 'INC-2413',
    title: 'CDN cache hit ratio degraded in eu-west',
    service: 'edge-cdn',
    severity: 'sev2',
    status: 'mitigated',
    commander: 'Tom Okafor',
    startedAt: '2026-06-30T11:47:00Z',
    impact: 'Origin load 3x baseline; p95 latency +180ms in EU',
    timeline: [
      { at: '2026-06-30T11:47:00Z', label: 'Incident declared', detail: 'Cache hit ratio dropped below 80%' },
      { at: '2026-06-30T12:12:00Z', label: 'Mitigated', detail: 'Rolled back cache-key config change' },
    ],
  },
  {
    id: 'INC-2412',
    title: 'Login rate limiting misfiring for SSO users',
    service: 'auth',
    severity: 'sev2',
    status: 'resolved',
    commander: 'Ana Duarte',
    startedAt: '2026-06-29T22:31:00Z',
    impact: 'SSO users intermittently blocked at login',
    timeline: [
      { at: '2026-06-29T22:31:00Z', label: 'Incident declared', detail: 'Support surge: SSO login failures' },
      { at: '2026-06-29T23:02:00Z', label: 'Mitigated', detail: 'Raised limiter threshold for SSO IdP ranges' },
      { at: '2026-06-30T09:15:00Z', label: 'Resolved', detail: 'Limiter keying fixed to per-user; monitors green 8h' },
    ],
  },
  {
    id: 'INC-2411',
    title: 'Notification digests sent twice',
    service: 'notifications',
    severity: 'sev3',
    status: 'resolved',
    commander: 'Marcus Webb',
    startedAt: '2026-06-29T08:12:00Z',
    impact: 'Duplicate daily digest for ~40k users',
    timeline: [
      { at: '2026-06-29T08:12:00Z', label: 'Incident declared', detail: 'Duplicate-send reports from support' },
      { at: '2026-06-29T10:40:00Z', label: 'Resolved', detail: 'Dedup key restored in scheduler; backfill verified' },
    ],
  },
]

const STATUS_ORDER: Status[] = ['investigating', 'mitigated', 'resolved']

const STATUS_LABEL: Record<Status, string> = {
  investigating: 'Investigating',
  mitigated: 'Mitigated',
  resolved: 'Resolved',
}

const STATUS_TOKEN_COLOR: Record<Status, 'red' | 'yellow' | 'green'> = {
  investigating: 'red',
  mitigated: 'yellow',
  resolved: 'green',
}

const SEVERITY_DOT: Record<Severity, 'error' | 'warning' | 'neutral'> = {
  sev1: 'error',
  sev2: 'warning',
  sev3: 'neutral',
}

const SERVICE_VALUES = [
  { value: 'checkout-api', label: 'checkout-api' },
  { value: 'search-indexer', label: 'search-indexer' },
  { value: 'webhooks', label: 'webhooks' },
  { value: 'payments', label: 'payments' },
  { value: 'edge-cdn', label: 'edge-cdn' },
  { value: 'auth', label: 'auth' },
  { value: 'notifications', label: 'notifications' },
]

const SEVERITY_VALUES = [
  { value: 'sev1', label: 'SEV1' },
  { value: 'sev2', label: 'SEV2' },
  { value: 'sev3', label: 'SEV3' },
]

const FIELD_DEFINITIONS = [
  { key: 'title', type: 'string', label: 'Title' },
  { key: 'service', type: 'enum', label: 'Service', enumValues: SERVICE_VALUES },
  { key: 'severity', type: 'enum', label: 'Severity', enumValues: SEVERITY_VALUES },
  { key: 'commander', type: 'string', label: 'Commander' },
] as const

const statusFilter = ref('all')
const filters = ref<PowerSearchFilter[]>([])
const selectedId = ref<string | null>(INCIDENTS[0].id)
const { config, applyFilters } = usePowerSearchConfig(FIELD_DEFINITIONS, 'Incidents')

// 窄屏藏掉右侧详情，让密集的行保持满宽。
const isNarrow = useMediaQuery('(max-width: 1024px)')

const inspector = useResizable({ defaultSize: 380, minSize: 320, maxSize: 480 })

const visible = computed(() => {
  const searched = applyFilters(filters.value, INCIDENTS)
  return statusFilter.value === 'all'
    ? searched
    : searched.filter(incident => incident.status === statusFilter.value)
})

const groups = computed(() => STATUS_ORDER
  .map(status => ({ status, items: visible.value.filter(incident => incident.status === status) }))
  .filter(group => group.items.length > 0))

const selected = computed(() => visible.value.find(incident => incident.id === selectedId.value) ?? null)
const openCount = computed(() => INCIDENTS.filter(incident => incident.status === 'investigating').length)

function nextAction(status: Status): string {
  if (status === 'investigating')
    return 'Mark mitigated'
  return status === 'mitigated' ? 'Resolve' : 'Reopen'
}
</script>

<template>
  <Layout height="fill">
    <template #header>
      <LayoutHeader has-divider>
        <HStack :gap="3" align="center">
          <StackItem size="fill">
            <HStack :gap="2" align="center">
              <Heading :level="1">
                Incidents
              </Heading>
              <Text type="supporting" color="secondary">
                {{ openCount }} investigating
              </Text>
            </HStack>
          </StackItem>
          <SegmentedControl v-model="statusFilter" label="Filter by status" size="sm">
            <SegmentedControlItem label="All" value="all" />
            <SegmentedControlItem label="Investigating" value="investigating" />
            <SegmentedControlItem label="Mitigated" value="mitigated" />
            <SegmentedControlItem label="Resolved" value="resolved" />
          </SegmentedControl>
          <Button label="Declare incident" size="sm">
            <template #icon>
              <Icon icon="i-heroicons-plus" size="sm" />
            </template>
          </Button>
        </HStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="0">
      <VStack class="incident-content" :gap="0">
        <HStack class="incident-search">
          <StackItem size="fill">
            <PowerSearch
              :config="config"
              :filters="filters"
              placeholder="Search incidents..."
              :result-count="visible.length"
              @update:filters="value => { filters = value }"
            />
          </StackItem>
        </HStack>
        <VStack class="incident-rows" is-scrollable :gap="0">
          <EmptyState
            v-if="groups.length === 0"
            title="No matching incidents"
            description="Adjust the status filter or clear search filters."
          >
            <template #icon>
              <Icon icon="i-heroicons-bell-alert" size="lg" />
            </template>
          </EmptyState>
          <template v-for="group in groups" :key="group.status">
            <HStack :gap="2" align="center" class="incident-group-header">
              <Text type="label" color="secondary">
                {{ STATUS_LABEL[group.status] }}
              </Text>
              <Text type="supporting" color="secondary">
                {{ group.items.length }}
              </Text>
            </HStack>
            <List density="compact" has-dividers>
              <ListItem
                v-for="incident in group.items"
                :key="incident.id"
                :label="incident.title"
                :description="`${incident.id} · ${incident.service} · ${incident.impact}`"
                :is-selected="incident.id === selected?.id"
                @click="selectedId = incident.id"
              >
                <template #startContent>
                  <StatusDot
                    :variant="SEVERITY_DOT[incident.severity]"
                    :label="incident.severity.toUpperCase()"
                    :is-pulsing="incident.severity === 'sev1' && incident.status === 'investigating'"
                  />
                </template>
                <template #endContent>
                  <HStack :gap="3" align="center">
                    <Token
                      size="sm"
                      :color="STATUS_TOKEN_COLOR[incident.status]"
                      :label="STATUS_LABEL[incident.status]"
                    />
                    <Timestamp :value="incident.startedAt" format="relative" color="secondary" />
                  </HStack>
                </template>
              </ListItem>
            </List>
          </template>
        </VStack>
      </VStack>
    </LayoutContent>

    <template v-if="!isNarrow" #end>
      <ResizeHandle
        direction="horizontal"
        has-divider
        :is-always-visible="false"
        :resizable="inspector.props"
        label="Resize inspector"
      />
      <LayoutPanel :width="inspector.size" :padding="0" label="Incident details">
        <VStack v-if="selected" :gap="4" class="incident-inspector">
          <VStack :gap="2">
            <HStack :gap="2" align="center">
              <StatusDot :variant="SEVERITY_DOT[selected.severity]" :label="selected.severity.toUpperCase()" />
              <Text type="supporting" color="secondary">
                {{ selected.id }}
              </Text>
              <Token
                size="sm"
                :color="STATUS_TOKEN_COLOR[selected.status]"
                :label="STATUS_LABEL[selected.status]"
              />
            </HStack>
            <Heading :level="2">
              {{ selected.title }}
            </Heading>
          </VStack>

          <HStack :gap="2">
            <Button :label="nextAction(selected.status)" size="sm" />
            <Button label="Escalate" variant="secondary" size="sm" />
          </HStack>

          <Divider />

          <MetadataList columns="single" :label="{ position: 'start', width: 96 }">
            <MetadataListItem label="Service">
              <Text type="body">
                {{ selected.service }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Severity">
              <Text type="body">
                {{ selected.severity.toUpperCase() }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Commander">
              <Text type="body">
                {{ selected.commander }}
              </Text>
            </MetadataListItem>
            <MetadataListItem label="Started">
              <Timestamp :value="selected.startedAt" format="date_time" />
            </MetadataListItem>
            <MetadataListItem label="Impact">
              <Text type="body">
                {{ selected.impact }}
              </Text>
            </MetadataListItem>
          </MetadataList>

          <Divider />

          <VStack :gap="2">
            <Heading :level="3">
              Timeline
            </Heading>
            <List density="compact">
              <ListItem
                v-for="event in selected.timeline"
                :key="`${event.at}-${event.label}`"
                :label="event.label"
                :description="event.detail"
              >
                <template #endContent>
                  <Timestamp :value="event.at" format="time" color="secondary" />
                </template>
              </ListItem>
            </List>
          </VStack>
        </VStack>
        <EmptyState
          v-else
          title="No incident selected"
          description="Select an incident to see details and timeline."
          is-compact
        >
          <template #icon>
            <Icon icon="i-heroicons-bell-alert" size="lg" />
          </template>
        </EmptyState>
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style>
.incident-content {
  height: 100%;
  min-height: 0;
}
.incident-search {
  padding: var(--astryx-spacing-3);
}
.incident-rows {
  min-height: 0;
  flex: 1;
}
.incident-group-header {
  padding: var(--astryx-spacing-2) var(--astryx-spacing-3);
  background-color: var(--astryx-color-background-muted);
}
.incident-inspector {
  height: 100%;
  padding: var(--astryx-spacing-4);
}
</style>
