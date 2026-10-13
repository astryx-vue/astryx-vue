<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextArea } from '@astryx-vue/core/TextArea'
import { TextInput } from '@astryx-vue/core/TextInput'
import { reactive, ref } from 'vue'

const isOpen = ref(false)
const values = reactive({
  name: '',
  email: '',
  company: '',
  role: '',
  bio: '',
  notes: '',
})

function onSubmit(): void {
  isOpen.value = false
}
</script>

<template>
  <Button label="Edit profile" @click="isOpen = true" />
  <BottomSheet
    v-model:is-open="isOpen"
    height="tall"
    label="Edit profile"
  >
    <form @submit.prevent="onSubmit">
      <VStack :gap="4">
        <Heading :level="3">
          Edit profile
        </Heading>
        <Divider />
        <Text type="supporting" color="secondary">
          Focus fields throughout the form to see them remain visible above the mobile keyboard.
        </Text>
        <TextInput v-model="values.name" label="Name" />
        <TextInput v-model="values.email" label="Email" type="email" />
        <TextInput v-model="values.company" label="Company" />
        <TextInput v-model="values.role" label="Role" />
        <TextArea v-model="values.bio" label="Bio" :rows="5" />
        <TextArea v-model="values.notes" label="Notes" :rows="5" />
        <Button label="Save profile" type="submit" />
      </VStack>
    </form>
  </BottomSheet>
</template>
