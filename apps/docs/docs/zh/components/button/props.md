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
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>操作名称，同时作为按钮的无障碍名称。没有默认插槽时，它就是按钮上可见的文字。</td></tr>
      <tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'ghost' | 'destructive'</code></td><td><code>'secondary'</code></td><td>按钮的外观风格，用来表达操作的强调程度与类型。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>按钮尺寸，决定点击区域的大小。</td></tr>
      <tr><td><code>elevation</code></td><td><code>'none' | 'low' | 'med' | 'high'</code></td><td><code>'none'</code></td><td>独立浮动按钮的静止阴影深度；放入 ButtonGroup 后由组统一控制。</td></tr>
      <tr><td><code>type</code></td><td><code>'button' | 'submit' | 'reset'</code></td><td><code>'button'</code></td><td>原生 button 元素的类型，常用于表单内的提交与重置。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单提交时携带的名称。</td></tr>
      <tr><td><code>value</code></td><td><code>string | number | readonly string[]</code></td><td>—</td><td>表单提交时随名称一并提交的值。</td></tr>
      <tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>要关联的表单 ID。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用，禁用后不再响应交互。存在 tooltip 时改用 aria-disabled，让按钮保留焦点。</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示加载状态：展示加载图标并设置 aria-busy，同时默认阻止重复操作。</td></tr>
      <tr><td><code>isInterruptible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>加载期间是否允许再次触发 clickAction。</td></tr>
      <tr><td><code>clickAction</code></td><td><code>(event: MouseEvent) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>点击时执行的动作。返回 Promise 时，组件自动进入并退出加载状态。</td></tr>
      <tr><td><code>isIconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否只显示 icon 插槽的内容，操作名称仍由 label 提供给辅助技术。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>按钮宽度。数字按像素处理，CSS 字符串按原样使用。</td></tr>
      <tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>'Loading'</code></td><td>加载文字，用于加载图标与实时区域，建议按应用语言本地化。</td></tr>
      <tr><td><code>tooltip</code></td><td><code>string</code></td><td>—</td><td>补充提示，悬停或键盘聚焦时显示。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>存在且未禁用时，根元素渲染为链接。</td></tr>
      <tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'a'</code></td><td>href 模式下使用的自定义 Vue 链接组件，可同时接收 href 和 to。</td></tr>
      <tr><td><code>target</code></td><td><code>string</code></td><td>—</td><td>链接的浏览上下文，如 <code>_blank</code>。</td></tr>
      <tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>链接的关系属性。</td></tr>
    </tbody>
  </table>
</div>

## 异步操作

`clickAction` 让组件感知异步流程：

- `@click` 始终先于 `clickAction` 触发。
- 在 `@click` 中调用 `event.preventDefault()` 时，组件会跳过 `clickAction`，适合用它拦截操作。
- `clickAction` 返回 Promise 时，组件立即进入加载状态。
- Promise 成功或失败后，组件自动清除加载状态。
- 错误处理交给应用：`clickAction` 中产生的异常需要由应用自行捕获。

### 重复触发

- `isInterruptible` 默认为 `false`，加载期间的再次点击会被忽略。
- 设为 `true` 后，加载期间可以继续触发，多个操作并行执行。
- 组件不会取消之前尚未完成的 Promise；如果需要取消旧请求，请在应用侧调用 `AbortController.abort()`。

## Button 插槽

<div class="component-api-table" role="region" aria-label="Button 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>可选的默认内容，用来覆盖 label 渲染的可见文字；无障碍名称仍由 label 提供。</td></tr>
      <tr><td><code>icon</code></td><td>渲染在标签前的装饰图标。</td></tr>
      <tr><td><code>end</code></td><td>渲染在标签后的徽标、图标等简短装饰内容，纯图标模式下不显示。</td></tr>
    </tbody>
  </table>
</div>

## Button 事件

<div class="component-api-table" role="region" aria-label="Button 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>click</code></td><td><code>MouseEvent</code></td><td>可取消的点击事件。按钮处于禁用状态，或加载期间阻止重复操作时，不会触发。</td></tr>
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
