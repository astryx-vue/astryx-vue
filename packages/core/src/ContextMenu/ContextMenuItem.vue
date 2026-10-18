<script setup lang="ts">
import type { ContextMenuItemEmits, ContextMenuItemProps, ContextMenuItemSlots } from './types.js'
import { computed, toRaw, useTemplateRef } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useLinkComponent } from '../LinkProvider/context.js'
import { useContextMenu, useContextMenuSize } from './context.js'
import { isModifiedClick } from './menuNav.js'
import '../../styles/context-menu.css'

defineOptions({ name: 'AstryxContextMenuItem' })

const props = withDefaults(defineProps<ContextMenuItemProps>(), {
  isDisabled: false,
  hasCloseOnSelect: true,
  variant: 'default',
})

const emit = defineEmits<ContextMenuItemEmits>()
defineSlots<ContextMenuItemSlots>()

const menu = useContextMenu()
const linkComponent = useLinkComponent()
/** 有链接时用的根组件，没有 provider 时还是 `<a>`。 */
const linkRoot = computed(() => (linkComponent.value == null ? 'a' : toRaw(linkComponent.value)))
const size = useContextMenuSize()
const root = useTemplateRef<HTMLElement>('root')

const isDestructive = computed(() => props.variant === 'destructive')
const iconColor = computed(() => (isDestructive.value ? 'error' : 'secondary'))

function handleClick(event: MouseEvent): void {
  if (props.isDisabled) {
    // A disabled link row has no address to follow, but a stray click must
    // still navigate nowhere.
    event.preventDefault()
    return
  }
  // A modified click on a link row belongs to the browser: it opens the
  // address its own way, so the row's own handler stays out of it. The menu
  // still closes, because the row acted.
  const isBrowserNavigation = props.href != null && isModifiedClick(event)
  if (!isBrowserNavigation)
    emit('click', event)
  if (props.hasCloseOnSelect)
    menu?.closeMenu()
}

function handleAuxClick(event: MouseEvent): void {
  if (props.isDisabled) {
    event.preventDefault()
    return
  }
  // Button 1 is the middle button. A middle click on a link row fires
  // `auxclick`, never `click`, so the row's own handler never sees it: the
  // browser opened the tab and the menu would otherwise stay open behind it.
  if (props.href == null || event.button !== 1)
    return
  if (props.hasCloseOnSelect)
    menu?.closeMenu()
}

function handlePointerMove(event: PointerEvent): void {
  if (props.isDisabled || event.pointerType !== 'mouse')
    return
  const element = root.value
  if (element == null || element === element.ownerDocument.activeElement)
    return
  // Not scrolling: focusing an off-screen row scrolls it under a stationary
  // pointer, whose next move focuses it again.
  element.focus({ preventScroll: true })
}
</script>

<template>
  <component
    :is="href != null ? linkRoot : 'div'"
    ref="root"
    :aria-disabled="isDisabled || undefined"
    class="astryx-context-menu-item"
    :class="{ 'astryx-context-menu-item--destructive': isDestructive }"
    :data-disabled="isDisabled || undefined"
    :data-size="size"
    :data-variant="variant"
    :href="href"
    :to="href != null && linkRoot !== 'a' ? href : undefined"
    :rel="rel"
    role="menuitem"
    :tabindex="isDisabled ? undefined : -1"
    :target="target"
    @auxclick="handleAuxClick"
    @click="handleClick"
    @pointermove="handlePointerMove"
  >
    <span v-if="icon != null || $slots.icon" class="astryx-context-menu-item__start">
      <slot name="icon">
        <Icon :color="iconColor" :icon="icon" size="sm" />
      </slot>
    </span>
    <span class="astryx-context-menu-item__content">
      <span class="astryx-context-menu-item__label" data-menu-item-label>
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        v-if="description != null || $slots.description"
        class="astryx-context-menu-item__description"
      >
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
    <span v-if="endContent != null || $slots.endContent" class="astryx-context-menu-item__end">
      <slot name="endContent">{{ endContent }}</slot>
    </span>
  </component>
</template>
