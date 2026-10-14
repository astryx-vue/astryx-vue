<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <Text type="body">
    Learn more about our
    <Tooltip content="Your data is encrypted and never shared" placement="above">
      privacy policy
    </Tooltip>
    and
    <Tooltip content="Standard 30-day agreement" placement="above">
      terms of service
    </Tooltip>.
  </Text>
</template>
