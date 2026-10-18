<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutHeader } from '@astryx-vue/core/Layout'
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
          <Button label="New Item" variant="primary" />
        </HStack>
      </LayoutHeader>
    </template>
    <LayoutContent>
      <Card variant="muted" />
    </LayoutContent>
  </Layout>
</template>
