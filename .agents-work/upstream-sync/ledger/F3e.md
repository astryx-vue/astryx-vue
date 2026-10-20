# F3e 实验包：对话类组件 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 6 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [ ] `ea5705c0f` feat(docsite): surface canary-only components (#5583)
  - 文件：packages/lab/src/Chat/ChatEmojiPicker.doc.mjs、packages/lab/src/Chat/ChatReactionBar.doc.mjs、packages/lab/src/Chat/ChatTypingIndicator.doc.mjs、packages/lab/src/Chat/ChatUnreadDivider.doc.mjs
  - 规范文档：packages/lab/src/Chat/ChatEmojiPicker.doc.mjs、packages/lab/src/Chat/ChatReactionBar.doc.mjs、packages/lab/src/Chat/ChatTypingIndicator.doc.mjs、packages/lab/src/Chat/ChatUnreadDivider.doc.mjs
  - 还涉及：D5、F1a、F1c、F2a、F2c、F3d、F3f、F5
  - 链接：https://github.com/facebook/astryx/commit/ea5705c0f9566bb7d4f61f28e47073a4895d66b8

### fix

- [ ] `d990fb58d` fix(a11y): no hover state on disabled elements (#5247)
  - 文件：packages/lab/src/Chat/ChatEmojiPicker.tsx、packages/lab/src/Chat/ChatReactionBar.tsx
  - 还涉及：B1、B3、C1、C2、C3、C4、C5、C10、C11、C12、C13、C14、C15、C16、F3a、F3b
  - 链接：https://github.com/facebook/astryx/commit/d990fb58d902b2315d9809f1469cfc8c753c4889
- [ ] `e891c0dc8` fix(a11y): a disabled control answers the pointer with not-allowed (#5323)
  - 文件：packages/lab/src/Chat/ChatEmojiPicker.tsx、packages/lab/src/Chat/ChatReactionBar.tsx、packages/lab/src/ChatReasoning/ChatReasoning.tsx
  - 还涉及：B2、B3、C1、C2、C3、C4、C5、C6、C7、C8、C9、C10、C11、C12、C13、C14、C15、C16、F3a、F3b
  - 链接：https://github.com/facebook/astryx/commit/e891c0dc871628ab69fef5f44be04deeb3fe6c2f
- [ ] `8a9d85fdf` fix(a11y): one disabled cursor everywhere — default, not not-allowed (#5335)
  - 文件：packages/lab/src/Chat/ChatEmojiPicker.tsx、packages/lab/src/Chat/ChatReactionBar.tsx、packages/lab/src/ChatReasoning/ChatReasoning.tsx
  - 还涉及：B2、B3、C1、C2、C3、C4、C5、C6、C7、C8、C9、C10、C11、C12、C13、C14、C15、C16、F3a、F3b
  - 链接：https://github.com/facebook/astryx/commit/8a9d85fdf35e23788938b739e4d0d8443ad7d739
- [ ] `1544a7ade` fix(ChatTypingIndicator): build the typing status from the i18n catalog and Intl.ListFormat (#6220)
  - 文件：packages/lab/src/Chat/ChatTypingIndicator.doc.mjs、packages/lab/src/Chat/ChatTypingIndicator.test.tsx、packages/lab/src/Chat/ChatTypingIndicator.tsx
  - 规范文档：packages/lab/src/Chat/ChatTypingIndicator.doc.mjs
  - 测试：packages/lab/src/Chat/ChatTypingIndicator.test.tsx
  - 还涉及：B5
  - 链接：https://github.com/facebook/astryx/commit/1544a7ade20336ea824f803fc9c6e53b04871d63

### test

- [ ] `9c83d436c` test(a11y): add status-message accessibility contract (#6208)
  - 文件：packages/lab/src/Chat/ChatTypingIndicator.test.tsx、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.chromium.spec.ts、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.known-failures.ts、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.renders.tsx、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.states.ts、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.test.tsx
  - 测试：packages/lab/src/Chat/ChatTypingIndicator.test.tsx、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.chromium.spec.ts、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.known-failures.ts、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.renders.tsx、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.states.ts、packages/lab/src/Chat/__tests__/ChatTypingIndicator.a11y.test.tsx
  - 还涉及：C1、C7、C10、C15、E3
  - 链接：https://github.com/facebook/astryx/commit/9c83d436ca2b9c321f5f74d3337c09c5b23f3ac4
