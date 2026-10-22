<script setup lang="ts">
import type { TopNavMegaMenuFeaturedCardProps, TopNavMegaMenuFeaturedCardSlots } from './types.js'
import { computed, inject } from 'vue'
import { useLinkComponent } from '../LinkProvider/context.js'
import { resolveNavRoot, safeNavHref } from '../NavItem/link.js'
import { navMenuCloseKey } from '../NavMenu/context.js'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavMegaMenuFeaturedCard' })

const props = defineProps<TopNavMegaMenuFeaturedCardProps>()
defineSlots<TopNavMegaMenuFeaturedCardSlots>()

const closeMenu = inject(navMenuCloseKey, undefined)
const linkComponent = useLinkComponent()
const ctaHref = computed(() => {
  if (!props.linkLabel)
    return undefined
  return safeNavHref(props.linkHref || props.href)
})
const wholeHref = computed(() => ctaHref.value ? undefined : safeNavHref(props.href))
/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)
const root = computed(() => wholeHref.value ? resolveNavRoot(wholeHref.value, false, customLink.value) : 'div')
const ctaRoot = computed(() => ctaHref.value ? resolveNavRoot(ctaHref.value, false, customLink.value) : 'span')
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
    :to="wholeHref && customLink != null ? wholeHref : undefined"
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
        :to="customLink != null ? ctaHref : undefined"
        @click.stop="onNavigate"
      >
        {{ linkLabel }} →
      </component>
      <slot />
    </span>
  </component>
</template>
