<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuDivider, ContextMenuRadioGroup, ContextMenuRadioItem } from '@astryx-vue/core/ContextMenu'
import { Icon } from '@astryx-vue/core/Icon'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const pinned = ref(true)
const muted = ref(false)
const density = ref('comfortable')
</script>

<template>
  <ContextMenu label="Canvas actions">
    <Card :padding="6">
      <Text as="div" color="secondary">
        Right-click to pin, mute, or choose a density. Checkboxes stay open; the density choice closes the menu.
      </Text>
      <Text as="div" color="secondary" type="supporting">
        {{ pinned ? 'Pinned' : 'Unpinned' }} · {{ muted ? 'Muted' : 'Notifications on' }} · {{ density }}
      </Text>
    </Card>
    <template #content>
      <ContextMenuCheckboxItem v-model="pinned" label="Pin to top">
        <template #icon>
          <Icon name="carbon:pin" />
        </template>
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem v-model="muted" label="Mute">
        <template #icon>
          <Icon name="carbon:volume-mute" />
        </template>
      </ContextMenuCheckboxItem>
      <ContextMenuDivider />
      <ContextMenuRadioGroup v-model="density" label="Density">
        <ContextMenuRadioItem value="compact" label="Compact" />
        <ContextMenuRadioItem value="comfortable" label="Comfortable" />
      </ContextMenuRadioGroup>
    </template>
  </ContextMenu>
</template>
