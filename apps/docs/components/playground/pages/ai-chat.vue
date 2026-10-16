<script setup lang="ts">
import type { ChatComposerInputHandle, ChatComposerToken, ChatComposerTrigger, ChatToolCallItem } from '@astryx-vue/core'
import {
  Avatar,
  Button,
  Card,
  ChatComposer,
  ChatComposerDrawer,
  ChatComposerInput,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatMessageMetadata,
  ChatReasoning,
  ChatSystemMessage,
  ChatTokenizedText,
  ChatToolCalls,
  ClickableCard,
  CodeBlock,
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
  MoreMenu,
  ResizeHandle,
  Section,
  StackItem,
  Text,
  Timestamp,
  Token,
  Toolbar,
  useResizable,
  useStreamingText,
  VStack,
} from '@astryx-vue/core'
import { computed, onBeforeUnmount, reactive, ref, useTemplateRef } from 'vue'

const MOBILE_MAX_WIDTH = 767
const ARTIFACT_TITLE = 'JWT Token Refresh: Design & Rollout'
const ARTIFACT_SUBTITLE = 'Document · Updated just now'

const ARTIFACT_CONTENT = `## Overview

Our API gateway authenticates every request with a short-lived JWT access token. Until now, an expired token meant an immediate \`401\` — even when the user still held a valid refresh token. This document describes the silent-refresh flow we just shipped and how we're rolling it out.

## The Problem

Token validation ran **before** any refresh logic, so the middleware rejected expired tokens outright:

1. A request arrives with an expired access token
2. \`validateToken()\` throws \`TokenExpiredError\`
3. The catch block returns \`401\` — \`refreshToken()\` is never reached

The result was users getting logged out whenever an access token lapsed mid-session.

## The Fix

The middleware now catches \`TokenExpiredError\` specifically and attempts a silent refresh before rejecting. On success it reissues an access token and continues the request; on failure it falls back to \`401\`.

- **Transparent** — valid sessions never see an interruption
- **Safe** — a missing or invalid refresh token still returns \`401\`
- **Cheap** — refresh only runs on the expiry path, not on every request

## Testing

The refresh path is covered end to end:

| Scenario | Expected |
|----------|----------|
| Valid token passes through | 200 |
| Expired token, valid refresh | 200 + new access token |
| Expired token, invalid refresh | 401 |
| Malformed token | 401 |

## Rollout & Monitoring

1. Ship behind the \`silent_refresh\` flag at 5% of traffic
2. Watch the \`auth.refresh.success\` and \`auth.refresh.failure\` counters
3. Alert if the failure rate exceeds **2%** over any 5-minute window
4. Ramp to 100% once metrics hold steady for 24 hours`

const FOUND_ISSUE = `Found the issue. In \`middleware.ts\`, the token validation runs **before** the refresh check. When a token expires, the middleware rejects the request immediately instead of attempting a refresh.

Here's the problematic sequence:

1. Request arrives with an expired access token
2. \`validateToken()\` throws \`TokenExpiredError\`
3. The catch block returns \`401\` — never reaching \`refreshToken()\`

The fix is to catch \`TokenExpiredError\` specifically and attempt a refresh before rejecting:`

const MIDDLEWARE_CODE = `async function authMiddleware(req: Request) {
  try {
    const decoded = validateToken(req.headers.authorization);
    req.user = decoded;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      // Attempt silent refresh before rejecting
      const refreshed = await refreshToken(req.cookies.refreshToken);
      if (refreshed) {
        req.user = refreshed.user;
        req.newAccessToken = refreshed.accessToken;
        return next(req);
      }
    }
    return new Response('Unauthorized', { status: 401 });
  }
  return next(req);
}`

const TEST_RESULTS = `Added a test for the refresh flow. All **4 tests** pass:

| Test | Status |
|------|--------|
| Valid token passes through | Pass |
| Expired token triggers refresh | Pass |
| Expired token with invalid refresh returns 401 | Pass |
| Malformed token returns 401 immediately | Pass |`

const TEST_CODE = `describe('authMiddleware', () => {
  it('refreshes an expired token silently', async () => {
    const expiredToken = createExpiredJWT(mockUser);
    const validRefresh = createRefreshToken(mockUser);

    const req = mockRequest({
      authorization: \`Bearer \${expiredToken}\`,
      cookies: { refreshToken: validRefresh },
    });

    const res = await authMiddleware(req);

    expect(res.status).toBe(200);
    expect(req.user.id).toBe(mockUser.id);
    expect(req.newAccessToken).toBeDefined();
  });
});`

const DESIGN_INTRO = `I've drafted a design doc covering the problem, the fix, and the test matrix — pulling straight from the changes we just made.

Open the document below to review it. Want me to expand any section?`

const ROLLOUT_REPLY = `On it — adding a **Rollout & Monitoring** section with a staged flag ramp and the alert thresholds. Updating the document now.`

const SOURCES = {
  jwt: { title: 'RFC 7519', url: 'https://datatracker.ietf.org/doc/html/rfc7519' },
}

const MENTION_ITEMS = [
  { id: 'agent', label: 'Agent', description: 'Assistant' },
  { id: 'cindy', label: 'Cindy Zhang', description: 'Design Systems' },
  { id: 'alex', label: 'Alex Johnson', description: 'Frontend' },
  { id: 'sam', label: 'Sam Rivera', description: 'Backend' },
]

const MESSAGE_TOKENS: ChatComposerToken[] = [
  { value: '@agent', label: '@Agent', variant: 'blue' },
  ...MENTION_ITEMS.filter(item => item.id !== 'agent').map(item => ({
    value: `@${item.id}`,
    label: item.label,
    variant: 'blue' as const,
  })),
]

const composerTriggers: ChatComposerTrigger[] = [
  {
    character: '@',
    menuLabel: 'People',
    searchSource: createStaticSource(MENTION_ITEMS),
    onSelect: item => ({
      value: `@${item.id}`,
      label: item.id === 'agent' ? '@Agent' : item.label,
      variant: 'blue' as const,
    }),
  },
]

const REASONING = 'The refresh check never runs because validateToken throws first. A silent refresh belongs in that catch, and the token shape is the one in RFC 7519.'
const LIVE_ANSWER = 'The expiry path now refreshes before it rejects. The sequence and the alert thresholds are in the draft, with the token format from [jwt].\n\nOpen the document when you want the rollout section beside the thread.'

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

type LiveTurn = LiveUser | LiveAssistant

const composerMode = ref<'ask' | 'edit'>('ask')
const attachments = ref<string[]>([])
const isArtifactDialogOpen = ref(false)
const isArtifactOpen = ref(true)
const isStreaming = ref(false)
const liveTurns = ref<LiveTurn[]>([])
const activeAssistantId = ref<number | null>(null)
const reasoningSource = ref('')
const reasoningLive = ref(false)
const answerSource = ref('')
const answerLive = ref(false)
const reasoningText = useStreamingText(reasoningSource, reasoningLive)
const answerText = useStreamingText(answerSource, answerLive)
const rootRef = useTemplateRef<HTMLElement>('root')
const composerInputRef = useTemplateRef<ChatComposerInputHandle>('composerInput')
const fileInputRef = useTemplateRef<HTMLInputElement>('fileInput')

const artifactResize = useResizable({
  defaultSize: 640,
  minSize: 480,
  maxSize: 960,
  autoSaveId: 'ai-chat-artifact-panel',
})

const placeholder = computed(() => composerMode.value === 'ask' ? 'Ask anything...' : 'Describe your edit...')

let nextId = 1
let timers: number[] = []

function rootWidth(): number {
  const node = rootRef.value as ({ $el?: unknown } & HTMLElement) | null
  const element = node instanceof HTMLElement ? node : node?.$el
  return element instanceof HTMLElement ? element.offsetWidth : Number.POSITIVE_INFINITY
}

function openArtifact() {
  if (rootWidth() <= MOBILE_MAX_WIDTH)
    isArtifactDialogOpen.value = true
  else
    isArtifactOpen.value = true
}

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
  const input = composerInputRef.value
  if (!input)
    return
  input.focus()
  input.insertText('@')
}

function copyArtifact() {
  const text = `${ARTIFACT_TITLE}\n\n${ARTIFACT_CONTENT}`
  void navigator.clipboard?.writeText(text)
}

function clearTimers() {
  for (const id of timers)
    window.clearTimeout(id)
  timers = []
}

function displayedReasoning(turn: LiveAssistant): string {
  if (turn.id === activeAssistantId.value && reasoningLive.value)
    return reasoningText.value
  return turn.reasoning
}

function displayedAnswer(turn: LiveAssistant): string {
  if (turn.id === activeAssistantId.value && answerLive.value)
    return answerText.value
  return turn.answer
}

function stop() {
  clearTimers()
  const turn = liveTurns.value.find(item => item.kind === 'assistant' && item.id === activeAssistantId.value)
  if (turn && turn.kind === 'assistant') {
    if (reasoningLive.value)
      reasoningSource.value = reasoningText.value
    if (answerLive.value)
      answerSource.value = answerText.value
    reasoningLive.value = false
    answerLive.value = false
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
    turn.tools = [{ name: 'read', target: 'middleware.ts', status: 'running', node: 'cli:remote-server' }]
  }, 700))

  timers.push(window.setTimeout(() => {
    if (!isStreaming.value)
      return
    turn.tools = [{ name: 'read', target: 'middleware.ts', status: 'complete', duration: '38ms', node: 'cli:remote-server' }]
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

const mobileActions = [
  {
    type: 'section' as const,
    title: 'Version',
    items: [
      { label: 'v2 (current)' },
      { label: 'v1' },
    ],
  },
  { type: 'divider' as const },
  { label: 'Copy', icon: 'copy', onClick: copyArtifact },
  { label: 'Share', icon: 'i-heroicons-share' },
]
</script>

<template>
  <VStack ref="root" class="ai-chat-root">
    <input
      ref="fileInput"
      class="file-input"
      type="file"
      multiple
      tabindex="-1"
      aria-hidden="true"
      @change="onPickFiles"
    >
    <Layout height="fill">
      <LayoutContent :padding="0">
        <HStack height="100%">
          <VStack class="chat-column">
            <ChatLayout density="spacious" class="chat-layout">
              <ChatMessageList :is-streaming="isStreaming">
                <ChatSystemMessage variant="divider">
                  Today
                </ChatSystemMessage>

                <ChatMessage sender="user">
                  <HStack :gap="1" wrap="wrap">
                    <Token label="auth-service.ts" />
                    <Token label="middleware.ts" />
                  </HStack>
                  <ChatMessageBubble>
                    <ChatTokenizedText text="@agent Can you review these auth files? The JWT refresh logic seems broken — tokens expire but the middleware doesn't catch it." :tokens="MESSAGE_TOKENS" />
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
                  <ChatMessageBubble variant="ghost">
                    Looking into the auth files now. Let me read through the code and trace the token refresh flow.
                  </ChatMessageBubble>
                  <ChatToolCalls
                    :default-is-expanded="true"
                    :calls="[
                      { name: 'read', target: 'auth-service.ts', status: 'complete', duration: '45ms' },
                      { name: 'read', target: 'middleware.ts', status: 'complete', duration: '38ms' },
                      { name: 'bash', target: 'grep -rn &quot;refreshToken&quot; src/', status: 'complete', duration: '120ms', node: 'cli:remote-server' },
                    ]"
                  />
                  <ChatMessageBubble variant="ghost">
                    <Markdown density="compact" :content="FOUND_ISSUE" />
                  </ChatMessageBubble>
                  <ChatMessageBubble variant="ghost">
                    <CodeBlock title="middleware.ts" language="typescript" :code="MIDDLEWARE_CODE" />
                  </ChatMessageBubble>
                  <ChatToolCalls
                    :calls="[
                      { name: 'edit', target: 'middleware.ts', status: 'complete', duration: '85ms', additions: 8, deletions: 2 },
                    ]"
                  />
                  <ChatMessageMetadata footer="Agent">
                    <template #timestamp>
                      <Timestamp value="2026-04-29T10:15:30" format="time" />
                    </template>
                  </ChatMessageMetadata>
                </ChatMessage>

                <ChatMessage sender="user">
                  <ChatMessageBubble group="first">
                    Nice catch, that makes sense
                  </ChatMessageBubble>
                  <ChatMessageBubble group="last">
                    Can you also add a test for the refresh path?
                    <template #metadata>
                      <ChatMessageMetadata status="delivered">
                        <template #timestamp>
                          <Timestamp value="2026-04-29T10:16:00" format="time" />
                        </template>
                      </ChatMessageMetadata>
                    </template>
                  </ChatMessageBubble>
                </ChatMessage>

                <ChatMessage sender="assistant">
                  <template #avatar>
                    <Avatar name="Agent" size="md" />
                  </template>
                  <ChatToolCalls
                    :default-is-expanded="true"
                    :calls="[
                      { name: 'read', target: 'middleware.test.ts', status: 'complete', duration: '32ms' },
                      { name: 'edit', target: 'middleware.test.ts', status: 'complete', duration: '110ms', additions: 24, deletions: 0 },
                      { name: 'bash', target: 'yarn test middleware', status: 'complete', duration: '3.2s', node: 'cli:remote-server' },
                    ]"
                  />
                  <ChatMessageBubble variant="ghost">
                    <Markdown density="compact" :content="TEST_RESULTS" />
                  </ChatMessageBubble>
                  <ChatMessageBubble variant="ghost">
                    <CodeBlock title="middleware.test.ts" language="typescript" :code="TEST_CODE" />
                  </ChatMessageBubble>
                  <ChatMessageMetadata>
                    <template #timestamp>
                      <Timestamp value="2026-04-29T10:16:45" format="time" />
                    </template>
                  </ChatMessageMetadata>
                </ChatMessage>

                <ChatSystemMessage>
                  Changes saved to workspace
                </ChatSystemMessage>

                <ChatMessage sender="user">
                  <ChatMessageBubble>
                    Looks solid. Before I open the PR, can you write up a short design doc explaining the token-refresh flow for the team?
                    <template #metadata>
                      <ChatMessageMetadata>
                        <template #timestamp>
                          <Timestamp value="2026-04-29T10:18:00" format="time" />
                        </template>
                      </ChatMessageMetadata>
                    </template>
                  </ChatMessageBubble>
                </ChatMessage>

                <ChatMessage sender="assistant">
                  <template #avatar>
                    <Avatar name="Agent" size="md" />
                  </template>
                  <ChatMessageBubble variant="ghost">
                    <Markdown density="compact" :content="DESIGN_INTRO" />
                  </ChatMessageBubble>
                  <ChatMessageBubble variant="ghost" width="100%">
                    <ClickableCard :label="`Open ${ARTIFACT_TITLE}`" variant="muted" :padding="3" :max-width="360" @click="openArtifact">
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
                    <template #metadata>
                      <ChatMessageMetadata>
                        <template #timestamp>
                          <Timestamp value="2026-04-29T10:18:40" format="time" />
                        </template>
                      </ChatMessageMetadata>
                    </template>
                  </ChatMessageBubble>
                </ChatMessage>

                <ChatMessage sender="user">
                  <ChatMessageBubble>
                    This is great. Can you add a section on rollout and monitoring at the end?
                    <template #metadata>
                      <ChatMessageMetadata status="delivered">
                        <template #timestamp>
                          <Timestamp value="2026-04-29T10:20:00" format="time" />
                        </template>
                      </ChatMessageMetadata>
                    </template>
                  </ChatMessageBubble>
                </ChatMessage>

                <ChatMessage sender="assistant">
                  <template #avatar>
                    <Avatar name="Agent" size="md" />
                  </template>
                  <ChatMessageBubble variant="ghost">
                    <Markdown density="compact" :content="ROLLOUT_REPLY" />
                  </ChatMessageBubble>
                  <ChatToolCalls
                    :calls="[
                      { name: 'edit', target: 'docs/token-refresh.md', status: 'running', node: 'cli:remote-server' },
                    ]"
                  />
                  <ChatMessageMetadata>
                    <template #timestamp>
                      <Timestamp value="2026-04-29T10:20:30" format="time" />
                    </template>
                  </ChatMessageMetadata>
                </ChatMessage>

                <template v-for="turn in liveTurns" :key="turn.id">
                  <ChatMessage v-if="turn.kind === 'user'" sender="user">
                    <HStack v-if="turn.files.length" :gap="1" wrap="wrap">
                      <Token v-for="name in turn.files" :key="name" :label="name" />
                    </HStack>
                    <ChatMessageBubble>
                      <ChatTokenizedText :text="turn.text" :tokens="MESSAGE_TOKENS" />
                      <template #metadata>
                        <ChatMessageMetadata status="delivered">
                          <template #timestamp>
                            <Timestamp :value="turn.at" format="time" />
                          </template>
                        </ChatMessageMetadata>
                      </template>
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
                      <Text v-else-if="turn.stopped" type="body" color="secondary">
                        Stopped before a reply was ready.
                      </Text>
                    </ChatMessageBubble>
                    <ChatMessageBubble v-if="turn.showArtifact" variant="ghost" width="100%">
                      <ClickableCard :label="`Open ${ARTIFACT_TITLE}`" variant="muted" :padding="3" :max-width="360" @click="openArtifact">
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
                    <ChatMessageMetadata>
                      <template #timestamp>
                        <Timestamp :value="turn.at" format="time" />
                      </template>
                    </ChatMessageMetadata>
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
                    <ChatComposerInput
                      ref="composerInput"
                      :triggers="composerTriggers"
                      @files="addFiles"
                    />
                  </template>
                  <template v-if="attachments.length" #drawer>
                    <ChatComposerDrawer :count="attachments.length" label="Attachments">
                      <Token
                        v-for="name in attachments"
                        :key="name"
                        :label="name"
                        @remove="removeAttachment(name)"
                      />
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
          </VStack>

          <template v-if="isArtifactOpen">
            <ResizeHandle
              direction="horizontal"
              :resizable="artifactResize.props"
              is-reversed
              pill-placement="start"
              has-divider
              label="Resize artifact panel"
              class="ai-chat-resize-handle"
            />
            <Card
              variant="transparent"
              height="100%"
              class="ai-chat-artifact-panel"
              :style="{ '--artifact-panel-width': `${artifactResize.size}px` }"
            >
              <Toolbar label="Artifact actions" :dividers="['bottom']">
                <template #start>
                  <HStack :gap="3" align="center">
                    <Icon name="heroicons:document-text" size="sm" color="secondary" />
                    <VStack :gap="0">
                      <Text type="label" weight="semibold">
                        {{ ARTIFACT_TITLE }}
                      </Text>
                      <Text type="supporting" color="secondary">
                        {{ ARTIFACT_SUBTITLE }}
                      </Text>
                    </VStack>
                  </HStack>
                </template>
                <template #end>
                  <DropdownMenu
                    :button="{ label: 'v2', variant: 'ghost', size: 'sm' }"
                    :items="[{ label: 'v2 (current)' }, { label: 'v1' }]"
                  />
                  <IconButton label="Copy" variant="ghost" size="sm" @click="copyArtifact">
                    <Icon name="heroicons:clipboard-document" />
                  </IconButton>
                  <IconButton label="Share" variant="ghost" size="sm">
                    <Icon name="heroicons:share" />
                  </IconButton>
                  <IconButton label="Close document" variant="ghost" size="sm" @click="isArtifactOpen = false">
                    <Icon name="heroicons:x-mark" />
                  </IconButton>
                </template>
              </Toolbar>
              <Section variant="transparent" class="artifact-scroll">
                <VStack :gap="2" class="article-body">
                  <Heading :level="1">
                    {{ ARTIFACT_TITLE }}
                  </Heading>
                  <Markdown :content="ARTIFACT_CONTENT" />
                </VStack>
              </Section>
            </Card>
          </template>
        </HStack>
      </LayoutContent>
    </Layout>

    <Dialog :is-open="isArtifactDialogOpen" purpose="info" variant="fullscreen" @open-change="isArtifactDialogOpen = $event">
      <Layout>
        <template #header>
          <DialogHeader
            :title="ARTIFACT_TITLE"
            :subtitle="ARTIFACT_SUBTITLE"
            has-divider
            has-close-button
            close-button-label="Close document"
            @open-change="isArtifactDialogOpen = $event"
          >
            <template #endContent>
              <MoreMenu label="Document actions" size="sm" :items="mobileActions" />
            </template>
          </DialogHeader>
        </template>
        <LayoutContent :padding="0">
          <Section variant="transparent" class="artifact-scroll">
            <VStack :gap="2" class="article-body">
              <Markdown :content="ARTIFACT_CONTENT" />
            </VStack>
          </Section>
        </LayoutContent>
      </Layout>
    </Dialog>
  </VStack>
</template>

<style scoped>
.ai-chat-root {
  position: relative;
  height: 100dvh;
  width: 100%;
  container-type: inline-size;
  container-name: artifact;
}
.chat-column { flex: 1; width: 100%; min-width: 0; height: 100%; }
.chat-layout { flex: 1; min-height: 0; }
.artifact-scroll { flex: 1; overflow-y: auto; }
.article-body { max-width: 720px; margin-inline: auto; }
.ai-chat-resize-handle { display: flex; }
.ai-chat-artifact-panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: var(--artifact-panel-width);
  flex-shrink: 0;
}
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
@container artifact (max-width: 767px) {
  .ai-chat-resize-handle { display: none; }
  .ai-chat-artifact-panel { display: none; width: 100%; flex-shrink: 1; }
}
</style>
