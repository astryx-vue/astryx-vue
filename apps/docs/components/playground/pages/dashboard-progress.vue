<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Grid,
  Heading,
  HStack,
  HoverCard,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  List,
  ListItem,
  ProgressBar,
  Section,
  SegmentedControl,
  SegmentedControlItem,
  Table,
  Text,
  Timestamp,
  VStack,
  proportional,
} from '@astryx-vue/core'
import {
  PlaygroundDonutChart,
  PlaygroundGanttChart,
  PlaygroundLineChart,
  PlaygroundResponsive,
} from '@astryx-vue/playground-charts'

type Rag = 'onTrack' | 'atRisk' | 'blocked'
type Phase = 'all' | 'build' | 'beta' | 'ga'
type ReleasePhase = Exclude<Phase, 'all'>

const PHASE_LABEL: Record<ReleasePhase, string> = { build: 'Build', beta: 'Beta', ga: 'GA' }
const RAG_LABEL: Record<Rag, string> = { onTrack: 'On track', atRisk: 'At risk', blocked: 'Blocked' }
const RAG_BADGE: Record<Rag, 'green' | 'yellow' | 'red'> = { onTrack: 'green', atRisk: 'yellow', blocked: 'red' }
const RAG_FILL: Record<Rag, string> = {
  onTrack: 'var(--color-data-categorical-green, #0B991F)',
  atRisk: 'var(--color-data-categorical-orange, #EB6E00)',
  blocked: 'var(--color-data-categorical-red, #F5394F)',
}

const TIMELINE_DAYS = 90
const TIMELINE_TICKS = Array.from({ length: TIMELINE_DAYS / 15 + 1 }, (_, i) => i * 15)
const PROJECT_DAY = 58

const MILESTONES = [
  { id: 'm1', name: 'Kickoff & scoping', phase: 'build' as ReleasePhase, start: 0, end: 8, status: 'onTrack' as Rag, dateLabel: 'Apr 1 – Apr 9' },
  { id: 'm2', name: 'Architecture sign-off', phase: 'build', start: 8, end: 20, status: 'onTrack', dateLabel: 'Apr 9 – Apr 21' },
  { id: 'm3', name: 'Feature complete', phase: 'build', start: 20, end: 44, status: 'atRisk', dateLabel: 'Apr 21 – May 15' },
  { id: 'm4', name: 'Private beta', phase: 'beta', start: 44, end: 62, status: 'atRisk', dateLabel: 'May 15 – Jun 2' },
  { id: 'm5', name: 'Bug bash & hardening', phase: 'beta', start: 58, end: 72, status: 'blocked', dateLabel: 'May 29 – Jun 12' },
  { id: 'm6', name: 'GA readiness review', phase: 'ga', start: 72, end: 82, status: 'onTrack', dateLabel: 'Jun 12 – Jun 22' },
  { id: 'm7', name: 'Public launch', phase: 'ga', start: 82, end: 90, status: 'onTrack', dateLabel: 'Jun 22 – Jun 30' },
]

const TASK_STATUS = [
  { key: 'closed', label: 'Closed', points: 190, color: 'var(--color-data-categorical-blue, #0171E3)' },
  { key: 'inProgress', label: 'In progress', points: 58, color: 'var(--color-data-categorical-green, #0B991F)' },
  { key: 'inReview', label: 'In review', points: 24, color: 'var(--color-data-categorical-orange, #EB6E00)' },
  { key: 'blocked', label: 'Blocked', points: 22, color: 'var(--color-data-categorical-red, #F5394F)' },
  { key: 'planned', label: 'Planned', points: 26, color: 'var(--color-data-neutral, #8494A3)' },
]

interface Workstream extends Record<string, unknown> {
  id: string
  name: string
  owner: string
  phase: ReleasePhase
  percent: number
  due: string
  status: Rag
}

const WORKSTREAMS: Workstream[] = [
  { id: 'w1', name: 'Core platform', owner: 'Priya Raman', phase: 'build', percent: 100, due: '2026-04-21', status: 'onTrack' },
  { id: 'w2', name: 'Data pipeline', owner: 'Marcus Webb', phase: 'build', percent: 92, due: '2026-05-15', status: 'atRisk' },
  { id: 'w3', name: 'Web client', owner: 'Ana Duarte', phase: 'build', percent: 88, due: '2026-05-15', status: 'onTrack' },
  { id: 'w4', name: 'Beta onboarding', owner: 'Tom Okafor', phase: 'beta', percent: 64, due: '2026-06-02', status: 'atRisk' },
  { id: 'w5', name: 'Load & reliability', owner: 'Dana Whitfield', phase: 'beta', percent: 38, due: '2026-06-12', status: 'blocked' },
  { id: 'w6', name: 'Docs & enablement', owner: 'Sofia Marín', phase: 'ga', percent: 55, due: '2026-06-22', status: 'onTrack' },
  { id: 'w7', name: 'Launch marketing', owner: 'Kenji Watanabe', phase: 'ga', percent: 41, due: '2026-06-22', status: 'onTrack' },
  { id: 'w8', name: 'Go-to-market ops', owner: 'Lena Fischer', phase: 'ga', percent: 30, due: '2026-06-30', status: 'atRisk' },
]

const RISKS = [
  { id: 'r1', title: 'Load tests failing at 3x target concurrency', workstream: 'Load & reliability', phase: 'beta' as ReleasePhase, severity: 'blocked' as Rag, owner: 'Dana Whitfield', detail: 'p99 latency degrades past SLO above 12k concurrent sessions.' },
  { id: 'r2', title: 'Data pipeline backfill slower than planned', workstream: 'Data pipeline', phase: 'build', severity: 'atRisk', owner: 'Marcus Webb', detail: 'Historical backfill is tracking two days behind.' },
  { id: 'r3', title: 'Beta onboarding email deliverability', workstream: 'Beta onboarding', phase: 'beta', severity: 'atRisk', owner: 'Tom Okafor', detail: 'Invite emails landing in spam for two enterprise domains.' },
]

const BURNDOWN = [320, 300, 286, 262, 240, 226, 210, 182, 150, 132, 96, 54, 20].map((actual, i) => ({
  week: i,
  label: `W${i + 1}`,
  ideal: Math.max(0, Math.round(320 - (320 / 12) * i)),
  actual,
}))

const PROGRAM_STATUS: Rag = WORKSTREAMS.some(w => w.status === 'blocked')
  ? 'blocked'
  : WORKSTREAMS.some(w => w.status === 'atRisk')
    ? 'atRisk'
    : 'onTrack'

function byPhase<T extends { phase: ReleasePhase }>(items: T[], phase: Phase) {
  return phase === 'all' ? items : items.filter(item => item.phase === phase)
}

const phase = ref<Phase>('all')
const milestones = computed(() => byPhase(MILESTONES, phase.value))
const workstreams = computed(() => byPhase(WORKSTREAMS, phase.value))
const risks = computed(() => byPhase(RISKS, phase.value))

const ganttItems = computed(() => milestones.value.map(m => ({
  name: m.name,
  start: m.start,
  end: m.end,
  color: RAG_FILL[m.status],
})))

const donutSegments = computed(() => TASK_STATUS.map(s => ({ value: s.points, color: s.color })))

const WORKSTREAM_COLUMNS: TableColumn<Workstream>[] = [
  {
    key: 'name',
    header: 'Workstream',
    width: proportional(1, { minWidth: 160 }),
    renderCell: item => h(VStack, { gap: 0 }, () => [
      h(Text, { type: 'body', weight: 'semibold' }, () => item.name),
      h(Text, { type: 'supporting', color: 'secondary' }, () => PHASE_LABEL[item.phase]),
    ]),
  },
  {
    key: 'owner',
    header: 'Owner',
    width: proportional(1, { minWidth: 160 }),
    renderCell: item => h(HStack, { gap: 2, vAlign: 'center' }, () => [
      h(Avatar, { name: item.owner, size: 'sm' }),
      h(Text, { type: 'body' }, () => item.owner),
    ]),
  },
  {
    key: 'percent',
    header: '% complete',
    width: proportional(2, { minWidth: 200 }),
    renderCell: item => h(VStack, { gap: 1 }, () => [
      h(ProgressBar, { value: item.percent, max: 100, label: `${item.name} progress`, isLabelHidden: true }),
      h(Text, { type: 'supporting', color: 'secondary' }, () => `${item.percent}%`),
    ]),
  },
  {
    key: 'due',
    header: 'Due',
    width: proportional(1, { minWidth: 120 }),
    renderCell: item => h(Timestamp, { value: item.due, format: 'date' }),
  },
  {
    key: 'status',
    header: 'Status',
    width: proportional(1, { minWidth: 120 }),
    renderCell: item => h(Badge, { variant: RAG_BADGE[item.status], label: RAG_LABEL[item.status] }),
  },
]
</script>

<template>
  <Layout height="fill">
    <template #header>
      <LayoutHeader :padding="6" has-divider>
        <HStack :gap="3" align="center" justify="between" wrap="wrap" class="content-column">
          <VStack :gap="1">
            <Heading :level="1">
              Aurora Launch
            </Heading>
            <HStack :gap="2" align="center">
              <Text type="body" color="secondary">
                Target GA ·
              </Text>
              <Timestamp value="2026-06-30T00:00:00Z" format="date" type="body" color="secondary" />
              <Badge :variant="RAG_BADGE[PROGRAM_STATUS]" :label="RAG_LABEL[PROGRAM_STATUS]" />
            </HStack>
          </VStack>
          <HStack :gap="2">
            <SegmentedControl v-model="phase" label="Release phase">
              <SegmentedControlItem label="All" value="all" />
              <SegmentedControlItem label="Build" value="build" />
              <SegmentedControlItem label="Beta" value="beta" />
              <SegmentedControlItem label="GA" value="ga" />
            </SegmentedControl>
            <Button label="Export status" variant="secondary">
              <template #icon>
                <Icon icon="i-heroicons-arrow-down-tray" size="sm" />
              </template>
            </Button>
          </HStack>
        </HStack>
      </LayoutHeader>
    </template>
    <template #default>
      <LayoutContent :padding="0" class="content-bottom-pad">
        <Section :padding="6" :dividers="['bottom']">
          <VStack :gap="6" class="content-column">
            <Heading :level="2">
              Milestone timeline
            </Heading>
            <EmptyState
              v-if="milestones.length === 0"
              title="No milestones in this phase"
              description="Switch phases to see other milestones."
              is-compact
            />
            <PlaygroundGanttChart
              v-else
              :items="ganttItems"
              :domain-max="TIMELINE_DAYS"
              :today="PROJECT_DAY"
              :ticks="TIMELINE_TICKS"
            />
          </VStack>
        </Section>
        <Section :padding="6" :padding-block="10">
          <VStack :gap="6" class="content-column">
            <Grid :gap="4" :columns="{ minWidth: 320, max: 3 }">
              <Card :padding="6">
                <VStack :gap="5">
                  <Heading :level="3">
                    Overall progress
                  </Heading>
                  <HStack :gap="8" align="center" wrap="wrap">
                    <PlaygroundDonutChart :segments="donutSegments" />
                    <VStack :gap="2">
                      <Text v-for="s in TASK_STATUS" :key="s.key" type="supporting" color="secondary">
                        {{ s.label }}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Card>
              <Card :padding="6">
                <VStack :gap="5">
                  <Heading :level="3">
                    Scope burndown
                  </Heading>
                  <PlaygroundResponsive :height="208">
                    <PlaygroundLineChart
                      :data="BURNDOWN"
                      x-key="week"
                      :series="[
                        { key: 'ideal', name: 'Ideal', color: 'var(--color-data-neutral, #8494A3)' },
                        { key: 'actual', name: 'Actual', color: 'var(--color-data-categorical-blue, #0171E3)' },
                      ]"
                      :height="208"
                      y-unit=" pts"
                      :x-ticks="[0, 3, 6, 9, 12]"
                      :x-tick-format="(v: number) => BURNDOWN[v]?.label ?? ''"
                    />
                  </PlaygroundResponsive>
                </VStack>
              </Card>
              <Card :padding="6">
                <VStack :gap="4">
                  <Heading :level="3">
                    Blockers & risks
                  </Heading>
                  <List v-if="risks.length" has-dividers>
                    <HoverCard v-for="risk in risks" :key="risk.id" placement="below" alignment="start" focus-trigger="always">
                      <ListItem
                        :label="risk.title"
                        :description="`${risk.workstream} · ${PHASE_LABEL[risk.phase]} · ${risk.owner}`"
                        class="risk-row"
                      >
                        <template #end-content>
                          <Badge :variant="RAG_BADGE[risk.severity]" :label="RAG_LABEL[risk.severity]" />
                        </template>
                      </ListItem>
                      <template #content>
                        <VStack :gap="2" class="risk-detail">
                          <Text type="body" weight="semibold">
                            {{ risk.title }}
                          </Text>
                          <Text type="supporting" color="secondary">
                            {{ risk.detail }}
                          </Text>
                        </VStack>
                      </template>
                    </HoverCard>
                  </List>
                  <EmptyState
                    v-else
                    title="No open blockers or risks"
                    description="Nothing flagged for the selected phase."
                    is-compact
                  />
                </VStack>
              </Card>
            </Grid>
            <Card :padding="6">
              <VStack :gap="4">
                <Heading :level="3">
                  Workstreams
                </Heading>
                <Table
                  v-if="workstreams.length"
                  :data="workstreams"
                  :columns="WORKSTREAM_COLUMNS"
                  id-key="id"
                  density="balanced"
                  dividers="rows"
                  has-hover
                />
                <EmptyState v-else title="No workstreams in this phase" description="Switch phases to see other workstreams." is-compact />
              </VStack>
            </Card>
          </VStack>
        </Section>
      </LayoutContent>
    </template>
  </Layout>
</template>

<style scoped>
.content-column {
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
}
.content-bottom-pad {
  padding-block-end: var(--spacing-10);
}
.risk-row {
  transition: background-color var(--duration-fast-min) var(--ease-standard);
}
.risk-row:hover {
  background-color: var(--color-overlay-hover);
}
.risk-detail {
  max-width: 320px;
}
</style>
