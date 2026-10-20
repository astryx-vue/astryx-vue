/**
 * 交互契约的已知失败名单：组件现在做不到、留给后面组件节点去追平的条目。
 *
 * 规则（照上游 AST-021 FR8–FR10）：
 * - 一条记录钉死一个期望、一个组件、一个状态、一个环境和一字不差的失败信息；
 *   换一句话、换一个状态、多出一个失败，都还是失败。
 * - 组件修好后这条会变成 unexpected-pass，测试失败，提醒把它删掉。名单只会越来越短。
 * - 新增或放宽记录要有理由，不是随手改测试。
 *
 * 只记 happy-dom 能看到的层（DOM 和推算出的角色、名称、描述、状态）。
 * 真实浏览器层（焦点、按键、指针）现在不跑，那一层的差距等浏览器通道接上后再记。
 */
import type { KnownFailure } from './check'

const SWITCH_STATUS_REASON = 'Switch 收下了 status 却不渲染 FieldStatus，也不把错误信息挂到 aria-describedby；上游 Switch 会挂。由 C2 补上。'
const LIST_ITEM_DESCRIPTION_REASON = 'CheckboxListItem 在自己的 setup 里调 useItemDescriptionId()，但提供这个 id 的是它的子组件 Item，inject 只能拿到祖先提供的值，所以永远是 null，说明文字从没挂到复选框上。上游会挂。由 C2 修。'

export const A11Y_KNOWN_FAILURES: readonly KnownFailure[] = [
  {
    expectation: 'switch.description.resolvable',
    binding: 'Switch',
    state: 'invalid',
    harness: 'happy-dom',
    failureEquals: '这个状态渲染了说明文字，但开关没有 aria-describedby，说明没有挂到控件上',
    userImpact: '开关报错时，读屏用户只听到「无效」，听不到错误原因；看得见的用户也看不到错误文字。',
    reason: SWITCH_STATUS_REASON,
  },
  {
    expectation: 'switch.description.exposed',
    binding: 'Switch',
    state: 'invalid',
    harness: 'happy-dom',
    failureEquals: '这个状态渲染了说明文字，但算不出可访问描述，读屏软件不会把说明和控件一起念',
    userImpact: '同上：错误原因不会和开关一起被念出来。',
    reason: SWITCH_STATUS_REASON,
  },
  {
    expectation: 'checkbox.description.resolvable',
    binding: 'CheckboxListItem',
    state: 'list-item-described',
    harness: 'happy-dom',
    failureEquals: '这个状态渲染了说明文字，但复选框没有 aria-describedby，说明没有挂到控件上',
    userImpact: '列表项下面那行说明只有看得见的人能读到，读屏用户聚焦到复选框时听不到。',
    reason: LIST_ITEM_DESCRIPTION_REASON,
  },
  {
    expectation: 'checkbox.description.exposed',
    binding: 'CheckboxListItem',
    state: 'list-item-described',
    harness: 'happy-dom',
    failureEquals: '期望的描述是「Receive notifications by email」，但算不出可访问描述',
    userImpact: '同上：说明不会作为复选框的描述被念出来。',
    reason: LIST_ITEM_DESCRIPTION_REASON,
  },
]
