<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { OverlayScrim, useOverlay } from '@astryx-vue/core/Overlay'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const { containerRef, containerProps, scrimProps } = useOverlay({
  showOn: 'hover',
  position: 'bottom',
  align: 'center',
})

// The card itself is the overlay container.
function bindCard(card: Element | ComponentPublicInstance | null): void {
  containerRef.value = card == null ? null : (card as { element?: HTMLElement }).element ?? null
}
</script>

<template>
  <Card :ref="bindCard" :width="280" :padding="0" v-bind="containerProps">
    <div style="position: relative">
      <a href="#ceramic-mug">
        <AspectRatio :ratio="1">
          <img
            src="/template-assets/light-product-1.png"
            alt="Ceramic mug"
            style="width: 100%; height: 100%; object-fit: cover"
          >
        </AspectRatio>
      </a>
      <OverlayScrim v-bind="scrimProps">
        <Button label="Quick view" variant="secondary" size="sm" />
      </OverlayScrim>
    </div>
    <VStack :gap="1" :padding="3">
      <Text type="body" weight="bold">
        Ceramic mug
      </Text>
      <Text type="supporting" color="secondary">
        $24
      </Text>
    </VStack>
  </Card>
</template>
