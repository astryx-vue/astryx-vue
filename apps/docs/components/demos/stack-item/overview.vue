<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { HStack, StackItem } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <HStack align="center" :gap="3" width="100%" class="stack-item-overview">
    <StackItem size="static">
      <Card :padding="3">
        <Text type="supporting" color="secondary">
          Static Width
        </Text>
      </Card>
    </StackItem>
    <StackItem size="fill">
      <Card :padding="3">
        <Text type="supporting" color="secondary">
          Fills remaining space
        </Text>
      </Card>
    </StackItem>
    <StackItem size="static">
      <Card :padding="3">
        <Text type="supporting" color="secondary">
          Static Width
        </Text>
      </Card>
    </StackItem>
  </HStack>
</template>

<style scoped>
.stack-item-overview {
  max-width: 500px;
  margin-inline: auto;
}
</style>
