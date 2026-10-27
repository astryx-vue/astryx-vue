<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  Center,
  Dialog,
  DialogHeader,
  Divider,
  DropdownMenu,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
  MetadataList,
  MetadataListItem,
  PowerSearch,
  pixel,
  Popover,
  proportional,
  RadioList,
  RadioListItem,
  resolveColumnWidths,
  ResizeHandle,
  Selector,
  StatusDot,
  StackItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Text,
  TextInput,
  useResizable,
  usePowerSearchConfig,
  VStack,
} from '@astryx-vue/core'
import type { PowerSearchFilter, TableColumn } from '@astryx-vue/core'
import { computed, ref, watch } from 'vue'

type TaskStatus = 'in_progress' | 'todo' | 'backlog' | 'done'
type TaskPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

interface TaskRow extends Record<string, unknown> {
  id: string
  taskId: string
  title: string
  subtitle: string
  status: TaskStatus
  priority: TaskPriority
  project: string
  tags: string[]
  created: string
  updated: string
  assignee: string
}

const ALL_TASKS: TaskRow[] = [
  { id: '1', taskId: 'T235040469', title: 'Update user interface', subtitle: 'Update payment gateway integration', status: 'in_progress', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'Olivia Martin' },
  { id: '2', taskId: 'T235040470', title: 'Use Projects to organize work for features or releases', subtitle: '', status: 'in_progress', priority: 'medium', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Jackson Lee' },
  { id: '3', taskId: 'T235040471', title: 'Use Cycles to focus work over n-weeks', subtitle: '', status: 'in_progress', priority: 'medium', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Isabella Nguyen' },
  { id: '4', taskId: 'T235040472', title: 'Testing code', subtitle: 'Update payment gateway integration', status: 'todo', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'William Kim' },
  { id: '5', taskId: 'T235040473', title: 'Update backend code', subtitle: 'Update payment gateway integration', status: 'todo', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'Sofia Davis' },
  { id: '6', taskId: 'T235040474', title: 'Update front end code', subtitle: 'Update payment gateway integration', status: 'todo', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'Mia Wilson' },
  { id: '7', taskId: 'T235040475', title: 'Update payment gateway integration', subtitle: '', status: 'todo', priority: 'high', project: 'Payment gateway integration 2.0', tags: ['Improvement', '3rd Party'], created: 'Jul 3', updated: 'Jul 3', assignee: 'Lucas Brown' },
  { id: '8', taskId: 'T235040476', title: 'Update payment gateway backend code', subtitle: '', status: 'todo', priority: 'medium', project: '', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'Ethan Jones' },
  { id: '9', taskId: 'T235040477', title: 'Invite your teammates', subtitle: '', status: 'todo', priority: 'low', project: '', tags: [], created: 'Jul 1', updated: 'Jul 1', assignee: 'Ava Taylor' },
  { id: '10', taskId: 'T235040478', title: 'Next steps', subtitle: '', status: 'todo', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Noah Garcia' },
  { id: '11', taskId: 'T235040479', title: 'Welcome to Linear', subtitle: '', status: 'backlog', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Olivia Martin' },
  { id: '12', taskId: 'T235040480', title: 'Connect GitHub or GitLab', subtitle: '', status: 'backlog', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Jackson Lee' },
  { id: '13', taskId: 'T235040481', title: 'Customize settings', subtitle: '', status: 'backlog', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Isabella Nguyen' },
  { id: '14', taskId: 'T235040482', title: 'Try 3 ways to navigate: Command menu, keyboard or mouse', subtitle: '', status: 'done', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'William Kim' },
  { id: '15', taskId: 'T235040483', title: 'Connect to Slack', subtitle: '', status: 'done', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Sofia Davis' },
  { id: '16', taskId: 'T235040484', title: 'Migrate database schema to v2', subtitle: 'Payment gateway integration', status: 'in_progress', priority: 'high', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 4', updated: 'Jul 5', assignee: 'Lucas Brown' },
  { id: '17', taskId: 'T235040485', title: 'Write integration tests for checkout flow', subtitle: '', status: 'in_progress', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 4', updated: 'Jul 5', assignee: 'Ethan Jones' },
  { id: '18', taskId: 'T235040486', title: 'Set up CI/CD pipeline for staging', subtitle: '', status: 'in_progress', priority: 'high', project: '', tags: [], created: 'Jul 2', updated: 'Jul 5', assignee: 'Ava Taylor' },
  { id: '19', taskId: 'T235040487', title: 'Add rate limiting to public API endpoints', subtitle: '', status: 'todo', priority: 'urgent', project: '', tags: [], created: 'Jul 5', updated: 'Jul 5', assignee: 'Noah Garcia' },
  { id: '20', taskId: 'T235040488', title: 'Refactor auth middleware to support OAuth2', subtitle: '', status: 'todo', priority: 'high', project: '', tags: [], created: 'Jul 4', updated: 'Jul 5', assignee: 'Olivia Martin' },
  { id: '21', taskId: 'T235040489', title: 'Design error pages for 404 and 500', subtitle: '', status: 'todo', priority: 'low', project: '', tags: [], created: 'Jul 3', updated: 'Jul 4', assignee: 'Mia Wilson' },
  { id: '22', taskId: 'T235040490', title: 'Audit third-party dependencies for vulnerabilities', subtitle: '', status: 'todo', priority: 'medium', project: '', tags: [], created: 'Jul 5', updated: 'Jul 5', assignee: 'Jackson Lee' },
  { id: '23', taskId: 'T235040491', title: 'Implement webhook retry logic with exponential backoff', subtitle: 'Payment gateway integration', status: 'todo', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 4', updated: 'Jul 5', assignee: 'William Kim' },
  { id: '24', taskId: 'T235040492', title: 'Add dark mode support to dashboard', subtitle: '', status: 'backlog', priority: 'low', project: '', tags: [], created: 'Jul 2', updated: 'Jul 3', assignee: 'Sofia Davis' },
  { id: '25', taskId: 'T235040493', title: 'Create onboarding flow for new team members', subtitle: '', status: 'backlog', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 2', assignee: 'Isabella Nguyen' },
  { id: '26', taskId: 'T235040494', title: 'Set up error tracking with Sentry', subtitle: '', status: 'backlog', priority: 'medium', project: '', tags: [], created: 'Jul 3', updated: 'Jul 4', assignee: 'Ethan Jones' },
  { id: '27', taskId: 'T235040495', title: 'Improve search performance with indexing', subtitle: '', status: 'backlog', priority: 'low', project: '', tags: [], created: 'Jul 2', updated: 'Jul 3', assignee: 'Ava Taylor' },
  { id: '28', taskId: 'T235040496', title: 'Write API documentation for v2 endpoints', subtitle: '', status: 'done', priority: 'medium', project: '', tags: [], created: 'Jun 28', updated: 'Jul 3', assignee: 'Noah Garcia' },
  { id: '29', taskId: 'T235040497', title: 'Set up staging environment', subtitle: '', status: 'done', priority: 'high', project: '', tags: [], created: 'Jun 25', updated: 'Jul 1', assignee: 'Lucas Brown' },
  { id: '30', taskId: 'T235040498', title: 'Fix flaky end-to-end tests in CI', subtitle: '', status: 'done', priority: 'medium', project: '', tags: [], created: 'Jun 30', updated: 'Jul 2', assignee: 'Mia Wilson' },
]

const STATUS_LABEL: Record<TaskStatus, string> = {
  in_progress: 'In Progress',
  todo: 'Todo',
  backlog: 'Backlog',
  done: 'Done',
}

const STATUS_DOT: Record<TaskStatus, 'accent' | 'warning' | 'neutral' | 'success'> = {
  in_progress: 'accent',
  todo: 'warning',
  backlog: 'neutral',
  done: 'success',
}

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
}

const PRIORITY_COLOR: Record<TaskPriority, 'primary' | 'secondary' | 'disabled'> = {
  urgent: 'primary',
  high: 'primary',
  medium: 'secondary',
  low: 'disabled',
  none: 'disabled',
}

const GROUP_ORDER: TaskStatus[] = ['in_progress', 'todo', 'backlog', 'done']

type GroupByField = 'status' | 'priority' | 'project' | 'assignee' | 'none'

const GROUP_BY_OPTIONS: { value: GroupByField, label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'project', label: 'Project' },
  { value: 'assignee', label: 'Assignee' },
]

function groupLabel(field: GroupByField, key: string): string {
  if (field === 'status')
    return STATUS_LABEL[key as TaskStatus] ?? key
  if (field === 'priority') {
    const labels: Record<string, string> = {
      urgent: 'Urgent',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      none: 'No priority',
    }
    return labels[key] ?? key
  }
  return key
}

const powerSearchFilters = ref<PowerSearchFilter[]>([])
const groupBy = ref<GroupByField>('status')
const expandedGroups = ref<Set<string>>(new Set(GROUP_ORDER))
const selectedTask = ref<TaskRow | null>(null)
const dialogOpen = ref(false)

const detailPanel = useResizable({
  defaultSize: 360,
  minSize: 280,
  maxSize: 500,
})

const SEARCH_FIELDS = [
  {
    key: 'status',
    type: 'enum',
    label: 'Status',
    enumValues: GROUP_ORDER.map(value => ({ value, label: STATUS_LABEL[value] })),
  },
  {
    key: 'priority',
    type: 'enum',
    label: 'Priority',
    enumValues: (['urgent', 'high', 'medium', 'low', 'none'] as TaskPriority[]).map(value => ({ value, label: PRIORITY_LABEL[value] })),
  },
  { key: 'title', type: 'string', label: 'Title' },
  { key: 'assignee', type: 'string', label: 'Assignee' },
  { key: 'project', type: 'string', label: 'Project' },
] as const

const { config: searchConfig, applyFilters } = usePowerSearchConfig(SEARCH_FIELDS, 'IssueSearch')

const filtered = computed(() => applyFilters(powerSearchFilters.value, ALL_TASKS))

const grouped = computed(() => {
  const map = new Map<string, TaskRow[]>()
  if (groupBy.value === 'none') {
    map.set('All', filtered.value)
    return map
  }
  for (const task of filtered.value) {
    const key = String(task[groupBy.value]) || '—'
    const list = map.get(key) ?? []
    list.push(task)
    map.set(key, list)
  }
  return map
})

const groupKeys = computed(() => Array.from(grouped.value.keys()))

watch(groupKeys, (keys) => {
  expandedGroups.value = new Set(keys)
}, { immediate: true })

function toggleGroup(key: string): void {
  const next = new Set(expandedGroups.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  expandedGroups.value = next
}

const columns: TableColumn<TaskRow>[] = [
  { key: 'status', header: '', width: pixel(44) },
  { key: 'title', header: 'Issue', width: proportional(1) },
  { key: 'project', header: 'Project', width: pixel(180) },
  { key: 'created', header: 'Created', width: pixel(72) },
  { key: 'updated', header: 'Updated', width: pixel(72) },
  { key: 'assignee', header: 'Assignee', width: pixel(52) },
  { key: 'actions', header: '', width: pixel(56) },
]

const columnStyles = resolveColumnWidths(columns).columns

const rowMenuItems = [
  { label: 'Edit issue', icon: 'i-heroicons-pencil' },
  { label: 'Assign to...', icon: 'i-heroicons-user' },
  { label: 'Add label', icon: 'i-heroicons-tag' },
  { label: 'Duplicate', icon: 'i-heroicons-document-duplicate' },
  { label: 'Move to project', icon: 'i-heroicons-arrow-right' },
  { type: 'divider' as const },
  { label: 'Delete issue', icon: 'i-heroicons-trash' },
]

</script>

<template>
  <Layout height="fill">
    <template #header>
      <LayoutHeader has-divider :padding="4">
        <VStack :gap="4">
          <HStack :gap="3" align="center">
            <StackItem size="fill">
              <Heading :level="1">
                All Issues
              </Heading>
            </StackItem>
            <Button label="Create issue" variant="primary" size="lg" @click="dialogOpen = true" />
          </HStack>
          <HStack :gap="2" align="center">
            <StackItem size="fill">
              <PowerSearch
                :config="searchConfig"
                :filters="powerSearchFilters"
                placeholder="Filter issues..."
                :result-count="`${filtered.length} issue${filtered.length !== 1 ? 's' : ''}`"
                @update:filters="value => { powerSearchFilters = value }"
              />
            </StackItem>
            <Popover
              placement="below"
              alignment="end"
              :width="320"
              label="Grouping options"
            >
              <template #content>
                <VStack :gap="4">
                  <RadioList v-model="groupBy" label="Group by">
                    <RadioListItem
                      v-for="opt in GROUP_BY_OPTIONS"
                      :key="opt.value"
                      :value="opt.value"
                      :label="opt.label"
                    />
                  </RadioList>
                </VStack>
              </template>
              <Button label="View Options" variant="secondary" size="md" />
            </Popover>
          </HStack>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="0" role="main">
      <Table :columns="columns" density="balanced" dividers="rows" text-overflow="truncate" has-hover>
        <colgroup>
          <col v-for="col in columns" :key="col.key" :style="columnStyles.get(col.key)?.style">
        </colgroup>
        <TableBody>
          <template v-for="key in groupKeys" :key="key">
            <template v-if="(grouped.get(key) ?? []).length > 0">
              <TableRow
                v-if="groupBy !== 'none'"
                role="button"
                :tab-index="0"
                @click="toggleGroup(key)"
                @keydown.enter.prevent="toggleGroup(key)"
                @keydown.space.prevent="toggleGroup(key)"
              >
                <TableCell :col-span="columns.length" class="group-header-cell">
                  <HStack :gap="2" align="center">
                    <Icon
                      :icon="expandedGroups.has(key) ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                      size="sm"
                      color="secondary"
                    />
                    <Text type="body" weight="bold">
                      {{ groupLabel(groupBy, key) }}
                    </Text>
                    <Badge variant="neutral" :label="String(grouped.get(key)?.length ?? 0)" />
                  </HStack>
                </TableCell>
              </TableRow>
              <template v-if="groupBy === 'none' || expandedGroups.has(key)">
                <TableRow v-for="task in grouped.get(key)" :key="task.id" @click="selectedTask = task">
                  <TableCell>
                    <Center axis="horizontal">
                      <StatusDot :variant="STATUS_DOT[task.status]" :label="STATUS_LABEL[task.status]" />
                    </Center>
                  </TableCell>
                  <TableCell>
                    <HStack :gap="3" align="center">
                      <Icon icon="i-heroicons-chart-bar-solid" size="sm" :color="PRIORITY_COLOR[task.priority]" />
                      <Text type="supporting" color="secondary">
                        {{ task.taskId }}
                      </Text>
                      <Text type="body" :max-lines="1">
                        {{ task.title }}
                      </Text>
                      <Text v-if="task.subtitle" type="body" color="secondary" :max-lines="1">
                        › {{ task.subtitle }}
                      </Text>
                    </HStack>
                  </TableCell>
                  <TableCell>
                    <Text v-if="task.project" type="body" :max-lines="1">
                      {{ task.project }}
                    </Text>
                    <Text v-else type="supporting" color="secondary">
                      —
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text type="supporting" color="secondary">
                      {{ task.created }}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text type="supporting" color="secondary">
                      {{ task.updated }}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Avatar :name="task.assignee" size="sm" />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu :has-chevron="false" :items="rowMenuItems">
                      <template #trigger="triggerProps">
                        <IconButton v-bind="triggerProps" label="Actions" variant="ghost" size="sm">
                          <Icon name="heroicons:ellipsis-horizontal" size="sm" />
                        </IconButton>
                      </template>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </template>
            </template>
          </template>
        </TableBody>
      </Table>
    </LayoutContent>

    <template v-if="selectedTask" #end>
      <ResizeHandle :resizable="detailPanel.props" is-reversed :is-always-visible="false" />
      <LayoutPanel
        has-divider
        :resizable="detailPanel.props"
        :padding="4"
        role="complementary"
        label="Task details"
      >
        <VStack :gap="4">
          <HStack :gap="2" align="center">
            <StackItem size="fill">
              <Text type="supporting" color="secondary">
                {{ selectedTask.taskId }}
              </Text>
            </StackItem>
            <Button label="Close panel" variant="ghost" size="sm" is-icon-only @click="selectedTask = null">
              <template #icon>
                <Icon icon="i-heroicons-x-mark" size="sm" />
              </template>
            </Button>
          </HStack>
          <VStack :gap="1">
            <Heading :level="3">
              {{ selectedTask.title }}
            </Heading>
            <Text v-if="selectedTask.subtitle" type="body" color="secondary">
              {{ selectedTask.subtitle }}
            </Text>
          </VStack>
          <MetadataList :label="{ position: 'start' }">
            <MetadataListItem label="Status">
              <HStack :gap="2" align="center">
                <StatusDot :variant="STATUS_DOT[selectedTask.status]" :label="STATUS_LABEL[selectedTask.status]" />
                <Text>{{ STATUS_LABEL[selectedTask.status] }}</Text>
              </HStack>
            </MetadataListItem>
            <MetadataListItem label="Priority">
              <HStack :gap="2" align="center">
                <Icon icon="i-heroicons-chart-bar-solid" size="sm" :color="PRIORITY_COLOR[selectedTask.priority]" />
                <Text>{{ PRIORITY_LABEL[selectedTask.priority] }}</Text>
              </HStack>
            </MetadataListItem>
            <MetadataListItem label="Assignee">
              <HStack :gap="2" align="center">
                <Avatar :name="selectedTask.assignee" size="sm" />
                <Text>{{ selectedTask.assignee }}</Text>
              </HStack>
            </MetadataListItem>
            <MetadataListItem label="Project">
              {{ selectedTask.project || '—' }}
            </MetadataListItem>
            <MetadataListItem label="Created">
              {{ selectedTask.created }}
            </MetadataListItem>
            <MetadataListItem label="Updated">
              {{ selectedTask.updated }}
            </MetadataListItem>
          </MetadataList>
          <template v-if="selectedTask.tags.length > 0">
            <Divider />
            <VStack :gap="2">
              <Text type="label">
                Labels
              </Text>
              <HStack :gap="2">
                <Badge v-for="tag in selectedTask.tags" :key="tag" variant="neutral" :label="tag" />
              </HStack>
            </VStack>
          </template>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>

  <Dialog v-model:is-open="dialogOpen">
    <Layout>
      <template #header>
        <DialogHeader title="Create Issue" @update:is-open="dialogOpen = $event" />
      </template>
      <LayoutContent :padding="4">
        <VStack :gap="4">
          <TextInput label="Title" placeholder="Issue title" />
          <Selector label="Status" model-value="todo" :options="[{ value: 'in_progress', label: 'In Progress' }, { value: 'todo', label: 'Todo' }, { value: 'backlog', label: 'Backlog' }]" />
          <Selector label="Priority" model-value="none" :options="[{ value: 'urgent', label: 'Urgent' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }, { value: 'none', label: 'No priority' }]" />
          <TextInput label="Project" placeholder="Project name" />
        </VStack>
      </LayoutContent>
      <template #footer>
        <LayoutFooter has-divider>
          <HStack :gap="2" justify="end">
            <Button label="Cancel" variant="secondary" @click="dialogOpen = false" />
            <Button label="Create" variant="primary" @click="dialogOpen = false" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Dialog>
</template>

<style scoped>
/* 没有筛选条件时，PowerSearch 的空 token 容器仍占满剩余宽度，把输入框挤到中间。
   容器空的时候让它不占位，占位文字就回到最左边。 */
:deep(.astryx-power-search-tokens:empty) {
  flex: 0 0 auto;
}

/* 控件高度 32，和原版一致。 */
:deep(.astryx-power-search-control) {
  min-height: 32px;
}

:deep(.astryx-power-search-input) {
  height: 22px;
}

/* StatusDot 没有 accent 变体，这里按原版的强调色补上。 */
:deep(.astryx-status-dot[data-variant='accent']) {
  background-color: var(--astryx-color-accent);
}

.group-header-cell {
  cursor: pointer;
  background: var(--astryx-color-background-muted);
  padding: var(--astryx-spacing-3) var(--astryx-spacing-4);
}
</style>
