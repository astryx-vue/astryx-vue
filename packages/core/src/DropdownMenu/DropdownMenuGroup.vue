<script setup lang="ts">
import type { DropdownMenuGroupProps, DropdownMenuGroupSlots } from './types.js'
import { useId } from 'vue'
import { hasSlotContent } from '../composables/internal/slotContent.js'
import DropdownMenuSectionHeading from './DropdownMenuSectionHeading.vue'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuGroup' })

const props = defineProps<DropdownMenuGroupProps>()

const slots = defineSlots<DropdownMenuGroupSlots>()

const headingId = `astryx-dropdown-menu-group-${useId()}`
// 标题插槽画出了内容，或者 title 不是空字符串，才有标题来命名这一组。在渲染时判断。
function hasTitle(): boolean {
  return hasSlotContent(slots.title) || (props.title != null && props.title !== '')
}
</script>

<template>
  <div
    class="astryx-dropdown-menu-group"
    role="group"
    :aria-labelledby="hasTitle() ? headingId : undefined"
  >
    <DropdownMenuSectionHeading v-if="hasTitle()" :id="headingId">
      <slot name="title">
        {{ title }}
      </slot>
    </DropdownMenuSectionHeading>
    <slot />
  </div>
</template>
