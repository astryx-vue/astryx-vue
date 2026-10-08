<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Popover } from '@astryx-vue/core/Popover'
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const name = shallowRef('')
</script>

<template>
  <div class="input-preview-grid">
    <Popover label="Rename project" :width="280" :padding="4">
      <Button label="Rename" variant="secondary" />
      <template #content>
        <VStack :gap="3">
          <TextInput v-model="name" label="Project name" placeholder="Untitled project" />
          <Button label="Save" variant="primary" />
        </VStack>
      </template>
    </Popover>
  </div>
</template>
