<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="step-cells">
    <div class="step-cells__cell">
      <Text type="label">
        Completed
      </Text>
      <Stepper :active-step="1" orientation="vertical">
        <Step label="Verify email" :step="0" />
      </Stepper>
    </div>
    <div class="step-cells__cell">
      <Text type="label">
        Current
      </Text>
      <Stepper :active-step="0" orientation="vertical">
        <Step label="Verify email" :step="0" />
      </Stepper>
    </div>
    <div class="step-cells__cell">
      <Text type="label">
        Upcoming
      </Text>
      <Stepper :active-step="0" orientation="vertical">
        <Step label="Add a payment method" :step="1" />
      </Stepper>
    </div>
    <div class="step-cells__cell">
      <Text type="label">
        Disabled
      </Text>
      <Stepper :active-step="0" orientation="vertical">
        <Step is-disabled label="Add a payment method" :step="1" />
      </Stepper>
    </div>
    <div class="step-cells__cell">
      <Text type="label">
        Completed, with a status
      </Text>
      <Stepper :active-step="1" orientation="vertical">
        <Step label="Verify email" :step="0" status="warning" />
      </Stepper>
    </div>
  </div>
</template>

<style scoped>
.step-cells {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.step-cells__cell {
  width: 220px;
}
</style>
