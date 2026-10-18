<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        <Card variant="muted" />
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
        <HStack :gap="2" h-align="end">
          <Button label="Cancel" variant="secondary" />
          <Button label="Save" variant="primary" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
