---
layout: component-docs
title: 顶部导航项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TopNavItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这条导航的名字，默认显示成可见文字。打开 <code>isIconOnly</code> 后改成读屏用的 <code>aria-label</code>。必填。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>要跳去的地址。</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接换成别的根组件时用，例如 <code>RouterLink</code>，它还会一并收到 <code>to</code>。只有写了地址才会用到。</td></tr>
<tr><td><code>target</code></td><td><code>string</code></td><td>—</td><td>链接的 <code>target</code>。指明在新窗口打开时，会自己补上 <code>noopener noreferrer</code>。</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>链接的 <code>rel</code>。和上面自动补的 <code>noopener noreferrer</code> 合并，不会互相顶掉。</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>文字前面那个图标，传 CSS icon 的类名，例如 <code>i-carbon-home</code>。</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是不是当前这一页。会写上 <code>aria-current="page"</code>，并套上选中样式。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用这一项。会写上 <code>aria-disabled</code>，去掉 href 和 target，让它既跳不走也点不动。</td></tr>
<tr><td><code>isIconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>只显示图标，做成一个方形的按钮，文字收进 <code>aria-label</code>。收进移动端抽屉时文字会重新显示出来。</td></tr>
<tr><td><code>size</code></td><td><code>NavItemSize</code></td><td><code>'md'</code></td><td>这一项的高和左右内边距：<code>'sm'</code> 是 28px，<code>'md'</code> 是 32px，<code>'lg'</code> 是 36px。</td></tr>
</tbody></table>
</div>

## 事件

- `click(event: MouseEvent)`：点击时触发。禁用的项会先挡掉默认行为，也不会触发事件。
