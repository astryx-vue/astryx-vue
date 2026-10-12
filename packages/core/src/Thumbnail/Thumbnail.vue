<script setup lang="ts">
import type { ThumbnailEmits, ThumbnailProps } from './types.js'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/context.js'
import Skeleton from '../Skeleton/Skeleton.vue'
import Spinner from '../Spinner/Spinner.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import '../../styles/thumbnail.css'

defineOptions({ name: 'AstryxThumbnail', inheritAttrs: false })

const props = withDefaults(defineProps<ThumbnailProps>(), {
  isLoading: false,
  isDisabled: false,
  showRemoveOn: 'hover',
})

const emit = defineEmits<ThumbnailEmits>()
const messages = useAstryxMessages()
const failedSrc = ref<string>()
const instance = getCurrentInstance()

watch(() => props.src, () => {
  failedSrc.value = undefined
})

function hasListener(name: 'onRemove' | 'onClick') {
  return instance?.vnode.props?.[name] != null
}

const hasSrc = computed(() => props.src != null && props.src !== '')
const hasError = computed(() => hasSrc.value && failedSrc.value === props.src)
const showSkeleton = computed(() => props.isLoading && !hasSrc.value)
const showImage = computed(() => hasSrc.value && !showSkeleton.value && !hasError.value)
const showUpload = computed(() => props.isLoading && hasSrc.value)
const showPlaceholder = computed(() => (!props.isLoading && !hasSrc.value) || Boolean(hasError.value))
const accessibleName = computed(() => {
  if (props.label && props.alt)
    return `${props.label} — ${props.alt}`
  return props.label ?? props.alt ?? messages.value.thumbnail.fallbackName
})

function onImageError() {
  failedSrc.value = props.src
}

function onOpen(event: MouseEvent) {
  emit('click', event)
}

function onRemove(event: MouseEvent) {
  event.stopPropagation()
  emit('remove', event)
}
</script>

<template>
  <Tooltip
    :content="label ?? ''"
    :is-enabled="label != null"
    :has-hover-indication="false"
  >
    <div
      class="astryx-thumbnail"
      :class="$attrs.class"
      :style="$attrs.style"
      :data-disabled="isDisabled || undefined"
      role="group"
      :aria-label="accessibleName"
    >
      <div class="astryx-thumbnail__frame">
        <button
          v-if="hasListener('onClick') && !isDisabled && !isLoading"
          type="button"
          class="astryx-thumbnail__open"
          :aria-label="messages.thumbnail.open(accessibleName)"
          @click="onOpen"
        >
          <img
            v-if="showImage"
            class="astryx-thumbnail__image"
            :src="src"
            :alt="alt ?? ''"
            :role="alt ? undefined : 'presentation'"
            :aria-hidden="alt ? undefined : 'true'"
            @error="onImageError"
          >
          <Skeleton v-else-if="showSkeleton" :radius="2" />
          <span v-else-if="showPlaceholder" class="astryx-thumbnail__placeholder">
            <Icon icon="image" />
          </span>
        </button>
        <template v-else>
          <img
            v-if="showImage"
            class="astryx-thumbnail__image"
            :src="src"
            :alt="alt ?? ''"
            :role="alt ? undefined : 'presentation'"
            :aria-hidden="alt ? undefined : 'true'"
            @error="onImageError"
          >
          <Skeleton v-else-if="showSkeleton" :radius="2" />
          <span v-else-if="showPlaceholder" class="astryx-thumbnail__placeholder">
            <Icon icon="image" />
          </span>
        </template>
        <span v-if="showImage" class="astryx-thumbnail__border" />
        <span v-if="showUpload" class="astryx-thumbnail__loading">
          <Spinner size="sm" shade="onMedia" />
        </span>
        <span
          v-if="hasListener('onRemove') && !isDisabled"
          class="astryx-thumbnail__remove"
          :data-reveal="showRemoveOn"
        >
          <IconButton
            variant="secondary"
            size="sm"
            :label="messages.thumbnail.remove(accessibleName)"
            @click="onRemove"
          >
            <Icon icon="close" size="sm" />
          </IconButton>
        </span>
      </div>
    </div>
  </Tooltip>
</template>
