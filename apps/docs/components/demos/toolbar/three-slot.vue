<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { useToast } from '@astryx-vue/core/Toast'
import { Toolbar } from '@astryx-vue/core/Toolbar'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <div class="nav-frame">
    <Toolbar label="Document">
      <template #start>
        <Button label="Back" size="sm" variant="ghost" @click="demo('Back')" />
      </template>
      <template #center>
        <Heading :level="4" display="inline" type="label">
          Title
        </Heading>
      </template>
      <template #end>
        <Button label="Discard" size="sm" @click="demo('Discard')" />
        <Button label="Save" size="sm" variant="primary" @click="demo('Save')" />
      </template>
    </Toolbar>
  </div>
</template>
