<script setup lang="ts">
import type { ChatComposerInputHandle, ChatComposerToken, ChatComposerTrigger, ChatToolCallItem } from '@astryx-vue/core'
import {
  Avatar,
  ChatComposer,
  ChatComposerDrawer,
  ChatComposerInput,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatMessageMetadata,
  ChatReasoning,
  ChatTokenizedText,
  ChatToolCalls,
  ClickableCard,
  createStaticSource,
  Dialog,
  DialogHeader,
  DropdownMenu,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  Markdown,
  Section,
  StackItem,
  Text,
  Timestamp,
  Token,
  useStreamingText,
  VStack,
} from '@astryx-vue/core'
import { computed, onBeforeUnmount, reactive, ref, useTemplateRef } from 'vue'

const ARTIFACT_TITLE = 'JWT Token Refresh: Design & Rollout'
const ARTIFACT_BODY = `## The Fix

The middleware catches \`TokenExpiredError\` and refreshes before it rejects. A missing refresh token still returns \`401\`.

## Rollout

Ship behind \`silent_refresh\` at 5% and alert if failures exceed **2%**.`

const SOURCES = {
  jwt: { title: 'RFC 7519', url: 'https://datatracker.ietf.org/doc/html/rfc7519' },
}

const MENTION_ITEMS = [
  { id: 'agent', label: 'Agent', description: 'Assistant' },
  { id: 'cindy', label: 'Cindy Zhang', description: 'Design Systems' },
  { id: 'alex', label: 'Alex Johnson', description: 'Frontend' },
]

const MESSAGE_TOKENS: ChatComposerToken[] = [
  { value: '@agent', label: '@Agent', variant: 'blue' },
  { value: '@cindy', label: 'Cindy Zhang', variant: 'blue' },
  { value: '@alex', label: 'Alex Johnson', variant: 'blue' },
]

const composerTriggers: ChatComposerTrigger[] = [{
  character: '@',
  menuLabel: 'People',
  searchSource: createStaticSource(MENTION_ITEMS),
  onSelect: item => ({
    value: `@${item.id}`,
    label: item.id === 'agent' ? '@Agent' : item.label,
    variant: 'blue' as const,
  }),
}]

const REASONING = 'Validation throws before the refresh call. The catch has to refresh, then fall back to 401.'
const LIVE_ANSWER = 'The expiry path now refreshes first. The token format follows [jwt], and the rollout thresholds are in the document.'

interface LiveUser {
  kind: 'user'
  id: number
  text: string
  files: string[]
  at: string
}

interface LiveAssistant {
  kind: 'assistant'
  id: number
  at: string
  reasoning: string
  reasoningStreaming: boolean
  reasoningDuration?: string
  tools: ChatToolCallItem[]
  answer: string
  answerStreaming: boolean
  showArtifact: boolean
  stopped: boolean
}

const composerMode = ref<'ask' | 'edit'>('ask')
const attachments = ref<string[]>(['middleware.ts'])
const isArtifactOpen = ref(false)
const isStreaming = ref(false)
const liveTurns = ref<Array<LiveUser | LiveAssistant>>([])
const activeAssistantId = ref<number | null>(null)
const reasoningSource = ref('')
const reasoningLive = ref(false)
const answerSource = ref('')
const answerLive = ref(false)
const reasoningText = useStreamingText(reasoningSource, reasoningLive)
const answerText = useStreamingText(answerSource, answerLive)
const composerInputRef = useTemplateRef<ChatComposerInputHandle>('composerInput')
const fileInputRef = useTemplateRef<HTMLInputElement>('fileInput')
const placeholder = computed(() => composerMode.value === 'ask' ? 'Ask anything...' : 'Describe your edit...')

let nextId = 1
let timers: number[] = []

function addFiles(files: File[]) {
  if (files.length === 0)
    return
  attachments.value = [...attachments.value, ...files.map(file => file.name)]
}

function onPickFiles(event: Event) {
  const input = event.target
  if (!(input instanceof HTMLInputElement))
    return
  addFiles(Array.from(input.files ?? []))
  input.value = ''
}

function removeAttachment(name: string) {
  attachments.value = attachments.value.filter(item => item !== name)
}

function mention() {
  composerInputRef.value?.focus()
  composerInputRef.value?.insertText('@')
}

function clearTimers() {
  for (const id of timers)
    window.clearTimeout(id)
  timers = []
}

function displayedReasoning(turn: LiveAssistant): string {
  return turn.id === activeAssistantId.value && reasoningLive.value ? reasoningText.value : turn.reasoning
}

function displayedAnswer(turn: LiveAssistant): string {
  return turn.id === activeAssistantId.value && answerLive.value ? answerText.value : turn.answer
}

function stop() {
  clearTimers()
  const turn = liveTurns.value.find(item => item.kind === 'assistant' && item.id === activeAssistantId.value)
  if (turn && turn.kind === 'assistant') {
    if (reasoningLive.value)
      reasoningSource.value = reasoningText.value
    if (answerLive.value)
      answerSource.value = answerText.value
    turn.reasoning = reasoningSource.value
    turn.answer = answerSource.value
    turn.reasoningStreaming = false
    turn.answerStreaming = false
    turn.stopped = true
    turn.tools = turn.tools.map(tool => tool.status === 'running' || tool.status === 'pending'
      ? { ...tool, status: 'error', errorMessage: 'Stopped' }
      : tool)
  }
  reasoningLive.value = false
  answerLive.value = false
  isStreaming.value = false
}

function beginAssistant() {
  const turn = reactive<LiveAssistant>({
    kind: 'assistant',
    id: nextId,
    at: new Date().toISOString(),
    reasoning: '',
    reasoningStreaming: true,
    tools: [],
    answer: '',
    answerStreaming: false,
    showArtifact: false,
    stopped: false,
  })
  nextId += 1
  activeAssistantId.value = turn.id
  liveTurns.value = [...liveTurns.value, turn]
  isStreaming.value = true
  reasoningSource.value = REASONING
  reasoningLive.value = true
  timers.push(window.setTimeout(() => {
    if (!isStreaming.value)
      return
    reasoningLive.value = false
    turn.reasoning = REASONING
    turn.reasoningStreaming = false
    turn.reasoningDuration = '1.2s'
    turn.tools = [{ name: 'read', target: 'middleware.ts', status: 'running' }]
  }, 700))
  timers.push(window.setTimeout(() => {
    if (!isStreaming.value)
      return
    turn.tools = [{ name: 'read', target: 'middleware.ts', status: 'complete', duration: '38ms' }]
    answerSource.value = LIVE_ANSWER
    answerLive.value = true
    turn.answerStreaming = true
  }, 1400))
  timers.push(window.setTimeout(() => {
    if (!isStreaming.value)
      return
    answerLive.value = false
    turn.answer = LIVE_ANSWER
    turn.answerStreaming = false
    turn.showArtifact = true
    isStreaming.value = false
  }, 2400))
}

function onSubmit(value: string) {
  if (isStreaming.value)
    return
  const files = attachments.value
  attachments.value = []
  liveTurns.value = [...liveTurns.value, {
    kind: 'user',
    id: nextId,
    text: value,
    files,
    at: new Date().toISOString(),
  }]
  nextId += 1
  beginAssistant()
}

onBeforeUnmount(clearTimers)
</script>

<template>
  <div class="pattern-frame">
    <input
      ref="fileInput"
      class="file-input"
      type="file"
      multiple
      tabindex="-1"
      aria-hidden="true"
      @change="onPickFiles"
    >
    <ChatLayout density="balanced" class="pattern-layout">
      <ChatMessageList :is-streaming="isStreaming">
        <ChatMessage sender="user">
          <HStack :gap="1" wrap="wrap">
            <Token label="middleware.ts" />
          </HStack>
          <ChatMessageBubble>
            <ChatTokenizedText text="@agent The JWT refresh logic seems broken." :tokens="MESSAGE_TOKENS" />
            <template #metadata>
              <ChatMessageMetadata>
                <template #timestamp>
                  <Timestamp value="2026-04-29T10:15:00" format="time" />
                </template>
              </ChatMessageMetadata>
            </template>
          </ChatMessageBubble>
        </ChatMessage>
        <ChatMessage sender="assistant">
          <template #avatar>
            <Avatar name="Agent" size="md" />
          </template>
          <ChatReasoning duration="2s">
            Validation runs before any refresh, so an expired access token never reaches the refresh call.
          </ChatReasoning>
          <ChatToolCalls
            :default-is-expanded="true"
            :calls="[
              { name: 'read', target: 'middleware.ts', status: 'complete', duration: '38ms' },
              { name: 'edit', target: 'middleware.ts', status: 'complete', duration: '85ms', additions: 8, deletions: 2 },
            ]"
          />
          <ChatMessageBubble variant="ghost">
            <Markdown density="compact" content="The catch returns `401` before `refreshToken()` runs. The token shape is specified in [jwt]." :sources="SOURCES" />
          </ChatMessageBubble>
          <ChatMessageBubble variant="ghost" width="100%">
            <ClickableCard :label="`Open ${ARTIFACT_TITLE}`" variant="muted" :padding="3" :max-width="360" @click="isArtifactOpen = true">
              <HStack :gap="3" align="center" width="100%">
                <Icon name="heroicons:document-text" size="md" color="secondary" />
                <StackItem size="fill">
                  <VStack :gap="0">
                    <Text type="label" weight="semibold">
                      {{ ARTIFACT_TITLE }}
                    </Text>
                    <Text type="supporting" color="secondary">
                      Document
                    </Text>
                  </VStack>
                </StackItem>
                <Icon name="heroicons:chevron-right" size="sm" color="secondary" />
              </HStack>
            </ClickableCard>
          </ChatMessageBubble>
        </ChatMessage>

        <template v-for="turn in liveTurns" :key="turn.id">
          <ChatMessage v-if="turn.kind === 'user'" sender="user">
            <HStack v-if="turn.files.length" :gap="1" wrap="wrap">
              <Token v-for="name in turn.files" :key="name" :label="name" />
            </HStack>
            <ChatMessageBubble>
              <ChatTokenizedText :text="turn.text" :tokens="MESSAGE_TOKENS" />
            </ChatMessageBubble>
          </ChatMessage>
          <ChatMessage v-else sender="assistant">
            <template #avatar>
              <Avatar name="Agent" size="md" />
            </template>
            <ChatReasoning
              v-if="turn.reasoningStreaming || displayedReasoning(turn)"
              :is-streaming="turn.reasoningStreaming"
              :duration="turn.reasoningDuration"
              :default-is-expanded="true"
            >
              {{ displayedReasoning(turn) }}
            </ChatReasoning>
            <ChatToolCalls v-if="turn.tools.length" :calls="turn.tools" />
            <ChatMessageBubble v-if="displayedAnswer(turn) || turn.stopped" variant="ghost">
              <Markdown
                v-if="displayedAnswer(turn)"
                density="compact"
                :content="displayedAnswer(turn)"
                :is-streaming="turn.answerStreaming"
                :sources="SOURCES"
              />
              <Text v-else type="body" color="secondary">
                Stopped before a reply was ready.
              </Text>
            </ChatMessageBubble>
            <ChatMessageBubble v-if="turn.showArtifact" variant="ghost" width="100%">
              <ClickableCard :label="`Open ${ARTIFACT_TITLE}`" variant="muted" :padding="3" :max-width="360" @click="isArtifactOpen = true">
                <HStack :gap="3" align="center" width="100%">
                  <Icon name="heroicons:document-text" size="md" color="secondary" />
                  <StackItem size="fill">
                    <Text type="label" weight="semibold">
                      {{ ARTIFACT_TITLE }}
                    </Text>
                  </StackItem>
                  <Icon name="heroicons:chevron-right" size="sm" color="secondary" />
                </HStack>
              </ClickableCard>
            </ChatMessageBubble>
          </ChatMessage>
        </template>
      </ChatMessageList>
      <template #composer>
        <ChatComposer
          :is-disabled="isStreaming"
          :is-stop-shown="isStreaming"
          :placeholder="placeholder"
          @submit="onSubmit"
          @stop="stop"
        >
          <template #input>
            <ChatComposerInput ref="composerInput" :triggers="composerTriggers" @files="addFiles" />
          </template>
          <template v-if="attachments.length" #drawer>
            <ChatComposerDrawer :count="attachments.length" label="Attachments">
              <Token v-for="name in attachments" :key="name" :label="name" @remove="removeAttachment(name)" />
            </ChatComposerDrawer>
          </template>
          <template #headerActions>
            <IconButton label="Mention" variant="ghost" size="sm" :is-disabled="isStreaming" @click="mention">
              <Icon name="heroicons:at-symbol" />
            </IconButton>
            <IconButton label="Attach" variant="ghost" size="sm" :is-disabled="isStreaming" @click="fileInputRef?.click()">
              <Icon name="heroicons:paper-clip" />
            </IconButton>
          </template>
          <template #footerActions>
            <DropdownMenu
              :button="{ label: composerMode === 'ask' ? 'Ask' : 'Edit', variant: 'ghost', size: 'sm', isDisabled: isStreaming }"
              :items="[
                { label: 'Ask', onClick: () => { composerMode = 'ask' } },
                { label: 'Edit', onClick: () => { composerMode = 'edit' } },
              ]"
            />
          </template>
        </ChatComposer>
      </template>
    </ChatLayout>

    <Dialog :is-open="isArtifactOpen" purpose="info" variant="fullscreen" @open-change="isArtifactOpen = $event">
      <Layout>
        <template #header>
          <DialogHeader
            :title="ARTIFACT_TITLE"
            subtitle="Document · Updated just now"
            has-divider
            has-close-button
            close-button-label="Close document"
            @open-change="isArtifactOpen = $event"
          />
        </template>
        <LayoutContent :padding="0">
          <Section v-if="isArtifactOpen" variant="transparent" class="artifact-scroll">
            <VStack :gap="2" class="article-body">
              <Heading :level="2">
                {{ ARTIFACT_TITLE }}
              </Heading>
              <Markdown :content="ARTIFACT_BODY" />
            </VStack>
          </Section>
        </LayoutContent>
      </Layout>
    </Dialog>
  </div>
</template>

<style scoped>
.pattern-frame {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 0;
}
.pattern-layout { flex: 1; min-height: 0; min-width: 0; }
.artifact-scroll { flex: 1; overflow-y: auto; }
.article-body { max-width: 720px; margin-inline: auto; }
.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
