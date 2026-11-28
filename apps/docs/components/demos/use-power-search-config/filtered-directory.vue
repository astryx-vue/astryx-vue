<script setup lang="ts">
import type { PowerSearchFilter } from '@astryx-vue/core/PowerSearch'
import type { TableColumn } from '@astryx-vue/core/Table'
import { PowerSearch, usePowerSearchConfig } from '@astryx-vue/core/PowerSearch'
import { VStack } from '@astryx-vue/core/Stack'
import { Table } from '@astryx-vue/core/Table'
import { computed, ref } from 'vue'

const statusValues = [
  { value: 'active', label: 'Active' },
  { value: 'on-leave', label: 'On Leave' },
  { value: 'contractor', label: 'Contractor' },
]

const fieldDefs = [
  { key: 'name', type: 'string', label: 'Name' },
  { key: 'status', type: 'enum', label: 'Status', enumValues: statusValues },
  { key: 'startDate', type: 'date', label: 'Start date' },
] as const

interface Person extends Record<string, unknown> {
  id: string
  name: string
  status: string
  startDate: number
}

const people: Person[] = [
  { id: '1', name: 'Alice Chen', status: 'active', startDate: 1672531200 },
  { id: '2', name: 'Bob Dylan', status: 'on-leave', startDate: 1680307200 },
  { id: '3', name: 'Charlie Kim', status: 'active', startDate: 1688169600 },
  { id: '4', name: 'Dana Scully', status: 'contractor', startDate: 1696118400 },
  { id: '5', name: 'Evan Wright', status: 'active', startDate: 1704067200 },
]

const columns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name' },
  {
    key: 'status',
    header: 'Status',
    renderCell: person => statusValues.find(status => status.value === person.status)?.label ?? person.status,
  },
  {
    key: 'startDate',
    header: 'Start Date',
    renderCell: person => new Date(person.startDate * 1000).toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  },
]

const { config, applyFilters } = usePowerSearchConfig(fieldDefs, 'PeopleDirectory')
const filters = ref<PowerSearchFilter[]>([])
const filteredPeople = computed(() => applyFilters(filters.value, people))
</script>

<template>
  <VStack :gap="4" width="100%">
    <PowerSearch
      v-model:filters="filters"
      :config="config"
      placeholder="Filter directory by name, status, start date..."
      :result-count="filteredPeople.length"
    />
    <Table :data="filteredPeople" :columns="columns" id-key="id" has-hover />
  </VStack>
</template>
