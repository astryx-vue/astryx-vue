<script setup lang="ts">
import { NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
</script>

<template>
  <div class="nav-overview--row">
    <div class="astryx-nav-disclosure__panel nav-menu-static">
      <NavMenu label="Small" size="sm">
        <NavMenuItem href="#profile" label="Profile" />
        <NavMenuItem href="#settings" label="Settings" />
      </NavMenu>
    </div>
    <div class="astryx-nav-disclosure__panel nav-menu-static">
      <NavMenu label="Large" size="lg">
        <NavMenuItem href="#profile" label="Profile" />
        <NavMenuItem href="#settings" label="Settings" />
      </NavMenu>
    </div>
  </div>
</template>
