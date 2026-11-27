<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { NavHeadingMenu, NavHeadingMenuItem } from '@astryx-vue/core/NavMenu'
import { TopNav, TopNavHeading } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNav label="Workspace navigation">
    <template #heading>
      <TopNavHeading heading="Acme Platform" subheading="Production">
        <template #logo>
          <NavIcon icon-class="i-carbon-cube" />
        </template>
        <template #menu>
          <NavHeadingMenu size="lg">
            <NavHeadingMenuItem description="Live traffic" href="#production" icon-class="i-carbon-earth" label="Production" />
            <NavHeadingMenuItem description="Release candidates" href="#staging" icon-class="i-carbon-development" label="Staging" />
            <NavHeadingMenuItem description="Ask an admin for access" icon-class="i-carbon-locked" is-disabled label="Sandbox" />
          </NavHeadingMenu>
        </template>
      </TopNavHeading>
    </template>
  </TopNav>
</template>
