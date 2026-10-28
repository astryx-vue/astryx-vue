<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  Collapsible,
  CollapsibleGroup,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  pixel,
  proportional,
  ResizeHandle,
  StackItem,
  Tab,
  TabList,
  Table,
  Text,
  Thumbnail,
  Token,
  Toolbar,
  useResizable,
  useTableRowStatus,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn, TablePlugin } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

type Category = 'inbox' | 'escalations' | 'waiting' | 'resolved'
type Priority = 'urgent' | 'high' | 'normal'

interface Attachment {
  id: string
  name: string
  src: string
}

interface ThreadMessage {
  id: string
  sender: string
  senderEmail: string
  receivedFull: string
  body: string[]
  attachments?: Attachment[]
}

interface Conversation extends Record<string, unknown> {
  id: string
  sender: string
  senderEmail: string
  subject: string
  preview: string
  tags: string[]
  receivedAt: string
  receivedFull: string
  isUnread: boolean
  priority: Priority
  category: Category
  assignee: string | null
  body: string[]
  attachments: Attachment[]
  replies?: ThreadMessage[]
}

const PRIORITY_COLOR: Record<Priority, 'red' | 'orange' | 'default'> = {
  urgent: 'red',
  high: 'orange',
  normal: 'default',
}

const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c-01',
    category: 'escalations',
    sender: 'Priya Raman',
    senderEmail: 'priya.raman@northwind.example',
    subject: 'Checkout returns 502 for EU customers',
    preview:
      'Started around 09:40 UTC. Roughly one in five card payments fails at the confirm step…',
    tags: ['Billing', 'Escalated'],
    receivedAt: '9:52 AM',
    receivedFull: 'Today at 9:52 AM',
    isUnread: true,
    priority: 'urgent',
    assignee: null,
    body: [
      'Started around 09:40 UTC. Roughly one in five card payments fails at the confirm step, and only for customers billing to an EU address — US and APAC look untouched.',
      'The response is a bare 502 with no body, so our retry logic treats it as transient and re-submits. Two customers have now been charged twice.',
      'I have paused the retry worker as a stopgap, so the double charges should stop, but the underlying failures have not.',
    ],
    attachments: [
      {
        id: 'c-01-a1',
        name: 'northwind-checkout-eu.png',
        src: '/template-assets/light-home-horizontal-1.png',
      },
    ],
    replies: [
      {
        id: 'c-01-r1',
        sender: 'Priya Raman',
        senderEmail: 'priya.raman@northwind.example',
        receivedFull: 'Today at 9:44 AM',
        body: [
          'Flagging early — our payments dashboard has just lit up. No numbers yet, but the failures all look like they are on the confirm step rather than the authorisation.',
        ],
      },
      {
        id: 'c-01-r2',
        sender: 'Lucas Meyer',
        // Support-side. Every address on the team shares this domain, which is
        // how a header says "this one is us" without a badge saying so.
        senderEmail: 'lucas.meyer@support.example',
        receivedFull: 'Today at 9:47 AM',
        body: [
          'Acknowledged, paging the payments on-call. Nothing on our status page, so if this is regional it is sitting under our alerting threshold.',
          'Is it specific to one card network, or all of them?',
        ],
      },
    ],
  },
  {
    id: 'c-02',
    category: 'inbox',
    sender: 'Marcus Feld',
    senderEmail: 'm.feld@harbourpoint.example',
    subject: 'SSO metadata rotation — need new certificate',
    preview:
      'Our IdP certificate expires Friday. Can you confirm the fingerprint before we cut over?',
    tags: ['Identity'],
    receivedAt: '9:31 AM',
    receivedFull: 'Today at 9:31 AM',
    isUnread: true,
    priority: 'high',
    assignee: null,
    body: [
      'Our IdP certificate expires Friday at 23:59 UTC. We have the replacement staged and can publish new metadata whenever you are ready.',
      'Before we cut over, can you confirm the SHA-256 fingerprint you have on file matches the one we published? Last rotation we mismatched and locked out 400 people for an hour.',
    ],
    attachments: [],
  },
  {
    id: 'c-03',
    category: 'resolved',
    sender: 'Dana Osei',
    senderEmail: 'dana@osei-consulting.example',
    subject: 'Re: Bulk export finished but the file is empty',
    preview:
      'Thanks — re-running with the date filter cleared did produce rows this time.',
    tags: ['Exports'],
    receivedAt: '8:58 AM',
    receivedFull: 'Today at 8:58 AM',
    isUnread: true,
    priority: 'normal',
    assignee: 'You',
    body: [
      'Thanks — re-running with the date filter cleared did produce rows this time, so it looks like the filter was the culprit rather than the export itself.',
      'Worth noting the empty file still came back with a 200 and a success banner, which is what sent me down the wrong path. A warning when an export matches zero records would have saved a morning.',
    ],
    attachments: [],
    replies: [
      {
        id: 'c-03-r1',
        sender: 'Dana Osei',
        senderEmail: 'dana@osei-consulting.example',
        receivedFull: 'Yesterday at 5:12 PM',
        body: [
          'Ran the full-account export this afternoon. It finished in about forty seconds and handed me a zero-byte CSV — no header row, nothing.',
        ],
      },
      {
        id: 'c-03-r2',
        sender: 'Marta Nowak',
        senderEmail: 'marta.nowak@support.example',
        receivedFull: 'Today at 8:31 AM',
        body: [
          'A zero-byte file usually means the query matched no rows rather than that the export itself failed. Could you retry with the date filter cleared and tell me whether the file comes back with content?',
        ],
      },
    ],
  },
  {
    id: 'c-04',
    category: 'inbox',
    sender: 'Tomás Ibarra',
    senderEmail: 'tomas.ibarra@meridian.example',
    subject: 'Webhook retries stopped after the 3rd attempt',
    preview:
      'We expected five retries with backoff. Logs show three and then nothing for order 88214.',
    tags: ['Webhooks', 'Bug'],
    receivedAt: '8:14 AM',
    receivedFull: 'Today at 8:14 AM',
    isUnread: false,
    priority: 'high',
    assignee: 'You',
    body: [
      'We expected five retries with exponential backoff. Logs show three attempts and then nothing for order 88214.',
      'The endpoint was returning 503 throughout, so this should have kept retrying to the documented limit. The gap in our delivery log after 08:02 is the part I cannot explain.',
    ],
    attachments: [],
  },
  {
    id: 'c-05',
    category: 'waiting',
    sender: 'Hannah Lindqvist',
    senderEmail: 'h.lindqvist@varda.example',
    subject: 'Homepage refresh — three directions for your review',
    preview:
      'Attached the three we shortlisted. We need a decision by Thursday to hold the schedule.',
    tags: ['Design', 'Review'],
    receivedAt: 'Yesterday',
    receivedFull: 'Yesterday at 4:22 PM',
    isUnread: false,
    priority: 'high',
    assignee: null,
    body: [
      'Attached the three directions we shortlisted out of the eleven we explored. They differ in mood rather than structure, so the layout work carries over whichever one you pick.',
      'Colourful is the boldest and the furthest from the current site. Light is the safest and reads closest to the product itself. Moody photographs best but needs art direction we do not have in-house yet.',
      'We need a decision by Thursday to hold the build schedule.',
    ],
    attachments: [
      {
        id: 'a-1',
        name: 'direction-1-colourful.png',
        src: '/template-assets/colorful-home-horizontal-1.png',
      },
      {
        id: 'a-2',
        name: 'direction-2-light.png',
        src: '/template-assets/light-home-horizontal-1.png',
      },
      {
        id: 'a-3',
        name: 'direction-3-moody.png',
        src: '/template-assets/moody-home-horizontal-1.png',
      },
    ],
    replies: [
      {
        id: 'c-05-r1',
        sender: 'Hannah Lindqvist',
        senderEmail: 'h.lindqvist@varda.example',
        receivedFull: 'Monday at 3:05 PM',
        body: [
          'Kicking off the homepage refresh. We have eleven explorations open; I will cut them to three before Thursday so you get something decidable rather than a mood board.',
        ],
      },
      {
        id: 'c-05-r2',
        sender: 'Elliot Nakamura',
        senderEmail: 'elliot.nakamura@support.example',
        receivedFull: 'Tuesday at 10:18 AM',
        body: [
          'Three is the right number. One request: hold the hero structure identical across all of them, so the thing we are judging is treatment and not layout. Last round nobody could tell which of the two they were reacting to.',
        ],
      },
      {
        // A second voice from the customer's side, and the only one in the
        // fixture. Every other thread is one customer and one agent, where
        // Reply and Reply all address the same person and the difference
        // between the two buttons never shows.
        id: 'c-05-r2b',
        sender: 'Ines Duarte',
        senderEmail: 'i.duarte@varda.example',
        receivedFull: 'Tuesday at 4:52 PM',
        body: [
          'Copy is written against the current hero, so holding the structure suits us — I will only need to reflow if the headline slot changes length.',
        ],
      },
      {
        id: 'c-05-r3',
        sender: 'Hannah Lindqvist',
        senderEmail: 'h.lindqvist@varda.example',
        receivedFull: 'Yesterday at 11:40 AM',
        body: [
          'Structure is fixed across all three. Sending the moody direction on its own first — it is the one most likely to split the room, and it reads differently without the other two beside it.',
        ],
        attachments: [
          {
            id: 'c-05-r3-a1',
            name: 'moody-direction-hero.png',
            src: '/template-assets/moody-home-horizontal-1.png',
          },
        ],
      },
    ],
  },
  {
    id: 'c-06',
    category: 'waiting',
    sender: 'Owen Baptiste',
    senderEmail: 'obaptiste@fieldstone.example',
    subject: 'Seat count says 145 but we only provisioned 120',
    preview:
      'Finance flagged the discrepancy on the March invoice. Can we reconcile before the 30th?',
    tags: ['Billing'],
    receivedAt: 'Yesterday',
    receivedFull: 'Yesterday at 11:07 AM',
    isUnread: false,
    priority: 'high',
    assignee: 'You',
    body: [
      'Finance flagged the discrepancy on the March invoice. Our directory shows 120 provisioned seats; the invoice bills 145.',
      'My guess is deactivated accounts are still counted until the end of the billing period, but I cannot find that stated anywhere. Can we reconcile before the 30th?',
    ],
    attachments: [],
  },
  {
    id: 'c-07',
    category: 'inbox',
    sender: 'Aiko Tanaka',
    senderEmail: 'aiko.tanaka@shorebird.example',
    subject: 'Docs: the rate-limit page contradicts the API response header',
    preview:
      'Page says 600/min, header reports 300/min on our plan. One of them is wrong.',
    tags: ['Docs'],
    receivedAt: 'Yesterday',
    receivedFull: 'Yesterday at 9:15 AM',
    isUnread: false,
    priority: 'normal',
    assignee: null,
    body: [
      'The rate-limit page says 600 requests per minute on Scale. The X-RateLimit-Limit header on our responses reports 300.',
      'One of them is wrong, and we have sized a batch job against the larger number.',
    ],
    attachments: [],
  },
  {
    id: 'c-08',
    category: 'resolved',
    sender: 'Reuben Cole',
    senderEmail: 'r.cole@atlasgrid.example',
    subject: 'Re: Scheduled maintenance window confirmation',
    preview: 'Confirmed for Sunday 02:00–04:00 UTC. Nothing further needed.',
    tags: ['Ops'],
    receivedAt: 'Mon',
    receivedFull: 'Monday at 2:40 PM',
    isUnread: false,
    priority: 'normal',
    assignee: 'You',
    body: [
      'Confirmed for Sunday 02:00–04:00 UTC. We have notified our on-call and paused the nightly sync for that window.',
      'Nothing further needed from your side.',
    ],
    attachments: [],
  },
  {
    id: 'c-09',
    category: 'inbox',
    sender: 'Sofia Marchetti',
    senderEmail: 'sofia@marchetti-legal.example',
    subject: 'Feature request: per-workspace retention policy',
    preview:
      'Our legal team needs 30-day retention on one workspace and 400 on another.',
    tags: ['Feature request'],
    receivedAt: 'Mon',
    receivedFull: 'Monday at 10:02 AM',
    isUnread: false,
    priority: 'normal',
    assignee: null,
    body: [
      'Our legal team needs 30-day retention on the client-intake workspace and 400 days on the matter-archive workspace.',
      'Today retention is an account-level setting, so we are stuck applying the longer policy everywhere, which is the opposite of what our counsel wants.',
    ],
    attachments: [],
  },
];

const CATEGORIES: { value: Category, label: string }[] = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'escalations', label: 'Escalations' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'resolved', label: 'Resolved' },
]

/** Inbox 是全部，其余三个是它的切面：一封会话同一时刻只有一个归属。 */
function inCategory(item: Conversation, category: Category): boolean {
  return category === 'inbox' || item.category === category
}

/** 每个标签徽章显示该标签下的未读数。 */
function unreadByCategory(): Record<Category, number> {
  const counts: Record<Category, number> = { inbox: 0, escalations: 0, waiting: 0, resolved: 0 }
  for (const item of CONVERSATIONS) {
    if (!item.isUnread)
      continue
    counts.inbox += 1
    if (item.category !== 'inbox')
      counts[item.category] += 1
  }
  return counts
}

/**
 * Stack 的内边距写在 CSS 变量上，嵌套的 Stack 会继承同一个值，
 * 所以给容器加内边距时用内联样式，避免子容器被动带上同样的留白。
 */
function spacing(step: number): string {
  return `var(--astryx-spacing-${String(step).replace('.', '-')}, ${step * 4}px)`
}

/** 头像与姓名之间的间距，正文的缩进也用它。 */
const THREAD_HEADER_GAP = 3
/** 头像的渲染宽度，正文缩进要对齐它。 */
const AVATAR_SIZE = 36
/** 正文的最大阅读宽度。 */
const MESSAGE_MEASURE = 680

const category = ref<Category>('inbox')
/** `undefined` 表示用户还没选过，按列表首条兜底；`null` 表示用户主动关掉了阅读栏。 */
const chosenId = ref<string | null | undefined>(undefined)

/** 面板默认占内容区的 2/3，百分比相对内容区算，不写死像素。 */
const surfaceEl = ref<HTMLElement | null>(null)
const PANE_MIN_WIDTH = 440

const pane = useResizable({
  containerRef: surfaceEl,
  defaultSize: '66.67%',
  minSize: PANE_MIN_WIDTH,
  maxSize: '100%',
})

/** Layout 是组件，ref 拿到的是实例；这里取它的根元素当宽度基准。 */
function setSurface(instance: unknown): void {
  surfaceEl.value = (instance as { $el?: HTMLElement } | null)?.$el ?? null
}

const visible = computed(() => CONVERSATIONS.filter(item => inCategory(item, category.value)))

const openId = computed<string | null>(() => {
  if (chosenId.value === null)
    return null
  if (chosenId.value != null && visible.value.some(item => item.id === chosenId.value))
    return chosenId.value
  return visible.value[0]?.id ?? null
})

const openConversation = computed(() => visible.value.find(item => item.id === openId.value) ?? null)

const unreadCount = computed(() => CONVERSATIONS.filter(item => item.isUnread).length)
const unreadCounts = unreadByCategory()

/** 会话按时间正序展开，最新一条在最后并且默认展开。 */
function threadMessages(conversation: Conversation): ThreadMessage[] {
  return [
    ...(conversation.replies ?? []),
    {
      id: conversation.id,
      sender: conversation.sender,
      senderEmail: conversation.senderEmail,
      receivedFull: conversation.receivedFull,
      body: conversation.body,
      attachments: conversation.attachments,
    },
  ]
}

function openThread(id: string): void {
  chosenId.value = id
}

const rowStatus = useTableRowStatus<Conversation>({
  getStatus: item => (item.isUnread ? { color: 'accent', label: 'Unread' } : null),
})

/**
 * 状态点列：16px 缩进 + 8px 圆点 + 密度在每格后留的 12px，共 36px。
 * 原版用同样的 `transformColumns` 把插件自带的 28px 改成 36px（列 key 是插件内部的 `__rowStatus`）。
 */
const STATUS_GUTTER_WIDTH = 36
const alignStatusGutter: TablePlugin<Conversation> = {
  transformColumns: cols => cols.map(col => col.key === '__rowStatus' ? { ...col, width: pixel(STATUS_GUTTER_WIDTH) } : col),
}

/** 点到按钮、链接、勾选框这类控件时不算点中行本身。 */
const INTERACTIVE_WITHIN_ROW = 'button, input, a, label, [role="checkbox"], [role="button"], [role="menuitem"]'

function isRowItself(event: { target: EventTarget | null }): boolean {
  return !(event.target as HTMLElement | null)?.closest(INTERACTIVE_WITHIN_ROW)
}

/** 整行可点、可聚焦；当前打开的那一行整行铺上强调色浅底，并标 aria-current。 */
const inboxRows: TablePlugin<Conversation> = {
  rowPatch(item) {
    return {
      attrs: { 'tabindex': '0', 'aria-current': item.id === openId.value ? 'true' : undefined },
      class: 'inbox-row',
      onClick: (event) => {
        if (isRowItself(event))
          openThread(item.id)
      },
    }
  },
  cellPatch({ row, kind }) {
    if (kind !== 'body' || row == null || row.id !== openId.value)
      return null
    return { style: { backgroundColor: 'var(--astryx-color-accent-muted)' } }
  },
}

const columns: TableColumn<Conversation>[] = [
  {
    key: 'conversation',
    header: 'Conversation',
    width: proportional(1, { minWidth: 160 }),
    renderCell: item => h(VStack, {
      gap: 0.5,
    }, () => [
      h(Text, { maxLines: 1, weight: item.isUnread ? 'semibold' : 'normal' }, () => item.sender),
      h(Text, { maxLines: 1, color: 'secondary' }, () => item.subject),
    ]),
  },
  {
    key: 'receivedAt',
    header: 'Received',
    width: pixel(110),
    align: 'end',
    renderCell: item => h(HStack, {
      gap: 1,
      vAlign: 'center',
      hAlign: 'end',
    }, () => [
      item.attachments.length === 0
        ? null
        : h(Icon, { name: 'heroicons:paper-clip', size: 'sm', color: 'gray', label: 'Has attachments' }),
      h(Text, {
        color: 'secondary',
        hasTabularNumbers: true,
        justify: 'end',
        maxLines: 1,
        weight: item.isUnread ? 'semibold' : 'normal',
      }, () => item.receivedAt),
    ]),
  },
]

const threadActions = [
  { id: 'archive', label: 'Archive', icon: 'heroicons:archive-box' },
  { id: 'move', label: 'Move to folder', icon: 'heroicons:folder-arrow-down' },
  { id: 'delete', label: 'Delete', icon: 'heroicons:trash' },
]
</script>

<template>
  <Layout :ref="setSurface" height="fill">
    <template #header>
      <LayoutHeader :padding="0">
        <VStack :gap="0">
          <HStack :gap="3" align="center" wrap="wrap" :style="{ padding: spacing(4) }">
            <StackItem size="fill">
              <VStack :gap="0.5">
                <Heading :level="1">
                  Inbox
                </Heading>
                <Text type="supporting">
                  {{ unreadCount }} unread of {{ CONVERSATIONS.length }} conversations
                </Text>
              </VStack>
            </StackItem>
            <Button label="Refresh" variant="ghost">
              <template #icon>
                <Icon name="heroicons:arrow-path" size="sm" />
              </template>
            </Button>
            <Button label="Compose" variant="primary">
              <template #icon>
                <Icon name="heroicons:pencil-square" size="sm" />
              </template>
            </Button>
          </HStack>
          <VStack :style="{ paddingInline: spacing(1) }">
            <TabList v-model:value="category" has-divider>
              <Tab
                v-for="option in CATEGORIES"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              >
                {{ option.label }}
                <template v-if="unreadCounts[option.value] > 0" #endContent>
                  <Badge variant="neutral" :label="`${unreadCounts[option.value]} unread`">
                    {{ unreadCounts[option.value] }}
                  </Badge>
                </template>
              </Tab>
            </TabList>
          </VStack>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="4" is-scrollable>
      <Table
        :data="visible"
        :columns="columns"
        id-key="id"
        density="balanced"
        dividers="none"
        has-hover
        text-overflow="truncate"
        :plugins="{ status: rowStatus, gutter: alignStatusGutter, rows: inboxRows }"
      />
    </LayoutContent>

    <template v-if="openConversation" #end>
      <ResizeHandle :resizable="pane.props" is-reversed has-divider />
      <LayoutPanel :resizable="pane.props" :padding="0" role="complementary" label="Conversation">
        <VStack height="100%">
          <VStack
            :style="{
              paddingBlockStart: spacing(4),
              paddingInlineStart: spacing(3),
              paddingInlineEnd: spacing(2),
            }"
          >
            <Toolbar label="Conversation">
              <template #start>
                <Heading :level="2" :max-lines="2" has-truncate-tooltip>
                  {{ openConversation.subject }}
                </Heading>
              </template>
              <template #end>
                <IconButton
                  v-for="action in threadActions"
                  :key="action.id"
                  variant="ghost"
                  :label="`${action.label} — ${openConversation.subject}`"
                  :tooltip="action.label"
                >
                  <Icon :name="action.icon" size="sm" />
                </IconButton>
                <IconButton
                  variant="ghost"
                  label="Close conversation"
                  tooltip="Close"
                  @click="chosenId = null"
                >
                  <Icon name="heroicons:x-mark" size="sm" />
                </IconButton>
              </template>
            </Toolbar>
          </VStack>

          <StackItem size="fill">
            <VStack
              :style="{ paddingInline: spacing(6), paddingBlockEnd: spacing(6) }"
              :gap="4"
              is-scrollable
              height="100%"
            >
              <HStack :gap="2" align="center" wrap="wrap">
                <Token
                  v-if="openConversation.priority !== 'normal'"
                  size="sm"
                  :color="PRIORITY_COLOR[openConversation.priority]"
                  :label="PRIORITY_LABEL[openConversation.priority]"
                />
                <Token
                  v-for="tag in openConversation.tags"
                  :key="tag"
                  size="sm"
                  :label="tag"
                />
              </HStack>

              <VStack :gap="2">
              <CollapsibleGroup
                :key="openConversation.id"
                type="multiple"
                density="spacious"
                :default-value="[openConversation.id]"
              >
                <Collapsible
                  v-for="message in threadMessages(openConversation)"
                  :key="message.id"
                  :value="message.id"
                >
                  <template #trigger>
                    <HStack
                      :gap="THREAD_HEADER_GAP"
                      align="center"
                      :style="{ paddingInlineEnd: spacing(2) }"
                    >
                      <Avatar :name="message.sender" :tooltip="false" />
                      <StackItem size="fill">
                        <VStack :gap="0.5">
                          <Text :max-lines="1" weight="semibold">
                            {{ message.sender }}
                          </Text>
                          <Text :max-lines="1" type="supporting" color="secondary">
                            {{ message.senderEmail }}
                          </Text>
                        </VStack>
                      </StackItem>
                      <Text type="supporting" color="secondary">
                        {{ message.receivedFull }}
                      </Text>
                    </HStack>
                  </template>
                  <HStack :gap="THREAD_HEADER_GAP">
                    <VStack :width="AVATAR_SIZE" />
                    <StackItem size="fill">
                      <VStack :gap="3" :max-width="MESSAGE_MEASURE">
                        <Text v-for="paragraph in message.body" :key="paragraph">
                          {{ paragraph }}
                        </Text>
                        <VStack v-if="message.attachments && message.attachments.length > 0" :gap="2">
                          <HStack :gap="1" align="center">
                            <Icon name="heroicons:paper-clip" size="sm" color="gray" />
                            <Text type="supporting" color="secondary">
                              {{ message.attachments.length }} attachment{{ message.attachments.length === 1 ? '' : 's' }}
                            </Text>
                          </HStack>
                          <HStack :gap="2" wrap="wrap">
                            <Thumbnail
                              v-for="attachment in message.attachments"
                              :key="attachment.id"
                              :src="attachment.src"
                              :alt="`Preview of ${attachment.name}`"
                              :label="attachment.name"
                            />
                          </HStack>
                        </VStack>
                      </VStack>
                    </StackItem>
                  </HStack>
                </Collapsible>
              </CollapsibleGroup>
              </VStack>

              <HStack :gap="THREAD_HEADER_GAP">
                <VStack :width="AVATAR_SIZE" />
                <HStack :gap="2">
                  <Button label="Reply" variant="primary">
                    <template #icon>
                      <Icon name="heroicons:arrow-uturn-left" size="sm" />
                    </template>
                  </Button>
                  <Button label="Reply all" variant="secondary">
                    <template #icon>
                      <Icon name="heroicons:users" size="sm" />
                    </template>
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </StackItem>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>
