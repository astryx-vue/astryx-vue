<script setup lang="ts">
import { HStack } from '@astryx-vue/core/Stack'
import { StatusDot } from '@astryx-vue/core/StatusDot'
</script>

<template>
  <HStack align="center" :gap="2">
    <StatusDot variant="success" label="Positive" />
    <StatusDot variant="warning" label="Warning" />
    <StatusDot variant="error" label="Negative" />
    <StatusDot variant="accent" label="Info" />
    <StatusDot variant="neutral" label="Neutral" />
  </HStack>
</template>
