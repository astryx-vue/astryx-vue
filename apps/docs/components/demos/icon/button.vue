<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { useToast } from '@astryx-vue/core/Toast'
import { ref } from 'vue'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

const email = ref('')
</script>

<template>
  <VStack :gap="4" h-align="start">
    <HStack :gap="3" wrap="wrap">
      <Button label="Settings" variant="primary" @click="demo('Settings')">
        <template #icon>
          <Icon name="carbon:settings" />
        </template>
      </Button>
      <Button label="Continue" variant="secondary" @click="demo('Continue')">
        <template #end>
          <Icon name="carbon:chevron-right" />
        </template>
      </Button>
      <IconButton label="Search" @click="demo('Search')">
        <Icon name="carbon:search" />
      </IconButton>
    </HStack>
    <div style="width: 280px; max-width: 100%">
      <TextInput v-model="email" label="Email" placeholder="ada@example.com">
        <template #icon>
          <Icon name="carbon:email" />
        </template>
        <template #end>
          <Icon name="carbon:view" />
        </template>
      </TextInput>
    </div>
  </VStack>
</template>
