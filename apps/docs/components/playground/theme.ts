/**
 * 演练场主题编辑器的统一入口。各部分按职责放在 theme*.ts 里：
 * - themeTypes：数据形状
 * - themeOptions：颜色字段、字号比例、密度预设、字体这些固定选项
 * - themeState：默认主题、替换、比较、预设、清洗
 * - themeColor：颜色读写与换算
 * - themeScale：字号、间距、控件高度、圆角、时长阶梯
 * - themeOverrides：Advanced 和 Components 面板写进主题的 token、组件变量、自定义覆盖
 * - themeExport：CSS 变量表、预览样式、导出 CSS 和 JSON
 */
export {
  activeColors,
  applyColorPicker,
  colorInputValue,
  colorTokenLabel,
  contrastingInk,
  formatColorReadout,
  parseColorReadout,
  setThemeColor,
} from './themeColor'
export { exportThemeCss, exportThemeJson, fontStylesheetHref, previewCss, themeVariables } from './themeExport'
export { COLOR_FIELDS, DENSITY_PRESETS, PLAYGROUND_FONTS, TYPE_SCALES } from './themeOptions'
export {
  addCustomOverride,
  buildComponentStyles,
  clearScaleTokens,
  clearToken,
  removeCustomOverride,
  setComponentToken,
  setToken,
  updateCustomOverride,
} from './themeOverrides'
export {
  describeDuration,
  describeElementSize,
  describeRadius,
  describeSpacing,
  describeType,
  typeScaleRatio,
} from './themeScale'
export { applyDensity, applyTheme, cloneTheme, createNeutralTheme, matchingDensity, sanitizeTheme, themesEqual } from './themeState'
export type {
  ColorField,
  CustomOverride,
  DensityPreset,
  PlaygroundFont,
  ThemeColorKey,
  ThemeColors,
  ThemeState,
  TypeScaleOption,
} from './themeTypes'
