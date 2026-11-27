<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Button } from '@astryx-vue/core/Button'
import { Overlay } from '@astryx-vue/core/Overlay'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Overlay show-on="hover" align="center">
    <AspectRatio
      :ratio="16 / 9"
      style="width: 420px; max-width: 100%; border-radius: 12px; overflow: clip"
    >
      <img
        src="/template-assets/light-working-horizontal-1.png"
        alt="Workspace preview"
        style="width: 100%; height: 100%; object-fit: cover"
      >
    </AspectRatio>
    <template #content>
      <Button label="Quick view" variant="secondary" size="sm" @click="demo('Quick view')" />
    </template>
  </Overlay>
</template>
