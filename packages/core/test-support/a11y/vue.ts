/**
 * 把 Vue 组件绑定到模式契约的公共写法。
 *
 * 每个绑定测试文件只需要列出「状态清单」：每个状态叫什么、声明自己应该是什么样（facts）、怎么渲染。
 * `describeBinding` 负责挂载、按角色找主角、数动作次数、套契约、对照已知失败名单，并检查：
 * - 每个状态的必选期望都通过（或者是名单里一字不差的已知失败）；
 * - 名单里属于这个组件的记录，每条都恰好对上一次实际结果；
 * - 至少有一条期望真的跑了，跑不到的层如实列出来。
 */
import type { Component, VNode } from 'vue'
import type { BindingResult, KnownFailure } from './check'
import type { PatternContract } from './contract'
import { flushPromises, mount } from '@vue/test-utils'
import { getRole, isInaccessible } from 'dom-accessibility-api'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, onMounted, ref } from 'vue'
import { unmatchedKnownFailures } from './check'
import { checkComponentState, expectAccessibilitySpec } from './expect'
import { summarize } from './report'

export interface BindingState<Facts> {
  /** 稳定的状态 id，已知失败名单按它记录。 */
  readonly id: string
  readonly summary: string
  /** 这个状态应该是什么样。和上游绑定声明的一致；组件做不到的部分记进已知失败，而不是改声明。 */
  readonly facts: Facts
  /** 渲染这个状态。`activate` 交给按钮类组件的点击处理，用来数动作执行了几次。 */
  readonly render: (activate: () => void) => VNode
}

export interface BindingOptions<Facts> {
  readonly spec: PatternContract<Facts>
  /** 组件名，例如 `Switch`。 */
  readonly binding: string
  /** 主角元素的角色；按角色在文档里找第一个，包括被藏起来的。 */
  readonly role: string | ((facts: Facts) => string)
  readonly states: readonly BindingState<Facts>[]
  /** 全部已知失败。只取属于这个组件的那部分。 */
  readonly knownFailures: readonly KnownFailure[]
  /** 契约要数动作次数时打开（button 模式）。 */
  readonly countsActivations?: boolean
}

/** 按 W3C 规则算角色，找到第一个匹配的元素。和 Testing Library 的 getByRole({ hidden: true }) 一个意思。 */
export function findByRole(role: string, root: ParentNode = document.body): Element {
  const found = [...root.querySelectorAll('*')].find(element => getRole(element) === role)
  if (found == null)
    throw new Error(`文档里找不到角色为 ${role} 的元素`)
  return found
}

/** 找到第一个读屏软件看得见、角色匹配的元素。 */
export function findAccessibleByRole(role: string, root: ParentNode = document.body): Element | undefined {
  return [...root.querySelectorAll('*')].find(element => getRole(element) === role && !isInaccessible(element))
}

/** 挂载一段渲染，找到第一个读屏软件看得见、角色匹配的元素交给 `read`，读完就卸载。 */
export async function mountAndFind<T>(render: () => VNode, role: string, read: (element: Element | undefined) => T): Promise<T> {
  const wrapper = mount(defineComponent({ setup: () => render }), { attachTo: document.body })
  try {
    await flushPromises()
    return read(findAccessibleByRole(role))
  }
  finally {
    wrapper.unmount()
    document.body.replaceChildren()
  }
}

export interface ControlledOptions {
  /** 组件报告新值的事件，默认是 `update:<model>`。 */
  readonly event?: string
  readonly slots?: Record<string, () => unknown>
}

/**
 * 受控组件的包装：像使用者那样用 v-model 接上，组件自己发出的更新会写回去。
 * `model` 是 v-model 的 prop 名，例如 `modelValue`、`isSelected`。
 */
export function controlled(component: Component, model: string, initial: unknown, props: Record<string, unknown> = {}, options: ControlledOptions = {}): VNode {
  const event = options.event ?? `update:${model}`
  const listener = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`
  const Host = defineComponent({
    setup() {
      const value = ref(initial)
      const update = (next: unknown): void => {
        value.value = next
      }
      return () => h(component, { ...props, [model]: value.value, [listener]: update }, options.slots)
    },
  })
  return h(Host)
}

/**
 * 受控组件先用 `initial` 渲染，挂载后使用者把值改成 `next`，没有人碰过这个控件。
 * 用来确认「外部改值」之后暴露的状态也跟着变。
 */
export function updatedAfterMount(component: Component, model: string, initial: unknown, next: unknown, props: Record<string, unknown> = {}): VNode {
  const Host = defineComponent({
    setup() {
      const value = ref(initial)
      onMounted(() => {
        value.value = next
      })
      const update = (changed: unknown): void => {
        value.value = changed
      }
      return () => h(component, { ...props, [model]: value.value, [`onUpdate:${model}`]: update })
    },
  })
  return h(Host)
}

function bindingFailures(knownFailures: readonly KnownFailure[], binding: string): readonly KnownFailure[] {
  return knownFailures.filter(record => record.binding === binding)
}

export function describeBinding<Facts>(options: BindingOptions<Facts>): void {
  const { spec, binding, states } = options
  const knownFailures = bindingFailures(options.knownFailures, binding)

  function run(state: BindingState<Facts>, check: typeof checkComponentState): Promise<BindingResult> {
    let activations = 0
    let unmount: (() => void) | undefined
    const role = typeof options.role === 'function' ? options.role(state.facts) : options.role
    return check({
      spec,
      binding,
      state: state.id,
      facts: state.facts,
      knownFailures,
      activations: options.countsActivations ? () => activations : undefined,
      render: async () => {
        activations = 0
        const activate = (): void => {
          activations += 1
        }
        const Root = defineComponent({ setup: () => () => state.render(activate) })
        const wrapper = mount(Root, { attachTo: document.body })
        unmount = () => wrapper.unmount()
        await flushPromises()
      },
      subject: () => {
        const found = [...document.body.querySelectorAll('*')].find(element => getRole(element) === role)
        if (found == null)
          throw new Error(`${binding} [${state.id}] 渲染后找不到角色为 ${role} 的元素：组件没有把自己报成 ${role}，${spec.pattern}.role.exposed 不成立`)
        return found
      },
      cleanup: () => {
        unmount?.()
        document.body.replaceChildren()
      },
    })
  }

  describe(`${binding}：${spec.pattern} 契约（happy-dom）`, () => {
    it.each(states.map(state => [state.id, state.summary, state] as const))('%s（%s）', async (_id, _summary, state) => {
      await run(state, expectAccessibilitySpec)
    })

    it('名单里属于这个组件的已知失败都对得上，跑不到的层如实列出', async () => {
      const results: BindingResult[] = []
      for (const state of states)
        results.push(await run(state, checkComponentState))
      expect(unmatchedKnownFailures(knownFailures, results)).toEqual([])
      const report = summarize(spec.pattern, results)
      expect(report.counts.pass).toBeGreaterThan(0)
      expect(report.counts.unexpectedPass).toBe(0)
      expect(report.unrunLayers).toEqual(['real-browser'])
      expect(report.approximatedLayers).toEqual(['accessibility-tree'])
    })
  })
}
