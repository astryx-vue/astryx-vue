<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { ChatComposerToken } from '@astryx-vue/core'
import {
  Avatar,
  Card,
  ChatComposer,
  ChatComposerInput,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatMessageMetadata,
  ChatSystemMessage,
  ChatTokenizedText,
  ChatToolCalls,
  ClickableCard,
  CodeBlock,
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
  useToast,
  VisuallyHidden,
  VStack,
} from '@astryx-vue/core'
import { ref, useTemplateRef } from 'vue'

// 窄于此宽度时分栏收成单列。CSS 容器查询和 openArtifact 里的判断共用这一个值。
const MOBILE_MAX_WIDTH = 767

const MENTION_TOKENS: ChatComposerToken[] = [
  { value: '@agent', label: '@Agent', variant: 'blue' },
]

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
| Valid token passes through | \`200\` |
| Expired token, valid refresh | \`200\` + new access token |
| Expired token, invalid refresh | \`401\` |
| Malformed token | \`401\` |

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
| Valid token passes through | ✅ |
| Expired token triggers refresh | ✅ |
| Expired token with invalid refresh returns 401 | ✅ |
| Malformed token returns 401 immediately | ✅ |`

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

const DESIGN_INTRO = `I've drafted a design doc covering the problem, the fix, and the test matrix — pulling straight from the changes we just made.\n\nOpen the document below to review it. Want me to expand any section?`

const ROLLOUT_REPLY = `On it — adding a **Rollout & Monitoring** section with a staged flag ramp and the alert thresholds. Updating the document now.`

const composerMode = ref<'ask' | 'edit'>('ask')
// 手机上文档用全屏对话框，桌面用侧边栏。
const isArtifactDialogOpen = ref(false)
const isArtifactOpen = ref(true)
const rootRef = useTemplateRef<ComponentPublicInstance>('root')
const artifactResize = useResizable({
  defaultSize: 640,
  minSize: 480,
  maxSize: 960,
  autoSaveId: 'ai-chat-artifact-panel',
})
const showToast = useToast()

// 演示用：真实项目里换成执行对应操作的调用。
function demo(body: string, uniqueID: string) {
  showToast({ body, uniqueID })
}

function copyDocument() {
  void navigator.clipboard?.writeText(ARTIFACT_CONTENT).then(
    () => showToast({ body: 'Copied', uniqueID: 'copy' }),
    () => showToast({ body: 'Could not copy the document', uniqueID: 'copy' }),
  )
}

function rootWidth(): number {
  // ref 落在 VStack 组件上，量宽度要拿组件根元素。
  const element = rootRef.value?.$el
  return element instanceof HTMLElement ? element.offsetWidth : Number.POSITIVE_INFINITY
}

// 用测量根元素宽度对齐容器查询的断点，不看视口。
function openArtifact() {
  if (rootWidth() <= MOBILE_MAX_WIDTH)
    isArtifactDialogOpen.value = true
  else
    isArtifactOpen.value = true
}

const versionItems = [
  { label: 'v2 (current)', onClick: () => demo('Demo: version 2 is already shown', 'v2') },
  { label: 'v1', onClick: () => demo('Demo: version 1 would open here', 'v1') },
]

const mobileActions = [
  {
    type: 'section' as const,
    title: 'Version',
    items: versionItems,
  },
  { type: 'divider' as const },
  { label: 'Copy', icon: 'copy', onClick: copyDocument },
  { label: 'Share', icon: 'i-heroicons-share', onClick: () => demo('Demo: sharing would start here', 'share') },
]
</script>

<template>
  <VStack ref="root" class="ai-chat-root">
    <Layout height="fill">
      <LayoutContent role="main" :padding="0">
        <VisuallyHidden as="h1">Chat</VisuallyHidden>
        <HStack height="100%">
          <VStack class="chat-column" :class="{ 'ai-chat-column-beside-handle': isArtifactOpen }">
            <ChatLayout density="spacious" class="chat-layout">
              <ChatMessageList>
                <ChatSystemMessage variant="divider">
                  Today
                </ChatSystemMessage>

                <ChatMessage sender="user">
                  <HStack :gap="1" wrap="wrap">
                    <Token label="auth-service.ts" />
                    <Token label="middleware.ts" />
                  </HStack>
                  <ChatMessageBubble>
                    <ChatTokenizedText :tokens="MENTION_TOKENS">
                      @agent Can you review these auth files? The JWT refresh logic seems broken — tokens expire but the middleware doesn't catch it.
                    </ChatTokenizedText>
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

              </ChatMessageList>
              <template #composer>
                <ChatComposer
                  :placeholder="composerMode === 'ask' ? 'Ask anything...' : 'Describe your edit...'"
                  @submit="demo('Demo: your message would send here', 'send')"
                >
                  <template #input>
                    <ChatComposerInput />
                  </template>
                  <template #headerActions>
                    <IconButton label="Mention" variant="ghost" size="sm" @click="demo('Demo: a list of people to mention would open here', 'mention')">
                      <Icon name="heroicons:at-symbol" />
                    </IconButton>
                    <IconButton label="Attach" variant="ghost" size="sm" @click="demo('Demo: a file picker would open here', 'attach')">
                      <Icon name="heroicons:paper-clip" />
                    </IconButton>
                  </template>
                  <template #footerActions>
                    <DropdownMenu
                      :button="{ label: composerMode === 'ask' ? 'Ask' : 'Edit', variant: 'ghost', size: 'sm' }"
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
                    :items="versionItems"
                  />
                  <IconButton label="Copy" variant="ghost" size="sm" @click="copyDocument">
                    <Icon name="heroicons:clipboard-document" />
                  </IconButton>
                  <IconButton label="Share" variant="ghost" size="sm" @click="demo('Demo: sharing would start here', 'share')">
                    <Icon name="heroicons:share" />
                  </IconButton>
                  <IconButton label="Close document" variant="ghost" size="sm" @click="isArtifactOpen = false">
                    <Icon name="heroicons:x-mark" />
                  </IconButton>
                </template>
              </Toolbar>
              <Section variant="transparent" class="artifact-scroll">
                <VStack :gap="2" class="article-body">
                  <Heading :level="1" :accessibility-level="2">
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
              <Heading :level="1" :accessibility-level="2">
                {{ ARTIFACT_TITLE }}
              </Heading>
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
.ai-chat-column-beside-handle { padding-inline-end: var(--astryx-spacing-2); }
.ai-chat-artifact-panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: var(--artifact-panel-width);
  flex-shrink: 0;
}
@container artifact (max-width: 767px) {
  .ai-chat-resize-handle { display: none; }
  .ai-chat-column-beside-handle { padding-inline-end: 0; }
  .ai-chat-artifact-panel { display: none; width: 100%; flex-shrink: 1; }
}
</style>
