<script setup lang="ts">
import type { LayoutArea } from './context.js'
import { computed, provide } from 'vue'
import { layoutAreaKey } from './context.js'

const props = defineProps<{ area: LayoutArea }>()

provide(layoutAreaKey, computed(() => props.area))
</script>

<template>
  <slot />
</template>
