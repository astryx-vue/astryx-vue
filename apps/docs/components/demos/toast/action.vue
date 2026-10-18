<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Link } from '@astryx-vue/core/Link'
import { VStack } from '@astryx-vue/core/Stack'
import { Toast, ToastViewport, useToast } from '@astryx-vue/core/Toast'

const toast = useToast()
</script>

<template>
  <VStack :gap="3">
    <Toast :is-auto-hide="false" body="Item deleted" type="info">
      <template #end>
        <Button
          label="Undo"
          size="sm"
          variant="secondary"
          @click="toast({ body: 'Undo successful', type: 'info' })"
        />
      </template>
    </Toast>
    <Toast :is-auto-hide="false" body="Your report is ready." type="info">
      <template #end>
        <Link href="#" has-underline>
          View report
        </Link>
      </template>
    </Toast>
    <ToastViewport />
  </VStack>
</template>
