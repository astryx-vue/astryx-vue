<script setup lang="ts">
/**
 * 团队即时通讯的应用框架。
 *
 * 桌面端从左到右：侧边导航（工作区、搜索、频道、私信）| 消息流（填满）| 讨论串面板 340px。
 * 侧边导航是全局框架，归 AppShell 管，窄屏时由它收进移动端抽屉。
 * 宽于 1024px 时讨论串在消息流旁边；1024px 及以下改成从右侧滑出的 Drawer。
 * 数据都是固定的 ISO 时间，只有在页面里新发的消息才读当前时间。
 */
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  ChatComposer,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatMessageMetadata,
  Divider,
  Drawer,
  EmptyState,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
  StackItem,
  StatusDot,
  Text,
  TextInput,
  Timestamp,
  useMediaQuery,
  useToast,
  VStack,
} from '@astryx-vue/core'
import { computed, defineComponent, h, ref } from 'vue'

type Presence = 'online' | 'busy' | 'offline'
type UserId = 'mira' | 'devon' | 'sasha' | 'you'

interface Channel {
  id: string
  name: string
  topic: string
  unread: number
}

interface DirectMessage {
  id: string
  userId: UserId
  presence: Presence
  unread: number
}

/** 一组消息：同一个人连续发的几条气泡。 */
interface StreamMessage {
  id: string
  userId: UserId
  time: string
  bubbles: string[]
}

interface ThreadReply {
  id: string
  userId: UserId
  time: string
  text: string
}

const USERS: Record<UserId, { name: string }> = {
  mira: { name: 'Mira Chen' },
  devon: { name: 'Devon Park' },
  sasha: { name: 'Sasha Ortiz' },
  you: { name: 'Riley Quinn' },
}

const CHANNELS: Channel[] = [
  { id: 'design-systems', name: 'design-systems', topic: 'Component APIs, tokens, and release coordination', unread: 0 },
  { id: 'frontend-guild', name: 'frontend-guild', topic: 'Cross-team frontend practices', unread: 4 },
  { id: 'releases', name: 'releases', topic: 'Release announcements and rollbacks', unread: 12 },
  { id: 'random', name: 'random', topic: 'Everything else', unread: 0 },
]

const DIRECT_MESSAGES: DirectMessage[] = [
  { id: 'dm-mira', userId: 'mira', presence: 'online', unread: 0 },
  { id: 'dm-devon', userId: 'devon', presence: 'busy', unread: 2 },
  { id: 'dm-sasha', userId: 'sasha', presence: 'offline', unread: 0 },
]

const PRESENCE_VARIANT: Record<Presence, 'success' | 'error' | 'neutral'> = {
  online: 'success',
  busy: 'error',
  offline: 'neutral',
}

const PRESENCE_LABEL: Record<Presence, string> = {
  online: 'Online',
  busy: 'Busy',
  offline: 'Offline',
}

/** 每个会话的消息，按频道或私信的 id 存。 */
const INITIAL_MESSAGES: Record<string, StreamMessage[]> = {
  'design-systems': [
    {
      id: 'm1',
      userId: 'mira',
      time: '2026-06-30T09:12:00',
      bubbles: [
        'Morning! The Timestamp component now supports a `system_date` format, worth switching the audit log over.',
        'I put the migration notes in the wiki under Decisions.',
      ],
    },
    { id: 'm2', userId: 'devon', time: '2026-06-30T09:15:00', bubbles: ['Nice. Does that unblock the incident console timeline work?'] },
    {
      id: 'm3',
      userId: 'you',
      time: '2026-06-30T09:17:00',
      bubbles: [
        'It does. I will pick that up after the template review.',
        'One question on the List density defaults: should channel sidebars use compact or balanced? The spec shows both.',
      ],
    },
    {
      id: 'm4',
      userId: 'sasha',
      time: '2026-06-30T09:24:00',
      bubbles: ['Heads up: the token sync job ran clean overnight, no drift between core and the theme packages.'],
    },
    { id: 'm5', userId: 'mira', time: '2026-06-30T09:26:00', bubbles: ['Great, closing out the drift task then.'] },
  ],
  'frontend-guild': [
    { id: 'g1', userId: 'devon', time: '2026-06-30T08:40:00', bubbles: ['Guild sync moved to Thursday this week to avoid the release freeze.'] },
    { id: 'g2', userId: 'you', time: '2026-06-30T08:44:00', bubbles: ['Works for me. The agenda doc is updated.'] },
  ],
  'dm-mira': [
    { id: 'd1', userId: 'mira', time: '2026-06-30T08:05:00', bubbles: ['Can you review the density note before standup?'] },
    { id: 'd2', userId: 'you', time: '2026-06-30T08:07:00', bubbles: ['On it, I will leave comments inline.'] },
  ],
  'dm-devon': [
    { id: 'd3', userId: 'devon', time: '2026-06-30T09:30:00', bubbles: ['Pushed the timeline fix to a branch.', 'Want to pair on the review after lunch?'] },
  ],
}

/** 讨论串的回复，按它回复的那组消息的 id 存。 */
const INITIAL_THREADS: Record<string, ThreadReply[]> = {
  m3: [
    { id: 't1', userId: 'mira', time: '2026-06-30T09:19:00', text: 'Compact for navigation surfaces. Balanced is for content lists where descriptions carry weight.' },
    { id: 't2', userId: 'devon', time: '2026-06-30T09:21:00', text: 'Agreed. The sidebar rows here are a good reference implementation.' },
  ],
}

const INITIAL_UNREAD: Record<string, number> = Object.fromEntries(
  [...CHANNELS, ...DIRECT_MESSAGES].map(item => [item.id, item.unread]),
)

const showToast = useToast()
const conversationId = ref('design-systems')
const messages = ref(INITIAL_MESSAGES)
const threads = ref(INITIAL_THREADS)
const unread = ref(INITIAL_UNREAD)
const threadId = ref<string | null>('m3')
const isThreadDrawerOpen = ref(false)
const searchQuery = ref('')
const isNarrow = useMediaQuery('(max-width: 1024px)')

const channel = computed(() => CHANNELS.find(item => item.id === conversationId.value))
const dm = computed(() => DIRECT_MESSAGES.find(item => item.id === conversationId.value))
const title = computed(() => channel.value ? channel.value.name : USERS[dm.value?.userId ?? 'you'].name)
const stream = computed(() => messages.value[conversationId.value] ?? [])
const threadRoot = computed(() => stream.value.find(message => message.id === threadId.value))
const threadReplies = computed(() => threadId.value ? (threads.value[threadId.value] ?? []) : [])
/** 讨论串顶部那条：被回复那组消息的最后一条气泡。 */
const threadRootReply = computed<ThreadReply | null>(() => threadRoot.value
  ? { id: threadRoot.value.id, userId: threadRoot.value.userId, time: threadRoot.value.time, text: threadRoot.value.bubbles.at(-1) ?? '' }
  : null)

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())
const visibleChannels = computed(() => CHANNELS.filter(item => item.name.toLowerCase().includes(normalizedQuery.value)))
const visibleDms = computed(() => DIRECT_MESSAGES.filter(item => USERS[item.userId].name.toLowerCase().includes(normalizedQuery.value)))

/** 搜索框起始位置的放大镜，供 `TextInput` 的 `startIcon` 使用。 */
const MagnifyingGlassIcon = defineComponent({
  render: () => h(Icon, { name: 'heroicons:magnifying-glass' }),
})

// 演示：换成真正打开对应视图的调用
function demoAction(what: string) {
  showToast({ body: `Demo: ${what} would open here`, uniqueID: what })
}

function openConversation(id: string) {
  conversationId.value = id
  threadId.value = null
  unread.value = { ...unread.value, [id]: 0 }
}

function openThread(id: string) {
  threadId.value = id
  isThreadDrawerOpen.value = true
}

function closeThread() {
  threadId.value = null
  isThreadDrawerOpen.value = false
}

function sendMessage(text: string) {
  const body = text.trim()
  if (!body)
    return
  const current = messages.value[conversationId.value] ?? []
  messages.value = {
    ...messages.value,
    [conversationId.value]: [
      ...current,
      { id: `sent-${conversationId.value}-${current.length}`, userId: 'you', time: new Date().toISOString(), bubbles: [body] },
    ],
  }
}

function sendReply(text: string) {
  const body = text.trim()
  const id = threadId.value
  if (!body || !id)
    return
  const current = threads.value[id] ?? []
  threads.value = {
    ...threads.value,
    [id]: [...current, { id: `reply-${id}-${current.length}`, userId: 'you', time: new Date().toISOString(), text: body }],
  }
}

function bubbleGroup(message: StreamMessage, index: number) {
  if (message.bubbles.length === 1)
    return undefined
  if (index === 0)
    return 'first'
  return index === message.bubbles.length - 1 ? 'last' : 'middle'
}

/**
 * 讨论串只写一份，在右侧面板和窄屏抽屉两处复用：
 * DefineThread 记下自己的默认插槽，ReuseThread 在别处把它渲染出来。
 */
const threadSlot = ref<(() => unknown) | undefined>()
const DefineThread = defineComponent({
  setup(_, { slots }) {
    return () => {
      threadSlot.value = slots.default
      return null
    }
  },
})
const ReuseThread = defineComponent({
  setup() {
    return () => threadSlot.value?.()
  },
})

/** 讨论串里的一行：头像、名字、时间和正文。 */
const ThreadReplyRow = defineComponent({
  props: { reply: { type: Object as () => ThreadReply, required: true } },
  setup(props) {
    return () => {
      const user = USERS[props.reply.userId]
      return h(HStack, { gap: 2, vAlign: 'start' }, () => [
        h(Avatar, { name: user.name, size: 'sm' }),
        h(StackItem, { size: 'fill' }, () => h(VStack, { gap: 0.5 }, () => [
          h(HStack, { gap: 2, vAlign: 'center' }, () => [
            h(Text, { type: 'body', weight: 'bold' }, () => user.name),
            h(Text, { type: 'supporting', color: 'secondary' }, () => h(Timestamp, { value: props.reply.time, format: 'time' })),
          ]),
          h(Text, { type: 'body' }, () => props.reply.text),
        ])),
      ])
    }
  },
})
</script>

<template>
  <AppShell :content-padding="0">
    <template #sideNav>
      <SideNav :resizable="{ defaultWidth: 260, minWidth: 220, maxWidth: 360 }">
        <template #header>
          <SideNavHeading heading="Astryx HQ">
            <template #icon>
              <Avatar name="Astryx HQ" size="sm" />
            </template>
            <template #end>
              <IconButton label="New message" tooltip="New message" variant="ghost" size="sm" @click="demoAction('A new message')">
                <Icon name="heroicons:pencil-square" size="sm" color="inherit" />
              </IconButton>
            </template>
          </SideNavHeading>
        </template>
        <template #top>
          <TextInput
            v-model="searchQuery"
            label="Jump to"
            is-label-hidden
            placeholder="Jump to..."
            :start-icon="MagnifyingGlassIcon"
            has-clear
          />
        </template>
        <template #footer>
          <SideNavSection title="Account" is-header-hidden>
            <SideNavItem label="Preferences" @click="demoAction('Preferences')">
              <template #icon>
                <Icon name="heroicons:cog-6-tooth" size="sm" />
              </template>
            </SideNavItem>
          </SideNavSection>
        </template>
        <SideNavSection title="Channels">
          <SideNavItem
            v-for="item in visibleChannels"
            :key="item.id"
            :label="item.name"
            :is-selected="item.id === conversationId"
            @click="openConversation(item.id)"
          >
            <template #icon>
              <Icon name="heroicons:hashtag" size="sm" />
            </template>
            <template v-if="(unread[item.id] ?? 0) > 0" #end>
              <Badge :label="String(unread[item.id] ?? 0)" variant="neutral" />
            </template>
          </SideNavItem>
        </SideNavSection>
        <SideNavSection title="Direct messages">
          <SideNavItem
            v-for="item in visibleDms"
            :key="item.id"
            :label="USERS[item.userId].name"
            :is-selected="item.id === conversationId"
            @click="openConversation(item.id)"
          >
            <template #end>
              <HStack :gap="2" align="center">
                <StatusDot :variant="PRESENCE_VARIANT[item.presence]" :label="PRESENCE_LABEL[item.presence]" />
                <Badge v-if="(unread[item.id] ?? 0) > 0" :label="String(unread[item.id] ?? 0)" variant="neutral" />
              </HStack>
            </template>
          </SideNavItem>
        </SideNavSection>
      </SideNav>
    </template>

    <DefineThread>
      <Layout v-if="threadRoot && threadRootReply" height="fill">
        <template #header>
          <LayoutHeader has-divider :padding="3">
            <HStack :gap="2" align="center">
              <StackItem size="fill">
                <VStack :gap="0">
                  <Heading :level="4">
                    Thread
                  </Heading>
                  <Text type="supporting" color="secondary" :max-lines="1">
                    {{ channel ? `#${channel.name}` : title }}
                  </Text>
                </VStack>
              </StackItem>
              <IconButton label="Close thread" tooltip="Close thread" variant="ghost" size="sm" @click="closeThread">
                <Icon name="heroicons:x-mark" size="sm" color="inherit" />
              </IconButton>
            </HStack>
          </LayoutHeader>
        </template>
        <LayoutContent :padding="3">
          <VStack :gap="4">
            <ThreadReplyRow :reply="threadRootReply" />
            <Divider />
            <ThreadReplyRow v-for="reply in threadReplies" :key="reply.id" :reply="reply" />
          </VStack>
        </LayoutContent>
        <template #footer>
          <LayoutFooter :padding="3">
            <ChatComposer placeholder="Reply in thread" @submit="sendReply" />
          </LayoutFooter>
        </template>
      </Layout>
    </DefineThread>

    <Layout height="fill">
      <template #header>
        <LayoutHeader has-divider :padding="3">
          <HStack :gap="3" align="center">
            <Icon v-if="channel" name="heroicons:hashtag" size="sm" />
            <Avatar v-else :name="title" size="sm" />
            <StackItem size="fill">
              <VStack :gap="0">
                <Heading :level="3">
                  {{ title }}
                </Heading>
                <Text type="supporting" color="secondary" :max-lines="1">
                  {{ channel ? channel.topic : PRESENCE_LABEL[dm?.presence ?? 'offline'] }}
                </Text>
              </VStack>
            </StackItem>
            <IconButton
              v-if="channel"
              label="Members"
              tooltip="Members"
              variant="ghost"
              size="sm"
              @click="demoAction(`The #${channel.name} member list`)"
            >
              <Icon name="heroicons:user-group" size="sm" color="inherit" />
            </IconButton>
          </HStack>
        </LayoutHeader>
      </template>

      <LayoutContent :padding="0" :is-scrollable="false">
        <VStack height="100%">
          <ChatLayout>
            <template v-if="stream.length > 0" #default>
              <ChatMessageList density="balanced">
                <ChatMessage
                  v-for="message in stream"
                  :key="message.id"
                  :sender="message.userId === 'you' ? 'user' : 'assistant'"
                >
                  <template v-if="message.userId !== 'you'" #avatar>
                    <Avatar :name="USERS[message.userId].name" size="md" />
                  </template>
                  <ChatMessageBubble
                    v-for="(text, index) in message.bubbles"
                    :key="`${message.id}-${index}`"
                    :group="bubbleGroup(message, index)"
                    :name="message.userId !== 'you' && index === 0 ? USERS[message.userId].name : undefined"
                  >
                    {{ text }}
                    <template v-if="index === message.bubbles.length - 1" #metadata>
                      <ChatMessageMetadata>
                        <template #timestamp>
                          <Timestamp :value="message.time" format="time" />
                        </template>
                        <template v-if="(threads[message.id] ?? []).length > 0" #footer>
                          <Button
                            :label="(threads[message.id] ?? []).length === 1 ? '1 reply' : `${(threads[message.id] ?? []).length} replies`"
                            variant="ghost"
                            size="sm"
                            @click="openThread(message.id)"
                          />
                        </template>
                      </ChatMessageMetadata>
                    </template>
                  </ChatMessageBubble>
                </ChatMessage>
              </ChatMessageList>
            </template>
            <template #composer>
              <ChatComposer :placeholder="channel ? `Message #${channel.name}` : `Message ${title}`" @submit="sendMessage" />
            </template>
            <template #empty>
              <EmptyState
                title="No messages yet"
                description="Start the conversation. Messages posted here are visible to everyone in it."
              >
                <template #icon>
                  <Icon name="heroicons:inbox" size="lg" />
                </template>
              </EmptyState>
            </template>
          </ChatLayout>
        </VStack>
      </LayoutContent>

      <template v-if="threadRoot && !isNarrow" #end>
        <LayoutPanel :width="340" :padding="0" has-divider>
          <ReuseThread />
        </LayoutPanel>
      </template>
    </Layout>

    <Drawer
      label="Thread"
      :is-open="isNarrow && isThreadDrawerOpen && threadRoot != null"
      :width="360"
      :padding="0"
      @open-change="value => { isThreadDrawerOpen = value }"
    >
      <ReuseThread v-if="isNarrow" />
    </Drawer>
  </AppShell>
</template>
