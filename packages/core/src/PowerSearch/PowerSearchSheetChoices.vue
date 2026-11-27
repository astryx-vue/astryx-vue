<script setup lang="ts">
/**
 * 封闭的选项在弹层里直接列成行：单选用 RadioList，多选用 CheckboxList。弹层里再叠一层下拉菜单，
 * 等于在用户已经身处的表面上又盖一层浮层。分组的无障碍名是字段标签。
 */
import CheckboxList from '../CheckboxList/CheckboxList.vue'
import CheckboxListItem from '../CheckboxList/CheckboxListItem.vue'
import Icon from '../Icon/Icon.vue'
import RadioList from '../Radio/RadioList.vue'
import RadioListItem from '../RadioList/RadioListItem.vue'

defineOptions({ name: 'AstryxPowerSearchSheetChoices' })

defineProps<{
  items: readonly { value: string, label: string, icon?: string }[]
  selected: readonly string[]
  isMultiple?: boolean
  isDisabled?: boolean
  label: string
}>()

const emit = defineEmits<{
  change: [values: string[]]
}>()
</script>

<template>
  <CheckboxList
    v-if="isMultiple"
    :label="label"
    is-label-hidden
    :is-disabled="isDisabled"
    :model-value="[...selected]"
    @update:model-value="(values: unknown) => emit('change', Array.isArray(values) ? values.map(String) : [])"
  >
    <CheckboxListItem v-for="item in items" :key="item.value" :value="item.value" :label="item.label">
      <template v-if="item.icon" #label>
        <span class="astryx-power-search-sheet__choice"><Icon :icon="item.icon" size="sm" aria-hidden="true" />{{ item.label }}</span>
      </template>
    </CheckboxListItem>
  </CheckboxList>
  <RadioList
    v-else
    :label="label"
    is-label-hidden
    :is-disabled="isDisabled"
    :model-value="selected[0] ?? ''"
    @update:model-value="emit('change', [String($event)])"
  >
    <RadioListItem v-for="item in items" :key="item.value" :value="item.value" :label="item.label">
      <template v-if="item.icon" #label>
        <span class="astryx-power-search-sheet__choice"><Icon :icon="item.icon" size="sm" aria-hidden="true" />{{ item.label }}</span>
      </template>
    </RadioListItem>
  </RadioList>
</template>
