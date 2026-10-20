<script setup lang="ts">
import {
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutHeader,
  MoreMenu,
  Section,
  Selector,
  StatusDot,
  Text,
  Toolbar,
  Tooltip,
  VStack,
} from '@astryx-vue/core'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type ColumnId = 'todo' | 'in-progress' | 'in-review' | 'done'
type Priority = 'high' | 'medium' | 'low'

interface WorkItem {
  id: string
  column: ColumnId
  ref: string
  priority: Priority
  title: string
  description: string
  lastEdited: string
  dueDate: string
}

interface ColumnMeta {
  id: ColumnId
  title: string
  variant: 'neutral' | 'info' | 'warning' | 'success'
  tooltip: string
  emptyTitle: string
  emptyDescription: string
  emptyIcon: string
}

interface DropTarget {
  column: ColumnId
  index: number
}

interface DragState {
  id: string
  width: number
  height: number
  offsetX: number
  offsetY: number
  pointerX: number
  pointerY: number
  target: DropTarget | null
}

const COLUMNS: ColumnMeta[] = [
  {
    id: 'todo',
    title: 'To-do',
    variant: 'neutral',
    tooltip: 'Items assigned to this sprint, waiting to be picked up.',
    emptyTitle: 'To-do is empty',
    emptyDescription: 'Items pulled into this sprint appear here.',
    emptyIcon: 'i-heroicons-inbox',
  },
  {
    id: 'in-progress',
    title: 'In progress',
    variant: 'info',
    tooltip: 'Items currently in progress.',
    emptyTitle: 'Nothing in progress',
    emptyDescription: 'Items being worked on appear here.',
    emptyIcon: 'i-heroicons-arrow-path',
  },
  {
    id: 'in-review',
    title: 'In review',
    variant: 'warning',
    tooltip: 'Items waiting for your review.',
    emptyTitle: 'Nothing in review',
    emptyDescription: 'Items awaiting your review appear here.',
    emptyIcon: 'i-heroicons-clipboard-document-check',
  },
  {
    id: 'done',
    title: 'Done',
    variant: 'success',
    tooltip: 'Items that have been handled.',
    emptyTitle: 'Nothing done yet',
    emptyDescription: 'Completed items appear here.',
    emptyIcon: 'i-heroicons-check-circle',
  },
]

const PRIORITY_META: Record<Priority, { label: string, variant: 'error' | 'warning' | 'teal' }> = {
  high: { label: 'High', variant: 'error' },
  medium: { label: 'Medium', variant: 'warning' },
  low: { label: 'Low', variant: 'teal' },
}

const INITIAL_ITEMS: WorkItem[] = [
  {
    id: 't1',
    column: 'todo',
    ref: 'Task 4821',
    priority: 'low',
    title: 'Draft project kickoff brief',
    description: 'Write a short brief outlining goals, scope, and success criteria for the upcoming project.',
    lastEdited: '2h ago',
    dueDate: 'Jul 8',
  },
  {
    id: 't2',
    column: 'todo',
    ref: 'Task 4842',
    priority: 'low',
    title: 'Collect feedback from stakeholders',
    description: 'Gather input from key stakeholders and summarize the main themes for the next review.',
    lastEdited: '1d ago',
    dueDate: 'Jul 11',
  },
  {
    id: 'p1',
    column: 'in-progress',
    ref: 'Task 4825',
    priority: 'high',
    title: 'Design the landing page layout',
    description: 'Create a first-pass layout for the landing page and share it for early feedback.',
    lastEdited: '18m ago',
    dueDate: 'Jul 3',
  },
  {
    id: 'p2',
    column: 'in-progress',
    ref: 'Task 4833',
    priority: 'medium',
    title: 'Set up the project workspace',
    description: 'Configure the shared workspace and invite the team so everyone has access.',
    lastEdited: '5m ago',
    dueDate: 'Jul 4',
  },
  {
    id: 'r1',
    column: 'done',
    ref: 'Task 4788',
    priority: 'low',
    title: 'Write the weekly status update',
    description: 'Summarize progress, blockers, and next steps in a short update for the team.',
    lastEdited: 'Yesterday',
    dueDate: 'Jul 1',
  },
  {
    id: 'r2',
    column: 'done',
    ref: 'Task 4789',
    priority: 'high',
    title: 'Prepare the demo walkthrough',
    description: 'Put together a short walkthrough covering the main features for the demo.',
    lastEdited: '3d ago',
    dueDate: 'Jun 30',
  },
  {
    id: 'r3',
    column: 'done',
    ref: 'Task 4790',
    priority: 'medium',
    title: 'Review and merge open changes',
    description: 'Go through the pending changes, leave comments, and merge the ones that are ready.',
    lastEdited: '4d ago',
    dueDate: 'Jun 28',
  },
]

const DRAG_THRESHOLD = 5
const COLUMN_WIDTH = 300

const items = ref<WorkItem[]>([...INITIAL_ITEMS])
const sprint = ref('003')
const drag = ref<DragState | null>(null)

const columnEls = new Map<ColumnId, HTMLElement>()
const cardEls = new Map<string, HTMLElement>()
let teardownDrag: (() => void) | null = null

const itemsByColumn = computed(() => {
  const map: Record<ColumnId, WorkItem[]> = {
    todo: [],
    'in-progress': [],
    'in-review': [],
    done: [],
  }
  for (const item of items.value)
    map[item.column].push(item)
  return map
})

const draggedItem = computed(() => drag.value ? items.value.find(it => it.id === drag.value!.id) : undefined)

function setColumnEl(id: ColumnId, el: HTMLElement | null): void {
  if (el)
    columnEls.set(id, el)
  else
    columnEls.delete(id)
}

function setCardEl(id: string, el: HTMLElement | null): void {
  if (el)
    cardEls.set(id, el)
  else
    cardEls.delete(id)
}

function moveItem(id: string, to: ColumnId): void {
  items.value = items.value.map(item => item.id === id ? { ...item, column: to } : item)
}

function computeTarget(px: number, py: number, draggedId: string): DropTarget | null {
  for (const [colId, el] of columnEls.entries()) {
    const r = el.getBoundingClientRect()
    if (px < r.left || px > r.right || py < r.top || py > r.bottom)
      continue
    const ids = itemsByColumn.value[colId]
      .filter(it => it.id !== draggedId)
      .map(it => it.id)
    let index = ids.length
    for (let i = 0; i < ids.length; i++) {
      const cardEl = cardEls.get(ids[i])
      if (!cardEl)
        continue
      const cr = cardEl.getBoundingClientRect()
      if (py < cr.top + cr.height / 2) {
        index = i
        break
      }
    }
    return { column: colId, index }
  }
  return null
}

function commitDrag(id: string, target: DropTarget): void {
  const moved = items.value.find(it => it.id === id)
  if (!moved)
    return
  const rest = items.value.filter(it => it.id !== id)
  const updated: WorkItem = { ...moved, column: target.column }
  const colItems = rest.filter(it => it.column === target.column)
  const anchor = colItems[target.index]
  if (!anchor) {
    items.value = [...rest, updated]
    return
  }
  const at = rest.indexOf(anchor)
  items.value = [...rest.slice(0, at), updated, ...rest.slice(at)]
}

function menuItemsFor(item: WorkItem) {
  const moveTargets = COLUMNS
    .filter(c => c.id !== item.column)
    .map(c => ({
      label: `Move to ${c.title}`,
      onClick: () => moveItem(item.id, c.id),
    }))
  return [
    { label: 'Open', onClick: () => {} },
    { label: 'Assign to me', onClick: () => {} },
    { type: 'divider' as const },
    ...moveTargets,
  ]
}

function onCardPointerDown(event: PointerEvent, id: string): void {
  if (event.button !== 0)
    return
  const target = event.target as HTMLElement
  if (target.closest('button, [role="menuitem"], [role="menu"]'))
    return
  const el = cardEls.get(id)
  if (!el)
    return
  const rect = el.getBoundingClientRect()
  const startX = event.clientX
  const startY = event.clientY
  const offsetX = startX - rect.left
  const offsetY = startY - rect.top
  const { width, height } = rect
  let started = false
  let dropTarget: DropTarget | null = null

  function onMove(ev: PointerEvent): void {
    if (!started && Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < DRAG_THRESHOLD)
      return
    started = true
    dropTarget = computeTarget(ev.clientX, ev.clientY, id)
    drag.value = {
      id,
      width,
      height,
      offsetX,
      offsetY,
      pointerX: ev.clientX,
      pointerY: ev.clientY,
      target: dropTarget,
    }
  }

  function onUp(): void {
    teardownDrag?.()
    if (started && dropTarget)
      commitDrag(id, dropTarget)
    drag.value = null
  }

  function teardown(): void {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    teardownDrag = null
  }
  teardownDrag = teardown
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

function columnCards(colId: ColumnId): WorkItem[] {
  const colItems = itemsByColumn.value[colId]
  return drag.value ? colItems.filter(it => it.id !== drag.value!.id) : colItems
}

function ghostIndex(colId: ColumnId): number | null {
  if (!drag.value?.target || drag.value.target.column !== colId)
    return null
  return drag.value.target.index
}

watch(drag, (state) => {
  if (state) {
    const previous = document.body.style.userSelect
    document.body.style.userSelect = 'none'
    return () => {
      document.body.style.userSelect = previous
    }
  }
  return undefined
})

onBeforeUnmount(() => {
  teardownDrag?.()
})
</script>

<template>
  <Section height="100dvh">
    <Layout height="fill">
      <template #header>
        <LayoutHeader has-divider :padding="4">
          <Toolbar label="Board actions" :gap="2">
            <template #start>
              <Heading :level="3">
                Sprint Board
              </Heading>
              <Badge :label="String(items.length)" variant="neutral" />
            </template>
            <template #end>
              <HStack :gap="2">
                <Selector
                  v-model="sprint"
                  label="Sprint"
                  :width="200"
                  is-label-hidden
                  :options="[
                    { value: '003', label: 'Sprint 003' },
                    { value: '002', label: 'Sprint 002' },
                    { value: '001', label: 'Sprint 001' },
                  ]"
                />
                <Divider variant="strong" orientation="vertical" class="toolbar-divider" />
                <HStack :gap="1" align="center">
                  <IconButton label="Sort">
                    <Icon icon="i-heroicons-arrows-up-down" size="sm" />
                  </IconButton>
                  <IconButton label="Filter">
                    <Icon icon="i-heroicons-funnel" size="sm" />
                  </IconButton>
                  <IconButton label="Search">
                    <Icon icon="i-heroicons-magnifying-glass" size="sm" />
                  </IconButton>
                </HStack>
                <Button label="Add task" variant="primary">
                  <template #icon>
                    <Icon icon="i-heroicons-plus" size="sm" />
                  </template>
                </Button>
              </HStack>
            </template>
          </Toolbar>
        </LayoutHeader>
      </template>

      <LayoutContent :padding="0">
        <HStack class="board-columns" :gap="4">
          <Card
            v-for="meta in COLUMNS"
            :key="meta.id"
            variant="muted"
            :padding="0"
            class="column-shell"
          >
            <Layout height="fill">
              <template #header>
                <LayoutHeader has-divider :padding="3">
                  <HStack justify="between" align="center">
                    <HStack :gap="2" align="center">
                      <StatusDot :variant="meta.variant" :label="`${meta.title} status`" />
                      <Heading :level="4">
                        {{ meta.title }}
                      </Heading>
                      <Tooltip :content="meta.tooltip">
                        <Icon icon="i-heroicons-information-circle" size="sm" color="secondary" />
                      </Tooltip>
                    </HStack>
                    <Text type="supporting" color="secondary" has-tabular-numbers>
                      {{ itemsByColumn[meta.id].length }}
                    </Text>
                  </HStack>
                </LayoutHeader>
              </template>
              <LayoutContent
                :ref="(el) => setColumnEl(meta.id, el as HTMLElement | null)"
                :padding="2"
              >
                <template v-if="columnCards(meta.id).length === 0 && ghostIndex(meta.id) == null">
                  <EmptyState
                    is-compact
                    class="column-empty-state"
                    :title="meta.emptyTitle"
                    :description="meta.emptyDescription"
                  >
                    <template #icon>
                      <Icon :icon="meta.emptyIcon" size="lg" color="secondary" />
                    </template>
                  </EmptyState>
                </template>
                <VStack v-else :gap="2">
                  <template
                    v-for="(item, index) in columnCards(meta.id)"
                    :key="item.id"
                  >
                    <div
                      v-if="ghostIndex(meta.id) === index"
                      class="drag-ghost"
                      :style="{ height: `${drag?.height ?? 0}px` }"
                    />
                    <Card
                      :ref="(el) => setCardEl(item.id, el as HTMLElement | null)"
                      :padding="3"
                      class="board-card"
                      @pointerdown="onCardPointerDown($event, item.id)"
                    >
                      <VStack :gap="2">
                        <HStack justify="between" align="start">
                          <HStack :gap="1" align="center" wrap="wrap">
                            <Badge :label="item.ref" variant="neutral" />
                            <Badge :label="PRIORITY_META[item.priority].label" :variant="PRIORITY_META[item.priority].variant" />
                          </HStack>
                          <MoreMenu label="Work item actions" size="sm" :items="menuItemsFor(item)" />
                        </HStack>
                        <VStack :gap="1">
                          <Heading :level="4">
                            {{ item.title }}
                          </Heading>
                          <Text type="supporting" color="secondary" :max-lines="2">
                            {{ item.description }}
                          </Text>
                        </VStack>
                        <Text type="supporting" color="secondary">
                          Edited {{ item.lastEdited }} · Due {{ item.dueDate }}
                        </Text>
                      </VStack>
                    </Card>
                  </template>
                  <div
                    v-if="ghostIndex(meta.id) === columnCards(meta.id).length"
                    class="drag-ghost"
                    :style="{ height: `${drag?.height ?? 0}px` }"
                  />
                </VStack>
              </LayoutContent>
            </Layout>
          </Card>
        </HStack>
      </LayoutContent>
    </Layout>

    <Card
      v-if="drag && draggedItem"
      :padding="3"
      class="floating-card"
      :style="{
        width: `${drag.width}px`,
        transform: `translate(${drag.pointerX - drag.offsetX}px, ${drag.pointerY - drag.offsetY}px)`,
      }"
    >
      <VStack :gap="2">
        <HStack justify="between" align="start">
          <HStack :gap="1" align="center" wrap="wrap">
            <Badge :label="draggedItem.ref" variant="neutral" />
            <Badge :label="PRIORITY_META[draggedItem.priority].label" :variant="PRIORITY_META[draggedItem.priority].variant" />
          </HStack>
        </HStack>
        <VStack :gap="1">
          <Heading :level="4">
            {{ draggedItem.title }}
          </Heading>
          <Text type="supporting" color="secondary" :max-lines="2">
            {{ draggedItem.description }}
          </Text>
        </VStack>
        <Text type="supporting" color="secondary">
          Edited {{ draggedItem.lastEdited }} · Due {{ draggedItem.dueDate }}
        </Text>
      </VStack>
    </Card>
  </Section>
</template>

<style scoped>
.board-columns {
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;
  padding: var(--spacing-4);
}

.column-shell {
  flex-shrink: 0;
  flex-basis: 300px;
  height: 100%;
}

.board-card {
  cursor: grab;
  user-select: none;
  touch-action: none;
  transition: box-shadow 120ms ease;
}

.board-card:hover {
  box-shadow: var(--shadow-med);
}

.floating-card {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  cursor: grabbing;
  box-shadow: var(--shadow-high);
  z-index: 1000;
}

.drag-ghost {
  border-radius: var(--radius-container);
  background-color: var(--color-background-muted);
}

.toolbar-divider {
  height: auto;
  margin-block: var(--spacing-1);
  align-self: stretch;
}

.column-empty-state {
  padding-block: var(--spacing-10);
}
</style>
