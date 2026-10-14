<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
import { MISTY_VALLEY } from './images'
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ 'Lifecycle: empty → uploading → processing → loaded' }}
      </Text>
      <Stack align="end" direction="horizontal" :gap="3">
        <Stack direction="vertical" :gap="1" h-align="center">
          <Thumbnail label="report.pdf" />
          <Text type="supporting" color="secondary">
            {{ 'Placeholder' }}
          </Text>
        </Stack>
        <Stack direction="vertical" :gap="1" h-align="center">
          <Thumbnail is-loading label="uploading.jpg" />
          <Text type="supporting" color="secondary">
            {{ 'Skeleton' }}
          </Text>
        </Stack>
        <Stack direction="vertical" :gap="1" h-align="center">
          <Thumbnail
            :src="MISTY_VALLEY"
            alt="Misty mountain valley"
            is-loading
            label="misty-valley.jpg"
          />
          <Text type="supporting" color="secondary">
            {{ 'Uploading' }}
          </Text>
        </Stack>
        <Stack direction="vertical" :gap="1" h-align="center">
          <Thumbnail
            :src="MISTY_VALLEY"
            alt="Misty mountain valley"
            label="misty-valley.jpg"
          />
          <Text type="supporting" color="secondary">
            {{ 'Loaded' }}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  </Stack>
</template>
