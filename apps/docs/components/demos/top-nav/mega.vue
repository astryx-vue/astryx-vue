<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { NavIcon } from '@astryx-vue/core/NavItem'
import { TopNav, TopNavHeading, TopNavItem, TopNavMegaMenu, TopNavMegaMenuFeaturedCard, TopNavMegaMenuItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="nav-frame">
    <TopNav label="Marketing navigation">
      <template #heading>
        <TopNavHeading heading="My App" href="#home">
          <template #icon>
            <NavIcon icon-class="i-carbon-cube" />
          </template>
        </TopNavHeading>
      </template>
      <TopNavMegaMenu label="Products">
        <TopNavMegaMenuItem description="Track and analyze user behavior across your apps" href="#analytics" icon-class="i-carbon-analytics" title="Analytics" />
        <TopNavMegaMenuItem description="Enterprise-grade protection for your data" href="#security" icon-class="i-carbon-security" title="Security" />
        <TopNavMegaMenuItem description="Streamline workflows with intelligent tools" href="#automation" icon-class="i-carbon-flash" title="Automation" />
        <TopNavMegaMenuItem description="APIs, SDKs, and CLI for integration" href="#dev-tools" icon-class="i-carbon-code" title="Developer Tools" />
        <TopNavMegaMenuItem description="Low-latency edge infra in 40+ regions" href="#network" icon-class="i-carbon-globe" title="Global Network" />
        <template #featured>
          <TopNavMegaMenuFeaturedCard
            description="AI-powered analytics and real-time collaboration."
            image="/template-assets/light-working-horizontal-1.png"
            link-href="#announcement"
            link-label="Read the announcement"
            title="What's new in v4.0"
          />
        </template>
      </TopNavMegaMenu>
      <TopNavItem href="#pricing" label="Pricing" />
      <TopNavItem href="#docs" label="Docs" />
      <template #end>
        <Button label="Sign in" variant="ghost" />
        <Button label="Get started" variant="primary" />
      </template>
    </TopNav>
  </div>
</template>
