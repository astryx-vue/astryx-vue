<script setup lang="ts">
import type { TopNavProps, TopNavSlots } from './types.js'
import { computed, ref, useId, useSlots } from 'vue'
import { useAppShellMobile } from '../composables/useAppShellMobile.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { useAstryxMessages } from '../locale/index.js'
import MobileNav from '../MobileNav/MobileNav.vue'
import MobileNavToggle from '../MobileNav/MobileNavToggle.vue'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNav' })

const props = defineProps<TopNavProps>()
defineSlots<TopNavSlots>()
const slots = useSlots()
const messages = useAstryxMessages()
const drawerId = `astryx-top-nav-${useId()}`
const mobileOpen = ref(false)
const shell = useAppShellMobile()
const queryMatches = props.mobileQuery ? useMediaQuery(props.mobileQuery) : ref(false)
const shellCompact = computed(() => shell.isMobile && shell.isMobileNavEnabled)
const isCompact = computed(() => shellCompact.value || (Boolean(props.mobileQuery) && queryMatches.value))
const ownsDrawer = computed(() => isCompact.value && !shellCompact.value)
const hasCenter = computed(() => slots.center != null)
const hasDrawer = computed(() => slots.start != null || slots.default != null || slots.center != null)
const showShellToggle = computed(() => shellCompact.value && shell.hasAutoToggle && (hasDrawer.value || shell.hasSideNav))

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
    :class="{ 'astryx-top-nav--centered': hasCenter && !isCompact }"
    :aria-label="label"
  >
    <div class="astryx-top-nav__start">
      <div v-if="slots.heading" class="astryx-top-nav__heading">
        <slot name="heading" />
      </div>
      <div v-if="!isCompact" class="astryx-top-nav__items">
        <slot name="start" />
        <slot />
      </div>
    </div>
    <div v-if="hasCenter && !isCompact" class="astryx-top-nav__center">
      <slot name="center" />
    </div>
    <div class="astryx-top-nav__end">
      <slot name="end" />
      <MobileNavToggle
        v-if="showShellToggle"
        :is-open="shell.isMobileNavOpen"
        :controls="shell.mobileNavId"
        @update:is-open="setShellOpen"
      />
      <MobileNavToggle v-else-if="ownsDrawer && hasDrawer" v-model:is-open="mobileOpen" :controls="drawerId" />
    </div>
  </nav>
  <Teleport v-if="shellCompact && hasDrawer" :to="`#${shell.mobileNavId}-items`">
    <div class="astryx-top-nav__drawer">
      <slot name="start" />
      <slot />
      <slot name="center" />
    </div>
  </Teleport>
  <MobileNav
    v-if="ownsDrawer && hasDrawer"
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
