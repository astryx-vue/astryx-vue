<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { DiffViewerLineRef, DiffViewerSide } from './diffTypes.js'
import type { LineCell, SplitRow, UnifiedRow } from './rows.js'
import type { DiffViewerChangeIndicator, DiffViewerViewMode } from './types.js'
import { VisuallyHidden } from '@astryx-vue/core'
import { computed } from 'vue'
import RenderVNode from './RenderVNode.js'

defineOptions({ name: 'AstryxDiffViewerTable' })

const props = defineProps<{
  viewMode: DiffViewerViewMode
  unifiedRows: UnifiedRow[]
  splitRows: SplitRow[]
  hasLineNumbers: boolean
  isWrapped: boolean
  changeIndicator: DiffViewerChangeIndicator
  hasChangeBackground: boolean
  hasLineNumberClick: boolean
  digits: number
}>()

const emit = defineEmits<{
  lineNumberClick: [ref: DiffViewerLineRef, event: MouseEvent]
}>()

const unifiedColumns = computed(() => (props.hasLineNumbers ? 2 : 0) + 2)
const splitSideColumns = computed(() => (props.hasLineNumbers ? 1 : 0) + 2)
const tableStyle = computed<CSSProperties>(() => ({
  '--astryx-diff-viewer-gutter-width': `${props.digits}ch`,
}))

function lineNumber(cell: LineCell | null, side: DiffViewerSide): number | null {
  if (cell == null)
    return null
  return side === 'old' ? cell.line.oldLineNumber : cell.line.newLineNumber
}

/** Only the gutter of the line's own anchor side is a button. */
function lineAction(cell: LineCell | null, side: DiffViewerSide): DiffViewerLineRef | null {
  if (cell == null || cell.ref.side !== side || lineNumber(cell, side) == null)
    return null
  return cell.ref
}

function emitLineNumberClick(cell: LineCell | null, side: DiffViewerSide, event: MouseEvent): void {
  const action = lineAction(cell, side)
  if (action != null)
    emit('lineNumberClick', action, event)
}

function lineNumberButtonLabel(side: DiffViewerSide, number: number | null): string {
  return `${side === 'old' ? 'Original' : 'Changed'} line ${number ?? ''}`
}

function diffKind(cell: LineCell | null): string | undefined {
  const kind = cell?.line.kind
  return kind !== 'context' ? kind : undefined
}

function cellClass(cell: LineCell | null): Record<string, boolean> {
  return {
    'is-added': cell?.line.kind === 'added',
    'is-removed': cell?.line.kind === 'removed',
    'is-filler': cell == null,
  }
}

function oldNote(row: SplitRow): unknown {
  if (row.type !== 'pair' || row.old == null || row.old.line.kind === 'context')
    return null
  return row.old.note ?? null
}

function newNote(row: SplitRow): unknown {
  return row.type === 'pair' ? row.new?.note ?? null : null
}
</script>

<template>
  <table
    v-if="viewMode === 'unified'"
    class="astryx-diff-viewer__table"
    :class="{ 'astryx-diff-viewer__table--wrapped': isWrapped }"
    :data-change-indicator="changeIndicator"
    :data-change-background="hasChangeBackground ? undefined : 'false'"
    :style="tableStyle"
  >
    <colgroup>
      <template v-if="hasLineNumbers">
        <col class="astryx-diff-viewer__gutter-col">
        <col class="astryx-diff-viewer__gutter-col">
      </template>
      <col class="astryx-diff-viewer__marker-col">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th v-if="hasLineNumbers" scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Original line number</VisuallyHidden>
        </th>
        <th v-if="hasLineNumbers" scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Changed line number</VisuallyHidden>
        </th>
        <th scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Change</VisuallyHidden>
        </th>
        <th scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Code</VisuallyHidden>
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="row in unifiedRows" :key="row.key">
        <tr v-if="row.type === 'hunk'">
          <td :colspan="unifiedColumns" class="astryx-diff-viewer__hunk">
            <span class="astryx-diff-viewer__ltr">{{ row.header }}</span>
          </td>
        </tr>
        <template v-else>
          <tr>
            <td v-if="hasLineNumbers" class="astryx-diff-viewer__gutter" :class="cellClass(row.cell)">
              <button
                v-if="hasLineNumberClick && lineAction(row.cell, 'old') != null"
                type="button"
                class="astryx-diff-viewer__gutter-button"
                data-diff-line-button
                :aria-label="lineNumberButtonLabel('old', lineNumber(row.cell, 'old'))"
                @click="emitLineNumberClick(row.cell, 'old', $event)"
              >
                {{ lineNumber(row.cell, 'old') }}
              </button>
              <template v-else>
                {{ lineNumber(row.cell, 'old') }}
              </template>
            </td>
            <td v-if="hasLineNumbers" class="astryx-diff-viewer__gutter" :class="cellClass(row.cell)">
              <button
                v-if="hasLineNumberClick && lineAction(row.cell, 'new') != null"
                type="button"
                class="astryx-diff-viewer__gutter-button"
                data-diff-line-button
                :aria-label="lineNumberButtonLabel('new', lineNumber(row.cell, 'new'))"
                @click="emitLineNumberClick(row.cell, 'new', $event)"
              >
                {{ lineNumber(row.cell, 'new') }}
              </button>
              <template v-else>
                {{ lineNumber(row.cell, 'new') }}
              </template>
            </td>
            <td class="astryx-diff-viewer__marker" :class="cellClass(row.cell)">
              <template v-if="row.cell.line.kind === 'added'">
                <span v-if="changeIndicator === 'classic'" aria-hidden="true">+</span>
                <VisuallyHidden>Added</VisuallyHidden>
              </template>
              <template v-else-if="row.cell.line.kind === 'removed'">
                <span v-if="changeIndicator === 'classic'" aria-hidden="true">-</span>
                <VisuallyHidden>Removed</VisuallyHidden>
              </template>
            </td>
            <td
              class="astryx-diff-viewer__code"
              :class="[cellClass(row.cell), { 'astryx-diff-viewer__code--wrapped': isWrapped }]"
              :data-diff="diffKind(row.cell)"
            >
              <span class="astryx-diff-viewer__ltr">
                <template v-for="(group, groupIndex) in row.cell.groups" :key="groupIndex">
                  <span
                    v-if="group.changed"
                    class="astryx-diff-viewer__change"
                    data-diff-change
                    :data-kind="row.cell.line.kind"
                  >
                    <template v-for="(part, partIndex) in group.parts" :key="partIndex">
                      <span v-if="part.type != null" :class="`astryx-token-${part.type}`">{{ part.text }}</span>
                      <template v-else>{{ part.text }}</template>
                    </template>
                  </span>
                  <template v-else>
                    <template v-for="(part, partIndex) in group.parts" :key="partIndex">
                      <span v-if="part.type != null" :class="`astryx-token-${part.type}`">{{ part.text }}</span>
                      <template v-else>{{ part.text }}</template>
                    </template>
                  </template>
                </template>
              </span>
            </td>
          </tr>
          <tr v-if="row.cell.note != null">
            <td :colspan="unifiedColumns" class="astryx-diff-viewer__annotation">
              <div class="astryx-diff-viewer__annotation-content">
                <RenderVNode :content="row.cell.note" />
              </div>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>

  <table
    v-else
    class="astryx-diff-viewer__table"
    :class="{ 'astryx-diff-viewer__table--wrapped': isWrapped }"
    :data-change-indicator="changeIndicator"
    :data-change-background="hasChangeBackground ? undefined : 'false'"
    :style="tableStyle"
  >
    <colgroup>
      <template v-if="hasLineNumbers">
        <col class="astryx-diff-viewer__gutter-col">
      </template>
      <col class="astryx-diff-viewer__marker-col">
      <col>
      <template v-if="hasLineNumbers">
        <col class="astryx-diff-viewer__gutter-col">
      </template>
      <col class="astryx-diff-viewer__marker-col">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th v-if="hasLineNumbers" scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Original line number</VisuallyHidden>
        </th>
        <th scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Change</VisuallyHidden>
        </th>
        <th scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Original code</VisuallyHidden>
        </th>
        <th v-if="hasLineNumbers" scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Changed line number</VisuallyHidden>
        </th>
        <th scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Change</VisuallyHidden>
        </th>
        <th scope="col" class="astryx-diff-viewer__column-header">
          <VisuallyHidden>Changed code</VisuallyHidden>
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="row in splitRows" :key="row.key">
        <tr v-if="row.type === 'hunk'">
          <td :colspan="splitSideColumns * 2" class="astryx-diff-viewer__hunk">
            <span class="astryx-diff-viewer__ltr">{{ row.header }}</span>
          </td>
        </tr>
        <template v-else>
          <tr>
            <td v-if="hasLineNumbers" class="astryx-diff-viewer__gutter" :class="cellClass(row.old)">
              <button
                v-if="hasLineNumberClick && lineAction(row.old, 'old') != null"
                type="button"
                class="astryx-diff-viewer__gutter-button"
                data-diff-line-button
                :aria-label="lineNumberButtonLabel('old', lineNumber(row.old, 'old'))"
                @click="emitLineNumberClick(row.old, 'old', $event)"
              >
                {{ lineNumber(row.old, 'old') }}
              </button>
              <template v-else>
                {{ lineNumber(row.old, 'old') }}
              </template>
            </td>
            <td class="astryx-diff-viewer__marker" :class="cellClass(row.old)">
              <template v-if="row.old?.line.kind === 'added'">
                <span v-if="changeIndicator === 'classic'" aria-hidden="true">+</span>
                <VisuallyHidden>Added</VisuallyHidden>
              </template>
              <template v-else-if="row.old?.line.kind === 'removed'">
                <span v-if="changeIndicator === 'classic'" aria-hidden="true">-</span>
                <VisuallyHidden>Removed</VisuallyHidden>
              </template>
            </td>
            <td
              class="astryx-diff-viewer__code astryx-diff-viewer__code--old"
              :class="[cellClass(row.old), { 'astryx-diff-viewer__code--wrapped': isWrapped }]"
              :data-diff="diffKind(row.old)"
            >
              <span class="astryx-diff-viewer__ltr">
                <template v-for="(group, groupIndex) in row.old?.groups ?? []" :key="groupIndex">
                  <span
                    v-if="group.changed"
                    class="astryx-diff-viewer__change"
                    data-diff-change
                    :data-kind="row.old?.line.kind"
                  >
                    <template v-for="(part, partIndex) in group.parts" :key="partIndex">
                      <span v-if="part.type != null" :class="`astryx-token-${part.type}`">{{ part.text }}</span>
                      <template v-else>{{ part.text }}</template>
                    </template>
                  </span>
                  <template v-else>
                    <template v-for="(part, partIndex) in group.parts" :key="partIndex">
                      <span v-if="part.type != null" :class="`astryx-token-${part.type}`">{{ part.text }}</span>
                      <template v-else>{{ part.text }}</template>
                    </template>
                  </template>
                </template>
              </span>
            </td>

            <td v-if="hasLineNumbers" class="astryx-diff-viewer__gutter" :class="cellClass(row.new)">
              <button
                v-if="hasLineNumberClick && lineAction(row.new, 'new') != null"
                type="button"
                class="astryx-diff-viewer__gutter-button"
                data-diff-line-button
                :aria-label="lineNumberButtonLabel('new', lineNumber(row.new, 'new'))"
                @click="emitLineNumberClick(row.new, 'new', $event)"
              >
                {{ lineNumber(row.new, 'new') }}
              </button>
              <template v-else>
                {{ lineNumber(row.new, 'new') }}
              </template>
            </td>
            <td class="astryx-diff-viewer__marker" :class="cellClass(row.new)">
              <template v-if="row.new?.line.kind === 'added'">
                <span v-if="changeIndicator === 'classic'" aria-hidden="true">+</span>
                <VisuallyHidden>Added</VisuallyHidden>
              </template>
              <template v-else-if="row.new?.line.kind === 'removed'">
                <span v-if="changeIndicator === 'classic'" aria-hidden="true">-</span>
                <VisuallyHidden>Removed</VisuallyHidden>
              </template>
            </td>
            <td
              class="astryx-diff-viewer__code"
              :class="[cellClass(row.new), { 'astryx-diff-viewer__code--wrapped': isWrapped }]"
              :data-diff="diffKind(row.new)"
            >
              <span class="astryx-diff-viewer__ltr">
                <template v-for="(group, groupIndex) in row.new?.groups ?? []" :key="groupIndex">
                  <span
                    v-if="group.changed"
                    class="astryx-diff-viewer__change"
                    data-diff-change
                    :data-kind="row.new?.line.kind"
                  >
                    <template v-for="(part, partIndex) in group.parts" :key="partIndex">
                      <span v-if="part.type != null" :class="`astryx-token-${part.type}`">{{ part.text }}</span>
                      <template v-else>{{ part.text }}</template>
                    </template>
                  </span>
                  <template v-else>
                    <template v-for="(part, partIndex) in group.parts" :key="partIndex">
                      <span v-if="part.type != null" :class="`astryx-token-${part.type}`">{{ part.text }}</span>
                      <template v-else>{{ part.text }}</template>
                    </template>
                  </template>
                </template>
              </span>
            </td>
          </tr>
          <tr v-if="oldNote(row) != null || newNote(row) != null">
            <td :colspan="splitSideColumns" class="astryx-diff-viewer__annotation astryx-diff-viewer__code--old">
              <div v-if="oldNote(row) != null" class="astryx-diff-viewer__annotation-content">
                <RenderVNode :content="oldNote(row)" />
              </div>
            </td>
            <td :colspan="splitSideColumns" class="astryx-diff-viewer__annotation">
              <div v-if="newNote(row) != null" class="astryx-diff-viewer__annotation-content">
                <RenderVNode :content="newNote(row)" />
              </div>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>
