<script setup lang="ts">
import type { ComponentPublicInstance, CSSProperties, StyleValue } from 'vue'
import type { ButtonEmits, ButtonLinkElement, ButtonProps, ButtonRootElement, ButtonSlots } from './types.js'
import { computed, onBeforeUnmount, onMounted, ref, toRaw, useAttrs, useId, useSlots, useTemplateRef } from 'vue'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { provideIconSize } from '../Icon/context.js'
import Icon from '../Icon/Icon.vue'
import { readLayerScoped } from '../layer/scopedProvide.js'
import { isSafeUrl } from '../Link/safeUrl.js'
import { useLinkComponent } from '../LinkProvider/context.js'
import { useSize } from '../SizeContext/SizeContext.js'
import { hasCallerTooltip } from '../Text/cutText.js'
import CutTextTooltip from '../Text/CutTextTooltip.vue'
import { useCutTextOnKeyboardFocus } from '../Text/useCutTextOnKeyboardFocus.js'
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
const group = readLayerScoped(buttonGroupContextKey)
const linkComponent = useLinkComponent()
const renderedRoot = useTemplateRef<ComponentPublicInstance | HTMLElement>('root')
const tooltipId = `astryx-button-tooltip-${useId()}`

const press = usePressFeedback({ hasOverlay: false })
// 显式 size > 按钮组 > 外层 SizeContext（Toolbar 等）> 'md'。
const effectiveSize = useSize(() => props.size ?? group?.size.value)
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
const isTrueDisabled = computed(() => isLocallyDisabled.value)
// 忙碌但未真正禁用：只是动作在飞行中，不能再次触发。按 API 约定，
// 忙碌是视觉状态（aria-busy + spinner），不能夺走焦点；真正去重靠
// useButtonAction 的 pending 守卫，原生 disabled 只会让键盘用户丢焦点。
const isBusyOnlyDisabled = computed(() =>
  !isTrueDisabled.value && isLoadingState.value && !props.isInterruptible,
)
// 同上游 #7906（AST-085）：按钮从不渲染原生 disabled，禁用和忙碌都用 aria-disabled。
// 按钮因此留在 Tab 顺序里，聚焦时变成禁用也不会把焦点丢到 body；所有激活途径
// （鼠标、Enter、Space）由 useButtonAction 和 handleRootKeydown 拦住。
const isButtonDisabled = computed(() => isTrueDisabled.value || isBusyOnlyDisabled.value)
const hasTooltip = computed(() => (props.tooltip?.trim().length ?? 0) > 0)
const safeHref = computed(() => props.href != null && isSafeUrl(props.href) ? props.href : undefined)
// 只有真正禁用才退回 <button>；忙碌时换掉 <a> 同样会让焦点丢失。
const renderAsLink = computed(() => props.href != null && !isTrueDisabled.value)
const rootComponent = computed<ButtonLinkElement | 'button'>(() => {
  if (!renderAsLink.value)
    return 'button'
  // 危险协议不交给自定义路由，退回一个不带地址的锚点。
  if (safeHref.value == null)
    return 'a'
  return toRaw(props.as ?? linkComponent.value ?? 'a')
})
const isCustomLink = computed(() => renderAsLink.value && safeHref.value != null && rootComponent.value !== 'a')
// 同上游 #11107：服务端输出的按钮在 hydration 之前没有点击守卫，而禁用的
// submit / reset 按钮没有原生 disabled，会直接提交或重置表单。挂载前先渲染成普通按钮，
// 服务端和 hydration 的首次渲染一致，挂载后再换回真正的 type。
const isMounted = ref(false)
const renderedType = computed(() =>
  isButtonDisabled.value && !isMounted.value && (props.type === 'submit' || props.type === 'reset')
    ? 'button'
    : props.type,
)
// 首次渲染就处于 loading 时，live region 必须先以空内容挂载，再在下一帧写入文案：
// 许多读屏器会跳过与文字同时出现的 live region，忙碌开始就播报不出来。
const isLiveRegionReady = ref(!isLoadingState.value)
let liveRegionFrame: number | undefined

onMounted(() => {
  isMounted.value = true

  if (isLiveRegionReady.value)
    return

  if (typeof requestAnimationFrame !== 'function') {
    isLiveRegionReady.value = true
    return
  }

  liveRegionFrame = requestAnimationFrame(() => {
    liveRegionFrame = undefined
    isLiveRegionReady.value = true
  })
})

onBeforeUnmount(() => {
  if (liveRegionFrame != null)
    cancelAnimationFrame(liveRegionFrame)
})

const element = computed<ButtonRootElement | null>(() => {
  const root = renderedRoot.value

  if (typeof HTMLElement === 'undefined' || root == null)
    return null

  if (root instanceof HTMLElement)
    return root

  return root.$el instanceof HTMLElement ? root.$el : null
})

const buttonTooltip = useButtonTooltip(hasTooltip)
// 标签被行宽截短时，键盘焦点到达就在提示里显示完整标签；调用方自己的提示优先。
const labelElement = useTemplateRef<HTMLElement>('labelText')
const cutLabel = useCutTextOnKeyboardFocus({
  anchor: () => element.value,
  measure: () => labelElement.value,
  isEnabled: () => !props.isIconOnly && !hasTooltip.value,
  isSuppressed: hasCallerTooltip,
})

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

/**
 * 由 props 就能确定的可访问名称：派生的 aria-label，否则调用方的 aria-label，否则标签文字本身。
 * 调用方用 aria-labelledby 从别处取名时这里不知道名称。图标和 end 插槽都包在 aria-hidden 里，
 * 不会往名称里加字。
 */
const accessibleName = computed(() => {
  if (attrs['aria-labelledby'] != null)
    return undefined

  return ariaLabel.value ?? props.label
})

// 同上游 #9681：提示文字和名称一样时，再挂成描述只会让读屏器把同一句话读两遍。
const isTooltipName = computed(() =>
  hasTooltip.value
  && accessibleName.value != null
  && (props.tooltip ?? '').trim() === accessibleName.value.trim(),
)

const ariaDescribedBy = computed(() => {
  const consumerDescription = attrs['aria-describedby']
  const descriptions = [
    typeof consumerDescription === 'string' ? consumerDescription : undefined,
    hasTooltip.value && !isTooltipName.value ? tooltipId : undefined,
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
  if (event.key === 'Escape') {
    buttonTooltip.hideImmediately()
    cutLabel.hide()
  }

  if (isButtonDisabled.value && (event.key === 'Enter' || event.key === ' ')) {
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
    :aria-disabled="isButtonDisabled || undefined"
    :aria-label="ariaLabel"
    :class="rootClass"
    :data-astryx-edge-comp="variant === 'ghost' ? '' : undefined"
    :data-astryx-has-layer="hasTooltip || undefined"
    :data-delay-spinner="isLoadingState && delaySpinner || undefined"
    :data-elevation="group == null ? elevation : 'none'"
    :data-icon-only="isIconOnly || undefined"
    :data-size="effectiveSize"
    :data-variant="variant"
    :form="renderAsLink ? undefined : form"
    :href="renderAsLink ? safeHref : undefined"
    :name="renderAsLink || isTrueDisabled ? undefined : name"
    :rel="renderAsLink ? rel : undefined"
    :style="rootStyle"
    :target="renderAsLink ? target : undefined"
    :to="isCustomLink ? safeHref : undefined"
    :type="renderAsLink ? undefined : renderedType"
    :value="renderAsLink ? undefined : value"
    @blur="buttonTooltip.onBlur"
    @click="handleRootClick"
    @focus="buttonTooltip.onFocus"
    @focusin="cutLabel.onFocusin"
    @focusout="cutLabel.onFocusout"
    @pointerdown.capture="cutLabel.onPointerdown"
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
        v-if="$slots.icon || icon"
        class="astryx-button__icon"
        aria-hidden="true"
      >
        <slot name="icon">
          <Icon v-if="typeof icon === 'string'" :icon="icon" />
          <component :is="icon" v-else-if="icon" />
        </slot>
      </span>

      <span v-if="!isIconOnly" ref="labelText" class="astryx-button__label">
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
      {{ isLoadingState && isLiveRegionReady ? loadingLabel : '' }}
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

    <CutTextTooltip
      v-if="cutLabel.cutText.value != null"
      :anchor="element"
      :text="cutLabel.cutText.value"
    />
  </component>
</template>
