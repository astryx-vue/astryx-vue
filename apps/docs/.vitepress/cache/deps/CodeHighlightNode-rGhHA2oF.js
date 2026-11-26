import { $t as getTextDirection, Bn as $createParagraphNode, Br as $createTabNode, Ca as aliasTableOf, Fa as optional, Gr as $isTextNode, Ha as withAccessors, J as $create, Jr as setDOMStyleFromCSS, Kr as TextNode, La as setterDefaultOf, Ma as nullable, Ra as setterTableOf, Vr as $isTabNode, W as $applyNodeReplacement, a as removeClassNamesFromElement, ar as $isLineBreakNode, et as $getDocument, go as invariant, gr as ElementNode, hr as $isElementNode, ir as $createLineBreakNode, ja as nodeSchema, ka as getterTableOf, pa as warnOnlyOnce, r as addClassNamesToElement, tt as $getEditor, un as isHTMLElement, x as $getSiblingCaret, za as stringValue } from "./src-BWdqgNjM.js";
import { T as getPeerDependencyFromEditor } from "./src-DjbHpMmC.js";
//#region ../../node_modules/.pnpm/@lexical+code-core@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/code-core/src/FlatStructureUtils.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $getLastMatchingCodeNode(anchor, direction) {
	let matchingNode = anchor;
	for (let caret = $getSiblingCaret(anchor, direction); caret && ($isCodeHighlightNode(caret.origin) || $isTabNode(caret.origin)); caret = caret.getAdjacentCaret()) matchingNode = caret.origin;
	return matchingNode;
}
function $getFirstCodeNodeOfLine(anchor) {
	return $getLastMatchingCodeNode(anchor, "previous");
}
function $getLastCodeNodeOfLine(anchor) {
	return $getLastMatchingCodeNode(anchor, "next");
}
/**
* Determines the visual writing direction of a code line.
*
* Scans the line segments (CodeHighlightNode/TabNode) from start to end
* and returns the first strong direction found ("ltr" or "rtl").
* If no strong character is found, falls back to the parent element's
* direction. Returns null if indeterminate.
*/
function $getCodeLineDirection(anchor) {
	const start = $getFirstCodeNodeOfLine(anchor);
	const end = $getLastCodeNodeOfLine(anchor);
	let node = start;
	while (node !== null) {
		if ($isCodeHighlightNode(node)) {
			const direction = getTextDirection(node.getTextContent());
			if (direction !== null) return direction;
		}
		if (node === end) break;
		node = node.getNextSibling();
	}
	const parent = start.getParent();
	if ($isElementNode(parent)) {
		const parentDirection = parent.getDirection();
		if (parentDirection === "ltr" || parentDirection === "rtl") return parentDirection;
	}
	return null;
}
function $getStartOfCodeInLine(anchor, offset) {
	let last = null;
	let lastNonBlank = null;
	let node = anchor;
	let nodeOffset = offset;
	let nodeTextContent = anchor.getTextContent();
	while (true) {
		if (nodeOffset === 0) {
			const prevSibling = node.getPreviousSibling();
			if (prevSibling === null) {
				node = null;
				break;
			}
			invariant($isCodeHighlightNode(prevSibling) || $isTabNode(prevSibling) || $isLineBreakNode(prevSibling), "Expected a valid Code Node: CodeHighlightNode, TabNode, LineBreakNode");
			node = prevSibling;
			if ($isLineBreakNode(node)) {
				last = {
					node,
					offset: 1
				};
				break;
			}
			nodeOffset = Math.max(0, node.getTextContentSize() - 1);
			nodeTextContent = node.getTextContent();
		} else nodeOffset--;
		const character = nodeTextContent[nodeOffset];
		if ($isCodeHighlightNode(node) && character !== " ") lastNonBlank = {
			node,
			offset: nodeOffset
		};
	}
	if (lastNonBlank !== null) return lastNonBlank;
	let codeCharacterAtAnchorOffset = null;
	if (offset < anchor.getTextContentSize()) {
		if ($isCodeHighlightNode(anchor)) codeCharacterAtAnchorOffset = anchor.getTextContent()[offset];
	} else {
		const nextSibling = anchor.getNextSibling();
		if ($isCodeHighlightNode(nextSibling)) codeCharacterAtAnchorOffset = nextSibling.getTextContent()[0];
	}
	if (codeCharacterAtAnchorOffset !== null && codeCharacterAtAnchorOffset !== " ") return last;
	else {
		const nextNonBlank = findNextNonBlankInLine(anchor, offset);
		if (nextNonBlank !== null) return nextNonBlank;
		else return last;
	}
}
function findNextNonBlankInLine(anchor, offset) {
	let node = anchor;
	let nodeOffset = offset;
	let nodeTextContent = anchor.getTextContent();
	let nodeTextContentSize = anchor.getTextContentSize();
	while (true) {
		if (!$isCodeHighlightNode(node) || nodeOffset === nodeTextContentSize) {
			node = node.getNextSibling();
			if (node === null || $isLineBreakNode(node)) return null;
			if ($isCodeHighlightNode(node)) {
				nodeOffset = 0;
				nodeTextContent = node.getTextContent();
				nodeTextContentSize = node.getTextContentSize();
			}
		}
		if ($isCodeHighlightNode(node)) {
			if (nodeTextContent[nodeOffset] !== " ") return {
				node,
				offset: nodeOffset
			};
			nodeOffset++;
		}
	}
}
function $getEndOfCodeInLine(anchor) {
	const lastNode = $getLastCodeNodeOfLine(anchor);
	invariant(!$isLineBreakNode(lastNode), "Unexpected lineBreakNode in getEndOfCodeInLine");
	return lastNode;
}
/**
* Strip up to `tabSize` leading spaces from a {@link CodeHighlightNode} that
* starts a code line, to support outdenting space-indented code lines (e.g.
* code formatted with prettier). Returns true if any spaces were stripped.
*
* Best-effort: a line with fewer than `tabSize` leading spaces has all of
* them stripped, matching VS Code / IntelliJ behavior.
*
* Selection is preserved relative to line content. Anchor/focus offsets
* pointing into `node` shift left by the number of stripped characters
* (clamped to 0). The underlying TextNode mutation does not adjust
* selection offsets that already point into the old text, so we patch
* them up explicitly.
*/
function $outdentLeadingSpaces(node, tabSize, selection) {
	if (!Number.isInteger(tabSize) || tabSize <= 0) return false;
	const text = node.getTextContent();
	const leading = /^ +/.exec(text);
	if (!leading) return false;
	const stripCount = Math.min(tabSize, leading[0].length);
	const lineKey = node.getKey();
	const oldAnchorOffset = selection.anchor.key === lineKey && selection.anchor.type === "text" ? selection.anchor.offset : null;
	const oldFocusOffset = selection.focus.key === lineKey && selection.focus.type === "text" ? selection.focus.offset : null;
	node.spliceText(0, stripCount, "");
	if (oldAnchorOffset !== null) selection.anchor.set(lineKey, Math.max(0, oldAnchorOffset - stripCount), "text");
	if (oldFocusOffset !== null) selection.focus.set(lineKey, Math.max(0, oldFocusOffset - stripCount), "text");
	return true;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+code-core@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/code-core/src/LexicalCodeCoreGeneratedJSON.ts
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
* CodeNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneCodeNode(node, prevNode) {
	node.__language = prevNode.__language;
	node.__theme = prevNode.__theme;
}
/** CodeNode's generated implementations, for its `$config`. @internal */
var GENERATED_CODE = (fields) => {
	const CODE_FORMAT_GETTER = getterTableOf(fields, "format");
	const CODE_FORMAT_SETTER = setterTableOf(fields, "format");
	const CODE_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from CodeNode's serialization schema. Do not edit by hand. */
	function exportCodeNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			language: node.__language,
			theme: node.__theme,
			direction: node.__dir,
			format: CODE_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from CodeNode's serialization schema. Do not edit by hand. */
	function exportCompactCodeNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const language = node.__language;
		if (language !== void 0) json.language = language;
		const theme = node.__theme;
		if (theme !== void 0) json.theme = theme;
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = CODE_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from CodeNode's serialization schema. Do not edit by hand. */
	function updateCodeNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in CODE_FORMAT_SETTER ? CODE_FORMAT_SETTER[format] : CODE_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		const language = json.language;
		node.setLanguage(language == null ? language : typeof language === "string" ? language : "");
		const theme = json.theme;
		node.setTheme(theme === void 0 ? void 0 : typeof theme === "string" ? theme : "");
		return node;
	}
	return {
		exportJSON: exportCodeNode,
		exportCompactJSON: exportCompactCodeNode,
		updateFromJSON: updateCodeNode
	};
};
/**
* CodeHighlightNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneCodeHighlightNode(node, prevNode) {
	node.__highlightType = prevNode.__highlightType;
}
/** CodeHighlightNode's generated implementations, for its `$config`. @internal */
var GENERATED_CODEHIGHLIGHT = (fields) => {
	const CODEHIGHLIGHT_MODE_GETTER = getterTableOf(fields, "mode");
	const CODEHIGHLIGHT_DETAIL_ALIAS = aliasTableOf(fields, "detail", 0);
	const CODEHIGHLIGHT_FORMAT_ALIAS = aliasTableOf(fields, "format", 0);
	const CODEHIGHLIGHT_MODE_SETTER = setterTableOf(fields, "mode");
	const CODEHIGHLIGHT_MODE_SETTER_DEFAULT = setterDefaultOf(fields, "mode");
	/** Generated from CodeHighlightNode's serialization schema. Do not edit by hand. */
	function exportCodeHighlightNode(node) {
		return {
			highlightType: node.__highlightType,
			detail: node.__detail,
			format: node.__format,
			mode: CODEHIGHLIGHT_MODE_GETTER[node.__mode],
			style: node.__style,
			text: node.__text,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from CodeHighlightNode's serialization schema. Do not edit by hand. */
	function exportCompactCodeHighlightNode(node) {
		const json = { type: node.__type };
		const highlightType = node.__highlightType;
		if (highlightType !== void 0) json.highlightType = highlightType;
		const detail = node.__detail;
		if (detail !== void 0 && detail !== 0) json.detail = detail;
		const format = node.__format;
		if (format !== void 0 && format !== 0) json.format = format;
		const mode = CODEHIGHLIGHT_MODE_GETTER[node.__mode];
		if (mode !== void 0 && mode !== "normal") json.mode = mode;
		const style = node.__style;
		if (style !== void 0 && style !== "") json.style = style;
		const text = node.__text;
		if (text !== void 0 && text !== "") json.text = text;
		return json;
	}
	/** Generated from CodeHighlightNode's serialization schema. Do not edit by hand. */
	function updateCodeHighlightNode(node, json) {
		const detail = json.detail;
		node.__detail = typeof detail === "string" && detail in CODEHIGHLIGHT_DETAIL_ALIAS ? CODEHIGHLIGHT_DETAIL_ALIAS[detail] : num(detail, 0);
		const format = json.format;
		node.setFormat(typeof format === "string" && format in CODEHIGHLIGHT_FORMAT_ALIAS ? CODEHIGHLIGHT_FORMAT_ALIAS[format] : num(format, 0));
		const mode = json.mode;
		node.__mode = typeof mode === "string" && mode in CODEHIGHLIGHT_MODE_SETTER ? CODEHIGHLIGHT_MODE_SETTER[mode] : CODEHIGHLIGHT_MODE_SETTER_DEFAULT;
		const style = json.style;
		node.__style = typeof style === "string" ? style : "";
		const text = json.text;
		node.__text = typeof text === "string" ? text : "";
		const highlightType = json.highlightType;
		node.setHighlightType(highlightType == null ? highlightType : typeof highlightType === "string" ? highlightType : "");
		return node;
	}
	return {
		exportJSON: exportCodeHighlightNode,
		exportCompactJSON: exportCompactCodeHighlightNode,
		updateFromJSON: updateCodeHighlightNode,
		afterCloneFrom: afterCloneCodeHighlightNode
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+code-core@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/code-core/src/CodeNode.ts
var codeNodeSchema = nodeSchema()({
	language: withAccessors(optional(nullable(stringValue())), { getter: { field: "__language" } }),
	theme: withAccessors(optional(stringValue()), { getter: { field: "__theme" } })
});
var DEFAULT_CODE_LANGUAGE = "javascript";
/** @internal Configurable through the extensions. */
var getDefaultCodeLanguage = () => DEFAULT_CODE_LANGUAGE;
function hasChildDOMNodeTag(node, tagName) {
	for (const child of node.childNodes) {
		if (isHTMLElement(child) && child.tagName === tagName) return true;
		if (hasChildDOMNodeTag(child, tagName)) return true;
	}
	return false;
}
var LANGUAGE_DATA_ATTRIBUTE = "data-language";
var HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE = "data-highlight-language";
var THEME_DATA_ATTRIBUTE = "data-theme";
var noExtensionDeprecation = warnOnlyOnce("Using CodeNode without CodeExtension is deprecated");
/** @noInheritDoc */
var CodeNode = class extends ElementNode {
	/** @internal */
	__language;
	/** @internal */
	__theme;
	/** @internal */
	__isSyntaxHighlightSupported;
	$config() {
		return this.config("code", {
			extends: ElementNode,
			generated: GENERATED_CODE,
			importDOM: {
				code: (node) => {
					return node.textContent != null && (/\r?\n/.test(node.textContent) || hasChildDOMNodeTag(node, "BR")) ? {
						conversion: $convertPreElement,
						priority: 1
					} : null;
				},
				div: () => ({
					conversion: $convertDivElement,
					priority: 1
				}),
				pre: () => ({
					conversion: $convertPreElement,
					priority: 0
				}),
				table: (node) => {
					if (isGitHubCodeTable(node)) return {
						conversion: $convertTableElement,
						priority: 3
					};
					return null;
				},
				td: (node) => {
					const td = node;
					const table = td.closest("table");
					if (isGitHubCodeCell(td) || table && isGitHubCodeTable(table)) return {
						conversion: convertCodeNoop,
						priority: 3
					};
					return null;
				},
				tr: (node) => {
					const table = node.closest("table");
					if (table && isGitHubCodeTable(table)) return {
						conversion: convertCodeNoop,
						priority: 3
					};
					return null;
				}
			},
			json: codeNodeSchema
		});
	}
	constructor(language = void 0, key) {
		super(key);
		this.__language = language || void 0;
		this.__isSyntaxHighlightSupported = false;
		this.__theme = void 0;
	}
	afterCloneFrom(prevNode) {
		super.afterCloneFrom(prevNode);
		afterCloneCodeNode(this, prevNode);
		this.__isSyntaxHighlightSupported = prevNode.__isSyntaxHighlightSupported;
	}
	createDOM(config) {
		const element = $getDocument().createElement("code");
		addClassNamesToElement(element, config.theme.code);
		element.setAttribute("spellcheck", "false");
		const language = this.getLanguage();
		if (language) {
			element.setAttribute(LANGUAGE_DATA_ATTRIBUTE, language);
			if (this.getIsSyntaxHighlightSupported()) element.setAttribute(HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE, language);
		}
		const theme = this.getTheme();
		if (theme) element.setAttribute(THEME_DATA_ATTRIBUTE, theme);
		const style = this.getStyle();
		if (style) setDOMStyleFromCSS(element.style, style);
		return element;
	}
	updateDOM(prevNode, dom, config) {
		const language = this.__language;
		const prevLanguage = prevNode.__language;
		if (language) {
			if (language !== prevLanguage) dom.setAttribute(LANGUAGE_DATA_ATTRIBUTE, language);
		} else if (prevLanguage) dom.removeAttribute(LANGUAGE_DATA_ATTRIBUTE);
		const isSyntaxHighlightSupported = this.__isSyntaxHighlightSupported;
		if (prevNode.__isSyntaxHighlightSupported && prevLanguage) {
			if (isSyntaxHighlightSupported && language) {
				if (language !== prevLanguage) dom.setAttribute(HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE, language);
			} else dom.removeAttribute(HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE);
		} else if (isSyntaxHighlightSupported && language) dom.setAttribute(HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE, language);
		const theme = this.__theme;
		const prevTheme = prevNode.__theme;
		if (theme) {
			if (theme !== prevTheme) dom.setAttribute(THEME_DATA_ATTRIBUTE, theme);
		} else if (prevTheme) dom.removeAttribute(THEME_DATA_ATTRIBUTE);
		const style = this.__style;
		const prevStyle = prevNode.__style;
		if (style !== prevStyle) setDOMStyleFromCSS(dom.style, style, prevStyle);
		return false;
	}
	exportDOM(editor) {
		const element = $getDocument().createElement("pre");
		addClassNamesToElement(element, editor._config.theme.code);
		element.setAttribute("spellcheck", "false");
		const language = this.getLanguage();
		if (language) {
			element.setAttribute(LANGUAGE_DATA_ATTRIBUTE, language);
			if (this.getIsSyntaxHighlightSupported()) element.setAttribute(HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE, language);
		}
		const theme = this.getTheme();
		if (theme) element.setAttribute(THEME_DATA_ATTRIBUTE, theme);
		const style = this.getStyle();
		if (style) setDOMStyleFromCSS(element.style, style);
		return { element };
	}
	insertNewAfter(selection, restoreSelection = true) {
		if (!getPeerDependencyFromEditor($getEditor(), "@lexical/code")) {
			noExtensionDeprecation();
			const el = $exitCodeNodeOnEnter(selection);
			if (el) return el;
		}
		const { anchor, focus } = selection;
		const firstSelectionNode = (anchor.isBefore(focus) ? anchor : focus).getNode();
		if ($isTextNode(firstSelectionNode)) {
			let node = $getFirstCodeNodeOfLine(firstSelectionNode);
			const insertNodes = [];
			while (true) if ($isTabNode(node)) {
				insertNodes.push($createTabNode());
				node = node.getNextSibling();
			} else if ($isCodeHighlightNode(node)) {
				let spaces = 0;
				const text = node.getTextContent();
				const textSize = node.getTextContentSize();
				while (spaces < textSize && text[spaces] === " ") spaces++;
				if (spaces !== 0) insertNodes.push($createCodeHighlightNode(" ".repeat(spaces)));
				if (spaces !== textSize) break;
				node = node.getNextSibling();
			} else break;
			const split = firstSelectionNode.splitText(anchor.offset)[0];
			const x = anchor.offset === 0 ? 0 : 1;
			const index = split.getIndexWithinParent() + x;
			const codeNode = firstSelectionNode.getParentOrThrow();
			const nodesToInsert = [$createLineBreakNode(), ...insertNodes];
			codeNode.splice(index, 0, nodesToInsert);
			const last = insertNodes[insertNodes.length - 1];
			if (last) last.select();
			else if (anchor.offset === 0) split.selectPrevious();
			else split.getNextSibling().selectNext(0, 0);
		}
		if ($isCodeNode(firstSelectionNode)) {
			const { offset } = selection.anchor;
			firstSelectionNode.splice(offset, 0, [$createLineBreakNode()]);
			firstSelectionNode.select(offset + 1, offset + 1);
		}
		return null;
	}
	canIndent() {
		return false;
	}
	collapseAtStart() {
		const paragraph = $createParagraphNode();
		this.getChildren().forEach((child) => paragraph.append(child));
		this.replace(paragraph);
		return true;
	}
	setLanguage(language) {
		const writable = this.getWritable();
		writable.__language = language || void 0;
		return writable;
	}
	getLanguage() {
		return this.getLatest().__language;
	}
	setIsSyntaxHighlightSupported(isSupported) {
		const writable = this.getWritable();
		writable.__isSyntaxHighlightSupported = isSupported;
		return writable;
	}
	getIsSyntaxHighlightSupported() {
		return this.getLatest().__isSyntaxHighlightSupported;
	}
	setTheme(theme) {
		const writable = this.getWritable();
		writable.__theme = theme || void 0;
		return writable;
	}
	getTheme() {
		return this.getLatest().__theme;
	}
};
function $createCodeNode(language, theme) {
	return $create(CodeNode).setLanguage(language).setTheme(theme);
}
function $isCodeNode(node) {
	return node instanceof CodeNode;
}
function $convertPreElement(domNode) {
	return { node: $createCodeNode(domNode.getAttribute(LANGUAGE_DATA_ATTRIBUTE), domNode.getAttribute(THEME_DATA_ATTRIBUTE)) };
}
function $convertDivElement(domNode) {
	const div = domNode;
	const isCode = isCodeElement(div);
	if (!isCode && !isCodeChildElement(div)) return { node: null };
	return { node: isCode ? $createCodeNode() : null };
}
function $convertTableElement() {
	return { node: $createCodeNode() };
}
function convertCodeNoop() {
	return { node: null };
}
function isCodeElement(div) {
	return div.style.fontFamily.match("monospace") !== null;
}
function isCodeChildElement(node) {
	let parent = node.parentElement;
	while (parent !== null) {
		if (isCodeElement(parent)) return true;
		parent = parent.parentElement;
	}
	return false;
}
function isGitHubCodeCell(cell) {
	return cell.classList.contains("js-file-line");
}
function isGitHubCodeTable(table) {
	return table.classList.contains("js-file-line-container");
}
function $exitCodeNodeOnEnter(selection) {
	const { anchor } = selection;
	if (selection.isCollapsed() && anchor.type === "element") {
		const codeNode = anchor.getNode();
		if ($isCodeNode(codeNode)) {
			const childrenSize = codeNode.getChildrenSize();
			if (childrenSize >= 2 && anchor.offset === childrenSize) {
				const lastChild = codeNode.getLastChild();
				if ($isLineBreakNode(lastChild) && $isLineBreakNode(lastChild.getPreviousSibling())) {
					const newElement = $createParagraphNode();
					codeNode.splice(childrenSize - 2, 2, []).insertAfter(newElement, false);
					newElement.select();
					return newElement;
				}
			}
		}
	}
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+code-core@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/code-core/src/CodeHighlightNode.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var codeHighlightNodeSchema = nodeSchema()({ highlightType: withAccessors(optional(nullable(stringValue())), { getter: { field: "__highlightType" } }) });
/** @noInheritDoc */
var CodeHighlightNode = class extends TextNode {
	/** @internal */
	__highlightType;
	constructor(text = "", highlightType, key) {
		super(text, key);
		this.__highlightType = highlightType;
	}
	$config() {
		return this.config("code-highlight", {
			extends: TextNode,
			generated: GENERATED_CODEHIGHLIGHT,
			json: codeHighlightNodeSchema
		});
	}
	getHighlightType() {
		return this.getLatest().__highlightType;
	}
	setHighlightType(highlightType) {
		const self = this.getWritable();
		self.__highlightType = highlightType || void 0;
		return self;
	}
	canHaveFormat() {
		return false;
	}
	createDOM(config) {
		const element = super.createDOM(config);
		const className = getHighlightThemeClass(config.theme, this.__highlightType);
		addClassNamesToElement(element, className);
		return element;
	}
	updateDOM(prevNode, dom, config) {
		const update = super.updateDOM(prevNode, dom, config);
		const prevClassName = getHighlightThemeClass(config.theme, prevNode.__highlightType);
		const nextClassName = getHighlightThemeClass(config.theme, this.__highlightType);
		if (prevClassName !== nextClassName) {
			if (prevClassName) removeClassNamesFromElement(dom, prevClassName);
			if (nextClassName) addClassNamesToElement(dom, nextClassName);
		}
		return update;
	}
	setFormat(format) {
		return this;
	}
	isParentRequired() {
		return true;
	}
	createParentElementNode() {
		return $createCodeNode();
	}
};
function getHighlightThemeClass(theme, highlightType) {
	return highlightType && theme && theme.codeHighlight && theme.codeHighlight[highlightType];
}
function $createCodeHighlightNode(text = "", highlightType) {
	return $applyNodeReplacement(new CodeHighlightNode(text, highlightType));
}
function $isCodeHighlightNode(node) {
	return node instanceof CodeHighlightNode;
}
//#endregion
export { $exitCodeNodeOnEnter as a, DEFAULT_CODE_LANGUAGE as c, $getEndOfCodeInLine as d, $getFirstCodeNodeOfLine as f, $outdentLeadingSpaces as h, $createCodeNode as i, getDefaultCodeLanguage as l, $getStartOfCodeInLine as m, $isCodeHighlightNode as n, $isCodeNode as o, $getLastCodeNodeOfLine as p, CodeHighlightNode as r, CodeNode as s, $createCodeHighlightNode as t, $getCodeLineDirection as u };
