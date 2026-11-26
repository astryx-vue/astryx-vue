import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import FormLayout from '../FormLayout/FormLayout.vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import FileInput from './FileInput.vue'

function file(name: string, type: string, size = 8): File {
  return new File([new Uint8Array(size)], name, { type })
}

describe('file input', () => {
  it('accepts a matching file and clears it', async () => {
    const wrapper = mount(FileInput, {
      props: {
        'label': 'Resume',
        'accept': '.pdf',
        'modelValue': null,
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value as File | null }),
      },
    })
    const input = wrapper.get('input[type="file"]')
    const transfer = new DataTransfer()
    transfer.items.add(file('resume.pdf', 'application/pdf'))
    Object.defineProperty(input.element, 'files', { value: transfer.files })
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ name: 'resume.pdf' })
    await wrapper.setProps({ modelValue: file('resume.pdf', 'application/pdf') })
    await nextTick()
    expect(wrapper.text()).toContain('resume.pdf')
    await wrapper.get('button[class*="clear"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })

  it('reports a type error and ignores input while disabled', async () => {
    const wrapper = mount(FileInput, {
      props: { label: 'Resume', accept: '.pdf', modelValue: null, isDisabled: true },
    })
    // 禁用的触发按钮不带原生 disabled：留在 Tab 顺序里，读屏念出「不可用」。
    expect(wrapper.get('.astryx-file-input-trigger').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('.astryx-file-input-trigger').attributes('aria-disabled')).toBe('true')
    const input = wrapper.get('input[type="file"]')
    const transfer = new DataTransfer()
    transfer.items.add(file('notes.txt', 'text/plain'))
    Object.defineProperty(input.element, 'files', { value: transfer.files })
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('shows the validation message for a rejected file', async () => {
    const wrapper = mount(FileInput, {
      props: {
        'label': 'Resume',
        'accept': '.pdf',
        'modelValue': null,
        'onUpdate:modelValue': () => {},
      },
    })
    const input = wrapper.get('input[type="file"]')
    const transfer = new DataTransfer()
    transfer.items.add(file('notes.txt', 'text/plain'))
    Object.defineProperty(input.element, 'files', { value: transfer.files })
    await input.trigger('change')
    expect(wrapper.text()).toContain('"notes.txt" is not an accepted file type')
  })

  it('shows the labelTooltip from the field label', () => {
    const wrapper = mount(FileInput, {
      attachTo: document.body,
      props: { label: 'Resume', modelValue: null, labelTooltip: 'PDF under 2 MB' },
    })
    // 气泡挂在 body 上，不在字段里面。
    expect(document.body.innerHTML).toContain('PDF under 2 MB')
    wrapper.unmount()
  })

  it('keeps the trigger focusable while a disabledMessage explains why', async () => {
    const wrapper = mount(FileInput, {
      props: {
        label: 'Resume',
        modelValue: null,
        isDisabled: true,
        disabledMessage: 'Uploads are locked until your profile is verified',
      },
      attachTo: document.body,
    })
    const trigger = wrapper.get<HTMLButtonElement>('.astryx-file-input-trigger')
    expect(trigger.attributes('disabled')).toBeUndefined()
    expect(trigger.attributes('aria-disabled')).toBe('true')
    expect(trigger.attributes('aria-describedby')?.split(' ')).toContain(`${trigger.attributes('id')}-disabled`)
    trigger.element.focus()
    await nextTick()
    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')
    expect(tooltip?.textContent).toBe('Uploads are locked until your profile is verified')
    expect(tooltip?.style.display).not.toBe('none')
    wrapper.unmount()
  })

  it('runs changeAction on selection and clear, and emits actionError when it fails', async () => {
    const order: string[] = []
    const changeAction = vi.fn(async (value: File | File[] | null) => {
      order.push(value == null ? 'clear' : 'select')
    })
    const wrapper = mount(FileInput, {
      props: {
        'label': 'Resume',
        'modelValue': null,
        changeAction,
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value as File | null }),
      },
    })
    const input = wrapper.get('input[type="file"]')
    const transfer = new DataTransfer()
    transfer.items.add(file('resume.pdf', 'application/pdf'))
    Object.defineProperty(input.element, 'files', { value: transfer.files })
    await input.trigger('change')
    await nextTick()
    expect(changeAction).toHaveBeenCalledWith(expect.objectContaining({ name: 'resume.pdf' }))
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(order).toEqual(['select'])

    await wrapper.setProps({ modelValue: file('resume.pdf', 'application/pdf') })
    await wrapper.get('button[class*="clear"]').trigger('click')
    await nextTick()
    expect(changeAction).toHaveBeenLastCalledWith(null)
    expect(order).toEqual(['select', 'clear'])

    const failing = vi.fn(async () => {
      throw new Error('upload failed')
    })
    const broken = mount(FileInput, {
      props: { label: 'Resume', modelValue: null, changeAction: failing },
    })
    const brokenInput = broken.get('input[type="file"]')
    const again = new DataTransfer()
    again.items.add(file('other.pdf', 'application/pdf'))
    Object.defineProperty(brokenInput.element, 'files', { value: again.files })
    await brokenInput.trigger('change')
    await nextTick()
    await Promise.resolve()
    expect(broken.emitted('actionError')?.[0]?.[0]).toMatchObject({ message: 'upload failed' })
  })

  it('names every rejected file and why in one status message, in the active locale', async () => {
    const pick = async (wrapper: ReturnType<typeof mount>, files: File[]) => {
      const input = wrapper.get('input[type="file"]')
      const transfer = new DataTransfer()
      for (const item of files)
        transfer.items.add(item)
      Object.defineProperty(input.element, 'files', { value: transfer.files, configurable: true })
      await input.trigger('change')
    }
    const english = mount(FileInput, {
      props: { 'label': 'Reports', 'modelValue': [], 'isMultiple': true, 'accept': '.pdf', 'maxSize': 1024, 'onUpdate:modelValue': () => {} },
    })
    await pick(english, [file('large.pdf', 'application/pdf', 4096), file('photo.png', 'image/png', 100), file('small.pdf', 'application/pdf', 100)])
    expect(english.get('.astryx-field-status').text())
      .toContain('"photo.png" is not an accepted file type, "large.pdf" exceeds 1.0 KB limit')
    expect(english.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([expect.objectContaining({ name: 'small.pdf' })])

    const chinese = mount(InternationalizationProvider, {
      props: { locale: 'zh-CN' },
      slots: { default: () => h(FileInput, { 'label': '报告', 'modelValue': [], 'isMultiple': true, 'accept': '.pdf', 'maxSize': 1024, 'onUpdate:modelValue': () => {} }) },
    })
    await pick(chinese, [file('photo.png', 'image/png', 100), file('large.pdf', 'application/pdf', 4096)])
    expect(chinese.get('.astryx-field-status').text()).toMatch(/“photo\.png”的文件类型、“large\.pdf”超过了/)
  })
})

function setFiles(wrapper: ReturnType<typeof mount>, ...files: File[]): Promise<void> {
  const input = wrapper.get('input[type="file"]')
  const transfer = new DataTransfer()
  for (const item of files)
    transfer.items.add(item)
  Object.defineProperty(input.element, 'files', { value: transfer.files, configurable: true })
  return input.trigger('change')
}

describe('file input disabled and busy', () => {
  it('keeps a disabled trigger in the tab order and detaches the hidden input from forms', async () => {
    const wrapper = mount(FileInput, { props: { label: 'Resume', modelValue: null, isDisabled: true }, attachTo: document.body })
    const trigger = wrapper.get<HTMLButtonElement>('.astryx-file-input-trigger')
    trigger.element.focus()
    expect(document.activeElement).toBe(trigger.element)
    const native = wrapper.get<HTMLInputElement>('input[type="file"]')
    expect(native.attributes('disabled')).toBeUndefined()
    expect(native.attributes('form')).toBe('')
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    native.element.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    trigger.element.dispatchEvent(enter)
    expect(enter.defaultPrevented).toBe(true)
    wrapper.unmount()
  })

  it('accepts no new selection while busy, and keeps focus on the trigger', async () => {
    const wrapper = mount(FileInput, { props: { label: 'Resume', modelValue: null, isLoading: true }, attachTo: document.body })
    const trigger = wrapper.get('.astryx-file-input-trigger')
    expect(trigger.attributes('aria-busy')).toBe('true')
    expect(trigger.attributes('aria-disabled')).toBe('true')
    expect(trigger.attributes('disabled')).toBeUndefined()
    await setFiles(wrapper, file('a.pdf', 'application/pdf'))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.setProps({ isLoading: false })
    expect(trigger.attributes('aria-disabled')).toBeUndefined()
    await setFiles(wrapper, file('a.pdf', 'application/pdf'))
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })

  it('refuses a drag with the no-drop effect while disabled or busy', async () => {
    const wrapper = mount(FileInput, { props: { label: 'Resume', modelValue: null, mode: 'dropzone', isLoading: true } })
    const over = new Event('dragover', { bubbles: true, cancelable: true }) as DragEvent
    Object.defineProperty(over, 'dataTransfer', { value: { dropEffect: 'copy' } })
    wrapper.get('.astryx-file-input').element.dispatchEvent(over)
    expect(over.defaultPrevented).toBe(true)
    expect(over.dataTransfer?.dropEffect).toBe('none')
    expect(wrapper.get('.astryx-file-input').attributes('data-drag')).toBeUndefined()
  })

  it('highlights a drag over an idle dropzone', async () => {
    const wrapper = mount(FileInput, { props: { label: 'Resume', modelValue: null, mode: 'dropzone' } })
    wrapper.get('.astryx-file-input').element.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(wrapper.get('.astryx-file-input').attributes('data-drag')).toBe('true')
  })
})

describe('file input busy announcement', () => {
  it('hides the spinner from assistive technology', () => {
    const wrapper = mount(FileInput, { props: { label: 'Resume', modelValue: null, isLoading: true } })
    expect(wrapper.get('.astryx-spinner').attributes('aria-hidden')).toBe('true')
  })

  it('announces Loading once when busy starts', async () => {
    const wrapper = mount(FileInput, { props: { label: 'Resume', modelValue: null }, attachTo: document.body })
    await wrapper.setProps({ isLoading: true })
    await new Promise(resolve => requestAnimationFrame(resolve))
    await new Promise(resolve => requestAnimationFrame(resolve))
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('Loading')
    wrapper.unmount()
  })

  it('adds no Loading after a pick, which already announced the file', async () => {
    const wrapper = mount(FileInput, {
      props: { label: 'Resume', modelValue: null, changeAction: () => new Promise<void>(() => {}) },
      attachTo: document.body,
    })
    await setFiles(wrapper, file('a.pdf', 'application/pdf'))
    await new Promise(resolve => requestAnimationFrame(resolve))
    await new Promise(resolve => requestAnimationFrame(resolve))
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('1 file selected: a.pdf')
    wrapper.unmount()
  })
})

describe('file input focus, aria and status', () => {
  it('returns focus to the trigger after a clear', async () => {
    const wrapper = mount(FileInput, { props: { label: 'Resume', modelValue: file('a.pdf', 'application/pdf') }, attachTo: document.body })
    await wrapper.get('button[class*="clear"]').trigger('click')
    expect(document.activeElement).toBe(wrapper.get('.astryx-file-input-trigger').element)
    wrapper.unmount()
  })

  it('joins a caller aria-describedby to the trigger description, caller first', () => {
    const wrapper = mount(FileInput, {
      props: { label: 'Resume', modelValue: null, description: 'PDF only' },
      attrs: { 'aria-describedby': 'caller-help', 'aria-details': 'extra' },
      attachTo: document.body,
    })
    const trigger = wrapper.get('.astryx-file-input-trigger')
    expect(trigger.attributes('aria-describedby')?.split(' ')[0]).toBe('caller-help')
    expect(trigger.attributes('aria-details')).toBe('extra')
    wrapper.unmount()
  })

  it('conveys required under a FormLayout required default', () => {
    const wrapper = mount({ components: { FormLayout, FileInput }, template: '<FormLayout default-optionality="required"><FileInput label="Resume" :model-value="null" /></FormLayout>' }, { attachTo: document.body })
    expect(wrapper.text()).toContain('Required')
    wrapper.unmount()
  })

  it('shows a dropzone status below the drop area by default, an input status attached', () => {
    const status = { type: 'error' as const, message: 'Too big' }
    const dropzone = mount(FileInput, { props: { label: 'Resume', modelValue: null, mode: 'dropzone', status } })
    expect(dropzone.get('.astryx-field').attributes('data-status-variant')).toBe('detached')
    const input = mount(FileInput, { props: { label: 'Resume', modelValue: null, status } })
    expect(input.get('.astryx-field').attributes('data-status-variant')).toBe('attached')
    const explicit = mount(FileInput, { props: { label: 'Resume', modelValue: null, mode: 'dropzone', status, statusVariant: 'attached' } })
    expect(explicit.get('.astryx-field').attributes('data-status-variant')).toBe('attached')
  })

  it.each(['input', 'dropzone'] as const)('keeps the tooltip status button in %s mode, selected and busy', async (mode) => {
    const status = { type: 'error' as const, message: 'Too big' }
    const wrapper = mount(FileInput, { props: { label: 'Resume', modelValue: null, mode, status, statusVariant: 'tooltip' } })
    expect(wrapper.find('.astryx-field-info-tip').exists()).toBe(true)
    await wrapper.setProps({ modelValue: file('a.pdf', 'application/pdf') })
    expect(wrapper.find('.astryx-field-info-tip').exists()).toBe(true)
    await wrapper.setProps({ isLoading: true })
    expect(wrapper.find('.astryx-field-info-tip').exists()).toBe(true)
  })
})
