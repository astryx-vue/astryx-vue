<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { VStack } from '@astryx-vue/core/Stack'
import { TopNav, TopNavHeading } from '@astryx-vue/core/TopNav'

const appIconPath = 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z'
</script>

<template>
  <VStack :gap="4">
    <TopNav label="Plain heading example">
      <template #heading>
        <TopNavHeading heading="Acme Platform">
          <template #logo>
            <NavIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="appIconPath" />
              </svg>
            </NavIcon>
          </template>
        </TopNavHeading>
      </template>
    </TopNav>
    <TopNav label="Linked heading example">
      <template #heading>
        <TopNavHeading heading="Acme Platform" heading-href="/">
          <template #logo>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" :d="appIconPath" />
            </svg>
          </template>
        </TopNavHeading>
      </template>
    </TopNav>
  </VStack>
</template>
