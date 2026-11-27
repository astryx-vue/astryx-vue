<script setup lang="ts">
import { SideNav, SideNavHeading } from '@astryx-vue/core/SideNav'
</script>

<template>
  <div class="side-nav-heading-overview">
    <SideNav label="Side navigation with a heading">
      <template #header>
        <SideNavHeading heading="Analytics" heading-href="#home">
          <template #icon>
            <span class="side-nav-heading-overview__app-icon i-heroicons-squares-2x2" />
          </template>
        </SideNavHeading>
      </template>
    </SideNav>
    <SideNav label="Side navigation with a heading, superheading and subheading">
      <template #header>
        <SideNavHeading
          heading="Analytics"
          heading-href="#home"
          subheading="Production"
          superheading="Acme Corp"
        >
          <template #icon>
            <span class="side-nav-heading-overview__app-icon i-heroicons-squares-2x2" />
          </template>
        </SideNavHeading>
      </template>
    </SideNav>
  </div>
</template>

<style scoped>
/* 两段标题并排、不换行，和原版的 HStack 一样：窄屏时第二段超出画布被裁掉。 */
.side-nav-heading-overview {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  max-width: 100%;
}

.side-nav-heading-overview :deep(.astryx-side-nav) {
  flex: none;
  width: 260px;
  height: auto;
}

.side-nav-heading-overview__app-icon {
  display: block;
  width: 20px;
  height: 20px;
}
</style>
