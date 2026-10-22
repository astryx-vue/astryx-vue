<script setup lang="ts">
import type { Component, ComponentPublicInstance, CSSProperties, StyleValue } from 'vue'
import type { ItemProps, ItemSlots } from './types.js'
import { computed, provide, toRaw, toValue, useAttrs, useId, useSlots, useTemplateRef } from 'vue'
import { useInteractiveRole } from '../composables/useInteractiveRole.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useLinkComponent } from '../LinkProvider/context.js'
import { isSafeUrl } from '../utils/safeUrl.js'
import { itemDescriptionContextKey } from './context.js'
import { useItemSwipe } from './useItemSwipe.js'
import '../../styles/list.css'

defineOptions({ name: 'AstryxItem', inheritAttrs: false })

const props = withDefaults(defineProps<ItemProps>(), {
  as: 'div',
  align: 'center',
  density: 'balanced',
  layout: 'stacked',
  isDisabled: false,
  isHighlighted: false,
  isSelected: false,
})

defineSlots<ItemSlots>()

const linkComponent = useLinkComponent()

const ARIA_SELECTED_ROLES = new Set(['option', 'tab', 'row', 'gridcell', 'columnheader', 'rowheader', 'treeitem'])

const NATIVE_CONTROL_SELECTOR = 'button, a, input, select, textarea'

const INTERACTIVE_SELECTOR = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="slider"]',
  '[role="spinbutton"]',
].join(',')

const CONTROLLED_ATTRS = new Set([
  'class',
  'style',
  'role',
  'aria-current',
  'aria-disabled',
  'aria-selected',
])

const attrs = useAttrs()
const slots = useSlots()
const root = useTemplateRef<ComponentPublicInstance | HTMLElement>('root')

function isRenderable(value: ItemProps['label']): boolean {
  return value != null && value !== ''
}

function isInteractiveElement(element: Element): boolean {
  return element.matches(INTERACTIVE_SELECTOR) && !element.matches('[aria-readonly="true"]')
}

function toElement(value: ComponentPublicInstance | HTMLElement | null): HTMLElement | null {
  if (value == null)
    return null

  if (value instanceof HTMLElement)
    return value

  return value.$el instanceof HTMLElement ? value.$el : null
}

const element = computed<HTMLElement | null>(() => toElement(root.value))

const descriptionIdBase = `astryx-item-description-${useId()}`
const hasDescription = computed(() => slots.description != null || isRenderable(props.description))
const hasLabel = computed(() => slots.label != null || isRenderable(props.label))

provide(itemDescriptionContextKey, computed(() => (hasDescription.value ? descriptionIdBase : null)))

const role = computed(() => attrs.role as string | undefined)
const hasParentRole = computed(() => role.value != null)
const allowsAriaSelected = computed(() => role.value != null && ARIA_SELECTED_ROLES.has(role.value))

const ariaCurrent = computed(() =>
  attrs['aria-current'] ?? (props.isSelected && !allowsAriaSelected.value ? true : undefined),
)

const isDelegate = computed(() => props.interactiveRef != null)
/** `javascript:` 这类地址不交给浏览器，行也就不是链接。 */
const safeHref = computed(() => {
  const href = props.href
  return href != null && href !== '' && isSafeUrl(href) ? href : undefined
})
const isInteractive = computed(() => props.onClick != null || safeHref.value != null || isDelegate.value)
/** 链接内容用的根组件：`as` 写了组件就用它，否则用 LinkProvider 给的默认值。 */
const customLink = computed(() => (typeof props.as === 'string' ? linkComponent.value : props.as))
const isLinkContent = computed(() => safeHref.value != null && customLink.value != null)
usePressFeedback()
const pressable = computed(() => isInteractive.value && !props.isDisabled)

const resolvedTarget = computed(() => props.target)
const resolvedRel = computed(() => {
  const tokens = new Set((props.rel ?? '').split(/\s+/).filter(Boolean))

  if (resolvedTarget.value === '_blank') {
    tokens.add('noopener')
    tokens.add('noreferrer')
  }

  return tokens.size > 0 ? [...tokens].join(' ') : undefined
})

const isInline = computed(() => props.layout === 'inline' && hasDescription.value)

function clampClass(lines: number): string | undefined {
  if (lines === 1)
    return 'astryx-item__ellipsis'

  return lines > 1 ? 'astryx-item__clamp' : undefined
}

function clampStyle(lines: number): CSSProperties | undefined {
  return lines > 1 ? { '--astryx-item-clamp-lines': String(lines) } as CSSProperties : undefined
}

const labelClamp = computed(() => props.labelLines ?? (typeof props.label === 'string' ? 1 : 0))
const descriptionClamp = computed(() => {
  if (props.descriptionLines != null)
    return props.descriptionLines

  return typeof props.description === 'string' || isInline.value ? 1 : 0
})

const labelClasses = computed(() => clampClass(labelClamp.value))
const labelStyle = computed(() => clampStyle(labelClamp.value))
const descriptionClasses = computed(() => clampClass(descriptionClamp.value))
const descriptionStyle = computed(() => clampStyle(descriptionClamp.value))

const contentRole = useInteractiveRole({
  href: () => (hasParentRole.value || isDelegate.value ? undefined : safeHref.value),
  hasOnClick: () => !hasParentRole.value && !isDelegate.value && props.onClick != null,
})

const contentTag = computed(() => {
  if (contentRole.role.value === 'link')
    return isLinkContent.value ? toRaw(customLink.value as Component) : 'a'

  return contentRole.role.value === 'button' ? 'button' : 'span'
})

function handleContentClick(event: MouseEvent): void {
  props.onClick?.(event)
}

const contentAttrs = computed<Record<string, unknown>>(() => {
  const href = safeHref.value
  if (href != null && !hasParentRole.value && !isDelegate.value) {
    return {
      'href': href,
      'to': isLinkContent.value ? href : undefined,
      'rel': resolvedRel.value,
      'target': resolvedTarget.value,
      'aria-disabled': props.isDisabled || undefined,
      'tabindex': props.isDisabled ? -1 : undefined,
    }
  }

  if (contentTag.value === 'button') {
    return {
      type: 'button',
      disabled: props.isDisabled,
      onClick: handleContentClick,
    }
  }

  return {}
})

function hasTextSelection(node: HTMLElement): boolean {
  const selection = node.ownerDocument.getSelection?.()

  return (
    selection != null
    && !selection.isCollapsed
    && selection.anchorNode != null
    && node.contains(selection.anchorNode)
  )
}

function hasInteractiveAncestor(target: Element, container: HTMLElement): boolean {
  let current: Element | null = target

  while (current != null && current !== container && current !== container.ownerDocument.body) {
    if (isInteractiveElement(current))
      return true

    current = current.parentElement
  }

  return false
}

function handleContainerClick(event: MouseEvent): void {
  if (props.isDisabled)
    return

  const target = event.target

  if (target instanceof HTMLElement && target.closest(NATIVE_CONTROL_SELECTOR) != null)
    return

  props.onClick?.(event)
}

function handleDelegatedClick(event: MouseEvent): void {
  if (props.isDisabled)
    return

  const container = element.value
  const target = event.target

  if (container == null || !(target instanceof HTMLElement))
    return

  if (hasTextSelection(container))
    return

  if (target !== event.currentTarget && hasInteractiveAncestor(target, container))
    return

  const control = toValue(props.interactiveRef)

  if (control == null)
    return

  control.dispatchEvent(new MouseEvent('click', {
    altKey: event.altKey,
    bubbles: event.bubbles,
    button: event.button,
    cancelable: event.cancelable,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
  }))
  event.stopPropagation()
}

const SWIPE_BLOCKED_ROLES = new Set(['option', 'menuitem', 'menuitemcheckbox', 'menuitemradio'])
const swipeBehavior = computed(() => props.swipeBehavior ?? 'reveal')
const leadingActions = computed(() => {
  const actions = props.swipeActions?.leading ?? []
  return swipeBehavior.value === 'commit' ? actions.slice(-1) : actions
})
const trailingActions = computed(() => {
  const actions = props.swipeActions?.trailing ?? []
  return swipeBehavior.value === 'commit' ? actions.slice(-1) : actions
})
const swipeEnabled = computed(() => {
  if (props.isDisabled || isDelegate.value)
    return false
  if (role.value != null && SWIPE_BLOCKED_ROLES.has(role.value))
    return false
  return leadingActions.value.length + trailingActions.value.length > 0
})
const swipe = useItemSwipe({
  root: element,
  enabled: swipeEnabled,
  behavior: swipeBehavior,
  leading: leadingActions,
  trailing: trailingActions,
})

const rootClick = computed(() => {
  if (isDelegate.value)
    return handleDelegatedClick

  if (hasParentRole.value)
    return props.onClick

  return isInteractive.value ? handleContainerClick : undefined
})

const rootClass = computed(() => ['astryx-item', swipeEnabled.value && 'astryx-item--swipe', pressable.value && 'astryx-pressable', attrs.class])

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => !CONTROLLED_ATTRS.has(key)),
))

function focus(options?: FocusOptions): void {
  const control = element.value?.querySelector<HTMLElement>('a[href], button:not([disabled])')
  control?.focus(options)
}

function blur(): void {
  const active = element.value?.ownerDocument.activeElement

  if (active instanceof HTMLElement && element.value?.contains(active))
    active.blur()
}

defineExpose({ element, focus, blur })
</script>

<template>
  <component
    :is="as"
    ref="root"
    v-bind="forwardedAttrs"
    :aria-current="ariaCurrent"
    :aria-disabled="isDisabled || undefined"
    :aria-selected="allowsAriaSelected && isSelected ? true : undefined"
    :class="rootClass"
    :data-align="align"
    :data-density="density"
    :data-disabled="isDisabled || undefined"
    :data-highlighted="isHighlighted || undefined"
    :data-inert="isDisabled && !hasParentRole ? true : undefined"
    :data-interactive="isInteractive || undefined"
    :data-selected="isSelected || undefined"
    :data-astryx-pressable="pressable ? '' : undefined"
    :data-swipe="swipeEnabled ? swipe.phase.value : undefined"
    :role="role"
    :style="attrs.style as StyleValue"
    @pointerdown="swipe.onPointerDown"
    @click.capture="swipe.onClickCapture"
    @keydown="swipe.onKeyDown"
    @click="rootClick"
  >
    <template v-if="swipeEnabled">
      <div v-if="leadingActions.length" class="astryx-item__swipe-panel" data-side="leading" :inert="swipe.phase.value === 'resting' ? undefined : true">
        <button
          v-for="action in leadingActions"
          :key="action.id ?? action.label"
          type="button"
          class="astryx-item__swipe-action"
          :data-variant="action.variant ?? 'neutral'"
          :disabled="action.isDisabled"
          @click.stop="swipe.activate(action)"
        >
          <component :is="action.icon" v-if="action.icon" aria-hidden="true" />
          <span>{{ action.label }}</span>
        </button>
      </div>
      <div v-if="trailingActions.length" class="astryx-item__swipe-panel" data-side="trailing" :inert="swipe.phase.value === 'resting' ? undefined : true">
        <button
          v-for="action in trailingActions"
          :key="action.id ?? action.label"
          type="button"
          class="astryx-item__swipe-action"
          :data-variant="action.variant ?? 'neutral'"
          :disabled="action.isDisabled"
          @click.stop="swipe.activate(action)"
        >
          <component :is="action.icon" v-if="action.icon" aria-hidden="true" />
          <span>{{ action.label }}</span>
        </button>
      </div>
    </template>
    <div v-if="swipeEnabled" class="astryx-item__surface">
      <slot name="marker" />
      <span v-if="$slots.startContent" class="astryx-item__start">
        <slot name="startContent" />
      </span>
      <component
        :is="contentTag"
        v-bind="contentAttrs"
        class="astryx-item__content"
        :class="{ 'astryx-item__content--inline': isInline }"
      >
        <span
          v-if="hasLabel"
          class="astryx-item__label"
          :class="labelClasses"
          :style="labelStyle"
        >
          <slot name="label">{{ label }}</slot>
        </span>
        <span
          v-if="hasDescription"
          :id="descriptionIdBase"
          class="astryx-item__description"
          :class="descriptionClasses"
          :style="descriptionStyle"
        >
          <slot name="description">{{ description }}</slot>
        </span>
      </component>
      <span v-if="$slots.endContent" class="astryx-item__end">
        <slot name="endContent" />
      </span>
    </div>
    <template v-else>
      <slot name="marker" />
      <span v-if="$slots.startContent" class="astryx-item__start">
        <slot name="startContent" />
      </span>
      <component
        :is="contentTag"
        v-bind="contentAttrs"
        class="astryx-item__content"
        :class="{ 'astryx-item__content--inline': isInline }"
      >
        <span
          v-if="hasLabel"
          class="astryx-item__label"
          :class="labelClasses"
          :style="labelStyle"
        >
          <slot name="label">{{ label }}</slot>
        </span>
        <span
          v-if="hasDescription"
          :id="descriptionIdBase"
          class="astryx-item__description"
          :class="descriptionClasses"
          :style="descriptionStyle"
        >
          <slot name="description">{{ description }}</slot>
        </span>
      </component>
      <span v-if="$slots.endContent" class="astryx-item__end">
        <slot name="endContent" />
      </span>
    </template>
  </component>
</template>
