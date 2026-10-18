---
layout: component-docs
title: useCollapsible
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useCollapsible 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isCollapsible</code></td>
        <td><code>boolean | CollapsibleConfig | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>是否启用折叠。传 <code>true</code> 自己管状态且初始展开；传 <code>false</code> 关闭折叠；传配置对象表示受控，或自定义默认值。</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>string | undefined | MaybeRefOrGetter</code></td>
        <td>—</td>
        <td>在 <code>CollapsibleGroup</code> 里的唯一标识。有值且在组内时，状态由组管理。</td>
      </tr>
      <tr>
        <td><code>group</code></td>
        <td><code>CollapsibleGroupContextValue | null</code></td>
        <td>自动注入</td>
        <td>组上下文。不传就从最近的 <code>CollapsibleGroup</code> 读取；只有不在那棵树里时才需要手动传。</td>
      </tr>
    </tbody>
  </table>
</div>

### CollapsibleConfig

<div class="component-api-table" role="region" aria-label="CollapsibleConfig" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Ref&lt;boolean | undefined&gt;</code></td>
        <td>—</td>
        <td>受控的展开状态，通常就是 <code>v-model:isOpen</code> 的 model ref。留空表示不受控。</td>
      </tr>
      <tr>
        <td><code>defaultIsOpen</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td><code>isOpen</code> 没绑定时，内容初始是否展开。</td>
      </tr>
      <tr>
        <td><code>onOpenChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>—</td>
        <td>状态要变化时调用，参数是目标状态。受控时它是请求，不受控时它是通知。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useCollapsible 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isEnabled</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>折叠能力是否生效。<code>isCollapsible</code> 为 <code>false</code> 时是 false。</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>内容当前是否展开。</td>
      </tr>
      <tr>
        <td><code>toggle</code></td>
        <td><code>() =&gt; void</code></td>
        <td>切换展开状态：组内交给组，否则写受控 ref 或内部状态。</td>
      </tr>
    </tbody>
  </table>
</div>
