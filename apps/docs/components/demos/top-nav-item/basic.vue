<script setup lang="ts">
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNav label="Main navigation">
    <template #heading>
      <TopNavHeading heading="App" />
    </template>
    <TopNavItem href="#" is-selected label="Dashboard" />
    <TopNavItem href="#" label="Projects" />
    <TopNavItem href="#" label="Reports" />
  </TopNav>
</template>
