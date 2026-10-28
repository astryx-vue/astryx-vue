# payment-form 走查

对照图：`/tmp/D20-shots/payment-form-{light,dark}.png`

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 页面总高 / 滚动容器 | 内容区在 806 内滚动 | 文档高 1509：单选等隐藏控件是绝对定位，找不到定位祖先，落到预览根上撑高文档 | 已修：预览框里让 `.astryx-layout-content` 成为定位参照。待 core 修复后去掉（清单新增） |
| 订单合计 | "Order Total" 标题、三行明细、分隔线、Total、提示条 在同一 VStack gap 3 里 | 平铺在 gap 4 里，行距偏大（Subtotal y 561 对 565，Total 662 对 690） | 已修：照原版重排结构 |
| 数量框 | 146 宽 | 94 宽 | 已修：包裹宽度补到 112。待 core 修复后去掉（TextInput/NumberInput 原生 input 默认宽度，清单已有） |
| Remove / Save 链接 | 12px、行高 20 | 14px | 已修（`size="sm"` + 预览框补行高） |
| 底部政策链接 | 12px | 16px | 已修 |
| 展开摘要标题 Order Summary | 触发行高 17 | 24 | 已修（预览框压触发行高）。待 core 修复后去掉 |
| 表单字段、选择器、提示条 | 一致 | 一致 | 一致 |
| 深色 | 同 | 同上 | 与浅色同一批修复 |
