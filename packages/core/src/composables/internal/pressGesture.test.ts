import type { PressEvent, PressGesture, PressPaint } from './pressGesture.js'
import { describe, expect, it } from 'vitest'
import {
  idlePressGesture,
  PRESS_FADE_MS,
  PRESS_FLASH_MS,
  PRESS_ONSET_MS,
  PRESS_SCROLL_BRAKE_MS,
  PRESS_SLOP_PX,
  pressGestureStep,
} from './pressGesture.js'

// 按压状态机的规则，一条要求一个用例，用例名说的是行为不是实现。

function run(events: PressEvent[]): { paints: PressPaint[], gesture: PressGesture } {
  let gesture = idlePressGesture()
  const paints: PressPaint[] = []
  for (const event of events) {
    const step = pressGestureStep(gesture, event)
    gesture = step.gesture
    paints.push(step.paint)
  }
  return { gesture, paints }
}

const down = (x = 100, y = 100): PressEvent => ({ kind: 'down', x, y })
const move = (x: number, y: number): PressEvent => ({ kind: 'move', x, y })
const up: PressEvent = { kind: 'up' }
const cancel: PressEvent = { kind: 'cancel' }
const onset: PressEvent = { kind: 'onset' }

describe('时钟和系统列表一致', () => {
  it('等 150ms 才认按压，容差 10px，轻点闪 100ms，淡出 200ms，刹车窗口 150ms', () => {
    expect(PRESS_ONSET_MS).toBe(150)
    expect(PRESS_SLOP_PX).toBe(10)
    expect(PRESS_FLASH_MS).toBe(100)
    expect(PRESS_FADE_MS).toBe(200)
    expect(PRESS_SCROLL_BRAKE_MS).toBe(150)
  })
})

describe('按压成立之前什么都不画', () => {
  it('手指落下那一刻不画，只要 onset 计时器', () => {
    const step = pressGestureStep(idlePressGesture(), down())
    expect(step.paint).toBe('none')
    expect(step.timer).toBe('onset')
  })

  it('快速一划什么都不亮：等待期内滚动就接管了', () => {
    expect(run([down(), cancel, onset, up]).paints).toEqual(['none', 'none', 'none', 'none'])
  })
})

describe('按住的按压立刻满强度亮起', () => {
  it('onset 时直接 on，中间没有过渡状态', () => {
    expect(run([down(), onset]).paints).toEqual(['none', 'on'])
  })
})

describe('挪远了就取消，手抖不算', () => {
  it('在容差内移动仍然是按压', () => {
    expect(run([down(), move(105, 104), onset, move(103, 108)]).paints).toEqual(['none', 'none', 'on', 'on'])
  })

  it('超过容差立刻取消，不管亮没亮', () => {
    expect(run([down(), move(100, 100 + PRESS_SLOP_PX + 1)]).gesture.phase).toBe('dead')
    expect(run([down(), onset, move(100, 100 + PRESS_SLOP_PX + 1)]).paints).toEqual(['none', 'on', 'none'])
  })

  it('距离从落点算，不是从上一次移动算', () => {
    const steps = [down(), move(106, 100), move(112, 100)]
    expect(run(steps).gesture.phase).toBe('dead')
  })
})

describe('取消之后这次手势就死了', () => {
  it('取消不带淡出，也不留计时器', () => {
    const step = pressGestureStep(run([down(), onset]).gesture, cancel)
    expect(step.paint).toBe('none')
    expect(step.timer).toBeNull()
  })

  it('手指停下、滑回原处、迟到的 onset、抬手，都不会再亮', () => {
    const { paints } = run([down(), move(100, 130), move(100, 100), onset, up])
    expect(paints).toEqual(['none', 'none', 'none', 'none', 'none'])
  })

  it('抬手后回到 idle，下一次按压照常亮', () => {
    const first = run([down(), cancel, up])
    expect(first.gesture.phase).toBe('idle')
    const second = pressGestureStep(pressGestureStep(first.gesture, down()).gesture, onset)
    expect(second.paint).toBe('on')
  })
})

describe('太快的轻点也有反馈', () => {
  it('抬手时补亮，要 flash 计时器，然后交给同样的淡出', () => {
    const tap = pressGestureStep(pressGestureStep(idlePressGesture(), down()).gesture, up)
    expect(tap.paint).toBe('on')
    expect(tap.timer).toBe('flash')
    const fade = pressGestureStep(tap.gesture, { kind: 'flashEnd' })
    expect(fade.paint).toBe('fading')
    expect(fade.timer).toBe('fade')
  })

  it('iOS 在轻点之后补发的 cancel 不会剪掉这次反馈', () => {
    expect(run([down(), up, cancel]).paints).toEqual(['none', 'on', 'on'])
  })
})

describe('抬手后淡出', () => {
  it('按住后抬手进入 fading，淡出结束回到 idle', () => {
    const { paints, gesture } = run([down(), onset, up, { kind: 'fadeEnd' }])
    expect(paints).toEqual(['none', 'on', 'fading', 'none'])
    expect(gesture.phase).toBe('idle')
  })

  it('淡出要 fade 计时器，状态不会被留下', () => {
    expect(pressGestureStep(run([down(), onset]).gesture, up).timer).toBe('fade')
  })
})
