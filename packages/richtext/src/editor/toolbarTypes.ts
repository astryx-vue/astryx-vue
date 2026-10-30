export type RichTextToolbarSize = 'sm' | 'md' | 'lg'

export interface RichTextEditorToolbarProps {
  /**
   * 工具栏的无障碍名称。
   * @default 'Text formatting'，按当前语言翻译
   */
  label?: string
  /**
   * 「块格式」下拉里提供哪几级标题，按这个顺序排。
   * @default ['h1', 'h2', 'h3']
   */
  headingLevels?: ReadonlyArray<'h1' | 'h2' | 'h3'>
  /**
   * 工具栏尺寸，同时影响里面各个控件。
   * @default 'sm'
   */
  size?: RichTextToolbarSize
  /**
   * 是否显示插入、编辑链接的按钮。默认点开一个对话框，里面可以添加、更新、移除链接，
   * 选区不会丢。写进去的网址会先过 `sanitizeUrl`，只放行 http、https、mailto、tel。
   * @default true
   */
  hasLink?: boolean
  /**
   * 自己提供网址输入界面时用：在没有链接的选区上按链接按钮，会带着选中的文字调用它；
   * 返回网址就加链接，返回空就取消。不传就用内置的对话框。
   */
  promptForUrl?: (selectedText: string) => string | null | undefined
  /**
   * 工具栏里创建的链接是否在新标签页打开：带 `target="_blank"` 和 `rel="noopener noreferrer"`，
   * 写进链接节点的数据里，所以能随文档保存、往返。设为 `false` 就是同页打开。
   * @default true
   */
  hasNewTabLinks?: boolean
}

export interface RichTextEditorToolbarSlots {
  /** 放在默认按钮后面（隔一条分隔线）的内容，用来加自己的控件，比如提及、AI。 */
  end?: () => unknown
}
