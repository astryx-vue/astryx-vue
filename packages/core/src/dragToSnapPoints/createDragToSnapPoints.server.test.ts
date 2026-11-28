// @vitest-environment node
/**
 * @file createDragToSnapPoints.server.test.ts
 * @input createDragToSnapPoints.ts, useDragToSnapPoints.ts, createPanGesture.ts
 *   and usePanGesture.ts with no DOM
 * @output Importing the snap-point drag, the pan, or their composables does no
 *   DOM work, and the composables run with no element, so all are safe on the
 *   server
 * @position Testing; the server side of the public drag factories
 */

import { describe, expect, it } from 'vitest'
import { effectScope } from 'vue'

describe('the drag factories on the server', () => {
  it('the factories import with no window or document', async () => {
    expect(typeof document).toBe('undefined')
    expect(Object.keys(await import('../composables/createDragToSnapPoints')).sort()).toEqual([
      'createDragToSnapPoints',
    ])
    expect(Object.keys(await import('../composables/createPanGesture')).sort()).toEqual(['createPanGesture'])
  })

  it('the composables import and run with no element', async () => {
    const { useDragToSnapPoints } = await import('../composables/useDragToSnapPoints')
    const { usePanGesture } = await import('../composables/usePanGesture')
    const scope = effectScope()
    scope.run(() => {
      const { settleTo } = useDragToSnapPoints(null, {
        axis: 'y',
        snapPoints: [0, 240],
        onSettle: () => {},
      })
      expect(() => settleTo(1)).not.toThrow()
      usePanGesture(null, { axis: 'x', onPan: () => {} })
    })
    scope.stop()
  })
})
