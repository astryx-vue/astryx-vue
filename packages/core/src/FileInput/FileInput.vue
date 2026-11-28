<script setup lang="ts">
import type { FileRejection } from '../composables/useFileSelection.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { FileInputEmits, FileInputProps, FileInputValue } from './types.js'
import { computed, shallowRef, useAttrs, useId, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { formatFileSize, selectFiles } from '../composables/useFileSelection.js'
import { useInputStatusIcon } from '../composables/useInputStatusIcon.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import InputClearButton from '../Field/InputClearButton.vue'
import { useAriaRequired } from '../FormLayout/context.js'
import Icon from '../Icon/Icon.vue'
import { useComponentMessages } from '../locale/context.js'
import { fileInputMessages } from '../locale/messages/file-input.js'
import { spinnerMessages } from '../locale/messages/spinner.js'
import { useListFormatter } from '../locale/useListFormatter.js'
import Spinner from '../Spinner/Spinner.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import '../../styles/bordered-control.css'
import '../../styles/file-input.css'

defineOptions({ name: 'AstryxFileInput', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<FileInputProps, 'modelValue'>>(), {
  modelValue: null,
  mode: 'input',
  size: 'md',
  isMultiple: false,
})

const emit = defineEmits<FileInputEmits>()
const model = defineModel<FileInputValue>({ default: null })
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'FileInput',
  props,
  attrs,
  reservedAttrs: ['id', 'accept', 'multiple', 'disabled', 'type', 'tabindex', 'aria-disabled', 'aria-invalid', 'aria-busy', 'aria-describedby'],
})
const messages = useComponentMessages({ fileInput: fileInputMessages, spinner: spinnerMessages })
const formatList = useListFormatter()
const announce = useAnnounce()
const generatedId = `astryx-file-input-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const requiredId = `${generatedId}-required`
const fileInput = useTemplateRef<HTMLInputElement>('file')
const triggerRef = useTemplateRef<HTMLButtonElement>('trigger')
const controlRef = useTemplateRef<HTMLDivElement>('control')
const validationError = shallowRef<string | null>(null)
const pendingCount = shallowRef(0)
const isPending = computed(() => pendingCount.value > 0)
const isBusy = computed(() => props.isLoading || isPending.value)
/** 禁用或忙碌时，不再接受新的选择：点击、键盘、拖放都一样。 */
const isSelectionDisabled = computed(() => props.isDisabled || isBusy.value)
const dragOver = shallowRef(false)
const disabledMessageId = `${generatedId}-disabled`
const disabledMessage = computed(() => props.disabledMessage?.trim() || undefined)
const showsDisabledMessage = computed(() => props.isDisabled === true && disabledMessage.value != null)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)

const placeholder = computed(() => props.placeholder ?? (
  props.isMultiple ? messages.value.fileInput.placeholderMultiple : messages.value.fileInput.placeholder
))
const clearLabel = computed(() => props.clearLabel ?? messages.value.fileInput.clearField(props.label))
const status = computed<FieldStatusInput | undefined>(() => props.status ?? (
  validationError.value ? { type: 'error', message: validationError.value } : undefined
))
const fileLabel = computed(() => {
  const value = model.value
  if (value == null)
    return ''
  const files = Array.isArray(value) ? value : [value]
  if (files.length === 0)
    return ''
  if (files.length === 1)
    return files[0]?.name ?? ''
  return files.map(file => file.name).join(', ')
})
// 表单的默认必填也算：没标 optional 的字段同样要念出「必填」。
const conveysRequired = useAriaRequired(props)
// 拖放区又高又大，贴在底下的状态说明会盖住放文件的地方，所以没写 statusVariant 时挪到下面。
const statusVariant = computed(() => props.statusVariant ?? (props.mode === 'dropzone' ? 'detached' : 'attached'))
const { statusIcon, statusIconProps } = useInputStatusIcon({ status, statusVariant })

// 选文件本身就是一次操作，已经念过「已选择」；它带出的忙碌不再念第二句。
// 标记一直留到字段空闲，其余忙碌的开始照常念「加载中」。
const isPickAnnounced = shallowRef(false)
watch([isPickAnnounced, isBusy], ([announced, busy]) => {
  if (announced && !busy)
    isPickAnnounced.value = false
}, { flush: 'post' })
useBusyAnnouncement(() => isBusy.value && !isPickAnnounced.value, () => messages.value.spinner.loading, () => controlRef.value)

function commit(value: FileInputValue): void {
  model.value = value
  emit('change', value)
}

function runChangeAction(value: FileInputValue): void {
  const action = props.changeAction
  if (action == null)
    return
  pendingCount.value += 1
  try {
    const result = action(value)
    if (result == null) {
      pendingCount.value -= 1
      return
    }
    void Promise.resolve(result).then(() => {
      pendingCount.value -= 1
    }, (error: unknown) => {
      pendingCount.value -= 1
      emit('actionError', error, value)
    })
  }
  catch (error) {
    pendingCount.value -= 1
    emit('actionError', error, value)
  }
}

const REJECTION_ORDER: readonly FileRejection['code'][] = ['type', 'size', 'count']

/** 每个被拒的文件各一句，先列类型不符的，再列超大的，最后是数量超限。 */
function rejectionMessages(rejections: readonly FileRejection[]): string[] {
  const text = messages.value.fileInput
  return REJECTION_ORDER.flatMap(code => rejections.filter(rejection => rejection.code === code)).map((rejection) => {
    if (rejection.code === 'type')
      return text.errorType(rejection.fileName ?? '')
    if (rejection.code === 'size')
      return text.errorSize(rejection.fileName ?? '', formatFileSize(rejection.maxSize ?? 0, text))
    return text.errorCount(rejection.maxFiles ?? 0)
  })
}

function applyFiles(list: FileList | File[] | null | undefined): void {
  if (isSelectionDisabled.value)
    return
  const result = selectFiles(list, {
    accept: props.accept,
    maxSize: props.maxSize,
    maxFiles: props.maxFiles,
    isMultiple: props.isMultiple,
  })
  const errors = rejectionMessages(result.rejections)
  validationError.value = errors.length > 0 ? formatList.value(errors) : null

  const files = result.files
  commit(files)
  if (files != null)
    runChangeAction(files)
  if (validationError.value == null && files != null) {
    const selected = Array.isArray(files) ? files : [files]
    if (selected.length === 1 && selected[0])
      announce(messages.value.fileInput.fileSelected(selected[0].name))
    else if (selected.length > 1)
      announce(messages.value.fileInput.filesSelected(selected.length))
    isPickAnnounced.value = true
  }
  if (fileInput.value)
    fileInput.value.value = ''
}

function describedBy(fieldIds?: string): string | undefined {
  // 调用方传的 aria-describedby 描述的是触发按钮本身，排在本组件自己的说明之前。
  return [attrs['aria-describedby'], fieldIds, conveysRequired.value ? requiredId : undefined, showsDisabledMessage.value ? disabledMessageId : undefined]
    .filter(Boolean)
    .join(' ') || undefined
}

function openPicker(): void {
  if (!isSelectionDisabled.value)
    fileInput.value?.click()
}

/** 禁用或忙碌的触发按钮仍能聚焦，但回车和空格不做任何事。 */
function onTriggerKeydown(event: KeyboardEvent): void {
  if (isSelectionDisabled.value && (event.key === 'Enter' || event.key === ' '))
    event.preventDefault()
}

function onChange(event: Event): void {
  applyFiles((event.target as HTMLInputElement).files)
}

/** 标签或说明点到隐藏的原生输入时也会直接激活它，禁用或忙碌时取消，选择框不会打开。 */
function onNativeClick(event: MouseEvent): void {
  if (isSelectionDisabled.value)
    event.preventDefault()
}

function clear(): void {
  if (props.isDisabled)
    return
  validationError.value = null
  commit(null)
  runChangeAction(null)
  if (fileInput.value)
    fileInput.value.value = ''
  // 焦点回到触发按钮，它才是人操作的控件；隐藏的原生输入不在无障碍树里。
  // 在点按这一下里聚焦，滚动过的页面留在原处。
  triggerRef.value?.focus({ preventScroll: true })
}

function onDragOver(event: DragEvent): void {
  // 不论哪种模式都要取消默认行为，否则文件掉在页面上，浏览器会直接打开它。
  event.preventDefault()
  if (isSelectionDisabled.value) {
    // 取消了的 dragover 默认会让这里成为放置目标；`none` 显示禁止光标，也不会触发放置。
    if (event.dataTransfer)
      event.dataTransfer.dropEffect = 'none'
    dragOver.value = false
  }
  else if (props.mode === 'dropzone') {
    dragOver.value = true
  }
}

function onDragLeave(event: DragEvent): void {
  event.preventDefault()
  // 经过拖放区自己的子元素也会触发 dragleave，只有真正离开拖放区才结束高亮。
  const related = event.relatedTarget
  if (related instanceof Node && controlRef.value?.contains(related))
    return
  dragOver.value = false
}

function onDrop(event: DragEvent): void {
  event.preventDefault()
  dragOver.value = false
  if (props.mode !== 'dropzone')
    return
  applyFiles(event.dataTransfer?.files)
}
</script>

<template>
  <Field
    :label="label" :input-id="inputId" :description="description" :width="width"
    :is-label-hidden="isLabelHidden" :is-disabled="isDisabled" :is-optional="isOptional" :is-required="isRequired"
    :label-tooltip="labelTooltip" :status="status" :status-variant="statusVariant"
    :class="parts.containerClass.value" :style="parts.containerStyle.value"
  >
    <template #default="field">
      <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 拖放目标不是交互元素，键盘操作走里面的触发按钮。 -->
      <div
        ref="control"
        class="astryx-file-input astryx-bordered-control"
        :class="parts.controlClass()" :style="parts.controlStyle()"
        :data-mode="mode" :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined" :data-busy="isBusy || undefined" :data-drag="dragOver || undefined"
        @pointerenter="disabledTooltip.onPointerEnter"
        @pointerleave="disabledTooltip.onPointerLeave"
        @dragenter="onDragOver" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop"
      >
        <!-- 禁用时脱离表单：选中的文件不提交，也不会因为 required 拦住提交。 -->
        <input
          :id="`${inputId}-file`" ref="file" class="astryx-file-input-native" type="file" aria-hidden="true"
          :accept="accept" :multiple="isMultiple || undefined" :form="isDisabled ? '' : undefined" tabindex="-1"
          @click="onNativeClick" @change="onChange"
        >
        <button
          v-bind="parts.forwardedAttrs()"
          :id="inputId" ref="trigger" type="button" class="astryx-file-input-trigger"
          :aria-disabled="isSelectionDisabled || undefined" :aria-invalid="status?.type === 'error' || undefined"
          :aria-busy="isBusy || undefined"
          :aria-describedby="describedBy(field.describedBy)"
          @click="openPicker" @keydown="onTriggerKeydown"
          @focus="disabledTooltip.onFocus" @blur="disabledTooltip.onBlur"
        >
          <Icon class="astryx-file-input-icon" icon="upload" :size="mode === 'dropzone' ? 'md' : 'sm'" />
          <span class="astryx-file-input-text" :data-placeholder="!fileLabel || undefined">{{ fileLabel || placeholder }}</span>
        </button>
        <InputClearButton v-if="fileLabel && !isDisabled" :label="clearLabel" @click="clear" />
        <Spinner v-if="isBusy" size="sm" aria-hidden="true" />
        <!-- 提示气泡的状态按钮是这条说明唯一的住处，拖放模式和上传中也得留着它。 -->
        <component :is="statusIcon" v-if="statusIcon && (!isBusy || statusVariant === 'tooltip')" v-bind="statusIconProps" />
      </div>
      <VisuallyHidden v-if="conveysRequired" :id="requiredId">
        {{ messages.fileInput.required }}
      </VisuallyHidden>
    </template>
  </Field>
  <VisuallyHidden v-if="showsDisabledMessage" :id="disabledMessageId">
    {{ disabledMessage }}
  </VisuallyHidden>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="`${disabledMessageId}-tooltip`" :anchor="controlRef" :open="disabledTooltip.isOpen.value" :text="disabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter" @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
</template>
