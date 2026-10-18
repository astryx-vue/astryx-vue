---
layout: component-docs
title: 选择器
outline: false
footer: false
---

## Selector Props

<div class="component-api-table" role="region" aria-label="Selector Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>string | number | null</code></td><td><code>null</code></td><td>选中的值。</td></tr>
      <tr><td><code>options</code></td><td><code>SelectorOption[]</code></td><td>必需</td><td>选项数组，每项包含 value、label 和可选的 disabled、description。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Select…</code> / <code>请选择</code></td><td>占位符文本。未设置语言时为英文，提供 <code>zh-CN</code> 后为中文。</td></tr>
      <tr><td><code>searchable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否支持搜索。</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否可清除。</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>选中值时显示清除按钮，清除会把 <code>null</code> 交给 <code>change</code>。和旧名 <code>clearable</code> 等价，两者任一为真即生效。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。和 <code>disabled</code> 一起用时，鼠标悬停或键盘聚焦会弹出提示，触发器靠 <code>aria-disabled</code> 保持可聚焦，但仍然打不开列表。不用再在外面套 Tooltip：禁用的控件收不到悬停事件。旧名 <code>disabledReason</code> 等价。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>选择器尺寸。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'error' | 'warning' | 'success'</code></td><td><code>'default'</code></td><td>状态样式。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>可见标签。不传时用占位文本作为隐藏的无障碍名称。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
      <tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>只读。值还在，可以聚焦并提交，但不能打开、清除。不变暗。和禁用同时设置时按禁用处理。</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>触发器显示加载指示。加载完成前不显示空状态。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在标签旁标成可选。</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在标签旁标成必填，并设置 aria-required。</td></tr>
      <tr><td><code>indicatorPosition</code></td><td><code>'start' | 'end'</code></td><td><code>'end'</code></td><td>单选标记放在选项的哪一侧。没选中时默认的勾不占位。主题把勾换成圆点后，没选中的行也会画出空心圆。</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string</code></td><td>无匹配项 / No matches</td><td>没有任何选项时的文案。</td></tr>
      <tr><td><code>emptySearchText</code></td><td><code>string</code></td><td>未找到结果 / No results found</td><td>搜索没有命中时的文案。</td></tr>
    </tbody>
  </table>
</div>

## Selector Emits

<div class="component-api-table" role="region" aria-label="Selector Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: string | number | null</code></td><td>值变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: string | number | null</code></td><td>值变化时触发。</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>搜索输入时触发。</td></tr>
      <tr><td><code>click</code></td><td><code>event: MouseEvent</code></td><td>触发器上的点击，在面板切换之前触发。<code>preventDefault()</code> 不会让面板保持关闭。</td></tr>
      <tr><td><code>focus</code></td><td><code>event: FocusEvent</code></td><td>触发器获得焦点时触发。</td></tr>
      <tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>触发器上内置键盘模型没处理的按键才触发。它处理并取消的按键不再透出。</td></tr>
    </tbody>
  </table>
</div>

## Selector Slots

<div class="component-api-table" role="region" aria-label="Selector Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>selected</code></td><td><code>{ option: SelectorOption | null }</code></td><td>自定义选中项显示。</td></tr>
      <tr><td><code>option</code></td><td><code>{ option: SelectorOption, isActive: boolean, isSelected: boolean }</code></td><td>自定义选项显示。</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>自定义空状态。</td></tr>
    </tbody>
  </table>
</div>
