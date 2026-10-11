<script setup lang="ts">
import type { TopNavMegaMenuFeaturedCardProps, TopNavMegaMenuFeaturedCardSlots } from './types.js'
import { computed, inject } from 'vue'
import { resolveNavRoot } from '../NavItem/link.js'
import { navMenuCloseKey } from '../NavMenu/context.js'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavMegaMenuFeaturedCard' })

const props = defineProps<TopNavMegaMenuFeaturedCardProps>()
defineSlots<TopNavMegaMenuFeaturedCardSlots>()

const closeMenu = inject(navMenuCloseKey, undefined)
const root = computed(() => props.href ? resolveNavRoot(props.href, false, props.as) : 'div')

function onClick(): void {
  if (props.href)
    closeMenu?.()
}
</script>

<template>
  <component
    :is="root"
    class="astryx-top-nav-mega-card"
    :href="href || undefined"
    :to="href && as != null ? href : undefined"
    @click="onClick"
  >
    <span class="astryx-top-nav-mega-card__title">{{ title }}</span>
    <span v-if="description" class="astryx-top-nav-mega-card__description">{{ description }}</span>
    <slot />
  </component>
</template>
