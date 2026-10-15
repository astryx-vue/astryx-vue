<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { NavHeadingMenu, NavHeadingMenuItem } from '@astryx-vue/core/NavMenu'
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="nav-frame">
    <TopNav label="Product navigation">
      <template #heading>
        <TopNavHeading
          heading="Console"
          heading-href="#console"
          subheading="Northwind"
          superheading="Acme Suite"
          superheading-href="#suite"
        >
          <template #logo>
            <NavIcon icon-class="i-carbon-cube" />
          </template>
          <template #menu>
            <NavHeadingMenu label="Switch product">
              <NavHeadingMenuItem href="#console" label="Console" />
              <NavHeadingMenuItem description="Usage and reports" href="#analytics" label="Analytics" />
              <NavHeadingMenuItem href="#settings" label="Settings" />
            </NavHeadingMenu>
          </template>
        </TopNavHeading>
      </template>
      <TopNavItem href="#overview" is-selected label="Overview" />
      <TopNavItem href="#docs" label="Docs" />
    </TopNav>
  </div>
</template>
