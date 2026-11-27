<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Center } from '@astryx-vue/core/Center'
import { HStack } from '@astryx-vue/core/Stack'
import { useToast } from '@astryx-vue/core/Toast'
import { Tooltip } from '@astryx-vue/core/Tooltip'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Center>
    <HStack :gap="4">
      <Tooltip content="Save your changes" placement="above">
        <Button label="Save" @click="demo('Save')" />
      </Tooltip>
      <Tooltip content="Discard changes" placement="above">
        <Button label="Cancel" @click="demo('Cancel')" />
      </Tooltip>
      <Tooltip content="Delete permanently" placement="above">
        <Button label="Delete" variant="destructive" @click="demo('Delete')" />
      </Tooltip>
    </HStack>
  </Center>
</template>
