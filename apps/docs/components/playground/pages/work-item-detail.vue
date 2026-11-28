<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CheckboxListItem,
  ClickableCard,
  createStaticSource,
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
  useImperativeAlertDialog,
  useMediaQuery,
  useToast,
  VStack,
} from '@astryx-vue/core'

// ── 可编辑字段 ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do', icon: h(StatusDot, { variant: 'neutral', label: 'To Do' }) },
  { value: 'in_progress', label: 'In Progress', icon: h(StatusDot, { variant: 'accent', label: 'In Progress' }) },
  { value: 'in_review', label: 'In Review', icon: h(StatusDot, { variant: 'warning', label: 'In Review' }) },
  { value: 'done', label: 'Done', icon: h(StatusDot, { variant: 'success', label: 'Done' }) },
]

const ASSIGNEE_OPTIONS = [
  { value: 'priya-shah', label: 'Priya Shah', icon: h(Avatar, { name: 'Priya Shah', size: 'xsm' }) },
  { value: 'marcus-chen', label: 'Marcus Chen', icon: h(Avatar, { name: 'Marcus Chen', size: 'xsm' }) },
  { value: 'sofia-alvarez', label: 'Sofia Alvarez', icon: h(Avatar, { name: 'Sofia Alvarez', size: 'xsm' }) },
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
  link: 'heroicons:link',
  image: 'heroicons:photo',
  file: 'heroicons:document-text',
}

const PencilIcon = () => h(Icon, { name: 'heroicons:pencil' })
const TrashIcon = () => h(Icon, { name: 'heroicons:trash' })

const showToast = useToast()
const confirm = useImperativeAlertDialog()
const ConfirmHost = confirm.Host

// 演示：换成真正处理这个附件的调用。删除先确认。
function attachmentActions(attachment: { id: string | number, title: string }) {
  return [
    {
      label: 'Edit',
      icon: PencilIcon,
      onClick: () => showToast({ body: `Demo: ${attachment.title} would open for editing here`, uniqueID: `edit-${attachment.id}` }),
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      variant: 'destructive' as const,
      onClick: () => confirm.show({
        title: `Delete ${attachment.title}?`,
        description: 'This demo won\'t delete anything.',
        actionLabel: 'Delete',
        onAction: () => {
          confirm.hide()
          showToast({ body: `Demo: ${attachment.title} would be deleted here`, uniqueID: `delete-${attachment.id}` })
        },
      }),
    },
  ]
}

const HEADER_ACTIONS = [
  { label: 'Watch', icon: 'heroicons:eye' },
  { label: 'Share', icon: 'heroicons:share' },
  { label: 'Notify', icon: 'heroicons:bell' },
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
// 手机上子任务的到期日和负责人挪到标题下面
const isPhone = useMediaQuery('(max-width: 640px)')

const status = ref('in_progress')
const assignee = ref('priya-shah')
const priority = ref('high')
const labels = ref([...LABEL_OPTIONS])
const subtasks = ref(SUBTASKS.map(task => ({ ...task })))
const comment = ref('')

// 宽屏时详情放在可隐藏的右侧栏；窄屏时接在主栏最后，不挤在旁边。
const isDetailsOpen = ref(true)

const doneCount = computed(() => subtasks.value.filter(task => task.isDone).length)
const donePercent = computed(() =>
  subtasks.value.length ? (doneCount.value / subtasks.value.length) * 100 : 0,
)

function postComment() {
  showToast({ body: 'Demo: the comment would be posted here', uniqueID: 'comment' })
  comment.value = ''
}

function toggleDetails() {
  isDetailsOpen.value = !isDetailsOpen.value
}

function sectionHeading(title: string) {
  return h(HStack, { gap: 2, vAlign: 'center', hAlign: 'between', wrap: 'wrap' }, () => h(Heading, { level: 3 }, () => title))
}

function personRow(name: string) {
  return h(HStack, { gap: 2, vAlign: 'center' }, () => [h(Avatar, { name, size: 'xsm' }), h(Text, { type: 'body' }, () => name)])
}

/** 任务详情：宽屏在右侧栏，窄屏在主栏「Task details」标题下。 */
const DetailsPanel = defineComponent({
  setup() {
    return () => {
      const statusOption = optionFor(STATUS_OPTIONS, status.value)
      const assigneeOption = optionFor(ASSIGNEE_OPTIONS, assignee.value)
      const priorityOption = priorityFor(priority.value)
      const item = (label: string, content: () => unknown) => h(MetadataListItem, { label }, content)
      const date = (value: string) => () => h(Timestamp, { value, format: 'date', type: 'body', color: 'primary' })
      return h(VStack, { gap: 10 }, () => [
        h(VStack, { gap: 4 }, () => [
          sectionHeading('Details'),
          h(MetadataList, null, () => [
            item('Status', () => h(HStack, { gap: 2, vAlign: 'center' }, () => [statusOption.icon, h(Text, { type: 'body' }, () => statusOption.label)])),
            item('Priority', () => h(Badge, { variant: priorityOption.badge, label: priorityOption.label })),
            item('Assignee', () => personRow(assigneeOption.label)),
            item('Reporter', () => personRow('Sofia Alvarez')),
            item('Start date', date('2026-03-02')),
            item('Due date', date('2026-03-18')),
            item('Sprint', () => h(Text, { type: 'body' }, () => 'Sprint 24 · Mar 2 – Mar 15')),
            item('Parent', () => h(Link, { href: '#' }, () => 'PLT-192 · Activation initiative')),
            item('Labels', () => h(HStack, { gap: 1, wrap: 'wrap' }, () => labels.value.map(label => h(Token, { key: label.id, color: label.color, label: label.label, size: 'sm' })))),
            item('Team', () => h(Text, { type: 'body' }, () => 'Platform · Growth pod')),
          ]),
        ]),
        h(VStack, { gap: 4 }, () => [
          sectionHeading('Watchers'),
          h(AvatarGroup, { size: 'md' }, () => WATCHERS.map(name => h(Avatar, { key: name, name }))),
        ]),
        h(VStack, { gap: 4 }, () => [
          sectionHeading('Linked items'),
          h(VStack, { gap: 1 }, () => LINKED_ITEMS.map(linked => h(ClickableCard, { key: linked.id, label: `Open ${linked.id}: ${linked.title}`, href: '#', padding: 3 }, () => h(VStack, { gap: 0 }, () => [
            h(Text, { type: 'supporting', color: 'secondary' }, () => linked.id),
            h(Text, { type: 'body', weight: 'semibold' }, () => linked.title),
          ])))),
        ]),
      ])
    }
  },
})

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
                <Link href="#" type="supporting" color="secondary">
                  <HStack as="span" :gap="1" align="center">
                    <Icon class="mirror-rtl" name="heroicons:arrow-left" size="sm" />
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
            <HStack v-if="!isNarrow" :gap="1">
              <IconButton
                v-for="action in HEADER_ACTIONS"
                :key="action.label"
                :label="action.label"
                variant="secondary"
                @click="showToast({ body: `Demo: ${action.label} would happen here`, uniqueID: `header-${action.label}` })"
              >
                <Icon :name="action.icon" size="sm" />
              </IconButton>
              <Button
                :label="isDetailsOpen ? 'Hide details' : 'Show details'"
                variant="secondary"
                @click="toggleDetails"
              >
                <template #icon>
                  <Icon name="heroicons:view-columns" size="sm" />
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
            >
              <template #selected="{ option }">
                <Badge :variant="priorityFor(String(option?.value ?? priority)).badge" :label="priorityFor(String(option?.value ?? priority)).label" />
              </template>
              <template #option="{ option }">
                <Badge :variant="priorityFor(String(option.value)).badge" :label="priorityFor(String(option.value)).label" />
              </template>
            </Selector>
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
            >
              <template #token="{ item, remove }">
                <Token :label="item.label" :color="item.color" removable @remove="remove" />
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
                <!-- 节点形式的 label 在窄屏会换行，字符串形式的 label 只显示一行。 -->
                <ListItem>
                  <template #label>
                    Day-seven activation rises from 42 to 55 percent for new workspaces in the variant.
                  </template>
                </ListItem>
                <ListItem>
                  <template #label>
                    Median time to first completed action drops below eight minutes.
                  </template>
                </ListItem>
                <ListItem>
                  <template #label>
                    No regression in day-thirty retention.
                  </template>
                </ListItem>
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
              <Button label="Add subtask" @click="showToast({ body: 'Demo: a new subtask would be added here', uniqueID: 'add-subtask' })" />
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
                :align="isPhone ? 'first-line' : undefined"
                @check="setSubtaskDone(task.id, $event)"
              >
                <!-- 节点形式的标签会换行，字符串标签被截成一行，手机上只剩几个字 -->
                <template #label>
                  {{ task.title }}
                </template>
                <!-- 手机上到期日和负责人挪到标题下面，标题拿到整行宽度 -->
                <template v-if="isPhone" #description>
                  <HStack :gap="2" align="center">
                    <Timestamp :value="task.due" format="date" type="supporting" color="secondary" />
                    <Avatar :name="task.assignee" size="sm" />
                  </HStack>
                </template>
                <template v-else #end>
                  <HStack :gap="2" align="center">
                    <Timestamp :value="task.due" format="date" type="supporting" color="secondary" />
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
              <Button label="Add attachment" @click="showToast({ body: 'Demo: a file picker would open here', uniqueID: 'add-attachment' })" />
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
                    <Icon :name="ATTACHMENT_ICONS[attachment.kind]" size="lg" color="secondary" />
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
                    :items="attachmentActions(attachment)"
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
                <Button label="Cancel" variant="ghost" @click="comment = ''" />
                <Button
                  label="Comment"
                  variant="primary"
                  :is-disabled="comment.trim().length === 0"
                  @click="postComment"
                />
              </HStack>
            </VStack>
          </VStack>
        </Section>
        <!-- 窄屏：详情接在主栏后面，不挤在旁边。 -->
        <template v-if="isNarrow">
          <Divider />
          <Heading :level="2">
            Task details
          </Heading>
          <DetailsPanel />
        </template>
      </VStack>
      <ConfirmHost />
    </LayoutContent>

    <template v-if="!isNarrow && isDetailsOpen" #end>
      <LayoutPanel :width="340" :padding="6" role="complementary" has-divider>
        <DetailsPanel />
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style scoped>
:global([dir='rtl'] .mirror-rtl) {
  transform: scaleX(-1);
}

.attachment-tile {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--astryx-radius-element);
  background: var(--astryx-color-background-muted);
}
</style>
