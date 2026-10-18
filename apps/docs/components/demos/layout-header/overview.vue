<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        <HStack :gap="2" h-align="between" align="center">
          <Heading :level="4">
            Dashboard
          </Heading>
          <HStack :gap="2">
            <Button label="Export" variant="secondary" />
            <Button label="New Item" variant="primary" />
          </HStack>
        </HStack>
      </LayoutHeader>
    </template>
    <template #start>
      <LayoutPanel :width="140">
        <Card variant="muted" />
      </LayoutPanel>
    </template>
    <LayoutContent>
      <Card variant="muted" />
    </LayoutContent>
    <template #footer>
      <LayoutFooter has-divider>
        <Card variant="muted" />
      </LayoutFooter>
    </template>
  </Layout>
</template>
