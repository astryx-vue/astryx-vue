---
layout: component-docs
title: 弹出层
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Popover 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>placement</code></td><td><code>'above' | 'below' | 'start' | 'end'</code></td><td><code>'below'</code></td><td>浮层相对触发元素的方向。所选方向空间不足时会自动翻转。</td></tr>
<tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'start'</code></td><td>浮层沿位置方向的对齐方式：靠起始端、居中或靠末端。</td></tr>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>受控显示状态。未设置时，开合由触发元素自行管理。</td></tr>
<tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否启用。为 false 时触发元素无法打开浮层。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>触发元素宽度</td><td>浮层宽度，数字单位为像素。未设置时最小与触发元素等宽，最大为 320px，且不超出视口。</td></tr>
<tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td><code>3</code></td><td>浮层内边距，取值对应 <code>--astryx-spacing-*</code> 令牌。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>浮层作为对话框时的无障碍名称，<code>role</code> 为 <code>dialog</code> 时应提供。</td></tr>
<tr><td><code>role</code></td><td><code>'dialog' | 'none'</code></td><td><code>'dialog'</code></td><td>浮层的语义角色：包含交互内容时使用 <code>dialog</code>；内容自带角色（例如菜单）时使用 <code>none</code>。</td></tr>
<tr><td><code>isModal</code></td><td><code>boolean</code></td><td><code>true</code></td><td>浮层打开期间将 Tab 焦点限制在浮层内。仅对 <code>dialog</code> 角色生效。</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示关闭按钮。关闭按钮在获得焦点前保持视觉隐藏。</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>'Close'</code></td><td>关闭按钮的文字，同时作为它的无障碍名称。</td></tr>
<tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>打开时是否把焦点移入浮层。仅对 <code>dialog</code> 角色生效。</td></tr>
<tr><td><code>hasLightDismiss</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否允许点击浮层与触发元素以外的区域来关闭。</td></tr>
<tr><td><code>hasEscapeDismiss</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否允许按下 Escape 关闭浮层。</td></tr>
</tbody></table>
</div>

## 事件

- `openChange(isOpen: boolean)`：浮层打开或关闭时触发，包括用户主动关闭。

## 插槽

- `default`：触发元素。请使用 `button` 或带有 `role="button"` 的元素。
- `content`：浮层内容。

## 主题

```css
.my-popover {
  --astryx-popover-background: #fff;
  --astryx-popover-foreground: #000;
}
```

- `--astryx-popover-background`：浮层背景色。
- `--astryx-popover-foreground`：浮层文字颜色。
- `--astryx-popover-shadow`：浮层阴影。
- `--astryx-popover-z-index`：浮层的层叠顺序。
