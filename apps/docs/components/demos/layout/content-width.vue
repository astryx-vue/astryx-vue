<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Layout :content-width="360" height="fill">
    <template #header>
      <LayoutHeader has-divider>
        <p class="layout-title">
          Centered Form
        </p>
      </LayoutHeader>
    </template>
    <LayoutContent>
      <VStack :gap="3">
        <Text type="body">
          The contentWidth prop constrains content to a maximum width and centers it within the layout. Dividers remain full-bleed while content stays narrow and readable.
        </Text>
        <Text color="secondary" type="body">
          Common widths: 640 for forms, 960 for content pages.
        </Text>
      </VStack>
    </LayoutContent>
    <template #footer>
      <LayoutFooter has-divider>
        <HStack :gap="2" h-align="end">
          <Button label="Cancel" variant="secondary" @click="demo('Cancel')" />
          <Button label="Submit" variant="primary" @click="demo('Submit')" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
