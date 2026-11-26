import { $i as KEY_SPACE_COMMAND, $n as $rewindSiblingCaret, Ai as DELETE_WORD_COMMAND, Ar as $getSelection, Bi as INSERT_LINE_BREAK_COMMAND, Bn as $createParagraphNode, Br as $createTabNode, D as $isSiblingCaret, Di as CUT_COMMAND, Dt as $setFormatFromDOM, Ea as booleanValue, Ei as COPY_COMMAND, Er as $formatText, Et as $setDirectionFromDOM, Fr as $isRangeSelection, Gi as KEY_ARROW_RIGHT_COMMAND, Gr as $isTextNode, Gt as getEditorPropertyFromDOMNode, Hi as INSERT_TAB_COMMAND, Ii as FORMAT_ELEMENT_COMMAND, Ir as $setTextFormat, Ji as KEY_DELETE_COMMAND, Ki as KEY_ARROW_UP_COMMAND, Kn as $getCaretRangeInDirection, La as setterDefaultOf, Li as FORMAT_TEXT_COMMAND, Mi as DRAGOVER_COMMAND, Mr as $insertNodes, Ni as DRAGSTART_COMMAND, Nt as getActiveElementDeep, Oa as enumValue, Oi as DELETE_CHARACTER_COMMAND, Ot as $setSelection, P as $getSlotFrame, Pi as DROP_COMMAND, Pr as $isNodeSelection, Ra as setterTableOf, Ri as INDENT_CONTENT_COMMAND, Rr as INTERNAL_$expandSelectionToWholeDocument, Rt as getDOMSelection, Sa as createState, Si as CLICK_COMMAND, Sr as $createNodeSelection, Ti as CONTROLLED_TEXT_INSERTION_COMMAND, Ua as withField, Ui as KEY_ARROW_DOWN_COMMAND, Un as $caretFromPoint, Vi as INSERT_PARAGRAPH_COMMAND, W as $applyNodeReplacement, Wi as KEY_ARROW_LEFT_COMMAND, X as $findMatchingParent, Xi as KEY_ENTER_COMMAND, Zi as KEY_ESCAPE_COMMAND, Zn as $normalizeCaret, at as $getNodeByKey, bt as $needsBlockCursorBeside, c as configExtension, ct as $getRoot, d as $comparePointCaretNext, do as IS_APPLE_WEBKIT, dr as $isRootNode, ea as KEY_TAB_COMMAND, et as $getDocument, f as $extendCaretToRange, fa as createCommand, g as $getChildCaret, gr as ElementNode, gt as $isShadowRootNode, h as $getCaretRange, ha as $getState, ho as IS_SAFARI, hr as $isElementNode, ht as $isSelectionCapturedInDecoratorInput, ia as PASTE_COMMAND, ja as nodeSchema, ka as getterTableOf, ki as DELETE_LINE_COMMAND, la as SELECT_ALL_COMMAND, lt as $hasAncestor, ma as $normalizeSelection, mn as isLexicalEditor, mo as IS_IOS, mt as $isRootOrShadowRoot, n as mergeRegister, na as MOVE_TO_START, o as shallowMergeConfig, oa as REMOVE_TEXT_COMMAND, oo as CAN_USE_BEFORE_INPUT, pr as $isDecoratorNode, qi as KEY_BACKSPACE_COMMAND, r as addClassNamesToElement, ra as OUTDENT_CONTENT_COMMAND, ri as PASTE_TAG, rn as isDOMNode, rt as $getNearestNodeFromDOMNode, s as safeCast, ta as MOVE_TO_END, tr as $setSelectionFromCaretRange, tt as $getEditor, u as defineExtension, ua as SET_TEXT_FORMAT_COMMAND, un as isHTMLElement, v as $getCollapsedCaretRange, va as $setState, vr as $flushSyncAfterUpdate, wn as setNodeIndentFromDOM, wr as $createRangeSelection, wt as $selectAll, x as $getSiblingCaret } from "./src-BWdqgNjM.js";
import { a as copyToClipboard, i as $writeDragSourceToDataTransfer, n as $handleRichTextDrop, o as setLexicalClipboardDataTransfer, r as $insertDataTransferForRichText, s as caretFromPoint, t as $getClipboardDataFromSelection } from "./clipboard-BFpJXOcv.js";
import { G as namedSignals, J as j, M as watchedSignal, X as y, o as NormalizeTripleClickSelectionExtension, s as NormalizeInlineElementsExtension } from "./src-DjbHpMmC.js";
import { c as $moveCharacter, u as $shouldOverrideDefaultCharacterSelection, x as $isParentRTL } from "./src-jZHBqyIl.js";
import { L as objectKlassEquals, N as eventFiles, m as $handleIndentAndOutdent, u as $getNearestBlockElementAncestorOrThrow } from "./src-9-5QzbBl.js";
import { M as defineImportRule, _ as BlockSchema, d as DOMImportExtension, l as CoreImportExtension, o as sel } from "./src-CAtUi_gH.js";
import { t as AriaLiveRegionExtension } from "./src-PbNEG9W_.js";
//#region ../../node_modules/.pnpm/@lexical+rich-text@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/rich-text/src/LexicalRichTextGeneratedJSON.ts
var JSON_NUMBER = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
function num(v, d) {
	if (typeof v === "number") return Number.isFinite(v) ? v : d;
	if (typeof v !== "string" || !JSON_NUMBER.test(v)) return d;
	const n = Number(v);
	return Number.isFinite(n) ? n : d;
}
function numC(v, d, min, max, integer) {
	const n = num(v, d);
	return n >= min && n <= max && (!integer || Number.isInteger(n)) ? n : d;
}
/**
* HeadingNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneHeadingNode(node, prevNode) {
	node.__tag = prevNode.__tag;
}
/** HeadingNode's generated implementations, for its `$config`. @internal */
var GENERATED_HEADING = (fields) => {
	const HEADING_FORMAT_GETTER = getterTableOf(fields, "format");
	const HEADING_FORMAT_SETTER = setterTableOf(fields, "format");
	const HEADING_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from HeadingNode's serialization schema. Do not edit by hand. */
	function exportHeadingNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			tag: node.__tag,
			direction: node.__dir,
			format: HEADING_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from HeadingNode's serialization schema. Do not edit by hand. */
	function exportCompactHeadingNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const tag = node.__tag;
		if (tag !== void 0 && tag !== "h1") json.tag = tag;
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = HEADING_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from HeadingNode's serialization schema. Do not edit by hand. */
	function updateHeadingNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in HEADING_FORMAT_SETTER ? HEADING_FORMAT_SETTER[format] : HEADING_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		const tag = json.tag;
		node.__tag = tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6" ? tag : "h1";
		return node;
	}
	return {
		exportJSON: exportHeadingNode,
		exportCompactJSON: exportCompactHeadingNode,
		updateFromJSON: updateHeadingNode,
		afterCloneFrom: afterCloneHeadingNode
	};
};
/** QuoteNode's generated implementations, for its `$config`. @internal */
var GENERATED_QUOTE = (fields) => {
	const QUOTE_FORMAT_GETTER = getterTableOf(fields, "format");
	const QUOTE_FORMAT_SETTER = setterTableOf(fields, "format");
	const QUOTE_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from QuoteNode's serialization schema. Do not edit by hand. */
	function exportQuoteNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			direction: node.__dir,
			format: QUOTE_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from QuoteNode's serialization schema. Do not edit by hand. */
	function exportCompactQuoteNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = QUOTE_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from QuoteNode's serialization schema. Do not edit by hand. */
	function updateQuoteNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in QUOTE_FORMAT_SETTER ? QUOTE_FORMAT_SETTER[format] : QUOTE_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		return node;
	}
	return {
		exportJSON: exportQuoteNode,
		exportCompactJSON: exportCompactQuoteNode,
		updateFromJSON: updateQuoteNode
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+rich-text@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/rich-text/src/HeadingAnnounceExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $readHeadingTag(key) {
	const node = $getNodeByKey(key);
	return $isHeadingNode(node) ? node.getTag() : null;
}
/**
* Announces headings through the {@link AriaLiveRegionExtension} sink: a block
* becoming a heading, and a heading ceasing to be one.
*
* The markdown shortcut consumes both keystrokes (`#` then space) and swaps the
* block type, which is silent to a screen reader — so without this the user has
* no way to know the transformation happened, or to confirm the level without
* navigating out of the block and back in.
*
* Only those two transitions announce. Typing inside a heading, moving the
* caret through it, and deleting text while the heading survives are all
* silent; announcing on every keystroke would make a heading impossible to type
* into.
*
* A destroyed node is gone from the current editor state, so its level is read
* from the previous state `registerMutationListener` provides.
*/
var HeadingAnnounceExtension = defineExtension({
	build: (_editor, config) => namedSignals(config),
	config: safeCast({
		created: "Heading level %s",
		destroyed: "Heading level %s removed",
		disabled: false
	}),
	dependencies: [AriaLiveRegionExtension],
	name: "@lexical/rich-text/HeadingAnnounce",
	register(editor, _config, state) {
		const { created, destroyed, disabled } = state.getOutput();
		const { announce } = state.getDependency(AriaLiveRegionExtension).output;
		return j(() => disabled.value ? void 0 : editor.registerMutationListener(HeadingNode, (nodes, { prevEditorState }) => {
			let createdTag = null;
			let destroyedTag = null;
			for (const [key, mutation] of nodes) if (mutation === "created" && createdTag === null) createdTag = editor.read("latest", () => $readHeadingTag(key));
			else if (mutation === "destroyed" && destroyedTag === null) destroyedTag = prevEditorState.read(() => $readHeadingTag(key));
			if (createdTag !== null) announce(created.peek().replace("%s", createdTag.slice(1)));
			else if (destroyedTag !== null) announce(destroyed.peek().replace("%s", destroyedTag.slice(1)));
		}, { skipInitialization: true }));
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+dragon@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/dragon/src/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var TEXT_FORMAT_BY_EXEC_COMMAND = {
	bold: "bold",
	italic: "italic",
	strikeThrough: "strikethrough",
	subscript: "subscript",
	superscript: "superscript",
	underline: "underline"
};
var WINDOW_STATE_KEY = Symbol.for("@lexical/dragon/WindowState");
function getOrCreateWindowState(targetWindow) {
	let state = targetWindow[WINDOW_STATE_KEY];
	if (state === void 0) {
		state = {
			dispose: () => {},
			editors: /* @__PURE__ */ new Map(),
			installs: /* @__PURE__ */ new Set()
		};
		targetWindow[WINDOW_STATE_KEY] = state;
	}
	return state;
}
function addInstall(targetWindow, installKey, editor) {
	const state = getOrCreateWindowState(targetWindow);
	if (state.installs.size === 0) {
		const boundHandleMessage = handleMessage.bind(targetWindow);
		targetWindow.addEventListener("message", boundHandleMessage, true);
		state.dispose = () => {
			targetWindow.removeEventListener("message", boundHandleMessage, true);
		};
	}
	state.installs.add(installKey);
	if (editor) {
		const installSet = state.editors.get(editor) || /* @__PURE__ */ new Set();
		installSet.add(installKey);
		state.editors.set(editor, installSet);
	}
	return removeInstall.bind(null, targetWindow, state, installKey, editor);
}
function removeInstall(targetWindow, state, installKey, editor) {
	if (editor) {
		const installSet = state.editors.get(editor);
		if (installSet && installSet.delete(installKey) && installSet.size === 0) state.editors.delete(editor);
	}
	if (state.installs.delete(installKey) && state.installs.size === 0) {
		state.dispose();
		delete targetWindow[WINDOW_STATE_KEY];
	}
}
function getDefaultView(el) {
	return el && el.ownerDocument.defaultView;
}
function registerDragonSupport(editor) {
	const windowSignal = watchedSignal(() => getDefaultView(editor.getRootElement()), (self) => editor.registerRootListener((rootElement) => {
		self.value = getDefaultView(rootElement);
	}));
	return j(() => {
		const targetWindow = windowSignal.value;
		if (targetWindow) return addInstall(targetWindow, Symbol("@lexical/dragon/editorInstall"), editor);
	});
}
function getFocusedEditor(targetWindow) {
	const state = targetWindow[WINDOW_STATE_KEY];
	if (state === void 0) return null;
	const activeEditor = getEditorPropertyFromDOMNode(getActiveElementDeep(targetWindow.document));
	return isLexicalEditor(activeEditor) && state.editors.has(activeEditor) ? activeEditor : null;
}
function handleMessage(event) {
	const targetWindow = this;
	if (event.origin !== targetWindow.location.origin) return;
	const editor = getFocusedEditor(targetWindow);
	if (editor === null) return;
	const data = event.data;
	if (typeof data === "string") {
		let parsedData;
		try {
			parsedData = JSON.parse(data);
		} catch (_e) {
			return;
		}
		if (parsedData && parsedData.protocol === "nuanria_messaging" && parsedData.type === "request") {
			const payload = parsedData.payload;
			if (payload && payload.functionId === "makeChanges") {
				const args = payload.args;
				if (Array.isArray(args)) {
					const [elementStart, elementLength, text, selStart, selLength, formatCommand] = args;
					if (![
						elementStart,
						elementLength,
						selStart,
						selLength
					].every(Number.isFinite) || typeof text !== "string" && text !== -1) return;
					editor.update(() => {
						const selection = $getSelection();
						if ($isRangeSelection(selection)) {
							const anchor = selection.anchor;
							let anchorNode = anchor.getNode();
							let setSelStart = 0;
							let setSelEnd = 0;
							if ($isTextNode(anchorNode)) {
								if (elementStart >= 0 && elementLength >= 0) {
									setSelStart = elementStart;
									setSelEnd = elementStart + elementLength;
									selection.setTextNodeRange(anchorNode, setSelStart, anchorNode, setSelEnd);
								}
							}
							if (typeof text === "string" && (setSelStart !== setSelEnd || text !== "")) {
								selection.insertRawText(text);
								anchorNode = anchor.getNode();
							}
							if ($isTextNode(anchorNode)) {
								const anchorNodeTextLength = anchorNode.getTextContentSize();
								setSelStart = Math.min(Math.max(selStart, 0), anchorNodeTextLength);
								setSelEnd = selStart < 0 || selLength < 0 ? setSelStart : Math.min(selStart + selLength, anchorNodeTextLength);
								selection.setTextNodeRange(anchorNode, setSelStart, anchorNode, setSelEnd);
							}
							if (typeof formatCommand === "string" && selLength > 0 && !selection.isCollapsed()) {
								const format = TEXT_FORMAT_BY_EXEC_COMMAND[formatCommand];
								if (format !== void 0) selection.formatText(format);
							}
							event.stopImmediatePropagation();
						}
					});
				}
			}
		}
	}
}
/**
* Add Dragon speech to text input support to the editor, via the
* \@lexical/dragon module.
*/
var DragonExtension = defineExtension({
	build: (editor, config, state) => namedSignals(config),
	config: safeCast({ disabled: typeof window === "undefined" }),
	name: "@lexical/dragon",
	register: (editor, config, state) => j(() => state.getOutput().disabled.value ? void 0 : registerDragonSupport(editor))
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+rich-text@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/rich-text/src/RichTextImportExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Heuristic copied (in spirit) from the legacy `isGoogleDocsTitle`:
* Google Docs serializes the document title as a `<span style="font-size:
* 26pt">` (sometimes wrapped in a `<p>`). The presence of a 26pt span at
* the start of a `<p>` is treated as a heading-1 marker.
*/
function isGoogleDocsTitleSpan(node) {
	return isHTMLElement(node) && node.nodeName === "SPAN" && node.style.fontSize === "26pt";
}
var HeadingRule = defineImportRule({
	$import: (ctx, el) => {
		const node = $createHeadingNode(el.nodeName.toLowerCase());
		setNodeIndentFromDOM(el, node);
		$setFormatFromDOM(node, el);
		$setDirectionFromDOM(node, el);
		return [node.splice(0, 0, ctx.$importChildren(el))];
	},
	match: sel.tag("h1", "h2", "h3", "h4", "h5", "h6"),
	name: "@lexical/rich-text/heading"
});
var QuoteRule = defineImportRule({
	$import: (ctx, el) => {
		const node = $createQuoteNode();
		$setFormatFromDOM(node, el);
		setNodeIndentFromDOM(el, node);
		$setDirectionFromDOM(node, el);
		return [node.splice(0, 0, ctx.$importChildren(el))];
	},
	match: sel.tag("blockquote"),
	name: "@lexical/rich-text/blockquote"
});
/**
* Opt-in replacement for the default `<blockquote>` rule that imports the
* quote as a shadow root {@link QuoteNode} (see `quoteShadowRootState`).
* Block-level children such as `<p>` are preserved as blocks and runs of
* inline content are wrapped in paragraphs (`BlockSchema`), so structured
* blockquote HTML round-trips faithfully instead of being flattened to
* inline content.
*
* Not part of {@link RichTextImportRules}; without it `<blockquote>`
* import behavior is unchanged. To opt in, contribute it from somewhere
* that outranks {@link RichTextImportRules} in the compiled rule list —
* either directly to the editor builder:
* ```ts
* buildEditorFromExtensions(
*   MyExtension,
*   configExtension(DOMImportExtension, {rules: [ShadowRootQuoteRule]}),
* )
* ```
* or from an extension that depends on {@link RichTextExtension}:
* ```ts
* defineExtension({
*   dependencies: [
*     RichTextExtension,
*     configExtension(DOMImportExtension, {rules: [ShadowRootQuoteRule]}),
*   ],
*   name: '@app/quotes',
* })
* ```
* Either way the contribution is merged after rich-text's and therefore
* prepended in front of it, so this rule is reached first and shadows the
* default `@lexical/rich-text/blockquote` rule.
*
* @experimental
*/
var ShadowRootQuoteRule = defineImportRule({
	$import: (ctx, el) => {
		const node = $createQuoteNode({ shadowRoot: true });
		$setFormatFromDOM(node, el);
		setNodeIndentFromDOM(el, node);
		$setDirectionFromDOM(node, el);
		return [node.splice(0, 0, ctx.$importChildren(el, { schema: BlockSchema }))];
	},
	match: sel.tag("blockquote"),
	name: "@lexical/rich-text/blockquote-shadow-root"
});
/**
* Import rules for {@link HeadingNode} and {@link QuoteNode}, including
* the Google Docs title heuristic that the legacy `HeadingNode.importDOM`
* declared. This whole array is contributed by {@link RichTextExtension},
* which depends on `CoreImportExtension`, so it is prepended in front of
* {@link CoreImportRules}: the Google-Docs `<p>` / `<span>` rules here are
* reached before the generic `<p>` and `<span>` rules from core, and defer
* to them via `$next()` when the Google-Docs heuristic doesn't match.
*
* Registered by {@link RichTextExtension} itself (together with
* `CoreImportExtension`), so any editor that uses the rich-text
* extension can import these tags through the `DOMImportExtension`
* pipeline without further configuration.
*
* @experimental
*/
var RichTextImportRules = [
	HeadingRule,
	QuoteRule,
	defineImportRule({
		$import: (ctx, el, $next) => {
			const first = el.firstChild;
			if (first && isGoogleDocsTitleSpan(first)) return ctx.$importChildren(el);
			return $next();
		},
		match: sel.tag("p"),
		name: "@lexical/rich-text/google-docs-title-p"
	}),
	defineImportRule({
		$import: (ctx, el, $next) => el.style.fontSize !== "26pt" ? $next() : [$createHeadingNode("h1").splice(0, 0, ctx.$importChildren(el))],
		match: sel.tag("span"),
		name: "@lexical/rich-text/google-docs-title-span"
	})
];
//#endregion
//#region ../../node_modules/.pnpm/@lexical+rich-text@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/rich-text/src/LexicalRichTextExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var DEFAULT_RICH_TEXT_CONFIG = {
	escapeFormatTriggers: {
		capitalize: {
			enter: true,
			space: true,
			tab: true
		},
		lowercase: {
			enter: true,
			space: true,
			tab: true
		},
		uppercase: {
			enter: true,
			space: true,
			tab: true
		}
	},
	shouldHandlePasteAsFiles: defaultShouldHandlePasteAsFiles
};
function mergeTriggerConfig(config, override) {
	if (!config || override === null) return override;
	return shallowMergeConfig(config, override);
}
function mergeEscapeFormatTriggers(config, overrides) {
	const merged = shallowMergeConfig(config, overrides);
	for (const k of Object.keys(overrides)) merged[k] = mergeTriggerConfig(config[k], overrides[k]);
	return merged;
}
function mergeRichTextConfig(config, overrides) {
	const merged = shallowMergeConfig(config, overrides);
	if (overrides.escapeFormatTriggers) merged.escapeFormatTriggers = mergeEscapeFormatTriggers(config.escapeFormatTriggers, overrides.escapeFormatTriggers);
	return merged;
}
var RichTextExtension = defineExtension({
	build: (_editor, config) => namedSignals(config),
	config: safeCast(DEFAULT_RICH_TEXT_CONFIG),
	conflictsWith: ["@lexical/plain-text"],
	dependencies: [
		HeadingAnnounceExtension,
		DragonExtension,
		NormalizeInlineElementsExtension,
		NormalizeTripleClickSelectionExtension,
		CoreImportExtension,
		configExtension(DOMImportExtension, { rules: RichTextImportRules })
	],
	mergeConfig: mergeRichTextConfig,
	name: "@lexical/rich-text",
	nodes: () => [HeadingNode, QuoteNode],
	register: (editor, _config, state) => j(() => {
		const { escapeFormatTriggers, shouldHandlePasteAsFiles } = state.getOutput();
		return registerRichText(editor, escapeFormatTriggers, shouldHandlePasteAsFiles);
	})
});
/**
* Bundles {@link RichTextImportRules} together with the runtime
* {@link RichTextExtension}.
*
* @experimental
* @deprecated {@link RichTextExtension} now registers
* {@link RichTextImportRules} (and `CoreImportExtension`) itself —
* depend on it directly instead.
*/
var RichTextImportExtension = defineExtension({
	dependencies: [RichTextExtension],
	name: "@lexical/rich-text/Import"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+rich-text@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/rich-text/src/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var DRAG_DROP_PASTE = createCommand("DRAG_DROP_PASTE_FILE");
/**
* Opt-in state for {@link QuoteNode.isShadowRoot}. When `true`, the quote
* behaves like a multi-block region (similar to a table cell): it holds
* block-level children (paragraphs, headings, ...) instead of inline
* content, which allows more faithful HTML and Markdown import/export of
* `<blockquote>` content. Defaults to `false`, in which case there is no
* change to the legacy behavior (and nothing extra is serialized).
*/
var quoteShadowRootState = createState("shadowRoot", { parse: booleanValue() });
/** @noInheritDoc */
var QuoteNode = class extends ElementNode {
	$config() {
		return this.config("quote", {
			extends: ElementNode,
			generated: GENERATED_QUOTE,
			importDOM: { blockquote: () => ({
				conversion: $convertBlockquoteElement,
				priority: 0
			}) },
			stateConfigs: [{
				flat: true,
				stateConfig: quoteShadowRootState
			}]
		});
	}
	/**
	* `true` when this quote has opted in to shadow root behavior with
	* {@link setIsShadowRoot} or `$createQuoteNode({shadowRoot: true})`,
	* in which case it contains block-level children rather than inline
	* content. `false` (the legacy inline-content behavior) by default.
	*/
	isShadowRoot() {
		return $getState(this, quoteShadowRootState);
	}
	/**
	* Opt this quote in to (or out of) shadow root behavior. See
	* {@link quoteShadowRootState}. Note that this does not restructure any
	* existing children; a shadow root quote is expected to contain
	* block-level children (non-element children will be normalized into
	* paragraphs by the built-in shadow root transform).
	*/
	setIsShadowRoot(isShadowRoot) {
		return $setState(this, quoteShadowRootState, isShadowRoot);
	}
	createDOM(config) {
		const element = $getDocument().createElement("blockquote");
		addClassNamesToElement(element, config.theme.quote);
		return element;
	}
	updateDOM(prevNode, dom, config) {
		return false;
	}
	exportDOM(editor) {
		const { element } = super.exportDOM(editor);
		if (isHTMLElement(element)) {
			if (this.isEmpty()) element.append($getDocument().createElement("br"));
			const formatType = this.getFormatType();
			if (formatType) element.style.textAlign = formatType;
			const direction = this.getDirection();
			if (direction) element.dir = direction;
		}
		return { element };
	}
	static importJSON(serializedNode) {
		return $createQuoteNode().updateFromJSON(serializedNode);
	}
	insertNewAfter(rangeSelection, restoreSelection) {
		const newBlock = $createParagraphNode();
		newBlock.setTextFormat(rangeSelection.format);
		newBlock.setTextStyle(rangeSelection.style);
		const direction = this.getDirection();
		newBlock.setDirection(direction);
		newBlock.setFormat(this.getFormatType());
		newBlock.setStyle(this.getStyle());
		this.insertAfter(newBlock, restoreSelection);
		return newBlock;
	}
	collapseAtStart() {
		if (this.isShadowRoot()) {
			for (const child of this.getChildren()) this.insertBefore(child);
			this.remove();
			return true;
		}
		const paragraph = $createParagraphNode();
		this.getChildren().forEach((child) => paragraph.append(child));
		this.replace(paragraph);
		return true;
	}
	canMergeWhenEmpty() {
		return true;
	}
};
function $createQuoteNode(options) {
	const node = $applyNodeReplacement(new QuoteNode());
	return options && options.shadowRoot ? node.setIsShadowRoot(true) : node;
}
function $isQuoteNode(node) {
	return node instanceof QuoteNode;
}
var headingNodeSchema = nodeSchema()({ tag: withField(enumValue([
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6"
]), { field: "__tag" }) });
/** @noInheritDoc */
var HeadingNode = class extends ElementNode {
	/** @internal */
	__tag;
	$config() {
		return this.config("heading", {
			extends: ElementNode,
			generated: GENERATED_HEADING,
			importDOM: {
				h1: () => ({
					conversion: $convertHeadingElement,
					priority: 0
				}),
				h2: () => ({
					conversion: $convertHeadingElement,
					priority: 0
				}),
				h3: () => ({
					conversion: $convertHeadingElement,
					priority: 0
				}),
				h4: () => ({
					conversion: $convertHeadingElement,
					priority: 0
				}),
				h5: () => ({
					conversion: $convertHeadingElement,
					priority: 0
				}),
				h6: () => ({
					conversion: $convertHeadingElement,
					priority: 0
				}),
				p: (node) => {
					const firstChild = node.firstChild;
					if (firstChild !== null && isGoogleDocsTitle(firstChild)) return {
						conversion: () => ({ node: null }),
						priority: 3
					};
					return null;
				},
				span: (node) => {
					if (isGoogleDocsTitle(node)) return {
						conversion: () => {
							return { node: $createHeadingNode("h1") };
						},
						priority: 3
					};
					return null;
				}
			},
			json: headingNodeSchema
		});
	}
	constructor(tag = "h1", key) {
		super(key);
		this.__tag = tag;
	}
	getTag() {
		return this.getLatest().__tag;
	}
	setTag(tag) {
		const self = this.getWritable();
		self.__tag = tag;
		return self;
	}
	createDOM(config) {
		const tag = this.__tag;
		const element = $getDocument().createElement(tag);
		const classNames = config.theme.heading;
		if (classNames !== void 0) {
			const className = classNames[tag];
			addClassNamesToElement(element, className);
		}
		return element;
	}
	updateDOM(prevNode, dom, config) {
		return prevNode.__tag !== this.__tag;
	}
	exportDOM(editor) {
		const { element } = super.exportDOM(editor);
		if (isHTMLElement(element)) {
			if (this.isEmpty()) element.append($getDocument().createElement("br"));
			const formatType = this.getFormatType();
			if (formatType) element.style.textAlign = formatType;
			const direction = this.getDirection();
			if (direction) element.dir = direction;
		}
		return { element };
	}
	insertNewAfter(selection, restoreSelection = true) {
		const anchorOffet = selection ? selection.anchor.offset : 0;
		const lastDesc = this.getLastDescendant();
		const newElement = !lastDesc || selection && selection.anchor.key === lastDesc.getKey() && anchorOffet === lastDesc.getTextContentSize() || !selection ? $createParagraphNode() : $createHeadingNode(this.getTag()).setFormat(this.getFormatType()).setStyle(this.getStyle());
		const direction = this.getDirection();
		newElement.setDirection(direction);
		this.insertAfter(newElement, restoreSelection);
		if (anchorOffet === 0 && !this.isEmpty() && selection) {
			const paragraph = $createParagraphNode();
			paragraph.select();
			this.replace(paragraph, true);
		}
		return newElement;
	}
	collapseAtStart() {
		if (this.isEmpty()) {
			const paragraph = $createParagraphNode();
			this.getChildren().forEach((child) => paragraph.append(child));
			this.replace(paragraph);
		}
		return true;
	}
	extractWithChild() {
		return true;
	}
};
function isGoogleDocsTitle(domNode) {
	if (domNode.nodeName.toLowerCase() === "span") return domNode.style.fontSize === "26pt";
	return false;
}
function $convertHeadingElement(element) {
	const nodeName = element.nodeName.toLowerCase();
	let node = null;
	if (nodeName === "h1" || nodeName === "h2" || nodeName === "h3" || nodeName === "h4" || nodeName === "h5" || nodeName === "h6") {
		node = $createHeadingNode(nodeName);
		setNodeIndentFromDOM(element, node);
		$setFormatFromDOM(node, element);
		$setDirectionFromDOM(node, element);
	}
	return { node };
}
function $convertBlockquoteElement(element) {
	const node = $createQuoteNode();
	$setFormatFromDOM(node, element);
	setNodeIndentFromDOM(element, node);
	$setDirectionFromDOM(node, element);
	return { node };
}
function $createHeadingNode(headingTag = "h1") {
	return $applyNodeReplacement(new HeadingNode(headingTag));
}
function $isHeadingNode(node) {
	return node instanceof HeadingNode;
}
function onPasteForRichText(event, editor) {
	event.preventDefault();
	editor.update(() => {
		const selection = $getSelection();
		const clipboardData = objectKlassEquals(event, InputEvent) || objectKlassEquals(event, KeyboardEvent) ? null : event.clipboardData;
		if (clipboardData != null && selection !== null) $insertDataTransferForRichText(clipboardData, selection, editor);
	}, { tag: PASTE_TAG });
}
async function onCutForRichText(event, editor) {
	editor.update(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection) && !selection.isCollapsed()) INTERNAL_$expandSelectionToWholeDocument(selection);
	}, {
		discrete: true,
		tag: "cut"
	});
	await copyToClipboard(editor, objectKlassEquals(event, ClipboardEvent) ? event : null);
	editor.update(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) selection.removeText();
		else if ($isNodeSelection(selection)) selection.getNodes().forEach((node) => node.remove());
	}, { tag: "cut" });
}
function $isTargetWithinDecorator(target) {
	const node = $getNearestNodeFromDOMNode(target);
	return $isDecoratorNode(node);
}
function $isSelectionAtEndOfRoot(selection) {
	const focus = selection.focus;
	return focus.key === "root" && focus.offset === $getRoot().getChildrenSize();
}
function $isSelectionAtStartOfRoot(selection) {
	const focus = selection.focus;
	return focus.key === "root" && focus.offset === 0;
}
/**
* True when the selection is a collapsed element point at the very start or
* end of the root, beside a child that renders a block cursor (a decorator, a
* table or another shadow root). There is nothing past the block cursor to
* move to, so horizontal arrow navigation in that direction has to be a no-op.
* Left to the browser, the native caret escapes to the other side of the block
* instead and the caret appears to cycle around it. See #7999.
*/
function $isBlockCursorAtRootEdge(selection, direction) {
	if (!selection.isCollapsed()) return false;
	const isNext = direction === "next";
	if (!(isNext ? $isSelectionAtEndOfRoot(selection) : $isSelectionAtStartOfRoot(selection))) return false;
	const offset = selection.focus.offset;
	return $needsBlockCursorBeside($getRoot().getChildAtIndex(isNext ? offset - 1 : offset));
}
function $isSelectionCollapsedAtFrontOfIndentedBlock(selection) {
	if (!selection.isCollapsed()) return false;
	const { anchor } = selection;
	if (anchor.offset !== 0) return false;
	const anchorNode = anchor.getNode();
	if ($isRootNode(anchorNode)) return false;
	const element = $getNearestBlockElementAncestorOrThrow(anchorNode);
	return element.getIndent() > 0 && (element.is(anchorNode) || anchorNode.is(element.getFirstDescendant()));
}
function $escapeFormatsForTrigger(selection, trigger, direction, config) {
	let isBoundary = false;
	let anchorNode = null;
	if (selection.isCollapsed() && selection.anchor.type === "text") {
		const node = selection.anchor.getNode();
		if ($isTextNode(node)) {
			anchorNode = node;
			const offset = selection.anchor.offset;
			const atEnd = offset === node.getTextContentSize() && node.getNextSibling() === null;
			const atStart = offset === 0 && node.getPreviousSibling() === null;
			isBoundary = direction === "end" && atEnd || direction === "start" && atStart || direction === "both" && (atEnd || atStart);
		}
	}
	let didEscapeBoundary = false;
	for (const [formatKey, triggers] of Object.entries(config)) {
		if (triggers == null || !triggers[trigger]) continue;
		const format = formatKey;
		if (triggers.onlyAtBoundary) {
			if (!isBoundary || !anchorNode || !$isTextNode(anchorNode) || !anchorNode.hasFormat(format)) continue;
			didEscapeBoundary = true;
		}
		if (selection.hasFormat(format)) selection.toggleFormat(format);
	}
	if (didEscapeBoundary) selection.setStyle("");
}
var DEFAULT_ESCAPE_FORMAT_TRIGGERS = {
	capitalize: {
		enter: true,
		space: true,
		tab: true
	},
	lowercase: {
		enter: true,
		space: true,
		tab: true
	},
	uppercase: {
		enter: true,
		space: true,
		tab: true
	}
};
function $tryEnterFromBlockCursor(selection, direction) {
	if (!selection.isCollapsed() || selection.anchor.type !== "element") return false;
	const child = $caretFromPoint(selection.anchor, direction).getNodeAtCaret();
	if ($isShadowRootNode(child) && !child.isInline()) {
		$setSelectionFromCaretRange($getCollapsedCaretRange($normalizeCaret($getChildCaret(child, direction))));
		return true;
	}
	return false;
}
function $tryBlockCursorShadowRootNavigation(selection, direction) {
	return $tryExitShadowRootToBlockCursor(selection, direction) || $tryEnterFromBlockCursor(selection, direction);
}
function $tryExitShadowRootToBlockCursor(selection, direction) {
	if (!selection.isCollapsed()) return false;
	const focusCaret = $caretFromPoint(selection.focus, direction);
	const shadowRoot = $findMatchingParent(focusCaret.origin, $isShadowRootNode);
	if (!shadowRoot) return false;
	const focusNode = selection.focus.getNode();
	if (!shadowRoot.is(focusNode) && !$hasAncestor(focusNode, shadowRoot)) return false;
	const textRange = $getCaretRange(focusCaret, $getSiblingCaret(shadowRoot, direction));
	if (textRange.getTextSlices().some((slice) => slice && slice.getTextContentSize() > 0)) return false;
	const range = $getCaretRange(textRange.anchor.getSiblingCaret(), textRange.focus);
	let prevOrigin = range.anchor.origin;
	for (const caret of range) {
		if (!($isSiblingCaret(caret) && caret.origin.is(prevOrigin.getParent()))) return false;
		prevOrigin = caret.origin;
	}
	let prevShadow = shadowRoot;
	for (const caret of $extendCaretToRange($getSiblingCaret(shadowRoot, direction))) {
		if (caret.origin.is(prevShadow.getParent())) {
			if (!$isShadowRootNode(caret.origin)) break;
			prevShadow = caret.origin;
			continue;
		}
		if ($needsBlockCursorBeside(caret.origin)) {
			const sr = $getSiblingCaret(prevShadow, direction);
			$setSelectionFromCaretRange($getCaretRange(sr, sr));
			return true;
		}
		break;
	}
	return false;
}
function $isSelectableBlockDecorator(node) {
	return $isDecoratorNode(node) && !node.isInline() && !node.isIsolated() && node.isKeyboardSelectable();
}
function $selectNode(key) {
	const nodeSelection = $createNodeSelection();
	nodeSelection.add(key);
	$setSelection(nodeSelection);
}
function $tryDecoratorLineNavigation(selection, isBackward) {
	if (!selection.isCollapsed()) return false;
	const focus = selection.focus;
	const focusNode = focus.getNode();
	const direction = isBackward ? "previous" : "next";
	const focusCaret = $caretFromPoint(focus, direction);
	if (focus.type === "element" && $isElementNode(focusNode) && $isRootOrShadowRoot(focusNode)) {
		const adjacentChild = focusCaret.getNodeAtCaret();
		if (adjacentChild !== null && $isSelectableBlockDecorator(adjacentChild)) {
			$selectNode(adjacentChild.__key);
			return true;
		}
		return false;
	}
	const topBlock = $findMatchingParent($isElementNode(focusNode) ? focusNode : focusNode.getParentOrThrow(), (n) => $isElementNode(n) && !n.isInline() && $isRootOrShadowRoot(n.getParent()));
	if (topBlock === null) return false;
	const adjacentSibling = $getSiblingCaret(topBlock, direction).getNodeAtCaret();
	if (adjacentSibling === null || !$isSelectableBlockDecorator(adjacentSibling)) return false;
	if (topBlock.getTextContentSize() === 0) {
		$selectNode(adjacentSibling.__key);
		return true;
	}
	const rootElement = $getEditor().getRootElement();
	if (rootElement === null) return false;
	const domSelection = getDOMSelection(rootElement.ownerDocument.defaultView);
	if (domSelection === null || domSelection.rangeCount === 0) return false;
	const savedAnchorNode = domSelection.anchorNode;
	const savedAnchorOffset = domSelection.anchorOffset;
	const savedFocusNode = domSelection.focusNode;
	const savedFocusOffset = domSelection.focusOffset;
	domSelection.modify("move", isBackward ? "backward" : "forward", "line");
	const newAnchorNode = domSelection.anchorNode;
	const newAnchorOffset = domSelection.anchorOffset;
	if (newAnchorNode === null) {
		restoreDOMSelection(domSelection, savedAnchorNode, savedAnchorOffset, savedFocusNode, savedFocusOffset);
		return false;
	}
	const movedNode = $getNearestNodeFromDOMNode(newAnchorNode);
	restoreDOMSelection(domSelection, savedAnchorNode, savedAnchorOffset, savedFocusNode, savedFocusOffset);
	if (movedNode === null) return false;
	if (newAnchorNode === savedAnchorNode && newAnchorOffset === savedAnchorOffset) {
		$selectNode(adjacentSibling.__key);
		return true;
	}
	if (movedNode.is(topBlock) || $hasAncestor(movedNode, topBlock)) return false;
	$selectNode(adjacentSibling.__key);
	return true;
}
function restoreDOMSelection(domSelection, anchorNode, anchorOffset, focusNode, focusOffset) {
	if (anchorNode !== null && focusNode !== null) domSelection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
}
function $tryInlineGridLineNavigation(selection, isBackward) {
	if (!selection.isCollapsed()) return false;
	const focusNode = selection.focus.getNode();
	const parentBlock = $findMatchingParent($isElementNode(focusNode) ? focusNode : focusNode.getParentOrThrow(), (n) => $isElementNode(n) && !n.isInline());
	if (parentBlock === null) return false;
	const editor = $getEditor();
	const rootElement = editor.getRootElement();
	if (rootElement === null) return false;
	const win = rootElement.ownerDocument.defaultView;
	if (win === null) return false;
	let hasGrid = false;
	for (const child of parentBlock.getChildren()) if ($isElementNode(child) && child.isInline()) {
		const dom = editor.getElementByKey(child.getKey());
		if (dom !== null) {
			const d = win.getComputedStyle(dom).display;
			if (d === "inline-grid" || d === "inline-flex") {
				hasGrid = true;
				break;
			}
		}
	}
	if (!hasGrid) return false;
	const siblingBlock = $getSiblingCaret(parentBlock, isBackward ? "previous" : "next").getNodeAtCaret();
	if (siblingBlock === null || !$isElementNode(siblingBlock)) {
		if (isBackward) {
			const first = parentBlock.getFirstDescendant();
			if ($isTextNode(first)) first.select(0, 0);
			else parentBlock.select(0, 0);
		} else {
			const last = parentBlock.getLastDescendant();
			if ($isTextNode(last)) {
				const len = last.getTextContentSize();
				last.select(len, len);
			} else {
				const count = parentBlock.getChildrenSize();
				parentBlock.select(count, count);
			}
		}
		return true;
	}
	const siblingDOM = editor.getElementByKey(siblingBlock.getKey());
	if (siblingDOM === null) return false;
	const domSelection = getDOMSelection(win);
	if (domSelection === null || domSelection.rangeCount === 0) return false;
	const curRange = domSelection.getRangeAt(0).cloneRange();
	curRange.collapse(true);
	const curRect = curRange.getBoundingClientRect();
	const sibRect = siblingDOM.getBoundingClientRect();
	const targetY = sibRect.top + sibRect.height / 2;
	if (curRect.height > 0) {
		const hit = caretFromPoint(curRect.left, targetY, rootElement);
		if (hit !== null && siblingDOM.contains(hit.node)) {
			const hitRange = rootElement.ownerDocument.createRange();
			hitRange.setStart(hit.node, hit.offset);
			hitRange.collapse(true);
			selection.applyDOMRange(hitRange);
			selection.dirty = true;
			return true;
		}
	}
	const targetDesc = isBackward ? siblingBlock.getLastDescendant() : siblingBlock.getFirstDescendant();
	if ($isTextNode(targetDesc)) {
		const offset = isBackward ? targetDesc.getTextContentSize() : 0;
		targetDesc.select(offset, offset);
	} else {
		const childCount = siblingBlock.getChildrenSize();
		siblingBlock.select(isBackward ? childCount : 0, isBackward ? childCount : 0);
	}
	return true;
}
function $exitNodeSelectionToward(node, direction) {
	const caret = $getSiblingCaret(node, direction);
	const sibling = caret.getAdjacentCaret();
	if (sibling !== null && $isElementNode(sibling.origin) && !sibling.origin.isInline() && sibling.origin.isShadowRoot()) $setSelectionFromCaretRange($getCollapsedCaretRange(caret));
	else if (direction === "next") node.selectNext(0, 0);
	else node.selectPrevious();
}
/**
* Convert a contiguous NodeSelection to a RangeSelection that covers the same
* siblings. Discontiguous NodeSelections cannot be represented as a range
* without selecting the nodes between them, so they retain the existing
* collapse behavior in the arrow handlers.
*/
function $convertContiguousNodeSelection(selection, direction) {
	const carets = selection.getNodes().map((node) => $getSiblingCaret(node, "next")).sort($comparePointCaretNext);
	const firstCaret = carets[0];
	const lastCaret = carets[carets.length - 1];
	if (!firstCaret || !lastCaret) return false;
	for (let i = 0; i < carets.length - 1; i++) if (!carets[i + 1].origin.is(carets[i].getNodeAtCaret())) return false;
	$setSelectionFromCaretRange($getCaretRangeInDirection($getCaretRange($rewindSiblingCaret(firstCaret), lastCaret), direction));
	$flushSyncAfterUpdate();
	return true;
}
/**
* Collapse a NodeSelection to a caret at the surrounding block's edge for
* MOVE_TO_START / MOVE_TO_END. Picks the document-order first node for
* MOVE_TO_START (`isBackward = true`) or last for MOVE_TO_END, walks up
* to the picked node's nearest non-inline ancestor, and lands the caret
* at that block's offset `0` or `childrenSize`.
*
* Document order is resolved via `$comparePointCaretNext` over each
* selected node's `'next'` sibling caret — `NodeSelection.getNodes()`
* iterates `_nodes: Set<NodeKey>` in click-insertion order, so a Set-
* index pick would land on the most-recently-clicked node, not the
* document-order first / last.
*
* A decorator nested inside an element-decorator host (e.g. inside a
* card title paragraph) promotes to the surrounding paragraph rather
* than the host's edge — the `n !== targetNode` guard excludes the
* node itself, so a whole-element NodeSelection (the host) snaps to
* its parent block, not its own interior. Falls back to the root when
* no non-inline ancestor below the root matches, which lands the
* caret at the document edge.
*
* Distinct from `KEY_ARROW_LEFT_COMMAND` / `KEY_ARROW_RIGHT_COMMAND`,
* which step to the immediate sibling via `selectPrevious` /
* `selectNext`. Cmd+Arrow is a line-end command rather than a one-step
* caret move, so the block edge is the intended target. `event.shiftKey`
* is not honored — NodeSelection has no natural "extend toward block
* edge" semantic.
*
* Always calls `preventDefault` and `stopPropagation` so Chrome's
* native Cmd+Arrow page-navigate cannot fall through.
*
* @internal
*/
function $promoteNodeSelectionToBlockEdge(selection, isBackward, event) {
	event.preventDefault();
	event.stopPropagation();
	const nodes = selection.getNodes();
	if (nodes.length === 0) return true;
	const sorted = nodes.map((node) => $getSiblingCaret(node, "next")).sort($comparePointCaretNext);
	const targetNode = (isBackward ? sorted[0] : sorted[sorted.length - 1]).origin;
	const block = $findMatchingParent(targetNode, (n) => n !== targetNode && $isElementNode(n) && !n.isInline()) ?? $getRoot();
	const offset = isBackward ? 0 : block.getChildrenSize();
	block.select(offset, offset);
	return true;
}
/**
* The historical behavior: files are only handled when the clipboard carries
* no text content at all. Note that browsers put a text/html fallback on the
* clipboard alongside the file when an image is copied via the context menu,
* so this default routes such images through the HTML importer.
*/
function defaultShouldHandlePasteAsFiles(files, hasTextContent) {
	return files.length > 0 && !hasTextContent;
}
function registerRichText(editor, escapeFormatTriggers = y(DEFAULT_ESCAPE_FORMAT_TRIGGERS), shouldHandlePasteAsFiles = y(defaultShouldHandlePasteAsFiles)) {
	return mergeRegister(editor.registerCommand(CLICK_COMMAND, (event) => {
		const selection = $getSelection();
		if ($isNodeSelection(selection)) {
			const eventTarget = event.target;
			if (isHTMLElement(eventTarget)) for (const node of selection.getNodes()) {
				const dom = editor.getElementByKey(node.getKey());
				if (dom !== null && dom.contains(eventTarget)) return false;
			}
			selection.clear();
			return true;
		}
		if ($isRangeSelection(selection)) $escapeFormatsForTrigger(selection, "click", "both", escapeFormatTriggers.peek());
		return false;
	}, 0), editor.registerCommand(DELETE_CHARACTER_COMMAND, (isBackward) => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			selection.deleteCharacter(isBackward);
			return true;
		} else if ($isNodeSelection(selection)) {
			selection.deleteNodes();
			return true;
		}
		return false;
	}, 0), editor.registerCommand(DELETE_WORD_COMMAND, (isBackward) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		selection.deleteWord(isBackward);
		return true;
	}, 0), editor.registerCommand(DELETE_LINE_COMMAND, (isBackward) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		selection.deleteLine(isBackward);
		return true;
	}, 0), editor.registerCommand(CONTROLLED_TEXT_INSERTION_COMMAND, (eventOrText) => {
		const selection = $getSelection();
		if (typeof eventOrText === "string") {
			if (selection !== null) selection.insertText(eventOrText);
		} else {
			if (selection === null) return false;
			const dataTransfer = eventOrText.dataTransfer;
			if (dataTransfer != null) $insertDataTransferForRichText(dataTransfer, selection, editor);
			else if ($isRangeSelection(selection)) {
				const data = eventOrText.data;
				if (data) selection.insertText(data);
				return true;
			}
		}
		return true;
	}, 0), editor.registerCommand(REMOVE_TEXT_COMMAND, () => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		selection.removeText();
		return true;
	}, 0), editor.registerCommand(FORMAT_TEXT_COMMAND, (format) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection) && !$isNodeSelection(selection)) return false;
		$formatText(selection, format);
		return true;
	}, 0), editor.registerCommand(SET_TEXT_FORMAT_COMMAND, (formats) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection) && !$isNodeSelection(selection)) return false;
		$setTextFormat(selection, formats);
		return true;
	}, 0), editor.registerCommand(FORMAT_ELEMENT_COMMAND, (format) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection) && !$isNodeSelection(selection)) return false;
		const nodes = selection.getNodes();
		for (const node of nodes) {
			const element = $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline());
			if (element !== null) element.setFormat(format);
		}
		return true;
	}, 0), editor.registerCommand(INSERT_LINE_BREAK_COMMAND, (selectStart) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		selection.insertLineBreak(selectStart);
		return true;
	}, 0), editor.registerCommand(INSERT_PARAGRAPH_COMMAND, () => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		selection.insertParagraph();
		return true;
	}, 0), editor.registerCommand(INSERT_TAB_COMMAND, () => {
		const tabNode = $createTabNode();
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			tabNode.setFormat(selection.format);
			tabNode.setStyle(selection.style);
		}
		$insertNodes([tabNode]);
		return true;
	}, 0), editor.registerCommand(INDENT_CONTENT_COMMAND, () => {
		return $handleIndentAndOutdent((block) => {
			const indent = block.getIndent();
			block.setIndent(indent + 1);
		});
	}, 0), editor.registerCommand(OUTDENT_CONTENT_COMMAND, () => {
		return $handleIndentAndOutdent((block) => {
			const indent = block.getIndent();
			if (indent > 0) block.setIndent(Math.max(0, indent - 1));
		});
	}, 0), editor.registerCommand(KEY_ARROW_UP_COMMAND, (event) => {
		let selection = $getSelection();
		if ($isNodeSelection(selection)) {
			const nodes = selection.getNodes();
			if (nodes.length > 0) {
				if (event.shiftKey && $convertContiguousNodeSelection(selection, "previous")) selection = $getSelection();
				else {
					event.preventDefault();
					$exitNodeSelectionToward(nodes[0], "previous");
					return true;
				}
			}
		}
		if ($isRangeSelection(selection)) {
			if ($isSelectionAtStartOfRoot(selection)) {
				event.preventDefault();
				return true;
			}
			if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, "previous")) {
				event.preventDefault();
				return true;
			}
			if (!event.shiftKey && $tryDecoratorLineNavigation(selection, true)) {
				event.preventDefault();
				return true;
			}
			if (!event.shiftKey && $tryInlineGridLineNavigation(selection, true)) {
				event.preventDefault();
				return true;
			}
		}
		return false;
	}, 0), editor.registerCommand(KEY_ARROW_DOWN_COMMAND, (event) => {
		let selection = $getSelection();
		if ($isNodeSelection(selection)) {
			const nodes = selection.getNodes();
			if (nodes.length > 0) {
				if (event.shiftKey && $convertContiguousNodeSelection(selection, "next")) selection = $getSelection();
				else {
					event.preventDefault();
					$exitNodeSelectionToward(nodes[0], "next");
					return true;
				}
			}
		}
		if ($isRangeSelection(selection)) {
			if ($isSelectionAtEndOfRoot(selection)) {
				event.preventDefault();
				return true;
			}
			if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, "next")) {
				event.preventDefault();
				return true;
			}
			if (!event.shiftKey && $tryDecoratorLineNavigation(selection, false)) {
				event.preventDefault();
				return true;
			}
			if (!event.shiftKey && $tryInlineGridLineNavigation(selection, false)) {
				event.preventDefault();
				return true;
			}
		}
		return false;
	}, 0), editor.registerCommand(KEY_ARROW_LEFT_COMMAND, (event) => {
		let selection = $getSelection();
		if ($isNodeSelection(selection)) {
			const nodes = selection.getNodes();
			if (nodes.length > 0) {
				const direction = $isParentRTL(nodes[0]) ? "next" : "previous";
				if (event.shiftKey && $convertContiguousNodeSelection(selection, direction)) selection = $getSelection();
				else {
					event.preventDefault();
					$exitNodeSelectionToward(nodes[0], direction);
					return true;
				}
			}
		}
		if (!$isRangeSelection(selection)) return false;
		const leftDirection = $isParentRTL(selection.anchor.getNode()) ? "next" : "previous";
		if ($isBlockCursorAtRootEdge(selection, leftDirection)) {
			event.preventDefault();
			return true;
		}
		if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, leftDirection)) {
			event.preventDefault();
			return true;
		}
		if (!event.shiftKey) $escapeFormatsForTrigger(selection, "arrow", "start", escapeFormatTriggers.peek());
		if ($shouldOverrideDefaultCharacterSelection(selection, true)) {
			const isHoldingShift = event.shiftKey;
			event.preventDefault();
			$moveCharacter(selection, isHoldingShift, true);
			return true;
		}
		return false;
	}, 0), editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, (event) => {
		let selection = $getSelection();
		if ($isNodeSelection(selection)) {
			const nodes = selection.getNodes();
			if (nodes.length > 0) {
				const direction = $isParentRTL(nodes[0]) ? "previous" : "next";
				if (event.shiftKey && $convertContiguousNodeSelection(selection, direction)) selection = $getSelection();
				else {
					event.preventDefault();
					$exitNodeSelectionToward(nodes[0], direction);
					return true;
				}
			}
		}
		if (!$isRangeSelection(selection)) return false;
		const rightDirection = $isParentRTL(selection.anchor.getNode()) ? "previous" : "next";
		if ($isBlockCursorAtRootEdge(selection, rightDirection)) {
			event.preventDefault();
			return true;
		}
		if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, rightDirection)) {
			event.preventDefault();
			return true;
		}
		if (!event.shiftKey) $escapeFormatsForTrigger(selection, "arrow", "end", escapeFormatTriggers.peek());
		if ($shouldOverrideDefaultCharacterSelection(selection, false)) {
			const isHoldingShift = event.shiftKey;
			event.preventDefault();
			$moveCharacter(selection, isHoldingShift, false);
			return true;
		}
		return false;
	}, 0), editor.registerCommand(KEY_BACKSPACE_COMMAND, (event) => {
		const selection = $getSelection();
		if (!$isNodeSelection(selection)) {
			if ($isTargetWithinDecorator(event.target)) return false;
		}
		if ($isRangeSelection(selection)) {
			if ($isSelectionCollapsedAtFrontOfIndentedBlock(selection)) {
				event.preventDefault();
				return editor.dispatchCommand(OUTDENT_CONTENT_COMMAND);
			}
			if (IS_IOS && CAN_USE_BEFORE_INPUT) return false;
		} else if (!$isNodeSelection(selection)) return false;
		event.preventDefault();
		return editor.dispatchCommand(DELETE_CHARACTER_COMMAND, true);
	}, 0), editor.registerCommand(KEY_DELETE_COMMAND, (event) => {
		const selection = $getSelection();
		if (!$isNodeSelection(selection)) {
			if ($isTargetWithinDecorator(event.target)) return false;
		}
		if (!($isRangeSelection(selection) || $isNodeSelection(selection))) return false;
		event.preventDefault();
		return editor.dispatchCommand(DELETE_CHARACTER_COMMAND, false);
	}, 0), editor.registerCommand(KEY_ENTER_COMMAND, (event) => {
		let selection = $getSelection();
		if ($isNodeSelection(selection)) {
			const nodes = selection.getNodes();
			if (nodes.length === 1 && $isDecoratorNode(nodes[0]) && !nodes[0].isInline()) selection = nodes[0].selectNext();
		}
		if (!$isRangeSelection(selection)) return false;
		$escapeFormatsForTrigger(selection, "enter", "both", escapeFormatTriggers.peek());
		if (event !== null) {
			if ((IS_IOS || IS_SAFARI || IS_APPLE_WEBKIT) && CAN_USE_BEFORE_INPUT) return false;
			event.preventDefault();
			if (event.shiftKey) return editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND, false);
		}
		return editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND);
	}, 0), editor.registerCommand(KEY_ESCAPE_COMMAND, () => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		editor.blur();
		return true;
	}, 0), editor.registerCommand(DROP_COMMAND, (event) => {
		const [, files] = eventFiles(event);
		if (files.length > 0) {
			const x = event.clientX;
			const y = event.clientY;
			const eventRange = caretFromPoint(x, y, editor.getRootElement());
			if (eventRange !== null) {
				const { offset: domOffset, node: domNode } = eventRange;
				const node = $getNearestNodeFromDOMNode(domNode);
				if (node !== null) {
					const selection = $createRangeSelection();
					if ($isTextNode(node)) {
						selection.anchor.set(node.getKey(), domOffset, "text");
						selection.focus.set(node.getKey(), domOffset, "text");
					} else {
						const parentKey = node.getParentOrThrow().getKey();
						const offset = node.getIndexWithinParent() + 1;
						selection.anchor.set(parentKey, offset, "element");
						selection.focus.set(parentKey, offset, "element");
					}
					const normalizedSelection = $normalizeSelection(selection);
					$setSelection(normalizedSelection);
				}
			}
			editor.dispatchCommand(DRAG_DROP_PASTE, files);
			event.preventDefault();
			return true;
		}
		return $handleRichTextDrop(event, editor);
	}, 0), editor.registerCommand(DRAGSTART_COMMAND, (event) => {
		const [isFileTransfer] = eventFiles(event);
		const selection = $getSelection();
		if (isFileTransfer && !$isRangeSelection(selection)) return false;
		if ($isRangeSelection(selection) && !selection.isCollapsed() && event.dataTransfer !== null) {
			setLexicalClipboardDataTransfer(event.dataTransfer, $getClipboardDataFromSelection(selection));
			$writeDragSourceToDataTransfer(event.dataTransfer, editor);
		}
		return true;
	}, 0), editor.registerCommand(DRAGOVER_COMMAND, (event) => {
		const [isFileTransfer] = eventFiles(event);
		const selection = $getSelection();
		if (isFileTransfer && !$isRangeSelection(selection)) return false;
		const x = event.clientX;
		const y = event.clientY;
		const eventRange = caretFromPoint(x, y, editor.getRootElement());
		if (eventRange !== null) {
			const node = $getNearestNodeFromDOMNode(eventRange.node);
			if ($isDecoratorNode(node)) event.preventDefault();
		}
		return true;
	}, 0), editor.registerCommand(SELECT_ALL_COMMAND, () => {
		const selection = $getSelection();
		$selectAll($isRangeSelection(selection) && $getSlotFrame(selection.anchor.getNode()) !== null ? selection : null);
		return true;
	}, 0), editor.registerCommand(COPY_COMMAND, (event) => {
		copyToClipboard(editor, objectKlassEquals(event, ClipboardEvent) ? event : null);
		return true;
	}, 0), editor.registerCommand(CUT_COMMAND, (event) => {
		onCutForRichText(event, editor);
		return true;
	}, 0), editor.registerCommand(PASTE_COMMAND, (event) => {
		const [, files, hasTextContent] = eventFiles(event);
		if (shouldHandlePasteAsFiles.peek()(files, hasTextContent) && editor.dispatchCommand(DRAG_DROP_PASTE, files)) return true;
		if (isDOMNode(event.target) && $isSelectionCapturedInDecoratorInput(event.target)) return false;
		if ($getSelection() !== null) {
			onPasteForRichText(event, editor);
			return true;
		}
		return false;
	}, 0), editor.registerCommand(KEY_SPACE_COMMAND, () => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) $escapeFormatsForTrigger(selection, "space", "both", escapeFormatTriggers.peek());
		return false;
	}, 0), editor.registerCommand(KEY_TAB_COMMAND, () => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) $escapeFormatsForTrigger(selection, "tab", "both", escapeFormatTriggers.peek());
		return false;
	}, 0), editor.registerCommand(MOVE_TO_END, (event) => {
		const selection = $getSelection();
		if ($isNodeSelection(selection)) return $promoteNodeSelectionToBlockEdge(selection, false, event);
		if (!$isRangeSelection(selection)) return false;
		const { anchor } = selection;
		if (anchor.type !== "element" || anchor.offset !== 0) return false;
		const element = anchor.getNode();
		if (!$isElementNode(element)) return false;
		const firstChild = element.getFirstChild();
		if (!$isDecoratorNode(firstChild) || !firstChild.isInline()) return false;
		const elementKey = element.getKey();
		const ending = element.selectEnd();
		if (event.shiftKey) ending.anchor.set(elementKey, 0, "element");
		event.preventDefault();
		event.stopPropagation();
		return true;
	}, 0), editor.registerCommand(MOVE_TO_START, (event) => {
		const selection = $getSelection();
		if ($isNodeSelection(selection)) return $promoteNodeSelectionToBlockEdge(selection, true, event);
		if (!$isRangeSelection(selection)) return false;
		const { anchor, focus } = selection;
		const focusBlock = $findMatchingParent(focus.getNode(), (node) => $isElementNode(node) && !node.isInline());
		if (focusBlock === null) return false;
		const firstChild = focusBlock.getFirstChild();
		if (!$isDecoratorNode(firstChild) || !firstChild.isInline()) return false;
		if ($findMatchingParent(anchor.getNode(), (node) => $isElementNode(node) && !node.isInline()) !== focusBlock) return false;
		const blockKey = focusBlock.getKey();
		if (focus.type === "element" && focus.key === blockKey && focus.offset === 0) return false;
		selection.focus.set(blockKey, 0, "element");
		if (!event.shiftKey) selection.anchor.set(blockKey, 0, "element");
		event.preventDefault();
		event.stopPropagation();
		return true;
	}, 0));
}
//#endregion
export { DRAG_DROP_PASTE as a, defaultShouldHandlePasteAsFiles as c, RichTextExtension as d, RichTextImportExtension as f, HeadingAnnounceExtension as h, $isQuoteNode as i, quoteShadowRootState as l, ShadowRootQuoteRule as m, $createQuoteNode as n, HeadingNode as o, RichTextImportRules as p, $isHeadingNode as r, QuoteNode as s, $createHeadingNode as t, registerRichText as u };
