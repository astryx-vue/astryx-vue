<script setup lang="ts">
import type { OverlayProps, OverlaySlots } from './types.js'
import { computed, nextTick, onMounted } from 'vue'
import OverlayScrim from './OverlayScrim.vue'
import { useOverlay } from './useOverlay.js'
import '../../styles/overlay.css'

defineOptions({ name: 'AstryxOverlay' })

const props = withDefaults(defineProps<Omit<OverlayProps, 'isOpen'>>(), {
  showOn: 'always',
  scrim: 'dark',
  position: 'fill',
  align: 'end',
})

defineSlots<OverlaySlots>()

const isOpen = defineModel<boolean | undefined>('isOpen', { default: undefined })

const { containerRef, containerProps, scrimProps } = useOverlay({
  showOn: computed(() => props.showOn),
  isOpen,
  scrim: computed(() => props.scrim),
  position: computed(() => props.position),
  align: computed(() => props.align),
})

const element = computed(() => containerRef.value)

defineExpose({ element })

/**
 * 基础内容的圆角由它自己决定，外层容器照着它裁剪，遮罩才不会盖住圆角。
 */
function syncRadius(): void {
  const root = containerRef.value
  const firstChild = root?.firstElementChild as HTMLElement | null | undefined
  if (!root || !firstChild)
    return
  const radius = getComputedStyle(firstChild).borderRadius
  if (radius && radius !== '0px')
    root.style.borderRadius = radius
}

onMounted(() => {
  nextTick(syncRadius)
})
</script>

<template>
  <div
    ref="containerRef"
    v-bind="containerProps"
    class="astryx-overlay"
  >
    <slot />
    <OverlayScrim v-if="$slots.content" v-bind="scrimProps">
      <template #default>
        <slot name="content" />
      </template>
    </OverlayScrim>
  </div>
</template>
