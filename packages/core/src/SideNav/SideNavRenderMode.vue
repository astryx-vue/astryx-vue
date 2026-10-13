<script setup lang="ts">
import type { SideNavRenderMode } from './context.js'
import { computed, provide } from 'vue'
import { sideNavRenderModeKey } from './context.js'

defineOptions({ name: 'AstryxSideNavRenderMode' })

const props = defineProps<{ mode: SideNavRenderMode }>()

provide(sideNavRenderModeKey, computed(() => props.mode))
</script>

<template>
  <slot />
</template>
