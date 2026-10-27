# F1c 富文本使用文档 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 20 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [ ] `ea5705c0f` feat(docsite): surface canary-only components (#5583)
  - 文件：packages/richtext/blocks/RichTextEditorShowcase.template.mjs、packages/richtext/blocks/RichTextEditorShowcase.tsx
  - 还涉及：D5、F1a、F2a、F2c、F3d、F3e、F3f、F5
  - 链接：https://github.com/facebook/astryx/commit/ea5705c0f9566bb7d4f61f28e47073a4895d66b8
- [ ] `1eee9557e` feat(richtext): import, edit, and export GFM tables (#6983)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1a、F1b
  - 链接：https://github.com/facebook/astryx/commit/1eee9557e335b4a019718926e39876984a2a4e33
- [ ] `7a6a63785` feat(richtext): keep authored Markdown through import and export (#6989)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1a、F1b
  - 链接：https://github.com/facebook/astryx/commit/7a6a63785d5edbcc6b0e93951d3f418110ed4d78
- [ ] `c24598577` feat(richtext): import, draw, and export thematic breaks as horizontal rules (#6999)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1a、F1b
  - 链接：https://github.com/facebook/astryx/commit/c24598577a05042b0fb5512e455fc84fa96f42cc
- [ ] `1f63a932c` feat(richtext): adopt Markdown plugins in import and export, with a server-safe markdown entry (#7039)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/1f63a932c12fdaf3f0248e45e62b13cd1ecc1202
- [ ] `3c6f7df5f` feat(richtext): draw Markdown plugin nodes in the editor and the view as core Markdown does (#7041)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1a、F1b
  - 链接：https://github.com/facebook/astryx/commit/3c6f7df5f2835018c617d651a65703a15d454cdf
- [ ] `6a40f1504` feat(richtext): the toolbar takes base props, and its new-tab option is hasNewTabLinks (#7561)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1b
  - 链接：https://github.com/facebook/astryx/commit/6a40f150418fcd11a732c897cce9ade4cb887b63
- [ ] `22743455a` feat(richtext): release @astryxdesign/richtext as a stable package (#7224)
  - 文件：packages/richtext/README.md、packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：C1、C9、F1a、F1b、F3f
  - 链接：https://github.com/facebook/astryx/commit/22743455aa9a4047affcaba9f300184ed657cbc3

### fix

- [ ] `046f6ea2b` fix(docs): rename input category to form controls (#5686)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：C1、C2、C3、C4、C5、C15、D4、F3a、F3d
  - 链接：https://github.com/facebook/astryx/commit/046f6ea2baee04dc7eeefa17718f6556b4d533fa
- [ ] `115f3e92f` fix(richtext): split RichTextEditor read-only from disabled and follow prop changes (#6980)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1b
  - 链接：https://github.com/facebook/astryx/commit/115f3e92fe4257cb9de9d76128f2d57e097459b4
- [ ] `fcd44d1c2` fix(richtext): RichTextView renders document content, not an unnamed textbox (#6977)
  - 文件：packages/richtext/README.md
  - 还涉及：F1b
  - 链接：https://github.com/facebook/astryx/commit/fcd44d1c237746b24d2b8edbc8f5d833f76bf392
- [ ] `bc18d617d` fix(richtext): declare the rich-text-editor theme target's visual props (#6976)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1a、F1b
  - 链接：https://github.com/facebook/astryx/commit/bc18d617dbc646ab564655fcb2602a7b5a0b9186
- [ ] `8701623a1` fix(richtext): continue a block across soft line breaks, as Markdown reads it (#7000)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1a、F1b
  - 链接：https://github.com/facebook/astryx/commit/8701623a13efee294db55a5e044f4be1ee457689
- [ ] `643fe130e` fix(richtext): nest list items the way CommonMark does (#7002)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1a、F1b
  - 链接：https://github.com/facebook/astryx/commit/643fe130e7cc302ad045c44208c1d4e549366369
- [ ] `11a80dd00` fix(richtext): translate the editor toolbar, link dialog, and Tab escape hint (#7215)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：B5、F1b
  - 链接：https://github.com/facebook/astryx/commit/11a80dd007f8d6c97c9a4821af16cd6df9e64882
- [ ] `ae5e6f90c` fix(richtext): toolbar glyphs follow the active theme, and undo and redo mirror in RTL (#7216)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1b
  - 链接：https://github.com/facebook/astryx/commit/ae5e6f90c328b4f8b6c8db9a710b9f5f9ef2edb6
- [ ] `2c86d9dda` fix(richtext): keep toolbar controls on a 4px gutter (#7391)
  - 文件：packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 还涉及：F1b
  - 链接：https://github.com/facebook/astryx/commit/2c86d9dda12fc7b7d61ce7bb2a808eb29790e204

### docs

- [ ] `e71c4e9cb` docs(richtext): state that RichText's public surface is Lexical's, at one supported minor (#7562)
  - 文件：packages/richtext/README.md、packages/richtext/src/RichTextEditor.doc.mjs
  - 规范文档：packages/richtext/src/RichTextEditor.doc.mjs
  - 链接：https://github.com/facebook/astryx/commit/e71c4e9cbbd9069240cfa5de065a8dba71c7e1a3
- [ ] `2366a5833` docs(richtext): the README shows Core's, the theme's and richtext's prebuilt stylesheets (#7582)
  - 文件：packages/richtext/README.md
  - 还涉及：F1a
  - 链接：https://github.com/facebook/astryx/commit/2366a5833f6af35967515c01435b2c19fe203a7a

### 其它

- [ ] `f27f74937` chore(richtext): remove internal-only references from public source and docs (#6975)
  - 文件：packages/richtext/README.md
  - 还涉及：B1、F1b、F3f
  - 链接：https://github.com/facebook/astryx/commit/f27f74937a954529f408532a1782ab9602082e4f
