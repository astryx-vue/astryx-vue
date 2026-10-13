<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timer } from '@astryx-vue/core/Timer'

const startedAt = Date.now() - 128_000
</script>

<template>
  <Stack direction="vertical" :gap="3">
    <Text type="supporting" color="secondary">
      Default
    </Text>
    <Timer :start-time="startedAt" />
    <Text type="supporting" color="secondary">
      Emphasized
    </Text>
    <Timer :start-time="startedAt" type="body" size="xl" color="primary" weight="semibold" />
  </Stack>
</template>
