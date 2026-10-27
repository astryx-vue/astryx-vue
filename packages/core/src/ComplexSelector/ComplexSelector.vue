<script setup lang="ts" generic="Value">
import type { Component } from 'vue'
import type { ComplexSelectorEmits, ComplexSelectorHandle, ComplexSelectorProps, ComplexSelectorSlots, ComplexSelectorState, ComplexSelectorTriggerProps } from './types.js'
import { computed, onBeforeUnmount, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useDevWarning } from '../composables/useDevWarning.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import { fieldStatusPlacement } from '../Field/statusPlacement.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import Popover from '../Popover/Popover.vue'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { normalizeTriggerVariant } from '../selectors/triggerVariant.js'
import Spinner from '../Spinner/Spinner.vue'
import '../../styles/complex-selector.css'

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
  reservedAttrs: ['id', 'role', 'aria-label', 'aria-labelledby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-busy', 'aria-invalid', 'aria-required', 'disabled'],
})
const triggerVariant = computed(() => normalizeTriggerVariant(props.variant))
const effectiveStatusVariant = computed(() => fieldStatusPlacement(props.variant, props.statusVariant))

const model = defineModel<Value>({ required: true })
const messages = useAstryxMessages()
const isOpen = ref(false)
const isPending = ref(false)
const contentEl = useTemplateRef<HTMLElement>('contentEl')
useScrollbars(contentEl)
const optimistic = ref<Value | undefined>(undefined)

const uid = useId()
const triggerId = `astryx-complex-selector-${uid}`
const labelId = `${triggerId}-label`
const contentId = `${triggerId}-content`

const placeholder = computed(() => props.placeholder ?? messages.value.selector.placeholder)
const isBusy = computed(() => props.isLoading || isPending.value)
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
function onBuiltinClick(event: MouseEvent): void {
  emit('click', event)
  // 用户在 preventDefault 里取消了打开，连带拦住 Popover 自己的点击监听。
  if (event.defaultPrevented)
    event.stopImmediatePropagation()
}

/** 内置触发器：内置处理完再透出，每个键都收到。 */
function onBuiltinKeyDown(event: KeyboardEvent): void {
  onTriggerKeyDown(event)
  emit('keydown', event)
}

/** 自定义触发器：开关已经做完，点不能取消；内置处理取消的键不外透。 */
function onCustomClick(event: MouseEvent): void {
  event.stopImmediatePropagation()
  toggle()
  emit('click', event)
}

function onCustomKeyDown(event: KeyboardEvent): void {
  onTriggerKeyDown(event)
  if (!event.defaultPrevented)
    emit('keydown', event)
}

const hasCustomTrigger = computed(() => props.renderTrigger != null || slots.trigger != null)
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
const triggerProps = computed<ComplexSelectorTriggerProps>(() => ({
  'id': triggerId,
  'onClick': onCustomClick,
  'onKeydown': onCustomKeyDown,
  'aria-haspopup': 'dialog',
  'aria-expanded': isOpen.value,
  'aria-controls': isOpen.value ? contentId : undefined,
  'aria-busy': isBusy.value ? true : undefined,
  'aria-label': props.label,
}))
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
    role="dialog"
    @open-change="setOpen"
  >
    <slot name="trigger" v-bind="triggerProps">
      <component :is="triggerView" />
    </slot>
    <template #content>
      <div :id="contentId" ref="contentEl" class="astryx-complex-selector-content" :class="contentClass" :style="contentStyle">
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
      role="dialog"
      @open-change="setOpen"
    >
      <button
        v-bind="parts.forwardedAttrs()"
        :id="triggerId"
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
        :aria-labelledby="labelId"
        :aria-required="isRequired || undefined"
        :disabled="isDisabled"
        type="button"
        @click="onBuiltinClick"
        @keydown="onBuiltinKeyDown"
      >
        <Icon
          v-if="startIcon"
          class="astryx-complex-selector-start"
          color="secondary"
          :icon="startIcon"
          size="sm"
        />
        <span class="astryx-complex-selector-value">{{ hasTriggerLabel ? triggerLabel : placeholder }}</span>
        <Spinner v-if="isBusy" size="sm" />
        <Icon
          class="astryx-complex-selector-chevron"
          :data-state="isOpen ? 'expanded' : 'collapsed'"
          color="secondary"
          icon="chevronDown"
          size="sm"
        />
      </button>
      <template #content>
        <div :id="contentId" ref="contentEl" class="astryx-complex-selector-content" :class="contentClass" :style="contentStyle">
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
</template>
