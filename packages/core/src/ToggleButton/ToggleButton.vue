<script setup lang="ts">
import type { ButtonClickAction, ButtonRootElement } from '../Button/types.js'
import type { ToggleButtonEmits, ToggleButtonProps, ToggleButtonSlots } from './types.js'
import { computed, inject, shallowRef, useTemplateRef } from 'vue'

import Button from '../Button/Button.vue'
import { toggleButtonGroupContextKey } from './context.js'
import '../../styles/toggle-button.css'

defineOptions({ name: 'AstryxToggleButton' })

const props = withDefaults(defineProps<Omit<ToggleButtonProps, 'isPressed'>>(), {
  elevation: 'none',
  isDisabled: false,
  isIconOnly: false,
  isLoading: false,
})

const emit = defineEmits<ToggleButtonEmits>()
defineSlots<ToggleButtonSlots>()

const isPressedModel = defineModel<boolean>('isPressed', { default: false })
const group = inject(toggleButtonGroupContextKey, null)
const button = useTemplateRef<InstanceType<typeof Button>>('button')
const optimisticPressed = shallowRef<boolean | null>(null)
const pendingActions = shallowRef(0)
const pressedIntent = shallowRef(false)

const groupPressed = computed(() => {
  const member = props.value

  if (group == null || member == null)
    return null

  return group.selectedValues.value.has(member)
})

const isPressed = computed(() => groupPressed.value ?? optimisticPressed.value ?? isPressedModel.value)
const isDisabled = computed(() => (group?.isDisabled.value ?? false) || props.isDisabled)
const size = computed(() => props.size ?? group?.size.value ?? 'md')
const element = computed<ButtonRootElement | null>(() => button.value?.element ?? null)

function focus(options?: FocusOptions): void {
  element.value?.focus(options)
}

function blur(): void {
  element.value?.blur()
}

async function runPressedChangeAction(): Promise<void> {
  const action = props.pressedChangeAction

  if (action == null)
    return

  const next = pressedIntent.value
  pendingActions.value += 1
  optimisticPressed.value = next

  try {
    await action(next)
  }
  finally {
    pendingActions.value -= 1

    if (pendingActions.value === 0)
      optimisticPressed.value = null
  }
}

const clickAction = computed<ButtonClickAction | undefined>(() =>
  groupPressed.value != null || props.pressedChangeAction == null
    ? undefined
    : runPressedChangeAction,
)

function handleClick(event: MouseEvent): void {
  if (isDisabled.value) {
    event.preventDefault()
    emit('click', event)
    return
  }

  const member = props.value

  if (group != null && member != null) {
    group.toggle(member)
    event.preventDefault()
    emit('click', event)
    return
  }

  const next = !isPressed.value
  pressedIntent.value = next
  emit('pressedChange', next, event)

  if (!event.defaultPrevented)
    isPressedModel.value = next

  emit('click', event)
}

defineExpose({
  blur,
  element,
  focus,
})
</script>

<template>
  <Button
    ref="button"
    class="astryx-toggle-button"
    :aria-pressed="isPressed ? 'true' : 'false'"
    :data-pressed="isPressed ? 'true' : 'false'"
    :elevation="elevation"
    :is-disabled="isDisabled"
    :is-icon-only="isIconOnly"
    :is-interruptible="true"
    :is-loading="isLoading"
    :label="label"
    :size="size"
    :tooltip="tooltip"
    variant="ghost"
    :click-action="clickAction"
    @click="handleClick"
  >
    <template v-if="$slots.icon || $slots.pressedIcon" #icon>
      <slot v-if="isPressed && $slots.pressedIcon" name="pressedIcon" />
      <slot v-else name="icon" />
    </template>

    <span
      v-if="!isIconOnly"
      class="astryx-toggle-button__label"
    >
      <span class="astryx-toggle-button__label-text">
        <slot>{{ label }}</slot>
      </span>
      <span
        class="astryx-toggle-button__label-reserve"
        aria-hidden="true"
      >
        <slot>{{ label }}</slot>
      </span>
    </span>
  </Button>
</template>
