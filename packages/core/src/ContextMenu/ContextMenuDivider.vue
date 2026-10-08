<script setup lang="ts">
import type { ContextMenuDividerProps } from './types.js'
import Divider from '../Divider/Divider.vue'
import '../../styles/context-menu.css'

defineOptions({ name: 'AstryxContextMenuDivider' })

withDefaults(defineProps<ContextMenuDividerProps>(), {
  variant: 'subtle',
})
</script>

<template>
  <Divider class="astryx-context-menu-divider" :variant="variant" />
</template>
