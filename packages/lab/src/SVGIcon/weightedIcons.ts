import type { WeightedIconDef } from './buildWeightedIcon.js'
import { bellWeightedIcon, calendarWeightedIcon, checkWeightedIcon, heartWeightedIcon, homeWeightedIcon, menuWeightedIcon, settingsWeightedIcon, xWeightedIcon } from './weightedIconsA.js'
import { eyeWeightedIcon, folderWeightedIcon, lockWeightedIcon, mailWeightedIcon, searchWeightedIcon, shieldWeightedIcon, starWeightedIcon } from './weightedIconsB.js'

export * from './weightedIconsA.js'
export * from './weightedIconsB.js'

/** 全部随字重变化的演示图标。 */
export const weightedStarterIcons: readonly WeightedIconDef[] = [
  xWeightedIcon,
  checkWeightedIcon,
  bellWeightedIcon,
  homeWeightedIcon,
  settingsWeightedIcon,
  calendarWeightedIcon,
  menuWeightedIcon,
  heartWeightedIcon,
  eyeWeightedIcon,
  starWeightedIcon,
  folderWeightedIcon,
  shieldWeightedIcon,
  searchWeightedIcon,
  mailWeightedIcon,
  lockWeightedIcon,
]
