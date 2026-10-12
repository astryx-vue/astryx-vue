<script setup lang="ts" generic="Value">
import type { ComplexSelectorEmits, ComplexSelectorProps, ComplexSelectorSlots, ComplexSelectorState } from './types.js'
import { computed, ref, useId } from 'vue'
import Field from '../Field/Field.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import Popover from '../Popover/Popover.vue'
import Spinner from '../Spinner/Spinner.vue'
import '../../styles/complex-selector.css'

defineOptions({ name: 'AstryxComplexSelector' })

const props = withDefaults(defineProps<ComplexSelectorProps<Value>>(), {
  isDisabled: false,
  isLabelHidden: false,
  isLoading: false,
  isOptional: false,
  isRequired: false,
  placement: 'below',
  size: 'md',
  statusVariant: 'attached',
})

const emit = defineEmits<ComplexSelectorEmits<Value>>()
defineSlots<ComplexSelectorSlots<Value>>()

const model = defineModel<Value>({ required: true })
const messages = useAstryxMessages()
const isOpen = ref(false)
const isPending = ref(false)
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

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown' && !isOpen.value && !props.isDisabled) {
    event.preventDefault()
    isOpen.value = true
  }
}
</script>

<template>
  <Field
    class="astryx-complex-selector-field"
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
    :status-variant="statusVariant"
    :width="width"
  >
    <Popover
      :alignment="'start'"
      :has-auto-focus="true"
      :has-close-button="false"
      :is-enabled="!isDisabled"
      :is-open="isOpen"
      :label="label"
      :padding="3"
      :placement="placement"
      role="dialog"
      @open-change="setOpen"
    >
      <button
        :id="triggerId"
        class="astryx-complex-selector"
        :data-placeholder="hasTriggerLabel ? undefined : ''"
        :data-size="size"
        :data-status="status?.type"
        :aria-busy="isBusy || undefined"
        :aria-expanded="isOpen"
        :aria-invalid="status?.type === 'error' || undefined"
        :aria-labelledby="labelId"
        :aria-required="isRequired || undefined"
        :disabled="isDisabled"
        type="button"
        @keydown="onTriggerKeyDown"
      >
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
        <div :id="contentId" class="astryx-complex-selector-content">
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
