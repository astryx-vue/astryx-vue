<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { NavIcon } from '@astryx-vue/core/NavItem'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack align="center" :gap="4">
    <NavIcon>
      <Icon icon="search" />
    </NavIcon>
    <NavIcon>
      <Icon icon="calendar" />
    </NavIcon>
    <NavIcon>
      <Icon icon="wrench" />
    </NavIcon>
  </HStack>
</template>
