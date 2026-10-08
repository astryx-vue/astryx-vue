<script setup lang="ts">
import type { CSSProperties, StyleValue } from 'vue'
import type { SpacingStep } from '../Stack/types.js'
import type { GridColumns, GridProps, GridSizeValue, GridSlots } from './types.js'
import { computed, useAttrs, useTemplateRef } from 'vue'

import '../../styles/grid.css'

defineOptions({ name: 'AstryxGrid', inheritAttrs: false })

const props = withDefaults(defineProps<GridProps>(), {
  align: 'stretch',
  justify: 'stretch',
})

defineSlots<GridSlots>()

const attrs = useAttrs()
const root = useTemplateRef<HTMLDivElement>('root')

defineExpose({ element: root })

const spacingVariables: Record<SpacingStep, string> = {
  0: 'var(--astryx-spacing-0, 0px)',
  0.5: 'var(--astryx-spacing-0-5, 2px)',
  1: 'var(--astryx-spacing-1, 4px)',
  1.5: 'var(--astryx-spacing-1-5, 6px)',
  2: 'var(--astryx-spacing-2, 8px)',
  3: 'var(--astryx-spacing-3, 12px)',
  4: 'var(--astryx-spacing-4, 16px)',
  5: 'var(--astryx-spacing-5, 20px)',
  6: 'var(--astryx-spacing-6, 24px)',
  8: 'var(--astryx-spacing-8, 32px)',
  10: 'var(--astryx-spacing-10, 40px)',
}

interface GridStyle extends CSSProperties {
  '--astryx-grid-auto-rows'?: string
  '--astryx-grid-column-gap'?: string
  '--astryx-grid-gap'?: string
  '--astryx-grid-row-gap'?: string
  '--astryx-grid-template-columns'?: string
}

function formatSize(value: GridSizeValue | undefined): string | undefined {
  if (value == null)
    return undefined

  return typeof value === 'number' ? `${value}px` : value
}

/*
 * Cap the column count without leaving dead space: the cap goes on the track's
 * minimum, so more than `max` columns can never fit, while the track maximum
 * stays `1fr` so a lone column on a narrow screen still fills the row.
 */
function buildCappedTemplate(
  minWidth: number,
  maxColumns: number,
  repeatMode: 'auto-fill' | 'auto-fit',
  gap: SpacingStep | undefined,
  columnGap: SpacingStep | undefined,
): string {
  const gapVariable = columnGap != null
    ? spacingVariables[columnGap]
    : gap != null
      ? spacingVariables[gap]
      : null

  const perColumn = gapVariable == null
    ? `calc(100% / ${maxColumns})`
    : `calc((100% - ${maxColumns - 1} * ${gapVariable}) / ${maxColumns})`

  return `repeat(${repeatMode}, minmax(min(100%, max(${minWidth}px, ${perColumn})), 1fr))`
}

const templateColumns = computed<string>(() => {
  const columns: GridColumns | undefined = props.columns

  if (typeof columns === 'object' && columns != null) {
    const repeatMode = columns.repeat === 'fit' ? 'auto-fit' : 'auto-fill'

    if (columns.max != null && columns.max > 0)
      return buildCappedTemplate(columns.minWidth, columns.max, repeatMode, props.gap, props.columnGap)

    return `repeat(${repeatMode}, minmax(${columns.minWidth}px, 1fr))`
  }

  if (typeof columns === 'number' && columns > 0)
    return `repeat(${columns}, 1fr)`

  return '1fr'
})

const numericColumns = computed(() => (typeof props.columns === 'number' ? props.columns : undefined))

const gridStyle = computed<GridStyle>(() => ({
  'height': formatSize(props.height),
  'maxWidth': formatSize(props.maxWidth),
  'minHeight': formatSize(props.minHeight),
  'width': formatSize(props.width),
  '--astryx-grid-auto-rows': props.rowHeight == null ? undefined : `${props.rowHeight}px`,
  '--astryx-grid-column-gap': props.columnGap == null ? undefined : spacingVariables[props.columnGap],
  '--astryx-grid-gap': props.gap == null ? undefined : spacingVariables[props.gap],
  '--astryx-grid-row-gap': props.rowGap == null ? undefined : spacingVariables[props.rowGap],
  '--astryx-grid-template-columns': templateColumns.value,
}))

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))

const rootClass = computed(() => ['astryx-grid', attrs.class])

const rootStyle = computed<StyleValue>(() => [attrs.style as StyleValue, gridStyle.value])
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :data-align="align"
    :data-column-gap="columnGap"
    :data-columns="numericColumns"
    :data-gap="gap"
    :data-justify="justify"
    :data-row-gap="rowGap"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>
