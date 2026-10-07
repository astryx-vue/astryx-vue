---
layout: component-docs
title: 提示条
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="属性列表" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>status</code></td><td><code>&#x27;info&#x27; | &#x27;success&#x27; | &#x27;warning&#x27; | &#x27;error&#x27;</code></td><td>—</td><td>必需。消息状态。</td></tr>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>必需。消息标题。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标题下方的说明。</td></tr>
<tr><td><code>icon</code></td><td><code>Component</code></td><td>—</td><td>自定义装饰图标。</td></tr>
<tr><td><code>isDismissable</code></td><td><code>boolean</code></td><td>false</td><td>显示关闭按钮。关闭后组件自行隐藏。</td></tr>
<tr><td><code>dismissLabel</code></td><td><code>string</code></td><td>Dismiss {title}</td><td>关闭按钮的无障碍名称。</td></tr>
<tr><td><code>container</code></td><td><code>&#x27;card&#x27; | &#x27;section&#x27;</code></td><td>card</td><td>card 使用圆角。section 使用直角。</td></tr>
<tr><td><code>elevation</code></td><td><code>&#x27;none&#x27; | &#x27;low&#x27; | &#x27;med&#x27; | &#x27;high&#x27;</code></td><td>none</td><td>整体阴影层级。</td></tr>
<tr><td><code>collapsible</code></td><td><code>boolean</code></td><td>true</td><td>默认插槽内容是否可折叠。</td></tr>
<tr><td><code>defaultIsOpen</code></td><td><code>boolean</code></td><td>false</td><td>未绑定 isOpen 时的初始展开状态。</td></tr>
<tr><td><code>v-model:isOpen</code></td><td><code>boolean</code></td><td>—</td><td>由父组件控制展开状态。</td></tr>
<tr><td><code>expandLabel</code></td><td><code>string</code></td><td>Expand details</td><td>展开按钮的无障碍名称。</td></tr>
<tr><td><code>collapseLabel</code></td><td><code>string</code></td><td>Collapse details</td><td>收起按钮的无障碍名称。</td></tr>
</tbody></table>
</div>

## 插槽

- 默认插槽：标题区域下方的详情。
- `title`：替换标题的视觉内容。仍需提供 `title` 属性。
- `description`：替换说明文本。
- `icon`：替换状态图标。图标仅作装饰。
- `end`：标题区域末尾的操作按钮。

标题、说明和详情插槽可包含块级内容。

## 展开与收起

- 默认插槽有内容时，组件显示展开按钮。
- 默认从收起状态开始。
- `defaultIsOpen` 只设置初始状态。
- `v-model:isOpen` 控制当前状态。
- `collapsible` 为 `false` 时，详情始终显示。
- 收起时，详情内容卸载。
- 父组件收起详情时，若焦点在详情内，焦点返回展开按钮。

```vue
<Banner v-model:is-open="open" status="info" title="Configuration changes">
  <p>Review the updated settings before continuing.</p>
</Banner>
```

## 关闭

- `isDismissable` 显示关闭按钮。
- 点击关闭后，组件自行隐藏。
- 组件触发 `dismiss` 事件。
- 关闭时，组件尝试将焦点返回进入提示前的元素。
- 需要再次显示时，重新挂载组件或改变 `key`。

## 事件与模板引用

- `update:isOpen(value)`：请求更新展开状态。
- `dismiss()`：关闭提示。
- `element`：根元素的 `HTMLDivElement | null`。关闭后为 `null`。

## 本地化

中文界面可设置以下文本：

- `dismissLabel="关闭提示"`。
- `expandLabel="展开详情"`。
- `collapseLabel="收起详情"`。

## 主题

```css
.my-banner {
  --astryx-banner-info-background: #ecfdf5;
  --astryx-banner-info-foreground: #065f46;
}
```

- `--astryx-banner-info-background`：信息背景。
- `--astryx-banner-info-foreground`：信息文字和图标。
- `--astryx-banner-success-background`：成功背景。
- `--astryx-banner-success-foreground`：成功文字和图标。
- `--astryx-banner-warning-background`：警告背景。
- `--astryx-banner-warning-foreground`：警告文字和图标。
- `--astryx-banner-error-background`：错误背景。
- `--astryx-banner-error-foreground`：错误文字和图标。
- `--astryx-banner-content-background`：详情区域背景。
- `--astryx-banner-border`：详情区域边框。
- `--astryx-radius-container`：card 容器圆角。

Neutral 自动适配明暗模式。
