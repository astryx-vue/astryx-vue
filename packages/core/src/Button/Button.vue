<script setup lang="ts">
import type { ComponentPublicInstance, CSSProperties, StyleValue } from 'vue'
import type { ButtonEmits, ButtonLinkElement, ButtonProps, ButtonRootElement, ButtonSlots } from './types.js'
import { computed, inject, toRaw, useAttrs, useId, useSlots, useTemplateRef } from 'vue'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { provideIconSize } from '../Icon/context.js'
import { isSafeUrl } from '../Link/safeUrl.js'
import { useLinkComponent } from '../LinkProvider/context.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import ButtonSpinner from './ButtonSpinner.vue'
import ButtonTooltip from './ButtonTooltip.vue'
import { buttonGroupContextKey } from './context.js'
import { invokeNativeEventHandler } from './eventHandlers.js'
import { useButtonAction } from './useButtonAction.js'
import { useButtonTooltip } from './useButtonTooltip.js'
import '../../styles/button.css'

defineOptions({
  name: 'AstryxButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonProps>(), {
  elevation: 'none',
  isDisabled: false,
  isIconOnly: false,
  isInterruptible: false,
  isLoading: false,
  loadingLabel: 'Loading',
  type: 'button',
  variant: 'secondary',
})

const emit = defineEmits<ButtonEmits>()
defineSlots<ButtonSlots>()

const attrs = useAttrs()
const slots = useSlots()
const group = inject(buttonGroupContextKey, null)
const linkComponent = useLinkComponent()
const renderedRoot = useTemplateRef<ComponentPublicInstance | HTMLElement>('root')
const tooltipId = `astryx-button-tooltip-${useId()}`

const press = usePressFeedback({ hasOverlay: false })
const effectiveSize = computed(() => props.size ?? group?.size.value ?? 'md')
/** 小、中按钮里的图标是 16px，大按钮是 20px。插槽里没写尺寸的图标跟着走。 */
provideIconSize(computed(() => effectiveSize.value === 'lg' ? 'md' : 'sm'))
const isGroupDisabled = computed(() => group?.isDisabled.value ?? false)
const isLocallyDisabled = computed(() => props.isDisabled || isGroupDisabled.value)
const isInterruptible = computed(() => props.isInterruptible)
const explicitLoading = computed(() => props.isLoading)

const action = useButtonAction({
  clickAction: () => props.clickAction,
  emitClick: event => emit('click', event),
  isDisabled: isLocallyDisabled,
  isInterruptible,
  isLoading: explicitLoading,
})

const isLoadingState = computed(() => props.isLoading || action.isPending.value)
const delaySpinner = computed(() => action.isPending.value || props.isInterruptible)
const isDisabledState = computed(() =>
  isLocallyDisabled.value || (isLoadingState.value && !props.isInterruptible),
)
const hasTooltip = computed(() => (props.tooltip?.trim().length ?? 0) > 0)
const useAriaDisabled = computed(() => hasTooltip.value && isDisabledState.value)
const safeHref = computed(() => props.href != null && isSafeUrl(props.href) ? props.href : undefined)
const renderAsLink = computed(() => props.href != null && !isDisabledState.value)
const rootComponent = computed<ButtonLinkElement | 'button'>(() => {
  if (!renderAsLink.value)
    return 'button'
  // 危险协议不交给自定义路由，退回一个不带地址的锚点。
  if (safeHref.value == null)
    return 'a'
  return toRaw(props.as ?? linkComponent.value ?? 'a')
})
const isCustomLink = computed(() => renderAsLink.value && safeHref.value != null && rootComponent.value !== 'a')
const nativeDisabled = computed(() =>
  !renderAsLink.value && !useAriaDisabled.value && isDisabledState.value,
)

const element = computed<ButtonRootElement | null>(() => {
  const root = renderedRoot.value

  if (typeof HTMLElement === 'undefined' || root == null)
    return null

  if (root instanceof HTMLElement)
    return root

  return root.$el instanceof HTMLElement ? root.$el : null
})

const buttonTooltip = useButtonTooltip(hasTooltip)

const rootClass = computed(() => ['astryx-button', attrs.class])

interface ButtonInlineStyle extends CSSProperties {
  '--astryx-button-width'?: string
}

const rootStyle = computed<StyleValue>(() => {
  const buttonStyle: ButtonInlineStyle = {}

  if (props.width != null)
    buttonStyle['--astryx-button-width'] = typeof props.width === 'number' ? `${props.width}px` : props.width

  return [attrs.style as StyleValue, buttonStyle]
})

const ariaLabel = computed(() => {
  const needsLabel = props.isIconOnly || isLoadingState.value || slots.default != null

  if (needsLabel)
    return props.label || undefined

  return attrs['aria-label'] as string | undefined
})

const ariaDescribedBy = computed(() => {
  const consumerDescription = attrs['aria-describedby']
  const descriptions = [
    typeof consumerDescription === 'string' ? consumerDescription : undefined,
    hasTooltip.value ? tooltipId : undefined,
  ].filter(Boolean)

  return descriptions.length > 0 ? descriptions.join(' ') : undefined
})

const controlledAttrs = new Set([
  'aria-busy',
  'aria-describedby',
  'aria-disabled',
  'aria-label',
  'class',
  'disabled',
  'onClick',
  'onKeyDown',
  'onKeydown',
  'style',
])

function getForwardedAttrs(): Record<string, unknown> {
  return {
    ...Object.fromEntries(
      Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)),
    ),
    ...press.pressableProps,
  }
}

function handleRootClick(event: MouseEvent): Promise<void> | void {
  return action.handleClick(event)
}

function handleRootKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    buttonTooltip.hideImmediately()

  if (useAriaDisabled.value && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    return
  }

  invokeNativeEventHandler(attrs.onKeydown ?? attrs.onKeyDown, event)
}

defineExpose({
  element,
})
</script>

<template>
  <component
    :is="rootComponent"
    ref="root"
    v-bind="getForwardedAttrs()"
    :aria-busy="isLoadingState || undefined"
    :aria-describedby="ariaDescribedBy"
    :aria-disabled="useAriaDisabled || undefined"
    :aria-label="ariaLabel"
    :class="rootClass"
    :data-astryx-edge-comp="variant === 'ghost' ? '' : undefined"
    :data-delay-spinner="isLoadingState && delaySpinner || undefined"
    :data-elevation="group == null ? elevation : 'none'"
    :data-icon-only="isIconOnly || undefined"
    :data-size="effectiveSize"
    :data-variant="variant"
    :disabled="nativeDisabled || undefined"
    :form="renderAsLink ? undefined : form"
    :href="renderAsLink ? safeHref : undefined"
    :name="renderAsLink ? undefined : name"
    :rel="renderAsLink ? rel : undefined"
    :style="rootStyle"
    :target="renderAsLink ? target : undefined"
    :to="isCustomLink ? safeHref : undefined"
    :type="renderAsLink ? undefined : type"
    :value="renderAsLink ? undefined : value"
    @blur="buttonTooltip.onBlur"
    @click="handleRootClick"
    @focus="buttonTooltip.onFocus"
    @keydown="handleRootKeydown"
    @pointerdown="buttonTooltip.onPointerDown"
    @pointerenter="buttonTooltip.onPointerEnter"
    @pointerleave="buttonTooltip.onPointerLeave"
  >
    <span
      v-if="isLoadingState"
      class="astryx-button__spinner-overlay"
      aria-hidden="true"
    >
      <ButtonSpinner :label="loadingLabel" />
    </span>

    <span
      class="astryx-button__content"
      :aria-hidden="isLoadingState || undefined"
    >
      <span
        v-if="$slots.icon"
        class="astryx-button__icon"
        aria-hidden="true"
      >
        <slot name="icon" />
      </span>

      <span v-if="!isIconOnly" class="astryx-button__label">
        <slot>{{ label }}</slot>
      </span>

      <span
        v-if="!isIconOnly && $slots.end"
        class="astryx-button__end"
        aria-hidden="true"
      >
        <slot name="end" />
      </span>
    </span>

    <VisuallyHidden role="status" aria-live="polite">
      {{ isLoadingState ? loadingLabel : '' }}
    </VisuallyHidden>

    <ButtonTooltip
      v-if="hasTooltip"
      :id="tooltipId"
      :anchor="element"
      :open="buttonTooltip.isOpen.value"
      :text="tooltip ?? ''"
      @pointer-enter="buttonTooltip.onTooltipPointerEnter"
      @pointer-leave="buttonTooltip.onTooltipPointerLeave"
    />
  </component>
</template>
