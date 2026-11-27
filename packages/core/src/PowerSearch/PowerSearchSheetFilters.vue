<script setup lang="ts">
/**
 * 「筛选条件」那一步：草稿里的每个条件一行。能编辑的行点一下进值那一步（一点就加的条件点一下就删），
 * 末尾的 × 删掉它；只读条件只展示。没有条件时显示空状态和「添加筛选条件」。
 * 底部的「完成」在有条件或草稿改过时出现，「全部清除」只在有能删的条件时出现。
 */
import type { PowerSearchLookup } from './config.js'
import type { SheetFilterParts } from './sheetFilterText.js'
import type { PowerSearchFilter } from './types.js'
import type { PowerSearchSheetFlow } from './usePowerSearchSheetFlow.js'
import { computed } from 'vue'
import Button from '../Button/Button.vue'
import EmptyState from '../EmptyState/EmptyState.vue'
import Heading from '../Heading/Heading.vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import List from '../List/List.vue'
import ListItem from '../List/ListItem.vue'
import { useComponentMessages } from '../locale/context.js'
import { powerSearchSheetMessages } from '../locale/messages/power-search-sheet.js'
import { createFilterIdentities } from './sheetFilterIdentity.js'
import { splitLabelValue } from './sheetFilterText.js'
import { PlusGlyph } from './sheetIcons.js'

defineOptions({ name: 'AstryxPowerSearchSheetFilters' })

const props = defineProps<{
  flow: PowerSearchSheetFlow
  lookup: PowerSearchLookup
  hasClear: boolean
  describeParts: (filter: PowerSearchFilter) => SheetFilterParts
}>()

const messages = useComponentMessages({ powerSearchSheet: powerSearchSheetMessages })
const text = computed(() => messages.value.powerSearchSheet)
const identities = createFilterIdentities()

const rows = computed(() => {
  const filters = props.flow.filters.value
  const ids = identities.next(filters)
  return filters.map((filter, index) => {
    const parts = props.describeParts(filter)
    const operator = props.lookup.getOperator(filter.field, filter.operator)
    const fieldLabel = props.lookup.getField(filter.field)?.label ?? filter.field
    return {
      key: `filter-${ids[index]}`,
      index,
      parts,
      split: parts.value ? splitLabelValue(text.value, parts.label) : null,
      isEditable: props.flow.isRowButton(filter),
      isOneTap: operator?.value.type === 'empty',
      removeLabel: text.value.removeFilter(fieldLabel),
    }
  })
})

const isClearAllShown = computed(() => props.hasClear && props.flow.isInteractive.value && props.flow.filters.value.some(filter => !filter.isReadOnly))
const isFooterShown = computed(() => rows.value.length > 0 || props.flow.isDraftDirty.value)

function onRowClick(row: { index: number, isOneTap: boolean }): void {
  if (row.isOneTap)
    props.flow.handleRemoveFilter(row.index)
  else
    props.flow.handleFilterEdit(row.index)
}
</script>

<template>
  <div class="astryx-power-search-sheet astryx-power-search-sheet--fixed-footer" data-sheet-step="manage">
    <div class="astryx-power-search-sheet__header">
      <div class="astryx-power-search-sheet__header-row">
        <Heading :level="3" class="astryx-power-search-sheet__title">
          {{ text.filtersTitle }}
        </Heading>
        <Button
          v-if="flow.isInteractive.value && rows.length > 0"
          data-sheet-add=""
          :label="text.addFilter"
          :icon="PlusGlyph"
          is-icon-only
          variant="secondary"
          size="md"
          @click="flow.openFieldList"
        />
      </div>
    </div>
    <div class="astryx-power-search-sheet__scroll">
      <div class="astryx-power-search-sheet__content">
        <EmptyState
          v-if="rows.length === 0"
          class="astryx-power-search-sheet__empty"
          :title="flow.isDraftDirty.value ? text.noFiltersInDraft : text.noFilters"
          :description="text.noFiltersDescription"
          :heading-level="4"
        >
          <template #icon>
            <Icon icon="funnel" size="lg" color="secondary" />
          </template>
          <template v-if="flow.isInteractive.value" #actions>
            <Button data-sheet-add="" :label="text.addFilter" :icon="PlusGlyph" variant="primary" size="lg" @click="flow.openFieldList" />
          </template>
        </EmptyState>
        <List v-else has-dividers density="spacious" edge="bleed">
          <ListItem
            v-for="row in rows"
            :key="row.key"
            :data-sheet-filter="row.index"
            :on-click="row.isEditable ? () => onRowClick(row) : undefined"
          >
            <template #label>
              <template v-if="row.split">
                {{ row.split.before }}<span class="astryx-power-search-sheet__row-value">{{ row.parts.value }}</span>{{ row.split.after }}
              </template>
              <template v-else>
                {{ row.parts.label }}
              </template>
            </template>
            <template v-if="row.isEditable" #endContent>
              <IconButton
                data-sheet-remove=""
                :label="row.removeLabel"
                icon="close"
                variant="ghost"
                size="md"
                @click.stop="flow.handleRemoveFilter(row.index)"
              />
            </template>
          </ListItem>
        </List>
      </div>
    </div>
    <div v-if="isFooterShown" class="astryx-power-search-sheet__footer">
      <Button
        v-if="isClearAllShown"
        data-sheet-clear=""
        class="astryx-power-search-sheet__footer-action"
        :label="text.clearAll"
        variant="secondary"
        size="lg"
        @click="flow.openClearConfirmation"
      />
      <Button
        class="astryx-power-search-sheet__footer-action"
        :label="text.done"
        variant="primary"
        size="lg"
        @click="flow.commitAndClose"
      />
    </div>
  </div>
</template>
