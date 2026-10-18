---
layout: component-docs
title: 侧边导航项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="SideNavItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这一项显示的名字。收起后只剩图标时，以及弹层标题，也用它当读屏名。必填。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>要跳去的地址。不写就渲染成按钮，只触发 <code>click</code>。</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接换成别的根组件时用，例如 <code>RouterLink</code>，它还会一并收到 <code>to</code>。只有写了地址才会用到。</td></tr>
<tr><td><code>target</code></td><td><code>string</code></td><td>—</td><td>链接的 <code>target</code>。指明在新窗口打开时，会自己补上 <code>noopener noreferrer</code>。</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>链接的 <code>rel</code>。和自动补的 <code>noopener noreferrer</code> 合并。</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>文字前面的图标，传 CSS icon 的类名，例如 <code>i-carbon-home</code>。侧栏收起后，没有图标的项会被省略。</td></tr>
<tr><td><code>selectedIconClass</code></td><td><code>string</code></td><td>—</td><td>选中时换成这个图标，不写就用 <code>iconClass</code>。</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是不是当前这一页。会写上 <code>aria-current="page"</code>，并套上选中样式。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用这一项。会挡掉默认行为，也不触发事件。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>这一项的高和左右内边距。</td></tr>
<tr><td><code>collapsible</code></td><td><code>boolean | { defaultIsCollapsed?: boolean, isCollapsed?: boolean }</code></td><td>—</td><td>下级能不能折叠。不传时，有下级就能折；传 <code>false</code> 则一直展开。写成对象可以设初始状态或者受控状态。</td></tr>
</tbody></table>
</div>

## 事件

- `click(event: MouseEvent)`：点击这一行时触发。禁用的项会先挡掉默认行为，也不会触发事件。

## 插槽

- `default`：下级导航项。有下级的行会把它收成一个分组。
- `icon`：文字前面的图标元素，和 `iconClass` 二选一。
- `selectedIcon`：选中时的图标元素，不写就用 `icon`。
- `end`：这一行末尾的内容，例如徽标或计数。
