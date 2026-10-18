<script setup lang="ts">
import type { TableFilterContribution, TableFilterValue } from './types.js'
import { computed, ref, watch } from 'vue'
import Button from '../Button/Button.vue'
import DateInput from '../DateInput/DateInput.vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/context.js'
import MultiSelector from '../MultiSelector/MultiSelector.vue'
import NumberInput from '../NumberInput/NumberInput.vue'
import Popover from '../Popover/Popover.vue'
import Selector from '../Selector/Selector.vue'
import TextInput from '../TextInput/TextInput.vue'

const props = defineProps<{
  filter: TableFilterContribution
}>()

const messages = useAstryxMessages()
const draft = ref<TableFilterValue | null>(props.filter.value)
const isCompact = computed(() => props.filter.variant === 'inline-compact')

watch(() => props.filter.value, (value) => {
  draft.value = value
})

function commit(value: TableFilterValue | null) {
  props.filter.onChange(value)
}

function textValue(value: TableFilterValue | null): string {
  return typeof value === 'string' ? value : ''
}

function numberValue(value: TableFilterValue | null): number | null {
  return typeof value === 'number' ? value : null
}

function dateValue(value: TableFilterValue | null): Date | null {
  if (typeof value !== 'string' || value === '')
    return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function listValue(value: TableFilterValue | null): string[] {
  return Array.isArray(value) ? value : []
}

const options = computed(() => props.filter.field.options ?? [])
const step = computed(() => props.filter.field.step ?? (props.filter.field.isIntegerOnly ? 1 : null))

function onTextInput(value: string) {
  draft.value = value
  commit(value === '' ? null : value)
}

function onNumberInput(value: number | null) {
  draft.value = value
  commit(value)
}

function onDateInput(value: Date | null) {
  const next = value == null ? null : value.toISOString().slice(0, 10)
  draft.value = next
  commit(next)
}

function onSingleSelect(value: string | number | null) {
  const next = value == null || value === '' ? null : String(value)
  draft.value = next
  commit(next)
}

function onMultiSelect(value: (string | number)[]) {
  const next = value.map(String)
  draft.value = next
  commit(next.length === 0 ? null : next)
}
</script>

<template>
  <div class="astryx-table__filter" :data-variant="filter.variant">
    <template v-if="filter.variant === 'inline' || filter.variant === 'inline-compact'">
      <TextInput
        v-if="filter.field.type === 'string'"
        :model-value="textValue(draft)"
        :label="filter.field.label"
        is-label-hidden
        size="sm"
        :placeholder="filter.field.label"
        @update:model-value="onTextInput"
      />
      <NumberInput
        v-else-if="filter.field.type === 'number'"
        :model-value="numberValue(draft)"
        :label="filter.field.label"
        is-label-hidden
        size="sm"
        :placeholder="filter.field.label"
        :min="filter.field.min ?? null"
        :max="filter.field.max ?? null"
        :step="step"
        :is-integer-only="filter.field.isIntegerOnly"
        has-clear
        @update:model-value="onNumberInput"
      />
      <DateInput
        v-else-if="filter.field.type === 'date'"
        :model-value="dateValue(draft)"
        :label="filter.field.label"
        is-label-hidden
        size="sm"
        :placeholder="filter.field.label"
        has-clear
        @update:model-value="onDateInput"
      />
      <MultiSelector
        v-else-if="filter.field.type === 'multi-select'"
        :model-value="listValue(draft)"
        :label="filter.field.label"
        label-hidden
        size="sm"
        :options="options"
        :placeholder="messages.table.filterAll"
        :searchable="!isCompact"
        select-all
        has-clear
        @update:model-value="onMultiSelect"
      />
      <Selector
        v-else
        :model-value="textValue(draft) || null"
        :label="filter.field.label"
        is-label-hidden
        size="sm"
        :placeholder="messages.table.filterAll"
        :options="options"
        @update:model-value="onSingleSelect"
      />
    </template>
    <Popover v-else :label="filter.field.label" :has-close-button="false" :width="240">
      <IconButton variant="ghost" size="sm" :label="filter.field.label">
        <Icon icon="funnel" size="sm" />
      </IconButton>
      <template #content>
        <div class="astryx-table__filter-popover">
          <TextInput
            v-if="filter.field.type === 'string'"
            :model-value="textValue(draft)"
            :label="filter.field.label"
            is-label-hidden
            size="sm"
            :placeholder="filter.field.label"
            @update:model-value="value => draft = value"
          />
          <NumberInput
            v-else-if="filter.field.type === 'number'"
            :model-value="numberValue(draft)"
            :label="filter.field.label"
            is-label-hidden
            size="sm"
            :placeholder="filter.field.label"
            :min="filter.field.min ?? null"
            :max="filter.field.max ?? null"
            :step="step"
            :is-integer-only="filter.field.isIntegerOnly"
            @update:model-value="value => draft = value"
          />
          <DateInput
            v-else-if="filter.field.type === 'date'"
            :model-value="dateValue(draft)"
            :label="filter.field.label"
            is-label-hidden
            size="sm"
            :placeholder="filter.field.label"
            @update:model-value="value => draft = value == null ? null : value.toISOString().slice(0, 10)"
          />
          <MultiSelector
            v-else-if="filter.field.type === 'multi-select'"
            :model-value="listValue(draft)"
            :label="filter.field.label"
            label-hidden
            size="sm"
            :options="options"
            :placeholder="messages.table.filterAll"
            select-all
            @update:model-value="value => draft = value.length === 0 ? null : value.map(String)"
          />
          <Selector
            v-else
            :model-value="textValue(draft) || null"
            :label="filter.field.label"
            is-label-hidden
            size="sm"
            :placeholder="messages.table.filterAll"
            :options="options"
            @update:model-value="value => draft = value == null ? null : String(value)"
          />
          <div class="astryx-table__filter-actions">
            <Button variant="ghost" size="sm" :label="messages.table.reset" @click="draft = null; commit(null)">
              {{ messages.table.reset }}
            </Button>
            <Button variant="primary" size="sm" :label="messages.table.apply" @click="commit(draft)">
              {{ messages.table.apply }}
            </Button>
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>
