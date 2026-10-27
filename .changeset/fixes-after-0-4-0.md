---
"@astryx-vue/core": patch
"@astryx-vue/themes": patch
---

这一版修的都是细节，原来的用法不用改。

- 状态图标画得和原版一样了。Banner、输入框的状态提示、信息提示、步骤条、字数超限的计数前面都会显示成功、警告、错误、信息图标，现在这些图标和别处一样从图标表里取：配了图标表（比如 lucide）就画描边的，没配就用 core 自带的实心图形。之前这几处是各自画的描边线条，看着比原版细。
- `Table` 的行高和原版一样了。表格单元格不再比原版高出一截。
- Markdown 里不安全的链接地址（`javascript:`、`vbscript:`、`data:text/html`）在解析的时候就整段当成纯文字，里面的行内代码也不再生成。这类链接不会再出现「点了没反应」的样子。
- 四个空格缩进的内容不再被当成代码块或标题。`    # 标题` 现在是一行普通文字，缩进也原样留着，和原版一致。
- `parseInline` 和 `parseInlineAst` 只解析行内内容了。传整篇文档给它们只会当一行读，要解析整篇请用 `parseMarkdown`。
- 插件语法能把整段连标记一起吃掉：`{{see **this**, [that](url), and - this}}` 现在是一个节点，中间不会剩下半截粗体或链接。
- 被反斜杠转义的 `@` 不再触发插件语法：`\@{ada} then @{ada}.` 只有一个节点。
- 链接文字、图片说明里写的插件语法不生成节点，和原版一样按纯文字读。
- 只有勾选框、没有内容的任务项（`- [x] `）会保持勾选状态。
- `createMarkdownPlugin` 可以写显式泛型了，比如 `createMarkdownPlugin<'mentions', MentionNode>(…)`。这样 `toText` 和 `render` 里的 `node.data` 会收窄到具体类型，不用再写 `as`。
- `ComplexSelector` 的弹层现在可以调：新增 `popupWidth` 指定弹层宽度，`contentClass` 和 `contentStyle` 给弹层里放内容的那个容器加类名和样式，比如 `contentStyle={{ padding: 0 }}` 能让内容贴到弹层边缘。内边距默认也从外壳移到内容容器上，外观没有变化。

`@astryx-vue/themes` 的样式内容和 0.4.0 一样，只是它和 core 共用同一条版本线，所以跟着一起升到 0.4.1。
