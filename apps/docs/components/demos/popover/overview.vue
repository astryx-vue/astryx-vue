<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { Popover } from '@astryx-vue/core/Popover'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Popover placement="below" label="Settings" :width="280" :has-auto-focus="false">
    <Button label="Settings" />
    <template #content>
      <VStack :gap="3">
        <Heading :level="4" tabindex="0">
          Settings
        </Heading>
        <Divider />
        <Text type="body">
          Notifications, dark mode, and sound preferences.
        </Text>
      </VStack>
    </template>
  </Popover>
</template>
