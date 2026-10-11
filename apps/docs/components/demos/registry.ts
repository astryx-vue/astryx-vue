import type { ComponentSlug } from '../demo-infra/componentCatalog'
import type { DemoModule } from '../demo-infra/defineDemo'
import { alertDialogOverview } from './alert-dialog'
import { avatarSizes } from './avatar'
import { avatarGroupBasic } from './avatar-group'
import { badgeColors } from './badge'
import { bannerStatuses } from './banner'
import { blockquoteCite } from './blockquote'
import { bottomSheetOverview } from './bottom-sheet'
import { breadcrumbsBasic } from './breadcrumbs'
import { buttonVariants } from './button'
import { calendarBasic } from './calendar'
import { buttonGroupBasic } from './button-group'
import { cardBasic } from './card'
import { centerBasic } from './center'
import { checkboxIndicatorOverview } from './checkbox-indicator'
import { checkboxInputBasic } from './checkbox-input'
import { codeBasic } from './code'
import { collapsibleBasic } from './collapsible'
import { contextMenuOverview } from './context-menu'
import { dateInputBasic } from './date-input'
import { dialogOverview } from './dialog'
import { dividerOverview } from './divider'
import { dropdownMenuOverview } from './dropdown-menu'
import { emptyStateBasic } from './empty-state'
import { fieldCustom } from './field'
import { gridBasic } from './grid'
import { headingLevels } from './heading'
import { hoverCardOverview } from './hover-card'
import { iconButtonActionBar } from './icon-button'
import { inputGroupBasic } from './input-group'
import { kbdBasic } from './kbd'
import { linkColors } from './link'
import { listBasic } from './list'
import { moreMenuOverview } from './more-menu'
import { numberInputBasic } from './number-input'
import { overlayBasic } from './overlay'
import { paginationBasic } from './pagination'
import { popoverOverview } from './popover'
import { progressBarBasic } from './progress-bar'
import { radioBasic, radioList } from './radio'
import { segmentedControlBasic } from './segmented-control'
import { selectorBasic } from './selector'
import { skeletonProfile } from './skeleton'
import { sliderBasic } from './slider'
import { spinnerBasic } from './spinner'
import { stackDirections } from './stack'
import { statusDotVariants } from './status-dot'
import { switchBasic } from './switch'
import { tabListBasic } from './tab-list'
import { textTypes } from './text'
import { textAreaBasic } from './text-area'
import { textInputBasic } from './text-input'
import { toastPreview } from './toast'
import { toggleButtonBasic } from './toggle-button'
import { tooltipOverview } from './tooltip'
import { visuallyHiddenContext } from './visually-hidden'

/**
 * The demo shown on the catalog card for each component. Typing this as a
 * complete record means a component added to the catalog cannot silently miss
 * its preview.
 */
export const componentDemos: Record<ComponentSlug, DemoModule> = {
  'avatar': avatarSizes,
  'avatar-group': avatarGroupBasic,
  'badge': badgeColors,
  'banner': bannerStatuses,
  'blockquote': blockquoteCite,
  'breadcrumbs': breadcrumbsBasic,
  'button': buttonVariants,
  'button-group': buttonGroupBasic,
  'context-menu': contextMenuOverview,
  'dropdown-menu': dropdownMenuOverview,
  'more-menu': moreMenuOverview,
  'toggle-button': toggleButtonBasic,
  'card': cardBasic,
  'center': centerBasic,
  'code': codeBasic,
  'collapsible': collapsibleBasic,
  'checkbox-indicator': checkboxIndicatorOverview,
  'checkbox-input': checkboxInputBasic,
  'dialog': dialogOverview,
  'divider': dividerOverview,
  'empty-state': emptyStateBasic,
  'field': fieldCustom,
  'segmented-control': segmentedControlBasic,
  'grid': gridBasic,
  'overlay': overlayBasic,
  'number-input': numberInputBasic,
  'input-group': inputGroupBasic,
  'selector': selectorBasic,
  'date-input': dateInputBasic,
  'calendar': calendarBasic,
  'pagination': paginationBasic,
  'heading': headingLevels,
  'icon-button': iconButtonActionBar,
  'kbd': kbdBasic,
  'link': linkColors,
  'list': listBasic,
  'popover': popoverOverview,
  'progress-bar': progressBarBasic,
  'radio': radioBasic,
  'radio-group': radioBasic,
  'radio-list': radioList,
  'skeleton': skeletonProfile,
  'slider': sliderBasic,
  'spinner': spinnerBasic,
  'stack': stackDirections,
  'status-dot': statusDotVariants,
  'hover-card': hoverCardOverview,
  'switch': switchBasic,
  'tab-list': tabListBasic,
  'text': textTypes,
  'text-area': textAreaBasic,
  'text-input': textInputBasic,
  'toast': toastPreview,
  'alert-dialog': alertDialogOverview,
  'bottom-sheet': bottomSheetOverview,
  'tooltip': tooltipOverview,
  'visually-hidden': visuallyHiddenContext,
}
