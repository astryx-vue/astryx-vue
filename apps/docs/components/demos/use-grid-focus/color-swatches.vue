<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useGridFocus } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const COLUMNS = 8

const SWATCHES = [
  { name: 'Red', value: '#e5484d' },
  { name: 'Tomato', value: '#f76b15' },
  { name: 'Amber', value: '#ffc53d' },
  { name: 'Lime', value: '#bdee63' },
  { name: 'Green', value: '#30a46c' },
  { name: 'Teal', value: '#12a594' },
  { name: 'Cyan', value: '#00a2c7' },
  { name: 'Blue', value: '#0090ff' },
  { name: 'Indigo', value: '#3e63dd' },
  { name: 'Violet', value: '#6e56cf' },
  { name: 'Purple', value: '#8e4ec6' },
  { name: 'Plum', value: '#ab4aba' },
  { name: 'Pink', value: '#d6409f' },
  { name: 'Brown', value: '#ad7f58' },
  { name: 'Gray', value: '#8d8d8d' },
  { name: 'Black', value: '#111111' },
]

const ROWS = Array.from({ length: SWATCHES.length / COLUMNS }, (_, row) =>
  SWATCHES.slice(row * COLUMNS, (row + 1) * COLUMNS))

const selected = ref(SWATCHES[0]!.name)
const { gridRef, handleKeyDown, handleFocus } = useGridFocus({
  columns: COLUMNS,
  cellSelector: '[role="gridcell"]',
  getFocusTarget: cell => cell.querySelector('button'),
  hasRovingTabIndex: true,
})

function bindGrid(el: Element | ComponentPublicInstance | null): void {
  gridRef.value = el instanceof HTMLElement ? el : null
}
</script>

<template>
  <Card :padding="4">
    <VStack :gap="3">
      <Text type="body">
        Selected: {{ selected }}
      </Text>
      <!-- eslint-disable-next-line vue-a11y/interactive-supports-focus -- 焦点停在格子里的按钮上（roving tabindex），网格容器只接冒泡上来的焦点与方向键。 -->
      <div
        :ref="bindGrid"
        class="swatch-grid-demo"
        role="grid"
        aria-label="Colors"
        @keydown="handleKeyDown"
        @focusin="handleFocus"
      >
        <div v-for="(row, index) in ROWS" :key="index" class="swatch-grid-demo__row" role="row">
          <div
            v-for="swatch in row"
            :key="swatch.name"
            role="gridcell"
            :aria-selected="swatch.name === selected"
          >
            <button
              type="button"
              class="swatch-grid-demo__swatch"
              :aria-label="swatch.name"
              :aria-pressed="swatch.name === selected"
              :style="{ background: swatch.value }"
              @click="selected = swatch.name"
            />
          </div>
        </div>
      </div>
    </VStack>
  </Card>
</template>

<style scoped>
.swatch-grid-demo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.swatch-grid-demo__row {
  display: flex;
  gap: 4px;
}

.swatch-grid-demo__swatch {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px var(--astryx-color-border-emphasized, var(--astryx-color-border));
  cursor: pointer;
}
</style>
