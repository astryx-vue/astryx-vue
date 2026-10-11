<script setup lang="ts">
import { Kbd } from '@astryx-vue/core/Kbd'
</script>

<template>
  <ul class="kbd-preview kbd-preview__list">
    <li class="kbd-preview__item">
      <span class="kbd-preview__label">Search</span>
      <Kbd keys="mod+k" />
    </li>
    <li class="kbd-preview__item">
      <span class="kbd-preview__label">Command palette</span>
      <Kbd keys="mod+shift+p" />
    </li>
  </ul>
</template>
