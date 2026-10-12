<script setup lang="ts">
import type { CommandPaletteGroupProps } from './types.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPaletteGroup' })

defineProps<CommandPaletteGroupProps>()
</script>

<template>
  <div class="astryx-command-palette-group" role="group" :aria-label="heading">
    <div class="astryx-command-palette-group-heading" aria-hidden="true">
      {{ heading }}
    </div>
    <slot />
  </div>
</template>
