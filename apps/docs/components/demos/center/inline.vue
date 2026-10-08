<script setup lang="ts">
import { Center } from '@astryx-vue/core/Center'
</script>

<template>
  <p class="center-preview__sentence">
    The build finished and
    <Center class="center-preview__badge" is-inline :width="22" :height="22">
      <span class="css-icon css-icon--sm i-carbon-checkmark" style="color: var(--astryx-icon-success-foreground)" />
    </Center>
    every artifact is up to date, so the sentence keeps a single line box while the glyph sits in a
    centered square. A second inline box marks the retried job:
    <Center class="center-preview__badge" is-inline :width="22" :height="22">
      <span class="css-icon css-icon--sm i-carbon-warning" style="color: var(--astryx-icon-warning-foreground)" />
    </Center>
  </p>
</template>
