<script setup lang="ts">
import type { DropdownMenuContextValue } from './context.js'
import { provide } from 'vue'
import { dropdownMenuContextKey } from './context.js'

defineOptions({ name: 'AstryxDropdownMenuBranch' })

const props = defineProps<{
  value: DropdownMenuContextValue
}>()

provide(dropdownMenuContextKey, props.value)
</script>

<template>
  <slot />
</template>
