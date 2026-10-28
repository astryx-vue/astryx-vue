# login-card 走查

对照图：`/tmp/D20-shots/login-card-{light,dark}.png`

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 外壳高度 | 806 撑满、卡片居中 | 内容贴顶（外壳无高度） | 已修（`min-height="100%"`） |
| 内容列宽 | 400（width 100% + max-width 400） | 396（style 写 width/maxWidth 被 core 的 Stack 覆盖） | 已修：改用 `width="100%" :max-width="400"` 属性 |
| 标题块、卡片、两个社交按钮对齐 | 水平居中 | 靠左（`justify="center"` 是竖直主轴对齐） | 已修：全模板 `VStack justify` 改 `hAlign`，并加检查（见 impl-1） |
| 社交按钮图标 16×16 | 16 | 20（大号按钮图标槽把 svg 撑成 20） | 已修：svg 写 `style="width:16px;height:16px"`。待 core 修复后去掉（大号按钮图标槽不该盖住显式宽高，已列入 core 清单） |
| 按钮字重 | 500 | 400 | 已修（预览框字重还给组件层） |
| 条款行 | 链接 12px | 链接 16px（`type="supporting"` 在 Link 上无效，落成 HTML 属性） | 已修：改 `size="sm"`，行高在预览框里补；Link 缺 `type` 属性已列入 core 清单 |
| 文本框隐藏标签 | 1px 裁剪 | 同 | 一致（脚本显示的 label 宽差是 visually-hidden 不同写法的测量假象） |
| 深色 | 同浅色 | 按钮字色 17 对 23 | 同 login，不修（core token） |
