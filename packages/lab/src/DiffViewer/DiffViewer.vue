<script setup lang="ts">
import type { TokenColor } from '@astryx-vue/core'
import type { CSSProperties, StyleValue } from 'vue'
import type { DiffViewerFileStatus, DiffViewerLineRef } from './diffTypes.js'
import type { LineCell, SplitRow, UnifiedRow } from './rows.js'
import type { DiffViewerEmits, DiffViewerProps, DiffViewerSlots } from './types.js'
import { Icon, SyntaxTheme, Token, useScrollableArea, VisuallyHidden } from '@astryx-vue/core'
import { computed, getCurrentInstance, ref, useAttrs, useId, useSlots } from 'vue'
import DiffViewerTable from './DiffViewerTable.vue'
import { inferLanguage } from './language.js'
import { buildCells, buildSplitRows, buildUnifiedRows } from './rows.js'
import '../../styles/diff-viewer.css'

defineOptions({ name: 'AstryxDiffViewer', inheritAttrs: false })

const props = withDefaults(defineProps<DiffViewerProps>(), {
  viewMode: 'unified',
  language: undefined,
  hasLineNumbers: true,
  isWrapped: false,
  inlineHighlight: 'word',
  changeIndicator: 'classic',
  hasChangeBackground: true,
  isCollapsible: true,
  isCollapsed: undefined,
  defaultIsCollapsed: false,
  maxHeight: undefined,
  syntaxTheme: undefined,
  label: 'Diff',
  renderLineAnnotation: undefined,
})

const emit = defineEmits<DiffViewerEmits>()
defineSlots<DiffViewerSlots>()
const slots = useSlots()
const attrs = useAttrs()
const instance = getCurrentInstance()
const bodyId = `astryx-diff-viewer-body-${useId()}`

const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const rootClass = computed(() => attrs.class)
const rootStyle = computed(() => attrs.style as StyleValue)

const path = computed(() => props.file.newPath ?? props.file.oldPath)
const displayPath = computed(() => {
  if (props.file.status === 'renamed' && props.file.oldPath != null && props.file.newPath != null)
    return `${props.file.oldPath} → ${props.file.newPath}`

  return path.value
})
const language = computed(() => props.language ?? inferLanguage(path.value))
const scrollLabel = computed(() => displayPath.value ?? props.label)

const cells = computed(() => {
  const built = buildCells(props.file, language.value, props.inlineHighlight)
  const annotate = props.renderLineAnnotation

  if (annotate == null)
    return built

  return built.map(hunk => hunk.map((cell): LineCell => {
    const note = annotate(cell.ref)
    return { ...cell, note: typeof note === 'boolean' ? null : note }
  }))
})

const unifiedRows = computed<UnifiedRow[]>(() =>
  props.viewMode === 'unified' ? buildUnifiedRows(props.file, cells.value) : [],
)
const splitRows = computed<SplitRow[]>(() =>
  props.viewMode === 'split' ? buildSplitRows(props.file, cells.value) : [],
)

const stats = computed(() => {
  let added = 0
  let removed = 0
  let maxLineNumber = 1

  for (const hunk of props.file.hunks) {
    for (const line of hunk.lines) {
      if (line.kind === 'added')
        added++
      else if (line.kind === 'removed')
        removed++

      maxLineNumber = Math.max(maxLineNumber, line.oldLineNumber ?? 0, line.newLineNumber ?? 0)
    }
  }

  return { added, removed, digits: String(maxLineNumber).length }
})

const addedText = computed(() => `+${stats.value.added}`)
const removedText = computed(() => `−${stats.value.removed}`)
const statsText = computed(() => {
  const lines = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
  return `${lines(stats.value.added, 'line')} added, ${lines(stats.value.removed, 'line')} removed`
})

const uncontrolledCollapsed = ref(props.defaultIsCollapsed)
const canCollapse = computed(() => props.isCollapsible && displayPath.value != null)
const isCollapsed = computed(() => canCollapse.value && (props.isCollapsed ?? uncontrolledCollapsed.value))

function toggleCollapsed(): void {
  const next = !isCollapsed.value

  if (props.isCollapsed === undefined)
    uncontrolledCollapsed.value = next

  emit('update:isCollapsed', next)
  emit('collapsedChange', next)
}

const STATUS_COLORS: Partial<Record<DiffViewerFileStatus, TokenColor>> = {
  added: 'green',
  deleted: 'red',
  renamed: 'blue',
}

const statusColor = computed(() => STATUS_COLORS[props.file.status])
const statusLabel = computed(() => {
  switch (props.file.status) {
    case 'added':
      return 'Added'
    case 'deleted':
      return 'Deleted'
    case 'renamed':
      return 'Renamed'
    default:
      return null
  }
})

const hasHeader = computed(() => displayPath.value != null || slots.headerEnd != null)
const scrollStyle = computed<CSSProperties | undefined>(() => props.maxHeight == null
  ? undefined
  : { maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight })

const scroll = useScrollableArea({
  axis: 'both',
  keyboardAccess: { owner: 'viewport', role: 'group', label: props.label },
})

const hasLineNumberClick = computed(() => instance?.vnode.props?.onLineNumberClick != null)

function relayLineNumberClick(ref: DiffViewerLineRef, event: MouseEvent): void {
  emit('lineNumberClick', ref, event)
}
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="astryx-diff-viewer"
    :class="rootClass"
    :style="rootStyle"
    :data-view-mode="viewMode"
  >
    <component :is="syntaxTheme != null ? SyntaxTheme : 'div'" v-bind="syntaxTheme != null ? { theme: syntaxTheme } : {}">
      <div v-if="hasHeader" class="astryx-diff-viewer__header" :class="{ 'astryx-diff-viewer__header--divided': !isCollapsed }">
        <button
          v-if="canCollapse"
          type="button"
          class="astryx-diff-viewer__toggle"
          :aria-expanded="!isCollapsed"
          :aria-controls="bodyId"
          @click="toggleCollapsed"
        >
          <span class="astryx-diff-viewer__chevron" :class="{ 'astryx-diff-viewer__chevron--expanded': !isCollapsed }">
            <Icon icon="chevronRight" size="xsm" color="inherit" />
          </span>
          <span class="astryx-diff-viewer__path">{{ displayPath }}</span>
        </button>
        <span v-else-if="displayPath != null" class="astryx-diff-viewer__path">{{ displayPath }}</span>

        <Token v-if="statusColor != null && statusLabel != null" size="sm" :color="statusColor" :label="statusLabel" />

        <span v-if="stats.added > 0 || stats.removed > 0" class="astryx-diff-viewer__stats">
          <span aria-hidden="true" class="astryx-diff-viewer__stat-added">{{ addedText }}</span>
          <span aria-hidden="true" class="astryx-diff-viewer__stat-removed">{{ removedText }}</span>
          <VisuallyHidden>{{ statsText }}</VisuallyHidden>
        </span>

        <div v-if="$slots.headerEnd" class="astryx-diff-viewer__header-end">
          <slot name="headerEnd" />
        </div>
      </div>

      <div :id="bodyId" :hidden="isCollapsed">
        <template v-if="!isCollapsed">
          <div v-if="file.isBinary" class="astryx-diff-viewer__message">
            Binary file not shown
          </div>
          <div v-else-if="file.hunks.length === 0" class="astryx-diff-viewer__message">
            No content changes
          </div>
          <div
            v-else
            :ref="scroll.viewport"
            v-bind="scroll.viewportAttrs.value"
            class="astryx-diff-viewer__viewport"
            :aria-label="scrollLabel"
            :style="[scroll.viewportStyle.value, scrollStyle]"
          >
            <div :ref="scroll.content" class="astryx-diff-viewer__content">
              <DiffViewerTable
                :view-mode="viewMode"
                :unified-rows="unifiedRows"
                :split-rows="splitRows"
                :has-line-numbers="hasLineNumbers"
                :is-wrapped="isWrapped"
                :change-indicator="changeIndicator"
                :has-change-background="hasChangeBackground"
                :has-line-number-click="hasLineNumberClick"
                :digits="stats.digits"
                @line-number-click="relayLineNumberClick"
              />
            </div>
          </div>
        </template>
      </div>
    </component>
  </div>
</template>
