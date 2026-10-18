<script setup lang="ts">
import { useStreamingText } from '@astryx-vue/core'
import { Badge } from '@astryx-vue/core/Badge'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Section } from '@astryx-vue/core/Section'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { onBeforeUnmount, ref } from 'vue'

const target = 'Astryx hooks keep behavior reusable while components keep visuals consistent.'

const source = ref('')
const isStreaming = ref(false)
const displayedText = useStreamingText(source, isStreaming)

let timer: ReturnType<typeof setInterval> | undefined

function stop(): void {
  if (timer !== undefined) {
    clearInterval(timer)
    timer = undefined
  }
}

function stream(): void {
  stop()
  source.value = ''
  isStreaming.value = true
  let offset = 0
  // 每 200ms 送一小段，模拟生成中的分块到达
  timer = setInterval(() => {
    offset = Math.min(offset + 8, target.length)
    source.value = target.slice(0, offset)
    if (offset >= target.length) {
      isStreaming.value = false
      stop()
    }
  }, 200)
}

onBeforeUnmount(stop)
stream()
</script>

<template>
  <Section variant="muted" :padding="4" :max-width="520">
    <Card :padding="4" width="100%">
      <Stack direction="vertical" :gap="3">
        <Stack direction="horizontal" :gap="2" align="center">
          <Heading :level="4">
            Assistant response
          </Heading>
          <Badge :variant="isStreaming ? 'info' : 'success'">
            {{ isStreaming ? 'Streaming' : 'Complete' }}
          </Badge>
        </Stack>
        <Text class="streaming-text" type="body">
          {{ displayedText }}
        </Text>
        <Stack direction="horizontal" :gap="2">
          <Button label="Stream again" size="sm" variant="secondary" @click="stream" />
        </Stack>
      </Stack>
    </Card>
  </Section>
</template>

<style scoped>
.streaming-text {
  min-height: 3.5rem;
}
</style>
