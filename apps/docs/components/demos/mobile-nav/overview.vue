<script setup lang="ts">
import { NavItem } from '@astryx-vue/core/NavItem'
</script>

<template>
  <div class="mobile-nav-static">
    <div class="astryx-mobile-nav__drawer">
      <div class="astryx-mobile-nav__header">
        <span class="astryx-mobile-nav__title">Menu</span>
      </div>
      <div class="astryx-mobile-nav__body">
        <NavItem block href="#home" icon-class="i-carbon-home" is-selected label="Home" />
        <NavItem block href="#files" icon-class="i-carbon-folder" label="Files" />
        <NavItem block href="#settings" icon-class="i-carbon-settings" label="Settings" />
      </div>
    </div>
  </div>
</template>
