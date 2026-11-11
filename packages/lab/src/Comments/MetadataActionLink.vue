<script setup lang="ts">
import { Link, Text } from '@astryx-vue/core'

defineOptions({ name: 'AstryxCommentMetadataActionLink' })

const props = withDefaults(defineProps<{
  label: string
  accessibleLabel?: string
  actionRole?: 'history'
  isDisabled?: boolean
  textType?: 'body' | 'supporting'
}>(), {
  isDisabled: false,
  textType: 'supporting',
})

const emit = defineEmits<{ click: [] }>()

function onClick(event: MouseEvent): void {
  event.preventDefault()
  if (!props.isDisabled)
    emit('click')
}
</script>

<template>
  <Link
    :label="accessibleLabel ?? label"
    color="secondary"
    class="astryx-metadata-action"
    :data-metadata-action="actionRole"
    :is-disabled="isDisabled"
    @click="onClick"
  >
    <Text as="span" :type="textType" color="inherit">
      {{ label }}
    </Text>
  </Link>
</template>
