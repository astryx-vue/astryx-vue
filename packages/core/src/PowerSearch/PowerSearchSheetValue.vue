<script setup lang="ts">
/**
 * 值那一步：编辑一个条件的运算符和值。有多个运算符时先列一组单选；封闭的选项（`enum`、`enum_list`、
 * 相对日期）列成行，其余类型用浮层编辑器的底部弹层呈现。`components[type].editor` 覆盖整个编辑区，
 * `nested` 条件用内置编辑器。字段或运算符在配置里已经没有时显示不可用的说明。
 * 只读时只有「取消」；否则「取消」和保存，没有运算符或值时保存不可点。
 */
import type { Component } from 'vue'
import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { PowerSearchLookup } from './config.js'
import type { PowerSearchComponents, PowerSearchConfig, PowerSearchFilter } from './types.js'
import type { PowerSearchSheetFlow } from './usePowerSearchSheetFlow.js'
import { computed } from 'vue'
import Button from '../Button/Button.vue'
import Heading from '../Heading/Heading.vue'
import { useComponentMessages } from '../locale/context.js'
import { powerSearchSheetMessages } from '../locale/messages/power-search-sheet.js'
import RadioList from '../Radio/RadioList.vue'
import RadioListItem from '../RadioList/RadioListItem.vue'
import Text from '../Text/Text.vue'
import { resolveOperatorLabel } from './operators.js'
import PowerSearchEditor from './PowerSearchEditor.vue'
import PowerSearchSheetChoices from './PowerSearchSheetChoices.vue'
import PowerSearchValueField from './PowerSearchValueField.vue'
import { buildRelativeDateOptions } from './relativeDates.js'

defineOptions({ name: 'AstryxPowerSearchSheetValue' })

const props = defineProps<{
  flow: PowerSearchSheetFlow
  lookup: PowerSearchLookup
  config: PowerSearchConfig
  title: string
  messages: PowerSearchMessages
  components?: PowerSearchComponents
  saveLabel?: string
  isReadOnly: boolean
  isDisabled: boolean
  timeZone?: string
  maxOperatorMenuItems?: number
}>()

const sheetMessages = useComponentMessages({ powerSearchSheet: powerSearchSheetMessages })
const sheet = computed(() => sheetMessages.value.powerSearchSheet)

const draft = computed(() => props.flow.draft.value)
const field = computed(() => draft.value ? props.lookup.getField(draft.value.field) : undefined)
const operator = computed(() => draft.value?.operator != null ? props.lookup.getOperator(draft.value.field, draft.value.operator) : undefined)
const operators = computed(() => draft.value ? props.lookup.getVisibleOperators(draft.value.field) : [])
const isRenderable = computed(() => draft.value != null && field.value != null && operator.value != null)
const showsOperatorGroup = computed(() => operators.value.length > 1 && operator.value != null && operators.value.includes(operator.value))
const isEditorDisabled = computed(() => props.isDisabled || props.isReadOnly)
const isSaveDisabled = computed(() => isEditorDisabled.value || draft.value?.operator == null || draft.value.value == null)
const saveButtonLabel = computed(() => props.saveLabel ?? (draft.value?.mode === 'edit' ? props.messages.editor.apply : sheet.value.addFilter))
const editorKey = computed(() => draft.value ? `${draft.value.generation}-${draft.value.field}-${draft.value.operator}` : '')

/** 覆盖整个编辑区的编辑器：调用方按类型给的，或 `nested` 条件的内置编辑器。 */
const editorOverride = computed<Component | undefined>(() => {
  const type = operator.value?.value.type
  if (type == null)
    return undefined
  return props.components?.[type]?.editor ?? (type === 'nested' ? PowerSearchEditor : undefined)
})

const choiceItems = computed(() => {
  const value = operator.value?.value
  if (value?.type === 'enum' || value?.type === 'enum_list')
    return value.values
  if (value?.type === 'date_relative')
    return buildRelativeDateOptions(value, sheet.value)
  return null
})

const selectedValues = computed<readonly string[]>(() => {
  const value = draft.value?.value
  if (value?.type === 'enum' || value?.type === 'date_relative')
    return [value.value]
  if (value?.type === 'enum_list')
    return value.value
  return []
})

function onChoices(values: string[]): void {
  const type = operator.value?.value.type
  if (type === 'enum_list')
    props.flow.setDraftValue({ type: 'enum_list', value: values })
  else if (type === 'enum' || type === 'date_relative')
    props.flow.setDraftValue({ type, value: values[0] ?? '' })
}

function onOperator(key: unknown): void {
  const next = operators.value.find(candidate => candidate.key === key)
  if (next != null)
    props.flow.handleOperatorSelect(next)
}

function onOverrideSave(saved: PowerSearchFilter | null): void {
  const current = draft.value
  if (current == null)
    return
  if (saved == null)
    props.flow.handleRemove()
  else
    props.flow.commitSavedFilter(current, saved)
}
</script>

<template>
  <div class="astryx-power-search-sheet" data-sheet-step="value">
    <div class="astryx-power-search-sheet__header">
      <div class="astryx-power-search-sheet__header-row">
        <Heading :level="3" :max-lines="1" class="astryx-power-search-sheet__title">
          {{ title }}
        </Heading>
      </div>
    </div>
    <div class="astryx-power-search-sheet__body">
      <div v-if="isRenderable && showsOperatorGroup" class="astryx-power-search-sheet__section">
        <RadioList
          :label="messages.editor.operator"
          is-label-hidden
          :model-value="draft!.operator ?? ''"
          :is-disabled="isEditorDisabled"
          @update:model-value="onOperator"
        >
          <RadioListItem
            v-for="candidate in operators"
            :key="candidate.key"
            :value="candidate.key"
            :label="sheet.fieldOperator(field!.label, resolveOperatorLabel(candidate, messages))"
          />
        </RadioList>
      </div>
      <component
        :is="editorOverride"
        v-if="isRenderable && editorOverride"
        :key="editorKey"
        :config="config"
        :filter="{ field: draft!.field, operator: draft!.operator, value: draft!.value }"
        :mode="draft!.mode"
        :save-label="saveButtonLabel"
        :read-only="isEditorDisabled"
        :time-zone="timeZone"
        :max-menu-items="maxOperatorMenuItems"
        :on-save="onOverrideSave"
        :on-cancel="flow.returnFromValue"
      />
      <div
        v-else-if="isRenderable && operator!.value.type !== 'empty'"
        :class="{ 'astryx-power-search-sheet__section': showsOperatorGroup }"
      >
        <PowerSearchSheetChoices
          v-if="choiceItems"
          :key="editorKey"
          :items="choiceItems"
          :selected="selectedValues"
          :is-multiple="operator!.value.type === 'enum_list'"
          :is-disabled="isEditorDisabled"
          :label="field!.label"
          @change="onChoices"
        />
        <PowerSearchValueField
          v-else
          :key="editorKey"
          presentation="bottom-sheet"
          :field-label="field!.label"
          :operator-value="operator!.value"
          :filter-value="draft!.value"
          :messages="messages"
          :disabled="isEditorDisabled"
          :time-zone="timeZone"
          :max-menu-items="maxOperatorMenuItems"
          @change="flow.setDraftValue"
          @unstage="flow.unstageDraft"
        />
      </div>
      <Text v-else-if="draft && !isRenderable" type="body" color="secondary" class="astryx-power-search-sheet__unavailable">
        {{ sheet.filterUnavailable }}
      </Text>
    </div>
    <div v-if="!(isRenderable && editorOverride)" class="astryx-power-search-sheet__footer">
      <Button
        data-sheet-cancel=""
        class="astryx-power-search-sheet__footer-action"
        :label="messages.editor.cancel"
        variant="secondary"
        size="lg"
        :width="isReadOnly ? '100%' : undefined"
        @click="flow.returnFromValue"
      />
      <Button
        v-if="!isReadOnly && isRenderable"
        data-sheet-save=""
        class="astryx-power-search-sheet__footer-action"
        :label="saveButtonLabel"
        variant="primary"
        size="lg"
        :is-disabled="isSaveDisabled"
        @click="flow.handleSave"
      />
    </div>
  </div>
</template>
