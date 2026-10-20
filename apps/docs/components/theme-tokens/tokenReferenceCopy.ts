/** `<TokenReference>` 页面上的中英文文案：分区标题和说明、颜色分组名、单个 token 的备注。 */
import type { ColorBucket, TokenSectionId } from './parseTokens'

export interface LocalizedText {
  zh: string
  en: string
}

export interface SectionCopy {
  title: LocalizedText
  description: LocalizedText
}

export const REFERENCE_COPY = {
  light: { zh: '浅色', en: 'Light' },
  dark: { zh: '深色', en: 'Dark' },
  replay: { zh: '再播一次', en: 'Replay' },
  motionTitle: { zh: '动画', en: 'Motion' },
  motionLead: {
    zh: '进入和退出各有淡入淡出、缩放，以及上、下、起始侧、结束侧四个方向的滑动。系统开启「减少动态效果」时，位移和缩放会收成 0，透明度直接落到结束状态。现有组件仍使用自己的动画名。',
    en: 'Enter and exit each have a fade, a scale, and slides from above, below, the start side, and the end side. When the system asks for reduced motion, the distance and scale collapse to zero and opacity jumps to the end state. Existing components still use their own animation names.',
  },
} as const satisfies Record<string, LocalizedText>

export const SECTION_COPY: Record<TokenSectionId, SectionCopy> = {
  color: {
    title: { zh: '颜色', en: 'Color' },
    description: {
      zh: '每一格左边是浅色，右边是深色。带透明度的颜色垫了棋盘格。',
      en: 'Each pair shows the light stop, then the dark stop. Translucent colors sit on a checkerboard.',
    },
  },
  spacing: {
    title: { zh: '间距', en: 'Spacing' },
    description: {
      zh: '0 到 12。条的宽度就是这个间距。',
      en: 'Steps 0 through 12. The bar is as wide as the token.',
    },
  },
  size: {
    title: { zh: '控件高度', en: 'Control size' },
    description: {
      zh: '小号、中号、大号控件的高度。',
      en: 'Heights for small, medium, and large controls.',
    },
  },
  border: {
    title: { zh: '边框', en: 'Border' },
    description: {
      zh: '默认边框粗细。',
      en: 'The default border width.',
    },
  },
  focus: {
    title: { zh: '焦点环', en: 'Focus ring' },
    description: {
      zh: '键盘焦点环。颜色跟随 accent。',
      en: 'The keyboard focus ring. Its color follows accent.',
    },
  },
  radius: {
    title: { zh: '圆角', en: 'Radius' },
    description: {
      zh: '色块的圆角就是这个变量。',
      en: 'The sample uses the token as its corner radius.',
    },
  },
  shadow: {
    title: { zh: '阴影', en: 'Shadow' },
    description: {
      zh: '外阴影三档，再加上五种内阴影。预览跟随当前的浅色或深色。',
      en: 'Three elevation shadows, plus five inset shadows. The preview follows the current color scheme.',
    },
  },
  duration: {
    title: { zh: '时长', en: 'Duration' },
    description: {
      zh: 'Neutral 的节奏比默认主题更快：fast 125ms，medium 300ms，slow 700ms，比例 0.75，再取整到 5ms。',
      en: 'Neutral is snappier than the default scale: fast 125ms, medium 300ms, slow 700ms, ratio 0.75, rounded to 5ms.',
    },
  },
  ease: {
    title: { zh: '缓动', en: 'Easing' },
    description: {
      zh: '进入动画用这条减速曲线。',
      en: 'Entrances use this decelerating curve.',
    },
  },
  font: {
    title: { zh: '字体', en: 'Font' },
    description: {
      zh: '字体族、字号阶梯和字重。字号从 14px 起，按 1.2 的比例取整。',
      en: 'Families, the size ramp, and weights. Sizes start at 14px and step by 1.2, then round.',
    },
  },
  type: {
    title: { zh: '字号角色', en: 'Type roles' },
    description: {
      zh: '标题、正文、辅助文字和展示字号。它们引用上面的字号和字重。',
      en: 'Headings, body, supporting text, and display roles. They point at the size and weight tokens above.',
    },
  },
}

export const BUCKET_COPY: Record<ColorBucket, LocalizedText> = {
  core: { zh: '底色与强调', en: 'Surfaces and accent' },
  text: { zh: '文字', en: 'Text' },
  icon: { zh: '图标', en: 'Icon' },
  status: { zh: '状态', en: 'Status' },
  line: { zh: '边框与效果', en: 'Border and effect' },
  blue: { zh: '蓝', en: 'Blue' },
  cyan: { zh: '青', en: 'Cyan' },
  gray: { zh: '灰', en: 'Gray' },
  green: { zh: '绿', en: 'Green' },
  orange: { zh: '橙', en: 'Orange' },
  pink: { zh: '粉', en: 'Pink' },
  purple: { zh: '紫', en: 'Purple' },
  red: { zh: '红', en: 'Red' },
  teal: { zh: '蓝绿', en: 'Teal' },
  yellow: { zh: '黄', en: 'Yellow' },
  data: { zh: '图表', en: 'Charts' },
}

/** 和原版 Neutral 不同、或者需要额外解释的 token。 */
export const TOKEN_NOTES: Record<string, LocalizedText> = {
  '--astryx-color-text-secondary': {
    zh: '浅色保持 #525252。原版 Neutral 是 #737373。输入框、选择器和说明文字已经在用现在这个值。',
    en: 'The light stop stays #525252. Upstream Neutral uses #737373. Inputs, selectors, and supporting text already use the current value.',
  },
  '--astryx-color-text-accent': {
    zh: '语义值和 accent 相同。text.css 里另有一套蓝色，会盖住这里，组件仍显示蓝色。',
    en: 'The semantic value matches accent. text.css still declares a blue pair that wins, so components stay blue.',
  },
  '--astryx-color-track': {
    zh: 'Neutral 没有覆盖这一项，所以用原版默认色。',
    en: 'Neutral does not override this token, so the upstream default is used.',
  },
  '--astryx-color-background-inverted': {
    zh: 'Neutral 没有覆盖，使用原版默认值。',
    en: 'Neutral does not override this token, so the upstream default is used.',
  },
  '--astryx-color-background-error-inverted': {
    zh: 'Neutral 没有覆盖，使用原版默认值。',
    en: 'Neutral does not override this token, so the upstream default is used.',
  },
  '--astryx-color-background-gray': {
    zh: '深色直接引用 color-neutral，也就是半透明白。',
    en: 'The dark stop references color-neutral, a translucent white.',
  },
  '--astryx-radius-none': {
    zh: '保持 0。原版 Neutral 写成 0.25rem。方形头像和圆角为 none 的骨架屏用它表示直角。',
    en: 'Stays 0. Upstream Neutral uses 0.25rem. Square avatars and skeletons with radius none use this token for a square corner.',
  },
  '--astryx-radius-chat': {
    zh: 'Neutral 没有单独覆盖。28px 在 16px 根字号下等于页面圆角 1.75rem。',
    en: 'Neutral does not override this token. 28px equals the 1.75rem page radius at a 16px root.',
  },
  '--astryx-font-weight-regular': {
    zh: '组件已经在用这个名字。它指向 font-weight-normal，也就是 400。原版变量名是 normal。',
    en: 'Components already use this name. It points at font-weight-normal, which is 400. Upstream calls that token normal.',
  },
  '--astryx-font-family-code': {
    zh: '以 JetBrains Mono 开头，后面是 ui-monospace、SFMono-Regular、Menlo、Consolas、monospace。Neutral 主题入口会加载 400、500、600、700 和 400 斜体。',
    en: 'Starts with JetBrains Mono, then ui-monospace, SFMono-Regular, Menlo, Consolas, and monospace. The Neutral theme entry loads 400, 500, 600, 700, and 400 italic.',
  },
}
