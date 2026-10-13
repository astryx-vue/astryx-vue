<script setup lang="ts">
import { HStack } from '@astryx-vue/core/Stack'
import { Timer } from '@astryx-vue/core/Timer'

const startedAt = Date.now() - 3_753_000
</script>

<template>
  <HStack :gap="6" align="center">
    <Timer :start-time="startedAt" type="body" size="xl" color="primary" weight="semibold" />
    <Timer format="clock" :start-time="startedAt" type="body" size="xl" color="primary" weight="semibold" />
  </HStack>
</template>
