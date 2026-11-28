<script setup lang="ts" generic="T">
/**
 * 推入/退出式导航：UIKit UINavigationController 的转场、返回按钮和滑动返回，全部跑在合成层上。
 *
 * 路径归应用管（`v-model:path`）。栈渲染根屏幕（`#root`）和每个条目一屏（`#screen`），
 * 最上面的在最后；路径多一个或少一个顶部条目时播转场。
 *
 * 动效是 iOS 26.2 上实测的 UIKit 数值（core 的 motion/uikit/navigation.ts）：推入是临界阻尼弹簧
 * （response 0.3s），起步速度每秒 8.773 个宽度；下面那张卡片以上面卡片 0.3 倍的速度移动，
 * 盖着 10% 的黑色遮暗；每屏的栏跟着自己的屏幕走。滑动返回 1:1 跟手，可以从屏幕前沿开始，
 * 也可以像 iOS 26 一样从内容任意处开始；进度加上 0.35s 的速度越过一半宽度就完成，
 * 完成弹簧（0.3s，ζ 0.85）从手指的速度起步。推入期间退出会从当前位置掉头，手指也能抓住移动中的卡片。
 *
 * 手指下的栏没有背景和细线，和 iOS 26 一样；每屏带一层滚动边缘遮罩，内容在栏下移动 10px 后淡入，
 * 跟着卡片一起推入、退出、滑动返回。被盖住的栏在上面卡片的前沿处切掉。用鼠标时栏保留表面色和细线。
 *
 * 浏览器标签页里屏幕前沿是浏览器自己的滑动返回，所以边缘滑动只在主屏幕网页应用
 * （`navigator.standalone`）里运行，内容滑动也不接从那条边缘带开始的触摸。
 *
 * 「减弱动态效果」交给动效引擎：手指下进来的屏幕在落点淡入，出去的在 200ms 里淡出，
 * 不位移也不遮暗；鼠标下直接切换。手指的滑动返回仍然跟手，松手后的动画在任何指针上都淡变。
 *
 * 无障碍：被盖住的屏幕是 `inert`。推入后焦点到新屏幕的标题，除非焦点已经在那一屏里；
 * 退出后焦点还给发起推入的控件。返回按钮是真正的按钮，名字是它要回到的那一屏。
 */
import type { BackSwipeStack } from './backSwipes'
import type { NavigationRegistry } from './navigationDriver'
import type { ScreenDescriptor } from './NavigationScreen'
import type { NavigationStackApi, NavigationStackProps, NavigationStackSlots } from './types'
import type { ScreenModel } from './useNavigationView'
import { Icon, useCoarsePointer } from '@astryx-vue/core'
import { computed, onBeforeUnmount, onMounted, provide, reactive, shallowRef, watch } from 'vue'
import { useMotionEngine } from '../internal/useMotionEngine'
import { useBackSwipes } from './backSwipes'
import { navigationStackKey } from './context'
import { useNavigationStackMessages } from './messages'
import NavigationBarLayer from './NavigationBarLayer.vue'
import NavigationCard from './NavigationCard.vue'
import { createNavigationDriver } from './navigationDriver'
import { createNavigationFocus } from './navigationFocus'
import { springs } from './navigationMotion'
import { readScreen } from './NavigationScreen'
import { programmaticVelocity, progressFromScreen } from './navigationTransition'
import { useNavigationView } from './useNavigationView'
import '../../styles/navigation-stack.css'

defineOptions({ name: 'AstryxNavigationStack', inheritAttrs: true })

const props = withDefaults(defineProps<NavigationStackProps<T>>(), {
  getKey: undefined,
  isInteractivePopEnabled: true,
  label: undefined,
})
const emit = defineEmits<{ 'update:path': [path: T[]] }>()
const slots = defineSlots<NavigationStackSlots<T>>()

const messages = useNavigationStackMessages()
const container = shallowRef<HTMLElement | null>(null)
const cards = shallowRef<HTMLElement | null>(null)
const registry: NavigationRegistry = new Map()

// 大标题已经滚到栏下面的屏幕。
const collapsedTitles = shallowRef<ReadonlySet<string>>(new Set())
function onLargeTitleCollapse(key: string, isCollapsed: boolean): void {
  const current = collapsedTitles.value
  if (current.has(key) === isCollapsed)
    return
  const next = new Set(current)
  if (isCollapsed)
    next.add(key)
  else
    next.delete(key)
  collapsedTitles.value = next
}

const { view, rendered, topKey, underKey, depth, dropLeaving } = useNavigationView(
  () => props.path,
  () => props.getKey as ((entry: never, index: number) => string | number) | undefined,
)

const backControl = useMotionEngine()
const backChevron = useMotionEngine()
const focus = createNavigationFocus({
  container,
  cards,
  registry,
  isTitleCollapsed: key => collapsedTitles.value.has(key),
})

// 记下推入来自哪个控件。直接挂原生监听：经 Vue 的事件包装会给事件打上时间戳，
// 同一毫秒里挂上的屏幕内容就会把这次点击当成挂载前的旧事件丢掉。
onMounted(() => {
  container.value?.addEventListener('click', focus.rememberActivation, true)
  container.value?.addEventListener('keydown', focus.rememberActivation, true)
})
onBeforeUnmount(() => {
  container.value?.removeEventListener('click', focus.rememberActivation, true)
  container.value?.removeEventListener('keydown', focus.rememberActivation, true)
})

const driver = createNavigationDriver({
  container,
  cards,
  registry,
  backControl: backControl.animator,
  backChevron: backChevron.animator,
  isInputTask: focus.isInputTask,
  rootKey: () => view.value.models[0]?.key,
})

// 正在跑的转场。`done` 后手指能接着抓。
let running: { id: number, done: boolean } | null = null
// 正在松手的交互式退出：它提交的退出从手指的速度接着走，不再起一次程序退出。
let release: { velocity: number } | null = null
// 退出后的焦点归还，等离开的屏幕被拿掉的那次提交（在那之前每一屏都是 inert，拿不到焦点）。
let pendingFocus: { popped: string, revealed: string } | null = null

// 挂上来时就处于被盖住位置的栏停到视差处，和 settle 停放被盖住的屏幕一样；退出露出两层以下的
// 屏幕时会带来一条。已经显示过的栏留在原处，由转场移动它。
let shownBars: ReadonlySet<string> = new Set()
watch([topKey, underKey], ([top, under]) => {
  const before = shownBars
  shownBars = new Set(under == null ? [top] : [top, under])
  if (under != null && !before.has(under))
    driver.parkBar(under)
}, { immediate: true, flush: 'post' })

// 屏幕被盖住期间触屏状态也可能变（平板拔掉鼠标）。栏的背景立刻跟着变，被盖住的栏的裁切也跟着变；
// 正在跑的移动在停下时再读一次。
const isTouch = useCoarsePointer()
watch(isTouch, () => {
  const under = underKey.value
  if (under == null || (running != null && !running.done))
    return
  driver.parkBar(under)
}, { flush: 'post' })

// 跑路径变化要求的转场。只驱动各屏和栏的合成层动效引擎。
watch(() => view.value.transition.id, () => {
  const current = view.value
  const transition = current.transition
  driver.readClearBars()
  if (transition.kind === 'none') {
    current.models.forEach((model, index) => {
      driver.settle(model.key, index === current.models.length - 1 ? 'top' : 'covered')
    })
    backControl.animator.set({ opacity: 1 })
    backChevron.animator.set({ opacity: 1 })
    return
  }
  const { id, top, under } = transition
  if (transition.kind === 'push')
    focus.recordPush(top)
  const wasRunning = running != null && !running.done
  running = { id, done: false }
  const released = release
  release = null
  pendingFocus = null
  let promise: Promise<boolean>
  if (transition.kind === 'push') {
    if (!wasRunning)
      driver.setProgress(1, top, under)
    else
      driver.placeOffscreen(top)
    promise = driver.animateProgress(0, top, under, springs.navigationPush, wasRunning ? undefined : programmaticVelocity('push'), false, 'ride')
    driver.fadeBack('push', under)
  }
  else if (released != null) {
    promise = driver.animateProgress(1, top, under, springs.navigationInteractivePopFinish, released.velocity, true, 'rest', performance.now())
    driver.fadeBack('pop', under, true)
  }
  else {
    if (!wasRunning)
      driver.setProgress(0, top, under, 'ride')
    promise = driver.animateProgress(1, top, under, springs.navigationPop, wasRunning ? undefined : programmaticVelocity('pop'), false, 'ride')
    driver.fadeBack('pop', under)
  }
  void promise.then((finished) => {
    if (running?.id !== id)
      return
    running = { id, done: true }
    if (!finished)
      return
    if (transition.kind === 'pop') {
      if (under != null) {
        driver.settle(under, 'top')
        pendingFocus = { popped: top, revealed: under }
      }
      dropLeaving(id)
    }
    else {
      // 被盖住的屏幕留在最上面那屏下面。
      if (under != null)
        driver.layersOf(under)?.card?.set({ opacity: 1 })
      focus.focusAfter('push', top)
    }
  })
}, { flush: 'post' })

// 退出后的焦点归还，在拿掉离开的屏幕那次提交之后。
watch(() => view.value.leaving, (leaving) => {
  const pending = pendingFocus
  if (leaving == null && pending != null) {
    pendingFocus = null
    focus.focusAfter('pop', pending.popped, pending.revealed)
  }
}, { flush: 'post' })

const api = reactive({
  push: (entry: T, options?: { source?: Element | null }) => {
    focus.notePush(options?.source)
    emit('update:path', [...props.path, entry])
  },
  pop: () => {
    if (props.path.length > 0)
      emit('update:path', props.path.slice(0, -1))
  },
  popToRoot: () => {
    if (props.path.length > 0)
      emit('update:path', [])
  },
  depth: computed(() => depth.value),
}) as NavigationStackApi<T>
provide(navigationStackKey, api as NavigationStackApi)

// 滑动返回读写栈的接口，每帧的值都来自最新的渲染。
const canPop = computed(() => depth.value > 0 && view.value.leaving == null)
const swipeStack: BackSwipeStack = {
  width: driver.width,
  direction: driver.direction,
  screens: () => {
    const top = view.value.models.at(-1)?.key
    const under = view.value.models.at(-2)?.key
    return top == null || under == null ? null : { top, under }
  },
  grab: (top, under) => {
    // 抓住正在动的东西：上面卡片的当前位置就是接着走的进度。手指的移动从这里开始。
    driver.readClearBars()
    const x = driver.layersOf(top)?.card?.get('x') ?? 0
    driver.stop([top, under])
    running = null
    return progressFromScreen(x, driver.width(), driver.direction())
  },
  setProgress: (p, top, under) => driver.setProgress(p, top, under),
  progress: driver.progress,
  release: (top, under, finish, velocity) => {
    const springBack = (v: number): void => {
      const id = (running?.id ?? 0) + 0.5
      running = { id, done: false }
      // 松手时已经拉过起点（橡皮筋那段），用 UIKit 的回位弹簧。
      const spring = driver.progress() < 0 ? springs.navigationInteractivePopReturn : springs.navigationInteractivePopFinish
      void driver.animateProgress(0, top, under, spring, v, true, 'rest', performance.now()).then((finished) => {
        if (running?.id === id)
          running = { id, done: true }
        if (finished) {
          driver.settle(top, 'top')
          driver.settle(under, 'covered')
        }
      })
    }
    if (!finish) {
      springBack(velocity)
      return
    }
    // 提交退出；它触发的转场从这里按手指的速度接着走。
    const pending = { velocity }
    const before = props.path
    release = pending
    emit('update:path', before.slice(0, -1))
    // 应用留着路径不变（比如护着没保存的编辑）就不退出：到下一帧松手还在等，卡片弹回原处。
    container.value?.ownerDocument.defaultView?.requestAnimationFrame(() => {
      if (release === pending && props.path === before) {
        release = null
        springBack(0)
      }
    })
  },
}
useBackSwipes(container, cards, () => swipeStack, {
  isEnabled: () => canPop.value && props.isInteractivePopEnabled,
})

function describe(model: ScreenModel): ScreenDescriptor {
  return readScreen(model.index < 0 ? slots.root?.() : slots.screen?.({ entry: model.entry as T, index: model.index }))
}

/** 第 index 屏的返回按钮名字：前一屏的返回名，否则前一屏的标题，再否则「返回」。 */
function backLabelFor(index: number): string | null {
  if (index <= 0)
    return null
  const previous = describe(rendered.value[index - 1])
  return previous.backTitle || previous.title || messages.value.back
}

function onBack(): void {
  api.pop()
}
</script>

<template>
  <div
    ref="container"
    class="astryx-navigation-stack"
    role="region"
    :aria-label="label"
  >
    <div class="astryx-navigation-stack__bar">
      <div aria-hidden="true" class="astryx-navigation-stack__bar-background" />
      <template v-for="model in rendered" :key="model.key">
        <NavigationBarLayer
          v-if="model.key === topKey || model.key === underKey"
          :screen-key="model.key"
          :screen="describe(model)"
          :registry="registry"
          :is-covered="model.key !== topKey || view.leaving != null"
          :is-large-title-shown="describe(model).titleDisplayMode === 'large' && !collapsedTitles.has(model.key)"
        />
      </template>
      <div
        v-if="backLabelFor(rendered.findIndex(model => model.key === topKey)) != null"
        :ref="backControl.ref"
        class="astryx-navigation-stack__back-control"
        :inert="view.leaving != null || undefined"
      >
        <button
          type="button"
          class="astryx-navigation-stack__back"
          :aria-label="backLabelFor(rendered.findIndex(model => model.key === topKey)) ?? undefined"
          data-navigation-back
          @click="onBack"
        >
          <span :ref="backChevron.ref" class="astryx-navigation-stack__back-icon">
            <Icon icon="chevronLeft" />
          </span>
        </button>
      </div>
    </div>
    <div ref="cards" class="astryx-navigation-stack__cards">
      <NavigationCard
        v-for="model in rendered"
        :key="model.key"
        :screen-key="model.key"
        :screen="describe(model)"
        :registry="registry"
        :is-top="model.key === topKey && view.leaving == null"
        :is-covered="model.key !== topKey || view.leaving != null"
        :is-hidden="model.key !== topKey && model.key !== underKey"
        :on-large-title-collapse="onLargeTitleCollapse"
      />
    </div>
  </div>
</template>
