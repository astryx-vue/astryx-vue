<script setup lang="ts">
import { NavIcon, NavItem } from '@astryx-vue/core/NavItem'
</script>

<template>
  <div class="nav-item-preview">
    <NavItem href="/home" icon-class="i-carbon-home" is-selected label="Home" />
    <NavItem href="/files" icon-class="i-carbon-folder" label="Files" />
    <NavItem href="/settings" icon-class="i-carbon-settings" is-disabled label="Settings" />
    <NavItem href="/search" icon-class="i-carbon-search" is-icon-only label="Search" />
    <NavIcon icon-class="i-carbon-user" label="Ada" />
  </div>
</template>
