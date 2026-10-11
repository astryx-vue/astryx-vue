<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { OverflowList } from '@astryx-vue/core/OverflowList'
import { Toolbar } from '@astryx-vue/core/Toolbar'

const items = [
  { href: '#bold', iconClass: 'i-carbon-text-bold', id: 'bold', label: 'Bold' },
  { href: '#italic', iconClass: 'i-carbon-text-italic', id: 'italic', label: 'Italic' },
  { href: '#link', iconClass: 'i-carbon-link', id: 'link', label: 'Link' },
  { href: '#image', iconClass: 'i-carbon-image', id: 'image', label: 'Image' },
  { href: '#code', iconClass: 'i-carbon-code', id: 'code', label: 'Code' },
  { href: '#quote', iconClass: 'i-carbon-quotes', id: 'quote', label: 'Quote' },
]
</script>

<template>
  <div class="nav-frame--narrow">
    <Toolbar label="Formatting">
      <template #start>
        <OverflowList :items="items" />
      </template>
      <template #end>
        <Button label="Share" size="sm" variant="primary" />
      </template>
    </Toolbar>
  </div>
</template>
