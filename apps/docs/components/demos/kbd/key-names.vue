<script setup lang="ts">
import { Kbd } from '@astryx-vue/core/Kbd'

const keys = ['mod', 'ctrl', 'alt', 'shift', 'enter', 'return', 'backspace', 'tab', 'escape', 'esc', 'up', 'down', 'left', 'right', 'plus']
</script>

<template>
  <div class="kbd-preview__grid">
    <div v-for="key in keys" :key="key" class="kbd-preview__cell">
      <Kbd :keys="key" />
      <code class="kbd-preview__code">{{ key }}</code>
    </div>
  </div>
</template>
