<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Kbd from '../Kbd/Kbd.vue'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/keyboard-hint.css'

const props = defineProps<{
  visible: boolean
  anchor: HTMLElement | null
  orientation: 'horizontal' | 'vertical' | 'both'
}>()

const messages = useAstryxMessages()
const hint = ref<HTMLElement | null>(null)
const position = ref({ top: 0, left: 0 })

const keys = computed(() => {
  if (props.orientation === 'vertical')
    return ['up', 'down']
  if (props.orientation === 'both')
    return ['left', 'right', 'up', 'down']
  return ['left', 'right']
})

const style = computed<CSSProperties>(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
}))

function place(): void {
  const anchor = props.anchor
  const element = hint.value
  if (!anchor || !element)
    return
  const rect = anchor.getBoundingClientRect()
  const hintRect = element.getBoundingClientRect()
  const top = Math.max(8, rect.top - hintRect.height - 8)
  const left = Math.min(
    window.innerWidth - hintRect.width - 8,
    Math.max(8, rect.left + rect.width / 2 - hintRect.width / 2),
  )
  position.value = { top, left }
}

watch(() => [props.visible, props.anchor] as const, () => {
  if (!props.visible)
    return
  requestAnimationFrame(() => place())
})

function onScroll(): void {
  if (props.visible)
    place()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div
    v-show="visible"
    ref="hint"
    class="astryx-keyboard-hint"
    aria-hidden="true"
    :style="style"
  >
    <span class="astryx-keyboard-hint__keys">
      <Kbd v-for="key in keys" :key="key" :keys="key" />
    </span>
    <span class="astryx-keyboard-hint__label">{{ messages.keyboardHint.navigate }}</span>
  </div>
</template>
