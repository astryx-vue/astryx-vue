<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Overlay } from '@astryx-vue/core/Overlay'
</script>

<template>
  <div class="overlay-preview__grid">
    <Overlay scrim="dark">
      <div class="overlay-preview__media">
        <span class="overlay-preview__media-label">Dark scrim</span>
      </div>
      <template #content>
        <Button label="View" size="sm" variant="secondary" />
      </template>
    </Overlay>

    <Overlay scrim="light">
      <div class="overlay-preview__media">
        <span class="overlay-preview__media-label">Light scrim</span>
      </div>
      <template #content>
        <Button label="View" size="sm" variant="secondary" />
      </template>
    </Overlay>

    <Overlay :scrim="false">
      <div class="overlay-preview__media">
        <span class="overlay-preview__media-label">No scrim</span>
      </div>
      <template #content>
        <Button label="View" size="sm" variant="primary" />
      </template>
    </Overlay>
  </div>
</template>
