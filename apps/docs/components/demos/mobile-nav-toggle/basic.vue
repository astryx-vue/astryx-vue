<script setup lang="ts">
import { MobileNav, MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <HStack align="center" :gap="3">
      <MobileNavToggle v-model:is-open="open" controls="mobile-nav-toggle-demo" label="Open menu" />
      <Text weight="bold">
        Page title
      </Text>
    </HStack>
    <MobileNav id="mobile-nav-toggle-demo" v-model:is-open="open" header="Navigation" side="start">
      <SideNavSection title="Pages">
        <SideNavItem href="#home" is-selected label="Home" />
        <SideNavItem href="#settings" label="Settings" />
      </SideNavSection>
    </MobileNav>
  </div>
</template>
