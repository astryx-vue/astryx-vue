<script setup lang="ts">
import type { TokenEmits, TokenProps, TokenSlots } from './types.js'
import { computed, toRaw, useAttrs } from 'vue'
import { useInteractiveRole } from '../composables/useInteractiveRole.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import { isSafeUrl } from '../Link/safeUrl.js'
import { useLinkComponent } from '../LinkProvider/context.js'
import { useAstryxMessages } from '../locale/index.js'
import { disabledInteractionProps } from '../utils/disabledInteraction.js'
import { textDirection } from '../utils/textDirection.js'
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
/** 正名 isLabelHidden，旧名 labelHidden 任一为真就藏起文字。 */
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden)
const linkComponent = useLinkComponent()
/** 删除按钮、尾部插槽里的控件被手指按下时，Token 自己的动作不执行，所以 Token 不亮。 */
const press = usePressFeedback({ isContainer: true })
/** 有链接时用的根组件，没有 provider 时还是 `<a>`。危险协议退回普通锚点。 */
const safeHref = computed(() => {
  const href = props.href
  return href != null && href !== '' && isSafeUrl(href) ? href : undefined
})
const linkRoot = computed(() => {
  if (safeHref.value == null || linkComponent.value == null)
    return 'a'
  return toRaw(linkComponent.value)
})
const removeLabel = computed(() => messages.value.token.remove(props.label))
const clickable = computed(() => attrs.onClick != null)
const linked = computed(() => safeHref.value != null)
const interactive = computed(() => clickable.value || linked.value || props.removable)
const rootIsLink = computed(() => linked.value && !props.removable)
/** 删除按钮旁边那个动作元素是什么，由 `useInteractiveRole` 统一排序。 */
const actionRole = useInteractiveRole({
  href: () => (props.removable ? safeHref.value : undefined),
  hasOnClick: () => clickable.value && !linked.value,
})
const actionIsLink = computed(() => actionRole.role.value === 'link')
const actionIsButton = computed(() => actionRole.role.value === 'button')
/** 禁用时不再用原生 disabled，改用可聚焦的 aria-disabled 加共用事件守卫。 */
const disabledInteraction = computed(() => props.disabled ? disabledInteractionProps() : undefined)
/** 没有右到左字母的标签按左到右排，`@alice`、`C++` 在右到左页面上不会被重排。 */
const labelDir = computed(() => textDirection(props.label))

/**
 * 命名、弹层和按下状态这几个属性要落在承担动作的元素上：
 * 可点击 token 落在里面的按钮上，其余结构落在根上。
 */
const ACTION_ARIA = new Set(['aria-labelledby', 'aria-describedby', 'aria-haspopup', 'aria-expanded', 'aria-pressed'])

function ariaName(key: string): string {
  return /^aria[A-Z]/.test(key) ? key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`) : key
}

const actionAria = computed(() => actionIsButton.value
  ? Object.fromEntries(Object.entries(attrs).filter(([key]) => ACTION_ARIA.has(ariaName(key))))
  : {})

function callListener(listener: unknown, event: Event): void {
  if (typeof listener === 'function')
    listener(event)
  else if (Array.isArray(listener))
    listener.forEach(item => callListener(item, event))
}

/** 有地址的 token 也调用调用方的 click：链接本身就是它的动作。 */
function runLinkClick(event: MouseEvent): void {
  callListener(attrs.onClick, event)
}

const rootAttrs = computed(() => {
  const own: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'onClick' || (actionIsButton.value && ACTION_ARIA.has(ariaName(key))))
      continue
    if (key === 'onKeydown' && rootIsLink.value && props.disabled)
      continue
    own[key] = value
  }
  if (interactive.value && !props.disabled)
    Object.assign(own, press.pressableProps)
  if (rootIsLink.value) {
    // 禁用的链接仍是可聚焦的链接，只是没有去处；Enter、空格不再触发，其余按键照常交给调用方。
    if (props.disabled)
      Object.assign(own, disabledInteractionProps(event => callListener(attrs.onKeydown, event)))
    else
      own.onClick = runLinkClick
  }
  return own
})

function runClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  callListener(attrs.onClick, event)
}

function onRemoveClick(event: MouseEvent): void {
  event.stopPropagation()
  if (props.disabled) {
    event.preventDefault()
    return
  }
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
    :is="rootIsLink ? (props.disabled ? 'a' : linkRoot) : 'span'"
    v-bind="rootAttrs"
    class="astryx-token"
    :class="[`size-${props.size}`, { 'is-interactive': interactive, 'is-disabled': props.disabled }]"
    :data-color="props.color"
    :data-disabled="props.disabled || undefined"
    :href="rootIsLink && !props.disabled ? safeHref : undefined"
    :to="rootIsLink && !props.disabled && linkRoot !== 'a' ? safeHref : undefined"
    :role="rootIsLink && props.disabled ? 'link' : undefined"
    :aria-disabled="rootIsLink && props.disabled ? 'true' : undefined"
    :aria-label="hideLabel ? props.label : undefined"
    :aria-description="props.description"
    :tabindex="rootIsLink && props.disabled ? 0 : undefined"
    @keydown="onKeydown"
  >
    <span v-if="$slots.icon" class="astryx-token-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <component
      :is="props.disabled ? 'a' : linkRoot"
      v-if="actionIsLink"
      class="astryx-token-action"
      :href="props.disabled ? undefined : safeHref"
      :to="props.disabled || linkRoot === 'a' ? undefined : safeHref"
      :role="props.disabled ? 'link' : undefined"
      :aria-disabled="props.disabled || undefined"
      :tabindex="props.disabled ? 0 : undefined"
      v-bind="{ ...press.pressActionProps, ...(props.disabled ? disabledInteraction : { onClick: runLinkClick }) }"
    >
      <span class="astryx-token-label" :class="{ 'is-hidden': hideLabel }" :dir="labelDir">{{ props.label }}</span>
    </component>
    <button
      v-else-if="actionIsButton"
      type="button"
      class="astryx-token-action"
      v-bind="{ ...actionAria, ...disabledInteraction, ...press.pressActionProps }"
      :aria-disabled="props.disabled || undefined"
      @click="runClick"
    >
      <span class="astryx-token-label" :class="{ 'is-hidden': hideLabel }" :dir="labelDir">{{ props.label }}</span>
    </button>
    <span v-else class="astryx-token-label" :class="{ 'is-hidden': hideLabel }" :dir="labelDir">{{ props.label }}</span>
    <slot name="end">
      <slot name="endContent" />
    </slot>
    <button
      v-if="props.removable"
      type="button"
      class="astryx-token-remove"
      :aria-label="removeLabel"
      :aria-disabled="props.disabled || undefined"
      v-bind="disabledInteraction"
      @click="onRemoveClick"
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  </component>
</template>
