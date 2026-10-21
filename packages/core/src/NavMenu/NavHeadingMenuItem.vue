<script setup lang="ts">
import type { NavHeadingMenuItemEmits, NavHeadingMenuItemProps, NavHeadingMenuItemSlots } from './types.js'
import { computed, inject, toRaw } from 'vue'
import { useLinkComponent } from '../LinkProvider/context.js'
import { navMenuCloseKey, navMenuKey } from './context.js'
import '../../styles/nav-menu.css'

defineOptions({ name: 'AstryxNavHeadingMenuItem', inheritAttrs: false })

const props = withDefaults(defineProps<NavHeadingMenuItemProps>(), {
  isDisabled: false,
})

const emit = defineEmits<NavHeadingMenuItemEmits>()
defineSlots<NavHeadingMenuItemSlots>()

const menu = inject(navMenuKey, null)
const closeMenu = inject(navMenuCloseKey, undefined)
const linkComponent = useLinkComponent()
const size = computed(() => menu?.size.value ?? 'md')
const isLink = computed(() => props.href != null && props.href !== '' && !props.isDisabled)
/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)
const root = computed(() => {
  if (!isLink.value)
    return 'div'
  return customLink.value == null ? 'a' : toRaw(customLink.value)
})

function onClick(event: MouseEvent): void {
  if (props.isDisabled) {
    event.preventDefault()
    return
  }
  const preventedBeforeItem = event.defaultPrevented
  emit('click', event)
  if (!preventedBeforeItem && event.defaultPrevented)
    return
  if (menu)
    menu.close()
  else
    closeMenu?.()
}
</script>

<template>
  <component
    :is="root"
    v-bind="$attrs"
    class="astryx-nav-heading-menu-item astryx-nav-menu-item"
    :class="[`astryx-nav-menu-item--${size}`, { 'astryx-nav-menu-item--disabled': isDisabled }]"
    role="menuitem"
    :href="isLink ? href : undefined"
    :to="isLink && customLink != null ? href : undefined"
    :aria-disabled="isDisabled || undefined"
    :tabindex="isDisabled ? undefined : -1"
    @click="onClick"
  >
    <span v-if="iconClass || $slots.icon" class="astryx-nav-menu-item__icon" aria-hidden="true">
      <slot name="icon">
        <span v-if="iconClass" class="astryx-nav-menu-item__glyph" :class="iconClass" />
      </slot>
    </span>
    <span class="astryx-nav-menu-item__text">
      <span v-if="$slots.default" class="astryx-nav-menu-item__label">
        <slot />
      </span>
      <span v-else class="astryx-nav-menu-item__label">{{ label }}</span>
      <span v-if="description" class="astryx-nav-menu-item__description">{{ description }}</span>
    </span>
  </component>
</template>
