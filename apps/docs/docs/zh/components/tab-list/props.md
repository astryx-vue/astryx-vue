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
      <tr>
        <td><code>overflow</code></td>
        <td><code>'auto' | 'scroll' | 'visible'</code></td>
        <td><code>'auto'</code></td>
        <td>标签比条宽时怎么处理。<code>auto</code> 和 <code>scroll</code> 都会横向滚动，挡住的一端淡出，并给出翻页箭头。<code>visible</code> 不滚动。选中项如果被挡住，会立刻滚回可见区域。</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>标签条的无障碍角色。<code>tablist</code> 走标签页模式：每个标签带 <code>role="tab"</code> 和 <code>aria-selected</code>，并通过 <code>panelId</code> 指向对应的面板。不传时标签条是一个导航地标，用 <code>aria-current</code> 标出当前标签，带 <code>href</code> 的标签渲染成链接。其他值原样写到元素上。</td>
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
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>标签的可见文字。<code>isLabelHidden</code> 为真时它也是无障碍名称。两者都给时默认插槽优先。</td>
      </tr>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>点击后跳转的地址。不在标签页模式时渲染成链接；在 <code>role="tablist"</code> 的标签条里会被忽略。</td>
      </tr>
      <tr>
        <td><code>as</code></td>
        <td><code>string | Component</code></td>
        <td><code>'a'</code></td>
        <td>链接的根组件，比如路由链接。只在有 <code>href</code> 且不在标签页模式时生效。</td>
      </tr>
      <tr>
        <td><code>isLabelHidden</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>视觉上隐藏文字，只显示图标和尾部内容。文字仍然通过 <code>aria-label</code> 给读屏。</td>
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
      <tr>
        <td><code>icon</code></td>
        <td>未选中时显示的图标。</td>
      </tr>
      <tr>
        <td><code>selectedIcon</code></td>
        <td>选中时显示的图标，不传则沿用 <code>icon</code>。</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td>文字之后的内容，例如角标数字或状态点。</td>
      </tr>
    </tbody>
  </table>
</div>
