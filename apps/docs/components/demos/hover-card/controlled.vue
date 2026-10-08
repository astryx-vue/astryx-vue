<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { HoverCard } from '@astryx-vue/core/HoverCard'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const isOpen = ref(true)
</script>

<template>
  <div class="hover-card-preview">
    <HStack align="center" :gap="3">
      <HoverCard label="Pinned details" :is-open="isOpen" @open-change="isOpen = $event">
        Pinned details
        <template #content>
          <Text type="supporting">
            A controlled card ignores hover and focus. It stays open until isOpen changes, and pressing Escape only asks for that change.
          </Text>
        </template>
      </HoverCard>
      <Button :label="isOpen ? 'Close card' : 'Open card'" variant="secondary" @click="isOpen = !isOpen" />
    </HStack>
  </div>
</template>
