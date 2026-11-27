<script setup lang="ts">
/**
 * 触屏底部弹层盖在自己上面的确认框：「全部清除」和「放弃改动」共用（上游
 * internal/SheetConfirmation.tsx）。
 *
 * 和 AlertDialog 不同：能点遮罩关闭；两个大号按钮占满整行、上下排开、隔开一点，
 * 危险操作在阅读顺序里排前面，安全操作先拿到焦点。保留 alert-dialog 的主题挂点。
 */
import { useId } from 'vue'
import Button from '../Button/Button.vue'
import Dialog from '../Dialog/Dialog.vue'
import Heading from '../Heading/Heading.vue'
import Stack from '../Stack/Stack.vue'
import Text from '../Text/Text.vue'
import '../../styles/alert-dialog.css'
import '../../styles/sheet-confirmation.css'

defineOptions({ name: 'AstryxSheetConfirmation' })

defineProps<{
  isOpen: boolean
  title: string
  description: string
  cancelLabel: string
  actionLabel: string
}>()

const emit = defineEmits<{
  openChange: [isOpen: boolean]
  action: []
}>()

const titleId = `astryx-sheet-confirmation-${useId()}`
const descriptionId = `${titleId}-description`
</script>

<template>
  <Dialog
    class="astryx-alert-dialog astryx-sheet-confirmation"
    :is-open="isOpen"
    purpose="info"
    role="alertdialog"
    :aria-labelledby="titleId"
    :aria-describedby="descriptionId"
    :width="400"
    @open-change="emit('openChange', $event)"
  >
    <div class="astryx-alert-dialog__content">
      <Heading :id="titleId" class="astryx-alert-dialog__title astryx-alert-dialog-title" :level="2">
        {{ title }}
      </Heading>
      <Text :id="descriptionId" as="div" class="astryx-alert-dialog__description astryx-alert-dialog-description" color="secondary" type="body">
        {{ description }}
      </Text>
    </div>
    <div class="astryx-alert-dialog__footer">
      <Stack class="astryx-alert-dialog__actions" direction="vertical" :gap="4" h-align="stretch">
        <Button class="astryx-sheet-confirmation__action" :label="actionLabel" variant="destructive" size="lg" @click="emit('action')" />
        <Button
          class="astryx-sheet-confirmation__action"
          :label="cancelLabel"
          variant="secondary"
          size="lg"
          data-autofocus=""
          @click="emit('openChange', false)"
        />
      </Stack>
    </div>
  </Dialog>
</template>
