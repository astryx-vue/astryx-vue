---
layout: component-docs
title: 按钮
outline: false
footer: false
---

## Button Props

<div class="component-api-table" role="region" aria-label="Button Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>操作名称。没有默认插槽时同时作为可见文字。</td></tr>
      <tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'ghost' | 'destructive'</code></td><td><code>'secondary'</code></td><td>按钮外观与操作类型。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>按钮尺寸。</td></tr>
      <tr><td><code>elevation</code></td><td><code>'none' | 'low' | 'med' | 'high'</code></td><td><code>'none'</code></td><td>独立浮动按钮的静止阴影深度。组内由 ButtonGroup 统一控制。</td></tr>
      <tr><td><code>type</code></td><td><code>'button' | 'submit' | 'reset'</code></td><td><code>'button'</code></td><td>原生按钮类型。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单提交名称。</td></tr>
      <tr><td><code>value</code></td><td><code>string | number | readonly string[]</code></td><td>—</td><td>表单提交值。</td></tr>
      <tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>关联表单的 ID。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用交互。存在 tooltip 时，组件使用 aria-disabled 保留焦点。</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示加载图标。设置 aria-busy。默认阻止重复操作。</td></tr>
      <tr><td><code>isInterruptible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>加载期间可以再次触发 clickAction。</td></tr>
      <tr><td><code>clickAction</code></td><td><code>(event: MouseEvent) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>返回 Promise 时，组件显示加载状态。</td></tr>
      <tr><td><code>isIconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>只显示 icon 插槽，并用 label 命名按钮。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>按钮宽度。数字转换为像素，CSS 字符串按原样使用。</td></tr>
      <tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>'Loading'</code></td><td>加载图标和实时区域使用的本地化文字。</td></tr>
      <tr><td><code>tooltip</code></td><td><code>string</code></td><td>—</td><td>悬停或键盘聚焦时显示的补充提示。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>存在且未禁用时，把根元素渲染为链接。</td></tr>
      <tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'a'</code></td><td>href 模式使用的自定义 Vue 链接组件，同时接收 href 和 to。</td></tr>
      <tr><td><code>target</code></td><td><code>string</code></td><td>—</td><td>链接浏览上下文。</td></tr>
      <tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>链接关系属性。</td></tr>
    </tbody>
  </table>
</div>

## 异步操作

- `@click` 先于 `clickAction` 运行。
- `@click` 调用 `event.preventDefault()` 时，组件不运行 `clickAction`。
- `clickAction` 返回 Promise 时，组件进入加载状态。
- Promise 成功或失败后，组件清除加载状态。
- 应用必须在 `clickAction` 中捕获错误。

### 重复触发

- `isInterruptible` 为 `false` 时，加载期间无法再次触发操作。
- `isInterruptible` 为 `true` 时，加载期间可以再次触发操作。
- 重复触发后，多个操作并行执行。
- 组件不会取消之前的 Promise。

必须取消旧网络请求时，在应用中调用 `AbortController.abort()`。

## Button 插槽

<div class="component-api-table" role="region" aria-label="Button 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>可选的可见内容覆盖。label 仍作为稳定的无障碍名称。</td></tr>
      <tr><td><code>icon</code></td><td>标签前的装饰图标。</td></tr>
      <tr><td><code>end</code></td><td>标签后的徽标、图标或其他简短装饰内容。纯图标模式忽略。</td></tr>
    </tbody>
  </table>
</div>

## Button 事件

<div class="component-api-table" role="region" aria-label="Button 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>事件可以取消。按钮禁用或组件阻止重复操作时，不触发事件。</td></tr>
    </tbody>
  </table>
</div>

## 模板引用

`Button` 公开 `element`。
类型为 `HTMLButtonElement | HTMLAnchorElement | HTMLElement | null`。

## 原生属性

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。
