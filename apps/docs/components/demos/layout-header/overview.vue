<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Center } from '@astryx-vue/core/Center'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Center :width="400" max-width="100%">
    <Layout style="width: 100%" height="fill">
      <template #header>
        <LayoutHeader has-divider>
          <HStack align="center" :gap="2" h-align="between">
            <Heading :level="4">
              Dashboard
            </Heading>
            <HStack :gap="2">
              <Button label="Export" variant="secondary" @click="demo('Export')" />
              <Button label="New Item" variant="primary" @click="demo('New Item')" />
            </HStack>
          </HStack>
        </LayoutHeader>
      </template>
      <template #start>
        <LayoutPanel has-divider :width="140">
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
  </Center>
</template>
