<script setup lang="ts">
import type { ThumbnailEmits, ThumbnailProps } from './types.js'
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
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
const press = usePressFeedback({ hasOverlay: false })

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
/**
 * 上传时的转圈只是装饰，对读屏隐藏；缩略图自己在每次开始忙时用共享的播报通道
 * 说一次「加载中」。和文字同时出生的 status 区域，很多读屏软件不会念。
 */
const announce = useAnnounce()
watch(showUpload, (isUploading) => {
  if (isUploading)
    announce(messages.value.spinner.loading)
}, { immediate: true })
const showPlaceholder = computed(() => (!props.isLoading && !hasSrc.value) || Boolean(hasError.value))
const accessibleName = computed(() => {
  if (props.label && props.alt)
    return `${props.label} — ${props.alt}`
  return props.label ?? props.alt ?? messages.value.thumbnail.fallbackName
})

/**
 * Open 和 Remove 在不能操作时仍然挂着：可以聚焦，读屏念出「已禁用」，但什么都不调用。
 * 拿掉它们会让正在上面的键盘焦点掉到页面 body。
 */
const hasOpen = computed(() => hasListener('onClick'))
const canOpen = computed(() => !props.isDisabled && !props.isLoading)

function onImageError() {
  failedSrc.value = props.src
}

function onOpen(event: MouseEvent) {
  if (!canOpen.value) {
    // 指针或辅助技术仍可能派发点击：不调用，也不让外层的点击处理拿到它。
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}

/** 不能操作的 Open 上，Enter 和空格不派发点击。 */
function onOpenKeydown(event: KeyboardEvent) {
  if (!canOpen.value && (event.key === 'Enter' || event.key === ' '))
    event.preventDefault()
}

function onRemove(event: MouseEvent) {
  event.stopPropagation()
  if (!props.isDisabled)
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
          v-if="hasOpen"
          type="button"
          v-bind="canOpen ? press.pressableProps : {}"
          class="astryx-thumbnail__open"
          :aria-label="messages.thumbnail.open(accessibleName)"
          :aria-disabled="canOpen ? undefined : 'true'"
          @click="onOpen"
          @keydown="onOpenKeydown"
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
          <Spinner size="sm" shade="onMedia" aria-hidden="true" />
        </span>
        <span
          v-if="hasListener('onRemove')"
          class="astryx-thumbnail__remove"
          :data-reveal="showRemoveOn"
        >
          <IconButton
            variant="secondary"
            size="sm"
            :label="messages.thumbnail.remove(accessibleName)"
            :is-disabled="isDisabled"
            @click="onRemove"
          >
            <Icon icon="close" size="sm" />
          </IconButton>
        </span>
      </div>
    </div>
  </Tooltip>
</template>
