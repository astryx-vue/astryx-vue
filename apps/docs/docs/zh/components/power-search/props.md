---
layout: component-docs
title: 结构化搜索
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="PowerSearch 属性" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>config</code></td><td><code>PowerSearchConfig</code></td><td>必需</td><td>有哪些字段、运算符，以及每种运算符要什么值。</td></tr>
      <tr><td><code>filters</code></td><td><code>PowerSearchFilter[]</code></td><td>-</td><td>当前条件。传入之后由外面保存，配合更新事件使用。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>搜索</td><td>输入框的无障碍名称。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>true</code></td><td>视觉上藏起标签，读屏仍然读得到。不传就隐藏；传 <code>false</code> 会显示。旧名 <code>labelHidden</code> 同样可用。两个都传时听正名。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td>搜索……</td><td>还没有条件时的占位文字。</td></tr>
      <tr><td><code>autofocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>挂载后立刻聚焦。</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>true</code></td><td>有筛选条件时显示全部清除。旧名 <code>clearable</code> 同样可用。</td></tr>
      <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>不能新增、修改或删除。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>整个搜索停用。</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>-</td><td>停用原因。和 <code>disabled</code> 一起用时，悬停或键盘聚焦会显示这段提示，输入框仍可聚焦（带 <code>aria-disabled</code>）。旧名 <code>disabledReason</code> 同样可用。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>default</code></td><td>校验状态。</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>-</td><td>状态说明。</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached'</code></td><td><code>attached</code></td><td>说明贴在输入框下面，或隔开一段。</td></tr>
      <tr><td><code>maxTokenLength</code></td><td><code>number</code></td><td><code>40</code></td><td>标签里的值最多显示多少个字符。</td></tr>
      <tr><td><code>maxSearchResults</code></td><td><code>number</code></td><td><code>10</code></td><td>输入了文字之后，字段菜单最多几条。空查询最多浏览 1000 个字段。</td></tr>
      <tr><td><code>maxOperatorMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>字符串和实体的值补全最多几条。不影响字段菜单和枚举菜单。</td></tr>
      <tr><td><code>menuWidth</code></td><td><code>number</code></td><td>-</td><td>字段菜单的精确宽度，单位是像素。不作用于值编辑器。</td></tr>
      <tr><td><code>popoverSaveButtonLabel</code></td><td><code>string</code></td><td>应用</td><td>筛选编辑器里保存按钮的文字。旧名 <code>saveLabel</code> 同样可用。</td></tr>
      <tr><td><code>timezoneID</code></td><td><code>string</code></td><td>-</td><td>日期怎么显示所用的时区 ID，例如 America/New_York。旧名 <code>timeZone</code> 同样可用。</td></tr>
      <tr><td><code>overflow</code></td><td><code>'none' | 'unfocused-inline' | 'unfocused-layer'</code></td><td><code>none</code></td><td>标签放不下时换行、失焦收成一行，或失焦后浮层展开。</td></tr>
      <tr><td><code>resultCount</code></td><td><code>number | string</code></td><td>-</td><td>匹配数量。数字会按结果的单复数格式化。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>md</code></td><td>输入框和标签的尺寸。</td></tr>
      <tr><td><code>components</code></td><td><code>PowerSearchComponents</code></td><td>-</td><td>按值的类型替换标签或编辑器。</td></tr>
      <tr><td><code>containerClass</code></td><td><code>string</code></td><td>-</td><td>加到字段外壳，也就是标签和状态说明那一层。不会进到画边框的外框，也不会进到原生 input。</td></tr>
      <tr><td><code>containerStyle</code></td><td><code>StyleValue</code></td><td>-</td><td>字段外壳的行内样式。落点和 <code>containerClass</code> 相同。</td></tr>
      <tr><td><code>controlClass</code></td><td><code>string</code></td><td>-</td><td>加到画边框的外框。写在组件上的 <code>class</code> 也落在这里，不会进到原生 input。</td></tr>
      <tr><td><code>controlStyle</code></td><td><code>StyleValue</code></td><td>-</td><td>外框的行内样式。写在组件上的 <code>style</code> 也落在这里。</td></tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="PowerSearch 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:filters</code></td><td>新的条件列表</td><td>条件变化。可以配合双向绑定。</td></tr>
      <tr><td><code>change</code></td><td>条件、变更类型、下标</td><td>类型是新增、修改或删除，下标是被碰到的那一条。</td></tr>
      <tr><td><code>focus</code></td><td>焦点事件</td><td>焦点进入输入框。</td></tr>
      <tr><td><code>blur</code></td><td>焦点事件</td><td>焦点离开输入框。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

图标放在条件前面。<code>endContent</code>（也接受旧名 <code>end</code>）放在清除按钮之前，适合再放一个操作。标签和编辑器插槽优先于按类型注册的替换组件。

组件还暴露聚焦和取消聚焦两个方法，给外面的按钮把光标送回输入框。

## 字段定义

`createPowerSearchConfig` 接受字符串、数字、布尔、日期、枚举、枚举列表和字符串列表。字符串有包含、开头、结尾和等于。数字有大小比较。日期有早于、晚于和介于。布尔值不需要再填值。

手写配置时还可以使用时间、相对日期、实体列表、自定义编辑器和嵌套条件。自定义编辑器要同时提供怎么把值读成文字。
