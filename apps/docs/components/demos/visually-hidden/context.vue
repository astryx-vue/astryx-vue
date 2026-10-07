<script setup lang="ts">
import { VisuallyHidden } from '@astryx-vue/core/VisuallyHidden'
</script>

<template>
  <div class="visually-hidden-preview__row">
    <span class="visually-hidden-preview__label">Page shows</span>
    <a href="#visually-hidden-context">
      Read more
      <VisuallyHidden> about accessibility primitives</VisuallyHidden>
    </a>
  </div>
  <div aria-hidden="true" class="visually-hidden-preview__row">
    <span class="visually-hidden-preview__label">Screen reader</span>
    <q>Read more about accessibility primitives</q>
  </div>
</template>
