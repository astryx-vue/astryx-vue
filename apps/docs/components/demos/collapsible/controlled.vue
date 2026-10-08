<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Collapsible } from '@astryx-vue/core/Collapsible'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div class="collapsible-preview">
    <VStack class="collapsible-preview__surface" :gap="3" h-align="start">
      <Collapsible v-model:is-open="isOpen" trigger="Release notes">
        <Text type="body" color="secondary">
          Version 4.2 adds inline comments to shared reports and drops the old
          export queue. Existing exports keep working until the next release.
        </Text>
      </Collapsible>
      <Button
        :label="isOpen ? 'Collapse from outside' : 'Expand from outside'"
        variant="secondary"
        @click="isOpen = !isOpen"
      />
    </VStack>
  </div>
</template>
