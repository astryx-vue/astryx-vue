<script setup lang="ts">
import type { DropdownMenuGroupProps, DropdownMenuGroupSlots } from './types.js'
import { computed, useId } from 'vue'
import DropdownMenuSectionHeading from './DropdownMenuSectionHeading.vue'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuGroup' })

const props = defineProps<DropdownMenuGroupProps>()

defineSlots<DropdownMenuGroupSlots>()

const headingId = `astryx-dropdown-menu-group-${useId()}`
const hasTitle = computed(() => props.title != null && props.title !== '')
</script>

<template>
  <div
    class="astryx-dropdown-menu-group"
    role="group"
    :aria-labelledby="hasTitle ? headingId : undefined"
  >
    <DropdownMenuSectionHeading v-if="hasTitle || $slots.title" :id="headingId">
      <slot name="title">
        {{ title }}
      </slot>
    </DropdownMenuSectionHeading>
    <slot />
  </div>
</template>
