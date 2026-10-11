<script setup lang="ts">
import { NavDisclosure, NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
</script>

<template>
  <div class="nav-menu-preview">
    <NavDisclosure label="Account menu">
      <template #trigger="{ isOpen, panelId }">
        <button
          type="button"
          class="nav-menu-preview__trigger"
          :aria-controls="panelId"
          :aria-expanded="isOpen ? 'true' : 'false'"
          aria-haspopup="menu"
        >
          <span class="i-carbon-user" aria-hidden="true" />
          Account
        </button>
      </template>
      <template #default="{ close, focusRequest }">
        <NavMenu label="Account menu" :focus-request="focusRequest" @close="close">
          <NavMenuItem href="#profile" icon-class="i-carbon-user" label="Profile" />
          <NavMenuItem href="#notifications" icon-class="i-carbon-notification" label="Notifications" />
          <NavMenuItem href="#settings" icon-class="i-carbon-settings" label="Settings" />
        </NavMenu>
      </template>
    </NavDisclosure>
  </div>
</template>
