<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Button } from '@astryx-vue/core/Button'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { Toolbar } from '@astryx-vue/core/Toolbar'
import { computed, ref } from 'vue'

const rows = [
  { id: '1', name: 'Alex Johnson', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Sam Rivera', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Jordan Lee', role: 'Viewer', status: 'Invited' },
  { id: '4', name: 'Taylor Kim', role: 'Editor', status: 'Active' },
  { id: '5', name: 'Casey Park', role: 'Viewer', status: 'Active' },
]
const selected = ref(new Set(['1', '3', '5']))
const count = computed(() => selected.value.size)
const headerChecked = computed(() => {
  if (count.value === 0)
    return false
  if (count.value === rows.length)
    return true
  return 'indeterminate' as const
})

function setRow(id: string, checked: boolean | 'indeterminate'): void {
  const next = new Set(selected.value)
  if (checked === true)
    next.add(id)
  else
    next.delete(id)
  selected.value = next
}

function setAll(checked: boolean | 'indeterminate'): void {
  selected.value = checked === true ? new Set(rows.map(row => row.id)) : new Set()
}

function clear(): void {
  selected.value = new Set()
}
</script>

<template>
  <div class="nav-frame nav-frame--fill">
    <Toolbar v-if="count > 0" :dividers="['bottom']" label="Bulk actions" size="sm" variant="muted">
      <template #start>
        <Badge>{{ count }} selected</Badge>
        <Button is-icon-only label="Delete" size="sm" variant="ghost">
          <template #icon>
            <span class="i-carbon-trash-can" />
          </template>
        </Button>
        <Button is-icon-only label="Archive" size="sm" variant="ghost">
          <template #icon>
            <span class="i-carbon-archive" />
          </template>
        </Button>
      </template>
      <template #end>
        <Button label="Deselect all" size="sm" variant="ghost" @click="clear" />
      </template>
    </Toolbar>
    <table class="nav-bulk-table">
      <thead>
        <tr>
          <th>
            <CheckboxInput
              is-label-hidden
              label="Select all rows"
              :model-value="headerChecked"
              size="sm"
              @update:model-value="setAll"
            />
          </th>
          <th>Name</th>
          <th>Status</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" :class="{ 'is-selected': selected.has(row.id) }">
          <td>
            <CheckboxInput
              is-label-hidden
              :label="`Select ${row.name}`"
              :model-value="selected.has(row.id)"
              size="sm"
              @update:model-value="setRow(row.id, $event)"
            />
          </td>
          <td>{{ row.name }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
