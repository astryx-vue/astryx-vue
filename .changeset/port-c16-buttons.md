---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

InputGroup 禁用时，组内的输入框、选择器和按钮附加件都会跟着禁用，嵌套的内层组也一样；强制配色（Windows 高对比主题）下，ButtonGroup 的接缝不再叠成双线，Popover、下拉菜单、右键菜单和对话框保留一圈边；ButtonGroup 末尾成员在后面跟着弹出层时也照样圆角。按钮族文档补上独立 ToggleButton 的 click 先发出且可取消切换、链接模式下 element 是链接元素等说明。
