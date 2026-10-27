<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type { FileInputEmits, FileInputProps, FileInputValue } from './types.js'
import { computed, shallowRef, useAttrs, useId, useTemplateRef } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { formatFileSize, selectFiles } from '../composables/useFileSelection.js'
import Field from '../Field/Field.vue'
import FieldIcon from '../Field/FieldIcon.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import InputClearButton from '../Field/InputClearButton.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
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
  statusVariant: 'attached',
})

const emit = defineEmits<FileInputEmits>()
const model = defineModel<FileInputValue>({ default: null })
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'FileInput',
  props,
  attrs,
  reservedAttrs: ['id', 'accept', 'multiple', 'disabled', 'type', 'tabindex', 'aria-disabled', 'aria-invalid', 'aria-describedby'],
})
const messages = useAstryxMessages()
const announce = useAnnounce()
const generatedId = `astryx-file-input-${useId()}`
const inputId = computed(() => props.id ?? generatedId)
const requiredId = `${generatedId}-required`
const fileInput = useTemplateRef<HTMLInputElement>('file')
const controlRef = useTemplateRef<HTMLDivElement>('control')
const validationError = shallowRef<string | null>(null)
const pendingCount = shallowRef(0)
const isPending = computed(() => pendingCount.value > 0)
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
const conveysRequired = computed(() => props.isRequired && !props.isOptional)

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

function applyFiles(list: FileList | File[] | null | undefined): void {
  if (props.isDisabled)
    return
  const result = selectFiles(list, {
    accept: props.accept,
    maxSize: props.maxSize,
    maxFiles: props.maxFiles,
    isMultiple: props.isMultiple,
  })
  const first = result.rejections[0]
  if (first?.code === 'type' && first.fileName)
    validationError.value = messages.value.fileInput.errorType(first.fileName)
  else if (first?.code === 'size' && first.fileName)
    validationError.value = messages.value.fileInput.errorSize(first.fileName, formatFileSize(first.maxSize ?? 0))
  else if (first?.code === 'count')
    validationError.value = messages.value.fileInput.errorCount(first.maxFiles ?? 0)
  else
    validationError.value = null

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
  }
  if (fileInput.value)
    fileInput.value.value = ''
}

function openPicker(): void {
  if (!props.isDisabled)
    fileInput.value?.click()
}

function onChange(event: Event): void {
  applyFiles((event.target as HTMLInputElement).files)
}

function clear(): void {
  if (props.isDisabled)
    return
  validationError.value = null
  commit(null)
  runChangeAction(null)
  if (fileInput.value)
    fileInput.value.value = ''
}

function onDragOver(event: DragEvent): void {
  if (props.mode !== 'dropzone' || props.isDisabled)
    return
  event.preventDefault()
  dragOver.value = true
}

function onDragLeave(): void {
  dragOver.value = false
}

function onDrop(event: DragEvent): void {
  if (props.mode !== 'dropzone' || props.isDisabled)
    return
  event.preventDefault()
  dragOver.value = false
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
      <div
        ref="control"
        class="astryx-file-input astryx-bordered-control"
        :class="parts.controlClass()" :style="parts.controlStyle()"
        :data-mode="mode" :data-size="size" :data-status="status?.type" :data-disabled="isDisabled || undefined" :data-drag="dragOver || undefined"
        @pointerenter="disabledTooltip.onPointerEnter"
        @pointerleave="disabledTooltip.onPointerLeave"
      >
        <input
          :id="`${inputId}-file`" ref="file" class="astryx-file-input-native" type="file"
          :accept="accept" :multiple="isMultiple || undefined" :disabled="isDisabled" tabindex="-1"
          @change="onChange"
        >
        <button
          v-bind="parts.forwardedAttrs()"
          :id="inputId" type="button" class="astryx-file-input-trigger"
          :disabled="isDisabled && !showsDisabledMessage" :aria-disabled="showsDisabledMessage || undefined" :aria-invalid="status?.type === 'error' || undefined"
          :aria-busy="isPending || props.isLoading || undefined"
          :aria-describedby="[field.describedBy, conveysRequired ? requiredId : undefined, showsDisabledMessage ? disabledMessageId : undefined].filter(Boolean).join(' ') || undefined"
          @click="openPicker" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop"
          @focus="disabledTooltip.onFocus" @blur="disabledTooltip.onBlur"
        >
          <Icon class="astryx-file-input-icon" icon="upload" size="sm" />
          <span class="astryx-file-input-text" :data-placeholder="!fileLabel || undefined">{{ fileLabel || placeholder }}</span>
        </button>
        <InputClearButton v-if="fileLabel && !isDisabled" :label="clearLabel" @click="clear" />
        <Spinner v-if="isLoading || isPending" size="sm" />
        <FieldIcon v-else-if="status" :type="status.type" />
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
