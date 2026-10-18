<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { Spinner } from '@astryx-vue/core/Spinner'
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="step-cells">
    <div class="step-cells__cell">
      <Text type="label">
        auto (default)
      </Text>
      <Stepper :active-step="1" orientation="vertical">
        <Step label="Verify email" :step="0" />
      </Stepper>
    </div>
    <div class="step-cells__cell">
      <Text type="label">
        number
      </Text>
      <Stepper :active-step="1" orientation="vertical">
        <Step indicator="number" label="Verify email" :step="0" />
      </Stepper>
    </div>
    <div class="step-cells__cell">
      <Text type="label">
        Custom node
      </Text>
      <Stepper :active-step="1" orientation="vertical">
        <Step label="Verify email" :step="0">
          <template #icon>
            <Icon icon="check" size="sm" />
          </template>
        </Step>
      </Stepper>
    </div>
    <div class="step-cells__cell">
      <Text type="label">
        none
      </Text>
      <Stepper :active-step="1" orientation="vertical">
        <Step indicator="none" label="Verify email" :step="0" />
      </Stepper>
    </div>
    <div class="step-cells__cell">
      <Text type="label">
        Spinner (in progress)
      </Text>
      <Stepper :active-step="0" orientation="vertical">
        <Step label="Verify email" :step="0">
          <template #icon>
            <Spinner size="sm" />
          </template>
        </Step>
      </Stepper>
    </div>
  </div>
</template>

<style scoped>
.step-cells {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.step-cells__cell {
  width: 190px;
}
</style>
