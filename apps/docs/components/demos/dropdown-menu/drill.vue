<script setup lang="ts">
import { DropdownMenu, DropdownMenuItem, DropdownMenuSubMenu } from '@astryx-vue/core/DropdownMenu'
import { Icon } from '@astryx-vue/core/Icon'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const lastAction = ref<string | null>(null)
</script>

<template>
  <VStack :gap="3">
    <DropdownMenu :button="{ label: 'Actions' }">
      <DropdownMenuItem label="Rename" @click="lastAction = 'Rename'">
        <template #icon>
          <Icon name="carbon:edit" />
        </template>
      </DropdownMenuItem>
      <DropdownMenuSubMenu label="Move to" presentation="drill-in">
        <template #icon>
          <Icon name="carbon:folder-move-to" />
        </template>
        <DropdownMenuItem label="Projects" @click="lastAction = 'Projects'" />
        <DropdownMenuItem label="Archive" @click="lastAction = 'Archive'" />
      </DropdownMenuSubMenu>
      <DropdownMenuSubMenu has-spinner label="Share" menu-width="220px">
        <template #icon>
          <Icon name="carbon:share" />
        </template>
        <DropdownMenuItem is-disabled label="Loading destinations" />
      </DropdownMenuSubMenu>
    </DropdownMenu>
    <Text v-if="lastAction" color="secondary" type="supporting">
      Last action: {{ lastAction }}
    </Text>
  </VStack>
</template>
