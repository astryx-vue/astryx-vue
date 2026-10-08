---
layout: component-docs
title: 悬浮卡片
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="HoverCard 属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>content</code></td><td><code>string</code></td><td><code>''</code></td><td>卡片的纯文本内容。需要富内容时改用 <code>content</code> 插槽。</td></tr>
<tr><td><code>placement</code></td><td><code>'above' | 'below' | 'start' | 'end'</code></td><td><code>'above'</code></td><td>卡片相对触发元素的方向。所选方向空间不足时自动翻转到相反方向。</td></tr>
<tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'center'</code></td><td>卡片沿位置方向的对齐方式。</td></tr>
<tr><td><code>delay</code></td><td><code>number</code></td><td><code>300</code></td><td>悬停后显示前的等待时间（毫秒）。</td></tr>
<tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>指针或焦点离开后隐藏前的等待时间（毫秒）。指针在这段时间内移入卡片会取消隐藏。</td></tr>
<tr><td><code>focusTrigger</code></td><td><code>'auto' | 'always' | 'never'</code></td><td><code>'auto'</code></td><td>聚焦时是否打开卡片：auto 仅在触发元素本身可聚焦时监听，always 始终监听，never 从不监听。</td></tr>
<tr><td><code>touchTrigger</code></td><td><code>'auto' | 'tap' | 'none'</code></td><td><code>'auto'</code></td><td>触摸设备上轻点触发元素的行为：auto 时本身不执行操作的触发元素轻点即打开，按钮和链接保留自己的轻点；tap 总是打开；none 不打开。轻点打开的卡片在卡片外轻点即关闭。</td></tr>
<tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否启用悬停与聚焦触发。为 false 时已打开的卡片也会关闭。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>卡片弹出层的无障碍名称。提供时卡片以具名的 <code>role="dialog"</code> 暴露，省略时为 <code>role="group"</code>。</td></tr>
<tr><td><code>hasHoverIndication</code></td><td><code>'auto' | boolean</code></td><td><code>'auto'</code></td><td>是否在触发元素上显示虚线底划线。auto 时仅对纯文字触发元素生效。</td></tr>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>受控显示状态。设置后悬停与聚焦不再触发卡片。</td></tr>
<tr><td><code>isDefaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否在挂载时就显示卡片。仅在未设置 isOpen 时生效。</td></tr>
</tbody></table>
</div>

## 事件

- `openChange(isOpen: boolean)`：卡片显示或隐藏时触发。受控模式下按 Escape 会发出 `false`，由父组件决定是否关闭。

## 插槽

<div class="component-api-table" role="region" aria-label="HoverCard 插槽" tabindex="0">
<table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>触发元素。纯文字内容会获得虚线下划线并变为可聚焦；元素内容作为触发元素接收事件与 ARIA 属性。</td></tr>
<tr><td><code>content</code></td><td>卡片内容，支持任意富内容。提供时替代 <code>content</code> 属性。</td></tr>
</tbody></table>
</div>

## 方法

- `show()`：立即显示卡片，跳过悬停延迟。
- `hide()`：立即隐藏卡片。
- `element`：卡片浮层元素，或尚未挂载时的 `null`。

## 原生属性

组件渲染为片段：触发元素包裹层 `<span class="astryx-hover-card__trigger">`，加上一个传送到 `body` 的浮层。传入的属性会落到包裹层上，浮层不接收属性。

- HTML 属性、`aria-*` 属性、`data-*` 属性、`class`、`style` 都会落到包裹层。
- 包裹层在元素作为触发元素时是 `display: contents` 的透明盒子，在纯文字触发元素时是 `display: inline` 的触发元素本身。因此布局相关的属性请直接写在触发元素上，纯文字触发元素则可以直接写在组件上。
- 组件自己管理的 `aria-haspopup`、`aria-controls`、`aria-expanded`、`aria-describedby` 写在真正的触发元素上，并在卸载时恢复原值。

## 主题

```css
.my-hover-card {
  --astryx-hover-card-background: #fff;
  --astryx-hover-card-foreground: #171717;
}
```

- `--astryx-hover-card-background`：卡片背景色。
- `--astryx-hover-card-foreground`：卡片文字颜色。
- `--astryx-hover-card-shadow`：卡片阴影。
- `--astryx-hover-card-radius`：卡片圆角，默认继承 `--astryx-radius-container`。
- `--astryx-hover-card-indication-color`：虚线下划线颜色。
- `--astryx-hover-card-z-index`：卡片的层叠顺序。
