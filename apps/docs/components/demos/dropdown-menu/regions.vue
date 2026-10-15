<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { DropdownMenu, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
import { Icon } from '@astryx-vue/core/Icon'
import { TextInput } from '@astryx-vue/core/TextInput'
import { computed, ref } from 'vue'

const query = ref('')
const labels = ref(['Bug', 'Design', 'Docs'])

const visible = computed(() => labels.value.filter(label => label.toLowerCase().includes(query.value.trim().toLowerCase())))

function createLabel(): void {
  const name = query.value.trim()
  if (name === '' || labels.value.includes(name))
    return
  labels.value = [...labels.value, name]
  query.value = ''
}
</script>

<template>
  <DropdownMenu :button="{ label: 'Labels' }" menu-width="240px">
    <template #header>
      <TextInput v-model="query" label="Filter labels" placeholder="Filter" size="sm" />
    </template>
    <DropdownMenuItem v-for="label in visible" :key="label" :label="label">
      <template #icon>
        <Icon name="carbon:tag" />
      </template>
    </DropdownMenuItem>
    <DropdownMenuItem v-if="visible.length === 0" is-disabled label="No matches" />
    <template #footer>
      <Button label="Create label" variant="ghost" @click="createLabel">
        <template #icon>
          <Icon name="carbon:add" />
        </template>
      </Button>
    </template>
  </DropdownMenu>
</template>
