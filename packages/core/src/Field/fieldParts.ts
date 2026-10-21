import type { ComputedRef, HTMLAttributes, StyleValue } from 'vue'
import { computed, inject } from 'vue'
import { useDevWarning } from '../composables/useDevWarning.js'
import { useFormLayout } from '../FormLayout/context.js'
import { INPUT_GROUP_KEY } from '../InputGroup/context.js'

/**
 * 带 Field 的输入组件共用的样式分层属性。
 *
 * 一个输入组件有两个可以加样式的部件：
 * - 外壳（Field 那一层）：包着标签、控件和状态消息。用 `containerClass` / `containerStyle`。
 * - 本体（control box）：画边框和背景、里面装着图标和清除按钮的那个盒子。用 `controlClass` / `controlStyle`。
 *
 * 两组属性各管各的，不会改道：`container*` 永远落在外壳，`control*` 永远落在本体，
 * 都不会落到原生 input 上。组件根上直接写的 `class` / `style` 保持各组件今天的落点。
 */
export interface FieldPartStylingProps {
  /**
   * 加到字段外壳（Field 那一层）的 class。
   * 在 InputGroup 里、以及横向标签的 FormLayout 里没有外壳，这时它不生效，开发环境会警告。
   */
  containerClass?: HTMLAttributes['class']
  /** 加到字段外壳的行内样式。落点规则同 `containerClass`。 */
  containerStyle?: StyleValue
  /** 加到本体（画边框和背景的那个盒子）的 class。不会落到原生 input 上。 */
  controlClass?: HTMLAttributes['class']
  /** 加到本体的行内样式。 */
  controlStyle?: StyleValue
}

export interface UseFieldPartStylingOptions {
  /** 组件名，开发警告的前缀。 */
  component: string
  /** 组件的 props，里面带着 `FieldPartStylingProps`。 */
  props: FieldPartStylingProps
  /** `useAttrs()` 的结果。组件要关掉 `inheritAttrs`。 */
  attrs: Record<string, unknown>
  /**
   * 组件自己管、不能让调用者覆盖的属性名，比如 `id`、`aria-labelledby`。
   * `class` 和 `style` 始终不会进主语义控件，不用列。
   */
  reservedAttrs?: Iterable<string>
}

export interface FieldPartStyling {
  /** 有没有外壳。InputGroup 里、横向标签的 FormLayout 里没有。 */
  hasFieldBox: ComputedRef<boolean>
  /** 传给 `<Field class>`。没有外壳时为空。 */
  containerClass: ComputedRef<HTMLAttributes['class']>
  /** 传给 `<Field style>`。没有外壳时为空。 */
  containerStyle: ComputedRef<StyleValue | undefined>
  /** 落到本体的 class：根上直接写的 `class` 加 `controlClass`，两者都生效。 */
  controlClass: () => HTMLAttributes['class']
  /** 落到本体的行内样式：根上直接写的 `style` 加 `controlStyle`，两者都生效。 */
  controlStyle: () => StyleValue
  /**
   * 要落到主语义控件（原生 input、触发按钮等）上的透传属性，
   * 也就是 `id`、`data-*`、`aria-*`、事件监听这些。
   * `attrs` 不是响应式的，所以这是函数，要在渲染时调用。
   */
  forwardedAttrs: () => Record<string, unknown>
}

const CONTAINER_WITHOUT_FIELD_MESSAGE
  = '`containerClass`/`containerStyle` have no effect here because no Field box renders '
    + '(inside InputGroup or a `horizontal-labels` FormLayout). Inside InputGroup, style the InputGroup.'

/** Vue 会把带 boolean 的联合类型属性的缺省值转成 `false`，所以 `false` 也算没传。 */
function isSet(value: unknown): boolean {
  return value != null && value !== false && value !== ''
}

/**
 * 把带 Field 的输入组件收到的样式和透传属性分到各自的部件上：
 * 外壳、本体、主语义控件。各组件不用再各写一遍拆分逻辑。
 *
 * @example
 * ```ts
 * const parts = useFieldPartStyling({ component: 'TextInput', props, attrs: useAttrs(), reservedAttrs: ['id', 'value'] })
 * // <Field :class="parts.containerClass.value" :style="parts.containerStyle.value">
 * // <div class="box" :class="parts.controlClass()" :style="parts.controlStyle()">
 * // <input v-bind="parts.forwardedAttrs()">
 * ```
 */
export function useFieldPartStyling(options: UseFieldPartStylingOptions): FieldPartStyling {
  const { component, props, attrs } = options
  const reserved = new Set<string>(['class', 'style', ...(options.reservedAttrs ?? [])])
  const inputGroup = inject(INPUT_GROUP_KEY, null)
  const formLayout = useFormLayout()
  const hasFieldBox = computed(() => inputGroup == null && formLayout.value?.direction !== 'horizontal-labels')

  useDevWarning(
    component,
    CONTAINER_WITHOUT_FIELD_MESSAGE,
    () => !hasFieldBox.value && (isSet(props.containerClass) || isSet(props.containerStyle)),
  )

  return {
    hasFieldBox,
    containerClass: computed(() => hasFieldBox.value ? props.containerClass : undefined),
    containerStyle: computed(() => hasFieldBox.value ? props.containerStyle : undefined),
    controlClass: () => [attrs.class as HTMLAttributes['class'], props.controlClass],
    controlStyle: () => [attrs.style as StyleValue, props.controlStyle],
    forwardedAttrs: () => Object.fromEntries(Object.entries(attrs).filter(([key]) => !reserved.has(key))),
  }
}
