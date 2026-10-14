<script setup lang="ts">
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const lastAction = ref<string | null>(null)

function run(action: string) {
  lastAction.value = action
}
</script>

<template>
  <VStack :gap="3">
    <DropdownMenu
      :button="{ label: 'Manage team' }"
      :items="[
        { label: 'Invite member', onClick: () => run('Invite') },
        { label: 'Edit roles', onClick: () => run('Edit roles') },
        { type: 'divider' },
        { label: 'Transfer ownership', isDisabled: true },
        { label: 'Delete team', isDisabled: true },
      ]"
    />
    <Text v-if="lastAction" type="supporting" color="secondary">
      Last action: {{ lastAction }}
    </Text>
    <Text type="supporting" color="secondary">
      Destructive actions are disabled for non-admin users
    </Text>
  </VStack>
</template>
