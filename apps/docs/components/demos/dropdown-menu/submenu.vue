<script setup lang="ts">
import { DropdownMenu, DropdownMenuItem, DropdownMenuSubMenu } from '@astryx-vue/core/DropdownMenu'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const lastAction = ref<string | null>(null)
</script>

<template>
  <VStack :gap="3">
    <DropdownMenu :button="{ label: 'Actions' }">
      <DropdownMenuItem icon="css-icon css-icon--sm i-carbon-edit" label="Rename" @click="lastAction = 'Rename'" />
      <DropdownMenuSubMenu icon="css-icon css-icon--sm i-carbon-folder" label="Move to">
        <DropdownMenuItem label="Projects" @click="lastAction = 'Move to Projects'" />
        <DropdownMenuItem label="Archive" @click="lastAction = 'Move to Archive'" />
        <DropdownMenuItem label="Trash" @click="lastAction = 'Move to Trash'" />
      </DropdownMenuSubMenu>
      <DropdownMenuItem icon="css-icon css-icon--sm i-carbon-trash-can" label="Delete" @click="lastAction = 'Delete'" />
    </DropdownMenu>
    <Text v-if="lastAction" type="supporting" color="secondary">
      Last action: {{ lastAction }}
    </Text>
  </VStack>
</template>
