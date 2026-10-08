<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Overlay } from '@astryx-vue/core/Overlay'
</script>

<template>
  <div class="overlay-preview__grid">
    <Overlay position="fill" align="center">
      <div class="overlay-preview__media">
        <span class="overlay-preview__media-label">Position fill</span>
      </div>
      <template #content>
        <Button label="Play" size="sm" variant="secondary" />
      </template>
    </Overlay>

    <Overlay position="bottom" align="start">
      <div class="overlay-preview__media">
        <span class="overlay-preview__media-label">Position bottom</span>
      </div>
      <template #content>
        <Button label="Play" size="sm" variant="secondary" />
      </template>
    </Overlay>

    <Overlay position="top" align="end">
      <div class="overlay-preview__media">
        <span class="overlay-preview__media-label">Position top</span>
      </div>
      <template #content>
        <Button label="Play" size="sm" variant="secondary" />
      </template>
    </Overlay>
  </div>
</template>
