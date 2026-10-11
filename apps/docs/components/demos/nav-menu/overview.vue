<script setup lang="ts">
import { NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
</script>

<template>
  <div class="nav-overview nav-overview--menu">
    <button type="button" class="nav-menu-preview__trigger">
      Account
    </button>
    <div class="astryx-nav-disclosure__panel nav-menu-static">
      <NavMenu label="Account">
        <NavMenuItem href="#profile" label="Profile" />
        <NavMenuItem href="#notifications" label="Notifications" />
        <NavMenuItem href="#settings" label="Settings" />
      </NavMenu>
    </div>
  </div>
</template>
