<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
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
            <NavMenu label="Accounts">
              <NavMenuItem href="#personal" label="Personal Account" />
              <NavMenuItem href="#acme" label="Acme Corp" />
              <NavMenuItem href="#add" label="Add account" />
              <NavMenuItem href="#sign-out" label="Sign out" />
            </NavMenu>
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
