/**
 * @file swipeHost.ts
 * @input 运行时什么都不读
 * @output 横滑操作的公开类型（SwipeAction、ItemSwipeActionVariant、ItemSwipeBehavior、
 *   CreateSwipeOptions、不透明的 Swipe），行和 Swipe 值之间的约定（SwipeHost、SwipeEntry、
 *   SwipeRowFacts），以及 makeSwipe、swipeHostOf、swipeWithItemKey
 * @position 行在运行时唯一读的横滑模块：没有手势、动画和渲染代码。createSwipe.ts 造值，
 *   Item 用 swipeHostOf 读出声明的操作，ListItem 用 swipeWithItemKey 给它配上行的 key。
 */

import type { Component } from 'vue'

/** 操作长什么样：普通、想要的那个、危险的那个。是动词的分量，不是状态。 */
export type ItemSwipeActionVariant = 'neutral' | 'accent' | 'destructive'

/**
 * `reveal`：快速松手顺着动的方向走，慢松手过半个面板就停开；停开时每个操作都是真按钮。
 * 一甩永远不触发操作；拖得够远越过确认点，行跑到前面、最外侧操作盖满面板，松手就触发它，
 * 往回拖则作罢。一侧有两个及以上操作时，只有从已停开的行开始的拖动才会触发。
 * `commit`：越过确认点松手，行滑出并触发这一侧唯一的操作；什么都不会停开，面板只是展示。
 * 一侧有两个及以上操作时 `commit` 一个都不触发。
 */
export type ItemSwipeBehavior = 'reveal' | 'commit'

/**
 * 一个动词。行把它画成按 `variant` 着色的一块，图标在标签上面。
 * 所有字段在手势开始前就已知，所以定义可以放在模块顶层。
 */
export interface SwipeAction<Id extends string = string> {
  /**
   * 操作的名字。`onActivate` 会收到它，行也按操作的 id 区分面板：
   * 换成 id 相同的新值，停开的行保持停开；id 变了，行合上。
   */
  id: Id
  /** 动词的名字，也是行停开时按钮的无障碍名称。写动词达成的状态（「已读」），手势本身已经表达了动作。 */
  label: string
  /** 画在标签上面。 */
  icon?: Component
  /**
   * 点停开的操作、全滑到底、或 `commit` 松手时触发。行滑出时（全滑、commit、带 `hasRemoval`
   * 的操作被点），等行的内容离开原来的盒子才触发；没有 `hasRemoval` 的操作被点时立即触发。
   * 收到操作的 `id` 和行的 `itemKey`（`ListItem` 的，普通 `Item` 上是 `undefined`），
   * 所以一个处理函数就能服务所有行。可以返回 Promise，行不等它。
   */
  onActivate: (event: { id: Id, itemKey: string | number | undefined }) => void
  isDisabled?: boolean
  /** @default 'accent' */
  variant?: ItemSwipeActionVariant
  /**
   * 操作触发后行停在滑出的位置，不弹回。只表示这一点：不代表调用方会删掉这一行，
   * 和 `swipeBehavior`、`variant` 互不相关。
   * @default false
   */
  hasRemoval?: boolean
}

/**
 * 每一侧横滑露出的动词（越靠后越靠外），以及两侧共用的收场方式。
 * `leading` 由往行内末尾的拖动露出，`trailing` 由往行内开头的拖动露出。
 */
export interface CreateSwipeOptions<Id extends string = string> {
  /** 往行内末尾拖（从左到右的文字里是向右）露出；越靠后越靠外。 */
  leading?: ReadonlyArray<SwipeAction<Id>>
  /** 往行内开头拖（从左到右的文字里是向左）露出；越靠后越靠外。 */
  trailing?: ReadonlyArray<SwipeAction<Id>>
  /**
   * 横滑怎么收场，两侧共用。见 `ItemSwipeBehavior`。
   * @default 'reveal'
   */
  swipeBehavior?: ItemSwipeBehavior
}

/**
 * 配好的横滑操作。只能由 `createSwipe` 造出、只能传给 `swipe`，里面没有可读的内容。
 * 它的类型带着操作的 id。
 */
export interface Swipe<Id extends string = string> {
  /** 永远不存在的品牌字段，只给类型用。 */
  readonly '@astryx-vue/core/swipe/v1'?: never
  /** 操作的 id，只给类型用，永远不存在。 */
  readonly '@astryx-vue/core/swipe/ids'?: Id
}

/**
 * 行实际跑的一个操作：`createSwipe` 造的，或者已弃用的 `swipeActions` 里的一项。
 * 后者的 `id` 可省略、处理函数不收参数；行照样用操作的 `id` 和行的 key 调用它。
 */
export interface SwipeEntry {
  readonly id?: string
  readonly label: string
  readonly icon?: Component
  // 方法写法让参数双变：带具体 id 类型的 SwipeAction 也算 SwipeEntry（行只用操作自己的 id 调用它）。
  // eslint-disable-next-line ts/method-signature-style
  onActivate(event: { id: string, itemKey: string | number | undefined }): unknown
  readonly isDisabled?: boolean
  readonly variant?: ItemSwipeActionVariant
  readonly hasRemoval?: boolean
}

/** 决定横滑能不能用在这一行上的事实，由行交给横滑判断。 */
export interface SwipeRowFacts {
  /** 根元素的 role（如果有）。 */
  readonly role: string | undefined
  readonly isDisabled: boolean
  /** 这一行是里面某个控件的放大点击区。 */
  readonly isDelegate: boolean
}

/** 行读到的 Swipe 值：声明的操作、收场方式、它服务哪些行，以及配上的行 key。 */
export interface SwipeHost {
  readonly leading: ReadonlyArray<SwipeEntry>
  readonly trailing: ReadonlyArray<SwipeEntry>
  readonly behavior: ItemSwipeBehavior
  /** 横滑是否服务有这些事实的行。 */
  readonly serves: (facts: SwipeRowFacts) => boolean
  /** `ListItem` 配上的 `itemKey`，交给每个 `onActivate`。 */
  readonly itemKey?: string | number
}

// 每个 Swipe 值把它的 host 挂在这个键下，不可枚举、不可写。同一个 realm 里每份包副本
// 拿到的都是同一个键；手搓的值没有 host。
const HOST = Symbol.for('@astryx-vue/core/swipe/host')

interface HostedSwipe {
  readonly [HOST]?: SwipeHost
}

/** 为一个 host 造 Swipe 值（createSwipe.ts）。 */
export function makeSwipe<Id extends string = string>(host: SwipeHost): Swipe<Id> {
  return Object.freeze(Object.defineProperty({}, HOST, { value: host })) as Swipe<Id>
}

/** Swipe 值的 host；不是 makeSwipe 造的值返回 null。 */
export function swipeHostOf(swipe: Swipe | null | undefined): SwipeHost | null {
  if (swipe == null || typeof swipe !== 'object')
    return null
  return (swipe as HostedSwipe)[HOST] ?? null
}

/** `ListItem` 交给 `Item` 的 Swipe 值：同样的操作和规则，配上这一行的 key。 */
export function swipeWithItemKey(swipe: Swipe | undefined, itemKey: string | number | undefined): Swipe | undefined {
  const host = swipeHostOf(swipe)
  if (host == null || itemKey == null)
    return swipe
  return makeSwipe({ ...host, itemKey })
}
