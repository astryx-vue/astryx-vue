<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack :gap="2">
    <Badge label="React" />
    <Badge label="TypeScript" />
    <Badge label="Node.js" />
  </HStack>
</template>
