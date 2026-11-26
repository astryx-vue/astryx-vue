<script setup lang="ts">
import { useClipboard } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { HStack, StackItem, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'

const INVITE_LINK = 'https://example.com/invite/q7x2k9'

const { copy, isCopied } = useClipboard({ announce: 'Link copied' })
</script>

<template>
  <Card :width="420" :padding="4">
    <VStack :gap="3">
      <Text type="body" weight="bold">
        Share
      </Text>
      <HStack align="end" :gap="2">
        <StackItem size="fill">
          <TextInput :model-value="INVITE_LINK" label="Invite link" is-read-only />
        </StackItem>
        <Button :label="isCopied ? 'Copied' : 'Copy'" @click="copy(INVITE_LINK)" />
      </HStack>
    </VStack>
  </Card>
</template>
