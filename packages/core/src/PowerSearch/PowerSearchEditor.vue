<script setup lang="ts">
import type { EditableFilter } from './complete.js'
import type { FilterValue, PartialFilter, PowerSearchConfig, PowerSearchFilter } from './types.js'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import Button from '../Button/Button.vue'
import { useAstryxMessages } from '../locale/context.js'
import Selector from '../Selector/Selector.vue'
import { completePowerSearchFilter } from './complete.js'
import { createPowerSearchLookup } from './config.js'
import { resolveOperatorLabel } from './operators.js'
import PowerSearchNestedRows from './PowerSearchNestedRows.vue'
import PowerSearchValueField from './PowerSearchValueField.vue'

defineOptions({ name: 'AstryxPowerSearchEditor' })

const props = defineProps<{
  config: PowerSearchConfig
  filter: PartialFilter
  mode: 'create' | 'edit'
  saveLabel?: string
  readOnly?: boolean
  timeZone?: string
  maxMenuItems?: number
  onSave: (filter: PowerSearchFilter | null) => void
  onCancel: () => void
}>()

const messages = useAstryxMessages()
const lookup = computed(() => createPowerSearchLookup(props.config))
const text = computed(() => messages.value.powerSearch)
const root = useTemplateRef<HTMLElement>('root')
const valueRoot = useTemplateRef<HTMLElement>('valueRoot')
const fieldKey = ref(props.filter.field)
const operatorKey = ref(props.filter.operator ?? lookup.value.getDefaultOperator(props.filter.field)?.key ?? '')
const draft = ref<FilterValue | undefined>(props.filter.value?.type === 'nested' ? undefined : props.filter.value)
const children = ref<EditableFilter[]>(props.filter.value?.type === 'nested' ? [...props.filter.value.value] : [])

const fieldOptions = computed(() => lookup.value.getVisibleFields().map(field => ({
  value: field.key,
  label: field.label,
})))

const operatorOptions = computed(() => lookup.value.getVisibleOperators(fieldKey.value).map(operator => ({
  value: operator.key,
  label: resolveOperatorLabel(operator, messages.value.powerSearch),
})))

const operatorValue = computed(() => lookup.value.getOperator(fieldKey.value, operatorKey.value)?.value)
const partial = computed<EditableFilter>(() => ({
  field: fieldKey.value,
  operator: operatorKey.value || undefined,
  value: operatorValue.value?.type === 'nested' ? undefined : draft.value,
  children: operatorValue.value?.type === 'nested' ? children.value : undefined,
  isReadOnly: props.filter.isReadOnly,
}))
const completed = computed(() => completePowerSearchFilter(partial.value, lookup.value))
const showFooter = computed(() => operatorValue.value != null && operatorValue.value.type !== 'empty')

const focusable = 'input:not([disabled]), button:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function focusWithin(element: HTMLElement | null): void {
  element?.querySelector<HTMLElement>(focusable)?.focus()
}

function saveIfEmpty(field: string, operatorKeyValue: string | undefined): void {
  const operator = operatorKeyValue ? lookup.value.getOperator(field, operatorKeyValue) : undefined
  if (operator?.value.type !== 'empty')
    return
  queueMicrotask(() => {
    props.onSave({ field, operator: operator.key, value: { type: 'empty' }, isReadOnly: props.filter.isReadOnly })
  })
}

function onField(next: string | number | null): void {
  const key = String(next ?? '')
  if (key === '' || key === fieldKey.value)
    return
  const operator = lookup.value.getDefaultOperator(key)
  fieldKey.value = key
  operatorKey.value = operator?.key ?? ''
  children.value = []
  draft.value = undefined
  saveIfEmpty(key, operator?.key)
}

function onOperator(next: string | number | null): void {
  const key = String(next ?? '')
  if (key === '' || key === operatorKey.value)
    return
  const nextOperator = lookup.value.getOperator(fieldKey.value, key)
  const previous = lookup.value.getOperator(fieldKey.value, operatorKey.value)
  const keep = nextOperator != null && previous != null && nextOperator.value.type === previous.value.type
  operatorKey.value = key
  if (!keep) {
    children.value = []
    draft.value = undefined
  }
  saveIfEmpty(fieldKey.value, key)
}

function onValue(value: FilterValue, shouldSave?: boolean): void {
  draft.value = value
  if (shouldSave)
    save()
}

function save(): void {
  const filter = completePowerSearchFilter({
    field: fieldKey.value,
    operator: operatorKey.value,
    value: draft.value,
    isReadOnly: props.filter.isReadOnly,
  }, lookup.value)
  if (filter)
    props.onSave(filter)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.isComposing || event.key === 'Process')
    return
  if (event.key === 'Escape' && !event.defaultPrevented) {
    event.preventDefault()
    props.onCancel()
    return
  }
  if (event.key === 'Enter' && event.target instanceof HTMLButtonElement)
    return
  if (event.key === 'Enter' && completed.value && !event.defaultPrevented) {
    event.preventDefault()
    save()
  }
}

watch([fieldKey, operatorKey], () => {
  void nextTick(() => {
    requestAnimationFrame(() => focusWithin(valueRoot.value))
  })
})

onMounted(() => {
  void nextTick(() => {
    requestAnimationFrame(() => focusWithin(valueRoot.value ?? root.value))
  })
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 编辑器整组接收 Enter 和 Escape。 -->
  <div ref="root" class="astryx-power-search-editor-body" role="group" :aria-label="text.editor.editing" tabindex="-1" @keydown="onKeydown">
    <div class="astryx-power-search-editor-row">
      <Selector
        :label="text.editor.field"
        is-label-hidden
        :options="fieldOptions"
        :model-value="fieldKey"
        :disabled="readOnly"
        @update:model-value="onField"
      />
      <Selector
        v-if="operatorOptions.length > 1 || operatorValue?.type !== 'empty'"
        :label="text.editor.operator"
        is-label-hidden
        :options="operatorOptions"
        :model-value="operatorKey || null"
        :disabled="readOnly"
        @update:model-value="onOperator"
      />
      <div v-if="operatorValue && operatorValue.type !== 'empty' && operatorValue.type !== 'nested'" ref="valueRoot" class="astryx-power-search-editor-value">
        <PowerSearchValueField
          :key="`${fieldKey}:${operatorKey}`"
          :operator-value="operatorValue"
          :filter-value="draft"
          :messages="messages.powerSearch"
          :disabled="readOnly"
          :time-zone="timeZone"
          :max-menu-items="maxMenuItems"
          @change="onValue"
        />
      </div>
    </div>
    <div v-if="operatorValue?.type === 'nested'" class="astryx-power-search-editor-nested">
      <div class="astryx-power-search-editor-group">
        {{ text.editor.group }}
      </div>
      <PowerSearchNestedRows
        :config="config"
        :model-value="children"
        :disabled="readOnly"
        :time-zone="timeZone"
        :max-menu-items="maxMenuItems"
        @update:model-value="rows => children = rows"
      />
    </div>
    <div v-if="showFooter" class="astryx-power-search-editor-footer">
      <Button
        v-if="mode === 'edit' && !readOnly"
        :label="text.editor.delete"
        variant="ghost"
        size="sm"
        @click="onSave(null)"
      />
      <span v-else />
      <div class="astryx-power-search-editor-actions">
        <Button :label="text.editor.cancel" variant="ghost" size="sm" @click="onCancel" />
        <Button :label="saveLabel || text.editor.apply" variant="primary" size="sm" :is-disabled="completed == null" @click="save" />
      </div>
    </div>
  </div>
</template>
