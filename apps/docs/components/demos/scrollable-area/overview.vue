<script setup lang="ts">
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <ScrollableArea label="Notes" :height="140" :padding="3">
    <Text type="body">
      A scrollable region keeps long content inside a fixed viewport.
    </Text>
    <Text type="body">
      The header and the page around it stay put while this area scrolls.
    </Text>
    <Text type="body">
      Keyboard users can tab into it once the content overflows.
    </Text>
  </ScrollableArea>
</template>
