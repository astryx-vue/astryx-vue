<script setup lang="ts">
import type { InputStatusVariant } from '@astryx-vue/core'
import type { FieldStatusInput } from '@astryx-vue/core/Field'
import { useInputStatusIcon } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { Field } from '@astryx-vue/core/Field'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref, useId } from 'vue'

const VALID_CODE = 'SAVE20'

const statusVariant = ref<InputStatusVariant>('attached')
const code = ref('SAVE10')
const inputId = useId()

const status = computed<FieldStatusInput | undefined>(() => {
  if (code.value === '')
    return undefined
  return code.value.toUpperCase() === VALID_CODE
    ? { type: 'success', message: 'Code applied: 20% off.' }
    : { type: 'error', message: 'This code is not valid.' }
})

// hook 按当前状态和摆放方式决定输入框里画什么：普通图标、带说明的按钮，或者什么都不画。
const { statusIcon, statusIconProps } = useInputStatusIcon({ status, statusVariant })
</script>

<template>
  <Card :width="360" :padding="4">
    <VStack :gap="3">
      <SegmentedControl v-model="statusVariant" label="Status variant" size="sm">
        <SegmentedControlItem value="attached" label="Attached" />
        <SegmentedControlItem value="detached" label="Detached" />
        <SegmentedControlItem value="tooltip" label="Tooltip" />
      </SegmentedControl>
      <Field
        label="Coupon code"
        is-label-hidden
        :input-id="inputId"
        :status="status"
        :status-variant="statusVariant"
      >
        <template #default="field">
          <div class="coupon-field" :data-status="status?.type">
            <input
              :id="inputId"
              v-model="code"
              class="coupon-field__input"
              type="text"
              placeholder="Enter a coupon code"
              :aria-invalid="status?.type === 'error' || undefined"
              :aria-describedby="field.describedBy"
            >
            <component :is="statusIcon" v-if="statusIcon" v-bind="statusIconProps" />
          </div>
        </template>
      </Field>
      <Text type="supporting">
        Type {{ VALID_CODE }} to see the success status.
      </Text>
    </VStack>
  </Card>
</template>

<style scoped>
.coupon-field {
  --coupon-border: var(--astryx-input-border, #d4d4d4);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--astryx-spacing-2, 8px);
  height: var(--astryx-input-height-md, 32px);
  padding-inline: var(--astryx-spacing-3, 12px);
  border: 1px solid var(--coupon-border);
  border-radius: var(--astryx-radius-element, 0.625rem);
  background: var(--astryx-input-background, #fff);
}

.coupon-field[data-status='error'] {
  --coupon-border: var(--astryx-color-border-error, #e33f4a);
  color: var(--astryx-color-border-error, #e33f4a);
}

.coupon-field[data-status='success'] {
  --coupon-border: var(--astryx-color-border-success, #198100);
  color: var(--astryx-color-border-success, #198100);
}

.coupon-field:focus-within {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--coupon-border) 25%, transparent);
}

.coupon-field__input {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: none;
  color: var(--astryx-color-text-primary, #171717);
  background: transparent;
  font: inherit;
}
</style>
