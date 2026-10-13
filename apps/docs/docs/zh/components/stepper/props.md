---
layout: component-docs
title: 步骤条
outline: false
footer: false
---

## Stepper 属性

<div class="component-api-table" role="region" aria-label="Stepper Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>activeStep</code></td><td><code>number</code></td><td>-</td><td>当前步骤，从 0 开始。</td></tr>
      <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>排列方向。</td></tr>
      <tr><td><code>onStepClick</code></td><td><code>(index: number) =&gt; void</code></td><td>-</td><td>传入后步骤变成按钮。<code>@step-click</code> 填的就是这个属性。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>进度</td><td>列表的无障碍名称。</td></tr>
      <tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td><code>'balanced'</code></td><td>每一步周围的间距。</td></tr>
      <tr><td><code>indicatorPosition</code></td><td><code>'separated' | 'on-track'</code></td><td><code>'separated'</code></td><td>标记落在连接线上，还是和一条单独的进度条分开。</td></tr>
      <tr><td><code>hasCollapsibleLabels</code></td><td><code>boolean</code></td><td><code>false</code></td><td>水平步骤条窄于 480px 时，只留下当前步骤的文字。</td></tr>
      <tr><td><code>horizontalOptions</code></td><td><code>{ minimumStepWidth?: number, collapsedVariant?: 'withLabelAndControls' | 'withLabel' | 'hiddenLabel' }</code></td><td><code>{ minimumStepWidth: 112, collapsedVariant: 'withLabelAndControls' }</code></td><td>水平步骤条窄于 <code>minimumStepWidth</code> 乘以步骤数时保留轨道，并显示当前步。<code>withLabelAndControls</code> 在设置了 <code>onStepClick</code> 时带上 Previous / Next。<code>withLabel</code> 只显示标签。<code>hiddenLabel</code> 只留轨道。</td></tr>
    </tbody>
  </table>
</div>

## Step 属性

<div class="component-api-table" role="region" aria-label="Step Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>step</code></td><td><code>number</code></td><td>-</td><td>这一步的序号，从 0 开始。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>步骤名称。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>-</td><td>名称下面的说明。</td></tr>
      <tr><td><code>status</code></td><td><code>'accent' | 'success' | 'warning' | 'error'</code></td><td>-</td><td>只给指示器换色。连接线仍按进度着色。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>这一步不能点。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在名称后标出可选。</td></tr>
      <tr><td><code>indicator</code></td><td><code>'auto' | 'number' | 'none'</code></td><td><code>'auto'</code></td><td><code>auto</code> 显示勾、圆环或数字。<code>number</code> 始终显示序号。</td></tr>
      <tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td>跟随步骤条</td><td>这一步自己的间距。</td></tr>
    </tbody>
  </table>
</div>

## Step 插槽

<div class="component-api-table" role="region" aria-label="Step Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>default</code></td><td>名称下面的内容。垂直且进度条分开时，它在按钮外面。</td></tr>
      <tr><td><code>icon</code></td><td>替换指示器里的图形。</td></tr>
      <tr><td><code>end</code></td><td>名称这一行末尾的内容。</td></tr>
    </tbody>
  </table>
</div>
