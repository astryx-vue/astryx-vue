<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Center } from '@astryx-vue/core/Center'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <Center>
    <Tooltip content="Tooltip via hook" placement="above" :delay="100">
      <Button label="Using hook directly" />
    </Tooltip>
  </Center>
</template>
