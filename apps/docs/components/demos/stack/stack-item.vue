<script setup lang="ts">
import { Stack, StackItem } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="horizontal" :gap="2" width="100%">
    <StackItem size="static">
      Static
    </StackItem>
    <StackItem size="fill">
      Fill remaining space
    </StackItem>
  </Stack>
</template>
