<script setup lang="ts">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { NumberInputCommitDecision } from '../NumberInput/numberInputCommit.js'
import type { DateTimeRange, FilterValue, OperatorValue, PowerSearchEntity } from './types.js'
import { computed, ref } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import DateInput from '../DateInput/DateInput.vue'
import DateRangeInput from '../DateRangeInput/DateRangeInput.vue'
import DateTimeInput from '../DateTimeInput/DateTimeInput.vue'
import { useAstryxLocale } from '../locale/context.js'
import MultiSelector from '../MultiSelector/MultiSelector.vue'
import NumberInput from '../NumberInput/NumberInput.vue'
import { resolveNumberInputCommit } from '../NumberInput/numberInputCommit.js'
import Selector from '../Selector/Selector.vue'
import TextInput from '../TextInput/TextInput.vue'
import TimeInput from '../TimeInput/TimeInput.vue'
import Tokenizer from '../Tokenizer/Tokenizer.vue'
import Typeahead from '../Typeahead/Typeahead.vue'
import { absoluteRange, dateTimeLocalToUnix, isoDateToUnix, rangePartToIso, unixToDateTimeLocal, unixToIsoDate } from './dates.js'

defineOptions({ name: 'AstryxPowerSearchValueField' })

const props = defineProps<{
  operatorValue: OperatorValue
  filterValue?: FilterValue
  messages: PowerSearchMessages
  disabled?: boolean
  timeZone?: string
  maxMenuItems?: number
}>()

const emit = defineEmits<{
  change: [value: FilterValue, shouldSave?: boolean]
}>()

const text = computed(() => props.messages.value)
const locale = useAstryxLocale()
const numberDecision = ref<NumberInputCommitDecision | null>(null)

function rememberNumberDraft(event: Event): void {
  const target = event.target
  const operator = props.operatorValue
  if (!(target instanceof HTMLInputElement) || target.getAttribute('role') !== 'spinbutton')
    return
  if (operator.type !== 'integer' && operator.type !== 'float')
    return
  numberDecision.value = resolveNumberInputCommit(target.value, {
    min: operator.minValue,
    max: operator.maxValue,
    isIntegerOnly: operator.type === 'integer',
    locale: locale.value,
    hasClear: false,
  })
}

function onNumberKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter' || event.isComposing)
    return
  const decision = numberDecision.value
  numberDecision.value = null
  if (decision != null && decision.type !== 'commit')
    event.stopPropagation()
}
const stringValue = computed(() => props.filterValue?.type === 'string' ? props.filterValue.value : '')
const numberValue = computed(() => props.filterValue?.type === 'integer' || props.filterValue?.type === 'float' ? props.filterValue.value : null)
const timeValue = computed(() => props.filterValue?.type === 'time' ? props.filterValue.value : null)
const enumValue = computed(() => props.filterValue?.type === 'enum' ? props.filterValue.value : null)
const enumList = computed(() => props.filterValue?.type === 'enum_list' ? [...props.filterValue.value] : [])
const relativeValue = computed(() => props.filterValue?.type === 'date_relative' ? props.filterValue.value : '')
const customValue = computed(() => props.filterValue?.type === 'custom' ? props.filterValue.value : '')

const stringItems = computed<SearchableItem[]>(() => {
  if (props.filterValue?.type !== 'string_list')
    return []
  return props.filterValue.value.map(value => ({ id: value, label: value }))
})

const entityItems = computed<SearchableItem[]>(() => {
  if (props.filterValue?.type !== 'entity_list')
    return []
  return props.filterValue.value.map(entity => ({ id: entity.id, label: entity.label, auxiliaryData: entity }))
})

const selectedStringItem = computed<SearchableItem | null>(() => stringValue.value
  ? { id: stringValue.value, label: stringValue.value }
  : null)

const enumOptions = computed(() => {
  const value = props.operatorValue
  if (value.type !== 'enum' && value.type !== 'enum_list')
    return []
  return value.values.map(item => ({ value: item.value, label: item.label, icon: item.icon }))
})

const relativeOptions = computed(() => props.operatorValue.type === 'date_relative'
  ? []
  : props.operatorValue.type === 'date_range'
    ? (props.operatorValue.relativeDatePresets ?? []).map(preset => ({ value: preset.value, label: preset.label }))
    : [])

const dateOnly = computed(() => props.operatorValue.type === 'date_absolute' && props.operatorValue.isDateOnly === true)
const absoluteDate = computed(() => {
  if (props.filterValue?.type !== 'date_absolute')
    return null
  return new Date(props.filterValue.unixSeconds * 1000)
})
const absoluteLocal = computed(() => props.filterValue?.type === 'date_absolute'
  ? unixToDateTimeLocal(props.filterValue.unixSeconds, props.timeZone)
  : null)

const rangeModel = computed(() => {
  if (props.filterValue?.type !== 'date_range')
    return null
  return {
    start: rangePartToIso(props.filterValue.value.start, props.timeZone),
    end: rangePartToIso(props.filterValue.value.end, props.timeZone),
  }
})

const stringSource = computed(() => props.operatorValue.type === 'string' || props.operatorValue.type === 'string_list'
  ? props.operatorValue.searchSource ?? createStaticSource([])
  : createStaticSource([]))

const entitySource = computed(() => props.operatorValue.type === 'entity_list'
  ? props.operatorValue.searchSource ?? createStaticSource([])
  : createStaticSource([]))

const stringCreatable = computed(() => {
  const value = props.operatorValue
  if (value.type !== 'string_list' && value.type !== 'entity_list')
    return false
  return value.isArbitraryStringAllowed === true || value.searchSource == null
})

function commitStringList(items: readonly SearchableItem[]): void {
  emit('change', { type: 'string_list', value: items.map(item => item.label) })
}

function commitEntities(items: readonly SearchableItem[]): void {
  const entities: PowerSearchEntity[] = items.map(item => ({
    id: item.id,
    label: item.label,
    photo: typeof item.auxiliaryData === 'object' && item.auxiliaryData && 'photo' in item.auxiliaryData
      ? String((item.auxiliaryData as { photo?: string }).photo ?? '')
      : undefined,
  }))
  emit('change', { type: 'entity_list', value: entities })
}

function onPaste(event: ClipboardEvent): void {
  const value = props.operatorValue
  if (value.type !== 'string_list' && value.type !== 'entity_list')
    return
  const pattern = value.tokenization?.regex
  if (!pattern)
    return
  const pasted = event.clipboardData?.getData('text') ?? ''
  if (!pasted)
    return
  let pieces: string[] = []
  try {
    pieces = pasted.match(new RegExp(pattern, 'g')) ?? []
  }
  catch {
    return
  }
  if (pieces.length === 0)
    return
  event.preventDefault()
  if (value.tokenization?.sort)
    pieces.sort((left, right) => left.localeCompare(right))
  if (value.type === 'string_list') {
    const current = stringItems.value.map(item => item.label)
    emit('change', { type: 'string_list', value: [...current, ...pieces] })
    return
  }
  const current = entityItems.value.map(item => ({ id: item.id, label: item.label }))
  emit('change', {
    type: 'entity_list',
    value: [...current, ...pieces.map(piece => ({ id: piece, label: piece }))],
  })
}

function onRange(value: unknown): void {
  if (value == null || typeof value !== 'object' || !('start' in value) || !('end' in value))
    return
  const start = value.start
  const end = value.end
  if (typeof start !== 'string' || typeof end !== 'string')
    return
  emit('change', { type: 'date_range', value: absoluteRange(start, end) })
}

function onTime(value: unknown): void {
  if (typeof value === 'string' && value !== '')
    emit('change', { type: 'time', value })
}

function onAbsoluteDate(value: unknown): void {
  if (!(value instanceof Date))
    return
  emit('change', { type: 'date_absolute', unixSeconds: isoDateToUnix(unixToIsoDate(Math.floor(value.getTime() / 1000), props.timeZone)) })
}

function onAbsoluteDateTime(value: unknown): void {
  if (typeof value !== 'string' || value === '')
    return
  emit('change', { type: 'date_absolute', unixSeconds: dateTimeLocalToUnix(value, props.timeZone) })
}

function onCustomValue(value: unknown): void {
  emit('change', { type: 'custom', value: value == null ? '' : String(value) })
}

function applyPreset(range: DateTimeRange): void {
  emit('change', { type: 'date_range', value: range }, true)
}
</script>

<template>
  <div class="astryx-power-search-value" @paste="onPaste">
    <Typeahead
      v-if="operatorValue.type === 'string' && operatorValue.searchSource"
      :label="text.value"
      label-hidden
      :search-source="stringSource"
      :model-value="selectedStringItem"
      :placeholder="text.searchPlaceholder"
      :disabled="disabled"
      :max-menu-items="maxMenuItems"
      @update:model-value="item => emit('change', { type: 'string', value: item?.label ?? '' }, Boolean(item))"
    />
    <TextInput
      v-else-if="operatorValue.type === 'string'"
      :label="text.value"
      is-label-hidden
      :model-value="stringValue"
      :placeholder="text.enterValuePlaceholder"
      :disabled="disabled"
      @update:model-value="value => emit('change', { type: 'string', value: String(value ?? '') })"
    />
    <Tokenizer
      v-else-if="operatorValue.type === 'string_list'"
      :label="text.values"
      label-hidden
      :search-source="stringSource"
      :model-value="stringItems"
      :placeholder="text.addValuesPlaceholder"
      :disabled="disabled"
      :creatable="stringCreatable"
      :max-menu-items="maxMenuItems"
      @update:model-value="commitStringList"
    />
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 只听里面数字框冒上来的输入和回车，自己不是控件。 -->
    <div
      v-else-if="operatorValue.type === 'integer' || operatorValue.type === 'float'"
      class="astryx-power-search-value"
      @focusin="numberDecision = null"
      @input="rememberNumberDraft"
      @keydown="onNumberKeydown"
    >
      <NumberInput
        :label="text.value"
        is-label-hidden
        :model-value="numberValue"
        :placeholder="text.enterNumberPlaceholder"
        :disabled="disabled"
        :min="operatorValue.minValue"
        :max="operatorValue.maxValue"
        :step="operatorValue.type === 'integer' ? 1 : undefined"
        :units="operatorValue.units"
        @update:model-value="value => value != null && emit('change', { type: operatorValue.type === 'integer' ? 'integer' : 'float', value })"
      />
    </div>
    <TimeInput
      v-else-if="operatorValue.type === 'time'"
      :label="text.time"
      is-label-hidden
      :model-value="timeValue"
      :min="operatorValue.minValue"
      :max="operatorValue.maxValue"
      :is-disabled="disabled"
      @update:model-value="onTime"
    />
    <DateInput
      v-else-if="operatorValue.type === 'date_absolute' && dateOnly"
      :label="text.date"
      is-label-hidden
      :model-value="absoluteDate"
      :is-disabled="disabled"
      @update:model-value="onAbsoluteDate"
    />
    <DateTimeInput
      v-else-if="operatorValue.type === 'date_absolute'"
      :label="text.date"
      is-label-hidden
      :model-value="absoluteLocal"
      :is-disabled="disabled"
      @update:model-value="onAbsoluteDateTime"
    />
    <div v-else-if="operatorValue.type === 'date_relative'" class="astryx-power-search-value__stack">
      <Selector
        v-if="relativeOptions.length > 0"
        :label="text.relativeDate"
        is-label-hidden
        :options="relativeOptions"
        :model-value="relativeValue"
        :placeholder="text.selectPlaceholder"
        :disabled="disabled"
        @update:model-value="value => emit('change', { type: 'date_relative', value: String(value ?? '') }, true)"
      />
      <TextInput
        :label="text.relativeDate"
        is-label-hidden
        :model-value="relativeValue"
        :placeholder="text.enterValuePlaceholder"
        :disabled="disabled"
        @update:model-value="value => emit('change', { type: 'date_relative', value: String(value ?? '') })"
      />
    </div>
    <div v-else-if="operatorValue.type === 'date_range'" class="astryx-power-search-value__stack">
      <div v-if="operatorValue.intervalDatePresets?.length" class="astryx-power-search-presets" role="group" :aria-label="text.date">
        <button
          v-for="preset in operatorValue.intervalDatePresets"
          :key="preset.label"
          type="button"
          class="astryx-power-search-preset"
          :disabled="disabled"
          @click="applyPreset(preset.value)"
        >
          {{ preset.label }}
        </button>
      </div>
      <DateRangeInput
        :label="text.date"
        is-label-hidden
        :model-value="rangeModel"
        :is-disabled="disabled"
        @update:model-value="onRange"
      />
    </div>
    <Selector
      v-else-if="operatorValue.type === 'enum'"
      :label="text.value"
      is-label-hidden
      :options="enumOptions"
      :model-value="enumValue"
      :placeholder="text.selectPlaceholder"
      :disabled="disabled"
      @update:model-value="value => emit('change', { type: 'enum', value: String(value ?? '') }, true)"
    />
    <MultiSelector
      v-else-if="operatorValue.type === 'enum_list'"
      :label="text.values"
      label-hidden
      :options="enumOptions"
      :model-value="enumList"
      :placeholder="text.selectValuesPlaceholder"
      :disabled="disabled"
      @update:model-value="value => emit('change', { type: 'enum_list', value: value.map(String) })"
    />
    <Tokenizer
      v-else-if="operatorValue.type === 'entity_list'"
      :label="text.entities"
      label-hidden
      :search-source="entitySource"
      :model-value="entityItems"
      :placeholder="text.searchPlaceholder"
      :disabled="disabled"
      :creatable="stringCreatable"
      :max-menu-items="maxMenuItems"
      @update:model-value="commitEntities"
    />
    <component
      :is="operatorValue.Editor"
      v-else-if="operatorValue.type === 'custom'"
      :model-value="customValue"
      :value="customValue"
      :placeholder="text.enterValuePlaceholder"
      :disabled="disabled"
      :is-disabled="disabled"
      @update:model-value="onCustomValue"
      @change="onCustomValue"
    />
  </div>
</template>
