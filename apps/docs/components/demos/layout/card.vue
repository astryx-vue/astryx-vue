<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card :height="300" width="100%" style="max-width: 400px">
    <Layout>
      <template #header>
        <LayoutHeader has-divider>
          <p class="layout-title">
            Card Title
          </p>
        </LayoutHeader>
      </template>
      <LayoutContent>
        <VStack :gap="3">
          <Text type="body">
            This is a basic card layout with a header, scrollable content area, and footer. The layout automatically handles padding and spacing between sections.
          </Text>
          <Text type="body">
            When content exceeds the available height, the content area scrolls independently while the header and footer stay fixed in place.
          </Text>
          <Text type="body">
            This pattern works well for modal dialogs, detail panels, and any card where the amount of content is unpredictable.
          </Text>
          <Text type="body">
            The dividers between header, content, and footer provide clear visual boundaries between the fixed and scrollable regions.
          </Text>
        </VStack>
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
  </Card>
</template>
