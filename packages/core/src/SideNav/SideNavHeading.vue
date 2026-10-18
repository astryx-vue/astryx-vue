<script setup lang="ts">
import type { SideNavHeadingProps, SideNavHeadingSlots } from './types.js'
import { computed, useSlots } from 'vue'
import { useLinkComponent } from '../LinkProvider/context.js'
import { resolveNavRoot } from '../NavItem/link.js'
import NavDisclosure from '../NavMenu/NavDisclosure.vue'
import NavHeadingSurface from '../NavMenu/NavHeadingSurface.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { useSideNavCollapse } from './context.js'
import '../../styles/side-nav.css'

defineOptions({ name: 'AstryxSideNavHeading' })

const props = defineProps<SideNavHeadingProps>()
defineSlots<SideNavHeadingSlots>()
const slots = useSlots()
const collapse = useSideNavCollapse()
const linkComponent = useLinkComponent()
const collapsed = computed(() => collapse.isCollapsed.value)
const hasIcon = computed(() => slots.icon != null)
const hasMenu = computed(() => slots.menu != null)
/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)
const linkRoot = computed(() => resolveNavRoot(props.headingHref, false, customLink.value))
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
      <template #default="{ close, focusRequest }">
        <div class="astryx-side-nav-heading__menu">
          <slot name="menu" :close="close" :focus-request="focusRequest" />
        </div>
      </template>
    </NavDisclosure>
    <component
      :is="linkRoot"
      v-else-if="headingHref"
      class="astryx-side-nav-heading astryx-side-nav-heading--collapsed"
      :href="headingHref"
      :to="customLink != null ? headingHref : undefined"
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

  <NavHeadingSurface
    v-else
    kind="side"
    :as="as"
    :heading="heading"
    :heading-href="headingHref"
    :logo-label="logoLabel"
    :subheading="subheading"
    :subheading-href="subheadingHref"
    :superheading="superheading"
    :superheading-href="superheadingHref"
  >
    <template v-if="hasIcon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="slots.end" #end>
      <slot name="end" />
    </template>
    <template v-if="hasMenu" #menu="scope">
      <slot name="menu" v-bind="scope" />
    </template>
  </NavHeadingSurface>
</template>
