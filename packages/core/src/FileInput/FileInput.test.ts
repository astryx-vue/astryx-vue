import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
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
    expect(wrapper.get('.astryx-file-input-trigger').attributes('disabled')).toBeDefined()
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
    expect(wrapper.text()).toContain('notes.txt is not an accepted file type')
  })
})
