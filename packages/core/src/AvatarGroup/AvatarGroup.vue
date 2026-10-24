<script setup lang="ts">
/* eslint-disable vue-a11y/no-static-element-interactions -- 焦点在内部头像上，这一层只接冒泡上来的方向键。 */
import type { StyleValue } from 'vue'
import type { AvatarGroupProps } from './types.js'
import { computed, onMounted, onUpdated, provide, ref, useId } from 'vue'

import { resolveSize } from '../Avatar/utils.js'
import { useListFocus } from '../composables/useListFocus.js'
import { useAstryxMessages } from '../locale/index.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { AvatarGroupContext } from './context.js'
import '../../styles/avatar-group.css'

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  size: 'md',
  shape: 'circle',
  label: 'Avatar group',
})

const OVERLAP_RATIO = 0.25

const numericSize = computed(() => resolveSize(props.size))
const overlap = computed(() => Math.round(numericSize.value * OVERLAP_RATIO))
const messages = useAstryxMessages()
const hintId = `astryx-avatar-group-hint-${useId()}`
const hasInteractive = ref(false)

provide(AvatarGroupContext, {
  size: computed(() => props.size),
  shape: computed(() => props.shape),
  overlap,
})

const { listRef, handleKeyDown, handleFocus } = useListFocus({
  itemSelector: '[data-avatar-item]',
  orientation: 'horizontal',
  hasRovingTabIndex: true,
})

const rootStyle = computed<StyleValue>(() => ({
  '--astryx-avatar-group-overlap': `${-overlap.value}px`,
}))

function syncInteractive(): void {
  hasInteractive.value = listRef.value?.querySelector('[data-avatar-item]') != null
}

onMounted(syncInteractive)
onUpdated(syncInteractive)
</script>

<template>
  <div
    ref="listRef"
    class="astryx-avatar-group"
    role="group"
    :aria-label="label"
    :aria-describedby="hasInteractive ? hintId : undefined"
    :data-size="size"
    :data-shape="shape"
    :style="rootStyle"
    @focusin="handleFocus"
    @keydown="hasInteractive ? handleKeyDown($event) : undefined"
  >
    <slot />
    <VisuallyHidden v-if="hasInteractive" :id="hintId">
      {{ messages.avatarGroup.keyboardHint }}
    </VisuallyHidden>
  </div>
</template>
