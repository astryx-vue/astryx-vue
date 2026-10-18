<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack align="center" :gap="4">
    <NavIcon icon-class="i-carbon-search" />
    <NavIcon icon-class="i-carbon-calendar" />
    <NavIcon icon-class="i-carbon-tools" />
  </HStack>
</template>
