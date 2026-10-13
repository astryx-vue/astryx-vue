/** Default editor buffer — matches upstream PlaygroundClient DEFAULT_CODE (Welcome card). */
export const DEFAULT_PLAYGROUND_CODE = `<script setup>
import { Button, Card, Heading, HStack, Layout, LayoutContent, LayoutFooter, LayoutHeader, Text } from '@astryx-vue/core'
</script>

<template>
  <Card :width="400" :padding="4">
    <Layout>
      <template #header>
        <LayoutHeader has-divider>
          <Heading :level="2">
            Welcome
          </Heading>
        </LayoutHeader>
      </template>
      <template #default>
        <LayoutContent>
          <Text type="body" color="secondary">
            Try out components in the code editor, open a ready-made template,
            and build your own theme in the theme editor — all in one place.
          </Text>
        </LayoutContent>
      </template>
      <template #footer>
        <LayoutFooter has-divider>
          <HStack justify="end">
            <Button label="Get started" variant="primary" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Card>
</template>
`
