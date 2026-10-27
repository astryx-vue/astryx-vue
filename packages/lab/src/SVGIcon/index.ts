export {
  bellIcon,
  calendarIcon,
  checkIcon,
  eyeIcon,
  folderIcon,
  heartIcon,
  homeIcon,
  lockIcon,
  mailIcon,
  menuIcon,
  searchIcon,
  settingsIcon,
  shieldIcon,
  starIcon,
  starterIcons,
  xIcon,
} from './icons.js'
/** 路径变形的三个人格轴：圆角、曲率、张力。 */
export { addCurvature, adjustTension, applyPersonality, roundCorners } from './pathTransforms/index.js'

export type { PathPersonality } from './pathTransforms/index.js'

export { default as SVGIcon } from './SVGIcon.vue'
/** XIF（Astryx Icon Format）的类型和示例图标。 */
export type { XIFAnimate, XIFIcon, XIFPath, XIFPersonality, XIFSlot } from './types-xif.js'

export type {
  IconShape,
  IconShapeRole,
  SVGIconColor,
  SVGIconDef,
  SVGIconProps,
  SVGIconSize,
  SVGIconVariation,
} from './types.js'
export { xifBell, xifBellOverride, xifCheck, xifExamples, xifFile, xifHome, xifShield, xifStar } from './xif-examples.js'
