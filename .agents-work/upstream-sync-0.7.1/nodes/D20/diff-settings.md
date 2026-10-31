# settings 走查

对照图：`/tmp/D20-shots/settings-{light,dark}.png`

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 左侧导航选中项底色 | accent-muted：浅色 rgb(241,241,241)、深色 rgb(38,38,38) | 蓝色半透明 rgba(0,130,251,.2) | 已修：预览框里把 `--astryx-list-item-selected-background` 指到 accent-muted。待 core/themes 修复后去掉（neutral 的 list.css 写了蓝色，原版没有，已列入 core 清单） |
| 顶部搜索框宽度 | 184（输入区 146） | 320（Typeahead 默认 20rem） | 已修：`:width="184"` |
| 标题行、各分组标题、输入框、复选框、Save 按钮 | 一致 | 一致 | 一致 |
| 按钮字重 | 500 | 400 | 已修 |
| 深色 | 同 | 按钮字色 17 对 23 | 不修（core token） |
