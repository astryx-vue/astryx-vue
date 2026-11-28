<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { VStack } from '@astryx-vue/core/Stack'
import { Switch } from '@astryx-vue/core/Switch'
import { TextInput } from '@astryx-vue/core/TextInput'
import { useToast } from '@astryx-vue/core/Toast'
import { defineComponent, h, ref } from 'vue'

// Toasts render in the app's single ToastViewport, mounted once at the root.
const toast = useToast()
const name = ref('Ada Lovelace')
const savedName = ref('Ada Lovelace')
const undoName = ref('Ada Lovelace')
const isSaveFailing = ref(false)

function save(): void {
  if (isSaveFailing.value) {
    toast({
      type: 'error',
      body: 'Could not save settings',
      uniqueID: 'settings-save',
    })
    return
  }
  // Saving an unchanged name keeps the earlier undo target.
  const nextUndoName = name.value === savedName.value ? undoName.value : savedName.value
  undoName.value = nextUndoName
  savedName.value = name.value
  const dismiss = toast({
    body: 'Settings saved',
    // A repeated Save replaces this toast instead of stacking another.
    uniqueID: 'settings-save',
    endContent: defineComponent(() => () => h(Button, {
      label: 'Undo',
      variant: 'ghost',
      size: 'sm',
      onClick: () => {
        name.value = nextUndoName
        savedName.value = nextUndoName
        dismiss()
      },
    })),
  })
}
</script>

<template>
  <Card :width="360" :padding="4">
    <VStack :gap="3">
      <TextInput v-model="name" label="Display name" />
      <Switch v-model="isSaveFailing" label="Simulate a failed save" />
      <Button label="Save" variant="primary" @click="save" />
    </VStack>
  </Card>
</template>
