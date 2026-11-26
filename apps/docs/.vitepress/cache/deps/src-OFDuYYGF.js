import { $n as $rewindSiblingCaret, Ar as $getSelection, D as $isSiblingCaret, Ea as booleanValue, Fr as $isRangeSelection, Gr as $isTextNode, Jn as $insertNodeToNearestRootAtCaret, Kr as TextNode, Kt as getNearestEditorFromDOMNode, La as setterDefaultOf, Ma as nullable, Ot as $setSelection, Pr as $isNodeSelection, Ra as setterTableOf, Ua as withField, Un as $caretFromPoint, Ur as $createTextNode, W as $applyNodeReplacement, X as $findMatchingParent, Zn as $normalizeCaret, ar as $isLineBreakNode, c as configExtension, er as $setPointFromCaret, et as $getDocument, fa as createCommand, g as $getChildCaret, go as invariant, gr as ElementNode, hr as $isElementNode, ia as PASTE_COMMAND, ja as nodeSchema, ka as getterTableOf, ln as isHTMLAnchorElement, ma as $normalizeSelection, n as mergeRegister, o as shallowMergeConfig, q as $copyNode, r as addClassNamesToElement, rn as isDOMNode, rt as $getNearestNodeFromDOMNode, s as safeCast, t as registerEventListeners, u as defineExtension, za as stringValue } from "./src-BWdqgNjM.js";
import { G as namedSignals, J as j } from "./src-DjbHpMmC.js";
import { L as objectKlassEquals } from "./src-9-5QzbBl.js";
import { M as defineImportRule, d as DOMImportExtension, l as CoreImportExtension, m as $distributeInlineWrapper, o as sel } from "./src-CAtUi_gH.js";
import { t as AriaLiveRegionExtension } from "./src-PbNEG9W_.js";
//#region ../../node_modules/.pnpm/@lexical+link@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/link/src/LexicalLinkGeneratedJSON.ts
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
* LinkNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneLinkNode(node, prevNode) {
	node.__rel = prevNode.__rel;
	node.__target = prevNode.__target;
	node.__title = prevNode.__title;
	node.__url = prevNode.__url;
}
/** LinkNode's generated implementations, for its `$config`. @internal */
var GENERATED_LINK = (fields) => {
	const LINK_FORMAT_GETTER = getterTableOf(fields, "format");
	const LINK_FORMAT_SETTER = setterTableOf(fields, "format");
	const LINK_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from LinkNode's serialization schema. Do not edit by hand. */
	function exportLinkNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			rel: node.__rel,
			target: node.__target,
			title: node.__title,
			url: node.__url,
			direction: node.__dir,
			format: LINK_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from LinkNode's serialization schema. Do not edit by hand. */
	function exportCompactLinkNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const rel = node.__rel;
		if (rel != null) json.rel = rel;
		const target = node.__target;
		if (target != null) json.target = target;
		const title = node.__title;
		if (title != null) json.title = title;
		const url = node.__url;
		if (url !== void 0 && url !== "") json.url = url;
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = LINK_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from LinkNode's serialization schema. Do not edit by hand. */
	function updateLinkNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in LINK_FORMAT_SETTER ? LINK_FORMAT_SETTER[format] : LINK_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		const rel = json.rel;
		node.__rel = typeof rel === "string" && rel !== "" ? rel : null;
		const target = json.target;
		node.__target = typeof target === "string" && target !== "" ? target : null;
		const title = json.title;
		node.__title = typeof title === "string" && title !== "" ? title : null;
		const url = json.url;
		node.__url = typeof url === "string" ? url : "";
		return node;
	}
	return {
		exportJSON: exportLinkNode,
		exportCompactJSON: exportCompactLinkNode,
		updateFromJSON: updateLinkNode,
		afterCloneFrom: afterCloneLinkNode
	};
};
/**
* AutoLinkNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneAutoLinkNode(node, prevNode) {
	node.__isUnlinked = prevNode.__isUnlinked;
}
/** AutoLinkNode's generated implementations, for its `$config`. @internal */
var GENERATED_AUTOLINK = (fields) => {
	const AUTOLINK_FORMAT_GETTER = getterTableOf(fields, "format");
	const AUTOLINK_FORMAT_SETTER = setterTableOf(fields, "format");
	const AUTOLINK_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from AutoLinkNode's serialization schema. Do not edit by hand. */
	function exportAutoLinkNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			isUnlinked: node.__isUnlinked,
			rel: node.__rel,
			target: node.__target,
			title: node.__title,
			url: node.__url,
			direction: node.__dir,
			format: AUTOLINK_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from AutoLinkNode's serialization schema. Do not edit by hand. */
	function exportCompactAutoLinkNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const isUnlinked = node.__isUnlinked;
		if (isUnlinked !== void 0 && isUnlinked !== false) json.isUnlinked = isUnlinked;
		const rel = node.__rel;
		if (rel != null) json.rel = rel;
		const target = node.__target;
		if (target != null) json.target = target;
		const title = node.__title;
		if (title != null) json.title = title;
		const url = node.__url;
		if (url !== void 0 && url !== "") json.url = url;
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = AUTOLINK_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from AutoLinkNode's serialization schema. Do not edit by hand. */
	function updateAutoLinkNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in AUTOLINK_FORMAT_SETTER ? AUTOLINK_FORMAT_SETTER[format] : AUTOLINK_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		const rel = json.rel;
		node.__rel = typeof rel === "string" && rel !== "" ? rel : null;
		const target = json.target;
		node.__target = typeof target === "string" && target !== "" ? target : null;
		const title = json.title;
		node.__title = typeof title === "string" && title !== "" ? title : null;
		const url = json.url;
		node.__url = typeof url === "string" ? url : "";
		const isUnlinked = json.isUnlinked;
		node.__isUnlinked = typeof isUnlinked === "boolean" ? isUnlinked : false;
		return node;
	}
	return {
		exportJSON: exportAutoLinkNode,
		exportCompactJSON: exportCompactAutoLinkNode,
		updateFromJSON: updateAutoLinkNode,
		afterCloneFrom: afterCloneAutoLinkNode
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+link@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/link/src/LexicalLinkNode.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var SUPPORTED_URL_PROTOCOLS = /* @__PURE__ */ new Set([
	"http:",
	"https:",
	"mailto:",
	"sms:",
	"tel:"
]);
var linkNodeSchema = nodeSchema()({
	rel: withField(nullable(stringValue(), { defaultAsNull: true }), { field: "__rel" }),
	target: withField(nullable(stringValue(), { defaultAsNull: true }), { field: "__target" }),
	title: withField(nullable(stringValue(), { defaultAsNull: true }), { field: "__title" }),
	url: withField(stringValue(), {
		field: "__url",
		getter: "getURL",
		setter: "setURL"
	})
});
/** @noInheritDoc */
var LinkNode = class extends ElementNode {
	/** @internal */
	__url;
	/** @internal */
	__target;
	/** @internal */
	__rel;
	/** @internal */
	__title;
	$config() {
		return this.config("link", {
			extends: ElementNode,
			generated: GENERATED_LINK,
			importDOM: { a: () => ({
				conversion: $convertAnchorElement,
				priority: 1
			}) },
			json: linkNodeSchema
		});
	}
	constructor(url = "", attributes = {}, key) {
		super(key);
		const { target = null, rel = null, title = null } = attributes;
		this.__url = url;
		this.__target = target;
		this.__rel = rel;
		this.__title = title;
	}
	createDOM(config) {
		const element = $getDocument().createElement("a");
		this.updateLinkDOM(null, element, config);
		addClassNamesToElement(element, config.theme.link);
		return element;
	}
	updateLinkDOM(prevNode, anchor, config) {
		if (isHTMLAnchorElement(anchor)) {
			if (!prevNode || prevNode.__url !== this.__url) anchor.href = this.sanitizeUrl(this.__url);
			for (const attr of [
				"target",
				"rel",
				"title"
			]) {
				const key = `__${attr}`;
				const value = this[key];
				if (!prevNode || prevNode[key] !== value) {
					if (value) anchor[attr] = value;
					else anchor.removeAttribute(attr);
				}
			}
		}
	}
	updateDOM(prevNode, anchor, config) {
		this.updateLinkDOM(prevNode, anchor, config);
		return false;
	}
	sanitizeUrl(url) {
		const rawUrl = url;
		url = formatUrl(url);
		try {
			const parsedUrl = new URL(formatUrl(url));
			if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) return "about:blank";
		} catch {
			const schemeMatch = rawUrl.replace(/[\u0000-\u001F\u007F\s]/g, "").match(/^([a-z][a-z0-9+.-]*):/i);
			if (schemeMatch != null && !SUPPORTED_URL_PROTOCOLS.has(`${schemeMatch[1].toLowerCase()}:`)) return "about:blank";
		}
		return url;
	}
	getURL() {
		return this.getLatest().__url;
	}
	setURL(url) {
		const writable = this.getWritable();
		writable.__url = url;
		return writable;
	}
	getTarget() {
		return this.getLatest().__target;
	}
	setTarget(target) {
		const writable = this.getWritable();
		writable.__target = target;
		return writable;
	}
	getRel() {
		return this.getLatest().__rel;
	}
	setRel(rel) {
		const writable = this.getWritable();
		writable.__rel = rel;
		return writable;
	}
	getTitle() {
		return this.getLatest().__title;
	}
	setTitle(title) {
		const writable = this.getWritable();
		writable.__title = title;
		return writable;
	}
	insertNewAfter(_, restoreSelection = true) {
		const linkNode = $copyNode(this);
		this.insertAfter(linkNode, restoreSelection);
		return linkNode;
	}
	canInsertTextBefore() {
		return false;
	}
	canInsertTextAfter() {
		return false;
	}
	canBeEmpty() {
		return false;
	}
	isInline() {
		return true;
	}
	extractWithChild(child, selection, destination) {
		if (!$isRangeSelection(selection)) return false;
		const anchorNode = selection.anchor.getNode();
		const focusNode = selection.focus.getNode();
		return (this.is(anchorNode) || this.isParentOf(anchorNode)) && (this.is(focusNode) || this.isParentOf(focusNode)) && selection.getTextContent().length > 0;
	}
	isEmailURI() {
		return this.getURL().startsWith("mailto:");
	}
	isWebSiteURI() {
		const url = this.getURL();
		return url.startsWith("https://") || url.startsWith("http://");
	}
	shouldMergeAdjacentLink(otherLink) {
		return this.getType() === otherLink.getType() && this.getURL() === otherLink.getURL() && this.getTarget() === otherLink.getTarget() && this.getRel() === otherLink.getRel() && this.getTitle() === otherLink.getTitle();
	}
};
function $saveCaretPair(point) {
	const next = $caretFromPoint(point, "next");
	return [next, next.getFlipped()];
}
function $restoreCaretPair(point, pair) {
	for (const caret of pair) if (caret.origin.isAttached()) {
		const normalized = $normalizeCaret(caret);
		$setPointFromCaret(point, normalized);
		return;
	}
}
/**
* Extracts block-level children from a LinkNode, splitting
* ancestor nodes as needed to maintain a valid document structure.
* @param link - The LinkNode to normalize
*/
function $linkNodeTransform(link) {
	const selection = $getSelection();
	let anchorPair = null;
	let focusPair = null;
	if ($isRangeSelection(selection)) {
		anchorPair = $saveCaretPair(selection.anchor);
		focusPair = $saveCaretPair(selection.focus);
	}
	function $restoreSelection() {
		if ($isRangeSelection(selection)) {
			$restoreCaretPair(selection.anchor, anchorPair);
			$restoreCaretPair(selection.focus, focusPair);
			$normalizeSelection(selection);
		}
	}
	let transformed = false;
	for (const caret of $getChildCaret(link, "next")) {
		const node = caret.origin;
		if ($isElementNode(node) && !node.isInline()) {
			const blockChildren = node.getChildren();
			if (blockChildren.length > 0) {
				const innerLink = $copyNode(link);
				innerLink.append(...blockChildren);
				node.append(innerLink);
				transformed = true;
			}
			$insertNodeToNearestRootAtCaret(node, $rewindSiblingCaret(caret), { $shouldSplit: () => false });
		}
	}
	function $fixMergeBoundaryCaret(pair, absorbingLink, mergingLink) {
		const [next, prev] = pair;
		const $isAffected = (caret) => $isSiblingCaret(caret) && caret.origin.is(absorbingLink);
		if (!$isAffected(next) && !$isAffected(prev)) return pair;
		const fixed = $normalizeCaret($getChildCaret(mergingLink, "next"));
		return [fixed, fixed.getFlipped()];
	}
	if (link.isAttached()) {
		const prevSibling = link.getPreviousSibling();
		if ($isLinkNode(prevSibling) && prevSibling.shouldMergeAdjacentLink(link)) {
			if (anchorPair) anchorPair = $fixMergeBoundaryCaret(anchorPair, prevSibling, link);
			if (focusPair) focusPair = $fixMergeBoundaryCaret(focusPair, prevSibling, link);
			prevSibling.append(...link.getChildren());
			link.remove();
			$restoreSelection();
			return;
		}
		const nextSibling = link.getNextSibling();
		if ($isLinkNode(nextSibling) && link.shouldMergeAdjacentLink(nextSibling)) {
			if (anchorPair) anchorPair = $fixMergeBoundaryCaret(anchorPair, link, nextSibling);
			if (focusPair) focusPair = $fixMergeBoundaryCaret(focusPair, link, nextSibling);
			link.append(...nextSibling.getChildren());
			nextSibling.remove();
			transformed = true;
		}
	}
	if (!transformed) return;
	if (!link.canBeEmpty() && link.isEmpty()) {
		const parent = link.getParent();
		link.remove();
		if (parent && parent.isEmpty()) parent.remove();
	}
	$restoreSelection();
}
function $convertAnchorElement(domNode) {
	let node = null;
	if (isHTMLAnchorElement(domNode)) {
		const content = domNode.textContent;
		if (content !== null && content !== "" || domNode.children.length > 0) node = $createLinkNode(domNode.getAttribute("href") || "", {
			rel: domNode.getAttribute("rel"),
			target: domNode.getAttribute("target"),
			title: domNode.getAttribute("title")
		});
	}
	return { node };
}
/**
* Takes a URL and creates a LinkNode.
* @param url - The URL the LinkNode should direct to.
* @param attributes - Optional HTML a tag attributes \\{ target, rel, title \\}
* @returns The LinkNode.
*/
function $createLinkNode(url = "", attributes) {
	return $applyNodeReplacement(new LinkNode(url, attributes));
}
/**
* Determines if node is a LinkNode.
* @param node - The node to be checked.
* @returns true if node is a LinkNode, false otherwise.
*/
function $isLinkNode(node) {
	return node instanceof LinkNode;
}
var autoLinkNodeSchema = nodeSchema()({ isUnlinked: withField(booleanValue(), { field: "__isUnlinked" }) });
var AutoLinkNode = class extends LinkNode {
	/** @internal */
	/** Indicates whether the autolink was ever unlinked. **/
	__isUnlinked;
	constructor(url = "", attributes = {}, key) {
		super(url, attributes, key);
		this.__isUnlinked = attributes.isUnlinked !== void 0 && attributes.isUnlinked !== null ? attributes.isUnlinked : false;
	}
	$config() {
		return this.config("autolink", {
			extends: LinkNode,
			generated: GENERATED_AUTOLINK,
			json: autoLinkNodeSchema
		});
	}
	shouldMergeAdjacentLink(_otherLink) {
		return false;
	}
	getIsUnlinked() {
		return this.getLatest().__isUnlinked;
	}
	setIsUnlinked(value) {
		const self = this.getWritable();
		self.__isUnlinked = value;
		return self;
	}
	createDOM(config) {
		if (this.__isUnlinked) return $getDocument().createElement("span");
		else return super.createDOM(config);
	}
	updateDOM(prevNode, anchor, config) {
		return super.updateDOM(prevNode, anchor, config) || prevNode.__isUnlinked !== this.__isUnlinked;
	}
};
/**
* Takes a URL and creates an AutoLinkNode. AutoLinkNodes are generally automatically generated
* during typing, which is especially useful when a button to generate a LinkNode is not practical.
* @param url - The URL the LinkNode should direct to.
* @param attributes - Optional HTML a tag attributes. \\{ target, rel, title \\}
* @returns The LinkNode.
*/
function $createAutoLinkNode(url = "", attributes) {
	return $applyNodeReplacement(new AutoLinkNode(url, attributes));
}
/**
* Determines if node is an AutoLinkNode.
* @param node - The node to be checked.
* @returns true if node is an AutoLinkNode, false otherwise.
*/
function $isAutoLinkNode(node) {
	return node instanceof AutoLinkNode;
}
var TOGGLE_LINK_COMMAND = createCommand("TOGGLE_LINK_COMMAND");
function $getPointNode(point, offset) {
	if (point.type === "element") {
		const node = point.getNode();
		invariant($isElementNode(node), "$getPointNode: element point is not an ElementNode");
		return node.getChildren()[point.offset + offset] || null;
	}
	return null;
}
/**
* Preserve the logical start/end of a RangeSelection in situations where
* the point is an element that may be reparented in the callback.
*
* @param $fn The function to run
* @returns The result of the callback
*/
function $withSelectedNodes($fn) {
	const initialSelection = $getSelection();
	if (!$isRangeSelection(initialSelection)) return $fn();
	const normalized = $normalizeSelection(initialSelection);
	const isBackwards = normalized.isBackward();
	const anchorNode = $getPointNode(normalized.anchor, isBackwards ? -1 : 0);
	const focusNode = $getPointNode(normalized.focus, isBackwards ? 0 : -1);
	const rval = $fn();
	if (anchorNode || focusNode) {
		const updatedSelection = $getSelection();
		if ($isRangeSelection(updatedSelection)) {
			const finalSelection = updatedSelection.clone();
			if (anchorNode) {
				const anchorParent = anchorNode.getParent();
				if (anchorParent) finalSelection.anchor.set(anchorParent.getKey(), anchorNode.getIndexWithinParent() + (isBackwards ? 1 : 0), "element");
			}
			if (focusNode) {
				const focusParent = focusNode.getParent();
				if (focusParent) finalSelection.focus.set(focusParent.getKey(), focusNode.getIndexWithinParent() + (isBackwards ? 0 : 1), "element");
			}
			$setSelection($normalizeSelection(finalSelection));
		}
	}
	return rval;
}
/**
* Splits a LinkNode by removing selected children from it.
* Handles three cases: selection at start, end, or middle of the link.
* @param parentLink - The LinkNode to split
* @param extractedNodes - The nodes that were extracted from the selection
*/
function $splitLinkAtSelection(parentLink, extractedNodes) {
	const extractedKeys = new Set(extractedNodes.filter((n) => parentLink.isParentOf(n)).map((n) => n.getKey()));
	const allChildren = parentLink.getChildren();
	const isExtractedChild = (child) => extractedKeys.has(child.getKey()) || $isElementNode(child) && extractedNodes.some((n) => parentLink.isParentOf(n) && child.isParentOf(n));
	const extractedChildren = allChildren.filter(isExtractedChild);
	if (extractedChildren.length === allChildren.length) {
		allChildren.forEach((child) => parentLink.insertBefore(child));
		parentLink.remove();
		return;
	}
	const firstExtractedIndex = allChildren.findIndex(isExtractedChild);
	const lastExtractedIndex = allChildren.findLastIndex(isExtractedChild);
	const isAtStart = firstExtractedIndex === 0;
	const isAtEnd = lastExtractedIndex === allChildren.length - 1;
	if (isAtStart) extractedChildren.forEach((child) => parentLink.insertBefore(child));
	else if (isAtEnd) for (let i = extractedChildren.length - 1; i >= 0; i--) parentLink.insertAfter(extractedChildren[i]);
	else {
		for (let i = extractedChildren.length - 1; i >= 0; i--) parentLink.insertAfter(extractedChildren[i]);
		const trailingChildren = allChildren.slice(lastExtractedIndex + 1);
		if (trailingChildren.length > 0) {
			const newLink = $copyNode(parentLink);
			extractedChildren[extractedChildren.length - 1].insertAfter(newLink);
			trailingChildren.forEach((child) => newLink.append(child));
		}
	}
}
/**
* Generates or updates a LinkNode. It can also delete a LinkNode if the URL is null,
* but saves any children and brings them up to the parent node.
* @param urlOrAttributes - The URL the link directs to, or an attributes object with an url property
* @param attributes - Optional HTML a tag attributes. \\{ target, rel, title \\}
*/
function $toggleLink(urlOrAttributes, attributes = {}) {
	let url;
	if (urlOrAttributes && typeof urlOrAttributes === "object") {
		const { url: urlProp, ...rest } = urlOrAttributes;
		url = urlProp;
		attributes = {
			...rest,
			...attributes
		};
	} else url = urlOrAttributes;
	const { target, title } = attributes;
	const rel = attributes.rel === void 0 ? "noreferrer" : attributes.rel;
	const selection = $getSelection();
	if (selection === null || !$isRangeSelection(selection) && !$isNodeSelection(selection)) return;
	if ($isNodeSelection(selection)) {
		const nodes = selection.getNodes();
		if (nodes.length === 0) return;
		nodes.forEach((node) => {
			if (url === null) {
				const linkParent = $findMatchingParent(node, (parent) => !$isAutoLinkNode(parent) && $isLinkNode(parent));
				if (linkParent) {
					linkParent.insertBefore(node);
					if (linkParent.getChildren().length === 0) linkParent.remove();
				}
			} else {
				const existingLink = $findMatchingParent(node, (parent) => !$isAutoLinkNode(parent) && $isLinkNode(parent));
				if (existingLink) {
					existingLink.setURL(url);
					if (target !== void 0) existingLink.setTarget(target);
					if (rel !== void 0) existingLink.setRel(rel);
					if (title !== void 0) existingLink.setTitle(title);
				} else {
					const linkNode = $createLinkNode(url, {
						rel,
						target,
						title
					});
					node.insertBefore(linkNode);
					linkNode.append(node);
				}
			}
		});
		return;
	}
	if (selection.isCollapsed() && url === null) for (const node of selection.getNodes()) {
		const parentLink = $findMatchingParent(node, (parent) => !$isAutoLinkNode(parent) && $isLinkNode(parent));
		if (parentLink !== null) {
			parentLink.getParentOrThrow().splice(parentLink.getIndexWithinParent(), 0, parentLink.getChildren());
			parentLink.remove();
		}
		return;
	}
	const nodes = selection.extract();
	if (url === null) {
		const processedLinks = /* @__PURE__ */ new Set();
		nodes.forEach((node) => {
			const parentLink = $findMatchingParent(node, (parent) => !$isAutoLinkNode(parent) && $isLinkNode(parent));
			if (parentLink !== null) {
				const linkKey = parentLink.getKey();
				if (processedLinks.has(linkKey)) return;
				$splitLinkAtSelection(parentLink, nodes);
				processedLinks.add(linkKey);
			}
		});
		return;
	}
	const updatedNodes = /* @__PURE__ */ new Set();
	const updateLinkNode = (linkNode) => {
		if (updatedNodes.has(linkNode.getKey())) return;
		updatedNodes.add(linkNode.getKey());
		linkNode.setURL(url);
		if (target !== void 0) linkNode.setTarget(target);
		if (rel !== void 0) linkNode.setRel(rel);
		if (title !== void 0) linkNode.setTitle(title);
	};
	if (nodes.length === 1) {
		const firstNode = nodes[0];
		const linkNode = $findMatchingParent(firstNode, $isLinkNode);
		if (linkNode !== null) return updateLinkNode(linkNode);
	}
	$withSelectedNodes(() => {
		let linkNode = null;
		for (const node of nodes) {
			if (!node.isAttached()) continue;
			const parentLinkNode = $findMatchingParent(node, $isLinkNode);
			if (parentLinkNode) {
				updateLinkNode(parentLinkNode);
				continue;
			}
			if ($isElementNode(node)) {
				if (!node.isInline()) continue;
				if ($isLinkNode(node)) {
					if (!$isAutoLinkNode(node) && (linkNode === null || !linkNode.getParentOrThrow().isParentOf(node))) {
						updateLinkNode(node);
						linkNode = node;
						continue;
					}
					for (const child of node.getChildren()) node.insertBefore(child);
					node.remove();
					continue;
				}
			}
			const prevLinkNode = node.getPreviousSibling();
			if ($isLinkNode(prevLinkNode) && prevLinkNode.is(linkNode)) {
				prevLinkNode.append(node);
				continue;
			}
			linkNode = $createLinkNode(url, {
				rel,
				target,
				title
			});
			node.insertAfter(linkNode);
			linkNode.append(node);
		}
	});
}
var PHONE_NUMBER_REGEX = /^\+?[0-9\s()-]{5,}$/;
/**
* Formats a URL string by adding appropriate protocol if missing
*
* @param url - URL to format
* @returns Formatted URL with appropriate protocol
*/
function formatUrl(url) {
	if (url.match(/^[a-z][a-z0-9+.-]*:/i)) return url;
	else if (url.match(/^[/#.]/)) return url;
	else if (url.includes("@")) return `mailto:${url}`;
	else if (PHONE_NUMBER_REGEX.test(url)) return `tel:${url}`;
	return `https://${url}`;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+link@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/link/src/AutoLinkAnnounceExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Announces automatic links through the {@link AriaLiveRegionExtension} sink.
*
* Typing a web address turns it into a link on its own, partway through typing
* it, with no keystroke to confirm and nothing inserted. A screen reader says
* nothing, so the user has no way to know a link now exists.
*
* A creation paired with a destruction in the same update is not announced.
* Every keystroke that extends an address rebuilds the link — the old node
* destroyed and a new one created at once — so announcing every creation would
* say "Link" at `www.example.c`, again at `o`, and again at `m`. Only a
* creation on its own is a link that was not there a moment ago.
*/
var AutoLinkAnnounceExtension = defineExtension({
	build: (_editor, config) => namedSignals(config),
	config: safeCast({
		created: "Link",
		createdMany: "%s links",
		destroyed: "Link removed",
		destroyedMany: "%s links removed",
		disabled: false
	}),
	dependencies: [AriaLiveRegionExtension],
	name: "@lexical/link/AutoLinkAnnounce",
	register(editor, _config, state) {
		const { created, createdMany, destroyed, destroyedMany, disabled } = state.getOutput();
		const { announce } = state.getDependency(AriaLiveRegionExtension).output;
		return j(() => disabled.value ? void 0 : editor.registerMutationListener(AutoLinkNode, (nodes) => {
			let createdCount = 0;
			let destroyedCount = 0;
			for (const [, mutation] of nodes) if (mutation === "created") createdCount++;
			else if (mutation === "destroyed") destroyedCount++;
			if (createdCount > 0 && destroyedCount === 0) announce(createdCount === 1 ? created.peek() : createdMany.peek().replace("%s", String(createdCount)));
			else if (destroyedCount > 0 && createdCount === 0) announce(destroyedCount === 1 ? destroyed.peek() : destroyedMany.peek().replace("%s", String(destroyedCount)));
		}, { skipInitialization: true }));
	}
});
/**
* Import rules for {@link LinkNode}.
*
* Registered by {@link LinkExtension} itself (together with
* `CoreImportExtension`), so any editor that uses the link extension can
* import `<a>` through the `DOMImportExtension` pipeline without further
* configuration.
*
* @experimental
*/
var LinkImportRules = [defineImportRule({
	$import: (ctx, el) => {
		if (!el.textContent && el.children.length === 0) return [];
		const href = el.getAttribute("href") || "";
		const attrs = {
			rel: el.getAttribute("rel"),
			target: el.getAttribute("target"),
			title: el.getAttribute("title")
		};
		return $distributeInlineWrapper(ctx.$importChildren(el), () => $createLinkNode(href, attrs));
	},
	match: sel.tag("a"),
	name: "@lexical/link/a"
})];
//#endregion
//#region ../../node_modules/.pnpm/@lexical+link@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/link/src/LexicalLinkExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var defaultProps = {
	attributes: void 0,
	validateUrl: void 0
};
/** @internal */
function registerLink(editor, stores) {
	return mergeRegister(editor.registerNodeTransform(LinkNode, $linkNodeTransform), editor.registerCommand(TOGGLE_LINK_COMMAND, (payload) => {
		const validateUrl = stores.validateUrl.peek();
		const attributes = stores.attributes.peek();
		if (payload === null) {
			$toggleLink(null);
			return true;
		} else if (typeof payload === "string") {
			if (validateUrl === void 0 || validateUrl(payload)) {
				$toggleLink(payload, attributes);
				return true;
			}
			return false;
		} else {
			const { url, ...payloadAttributes } = payload;
			if (validateUrl !== void 0 && !validateUrl(url)) return false;
			$toggleLink(url, {
				...attributes,
				...payloadAttributes
			});
			return true;
		}
	}, 0), j(() => {
		const validateUrl = stores.validateUrl.value;
		if (!validateUrl) return;
		const attributes = stores.attributes.value;
		return editor.registerCommand(PASTE_COMMAND, (event) => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection) || selection.isCollapsed() || !objectKlassEquals(event, ClipboardEvent)) return false;
			if (event.clipboardData === null) return false;
			const clipboardText = event.clipboardData.getData("text");
			if (!validateUrl(clipboardText)) return false;
			if (!selection.getNodes().some((node) => $isElementNode(node) || $isTextNode(node) && !node.isSimpleText())) {
				editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
					...attributes,
					url: clipboardText
				});
				event.preventDefault();
				return true;
			}
			return false;
		}, 1);
	}));
}
/**
* Provides {@link LinkNode}, an implementation of
* {@link TOGGLE_LINK_COMMAND}, and a {@link PASTE_COMMAND}
* listener to wrap selected nodes in a link when a
* URL is pasted and `validateUrl` is defined.
*/
var LinkExtension = defineExtension({
	build(editor, config, state) {
		return namedSignals(config);
	},
	config: defaultProps,
	dependencies: [CoreImportExtension, configExtension(DOMImportExtension, { rules: LinkImportRules })],
	mergeConfig(config, overrides) {
		const merged = shallowMergeConfig(config, overrides);
		if (config.attributes) merged.attributes = shallowMergeConfig(config.attributes, merged.attributes);
		return merged;
	},
	name: "@lexical/link/Link",
	nodes: () => [LinkNode],
	register(editor, config, state) {
		return registerLink(editor, state.getOutput());
	}
});
/**
* Bundles {@link LinkImportRules} together with the runtime
* {@link LinkExtension}.
*
* @experimental
* @deprecated {@link LinkExtension} now registers
* {@link LinkImportRules} (and `CoreImportExtension`) itself — depend on
* it directly instead.
*/
var LinkImportExtension = defineExtension({
	dependencies: [LinkExtension],
	name: "@lexical/link/Import"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+link@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/link/src/ClickableLinkExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function findMatchingDOM(startNode, predicate) {
	let node = startNode;
	while (node != null) {
		if (predicate(node)) return node;
		node = node.parentNode;
	}
	return null;
}
function registerClickableLink(editor, stores, eventOptions = {}) {
	const onClick = (event) => {
		const isMiddle = event.button === 1;
		if (event.type === "auxclick" && !isMiddle) return;
		const target = event.target;
		if (!isDOMNode(target)) return;
		const nearestEditor = getNearestEditorFromDOMNode(target);
		if (nearestEditor === null) return;
		let url = null;
		let urlTarget = null;
		let isUnlinkedAutolink = false;
		nearestEditor.update(() => {
			const clickedNode = $getNearestNodeFromDOMNode(target);
			if (clickedNode !== null) {
				const maybeLinkNode = $findMatchingParent(clickedNode, $isElementNode);
				if (!stores.disabled.peek()) {
					if ($isLinkNode(maybeLinkNode)) {
						isUnlinkedAutolink = $isAutoLinkNode(maybeLinkNode) && maybeLinkNode.getIsUnlinked();
						url = maybeLinkNode.sanitizeUrl(maybeLinkNode.getURL());
						urlTarget = maybeLinkNode.getTarget();
					} else {
						const a = findMatchingDOM(target, isHTMLAnchorElement);
						if (a !== null) {
							url = a.href;
							urlTarget = a.target;
						}
					}
				}
			}
		});
		if (url === null || url === "" || isUnlinkedAutolink) return;
		const selection = editor.read("latest", $getSelection);
		if ($isRangeSelection(selection) && !selection.isCollapsed()) {
			event.preventDefault();
			return;
		}
		window.open(url, stores.newTab.peek() || isMiddle || event.metaKey || event.ctrlKey || urlTarget === "_blank" ? "_blank" : "_self");
		event.preventDefault();
	};
	return editor.registerRootListener((rootElement) => {
		if (rootElement) return registerEventListeners(rootElement, {
			auxclick: onClick,
			click: onClick
		}, eventOptions);
	});
}
/**
* Normally in a Lexical editor the `CLICK_COMMAND` on a LinkNode will cause the
* selection to change instead of opening a link. This extension can be used to
* restore the default behavior, e.g. when the editor is not editable.
*/
var ClickableLinkExtension = defineExtension({
	build(editor, config, state) {
		return namedSignals(config);
	},
	config: safeCast({
		disabled: false,
		newTab: false
	}),
	dependencies: [LinkExtension],
	name: "@lexical/link/ClickableLink",
	register(editor, config, state) {
		return registerClickableLink(editor, state.getOutput());
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+link@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/link/src/LexicalAutoLinkExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Builds a {@link LinkMatcher} from a regular expression. The matched text is
* used as the link URL, optionally rewritten by `urlTransformer` (for example
* to prepend a protocol). Pass the result to the auto-link plugin's `matchers`.
*
* @returns A matcher that reports the first match of `regExp` in the text.
*
* @__NO_SIDE_EFFECTS__
*/
function createLinkMatcherWithRegExp(regExp, urlTransformer = (text) => text) {
	return (text) => {
		const match = regExp.exec(text);
		if (match === null) return null;
		return {
			index: match.index,
			length: match[0].length,
			text: match[0],
			url: urlTransformer(match[0])
		};
	};
}
var URL_REGEX = /((https?:\/\/(www\.)?)|(www\.))[-\p{L}\p{N}@:%._+~#=]{1,256}\.[\p{L}\p{N}]{1,6}(?:[-\p{L}\p{N}()@:%_+.~#?&//=]*[\p{L}\p{N}()@_~#?&//=])?/u;
var EMAIL_REGEX = /(([^<>()[\]\\.,;:\s@"]{1,64}(\.[^<>()[\]\\.,;:\s@"]{1,64}){0,63})|(".{1,255}"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]{1,63}\.){1,127}[a-zA-Z]{2,63}))/;
/**
* A ready-to-use {@link LinkMatcher} for URLs with full Unicode support
* (`\\p{L}`, `\\p{N}`). Handles parenthesis balancing so that Wikipedia-style
* URLs like `https://en.wikipedia.org/wiki/Fish_(disambiguation)` are matched
* correctly even when wrapped in prose parentheses.
*/
var autoLinkUrlMatcher = (text) => {
	const match = URL_REGEX.exec(text);
	if (match === null) return null;
	let matched = match[0];
	let depth = 0;
	for (const ch of matched) if (ch === "(") depth++;
	else if (ch === ")") depth--;
	while (depth < 0 && matched.endsWith(")")) {
		matched = matched.slice(0, -1);
		depth++;
	}
	return {
		index: match.index,
		length: matched.length,
		text: matched,
		url: matched.startsWith("http") ? matched : `https://${matched}`
	};
};
/**
* A ready-to-use {@link LinkMatcher} for email addresses. Bounded quantifiers
* keep matching linear-time; the limits comfortably exceed RFC 5321 maximums.
*/
var autoLinkEmailMatcher = createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => `mailto:${text}`);
function findFirstMatch(text, matchers) {
	for (let i = 0; i < matchers.length; i++) {
		const match = matchers[i](text);
		if (match) return match;
	}
	return null;
}
var PUNCTUATION_OR_SPACE = /[.,;\s]/;
function isSeparator(char, separatorRegex) {
	return separatorRegex.test(char);
}
function endsWithSeparator(textContent, separatorRegex) {
	return isSeparator(textContent[textContent.length - 1], separatorRegex);
}
function startsWithSeparator(textContent, separatorRegex) {
	return isSeparator(textContent[0], separatorRegex);
}
/**
* Check if the text content starts with a fullstop followed by a top-level domain.
* Meaning if the text content can be a beginning of a top level domain.
* @param textContent
* @param isEmail
* @returns boolean
*/
function startsWithTLD(textContent, isEmail) {
	if (isEmail) return /^\.[a-zA-Z]{2,}/.test(textContent);
	else return /^\.[a-zA-Z0-9]{1,}/.test(textContent);
}
function isPreviousNodeValid(node, separatorRegex) {
	let previousNode = node.getPreviousSibling();
	if ($isElementNode(previousNode)) previousNode = previousNode.getLastDescendant();
	return previousNode === null || $isLineBreakNode(previousNode) || $isTextNode(previousNode) && endsWithSeparator(previousNode.getTextContent(), separatorRegex);
}
function isNextNodeValid(node, separatorRegex) {
	let nextNode = node.getNextSibling();
	if ($isElementNode(nextNode)) nextNode = nextNode.getFirstDescendant();
	return nextNode === null || $isLineBreakNode(nextNode) || $isTextNode(nextNode) && startsWithSeparator(nextNode.getTextContent(), separatorRegex);
}
function isContentAroundIsValid(matchStart, matchEnd, separatorRegex, text, nodes) {
	if (!(matchStart > 0 ? isSeparator(text[matchStart - 1], separatorRegex) : isPreviousNodeValid(nodes[0], separatorRegex))) return false;
	return matchEnd < text.length ? isSeparator(text[matchEnd], separatorRegex) : isNextNodeValid(nodes[nodes.length - 1], separatorRegex);
}
function extractMatchingNodes(nodes, startIndex, endIndex) {
	const unmodifiedBeforeNodes = [];
	const matchingNodes = [];
	const unmodifiedAfterNodes = [];
	let matchingOffset = 0;
	let currentOffset = 0;
	const currentNodes = [...nodes];
	while (currentNodes.length > 0) {
		const currentNode = currentNodes[0];
		const currentNodeLength = currentNode.getTextContent().length;
		const currentNodeStart = currentOffset;
		if (currentOffset + currentNodeLength <= startIndex) {
			unmodifiedBeforeNodes.push(currentNode);
			matchingOffset += currentNodeLength;
		} else if (currentNodeStart >= endIndex) unmodifiedAfterNodes.push(currentNode);
		else matchingNodes.push(currentNode);
		currentOffset += currentNodeLength;
		currentNodes.shift();
	}
	return [
		matchingOffset,
		unmodifiedBeforeNodes,
		matchingNodes,
		unmodifiedAfterNodes
	];
}
function $createAutoLinkNode_(nodes, startIndex, endIndex, match) {
	const linkNode = $createAutoLinkNode(match.url, match.attributes);
	if (nodes.length === 1) {
		let remainingTextNode = nodes[0];
		let linkTextNode;
		if (startIndex === 0) [linkTextNode, remainingTextNode] = remainingTextNode.splitText(endIndex);
		else [, linkTextNode, remainingTextNode] = remainingTextNode.splitText(startIndex, endIndex);
		const textNode = $createTextNode(match.text);
		textNode.setFormat(linkTextNode.getFormat());
		textNode.setDetail(linkTextNode.getDetail());
		textNode.setStyle(linkTextNode.getStyle());
		linkNode.append(textNode);
		linkTextNode.replace(linkNode);
		return remainingTextNode;
	} else if (nodes.length > 1) {
		const firstTextNode = nodes[0];
		let offset = firstTextNode.getTextContent().length;
		let firstLinkTextNode;
		if (startIndex === 0) firstLinkTextNode = firstTextNode;
		else [, firstLinkTextNode] = firstTextNode.splitText(startIndex);
		const linkNodes = [];
		let remainingTextNode;
		for (let i = 1; i < nodes.length; i++) {
			const currentNode = nodes[i];
			const currentNodeLength = currentNode.getTextContent().length;
			const currentNodeStart = offset;
			const currentNodeEnd = offset + currentNodeLength;
			if (currentNodeStart < endIndex) {
				if (currentNodeEnd <= endIndex) linkNodes.push(currentNode);
				else {
					const [linkTextNode, endNode] = currentNode.splitText(endIndex - currentNodeStart);
					linkNodes.push(linkTextNode);
					remainingTextNode = endNode;
				}
			}
			offset += currentNodeLength;
		}
		const selection = $getSelection();
		const selectedTextNode = selection ? selection.getNodes().find($isTextNode) : void 0;
		const textNode = $createTextNode(firstLinkTextNode.getTextContent());
		textNode.setFormat(firstLinkTextNode.getFormat());
		textNode.setDetail(firstLinkTextNode.getDetail());
		textNode.setStyle(firstLinkTextNode.getStyle());
		linkNode.append(textNode, ...linkNodes);
		if (selectedTextNode && selectedTextNode === firstLinkTextNode) {
			if ($isRangeSelection(selection)) textNode.select(selection.anchor.offset, selection.focus.offset);
			else if ($isNodeSelection(selection)) textNode.select(0, textNode.getTextContent().length);
		}
		firstLinkTextNode.replace(linkNode);
		return remainingTextNode;
	}
}
function $handleLinkCreation(nodes, matchers, onChange, separatorRegex) {
	for (const node of nodes) {
		const parent = node.getParent();
		if ($isAutoLinkNode(parent) && !parent.getIsUnlinked()) return;
	}
	let currentNodes = [...nodes];
	const initialText = currentNodes.map((node) => node.getTextContent()).join("");
	let text = initialText;
	let match;
	let invalidMatchEnd = 0;
	while ((match = findFirstMatch(text, matchers)) && match !== null) {
		const matchStart = match.index;
		const matchEnd = matchStart + match.length;
		if (isContentAroundIsValid(invalidMatchEnd + matchStart, invalidMatchEnd + matchEnd, separatorRegex, initialText, currentNodes)) {
			const [matchingOffset, , matchingNodes, unmodifiedAfterNodes] = extractMatchingNodes(currentNodes, invalidMatchEnd + matchStart, invalidMatchEnd + matchEnd);
			let alreadyLinked = false;
			for (const node of matchingNodes) {
				const parent = node.getParent();
				if ($isAutoLinkNode(parent) && !parent.getIsUnlinked()) {
					alreadyLinked = true;
					break;
				}
			}
			if (alreadyLinked) {
				invalidMatchEnd += matchEnd;
				text = text.substring(matchEnd);
				continue;
			}
			const remainingTextNode = $createAutoLinkNode_(matchingNodes, invalidMatchEnd + matchStart - matchingOffset, invalidMatchEnd + matchEnd - matchingOffset, match);
			currentNodes = remainingTextNode ? [remainingTextNode, ...unmodifiedAfterNodes] : unmodifiedAfterNodes;
			onChange(match.url, null);
			invalidMatchEnd = 0;
		} else invalidMatchEnd += matchEnd;
		text = text.substring(matchEnd);
	}
}
function handleLinkEdit(linkNode, matchers, onChange, separatorRegex) {
	const children = linkNode.getChildren();
	const childrenLength = children.length;
	for (let i = 0; i < childrenLength; i++) {
		const child = children[i];
		if (!$isTextNode(child) || !child.isSimpleText()) {
			replaceWithChildren(linkNode);
			onChange(null, linkNode.getURL());
			return;
		}
	}
	const text = linkNode.getTextContent();
	const match = findFirstMatch(text, matchers);
	if (match === null || match.text !== text) {
		replaceWithChildren(linkNode);
		onChange(null, linkNode.getURL());
		return;
	}
	if (!isPreviousNodeValid(linkNode, separatorRegex) || !isNextNodeValid(linkNode, separatorRegex)) {
		replaceWithChildren(linkNode);
		onChange(null, linkNode.getURL());
		return;
	}
	const url = linkNode.getURL();
	if (url !== match.url) {
		linkNode.setURL(match.url);
		onChange(match.url, url);
	}
	if (match.attributes) {
		if (linkNode.getRel() !== match.attributes.rel) linkNode.setRel(match.attributes.rel || null);
		if (linkNode.getTarget() !== match.attributes.target) linkNode.setTarget(match.attributes.target || null);
		if (linkNode.getTitle() !== match.attributes.title) linkNode.setTitle(match.attributes.title || null);
	}
}
function handleBadNeighbors(textNode, matchers, onChange, separatorRegex) {
	const parent = textNode.getParent();
	const previousSibling = textNode.getPreviousSibling();
	const nextSibling = textNode.getNextSibling();
	const text = textNode.getTextContent();
	if ($isAutoLinkNode(parent) && !parent.getIsUnlinked()) return;
	if ($isAutoLinkNode(previousSibling) && !previousSibling.getIsUnlinked()) {
		if (previousSibling.is(textNode.getPreviousSibling()) && textNode.getParent() === previousSibling.getParent()) {
			if (!startsWithSeparator(text, separatorRegex)) {
				replaceWithChildren(previousSibling);
				onChange(null, previousSibling.getURL());
				return;
			}
			if (startsWithTLD(text, previousSibling.isEmailURI())) {
				const combinedText = previousSibling.getTextContent() + text;
				const match = findFirstMatch(combinedText, matchers);
				if (match !== null && match.text === combinedText) {
					previousSibling.append(textNode);
					handleLinkEdit(previousSibling, matchers, onChange, separatorRegex);
					onChange(null, previousSibling.getURL());
				}
			}
		}
	}
	if ($isAutoLinkNode(nextSibling) && !nextSibling.getIsUnlinked() && !endsWithSeparator(text, separatorRegex)) {
		if (nextSibling.is(textNode.getNextSibling()) && textNode.getParent() === nextSibling.getParent()) {
			replaceWithChildren(nextSibling);
			onChange(null, nextSibling.getURL());
		}
	}
}
function replaceWithChildren(node) {
	const children = node.getChildren();
	const childrenLength = children.length;
	for (let j = childrenLength - 1; j >= 0; j--) node.insertAfter(children[j]);
	node.remove();
	return children.map((child) => child.getLatest());
}
function getTextNodesToMatch(textNode) {
	const textNodesToMatch = [textNode];
	let nextSibling = textNode.getNextSibling();
	while (nextSibling !== null && $isTextNode(nextSibling) && nextSibling.isSimpleText()) {
		textNodesToMatch.push(nextSibling);
		if (/[\s]/.test(nextSibling.getTextContent())) break;
		nextSibling = nextSibling.getNextSibling();
	}
	return textNodesToMatch;
}
var defaultConfig = {
	changeHandlers: [],
	excludeParents: [],
	matchers: [],
	separatorRegex: PUNCTUATION_OR_SPACE
};
function registerAutoLink(editor, config = defaultConfig) {
	const { matchers, changeHandlers, excludeParents, separatorRegex = PUNCTUATION_OR_SPACE } = config;
	const onChange = (url, prevUrl) => {
		for (const handler of changeHandlers) handler(url, prevUrl);
	};
	return mergeRegister(editor.registerNodeTransform(TextNode, (textNode) => {
		const parent = textNode.getParentOrThrow();
		const previous = textNode.getPreviousSibling();
		if ($isAutoLinkNode(parent)) handleLinkEdit(parent, matchers, onChange, separatorRegex);
		else if (!$isLinkNode(parent) && !excludeParents.some((pred) => pred(parent))) {
			if (textNode.isSimpleText() && (startsWithSeparator(textNode.getTextContent(), separatorRegex) || !$isAutoLinkNode(previous))) $handleLinkCreation(getTextNodesToMatch(textNode), matchers, onChange, separatorRegex);
			handleBadNeighbors(textNode, matchers, onChange, separatorRegex);
		}
	}), editor.registerCommand(TOGGLE_LINK_COMMAND, (payload) => {
		const selection = $getSelection();
		if (payload !== null || !$isRangeSelection(selection)) return false;
		selection.extract().forEach((node) => {
			const parent = node.getParent();
			if ($isAutoLinkNode(parent)) {
				parent.setIsUnlinked(!parent.getIsUnlinked());
				parent.markDirty();
			}
		});
		return false;
	}, 1));
}
/**
* An extension to automatically create AutoLinkNode from text
* that matches the configured matchers. For ready-to-use matchers see
* {@link autoLinkUrlMatcher} (Unicode URL detection with parenthesis
* balancing) and {@link autoLinkEmailMatcher} (email addresses). To build
* a custom matcher from a RegExp, see {@link createLinkMatcherWithRegExp}.
*
* The given `matchers` and `changeHandlers` will be merged by
* concatenating the configured arrays.
*/
var AutoLinkExtension = defineExtension({
	config: defaultConfig,
	dependencies: [AutoLinkAnnounceExtension, LinkExtension],
	mergeConfig(config, overrides) {
		const merged = shallowMergeConfig(config, overrides);
		for (const k of [
			"matchers",
			"changeHandlers",
			"excludeParents"
		]) {
			const v = overrides[k];
			if (Array.isArray(v)) merged[k] = [...config[k], ...v];
		}
		return merged;
	},
	name: "@lexical/link/AutoLink",
	nodes: [AutoLinkNode],
	register: registerAutoLink
});
//#endregion
export { $toggleLink as _, registerAutoLink as a, TOGGLE_LINK_COMMAND as b, LinkExtension as c, LinkImportRules as d, AutoLinkAnnounceExtension as f, $isLinkNode as g, $isAutoLinkNode as h, createLinkMatcherWithRegExp as i, LinkImportExtension as l, $createLinkNode as m, autoLinkEmailMatcher as n, ClickableLinkExtension as o, $createAutoLinkNode as p, autoLinkUrlMatcher as r, registerClickableLink as s, AutoLinkExtension as t, registerLink as u, AutoLinkNode as v, formatUrl as x, LinkNode as y };
