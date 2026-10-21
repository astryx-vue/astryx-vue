<script setup lang="ts">
import type { AsyncSourceStatus } from '../composables/useAsyncSource.js'
import type { OptionActionNode } from '../selectors/optionAction.js'
import { computed } from 'vue'
import { isOptionAction } from '../selectors/optionAction.js'
import { OptionAction } from '../selectors/optionActionView.js'
import Spinner from '../Spinner/Spinner.vue'
import TypeaheadItem from './TypeaheadItem.vue'

export interface TypeaheadMenuEntryView {
  id: string
  label: string
  description?: string
  disabled?: boolean
  selected?: boolean
  group?: string
  action?: OptionActionNode | null
}

interface MenuRow {
  entry: TypeaheadMenuEntryView
  /** 在完整列表里的位置。方向键和 option id 都按它算。 */
  index: number
}

interface MenuGroup {
  heading?: string
  rows: MenuRow[]
}

defineOptions({ name: 'AstryxTypeaheadMenu' })

const props = defineProps<{
  entries: readonly TypeaheadMenuEntryView[]
  activeIndex: number
  status: AsyncSourceStatus
  listboxId: string
  emptyText: string
  loadingText: string
  errorText: string
  grid?: boolean
  actionIndex?: number
}>()

const emit = defineEmits<{
  select: [id: string]
  highlight: [index: number]
}>()

/**
 * 同一个 `group` 的条目归到一起，带标题的那一叠画标题。
 * 分组不重排：顺序照搜索结果来，这样方向键和画面总是一致。
 */
const groups = computed<MenuGroup[]>(() => {
  const buckets = new Map<string, MenuGroup>()
  for (const [index, entry] of props.entries.entries()) {
    const key = entry.group ?? ''
    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = { heading: entry.group, rows: [] }
      buckets.set(key, bucket)
    }
    bucket.rows.push({ entry, index })
  }
  return [...buckets.values()]
})

function optionId(index: number): string {
  return `${props.listboxId}-option-${index}`
}

function actionId(index: number): string {
  return `${props.listboxId}-action-${index}`
}

function onOptionClick(id: string, disabled?: boolean): void {
  if (!disabled)
    emit('select', id)
}
</script>

<template>
  <div class="astryx-typeahead-menu" role="presentation">
    <div
      v-if="props.status === 'loading' && props.entries.length === 0"
      class="astryx-typeahead-state"
      role="status"
    >
      <Spinner size="sm" :label="props.loadingText" />
    </div>
    <div v-else-if="props.status === 'error'" class="astryx-typeahead-state" role="alert">
      {{ props.errorText }}
    </div>
    <div v-else-if="props.entries.length === 0" class="astryx-typeahead-state" :role="props.grid ? 'presentation' : 'option'" :aria-selected="props.grid ? undefined : 'false'" aria-disabled="true">
      <slot name="empty">
        {{ props.emptyText }}
      </slot>
    </div>
    <div v-else class="astryx-typeahead-options" role="presentation">
      <div
        v-for="(group, groupIndex) in groups"
        :key="group.heading ?? `__ungrouped-${groupIndex}`"
        class="astryx-typeahead-group"
        :role="props.grid ? (group.heading ? 'rowgroup' : 'presentation') : (group.heading ? 'group' : 'presentation')"
        :aria-label="group.heading"
      >
        <div v-if="group.heading" class="astryx-typeahead-group-heading" aria-hidden="true">
          {{ group.heading }}
        </div>
        <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events, vue-a11y/no-static-element-interactions -- 选项不进 Tab 序，方向键和 Enter 由组合框输入处理。 -->
        <div
          v-for="row in group.rows"
          :id="props.grid ? undefined : optionId(row.index)"
          :key="row.entry.id"
          class="astryx-typeahead-option"
          :class="{
            'is-active': row.index === props.activeIndex,
            'is-selected': row.entry.selected,
            'is-disabled': row.entry.disabled,
          }"
          :role="props.grid ? 'row' : 'option'"
          :aria-selected="row.entry.selected ? 'true' : 'false'"
          :aria-disabled="row.entry.disabled || undefined"
          :data-option-id="row.entry.id"
          tabindex="-1"
          @mousedown.prevent
          @mouseenter="emit('highlight', row.index)"
          @click="props.grid ? undefined : onOptionClick(row.entry.id, row.entry.disabled)"
        >
          <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events -- 选项格不进 Tab 序，方向键和 Enter 由组合框输入处理。 -->
          <div
            v-if="props.grid"
            :id="optionId(row.index)"
            class="astryx-typeahead-option-main"
            role="gridcell"
            tabindex="-1"
            @click="onOptionClick(row.entry.id, row.entry.disabled)"
          >
            <span class="astryx-typeahead-option-copy">
              <slot name="item" :entry="row.entry" :is-active="row.index === props.activeIndex" :is-selected="Boolean(row.entry.selected)">
                <TypeaheadItem
                  :item="{ id: row.entry.id, label: row.entry.label, description: row.entry.description, disabled: row.entry.disabled }"
                  :is-disabled="row.entry.disabled"
                />
              </slot>
            </span>
            <svg v-if="row.entry.selected" class="astryx-typeahead-check" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div
            v-if="props.grid"
            :id="isOptionAction(row.entry.action) ? undefined : actionId(row.index)"
            class="astryx-typeahead-option-action"
            :class="{ 'is-active': props.actionIndex === row.index }"
            role="gridcell"
            @mousedown.stop
            @click.stop
          >
            <OptionAction v-if="isOptionAction(row.entry.action)" :node="row.entry.action" :dom-id="actionId(row.index)" />
          </div>
          <span v-if="!props.grid" class="astryx-typeahead-option-copy">
            <slot name="item" :entry="row.entry" :is-active="row.index === props.activeIndex" :is-selected="Boolean(row.entry.selected)">
              <TypeaheadItem
                :item="{ id: row.entry.id, label: row.entry.label, description: row.entry.description, disabled: row.entry.disabled }"
                :is-disabled="row.entry.disabled"
              />
            </slot>
          </span>
          <svg v-if="!props.grid && row.entry.selected" class="astryx-typeahead-check" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
