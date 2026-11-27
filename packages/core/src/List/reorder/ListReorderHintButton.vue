<script setup lang="ts">
/**
 * 重排模式提示里的一个按钮。不进 Tab 顺序，按下时不抢焦点（焦点留在手柄上），
 * 粗指针下有放大的热区。
 */
import { useTemplateRef } from 'vue'
import { useTouchHitArea } from '../../composables/internal/useTouchHitArea.js'

defineProps<{ label?: string, isText?: boolean }>()
const emit = defineEmits<{ press: [] }>()

const button = useTemplateRef<HTMLButtonElement>('button')
useTouchHitArea(button, true)
</script>

<template>
  <button
    ref="button"
    type="button"
    tabindex="-1"
    class="astryx-list-reorder-hint__button astryx-touch-hit-area"
    :data-text="isText || undefined"
    :aria-label="label"
    @pointerdown.prevent
    @mousedown.prevent
    @click="emit('press')"
  >
    <slot />
  </button>
</template>
