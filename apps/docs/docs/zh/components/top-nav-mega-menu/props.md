---
layout: component-docs
title: 顶部导航大菜单
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TopNavMegaMenu 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>触发按钮上显示的文字。必填。</td></tr>
<tr><td><code>showDelay</code></td><td><code>number</code></td><td><code>150</code></td><td>鼠标移上去之后，等多少毫秒才展开面板。</td></tr>
<tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>250</code></td><td>鼠标移开之后，等多少毫秒才收起面板。</td></tr>
</tbody></table>
</div>

## 事件

- `openChange(isOpen: boolean)`：面板展开或收起时触发。想把外层样式跟展开状态绑在一起时用它。

## 插槽

- `default`：面板里的链接，一般写 `TopNavMegaMenuItem`，写别的内容也可以。
- `featured`：推荐内容。桌面上面板排在右侧，手机抽屉里排在链接下面。
