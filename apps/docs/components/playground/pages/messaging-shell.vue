<script setup lang="ts">
import {
  Avatar,
  AvatarStatusDot,
  Badge,
  ChatComposer,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatMessageMetadata,
  ChatSystemMessage,
  Divider,
  EmptyState,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutPanel,
  List,
  ListItem,
  StackItem,
  StatusDot,
  Text,
  TextInput,
  Timestamp,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import { computed, defineComponent, h, ref } from 'vue'

type Presence = 'online' | 'busy' | 'offline'

interface Channel {
  id: string
  name: string
  topic: string
  unread: number
}

interface DirectMessage {
  id: string
  userId: string
  presence: Presence
  unread: number
}

interface StreamMessage {
  id: string
  userId: string
  time: string
  bubbles: string[]
}

interface ThreadReply {
  id: string
  userId: string
  time: string
  text: string
}

const USERS: Record<string, { name: string }> = {
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

/** `AvatarStatusDot` 只有 success | neutral | error，没有 warning。 */
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

const MESSAGES_BY_CHANNEL: Record<string, StreamMessage[]> = {
  'design-systems': [
    {
      id: 'm1',
      userId: 'mira',
      time: '2026-06-30T09:12:00',
      bubbles: [
        'Morning! The Timestamp component now supports a `system_date` format — worth switching the audit log over.',
        'I put the migration notes in the wiki under Decisions.',
      ],
    },
    {
      id: 'm2',
      userId: 'devon',
      time: '2026-06-30T09:15:00',
      bubbles: ['Nice. Does that unblock the incident console timeline work?'],
    },
    {
      id: 'm3',
      userId: 'you',
      time: '2026-06-30T09:17:00',
      bubbles: [
        'It does — I will pick that up after the template review.',
        'One question on the List density defaults, will start a thread.',
      ],
    },
    {
      id: 'm4',
      userId: 'sasha',
      time: '2026-06-30T09:24:00',
      bubbles: [
        'Heads up: the token sync job ran clean overnight, no drift between core and the theme packages.',
      ],
    },
    {
      id: 'm5',
      userId: 'mira',
      time: '2026-06-30T09:26:00',
      bubbles: ['Great — closing out the drift task then.'],
    },
  ],
  'frontend-guild': [
    {
      id: 'g1',
      userId: 'devon',
      time: '2026-06-30T08:40:00',
      bubbles: ['Guild sync moved to Thursday this week to avoid the release freeze.'],
    },
    {
      id: 'g2',
      userId: 'you',
      time: '2026-06-30T08:44:00',
      bubbles: ['Works for me — agenda doc is updated.'],
    },
  ],
}

const THREAD_ROOT: ThreadReply = {
  id: 't0',
  userId: 'you',
  time: '2026-06-30T09:17:30',
  text: 'One question on the List density defaults — should channel sidebars use compact or balanced? The spec shows both.',
}

const THREAD_REPLIES: ThreadReply[] = [
  {
    id: 't1',
    userId: 'mira',
    time: '2026-06-30T09:19:00',
    text: 'Compact for navigation surfaces. Balanced is for content lists where descriptions carry weight.',
  },
  {
    id: 't2',
    userId: 'devon',
    time: '2026-06-30T09:21:00',
    text: 'Agreed — the sidebar rows here are a good reference implementation.',
  },
]

const RAIL_ITEMS = [
  { id: 'home', label: 'Home', icon: 'i-heroicons-home' },
  { id: 'dms', label: 'Direct messages', icon: 'i-heroicons-chat-bubble-left-right' },
  { id: 'activity', label: 'Activity', icon: 'i-heroicons-bell' },
  { id: 'saved', label: 'Saved items', icon: 'i-heroicons-bookmark' },
]

const selectedChannelId = ref('design-systems')
const selectedDmId = ref<string | null>(null)
const isThreadOpen = ref(true)
const searchQuery = ref('')

const isThreadHidden = useMediaQuery('(max-width: 1024px)')
const isSidebarHidden = useMediaQuery('(max-width: 768px)')

const selectedChannel = computed(() => CHANNELS.find(channel => channel.id === selectedChannelId.value) ?? CHANNELS[0])
const messages = computed(() => MESSAGES_BY_CHANNEL[selectedChannel.value.id] ?? [])

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())
const visibleChannels = computed(() => CHANNELS.filter(channel => channel.name.toLowerCase().includes(normalizedQuery.value)))
const visibleDms = computed(() => DIRECT_MESSAGES.filter(dm => USERS[dm.userId].name.toLowerCase().includes(normalizedQuery.value)))
const showThreadPanel = computed(() => isThreadOpen.value && !isThreadHidden.value)
/** 搜索图标以组件形式给 `start-icon`，图标插件按类名渲染。 */
const SearchIcon = defineComponent({
  render: () => h('span', { 'class': 'i-heroicons-magnifying-glass', 'aria-hidden': 'true' }),
})

function selectChannel(channelId: string) {
  selectedChannelId.value = channelId
  selectedDmId.value = null
}
</script>

<template>
  <div class="messaging-root">
    <Layout height="fill">
      <template #start>
        <LayoutPanel :width="68" :padding="0">
          <VStack :gap="2" class="messaging-rail">
            <Avatar name="Astryx HQ" size="md" />
            <IconButton
              v-for="item in RAIL_ITEMS"
              :key="item.id"
              :label="item.label"
              :tooltip="item.label"
              :variant="item.id === 'home' ? 'secondary' : 'ghost'"
            >
              <template #icon>
                <Icon :icon="item.icon" size="sm" color="inherit" />
              </template>
            </IconButton>
            <div class="messaging-rail-spacer" />
            <IconButton label="Settings" tooltip="Settings" variant="ghost">
              <template #icon>
                <Icon icon="i-heroicons-cog-6-tooth" size="sm" color="inherit" />
              </template>
            </IconButton>
            <Avatar name="Riley Quinn" size="md">
              <template #status>
                <AvatarStatusDot variant="success" label="Online" />
              </template>
            </Avatar>
          </VStack>
        </LayoutPanel>

        <LayoutPanel v-if="!isSidebarHidden" :width="260" :padding="0">
          <VStack class="messaging-sidebar" :gap="0">
            <HStack :gap="2" class="messaging-sidebar-header">
              <StackItem size="fill">
                <Heading :level="5">
                  Astryx HQ
                </Heading>
              </StackItem>
              <IconButton label="New message" tooltip="New message" variant="ghost" size="sm">
                <template #icon>
                  <Icon icon="i-heroicons-pencil-square" size="sm" color="inherit" />
                </template>
              </IconButton>
            </HStack>
            <div class="messaging-sidebar-search">
              <TextInput
                v-model="searchQuery"
                label="Jump to"
                is-label-hidden
                size="sm"
                placeholder="Jump to..."
                :start-icon="SearchIcon"
              />
            </div>
            <VStack class="messaging-sidebar-scroll" is-scrollable :gap="0">
              <List density="compact" :has-dividers="false">
                <template #header>
                  <Text type="label" size="sm" color="secondary">
                    Channels
                  </Text>
                </template>
                <ListItem
                  v-for="channel in visibleChannels"
                  :key="channel.id"
                  :label="channel.name"
                  :is-selected="selectedDmId === null && channel.id === selectedChannelId"
                  @click="selectChannel(channel.id)"
                >
                  <template #startContent>
                    <Icon icon="i-heroicons-hashtag" size="sm" color="secondary" />
                  </template>
                  <template v-if="channel.unread > 0" #endContent>
                    <Badge :label="String(channel.unread)" variant="neutral" />
                  </template>
                </ListItem>
              </List>
              <div class="messaging-section-gap">
                <List density="compact" :has-dividers="false">
                  <template #header>
                    <Text type="label" size="sm" color="secondary">
                      Direct messages
                    </Text>
                  </template>
                  <ListItem
                    v-for="dm in visibleDms"
                    :key="dm.id"
                    :label="USERS[dm.userId].name"
                    :is-selected="selectedDmId === dm.id"
                    @click="selectedDmId = dm.id"
                  >
                    <template #startContent>
                      <Avatar :name="USERS[dm.userId].name" size="sm">
                        <template #status>
                          <AvatarStatusDot :variant="PRESENCE_VARIANT[dm.presence]" :label="PRESENCE_LABEL[dm.presence]" />
                        </template>
                      </Avatar>
                    </template>
                    <template v-if="dm.unread > 0" #endContent>
                      <Badge :label="String(dm.unread)" variant="neutral" />
                    </template>
                  </ListItem>
                </List>
              </div>
            </VStack>
          </VStack>
        </LayoutPanel>
      </template>

      <template v-if="showThreadPanel" #end>
        <LayoutPanel :width="340" :padding="0">
          <VStack class="messaging-thread" :gap="0">
            <HStack :gap="2" class="messaging-thread-header">
              <StackItem size="fill">
                <HStack :gap="2" class="messaging-thread-title">
                  <Text weight="semibold">
                    Thread
                  </Text>
                  <Text type="supporting" color="secondary">
                    #{{ selectedChannel.name }}
                  </Text>
                </HStack>
              </StackItem>
              <IconButton label="Close thread" tooltip="Close thread" variant="ghost" size="sm" @click="isThreadOpen = false">
                <template #icon>
                  <Icon icon="i-heroicons-x-mark" size="sm" color="inherit" />
                </template>
              </IconButton>
            </HStack>
            <Divider />
            <VStack class="messaging-thread-scroll" is-scrollable :gap="0">
              <ChatMessageList density="compact">
                <ChatMessage sender="assistant">
                  <template #avatar>
                    <Avatar :name="USERS[THREAD_ROOT.userId].name" size="md" />
                  </template>
                  <ChatMessageBubble :name="USERS[THREAD_ROOT.userId].name">
                    {{ THREAD_ROOT.text }}
                    <template #metadata>
                      <ChatMessageMetadata>
                        <template #timestamp>
                          <Timestamp :value="THREAD_ROOT.time" format="time" />
                        </template>
                      </ChatMessageMetadata>
                    </template>
                  </ChatMessageBubble>
                </ChatMessage>
                <ChatSystemMessage variant="divider">
                  {{ THREAD_REPLIES.length }} replies
                </ChatSystemMessage>
                <ChatMessage v-for="reply in THREAD_REPLIES" :key="reply.id" sender="assistant">
                  <template #avatar>
                    <Avatar :name="USERS[reply.userId].name" size="md" />
                  </template>
                  <ChatMessageBubble :name="USERS[reply.userId].name">
                    {{ reply.text }}
                    <template #metadata>
                      <ChatMessageMetadata>
                        <template #timestamp>
                          <Timestamp :value="reply.time" format="time" />
                        </template>
                      </ChatMessageMetadata>
                    </template>
                  </ChatMessageBubble>
                </ChatMessage>
              </ChatMessageList>
            </VStack>
            <div class="messaging-thread-composer">
              <ChatComposer density="compact" placeholder="Reply in thread..." />
            </div>
          </VStack>
        </LayoutPanel>
      </template>

      <LayoutContent :padding="0">
        <VStack class="messaging-stream" :gap="0">
          <HStack :gap="3" class="messaging-stream-header">
            <Icon icon="i-heroicons-hashtag" size="sm" color="secondary" />
            <Heading :level="5">
              {{ selectedChannel.name }}
            </Heading>
            <StackItem size="fill" class="messaging-stream-topic">
              <Text type="supporting" color="secondary" :max-lines="1">
                {{ selectedChannel.topic }}
              </Text>
            </StackItem>
            <StatusDot variant="success" label="12 online" />
            <IconButton label="Members" tooltip="Members" variant="ghost" size="sm">
              <template #icon>
                <Icon icon="i-heroicons-user-group" size="sm" color="inherit" />
              </template>
            </IconButton>
          </HStack>
          <Divider />
          <VStack class="messaging-chat-area" is-scrollable :gap="0">
            <ChatLayout>
              <ChatMessageList v-if="messages.length > 0" density="balanced">
                <ChatSystemMessage variant="divider">
                  Tuesday, June 30
                </ChatSystemMessage>
                <ChatSystemMessage>
                  Sasha Ortiz joined #{{ selectedChannel.name }}
                </ChatSystemMessage>
                <ChatMessage
                  v-for="message in messages"
                  :key="message.id"
                  :sender="message.userId === 'you' ? 'user' : 'assistant'"
                >
                  <template v-if="message.userId !== 'you'" #avatar>
                    <Avatar :name="USERS[message.userId].name" size="md" />
                  </template>
                  <ChatMessageBubble
                    v-for="(bubble, index) in message.bubbles"
                    :key="`${message.id}-${index}`"
                    :group="message.bubbles.length === 1 ? undefined : index === 0 ? 'first' : index === message.bubbles.length - 1 ? 'last' : 'middle'"
                    :name="message.userId !== 'you' && index === 0 ? USERS[message.userId].name : undefined"
                  >
                    {{ bubble }}
                    <template v-if="index === message.bubbles.length - 1" #metadata>
                      <ChatMessageMetadata>
                        <template #timestamp>
                          <Timestamp :value="message.time" format="time" />
                        </template>
                      </ChatMessageMetadata>
                    </template>
                  </ChatMessageBubble>
                </ChatMessage>
              </ChatMessageList>
              <template #composer>
                <ChatComposer :placeholder="`Message #${selectedChannel.name}`" />
              </template>
              <template #empty>
                <EmptyState
                  title="No messages yet"
                  description="Start the conversation — messages posted here are visible to the whole channel."
                />
              </template>
            </ChatLayout>
          </VStack>
        </VStack>
      </LayoutContent>
    </Layout>
  </div>
</template>

<style>
.messaging-root {
  height: 100dvh;
  width: 100%;
}
.messaging-rail {
  height: 100%;
  align-items: center;
  padding-block: var(--astryx-spacing-3);
}
.messaging-rail-spacer {
  flex: 1;
}
.messaging-sidebar {
  height: 100%;
  min-height: 0;
}
.messaging-sidebar-header {
  align-items: center;
  padding-inline: var(--astryx-spacing-3);
  padding-block: var(--astryx-spacing-3);
}
.messaging-sidebar-search {
  padding-inline: var(--astryx-spacing-3);
  padding-block-end: var(--astryx-spacing-2);
}
.messaging-sidebar-scroll {
  min-height: 0;
  padding-inline: var(--astryx-spacing-2);
  padding-block-end: var(--astryx-spacing-3);
}
.messaging-section-gap {
  margin-block-start: var(--astryx-spacing-4);
}
.messaging-stream {
  height: 100%;
  min-height: 0;
}
.messaging-stream-header {
  align-items: center;
  padding-inline: var(--astryx-spacing-4);
  padding-block: var(--astryx-spacing-3);
}
.messaging-stream-topic {
  min-width: 0;
}
.messaging-chat-area {
  min-height: 0;
  flex: 1;
}
.messaging-thread {
  height: 100%;
  min-height: 0;
}
.messaging-thread-title {
  align-items: baseline;
}
.messaging-thread-header {
  align-items: center;
  padding-inline: var(--astryx-spacing-3);
  padding-block: var(--astryx-spacing-2);
}
.messaging-thread-scroll {
  min-height: 0;
  padding-inline: var(--astryx-spacing-3);
  padding-block: var(--astryx-spacing-3);
}
.messaging-thread-composer {
  padding: var(--astryx-spacing-3);
}
</style>
