<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Button } from '@astryx-vue/core/Button'
import { HStack, StackItem, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const users = [
  { name: 'Olivia Chen', role: 'Engineering Lead' },
  { name: 'Marcus Rivera', role: 'Product Designer' },
  { name: 'Aisha Patel', role: 'Marketing Manager' },
]
</script>

<template>
  <VStack :gap="3" width="100%" style="max-width: 300px">
    <HStack v-for="user in users" :key="user.name" align="center" :gap="3">
      <StackItem size="static">
        <Avatar :name="user.name" size="md" />
      </StackItem>
      <StackItem size="fill">
        <VStack :gap="0">
          <Text type="body" weight="bold">
            {{ user.name }}
          </Text>
          <Text color="secondary" type="supporting">
            {{ user.role }}
          </Text>
        </VStack>
      </StackItem>
      <StackItem size="static">
        <Button label="View" size="sm" variant="secondary" />
      </StackItem>
    </HStack>
  </VStack>
</template>
