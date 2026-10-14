<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Toast, ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()
</script>

<template>
  <VStack :gap="3">
    <Toast :auto-close="false" body="You are offline" type="info" />
    <HStack align="center" :gap="3">
      <Button
        label="Offline (ignore)"
        size="sm"
        variant="secondary"
        @click="toast({ body: 'You are offline', uniqueID: 'offline', collisionBehavior: 'ignore', autoClose: false })"
      />
      <Button
        label="Progress (overwrite)"
        size="sm"
        variant="secondary"
        @click="toast({ body: `Uploading… ${Math.floor(Math.random() * 100)}%`, uniqueID: 'upload-progress', collisionBehavior: 'overwrite', autoClose: false })"
      />
    </HStack>
    <ToastViewport />
  </VStack>
</template>
