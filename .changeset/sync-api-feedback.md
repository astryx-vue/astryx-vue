---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

加载与进度类组件对齐上游：
- Spinner 的圆弧放进自带合成层的转子里转（一次迭代 100 圈），脚本跑着的时候也照转；圆环改为 `role="progressbar"`，独立使用的加载圈在页面加载后出现时通过共用播报通道把名称读一次，带 `aria-hidden`、别的 `role` 或处在拥有任务的组件里（如 Tokenizer 底部抽屉）时保持安静；主题可用名为 `spinner` 的指示图形换掉整圈。
- ProgressBar 的确定进度填充改用 transform 滑动，页面忙时也继续动；手指下按 UIProgressView 的时长和曲线移动，大于 0 时至少画 16px，等于 0 时不画，刻度标记按画出的长度判断在填充上还是轨道上；减少动态效果下，不确定进度条铺满轨道只让不透明度呼吸；刻度标记带 `role="img"`。
- Skeleton 的脉动改用线性时间函数加分级关键帧，Safari 在脚本运行时也继续脉动；`radius` 取 4 与 3 对应同一个容器圆角，已写进文档。
- Stepper：可点步骤的描述挂到按钮的 `aria-describedby`；序号与标签在文本读法里分开；调用方传的 `aria-current` 不再盖过步骤自己的；当前步骤的步骤、指示点和标签带 `data-selected`；收起的紧凑布局里每个步骤带读屏名称，禁用步骤多读「不可用」。
- Banner：`role="alert"` 只罩住标题和描述，连同传入的 `aria-*` 落在消息元素上，控件和内容区不再算警报的一部分；标题与描述之间留一个空格；没有图标时不再留空图标框；关闭按钮带 `astryx-banner-close`。
