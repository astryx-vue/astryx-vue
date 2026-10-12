import type { VNodeChild } from 'vue'
import type { SpacingStep } from '../Stack/types.js'

export type AppShellVariant = 'wash' | 'surface' | 'section' | 'elevated'
export type AppShellHeight = 'fill' | 'auto'
export type AppShellBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'

export interface AppShellMobileNav {
  /** 小于这个宽度时收起侧栏。 @default 'md' */
  breakpoint?: AppShellBreakpoint
  /** 受控的抽屉开关。 */
  isOpen?: boolean
  /** 窄屏时要不要自动放开关。 @default true */
  hasToggle?: boolean
}

export interface AppShellProps {
  /** @default 'elevated' */
  variant?: AppShellVariant
  /** 正文区内边距，用间距刻度。不传则贴边。 */
  contentPadding?: SpacingStep
  /** @default 'fill' */
  height?: AppShellHeight
  /**
   * false 关掉移动导航。对象用来改断点和开关。
   * 自定义抽屉用 mobileNav 插槽。
   */
  mobileNav?: false | AppShellMobileNav
}

export interface AppShellSlots {
  default?: () => VNodeChild
  topNav?: () => VNodeChild
  sideNav?: () => VNodeChild
  banner?: () => VNodeChild
  mobileNav?: () => VNodeChild
}

export interface AppShellEmits {
  mobileNavOpenChange: [isOpen: boolean]
}
