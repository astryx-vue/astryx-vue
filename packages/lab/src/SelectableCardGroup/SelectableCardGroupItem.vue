<script setup lang="ts">
import type { SelectableCardGroupItemProps, SelectableCardGroupItemSlots } from './types.js'
import { SelectableCard } from '@astryx-vue/core'
import { selectableCardInputKey } from '@astryx-vue/core/SelectableCard'
import { computed, inject, provide } from 'vue'
import { selectableCardGroupKey } from './types.js'

defineOptions({ name: 'AstryxSelectableCardGroupItem', inheritAttrs: false })

const props = withDefaults(defineProps<SelectableCardGroupItemProps>(), {
  isDisabled: false,
})
defineSlots<SelectableCardGroupItemSlots>()

const group = inject(selectableCardGroupKey, null)
if (group == null)
  throw new Error('SelectableCardGroupItem must be rendered inside a SelectableCardGroup.')

provide(selectableCardInputKey, computed(() => ({
  type: group().inputType,
  name: group().groupName,
  value: props.value,
})))

const isSelected = computed(() => group().isSelected(props.value))
const isCardDisabled = computed(() => group().isDisabled || props.isDisabled)
const showsSubmitInput = computed(() => group().inputType === 'radio' && isSelected.value && !isCardDisabled.value)
</script>

<template>
  <SelectableCard
    v-bind="$attrs"
    :label="label"
    :is-selected="isSelected"
    :is-disabled="isCardDisabled"
    :variant="variant"
    :elevation="elevation"
    :padding="padding"
    :width="width"
    :height="height"
    :max-width="maxWidth"
    @change="group().change(value, $event)"
  >
    <slot />
  </SelectableCard>
  <!-- 单选卡都不进表单，所以选中且可用的那张在这里用隐藏输入提交组的值。 -->
  <input v-if="showsSubmitInput" type="hidden" :name="group().submitName" :value="value">
</template>
