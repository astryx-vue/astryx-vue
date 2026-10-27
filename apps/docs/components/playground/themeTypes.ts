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

/** Components 面板里用户自己加的一条覆盖：某个组件的某个 CSS 属性。 */
export interface CustomOverride {
  id: string
  component: string
  property: string
  value: string
}

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
  /** Advanced 面板直接改的 token，键是带 `--astryx-` 前缀的变量名，值原样写进 CSS。 */
  tokens: Record<string, string>
  /** Components 面板改的组件变量（如 `--card-radius`），值是选项或自填的 CSS 值。 */
  componentTokens: Record<string, string>
  customOverrides: CustomOverride[]
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
