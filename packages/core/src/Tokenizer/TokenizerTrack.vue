<script setup lang="ts">
import { computed } from 'vue'
import { useScrollableArea } from '../composables/useScrollableArea.js'

defineOptions({ name: 'AstryxTokenizerTrack' })

defineProps<{
  /** InputGroup 里的 Tokenizer：标签和输入留在一行里横向滚动；否则原样透传内容。 */
  isScrollable: boolean
}>()

// 滚动条被淡出取代：藏着标签的那一侧淡出，键盘经标签的删除按钮或输入框走到它们。
const scrollArea = useScrollableArea({ axis: 'inline', keyboardAccess: { owner: 'content' } })
function bindContent(element: unknown): void {
  scrollArea.content.value = element instanceof HTMLElement ? element : null
}
const fadeAttrs = computed(() => {
  const { inline } = scrollArea.state.value
  return {
    'data-scrollable-inline': inline.isScrollable ? 'true' : undefined,
    'data-scroll-inline-start': inline.atStart ? 'true' : undefined,
    'data-scroll-inline-end': inline.atEnd ? 'true' : undefined,
  }
})
</script>

<template>
  <span
    v-if="isScrollable"
    :ref="scrollArea.viewport"
    class="astryx-tokenizer-track"
    v-bind="{ ...scrollArea.viewportAttrs.value, ...fadeAttrs }"
    :style="scrollArea.viewportStyle.value"
  >
    <span :ref="bindContent" class="astryx-tokenizer-track-content">
      <slot />
    </span>
  </span>
  <slot v-else />
</template>
