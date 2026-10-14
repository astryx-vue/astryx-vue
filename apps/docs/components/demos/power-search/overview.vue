<script setup lang="ts">
import type { PowerSearchFilter } from '@astryx-vue/core/PowerSearch'
import { createPowerSearchConfig, PowerSearch } from '@astryx-vue/core/PowerSearch'
import { computed, ref } from 'vue'

interface Person {
  name: string
  role: string
  active: boolean
  age: number
}

const people: Person[] = [
  { name: 'Alice', role: 'engineer', active: true, age: 32 },
  { name: 'Bob', role: 'designer', active: false, age: 28 },
  { name: 'Carol', role: 'engineer', active: true, age: 41 },
  { name: 'Diego', role: 'manager', active: true, age: 36 },
]

const { config, applyFilters } = createPowerSearchConfig([
  { key: 'name', type: 'string', label: 'Name' },
  {
    key: 'role',
    type: 'enum',
    label: 'Role',
    enumValues: [
      { value: 'engineer', label: 'Engineer' },
      { value: 'designer', label: 'Designer' },
      { value: 'manager', label: 'Manager' },
    ],
  },
  { key: 'active', type: 'boolean', label: 'Active' },
  { key: 'age', type: 'number', label: 'Age' },
] as const, 'people')

const searchConfig = { ...config, contentSearchFieldKey: 'name' }
const filters = ref<PowerSearchFilter[]>([])
const matched = computed(() => applyFilters(filters.value, people))
</script>

<template>
  <div class="power-search-demo">
    <PowerSearch
      v-model:filters="filters"
      :config="searchConfig"
      :result-count="matched.length"
    />
    <ul>
      <li v-for="person in matched" :key="person.name">
        {{ person.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.power-search-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

ul {
  margin: 0;
  padding-left: 1.25rem;
}
</style>
