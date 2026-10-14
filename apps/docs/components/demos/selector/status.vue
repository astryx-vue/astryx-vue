<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

const empty = ref<string | undefined>()
const viewer = ref('viewer')
const admin = ref('admin')
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <VStack :gap="6">
      <Selector
        v-model="empty"
        label="Role"
        :options="roles"
        placeholder="Choose a role..."
        status="error"
        status-message="Please select a role"
      />
      <Selector
        v-model="viewer"
        label="Role"
        :options="roles"
        status="warning"
        status-message="Viewer has limited access"
      />
      <Selector
        v-model="admin"
        label="Role"
        :options="roles"
        status="success"
      />
    </VStack>
  </div>
</template>
