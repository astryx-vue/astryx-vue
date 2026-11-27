<script setup lang="ts">
/**
 * 「添加筛选条件」那一步。配置了 `contentSearchFieldKey`、它的默认运算符取字符串时，顶部是内容搜索，
 * 列出和行内菜单一样的建议，回车选第一条；否则字段多到 8 个时顶部是字段搜索，下面按分组列出字段，
 * 没分组的排最前（「常规」）。只有一个 `empty` 运算符的字段一点就加，行末是加号，其余是箭头。
 * 从触发器直接进来时（没有条件）底下有「完成」。
 */
import type { PowerSearchLookup } from './config.js'
import type { PowerSearchField, PowerSearchItem } from './types.js'
import type { PowerSearchSheetFlow } from './usePowerSearchSheetFlow.js'
import { computed, useId, useTemplateRef } from 'vue'
import Button from '../Button/Button.vue'
import { dismissSearchOnTouchDrag } from '../composables/internal/dismissSearchOnTouchDrag.js'
import EmptyState from '../EmptyState/EmptyState.vue'
import Heading from '../Heading/Heading.vue'
import Icon from '../Icon/Icon.vue'
import List from '../List/List.vue'
import ListItem from '../List/ListItem.vue'
import { useComponentMessages } from '../locale/context.js'
import { powerSearchSheetMessages } from '../locale/messages/power-search-sheet.js'
import TextInput from '../TextInput/TextInput.vue'
import { fieldMatchesQuery } from './sheetFilterIdentity.js'
import { PlusGlyph } from './sheetIcons.js'

defineOptions({ name: 'AstryxPowerSearchSheetFields' })

const props = defineProps<{
  flow: PowerSearchSheetFlow
  lookup: PowerSearchLookup
  /** 内容搜索的占位文字：PowerSearch 自己的占位文字。 */
  placeholder: string
  /** 行内菜单的建议来源。 */
  search: (query: string) => PowerSearchItem[]
}>()

/** 字段少于这么多时整张清单都在屏幕上，搜索框只是噪音。 */
const SEARCHABLE_FIELD_COUNT = 8
const MAX_BROWSE_ITEMS = 1000

const messages = useComponentMessages({ powerSearchSheet: powerSearchSheetMessages })
const text = computed(() => messages.value.powerSearchSheet)
const resultsId = `astryx-power-search-sheet-${useId()}-results`
const rootRef = useTemplateRef<HTMLElement>('rootRef')

const fields = computed(() => props.lookup.getVisibleFields())
const hasContentSearch = computed(() => {
  const key = props.lookup.config.contentSearchFieldKey
  return key != null && props.lookup.getDefaultOperator(key)?.value.type === 'string'
})
const isFieldSearchShown = computed(() => !hasContentSearch.value && fields.value.length >= SEARCHABLE_FIELD_COUNT)
const normalizedFieldQuery = computed(() => props.flow.fieldQuery.value.trim().toLowerCase())

const contentResults = computed<PowerSearchItem[]>(() => {
  if (!hasContentSearch.value || !props.flow.isFieldsSheetOpen.value || !props.flow.isInteractive.value)
    return []
  return props.search(props.flow.contentQuery.value)
    .filter(item => item.auxiliaryData != null && props.lookup.getField(item.auxiliaryData.fieldKey) != null)
    .slice(0, MAX_BROWSE_ITEMS)
})

const groupedFields = computed(() => {
  const groups = new Map<string, PowerSearchField[]>([['', []]])
  for (const field of fields.value) {
    if (!fieldMatchesQuery(field, normalizedFieldQuery.value))
      continue
    const group = field.group ?? ''
    groups.set(group, [...(groups.get(group) ?? []), field])
  }
  return [...groups].filter(([, list]) => list.length > 0)
})

const drag = dismissSearchOnTouchDrag(
  () => [...(rootRef.value?.querySelectorAll<HTMLInputElement>('.astryx-power-search-sheet__header input') ?? [])],
  () => rootRef.value?.closest<HTMLElement>('[tabindex="-1"]'),
)

function onContentKeydown(event: KeyboardEvent): void {
  if (event.isComposing || event.key !== 'Enter' || contentResults.value[0] == null)
    return
  event.preventDefault()
  props.flow.handleContentSuggestionSelect(contentResults.value[0])
}
</script>

<template>
  <div ref="rootRef" class="astryx-power-search-sheet astryx-power-search-sheet--fixed-footer" data-sheet-step="fields">
    <div class="astryx-power-search-sheet__header">
      <div class="astryx-power-search-sheet__header-row">
        <Heading :level="3" class="astryx-power-search-sheet__title">
          {{ text.addFilter }}
        </Heading>
      </div>
      <TextInput
        v-if="hasContentSearch"
        data-sheet-content-search=""
        :model-value="flow.contentQuery.value"
        :label="text.search"
        is-label-hidden
        role="searchbox"
        :aria-controls="resultsId"
        :placeholder="placeholder"
        start-icon="search"
        has-clear
        :is-disabled="!flow.isInteractive.value"
        size="lg"
        width="100%"
        @update:model-value="flow.setContentQuery(String($event ?? ''))"
        @keydown="onContentKeydown"
      />
      <TextInput
        v-else-if="isFieldSearchShown"
        :model-value="flow.fieldQuery.value"
        :label="text.searchFields"
        is-label-hidden
        :placeholder="text.searchFieldsPlaceholder"
        start-icon="search"
        :is-disabled="!flow.isInteractive.value"
        size="lg"
        width="100%"
        @update:model-value="flow.setFieldQuery(String($event ?? ''))"
      />
    </div>
    <div
      class="astryx-power-search-sheet__scroll"
      @touchstart="drag.onTouchstart"
      @touchmove="drag.onTouchmove"
      @touchend="drag.onTouchend"
      @touchcancel="drag.onTouchcancel"
    >
      <div class="astryx-power-search-sheet__content">
        <template v-if="hasContentSearch">
          <List v-if="contentResults.length > 0" :id="resultsId" :aria-label="text.searchResults" has-dividers density="spacious" edge="bleed">
            <ListItem
              v-for="item in contentResults"
              :key="item.id"
              :label="item.label"
              :is-disabled="!flow.isInteractive.value"
              :on-click="() => flow.handleContentSuggestionSelect(item)"
            />
          </List>
          <div v-else :id="resultsId" class="astryx-power-search-sheet__results-empty">
            <EmptyState
              v-if="flow.contentQuery.value.trim() !== '' && flow.step.value === 'fields'"
              class="astryx-power-search-sheet__empty"
              :title="text.noResults"
              :description="text.tryDifferentSearch"
              :heading-level="4"
              is-compact
            >
              <template #icon>
                <Icon icon="search" size="lg" color="secondary" />
              </template>
            </EmptyState>
          </div>
        </template>
        <EmptyState
          v-else-if="groupedFields.length === 0 && normalizedFieldQuery !== '' && flow.step.value === 'fields'"
          class="astryx-power-search-sheet__empty"
          :title="text.noMatchingFields"
          :description="text.tryDifferentSearch"
          :heading-level="4"
          is-compact
        >
          <template #icon>
            <Icon icon="search" size="lg" color="secondary" />
          </template>
        </EmptyState>
        <template v-else>
          <List v-for="[group, groupFields] in groupedFields" :key="group" has-dividers density="spacious" edge="bleed">
            <template #header>
              <Heading :level="4">
                {{ group === '' ? text.ungroupedFields : group }}
              </Heading>
            </template>
            <ListItem
              v-for="field in groupFields"
              :key="field.key"
              :data-sheet-field="field.key"
              :label="field.label"
              :is-disabled="!flow.isInteractive.value"
              :on-click="() => flow.handleFieldSelect(field)"
            >
              <template v-if="field.icon" #startContent>
                <Icon :icon="field.icon" size="sm" />
              </template>
              <template #endContent>
                <Icon v-if="flow.isImmediateAddField(field)" :icon="PlusGlyph" size="sm" color="secondary" />
                <Icon v-else class="astryx-power-search-sheet__chevron" icon="chevronRight" size="sm" color="secondary" />
              </template>
            </ListItem>
          </List>
        </template>
      </div>
    </div>
    <div v-if="flow.isDirectEntry.value" class="astryx-power-search-sheet__footer">
      <Button
        class="astryx-power-search-sheet__footer-action"
        :label="text.done"
        variant="primary"
        size="lg"
        width="100%"
        @click="flow.commitAndClose"
      />
    </div>
  </div>
</template>
