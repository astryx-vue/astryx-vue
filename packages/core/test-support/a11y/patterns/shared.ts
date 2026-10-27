/**
 * button、checkbox、switch 三个模式共用的期望实现。
 *
 * 每个函数都带一个 `noun`（例如「开关」），让失败信息说清楚是哪种控件出了问题。
 */
import type { Applicability, ExpectationContext } from '../contract'
import type { Harness, Subject, TriState } from '../harness'
import { sameWords, saysInOrder, spokenWords } from '../spoken'

/** 所有状态都适用的条件。 */
export const ALWAYS: Applicability<unknown> = { condition: '绑定渲染了这个模式', test: () => true }

/** 交互期望的主张属于真实浏览器，但结果要从可访问性树里读。 */
export const READS_THE_TREE = ['accessibility-tree'] as const

/** 「Tab 能到达」最多按几次 Tab。对单控件的测试页足够宽松，又能让到不了的情况很快失败。 */
export const TAB_BUDGET = 10

export async function assertRole(subject: Subject, expected: string, noun: string): Promise<void> {
  const { role } = await subject.computed()
  if (role === expected)
    return
  if (role == null)
    throw new Error(`这个${noun}没有角色：它不在可访问性树里，读屏软件读不到它`)
  if (role === 'link' && expected === 'button')
    throw new Error('这个控件被报成链接，听起来像是要跳转，实际却执行了动作')
  throw new Error(`期望角色是 ${expected}，实际是 ${role}`)
}

export async function assertNamed(subject: Subject, noun: string): Promise<void> {
  const { name } = await subject.computed()
  if (name.trim() === '')
    throw new Error(`这个${noun}算不出可访问名称，读屏软件只会念「未标记的${noun}」`)
}

/** WCAG 2.5.3：可访问名称里要按顺序包含看得见的标签文字。没有可见标签时不适用。 */
export async function assertNameMatchesVisibleLabel({ subject, notApplicable }: ExpectationContext<unknown>): Promise<void> {
  const visible = await subject.visibleLabelText()
  if (visible == null)
    return notApplicable('这个状态没有画出可读的标签，说话输入的用户没有可念的词')
  const { name } = await subject.computed()
  if (!saysInOrder(spokenWords(name), spokenWords(visible)))
    throw new Error(`看得见的标签是「${visible}」，可访问名称却是「${name}」，念出看到的字找不到这个控件`)
}

/**
 * aria-describedby 指向的每个 id 都要存在。给了 `expected` 时，指向的文字还要正好是这句话。
 */
export async function assertDescriptionResolvable(subject: Subject, noun: string, expected?: string): Promise<void> {
  const ids = ((await subject.attribute('aria-describedby')) ?? '').split(/\s+/).filter(Boolean)
  if (ids.length === 0)
    throw new Error(`这个状态渲染了说明文字，但${noun}没有 aria-describedby，说明没有挂到控件上`)
  const targets = await subject.idReferences('aria-describedby')
  const dangling = ids.filter((_, index) => targets[index] == null)
  if (dangling.length > 0)
    throw new Error(`aria-describedby 指向的 ${dangling.map(id => `"${id}"`).join('、')} 不存在，这段说明谁也收不到`)
  if (expected == null)
    return
  const attached = targets.filter((text): text is string => text != null).join(' ')
  if (!sameWords(attached, expected))
    throw new Error(`期望的说明是「${expected}」，aria-describedby 指向的文字却是「${attached}」`)
}

/** 浏览器算出的描述非空；给了 `expected` 时还要正好是这句话。 */
export async function assertDescriptionExposed(subject: Subject, expected?: string): Promise<void> {
  const { description } = await subject.computed()
  if (expected == null) {
    if (description.trim() === '')
      throw new Error('这个状态渲染了说明文字，但算不出可访问描述，读屏软件不会把说明和控件一起念')
    return
  }
  if (!sameWords(description, expected)) {
    throw new Error(description.trim() === ''
      ? `期望的描述是「${expected}」，但算不出可访问描述`
      : `期望的描述是「${expected}」，算出来的却是「${description}」`)
  }
}

export async function assertRequiredDeclared(subject: Subject, noun: string): Promise<void> {
  const native = await subject.attribute('required')
  const aria = await subject.attribute('aria-required')
  if (native == null && aria !== 'true')
    throw new Error(`这个状态是必填的，但${noun}既没有原生 required，也没有 aria-required="true"`)
}

/** 从文档开头按 Tab 能到达控件，再按一次 Tab 能离开。 */
export async function assertReachableAndEscapable(harness: Harness, subject: Subject, noun: string): Promise<void> {
  await harness.resetFocus()
  let reached = false
  for (let step = 0; step < TAB_BUDGET && !reached; step += 1) {
    await harness.press('Tab')
    reached = await subject.isFocused()
  }
  if (!reached)
    throw new Error(`从文档开头按 ${TAB_BUDGET} 次 Tab 都到不了这个${noun}，键盘用户够不着它`)
  await harness.press('Tab')
  if (await subject.isFocused())
    throw new Error(`按 Tab 焦点离不开这个${noun}，键盘用户被困住了`)
}

export async function focusOrFail(subject: Subject, message: string): Promise<void> {
  await subject.focus()
  if (!(await subject.isFocused()))
    throw new Error(message)
}

/**
 * 操作一次、再操作一次，每次都检查暴露出来的状态。只走半程不算数：能打开却关不上的控件，
 * 对用户来说和打不开一样糟。部分勾选（mixed）的起点允许落到 true 或 false，但两次的结果要不同。
 */
export async function roundTrip(
  start: boolean | 'mixed',
  activate: () => Promise<void>,
  read: () => Promise<TriState | null>,
  how: string,
  word: (state: TriState | null) => string,
): Promise<void> {
  const from: TriState = start === 'mixed' ? 'mixed' : start ? 'true' : 'false'
  const initial = await read()
  if (initial !== from)
    throw new Error(`绑定声明的起始状态是${word(from)}，实际一开始是${word(initial)}`)
  await activate()
  const after = await read()
  if (start === 'mixed') {
    if (after !== 'true' && after !== 'false')
      throw new Error(`${how}之后仍然是${word(after)}，部分勾选没有被解决`)
    await activate()
    const back = await read()
    if ((back !== 'true' && back !== 'false') || back === after)
      throw new Error(`${how}变成了${word(after)}，再来一次却是${word(back)}：只能单向改变`)
    return
  }
  const to: TriState = start ? 'false' : 'true'
  if (after !== to)
    throw new Error(`${how}之后是${word(after)}，没能变成${word(to)}`)
  await activate()
  const back = await read()
  if (back !== from)
    throw new Error(`${how}变成了${word(after)}，再来一次却是${word(back)}，没有回到${word(from)}：只能单向改变`)
}

/** 按下又滑开松手后，状态不该变化。 */
export async function assertSurvivesAbortedPress(harness: Harness, subject: Subject, noun: string, word: (state: TriState | null) => string): Promise<void> {
  const before = (await subject.computed()).checked
  await harness.abortedPress(subject)
  const after = (await subject.computed()).checked
  if (after !== before)
    throw new Error(`在${noun}上按下、滑开再松手，它还是变成了${word(after)}：按下那一刻就改了，没法反悔`)
}

/** 用 Space 改变状态后，焦点还留在控件上。 */
export async function assertKeepsFocusOnChange(harness: Harness, subject: Subject, noun: string, word: (state: TriState | null) => string): Promise<void> {
  await focusOrFail(subject, `这个${noun}拿不到焦点，键盘根本改不了它`)
  const before = (await subject.computed()).checked
  await harness.press('Space')
  const after = (await subject.computed()).checked
  if (after === before)
    throw new Error(`按 Space 后${noun}仍然是${word(after)}，没有变化可供判断`)
  if (!(await subject.isFocused()))
    throw new Error(`把${noun}改成${word(after)}后焦点跑掉了，用户没要求却被带到了别处`)
}

/**
 * 用户不该能改的控件：点击不变；声明可聚焦时，按 Space 也不变。
 * `focus` 为 `required` 时声明可聚焦却拿不到焦点算失败；为 `optional` 时只检查能到达的输入方式，
 * 可聚焦性由别的期望负责。
 */
export async function assertInoperable(harness: Harness, subject: Subject, noun: string, focus: 'none' | 'optional' | 'required', word: (state: TriState | null) => string): Promise<void> {
  const before = (await subject.computed()).checked
  await harness.click(subject, { ignoreAvailability: true })
  const afterClick = (await subject.computed()).checked
  if (afterClick !== before)
    throw new Error(`这个状态不该被改动，点击${noun}却让它变成了${word(afterClick)}`)
  if (focus === 'none')
    return
  await subject.focus()
  if (!(await subject.isFocused())) {
    if (focus === 'required')
      throw new Error(`这个状态声明了不能改但仍可聚焦（好让原因能被读到），可${noun}拿不到焦点`)
    return
  }
  await harness.press('Space')
  const afterSpace = (await subject.computed()).checked
  if (afterSpace !== before)
    throw new Error(`这个状态不该被改动，在${noun}上按 Space 却让它变成了${word(afterSpace)}`)
}
