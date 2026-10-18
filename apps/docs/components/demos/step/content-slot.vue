<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const street = ref('')
const city = ref('')
</script>

<template>
  <div style="width: 400px; max-width: 100%">
    <Stepper :active-step="0" orientation="vertical">
      <Step
        description="Used for invoices and tax calculation"
        label="Billing address"
        :step="0"
      >
        <div class="step-content-demo">
          <TextInput v-model="street" label="Street" placeholder="1 Hacker Way" />
          <TextInput v-model="city" label="City" placeholder="Menlo Park" />
          <div>
            <Button label="Save address" variant="primary" />
          </div>
        </div>
      </Step>
    </Stepper>
  </div>
</template>

<style scoped>
.step-content-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
