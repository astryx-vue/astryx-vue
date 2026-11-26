<script setup lang="ts" generic="Value">
import type { Component } from 'vue'
import type { ComplexSelectorEmits, ComplexSelectorHandle, ComplexSelectorProps, ComplexSelectorSlots, ComplexSelectorState, ComplexSelectorTriggerProps } from './types.js'
import { computed, onBeforeUnmount, ref, shallowRef, useAttrs, useId, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { useDevWarning } from '../composables/useDevWarning.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import StatusGlyph from '../Field/StatusGlyph.vue'
import { fieldStatusPlacement } from '../Field/statusPlacement.js'
import Icon from '../Icon/Icon.vue'
import { useLayerGutter } from '../LayerProvider/context.js'
import { useComponentMessages } from '../locale/context.js'
import { selectorMessages } from '../locale/messages/selector.js'
import Popover from '../Popover/Popover.vue'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { normalizeTriggerVariant } from '../selectors/triggerVariant.js'
import Spinner from '../Spinner/Spinner.vue'
import { consumeWhileDisabled } from '../utils/disabledInteraction.js'
import '../../styles/complex-selector.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxComplexSelector', inheritAttrs: false })

const props = withDefaults(defineProps<ComplexSelectorProps<Value>>(), {
  alignment: 'start',
  isDisabled: false,
  isLabelHidden: false,
  isLoading: false,
  isOptional: false,
  isRequired: false,
  placement: 'below',
  size: 'md',
  statusVariant: 'attached',
  variant: 'input',
})

const emit = defineEmits<ComplexSelectorEmits<Value>>()
const slots = defineSlots<ComplexSelectorSlots<Value>>()
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'ComplexSelector',
  props,
  attrs: new Proxy(attrs, {
    get(target, key, receiver) {
      if (key === 'class' || key === 'style')
        return undefined
      return Reflect.get(target, key, receiver)
    },
  }),
  reservedAttrs: ['id', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-busy', 'aria-invalid', 'aria-required', 'disabled'],
})
const triggerVariant = computed(() => normalizeTriggerVariant(props.variant))
const effectiveStatusVariant = computed(() => fieldStatusPlacement(props.variant, props.statusVariant))

const model = defineModel<Value>({ required: true })
const messages = useComponentMessages({ selector: selectorMessages })
const isOpen = ref(false)
const isPending = ref(false)
const contentEl = useTemplateRef<HTMLElement>('contentEl')
useScrollbars(contentEl)
const optimistic = ref<Value | undefined>(undefined)

const uid = useId()
const triggerId = `astryx-complex-selector-${uid}`
const labelId = `${triggerId}-label`
const contentId = `${triggerId}-content`
const disabledId = `${triggerId}-disabled`
const disabledTooltipId = `${triggerId}-disabled-tooltip`
const triggerEl = useTemplateRef<HTMLElement>('triggerEl')
/** 自制触发器的元素：它第一次收到聚焦或指针事件时记下来，禁用说明的提示挂在它上面。 */
const customAnchor = shallowRef<HTMLElement | null>(null)
const tooltipAnchor = computed(() => customAnchor.value ?? triggerEl.value)

/** 有禁用原因时，悬停、键盘聚焦和点按都能读到它。 */
const resolvedDisabledMessage = computed(() => props.disabledMessage?.trim() || undefined)
const showsDisabledMessage = computed(() => props.isDisabled && resolvedDisabledMessage.value != null)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)

/**
 * 内置触发器的状态图标：attached 是普通图标，tooltip 是能聚焦的提示按钮，都顶替箭头的位置；
 * detached 不画，箭头照旧。
 */
const statusGlyph = computed(() => {
  const type = props.status?.type
  if (type == null || effectiveStatusVariant.value === 'detached')
    return undefined
  return type
})
const isTooltipStatus = computed(() => statusGlyph.value != null && effectiveStatusVariant.value === 'tooltip')

/**
 * 内置触发器默认由字段标签命名；调用方给了 aria-label 或 aria-labelledby 就用调用方的。
 */
const builtinLabelledBy = computed(() => {
  const external = attrs['aria-labelledby']
  if (typeof external === 'string' && external !== '')
    return external
  return typeof attrs['aria-label'] === 'string' && attrs['aria-label'] !== '' ? undefined : labelId
})
const builtinLabel = computed(() => typeof attrs['aria-label'] === 'string' && attrs['aria-label'] !== '' ? attrs['aria-label'] : undefined)
const describedBy = computed(() => {
  const external = typeof attrs['aria-describedby'] === 'string' ? attrs['aria-describedby'] : undefined
  return [
    external,
    props.description ? `${triggerId}-description` : undefined,
    props.status?.message ? `${triggerId}-status` : undefined,
    showsDisabledMessage.value ? disabledId : undefined,
  ].filter(Boolean).join(' ') || undefined
})

/**
 * 内容自己的高度上限：480px 和视口扣掉上下空隙之后的高度取小。LayerProvider 的 `inset`
 * 给应用底栏留的空隙也在里面，最后几行不会滚到底栏下面。
 */
const layerGutter = useLayerGutter()
const contentStyles = computed(() => [
  { '--_complex-selector-max-block': `min(480px, calc(100dvh - ${layerGutter.value.blockStart + layerGutter.value.blockEnd}px))` },
  props.contentStyle,
])

const placeholder = computed(() => props.placeholder ?? messages.value.selector.placeholder)
const isBusy = computed(() => props.isLoading || isPending.value)
/** 框里的转圈只是装饰，忙碌由触发器自己念一次。 */
useBusyAnnouncement(isBusy, () => messages.value.selector.loading, triggerEl)
const displayValue = computed(() => (isPending.value && optimistic.value !== undefined ? optimistic.value as Value : model.value))
const hasTriggerLabel = computed(() => props.triggerLabel != null && props.triggerLabel !== '')

const state = computed<ComplexSelectorState>(() => ({
  isOpen: isOpen.value,
  isBusy: isBusy.value,
  triggerId,
  contentId,
}))

function setOpen(next: boolean): void {
  if (props.isDisabled)
    return
  isOpen.value = next
}

async function commit(next: Value): Promise<void> {
  // 弹层在禁用之前就开着时，里面的内容仍可能调用 commit；禁用的字段不改值、不跑 changeAction。
  if (props.isDisabled)
    return
  model.value = next
  emit('change', next)
  if (props.changeAction == null)
    return
  optimistic.value = next
  isPending.value = true
  try {
    await props.changeAction(next)
  }
  finally {
    isPending.value = false
  }
}

function close(): void {
  isOpen.value = false
}

function open(): void {
  if (props.isDisabled)
    return
  isOpen.value = true
}

function toggle(): void {
  if (isOpen.value)
    close()
  else
    open()
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown' && !isOpen.value && !props.isDisabled) {
    event.preventDefault()
    isOpen.value = true
  }
}

/** 内置触发器：先让调用方有机会取消打开，再走自己的开关。 */
/**
 * 禁用态用 `aria-disabled` 表达，触发器仍留在 Tab 序列里（spec:AST-085 FR1）。
 * 原生 `disabled` 不会派发事件，换成 aria 之后要自己挡住指针和按键（FR2）。
 */
function blockedWhileDisabled(event: Event): boolean {
  return consumeWhileDisabled(event, props.isDisabled)
}

function onBuiltinClick(event: MouseEvent): void {
  if (showsDisabledMessage.value)
    disabledTooltip.onTooltipPointerEnter()
  if (blockedWhileDisabled(event))
    return
  emit('click', event)
  // 用户在 preventDefault 里取消了打开，连带拦住 Popover 自己的点击监听。
  if (event.defaultPrevented)
    event.stopImmediatePropagation()
}

/** 内置触发器：内置处理完再透出，每个键都收到。 */
function onBuiltinKeyDown(event: KeyboardEvent): void {
  if (blockedWhileDisabled(event))
    return
  onTriggerKeyDown(event)
  emit('keydown', event)
}

/** 自定义触发器：开关已经做完，点不能取消；内置处理取消的键不外透。 */
function onCustomClick(event: MouseEvent): void {
  event.stopImmediatePropagation()
  if (blockedWhileDisabled(event))
    return
  toggle()
  emit('click', event)
}

function onCustomKeyDown(event: KeyboardEvent): void {
  if (blockedWhileDisabled(event))
    return
  onTriggerKeyDown(event)
  if (!event.defaultPrevented)
    emit('keydown', event)
}

const hasCustomTrigger = computed(() => props.renderTrigger != null || slots.trigger != null)
useDevWarning(
  'ComplexSelector',
  'needs a default slot that renders the picker, for example `<template #default="{ value, commit }"><MyPicker :value="value" @change="commit" /></template>`.',
  () => slots.default == null,
)
useDevWarning(
  'ComplexSelector',
  '`containerClass`/`containerStyle` have no effect on a custom trigger.',
  () => hasCustomTrigger.value && (props.containerClass != null || props.containerStyle != null),
)
useDevWarning(
  'ComplexSelector',
  '`controlClass`/`controlStyle` have no effect on a custom trigger.',
  () => hasCustomTrigger.value && (props.controlClass != null || props.controlStyle != null),
)
// 自定义触发器也是这个字段的控件：和内置触发器一样是弹出对话框的 combobox，
// 必填、禁用、忙碌状态都挂在它上面。combobox 不从内容取名字，所以用 label 命名，
// 调用方给了 aria-label 用调用方的，给了 aria-labelledby 就不再加 aria-label。
function rememberCustomTrigger(event: Event): void {
  if (event.currentTarget instanceof HTMLElement)
    customAnchor.value = event.currentTarget
}

const triggerProps = computed<ComplexSelectorTriggerProps>(() => ({
  'id': triggerId,
  'onClick': onCustomClick,
  'onKeydown': onCustomKeyDown,
  'onFocus': (event: FocusEvent) => {
    rememberCustomTrigger(event)
    disabledTooltip.onFocus(event)
  },
  'onBlur': disabledTooltip.onBlur,
  'onPointerenter': (event: PointerEvent) => {
    rememberCustomTrigger(event)
    disabledTooltip.onPointerEnter()
  },
  'onPointerleave': disabledTooltip.onPointerLeave,
  'aria-describedby': showsDisabledMessage.value ? disabledId : undefined,
  'role': 'combobox',
  'aria-disabled': props.isDisabled ? 'true' : undefined,
  'aria-haspopup': 'dialog',
  'aria-expanded': isOpen.value,
  'aria-controls': isOpen.value ? contentId : undefined,
  'aria-busy': isBusy.value ? true : undefined,
  'aria-required': props.isRequired ? 'true' : undefined,
  'aria-label': customTriggerLabel(),
}))

function customTriggerLabel(): string | undefined {
  const ariaLabel = attrs['aria-label']
  if (typeof ariaLabel === 'string' && ariaLabel !== '')
    return ariaLabel
  return attrs['aria-labelledby'] != null ? undefined : props.label
}
const triggerView: Component = () => props.renderTrigger?.(triggerProps.value) ?? null

const handle: ComplexSelectorHandle = { open, close, toggle, isOpen: () => isOpen.value }

// 任何途径的开/关都从这里透出去。
watch(isOpen, (open) => {
  emit('openChange', open)
})

function publishHandle(value: ComplexSelectorHandle | null): void {
  const target = props.handleRef
  if (target == null)
    return
  if (typeof target === 'function')
    target(value)
  else
    target.value = value
}

watch(() => props.handleRef, (_next, previous) => {
  if (previous != null && previous !== props.handleRef) {
    if (typeof previous === 'function')
      previous(null)
    else
      previous.value = null
  }
  publishHandle(handle)
}, { immediate: true })

onBeforeUnmount(() => publishHandle(null))
defineExpose(handle)
</script>

<template>
  <Popover
    v-if="hasCustomTrigger"
    v-bind="parts.forwardedAttrs()"
    :class="attrs.class"
    :style="attrs.style"
    :alignment="alignment"
    :has-auto-focus="true"
    :has-close-button="false"
    :is-enabled="!isDisabled"
    :is-open="isOpen"
    :label="label"
    :padding="0"
    :placement="placement"
    :width="popupWidth"
    role="dialog"
    @open-change="setOpen"
  >
    <slot name="trigger" v-bind="triggerProps">
      <component :is="triggerView" />
    </slot>
    <span v-if="showsDisabledMessage" :id="disabledId" class="astryx-visually-hidden">{{ resolvedDisabledMessage }}</span>
    <template #content>
      <div :id="contentId" ref="contentEl" class="astryx-complex-selector-content" :class="contentClass" :style="contentStyles">
        <slot
          :close="close"
          :commit="commit"
          :state="state"
          :value="displayValue"
        />
      </div>
    </template>
  </Popover>
  <Field
    v-else
    class="astryx-complex-selector-field"
    :class="[attrs.class, parts.containerClass.value]"
    :style="[attrs.style, parts.containerStyle.value]"
    :data-variant="triggerVariant"
    :description="description"
    :input-id="triggerId"
    :is-disabled="isDisabled"
    :is-label-hidden="isLabelHidden"
    :is-optional="isOptional"
    :is-required="isRequired"
    :label="label"
    :label-id="labelId"
    :label-tooltip="labelTooltip"
    :status="status"
    :status-variant="effectiveStatusVariant"
    :width="width"
  >
    <Popover
      :alignment="alignment"
      :has-auto-focus="true"
      :has-close-button="false"
      :is-enabled="!isDisabled"
      :is-open="isOpen"
      :label="label"
      :padding="0"
      :placement="placement"
      :width="popupWidth"
      role="dialog"
      @open-change="setOpen"
    >
      <!-- eslint-disable-next-line vue-a11y/role-has-required-aria-props -- aria-controls 由 Popover 在打开时写到触发器上。 -->
      <button
        v-bind="parts.forwardedAttrs()"
        :id="triggerId"
        ref="triggerEl"
        class="astryx-complex-selector"
        :class="controlClass"
        :style="controlStyle"
        :data-placeholder="hasTriggerLabel ? undefined : ''"
        :data-size="size"
        :data-status="triggerVariant === 'input' ? status?.type : undefined"
        :data-variant="triggerVariant"
        :aria-busy="isBusy || undefined"
        :aria-expanded="isOpen"
        :aria-invalid="status?.type === 'error' || undefined"
        :aria-disabled="isDisabled || undefined"
        :aria-label="builtinLabel"
        :aria-labelledby="builtinLabelledBy"
        :aria-describedby="describedBy"
        :aria-required="isRequired || undefined"
        role="combobox"
        type="button"
        @click="onBuiltinClick"
        @keydown="onBuiltinKeyDown"
        @focus="disabledTooltip.onFocus"
        @blur="disabledTooltip.onBlur"
        @pointerenter="disabledTooltip.onPointerEnter"
        @pointerleave="disabledTooltip.onPointerLeave"
      >
        <Icon
          v-if="startIcon"
          class="astryx-complex-selector-start"
          color="secondary"
          :icon="startIcon"
          size="sm"
        />
        <span class="astryx-complex-selector-value">{{ hasTriggerLabel ? triggerLabel : placeholder }}</span>
        <Spinner v-if="isBusy" size="sm" aria-hidden="true" />
        <StatusGlyph v-if="statusGlyph && !isTooltipStatus" :type="statusGlyph" />
        <!-- 提示按钮不能套在按钮里，它浮在这块空位上。 -->
        <span v-else-if="isTooltipStatus" class="astryx-complex-selector-status-slot" aria-hidden="true" />
        <Icon
          v-else
          class="astryx-complex-selector-chevron"
          :data-state="isOpen ? 'expanded' : 'collapsed'"
          color="secondary"
          icon="chevronDown"
          size="sm"
        />
      </button>
      <!-- 提示按钮是自己的控件：点它只显示说明，不打开弹层。 -->
      <StatusGlyph
        v-if="isTooltipStatus && statusGlyph"
        class="astryx-complex-selector-status-tip"
        :type="statusGlyph"
        :message="status?.message"
        tooltip
      />
      <span v-if="showsDisabledMessage" :id="disabledId" class="astryx-visually-hidden">{{ resolvedDisabledMessage }}</span>
      <template #content>
        <div :id="contentId" ref="contentEl" class="astryx-complex-selector-content" :class="contentClass" :style="contentStyles">
          <slot
            :close="close"
            :commit="commit"
            :state="state"
            :value="displayValue"
          />
        </div>
      </template>
    </Popover>
  </Field>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="disabledTooltipId"
    :anchor="tooltipAnchor"
    :open="disabledTooltip.isOpen.value"
    :text="resolvedDisabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter"
    @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
</template>
