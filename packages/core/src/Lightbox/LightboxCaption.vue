<script setup lang="ts">
import { computed, ref } from 'vue'
import { useComponentMessages } from '../locale/context.js'
import { lightboxMessages } from '../locale/messages/lightbox.js'
import { useTruncation } from '../Text/useTruncation.js'

defineOptions({ name: 'AstryxLightboxCaption' })

defineProps<{
  /** 当前这一项的图注；没有时只留出图注区域的空间。 */
  text?: string
  /** 图注段落的 id，灯箱用它作为整体的无障碍描述。 */
  id: string
}>()

const messages = useComponentMessages({ lightbox: lightboxMessages })

/**
 * 图注最多显示两行。超出时第二行末尾跟一个「更多」，点开后整段图注盖在照片底部，
 * 「收起」再合上。整段文字一直在 DOM 里，所以无障碍描述总是完整的图注。
 */
const MAX_LINES = 2
const truncation = useTruncation(ref(MAX_LINES))
const isExpanded = ref(false)

/** 展开时文字不再被截断，量出来是 false；这时仍要留着「收起」。 */
const hasToggle = computed(() => isExpanded.value || truncation.isTruncated.value)

function bindText(element: unknown): void {
  truncation.bind(element instanceof Element ? element : null)
}

function toggle(): void {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div
    class="astryx-lightbox__caption-band"
    :data-empty="text ? undefined : ''"
    :data-expanded="isExpanded || undefined"
  >
    <div v-if="text" class="astryx-lightbox__caption-panel" data-lightbox-caption>
      <p
        :id="id"
        :ref="bindText"
        class="astryx-lightbox__caption astryx-lightbox__caption--band"
      >
        {{ text }}
      </p>
      <button
        v-if="hasToggle"
        type="button"
        class="astryx-lightbox__caption-toggle"
        :aria-expanded="isExpanded"
        :aria-controls="id"
        @click="toggle"
      >
        {{ isExpanded ? messages.lightbox.captionLess : messages.lightbox.captionMore }}
      </button>
    </div>
  </div>
</template>
