<script setup lang="ts">
import { Kbd } from '@astryx-vue/core/Kbd'

const combos = ['mod+shift+p', 'ctrl+alt+delete', 'alt+tab', 'shift+plus', 'enter', 'esc']
</script>

<template>
  <div class="kbd-preview__row">
    <Kbd v-for="combo in combos" :key="combo" :keys="combo" />
  </div>
</template>
