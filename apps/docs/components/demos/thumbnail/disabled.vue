<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
import { useDemoText } from '../../demo-infra/useDemoText'
import { GOLDEN_SUNSET } from './images'

const { pick } = useDemoText()

function noop() {}
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ pick('可用', 'Enabled') }}
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <Thumbnail
          :src="GOLDEN_SUNSET"
          alt="Golden sunset over mountains"
          label="golden-sunset.jpg"
          show-remove-on="always"
          @remove="noop"
        />
        <Thumbnail
          label="document.pdf"
          show-remove-on="always"
          @remove="noop"
        />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ pick('禁用', 'Disabled') }}
      </Text>
      <Stack align="center" direction="horizontal" :gap="3">
        <Thumbnail
          :src="GOLDEN_SUNSET"
          alt="Golden sunset over mountains"
          label="golden-sunset.jpg"
          is-disabled
          @remove="noop"
        />
        <Thumbnail label="document.pdf" is-disabled @remove="noop" />
      </Stack>
    </Stack>
  </Stack>
</template>
