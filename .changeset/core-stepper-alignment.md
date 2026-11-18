---
'@astryx-vue/core': patch
---

对齐原版的 Stepper、CheckboxList 和 Dialog 渲染：横向轨道模式把连接线和指示点画进控件内，整块步骤是一个点击目标；「Optional」拆成 `•` 与文字两个节点；步骤标签单行省略，未开始步骤的标签用次要色，数字指示点文字直接放在徽标里，禁用步骤的指示点用禁用色；分离模式下指示点和标签放进同一行容器、控件左右内边距固定为 8px，竖向步骤间距为 4px；传了 `onStepClick` 时禁用步骤也保留按钮（`aria-disabled`），插槽为空时不渲染内容区。紧凑密度的 CheckboxListItem 用可见标签命名复选框。Dialog 内层向 Layout 公布内边距，使 Layout 撑到对话框边缘、各区域自带内边距；放在 Layout 页头槽里的 DialogHeader 自带页头内边距。
