---
layout: component-docs
title: 树形列表
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TreeList 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>TreeListItemData[]</code></td>
        <td>-</td>
        <td>树的数据。字段见下表。</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>一行的上下内边距：4px、8px 或 12px。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'lineGuides' | 'noGuides'</code></td>
        <td><code>'lineGuides'</code></td>
        <td>父子行之间是否画引导线。</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>树上方的纯文本标题。复杂内容用 <code>header</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>没有可见标题时，树的无障碍名称。</td>
      </tr>
    </tbody>
  </table>
</div>

### TreeListItemData

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | 焦点和展开用的稳定标识。 |
| <code>label</code> | <code>string</code> | 可见名称。 |
| <code>description</code> | <code>string</code> | 第二行说明。 |
| <code>icon</code> | <code>string</code> | 前置字形名，或以 <code>i-</code> 开头的 CSS 图标类。 |
| <code>endIcon</code> | <code>string</code> | 末尾字形或 CSS 图标类。 |
| <code>badge</code> | <code>string</code> | 末尾计数。 |
| <code>children</code> | <code>TreeListItemData[]</code> | 子项。有这个字段的行可以展开。 |
| <code>href</code> / <code>target</code> | <code>string</code> | 把这一行渲染成链接。<code>target="_blank"</code> 会带上 <code>rel="noopener noreferrer"</code>。 |
| <code>onClick</code> | <code>(event: MouseEvent) =&gt; void</code> | 把叶子渲染成按钮。 |
| <code>isDisabled</code> | <code>boolean</code> | 这一行不接受焦点，也不能激活。 |
| <code>isSelected</code> | <code>boolean</code> | 由调用方标出当前项。树没有根上的选中值，也不强制只有一行选中。 |
| <code>isExpanded</code> | <code>boolean</code> | 初始是否展开。之后的切换由树自己记住。 |
| <code>className</code> | <code>string</code> | 额外类名，落在这一行上。 |
| <code>style</code> | <code>CSSProperties</code> | 行内样式，落在这一行上。 |

<code>start</code> 和 <code>end</code> 插槽收到 <code>{ item }</code>，用来替换 <code>icon</code> 和 <code>endIcon</code>。

读屏时一行的名字只有标题。说明通过 <code>aria-describedby</code> 单独读出，展开按钮和图标不进名字。敲字符跳转也只匹配标题。有可见 <code>header</code> 时，树的名字用这个标题，不用外面传来的 <code>aria-label</code>。在根上监听按键并 <code>preventDefault</code> 之后，方向键不再移动树里的焦点。

## 主题

缩进是 <code>--astryx-spacing-4</code>。行内容的左右内边距和间距都是 <code>--astryx-spacing-2</code>。引导线是 1px 的强调边框。焦点使用共用的焦点轮廓 token。选中行使用强调色的淡底。
