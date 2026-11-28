import type { InjectionKey, Ref } from 'vue'
import type { BottomSheetPanelMotion } from './panelState.js'
import type { BottomSheetStackView } from './stack/stackState.js'
import type { BottomSheetPurpose } from './types.js'

/**
 * 切换器里一步的样子：
 * - `entering`：刚成为当前那步，正从下面升上来；
 * - `active`：当前那步，可以操作；
 * - `covered`：上一步，交接期间原地留着、不能操作；
 * - `aligning`：上一步比新的一步高，正往下移到两者顶边对齐；
 * - `fading`：上一步在淡出；
 * - `exiting`：整段流程关掉时最后那步在滑出；
 * - `hidden`：不在屏幕上，对话框关着。
 */
export type BottomSheetSwitcherPhase = 'entering' | 'active' | 'covered' | 'aligning' | 'fading' | 'exiting' | 'hidden'

/** 一步向切换器登记的东西。 */
export interface BottomSheetSwitcherStep {
  getDialog: () => HTMLDialogElement | null
  getPanel: () => HTMLElement | null
  purpose: () => BottomSheetPurpose
}

export interface BottomSheetSwitcherContext {
  /** 当前那步；外面的宿主关着时读成 `null`。 */
  activeId: Readonly<Ref<string | null>>
  hasScrim: () => boolean
  /** 整段流程正在关（最后那步在滑出）。 */
  isFlowClosing: Readonly<Ref<boolean>>
  /** 整段流程在叠放里的位置；整段流程算一层。 */
  stackView: Readonly<Ref<BottomSheetStackView>>
  /** 服务端渲染时就开着的那步，水合后直接静止呈现。 */
  settledId: Readonly<Ref<string | null>>
  phaseOf: (id: string) => BottomSheetSwitcherPhase
  alignmentOffsetOf: (id: string) => number
  /** 这一步的对话框是不是整段流程的宿主（带 `id` 和 `data-testid` 的那个）。 */
  isHost: (id: string) => boolean
  /** 这一步的对话框是不是画着整段流程那层遮罩的。 */
  isScrimOwner: (id: string) => boolean
  /** 切换器自己的 attrs 里落到每一步对话框上的部分，和只落到宿主上的部分。 */
  stepAttrs: () => Record<string, unknown>
  hostAttrs: () => Record<string, unknown>
  register: (id: string, step: BottomSheetSwitcherStep) => void
  unregister: (id: string) => void
  /** 一步要以模态呈现之前调用：记下流程的打开者和呈现顺序。 */
  beforePresent: (id: string) => void
  /** 一步的对话框呈现或关闭之后调用。 */
  afterStepSync: (id: string) => void
  /** 这一步的对话框之后又有别的步骤以模态呈现过、而且还开着：它在顶层里被压在下面。 */
  isCoveredInTopLayer: (id: string) => boolean
  onMotionStart: (id: string, motion: BottomSheetPanelMotion) => void
  onMotionComplete: (id: string, motion: BottomSheetPanelMotion) => void
  onScrimOpacity: (id: string, opacity: number) => void
  /** 当前那步要求关掉（向下轻扫）。 */
  requestClose: (id: string) => void
  onCancel: (event: Event) => void
  onClick: (event: MouseEvent) => void
  onKeydown: (event: KeyboardEvent) => void
}

export const bottomSheetSwitcherKey: InjectionKey<BottomSheetSwitcherContext | null> = Symbol('astryx-bottom-sheet-switcher')
