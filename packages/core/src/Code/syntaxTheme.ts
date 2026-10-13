export interface SyntaxThemeTokens {
  keyword: string
  string: string
  comment: string
  number: string
  function: string
  type: string
  variable: string
  operator: string
  constant: string
  tag: string
  attribute: string
  property: string
  punctuation: string
  background: string
}

export interface SyntaxThemeDefinition {
  name: string
  tokens: SyntaxThemeTokens
}

export function defineSyntaxTheme(theme: SyntaxThemeDefinition): SyntaxThemeDefinition {
  return theme
}

/** GitHub Dark (GitHub Primer team), MIT. */
export const githubDark: SyntaxThemeDefinition = defineSyntaxTheme({
  name: 'github-dark',
  tokens: {
    keyword: '#ff7b72',
    string: '#a5d6ff',
    comment: '#8b949e',
    number: '#79c0ff',
    function: '#d2a8ff',
    type: '#ffa657',
    variable: '#e6edf3',
    operator: '#ff7b72',
    constant: '#79c0ff',
    tag: '#7ee787',
    attribute: '#79c0ff',
    property: '#79c0ff',
    punctuation: '#c9d1d9',
    background: '#0d1117',
  },
})

export function syntaxThemeStyle(theme: SyntaxThemeDefinition): Record<string, string> {
  const style: Record<string, string> = {
    '--astryx-code-block-background': theme.tokens.background,
  }
  const channels = theme.tokens.background.replace('#', '')
  const expanded = channels.length === 3 ? channels.split('').map(part => part + part).join('') : channels
  const value = Number.parseInt(expanded, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  const dark = (red * 299 + green * 587 + blue * 114) / 1000 < 140
  if (dark)
    style['--astryx-code-block-border'] = 'rgb(255 255 255 / 12%)'

  for (const [key, color] of Object.entries(theme.tokens)) {
    if (key === 'background')
      continue
    style[`--astryx-code-syntax-${key}`] = color
  }
  return style
}
