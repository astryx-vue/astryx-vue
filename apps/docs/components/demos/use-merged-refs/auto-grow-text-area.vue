<script setup lang="ts">
import type { MergedRef } from '@astryx-vue/core'
import type { PropType } from 'vue'
import { useMergedRefs } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { VStack } from '@astryx-vue/core/Stack'
import { defineComponent, h, onMounted, ref, watch } from 'vue'

// 转发调用方给的 ref，同时自己留一份 ref 量 scrollHeight；useMergedRefs 把两份接到同一个 textarea 上。
const AutoGrowTextArea = defineComponent({
  props: {
    modelValue: { type: String, required: true },
    textareaRef: { type: Function as PropType<MergedRef<HTMLTextAreaElement>>, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const keptRef = ref<HTMLTextAreaElement | null>(null)
    const mergedRef = useMergedRefs<HTMLTextAreaElement>([props.textareaRef, keptRef])

    // 新文字写进 DOM 之后 scrollHeight 才准，所以挂载后量一次，之后每次改值都在 post 阶段再量。
    function syncHeight(): void {
      const el = keptRef.value
      if (el == null)
        return
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
    onMounted(syncHeight)
    watch(() => props.modelValue, syncHeight, { flush: 'post' })

    return () => h('textarea', {
      'ref': mergedRef,
      'class': 'auto-grow-text-area',
      'value': props.modelValue,
      'rows': 1,
      'aria-label': 'Auto-growing message',
      'placeholder': 'Type — the box grows itself',
      'onInput': (event: Event) => emit('update:modelValue', (event.target as HTMLTextAreaElement).value),
    })
  },
})

const areaRef = ref<HTMLTextAreaElement | null>(null)
const value = ref('This box keeps its own ref to measure and grow. The button focuses it through the forwarded ref.')

function forwardArea(el: HTMLTextAreaElement | null): void {
  areaRef.value = el
}
</script>

<template>
  <Card :width="360" :padding="4">
    <VStack :gap="3">
      <AutoGrowTextArea v-model="value" :textarea-ref="forwardArea" />
      <Button label="Focus via forwarded ref" size="sm" @click="areaRef?.focus()" />
    </VStack>
  </Card>
</template>

<style scoped>
:deep(.auto-grow-text-area) {
  box-sizing: border-box;
  width: 100%;
  padding: 8px;
  border: 1px solid;
  border-radius: 8px;
  resize: none;
  overflow: hidden;
  color: inherit;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  line-height: 20px;
}
</style>
