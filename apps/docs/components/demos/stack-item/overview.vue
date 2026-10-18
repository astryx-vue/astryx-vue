<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { HStack, StackItem } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <HStack :gap="3">
    <StackItem size="static">
      <Card>
        <Text type="supporting" color="secondary">
          Static Width
        </Text>
      </Card>
    </StackItem>
    <StackItem size="fill">
      <Card>
        <Text type="supporting" color="secondary">
          Fills remaining space
        </Text>
      </Card>
    </StackItem>
    <StackItem size="static">
      <Card>
        <Text type="supporting" color="secondary">
          Static Width
        </Text>
      </Card>
    </StackItem>
  </HStack>
</template>
