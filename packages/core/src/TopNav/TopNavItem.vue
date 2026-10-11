<script setup lang="ts">
import type { TopNavItemEmits, TopNavItemProps } from './types.js'
import { inject } from 'vue'
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
</script>

<template>
  <NavItem
    class="astryx-top-nav-item"
    :class="{ 'astryx-top-nav-item--drawer': inDrawer }"
    :as="as"
    :block="inDrawer"
    :href="href"
    :icon-class="iconClass"
    :is-disabled="isDisabled"
    :is-icon-only="props.isIconOnly && !inDrawer"
    :is-selected="isSelected"
    :label="label"
    :rel="rel"
    :size="size"
    :target="target"
    @click="emit('click', $event)"
  />
</template>
