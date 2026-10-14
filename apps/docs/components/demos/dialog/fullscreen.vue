<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { Layout, LayoutContent, LayoutFooter } from '@astryx-vue/core/Layout'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const isOpen = ref(false)

const sections = [
  { title: 'Getting started', body: 'Create your first project by clicking New Project in the sidebar. Choose a template or start from scratch.' },
  { title: 'Team members', body: 'Invite collaborators from Settings > Team. Each member can have Admin, Editor, or Viewer permissions.' },
  { title: 'Billing', body: 'Free plans include up to 3 projects. Upgrade to Pro for unlimited projects and priority support.' },
  { title: 'API access', body: 'Generate API keys from Settings > Developer. Rate limits are 1,000 requests per minute on free plans.' },
  { title: 'Data export', body: 'Export your data anytime from Settings > Data. Exports are available as CSV or JSON within 24 hours.' },
]
</script>

<template>
  <Card>
    <VStack :gap="3">
      <VStack :gap="1">
        <Text type="body" weight="bold">
          Help &amp; Documentation
        </Text>
        <Text type="supporting" color="secondary">
          5 articles · Last updated Apr 2026
        </Text>
      </VStack>
      <Button label="Open documentation" variant="secondary" @click="isOpen = true" />
    </VStack>
  </Card>
  <Dialog :is-open="isOpen" variant="fullscreen" @open-change="isOpen = $event">
    <Layout>
      <template #header>
        <DialogHeader
          title="Documentation"
          subtitle="Everything you need to get started"
          has-close-button
          @open-change="isOpen = $event"
        />
      </template>
      <LayoutContent>
        <VStack :gap="4">
          <VStack v-for="section in sections" :key="section.title" :gap="1">
            <Text type="body" weight="bold">
              {{ section.title }}
            </Text>
            <Text type="body">
              {{ section.body }}
            </Text>
          </VStack>
        </VStack>
      </LayoutContent>
      <template #footer>
        <LayoutFooter>
          <HStack h-align="end">
            <Button label="Close" variant="primary" @click="isOpen = false" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Dialog>
</template>
