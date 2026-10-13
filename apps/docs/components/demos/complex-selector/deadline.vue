<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const presets = ['Today', 'Tomorrow', 'Next week']
const value = ref('Today')
const choice = ref('Today')
const custom = ref(false)
const date = ref('2026-04-18')
const time = ref('09:00')

function pick(preset: string) {
  custom.value = false
  choice.value = preset
}

function apply(commit: (next: string) => void, close: () => void) {
  const next = custom.value ? `${date.value} ${time.value}` : choice.value
  commit(next)
  close()
}
</script>

<template>
  <div style="width: 100%; max-width: 320px">
    <ComplexSelector
      v-model="value"
      description="Choose a preset or set a custom date and time."
      label="Deadline"
      :trigger-label="value"
      width="100%"
    >
      <template #default="{ commit, close }">
        <VStack :gap="3">
          <HStack :gap="2">
            <Button
              v-for="preset in presets"
              :key="preset"
              :label="preset"
              :variant="!custom && choice === preset ? 'primary' : 'secondary'"
              @click="pick(preset)"
            />
          </HStack>
          <Button label="Custom" variant="secondary" @click="custom = true" />
          <VStack v-if="custom" :gap="2">
            <TextInput v-model="date" label="Date" placeholder="YYYY-MM-DD" />
            <TextInput v-model="time" label="Time" placeholder="HH:MM" />
          </VStack>
          <Text color="secondary" type="supporting">
            The popup stays open until you apply.
          </Text>
          <Button label="Apply" variant="primary" @click="apply(commit, close)" />
        </VStack>
      </template>
    </ComplexSelector>
  </div>
</template>
