<script setup lang="ts">
import type { TopNavMegaMenuItemProps, TopNavMegaMenuItemSlots } from './types.js'
import { computed, inject } from 'vue'
import { useLinkComponent } from '../LinkProvider/context.js'
import { isNavigableHref, resolveNavRoot } from '../NavItem/link.js'
import { navMenuCloseKey } from '../NavMenu/context.js'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavMegaMenuItem' })

const props = defineProps<TopNavMegaMenuItemProps>()
defineSlots<TopNavMegaMenuItemSlots>()

const closeMenu = inject(navMenuCloseKey, undefined)
const linkComponent = useLinkComponent()
/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)
const navigableHref = computed(() => isNavigableHref(props.href) ? props.href : undefined)
const root = computed(() => resolveNavRoot(navigableHref.value, false, customLink.value))

function onClick(): void {
  closeMenu?.()
}
</script>

<template>
  <component
    :is="root"
    class="astryx-top-nav-mega-item"
    :href="navigableHref"
    :to="navigableHref && customLink != null ? navigableHref : undefined"
    :type="navigableHref ? undefined : 'button'"
    @click="onClick"
  >
    <span v-if="iconClass || $slots.icon" class="astryx-top-nav-mega-item__icon" aria-hidden="true">
      <slot name="icon">
        <span v-if="iconClass" class="astryx-top-nav-mega-item__glyph-box"><span class="astryx-top-nav-mega-item__glyph" :class="iconClass" /></span>
      </slot>
    </span>
    <span class="astryx-top-nav-mega-item__text">
      <span class="astryx-top-nav-mega-item__title">{{ title }}</span>
      <span v-if="description" class="astryx-top-nav-mega-item__description">{{ description }}</span>
    </span>
  </component>
</template>
