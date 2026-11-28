<script setup lang="ts">
import type { SelectableCardEmits, SelectableCardProps, SelectableCardSlots } from './types.js'
import { computed, inject, useTemplateRef } from 'vue'
import Card from '../Card/Card.vue'
import { useClickableContainer } from '../composables/useClickableContainer.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { isImeKeyEvent } from '../utils/ime.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { selectableCardInputKey } from './selectableCardInput.js'
import '../../styles/clickable-card.css'

defineOptions({ name: 'AstryxSelectableCard' })

const props = withDefaults(defineProps<SelectableCardProps>(), {
  elevation: 'none',
  isDisabled: false,
  variant: 'default',
})

const emit = defineEmits<SelectableCardEmits>()
defineSlots<SelectableCardSlots>()

const isSelected = defineModel<boolean>('isSelected', { required: true })

const cardRef = useTemplateRef<{ element: HTMLElement | null }>('card')
const interactiveRef = useTemplateRef<{ element: HTMLElement | null }>('interactive')
const containerRef = computed(() => cardRef.value?.element ?? null)
const controlRef = computed(() => interactiveRef.value?.element ?? null)

function commit(next: boolean): void {
  isSelected.value = next
  emit('change', next)
}

/** 卡片组可以把输入换成单选框：单选框只会选中，再点已选的那张什么都不发生。 */
const groupInput = inject(selectableCardInputKey, null)
const isRadio = computed(() => groupInput?.value.type === 'radio')
const groupName = computed(() => groupInput?.value.name)
const groupValue = computed(() => groupInput?.value.value)

function requestChange(): void {
  if (!isRadio.value)
    commit(!isSelected.value)
  else if (!isSelected.value)
    commit(true)
}

const handlers = useClickableContainer({
  containerRef,
  interactiveRef: controlRef,
  get disabled() {
    return props.isDisabled
  },
  onClick: requestChange,
})

function onSurfaceClick(event: MouseEvent): void {
  if (props.isDisabled)
    return
  handlers.onClick(event)
}

/** 卡片里放着别的控件：手指按在它们上面时卡片不亮。 */
const { pressableProps, pressActionProps } = usePressFeedback({ hasOverlay: false, isContainer: true })

function onKeyDown(event: KeyboardEvent): void {
  if (isImeKeyEvent(event))
    return
  if (props.isDisabled) {
    if (event.key === ' ' || event.key === 'Enter')
      event.preventDefault()
    return
  }
  if (event.key !== 'Enter')
    return
  event.preventDefault()
  requestChange()
}

function onInputChange(event: Event): void {
  if (!isRadio.value) {
    commit((event.target as HTMLInputElement).checked)
    return
  }
  requestChange()
}

/**
 * 同组的单选框都不进表单：每张卡都离开表单，这一组才只占一个 Tab 停靠点；
 * 被禁用的复选框卡片也不提交任何东西。
 */
const formOwner = computed(() => {
  if (groupInput == null)
    return undefined
  return groupInput.value.type === 'radio' || props.isDisabled ? '' : undefined
})
</script>

<template>
  <Card
    ref="card"
    class="astryx-clickable-card astryx-selectable-card"
    :data-disabled="isDisabled || undefined"
    :data-selected="isSelected || undefined"
    :elevation="elevation"
    :height="height"
    :max-width="maxWidth"
    :padding="padding"
    :variant="variant"
    :width="width"
    v-bind="isDisabled ? undefined : pressableProps"
    @click="onSurfaceClick"
  >
    <VisuallyHidden
      ref="interactive"
      as="input"
      :aria-disabled="isDisabled || undefined"
      :aria-label="label"
      :checked="isSelected"
      :type="isRadio ? 'radio' : 'checkbox'"
      :name="groupName"
      :value="groupValue"
      :form="formOwner"
      v-bind="pressActionProps"
      @change="onInputChange"
      @keydown="onKeyDown"
    />
    <slot />
  </Card>
</template>
