---
layout: component-docs
title: 分隔线
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Divider 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>分隔线方向。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>显示在分隔线中间的文字。同时作为无障碍名称。</td></tr>
<tr><td><code>variant</code></td><td><code>'subtle' | 'strong'</code></td><td><code>'subtle'</code></td><td>线条强弱。strong 使用强调边框色。</td></tr>
<tr><td><code>isFullBleed</code></td><td><code>boolean</code></td><td><code>false</code></td><td>使用负外边距延伸到容器边缘。</td></tr>
</tbody></table>
</div>

## 插槽

- `label`：分隔线中间的富文本内容。会替代 `label` 属性的文字。

## 主题

```css
.my-divider {
  --astryx-divider-color-subtle: #00000014;
}
```

- `--astryx-divider-color-subtle`：`subtle` 线条颜色。
- `--astryx-divider-color-strong`：`strong` 线条颜色。
- `--astryx-divider-label-color`：文字颜色。
- `--astryx-border-width`：线条粗细。
