import { $n as $rewindSiblingCaret, Ar as $getSelection, Bn as $createParagraphNode, D as $isSiblingCaret, F as $getSlotHost, Fr as $isRangeSelection, Gr as $isTextNode, Hi as INSERT_TAB_COMMAND, Hn as ParagraphNode, Hr as TabNode, J as $create, Kn as $getCaretRangeInDirection, Kr as TextNode, Lr as $updateDOMSelection, Mt as getActiveElement, Na as numberValue, Nr as $isBlockElementNode, O as $isTextPointCaret, Ot as $setSelection, P as $getSlotFrame, Pr as $isNodeSelection, Qt as getStaticNodeConfig, Ri as INDENT_CONTENT_COMMAND, Rn as createEditor, Rt as getDOMSelection, Sa as createState, Si as CLICK_COMMAND, Sr as $createNodeSelection, T as $isChildCaret, Tn as toggleTextFormatType, Wn as $caretRangeFromSelection, Xt as getRegisteredSubtypeMap, Yi as KEY_DOWN_COMMAND, Yn as $isBlockFullySelected, Zn as $normalizeCaret, a as removeClassNamesFromElement, ao as TEXT_TYPE_TO_FORMAT, ar as $isLineBreakNode, at as $getNodeByKey, bi as CLEAR_EDITOR_COMMAND, br as $parseSerializedNode, cn as isExactShortcutMatch, ct as $getRoot, di as registerEventListener, dr as $isRootNode, ea as KEY_TAB_COMMAND, et as $getDocument, fa as createCommand, fr as RootNode, g as $getChildCaret, go as invariant, gr as ElementNode, h as $getCaretRange, ha as $getState, hi as compileKeyboardShortcuts, hr as $isElementNode, kr as $getPreviousSelection, la as SELECT_ALL_COMMAND, ma as $normalizeSelection, mi as CONTROL_OR_META, mr as DecoratorNode, n as mergeRegister, o as shallowMergeConfig, oi as SKIP_SCROLL_INTO_VIEW_TAG, or as LineBreakNode, pr as $isDecoratorNode, qa as LEXICAL_VERSION, r as addClassNamesToElement, ra as OUTDENT_CONTENT_COMMAND, rn as isDOMNode, s as safeCast, sa as SELECTION_CHANGE_COMMAND, si as SKIP_SELECTION_FOCUS_TAG, st as $getNodeFromDOMNode, t as registerEventListeners, ti as HISTORY_MERGE_TAG, tr as $setSelectionFromCaretRange, tt as $getEditor, u as defineExtension, ui as stopLexicalPropagation, un as isHTMLElement, uo as IS_APPLE, ur as $isEditorState, va as $setState, wi as COMPOSITION_START_COMMAND, wr as $createRangeSelection, wt as $selectAll, x as $getSiblingCaret, yn as keyboardEventMaskForPlatform } from "./src-BWdqgNjM.js";
import { B as selectionAlwaysOnDisplay, _ as $insertNodeToNearestRoot, m as $handleIndentAndOutdent, u as $getNearestBlockElementAncestorOrThrow } from "./src-9-5QzbBl.js";
//#region ../../node_modules/.pnpm/@preact+signals-core@1.14.4/node_modules/@preact/signals-core/dist/signals-core.module.js
var i = Symbol.for("preact-signals");
function t() {
	if (!(v > 1)) {
		var i, t = !1;
		(function() {
			var i = c;
			c = void 0;
			while (void 0 !== i) {
				var t = i.S;
				if (t.v === i.v) {
					for (var n = t.t; void 0 !== n; n = n.x) if (n.i === i.i) n.i = t.i;
				}
				i = i.o;
			}
		})();
		while (void 0 !== h) {
			var n = h;
			h = void 0;
			s++;
			while (void 0 !== n) {
				var r = n.u;
				n.u = void 0;
				n.f &= -3;
				if (!(8 & n.f) && w(n)) try {
					n.c();
				} catch (n) {
					if (!t) {
						i = n;
						t = !0;
					}
				}
				n = r;
			}
		}
		s = 0;
		v--;
		if (t) throw i;
	} else v--;
}
function n(i) {
	if (v > 0) return i();
	e = ++u;
	v++;
	try {
		return i();
	} finally {
		t();
	}
}
var r;
var o = void 0;
function f(i) {
	var t = o, n = r;
	o = void 0;
	r = void 0;
	try {
		return i();
	} finally {
		o = t;
		r = n;
	}
}
var h = void 0;
var v = 0;
var s = 0;
var u = 0;
var e = 0;
var c = void 0;
var d = 0;
function a(i) {
	if (void 0 !== o) {
		var t = i.n;
		if (void 0 === t || t.t !== o) {
			t = {
				i: 0,
				S: i,
				p: o.s,
				n: void 0,
				t: o,
				e: void 0,
				x: void 0,
				r: t
			};
			if (void 0 !== o.s) o.s.n = t;
			o.s = t;
			i.n = t;
			if (32 & o.f) i.S(t);
			return t;
		} else if (-1 === t.i) {
			t.i = 0;
			if (void 0 !== t.n) {
				t.n.p = t.p;
				if (void 0 !== t.p) t.p.n = t.n;
				t.p = o.s;
				t.n = void 0;
				o.s.n = t;
				o.s = t;
			}
			return t;
		}
	}
}
function l(i, t) {
	this.v = i;
	this.i = 0;
	this.n = void 0;
	this.t = void 0;
	this.l = 0;
	this.W = null == t ? void 0 : t.watched;
	this.Z = null == t ? void 0 : t.unwatched;
	this.name = null == t ? void 0 : t.name;
}
l.prototype.brand = i;
l.prototype.h = function() {
	return !0;
};
l.prototype.S = function(i) {
	var t = this, n = this.t;
	if (n !== i && void 0 === i.e) {
		i.x = n;
		this.t = i;
		if (void 0 !== n) n.e = i;
		else f(function() {
			var i;
			null == (i = t.W) || i.call(t);
		});
	}
};
l.prototype.U = function(i) {
	var t = this;
	if (void 0 !== this.t) {
		var n = i.e, r = i.x;
		if (void 0 !== n) {
			n.x = r;
			i.e = void 0;
		}
		if (void 0 !== r) {
			r.e = n;
			i.x = void 0;
		}
		if (i === this.t) {
			this.t = r;
			if (void 0 === r) f(function() {
				var i;
				null == (i = t.Z) || i.call(t);
			});
		}
	}
};
l.prototype.subscribe = function(i) {
	var t = this;
	return j(function() {
		var n = t.value;
		f(function() {
			return i(n);
		});
	}, { name: "sub" });
};
l.prototype.valueOf = function() {
	return this.value;
};
l.prototype.toString = function() {
	return this.value + "";
};
l.prototype.toJSON = function() {
	return this.value;
};
l.prototype.peek = function() {
	var i = this;
	return f(function() {
		return i.value;
	});
};
Object.defineProperty(l.prototype, "value", {
	get: function() {
		var i = a(this);
		if (void 0 !== i) i.i = this.i;
		return this.v;
	},
	set: function(i) {
		if (i !== this.v) {
			if (s > 100) throw new Error("Cycle detected");
			(function(i) {
				if (0 !== v && 0 === s) {
					if (i.l !== e) {
						i.l = e;
						c = {
							S: i,
							v: i.v,
							i: i.i,
							o: c
						};
					}
				}
			})(this);
			this.v = i;
			this.i++;
			d++;
			v++;
			try {
				for (var n = this.t; void 0 !== n; n = n.x) n.t.N();
			} finally {
				t();
			}
		}
	}
});
function y(i, t) {
	return new l(i, t);
}
function w(i) {
	for (var t = i.s; void 0 !== t; t = t.n) if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i) return !0;
	return !1;
}
function _(i) {
	for (var t = i.s; void 0 !== t; t = t.n) {
		var n = t.S.n;
		if (void 0 !== n) t.r = n;
		t.S.n = t;
		t.i = -1;
		if (void 0 === t.n) {
			i.s = t;
			break;
		}
	}
}
function b(i) {
	var t = i.s, n = void 0;
	while (void 0 !== t) {
		var r = t.p;
		if (-1 === t.i) {
			t.S.U(t);
			if (void 0 !== r) r.n = t.n;
			if (void 0 !== t.n) t.n.p = r;
		} else n = t;
		t.S.n = t.r;
		if (void 0 !== t.r) t.r = void 0;
		t = r;
	}
	i.s = n;
}
function p(i, t) {
	l.call(this, void 0, t);
	this.x = i;
	this.s = void 0;
	this.g = d - 1;
	this.f = 4;
}
p.prototype = new l();
p.prototype.h = function() {
	this.f &= -3;
	if (1 & this.f) return !1;
	if (32 == (36 & this.f)) return !0;
	this.f &= -5;
	if (this.g === d) return !0;
	this.g = d;
	this.f |= 1;
	if (this.i > 0 && !w(this)) {
		this.f &= -2;
		return !0;
	}
	var i = o;
	try {
		_(this);
		o = this;
		var t = this.x();
		if (16 & this.f || this.v !== t || 0 === this.i) {
			this.v = t;
			this.f &= -17;
			this.i++;
		}
	} catch (i) {
		this.v = i;
		this.f |= 16;
		this.i++;
	}
	o = i;
	b(this);
	this.f &= -2;
	return !0;
};
p.prototype.S = function(i) {
	if (void 0 === this.t) {
		this.f |= 36;
		for (var t = this.s; void 0 !== t; t = t.n) t.S.S(t);
	}
	l.prototype.S.call(this, i);
};
p.prototype.U = function(i) {
	if (void 0 !== this.t) {
		l.prototype.U.call(this, i);
		if (void 0 === this.t) {
			this.f &= -33;
			for (var t = this.s; void 0 !== t; t = t.n) t.S.U(t);
		}
	}
};
p.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 6;
		for (var i = this.t; void 0 !== i; i = i.x) i.t.N();
	}
};
Object.defineProperty(p.prototype, "value", { get: function() {
	if (1 & this.f) throw new Error("Cycle detected");
	var i = a(this);
	this.h();
	if (void 0 !== i) i.i = this.i;
	if (16 & this.f) throw this.v;
	return this.v;
} });
function g(i, t) {
	return new p(i, t);
}
function S(i) {
	var n = i.m;
	i.m = void 0;
	if ("function" == typeof n) {
		v++;
		var r = o;
		o = void 0;
		try {
			n();
		} catch (t) {
			i.f &= -2;
			i.f |= 8;
			m(i);
			throw t;
		} finally {
			o = r;
			t();
		}
	}
}
function m(i) {
	for (var t = i.s; void 0 !== t; t = t.n) t.S.U(t);
	i.x = void 0;
	i.s = void 0;
	S(i);
}
function x(i) {
	if (o !== this) throw new Error("Out-of-order effect");
	b(this);
	o = i;
	this.f &= -2;
	if (8 & this.f) m(this);
	t();
}
function E(i, t) {
	this.x = i;
	this.m = void 0;
	this.s = void 0;
	this.u = void 0;
	this.f = 32;
	this.name = null == t ? void 0 : t.name;
	if (r) r.push(this);
}
E.prototype.c = function() {
	var i = this.S();
	try {
		if (8 & this.f) return;
		if (void 0 === this.x) return;
		var t = this.x();
		if ("function" == typeof t) this.m = t;
	} finally {
		i();
	}
};
E.prototype.S = function() {
	if (1 & this.f) throw new Error("Cycle detected");
	this.f |= 1;
	this.f &= -9;
	S(this);
	_(this);
	v++;
	var i = o;
	o = this;
	return x.bind(this, i);
};
E.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 2;
		this.u = h;
		h = this;
	}
};
E.prototype.d = function() {
	this.f |= 8;
	if (!(1 & this.f)) m(this);
};
E.prototype.dispose = function() {
	this.d();
};
function j(i, t) {
	var n = new E(i, t);
	try {
		n.c();
	} catch (i) {
		n.d();
		throw i;
	}
	var r = n.d.bind(n);
	r[Symbol.dispose] = r;
	return r;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/namedSignals.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Return an object with the same shape as `defaults` with a {@link Signal}
* for each value. If specified, the second `opts` argument is a partial
* of overrides to the defaults and will be used as the initial value.
*
* Typically used to make a reactive version of some subset of the
* configuration of an extension, so it can be reconfigured at runtime.
*
* @param defaults The object with default values
* @param opts Overrides to those default values
* @returns An object with signals initialized with the default values
*/
function namedSignals(defaults, opts = {}) {
	const initial = {};
	for (const k in defaults) {
		const v = opts[k];
		initial[k] = y(v === void 0 ? defaults[k] : v);
	}
	return initial;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/AutoFocusExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* An Extension to focus the LexicalEditor when the root element is set
* (typically only when the editor is first created).
*/
var AutoFocusExtension = defineExtension({
	build: (editor, config, state) => {
		return namedSignals(config);
	},
	config: safeCast({
		defaultSelection: "rootEnd",
		disabled: false
	}),
	name: "@lexical/extension/AutoFocus",
	register(editor, config, state) {
		const stores = state.getOutput();
		return j(() => stores.disabled.value ? void 0 : editor.registerRootListener((rootElement) => {
			editor.focus(() => {
				const activeElement = rootElement !== null ? getActiveElement(rootElement) : null;
				if (rootElement !== null && (activeElement === null || !rootElement.contains(activeElement))) rootElement.focus({ preventScroll: true });
			}, { defaultSelection: stores.defaultSelection.peek() });
		}));
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/ClearEditorExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $defaultOnClear() {
	const root = $getRoot();
	const selection = $getSelection();
	const paragraph = $createParagraphNode();
	root.clear();
	root.append(paragraph);
	if (selection !== null) paragraph.select();
	if ($isRangeSelection(selection)) selection.format = 0;
}
function registerClearEditor(editor, $onClear = $defaultOnClear) {
	return editor.registerCommand(CLEAR_EDITOR_COMMAND, () => {
		$onClear();
		return true;
	}, 0);
}
/**
* An extension to provide an implementation of {@link CLEAR_EDITOR_COMMAND}
*/
var ClearEditorExtension = defineExtension({
	build(editor, config, state) {
		return namedSignals(config);
	},
	config: safeCast({ $onClear: $defaultOnClear }),
	name: "@lexical/extension/ClearEditor",
	register(editor, config, state) {
		const { $onClear } = state.getOutput();
		return j(() => registerClearEditor(editor, $onClear.value));
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/ClickAfterLastBlockExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* @experimental
*
* Default predicate matches {@link DecoratorNode} and shadow-root
* `ElementNode`s (e.g. `TableNode`). Apps that want to also trigger on
* other node types — `CodeNode`, custom non-editable blocks — should
* compose this default in their own predicate rather than re-deriving
* the check:
*
* ```ts
* configExtension(ClickAfterLastBlockExtension, {
*   $shouldInsertAfter: (node) =>
*     $defaultShouldInsertAfter(node) || $isCodeNode(node),
* });
* ```
*/
function $defaultShouldInsertAfter(node) {
	if ($isDecoratorNode(node)) return true;
	if ($isElementNode(node) && node.isShadowRoot()) return true;
	return false;
}
/**
* Decide whether a click at `event` should be claimed by this extension.
* Used by both the mousedown listener (to call preventDefault on the
* browser's native caret pick) and the click listener (to actually
* insert the paragraph). Factored out so the two handlers stay in sync
* — they would otherwise share ~22 lines of byte-for-byte identical
* logic and have to be maintained together.
*
* Read-only because it is called outside an editor.update; mutation
* happens in the click handler's editor.update below.
*/
function shouldClaimClick(editor, rootElement, event, $shouldInsertAfter) {
	if (!editor.isEditable()) return false;
	if (event.target !== rootElement) return false;
	return editor.read("latest", () => {
		const lastChild = $getRoot().getLastChild();
		if (lastChild === null) return false;
		const lastChildDOM = editor.getElementByKey(lastChild.getKey());
		if (lastChildDOM === null) return false;
		if (event.clientY <= lastChildDOM.getBoundingClientRect().bottom) return false;
		return $shouldInsertAfter(lastChild);
	});
}
/**
* Click handling for the empty area below the last block of the document.
*
* Without this extension, clicking the area below the last block when that
* block is a {@link DecoratorNode}, a shadow-root ElementNode (e.g.
* `TableNode`), or any other block that doesn't accept the click naturally
* leaves the selection in an awkward place — `null` for a bare decorator,
* or at the end of a table cell. Users typically expect a new paragraph
* to appear below the block with the caret in it, matching the behavior
* of editors like Notion.
*
* This extension intercepts clicks under those conditions, inserts a new
* empty paragraph after the last block, and selects it.
*
* Closes #8544.
*/
var ClickAfterLastBlockExtension = defineExtension({
	build: (_editor, config) => namedSignals(config),
	config: safeCast({
		$shouldInsertAfter: $defaultShouldInsertAfter,
		disabled: false
	}),
	name: "@lexical/ClickAfterLastBlock",
	register: (editor, _config, _state) => j(() => {
		const output = _state.getOutput();
		if (output.disabled.value) return;
		return editor.registerRootListener((rootElement) => {
			if (rootElement === null) return;
			const onMouseDown = (event) => {
				if (shouldClaimClick(editor, rootElement, event, output.$shouldInsertAfter.peek())) event.preventDefault();
			};
			const onClick = (event) => {
				if (!shouldClaimClick(editor, rootElement, event, output.$shouldInsertAfter.peek())) return;
				event.preventDefault();
				stopLexicalPropagation(event);
				editor.update(() => {
					const lastChild = $getRoot().getLastChild();
					if (lastChild === null) return;
					if (!output.$shouldInsertAfter.peek()(lastChild)) return;
					const paragraph = $createParagraphNode();
					lastChild.insertAfter(paragraph);
					paragraph.select();
				});
			};
			return registerEventListeners(rootElement, {
				click: onClick,
				mousedown: onMouseDown
			}, true);
		});
	})
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/config.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Get the sets of nodes and types registered in the
* {@link InitialEditorConfig}. This is to be used when an extension
* needs to register optional behavior if some node or type is present.
*
* @param config The InitialEditorConfig (accessible from an extension's init)
* @returns The known types and nodes as Sets
*/
function getKnownTypesAndNodes(config) {
	const types = /* @__PURE__ */ new Set();
	const nodes = /* @__PURE__ */ new Set();
	for (const klassOrReplacement of getNodeConfig(config)) {
		const klass = typeof klassOrReplacement === "function" ? klassOrReplacement : klassOrReplacement.replace;
		getStaticNodeConfig(klass);
		types.add(klass.getType());
		nodes.add(klass);
	}
	return {
		nodes,
		types
	};
}
function getNodeConfig(config) {
	return (typeof config.nodes === "function" ? config.nodes() : config.nodes) || [];
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/DecoratorTextExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var formatState = createState("format", { parse: numberValue() });
var DecoratorTextNode = class extends DecoratorNode {
	/** @internal */
	get __isInlineFormattable() {
		return true;
	}
	$config() {
		return this.config("decorator-text", {
			extends: DecoratorNode,
			stateConfigs: [{
				flat: true,
				stateConfig: formatState
			}]
		});
	}
	getFormat(version) {
		return $getState(this, formatState, version);
	}
	getFormatFlags(type, alignWithFormat) {
		return toggleTextFormatType(this.getFormat(), type, alignWithFormat);
	}
	hasFormat(type) {
		const formatFlag = TEXT_TYPE_TO_FORMAT[type];
		return (this.getFormat() & formatFlag) !== 0;
	}
	setFormat(type) {
		return $setState(this, formatState, type);
	}
	toggleFormat(type) {
		const format = this.getFormat();
		const newFormat = toggleTextFormatType(format, type, null);
		return this.setFormat(newFormat);
	}
	isInline() {
		return true;
	}
	createDOM(config, editor) {
		return $getDocument().createElement("span");
	}
};
function $isDecoratorTextNode(node) {
	return node instanceof DecoratorTextNode;
}
/**
* Applies formatting to the node based on the properties in the passed style object.
* By default, properties are checked according to the values set
* when importing content from Google Docs.
* This algorithm is identical to the TextNode import.

* @param lexicalNode The node to which the format will apply
* @param style CSS style object
* @param shouldApply format to apply if it is not in style
* @returns lexicalNode
*/
function applyFormatFromStyle(lexicalNode, style, shouldApply) {
	const fontWeight = style.fontWeight;
	const textDecoration = style.textDecoration.split(" ");
	const hasBoldFontWeight = fontWeight === "700" || fontWeight === "bold";
	const hasLinethroughTextDecoration = textDecoration.includes("line-through");
	const hasItalicFontStyle = style.fontStyle === "italic";
	const hasUnderlineTextDecoration = textDecoration.includes("underline");
	const verticalAlign = style.verticalAlign;
	if (hasBoldFontWeight && !lexicalNode.hasFormat("bold")) lexicalNode.toggleFormat("bold");
	if (hasLinethroughTextDecoration && !lexicalNode.hasFormat("strikethrough")) lexicalNode.toggleFormat("strikethrough");
	if (hasItalicFontStyle && !lexicalNode.hasFormat("italic")) lexicalNode.toggleFormat("italic");
	if (hasUnderlineTextDecoration && !lexicalNode.hasFormat("underline")) lexicalNode.toggleFormat("underline");
	if (verticalAlign === "sub" && !lexicalNode.hasFormat("subscript")) lexicalNode.toggleFormat("subscript");
	if (verticalAlign === "super" && !lexicalNode.hasFormat("superscript")) lexicalNode.toggleFormat("superscript");
	if (shouldApply && !lexicalNode.hasFormat(shouldApply)) lexicalNode.toggleFormat(shouldApply);
	return lexicalNode;
}
/**
* The function wraps the passed DOM node in semantic tags depending on the node format.
*
* @param lexicalNode The node where the format is checked
* @param domNode DOM that will be wrapped in tags
* @param tagNameToFormat Tag name and format mapping
* @returns domNode
*/
function applyFormatToDom(lexicalNode, domNode, tagNameToFormat = DEFAULT_TAG_NAME_TO_FORMAT) {
	let rval = domNode;
	for (const [tag, format] of Object.entries(tagNameToFormat)) if (lexicalNode.hasFormat(format)) rval = wrapElementWith(rval, tag);
	return rval;
}
/**
* @deprecated Use {@link applyFormatToDom} instead. The `$` prefix was a
* mistake in the 0.47 release: the implementation does not read any editor
* state, so the dollar convention does not apply. This alias is kept for
* compatibility with 0.47.
*/
var $applyFormatToDom = applyFormatToDom;
function wrapElementWith(element, tag) {
	const el = element.ownerDocument.createElement(tag);
	el.appendChild(element);
	return el;
}
var DEFAULT_TAG_NAME_TO_FORMAT = {
	b: "bold",
	code: "code",
	em: "italic",
	i: "italic",
	mark: "highlight",
	s: "strikethrough",
	strong: "bold",
	sub: "subscript",
	sup: "superscript",
	u: "underline"
};
/**
* An extension that registers DecoratorTextNode with the editor.
*/
var DecoratorTextExtension = defineExtension({
	name: "@lexical/extension/DecoratorText",
	nodes: () => [DecoratorTextNode]
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/watchedSignal.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Create a Signal that will subscribe to a value from an external store when watched, similar to
* React's [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore).
*
* @param getSnapshot Used to get the initial value of the signal when created and when first watched.
* @param register A callback that will subscribe to some external store and update the signal, must return a dispose function.
* @returns The signal
*/
function watchedSignal(getSnapshot, register) {
	let dispose;
	return y(getSnapshot(), {
		unwatched() {
			if (dispose) {
				dispose();
				dispose = void 0;
			}
		},
		watched() {
			this.value = getSnapshot();
			dispose = register(this);
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/EditorStateExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* An extension to provide the current EditorState as a signal
*/
var EditorStateExtension = defineExtension({
	build(editor) {
		return watchedSignal(() => editor.getEditorState(), (editorStateSignal) => editor.registerUpdateListener((payload) => {
			editorStateSignal.value = payload.editorState;
		}));
	},
	name: "@lexical/extension/EditorState"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/InitialStateExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var HISTORY_MERGE_OPTIONS = { tag: HISTORY_MERGE_TAG };
function $defaultInitializer() {
	const root = $getRoot();
	if (root.isEmpty()) root.append($createParagraphNode());
}
/**
* An extension to set the initial state of the editor from
* a function or serialized JSON EditorState. This is
* implicitly included with all editors built with
* Lexical Extension. This happens in the `afterRegistration`
* phase so your initial state may depend on registered commands,
* but you should not call `editor.setRootElement` earlier than
* this phase to avoid rendering an empty editor first.
*/
var InitialStateExtension = defineExtension({
	config: safeCast({
		setOptions: HISTORY_MERGE_OPTIONS,
		updateOptions: HISTORY_MERGE_OPTIONS
	}),
	init({ $initialEditorState = $defaultInitializer }) {
		return {
			$initialEditorState,
			initialized: false
		};
	},
	afterRegistration(editor, { updateOptions, setOptions }, state) {
		const initResult = state.getInitResult();
		if (!initResult.initialized) {
			initResult.initialized = true;
			const { $initialEditorState } = initResult;
			if ($isEditorState($initialEditorState)) editor.setEditorState($initialEditorState, setOptions);
			else if (typeof $initialEditorState === "function") editor.update(() => {
				$initialEditorState(editor);
			}, updateOptions);
			else if ($initialEditorState && (typeof $initialEditorState === "string" || typeof $initialEditorState === "object")) {
				const parsedEditorState = editor.parseEditorState($initialEditorState);
				editor.setEditorState(parsedEditorState, setOptions);
			}
		}
		return () => {};
	},
	name: "@lexical/extension/InitialState",
	nodes: [
		RootNode,
		TextNode,
		LineBreakNode,
		TabNode,
		ParagraphNode
	]
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/internal/deepThemeMergeInPlace.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Recursively merge the given theme configuration in-place.
*
* @returns If `a` and `b` are both objects (and `b` is not an Array) then
* all keys in `b` are merged into `a` then `a` is returned.
* Otherwise `b` is returned.
*
* @example
* ```ts
* const a = { a: "a", nested: { a: 1 } };
* const b = { b: "b", nested: { b: 2 } };
* const rval = deepThemeMergeInPlace(a, b);
* expect(a).toBe(rval);
* expect(a).toEqual({ a: "a", b: "b", nested: { a: 1, b: 2 } });
* ```
*/
var UNSAFE_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function deepThemeMergeInPlace(a, b) {
	if (a && b && !Array.isArray(b) && typeof a === "object" && typeof b === "object") {
		const aObj = a;
		const bObj = b;
		for (const k in bObj) {
			if (UNSAFE_KEYS.has(k) || !Object.prototype.hasOwnProperty.call(bObj, k)) continue;
			aObj[k] = deepThemeMergeInPlace(aObj[k], bObj[k]);
		}
		return a;
	}
	return b;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/internal/ExtensionRep.ts
var ExtensionRepStateIds = {
	unmarked: 0,
	temporary: 1,
	permanent: 2,
	configured: 3,
	initialized: 4,
	built: 5,
	registered: 6,
	afterRegistration: 7
};
function isExactlyUnmarkedExtensionRepState(state) {
	return state.id === ExtensionRepStateIds.unmarked;
}
function isExactlyTemporaryExtensionRepState(state) {
	return state.id === ExtensionRepStateIds.temporary;
}
function isExactlyPermanentExtensionRepState(state) {
	return state.id === ExtensionRepStateIds.permanent;
}
function isConfiguredExtensionRepState(state) {
	return state.id >= ExtensionRepStateIds.configured;
}
function isInitializedExtensionRepState(state) {
	return state.id >= ExtensionRepStateIds.initialized;
}
function isBuiltExtensionRepState(state) {
	return state.id >= ExtensionRepStateIds.built;
}
function isAfterRegistrationState(state) {
	return state.id >= ExtensionRepStateIds.afterRegistration;
}
function applyTemporaryMark(state) {
	invariant(isExactlyUnmarkedExtensionRepState(state), "LexicalBuilder: Can not apply a temporary mark from state id %s (expected %s unmarked)", String(state.id), String(ExtensionRepStateIds.unmarked));
	return Object.assign(state, { id: ExtensionRepStateIds.temporary });
}
function applyPermanentMark(state) {
	invariant(isExactlyTemporaryExtensionRepState(state), "LexicalBuilder: Can not apply a permanent mark from state id %s (expected %s temporary)", String(state.id), String(ExtensionRepStateIds.temporary));
	return Object.assign(state, { id: ExtensionRepStateIds.permanent });
}
function applyConfiguredState(state, config, registerState) {
	return Object.assign(state, {
		config,
		id: ExtensionRepStateIds.configured,
		registerState
	});
}
function applyInitializedState(state, initResult, registerState) {
	return Object.assign(state, {
		id: ExtensionRepStateIds.initialized,
		initResult,
		registerState
	});
}
function applyBuiltState(state, output, registerState) {
	return Object.assign(state, {
		id: ExtensionRepStateIds.built,
		output,
		registerState
	});
}
function applyRegisteredState(state) {
	return Object.assign(state, { id: ExtensionRepStateIds.registered });
}
function applyAfterRegistrationState(state) {
	return Object.assign(state, { id: ExtensionRepStateIds.afterRegistration });
}
function rollbackToBuiltState(state) {
	return Object.assign(state, { id: ExtensionRepStateIds.built });
}
var emptySet = /* @__PURE__ */ new Set();
/**
* @internal
*/
var ExtensionRep = class {
	builder;
	configs;
	_dependency;
	_peerNameSet;
	extension;
	state;
	_signal;
	constructor(builder, extension) {
		this.builder = builder;
		this.extension = extension;
		this.configs = /* @__PURE__ */ new Set();
		this.state = { id: ExtensionRepStateIds.unmarked };
	}
	mergeConfigs() {
		let config = this.extension.config || {};
		const mergeConfig = this.extension.mergeConfig ? this.extension.mergeConfig.bind(this.extension) : shallowMergeConfig;
		for (const cfg of this.configs) config = mergeConfig(config, cfg);
		return config;
	}
	init(editorConfig) {
		const initialState = this.state;
		invariant(isExactlyPermanentExtensionRepState(initialState), "ExtensionRep: Can not configure from state id %s", String(initialState.id));
		const initState = {
			getDependency: this.getInitDependency.bind(this),
			getDirectDependentNames: this.getDirectDependentNames.bind(this),
			getPeer: this.getInitPeer.bind(this),
			getPeerNameSet: this.getPeerNameSet.bind(this)
		};
		const buildState = {
			...initState,
			getDependency: this.getDependency.bind(this),
			getInitResult: this.getInitResult.bind(this),
			getPeer: this.getPeer.bind(this)
		};
		const state = applyConfiguredState(initialState, this.mergeConfigs(), initState);
		this.state = state;
		let initResult;
		if (this.extension.init) initResult = this.extension.init(editorConfig, state.config, initState);
		this.state = applyInitializedState(state, initResult, buildState);
	}
	build(editor) {
		const state = this.state;
		invariant(state.id === ExtensionRepStateIds.initialized, "ExtensionRep: register called in state id %s (expected %s initialized)", String(state.id), String(ExtensionRepStateIds.built));
		let output;
		if (this.extension.build) output = this.extension.build(editor, state.config, state.registerState);
		const registerState = {
			...state.registerState,
			getOutput: () => output,
			getSignal: this.getSignal.bind(this)
		};
		this.state = applyBuiltState(state, output, registerState);
	}
	register(editor, signal) {
		this._signal = signal;
		const state = this.state;
		invariant(state.id === ExtensionRepStateIds.built, "ExtensionRep: register called in state id %s (expected %s built)", String(state.id), String(ExtensionRepStateIds.built));
		const cleanup = this.extension.register && this.extension.register(editor, state.config, state.registerState);
		this.state = applyRegisteredState(state);
		return () => {
			const afterRegistrationState = this.state;
			invariant(afterRegistrationState.id === ExtensionRepStateIds.afterRegistration, "ExtensionRep: rollbackToBuiltState called in state id %s (expected %s afterRegistration)", String(state.id), String(ExtensionRepStateIds.afterRegistration));
			this.state = rollbackToBuiltState(afterRegistrationState);
			if (cleanup) cleanup();
		};
	}
	afterRegistration(editor) {
		const state = this.state;
		invariant(state.id === ExtensionRepStateIds.registered, "ExtensionRep: afterRegistration called in state id %s (expected %s registered)", String(state.id), String(ExtensionRepStateIds.registered));
		let rval;
		if (this.extension.afterRegistration) rval = this.extension.afterRegistration(editor, state.config, state.registerState);
		this.state = applyAfterRegistrationState(state);
		return rval;
	}
	getSignal() {
		invariant(this._signal !== void 0, "ExtensionRep.getSignal() called before register");
		return this._signal;
	}
	getInitResult() {
		invariant(this.extension.init !== void 0, "ExtensionRep: getInitResult() called for Extension %s that does not define init", this.extension.name);
		const state = this.state;
		invariant(isInitializedExtensionRepState(state), "ExtensionRep: getInitResult() called for ExtensionRep in state id %s < %s (initialized)", String(state.id), String(ExtensionRepStateIds.initialized));
		return state.initResult;
	}
	getInitPeer(name) {
		const rep = this.builder.extensionNameMap.get(name);
		return rep ? rep.getExtensionInitDependency() : void 0;
	}
	getExtensionInitDependency() {
		const state = this.state;
		invariant(isConfiguredExtensionRepState(state), "ExtensionRep: getExtensionInitDependency called in state id %s (expected >= %s configured)", String(state.id), String(ExtensionRepStateIds.configured));
		return { config: state.config };
	}
	getPeer(name) {
		const rep = this.builder.extensionNameMap.get(name);
		return rep ? rep.getExtensionDependency() : void 0;
	}
	getInitDependency(dep) {
		const rep = this.builder.getExtensionRep(dep);
		invariant(rep !== void 0, "LexicalExtensionBuilder: Extension %s missing dependency extension %s to be in registry", this.extension.name, dep.name);
		return rep.getExtensionInitDependency();
	}
	getDependency(dep) {
		const rep = this.builder.getExtensionRep(dep);
		invariant(rep !== void 0, "LexicalExtensionBuilder: Extension %s missing dependency extension %s to be in registry", this.extension.name, dep.name);
		return rep.getExtensionDependency();
	}
	getState() {
		const state = this.state;
		invariant(isAfterRegistrationState(state), "ExtensionRep getState called in state id %s (expected %s afterRegistration)", String(state.id), String(ExtensionRepStateIds.afterRegistration));
		return state;
	}
	getDirectDependentNames() {
		return this.builder.incomingEdges.get(this.extension.name) || emptySet;
	}
	getPeerNameSet() {
		let s = this._peerNameSet;
		if (!s) {
			s = new Set((this.extension.peerDependencies || []).map(([name]) => name));
			this._peerNameSet = s;
		}
		return s;
	}
	getExtensionDependency() {
		if (!this._dependency) {
			const state = this.state;
			invariant(isBuiltExtensionRepState(state), "Extension %s used as a dependency before build", this.extension.name);
			this._dependency = {
				config: state.config,
				init: state.initResult,
				output: state.output
			};
		}
		return this._dependency;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/LexicalBuilder.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/** @internal Use a well-known symbol for dev tools purposes */
var builderSymbol = Symbol.for("@lexical/extension/LexicalBuilder");
/**
* Build a LexicalEditor by combining together one or more extensions, optionally
* overriding some of their configuration.
*
* @param extensions - Extension arguments (extensions or extensions with config overrides)
* @returns An editor handle
*
* @example
* A single root extension with multiple dependencies
*
* ```ts
* const editor = buildEditorFromExtensions(
*   defineExtension({
*     name: "[root]",
*     dependencies: [
*       RichTextExtension,
*       configExtension(EmojiExtension, { emojiBaseUrl: "/assets/emoji" }),
*     ],
*     register: (editor: LexicalEditor) => {
*       console.log("Editor Created");
*       return () => console.log("Editor Disposed");
*     },
*   }),
* );
* ```
*
* @example
* A very similar minimal configuration without the register hook
*
* ```ts
* const editor = buildEditorFromExtensions(
*   RichTextExtension,
*   configExtension(EmojiExtension, { emojiBaseUrl: "/assets/emoji" }),
* );
* ```
*/
function buildEditorFromExtensions(...extensions) {
	return LexicalBuilder.fromExtensions(extensions).buildEditor();
}
/** @internal */
function noop() {}
/** Throw the given Error */
function defaultOnError(err) {
	throw err;
}
/** @internal */
function maybeWithBuilder(editor) {
	return editor;
}
function normalizeExtensionArgument(arg) {
	return Array.isArray(arg) ? arg : [arg];
}
var PACKAGE_VERSION = LEXICAL_VERSION;
/** @internal */
var LexicalBuilder = class LexicalBuilder {
	roots;
	extensionNameMap;
	outgoingConfigEdges;
	incomingEdges;
	conflicts;
	_sortedExtensionReps;
	PACKAGE_VERSION;
	constructor(roots) {
		this.outgoingConfigEdges = /* @__PURE__ */ new Map();
		this.incomingEdges = /* @__PURE__ */ new Map();
		this.extensionNameMap = /* @__PURE__ */ new Map();
		this.conflicts = /* @__PURE__ */ new Map();
		this.PACKAGE_VERSION = PACKAGE_VERSION;
		this.roots = roots;
		for (const extension of roots) this.addExtension(extension);
	}
	static fromExtensions(extensions) {
		const roots = [normalizeExtensionArgument(InitialStateExtension)];
		for (const extension of extensions) roots.push(normalizeExtensionArgument(extension));
		return new LexicalBuilder(roots);
	}
	static maybeFromEditor(editor) {
		const builder = maybeWithBuilder(editor)[builderSymbol];
		if (builder) {
			invariant(builder.PACKAGE_VERSION === PACKAGE_VERSION, "LexicalBuilder.fromEditor: The given editor was created with LexicalBuilder %s but this version is %s. A project should have exactly one copy of LexicalBuilder", builder.PACKAGE_VERSION, PACKAGE_VERSION);
			invariant(builder instanceof LexicalBuilder, "LexicalBuilder.fromEditor: There are multiple copies of the same version of LexicalBuilder in your project, and this editor was created with another one. Your project, or one of its dependencies, has its package.json and/or bundler configured incorrectly.");
		}
		return builder;
	}
	/** Look up the editor that was created by this LexicalBuilder or throw */
	static fromEditor(editor) {
		const builder = LexicalBuilder.maybeFromEditor(editor);
		invariant(builder !== void 0, "LexicalBuilder.fromEditor: The given editor was not created with LexicalBuilder");
		return builder;
	}
	constructEditor() {
		const { $initialEditorState: _$initialEditorState, onError, onWarn, ...editorConfig } = this.buildCreateEditorArgs();
		const editor = Object.assign(createEditor({
			...editorConfig,
			...onError ? { onError: (err) => {
				onError(err, editor);
			} } : {},
			...onWarn ? { onWarn: (err) => {
				onWarn(err, editor);
			} } : {}
		}), { [builderSymbol]: this });
		for (const extensionRep of this.sortedExtensionReps()) extensionRep.build(editor);
		return editor;
	}
	buildEditor() {
		let disposeOnce = noop;
		function dispose() {
			try {
				disposeOnce();
			} finally {
				disposeOnce = noop;
			}
		}
		const editor = Object.assign(this.constructEditor(), {
			dispose,
			[Symbol.dispose]: dispose
		});
		disposeOnce = mergeRegister(this.registerEditor(editor), () => editor.setRootElement(null));
		return editor;
	}
	hasExtensionByName(name) {
		return this.extensionNameMap.has(name);
	}
	getExtensionRep(extension) {
		const rep = this.extensionNameMap.get(extension.name);
		if (rep) {
			invariant(rep.extension === extension, "LexicalBuilder: A registered extension with name %s exists but does not match the given extension", extension.name);
			return rep;
		}
	}
	/**
	* @param configs - Ownership passes to the builder, which retains the array
	*   and may append to it. Callers must pass an array nobody else holds.
	*/
	addEdge(fromExtensionName, toExtensionName, configs) {
		const outgoing = this.outgoingConfigEdges.get(fromExtensionName);
		if (outgoing) {
			const existing = outgoing.get(toExtensionName);
			if (existing) existing.push(...configs);
			else outgoing.set(toExtensionName, configs);
		} else this.outgoingConfigEdges.set(fromExtensionName, /* @__PURE__ */ new Map([[toExtensionName, configs]]));
		const incoming = this.incomingEdges.get(toExtensionName);
		if (incoming) incoming.add(fromExtensionName);
		else this.incomingEdges.set(toExtensionName, /* @__PURE__ */ new Set([fromExtensionName]));
	}
	addExtension(arg) {
		invariant(this._sortedExtensionReps === void 0, "LexicalBuilder: addExtension called after finalization");
		const [extension] = normalizeExtensionArgument(arg);
		invariant(typeof extension.name === "string", "LexicalBuilder: extension name must be string, not %s", typeof extension.name);
		let extensionRep = this.extensionNameMap.get(extension.name);
		invariant(extensionRep === void 0 || extensionRep.extension === extension, "LexicalBuilder: Multiple extensions registered with name %s, names must be unique", extension.name);
		if (!extensionRep) {
			extensionRep = new ExtensionRep(this, extension);
			this.extensionNameMap.set(extension.name, extensionRep);
			const hasConflict = this.conflicts.get(extension.name);
			if (typeof hasConflict === "string") invariant(false, "LexicalBuilder: extension %s conflicts with %s", extension.name, hasConflict);
			for (const name of extension.conflictsWith || []) {
				invariant(!this.extensionNameMap.has(name), "LexicalBuilder: extension %s conflicts with %s", extension.name, name);
				this.conflicts.set(name, extension.name);
			}
			for (const dep of extension.dependencies || []) {
				const normDep = normalizeExtensionArgument(dep);
				this.addEdge(extension.name, normDep[0].name, normDep.slice(1));
				this.addExtension(normDep);
			}
			for (const [depName, config] of extension.peerDependencies || []) this.addEdge(extension.name, depName, config ? [config] : []);
		}
	}
	sortedExtensionReps() {
		if (this._sortedExtensionReps) return this._sortedExtensionReps;
		const sortedExtensionReps = [];
		const visit = (rep, fromExtensionName) => {
			let mark = rep.state;
			if (isExactlyPermanentExtensionRepState(mark)) return;
			const extensionName = rep.extension.name;
			invariant(isExactlyUnmarkedExtensionRepState(mark), "LexicalBuilder: Circular dependency detected for Extension %s from %s", extensionName, fromExtensionName || "[unknown]");
			mark = applyTemporaryMark(mark);
			rep.state = mark;
			const outgoingConfigEdges = this.outgoingConfigEdges.get(extensionName);
			if (outgoingConfigEdges) for (const toExtensionName of outgoingConfigEdges.keys()) {
				const toRep = this.extensionNameMap.get(toExtensionName);
				if (toRep) visit(toRep, extensionName);
			}
			mark = applyPermanentMark(mark);
			rep.state = mark;
			sortedExtensionReps.push(rep);
		};
		for (const rep of this.extensionNameMap.values()) if (isExactlyUnmarkedExtensionRepState(rep.state)) visit(rep);
		for (const rep of sortedExtensionReps) for (const [toExtensionName, configs] of this.outgoingConfigEdges.get(rep.extension.name) || []) if (configs.length > 0) {
			const toRep = this.extensionNameMap.get(toExtensionName);
			if (toRep) for (const config of configs) toRep.configs.add(config);
		}
		for (const [extension, ...configs] of this.roots) if (configs.length > 0) {
			const toRep = this.extensionNameMap.get(extension.name);
			invariant(toRep !== void 0, "LexicalBuilder: Expecting existing ExtensionRep for %s", extension.name);
			for (const config of configs) toRep.configs.add(config);
		}
		this._sortedExtensionReps = sortedExtensionReps;
		return this._sortedExtensionReps;
	}
	registerEditor(editor) {
		const extensionReps = this.sortedExtensionReps();
		const controller = new AbortController();
		const cleanups = [() => controller.abort()];
		const signal = controller.signal;
		for (const extensionRep of extensionReps) {
			const cleanup = extensionRep.register(editor, signal);
			if (cleanup) cleanups.push(cleanup);
		}
		for (const extensionRep of extensionReps) {
			const cleanup = extensionRep.afterRegistration(editor);
			if (cleanup) cleanups.push(cleanup);
		}
		return mergeRegister(...cleanups);
	}
	buildCreateEditorArgs() {
		const config = {};
		const nodes = /* @__PURE__ */ new Set();
		const replacedNodes = /* @__PURE__ */ new Map();
		const htmlExport = /* @__PURE__ */ new Map();
		const htmlImport = {};
		const theme = {};
		const extensionReps = this.sortedExtensionReps();
		for (const extensionRep of extensionReps) {
			const { extension } = extensionRep;
			if (extension.onError !== void 0) config.onError = extension.onError;
			if (extension.onWarn !== void 0) config.onWarn = extension.onWarn;
			if (extension.disableEvents !== void 0) config.disableEvents = extension.disableEvents;
			if (extension.parentEditor !== void 0) config.parentEditor = extension.parentEditor;
			if (extension.editable !== void 0) config.editable = extension.editable;
			if (extension.namespace !== void 0) config.namespace = extension.namespace;
			if (extension.$initialEditorState !== void 0) config.$initialEditorState = extension.$initialEditorState;
			if (extension.nodes) for (const node of getNodeConfig(extension)) {
				if (typeof node !== "function") {
					const conflictExtension = replacedNodes.get(node.replace);
					if (conflictExtension) invariant(false, "LexicalBuilder: Extension %s can not register replacement for node %s because %s already did", extension.name, node.replace.name, conflictExtension.extension.name);
					replacedNodes.set(node.replace, extensionRep);
				}
				nodes.add(node);
			}
			if (extension.html) {
				if (extension.html.export) for (const [k, v] of extension.html.export.entries()) htmlExport.set(k, v);
				if (extension.html.import) Object.assign(htmlImport, extension.html.import);
			}
			if (extension.theme) deepThemeMergeInPlace(theme, extension.theme);
		}
		if (Object.keys(theme).length > 0) config.theme = theme;
		if (nodes.size) config.nodes = Array.from(nodes);
		const hasImport = Object.keys(htmlImport).length > 0;
		const hasExport = htmlExport.size > 0;
		if (hasImport || hasExport) {
			config.html = {};
			if (hasImport) config.html.import = htmlImport;
			if (hasExport) config.html.export = htmlExport;
		}
		for (const extensionRep of extensionReps) extensionRep.init(config);
		if (!config.onError) config.onError = defaultOnError;
		return config;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/getExtensionDependencyFromEditor.ts
/**
* Get the finalized config and output of an Extension that was used to build the editor.
*
* This is useful in the implementation of a LexicalNode or in other
* situations where you have an editor reference but it's not easy to
* pass the config or {@link ExtensionRegisterState} around.
*
* It will throw if the Editor was not built using this Extension.
*
* Inside an editor read/update, prefer {@link $getExtensionDependency} or
* {@link $getExtensionOutput} — they resolve the editor via `$getEditor()`
* so you don't have to thread it through.
*
* @param editor - The editor that was built using extension
* @param extension - The concrete reference to an Extension used to build this editor
* @returns The config and output for that Extension
*/
function getExtensionDependencyFromEditor(editor, extension) {
	const rep = LexicalBuilder.fromEditor(editor).getExtensionRep(extension);
	invariant(rep !== void 0, "getExtensionDependencyFromEditor: Extension %s was not built when creating this editor", extension.name);
	return rep.getExtensionDependency();
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/getPeerDependencyFromEditor.ts
/**
* Get the finalized config and output of an Extension that was used to build the
* editor by name.
*
* This can be used from the implementation of a LexicalNode or in other
* situation where you have an editor reference but it's not easy to pass the
* config around. Use this version if you do not have a concrete reference to
* the Extension for some reason (e.g. it is an optional peer dependency, or you
* are avoiding a circular import).
*
* Both the explicit Extension type and the name are required.
*
* Inside an editor read/update, prefer {@link $getPeerDependency} — it
* resolves the editor via `$getEditor()` so you don't have to thread it
* through.
*
*  @example
* ```tsx
* import type { HistoryExtension } from "@lexical/history";
* getPeerDependencyFromEditor<typeof HistoryExtension>(editor, "@lexical/history/History");
* ```

* @param editor - The editor that may have been built using extension
* @param extensionName - The name of the Extension
* @returns The config and output of the Extension or undefined
*/
function getPeerDependencyFromEditor(editor, extensionName) {
	const builder = LexicalBuilder.maybeFromEditor(editor);
	if (!builder) return void 0;
	const peer = builder.extensionNameMap.get(extensionName);
	return peer ? peer.getExtensionDependency() : void 0;
}
/**
* Get the finalized config and output of an Extension that was used to build the
* editor by name.
*
* This can be used from the implementation of a LexicalNode or in other
* situation where you have an editor reference but it's not easy to pass the
* config around. Use this version if you do not have a concrete reference to
* the Extension for some reason (e.g. it is an optional peer dependency, or you
* are avoiding a circular import).
*
* Both the explicit Extension type and the name are required.
*
* Inside an editor read/update, prefer {@link $getPeerDependency} (which
* resolves the editor via `$getEditor()`) and add your own invariant if
* the peer is required.
*
*  @example
* ```tsx
* import type { EmojiExtension } from "./EmojiExtension";
* export class EmojiNode extends TextNode {
*   // other implementation details not included
*   createDOM(
*     config: EditorConfig,
*     editor?: LexicalEditor | undefined
*   ): HTMLElement {
*     const dom = super.createDOM(config, editor);
*     addClassNamesToElement(
*       dom,
*       getPeerDependencyFromEditorOrThrow<typeof EmojiExtension>(
*         editor || $getEditor(),
*         "@lexical/playground/emoji",
*       ).config.emojiClass,
*     );
*     return dom;
*   }
* }
* ```

* @param editor - The editor that may have been built using extension
* @param extensionName - The name of the Extension
* @returns The config and output of the Extension
*/
function getPeerDependencyFromEditorOrThrow(editor, extensionName) {
	const dep = getPeerDependencyFromEditor(editor, extensionName);
	invariant(dep !== void 0, "getPeerDependencyFromEditorOrThrow: Editor was not built with Extension %s", extensionName);
	return dep;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/getExtensionDependency.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Get the finalized config and output for `extension` from the editor
* currently in scope. A `$`-flavored shorthand for
* `getExtensionDependencyFromEditor($getEditor(), extension)`.
*
* Throws if the editor was not built with `extension` as a dependency.
*
* @example
* ```ts
* import {$getExtensionDependency} from '@lexical/extension';
* import {KeywordsExtension} from './KeywordsExtension';
*
* class KeywordNode extends TextNode {
*   createDOM(config: EditorConfig): HTMLElement {
*     const dom = super.createDOM(config);
*     dom.className =
*       $getExtensionDependency(KeywordsExtension).config.className;
*     return dom;
*   }
* }
* ```
*
* @see {@link getExtensionDependencyFromEditor} when you have an explicit
*   editor reference (e.g. outside a read/update).
*/
function $getExtensionDependency(extension) {
	return getExtensionDependencyFromEditor($getEditor(), extension);
}
/**
* Shorthand for `$getExtensionDependency(extension).output` — the most
* common reason to look up an extension dependency. Throws if the editor
* was not built with `extension` as a dependency.
*
* @example
* ```ts
* import {$getExtensionOutput} from '@lexical/extension';
* import {DOMImportExtension} from '@lexical/html';
*
* const nodes = $getExtensionOutput(DOMImportExtension).$generateNodesFromDOM(
*   dom,
* );
* ```
*
* @see {@link $getExtensionDependency} when you need both `.config` and
*   `.output` (or want to mirror the shape of
*   {@link getExtensionDependencyFromEditor}).
*/
function $getExtensionOutput(extension) {
	return $getExtensionDependency(extension).output;
}
/**
* Get the finalized config and output for an optional peer extension by
* name, from the editor currently in scope. A `$`-flavored shorthand for
* `getPeerDependencyFromEditor($getEditor(), extensionName)`.
*
* Returns `undefined` if the editor was not built with the named
* extension. Both the explicit `Extension` type and the name are
* required so the returned `config` / `output` types are correct.
*
* @example
* ```ts
* import {$getPeerDependency} from '@lexical/extension';
* import type {HistoryExtension} from '@lexical/history';
*
* const dep = $getPeerDependency<typeof HistoryExtension>(
*   '@lexical/history/History',
* );
* if (dep) {
*   // …read dep.config / dep.output…
* }
* ```
*
* @see {@link getPeerDependencyFromEditor} when you have an explicit
*   editor reference.
*/
function $getPeerDependency(extensionName) {
	return getPeerDependencyFromEditor($getEditor(), extensionName);
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/internal/editorStateFamily.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* The state the scratch parse starts from. Its content is thrown away — the
* parse is only there to give the node versions an editor state to be
* constructed in.
*/
var SCRATCH_STATE_JSON = { root: {
	children: [],
	direction: null,
	format: "",
	indent: 0,
	type: "root",
	version: 1
} };
function serializeSelection(selection) {
	if ($isRangeSelection(selection)) return {
		anchor: {
			key: selection.anchor.key,
			offset: selection.anchor.offset,
			type: selection.anchor.type
		},
		focus: {
			key: selection.focus.key,
			offset: selection.focus.offset,
			type: selection.focus.type
		},
		format: selection.format,
		style: selection.style,
		type: "range"
	};
	if ($isNodeSelection(selection)) return {
		keys: Array.from(selection._nodes),
		type: "node"
	};
	return null;
}
function $serializeNodeVersion(node) {
	const json = node.exportJSON();
	delete json.children;
	delete json.$slots;
	const version = {
		json,
		key: node.__key,
		next: node.__next,
		parent: node.__parent,
		prev: node.__prev
	};
	if ($isElementNode(node)) {
		version.first = node.__first;
		version.last = node.__last;
		version.size = node.__size;
	}
	const { __slotHost, __slots } = node;
	if (__slots != null) version.slots = Array.from(__slots);
	if (__slotHost != null) version.slotHost = __slotHost;
	return version;
}
/**
* Serializes `states` into a single payload of plain data, sharing one node
* table across all of them.
*
* @internal
*/
function serializeEditorStateFamily(states) {
	const ids = /* @__PURE__ */ new Map();
	const nodes = [];
	return {
		nodes,
		states: states.map((state) => state.read(() => {
			const stateNodes = [];
			for (const node of state._nodeMap.values()) {
				let id = ids.get(node);
				if (id === void 0) {
					id = nodes.length;
					ids.set(node, id);
					nodes.push($serializeNodeVersion(node));
				}
				stateNodes.push(id);
			}
			return {
				nodes: stateNodes,
				selection: serializeSelection(state._selection)
			};
		}))
	};
}
function isObject(raw) {
	return raw != null && typeof raw === "object";
}
/** A NodeKey link, which is a key or nothing. */
function isLink(raw) {
	return raw === null || raw === void 0 || typeof raw === "string";
}
function isSerializedNodeVersion(raw) {
	if (!isObject(raw)) return false;
	const { first, json, key, last, next, parent, prev, size, slotHost, slots } = raw;
	return isObject(json) && typeof json.type === "string" && typeof key === "string" && isLink(parent) && isLink(prev) && isLink(next) && isLink(first) && isLink(last) && (size === void 0 || typeof size === "number") && isLink(slotHost) && (slots === void 0 || Array.isArray(slots) && slots.every((slot) => Array.isArray(slot) && slot.length === 2 && typeof slot[0] === "string" && typeof slot[1] === "string"));
}
function isSerializedFamilyPoint(raw) {
	return isObject(raw) && typeof raw.key === "string" && typeof raw.offset === "number" && (raw.type === "text" || raw.type === "element");
}
function isSerializedFamilySelection(raw) {
	if (raw === null || raw === void 0) return true;
	if (!isObject(raw)) return false;
	if (raw.type === "node") return Array.isArray(raw.keys) && raw.keys.every((key) => typeof key === "string");
	return raw.type === "range" && isSerializedFamilyPoint(raw.anchor) && isSerializedFamilyPoint(raw.focus) && typeof raw.format === "number" && typeof raw.style === "string";
}
/**
* Whether `raw` is a payload this build can rebuild.
*
* Checked field by field rather than at the surface: the payload comes from
* whichever build of this module wrote it, and one that describes a node
* version or a selection differently would otherwise be found out partway
* through rebuilding, where a throw costs the caller the whole document
* instead of being reported as a payload it cannot read.
*
* @internal
*/
function isSerializedEditorStateFamily(raw) {
	if (!isObject(raw)) return false;
	const { nodes, states } = raw;
	return Array.isArray(nodes) && Array.isArray(states) && nodes.every(isSerializedNodeVersion) && states.every((state) => isObject(state) && Array.isArray(state.nodes) && state.nodes.every((id) => typeof id === "number" && id >= 0 && id < nodes.length) && isSerializedFamilySelection(state.selection));
}
function $buildNodeVersion(json, editor) {
	if (json.type !== "root") return $parseSerializedNode(json);
	let root;
	editor.parseEditorState({ root: json }, () => {
		root = $getRoot();
	});
	if (root === void 0) throw new Error("editorStateFamily: the root version did not parse");
	return root;
}
function $restoreSelection(serialized, keys) {
	if (serialized == null) return null;
	if (serialized.type === "node") {
		const selection = $createNodeSelection();
		for (const key of serialized.keys) {
			const restored = keys.get(key);
			if (restored === void 0) return null;
			selection._nodes.add(restored);
		}
		return selection;
	}
	const anchorKey = keys.get(serialized.anchor.key);
	const focusKey = keys.get(serialized.focus.key);
	if (anchorKey === void 0 || focusKey === void 0) return null;
	const selection = $createRangeSelection();
	selection.anchor.key = anchorKey;
	selection.anchor.offset = serialized.anchor.offset;
	selection.anchor.type = serialized.anchor.type;
	selection.focus.key = focusKey;
	selection.focus.offset = serialized.focus.offset;
	selection.focus.type = serialized.focus.type;
	selection.format = serialized.format;
	selection.style = serialized.style;
	return selection;
}
/**
* Rebuilds the states of a family for `editor`, preserving the sharing and the
* key relationships they had when they were serialized.
*
* The keys are new ones minted by this editor rather than the keys the
* previous editor used — what matters is that every version of a node, in
* every state, answers to the *same* key, and freshly minted keys cannot
* collide with the keys this editor goes on to mint.
*
* Returns one entry per state, in the order they were serialized. A state
* whose nodes cannot all be rebuilt — a node class the new editor no longer
* registers, say — comes back as `null` rather than failing the whole family.
*
* The states come back with `_parsed` false, like the live states they
* reproduce. A caller that hydrates one of them into an editor — where the
* node classes are seeing this JSON for the first time — should set the flag
* on that one state, so that `setEditorState` normalizes it. Leaving it set on
* the others would make every `setEditorState` of them (each undo into a
* history entry, over and over) dirty-mark the whole document and re-run every
* transform on it.
*
* @internal
*/
function deserializeEditorStateFamily(family, editor) {
	const versions = [];
	const keys = /* @__PURE__ */ new Map();
	let slotsUsed = false;
	let linked = false;
	const template = editor.parseEditorState(SCRATCH_STATE_JSON, () => {
		for (const version of family.nodes) {
			let node = null;
			try {
				node = $buildNodeVersion(version.json, editor);
			} catch {
				versions.push(null);
				continue;
			}
			const key = keys.get(version.key);
			if (key === void 0) keys.set(version.key, node.__key);
			else node.__key = key;
			versions.push(node);
		}
		const mapKey = (key) => key === null ? null : keys.get(key) ?? null;
		for (const [index, version] of family.nodes.entries()) {
			const node = versions[index];
			if (node === null) continue;
			node.__parent = mapKey(version.parent);
			node.__prev = mapKey(version.prev);
			node.__next = mapKey(version.next);
			if ($isElementNode(node)) {
				node.__first = mapKey(version.first ?? null);
				node.__last = mapKey(version.last ?? null);
				node.__size = version.size ?? 0;
			}
			const slotted = node;
			if (version.slots !== void 0) {
				slotsUsed = true;
				slotted.__slots = new Map(version.slots.flatMap(([name, key]) => {
					const restored = mapKey(key);
					return restored === null ? [] : [[name, restored]];
				}));
			}
			if (version.slotHost !== void 0) slotted.__slotHost = mapKey(version.slotHost);
		}
		linked = true;
	});
	if (!linked) return family.states.map(() => null);
	return family.states.map((serializedState) => {
		const nodeMap = /* @__PURE__ */ new Map();
		for (const id of serializedState.nodes) {
			const node = versions[id];
			if (node === void 0 || node === null) return null;
			nodeMap.set(node.__key, node);
		}
		if (!nodeMap.has("root")) return null;
		const state = template.clone($restoreSelection(serializedState.selection, keys));
		state._nodeMap = nodeMap;
		state._slotsUsed = slotsUsed;
		state._parsed = false;
		return state;
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/RootElementExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Exposes the editor's current root element as a reactive
* `Signal<HTMLElement | null>` that mirrors `editor.getRootElement()` via a
* root listener.
*
* Depend on this extension and read its output `Signal` from a signals
* `effect`/`computed` to react to the root mounting, unmounting, or remounting
* (e.g. into a different document such as an iframe) without subscribing
* through React (or any other framework).
*/
var RootElementExtension = defineExtension({
	build(editor) {
		return watchedSignal(() => editor.getRootElement(), (rootElementSignal) => editor.registerRootListener((rootElement) => {
			rootElementSignal.value = rootElement;
		}));
	},
	name: "@lexical/extension/RootElement"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/WatchEditableExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Exposes the editor's editable state as a reactive `Signal<boolean>` that
* mirrors `editor.isEditable()` via an editable listener.
*
* Depend on this extension and read its output `Signal` from a signals
* `effect`/`computed` to react to editability changes without subscribing
* through React (or any other framework).
*/
var WatchEditableExtension = defineExtension({
	build(editor) {
		return watchedSignal(() => editor.isEditable(), (signal) => editor.registerEditableListener((editable) => {
			signal.value = editable;
		}));
	},
	name: "@lexical/extension/WatchEditable"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/HMRExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var HMR_KEY = "lexicalHMR";
var HISTORY_EXTENSION_NAME = "@lexical/history/History";
var HMR_EXTENSION_NAME = "@lexical/extension/HMR";
function getHMRKey(id, namespace) {
	const base = `${HMR_KEY}:${encodeURIComponent(namespace)}`;
	return id !== void 0 ? `${base}:${encodeURIComponent(id)}` : base;
}
/** The key `editor` saves under, given the `id` its HMRExtension was configured with. */
function getEditorHMRKey(editor, configId) {
	const namespace = hasConfiguredNamespace(editor) ? editor._config.namespace : "";
	return getHMRKey(configId === "" ? void 0 : configId, namespace);
}
/**
* True when the editor's namespace was chosen by the application rather than
* generated for it.
*
* `createEditor` falls back to a random `createUID()` namespace, which is a
* different string on every reload: an HMR key built from it would never match
* the key the previous instance saved under, so nothing would ever be restored
* and every reload would leave another orphaned entry (pinning a whole
* EditorState and its history) in `hot.data`. Such editors are keyed with an
* empty namespace segment instead, which is stable. Two of them sharing one
* HMR context then collide on that key, which is what the shared-key warning
* in the save effect reports.
*/
function hasConfiguredNamespace(editor) {
	const builder = LexicalBuilder.maybeFromEditor(editor);
	if (!builder) return false;
	for (const rep of builder.extensionNameMap.values()) {
		const { namespace } = rep.extension;
		if (namespace && namespace === editor._config.namespace) return true;
	}
	return editor._parentEditor !== null && hasConfiguredNamespace(editor._parentEditor);
}
function getSavedHMRState(hot, key) {
	return hot.data[key];
}
/**
* Structural check rather than `$isEditorState`: the saved value was created
* by the module instance that HMR replaced. When `lexical` itself is part of
* the HMR graph (as it is for an app that builds it from source), the previous
* `EditorState` class is a different object than the current one, so
* `instanceof` would reject a perfectly usable state.
*/
function isEditorStateLike(raw) {
	return typeof raw === "object" && raw !== null && typeof raw.toJSON === "function" && typeof raw.isEmpty === "function";
}
function isValidHMRSavedState(raw) {
	if (raw == null || typeof raw !== "object") return false;
	const s = raw;
	const has = (k) => Object.prototype.hasOwnProperty.call(s, k);
	return has("editable") && has("editorState") && typeof s.editable === "boolean" && isEditorStateLike(s.editorState);
}
function isSerializedHMRState(raw) {
	if (raw == null || typeof raw !== "object") return false;
	const { family, history } = raw;
	if (!isSerializedEditorStateFamily(family)) return false;
	if (history == null) return true;
	const isIndex = (value) => typeof value === "number" && value >= 0 && value < family.states.length;
	const { current, redoStack, undoStack } = history;
	return (current === null || isIndex(current)) && Array.isArray(redoStack) && redoStack.every(isIndex) && Array.isArray(undoStack) && undoStack.every(isIndex);
}
/**
* Serializes `editorState` together with the states of `historyState`. They go
* in as one family so that the nodes they share stay shared, and so that every
* version of a node keeps answering to one key: undo is a reconciliation
* against the state that is current when it happens, which can only diff what
* actually changed if the two agree about keys.
*
* Only the entries `editor` itself recorded are kept. `SharedHistoryExtension`
* gives a nested editor its parent's `HistoryState` object, so one stack can
* hold entries from several editors, and each entry names the editor that
* undoing it applies the state to. Those other editors do not survive the
* reload, and re-labelling their entries with this one would make undo replace
* this editor's document with a nested editor's content.
*/
function serializeHMRState(editor, editorState, historyState) {
	const states = [editorState];
	let foreign = 0;
	const own = (entry) => {
		const isOwn = entry.editor === editor;
		if (!isOwn) foreign++;
		return isOwn;
	};
	const add = (entry) => states.push(entry.editorState) - 1;
	const addStack = (stack) => stack.filter(own).map(add);
	const history = historyState ? {
		current: historyState.current && own(historyState.current) ? add(historyState.current) : null,
		redoStack: addStack(historyState.redoStack),
		undoStack: addStack(historyState.undoStack)
	} : null;
	return {
		family: serializeEditorStateFamily(states),
		history
	};
}
/**
* Rebuilds the undo/redo history from the states of a restored family. An
* entry whose state could not be rebuilt is dropped on its own rather than
* costing the whole history.
*/
function restoreHistoryState(history, states, editor) {
	let dropped = 0;
	const restoreEntry = (index) => {
		const editorState = states[index];
		if (editorState == null || editorState.isEmpty()) {
			dropped++;
			return null;
		}
		return {
			editor,
			editorState
		};
	};
	const restoreStack = (indices) => indices.map(restoreEntry).filter((entry) => entry !== null);
	const current = history.current === null ? null : restoreEntry(history.current);
	const undoStack = restoreStack(history.undoStack);
	return {
		current,
		redoStack: restoreStack(history.redoStack),
		undoStack
	};
}
/**
* Preserves editor state, the selection, editability, and undo/redo history
* across Hot Module Replacement (HMR) cycles. When `HistoryExtension` is
* present as a peer, undo/redo stacks are preserved as well.
*
* Passing `hot: null` is a safe no-op, so `import.meta.hot ?? null` works
* correctly in both development and production without a build-time
* conditional. If a saved state cannot be parsed, the extension warns in dev
* and falls back to `$initialEditorState` rather than throwing.
*
* Editor updates only stash a reference to the current `EditorState` (and to
* the `HistoryState`, which `@lexical/history` mutates in place), so the
* per-update cost does not grow with the size of the document or of the undo
* stack. Everything is serialized once, by the module instance that replaces
* this one, when it restores the saved state.
*
* The editor state and the history entries are serialized as one family rather
* than one at a time, so that the nodes they shared come back shared and every
* version of a node keeps answering to one key — see `editorStateFamily`. That
* is what makes an undo after a reload a diff of what changed rather than a
* rebuild of the document, and it is why the selection can be carried by key.
*
* @example
* Basic usage
* ```ts
* import {buildEditorFromExtensions, configExtension, defineExtension, HMRExtension} from '@lexical/extension';
* import {RichTextExtension} from '@lexical/rich-text';
* import {HistoryExtension} from '@lexical/history';
*
* const editor = buildEditorFromExtensions(
*   defineExtension({
*     name: '[root]',
*     namespace: 'my-editor',
*     dependencies: [
*       RichTextExtension,
*       HistoryExtension,
*       configExtension(HMRExtension, {hot: import.meta.hot ?? null}),
*     ],
*   }),
* );
* ```
*
* @example
* Multiple editors sharing an HMR context
* Editors with distinct `namespace` values are isolated automatically. Only
* add `id` when two editors share both the same `import.meta.hot` context
* and the same `namespace`.
* ```ts
* // Different namespaces — automatic isolation, no `id` needed
* defineExtension({ name: '[main]', namespace: 'main', dependencies: [configExtension(HMRExtension, {hot: import.meta.hot ?? null})] })
* defineExtension({ name: '[sidebar]', namespace: 'sidebar', dependencies: [configExtension(HMRExtension, {hot: import.meta.hot ?? null})] })
*
* // Same namespace — use `id` to distinguish
* defineExtension({ name: '[first]', namespace: 'shared', dependencies: [configExtension(HMRExtension, {hot: import.meta.hot ?? null, id: 'first'})] })
* defineExtension({ name: '[second]', namespace: 'shared', dependencies: [configExtension(HMRExtension, {hot: import.meta.hot ?? null, id: 'second'})] })
* ```
*
* Only the undo/redo entries this editor recorded are preserved. With
* `SharedHistoryExtension` a nested editor pushes onto its parent's stacks, and
* an entry can only be applied to the editor that recorded it — editors the
* reload replaced, so those entries are left behind rather than re-pointed at
* whichever editor happens to restore the history.
*
* A nested editor inherits its parent's namespace, so namespaces do not
* isolate it from its parent: give it a distinct `id` (or its own
* `namespace`), which is warned about in dev when both use HMRExtension.
*
* An editor that was given no `namespace` at all is keyed without one, because
* the namespace `createEditor` generates for it is a fresh random string on
* every reload — a key built from that would never match what the previous
* instance saved. Such editors all share one key, so give each editor a
* `namespace` (or an `id`) as soon as a page has more than one.
*
* Saved state belongs to the key for as long as the page lives, not to the
* reload that produced it. An editor that is unmounted and later remounted
* under the same key during development restores what the previous one had
* rather than its own `$initialEditorState`, so two editors showing different
* documents need distinct namespaces (or ids) even when they are never on
* screen at the same time.
*/
var HMRExtension = defineExtension({
	afterRegistration(editor, { hot, id: configId }, state) {
		if (!hot) return () => {};
		const hmrKey = getEditorHMRKey(editor, configId);
		const historyPeer = getPeerDependencyFromEditor(editor, HISTORY_EXTENSION_NAME);
		let restored = false;
		const saved = getSavedHMRState(hot, hmrKey);
		if (isValidHMRSavedState(saved)) try {
			editor.setEditable(saved.editable);
			const serialized = typeof saved.serialize === "function" ? saved.serialize() : null;
			if (!isSerializedHMRState(serialized)) {} else {
				const states = deserializeEditorStateFamily(serialized.family, editor);
				const restoredState = states[0];
				if (restoredState == null) {} else if (!restoredState.isEmpty()) {
					restoredState._parsed = true;
					editor.setEditorState(restoredState, { tag: HISTORY_MERGE_TAG });
					if (serialized.history != null) {
						if (historyPeer) historyPeer.output.historyState.value = restoreHistoryState(serialized.history, states, editor);
					}
					restored = true;
				}
			}
		} catch (e) {}
		if (restored) state.getInitResult().restoreCount.value++;
		const editorStateSignal = state.getDependency(EditorStateExtension).output;
		const editableSignal = state.getDependency(WatchEditableExtension).output;
		const rootElementSignal = state.getDependency(RootElementExtension).output;
		let written = null;
		return j(() => {
			const editorState = editorStateSignal.value;
			const editable = editableSignal.value;
			const mounted = rootElementSignal.value !== null;
			const prev = getSavedHMRState(hot, hmrKey);
			if (written !== null && written.editorState === editorState && written.editable === editable) {
				if (isValidHMRSavedState(prev) && prev.owner === editor) prev.mounted = mounted;
				return;
			}
			written = {
				editable,
				editorState
			};
			const nextState = {
				...(editorState.isEmpty() && isValidHMRSavedState(prev) ? prev : null) ?? {
					editorState,
					serialize: () => serializeHMRState(editor, editorState, historyPeer ? historyPeer.output.historyState.peek() : null)
				},
				editable,
				mounted,
				owner: editor
			};
			hot.data[hmrKey] = nextState;
		});
	},
	build: (_editor, _config, state) => state.getInitResult(),
	config: safeCast({ hot: null }),
	dependencies: [
		EditorStateExtension,
		RootElementExtension,
		WatchEditableExtension
	],
	init: () => ({ restoreCount: y(0) }),
	name: HMR_EXTENSION_NAME
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/NodeSelectionExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var EMPTY_SET = /* @__PURE__ */ new Set();
/**
* An extension that provides a `watchNodeKey` output that
* returns a signal for the selection state of a node.
*
* Typically used for tracking whether a DecoratorNode is
* currently selected or not. A framework independent
* alternative to {@link useLexicalNodeSelection}.
*/
var NodeSelectionExtension = defineExtension({
	build(editor, config, state) {
		const editorStateStore = state.getDependency(EditorStateExtension).output;
		const watchedNodeStore = y({ watchedNodeKeys: /* @__PURE__ */ new Map() });
		const selectedNodeKeys = watchedSignal(() => void 0, () => j(() => {
			const prevSelectedNodeKeys = selectedNodeKeys.peek();
			const { watchedNodeKeys } = watchedNodeStore.value;
			let nextSelectedNodeKeys;
			let didChange = false;
			editorStateStore.value.read(() => {
				if ($getSelection()) for (const [key, listeners] of watchedNodeKeys.entries()) {
					if (listeners.size === 0) {
						watchedNodeKeys.delete(key);
						continue;
					}
					const node = $getNodeByKey(key);
					const isSelected = node && node.isSelected() || false;
					didChange = didChange || isSelected !== (prevSelectedNodeKeys ? prevSelectedNodeKeys.has(key) : false);
					if (isSelected) {
						nextSelectedNodeKeys = nextSelectedNodeKeys || /* @__PURE__ */ new Set();
						nextSelectedNodeKeys.add(key);
					}
				}
			});
			if (!(!didChange && nextSelectedNodeKeys && prevSelectedNodeKeys && nextSelectedNodeKeys.size === prevSelectedNodeKeys.size)) selectedNodeKeys.value = nextSelectedNodeKeys;
		}));
		function watchNodeKey(key) {
			const watcher = g(() => (selectedNodeKeys.value || EMPTY_SET).has(key));
			const { watchedNodeKeys } = watchedNodeStore.peek();
			let listeners = watchedNodeKeys.get(key);
			const hadListener = listeners !== void 0;
			listeners = listeners || /* @__PURE__ */ new Set();
			listeners.add(watcher);
			if (!hadListener) {
				watchedNodeKeys.set(key, listeners);
				watchedNodeStore.value = { watchedNodeKeys };
			}
			return watcher;
		}
		return { watchNodeKey };
	},
	dependencies: [EditorStateExtension],
	name: "@lexical/extension/NodeSelection"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/HorizontalRuleExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Command that inserts a {@link HorizontalRuleNode} at the current selection.
* Dispatch it with
* `editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND)`.
*/
var INSERT_HORIZONTAL_RULE_COMMAND = createCommand("INSERT_HORIZONTAL_RULE_COMMAND");
var HorizontalRuleNode = class extends DecoratorNode {
	$config() {
		return this.config("horizontalrule", {
			extends: DecoratorNode,
			importDOM: { hr: () => ({
				conversion: $convertHorizontalRuleElement,
				priority: 0
			}) }
		});
	}
	exportDOM() {
		return { element: $getDocument().createElement("hr") };
	}
	createDOM(config) {
		const element = $getDocument().createElement("hr");
		addClassNamesToElement(element, config.theme.hr);
		return element;
	}
	getTextContent() {
		return "\n";
	}
	isInline() {
		return false;
	}
	updateDOM() {
		return false;
	}
};
function $convertHorizontalRuleElement() {
	return { node: $createHorizontalRuleNode() };
}
function $createHorizontalRuleNode() {
	return $create(HorizontalRuleNode);
}
/**
* @returns `true` if `node` is a {@link HorizontalRuleNode}, narrowing its type.
*/
function $isHorizontalRuleNode(node) {
	return node instanceof HorizontalRuleNode;
}
function $toggleNodeSelection(node, shiftKey = false) {
	const selection = $getSelection();
	const wasSelected = node.isSelected();
	const key = node.getKey();
	let nodeSelection;
	if (shiftKey && $isNodeSelection(selection)) nodeSelection = selection;
	else {
		nodeSelection = $createNodeSelection();
		$setSelection(nodeSelection);
	}
	if (wasSelected) nodeSelection.delete(key);
	else nodeSelection.add(key);
}
/**
* An extension for HorizontalRuleNode that provides an implementation that
* works without any React dependency.
*/
var HorizontalRuleExtension = defineExtension({
	dependencies: [EditorStateExtension, NodeSelectionExtension],
	name: "@lexical/extension/HorizontalRule",
	nodes: () => [HorizontalRuleNode],
	register(editor, config, state) {
		const { watchNodeKey } = state.getDependency(NodeSelectionExtension).output;
		const nodeSelectionStore = y({ nodeSelections: /* @__PURE__ */ new Map() });
		const isSelectedClassName = editor._config.theme.hrSelected ?? "selected";
		return mergeRegister(editor.registerCommand(INSERT_HORIZONTAL_RULE_COMMAND, (type) => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection)) return false;
			if (selection.focus.getNode() !== null) {
				const horizontalRuleNode = $createHorizontalRuleNode();
				$insertNodeToNearestRoot(horizontalRuleNode);
			}
			return true;
		}, 0), editor.registerCommand(CLICK_COMMAND, (event) => {
			if (isDOMNode(event.target)) {
				const node = $getNodeFromDOMNode(event.target);
				if ($isHorizontalRuleNode(node)) {
					$toggleNodeSelection(node, event.shiftKey);
					return true;
				}
			}
			return false;
		}, 1), editor.registerMutationListener(HorizontalRuleNode, (nodes, payload) => {
			n(() => {
				let didChange = false;
				const { nodeSelections } = nodeSelectionStore.peek();
				for (const [k, v] of nodes.entries()) if (v === "destroyed") {
					nodeSelections.delete(k);
					didChange = true;
				} else {
					const prev = nodeSelections.get(k);
					const dom = editor.getElementByKey(k);
					if (prev) prev.domNode.value = dom;
					else {
						didChange = true;
						nodeSelections.set(k, {
							domNode: y(dom),
							selectedSignal: watchNodeKey(k)
						});
					}
				}
				if (didChange) nodeSelectionStore.value = { nodeSelections };
			});
		}), j(() => {
			const effects = [];
			for (const { domNode, selectedSignal } of nodeSelectionStore.value.nodeSelections.values()) effects.push(j(() => {
				const dom = domNode.value;
				if (dom) {
					if (selectedSignal.value) addClassNamesToElement(dom, isSelectedClassName);
					else removeClassNamesFromElement(dom, isSelectedClassName);
				}
			}));
			return mergeRegister(...effects);
		}));
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/IMEExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Centralizes IME composition state so extensions that react to
* composition lifecycle don't each re-implement the
* COMPOSITION_START_COMMAND + compositionend listener dance.
*
* Exposes two signals (both always-active for the editor's lifetime —
* listeners are wired up by `register`, not lazily on subscription, so
* consumers can read `.value` from anywhere without holding a
* subscription themselves):
*
* - `compositionKey` is the raw mirror — the value Lexical's own
*   `$handleCompositionStart` writes to its internal `_compositionKey`,
*   i.e. the `selection.anchor.key` at the moment composition starts.
*   This can be a non-TextNode key when composition begins on an
*   element-anchor selection (e.g. empty paragraph). Cleared on
*   `compositionend`.
*
* - `composingTextNode` is the resolved view — the actual TextNode
*   being composed on, or `null` while there is no TextNode-level
*   composition. For an element-anchor start it stays `null` until
*   the `COMPOSITION_START_TAG`-tagged update fires with the
*   post-ZWSP-heuristic selection, at which point it updates to the
*   new TextNode.
*
*/
var IMEExtension = defineExtension({
	build(_editor) {
		return {
			composingTextNode: y(null),
			compositionKey: y(null)
		};
	},
	name: "@lexical/extension/IME",
	register(editor, _config, state) {
		const { compositionKey, composingTextNode } = state.getOutput();
		const removeStartCommand = editor.registerCommand(COMPOSITION_START_COMMAND, () => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) compositionKey.value = selection.anchor.key;
			return false;
		}, -8);
		const stopKeyEffect = j(() => {
			const key = compositionKey.value;
			if (key === null) {
				composingTextNode.value = null;
				return;
			}
			composingTextNode.value = editor.read("latest", () => {
				const node = $getNodeByKey(key);
				return $isTextNode(node) ? node : null;
			});
		});
		const removeUpdateListener = editor.registerUpdateListener(({ tags, editorState }) => {
			if (!tags.has("composition-start")) return;
			editorState.read(() => {
				const selection = $getSelection();
				if (!$isRangeSelection(selection)) return;
				const node = selection.anchor.getNode();
				if ($isTextNode(node)) composingTextNode.value = node;
			});
		});
		const removeRootListener = editor.registerRootListener((rootElem) => {
			if (rootElem === null) {
				compositionKey.value = null;
				return;
			}
			const onCompositionEnd = () => {
				compositionKey.value = null;
			};
			return registerEventListener(rootElem, "compositionend", onCompositionEnd);
		});
		return mergeRegister(removeStartCommand, stopKeyEffect, removeUpdateListener, removeRootListener);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/KeyboardShortcutsExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var MODIFIERS = [
	["ctrlKey", "Ctrl"],
	["altKey", "Alt"],
	["shiftKey", "Shift"],
	["metaKey", "Meta"]
];
var UNIVERSAL_KEYS = { " ": "Space" };
/**
* Extend a key display map. A function declared side-effect free (so the
* build annotates the calls) rather than an object spread at module scope,
* which is a side effect to bundlers and would pin these tables into every
* bundle that imports the module.
*
* @__NO_SIDE_EFFECTS__
*/
function extendKeys(base, keys) {
	return {
		...base,
		...keys
	};
}
var APPLE_KEYS = extendKeys(UNIVERSAL_KEYS, {
	Alt: "⌥",
	ArrowDown: "↓",
	ArrowLeft: "←",
	ArrowRight: "→",
	ArrowUp: "↑",
	Backspace: "⌫",
	CapsLock: "⇪",
	Ctrl: "⌃",
	Delete: "⌦",
	End: "↘",
	Enter: "↩",
	Escape: "⎋",
	Home: "↖",
	Meta: "⌘",
	PageDown: "⇟",
	PageUp: "⇞",
	Shift: "⇧",
	Tab: "⇥"
});
var SHIFT_APPLE_KEYS = extendKeys(APPLE_KEYS, { Tab: "⇤" });
/**
* Format the key binding of a shortcut as a human readable string for
* menus, tooltips, and help dialogs (e.g. `'⌘+Shift+K'` on Apple platforms
* and `'Ctrl+Shift+K'` elsewhere). Modifiers with an `'any'` mask are not
* displayed.
*/
function formatKeyboardShortcut(shortcut, options = {}) {
	const { isApple = IS_APPLE } = options;
	const { unshiftedKey, key } = shortcut;
	const modifiers = keyboardEventMaskForPlatform(shortcut.modifiers || {}, isApple);
	const segments = [];
	const keyNames = isApple ? modifiers.shiftKey === true ? SHIFT_APPLE_KEYS : APPLE_KEYS : UNIVERSAL_KEYS;
	for (const [k, name] of MODIFIERS) if (modifiers[k] === true) {
		if (isApple && k === "shiftKey" && unshiftedKey && key.length === 1) continue;
		segments.push(keyNames[name] || name);
	}
	segments.push(keyNames[key] || !isApple && modifiers.shiftKey === true && unshiftedKey || key.length === 1 && key.toUpperCase() || key);
	return segments;
}
/**
* @experimental @internal
*
* Compile the given shortcuts and register a single
* {@link KEY_DOWN_COMMAND} listener that dispatches each matched shortcut's
* command with the KeyboardEvent as its payload (unless its `$disabled`
* predicate returns true for the current selection). When several
* shortcuts match the same event they are tried in the given order until
* one command dispatch is handled.
*
* @returns A cleanup function that unregisters the listener.
*/
function registerKeyboardShortcuts(editor, shortcuts, priority) {
	const compiled = compileKeyboardShortcuts(shortcuts);
	return editor.registerCommand(KEY_DOWN_COMMAND, (event, fromEditor) => {
		let selection;
		for (const shortcut of compiled.matches(event)) {
			if (editor !== fromEditor && !shortcut.bubbleFromNestedEditors) continue;
			if (shortcut.$disabled) {
				if (selection === void 0) selection = $getSelection();
				if (shortcut.$disabled(selection, fromEditor)) continue;
			}
			const $next = fromEditor.dispatchCommand.bind(fromEditor, shortcut.command, event);
			if (shortcut.$dispatch ? shortcut.$dispatch(shortcut.command, event, $next, fromEditor) : $next()) return true;
		}
		return false;
	}, priority);
}
function isReadonlyArray(x) {
	return Array.isArray(x);
}
function flattenKeyboardShortcuts(shortcuts) {
	return isReadonlyArray(shortcuts) ? shortcuts : shortcuts ? [shortcuts] : [];
}
/**
* Merge by name, as {@link shallowMergeConfig} would, except that the
* overriding names come *first* in object entry iteration so that they are
* also the first to be offered a matching keypress.
*/
function mergeNamedShortcuts(config, overrides) {
	if (!overrides) return config;
	const dest = { ...overrides };
	for (const [k, v0] of Object.entries(config)) if (dest[k] === void 0) dest[k] = v0;
	return dest;
}
/**
* @experimental
*
* Dispatches a table of keyboard shortcuts from a single compiled
* `KEY_DOWN_COMMAND` listener, in O(1) per keypress.
*
* The table is merged across the whole extension graph by name: any
* extension or app config can add shortcuts under new names, remap an
* existing name to a different key or handler, or disable one by
* configuring it to null. The output exposes the config as signals, so the
* table can also be remapped at runtime through the `shortcuts` signal
* (the listener is recompiled on change).
*
* Configuring an existing name always replaces its mapping outright, and a
* name may be mapped to an array to give it several bindings at once. The
* overriding names are also matched first, ahead of the names they did not
* override, when more than one shortcut matches the same keypress.
*/
var KeyboardShortcutsExtension = defineExtension({
	build(editor, config, state) {
		return namedSignals(config);
	},
	config: safeCast({
		disabled: false,
		priority: 2,
		shortcuts: {}
	}),
	mergeConfig(config, overrides) {
		const merged = shallowMergeConfig(config, overrides);
		merged.shortcuts = mergeNamedShortcuts(config.shortcuts, overrides.shortcuts);
		return merged;
	},
	name: "@lexical/extension/KeyboardShortcuts",
	register(editor, config, state) {
		const { disabled, priority, shortcuts } = state.getOutput();
		return j(() => {
			if (!disabled.value) {
				const allShortcuts = [];
				for (const shortcutConfig of Object.values(shortcuts.value)) for (const v of flattenKeyboardShortcuts(shortcutConfig)) allShortcuts.push(v);
				return registerKeyboardShortcuts(editor, allShortcuts, priority.value);
			}
		});
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/NestedEditorExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $defaultGetParentEditor() {
	const editor = $getEditor();
	LexicalBuilder.fromEditor(editor);
	return editor;
}
var NestedEditorExtension = defineExtension({
	build: (editor, config) => namedSignals({ inheritEditableFromParent: config.inheritEditableFromParent }),
	config: safeCast({
		$getParentEditor: $defaultGetParentEditor,
		inheritEditableFromParent: false
	}),
	init: (editorConfig, config, state) => {
		const parentEditor = config.$getParentEditor();
		editorConfig.parentEditor = parentEditor;
		editorConfig.theme = editorConfig.theme || parentEditor._config.theme;
	},
	name: "@lexical/extension/NestedEditor",
	register: (editor, config, state) => j(() => {
		const parentEditor = editor._parentEditor;
		if (parentEditor) {
			if (state.getOutput().inheritEditableFromParent.value) {
				editor.setEditable(parentEditor.isEditable());
				return parentEditor.registerEditableListener(editor.setEditable.bind(editor));
			}
		}
	})
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/NodeSelectionDataSelectedExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* @experimental
*
* Mirrors {@link NodeSelection} membership onto the host DOM as an attribute
* so CSS can render a selection outline for `ElementNode` hosts, which have
* no `decorate()` render path of their own. Configure it per node type:
*
* ```ts
* configExtension(NodeSelectionDataSelectedExtension, {nodes: [CardNode]})
* ```
*
* The matched host needs a corresponding CSS rule, e.g.
* `.lexical-card-node[data-selected='true'] { outline: ... }`.
*/
var NodeSelectionDataSelectedExtension = defineExtension({
	config: safeCast({
		attribute: "data-selected",
		nodes: []
	}),
	init(editorConfig, config) {
		const matchTypes = /* @__PURE__ */ new Set();
		const subtypeMap = getRegisteredSubtypeMap(getKnownTypesAndNodes(editorConfig).nodes);
		for (const klass of config.nodes) {
			const type = klass.getType();
			const subtypes = subtypeMap.get(type);
			invariant(subtypes !== void 0, "Node class %s with type %s not registered in editor", klass.name, type);
			matchTypes.add(type);
			for (const subtype of subtypes) matchTypes.add(subtype);
		}
		return { matchTypes };
	},
	mergeConfig(config, partial) {
		return shallowMergeConfig(config, {
			...partial,
			...partial.nodes && { nodes: [...config.nodes, ...partial.nodes] }
		});
	},
	name: "@lexical/extension/NodeSelectionDataSelected",
	register(editor, config, state) {
		const { attribute } = config;
		const { matchTypes } = state.getInitResult();
		const marked = /* @__PURE__ */ new Map();
		const syncFromEditorState = (editorState) => {
			const nextKeys = /* @__PURE__ */ new Set();
			editorState.read(() => {
				const selection = $getSelection();
				if ($isNodeSelection(selection)) {
					for (const node of selection.getNodes()) if (matchTypes.has(node.getType())) nextKeys.add(node.getKey());
				}
			});
			for (const [key, dom] of marked) if (!nextKeys.has(key)) {
				dom.removeAttribute(attribute);
				marked.delete(key);
			}
			for (const key of nextKeys) {
				const dom = editor.getElementByKey(key);
				if (dom !== null) {
					dom.setAttribute(attribute, "true");
					marked.set(key, dom);
				}
			}
		};
		syncFromEditorState(editor.getEditorState());
		const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => syncFromEditorState(editorState));
		return () => {
			removeUpdateListener();
			for (const dom of marked.values()) dom.removeAttribute(attribute);
			marked.clear();
		};
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/NormalizeInlineElementsExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function deleteEmptyInline(node) {
	if ($isElementNode(node) && node.isInline() && node.isEmpty()) node.remove();
}
/**
* This extension removes empty inline nodes from the EditorState.
* This extension is designed to facilitate a smooth migration from
* the plugin API with the option to disable it, but it may be removed
* in the future and integrated into the core
*/
var NormalizeInlineElementsExtension = defineExtension({
	build: (editor, config, state) => namedSignals(config),
	config: safeCast({ disabled: false }),
	name: "@lexical/NormalizeInlineElements",
	register: (editor, config, state) => {
		const stores = state.getOutput();
		return j(() => {
			if (!stores.disabled.value) {
				const disposeTransformers = [];
				for (const { klass, transforms } of editor._nodes.values()) if (klass.prototype instanceof ElementNode && klass.prototype.isInline !== ElementNode.prototype.isInline) {
					transforms.add(deleteEmptyInline);
					disposeTransformers.push(() => transforms.delete(deleteEmptyInline));
				}
				return () => disposeTransformers.forEach((fn) => fn());
			}
		});
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/NormalizeTripleClickSelectionExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var SKIP_TAGS = /* @__PURE__ */ new Set([SKIP_SELECTION_FOCUS_TAG, SKIP_SCROLL_INTO_VIEW_TAG]);
function $fixFocusOverselection() {
	const selection = $getSelection();
	if (!$isRangeSelection(selection)) return;
	if (!selection.isCollapsed()) {
		const range = $getCaretRangeInDirection($caretRangeFromSelection(selection), "next");
		let focusCaret = range.focus;
		if ($isTextPointCaret(focusCaret) && range.anchor.origin !== focusCaret.origin && focusCaret.offset === 0) focusCaret = $rewindSiblingCaret(focusCaret.getSiblingCaret());
		if ($isSiblingCaret(focusCaret) && range.anchor.origin !== focusCaret.origin && $isLineBreakNode(focusCaret.origin)) focusCaret = $rewindSiblingCaret(focusCaret);
		while ($isChildCaret(focusCaret) && range.anchor.origin !== focusCaret.origin) focusCaret = $rewindSiblingCaret($getSiblingCaret(focusCaret.origin, "next"));
		if ($isSiblingCaret(focusCaret) && $isElementNode(focusCaret.origin)) focusCaret = $normalizeCaret($getChildCaret(focusCaret.origin, "previous")).getFlipped();
		focusCaret = $normalizeCaret(focusCaret);
		if (!focusCaret.isSamePointCaret(range.focus)) {
			const sel = $setSelectionFromCaretRange($getCaretRange(range.anchor, focusCaret));
			const rootElement = $getEditor().getRootElement();
			const domSelection = rootElement && getDOMSelection(rootElement.ownerDocument.defaultView);
			if (domSelection) $updateDOMSelection($getPreviousSelection(), sel, $getEditor(), domSelection, SKIP_TAGS, rootElement);
		}
	}
}
/**
* This extension handles triple-click events and will move the focus
* towards the anchor in certain conditions to meet expectations.
* Simply speaking, the focus should prefer to land at the end of a node
* rather than the beginning of its next sibling, and it should not skip
* over a LineBreakNode.
*
* In order to fix the result visually and avoid a flash of over-selection
* it will also eagerly manipulate the DOM selection directly.
*
* It is conservative in that it only fires this
* `$fixFocusOverselection` callback when it has detected a triple click,
* but it provides the function as an output signal so that it can both
* be called from other places and it can be replaced or wrapped with
* different functionality.
*/
var NormalizeTripleClickSelectionExtension = defineExtension({
	build: (editor, config, state) => namedSignals(config),
	config: safeCast({
		$fixFocusOverselection,
		dateNow: () => Date.now(),
		disabled: false,
		thresholdMsec: 100
	}),
	name: "@lexical/NormalizeTripleClickSelection",
	register: (editor, config, state) => j(() => {
		const stores = state.getOutput();
		if (stores.disabled.value) return;
		return editor.registerRootListener((rootElement) => {
			if (!rootElement) return;
			let lastTripleClick = 0;
			const refreshTripleClick = (event) => {
				if (event ? event.detail > 2 : lastTripleClick > 0) {
					const now = stores.dateNow.peek()();
					lastTripleClick = event && event.type === "mousedown" || now - lastTripleClick <= stores.thresholdMsec.peek() ? now : 0;
				}
				return lastTripleClick;
			};
			return mergeRegister(editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
				if (refreshTripleClick(null)) {
					lastTripleClick = 0;
					stores.$fixFocusOverselection.peek()();
				}
				return false;
			}, -4), registerEventListeners(rootElement, {
				mousedown: refreshTripleClick,
				mouseup: refreshTripleClick
			}, true));
		});
	})
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/PreventSelectAllExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function captureKeydown(e) {
	const target = e.target;
	if (isExactShortcutMatch(e, "a", CONTROL_OR_META) && isHTMLElement(target) && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) target.addEventListener("keydown", stopLexicalPropagation, { once: true });
}
/**
* By default, lexical intercepts most events and dispatches the appropriate commands.
* This extension prevents the keydown event propagating from input/textarea elements,
* which are typically part of a decorator node, in order to stop dispatching the SELECT_ALL_COMMAND.
*
* When used as a dependency of SelectBlockExtension, its disabled state is
* kept in sync with that extension.
*/
var PreventSelectAllExtension = defineExtension({
	build: (editor, config, state) => namedSignals(config),
	config: safeCast({ disabled: false }),
	name: "@lexical/extension/PreventSelectAll",
	register: (editor, config, state) => {
		const stores = state.getOutput();
		return j(() => {
			if (!stores.disabled.value) return editor.registerRootListener((rootElement) => {
				if (rootElement) return registerEventListener(rootElement, "keydown", captureKeydown, true);
			});
		});
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/SelectBlockExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $hasCommonTopParent(nodes, commonTopParent) {
	return nodes.every((node) => commonTopParent.is(node.getTopLevelElement()));
}
/**
* This extension includes block selection.
* If you press Ctrl + A, the nearest block element, for example paragraph, is selected first.
* Pressing Ctrl + A again selects all content in the document. A selection
* that already spans multiple blocks expands directly to the whole document.
*/
var SelectBlockExtension = defineExtension({
	build: (editor, config, state) => namedSignals(config),
	config: safeCast({
		cascadeSelection: false,
		disabled: false
	}),
	dependencies: [PreventSelectAllExtension],
	name: "@lexical/extension/SelectBlock",
	register: (editor, config, state) => {
		const stores = state.getOutput();
		const preventSelectAllStores = state.getDependency(PreventSelectAllExtension).output;
		return mergeRegister(j(() => {
			preventSelectAllStores.disabled.value = stores.disabled.value;
		}), j(() => {
			if (!stores.disabled.value) return editor.registerCommand(SELECT_ALL_COMMAND, (event, triggerEditor) => {
				if (triggerEditor !== editor) {
					if (!stores.cascadeSelection.peek()) return false;
					if (!triggerEditor.read("pending", () => {
						const nestedSelection = $getSelection();
						return $isRangeSelection(nestedSelection) && $isBlockFullySelected($getRoot(), nestedSelection);
					})) return false;
					$selectAll();
					return true;
				}
				const selection = $getSelection();
				if ($isNodeSelection(selection)) {
					const selectedNodes = selection.getNodes();
					const firstNode = selectedNodes[0];
					if (!firstNode) return false;
					const topParent = firstNode.getTopLevelElement();
					if (!topParent || $isRootNode(topParent) || topParent.is(firstNode) || selectedNodes.length > 1 && !$hasCommonTopParent(selectedNodes, topParent)) $selectAll();
					else if ($isElementNode(topParent)) topParent.select(0, topParent.getChildrenSize());
					return true;
				}
				if (!$isRangeSelection(selection)) return false;
				const anchorNode = selection.anchor.getNode();
				const blockNode = anchorNode.getTopLevelElement();
				if (blockNode && blockNode.is(selection.focus.getNode().getTopLevelElement()) && !$isBlockFullySelected(blockNode, selection)) {
					blockNode.select(0, blockNode.getChildrenSize());
					return true;
				}
				let frame = $getSlotFrame(anchorNode);
				while (frame !== null) {
					if ($isElementNode(frame) && !$isBlockFullySelected(frame, selection)) {
						frame.select(0, frame.getChildrenSize());
						return true;
					}
					const host = $getSlotHost(frame);
					frame = host === null ? null : $getSlotFrame(host);
				}
				if (!$isBlockFullySelected($getRoot(), selection)) $selectAll();
				return true;
			}, 1);
		}));
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/SelectionAlwaysOnDisplayExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* An extension that highlights selected content in the Lexical editor
* even when the editor is not currently focused.
*/
var SelectionAlwaysOnDisplayExtension = defineExtension({
	build: (editor, config, state) => namedSignals(config),
	config: safeCast({
		disabled: false,
		onReposition: void 0
	}),
	name: "@lexical/utils/SelectionAlwaysOnDisplay",
	register: (editor, config, state) => {
		const stores = state.getOutput();
		return j(() => {
			if (!stores.disabled.value) return selectionAlwaysOnDisplay(editor, stores.onReposition.value);
		});
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+extension@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/extension/src/TabIndentationExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $indentOverTab(selection) {
	if (selection.getNodes().filter((node) => $isBlockElementNode(node) && node.canIndent()).length > 0) return true;
	const anchor = selection.anchor;
	const focus = selection.focus;
	const first = focus.isBefore(anchor) ? focus : anchor;
	const firstNode = first.getNode();
	const firstBlock = $getNearestBlockElementAncestorOrThrow(firstNode);
	if (firstBlock.canIndent()) {
		const firstBlockKey = firstBlock.getKey();
		let selectionAtStart = $createRangeSelection();
		selectionAtStart.anchor.set(firstBlockKey, 0, "element");
		selectionAtStart.focus.set(firstBlockKey, 0, "element");
		selectionAtStart = $normalizeSelection(selectionAtStart);
		if (selectionAtStart.anchor.is(first)) return true;
	}
	return false;
}
function $defaultCanIndent(node) {
	return node.canIndent();
}
/**
* Registers a `KEY_TAB_COMMAND` handler that makes Tab and Shift+Tab indent and
* outdent block elements (and otherwise insert a tab). Pass `maxIndent` to cap
* the indent depth and `$canIndent` to control which elements may be indented.
*
* @returns A cleanup function that unregisters the handler.
*/
function registerTabIndentation(editor, maxIndent, $canIndent = $defaultCanIndent) {
	return mergeRegister(editor.registerCommand(KEY_TAB_COMMAND, (event) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		event.preventDefault();
		const command = $indentOverTab(selection) ? event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND : INSERT_TAB_COMMAND;
		return editor.dispatchCommand(command);
	}, 0), editor.registerCommand(INDENT_CONTENT_COMMAND, () => {
		const currentMaxIndent = typeof maxIndent === "number" ? maxIndent : maxIndent ? maxIndent.peek() : null;
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		const $currentCanIndent = typeof $canIndent === "function" ? $canIndent : $canIndent.peek();
		return $handleIndentAndOutdent((block) => {
			if ($currentCanIndent(block)) {
				const newIndent = block.getIndent() + 1;
				if (!currentMaxIndent || newIndent < currentMaxIndent) block.setIndent(newIndent);
			}
		});
	}, 4));
}
/**
* This extension adds the ability to indent content using the tab key. Generally, we don't
* recommend using this plugin as it could negatively affect accessibility for keyboard
* users, causing focus to become trapped within the editor.
*/
var TabIndentationExtension = defineExtension({
	build(editor, config, state) {
		return namedSignals(config);
	},
	config: safeCast({
		$canIndent: $defaultCanIndent,
		disabled: false,
		maxIndent: null
	}),
	name: "@lexical/extension/TabIndentation",
	register(editor, config, state) {
		const { disabled, maxIndent, $canIndent } = state.getOutput();
		return j(() => {
			if (!disabled.value) return registerTabIndentation(editor, maxIndent, $canIndent);
		});
	}
});
//#endregion
export { InitialStateExtension as A, $defaultShouldInsertAfter as B, $getExtensionOutput as C, getExtensionDependencyFromEditor as D, getPeerDependencyFromEditorOrThrow as E, DecoratorTextExtension as F, namedSignals as G, ClearEditorExtension as H, DecoratorTextNode as I, j as J, f as K, applyFormatFromStyle as L, watchedSignal as M, $applyFormatToDom as N, LexicalBuilder as O, $isDecoratorTextNode as P, applyFormatToDom as R, $getExtensionDependency as S, getPeerDependencyFromEditor as T, registerClearEditor as U, ClickAfterLastBlockExtension as V, AutoFocusExtension as W, y as X, n as Y, INSERT_HORIZONTAL_RULE_COMMAND as _, PreventSelectAllExtension as a, WatchEditableExtension as b, NodeSelectionDataSelectedExtension as c, formatKeyboardShortcut as d, IMEExtension as f, HorizontalRuleNode as g, HorizontalRuleExtension as h, SelectBlockExtension as i, EditorStateExtension as j, buildEditorFromExtensions as k, NestedEditorExtension as l, $isHorizontalRuleNode as m, registerTabIndentation as n, NormalizeTripleClickSelectionExtension as o, $createHorizontalRuleNode as p, g as q, SelectionAlwaysOnDisplayExtension as r, NormalizeInlineElementsExtension as s, TabIndentationExtension as t, KeyboardShortcutsExtension as u, NodeSelectionExtension as v, $getPeerDependency as w, RootElementExtension as x, HMRExtension as y, getKnownTypesAndNodes as z };
