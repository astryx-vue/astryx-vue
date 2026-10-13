<script setup lang="ts">
import {
  Avatar,
  Badge,
  Button,
  Divider,
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
  TextArea,
  Token,
  useResizable,
  useTableSelection,
  useTableSelectionState,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

type Category = 'inbox' | 'escalations' | 'waiting' | 'resolved'
type Priority = 'urgent' | 'high' | 'normal'

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
  body: string[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c-01',
    category: 'escalations',
    sender: 'Priya Raman',
    senderEmail: 'priya.raman@northwind.example',
    subject: 'Checkout returns 502 for EU customers',
    preview: 'Started around 09:40 UTC. Roughly one in five card payments fails at the confirm step…',
    tags: ['Billing', 'Escalated'],
    receivedAt: '9:52 AM',
    receivedFull: 'Today at 9:52 AM',
    isUnread: true,
    priority: 'urgent',
    body: [
      'Started around 09:40 UTC. Roughly one in five card payments fails at the confirm step, and only for customers billing to an EU address.',
      'The response is a bare 502 with no body, so our retry logic treats it as transient and re-submits.',
    ],
  },
  {
    id: 'c-02',
    category: 'inbox',
    sender: 'Marcus Feld',
    senderEmail: 'm.feld@harbourpoint.example',
    subject: 'SSO metadata rotation — need new certificate',
    preview: 'Our IdP certificate expires Friday. Can you confirm the fingerprint before we cut over?',
    tags: ['Identity'],
    receivedAt: '9:31 AM',
    receivedFull: 'Today at 9:31 AM',
    isUnread: true,
    priority: 'high',
    body: ['Our IdP certificate expires Friday at 23:59 UTC. We have the replacement staged and can publish new metadata whenever you are ready.'],
  },
  {
    id: 'c-04',
    category: 'inbox',
    sender: 'Tomás Ibarra',
    senderEmail: 'tomas.ibarra@meridian.example',
    subject: 'Webhook retries stopped after the 3rd attempt',
    preview: 'We expected five retries with backoff. Logs show three and then nothing for order 88214.',
    tags: ['Webhooks', 'Bug'],
    receivedAt: '8:14 AM',
    receivedFull: 'Today at 8:14 AM',
    isUnread: false,
    priority: 'high',
    body: ['We expected five retries with exponential backoff. Logs show three attempts and then nothing for order 88214.'],
  },
  {
    id: 'c-05',
    category: 'waiting',
    sender: 'Hannah Lindqvist',
    senderEmail: 'h.lindqvist@varda.example',
    subject: 'Homepage refresh — three directions for your review',
    preview: 'Attached the three we shortlisted. We need a decision by Thursday to hold the schedule.',
    tags: ['Design', 'Review'],
    receivedAt: 'Yesterday',
    receivedFull: 'Yesterday at 4:22 PM',
    isUnread: false,
    priority: 'high',
    body: ['Attached the three directions we shortlisted. We need a decision by Thursday to hold the build schedule.'],
  },
  {
    id: 'c-03',
    category: 'resolved',
    sender: 'Dana Osei',
    senderEmail: 'dana@osei-consulting.example',
    subject: 'Re: Bulk export finished but the file is empty',
    preview: 'Thanks — re-running with the date filter cleared did produce rows this time.',
    tags: ['Exports'],
    receivedAt: '8:58 AM',
    receivedFull: 'Today at 8:58 AM',
    isUnread: true,
    priority: 'normal',
    body: ['Thanks — re-running with the date filter cleared did produce rows this time.'],
  },
]

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

const CATEGORIES: { value: Category, label: string }[] = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'escalations', label: 'Escalations' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'resolved', label: 'Resolved' },
]

const category = ref<Category>('inbox')
const openId = ref<string | null>('c-01')
const replyDraft = ref('')
const selectedKeys = ref(new Set<string>())

const pane = useResizable({
  defaultSize: 420,
  minSize: 320,
  maxSize: 560,
})

const visible = computed(() => {
  if (category.value === 'inbox')
    return CONVERSATIONS
  return CONVERSATIONS.filter(c => c.category === category.value)
})

const openThread = computed(() => CONVERSATIONS.find(c => c.id === openId.value) ?? null)

const unreadCount = computed(() => CONVERSATIONS.filter(c => c.isUnread).length)

const columns = computed<TableColumn<Conversation>[]>(() => [
  {
    key: 'sender',
    header: 'From',
    width: proportional(1),
    renderCell: item => h(HStack, {
      gap: 2,
      vAlign: 'center',
      style: { cursor: 'pointer', fontWeight: item.isUnread ? '600' : undefined },
      onClick: () => { openId.value = item.id },
    }, () => [
      h(Avatar, { name: item.sender, size: 'sm' }),
      h(VStack, { gap: 0 }, () => [
        h(Text, { maxLines: 1, weight: item.isUnread ? 'semibold' : 'normal' }, () => item.sender),
        h(Text, { type: 'supporting', color: 'secondary', maxLines: 1 }, () => item.subject),
      ]),
    ]),
  },
  {
    key: 'preview',
    header: 'Preview',
    width: proportional(2),
    renderCell: item => h(Text, { color: 'secondary', maxLines: 1 }, () => item.preview),
  },
  {
    key: 'tags',
    header: 'Tags',
    width: pixel(200),
    renderCell: item => h(HStack, { gap: 1, wrap: 'wrap' }, () => [
      item.priority !== 'normal' ? h(Token, { size: 'sm', color: PRIORITY_COLOR[item.priority], label: PRIORITY_LABEL[item.priority] }) : null,
      ...item.tags.map(tag => h(Token, { key: tag, size: 'sm', label: tag })),
    ]),
  },
  {
    key: 'received',
    header: 'Received',
    width: pixel(100),
    align: 'end',
    renderCell: item => h(Text, { type: 'supporting', color: 'secondary' }, () => item.receivedAt),
  },
])

const { selectionConfig } = useTableSelectionState<Conversation>({
  data: visible,
  idKey: 'id',
  selectedKeys,
  setSelectedKeys(keys) {
    selectedKeys.value = keys
  },
  hasRowHighlight: false,
})
const selectionPlugin = useTableSelection<Conversation>(selectionConfig)
</script>

<template>
  <Layout height="fill">
    <template #header>
      <LayoutHeader :padding="0">
        <VStack :gap="0">
          <HStack :gap="3" align="center" wrap="wrap" :padding="4">
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
                <Icon icon="i-heroicons-arrow-path" size="sm" />
              </template>
            </Button>
            <Button label="Compose" variant="primary">
              <template #icon>
                <Icon icon="i-heroicons-pencil-square" size="sm" />
              </template>
            </Button>
          </HStack>
          <TabList v-model:value="category" has-divider :padding-inline="1">
            <Tab
              v-for="tab in CATEGORIES"
              :key="tab.value"
              :value="tab.value"
            >
              {{ tab.label }}
            </Tab>
          </TabList>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="0">
      <Table
        :data="visible"
        :columns="columns"
        id-key="id"
        density="balanced"
        dividers="rows"
        has-hover
        text-overflow="truncate"
        :plugins="{ selection: selectionPlugin }"
      />
    </LayoutContent>

    <template v-if="openThread" #end>
      <ResizeHandle :resizable="pane.props" is-reversed :is-always-visible="false" />
      <LayoutPanel has-divider :resizable="pane.props" :padding="4" role="complementary" label="Reading pane">
        <VStack :gap="4" height="100%">
          <HStack :gap="2" align="center">
            <StackItem size="fill">
              <Heading :level="3">
                {{ openThread.subject }}
              </Heading>
              <Text type="supporting" color="secondary">
                {{ openThread.receivedFull }} · {{ openThread.senderEmail }}
              </Text>
            </StackItem>
            <IconButton label="Close reading pane" variant="ghost" size="sm" @click="openId = null">
              <Icon icon="i-heroicons-x-mark" size="sm" />
            </IconButton>
          </HStack>
          <HStack :gap="2" align="center">
            <Avatar :name="openThread.sender" size="md" />
            <VStack :gap="0">
              <Text weight="semibold">
                {{ openThread.sender }}
              </Text>
              <Text type="supporting" color="secondary">
                to support
              </Text>
            </VStack>
          </HStack>
          <Divider />
          <VStack :gap="3">
            <Text v-for="(para, index) in openThread.body" :key="index" type="body">
              {{ para }}
            </Text>
          </VStack>
          <Divider />
          <VStack :gap="2">
            <Text type="label">
              Reply
            </Text>
            <TextArea v-model="replyDraft" label="Reply" is-label-hidden :rows="4" placeholder="Write a reply…" />
            <HStack :gap="2" justify="end">
              <Button label="Archive" variant="secondary" />
              <Button label="Send" variant="primary">
                <template #icon>
                  <Icon icon="i-heroicons-paper-airplane" size="sm" />
                </template>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>
