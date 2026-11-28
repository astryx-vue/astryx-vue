<script setup lang="ts">
import type { TopNavProps, TopNavSlots } from './types.js'
import { computed, ref, Text, useId, useSlots } from 'vue'
import { hasSlotContent } from '../composables/internal/slotContent.js'
import { useAppShellMobile } from '../composables/useAppShellMobile.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { useComponentMessages } from '../locale/context.js'
import { navMessages } from '../locale/messages/nav.js'
import MobileNav from '../MobileNav/MobileNav.vue'
import MobileNavScope from '../MobileNav/MobileNavScope.vue'
import MobileNavToggle from '../MobileNav/MobileNavToggle.vue'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNav' })

const props = defineProps<TopNavProps>()
defineSlots<TopNavSlots>()
const slots = useSlots()
const messages = useComponentMessages({ nav: navMessages })
const drawerId = `astryx-top-nav-${useId()}`
const mobileOpen = ref(false)
const shell = useAppShellMobile()
const queryMatches = props.mobileQuery ? useMediaQuery(props.mobileQuery) : ref(false)
const shellCompact = computed(() => shell.isMobile && shell.isMobileNavEnabled)
const isCompact = computed(() => shellCompact.value || (Boolean(props.mobileQuery) && queryMatches.value))
const ownsDrawer = computed(() => isCompact.value && !shellCompact.value)

// 区域画不画，和里面有没有内容用同一个判断：空插槽、只剩 v-if 注释的插槽不留空壳。
function hasHeading(): boolean {
  return hasSlotContent(slots.heading)
}
function hasCenter(): boolean {
  return hasSlotContent(slots.center)
}
function hasStart(): boolean {
  return hasSlotContent(slots.start) || hasSlotContent(slots.default)
}
function hasEnd(): boolean {
  return hasSlotContent(slots.end)
}
function hasDrawer(): boolean {
  return hasStart() || hasCenter()
}
/** 手机条上纯文字的标题没有能裁剪它的盒子，包一层把它收在一行内。 */
function headingIsPlainText(): boolean {
  const nodes = slots.heading?.() ?? []
  return nodes.length > 0 && nodes.every(node => node.type === Text)
}
function showShellToggle(): boolean {
  return shellCompact.value && shell.hasAutoToggle && (hasDrawer() || shell.hasSideNav)
}

function setShellOpen(next: boolean) {
  if (next)
    shell.openMobileNav()
  else
    shell.closeMobileNav()
}
const label = computed(() => props.label || messages.value.nav.topNav)
</script>

<template>
  <nav
    class="astryx-top-nav"
    :class="{ 'astryx-top-nav--centered': hasCenter() && !isCompact, 'astryx-top-nav--compact': isCompact }"
    :data-mode="isCompact ? 'mobile-bar' : undefined"
    :aria-label="label"
  >
    <div class="astryx-top-nav__start">
      <div v-if="hasHeading()" class="astryx-top-nav__heading">
        <span v-if="isCompact && headingIsPlainText()" class="astryx-top-nav__heading-text">
          <slot name="heading" />
        </span>
        <slot v-else name="heading" />
      </div>
      <div v-if="!isCompact && hasStart()" class="astryx-top-nav__items">
        <slot name="start" />
        <slot />
      </div>
    </div>
    <div v-if="hasCenter() && !isCompact" class="astryx-top-nav__center">
      <slot name="center" />
    </div>
    <div v-if="hasEnd() || showShellToggle() || (ownsDrawer && hasDrawer()) || (hasCenter() && !isCompact)" class="astryx-top-nav__end">
      <slot name="end" />
      <MobileNavToggle
        v-if="showShellToggle()"
        :is-open="shell.isMobileNavOpen"
        :controls="shell.mobileNavId"
        @update:is-open="setShellOpen"
      />
      <MobileNavToggle v-else-if="ownsDrawer && hasDrawer()" v-model:is-open="mobileOpen" :controls="drawerId" />
    </div>
  </nav>
  <Teleport v-if="shellCompact && hasDrawer()" defer :to="`#${shell.mobileNavId}-items`">
    <MobileNavScope :close="shell.closeMobileNav">
      <div class="astryx-top-nav__drawer">
        <slot name="start" />
        <slot />
        <slot name="center" />
      </div>
    </MobileNavScope>
  </Teleport>
  <MobileNav
    v-if="ownsDrawer && hasDrawer()"
    :id="drawerId"
    v-model:is-open="mobileOpen"
    :label="label"
  >
    <div class="astryx-top-nav__drawer">
      <slot name="start" />
      <slot />
      <slot name="center" />
    </div>
  </MobileNav>
</template>
