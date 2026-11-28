import type { Component } from 'vue'
import { ToastViewport } from '@astryx-vue/core'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import DetailPage from './detail-page.vue'
import TableTree from './table-tree.vue'
import WorkItemDetail from './work-item-detail.vue'

const settle = () => new Promise(resolve => setTimeout(resolve, 50))

/** 页面旁边挂一个 Toast 视口，demo 提示才有地方显示。 */
function withToasts(page: Component) {
  return mount(defineComponent({ render: () => [h(page), h(ToastViewport)] }), { attachTo: document.body })
}

function clickButton(label: string): void {
  const matches = [...document.querySelectorAll<HTMLElement>('button')]
    .filter(button => button.getAttribute('aria-label') === label || button.textContent?.trim() === label)
  expect(matches.length, `button "${label}"`).toBeGreaterThan(0)
  matches[0]!.click()
}

describe('page templates: controls that act', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('detail-page confirms a refund before issuing it, and toasts the other actions', async () => {
    const wrapper = withToasts(DetailPage)
    clickButton('Create label')
    await settle()
    expect(document.body.textContent).toContain('Demo: a shipping label would be created for order #1001 here')

    clickButton('Refund')
    await settle()
    expect(document.querySelector('[role="alertdialog"]')?.textContent).toContain('Refund this order?')
    expect(document.body.textContent).not.toContain('Demo: the refund would be issued here')
    wrapper.unmount()
  })

  it('work-item-detail answers its add buttons', async () => {
    const wrapper = withToasts(WorkItemDetail)
    clickButton('Add subtask')
    await settle()
    expect(document.body.textContent).toContain('Demo: a new subtask would be added here')
    clickButton('Add attachment')
    await settle()
    expect(document.body.textContent).toContain('Demo: a file picker would open here')
    wrapper.unmount()
  })

  it('table-tree answers the Code button', async () => {
    const wrapper = withToasts(TableTree)
    clickButton('Code')
    await settle()
    expect(document.body.textContent).toContain('Demo: clone and download options would open here')
    wrapper.unmount()
  })
})
