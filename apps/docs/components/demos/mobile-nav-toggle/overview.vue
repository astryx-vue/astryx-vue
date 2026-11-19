<script setup lang="ts">
import { MobileNav, MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <HStack align="center" :gap="3">
    <MobileNavToggle v-model:is-open="isOpen" />
    <Text type="body" weight="bold">
      Page title
    </Text>
  </HStack>
  <MobileNav v-model:is-open="isOpen" header="Navigation">
    <SideNavSection title="Pages">
      <SideNavItem label="Home" is-selected href="#" />
      <SideNavItem label="Settings" href="#" />
    </SideNavSection>
  </MobileNav>
</template>
