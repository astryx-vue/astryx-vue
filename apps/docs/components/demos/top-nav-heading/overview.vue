<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { TopNav, TopNavHeading } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNav label="Product navigation">
    <template #heading>
      <TopNavHeading heading="Acme Platform" href="#home">
        <template #logo>
          <NavIcon icon-class="i-carbon-cube" />
        </template>
      </TopNavHeading>
    </template>
  </TopNav>
</template>
