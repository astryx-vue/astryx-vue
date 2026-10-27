<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogHeader,
  Divider,
  DropdownMenu,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
  MetadataList,
  MetadataListItem,
  pixel,
  Popover,
  proportional,
  RadioList,
  RadioListItem,
  ResizeHandle,
  StatusDot,
  StackItem,
  Table,
  Text,
  TextInput,
  useResizable,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { computed, h, ref, watch } from 'vue'

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
  { id: '4', taskId: 'T235040472', title: 'Testing code', subtitle: 'Update payment gateway integration', status: 'todo', priority: 'medium', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 3', updated: 'Jul 3', assignee: 'William Kim' },
  { id: '7', taskId: 'T235040475', title: 'Update payment gateway integration', subtitle: '', status: 'todo', priority: 'high', project: 'Payment gateway integration 2.0', tags: ['Improvement', '3rd Party'], created: 'Jul 3', updated: 'Jul 3', assignee: 'Lucas Brown' },
  { id: '9', taskId: 'T235040477', title: 'Invite your teammates', subtitle: '', status: 'todo', priority: 'low', project: '', tags: [], created: 'Jul 1', updated: 'Jul 1', assignee: 'Ava Taylor' },
  { id: '11', taskId: 'T235040479', title: 'Welcome to Linear', subtitle: '', status: 'backlog', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'Olivia Martin' },
  { id: '14', taskId: 'T235040482', title: 'Try 3 ways to navigate: Command menu, keyboard or mouse', subtitle: '', status: 'done', priority: 'none', project: '', tags: [], created: 'Jul 1', updated: 'Jul 3', assignee: 'William Kim' },
  { id: '16', taskId: 'T235040484', title: 'Migrate database schema to v2', subtitle: 'Payment gateway integration', status: 'in_progress', priority: 'high', project: 'Payment gateway integration 2.0', tags: [], created: 'Jul 4', updated: 'Jul 5', assignee: 'Lucas Brown' },
  { id: '19', taskId: 'T235040487', title: 'Add rate limiting to public API endpoints', subtitle: '', status: 'todo', priority: 'urgent', project: '', tags: [], created: 'Jul 5', updated: 'Jul 5', assignee: 'Noah Garcia' },
  { id: '24', taskId: 'T235040492', title: 'Add dark mode support to dashboard', subtitle: '', status: 'backlog', priority: 'low', project: '', tags: [], created: 'Jul 2', updated: 'Jul 3', assignee: 'Sofia Davis' },
  { id: '28', taskId: 'T235040496', title: 'Write API documentation for v2 endpoints', subtitle: '', status: 'done', priority: 'medium', project: '', tags: [], created: 'Jun 28', updated: 'Jul 3', assignee: 'Noah Garcia' },
]

const STATUS_LABEL: Record<TaskStatus, string> = {
  in_progress: 'In Progress',
  todo: 'Todo',
  backlog: 'Backlog',
  done: 'Done',
}

const STATUS_DOT: Record<TaskStatus, 'info' | 'warning' | 'neutral' | 'success'> = {
  in_progress: 'info',
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

const query = ref('')
const groupBy = ref<GroupByField>('status')
const expandedGroups = ref<Set<string>>(new Set(GROUP_ORDER))
const selectedTask = ref<TaskRow | null>(null)
const dialogOpen = ref(false)
const newIssueTitle = ref('')

const detailPanel = useResizable({
  defaultSize: 360,
  minSize: 280,
  maxSize: 500,
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q)
    return ALL_TASKS
  return ALL_TASKS.filter(
    t =>
      t.title.toLowerCase().includes(q)
      || t.taskId.toLowerCase().includes(q)
      || t.subtitle.toLowerCase().includes(q),
  )
})

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
  {
    key: 'status',
    header: '',
    width: pixel(44),
    renderCell: item => h(StatusDot, { variant: STATUS_DOT[item.status], label: STATUS_LABEL[item.status] }),
  },
  {
    key: 'title',
    header: 'Issue',
    width: proportional(1),
    renderCell: item => h(HStack, { gap: 3, vAlign: 'center', style: { cursor: 'pointer' }, onClick: () => onRowActivate(item) }, () => [
      h(Icon, { icon: 'i-heroicons-chart-bar-solid', size: 'sm', color: PRIORITY_COLOR[item.priority] }),
      h(Text, { type: 'supporting', color: 'secondary' }, () => item.taskId),
      h(Text, { type: 'body', maxLines: 1 }, () => item.title),
      item.subtitle
        ? h(Text, { type: 'body', color: 'secondary', maxLines: 1 }, () => `› ${item.subtitle}`)
        : null,
    ]),
  },
  {
    key: 'project',
    header: 'Project',
    width: pixel(180),
    renderCell: item => item.project
      ? h(Text, { type: 'body', maxLines: 1 }, () => item.project)
      : h(Text, { type: 'supporting', color: 'secondary' }, () => '—'),
  },
  { key: 'created', header: 'Created', width: pixel(72), renderCell: item => h(Text, { type: 'supporting', color: 'secondary' }, () => item.created) },
  { key: 'updated', header: 'Updated', width: pixel(72), renderCell: item => h(Text, { type: 'supporting', color: 'secondary' }, () => item.updated) },
  {
    key: 'assignee',
    header: 'Assignee',
    width: pixel(52),
    renderCell: item => h(Avatar, { name: item.assignee, size: 'sm' }),
  },
  {
    key: 'actions',
    header: '',
    width: pixel(56),
    renderCell: () => h(DropdownMenu, {
      button: { label: 'Actions', variant: 'ghost', size: 'sm', isIconOnly: true },
      hasChevron: false,
      items: [{ label: 'Edit issue' }, { label: 'Duplicate' }, { type: 'divider' }, { label: 'Delete issue' }],
    }),
  },
]

function onRowActivate(task: TaskRow): void {
  selectedTask.value = task
}
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
              <TextInput
                v-model="query"
                label="Filter issues"
                is-label-hidden
                placeholder="Filter issues…"
              />
            </StackItem>
            <Text type="supporting" color="secondary">
              {{ filtered.length }} issue{{ filtered.length === 1 ? '' : 's' }}
            </Text>
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
              <Button label="View options" variant="secondary" size="md" />
            </Popover>
          </HStack>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="0" role="main">
      <VStack :gap="0">
        <template v-for="key in groupKeys" :key="key">
          <button
            v-if="groupBy !== 'none'"
            type="button"
            class="group-header"
            @click="toggleGroup(key)"
          >
            <HStack :gap="2" align="center">
              <Icon
                :icon="expandedGroups.has(key) ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                size="sm"
                color="secondary"
              />
              <Text weight="bold">
                {{ groupLabel(groupBy, key) }}
              </Text>
              <Badge variant="neutral" :label="String(grouped.get(key)?.length ?? 0)" />
            </HStack>
          </button>
          <Table
            v-if="groupBy === 'none' || expandedGroups.has(key)"
            :data="grouped.get(key) ?? []"
            :columns="columns"
            id-key="id"
            density="balanced"
            dividers="rows"
            text-overflow="truncate"
            has-hover
          />
        </template>
      </VStack>
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
        <DialogHeader title="Create issue" @update:is-open="dialogOpen = $event" />
      </template>
      <LayoutContent :padding="4">
        <VStack :gap="4">
          <TextInput v-model="newIssueTitle" label="Title" placeholder="Issue title" />
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
.group-header {
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: start;
  background: var(--astryx-color-background-muted);
  padding: var(--astryx-spacing-3) var(--astryx-spacing-4);
}
</style>
