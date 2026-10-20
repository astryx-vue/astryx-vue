---
layout: component-docs
title: 顶部导航菜单
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TopNavMenu 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>触发器按钮上的文字。必填。</td></tr>
<tr><td><code>items</code></td><td><code>readonly TopNavMenuItem[]</code></td><td>—</td><td>弹出菜单里的条目。需要自定义内容时，改用默认插槽写 <code>NavMenuItem</code>。</td></tr>
<tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>悬停多久之后打开菜单，毫秒。</td></tr>
<tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>指针离开后等多久关闭菜单，毫秒。</td></tr>
</tbody></table>
</div>

## TopNavMenuItem 字段

<div class="component-api-table" role="region" aria-label="TopNavMenuItem 字段" tabindex="0">
<table><thead><tr><th>字段</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>条目文字。必填。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在文字下面的辅助说明。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>有地址时这一项渲染成链接。没有地址就是一个普通的菜单项。</td></tr>
<tr><td><code>iconClass</code></td><td><code>string</code></td><td>—</td><td>文字前面那个图标的 CSS class。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用这一项。方向键和首字母跳转会跳过它。</td></tr>
<tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>这一项的固定 key。不填就用文字。</td></tr>
</tbody></table>
</div>

## 事件

- `openChange(isOpen: boolean)`：菜单打开时传 `true`，关闭时传 `false`。

## 插槽

- `default`：额外的菜单项，例如直接写 `NavMenuItem` 元素。
