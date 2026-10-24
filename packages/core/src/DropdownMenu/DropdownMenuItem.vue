<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { DropdownMenuItemEmits, DropdownMenuItemProps, DropdownMenuItemSlots } from './types.js'
import { computed, toRaw, useAttrs, useSlots } from 'vue'
import { isMenuPressActivation } from '../composables/internal/strayClick.js'
import Icon from '../Icon/Icon.vue'
import { useLinkComponent } from '../LinkProvider/context.js'
import Item from '../List/Item.vue'
import { useDropdownMenuContext } from './context.js'
import { isModifiedClick } from './menuItemRoles.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuItem', inheritAttrs: false })

const props = withDefaults(defineProps<DropdownMenuItemProps>(), {
  variant: 'default',
  isDisabled: false,
  hasCloseOnSelect: true,
})

const emit = defineEmits<DropdownMenuItemEmits>()
defineSlots<DropdownMenuItemSlots>()

const attrs = useAttrs()
const slots = useSlots()
const menu = useDropdownMenuContext()
const linkComponent = useLinkComponent()
/** 链接行用的根组件，没有 provider 时还是 `<a>`。 */
const linkRoot = computed(() => (linkComponent.value == null ? 'a' : toRaw(linkComponent.value)))

const menuSize = computed(() => menu?.menuSize.value ?? 'md')
const density = computed(() => (menuSize.value === 'sm' ? 'compact' : 'balanced'))
const isDestructive = computed(() => props.variant === 'destructive')
const isLink = computed(() => props.href != null)
const iconColor = computed(() => (isDestructive.value ? 'inherit' : 'secondary'))

const hasStart = computed(() => slots.icon != null || props.icon != null)
const hasLabel = computed(() => slots.label != null || props.label != null)
const hasDescription = computed(() => slots.description != null || props.description != null)
const hasEnd = computed(() => slots.endContent != null)

const resolvedRel = computed(() => {
  const tokens = new Set((props.rel ?? '').split(/\s+/).filter(Boolean))
  if (props.target === '_blank') {
    tokens.add('noopener')
    tokens.add('noreferrer')
  }
  return tokens.size > 0 ? [...tokens].join(' ') : undefined
})

/** The anchor carries the row itself, so it is never given an unset address. */
const linkHref = computed(() => (props.isDisabled ? undefined : props.href))

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

function handleClick(event: MouseEvent): void {
  if (props.isDisabled) {
    event.preventDefault()
    return
  }
  // A modified click on a link row belongs to the browser: it opens the address
  // its own way. The menu still closes, because the row acted.
  const isBrowserNavigation = isLink.value && isModifiedClick(event)
  // `emit` reaches the `onClick` prop too, so a handler never runs twice.
  if (!isBrowserNavigation)
    emit('click', event)
  followPressActivation(event)
  if (props.hasCloseOnSelect)
    menu?.closeMenu()
}

function followPressActivation(event: MouseEvent): void {
  if (!isMenuPressActivation() || isModifiedClick(event) || linkRoot.value !== 'a')
    return
  const href = props.href
  if (href == null || !(event.currentTarget instanceof HTMLAnchorElement))
    return
  if (props.target === '_blank')
    window.open(href, '_blank', 'noopener,noreferrer')
  else
    window.location.assign(href)
}

function handleAuxClick(event: MouseEvent): void {
  if (props.isDisabled) {
    event.preventDefault()
    return
  }
  // A middle click fires `auxclick`, never `click`; the browser opens the tab
  // and the row only has to close behind it.
  if (props.href == null || event.button !== 1)
    return
  if (props.hasCloseOnSelect)
    menu?.closeMenu()
}

/** Hover moves DOM focus, so exactly one row is ever highlighted. */
function handlePointerMove(event: PointerEvent): void {
  if (props.isDisabled || event.pointerType !== 'mouse')
    return
  const row = event.currentTarget
  if (row instanceof HTMLElement && row !== row.ownerDocument.activeElement)
    row.focus({ preventScroll: true })
}
</script>

<template>
  <!--
    A row that navigates is the link itself. `Item` gives its root an inner
    anchor instead when a `role` is set, which would put two controls in one
    row, so the link row renders the same markup with the anchor as its root.
  -->
  <component
    :is="linkRoot"
    v-if="isLink"
    v-bind="forwardedAttrs"
    class="astryx-item astryx-dropdown-menu-item"
    role="menuitem"
    :aria-disabled="isDisabled || undefined"
    :class="attrs.class"
    data-align="center"
    :data-density="density"
    :data-disabled="isDisabled || undefined"
    :data-interactive="true"
    draggable="false"
    :data-menu-size="menuSize"
    :data-variant="variant"
    :href="linkHref"
    :to="linkRoot !== 'a' && !isDisabled ? linkHref : undefined"
    :rel="resolvedRel"
    :style="attrs.style as StyleValue"
    :tabindex="isDisabled ? undefined : -1"
    :target="target"
    @auxclick="handleAuxClick"
    @click="handleClick"
    @pointermove="handlePointerMove"
  >
    <span v-if="hasStart" class="astryx-item__start">
      <slot name="icon">
        <Icon :color="iconColor" :icon="icon" size="sm" />
      </slot>
    </span>
    <span class="astryx-item__content">
      <span v-if="hasLabel" class="astryx-item__label">
        <slot name="label">
          {{ label }}
        </slot>
      </span>
      <span v-if="hasDescription" class="astryx-item__description">
        <slot name="description">
          {{ description }}
        </slot>
      </span>
    </span>
    <span v-if="hasEnd" class="astryx-item__end">
      <slot name="endContent" />
    </span>
  </component>

  <Item
    v-else
    v-bind="attrs"
    class="astryx-dropdown-menu-item"
    role="menuitem"
    :data-menu-size="menuSize"
    :data-variant="variant"
    :description="description"
    :density="density"
    :is-disabled="isDisabled"
    :label="label"
    :on-click="handleClick"
    :tabindex="isDisabled ? undefined : -1"
    @auxclick="handleAuxClick"
    @pointermove="handlePointerMove"
  >
    <template v-if="hasStart" #startContent>
      <slot name="icon">
        <Icon :color="iconColor" :icon="icon" size="sm" />
      </slot>
    </template>
    <template v-if="slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="slots.description" #description>
      <slot name="description" />
    </template>
    <template v-if="hasEnd" #endContent>
      <slot name="endContent" />
    </template>
  </Item>
</template>
