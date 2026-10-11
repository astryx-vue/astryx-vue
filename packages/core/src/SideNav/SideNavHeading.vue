<script setup lang="ts">
import type { SideNavHeadingProps, SideNavHeadingSlots } from './types.js'
import { computed, useSlots } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import { resolveNavRoot } from '../NavItem/link.js'
import NavDisclosure from '../NavMenu/NavDisclosure.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { useSideNavCollapse } from './context.js'
import '../../styles/side-nav.css'

defineOptions({ name: 'AstryxSideNavHeading' })

const props = defineProps<SideNavHeadingProps>()
defineSlots<SideNavHeadingSlots>()
const slots = useSlots()
const collapse = useSideNavCollapse()
const messages = useAstryxMessages()
const collapsed = computed(() => collapse.isCollapsed.value)
const hasIcon = computed(() => slots.icon != null)
const hasMenu = computed(() => slots.menu != null)
const wholeLink = computed(() =>
  Boolean(props.headingHref) && !hasMenu.value && !props.superheadingHref && !props.subheadingHref,
)
const linkRoot = computed(() => resolveNavRoot(props.headingHref, false, props.as))
</script>

<template>
  <Tooltip v-if="collapsed && hasIcon" :content="heading" placement="end">
    <NavDisclosure v-if="hasMenu" hover placement="end" :label="heading">
      <template #trigger="{ isOpen, panelId }">
        <button
          type="button"
          class="astryx-side-nav-heading astryx-side-nav-heading--collapsed"
          :aria-label="heading"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-controls="panelId"
          aria-haspopup="menu"
        >
          <span class="astryx-side-nav-heading__icon">
            <slot name="icon" />
          </span>
        </button>
      </template>
      <template #default="{ close }">
        <div class="astryx-side-nav-heading__menu">
          <slot name="menu" :close="close" />
        </div>
      </template>
    </NavDisclosure>
    <component
      :is="linkRoot"
      v-else-if="headingHref"
      class="astryx-side-nav-heading astryx-side-nav-heading--collapsed"
      :href="headingHref"
      :to="as != null ? headingHref : undefined"
      :aria-label="heading"
    >
      <span class="astryx-side-nav-heading__icon">
        <slot name="icon" />
      </span>
    </component>
    <div v-else class="astryx-side-nav-heading astryx-side-nav-heading--collapsed">
      <span class="astryx-side-nav-heading__icon">
        <slot name="icon" />
      </span>
    </div>
  </Tooltip>

  <component
    :is="linkRoot"
    v-else-if="!collapsed && wholeLink"
    class="astryx-side-nav-heading astryx-side-nav-heading--link"
    :href="headingHref"
    :to="as != null ? headingHref : undefined"
  >
    <span v-if="hasIcon" class="astryx-side-nav-heading__icon">
      <slot name="icon" />
    </span>
    <span class="astryx-side-nav-heading__text">
      <span v-if="superheading" class="astryx-side-nav-heading__super">{{ superheading }}</span>
      <span class="astryx-side-nav-heading__title">{{ heading }}</span>
      <span v-if="subheading" class="astryx-side-nav-heading__sub">{{ subheading }}</span>
    </span>
    <span v-if="$slots.end" class="astryx-side-nav-heading__end">
      <slot name="end" />
    </span>
  </component>

  <NavDisclosure v-else-if="!collapsed && hasMenu" hover :label="heading">
    <template #trigger="{ isOpen, panelId }">
      <div class="astryx-side-nav-heading" :data-open="isOpen || undefined">
        <component
          :is="linkRoot"
          v-if="headingHref"
          class="astryx-side-nav-heading__icon"
          :href="headingHref"
          :to="as != null ? headingHref : undefined"
          :aria-label="heading"
        >
          <slot name="icon" />
        </component>
        <span v-else-if="hasIcon" class="astryx-side-nav-heading__icon">
          <slot name="icon" />
        </span>
        <span class="astryx-side-nav-heading__text">
          <component
            :is="resolveNavRoot(superheadingHref, false, as)"
            v-if="superheading && superheadingHref"
            class="astryx-side-nav-heading__super astryx-side-nav-heading__link"
            :href="superheadingHref"
            :to="as != null ? superheadingHref : undefined"
          >
            {{ superheading }}
          </component>
          <span v-else-if="superheading" class="astryx-side-nav-heading__super">{{ superheading }}</span>
          <span class="astryx-side-nav-heading__row">
            <component
              :is="linkRoot"
              v-if="headingHref"
              class="astryx-side-nav-heading__title astryx-side-nav-heading__link"
              :href="headingHref"
              :to="as != null ? headingHref : undefined"
            >
              {{ heading }}
            </component>
            <span v-else class="astryx-side-nav-heading__title">{{ heading }}</span>
            <button
              type="button"
              class="astryx-side-nav-heading__chevron"
              :aria-label="messages.nav.openMenu"
              :aria-expanded="isOpen ? 'true' : 'false'"
              :aria-controls="panelId"
              aria-haspopup="menu"
            >
              <Icon icon="chevronDown" size="sm" :class="{ 'astryx-side-nav-heading__chevron-icon--open': isOpen }" />
            </button>
          </span>
          <component
            :is="resolveNavRoot(subheadingHref, false, as)"
            v-if="subheading && subheadingHref"
            class="astryx-side-nav-heading__sub astryx-side-nav-heading__link"
            :href="subheadingHref"
            :to="as != null ? subheadingHref : undefined"
          >
            {{ subheading }}
          </component>
          <span v-else-if="subheading" class="astryx-side-nav-heading__sub">{{ subheading }}</span>
        </span>
        <span v-if="$slots.end" class="astryx-side-nav-heading__end">
          <slot name="end" />
        </span>
      </div>
    </template>
    <template #default="{ close }">
      <div class="astryx-side-nav-heading__menu">
        <slot name="menu" :close="close" />
      </div>
    </template>
  </NavDisclosure>

  <div v-else-if="!collapsed" class="astryx-side-nav-heading">
    <component
      :is="linkRoot"
      v-if="hasIcon && headingHref"
      class="astryx-side-nav-heading__icon"
      :href="headingHref"
      :to="as != null ? headingHref : undefined"
      :aria-label="heading"
    >
      <slot name="icon" />
    </component>
    <span v-else-if="hasIcon" class="astryx-side-nav-heading__icon">
      <slot name="icon" />
    </span>
    <span class="astryx-side-nav-heading__text">
      <component
        :is="resolveNavRoot(superheadingHref, false, as)"
        v-if="superheading && superheadingHref"
        class="astryx-side-nav-heading__super astryx-side-nav-heading__link"
        :href="superheadingHref"
        :to="as != null ? superheadingHref : undefined"
      >
        {{ superheading }}
      </component>
      <span v-else-if="superheading" class="astryx-side-nav-heading__super">{{ superheading }}</span>
      <component
        :is="linkRoot"
        v-if="headingHref"
        class="astryx-side-nav-heading__title astryx-side-nav-heading__link"
        :href="headingHref"
        :to="as != null ? headingHref : undefined"
      >
        {{ heading }}
      </component>
      <span v-else class="astryx-side-nav-heading__title">{{ heading }}</span>
      <component
        :is="resolveNavRoot(subheadingHref, false, as)"
        v-if="subheading && subheadingHref"
        class="astryx-side-nav-heading__sub astryx-side-nav-heading__link"
        :href="subheadingHref"
        :to="as != null ? subheadingHref : undefined"
      >
        {{ subheading }}
      </component>
      <span v-else-if="subheading" class="astryx-side-nav-heading__sub">{{ subheading }}</span>
    </span>
    <span v-if="$slots.end" class="astryx-side-nav-heading__end">
      <slot name="end" />
    </span>
  </div>
</template>
