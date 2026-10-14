<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { Popover } from '@astryx-vue/core/Popover'
import { VStack } from '@astryx-vue/core/Stack'
import { Switch } from '@astryx-vue/core/Switch'
import { ref } from 'vue'

const notifications = ref(true)
const darkMode = ref(false)
const sounds = ref(true)
</script>

<template>
  <Popover placement="below" label="Settings" :width="280">
    <Button label="Settings" />
    <template #content>
      <VStack :gap="3">
        <Heading :level="4">
          Settings
        </Heading>
        <Divider />
        <Switch v-model="notifications" label="Notifications" description="Receive push notifications" />
        <Switch v-model="darkMode" label="Dark mode" description="Use dark color theme" />
        <Switch v-model="sounds" label="Sounds" description="Play sounds for actions" />
      </VStack>
    </template>
  </Popover>
</template>
