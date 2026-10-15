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
const ctaHref = computed(() => {
  if (!props.linkLabel)
    return undefined
  return props.linkHref || props.href
})
const wholeHref = computed(() => ctaHref.value ? undefined : props.href)
const root = computed(() => wholeHref.value ? resolveNavRoot(wholeHref.value, false, props.as) : 'div')
const ctaRoot = computed(() => ctaHref.value ? resolveNavRoot(ctaHref.value, false, props.as) : 'span')
const imageIsDecorative = computed(() => props.image != null && !props.imageAlt)

function onNavigate(): void {
  closeMenu?.()
}
</script>

<template>
  <component
    :is="root"
    class="astryx-top-nav-mega-card"
    :class="{ 'astryx-top-nav-mega-card--static': !wholeHref }"
    :href="wholeHref || undefined"
    :to="wholeHref && as != null ? wholeHref : undefined"
    @click="wholeHref ? onNavigate() : undefined"
  >
    <img
      v-if="image"
      class="astryx-top-nav-mega-card__image"
      :src="image"
      :alt="imageAlt ?? ''"
      :role="imageIsDecorative ? 'presentation' : undefined"
      :aria-hidden="imageIsDecorative ? 'true' : undefined"
    >
    <span class="astryx-top-nav-mega-card__body">
      <span class="astryx-top-nav-mega-card__title">{{ title }}</span>
      <span v-if="description" class="astryx-top-nav-mega-card__description">{{ description }}</span>
      <component
        :is="ctaRoot"
        v-if="ctaHref && linkLabel"
        class="astryx-top-nav-mega-card__link"
        :href="ctaHref"
        :to="as != null ? ctaHref : undefined"
        @click.stop="onNavigate"
      >
        {{ linkLabel }} →
      </component>
      <slot />
    </span>
  </component>
</template>
