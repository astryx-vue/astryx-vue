<script setup lang="ts">
import type { CommandPaletteListProps } from './types.js'
import { computed, inject, useTemplateRef } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { commandPaletteKey } from './context.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPaletteList' })

const props = defineProps<CommandPaletteListProps>()
const palette = inject(commandPaletteKey, null)
const messages = useAstryxMessages()
const label = computed(() => props.label ?? messages.value.commandPalette.listLabel)
/** 没有可选项时它只是个空容器，不再当作 listbox 暴露给读屏。 */
const hasOptions = computed(() => palette == null || palette.items.value.length > 0)
const listEl = useTemplateRef<HTMLElement>('list')
useScrollbars(listEl)
</script>

<template>
  <div
    :id="palette?.listId"
    ref="list"
    class="astryx-command-palette-list"
    :role="hasOptions ? 'listbox' : undefined"
    :aria-label="hasOptions ? label : undefined"
  >
    <slot />
  </div>
</template>
