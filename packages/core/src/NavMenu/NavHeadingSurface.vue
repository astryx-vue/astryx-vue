<script setup lang="ts">
import type { NavLinkComponent } from '../NavItem/types.js'
import type { NavMenuFocusRequest } from './context.js'
import { computed, useSlots } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useLinkComponent } from '../LinkProvider/context.js'
import { useAstryxMessages } from '../locale/index.js'
import { resolveNavRoot, safeNavHref } from '../NavItem/link.js'
import NavDisclosure from './NavDisclosure.vue'
import { resolveNavHeadingMode } from './navHeadingMode.js'
import NavHeadingText from './NavHeadingText.vue'

defineOptions({ name: 'AstryxNavHeadingSurface' })

const props = defineProps<{
  kind: 'top' | 'side'
  heading?: string
  headingHref?: string
  superheading?: string
  superheadingHref?: string
  subheading?: string
  subheadingHref?: string
  as?: NavLinkComponent
  /** 标志单独成链接、旁边没有可读文字时的无障碍名称。缺省用标题。 */
  logoLabel?: string
}>()

defineSlots<{
  icon?: () => unknown
  end?: () => unknown
  menu?: (props: { close: () => void, focusRequest: NavMenuFocusRequest }) => unknown
}>()

const slots = useSlots()
const messages = useAstryxMessages()
const linkComponent = useLinkComponent()
/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)
const block = computed(() => props.kind === 'top' ? 'astryx-top-nav-heading' : 'astryx-side-nav-heading')
const hasMenu = computed(() => slots.menu != null)
const safeHeadingHref = computed(() => safeNavHref(props.headingHref))
const safeSuperheadingHref = computed(() => safeNavHref(props.superheadingHref))
const safeSubheadingHref = computed(() => safeNavHref(props.subheadingHref))
const mode = computed(() => resolveNavHeadingMode({
  hasHeading: Boolean(props.heading),
  hasMenu: hasMenu.value,
  headingHref: safeHeadingHref.value,
  superheadingHref: safeSuperheadingHref.value,
  subheadingHref: safeSubheadingHref.value,
}))
const headingRoot = computed(() => resolveNavRoot(safeHeadingHref.value, false, customLink.value))
const logoName = computed(() => props.logoLabel || props.heading)
const logoIsLink = computed(() => Boolean(safeHeadingHref.value) && mode.value !== 'whole-link' && mode.value !== 'logo')

const textProps = computed(() => ({
  as: customLink.value,
  block: block.value,
  heading: props.heading,
  headingHref: safeHeadingHref.value,
  subheading: props.subheading,
  subheadingHref: safeSubheadingHref.value,
  superheading: props.superheading,
  superheadingHref: safeSuperheadingHref.value,
}))
</script>

<template>
  <component
    :is="safeHeadingHref ? headingRoot : 'div'"
    v-if="mode === 'logo'"
    :class="[block, { [`${block}--link`]: safeHeadingHref }]"
    :href="safeHeadingHref"
    :to="safeHeadingHref && customLink != null ? safeHeadingHref : undefined"
    :aria-label="safeHeadingHref ? logoName : undefined"
  >
    <span v-if="$slots.icon" :class="`${block}__icon`">
      <slot name="icon" />
    </span>
  </component>

  <component
    :is="headingRoot"
    v-else-if="mode === 'whole-link'"
    :class="[block, `${block}--link`]"
    :href="safeHeadingHref"
    :to="safeHeadingHref && customLink != null ? safeHeadingHref : undefined"
  >
    <span v-if="$slots.icon" :class="`${block}__icon`">
      <slot name="icon" />
    </span>
    <NavHeadingText v-bind="textProps" />
    <span v-if="$slots.end" :class="`${block}__end`">
      <slot name="end" />
    </span>
  </component>

  <NavDisclosure
    v-else-if="mode === 'trigger' || mode === 'mixed'"
    hover
    :label="heading || logoName"
    :panel-class="`${block}__panel`"
  >
    <template #trigger="{ isOpen, panelId }">
      <div :class="block" :data-open="isOpen || undefined">
        <component
          :is="headingRoot"
          v-if="logoIsLink && $slots.icon"
          :class="`${block}__icon`"
          :href="safeHeadingHref"
          :to="safeHeadingHref && customLink != null ? safeHeadingHref : undefined"
          :aria-label="logoName"
          @click.stop
        >
          <slot name="icon" />
        </component>
        <span v-else-if="$slots.icon" :class="`${block}__icon`">
          <slot name="icon" />
        </span>
        <NavHeadingText v-bind="textProps" :independent="mode === 'mixed'">
          <template #chevron>
            <button
              type="button"
              :class="`${block}__chevron`"
              :aria-label="messages.nav.openMenu"
              :aria-expanded="isOpen ? 'true' : 'false'"
              :aria-controls="panelId"
              aria-haspopup="menu"
            >
              <Icon icon="chevronDown" size="sm" :class="{ [`${block}__chevron-icon--open`]: isOpen }" />
            </button>
          </template>
        </NavHeadingText>
        <span v-if="$slots.end" :class="`${block}__end`">
          <slot name="end" />
        </span>
      </div>
    </template>
    <template #default="{ close, focusRequest }">
      <button type="button" :class="[block, `${block}--echo`]" @click="close()">
        <span v-if="$slots.icon" :class="`${block}__icon`">
          <slot name="icon" />
        </span>
        <NavHeadingText v-bind="textProps">
          <template #chevron>
            <span :class="`${block}__chevron`" aria-hidden="true">
              <Icon icon="chevronDown" size="sm" :class="`${block}__chevron-icon--open`" />
            </span>
          </template>
        </NavHeadingText>
      </button>
      <div :class="`${block}__menu`">
        <slot name="menu" :close="close" :focus-request="focusRequest" />
      </div>
    </template>
  </NavDisclosure>

  <div v-else :class="block">
    <component
      :is="headingRoot"
      v-if="logoIsLink && $slots.icon"
      :class="`${block}__icon`"
      :href="safeHeadingHref"
      :to="safeHeadingHref && customLink != null ? safeHeadingHref : undefined"
      :aria-label="logoName"
    >
      <slot name="icon" />
    </component>
    <span v-else-if="$slots.icon" :class="`${block}__icon`">
      <slot name="icon" />
    </span>
    <NavHeadingText v-bind="textProps" :independent="mode === 'links'" />
    <span v-if="$slots.end" :class="`${block}__end`">
      <slot name="end" />
    </span>
  </div>
</template>
