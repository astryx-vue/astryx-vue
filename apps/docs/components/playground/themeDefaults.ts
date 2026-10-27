/** Neutral 主题的全部 token 默认值，从 neutral/base.css 读出，Advanced 面板拿它当起点。 */
import baseCss from '../../../../packages/themes/neutral/base.css?raw'
import { parseCustomProperties } from '../theme-tokens/parseTokens'

export const NEUTRAL_TOKENS: Readonly<Record<string, string>> = Object.fromEntries(
  parseCustomProperties(baseCss).map(item => [item.name, item.value]),
)
