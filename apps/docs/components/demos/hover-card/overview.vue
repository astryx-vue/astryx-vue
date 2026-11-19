<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { HoverCard } from '@astryx-vue/core/HoverCard'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <HoverCard placement="above">
    <Button label="@janedoe" variant="ghost" />
    <template #content>
      <Stack direction="vertical" :gap="2" style="width: 240px">
        <Stack align="center" direction="horizontal" :gap="2">
          <Avatar name="Jane Doe" size="lg" />
          <Stack direction="vertical" :gap="0">
            <Heading :level="5">
              Jane Doe
            </Heading>
            <Text type="supporting" color="secondary">
              Software Engineer
            </Text>
          </Stack>
        </Stack>
        <Text type="body" color="secondary">
          Building great products with great people.
        </Text>
      </Stack>
    </template>
  </HoverCard>
</template>
