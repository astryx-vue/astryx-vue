<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
import { useDemoText } from '../../demo-infra/useDemoText'
import { MISTY_VALLEY } from './images'

const { pick } = useDemoText()
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ pick('从空到上传、处理，再到完成', 'Lifecycle: empty → uploading → processing → loaded') }}
      </Text>
      <Stack align="end" direction="horizontal" :gap="3">
        <Stack direction="vertical" :gap="1" h-align="center">
          <Thumbnail label="report.pdf" />
          <Text type="supporting" color="secondary">
            {{ pick('占位', 'Placeholder') }}
          </Text>
        </Stack>
        <Stack direction="vertical" :gap="1" h-align="center">
          <Thumbnail is-loading label="uploading.jpg" />
          <Text type="supporting" color="secondary">
            {{ pick('骨架', 'Skeleton') }}
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
            {{ pick('上传中', 'Uploading') }}
          </Text>
        </Stack>
        <Stack direction="vertical" :gap="1" h-align="center">
          <Thumbnail
            :src="MISTY_VALLEY"
            alt="Misty mountain valley"
            label="misty-valley.jpg"
          />
          <Text type="supporting" color="secondary">
            {{ pick('已加载', 'Loaded') }}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  </Stack>
</template>
