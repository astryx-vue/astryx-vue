---
layout: component-docs
title: 对话框
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Dialog 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>对话框是否打开。必填。</td></tr>
<tr><td><code>isInline</code></td><td><code>boolean</code></td><td><code>false</code></td><td>以普通文档流渲染内容，不使用模态对话框、遮罩与焦点行为。仅用于文档预览。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td><code>400</code></td><td>首选宽度。数字单位为像素。窄屏时夹取到视口内。全屏变体忽略此项。</td></tr>
<tr><td><code>maxHeight</code></td><td><code>number | string</code></td><td><code>'75vh'</code></td><td>最大高度。数字单位为像素。全屏变体忽略此项。</td></tr>
<tr><td><code>position</code></td><td><code>DialogPosition</code></td><td>居中</td><td>静态偏移：<code>top</code>、<code>bottom</code>、<code>start</code>、<code>end</code>。逻辑属性 <code>start</code> 与 <code>end</code> 在 RTL 下镜像。全屏变体忽略此项。</td></tr>
<tr><td><code>variant</code></td><td><code>'standard' | 'fullscreen'</code></td><td><code>'standard'</code></td><td>标准对话框，或占满视口的对话框。</td></tr>
<tr><td><code>purpose</code></td><td><code>'required' | 'form' | 'info'</code></td><td><code>'info'</code></td><td><code>required</code> 禁用 Escape 与点击遮罩关闭；<code>form</code> 仅允许 Escape；<code>info</code> 两者都允许。</td></tr>
<tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td>主题默认值（16px）</td><td>内边距，对应 <code>--astryx-spacing-*</code> 令牌。</td></tr>
</tbody></table>
</div>

## 事件

- `openChange(isOpen: boolean)`：用户通过 Escape 或点击遮罩请求关闭时以 `false` 触发，是否触发取决于 `purpose`。父组件通过设置 `isOpen` 来关闭。

## 插槽

- `default`：对话框内容。通常为 `DialogHeader`，之后是正文与操作区。

## DialogHeader 属性

<div class="component-api-table" role="region" aria-label="DialogHeader 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>对话框标题。打开时获得默认焦点，并为对话框命名。必填。</td></tr>
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>标题下方的次要文字。为空时不渲染。</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示关闭按钮，点击时发出 <code>openChange(false)</code>。</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>'Close'</code></td><td>关闭按钮的无障碍名称。</td></tr>
</tbody></table>
</div>

## DialogHeader 事件与插槽

- `openChange(isOpen: boolean)`：点击关闭按钮时以 `false` 触发。
- `startContent`：标题之前的内容，例如返回按钮。
- `endContent`：标题之后、关闭按钮之前的内容。

## useImperativeDialog

- `show(content, options?)`：以给定内容打开对话框。选项与传给 Hook 的默认选项合并。
- `hide()`：关闭对话框。
- `isOpen`：只读的打开状态。
- `Host`：在模板中渲染一次的组件。

## 主题

```css
.my-dialog {
  --astryx-dialog-background: #fff;
  --astryx-dialog-foreground: #000;
}
```

- `--astryx-dialog-background`：表面颜色。
- `--astryx-dialog-foreground`：文字颜色。
- `--astryx-dialog-overlay`：遮罩颜色。
- `--astryx-dialog-shadow`：表面阴影。
- `--astryx-dialog-padding`：未设置 `padding` 属性时的默认内边距。
- `--astryx-dialog-title-color`：标题颜色。
