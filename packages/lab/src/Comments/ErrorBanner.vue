<script setup lang="ts">
import type { ErrorBannerContent } from './types.js'
import { Banner, Button, useAnnounce } from '@astryx-vue/core'
import { onBeforeUnmount, watch } from 'vue'
import { toElement } from './utils.js'

defineOptions({ name: 'AstryxCommentErrorBanner' })

const props = defineProps<{
  content: ErrorBannerContent
  onBeforeAction?: () => void
  actionRef?: (el: HTMLElement | null) => void
}>()

function setActionRef(el: unknown): void {
  props.actionRef?.(toElement(el))
}

onBeforeUnmount(() => {
  props.actionRef?.(null)
})

const announce = useAnnounce()

watch(
  () => [props.content.title, props.content.description, props.content.isRetrying, props.content.isAnnounced] as const,
  ([title, description, isRetrying, isAnnounced]) => {
    if (isRetrying === true || isAnnounced === true)
      return
    announce(description != null && description !== '' ? `${title} ${description}` : title, 'assertive')
  },
  { immediate: true },
)

function onActionClick(): void {
  props.onBeforeAction?.()
  props.content.onAction?.()
}
</script>

<template>
  <Banner
    status="error"
    container="card"
    :title="content.title"
    :description="content.description"
    class="astryx-comment-error-banner"
  >
    <template v-if="content.actionLabel != null && content.onAction != null" #end>
      <Button
        :ref="setActionRef"
        :label="content.actionLabel"
        variant="ghost"
        size="sm"
        :is-disabled="content.isActionDisabled"
        @click="onActionClick"
      />
    </template>
  </Banner>
</template>
