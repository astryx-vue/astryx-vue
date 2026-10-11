<script setup lang="ts">
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="nav-frame">
    <TopNav>
      <template #heading>
        <TopNavHeading heading="My App" href="#home" />
      </template>
      <TopNavItem href="#home" is-selected label="Home" />
      <TopNavItem href="#products" label="Products" />
      <TopNavItem href="#about" label="About" />
    </TopNav>
  </div>
</template>
