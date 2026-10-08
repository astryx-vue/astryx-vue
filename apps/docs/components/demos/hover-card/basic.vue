<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Button } from '@astryx-vue/core/Button'
import { HoverCard } from '@astryx-vue/core/HoverCard'
import { Link } from '@astryx-vue/core/Link'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="hover-card-preview">
    <Text>
      <HoverCard :delay="150" :hide-delay="250" label="@dana">
        <Link href="#">
          @dana
        </Link>
        <template #content>
          <VStack :gap="3">
            <HStack align="start" :gap="3">
              <Avatar name="Dana Whitfield" />
              <VStack :gap="1">
                <Text weight="medium">
                  Dana Whitfield
                </Text>
                <Text type="supporting" color="secondary">
                  @dana
                </Text>
              </VStack>
            </HStack>
            <Text color="secondary">
              Porting a design system to Vue, one component at a time.
            </Text>
            <HStack :gap="2">
              <Button label="Follow" size="sm" variant="primary" />
              <Button label="Message" size="sm" variant="secondary" />
            </HStack>
          </VStack>
        </template>
      </HoverCard>
      shared a preview of the new card layout.
    </Text>
  </div>
</template>
