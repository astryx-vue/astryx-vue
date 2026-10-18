<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div style="width: 380px; max-width: 100%">
    <Stepper :active-step="0" orientation="vertical">
      <Step
        description="Astryx reads your build settings from the default branch"
        is-optional
        label="Connect a repository"
        :step="0"
      >
        <template #end>
          <Text type="supporting" color="secondary">
            2 min
          </Text>
        </template>
      </Step>
    </Stepper>
  </div>
</template>
