---
layout: component-docs
title: 数字输入框
outline: false
footer: false
---

## NumberInput Props

<div class="component-api-table" role="region" aria-label="NumberInput Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>number | null</code></td><td><code>null</code></td><td>当前值。空值是 <code>null</code>。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>字段标签，同时作为无障碍名称。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>''</code></td><td>占位文本。</td></tr>
      <tr><td><code>min</code></td><td><code>number | null</code></td><td>—</td><td>最小值。离开或按 Enter 时，比它小的输入收到这个值。输入过程中先标成无效。</td></tr>
      <tr><td><code>max</code></td><td><code>number | null</code></td><td>—</td><td>最大值。离开或按 Enter 时，比它大的输入收到这个值。输入过程中先标成无效。</td></tr>
      <tr><td><code>step</code></td><td><code>number | null</code></td><td><code>1</code></td><td>每次增减的步长。</td></tr>
      <tr><td><code>hasNumberSteppers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在输入框末尾显示加、减按钮。这一步不会改变值时，对应按钮置灰。</td></tr>
      <tr><td><code>isWheelEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>输入框聚焦时，滚轮是否改变值。页面滚动应该优先的场景把它关掉。</td></tr>
      <tr><td><code>isIntegerOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>只提交整数。写小数时文字留在框里，离开输入框后丢弃。键盘也切到数字键盘。</td></tr>
      <tr><td><code>formatValue</code></td><td><code>(value: number) =&gt; string</code></td><td>—</td><td>未聚焦时显示的文本，例如 <code>(v) =&gt; `${v} 件`</code>。聚焦后显示原始数字方便编辑，格式化后的文本通过 <code>aria-valuetext</code> 暴露给读屏。</td></tr>
      <tr><td><code>units</code></td><td><code>string | null</code></td><td>—</td><td>显示在输入框末尾的单位，例如 %。</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>有值时显示清除按钮。提示只说「清除」，读屏名称带字段名。清除后值为 <code>null</code>。把内容删空后离开，只有开了这个按钮才会提交 <code>null</code>，否则回到原值。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。与 <code>isDisabled</code> 一起用时，悬停或键盘聚焦会显示提示；输入框通过 <code>aria-disabled</code> 保持可聚焦，不会被移出 Tab 顺序。</td></tr>
      <tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>值照常显示、照常提交，但不能编辑。只读时方向键、滚轮、加减按钮全部关闭。和 <code>isDisabled</code> 同时设置时以禁用以准。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>字段可选。与 <code>isRequired</code> 互斥。</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>字段必填。与 <code>isOptional</code> 互斥。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标签只留给读屏，页面上不显示。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签末尾信息图标里的提示文本。</td></tr>
      <tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>标签文字前的图标。也可以用 <code>labelIcon</code> 插槽。</td></tr>
      <tr><td><code>startIcon</code></td><td><code>Component</code></td><td>—</td><td>输入框起始位置的图标。也可以用 <code>icon</code> 插槽。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整个字段的宽度，标签和状态说明一起对齐。数字按像素算，字符串原样使用，例如 <code>'100%'</code>。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success' | { type, message? }</code></td><td>—</td><td>校验状态。对象带 <code>message</code> 时，说明会显示在字段下方。</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>状态说明的呈现方式。<code>'tooltip'</code> 不显示说明框，改为从状态图标里点开。</td></tr>
      <tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>表单字段名。</td></tr>
      <tr><td><code>autoComplete</code></td><td><code>string</code></td><td>—</td><td>原生 <code>autocomplete</code> 属性。</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>挂载后自动聚焦输入框。</td></tr>
      <tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>输入框元素的 id。不传时自动生成。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>等同于 <code>isDisabled</code>。</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>等同于 <code>disabledMessage</code>。</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>等同于 <code>hasClear</code>。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>等同于 <code>htmlName</code>。</td></tr>
      <tr><td><code>containerClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到字段外壳的 class。没有外壳时不生效，开发环境会警告。在 InputGroup 和横向标签的 FormLayout 里也是这样。</td></tr>
      <tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到字段外壳的行内样式。</td></tr>
      <tr><td><code>controlClass</code></td><td><code>string | object | array</code></td><td>—</td><td>加到数字框本体的 class。直接写在组件上的 class 也落在本体，不会警告。</td></tr>
      <tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>—</td><td>加到数字框本体的行内样式。直接写在组件上的 style 也落在本体。</td></tr>
    </tbody>
  </table>
</div>

## NumberInput 事件

<div class="component-api-table" role="region" aria-label="NumberInput 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: number | null</code></td><td>值变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: number | null</code></td><td>值变化时触发。<code>null</code> 表示用户清空了输入框。</td></tr>
      <tr><td><code>focus</code></td><td><code>event: FocusEvent</code></td><td>输入框获得焦点时触发。</td></tr>
      <tr><td><code>blur</code></td><td><code>event: FocusEvent</code></td><td>输入框失去焦点时触发。</td></tr>
      <tr><td><code>enter</code></td><td><code>event: KeyboardEvent</code></td><td>在输入框里按回车时触发。</td></tr>
      <tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>输入框按键时触发，方向键步进之前发出。在回调里调用 <code>preventDefault()</code> 可以阻止这次步进。</td></tr>
    </tbody>
  </table>
</div>

## NumberInput 插槽

<div class="component-api-table" role="region" aria-label="NumberInput 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>输入框起始位置的图标。</td></tr>
      <tr><td><code>labelIcon</code></td><td>标签文字前的图标。</td></tr>
    </tbody>
  </table>
</div>
