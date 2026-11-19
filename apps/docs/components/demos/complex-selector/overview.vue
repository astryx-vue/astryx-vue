<script setup lang="ts">
import { useGridRovingFocus } from '@astryx-vue/core'
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

type Fruit = 'Apple' | 'Pear' | 'Peach' | 'Plum'
type Ripeness = 'Crisp' | 'Tender' | 'Juicy' | 'Peak'

interface FruitValue {
  fruit: Fruit
  ripeness: Ripeness
}

const fruits: Array<{ id: Fruit, emoji: string, description: string }> = [
  { id: 'Apple', emoji: '🍎', description: 'Bright and balanced' },
  { id: 'Pear', emoji: '🍐', description: 'Soft floral sweetness' },
  { id: 'Peach', emoji: '🍑', description: 'Round summer flavor' },
  { id: 'Plum', emoji: '🟣', description: 'Jammy and tart' },
]

const ripenessLevels: Array<{ id: Ripeness, shortLabel: string, description: string }> = [
  { id: 'Crisp', shortLabel: 'C', description: 'Snappy bite' },
  { id: 'Tender', shortLabel: 'T', description: 'Easy bite' },
  { id: 'Juicy', shortLabel: 'J', description: 'Full juice' },
  { id: 'Peak', shortLabel: 'P', description: 'Most intense' },
]

const value = ref<FruitValue>({ fruit: 'Apple', ripeness: 'Juicy' })
const activeIndex = ref(2)
const cells: HTMLButtonElement[] = []

const grid = useGridRovingFocus({
  activeIndex,
  columns: computed(() => ripenessLevels.length),
  rows: computed(() => fruits.length),
  onChange(index) {
    activeIndex.value = index
    cells[index]?.focus()
  },
})

function registerCell(element: unknown, index: number) {
  if (element instanceof HTMLButtonElement)
    cells[index] = element
}

function choose(next: FruitValue, commit: (value: FruitValue) => void, close: () => void) {
  const row = fruits.findIndex(fruit => fruit.id === next.fruit)
  const column = ripenessLevels.findIndex(level => level.id === next.ripeness)
  activeIndex.value = row * ripenessLevels.length + column
  commit(next)
  close()
}
</script>

<template>
  <ComplexSelector
    v-model="value"
    label="Fruit blend"
    description="Choose a fruit and ripeness in one control. Arrow keys move across the grid."
    :trigger-label="`${value.fruit} · ${value.ripeness}`"
    :control-style="{ width: '280px' }"
  >
    <template #default="{ value: selected, commit, close }">
      <div class="fruit-grid" role="grid" aria-label="Fruit ripeness choices" @keydown="grid.onKeyDown">
        <div v-for="(fruit, rowIndex) in fruits" :key="fruit.id" class="fruit-row" role="row">
          <div class="fruit-row-header" role="rowheader">
            <span aria-hidden="true" class="fruit-emoji">{{ fruit.emoji }}</span>
            <span class="fruit-text">
              <Text type="body">{{ fruit.id }}</Text>
              <Text type="supporting" color="secondary">{{ fruit.description }}</Text>
            </span>
          </div>
          <button
            v-for="(level, columnIndex) in ripenessLevels"
            :key="`${fruit.id}-${level.id}`"
            :ref="(element) => registerCell(element, rowIndex * ripenessLevels.length + columnIndex)"
            type="button"
            role="gridcell"
            class="fruit-cell"
            :aria-label="`${fruit.id}, ${level.id}: ${level.description}`"
            :aria-selected="(selected.fruit === fruit.id && selected.ripeness === level.id) || undefined"
            :tabindex="activeIndex === rowIndex * ripenessLevels.length + columnIndex ? 0 : -1"
            @click="choose({ fruit: fruit.id, ripeness: level.id }, commit, close)"
          >
            {{ level.shortLabel }}
          </button>
        </div>
      </div>
    </template>
  </ComplexSelector>
</template>

<style scoped>
.fruit-grid {
  display: flex;
  flex-direction: column;
  gap: var(--astryx-spacing-1);
  min-width: 280px;
}

.fruit-row {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) repeat(4, 44px);
  align-items: center;
  column-gap: var(--astryx-spacing-1);
}

.fruit-row-header {
  display: flex;
  align-items: center;
  gap: var(--astryx-spacing-2);
  min-width: 0;
  text-align: start;
}

.fruit-emoji {
  flex-shrink: 0;
  font-size: 18px;
}

.fruit-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.fruit-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border: var(--astryx-border-width) solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-container);
  background-color: var(--astryx-color-background-card);
  color: var(--astryx-color-text-secondary);
  font-family: inherit;
  cursor: pointer;
}

@media (hover: hover) {
  .fruit-cell:hover {
    border-color: var(--astryx-color-border-emphasized);
    color: var(--astryx-color-text-primary);
  }
}

.fruit-cell[aria-selected='true'] {
  border-color: var(--astryx-color-accent);
  background-color: var(--astryx-color-accent);
  color: var(--astryx-color-on-accent);
}
</style>
