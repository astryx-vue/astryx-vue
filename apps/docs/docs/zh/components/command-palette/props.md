---
layout: component-docs
title: 命令面板
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="CommandPalette Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>面板是否打开。</td>
      </tr>
      <tr>
        <td><code>searchSource</code></td>
        <td><code>SearchSource</code></td>
        <td>-</td>
        <td>命令从哪来。空查询会调用 <code>bootstrap</code>。</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>画在页面流里，而不是模态对话框。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>命令面板</td>
        <td>对话框的无障碍名称。</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td><code>640</code></td>
        <td>对话框宽度。数字按像素。</td>
      </tr>
      <tr>
        <td><code>maxHeight</code></td>
        <td><code>number | string</code></td>
        <td><code>480</code></td>
        <td>对话框最大高度。数字按像素。</td>
      </tr>
      <tr>
        <td><code>emptySearchText</code></td>
        <td><code>string</code></td>
        <td>没有结果</td>
        <td>查询没有命中时显示的文字。</td>
      </tr>
      <tr>
        <td><code>emptyBootstrapText</code></td>
        <td><code>string</code></td>
        <td>输入以搜索</td>
        <td>数据源还没有可列内容时显示的文字。</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>选择模式下的选中 id。用 <code>v-model:value</code> 绑定。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="CommandPalette Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>boolean</code></td>
        <td>下一次的打开状态。Escape 和选中一行都会关闭面板。</td>
      </tr>
      <tr>
        <td><code>update:value</code></td>
        <td><code>string</code></td>
        <td>刚选中的那一行的 id。</td>
      </tr>
      <tr>
        <td><code>valueChange</code></td>
        <td><code>string</code></td>
        <td>同一次选中，用原版的回调名字，方便从 React 迁过来的代码。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="CommandPalette Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>input</code></td>
        <td>-</td>
        <td>替换 <code>CommandPaletteInput</code>。</td>
      </tr>
      <tr>
        <td><code>item</code></td>
        <td><code>{ item, isSelected }</code></td>
        <td>行内容。<code>isSelected</code> 是选择模式的匹配，不是键盘高亮。</td>
      </tr>
      <tr>
        <td><code>footer</code></td>
        <td>-</td>
        <td>替换默认提示行。替换内容还要保留页脚外观时，放一个 <code>CommandPaletteFooter</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## CommandPaletteInput

<div class="component-api-table" role="region" aria-label="CommandPaletteInput Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>placeholder</code></td>
        <td><code>string</code></td>
        <td>搜索…</td>
        <td>占位文字，也是没有单独标签时的无障碍名称。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>组合框的无障碍名称。不传时用 <code>placeholder</code>。</td>
      </tr>
      <tr>
        <td><code>hasAutoFocus</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>面板打开时聚焦输入框。内联面板会跳过。</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>搜索词，用 <code>v-model:value</code> 绑定。不传时读写外层 <code>CommandPalette</code> 的搜索词。</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="CommandPaletteInput 事件" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>valueChange</code></td>
        <td>下一个搜索词。只在绑定了 <code>value</code> 时触发，否则输入框直接写到面板里。</td>
      </tr>
    </tbody>
  </table>
</div>

<code>endContent</code> 插槽（也可以写成 <code>end</code>）是转圈图标后面的内容。

## CommandPaletteList

`label` 是列表框的名称，默认是「命令」。

## CommandPaletteGroup

`heading` 是分组标题，也是这一组的无障碍名称。

## CommandPaletteItem

`value` 是命令 id。`isDisabled` 会挡住选择。`isHighlighted` 和 `isSelected` 会盖掉从面板读到的状态，单独展示某一行时用得上。鼠标点击激活时发出 <code>select</code>，参数是这一行的值。默认插槽是行内容。

## CommandPaletteEmpty

默认插槽是空状态文字。

## CommandPaletteFooter

默认插槽替换「移动 / 选择 / 关闭」这组提示，页脚外观保留。
