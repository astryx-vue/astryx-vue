/** 演练场主题编辑器的数据形状：主题状态本身，以及各个下拉和预设的选项结构。 */

export interface ThemeColors {
  accent: string
  neutral: string
  card: string
  surface: string
  body: string
  muted: string
  textPrimary: string
}

export type ThemeColorKey = keyof ThemeColors

export interface ThemeState {
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  dark: boolean
  headingFont: string
  bodyFont: string
  customHeadingFont: string
  customBodyFont: string
  typeScale: string
  typeSize: number
  radius: number
  spacing: number
  elementSize: number
  duration: number
}

export interface PlaygroundFont {
  id: string
  zh: string
  en: string
  stack: string
  google: string | null
}

export interface TypeScaleOption {
  id: string
  ratio: number
  zh: string
  en: string
}

export interface DensityPreset {
  id: 'compact' | 'default' | 'comfortable' | 'gigantic'
  zh: string
  en: string
  typeSize: number
  typeScale: string
  spacing: number
  elementSize: number
  radius: number
}

export interface ColorField {
  key: ThemeColorKey
  variable: string
  zh: string
  en: string
}
