<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { NavHeadingMenu, NavHeadingMenuItem } from '@astryx-vue/core/NavMenu'
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
</script>

<template>
  <div class="side-nav-preview">
    <SideNav>
      <template #header>
        <SideNavHeading heading="Product Name" subheading="Business Account">
          <template #icon>
            <NavIcon icon-class="i-carbon-cube" label="Product" />
          </template>
          <template #menu>
            <NavHeadingMenu label="Accounts">
              <NavHeadingMenuItem href="#personal" label="Personal Account" />
              <NavHeadingMenuItem href="#acme" label="Acme Corp" />
              <NavHeadingMenuItem href="#add" label="Add account" />
              <NavHeadingMenuItem href="#sign-out" label="Sign out" />
            </NavHeadingMenu>
          </template>
        </SideNavHeading>
      </template>
      <SideNavSection title="Navigation">
        <SideNavItem href="#dashboard" icon-class="i-carbon-home" is-selected label="Dashboard" />
        <SideNavItem href="#settings" icon-class="i-carbon-settings" label="Settings" />
      </SideNavSection>
    </SideNav>
  </div>
</template>
