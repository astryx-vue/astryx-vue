<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Selector } from '@astryx-vue/core/Selector'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { Toolbar } from '@astryx-vue/core/Toolbar'
import { computed, ref } from 'vue'

const jobs = [
  { customer: 'Northgate Dental', id: 'SJ-2136', job: 'VAV zones not cooling', priority: 'High', status: 'In progress' },
  { customer: 'Riverside Club', id: 'SJ-2135', job: 'Exhaust fan noise', priority: 'Normal', status: 'On hold' },
  { customer: 'Summit Medical', id: 'SJ-2134', job: 'Humidifier board fault', priority: 'High', status: 'Overdue' },
  { customer: 'Northgate Dental', id: 'SJ-2133', job: 'Economizer stuck shut', priority: 'Normal', status: 'Scheduled' },
  { customer: 'Harborview Hotel', id: 'SJ-2101', job: 'Contactor replacement', priority: 'Low', status: 'Completed' },
]
const query = ref('')
const status = ref<string | null>(null)
const priority = ref<string | null>(null)
const customer = ref<string | null>(null)
const statusOptions = ['Scheduled', 'In progress', 'On hold', 'Overdue', 'Completed'].map(value => ({ label: value, value }))
const priorityOptions = ['High', 'Normal', 'Low'].map(value => ({ label: value, value }))
const customerOptions = ['Northgate Dental', 'Riverside Club', 'Summit Medical', 'Harborview Hotel'].map(value => ({ label: value, value }))
const visible = computed(() => jobs.filter((job) => {
  if (query.value && !job.job.toLowerCase().includes(query.value.toLowerCase()))
    return false
  if (status.value && job.status !== status.value)
    return false
  if (priority.value && job.priority !== priority.value)
    return false
  if (customer.value && job.customer !== customer.value)
    return false
  return true
}))

function clearFilters(): void {
  query.value = ''
  status.value = null
  priority.value = null
  customer.value = null
}
</script>

<template>
  <div class="nav-frame nav-frame--fill nav-filter">
    <Toolbar label="Table filter" size="sm">
      <template #start>
        <TextInput v-model="query" is-label-hidden label="Search jobs" placeholder="Search jobs" size="sm" />
        <Selector v-model="status" label="Status" :options="statusOptions" placeholder="Status" size="sm" />
        <Selector v-model="priority" label="Priority" :options="priorityOptions" placeholder="Priority" size="sm" />
        <Selector v-model="customer" label="Customer" :options="customerOptions" placeholder="Customer" size="sm" />
        <Button v-if="query || status || priority || customer" label="Clear all" size="sm" variant="ghost" @click="clearFilters" />
      </template>
      <template #end>
        <Text color="secondary" type="supporting">
          {{ visible.length }} of {{ jobs.length }}
        </Text>
      </template>
    </Toolbar>
    <table class="nav-bulk-table">
      <thead>
        <tr>
          <th>Job</th>
          <th>Customer</th>
          <th>Status</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in visible" :key="job.id">
          <td>{{ job.job }}</td>
          <td>{{ job.customer }}</td>
          <td>{{ job.status }}</td>
          <td>{{ job.priority }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
