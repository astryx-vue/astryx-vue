<script setup lang="ts">
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuDivider, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@astryx-vue/core/DropdownMenu'
import { Icon } from '@astryx-vue/core/Icon'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const showArchived = ref(false)
const compact = ref(true)
const sort = ref('updated')
</script>

<template>
  <VStack :gap="3">
    <DropdownMenu :button="{ label: 'View' }">
      <DropdownMenuCheckboxItem v-model="showArchived" label="Show archived">
        <template #icon>
          <Icon name="carbon:archive" />
        </template>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model="compact" label="Compact rows">
        <template #icon>
          <Icon name="carbon:list" />
        </template>
      </DropdownMenuCheckboxItem>
      <DropdownMenuDivider />
      <DropdownMenuRadioGroup v-model="sort" label="Sort by">
        <DropdownMenuRadioItem value="name" label="Name">
          <template #icon>
            <Icon name="carbon:sort-ascending" />
          </template>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="updated" label="Last updated">
          <template #icon>
            <Icon name="carbon:time" />
          </template>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="created" label="Created">
          <template #icon>
            <Icon name="carbon:calendar" />
          </template>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenu>
    <Text v-if="sort" color="secondary" type="supporting">
      {{ compact ? 'Compact' : 'Comfortable' }} · {{ showArchived ? 'Including archived' : 'Active only' }} · Sorted by {{ sort }}
    </Text>
  </VStack>
</template>
