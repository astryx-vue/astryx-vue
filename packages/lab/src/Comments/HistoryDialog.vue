<script setup lang="ts">
import type { VNode } from 'vue'
import type { CommentVersion } from './types.js'
import type { AnyComment } from './utils.js'
import {
  Banner,
  Dialog,
  DialogHeader,
  EmptyState,
  HStack,
  Section,
  Text,
  Timestamp,
  useAnnounce,
  useTranslator,
  VStack,
} from '@astryx-vue/core'
import { watch } from 'vue'

defineOptions({ name: 'AstryxCommentHistoryDialog' })

const props = defineProps<{
  history: HistoryState | null
  renderVersionBody: (version: CommentVersion) => VNode
}>()

const emit = defineEmits<{ close: [] }>()

export interface HistoryState {
  comment: AnyComment
  versions: readonly CommentVersion[]
  isLoading: boolean
  error?: string
}

const { t } = useTranslator()
const announce = useAnnounce()

watch(
  () => [props.history?.isLoading, props.history?.comment.id] as const,
  ([isLoading]) => {
    if (isLoading === true)
      announce(t('@astryx.comments.historyLoading'), 'polite')
  },
)

function onOpenChange(open: boolean): void {
  if (!open)
    emit('close')
}
</script>

<template>
  <Dialog
    v-if="history != null"
    :is-open="true"
    purpose="info"
    @open-change="onOpenChange"
  >
    <DialogHeader
      :title="t('@astryx.comments.historyTitle')"
      :subtitle="t('@astryx.comments.historySubtitle', { name: history.comment.author.name })"
      has-divider
      @open-change="onOpenChange"
    />
    <div role="alert">
      <Banner
        v-if="!history.isLoading && history.error != null"
        status="error"
        :title="t('@astryx.comments.historyFailed')"
        :description="history.error"
        container="section"
      />
    </div>
    <Text v-if="history.isLoading" type="body" color="secondary">
      {{ t('@astryx.comments.historyLoading') }}
    </Text>
    <EmptyState
      v-else-if="history.error == null && history.versions.length === 0"
      :title="t('@astryx.comments.historyEmptyTitle')"
      :description="t('@astryx.comments.historyEmptyDescription')"
      is-compact
    />
    <VStack v-else-if="history.error == null" :gap="3">
      <Section
        v-for="version in history.versions"
        :key="version.id"
        :variant="version.isCurrent === true ? 'muted' : 'transparent'"
        :padding="2"
      >
        <VStack :gap="1.5">
          <HStack :gap="1" align="center" wrap="wrap">
            <Timestamp :value="version.editedAt" format="date_time" />
            <Text v-if="version.author != null" type="supporting" color="secondary">
              {{ t('@astryx.comments.versionAuthor', { name: version.author.name }) }}
            </Text>
            <Text v-if="version.isCurrent === true" type="supporting" weight="semibold">
              {{ t('@astryx.comments.currentVersion') }}
            </Text>
          </HStack>
          <component :is="() => renderVersionBody(version)" />
        </VStack>
      </Section>
    </VStack>
  </Dialog>
</template>
