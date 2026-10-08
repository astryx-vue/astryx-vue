---
layout: component-docs
title: 加载态
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Spinner 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg' | 'xl'</code></td><td><code>'md'</code></td><td>圆环的直径，sm 为 10px，md 为 14px，lg 为 18px，xl 为 28px。</td></tr>
<tr><td><code>shade</code></td><td><code>'default' | 'subtle' | 'onMedia' | 'inherit'</code></td><td><code>'default'</code></td><td>圆环的配色层级，分别面向浅色背景、深色背景或继承周围文字颜色的场景。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>显示在加载态下方的文字，同时作为无障碍名称供屏幕阅读器播报。</td></tr>
</tbody></table>
</div>

## 插槽

- `label`：加载态下方的富文本内容，会替代 `label` 属性的文字。未提供文字时，无障碍名称默认为 `Loading`。

## 主题

```css
.my-spinner {
  --astryx-spinner-color-accent: #0074e2;
}
```

- `--astryx-spinner-diameter-{sm|md|lg|xl}`：各尺寸的环直径。
- `--astryx-spinner-stroke-width-{sm|md|lg|xl}`：各尺寸的描边宽度。
- `--astryx-spinner-arc-fraction`：运动圆弧覆盖圆环的比例。
- `--astryx-spinner-color-accent`：`default` 色调的圆弧颜色。
- `--astryx-spinner-color-subtle`：`subtle` 色调的圆弧颜色。
- `--astryx-spinner-color-track`：`default` 和 `subtle` 色调的轨道颜色。
- `--astryx-spinner-color-on-dark`：`onMedia` 色调的圆弧与轨道颜色。
- `--astryx-spinner-group-gap`：圆环与文字之间的间距。
- `--astryx-spinner-label-color`：文字颜色。
