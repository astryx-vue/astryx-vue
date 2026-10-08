<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { HoverCard } from '@astryx-vue/core/HoverCard'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="hover-card-preview">
    <div class="astryx-hover-card hover-card-preview__surface">
      <div class="astryx-hover-card__content">
        <HStack align="start" :gap="3">
          <Avatar name="Dana Whitfield" />
          <VStack :gap="1">
            <Text weight="medium">
              Dana Whitfield
            </Text>
            <Text type="supporting" color="secondary">
              Design systems engineer
            </Text>
          </VStack>
        </HStack>
      </div>
    </div>
    <HoverCard :delay="150" label="Dana Whitfield">
      Dana Whitfield
      <template #content>
        <HStack align="start" :gap="3">
          <Avatar name="Dana Whitfield" />
          <VStack :gap="1">
            <Text weight="medium">
              Dana Whitfield
            </Text>
            <Text type="supporting" color="secondary">
              Design systems engineer
            </Text>
          </VStack>
        </HStack>
      </template>
    </HoverCard>
  </div>
</template>
