---
layout: component-docs
title: 勾选指示器
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="勾选指示器属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>state</code></td><td><code>'unchecked' | 'checked'</code></td><td>—</td><td>必需。默认在未选中时什么都不画。替换图形可以两种状态都画。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>写到元素上。图形本身两种尺寸都是 1rem，和小图标一致。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>只改变外观。选中的图形用禁用色。禁用的语义留在外面的行上。</td></tr>
</tbody></table>
</div>

## 插槽

- 默认插槽在每种状态都替换标记，选中与否都一样。宿主用它传入等待中的转圈。
- 插槽里有可渲染内容时，用 1rem 的盒子占住位置。
- 没有可渲染内容时，未选中的勾不渲染。用 isRenderable 判断。条件为假时不能把已选中的勾删掉。
- 插槽内容只作装饰。不要放可聚焦控件。

## 无障碍

- 勾被画出来，或插槽占住位置时，根元素是 `aria-hidden="true"`。
- 组件不设置交互角色，也不提供点击或键盘行为。
- 传入的角色、Tab 顺序、可编辑属性，以及以 aria 开头的属性会被丢掉。
- 未选中且插槽为空时，暴露的元素为空。

## 主题

没有外框类。选中的勾就是图标本身。插槽占位是 `.astryx-check-indicator`，宽高 1rem。

- 选中用强调色图标，禁用用禁用色。
- `data-size` 是 sm 或 md。
- 行禁用时设置 `data-disabled`。
