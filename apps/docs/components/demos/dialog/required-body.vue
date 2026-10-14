<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { DialogHeader } from '@astryx-vue/core/Dialog'
import { Layout, LayoutContent, LayoutFooter } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

defineProps<{ requestClose: () => void }>()
</script>

<template>
  <Layout>
    <template #header>
      <DialogHeader
        title="Transfer project ownership"
        subtitle="This action requires confirmation from the new owner"
      />
    </template>
    <LayoutContent>
      <Text type="body">
        You are about to transfer "Marketing Dashboard" to Sarah Chen. Once accepted, you will lose admin access.
      </Text>
    </LayoutContent>
    <template #footer>
      <LayoutFooter>
        <HStack h-align="end" :gap="2">
          <Button label="Cancel" variant="secondary" @click="requestClose()" />
          <Button label="Transfer" variant="primary" @click="requestClose()" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
