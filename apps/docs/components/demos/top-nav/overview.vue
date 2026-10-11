<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="nav-overview">
    <TopNav label="Main navigation">
      <template #heading>
        <TopNavHeading heading="My App" href="#home">
          <template #icon>
            <NavIcon icon-class="i-carbon-cube" label="Product" />
          </template>
        </TopNavHeading>
      </template>
      <TopNavItem href="#home" is-selected label="Home" />
    </TopNav>
  </div>
</template>
