<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Button } from '@astryx-vue/core/Button'
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

function toggle(id: string): void {
  const next = new Set(selected.value)
  if (next.has(id))
    next.delete(id)
  else
    next.add(id)
  selected.value = next
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
          <th />
          <th>Name</th>
          <th>Status</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" :class="{ 'is-selected': selected.has(row.id) }">
          <td>
            <input
              :aria-label="`Select ${row.name}`"
              :checked="selected.has(row.id)"
              type="checkbox"
              @change="toggle(row.id)"
            >
          </td>
          <td>{{ row.name }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
