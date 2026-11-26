<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { AppShellEmits, AppShellProps, AppShellSlots } from './types.js'
import { computed, getCurrentInstance, inject, onMounted, provide, reactive, ref, useAttrs, useId, useSlots, useTemplateRef, watch } from 'vue'
import { observeMainOverflow } from '../composables/internal/mainOverflow.js'
import { attachScrollKeyboardDelegation } from '../composables/internal/scrollKeyboardDelegation.js'
import { appShellMobileKey } from '../composables/useAppShellMobile.js'
import { emptyLayoutSlots, layoutAreaKey, layoutContainerKey, layoutDividerKey, layoutSlotsKey } from '../Layout/context.js'
import Layout from '../Layout/Layout.vue'
import LayoutContent from '../Layout/LayoutContent.vue'
import LayoutHeader from '../Layout/LayoutHeader.vue'
import LayoutPanel from '../Layout/LayoutPanel.vue'
import { useComponentMessages } from '../locale/context.js'
import { layoutMessages } from '../locale/messages/layout.js'
import { navMessages } from '../locale/messages/nav.js'
import MobileNav from '../MobileNav/MobileNav.vue'
import MobileNavToggle from '../MobileNav/MobileNavToggle.vue'
import { sideNavShellKey } from '../SideNav/context.js'
import SideNavRenderMode from '../SideNav/SideNavRenderMode.vue'
import { DEFAULT_WIDTH_BREAKPOINTS } from '../Theme/adaptationTypes.js'
import { themeContextKey } from '../Theme/context.js'
import { provideAppShellNesting, useAppShellMainId } from './useAppShellMainId.js'
import { useAppShellRail } from './useAppShellRail.js'
import '../../styles/app-shell.css'

defineOptions({
  name: 'AstryxAppShell',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AppShellProps>(), {
  variant: 'elevated',
  height: 'fill',
  mobileNav: undefined,
})

const emit = defineEmits<AppShellEmits>()
defineSlots<AppShellSlots>()

const attrs = useAttrs()
const slots = useSlots()
const messages = useComponentMessages({ layout: layoutMessages, nav: navMessages })
const root = useTemplateRef<HTMLDivElement>('root')
const { mainId } = useAppShellMainId()
provideAppShellNesting()
// AppShell 是布局的根：外层 Layout 传下来的区域、槽位和分隔线默认值到此为止。
provide(layoutAreaKey, computed(() => null))
provide(layoutSlotsKey, emptyLayoutSlots)
provide(layoutDividerKey, computed(() => undefined))
provide(layoutContainerKey, null)
const mobileNavId = `astryx-app-shell-${useId()}`
const uncontrolledOpen = defineModel<boolean>('mobileNavOpen', { default: false })

defineExpose({ element: root })

const theme = inject(themeContextKey, null)

const breakpoint = computed(() => (typeof props.mobileNav === 'object' ? props.mobileNav.breakpoint : undefined) ?? 'md')
/** 断点的像素宽度：主题改过宽度点就跟主题走，否则用标准值。`none` 没有断点。 */
const breakpointWidth = computed(() => {
  if (breakpoint.value === 'none')
    return null
  return theme?.value.theme.adaptations?.widthBreakpoints[breakpoint.value] ?? DEFAULT_WIDTH_BREAKPOINTS[breakpoint.value]
})
const query = computed(() => `(width < ${breakpointWidth.value ?? 0}px)`)

/** 正在接管服务端 HTML 时，先按服务端给的提示渲染，挂载后再换成读到的窗口宽度，不让内容重新渲染。 */
const isHydrating = getCurrentInstance()?.vnode.el != null
const serverIsMobile = computed(() => breakpointWidth.value != null && typeof props.mobileNav === 'object' && props.mobileNav.defaultIsMobile === true)
const measuredBelow = ref(false)
const hasReadWindow = ref(!isHydrating && typeof window !== 'undefined')
/** 脚本读到窗口之前为 false：服务端渲染出来的整条顶栏和侧栏可能正显示在手机上。 */
const windowRead = ref(false)
const isBelow = computed(() => hasReadWindow.value ? measuredBelow.value : serverIsMobile.value)
onMounted(() => {
  windowRead.value = true
  hasReadWindow.value = true
})

const open = computed({
  get: () => typeof props.mobileNav === 'object' && props.mobileNav.isOpen != null ? props.mobileNav.isOpen : uncontrolledOpen.value,
  set: (next: boolean) => {
    uncontrolledOpen.value = next
    emit('mobileNavOpenChange', next)
  },
})

const hasTopNav = computed(() => slots.topNav != null)
const hasSideNav = computed(() => slots.sideNav != null)
const hasCustomDrawer = computed(() => slots.mobileNav != null)
const mobileEnabled = computed(() => props.mobileNav !== false && (hasTopNav.value || hasSideNav.value) && !hasCustomDrawer.value)
/** 读到窗口之前，标准断点下的顶栏用 CSS 先把起始和中间内容在手机上藏起来，和读完窗口后的手机条一致。 */
const unreadBreakpoint = computed(() => {
  if (windowRead.value || !mobileEnabled.value || breakpoint.value === 'none' || breakpointWidth.value !== DEFAULT_WIDTH_BREAKPOINTS[breakpoint.value])
    return undefined
  return breakpoint.value
})
const hasAutoToggle = computed(() => (typeof props.mobileNav !== 'object' || props.mobileNav.hasToggle !== false) && !hasCustomDrawer.value)
const showSideInline = computed(() => hasSideNav.value && !(isBelow.value && mobileEnabled.value))
const elevate = computed(() => props.variant === 'elevated' && hasTopNav.value && showSideInline.value)
const showMobileBar = computed(() => isBelow.value && mobileEnabled.value && hasAutoToggle.value && hasSideNav.value && !hasTopNav.value)

watch(query, (value, _previous, onCleanup) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return
  const media = window.matchMedia(value)
  const update = () => {
    measuredBelow.value = media.matches
  }
  update()
  media.addEventListener('change', update)
  onCleanup(() => media.removeEventListener('change', update))
}, { immediate: true })

const mobileState = reactive({
  get isMobile() {
    return isBelow.value
  },
  get isMobileNavOpen() {
    return open.value
  },
  mobileNavId,
  get isMobileNavEnabled() {
    return mobileEnabled.value
  },
  get hasAutoToggle() {
    return hasAutoToggle.value
  },
  get hasSideNav() {
    return hasSideNav.value
  },
  toggleMobileNav: () => {
    if (mobileEnabled.value)
      open.value = !open.value
  },
  openMobileNav: () => {
    if (mobileEnabled.value)
      open.value = true
  },
  closeMobileNav: () => {
    open.value = false
  },
})

provide(appShellMobileKey, mobileState)

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))
const rootClass = computed(() => ['astryx-app-shell', attrs.class])
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue)

/**
 * `height="fill"` 时主区域自己是页面的滚动容器。内容溢出期间，键盘必须够得到它，
 * 哪怕里面没有可聚焦的东西：它进入 Tab 顺序，Tab 进来时如果里面有链接或按钮就直接交给第一个。
 * 内容放得下、或者 `height="auto"` 时它仍是 `tabindex="-1"`，只给跳转链接用。
 */
const content = useTemplateRef<{ element: HTMLElement | null }>('content')
const isMainOverflowing = ref(false)
const isMainScrollRegion = computed(() => props.height === 'fill' && isMainOverflowing.value)
/** 跳转链接或脚本把焦点放上来时不画焦点环；只有 Tab 到主区域才画。 */
const isMainProgrammaticFocus = ref(false)

watch(
  [() => content.value?.element ?? null, () => props.height === 'fill'],
  ([main, isFill], _previous, onCleanup) => {
    isMainOverflowing.value = false
    if (main == null || !isFill)
      return
    onCleanup(observeMainOverflow(main, (overflows) => {
      isMainOverflowing.value = overflows
    }))
  },
  { flush: 'post', immediate: true },
)

watch(
  [() => content.value?.element ?? null, isMainScrollRegion],
  ([main, isRegion], _previous, onCleanup) => {
    if (main == null || !isRegion)
      return
    onCleanup(attachScrollKeyboardDelegation(main, main))
  },
  { flush: 'post', immediate: true },
)

// 内联侧栏收起、展开时，内容区跟着侧栏一起动（见 useAppShellRail）。
const rail = useTemplateRef<{ element: HTMLElement | null }>('rail')
const backdrop = useTemplateRef<HTMLElement>('backdrop')
provide(sideNavShellKey, useAppShellRail({
  root: computed(() => root.value),
  rail: computed(() => rail.value?.element ?? null),
  main: computed(() => content.value?.element ?? null),
  backdrop: computed(() => backdrop.value),
}))

function focusMain() {
  const main = root.value?.ownerDocument.getElementById(mainId.value)
  if (main == null)
    return
  isMainProgrammaticFocus.value = true
  main.focus()
}

function onMainFocusOut(event: FocusEvent) {
  if (event.target === event.currentTarget)
    isMainProgrammaticFocus.value = false
}
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :style="rootStyle"
    :data-variant="variant"
    :data-height="height"
    :data-mobile-unread="unreadBreakpoint"
  >
    <a class="astryx-app-shell__skip" :href="`#${mainId}`" @click="focusMain">
      {{ messages.layout.skipToContent }}
    </a>
    <Layout :height="height" :padding="0">
      <template v-if="hasTopNav || slots.banner || showMobileBar" #header>
        <div v-if="hasTopNav || slots.banner" class="astryx-app-shell__header" role="banner" :data-variant="variant">
          <LayoutHeader :padding="0" :has-divider="variant === 'section' && hasTopNav">
            <div v-if="slots.banner" class="astryx-app-shell__banner">
              <slot name="banner" />
            </div>
            <slot name="topNav" />
          </LayoutHeader>
        </div>
        <div
          v-if="showMobileBar"
          class="astryx-app-shell__mobile-bar"
          role="banner"
          :data-variant="variant"
        >
          <nav class="astryx-app-shell__mobile-nav" :aria-label="messages.layout.mobileNavigation">
            <SideNavRenderMode mode="topbar">
              <slot name="sideNav" />
            </SideNavRenderMode>
            <MobileNavToggle :label="messages.nav.openNavigation" :is-open="open" :controls="mobileNavId" @update:is-open="open = $event" />
          </nav>
        </div>
      </template>
      <template v-if="showSideInline" #start>
        <LayoutPanel ref="rail" class="astryx-app-shell__sidenav" :padding="0" :has-divider="variant === 'section'" :is-scrollable="height === 'fill'" :data-variant="variant">
          <slot name="sideNav" />
        </LayoutPanel>
      </template>
      <div class="astryx-app-shell__main" :data-elevated="elevate || undefined">
        <div v-if="elevate" ref="backdrop" class="astryx-app-shell__backdrop" />
        <LayoutContent
          :id="mainId"
          ref="content"
          class="astryx-app-shell__content"
          role="main"
          :tabindex="isMainScrollRegion ? 0 : -1"
          :data-scroll-region="isMainScrollRegion || undefined"
          :data-programmatic-focus="isMainProgrammaticFocus || undefined"
          :padding="contentPadding ?? 0"
          :is-scrollable="height === 'fill'"
          :data-variant="variant"
          :data-corner="elevate || undefined"
          @focusout="onMainFocusOut"
        >
          <slot />
        </LayoutContent>
      </div>
    </Layout>
    <slot v-if="hasCustomDrawer" name="mobileNav" />
    <MobileNav
      v-else-if="isBelow && mobileEnabled"
      :id="mobileNavId"
      v-model:is-open="open"
      :label="messages.layout.mobileNavigation"
    >
      <div :id="`${mobileNavId}-items`" />
      <SideNavRenderMode mode="drawer-content">
        <slot name="sideNav" />
      </SideNavRenderMode>
    </MobileNav>
  </div>
</template>
