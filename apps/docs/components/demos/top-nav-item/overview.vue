<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="top-nav-item-overview">
    <TopNav label="Navigation items demo">
      <template #heading>
        <TopNavHeading heading="App" />
      </template>
      <TopNavItem label="Dashboard" href="#" is-selected icon-class="i-heroicons-home" />
      <TopNavItem label="Projects" href="#" />
      <TopNavItem label="Reports" href="#" />
      <TopNavItem label="Archived" href="#" is-disabled />
      <template #end>
        <Icon icon="search" />
      </template>
    </TopNav>
  </div>
</template>

<style scoped>
.top-nav-item-overview {
  width: 600px;
  max-width: 100%;
}
</style>
