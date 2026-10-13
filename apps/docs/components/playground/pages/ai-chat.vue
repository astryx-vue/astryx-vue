<script setup lang="ts">
import {
  Avatar,
  Button,
  Card,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatMessageMetadata,
  ChatSystemMessage,
  ChatToolCalls,
  ClickableCard,
  CodeBlock,
  Dialog,
  DialogHeader,
  DropdownMenu,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  Markdown,
  MoreMenu,
  ResizeHandle,
  Section,
  StackItem,
  Text,
  TextArea,
  Token,
  Toolbar,
  useResizable,
  VStack,
} from '@astryx-vue/core'
import { ref, useTemplateRef } from 'vue'

/* Gaps: ChatComposer, ChatComposerInput, ChatTokenizedText */

const MOBILE_MAX_WIDTH = 767
const ARTIFACT_TITLE = 'JWT Token Refresh: Design & Rollout'
const ARTIFACT_SUBTITLE = 'Document · Updated just now'
const ARTIFACT_CONTENT = `## Overview\n\nOur API gateway authenticates every request with a short-lived JWT access token.\n\n## The Fix\n\nThe middleware now catches TokenExpiredError specifically and attempts a silent refresh before rejecting.`

const composerMode = ref('ask')
const isArtifactDialogOpen = ref(false)
const isArtifactOpen = ref(true)
const composerDraft = ref('')
const rootRef = useTemplateRef<HTMLElement>('root')

const artifactResize = useResizable({
  defaultSize: 640,
  minSize: 480,
  maxSize: 960,
  autoSaveId: 'ai-chat-artifact-panel',
})

function openArtifact() {
  const width = rootRef.value?.offsetWidth ?? Infinity
  if (width <= MOBILE_MAX_WIDTH)
    isArtifactDialogOpen.value = true
  else
    isArtifactOpen.value = true
}
</script>

<template>
  <VStack ref="root" class="ai-chat-root">
    <Layout height="fill">
      <LayoutContent :padding="0">
        <HStack height="100%">
          <VStack class="chat-column">
            <ChatLayout density="spacious" class="chat-layout">
              <ChatMessageList>
                <ChatSystemMessage variant="divider">Today</ChatSystemMessage>
                <ChatMessage sender="user">
                  <HStack :gap="1" wrap="wrap">
                    <Token label="auth-service.ts" />
                    <Token label="middleware.ts" />
                  </HStack>
                  <ChatMessageBubble>
                    @agent Can you review these auth files? The JWT refresh logic seems broken.
                    <template #metadata>
                      <ChatMessageMetadata timestamp="10:15 AM" />
                    </template>
                  </ChatMessageBubble>
                </ChatMessage>
                <ChatMessage sender="assistant">
                  <template #avatar>
                    <Avatar name="Agent" size="md" />
                  </template>
                  <ChatMessageBubble variant="ghost">
                    Looking into the auth files now. Let me trace the token refresh flow.
                  </ChatMessageBubble>
                  <ChatToolCalls
                    :default-is-expanded="true"
                    :calls="[
                      { name: 'read', target: 'auth-service.ts', status: 'complete', duration: '45ms' },
                      { name: 'read', target: 'middleware.ts', status: 'complete', duration: '38ms' },
                    ]"
                  />
                  <ChatMessageBubble variant="ghost">
                    <Markdown density="compact">Found the issue — validation runs **before** refresh logic.</Markdown>
                  </ChatMessageBubble>
                  <ChatMessageBubble variant="ghost">
                    <CodeBlock title="middleware.ts" language="typescript" :code="`async function authMiddleware(req) {\n  // refresh on TokenExpiredError\n}`" />
                  </ChatMessageBubble>
                </ChatMessage>
                <ChatMessage sender="assistant">
                  <template #avatar>
                    <Avatar name="Agent" size="md" />
                  </template>
                  <ChatMessageBubble variant="ghost" width="100%">
                    <ClickableCard :label="ARTIFACT_TITLE" variant="muted" :padding="3" :max-width="360" @click="openArtifact">
                      <HStack :gap="3" :v-align="'center'" width="100%">
                        <Icon icon="i-heroicons-document-text" size="md" color="secondary" />
                        <StackItem size="fill">
                          <VStack :gap="0">
                            <Text type="label" weight="semibold">{{ ARTIFACT_TITLE }}</Text>
                            <Text type="supporting" color="secondary">Document</Text>
                          </VStack>
                        </StackItem>
                        <Icon icon="i-heroicons-chevron-right" size="sm" color="secondary" />
                      </HStack>
                    </ClickableCard>
                  </ChatMessageBubble>
                </ChatMessage>
              </ChatMessageList>
              <template #composer>
                <VStack :gap="2" class="composer">
                  <HStack :h-align="'between'">
                    <DropdownMenu
                      :button="{ label: composerMode === 'ask' ? 'Ask' : 'Edit', variant: 'ghost', size: 'sm' }"
                      :items="[
                        { label: 'Ask', onClick: () => { composerMode = 'ask' } },
                        { label: 'Edit', onClick: () => { composerMode = 'edit' } },
                      ]"
                    />
                  </HStack>
                  <TextArea
                    v-model="composerDraft"
                    label="Message"
                    is-label-hidden
                    :placeholder="composerMode === 'ask' ? 'Ask anything...' : 'Describe your edit...'"
                  />
                </VStack>
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
                  <HStack :gap="3" :v-align="'center'">
                    <Icon icon="i-heroicons-document-text" size="sm" color="secondary" />
                    <VStack :gap="0">
                      <Text type="label" weight="semibold">{{ ARTIFACT_TITLE }}</Text>
                      <Text type="supporting" color="secondary">{{ ARTIFACT_SUBTITLE }}</Text>
                    </VStack>
                  </HStack>
                </template>
                <template #end>
                  <MoreMenu label="Document actions" size="sm" :items="[{ label: 'Copy' }, { label: 'Share' }]" />
                  <Button label="Close document" variant="ghost" size="sm" is-icon-only @click="isArtifactOpen = false">
                    <template #icon><Icon icon="i-heroicons-x-mark" size="sm" /></template>
                  </Button>
                </template>
              </Toolbar>
              <Section variant="transparent" class="artifact-scroll">
                <VStack :gap="2" class="article-body">
                  <Heading :level="1">{{ ARTIFACT_TITLE }}</Heading>
                  <Markdown>{{ ARTIFACT_CONTENT }}</Markdown>
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
          <DialogHeader :title="ARTIFACT_TITLE" :subtitle="ARTIFACT_SUBTITLE" has-divider @open-change="isArtifactDialogOpen = $event">
            <template #end>
              <MoreMenu label="Document actions" size="sm" :items="[{ label: 'Copy' }, { label: 'Share' }]" />
            </template>
          </DialogHeader>
        </template>
        <LayoutContent :padding="0">
          <Section variant="transparent" class="artifact-scroll">
            <Markdown>{{ ARTIFACT_CONTENT }}</Markdown>
          </Section>
        </LayoutContent>
      </Layout>
    </Dialog>
  </VStack>
</template>

<style scoped>
.ai-chat-root {
  height: 100dvh;
  width: 100%;
  container-type: inline-size;
  container-name: artifact;
}
.chat-column { flex: 1; width: 100%; min-width: 0; height: 100%; }
.chat-layout { flex: 1; min-height: 0; }
.composer { padding: var(--spacing-4); }
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
@container artifact (max-width: 767px) {
  .ai-chat-resize-handle { display: none; }
  .ai-chat-artifact-panel { display: none; width: 100%; flex-shrink: 1; }
}
</style>
