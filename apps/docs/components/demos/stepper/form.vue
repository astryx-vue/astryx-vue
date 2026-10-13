<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const active = ref(0)
const projectName = ref('')
const repository = ref('')
const nodeVersion = ref('')
const buildCommand = ref('')
</script>

<template>
  <div style="width: 100%; max-width: 480px">
    <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
      <Step indicator="number" label="Project details" :step="0">
        <div v-if="active === 0" class="stepper-form">
          <TextInput v-model="projectName" label="Project name" placeholder="My awesome project" />
          <TextInput v-model="repository" label="Repository URL" placeholder="https://github.com/..." />
          <div>
            <Button label="Continue" variant="primary" @click="active = 1" />
          </div>
        </div>
      </Step>
      <Step indicator="number" label="Environment" :step="1">
        <div v-if="active === 1" class="stepper-form">
          <TextInput v-model="nodeVersion" label="Node version" placeholder="20" />
          <TextInput v-model="buildCommand" label="Build command" placeholder="npm run build" />
          <div class="stepper-form-actions">
            <Button label="Back" variant="secondary" @click="active = 0" />
            <Button label="Continue" variant="primary" @click="active = 2" />
          </div>
        </div>
      </Step>
      <Step indicator="number" label="Deploy" :step="2">
        <div v-if="active === 2" class="stepper-form">
          <Text type="body">
            Ready to deploy. This creates a production build and pushes to your configured hosting.
          </Text>
          <div class="stepper-form-actions">
            <Button label="Back" variant="secondary" @click="active = 1" />
            <Button label="Deploy now" variant="primary" @click="active = 3" />
          </div>
        </div>
      </Step>
      <Step indicator="number" label="Done" :step="3" />
    </Stepper>
  </div>
</template>

<style scoped>
.stepper-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stepper-form-actions {
  display: flex;
  gap: 8px;
}
</style>
