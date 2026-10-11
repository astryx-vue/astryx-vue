<script setup lang="ts">
import { NavDisclosure, NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
</script>

<template>
  <NavDisclosure label="Account menu">
    <template #trigger="{ isOpen, panelId }">
      <button
        type="button"
        class="nav-menu-preview__trigger"
        :aria-controls="panelId"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-haspopup="menu"
      >
        Account
      </button>
    </template>
    <template #default="{ close, focusRequest }">
      <NavMenu label="Account menu" :focus-request="focusRequest" @close="close">
        <NavMenuItem href="#profile" label="Profile" />
        <NavMenuItem href="#notifications" label="Notifications" />
        <NavMenuItem href="#settings" label="Settings" />
      </NavMenu>
    </template>
  </NavDisclosure>
</template>
