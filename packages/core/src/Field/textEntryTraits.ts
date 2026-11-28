/**
 * 软键盘读取聚焦元素上的这几个原生属性，来判断该弹出什么键盘、回车键写什么字、要不要自动大写和纠错。
 * TextInput、TextArea 和各搜索输入框共用这一份：没传的属性不渲染，浏览器保持自己的默认。
 */

/**
 * 软键盘回车键上的字。iOS 给 `done`、`go`、`next`、`search`、`send` 各自的键面；
 * `enter` 和 `previous` 仍是普通回车。它只改键面，按下回车做什么仍由字段自己的处理函数决定。
 */
export type EnterKeyHint = 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'

/**
 * 字段要哪种软键盘，取值同 HTML 标准的 `inputmode`。
 * `numeric` 弹出数字键盘；iOS 上 `search` 弹出带句点键和 Go 键的网页搜索键盘。
 */
export type InputMode = 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'

/**
 * 软键盘什么时候自动大写：`off` 和 `none` 从不，`on` 和 `sentences` 每句开头，
 * `words` 每个词开头，`characters` 每个字母。
 */
export type AutoCapitalize = 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'

/** TextInput 和 TextArea 共用的软键盘属性。 */
export interface TextEntryTraitProps {
  /** 软键盘回车键上的字（原生 `enterkeyhint`）。 */
  enterKeyHint?: EnterKeyHint
  /** 字段要哪种软键盘（原生 `inputmode`），不改变字段接受什么。 */
  inputMode?: InputMode
  /** 软键盘什么时候自动大写（原生 `autocapitalize`）。 */
  autoCapitalize?: AutoCapitalize
  /** 软键盘是否在输入时纠正单词（原生 `autocorrect`）。 */
  hasAutoCorrect?: boolean
}

/** 软键盘属性落到原生元素上的写法；没传的不出现。 */
export interface TextEntryTraitAttributes {
  enterkeyhint?: EnterKeyHint
  inputmode?: InputMode
  autocapitalize?: AutoCapitalize
  autocorrect?: 'on' | 'off'
}

export function textEntryTraitAttributes(traits: TextEntryTraitProps): TextEntryTraitAttributes {
  const attributes: TextEntryTraitAttributes = {}
  if (traits.enterKeyHint != null)
    attributes.enterkeyhint = traits.enterKeyHint
  if (traits.inputMode != null)
    attributes.inputmode = traits.inputMode
  if (traits.autoCapitalize != null)
    attributes.autocapitalize = traits.autoCapitalize
  if (traits.hasAutoCorrect != null)
    attributes.autocorrect = traits.hasAutoCorrect ? 'on' : 'off'
  return attributes
}
