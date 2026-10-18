---
layout: component-docs
title: 侧边导航标题
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="SideNavHeading 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>heading</code></td><td><code>string</code></td><td>—</td><td>产品或应用的名字。侧栏收起后只剩图标时，它也是读屏读到的名字。必填。</td></tr>
<tr><td><code>headingHref</code></td><td><code>string</code></td><td>—</td><td>标题的链接，一般指向产品首页。没有菜单时，整段标题是一个大链接。</td></tr>
<tr><td><code>superheading</code></td><td><code>string</code></td><td>—</td><td>标题上面那行小字，例如套件名。</td></tr>
<tr><td><code>superheadingHref</code></td><td><code>string</code></td><td>—</td><td>上方小字的链接。和菜单一起用时，这行小字自己是一个独立链接。</td></tr>
<tr><td><code>subheading</code></td><td><code>string</code></td><td>—</td><td>标题下面那行小字，例如当前账户。</td></tr>
<tr><td><code>subheadingHref</code></td><td><code>string</code></td><td>—</td><td>下方小字的链接。和菜单一起用时，这行小字自己是一个独立链接。</td></tr>
<tr><td><code>logoLabel</code></td><td><code>string</code></td><td><code>heading</code></td><td>图标单独成链接、旁边又没有可读文字时，给读屏用的名字。</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接换成别的根组件时用，例如 <code>RouterLink</code>，它还会一并收到 <code>to</code>。只有写了地址才会用到。</td></tr>
</tbody></table>
</div>

## 插槽

- `icon`：文字前面的标志，可以是 `NavIcon`、图片或者任意元素。侧栏收起后，它就是整个标题。
- `menu`：标题的弹出菜单内容。给了它，标题旁边会自动出现箭头。没有地址时点整段标题打开菜单；有地址时链接各管各的。插槽参数有 `close` 和 `focusRequest`。
- `end`：标题这一行的末尾，例如放一个徽标。
