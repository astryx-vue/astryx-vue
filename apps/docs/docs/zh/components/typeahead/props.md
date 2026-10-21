---
layout: component-docs
title: 自动补全
outline: false
footer: false
---

## Typeahead Props

<div class="component-api-table" role="region" aria-label="Typeahead Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>T | null</code></td><td><code>null</code></td><td>当前选中的条目。条目至少包含 <code>id</code> 和 <code>label</code>。</td></tr>
      <tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>必需</td><td>静态或异步搜索源。空查询优先调用 <code>bootstrap</code>。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>字段标签。屏幕阅读器始终读得到。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁边信息图标里的提示文字。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>视觉上隐藏标签，读屏仍然读得到。旧名 <code>labelHidden</code> 同样可用，两者任一为真就隐藏。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code> / <code>搜索…</code></td><td>占位符。未设置语言时为英文。</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>输入停顿后再搜索。本地数据可设为 0。</td></tr>
      <tr><td><code>minQueryLength</code></td><td><code>number</code></td><td><code>1</code></td><td>够长才去搜索的下限，按人眼看到的字符数算。太短就完全不搜，下拉也不打开，免得为一个没搜过的查询显示「没有结果」。空查询不算太短，照旧走 bootstrap。</td></tr>
      <tr><td><code>hasEntriesOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>聚焦后还没输入就展示 bootstrap 结果。</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td><code>hasEntriesOnFocus</code> 的旧名。两者任一为真即生效。</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>挂载后自动聚焦输入框。</td></tr>
      <tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>下拉最多显示多少条。</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示清除按钮，用来取消当前选中值。</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>true</code></td><td><code>hasClear</code> 的旧名。任一为假就不显示按钮。</td></tr>
      <tr><td><code>emptySearchText</code></td><td><code>string | null</code></td><td><code>'No results found'</code> / <code>'未找到结果'</code></td><td>没有匹配结果时显示的文字。<code>null</code> 当作没给，退回默认；空字符串表示什么都不显示。要放链接这类富内容用 <code>empty</code> 插槽。</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string | null</code></td><td>—</td><td><code>emptySearchText</code> 的旧名。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>说明为什么被禁用。和 <code>disabled</code> 一起用时，控件改用 <code>aria-disabled</code> 加 <code>readonly</code>，因此仍然可聚焦，鼠标悬停或键盘聚焦都能读到这段说明。</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td><code>disabledMessage</code> 的旧名。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>状态样式。</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>字段下方的状态说明。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>输入框和标签的尺寸。</td></tr>
      <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标记为必填。</td></tr>
      <tr><td><code>optional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标签上显示「可选」标记。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单字段名。提交选中条目的 id。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整个字段的宽度（数字按像素算，字符串原样使用）。</td></tr>
    </tbody>
  </table>
</div>

## Typeahead Emits

<div class="component-api-table" role="region" aria-label="Typeahead Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: T | null</code></td><td>选中或清除时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: T | null</code></td><td>选中或清除时触发。</td></tr>
      <tr><td><code>changeQuery</code></td><td><code>query: string</code></td><td>查询文字变化时触发。</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td><code>changeQuery</code> 的旧名。两个都会触发。</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>列表打开或关闭时触发。</td></tr>
    </tbody>
  </table>
</div>

## Typeahead Slots

<div class="component-api-table" role="region" aria-label="Typeahead Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>输入框开头的图标。</td></tr>
      <tr><td><code>item</code></td><td><code>{ item, isActive, isSelected }</code></td><td>自定义下拉条目，替换默认的 <code>TypeaheadItem</code>。</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>自定义空状态。</td></tr>
    </tbody>
  </table>
</div>

## createStaticSource

<div class="component-api-table" role="region" aria-label="createStaticSource" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>items</code></td><td><code>T[]</code></td><td>本地条目。</td></tr>
      <tr><td><code>keywords</code></td><td><code>(item: T) =&gt; string[]</code></td><td>除 label 之外还参与子串匹配的词。</td></tr>
    </tbody>
  </table>
</div>

## 结果分组

把分组名放在 `item.auxiliaryData.group` 上。同名的条目会渲染成一个 `role="group"` 区块，前面带可见的标题，顺序按分组第一次出现的先后。没有分组名的条目留在原位。

```ts
const items = [
  { id: 'apple', label: 'Apple', auxiliaryData: { group: 'Fruit' } },
  { id: 'carrot', label: 'Carrot', auxiliaryData: { group: 'Vegetable' } },
]
```

## BaseTypeahead

没有字段标签、说明和校验文案。适合命令面板这类外面已经有标题的地方。`label` 在这里是输入框的无障碍名，外面已经有 `<label for>` 时不用传。默认下拉行是 `TypeaheadItem`，可以用 `item` 插槽换掉。

<div class="component-api-table" role="region" aria-label="BaseTypeahead Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>T | null</code></td><td><code>null</code></td><td>当前选中的条目。</td></tr>
      <tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>必需</td><td>静态或异步搜索源。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>输入框的无障碍名。</td></tr>
      <tr><td><code>inputId</code></td><td><code>string</code></td><td>自动生成</td><td>输入框的 id，好让外面的标签用 <code>for</code> 对上。</td></tr>
      <tr><td><code>describedBy</code></td><td><code>string</code></td><td>—</td><td>外面已经算好的说明和状态 id。</td></tr>
      <tr><td><code>ariaDescribedBy</code></td><td><code>string</code></td><td>—</td><td>输入框专用的 <code>aria-describedby</code> 别名，给了就盖过原生属性。</td></tr>
      <tr><td><code>ariaLabelledBy</code></td><td><code>string</code></td><td>—</td><td>输入框专用的 <code>aria-labelledby</code> 别名，给了就盖过原生属性。</td></tr>
      <tr><td><code>anchorRef</code></td><td><code>HTMLElement | null</code></td><td>—</td><td>下拉挂靠并据此量宽度的元素。不传就用输入框所在的外框。</td></tr>
      <tr><td><code>inputTabIndex</code></td><td><code>number</code></td><td>—</td><td>输入框在 Tab 序里的位置。选中值的标签盖住输入框时默认取 <code>-1</code>，免得留下看不见的停留点。</td></tr>
      <tr><td><code>isFocusableDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>让禁用的输入框改用 <code>aria-disabled</code> 加 <code>readonly</code>，仍然可聚焦，好让调用方给的禁用说明读得到。输入内容照样被挡住。</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>挂载后自动聚焦输入框。</td></tr>
      <tr><td><code>hasEntriesOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>聚焦后还没输入就展示 bootstrap 结果。</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td><code>hasEntriesOnFocus</code> 的旧名。两者任一为真即生效。</td></tr>
      <tr><td><code>minQueryLength</code></td><td><code>number</code></td><td><code>1</code></td><td>够长才去搜索的下限，按人眼看到的字符数算。太短就完全不搜，下拉也不打开。</td></tr>
      <tr><td><code>menuWidth</code></td><td><code>number</code></td><td>—</td><td>下拉想要的宽度，单位像素。窄不过锚点，再宽会被视口截住。</td></tr>
      <tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>下拉最多显示多少条。</td></tr>
      <tr><td><code>emptySearchText</code></td><td><code>string | null</code></td><td><code>'No results found'</code> / <code>'未找到结果'</code></td><td>没有匹配结果时显示的文字。<code>null</code> 退回默认，空字符串什么都不显示。</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string | null</code></td><td>—</td><td><code>emptySearchText</code> 的旧名。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code></td><td>输入框占位符。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>禁用原因。鼠标悬停会显示提示，同时作为说明被读出来，输入框仍可聚焦。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>外框的校验色。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>输入框和标签的尺寸。</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示清除按钮。</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>输入停顿后再搜索。本地数据可设为 0。</td></tr>
      <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标记为必填。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单字段名。提交选中条目的 id。</td></tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="BaseTypeahead Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: T | null</code></td><td>选中或清除时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: T | null</code></td><td>选中或清除时触发。</td></tr>
      <tr><td><code>changeQuery</code></td><td><code>query: string</code></td><td>查询文字变化时触发。</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td><code>changeQuery</code> 的旧名。两个都会触发。</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>列表打开或关闭时触发。</td></tr>
    </tbody>
  </table>
</div>

上面没列出的原生属性和事件监听会落到输入框上，所以 `@keydown`、`@focus`、`@blur` 和 `aria-*` 的用法跟普通 `<input>` 一样。`keydown` 监听先于内部键盘导航执行，调用 `event.preventDefault()` 就能跳过内部处理。

## TypeaheadItem

<div class="component-api-table" role="region" aria-label="TypeaheadItem 属性" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>item</code></td><td><code>SearchableItem</code></td><td>必需</td><td>这一行对应的搜索结果。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>盖过条目自己的说明。</td></tr>
      <tr><td><code>group</code></td><td><code>string</code></td><td>—</td><td>为了和同名属性对得上而接受；这一行自己不会画标题。分组由下拉按 <code>item.auxiliaryData.group</code> 完成。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>这一行看起来不可选。</td></tr>
      <tr><td><code>icon</code>（插槽）</td><td>—</td><td>—</td><td>标签前面的图标或头像。</td></tr>
    </tbody>
  </table>
</div>
