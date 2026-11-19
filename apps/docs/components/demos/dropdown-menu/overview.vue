<script setup lang="ts">
import type { DropdownMenuOption } from '@astryx-vue/core/DropdownMenu'
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'

const items: DropdownMenuOption[] = [
  { label: 'Edit', onClick: () => {} },
  { label: 'Duplicate', onClick: () => {} },
  { label: 'Delete', onClick: () => {} },
]
</script>

<template>
  <DropdownMenu :button="{ label: 'Actions' }" :items="items" />
</template>
