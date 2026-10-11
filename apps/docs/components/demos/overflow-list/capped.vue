<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { NavDisclosure, NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
import { OverflowList } from '@astryx-vue/core/OverflowList'

const items = [
  { id: 'save', label: 'Save' },
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'share', label: 'Share' },
  { id: 'archive', label: 'Archive' },
  { id: 'delete', label: 'Delete' },
]
</script>

<template>
  <Card :padding="2" :width="260">
    <OverflowList :items="items" :max-visible-items="3">
      <template #item="{ item }">
        <Button :label="item.label" size="sm" />
      </template>
      <template #overflow="{ items: hidden }">
        <NavDisclosure label="More actions">
          <template #trigger="{ isOpen, panelId }">
            <Button
              :label="`+${hidden.length}`"
              size="sm"
              variant="ghost"
              :aria-controls="panelId"
              :aria-expanded="isOpen ? 'true' : 'false'"
              aria-haspopup="menu"
            />
          </template>
          <template #default="{ close, focusRequest }">
            <NavMenu label="More actions" :focus-request="focusRequest" @close="close">
              <NavMenuItem v-for="item in hidden" :key="item.id" :label="item.label" />
            </NavMenu>
          </template>
        </NavDisclosure>
      </template>
    </OverflowList>
  </Card>
</template>
