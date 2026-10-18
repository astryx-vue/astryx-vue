<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { SideNav, SideNavHeading } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <template #header>
      <SideNavHeading heading="Analytics" heading-href="#home">
        <template #icon>
          <NavIcon icon-class="i-carbon-grid" />
        </template>
      </SideNavHeading>
    </template>
  </SideNav>
</template>
