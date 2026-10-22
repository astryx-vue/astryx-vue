<script setup lang="ts">
import type { StyleValue } from 'vue'
import { computed, shallowRef, useAttrs } from 'vue'
import { useScrollableArea } from '../composables/useScrollableArea.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'

defineOptions({ inheritAttrs: false })

defineProps<{ label: string }>()

const emit = defineEmits<{ viewport: [element: HTMLElement | null] }>()

const attrs = useAttrs()
const scroll = useScrollableArea({
  axis: 'inline',
  overscroll: 'contain',
  keyboardAccess: { owner: 'content' },
})

const viewportEl = shallowRef<HTMLElement | null>(null)

function bindViewport(element: unknown): void {
  scroll.viewport(element)
  const node = element instanceof HTMLElement ? element : null
  viewportEl.value = node
  emit('viewport', node)
}

useScrollbars(viewportEl)

const tabindex = computed(() => (scroll.state.value.inline.isScrollable ? 0 : undefined))
const rootClass = computed(() => ['astryx-table-scroll', attrs.class])
const rootStyle = computed<StyleValue>(() => [attrs.style as StyleValue, scroll.viewportStyle.value])
</script>

<template>
  <div
    :ref="bindViewport"
    :class="rootClass"
    role="group"
    :aria-label="label"
    :tabindex="tabindex"
    v-bind="scroll.viewportAttrs.value"
    :style="rootStyle"
  >
    <div :ref="scroll.content" data-scroll-content>
      <slot />
    </div>
  </div>
</template>
