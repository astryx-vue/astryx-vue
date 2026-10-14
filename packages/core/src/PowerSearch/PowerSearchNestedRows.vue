<script setup lang="ts">
import type { EditableFilter } from './complete.js'
import type { PowerSearchConfig } from './types.js'
import { computed } from 'vue'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/context.js'
import Selector from '../Selector/Selector.vue'
import { createPowerSearchLookup } from './config.js'
import { resolveOperatorLabel } from './operators.js'
import PowerSearchValueField from './PowerSearchValueField.vue'

defineOptions({ name: 'AstryxPowerSearchNestedRows' })

const props = defineProps<{
  config: PowerSearchConfig
  modelValue: readonly EditableFilter[]
  disabled?: boolean
  timeZone?: string
  maxMenuItems?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [rows: EditableFilter[]]
}>()

const messages = useAstryxMessages()
const lookup = computed(() => createPowerSearchLookup(props.config))
const text = computed(() => messages.value.powerSearch)

const fieldOptions = computed(() => lookup.value.getVisibleFields().map(field => ({
  value: field.key,
  label: field.label,
})))

function operatorOptions(fieldKey: string) {
  return lookup.value.getVisibleOperators(fieldKey).map(operator => ({
    value: operator.key,
    label: resolveOperatorLabel(operator, messages.value.powerSearch),
  }))
}

function operatorOf(row: EditableFilter) {
  if (row.operator == null)
    return undefined
  return lookup.value.getOperator(row.field, row.operator)
}

function replace(index: number, next: EditableFilter): void {
  const rows = props.modelValue.map((row, rowIndex) => rowIndex === index ? next : row)
  emit('update:modelValue', [...rows])
}

function onField(index: number, fieldKey: string | number | null): void {
  const key = String(fieldKey ?? '')
  if (key === '')
    return
  const operator = lookup.value.getDefaultOperator(key)
  replace(index, {
    field: key,
    operator: operator?.key,
    children: operator?.value.type === 'nested' ? [] : undefined,
  })
}

function onOperator(index: number, row: EditableFilter, operatorKey: string | number | null): void {
  const key = String(operatorKey ?? '')
  const next = lookup.value.getOperator(row.field, key)
  const previous = operatorOf(row)
  const keep = next != null && previous != null && next.value.type === previous.value.type
  replace(index, {
    field: row.field,
    operator: key,
    value: keep && next?.value.type !== 'nested' ? row.value : undefined,
    children: keep && next?.value.type === 'nested' ? row.children ?? [] : next?.value.type === 'nested' ? [] : undefined,
    isReadOnly: row.isReadOnly,
  })
}

function onValue(index: number, row: EditableFilter, value: EditableFilter['value']): void {
  replace(index, { ...row, value })
}

function nestedRows(row: EditableFilter): EditableFilter[] {
  return [...(row.children ?? [])]
}

function onNested(index: number, row: EditableFilter, rows: EditableFilter[]): void {
  replace(index, { ...row, children: rows })
}

function onNestedUpdate(index: number, row: EditableFilter, rows: EditableFilter[]): void {
  onNested(index, row, rows)
}

function add(): void {
  const field = lookup.value.getVisibleFields()[0]
  if (field == null)
    return
  const operator = lookup.value.getDefaultOperator(field.key)
  emit('update:modelValue', [...props.modelValue, {
    field: field.key,
    operator: operator?.key,
    children: operator?.value.type === 'nested' ? [] : undefined,
  }])
}

function remove(index: number): void {
  emit('update:modelValue', props.modelValue.filter((_, rowIndex) => rowIndex !== index))
}
</script>

<template>
  <div class="astryx-power-search-nested">
    <div v-for="(row, index) in modelValue" :key="`${row.field}-${index}`" class="astryx-power-search-nested-row">
      <div class="astryx-power-search-editor-row">
        <Selector
          :label="text.editor.field"
          is-label-hidden
          :options="fieldOptions"
          :model-value="row.field"
          :disabled="disabled"
          @update:model-value="value => onField(index, value)"
        />
        <Selector
          v-if="operatorOptions(row.field).length > 0"
          :label="text.editor.operator"
          is-label-hidden
          :options="operatorOptions(row.field)"
          :model-value="row.operator ?? null"
          :disabled="disabled"
          @update:model-value="value => onOperator(index, row, value)"
        />
        <PowerSearchValueField
          v-if="operatorOf(row) && operatorOf(row)?.value.type !== 'empty' && operatorOf(row)?.value.type !== 'nested'"
          :key="`${row.field}:${row.operator ?? ''}`"
          :operator-value="operatorOf(row)!.value"
          :filter-value="row.value"
          :messages="messages.powerSearch"
          :disabled="disabled"
          :time-zone="timeZone"
          :max-menu-items="maxMenuItems"
          @change="filterValue => onValue(index, row, filterValue)"
        />
        <button
          v-if="!disabled"
          type="button"
          class="astryx-power-search-icon-button"
          :aria-label="text.editor.removeFilter"
          @click="remove(index)"
        >
          <Icon icon="close" size="sm" />
        </button>
      </div>
      <PowerSearchNestedRows
        v-if="operatorOf(row)?.value.type === 'nested'"
        :config="config"
        :model-value="nestedRows(row)"
        :disabled="disabled"
        :time-zone="timeZone"
        :max-menu-items="maxMenuItems"
        @update:model-value="onNestedUpdate(index, row, $event)"
      />
    </div>
    <Button
      v-if="!disabled"
      :label="text.editor.addFilter"
      variant="ghost"
      size="sm"
      @click="add"
    />
  </div>
</template>
