<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { MoreMenu } from '@astryx-vue/core/MoreMenu'
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="side-nav-preview">
    <SideNav>
      <template #header>
        <SideNavHeading heading="My App" heading-href="#home" />
      </template>
      <SideNavSection title="Navigation" is-header-hidden>
        <SideNavItem href="#dashboard" icon-class="i-carbon-home" is-selected label="Dashboard">
          <template #end>
            <MoreMenu
              label="Dashboard actions"
              size="sm"
              :items="[{ label: 'Pin to top' }, { label: 'Rename' }]"
            />
          </template>
        </SideNavItem>
        <SideNavItem href="#projects" icon-class="i-carbon-folder" label="Projects">
          <template #end>
            <Badge>12</Badge>
          </template>
        </SideNavItem>
        <SideNavItem href="#analytics" icon-class="i-carbon-analytics" label="Analytics">
          <template #end>
            <Badge>New</Badge>
          </template>
        </SideNavItem>
        <SideNavItem href="#team" icon-class="i-carbon-group" label="Team">
          <template #end>
            <Text color="secondary" type="supporting">
              8 members
            </Text>
          </template>
        </SideNavItem>
      </SideNavSection>
    </SideNav>
  </div>
</template>
