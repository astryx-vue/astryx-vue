<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <Tooltip content="This is a helpful tooltip" placement="above">
    <Button label="Hover me" />
  </Tooltip>
</template>
