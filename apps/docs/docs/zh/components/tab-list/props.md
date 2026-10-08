---
layout: component-docs
title: 标签列表
outline: false
footer: false
---

## TabList Props

<div class="component-api-table" role="region" aria-label="TabList Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>当前选中标签的值，支持 <code>v-model:value</code>。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>TabListSize</code></td>
        <td><code>'md'</code></td>
        <td>标签的尺寸，可选 sm、md、lg。</td>
      </tr>
      <tr>
        <td><code>layout</code></td>
        <td><code>TabListLayout</code></td>
        <td><code>'hug'</code></td>
        <td>标签的排列方式，可选 hug（按内容宽度自适应）、fill（在容器内平均分配宽度）。</td>
      </tr>
      <tr>
        <td><code>hasDivider</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否在标签列表底部显示一条分隔线。</td>
      </tr>
    </tbody>
  </table>
</div>

## TabList 事件

<div class="component-api-table" role="region" aria-label="TabList 事件" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>update:value</code></td>
        <td>选中项变化时触发，用于 <code>v-model:value</code> 的双向绑定。</td>
      </tr>
      <tr>
        <td><code>change</code></td>
        <td>选中项变化时触发，适合在切换后执行加载数据等操作。</td>
      </tr>
    </tbody>
  </table>
</div>

## TabList Slots

<div class="component-api-table" role="region" aria-label="TabList Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>放置 <code>Tab</code> 组件的默认插槽。</td>
      </tr>
    </tbody>
  </table>
</div>

## Tab Props

<div class="component-api-table" role="region" aria-label="Tab Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>标签的唯一标识，在同一 TabList 内应保持唯一。</td>
      </tr>
      <tr>
        <td><code>panelId</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>所控制面板的 ID，组件会写入 <code>aria-controls</code>，建立标签与面板的关联。</td>
      </tr>
      <tr>
        <td><code>disabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否禁用，禁用后不可点击，键盘导航也会跳过该标签。</td>
      </tr>
    </tbody>
  </table>
</div>

## Tab Slots

<div class="component-api-table" role="region" aria-label="Tab Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>标签上显示的文本内容。</td>
      </tr>
    </tbody>
  </table>
</div>
