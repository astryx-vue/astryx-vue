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
/** 没有可选项时它只是个空容器，不再当作 listbox 暴露给读屏。单独使用时始终是 listbox。 */
const hasOptions = computed(() => palette == null || palette.items.value.length > 0)
const bindings = computed(() => {
  const result: Record<string, string> = {}
  if (palette != null)
    result.id = palette.listId
  if (hasOptions.value) {
    result.role = 'listbox'
    result['aria-label'] = label.value
  }
  return result
})
const listEl = useTemplateRef<HTMLElement>('list')
useScrollbars(listEl)
</script>

<template>
  <div
    ref="list"
    v-bind="bindings"
    class="astryx-command-palette-list"
  >
    <slot />
  </div>
</template>
