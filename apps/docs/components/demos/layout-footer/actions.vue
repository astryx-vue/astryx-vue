<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutFooter } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Layout>
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
</template>
