<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Grid,
  Heading,
  HoverCard,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  List,
  ListItem,
  ProgressBar,
  proportional,
  Section,
  SegmentedControl,
  SegmentedControlItem,
  Table,
  Text,
  Timestamp,
  VStack,
} from '@astryx-vue/core'
import {
  PlaygroundDonutChart,
  PlaygroundGanttChart,
  PlaygroundLineChart,
  PlaygroundResponsive,
} from '@astryx-vue/playground-charts'
import { computed, h, ref } from 'vue'

type Rag = 'onTrack' | 'atRisk' | 'blocked'
type Phase = 'all' | 'build' | 'beta' | 'ga'
type ReleasePhase = Exclude<Phase, 'all'>

const PHASE_LABEL: Record<ReleasePhase, string> = { build: 'Build', beta: 'Beta', ga: 'GA' }
const RAG_LABEL: Record<Rag, string> = { onTrack: 'On track', atRisk: 'At risk', blocked: 'Blocked' }
const RAG_BADGE: Record<Rag, 'green' | 'yellow' | 'red'> = { onTrack: 'green', atRisk: 'yellow', blocked: 'red' }
const RAG_FILL: Record<Rag, string> = {
  onTrack: 'var(--astryx-color-data-categorical-green, #0B991F)',
  atRisk: 'var(--astryx-color-data-categorical-orange, #EB6E00)',
  blocked: 'var(--astryx-color-data-categorical-red, #F5394F)',
}

const TIMELINE_DAYS = 90
const TIMELINE_TICKS = Array.from({ length: TIMELINE_DAYS / 15 + 1 }, (_, i) => i * 15)
const PROJECT_DAY = 58

interface Milestone {
  id: string
  name: string
  phase: ReleasePhase
  start: number
  end: number
  status: Rag
  dateLabel: string
}

const MILESTONES: Milestone[] = [
  { id: 'm1', name: 'Kickoff & scoping', phase: 'build', start: 0, end: 8, status: 'onTrack', dateLabel: 'Apr 1 – Apr 9' },
  { id: 'm2', name: 'Architecture sign-off', phase: 'build', start: 8, end: 20, status: 'onTrack', dateLabel: 'Apr 9 – Apr 21' },
  { id: 'm3', name: 'Feature complete', phase: 'build', start: 20, end: 44, status: 'atRisk', dateLabel: 'Apr 21 – May 15' },
  { id: 'm4', name: 'Private beta', phase: 'beta', start: 44, end: 62, status: 'atRisk', dateLabel: 'May 15 – Jun 2' },
  { id: 'm5', name: 'Bug bash & hardening', phase: 'beta', start: 58, end: 72, status: 'blocked', dateLabel: 'May 29 – Jun 12' },
  { id: 'm6', name: 'GA readiness review', phase: 'ga', start: 72, end: 82, status: 'onTrack', dateLabel: 'Jun 12 – Jun 22' },
  { id: 'm7', name: 'Public launch', phase: 'ga', start: 82, end: 90, status: 'onTrack', dateLabel: 'Jun 22 – Jun 30' },
]

const TASK_STATUS = [
  { key: 'closed', tasks: 86, label: 'Closed', points: 190, color: 'var(--astryx-color-data-categorical-blue, #0171E3)' },
  { key: 'inProgress', tasks: 24, label: 'In progress', points: 58, color: 'var(--astryx-color-data-categorical-green, #0B991F)' },
  { key: 'inReview', tasks: 12, label: 'In review', points: 24, color: 'var(--astryx-color-data-categorical-orange, #EB6E00)' },
  { key: 'blocked', tasks: 5, label: 'Blocked', points: 22, color: 'var(--astryx-color-data-categorical-red, #F5394F)' },
  { key: 'planned', tasks: 21, label: 'Planned', points: 26, color: 'var(--astryx-color-data-neutral, #8494A3)' },
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

interface Risk {
  id: string
  title: string
  workstream: string
  phase: ReleasePhase
  severity: Rag
  owner: string
  detail: string
}

const RISKS: Risk[] = [
  { id: 'r1', title: 'Load tests failing at 3x target concurrency', workstream: 'Load & reliability', phase: 'beta', severity: 'blocked', owner: 'Dana Whitfield', detail: 'p99 latency degrades past SLO above 12k concurrent sessions.' },
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

const RAG_ORDER: Rag[] = ['onTrack', 'atRisk', 'blocked']

const ganttItems = computed(() => milestones.value.map(m => ({
  name: m.name,
  start: m.start,
  end: m.end,
  color: RAG_FILL[m.status],
})))

const TASK_POINTS_TOTAL = TASK_STATUS.reduce((sum, s) => sum + s.points, 0)
const TASK_COUNT_TOTAL = TASK_STATUS.reduce((sum, s) => sum + s.tasks, 0)
const ACTUAL_COLOR = 'var(--astryx-color-data-categorical-blue, #0171E3)'
const IDEAL_COLOR = 'var(--astryx-color-data-neutral, #8494A3)'

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
              <Badge :variant="RAG_BADGE[PROGRAM_STATUS]" :label="RAG_LABEL[PROGRAM_STATUS]">
                <template #icon>
                  <Icon :name="PROGRAM_STATUS === 'onTrack' ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle'" size="sm" />
                </template>
              </Badge>
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
            <HStack :gap="3" h-align="between" align="center">
              <Heading :level="2">
                Milestone timeline
              </Heading>
              <Text type="supporting" color="secondary">
                Project days 0–{{ TIMELINE_DAYS }} · dashed line marks today
              </Text>
            </HStack>
            <EmptyState
              v-if="milestones.length === 0"
              title="No milestones in this phase"
              description="Switch phases to see other milestones."
              is-compact
            />
            <template v-else>
              <VStack :gap="3">
                <PlaygroundGanttChart
                  :items="ganttItems"
                  :domain-max="TIMELINE_DAYS"
                  :today="PROJECT_DAY"
                  :ticks="TIMELINE_TICKS"
                  is-recharts-layout
                />
                <HStack :gap="4" align="center" wrap="wrap">
                  <HStack v-for="status in RAG_ORDER" :key="status" :gap="2" align="center">
                    <span class="legend-swatch" :style="{ backgroundColor: RAG_FILL[status] }" aria-hidden="true" />
                    <Text type="supporting" color="secondary">
                      {{ RAG_LABEL[status] }}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </template>
          </VStack>
        </Section>
        <Section :padding="6" :padding-block="10">
          <VStack :gap="6" class="content-column">
            <Grid :gap="4" :columns="{ minWidth: 320, max: 3 }">
              <Card :padding="6">
                <VStack :gap="5">
                  <VStack>
                    <Heading :level="3" :accessibility-level="2">
                      Overall progress
                    </Heading>
                    <Text type="supporting" color="secondary">
                      {{ TASK_COUNT_TOTAL }} tasks · {{ TASK_POINTS_TOTAL }} story points
                    </Text>
                  </VStack>
                  <HStack :gap="8" align="center" wrap="wrap">
                    <PlaygroundDonutChart :segments="donutSegments" :gap-angle="2.3" />
                    <VStack :gap="2">
                      <HStack v-for="s in TASK_STATUS" :key="s.key" :gap="2" align="center">
                        <span class="legend-swatch" :style="{ backgroundColor: s.color }" aria-hidden="true" />
                        <Text type="supporting" color="secondary">
                          {{ s.label }}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </VStack>
              </Card>
              <Card :padding="6">
                <VStack :gap="5">
                  <VStack>
                    <Heading :level="3" :accessibility-level="2">
                      Scope burndown
                    </Heading>
                    <Text type="supporting" color="secondary">
                      Remaining story points · {{ BURNDOWN.length }} weeks
                    </Text>
                  </VStack>
                  <VStack :gap="3">
                    <PlaygroundResponsive :height="208">
                      <PlaygroundLineChart
                        :data="BURNDOWN"
                        x-key="week"
                        :series="[
                          { key: 'ideal', name: 'Ideal', color: IDEAL_COLOR },
                          { key: 'actual', name: 'Actual', color: ACTUAL_COLOR },
                        ]"
                        :height="208"
                        :y-ticks="[0, 80, 160, 240, 320]"
                        y-unit=" pts"
                        is-y-unit-stacked
                        :x-ticks="[0, 3, 6, 9, 12]"
                        :x-tick-format="(v: number) => BURNDOWN[v]?.label ?? ''"
                        :pad="{ top: 16, right: 4, bottom: 34, left: 44 }"
                        center-ticks
                        monotone
                      />
                    </PlaygroundResponsive>
                    <HStack :gap="4" align="center" wrap="wrap">
                      <HStack v-for="item in [{ label: 'Actual remaining', color: ACTUAL_COLOR }, { label: 'Ideal burndown', color: IDEAL_COLOR }]" :key="item.label" :gap="2" align="center">
                        <span class="legend-swatch" :style="{ backgroundColor: item.color }" aria-hidden="true" />
                        <Text type="supporting" color="secondary">
                          {{ item.label }}
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </VStack>
              </Card>
              <Card :padding="6">
                <VStack :gap="4">
                  <VStack>
                    <Heading :level="3" :accessibility-level="2">
                      Blockers & risks
                    </Heading>
                    <Text type="supporting" color="secondary">
                      Hover or focus a row for detail
                    </Text>
                  </VStack>
                  <List v-if="risks.length" has-dividers class="risk-list">
                    <HoverCard v-for="risk in risks" :key="risk.id" placement="below" alignment="start" focus-trigger="always">
                      <ListItem
                        :label="risk.title"
                        :description="`${risk.workstream} · ${PHASE_LABEL[risk.phase]} · ${risk.owner}`"
                        class="risk-row"
                      >
                        <template #endContent>
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
                <HStack :gap="3" h-align="between" align="center" wrap="wrap">
                  <Heading :level="3" :accessibility-level="2">
                    Workstreams
                  </Heading>
                  <Text type="body" color="secondary">
                    {{ workstreams.length }} of {{ WORKSTREAMS.length }}
                  </Text>
                </HStack>
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
.legend-swatch {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.content-column {
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
}
.content-bottom-pad {
  padding-block-end: var(--astryx-spacing-10);
}
/* HoverCard 的包裹 span 夹在 ul 和 li 之间，List 的 `> .astryx-list-item` 分隔线选择器够不着，
   这里在包裹 span 上按「除最后一个」补上同样的分隔线。 */
.risk-list :deep(.astryx-hover-card__trigger:not(:last-of-type) > .astryx-list-item) {
  border-block-end: var(--astryx-border-width, 1px) solid var(--astryx-list-divider-color, light-dark(#05365919, #f2f4f619));
}
.risk-row {
  transition: background-color var(--astryx-duration-fast-min) var(--astryx-ease-standard);
}
.risk-row:hover {
  background-color: var(--astryx-color-overlay-hover);
}
.risk-detail {
  max-width: 320px;
}
</style>
