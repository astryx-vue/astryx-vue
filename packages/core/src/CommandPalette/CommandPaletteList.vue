<script setup lang="ts">
import type { CommandPaletteListProps } from './types.js'
import { computed, inject } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import { commandPaletteKey } from './context.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPaletteList' })

const props = defineProps<CommandPaletteListProps>()
const palette = inject(commandPaletteKey, null)
const messages = useAstryxMessages()
const label = computed(() => props.label ?? messages.value.commandPalette.listLabel)
</script>

<template>
  <div
    :id="palette?.listId"
    class="astryx-command-palette-list"
    role="listbox"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
