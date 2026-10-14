<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="4" width="100%" style="max-width: 300px">
    <ProgressBar :value="60" label="Accent" variant="accent" has-value-label />
    <ProgressBar :value="80" label="Positive" variant="success" has-value-label />
    <ProgressBar :value="50" label="Warning" variant="warning" has-value-label />
    <ProgressBar :value="92" label="Negative" variant="error" has-value-label />
    <ProgressBar :value="35" label="Neutral" variant="neutral" has-value-label />
  </VStack>
</template>
