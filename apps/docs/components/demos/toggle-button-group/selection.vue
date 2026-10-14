<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const view = ref<string | null>('list')
const formats = ref<string[]>(['bold'])
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Single selection
      </Text>
      <ToggleButtonGroup v-model:value="view" label="View mode">
        <ToggleButton value="list" label="List view" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-list-bullet" />
          </template>
        </ToggleButton>
        <ToggleButton value="grid" label="Grid view" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-squares-2x2" />
          </template>
        </ToggleButton>
        <ToggleButton value="table" label="Table view" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-table-cells" />
          </template>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        Multiple selections
      </Text>
      <ToggleButtonGroup v-model:value="formats" type="multiple" label="Text formatting">
        <ToggleButton value="bold" label="Bold" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-bold" />
          </template>
        </ToggleButton>
        <ToggleButton value="italic" label="Italic" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-italic" />
          </template>
        </ToggleButton>
        <ToggleButton value="underline" label="Underline" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-underline" />
          </template>
        </ToggleButton>
        <ToggleButton value="strikethrough" label="Strikethrough" is-icon-only>
          <template #icon>
            <Icon icon="i-heroicons-strikethrough" />
          </template>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  </Stack>
</template>
