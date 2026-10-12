<script setup lang="ts">
import { FileInput } from '@astryx-vue/core/FileInput'
import { shallowRef } from 'vue'

const value = shallowRef<File | File[] | null>(null)
</script>

<template>
  <div style="width: 350px">
    <FileInput
      v-model="value"
      label="Resume"
      accept=".pdf,.docx"
      description="PDF or Word document, up to 5 MB"
      :max-size="5 * 1024 * 1024"
    />
  </div>
</template>
