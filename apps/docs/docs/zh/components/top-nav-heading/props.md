---
layout: component-docs
title: 顶部导航标题
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TopNavHeading 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>heading</code></td><td><code>string</code></td><td>—</td><td>产品或应用的名字，就是标题本身。只有标志、没有文字时可以不传。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>和 <code>headingHref</code> 是同一个意思，写出来是为了让顶栏和侧栏的标题用同样的属性名。两个都写时以 <code>headingHref</code> 为准。</td></tr>
<tr><td><code>headingHref</code></td><td><code>string</code></td><td>—</td><td>标题的链接，一般指向产品首页。没有菜单、而且只有这一处链接时，整段标题是一个大链接。</td></tr>
<tr><td><code>superheading</code></td><td><code>string</code></td><td>—</td><td>标题上面那行小字，例如套件名。字号更小、颜色更淡。</td></tr>
<tr><td><code>superheadingHref</code></td><td><code>string</code></td><td>—</td><td>上方小字的链接，例如套件首页。和菜单一起用时，这行小字自己是一个独立链接。</td></tr>
<tr><td><code>subheading</code></td><td><code>string</code></td><td>—</td><td>标题下面那行小字，例如当前账户。字号更小、颜色更淡。</td></tr>
<tr><td><code>subheadingHref</code></td><td><code>string</code></td><td>—</td><td>下方小字的链接。和菜单一起用时，这行小字自己是一个独立链接。</td></tr>
<tr><td><code>logoLabel</code></td><td><code>string</code></td><td><code>heading</code></td><td>标志单独成链接、旁边又没有可读文字时，给读屏用的名字。不传就用标题文字。标志不是链接时这个属性不起作用。</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接换成别的根组件时用，例如 <code>RouterLink</code>。只有写了地址才会用到。</td></tr>
</tbody></table>
</div>

## 插槽

- `logo`：标题左边的标志，可以是图片、`NavIcon`，或者任意元素。
- `icon`：和 `logo` 是同一个位置。两个都写时用 `logo`。
- `end`：标题这一行的末尾，例如放一个徽章。
- `menu`：弹出菜单的内容。给了它，标题旁边会自动出现箭头。没有链接时点整段标题打开菜单；有链接时链接各管各的，只有箭头打开菜单。插槽参数有 `close` 和 `focusRequest`。
