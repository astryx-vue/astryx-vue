<script setup lang="ts">
import type { ContextMenuGroupProps, ContextMenuGroupSlots } from './types.js'
import { computed, useId } from 'vue'
import '../../styles/context-menu.css'

defineOptions({ name: 'AstryxContextMenuGroup' })

const props = defineProps<ContextMenuGroupProps>()
defineSlots<ContextMenuGroupSlots>()

const headingId = `astryx-context-menu-group-${useId()}`
const hasTitle = computed(() => props.title != null && props.title !== '')
</script>

<template>
  <div class="astryx-context-menu-group" role="group" :aria-labelledby="hasTitle ? headingId : undefined">
    <div
      v-if="hasTitle"
      :id="headingId"
      class="astryx-context-menu-group__heading"
    >
      {{ title }}
    </div>
    <slot />
  </div>
</template>
