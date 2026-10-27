/**
 * 契约自测用的手写 HTML 夹具。
 *
 * 夹具证明的是「契约」本身：结果在场时期望通过，结果被拿掉时期望失败。所以夹具是纯 HTML，
 * 不依赖任何 astryx-vue 组件；证明「组件做到了」是绑定测试的事。
 *
 * 每个夹具用 `data-a11y-subject` 标出主角元素。主角由夹具指定、不按角色去找，
 * 这样拿掉 role 只会让 role 那条期望失败，而不是让所有期望一起找不到元素。
 */

export const SUBJECT_ATTRIBUTE = 'data-a11y-subject'
export const SUBJECT_SELECTOR = `[${SUBJECT_ATTRIBUTE}]`

export interface Fixture<Facts> {
  /** `conforming-` 开头的应该通过所有期望；`violating-` 开头的专门拿掉某个结果。 */
  readonly id: string
  readonly summary: string
  readonly facts: Facts
  readonly html: string
}

/**
 * 一个模式的全部夹具，加上「每条期望必须在哪些夹具上失败」的对照表。
 * 每条期望至少要有一个让它失败的夹具：没人见过它失败的期望只是一句声明，不是检查。
 */
export interface FixtureSet<Facts> {
  readonly fixtures: readonly Fixture<Facts>[]
  readonly mutations: Readonly<Record<string, readonly string[]>>
}

export function findFixture<Facts>(set: FixtureSet<Facts>, id: string): Fixture<Facts> {
  const found = set.fixtures.find(candidate => candidate.id === id)
  if (found == null)
    throw new Error(`找不到夹具 "${id}"`)
  return found
}

export function conformingIds<Facts>(set: FixtureSet<Facts>): readonly string[] {
  return set.fixtures.filter(candidate => candidate.id.startsWith('conforming-')).map(candidate => candidate.id)
}

/** 夹具记录一次动作执行的写法；按钮模式靠它数 activations。 */
export const COUNT_ACTIVATION = 'window.__activations = (window.__activations || 0) + 1'
