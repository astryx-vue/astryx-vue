/**
 * 单个控件类模式（button、checkbox、switch）共用的清单豁免。
 *
 * 这些维度对单个控件来说都由别人负责：页面、主题、像素层的检查或调用方。
 * 每个模式把这份共用豁免展开，再补上自己特有的那几条。
 */
import type { ChecklistDimensionId, ChecklistExemption } from '../checklist'

type Exemptions = Partial<Record<ChecklistDimensionId, ChecklistExemption>>

const AXE = '页面扫描 `pnpm a11y`（axe，浅色和深色各一遍）'
const VISUAL = '视觉对照 `pnpm visual`'

/** `noun` 是控件的中文叫法，例如「开关」。 */
export function controlExemptions(noun: string): Exemptions {
  return {
    '1.1.1-non-text-content': {
      owner: '绑定的组件',
      verifiedBy: `组件自己的测试（装饰图形加 aria-hidden）和${AXE}`,
      reason: `契约只看${noun}这一个节点。组件在它周围画了哪些装饰图形、有没有藏起来，是各组件自己的组合细节。`,
    },
    '1.3.2-meaningful-sequence': {
      owner: '组合它的页面',
      verifiedBy: '组件的 DOM 顺序测试和页面评审',
      reason: `${noun}是单个控件，它和别的内容谁先谁后由组合它的地方决定。`,
    },
    '1.3.5-identify-input-purpose': {
      owner: '组合它的表单和调用方',
      verifiedBy: '表单集成评审',
      reason: `${noun}不收集需要 autocomplete 用途标记的用户信息。`,
    },
    '1.4.1-use-of-color': {
      owner: '绑定的组件和主题',
      verifiedBy: `${VISUAL}和强制配色检查`,
      reason: '这条只关心看得见的颜色差别，暴露给读屏软件的信息帮不上忙，属于像素层。',
    },
    '1.4.3-contrast-minimum': {
      owner: '绑定的组件和主题',
      verifiedBy: `${AXE}的 color-contrast 规则`,
      reason: '对比度要在真实背景上算渲染后的颜色，属于 axe 和视觉层。',
    },
    '1.4.11-non-text-contrast': {
      owner: '绑定的组件和主题',
      verifiedBy: `${VISUAL}`,
      reason: '边框、轨道、勾选标记、焦点环都是画出来的，对比度只能从像素量。',
    },
    '2.4.2-page-titled': {
      owner: '页面',
      verifiedBy: '页面评审',
      reason: '单独渲染的组件没有文档标题。',
    },
    '2.4.3-focus-order': {
      owner: '组合它的页面',
      verifiedBy: `页面评审；契约只证明${noun}是一个能进能出的焦点停靠点`,
      reason: '顺序是页面排出来的，不是单个停靠点的属性。',
    },
    '2.4.7-focus-visible': {
      owner: '绑定的组件和主题',
      verifiedBy: `${VISUAL}和组件的焦点环样式`,
      reason: '焦点指示是画出来的结果，要比像素。',
    },
    '2.4.11-focus-not-obscured': {
      owner: '组合它的页面',
      verifiedBy: '页面和浮层评审',
      reason: '焦点有没有被挡住，取决于页面上还盖了什么。',
    },
    '2.5.8-target-size': {
      owner: '绑定的组件和组合它的页面',
      verifiedBy: `${AXE}的 target-size 规则`,
      reason: '多数控件靠和邻居的间距满足例外，单独渲染时看不到邻居。',
    },
    '3.1.1-language-of-page': {
      owner: '页面',
      verifiedBy: '页面评审',
      reason: '单独渲染的组件没有文档语言。',
    },
    '3.2.4-consistent-identification': {
      owner: '设计系统',
      verifiedBy: `这份共用契约本身：所有采用该模式的组件都绑定同一组期望`,
      reason: '一致性是全体采用者的属性，一个绑定证明不了。',
    },
    '4.1.3-status-messages': {
      owner: '绑定的组件',
      verifiedBy: '组件自己的 live region 测试，播报内容另做真机读屏验证',
      reason: `状态消息是组合在${noun}旁边的，播不播报属于真机读屏层。`,
    },
    'forced-colors': {
      owner: '绑定的组件和主题',
      verifiedBy: '编译后 CSS 的强制配色检查，加 Windows 高对比度人工检查',
      reason: '强制配色的效果是绘制结果，契约只看语义和行为。',
    },
    'reduced-motion': {
      owner: '绑定的组件和主题',
      verifiedBy: `组件的 prefers-reduced-motion 样式和${VISUAL}`,
      reason: '动效是随时间变化的渲染结果。',
    },
    'at-facing-strings': {
      owner: '绑定的组件',
      verifiedBy: '多语言文案检查和组件评审',
      reason: '翻译是源码层的事：不管是哪种语言，渲染出来的结构都一样。',
    },
  }
}
