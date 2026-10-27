/**
 * 证据层和运行环境（harness）的接口。契约里的每条期望都只依赖这里的类型。
 *
 * 一份契约可以跑在不同的环境里。每个环境声明自己「看得见」哪些证据层，
 * 看不见的层，期望就报 `unrun`，绝不拿低一层的东西冒充。
 *
 * 和上游 `internal/a11y-spec/src/harness.ts` 的区别：多了 `computed-dom` 这一层和
 * `Harness.approximates`。上游的 jsdom 环境把可访问性树整层报成 unrun，我们的快速通道
 * 用 dom-accessibility-api（Testing Library 的 getByRole 用的就是它）按 W3C 规则从 DOM
 * 推算角色、名称、描述和状态，这样 role 被改坏这类问题在 vitest 里就能抓到。
 * 推算不等于浏览器真的算出来的结果，所以结果上会标明「近似」，等浏览器通道接上后再用
 * 真实的可访问性树复核。
 */

export const EVIDENCE_LAYERS = [
  'unit',
  'dom',
  'computed-dom',
  'accessibility-tree',
  'axe',
  'real-browser',
  'visual',
  'lint',
  'manual',
  'real-at',
] as const

export type EvidenceLayer = (typeof EVIDENCE_LAYERS)[number]

export type TriState = 'true' | 'false' | 'mixed'

/** 一个节点在可访问性树里的样子。拿不到的属性给 null，不拿 DOM 猜测去填。 */
export interface ComputedNode {
  /** 角色，例如 `switch`。节点不在可访问性树里时是 null。 */
  readonly role: string | null
  readonly name: string
  readonly description: string
  /** 切换按钮的按下状态。 */
  readonly pressed: TriState | null
  /** 勾选状态。 */
  readonly checked: TriState | null
  readonly disabled: boolean
  readonly invalid: boolean
  readonly required: boolean | null
  readonly readOnly: boolean | null
}

/** 绑定指定的「主角」元素，也就是模式描述的那个控件。 */
export interface Subject {
  /** dom 层：属性的原始写法。 */
  attribute: (name: string) => Promise<string | null>
  /** dom 层：把 id 列表属性（aria-describedby 等）解析成每个目标的文字；找不到的 id 给 null。 */
  idReferences: (attribute: string) => Promise<readonly (string | null)[]>
  /** dom 层：去掉多余空白后的文字内容。 */
  textContent: () => Promise<string>
  /** accessibility-tree 层：引擎为这个节点算出来的结果。 */
  computed: () => Promise<ComputedNode>
  /** real-browser 层：和控件关联、且真的画在屏幕上的标签文字；没有就是 null。 */
  visibleLabelText: () => Promise<string | null>
  /** real-browser 层：焦点是否在这个节点上。 */
  isFocused: () => Promise<boolean>
  /** real-browser 层：像用户按 Tab 那样把焦点移到这里。 */
  focus: () => Promise<void>
}

/** 期望能发送的按键，按意图命名。 */
export type Key = 'Space' | 'Enter' | 'Tab' | 'Escape' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End'

/** 一个已经挂载好的绑定状态，以及这个环境能诚实观察到的一切。 */
export interface Harness {
  /** 环境名，例如 `happy-dom`、`chromium`。会出现在每一行报告里。 */
  readonly name: string
  /** 这个环境能直接观察的层。 */
  readonly observes: readonly EvidenceLayer[]
  /**
   * 这个环境只能近似观察的层：键是期望要读的层，值是实际用来近似它的层。
   * 例如 happy-dom 用 `computed-dom` 近似 `accessibility-tree`。
   * 用近似跑出来的结果会带上 `approximated`，报告里单独列出。
   */
  readonly approximates?: Readonly<Partial<Record<EvidenceLayer, EvidenceLayer>>>
  subject: () => Promise<Subject>
  /** real-browser 层：像指针用户那样点击。`ignoreAvailability` 跳过浏览器的「能不能点」判断，用来证明不可用的控件点了也没反应。 */
  click: (subject: Subject, options?: { ignoreAvailability?: boolean }) => Promise<void>
  /** real-browser 层：在控件上按下，滑出去再松开。 */
  abortedPress: (subject: Subject) => Promise<void>
  /** real-browser 层：向当前焦点发送一个按键。 */
  press: (key: Key) => Promise<void>
  /** real-browser 层：把焦点放回文档开头。 */
  resetFocus: () => Promise<void>
}

/**
 * 有人向环境要了一个它看不见的观察结果。运行器会先查 `observes`，正常情况下走不到这里；
 * 这个错误保证环境不会悄悄用低一层的东西顶替。
 */
export class UnobservableError extends Error {
  constructor(harness: string, layer: EvidenceLayer, what: string) {
    super(`${harness} 环境观察不到 ${layer} 层，没法给出${what}。`)
    this.name = 'UnobservableError'
  }
}
