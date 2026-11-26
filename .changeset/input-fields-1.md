---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

文字输入框对齐上游：TextInput、TextArea、FileInput 禁用后仍留在 Tab 顺序里（`aria-disabled`、只读），除聚焦和失焦外不运行调用方的处理函数，键盘聚焦时画聚焦环；TextInput、TextArea 新增 `enterKeyHint`、`inputMode`、`autoCapitalize`、`hasAutoCorrect`（TextInput 另有 `hasSpellCheck`，类型新增 `search`、`tel`、`url`），`startIcon` 可传语义图标名；TextArea 新增 `htmlMaxLength`；只写 error 不写说明时给读屏一句兜底文字；点清除按钮在点按里聚焦（iOS 弹出键盘）；加载圈排在清除按钮里侧；放大字号时 TextInput 跟着长高；粗指针下聚焦外观立刻显示。FileInput 忙碌时不再接受新的选择，忙碌只播报一次，清除后焦点回触发按钮，调用方的 `aria-describedby` 接到触发按钮，表单默认必填也念出「必填」，提示气泡状态在拖放模式和上传中都保留，拖放区默认把状态放到下面。表单的默认必填不再让没勾的复选框和关着的开关变成必填。导出 `FieldStatusPlacement`、`EnterKeyHint`、`InputMode`、`AutoCapitalize` 类型。
