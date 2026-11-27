<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutHeader } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        <HStack :gap="2" h-align="between" align="center">
          <Heading :level="4">
            Dashboard
          </Heading>
          <Button label="New Item" variant="primary" @click="demo('New Item')" />
        </HStack>
      </LayoutHeader>
    </template>
    <LayoutContent>
      <Card variant="muted" />
    </LayoutContent>
  </Layout>
</template>
