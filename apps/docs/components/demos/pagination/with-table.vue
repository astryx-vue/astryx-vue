<script setup lang="ts">
import { Pagination } from '@astryx-vue/core/Pagination'
import { VStack } from '@astryx-vue/core/Stack'
import { Table } from '@astryx-vue/core/Table'
import { computed, ref } from 'vue'

const allRows = [
  { id: '1', name: 'Olivia Chen', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Marcus Rivera', role: 'Designer', status: 'Active' },
  { id: '3', name: 'Aisha Patel', role: 'Marketing', status: 'Invited' },
  { id: '4', name: 'James Okafor', role: 'Engineer', status: 'Active' },
  { id: '5', name: 'Sofia Nguyen', role: 'Sales', status: 'Active' },
  { id: '6', name: 'Liam Johansson', role: 'Engineer', status: 'Inactive' },
  { id: '7', name: 'Elena Kowalski', role: 'Designer', status: 'Active' },
  { id: '8', name: 'David Kim', role: 'Marketing', status: 'Active' },
  { id: '9', name: 'Priya Sharma', role: 'Sales', status: 'Invited' },
  { id: '10', name: 'Noah Tanaka', role: 'Engineer', status: 'Active' },
  { id: '11', name: 'Fatima Al-Rashid', role: 'Designer', status: 'Active' },
  { id: '12', name: 'Carlos Mendez', role: 'Marketing', status: 'Inactive' },
]

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
]

const pageSize = 4
const page = ref(1)
const pageRows = computed(() => allRows.slice((page.value - 1) * pageSize, page.value * pageSize))
</script>

<template>
  <VStack style="width: 100%; max-width: 500px">
    <Table :columns="columns" :data="pageRows" id-key="id" />
    <Pagination
      v-model:page="page"
      :page-size="pageSize"
      size="sm"
      :total="allRows.length"
      variant="count"
      style="justify-content: center; padding-top: 8px"
    />
  </VStack>
</template>
