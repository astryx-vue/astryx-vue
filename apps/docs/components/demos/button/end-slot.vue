<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Button } from '@astryx-vue/core/Button'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Text type="supporting" color="secondary">
      Trailing badges for counts or status
    </Text>
    <Stack align="center" direction="horizontal" :gap="3">
      <Button label="Messages" variant="primary" @click="demo('Messages')">
        <template #end>
          <Badge variant="info">
            3
          </Badge>
        </template>
      </Button>
      <Button label="Notifications" variant="secondary" @click="demo('Notifications')">
        <template #end>
          <Badge variant="warning">
            12
          </Badge>
        </template>
      </Button>
      <Button label="Updates" variant="ghost" @click="demo('Updates')">
        <template #end>
          <Badge variant="neutral">
            New
          </Badge>
        </template>
      </Button>
    </Stack>
  </Stack>
</template>
