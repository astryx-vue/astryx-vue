<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { ButtonVariant } from '../Button/types.js'
import type { AlertDialogEmits, AlertDialogProps, AlertDialogSlots } from './types.js'
import { computed, provide, useId, useTemplateRef } from 'vue'
import Button from '../Button/Button.vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import Dialog from '../Dialog/Dialog.vue'
import Heading from '../Heading/Heading.vue'
import Stack from '../Stack/Stack.vue'
import Text from '../Text/Text.vue'
import { ALERT_DIALOG_CONTEXT_KEY } from './context.js'
import '../../styles/alert-dialog.css'

defineOptions({ name: 'AstryxAlertDialog', inheritAttrs: false })

const props = withDefaults(defineProps<AlertDialogProps>(), {
  actionVariant: 'destructive',
  cancelLabel: 'Cancel',
  isActionLoading: false,
  isInline: false,
  width: 400,
})

const emit = defineEmits<AlertDialogEmits>()
defineSlots<AlertDialogSlots>()

const titleId = `astryx-alert-dialog-title-${useId()}`
const descriptionId = `astryx-alert-dialog-description-${useId()}`
// Dialog still owns the width and the modal behavior; the query exists only so
// AlertDialog can put the destructive action first in the DOM on a narrow
// screen, keeping visual and tab order aligned without reacting to pointer or
// hover capability.
const isSmallScreen = useMediaQuery('(max-width: 640px)')

provide(ALERT_DIALOG_CONTEXT_KEY, { descriptionId, isSmallScreen, titleId })

const dialog = useTemplateRef<ComponentPublicInstance>('dialog')
const element = computed<HTMLElement | null>(() => {
  const rendered: unknown = dialog.value?.$el
  return rendered instanceof HTMLElement ? rendered : null
})

function focus(options?: FocusOptions): void {
  element.value?.focus(options)
}

function blur(): void {
  element.value?.blur()
}

defineExpose({ element, focus, blur })

interface AlertDialogAction {
  /** Marks the least destructive choice as the initial focus target. */
  autofocus?: string
  className: string
  isLoading: boolean
  key: string
  label: string
  variant: ButtonVariant
  onClick: (event: MouseEvent) => void
}

/**
 * Order is part of the contract, not just the visual: on a narrow screen the
 * destructive action sits above Cancel so visual, DOM, and tab order agree,
 * while Cancel keeps the initial focus because it is the safe choice.
 */
const actions = computed<AlertDialogAction[]>(() => {
  const cancel: AlertDialogAction = {
    autofocus: '',
    className: 'astryx-alert-dialog__action astryx-alert-dialog__action--cancel',
    isLoading: false,
    key: 'cancel',
    label: props.cancelLabel,
    variant: 'ghost',
    onClick: () => emit('openChange', false),
  }
  const confirm: AlertDialogAction = {
    className: 'astryx-alert-dialog__action astryx-alert-dialog__action--confirm',
    isLoading: props.isActionLoading,
    key: 'confirm',
    label: props.actionLabel,
    variant: props.actionVariant,
    onClick: event => emit('action', event),
  }

  return isSmallScreen.value ? [confirm, cancel] : [cancel, confirm]
})

const dialogRole = computed(() => (props.isInline ? 'group' : 'alertdialog'))
const layout = computed(() => (isSmallScreen.value ? 'stacked' : 'row'))
</script>

<template>
  <Dialog
    ref="dialog"
    v-bind="$attrs"
    class="astryx-alert-dialog"
    :aria-describedby="descriptionId"
    :aria-labelledby="titleId"
    :data-layout="layout"
    :is-inline="isInline"
    :is-open="isOpen"
    purpose="form"
    :role="dialogRole"
    :width="width"
    @open-change="emit('openChange', $event)"
  >
    <div class="astryx-alert-dialog__content">
      <Heading :id="titleId" class="astryx-alert-dialog__title" :level="2">
        <slot name="title">
          {{ title }}
        </slot>
      </Heading>
      <Text
        :id="descriptionId"
        as="div"
        class="astryx-alert-dialog__description"
        color="secondary"
        type="body"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </Text>
    </div>

    <div class="astryx-alert-dialog__footer">
      <Stack
        class="astryx-alert-dialog__actions"
        :direction="isSmallScreen ? 'vertical' : 'horizontal'"
        :gap="2"
        :h-align="isSmallScreen ? 'stretch' : 'end'"
        :wrap="isSmallScreen ? 'nowrap' : 'wrap'"
      >
        <slot name="actions" />
        <Button
          v-for="action in actions"
          :key="action.key"
          :class="action.className"
          :data-autofocus="action.autofocus"
          :is-loading="action.isLoading"
          :label="action.label"
          :variant="action.variant"
          @click="action.onClick($event)"
        />
      </Stack>
    </div>
  </Dialog>
</template>
