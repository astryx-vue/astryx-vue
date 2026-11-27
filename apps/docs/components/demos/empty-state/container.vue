<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { EmptyState } from '@astryx-vue/core/EmptyState'
import { Icon } from '@astryx-vue/core/Icon'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Card>
    <EmptyState
      title="No projects yet"
      description="Create your first project to start organizing your work. You can invite team members after."
    >
      <template #icon>
        <Icon icon="i-heroicons-folder-plus" size="lg" />
      </template>
      <template #actions>
        <Button label="Import" variant="secondary" @click="demo('Import')" />
        <Button label="Create project" variant="primary" @click="demo('Create project')" />
      </template>
    </EmptyState>
  </Card>
</template>
