<script setup lang="ts">
import type { MoreMenuRowProps } from './types.js'
import { computed, onBeforeUnmount, toRaw, useTemplateRef, watch } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useLinkComponent } from '../LinkProvider/context.js'
import { useMoreMenuContext, useMoreMenuLevel } from './context.js'
import { isModifiedClick, isRtl } from './menuNav.js'
import '../../styles/more-menu.css'

defineOptions({ name: 'AstryxMoreMenuRow' })

const props = defineProps<MoreMenuRowProps>()

const menu = useMoreMenuContext()
const linkComponent = useLinkComponent()
/** 有链接时用的根组件，没有 provider 时还是 `<a>`。 */
const linkRoot = computed(() => (linkComponent.value == null ? 'a' : toRaw(linkComponent.value)))
const level = useMoreMenuLevel()
const root = useTemplateRef<HTMLElement>('root')

const HOVER_OPEN_DELAY = 150

const item = computed(() => props.item)
const isDestructive = computed(() => item.value.variant === 'destructive')
const isSubmenu = computed(() => item.value.items != null && item.value.items.length > 0)
const isLink = computed(() => item.value.href != null && !item.value.isDisabled)
const iconColor = computed(() => (isDestructive.value ? 'error' : 'secondary'))
const isFlyoutOpen = computed(() => isSubmenu.value && level?.openRowKey.value === props.rowKey)
const resolvedRel = computed(() => {
  const tokens = new Set((item.value.rel ?? '').split(/\s+/).filter(Boolean))
  if (item.value.target === '_blank') {
    tokens.add('noopener')
    tokens.add('noreferrer')
  }

  return tokens.size > 0 ? [...tokens].join(' ') : undefined
})

let hoverTimer: ReturnType<typeof setTimeout> | undefined

function clearHoverTimer(): void {
  clearTimeout(hoverTimer)
  hoverTimer = undefined
}

function openFlyout(focusFirst: boolean): void {
  if (item.value.isDisabled || !isSubmenu.value)
    return

  level?.openFlyout(props.rowKey, { focusFirst })
}

function closeFlyout(restoreFocus: boolean): void {
  if (!isFlyoutOpen.value)
    return

  level?.closeFlyout({ restoreFocus })
}

function handleClick(event: MouseEvent): void {
  if (item.value.isDisabled) {
    // A disabled row has no address to follow, but a stray click must still not
    // navigate anywhere.
    event.preventDefault()
    return
  }

  if (isSubmenu.value) {
    // A synthesized click carries `detail` 0: the row was activated from the
    // keyboard or by assistive technology, so focus walks into the flyout the
    // way an arrow key opens it, and an already open flyout stays open.
    if (isFlyoutOpen.value) {
      if (event.detail !== 0)
        closeFlyout(true)
      return
    }

    openFlyout(event.detail === 0)
    return
  }

  // A modified click on a link row belongs to the browser: it opens the address
  // its own way, so the row's own handler stays out of it. The menu still
  // closes, because the row acted.
  const isBrowserNavigation = item.value.href != null && isModifiedClick(event)
  if (!isBrowserNavigation)
    item.value.onClick?.(event)

  if (item.value.hasCloseOnSelect !== false)
    menu?.closeMenu()
}

function handleAuxClick(event: MouseEvent): void {
  if (item.value.isDisabled) {
    event.preventDefault()
    return
  }

  // Button 1 is the middle button. A middle click on a link row fires
  // `auxclick`, never `click`, so the row itself never saw it: the browser
  // opened the tab and the menu would otherwise stay open behind it.
  if (item.value.href == null || event.button !== 1)
    return

  if (item.value.hasCloseOnSelect !== false)
    menu?.closeMenu()
}

function handleKeydown(event: KeyboardEvent): void {
  if (item.value.isDisabled || !isSubmenu.value)
    return

  const openKey = isRtl(root.value) ? 'ArrowLeft' : 'ArrowRight'
  const closeKey = isRtl(root.value) ? 'ArrowRight' : 'ArrowLeft'

  if (event.key === openKey || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    // This level fully handles opening the flyout, and a held key's auto-repeat
    // is not a second open.
    event.stopPropagation()
    if (!event.repeat)
      openFlyout(true)
    return
  }

  if (event.key === closeKey && isFlyoutOpen.value) {
    event.preventDefault()
    event.stopPropagation()
    closeFlyout(false)
  }
}

function handlePointerEnter(event: PointerEvent): void {
  if (event.pointerType !== 'mouse' || item.value.isDisabled || !isSubmenu.value)
    return

  clearHoverTimer()
  // Coming back onto the row cancels a close the pointer's own exit scheduled.
  level?.holdFlyout()
  if (isFlyoutOpen.value)
    return

  hoverTimer = setTimeout(openFlyout, HOVER_OPEN_DELAY, false)
}

function handlePointerLeave(): void {
  clearHoverTimer()
  if (isFlyoutOpen.value)
    level?.releaseFlyout()
}

watch(root, (element) => {
  if (element != null)
    level?.registerRow(props.rowKey, element)
})

onBeforeUnmount(() => {
  clearHoverTimer()
  level?.registerRow(props.rowKey, null)
})
</script>

<template>
  <component
    :is="isLink ? linkRoot : 'div'"
    :id="rowId"
    ref="root"
    :aria-disabled="item.isDisabled || undefined"
    :aria-expanded="isSubmenu ? isFlyoutOpen : undefined"
    :aria-haspopup="isSubmenu ? 'menu' : undefined"
    class="astryx-more-menu__item"
    :class="{ 'astryx-more-menu__item--destructive': isDestructive }"
    :data-astryx-menu-row="rowKey"
    :data-disabled="item.isDisabled || undefined"
    :data-submenu="isSubmenu || undefined"
    :href="isLink ? item.href : undefined"
    :to="isLink && linkRoot !== 'a' ? item.href : undefined"
    :rel="isLink ? resolvedRel : undefined"
    role="menuitem"
    :tabindex="item.isDisabled ? undefined : -1"
    :target="isLink ? item.target : undefined"
    @auxclick="handleAuxClick"
    @click="handleClick"
    @keydown="handleKeydown"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <span v-if="item.icon != null" class="astryx-more-menu__item-start">
      <Icon :color="iconColor" :icon="item.icon" size="sm" />
    </span>
    <span class="astryx-more-menu__item-content">
      <span class="astryx-more-menu__item-label" data-astryx-menu-label="">{{ item.label }}</span>
      <span v-if="item.description != null" class="astryx-more-menu__item-description">{{ item.description }}</span>
    </span>
    <span v-if="isSubmenu" class="astryx-more-menu__item-end">
      <Icon class="astryx-more-menu__caret" icon="chevronRight" size="sm" />
    </span>
    <span v-else-if="item.endContent != null" class="astryx-more-menu__item-end">
      <span class="astryx-more-menu__item-hint">{{ item.endContent }}</span>
    </span>
  </component>
</template>
