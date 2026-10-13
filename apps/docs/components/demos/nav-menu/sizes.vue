<script setup lang="ts">
import { NavDisclosure, NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
</script>

<template>
  <div class="nav-overview--row">
    <NavDisclosure label="Small menu">
      <template #trigger="{ isOpen, panelId }">
        <button
          type="button"
          class="nav-menu-preview__trigger"
          :aria-controls="panelId"
          :aria-expanded="isOpen ? 'true' : 'false'"
          aria-haspopup="menu"
        >
          Small
        </button>
      </template>
      <template #default="{ close, focusRequest }">
        <NavMenu label="Small" size="sm" :focus-request="focusRequest" @close="close">
          <NavMenuItem href="#profile" label="Profile" />
          <NavMenuItem href="#settings" label="Settings" />
        </NavMenu>
      </template>
    </NavDisclosure>
    <NavDisclosure label="Large menu">
      <template #trigger="{ isOpen, panelId }">
        <button
          type="button"
          class="nav-menu-preview__trigger"
          :aria-controls="panelId"
          :aria-expanded="isOpen ? 'true' : 'false'"
          aria-haspopup="menu"
        >
          Large
        </button>
      </template>
      <template #default="{ close, focusRequest }">
        <NavMenu label="Large" size="lg" :focus-request="focusRequest" @close="close">
          <NavMenuItem href="#profile" label="Profile" />
          <NavMenuItem href="#settings" label="Settings" />
        </NavMenu>
      </template>
    </NavDisclosure>
  </div>
</template>
