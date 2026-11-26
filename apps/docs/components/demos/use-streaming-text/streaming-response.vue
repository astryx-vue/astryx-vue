<script setup lang="ts">
import { useStreamingText } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { onBeforeUnmount, ref } from 'vue'

const CHUNKS = [
  'Astryx hooks keep behavior reusable ',
  'while components keep visuals consistent. ',
  'Streaming text arrives in bursts; ',
  'the hook smooths it into a steady reveal.',
]

const target = ref('')
const isStreaming = ref(false)
const displayedText = useStreamingText(target, isStreaming, { speed: 'fast' })

// 假的流：一段一段成批到达，像模型吐 token 那样。重新开始会停掉进行中的流，最后一段到达时流结束。
let timer: ReturnType<typeof setTimeout> | undefined

function stop(): void {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

function regenerate(): void {
  stop()
  target.value = ''
  isStreaming.value = true
  let index = 0
  const tick = (): void => {
    target.value += CHUNKS[index]
    index += 1
    if (index < CHUNKS.length) {
      timer = setTimeout(tick, 350)
    }
    else {
      timer = undefined
      // 最后一段到了就结束流，hook 会直接显示完整文本。
      isStreaming.value = false
    }
  }
  timer = setTimeout(tick, 350)
}

onBeforeUnmount(stop)
</script>

<template>
  <Card :width="420" :padding="4">
    <VStack :gap="3">
      <Text type="body" weight="bold">
        Assistant response
      </Text>
      <Text type="body">
        {{ displayedText }}
      </Text>
      <Button :label="isStreaming ? 'Streaming…' : 'Regenerate'" variant="secondary" size="sm" @click="regenerate" />
    </VStack>
  </Card>
</template>
