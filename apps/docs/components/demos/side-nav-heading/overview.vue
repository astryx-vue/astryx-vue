<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { SideNav, SideNavHeading } from '@astryx-vue/core/SideNav'
</script>

<template>
  <div class="side-nav-heading-overview">
    <SideNav>
      <template #header>
        <SideNavHeading heading="Analytics" heading-href="#home">
          <template #icon>
            <NavIcon icon-class="i-carbon-grid" />
          </template>
        </SideNavHeading>
      </template>
    </SideNav>
    <SideNav>
      <template #header>
        <SideNavHeading
          heading="Analytics"
          heading-href="#home"
          subheading="Production"
          superheading="Acme Corp"
        >
          <template #icon>
            <NavIcon icon-class="i-carbon-grid" />
          </template>
        </SideNavHeading>
      </template>
    </SideNav>
  </div>
</template>

<style scoped>
/* 两段标题并排展示。窄的地方换行，标题本身跟着容器收窄，不撑破画布。 */
.side-nav-heading-overview {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  max-width: 100%;
}

.side-nav-heading-overview :deep(.astryx-side-nav) {
  width: 260px;
  max-width: 100%;
  height: auto;
}
</style>
