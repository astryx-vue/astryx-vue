<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'
import { streamingSample } from './meta'

const { pick } = useDemoText()
const content = ref('')
const streaming = ref(false)
const phase = ref<'idle' | 'running' | 'done'>('idle')
let timer = 0
let cursor = 0

const label = computed(() => {
  if (phase.value === 'running')
    return pick('正在输出', 'Streaming')
  if (phase.value === 'done')
    return pick('再看一次', 'Play again')
  return pick('播放示例', 'Play sample')
})

function stop(): void {
  window.clearInterval(timer)
  timer = 0
}

function play(): void {
  stop()
  const sample = pick(streamingSample.zh, streamingSample.en)
  content.value = ''
  streaming.value = true
  phase.value = 'running'
  cursor = 0
  timer = window.setInterval(() => {
    cursor = Math.min(sample.length, cursor + 18)
    content.value = sample.slice(0, cursor)
    if (cursor >= sample.length) {
      streaming.value = false
      phase.value = 'done'
      stop()
    }
  }, 70)
}

onBeforeUnmount(stop)
</script>

<template>
  <div class="markdown-preview__toolbar">
    <Button :is-disabled="phase === 'running'" :label="label" variant="primary" @click="play" />
  </div>
  <p v-if="phase === 'idle'" class="markdown-preview__hint">
    {{ pick('按下按钮，看一段说明像模型回复一样逐段出现。', 'Press the button and watch a short note appear the way a model reply would.') }}
  </p>
  <Markdown v-else :content="content" :is-streaming="streaming" />
</template>
