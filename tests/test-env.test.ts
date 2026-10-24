import type { ComponentInternalInstance } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LeadingComment from './fixtures/LeadingComment.vue'

/** Vue 的 PatchFlags.DEV_ROOT_FRAGMENT：只有开发版模板编译器会给「注释 + 根元素」打这个标记。 */
const DEV_ROOT_FRAGMENT = 1 << 11

// 测试结果不能随外部 NODE_ENV 变：运行时和模板编译都要固定在开发模式，和 CI（不设 NODE_ENV）一样。
// 原理见 vitest.config.ts 顶部的注释。这里用 NODE_ENV=production 跑也必须全部通过。
describe('测试环境不受外部 NODE_ENV 影响', () => {
  it('运行时是 test 模式', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })

  it('模板用开发版编译器编译：根节点前的注释保留下来，根节点成了 Fragment', () => {
    const wrapper = mount(LeadingComment)
    expect(wrapper.html()).toContain('<!-- 根节点前的注释：开发模式的模板编译器会保留它 -->')
    const subTree = (wrapper.vm.$ as ComponentInternalInstance).subTree
    expect(subTree.patchFlag & DEV_ROOT_FRAGMENT).toBe(DEV_ROOT_FRAGMENT)
    // 根是 Fragment 时，wrapper 自己的 classes()、attributes() 读不到 div 上的东西。
    // 测试要用选择器找到真正的元素再读属性、发事件。
    expect(wrapper.classes()).not.toContain('leading-comment-probe')
    expect(wrapper.get('.leading-comment-probe').text()).toBe('probe')
  })

  it('透传属性仍然落在 div 上', () => {
    const wrapper = mount(LeadingComment, { attrs: { 'data-probe': 'yes' } })
    expect(wrapper.get('.leading-comment-probe').attributes('data-probe')).toBe('yes')
  })
})
