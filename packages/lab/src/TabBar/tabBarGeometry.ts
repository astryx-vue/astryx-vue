/**
 * @file tabBarGeometry.ts
 * @input TabBar 的 UIKit 实测值和 tabBarModel.ts 的项宽表达式
 * @output 胶囊上的 CSS 几何：项的间距、中心、按钮所占的列、透镜离第一项的距离，以及各部分的
 *   固定尺寸
 * @position lab TabBar 的布局。胶囊是尺寸容器，`100cqw` 就是它的宽度，所以布局全在 CSS 里：
 *   水合前和改尺寸时都是对的。和 tabBarModel.ts 的像素几何是同一套。
 */

import { itemWidthCss } from './tabBarModel'
import { tabBar } from './uikitTabBar'

export const px = (value: number): string => `${value}px`
const INSET = px(tabBar.itemInset)

/** 相邻两项中心的距离。 */
export function pitch(count: number): string {
  return count > 1
    ? `((100cqw - ${px(2 * tabBar.itemInset)} - ${itemWidthCss(count)}) / ${count - 1})`
    : '0px'
}

/** 第 `index` 项的中心离胶囊行首多远，写在 calc() 里用。 */
export function center(index: number, count: number): string {
  return count > 1
    ? `${INSET} + ${itemWidthCss(count)} / 2 + ${pitch(count)} * ${index}`
    : '50cqw'
}

/**
 * 一个按钮所占的列，以及项在列里从哪开始。列从和前一项的中点到和后一项的中点，首尾两列
 * 一直到胶囊边，所以按在哪都落到最近的项上。
 */
export function column(index: number, count: number): { start: string, width: string, itemStart: string } {
  if (count <= 1)
    return { start: '0px', width: '100cqw', itemStart: `calc(50cqw - ${itemWidthCss(count)} / 2)` }
  const half = `${pitch(count)} / 2`
  const edgeWidth = `calc(${INSET} + ${itemWidthCss(count)} / 2 + ${half})`
  if (index === 0)
    return { start: '0px', width: edgeWidth, itemStart: INSET }
  return {
    start: `calc(${center(index, count)} - ${half})`,
    width: index === count - 1 ? edgeWidth : `calc(${pitch(count)})`,
    itemStart: `calc(${half} - ${itemWidthCss(count)} / 2)`,
  }
}

/** 透镜的静止位置离第一项多远。 */
export function lensOffset(index: number, count: number): string {
  return count > 1 ? `calc(${pitch(count)} * ${index})` : '0px'
}

/** 各部分的固定尺寸，写成 CSS 长度。 */
export const SIZES = {
  barHeight: px(tabBar.barHeight),
  barInset: px(tabBar.barInset),
  itemInset: INSET,
  itemHeight: px(tabBar.itemHeight),
  iconStart: `calc(50% - ${px(tabBar.iconSize / 2)})`,
  iconTop: px(tabBar.iconCenterY - tabBar.iconSize / 2),
  iconSize: px(tabBar.iconSize),
  labelTop: px(tabBar.labelTop),
  labelHeight: px(tabBar.labelSize * 1.2),
  labelSize: px(tabBar.labelSize),
  badgeTop: px(tabBar.itemInset + tabBar.badge.offsetY),
  badgeHeight: px(tabBar.badge.height),
  badgePadding: px(tabBar.badge.paddingInline),
  badgeFontSize: px(tabBar.badge.fontSize),
  badgeOffsetX: px(tabBar.badge.offsetX),
} as const

/** 样式表读的尺寸变量，写在根元素上（styles/tab-bar.css）。 */
export const SIZE_VARIABLES: Readonly<Record<string, string>> = {
  '--_tab-bar-inset': SIZES.barInset,
  '--_tab-bar-item-inset': SIZES.itemInset,
  '--_tab-bar-icon-start': SIZES.iconStart,
  '--_tab-bar-icon-top': SIZES.iconTop,
  '--_tab-bar-icon-size': SIZES.iconSize,
  '--_tab-bar-label-top': SIZES.labelTop,
  '--_tab-bar-label-height': SIZES.labelHeight,
  '--_tab-bar-label-size': SIZES.labelSize,
  '--_tab-bar-badge-top': SIZES.badgeTop,
  '--_tab-bar-badge-height': SIZES.badgeHeight,
  '--_tab-bar-badge-padding': SIZES.badgePadding,
  '--_tab-bar-badge-font-size': SIZES.badgeFontSize,
}
