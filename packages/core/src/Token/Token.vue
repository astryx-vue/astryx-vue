<script setup lang="ts">
import type { TokenEmits, TokenProps, TokenSlots } from './types.js'
import { computed, toRaw, useAttrs } from 'vue'
import { useInteractiveRole } from '../composables/useInteractiveRole.js'
import { useLinkComponent } from '../LinkProvider/context.js'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/token.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxToken', inheritAttrs: false })

const props = withDefaults(defineProps<TokenProps>(), {
  size: 'md',
  color: 'default',
  disabled: false,
  labelHidden: false,
  removable: false,
})

const emit = defineEmits<TokenEmits>()
defineSlots<TokenSlots>()

const attrs = useAttrs()
const messages = useAstryxMessages()
const linkComponent = useLinkComponent()
/** 有链接时用的根组件，没有 provider 时还是 `<a>`。 */
const linkRoot = computed(() => (linkComponent.value == null ? 'a' : toRaw(linkComponent.value)))
const removeLabel = computed(() => messages.value.token.remove(props.label))
const clickable = computed(() => typeof attrs.onClick === 'function')
const linked = computed(() => Boolean(props.href))
const interactive = computed(() => clickable.value || linked.value || props.removable)

const rootIsLink = computed(() => linked.value && !props.removable)
/** 删除按钮旁边那个动作元素是什么，由 `useInteractiveRole` 统一排序。 */
const actionRole = useInteractiveRole({
  href: () => (props.removable ? props.href : undefined),
  hasOnClick: () => clickable.value && !linked.value,
})
const actionIsLink = computed(() => actionRole.role.value === 'link')
const actionIsButton = computed(() => actionRole.role.value === 'button')

const rootAttrs = computed(() => {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'onClick'))
})

function runClick(event: MouseEvent): void {
  if (props.disabled)
    return
  const listener = attrs.onClick
  if (typeof listener === 'function')
    listener(event)
}

function onRemoveClick(event: MouseEvent): void {
  event.stopPropagation()
  if (!props.disabled)
    emit('remove', event)
}

function onKeydown(event: KeyboardEvent): void {
  if (props.disabled || !props.removable)
    return
  if (event.key !== 'Backspace' && event.key !== 'Delete')
    return
  event.preventDefault()
  event.stopPropagation()
  emit('remove', event)
}
</script>

<template>
  <component
    :is="rootIsLink ? linkRoot : 'span'"
    v-bind="rootAttrs"
    class="astryx-token"
    :class="[`size-${props.size}`, { 'is-interactive': interactive, 'is-disabled': props.disabled }]"
    :data-color="props.color"
    :href="rootIsLink && !props.disabled ? props.href : undefined"
    :to="rootIsLink && !props.disabled && linkRoot !== 'a' ? props.href : undefined"
    :aria-disabled="props.disabled && (rootIsLink || actionIsLink) ? 'true' : undefined"
    :aria-label="props.labelHidden ? props.label : undefined"
    :aria-description="props.description"
    :tabindex="rootIsLink && props.disabled ? -1 : undefined"
    @keydown="onKeydown"
  >
    <span v-if="$slots.icon" class="astryx-token-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <component
      :is="actionIsLink ? linkRoot : 'a'"
      v-if="actionIsLink"
      class="astryx-token-action"
      :href="props.disabled ? undefined : props.href"
      :to="props.disabled || linkRoot === 'a' ? undefined : props.href"
      :aria-disabled="props.disabled || undefined"
      :tabindex="props.disabled ? -1 : undefined"
    >
      <span class="astryx-token-label" :class="{ 'is-hidden': props.labelHidden }">{{ props.label }}</span>
    </component>
    <button
      v-else-if="actionIsButton"
      type="button"
      class="astryx-token-action"
      :disabled="props.disabled"
      @click="runClick"
    >
      <span class="astryx-token-label" :class="{ 'is-hidden': props.labelHidden }">{{ props.label }}</span>
    </button>
    <span v-else class="astryx-token-label" :class="{ 'is-hidden': props.labelHidden }">{{ props.label }}</span>
    <slot name="end">
      <slot name="endContent" />
    </slot>
    <button
      v-if="props.removable"
      type="button"
      class="astryx-token-remove"
      :aria-label="removeLabel"
      :disabled="props.disabled"
      @click="onRemoveClick"
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  </component>
</template>
