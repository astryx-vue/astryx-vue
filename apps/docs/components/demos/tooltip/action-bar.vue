<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Center } from '@astryx-vue/core/Center'
import { HStack } from '@astryx-vue/core/Stack'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <Center>
    <HStack :gap="4">
      <Tooltip content="Save your changes" placement="above">
        <Button label="Save" />
      </Tooltip>
      <Tooltip content="Discard changes" placement="above">
        <Button label="Cancel" />
      </Tooltip>
      <Tooltip content="Delete permanently" placement="above">
        <Button label="Delete" variant="destructive" />
      </Tooltip>
    </HStack>
  </Center>
</template>
