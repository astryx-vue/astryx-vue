// @vitest-environment node
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h, ref } from 'vue'
import Tour from './Tour.vue'
import TourStep from './TourStep.vue'

describe('tour SSR', () => {
  it('renders the page targets without touching browser-only overlay APIs', async () => {
    const app = createSSRApp({
      setup() {
        const target = ref<HTMLElement | null>(null)
        return () => h('div', [
          h('button', { ref: target, type: 'button' }, 'Target'),
          h(Tour, { isActive: true, onDismiss: () => {} }, {
            default: () => h(TourStep, { targetRef: target, heading: 'First step' }, { default: () => 'Body' }),
          }),
        ])
      },
    })
    const html = await renderToString(app)
    expect(html).toContain('Target')
    expect(html).not.toContain('First step')
  })
})
