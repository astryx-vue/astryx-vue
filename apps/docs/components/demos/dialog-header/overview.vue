<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { Layout, LayoutContent } from '@astryx-vue/core/Layout'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Dialog is-open is-inline>
    <Layout>
      <template #header>
        <DialogHeader
          title="Edit Profile"
          subtitle="Update your personal information"
          has-close-button
        />
      </template>
      <LayoutContent>
        <Card variant="muted">
          <Text type="body" color="secondary">
            Dialog body content goes here.
          </Text>
        </Card>
      </LayoutContent>
    </Layout>
  </Dialog>
</template>
