<script setup lang="ts">
import type { LinkProviderProps, LinkProviderSlots } from './types.js'
import { markRaw, provide } from 'vue'
import { linkComponentKey } from './context.js'

defineOptions({ name: 'AstryxLinkProvider', inheritAttrs: false })

const props = defineProps<LinkProviderProps>()
defineSlots<LinkProviderSlots>()

provide(linkComponentKey, markRaw(props.component))
</script>

<template>
  <slot />
</template>
