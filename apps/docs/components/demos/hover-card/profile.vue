<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { HoverCard } from '@astryx-vue/core/HoverCard'
import { Icon } from '@astryx-vue/core/Icon'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <HoverCard placement="below">
    <Button label="@janedoe" variant="ghost" />
    <template #content>
      <HStack v-align="start" :gap="3" style="max-width: 280px">
        <Avatar name="Jane Doe" :size="48" style="flex-shrink: 0" />
        <VStack :gap="1">
          <Heading :level="3">
            @janedoe
          </Heading>
          <Text type="body" color="secondary">
            Crafting accessible, scalable design systems for modern teams.
          </Text>
          <HStack v-align="center" :gap="1">
            <Icon icon="calendar" size="xsm" color="secondary" />
            <Text type="supporting" color="secondary">
              March 2024
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </template>
  </HoverCard>
</template>
