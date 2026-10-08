<script setup lang="ts">
import type { DropdownMenuOption } from '@astryx-vue/core/DropdownMenu'
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
import { ref } from 'vue'

const lastAction = ref('No action yet')

const items: DropdownMenuOption[] = [
  { label: 'Edit project', onClick: () => { lastAction.value = 'Edit project' } },
  { label: 'Duplicate project', onClick: () => { lastAction.value = 'Duplicate project' } },
  { label: 'Move to archive', onClick: () => { lastAction.value = 'Move to archive' } },
  { label: 'Delete project', variant: 'destructive', onClick: () => { lastAction.value = 'Delete project' } },
]
</script>

<template>
  <div class="dropdown-menu-preview">
    <DropdownMenu :button="{ label: 'Actions' }" :items="items" />
    <p class="dropdown-menu-preview__note">
      Last action: {{ lastAction }}
    </p>
  </div>
</template>
