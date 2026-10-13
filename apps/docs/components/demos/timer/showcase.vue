<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timer } from '@astryx-vue/core/Timer'

const startedAt = Date.now() - 3_753_000
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Text type="large" color="primary" weight="semibold">
      Processing
    </Text>
    <Stack direction="horizontal" :gap="6" align="center">
      <Stack direction="vertical" :gap="1">
        <Text type="supporting" color="secondary">
          Elapsed
        </Text>
        <Timer :start-time="startedAt" type="body" size="xl" color="primary" weight="semibold" />
      </Stack>
      <Stack direction="vertical" :gap="1">
        <Text type="supporting" color="secondary">
          Clock
        </Text>
        <Timer format="clock" :start-time="startedAt" type="body" size="xl" color="primary" weight="semibold" />
      </Stack>
    </Stack>
  </Stack>
</template>
