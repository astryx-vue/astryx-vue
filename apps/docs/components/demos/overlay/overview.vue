<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Overlay } from '@astryx-vue/core/Overlay'
</script>

<template>
  <Overlay class="overlay-preview__frame">
    <div class="overlay-preview__media">
      <span class="overlay-preview__media-label">Fjord at dusk</span>
    </div>
    <template #content>
      <Button label="Quick view" size="sm" variant="secondary" />
    </template>
  </Overlay>
</template>
