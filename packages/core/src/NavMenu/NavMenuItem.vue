<script setup lang="ts">
import type { NavMenuItemEmits, NavMenuItemProps, NavMenuItemSlots } from './types.js'
import { computed, inject } from 'vue'
import { resolveNavRoot } from '../NavItem/link.js'
import { navMenuCloseKey, navMenuKey } from './context.js'
import '../../styles/nav-menu.css'

defineOptions({ name: 'AstryxNavMenuItem' })

const props = withDefaults(defineProps<NavMenuItemProps>(), {
  isDisabled: false,
  isMenuItem: true,
  keepOpen: false,
})

const emit = defineEmits<NavMenuItemEmits>()
defineSlots<NavMenuItemSlots>()

const menu = inject(navMenuKey, null)
const closeMenu = inject(navMenuCloseKey, undefined)
const size = computed(() => menu?.size.value ?? 'md')
const isLink = computed(() => props.href != null && props.href !== '' && !props.isDisabled)
const root = computed(() => resolveNavRoot(props.href, props.isDisabled, props.as))

function onClick(event: MouseEvent): void {
  if (props.isDisabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
  if (event.defaultPrevented || props.keepOpen)
    return
  closeMenu?.()
  menu?.close()
}
</script>

<template>
  <component
    :is="root"
    class="astryx-nav-menu-item"
    :class="[`astryx-nav-menu-item--${size}`, { 'astryx-nav-menu-item--disabled': isDisabled }]"
    :role="isMenuItem ? 'menuitem' : undefined"
    :href="isLink ? href : undefined"
    :to="isLink && as != null ? href : undefined"
    :type="isLink ? undefined : 'button'"
    :disabled="isLink ? undefined : isDisabled"
    :aria-disabled="isDisabled || undefined"
    :tabindex="isMenuItem && !isDisabled ? -1 : undefined"
    @click="onClick"
  >
    <span v-if="iconClass || $slots.icon" class="astryx-nav-menu-item__icon" aria-hidden="true">
      <slot name="icon">
        <span v-if="iconClass" class="astryx-nav-menu-item__glyph" :class="iconClass" />
      </slot>
    </span>
    <span class="astryx-nav-menu-item__text">
      <span class="astryx-nav-menu-item__label">{{ label }}</span>
      <span v-if="description" class="astryx-nav-menu-item__description">{{ description }}</span>
    </span>
    <span v-if="$slots.end" class="astryx-nav-menu-item__end">
      <slot name="end" />
    </span>
  </component>
</template>
