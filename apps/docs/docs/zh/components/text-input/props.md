---
layout: component-docs
title: 文本输入框
outline: false
footer: false
---

## TextInput Props

<div class="component-api-table" role="region" aria-label="TextInput Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>string</code></td><td>必需</td><td>输入值。通常使用 v-model。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>可见标签。隐藏时仍为控件提供名称。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>视觉上隐藏标签和说明，保留无障碍关联。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方、控件上方的补充说明。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用输入框。禁用字段不参与表单提交。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示可选提示。与 isRequired 同时设置时优先。</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示必填提示。TextInput 同时设置 aria-required。</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>标签前的 Vue 图标组件。labelIcon 插槽优先。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁的信息按钮，支持悬停、键盘聚焦和点击。</td></tr>
      <tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>可选提示的本地化文字。</td></tr>
      <tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>必填提示的本地化文字。</td></tr>
      <tr><td><code>id</code></td><td><code>string</code></td><td>自动生成</td><td>原生 input 的 ID，同步更新标签与说明关联。</td></tr>
      <tr><td><code>type</code></td><td><code>&#x27;text&#x27; | &#x27;password&#x27; | &#x27;email&#x27;</code></td><td>text</td><td>单行输入类型。多行内容应使用 textarea。</td></tr>
      <tr><td><code>size</code></td><td><code>&#x27;sm&#x27; | &#x27;md&#x27; | &#x27;lg&#x27;</code></td><td>md</td><td>Neutral 主题的高度分别为 28、32、36px。</td></tr>
      <tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>不能编辑，但保留焦点、正常显示并参与表单提交。</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。设置后使用 aria-disabled 和 readonly 保留焦点，仍阻止修改和提交该字段。</td></tr>
      <tr><td><code>startIcon</code></td><td><code>Component</code></td><td>—</td><td>输入框前端的装饰图标。icon 插槽优先。</td></tr>
      <tr><td><code>status</code></td><td><code>TextInputStatus</code></td><td>—</td><td>error、warning 或 success，可附带 message 和 messageId。错误设置 aria-invalid。</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>&#x27;attached&#x27; | &#x27;detached&#x27; | &#x27;tooltip&#x27;</code></td><td>attached</td><td>状态消息紧贴、分离或显示在图标提示中。三种方式均关联输入框。</td></tr>
      <tr><td><code>changeAction</code></td><td><code>(value: string, event: TextInputChangeEvent) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>值变化后运行。返回 Promise 时，组件显示加载状态。</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>控制外部加载状态。异步操作未结束时也显示加载状态。输入保持可编辑。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>空值提示，不能替代 label。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>auto</td><td>整个字段的宽度。数字表示像素，CSS 字符串按原样使用。</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td>false</td><td>非空且可编辑时显示清除按钮，清除后恢复输入框焦点。</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>挂载后聚焦原生 input。</td></tr>
      <tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>原生 name。优先于传入的 name。禁用时移除。</td></tr>
      <tr><td><code>autoComplete</code></td><td><code>string</code></td><td>—</td><td>原样传入原生 autocomplete。</td></tr>
      <tr><td><code>clearLabel</code></td><td><code>string</code></td><td>Clear {label}</td><td>清除按钮的本地化名称。</td></tr>
      <tr><td><code>loadingLabel</code></td><td><code>string</code></td><td>Loading</td><td>加载图标的本地化名称。</td></tr>
    </tbody>
  </table>
</div>

## 状态类型

```ts
interface TextInputStatus {
  type: 'error' | 'warning' | 'success'
  message?: string
  messageId?: string
}
```

## TextInput 插槽

<div class="component-api-table" role="region" aria-label="TextInput 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>前端装饰图标，覆盖 startIcon。不要放入可交互控件。</td></tr>
      <tr><td><code>end</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>尾部内容，可以放按钮。使用方负责其无障碍名称。</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>标签前的装饰图标，覆盖 labelIcon 属性。</td></tr>
    </tbody>
  </table>
</div>

## TextInput 事件

<div class="component-api-table" role="region" aria-label="TextInput 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: string</code></td><td>—</td><td>v-model 更新。先于 change 与 changeAction。</td></tr>
      <tr><td><code>change</code></td><td><code>value: string, event: TextInputChangeEvent</code></td><td>—</td><td>每次有效修改与清除后触发。event.preventDefault() 只阻止 changeAction，不撤回 v-model 更新。</td></tr>
      <tr><td><code>enter</code></td><td><code>event: KeyboardEvent</code></td><td>—</td><td>非输入法提交的 Enter。keydown 被取消时不触发。</td></tr>
      <tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>—</td><td>原生按键事件。调用 preventDefault() 可阻止 enter。</td></tr>
      <tr><td><code>clear</code></td><td><code>event: MouseEvent</code></td><td>—</td><td>清除按钮被激活后触发。仍会发出 update:modelValue 和 change，并运行未取消的 action。</td></tr>
      <tr><td><code>actionError</code></td><td><code>error: unknown, value: string, event: TextInputChangeEvent</code></td><td>—</td><td>同步异常或 Promise 拒绝后触发。组件自动清除该操作的加载状态。</td></tr>
    </tbody>
  </table>
</div>

## TextInputChangeEvent

```ts
type TextInputChangeEvent = CustomEvent<{
  value: string
  originalEvent: Event
}>
```

- 原生 `input` 事件通常无法取消。
- `change` 提供可以取消的组件事件。
- `event.detail.value` 保存修改后的值。
- `event.detail.originalEvent` 保存原始事件。
- `changeAction` 和 `actionError` 接收同一个组件事件。

原始事件的类型取决于操作：

| 操作 | 类型 |
| --- | --- |
| 输入文字 | `InputEvent` |
| 提交输入法候选词 | `CompositionEvent` |
| 点击清除按钮 | `MouseEvent` |

## 异步操作

`changeAction` 接收修改后的值和组件事件。返回 Promise 时，组件会显示加载状态。

- **输入**：保存期间仍可编辑。清除内容也会运行 `changeAction`。
- **加载状态**：存在未完成的操作时，`aria-busy` 为 `true`。所有操作结束后清除加载状态，失败的操作也会计入。
- **值更新**：父组件传入的新值优先于组件临时显示的值。
- **并发保存**：由应用取消旧请求或检查请求序号，避免过期结果覆盖新值。
- **失败处理**：通过 `@action-error` 展示错误。需要回滚时，由应用更新 `v-model` 绑定值。

## 模板引用

模板引用公开以下属性和方法：

- `element: HTMLInputElement | null`：原生输入元素。挂载前为 `null`。
- `focus(options?: FocusOptions)`：聚焦输入框。
- `blur()`：移除输入框焦点。
- `select()`：选中全部输入内容。

## 原生属性

- `maxlength`、`minlength`、`pattern`、`required`、`form`、`aria-*`、`data-*` 和原生事件监听器传入原生 `input`。
- `class` 和 `style` 作用于输入框外层。`width` 作用于整个 `Field`。
- `value`、`type`、`disabled`、`readonly`、`autofocus` 与核心 ARIA 状态由组件管理，请使用对应的组件属性。
- `aria-describedby` 和 `aria-labelledby` 会与组件内部的关联 ID 合并。

### 禁用与只读

- **禁用且无原因说明**：使用原生 `disabled`，无法编辑、聚焦或提交该字段。
- **禁用且有 `disabledMessage`**：使用 `aria-disabled` 和 `readonly` 保留焦点，以便查看原因。同时移除 `name`，阻止修改和清除。
- **只读**：保留焦点，允许复制，值仍包含在 `FormData` 中。
- 同时设置禁用和只读时，禁用优先。

## 主题

为组件添加类名，即可覆盖主题变量：

```vue
<TextInput v-model="email" class="my-input" label="邮箱" />
```

```css
.my-input {
  --astryx-input-focus: #10b981;
  --astryx-radius-element: 8px;
}
```

### 外观与尺寸

- `--astryx-input-background`：输入框背景色。
- `--astryx-input-border`：默认边框色。
- `--astryx-input-focus`：无校验状态时的焦点边框色。
- `--astryx-radius-element`：输入框圆角。
- `--astryx-input-height-sm`：小尺寸高度，Neutral 默认 `28px`。
- `--astryx-input-height-md`：中尺寸高度，Neutral 默认 `32px`。
- `--astryx-input-height-lg`：大尺寸高度，Neutral 默认 `36px`。

### 校验状态

每种状态提供三个变量，分别控制边框与图标、消息文字、消息背景：

- **错误**：`--astryx-input-error`、`--astryx-input-error-foreground`、`--astryx-input-error-background`。
- **警告**：`--astryx-input-warning`、`--astryx-input-warning-foreground`、`--astryx-input-warning-background`。
- **成功**：`--astryx-input-success`、`--astryx-input-success-foreground`、`--astryx-input-success-background`。

在包含整个字段的父元素上覆盖状态变量，可同时调整输入框和状态消息。

### 明暗模式

- Neutral 根据 CSS `color-scheme` 自动选择配色。
- 在根元素或主题容器上设置 `data-astryx-color-mode="light"`，可固定使用浅色模式。
- 设置 `data-astryx-color-mode="dark"`，可固定使用暗色模式。
