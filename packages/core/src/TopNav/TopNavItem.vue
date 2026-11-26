<script setup lang="ts">
import type { TopNavItemEmits, TopNavItemProps } from './types.js'
import { inject } from 'vue'
import { useCloseMobileDrawer } from '../MobileNav/closeOnActivate.js'
import { mobileNavKey } from '../MobileNav/context.js'
import NavItem from '../NavItem/NavItem.vue'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavItem' })

const props = withDefaults(defineProps<TopNavItemProps>(), {
  isDisabled: false,
  isIconOnly: false,
  isSelected: false,
  size: 'md',
})
const emit = defineEmits<TopNavItemEmits>()
const inDrawer = inject(mobileNavKey, false)
const closeMobileDrawer = useCloseMobileDrawer()

function onClick(event: MouseEvent): void {
  emit('click', event)
  closeMobileDrawer()
}
</script>

<template>
  <NavItem
    class="astryx-top-nav-item"
    :class="{ 'astryx-top-nav-item--drawer': inDrawer }"
    :as="as"
    :block="inDrawer"
    :data-mode="inDrawer ? 'drawer' : undefined"
    :href="href"
    :icon-class="iconClass"
    :is-disabled="isDisabled"
    is-focusable-when-disabled
    :is-icon-only="props.isIconOnly && !inDrawer"
    :is-selected="isSelected"
    :label="label"
    :rel="rel"
    :size="size"
    :target="target"
    @click="onClick"
  />
</template>
