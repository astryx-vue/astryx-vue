<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ButtonGroup } from '@astryx-vue/core/ButtonGroup'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack direction="vertical" :gap="3" h-align="start">
    <Text type="supporting" color="secondary">
      The whole group shares one raised surface — a floating action bar
    </Text>
    <ButtonGroup label="Zoom controls" elevation="med">
      <Button label="Zoom out" />
      <Button label="Reset" />
      <Button label="Zoom in" />
    </ButtonGroup>
  </Stack>
</template>
