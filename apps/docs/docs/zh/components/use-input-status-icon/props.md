---
layout: component-docs
title: useInputStatusIcon
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useInputStatusIcon 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>status</code></td>
        <td><code>FieldStatusInput | undefined</code>，或它的 ref / 取值函数</td>
        <td>—</td>
        <td>输入框的状态（类型加文案），没有状态就不传。</td>
      </tr>
      <tr>
        <td><code>statusVariant</code></td>
        <td><code>'attached' | 'detached' | 'tooltip'</code>，或它的 ref / 取值函数</td>
        <td><code>'attached'</code></td>
        <td>状态相对输入框怎么摆。<code>tooltip</code> 但没有文案时退回普通图形。</td>
      </tr>
      <tr>
        <td><code>isInGroup</code></td>
        <td><code>boolean</code>，或它的 ref / 取值函数</td>
        <td><code>false</code></td>
        <td>输入框是否在 <code>InputGroup</code> 里，组自己会画状态。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useInputStatusIcon 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>statusIcon</code></td>
        <td><code>ComputedRef&lt;Component | null&gt;</code></td>
        <td>要渲染在输入框容器里的东西：普通图形是 <code>FieldIcon</code>，带 tooltip 的信息按钮是 <code>FieldInfoTip</code>。不该画图标时是 <code>null</code>。</td>
      </tr>
      <tr>
        <td><code>statusIconProps</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, unknown&gt;&gt;</code></td>
        <td>上面那个组件的属性：<code>type</code>，信息按钮那一支还有 <code>text</code>。</td>
      </tr>
    </tbody>
  </table>
</div>
