---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

聊天布局和样式对齐上游：ChatLayout 用外部 `scrollRef` 时，消息区底部留白加上固定输入区的高度，最新一条消息滚到底时落在输入区上面；`scrollRef` 是整页滚动者时，滚动按钮能正确出现、读者上滑会停止跟随、`scrollToMessage` 从视口顶部量起；跟随末尾期间关掉浏览器的滚动锚定，不再靠隐藏滚动条的属性。头像顶部偏移只看消息自己的内容，嵌套消息不再继承外层的偏移；消息列表的键盘焦点环画在列表盒子里面，用共享焦点环令牌；输入区页脚里调用方的操作换行、发送操作始终留在输入区内；抽屉的圆角跟着输入区自己的圆角；发送键在输入区里保持圆形；空的编辑区不会再塌成 0 高度；粗指针下输入区的聚焦外观立刻显示。新增 `useChatDictation`、`useSpeechRecognition`、`useChatPasteAsToken` 的文档页。
