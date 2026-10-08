<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { ContextMenu, ContextMenuDivider, ContextMenuGroup, ContextMenuItem, ContextMenuSubMenu } from '@astryx-vue/core/ContextMenu'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const copied = ref(false)

function copyLink(): void {
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="context-menu-preview">
    <ContextMenu label="Item actions">
      <Card :padding="6">
        <Text as="div" color="secondary">
          Right-click this card for a menu composed from menu components.
        </Text>
      </Card>
      <template #content>
        <ContextMenuItem label="Rename">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-tools" />
          </template>
        </ContextMenuItem>
        <ContextMenuItem
          label="Copy link"
          :end-content="copied ? 'Copied' : undefined"
          :has-close-on-select="false"
          @click="copyLink"
        >
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-copy" />
          </template>
        </ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuGroup title="Version history">
          <ContextMenuSubMenu label="Versions">
            <ContextMenuItem label="Restore this version" />
            <ContextMenuItem label="Compare with current" />
          </ContextMenuSubMenu>
        </ContextMenuGroup>
        <ContextMenuDivider />
        <ContextMenuItem label="Delete" variant="destructive" />
      </template>
    </ContextMenu>
  </div>
</template>
