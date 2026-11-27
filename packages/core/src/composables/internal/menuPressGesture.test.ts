import type { MenuPressEvent, MenuPressGesture } from './menuPressGesture.js'
import { describe, expect, it } from 'vitest'
import { IDLE_MENU_PRESS, MENU_PRESS_HANDOFF_PX, MENU_PRESS_SETTLE_MS, menuPressStep } from './menuPressGesture.js'

// 菜单按压状态图，一条转移一个用例。

type Row = 'A' | 'B'

function run(events: MenuPressEvent<Row>[]) {
  let gesture: MenuPressGesture<Row> = IDLE_MENU_PRESS
  const effects = []
  for (const event of events) {
    const step = menuPressStep(gesture, event)
    gesture = step.gesture
    effects.push(step.effect)
  }
  return { gesture, effects, last: effects[effects.length - 1] }
}

function downInMenu(row: Row | null, pointerType: 'mouse' | 'touch' = 'touch') {
  return ({ type: 'down', target: 'menu', pointerType, row, time: 0 }) as const
}
function downOnTrigger(pointerType: 'mouse' | 'touch', time = 0) {
  return ({ type: 'down', target: 'trigger', pointerType, row: null, time }) as const
}
const move = (row: Row | null, isInMenu = true, time = 10) => ({ type: 'move', row, isInMenu, time }) as const
function up(row: Row | null, { isInMenu = row != null, isOnTrigger = false, time = 20 } = {}) {
  return { type: 'up', row, isInMenu, isOnTrigger, time } as const
}

describe('menuPressStep：从菜单里开始', () => {
  it('按下高亮下面那一行；按在分割线上什么都不亮', () => {
    expect(run([downInMenu('A')]).last).toEqual({ type: 'highlight', row: 'A' })
    expect(run([downInMenu(null)]).last).toEqual({ type: 'clear' })
  })

  it('移到别的行高亮跟着走，移到禁用行或标题上清掉，同一行内移动不变', () => {
    expect(run([downInMenu('A'), move('B')]).last).toEqual({ type: 'highlight', row: 'B' })
    expect(run([downInMenu('A'), move(null)]).last).toEqual({ type: 'clear' })
    expect(run([downInMenu('A'), move('A')]).last).toEqual({ type: 'none' })
  })

  it('松开时执行**松开**位置那一行，不是按下那一行', () => {
    const { gesture, last } = run([downInMenu('A'), move('B'), up('B')])
    expect(last).toEqual({ type: 'act', row: 'B' })
    expect(gesture).toEqual(IDLE_MENU_PRESS)
  })

  it('在分割线、标题、禁用行上松开：什么都不执行，菜单留着，补发的 click 要吞', () => {
    expect(run([downInMenu('A'), up(null, { isInMenu: true })]).last).toEqual({ type: 'settle', stray: true, dismiss: false })
  })

  it('鼠标在菜单外松开会关菜单，手指不会', () => {
    expect(run([downInMenu('A', 'mouse'), up(null, { isInMenu: false })]).last).toEqual({ type: 'settle', stray: true, dismiss: true })
    expect(run([downInMenu('A'), up(null, { isInMenu: false })]).last).toEqual({ type: 'settle', stray: true, dismiss: false })
  })

  it('取消（滚动、第二根手指）什么都不执行，后面也没有 click', () => {
    expect(run([downInMenu('A'), { type: 'cancel' }]).last).toEqual({ type: 'settle', stray: false, dismiss: false })
  })

  it('没有手势时的移动和松开都不理', () => {
    expect(run([move('A'), up('A')]).effects).toEqual([{ type: 'none' }, { type: 'none' }])
  })
})

describe('menuPressStep：从触发器开始', () => {
  it('鼠标按下触发器立刻打开', () => {
    const { gesture, last } = run([downOnTrigger('mouse')])
    expect(last).toEqual({ type: 'open' })
    expect(gesture.phase).toBe('open')
  })

  it('手指按下触发器先什么都不做；长按前抬起是轻点，click 照常放行', () => {
    expect(run([downOnTrigger('touch')]).gesture.phase).toBe('triggerPress')
    expect(run([downOnTrigger('touch'), up(null, { isOnTrigger: true })]).last).toEqual({ type: 'settle', stray: false, dismiss: false })
  })

  it('手指按满延时菜单打开；延时内取消就结束', () => {
    expect(run([downOnTrigger('touch'), { type: 'opened', time: 500 }]).gesture.phase).toBe('open')
    expect(run([downOnTrigger('touch'), { type: 'cancel' }]).gesture).toEqual(IDLE_MENU_PRESS)
  })

  it('指针移进菜单开始跟踪；停在菜单外不变', () => {
    expect(run([downOnTrigger('mouse'), move('A')]).gesture).toMatchObject({ phase: 'tracking', origin: 'trigger', row: 'A' })
    expect(run([downOnTrigger('mouse'), move(null, false)]).last).toEqual({ type: 'none' })
  })

  it('没进过菜单、按得又短：什么都不执行，菜单留着，触发器的 click 也不能关它', () => {
    const { last } = run([downOnTrigger('mouse', 0), up('A', { time: MENU_PRESS_SETTLE_MS - 1 })])
    expect(last).toEqual({ type: 'settle', stray: true, dismiss: false })
  })

  it('从触发器拖进菜单、在某一行上松开：执行它', () => {
    expect(run([downOnTrigger('mouse'), move('B'), up('B')]).last).toEqual({ type: 'act', row: 'B' })
  })

  it('按满落定时间后，打开那次按压的松开也会执行下面那一行', () => {
    expect(run([downOnTrigger('mouse', 0), up('A', { time: MENU_PRESS_SETTLE_MS })]).last).toEqual({ type: 'act', row: 'A' })
  })

  it('落定之后松回触发器：菜单留着', () => {
    const { last } = run([downOnTrigger('mouse', 0), up(null, { isOnTrigger: true, time: MENU_PRESS_SETTLE_MS })])
    expect(last).toEqual({ type: 'settle', stray: true, dismiss: false })
  })

  it('落定之后在外面松开：鼠标关菜单，手指不关', () => {
    const outside = { isInMenu: false, time: MENU_PRESS_SETTLE_MS + 1 }
    expect(run([downOnTrigger('mouse', 0), up(null, outside)]).last).toEqual({ type: 'settle', stray: true, dismiss: true })
    const finger = run([downOnTrigger('touch', 0), { type: 'opened', time: 0 }, up(null, outside)])
    expect(finger.last).toEqual({ type: 'settle', stray: true, dismiss: false })
  })

  it('打开后取消：结束手势，菜单留着', () => {
    expect(run([downOnTrigger('mouse'), { type: 'cancel' }]).last).toEqual({ type: 'settle', stray: false, dismiss: false })
  })
})

describe('menuPressStep：手指的交接（UIMenu）', () => {
  const opened = { type: 'opened', time: 0 } as const
  const at = (x: number, y: number, row: Row | null = 'A', time = 10) =>
    ({ type: 'move', row, isInMenu: true, time, x, y }) as const
  const liftAt = (x: number, y: number, row: Row | null = 'A', time = 1000) =>
    ({ type: 'up', row, isInMenu: true, isOnTrigger: false, time, x, y }) as const

  it('打开后菜单看到的第一个位置只是起点，走够交接距离才开始挑行', () => {
    const start = run([downOnTrigger('touch'), opened, at(100, 100)])
    expect(start.last).toEqual({ type: 'none' })
    expect(start.gesture.phase).toBe('open')

    const short = run([downOnTrigger('touch'), opened, at(100, 100), at(100 + MENU_PRESS_HANDOFF_PX - 1, 100)])
    expect(short.gesture.phase).toBe('open')

    const passed = run([downOnTrigger('touch'), opened, at(100, 100), at(100 + MENU_PRESS_HANDOFF_PX, 100, 'B')])
    expect(passed.gesture.phase).toBe('tracking')
    expect(passed.last).toEqual({ type: 'highlight', row: 'B' })
  })

  it('交接距离按直线算：斜着各走 7 不够，各走 9 才够', () => {
    expect(run([downOnTrigger('touch'), opened, at(0, 0), at(7, 7)]).gesture.phase).toBe('open')
    expect(run([downOnTrigger('touch'), opened, at(0, 0), at(9, 9)]).gesture.phase).toBe('tracking')
  })

  it('没走够就松开，即使按了很久也什么都不执行，菜单留着，触发器的 click 要吞掉', () => {
    const result = run([downOnTrigger('touch'), opened, at(100, 100), liftAt(100, 102, 'A', MENU_PRESS_SETTLE_MS * 10)])
    expect(result.last).toEqual({ type: 'settle', stray: true, dismiss: false })
  })

  it('走够以后在行上松开就执行那一行', () => {
    const result = run([downOnTrigger('touch'), opened, at(100, 100), at(120, 100, 'B'), liftAt(120, 100, 'B')])
    expect(result.last).toEqual({ type: 'act', row: 'B' })
  })

  it('鼠标和不带位置的事件仍按落定规则', () => {
    expect(run([downOnTrigger('mouse'), move('A')]).gesture.phase).toBe('tracking')
    expect(run([downOnTrigger('touch'), opened, up('A', { time: MENU_PRESS_SETTLE_MS })]).last).toEqual({ type: 'act', row: 'A' })
  })
})
