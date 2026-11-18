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
  isTableGroupHeader,
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
  ResizeHandle,
  Selector,
  StatusDot,
  StackItem,
  Table,
  Text,
  TextInput,
  useImperativeAlertDialog,
  useResizable,
  useTableGroupedRows,
  usePowerSearchConfig,
  useToast,
  VisuallyHidden,
  VStack,
} from '@astryx-vue/core'
import type { PowerSearchFilter, TableColumn, TablePlugin } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

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
  { id: '1', taskId: 'TASK-1001', title: 'Update user interface', subtitle: 'Update payment gateway integration', status: 'in_progress', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'Olivia Martin' },
  { id: '2', taskId: 'TASK-1002', title: 'Use Projects to organize work for features or releases', subtitle: '', status: 'in_progress', priority: 'medium', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Jackson Lee' },
  { id: '3', taskId: 'TASK-1003', title: 'Use Cycles to focus work over n-weeks', subtitle: '', status: 'in_progress', priority: 'medium', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Isabella Nguyen' },
  { id: '4', taskId: 'TASK-1004', title: 'Testing code', subtitle: 'Update payment gateway integration', status: 'todo', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'William Kim' },
  { id: '5', taskId: 'TASK-1005', title: 'Update backend code', subtitle: 'Update payment gateway integration', status: 'todo', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'Sofia Davis' },
  { id: '6', taskId: 'TASK-1006', title: 'Update front end code', subtitle: 'Update payment gateway integration', status: 'todo', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'Mia Wilson' },
  { id: '7', taskId: 'TASK-1007', title: 'Update payment gateway integration', subtitle: '', status: 'todo', priority: 'high', project: 'Payment gateway integration 2.0', tags: ['Improvement', '3rd Party'], created: 'Jul 3', updated: 'Jul 3', assignee: 'Lucas Brown' },
  { id: '8', taskId: 'TASK-1008', title: 'Update payment gateway backend code', subtitle: '', status: 'todo', priority: 'medium', project: '', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'Ethan Jones' },
  { id: '9', taskId: 'TASK-1009', title: 'Invite your teammates', subtitle: '', status: 'todo', priority: 'low', project: '', tags: [], created: 'Jul 1', updated: 'Jul 1', assignee: 'Ava Taylor' },
  { id: '10', taskId: 'TASK-1010', title: 'Next steps', subtitle: '', status: 'todo', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Noah Garcia' },
  { id: '11', taskId: 'TASK-1011', title: 'Welcome to Linear', subtitle: '', status: 'backlog', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Olivia Martin' },
  { id: '12', taskId: 'TASK-1012', title: 'Connect GitHub or GitLab', subtitle: '', status: 'backlog', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Jackson Lee' },
  { id: '13', taskId: 'TASK-1013', title: 'Customize settings', subtitle: '', status: 'backlog', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Isabella Nguyen' },
  { id: '14', taskId: 'TASK-1014', title: 'Try 3 ways to navigate: Command menu, keyboard or mouse', subtitle: '', status: 'done', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'William Kim' },
  { id: '15', taskId: 'TASK-1015', title: 'Connect to Slack', subtitle: '', status: 'done', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Sofia Davis' },
  { id: '16', taskId: 'TASK-1016', title: 'Migrate database schema to v2', subtitle: 'Payment gateway integration', status: 'in_progress', priority: 'high', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 4', updated: 'Jul 5', assignee: 'Lucas Brown' },
  { id: '17', taskId: 'TASK-1017', title: 'Write integration tests for checkout flow', subtitle: '', status: 'in_progress', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 4', updated: 'Jul 5', assignee: 'Ethan Jones' },
  { id: '18', taskId: 'TASK-1018', title: 'Set up CI/CD pipeline for staging', subtitle: '', status: 'in_progress', priority: 'high', project: '', tags: [], created: 'Jul 2', updated: 'Jul 5', assignee: 'Ava Taylor' },
  { id: '19', taskId: 'TASK-1019', title: 'Add rate limiting to public API endpoints', subtitle: '', status: 'todo', priority: 'urgent', project: '', tags: [], created: 'Jul 5', updated: 'Jul 5', assignee: 'Noah Garcia' },
  { id: '20', taskId: 'TASK-1020', title: 'Refactor auth middleware to support OAuth2', subtitle: '', status: 'todo', priority: 'high', project: '', tags: [], created: 'Jul 4', updated: 'Jul 5', assignee: 'Olivia Martin' },
  { id: '21', taskId: 'TASK-1021', title: 'Design error pages for 404 and 500', subtitle: '', status: 'todo', priority: 'low', project: '', tags: [], created: 'Jul 3', updated: 'Jul 4', assignee: 'Mia Wilson' },
  { id: '22', taskId: 'TASK-1022', title: 'Audit third-party dependencies for vulnerabilities', subtitle: '', status: 'todo', priority: 'medium', project: '', tags: [], created: 'Jul 5', updated: 'Jul 5', assignee: 'Jackson Lee' },
  { id: '23', taskId: 'TASK-1023', title: 'Implement webhook retry logic with exponential backoff', subtitle: 'Payment gateway integration', status: 'todo', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 4', updated: 'Jul 5', assignee: 'William Kim' },
  { id: '24', taskId: 'TASK-1024', title: 'Add dark mode support to dashboard', subtitle: '', status: 'backlog', priority: 'low', project: '', tags: [], created: 'Jul 2', updated: 'Jul 3', assignee: 'Sofia Davis' },
  { id: '25', taskId: 'TASK-1025', title: 'Create onboarding flow for new team members', subtitle: '', status: 'backlog', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 2', assignee: 'Isabella Nguyen' },
  { id: '26', taskId: 'TASK-1026', title: 'Set up error tracking with Sentry', subtitle: '', status: 'backlog', priority: 'medium', project: '', tags: [], created: 'Jul 3', updated: 'Jul 4', assignee: 'Ethan Jones' },
  { id: '27', taskId: 'TASK-1027', title: 'Improve search performance with indexing', subtitle: '', status: 'backlog', priority: 'low', project: '', tags: [], created: 'Jul 2', updated: 'Jul 3', assignee: 'Ava Taylor' },
  { id: '28', taskId: 'TASK-1028', title: 'Write API documentation for v2 endpoints', subtitle: '', status: 'done', priority: 'medium', project: '', tags: [], created: 'Jun 28', updated: 'Jul 3', assignee: 'Noah Garcia' },
  { id: '29', taskId: 'TASK-1029', title: 'Set up staging environment', subtitle: '', status: 'done', priority: 'high', project: '', tags: [], created: 'Jun 25', updated: 'Jul 1', assignee: 'Lucas Brown' },
  { id: '30', taskId: 'TASK-1030', title: 'Fix flaky end-to-end tests in CI', subtitle: '', status: 'done', priority: 'medium', project: '', tags: [], created: 'Jun 30', updated: 'Jul 2', assignee: 'Mia Wilson' },
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
const collapsedGroups = ref<Set<string>>(new Set())
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

function toggleGroup(key: string): void {
  const next = new Set(collapsedGroups.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  collapsedGroups.value = next
}

function changeGroupBy(value: GroupByField): void {
  groupBy.value = value
  collapsedGroups.value = new Set()
}

// 分组行交给 useTableGroupedRows：组头行由表格自己画，和原版一致。
const grouped = useTableGroupedRows<TaskRow>(() => ({
  data: filtered.value,
  groupBy: task => groupBy.value === 'none'
    ? ''
    : groupLabel(groupBy.value, String(task[groupBy.value]) || '—'),
  collapsedGroups: collapsedGroups.value,
  onToggleGroup: toggleGroup,
  getRowKey: task => task.id,
  renderGroupHeader: (key, count) => h(HStack, { gap: 2, vAlign: 'center' }, () => [
    h(Text, { type: 'body', weight: 'bold' }, () => key),
    h(Badge, { variant: 'neutral', label: String(count) }),
  ]),
}))

// 点行打开详情面板；组头行（id 为空）不处理。
const openTaskPlugin: TablePlugin<TaskRow> = {
  rowPatch(task) {
    if (isTableGroupHeader(task))
      return null
    return { onClick: () => { selectedTask.value = task } }
  },
}

const tablePlugins = computed(() => groupBy.value === 'none'
  ? { openTask: openTaskPlugin }
  : { grouped: grouped.plugin, openTask: openTaskPlugin })

// 演示用：菜单项只弹提示，换成真正执行动作的调用即可；删除先确认。
const showToast = useToast()
const { show: showConfirm, hide: hideConfirm, Host: ConfirmHost } = useImperativeAlertDialog()

function demoToast(body: string, uniqueID: string): void {
  showToast({ body, uniqueID })
}

function rowMenuItems(task: TaskRow) {
  return [
    { label: 'Edit issue', icon: 'i-heroicons-pencil', onClick: () => demoToast(`Demo: editing ${task.taskId} would open here`, `edit-${task.taskId}`) },
    { label: 'Assign to...', icon: 'i-heroicons-user', onClick: () => demoToast(`Demo: assigning ${task.taskId} would happen here`, `assigning-${task.taskId}`) },
    { label: 'Add label', icon: 'i-heroicons-tag', onClick: () => demoToast(`Demo: labeling ${task.taskId} would happen here`, `labeling-${task.taskId}`) },
    { label: 'Duplicate', icon: 'i-heroicons-document-duplicate', onClick: () => demoToast(`Demo: ${task.taskId} would be duplicated here`, `duplicate-${task.taskId}`) },
    { label: 'Move to project', icon: 'i-heroicons-arrow-right', onClick: () => demoToast(`Demo: moving ${task.taskId} would happen here`, `moving-${task.taskId}`) },
    { type: 'divider' as const },
    {
      label: 'Delete issue',
      icon: 'i-heroicons-trash',
      onClick: () => showConfirm({
        title: `Delete ${task.taskId}?`,
        description: 'This demo won\'t delete anything.',
        actionLabel: 'Delete issue',
        onAction: () => {
          hideConfirm()
          demoToast(`Demo: ${task.taskId} would be deleted here`, `delete-${task.taskId}`)
        },
      }),
    },
  ]
}

const columns: TableColumn<TaskRow>[] = [
  {
    key: 'status',
    header: () => h(VisuallyHidden, () => 'Status'),
    width: pixel(44),
    renderCell: task => h(Center, { axis: 'horizontal' }, () =>
      h(StatusDot, { variant: STATUS_DOT[task.status], label: STATUS_LABEL[task.status] })),
  },
  {
    key: 'title',
    header: 'Issue',
    width: proportional(1),
    renderCell: task => h(HStack, { gap: 3, vAlign: 'center' }, () => [
      h(Icon, { icon: 'i-heroicons-chart-bar-solid', size: 'sm', color: PRIORITY_COLOR[task.priority] }),
      h(Text, { type: 'supporting', color: 'secondary' }, () => task.taskId),
      h(Text, { type: 'body', maxLines: 1 }, () => task.title),
      task.subtitle
        ? h(Text, { type: 'body', color: 'secondary', maxLines: 1 }, () => `› ${task.subtitle}`)
        : null,
    ]),
  },
  {
    key: 'project',
    header: 'Project',
    width: pixel(180),
    renderCell: task => task.project
      ? h(Text, { type: 'body', maxLines: 1 }, () => task.project)
      : h(Text, { type: 'supporting', color: 'secondary' }, () => '—'),
  },
  {
    key: 'created',
    header: 'Created',
    width: pixel(88),
    renderCell: task => h(Text, { type: 'supporting', color: 'secondary' }, () => task.created),
  },
  {
    key: 'updated',
    header: 'Updated',
    width: pixel(88),
    renderCell: task => h(Text, { type: 'supporting', color: 'secondary' }, () => task.updated),
  },
  {
    key: 'assignee',
    header: 'Assignee',
    width: pixel(88),
    renderCell: task => h(Avatar, { name: task.assignee, size: 'sm' }),
  },
  {
    key: 'actions',
    header: () => h(VisuallyHidden, () => 'Actions'),
    width: pixel(56),
    renderCell: task => h(DropdownMenu, {
      button: {
        label: 'Actions',
        variant: 'ghost',
        size: 'sm',
        icon: () => h(Icon, { icon: 'i-heroicons-ellipsis-horizontal', size: 'sm' }),
        isIconOnly: true,
      },
      hasChevron: false,
      items: rowMenuItems(task),
    }),
  },
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
                  <RadioList :model-value="groupBy" label="Group by" @update:model-value="v => changeGroupBy(v as GroupByField)">
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
      <Table
        :data="groupBy === 'none' ? filtered : grouped.data.value"
        :columns="columns"
        :id-key="groupBy === 'none' ? 'id' : grouped.idKey"
        density="balanced"
        dividers="rows"
        text-overflow="truncate"
        has-hover
        :plugins="tablePlugins"
      />
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
          <TextInput model-value="" label="Title" placeholder="Issue title" />
          <Selector label="Status" model-value="todo" :options="[{ value: 'in_progress', label: 'In Progress' }, { value: 'todo', label: 'Todo' }, { value: 'backlog', label: 'Backlog' }]" />
          <Selector label="Priority" model-value="none" :options="[{ value: 'urgent', label: 'Urgent' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }, { value: 'none', label: 'No priority' }]" />
          <TextInput model-value="" label="Project" placeholder="Project name" />
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
  <ConfirmHost />
</template>

