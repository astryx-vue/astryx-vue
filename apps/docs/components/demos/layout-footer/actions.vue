<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutFooter } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Layout>
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
