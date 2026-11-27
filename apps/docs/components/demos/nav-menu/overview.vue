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

<style scoped>
/* 静态展示「已打开」的菜单：触发按钮在上，面板紧贴在下面，整组在画布里居中。 */
.nav-overview--menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: max-content;
  margin-inline: auto;
  padding-block: var(--astryx-spacing-4, 16px);
  gap: var(--astryx-spacing-1, 4px);
}

.nav-menu-static {
  position: static;
  animation: none;
}
</style>
