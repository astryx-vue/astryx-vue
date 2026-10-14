<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Badge } from '@astryx-vue/core/Badge'
import { Overlay } from '@astryx-vue/core/Overlay'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Overlay position="bottom" align="start">
    <AspectRatio
      :ratio="16 / 9"
      style="width: 420px; max-width: 100%; border-radius: 12px; overflow: clip"
    >
      <img
        src="/template-assets/illustrative-horizontal-1.png"
        alt="Product highlight preview"
        style="width: 100%; height: 100%; object-fit: cover"
      >
    </AspectRatio>
    <template #content>
      <VStack :gap="1">
        <Badge variant="green">
          New
        </Badge>
        <Text type="body" weight="bold" color="inherit">
          Weekly product highlights
        </Text>
        <Text type="supporting" color="inherit">
          12 updates across templates and tokens
        </Text>
      </VStack>
    </template>
  </Overlay>
</template>
