import type { Component, VNode } from 'vue'
import type { ButtonElevation } from '../Button/types.js'

export type BannerStatus = 'info' | 'warning' | 'error' | 'success'
export type BannerContainer = 'card' | 'section'
export interface BannerProps {
  status: BannerStatus
  title: string
  description?: string
  icon?: Component
  isDismissable?: boolean
  dismissLabel?: string
  expandLabel?: string
  collapseLabel?: string
  container?: BannerContainer
  elevation?: ButtonElevation
  collapsible?: boolean
  defaultIsOpen?: boolean
  isOpen?: boolean
}
export interface BannerEmits {
  dismiss: []
}
export interface BannerSlots {
  default?: () => VNode[]
  title?: () => VNode[]
  description?: () => VNode[]
  icon?: () => VNode[]
  end?: () => VNode[]
}
