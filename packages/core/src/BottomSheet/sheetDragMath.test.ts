/**
 * @file sheetDragMath.test.ts
 * @input A sheet body with a nested dialog and a control that pans on its own
 * @output Holds isInsideNestedLayer to which drags the sheet leaves alone: a
 *   nested layer's, and a control's that owns its vertical pan (a picker wheel)
 * @position Unit tests of sheetDragMath.ts
 */

import { describe, expect, it } from 'vitest'
import { isInsideNestedLayer } from './sheetDragMath'

function sheetBody(): HTMLElement {
  const body = document.createElement('div')
  body.innerHTML = `
    <p class="text">Text</p>
    <dialog><span class="in-dialog">Inside</span></dialog>
    <div data-astryx-owns-pan><div class="row">05</div></div>
  `
  return body
}

describe('isInsideNestedLayer', () => {
  it('leaves a picker wheel\'s pan to the wheel, as it leaves a nested dialog\'s', () => {
    const body = sheetBody()
    expect(isInsideNestedLayer(body.querySelector('.text'), body)).toBe(false)
    expect(isInsideNestedLayer(body.querySelector('.in-dialog'), body)).toBe(true)
    expect(isInsideNestedLayer(body.querySelector('.row'), body)).toBe(true)
  })

  it('stops at the sheet body: a mark above it does not count', () => {
    const outer = document.createElement('div')
    outer.setAttribute('data-astryx-owns-pan', '')
    const body = sheetBody()
    outer.append(body)
    expect(isInsideNestedLayer(body.querySelector('.text'), body)).toBe(false)
  })
})
