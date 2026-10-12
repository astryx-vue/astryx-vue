<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'
import { Section } from '@astryx-vue/core/Section'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card width="100%" style="max-width: 400px">
    <Layout>
      <template #header>
        <LayoutHeader has-divider>
          <p class="layout-title">
            Full Bleed Example
          </p>
        </LayoutHeader>
      </template>
      <LayoutContent :padding="0">
        <Section variant="muted">
          <Text type="body">
            Section automatically escapes the parent container padding to fill edge-to-edge. Useful for wash backgrounds, tables, or images that need to span the full width.
          </Text>
        </Section>
      </LayoutContent>
      <template #footer>
        <LayoutFooter has-divider>
          <HStack :gap="2" h-align="end">
            <Button label="Close" variant="secondary" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Card>
</template>
