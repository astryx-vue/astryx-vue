<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Badge } from '@astryx-vue/core/Badge'
import { Card } from '@astryx-vue/core/Card'
import { Carousel } from '@astryx-vue/core/Carousel'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const team = [
  { name: 'Alice Chen', role: 'Engineering Lead', color: 'blue' as const },
  { name: 'Bob Smith', role: 'Product Designer', color: 'purple' as const },
  { name: 'Carol Davis', role: 'Product Manager', color: 'green' as const },
  { name: 'Andrew Thomas', role: 'Design Manager', color: 'red' as const },
  { name: 'Gina Wilson', role: 'Software Engineer', color: 'orange' as const },
]
</script>

<template>
  <Stack direction="vertical" :gap="3" :max-width="520" style="padding: 8px">
    <Text type="body" weight="bold">
      Team members
    </Text>
    <Carousel :gap="2" has-snap has-buttons label="Team members">
      <Card v-for="person in team" :key="person.name" :width="180" :min-height="140">
        <Stack direction="vertical" :gap="3" h-align="center">
          <Avatar :name="person.name" size="lg" />
          <Stack direction="vertical" :gap="1" h-align="center">
            <Text type="body" weight="bold">
              {{ person.name }}
            </Text>
            <Badge :variant="person.color">
              {{ person.role }}
            </Badge>
          </Stack>
        </Stack>
      </Card>
    </Carousel>
  </Stack>
</template>
