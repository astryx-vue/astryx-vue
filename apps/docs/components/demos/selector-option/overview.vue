<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const value = ref<string | null>('editor')

const roles = [
  { value: 'admin', label: 'Admin', description: 'Full access to all resources' },
  { value: 'editor', label: 'Editor', description: 'Can edit and publish content' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
  { value: 'billing', label: 'Billing', description: 'Manage plans and payments' },
]
</script>

<template>
  <Selector
    v-model="value"
    :width="300"
    label="Role"
    :options="roles"
    placeholder="Assign a role..."
  />
</template>
