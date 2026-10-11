<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { NavDisclosure, NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
import { OverflowList } from '@astryx-vue/core/OverflowList'

const items = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'share', label: 'Share' },
  { id: 'archive', label: 'Archive' },
  { id: 'delete', label: 'Delete' },
]
</script>

<template>
  <div class="nav-overview">
    <OverflowList :items="items" :max-visible-items="3">
      <template #item="{ item }">
        <Button :label="item.label" size="sm" />
      </template>
      <template #overflow="{ items: hidden }">
        <NavDisclosure label="More">
          <template #trigger="{ isOpen, panelId }">
            <Button
              :label="`+${hidden.length} more`"
              size="sm"
              variant="ghost"
              :aria-controls="panelId"
              :aria-expanded="isOpen ? 'true' : 'false'"
              aria-haspopup="menu"
            />
          </template>
          <template #default="{ close, focusRequest }">
            <NavMenu label="More" :focus-request="focusRequest" @close="close">
              <NavMenuItem v-for="item in hidden" :key="item.id" :label="item.label" />
            </NavMenu>
          </template>
        </NavDisclosure>
      </template>
    </OverflowList>
  </div>
</template>
