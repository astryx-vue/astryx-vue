<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Center } from '@astryx-vue/core/Center'
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
          <Card variant="muted" />
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
          <HStack :gap="2" h-align="end">
            <Button label="Cancel" variant="secondary" @click="demo('Cancel')" />
            <Button label="Save" variant="primary" @click="demo('Save')" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Center>
</template>
