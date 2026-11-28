<script setup lang="ts">
import type { DropdownMenuGroupProps, DropdownMenuGroupSlots } from './types.js'
import { computed, useAttrs, useId } from 'vue'
import { hasSlotContent } from '../composables/internal/slotContent.js'
import DropdownMenuSectionHeading from './DropdownMenuSectionHeading.vue'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuGroup', inheritAttrs: false })

const props = defineProps<DropdownMenuGroupProps>()

const slots = defineSlots<DropdownMenuGroupSlots>()
const attrs = useAttrs()

const headingId = `astryx-dropdown-menu-group-${useId()}`
// 标题插槽画出了内容，或者 title 不是空字符串，才有标题来命名这一组。在渲染时判断。
const callerLabelledBy = computed(() => {
  const value = attrs['aria-labelledby']
  return typeof value === 'string' ? value : undefined
})

function hasTitle(): boolean {
  return hasSlotContent(slots.title) || (props.title != null && props.title !== '')
}
</script>

<template>
  <div
    v-bind="attrs"
    class="astryx-dropdown-menu-group"
    role="group"
    :aria-labelledby="hasTitle() ? headingId : callerLabelledBy"
  >
    <DropdownMenuSectionHeading v-if="hasTitle()" :id="headingId">
      <slot name="title">
        {{ title }}
      </slot>
    </DropdownMenuSectionHeading>
    <slot />
  </div>
</template>
