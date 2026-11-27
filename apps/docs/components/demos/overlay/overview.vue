<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Button } from '@astryx-vue/core/Button'
import { Overlay } from '@astryx-vue/core/Overlay'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Overlay align="center">
    <AspectRatio :ratio="16 / 9" class="overlay-overview__media">
      <img src="/template-assets/light-scene-horizontal-1.png" alt="Abstract landscape">
    </AspectRatio>
    <template #content>
      <VStack :gap="2" class="overlay-overview__content">
        <Text type="supporting" weight="bold" color="inherit">
          Design system foundations
        </Text>
        <Button label="Open gallery" variant="secondary" size="sm" @click="demo('Open gallery')" />
      </VStack>
    </template>
  </Overlay>
</template>

<style scoped>
.overlay-overview__media {
  width: 520px;
  max-width: 100%;
  border-radius: 16px;
  overflow: clip;
}

.overlay-overview__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay-overview__content {
  text-align: center;
}
</style>
