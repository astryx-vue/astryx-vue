<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { EmptyState } from '@astryx-vue/core/EmptyState'
import { Icon } from '@astryx-vue/core/Icon'
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
        <Button label="Import" variant="secondary" />
        <Button label="Create project" variant="primary" />
      </template>
    </EmptyState>
  </Card>
</template>
