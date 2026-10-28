<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CheckboxListItem,
  ClickableCard,
  createStaticSource,
  Dialog,
  DialogHeader,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  Link,
  List,
  ListItem,
  MetadataList,
  MetadataListItem,
  MoreMenu,
  ProgressBar,
  Section,
  Selector,
  StackItem,
  StatusDot,
  Text,
  TextArea,
  Timestamp,
  Token,
  Tokenizer,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'

// ── 可编辑字段 ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' },
]

const ASSIGNEE_OPTIONS = [
  { value: 'priya-shah', label: 'Priya Shah' },
  { value: 'marcus-chen', label: 'Marcus Chen' },
  { value: 'sofia-alvarez', label: 'Sofia Alvarez' },
]

interface PriorityOption {
  value: string
  label: string
  badge: 'red' | 'orange' | 'yellow' | 'neutral'
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'high', label: 'High', badge: 'red' },
  { value: 'mid', label: 'Mid', badge: 'orange' },
  { value: 'low', label: 'Low', badge: 'yellow' },
  { value: 'none', label: 'None', badge: 'neutral' },
]

interface LabelOption {
  id: string
  label: string
  color: 'purple' | 'blue' | 'green'
}

const LABEL_OPTIONS: LabelOption[] = [
  { id: 'onboarding', label: 'Onboarding', color: 'purple' },
  { id: 'q1-goal', label: 'Q1 goal', color: 'blue' },
  { id: 'growth', label: 'Growth', color: 'green' },
]

const LABEL_SOURCE = createStaticSource(LABEL_OPTIONS)

function optionFor<T extends { value: string }>(options: readonly T[], value: string): T {
  return options.find(option => option.value === value) ?? options[0]
}

function priorityFor(value: string) {
  return PRIORITY_OPTIONS.find(option => option.value === value) ?? PRIORITY_OPTIONS[0]
}

// ── 工作项数据 ────────────────────────────────────────────────────────────────

const SUBTASKS = [
  { id: 1, title: 'Audit current onboarding flow and note friction points', isDone: true, assignee: 'Priya Shah', due: '2026-03-04' },
  { id: 2, title: 'Interview five recent sign-ups about their first-run experience', isDone: true, assignee: 'Marcus Chen', due: '2026-03-06' },
  { id: 3, title: 'Draft revised welcome sequence with three variants', isDone: false, assignee: 'Priya Shah', due: '2026-03-11' },
  { id: 4, title: 'Review copy with content design and legal', isDone: false, assignee: 'Sofia Alvarez', due: '2026-03-13' },
  { id: 5, title: 'Ship variant A to 10% of new accounts and measure activation', isDone: false, assignee: 'Marcus Chen', due: '2026-03-18' },
]

type AttachmentKind = 'link' | 'image' | 'file'

interface Attachment {
  id: string
  kind: AttachmentKind
  title: string
  subtitle: string
}

const ATTACHMENTS: Attachment[] = [
  { id: 'audit-notes', kind: 'link', title: 'Onboarding audit notes', subtitle: 'docs.example.com' },
  { id: 'funnel-dashboard', kind: 'link', title: 'Sign-up funnel dashboard', subtitle: 'analytics.example.com' },
  { id: 'welcome-screen', kind: 'image', title: 'welcome-screen-v3.png', subtitle: '1.4 MB · Added 2 days ago' },
  { id: 'transcripts', kind: 'file', title: 'Interview transcripts.pdf', subtitle: '820 KB · Added 3 days ago' },
]

const ATTACHMENT_ICONS: Record<AttachmentKind, string> = {
  link: 'i-carbon-link',
  image: 'image',
  file: 'i-carbon-document',
}

const ATTACHMENT_ACTIONS: { label: string, variant?: 'destructive' }[] = [
  { label: 'Edit' },
  { label: 'Delete', variant: 'destructive' },
]

const WATCHERS = [
  'Priya Shah',
  'Marcus Chen',
  'Sofia Alvarez',
  'Jordan Blake',
  'Lin Wei',
  'Aisha Okafor',
]

const LINKED_ITEMS = [
  { id: 'PLT-238', title: 'Track activation rate by acquisition channel' },
  { id: 'PLT-241', title: 'Welcome email A/B test — copy variants' },
]

const ACTIVITY = [
  { id: 1, kind: 'event', author: 'Sofia Alvarez', time: '2026-03-02T14:12:00Z', body: 'created this task' },
  { id: 2, kind: 'comment', author: 'Priya Shah', time: '2026-03-03T09:41:00Z', body: 'Finished the audit — three biggest friction points are the account form length, the empty first-run dashboard, and the tour tooltip cluster on step two. Full notes in the linked doc.' },
  { id: 3, kind: 'event', author: 'Marcus Chen', time: '2026-03-03T15:20:00Z', body: 'changed status from To Do to In Progress' },
  { id: 4, kind: 'comment', author: 'Marcus Chen', time: '2026-03-04T10:05:00Z', body: 'Interviews wrapped. A consistent theme: people expect a personalized starting workspace and get an empty one. Suggest we scope a template step into variant A.' },
  { id: 5, kind: 'event', author: 'Sofia Alvarez', time: '2026-03-04T16:48:00Z', body: 'assigned this task to Priya Shah' },
]

/** Section 靠负边距抵消容器的内边距，所以这一层才是主栏真正的留白。 */
const SECTION_PADDING = 6

const isNarrow = useMediaQuery('(max-width: 1024px)')

const status = ref('in_progress')
const assignee = ref('priya-shah')
const priority = ref('high')
const labels = ref([...LABEL_OPTIONS])
const subtasks = ref(SUBTASKS.map(task => ({ ...task })))
const comment = ref('')

// 宽屏用右侧栏，窄屏用对话框；两者各有自己的开关，因为默认值不一样。
const isRailOpen = ref(true)
const isDialogOpen = ref(false)
const isDetailsOpen = computed(() => (isNarrow.value ? isDialogOpen.value : isRailOpen.value))

const doneCount = computed(() => subtasks.value.filter(task => task.isDone).length)
const donePercent = computed(() =>
  subtasks.value.length ? (doneCount.value / subtasks.value.length) * 100 : 0,
)

function toggleDetails() {
  if (isNarrow.value)
    isDialogOpen.value = !isDialogOpen.value
  else
    isRailOpen.value = !isRailOpen.value
}

function setSubtaskDone(id: number, isDone: boolean) {
  subtasks.value = subtasks.value.map(task => (task.id === id ? { ...task, isDone } : task))
}
</script>

<template>
  <Layout height="fill" :content-width="1260">
    <template #header>
      <LayoutHeader :padding="6" has-divider>
        <VStack :gap="4">
          <HStack :gap="4" align="start" justify="between">
            <VStack :gap="2">
              <HStack :gap="4" align="center" wrap="wrap">
                <Link href="#" size="sm" color="secondary">
                  <HStack as="span" :gap="1" align="center">
                    <Icon icon="chevronLeft" size="sm" />
                    All Tasks
                  </HStack>
                </Link>
                <Divider orientation="vertical" :style="{ height: '12px' }" />
                <Text type="supporting" color="secondary">
                  PLT-247
                </Text>
                <Divider orientation="vertical" :style="{ height: '12px' }" />
                <Text type="supporting" color="secondary">
                  Platform / Onboarding
                </Text>
              </HStack>
              <Heading :level="1" :max-lines="2">
                Refresh onboarding flow for workspaces
              </Heading>
            </VStack>
            <IconButton
              v-if="isNarrow"
              label="Show details"
              variant="secondary"
              @click="toggleDetails"
            >
              <Icon icon="info" size="sm" />
            </IconButton>
            <HStack v-else :gap="1">
              <IconButton label="Watch" variant="secondary">
                <Icon icon="i-carbon-view" size="sm" />
              </IconButton>
              <IconButton label="Share" variant="secondary">
                <Icon icon="i-carbon-share" size="sm" />
              </IconButton>
              <IconButton label="Notify" variant="secondary">
                <Icon icon="i-carbon-notification" size="sm" />
              </IconButton>
              <Button
                :label="isDetailsOpen ? 'Hide details' : 'Show details'"
                variant="secondary"
                @click="toggleDetails"
              >
                <template #icon>
                  <Icon icon="viewColumns" size="sm" />
                </template>
              </Button>
            </HStack>
          </HStack>
          <HStack :gap="1" align="center" wrap="wrap">
            <Selector
              v-model="status"
              label="Status"
              is-label-hidden
              :options="STATUS_OPTIONS"
            />
            <Selector
              v-model="priority"
              label="Priority"
              is-label-hidden
              :options="PRIORITY_OPTIONS.map(p => ({ value: p.value, label: p.label }))"
            />
            <Selector
              v-model="assignee"
              label="Assignee"
              is-label-hidden
              searchable
              search-placeholder="Search assignees..."
              :options="ASSIGNEE_OPTIONS"
            />
            <Tokenizer
              v-model="labels"
              label="Labels"
              is-label-hidden
              :search-source="LABEL_SOURCE"
              :debounce-ms="0"
              :container-style="{ '--astryx-field-width': '320px' }"
            >
              <template #token="{ item }">
                <Token :label="item.label" :color="item.color" size="sm" />
              </template>
            </Tokenizer>
          </HStack>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="6" role="main">
      <VStack :gap="6">
        <Section :padding="SECTION_PADDING">
          <VStack :gap="4">
            <Heading :level="2">
              Description
            </Heading>
            <VStack :gap="2">
              <Text type="body">
                Reduce the drop-off between account creation and first meaningful action in a new workspace. Recent cohorts activate at 42 percent by day seven, and interview evidence points to an empty starting state and a long welcome sequence as the two largest contributors.
              </Text>
              <Text type="body">
                Ship a revised flow that shortens the sequence, seeds every new workspace with a sample project, and measures activation as the percentage of workspaces that reach three completed actions in the first three days.
              </Text>
            </VStack>
            <VStack :gap="2">
              <Heading :level="4" :accessibility-level="3">
                Success criteria
              </Heading>
              <List list-style="disc" density="compact">
                <ListItem label="Day-seven activation rises from 42 to 55 percent for new workspaces in the variant." />
                <ListItem label="Median time to first completed action drops below eight minutes." />
                <ListItem label="No regression in day-thirty retention." />
              </List>
            </VStack>
          </VStack>
        </Section>

        <Divider />

        <Section :padding="SECTION_PADDING">
          <VStack :gap="4">
            <HStack :gap="2" align="center" justify="between" wrap="wrap">
              <Heading :level="2">
                Subtasks
              </Heading>
              <Button label="Add subtask" />
            </HStack>
            <HStack :gap="3" align="center">
              <Text type="supporting" color="secondary">
                {{ doneCount }} of {{ subtasks.length }} complete
              </Text>
              <StackItem size="fill">
                <ProgressBar
                  label="Subtask progress"
                  is-label-hidden
                  :value="donePercent"
                  variant="success"
                />
              </StackItem>
            </HStack>
            <List>
              <CheckboxListItem
                v-for="task in subtasks"
                :key="task.id"
                :label="task.title"
                :is-checked="task.isDone"
                @check="setSubtaskDone(task.id, $event)"
              >
                <template #end>
                  <HStack :gap="2" align="center">
                    <Timestamp
                      :value="task.due"
                      format="date"
                      type="supporting"
                      color="secondary"
                    />
                    <Avatar :name="task.assignee" size="sm" />
                  </HStack>
                </template>
              </CheckboxListItem>
            </List>
          </VStack>
        </Section>

        <Divider />

        <Section :padding="SECTION_PADDING">
          <VStack :gap="4">
            <HStack :gap="2" align="center" justify="between" wrap="wrap">
              <Heading :level="2">
                Attachments
              </Heading>
              <Button label="Add attachment" />
            </HStack>
            <VStack :gap="1">
              <ClickableCard
                v-for="attachment in ATTACHMENTS"
                :key="attachment.id"
                :label="`Open ${attachment.title}`"
                href="#"
                :padding="3"
              >
                <HStack :gap="4" align="center">
                  <span
                    class="attachment-tile"
                    aria-hidden="true"
                  >
                    <Icon :icon="ATTACHMENT_ICONS[attachment.kind]" size="lg" color="secondary" />
                  </span>
                  <StackItem size="fill">
                    <VStack :gap="0">
                      <Text type="body" weight="semibold">
                        {{ attachment.title }}
                      </Text>
                      <Text type="supporting" color="secondary">
                        {{ attachment.subtitle }}
                      </Text>
                    </VStack>
                  </StackItem>
                  <MoreMenu
                    presentation="adaptive"
                    :label="`Actions for ${attachment.title}`"
                    :items="ATTACHMENT_ACTIONS"
                  />
                </HStack>
              </ClickableCard>
            </VStack>
          </VStack>
        </Section>

        <Divider />

        <Section :padding="SECTION_PADDING">
          <VStack :gap="10">
            <HStack :gap="2" align="center" justify="between" wrap="wrap">
              <Heading :level="2">
                Comments and activity
              </Heading>
              <Button label="Add comment" />
            </HStack>
            <VStack :gap="6">
              <HStack v-for="entry in ACTIVITY" :key="entry.id" :gap="3" align="start">
                <Avatar :name="entry.author" size="sm" />
                <StackItem size="fill">
                  <VStack :gap="1">
                    <HStack :gap="2" align="center">
                      <Text type="body" weight="semibold">
                        {{ entry.author }}
                      </Text>
                      <Text v-if="entry.kind !== 'comment'" type="supporting" color="secondary">
                        {{ entry.body }}
                      </Text>
                      <StackItem size="fill" />
                      <Timestamp
                        :value="entry.time"
                        format="relative"
                        type="supporting"
                        color="secondary"
                      />
                    </HStack>
                    <template v-if="entry.kind === 'comment'">
                      <Card variant="muted" :padding="3">
                        <Text type="body">{{ entry.body }}</Text>
                      </Card>
                      <Link href="#" color="secondary">
                        Reply
                      </Link>
                    </template>
                  </VStack>
                </StackItem>
              </HStack>
            </VStack>
            <VStack :gap="2" h-align="stretch">
              <TextArea
                v-model="comment"
                width="100%"
                label="Add a comment"
                is-label-hidden
                placeholder="Write a comment…"
                :rows="5"
              />
              <HStack :gap="2" justify="end">
                <Button label="Cancel" variant="ghost" />
                <Button
                  label="Comment"
                  variant="primary"
                  :is-disabled="comment.trim().length === 0"
                />
              </HStack>
            </VStack>
          </VStack>
        </Section>
      </VStack>
    </LayoutContent>

    <template v-if="!isNarrow && isRailOpen" #end>
      <LayoutPanel :width="340" :padding="6" role="complementary" has-divider>
        <VStack :gap="10">
          <VStack :gap="4">
            <Heading :level="3">
              Details
            </Heading>
            <MetadataList>
              <MetadataListItem label="Status">
                <HStack :gap="2" align="center">
                  <StatusDot
                    :variant="status === 'done' ? 'success' : status === 'in_review' ? 'warning' : status === 'in_progress' ? 'info' : 'neutral'"
                    :label="optionFor(STATUS_OPTIONS, status).label"
                  />
                  <Text type="body">{{ optionFor(STATUS_OPTIONS, status).label }}</Text>
                </HStack>
              </MetadataListItem>
              <MetadataListItem label="Priority">
                <Badge :variant="priorityFor(priority).badge" :label="priorityFor(priority).label" />
              </MetadataListItem>
              <MetadataListItem label="Assignee">
                <HStack :gap="2" align="center">
                  <Avatar :name="optionFor(ASSIGNEE_OPTIONS, assignee).label" size="xsm" />
                  <Text type="body">{{ optionFor(ASSIGNEE_OPTIONS, assignee).label }}</Text>
                </HStack>
              </MetadataListItem>
              <MetadataListItem label="Reporter">
                <HStack :gap="2" align="center">
                  <Avatar name="Sofia Alvarez" size="xsm" />
                  <Text type="body">Sofia Alvarez</Text>
                </HStack>
              </MetadataListItem>
              <MetadataListItem label="Start date">
                <Timestamp value="2026-03-02" format="date" type="body" color="primary" />
              </MetadataListItem>
              <MetadataListItem label="Due date">
                <Timestamp value="2026-03-18" format="date" type="body" color="primary" />
              </MetadataListItem>
              <MetadataListItem label="Sprint">
                <Text type="body">Sprint 24 · Mar 2 – Mar 15</Text>
              </MetadataListItem>
              <MetadataListItem label="Parent">
                <Link href="#">
                  PLT-192 · Activation initiative
                </Link>
              </MetadataListItem>
              <MetadataListItem label="Labels">
                <HStack :gap="1" wrap="wrap">
                  <Token
                    v-for="label in labels"
                    :key="label.id"
                    :color="label.color"
                    :label="label.label"
                    size="sm"
                  />
                </HStack>
              </MetadataListItem>
              <MetadataListItem label="Team">
                <Text type="body">Platform · Growth pod</Text>
              </MetadataListItem>
            </MetadataList>
          </VStack>

          <VStack :gap="4">
            <Heading :level="3">
              Watchers
            </Heading>
            <AvatarGroup size="md">
              <Avatar v-for="name in WATCHERS" :key="name" :name="name" />
            </AvatarGroup>
          </VStack>

          <VStack :gap="4">
            <Heading :level="3">
              Linked items
            </Heading>
            <VStack :gap="1">
              <ClickableCard
                v-for="item in LINKED_ITEMS"
                :key="item.id"
                :label="`Open ${item.id}: ${item.title}`"
                href="#"
                :padding="3"
              >
                <VStack :gap="0">
                  <Text type="supporting" color="secondary">
                    {{ item.id }}
                  </Text>
                  <Text type="body" weight="semibold">
                    {{ item.title }}
                  </Text>
                </VStack>
              </ClickableCard>
            </VStack>
          </VStack>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>

  <Dialog
    variant="fullscreen"
    :is-open="isNarrow && isDialogOpen"
    @update:is-open="isDialogOpen = $event"
  >
    <Layout>
      <template #header>
        <DialogHeader title="Task details" @update:is-open="isDialogOpen = $event" />
      </template>
      <LayoutContent :padding="4">
        <MetadataList>
          <MetadataListItem label="Status">
            {{ optionFor(STATUS_OPTIONS, status).label }}
          </MetadataListItem>
          <MetadataListItem label="Priority">
            {{ priorityFor(priority).label }}
          </MetadataListItem>
          <MetadataListItem label="Assignee">
            {{ optionFor(ASSIGNEE_OPTIONS, assignee).label }}
          </MetadataListItem>
        </MetadataList>
      </LayoutContent>
    </Layout>
  </Dialog>
</template>

<style scoped>
.attachment-tile {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--astryx-radius-element);
  background: var(--astryx-color-background-muted);
}
</style>
