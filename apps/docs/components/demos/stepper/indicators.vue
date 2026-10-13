<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <div class="stepper-modes">
    <div>
      <Text type="label">
        None
      </Text>
      <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
        <Step indicator="none" label="Account" :step="0" />
        <Step indicator="none" label="Profile" :step="1" />
        <Step indicator="none" label="Settings" :step="2" />
        <Step indicator="none" label="Review" :step="3" />
      </Stepper>
    </div>
    <div>
      <Text type="label">
        Auto
      </Text>
      <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
        <Step label="Account" :step="0" />
        <Step label="Profile" :step="1" />
        <Step label="Settings" :step="2" />
        <Step label="Review" :step="3" />
      </Stepper>
    </div>
    <div>
      <Text type="label">
        Number
      </Text>
      <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
        <Step indicator="number" label="Account" :step="0" />
        <Step indicator="number" label="Profile" :step="1" />
        <Step indicator="number" label="Settings" :step="2" />
        <Step indicator="number" label="Review" :step="3" />
      </Stepper>
    </div>
    <div>
      <Text type="label">
        Custom icon
      </Text>
      <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
        <Step label="Account" :step="0">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-information" aria-hidden="true" />
          </template>
        </Step>
        <Step label="Profile" :step="1">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-search" aria-hidden="true" />
          </template>
        </Step>
        <Step label="Settings" :step="2">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-tools" aria-hidden="true" />
          </template>
        </Step>
        <Step label="Review" :step="3">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-checkmark" aria-hidden="true" />
          </template>
        </Step>
      </Stepper>
    </div>
  </div>
</template>

<style scoped>
.stepper-modes {
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
}

.stepper-modes > div {
  max-width: 220px;
}
</style>
