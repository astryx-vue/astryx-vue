<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const sample = computed(() => pick(
  [
    '## 流式输出',
    '',
    '标题一旦写完就稳定下来，后面的段落还在继续。',
    '',
    '- 只重新解析最后一个未完成的块',
    '- 链接仍然会做地址过滤',
    '- 新出现的文字会淡入',
    '',
    '```ts',
    'export const ready = true',
    '```',
    '',
    '这是最后一句，到这里就结束了。',
  ].join('\n'),
  [
    '## Streaming',
    '',
    'The heading settles once it is finished, while the paragraph after it is still arriving.',
    '',
    '- Only the last open block is parsed again',
    '- Links are still filtered',
    '- New text fades in',
    '',
    '```ts',
    'export const ready = true',
    '```',
    '',
    'This is the last sentence, and then it stops.',
  ].join('\n'),
))
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
  const source = sample.value
  content.value = ''
  streaming.value = true
  phase.value = 'running'
  cursor = 0
  timer = window.setInterval(() => {
    cursor = Math.min(source.length, cursor + 18)
    content.value = source.slice(0, cursor)
    if (cursor >= source.length) {
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
