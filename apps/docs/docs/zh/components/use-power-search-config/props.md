---
layout: component-docs
title: usePowerSearchConfig
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="usePowerSearchConfig 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>definitions</code></td>
        <td><code>readonly PowerSearchFieldDefinition[]</code></td>
        <td>必填</td>
        <td>带类型的字段定义：<code>key</code>、<code>type</code>、<code>label</code>，枚举字段再加 <code>enumValues</code>。字段和每个字段能用的运算符都从这里来。</td>
      </tr>
      <tr>
        <td><code>configName</code></td>
        <td><code>string</code></td>
        <td><code>'PowerSearchConfig'</code></td>
        <td>返回的配置的 <code>name</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="usePowerSearchConfig 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>config</code></td>
        <td><code>PowerSearchConfig</code></td>
        <td>交给 <code>PowerSearch</code> 的配置，里面是字段和适合各自类型的运算符。</td>
      </tr>
      <tr>
        <td><code>applyFilters</code></td>
        <td><code>(filters: readonly PowerSearchFilter[], data: readonly T[]) =&gt; T[]</code></td>
        <td>返回符合当前筛选条件的行。时间、相对日期、实体和自定义值需要调用方自己解释，否则不筛掉任何行。</td>
      </tr>
    </tbody>
  </table>
</div>
