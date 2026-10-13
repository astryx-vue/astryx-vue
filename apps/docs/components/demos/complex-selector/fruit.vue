<script setup lang="ts">
import { useGridRovingFocus } from '@astryx-vue/core'
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref, watch } from 'vue'

interface FruitValue {
  fruit: string
  ripeness: string
}

const fruits = [
  { id: 'Apple', description: 'Bright and balanced' },
  { id: 'Pear', description: 'Soft floral sweetness' },
  { id: 'Peach', description: 'Round summer flavor' },
  { id: 'Plum', description: 'Jammy and tart' },
]

const levels = [
  { id: 'Crisp', shortLabel: 'C', description: 'Snappy bite' },
  { id: 'Tender', shortLabel: 'T', description: 'Easy bite' },
  { id: 'Juicy', shortLabel: 'J', description: 'Full juice' },
  { id: 'Peak', shortLabel: 'P', description: 'Most intense' },
]

const value = ref<FruitValue>({ fruit: 'Apple', ripeness: 'Juicy' })
const rows = computed(() => fruits.length)
const columns = computed(() => levels.length)
const activeIndex = ref(2)
const cells = ref<HTMLButtonElement[]>([])

const grid = useGridRovingFocus({
  activeIndex,
  columns,
  onChange(index) {
    activeIndex.value = index
  },
  rows,
})

watch(activeIndex, (index) => {
  cells.value[index]?.focus()
})

function registerCell(element: unknown, index: number) {
  if (element instanceof HTMLButtonElement)
    cells.value[index] = element
}

function choose(next: FruitValue, commit: (value: FruitValue) => void, close: () => void) {
  const row = fruits.findIndex(fruit => fruit.id === next.fruit)
  const column = levels.findIndex(level => level.id === next.ripeness)
  activeIndex.value = row * levels.length + column
  commit(next)
  close()
}

function labelOf(current: FruitValue) {
  return `${current.fruit}, ${current.ripeness}`
}
</script>

<template>
  <ComplexSelector
    v-model="value"
    description="Choose a fruit and ripeness level in one selector. Arrow down preserves the ripeness column."
    label="Fruit blend"
    :trigger-label="labelOf(value)"
    width="100%"
  >
    <template #default="{ value: selected, commit, close }">
      <div>
        <Text color="secondary" type="supporting">
          Pick a blend profile. The compact pills mirror a hover-rich selector while staying available to keyboard users.
        </Text>
        <div
          class="fruit-grid"
          role="grid"
          aria-label="Fruit ripeness choices"
          @keydown="grid.onKeyDown"
        >
          <div v-for="(fruit, rowIndex) in fruits" :key="fruit.id" class="fruit-row" role="row">
            <div class="fruit-summary" role="rowheader">
              <span class="fruit-mark" aria-hidden="true">{{ fruit.id.slice(0, 1) }}</span>
              <span class="fruit-copy">
                <span class="fruit-name">{{ fruit.id }}</span>
                <span class="fruit-description">{{ fruit.description }}</span>
              </span>
            </div>
            <button
              v-for="(level, columnIndex) in levels"
              :key="level.id"
              :ref="(element) => registerCell(element, rowIndex * levels.length + columnIndex)"
              type="button"
              role="gridcell"
              :aria-label="`${fruit.id}, ${level.id}: ${level.description}`"
              :aria-selected="selected.fruit === fruit.id && selected.ripeness === level.id"
              :tabindex="activeIndex === rowIndex * levels.length + columnIndex ? 0 : -1"
              @click="choose({ fruit: fruit.id, ripeness: level.id }, commit, close)"
            >
              {{ level.shortLabel }}
            </button>
          </div>
        </div>
        <Text color="secondary" type="supporting">
          Try keyboard: Arrow down from Apple J lands on Pear J.
        </Text>
      </div>
    </template>
  </ComplexSelector>
</template>

<style scoped>
.fruit-grid {
  display: flex;
  flex-direction: column;
  gap: var(--astryx-spacing-1, 4px);
  margin-block: var(--astryx-spacing-3, 12px);
}

.fruit-row {
  display: grid;
  grid-template-columns: minmax(156px, 1fr) repeat(4, 56px);
  align-items: center;
  column-gap: var(--astryx-spacing-1, 4px);
  min-height: 48px;
  padding-block: var(--astryx-spacing-1, 4px);
  padding-inline: var(--astryx-spacing-2, 8px);
  border-radius: var(--astryx-radius-container, 8px);
}

.fruit-row:focus-within {
  background: var(--astryx-color-background-muted, #f5f5f5);
}

.fruit-summary {
  display: flex;
  align-items: center;
  gap: var(--astryx-spacing-2, 8px);
  min-width: 0;
}

.fruit-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--astryx-radius-full, 999px);
  background: var(--astryx-color-background-muted, #f5f5f5);
  color: var(--astryx-color-text-secondary, #525252);
  font-size: 0.875rem;
  flex-shrink: 0;
}

.fruit-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.fruit-name {
  color: var(--astryx-color-text-primary, #171717);
  font-size: var(--astryx-text-label-size, 0.875rem);
  font-weight: var(--astryx-font-weight-semibold, 600);
}

.fruit-description {
  color: var(--astryx-color-text-secondary, #525252);
  font-size: var(--astryx-text-supporting-size, 0.75rem);
}

.fruit-row button {
  min-height: 30px;
  border: var(--astryx-border-width, 1px) solid var(--astryx-color-border, #ebebeb);
  border-radius: var(--astryx-radius-full, 999px);
  background: var(--astryx-color-background-card, #fff);
  color: var(--astryx-color-text-secondary, #525252);
}

.fruit-row button[aria-selected='true'] {
  border-color: var(--astryx-color-accent, #0082fb);
  color: var(--astryx-color-accent, #0082fb);
}
</style>
