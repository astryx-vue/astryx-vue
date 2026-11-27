<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { NavDisclosure, NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
import { OverflowList } from '@astryx-vue/core/OverflowList'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

const items = [
  { id: '1', label: 'Step 1' },
  { id: '2', label: 'Step 2' },
  { id: '3', label: 'Step 3' },
  { id: '4', label: 'Step 4' },
  { id: '5', label: 'Step 5' },
]
</script>

<template>
  <Card :padding="2" :width="300">
    <OverflowList collapse-from="start" :items="items" :visible-count="2">
      <template #item="{ item }">
        <Button :label="item.label" size="sm" @click="demo(item.label)" />
      </template>
      <template #overflow="{ items: hidden }">
        <NavDisclosure label="More steps">
          <template #trigger="{ isOpen, panelId }">
            <Button
              :label="`+${hidden.length} more`"
              size="sm"
              variant="ghost"
              :aria-controls="panelId"
              :aria-expanded="isOpen ? 'true' : 'false'"
              aria-haspopup="menu"
              @click="demo('the overflow menu')"
            />
          </template>
          <template #default="{ close, focusRequest }">
            <NavMenu label="More steps" :focus-request="focusRequest" @close="close">
              <NavMenuItem v-for="item in hidden" :key="item.id" :label="item.label" />
            </NavMenu>
          </template>
        </NavDisclosure>
      </template>
    </OverflowList>
  </Card>
</template>
