---
layout: component-docs
title: 下拉菜单项
outline: false
footer: false
---

## DropdownMenuItem 属性

<div class="component-api-table" role="region" aria-label="DropdownMenuItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>行内的主要文字。需要富文本时改用 <code>label</code> 插槽。</td></tr>
<tr><td><code>description</code></td><td><code>string | number</code></td><td>—</td><td>标签下方的次要说明文字。需要富文本时改用 <code>description</code> 插槽。</td></tr>
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>标签前的图标：一个 CSS 图标类（例如 UnoCSS 的 <code>i-carbon-copy</code>，也可以是你自己的类名），或一个绘制 SVG 的组件。astryx-vue 不自带图标。想放任意内容时改用 <code>icon</code> 插槽。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用这一行。禁用的行会被方向键和字母跳转跳过，并且不响应点击。</td></tr>
<tr><td><code>variant</code></td><td><code>'default' | 'destructive'</code></td><td><code>'default'</code></td><td>视觉变体。<code>destructive</code> 会把标签、说明和图标一起换成错误色，用于删除这类危险动作。悬停底色仍是共用的中性色，与其他行一致。</td></tr>
<tr><td><code>hasCloseOnSelect</code></td><td><code>boolean</code></td><td><code>true</code></td><td>激活这一行后是否收起菜单。像“复制”这种在行内回报结果的动作可以设为 <code>false</code>。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>这一行要跳转的地址。给出后整行就是一个带 <code>role="menuitem"</code> 的链接，所以 ⌘/Ctrl 点击和中键点击仍然保持浏览器原本的含义。</td></tr>
<tr><td><code>target</code></td><td><code>'_blank' | '_self'</code></td><td>—</td><td>链接的打开方式，仅在给出 <code>href</code> 时使用。</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>链接关系，仅在给出 <code>href</code> 时使用。<code>target="_blank"</code> 时会自动加上 <code>noopener</code> 和 <code>noreferrer</code>。</td></tr>
<tr><td><code>onClick</code></td><td><code>(event: MouseEvent) =&gt; void</code></td><td>—</td><td>激活这一行时调用。链接行会在浏览器跳转前调用；带修饰键的点击交给浏览器处理，不调用它。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="DropdownMenuItem 事件" tabindex="0">
<table><thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead><tbody>
<tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>激活这一行时触发，带回触发它的那次点击。<code>@click</code> 和 <code>onClick</code> 走的是同一个处理函数，所以同一行不会被执行两次。</td></tr>
</tbody></table>
</div>

## 插槽

- `icon`：任意前置内容，替代 `icon` 属性。
- `label`：替代 `label` 属性的富文本。
- `description`：替代 `description` 属性的富文本。
- `endContent`：行尾内容，例如一个提示快捷键的 `Kbd`。

## 原生属性

行的根元素就是带 `role="menuitem"` 的那个元素：给出 `href` 时是一个 `<a>`，否则是 `Item` 的根。属性和 DOM 事件都会落到它上面，所以 `id`、`data-*`、`aria-*` 以及拖放相关的处理函数都写在行上。`class` 和 `style` 也落到这个根元素，示例里就是靠它把某一行画成高亮状态。

行高跟着菜单的 `size` 走，不用额外传属性就能和触发按钮对齐。
