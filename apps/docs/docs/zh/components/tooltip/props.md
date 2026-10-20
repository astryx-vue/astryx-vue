---
layout: component-docs
title: 提示框
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Tooltip 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>content</code></td><td><code>string</code></td><td>—</td><td>提示文字。需要展示富文本时，改用 <code>content</code> 插槽。</td></tr>
<tr><td><code>placement</code></td><td><code>'above' | 'below' | 'start' | 'end'</code></td><td><code>'above'</code></td><td>提示相对触发元素的方向。所选方向空间不足时会自动翻转。</td></tr>
<tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'center'</code></td><td>气泡沿位置方向的对齐方式：靠起始端、居中或靠末端。</td></tr>
<tr><td><code>delay</code></td><td><code>number</code></td><td><code>200</code></td><td>悬停或聚焦后，提示显示前的等待时间（毫秒）。</td></tr>
<tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>0</code></td><td>鼠标或焦点离开后，提示隐藏前的等待时间（毫秒）。为 0 时使用 100 毫秒，给鼠标移入气泡留出时间。</td></tr>
<tr><td><code>focusTrigger</code></td><td><code>'auto' | 'always' | 'never'</code></td><td><code>'auto'</code></td><td>聚焦时是否显示提示：auto 仅在触发元素本身可聚焦时监听，always 始终监听，never 从不监听。</td></tr>
<tr><td><code>touchTrigger</code></td><td><code>'auto' | 'tap' | 'none'</code></td><td><code>'auto'</code></td><td>触摸设备上点击触发元素时的行为：auto 时点击切换提示，但按钮、链接和表单控件自身的点击不触发；tap 总是切换；none 不打开。</td></tr>
<tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否启用提示。为 false 时禁用悬停与聚焦触发。</td></tr>
<tr><td><code>hasHoverIndication</code></td><td><code>'auto' | boolean</code></td><td><code>'auto'</code></td><td>是否在纯文字触发元素上显示虚线下划线。auto 时仅对纯文字触发元素生效。</td></tr>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>受控显示状态。设置后悬停与聚焦不再触发提示。</td></tr>
<tr><td><code>isDefaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否在挂载时就显示提示。仅在未设置 isOpen 时生效。</td></tr>
<tr><td><code>anchorsOnSelf</code></td><td><code>boolean</code></td><td><code>false</code></td><td>不再包一层 span，插槽的根元素自己当触发器。标题和段落必须这样用。</td></tr>
<tr><td><code>anchor</code></td><td><code>HTMLElement | null</code></td><td>—</td><td>用外部元素当触发器。这时不渲染外层 span，默认插槽可以不写，悬停、聚焦和 <code>aria-describedby</code> 都挂到该元素上。</td></tr>
</tbody></table>
</div>

## 事件

- `openChange(isOpen: boolean)`：提示显示或隐藏时触发。受控模式下，按 Escape 会发出 `false`，由父组件决定是否关闭。

## 插槽

- `default`：触发元素。
- `content`：富文本提示内容。会替代 `content` 属性的文字。

## 主题

```css
.my-tooltip {
  --astryx-tooltip-background: #000;
  --astryx-tooltip-foreground: #fff;
}
```

- `--astryx-tooltip-background`：气泡背景色。
- `--astryx-tooltip-foreground`：气泡文字颜色。
- `--astryx-tooltip-indication-color`：虚线下划线颜色。
- `--astryx-tooltip-z-index`：气泡的层叠顺序。
