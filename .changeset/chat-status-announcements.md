---
'@astryx-vue/core': patch
---

修复 Chat 状态播报。ChatSystemMessage 不再重复声明 live role，交给外层 ChatMessageList 的 log。ChatComposer 的可见状态条不再兼任 live region，错误与警告改经共享 announce 通道分别进行 assertive 和 polite 播报；相同状态不重复，清除后可再次播报。
