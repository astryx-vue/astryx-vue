<script setup lang="ts">
import { InfoTip } from '@astryx-vue/core/InfoTip'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="input-preview-grid">
    <HStack :gap="2" align="center">
      <Text type="label">
        Active users
      </Text>
      <InfoTip content="30-day rolling average." label="About active users" />
    </HStack>
  </div>
</template>
