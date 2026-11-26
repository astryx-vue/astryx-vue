import type { Component, Ref } from 'vue'
import type { NavLinkComponent } from '../NavItem/types.js'
import { ref, toRaw } from 'vue'
import { useLinkComponent } from '../LinkProvider/context.js'
import { safeNavHref } from '../NavItem/link.js'

export type PaginationControlKind = 'first' | 'previous' | 'next' | 'last'

export interface PaginationLinkOptions {
  getPageHref: () => ((page: number, pageSize?: number) => string) | undefined
  as: () => NavLinkComponent | undefined
  page: Ref<number>
  /** 传给 `getPageHref` 的每页条数；调用方没设过每页条数时为 undefined。 */
  pageSize: () => number | undefined
  step: Ref<number>
  totalPages: Ref<number>
  isCursor: Ref<boolean>
  /** 这个控件现在能不能用：已经在边界上，或整个分页被禁用，就没有地址。 */
  isAvailable: (kind: PaginationControlKind) => boolean
}

/** 点击带修饰键，或链接要在别处打开：这一页在本页没有换。 */
function opensElsewhere(event: MouseEvent): boolean {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return true
  const target = (event.currentTarget as HTMLAnchorElement | null)?.target
  return target != null && target !== '' && target.toLowerCase() !== '_self'
}

export interface PaginationLinks {
  /** 链接被点击：记下点击时的页码，再决定要不要换页。 */
  activate: (event: MouseEvent, href: string | undefined, change: () => void) => void
  /** 链接用 `href`（路由链接组件另给 `to`），按钮用 `type`。 */
  attrs: (href: string | undefined) => Record<string, string | undefined>
  controlHref: (kind: PaginationControlKind) => string | undefined
  pageHref: (page: number, isDisabled: boolean) => string | undefined
  root: (href: string | undefined) => string | Component
}

/**
 * 页码、上一页、下一页、首页、末页控件用 `getPageHref` 变成链接。
 * 没有地址的控件（边界上、禁用、地址被导航规则拒绝）仍是按钮。
 */
export function usePaginationLinks(options: PaginationLinkOptions): PaginationLinks {
  const linkComponent = useLinkComponent()
  /** 点击发生时的页码。浏览器跟随链接之前，上一页和下一页的地址不能先跳到下一页。 */
  const heldPage = ref<number | null>(null)

  function currentPage(): number {
    return heldPage.value ?? options.page.value
  }

  function targetOf(kind: PaginationControlKind): number {
    const from = currentPage()
    const stride = options.step.value
    switch (kind) {
      case 'first':
        return 1
      case 'last':
        return options.totalPages.value
      case 'previous':
        return Math.max(1, from - stride)
      case 'next': {
        const target = from + stride
        return options.isCursor.value ? target : Math.min(target, options.totalPages.value)
      }
    }
  }

  function hrefOf(page: number): string | undefined {
    const getPageHref = options.getPageHref()
    if (getPageHref == null)
      return undefined
    return safeNavHref(getPageHref(page, options.pageSize()))
  }

  function controlHref(kind: PaginationControlKind): string | undefined {
    if (!options.isAvailable(kind))
      return undefined
    return hrefOf(targetOf(kind))
  }

  function pageHref(page: number, isDisabled: boolean): string | undefined {
    return isDisabled ? undefined : hrefOf(page)
  }

  const custom = (): NavLinkComponent | undefined => options.as() ?? linkComponent.value

  function root(href: string | undefined): string | Component {
    if (href == null)
      return 'button'
    const component = custom()
    return component == null ? 'a' : toRaw(component)
  }

  /** 链接用 `href`（路由链接组件另给 `to`），按钮用 `type`。 */
  function attrs(href: string | undefined): Record<string, string | undefined> {
    if (href == null)
      return { type: 'button' }
    return custom() == null ? { href } : { href, to: href }
  }

  /**
   * 链接被点击：记下点击时的页码，到这次点击结束为止地址都按它算；
   * 点击要在别处打开时本页不换，否则照按钮那样换页，浏览器同时跟随链接。
   */
  function activate(event: MouseEvent, href: string | undefined, change: () => void): void {
    if (href == null) {
      // 设了 getPageHref 却拿不到可用地址（被导航规则拒绝）的控件，点击也不换页。
      if (options.getPageHref() == null)
        change()
      return
    }
    heldPage.value = options.page.value
    setTimeout(() => {
      heldPage.value = null
    }, 0)
    if (!opensElsewhere(event))
      change()
  }

  return { activate, attrs, controlHref, pageHref, root }
}
