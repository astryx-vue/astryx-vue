# F1b 富文本编辑器组件 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 41 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [ ] `ea0483449` feat(theme): add appearance nesting tokens (#5963)
  - 文件：packages/richtext/src/RichTextEditor.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F2b、F3a、F3b、F3c、F3d
  - 链接：https://github.com/facebook/astryx/commit/ea0483449dcbdd69aed43aa0d4ba9d6f57f54447
- [ ] `1eee9557e` feat(richtext): import, edit, and export GFM tables (#6983)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx、packages/richtext/src/markdownTable.test.tsx
  - 测试：packages/richtext/src/markdownTable.test.tsx
  - 还涉及：F1a、F1c
  - 链接：https://github.com/facebook/astryx/commit/1eee9557e335b4a019718926e39876984a2a4e33
- [ ] `7a6a63785` feat(richtext): keep authored Markdown through import and export (#6989)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/markdownSource.test.tsx、packages/richtext/src/markdownTable.test.tsx
  - 测试：packages/richtext/src/markdownSource.test.tsx、packages/richtext/src/markdownTable.test.tsx
  - 还涉及：F1a、F1c
  - 链接：https://github.com/facebook/astryx/commit/7a6a63785d5edbcc6b0e93951d3f418110ed4d78
- [ ] `c24598577` feat(richtext): import, draw, and export thematic breaks as horizontal rules (#6999)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx、packages/richtext/src/markdownThematicBreak.test.tsx
  - 测试：packages/richtext/src/markdownThematicBreak.test.tsx
  - 还涉及：F1a、F1c
  - 链接：https://github.com/facebook/astryx/commit/c24598577a05042b0fb5512e455fc84fa96f42cc
- [ ] `d11d49ef8` feat(richtext): draw fenced code in core CodeBlock's frame, with its language header and copy button (#7004)
  - 文件：packages/richtext/src/CodeBlockHeaderPlugin.test.tsx、packages/richtext/src/CodeBlockHeaderPlugin.tsx、packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx
  - 测试：packages/richtext/src/CodeBlockHeaderPlugin.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/d11d49ef8f95749b09bd8150206df63b79fd6226
- [ ] `cb30e207e` feat(Markdown): export the character reference decoder, and decode references in RichText with it (#7013)
  - 文件：packages/richtext/src/markdownSource.test.tsx
  - 测试：packages/richtext/src/markdownSource.test.tsx
  - 还涉及：C9、F1a
  - 链接：https://github.com/facebook/astryx/commit/cb30e207e0b5ed579282a58b9f159fa7eab9e45b
- [ ] `258ff0236` feat(richtext): import GFM task lists exactly as Markdown does, with a checkbox each item owns (#7007)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx、packages/richtext/src/TaskCheckboxPlugin.tsx、packages/richtext/src/markdownTaskList.test.tsx
  - 测试：packages/richtext/src/markdownTaskList.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/258ff023681e183c0d03fee538b93631a880295e
- [ ] `822d4527f` feat(richtext): color fenced code with core CodeBlock's tokenizer and syntax color tokens (#7031)
  - 文件：packages/richtext/src/CodeSyntaxPlugin.test.tsx、packages/richtext/src/CodeSyntaxPlugin.tsx、packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx
  - 测试：packages/richtext/src/CodeSyntaxPlugin.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/822d4527fc5b68de3658b6515e21fc74dab686fe
- [ ] `3c6f7df5f` feat(richtext): draw Markdown plugin nodes in the editor and the view as core Markdown does (#7041)
  - 文件：packages/richtext/src/MarkdownExtensionsPlugin.test.tsx、packages/richtext/src/MarkdownExtensionsPlugin.tsx、packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx
  - 测试：packages/richtext/src/MarkdownExtensionsPlugin.test.tsx
  - 还涉及：F1a、F1c
  - 链接：https://github.com/facebook/astryx/commit/3c6f7df5f2835018c617d651a65703a15d454cdf
- [ ] `6a40f1504` feat(richtext): the toolbar takes base props, and its new-tab option is hasNewTabLinks (#7561)
  - 文件：packages/richtext/src/RichTextEditor.test.tsx、packages/richtext/src/RichTextEditorToolbar.tsx
  - 测试：packages/richtext/src/RichTextEditor.test.tsx
  - 还涉及：F1c
  - 链接：https://github.com/facebook/astryx/commit/6a40f150418fcd11a732c897cce9ade4cb887b63
- [ ] `22743455a` feat(richtext): release @astryxdesign/richtext as a stable package (#7224)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextEditorAutoLinkPlugin.tsx、packages/richtext/src/RichTextEditorToolbar.tsx、packages/richtext/src/RichTextView.tsx
  - 还涉及：C1、C9、F1a、F1c、F3f
  - 链接：https://github.com/facebook/astryx/commit/22743455aa9a4047affcaba9f300184ed657cbc3

### fix

- [ ] `20229b56b` fix(core): scope the 16px input floor to iOS (#6085)
  - 文件：packages/richtext/src/RichTextEditor.tsx
  - 还涉及：B2、C1、C3、C4、C5、C10
  - 链接：https://github.com/facebook/astryx/commit/20229b56bf48a89646aa14fe0654951edb7c9971
- [ ] `115f3e92f` fix(richtext): split RichTextEditor read-only from disabled and follow prop changes (#6980)
  - 文件：packages/richtext/src/RichTextEditor.test.tsx、packages/richtext/src/RichTextEditor.tsx
  - 测试：packages/richtext/src/RichTextEditor.test.tsx
  - 还涉及：F1c
  - 链接：https://github.com/facebook/astryx/commit/115f3e92fe4257cb9de9d76128f2d57e097459b4
- [ ] `fcd44d1c2` fix(richtext): RichTextView renders document content, not an unnamed textbox (#6977)
  - 文件：packages/richtext/src/RichTextEditor.test.tsx、packages/richtext/src/RichTextView.tsx
  - 测试：packages/richtext/src/RichTextEditor.test.tsx
  - 还涉及：F1c
  - 链接：https://github.com/facebook/astryx/commit/fcd44d1c237746b24d2b8edbc8f5d833f76bf392
- [ ] `bc18d617d` fix(richtext): declare the rich-text-editor theme target's visual props (#6976)
  - 文件：packages/richtext/src/RichTextEditor.test.tsx
  - 测试：packages/richtext/src/RichTextEditor.test.tsx
  - 还涉及：F1a、F1c
  - 链接：https://github.com/facebook/astryx/commit/bc18d617dbc646ab564655fcb2602a7b5a0b9186
- [ ] `b2214a49c` fix(richtext): RichTextView keeps consumer styling and reports parse errors after render (#6978)
  - 文件：packages/richtext/src/RichTextEditor.test.tsx、packages/richtext/src/RichTextView.tsx
  - 测试：packages/richtext/src/RichTextEditor.test.tsx
  - 链接：https://github.com/facebook/astryx/commit/b2214a49c5543bb8621819395e93a9439512418d
- [ ] `b599105a4` fix(richtext): size a table's scroll wrapper from its container (#6994)
  - 文件：packages/richtext/src/markdownTable.test.tsx
  - 测试：packages/richtext/src/markdownTable.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/b599105a48fd7a6ba2b068f81c10486b64f3d0ce
- [ ] `4c5032121` fix(richtext): RichTextView table scroll regions take a tab stop while they overflow (#6990)
  - 文件：packages/richtext/src/RichTextView.tsx、packages/richtext/src/TableScrollRegionPlugin.test.tsx、packages/richtext/src/TableScrollRegionPlugin.tsx
  - 测试：packages/richtext/src/TableScrollRegionPlugin.test.tsx
  - 链接：https://github.com/facebook/astryx/commit/4c503212111c2787a192ff3004411cf4a3286b9b
- [ ] `8701623a1` fix(richtext): continue a block across soft line breaks, as Markdown reads it (#7000)
  - 文件：packages/richtext/src/markdownSource.test.tsx
  - 测试：packages/richtext/src/markdownSource.test.tsx
  - 还涉及：F1a、F1c
  - 链接：https://github.com/facebook/astryx/commit/8701623a13efee294db55a5e044f4be1ee457689
- [ ] `643fe130e` fix(richtext): nest list items the way CommonMark does (#7002)
  - 文件：packages/richtext/src/markdownSource.test.tsx
  - 测试：packages/richtext/src/markdownSource.test.tsx
  - 还涉及：F1a、F1c
  - 链接：https://github.com/facebook/astryx/commit/643fe130e7cc302ad045c44208c1d4e549366369
- [ ] `ca7702584` fix(richtext): give table columns core Markdown's readable width floors (#7005)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx、packages/richtext/src/TableColumnFloorPlugin.test.tsx、packages/richtext/src/TableColumnFloorPlugin.tsx
  - 测试：packages/richtext/src/TableColumnFloorPlugin.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/ca77025847badbe9c4c3ac3b1488d58c9a0bb721
- [ ] `efac39f55` fix(richtext): keep a thematic break written under a block as written when the block changes (#7017)
  - 文件：packages/richtext/src/markdownSource.test.tsx
  - 测试：packages/richtext/src/markdownSource.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/efac39f55f6a6835f2e9fc0fc07f6cc49dc48b8a
- [ ] `b8e30f368` fix(richtext): render struck-through text inside a <del>, so it is a deletion and keeps its other marks (#7019)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx、packages/richtext/src/strikethroughDeletion.test.tsx
  - 测试：packages/richtext/src/strikethroughDeletion.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/b8e30f368272a70ec3cc4ab3a0d7c112f04c43e2
- [ ] `671eb9437` fix(richtext): render bold italic text inside an <em>, so it is emphasis as well as strong (#7034)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx、packages/richtext/src/strikethroughDeletion.test.tsx、packages/richtext/src/textSemantics.test.tsx
  - 测试：packages/richtext/src/strikethroughDeletion.test.tsx、packages/richtext/src/textSemantics.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/671eb9437499d3687647a57ab5a7603d18ae1f55
- [ ] `a97259bce` fix(richtext): toggle a format on plugin nodes selected alone (#7047)
  - 文件：packages/richtext/src/MarkdownExtensionsPlugin.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/a97259bce83f0b5d80c90e62030dcb61e1b17bea
- [ ] `0d7197d7e` fix(richtext): import a link core refuses as its source text, never a link (#7065)
  - 文件：packages/richtext/src/markdownRefusedLinks.test.tsx
  - 测试：packages/richtext/src/markdownRefusedLinks.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/0d7197d7e9a1228b716a0f1a2baa2ad5f23b238b
- [ ] `52e4193ac` fix(richtext): show a plugin node's format in the toolbar when it is selected alone (#7063)
  - 文件：packages/richtext/src/MarkdownExtensionsPlugin.tsx、packages/richtext/src/RichTextEditorToolbar.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/52e4193ac107ff13bc93955602d4d5f8c40e2f01
- [ ] `090588faa` fix(richtext): select a Markdown plugin node whole with a click (#7067)
  - 文件：packages/richtext/src/MarkdownExtensionsPlugin.tsx、packages/richtext/src/RichTextEditorToolbar.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/090588faa24c6089e4e22491081df4fd65995ea2
- [ ] `28b879f42` fix(richtext): read code spans before the marks around them (#7066)
  - 文件：packages/richtext/src/markdownSource.test.tsx
  - 测试：packages/richtext/src/markdownSource.test.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/28b879f42627a9218bbcd18921b675a056640211
- [ ] `2e9a71a16` fix(richtext): run the core lint rules and theming guards over packages/richtext (#7083)
  - 文件：packages/richtext/src/CodeBlockHeaderPlugin.tsx、packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/TaskCheckboxPlugin.tsx
  - 还涉及：B1、F1a
  - 链接：https://github.com/facebook/astryx/commit/2e9a71a16b61367c383dcc5852002b24e2c03315
- [ ] `11a80dd00` fix(richtext): translate the editor toolbar, link dialog, and Tab escape hint (#7215)
  - 文件：packages/richtext/src/RichTextEditor.test.tsx、packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextEditorToolbar.tsx
  - 测试：packages/richtext/src/RichTextEditor.test.tsx
  - 还涉及：B5、F1c
  - 链接：https://github.com/facebook/astryx/commit/11a80dd007f8d6c97c9a4821af16cd6df9e64882
- [ ] `ae5e6f90c` fix(richtext): toolbar glyphs follow the active theme, and undo and redo mirror in RTL (#7216)
  - 文件：packages/richtext/src/RichTextEditor.test.tsx、packages/richtext/src/RichTextEditorToolbar.tsx
  - 测试：packages/richtext/src/RichTextEditor.test.tsx
  - 还涉及：F1c
  - 链接：https://github.com/facebook/astryx/commit/ae5e6f90c328b4f8b6c8db9a710b9f5f9ef2edb6
- [ ] `a073f05e7` fix(richtext): RichTextView draws every block in the theme's body type (#7220)
  - 文件：packages/richtext/src/RichTextView.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/a073f05e7374faa4bd97d96b32bdcf4d646f2cd1
- [ ] `aea7a8dc6` fix(richtext): keep the block-format selector readable when the toolbar runs out of room (#7217)
  - 文件：packages/richtext/src/RichTextEditorToolbar.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/aea7a8dc61c727eb4659bc26475c3fe2145bada8
- [ ] `3338a6c75` fix(core): use 4px compact Toolbar inset without breaking alignment (#6954)
  - 文件：packages/richtext/src/RichTextEditor.test.tsx、packages/richtext/src/RichTextEditorToolbar.tsx
  - 测试：packages/richtext/src/RichTextEditor.test.tsx
  - 还涉及：C14
  - 链接：https://github.com/facebook/astryx/commit/3338a6c75ccfdbdd85abc5e40415ef0501492e5c
- [ ] `2c86d9dda` fix(richtext): keep toolbar controls on a 4px gutter (#7391)
  - 文件：packages/richtext/src/RichTextEditor.test.tsx、packages/richtext/src/RichTextEditorToolbar.tsx
  - 测试：packages/richtext/src/RichTextEditor.test.tsx
  - 还涉及：F1c
  - 链接：https://github.com/facebook/astryx/commit/2c86d9dda12fc7b7d61ce7bb2a808eb29790e204
- [ ] `4a174093f` fix(richtext): declare the editor's ref prop, and clear two stale headers and two dead style entries (#7422)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextEditorAutoLinkPlugin.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/4a174093fd1045cf5e2b4602a45ab48ae6c9d5ab

### refactor

- [ ] `f138ed997` refactor(richtext): build the editor through LexicalExtensionComposer (#6241)
  - 文件：packages/richtext/src/RichTextEditor.tsx、packages/richtext/src/RichTextView.tsx
  - 链接：https://github.com/facebook/astryx/commit/f138ed997b88e4dc4361e73b388bd4b1d8a47bf4
- [ ] `50ce8947f` refactor(richtext): keep editor theme classes, autolink patterns and the Transformer re-export internal (#7560)
  - 文件：packages/richtext/src/RichTextEditor.tsx
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/50ce8947f01891c32b9e83d08de8c4a691c45e21

### 其它

- [ ] `6e6b9b476` revert(theme): restore local stacking contracts (#6031)
  - 文件：packages/richtext/src/RichTextEditor.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F2b、F3a、F3b、F3c、F3d
  - 链接：https://github.com/facebook/astryx/commit/6e6b9b476713156899fc8bd2107f3f3ee2d26a90
- [ ] `f27f74937` chore(richtext): remove internal-only references from public source and docs (#6975)
  - 文件：packages/richtext/src/RichTextEditorAutoLinkPlugin.tsx、packages/richtext/src/RichTextEditorToolbar.tsx
  - 还涉及：B1、F1c、F3f
  - 链接：https://github.com/facebook/astryx/commit/f27f74937a954529f408532a1782ab9602082e4f
