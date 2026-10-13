<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timer } from '@astryx-vue/core/Timer'

const startedAt = Date.now() - 3_753_000
</script>

<template>
  <Stack direction="vertical" :gap="3">
    <Stack direction="horizontal" :gap="3" align="center">
      <Text type="supporting" color="secondary">
        Elapsed
      </Text>
      <Timer :start-time="startedAt" type="body" color="primary" />
    </Stack>
    <Stack direction="horizontal" :gap="3" align="center">
      <Text type="supporting" color="secondary">
        Clock
      </Text>
      <Timer format="clock" :start-time="startedAt" type="body" color="primary" />
    </Stack>
  </Stack>
</template>
