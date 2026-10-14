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
      <DialogHeader title="Delete project?" has-close-button @open-change="requestClose()" />
    </template>
    <LayoutContent>
      <Text type="body">
        This will permanently delete "Marketing Dashboard" and all of its data. This action cannot be undone.
      </Text>
    </LayoutContent>
    <template #footer>
      <LayoutFooter>
        <HStack h-align="end" :gap="2">
          <Button label="Cancel" variant="secondary" @click="requestClose()" />
          <Button label="Delete" variant="destructive" @click="requestClose()" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
