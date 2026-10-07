---
layout: component-docs
title: 纯图标按钮
outline: false
footer: false
---

## IconButton Props

IconButton 继承 Button 的大部分属性，但不提供 <code>isIconOnly</code>，因为它始终是纯图标模式。

<div class="component-api-table" role="region" aria-label="IconButton Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>按钮的无障碍名称。</td></tr>
      <tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'ghost' | 'destructive'</code></td><td><code>'secondary'</code></td><td>按钮外观与操作类型。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>正方形按钮尺寸。</td></tr>
      <tr><td><code>elevation</code></td><td><code>'none' | 'low' | 'med' | 'high'</code></td><td><code>'none'</code></td><td>独立悬浮按钮的静止阴影深度。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用交互。存在 tooltip 时，组件使用 aria-disabled 保留焦点。</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示加载图标。设置 aria-busy。默认阻止重复操作。</td></tr>
      <tr><td><code>isInterruptible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>加载期间可以再次触发 clickAction。</td></tr>
      <tr><td><code>clickAction</code></td><td><code>(event: MouseEvent) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>返回 Promise 时，组件显示加载状态。</td></tr>
      <tr><td><code>tooltip</code></td><td><code>string</code></td><td>—</td><td>悬停或键盘聚焦时显示的补充提示。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>存在且未禁用时，把根元素渲染为链接。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>按钮宽度。数字转换为像素，CSS 字符串按原样使用。</td></tr>
    </tbody>
  </table>
</div>

其他继承属性如下。完整说明见 [Button 属性](/components/button/props)。

- `type`。
- `name`。
- `value`。
- `form`。
- `loadingLabel`。
- `as`。
- `target`。
- `rel`。

## 插槽

- 默认插槽为必需项。
- 默认插槽必须提供一个表示操作的图标。
- `IconButton` 不提供可见文字。
- `IconButton` 不提供 `end` 插槽。

:::warning 无障碍名称
必须提供准确的 `label`。缺少 `label` 时，辅助技术无法确定按钮用途。

`tooltip` 提供补充说明。不得用 `tooltip` 代替 `label`。
:::

## 事件

`click` 事件的参数类型为 `MouseEvent`。

## 模板引用

`IconButton` 公开 `element`。
类型为 `HTMLButtonElement | HTMLAnchorElement | HTMLElement | null`。

## 原生属性

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。
