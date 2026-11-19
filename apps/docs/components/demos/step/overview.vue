<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <!-- 一个 Step 和它画出的每个部分：指示器、带可选标记和尾部内容的标签、下方说明。
       Step 总要放在 Stepper 里，进度从 Stepper 读。 -->
  <div style="width: 380px; max-width: 100%">
    <Stepper :active-step="1" orientation="vertical">
      <Step
        :step="1"
        label="Connect a repository"
        description="Astryx reads your build settings from the default branch"
        is-optional
      >
        <template #end>
          <Text type="supporting">
            2 min
          </Text>
        </template>
      </Step>
    </Stepper>
  </div>
</template>
