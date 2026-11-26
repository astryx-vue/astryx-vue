//#region ../../node_modules/.pnpm/@lexical+internal@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/internal/src/devInvariant.ts
/**
* If `!cond`, throw in `__DEV__` like an invariant and warn in prod.
*
* A production build rewrites call sites via `transformErrorMessages`
* (throwing dev message in dev, `formatProdWarningMessage` in prod), so this
* body is only reached when consumed as untransformed source. It interpolates
* `%s` placeholders and throws outside production, otherwise warns.
*/
function devInvariant(cond, message = "Internal Lexical error: devInvariant() called without a message", ...args) {
	if (cond) return;
	const formatted = args.reduce((msg, arg) => msg.replace("%s", String(arg)), message);
	console.warn(formatted);
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+internal@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/internal/src/invariant.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function invariant(cond, message = "Internal Lexical error: invariant() called without a message", ...args) {
	if (cond) return;
	throw new Error(args.reduce((msg, arg) => msg.replace("%s", String(arg)), message));
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/environment.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/** @__NO_SIDE_EFFECTS__ */
function canUseDOM() {
	return typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
}
/** Whether a browser DOM environment is available. */
var CAN_USE_DOM = canUseDOM();
/** @__NO_SIDE_EFFECTS__ */
function getDocumentMode() {
	return CAN_USE_DOM && "documentMode" in document ? document.documentMode : null;
}
var documentMode = getDocumentMode();
/** @__NO_SIDE_EFFECTS__ */
function testPlatform(regExp) {
	return CAN_USE_DOM && regExp.test(navigator.platform);
}
/** @__NO_SIDE_EFFECTS__ */
function testUserAgent(regExp) {
	return CAN_USE_DOM && regExp.test(navigator.userAgent);
}
/** Whether the current platform is Apple (macOS, iOS, iPadOS, iPod). */
var IS_APPLE = testPlatform(/Mac|iPod|iPhone|iPad/);
/** Whether the current browser is Firefox (excludes SeaMonkey). */
var IS_FIREFOX = testUserAgent(/^(?!.*Seamonkey)(?=.*Firefox).*/i);
/** @__NO_SIDE_EFFECTS__ */
function canUseBeforeInput() {
	return CAN_USE_DOM && "InputEvent" in window && !documentMode ? "getTargetRanges" in new window.InputEvent("input") : false;
}
/** Whether the browser supports the `beforeinput` event via `InputEvent.getTargetRanges()`. */
var CAN_USE_BEFORE_INPUT = canUseBeforeInput();
/** @__NO_SIDE_EFFECTS__ */
function isIOS() {
	return CAN_USE_DOM && !window.MSStream && (/iPad|iPhone|iPod/.test(navigator.userAgent) || /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}
/** Whether the current platform is iOS or iPadOS (iPhone, iPad, iPod). */
var IS_IOS = isIOS();
/** Whether the current platform is Android. */
var IS_ANDROID = testUserAgent(/Android/);
/** Whether the current browser is Safari (excludes Android WebView which has a similar UA string). */
var IS_SAFARI = testUserAgent(/Version\/[\d.]+.*Safari/) && !IS_ANDROID;
/** Whether the current browser is Chrome (or Chromium-based). */
var IS_CHROME = testUserAgent(/^(?=.*Chrome).*/i);
/** Whether the current browser is Chrome on Android. */
var IS_ANDROID_CHROME = CAN_USE_DOM && IS_ANDROID && IS_CHROME;
/** Whether the current browser is Apple WebKit (Safari on macOS/iOS, excludes Chrome). */
var IS_APPLE_WEBKIT = testUserAgent(/AppleWebKit\/[\d.]+/) && IS_APPLE && !IS_CHROME;
/** Bitmask for bold text formatting. */
var IS_BOLD = 1;
/** Bitmask for italic text formatting. */
var IS_ITALIC = 2;
/** Bitmask for strikethrough text formatting. */
var IS_STRIKETHROUGH = 4;
/** Bitmask for underline text formatting. */
var IS_UNDERLINE = 8;
/** Bitmask for code (monospace) text formatting. */
var IS_CODE = 16;
/** Bitmask for subscript text formatting. */
var IS_SUBSCRIPT = 32;
/** Bitmask for superscript text formatting. */
var IS_SUPERSCRIPT = 64;
/** Bitmask for highlighted text formatting. */
var IS_HIGHLIGHT = 128;
var IS_CAPITALIZE = 1024;
/**
* A function declared side-effect free (so the build annotates the call
* below): a bitwise operation on other bindings is a side effect to bundlers
* until a minifier folds it, so the development build would otherwise keep it.
*
* @__NO_SIDE_EFFECTS__
*/
function allFormatting() {
	return 2047;
}
/** Bitmask combining all text format flags. */
var IS_ALL_FORMATTING = allFormatting();
var COMPOSITION_SUFFIX = IS_SAFARI || IS_IOS || IS_APPLE_WEBKIT ? "\xA0" : "​";
var COMPOSITION_START_CHAR = IS_FIREFOX ? "\xA0" : COMPOSITION_SUFFIX;
var RTL = "֑-߿יִ-﷽ﹰ-ﻼ";
var LTR = "A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿";
/**
* A RegExp matching text whose first strongly directional character is in
* `include`, skipping any run of characters outside `exclude`. A function
* declared side-effect free (so the build annotates the calls below) rather
* than a module-scope `new RegExp`, which is a side effect to bundlers and
* would pin the character tables into every bundle that imports the module.
*
* @__NO_SIDE_EFFECTS__
*/
function createDirectionRegExp(exclude, include) {
	return new RegExp("^[^" + exclude + "]*[" + include + "]");
}
var RTL_REGEX = createDirectionRegExp(LTR, RTL);
var LTR_REGEX = createDirectionRegExp(RTL, LTR);
/** Maps {@link TextFormatType} string names to their bitmask values. */
var TEXT_TYPE_TO_FORMAT = {
	bold: 1,
	capitalize: IS_CAPITALIZE,
	code: 16,
	highlight: 128,
	italic: 2,
	lowercase: 256,
	strikethrough: 4,
	subscript: 32,
	superscript: 64,
	underline: 8,
	uppercase: 512
};
var DETAIL_TYPE_TO_DETAIL = {
	directionless: 1,
	unmergeable: 2
};
var ELEMENT_TYPE_TO_FORMAT = {
	center: 2,
	end: 6,
	justify: 4,
	left: 1,
	right: 3,
	start: 5
};
/**
* Invert a record whose values are unique. A function declared side-effect
* free (so the build annotates the calls below) rather than an object literal
* with computed keys, which is a side effect to bundlers and would pin these
* tables into every bundle that imports the module.
*
* @__NO_SIDE_EFFECTS__
*/
function invertRecord(record) {
	const inverted = {};
	for (const key of Object.keys(record)) inverted[record[key]] = key;
	return inverted;
}
var ELEMENT_FORMAT_TO_TYPE = invertRecord(ELEMENT_TYPE_TO_FORMAT);
var TEXT_MODE_TO_TYPE = {
	normal: 0,
	segmented: 2,
	token: 1
};
var TEXT_TYPE_TO_MODE = invertRecord(TEXT_MODE_TO_TYPE);
/** The property key used to store node state on serialized node JSON. */
var NODE_STATE_KEY = "$";
/**
* @internal
*
* The property key on a {@link KeyboardEventModifierMask} that names the
* Apple-platform counterpart of ctrlKey.
*/
var CONTROL_OR_OTHER_KEY = Symbol.for("@lexical/ctrlOrOtherKey");
var PROTOTYPE_CONFIG_METHOD = "$config";
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalDOMSlot.ts
/**
* The editor has at most one block cursor element
* ({@link LexicalEditor._blockCursorElement}) — a transient, non-lexical
* element the selection layer inserts among an ElementNode's children when a
* collapsed element selection is adjacent to a node that can't host the caret
* (a block decorator, or a non-empty-capable block). Slots must skip it so it
* is never mistaken for managed content. There is only ever one, read from the
* active editor.
*/
function $getActiveBlockCursorElement() {
	return $getEditor()._blockCursorElement;
}
function isSlotContainerDOM(node) {
	return node !== null && node.nodeType === 1 && node.hasAttribute("data-lexical-slot");
}
var IS_WEBKIT_BROWSER = IS_APPLE_WEBKIT || IS_IOS || IS_SAFARI;
/**
* Browsers drop the selection highlight for a range whose endpoint is an
* element-boundary DOM position (`(element, 0)` or
* `(element, childNodes.length)`) sitting immediately next to a block-level
* `contenteditable=false` child. The whole selection goes invisible even though
* the DOM Range is intact, so a select-all in a document that starts or ends
* with a block DecoratorNode looks like it did nothing (#8922). WebKit drops it
* as soon as either endpoint has that shape — its own
* `document.execCommand('selectAll')` hits the same wall — and Chromium drops
* it when both endpoints do. Interior element points next to the same decorator
* paint fine everywhere; only the first / last child matters.
*
* Parking a zero-size, out-of-flow `<img>` on the outside of such a boundary
* decorator gives the browser an editable inline box to canonicalize the
* boundary position against, which restores the highlight — including over the
* decorator itself. `position: absolute` keeps it out of the inline flow so it
* contributes no line box and the element's layout is unchanged (an in-flow
* `<br>` or `<img>`, like the one
* {@link ElementDOMSlot.insertManagedLineBreak} uses for inline decorators,
* would add a stray blank line here).
*/
function $createDecoratorBoundaryAnchor() {
	const img = $getDocument().createElement("img");
	img.setAttribute("data-lexical-decorator-boundary", "true");
	img.alt = "";
	for (const [property, value] of [
		["position", "absolute"],
		["width", "0px"],
		["height", "0px"],
		["border", "0px"],
		["margin", "0px"],
		["padding", "0px"]
	]) img.style.setProperty(property, value, "important");
	return img;
}
function isDecoratorBoundaryAnchorDOM(node) {
	return node !== null && node.nodeType === 1 && node.hasAttribute("data-lexical-decorator-boundary");
}
/**
* Base class for DOM slots — a pointer to the content-bearing element of a
* node's DOM, plus optional `before` / `after` boundaries marking where the
* lexical-managed content sits inside that element.
*
* For ElementNode children management see {@link ElementDOMSlot}. For
* non-Element nodes (TextNode, LineBreakNode, DecoratorNode) the slot still
* supports an internal `before` / `after` so subclasses can prepend or
* append non-lexical siblings around the content node and the reconciler /
* `setTextContent` route the actual content through the slot.
*
* @experimental
*/
var DOMSlot = class DOMSlot {
	/** The content-bearing element of the node's DOM. */
	element;
	/** Upper boundary: the lexical-managed range ends before this node. */
	before;
	/** Lower boundary: the lexical-managed range starts after this node. */
	after;
	constructor(element, before, after) {
		this.element = element;
		this.before = before || null;
		this.after = after || null;
	}
	/** Return a new slot with `before` updated. */
	withBefore(before) {
		return new DOMSlot(this.element, before, this.after);
	}
	/** Return a new slot with `after` updated. */
	withAfter(after) {
		return new DOMSlot(this.element, this.before, after);
	}
	/** Return a new slot with `element` updated. */
	withElement(element) {
		if (this.element === element) return this;
		return new DOMSlot(element, this.before, this.after);
	}
	/**
	* Insert the given node before `this.before` (if defined) or append it to
	* `this.element` otherwise. Subclasses may override to respect additional
	* boundaries (e.g. `ElementDOMSlot` also keeps the managed line break at
	* the end).
	*/
	insertChild(dom) {
		const before = this.getInsertionAnchor();
		invariant(before === null || before.parentElement === this.element, "DOMSlot.insertChild: before is not in element");
		this.element.insertBefore(dom, before);
		return this;
	}
	/**
	* Remove the given child from `this.element`. Throws if it was not a child.
	*/
	removeChild(dom) {
		invariant(dom.parentElement === this.element, "DOMSlot.removeChild: dom is not in element");
		this.element.removeChild(dom);
		return this;
	}
	/**
	* Replace `prevDom` with `dom`. Throws if `prevDom` is not a child.
	*/
	replaceChild(dom, prevDom) {
		invariant(prevDom.parentElement === this.element, "DOMSlot.replaceChild: prevDom is not in element");
		this.element.replaceChild(dom, prevDom);
		return this;
	}
	/**
	* Returns the first managed child (the first node in
	* `this.element` that is not a non-lexical prelude / decoration), or
	* `null` if there is none. Subclasses may override to also skip
	* reconciler-managed scaffolding such as the managed line break.
	*/
	getFirstChild() {
		const anchor = this.getFirstChildAnchor();
		const firstChild = anchor ? anchor.nextSibling : this.element.firstChild;
		return firstChild === this.getInsertionAnchor() ? null : firstChild;
	}
	/**
	* @internal
	*
	* The leading-boundary counterpart to {@link getInsertionAnchor}: the node
	* the lexical-managed range starts immediately after (its `nextSibling` is
	* the first managed child), or `null` when managed children begin at
	* `this.element.firstChild`. The base slot uses `this.after`; subclasses
	* extend it to skip leading non-lexical scaffolding (e.g. the block cursor).
	*/
	getFirstChildAnchor() {
		return this.after;
	}
	/**
	* Map a DOM selection point landing at or inside `leafDOM` (the node's
	* keyed DOM) to whether the caret is positioned BEFORE or AFTER the
	* node in document order. The default implementation derives the
	* boundary from `this.element`'s index inside `leafDOM`:
	*
	* - When `this.element === leafDOM` (no wrap exposed an inner content
	*   element via `withElement`): only a DOM caret directly on
	*   `leafDOM` at offset 0 counts as "before". Matches the historical
	*   decorator rule.
	* - When `this.element !== leafDOM` (wrap pattern that exposed the
	*   inner content element via `withElement`, e.g. a `<br>` inside a
	*   decoration `<span>`): caret positions at or before the content
	*   element are "before", later positions are "after". Handles
	*   nested wraps by walking each side up to its top-level child of
	*   `leafDOM`.
	*
	* Symmetric with {@link ElementDOMSlot.resolveChildIndex}, which
	* performs the analogous mapping for ElementNode children. Together
	* they let the slot abstraction own all DOM-offset to lexical-offset
	* translation.
	*
	* @internal
	*/
	resolveLeafPosition(leafDOM, initialDOM, initialOffset) {
		if (this.element === leafDOM) return initialDOM === leafDOM && initialOffset === 0 ? "before" : "after";
		const innerChild = $topLevelChildOf(leafDOM, this.element);
		if (innerChild === null) return "after";
		const innerIndex = Array.prototype.indexOf.call(leafDOM.childNodes, innerChild);
		if (innerIndex < 0) return "after";
		if (initialDOM === leafDOM) return initialOffset <= innerIndex ? "before" : "after";
		const initialChild = $topLevelChildOf(leafDOM, initialDOM);
		if (initialChild === null) return "after";
		const childIndex = Array.prototype.indexOf.call(leafDOM.childNodes, initialChild);
		return childIndex >= 0 && childIndex <= innerIndex ? "before" : "after";
	}
	/**
	* @internal
	*
	* The node managed children are inserted before, or `null` to append.
	* Subclasses widen this to reserve trailing scaffolding (e.g.
	* {@link ElementDOMSlot} keeps the managed line break last).
	*/
	getInsertionAnchor() {
		return this.before;
	}
};
function $topLevelChildOf(parent, descendant) {
	let node = descendant;
	while (node !== null && node.parentNode !== parent) node = node.parentNode;
	return node;
}
/**
* A utility class for managing the DOM children of an ElementNode.
*
* Extends {@link DOMSlot} with ElementNode-specific scaffolding — the
* reconciler-managed line break that keeps empty elements selectable, and
* the offset / index resolution helpers needed when mapping DOM selections
* onto lexical positions. The base `before` / `after` boundaries and the
* children mutation helpers (`insertChild`, `removeChild`, …) live on
* {@link DOMSlot}.
*/
var ElementDOMSlot = class ElementDOMSlot extends DOMSlot {
	/** Return a new slot with `before` updated, preserving subclass type. */
	withBefore(before) {
		return new ElementDOMSlot(this.element, before, this.after);
	}
	/** Return a new slot with `after` updated, preserving subclass type. */
	withAfter(after) {
		return new ElementDOMSlot(this.element, this.before, after);
	}
	/** Return a new slot with `element` updated, preserving subclass type. */
	withElement(element) {
		if (this.element === element) return this;
		return new ElementDOMSlot(element, this.before, this.after);
	}
	/**
	* @internal
	*/
	getInsertionAnchor() {
		return super.getInsertionAnchor() || this.getManagedLineBreak() || this.getDecoratorBoundaryAnchor("trailing");
	}
	/**
	* @internal
	*
	* Extends the leading boundary to skip the editor's transient block cursor
	* when it sits at the head of the managed range (a collapsed element
	* selection at offset 0), mirroring how {@link getInsertionAnchor} extends
	* the trailing boundary past the managed line break. Only ElementNodes host
	* a block cursor among their children, so the base slot stays editor-free.
	*/
	getFirstChildAnchor() {
		let anchor = super.getFirstChildAnchor();
		let node = anchor ? anchor.nextSibling : this.element.firstChild;
		while (isSlotContainerDOM(node)) {
			anchor = node;
			node = node.nextSibling;
		}
		if (isDecoratorBoundaryAnchorDOM(node)) {
			anchor = node;
			node = node.nextSibling;
		}
		const firstChild = anchor ? anchor.nextSibling : this.element.firstChild;
		return firstChild !== null && firstChild === $getActiveBlockCursorElement() ? firstChild : anchor;
	}
	/**
	* @internal
	*
	* The zero-size selection anchor parked outside a leading / trailing block
	* decorator child, or `null` when this element has none on that edge. Each
	* edge's anchor has a fixed DOM position — leading: the head of the managed
	* range (after the `after` boundary and any slot containers); trailing: the
	* very end of the managed range (just inside the `before` boundary) — so
	* this reads the DOM directly instead of maintaining a cache.
	*/
	getDecoratorBoundaryAnchor(edge) {
		let node;
		if (edge === "leading") {
			const after = super.getFirstChildAnchor();
			node = after ? after.nextSibling : this.element.firstChild;
			while (isSlotContainerDOM(node)) node = node.nextSibling;
		} else {
			node = this.before ? this.before.previousSibling : this.element.lastChild;
			if (node !== null && node === $getActiveBlockCursorElement()) node = node.previousSibling;
		}
		return isDecoratorBoundaryAnchorDOM(node) ? node : null;
	}
	/**
	* @internal
	*
	* Add or remove the selection anchor on one edge of this element. A no-op
	* when the edge is already in the requested state, so the reconciler can call
	* it unconditionally on every dirty non-inline element.
	*/
	setDecoratorBoundaryAnchor(edge, enabled) {
		const existing = this.getDecoratorBoundaryAnchor(edge);
		if (enabled === (existing !== null)) return;
		if (existing !== null) this.element.removeChild(existing);
		else if (edge === "leading") {
			const firstChildAnchor = this.getFirstChildAnchor();
			this.element.insertBefore($createDecoratorBoundaryAnchor(), firstChildAnchor ? firstChildAnchor.nextSibling : this.element.firstChild);
		} else this.element.insertBefore($createDecoratorBoundaryAnchor(), this.before);
	}
	/**
	* @internal
	*/
	getManagedLineBreak() {
		return this.element.__lexicalLineBreak || null;
	}
	/** @internal */
	setManagedLineBreak(lineBreakType) {
		const element = this.element;
		const firstNode = this.after === null ? element.firstChild : this.after.nextSibling;
		const nextLineBreakType = lineBreakType === "empty" && isSlotContainerDOM(firstNode) ? null : lineBreakType;
		if (element.__lexicalLastChildKind === nextLineBreakType) return;
		element.__lexicalLastChildKind = nextLineBreakType;
		if (nextLineBreakType === null) this.removeManagedLineBreak();
		else {
			const webkitHack = nextLineBreakType === "decorator" && IS_WEBKIT_BROWSER;
			this.insertManagedLineBreak(webkitHack);
		}
	}
	/** @internal */
	removeManagedLineBreak() {
		const br = this.getManagedLineBreak();
		if (br) {
			const element = this.element;
			const sibling = br.nodeName === "IMG" ? br.nextSibling : null;
			if (sibling) element.removeChild(sibling);
			element.removeChild(br);
			element.__lexicalLineBreak = void 0;
		}
	}
	/** @internal */
	insertManagedLineBreak(webkitHack) {
		const prevBreak = this.getManagedLineBreak();
		if (prevBreak) {
			if (webkitHack === (prevBreak.nodeName === "IMG")) return;
			this.removeManagedLineBreak();
		}
		const element = this.element;
		const before = this.before || this.getDecoratorBoundaryAnchor("trailing");
		const br = $getDocument().createElement("br");
		br.setAttribute("data-lexical-managed-linebreak", "true");
		element.insertBefore(br, before);
		if (webkitHack) {
			const img = $getDocument().createElement("img");
			img.setAttribute("data-lexical-managed-linebreak", "true");
			img.style.setProperty("display", "inline", "important");
			img.style.setProperty("border", "0px", "important");
			img.style.setProperty("margin", "0px", "important");
			img.alt = "";
			element.insertBefore(img, br);
			element.__lexicalLineBreak = img;
		} else element.__lexicalLineBreak = br;
	}
	/**
	* @internal
	*
	* The DOM child index at which the first managed child appears — i.e. the
	* count of leading non-lexical nodes (the `this.after` region, plus the
	* block cursor when it sits at the head). Walks forward from the start,
	* stopping at the first managed child, or at the trailing boundary
	* (`this.before` / the managed line break via {@link getInsertionAnchor})
	* when there are no managed children.
	*/
	getFirstChildOffset() {
		const firstChild = this.getFirstChild();
		const insertionAnchor = this.getInsertionAnchor();
		let i = 0;
		for (let node = this.element.firstChild; node !== null && node !== firstChild && node !== insertionAnchor; node = node.nextSibling) i++;
		return i;
	}
	/**
	* @internal
	*/
	resolveChildIndex(element, elementDOM, initialDOM, initialOffset) {
		if (initialDOM === this.element) {
			const firstChildOffset = this.getFirstChildOffset();
			const blockCursor = $getActiveBlockCursorElement();
			const childNodes = this.element.childNodes;
			const limit = Math.min(initialOffset, childNodes.length);
			let idx = 0;
			for (let i = firstChildOffset; i < limit; i++) if (childNodes[i] !== blockCursor) idx++;
			return [element, Math.min(idx, element.getChildrenSize())];
		}
		const initialPath = indexPath(elementDOM, initialDOM);
		initialPath.push(initialOffset);
		const elementPath = indexPath(elementDOM, this.element);
		let offset = element.getIndexWithinParent();
		for (let i = 0; i < elementPath.length; i++) {
			const target = initialPath[i];
			const source = elementPath[i];
			if (target === void 0 || target < source) break;
			else if (target > source) {
				offset += 1;
				break;
			}
		}
		return [element.getParentOrThrow(), offset];
	}
};
function indexPath(root, child) {
	const path = [];
	let node = child;
	for (; node !== root && node !== null; node = node.parentNode) {
		let i = 0;
		for (let sibling = node.previousSibling; sibling !== null; sibling = sibling.previousSibling) i++;
		path.push(i);
	}
	invariant(node === root, "indexPath: root is not a parent of child");
	return path.reverse();
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+internal@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/internal/src/version.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* `process.env.LEXICAL_VERSION` is statically replaced with the build-specific
* version string in a Rollup build, and a consumer's bundler `define` can
* inject it the same way — so the exact `process.env.LEXICAL_VERSION` member
* expression must be preserved for that substitution to match. Reading it
* inside a try/catch lets the source be consumed directly (via the `source`
* export condition) in a browser bundle, where `process` is undefined and
* nothing replaced the reference, without throwing a ReferenceError; it falls
* back to the literal below instead. The literal is regenerated by
* `pnpm run update-version`.
*
* The read lives in a function rather than at module scope because a
* module-scope `try` statement is retained by every bundler, and with it
* everything the module exports; a call to a function declared side-effect
* free is annotated by the build and dropped when its result is unused.
*
* @__NO_SIDE_EFFECTS__
*/
function readLexicalVersion() {
	let envLexicalVersion;
	try {
		envLexicalVersion = process.env.LEXICAL_VERSION;
	} catch {}
	return envLexicalVersion ?? "\"<unknown>+source\"";
}
var LEXICAL_VERSION = readLexicalVersion();
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalDequeSet.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var DequeSet = class {
	_front = /* @__PURE__ */ new Set();
	_back = /* @__PURE__ */ new Set();
	_cache;
	get size() {
		return this._front.size + this._back.size;
	}
	addBack(v) {
		delete this._cache;
		if (!this._front.has(v)) this._back.add(v);
		return this;
	}
	addFront(v) {
		delete this._cache;
		if (!this._back.has(v)) this._front.add(v);
		return this;
	}
	delete(v) {
		delete this._cache;
		return this._front.delete(v) || this._back.delete(v);
	}
	toArray() {
		const arr = Array.from(this._front).reverse();
		for (const v of this._back) arr.push(v);
		return arr;
	}
	toReadonlyArray() {
		this._cache = this._cache || this.toArray();
		return this._cache;
	}
	[Symbol.iterator]() {
		return this.toReadonlyArray()[Symbol.iterator]();
	}
};
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalGenMap.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var TOMBSTONE = null;
var GEN_MAP_SIZE_THRESHOLD = 1e3;
/**
* @internal
*
* Create a copy of the given Map, returning either a fresh Map or a clone
* of a copy-on-write GenMap depending on the source type and size.
*
* - If the source is already a GenMap, returns `map.clone()` (O(1)).
* - If the source is a plain Map below the threshold, returns
*   `new Map(map)` to avoid the GenMap overhead on small docs.
* - Otherwise wraps a fresh GenMap around the source.
*/
function cloneMap(map, minGenMapSize = GEN_MAP_SIZE_THRESHOLD) {
	if (map instanceof GenMap) return map.clone();
	if (map.size < minGenMapSize) return new Map(map);
	return new GenMap().init(new Map(map), void 0, map.size);
}
/**
* @internal
*
* A copy-on-write Map suitable for cloning large collections cheaply.
*
* Before being written to, a GenMap shares its `_old` and `_nursery` Maps
* with the GenMap it was cloned from. On first write it either compacts
* (folds `_nursery` into a new `_old`) or shallow-copies `_nursery`,
* isolating subsequent writes from sibling clones.
*
* `_old` is the immutable snapshot from the most recent compaction;
* `_nursery` holds writes since the last compaction (deletions stored as
* `TOMBSTONE`). `_mutable` tracks whether `_nursery` may be written to
* directly or must first be cloned.
*
* Implements the full `Map<K, V>` interface; methods not documented
* individually behave as their native `Map` counterparts.
*/
var GenMap = class GenMap {
	_mutable = false;
	_old = void 0;
	_nursery = void 0;
	_size = 0;
	/**
	* Returns a new GenMap that initially shares `_old` and `_nursery`
	* with this one. Marks both as not-mutable so the next write on either
	* side triggers a copy-on-write of the nursery before mutating.
	*/
	clone() {
		this._mutable = false;
		return new GenMap().init(this._old, this._nursery, this._size);
	}
	init(old, nursery, size) {
		this._old = old;
		this._nursery = nursery;
		this._size = size;
		return this;
	}
	get size() {
		return this._size;
	}
	has(key) {
		return this.get(key) !== void 0;
	}
	/**
	* Returns the raw value for `key`, including TOMBSTONE for keys deleted
	* since the last compaction. Used internally to distinguish "missing"
	* from "deleted" without doing a second lookup.
	*/
	getWithTombstone(key) {
		const v = this._nursery && this._nursery.get(key);
		if (v !== void 0) return v;
		return this._old && this._old.get(key);
	}
	get(key) {
		const v = this.getWithTombstone(key);
		return v === TOMBSTONE ? void 0 : v;
	}
	shouldCompact() {
		return this._nursery !== void 0 && this._nursery.size * 2 > this._size;
	}
	/**
	* Returns the nursery for in-place writes. If this GenMap is currently
	* sharing its nursery with an ancestor clone, this either compacts (if
	* the nursery has grown large enough) or makes a shallow copy.
	*/
	getNursery() {
		if (!this._mutable || !this._nursery) {
			this.compact();
			this._nursery = new Map(this._nursery);
			this._mutable = true;
		}
		return this._nursery;
	}
	/**
	* Fold the nursery into a new `_old` snapshot when it has grown large
	* enough that lookup overhead outweighs the savings from sharing.
	* Triggered automatically from `getNursery` once `_nursery.size * 2 >
	* _size`; can be forced via `compact(true)`.
	*/
	compact(force = false) {
		if (this._nursery && this._nursery.size > 0 && (force || this.shouldCompact())) {
			const compact = new Map(this._old);
			for (const [k, v] of this._nursery) if (v !== TOMBSTONE) compact.set(k, v);
			else compact.delete(k);
			this._old = compact;
			this._nursery = void 0;
		}
		this._mutable = false;
		return this;
	}
	set(key, value) {
		const v = this.getWithTombstone(key);
		if (v === value) return this;
		const nursery = this.getNursery();
		if (v === TOMBSTONE || v === void 0) {
			this._size++;
			if (v === TOMBSTONE) nursery.delete(key);
		}
		nursery.set(key, value);
		return this;
	}
	delete(key) {
		const deleted = this.has(key);
		if (deleted) {
			this.getNursery().set(key, TOMBSTONE);
			this._size--;
		}
		return deleted;
	}
	getOrInsert(key, defaultValue) {
		const existing = this.get(key);
		if (existing !== void 0) return existing;
		this.set(key, defaultValue);
		return defaultValue;
	}
	getOrInsertComputed(key, computer) {
		const existing = this.get(key);
		if (existing !== void 0) return existing;
		const value = computer(key);
		this.set(key, value);
		return value;
	}
	clear() {
		this._mutable = false;
		this._old = void 0;
		this._nursery = void 0;
		this._size = 0;
	}
	*keys() {
		for (const pair of this.entries()) yield pair[0];
	}
	*values() {
		for (const pair of this.entries()) yield pair[1];
	}
	*entries() {
		const nursery = this._nursery;
		const old = this._old;
		if (!nursery) {
			if (old) yield* old;
			return;
		}
		if (old) for (const pair of old) {
			const k = pair[0];
			const v = nursery.get(k);
			if (v === TOMBSTONE) continue;
			else if (v !== void 0) pair[1] = v;
			yield pair;
		}
		for (const pair of nursery) if (pair[1] !== TOMBSTONE && !(old && old.has(pair[0]))) yield pair;
	}
	forEach(callbackfn, thisArg) {
		if (thisArg !== void 0) callbackfn = callbackfn.bind(thisArg);
		for (const [k, v] of this.entries()) callbackfn(v, k, this);
	}
	get [Symbol.toStringTag]() {
		return "GenMap";
	}
	[Symbol.iterator]() {
		return this.entries();
	}
};
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalSerializedExport.ts
/**
* Whether the export in progress is writing the compact form. A module-scope
* flag rather than something threaded through every walk, because the walks it
* governs — the `@lexical/clipboard` selection export, a walk of your own —
* have no argument to take it in, and it deliberately spans editors so a
* nested one (an image caption) writes the same form as the document that
* contains it.
*
* `EditorState.toJSON` is not one of those: it takes the form as an argument
* and states it here for the duration, and a call that states nothing writes
* the legacy form rather than reading this, so that its return type is true.
*/
var compactExport = false;
/**
* Run `f` writing the compact form of the document (or, with `false`, the
* legacy form), for any export it performs: the `@lexical/clipboard` selection
* export, a serialization walk of your own, and the nested editors those
* serialize. A whole document states its form at the call site instead —
* `editorState.toJSON(true)` — which is what lets its return type say which
* shape it is; this is for the walks that have no such argument to take.
*
* The compact form omits every property parsing would restore anyway — one
* whose value is its schema default, one the parser derives rather than reads,
* and the deprecated `version` — so the two forms describe the same document.
* It can only be read by a Lexical new enough to restore them, so keep writing
* the legacy form until every reader is upgraded.
*
* `f` must be synchronous. The form is restored as soon as it returns, so an
* `async` callback would give up the form at its first `await` and export in
* whatever form is ambient when it resumes. A callback whose return type is a
* promise is rejected at the call site by the trailing parameter, which is an
* empty tuple for every other type; the runtime check behind it is for an
* untyped caller, and runs in every build, because the failure it catches is a
* document written in the wrong form rather than a degraded experience.
*
* @example
* ```ts
* const selectionJSON = $withCompactExport(true, () =>
*   $generateJSONFromSelectedNodes(editor, $getSelection()),
* );
* ```
*
* @experimental
*/
function $withCompactExport(compact, f, ...reject) {
	const previous = compactExport;
	let result;
	try {
		compactExport = compact;
		result = f();
	} finally {
		compactExport = previous;
	}
	invariant(!isThenable(result), "$withCompactExport: f returned a thenable. The export form is restored synchronously, so an async callback gives it up at its first await; export inside a synchronous callback instead.");
	return result;
}
/**
* Whether the export walk in progress is writing the compact form.
*
* For the one thing that cannot be told: a schema getter. The walk calls
* `get<Prop>()` with no arguments — that contract is what lets `getTextContent`
* and `getURL` be ordinary node methods rather than serialization-specific
* ones — so a getter whose value depends on the form has to read it here:
*
* ```ts
* getSerializedThumbnail(): string | undefined {
*   // Derivable from `src`, so the compact form leaves it out.
*   return $isCompactExport() ? undefined : this.getLatest().__thumbnail;
* }
* ```
*
* A getter that serializes a *nested editor* needs nothing either, as long as
* it goes through `editor.toJSON()`: that passes the form reported here on to
* the nested `EditorState.toJSON`, which is what keeps an image caption in the
* same form as the document containing it. A getter that reaches past it to
* `editorState.toJSON()` gets the legacy form, and has to pass
* `$isCompactExport()` itself to follow the document.
*
* This reports the form of the surrounding **export walk** — what
* {@link $withCompactExport} established, and so what
* `editorState.toJSON(compact)` and the `@lexical/clipboard` selection export
* establish. It is deliberately *not* set by an individual
* {@link LexicalNode.exportJSON} call: that method takes its own `compact`
* argument and is called by the walk with the walk's form already in effect,
* so having it set this too would say a document is compact when only one node
* was asked to be. A bare `node.exportJSON(true)` outside a walk therefore
* reports `false` here.
*
* Anything with a call site of its own should take the form as an argument
* rather than read it here.
*
* @experimental
*/
function $isCompactExport() {
	return compactExport;
}
function isThenable(value) {
	return value !== null && (typeof value === "object" || typeof value === "function") && typeof value.then === "function";
}
/**
* Export one node's JSON in the form the active export asks for, with the
* sanity checks every export walk relies on: the serialized `type` must match
* the class, and an element must carry a `children` array for the walk to fill.
*
* Use this instead of calling `node.exportJSON()` directly when writing a
* serialization walk of your own — it is what `editorState.toJSON()` and the
* `@lexical/clipboard` selection export both call, so {@link $withCompactExport}
* governs every one of them alike.
*
* Which form that is decides the shape, so the return type is the
* {@link SerializedPartial} — the one both forms satisfy. A caller that knows
* it is not under {@link $withCompactExport} and wants the full type should
* call `node.exportJSON()` directly.
*
* @experimental
*/
function $exportNodeJSON(node) {
	const serializedNode = node.exportJSON(compactExport);
	const nodeClass = node.constructor;
	if (serializedNode.type !== nodeClass.getType()) invariant(false, "LexicalNode: Node %s does not match the serialized type. Check if .exportJSON() is implemented and it is returning the correct type.", nodeClass.name);
	if ($isElementNode(node) && !Array.isArray(serializedNode.children)) invariant(false, "LexicalNode: Node %s is an element but .exportJSON() does not have a children array.", nodeClass.name);
	return serializedNode;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+internal@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/internal/src/createDevError.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function createDevError(message) {
	return new Error(message);
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+internal@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/internal/src/createError.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Construct an error without throwing it. Like invariant, the message must be
* a literal with %s placeholders so builds can replace it with an error code.
* The source implementation also works without the build transform.
*/
function createError(message, ...args) {
	let index = 0;
	return createDevError(args.length === 0 ? message : message.replace(/%s/g, () => String(args[index++])));
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalGC.ts
function $garbageCollectDetachedDecorators(editor, pendingEditorState) {
	const currentDecorators = editor._decorators;
	let decorators = editor._pendingDecorators || currentDecorators;
	const nodeMap = pendingEditorState._nodeMap;
	let key;
	for (key in decorators) if (!nodeMap.has(key)) {
		if (decorators === currentDecorators) decorators = cloneDecorators(editor);
		delete decorators[key];
	}
}
function $garbageCollectDetachedDeepChildNodes(node, parentKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyNodes) {
	if ($isElementNode(node)) {
		let child = node.getFirstChild();
		while (child !== null) {
			const childKey = child.__key;
			if (child.__parent === parentKey) {
				if ($isElementNode(child) || $isSlotHost(child) && child.__slots !== null) $garbageCollectDetachedDeepChildNodes(child, childKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyNodes);
				if (!prevNodeMap.has(childKey)) dirtyNodes.delete(childKey);
				nodeMapDelete.push(childKey);
			}
			child = child.getNextSibling();
		}
	}
	for (const slotKey of $isSlotHost(node) && node.__slots !== null ? node.__slots.values() : []) {
		const slotNode = nodeMap.get(slotKey);
		if (slotNode !== void 0 && $isSlotChild(slotNode) && slotNode.__slotHost === parentKey) {
			if ($isElementNode(slotNode) || $isSlotHost(slotNode) && slotNode.__slots !== null) $garbageCollectDetachedDeepChildNodes(slotNode, slotKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyNodes);
			if (!prevNodeMap.has(slotKey)) dirtyNodes.delete(slotKey);
			nodeMapDelete.push(slotKey);
		}
	}
}
function $garbageCollectDetachedNodes(prevEditorState, editorState, dirtyLeaves, dirtyElements) {
	const prevNodeMap = prevEditorState._nodeMap;
	const nodeMap = editorState._nodeMap;
	const nodeMapDelete = [];
	for (const [nodeKey] of dirtyElements) {
		const node = nodeMap.get(nodeKey);
		if (node !== void 0) {
			if (!node.isAttached()) {
				if ($isElementNode(node)) $garbageCollectDetachedDeepChildNodes(node, nodeKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyElements);
				if (!prevNodeMap.has(nodeKey)) dirtyElements.delete(nodeKey);
				nodeMapDelete.push(nodeKey);
			}
		}
	}
	for (const nodeKey of dirtyLeaves) {
		const node = nodeMap.get(nodeKey);
		if (node !== void 0 && !node.isAttached()) {
			if ($isSlotHost(node) && node.__slots !== null) $garbageCollectDetachedDeepChildNodes(node, nodeKey, prevNodeMap, nodeMap, nodeMapDelete, dirtyLeaves);
			if (!prevNodeMap.has(nodeKey)) dirtyLeaves.delete(nodeKey);
			nodeMapDelete.push(nodeKey);
		}
	}
	const editor = getActiveEditor();
	const cloneNotNeeded = editor._cloneNotNeeded;
	for (const nodeKey of nodeMapDelete) {
		nodeMap.delete(nodeKey);
		cloneNotNeeded.delete(nodeKey);
	}
	const compositionKey = editor._compositionKey;
	if (compositionKey !== null && !nodeMap.has(compositionKey)) editor._compositionKey = null;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalMutations.ts
var TEXT_MUTATION_VARIANCE = 100;
var isProcessingMutations = false;
var lastTextEntryTimeStamp = 0;
function getIsProcessingMutations() {
	return isProcessingMutations;
}
function updateTimeStamp(event) {
	lastTextEntryTimeStamp = event.timeStamp;
}
function initTextEntryListener(editor) {
	if (lastTextEntryTimeStamp === 0) getWindow(editor).addEventListener("textInput", updateTimeStamp, true);
}
function isEditorManagedLineBreak(dom, target, editor) {
	const isBR = dom.nodeName === "BR";
	const lexicalLineBreak = target.__lexicalLineBreak;
	return lexicalLineBreak && (dom === lexicalLineBreak || isBR && dom.previousSibling === lexicalLineBreak) || isBR && getNodeKeyFromDOMNode(dom, editor) !== void 0;
}
function getLastSelection(editor) {
	return editor.read("latest", () => {
		const selection = $getSelection();
		return selection !== null ? selection.clone() : null;
	});
}
function $handleTextMutation(target, node, editor) {
	const domSelection = getDOMSelection(getWindow(editor));
	const domSelectionPoints = domSelection && getDOMSelectionPoints(domSelection, editor._rootElement);
	let anchorOffset = null;
	let focusOffset = null;
	if (domSelectionPoints !== null && domSelectionPoints.anchorNode === target) {
		anchorOffset = domSelectionPoints.anchorOffset;
		focusOffset = domSelectionPoints.focusOffset;
	}
	const text = target.nodeValue;
	if (text !== null) $updateTextNodeFromDOMContent(node, text, anchorOffset, focusOffset, false);
}
function shouldUpdateTextNodeFromMutation(selection, targetDOM, targetNode) {
	if ($isRangeSelection(selection)) {
		const anchorNode = selection.anchor.getNode();
		if (anchorNode.is(targetNode) && selection.format !== anchorNode.getFormat()) return false;
	}
	return isDOMTextNode(targetDOM) && targetNode.isAttached();
}
function $getNearestManagedNodePairFromDOMNode(startingDOM, editor, editorState) {
	for (let dom = startingDOM; dom && !isDOMUnmanaged(dom); dom = getParentElement(dom)) {
		const key = getNodeKeyFromDOMNode(dom, editor);
		if (key !== void 0) {
			const node = $getNodeByKey(key, editorState);
			if (node) return $isDecoratorNode(node) || !isHTMLElement(dom) ? void 0 : [dom, node];
		}
	}
}
function flushMutations(editor, mutations, observer) {
	isProcessingMutations = true;
	const shouldFlushTextMutations = performance.now() - lastTextEntryTimeStamp > TEXT_MUTATION_VARIANCE;
	try {
		updateEditorSync(editor, () => {
			const selection = $getSelection() || getLastSelection(editor);
			const badDOMTargets = /* @__PURE__ */ new Map();
			const currentEditorState = editor._editorState;
			const blockCursorElement = editor._blockCursorElement;
			let shouldRevertSelection = false;
			let possibleTextForFirefoxPaste = "";
			for (let i = 0; i < mutations.length; i++) {
				const mutation = mutations[i];
				const type = mutation.type;
				const targetDOM = mutation.target;
				const pair = $getNearestManagedNodePairFromDOMNode(targetDOM, editor, currentEditorState);
				if (!pair) continue;
				const [nodeDOM, targetNode] = pair;
				if (type === "characterData") {
					if (shouldFlushTextMutations && $isTextNode(targetNode) && isDOMTextNode(targetDOM) && shouldUpdateTextNodeFromMutation(selection, targetDOM, targetNode)) $handleTextMutation(targetDOM, targetNode, editor);
				} else if (type === "childList") {
					shouldRevertSelection = true;
					const addedDOMs = mutation.addedNodes;
					for (let s = 0; s < addedDOMs.length; s++) {
						const addedDOM = addedDOMs[s];
						const node = $getNodeFromDOMNode(addedDOM);
						const parentDOM = addedDOM.parentNode;
						if (parentDOM != null && addedDOM !== blockCursorElement && node === null && !isEditorManagedLineBreak(addedDOM, parentDOM, editor) && !isDecoratorBoundaryAnchorDOM(addedDOM) && !(editor._slotsUsed && isHTMLElement(addedDOM) && addedDOM.hasAttribute("data-lexical-slot")) && !isDOMUnmanaged(addedDOM)) {
							if (IS_FIREFOX) {
								const possibleText = (isHTMLElement(addedDOM) ? addedDOM.innerText : null) || addedDOM.nodeValue;
								if (possibleText) possibleTextForFirefoxPaste += possibleText;
							}
							parentDOM.removeChild(addedDOM);
						}
					}
					const removedDOMs = mutation.removedNodes;
					const removedDOMsLength = removedDOMs.length;
					if (removedDOMsLength > 0) {
						let unremovedBRs = 0;
						for (let s = 0; s < removedDOMsLength; s++) {
							const removedDOM = removedDOMs[s];
							if (isEditorManagedLineBreak(removedDOM, targetDOM, editor) || blockCursorElement === removedDOM) {
								targetDOM.appendChild(removedDOM);
								unremovedBRs++;
							} else if (isDecoratorBoundaryAnchorDOM(removedDOM)) unremovedBRs++;
						}
						if (removedDOMsLength !== unremovedBRs) badDOMTargets.set(nodeDOM, targetNode);
					}
				}
			}
			if (badDOMTargets.size > 0) for (const [nodeDOM, targetNode] of badDOMTargets) targetNode.reconcileObservedMutation(nodeDOM, editor);
			const records = observer.takeRecords();
			if (records.length > 0) {
				for (let i = 0; i < records.length; i++) {
					const record = records[i];
					const addedNodes = record.addedNodes;
					const target = record.target;
					for (let s = 0; s < addedNodes.length; s++) {
						const addedDOM = addedNodes[s];
						const parentDOM = addedDOM.parentNode;
						if (parentDOM != null && addedDOM.nodeName === "BR" && !isEditorManagedLineBreak(addedDOM, target, editor)) parentDOM.removeChild(addedDOM);
					}
				}
				observer.takeRecords();
			}
			if (selection !== null) {
				if (shouldRevertSelection) $setSelection(selection);
				if (IS_FIREFOX && isFirefoxClipboardEvents(editor)) selection.insertRawText(possibleTextForFirefoxPaste);
			}
		});
	} finally {
		isProcessingMutations = false;
	}
}
function flushRootMutations(editor) {
	const observer = editor._observer;
	if (observer !== null) flushMutations(editor, observer.takeRecords(), observer);
}
function initMutationObserver(editor) {
	initTextEntryListener(editor);
	editor._observer = new MutationObserver((mutations, observer) => {
		flushMutations(editor, mutations, observer);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalSchema.ts
/**
* Whether two values of `schema`'s domain say the same thing: identity, unless
* the schema declares otherwise. The identity test comes first so a primitive
* domain — every schema but {@link arrayValue} and {@link objectValue} — costs
* a comparison rather than a call.
*
* @internal
*/
function isSchemaEqual(schema, a, b) {
	const { isEqual } = schema;
	return a === b || isEqual !== void 0 && isEqual(a, b);
}
/**
* Whether `value` is the one `schema` would restore for an absent property, so
* writing it says nothing.
*
* @internal
*/
function isSchemaDefault(schema, value) {
	return isSchemaEqual(schema, value, schema.defaultValue);
}
/**
* Whether an accessor names a node field rather than a method.
*
* Generic in the field type so it narrows to the direction it was handed:
* given a {@link SchemaGetterAccessor} it yields a {@link SchemaGetterField},
* whose `getterTable` is then the only table in scope.
*/
function isSchemaField(accessor) {
	return typeof accessor === "object" && accessor !== null;
}
/**
* The `getterTable` table the property `key` exports through, from the schema it
* was declared with. For generated code, which was compiled against a schema
* that declared one; a schema without it is not the one the code was
* generated from.
*
* A null-prototype copy, taken once when the code is attached: generated
* code reaches a table with `in`, which walks the prototype, and the key it
* reaches it with comes from the JSON on import and from the node's field on
* export — so on a plain object `'toString'` would resolve to
* Object.prototype's method and be stored or serialized as the property's
* value. The walk reads the schema's own object through `hasOwnKey`, which
* asks the same question of the same entries.
*
* @internal
*/
function getterTableOf(fields, key) {
	const getter = schemaOf(fields, key).getter;
	invariant(isSchemaField(getter) && getter.getterTable !== void 0, "getterTableOf: \"%s\" declares no getterTable", key);
	return nullPrototype(getter.getterTable);
}
/**
* The `setterTable` table the property `key` imports through; see
* {@link getterTableOf}.
*
* @internal
*/
function setterTableOf(fields, key) {
	const setter = schemaOf(fields, key).setter;
	invariant(isSchemaField(setter) && setter.setterTable !== void 0, "setterTableOf: \"%s\" declares no setterTable", key);
	return nullPrototype(setter.setterTable);
}
/**
* The `index`th alias table in the property `key`'s schema, counting from the
* outermost. Generated code numbers the tables in the order the compiler met
* them, so this has to descend exactly the schemas the compiler descends, in
* the same order: `aliasedValue` (which is also the one that has a table),
* `nullable`, `optional` and `arrayValue` — each of which wraps a single inner
* schema, so the walk is a chain. Every other kind is one the compiler refuses,
* which means it emitted no code for this property and nothing calls this.
* Descending one the compiler does not would find a table it never numbered and
* hand back the wrong one, so anything else ends the walk. See
* {@link getterTableOf}.
*
* @internal
*/
function aliasTableOf(fields, key, index) {
	let { meta } = schemaOf(fields, key);
	for (let seen = 0;;) if (meta.kind === "aliased") {
		if (seen === index) return nullPrototype(meta.aliases);
		seen++;
		meta = meta.inner.meta;
	} else if (meta.kind === "nullable" || meta.kind === "optional") meta = meta.inner.meta;
	else if (meta.kind === "array") meta = meta.item.meta;
	else invariant(false, "aliasTableOf: \"%s\" declares no alias table %s", key, String(index));
}
/**
* The stored form of the property `key`'s schema default: what its `setterTable`
* table maps the default to, which is what the walk stores for a parsed value
* the table does not map. Generated code falls back to it the same way — and
* a miss is possible, since coverage is proved only for an enum's domain and
* sampled for a bounded numeric one — so it reads the value here, off the
* schema when the code is attached, rather than carrying it as a literal. A
* table without the entry is refused when the class is registered.
*
* @internal
*/
function setterDefaultOf(fields, key) {
	const schema = schemaOf(fields, key);
	const { setter } = schema;
	invariant(isSchemaField(setter) && setter.setterTable !== void 0, "setterDefaultOf: \"%s\" declares no setterTable", key);
	const stored = String(schema.defaultValue);
	invariant(hasOwnKey(setter.setterTable, stored), "setterDefaultOf: \"%s\" has no setterTable entry for its default %s", key, stored);
	return setter.setterTable[stored];
}
function nullPrototype(table) {
	return Object.assign(Object.create(null), table);
}
function schemaOf(fields, key) {
	const schema = fields.get(key);
	invariant(schema !== void 0, "the composed schema declares no property \"%s\"", key);
	return schema;
}
function makeSchema(parse, meta, defaultValue, isEqual, accepts) {
	if (accepts !== void 0) DERIVED_ACCEPTS.add(accepts);
	const derived = defaultValue === void 0;
	const resolved = derived ? parse(void 0) : defaultValue;
	if (derived) deepFreeze(resolved);
	return Object.assign(parse, {
		accepts,
		defaultValue: resolved,
		isEqual,
		meta
	});
}
/**
* Every predicate a combinator installed on a schema it built.
*
* `$fitOf` answers each kind from its metadata, and a combinator's own
* predicate is derived from that same metadata — `arrayValue`'s is
* `Array.isArray`, `objectValue`'s is the undeclared-key test, and every
* wrapper's and `unionValue`'s recurses into the very schemas the case is
* about to walk. So asking one is at best a second call that decides nothing
* and at worst a second full traversal of the subtree: measured over directly
* nested unions, asking them took a leaf from 4/8/12/16 checks at depths
* 4/8/12/16 to 14/44/90/152.
*
* What `$fitOf` does need to honor is a predicate the schema's *author*
* installed, which is a statement about a domain no metadata describes. This
* set is how the two are told apart. `withAccessors` copies `accepts` by
* reference, so a `withField` wrapper of a built-in stays recognized as one.
*/
var DERIVED_ACCEPTS = /* @__PURE__ */ new WeakSet();
/**
* The predicate `schema`'s author installed, or `undefined` where it has none
* or carries only the one its combinator derived — see {@link DERIVED_ACCEPTS}.
*
* Exported for the two consumers that read a schema's *metadata* to stand in
* for the schema — `@lexical/fast-check`'s arbitraries and the JSON code
* generator — because a schema with one of these describes a domain no
* metadata records, so neither may answer for it from the metadata alone.
*
* @internal
*/
function declaredAccepts(schema) {
	const { accepts } = schema;
	return accepts === void 0 || DERIVED_ACCEPTS.has(accepts) ? void 0 : accepts;
}
/**
* Freeze a derived default and everything reachable from it. Freezing only the
* outer value would leave an array or object *nested* in an {@link objectValue}
* default writable, and a nested value is shared by every node that has none of
* its own exactly as the outer one is — so it is the same hazard one level
* down. Already-frozen values are skipped, which also terminates a cycle.
*/
/**
* Values a caller handed the schema, which a derived default may contain and
* which this must not freeze.
*
* A `transformValue`'s default is whatever its `transform` returned, possibly a
* module constant the caller also uses elsewhere — which is why `transformValue`
* passes its default explicitly rather than letting `makeSchema` derive and
* freeze one. That is not enough on its own: an `objectValue` *containing* such
* a field derives its own default, which holds that same object, and the
* recursion below reached it.
*
* Every combinator that takes a default from its caller is in the same
* position, which is the whole of the rule: `unionValue(members, shared)` and
* `enumValue(members)` hand back a value the caller still holds, and an
* enclosing schema deriving its own default reached straight through it and
* froze the caller's object.
*/
var CALLER_OWNED = /* @__PURE__ */ new WeakSet();
/** Records a value as the caller's, and returns it. See {@link CALLER_OWNED}. */
function markCallerOwned(value) {
	if (value !== null && typeof value === "object") CALLER_OWNED.add(value);
	return value;
}
function deepFreeze(value) {
	if (value === null || typeof value !== "object" || Object.isFrozen(value) || CALLER_OWNED.has(value)) return;
	Object.freeze(value);
	for (const inner of Object.values(value)) deepFreeze(inner);
}
/**
* `source` is untrusted parsed JSON, whose prototype is `Object.prototype`: a
* plain `key in source` (or `source[key]`) would report an inherited member —
* `toString`, `constructor` — as a present value and hand it to a node setter.
*
* A type predicate rather than a `boolean`, so a caller reads the value off the
* narrowed `source` instead of casting an unindexable `object`.
*/
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
/**
* Carry `inner`'s equality onto a wrapper that adds a nil to its domain: the
* two describe the same property, and identity already answers the nil cases.
*/
function liftIsEqual(inner) {
	const { isEqual } = inner;
	return isEqual === void 0 ? void 0 : (a, b) => a == null || b == null ? a === b : isEqual(a, b);
}
/**
* Carry `inner`'s domain membership onto a wrapper that adds a nil to its
* domain.
*
* Declared unconditionally, and asked of `inner` *before* the wrapper
* normalizes: membership is a question about the input, and a wrapper answers
* it by delegating, so the fact that `inner` has no explicit `accepts` of its
* own is not a reason for the wrapper to have none either.
*
* Leaving it undefined in that case left a union inferring the wrapper's
* membership from what it *parsed to*, which for a wrapper is exactly where
* the inference breaks down: `nullable(stringValue(), {defaultAsNull: true})`
* reads `''` as `null`, its own default, so the inference reads a recognized
* value as a fallback and declines it —
* `unionValue([that, enumValue(['auto'])], 'auto')` answered `'auto'` for `''`
* instead of `null`. Asking `inner` first is the whole fix; `$schemaMatch` is
* the same inference the union would have run, applied one level down where it
* is sound.
*
* `isNil` is the wrapper's own nil test, not `== null` for both: `nullable`
* maps `null` *and* `undefined` to null, while `optional` maps only
* `undefined` and hands `null` to `inner`. Claiming to accept a value the
* wrapper then delegates is what makes wrapping change a union's answer —
* `unionValue([optional(numberValue()), enumValue(['inherit'])], 'inherit')`
* would commit to the optional member for `null` and return `inner`'s
* fallback `0`, where the unwrapped member correctly declines it.
*/
function liftAccepts(inner, isNil) {
	return (value) => isNil(value) || $acceptsValue(inner, value);
}
/**
* Whether `schema` recognizes `value` — its declared `accepts` when it has one,
* and otherwise the parse-inference {@link $schemaMatch} applies.
*
* The membership half of `$schemaMatch` without the parsed value, for a caller
* that is deciding rather than parsing.
*
* A declared `accepts` is asked directly rather than through `$schemaMatch`,
* which parses in order to return the parsed value alongside its answer. Every
* caller here throws that away, and `objectValue`'s own `accepts` asks this of
* each declared field — so routing through it made deciding cost a parse, and
* a parse of a nested object asked again for every field beneath it. Ten
* levels of `unionValue`/`objectValue` reached 59,049 parses of the leaf, 3 per
* level compounding, where the value is read once.
*/
function $acceptsValue(schema, value) {
	const { accepts } = schema;
	return accepts !== void 0 ? accepts.call(schema, value) : $schemaMatch(schema, value) !== void 0;
}
/**
* Memoized because the answer is a property of the schema alone, and `$fitOf`
* now asks it while *measuring* a union rather than only when one is choosing:
* without this, a value node under N nested unions walks the schema below it
* once per level, which is work that grows with the nesting for a question
* whose answer was fixed when the schema was built.
*/
var CATCH_ALL_CACHE = /* @__PURE__ */ new WeakMap();
/**
* Whether `schema` describes nothing — a `rawValue`, or a wrapper or union that
* bottoms out at one.
*
* A raw schema admits every value, so it is *neutral* wherever it is one part
* of a larger shape: a `rawValue()` field cannot make its object a worse fit,
* and treating it as a mismatch took the whole object out of the union. But
* where it is the *whole* answer — a union member — it is a catch-all, and
* letting it claim a complete match hands a caller unvalidated input under a
* declared type, ahead of the member that describes the value.
*
* So the two places that must pass over a catch-all ask this rather than
* reading `meta.kind` themselves: `optional(rawValue())` and
* `unionValue([arrayValue(numberValue()), rawValue()])` are catch-alls too, and
* checking the outer kind alone let both win the specific pass.
*
* It does *not* look inside an array's items or an object's fields: a container
* that happens to carry a raw property still describes everything else about
* the value, which is exactly the case the neutrality above exists for.
*/
function $isCatchAll(schema) {
	const cached = CATCH_ALL_CACHE.get(schema);
	if (cached !== void 0) return cached;
	const result = $computeIsCatchAll(schema);
	CATCH_ALL_CACHE.set(schema, result);
	return result;
}
function $computeIsCatchAll(schema) {
	const meta = schema.meta;
	if (meta == null) return false;
	if (declaredAccepts(schema) !== void 0) return false;
	switch (meta.kind) {
		case "raw": return true;
		case "union": return meta.members != null && meta.members.length > 0 && meta.members.every((member) => $isCatchAll(member));
		case "nullable":
		case "optional":
		case "transform":
		case "aliased": return meta.inner != null && $isCatchAll(meta.inner);
		default: return false;
	}
}
/**
* How well a schema fits a value, in one traversal.
*
* `1` fits entirely. `2` fits entirely but only because a catch-all covers
* some part of it. `3` is accepted but would be coerced. `4` is not accepted.
* Lower wins, and ties go to declaration order.
*
* One number rather than a pair of predicates, because asking twice is what
* kept going wrong. Measuring a union used to run its selection and then
* re-measure the member it picked, which doubled the traversal at every level
* of nesting — a leaf under sixteen nested unions was visited 65,535 times.
* And a boolean "does it fit entirely" could not say *how*, so a union that fit
* only through its `rawValue()` outranked a sibling that owned every element:
* `unionValue([unionValue([numberValue(), rawValue()]), arrayValue(
* numberValue())])` read `['42']` as `['42']` rather than `[42]`.
*
* Carrying "via a catch-all" as its own rank answers both. It is computed once
* per schema node per value node, and nothing recomputes it.
*/
var FIT_WHOLE = 1;
var FIT_VIA_CATCH_ALL = 2;
var FIT_COERCIBLE = 3;
var FIT_NONE = 4;
function $fitOf(schema, value) {
	const meta = schema.meta;
	if (meta == null) return $acceptsValue(schema, value) ? FIT_WHOLE : FIT_NONE;
	const declared = declaredAccepts(schema);
	const narrowed = declared !== void 0;
	if (narrowed && !declared.call(schema, value)) return FIT_NONE;
	const fit = $metaFitOf(schema, meta, value, narrowed);
	return narrowed && fit === FIT_NONE ? FIT_COERCIBLE : fit;
}
/**
* How well a schema's *metadata* fits a value — the part of {@link $fitOf}
* that reads only what the combinator recorded.
*
* `narrowed` says whether the schema's author declared a predicate, which
* {@link $fitOf} has already asked. It matters to one case: a `rawValue()`
* describes nothing and so can only ever be a catch-all, but one narrowed by a
* predicate describes what that predicate admits, and fits the way any other
* schema that recognizes a value does.
*/
function $metaFitOf(schema, meta, value, narrowed) {
	switch (meta.kind) {
		case "raw": return narrowed ? FIT_WHOLE : FIT_VIA_CATCH_ALL;
		case "array": {
			if (!Array.isArray(value)) return FIT_NONE;
			if (meta.item == null) return FIT_WHOLE;
			let worst = FIT_WHOLE;
			for (let i = 0; i < value.length; i++) if (value[i] !== void 0) {
				const itemFit = $fitOf(meta.item, value[i]);
				if (itemFit > worst) worst = itemFit;
			}
			return worst >= FIT_COERCIBLE ? FIT_COERCIBLE : worst;
		}
		case "object": {
			const fields = meta.fields;
			if (!isPlainObject(value)) return FIT_NONE;
			if (fields == null) return FIT_WHOLE;
			if (!narrowed && hasUndeclaredKey(value, fields)) return FIT_NONE;
			let worst = FIT_WHOLE;
			for (const key of Object.keys(value)) if (hasOwnKey(fields, key)) {
				const fieldFit = $fitOf(fields[key], value[key]);
				if (fieldFit > worst) worst = fieldFit;
			}
			return worst >= FIT_COERCIBLE ? FIT_COERCIBLE : worst;
		}
		case "union": return meta.members == null ? FIT_WHOLE : $bestUnionMember(meta.members, value).fit;
		case "aliased":
		case "nullable":
		case "optional":
		case "transform": return (meta.kind === "aliased" ? typeof value === "string" && meta.aliases != null && hasOwnKey(meta.aliases, value) : meta.kind === "nullable" ? value == null : meta.kind === "optional" && value === void 0) || meta.inner == null ? FIT_WHOLE : $fitOf(meta.inner, value);
		default: return narrowed || $acceptsValue(schema, value) ? FIT_WHOLE : FIT_NONE;
	}
}
/**
* The member a union would parse `value` with and how well that member fits.
*
* One procedure, called both to choose a member and to answer how well the
* union fits, so the two cannot disagree: the rank a union reports is the rank
* of the member it will hand the value to. Splitting them is what let a union
* advertise a fit it would never deliver — see the `union` case of `$fitOf`.
*
* A member that *is* a catch-all is *ranked* no better than coercible: it
* describes nothing, so letting it win on the strength of admitting everything
* would put it ahead of the member that describes the data and hand back
* unvalidated input under a declared type. The demotion applies to a union's
* own members, which is why `$fitOf` reaches it only through here — a
* `rawValue()` *field* stays neutral inside its object, as `$isCatchAll`
* describes.
*
* Ranking and reporting are not the same number. The demotion decides *which*
* member wins; what the union then reports is that member's own fit, because
* that is what the union is about to do with the value. A member reached
* through a demotion still fits the way it fits: `union[stringValue(),
* rawValue()]` given `[]` really does hand it to the raw and write it back
* unchanged, which is a whole fit earned through a catch-all — reporting the
* demoted 3 there made an enclosing object under-report and its sibling coerce
* the field away. Reporting the *undemoted best* is the opposite error:
* `union[arrayValue(numberValue()), rawValue()]` given `['red', '42']` ranks
* the array and the raw alike and takes the array by declaration order, so
* answering with the raw's 2 advertises a fit the union will not deliver.
*
* Each member is measured exactly once.
*/
function $bestUnionMember(members, value) {
	let member;
	let bestRank = FIT_NONE;
	let bestFit = FIT_NONE;
	for (let i = 0; i < members.length; i++) {
		const candidate = members[i];
		const fit = $fitOf(candidate, value);
		const rank = fit < FIT_COERCIBLE && $isCatchAll(candidate) ? FIT_COERCIBLE : fit;
		if (rank < bestRank) {
			member = candidate;
			bestRank = rank;
			bestFit = fit;
			if (rank === FIT_WHOLE) break;
		}
	}
	return {
		fit: bestFit,
		member
	};
}
/**
* The member a union would parse `value` with, or `undefined` if none would.
*/
function $selectUnionMember(members, value) {
	return $bestUnionMember(members, value).member;
}
/**
* Whether `source` carries `key` as its own property.
*
* A type predicate rather than a `boolean`, so a caller can read the value off
* the narrowed `source` instead of casting an unindexable `object`.
*
* `Object.prototype.hasOwnProperty.call` rather than `Object.hasOwn`, which is
* newer than the browser baseline these packages are linted against. Lives here
* rather than in LexicalUtils because this module imports nothing from the rest
* of the core, so it is the one the other direction can reach.
*
* @internal
*/
function hasOwnKey(source, key) {
	return Object.prototype.hasOwnProperty.call(source, key);
}
/**
* {@link isRecord} narrowed to what an {@link objectValue} describes. An array
* is an object too, and comparing one field-wise against an object default
* would report `[]` and `{}` as the same value.
*/
function isPlainRecord(value) {
	return isRecord(value) && !Array.isArray(value);
}
/**
* {@link isPlainRecord}, and carrying no prototype but `Object.prototype` — so
* its own keys are the whole of it.
*
* A `Map`, a `Set` or a class instance is an object with no own keys at all, so
* a comparison that reads own keys reports any two of them as equal. That is
* the direction that loses data, and JSON.parse produces nothing but plain
* objects, so the values a schema really parses to are unaffected.
*/
function isPlainObject(value) {
	if (!isPlainRecord(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
/** Whether `source` carries an own key that `fields` does not describe. */
function hasUndeclaredKey(source, fields) {
	for (const key of Object.keys(source)) if (!hasOwnKey(fields, key)) return true;
	return false;
}
/**
* Build a {@link SerializationSchema} that returns `value` when it is a `string`, otherwise
* returns `defaultValue` (the empty string by default).
* @__NO_SIDE_EFFECTS__
*/
function stringValue(defaultValue = "") {
	return makeSchema((value) => typeof value === "string" ? value : defaultValue, { kind: "string" }, void 0, void 0, (value) => typeof value === "string");
}
/**
* The JSON number grammar, anchored, for reading a stringified number back as
* the number it spells. `Number()` alone is far more permissive than JSON:
* it reads `'0x10'` as 16, `'0b11'` as 3, `'Infinity'` as `Infinity`, `''` and
* `'  '` as 0, and ignores surrounding whitespace. None of those are shapes a
* JSON encoder produces, so none of them are evidence of a number that was
* stringified — they are out-of-domain input, and fall back to the default.
*/
var JSON_NUMBER$1 = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
/**
* Build a {@link SerializationSchema} that returns `value` when it is a finite `number`,
* otherwise returns `defaultValue` (`0` by default). `NaN`, `Infinity`, and
* `-Infinity` are all treated as out of domain since they can not be
* round-tripped through JSON.
*
* A string spelled as a JSON number is accepted and converted, so a document
* that stored `"120"` where Lexical writes `120` — a hand-authored fixture, a
* converter, or a backend that stringified its numbers — keeps its value
* instead of silently falling back to the default. The domain is still
* numbers: that is what the schema reports and what parsing returns, a string
* is only an input encoding of it. Only the JSON grammar is read, so notations
* that JSON itself can not produce (`"0x10"`, `"1_000"`, `"+1"`, `"Infinity"`)
* stay out of domain.
*
* @__NO_SIDE_EFFECTS__
*/
function numberValue(defaultValue = 0, options = {}) {
	const { integer, clamp } = options;
	const min = integer && options.min !== void 0 ? Math.ceil(options.min) : options.min;
	const max = integer && options.max !== void 0 ? Math.floor(options.max) : options.max;
	const coerce = (value) => typeof value === "string" && JSON_NUMBER$1.test(value) ? Number(value) : value;
	const isNumeric = (parsed) => typeof parsed === "number" && Number.isFinite(parsed) && (!integer || Number.isInteger(parsed));
	const inDomain = (parsed) => isNumeric(parsed) && (min === void 0 || parsed >= min) && (max === void 0 || parsed <= max);
	return makeSchema((value) => {
		const parsed = coerce(value);
		if (clamp && isNumeric(parsed)) return min !== void 0 && parsed < min ? min : max !== void 0 && parsed > max ? max : parsed;
		return inDomain(parsed) ? parsed : defaultValue;
	}, {
		clamp,
		integer,
		kind: "number",
		max,
		min
	}, void 0, void 0, (value) => clamp ? isNumeric(coerce(value)) : inDomain(coerce(value)));
}
/**
* Build a {@link SerializationSchema} that returns `value` when it is a `boolean`, otherwise
* returns `defaultValue` (`false` by default).
* @__NO_SIDE_EFFECTS__
*/
function booleanValue(defaultValue = false) {
	return makeSchema((value) => typeof value === "boolean" ? value : defaultValue, { kind: "boolean" }, void 0, void 0, (value) => typeof value === "boolean");
}
/**
* Build a {@link SerializationSchema} for a fixed set of allowed `values` (an
* enumeration or a union of literals such as the `mode` of a TextNode). Returns
* `value` when it is strictly equal to one of `values`, otherwise returns
* `defaultValue`, which defaults to the first entry of `values`.
*
* The type parameter is `const`, so the literal types of `values` are inferred
* directly — the caller does not need an `as const` assertion. (Pass an
* explicit type argument, e.g. `enumValue<TextModeType>([...])`, to instead
* assert the values against a known domain type.)
*
* `undefined` may be a member of the domain, and a declared `undefined`
* default is taken as declared: `enumValue([undefined, 'middle', 'bottom'])`
* and `enumValue(['middle', undefined], undefined)` both default to
* `undefined`.
*
* `values` must be non-empty, which the type states as a tuple: an empty
* domain admits nothing, so every value — including one the caller believes is
* in the enum — would parse to a default that came from nowhere. A list built
* at runtime is checked as well in a development build, since a type can be
* asserted past.
*
* @example
* ```ts
* const parseMode = enumValue(['normal', 'token', 'segmented']);
* //    ^? SerializationSchema<'normal' | 'token' | 'segmented'>, default 'normal'
* ```
* @__NO_SIDE_EFFECTS__
*/
function enumValue(values, ...args) {
	const defaultValue = markCallerOwned(args.length !== 0 ? args[0] : values[0]);
	const allowed = new Set(values);
	return makeSchema((value) => value !== void 0 && allowed.has(value) ? value : defaultValue, {
		kind: "enum",
		values
	}, defaultValue, void 0, (value) => allowed.has(value) && (value !== void 0 || defaultValue === void 0));
}
/**
* Combinator that makes any {@link SerializationSchema} nullable. The returned schema yields
* `null` when the value is `null` or `undefined` (so `null` is its recoverable
* default) and otherwise delegates to `inner`. This guarantees a `T | null`
* result for an untrusted value, unlike `value || null`, which can pass a
* non-`T` (or falsy) value straight through with the wrong type.
*
* Pass `{defaultAsNull: true}` when an in-band value equal to `inner`'s
* default also means "no value" — the historical `serializedNode.rel || null`
* idiom, where an empty string is not a real `rel`. Equality is `inner`'s own
* (see {@link SerializationSchema.isEqual}), so a reference-typed default is
* compared by content: `nullable(arrayValue(...), {defaultAsNull: true})`
* reads an explicitly empty array as `null`.
*
* @example
* ```ts
* const parseRel = nullable(stringValue(), {defaultAsNull: true});
* //    ^? SerializationSchema<string | null>
* parseRel('noopener'); // 'noopener'
* parseRel('');         // null ('' is stringValue's default)
* parseRel(null);       // null
* parseRel(undefined);  // null (the recoverable default)
* ```
* @__NO_SIDE_EFFECTS__
*/
function nullable(inner, options = {}) {
	const { defaultAsNull } = options;
	return makeSchema((value) => {
		if (value == null) return null;
		const parsed = inner(value);
		return defaultAsNull && isSchemaDefault(inner, parsed) ? null : parsed;
	}, {
		defaultAsNull,
		inner,
		kind: "nullable"
	}, void 0, liftIsEqual(inner), liftAccepts(inner, (value) => value == null));
}
/**
* Combinator that makes any {@link SerializationSchema} optional. The returned schema yields
* `undefined` when the value is `undefined` (so `undefined` is its recoverable
* default) and otherwise delegates to `inner`. Use it for serialized properties
* that may be absent and, when absent, should stay absent (an exported `T |
* undefined` property is omitted from the JSON rather than persisted).
*
* Pass `{omitDefault: true}` when an in-band value equal to `inner`'s default
* means "absent" rather than "explicitly this value" — the historical
* `serializedNode.width || undefined` idiom, where a falsy `0` is not a real
* width. Such a value (and any out-of-domain input, which `inner` coerces to
* its default) yields `undefined`, so it is omitted from the exported JSON
* instead of being persisted as the default. Equality is `inner`'s own (see
* {@link SerializationSchema.isEqual}), so a reference-typed default is
* compared by content: `optional(arrayValue(...), {omitDefault: true})` omits
* an explicitly empty array rather than persisting it.
*
* @example
* ```ts
* const parseWidth = optional(numberValue());
* //    ^? SerializationSchema<number | undefined>
* parseWidth(120);       // 120
* parseWidth(undefined); // undefined (the recoverable default)
*
* const parseCellWidth = optional(numberValue(), {omitDefault: true});
* parseCellWidth(0);     // undefined (0 is not a real width)
* parseCellWidth('x');   // undefined (coerced to the default, then omitted)
* ```
* @__NO_SIDE_EFFECTS__
*/
function optional(inner, options = {}) {
	const { omitDefault } = options;
	return makeSchema((value) => {
		if (value === void 0) return;
		const parsed = inner(value);
		return omitDefault && isSchemaDefault(inner, parsed) ? void 0 : parsed;
	}, {
		inner,
		kind: "optional",
		omitDefault
	}, void 0, liftIsEqual(inner), liftAccepts(inner, (value) => value === void 0));
}
/**
* Whether one schema recognizes `value`, and what it parsed to.
*
* The membership rule, stated once: a schema that knows its own domain answers
* directly, and one that does not has its answer inferred from what it parsed.
* Landing on the schema's default is the one ambiguous result — it means either
* "this value *is* the default" or "this value was out of domain and I fell
* back" — and comparing the *input* against the default separates the two for a
* schema whose domain is a single value type. Every other result is proof the
* schema recognized the value, including one it normalized, which is why the
* parsed value is what comes back.
*
* Shared by {@link unionValue}, which asks it per member, and
* {@link aliasedValue}, which needs it to answer for its inner schema: an alias
* whose target *is* the inner default is exactly the case the inference cannot
* see, so an aliased schema has to declare `accepts` rather than be inferred.
*
* @internal
*/
function $schemaMatch(schema, value) {
	const { accepts } = schema;
	if (accepts !== void 0) return $acceptsValue(schema, value) ? { parsed: schema(value) } : void 0;
	const parsed = schema(value);
	return !isSchemaDefault(schema, parsed) || value === schema.defaultValue ? { parsed } : void 0;
}
/**
* Structural equality over the values a schema parses to.
*
* What a union compares with, in place of deferring to a member's own
* comparator. Deferring needs to know which member *produced* a value, and a
* union cannot: it selects a member by what each one accepts, and
* `transformValue` is where accepting and producing part company — its input
* domain is the inner schema's and its output is whatever the transform
* returns. Every proxy for "this member produced that value" is a guess, and a
* wrong guess runs a comparator on a value it was not written for: an id
* comparator handed `['red']` and `['blue']` reads two `undefined` ids and
* calls them equal, and equal is the answer that drops an update.
*
* Comparing content instead gives up nothing that was derivable. `arrayValue`
* and `objectValue` build exactly this comparison — element-wise and
* field-wise — so a union that would have deferred to one gets the same
* answer. The only comparator this does not reproduce is a custom
* `transformValue` one, which is precisely the one whose domain is unknowable;
* against that, content equality is stricter, and stricter is the safe
* direction. It reports two values a custom comparator would call equal as
* different, which costs a property its compaction or marks a node dirty —
* never the reverse, which loses data.
*
* Anything that is not a plain array or object compares by identity, since a
* value with its own prototype carries state these keys do not describe.
*/
function $sameContent(a, b) {
	if (a === b) return true;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) if (!$sameContent(a[i], b[i])) return false;
		return true;
	}
	if (!isPlainObject(a) || !isPlainObject(b)) return false;
	const keys = Object.keys(a);
	return keys.length === Object.keys(b).length && keys.every((key) => hasOwnKey(b, key) && $sameContent(a[key], b[key]));
}
/**
* Combinator for a value whose domain is the union of several schemas, such as
* a dimension that is either a number or the literal `'inherit'`. The domain
* is inferred as the union of the members' value types; annotate the result
* when you want to assert a narrower intended domain instead.
*
* A {@link SerializationSchema} is total — it always returns a value, falling
* back to its own default rather than reporting a rejection — so a member is
* considered to accept `value` when parsing it lands anywhere *other* than that
* member's default, or when the value is itself that default (the one case a
* total schema cannot distinguish from a fallback).
*
* Selection is in two passes. The first asks every member whether it accepts
* the value *entirely* — every element of an array, every declared field of an
* object — and the first such member wins. Only if none does are the members
* asked again for a partial match, where the first accepting one wins and the
* union yields what it parsed. So a member that normalizes its input
* ({@link numberValue} reading a stringified number) composes here the same way
* it behaves alone, and a value that belongs entirely to a later member is not
* taken by an earlier one that would only partly coerce it — declaration order
* decides between members that fit equally well, not between a complete fit and
* a partial one. If no member accepts at all, the result is `defaultValue` when
* given, otherwise the first member's default.
*
* The inference above is only the fallback. A member that declares its own
* domain — which every combinator here does — is asked directly, and that is
* the only way to recognize a value it normalizes
* *into* its own default (`numberValue()` reading `'0'`). A member whose
* `defaultValue` lies outside its own constrained domain
* (`numberValue(0, {min: 1})`) is therefore declined for that value rather
* than accepting it, and the union falls through to the next member.
*
* The result is itself a member of the union in both respects: it declares an
* `accepts` that asks each member in turn, so a union nested in another union
* (or reached through a wrapper) keeps its domain, and an `isEqual`, so a union
* over a reference-typed member still compares by content.
*
* That equality is a structural comparison, not a member's own: a union picks a
* member by what each *accepts*, and {@link transformValue} accepts one domain
* and produces another, so which member produced a value is not something a
* union can recover. {@link arrayValue} and {@link objectValue} compare
* element-wise and field-wise, which is what this does, so a union over either
* is unaffected. A **custom `isEqual` passed to `transformValue` is not
* consulted through a union** — two values it would call equal are reported as
* different, so a property holding one is written out instead of compacted
* away, `optional({omitDefault})` around the union keeps it instead of
* dropping it, and as a `createState` parse its `NodeState.toJSON()` writes the
* value rather than omitting it, `$getStateChange` reports a change, and an
* updater-form `$setState` performs the write. (A plain-value `$setState`
* compares nothing either way.) Never the reverse, which would discard the
* difference. Outside a union the comparator is used as declared.
*
* @example
* ```ts
* const parseDimension = unionValue([numberValue(), enumValue(['inherit'])], 'inherit');
* //    ^? SerializationSchema<number | 'inherit'>
* parseDimension(640);       // 640
* parseDimension('640');     // 640 (numberValue reads a stringified number)
* parseDimension('inherit'); // 'inherit'
* parseDimension('banana');  // 'inherit' (no member accepts it)
* ```
* @__NO_SIDE_EFFECTS__
*/
function unionValue(members, ...args) {
	const fallback = args.length !== 0 ? markCallerOwned(args[0]) : members[0].defaultValue;
	/**
	* The member that recognizes `value`, and what it parsed to. The membership
	* rule itself is `$schemaMatch`'s, which the `accepts` below applies through
	* `$acceptsValue` without the parse: the two cannot answer differently
	* because they ask the same question of the same members in the same order.
	*/
	const $match = (value) => {
		const member = $selectUnionMember(members, value);
		return member === void 0 ? void 0 : {
			member,
			parsed: member(value)
		};
	};
	return makeSchema((value) => {
		if (value === void 0) return fallback;
		const matched = $match(value);
		return matched === void 0 ? fallback : matched.parsed;
	}, {
		kind: "union",
		members
	}, fallback, $sameContent, (value) => (value !== void 0 || fallback === void 0) && members.some((member) => $acceptsValue(member, value)));
}
/**
* A node's serialization schema, checked against the node it is for.
*
* The same shape {@link objectValue} takes, with one type argument naming the
* node — which is what lets every `field`, accessor `method` and `when`
* predicate be verified to exist. A name the node does not have is a compile
* error at the property that declares it, with the correction suggested:
*
* ```ts
* const codeNodeSchema = nodeSchema<CodeNode>()({
*   language: withField(optional(nullable(stringValue())), {
*     field: '__langauge',
*   }),
* });
* //          ~~~~~~~~~~~~
* // Type '"field:__langauge"' is not assignable to type '... | TaggedNamesOf<CodeNode> | ObligationsOf<CodeNode>'.
* //   Did you mean '"field:__language"'?
* ```
*
* Where the schema is written does not change what is checked: a module-scope
* `const` above the class — a class's *type* is in scope before its
* definition, and this is what every built-in node does — or inline in
* `$config()`, as `TabNode` spells it. Checking a declaration means resolving
* the class's members, and an unannotated `$config()` has a return type
* inferred from this very schema; the members whose types come from it are
* skipped (`ScannableKeys`), and what a setter returns is compared against
* the brand every node carries rather than all of `LexicalNode`
* (`SetterReturn`), so that neither position asks the check for its own
* answer.
*
* The result reports no outstanding names, which is what `$config`'s `json`
* requires — so a schema that names anything has to come through here, and the
* check cannot be skipped by declaring the properties some other way.
*
* @__NO_SIDE_EFFECTS__
*/
function nodeSchema() {
	return (fields) => nodeSchemaOf(fields);
}
/**
* {@link nodeSchema}'s body, once: the object schema, recorded as a node's,
* with a field that is itself a node schema refused — the walk resolves
* accessors on a node's own fields only, so a nested node schema's would be
* declared and never used. Its fields may name accessors, which is the one
* thing that sets it apart from {@link objectValue}.
* @__NO_SIDE_EFFECTS__
*/
function nodeSchemaOf(fields) {
	checkFieldNames("nodeSchema", fields);
	return { meta: {
		fields,
		kind: "node"
	} };
}
/**
* Combinator for a value that older documents may spell as one of a fixed set
* of names — TextNode's `format: 'bold'` for the numeric bit it stands for.
* A string matching one of `aliases` yields the value it names; anything else
* is `inner`'s to validate, so the domain, the default and the equality all
* stay `inner`'s and only the accepted *input* is wider.
*
* This is {@link transformValue} narrowed to the case where the normalization
* is a lookup, and the reason to prefer it is that the lookup is data: it goes
* into the schema's {@link SerializationSchemaMeta | meta}, where a tool can
* see it. A `transformValue` keeps its function to itself, so its meta can say
* only that a transform happens: example generation still reaches the inner
* domain, and a code generator refuses the property rather than compile a
* parse that stores the alias where the schema stores what it names.
*
* @example
* ```ts
* const parseFormat = aliasedValue(numberValue(), TEXT_TYPE_TO_FORMAT);
* //    ^? SerializationSchema<number>
* parseFormat(1);      // 1
* parseFormat('bold'); // IS_BOLD
* parseFormat('42');   // 42 (not an alias, so numberValue reads it)
* parseFormat('junk'); // 0  (numberValue falls back to its default)
* ```
* @__NO_SIDE_EFFECTS__
*/
function aliasedValue(inner, aliases) {
	const isAlias = (value) => typeof value === "string" && hasOwnKey(aliases, value);
	return makeSchema((value) => isAlias(value) ? aliases[value] : inner(value), {
		aliases,
		inner,
		kind: "aliased"
	}, inner.defaultValue, inner.isEqual, (value) => isAlias(value) || $acceptsValue(inner, value));
}
/**
* Combinator that normalizes the value another {@link SerializationSchema} parsed, for
* serialized properties whose accepted domain is wider than the stored one —
* the motivating case is a legacy shorthand that older documents carry
* (`format: 'bold'`) being folded into the stored numeric form. `inner` still
* owns the domain: it validates the untrusted input (falling back to its
* default as usual), and `transform` then maps every value it can produce
* into the target domain, so the node's setter only ever sees normalized
* values.
*
* `transform` must be pure and total over `inner`'s outputs: it runs once
* when the schema is built to derive the {@link SerializationSchema.defaultValue}
* (the transform of `inner`'s default) and once per parsed value. The
* {@link SerializationSchemaMeta | meta} is a `transform` kind holding
* `inner`, so introspection still reaches the accepted input domain — tooling
* that generates example JSON keeps generating the legacy forms, which is
* exactly what a parser test wants to exercise. Like every combinator, this
* takes a schema that names no accessor; see {@link withAccessors}.
*
* `inner`'s {@link SerializationSchema.isEqual | isEqual} is *not* inherited:
* it compares values of `inner`'s domain, and the transformed domain may be a
* different type entirely. Pass `{isEqual}` when the output domain is
* reference-typed, or a transformed array/object property can never compact
* away and, used as a `createState` parse, dirties its node on every write of
* an equal value.
*
* A comparator passed here is used wherever this schema is used directly, but
* is *not* consulted when the schema is a {@link unionValue} member: a union
* selects by what a member accepts, and this accepts `inner`'s domain while
* producing another, so it cannot tell which member made a value and compares
* structurally instead. The effect is a stricter answer than yours — a value
* you would call the default is written out rather than compacted away — never
* a looser one.
*
* Only then: an equality is for a domain `===` cannot compare, so declaring
* one over a primitive output is an error. `===` already answers there, and a
* comparator can only widen it — call two distinct serialized values equal —
* after which the compact form omits whichever is not the default and parsing
* restores the default in its place. A rotation compared modulo 360 serializes
* `360` as nothing and reads back as `0`. Normalize in the `transform`
* instead, where the value that reaches storage is the one that round-trips.
*
* @example
* ```ts
* const parseFormat = transformValue(
*   unionValue(
*     [numberValue(), enumValue(['bold', 'italic', 'underline'])],
*     0,
*   ),
*   value => (typeof value === 'string' ? TEXT_TYPE_TO_FORMAT[value] : value),
* );
* //    ^? SerializationSchema<number>
* parseFormat(1);      // 1
* parseFormat('bold'); // IS_BOLD
* parseFormat('junk'); // 0 (inner falls back to its default)
* ```
* @__NO_SIDE_EFFECTS__
*/
function transformValue(inner, transform, options = {}) {
	return makeSchema((value) => transform(inner(value)), {
		inner,
		kind: "transform"
	}, markCallerOwned(transform(inner.defaultValue)), options.isEqual, (value) => $acceptsValue(inner, value));
}
/**
* Build a {@link SerializationSchema} for a value this schema deliberately does not
* validate, because something else owns its domain — the motivating case is a
* nested {@link SerializedEditor}, which the nested editor's own
* `parseEditorState` validates when the property is applied.
*
* The value is passed through unchanged and `undefined` is the recoverable
* default, so declaring the property still routes it through the node's setter
* (and keeps it visible to schema-walking tooling) without pretending to
* validate its contents.
* @__NO_SIDE_EFFECTS__
*/
function rawValue() {
	return makeSchema((value) => value === void 0 ? void 0 : value, { kind: "raw" }, void 0, void 0, () => true);
}
/**
* Build a {@link SerializationSchema} for an array whose entries are each coerced by `item`.
* A non-array value (including `undefined`) yields the empty array, which is the
* recoverable default.
*
* @example
* ```ts
* const parseIds = arrayValue(stringValue());
* //    ^? SerializationSchema<string[]>
* parseIds(['a', 'b']); // ['a', 'b']
* parseIds('nope');     // []
* ```
* @__NO_SIDE_EFFECTS__
*/
function arrayValue(item) {
	return makeSchema((value) => {
		if (!Array.isArray(value)) return [];
		const result = new Array(value.length);
		for (let i = 0; i < value.length; i++) result[i] = item(value[i]);
		return result;
	}, {
		item,
		kind: "array"
	}, void 0, (a, b) => {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) if (!isSchemaEqual(item, a[i], b[i])) return false;
		return true;
	}, (value) => Array.isArray(value));
}
/**
* Compose per-property {@link SerializationSchema}s into a single {@link SerializationSchema} for an
* object-valued property. Calling it coerces each known property in turn
* (ignoring any extra properties), so `objectValue(...)` applied to a partial
* or untrusted object returns a fully-populated, validated object;
* `objectValue(...)(undefined)` returns the all-defaults object. Its fields
* name no accessor: an object's field is not a node's property, which is what
* {@link nodeSchema} — the same record, checked against a node — is for.
*
* @example
* ```ts
* // A property whose value is an object of its own; a node's own schema is
* // nodeSchema<MyNode>()({...}), whose fields may name accessors.
* const dimensions = objectValue({
*   height: numberValue(),
*   width: numberValue(),
* });
* ```
* @__NO_SIDE_EFFECTS__
*/
function objectValue(fields) {
	return objectSchema("objectValue", fields);
}
/**
* The names a serialized property may not have, checked where the schema is
* written. Shared by {@link objectValue} and {@link nodeSchema}, which read
* their fields off objects that came from `JSON.parse`.
*
* `__proto__` is refused in every build: assigning it on a plain object
* invokes `Object.prototype`'s setter and reparents the result instead of
* writing a property, so what it prevents is a parse returning an object
* missing the property it declared. That is a wrong value rather than a
* missing diagnostic. It costs one comparison per field when the schema is
* built, which is once at module scope, and nothing per parse.
*
* The rest of `Object.prototype`'s members are refused in a development build,
* for the same reason one step removed. A serialized object inherits them, and
* every read of a property is a bare one, because an absent property is
* `undefined` and that is already its default. A field named for an inherited
* member is the single case where that reads something: the method, for a
* property the document never carried. The code generator refuses the same
* names, so this is the diagnostic for the path that has no build step.
*
* @__NO_SIDE_EFFECTS__
*/
function checkFieldNames(combinator, fields) {
	for (const key of Object.keys(fields)) invariant(key !== "__proto__", "%s: \"__proto__\" is not a valid field name", combinator);
}
/**
* {@link objectValue} without the accessor check, for {@link nodeSchema}: its
* fields are the one place a name is declared, and the one place it is
* discharged.
* @__NO_SIDE_EFFECTS__
*/
function objectSchema(combinator, fields) {
	const entries = Object.entries(fields);
	checkFieldNames(combinator, fields);
	return makeSchema((value) => {
		const source = value !== null && typeof value === "object" ? value : {};
		const result = {};
		for (let i = 0; i < entries.length; i++) {
			const [key, schema] = entries[i];
			result[key] = schema(source[key]);
		}
		return result;
	}, {
		fields,
		kind: "object"
	}, void 0, (a, b) => isPlainObject(a) && isPlainObject(b) && !hasUndeclaredKey(a, fields) && !hasUndeclaredKey(b, fields) && entries.every(([key, schema]) => isSchemaEqual(schema, a[key], b[key])), (value) => isPlainObject(value) && !hasUndeclaredKey(value, fields));
}
/**
* Return a copy of `schema` that declares the serialized property to *be* a
* node field rather than a pair of accessor methods.
*
* This is the fast path in both directions: exporting reads the field, and
* importing assigns it, with no method call on either side — and no version
* resolution either way, since the node being parsed into is writable by
* construction and the node being exported is one the walk already resolved
* from the EditorState. Because the name is recorded on the schema, an introspecting
* tool (a codegen pass emitting a specialized parser for a hot node type) can
* see that a property is a plain field and compile it to a direct assignment.
* Use {@link withAccessors} with a `{field}` on one side only when the two
* directions differ — reading the field but writing through a method that
* normalizes, as TableCellNode's `headerState` does.
*
* The trade-off is that a field access is exactly that: normalization,
* validation or bookkeeping a `set<Prop>` method would do is skipped, and a
* subclass override of that method is not consulted. Use it when the property
* really is the field — which is also what makes it safe to compile away.
*
* Each direction still stands in for an accessor, so a subclass that overrode
* one still decides; see {@link SchemaFieldBase.method}. That accessor is the
* conventional `get<Prop>`/`set<Prop>` unless `getter`/`setter` name a
* different one, so most declarations need neither — name one only where the
* accessor is spelled differently, as TextNode's `text` is (`getTextContent`).
* A node with no such method defers to nothing, which needs no declaring.
*
* `getterTable`/`setterTable` declare a property whose stored and serialized forms
* differ ({@link SchemaGetterField.getterTable} / {@link SchemaSetterField.setterTable}),
* and `when` names the predicate gating the export direction
* ({@link SchemaGetterField.when}).
*
* @example
* ```ts
* nodeSchema<TextNode>()({
*   // TextNode's own field in both directions, deferring to getStyle/setStyle
*   // for a subclass that overrides either — neither is spelled here, since
*   // both are the conventional name for a `style` property.
*   style: withField(stringValue(), {field: '__style'}),
*   // LinkNode's own field, standing in for getURL/setURL rather than the
*   // getUrl/setUrl the property name would derive.
*   url: withField(stringValue(), {
*     field: '__url',
*     getter: 'getURL',
*     setter: 'setURL',
*   }),
* });
* ```
* @__NO_SIDE_EFFECTS__
*/
function withField(schema, field) {
	return named("withField", schema, {
		getter: {
			field: field.field,
			getterTable: field.getterTable,
			method: field.getter,
			when: field.when
		},
		setter: {
			field: field.field,
			method: field.setter,
			setterTable: field.setterTable
		}
	});
}
/**
* Return a copy of `schema` that records both accessor names at once, which is
* the common case for a property whose node methods do not follow the default
* `get<Prop>`/`set<Prop>` naming. Either direction may be omitted to keep the
* conventional name for that one.
*
* **This and {@link withField} go outside every other combinator**, because an
* accessor answers for the property as a whole and each combinator widens what
* the property holds: `nullable` admits `null`, `optional` admits an absent
* value, `transformValue` produces a type of its own, and a union produces any
* member's. `nullable(withAccessors(stringValue(), {setter: 'setLabel'}))`
* obliged `setLabel` to take a `string` while the parser hands it `null` for a
* document that omits the property. Written the other way round —
* `withAccessors(nullable(stringValue()), {setter: 'setNullableLabel'})` — the
* obligation is stated for what the property really parses to, and the
* compiler checks it. Exactly once per property: a second layer would name a
* direction the first already named, and the walk calls only the outer one —
* an obligation checked for an accessor that is never called — so both
* directions are named in one call, and every combinator, this one included,
* refuses a schema that already names an accessor. A development build holds
* the rule at run time too, for a caller the types do not reach.
*
* @example
* ```ts
* nodeSchema<TextNode>()({
*   text: withAccessors(stringValue(), {
*     getter: 'getTextContent',
*     setter: 'setTextContent',
*   }),
* });
* ```
* @__NO_SIDE_EFFECTS__
*/
function withAccessors(schema, accessors) {
	return named("withAccessors", schema, accessors);
}
/**
* The copy {@link withAccessors} and {@link withField} return: `schema` with
* the given accessor names, and nothing else changed. Naming an accessor says
* nothing about the domain, so the copy keeps the original's default,
* equality and membership — the predicate by reference, so it keeps the
* provenance `DERIVED_ACCEPTS` records: claiming it as derived here silenced
* a caller's predicate on the copy *and*, the claim being keyed by function
* identity, on the schema it came from.
*/
function named(combinator, schema, accessors) {
	return Object.assign((value) => schema(value), {
		accepts: schema.accepts,
		defaultValue: schema.defaultValue,
		getter: accessors.getter,
		isEqual: schema.isEqual,
		meta: schema.meta,
		setter: accessors.setter
	});
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalNodeState.ts
/**
* Read the state directly from the given object without `node.getLatest()`.
* Safe to use outside of editor state context or to read a previous version,
* equivalent to reading the property directly.
*/
var NODE_STATE_DIRECT = "direct";
/**
* Use `node.getLatest()` before reading the state, per the lexical convention
* of only working with the latest version of a node.
*/
var NODE_STATE_LATEST = "latest";
/**
* The return value of {@link createState}, for use with
* {@link $getState} and {@link $setState}.
*/
var StateConfig = class {
	/** The string key used when serializing this state to JSON */
	key;
	/** The parse function from the StateValueConfig passed to createState */
	parse;
	/**
	* The unparse function from the StateValueConfig passed to createState,
	* with a default that is simply a pass-through that assumes the value is
	* JSON serializable.
	*/
	unparse;
	/**
	* An equality function from the StateValueConfig, with a default of
	* Object.is.
	*/
	isEqual;
	/**
	* The result of `stateValueConfig.parse(undefined)`, which is computed only
	* once and used as the default value. When the current value `isEqual` to
	* the `defaultValue`, it will not be serialized to JSON.
	*/
	defaultValue;
	resetOnCopyNode;
	/**
	* The {@link SerializationSchema} for this state's value, present when its
	* `parse` is a schema (e.g. `createState('mode', {parse: enumValue([...])})`).
	* It exposes the value's introspectable domain so tooling such as
	* `@lexical/fast-check` can generate examples of this state. It is undefined
	* when `parse` is a plain function with no schema metadata.
	*/
	schema;
	constructor(key, stateValueConfig) {
		this.key = key;
		const schema = isIntrospectableSchema(stateValueConfig.parse) ? stateValueConfig.parse : void 0;
		this.schema = schema;
		this.parse = stateValueConfig.parse.bind(stateValueConfig);
		this.unparse = (stateValueConfig.unparse || coerceToJSON).bind(stateValueConfig);
		this.isEqual = stateValueConfig.isEqual ? stateValueConfig.isEqual.bind(stateValueConfig) : schema !== void 0 && schema.isEqual !== void 0 ? (a, b) => isSchemaEqual(schema, a, b) : Object.is;
		this.defaultValue = schema !== void 0 ? schema.defaultValue : this.parse(void 0);
		this.resetOnCopyNode = stateValueConfig.resetOnCopyNode || false;
	}
};
/**
* Whether a `parse` is one of the {@link SerializationSchema} builders, which
* carry their domain alongside the coercion.
*
* It tests `meta.kind`, not `meta` alone: an unrelated parse function that
* happens to own a `meta` property is not a schema, and publishing it as one
* would hand introspecting tools a shape they cannot read. `defaultValue` is
* required for the same reason from the other direction — it is what this
* state's default is *taken from* below, so a function matching on `meta` but
* carrying no default would silently replace `parse(undefined)` with
* `undefined`, and every node with no value of its own would read as unset.
*/
function isIntrospectableSchema(parse) {
	return "meta" in parse && typeof parse.meta === "object" && parse.meta !== null && "kind" in parse.meta && typeof parse.meta.kind === "string" && "defaultValue" in parse;
}
/**
* Create a StateConfig for the given string key and StateValueConfig.
*
* The key must be locally unique. In dev you will get a key collision error
* when you use two separate StateConfig on the same node with the same key.
*
* The returned StateConfig value should be used with {@link $getState} and
* {@link $setState}.
*
* @param key The key to use
* @param valueConfig Configuration for the value type
* @returns a StateConfig
*
* @__NO_SIDE_EFFECTS__
*/
function createState(key, valueConfig) {
	return new StateConfig(key, valueConfig);
}
/**
* The accessor for working with node state. This will read the value for the
* state on the given node, and will return `stateConfig.defaultValue` if the
* state has never been set on this node.
*
* The `version` parameter is optional and should generally be {@link NODE_STATE_LATEST},
* consistent with the behavior of other node methods and functions,
* but for certain use cases such as `updateDOM` you may have a need to
* use {@link NODE_STATE_DIRECT} to read the state from a previous version of the node.
*
* For very advanced use cases, you can expect that {@link NODE_STATE_DIRECT} does not
* require an editor state, just like directly accessing other properties
* of a node without an accessor (e.g. `textNode.__text`).
*
* @param node Any LexicalNode
* @param stateConfig The configuration of the state to read
* @param version The default value {@link NODE_STATE_LATEST} will read the latest version of the node state, {@link NODE_STATE_DIRECT} will read the version that is stored on this LexicalNode which not reflect the version used in the current editor state
* @returns The current value from the state, or the default value provided by the configuration.
*/
function $getState(node, stateConfig, version = NODE_STATE_LATEST) {
	const state = (version === "latest" ? node.getLatest() : node).__state;
	if (state) return state.getValue(stateConfig);
	return stateConfig.defaultValue;
}
/**
* Given two versions of a node and a stateConfig, compare their state values
* using `$getState(nodeVersion, stateConfig, NODE_STATE_DIRECT)`.
* If the values are equal according to `stateConfig.isEqual`, return `null`,
* otherwise return `[value, prevValue]`.
*
* This is useful for implementing updateDOM. Note that the `NODE_STATE_DIRECT`
* version argument is used for both nodes.
*
* @param node Any LexicalNode
* @param prevNode A previous version of node
* @param stateConfig The configuration of the state to read
* @returns `[value, prevValue]` if changed, otherwise `null`
*/
function $getStateChange(node, prevNode, stateConfig) {
	const value = $getState(node, stateConfig, NODE_STATE_DIRECT);
	const prevValue = $getState(prevNode, stateConfig, NODE_STATE_DIRECT);
	return stateConfig.isEqual(value, prevValue) ? null : [value, prevValue];
}
/**
* Set the state defined by stateConfig on node. Like with `React.useState`
* you may directly specify the value or use an updater function that will
* be called with the previous value of the state on that node (which will
* be the `stateConfig.defaultValue` if not set).
*
* When an updater function is used, the node will only be marked dirty if
* `stateConfig.isEqual(prevValue, value)` is false.
*
* @example
* ```ts
* const toggle = createState('toggle', {parse: Boolean});
* // set it direction
* $setState(node, counterState, true);
* // use an updater
* $setState(node, counterState, (prev) => !prev);
* ```
*
* @param node The LexicalNode to set the state on
* @param stateConfig The configuration for this state
* @param valueOrUpdater The value or updater function
* @returns node
*/
function $setState(node, stateConfig, valueOrUpdater) {
	errorOnReadOnly();
	let value;
	if (typeof valueOrUpdater === "function") {
		const latest = node.getLatest();
		const prevValue = $getState(latest, stateConfig);
		value = valueOrUpdater(prevValue);
		if (stateConfig.isEqual(prevValue, value)) return latest;
	} else value = valueOrUpdater;
	const writable = node.getWritable();
	$getWritableNodeState(writable).updateFromKnown(stateConfig, value);
	return writable;
}
/**
* @internal
*
* Create the state to store on RegisteredNode
*/
function createSharedNodeState(nodeConfig) {
	const sharedConfigMap = /* @__PURE__ */ new Map();
	const flatKeys = /* @__PURE__ */ new Set();
	for (const { ownNodeConfig } of iterStaticNodeConfigChain(typeof nodeConfig === "function" ? nodeConfig : nodeConfig.replace)) if (ownNodeConfig && ownNodeConfig.stateConfigs) for (const requiredStateConfig of ownNodeConfig.stateConfigs) {
		let stateConfig;
		if ("stateConfig" in requiredStateConfig) {
			stateConfig = requiredStateConfig.stateConfig;
			if (requiredStateConfig.flat) flatKeys.add(stateConfig.key);
		} else stateConfig = requiredStateConfig;
		sharedConfigMap.set(stateConfig.key, stateConfig);
	}
	return {
		flatKeys,
		sharedConfigMap
	};
}
/**
* Keys that must never be written into an {@link UnknownStateRecord} from
* serialized (potentially untrusted) input. Writing a `__proto__` entry would
* re-parent the record's prototype, and because {@link NodeState.getValue}
* resolves keys with the `in` operator (which walks the prototype chain) an
* attacker could otherwise inject arbitrary state values via a crafted
* `__proto__`. These are never produced by {@link createState}.
*/
var UNSAFE_STATE_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
/**
* @internal
*/
var NodeState = class NodeState {
	/**
	* @internal
	*
	* Track the (versioned) node that this NodeState was created for, to
	* facilitate copy-on-write for NodeState. When a LexicalNode is cloned,
	* it will *reference* the NodeState from its prevNode. From the nextNode
	* you can continue to read state without copying, but the first $setState
	* will trigger a copy of the prevNode's NodeState with the node property
	* updated.
	*/
	node;
	/**
	* @internal
	*
	* State that has already been parsed in a get state, so it is safe. (can be returned with
	* just a cast since the proof was given before).
	*
	* Note that it uses StateConfig, so in addition to (1) the CURRENT VALUE, it has access to
	* (2) the State key (3) the DEFAULT VALUE and (4) the PARSE FUNCTION
	*/
	knownState;
	/**
	* @internal
	*
	* A copy of serializedNode[NODE_STATE_KEY] that is made when JSON is
	* imported but has not been parsed yet.
	*
	* It stays here until a get state requires us to parse it, and since we
	* then know the value is safe we move it to knownState.
	*
	* Note that since only string keys are used here, we can only allow this
	* state to pass-through on export or on the next version since there is
	* no known value configuration. This pass-through is to support scenarios
	* where multiple versions of the editor code are working in parallel so
	* an old version of your code doesnt erase metadata that was
	* set by a newer version of your code.
	*/
	unknownState;
	/**
	* @internal
	*
	* This sharedNodeState is preserved across all instances of a given
	* node type in an editor and remains writable. It is how keys are resolved
	* to configuration.
	*/
	sharedNodeState;
	/**
	* @internal
	*
	* The count of known or unknown keys in this state, ignoring the
	* intersection between the two sets.
	*/
	size;
	/**
	* @internal
	*/
	constructor(node, sharedNodeState, unknownState = void 0, knownState = /* @__PURE__ */ new Map(), size = void 0) {
		this.node = node;
		this.sharedNodeState = sharedNodeState;
		this.unknownState = unknownState;
		this.knownState = knownState;
		const { sharedConfigMap } = this.sharedNodeState;
		const computedSize = size !== void 0 ? size : computeSize(sharedConfigMap, unknownState, knownState);
		this.size = computedSize;
	}
	/**
	* @internal
	*
	* Get the value from knownState, or parse it from unknownState
	* if it contains the given key.
	*
	* Updates the sharedConfigMap when no known state is found.
	* Updates unknownState and knownState when an unknownState is parsed.
	*/
	getValue(stateConfig) {
		const known = this.knownState.get(stateConfig);
		if (known !== void 0) return known;
		this.sharedNodeState.sharedConfigMap.set(stateConfig.key, stateConfig);
		let parsed = stateConfig.defaultValue;
		if (this.unknownState && stateConfig.key in this.unknownState) {
			const jsonValue = this.unknownState[stateConfig.key];
			if (jsonValue !== void 0) parsed = stateConfig.parse(jsonValue);
			this.updateFromKnown(stateConfig, parsed);
		}
		return parsed;
	}
	/**
	* @internal
	*
	* Used only for advanced use cases, such as collab. The intent here is to
	* allow you to diff states with a more stable interface than the properties
	* of this class.
	*/
	getInternalState() {
		return [this.unknownState, this.knownState];
	}
	/**
	* Encode this NodeState to JSON in the format that its node expects.
	* This returns `{[NODE_STATE_KEY]?: UnknownStateRecord}` rather than
	* `UnknownStateRecord | undefined` so that we can support flattening
	* specific entries in the future when nodes can declare what
	* their required StateConfigs are.
	*/
	toJSON() {
		const state = { ...this.unknownState };
		const flatState = {};
		for (const [stateConfig, v] of this.knownState) if (stateConfig.isEqual(v, stateConfig.defaultValue)) delete state[stateConfig.key];
		else state[stateConfig.key] = stateConfig.unparse(v);
		for (const key of this.sharedNodeState.flatKeys) if (key in state) {
			flatState[key] = state[key];
			delete state[key];
		}
		if (undefinedIfEmpty(state)) flatState["$"] = state;
		return flatState;
	}
	/**
	* @internal
	*
	* A NodeState is writable when the node to update matches
	* the node associated with the NodeState. This basically
	* mirrors how the EditorState NodeMap works, but in a
	* bottom-up organization rather than a top-down organization.
	*
	* This allows us to implement the same "copy on write"
	* pattern for state, without having the state version
	* update every time the node version changes (e.g. when
	* its parent or siblings change).
	*
	* @param node The node to associate with the state
	* @returns The next writable state
	*/
	getWritable(node) {
		if (this.node === node) return this;
		const { sharedNodeState, unknownState } = this;
		const nextKnownState = new Map(this.knownState);
		return new NodeState(node, sharedNodeState, parseAndPruneNextUnknownState(sharedNodeState.sharedConfigMap, nextKnownState, unknownState), nextKnownState, this.size);
	}
	/** @internal */
	resetOnCopyNode() {
		for (const stateConfig of this.knownState.keys()) if (stateConfig.resetOnCopyNode) this.knownState.set(stateConfig, stateConfig.defaultValue);
		return this;
	}
	/** @internal */
	updateFromKnown(stateConfig, value) {
		const key = stateConfig.key;
		this.sharedNodeState.sharedConfigMap.set(key, stateConfig);
		const { knownState, unknownState } = this;
		if (!(knownState.has(stateConfig) || unknownState && key in unknownState)) {
			if (unknownState) {
				delete unknownState[key];
				this.unknownState = undefinedIfEmpty(unknownState);
			}
			this.size++;
		}
		knownState.set(stateConfig, value);
	}
	/**
	* @internal
	*
	* This is intended for advanced use cases only, such
	* as collab or dev tools.
	*
	* Update a single key value pair from unknown state,
	* parsing it if the key is known to this node. This is
	* basically like updateFromJSON, but the effect is
	* isolated to a single entry.
	*
	* @param k The string key from an UnknownStateRecord
	* @param v The unknown value from an UnknownStateRecord
	*/
	updateFromUnknown(k, v) {
		if (UNSAFE_STATE_KEYS.has(k)) return;
		const stateConfig = this.sharedNodeState.sharedConfigMap.get(k);
		if (stateConfig) this.updateFromKnown(stateConfig, stateConfig.parse(v));
		else {
			this.unknownState = this.unknownState || {};
			if (!(k in this.unknownState)) this.size++;
			this.unknownState[k] = v;
		}
	}
	/**
	* @internal
	*
	* Reset all existing state to default or empty values,
	* and perform any updates from the given unknownState.
	*
	* This is used when initializing a node's state from JSON,
	* or when resetting a node's state from JSON.
	*
	* @param unknownState The new state in serialized form
	*/
	updateFromJSON(unknownState) {
		const { knownState } = this;
		for (const stateConfig of knownState.keys()) knownState.set(stateConfig, stateConfig.defaultValue);
		this.size = knownState.size;
		this.unknownState = void 0;
		if (unknownState) for (const [k, v] of Object.entries(unknownState)) this.updateFromUnknown(k, v);
	}
};
/**
* @internal
*
* Only for direct use in very advanced integrations, such as lexical-yjs.
* Typically you would only use {@link createState}, {@link $getState}, and
* {@link $setState}. This is effectively the preamble for {@link $setState}.
*/
function $getWritableNodeState(node) {
	const writable = node.getWritable();
	const state = writable.__state ? writable.__state.getWritable(writable) : new NodeState(writable, $getSharedNodeState(writable));
	writable.__state = state;
	return state;
}
/**
* @internal
*
* Get the SharedNodeState for a node on this editor
*/
function $getSharedNodeState(node) {
	return node.__state ? node.__state.sharedNodeState : getRegisteredNodeOrThrow($getEditor(), node.getType()).sharedNodeState;
}
/**
* @internal
*
* This is used to implement LexicalNode.updateFromJSON and is
* not intended to be exported from the package.
*
* @param node any LexicalNode
* @param unknownState undefined or a serialized State
* @returns A writable version of node, with the state set.
*/
function $updateStateFromJSON(node, serialized) {
	const writable = node.getWritable();
	const unknownState = serialized["$"];
	if (writable.__state || unknownState) $getWritableNodeState(node).updateFromJSON(unknownState);
	return writable;
}
/**
* @internal
*
* Return true if the two nodes have equivalent NodeState, to be used
* to determine when TextNode are being merged, not a lot of use cases
* otherwise.
*/
function nodeStatesAreEquivalent(a, b) {
	if (a === b) return true;
	const keys = /* @__PURE__ */ new Set();
	return !(a && hasUnequalMapEntry(keys, a, b) || b && hasUnequalMapEntry(keys, b, a) || a && hasUnequalRecordEntry(keys, a, b) || b && hasUnequalRecordEntry(keys, b, a));
}
/**
* Compute the number of distinct keys that will be in a NodeState
*/
function computeSize(sharedConfigMap, unknownState, knownState) {
	let size = knownState.size;
	if (unknownState) for (const k in unknownState) {
		const sharedConfig = sharedConfigMap.get(k);
		if (!sharedConfig || !knownState.has(sharedConfig)) size++;
	}
	return size;
}
/**
* @internal
*
* Return obj if it is an object with at least one property, otherwise
* return undefined.
*/
function undefinedIfEmpty(obj) {
	if (obj) for (const key in obj) return obj;
}
/**
* @internal
*
* Cast the given v to unknown
*/
function coerceToJSON(v) {
	return v;
}
/**
* @internal
*
* Parse all knowable values in an UnknownStateRecord into nextKnownState
* and return the unparsed values in a new UnknownStateRecord. Returns
* undefined if no unknown values remain.
*/
function parseAndPruneNextUnknownState(sharedConfigMap, nextKnownState, unknownState) {
	let nextUnknownState = void 0;
	if (unknownState) for (const [k, v] of Object.entries(unknownState)) {
		if (UNSAFE_STATE_KEYS.has(k)) continue;
		const stateConfig = sharedConfigMap.get(k);
		if (stateConfig) {
			if (!nextKnownState.has(stateConfig)) nextKnownState.set(stateConfig, stateConfig.parse(v));
		} else {
			nextUnknownState = nextUnknownState || {};
			nextUnknownState[k] = v;
		}
	}
	return nextUnknownState;
}
/**
* @internal
*
* Compare each entry of sourceState.knownState that is not in keys to
* otherState (or the default value if otherState is undefined.
* Note that otherState will return the defaultValue as well if it
* has never been set. Any checked entry's key will be added to keys.
*
* @returns true if any difference is found, false otherwise
*/
function hasUnequalMapEntry(keys, sourceState, otherState) {
	for (const [stateConfig, value] of sourceState.knownState) {
		if (keys.has(stateConfig.key)) continue;
		keys.add(stateConfig.key);
		const otherValue = otherState ? otherState.getValue(stateConfig) : stateConfig.defaultValue;
		if (otherValue !== value && !stateConfig.isEqual(otherValue, value)) return true;
	}
	return false;
}
/**
* @internal
*
* Compare each entry of sourceState.unknownState that is not in keys to
* otherState.unknownState (or undefined if otherState is undefined).
* Any checked entry's key will be added to keys.
*
* Notably since we have already checked hasUnequalMapEntry on both sides,
* we do not do any parsing or checking of knownState.
*
* @returns true if any difference is found, false otherwise
*/
function hasUnequalRecordEntry(keys, sourceState, otherState) {
	const { unknownState } = sourceState;
	const otherUnknownState = otherState ? otherState.unknownState : void 0;
	if (unknownState) for (const [key, value] of Object.entries(unknownState)) {
		if (keys.has(key)) continue;
		keys.add(key);
		if (value !== (otherUnknownState ? otherUnknownState[key] : void 0)) return true;
	}
	return false;
}
/**
* @internal
*
* Clones the NodeState for a given node. Handles aliasing if the state references the from node.
*/
function $cloneNodeState(from, to) {
	const state = from.__state;
	return state && state.node === from ? state.getWritable(to) : state;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalNormalization.ts
function $canSimpleTextNodesBeMerged(node1, node2) {
	const node1Mode = node1.__mode;
	const node1Format = node1.__format;
	const node1Style = node1.__style;
	const node2Mode = node2.__mode;
	const node2Format = node2.__format;
	const node2Style = node2.__style;
	const node1State = node1.__state;
	const node2State = node2.__state;
	return (node1Mode === null || node1Mode === node2Mode) && (node1Format === null || node1Format === node2Format) && (node1Style === null || node1Style === node2Style) && (node1.__state === null || node1State === node2State || nodeStatesAreEquivalent(node1State, node2State));
}
function $mergeTextNodes(node1, node2) {
	const writableNode1 = node1.mergeWithSibling(node2);
	const normalizedNodes = getActiveEditor()._normalizedNodes;
	normalizedNodes.add(node1.__key);
	normalizedNodes.add(node2.__key);
	return writableNode1;
}
function $normalizeTextNode(textNode) {
	let node = textNode;
	if (node.__text === "" && node.isSimpleText() && !node.isUnmergeable()) {
		node.remove();
		return;
	}
	let previousNode;
	while ((previousNode = node.getPreviousSibling()) !== null && $isTextNode(previousNode) && previousNode.isSimpleText() && !previousNode.isUnmergeable()) if (previousNode.__text === "") previousNode.remove();
	else if ($canSimpleTextNodesBeMerged(previousNode, node)) {
		node = $mergeTextNodes(previousNode, node);
		break;
	} else break;
	let nextNode;
	while ((nextNode = node.getNextSibling()) !== null && $isTextNode(nextNode) && nextNode.isSimpleText() && !nextNode.isUnmergeable()) if (nextNode.__text === "") nextNode.remove();
	else if ($canSimpleTextNodesBeMerged(node, nextNode)) {
		node = $mergeTextNodes(node, nextNode);
		break;
	} else break;
}
/** Descends element-type anchor and focus points of a RangeSelection toward the deepest text-type points, stopping at non-element leaf nodes. */
function $normalizeSelection(selection) {
	$normalizePoint(selection.anchor);
	$normalizePoint(selection.focus);
	return selection;
}
function $normalizePoint(point) {
	while (point.type === "element") {
		const node = point.getNode();
		const offset = point.offset;
		let nextNode;
		let nextOffsetAtEnd;
		if (offset === node.getChildrenSize()) {
			nextNode = node.getChildAtIndex(offset - 1);
			nextOffsetAtEnd = true;
		} else {
			nextNode = node.getChildAtIndex(offset);
			nextOffsetAtEnd = false;
		}
		if ($isTextNode(nextNode)) {
			point.set(nextNode.__key, nextOffsetAtEnd ? nextNode.getTextContentSize() : 0, "text", true);
			break;
		} else if (!$isElementNode(nextNode)) break;
		point.set(nextNode.__key, nextOffsetAtEnd ? nextNode.getChildrenSize() : 0, "element", true);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalReconciler.ts
/**
* @internal
*
* A reconcile-managed cache of `getTextContentSize()` for leaf nodes.
*
* Stored as a Symbol-keyed property on the node instance itself so that
* read/write are direct slot access. The slot is pre-allocated to
* `undefined` as a non-enumerable property in the LexicalNode constructor
* so all instances share the same V8 hidden-class shape and the setter is
* a stable inline cache hit instead of a per-instance shape transition.
*
* ElementNodes are NOT stored here: an element can be dirty without being
* cloned (a descendant edit marks ancestors dirty via
* `internalMarkParentElementsAsDirty` but does not `getWritable()` them), so
* the same — DEV-frozen — instance would need its size rewritten when its
* text changes, which the skip-if-set guard cannot do. Element sizes come
* from `dom.__lexicalTextContent` instead (see `$prevSuffixTextSize`).
*
* Leaf writes are skipped when the slot is already not `undefined`. The
* setter is only re-entered for the same instance via cross-parent moves
* (where the leaf is reused in a new parent without going through
* `getWritable` — text is unchanged, so the prior cycle's value is still
* correct). A leaf whose text actually changed went through
* `getWritable()` and produced a fresh clone via `static clone(node)` ->
* ctor -> fresh `undefined` slot, so the setter writes through normally.
*
* The reconciler sets this on every reconciled leaf at the end of
* `$reconcileNode` (and on every newly-created leaf in `$createNode`), so
* the previous editor state's leaves always carry a valid cached size from
* the cycle that just committed.
*
* Suffix-incremental fast path reads this off the previous-state instance
* to get the pre-reconcile size of dirty children in O(1), avoiding both
* the `getLatest()` -> next-state trap and a recursive prev-tree walk.
*/
var CACHED_TEXT_SIZE_KEY = Symbol.for("@lexical/CachedTextSize");
function $prevSuffixTextSize(startKey, count) {
	return activePrevEditorState.read(() => {
		let size = 0;
		let cur = startKey;
		for (let i = 0; i < count && cur !== null; i++) {
			const prevNode = activePrevNodeMap.get(cur);
			invariant(prevNode !== void 0, "prevSuffixTextSize: missing prev node for key %s", cur);
			if ($isElementNode(prevNode)) {
				const nextNode = activeNextNodeMap.get(cur);
				if (nextNode !== void 0 && $isElementNode(nextNode) && nextNode.__parent !== prevNode.__parent) size += prevNode.getTextContentSize();
				else {
					const keyedDom = activePrevKeyToDOMMap.get(cur);
					const cached = keyedDom && keyedDom.__lexicalTextContent;
					invariant(typeof cached === "string", "prevSuffixTextSize: missing __lexicalTextContent for ElementNode of type %s", prevNode.getType());
					size += cached.length;
				}
				if (i < count - 1 && !prevNode.isInline()) size += 2;
			} else {
				const cached = prevNode[CACHED_TEXT_SIZE_KEY];
				invariant(cached !== void 0, "prevSuffixTextSize: missing cached size for leaf %s key %s", prevNode.getType(), cur);
				size += cached;
			}
			cur = prevNode.__next;
		}
		return size;
	}, { editor: activeEditor$1 });
}
function $setCachedTextSize(node) {
	if ($isElementNode(node)) return;
	if (node[CACHED_TEXT_SIZE_KEY] !== void 0) return;
	node[CACHED_TEXT_SIZE_KEY] = $isTextNode(node) ? node.__text.length : node.getTextContentSize();
}
/**
* Minimum children count for the suffix-incremental fast path to engage.
* The fast path adds bookkeeping (cache lookups, suffix walks, splice) that
* a few-children parent's general walk would beat — gate by a threshold so
* the overhead only kicks in where the prefix preservation pays for it.
* Tuned via `editorCycle.bench`.
*/
var MIN_FAST_PATH_CHILDREN = 4;
/**
* @internal
*
* Bench-only escape hatch. When `skipChildrenFastPath` is true the children
* fast paths in `$reconcileChildren` are skipped and the general path
* (`$reconcileNodeChildren`) runs instead — used by `editorCycle.bench.ts`
* to produce a head-to-head A/B against the legacy walk in a single
* `vitest bench` run. Has no effect when false (default).
*/
var __benchOnly = { skipChildrenFastPath: false };
var subTreeTextContent = "";
var subTreeTextFormat = null;
var subTreeTextStyle = null;
var subTreeFirstTextKey = null;
function $beginCaptureGuard() {
	return {
		firstTextKey: subTreeFirstTextKey,
		format: subTreeTextFormat,
		style: subTreeTextStyle
	};
}
function $endCaptureGuard(saved) {
	if (saved.firstTextKey !== null) {
		subTreeTextFormat = saved.format;
		subTreeTextStyle = saved.style;
		subTreeFirstTextKey = saved.firstTextKey;
	}
}
function $bubbleChildFirstText(childKeyedDom) {
	if (subTreeFirstTextKey !== null) return;
	const childFirstKey = childKeyedDom.__lexicalFirstTextKey;
	invariant(childFirstKey !== void 0, "$bubbleChildFirstText: missing __lexicalFirstTextKey on element keyed DOM");
	if (childFirstKey === null) return;
	const textNode = activeNextNodeMap.get(childFirstKey);
	if ($isTextNode(textNode)) {
		subTreeTextFormat = textNode.getFormat();
		subTreeTextStyle = textNode.getStyle();
		subTreeFirstTextKey = childFirstKey;
	}
}
var activeEditorConfig;
var activeEditor$1;
var activeEditorNodes;
var treatAllNodesAsDirty = false;
var activeEditorStateReadOnly = false;
var activeMutationListeners;
var activeDirtyElements;
var activeDirtyLeaves;
var activePrevNodeMap;
var activePrevEditorState;
var activeNextNodeMap;
var activePrevKeyToDOMMap;
var activeDirtyChildrenByParent;
var mutatedNodes;
var activeEditorDOMRenderConfig;
function $destroyNode(key, parentDOM) {
	const node = activePrevNodeMap.get(key);
	const isMoved = activeNextNodeMap.has(key);
	if (parentDOM !== null) {
		const dom = getPrevElementByKeyOrThrow(key);
		if (dom.parentNode === parentDOM) parentDOM.removeChild(dom);
	}
	if (isMoved) return;
	activeEditor$1._keyToDOMMap.delete(key);
	if ($isElementNode(node)) {
		const children = $createChildrenArray(node, activePrevNodeMap);
		$destroyChildren(children, 0, children.length - 1, null);
	}
	if (node !== void 0) {
		for (const slotKey of $readSlots(node).values()) {
			const container = $slotContainerForKey(slotKey);
			$destroyNode(slotKey, null);
			if (container !== null) container.remove();
		}
		setMutatedNode(mutatedNodes, activeEditorNodes, activeMutationListeners, node, "destroyed");
	}
}
function $destroyChildren(children, _startIndex, endIndex, dom) {
	for (let startIndex = _startIndex; startIndex <= endIndex; ++startIndex) {
		const child = children[startIndex];
		if (child !== void 0) $destroyNode(child, dom);
	}
}
function setTextAlign(domStyle, value) {
	domStyle.setProperty("text-align", value);
}
var DEFAULT_INDENT_VALUE = "40px";
function setElementIndent(dom, indent) {
	const indentClassName = activeEditorConfig.theme.indent;
	if (typeof indentClassName === "string") {
		const elementHasClassName = dom.classList.contains(indentClassName);
		if (indent > 0 && !elementHasClassName) dom.classList.add(indentClassName);
		else if (indent < 1 && elementHasClassName) dom.classList.remove(indentClassName);
	}
	dom.style.setProperty("padding-inline-start", indent === 0 ? "" : `calc(${indent} * var(--lexical-indent-base-value, ${DEFAULT_INDENT_VALUE}))`);
	removeEmptyDOMAttribute(dom, "class");
	removeEmptyDOMAttribute(dom, "style");
}
function setElementFormat(dom, format) {
	const domStyle = dom.style;
	if (format === 0) setTextAlign(domStyle, "");
	else if (format === 1) setTextAlign(domStyle, "left");
	else if (format === 2) setTextAlign(domStyle, "center");
	else if (format === 3) setTextAlign(domStyle, "right");
	else if (format === 4) setTextAlign(domStyle, "justify");
	else if (format === 5) setTextAlign(domStyle, "start");
	else if (format === 6) setTextAlign(domStyle, "end");
	removeEmptyDOMAttribute(dom, "style");
}
function $getReconciledDirection(node) {
	const direction = node.__dir;
	if (direction !== null) return direction;
	if ($isRootNode(node)) return null;
	const parent = node.getParent();
	if (parent === null) return "auto";
	if (!$isRootOrShadowRoot(parent) || parent.__dir !== null) return null;
	return "auto";
}
function $setElementDirection(dom, node) {
	const direction = $getReconciledDirection(node);
	if (direction !== null) dom.dir = direction;
	else dom.removeAttribute("dir");
}
function $createSlotDOM(name) {
	const container = $getDocument().createElement("div");
	container.setAttribute("data-lexical-slot", name);
	container.style.display = "none";
	return container;
}
function $applySlotEditable(hostDom, decoratorHost, container) {
	if (decoratorHost || hostDom.contentEditable === "false") $markSlotEditable(container, activeEditor$1);
	else container.removeAttribute("contenteditable");
}
function $mountSlotChildren(node, hostDom, slots) {
	const previousSubTreeTextContent = subTreeTextContent;
	const outerSaved = $beginCaptureGuard();
	subTreeTextContent = "";
	let totalText = "";
	const decoratorHost = $isDecoratorNode(node);
	for (const [name, slotKey] of slots) {
		const container = $createSlotDOM(name);
		$applySlotEditable(hostDom, decoratorHost, container);
		hostDom.appendChild(container);
		subTreeTextContent = "";
		const saved = $beginCaptureGuard();
		$createNode(slotKey, $getDOMSlot(node, container, activeEditor$1));
		$endCaptureGuard(saved);
		$applySlotTarget(node, name, hostDom, container);
		totalText += subTreeTextContent;
	}
	$endCaptureGuard(outerSaved);
	subTreeTextContent = previousSubTreeTextContent;
	return totalText;
}
function $readSlots(node) {
	return $isSlotHost(node) && node.__slots !== null ? node.__slots : EMPTY_SLOTS;
}
function $applySlotTarget(node, name, hostDom, container) {
	const target = activeEditorDOMRenderConfig.$getSlotTargetElement(node, name, hostDom, activeEditor$1);
	if (target !== null) {
		if (container.parentElement !== target) target.appendChild(container);
		container.style.display = "";
	}
}
function $slotContainerForKey(slotKey) {
	const slotDom = activePrevKeyToDOMMap.get(slotKey);
	return slotDom !== void 0 ? slotDom.parentElement : null;
}
function $reconcileSlotChildren(prevNode, nextNode, hostDom) {
	const prevSlots = $readSlots(prevNode);
	const nextSlots = $readSlots(nextNode);
	for (const [name, prevSlotKey] of prevSlots) if (!nextSlots.has(name)) {
		const staleContainer = $slotContainerForKey(prevSlotKey);
		$destroyNode(prevSlotKey, null);
		if (staleContainer !== null) staleContainer.remove();
	}
	const previousSubTreeTextContent = subTreeTextContent;
	const outerSaved = $beginCaptureGuard();
	let totalText = "";
	let prevContainer = null;
	const decoratorHost = $isDecoratorNode(nextNode);
	for (const [name, nextSlotKey] of nextSlots) {
		const prevSlotKey = prevSlots.get(name);
		let container = prevSlotKey !== void 0 ? $slotContainerForKey(prevSlotKey) : null;
		subTreeTextContent = "";
		const saved = $beginCaptureGuard();
		if (container === null) {
			container = $createSlotDOM(name);
			let firstNonSlot = null;
			for (const child of hostDom.children) if (!child.hasAttribute("data-lexical-slot")) {
				firstNonSlot = child;
				break;
			}
			hostDom.insertBefore(container, firstNonSlot);
			$createNode(nextSlotKey, $getDOMSlot(nextNode, container, activeEditor$1));
		} else if (prevSlotKey === nextSlotKey) $reconcileNode(nextSlotKey, container);
		else {
			if (prevSlotKey !== void 0) $destroyNode(prevSlotKey, container);
			$createNode(nextSlotKey, $getDOMSlot(nextNode, container, activeEditor$1));
		}
		$endCaptureGuard(saved);
		$applySlotEditable(hostDom, decoratorHost, container);
		$applySlotTarget(nextNode, name, hostDom, container);
		totalText += subTreeTextContent;
		if (container.parentElement === hostDom) {
			const anchor = prevContainer === null ? hostDom.firstChild : prevContainer.nextSibling;
			if (anchor !== container) hostDom.insertBefore(container, anchor);
			prevContainer = container;
		}
	}
	$endCaptureGuard(outerSaved);
	subTreeTextContent = previousSubTreeTextContent;
	return totalText;
}
function $createNode(key, slot) {
	const node = activeNextNodeMap.get(key);
	if (node === void 0) invariant(false, "createNode: node does not exist in nodeMap");
	if (slot !== null) {
		const prevNode = activePrevNodeMap.get(key);
		if (prevNode !== void 0) {
			const existingDOM = activePrevKeyToDOMMap.get(key);
			if (existingDOM !== void 0) {
				const prevSlotHost = $isSlotChild(prevNode) ? prevNode.__slotHost : null;
				const nextSlotHost = $isSlotChild(node) ? node.__slotHost : null;
				const modelMoved = prevNode.__parent !== node.__parent || prevSlotHost !== nextSlotHost;
				const slotChildDomDetached = nextSlotHost !== null && existingDOM.parentElement !== slot.element;
				if (modelMoved || slotChildDomDetached) {
					slot.insertChild(existingDOM);
					return $reconcileNode(key, slot.element);
				}
			}
		}
	}
	const dom = activeEditorDOMRenderConfig.$createDOM(node, activeEditor$1);
	storeDOMWithKey(key, dom, activeEditor$1);
	if ($isTextNode(node)) dom.setAttribute("data-lexical-text", "true");
	else if ($isDecoratorNode(node)) {
		dom.setAttribute("data-lexical-decorator", "true");
		setDOMUnmanaged(dom, { captureSelection: true });
	}
	if ($isElementNode(node)) {
		const indent = node.__indent;
		const childrenSize = node.__size;
		$setElementDirection(dom, node);
		if (indent !== 0) setElementIndent(dom, indent);
		const slots = $readSlots(node);
		const slotTextContent = slots.size > 0 ? $mountSlotChildren(node, dom, slots) : "";
		if (childrenSize === 0) {
			dom.__lexicalTextContent = slotTextContent;
			dom.__lexicalFirstTextKey = null;
			subTreeTextContent += slotTextContent;
			if (slots.size > 0) dom.__lexicalSlotTextLength = slotTextContent.length;
		} else {
			const outerBefore = subTreeTextContent;
			const endIndex = childrenSize - 1;
			$createChildren($createChildrenArray(node, activeNextNodeMap), node, 0, endIndex, $getDOMSlot(node, dom, activeEditor$1));
			if (slotTextContent !== "") {
				const childText = dom.__lexicalTextContent || "";
				dom.__lexicalTextContent = slotTextContent + childText;
				subTreeTextContent = outerBefore + slotTextContent + childText;
			}
			if (slots.size > 0) dom.__lexicalSlotTextLength = slotTextContent.length;
		}
		const format = node.__format;
		if (format !== 0) setElementFormat(dom, format);
		if (!node.isInline()) {
			$reconcileElementTerminatingLineBreak(null, node, dom);
			$reconcileDecoratorBoundaryAnchors(node, dom);
		}
	} else {
		const text = node.getTextContent();
		if ($isDecoratorNode(node)) {
			const decorator = node.decorate(activeEditor$1, activeEditorConfig);
			if (decorator !== null) reconcileDecorator(key, decorator);
			dom.contentEditable = "false";
			const slots = $readSlots(node);
			if (slots.size > 0) $mountSlotChildren(node, dom, slots);
		}
		subTreeTextContent += text;
	}
	if (slot !== null) slot.insertChild(dom);
	activeEditorDOMRenderConfig.$decorateDOM(node, null, dom, activeEditor$1);
	$setCachedTextSize(node);
	setMutatedNode(mutatedNodes, activeEditorNodes, activeMutationListeners, node, "created");
	return dom;
}
function $createChildren(children, element, _startIndex, endIndex, slot) {
	const previousSubTreeTextContent = subTreeTextContent;
	const outerSaved = $beginCaptureGuard();
	subTreeTextContent = "";
	subTreeTextFormat = null;
	subTreeTextStyle = null;
	subTreeFirstTextKey = null;
	let startIndex = _startIndex;
	for (; startIndex <= endIndex; ++startIndex) {
		const saved = $beginCaptureGuard();
		$createNode(children[startIndex], slot);
		const node = activeNextNodeMap.get(children[startIndex]);
		if (node !== null && $isTextNode(node)) {
			if (subTreeTextFormat === null) {
				subTreeTextFormat = node.getFormat();
				subTreeTextStyle = node.getStyle();
				subTreeFirstTextKey = node.__key;
			}
		} else if ($isElementNode(node) && startIndex < endIndex && !node.isInline()) subTreeTextContent += "\n\n";
		$endCaptureGuard(saved);
	}
	const cacheDom = activeEditor$1._keyToDOMMap.get(element.__key);
	invariant(cacheDom !== void 0, "$createChildren: Element with key %s missing from keyToDOMMap", element.__key);
	cacheDom.__lexicalTextContent = subTreeTextContent;
	cacheDom.__lexicalFirstTextKey = subTreeFirstTextKey;
	subTreeTextContent = previousSubTreeTextContent + subTreeTextContent;
	$endCaptureGuard(outerSaved);
}
function $isLastChildLineBreakOrDecorator(element, nodeMap) {
	if (element) {
		const lastKey = element.__last;
		if (lastKey) {
			const node = nodeMap.get(lastKey);
			if (node) return $isLineBreakNode(node) ? "line-break" : $isDecoratorNode(node) && node.isInline() ? "decorator" : null;
		}
		return "empty";
	}
	return null;
}
function $isBlockDecoratorChild(key, nodeMap) {
	if (!key) return false;
	const node = nodeMap.get(key);
	return $isDecoratorNode(node) && !node.isInline();
}
/**
* Browsers drop the selection highlight for the whole document when a range
* endpoint lands on an element boundary that is immediately adjacent to a
* block-level `contenteditable=false` child — e.g. select-all in a document
* whose first or last block is a DecoratorNode (#8922). Keep a zero-size
* out-of-flow anchor parked outside each such boundary child so the browser has
* an editable inline box to resolve the boundary position against. Interior
* decorators are unaffected, so only the first / last child is considered.
*/
function $reconcileDecoratorBoundaryAnchors(nextElement, dom) {
	const slot = $getDOMSlot(nextElement, dom, activeEditor$1);
	slot.setDecoratorBoundaryAnchor("leading", $isBlockDecoratorChild(nextElement.__first, activeNextNodeMap));
	slot.setDecoratorBoundaryAnchor("trailing", $isBlockDecoratorChild(nextElement.__last, activeNextNodeMap));
}
function $reconcileElementTerminatingLineBreak(prevElement, nextElement, dom) {
	const slot = $getDOMSlot(nextElement, dom, activeEditor$1);
	const nextLineBreak = $isLastChildLineBreakOrDecorator(nextElement, activeNextNodeMap);
	slot.setManagedLineBreak(nextLineBreak);
}
function reconcileTextFormat(element) {
	if (subTreeTextFormat != null && subTreeTextFormat !== element.__textFormat && !activeEditorStateReadOnly) element.setTextFormat(subTreeTextFormat);
}
function reconcileTextStyle(element) {
	if (subTreeTextStyle != null && subTreeTextStyle !== element.__textStyle && !activeEditorStateReadOnly) element.setTextStyle(subTreeTextStyle);
}
function $reconcileChildrenWithDirection(prevElement, nextElement, dom) {
	subTreeTextFormat = null;
	subTreeTextStyle = null;
	subTreeFirstTextKey = null;
	$reconcileChildren(prevElement, nextElement, $getDOMSlot(nextElement, dom, activeEditor$1));
	if (!$isRootOrShadowRoot(nextElement)) {
		reconcileTextFormat(nextElement);
		reconcileTextStyle(nextElement);
	}
}
function $buildDirtyChildrenByParent() {
	const map = /* @__PURE__ */ new Map();
	const addKeysToMap = (keys) => {
		for (const key of keys) {
			const node = activeNextNodeMap.get(key);
			if (node === void 0) continue;
			const parentKey = node.__parent;
			if (parentKey === null) continue;
			let set = map.get(parentKey);
			if (set === void 0) {
				set = /* @__PURE__ */ new Set();
				map.set(parentKey, set);
			}
			set.add(key);
		}
	};
	addKeysToMap(activeDirtyElements.keys());
	addKeysToMap(activeDirtyLeaves);
	return map;
}
function $suffixStartIfContiguous(parent, dirty) {
	const k = dirty.size;
	if (k === 0 || k >= parent.__size) return null;
	let cur = parent.__last;
	let suffixStart = null;
	let i = 0;
	while (cur !== null && i < k) {
		if (!dirty.has(cur)) return null;
		suffixStart = cur;
		const node = activeNextNodeMap.get(cur);
		if (node === void 0) return null;
		cur = node.__prev;
		i++;
	}
	if (i !== k) return null;
	if (cur !== null && dirty.has(cur)) return null;
	return suffixStart;
}
function $tryReconcileSuffixWithSizeDelta(prevElement, nextElement, slot, cacheDom, cachedParentText, suffixStartKey, k, sizeDelta) {
	if (sizeDelta !== 1 && sizeDelta !== -1) return false;
	if (k !== (sizeDelta === 1 ? 2 : 1)) return false;
	const kPrime = k - sizeDelta;
	let prevSuffixStartKey = prevElement.__last;
	for (let i = 0; i < kPrime - 1; i++) {
		if (prevSuffixStartKey === null) return false;
		const node = activePrevNodeMap.get(prevSuffixStartKey);
		if (node === void 0) return false;
		prevSuffixStartKey = node.__prev;
	}
	if (prevSuffixStartKey === null) return false;
	const nextStartNode = activeNextNodeMap.get(suffixStartKey);
	const prevStartNode = activePrevNodeMap.get(prevSuffixStartKey);
	if (nextStartNode === void 0 || prevStartNode === void 0) return false;
	if (nextStartNode.__prev !== prevStartNode.__prev) return false;
	const nextSuffixKeys = [];
	let cur = suffixStartKey;
	for (let i = 0; i < k; i++) {
		if (cur === null) return false;
		nextSuffixKeys.push(cur);
		const node = activeNextNodeMap.get(cur);
		cur = node ? node.__next : null;
	}
	const prevSuffixKeys = [];
	cur = prevSuffixStartKey;
	for (let i = 0; i < kPrime; i++) {
		if (cur === null) return false;
		prevSuffixKeys.push(cur);
		const node = activePrevNodeMap.get(cur);
		cur = node ? node.__next : null;
	}
	const prevSet = new Set(prevSuffixKeys);
	const nextSet = new Set(nextSuffixKeys);
	const ops = [];
	let pi = 0;
	let ni = 0;
	while (pi < kPrime && ni < k) if (nextSuffixKeys[ni] === prevSuffixKeys[pi]) {
		ops.push({
			key: nextSuffixKeys[ni],
			kind: "reconcile"
		});
		pi++;
		ni++;
	} else if (!nextSet.has(prevSuffixKeys[pi])) {
		ops.push({
			key: prevSuffixKeys[pi],
			kind: "destroy"
		});
		pi++;
	} else if (!prevSet.has(nextSuffixKeys[ni])) {
		ops.push({
			key: nextSuffixKeys[ni],
			kind: "create",
			nextIndex: ni
		});
		ni++;
	} else return false;
	while (pi < kPrime) ops.push({
		key: prevSuffixKeys[pi++],
		kind: "destroy"
	});
	while (ni < k) {
		ops.push({
			key: nextSuffixKeys[ni],
			kind: "create",
			nextIndex: ni
		});
		ni++;
	}
	const oldSuffixLength = $prevSuffixTextSize(prevSuffixStartKey, kPrime);
	for (const op of ops) {
		const saved = $beginCaptureGuard();
		if (op.kind === "reconcile") $reconcileNode(op.key, slot.element);
		else if (op.kind === "destroy") $destroyNode(op.key, slot.element);
		else {
			let beforeDOM = null;
			for (let j = op.nextIndex + 1; j < k; j++) {
				const siblingDOM = activeEditor$1._keyToDOMMap.get(nextSuffixKeys[j]);
				if (siblingDOM !== void 0) {
					beforeDOM = siblingDOM;
					break;
				}
			}
			$createNode(op.key, slot.withBefore(beforeDOM ?? slot.before));
		}
		if (op.kind !== "destroy") {
			const opNode = activeNextNodeMap.get(op.key);
			if (opNode && $isTextNode(opNode) && subTreeTextFormat === null) {
				subTreeTextFormat = opNode.getFormat();
				subTreeTextStyle = opNode.getStyle();
				subTreeFirstTextKey = opNode.__key;
			}
		}
		$endCaptureGuard(saved);
	}
	let newSuffix = "";
	for (let i = 0; i < k; i++) {
		const node = activeNextNodeMap.get(nextSuffixKeys[i]);
		if (node === void 0) return false;
		let text;
		if ($isElementNode(node)) {
			const childKeyedDom = activeEditor$1._keyToDOMMap.get(nextSuffixKeys[i]);
			const cached = childKeyedDom && childKeyedDom.__lexicalTextContent;
			invariant(typeof cached === "string", "tryReconcileSuffixWithSizeDelta: missing __lexicalTextContent on child of type %s after suffix reconcile", node.getType());
			text = cached;
		} else text = node.getTextContent();
		newSuffix += text;
		if (i < k - 1 && $isElementNode(node) && !node.isInline()) newSuffix += "\n\n";
	}
	const slotLen = cacheDom.__lexicalSlotTextLength || 0;
	const prevChildText = slotLen > 0 ? cachedParentText.slice(slotLen) : cachedParentText;
	cacheDom.__lexicalTextContent = prevChildText.slice(0, prevChildText.length - oldSuffixLength) + newSuffix;
	return true;
}
/**
* Decide whether the post-suffix-walk values of `subTreeTextFormat` /
* `subTreeTextStyle` should be kept (the prefix has no text descendant
* and the suffix carries the canonical first text) or replaced with the
* prev-cycle's canonical values (the prefix is still authoritative).
*
* The cached `__lexicalFirstTextKey` on `dom` is the deep TextNode key
* recorded when this element's children were last walked. We climb its
* ancestor chain in next-state until we reach a direct child of
* `nextElement`, then probe `dirtyChildren`: if that direct child is
* dirty (or the cached key is missing from the next map), the cached
* key has been moved into the suffix's subtree or destroyed, so the
* suffix-derived values are authoritative. Otherwise the prefix is
* canonical and we recover format/style from the live text node, which
* lets `reconcileTextFormat` / `reconcileTextStyle` no-op via their
* existing equality check against the parent's `__textFormat` /
* `__textStyle`.
*
* Walk depth is bounded by tree depth from the text node to the
* reconciled element (typically 1 — text directly under a paragraph).
* Always refreshes the cache for the next cycle.
*/
function $resolveSuffixPathFormat(nextElement, dom, dirtyChildren) {
	const cachedFirstTextKey = dom.__lexicalFirstTextKey;
	if (cachedFirstTextKey != null) {
		const parentKey = nextElement.__key;
		let ancestor = cachedFirstTextKey;
		while (ancestor !== null) {
			const node = activeNextNodeMap.get(ancestor);
			if (node === void 0) {
				ancestor = null;
				break;
			}
			if (node.__parent === parentKey) break;
			ancestor = node.__parent;
		}
		if (ancestor !== null && !dirtyChildren.has(ancestor)) {
			const textNode = activeNextNodeMap.get(cachedFirstTextKey);
			if ($isTextNode(textNode)) {
				subTreeTextFormat = textNode.getFormat();
				subTreeTextStyle = textNode.getStyle();
				return;
			}
		}
	}
	dom.__lexicalFirstTextKey = subTreeFirstTextKey;
}
function $reconcileChildren(prevElement, nextElement, slot) {
	const previousSubTreeTextContent = subTreeTextContent;
	const prevChildrenSize = prevElement.__size;
	const nextChildrenSize = nextElement.__size;
	subTreeTextContent = "";
	const dom = slot.element;
	const cacheDom = activeEditor$1._keyToDOMMap.get(nextElement.__key);
	invariant(cacheDom !== void 0, "$reconcileChildren: Element with key %s missing from keyToDOMMap", nextElement.__key);
	const sizeDelta = nextChildrenSize - prevChildrenSize;
	if (!__benchOnly.skipChildrenFastPath && !treatAllNodesAsDirty && Math.abs(sizeDelta) <= 1 && prevChildrenSize >= MIN_FAST_PATH_CHILDREN && prevElement.__first === nextElement.__first && (sizeDelta !== 0 || !activeEditor$1._cloneNotNeeded.has(prevElement.__key))) {
		const cachedParentText = cacheDom.__lexicalTextContent;
		const dirtyChildren = activeDirtyChildrenByParent.get(prevElement.__key);
		if (!treatAllNodesAsDirty && typeof cachedParentText === "string" && dirtyChildren !== void 0) {
			const suffixStartKey = $suffixStartIfContiguous(nextElement, dirtyChildren);
			if (suffixStartKey !== null) {
				const k = dirtyChildren.size;
				if (sizeDelta === 0) {
					const oldSuffixLength = $prevSuffixTextSize(suffixStartKey, k);
					let cur = suffixStartKey;
					let i = 0;
					while (cur !== null && i < k) {
						const node = activeNextNodeMap.get(cur);
						if (node === void 0) break;
						const saved = $beginCaptureGuard();
						$reconcileNode(cur, dom);
						if ($isTextNode(node) && subTreeTextFormat === null) {
							subTreeTextFormat = node.getFormat();
							subTreeTextStyle = node.getStyle();
							subTreeFirstTextKey = node.__key;
						}
						$endCaptureGuard(saved);
						cur = node.__next;
						i++;
					}
					let newSuffix = "";
					cur = suffixStartKey;
					i = 0;
					while (cur !== null && i < k) {
						const node = activeNextNodeMap.get(cur);
						if (node === void 0) break;
						let text;
						if ($isElementNode(node)) {
							const childKeyedDom = activeEditor$1._keyToDOMMap.get(cur);
							const cached = childKeyedDom && childKeyedDom.__lexicalTextContent;
							invariant(typeof cached === "string", "reconcileChildren same-size suffix: missing __lexicalTextContent on child of type %s after reconcile", node.getType());
							text = cached;
						} else text = node.getTextContent();
						newSuffix += text;
						if (i < k - 1 && $isElementNode(node) && !node.isInline()) newSuffix += "\n\n";
						cur = node.__next;
						i++;
					}
					const slotLen = cacheDom.__lexicalSlotTextLength || 0;
					const prevChildText = slotLen > 0 ? cachedParentText.slice(slotLen) : cachedParentText;
					const newChildText = prevChildText.slice(0, prevChildText.length - oldSuffixLength) + newSuffix;
					cacheDom.__lexicalTextContent = newChildText;
					subTreeTextContent = previousSubTreeTextContent + newChildText;
					$resolveSuffixPathFormat(nextElement, cacheDom, dirtyChildren);
					return;
				}
				if ($tryReconcileSuffixWithSizeDelta(prevElement, nextElement, slot, cacheDom, cachedParentText, suffixStartKey, k, sizeDelta)) {
					const newCachedText = cacheDom.__lexicalTextContent;
					invariant(typeof newCachedText === "string", "reconcileChildren: $tryReconcileSuffixWithSizeDelta returned true without writing __lexicalTextContent");
					subTreeTextContent = previousSubTreeTextContent + newCachedText;
					$resolveSuffixPathFormat(nextElement, cacheDom, dirtyChildren);
					return;
				}
			}
		}
		if (sizeDelta === 0) {
			let nodeKey = prevElement.__first;
			let i = 0;
			while (nodeKey !== null) {
				const node = activeNextNodeMap.get(nodeKey);
				if (node === void 0) break;
				const isDirty = treatAllNodesAsDirty || activeDirtyLeaves.has(nodeKey) || activeDirtyElements.has(nodeKey);
				const saved = $beginCaptureGuard();
				if (isDirty) $reconcileNode(nodeKey, dom);
				else {
					let text;
					let childKeyedDom;
					if ($isElementNode(node)) {
						childKeyedDom = activePrevKeyToDOMMap.get(nodeKey);
						const cached = childKeyedDom && childKeyedDom.__lexicalTextContent;
						invariant(typeof cached === "string", "reconcileChildren structurally-clean walk: missing __lexicalTextContent on non-dirty child of type %s", node.getType());
						text = cached;
					} else text = node.getTextContent();
					subTreeTextContent += text;
					if (childKeyedDom !== void 0) $bubbleChildFirstText(childKeyedDom);
				}
				if ($isTextNode(node)) {
					if (subTreeTextFormat === null) {
						subTreeTextFormat = node.getFormat();
						subTreeTextStyle = node.getStyle();
						subTreeFirstTextKey = node.__key;
					}
				} else if ($isElementNode(node) && i < nextChildrenSize - 1 && !node.isInline()) subTreeTextContent += "\n\n";
				$endCaptureGuard(saved);
				nodeKey = node.__next;
				i++;
			}
			cacheDom.__lexicalTextContent = subTreeTextContent;
			cacheDom.__lexicalFirstTextKey = subTreeFirstTextKey;
			subTreeTextContent = previousSubTreeTextContent + subTreeTextContent;
			return;
		}
	}
	if (prevChildrenSize === 1 && nextChildrenSize === 1) {
		const prevFirstChildKey = prevElement.__first;
		const nextFirstChildKey = nextElement.__first;
		if (prevFirstChildKey === nextFirstChildKey) $reconcileNode(prevFirstChildKey, dom);
		else {
			const lastDOM = getPrevElementByKeyOrThrow(prevFirstChildKey);
			const replacementDOM = $createNode(nextFirstChildKey, null);
			try {
				if (lastDOM.parentNode === dom) dom.replaceChild(replacementDOM, lastDOM);
				else slot.insertChild(replacementDOM);
			} catch (error) {
				if (typeof error === "object" && error != null) {
					const msg = `${error.toString()} Parent: ${dom.tagName}, new child: {tag: ${replacementDOM.tagName} key: ${nextFirstChildKey}}, old child: {tag: ${lastDOM.tagName}, key: ${prevFirstChildKey}}.`;
					throw new Error(msg);
				} else throw error;
			}
			$destroyNode(prevFirstChildKey, null);
		}
		const nextChildNode = activeNextNodeMap.get(nextFirstChildKey);
		if ($isTextNode(nextChildNode)) {
			if (subTreeTextFormat === null) {
				subTreeTextFormat = nextChildNode.getFormat();
				subTreeTextStyle = nextChildNode.getStyle();
				subTreeFirstTextKey = nextChildNode.__key;
			}
		}
	} else {
		const prevChildren = $createChildrenArray(prevElement, activePrevNodeMap);
		const nextChildren = $createChildrenArray(nextElement, activeNextNodeMap);
		invariant(prevChildren.length === prevChildrenSize, "$reconcileChildren: prevChildren.length !== prevChildrenSize");
		invariant(nextChildren.length === nextChildrenSize, "$reconcileChildren: nextChildren.length !== nextChildrenSize");
		if (prevChildrenSize === 0) {
			if (nextChildrenSize !== 0) $createChildren(nextChildren, nextElement, 0, nextChildrenSize - 1, slot);
		} else if (nextChildrenSize === 0) {
			if (prevChildrenSize !== 0) {
				const canUseFastPath = slot.after == null && slot.before == null && $readSlots(nextElement).size === 0 && slot.element.__lexicalLineBreak == null;
				$destroyChildren(prevChildren, 0, prevChildrenSize - 1, canUseFastPath ? null : dom);
				if (canUseFastPath) dom.textContent = "";
			}
		} else $reconcileNodeChildren(nextElement, prevChildren, nextChildren, prevChildrenSize, nextChildrenSize, slot);
	}
	cacheDom.__lexicalTextContent = subTreeTextContent;
	cacheDom.__lexicalFirstTextKey = subTreeFirstTextKey;
	subTreeTextContent = previousSubTreeTextContent + subTreeTextContent;
}
function $reconcileNode(key, parentDOM) {
	const prevNode = activePrevNodeMap.get(key);
	let nextNode = activeNextNodeMap.get(key);
	if (prevNode === void 0 || nextNode === void 0) invariant(false, "reconcileNode: prevNode or nextNode does not exist in nodeMap");
	const isDirty = treatAllNodesAsDirty || activeDirtyLeaves.has(key) || activeDirtyElements.has(key);
	const dom = getElementByKeyOrThrow(activeEditor$1, key);
	if (prevNode === nextNode && !isDirty) {
		let text;
		if ($isElementNode(prevNode)) {
			const previousSubTreeTextContent = dom.__lexicalTextContent;
			invariant(typeof previousSubTreeTextContent === "string", "reconcileNode: missing __lexicalTextContent on non-dirty element of type %s", prevNode.getType());
			text = previousSubTreeTextContent;
			$bubbleChildFirstText(dom);
		} else text = prevNode.getTextContent();
		subTreeTextContent += text;
		return dom;
	}
	if (prevNode !== nextNode && isDirty) setMutatedNode(mutatedNodes, activeEditorNodes, activeMutationListeners, nextNode, "updated");
	if (activeEditorDOMRenderConfig.$updateDOM(nextNode, prevNode, dom, activeEditor$1)) {
		const replacementDOM = $createNode(key, null);
		if (parentDOM === null) invariant(false, "reconcileNode: parentDOM is null");
		parentDOM.replaceChild(replacementDOM, dom);
		$destroyNode(key, null);
		return replacementDOM;
	}
	if ($isElementNode(prevNode)) {
		invariant($isElementNode(nextNode), "Node with key %s changed from ElementNode to !ElementNode", key);
		const nextIndent = nextNode.__indent;
		if (treatAllNodesAsDirty || nextIndent !== prevNode.__indent) setElementIndent(dom, nextIndent);
		const nextFormat = nextNode.__format;
		if (treatAllNodesAsDirty || nextFormat !== prevNode.__format) setElementFormat(dom, nextFormat);
		const slotTextContent = isDirty && ($readSlots(nextNode).size > 0 || $readSlots(prevNode).size > 0) ? $reconcileSlotChildren(prevNode, nextNode, dom) : "";
		if (isDirty) {
			const outerBefore = subTreeTextContent;
			$reconcileChildrenWithDirection(prevNode, nextNode, dom);
			if (!nextNode.isInline()) {
				if (!$isRootNode(nextNode)) $reconcileElementTerminatingLineBreak(prevNode, nextNode, dom);
				$reconcileDecoratorBoundaryAnchors(nextNode, dom);
			}
			if (slotTextContent !== "") {
				const childText = dom.__lexicalTextContent || "";
				dom.__lexicalTextContent = slotTextContent + childText;
				subTreeTextContent = outerBefore + slotTextContent + childText;
				dom.__lexicalSlotTextLength = slotTextContent.length;
			} else if ($readSlots(nextNode).size > 0 || $readSlots(prevNode).size > 0) dom.__lexicalSlotTextLength = 0;
		} else {
			const previousSubTreeTextContent = dom.__lexicalTextContent;
			invariant(typeof previousSubTreeTextContent === "string", "reconcileNode: missing __lexicalTextContent on cloned non-dirty element of type %s", prevNode.getType());
			subTreeTextContent += previousSubTreeTextContent;
			$bubbleChildFirstText(dom);
		}
		if (treatAllNodesAsDirty || nextNode.__dir !== prevNode.__dir || nextNode.__parent !== prevNode.__parent) {
			$setElementDirection(dom, nextNode);
			if ($isRootNode(nextNode) && !treatAllNodesAsDirty) {
				for (const child of nextNode.getChildren()) if ($isElementNode(child)) $setElementDirection(getElementByKeyOrThrow(activeEditor$1, child.getKey()), child);
			}
		}
	} else {
		const text = nextNode.getTextContent();
		if ($isDecoratorNode(nextNode)) {
			const decorator = nextNode.decorate(activeEditor$1, activeEditorConfig);
			if (decorator !== null) reconcileDecorator(key, decorator);
			if (isDirty && ($readSlots(nextNode).size > 0 || $readSlots(prevNode).size > 0)) $reconcileSlotChildren(prevNode, nextNode, dom);
		}
		subTreeTextContent += text;
	}
	if (!activeEditorStateReadOnly && $isRootNode(nextNode)) {
		const latestRoot = nextNode.getLatest();
		if (latestRoot.__cachedText !== subTreeTextContent) {
			const nextRootNode = latestRoot.getWritable();
			nextRootNode.__cachedText = subTreeTextContent;
			nextNode = nextRootNode;
		}
	}
	activeEditorDOMRenderConfig.$decorateDOM(nextNode, prevNode, dom, activeEditor$1);
	$setCachedTextSize(nextNode);
	return dom;
}
function reconcileDecorator(key, decorator) {
	let pendingDecorators = activeEditor$1._pendingDecorators;
	const currentDecorators = activeEditor$1._decorators;
	if (pendingDecorators === null) {
		if (currentDecorators[key] === decorator) return;
		pendingDecorators = cloneDecorators(activeEditor$1);
	}
	pendingDecorators[key] = decorator;
}
function getNextSibling(element) {
	let nextSibling = element.nextSibling;
	if (nextSibling !== null && nextSibling === activeEditor$1._blockCursorElement) nextSibling = nextSibling.nextSibling;
	return nextSibling;
}
function childrenSet(children, start) {
	const s = /* @__PURE__ */ new Set();
	for (let i = start; i < children.length; i++) s.add(children[i]);
	return s;
}
function $reconcileNodeChildren(nextElement, prevChildren, nextChildren, prevChildrenLength, nextChildrenLength, slot) {
	const prevEndIndex = prevChildrenLength - 1;
	const nextEndIndex = nextChildrenLength - 1;
	let prevChildrenSet;
	let nextChildrenSet;
	let siblingDOM = slot.getFirstChild();
	let prevIndex = 0;
	let nextIndex = 0;
	while (prevIndex <= prevEndIndex && nextIndex <= nextEndIndex) {
		const prevKey = prevChildren[prevIndex];
		const nextKey = nextChildren[nextIndex];
		const saved = $beginCaptureGuard();
		if (prevKey === nextKey) {
			siblingDOM = getNextSibling($reconcileNode(nextKey, slot.element));
			prevIndex++;
			nextIndex++;
		} else {
			if (nextChildrenSet === void 0) nextChildrenSet = childrenSet(nextChildren, nextIndex);
			if (prevChildrenSet === void 0) prevChildrenSet = childrenSet(prevChildren, prevIndex);
			else if (!prevChildrenSet.has(prevKey)) {
				prevIndex++;
				$endCaptureGuard(saved);
				continue;
			}
			if (!nextChildrenSet.has(prevKey)) {
				siblingDOM = getNextSibling(getPrevElementByKeyOrThrow(prevKey));
				$destroyNode(prevKey, slot.element);
				prevIndex++;
				prevChildrenSet.delete(prevKey);
				$endCaptureGuard(saved);
				continue;
			}
			if (!prevChildrenSet.has(nextKey)) {
				$createNode(nextKey, slot.withBefore(siblingDOM ?? slot.before));
				nextIndex++;
			} else {
				const childDOM = getElementByKeyOrThrow(activeEditor$1, nextKey);
				if (childDOM !== siblingDOM) slot.withBefore(siblingDOM ?? slot.before).insertChild(childDOM);
				siblingDOM = getNextSibling($reconcileNode(nextKey, slot.element));
				prevIndex++;
				nextIndex++;
			}
		}
		const node = activeNextNodeMap.get(nextKey);
		if (node !== null && $isTextNode(node)) {
			if (subTreeTextFormat === null) {
				subTreeTextFormat = node.getFormat();
				subTreeTextStyle = node.getStyle();
				subTreeFirstTextKey = node.__key;
			}
		} else if ($isElementNode(node) && nextIndex <= nextEndIndex && !node.isInline()) subTreeTextContent += "\n\n";
		$endCaptureGuard(saved);
	}
	const appendNewChildren = prevIndex > prevEndIndex;
	const removeOldChildren = nextIndex > nextEndIndex;
	if (appendNewChildren && !removeOldChildren) {
		const previousNode = nextChildren[nextEndIndex + 1];
		const insertDOM = previousNode === void 0 ? null : activeEditor$1.getElementByKey(previousNode);
		$createChildren(nextChildren, nextElement, nextIndex, nextEndIndex, slot.withBefore(insertDOM ?? slot.before));
	} else if (removeOldChildren && !appendNewChildren) $destroyChildren(prevChildren, prevIndex, prevEndIndex, slot.element);
}
function $reconcileRoot(prevEditorState, nextEditorState, editor, dirtyType, dirtyElements, dirtyLeaves) {
	subTreeTextContent = "";
	subTreeTextFormat = null;
	subTreeTextStyle = null;
	subTreeFirstTextKey = null;
	treatAllNodesAsDirty = dirtyType === 2;
	activeEditor$1 = editor;
	activeEditorConfig = editor._config;
	activeEditorDOMRenderConfig = editor._config.dom || DEFAULT_EDITOR_DOM_CONFIG;
	activeEditorNodes = editor._nodes;
	activeMutationListeners = activeEditor$1._listeners.mutation;
	activeDirtyElements = dirtyElements;
	activeDirtyLeaves = dirtyLeaves;
	activePrevNodeMap = prevEditorState._nodeMap;
	activePrevEditorState = prevEditorState;
	activeNextNodeMap = nextEditorState._nodeMap;
	activeEditorStateReadOnly = nextEditorState._readOnly;
	activePrevKeyToDOMMap = cloneMap(editor._keyToDOMMap);
	activeDirtyChildrenByParent = $buildDirtyChildrenByParent();
	const currentMutatedNodes = /* @__PURE__ */ new Map();
	mutatedNodes = currentMutatedNodes;
	$reconcileNode("root", null);
	activeEditor$1 = void 0;
	activeEditorNodes = void 0;
	activeDirtyElements = void 0;
	activeDirtyLeaves = void 0;
	activePrevNodeMap = void 0;
	activePrevEditorState = void 0;
	activeNextNodeMap = void 0;
	activeEditorConfig = void 0;
	activePrevKeyToDOMMap = void 0;
	activeDirtyChildrenByParent = void 0;
	mutatedNodes = void 0;
	activeEditorDOMRenderConfig = DEFAULT_EDITOR_DOM_CONFIG;
	return currentMutatedNodes;
}
function storeDOMWithKey(key, dom, editor) {
	const keyToDOMMap = editor._keyToDOMMap;
	setNodeKeyOnDOMNode(dom, editor, key);
	keyToDOMMap.set(key, dom);
}
function getPrevElementByKeyOrThrow(key) {
	const element = activePrevKeyToDOMMap.get(key);
	if (element === void 0) invariant(false, "Reconciliation: could not find DOM element for node key %s", key);
	return element;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+internal@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/internal/src/warnOnlyOnce.ts
/**
* Returns a function that logs `message` with `console.warn` the first time it
* is called (and never in production). Creating one has no effect, so the
* build annotates module-scope calls and a bundler can drop an unused warning.
*
* @__NO_SIDE_EFFECTS__
*/
function warnOnlyOnce(message) {
	return () => {};
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalCommands.ts
/**
* Crete a command that can be used with `editor.dispatchCommand` and
* `editor.registerCommand`. Commands are used by unique reference, not by
* name.
*
* @param type A string to identify the command, very helpful for debugging
* @returns A new LexicalCommand
*
* @__NO_SIDE_EFFECTS__
*/
function createCommand(type) {
	return { type };
}
/**
* Dispatched in an update, before reconciliation, when the selection changes.
* $getSelection() is the pending selection; $getPreviousSelection() is the last
* committed selection. Listeners may modify the pending update. The DOM is not
* guaranteed to match it: use $onUpdate(() => editor.read('latest', ...)) for
* DOM-dependent work, including element lookup, focus checks and positioning.
*/
var SELECTION_CHANGE_COMMAND = createCommand("SELECTION_CHANGE_COMMAND");
/** Dispatched to insert clipboard nodes at the current selection. */
var SELECTION_INSERT_CLIPBOARD_NODES_COMMAND = createCommand("SELECTION_INSERT_CLIPBOARD_NODES_COMMAND");
/** Dispatched on a mouse click event in the editor. */
var CLICK_COMMAND = createCommand("CLICK_COMMAND");
/** Dispatched on a beforeinput event. */
var BEFORE_INPUT_COMMAND = createCommand("BEFORE_INPUT_COMMAND");
/** Dispatched on an input event. */
var INPUT_COMMAND = createCommand("INPUT_COMMAND");
/** Dispatched when an IME composition session starts. */
var COMPOSITION_START_COMMAND = createCommand("COMPOSITION_START_COMMAND");
/** Dispatched when an IME composition session ends. */
var COMPOSITION_END_COMMAND = createCommand("COMPOSITION_END_COMMAND");
/**
* Dispatched to delete a character, the payload will be `true` if the deletion
* is backwards (backspace or delete on macOS) and `false` if forwards
* (delete or Fn+Delete on macOS).
*/
var DELETE_CHARACTER_COMMAND = createCommand("DELETE_CHARACTER_COMMAND");
/**
* Dispatched to insert a line break. With a false payload the
* cursor moves to the new line (Shift+Enter), with a true payload the cursor
* does not move (Ctrl+O on macOS).
*/
var INSERT_LINE_BREAK_COMMAND = createCommand("INSERT_LINE_BREAK_COMMAND");
/** Dispatched to insert a new paragraph (Enter key). */
var INSERT_PARAGRAPH_COMMAND = createCommand("INSERT_PARAGRAPH_COMMAND");
/** Dispatched to insert text from an InputEvent or a string. */
var CONTROLLED_TEXT_INSERTION_COMMAND = createCommand("CONTROLLED_TEXT_INSERTION_COMMAND");
/** Dispatched on a paste event. */
var PASTE_COMMAND = createCommand("PASTE_COMMAND");
/** Dispatched to remove the currently selected text. */
var REMOVE_TEXT_COMMAND = createCommand("REMOVE_TEXT_COMMAND");
/**
* Dispatched to delete a word, the payload will be `true` if the deletion is
* backwards (Ctrl+Backspace or Opt+Delete on macOS), and `false` if
* forwards (Ctrl+Delete or Fn+Opt+Delete on macOS).
*/
var DELETE_WORD_COMMAND = createCommand("DELETE_WORD_COMMAND");
/**
* Dispatched to delete a line, the payload will be `true` if the deletion is
* backwards (Cmd+Delete on macOS), and `false` if forwards
* (Fn+Cmd+Delete on macOS).
*/
var DELETE_LINE_COMMAND = createCommand("DELETE_LINE_COMMAND");
/**
* Dispatched to format the selected text.
*/
var FORMAT_TEXT_COMMAND = createCommand("FORMAT_TEXT_COMMAND");
/**
* Dispatched to explicitly set or unset text formats on the selection.
* Unlike FORMAT_TEXT_COMMAND which toggles, this command sets each specified
* format to the exact boolean value provided.
*/
var SET_TEXT_FORMAT_COMMAND = createCommand("SET_TEXT_FORMAT_COMMAND");
/**
* Dispatched on undo (Cmd+Z on macOS, Ctrl+Z elsewhere).
*/
var UNDO_COMMAND = createCommand("UNDO_COMMAND");
/**
* Dispatched on redo (Shift+Cmd+Z on macOS, Shift+Ctrl+Z or Ctrl+Y elsewhere).
*/
var REDO_COMMAND = createCommand("REDO_COMMAND");
/**
* Dispatched when any key is pressed.
*/
var KEY_DOWN_COMMAND = createCommand("KEYDOWN_COMMAND");
/**
* Dispatched when the `'ArrowRight'` key is pressed.
* The shift modifier key may also be down.
*/
var KEY_ARROW_RIGHT_COMMAND = createCommand("KEY_ARROW_RIGHT_COMMAND");
/**
* Dispatched when the move to end keyboard shortcut is pressed,
* (Cmd+Right on macOS; Ctrl+Right elsewhere).
*/
var MOVE_TO_END = createCommand("MOVE_TO_END");
/**
* Dispatched when the `'ArrowLeft'` key is pressed.
* The shift modifier key may also be down.
*/
var KEY_ARROW_LEFT_COMMAND = createCommand("KEY_ARROW_LEFT_COMMAND");
/**
* Dispatched when the move to start keyboard shortcut is pressed,
* (Cmd+Left on macOS; Ctrl+Left elsewhere).
*/
var MOVE_TO_START = createCommand("MOVE_TO_START");
/**
* Dispatched when the `'ArrowUp'` key is pressed.
* The shift and/or alt (option) modifier keys may also be down.
*/
var KEY_ARROW_UP_COMMAND = createCommand("KEY_ARROW_UP_COMMAND");
/**
* Dispatched when the `'ArrowDown'` key is pressed.
* The shift and/or alt (option) modifier keys may also be down.
*/
var KEY_ARROW_DOWN_COMMAND = createCommand("KEY_ARROW_DOWN_COMMAND");
/**
* Dispatched when the enter key is pressed, may also be called with a null
* payload when the intent is to insert a newline. The shift modifier key
* must be down, any other modifier keys may also be down.
*/
var KEY_ENTER_COMMAND = createCommand("KEY_ENTER_COMMAND");
/**
* Dispatched whenever the space (`' '`) key is pressed, any modifier
* keys may be down.
*/
var KEY_SPACE_COMMAND = createCommand("KEY_SPACE_COMMAND");
/**
* Dispatched whenever the `'Backspace'` key is pressed, the shift
* modifier key may be down.
*/
var KEY_BACKSPACE_COMMAND = createCommand("KEY_BACKSPACE_COMMAND");
/**
* Dispatched whenever the `'Escape'` key is pressed, any modifier
* keys may be down.
*/
var KEY_ESCAPE_COMMAND = createCommand("KEY_ESCAPE_COMMAND");
/**
* Dispatched whenever the `'Delete'` key is pressed (Fn+Delete on macOS).
*/
var KEY_DELETE_COMMAND = createCommand("KEY_DELETE_COMMAND");
/**
* Dispatched whenever the `'Tab'` key is pressed. The shift modifier key
* may be down.
*/
var KEY_TAB_COMMAND = createCommand("KEY_TAB_COMMAND");
/** Dispatched to insert a tab character. */
var INSERT_TAB_COMMAND = createCommand("INSERT_TAB_COMMAND");
/** Dispatched to indent the selected content. */
var INDENT_CONTENT_COMMAND = createCommand("INDENT_CONTENT_COMMAND");
/** Dispatched to outdent the selected content. */
var OUTDENT_CONTENT_COMMAND = createCommand("OUTDENT_CONTENT_COMMAND");
/** Dispatched on a drop event. */
var DROP_COMMAND = createCommand("DROP_COMMAND");
/** Dispatched to set the element format (alignment) of the selected block. */
var FORMAT_ELEMENT_COMMAND = createCommand("FORMAT_ELEMENT_COMMAND");
/** Dispatched when a drag operation starts. */
var DRAGSTART_COMMAND = createCommand("DRAGSTART_COMMAND");
/** Dispatched when a dragged element is over the editor. */
var DRAGOVER_COMMAND = createCommand("DRAGOVER_COMMAND");
/** Dispatched when a drag operation ends. */
var DRAGEND_COMMAND = createCommand("DRAGEND_COMMAND");
/**
* Dispatched on a copy event, either via the clipboard or a KeyboardEvent
* (Cmd+C on macOS, Ctrl+C elsewhere).
*/
var COPY_COMMAND = createCommand("COPY_COMMAND");
/**
* Dispatched on a cut event, either via the clipboard or a KeyboardEvent
* (Cmd+X on macOS, Ctrl+X elsewhere).
*/
var CUT_COMMAND = createCommand("CUT_COMMAND");
/**
* Dispatched on the select all keyboard shortcut
* (Cmd+A on macOS, Ctrl+A elsehwere).
*/
var SELECT_ALL_COMMAND = createCommand("SELECT_ALL_COMMAND");
/** Dispatched to clear all editor content. */
var CLEAR_EDITOR_COMMAND = createCommand("CLEAR_EDITOR_COMMAND");
/** Dispatched to clear the undo/redo history stack. */
var CLEAR_HISTORY_COMMAND = createCommand("CLEAR_HISTORY_COMMAND");
/**
* @deprecated in v0.49.0, use the `canRedo` signal from `HistoryExtension`.
*
* A command only reports a change, so a listener registered after the editor
* is initialized has no way to read the current value. The signal always
* holds it.
*
* Dispatched when the redo availability changes. Payload is true if redo is available.
*/
var CAN_REDO_COMMAND = createCommand("CAN_REDO_COMMAND");
/**
* @deprecated in v0.49.0, use the `canUndo` signal from `HistoryExtension`.
*
* A command only reports a change, so a listener registered after the editor
* is initialized has no way to read the current value. The signal always
* holds it.
*
* Dispatched when the undo availability changes. Payload is true if undo is available.
*/
var CAN_UNDO_COMMAND = createCommand("CAN_UNDO_COMMAND");
/** Dispatched when the editor receives focus. */
var FOCUS_COMMAND = createCommand("FOCUS_COMMAND");
/** Dispatched when the editor loses focus. */
var BLUR_COMMAND = createCommand("BLUR_COMMAND");
/**
* @deprecated in v0.31.0, use KEY_DOWN_COMMAND and check for modifiers
* directly.
*
* Dispatched after any KeyboardEvent when modifiers are pressed
*/
var KEY_MODIFIER_COMMAND = createCommand("KEY_MODIFIER_COMMAND");
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalKeyboardShortcuts.ts
/**
* The modifier mask for the primary shortcut modifier:
* ⌘ (metaKey) on Apple platforms and Ctrl elsewhere.
*/
/**
* Tag a modifier mask with the key it stands in for on other platforms. A
* function declared side-effect free (so the build annotates the calls below)
* rather than an object literal with a computed key, which is a side effect
* to bundlers and would pin these masks — and the platform probes they read —
* into every bundle that imports the module.
*
* @__NO_SIDE_EFFECTS__
*/
function controlOrOther(key, mask) {
	return {
		...mask,
		[CONTROL_OR_OTHER_KEY]: key
	};
}
var CONTROL_OR_META = controlOrOther("metaKey", {
	ctrlKey: !IS_APPLE,
	metaKey: IS_APPLE
});
/**
* The modifier mask for the secondary shortcut modifier:
* Option (altKey) on Apple platforms and Ctrl elsewhere, conventionally
* used for word-level editing and block-format shortcuts.
*/
var CONTROL_OR_ALT = controlOrOther("altKey", {
	altKey: IS_APPLE,
	ctrlKey: !IS_APPLE
});
var MODIFIER_BITS = [
	["altKey", 1],
	["ctrlKey", 2],
	["metaKey", 4],
	["shiftKey", 8]
];
function getEventModifierBits(event) {
	let bits = 0;
	for (const [prop, bit] of MODIFIER_BITS) if (event[prop]) bits |= bit;
	return bits;
}
/**
* Enumerate the modifier bitmasks that satisfy the mask, expanding each
* `'any'` into both states (so a mask with two `'any'` yields four
* bitmasks, and a fully concrete mask yields exactly one).
*/
function getMaskModifierBits(mask) {
	let combos = [0];
	for (const [prop, bit] of MODIFIER_BITS) {
		const expected = mask[prop] || false;
		if (expected === "any") combos = combos.concat(combos.map((bits) => bits | bit));
		else if (expected) combos = combos.map((bits) => bits | bit);
	}
	return combos;
}
function pushEntry(map, mapKey, shortcut) {
	const entry = map.get(mapKey);
	if (entry) entry.push(shortcut);
	else map.set(mapKey, [shortcut]);
}
/**
* @experimental @internal
*
* A shortcut table compiled for O(1) dispatch. Look-up is by a composite of
* the event's modifier bitmask and its `key` (with a second look-up by
* `code` for non-Latin layouts), so the cost of {@link match} /
* {@link matches} is independent of the number of shortcuts in the table.
*/
var CompiledKeyboardShortcuts = class {
	/** `${modifierBits}:${key.toLowerCase()}` -> shortcuts in insertion order */
	byKey = /* @__PURE__ */ new Map();
	/**
	* `${modifierBits}:${code}` (e.g. `Digit1`, `KeyB`) -> shortcuts, used
	* only when `event.key` is not a single ASCII character so that
	* single-character shortcuts still work on non-Latin keyboard layouts
	* (the same fallback as {@link isExactShortcutMatch})
	*/
	byCode = /* @__PURE__ */ new Map();
	add(shortcut) {
		const { key, modifiers = {} } = shortcut;
		invariant(key.length > 0, "KeyboardShortcutMatch: key must be non-empty");
		const lowerKey = key.toLowerCase();
		for (const bits of getMaskModifierBits(modifiers)) {
			pushEntry(this.byKey, `${bits}:${lowerKey}`, shortcut);
			if (key.length === 1) {
				if (/[0-9]/.test(key)) pushEntry(this.byCode, `${bits}:Digit${key}`, shortcut);
				else if (/[a-z]/.test(lowerKey)) pushEntry(this.byCode, `${bits}:Key${lowerKey.toUpperCase()}`, shortcut);
			}
		}
		return this;
	}
	/**
	* All shortcuts matching the event, in insertion order.
	* Matches by `key` precede matches by the `code` fallback.
	* @see {@link match} for the single-result fast path.
	*/
	matches(event) {
		const key = event.key;
		if (!key) return [];
		const bits = getEventModifierBits(event);
		const byKey = this.byKey.get(`${bits}:${key.toLowerCase()}`);
		const matches = byKey ? byKey.slice() : [];
		if (this.byCode.size > 0 && !(key.length === 1 && key.charCodeAt(0) <= 127)) {
			const byCode = this.byCode.get(`${bits}:${event.code}`);
			if (byCode) matches.push(...byCode);
		}
		return matches;
	}
	/**
	* The first shortcut matching the event, if any.
	* @see {@link matches} for the full list of matching shortcuts.
	*/
	match(event) {
		return this.matches(event)[0];
	}
};
/**
* @experimental @internal
*
* Compile a table of keyboard shortcuts down to a form that dispatches
* based on the pressed key and modifiers in O(1), instead of testing each
* shortcut in sequence.
*/
function compileKeyboardShortcuts(shortcuts) {
	const compiled = new CompiledKeyboardShortcuts();
	for (const shortcut of shortcuts) compiled.add(shortcut);
	return compiled;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalRefCountedRegistry.ts
/**
* Creates a {@link RefCountedRegistry}.
*
* @param activate - Wires `key` and returns its teardown. Called on the first
*   registration of each key.
* @__NO_SIDE_EFFECTS__
*/
function createRefCountedRegistry(activate) {
	const entries = /* @__PURE__ */ new Map();
	return {
		dispose() {
			for (const entry of entries.values()) entry.dispose();
			entries.clear();
		},
		register(key, options) {
			let entry = entries.get(key);
			if (entry === void 0) {
				entry = {
					dispose: activate(key, options),
					holders: /* @__PURE__ */ new Set()
				};
				entries.set(key, entry);
			}
			const release = () => {
				const current = entries.get(key);
				if (current && current.holders.delete(release) && current.holders.size === 0) {
					entries.delete(key);
					current.dispose();
				}
			};
			entry.holders.add(release);
			return release;
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/utils/registerEventListener.ts
function registerEventListener(target, type, listener, options) {
	target.addEventListener(type, listener, options);
	return target.removeEventListener.bind(target, type, listener, options);
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalEvents.ts
var PASS_THROUGH_COMMAND = /* @__PURE__ */ Object.freeze({});
var ANDROID_COMPOSITION_LATENCY = 30;
var rootElementEvents;
function getRootElementEvents() {
	if (rootElementEvents !== void 0) return rootElementEvents;
	const events = [
		["keydown", onKeyDown],
		["pointerdown", onPointerDown],
		["compositionstart", onCompositionStart],
		["compositionend", onCompositionEnd],
		["input", onInput],
		["click", onClick],
		["cut", PASS_THROUGH_COMMAND],
		["copy", PASS_THROUGH_COMMAND],
		["dragstart", PASS_THROUGH_COMMAND],
		["dragover", PASS_THROUGH_COMMAND],
		["dragend", PASS_THROUGH_COMMAND],
		["paste", PASS_THROUGH_COMMAND],
		["focus", PASS_THROUGH_COMMAND],
		["blur", PASS_THROUGH_COMMAND],
		["drop", PASS_THROUGH_COMMAND]
	];
	if (CAN_USE_BEFORE_INPUT) events.push(["beforeinput", (event, editor) => onBeforeInput(event, editor)]);
	if (IS_IOS) events.push(["keyup", (event, editor) => onKeyUp(event, editor)]);
	rootElementEvents = events;
	return events;
}
var rootElementToDocument = /* @__PURE__ */ new WeakMap();
var documentRegistrations = /* @__PURE__ */ new WeakMap();
var documentSelectionChange = createRefCountedRegistry((doc) => {
	doc.addEventListener("selectionchange", onDocumentSelectionChange);
	return () => doc.removeEventListener("selectionchange", onDocumentSelectionChange);
});
function $shouldPreventDefaultAndInsertText(selection, domTargetRange, text, timeStamp, isBeforeInput, cachedDOMSelectionPoints) {
	const anchor = selection.anchor;
	const focus = selection.focus;
	const anchorNode = anchor.getNode();
	const editor = getActiveEditor();
	let domSelectionPoints;
	if (cachedDOMSelectionPoints !== void 0) domSelectionPoints = cachedDOMSelectionPoints;
	else {
		const domSelection = getDOMSelection(getWindow(editor));
		domSelectionPoints = domSelection !== null ? getDOMSelectionPoints(domSelection, editor._rootElement) : null;
	}
	const domAnchorNode = domSelectionPoints !== null ? domSelectionPoints.anchorNode : null;
	const anchorKey = anchor.key;
	const backingAnchorElement = editor.getElementByKey(anchorKey);
	const textLength = text.length;
	return anchorKey !== focus.key || !$isTextNode(anchorNode) || (!isBeforeInput && (!CAN_USE_BEFORE_INPUT || editor._inputState.lastBeforeInputInsertTextTimeStamp < timeStamp + 50) || anchorNode.isDirty() && textLength < 2 || doesContainSurrogatePair(text)) && anchor.offset !== focus.offset && !anchorNode.isComposing() || $isTokenOrSegmented(anchorNode) || anchorNode.isDirty() && textLength > 1 || (isBeforeInput || !CAN_USE_BEFORE_INPUT) && backingAnchorElement !== null && !anchorNode.isComposing() && domAnchorNode !== $getDOMTextNode(anchorNode, backingAnchorElement, editor) || domSelectionPoints !== null && domTargetRange !== null && (!domTargetRange.collapsed || domTargetRange.startContainer !== domSelectionPoints.anchorNode || domTargetRange.startOffset !== domSelectionPoints.anchorOffset) || !anchorNode.isComposing() && (anchorNode.getFormat() !== selection.format || anchorNode.getStyle() !== selection.style) || $shouldInsertTextAfterOrBeforeTextNode(selection, anchorNode);
}
function shouldSkipSelectionChange(domNode, offset) {
	return isDOMTextNode(domNode) && domNode.nodeValue !== null && offset !== 0 && offset !== domNode.nodeValue.length;
}
function onSelectionChange(domSelection, editor, isActive) {
	const { anchorNode: anchorDOM, anchorOffset, focusNode: focusDOM, focusOffset } = getDOMSelectionPoints(domSelection, editor._rootElement);
	const inputState = editor._inputState;
	if (inputState.isSelectionChangeFromDOMUpdate) {
		inputState.isSelectionChangeFromDOMUpdate = false;
		const appliedPoints = inputState.selectionChangeFromDOMUpdatePoints;
		inputState.selectionChangeFromDOMUpdatePoints = null;
		if (shouldSkipSelectionChange(anchorDOM, anchorOffset) && shouldSkipSelectionChange(focusDOM, focusOffset) && !inputState.postDeleteSelectionToRestore && (appliedPoints === null || appliedPoints.anchorNode === anchorDOM && appliedPoints.anchorOffset === anchorOffset && appliedPoints.focusNode === focusDOM && appliedPoints.focusOffset === focusOffset)) return;
	}
	updateEditorSync(editor, () => {
		if (!isActive) {
			$setSelection(null);
			return;
		}
		if (!isSelectionWithinEditor(editor, anchorDOM, focusDOM)) return;
		let selection = $getSelection();
		if (inputState.postDeleteSelectionToRestore && $isRangeSelection(selection) && selection.isCollapsed()) {
			const curAnchor = selection.anchor;
			const prevAnchor = inputState.postDeleteSelectionToRestore.anchor;
			if (curAnchor.key === prevAnchor.key && curAnchor.offset === prevAnchor.offset + 1 || curAnchor.offset === 1 && prevAnchor.getNode().is(curAnchor.getNode().getPreviousSibling())) {
				selection = inputState.postDeleteSelectionToRestore.clone();
				$setSelection(selection);
			}
		}
		inputState.postDeleteSelectionToRestore = null;
		if ($isRangeSelection(selection)) {
			const anchor = selection.anchor;
			const anchorNode = anchor.getNode();
			if (selection.isCollapsed()) {
				if (domSelection.type === "Range" && anchorDOM === focusDOM) selection.dirty = true;
				const windowEvent = getWindow(editor).event;
				const currentTimeStamp = windowEvent ? windowEvent.timeStamp : performance.now();
				const { format: lastFormat, style: lastStyle, offset: lastOffset, key: lastKey, timeStamp } = inputState.collapsedSelectionFormat;
				const root = $getRoot();
				const isRootTextContentEmpty = editor.isComposing() === false && root.getTextContent() === "";
				if (currentTimeStamp < timeStamp + 200 && anchor.offset === lastOffset && anchor.key === lastKey) $updateSelectionFormatStyle(selection, lastFormat, lastStyle);
				else if (anchor.type === "text") {
					invariant($isTextNode(anchorNode), "Point.getNode() must return TextNode when type is text");
					$updateSelectionFormatStyleFromTextNode(selection, anchorNode);
				} else if (anchor.type === "element" && !isRootTextContentEmpty) {
					invariant($isElementNode(anchorNode), "Point.getNode() must return ElementNode when type is element");
					const lastNode = anchor.getNode();
					if (lastNode.isEmpty()) $updateSelectionFormatStyleFromElementNode(selection, lastNode);
					else $updateSelectionFormatStyle(selection, selection.format, "");
				}
			} else {
				const anchorKey = anchor.key;
				const focusKey = selection.focus.key;
				const nodes = selection.getNodes();
				const nodesLength = nodes.length;
				const isBackward = selection.isBackward();
				const startOffset = isBackward ? focusOffset : anchorOffset;
				const endOffset = isBackward ? anchorOffset : focusOffset;
				const startKey = isBackward ? focusKey : anchorKey;
				const endKey = isBackward ? anchorKey : focusKey;
				let combinedFormat = IS_ALL_FORMATTING;
				let hasTextNodes = false;
				for (let i = 0; i < nodesLength; i++) {
					const node = nodes[i];
					const textContentSize = node.getTextContentSize();
					if ($isTextNode(node) && textContentSize !== 0 && !(i === 0 && node.__key === startKey && startOffset === textContentSize || i === nodesLength - 1 && node.__key === endKey && endOffset === 0)) {
						hasTextNodes = true;
						combinedFormat &= node.getFormat();
						if (combinedFormat === 0) break;
					}
				}
				selection.format = hasTextNodes ? combinedFormat : 0;
			}
		}
		$dispatchSelectionChangeCommand(editor, selection, selection !== null && (selection.dirty || !$isRangeSelection(selection)));
	});
}
function $updateSelectionFormatStyle(selection, format, style) {
	if (selection.format !== format || selection.style !== style) {
		selection.format = format;
		selection.style = style;
		selection.dirty = true;
	}
}
function $updateSelectionFormatStyleFromTextNode(selection, node) {
	$updateSelectionFormatStyle(selection, node.getFormat(), node.getStyle());
}
function $updateSelectionFormatStyleFromElementNode(selection, node) {
	$updateSelectionFormatStyle(selection, node.getTextFormat(), node.getTextStyle());
}
function onClick(event, editor) {
	updateEditorSync(editor, () => {
		const selection = $getSelection();
		const domSelection = getDOMSelection(getWindow(editor));
		const lastSelection = $getPreviousSelection();
		if (domSelection) {
			if ($isRangeSelection(selection)) {
				const anchor = selection.anchor;
				const anchorNode = anchor.getNode();
				if (anchor.type === "element" && anchor.offset === 0 && selection.isCollapsed() && !$isRootNode(anchorNode) && $getRoot().getChildrenSize() === 1 && anchorNode.getTopLevelElementOrThrow().isEmpty() && lastSelection !== null && selection.is(lastSelection)) {
					domSelection.removeAllRanges();
					selection.dirty = true;
				}
			} else if (event.pointerType === "touch" || event.pointerType === "pen") {
				const domAnchorNode = getDOMSelectionPoints(domSelection, editor._rootElement).anchorNode;
				if (isHTMLElement(domAnchorNode) || isDOMTextNode(domAnchorNode)) $setSelection($internalCreateRangeSelection(lastSelection, domSelection, editor, event));
			}
		}
		if (IS_FIREFOX && domSelection !== null && domSelection.rangeCount === 0) {
			const rootElement = editor._rootElement;
			if (rootElement !== null && event.target === rootElement) {
				const clientY = event.clientY;
				let offset = rootElement.childNodes.length;
				for (let i = 0; i < rootElement.childNodes.length; i++) {
					const child = rootElement.childNodes[i];
					if (isHTMLElement(child)) {
						const rect = child.getBoundingClientRect();
						if (clientY <= (rect.top + rect.bottom) / 2) {
							offset = i;
							break;
						}
					}
				}
				domSelection.setBaseAndExtent(rootElement, offset, rootElement, offset);
				const newSelection = $internalCreateRangeSelection(lastSelection, domSelection, editor, event);
				if (newSelection !== null) $setSelection(newSelection);
				else domSelection.removeAllRanges();
			}
		}
		dispatchCommand(editor, CLICK_COMMAND, event);
	});
}
function onPointerDown(event, editor) {
	const target = getComposedEventTarget(event);
	const pointerType = event.pointerType;
	if (isDOMNode(target) && pointerType !== "touch" && pointerType !== "pen" && event.button === 0) updateEditorSync(editor, () => {
		if (!isDOMCapturingSelection(target, editor)) editor._inputState.isSelectionChangeFromMouseDown = true;
	});
}
function getTargetRange(event) {
	if (!event.getTargetRanges) return null;
	const targetRanges = event.getTargetRanges();
	if (targetRanges.length === 0) return null;
	return targetRanges[0];
}
function $maybeMoveSelectionPastTrailingAcceptanceBoundary(insertedText) {
	const { lastKeyCode } = getActiveEditor()._inputState;
	if (insertedText == null || insertedText.length <= 1 || lastKeyCode == null) return;
	const characterToSearchFor = lastKeyCode.length === 1 ? lastKeyCode : lastKeyCode === "Enter" ? "\n" : lastKeyCode === "Tab" ? "	" : null;
	if (!characterToSearchFor) return;
	const selection = $getSelection();
	if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;
	const anchorNode = selection.anchor.getNode();
	if (!$isTextNode(anchorNode)) return;
	const { offset } = selection.anchor;
	if (anchorNode.getTextContentSize() === offset) {
		const nextSibling = anchorNode.getNextSibling();
		if (characterToSearchFor === "\n") {
			if (IS_IOS) return;
			if ($isLineBreakNode(nextSibling)) nextSibling.selectEnd();
			else if (!nextSibling) {
				const block = $findMatchingParent(anchorNode, $isBlockElementNode);
				const nextBlock = block && block.getNextSibling();
				if ($isElementNode(nextBlock)) nextBlock.selectStart();
			}
		} else if (characterToSearchFor === "	") {
			if ($isTabNode(nextSibling)) nextSibling.selectEnd();
		} else if ($isTextNode(nextSibling) && nextSibling.getTextContent()[0] === characterToSearchFor) nextSibling.select(1, 1);
	} else if (anchorNode.getTextContent()[offset] === characterToSearchFor) anchorNode.select(offset + 1, offset + 1);
}
function $canRemoveText(anchorNode, focusNode) {
	return anchorNode !== focusNode || $isElementNode(anchorNode) || $isElementNode(focusNode) || !$isTokenOrTab(anchorNode) || !$isTokenOrTab(focusNode);
}
function isPossiblyAndroidKeyPress(inputState, timeStamp) {
	return inputState.lastKeyCode === "MediaLast" && timeStamp < inputState.lastKeyDownTimeStamp + ANDROID_COMPOSITION_LATENCY;
}
function clearHandledSelectionCommandInsertText(inputState) {
	inputState.isInsertTextAfterHandledSelectionCommand = false;
	if (inputState.handledSelectionCommandTimeoutId !== null) {
		clearTimeout(inputState.handledSelectionCommandTimeoutId);
		inputState.handledSelectionCommandTimeoutId = null;
	}
}
function markHandledSelectionCommandInsertText(inputState) {
	if (!IS_APPLE || IS_IOS || !IS_CHROME) return;
	clearHandledSelectionCommandInsertText(inputState);
	inputState.isInsertTextAfterHandledSelectionCommand = true;
	inputState.handledSelectionCommandTimeoutId = setTimeout(() => clearHandledSelectionCommandInsertText(inputState), 0);
}
function registerDefaultCommandHandlers(editor) {
	editor.registerCommand(BEFORE_INPUT_COMMAND, $handleBeforeInput, 0);
	editor.registerCommand(INPUT_COMMAND, $handleInput, 0);
	editor.registerCommand(COMPOSITION_START_COMMAND, $handleCompositionStart, 0);
	editor.registerCommand(COMPOSITION_END_COMMAND, $handleCompositionEnd, 0);
	editor.registerCommand(KEY_DOWN_COMMAND, $handleKeyDown, 0);
}
/**
* Returns true when a `beforeinput` / `input` event belongs to a native
* control (e.g. an `<input>` or `<textarea>`, or any other subtree marked with
* `setDOMUnmanaged({captureSelection: true})`) inside a decorator whose
* selection is owned by the browser rather than managed by Lexical. Turning
* such an event into a Lexical command would insert text into the editor
* instead of the focused control.
*
* Two signals are checked because Firefox 152 changed how it dispatches
* `beforeinput` for these controls (#8738): the event is retargeted off of the
* focused control, so its composed target no longer points at it. The deep
* active element still does, and is used as a fallback.
*/
function isInputEventTargetingCapturedSelection(event, editor) {
	const composedTarget = getComposedEventTarget(event);
	if (isHTMLElement(composedTarget) && isDOMCapturingSelection(composedTarget, editor)) return true;
	const rootElement = editor.getRootElement();
	if (rootElement === null) return false;
	const activeElement = getActiveElementDeep(rootElement.ownerDocument);
	return activeElement !== null && rootElement.contains(activeElement) && isDOMCapturingSelection(activeElement, editor);
}
function onBeforeInput(event, editor) {
	const inputType = event.inputType;
	if (inputType === "deleteCompositionText" || IS_FIREFOX && isFirefoxClipboardEvents(editor)) return;
	else if (inputType === "insertCompositionText") return;
	updateEditorSync(editor, () => {
		if (!isInputEventTargetingCapturedSelection(event, editor)) dispatchCommand(editor, BEFORE_INPUT_COMMAND, event);
	}, { event });
}
function $handleBeforeInput(event) {
	const inputType = event.inputType;
	const targetRange = getTargetRange(event);
	const editor = getActiveEditor();
	const inputState = editor._inputState;
	const selection = $getSelection();
	if (inputType === "insertText" && event.data && inputState.isInsertTextAfterHandledSelectionCommand) {
		clearHandledSelectionCommandInsertText(inputState);
		event.preventDefault();
		if ($isRangeSelection(selection) && !selection.isCollapsed()) {
			const point = selection.isBackward() ? selection.anchor : selection.focus;
			selection.anchor.set(point.key, point.offset, point.type);
			selection.focus.set(point.key, point.offset, point.type);
		}
		return true;
	}
	if (inputType === "deleteContentBackward") {
		if (selection === null) {
			const prevSelection = $getPreviousSelection();
			if (!$isRangeSelection(prevSelection)) return true;
			$setSelection(prevSelection.clone());
		}
		if ($isRangeSelection(selection)) {
			const isSelectionAnchorSameAsFocus = selection.anchor.key === selection.focus.key;
			if (isPossiblyAndroidKeyPress(inputState, event.timeStamp) && editor.isComposing() && isSelectionAnchorSameAsFocus) {
				$setCompositionKey(null);
				inputState.lastKeyDownTimeStamp = 0;
				setTimeout(() => {
					updateEditorSync(editor, () => {
						$setCompositionKey(null);
					});
				}, ANDROID_COMPOSITION_LATENCY);
				if ($isRangeSelection(selection)) {
					const anchorNode = selection.anchor.getNode();
					anchorNode.markDirty();
					invariant($isTextNode(anchorNode), "Anchor node must be a TextNode");
					$updateSelectionFormatStyleFromTextNode(selection, anchorNode);
				}
			} else {
				$setCompositionKey(null);
				if (IS_IOS && targetRange !== null && !targetRange.collapsed) {
					selection.applyDOMRange(targetRange);
					if (!selection.isCollapsed()) {
						event.preventDefault();
						selection.removeText();
						return true;
					}
				}
				event.preventDefault();
				const selectedNode = selection.anchor.getNode();
				const selectedNodeText = selectedNode.getTextContent();
				const selectedNodeCanInsertTextAfter = selectedNode.canInsertTextAfter();
				const hasSelectedAllTextInNode = selection.anchor.offset === 0 && selection.focus.offset === selectedNodeText.length;
				let shouldLetBrowserHandleDelete = IS_ANDROID_CHROME && isSelectionAnchorSameAsFocus && !hasSelectedAllTextInNode && selectedNodeCanInsertTextAfter;
				if (shouldLetBrowserHandleDelete && selection.isCollapsed()) shouldLetBrowserHandleDelete = !$isDecoratorNode($getAdjacentNode(selection.anchor, true));
				if (!shouldLetBrowserHandleDelete) {
					dispatchCommand(editor, DELETE_CHARACTER_COMMAND, true);
					const selectionAfterDelete = $getSelection();
					if (IS_ANDROID_CHROME && $isRangeSelection(selectionAfterDelete) && selectionAfterDelete.isCollapsed()) {
						inputState.postDeleteSelectionToRestore = selectionAfterDelete;
						setTimeout(() => inputState.postDeleteSelectionToRestore = null);
					}
				}
			}
			return true;
		}
	}
	if (!$isRangeSelection(selection)) {
		if (inputType === "historyUndo" || inputType === "historyRedo") {
			event.preventDefault();
			dispatchCommand(editor, inputType === "historyUndo" ? UNDO_COMMAND : REDO_COMMAND);
		}
		return true;
	}
	const data = event.data;
	if (inputState.unprocessedBeforeInputData !== null) $updateSelectedTextFromDOM(false, editor, inputState.unprocessedBeforeInputData);
	if ((!selection.dirty || inputState.unprocessedBeforeInputData !== null) && selection.isCollapsed() && !$isRootNode(selection.anchor.getNode()) && targetRange !== null) selection.applyDOMRange(targetRange);
	inputState.unprocessedBeforeInputData = null;
	const anchor = selection.anchor;
	const focus = selection.focus;
	const anchorNode = anchor.getNode();
	const focusNode = focus.getNode();
	if (inputType === "insertText" || inputType === "insertTranspose") {
		if (data === "\n") {
			event.preventDefault();
			dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND, false);
		} else if (data === "\n\n") {
			event.preventDefault();
			dispatchCommand(editor, INSERT_PARAGRAPH_COMMAND);
		} else if (data == null && event.dataTransfer) {
			const text = event.dataTransfer.getData("text/plain");
			event.preventDefault();
			selection.insertRawText(text);
		} else if (data != null && $shouldPreventDefaultAndInsertText(selection, targetRange, data, event.timeStamp, true)) {
			event.preventDefault();
			dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, data);
			$maybeMoveSelectionPastTrailingAcceptanceBoundary(data);
		} else inputState.unprocessedBeforeInputData = data;
		inputState.lastBeforeInputInsertTextTimeStamp = event.timeStamp;
		return true;
	}
	event.preventDefault();
	switch (inputType) {
		case "insertFromYank":
		case "insertFromDrop":
		case "insertReplacementText":
			dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, event);
			$maybeMoveSelectionPastTrailingAcceptanceBoundary((event.dataTransfer ? event.dataTransfer.getData("text/plain") : null) ?? event.data);
			break;
		case "insertFromComposition": {
			const skipRedundantInsert = inputState.hadOrphanedCompositionEvents;
			inputState.hadOrphanedCompositionEvents = false;
			const prevCompositionKey = editor._compositionKey;
			$setCompositionKey(null);
			if (!skipRedundantInsert) dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, event);
			$cleanupComposedSubclass(prevCompositionKey);
			break;
		}
		case "insertLineBreak":
			$setCompositionKey(null);
			inputState.isInsertLineBreak = false;
			dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND, false);
			break;
		case "insertParagraph":
			$setCompositionKey(null);
			if (inputState.isInsertLineBreak) {
				inputState.isInsertLineBreak = false;
				dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND, false);
			} else dispatchCommand(editor, INSERT_PARAGRAPH_COMMAND);
			break;
		case "insertFromPaste":
		case "insertFromPasteAsQuotation":
			dispatchCommand(editor, PASTE_COMMAND, event);
			break;
		case "deleteByComposition":
			if ($canRemoveText(anchorNode, focusNode)) dispatchCommand(editor, REMOVE_TEXT_COMMAND, event);
			break;
		case "deleteByDrag":
			$addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
			dispatchCommand(editor, REMOVE_TEXT_COMMAND, event);
			break;
		case "deleteByCut":
			dispatchCommand(editor, REMOVE_TEXT_COMMAND, event);
			break;
		case "deleteContent":
			dispatchCommand(editor, DELETE_CHARACTER_COMMAND, false);
			break;
		case "deleteWordBackward":
			dispatchCommand(editor, DELETE_WORD_COMMAND, true);
			break;
		case "deleteWordForward":
			dispatchCommand(editor, DELETE_WORD_COMMAND, false);
			break;
		case "deleteHardLineBackward":
		case "deleteSoftLineBackward":
			dispatchCommand(editor, DELETE_LINE_COMMAND, true);
			break;
		case "deleteContentForward":
		case "deleteHardLineForward":
		case "deleteSoftLineForward":
			dispatchCommand(editor, DELETE_LINE_COMMAND, false);
			break;
		case "formatStrikeThrough":
			dispatchCommand(editor, FORMAT_TEXT_COMMAND, "strikethrough");
			break;
		case "formatBold":
			dispatchCommand(editor, FORMAT_TEXT_COMMAND, "bold");
			break;
		case "formatItalic":
			dispatchCommand(editor, FORMAT_TEXT_COMMAND, "italic");
			break;
		case "formatUnderline":
			dispatchCommand(editor, FORMAT_TEXT_COMMAND, "underline");
			break;
		case "historyUndo":
			dispatchCommand(editor, UNDO_COMMAND);
			break;
		case "historyRedo": dispatchCommand(editor, REDO_COMMAND);
	}
	return true;
}
function onInput(event, editor) {
	event.stopPropagation();
	const inputState = editor._inputState;
	clearHandledSelectionCommandInsertText(inputState);
	updateEditorSync(editor, () => {
		if (!isInputEventTargetingCapturedSelection(event, editor)) editor.dispatchCommand(INPUT_COMMAND, event);
	}, { event });
	inputState.unprocessedBeforeInputData = null;
}
function $handleInput(event) {
	const editor = getActiveEditor();
	const inputState = editor._inputState;
	const selection = $getSelection();
	const data = event.data;
	const targetRange = getTargetRange(event);
	let handled = false;
	if (data != null && $isRangeSelection(selection)) {
		const domSelection = getDOMSelection(getWindow(editor));
		const domSelectionPoints = domSelection !== null ? getDOMSelectionPoints(domSelection, editor._rootElement) : null;
		const isOrphanedCompositionEnd = event.inputType === "insertCompositionText" && inputState.compositionPhase !== "ending-firefox" && !editor.isComposing();
		if (isOrphanedCompositionEnd) inputState.hadOrphanedCompositionEvents = true;
		const inputAnchorNode = selection.anchor.getNode();
		const isCompositionOnToken = event.inputType === "insertCompositionText" && inputState.compositionPhase !== "ending-firefox" && editor.isComposing() && $isTextNode(inputAnchorNode) && $isTokenOrSegmented(inputAnchorNode);
		if (!isOrphanedCompositionEnd && !isCompositionOnToken && $shouldPreventDefaultAndInsertText(selection, targetRange, data, event.timeStamp, false, domSelectionPoints)) {
			handled = true;
			if (inputState.compositionPhase === "ending-firefox") {
				const tokenRedirected = $onCompositionEndImpl(editor, data);
				inputState.compositionPhase = "idle";
				if (tokenRedirected) {
					$addUpdateTag(COMPOSITION_END_TAG);
					$flushMutations();
					return true;
				}
			}
			const anchorNode = selection.anchor.getNode();
			if (domSelection === null || domSelectionPoints === null) return true;
			const isBackward = selection.isBackward();
			const startOffset = isBackward ? selection.anchor.offset : selection.focus.offset;
			const endOffset = isBackward ? selection.focus.offset : selection.anchor.offset;
			if (!CAN_USE_BEFORE_INPUT || selection.isCollapsed() || !$isTextNode(anchorNode) || domSelectionPoints.anchorNode === null || anchorNode.getTextContent().slice(0, startOffset) + data + anchorNode.getTextContent().slice(startOffset + endOffset) !== getAnchorTextFromDOM(domSelectionPoints.anchorNode)) dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, data);
			const textLength = data.length;
			if (IS_FIREFOX && textLength > 1 && event.inputType === "insertCompositionText" && !editor.isComposing()) {
				selection.anchor.offset -= textLength;
				selection._cachedNodes = null;
				selection._cachedIsBackward = null;
			}
			if (IS_ANDROID_CHROME && editor.isComposing()) {
				inputState.lastKeyDownTimeStamp = 0;
				$setCompositionKey(null);
			}
		}
	}
	if (!handled) {
		$updateSelectedTextFromDOM(false, editor, data !== null ? data : void 0);
		if (inputState.compositionPhase === "ending-firefox") {
			$onCompositionEndImpl(editor, data || void 0);
			$addUpdateTag(COMPOSITION_END_TAG);
			inputState.compositionPhase = "idle";
		}
	}
	$flushMutations();
	return true;
}
function onCompositionStart(event, editor) {
	dispatchCommand(editor, COMPOSITION_START_COMMAND, event);
}
function $handleCompositionStart(event) {
	const editor = getActiveEditor();
	const inputState = editor._inputState;
	const selection = $getSelection();
	if ($isRangeSelection(selection) && !editor.isComposing()) {
		inputState.compositionPhase = "composing";
		inputState.hadOrphanedCompositionEvents = false;
		const anchor = selection.anchor;
		const node = selection.anchor.getNode();
		$setCompositionKey(anchor.key);
		$addUpdateTag(COMPOSITION_START_TAG);
		if (event.timeStamp < inputState.lastKeyDownTimeStamp + ANDROID_COMPOSITION_LATENCY || anchor.type === "element" || !selection.isCollapsed() || !IS_ANDROID_CHROME && (node.getFormat() !== selection.format || $isTextNode(node) && node.getStyle() !== selection.style) || $isTextNode(node) && ($isTokenOrSegmented(node) || anchor.offset === 0 && !node.canInsertTextBefore() || anchor.offset === node.getTextContentSize() && !node.canInsertTextAfter())) {
			dispatchCommand(editor, CONTROLLED_TEXT_INSERTION_COMMAND, COMPOSITION_START_CHAR);
			const updatedSelection = $getSelection();
			if ($isRangeSelection(updatedSelection)) $setCompositionKey(updatedSelection.anchor.key);
		}
	}
	return true;
}
function $handleCompositionEnd(event) {
	const editor = getActiveEditor();
	editor._inputState.compositionPhase = "idle";
	$onCompositionEndImpl(editor, event.data);
	$addUpdateTag(COMPOSITION_END_TAG);
	return true;
}
function $cleanupComposedSubclass(compositionKey) {
	if (compositionKey === null) return;
	const composedNode = $getNodeByKey(compositionKey);
	if (!$isTextNode(composedNode) || composedNode.getType() === "text" || $isTokenOrSegmented(composedNode) || !composedNode.isAttached()) return;
	const sel = $getSelection();
	const offset = $isRangeSelection(sel) && sel.anchor.key === compositionKey ? sel.anchor.offset : null;
	const replacement = $createTextNode(composedNode.getTextContent());
	replacement.setFormat(composedNode.getFormat());
	replacement.setStyle(composedNode.getStyle());
	composedNode.replace(replacement);
	if (offset !== null) {
		const safeOffset = Math.min(offset, replacement.getTextContentSize());
		replacement.select(safeOffset, safeOffset);
	}
}
function $onCompositionEndImpl(editor, data) {
	const compositionKey = editor._compositionKey;
	$setCompositionKey(null);
	if (compositionKey !== null && data != null) {
		if (data === "") {
			const node = $getNodeByKey(compositionKey);
			const domElement = editor.getElementByKey(compositionKey);
			const textNode = domElement !== null && $isTextNode(node) ? $getDOMTextNode(node, domElement, editor) : null;
			if (textNode !== null && textNode.nodeValue !== null && $isTextNode(node)) {
				const domSelection = getDOMSelection(getWindow(editor));
				const domSelectionPoints = domSelection && getDOMSelectionPoints(domSelection, editor._rootElement);
				let anchorOffset = null;
				let focusOffset = null;
				if (domSelectionPoints !== null && domSelectionPoints.anchorNode === textNode) {
					anchorOffset = domSelectionPoints.anchorOffset;
					focusOffset = domSelectionPoints.focusOffset;
				}
				$updateTextNodeFromDOMContent(node, textNode.nodeValue, anchorOffset, focusOffset, true);
			}
			$cleanupComposedSubclass(compositionKey);
			return false;
		} else if (data[data.length - 1] === "\n") {
			const selection = $getSelection();
			if ($isRangeSelection(selection) || $isNodeSelection(selection)) {
				if ($isRangeSelection(selection)) {
					const focus = selection.focus;
					selection.anchor.set(focus.key, focus.offset, focus.type);
				}
				dispatchCommand(editor, KEY_ENTER_COMMAND, null);
				$cleanupComposedSubclass(compositionKey);
				return false;
			}
		}
		const node = $getNodeByKey(compositionKey);
		if (node !== null && $isTextNode(node) && $isTokenOrSegmented(node)) {
			node.markDirty();
			const selection = $getSelection();
			const textLen = node.getTextContentSize();
			const offset = $isRangeSelection(selection) && selection.anchor.key === compositionKey ? selection.anchor.offset : textLen;
			node.select(offset, offset).insertText(data);
			return true;
		}
	}
	$updateSelectedTextFromDOM(true, editor, data);
	$cleanupComposedSubclass(compositionKey);
	return false;
}
function onCompositionEnd(event, editor) {
	const inputState = editor._inputState;
	if (IS_FIREFOX) inputState.compositionPhase = "ending-firefox";
	else if (!IS_IOS && (IS_SAFARI || IS_APPLE_WEBKIT)) {
		inputState.compositionPhase = "ending-safari";
		inputState.compositionEndData = event.data;
	} else dispatchCommand(editor, COMPOSITION_END_COMMAND, event);
}
function onKeyDown(event, editor) {
	const inputState = editor._inputState;
	if (IS_IOS) inputState.isShiftKeyDown = event.key === "Shift" || inputState.isShiftKeyDown && event.shiftKey && event.key !== "CapsLock";
	inputState.lastKeyDownTimeStamp = event.timeStamp;
	inputState.lastKeyCode = event.key;
	if (event.key !== "Backspace") clearHandledSelectionCommandInsertText(inputState);
	if (editor.isComposing()) return;
	dispatchCommand(editor, KEY_DOWN_COMMAND, event);
}
function onKeyUp(event, editor) {
	if (!event.shiftKey || event.key === "CapsLock") editor._inputState.isShiftKeyDown = false;
}
var ANY_MODIFIERS = {
	altKey: "any",
	ctrlKey: "any",
	metaKey: "any",
	shiftKey: "any"
};
var CTRL_KEY = { ctrlKey: true };
var META_KEY = { metaKey: true };
var SHIFT_KEY_ANY = { shiftKey: "any" };
var ALT_SHIFT_KEY_ANY = {
	altKey: "any",
	shiftKey: "any"
};
/**
* The keydown shortcuts that the editor handles natively, compiled to
* dispatch by the pressed key and modifiers in O(1). Each shortcut's mask
* is exclusive of every other mask on the same key, so at most one entry
* matches any given event.
*/
function buildKeyDownShortcuts() {
	/** Dispatch the command with the KeyboardEvent as its payload */
	const dispatch = (key, modifiers, command) => ({
		key,
		modifiers,
		onMatch: (event, editor) => {
			dispatchCommand(editor, command, event);
		}
	});
	/** preventDefault() and dispatch the command with a fixed payload */
	const prevent = (key, modifiers, command, payload) => ({
		key,
		modifiers,
		onMatch: (event, editor) => {
			event.preventDefault();
			dispatchCommand(editor, command, payload);
		}
	});
	const enter = (modifiers, isInsertLineBreak) => ({
		key: "Enter",
		modifiers,
		onMatch: (event, editor) => {
			const inputState = editor._inputState;
			inputState.isInsertLineBreak = isInsertLineBreak && (!IS_IOS || inputState.isShiftKeyDown);
			dispatchCommand(editor, KEY_ENTER_COMMAND, event);
			if (event.defaultPrevented) inputState.isInsertLineBreak = false;
		}
	});
	const copyOrCut = (key, command) => ({
		key,
		modifiers: CONTROL_OR_META,
		onMatch: (event, editor) => {
			const prevSelection = editor._editorState._selection;
			if (prevSelection !== null && !$isRangeSelection(prevSelection)) {
				event.preventDefault();
				dispatchCommand(editor, command, event);
			}
		}
	});
	return [
		dispatch("ArrowRight", SHIFT_KEY_ANY, KEY_ARROW_RIGHT_COMMAND),
		dispatch("ArrowLeft", SHIFT_KEY_ANY, KEY_ARROW_LEFT_COMMAND),
		dispatch("ArrowUp", ALT_SHIFT_KEY_ANY, KEY_ARROW_UP_COMMAND),
		dispatch("ArrowDown", ALT_SHIFT_KEY_ANY, KEY_ARROW_DOWN_COMMAND),
		enter({
			...ANY_MODIFIERS,
			shiftKey: true
		}, true),
		enter({
			...ANY_MODIFIERS,
			shiftKey: false
		}, false),
		dispatch(" ", ANY_MODIFIERS, KEY_SPACE_COMMAND),
		{
			key: "Backspace",
			modifiers: SHIFT_KEY_ANY,
			onMatch: (event, editor) => {
				if (dispatchCommand(editor, KEY_BACKSPACE_COMMAND, event)) markHandledSelectionCommandInsertText(editor._inputState);
			}
		},
		dispatch("Escape", ANY_MODIFIERS, KEY_ESCAPE_COMMAND),
		dispatch("Delete", {}, KEY_DELETE_COMMAND),
		prevent("Backspace", CONTROL_OR_ALT, DELETE_WORD_COMMAND, true),
		prevent("Delete", CONTROL_OR_ALT, DELETE_WORD_COMMAND, false),
		prevent("b", CONTROL_OR_META, FORMAT_TEXT_COMMAND, "bold"),
		prevent("u", CONTROL_OR_META, FORMAT_TEXT_COMMAND, "underline"),
		prevent("i", CONTROL_OR_META, FORMAT_TEXT_COMMAND, "italic"),
		dispatch("Tab", SHIFT_KEY_ANY, KEY_TAB_COMMAND),
		prevent("z", CONTROL_OR_META, UNDO_COMMAND, void 0),
		prevent("z", {
			...CONTROL_OR_META,
			shiftKey: true
		}, REDO_COMMAND, void 0),
		...IS_APPLE ? [
			{
				key: "o",
				modifiers: CTRL_KEY,
				onMatch: (event, editor) => {
					event.preventDefault();
					dispatchCommand(editor, INSERT_LINE_BREAK_COMMAND, true);
				}
			},
			dispatch("ArrowLeft", {
				metaKey: true,
				...SHIFT_KEY_ANY
			}, MOVE_TO_START),
			dispatch("ArrowRight", {
				metaKey: true,
				...SHIFT_KEY_ANY
			}, MOVE_TO_END),
			prevent("h", CTRL_KEY, DELETE_CHARACTER_COMMAND, true),
			prevent("d", CTRL_KEY, DELETE_CHARACTER_COMMAND, false),
			prevent("Backspace", META_KEY, DELETE_LINE_COMMAND, true),
			prevent("Delete", META_KEY, DELETE_LINE_COMMAND, false),
			prevent("k", CTRL_KEY, DELETE_LINE_COMMAND, false)
		] : [
			dispatch("Home", SHIFT_KEY_ANY, MOVE_TO_START),
			dispatch("End", SHIFT_KEY_ANY, MOVE_TO_END),
			prevent("y", CTRL_KEY, REDO_COMMAND, void 0)
		],
		{
			key: "a",
			modifiers: CONTROL_OR_META,
			onMatch: (event, editor) => {
				event.preventDefault();
				if (dispatchCommand(editor, SELECT_ALL_COMMAND, event)) markHandledSelectionCommandInsertText(editor._inputState);
			}
		},
		copyOrCut("c", COPY_COMMAND),
		copyOrCut("x", CUT_COMMAND)
	];
}
function $handleKeyDown(event) {
	const editor = getActiveEditor();
	const inputState = editor._inputState;
	if (event.key == null) return true;
	if (inputState.compositionPhase === "ending-safari") {
		const isBack = isBackspace(event);
		if (isBack) updateEditorSync(editor, () => {
			$onCompositionEndImpl(editor, inputState.compositionEndData);
		});
		inputState.compositionPhase = "idle";
		inputState.compositionEndData = "";
		if (isBack) return true;
	}
	let keyDownShortcuts = editor._keyDownShortcuts;
	if (keyDownShortcuts === null) {
		keyDownShortcuts = compileKeyboardShortcuts(buildKeyDownShortcuts());
		editor._keyDownShortcuts = keyDownShortcuts;
	}
	const shortcut = keyDownShortcuts.match(event);
	if (shortcut) shortcut.onMatch(event, editor);
	if (isModifier(event)) editor.dispatchCommand(KEY_MODIFIER_COMMAND, event);
	return true;
}
function getRootElementRemoveHandles(rootElement) {
	let eventHandles = rootElement.__lexicalEventHandles;
	if (eventHandles === void 0) {
		eventHandles = [];
		rootElement.__lexicalEventHandles = eventHandles;
	}
	return eventHandles;
}
var activeNestedEditorsMap = /* @__PURE__ */ new Map();
function onDocumentSelectionChange(event) {
	const domSelection = getDOMSelectionFromTarget(event.target);
	if (domSelection === null) return;
	const ownerDocument = getDOMOwnerDocument(event.target);
	let nextActiveEditor = null;
	let resolvedAnchorNode = null;
	const registration = ownerDocument !== null ? documentRegistrations.get(ownerDocument) : void 0;
	if (ownerDocument !== null) {
		if (registration !== void 0) {
			const editorsForDoc = registration.editors;
			let hasShadow = registration.hasShadowEditor;
			if (hasShadow === void 0) {
				hasShadow = false;
				for (const ed of editorsForDoc) if (ed._rootElement !== null && isDOMShadowRoot(ed._rootElement.getRootNode())) {
					hasShadow = true;
					break;
				}
				registration.hasShadowEditor = hasShadow;
			}
			if (!hasShadow) {
				const anchorNode = domSelection.anchorNode;
				if (anchorNode !== null && !(isHTMLElement(anchorNode) && anchorNode.shadowRoot !== null)) {
					nextActiveEditor = getNearestEditorFromDOMNode(anchorNode);
					if (nextActiveEditor !== null) resolvedAnchorNode = anchorNode;
				}
			} else {
				let deferredLightEditor = null;
				let deferredLightAnchor = null;
				for (const candidate of editorsForDoc) {
					const candidateRoot = candidate._rootElement;
					if (candidateRoot === null) continue;
					const anchorNode = getDOMSelectionPoints(domSelection, candidateRoot).anchorNode;
					if (anchorNode === null) continue;
					if (getNearestEditorFromDOMNode(anchorNode) !== candidate) continue;
					if (isDOMShadowRoot(candidateRoot.getRootNode())) {
						nextActiveEditor = candidate;
						resolvedAnchorNode = anchorNode;
						break;
					}
					if (deferredLightEditor === null) {
						deferredLightEditor = candidate;
						deferredLightAnchor = anchorNode;
					}
				}
				if (nextActiveEditor === null && deferredLightEditor !== null) {
					nextActiveEditor = deferredLightEditor;
					resolvedAnchorNode = deferredLightAnchor;
				}
			}
		}
		if (nextActiveEditor === null) {
			const activeElement = getActiveElementDeep(ownerDocument);
			nextActiveEditor = activeElement !== null ? getNearestEditorFromDOMNode(activeElement) : null;
		}
	}
	if (nextActiveEditor === null) return;
	if (nextActiveEditor._inputState.isSelectionChangeFromMouseDown) {
		if (registration !== void 0) for (const ed of registration.editors) ed._inputState.isSelectionChangeFromMouseDown = false;
		updateEditorSync(nextActiveEditor, () => {
			const lastSelection = $getPreviousSelection();
			const domAnchorNode = resolvedAnchorNode ?? getDOMSelectionPoints(domSelection, nextActiveEditor._rootElement).anchorNode;
			if (isHTMLElement(domAnchorNode) || isDOMTextNode(domAnchorNode)) $setSelection($internalCreateRangeSelection(lastSelection, domSelection, nextActiveEditor, event));
		});
	}
	const editors = getEditorsToPropagate(nextActiveEditor);
	const rootEditor = editors[editors.length - 1];
	const rootEditorKey = rootEditor._key;
	const activeNestedEditor = activeNestedEditorsMap.get(rootEditorKey);
	const prevActiveEditor = activeNestedEditor || rootEditor;
	if (prevActiveEditor !== nextActiveEditor) onSelectionChange(domSelection, prevActiveEditor, false);
	onSelectionChange(domSelection, nextActiveEditor, true);
	if (nextActiveEditor !== rootEditor) activeNestedEditorsMap.set(rootEditorKey, nextActiveEditor);
	else if (activeNestedEditor) activeNestedEditorsMap.delete(rootEditorKey);
}
/** @internal */
function stopLexicalPropagation(event) {
	event._lexicalHandled = true;
}
function hasStoppedLexicalPropagation(event) {
	return event._lexicalHandled === true;
}
function addRootElementEvents(rootElement, editor) {
	const doc = rootElement.ownerDocument;
	rootElementToDocument.set(rootElement, doc);
	let registration = documentRegistrations.get(doc);
	if (registration === void 0) {
		registration = {
			editors: /* @__PURE__ */ new Set(),
			hasShadowEditor: void 0
		};
		documentRegistrations.set(doc, registration);
	}
	registration.editors.add(editor);
	registration.hasShadowEditor = void 0;
	rootElement.__lexicalEditor = editor;
	const removeHandles = getRootElementRemoveHandles(rootElement);
	removeHandles.push(documentSelectionChange.register(doc));
	const events = getRootElementEvents();
	for (let i = 0; i < events.length; i++) {
		const [eventName, onEvent] = events[i];
		const eventHandler = typeof onEvent === "function" ? (event) => {
			if (hasStoppedLexicalPropagation(event)) return;
			stopLexicalPropagation(event);
			if (editor.isEditable() || eventName === "click") onEvent(event, editor);
		} : (event) => {
			if (hasStoppedLexicalPropagation(event)) return;
			stopLexicalPropagation(event);
			const isEditable = editor.isEditable();
			switch (eventName) {
				case "cut": return isEditable && dispatchCommand(editor, CUT_COMMAND, event);
				case "copy": return dispatchCommand(editor, COPY_COMMAND, event);
				case "paste": return isEditable && dispatchCommand(editor, PASTE_COMMAND, event);
				case "dragstart": return isEditable && dispatchCommand(editor, DRAGSTART_COMMAND, event);
				case "dragover": return isEditable && dispatchCommand(editor, DRAGOVER_COMMAND, event);
				case "dragend": return isEditable && dispatchCommand(editor, DRAGEND_COMMAND, event);
				case "focus": return isEditable && dispatchCommand(editor, FOCUS_COMMAND, event);
				case "blur":
					editor._inputState.isShiftKeyDown = false;
					editor._inputState.isInsertLineBreak = false;
					return isEditable && dispatchCommand(editor, BLUR_COMMAND, event);
				case "drop": return isEditable && dispatchCommand(editor, DROP_COMMAND, event);
			}
		};
		removeHandles.push(registerEventListener(rootElement, eventName, eventHandler));
	}
}
var rootElementNotRegisteredWarning = warnOnlyOnce("Root element not registered");
function removeRootElementEvents(rootElement) {
	const doc = rootElementToDocument.get(rootElement);
	if (doc === void 0) {
		rootElementNotRegisteredWarning();
		return;
	}
	const registration = documentRegistrations.get(doc);
	if (registration === void 0) {
		rootElementNotRegisteredWarning();
		return;
	}
	rootElementToDocument.delete(rootElement);
	const editor = getEditorPropertyFromDOMNode(rootElement);
	if (isLexicalEditor(editor)) {
		cleanActiveNestedEditorsMap(editor);
		registration.editors.delete(editor);
		registration.hasShadowEditor = void 0;
		rootElement.__lexicalEditor = null;
	} else if (editor) invariant(false, "Attempted to remove event handlers from a node that does not belong to this build of Lexical");
	const removeHandles = getRootElementRemoveHandles(rootElement);
	for (let i = 0; i < removeHandles.length; i++) removeHandles[i]();
	rootElement.__lexicalEventHandles = [];
}
function cleanActiveNestedEditorsMap(editor) {
	if (editor._parentEditor !== null) {
		const editors = getEditorsToPropagate(editor);
		const rootEditorKey = editors[editors.length - 1]._key;
		if (activeNestedEditorsMap.get(rootEditorKey) === editor) activeNestedEditorsMap.delete(rootEditorKey);
	} else activeNestedEditorsMap.delete(editor._key);
}
/** @internal */
function markSelectionChangeFromDOMUpdate(editor, anchorNode, anchorOffset, focusNode, focusOffset) {
	const inputState = editor._inputState;
	inputState.isSelectionChangeFromDOMUpdate = true;
	inputState.selectionChangeFromDOMUpdatePoints = anchorNode !== void 0 && anchorOffset !== void 0 && focusNode !== void 0 && focusOffset !== void 0 ? {
		anchorNode,
		anchorOffset,
		focusNode,
		focusOffset
	} : null;
}
/** @internal */
function markCollapsedSelectionFormat(editor, format, style, offset, key, timeStamp) {
	editor._inputState.collapsedSelectionFormat = {
		format,
		key,
		offset,
		style,
		timeStamp
	};
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalNode.ts
function $removeNode(nodeToRemove, restoreSelection, preserveEmptyParent) {
	errorOnReadOnly();
	const key = nodeToRemove.__key;
	const parent = nodeToRemove.getParent();
	if (parent === null) {
		invariant($getSlotHostKey(nodeToRemove) === null, "$removeNode: node %s is slotted into host %s; use removeSlot on the host instead of remove().", key, String($getSlotHostKey(nodeToRemove)));
		return;
	}
	const selection = $maybeMoveChildrenSelectionToParent(nodeToRemove);
	let selectionMoved = false;
	if ($isRangeSelection(selection) && restoreSelection) {
		const anchor = selection.anchor;
		const focus = selection.focus;
		if (anchor.key === key) {
			moveSelectionPointToSibling(anchor, nodeToRemove, parent, nodeToRemove.getPreviousSibling(), nodeToRemove.getNextSibling());
			selectionMoved = true;
		}
		if (focus.key === key) {
			moveSelectionPointToSibling(focus, nodeToRemove, parent, nodeToRemove.getPreviousSibling(), nodeToRemove.getNextSibling());
			selectionMoved = true;
		}
	} else if ($isNodeSelection(selection) && restoreSelection && nodeToRemove.isSelected()) nodeToRemove.selectPrevious();
	if ($isRangeSelection(selection) && restoreSelection && !selectionMoved && $selectionTouchesElement(selection, parent)) {
		const index = nodeToRemove.getIndexWithinParent();
		$removeFromParent(nodeToRemove);
		$updateElementSelectionOnCreateDeleteNode(selection, parent, index, -1);
	} else $removeFromParent(nodeToRemove);
	if (!preserveEmptyParent && !$isRootOrShadowRoot(parent) && !parent.canBeEmpty() && parent.isEmpty()) $removeNode(parent, restoreSelection);
	if (restoreSelection && selection && $isRootNode(parent) && parent.isEmpty()) parent.selectEnd();
}
/**
* An identity function that will infer the type of DOM nodes
* based on tag names to make it easier to construct a
* DOMConversionMap.
*/
function buildImportMap(importMap) {
	return importMap;
}
var EPHEMERAL = Symbol.for("ephemeral");
/**
* @internal
* @param node any LexicalNode
* @returns true if the node was created with {@link $cloneWithPropertiesEphemeral}
*/
function $isEphemeral(node) {
	return node[EPHEMERAL] || false;
}
/**
* @internal
* Mark this node as ephemeral, its instance always returns this
* for getLatest and getWritable. It must not be added to an EditorState.
*/
function $markEphemeral(node) {
	node[EPHEMERAL] = true;
	return node;
}
/** @internal */
var NON_ENUMERABLE_PROP_DESC = {
	configurable: true,
	enumerable: false,
	value: void 0,
	writable: true
};
var LexicalNode = class {
	/** @internal */
	__type;
	/** @internal */
	__key;
	/** @internal */
	__parent;
	/** @internal */
	__prev;
	/** @internal */
	__next;
	/** @internal */
	__state;
	/**
	* Returns the string type of this node. Every node must
	* implement this and it MUST BE UNIQUE amongst nodes registered
	* on the editor.
	*
	*/
	static getType() {
		const { ownNodeType } = getStaticNodeConfig(this);
		invariant(ownNodeType !== void 0, "LexicalNode: Node %s does not implement .getType().", this.name);
		return ownNodeType;
	}
	/**
	* Clones this node, creating a new node with a different key
	* and adding it to the EditorState (but not attaching it anywhere!). All nodes must
	* implement this method.
	*
	*/
	static clone(_data) {
		invariant(false, "LexicalNode: Node %s does not implement .clone().", this.name);
	}
	/**
	* Override this to implement the new static node configuration protocol,
	* this method is called directly on the prototype and must not depend
	* on anything initialized in the constructor. Generally it should be
	* a trivial implementation.
	*
	* @example
	* ```ts
	* class MyNode extends TextNode {
	*   $config() {
	*     return this.config('my-node', {extends: TextNode});
	*   }
	* }
	* ```
	*/
	$config() {
		return {};
	}
	config(type, config) {
		const parentKlass = config.extends || getSuperclassOf(this.constructor);
		Object.assign(config, { extends: parentKlass });
		if (typeof type === "string") Object.assign(config, { type });
		return { [type]: config };
	}
	/**
	* Perform any state updates on the clone of prevNode that are not already
	* handled by the constructor call in the static clone method. If you have
	* state to update in your clone that is not handled directly by the
	* constructor, it is advisable to override this method but it is required
	* to include a call to `super.afterCloneFrom(prevNode)` in your
	* implementation. This is only intended to be called by
	* {@link $cloneWithProperties} function or via a super call.
	*
	* @example
	* ```ts
	* class ClassesTextNode extends TextNode {
	*   // Not shown: static getType, static importJSON, exportJSON, createDOM, updateDOM
	*   __classes = new Set<string>();
	*   static clone(node: ClassesTextNode): ClassesTextNode {
	*     // The inherited TextNode constructor is used here, so
	*     // classes is not set by this method.
	*     return new ClassesTextNode(node.__text, node.__key);
	*   }
	*   afterCloneFrom(node: this): void {
	*     // This calls TextNode.afterCloneFrom and LexicalNode.afterCloneFrom
	*     // for necessary state updates
	*     super.afterCloneFrom(node);
	*     this.__addClasses(node.__classes);
	*   }
	*   // This method is a private implementation detail, it is not
	*   // suitable for the public API because it does not call getWritable
	*   __addClasses(classNames: Iterable<string>): this {
	*     for (const className of classNames) {
	*       this.__classes.add(className);
	*     }
	*     return this;
	*   }
	*   addClass(...classNames: string[]): this {
	*     return this.getWritable().__addClasses(classNames);
	*   }
	*   removeClass(...classNames: string[]): this {
	*     const node = this.getWritable();
	*     for (const className of classNames) {
	*       this.__classes.delete(className);
	*     }
	*     return this;
	*   }
	*   getClasses(): Set<string> {
	*     return this.getLatest().__classes;
	*   }
	* }
	* ```
	*
	*/
	afterCloneFrom(prevNode) {
		if (this.__key === prevNode.__key) {
			this.__parent = prevNode.__parent;
			this.__next = prevNode.__next;
			this.__prev = prevNode.__prev;
			this.__state = prevNode.__state;
		} else if (prevNode.__state) this.__state = prevNode.__state.getWritable(this);
	}
	/**
	* Reset state in this copy of originalNode, if necessary
	*
	* @param originalNode
	*/
	resetOnCopyNodeFrom(originalNode) {
		if (this.__state) this.__state = this.__state.getWritable(this).resetOnCopyNode();
	}
	static importDOM;
	constructor(key) {
		this.__type = this.constructor.getType();
		this.__parent = null;
		this.__prev = null;
		this.__next = null;
		Object.defineProperty(this, "__state", NON_ENUMERABLE_PROP_DESC);
		Object.defineProperty(this, CACHED_TEXT_SIZE_KEY, NON_ENUMERABLE_PROP_DESC);
		$setNodeKey(this, key);
	}
	/**
	* Returns the string type of this node.
	*/
	getType() {
		return this.__type;
	}
	isInline() {
		invariant(false, "LexicalNode: Node %s does not implement .isInline().", this.constructor.name);
	}
	/**
	* Returns true if there is a path between this node and the RootNode, false otherwise.
	* This is a way of determining if the node is "attached" EditorState. Unattached nodes
	* won't be reconciled and will ultimately be cleaned up by the Lexical GC.
	*/
	isAttached() {
		let nodeKey = this.__key;
		while (nodeKey !== null) {
			if (nodeKey === "root") return true;
			const node = $getNodeByKey(nodeKey);
			if (node === null) break;
			nodeKey = node.__parent !== null ? node.__parent : $getSlotHostKey(node);
		}
		return false;
	}
	/**
	* Returns true if this node is contained within the provided Selection., false otherwise.
	* Relies on the algorithms implemented in {@link BaseSelection.getNodes} to determine
	* what's included.
	*
	* @param selection - The selection that we want to determine if the node is in.
	*/
	isSelected(selection) {
		const targetSelection = selection || $getSelection();
		if (targetSelection == null) return false;
		const isSelected = targetSelection.getNodes().some((n) => n.__key === this.__key);
		if ($isTextNode(this)) return isSelected;
		if ($isRangeSelection(targetSelection) && targetSelection.anchor.type === "element" && targetSelection.focus.type === "element") {
			if (targetSelection.isCollapsed()) return false;
			const parentNode = this.getParent();
			if ($isDecoratorNode(this) && this.isInline() && parentNode) {
				const firstPoint = targetSelection.isBackward() ? targetSelection.focus : targetSelection.anchor;
				if (parentNode.is(firstPoint.getNode()) && firstPoint.offset === parentNode.getChildrenSize() && this.is(parentNode.getLastChild())) return false;
			}
		}
		return isSelected;
	}
	/**
	* Returns this nodes key.
	*/
	getKey() {
		return this.__key;
	}
	/**
	* Returns the zero-based index of this node within the parent.
	*/
	getIndexWithinParent() {
		const parent = this.getParent();
		if (parent === null) return -1;
		let node = parent.getFirstChild();
		let index = 0;
		while (node !== null) {
			if (this.is(node)) return index;
			index++;
			node = node.getNextSibling();
		}
		return -1;
	}
	getParent() {
		const parent = this.getLatest().__parent;
		if (parent === null) return null;
		return $getNodeByKey(parent);
	}
	getParentOrThrow() {
		const parent = this.getParent();
		if (parent === null) invariant(false, "Expected node %s to have a parent.", this.__key);
		return parent;
	}
	/**
	* Returns the highest (in the EditorState tree)
	* non-root ancestor of this node, or null if none is found. See {@link lexical!$isRootOrShadowRoot}
	* for more information on which Elements comprise "roots".
	*/
	getTopLevelElement() {
		let node = this;
		while (node !== null) {
			const parent = node.getParent();
			if ($isRootOrShadowRoot(parent) || $getSlotHostKey(node) !== null) {
				invariant($isElementNode(node) || node === this && $isDecoratorNode(node), "Children of root nodes must be elements or decorators");
				return node;
			}
			node = parent;
		}
		return null;
	}
	/**
	* Returns the highest (in the EditorState tree)
	* non-root ancestor of this node, or throws if none is found. See {@link lexical!$isRootOrShadowRoot}
	* for more information on which Elements comprise "roots".
	*/
	getTopLevelElementOrThrow() {
		const parent = this.getTopLevelElement();
		if (parent === null) invariant(false, "Expected node %s to have a top parent element.", this.__key);
		return parent;
	}
	/**
	* Returns a list of the every ancestor of this node,
	* all the way up to the RootNode.
	*
	*/
	getParents() {
		const parents = [];
		let node = this.getParent();
		while (node !== null) {
			parents.push(node);
			node = node.getParent();
		}
		return parents;
	}
	/**
	* Returns a list of the keys of every ancestor of this node,
	* all the way up to the RootNode.
	*
	*/
	getParentKeys() {
		const parents = [];
		let node = this.getParent();
		while (node !== null) {
			parents.push(node.__key);
			node = node.getParent();
		}
		return parents;
	}
	getPreviousSibling() {
		const prevKey = this.getLatest().__prev;
		return prevKey === null ? null : $getNodeByKey(prevKey);
	}
	getPreviousSiblings() {
		const siblings = [];
		const parent = this.getParent();
		if (parent === null) return siblings;
		let node = parent.getFirstChild();
		while (node !== null) {
			if (node.is(this)) break;
			siblings.push(node);
			node = node.getNextSibling();
		}
		return siblings;
	}
	getNextSibling() {
		const nextKey = this.getLatest().__next;
		return nextKey === null ? null : $getNodeByKey(nextKey);
	}
	getNextSiblings() {
		const siblings = [];
		let node = this.getNextSibling();
		while (node !== null) {
			siblings.push(node);
			node = node.getNextSibling();
		}
		return siblings;
	}
	/**
	* Returns true if the provided node is the exact same one as this node, from Lexical's perspective.
	* Always use this instead of referential equality.
	*
	* @param object - the node to perform the equality comparison on.
	*/
	is(object) {
		if (object == null) return false;
		return this.__key === object.__key;
	}
	/**
	* Returns true if this node logically precedes the target node in the
	* editor state, false otherwise (including if there is no common ancestor).
	*
	* Note that this notion of isBefore is based on post-order; a descendant
	* node is always before its ancestors. See also
	* {@link $getCommonAncestor} and {@link $comparePointCaretNext} for
	* more flexible ways to determine the relative positions of nodes.
	*
	* @param targetNode - the node we're testing to see if it's after this one.
	*/
	isBefore(targetNode) {
		const compare = $getCommonAncestor(this, targetNode);
		if (compare === null) return false;
		if (compare.type === "descendant") return true;
		if (compare.type === "branch") return $getCommonAncestorResultBranchOrder(compare) === -1;
		invariant(compare.type === "same" || compare.type === "ancestor", "LexicalNode.isBefore: exhaustiveness check");
		return false;
	}
	/**
	* Returns true if this node is an ancestor of and distinct from the target node, false otherwise.
	*
	* @param targetNode - the would-be child node.
	*/
	isParentOf(targetNode) {
		return $hasAncestor(targetNode, this);
	}
	/**
	* Returns a list of nodes that are between this node and
	* the target node in the EditorState.
	*
	* @param targetNode - the node that marks the other end of the range of nodes to be returned.
	*/
	getNodesBetween(targetNode) {
		const isBefore = this.isBefore(targetNode);
		const nodes = [];
		const visited = /* @__PURE__ */ new Set();
		let node = this;
		while (true) {
			if (node === null) break;
			const key = node.__key;
			if (!visited.has(key)) {
				visited.add(key);
				nodes.push(node);
			}
			if (node === targetNode) break;
			const child = $isElementNode(node) ? isBefore ? node.getFirstChild() : node.getLastChild() : null;
			if (child !== null) {
				node = child;
				continue;
			}
			const nextSibling = isBefore ? node.getNextSibling() : node.getPreviousSibling();
			if (nextSibling !== null) {
				node = nextSibling;
				continue;
			}
			const parent = node.getParentOrThrow();
			if (!visited.has(parent.__key)) nodes.push(parent);
			if (parent === targetNode) break;
			let parentSibling = null;
			let ancestor = parent;
			do {
				if (ancestor === null) invariant(false, "getNodesBetween: ancestor is null");
				parentSibling = isBefore ? ancestor.getNextSibling() : ancestor.getPreviousSibling();
				ancestor = ancestor.getParent();
				if (ancestor !== null) {
					if (parentSibling === null && !visited.has(ancestor.__key)) nodes.push(ancestor);
				} else break;
			} while (parentSibling === null);
			node = parentSibling;
		}
		if (!isBefore) nodes.reverse();
		return nodes;
	}
	/**
	* Returns true if this node has been marked dirty during this update cycle.
	*
	*/
	isDirty() {
		const dirtyLeaves = getActiveEditor()._dirtyLeaves;
		return dirtyLeaves !== null && dirtyLeaves.has(this.__key);
	}
	/**
	* Returns the latest version of the node from the active EditorState.
	* This is used to avoid getting values from stale node references.
	*
	*/
	getLatest() {
		if ($isEphemeral(this)) return this;
		const latest = $getNodeByKey(this.__key);
		if (latest === null) invariant(false, "Lexical node does not exist in active editor state. Avoid using the same node references between nested closures from editorState.read/editor.update.");
		return latest;
	}
	/**
	* Returns a mutable version of the node using {@link $cloneWithProperties}
	* if necessary. Will throw an error if called outside of a Lexical Editor
	* {@link LexicalEditor.update} callback.
	*
	*/
	getWritable() {
		if ($isEphemeral(this)) return this;
		errorOnReadOnly();
		const editorState = getActiveEditorState();
		const editor = getActiveEditor();
		const key = this.__key;
		const cloneNotNeeded = editor._cloneNotNeeded;
		const writableNode = cloneNotNeeded.get(key);
		const selection = editorState._selection;
		if (selection !== null) selection.setCachedNodes(null);
		if (writableNode !== void 0) {
			internalMarkNodeAsDirty(writableNode);
			return writableNode;
		}
		const nodeMap = editorState._nodeMap;
		const latestNode = nodeMap.get(key);
		invariant(latestNode !== void 0, "Lexical node does not exist in active editor state. Avoid using the same node references between nested closures from editorState.read/editor.update.");
		const mutableNode = $cloneWithProperties(latestNode);
		cloneNotNeeded.set(key, mutableNode);
		nodeMap.set(key, mutableNode);
		internalMarkNodeAsDirty(mutableNode);
		return mutableNode;
	}
	/**
	* Returns the text content of the node. Override this for
	* custom nodes that should have a representation in plain text
	* format (for copy + paste, for example)
	*
	*/
	getTextContent() {
		return $getSlotsTextContent(this);
	}
	/**
	* Returns the length of the string produced by calling getTextContent on this node.
	*
	*/
	getTextContentSize() {
		return this.getTextContent().length;
	}
	/**
	* Called during the reconciliation process to determine which nodes
	* to insert into the DOM for this Lexical Node.
	*
	* This method must return exactly one HTMLElement. Nested elements are not supported.
	*
	* Do not attempt to update the Lexical EditorState during this phase of the update lifecycle.
	*
	* @param _config - allows access to things like the EditorTheme (to apply classes) during reconciliation.
	* @param _editor - allows access to the editor for context during reconciliation.
	*
	* */
	createDOM(_config, _editor) {
		invariant(false, "createDOM: base method not extended");
	}
	/**
	* Called when a node changes and should update the DOM
	* in whatever way is necessary to make it align with any changes that might
	* have happened during the update.
	*
	* Returning "true" here will cause lexical to unmount and recreate the DOM node
	* (by calling createDOM). You would need to do this if the element tag changes,
	* for instance.
	*
	* */
	updateDOM(_prevNode, _dom, _config) {
		invariant(false, "updateDOM: base method not extended");
	}
	/**
	* Returns a {@link DOMSlot} pointing at the content-bearing element of this
	* node's DOM. The default returns a slot wrapping the keyed DOM as-is.
	*
	* Override this when {@link createDOM} returns a wrapper around the
	* content-bearing element (e.g. `<span><br/></span>` for a styled line
	* break), so selection / reconciliation logic can target the inner element.
	*
	* {@link ElementNode} overrides this to return an {@link ElementDOMSlot}
	* with children-management semantics (used by the reconciler to place
	* managed children).
	*
	* @experimental
	*/
	getDOMSlot(element) {
		return new DOMSlot(element);
	}
	/**
	* Controls how the this node is serialized to HTML. This is important for
	* copy and paste between Lexical and non-Lexical editors, or Lexical editors with different namespaces,
	* in which case the primary transfer format is HTML. It's also important if you're serializing
	* to HTML for any other reason via {@link @lexical/html!$generateHtmlFromNodes}. You could
	* also use this method to build your own HTML renderer.
	*
	* */
	exportDOM(editor) {
		return { element: $getEditorDOMRenderConfig(editor).$createDOM(this, editor) };
	}
	exportJSON(compact = false) {
		const json = $exportNodeJSONOnce(this, compact);
		const state = this.__state ? this.__state.toJSON() : void 0;
		if (state !== void 0) Object.assign(json, state);
		return json;
	}
	/**
	* Controls how the this node is deserialized from JSON. This is usually boilerplate,
	* but provides an abstraction between the node implementation and serialized interface that can
	* be important if you ever make breaking changes to a node schema (by adding or removing properties).
	* See [Serialization & Deserialization](https://lexical.dev/docs/serialization/serialization#json).
	*
	* */
	static importJSON(_serializedNode) {
		invariant(false, "LexicalNode: Node %s does not implement .importJSON().", this.name);
	}
	/**
	* Update this LexicalNode instance from serialized JSON. It's recommended
	* to implement as much logic as possible in this method instead of the
	* static importJSON method, so that the functionality can be inherited in subclasses.
	*
	* The LexicalUpdateJSON utility type should be used to ignore any type, version,
	* or children properties in the JSON so that the extended JSON from subclasses
	* are acceptable parameters for the super call.
	*
	* If overridden, this method must call super.
	*
	* @example
	* ```ts
	* class MyTextNode extends TextNode {
	*   // ...
	*   static importJSON(serializedNode: SerializedMyTextNode): MyTextNode {
	*     return $createMyTextNode()
	*       .updateFromJSON(serializedNode);
	*   }
	*   updateFromJSON(
	*     serializedNode: LexicalUpdateJSON<SerializedMyTextNode>,
	*   ): this {
	*     return super.updateFromJSON(serializedNode)
	*       .setMyProperty(serializedNode.myProperty);
	*   }
	* }
	* ```
	*
	* The whole schema is applied, so a property the JSON omits is set to
	* its schema default rather than left as it is — that is what lets the
	* compact form omit a default-valued property and have parsing restore it.
	* (A flat NodeState is the exception: it is applied only when present.) Pass
	* the node's complete serialized form unless you mean to reset what you
	* leave out.
	*/
	updateFromJSON(serializedNode) {
		return $applyJSONSetters($updateStateFromJSON(this, serializedNode), serializedNode);
	}
	/**
	* @experimental
	*
	* Registers the returned function as a transform on the node during
	* Editor initialization. Most such use cases should be addressed via
	* the {@link LexicalEditor.registerNodeTransform} API.
	*
	* Experimental - use at your own risk.
	*/
	static transform() {
		return null;
	}
	/**
	* Removes this LexicalNode from the EditorState. If the node isn't re-inserted
	* somewhere, the Lexical garbage collector will eventually clean it up.
	*
	* @param preserveEmptyParent - If falsy, the node's parent will be removed if
	* it's empty after the removal operation. This is the default behavior, subject to
	* other node heuristics such as {@link ElementNode#canBeEmpty}
	* */
	remove(preserveEmptyParent) {
		$removeNode(this, true, preserveEmptyParent);
	}
	/**
	* Replaces this LexicalNode with the provided node, optionally transferring the children
	* of the replaced node to the replacing node.
	*
	* Named slots are bound to their host node and are never transferred: this
	* node keeps its slot map, so if it is reattached elsewhere (as
	* `$wrapNodeInElement` does) its slots come with it, and if it stays
	* detached the slot subtrees are garbage-collected along with it. To move a
	* slot value onto another host, use `$setSlot` explicitly.
	*
	* @param replaceWith - The node to replace this one with.
	* @param includeChildren - Whether or not to transfer the children of this node to the replacing node.
	* */
	replace(replaceWith, includeChildren) {
		errorOnReadOnly();
		let selection = $getSelection();
		if (selection !== null) selection = selection.clone();
		errorOnInsertTextNodeOnRoot(this, replaceWith);
		const self = this.getLatest();
		const toReplaceKey = this.__key;
		const slotHost = $getSlotHost(self);
		if (slotHost !== null) invariant(false, "replace: node %s (type %s) is slotted into host %s (type %s); a slot value cannot be replaced through the tree API. Use $setSlot on its host to assign a replacement.", toReplaceKey, self.getType(), slotHost.getKey(), slotHost.getType());
		const key = replaceWith.__key;
		const writableReplaceWith = replaceWith.getWritable();
		const writableParent = this.getParentOrThrow().getWritable();
		const size = writableParent.__size;
		const replaceWithOldParent = writableReplaceWith.getParent();
		const restoreInReplaceWithOldParent = replaceWithOldParent !== null && $isRangeSelection(selection) && $selectionTouchesElement(selection, replaceWithOldParent);
		const replaceWithOldIndex = restoreInReplaceWithOldParent ? writableReplaceWith.getIndexWithinParent() : -1;
		$removeFromParent(writableReplaceWith);
		if (restoreInReplaceWithOldParent && replaceWithOldParent !== null && $isRangeSelection(selection)) $updateElementSelectionOnCreateDeleteNode(selection, replaceWithOldParent, replaceWithOldIndex, -1);
		const prevSibling = self.getPreviousSibling();
		const nextSibling = self.getNextSibling();
		const prevKey = self.__prev;
		const nextKey = self.__next;
		const parentKey = self.__parent;
		$removeNode(self, false, true);
		if (prevSibling === null) writableParent.__first = key;
		else {
			const writablePrevSibling = prevSibling.getWritable();
			writablePrevSibling.__next = key;
		}
		writableReplaceWith.__prev = prevKey;
		if (nextSibling === null) writableParent.__last = key;
		else {
			const writableNextSibling = nextSibling.getWritable();
			writableNextSibling.__prev = key;
		}
		writableReplaceWith.__next = nextKey;
		writableReplaceWith.__parent = parentKey;
		writableParent.__size = replaceWithOldParent !== null && replaceWithOldParent.is(writableParent) ? size - 1 : size;
		let prevSizeBeforeChildrenTransfer = 0;
		if (includeChildren) {
			invariant($isElementNode(this) && $isElementNode(writableReplaceWith), "includeChildren should only be true for ElementNodes");
			prevSizeBeforeChildrenTransfer = writableReplaceWith.getChildrenSize();
			writableReplaceWith.splice(prevSizeBeforeChildrenTransfer, 0, this.getChildren());
		}
		if ($isRangeSelection(selection)) {
			$setSelection(selection);
			const anchor = selection.anchor;
			const focus = selection.focus;
			if (anchor.key === toReplaceKey) {
				if (includeChildren && anchor.type === "element") anchor.set(writableReplaceWith.__key, prevSizeBeforeChildrenTransfer + anchor.offset, "element");
				else $moveSelectionPointToEnd(anchor, writableReplaceWith);
			}
			if (focus.key === toReplaceKey) {
				if (includeChildren && focus.type === "element") focus.set(writableReplaceWith.__key, prevSizeBeforeChildrenTransfer + focus.offset, "element");
				else $moveSelectionPointToEnd(focus, writableReplaceWith);
			}
		}
		if ($getCompositionKey() === toReplaceKey) $setCompositionKey(key);
		return writableReplaceWith;
	}
	/**
	* Inserts a node after this LexicalNode (as the next sibling).
	*
	* @param nodeToInsert - The node to insert after this one.
	* @param restoreSelection - Whether or not to attempt to resolve the
	* selection to the appropriate place after the operation is complete.
	* */
	insertAfter(nodeToInsert, restoreSelection = true) {
		errorOnReadOnly();
		errorOnInsertTextNodeOnRoot(this, nodeToInsert);
		const writableSelf = this.getWritable();
		const writableNodeToInsert = nodeToInsert.getWritable();
		this.getParentOrThrow();
		const oldParent = writableNodeToInsert.getParent();
		const selection = $getSelection();
		let elementAnchorSelectionOnNode = false;
		let elementFocusSelectionOnNode = false;
		let oldIndex = -1;
		if (oldParent !== null && restoreSelection && $isRangeSelection(selection) && $selectionTouchesElement(selection, oldParent)) {
			const oldParentKey = oldParent.__key;
			const anchor = selection.anchor;
			const focus = selection.focus;
			oldIndex = nodeToInsert.getIndexWithinParent();
			elementAnchorSelectionOnNode = anchor.type === "element" && anchor.key === oldParentKey && anchor.offset === oldIndex + 1;
			elementFocusSelectionOnNode = focus.type === "element" && focus.key === oldParentKey && focus.offset === oldIndex + 1;
		}
		$removeFromParent(writableNodeToInsert);
		if (oldIndex !== -1 && oldParent !== null && $isRangeSelection(selection)) $updateElementSelectionOnCreateDeleteNode(selection, oldParent, oldIndex, -1);
		const nextSibling = this.getNextSibling();
		const writableParent = this.getParentOrThrow().getWritable();
		const insertKey = writableNodeToInsert.__key;
		const nextKey = writableSelf.__next;
		if (nextSibling === null) writableParent.__last = insertKey;
		else {
			const writableNextSibling = nextSibling.getWritable();
			writableNextSibling.__prev = insertKey;
		}
		writableParent.__size++;
		writableSelf.__next = insertKey;
		writableNodeToInsert.__next = nextKey;
		writableNodeToInsert.__prev = writableSelf.__key;
		writableNodeToInsert.__parent = writableSelf.__parent;
		if (restoreSelection && $isRangeSelection(selection)) {
			const writableParentKey = writableParent.__key;
			if (elementAnchorSelectionOnNode || elementFocusSelectionOnNode || $selectionTouchesElement(selection, writableParent)) {
				const index = this.getIndexWithinParent();
				$updateElementSelectionOnCreateDeleteNode(selection, writableParent, index + 1);
				if (elementAnchorSelectionOnNode) selection.anchor.set(writableParentKey, index + 2, "element");
				if (elementFocusSelectionOnNode) selection.focus.set(writableParentKey, index + 2, "element");
			}
		}
		return nodeToInsert;
	}
	/**
	* Inserts a node before this LexicalNode (as the previous sibling).
	*
	* @param nodeToInsert - The node to insert before this one.
	* @param restoreSelection - Whether or not to attempt to resolve the
	* selection to the appropriate place after the operation is complete.
	* */
	insertBefore(nodeToInsert, restoreSelection = true) {
		errorOnReadOnly();
		errorOnInsertTextNodeOnRoot(this, nodeToInsert);
		const writableSelf = this.getWritable();
		const writableNodeToInsert = nodeToInsert.getWritable();
		this.getParentOrThrow();
		const insertKey = writableNodeToInsert.__key;
		const selection = $getSelection();
		const insertOldParent = writableNodeToInsert.getParent();
		const restoreInOldParent = insertOldParent !== null && restoreSelection && $isRangeSelection(selection) && $selectionTouchesElement(selection, insertOldParent);
		const insertOldIndex = restoreInOldParent ? writableNodeToInsert.getIndexWithinParent() : -1;
		$removeFromParent(writableNodeToInsert);
		if (restoreInOldParent && insertOldParent !== null && $isRangeSelection(selection)) $updateElementSelectionOnCreateDeleteNode(selection, insertOldParent, insertOldIndex, -1);
		const prevSibling = this.getPreviousSibling();
		const writableParent = this.getParentOrThrow().getWritable();
		const prevKey = writableSelf.__prev;
		const restoreInNewParent = restoreSelection && $isRangeSelection(selection) && $selectionTouchesElement(selection, writableParent);
		const index = restoreInNewParent ? this.getIndexWithinParent() : -1;
		if (prevSibling === null) writableParent.__first = insertKey;
		else {
			const writablePrevSibling = prevSibling.getWritable();
			writablePrevSibling.__next = insertKey;
		}
		writableParent.__size++;
		writableSelf.__prev = insertKey;
		writableNodeToInsert.__prev = prevKey;
		writableNodeToInsert.__next = writableSelf.__key;
		writableNodeToInsert.__parent = writableSelf.__parent;
		if (restoreInNewParent && $isRangeSelection(selection)) $updateElementSelectionOnCreateDeleteNode(selection, writableParent, index);
		return nodeToInsert;
	}
	/**
	* Whether or not this node has a required parent. Used during copy + paste operations
	* to normalize nodes that would otherwise be orphaned. For example, ListItemNodes without
	* a ListNode parent or TextNodes with a ParagraphNode parent.
	*
	* */
	isParentRequired() {
		return false;
	}
	/**
	* The creation logic for any required parent. Should be implemented if {@link isParentRequired} returns true.
	*
	* */
	createParentElementNode() {
		return $createParagraphNode();
	}
	selectStart() {
		return this.selectPrevious();
	}
	selectEnd() {
		return this.selectNext(0, 0);
	}
	/**
	* Moves selection to the previous sibling of this node, at the specified offsets.
	*
	* @param anchorOffset - The anchor offset for selection.
	* @param focusOffset -  The focus offset for selection
	* */
	selectPrevious(anchorOffset, focusOffset) {
		errorOnReadOnly();
		const slotHost = $getSlotHost(this);
		if (slotHost !== null) return slotHost.selectPrevious(anchorOffset, focusOffset);
		const prevSibling = this.getPreviousSibling();
		const parent = this.getParentOrThrow();
		if (prevSibling === null) return parent.select(0, 0);
		if ($isElementNode(prevSibling)) return prevSibling.select();
		else if (!$isTextNode(prevSibling)) {
			const index = prevSibling.getIndexWithinParent() + 1;
			return parent.select(index, index);
		}
		return prevSibling.select(anchorOffset, focusOffset);
	}
	/**
	* Moves selection to the next sibling of this node, at the specified offsets.
	*
	* @param anchorOffset - The anchor offset for selection.
	* @param focusOffset -  The focus offset for selection
	* */
	selectNext(anchorOffset, focusOffset) {
		errorOnReadOnly();
		const slotHost = $getSlotHost(this);
		if (slotHost !== null) return slotHost.selectNext(anchorOffset, focusOffset);
		const nextSibling = this.getNextSibling();
		const parent = this.getParentOrThrow();
		if (nextSibling === null) return parent.select();
		if ($isElementNode(nextSibling)) return nextSibling.select(0, 0);
		else if (!$isTextNode(nextSibling)) {
			const index = nextSibling.getIndexWithinParent();
			return parent.select(index, index);
		}
		return nextSibling.select(anchorOffset, focusOffset);
	}
	/**
	* Marks a node dirty, triggering transforms and
	* forcing it to be reconciled during the update cycle.
	*
	* */
	markDirty() {
		this.getWritable();
	}
	/**
	* @internal
	*
	* When the reconciler detects that a node was mutated, this method
	* may be called to restore the node to a known good state.
	*/
	reconcileObservedMutation(dom, editor) {
		this.markDirty();
	}
};
/**
* Insert a series of nodes after this LexicalNode (as next siblings)
*
* @param firstToInsert - The first node to insert after this one.
* @param lastToInsert - The last node to insert after this one. Must be a
* later sibling of FirstNode. If not provided, it will be its last sibling.
*/
function insertRangeAfter(node, firstToInsert, lastToInsert) {
	const lastToInsert2 = lastToInsert || firstToInsert.getParentOrThrow().getLastChild();
	let current = firstToInsert;
	const nodesToInsert = [firstToInsert];
	while (current !== lastToInsert2) {
		if (!current.getNextSibling()) invariant(false, "insertRangeAfter: lastToInsert must be a later sibling of firstToInsert");
		current = current.getNextSibling();
		nodesToInsert.push(current);
	}
	let currentNode = node;
	for (const nodeToInsert of nodesToInsert) currentNode = currentNode.insertAfter(nodeToInsert);
}
/**
* Returns true if the given value is a {@link LexicalNode} instance.
*/
function $isLexicalNode(node) {
	return node instanceof LexicalNode;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalUpdateTags.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Common update tags used in Lexical. These tags can be used with editor.update() or $addUpdateTag()
* to indicate the type/purpose of an update. Multiple tags can be used in a single update.
*/
/**
* Indicates that the update is related to history operations (undo/redo)
*/
var HISTORIC_TAG = "historic";
/**
* Indicates that a new history entry should be pushed to the history stack
*/
var HISTORY_PUSH_TAG = "history-push";
/**
* Indicates that the current update should be merged with the previous history entry
*/
var HISTORY_MERGE_TAG = "history-merge";
/**
* Indicates that the update is related to a paste operation
*/
var PASTE_TAG = "paste";
/**
* Indicates that the update is related to a cut operation
*/
var CUT_TAG = "cut";
/**
* Indicates that the update is related to collaborative editing
*/
var COLLABORATION_TAG = "collaboration";
/**
* Indicates that the update should skip collaborative sync
*/
var SKIP_COLLAB_TAG = "skip-collab";
/**
* Indicates that the update should skip scrolling the selection into view
*/
var SKIP_SCROLL_INTO_VIEW_TAG = "skip-scroll-into-view";
/**
* Indicates that the update should skip updating the DOM selection
* This is useful when you want to make updates without changing the selection or focus.
*
* Note: this tag has no effect on the initial editor state setup (e.g. an `editorState`
* supplied via `createEditor` or `$initialEditorState`). If you need the editor to not
* scroll to or focus the initial selection on first mount, call `$setSelection(null)`
* inside your initial state setup function instead.
*/
var SKIP_DOM_SELECTION_TAG = "skip-dom-selection";
/**
* Indicates that after changing the selection, the editor should not focus itself
* This tag is ignored if {@link SKIP_DOM_SELECTION_TAG} is used
*/
var SKIP_SELECTION_FOCUS_TAG = "skip-selection-focus";
/**
* The update was triggered by editor.focus()
*/
var FOCUS_TAG = "focus";
/**
* The update was triggered by composition-start
*/
var COMPOSITION_START_TAG = "composition-start";
/**
* The update was triggered by composition-end
*/
var COMPOSITION_END_TAG = "composition-end";
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalGeneratedJSON.ts
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
* ElementNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneElementNode(node, prevNode) {
	node.__dir = prevNode.__dir;
	node.__format = prevNode.__format;
	node.__indent = prevNode.__indent;
	node.__textFormat = prevNode.__textFormat;
	node.__textStyle = prevNode.__textStyle;
}
/** ElementNode's generated implementations, for its `$config`. @internal */
var GENERATED_ELEMENT = (fields) => {
	const ELEMENT_FORMAT_GETTER = getterTableOf(fields, "format");
	const ELEMENT_FORMAT_SETTER = setterTableOf(fields, "format");
	const ELEMENT_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from ElementNode's serialization schema. Do not edit by hand. */
	function exportElementNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			direction: node.__dir,
			format: ELEMENT_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from ElementNode's serialization schema. Do not edit by hand. */
	function exportCompactElementNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = ELEMENT_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from ElementNode's serialization schema. Do not edit by hand. */
	function updateElementNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in ELEMENT_FORMAT_SETTER ? ELEMENT_FORMAT_SETTER[format] : ELEMENT_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		return node;
	}
	return {
		exportJSON: exportElementNode,
		exportCompactJSON: exportCompactElementNode,
		updateFromJSON: updateElementNode
	};
};
/**
* TextNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneTextNode(node, prevNode) {
	node.__detail = prevNode.__detail;
	node.__format = prevNode.__format;
	node.__mode = prevNode.__mode;
	node.__style = prevNode.__style;
	node.__text = prevNode.__text;
}
/** TextNode's generated implementations, for its `$config`. @internal */
var GENERATED_TEXT = (fields) => {
	const TEXT_MODE_GETTER = getterTableOf(fields, "mode");
	const TEXT_DETAIL_ALIAS = aliasTableOf(fields, "detail", 0);
	const TEXT_FORMAT_ALIAS = aliasTableOf(fields, "format", 0);
	const TEXT_MODE_SETTER = setterTableOf(fields, "mode");
	const TEXT_MODE_SETTER_DEFAULT = setterDefaultOf(fields, "mode");
	/** Generated from TextNode's serialization schema. Do not edit by hand. */
	function exportTextNode(node) {
		return {
			detail: node.__detail,
			format: node.__format,
			mode: TEXT_MODE_GETTER[node.__mode],
			style: node.__style,
			text: node.__text,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from TextNode's serialization schema. Do not edit by hand. */
	function exportCompactTextNode(node) {
		const json = { type: node.__type };
		const detail = node.__detail;
		if (detail !== void 0 && detail !== 0) json.detail = detail;
		const format = node.__format;
		if (format !== void 0 && format !== 0) json.format = format;
		const mode = TEXT_MODE_GETTER[node.__mode];
		if (mode !== void 0 && mode !== "normal") json.mode = mode;
		const style = node.__style;
		if (style !== void 0 && style !== "") json.style = style;
		const text = node.__text;
		if (text !== void 0 && text !== "") json.text = text;
		return json;
	}
	/** Generated from TextNode's serialization schema. Do not edit by hand. */
	function updateTextNode(node, json) {
		const detail = json.detail;
		node.__detail = typeof detail === "string" && detail in TEXT_DETAIL_ALIAS ? TEXT_DETAIL_ALIAS[detail] : num(detail, 0);
		const format = json.format;
		node.__format = typeof format === "string" && format in TEXT_FORMAT_ALIAS ? TEXT_FORMAT_ALIAS[format] : num(format, 0);
		const mode = json.mode;
		node.__mode = typeof mode === "string" && mode in TEXT_MODE_SETTER ? TEXT_MODE_SETTER[mode] : TEXT_MODE_SETTER_DEFAULT;
		const style = json.style;
		node.__style = typeof style === "string" ? style : "";
		const text = json.text;
		node.__text = typeof text === "string" ? text : "";
		return node;
	}
	return {
		exportJSON: exportTextNode,
		exportCompactJSON: exportCompactTextNode,
		updateFromJSON: updateTextNode,
		afterCloneFrom: afterCloneTextNode
	};
};
/** ParagraphNode's generated implementations, for its `$config`. @internal */
var GENERATED_PARAGRAPH = (fields) => {
	const PARAGRAPH_FORMAT_GETTER = getterTableOf(fields, "format");
	const PARAGRAPH_FORMAT_SETTER = setterTableOf(fields, "format");
	const PARAGRAPH_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from ParagraphNode's serialization schema. Do not edit by hand. */
	function exportParagraphNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			direction: node.__dir,
			format: PARAGRAPH_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from ParagraphNode's serialization schema. Do not edit by hand. */
	function exportCompactParagraphNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = PARAGRAPH_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from ParagraphNode's serialization schema. Do not edit by hand. */
	function updateParagraphNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in PARAGRAPH_FORMAT_SETTER ? PARAGRAPH_FORMAT_SETTER[format] : PARAGRAPH_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		return node;
	}
	return {
		exportJSON: exportParagraphNode,
		exportCompactJSON: exportCompactParagraphNode,
		updateFromJSON: updateParagraphNode
	};
};
/** LineBreakNode's generated implementations, for its `$config`. @internal */
var GENERATED_LINEBREAK = () => {
	/** Generated from LineBreakNode's serialization schema. Do not edit by hand. */
	function exportLineBreakNode(node) {
		return {
			type: node.__type,
			version: 1
		};
	}
	/** Generated from LineBreakNode's serialization schema. Do not edit by hand. */
	function exportCompactLineBreakNode(node) {
		return { type: node.__type };
	}
	return {
		exportJSON: exportLineBreakNode,
		exportCompactJSON: exportCompactLineBreakNode
	};
};
/** TabNode's generated implementations, for its `$config`. @internal */
var GENERATED_TAB = (fields) => {
	const TAB_MODE_GETTER = getterTableOf(fields, "mode");
	const TAB_FORMAT_ALIAS = aliasTableOf(fields, "format", 0);
	/** Generated from TabNode's serialization schema. Do not edit by hand. */
	function exportTabNode(node) {
		return {
			detail: node.__detail,
			mode: TAB_MODE_GETTER[node.__mode],
			text: node.__text,
			format: node.__format,
			style: node.__style,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from TabNode's serialization schema. Do not edit by hand. */
	function exportCompactTabNode(node) {
		const json = { type: node.__type };
		const format = node.__format;
		if (format !== void 0 && format !== 0) json.format = format;
		const style = node.__style;
		if (style !== void 0 && style !== "") json.style = style;
		return json;
	}
	/** Generated from TabNode's serialization schema. Do not edit by hand. */
	function updateTabNode(node, json) {
		const format = json.format;
		node.__format = typeof format === "string" && format in TAB_FORMAT_ALIAS ? TAB_FORMAT_ALIAS[format] : num(format, 0);
		const style = json.style;
		node.__style = typeof style === "string" ? style : "";
		return node;
	}
	return {
		exportJSON: exportTabNode,
		exportCompactJSON: exportCompactTabNode,
		updateFromJSON: updateTabNode
	};
};
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/utils/setDOMStyle.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var IMPORTANT_FLAG = "!important";
/**
* Parses inline CSS text into an object that is compatible with
* `CSSStyleDeclaration.setProperty()`.
*
* Property names are expected to be kebab-case, such as `font-size`, and
* values are expected to include explicit units where needed, such as `12px`.
*/
function getStyleObjectFromCSS(css) {
	const styles = {};
	if (!css) return styles;
	let currentProperty = "";
	let currentValue = "";
	let currentQuote = null;
	let inComment = false;
	let isEscaped = false;
	let isParsingValue = false;
	let parenthesisDepth = 0;
	const length = css.length;
	let chunkStart = -1;
	for (let i = 0; i < length; i++) {
		const char = css[i];
		if (inComment) {
			if (char === "*" && css[i + 1] === "/") {
				inComment = false;
				i++;
			}
			continue;
		}
		if (isEscaped) {
			if (chunkStart === -1) chunkStart = i;
			isEscaped = false;
			continue;
		}
		if (currentQuote !== null) {
			if (chunkStart === -1) chunkStart = i;
			if (char === "\\") isEscaped = true;
			else if (char === currentQuote) currentQuote = null;
			continue;
		}
		if (char === "/" && css[i + 1] === "*") {
			if (chunkStart !== -1) {
				if (isParsingValue) currentValue += css.slice(chunkStart, i);
				else currentProperty += css.slice(chunkStart, i);
				chunkStart = -1;
			}
			inComment = true;
			i++;
			continue;
		}
		if (char === "\"" || char === "'") {
			if (chunkStart === -1) chunkStart = i;
			currentQuote = char;
			continue;
		}
		if (char === "(") {
			if (chunkStart === -1) chunkStart = i;
			parenthesisDepth++;
			continue;
		}
		if (char === ")") {
			if (chunkStart === -1) chunkStart = i;
			parenthesisDepth = Math.max(0, parenthesisDepth - 1);
			continue;
		}
		if (!isParsingValue && char === ":" && parenthesisDepth === 0) {
			if (chunkStart !== -1) {
				currentProperty += css.slice(chunkStart, i);
				chunkStart = -1;
			}
			isParsingValue = true;
			continue;
		}
		if (char === ";" && parenthesisDepth === 0) {
			if (chunkStart !== -1) {
				if (isParsingValue) currentValue += css.slice(chunkStart, i);
				else currentProperty += css.slice(chunkStart, i);
				chunkStart = -1;
			}
			const property = currentProperty.trim();
			const value = currentValue.trim();
			if (property !== "" && value !== "") styles[property] = value;
			currentProperty = "";
			currentValue = "";
			isParsingValue = false;
			continue;
		}
		if (chunkStart === -1) chunkStart = i;
	}
	if (chunkStart !== -1) {
		if (isParsingValue) currentValue += css.slice(chunkStart, length);
		else currentProperty += css.slice(chunkStart, length);
	}
	const property = currentProperty.trim();
	const value = currentValue.trim();
	if (property !== "" && value !== "") styles[property] = value;
	return styles;
}
function setDOMStyleProperty(domStyle, property, value) {
	const trimmedValue = value.trimEnd();
	const flagStart = trimmedValue.length - 10;
	if (flagStart >= 0 && trimmedValue.slice(flagStart).toLowerCase() === IMPORTANT_FLAG) domStyle.setProperty(property, trimmedValue.slice(0, flagStart).trim(), "important");
	else domStyle.setProperty(property, value, "");
}
/**
* Applies a style object to a DOM style declaration using
* `CSSStyleDeclaration.setProperty()`.
*
* Property names are expected to be kebab-case, such as `font-size`, and
* values are expected to include explicit units where needed, such as `12px`.
*/
function setDOMStyleObject(domStyle, styleObject) {
	for (const property in styleObject) {
		const value = styleObject[property];
		if (value == null) domStyle.removeProperty(property);
		else setDOMStyleProperty(domStyle, property, value);
	}
}
/**
* Applies inline CSS text to a DOM style declaration using
* `CSSStyleDeclaration.setProperty()`.
*
* Property names are expected to be kebab-case, such as `font-size`, and
* values are expected to include explicit units where needed, such as `12px`.
*/
function setDOMStyleFromCSS(domStyle, cssText, prevCSSText = "") {
	if (cssText === prevCSSText) return;
	const prevCSS = getStyleObjectFromCSS(prevCSSText);
	const nextCSS = getStyleObjectFromCSS(cssText);
	for (const property in nextCSS) {
		delete prevCSS[property];
		setDOMStyleProperty(domStyle, property, nextCSS[property]);
	}
	for (const property in prevCSS) domStyle.removeProperty(property);
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/nodes/LexicalTextNode.ts
var textNodeSchema = nodeSchema()({
	detail: withField(aliasedValue(numberValue(), DETAIL_TYPE_TO_DETAIL), { field: "__detail" }),
	format: withField(aliasedValue(numberValue(), TEXT_TYPE_TO_FORMAT), { field: "__format" }),
	mode: withField(enumValue([
		"normal",
		"token",
		"segmented"
	]), {
		field: "__mode",
		getterTable: TEXT_TYPE_TO_MODE,
		setterTable: TEXT_MODE_TO_TYPE
	}),
	style: withField(stringValue(), { field: "__style" }),
	text: withField(stringValue(), {
		field: "__text",
		getter: "getTextContent",
		setter: "setTextContent"
	})
});
function getElementOuterTag(node, format) {
	if (format & 16) return "code";
	if (format & 128) return "mark";
	if (format & 32) return "sub";
	if (format & 64) return "sup";
	return null;
}
function getElementInnerTag(node, format) {
	if (format & 1) return "strong";
	if (format & 2) return "em";
	return "span";
}
function setTextThemeClassNames(tag, prevFormat, nextFormat, dom, textClassNames) {
	const domClassList = dom.classList;
	let classNames = getCachedClassNameArray(textClassNames, "base");
	if (classNames !== void 0) domClassList.add(...classNames);
	classNames = getCachedClassNameArray(textClassNames, "underlineStrikethrough");
	let hasUnderlineStrikethrough = false;
	const prevUnderlineStrikethrough = prevFormat & 8 && prevFormat & 4;
	const nextUnderlineStrikethrough = nextFormat & 8 && nextFormat & 4;
	if (classNames !== void 0) {
		if (nextUnderlineStrikethrough) {
			hasUnderlineStrikethrough = true;
			if (!prevUnderlineStrikethrough) domClassList.add(...classNames);
		} else if (prevUnderlineStrikethrough) domClassList.remove(...classNames);
	}
	for (const key in TEXT_TYPE_TO_FORMAT) {
		const flag = TEXT_TYPE_TO_FORMAT[key];
		classNames = getCachedClassNameArray(textClassNames, key);
		if (classNames !== void 0) {
			if (nextFormat & flag) {
				if (hasUnderlineStrikethrough && (key === "underline" || key === "strikethrough")) {
					if (prevFormat & flag) domClassList.remove(...classNames);
					continue;
				}
				if ((prevFormat & flag) === 0 || prevUnderlineStrikethrough && key === "underline" || key === "strikethrough") domClassList.add(...classNames);
			} else if (prevFormat & flag) domClassList.remove(...classNames);
		}
	}
	removeEmptyDOMAttribute(dom, "class");
}
function diffComposedText(a, b) {
	const aLength = a.length;
	const bLength = b.length;
	let left = 0;
	let right = 0;
	while (left < aLength && left < bLength && a[left] === b[left]) left++;
	while (right + left < aLength && right + left < bLength && a[aLength - right - 1] === b[bLength - right - 1]) right++;
	return [
		left,
		aLength - left - right,
		b.slice(left, bLength - right)
	];
}
function $setTextContent(nextText, dom, node) {
	const isComposing = node.isComposing();
	const text = nextText + (isComposing ? COMPOSITION_SUFFIX : "");
	const editor = $getEditor();
	const slot = $getEditorDOMRenderConfig(editor).$getDOMSlot(node, dom, editor);
	const firstChild = slot.getFirstChild();
	if (firstChild === null || firstChild.nodeType !== Node.TEXT_NODE) {
		slot.insertChild($getDocument().createTextNode(text));
		return;
	}
	const textChild = firstChild;
	const nodeValue = textChild.nodeValue;
	if (nodeValue === text) return;
	if (isComposing || IS_FIREFOX) {
		const [index, remove, insert] = diffComposedText(nodeValue, text);
		if (remove !== 0) textChild.deleteData(index, remove);
		textChild.insertData(index, insert);
	} else textChild.nodeValue = text;
}
function $createTextInnerDOM(innerDOM, node, innerTag, format, text, config) {
	$setTextContent(text, innerDOM, node);
	const textClassNames = config.theme.text;
	if (textClassNames !== void 0) setTextThemeClassNames(innerTag, 0, format, innerDOM, textClassNames);
}
function $wrapElementWith(element, tag) {
	const el = $getDocument().createElement(tag);
	el.appendChild(element);
	return el;
}
/** Returns true if the given node supports inline text formatting. */
function $isInlineFormattable(node) {
	return node != null && node.__isInlineFormattable === true;
}
/** @noInheritDoc */
var TextNode = class extends LexicalNode {
	__text;
	/** @internal */
	__format;
	/** @internal */
	__style;
	/** @internal */
	__mode;
	/** @internal */
	__detail;
	/** @internal */
	get __isInlineFormattable() {
		return true;
	}
	$config() {
		return this.config("text", {
			extends: LexicalNode,
			generated: GENERATED_TEXT,
			importDOM: {
				"#text": () => ({
					conversion: $convertTextDOMNode,
					priority: 0
				}),
				b: () => ({
					conversion: convertBringAttentionToElement,
					priority: 0
				}),
				code: () => ({
					conversion: convertTextFormatElement,
					priority: 0
				}),
				em: () => ({
					conversion: convertTextFormatElement,
					priority: 0
				}),
				i: () => ({
					conversion: convertTextFormatElement,
					priority: 0
				}),
				mark: () => ({
					conversion: convertTextFormatElement,
					priority: 0
				}),
				s: () => ({
					conversion: convertTextFormatElement,
					priority: 0
				}),
				span: () => ({
					conversion: convertSpanElement,
					priority: 0
				}),
				strong: () => ({
					conversion: convertTextFormatElement,
					priority: 0
				}),
				sub: () => ({
					conversion: convertTextFormatElement,
					priority: 0
				}),
				sup: () => ({
					conversion: convertTextFormatElement,
					priority: 0
				}),
				u: () => ({
					conversion: convertTextFormatElement,
					priority: 0
				})
			},
			json: textNodeSchema
		});
	}
	constructor(text = "", key) {
		super(key);
		this.__text = text;
		this.__format = 0;
		this.__style = "";
		this.__mode = 0;
		this.__detail = 0;
	}
	/**
	* Returns a 32-bit integer that represents the TextFormatTypes currently applied to the
	* TextNode. You probably don't want to use this method directly - consider using TextNode.hasFormat instead.
	*
	* @returns a number representing the format of the text node.
	*/
	getFormat() {
		return this.getLatest().__format;
	}
	/**
	* Returns a 32-bit integer that represents the TextDetailTypes currently applied to the
	* TextNode. You probably don't want to use this method directly - consider using TextNode.isDirectionless
	* or TextNode.isUnmergeable instead.
	*
	* @returns a number representing the detail of the text node.
	*/
	getDetail() {
		return this.getLatest().__detail;
	}
	/**
	* Returns the mode (TextModeType) of the TextNode, which may be "normal", "token", or "segmented"
	*
	* @returns TextModeType.
	*/
	getMode() {
		return TEXT_TYPE_TO_MODE[this.getLatest().__mode];
	}
	/**
	* Returns the styles currently applied to the node. This is analogous to CSSText in the DOM.
	*
	* @returns CSSText-like string of styles applied to the underlying DOM node.
	*/
	getStyle() {
		return this.getLatest().__style;
	}
	/**
	* Returns whether or not the node is in "token" mode. TextNodes in token mode can be navigated through character-by-character
	* with a RangeSelection, but are deleted as a single entity (not individually by character).
	*
	* @returns true if the node is in token mode, false otherwise.
	*/
	isToken() {
		return this.getLatest().__mode === 1;
	}
	/**
	*
	* @returns true if Lexical detects that an IME or other 3rd-party script is attempting to
	* mutate the TextNode, false otherwise.
	*/
	isComposing() {
		return this.__key === $getCompositionKey();
	}
	/**
	* Returns whether or not the node is in "segmented" mode. TextNodes in segmented mode can be navigated through character-by-character
	* with a RangeSelection, but are deleted in space-delimited "segments".
	*
	* @returns true if the node is in segmented mode, false otherwise.
	*/
	isSegmented() {
		return this.getLatest().__mode === 2;
	}
	/**
	* Returns whether or not the node is "directionless". Directionless nodes don't respect changes between RTL and LTR modes.
	*
	* @returns true if the node is directionless, false otherwise.
	*/
	isDirectionless() {
		return (this.getLatest().__detail & 1) !== 0;
	}
	/**
	* Returns whether or not the node is unmergeable. In some scenarios, Lexical tries to merge
	* adjacent TextNodes into a single TextNode. If a TextNode is unmergeable, this won't happen.
	*
	* @returns true if the node is unmergeable, false otherwise.
	*/
	isUnmergeable() {
		return (this.getLatest().__detail & 2) !== 0;
	}
	/**
	* Returns whether or not the node has the provided format applied. Use this with the human-readable TextFormatType
	* string values to get the format of a TextNode.
	*
	* @param type - the TextFormatType to check for.
	*
	* @returns true if the node has the provided format, false otherwise.
	*/
	hasFormat(type) {
		const formatFlag = TEXT_TYPE_TO_FORMAT[type];
		return (this.getFormat() & formatFlag) !== 0;
	}
	/**
	* Returns whether or not the node is simple text. Simple text is defined as a TextNode that has the string type "text"
	* (i.e., not a subclass) and has no mode applied to it (i.e., not segmented or token).
	*
	* @returns true if the node is simple text, false otherwise.
	*/
	isSimpleText() {
		const self = this.getLatest();
		return self.__type === "text" && self.__mode === 0;
	}
	/**
	* Returns the text content of the node as a string.
	*
	* @returns a string representing the text content of the node.
	*/
	getTextContent() {
		return this.getLatest().__text;
	}
	/**
	* Returns the format flags applied to the node as a 32-bit integer.
	*
	* @returns a number representing the TextFormatTypes applied to the node.
	*/
	getFormatFlags(type, alignWithFormat) {
		const format = this.getLatest().__format;
		return toggleTextFormatType(format, type, alignWithFormat);
	}
	/**
	*
	* @returns true if the text node supports font styling, false otherwise.
	*/
	canHaveFormat() {
		return true;
	}
	/**
	* @returns true if the text node is inline, false otherwise.
	*/
	isInline() {
		return true;
	}
	createDOM(config, editor) {
		const format = this.__format;
		const outerTag = getElementOuterTag(this, format);
		const innerTag = getElementInnerTag(this, format);
		const tag = outerTag === null ? innerTag : outerTag;
		const dom = $getDocument().createElement(tag);
		let innerDOM = dom;
		if (this.hasFormat("code")) dom.setAttribute("spellcheck", "false");
		if (outerTag !== null) {
			innerDOM = $getDocument().createElement(innerTag);
			dom.appendChild(innerDOM);
		}
		const text = this.__text;
		$createTextInnerDOM(innerDOM, this, innerTag, format, text, config);
		const style = this.__style;
		if (style !== "") setDOMStyleFromCSS(dom.style, style);
		return dom;
	}
	updateDOM(prevNode, dom, config) {
		const nextText = this.__text;
		const prevFormat = prevNode.__format;
		const nextFormat = this.__format;
		const prevOuterTag = getElementOuterTag(this, prevFormat);
		const nextOuterTag = getElementOuterTag(this, nextFormat);
		const prevInnerTag = getElementInnerTag(this, prevFormat);
		const nextInnerTag = getElementInnerTag(this, nextFormat);
		if ((prevOuterTag === null ? prevInnerTag : prevOuterTag) !== (nextOuterTag === null ? nextInnerTag : nextOuterTag)) return true;
		if (prevOuterTag === nextOuterTag && prevInnerTag !== nextInnerTag) {
			const prevInnerDOM = dom.firstChild;
			if (prevInnerDOM == null) invariant(false, "updateDOM: prevInnerDOM is null or undefined");
			const nextInnerDOM = $getDocument().createElement(nextInnerTag);
			$createTextInnerDOM(nextInnerDOM, this, nextInnerTag, nextFormat, nextText, config);
			dom.replaceChild(nextInnerDOM, prevInnerDOM);
			return false;
		}
		let innerDOM = dom;
		if (nextOuterTag !== null) {
			if (prevOuterTag !== null) {
				innerDOM = dom.firstChild;
				if (innerDOM == null) invariant(false, "updateDOM: innerDOM is null or undefined");
			}
		}
		$setTextContent(nextText, innerDOM, this);
		const textClassNames = config.theme.text;
		if (textClassNames !== void 0 && prevFormat !== nextFormat) setTextThemeClassNames(nextInnerTag, prevFormat, nextFormat, innerDOM, textClassNames);
		const prevStyle = prevNode.__style;
		const nextStyle = this.__style;
		if (prevStyle !== nextStyle) {
			setDOMStyleFromCSS(dom.style, nextStyle, prevStyle);
			removeEmptyDOMAttribute(dom, "style");
		}
		return false;
	}
	exportDOM(editor) {
		let { element } = super.exportDOM(editor);
		invariant(isHTMLElement(element), "Expected TextNode createDOM to always return a HTMLElement");
		element.style.whiteSpace = "pre-wrap";
		if (this.hasFormat("lowercase")) element.style.textTransform = "lowercase";
		else if (this.hasFormat("uppercase")) element.style.textTransform = "uppercase";
		else if (this.hasFormat("capitalize")) element.style.textTransform = "capitalize";
		if (this.hasFormat("bold")) element = $wrapElementWith(element, "b");
		if (this.hasFormat("italic")) element = $wrapElementWith(element, "i");
		if (this.hasFormat("strikethrough")) element = $wrapElementWith(element, "s");
		if (this.hasFormat("underline")) element = $wrapElementWith(element, "u");
		return { element };
	}
	selectionTransform(prevSelection, nextSelection) {}
	/**
	* Sets the node format to the provided TextFormatType or 32-bit integer. Note that the TextFormatType
	* version of the argument can only specify one format and doing so will remove all other formats that
	* may be applied to the node. For toggling behavior, consider using {@link TextNode.toggleFormat}
	*
	* @param format - TextFormatType or 32-bit integer representing the node format.
	*
	* @returns this TextNode.
	* // TODO 0.12 This should just be a `string`.
	*/
	setFormat(format) {
		const self = this.getWritable();
		self.__format = typeof format === "string" ? TEXT_TYPE_TO_FORMAT[format] : format;
		return self;
	}
	/**
	* Sets the node detail to the provided TextDetailType or 32-bit integer. Note that the TextDetailType
	* version of the argument can only specify one detail value and doing so will remove all other detail values that
	* may be applied to the node. For toggling behavior, consider using {@link TextNode.toggleDirectionless}
	* or {@link TextNode.toggleUnmergeable}
	*
	* @param detail - TextDetailType or 32-bit integer representing the node detail.
	*
	* @returns this TextNode.
	* // TODO 0.12 This should just be a `string`.
	*/
	setDetail(detail) {
		const self = this.getWritable();
		self.__detail = typeof detail === "string" ? DETAIL_TYPE_TO_DETAIL[detail] : detail;
		return self;
	}
	/**
	* Sets the node style to the provided CSSText-like string. Set this property as you
	* would an HTMLElement style attribute to apply inline styles to the underlying DOM Element.
	*
	* @param style - CSSText to be applied to the underlying HTMLElement.
	*
	* @returns this TextNode.
	*/
	setStyle(style) {
		const self = this.getWritable();
		self.__style = style;
		return self;
	}
	/**
	* Applies the provided format to this TextNode if it's not present. Removes it if it's present.
	* The subscript and superscript formats are mutually exclusive.
	* Prefer using this method to turn specific formats on and off.
	*
	* @param type - TextFormatType to toggle.
	*
	* @returns this TextNode.
	*/
	toggleFormat(type) {
		const newFormat = toggleTextFormatType(this.getFormat(), type, null);
		return this.setFormat(newFormat);
	}
	/**
	* Toggles the directionless detail value of the node. Prefer using this method over setDetail.
	*
	* @returns this TextNode.
	*/
	toggleDirectionless() {
		const self = this.getWritable();
		self.__detail ^= 1;
		return self;
	}
	/**
	* Toggles the unmergeable detail value of the node. Prefer using this method over setDetail.
	*
	* @returns this TextNode.
	*/
	toggleUnmergeable() {
		const self = this.getWritable();
		self.__detail ^= 2;
		return self;
	}
	/**
	* Sets the mode of the node.
	*
	* Note: during IME composition, a segmented TextNode may be temporarily
	* switched to normal mode to preserve the DOM element that the browser's
	* composition tracker is bound to. Subclass transforms or method overrides
	* that assume the node is always in segmented mode should account for this
	* transient state.
	*
	* @returns this TextNode.
	*/
	setMode(type) {
		const mode = TEXT_MODE_TO_TYPE[type];
		if (this.getLatest().__mode === mode) return this;
		const self = this.getWritable();
		self.__mode = mode;
		return self;
	}
	/**
	* Sets the text content of the node.
	*
	* @param text - the string to set as the text value of the node.
	*
	* @returns this TextNode.
	*/
	setTextContent(text) {
		if (this.getLatest().__text === text) return this;
		const self = this.getWritable();
		self.__text = text;
		return self;
	}
	/**
	* Sets the current Lexical selection to be a RangeSelection with anchor and focus on this TextNode at the provided offsets.
	*
	* @param _anchorOffset - the offset at which the Selection anchor will be placed.
	* @param _focusOffset - the offset at which the Selection focus will be placed.
	*
	* @returns the new RangeSelection.
	*/
	select(_anchorOffset, _focusOffset) {
		errorOnReadOnly();
		let anchorOffset = _anchorOffset;
		let focusOffset = _focusOffset;
		const selection = $getSelection();
		const text = this.getTextContent();
		const key = this.__key;
		if (typeof text === "string") {
			const lastOffset = text.length;
			if (anchorOffset === void 0) anchorOffset = lastOffset;
			if (focusOffset === void 0) focusOffset = lastOffset;
		} else {
			anchorOffset = 0;
			focusOffset = 0;
		}
		if (!$isRangeSelection(selection)) return $internalMakeRangeSelection(key, anchorOffset, key, focusOffset, "text", "text");
		else {
			const compositionKey = $getCompositionKey();
			if (compositionKey === selection.anchor.key || compositionKey === selection.focus.key) $setCompositionKey(key);
			selection.setTextNodeRange(this, anchorOffset, this, focusOffset);
		}
		return selection;
	}
	selectStart() {
		return this.select(0, 0);
	}
	selectEnd() {
		const size = this.getTextContentSize();
		return this.select(size, size);
	}
	/**
	* Inserts the provided text into this TextNode at the provided offset, deleting the number of characters
	* specified. Can optionally calculate a new selection after the operation is complete.
	*
	* @param offset - the offset at which the splice operation should begin.
	* @param delCount - the number of characters to delete, starting from the offset.
	* @param newText - the text to insert into the TextNode at the offset.
	* @param moveSelection - optional, whether or not to move selection to the end of the inserted substring.
	*
	* @returns this TextNode.
	*/
	spliceText(offset, delCount, newText, moveSelection) {
		const writableSelf = this.getWritable();
		const text = writableSelf.__text;
		const handledTextLength = newText.length;
		let index = offset;
		if (index < 0) {
			index = handledTextLength + index;
			if (index < 0) index = 0;
		}
		const selection = $getSelection();
		if (moveSelection && $isRangeSelection(selection)) {
			const newOffset = offset + handledTextLength;
			selection.setTextNodeRange(writableSelf, newOffset, writableSelf, newOffset);
		}
		writableSelf.__text = text.slice(0, index) + newText + text.slice(index + delCount);
		return writableSelf;
	}
	/**
	* This method is meant to be overridden by TextNode subclasses to control the behavior of those nodes
	* when a user event would cause text to be inserted before them in the editor. If true, Lexical will attempt
	* to insert text into this node. If false, it will insert the text in a new sibling node.
	*
	* @returns true if text can be inserted before the node, false otherwise.
	*/
	canInsertTextBefore() {
		return true;
	}
	/**
	* This method is meant to be overridden by TextNode subclasses to control the behavior of those nodes
	* when a user event would cause text to be inserted after them in the editor. If true, Lexical will attempt
	* to insert text into this node. If false, it will insert the text in a new sibling node.
	*
	* @returns true if text can be inserted after the node, false otherwise.
	*/
	canInsertTextAfter() {
		return true;
	}
	/**
	* Splits this TextNode at the provided character offsets, forming new TextNodes from the substrings
	* formed by the split, and inserting those new TextNodes into the editor, replacing the one that was split.
	*
	* @param splitOffsets - rest param of the text content character offsets at which this node should be split.
	*
	* @returns an Array containing the newly-created TextNodes.
	*/
	splitText(...splitOffsets) {
		errorOnReadOnly();
		const self = this.getLatest();
		const textContent = self.getTextContent();
		if (textContent === "") return [];
		const key = self.__key;
		const compositionKey = $getCompositionKey();
		const textLength = textContent.length;
		splitOffsets.sort((a, b) => a - b);
		splitOffsets.push(textLength);
		const parts = [];
		const splitOffsetsLength = splitOffsets.length;
		for (let start = 0, offsetIndex = 0; start < textLength && offsetIndex <= splitOffsetsLength; offsetIndex++) {
			const end = splitOffsets[offsetIndex];
			if (end > start) {
				parts.push(textContent.slice(start, end));
				start = end;
			}
		}
		const partsLength = parts.length;
		if (partsLength === 1) return [self];
		const firstPart = parts[0];
		const parent = self.getParent();
		let writableNode;
		const format = self.getFormat();
		const style = self.getStyle();
		const detail = self.__detail;
		let hasReplacedSelf = false;
		let startTextPoint = null;
		let endTextPoint = null;
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			const [startPoint, endPoint] = selection.isBackward() ? [selection.focus, selection.anchor] : [selection.anchor, selection.focus];
			if (startPoint.type === "text" && startPoint.key === key) startTextPoint = startPoint;
			if (endPoint.type === "text" && endPoint.key === key) endTextPoint = endPoint;
		}
		if (self.isSegmented()) {
			writableNode = $createTextNode(firstPart);
			writableNode.__format = format;
			writableNode.__style = style;
			writableNode.__detail = detail;
			writableNode.__state = $cloneNodeState(self, writableNode);
			hasReplacedSelf = true;
		} else writableNode = self.setTextContent(firstPart);
		const splitNodes = [writableNode];
		let textSize = firstPart.length;
		for (let i = 1; i < partsLength; i++) {
			const part = parts[i];
			const partSize = part.length;
			const sibling = $createTextNode(part);
			sibling.__format = format;
			sibling.__style = style;
			sibling.__detail = detail;
			sibling.__state = $cloneNodeState(self, sibling);
			const siblingKey = sibling.__key;
			const nextTextSize = textSize + partSize;
			if (compositionKey === key) $setCompositionKey(siblingKey);
			textSize = nextTextSize;
			splitNodes.push(sibling);
		}
		const originalStartOffset = startTextPoint ? startTextPoint.offset : null;
		const originalEndOffset = endTextPoint ? endTextPoint.offset : null;
		let startOffset = 0;
		for (const node of splitNodes) {
			if (!(startTextPoint || endTextPoint)) break;
			const endOffset = startOffset + node.getTextContentSize();
			if (startTextPoint !== null && originalStartOffset !== null && originalStartOffset <= endOffset && originalStartOffset >= startOffset) {
				startTextPoint.set(node.getKey(), originalStartOffset - startOffset, "text");
				if (originalStartOffset < endOffset) startTextPoint = null;
			}
			if (endTextPoint !== null && originalEndOffset !== null && originalEndOffset <= endOffset && originalEndOffset >= startOffset) {
				endTextPoint.set(node.getKey(), originalEndOffset - startOffset, "text");
				break;
			}
			startOffset = endOffset;
		}
		if (parent !== null) {
			internalMarkSiblingsAsDirty(this);
			const writableParent = parent.getWritable();
			const insertionIndex = this.getIndexWithinParent();
			if (hasReplacedSelf) {
				writableParent.splice(insertionIndex, 0, splitNodes);
				this.remove();
			} else writableParent.splice(insertionIndex, 1, splitNodes);
			if ($isRangeSelection(selection)) $updateElementSelectionOnCreateDeleteNode(selection, parent, insertionIndex, partsLength - 1);
		}
		return splitNodes;
	}
	/**
	* Merges the target TextNode into this TextNode, removing the target node.
	*
	* @param target - the TextNode to merge into this one.
	*
	* @returns this TextNode.
	*/
	mergeWithSibling(target) {
		const isBefore = target === this.getPreviousSibling();
		if (!isBefore && target !== this.getNextSibling()) invariant(false, "mergeWithSibling: sibling must be a previous or next sibling");
		const key = this.__key;
		const targetKey = target.__key;
		const text = this.__text;
		const textLength = text.length;
		if ($getCompositionKey() === targetKey) $setCompositionKey(key);
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			const anchor = selection.anchor;
			const focus = selection.focus;
			if (anchor !== null && anchor.key === targetKey) adjustPointOffsetForMergedSibling(anchor, isBefore, key, target, textLength);
			if (focus !== null && focus.key === targetKey) adjustPointOffsetForMergedSibling(focus, isBefore, key, target, textLength);
		}
		const targetText = target.__text;
		const newText = isBefore ? targetText + text : text + targetText;
		this.setTextContent(newText);
		const writableSelf = this.getWritable();
		target.remove();
		return writableSelf;
	}
	/**
	* This method is meant to be overridden by TextNode subclasses to control the behavior of those nodes
	* when used with the registerLexicalTextEntity function. If you're using registerLexicalTextEntity, the
	* node class that you create and replace matched text with should return true from this method.
	*
	* @returns true if the node is to be treated as a "text entity", false otherwise.
	*/
	isTextEntity() {
		return false;
	}
};
function convertSpanElement(domNode) {
	const style = domNode.style;
	return {
		forChild: applyTextFormatFromStyle(style),
		node: null
	};
}
function convertBringAttentionToElement(domNode) {
	const b = domNode;
	const hasNormalFontWeight = b.style.fontWeight === "normal";
	return {
		forChild: applyTextFormatFromStyle(b.style, hasNormalFontWeight ? void 0 : "bold"),
		node: null
	};
}
var preParentCache = /* @__PURE__ */ new WeakMap();
function isNodePre(node) {
	if (!isHTMLElement(node)) return false;
	else if (node.nodeName === "PRE") return true;
	const whiteSpace = node.style.whiteSpace;
	return typeof whiteSpace === "string" && whiteSpace.startsWith("pre");
}
function findParentPreDOMNode(node) {
	let cached;
	let parent = node.parentNode;
	const visited = [node];
	while (parent !== null && (cached = preParentCache.get(parent)) === void 0 && !isNodePre(parent)) {
		visited.push(parent);
		parent = parent.parentNode;
	}
	const resultNode = cached === void 0 ? parent : cached;
	for (let i = 0; i < visited.length; i++) preParentCache.set(visited[i], resultNode);
	return resultNode;
}
function $convertTextDOMNode(domNode) {
	const domNode_ = domNode;
	const parentDom = domNode.parentElement;
	invariant(parentDom !== null, "Expected parentElement of Text not to be null");
	let textContent = domNode_.textContent || "";
	if (findParentPreDOMNode(domNode_) !== null) return { node: $generateNodesFromRawText(textContent) };
	textContent = textContent.replace(/\r/g, "").replace(/[ \t\n]+/g, " ");
	if (textContent === "") return { node: null };
	if (textContent[0] === " ") {
		let previousText = domNode_;
		let isStartOfLine = true;
		while (previousText !== null && (previousText = findTextInLine(previousText, false)) !== null) {
			const previousTextContent = previousText.textContent || "";
			if (previousTextContent.length > 0) {
				if (/[ \t\n]$/.test(previousTextContent)) textContent = textContent.slice(1);
				isStartOfLine = false;
				break;
			}
		}
		if (isStartOfLine) textContent = textContent.slice(1);
	}
	if (textContent[textContent.length - 1] === " ") {
		let nextText = domNode_;
		let isEndOfLine = true;
		while (nextText !== null && (nextText = findTextInLine(nextText, true)) !== null) if ((nextText.textContent || "").replace(/^( |\t|\r?\n)+/, "").length > 0) {
			isEndOfLine = false;
			break;
		}
		if (isEndOfLine) textContent = textContent.slice(0, textContent.length - 1);
	}
	if (textContent === "") return { node: null };
	return { node: $createTextNode(textContent) };
}
function findTextInLine(text, forward) {
	let node = text;
	while (true) {
		let sibling;
		while ((sibling = forward ? node.nextSibling : node.previousSibling) === null) {
			const parentElement = node.parentElement;
			if (parentElement === null) return null;
			node = parentElement;
		}
		node = sibling;
		if (isHTMLElement(node)) {
			const display = node.style.display;
			if (display === "" && !isInlineDomNode(node) || display !== "" && !display.startsWith("inline")) return null;
		}
		let descendant = node;
		while ((descendant = forward ? node.firstChild : node.lastChild) !== null) node = descendant;
		if (isDOMTextNode(node)) return node;
		else if (node.nodeName === "BR") return null;
	}
}
var nodeNameToTextFormat = {
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
function convertTextFormatElement(domNode) {
	const format = nodeNameToTextFormat[domNode.nodeName.toLowerCase()];
	if (format === void 0) return { node: null };
	return {
		forChild: applyTextFormatFromStyle(domNode.style, format),
		node: null
	};
}
/** Creates a TextNode initialized with the given text, defaulting to empty. */
function $createTextNode(text = "") {
	return $applyNodeReplacement(new TextNode(text));
}
/** Returns true if the given node is a TextNode. */
function $isTextNode(node) {
	return node instanceof TextNode;
}
function applyTextFormatFromStyle(style, shouldApply) {
	const fontWeight = style.fontWeight;
	const textDecoration = style.textDecoration.split(" ");
	const hasBoldFontWeight = fontWeight === "700" || fontWeight === "bold";
	const hasLinethroughTextDecoration = textDecoration.includes("line-through");
	const hasItalicFontStyle = style.fontStyle === "italic";
	const hasUnderlineTextDecoration = textDecoration.includes("underline");
	const verticalAlign = style.verticalAlign;
	const textTransform = style.textTransform;
	return (lexicalNode) => {
		if (!$isTextNode(lexicalNode) && !$isInlineFormattable(lexicalNode)) return lexicalNode;
		if (hasBoldFontWeight && !lexicalNode.hasFormat("bold")) lexicalNode.toggleFormat("bold");
		if (hasLinethroughTextDecoration && !lexicalNode.hasFormat("strikethrough")) lexicalNode.toggleFormat("strikethrough");
		if (hasItalicFontStyle && !lexicalNode.hasFormat("italic")) lexicalNode.toggleFormat("italic");
		if (hasUnderlineTextDecoration && !lexicalNode.hasFormat("underline")) lexicalNode.toggleFormat("underline");
		if (verticalAlign === "sub" && !lexicalNode.hasFormat("subscript")) lexicalNode.toggleFormat("subscript");
		if (verticalAlign === "super" && !lexicalNode.hasFormat("superscript")) lexicalNode.toggleFormat("superscript");
		if ((textTransform === "lowercase" || textTransform === "uppercase" || textTransform === "capitalize") && !lexicalNode.hasFormat(textTransform)) lexicalNode.toggleFormat(textTransform);
		if (shouldApply && !lexicalNode.hasFormat(shouldApply)) lexicalNode.toggleFormat(shouldApply);
		return lexicalNode;
	};
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/nodes/LexicalTabNode.ts
var tabNodeSchema = nodeSchema()({
	detail: withAccessors(numberValue(2), {
		getter: { field: "__detail" },
		setter: null
	}),
	mode: withAccessors(enumValue(["normal"]), {
		getter: {
			field: "__mode",
			getterTable: { 0: "normal" }
		},
		setter: null
	}),
	text: withAccessors(stringValue("	"), {
		getter: {
			field: "__text",
			method: "getTextContent"
		},
		setter: null
	})
});
/** @noInheritDoc */
var TabNode = class extends TextNode {
	$config() {
		return this.config("tab", {
			extends: TextNode,
			generated: GENERATED_TAB,
			json: tabNodeSchema
		});
	}
	constructor(key = void 0) {
		super("	", key);
		this.__detail = 2;
	}
	createDOM(config) {
		const dom = super.createDOM(config);
		const classNames = getCachedClassNameArray(config.theme, "tab");
		if (classNames !== void 0) dom.classList.add(...classNames);
		return dom;
	}
	/**
	* Always normalizes the stored content to `'\t'` regardless of input — see
	* comment below for the rationale.
	*/
	setTextContent(_text) {
		return super.setTextContent("	");
	}
	spliceText(offset, delCount, newText, moveSelection) {
		invariant(newText === "" && delCount === 0 || newText === "	" && delCount === 1, "TabNode does not support spliceText");
		return this;
	}
	setDetail(detail) {
		invariant(detail === 2, "TabNode does not support setDetail");
		return this;
	}
	setMode(type) {
		invariant(type === "normal", "TabNode does not support setMode");
		return this;
	}
	canInsertTextBefore() {
		return false;
	}
	canInsertTextAfter() {
		return false;
	}
};
/** Creates a TabNode representing a horizontal tab character. */
function $createTabNode() {
	return $applyNodeReplacement(new TabNode());
}
/** Returns true if the given node is a TabNode. */
function $isTabNode(node) {
	return node instanceof TabNode;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalSelection.ts
var Point = class {
	key;
	offset;
	type;
	_selection;
	constructor(key, offset, type) {
		this._selection = null;
		this.key = key;
		this.offset = offset;
		this.type = type;
	}
	is(point) {
		return this.key === point.key && this.offset === point.offset && this.type === point.type;
	}
	isBefore(b) {
		if (this.key === b.key) return this.offset < b.offset;
		return $comparePointCaretNext($normalizeCaret($caretFromPoint(this, "next")), $normalizeCaret($caretFromPoint(b, "next"))) < 0;
	}
	getNode() {
		const key = this.key;
		const node = $getNodeByKey(key);
		if (node === null) invariant(false, "Point.getNode: node not found");
		return node;
	}
	set(key, offset, type, onlyIfChanged) {
		const selection = this._selection;
		const oldKey = this.key;
		if (onlyIfChanged && this.key === key && this.offset === offset && this.type === type) return;
		this.key = key;
		this.offset = offset;
		this.type = type;
		if (!isCurrentlyReadOnlyMode()) {
			if ($getCompositionKey() === oldKey) $setCompositionKey(key);
			if (selection !== null) {
				selection.setCachedNodes(null);
				if ($isRangeSelection(selection)) selection._cachedIsBackward = null;
				selection.dirty = true;
			}
		}
	}
};
/** Creates a selection endpoint (Point) targeting the given node key at the specified offset. */
function $createPoint(key, offset, type) {
	return new Point(key, offset, type);
}
function selectPointOnNode(point, node) {
	let key = node.__key;
	let offset = point.offset;
	let type = "element";
	if ($isTextNode(node)) {
		type = "text";
		const textContentLength = node.getTextContentSize();
		if (offset > textContentLength) offset = textContentLength;
	} else if (!$isElementNode(node)) {
		const nextSibling = node.getNextSibling();
		if ($isTextNode(nextSibling)) {
			key = nextSibling.__key;
			offset = 0;
			type = "text";
		} else {
			const parentNode = node.getParent();
			if (parentNode) {
				key = parentNode.__key;
				offset = node.getIndexWithinParent() + 1;
			}
		}
	}
	point.set(key, offset, type);
}
function $moveSelectionPointToEnd(point, node) {
	if ($isElementNode(node)) {
		const lastNode = node.getLastDescendant();
		if ($isElementNode(lastNode) || $isTextNode(lastNode)) selectPointOnNode(point, lastNode);
		else selectPointOnNode(point, node);
	} else selectPointOnNode(point, node);
}
function $transferStartingElementPointToTextPoint(start, end, format, style) {
	const element = start.getNode();
	const placementNode = element.getChildAtIndex(start.offset);
	const textNode = $createTextNode();
	textNode.setFormat(format);
	textNode.setStyle(style);
	if ($isParagraphNode(placementNode)) placementNode.splice(0, 0, [textNode]);
	else if (placementNode !== null) {
		const target = $isRootOrShadowRoot(element) ? $createParagraphNode().append(textNode) : textNode;
		placementNode.insertBefore(target);
	} else if ($isRootOrShadowRoot(element)) {
		const lastChild = element.getLastChild();
		if ($isElementNode(lastChild) && !lastChild.isInline() && lastChild.isEmpty()) lastChild.append(textNode);
		else element.append($createParagraphNode().append(textNode));
	} else element.append(textNode);
	if (start.is(end)) end.set(textNode.__key, 0, "text");
	start.set(textNode.__key, 0, "text");
}
function $insertTextAtPoint(selection, text, format, style) {
	const anchorNode = selection.anchor.getNode();
	invariant($isTextNode(anchorNode), "insertText: anchor is not a text node");
	const offset = selection.anchor.offset;
	const textNode = $createTextNode(text);
	textNode.setFormat(format);
	textNode.setStyle(style);
	const parent = anchorNode.getParentOrThrow();
	if (offset === 0) {
		if (parent.isInline() && !anchorNode.__prev) parent.insertBefore(textNode);
		else anchorNode.insertBefore(textNode, false);
	} else if (offset === anchorNode.getTextContentSize()) {
		if (parent.isInline() && !anchorNode.__next) parent.insertAfter(textNode);
		else anchorNode.insertAfter(textNode, false);
	} else {
		const [before] = anchorNode.splitText(offset);
		before.insertAfter(textNode, false);
	}
	if (anchorNode.getTextContent() === "" && anchorNode.isAttached()) anchorNode.remove();
	textNode.selectEnd();
	if (textNode.isComposing() && selection.anchor.type === "text") selection.anchor.set(selection.anchor.key, selection.anchor.offset - text.length, selection.anchor.type);
}
var NodeSelection = class NodeSelection {
	_nodes;
	_cachedNodes;
	dirty;
	constructor(objects) {
		this._cachedNodes = null;
		this._nodes = objects;
		this.dirty = false;
	}
	getCachedNodes() {
		return this._cachedNodes;
	}
	setCachedNodes(nodes) {
		this._cachedNodes = nodes;
	}
	is(selection) {
		if (!$isNodeSelection(selection)) return false;
		const a = this._nodes;
		const b = selection._nodes;
		return a.size === b.size && Array.from(a).every((key) => b.has(key));
	}
	isCollapsed() {
		return false;
	}
	isBackward() {
		return false;
	}
	getStartEndPoints() {
		return null;
	}
	add(key) {
		this.dirty = true;
		this._nodes.add(key);
		this._cachedNodes = null;
	}
	delete(key) {
		this.dirty = true;
		this._nodes.delete(key);
		this._cachedNodes = null;
	}
	clear() {
		this.dirty = true;
		this._nodes.clear();
		this._cachedNodes = null;
	}
	has(key) {
		return this._nodes.has(key);
	}
	clone() {
		return new NodeSelection(new Set(this._nodes));
	}
	extract() {
		return this.getNodes();
	}
	insertRawText(text) {}
	insertText() {}
	insertNodes(nodes) {
		const selectedNodes = this.getNodes().filter((node) => $getSlotHostKey(node) === null);
		const selectedNodesLength = selectedNodes.length;
		if (selectedNodesLength === 0) return;
		const lastSelectedNode = selectedNodes[selectedNodesLength - 1];
		let selectionAtEnd;
		if ($isTextNode(lastSelectedNode)) selectionAtEnd = lastSelectedNode.select();
		else {
			const index = lastSelectedNode.getIndexWithinParent() + 1;
			selectionAtEnd = lastSelectedNode.getParentOrThrow().select(index, index);
		}
		selectionAtEnd.insertNodes(nodes);
		for (let i = 0; i < selectedNodesLength; i++) selectedNodes[i].remove();
	}
	getNodes() {
		const cachedNodes = this._cachedNodes;
		if (cachedNodes !== null) return cachedNodes;
		const objects = this._nodes;
		const nodes = [];
		for (const object of objects) {
			const node = $getNodeByKey(object);
			if (node !== null) nodes.push(node);
		}
		if (!isCurrentlyReadOnlyMode()) this._cachedNodes = nodes;
		return nodes;
	}
	getTextContent() {
		const nodes = this.getNodes();
		let textContent = "";
		for (let i = 0; i < nodes.length; i++) textContent += nodes[i].getTextContent();
		return textContent;
	}
	/**
	* Remove all nodes in the NodeSelection. If there were any nodes,
	* replace the selection with a new RangeSelection at the previous
	* location of the first node.
	*/
	deleteNodes() {
		const nodes = this.getNodes().filter((node) => $getSlotHostKey(node) === null);
		if (($getSelection() || $getPreviousSelection()) === this && nodes[0]) {
			const firstCaret = $getSiblingCaret(nodes[0], "next");
			$setSelectionFromCaretRange($getCaretRange(firstCaret, firstCaret));
		}
		for (const node of nodes) node.remove();
		$ensureRootHasParagraph();
	}
};
function $ensureRootHasParagraph() {
	const root = $getRoot();
	if (root.getChildrenSize() === 0 && $getSelectionSlotFrame($getSelection()) === null) {
		const paragraph = $createParagraphNode();
		root.append(paragraph);
		paragraph.select();
	}
}
/**
* The node immediately before the given point within its block, looking
* through the boundaries of inline elements: a point at the start of a link's
* text is still "after" whatever precedes the link. Returns null when text or
* nothing at all precedes the point in its block.
*/
function $getNodeBeforePoint(point) {
	const node = point.getNode();
	if (point.offset > 0) return point.type === "element" && $isElementNode(node) ? node.getChildAtIndex(point.offset - 1) : null;
	for (let child = node; child !== null && !INTERNAL_$isBlock(child) && !$isRootOrShadowRoot(child); child = child.getParent()) {
		const previousSibling = child.getPreviousSibling();
		if (previousSibling !== null) return previousSibling;
	}
	return null;
}
/**
* Two consecutive soft line breaks render an empty line. A point directly
* after them starts a new visual paragraph, with nothing to its left to
* continue, so blocks inserted there behave as they do at the start of a
* block: they keep their own block identity instead of being flattened into
* the text above the empty line (#4815).
*
* A single line break is deliberately not enough. It would be the more
* consistent rule -- the point is just as much at the start of a line -- but
* it also decides that a lone pasted paragraph stops continuing the line and
* becomes its own block, which is a wider change to paste than this fix
* should make.
*/
function $isPointAfterEmptyLine(point) {
	const nodeBefore = $getNodeBeforePoint(point);
	return $isLineBreakNode(nodeBefore) && $isLineBreakNode(nodeBefore.getPreviousSibling());
}
/** Returns true if the given value is a RangeSelection. */
function $isRangeSelection(x) {
	return x instanceof RangeSelection;
}
var RangeSelection = class RangeSelection {
	format;
	style;
	anchor;
	focus;
	_cachedNodes;
	/** @internal */
	_cachedIsBackward;
	dirty;
	constructor(anchor, focus, format, style) {
		this.anchor = anchor;
		this.focus = focus;
		anchor._selection = this;
		focus._selection = this;
		this._cachedNodes = null;
		this._cachedIsBackward = null;
		this.format = format;
		this.style = style;
		this.dirty = false;
	}
	getCachedNodes() {
		return this._cachedNodes;
	}
	setCachedNodes(nodes) {
		this._cachedNodes = nodes;
	}
	/**
	* Used to check if the provided selections is equal to this one by value,
	* including anchor, focus, format, and style properties.
	* @param selection - the Selection to compare this one to.
	* @returns true if the Selections are equal, false otherwise.
	*/
	is(selection) {
		if (!$isRangeSelection(selection)) return false;
		return this.anchor.is(selection.anchor) && this.focus.is(selection.focus) && this.format === selection.format && this.style === selection.style;
	}
	/**
	* Returns whether the Selection is "collapsed", meaning the anchor and focus are
	* the same node and have the same offset.
	*
	* @returns true if the Selection is collapsed, false otherwise.
	*/
	isCollapsed() {
		return this.anchor.is(this.focus);
	}
	/**
	* Gets all the nodes in the Selection. Uses caching to make it generally suitable
	* for use in hot paths.
	*
	* See also the {@link CaretRange} APIs (starting with
	* {@link $caretRangeFromSelection}), which are likely to provide a better
	* foundation for any operation where partial selection is relevant
	* (e.g. the anchor or focus are inside an ElementNode and TextNode)
	*
	* @returns an Array containing all the nodes in the Selection
	*/
	getNodes() {
		const cachedNodes = this._cachedNodes;
		if (cachedNodes !== null) return cachedNodes;
		const nodes = $getNodesFromCaretRangeCompat($getCaretRangeInDirection($caretRangeFromSelection(this), "next"));
		if (!isCurrentlyReadOnlyMode()) this._cachedNodes = nodes;
		return nodes;
	}
	/**
	* Sets this Selection to be of type "text" at the provided anchor and focus values.
	*
	* @param anchorNode - the anchor node to set on the Selection
	* @param anchorOffset - the offset to set on the Selection
	* @param focusNode - the focus node to set on the Selection
	* @param focusOffset - the focus offset to set on the Selection
	*/
	setTextNodeRange(anchorNode, anchorOffset, focusNode, focusOffset) {
		this.anchor.set(anchorNode.__key, anchorOffset, "text");
		this.focus.set(focusNode.__key, focusOffset, "text");
		return this;
	}
	/**
	* Gets the (plain) text content of all the nodes in the selection.
	*
	* @returns a string representing the text content of all the nodes in the Selection
	*/
	getTextContent() {
		const nodes = this.getNodes();
		if (nodes.length === 0) return "";
		const firstNode = nodes[0];
		const lastNode = nodes[nodes.length - 1];
		const anchor = this.anchor;
		const focus = this.focus;
		const isBefore = anchor.isBefore(focus);
		const [anchorOffset, focusOffset] = $getCharacterOffsets(this);
		let textContent = "";
		let prevWasElement = true;
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if ($isElementNode(node) && !node.isInline()) {
				if (!prevWasElement) textContent += "\n";
				let slotText = "";
				for (const slotName of $getSlotNames(node)) {
					const slot = $getSlot(node, slotName);
					if (slot !== null) slotText += slot.getTextContent();
				}
				if (slotText !== "") {
					textContent += slotText;
					prevWasElement = false;
				} else if (node.isEmpty()) prevWasElement = false;
				else prevWasElement = true;
			} else {
				prevWasElement = false;
				if ($isTextNode(node)) {
					let text = node.getTextContent();
					if (node === firstNode) {
						if (node === lastNode) {
							if (anchor.type !== "element" || focus.type !== "element" || focus.offset === anchor.offset) text = anchorOffset < focusOffset ? text.slice(anchorOffset, focusOffset) : text.slice(focusOffset, anchorOffset);
						} else text = isBefore ? text.slice(anchorOffset) : text.slice(focusOffset);
					} else if (node === lastNode) text = isBefore ? text.slice(0, focusOffset) : text.slice(0, anchorOffset);
					textContent += text;
				} else if (($isDecoratorNode(node) || $isLineBreakNode(node)) && (node !== lastNode || !this.isCollapsed())) textContent += node.getTextContent();
			}
		}
		return textContent;
	}
	/**
	* Attempts to map a DOM selection range onto this Lexical Selection,
	* setting the anchor, focus, and type accordingly
	*
	* @param range a DOM Selection range conforming to the StaticRange interface.
	*/
	applyDOMRange(range) {
		const editor = getActiveEditor();
		const lastSelection = editor.getEditorState()._selection;
		const resolvedSelectionPoints = $internalResolveSelectionPoints(range.startContainer, range.startOffset, range.endContainer, range.endOffset, editor, lastSelection);
		if (resolvedSelectionPoints === null) return;
		const [anchorPoint, focusPoint, dirty] = resolvedSelectionPoints;
		this.anchor.set(anchorPoint.key, anchorPoint.offset, anchorPoint.type, true);
		this.focus.set(focusPoint.key, focusPoint.offset, focusPoint.type, true);
		if (dirty) this.dirty = true;
		$normalizeSelection(this);
	}
	/**
	* Creates a new RangeSelection, copying over all the property values from this one.
	*
	* @returns a new RangeSelection with the same property values as this one.
	*/
	clone() {
		const anchor = this.anchor;
		const focus = this.focus;
		return new RangeSelection($createPoint(anchor.key, anchor.offset, anchor.type), $createPoint(focus.key, focus.offset, focus.type), this.format, this.style);
	}
	/**
	* Toggles the provided format on all the TextNodes in the Selection.
	*
	* @param format a string TextFormatType to toggle on the TextNodes in the selection
	*/
	toggleFormat(format) {
		this.format = toggleTextFormatType(this.format, format, null);
		this.dirty = true;
	}
	/**
	* Sets the value of the format property on the Selection
	*
	* @param format - the format to set at the value of the format property.
	*/
	setFormat(format) {
		this.format = format;
		this.dirty = true;
	}
	/**
	* Sets the value of the style property on the Selection
	*
	* @param style - the style to set at the value of the style property.
	*/
	setStyle(style) {
		this.style = style;
		this.dirty = true;
	}
	/**
	* Returns whether the provided TextFormatType is present on the Selection. This will be true if all text nodes in the Selection
	* have the specified format.
	*
	* @param type the TextFormatType to check for.
	* @returns true if the provided format is currently toggled on the Selection, false otherwise.
	*/
	hasFormat(type) {
		const formatFlag = TEXT_TYPE_TO_FORMAT[type];
		return (this.format & formatFlag) !== 0;
	}
	/**
	* Attempts to insert the provided text into the EditorState at the current Selection.
	* converts tabs, newlines, and carriage returns into LexicalNodes.
	*
	* @param text the text to insert into the Selection
	*/
	insertRawText(text) {
		this.insertNodes($generateNodesFromRawText(text));
	}
	/**
	* Insert the provided text into the EditorState at the current Selection.
	*
	* @param text the text to insert into the Selection
	*/
	insertText(text) {
		let format = this.format;
		let style = this.style;
		if (!this.isCollapsed()) {
			const firstNode = (this.focus.isBefore(this.anchor) ? this.focus : this.anchor).getNode();
			if ($isTextNode(firstNode)) {
				format = firstNode.getFormat();
				style = firstNode.getStyle();
			}
			this.removeText();
			this.format = format;
			this.style = style;
			if (text === "") return;
			if ($getCompositionKey() === null) {
				if (this.anchor.type === "element") $transferStartingElementPointToTextPoint(this.anchor, this.focus, format, style);
				$insertTextAtPoint(this, text, format, style);
				return;
			}
		}
		if (this.anchor.type === "element") $transferStartingElementPointToTextPoint(this.anchor, this.focus, format, style);
		const anchorNode = this.anchor.getNode();
		invariant($isTextNode(anchorNode), "insertText: anchor is not a text node");
		const offset = this.anchor.offset;
		const anchorParent = anchorNode.getParentOrThrow();
		const anchorSize = anchorNode.getTextContentSize();
		if ($isTokenOrSegmented(anchorNode) || offset === 0 && (!anchorNode.canInsertTextBefore() || !anchorParent.canInsertTextBefore() && !anchorNode.__prev) || offset === anchorSize && (!anchorNode.canInsertTextAfter() || !anchorParent.canInsertTextAfter() && !anchorNode.__next)) {
			if (anchorNode.isSegmented() && offset !== 0 && offset !== anchorSize) {
				if ($getCompositionKey() !== null) anchorNode.setMode("normal").setFormat(format).setStyle(style);
				else {
					const replacement = $createTextNode(anchorNode.getTextContent());
					replacement.setFormat(format);
					replacement.setStyle(style);
					const isCurrentSelection = $getSelection() === this;
					anchorNode.replace(replacement);
					this.setTextNodeRange(replacement, offset, replacement, offset);
					if (isCurrentSelection && $getSelection() !== this) $setSelection(this);
				}
				if (text !== "") this.insertText(text);
				return;
			}
			if (text === "") return;
			if (offset === 0) {
				const prev = anchorNode.getPreviousSibling();
				if ($isTextNode(prev) && prev.canInsertTextAfter() && !$isTokenOrSegmented(prev)) prev.select();
				else {
					const newNode = $createTextNode();
					newNode.setFormat(format);
					newNode.setStyle(style);
					if (!anchorParent.canInsertTextBefore()) anchorParent.insertBefore(newNode);
					else anchorNode.insertBefore(newNode);
					newNode.select();
				}
				this.insertText(text);
				return;
			} else if (offset === anchorSize) {
				const next = anchorNode.getNextSibling();
				if ($isTextNode(next) && next.canInsertTextBefore() && !$isTokenOrSegmented(next)) next.select(0, 0);
				else {
					const newNode = $createTextNode();
					newNode.setFormat(format);
					newNode.setStyle(style);
					if (!anchorParent.canInsertTextAfter()) anchorParent.insertAfter(newNode);
					else anchorNode.insertAfter(newNode);
					newNode.select(0, 0);
				}
				this.insertText(text);
				return;
			}
			const newNode = $createTextNode(text);
			newNode.setFormat(format);
			newNode.setStyle(style);
			anchorNode.replace(newNode);
			newNode.select();
			return;
		}
		if (text === "") return;
		const atStartOfInline = anchorParent.isInline() && offset === 0 && !anchorNode.__prev;
		const atEndOfInline = anchorParent.isInline() && offset === anchorSize && !anchorNode.__next;
		const formatDiffers = anchorNode.getFormat() !== format || anchorNode.getStyle() !== style;
		if (atStartOfInline || atEndOfInline || formatDiffers) {
			if (anchorNode.getTextContent() === "" && !atStartOfInline && !atEndOfInline) {
				anchorNode.setFormat(format);
				anchorNode.setStyle(style);
			} else {
				$insertTextAtPoint(this, text, format, style);
				return;
			}
		}
		anchorNode.spliceText(offset, 0, text, true);
		if (anchorNode.isComposing() && this.anchor.type === "text") this.anchor.set(this.anchor.key, this.anchor.offset - text.length, this.anchor.type);
	}
	/**
	* Removes the text in the Selection, adjusting the EditorState accordingly.
	*/
	removeText() {
		const isCurrentSelection = $getSelection() === this;
		const previousAnchorKey = this.anchor.key;
		const newRange = $removeTextFromCaretRange($caretRangeFromSelection(this));
		$updateRangeSelectionFromCaretRange(this, newRange);
		if (this.isCollapsed()) $internalRefreshSelectionFormatAndStyle(this, previousAnchorKey);
		if (isCurrentSelection && $getSelection() !== this) $setSelection(this);
	}
	/**
	* Applies the provided format to the TextNodes in the Selection, splitting or
	* merging nodes as necessary.
	*
	* @param formatType the format type to apply to the nodes in the Selection.
	* @param alignWithFormat a 32-bit integer representing formatting flags to align with.
	*/
	formatText(formatType, alignWithFormat = null) {
		$formatText(this, formatType, alignWithFormat);
	}
	/**
	* Attempts to "intelligently" insert an arbitrary list of Lexical nodes into the EditorState at the
	* current Selection according to a set of heuristics that determine how surrounding nodes
	* should be changed, replaced, or moved to accommodate the incoming ones.
	*
	* @param nodes - the nodes to insert
	*/
	insertNodes(nodes) {
		if (nodes.length === 0) return;
		if (!this.isCollapsed()) this.removeText();
		const anchorNode = this.anchor.getNode();
		if (this.anchor.type === "element" && $isElementNode(anchorNode) && anchorNode.isShadowRoot() && $getSlotHostKey(anchorNode) !== null) {
			let firstChild = anchorNode.getFirstChild() ?? anchorNode.append($createParagraphNode()).getFirstChild();
			if (firstChild !== null && !$isElementNode(firstChild)) {
				const seed = $createParagraphNode();
				firstChild.insertBefore(seed);
				firstChild = seed;
			}
			if (firstChild !== null) {
				firstChild.selectStart();
				const redirected = $getSelection();
				invariant($isRangeSelection(redirected), "Expected RangeSelection after redirecting into slot subtree");
				return redirected.insertNodes(nodes);
			}
		}
		if (this.anchor.type === "element" && $isRootOrShadowRoot(anchorNode)) {
			const blocksParent = $wrapInlineNodes(nodes);
			const nodeToSelect = blocksParent.getLastDescendant();
			anchorNode.splice(this.anchor.offset, 0, blocksParent.getChildren());
			if (nodeToSelect !== null) nodeToSelect.selectEnd();
			return;
		}
		const firstPoint = this.isBackward() ? this.focus : this.anchor;
		let firstNode = firstPoint.getNode();
		let firstBlock = $findMatchingParent(firstNode, INTERNAL_$isBlock);
		const last = nodes[nodes.length - 1];
		if ($isElementNode(firstBlock) && "__language" in firstBlock) {
			if ("__language" in nodes[0]) this.insertText(nodes[0].getTextContent());
			else {
				const [, index] = $removeTextAndSplitBlock(this);
				firstBlock.splice(index, 0, nodes);
				last.selectEnd();
			}
			return;
		}
		const notInline = (node) => ($isElementNode(node) || $isDecoratorNode(node)) && !node.isInline();
		if (!nodes.some(notInline)) {
			invariant($isElementNode(firstBlock), "Expected node %s of type %s to have a block ElementNode ancestor", firstNode.constructor.name, firstNode.getType());
			const [container, index] = $removeTextAndSplitBlock(this, true);
			($isElementNode(container) ? container : firstBlock).splice(index, 0, nodes);
			last.selectEnd();
			return;
		}
		if ($isElementNode(firstBlock) && $getSlotHostKey(firstBlock) !== null) {
			const [, index] = $removeTextAndSplitBlock(this);
			const inlineNodes = $extractInlineFromBlocks(nodes);
			firstBlock.splice(index, 0, inlineNodes);
			const lastInserted = inlineNodes[inlineNodes.length - 1];
			if (lastInserted !== void 0) lastInserted.selectEnd();
			else firstBlock.select(index, index);
			return;
		}
		if (firstBlock === null) {
			const blocksParent = $wrapInlineNodes(nodes);
			const nodeToSelect = blocksParent.getLastDescendant();
			let caret = $caretFromPoint(this.anchor, "next");
			for (const block of blocksParent.getChildren()) caret = $insertNodeToNearestRootAtCaret(block, caret);
			if (nodeToSelect !== null) nodeToSelect.selectEnd();
			return;
		}
		if ($isElementNode(firstBlock) && !firstBlock.isParentRequired() && !$isRootOrShadowRoot(firstBlock.getParentOrThrow())) {
			const [, index] = $removeTextAndSplitBlock(this);
			const inlineNodes = $extractInlineFromBlocks(nodes);
			firstBlock.splice(index, 0, inlineNodes);
			const lastInserted = inlineNodes[inlineNodes.length - 1];
			if (lastInserted !== void 0) lastInserted.selectEnd();
			else firstBlock.select(index, index);
			return;
		}
		const blocksParent = $wrapInlineNodes(nodes);
		const nodeToSelect = blocksParent.getLastDescendant();
		const blocks = blocksParent.getChildren();
		const isAfterEmptyLine = $isPointAfterEmptyLine(firstPoint);
		const isMergeable = (node) => !isAfterEmptyLine && $isElementNode(node) && INTERNAL_$isBlock(node) && !node.isEmpty() && $isElementNode(firstBlock) && (!firstBlock.isEmpty() || firstBlock.canMergeWhenEmpty());
		const insertedParagraph = !$isElementNode(firstBlock) || !firstBlock.isEmpty() ? this.insertParagraph() : null;
		if (insertedParagraph && !firstBlock.isAttached()) {
			firstNode = this.anchor.getNode();
			firstBlock = $findMatchingParent(firstNode, INTERNAL_$isBlock);
		}
		const lastToInsert = blocks[blocks.length - 1];
		let firstToInsert = blocks[0];
		if (isMergeable(firstToInsert)) {
			invariant($isElementNode(firstBlock), "Expected node %s of type %s to have a block ElementNode ancestor", firstNode.constructor.name, firstNode.getType());
			firstBlock.append(...firstToInsert.getChildren());
			firstToInsert = blocks[1];
		}
		if (firstToInsert) {
			invariant(firstBlock !== null, "Expected node %s of type %s to have a block ancestor", firstNode.constructor.name, firstNode.getType());
			insertRangeAfter(firstBlock, firstToInsert);
		}
		const lastInsertedBlock = $findMatchingParent(nodeToSelect, INTERNAL_$isBlock);
		const insertSelection = nodeToSelect.selectEnd();
		if (insertedParagraph) {
			if ($isElementNode(lastInsertedBlock) && (insertedParagraph.canMergeWhenEmpty() || INTERNAL_$isBlock(lastToInsert))) {
				lastInsertedBlock.append(...insertedParagraph.getChildren());
				insertedParagraph.remove();
			} else if (insertedParagraph.isEmpty()) insertedParagraph.remove();
		}
		if ($isElementNode(firstBlock) && firstBlock.isEmpty()) firstBlock.remove();
		const lastChild = $isElementNode(firstBlock) ? firstBlock.getLastChild() : null;
		if ($isLineBreakNode(lastChild) && lastInsertedBlock !== firstBlock) lastChild.remove();
		const normalizedCaret = $normalizeCaret($caretFromPoint(insertSelection.anchor, "next"));
		$setPointFromCaret(insertSelection.anchor, normalizedCaret);
		$setPointFromCaret(insertSelection.focus, normalizedCaret);
	}
	/**
	* Inserts a new ParagraphNode into the EditorState at the current Selection
	*
	* @returns the newly inserted node.
	*/
	insertParagraph() {
		if (!this.isCollapsed()) this.removeText();
		const anchorNode = this.anchor.getNode();
		if (this.anchor.type === "element" && $isRootOrShadowRoot(anchorNode)) {
			const paragraph = $createParagraphNode();
			anchorNode.splice(this.anchor.offset, 0, [paragraph]);
			paragraph.select();
			return paragraph;
		}
		const [, index] = $removeTextAndSplitBlock(this);
		const block = $findMatchingParent(this.anchor.getNode(), INTERNAL_$isBlock);
		if (block !== null && $getSlotHostKey(block) !== null) return null;
		invariant($isElementNode(block), "Expected ancestor to be a block ElementNode");
		const firstToAppend = block.getChildAtIndex(index);
		const nodesToInsert = firstToAppend ? [firstToAppend, ...firstToAppend.getNextSiblings()] : [];
		const newBlock = block.insertNewAfter(this, false);
		if (newBlock) {
			newBlock.append(...nodesToInsert);
			newBlock.selectStart();
			return newBlock;
		}
		return null;
	}
	/**
	* Inserts a logical linebreak, which may be a new LineBreakNode or a new ParagraphNode, into the EditorState at the
	* current Selection.
	*/
	insertLineBreak(selectStart) {
		const lineBreak = $createLineBreakNode();
		this.insertNodes([lineBreak]);
		if (selectStart) {
			const parent = lineBreak.getParentOrThrow();
			const index = lineBreak.getIndexWithinParent();
			parent.select(index, index);
		}
	}
	/**
	* Extracts the nodes in the Selection, splitting nodes where necessary
	* to get offset-level precision.
	*
	* @returns The nodes in the Selection
	*/
	extract() {
		const selectedNodes = [...this.getNodes()];
		const selectedNodesLength = selectedNodes.length;
		let firstNode = selectedNodes[0];
		let lastNode = selectedNodes[selectedNodesLength - 1];
		const [anchorOffset, focusOffset] = $getCharacterOffsets(this);
		const isBackward = this.isBackward();
		const [startPoint, endPoint] = isBackward ? [this.focus, this.anchor] : [this.anchor, this.focus];
		const [startOffset, endOffset] = isBackward ? [focusOffset, anchorOffset] : [anchorOffset, focusOffset];
		if (selectedNodesLength === 0) return [];
		else if (selectedNodesLength === 1) {
			if ($isTextNode(firstNode) && !this.isCollapsed()) {
				const splitNodes = firstNode.splitText(startOffset, endOffset);
				const node = startOffset === 0 ? splitNodes[0] : splitNodes[1];
				if (node) {
					startPoint.set(node.getKey(), 0, "text");
					endPoint.set(node.getKey(), node.getTextContentSize(), "text");
					return [node];
				}
				return [];
			}
			return [firstNode];
		}
		if ($isTextNode(firstNode)) {
			if (startOffset === firstNode.getTextContentSize()) selectedNodes.shift();
			else if (startOffset !== 0) {
				[, firstNode] = firstNode.splitText(startOffset);
				selectedNodes[0] = firstNode;
				startPoint.set(firstNode.getKey(), 0, "text");
			}
		}
		if ($isTextNode(lastNode)) {
			const lastNodeTextLength = lastNode.getTextContent().length;
			if (endOffset === 0) selectedNodes.pop();
			else if (endOffset !== lastNodeTextLength) {
				[lastNode] = lastNode.splitText(endOffset);
				selectedNodes[selectedNodes.length - 1] = lastNode;
				endPoint.set(lastNode.getKey(), lastNode.getTextContentSize(), "text");
			}
		}
		return selectedNodes;
	}
	/**
	* Modifies the Selection according to the parameters and a set of heuristics that account for
	* various node types. Can be used to safely move or extend selection by one logical "unit" without
	* dealing explicitly with all the possible node types.
	*
	* @param alter the type of modification to perform
	* @param isBackward whether or not selection is backwards
	* @param granularity the granularity at which to apply the modification
	*/
	modify(alter, isBackward, granularity) {
		if ($modifySelectionAroundDecoratorsAndBlocks(this, alter, isBackward, granularity)) return;
		const collapse = alter === "move";
		const editor = getActiveEditor();
		const domSelection = getDOMSelection(getWindow(editor));
		if (!domSelection) return;
		const blockCursorElement = editor._blockCursorElement;
		const rootElement = editor._rootElement;
		const focusNode = this.focus.getNode();
		if (rootElement !== null && blockCursorElement !== null && $isElementNode(focusNode) && !focusNode.isInline() && !focusNode.canBeEmpty()) removeDOMBlockCursorElement(blockCursorElement, editor, rootElement);
		const focusKeyedDOM = getElementByKeyOrThrow(editor, this.focus.key);
		let nextFocusDOM = focusKeyedDOM;
		if (this.focus.type === "text") nextFocusDOM = $isTextNode(focusNode) ? $getDOMTextNode(focusNode, focusKeyedDOM, editor) : null;
		if (this.dirty) {
			const anchorKeyedDOM = getElementByKeyOrThrow(editor, this.anchor.key);
			let nextAnchorDOM = anchorKeyedDOM;
			if (this.anchor.type === "text") {
				const node = this.anchor.getNode();
				nextAnchorDOM = $isTextNode(node) ? $getDOMTextNode(node, anchorKeyedDOM, editor) : null;
			}
			if (nextAnchorDOM && nextFocusDOM) setDOMSelectionBaseAndExtent(domSelection, nextAnchorDOM, this.anchor.offset, nextFocusDOM, this.focus.offset);
		}
		if (granularity === "character" && $isTextNode(focusNode) && focusNode.isUnmergeable()) {
			if (isBackward ? this.focus.offset === 0 : this.focus.offset === focusNode.getTextContentSize()) {
				const sibling = $getSiblingCaret(focusNode, isBackward ? "previous" : "next").getNodeAtCaret();
				if ($isTextNode(sibling)) {
					if (collapse) {
						const sibKeyedDOM = editor.getElementByKey(sibling.getKey());
						const sibDOM = sibKeyedDOM ? $getDOMTextNode(sibling, sibKeyedDOM, editor) : null;
						if (sibDOM) {
							const sibOffset = isBackward ? sibDOM.length : 0;
							setDOMSelectionBaseAndExtent(domSelection, sibDOM, sibOffset, sibDOM, sibOffset);
						}
					} else {
						const sibLen = sibling.getTextContentSize();
						if (isBackward) this.focus.set(sibling.__key, sibLen - 1, "text");
						else this.focus.set(sibling.__key, 1, "text");
						this.dirty = true;
						return;
					}
				}
			}
		}
		moveNativeSelection(domSelection, alter, isBackward ? "backward" : "forward", granularity, rootElement);
		if (domSelection.rangeCount > 0) {
			const composedRange = getComposedStaticRange(domSelection, editor._rootElement);
			const range = composedRange || domSelection.getRangeAt(0);
			const anchorNode = this.anchor.getNode();
			const root = $isRootNode(anchorNode) ? anchorNode : $getNearestRootOrShadowRoot(anchorNode);
			this.applyDOMRange(range);
			this.dirty = true;
			if (!collapse) {
				$shrinkSelectionToRoot(this, isBackward, root);
				if (!(composedRange ? domSelection.direction !== "backward" : domSelection.anchorNode === range.startContainer && domSelection.anchorOffset === range.startOffset)) $swapPoints(this);
			}
		}
		if (granularity === "lineboundary") $modifySelectionAroundDecoratorsAndBlocks(this, alter, isBackward, granularity, "decorators");
	}
	/**
	* Helper for handling forward character and word deletion that prevents element nodes
	* like a table, columns layout being destroyed
	*
	* @param anchor the anchor
	* @param anchorNode the anchor node in the selection
	* @param isBackward whether or not selection is backwards
	*/
	forwardDeletion(anchor, anchorNode, isBackward) {
		if (!isBackward && (anchor.type === "element" && $isElementNode(anchorNode) && anchor.offset === anchorNode.getChildrenSize() || anchor.type === "text" && anchor.offset === anchorNode.getTextContentSize())) {
			const parent = anchorNode.getParent();
			const nextSibling = anchorNode.getNextSibling() || (parent === null ? null : parent.getNextSibling());
			if ($isElementNode(nextSibling) && nextSibling.isShadowRoot()) return true;
		}
		return false;
	}
	/**
	* Performs one logical character deletion operation on the EditorState based on the current Selection.
	* Handles different node types.
	*
	* @param isBackward whether or not the selection is backwards.
	*/
	deleteCharacter(isBackward) {
		const wasCollapsed = this.isCollapsed();
		if (this.isCollapsed()) {
			const anchor = this.anchor;
			let anchorNode = anchor.getNode();
			if (this.forwardDeletion(anchor, anchorNode, isBackward)) {
				const nextSibling = $isElementNode(anchorNode) ? anchorNode.getNextSibling() : null;
				if (!($isElementNode(anchorNode) && anchorNode.isEmpty() && $isElementNode(nextSibling) && nextSibling.isShadowRoot())) return;
			}
			const initialCaret = $caretFromPoint(anchor, isBackward ? "previous" : "next");
			const initialRange = $extendCaretToRange(initialCaret);
			if (initialRange.getTextSlices().every((slice) => slice === null || slice.distance === 0)) {
				if (anchor.type === "element") {
					const adjacent = initialCaret.getNodeAtCaret();
					if ($isElementNode(adjacent) && $needsBlockCursorBeside(adjacent)) {
						const container = adjacent.getParent();
						adjacent.remove();
						const restored = $restoreEmptyContainerParagraph(container, adjacent);
						if (restored !== null) restored.selectStart();
						return;
					}
				}
				let state = { type: "initial" };
				for (const caret of initialRange.iterNodeCarets("shadowRoot")) if ($isChildCaret(caret)) {
					if (caret.origin.isInline()) {} else if (caret.origin.isShadowRoot()) {
						if (state.type === "merge-block") break;
						if ($isElementNode(initialRange.anchor.origin) && initialRange.anchor.origin.isEmpty()) {
							const normCaret = $normalizeCaret(caret);
							$updateRangeSelectionFromCaretRange(this, $getCaretRange(normCaret, normCaret));
							initialRange.anchor.origin.remove();
						}
						return;
					} else if (state.type === "merge-next-block" || state.type === "merge-block") state = {
						block: state.block,
						caret,
						type: "merge-block"
					};
				} else if (state.type === "merge-block") break;
				else if ($isSiblingCaret(caret)) {
					if ($isElementNode(caret.origin)) {
						if (!caret.origin.isInline()) state = {
							block: caret.origin,
							type: "merge-next-block"
						};
						else if (!caret.origin.isParentOf(initialRange.anchor.origin)) break;
						continue;
					} else if ($isDecoratorNode(caret.origin)) {
						if (caret.origin.isIsolated()) {} else if (state.type === "merge-next-block" && (caret.origin.isKeyboardSelectable() || !caret.origin.isInline()) && $isElementNode(initialRange.anchor.origin) && initialRange.anchor.origin.isEmpty()) {
							initialRange.anchor.origin.remove();
							const nodeSelection = $createNodeSelection();
							nodeSelection.add(caret.origin.getKey());
							$setSelection(nodeSelection);
						} else {
							const decorator = caret.origin;
							const container = decorator.getParent();
							decorator.remove();
							const restored = $restoreEmptyContainerParagraph(container, decorator);
							if (restored !== null) restored.selectStart();
						}
						return;
					} else if ($isLineBreakNode(caret.origin)) {
						caret.origin.remove();
						return;
					}
					break;
				}
				if (state.type === "merge-block") {
					const { caret, block } = state;
					if ($getSlotNames(block).length > 0) return;
					if (caret.origin.isEmpty() && !block.isEmpty() && caret.origin.getParent() === block.getParent()) {
						caret.origin.remove(true);
						return;
					}
					$updateRangeSelectionFromCaretRange(this, $getCaretRange(!caret.origin.isEmpty() && block.isEmpty() ? $rewindSiblingCaret($getSiblingCaret(block, caret.direction)) : initialRange.anchor, caret));
					return this.removeText();
				}
				for (let node = anchor.getNode(); node !== null;) {
					if ($getSlotHostKey(node) !== null) return;
					if ($isElementNode(node) && node.isShadowRoot()) break;
					node = node.getParent();
				}
			}
			const focus = this.focus;
			$extendSelectionForDeletion(this, isBackward, "character");
			if (!this.isCollapsed()) {
				const focusNode = focus.type === "text" ? focus.getNode() : null;
				anchorNode = anchor.type === "text" ? anchor.getNode() : null;
				if (focusNode !== null && focusNode.isSegmented()) {
					const offset = focus.offset;
					const textContentSize = focusNode.getTextContentSize();
					if (focusNode.is(anchorNode) || isBackward && offset !== textContentSize || !isBackward && offset !== 0) {
						$removeSegment(focusNode, isBackward, offset);
						return;
					}
				} else if (anchorNode !== null && anchorNode.isSegmented()) {
					const offset = anchor.offset;
					const textContentSize = anchorNode.getTextContentSize();
					if (anchorNode.is(focusNode) || isBackward && offset !== 0 || !isBackward && offset !== textContentSize) {
						$removeSegment(anchorNode, isBackward, offset);
						return;
					}
				}
				$updateCaretSelectionForUnicodeCharacter(this, isBackward);
			} else if (isBackward && anchor.offset === 0) {
				if ($collapseAtStart(this, anchor.getNode())) return;
			}
		}
		if (!wasCollapsed) INTERNAL_$expandSelectionToWholeDocument(this);
		this.removeText();
		if (isBackward && !wasCollapsed && this.isCollapsed() && this.anchor.type === "element" && this.anchor.offset === 0) $ensureRootHasParagraph();
	}
	/**
	* Performs one logical line deletion operation on the EditorState based on the current Selection.
	* Handles different node types.
	*
	* @param isBackward whether or not the selection is backwards.
	*/
	deleteLine(isBackward) {
		const wasCollapsed = this.isCollapsed();
		const anchorSlotFrame = $getPointSlotFrame(this.anchor);
		if (anchorSlotFrame !== null && $isDecoratorNode($getSlotHost(anchorSlotFrame))) {
			if (!this.isCollapsed()) this.focus.set(this.anchor.key, this.anchor.offset, this.anchor.type);
			this.deleteCharacter(isBackward);
			return;
		}
		if (this.isCollapsed()) $extendSelectionForDeletion(this, isBackward, "lineboundary");
		if (this.isCollapsed()) this.deleteCharacter(isBackward);
		else if ($findMatchingParent(this.anchor.getNode(), INTERNAL_$isBlock) !== $findMatchingParent(this.focus.getNode(), INTERNAL_$isBlock)) {
			this.focus.set(this.anchor.key, this.anchor.offset, this.anchor.type);
			this.deleteCharacter(isBackward);
		} else {
			if (!wasCollapsed) INTERNAL_$expandSelectionToWholeDocument(this);
			this.removeText();
		}
	}
	/**
	* Performs one logical word deletion operation on the EditorState based on the current Selection.
	* Handles different node types.
	*
	* @param isBackward whether or not the selection is backwards.
	*/
	deleteWord(isBackward) {
		const wasCollapsed = this.isCollapsed();
		if (this.isCollapsed()) {
			const anchor = this.anchor;
			const anchorNode = anchor.getNode();
			if (this.forwardDeletion(anchor, anchorNode, isBackward)) return;
			$extendSelectionForDeletion(this, isBackward, "word");
		}
		if (this.isCollapsed()) this.deleteCharacter(isBackward);
		else {
			if (!wasCollapsed) INTERNAL_$expandSelectionToWholeDocument(this);
			this.removeText();
		}
	}
	/**
	* Returns whether the Selection is "backwards", meaning the focus
	* logically precedes the anchor in the EditorState.
	* @returns true if the Selection is backwards, false otherwise.
	*/
	isBackward() {
		const cached = this._cachedIsBackward;
		if (cached !== null) return cached;
		const isBackward = this.focus.isBefore(this.anchor);
		if (!isCurrentlyReadOnlyMode()) this._cachedIsBackward = isBackward;
		return isBackward;
	}
	getStartEndPoints() {
		return [this.anchor, this.focus];
	}
};
/** Returns true if the given value is a NodeSelection. */
function $isNodeSelection(x) {
	return x instanceof NodeSelection;
}
/**
* Applies a pure bitmask transform to every formattable node in the selection
* in a single traversal, splitting the first and last TextNodes as necessary
* so that only the selected text is affected. Each node receives exactly one
* `setFormat(applyFormat(getFormat()))` (ElementNodes use their textFormat).
*
* @param selection - the selection whose nodes should be formatted.
* @param applyFormat - maps a node's current 32-bit format to its new format.
*/
function $updateTextFormat(selection, applyFormat) {
	if ($isNodeSelection(selection)) {
		for (const node of selection.getNodes()) if ($isInlineFormattable(node)) node.setFormat(applyFormat(node.getFormat()));
		return;
	}
	if (selection.isCollapsed()) {
		selection.setFormat(applyFormat(selection.format));
		$setCompositionKey(null);
		return;
	}
	const selectedTextNodes = [];
	for (const node of selection.getNodes()) if ($isTextNode(node)) selectedTextNodes.push(node);
	else if ($isElementNode(node)) node.setTextFormat(applyFormat(node.getTextFormat()));
	else if ($isInlineFormattable(node)) node.setFormat(applyFormat(node.getFormat()));
	const selectedTextNodesLength = selectedTextNodes.length;
	if (selectedTextNodesLength === 0) {
		selection.setFormat(applyFormat(selection.format));
		$setCompositionKey(null);
		return;
	}
	const anchor = selection.anchor;
	const focus = selection.focus;
	const isBackward = selection.isBackward();
	const startPoint = isBackward ? focus : anchor;
	const endPoint = isBackward ? anchor : focus;
	let firstIndex = 0;
	let firstNode = selectedTextNodes[0];
	let startOffset = startPoint.type === "element" ? 0 : startPoint.offset;
	if (startPoint.type === "text" && startOffset === firstNode.getTextContentSize()) {
		firstIndex = 1;
		firstNode = selectedTextNodes[1];
		startOffset = 0;
	}
	if (firstNode == null) return;
	const lastIndex = selectedTextNodesLength - 1;
	let lastNode = selectedTextNodes[lastIndex];
	const endOffset = endPoint.type === "text" ? endPoint.offset : lastNode.getTextContentSize();
	if (firstNode.is(lastNode)) {
		if (startOffset === endOffset) return;
		const newFormat = applyFormat(firstNode.getFormat());
		if ($isTokenOrSegmented(firstNode) || startOffset === 0 && endOffset === firstNode.getTextContentSize()) firstNode.setFormat(newFormat);
		else {
			const splitNodes = firstNode.splitText(startOffset, endOffset);
			const replacement = startOffset === 0 ? splitNodes[0] : splitNodes[1];
			replacement.setFormat(newFormat);
			if (startPoint.type === "text") startPoint.set(replacement.__key, 0, "text");
			if (endPoint.type === "text") endPoint.set(replacement.__key, endOffset - startOffset, "text");
		}
		selection.format = newFormat;
		return;
	}
	if (startOffset !== 0 && !$isTokenOrSegmented(firstNode)) {
		[, firstNode] = firstNode.splitText(startOffset);
		startOffset = 0;
	}
	const firstNextFormat = applyFormat(firstNode.getFormat());
	firstNode.setFormat(firstNextFormat);
	const lastNextFormat = applyFormat(lastNode.getFormat());
	if (endOffset > 0) {
		if (endOffset !== lastNode.getTextContentSize() && !$isTokenOrSegmented(lastNode)) [lastNode] = lastNode.splitText(endOffset);
		lastNode.setFormat(lastNextFormat);
	}
	for (let i = firstIndex + 1; i < lastIndex; i++) {
		const textNode = selectedTextNodes[i];
		textNode.setFormat(applyFormat(textNode.getFormat()));
	}
	if (startPoint.type === "text") startPoint.set(firstNode.__key, startOffset, "text");
	if (endPoint.type === "text") endPoint.set(lastNode.__key, endOffset, "text");
	selection.format = firstNextFormat | lastNextFormat;
}
/**
* Explicitly sets or unsets text formats on the selection. Unlike $formatText
* which toggles based on the current selection state, this function sets each
* specified format to the exact boolean value provided. Mutually exclusive
* formats (subscript/superscript, lowercase/uppercase/capitalize) are
* reconciled by {@link toggleTextFormatType}, with later entries winning when
* the requested formats conflict.
*
* @param selection - the selection whose nodes should be formatted.
* @param formats - a partial record mapping TextFormatType to boolean.
*/
function $setTextFormat(selection, formats) {
	const entries = [];
	for (const [type, value] of Object.entries(formats)) if (typeof value === "boolean") entries.push([type, value]);
	if (entries.length === 0) return;
	$updateTextFormat(selection, (format) => {
		for (const [type, value] of entries) format = toggleTextFormatType(format, type, value ? TEXT_TYPE_TO_FORMAT[type] : 0);
		return format;
	});
}
/**
* Applies the provided format to TextNodes and inline formattable nodes
* (e.g. DecoratorTextNode) in the selection, splitting or merging TextNodes
* as necessary and aligning all formattable nodes to the same target format.
*
* For RangeSelection the toggle direction is determined by the selection's
* computed format (intersection of all text nodes) when no explicit alignment
* is given. For NodeSelection each node is toggled independently when no
* explicit alignment is given, since there is no TextNode to use as an
* alignment reference.
*
* @param selection - the selection whose nodes should be formatted.
* @param formatType - the format type to apply.
* @param alignWithFormat - optional 32-bit bitmask to align with.
*/
function $formatText(selection, formatType, alignWithFormat = null) {
	const effectiveAlign = alignWithFormat === null && $isRangeSelection(selection) ? toggleTextFormatType(selection.format, formatType, null) : alignWithFormat;
	$updateTextFormat(selection, (format) => toggleTextFormatType(format, formatType, effectiveAlign));
}
function getCharacterOffset(point) {
	const offset = point.offset;
	if (point.type === "text") return offset;
	const parent = point.getNode();
	return offset === parent.getChildrenSize() ? parent.getTextContent().length : 0;
}
/** Returns the character offsets of the selection's anchor and focus points as an [anchor, focus] tuple. */
function $getCharacterOffsets(selection) {
	const anchorAndFocus = selection.getStartEndPoints();
	if (anchorAndFocus === null) return [0, 0];
	const [anchor, focus] = anchorAndFocus;
	if (anchor.type === "element" && focus.type === "element" && anchor.key === focus.key && anchor.offset === focus.offset) return [0, 0];
	return [getCharacterOffset(anchor), getCharacterOffset(focus)];
}
function $collapseAtStart(selection, startNode) {
	for (let node = startNode; node; node = node.getParent()) {
		if ($isElementNode(node)) {
			if (node.collapseAtStart(selection)) return true;
			if ($isRootOrShadowRoot(node)) break;
		}
		if (node.getPreviousSibling()) break;
	}
	return false;
}
/**
* When `selection` covers the whole document, widen it to the root's own
* element points, so the range describes the top-level blocks themselves
* rather than only the text inside them.
*
* A delete over that range then removes the blocks outright and leaves the
* editor on a fresh empty paragraph, instead of gutting them and leaving an
* empty heading, quote or list behind that keeps its type and styles the next
* character typed (#5835). It also keeps a cut honest: what lands on the
* clipboard is what leaves the document, so Cmd+X then Cmd+V restores the
* blocks rather than their bare text.
*
* Widening rather than deleting-then-repairing is what makes this safe for
* every block type. The range simply contains the blocks, so nothing has to
* decide whether a heading, a nested list, a code block or a third-party node
* should dissolve, and no node is destroyed that the user did not select.
*
* A no-op for anything else: a range that stops short of either end is an
* ordinary edit inside the blocks it touches, and a select-all scoped to a
* named slot never covers the root.
*/
function INTERNAL_$expandSelectionToWholeDocument(selection) {
	const root = $getRoot();
	if (root.isEmpty() || !$isBlockFullySelected(root, selection)) return;
	selection.anchor.set(root.getKey(), 0, "element");
	selection.focus.set(root.getKey(), root.getChildrenSize(), "element");
}
function $swapPoints(selection) {
	const focus = selection.focus;
	const anchor = selection.anchor;
	const anchorKey = anchor.key;
	const anchorOffset = anchor.offset;
	const anchorType = anchor.type;
	anchor.set(focus.key, focus.offset, focus.type, true);
	focus.set(anchorKey, anchorOffset, anchorType, true);
}
/**
* True when `node` is a DOM Text node with at least one code unit on the
* `direction` side of `offset`, so a character-granularity caret movement in
* that direction must land inside the very same text node.
*/
function canMoveWithinDOMText(node, offset, direction) {
	if (node === null || node.nodeType !== 3) return false;
	if (direction === "backward") return offset > 0;
	else if (direction === "forward") return offset < node.length;
	return false;
}
function moveNativeSelection(domSelection, alter, direction, granularity, rootElement) {
	const points = granularity === "character" ? getDOMSelectionPoints(domSelection, rootElement) : null;
	const focusNode = points && points.focusNode;
	const focusOffset = points ? points.focusOffset : 0;
	domSelection.modify(alter, direction, granularity);
	if (points === null || !canMoveWithinDOMText(focusNode, focusOffset, direction)) return;
	const nextPoints = getDOMSelectionPoints(domSelection, rootElement);
	if (nextPoints.focusNode === focusNode && nextPoints.focusOffset === focusOffset) domSelection.modify(alter, direction, granularity);
}
/**
* Validate that the selection respects `root` (the nearest root or shadow
* root): if any selected node lies outside of it, shrink the selection to the
* valid edge in the given direction. The valid node check is a safeguard
* against an invalid selection, for which getNodes() returns an empty array.
*
* @returns true if the selection was shrunk
*/
function $shrinkSelectionToRoot(selection, isBackward, root) {
	const nodes = selection.getNodes();
	const validNodes = nodes.filter((node) => $hasAncestor(node, root));
	if (validNodes.length === 0 || validNodes.length === nodes.length) return false;
	const edgeNode = isBackward ? validNodes[0] : validNodes[validNodes.length - 1];
	const edgeElement = $isElementNode(edgeNode) ? edgeNode : edgeNode.getParentOrThrow();
	if (isBackward) edgeElement.selectStart();
	else edgeElement.selectEnd();
	return true;
}
/**
* Extend a collapsed selection by one unit (`character`, `word` or
* `lineboundary`) in the deletion direction without ever creating a
* non-collapsed DOM selection.
*
* On Linux/X11, browsers propagate any non-collapsed DOM selection made
* during a user gesture to the PRIMARY selection (the middle-click paste
* buffer), so a deletion must never pass through a transient non-collapsed
* DOM selection or every Backspace/Delete overwrites the user's paste
* buffer (https://github.com/facebook/lexical/issues/8766). A collapsed
* caret never takes PRIMARY ownership, so the DOM caret is moved with the
* native `modify('move')` to measure where the engine places the unit
* boundary, and the `[original .. landed]` range is constructed in the
* model only. `applyDOMRange` reads just the range's boundary points (it
* never touches the DOM selection), giving the same point resolution,
* decorator pre/post handling, shadow-root shrink validation and
* anchor/focus orientation as a native selection extension would, while
* the DOM selection is only ever collapsed.
*
* When the measurement is not possible — no DOM selection or no
* `Selection.modify` (headless environments can polyfill it), or an
* unresolvable anchor — the selection is left collapsed, so the deletion
* becomes a no-op for that keystroke.
*/
function $extendSelectionForDeletion(selection, isBackward, granularity) {
	if ($modifySelectionAroundDecoratorsAndBlocks(selection, "extend", isBackward, granularity)) return;
	const editor = getActiveEditor();
	const domSelection = getDOMSelection(getWindow(editor));
	if (!domSelection || typeof domSelection.modify !== "function") return;
	const blockCursorElement = editor._blockCursorElement;
	const rootElement = editor._rootElement;
	const anchor = selection.anchor;
	const focusNode = selection.focus.getNode();
	if (rootElement !== null && blockCursorElement !== null && $isElementNode(focusNode) && !focusNode.isInline() && !focusNode.canBeEmpty()) removeDOMBlockCursorElement(blockCursorElement, editor, rootElement);
	const $resolvePointDOM = (point) => {
		const pointNode = point.getNode();
		const keyedDOM = editor.getElementByKey(point.key);
		return keyedDOM !== null && point.type === "text" && $isTextNode(pointNode) ? $getDOMTextNode(pointNode, keyedDOM, editor) : keyedDOM;
	};
	const anchorNode = anchor.getNode();
	const anchorDOM = $resolvePointDOM(anchor);
	if (anchorDOM === null) return;
	const anchorOffset = anchor.offset;
	const wasCollapsed = selection.isCollapsed();
	const focus = selection.focus;
	const focusDOM = wasCollapsed ? anchorDOM : $resolvePointDOM(focus);
	if (focusDOM === null) return;
	const focusOffset = focus.offset;
	setDOMSelectionBaseAndExtent(domSelection, focusDOM, focusOffset, focusDOM, focusOffset);
	moveNativeSelection(domSelection, "move", isBackward ? "backward" : "forward", granularity, rootElement);
	if (domSelection.rangeCount === 0) return;
	const landedRange = getComposedStaticRange(domSelection, rootElement) || domSelection.getRangeAt(0);
	let landedContainer = landedRange.startContainer;
	let landedOffset = landedRange.startOffset;
	if (granularity === "lineboundary" && isDOMTextNode(landedContainer) && getNearestEditorFromDOMNode(landedContainer) === editor) {
		const landedNode = $getNodeFromDOM(landedContainer);
		if ($isDecoratorNode(landedNode) && landedNode.isInline() && !landedNode.isIsolated()) {
			const decoratorDOM = editor.getElementByKey(landedNode.getKey());
			if (decoratorDOM !== null && decoratorDOM.contains(landedContainer)) {
				landedContainer = decoratorDOM;
				landedOffset = isBackward ? 0 : decoratorDOM.childNodes.length;
			}
		}
	}
	if (wasCollapsed && granularity === "character" && anchor.type === "text" && $isTextNode(anchorNode) && anchorNode.isUnmergeable()) {
		if (anchorOffset === (isBackward ? 0 : anchorNode.getTextContentSize())) {
			const sibling = $getSiblingCaret(anchorNode, isBackward ? "previous" : "next").getNodeAtCaret();
			if ($isTextNode(sibling)) {
				const sibOffset = isBackward ? sibling.getTextContentSize() - 1 : 1;
				selection.focus.set(sibling.__key, sibOffset, "text");
				selection.dirty = true;
				return;
			}
		}
	}
	if (wasCollapsed && granularity === "character" && anchor.type === "text") {
		const edgeOffset = isBackward ? 0 : anchorNode.getTextContentSize();
		const clampedOffset = landedContainer === anchorDOM ? landedOffset : anchorOffset !== edgeOffset ? edgeOffset : -1;
		if (clampedOffset >= 0) {
			if (clampedOffset !== anchorOffset) {
				selection.focus.set(anchor.key, clampedOffset, "text");
				selection.dirty = true;
			}
			return;
		}
	}
	const [startContainer, startOffset, endContainer, endOffset] = isBackward ? [
		landedContainer,
		landedOffset,
		anchorDOM,
		anchorOffset
	] : [
		anchorDOM,
		anchorOffset,
		landedContainer,
		landedOffset
	];
	const root = $isRootNode(anchorNode) ? anchorNode : $getNearestRootOrShadowRoot(anchorNode);
	selection.applyDOMRange({
		collapsed: false,
		endContainer,
		endOffset,
		startContainer,
		startOffset
	});
	selection.dirty = true;
	if (!$shrinkSelectionToRoot(selection, isBackward, root) && isBackward) $swapPoints(selection);
	if (granularity === "lineboundary") $modifySelectionAroundDecoratorsAndBlocks(selection, "extend", isBackward, granularity, "decorators");
}
/**
* Called by `RangeSelection.deleteCharacter` to determine if
* `$extendSelectionForDeletion` extended the selection further
* than a user would expect for that operation.
*
* A short(?) JavaScript string vs. Unicode primer:
*
* Strings in JavaScript use an UTF-16 encoding, and the offsets into a
* string are based on those UTF-16 *code units*. This is basically a
* historical mistake (though logical at that time, decades ago), but
* can never really be fixed for compatibility reasons.
*
* In Unicode, a *code point* is the combination of one or more *code units*.
* and the range of a *code point* can fit into 21 bits.
*
* Every valid *code point* can be represented with one or two
* *UTF-16 code units*. One unit is used when the code point is in the
* Basic Multilingual Plane (BMP) and is `< 0xFFFF`. Anything outside
* of that plane is encoded with a *surrogate pair* of *code units* and
* `/[\uD800-\uDBFF][\uDC00-\uDFFF]/` is a regex that you could use to
* find any valid *surrogate pair*. As far as Unicode is concerned, these
* pairs represent a single *code point*, but in JavaScript, these pairs
* have a length of 2 (`pair.charCodeAt(n)` is really returning a
* UTF-16 *code unit*, not a unicode *code point*). It is possible to request
* a *code point* with `pair.codePointAt(0)` and enumerate code points
* in a string with `[...string]` but the offsets we work with, and
* the string length, are based in *code units* so that functionality
* is unfortunately not very useful here.
*
* This only gets us as far as *code points*. We now know that we must
* consider that each *code point* can have a length of 1 or 2 in JavaScript
* string distance. It gets even trickier because the visual representation
* of a character is a *grapheme* (approximately what the user thinks of
* as a character). A *grapheme* is one or more *code points*, and can
* essentially be arbitrarily long, as there are many ways to combine
* them.
*
* The native caret measurement has already extended our selection by one
* *grapheme* in the direction we want to delete. Sounds great, it's done
* a lot of awfully tricky work for us because this functionality has only
* recently become available in JavaScript via `Intl.Segmenter`. The
* problem is that in many cases the expected behavior of backspace or
* delete is *not always to delete a whole grapheme*. In some languages
* it's always expected that backspace ought to delete one code point, not the
* whole grapheme. In other situations such as emoji that use variation
* selectors you *do* want to delete the whole *grapheme*.
*
* In a few situations the behavior is even application dependent, such as
* with latin languages where you have multiple ways to represent the same
* character visually (e.g. a letter with an accent in one code point, or a
* letter followed by a combining mark in a second code point); some apps will
* delete the whole grapheme and others will delete only the combining mark,
* probably based on whether they perform some sort of *normalization* on their
* input to ensure that only one form is used when two sequences of code points
* can represent the same visual character. Lexical currently chooses not
* to perform any normalization so this type of combining marks will be
* deleted as a *code point* without deleting the whole *grapheme*.
*
* See also:
* https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-2/#G25564
* https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-3/#G30602
* https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-3/#G49537
* https://mathiasbynens.be/notes/javascript-unicode
*/
function $updateCaretSelectionForUnicodeCharacter(selection, isBackward) {
	const anchor = selection.anchor;
	const focus = selection.focus;
	const anchorNode = anchor.getNode();
	if (anchorNode === focus.getNode() && anchor.type === "text" && focus.type === "text") {
		const anchorOffset = anchor.offset;
		const focusOffset = focus.offset;
		const isBefore = anchorOffset < focusOffset;
		const startOffset = isBefore ? anchorOffset : focusOffset;
		const endOffset = isBefore ? focusOffset : anchorOffset;
		const characterOffset = endOffset - 1;
		if (startOffset !== characterOffset) {
			if (shouldDeleteExactlyOneCodeUnit(anchorNode.getTextContent().slice(startOffset, endOffset))) {
				if (isBackward) focus.set(focus.key, characterOffset, focus.type);
				else anchor.set(anchor.key, characterOffset, anchor.type);
			}
		}
	}
}
function shouldDeleteExactlyOneCodeUnit(text) {
	return !(doesContainSurrogatePair(text) || doesContainEmoji(text));
}
/**
* Given the wall of text in $updateCaretSelectionForUnicodeCharacter, you'd
* think that the solution might be complex, but the only currently known
* cases given the above constraints where we want to delete a whole grapheme
* are when emoji is involved. Since ES6 we can use unicode character classes
* in regexp which makes this simple.
*
* It may make sense to add to this heuristic in the future if other
* edge cases are discovered, which is why detailed notes remain.
*
* This is implemented with runtime feature detection and will always
* return false on pre-2020 platforms that do not have unicode character
* class support.
*/
/**
* Feature-detect Unicode property escapes and return the emoji test. A
* function declared side-effect free (so the build annotates the call below)
* rather than an IIFE at module scope: an IIFE containing a `try` is a side
* effect to bundlers, which would pin this module — and with it most of
* `lexical` — into every bundle that imports it.
*
* @__NO_SIDE_EFFECTS__
*/
function createEmojiTest() {
	try {
		const re = /* @__PURE__ */ new RegExp("\\p{Emoji}", "u");
		const test = re.test.bind(re);
		if (test("❤️") && test("#️⃣") && test("👍")) return test;
	} catch (_e) {}
	return () => false;
}
var doesContainEmoji = createEmojiTest();
function $removeSegment(node, isBackward, offset) {
	const textNode = node;
	const split = textNode.getTextContent().split(/(?=\s)/g);
	const splitLength = split.length;
	let segmentOffset = 0;
	let restoreOffset = 0;
	for (let i = 0; i < splitLength; i++) {
		const text = split[i];
		const isLast = i === splitLength - 1;
		restoreOffset = segmentOffset;
		segmentOffset += text.length;
		if (isBackward && segmentOffset === offset || segmentOffset > offset || isLast) {
			split.splice(i, 1);
			if (isLast) restoreOffset = void 0;
			break;
		}
	}
	const nextTextContent = split.join("").trim();
	if (nextTextContent === "") textNode.remove();
	else {
		textNode.setTextContent(nextTextContent);
		textNode.select(restoreOffset, restoreOffset);
	}
}
function shouldResolveAncestor(resolvedElement, resolvedOffset, lastPoint) {
	const parent = resolvedElement.getParent();
	return lastPoint === null || parent === null || !parent.canBeEmpty() || parent !== lastPoint.getNode();
}
function $internalResolveSelectionPoint(dom, offset, lastPoint, editor) {
	let resolvedOffset = offset;
	let resolvedNode;
	let dirty = false;
	if (isHTMLElement(dom)) {
		let moveSelectionToEnd = false;
		const childNodes = dom.childNodes;
		const childNodesLength = childNodes.length;
		const blockCursorElement = editor._blockCursorElement;
		if (resolvedOffset === childNodesLength && childNodesLength > 0) {
			moveSelectionToEnd = true;
			resolvedOffset = childNodesLength - 1;
		}
		if (getNodeKeyFromDOMNode(dom, editor) === void 0 && !isDOMCapturingSelection(dom, editor)) dirty = true;
		let childDOM = childNodes[resolvedOffset];
		let hasBlockCursor = false;
		if (childDOM === blockCursorElement) {
			childDOM = childNodes[resolvedOffset + 1];
			hasBlockCursor = true;
		} else if (blockCursorElement !== null) {
			const blockCursorElementParent = blockCursorElement.parentNode;
			if (dom === blockCursorElementParent) {
				if (offset > Array.prototype.indexOf.call(blockCursorElementParent.children, blockCursorElement)) resolvedOffset--;
			}
		}
		resolvedNode = $getNodeFromDOM(childDOM);
		if ($isTextNode(resolvedNode)) resolvedOffset = $getTextNodeOffset(resolvedNode, moveSelectionToEnd ? "next" : "previous");
		else {
			let resolvedElement = $getNodeFromDOM(dom);
			if (resolvedElement === null) return null;
			if ($isElementNode(resolvedElement)) {
				const elementDOM = editor.getElementByKey(resolvedElement.getKey());
				invariant(elementDOM !== null, "$internalResolveSelectionPoint: node in DOM but not keyToDOMMap");
				const slot = $getDOMSlot(resolvedElement, elementDOM, editor);
				[resolvedElement, resolvedOffset] = slot.resolveChildIndex(resolvedElement, elementDOM, dom, offset);
				invariant($isElementNode(resolvedElement), "$internalResolveSelectionPoint: resolvedElement is not an ElementNode");
				if (moveSelectionToEnd && resolvedOffset >= resolvedElement.getChildrenSize()) resolvedOffset = Math.max(0, resolvedElement.getChildrenSize() - 1);
				let child = resolvedElement.getChildAtIndex(resolvedOffset);
				if ($isElementNode(child) && shouldResolveAncestor(child, resolvedOffset, lastPoint)) {
					const descendant = moveSelectionToEnd ? child.getLastDescendant() : child.getFirstDescendant();
					if (descendant === null) resolvedElement = child;
					else {
						child = descendant;
						resolvedElement = $isElementNode(child) ? child : child.getParentOrThrow();
					}
					resolvedOffset = 0;
				}
				if ($isTextNode(child)) {
					resolvedNode = child;
					resolvedElement = null;
					resolvedOffset = $getTextNodeOffset(child, moveSelectionToEnd ? "next" : "previous");
				} else if (child !== resolvedElement && moveSelectionToEnd && !hasBlockCursor) {
					invariant($isElementNode(resolvedElement), "invariant");
					resolvedOffset = Math.min(resolvedElement.getChildrenSize(), resolvedOffset + 1);
				}
			} else {
				const slotHost = $getSlotHost(resolvedElement);
				const anchorNode = slotHost !== null ? slotHost : resolvedElement;
				const index = anchorNode.getIndexWithinParent();
				const elementDOM = editor.getElementByKey(resolvedElement.getKey());
				let position = "after";
				if (elementDOM !== null && $getNodeFromDOM(dom) === resolvedElement) {
					const slot = $getDOMSlot(resolvedElement, elementDOM, editor);
					if (slot.element !== elementDOM) position = slot.resolveLeafPosition(elementDOM, dom, offset);
					else if (offset === 0 && $isDecoratorNode(resolvedElement)) position = "before";
				}
				resolvedOffset = position === "before" ? index : index + 1;
				resolvedElement = anchorNode.getParentOrThrow();
			}
			if ($isElementNode(resolvedElement)) return [$createPoint(resolvedElement.__key, resolvedOffset, "element"), dirty];
		}
	} else resolvedNode = $getNodeFromDOM(dom);
	if (!$isTextNode(resolvedNode)) return null;
	return [$createPoint(resolvedNode.__key, $getTextNodeOffset(resolvedNode, resolvedOffset, "clamp"), "text"), dirty];
}
function resolveSelectionPointOnBoundary(point, isBackward, isCollapsed) {
	const offset = point.offset;
	const node = point.getNode();
	if (offset === 0) {
		const prevSibling = node.getPreviousSibling();
		const parent = node.getParent();
		if (!isBackward) {
			if ($isElementNode(prevSibling) && !isCollapsed && prevSibling.isInline()) point.set(prevSibling.__key, prevSibling.getChildrenSize(), "element");
			else if ($isTextNode(prevSibling) && !node.isUnmergeable()) point.set(prevSibling.__key, prevSibling.getTextContent().length, "text");
		} else if ((isCollapsed || !isBackward) && prevSibling === null && $isElementNode(parent) && parent.isInline()) {
			const parentSibling = parent.getPreviousSibling();
			if ($isTextNode(parentSibling)) point.set(parentSibling.__key, parentSibling.getTextContent().length, "text");
		}
	} else if (offset === node.getTextContent().length) {
		const nextSibling = node.getNextSibling();
		const parent = node.getParent();
		if (isBackward && $isElementNode(nextSibling) && nextSibling.isInline()) point.set(nextSibling.__key, 0, "element");
		else if ((isCollapsed || isBackward) && nextSibling === null && $isElementNode(parent) && parent.isInline() && !parent.canInsertTextAfter() && parent.getTextContentSize() > 1) {
			const parentSibling = parent.getNextSibling();
			if ($isTextNode(parentSibling)) point.set(parentSibling.__key, 0, "text");
		}
	}
}
function $normalizeSelectionPointsForBoundaries(anchor, focus, lastSelection) {
	if (anchor.type === "text" && focus.type === "text") {
		const isBackward = anchor.isBefore(focus);
		const isCollapsed = anchor.is(focus);
		resolveSelectionPointOnBoundary(anchor, isBackward, isCollapsed);
		resolveSelectionPointOnBoundary(focus, !isBackward, isCollapsed);
		if (isCollapsed) focus.set(anchor.key, anchor.offset, anchor.type);
	}
}
function $getPointSlotFrame(point) {
	const node = $getNodeByKey(point.key);
	return node === null ? null : $getSlotFrame(node);
}
function $slotStraddleFocusAfterAnchor(anchorPoint, focusPoint, anchorFrame, focusFrame) {
	if (anchorFrame !== null && focusFrame !== null) {
		const anchorHost = $getSlotHost(anchorFrame);
		const focusHost = $getSlotHost(focusFrame);
		if (anchorHost !== null && anchorHost.is(focusHost)) {
			for (const slotKey of $getSlotMap(anchorHost).values()) {
				if (slotKey === anchorFrame.getKey()) return true;
				if (slotKey === focusFrame.getKey()) return false;
			}
			return true;
		}
		return anchorHost !== null && focusHost !== null ? anchorHost.isBefore(focusHost) : true;
	}
	if (anchorFrame !== null) {
		const anchorHost = $getSlotHost(anchorFrame);
		const focusNode = $getNodeByKey(focusPoint.key);
		if (anchorHost === null || focusNode === null) return true;
		if (anchorHost.is(focusNode) || anchorHost.isParentOf(focusNode)) return true;
		return anchorHost.isBefore(focusNode);
	}
	const focusHost = $getSlotHost(focusFrame);
	const anchorNode = $getNodeByKey(anchorPoint.key);
	if (focusHost === null || anchorNode === null) return false;
	if (focusHost.is(anchorNode) || focusHost.isParentOf(anchorNode)) return false;
	return anchorNode.isBefore(focusHost);
}
function $clampSelectionPointsToSlotFrame(anchorPoint, focusPoint, resolveFocusAfterAnchor) {
	const anchorFrame = $getPointSlotFrame(anchorPoint);
	const focusFrame = $getPointSlotFrame(focusPoint);
	if (anchorFrame === focusFrame || anchorFrame !== null && focusFrame !== null && anchorFrame.is(focusFrame)) return false;
	const focusAfterAnchor = resolveFocusAfterAnchor(anchorFrame, focusFrame);
	if (anchorFrame !== null) {
		if ($isElementNode(anchorFrame)) focusPoint.set(anchorFrame.getKey(), focusAfterAnchor ? anchorFrame.getChildrenSize() : 0, "element");
		else focusPoint.set(anchorFrame.getKey(), focusAfterAnchor ? anchorFrame.getTextContentSize() : 0, "text");
		return true;
	}
	const host = $getSlotHost(focusFrame);
	if (host === null) return false;
	const hostParent = host.getParent();
	if (hostParent === null) return false;
	const hostIndex = host.getIndexWithinParent();
	focusPoint.set(hostParent.getKey(), focusAfterAnchor ? hostIndex + 1 : hostIndex, "element");
	return true;
}
/**
* Programmatic counterpart of the DOM-read clamp: applied when a
* RangeSelection is committed via $setSelection so an API-built selection
* cannot straddle a slot boundary either. Direction comes from the model
* comparator (slots-first content order), not the caret system — a
* straddling pair has no common ancestor through __parent, so the caret
* comparison would throw (that integration is the deferred caret-slot work),
* and not from the DOM either, since $setSelection also runs in headless
* mode where there is no DOM. Marks the selection dirty when it mutates a
* point. No-op for non-slot trees (both frames null), evaluated before any
* direction work, so non-slot and headless callers are unaffected.
*
* @experimental named-slots
* @internal
*/
function $clampRangeSelectionToSlotFrame(selection) {
	const clamped = $clampSelectionPointsToSlotFrame(selection.anchor, selection.focus, (anchorFrame, focusFrame) => $slotStraddleFocusAfterAnchor(selection.anchor, selection.focus, anchorFrame, focusFrame));
	if (clamped) selection.dirty = true;
	return clamped;
}
function $internalResolveSelectionPoints(anchorDOM, anchorOffset, focusDOM, focusOffset, editor, lastSelection) {
	if (anchorDOM === null || focusDOM === null || !isSelectionWithinEditor(editor, anchorDOM, focusDOM)) return null;
	const resolvedAnchor = $internalResolveSelectionPoint(anchorDOM, anchorOffset, $isRangeSelection(lastSelection) ? lastSelection.anchor : null, editor);
	if (resolvedAnchor === null) return null;
	const resolvedFocus = $internalResolveSelectionPoint(focusDOM, focusOffset, $isRangeSelection(lastSelection) ? lastSelection.focus : null, editor);
	if (resolvedFocus === null) return null;
	const [resolvedAnchorPoint, anchorDirty] = resolvedAnchor;
	const [resolvedFocusPoint, focusDirty] = resolvedFocus;
	if (resolvedAnchorPoint.type === "element" && resolvedFocusPoint.type === "element") {
		const anchorNode = $getNodeFromDOM(anchorDOM);
		const focusNode = $getNodeFromDOM(focusDOM);
		if ($isDecoratorNode(anchorNode) && $isDecoratorNode(focusNode)) return null;
	}
	const slotClamped = editor._slotsUsed && $clampSelectionPointsToSlotFrame(resolvedAnchorPoint, resolvedFocusPoint, () => (anchorDOM.compareDocumentPosition(focusDOM) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0);
	$normalizeSelectionPointsForBoundaries(resolvedAnchorPoint, resolvedFocusPoint, lastSelection);
	return [
		resolvedAnchorPoint,
		resolvedFocusPoint,
		anchorDirty || focusDirty || slotClamped
	];
}
/** Returns true if the given node is a non-inline ElementNode. */
function $isBlockElementNode(node) {
	return $isElementNode(node) && !node.isInline();
}
function $internalMakeRangeSelection(anchorKey, anchorOffset, focusKey, focusOffset, anchorType, focusType) {
	const editorState = getActiveEditorState();
	const selection = new RangeSelection($createPoint(anchorKey, anchorOffset, anchorType), $createPoint(focusKey, focusOffset, focusType), 0, "");
	selection.dirty = true;
	editorState._selection = selection;
	return selection;
}
/** Creates a detached RangeSelection anchored at the root element origin (offset 0). */
function $createRangeSelection() {
	return new RangeSelection($createPoint("root", 0, "element"), $createPoint("root", 0, "element"), 0, "");
}
/** Creates an empty NodeSelection with no selected node keys. */
function $createNodeSelection() {
	return new NodeSelection(/* @__PURE__ */ new Set());
}
function $internalCreateSelection(editor, event) {
	const lastSelection = editor.getEditorState()._selection;
	const domSelection = getDOMSelection(getWindow(editor));
	if ($isRangeSelection(lastSelection) || lastSelection == null) return $internalCreateRangeSelection(lastSelection, domSelection, editor, event);
	return lastSelection.clone();
}
/** Creates a RangeSelection from the given DOM selection, or returns null if one cannot be resolved. */
function $createRangeSelectionFromDom(domSelection, editor) {
	return $internalCreateRangeSelection(null, domSelection, editor, null);
}
function $internalCreateRangeSelection(lastSelection, domSelection, editor, event) {
	const windowObj = editor._window;
	if (windowObj === null) return null;
	const windowEvent = event || windowObj.event;
	const eventType = windowEvent ? windowEvent.type : void 0;
	const isSelectionChange = eventType === "selectionchange";
	const useDOMSelection = !getIsProcessingMutations() && (isSelectionChange || eventType === "beforeinput" || eventType === "compositionstart" || eventType === "compositionend" || eventType === "click" && windowEvent && windowEvent.detail === 3 || eventType === "drop" || eventType === void 0);
	let anchorDOM, focusDOM, anchorOffset, focusOffset;
	if (!$isRangeSelection(lastSelection) || useDOMSelection) {
		if (domSelection === null) return null;
		const points = getDOMSelectionPoints(domSelection, editor._rootElement);
		anchorDOM = points.anchorNode;
		focusDOM = points.focusNode;
		anchorOffset = points.anchorOffset;
		focusOffset = points.focusOffset;
		if ((isSelectionChange || eventType === void 0) && $isRangeSelection(lastSelection) && !isSelectionWithinEditor(editor, anchorDOM, focusDOM)) return lastSelection.clone();
	} else return lastSelection.clone();
	const resolvedSelectionPoints = $internalResolveSelectionPoints(anchorDOM, anchorOffset, focusDOM, focusOffset, editor, lastSelection);
	if (resolvedSelectionPoints === null) return null;
	const [resolvedAnchorPoint, resolvedFocusPoint, dirty] = resolvedSelectionPoints;
	let format = 0;
	let style = "";
	if ($isRangeSelection(lastSelection)) {
		const lastAnchor = lastSelection.anchor;
		if (resolvedAnchorPoint.key === lastAnchor.key) {
			format = lastSelection.format;
			style = lastSelection.style;
		} else {
			const anchorNode = resolvedAnchorPoint.getNode();
			if ($isTextNode(anchorNode)) {
				format = anchorNode.getFormat();
				style = anchorNode.getStyle();
			} else if ($isElementNode(anchorNode)) {
				format = anchorNode.getTextFormat();
				style = anchorNode.getTextStyle();
			}
		}
	}
	const newSelection = new RangeSelection(resolvedAnchorPoint, resolvedFocusPoint, format, style);
	if (dirty) newSelection.dirty = true;
	return newSelection;
}
/**
* Re-reads the format and style that a collapsed insertion would use from the
* selection's anchor, after `removeText` left the caret in a node it did not
* start in (#6781).
*
* {@link $internalCreateRangeSelection} already does this for every selection
* change that originates in the DOM (a click, an arrow key), which is why
* those keep the toolbar in sync.
*
* Landing on the same node is not a move: a format toggled on a collapsed
* caret is armed for the next insertion and is deliberately not backed by the
* node yet, so it must survive being re-selected in place.
*
* Deliberately *not* called from `ElementNode.select()`/`TextNode.select()`:
* those are how nearly every edit repositions its own caret, so refreshing
* there discards a format armed with Cmd+B on the way through Enter,
* Shift+Enter and paste.
*/
function $internalRefreshSelectionFormatAndStyle(selection, previousAnchorKey) {
	const anchor = selection.anchor;
	if (anchor.key === previousAnchorKey) return;
	const anchorNode = anchor.getNode();
	let format = 0;
	let style = "";
	if ($isTextNode(anchorNode)) {
		format = anchorNode.getFormat();
		style = anchorNode.getStyle();
	} else if ($isElementNode(anchorNode)) {
		format = anchorNode.getTextFormat();
		style = anchorNode.getTextStyle();
	}
	if (selection.format !== format || selection.style !== style) {
		selection.format = format;
		selection.style = style;
		selection.dirty = true;
	}
}
/** Returns the current selection of the active editor state, or null if none exists. */
function $getSelection() {
	return getActiveEditorState()._selection;
}
/** Returns the selection from the previous editor state, or null if none existed. */
function $getPreviousSelection() {
	return getActiveEditor()._editorState._selection;
}
/**
* Whether `selection` has a point directly on `parentNode`, which is exactly
* the condition under which
* {@link $updateElementSelectionOnCreateDeleteNode} does anything at all.
* @internal
*
* Every caller of that function has to compute a child offset first, and
* `getIndexWithinParent` walks the parent's children from the first one, so
* doing it unconditionally makes a bulk insert or removal quadratic (#5194).
* Guarding the walk with this predicate skips it whenever the update would
* be a no-op. It is the same test the early return uses, so the two cannot
* drift apart.
*
* Note that a point *inside* `parentNode` (a text point on one of its
* descendants, say) does not count: the function only shifts offsets that
* are element-anchored on `parentNode` itself.
*
* This function is for internal use of the library.
* Please do not use it as it may change in the future.
*/
function $selectionTouchesElement(selection, parentNode) {
	const parentKey = parentNode.__key;
	return selection.anchor.key === parentKey || selection.focus.key === parentKey;
}
function $updateElementSelectionOnCreateDeleteNode(selection, parentNode, nodeOffset, times = 1) {
	if (!$selectionTouchesElement(selection, parentNode)) return;
	const anchor = selection.anchor;
	const focus = selection.focus;
	const parentKey = parentNode.__key;
	if (selection.isCollapsed()) {
		const selectionOffset = anchor.offset;
		if (nodeOffset <= selectionOffset && times > 0 || nodeOffset < selectionOffset && times < 0) {
			const newSelectionOffset = Math.max(0, selectionOffset + times);
			anchor.set(parentKey, newSelectionOffset, "element");
			focus.set(parentKey, newSelectionOffset, "element");
			$updateSelectionResolveTextNodes(selection);
		}
	} else {
		const isBackward = selection.isBackward();
		const firstPoint = isBackward ? focus : anchor;
		const firstPointNode = firstPoint.getNode();
		const lastPoint = isBackward ? anchor : focus;
		const lastPointNode = lastPoint.getNode();
		if (parentNode.is(firstPointNode)) {
			const firstPointOffset = firstPoint.offset;
			if (nodeOffset <= firstPointOffset && times > 0 || nodeOffset < firstPointOffset && times < 0) firstPoint.set(parentKey, Math.max(0, firstPointOffset + times), "element");
		}
		if (parentNode.is(lastPointNode)) {
			const lastPointOffset = lastPoint.offset;
			if (nodeOffset <= lastPointOffset && times > 0 || nodeOffset < lastPointOffset && times < 0) lastPoint.set(parentKey, Math.max(0, lastPointOffset + times), "element");
		}
	}
	$updateSelectionResolveTextNodes(selection);
}
function $updateSelectionResolveTextNodes(selection) {
	const anchor = selection.anchor;
	const anchorOffset = anchor.offset;
	const focus = selection.focus;
	const focusOffset = focus.offset;
	const anchorNode = anchor.getNode();
	const focusNode = focus.getNode();
	if (selection.isCollapsed()) {
		if (!$isElementNode(anchorNode)) return;
		const childSize = anchorNode.getChildrenSize();
		const anchorOffsetAtEnd = anchorOffset >= childSize;
		const child = anchorOffsetAtEnd ? anchorNode.getChildAtIndex(childSize - 1) : anchorNode.getChildAtIndex(anchorOffset);
		if ($isTextNode(child)) {
			let newOffset = 0;
			if (anchorOffsetAtEnd) newOffset = child.getTextContentSize();
			anchor.set(child.__key, newOffset, "text");
			focus.set(child.__key, newOffset, "text");
		}
		return;
	}
	if ($isElementNode(anchorNode)) {
		const childSize = anchorNode.getChildrenSize();
		const anchorOffsetAtEnd = anchorOffset >= childSize;
		const child = anchorOffsetAtEnd ? anchorNode.getChildAtIndex(childSize - 1) : anchorNode.getChildAtIndex(anchorOffset);
		if ($isTextNode(child)) {
			let newOffset = 0;
			if (anchorOffsetAtEnd) newOffset = child.getTextContentSize();
			anchor.set(child.__key, newOffset, "text");
		}
	}
	if ($isElementNode(focusNode)) {
		const childSize = focusNode.getChildrenSize();
		const focusOffsetAtEnd = focusOffset >= childSize;
		const child = focusOffsetAtEnd ? focusNode.getChildAtIndex(childSize - 1) : focusNode.getChildAtIndex(focusOffset);
		if ($isTextNode(child)) {
			let newOffset = 0;
			if (focusOffsetAtEnd) newOffset = child.getTextContentSize();
			focus.set(child.__key, newOffset, "text");
		}
	}
}
function applySelectionTransforms(nextEditorState, editor) {
	const prevSelection = editor.getEditorState()._selection;
	const nextSelection = nextEditorState._selection;
	if ($isRangeSelection(nextSelection)) {
		const anchor = nextSelection.anchor;
		const focus = nextSelection.focus;
		let anchorNode;
		if (anchor.type === "text") {
			anchorNode = anchor.getNode();
			anchorNode.selectionTransform(prevSelection, nextSelection);
		}
		if (focus.type === "text") {
			const focusNode = focus.getNode();
			if (anchorNode !== focusNode) focusNode.selectionTransform(prevSelection, nextSelection);
		}
	}
}
function moveSelectionPointToSibling(point, node, parent, prevSibling, nextSibling) {
	let siblingKey = null;
	let offset = 0;
	let type = null;
	if (prevSibling !== null) {
		siblingKey = prevSibling.__key;
		if ($isTextNode(prevSibling)) {
			offset = prevSibling.getTextContentSize();
			type = "text";
		} else if ($isElementNode(prevSibling)) {
			offset = prevSibling.getChildrenSize();
			type = "element";
		}
	} else if (nextSibling !== null) {
		siblingKey = nextSibling.__key;
		if ($isTextNode(nextSibling)) type = "text";
		else if ($isElementNode(nextSibling)) type = "element";
	}
	if (siblingKey !== null && type !== null) point.set(siblingKey, offset, type);
	else {
		offset = node.getIndexWithinParent();
		if (offset === -1) offset = parent.getChildrenSize();
		point.set(parent.__key, offset, "element");
	}
}
function adjustPointOffsetForMergedSibling(point, isBefore, key, target, textLength) {
	if (point.type === "text") point.set(key, point.offset + (isBefore ? 0 : textLength), "text");
	else if (point.offset > target.getIndexWithinParent()) point.set(point.key, point.offset - 1, "element");
}
function setDOMSelectionBaseAndExtent(domSelection, nextAnchorDOM, nextAnchorOffset, nextFocusDOM, nextFocusOffset) {
	try {
		domSelection.setBaseAndExtent(nextAnchorDOM, nextAnchorOffset, nextFocusDOM, nextFocusOffset);
	} catch (error) {}
}
function $getElementAndOffsetForPoint(editor, node, offset) {
	const element = getElementByKeyOrThrow(editor, node.getKey());
	if ($isElementNode(node)) {
		const slot = $getDOMSlot(node, element, editor);
		return [slot.element, offset + slot.getFirstChildOffset()];
	}
	return [element, offset];
}
/**
* The DOM node that a caret at an element point is measured on to scroll it
* into view: the child at `offset` in the element's slot, which the caret is
* just before. When that child is the keyed DOM of a leaf node whose DOM slot
* is an element inside it, like a <br> that a DOMRenderExtension override
* wraps in a <span>, the caret is next to that inner element. The wrapper
* can be much wider, for example when it also draws something at the start
* of the next line, so it is not measured.
*/
function $getElementPointScrollTarget(editor, slotElement, offset) {
	const child = slotElement.childNodes[offset];
	if (!isHTMLElement(child)) return child || null;
	const key = getNodeKeyFromDOMNode(child, editor);
	const node = key !== void 0 ? $getNodeByKey(key) : null;
	return node !== null && !$isElementNode(node) ? $getDOMSlot(node, child, editor).element : child;
}
/** @internal */
function $updateDOMSelection(prevSelection, nextSelection, editor, domSelection, tags, rootElement) {
	const rootForActive = rootElement.getRootNode();
	const activeElement = isDOMDocumentNode(rootForActive) || isDOMShadowRoot(rootForActive) ? getActiveElementDeep(rootForActive) : null;
	if (tags.has("collaboration") && activeElement !== rootElement || activeElement !== null && $isSelectionCapturedInDecoratorInput(activeElement, activeElement)) return;
	const currentPoints = getDOMSelectionPoints(domSelection, rootElement);
	let currentRangeCache;
	const getCurrentRange = () => {
		if (currentRangeCache === void 0) currentRangeCache = getDOMSelectionRange(domSelection, rootElement);
		return currentRangeCache;
	};
	if (!$isRangeSelection(nextSelection)) {
		if (prevSelection !== null && isSelectionWithinEditor(editor, currentPoints.anchorNode, currentPoints.focusNode)) domSelection.removeAllRanges();
		return;
	}
	const anchor = nextSelection.anchor;
	const focus = nextSelection.focus;
	const anchorNode = anchor.getNode();
	const focusNode = focus.getNode();
	const [anchorDOM, nextAnchorOffset] = $getElementAndOffsetForPoint(editor, anchorNode, anchor.offset);
	const [focusDOM, nextFocusOffset] = $getElementAndOffsetForPoint(editor, focusNode, focus.offset);
	const nextFormat = nextSelection.format;
	const nextStyle = nextSelection.style;
	const isCollapsed = nextSelection.isCollapsed();
	let nextAnchorNode = anchorDOM;
	let nextFocusNode = focusDOM;
	let anchorFormatOrStyleChanged = false;
	if (anchor.type === "text") {
		nextAnchorNode = $isTextNode(anchorNode) ? $getDOMTextNode(anchorNode, anchorDOM, editor) : null;
		anchorFormatOrStyleChanged = anchorNode.getFormat() !== nextFormat || anchorNode.getStyle() !== nextStyle;
	} else if ($isRangeSelection(prevSelection) && prevSelection.anchor.type === "text") anchorFormatOrStyleChanged = true;
	if (focus.type === "text") nextFocusNode = $isTextNode(focusNode) ? $getDOMTextNode(focusNode, focusDOM, editor) : null;
	if (nextAnchorNode === null || nextFocusNode === null) return;
	if (isCollapsed && (prevSelection === null || anchorFormatOrStyleChanged || $isRangeSelection(prevSelection) && (prevSelection.format !== nextFormat || prevSelection.style !== nextStyle))) markCollapsedSelectionFormat(editor, nextFormat, nextStyle, nextAnchorOffset, anchor.key, performance.now());
	if (!(domSelection.type === "Range" && isCollapsed) && currentPoints.anchorOffset === nextAnchorOffset && currentPoints.focusOffset === nextFocusOffset && currentPoints.anchorNode === nextAnchorNode && currentPoints.focusNode === nextFocusNode) {
		if (activeElement === null || !rootElement.contains(activeElement)) {
			const focusEditor = activeElement !== null ? getNearestEditorFromDOMNode(activeElement) : null;
			if ((focusEditor === null || focusEditor === editor) && !tags.has("skip-selection-focus")) rootElement.focus({ preventScroll: true });
		}
		if (anchor.type !== "element") return;
	}
	setDOMSelectionBaseAndExtent(domSelection, nextAnchorNode, nextAnchorOffset, nextFocusNode, nextFocusOffset);
	if (IS_FIREFOX && nextSelection.isCollapsed() && rootElement !== null && !tags.has("skip-selection-focus")) {
		const focusedElement = getActiveElement(rootElement);
		if (focusedElement === null || !rootElement.contains(focusedElement)) {
			const deepFocusedElement = getActiveElementDeep(rootElement.ownerDocument);
			const focusEditor = deepFocusedElement !== null ? getNearestEditorFromDOMNode(deepFocusedElement) : null;
			if (focusEditor === null || focusEditor === editor) rootElement.focus({ preventScroll: true });
		}
	}
	if (!tags.has("skip-scroll-into-view") && nextSelection.isCollapsed() && rootElement !== null && rootElement === getActiveElement(rootElement)) {
		const selectionTarget = $isRangeSelection(nextSelection) && nextSelection.anchor.type === "element" ? $getElementPointScrollTarget(editor, nextAnchorNode, nextAnchorOffset) : getCurrentRange();
		if (selectionTarget !== null) {
			let selectionRect;
			if (isDOMTextNode(selectionTarget)) {
				const range = selectionTarget.ownerDocument.createRange();
				range.selectNode(selectionTarget);
				selectionRect = range.getBoundingClientRect();
			} else if (isHTMLElement(selectionTarget)) selectionRect = selectionTarget.getBoundingClientRect();
			else selectionRect = getCaretRect(selectionTarget);
			scrollIntoViewIfNeeded(editor, selectionRect, rootElement, nextAnchorNode);
		}
	}
	markSelectionChangeFromDOMUpdate(editor, nextAnchorNode, nextAnchorOffset, nextFocusNode, nextFocusOffset);
}
/** Inserts nodes into the current selection, falling back to the previous selection or the end of the root. */
function $insertNodes(nodes) {
	let selection = $getSelection() || $getPreviousSelection();
	if (selection === null) selection = $getRoot().selectEnd();
	selection.insertNodes(nodes);
}
/**
* Push-lex a raw text string into `linebreak` (`\n` / `\r\n`), `tab`
* (`\t`), and `text` (everything else) tokens, dispatching each to the
* matching callback on `visitor` in source order.
*
* Shared by {@link $generateNodesFromRawText} (which builds
* `LineBreakNode` / `TabNode` / `TextNode` siblings) and by
* `@lexical/clipboard`'s default `text/plain` clipboard importer
* (which maps `linebreak` to a real paragraph break via
* `insertParagraph` so multi-line plain text becomes multi-paragraph
* rich text). Empty text runs are dropped so callers don't need to
* special-case them.
*/
function tokenizeRawText(text, visitor) {
	for (const part of text.split(/(\r?\n|\t)/)) if (part === "\n" || part === "\r\n") visitor.linebreak();
	else if (part === "	") visitor.tab();
	else if (part !== "") visitor.text(part);
}
/**
* Convert a raw text string into a flat array of `TextNode`,
* `LineBreakNode`, and `TabNode` siblings, splitting on `\n`, `\r\n`,
* and `\t`. Use this when you need the same `\n` / `\t` → real-node
* conversion that {@link RangeSelection.insertRawText} performs but
* without a selection — e.g. when building a `CodeNode`'s children
* inside a DOM-import rule.
*/
function $generateNodesFromRawText(text) {
	const nodes = [];
	tokenizeRawText(text, {
		linebreak: () => nodes.push($createLineBreakNode()),
		tab: () => nodes.push($createTabNode()),
		text: (part) => nodes.push($createTextNode(part))
	});
	return nodes;
}
/** Returns the text content of the current selection, or an empty string if no selection exists. */
function $getTextContent() {
	const selection = $getSelection();
	if (selection === null) return "";
	return selection.getTextContent();
}
function $extractInlineFromBlocks(nodes) {
	const inlineNodes = [];
	for (const node of nodes) {
		if ($isLineBreakNode(node)) continue;
		if (($isElementNode(node) || $isDecoratorNode(node)) && !node.isInline()) {
			if ($isElementNode(node)) inlineNodes.push(...$extractInlineFromBlocks(node.getChildren()));
			continue;
		}
		inlineNodes.push(node);
	}
	return inlineNodes;
}
/**
* Removes the selected text and splits the ancestor chain at the anchor up to
* the nearest block, returning the node the caller should insert into and the
* index within it.
*
* @param stopAtUnsplittableNode - when true, stop the walk on an ElementNode
* that cannot be split instead of continuing past it, see
* {@link $splitNodeAtPoint}. The walk below never visits a block, so in
* practice this only ever stops on an inline ElementNode.
*/
function $removeTextAndSplitBlock(selection, stopAtUnsplittableNode = false) {
	let selection_ = selection;
	if (!selection.isCollapsed()) selection_.removeText();
	const newSelection = $getSelection();
	if ($isRangeSelection(newSelection)) selection_ = newSelection;
	invariant($isRangeSelection(selection_), "Unexpected dirty selection to be null");
	const anchor = selection_.anchor;
	let node = anchor.getNode();
	let offset = anchor.offset;
	while (!INTERNAL_$isBlock(node) && $getSlotHostKey(node) === null) {
		const prevNode = node;
		[node, offset] = $splitNodeAtPoint(node, offset, stopAtUnsplittableNode);
		if (prevNode.is(node)) break;
	}
	return [node, offset];
}
/**
* Splits `node` at `offset`, returning the parent that now holds the two
* halves and the index between them.
*
* @param stopAtUnsplittableNode - an ElementNode is split by moving the
* children after `offset` into the node returned by its `insertNewAfter()`,
* but that returns null for any ElementNode that does not implement it (the
* base class default). Such a node cannot be split, and continuing the walk
* would move the insertion point past the whole node, so inline content
* pasted with the caret inside it would land after it instead of at the caret
* (#6477). When this is true the unsplittable node itself is returned so the
* caller inserts into it at `offset`; when false the previous behavior of
* ascending to the parent is kept. This does not itself test `isInline()` —
* the only caller that passes true is {@link $removeTextAndSplitBlock}, whose
* walk stops before it reaches a block.
*/
function $splitNodeAtPoint(node, offset, stopAtUnsplittableNode = false) {
	const parent = node.getParent();
	if (!parent) {
		const paragraph = $createParagraphNode();
		$getRoot().append(paragraph);
		paragraph.select();
		return [$getRoot(), 0];
	}
	if ($isTextNode(node)) {
		const split = node.splitText(offset);
		if (split.length === 0) return [parent, node.getIndexWithinParent()];
		const x = offset === 0 ? 0 : 1;
		return [parent, split[0].getIndexWithinParent() + x];
	}
	if (!$isElementNode(node) || offset === 0) return [parent, node.getIndexWithinParent()];
	const firstToAppend = node.getChildAtIndex(offset);
	if (firstToAppend) {
		const insertPoint = new RangeSelection($createPoint(node.__key, offset, "element"), $createPoint(node.__key, offset, "element"), 0, "");
		const newElement = node.insertNewAfter(insertPoint);
		if (newElement) newElement.append(firstToAppend, ...firstToAppend.getNextSiblings());
		else if (stopAtUnsplittableNode) return [node, offset];
	}
	return [parent, node.getIndexWithinParent() + 1];
}
function $isInlineRunNode(node) {
	return $isLineBreakNode(node) || $isInlineElementOrDecoratorNode(node) || $isTextNode(node) || node.isParentRequired();
}
function $wrapInlineNodes(nodes) {
	const virtualRoot = $createParagraphNode();
	let currentBlock = null;
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if ($isInlineRunNode(node)) {
			if (currentBlock === null) {
				currentBlock = node.createParentElementNode();
				virtualRoot.append(currentBlock);
				const nextNode = nodes[i + 1];
				if ($isLineBreakNode(node) && (nextNode === void 0 || !$isInlineRunNode(nextNode))) continue;
			}
			currentBlock.append(node);
		} else {
			virtualRoot.append(node);
			currentBlock = null;
		}
	}
	return virtualRoot;
}
/**
* Get all nodes in a CaretRange in a way that complies with all of the
* quirks of the original RangeSelection.getNodes().
*
* @param range The CaretRange
*/
function $getNodesFromCaretRangeCompat(range) {
	const nodes = [];
	const [beforeSlice, afterSlice] = range.getTextSlices();
	if (beforeSlice) nodes.push(beforeSlice.caret.origin);
	const seenAncestors = /* @__PURE__ */ new Set();
	const seenElements = /* @__PURE__ */ new Set();
	for (const caret of range) if ($isChildCaret(caret)) {
		const { origin } = caret;
		if (nodes.length === 0) seenAncestors.add(origin);
		else {
			seenElements.add(origin);
			nodes.push(origin);
		}
	} else {
		const { origin } = caret;
		if (!$isElementNode(origin) || !seenElements.has(origin)) nodes.push(origin);
	}
	if (afterSlice) nodes.push(afterSlice.caret.origin);
	if ($isSiblingCaret(range.focus) && $isElementNode(range.focus.origin) && range.focus.getNodeAtCaret() === null) for (let reverseCaret = $getChildCaret(range.focus.origin, "previous"); $isChildCaret(reverseCaret) && seenAncestors.has(reverseCaret.origin) && !reverseCaret.origin.isEmpty() && reverseCaret.origin.is(nodes[nodes.length - 1]); reverseCaret = $getAdjacentChildCaret(reverseCaret)) {
		seenAncestors.delete(reverseCaret.origin);
		nodes.pop();
	}
	while (nodes.length > 1) {
		const lastIncludedNode = nodes[nodes.length - 1];
		if ($isElementNode(lastIncludedNode)) {
			if (seenElements.has(lastIncludedNode) || lastIncludedNode.isEmpty() || seenAncestors.has(lastIncludedNode)) {} else {
				nodes.pop();
				continue;
			}
		}
		break;
	}
	if (nodes.length === 0 && range.isCollapsed()) {
		const normCaret = $normalizeCaret(range.anchor);
		const flippedNormCaret = $normalizeCaret(range.anchor.getFlipped());
		const $getCandidate = (caret) => $isTextPointCaret(caret) ? caret.origin : caret.getNodeAtCaret();
		const node = $getCandidate(normCaret) || $getCandidate(flippedNormCaret) || (range.anchor.getNodeAtCaret() ? normCaret.origin : flippedNormCaret.origin);
		nodes.push(node);
	}
	return nodes;
}
/**
* @internal
*
* Modify the focus of the focus around possible decorators and blocks and return true
* if the movement is done.
*/
function $modifySelectionAroundDecoratorsAndBlocks(selection, alter, isBackward, granularity, mode = "decorators-and-blocks") {
	if (alter === "move" && granularity === "character" && !selection.isCollapsed()) {
		const [src, dst] = isBackward === selection.isBackward() ? [selection.focus, selection.anchor] : [selection.anchor, selection.focus];
		dst.set(src.key, src.offset, src.type);
		return true;
	}
	const initialFocus = $caretFromPoint(selection.focus, isBackward ? "previous" : "next");
	const isLineBoundary = granularity === "lineboundary";
	const collapse = alter === "move";
	let focus = initialFocus;
	let checkForBlock = mode === "decorators-and-blocks";
	let isolated = false;
	if (!$isExtendableTextPointCaret(focus)) {
		for (const siblingCaret of focus) {
			checkForBlock = false;
			const { origin } = siblingCaret;
			if ($isDecoratorNode(origin)) {
				if (origin.isIsolated()) {
					isolated = true;
					break;
				}
				focus = siblingCaret;
				if (isLineBoundary && origin.isInline()) continue;
			}
			break;
		}
		if (isolated) return true;
		if (checkForBlock) for (const nextCaret of $extendCaretToRange(initialFocus).iterNodeCarets(alter === "extend" ? "shadowRoot" : "root")) {
			if ($isChildCaret(nextCaret)) {
				if (!nextCaret.origin.isInline()) focus = nextCaret;
			} else if ($isElementNode(nextCaret.origin)) continue;
			else if ($isDecoratorNode(nextCaret.origin) && !nextCaret.origin.isInline()) focus = nextCaret;
			break;
		}
	}
	if (focus === initialFocus) return false;
	if (collapse && !isLineBoundary && $isDecoratorNode(focus.origin) && focus.origin.isKeyboardSelectable()) {
		const nodeSelection = $createNodeSelection();
		nodeSelection.add(focus.origin.getKey());
		$setSelection(nodeSelection);
		return true;
	}
	focus = $normalizeCaret(focus);
	if (collapse) $setPointFromCaret(selection.anchor, focus);
	$setPointFromCaret(selection.focus, focus);
	return checkForBlock || !isLineBoundary;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalUpdates.ts
var activeEditorState = null;
var activeEditor = null;
var isReadOnlyMode = false;
var isAttemptingToRecoverFromReconcilerError = false;
var isCommittingPendingUpdates = false;
var editorsWithPendingCascadeReset = /* @__PURE__ */ new Set();
var editorsWithPendingSelectionChange = /* @__PURE__ */ new Set();
var infiniteTransformCount = 0;
var observerOptions = {
	characterData: true,
	childList: true,
	subtree: true
};
/** Returns true if the current editor update context is read-only. */
function isCurrentlyReadOnlyMode() {
	return isReadOnlyMode || activeEditorState !== null && activeEditorState._readOnly;
}
function errorOnReadOnly() {
	if (isReadOnlyMode) invariant(false, "Cannot use method in read-only mode.");
}
function errorOnInfiniteTransforms() {
	if (infiniteTransformCount > 99) invariant(false, "One or more transforms are endlessly triggering additional transforms. May have encountered infinite recursion caused by transforms that have their preconditions too lose and/or conflict with each other.");
}
function getActiveEditorState() {
	if (activeEditorState === null) invariant(false, "Unable to find an active editor state. State helpers or node methods can only be used synchronously during the callback of editor.update(), editor.read(), or editorState.read().%s", collectBuildInformation());
	return activeEditorState;
}
/** @internal */
function $assumeActiveEditor(editor) {
	if (getActiveEditorState() !== null && activeEditor === null) activeEditor = editor;
	devInvariant(activeEditor === editor, "The given editor argument does not match $getEditor() in this context. Use editor.getEditorState().read(..., {editor}) if this cross-editor call is intentional.");
}
function getActiveEditor() {
	if (activeEditor === null) invariant(false, "Unable to find an active editor. This method can only be used synchronously during the callback of editor.update(), editor.read(), or editor.getEditorState().read(..., {editor}).%s", collectBuildInformation());
	return activeEditor;
}
/**
* Schedule a full reconcile of the active editor, so that every node is
* re-rendered through the current {@link EditorDOMRenderConfig} on the next
* commit. Unlike {@link LexicalNode.markDirty}, this does not clone or
* otherwise mutate the node map, so no mutation/collaboration listeners
* observe a change. Must be called within an `editor.update`.
*
* @internal
*/
function $fullReconcile() {
	getActiveEditor()._dirtyType = 2;
}
function collectBuildInformation() {
	let compatibleEditors = 0;
	const incompatibleEditors = /* @__PURE__ */ new Set();
	const thisVersion = LexicalEditor.version;
	if (typeof window !== "undefined") for (const node of findAllLexicalElementsDeep(document)) {
		const editor = getEditorPropertyFromDOMNode(node);
		if (isLexicalEditor(editor)) compatibleEditors++;
		else if (editor) {
			let version = String(editor.constructor.version || "<0.17.1");
			if (version === thisVersion) version += " (separately built, likely a bundler configuration issue)";
			incompatibleEditors.add(version);
		}
	}
	let output = ` Detected on the page: ${compatibleEditors} compatible editor(s) with version ${thisVersion}`;
	if (incompatibleEditors.size) output += ` and incompatible editors with versions ${Array.from(incompatibleEditors).join(", ")}`;
	return output;
}
function internalGetActiveEditor() {
	return activeEditor;
}
function $applyTransforms(editor, node, transformsCache) {
	const type = node.__type;
	const registeredNode = getRegisteredNodeOrThrow(editor, type);
	let transformsArr = transformsCache.get(type);
	if (transformsArr === void 0) {
		transformsArr = Array.from(registeredNode.transforms);
		transformsCache.set(type, transformsArr);
	}
	const transformsArrLength = transformsArr.length;
	for (let i = 0; i < transformsArrLength; i++) {
		transformsArr[i](node);
		if (!node.isAttached()) break;
	}
}
function $isNodeValidForTransform(node, compositionKey) {
	return node !== void 0 && node.__key !== compositionKey && node.isAttached();
}
function $normalizeAllDirtyTextNodes(editorState, editor) {
	const dirtyLeaves = editor._dirtyLeaves;
	const nodeMap = editorState._nodeMap;
	for (const nodeKey of dirtyLeaves) {
		const node = nodeMap.get(nodeKey);
		if ($isTextNode(node) && node.isAttached() && node.isSimpleText() && !node.isUnmergeable()) $normalizeTextNode(node);
	}
}
function addTags(editor, tags) {
	if (!tags) return;
	const updateTags = editor._updateTags;
	let tags_ = tags;
	if (!Array.isArray(tags)) tags_ = [tags];
	for (const tag of tags_) updateTags.add(tag);
}
/**
* Transform heuristic:
* 1. We transform leaves first. If transforms generate additional dirty nodes we repeat step 1.
* The reasoning behind this is that marking a leaf as dirty marks all its parent elements as dirty too.
* 2. We transform elements. If element transforms generate additional dirty nodes we repeat step 1.
* If element transforms only generate additional dirty elements we only repeat step 2.
*
* Note that to keep track of newly dirty nodes and subtrees we leverage the editor._dirtyNodes and
* editor._subtrees which we reset in every loop.
*/
function $applyAllTransforms(editorState, editor) {
	const dirtyLeaves = editor._dirtyLeaves;
	const dirtyElements = editor._dirtyElements;
	const nodeMap = editorState._nodeMap;
	const compositionKey = $getCompositionKey();
	const transformsCache = /* @__PURE__ */ new Map();
	let untransformedDirtyLeaves = dirtyLeaves;
	let untransformedDirtyLeavesLength = untransformedDirtyLeaves.size;
	let untransformedDirtyElements = dirtyElements;
	let untransformedDirtyElementsLength = untransformedDirtyElements.size;
	while (untransformedDirtyLeavesLength > 0 || untransformedDirtyElementsLength > 0) {
		if (untransformedDirtyLeavesLength > 0) {
			editor._dirtyLeaves = /* @__PURE__ */ new Set();
			for (const nodeKey of untransformedDirtyLeaves) {
				const node = nodeMap.get(nodeKey);
				if ($isTextNode(node) && node.isAttached() && node.isSimpleText() && !node.isUnmergeable()) $normalizeTextNode(node);
				if (node !== void 0 && $isNodeValidForTransform(node, compositionKey)) $applyTransforms(editor, node, transformsCache);
				dirtyLeaves.add(nodeKey);
			}
			untransformedDirtyLeaves = editor._dirtyLeaves;
			untransformedDirtyLeavesLength = untransformedDirtyLeaves.size;
			if (untransformedDirtyLeavesLength > 0) {
				infiniteTransformCount++;
				continue;
			}
		}
		editor._dirtyLeaves = /* @__PURE__ */ new Set();
		editor._dirtyElements = /* @__PURE__ */ new Map();
		if (untransformedDirtyElements.delete("root")) untransformedDirtyElements.set("root", true);
		for (const currentUntransformedDirtyElement of untransformedDirtyElements) {
			const nodeKey = currentUntransformedDirtyElement[0];
			const intentionallyMarkedAsDirty = currentUntransformedDirtyElement[1];
			dirtyElements.set(nodeKey, intentionallyMarkedAsDirty);
			if (!intentionallyMarkedAsDirty) continue;
			const node = nodeMap.get(nodeKey);
			if (node !== void 0 && $isNodeValidForTransform(node, compositionKey)) $applyTransforms(editor, node, transformsCache);
		}
		untransformedDirtyLeaves = editor._dirtyLeaves;
		untransformedDirtyLeavesLength = untransformedDirtyLeaves.size;
		untransformedDirtyElements = editor._dirtyElements;
		untransformedDirtyElementsLength = untransformedDirtyElements.size;
		infiniteTransformCount++;
	}
	editor._dirtyLeaves = dirtyLeaves;
	editor._dirtyElements = dirtyElements;
}
/** Deserializes a SerializedLexicalNode JSON object into its corresponding LexicalNode instance. */
function $parseSerializedNode(serializedNode) {
	return $parseSerializedNodeImpl(serializedNode, getActiveEditor()._nodes);
}
function $parseSerializedNodeImpl(serializedNode, registeredNodes) {
	const type = serializedNode.type;
	const registeredNode = registeredNodes.get(type);
	if (registeredNode === void 0) invariant(false, "parseEditorState: type \"%s\" + not found", type);
	const nodeClass = registeredNode.klass;
	if (serializedNode.type !== nodeClass.getType()) invariant(false, "LexicalNode: Node %s does not implement .importJSON().", nodeClass.name);
	const node = nodeClass.importJSON(serializedNode);
	const children = serializedNode.children;
	if ($isElementNode(node) && Array.isArray(children)) for (let i = 0; i < children.length; i++) {
		const serializedJSONChildNode = children[i];
		const childNode = $parseSerializedNodeImpl(serializedJSONChildNode, registeredNodes);
		node.append(childNode);
	}
	const slots = serializedNode.$slots;
	if (slots) {
		invariant($isSlotHost(node), "$parseSerializedNode: node %s has slots but is not a valid slot host; only ElementNodes and DecoratorNodes can host slots.", nodeClass.name);
		for (const name in slots) $setSlot(node, name, $parseSerializedNodeImpl(slots[name], registeredNodes));
	}
	return node;
}
function parseEditorState(serializedEditorState, editor, updateFn) {
	const editorState = createEmptyEditorState();
	const previousActiveEditorState = activeEditorState;
	const previousReadOnlyMode = isReadOnlyMode;
	const previousActiveEditor = activeEditor;
	const previousDirtyElements = editor._dirtyElements;
	const previousDirtyLeaves = editor._dirtyLeaves;
	const previousCloneNotNeeded = editor._cloneNotNeeded;
	const previousDirtyType = editor._dirtyType;
	editor._dirtyElements = /* @__PURE__ */ new Map();
	editor._dirtyLeaves = /* @__PURE__ */ new Set();
	editor._cloneNotNeeded = /* @__PURE__ */ new Map();
	editor._dirtyType = 0;
	activeEditorState = editorState;
	isReadOnlyMode = false;
	activeEditor = editor;
	setPendingNodeToClone(null);
	try {
		const registeredNodes = editor._nodes;
		const serializedNode = serializedEditorState.root;
		$parseSerializedNodeImpl(serializedNode, registeredNodes);
		if (updateFn) updateFn();
		editorState._readOnly = true;
		editorState._parsed = true;
	} catch (error) {
		if (error instanceof Error) editor._onError(error);
	} finally {
		editor._dirtyElements = previousDirtyElements;
		editor._dirtyLeaves = previousDirtyLeaves;
		editor._cloneNotNeeded = previousCloneNotNeeded;
		editor._dirtyType = previousDirtyType;
		activeEditorState = previousActiveEditorState;
		isReadOnlyMode = previousReadOnlyMode;
		activeEditor = previousActiveEditor;
	}
	return editorState;
}
function readEditorState(editor, editorState, callbackFn) {
	const previousActiveEditorState = activeEditorState;
	const previousReadOnlyMode = isReadOnlyMode;
	const previousActiveEditor = activeEditor;
	activeEditorState = editorState;
	isReadOnlyMode = true;
	activeEditor = editor;
	try {
		return callbackFn();
	} finally {
		activeEditorState = previousActiveEditorState;
		isReadOnlyMode = previousReadOnlyMode;
		activeEditor = previousActiveEditor;
	}
}
function $commitPendingUpdates(editor, recoveryEditorState) {
	const previouslyCommitting = isCommittingPendingUpdates;
	isCommittingPendingUpdates = true;
	try {
		const notificationResult = $notifyPendingSelectionChange(editor);
		$commitPendingUpdatesImpl(editor, recoveryEditorState);
		if (notificationResult) editor._onWarn(createError("Selection change listeners are endlessly changing the selection."));
	} finally {
		isCommittingPendingUpdates = previouslyCommitting;
	}
}
function $commitPendingUpdatesImpl(editor, recoveryEditorState) {
	const pendingEditorState = editor._pendingEditorState;
	const rootElement = editor._rootElement;
	const shouldSkipDOM = editor._headless || rootElement === null;
	if (pendingEditorState === null) {
		if (!editor._updating && editor._deferred.length > 0) triggerDeferredUpdateCallbacks(editor, editor._deferred);
		return;
	}
	const currentEditorState = editor._editorState;
	const currentSelection = currentEditorState._selection;
	const pendingSelection = pendingEditorState._selection;
	const needsUpdate = editor._dirtyType !== 0;
	const previousActiveEditorState = activeEditorState;
	const previousReadOnlyMode = isReadOnlyMode;
	const previousActiveEditor = activeEditor;
	const previouslyUpdating = editor._updating;
	const observer = editor._observer;
	let mutatedNodes = null;
	editor._pendingEditorState = null;
	editor._editorState = pendingEditorState;
	if (!shouldSkipDOM && needsUpdate && observer !== null) {
		activeEditor = editor;
		activeEditorState = pendingEditorState;
		isReadOnlyMode = false;
		editor._updating = true;
		try {
			const dirtyType = editor._dirtyType;
			const dirtyElements = editor._dirtyElements;
			const dirtyLeaves = editor._dirtyLeaves;
			observer.disconnect();
			mutatedNodes = $reconcileRoot(currentEditorState, pendingEditorState, editor, dirtyType, dirtyElements, dirtyLeaves);
		} catch (error) {
			if (error instanceof Error) editor._onError(error);
			if (!isAttemptingToRecoverFromReconcilerError) {
				resetEditor(editor, null, rootElement, pendingEditorState);
				initMutationObserver(editor);
				editor._dirtyType = 2;
				isAttemptingToRecoverFromReconcilerError = true;
				$commitPendingUpdates(editor, currentEditorState);
				isAttemptingToRecoverFromReconcilerError = false;
			} else throw error;
			return;
		} finally {
			observer.observe(rootElement, observerOptions);
			editor._updating = previouslyUpdating;
			activeEditorState = previousActiveEditorState;
			isReadOnlyMode = previousReadOnlyMode;
			activeEditor = previousActiveEditor;
		}
	}
	if (!pendingEditorState._readOnly) pendingEditorState._readOnly = true;
	const dirtyLeaves = editor._dirtyLeaves;
	const dirtyElements = editor._dirtyElements;
	const normalizedNodes = editor._normalizedNodes;
	const tags = editor._updateTags;
	if (needsUpdate) {
		editor._dirtyType = 0;
		editor._cloneNotNeeded.clear();
		editor._dirtyLeaves = /* @__PURE__ */ new Set();
		editor._dirtyElements = /* @__PURE__ */ new Map();
		editor._normalizedNodes = /* @__PURE__ */ new Set();
	}
	editor._updateTags = /* @__PURE__ */ new Set();
	const deferred = editor._deferred;
	if (!previouslyUpdating) editor._deferred = [];
	$garbageCollectDetachedDecorators(editor, pendingEditorState);
	const domSelection = shouldSkipDOM ? null : getDOMSelection(getWindow(editor));
	if (editor._editable && domSelection !== null && (needsUpdate || pendingSelection === null || pendingSelection.dirty || !pendingSelection.is(currentSelection)) && rootElement !== null && !tags.has("skip-dom-selection")) {
		activeEditor = editor;
		activeEditorState = pendingEditorState;
		try {
			if (observer !== null) observer.disconnect();
			if (needsUpdate || pendingSelection === null || pendingSelection.dirty) {
				const blockCursorElement = editor._blockCursorElement;
				if (blockCursorElement !== null) removeDOMBlockCursorElement(blockCursorElement, editor, rootElement);
				$updateDOMSelection(currentSelection, pendingSelection, editor, domSelection, tags, rootElement);
			}
			$updateDOMBlockCursorElement(editor, rootElement, pendingSelection);
		} finally {
			if (observer !== null) observer.observe(rootElement, observerOptions);
			activeEditor = previousActiveEditor;
			activeEditorState = previousActiveEditorState;
		}
	}
	if (mutatedNodes !== null) triggerMutationListeners(editor, mutatedNodes, tags, dirtyLeaves, currentEditorState);
	/**
	* Capture pendingDecorators after garbage collecting detached decorators
	*/
	const pendingDecorators = editor._pendingDecorators;
	if (pendingDecorators !== null) {
		editor._decorators = pendingDecorators;
		editor._pendingDecorators = null;
		triggerListeners("decorator", editor, true, pendingDecorators);
	}
	triggerTextContentListeners(editor, recoveryEditorState || currentEditorState, pendingEditorState);
	triggerListeners("update", editor, true, {
		dirtyElements,
		dirtyLeaves,
		editorState: pendingEditorState,
		mutatedNodes,
		normalizedNodes,
		prevEditorState: recoveryEditorState || currentEditorState,
		tags
	});
	if (!previouslyUpdating) triggerDeferredUpdateCallbacks(editor, deferred);
	$triggerEnqueuedUpdates(editor);
}
function triggerTextContentListeners(editor, currentEditorState, pendingEditorState) {
	const currentTextContent = getEditorStateTextContent(currentEditorState);
	const latestTextContent = getEditorStateTextContent(pendingEditorState);
	if (currentTextContent !== latestTextContent) triggerListeners("textcontent", editor, true, latestTextContent);
}
function triggerMutationListeners(editor, mutatedNodes, updateTags, dirtyLeaves, prevEditorState) {
	const listeners = Array.from(editor._listeners.mutation);
	const listenersLength = listeners.length;
	for (let i = 0; i < listenersLength; i++) {
		const [listener, klassSet] = listeners[i];
		for (const klass of klassSet) {
			const mutatedNodesByType = mutatedNodes.get(klass);
			if (mutatedNodesByType !== void 0) listener(mutatedNodesByType, {
				dirtyLeaves,
				prevEditorState,
				updateTags
			});
		}
	}
}
function triggerListeners(type, editor, isCurrentlyEnqueuingUpdates, ...payload) {
	const previouslyUpdating = editor._updating;
	editor._updating = isCurrentlyEnqueuingUpdates;
	try {
		const listenerMap = editor._listeners[type];
		const listeners = Array.from(listenerMap);
		for (const [listener, unregister] of listeners) {
			if (unregister) unregister();
			const result = listener(...payload);
			const nextUnregister = typeof result === "function" ? result : void 0;
			if (listenerMap.has(listener)) listenerMap.set(listener, nextUnregister);
			else if (nextUnregister) nextUnregister();
		}
	} finally {
		editor._updating = previouslyUpdating;
	}
}
function hasSelectionChanged(editor, selection) {
	const previous = editor._lastNotifiedSelection;
	return selection === null ? previous !== null : !selection.is(previous);
}
/** @internal Must run in the editor's pending update. */
function $dispatchSelectionChangeCommand(editor, selection, force = false) {
	if (!force && !hasSelectionChanged(editor, selection)) return;
	editor.dispatchCommand(SELECTION_CHANGE_COMMAND);
}
/** Returns true when listeners exceed the notification limit. */
function $notifyPendingSelectionChange(editor) {
	if (editorsWithPendingSelectionChange.has(editor)) return false;
	editorsWithPendingSelectionChange.add(editor);
	try {
		for (let count = 0; editor._pendingEditorState !== null; count++) {
			const selection = editor._pendingEditorState._selection;
			const root = editor._rootElement;
			if (!hasSelectionChanged(editor, selection)) return false;
			const skipNotification = (selection === null || $isRangeSelection(selection)) && (editor._headless || root === null || !root.isConnected);
			if (skipNotification || count === 100) {
				editor._lastNotifiedSelection = selection === null ? null : selection.clone();
				return !skipNotification;
			}
			$beginUpdate(editor, () => editor.dispatchCommand(SELECTION_CHANGE_COMMAND), void 0, true);
		}
		return false;
	} finally {
		editorsWithPendingSelectionChange.delete(editor);
	}
}
function triggerCommandListeners(editor, type, payload, fromEditor) {
	const editors = getEditorsToPropagate(editor);
	let updatingParentEditor;
	if (!isCommittingPendingUpdates) {
		for (let e = 0; e < editors.length; e++) if (!editors[e]._updating) editors[e]._cascadeCount = 0;
	}
	if (type === SELECTION_CHANGE_COMMAND) {
		if (activeEditor !== editor || isReadOnlyMode) {
			let handled = false;
			updateEditorSync(editor, () => {
				handled = triggerCommandListeners(editor, type, payload, fromEditor);
			});
			return handled;
		}
		const selection = getActiveEditorState()._selection;
		editor._lastNotifiedSelection = selection === null ? null : selection.clone();
	}
	for (let i = 4; i >= 0; i--) for (let e = 0; e < editors.length; e++) {
		const currentEditor = editors[e];
		if (e > 0 && currentEditor._updating) {
			updatingParentEditor = currentEditor;
			break;
		}
		const listenerInPriorityOrder = currentEditor._commands.get(type);
		if (listenerInPriorityOrder !== void 0) {
			const listenersSet = listenerInPriorityOrder[i];
			if (listenersSet.size > 0) {
				let returnVal = false;
				updateEditorSync(currentEditor, () => {
					for (const listener of listenersSet) if (listener(payload, fromEditor)) {
						returnVal = true;
						return;
					}
				});
				if (returnVal) return returnVal;
			}
		}
	}
	if (updatingParentEditor) updatingParentEditor.update(() => {
		triggerCommandListeners(updatingParentEditor, type, payload, fromEditor);
	});
	return false;
}
function scheduleCascadeReset(editor) {
	if (editorsWithPendingCascadeReset.has(editor)) return;
	editorsWithPendingCascadeReset.add(editor);
	setTimeout(() => {
		editorsWithPendingCascadeReset.delete(editor);
		editor._cascadeCount = 0;
	}, 0);
}
function $triggerEnqueuedUpdates(editor) {
	const queuedUpdates = editor._updates;
	if (queuedUpdates.length === 0) {
		editor._cascadeCount = 0;
		return;
	}
	scheduleCascadeReset(editor);
	if (editor._cascadeCount++ > 99) {
		editor._updates = [];
		editor._cascadeCount = 0;
		editor._onWarn(createError("One or more update listeners are endlessly enqueueing more updates. May have encountered infinite recursion caused by update listeners that trigger additional updates without a stop condition. Editor namespace: %s", editor._config.namespace));
		return;
	}
	const queuedUpdate = queuedUpdates.shift();
	if (queuedUpdate) {
		const [updateFn, options] = queuedUpdate;
		$beginUpdate(editor, updateFn, options);
	}
}
function triggerDeferredUpdateCallbacks(editor, deferred) {
	if (editor._deferred === deferred) editor._deferred = [];
	if (deferred.length !== 0) {
		const previouslyUpdating = editor._updating;
		editor._updating = true;
		try {
			for (let i = 0; i < deferred.length; i++) deferred[i]();
		} finally {
			editor._updating = previouslyUpdating;
		}
	}
}
function $processNestedUpdates(editor, initialSkipTransforms) {
	const queuedUpdates = editor._updates;
	let skipTransforms = initialSkipTransforms || false;
	while (queuedUpdates.length !== 0) {
		const queuedUpdate = queuedUpdates.shift();
		if (queuedUpdate) {
			const [nextUpdateFn, options] = queuedUpdate;
			const pendingEditorState = editor._pendingEditorState;
			let onUpdate;
			if (options !== void 0) {
				onUpdate = options.onUpdate;
				if (options.skipTransforms) skipTransforms = true;
				if (options.discrete) {
					invariant(pendingEditorState !== null, "Unexpected empty pending editor state on discrete nested update");
					pendingEditorState._flushSync = true;
				}
				if (onUpdate) editor._deferred.push(onUpdate);
				addTags(editor, options.tag);
			}
			if (pendingEditorState == null) $beginUpdate(editor, nextUpdateFn, options);
			else nextUpdateFn();
		}
	}
	return skipTransforms;
}
/**
* Equivalent to setting `{discrete: true}` on the containing `editor.update`,
* generally used to ensure that the DOM is updated before returning from
* an event listener where the browser is expected to natively finish handling
* the event.
*/
function $flushSyncAfterUpdate() {
	const editorState = getActiveEditorState();
	errorOnReadOnly();
	editorState._flushSync = true;
}
function $beginUpdate(editor, updateFn, options, skipCommit = false) {
	const updateTags = editor._updateTags;
	let onUpdate;
	let skipTransforms = false;
	let discrete = false;
	if (options !== void 0) {
		onUpdate = options.onUpdate;
		addTags(editor, options.tag);
		skipTransforms = options.skipTransforms || false;
		discrete = options.discrete || false;
	}
	if (onUpdate) editor._deferred.push(onUpdate);
	const currentEditorState = editor._editorState;
	let pendingEditorState = editor._pendingEditorState;
	let editorStateWasCloned = false;
	if (pendingEditorState === null || pendingEditorState._readOnly) {
		pendingEditorState = editor._pendingEditorState = cloneEditorState(pendingEditorState || currentEditorState);
		editorStateWasCloned = true;
	}
	pendingEditorState._flushSync = discrete;
	const previousActiveEditorState = activeEditorState;
	const previousReadOnlyMode = isReadOnlyMode;
	const previousActiveEditor = activeEditor;
	const previouslyUpdating = editor._updating;
	activeEditorState = pendingEditorState;
	isReadOnlyMode = false;
	editor._updating = true;
	activeEditor = editor;
	const headless = editor._headless || editor.getRootElement() === null;
	setPendingNodeToClone(null);
	try {
		if (editorStateWasCloned) {
			if (headless) {
				if (currentEditorState._selection !== null) pendingEditorState._selection = currentEditorState._selection.clone();
			} else pendingEditorState._selection = $internalCreateSelection(editor, options && options.event || null);
		}
		const startingCompositionKey = editor._compositionKey;
		updateFn();
		skipTransforms = $processNestedUpdates(editor, skipTransforms);
		applySelectionTransforms(pendingEditorState, editor);
		if (editor._dirtyType !== 0) {
			if (skipTransforms) $normalizeAllDirtyTextNodes(pendingEditorState, editor);
			else $applyAllTransforms(pendingEditorState, editor);
			$processNestedUpdates(editor);
			$garbageCollectDetachedNodes(currentEditorState, pendingEditorState, editor._dirtyLeaves, editor._dirtyElements);
		}
		if (startingCompositionKey !== editor._compositionKey) pendingEditorState._flushSync = true;
		const pendingSelection = pendingEditorState._selection;
		if ($isRangeSelection(pendingSelection)) {
			if (editor._slotsUsed) $clampRangeSelectionToSlotFrame(pendingSelection);
			const pendingNodeMap = pendingEditorState._nodeMap;
			const anchorKey = pendingSelection.anchor.key;
			const focusKey = pendingSelection.focus.key;
			if (pendingNodeMap.get(anchorKey) === void 0 || pendingNodeMap.get(focusKey) === void 0) invariant(false, "updateEditor: selection has been lost because the previously selected nodes have been removed and selection wasn't moved to another node. Ensure selection changes after removing/replacing a selected node.");
		} else if ($isNodeSelection(pendingSelection)) {
			if (pendingSelection._nodes.size === 0) pendingEditorState._selection = null;
		}
	} catch (error) {
		if (error instanceof Error) editor._onError(error);
		editor._pendingEditorState = currentEditorState;
		const selection = currentEditorState._selection;
		editor._lastNotifiedSelection = selection === null ? null : selection.clone();
		editor._dirtyType = 2;
		editor._cloneNotNeeded.clear();
		editor._dirtyLeaves = /* @__PURE__ */ new Set();
		editor._dirtyElements.clear();
		$commitPendingUpdates(editor);
		return;
	} finally {
		activeEditorState = previousActiveEditorState;
		isReadOnlyMode = previousReadOnlyMode;
		activeEditor = previousActiveEditor;
		editor._updating = previouslyUpdating;
		infiniteTransformCount = 0;
	}
	if (skipCommit) return;
	if (editor._dirtyType !== 0 || editor._deferred.length > 0 || editorStateHasDirtySelection(pendingEditorState, editor)) {
		if (pendingEditorState._flushSync) {
			pendingEditorState._flushSync = false;
			$commitPendingUpdates(editor);
		} else if (editorStateWasCloned) scheduleMicroTask(() => {
			$commitPendingUpdates(editor);
		});
	} else {
		pendingEditorState._flushSync = false;
		if (editorStateWasCloned) {
			updateTags.clear();
			editor._deferred = [];
			editor._pendingEditorState = null;
		}
	}
}
/**
* A variant of updateEditor that will not defer if it is nested in an update
* to the same editor, much like if it was an editor.dispatchCommand issued
* within an update
*/
function updateEditorSync(editor, updateFn, options) {
	if (activeEditor === editor && options === void 0) {
		if (isCurrentlyReadOnlyMode()) $beginUpdate(editor, updateFn, options);
		else updateFn();
	} else $beginUpdate(editor, updateFn, options);
}
function updateEditor(editor, updateFn, options) {
	if (editor._updating) editor._updates.push([updateFn, options]);
	else $beginUpdate(editor, updateFn, options);
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/nodes/LexicalElementNode.ts
/**
* The serialized `format` and the flag it is stored as, in both directions.
*
* `''` is the absence of an alignment, stored as 0, and neither constant
* carries that pair: `getFormatType` spells it as `|| ''` and `setFormat` as
* `type !== '' ? … : 0`. A lookup table has no fallback to spell it with, so
* it is an entry here — and having it as an entry is what lets the schema
* reach the field instead of the accessors.
*
* One function per table, each assigned to a plain `const`: a destructuring
* pattern is not something a bundler will drop, however pure the call feeding
* it is, so the pair came back in every bundle that imported this module.
*
* @__NO_SIDE_EFFECTS__
*/
function formatGetterTable() {
	return {
		...ELEMENT_FORMAT_TO_TYPE,
		0: ""
	};
}
/** @__NO_SIDE_EFFECTS__ */
function formatSetterTable() {
	return {
		...ELEMENT_TYPE_TO_FORMAT,
		"": 0
	};
}
var FORMAT_GETTER_TABLE = formatGetterTable();
var FORMAT_SETTER_TABLE = formatSetterTable();
var elementNodeSchema = nodeSchema()({
	direction: withField(enumValue([
		null,
		"ltr",
		"rtl"
	]), { field: "__dir" }),
	format: withField(enumValue([
		"",
		"left",
		"start",
		"center",
		"right",
		"end",
		"justify"
	]), {
		field: "__format",
		getter: "getFormatType",
		getterTable: FORMAT_GETTER_TABLE,
		setter: "setFormat",
		setterTable: FORMAT_SETTER_TABLE
	}),
	indent: withField(numberValue(0, {
		integer: true,
		min: 0
	}), { field: "__indent" }),
	textFormat: withAccessors(numberValue(), {
		getter: {
			field: "__textFormat",
			method: "getSerializedTextFormat",
			when: "shouldSerializeTextStyles"
		},
		setter: { field: "__textFormat" }
	}),
	textStyle: withAccessors(stringValue(), {
		getter: {
			field: "__textStyle",
			method: "getSerializedTextStyle",
			when: "shouldSerializeTextStyles"
		},
		setter: { field: "__textStyle" }
	})
});
/**
* Wrap any shadow-root child of `node` that is neither an ElementNode nor a
* DecoratorNode in a paragraph, so the slot-frame invariant set by
* `getTopLevelElement` continues to hold for external inputs (URL doc
* payloads, imported JSON, paste round-trips) that may carry shapes the
* in-editor mutation paths can no longer produce.
*
* Single-node helper: runs as the `$config` `$transform` on ElementNode so
* the existing dirty-node transform cycle drives the normalization. The
* in-editor mutation paths (insertText, insertNodes, append/splice via the
* public API) still fail-fast on the invariant.
*
* @internal
*/
function $normalizeShadowRootChildren(node) {
	if ($isRootOrShadowRoot(node)) {
		let block = null;
		for (const child of node.getChildren()) block = child.isInline() ? (block || child.replace(child.createParentElementNode())).append(child) : null;
	}
}
/** @noInheritDoc */
var ElementNode = class extends LexicalNode {
	/** @internal */
	__first;
	/** @internal */
	__last;
	/** @internal */
	__size;
	/** @internal */
	__format;
	/** @internal */
	__style;
	/** @internal */
	__indent;
	/** @internal */
	__dir;
	/** @internal */
	__textFormat;
	/** @internal */
	__textStyle;
	/** @internal */
	__slotHost;
	/** @internal */
	__slots;
	$config() {
		return this.config(Symbol.for("ElementNode"), {
			$transform: $normalizeShadowRootChildren,
			extends: LexicalNode,
			generated: GENERATED_ELEMENT,
			json: elementNodeSchema
		});
	}
	constructor(key) {
		super(key);
		this.__first = null;
		this.__last = null;
		this.__size = 0;
		this.__format = 0;
		this.__style = "";
		this.__indent = 0;
		this.__dir = null;
		this.__textFormat = 0;
		this.__textStyle = "";
		this.__slotHost = null;
		this.__slots = null;
	}
	afterCloneFrom(prevNode) {
		super.afterCloneFrom(prevNode);
		if (this.__key === prevNode.__key) {
			this.__first = prevNode.__first;
			this.__last = prevNode.__last;
			this.__size = prevNode.__size;
			this.__slotHost = prevNode.__slotHost;
			invariant(this.__slotHost === null || this.__parent === null, "ElementNode: node %s is both slotted into host %s and a child of parent %s; __slotHost and __parent are mutually exclusive", this.__key, String(this.__slotHost), String(this.__parent));
			this.__slots = prevNode.__slots;
		}
		this.__style = prevNode.__style;
		afterCloneElementNode(this, prevNode);
	}
	getFormat() {
		return this.getLatest().__format;
	}
	getFormatType() {
		return ELEMENT_FORMAT_TO_TYPE[this.getFormat()] || "";
	}
	getStyle() {
		return this.getLatest().__style;
	}
	getIndent() {
		return this.getLatest().__indent;
	}
	getChildren() {
		const children = [];
		let child = this.getFirstChild();
		while (child !== null) {
			children.push(child);
			child = child.getNextSibling();
		}
		return children;
	}
	getChildrenKeys() {
		const children = [];
		let child = this.getFirstChild();
		while (child !== null) {
			children.push(child.__key);
			child = child.getNextSibling();
		}
		return children;
	}
	getChildrenSize() {
		return this.getLatest().__size;
	}
	isEmpty() {
		return this.getChildrenSize() === 0 && $getSlotNames(this).length === 0;
	}
	isDirty() {
		const dirtyElements = getActiveEditor()._dirtyElements;
		return dirtyElements !== null && dirtyElements.has(this.__key);
	}
	isLastChild() {
		const self = this.getLatest();
		const parentLastChild = this.getParentOrThrow().getLastChild();
		return parentLastChild !== null && parentLastChild.is(self);
	}
	getAllTextNodes() {
		const textNodes = [];
		for (const name of $getSlotNames(this)) {
			const slot = $getSlot(this, name);
			if ($isElementNode(slot)) for (const textNode of slot.getAllTextNodes()) textNodes.push(textNode);
		}
		let child = this.getFirstChild();
		while (child !== null) {
			if ($isTextNode(child)) textNodes.push(child);
			if ($isElementNode(child)) for (const textNode of child.getAllTextNodes()) textNodes.push(textNode);
			child = child.getNextSibling();
		}
		return textNodes;
	}
	getFirstDescendant() {
		let node = this.getFirstChild();
		while ($isElementNode(node)) {
			const child = node.getFirstChild();
			if (child === null) break;
			node = child;
		}
		return node;
	}
	getLastDescendant() {
		let node = this.getLastChild();
		while ($isElementNode(node)) {
			const child = node.getLastChild();
			if (child === null) break;
			node = child;
		}
		return node;
	}
	getDescendantByIndex(index) {
		const children = this.getChildren();
		const childrenLength = children.length;
		if (index >= childrenLength) {
			const resolvedNode = children[childrenLength - 1];
			return $isElementNode(resolvedNode) && resolvedNode.getLastDescendant() || resolvedNode || null;
		}
		const resolvedNode = children[index];
		return $isElementNode(resolvedNode) && resolvedNode.getFirstDescendant() || resolvedNode || null;
	}
	getFirstChild() {
		const firstKey = this.getLatest().__first;
		return firstKey === null ? null : $getNodeByKey(firstKey);
	}
	getFirstChildOrThrow() {
		const firstChild = this.getFirstChild();
		if (firstChild === null) invariant(false, "Expected node %s to have a first child.", this.__key);
		return firstChild;
	}
	getLastChild() {
		const lastKey = this.getLatest().__last;
		return lastKey === null ? null : $getNodeByKey(lastKey);
	}
	getLastChildOrThrow() {
		const lastChild = this.getLastChild();
		if (lastChild === null) invariant(false, "Expected node %s to have a last child.", this.__key);
		return lastChild;
	}
	getChildAtIndex(index) {
		const size = this.getChildrenSize();
		let node;
		let i;
		if (index < size / 2) {
			node = this.getFirstChild();
			i = 0;
			while (node !== null && i <= index) {
				if (i === index) return node;
				node = node.getNextSibling();
				i++;
			}
			return null;
		}
		node = this.getLastChild();
		i = size - 1;
		while (node !== null && i >= index) {
			if (i === index) return node;
			node = node.getPreviousSibling();
			i--;
		}
		return null;
	}
	getTextContent() {
		let textContent = $getSlotsTextContent(this);
		const children = this.getChildren();
		const childrenLength = children.length;
		for (let i = 0; i < childrenLength; i++) {
			const child = children[i];
			textContent += child.getTextContent();
			if ($isElementNode(child) && i !== childrenLength - 1 && !child.isInline()) textContent += "\n\n";
		}
		return textContent;
	}
	getTextContentSize() {
		let textContentSize = $getSlotsTextContentSize(this);
		const children = this.getChildren();
		const childrenLength = children.length;
		for (let i = 0; i < childrenLength; i++) {
			const child = children[i];
			textContentSize += child.getTextContentSize();
			if ($isElementNode(child) && i !== childrenLength - 1 && !child.isInline()) textContentSize += 2;
		}
		return textContentSize;
	}
	getDirection() {
		return this.getLatest().__dir;
	}
	getTextFormat() {
		return this.getLatest().__textFormat;
	}
	hasFormat(type) {
		if (type !== "") {
			const formatFlag = ELEMENT_TYPE_TO_FORMAT[type];
			return (this.getFormat() & formatFlag) !== 0;
		}
		return false;
	}
	hasTextFormat(type) {
		const formatFlag = TEXT_TYPE_TO_FORMAT[type];
		return (this.getTextFormat() & formatFlag) !== 0;
	}
	/**
	* Returns the format flags applied to the node as a 32-bit integer.
	*
	* @returns a number representing the TextFormatTypes applied to the node.
	*/
	getFormatFlags(type, alignWithFormat) {
		const format = this.getLatest().__textFormat;
		return toggleTextFormatType(format, type, alignWithFormat);
	}
	getTextStyle() {
		return this.getLatest().__textStyle;
	}
	select(_anchorOffset, _focusOffset) {
		errorOnReadOnly();
		const selection = $getSelection();
		let anchorOffset = _anchorOffset;
		let focusOffset = _focusOffset;
		const childrenCount = this.getChildrenSize();
		if (!this.canBeEmpty()) {
			if (_anchorOffset === 0 && _focusOffset === 0) {
				const firstChild = this.getFirstChild();
				if ($isTextNode(firstChild) || $isElementNode(firstChild)) return firstChild.select(0, 0);
			} else if ((_anchorOffset === void 0 || _anchorOffset === childrenCount) && (_focusOffset === void 0 || _focusOffset === childrenCount)) {
				const lastChild = this.getLastChild();
				if ($isTextNode(lastChild) || $isElementNode(lastChild)) return lastChild.select();
			}
		}
		if (anchorOffset === void 0) anchorOffset = childrenCount;
		if (focusOffset === void 0) focusOffset = childrenCount;
		const key = this.__key;
		if (!$isRangeSelection(selection)) return $internalMakeRangeSelection(key, anchorOffset, key, focusOffset, "element", "element");
		else {
			selection.anchor.set(key, anchorOffset, "element");
			selection.focus.set(key, focusOffset, "element");
			selection.dirty = true;
		}
		return selection;
	}
	selectStart() {
		const firstNode = this.getFirstDescendant();
		return firstNode ? firstNode.selectStart() : this.select();
	}
	selectEnd() {
		const lastNode = this.getLastDescendant();
		return lastNode ? lastNode.selectEnd() : this.select();
	}
	clear() {
		const writableSelf = this.getWritable();
		this.getChildren().forEach((child) => child.remove());
		return writableSelf;
	}
	append(...nodesToAppend) {
		return this.splice(this.getChildrenSize(), 0, nodesToAppend);
	}
	setDirection(direction) {
		const self = this.getWritable();
		self.__dir = direction;
		return self;
	}
	setFormat(type) {
		const self = this.getWritable();
		self.__format = type !== "" ? ELEMENT_TYPE_TO_FORMAT[type] || 0 : 0;
		return self;
	}
	setStyle(style) {
		const self = this.getWritable();
		self.__style = style || "";
		return self;
	}
	setTextFormat(type) {
		const self = this.getWritable();
		self.__textFormat = type;
		return self;
	}
	setTextStyle(style) {
		const self = this.getWritable();
		self.__textStyle = style;
		return self;
	}
	setIndent(indentLevel) {
		const self = this.getWritable();
		self.__indent = indentLevel;
		return self;
	}
	splice(start, deleteCount, nodesToInsert) {
		invariant(!$isEphemeral(this), "ElementNode.splice: Ephemeral nodes can not mutate their children (key %s type %s)", this.__key, this.__type);
		const oldSize = this.getChildrenSize();
		const writableSelf = this.getWritable();
		invariant(start + deleteCount <= oldSize, "ElementNode.splice: start + deleteCount > oldSize (%s + %s > %s)", String(start), String(deleteCount), String(oldSize));
		for (const nodeToInsert of nodesToInsert);
		const writableSelfKey = writableSelf.__key;
		const nodesToInsertKeys = [];
		const nodesToRemoveKeys = [];
		let nodeAfterRange = this.getChildAtIndex(start + deleteCount);
		let nodeBeforeRange = null;
		let newSize = oldSize - deleteCount + nodesToInsert.length;
		if (start !== 0) {
			if (start === oldSize) nodeBeforeRange = this.getLastChild();
			else {
				const node = this.getChildAtIndex(start);
				if (node !== null) nodeBeforeRange = node.getPreviousSibling();
			}
		}
		if (deleteCount > 0) {
			let nodeToDelete = nodeBeforeRange === null ? this.getFirstChild() : nodeBeforeRange.getNextSibling();
			for (let i = 0; i < deleteCount; i++) {
				if (nodeToDelete === null) invariant(false, "splice: sibling not found");
				const nextSibling = nodeToDelete.getNextSibling();
				const nodeKeyToDelete = nodeToDelete.__key;
				$removeFromParent(nodeToDelete.getWritable());
				nodesToRemoveKeys.push(nodeKeyToDelete);
				nodeToDelete = nextSibling;
			}
		}
		let prevNode = nodeBeforeRange;
		for (const nodeToInsert of nodesToInsert) {
			if (prevNode !== null && nodeToInsert.is(prevNode)) nodeBeforeRange = prevNode = prevNode.getPreviousSibling();
			if (nodeAfterRange !== null && nodeToInsert.is(nodeAfterRange)) nodeAfterRange = nodeAfterRange.getNextSibling();
			const writableNodeToInsert = nodeToInsert.getWritable();
			if (writableNodeToInsert.__parent === writableSelfKey) newSize--;
			$removeFromParent(writableNodeToInsert);
			const nodeKeyToInsert = nodeToInsert.__key;
			if (prevNode === null) {
				writableSelf.__first = nodeKeyToInsert;
				writableNodeToInsert.__prev = null;
			} else {
				const writablePrevNode = prevNode.getWritable();
				writablePrevNode.__next = nodeKeyToInsert;
				writableNodeToInsert.__prev = writablePrevNode.__key;
			}
			if (nodeToInsert.__key === writableSelfKey) invariant(false, "append: attempting to append self");
			writableNodeToInsert.__parent = writableSelfKey;
			nodesToInsertKeys.push(nodeKeyToInsert);
			prevNode = nodeToInsert;
		}
		if (nodeAfterRange === null) {
			if (prevNode !== null) {
				const writablePrevNode = prevNode.getWritable();
				writablePrevNode.__next = null;
				writableSelf.__last = prevNode.__key;
			}
		} else {
			const writableNodeAfterRange = nodeAfterRange.getWritable();
			if (prevNode !== null) {
				const writablePrevNode = prevNode.getWritable();
				writableNodeAfterRange.__prev = prevNode.__key;
				writablePrevNode.__next = nodeAfterRange.__key;
			} else writableNodeAfterRange.__prev = null;
		}
		writableSelf.__size = newSize;
		if (nodesToRemoveKeys.length) {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				const nodesToRemoveKeySet = new Set(nodesToRemoveKeys);
				const nodesToInsertKeySet = new Set(nodesToInsertKeys);
				const { anchor, focus } = selection;
				if (isPointRemoved(anchor, nodesToRemoveKeySet, nodesToInsertKeySet)) moveSelectionPointToSibling(anchor, anchor.getNode(), this, nodeBeforeRange, nodeAfterRange);
				if (isPointRemoved(focus, nodesToRemoveKeySet, nodesToInsertKeySet)) moveSelectionPointToSibling(focus, focus.getNode(), this, nodeBeforeRange, nodeAfterRange);
				if (newSize === 0 && !this.canBeEmpty() && !$isRootOrShadowRoot(this)) this.remove();
			}
		}
		return writableSelf;
	}
	/**
	* @experimental
	*
	* An ElementNode subclass can override this to control where its children
	* are inserted into the DOM, e.g. to add a wrapping node or accessory nodes
	* before or after the children. The root of the node returned by createDOM
	* must still be exactly one HTMLElement.
	*/
	getDOMSlot(element) {
		return new ElementDOMSlot(element);
	}
	exportDOM(editor) {
		const { element } = super.exportDOM(editor);
		if (isHTMLElement(element)) {
			const indent = this.getIndent();
			if (indent > 0) {
				element.style.paddingInlineStart = `${indent * 40}px`;
				element.setAttribute("data-lexical-indent", String(indent));
			}
			const direction = this.getDirection();
			if (direction) element.dir = direction;
		}
		return { element };
	}
	/**
	* Whether `textFormat`/`textStyle` are persisted at all: only when there are
	* no TextNode children from which they would be set on reconcile (#7968).
	*
	* @internal
	*/
	shouldSerializeTextStyles() {
		if ($isRootOrShadowRoot(this)) return false;
		for (let child = this.getFirstChild(); child !== null; child = child.getNextSibling()) if ($isTextNode(child)) return false;
		return true;
	}
	/** @internal Serialized `textFormat`, or undefined to omit it. */
	getSerializedTextFormat() {
		const textFormat = this.getTextFormat();
		return textFormat !== 0 && this.shouldSerializeTextStyles() ? textFormat : void 0;
	}
	/** @internal Serialized `textStyle`, or undefined to omit it. */
	getSerializedTextStyle() {
		const textStyle = this.getTextStyle();
		return textStyle !== "" && this.shouldSerializeTextStyles() ? textStyle : void 0;
	}
	insertNewAfter(selection, restoreSelection) {
		return null;
	}
	canIndent() {
		return true;
	}
	collapseAtStart(selection) {
		return false;
	}
	excludeFromCopy(destination) {
		return false;
	}
	/** @deprecated @internal */
	canReplaceWith(replacement) {
		return true;
	}
	/** @deprecated @internal */
	canInsertAfter(node) {
		return true;
	}
	canBeEmpty() {
		return true;
	}
	canInsertTextBefore() {
		return true;
	}
	canInsertTextAfter() {
		return true;
	}
	/**
	* If the method is overridden and returns true, ensure that `canBeEmpty()`
	* returns false for the inline node to work correctly
	*/
	isInline() {
		return false;
	}
	isShadowRoot() {
		return false;
	}
	/** @deprecated @internal */
	canMergeWith(node) {
		return false;
	}
	extractWithChild(child, selection, destination) {
		return false;
	}
	/**
	* Determines whether this node, when empty, can merge with a first block
	* of nodes being inserted.
	*
	* This method is specifically called in {@link RangeSelection.insertNodes}
	* to determine merging behavior during nodes insertion.
	*
	* @example
	* // In a ListItemNode or QuoteNode implementation:
	* canMergeWhenEmpty(): true {
	*  return true;
	* }
	*/
	canMergeWhenEmpty() {
		return false;
	}
	/** @internal */
	reconcileObservedMutation(dom, editor) {
		const slot = $getDOMSlot(this, dom, editor);
		let currentDOM = slot.getFirstChild();
		for (let currentNode = this.getFirstChild(); currentNode; currentNode = currentNode.getNextSibling()) {
			const correctDOM = editor.getElementByKey(currentNode.getKey());
			if (correctDOM === null) continue;
			if (currentDOM == null) {
				slot.insertChild(correctDOM);
				currentDOM = correctDOM;
			} else if (currentDOM !== correctDOM) slot.replaceChild(correctDOM, currentDOM);
			currentDOM = currentDOM.nextSibling;
		}
	}
};
/** Returns true if the given node is an ElementNode. */
function $isElementNode(node) {
	return node instanceof ElementNode;
}
function isPointRemoved(point, nodesToRemoveKeySet, nodesToInsertKeySet) {
	let node = point.getNode();
	while (node) {
		const nodeKey = node.__key;
		if (nodesToRemoveKeySet.has(nodeKey) && !nodesToInsertKeySet.has(nodeKey)) return true;
		node = node.getParent();
	}
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/nodes/LexicalDecoratorNode.ts
/** @noInheritDoc */
var DecoratorNode = class extends LexicalNode {
	/** @internal */
	__slotHost;
	/** @internal */
	__slots;
	constructor(key) {
		super(key);
		this.__slotHost = null;
		this.__slots = null;
	}
	afterCloneFrom(prevNode) {
		super.afterCloneFrom(prevNode);
		if (this.__key === prevNode.__key) {
			this.__slotHost = prevNode.__slotHost;
			invariant(this.__slotHost === null || this.__parent === null, "DecoratorNode: node %s is both slotted into host %s and a child of parent %s; __slotHost and __parent are mutually exclusive", this.__key, String(this.__slotHost), String(this.__parent));
			this.__slots = prevNode.__slots;
		}
	}
	/**
	* The returned value is added to the LexicalEditor._decorators
	*/
	decorate(editor, config) {
		return null;
	}
	/**
	* Whether this decorator is isolated from caret interaction: an isolated
	* decorator can not be traversed, extended over, selected as a node, or
	* deleted by an adjacent caret operation. A caret that reaches one stops
	* there, so an inline isolated decorator is only reachable by pointer.
	*
	* Defaults to false, which lets the caret step over the decorator (and
	* select it, when {@link DecoratorNode.isKeyboardSelectable} is also true).
	*/
	isIsolated() {
		return false;
	}
	isInline() {
		return true;
	}
	isKeyboardSelectable() {
		return true;
	}
};
/** Returns true if the given node is a DecoratorNode. */
function $isDecoratorNode(node) {
	return node instanceof DecoratorNode;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/nodes/LexicalRootNode.ts
/** @noInheritDoc */
var RootNode = class extends ElementNode {
	/** @internal */
	__cachedText;
	$config() {
		return this.config("root", { extends: ElementNode });
	}
	constructor() {
		super("root");
		this.__cachedText = null;
	}
	getTopLevelElementOrThrow() {
		invariant(false, "getTopLevelElementOrThrow: root nodes are not top level elements");
	}
	getTextContent() {
		const cachedText = this.__cachedText;
		return cachedText !== null && (isCurrentlyReadOnlyMode() || getActiveEditor()._dirtyType === 0) ? cachedText : super.getTextContent();
	}
	remove() {
		invariant(false, "remove: cannot be called on root nodes");
	}
	replace(node) {
		invariant(false, "replace: cannot be called on root nodes");
	}
	insertBefore(nodeToInsert) {
		invariant(false, "insertBefore: cannot be called on root nodes");
	}
	insertAfter(nodeToInsert) {
		invariant(false, "insertAfter: cannot be called on root nodes");
	}
	updateDOM(prevNode, dom) {
		return false;
	}
	splice(start, deleteCount, nodesToInsert) {
		for (const node of nodesToInsert) invariant($isElementNode(node) || $isDecoratorNode(node), "rootNode.splice: Only element or decorator nodes can be inserted to the root node");
		return super.splice(start, deleteCount, nodesToInsert);
	}
	static importJSON(serializedNode) {
		return $getRoot().updateFromJSON(serializedNode);
	}
	collapseAtStart() {
		return true;
	}
};
function $createRootNode() {
	return new RootNode();
}
/** Returns true if the given node is a RootNode. */
function $isRootNode(node) {
	return node instanceof RootNode;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalEditorState.ts
function editorStateHasDirtySelection(editorState, editor) {
	const currentSelection = editor.getEditorState()._selection;
	const pendingSelection = editorState._selection;
	if (pendingSelection !== null) {
		if (pendingSelection.dirty || !pendingSelection.is(currentSelection)) return true;
	} else if (currentSelection !== null) return true;
	return false;
}
function cloneEditorState(current) {
	return new EditorState(cloneMap(current._nodeMap), null, current._slotsUsed);
}
function createEmptyEditorState() {
	return new EditorState(/* @__PURE__ */ new Map([["root", $createRootNode()]]), null, false);
}
function $exportNodeToJSON(node) {
	const nodeClass = node.constructor;
	const serializedNode = $exportNodeJSON(node);
	if ($isElementNode(node)) {
		const serializedChildren = serializedNode.children;
		const children = node.getChildren();
		for (let i = 0; i < children.length; i++) serializedChildren.push($exportNodeToJSON(children[i]));
	}
	const slotNames = $getSlotNames(node);
	if (slotNames.length > 0) {
		const serializedSlots = {};
		for (const name of slotNames) {
			const slotNode = $getSlot(node, name);
			invariant(slotNode !== null, "LexicalNode: Node %s has slot \"%s\" but it resolved to no node during export.", nodeClass.name, name);
			serializedSlots[name] = $exportNodeToJSON(slotNode);
		}
		serializedNode.$slots = serializedSlots;
	}
	return serializedNode;
}
/**
* Type guard that returns true if the argument is an EditorState
*/
function $isEditorState(x) {
	return x instanceof EditorState;
}
var EditorState = class EditorState {
	_nodeMap;
	_selection;
	_flushSync;
	_readOnly;
	/**
	* True if this EditorState was parsed without running transforms
	*/
	_parsed;
	/**
	* True if this EditorState or the LexicalEditor that created it has
	* ever used slots
	*/
	_slotsUsed;
	constructor(nodeMap, selection = null, slotsUsed = false) {
		this._nodeMap = nodeMap;
		this._selection = selection || null;
		this._flushSync = false;
		this._readOnly = false;
		this._parsed = false;
		this._slotsUsed = slotsUsed;
	}
	isEmpty() {
		return this._nodeMap.size <= 1 && this._selection === null;
	}
	read(callbackFn, options) {
		return readEditorState(options && options.editor || null, this, callbackFn);
	}
	clone(selection) {
		const editorState = new EditorState(this._nodeMap, selection === void 0 ? this._selection : selection, this._slotsUsed);
		editorState._readOnly = true;
		editorState._parsed = this._parsed;
		return editorState;
	}
	toJSON(compact) {
		return $withCompactExport(typeof compact === "boolean" && compact, () => readEditorState(null, this, () => ({ root: $exportNodeToJSON($getRoot()) })));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/nodes/ArtificialNode.ts
/** @internal */
var ArtificialNode__DO_NOT_USE = class extends ElementNode {
	$config() {
		return this.config("artificial", { extends: ElementNode });
	}
	createDOM(config) {
		return $getDocument().createElement("div");
	}
};
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/nodes/LexicalLineBreakNode.ts
/** @noInheritDoc */
var LineBreakNode = class extends LexicalNode {
	$config() {
		return this.config("linebreak", {
			extends: LexicalNode,
			generated: GENERATED_LINEBREAK,
			importDOM: { br: (node) => {
				if (isOnlyChildInBlockNode(node) || isLastChildInBlockNode(node)) return null;
				return {
					conversion: $convertLineBreakElement,
					priority: 0
				};
			} }
		});
	}
	getTextContent() {
		return "\n";
	}
	createDOM() {
		return $getDocument().createElement("br");
	}
	updateDOM() {
		return false;
	}
	isInline() {
		return true;
	}
};
function $convertLineBreakElement(node) {
	return { node: $createLineBreakNode() };
}
/** Creates a LineBreakNode representing a soft line break (Shift+Enter). */
function $createLineBreakNode() {
	return $applyNodeReplacement(new LineBreakNode());
}
/** Returns true if the given node is a LineBreakNode. */
function $isLineBreakNode(node) {
	return node instanceof LineBreakNode;
}
/**
* True when `node` is the sole non-whitespace child of a block DOM
* element. Used by the LineBreak importer to drop stray `<br>` elements
* that the legacy `$generateNodesFromDOM` also skipped (matches the
* behavior of `LineBreakNode.importDOM`).
*
* @experimental
*/
function isOnlyChildInBlockNode(node) {
	const parentElement = node.parentElement;
	if (parentElement !== null && isBlockDomNode(parentElement)) {
		const firstChild = parentElement.firstChild;
		if (firstChild === node || firstChild.nextSibling === node && isWhitespaceDomTextNode(firstChild)) {
			const lastChild = parentElement.lastChild;
			if (lastChild === node || lastChild.previousSibling === node && isWhitespaceDomTextNode(lastChild)) return true;
		}
	}
	return false;
}
/**
* True when `node` is the trailing non-whitespace child of a block DOM
* element (excluding the only-child case). Used by the LineBreak
* importer to drop trailing `<br>` elements like the Apple-interchange
* clipboard artifact (matches `LineBreakNode.importDOM`).
*
* @experimental
*/
function isLastChildInBlockNode(node) {
	const parentElement = node.parentElement;
	if (parentElement !== null && isBlockDomNode(parentElement)) {
		const firstChild = parentElement.firstChild;
		if (firstChild === node || firstChild.nextSibling === node && isWhitespaceDomTextNode(firstChild)) return false;
		const lastChild = parentElement.lastChild;
		if (lastChild === node || lastChild.previousSibling === node && isWhitespaceDomTextNode(lastChild)) return true;
	}
	return false;
}
function isWhitespaceDomTextNode(node) {
	return isDOMTextNode(node) && /^( |\t|\r?\n)+$/.test(node.textContent || "");
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/caret/LexicalCaretUtils.ts
/**
* @param point
* @returns a PointCaret for the point
*/
function $caretFromPoint(point, direction) {
	const { type, key, offset } = point;
	const node = $getNodeByKeyOrThrow(point.key);
	if (type === "text") {
		invariant($isTextNode(node), "$caretFromPoint: Node with type %s and key %s that does not inherit from TextNode encountered for text point", node.getType(), key);
		return $getTextPointCaret(node, direction, offset);
	}
	invariant($isElementNode(node), "$caretFromPoint: Node with type %s and key %s that does not inherit from ElementNode encountered for element point", node.getType(), key);
	return $getChildCaretAtIndex(node, point.offset, direction);
}
/**
* Update the given point in-place from the PointCaret
*
* @param point the point to set
* @param caret the caret to set the point from
*/
function $setPointFromCaret(point, caret) {
	const { origin, direction } = caret;
	const isNext = direction === "next";
	if ($isTextPointCaret(caret)) point.set(origin.getKey(), caret.offset, "text");
	else if ($isSiblingCaret(caret)) {
		if ($isTextNode(origin)) point.set(origin.getKey(), $getTextNodeOffset(origin, direction), "text");
		else point.set(origin.getParentOrThrow().getKey(), origin.getIndexWithinParent() + (isNext ? 1 : 0), "element");
	} else {
		invariant($isChildCaret(caret) && $isElementNode(origin), "$setPointFromCaret: exhaustiveness check");
		point.set(origin.getKey(), isNext ? 0 : origin.getChildrenSize(), "element");
	}
}
/**
* Set a RangeSelection on the editor from the given CaretRange
*
* @returns The new RangeSelection
*/
function $setSelectionFromCaretRange(caretRange) {
	const currentSelection = $getSelection();
	const selection = $isRangeSelection(currentSelection) ? currentSelection : $createRangeSelection();
	$updateRangeSelectionFromCaretRange(selection, caretRange);
	$setSelection(selection);
	return selection;
}
/**
* Update the points of a RangeSelection based on the given PointCaret.
*/
function $updateRangeSelectionFromCaretRange(selection, caretRange) {
	$setPointFromCaret(selection.anchor, caretRange.anchor);
	$setPointFromCaret(selection.focus, caretRange.focus);
}
/**
* Get a pair of carets for a RangeSelection.
*
* If the focus is before the anchor, then the direction will be
* 'previous', otherwise the direction will be 'next'.
*/
function $caretRangeFromSelection(selection) {
	const { anchor, focus } = selection;
	const anchorCaret = $caretFromPoint(anchor, "next");
	const focusCaret = $caretFromPoint(focus, "next");
	const direction = $comparePointCaretNext(anchorCaret, focusCaret) <= 0 ? "next" : "previous";
	return $getCaretRange($getCaretInDirection(anchorCaret, direction), $getCaretInDirection(focusCaret, direction));
}
/**
* Given a SiblingCaret we can always compute a caret that points to the
* origin of that caret in the same direction. The adjacent caret of the
* returned caret will be equivalent to the given caret.
*
* @example
* ```ts
* siblingCaret.is($rewindSiblingCaret(siblingCaret).getAdjacentCaret())
* ```
*
* @param caret The caret to "rewind"
* @returns A new caret (ChildCaret or SiblingCaret) with the same direction
*/
function $rewindSiblingCaret(caret) {
	const { direction, origin } = caret;
	const rewindOrigin = $getSiblingCaret(origin, flipDirection(direction)).getNodeAtCaret();
	return rewindOrigin ? $getSiblingCaret(rewindOrigin, direction) : $getChildCaret(origin.getParentOrThrow(), direction);
}
function $getAnchorCandidates(anchor, rootMode = "root") {
	const carets = [anchor];
	for (let parent = $isChildCaret(anchor) ? anchor.getParentCaret(rootMode) : anchor.getSiblingCaret(); parent !== null; parent = parent.getParentCaret(rootMode)) carets.push($rewindSiblingCaret(parent));
	return carets;
}
function $isCaretAttached(caret) {
	return !!caret && caret.origin.isAttached();
}
/**
* Remove all text and nodes in the given range. If the range spans multiple
* blocks then the remaining contents of the later block will be merged with
* the earlier block.
*
* @param initialRange The range to remove text and nodes from
* @param sliceMode If 'preserveEmptyTextPointCaret' it will leave an empty TextPointCaret at the anchor for insert if one exists, otherwise empty slices will be removed
* @returns The new collapsed range (biased towards the earlier node)
*/
function $removeTextFromCaretRange(initialRange, sliceMode = "removeEmptySlices") {
	if (initialRange.isCollapsed()) return initialRange;
	const rootMode = "root";
	const nextDirection = "next";
	let sliceState = sliceMode;
	const range = $getCaretRangeInDirection(initialRange, nextDirection);
	let rangeContainer = range.anchor.origin;
	while (rangeContainer !== null && !$isRootOrShadowRoot(rangeContainer)) rangeContainer = rangeContainer.getParent();
	const rangeContainerChild = $isElementNode(rangeContainer) ? rangeContainer.getFirstChild() : null;
	const anchorCandidates = $getAnchorCandidates(range.anchor, rootMode);
	const focusCandidates = $getAnchorCandidates(range.focus.getFlipped(), rootMode);
	const seenStart = /* @__PURE__ */ new Set();
	const removedNodes = [];
	for (const caret of range.iterNodeCarets(rootMode)) if ($isChildCaret(caret)) seenStart.add(caret.origin.getKey());
	else if ($isSiblingCaret(caret)) {
		const { origin } = caret;
		if (!$isElementNode(origin) || seenStart.has(origin.getKey())) removedNodes.push(origin);
	}
	const removedParents = /* @__PURE__ */ new Set();
	for (const node of removedNodes) {
		const parent = node.getParent();
		if (parent !== null && !seenStart.has(parent.getKey())) removedParents.add(parent);
		$removeFromParent(node);
	}
	for (const parent of removedParents) if (!parent.canBeEmpty() && !$isRootOrShadowRoot(parent) && parent.isEmpty() && parent.isAttached()) parent.remove();
	for (const slice of range.getTextSlices()) {
		if (!slice) continue;
		const { origin } = slice.caret;
		const contentSize = origin.getTextContentSize();
		const caretBefore = $rewindSiblingCaret($getSiblingCaret(origin, nextDirection));
		const mode = origin.getMode();
		if (Math.abs(slice.distance) === contentSize && sliceState === "removeEmptySlices" || mode === "token" && slice.distance !== 0) caretBefore.remove();
		else if (slice.distance !== 0) {
			sliceState = "removeEmptySlices";
			let nextCaret = slice.removeTextSlice();
			const sliceOrigin = slice.caret.origin;
			if (mode === "segmented") {
				const src = nextCaret.origin;
				const plainTextNode = $createTextNode(src.getTextContent()).setStyle(src.getStyle()).setFormat(src.getFormat());
				caretBefore.replaceOrInsert(plainTextNode);
				nextCaret = $getTextPointCaret(plainTextNode, nextDirection, nextCaret.offset);
			}
			if (sliceOrigin.is(anchorCandidates[0].origin)) anchorCandidates[0] = nextCaret;
			if (sliceOrigin.is(focusCandidates[0].origin)) focusCandidates[0] = nextCaret.getFlipped();
		}
	}
	let anchorCandidate;
	let focusCandidate;
	for (const candidate of anchorCandidates) if ($isCaretAttached(candidate)) {
		anchorCandidate = $normalizeCaret(candidate);
		break;
	}
	for (const candidate of focusCandidates) if ($isCaretAttached(candidate)) {
		focusCandidate = $normalizeCaret(candidate);
		break;
	}
	const mergeTargets = $getBlockMergeTargets(anchorCandidate, focusCandidate, seenStart);
	if (mergeTargets) {
		const [anchorBlock, focusBlock] = mergeTargets;
		$getChildCaret(anchorBlock, "previous").splice(0, focusBlock.getChildren());
		let parent = focusBlock.getParent();
		focusBlock.remove(true);
		while (parent && parent.isEmpty()) {
			const element = parent;
			parent = parent.getParent();
			element.remove(true);
		}
	} else if (focusCandidate) {
		const focusBlock = $getBlockFromCaret(focusCandidate);
		const focusBlockParent = focusBlock && focusBlock.getParent();
		const topmostShadowRoot = focusBlock && focusBlock.getParents().findLast($isShadowRootNode);
		if (focusBlock && focusBlockParent && !$isRootNode(focusBlockParent) && focusBlock.isEmpty() && seenStart.has(focusBlock.getKey()) && $getSlotNames(focusBlock).length === 0 && (!topmostShadowRoot || seenStart.has(topmostShadowRoot.getKey()))) {
			focusBlock.remove(true);
			let parent = focusBlockParent;
			while (parent && !$isRootNode(parent) && parent.isEmpty()) {
				const grandparent = parent.getParent();
				if (grandparent && $isRootNode(grandparent) && grandparent.getChildrenSize() <= 1 && parent.canBeEmpty()) break;
				const element = parent;
				parent = grandparent;
				element.remove(true);
			}
		}
	}
	if ($restoreEmptyContainerParagraph(rangeContainer, rangeContainerChild) === null && rangeContainer !== null && !rangeContainer.isAttached()) $restoreEmptyContainerParagraph($getRoot(), null);
	const bestCandidate = [
		anchorCandidate,
		focusCandidate,
		...anchorCandidates,
		...focusCandidates
	].find($isCaretAttached);
	if (bestCandidate) return $getCollapsedCaretRange($getCaretInDirection($normalizeCaret(bestCandidate), initialRange.direction));
	invariant(false, "$removeTextFromCaretRange: selection was lost, could not find a new anchor given candidates with keys: %s", JSON.stringify(anchorCandidates.map((n) => n.origin.__key)));
}
function $getBlockFromCaret(caret) {
	if ($isChildCaret(caret)) {
		const origin = caret.origin;
		if (INTERNAL_$isBlock(origin)) return origin;
	} else {
		const parent = caret.getParentAtCaret();
		if (parent && INTERNAL_$isBlock(parent)) return parent;
	}
	return null;
}
/**
* Determine if the two caret origins are in distinct blocks that
* should be merged.
*
* The returned block pair will be the closest blocks to their
* common ancestor, and must be no shadow roots between
* the blocks and their respective carets. If two distinct
* blocks matching this criteria are not found, this will return
* null.
*/
function $getBlockMergeTargets(anchor, focus, seenStart) {
	if (!anchor || !focus) return null;
	const anchorParent = anchor.getParentAtCaret();
	const focusParent = focus.getParentAtCaret();
	if (!anchorParent || !focusParent) return null;
	const anchorElements = anchorParent.getParents().reverse();
	anchorElements.push(anchorParent);
	const focusElements = focusParent.getParents().reverse();
	focusElements.push(focusParent);
	const maxLen = Math.min(anchorElements.length, focusElements.length);
	let commonAncestorCount = 0;
	for (; commonAncestorCount < maxLen && anchorElements[commonAncestorCount] === focusElements[commonAncestorCount]; commonAncestorCount++);
	const $getBlock = (arr, predicate) => {
		let block;
		for (let i = commonAncestorCount; i < arr.length; i++) {
			const ancestor = arr[i];
			if ($isRootOrShadowRoot(ancestor)) return;
			else if (!block && predicate(ancestor)) block = ancestor;
		}
		return block;
	};
	const anchorBlock = $getBlock(anchorElements, INTERNAL_$isBlock);
	const focusBlock = anchorBlock && $getBlock(focusElements, (node) => seenStart.has(node.getKey()) && INTERNAL_$isBlock(node));
	if (focusBlock && $getSlotNames(focusBlock).length > 0) return null;
	return anchorBlock && focusBlock ? [anchorBlock, focusBlock] : null;
}
/**
* Return the deepest ChildCaret that has initialCaret's origin
* as an ancestor, or initialCaret if the origin is not an ElementNode
* or is already the deepest ChildCaret.
*
* This is generally used when normalizing because there is
* "zero distance" between these locations.
*
* @param initialCaret
* @returns Either a deeper ChildCaret or the given initialCaret
*/
function $getDeepestChildOrSelf(initialCaret) {
	let caret = initialCaret;
	while ($isChildCaret(caret)) {
		const adjacent = $getAdjacentChildCaret(caret);
		if (!$isChildCaret(adjacent)) break;
		caret = adjacent;
	}
	return caret;
}
/**
* Normalize a caret to the deepest equivalent PointCaret.
* This will return a TextPointCaret with the offset set according
* to the direction if given a caret with a TextNode origin
* or a caret with an ElementNode origin with the deepest ChildCaret
* having an adjacent TextNode.
*
* If given a TextPointCaret, it will be returned, as no normalization
* is required when an offset is already present.
*
* @param initialCaret
* @returns The normalized PointCaret
*/
function $normalizeCaret(initialCaret) {
	const caret = $getDeepestChildOrSelf(initialCaret.getLatest());
	const { direction } = caret;
	if ($isTextNode(caret.origin)) return $isTextPointCaret(caret) ? caret : $getTextPointCaret(caret.origin, direction, direction);
	const adj = caret.getAdjacentCaret();
	return $isSiblingCaret(adj) && $isTextNode(adj.origin) ? $getTextPointCaret(adj.origin, direction, flipDirection(direction)) : caret;
}
/**
* Determine whether the TextPointCaret's offset can be extended further without leaving the TextNode.
* Returns false if the given caret is not a TextPointCaret or the offset can not be moved further in
* direction.
*
* @param caret A PointCaret
* @returns true if caret is a TextPointCaret with an offset that is not at the end of the text given the direction.
*/
function $isExtendableTextPointCaret(caret) {
	return $isTextPointCaret(caret) && caret.offset !== $getTextNodeOffset(caret.origin, caret.direction);
}
/**
* Return the range if it's in the given direction, otherwise
* construct a new range using a flipped focus as the anchor
* and a flipped anchor as the focus. This transformation
* preserves the section of the document that it's working
* with, but reverses the order of iteration.
*
* @param range Any CaretRange
* @param direction The desired direction
* @returns A CaretRange in direction
*/
function $getCaretRangeInDirection(range, direction) {
	if (range.direction === direction) return range;
	return $getCaretRange($getCaretInDirection(range.focus, direction), $getCaretInDirection(range.anchor, direction));
}
/**
* Get a caret pointing at the child at the given index, or the last
* caret in that node if out of bounds.
*
* @param parent An ElementNode
* @param index The index of the origin for the caret
* @returns A caret pointing towards the node at that index
*/
function $getChildCaretAtIndex(parent, index, direction) {
	let caret = $getChildCaret(parent, "next");
	for (let i = 0; i < index; i++) {
		const nextCaret = caret.getAdjacentCaret();
		if (nextCaret === null) break;
		caret = nextCaret;
	}
	return $getCaretInDirection(caret, direction);
}
/**
* Returns the Node sibling when this exists, otherwise the closest parent sibling. For example
* R -> P -> T1, T2
*   -> P2
* returns T2 for node T1, P2 for node T2, and null for node P2.
* @param startCaret The initial caret
* @param rootMode The root mode, 'root' (default) or 'shadowRoot'
* @returns An array (tuple) containing the found caret and the depth difference, or null, if this node doesn't exist.
*/
function $getAdjacentSiblingOrParentSiblingCaret(startCaret, rootMode = "root") {
	let depthDiff = 0;
	let caret = startCaret;
	let nextCaret = $getAdjacentChildCaret(caret);
	while (nextCaret === null) {
		depthDiff--;
		nextCaret = caret.getParentCaret(rootMode);
		if (!nextCaret) return null;
		caret = nextCaret;
		nextCaret = $getAdjacentChildCaret(caret);
	}
	return nextCaret && [nextCaret, depthDiff];
}
/**
* Get the adjacent nodes to initialCaret in the given direction.
*
* @example
* ```ts
* expect($getAdjacentNodes($getChildCaret(parent, 'next'))).toEqual(parent.getChildren());
* expect($getAdjacentNodes($getChildCaret(parent, 'previous'))).toEqual(parent.getChildren().reverse());
* expect($getAdjacentNodes($getSiblingCaret(node, 'next'))).toEqual(node.getNextSiblings());
* expect($getAdjacentNodes($getSiblingCaret(node, 'previous'))).toEqual(node.getPreviousSiblings().reverse());
* ```
*
* @param initialCaret The caret to start at (the origin will not be included)
* @returns An array of siblings.
*/
function $getAdjacentNodes(initialCaret) {
	const siblings = [];
	for (let caret = initialCaret.getAdjacentCaret(); caret; caret = caret.getAdjacentCaret()) siblings.push(caret.origin);
	return siblings;
}
function $splitTextPointCaret(textPointCaret) {
	const { origin, offset, direction } = textPointCaret;
	if (offset === $getTextNodeOffset(origin, direction)) return textPointCaret.getSiblingCaret();
	else if (offset === $getTextNodeOffset(origin, flipDirection(direction))) return $rewindSiblingCaret(textPointCaret.getSiblingCaret());
	const [textNode] = origin.splitText(offset);
	invariant($isTextNode(textNode), "$splitTextPointCaret: splitText must return at least one TextNode");
	return $getCaretInDirection($getSiblingCaret(textNode, "next"), direction);
}
function $alwaysSplit(_node, _edge) {
	return true;
}
/**
* Split a node at a PointCaret and return a NodeCaret at that point, or null if the
* node can't be split. This is non-recursive and will only perform at most one split.
*
* @returns The NodeCaret pointing to the location of the split (or null if a split is not possible)
*/
function $splitAtPointCaretNext(pointCaret, { $copyElementNode = $copyNode, $splitTextPointCaretNext = $splitTextPointCaret, rootMode = "shadowRoot", $shouldSplit = $alwaysSplit, removeEmptyDestination = false } = {}) {
	if ($isTextPointCaret(pointCaret)) return $splitTextPointCaretNext(pointCaret);
	const parentCaret = pointCaret.getParentCaret(rootMode);
	if (parentCaret) {
		const { origin } = parentCaret;
		if ($isChildCaret(pointCaret)) {
			const beforeParentCaret = $rewindSiblingCaret(parentCaret);
			if (removeEmptyDestination && origin.isEmpty()) {
				origin.remove();
				return beforeParentCaret;
			}
			if (!(origin.canBeEmpty() && $shouldSplit(origin, "first"))) return beforeParentCaret;
		}
		const siblings = $getAdjacentNodes(pointCaret);
		if (siblings.length > 0 || !removeEmptyDestination && origin.canBeEmpty() && $shouldSplit(origin, "last")) parentCaret.insert($copyElementNode(origin).splice(0, 0, siblings));
	}
	return parentCaret;
}
/**
* If the insertion caret is the root/shadow root node (see {@link $isRootOrShadowRoot}),
* the node will be inserted there, otherwise the parent nodes will be split according to the
* given options.
* @param node - The node to be inserted
* @param caret - The location to insert or split from
* @returns The node after its insertion
*/
function $insertNodeToNearestRootAtCaret(node, caret, options) {
	let insertCaret = $getCaretInDirection(caret, "next");
	if ($isTextPointCaret(insertCaret)) {
		if (insertCaret.offset === 0) insertCaret = $getSiblingCaret(insertCaret.origin, "previous").getFlipped();
		else if (insertCaret.offset === insertCaret.origin.getTextContentSize()) insertCaret = $getSiblingCaret(insertCaret.origin, "next");
	}
	if (insertCaret.origin.is(node)) {
		invariant($isSiblingCaret(insertCaret), "$insertNodeToNearestRootAtCaret node %s of type %s can not be inserted into itself", node.getKey(), node.getType());
		insertCaret = $rewindSiblingCaret(insertCaret);
	}
	if (node.is(insertCaret.getNodeAtCaret()) || node.is(insertCaret.getFlipped().getNodeAtCaret())) node.remove(true);
	for (let nextCaret = insertCaret; nextCaret; nextCaret = $splitAtPointCaretNext(nextCaret, options)) insertCaret = nextCaret;
	invariant(!$isTextPointCaret(insertCaret), "$insertNodeToNearestRootAtCaret: An unattached TextNode can not be split");
	insertCaret.insert(node.isInline() ? $createParagraphNode().append(node) : node);
	return $getCaretInDirection($getSiblingCaret(node.getLatest(), "next"), caret.direction);
}
/**
* Checks whether the selection covers the entire block: the selection's
* start point is at or before the first position inside blockNode and its
* end point is at or after the last position inside blockNode. A selection
* that extends beyond the block's boundaries still fully selects the block,
* and an empty block is fully selected by any selection that touches or
* surrounds it.
*
* @param blockNode - The ElementNode to check, typically a top-level block or the RootNode
* @param selectionOrRange - The RangeSelection or CaretRange to check
* @returns true if the selection covers the entire blockNode
*/
function $isBlockFullySelected(blockNode, selectionOrRange) {
	const range = $getCaretRangeInDirection($isRangeSelection(selectionOrRange) ? $caretRangeFromSelection(selectionOrRange) : selectionOrRange, "next");
	const anchorFrame = $getSlotFrame(range.anchor.origin);
	const blockFrame = $getSlotFrame(blockNode.getLatest());
	if (anchorFrame === null ? blockFrame !== null : !anchorFrame.is(blockFrame)) return false;
	const blockStart = $normalizeCaret($getChildCaret(blockNode, "next"));
	const blockEnd = $getCaretInDirection($normalizeCaret($getChildCaret(blockNode, "previous")), "next");
	return $comparePointCaretNext(range.anchor, blockStart) <= 0 && $comparePointCaretNext(range.focus, blockEnd) >= 0;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/nodes/LexicalParagraphNode.ts
/** @noInheritDoc */
var ParagraphNode = class extends ElementNode {
	$config() {
		return this.config("paragraph", {
			extends: ElementNode,
			generated: GENERATED_PARAGRAPH,
			importDOM: { p: () => ({
				conversion: $convertParagraphElement,
				priority: 0
			}) }
		});
	}
	createDOM(config) {
		const dom = $getDocument().createElement("p");
		const classNames = getCachedClassNameArray(config.theme, "paragraph");
		if (classNames !== void 0) dom.classList.add(...classNames);
		return dom;
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
		}
		return { element };
	}
	exportJSON(compact = false) {
		const json = super.exportJSON(compact);
		if (json.textFormat === void 0 || json.textStyle === void 0) {
			const firstTextNode = this.getChildren().find($isTextNode);
			const textFormat = firstTextNode ? firstTextNode.getFormat() : this.getTextFormat();
			const textStyle = firstTextNode ? firstTextNode.getStyle() : this.getTextStyle();
			if (!compact || textFormat !== 0) json.textFormat = textFormat;
			if (!compact || textStyle !== "") json.textStyle = textStyle;
		}
		return json;
	}
	extractWithChild(child, selection, destination) {
		if (!$isRangeSelection(selection)) return false;
		if (this.getFormatType() === "" && this.getIndent() === 0 && this.getStyle() === "") return false;
		if ($isBlockFullySelected(this, selection)) {
			const textContent = this.getTextContent();
			return textContent !== "" && selection.getTextContent() === textContent;
		}
		return false;
	}
	insertNewAfter(rangeSelection, restoreSelection) {
		const newElement = $createParagraphNode();
		newElement.setTextFormat(rangeSelection.format);
		newElement.setTextStyle(rangeSelection.style);
		const direction = this.getDirection();
		newElement.setDirection(direction);
		newElement.setFormat(this.getFormatType());
		newElement.setStyle(this.getStyle());
		this.insertAfter(newElement, restoreSelection);
		return newElement;
	}
	collapseAtStart() {
		if (this.getChildren().every((node) => $isTextNode(node) && !/\S/.test(node.getTextContent()))) {
			if (this.getNextSibling() !== null) {
				this.selectNext();
				this.remove();
				return true;
			}
			if (this.getPreviousSibling() !== null) {
				this.selectPrevious();
				this.remove();
				return true;
			}
		}
		return false;
	}
};
function $convertParagraphElement(element) {
	const node = $createParagraphNode();
	$setFormatFromDOM(node, element);
	setNodeIndentFromDOM(element, node);
	if (node.getFormatType() === "") {
		const align = element.getAttribute("align");
		if (align) {
			if (align && align in ELEMENT_TYPE_TO_FORMAT) node.setFormat(align);
		}
	}
	$setDirectionFromDOM(node, element);
	return { node };
}
/** Creates a ParagraphNode, the default block-level container for text. */
function $createParagraphNode() {
	return $applyNodeReplacement(new ParagraphNode());
}
/** Returns true if the given node is a ParagraphNode. */
function $isParagraphNode(node) {
	return node instanceof ParagraphNode;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalEditor.ts
/** @internal */
function createInputState() {
	return {
		collapsedSelectionFormat: {
			format: 0,
			key: "root",
			offset: 0,
			style: "",
			timeStamp: 0
		},
		compositionEndData: "",
		compositionPhase: "idle",
		hadOrphanedCompositionEvents: false,
		handledSelectionCommandTimeoutId: null,
		isInsertLineBreak: false,
		isInsertTextAfterHandledSelectionCommand: false,
		isSelectionChangeFromDOMUpdate: false,
		isSelectionChangeFromMouseDown: false,
		isShiftKeyDown: false,
		lastBeforeInputInsertTextTimeStamp: 0,
		lastKeyCode: null,
		lastKeyDownTimeStamp: 0,
		postDeleteSelectionToRestore: null,
		selectionChangeFromDOMUpdatePoints: null,
		unprocessedBeforeInputData: null
	};
}
/**
* Default {@link CreateEditorArgs.onWarn} handler. Used for recoverable,
* warn-level conditions (e.g. the update-recursion guard tripping) that the
* editor has already recovered from. Throws in development so the condition is
* impossible to miss, and only `console.warn`s in production so it is not
* reported as a fatal error. Embedders can override this via `onWarn` to route
* the condition to their own telemetry at warn severity.
*/
function defaultOnWarn(error) {
	console.warn(error);
}
var DEFAULT_SKIP_INITIALIZATION = false;
/**
* {@link LexicalEditor.registerCommand} listener added to the end of the editor priority queue (after critical, high, normal, low)
*/
var COMMAND_PRIORITY_EDITOR = 0;
/**
* {@link LexicalEditor.registerCommand} listener added to the end of the low priority queue (after critical, high, normal; before editor)
*/
var COMMAND_PRIORITY_LOW = 1;
/**
* {@link LexicalEditor.registerCommand} listener added to the end of the normal priority queue (after critical, high; before low, editor)
*/
var COMMAND_PRIORITY_NORMAL = 2;
/**
* {@link LexicalEditor.registerCommand} listener added to the end of the high priority queue (after critical; before normal, low, editor)
*/
var COMMAND_PRIORITY_HIGH = 3;
/**
* {@link LexicalEditor.registerCommand} listener added to the end of the critical priority queue (before high, normal, low, editor)
*/
var COMMAND_PRIORITY_CRITICAL = 4;
/**
* {@link LexicalEditor.registerCommand} listener added to the beginning of the editor priority queue (after critical, high, normal, low)
*/
var COMMAND_PRIORITY_BEFORE_EDITOR = -8;
/**
* {@link LexicalEditor.registerCommand} listener added to the beginning of the low priority queue (after critical, high, normal; before editor)
*/
var COMMAND_PRIORITY_BEFORE_LOW = -7;
/**
* {@link LexicalEditor.registerCommand} listener added to the beginning of the normal priority queue (after critical, high; before low, editor)
*/
var COMMAND_PRIORITY_BEFORE_NORMAL = -6;
/**
* {@link LexicalEditor.registerCommand} listener added to the beginning of the high priority queue (after critical; before normal, low, editor)
*/
var COMMAND_PRIORITY_BEFORE_HIGH = -5;
/**
* {@link LexicalEditor.registerCommand} listener added to the beginning of the critical priority queue (before high, normal, low, editor)
*/
var COMMAND_PRIORITY_BEFORE_CRITICAL = -4;
function normalizePriority(priority) {
	return priority & 7;
}
/**
* @internal
*
* Resets the editor's transient state — DOM mappings, dirty tracking,
* composition, and (by default) the queued updates and tags — while
* applying the given pendingEditorState. Used during root element
* transitions and reconciler error recovery.
*/
function resetEditor(editor, prevRootElement, nextRootElement, pendingEditorState, options) {
	const keyNodeMap = editor._keyToDOMMap;
	keyNodeMap.clear();
	editor._editorState = createEmptyEditorState();
	editor._pendingEditorState = pendingEditorState;
	editor._compositionKey = null;
	editor._dirtyType = 0;
	editor._cloneNotNeeded.clear();
	editor._dirtyLeaves = /* @__PURE__ */ new Set();
	editor._dirtyElements.clear();
	editor._normalizedNodes = /* @__PURE__ */ new Set();
	if (!options || !options.preserveUpdateQueue) {
		editor._updateTags = /* @__PURE__ */ new Set();
		editor._updates = [];
		editor._cascadeCount = 0;
	}
	editor._blockCursorElement = null;
	if (editor._inputState.handledSelectionCommandTimeoutId !== null) clearTimeout(editor._inputState.handledSelectionCommandTimeoutId);
	editor._inputState = createInputState();
	const observer = editor._observer;
	if (observer !== null) {
		observer.disconnect();
		editor._observer = null;
	}
	if (prevRootElement !== null) {
		prevRootElement.textContent = "";
		clearNodeKeyOnDOMNode(prevRootElement, editor);
	}
	if (nextRootElement !== null) {
		nextRootElement.textContent = "";
		keyNodeMap.set("root", nextRootElement);
		setNodeKeyOnDOMNode(nextRootElement, editor, "root");
	}
}
function initializeConversionCache(nodes, additionalConversions) {
	const conversionCache = /* @__PURE__ */ new Map();
	const handledConversions = /* @__PURE__ */ new Set();
	const addConversionsToCache = (map) => {
		Object.keys(map).forEach((key) => {
			let currentCache = conversionCache.get(key);
			if (currentCache === void 0) {
				currentCache = [];
				conversionCache.set(key, currentCache);
			}
			currentCache.push(map[key]);
		});
	};
	nodes.forEach((node) => {
		const importDOM = node.klass.importDOM;
		if (importDOM == null || handledConversions.has(importDOM)) return;
		handledConversions.add(importDOM);
		const map = importDOM.call(node.klass);
		if (map !== null) addConversionsToCache(map);
	});
	if (additionalConversions) addConversionsToCache(additionalConversions);
	return conversionCache;
}
/** @internal */
function getTransformSetFromKlass(klass) {
	const transforms = /* @__PURE__ */ new Set();
	const staticTransforms = /* @__PURE__ */ new Set();
	for (const { klass: currentKlass, ownNodeConfig } of iterStaticNodeConfigChain(klass)) {
		const staticTransform = currentKlass.transform;
		if (!staticTransforms.has(staticTransform)) {
			staticTransforms.add(staticTransform);
			const transform = currentKlass.transform();
			if (transform) transforms.add(transform);
		}
		if (ownNodeConfig) {
			const $transform = ownNodeConfig.$transform;
			if ($transform) transforms.add($transform);
		}
	}
	return transforms;
}
/** @internal @experimental */
var DEFAULT_EDITOR_DOM_CONFIG = {
	$createDOM: (node, editor) => node.createDOM(editor._config, editor),
	$decorateDOM: (_node, _prevNode, _dom, _editor) => {},
	$exportDOM: (node, editor) => {
		const registeredNode = getRegisteredNode(editor, node.getType());
		return registeredNode && registeredNode.exportDOM !== void 0 ? registeredNode.exportDOM(editor, node) : node.exportDOM(editor);
	},
	$extractWithChild: (node, childNode, selection, destination, _editor) => $isElementNode(node) && node.extractWithChild(childNode, selection, destination),
	$getDOMSlot: (node, dom, _editor) => node.getDOMSlot(dom),
	$getSlotTargetElement: (_node, _slotName, _hostDom, _editor) => null,
	$shouldExclude: (node, _selection, _editor) => $isElementNode(node) && node.excludeFromCopy("html"),
	$shouldInclude: (node, selection, _editor) => selection ? node.isSelected(selection) : true,
	$updateDOM: (nextNode, prevNode, dom, editor) => nextNode.updateDOM(prevNode, dom, editor._config)
};
/**
* Creates a new LexicalEditor attached to a single contentEditable (provided in the config). This is
* the lowest-level initialization API for a LexicalEditor. If you're using React or another framework,
* consider using the appropriate abstractions, such as LexicalComposer
* @param editorConfig - the editor configuration.
* @returns a LexicalEditor instance
*/
function createEditor(editorConfig) {
	const config = editorConfig || {};
	const activeEditor = internalGetActiveEditor();
	const theme = config.theme || {};
	const parentEditor = editorConfig === void 0 ? activeEditor : config.parentEditor || null;
	const disableEvents = config.disableEvents || false;
	const editorState = createEmptyEditorState();
	const namespace = config.namespace || (parentEditor !== null ? parentEditor._config.namespace : createUID());
	const initialEditorState = config.editorState;
	const nodes = [
		RootNode,
		TextNode,
		LineBreakNode,
		TabNode,
		ParagraphNode,
		ArtificialNode__DO_NOT_USE,
		...config.nodes || []
	];
	const { onError, onWarn, html } = config;
	const isEditable = config.editable !== void 0 ? config.editable : true;
	let registeredNodes;
	if (editorConfig === void 0 && activeEditor !== null) registeredNodes = activeEditor._nodes;
	else {
		registeredNodes = /* @__PURE__ */ new Map();
		for (let i = 0; i < nodes.length; i++) {
			let klass = nodes[i];
			let replace = null;
			let replaceWithKlass = null;
			if (klass && typeof klass === "object") {
				const options = klass;
				klass = options.replace;
				replace = options.with;
				replaceWithKlass = options.withKlass || null;
			}
			if (typeof klass !== "function" || !klass.prototype || !(klass === LexicalNode || klass.prototype instanceof LexicalNode)) {
				let version = "<unknown>";
				try {
					version = JSON.parse(LEXICAL_VERSION);
				} catch {}
				invariant(false, "createEditor: nodes[%s] %s is not a constructor that subclasses LexicalNode from the lexical package used by this editor (%s)", String(i - nodes.length + (config.nodes ? config.nodes.length : 0)), typeof klass === "function" ? `${klass.name}${typeof klass.getType === "function" ? ` (type ${String(klass.getType())})` : ""}` : String(klass), String(version));
			}
			getStaticNodeConfig(klass);
			const type = klass.getType();
			const transforms = getTransformSetFromKlass(klass);
			registeredNodes.set(type, {
				exportDOM: html && html.export ? html.export.get(klass) : void 0,
				klass,
				replace,
				replaceWithKlass,
				sharedNodeState: createSharedNodeState(nodes[i]),
				transforms
			});
		}
	}
	const editor = new LexicalEditor(editorState, parentEditor, registeredNodes, {
		disableEvents,
		dom: {
			...DEFAULT_EDITOR_DOM_CONFIG,
			...editorConfig && editorConfig.dom
		},
		namespace,
		theme
	}, onError ? onError : console.error, onWarn ? onWarn : defaultOnWarn, initializeConversionCache(registeredNodes, html ? html.import : void 0), isEditable, editorConfig);
	if (initialEditorState !== void 0) {
		editor._pendingEditorState = initialEditorState;
		editor._dirtyType = 2;
	}
	registerDefaultCommandHandlers(editor);
	return editor;
}
function triggerListener(listenerMap, listener, args) {
	const unregister = listenerMap.get(listener);
	if (unregister) unregister();
	listenerMap.set(listener, listener(...args) || void 0);
}
function unregisterListener(listenerMap, listener) {
	const unregister = listenerMap.get(listener);
	listenerMap.delete(listener);
	if (unregister) unregister();
}
function registerListener(listenerMap, listener, unregister) {
	listenerMap.set(listener, unregister);
	return unregisterListener.bind(null, listenerMap, listener);
}
var LexicalEditor = class {
	/** The version with build identifiers for this editor (since 0.17.1) */
	static version = LEXICAL_VERSION;
	/** @internal */
	_headless;
	/** @internal */
	_parentEditor;
	/** @internal */
	_rootElement;
	/** @internal */
	_editorState;
	/** @internal */
	_pendingEditorState;
	/** @internal */
	_compositionKey;
	/** @internal */
	_deferred;
	/** @internal */
	_keyToDOMMap;
	/** @internal */
	_updates;
	/** @internal */
	_updating;
	/** @internal */
	_cascadeCount;
	/** @internal */
	_listeners;
	/** @internal */
	_commands;
	/** @internal */
	_nodes;
	/** @internal */
	_decorators;
	/** @internal */
	_pendingDecorators;
	/** @internal */
	_config;
	/** @internal */
	_dirtyType;
	/** @internal */
	_cloneNotNeeded;
	/** @internal */
	_dirtyLeaves;
	/** @internal */
	_dirtyElements;
	/** @internal */
	_normalizedNodes;
	/** @internal */
	_updateTags;
	/** @internal */
	_observer;
	/** @internal */
	_key;
	/** @internal */
	_onError;
	/** @internal */
	_onWarn;
	/** @internal */
	_htmlConversions;
	/** @internal */
	_window;
	/** @internal */
	_editable;
	/** @internal */
	_blockCursorElement;
	/**
	* @internal @experimental
	*
	* Latches to `true` the first time {@link $setSlot} runs in this
	* editor. Gates the commit-time slot-containment clamp so editors that never
	* use slots skip the per-update frame walk entirely. The latch persists for
	* the lifetime of the editor instance — `resetEditor` and `setEditorState`
	* do not clear it, so an editor that once used slots keeps paying the clamp
	* cost even after switching to a slot-free state.
	*/
	_slotsUsed;
	/** @internal */
	_keyDownShortcuts;
	/** @internal */
	_inputState;
	/** @internal */
	_lastNotifiedSelection;
	/** @internal */
	_createEditorArgs;
	/** @internal */
	constructor(editorState, parentEditor, nodes, config, onError, onWarn, htmlConversions, editable, createEditorArgs) {
		this._createEditorArgs = createEditorArgs;
		this._parentEditor = parentEditor;
		this._rootElement = null;
		this._editorState = editorState;
		this._pendingEditorState = null;
		this._compositionKey = null;
		this._deferred = [];
		this._keyToDOMMap = new GenMap();
		this._updates = [];
		this._updating = false;
		this._cascadeCount = 0;
		this._listeners = {
			decorator: /* @__PURE__ */ new Map(),
			editable: /* @__PURE__ */ new Map(),
			mutation: /* @__PURE__ */ new Map(),
			root: /* @__PURE__ */ new Map(),
			textcontent: /* @__PURE__ */ new Map(),
			update: /* @__PURE__ */ new Map()
		};
		this._commands = /* @__PURE__ */ new Map();
		this._config = config;
		this._nodes = nodes;
		this._decorators = {};
		this._pendingDecorators = null;
		this._dirtyType = 0;
		this._cloneNotNeeded = /* @__PURE__ */ new Map();
		this._dirtyLeaves = /* @__PURE__ */ new Set();
		this._dirtyElements = /* @__PURE__ */ new Map();
		this._normalizedNodes = /* @__PURE__ */ new Set();
		this._updateTags = /* @__PURE__ */ new Set();
		this._observer = null;
		this._key = createUID();
		this._onError = onError;
		this._onWarn = onWarn;
		this._htmlConversions = htmlConversions;
		this._editable = editable;
		this._headless = parentEditor !== null && parentEditor._headless;
		this._window = null;
		this._blockCursorElement = null;
		this._slotsUsed = false;
		this._keyDownShortcuts = null;
		this._inputState = createInputState();
		this._lastNotifiedSelection = null;
	}
	/**
	*
	* @returns true if the editor is currently in "composition" mode due to receiving input
	* through an IME, or 3P extension, for example. Returns false otherwise.
	*/
	isComposing() {
		return this._compositionKey != null;
	}
	/**
	* Registers a listener for Editor update event. Will trigger the provided callback
	* each time the editor goes through an update (via {@link LexicalEditor.update}) until the
	* teardown function is called.
	*
	* @returns a teardown function that can be used to cleanup the listener.
	*/
	registerUpdateListener(listener) {
		return registerListener(this._listeners.update, listener);
	}
	/**
	* Registers a listener for when the editor changes between editable and non-editable states.
	* Will trigger the provided callback each time the editor transitions between these states until the
	* teardown function is called.
	*
	* If the listener returns a function, that function will be called before the next transition or
	* teardown.
	*
	* @returns a teardown function that can be used to cleanup the listener.
	*/
	registerEditableListener(listener) {
		return registerListener(this._listeners.editable, listener);
	}
	/**
	* Registers a listener for when the editor's decorator object changes. The decorator object contains
	* all DecoratorNode keys -> their decorated value. This is primarily used with external UI frameworks.
	*
	* Will trigger the provided callback each time the editor transitions between these states until the
	* teardown function is called.
	*
	* @returns a teardown function that can be used to cleanup the listener.
	*/
	registerDecoratorListener(listener) {
		return registerListener(this._listeners.decorator, listener);
	}
	/**
	* Registers a listener for when Lexical commits an update to the DOM and the text content of
	* the editor changes from the previous state of the editor. If the text content is the
	* same between updates, no notifications to the listeners will happen.
	*
	* Will trigger the provided callback each time the editor transitions between these states until the
	* teardown function is called.
	*
	* @returns a teardown function that can be used to cleanup the listener.
	*/
	registerTextContentListener(listener) {
		return registerListener(this._listeners.textcontent, listener);
	}
	/**
	* Registers a listener for when the editor's root DOM element (the content editable
	* Lexical attaches to) changes. This is primarily used to attach event listeners to the root
	*  element. The root listener function is executed directly upon registration and then on
	* any subsequent update.
	*
	* Will trigger the provided callback each time the editor transitions between these states until the
	* teardown function is called.
	*
	* If the listener returns a function, that function will be called before the next transition or
	* teardown.
	*
	* @returns a teardown function that can be used to cleanup the listener.
	*/
	registerRootListener(listener) {
		const listenerMap = this._listeners.root;
		return mergeRegister(registerListener(listenerMap, listener, listener(this._rootElement, null) || void 0), () => triggerListener(listenerMap, listener, [null, this._rootElement]));
	}
	/**
	* Registers a listener that will trigger anytime the provided command
	* is dispatched with {@link LexicalEditor.dispatch}, subject to priority.
	* Listeners that run at a higher priority can "intercept" commands and
	* prevent them from propagating to other handlers by returning true.
	*
	* Listeners are always invoked in an {@link LexicalEditor.update} and can
	* call dollar functions.
	*
	* Listeners registered at the same priority level will run
	* deterministically in the order of registration.
	*
	* @param command - the command that will trigger the callback.
	* @param listener - the function that will execute when the command is dispatched.
	* @param priority - the relative priority of the listener. 0 | 1 | 2 | 3 | 4
	*   (or {@link COMMAND_PRIORITY_EDITOR} |
	*     {@link COMMAND_PRIORITY_LOW} |
	*     {@link COMMAND_PRIORITY_NORMAL} |
	*     {@link COMMAND_PRIORITY_HIGH} |
	*     {@link COMMAND_PRIORITY_CRITICAL})
	* @returns a teardown function that can be used to cleanup the listener.
	*/
	registerCommand(command, listener, priority) {
		if (priority === void 0) invariant(false, "Listener for type \"command\" requires a \"priority\".");
		const commandsMap = this._commands;
		if (!commandsMap.has(command)) commandsMap.set(command, [
			new DequeSet(),
			new DequeSet(),
			new DequeSet(),
			new DequeSet(),
			new DequeSet()
		]);
		const listenersInPriorityOrder = commandsMap.get(command);
		if (listenersInPriorityOrder === void 0) invariant(false, "registerCommand: Command %s not found in command map", String(command));
		const normalizedPriority = normalizePriority(priority);
		const listeners = listenersInPriorityOrder[normalizedPriority];
		if (normalizedPriority !== priority) listeners.addFront(listener);
		else listeners.addBack(listener);
		return () => {
			listeners.delete(listener);
			if (listenersInPriorityOrder.every((listenersSet) => listenersSet.size === 0)) commandsMap.delete(command);
		};
	}
	/**
	* Registers a listener that will run when a Lexical node of the provided class is
	* mutated. The listener will receive a list of nodes along with the type of mutation
	* that was performed on each: created, destroyed, or updated.
	*
	* One common use case for this is to attach DOM event listeners to the underlying DOM nodes as Lexical nodes are created.
	* {@link LexicalEditor.getElementByKey} can be used for this.
	*
	* If any existing nodes are in the DOM, and skipInitialization is not true, the listener
	* will be called immediately with an updateTag of 'registerMutationListener' where all
	* nodes have the 'created' NodeMutation. This can be controlled with the skipInitialization option
	* (whose default was previously true for backwards compatibility with &lt;=0.16.1 but has been changed to false as of 0.21.0).
	*
	* @param klass - The class of the node that you want to listen to mutations on.
	* @param listener - The logic you want to run when the node is mutated.
	* @param options - see {@link MutationListenerOptions}
	* @returns a teardown function that can be used to cleanup the listener.
	*/
	registerMutationListener(klass, listener, options) {
		const klassToMutate = this.resolveRegisteredNodeAfterReplacements(this.getRegisteredNode(klass)).klass;
		const mutations = this._listeners.mutation;
		let klassSet = mutations.get(listener);
		if (klassSet === void 0) {
			klassSet = /* @__PURE__ */ new Set();
			mutations.set(listener, klassSet);
		}
		klassSet.add(klassToMutate);
		const skipInitialization = options && options.skipInitialization;
		if (!(skipInitialization === void 0 ? DEFAULT_SKIP_INITIALIZATION : skipInitialization)) this.initializeMutationListener(listener, klassToMutate);
		return () => {
			klassSet.delete(klassToMutate);
			if (klassSet.size === 0) mutations.delete(listener);
		};
	}
	/** @internal */
	getRegisteredNode(klass) {
		const registeredNode = this._nodes.get(klass.getType());
		if (registeredNode === void 0) invariant(false, "Node %s has not been registered. Ensure node has been passed to createEditor.", klass.name);
		return registeredNode;
	}
	/** @internal */
	resolveRegisteredNodeAfterReplacements(registeredNode) {
		while (registeredNode.replaceWithKlass) registeredNode = this.getRegisteredNode(registeredNode.replaceWithKlass);
		return registeredNode;
	}
	/** @internal */
	initializeMutationListener(listener, klass) {
		const prevEditorState = this._editorState;
		const nodeMap = getCachedTypeToNodeMap(prevEditorState).get(klass.getType());
		if (!nodeMap) return;
		const nodeMutationMap = /* @__PURE__ */ new Map();
		for (const k of nodeMap.keys()) nodeMutationMap.set(k, "created");
		if (nodeMutationMap.size > 0) listener(nodeMutationMap, {
			dirtyLeaves: /* @__PURE__ */ new Set(),
			prevEditorState,
			updateTags: /* @__PURE__ */ new Set(["registerMutationListener"])
		});
	}
	/** @internal */
	registerNodeTransformToKlass(klass, listener) {
		const registeredNode = this.getRegisteredNode(klass);
		registeredNode.transforms.add(listener);
		return registeredNode;
	}
	/**
	* Registers a listener that will run when a Lexical node of the provided class is
	* marked dirty during an update. The listener will continue to run as long as the node
	* is marked dirty. There are no guarantees around the order of transform execution!
	*
	* Watch out for infinite loops. See [Node Transforms](https://lexical.dev/docs/concepts/transforms)
	* @param klass - The class of the node that you want to run transforms on.
	* @param listener - The logic you want to run when the node is updated.
	* @returns a teardown function that can be used to cleanup the listener.
	*/
	registerNodeTransform(klass, listener) {
		const registeredNode = this.registerNodeTransformToKlass(klass, listener);
		const registeredNodes = [registeredNode];
		const replaceWithKlass = registeredNode.replaceWithKlass;
		if (replaceWithKlass != null) {
			const registeredReplaceWithNode = this.registerNodeTransformToKlass(replaceWithKlass, listener);
			registeredNodes.push(registeredReplaceWithNode);
		}
		markNodesWithTypesAsDirty(this, registeredNodes.map((node) => node.klass.getType()));
		return () => {
			registeredNodes.forEach((node) => node.transforms.delete(listener));
		};
	}
	/**
	* Used to assert that a certain node is registered, usually by plugins to ensure nodes that they
	* depend on have been registered.
	* @returns True if the editor has registered the provided node type, false otherwise.
	*/
	hasNode(node) {
		return this._nodes.has(node.getType());
	}
	/**
	* Used to assert that certain nodes are registered, usually by plugins to ensure nodes that they
	* depend on have been registered.
	* @returns True if the editor has registered all of the provided node types, false otherwise.
	*/
	hasNodes(nodes) {
		return nodes.every(this.hasNode.bind(this));
	}
	/**
	* Dispatches a command of the specified type with the specified payload.
	* This triggers all command listeners (set by {@link LexicalEditor.registerCommand})
	* for this type, passing them the provided payload. The command listeners
	* will be triggered in an implicit {@link LexicalEditor.update}, unless
	* this was invoked from inside an update in which case that update context
	* will be re-used (as if this was a dollar function itself).
	*
	* Do not call this from inside a read-only context such as
	* {@link LexicalEditor.read} or {@link EditorState.read}. Command listeners
	* usually change the editor, so Lexical runs them in a separate writable
	* update and development builds log a warning when they detect this.
	* Dispatch after the read returns instead.
	* @param type - the type of command listeners to trigger.
	* @param payload - the data to pass as an argument to the command listeners.
	*/
	dispatchCommand(type, ...args) {
		return dispatchCommand(this, type, ...args);
	}
	/**
	* Gets a map of all decorators in the editor.
	* @returns A mapping of call decorator keys to their decorated content
	*/
	getDecorators() {
		return this._decorators;
	}
	/**
	*
	* @returns the current root element of the editor. If you want to register
	* an event listener, do it via {@link LexicalEditor.registerRootListener}, since
	* this reference may not be stable.
	*/
	getRootElement() {
		return this._rootElement;
	}
	/**
	* Gets the key of the editor
	* @returns The editor key
	*/
	getKey() {
		return this._key;
	}
	/**
	* Imperatively set the root contenteditable element that Lexical listens
	* for events on.
	*/
	setRootElement(nextRootElement) {
		const prevRootElement = this._rootElement;
		if (nextRootElement !== prevRootElement) {
			const classNames = getCachedClassNameArray(this._config.theme, "root");
			const pendingEditorState = this._pendingEditorState || this._editorState;
			this._rootElement = nextRootElement;
			resetEditor(this, prevRootElement, nextRootElement, pendingEditorState, { preserveUpdateQueue: true });
			if (prevRootElement !== null) {
				if (!this._config.disableEvents) removeRootElementEvents(prevRootElement);
				if (classNames != null) prevRootElement.classList.remove(...classNames);
			}
			if (nextRootElement !== null) {
				const windowObj = getDefaultView(nextRootElement);
				const style = nextRootElement.style;
				style.userSelect = "text";
				style.whiteSpace = "pre-wrap";
				style.wordBreak = "break-word";
				nextRootElement.setAttribute("data-lexical-editor", "true");
				this._window = windowObj;
				this._dirtyType = 2;
				initMutationObserver(this);
				this._updateTags.add(HISTORY_MERGE_TAG);
				$commitPendingUpdates(this);
				if (!this._config.disableEvents) addRootElementEvents(nextRootElement, this);
				if (classNames != null) nextRootElement.classList.add(...classNames);
			} else {
				this._window = null;
				this._updateTags.add(HISTORY_MERGE_TAG);
				$commitPendingUpdates(this);
			}
			triggerListeners("root", this, false, nextRootElement, prevRootElement);
		}
	}
	/**
	* Gets the underlying HTMLElement associated with the LexicalNode for the given key.
	* @returns the HTMLElement rendered by the LexicalNode associated with the key.
	* @param key - the key of the LexicalNode.
	*/
	getElementByKey(key) {
		return this._keyToDOMMap.get(key) || null;
	}
	/**
	* Gets the active editor state.
	* @returns The editor state
	*/
	getEditorState() {
		return this._editorState;
	}
	/**
	* Imperatively set the EditorState. Triggers reconciliation like an update.
	* @param editorState - the state to set the editor
	* @param options - options for the update.
	*/
	setEditorState(editorState, options) {
		const isEmptyEditorState = editorState.isEmpty();
		let writableEditorState = editorState;
		if (writableEditorState._readOnly) {
			writableEditorState = cloneEditorState(editorState);
			writableEditorState._selection = editorState._selection ? editorState._selection.clone() : null;
		}
		flushRootMutations(this);
		const pendingEditorState = this._pendingEditorState;
		const tag = options !== void 0 ? options.tag : null;
		if (pendingEditorState !== null && !pendingEditorState.isEmpty()) {
			if (tag != null) this._updateTags.add(tag);
			$commitPendingUpdates(this);
		}
		this._pendingEditorState = writableEditorState;
		this._dirtyType = 2;
		this._dirtyElements.set("root", false);
		this._compositionKey = null;
		this._slotsUsed = this._slotsUsed || editorState._slotsUsed;
		updateEditorSync(this, () => {
			if (tag) this._updateTags.add(tag);
			if (isEmptyEditorState) {
				devInvariant(false, "setEditorState: the editor state is empty. Ensure the editor state's root node never becomes empty.");
				$getRoot().append($createParagraphNode());
			}
			if (editorState._parsed) for (const [key, node] of writableEditorState._nodeMap.entries()) if ($isElementNode(node)) this._dirtyElements.set(key, true);
			else this._dirtyLeaves.add(key);
		}, { discrete: this._updating ? void 0 : true });
	}
	/**
	* Parses a SerializedEditorState (usually produced by {@link EditorState.toJSON}) and returns
	* and EditorState object that can be, for example, passed to {@link LexicalEditor.setEditorState}. Typically,
	* deserialization from JSON stored in a database uses this method.
	*
	* Either form is accepted: parsing restores what a compact document omitted,
	* which is the whole reason it may omit it, so
	* {@link CompactSerializedEditorState} — what `toJSON(true)` returns — goes
	* back in without a cast. So does a document assembled from serialized nodes
	* ({@link ParsableSerializedEditorState}), such as `@lexical/clipboard`'s.
	* @param maybeStringifiedEditorState
	* @param updateFn
	* @returns
	*/
	parseEditorState(maybeStringifiedEditorState, updateFn) {
		return parseEditorState(typeof maybeStringifiedEditorState === "string" ? JSON.parse(maybeStringifiedEditorState) : maybeStringifiedEditorState, this, updateFn);
	}
	read(...args) {
		const [mode, callbackFn] = args.length === 1 ? ["force-commit", args[0]] : args;
		if (mode === "force-commit") $commitPendingUpdates(this);
		return (mode === "pending" ? this._pendingEditorState || this._editorState : this.getEditorState()).read(callbackFn, { editor: this });
	}
	/**
	* Executes an update to the editor state. The updateFn callback is the ONLY place
	* where Lexical editor state can be safely mutated.
	* @param updateFn - A function that has access to writable editor state.
	* @param options - A bag of options to control the behavior of the update.
	*/
	update(updateFn, options) {
		updateEditor(this, updateFn, options);
	}
	/**
	* Focuses the editor by marking the existing selection as dirty, or by
	* creating a new selection at `defaultSelection` if one does not already
	* exist. If you want to force a specific selection, you should call
	* `root.selectStart()` or `root.selectEnd()` in an update.
	*
	* @param callbackFn - A function to run after the editor is focused.
	* @param options - A bag of options
	*/
	focus(callbackFn, options = {}) {
		const rootElement = this._rootElement;
		if (rootElement !== null) {
			rootElement.setAttribute("autocapitalize", "off");
			updateEditorSync(this, () => {
				const selection = $getSelection();
				const root = $getRoot();
				if (selection !== null) {
					if (!selection.dirty) $setSelection(selection.clone());
				} else if (root.getChildrenSize() !== 0) {
					if (options.defaultSelection === "rootStart") root.selectStart();
					else root.selectEnd();
				}
				$addUpdateTag(FOCUS_TAG);
				$onUpdate(() => {
					rootElement.removeAttribute("autocapitalize");
					if (callbackFn) callbackFn();
				});
			});
			if (this._pendingEditorState === null) rootElement.removeAttribute("autocapitalize");
		}
	}
	/**
	* Removes focus from the editor.
	*/
	blur() {
		const rootElement = this._rootElement;
		if (rootElement !== null) rootElement.blur();
		const domSelection = getDOMSelection(this._window);
		if (domSelection !== null) domSelection.removeAllRanges();
	}
	/**
	* Returns true if the editor is editable, false otherwise.
	* @returns True if the editor is editable, false otherwise.
	*/
	isEditable() {
		return this._editable;
	}
	/**
	* Sets the editable property of the editor. When false, the
	* editor will not listen for user events on the underling contenteditable.
	* @param editable - the value to set the editable mode to.
	*/
	setEditable(editable) {
		if (this._editable !== editable) {
			this._editable = editable;
			triggerListeners("editable", this, true, editable);
			if (this._slotsUsed) this.update(() => $fullReconcile());
		}
	}
	/**
	* Returns a JSON-serializable javascript object NOT a JSON string.
	* You still must call JSON.stringify (or something else) to turn the
	* state into a string you can transfer over the wire and store in a database.
	*
	* See {@link LexicalNode.exportJSON}
	*
	* This editor's serialized state, in whichever form the export around it is
	* writing — which is how a nested editor (an image caption) stays in the
	* same form as the document containing it.
	*
	* The form is passed on explicitly rather than picked up by the call below:
	* `EditorState.toJSON()` with no argument always writes the legacy form, so
	* that its return type is true of what it returns.
	*
	* @returns A JSON-serializable javascript object
	*/
	toJSON() {
		return { editorState: this._editorState.toJSON($isCompactExport()) };
	}
};
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalUtils.ts
var pendingNodeToClone = null;
function setPendingNodeToClone(pendingNode) {
	pendingNodeToClone = pendingNode;
}
function getPendingNodeToClone() {
	const node = pendingNodeToClone;
	pendingNodeToClone = null;
	return node;
}
var INTERNAL_SKIP_AFTER_CLONE_FROM = Symbol("INTERNAL_SKIP_AFTER_CLONE_FROM");
var keyCounter = 1;
/** Resets the internal key counter, primarily for deterministic test output. */
function resetRandomKey() {
	keyCounter = 1;
}
function generateRandomKey() {
	return "" + keyCounter++;
}
/**
* @internal
*/
function getRegisteredNodeOrThrow(editor, nodeType) {
	const registeredNode = getRegisteredNode(editor, nodeType);
	if (registeredNode === void 0) invariant(false, "registeredNode: Type %s not found", nodeType);
	return registeredNode;
}
/**
* @internal
*/
function getRegisteredNode(editor, nodeType) {
	return editor._nodes.get(nodeType);
}
Array.isArray;
/** @internal */
var scheduleMicroTask = typeof queueMicrotask === "function" ? queueMicrotask : (fn) => {
	Promise.resolve().then(fn);
};
/** Returns true if the active element (resolved from the anchor's root) is a decorator's own input (e.g. an input, textarea, or foreign contentEditable) rather than Lexical-managed content. */
function $isSelectionCapturedInDecoratorInput(anchorDOM, preResolvedActiveElement) {
	const activeElement = preResolvedActiveElement !== void 0 ? preResolvedActiveElement : (() => {
		const root = anchorDOM.getRootNode();
		return isDOMDocumentNode(root) || isDOMShadowRoot(root) ? getActiveElementDeep(root) : null;
	})();
	if (!isHTMLElement(activeElement)) return false;
	if (activeElement.hasAttribute("data-lexical-slot")) return false;
	const nearestNode = $getNearestNodeFromDOMNode(activeElement);
	const nodeName = activeElement.nodeName;
	return $isLexicalNode(nearestNode) && (nodeName === "INPUT" || nodeName === "TEXTAREA" || activeElement.contentEditable === "true" && getEditorPropertyFromDOMNode(activeElement) == null);
}
/** @deprecated renamed to {@link $isSelectionCapturedInDecoratorInput} by @lexical/eslint-plugin rules-of-lexical */
var isSelectionCapturedInDecoratorInput = $isSelectionCapturedInDecoratorInput;
/** Returns true if the given DOM anchor and focus nodes are inside the editor's root element and not captured by a decorator input. */
function isSelectionWithinEditor(editor, anchorDOM, focusDOM) {
	const rootElement = editor.getRootElement();
	if (!rootElement) return false;
	try {
		if (!anchorDOM || !rootElement.contains(anchorDOM) || !rootElement.contains(focusDOM)) return false;
	} catch (_error) {
		return false;
	}
	return getNearestEditorFromDOMNode(anchorDOM) === editor && editor.read("latest", () => !$isSelectionCapturedInDecoratorInput(anchorDOM));
}
/**
* @returns true if the given argument is a LexicalEditor instance from this build of Lexical
*/
function isLexicalEditor(editor) {
	return editor instanceof LexicalEditor;
}
/** Returns the nearest LexicalEditor instance by walking up the DOM tree from the given node, or null if none is found. */
function getNearestEditorFromDOMNode(node) {
	let currentNode = node;
	while (currentNode != null) {
		const editor = getEditorPropertyFromDOMNode(currentNode);
		if (isLexicalEditor(editor)) return editor;
		currentNode = getParentElement(currentNode);
	}
	return null;
}
/** @internal */
function getEditorPropertyFromDOMNode(node) {
	return node ? node.__lexicalEditor : null;
}
/** Returns the text direction ('ltr' or 'rtl') of the given string, or null if it contains no strong directional characters. */
function getTextDirection(text) {
	if (RTL_REGEX.test(text)) return "rtl";
	if (LTR_REGEX.test(text)) return "ltr";
	return null;
}
/**
* Return true if the TextNode is a TabNode or is in token mode.
*/
function $isTokenOrTab(node) {
	return $isTabNode(node) || node.isToken();
}
/**
* Return true if the TextNode is a TabNode, or is in token or segmented mode.
*/
function $isTokenOrSegmented(node) {
	return $isTokenOrTab(node) || node.isSegmented();
}
/**
* @param node - The element being tested
* @returns Returns true if node is an DOM Text node, false otherwise.
*/
function isDOMTextNode(node) {
	return isDOMNode(node) && node.nodeType === 3;
}
/**
* @param node - The element being tested
* @returns Returns true if node is an DOM Document node, false otherwise.
*/
function isDOMDocumentNode(node) {
	return isDOMNode(node) && node.nodeType === 9;
}
/** Returns the first DOM Text node found by descending the firstChild chain from the given node, or null. */
function getDOMTextNode(element) {
	let node = element;
	while (node != null) {
		if (isDOMTextNode(node)) return node;
		node = node.firstChild;
	}
	return null;
}
/** Toggles the given text format type on a format bitmask, clearing mutually exclusive formats (subscript/superscript, lowercase/uppercase/capitalize). */
function toggleTextFormatType(format, type, alignWithFormat) {
	const activeFormat = TEXT_TYPE_TO_FORMAT[type];
	if (alignWithFormat !== null && (format & activeFormat) === (alignWithFormat & activeFormat)) return format;
	let newFormat = format ^ activeFormat;
	if (type === "subscript") newFormat &= ~TEXT_TYPE_TO_FORMAT.superscript;
	else if (type === "superscript") newFormat &= ~TEXT_TYPE_TO_FORMAT.subscript;
	else if (type === "lowercase") {
		newFormat &= ~TEXT_TYPE_TO_FORMAT.uppercase;
		newFormat &= ~TEXT_TYPE_TO_FORMAT.capitalize;
	} else if (type === "uppercase") {
		newFormat &= ~TEXT_TYPE_TO_FORMAT.lowercase;
		newFormat &= ~TEXT_TYPE_TO_FORMAT.capitalize;
	} else if (type === "capitalize") {
		newFormat &= ~TEXT_TYPE_TO_FORMAT.lowercase;
		newFormat &= ~TEXT_TYPE_TO_FORMAT.uppercase;
	}
	return newFormat;
}
/** Returns true if the given node is a leaf (TextNode, LineBreakNode, or DecoratorNode). */
function $isLeafNode(node) {
	return $isTextNode(node) || $isLineBreakNode(node) || $isDecoratorNode(node);
}
function $setNodeKey(node, existingKey) {
	const pendingNode = getPendingNodeToClone();
	existingKey = existingKey || pendingNode && pendingNode.__key;
	if (existingKey != null) {
		node.__key = existingKey;
		return;
	}
	errorOnReadOnly();
	errorOnInfiniteTransforms();
	const editor = getActiveEditor();
	const editorState = getActiveEditorState();
	const key = generateRandomKey();
	editorState._nodeMap.set(key, node);
	if ($isElementNode(node)) editor._dirtyElements.set(key, true);
	else editor._dirtyLeaves.add(key);
	editor._cloneNotNeeded.set(key, node);
	if (editor._dirtyType === 0) editor._dirtyType = 1;
	node.__key = key;
}
function internalMarkParentElementsAsDirty(parentKey, nodeMap, dirtyElements) {
	let nextParentKey = parentKey;
	while (nextParentKey !== null) {
		if (dirtyElements.has(nextParentKey)) return;
		const node = nodeMap.get(nextParentKey);
		if (node === void 0) break;
		dirtyElements.set(nextParentKey, false);
		nextParentKey = node.__parent !== null ? node.__parent : $isSlotChild(node) ? node.__slotHost : null;
	}
}
/**
* @internal
*
* Latch the "this document uses slots" flag. The editor keeps it for its
* lifetime, and the EditorState currently being built carries it so that a
* state handed to another editor via `setEditorState` brings the flag with it.
*
* The state marked here is the *active* one. Inside `editor.update()` that is
* `editor._pendingEditorState`, but `parseEditorState` builds a detached
* EditorState and leaves `_pendingEditorState` untouched, so keying off
* pending would miss the parsed state entirely (and could stamp the flag onto
* an unrelated pending state).
*/
function $markSlotsUsed() {
	getActiveEditor()._slotsUsed = true;
	getActiveEditorState()._slotsUsed = true;
}
/**
* Removes a node from its parent, updating all necessary pointers and links.
* @internal
*
* This function does not adjust the editor's current selection. Callers
* that need element-anchored offsets in the old parent to track the child
* count change must call `$updateElementSelectionOnCreateDeleteNode` (with
* `times = -1`) after invoking this — see `$removeNode`, `replace`,
* `insertBefore`, and `insertAfter` for the pattern.
*
* This function is for internal use of the library.
* Please do not use it as it may change in the future.
*/
function $removeFromParent(node) {
	invariant($getSlotHostKey(node) === null, "$removeFromParent: node %s is slotted into host %s; a slotted node and a child are mutually exclusive. Remove it from its slot first.", node.__key, String($getSlotHostKey(node)));
	const oldParent = node.getParent();
	if (oldParent !== null) {
		const writableNode = node.getWritable();
		const writableParent = oldParent.getWritable();
		const prevSibling = node.getPreviousSibling();
		const nextSibling = node.getNextSibling();
		const nextSiblingKey = nextSibling !== null ? nextSibling.__key : null;
		const prevSiblingKey = prevSibling !== null ? prevSibling.__key : null;
		const writablePrevSibling = prevSibling !== null ? prevSibling.getWritable() : null;
		const writableNextSibling = nextSibling !== null ? nextSibling.getWritable() : null;
		if (prevSibling === null) writableParent.__first = nextSiblingKey;
		if (nextSibling === null) writableParent.__last = prevSiblingKey;
		if (writablePrevSibling !== null) writablePrevSibling.__next = nextSiblingKey;
		if (writableNextSibling !== null) writableNextSibling.__prev = prevSiblingKey;
		writableNode.__prev = null;
		writableNode.__next = null;
		writableNode.__parent = null;
		writableParent.__size--;
	}
}
/** @deprecated renamed to {@link $removeFromParent} by @lexical/eslint-plugin rules-of-lexical */
var removeFromParent = $removeFromParent;
function internalMarkNodeAsDirty(node) {
	errorOnInfiniteTransforms();
	invariant(!$isEphemeral(node), "internalMarkNodeAsDirty: Ephemeral nodes must not be marked as dirty (key %s type %s)", node.__key, node.__type);
	const parent = node.__parent !== null ? node.__parent : $isSlotChild(node) ? node.__slotHost : null;
	const editorState = getActiveEditorState();
	const editor = getActiveEditor();
	const nodeMap = editorState._nodeMap;
	const dirtyElements = editor._dirtyElements;
	if (parent !== null) internalMarkParentElementsAsDirty(parent, nodeMap, dirtyElements);
	const key = node.__key;
	if (editor._dirtyType === 0) editor._dirtyType = 1;
	if ($isElementNode(node)) dirtyElements.set(key, true);
	else editor._dirtyLeaves.add(key);
}
function internalMarkSiblingsAsDirty(node) {
	const previousNode = node.getPreviousSibling();
	const nextNode = node.getNextSibling();
	if (previousNode !== null) internalMarkNodeAsDirty(previousNode);
	if (nextNode !== null) internalMarkNodeAsDirty(nextNode);
}
/** Sets the active composition key, marking the previous and new composition nodes as dirty for re-rendering. */
function $setCompositionKey(compositionKey) {
	errorOnReadOnly();
	const editor = getActiveEditor();
	const previousCompositionKey = editor._compositionKey;
	if (compositionKey !== previousCompositionKey) {
		editor._compositionKey = compositionKey;
		if (previousCompositionKey !== null) {
			const node = $getNodeByKey(previousCompositionKey);
			if (node !== null) node.getWritable();
		}
		if (compositionKey !== null) {
			const node = $getNodeByKey(compositionKey);
			if (node !== null) node.getWritable();
		}
	}
}
function $getCompositionKey() {
	if (isCurrentlyReadOnlyMode()) return null;
	return getActiveEditor()._compositionKey;
}
function $getNodeByKey(key, _editorState) {
	const node = (_editorState || getActiveEditorState())._nodeMap.get(key);
	if (node === void 0) return null;
	return node;
}
/** Returns the LexicalNode directly associated with the given DOM node, or null if the DOM node has no Lexical key. */
function $getNodeFromDOMNode(dom, editorState) {
	const key = getNodeKeyFromDOMNode(dom, getActiveEditor());
	if (key !== void 0) return $getNodeByKey(key, editorState);
	return null;
}
function setNodeKeyOnDOMNode(dom, editor, key) {
	const prop = `__lexicalKey_${editor._key}`;
	dom[prop] = key;
}
function clearNodeKeyOnDOMNode(dom, editor) {
	const prop = `__lexicalKey_${editor._key}`;
	delete dom[prop];
}
function getNodeKeyFromDOMNode(dom, editor) {
	return dom[`__lexicalKey_${editor._key}`];
}
/** Returns the nearest LexicalNode by walking up the DOM tree from the given node, or null if no Lexical node is found. */
function $getNearestNodeFromDOMNode(startingDOM, editorState) {
	let dom = startingDOM;
	while (dom != null) {
		const node = $getNodeFromDOMNode(dom, editorState);
		if (node !== null) return node;
		dom = getParentElement(dom);
	}
	return null;
}
function cloneDecorators(editor) {
	const currentDecorators = editor._decorators;
	const pendingDecorators = Object.assign({}, currentDecorators);
	editor._pendingDecorators = pendingDecorators;
	return pendingDecorators;
}
function getEditorStateTextContent(editorState) {
	return editorState.read(() => $getRoot().getTextContent());
}
function markNodesWithTypesAsDirty(editor, types) {
	const cachedMap = getCachedTypeToNodeMap(editor.getEditorState());
	const dirtyNodeMaps = [];
	for (const type of types) {
		const nodeMap = cachedMap.get(type);
		if (nodeMap) dirtyNodeMaps.push(nodeMap);
	}
	if (dirtyNodeMaps.length === 0) return;
	editor.update(() => {
		for (const nodeMap of dirtyNodeMaps) for (const nodeKey of nodeMap.keys()) {
			const latest = $getNodeByKey(nodeKey);
			if (latest) latest.markDirty();
		}
	}, editor._pendingEditorState === null ? { tag: HISTORY_MERGE_TAG } : void 0);
}
/** Returns the RootNode of the active EditorState. */
function $getRoot() {
	return internalGetRoot(getActiveEditorState());
}
/**
* Restores the empty paragraph a root or shadow root needs to stay editable,
* when a removal has left `container` with no children at all. Removing the
* last node it held (a lone table or block decorator sitting beside a block
* cursor, or a select-all over a document that is a single shadow root)
* otherwise leaves nowhere to put a caret, and the next keystroke acts on the
* container itself rather than on a block inside it.
*
* A ParagraphNode is only a valid child of a container that holds blocks. The
* RootNode always does, but a shadow root may be structural instead — a
* TableNode holds rows, a TableRowNode holds cells — so for anything but the
* root, `removedChild` (a child the caller is removing, or has just removed,
* from `container`) decides: a paragraph belongs where a block did.
*
* Call this only where a removal could have emptied `container`. It is a no-op
* on a container that is already populated, but on one that was *already*
* empty beforehand it would seed a paragraph nobody asked for.
*
* @returns the paragraph that was appended, or null when nothing was restored.
* @internal
*/
function $restoreEmptyContainerParagraph(container, removedChild) {
	if (!$isRootOrShadowRoot(container) || !container.isAttached() || ($isRootNode(container) ? container.getChildrenSize() !== 0 : !container.isEmpty()) || !($isRootNode(container) || removedChild !== null && INTERNAL_$isBlock(removedChild))) return null;
	const paragraph = $createParagraphNode();
	container.append(paragraph);
	return paragraph;
}
function internalGetRoot(editorState) {
	return editorState._nodeMap.get("root");
}
/** Sets the current selection in the active EditorState, marking it dirty and clamping to slot boundaries when applicable. */
function $setSelection(selection) {
	errorOnReadOnly();
	const editorState = getActiveEditorState();
	if (selection !== null) {
		selection.dirty = true;
		selection.setCachedNodes(null);
		if ($isRangeSelection(selection) && getActiveEditor()._slotsUsed) $clampRangeSelectionToSlotFrame(selection);
	}
	editorState._selection = selection;
}
function $flushMutations() {
	errorOnReadOnly();
	flushRootMutations(getActiveEditor());
}
function $getNodeFromDOM(dom) {
	const nodeKey = getNodeKeyFromDOMTree(dom, getActiveEditor());
	if (nodeKey === null) return null;
	return $getNodeByKey(nodeKey);
}
function getNodeKeyFromDOMTree(dom, editor) {
	let node = dom;
	while (node != null) {
		const key = getNodeKeyFromDOMNode(node, editor);
		if (key !== void 0) return key;
		node = getParentElement(node);
	}
	return null;
}
/**
* Return true if `str` contains any valid surrogate pair.
*
* See also $updateCaretSelectionForUnicodeCharacter for
* a discussion on when and why this is useful.
*/
function doesContainSurrogatePair(str) {
	return /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(str);
}
function getEditorsToPropagate(editor) {
	const editorsToPropagate = [];
	for (let currentEditor = editor; currentEditor !== null; currentEditor = currentEditor._parentEditor) editorsToPropagate.push(currentEditor);
	return editorsToPropagate;
}
function createUID() {
	return Math.random().toString(36).replace(/[^a-z]+/g, "").substring(0, 5);
}
function getAnchorTextFromDOM(anchorNode) {
	return isDOMTextNode(anchorNode) ? anchorNode.nodeValue : null;
}
function $updateSelectedTextFromDOM(isCompositionEnd, editor, data) {
	const domSelection = getDOMSelection(getWindow(editor));
	if (domSelection === null) return;
	const points = getDOMSelectionPoints(domSelection, editor._rootElement);
	const anchorNode = points.anchorNode;
	let { anchorOffset, focusOffset } = points;
	if (anchorNode !== null) {
		let textContent = getAnchorTextFromDOM(anchorNode);
		const node = $getNearestNodeFromDOMNode(anchorNode);
		if (textContent !== null && $isTextNode(node)) {
			if ((textContent === COMPOSITION_SUFFIX || textContent === COMPOSITION_START_CHAR) && data) {
				const offset = data.length;
				textContent = data;
				anchorOffset = offset;
				focusOffset = offset;
			}
			if (textContent !== null) $updateTextNodeFromDOMContent(node, textContent, anchorOffset, focusOffset, isCompositionEnd);
		}
	}
}
function $updateTextNodeFromDOMContent(textNode, textContent, anchorOffset, focusOffset, compositionEnd) {
	let node = textNode;
	if (node.isAttached() && (compositionEnd || !node.isDirty())) {
		const isComposing = node.isComposing();
		if (node.isToken() && isComposing) return;
		let normalizedTextContent = textContent;
		if (isComposing || compositionEnd) {
			if (textContent.endsWith(COMPOSITION_SUFFIX)) normalizedTextContent = textContent.slice(0, -COMPOSITION_SUFFIX.length);
			if (compositionEnd) {
				const char = COMPOSITION_START_CHAR;
				let index;
				while ((index = normalizedTextContent.indexOf(char)) !== -1) {
					normalizedTextContent = normalizedTextContent.slice(0, index) + normalizedTextContent.slice(index + char.length);
					if (anchorOffset !== null && anchorOffset > index) anchorOffset = Math.max(index, anchorOffset - char.length);
					if (focusOffset !== null && focusOffset > index) focusOffset = Math.max(index, focusOffset - char.length);
				}
			}
		}
		const prevTextContent = node.getTextContent();
		if (compositionEnd || normalizedTextContent !== prevTextContent) {
			const selection = $getSelection();
			if (normalizedTextContent === "") {
				$setCompositionKey(null);
				if (!IS_SAFARI && !IS_IOS && !IS_APPLE_WEBKIT) {
					const editor = getActiveEditor();
					$setTextContentWithSelection(node, "", selection);
					setTimeout(() => {
						editor.update(() => {
							if (node.isAttached() && node.getTextContent() === "") node.remove();
						});
					}, 20);
				} else node.remove();
				return;
			}
			const parent = node.getParent();
			const prevSelection = $getPreviousSelection();
			const prevTextContentSize = node.getTextContentSize();
			const compositionKey = $getCompositionKey();
			const nodeKey = node.getKey();
			if (node.isToken() && !isComposing || compositionKey !== null && nodeKey === compositionKey && !isComposing || $isRangeSelection(prevSelection) && (parent !== null && !parent.canInsertTextBefore() && prevSelection.anchor.offset === 0 || prevSelection.anchor.key === textNode.__key && prevSelection.anchor.offset === 0 && !node.canInsertTextBefore() && !isComposing || prevSelection.focus.key === textNode.__key && prevSelection.focus.offset === prevTextContentSize && !node.canInsertTextAfter() && !isComposing)) {
				node.markDirty();
				return;
			}
			if (!$isRangeSelection(selection) || anchorOffset === null || focusOffset === null) {
				$setTextContentWithSelection(node, normalizedTextContent, selection);
				return;
			}
			selection.setTextNodeRange(node, anchorOffset, node, focusOffset);
			if (node.isSegmented()) {
				const replacement = $createTextNode(node.getTextContent());
				node.replace(replacement);
				node = replacement;
			}
			$setTextContentWithSelection(node, normalizedTextContent, selection);
		}
	}
}
function $setTextContentWithSelection(node, textContent, selection) {
	node.setTextContent(textContent);
	if ($isRangeSelection(selection)) {
		const key = node.getKey();
		let pointMutated = false;
		for (const k of ["anchor", "focus"]) {
			const pt = selection[k];
			if (pt.type === "text" && pt.key === key) {
				pt.offset = $getTextNodeOffset(node, pt.offset, "clamp");
				pointMutated = true;
			}
		}
		if (pointMutated) {
			selection._cachedNodes = null;
			selection._cachedIsBackward = null;
		}
	}
}
function $previousSiblingDoesNotAcceptText(node) {
	const previousSibling = node.getPreviousSibling();
	return ($isTextNode(previousSibling) || $isElementNode(previousSibling) && previousSibling.isInline()) && !previousSibling.canInsertTextAfter();
}
function $shouldInsertTextAfterOrBeforeTextNode(selection, node) {
	if (node.isSegmented()) return true;
	if (!selection.isCollapsed()) return false;
	const offset = selection.anchor.offset;
	const parent = node.getParentOrThrow();
	const isToken = $isTokenOrTab(node);
	if (offset === 0) return !node.canInsertTextBefore() || !parent.canInsertTextBefore() && !node.isComposing() || isToken || $previousSiblingDoesNotAcceptText(node);
	else if (offset === node.getTextContentSize()) return !node.canInsertTextAfter() || !parent.canInsertTextAfter() && !node.isComposing() || isToken;
	else return false;
}
/** @internal */
function keyboardEventMaskForPlatform(mask, isApple) {
	const otherKey = mask[CONTROL_OR_OTHER_KEY];
	return otherKey && isApple !== IS_APPLE ? {
		...mask,
		ctrlKey: mask[otherKey],
		[otherKey]: mask.ctrlKey
	} : mask;
}
function matchModifier(event, mask, prop) {
	const expected = mask[prop] || false;
	return expected === "any" || expected === event[prop];
}
/**
* Match a KeyboardEvent with its expected modifier state
*
* @param event A KeyboardEvent, or structurally similar object
* @param mask An object specifying the expected state of the modifiers
* @returns true if the event matches
*/
function isModifierMatch(event, mask) {
	return matchModifier(event, mask, "altKey") && matchModifier(event, mask, "ctrlKey") && matchModifier(event, mask, "shiftKey") && matchModifier(event, mask, "metaKey");
}
/**
* Match a KeyboardEvent with its expected state
*
* @param event A KeyboardEvent, or structurally similar object
* @param expectedKey The string to compare with event.key (case insensitive)
* @param mask An object specifying the expected state of the modifiers
* @returns true if the event matches
*/
function isExactShortcutMatch(event, expectedKey, mask) {
	if (!isModifierMatch(event, mask)) return false;
	if (event.key.toLowerCase() === expectedKey.toLowerCase()) return true;
	if (expectedKey.length > 1) return false;
	if (event.key.length === 1 && event.key.charCodeAt(0) <= 127) return false;
	if (event.code.startsWith("Digit") && /^\d$/.test(expectedKey)) return event.code === `Digit${expectedKey}`;
	const expectedCode = "Key" + expectedKey.toUpperCase();
	return event.code === expectedCode;
}
function isModifier(event) {
	return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}
function isBackspace(event) {
	return event.key === "Backspace";
}
/**
* `$selectAll` places its points at the element level and then normalizes them
* down towards text points. When every point descends into the *same* shadow
* root — a document whose only top-level node is a columns layout, say — the
* result stops describing "select everything" and starts describing "select the
* text inside the widget". A delete then empties the widget in place instead of
* removing it (#6938), because the range never covers the widget itself.
*
* Keeping the element-level points in that case leaves the shadow root inside
* the selection. A selection that merely *starts* in a shadow root, such as a
* select-all anchored in a leading table, still normalizes as before: it already
* extends past the shadow root, so the widget is covered either way.
*/
function $getRootChildAncestor(node) {
	let current = node;
	while (current !== null) {
		const parent = current.getParent();
		if (parent === null) return null;
		if ($isRootNode(parent)) return current;
		current = parent;
	}
	return null;
}
function $normalizeSelectionForSelectAll(selection, container) {
	const { anchor, focus } = selection;
	const anchorKey = anchor.key;
	const anchorOffset = anchor.offset;
	const anchorType = anchor.type;
	const focusKey = focus.key;
	const focusOffset = focus.offset;
	const focusType = focus.type;
	$normalizeSelection(selection);
	if (!$isRootNode(container)) return selection;
	const anchorTop = $getRootChildAncestor(anchor.getNode());
	if ($isElementNode(anchorTop) && anchorTop.isShadowRoot() && anchorTop.is($getRootChildAncestor(focus.getNode()))) {
		anchor.set(anchorKey, anchorOffset, anchorType);
		focus.set(focusKey, focusOffset, focusType);
	}
	return selection;
}
/** Selects all content within the root. If a selection is provided, scopes to the nearest root or shadow root; otherwise creates a new RangeSelection spanning the entire root. */
function $selectAll(selection) {
	const root = $getRoot();
	if ($isRangeSelection(selection)) {
		const anchor = selection.anchor;
		const focus = selection.focus;
		const anchorNode = anchor.getNode();
		if ($isRootNode(anchorNode)) {
			anchor.set(anchorNode.getKey(), 0, "element");
			focus.set(anchorNode.getKey(), anchorNode.getChildrenSize(), "element");
			$normalizeSelectionForSelectAll(selection, anchorNode);
			return selection;
		}
		const topParent = anchorNode.getTopLevelElementOrThrow();
		const parent = topParent.getParent();
		if (parent === null) {
			if ($isElementNode(topParent)) {
				anchor.set(topParent.getKey(), 0, "element");
				focus.set(topParent.getKey(), topParent.getChildrenSize(), "element");
				$normalizeSelectionForSelectAll(selection, topParent);
			}
			return selection;
		}
		anchor.set(parent.getKey(), 0, "element");
		focus.set(parent.getKey(), parent.getChildrenSize(), "element");
		$normalizeSelectionForSelectAll(selection, parent);
		return selection;
	} else {
		const newSelection = root.select(0, root.getChildrenSize());
		$setSelection($normalizeSelectionForSelectAll(newSelection, root));
		return newSelection;
	}
}
/**
* Removes `class` or `style` from the element when the attribute is present
* but has an empty value.
*
* `classList.remove(...)` and `style.setProperty(prop, '')` do not remove the
* attribute once every token/declaration is gone, so clearing the last theme
* class or the last inline declaration leaves `class=""` / `style=""` behind
* in the editor DOM.
*/
function removeEmptyDOMAttribute(dom, attributeName) {
	if (dom.getAttribute(attributeName) === "") dom.removeAttribute(attributeName);
}
function getCachedClassNameArray(classNamesTheme, classNameThemeType) {
	if (classNamesTheme.__lexicalClassNameCache === void 0) classNamesTheme.__lexicalClassNameCache = {};
	const classNamesCache = classNamesTheme.__lexicalClassNameCache;
	const cachedClassNames = classNamesCache[classNameThemeType];
	if (cachedClassNames !== void 0) return cachedClassNames;
	const classNames = classNamesTheme[classNameThemeType];
	if (typeof classNames === "string") {
		const classNamesArr = normalizeClassNames(classNames);
		classNamesCache[classNameThemeType] = classNamesArr;
		return classNamesArr;
	}
	return classNames;
}
function setMutatedNode(mutatedNodes, registeredNodes, mutationListeners, node, mutation) {
	if (mutationListeners.size === 0) return;
	const nodeType = node.__type;
	const nodeKey = node.__key;
	const registeredNode = registeredNodes.get(nodeType);
	if (registeredNode === void 0) invariant(false, "Type %s not in registeredNodes", nodeType);
	const klass = registeredNode.klass;
	let mutatedNodesByType = mutatedNodes.get(klass);
	if (mutatedNodesByType === void 0) {
		mutatedNodesByType = /* @__PURE__ */ new Map();
		mutatedNodes.set(klass, mutatedNodesByType);
	}
	const prevMutation = mutatedNodesByType.get(nodeKey);
	const isMove = prevMutation === "destroyed" && mutation === "created";
	if (prevMutation === void 0 || isMove) mutatedNodesByType.set(nodeKey, isMove ? "updated" : mutation);
}
/**
* Returns all nodes of the given type in the active editor state.
*
* Consider {@link LexicalEditor.registerMutationListener} with
* `skipInitialization: false` instead if you need to track these nodes over
* time rather than read them once.
*/
function $nodesOfType(klass) {
	const klassType = klass.getType();
	const editorState = getActiveEditorState();
	if (editorState._readOnly) {
		const nodes = getCachedTypeToNodeMap(editorState).get(klassType);
		return nodes ? Array.from(nodes.values()) : [];
	}
	const nodes = editorState._nodeMap;
	const nodesOfType = [];
	for (const [, node] of nodes) if (node instanceof klass && node.__type === klassType && node.isAttached()) nodesOfType.push(node);
	return nodesOfType;
}
function resolveElement(element, isBackward, focusOffset) {
	const parent = element.getParent();
	let offset = focusOffset;
	let block = element;
	if (parent !== null) {
		if (isBackward && focusOffset === 0) {
			offset = block.getIndexWithinParent();
			block = parent;
		} else if (!isBackward && focusOffset === block.getChildrenSize()) {
			offset = block.getIndexWithinParent() + 1;
			block = parent;
		}
	}
	return block.getChildAtIndex(isBackward ? offset - 1 : offset);
}
/** Returns the node adjacent to the given selection point in the specified direction, or null if at a boundary. */
function $getAdjacentNode(focus, isBackward) {
	const focusOffset = focus.offset;
	if (focus.type === "element") return resolveElement(focus.getNode(), isBackward, focusOffset);
	else {
		const focusNode = focus.getNode();
		if (isBackward && focusOffset === 0 || !isBackward && focusOffset === focusNode.getTextContentSize()) {
			const possibleNode = isBackward ? focusNode.getPreviousSibling() : focusNode.getNextSibling();
			if (possibleNode === null) return resolveElement(focusNode.getParentOrThrow(), isBackward, focusNode.getIndexWithinParent() + (isBackward ? 0 : 1));
			return possibleNode;
		}
	}
	return null;
}
function isFirefoxClipboardEvents(editor) {
	const event = getWindow(editor).event;
	const inputType = event && event.inputType;
	return inputType === "insertFromPaste" || inputType === "insertFromPasteAsQuotation";
}
function dispatchCommand(editor, command, ...args) {
	return triggerCommandListeners(editor, command, args[0], editor);
}
function getElementByKeyOrThrow(editor, key) {
	const element = editor._keyToDOMMap.get(key);
	if (element === void 0) invariant(false, "Reconciliation: could not find DOM element for node key %s", key);
	return element;
}
/** Returns the parent element of a DOM node, crossing shadow root boundaries and following slot assignments. */
function getParentElement(node) {
	const parentElement = node.assignedSlot || node.parentElement;
	if (parentElement !== null) return parentElement;
	const parentNode = node.parentNode;
	return isDOMShadowRoot(parentNode) ? parentNode.host : null;
}
/** Returns the owner Document of the given EventTarget, or the target itself if it is a Document. */
function getDOMOwnerDocument(target) {
	return isDOMDocumentNode(target) ? target : isHTMLElement(target) ? target.ownerDocument : null;
}
/**
* Computed scroll-padding keeps percentages, which resolve against the
* scrollport width. 'auto' parses as NaN and counts as 0.
*/
function parseScrollPadding(value, clientWidth) {
	const length = parseFloat(value);
	if (!isFinite(length)) return 0;
	return value.endsWith("%") ? length * clientWidth / 100 : length;
}
/**
* When `element` is a horizontal scroll container (overflow-x auto or
* scroll) with something to scroll, scrolls it sideways so the caret rect
* [left, right] is inside its scrollport, less its scroll-padding. Returns
* how far it actually scrolled, in viewport px.
*
* The caret may also be above or below the element, like a caret below the
* visible part of a root with overflow: auto. It is still revealed sideways
* here. Scrolling sideways doesn't move it up or down, and scrolling up or
* down doesn't move it sideways, so the vertical pass that runs after this
* one reveals it vertically and leaves this reveal alone.
*/
function scrollIntoViewHorizontally(view, element, left, right) {
	const clientWidth = element.clientWidth;
	const maxScroll = element.scrollWidth - clientWidth;
	if (maxScroll <= 0) return 0;
	const style = view.getComputedStyle(element);
	if (style.overflowX !== "auto" && style.overflowX !== "scroll") return 0;
	const rect = element.getBoundingClientRect();
	const offsetWidth = element.offsetWidth;
	const scale = offsetWidth > 0 && Math.abs(rect.width - offsetWidth) > 1 ? rect.width / offsetWidth : 1;
	const isRTL = style.direction === "rtl";
	const scrollportLeft = rect.left + element.clientLeft * scale;
	const viewLeft = scrollportLeft + parseScrollPadding(style.scrollPaddingLeft, clientWidth) * scale;
	const viewRight = scrollportLeft + (clientWidth - parseScrollPadding(style.scrollPaddingRight, clientWidth)) * scale;
	let caretLeft = left;
	let caretRight = Math.max(right, left + 1);
	if (caretRight - caretLeft > viewRight - viewLeft) {
		if (isRTL) caretLeft = caretRight - 1;
		else caretRight = caretLeft + 1;
	}
	let diff = 0;
	if (caretLeft < viewLeft) diff = caretLeft - viewLeft;
	else if (caretRight > viewRight) diff = caretRight - viewRight;
	if (diff === 0) return 0;
	const scrollLeft = element.scrollLeft;
	const unrounded = scrollLeft + diff / scale;
	const targetScrollLeft = diff > 0 ? Math.ceil(unrounded) : Math.floor(unrounded);
	let nextScrollLeft = isRTL ? Math.min(0, Math.max(-maxScroll, targetScrollLeft)) : Math.max(0, Math.min(maxScroll, targetScrollLeft));
	const startOffset = scrollLeft * scale;
	if (Math.abs(nextScrollLeft) < Math.abs(scrollLeft) && caretLeft + startOffset >= viewLeft && caretRight + startOffset <= viewRight) nextScrollLeft = 0;
	if (nextScrollLeft === scrollLeft) return 0;
	element.scrollLeft = nextScrollLeft;
	return (element.scrollLeft - scrollLeft) * scale;
}
/**
* The rect to scroll into view for a caret, which is a collapsed range.
* WebKit gives a collapsed range at the logical end of right to left text no
* rect at all. Then this measures the character next to the caret instead,
* and the caret is at one of its edges.
*/
function getCaretRect(range) {
	const rect = range.getBoundingClientRect();
	const { startContainer, startOffset } = range;
	if (!range.collapsed || rect.width !== 0 || rect.height !== 0 || !isDOMTextNode(startContainer) || startContainer.length === 0) return rect;
	const characterRange = range.cloneRange();
	if (startOffset > 0) characterRange.setStart(startContainer, startOffset - 1);
	else characterRange.setEnd(startContainer, 1);
	return characterRange.getBoundingClientRect();
}
/**
* Scrolls the caret into view. First it scrolls sideways, in the horizontal
* scroll containers from the caret up to and including the editor root (for
* example a code block with a long line, or a table's scroll wrapper). Then
* it scrolls vertically, in the root and its ancestors up to the window.
*
* @param selectionNode The caret's DOM node: the anchor's Text node, or its
* $getDOMSlot element for an element point. The horizontal pass starts
* there. Without it only the vertical pass runs.
*/
function scrollIntoViewIfNeeded(editor, selectionRect, rootElement, selectionNode = null) {
	const doc = getDOMOwnerDocument(rootElement);
	const defaultView = getDefaultView(doc);
	if (doc === null || defaultView === null) return;
	const rootRect = rootElement.getBoundingClientRect();
	if (selectionRect.bottom < rootRect.top) return;
	if (selectionNode !== null && selectionRect.height > 0) {
		let { left: currentLeft, right: currentRight } = selectionRect;
		let scroller = isHTMLElement(selectionNode) ? selectionNode : getParentElement(selectionNode);
		while (scroller !== null && rootElement.contains(scroller)) {
			const xOffset = scrollIntoViewHorizontally(defaultView, scroller, currentLeft, currentRight);
			currentLeft -= xOffset;
			currentRight -= xOffset;
			scroller = scroller === rootElement ? null : getParentElement(scroller);
		}
	}
	let { top: currentTop, bottom: currentBottom } = selectionRect;
	let targetTop = 0;
	let targetBottom = 0;
	let element = rootElement;
	while (element !== null) {
		const isBodyElement = element === doc.body;
		if (isBodyElement) {
			const visualViewport = defaultView.visualViewport;
			if (visualViewport) {
				const offsetTop = visualViewport.offsetTop;
				targetTop = offsetTop;
				targetBottom = offsetTop + visualViewport.height;
			} else {
				targetTop = 0;
				targetBottom = getWindow(editor).innerHeight;
			}
			const computedStyle = defaultView.getComputedStyle(doc.documentElement);
			const scrollPaddingTop = parseFloat(computedStyle.scrollPaddingTop);
			const scrollPaddingBottom = parseFloat(computedStyle.scrollPaddingBottom);
			if (isFinite(scrollPaddingTop)) targetTop += scrollPaddingTop;
			if (isFinite(scrollPaddingBottom)) targetBottom -= scrollPaddingBottom;
		} else {
			const targetRect = element === rootElement ? rootRect : element.getBoundingClientRect();
			targetTop = targetRect.top;
			targetBottom = targetRect.bottom;
		}
		let diff = 0;
		if (currentTop < targetTop) diff = -(targetTop - currentTop);
		else if (currentBottom > targetBottom) diff = currentBottom - targetBottom;
		if (diff !== 0) {
			if (isBodyElement) defaultView.scrollBy(0, diff);
			else {
				const scrollTop = element.scrollTop;
				element.scrollTop += diff;
				const yOffset = element.scrollTop - scrollTop;
				currentTop -= yOffset;
				currentBottom -= yOffset;
			}
		}
		if (isBodyElement) break;
		element = getParentElement(element);
	}
}
/** Returns true if the given tag has been added to the current update via $addUpdateTag. */
function $hasUpdateTag(tag) {
	return getActiveEditor()._updateTags.has(tag);
}
/** Adds a tag to the current update, which can be read by update listeners and $hasUpdateTag. */
function $addUpdateTag(tag) {
	errorOnReadOnly();
	getActiveEditor()._updateTags.add(tag);
}
/**
* Add a function to run after the current update. This will run after any
* `onUpdate` function already supplied to `editor.update()`, as well as any
* functions added with previous calls to `$onUpdate`.
*
* @param updateFn The function to run after the current update.
*/
function $onUpdate(updateFn) {
	errorOnReadOnly();
	getActiveEditor()._deferred.push(updateFn);
}
function $maybeMoveChildrenSelectionToParent(parentNode) {
	const selection = $getSelection();
	if (!$isRangeSelection(selection) || !$isElementNode(parentNode)) return selection;
	const { anchor, focus } = selection;
	const anchorNode = anchor.getNode();
	const focusNode = focus.getNode();
	if ($hasAncestor(anchorNode, parentNode)) anchor.set(parentNode.__key, 0, "element");
	if ($hasAncestor(focusNode, parentNode)) focus.set(parentNode.__key, 0, "element");
	return selection;
}
/** Returns true if targetNode is an ancestor of child by walking up the parent chain. */
function $hasAncestor(child, targetNode) {
	let parent = child.getParent();
	while (parent !== null) {
		if (parent.is(targetNode)) return true;
		parent = parent.getParent();
	}
	return false;
}
function getDefaultView(domElem) {
	const ownerDoc = getDOMOwnerDocument(domElem);
	return ownerDoc ? ownerDoc.defaultView : null;
}
function getWindow(editor) {
	const windowObj = editor._window;
	if (windowObj === null) invariant(false, "window object not found");
	return windowObj;
}
/** Returns true if the given node is an inline ElementNode or an inline DecoratorNode. */
function $isInlineElementOrDecoratorNode(node) {
	return $isElementNode(node) && node.isInline() || $isDecoratorNode(node) && node.isInline();
}
/** Returns the given node itself (if it is a slot boundary) or its nearest ancestor that is a RootNode, ShadowRootNode, or slot boundary. */
function $getNearestRootOrShadowRoot(node) {
	let current = node.getLatest();
	while (current !== null) {
		if ($getSlotHostKey(current) !== null && $isElementNode(current)) return current;
		const parent = current.getParentOrThrow();
		if ($isRootOrShadowRoot(parent)) return parent;
		current = parent;
	}
	return current;
}
/** Returns true if the given node is an ElementNode whose isShadowRoot() returns true. */
function $isShadowRootNode(node) {
	return $isElementNode(node) && node.isShadowRoot();
}
/** Returns true if the given node is a RootNode or a ShadowRootNode. */
function $isRootOrShadowRoot(node) {
	return $isRootNode(node) || $isShadowRootNode(node);
}
/**
* Returns a shallow clone of node with a new key. All properties of the node
* will be copied to the new node (by `clone` and then `afterCloneFrom`),
* except those related to parent/sibling/child
* relationships in the `EditorState`. This means that the copy must be
* separately added to the document, and it will not have any children.
*
* @param node - The node to be copied.
* @param skipReset - If true (default false) skip the call to resetOnCopyNodeFrom
* @returns The copy of the node.
*/
function $copyNode(node, skipReset = false) {
	const copy = node.constructor.clone(node, INTERNAL_SKIP_AFTER_CLONE_FROM);
	$setNodeKey(copy, null);
	copy.afterCloneFrom(node);
	if (!skipReset) copy.resetOnCopyNodeFrom(node);
	return copy;
}
/** Applies any registered node replacement for the given node's type, returning the replacement node or the original if none is registered. */
function $applyNodeReplacement(node) {
	const editor = getActiveEditor();
	const nodeType = node.getType();
	const registeredNode = getRegisteredNode(editor, nodeType);
	invariant(registeredNode !== void 0, "$applyNodeReplacement node %s with type %s must be registered to the editor. You can do this by passing the node class via the \"nodes\" array in the editor config.", node.constructor.name, nodeType);
	const { replace, replaceWithKlass } = registeredNode;
	if (replace !== null) {
		const replacementNode = replace(node);
		const replacementNodeKlass = replacementNode.constructor;
		if (replaceWithKlass !== null) invariant(replacementNode instanceof replaceWithKlass, "$applyNodeReplacement failed. Expected replacement node to be an instance of %s with type %s but returned %s with type %s from original node %s with type %s", replaceWithKlass.name, replaceWithKlass.getType(), replacementNodeKlass.name, replacementNodeKlass.getType(), node.constructor.name, nodeType);
		else invariant(replacementNode instanceof node.constructor && replacementNodeKlass !== node.constructor, "$applyNodeReplacement failed. Ensure replacement node %s with type %s is a subclass of the original node %s with type %s.", replacementNodeKlass.name, replacementNodeKlass.getType(), node.constructor.name, nodeType);
		invariant(replacementNode.__key !== node.__key, "$applyNodeReplacement failed. Ensure that the key argument is *not* used in your replace function (from node %s with type %s to node %s with type %s), Node keys must never be re-used except by the static clone method.", node.constructor.name, nodeType, replacementNodeKlass.name, replacementNodeKlass.getType());
		return replacementNode;
	}
	return node;
}
function errorOnInsertTextNodeOnRoot(node, insertNode) {
	if ($isRootNode(node.getParent()) && !$isElementNode(insertNode) && !$isDecoratorNode(insertNode)) invariant(false, "Only element or decorator nodes can be inserted in to the root node");
}
function $getNodeByKeyOrThrow(key) {
	const node = $getNodeByKey(key);
	if (node === null) invariant(false, "Expected node with key %s to exist but it's not in the nodeMap.", key);
	return node;
}
function $createBlockCursorElement(editorConfig) {
	const theme = editorConfig.theme;
	const element = $getDocument().createElement("div");
	element.contentEditable = "false";
	element.setAttribute("data-lexical-cursor", "true");
	let blockCursorTheme = theme.blockCursor;
	if (blockCursorTheme !== void 0) {
		if (typeof blockCursorTheme === "string") blockCursorTheme = theme.blockCursor = normalizeClassNames(blockCursorTheme);
		if (blockCursorTheme !== void 0) element.classList.add(...blockCursorTheme);
	}
	return element;
}
/**
* Returns true if the given node needs a block cursor given an adjacent selection,
* the node must be non-inline and one of:
* - DecoratorNode
* - ShadowRootNode with a parent that is not also a ShadowRootNode
* - An ElementNode that can't be empty
*/
function $needsBlockCursorBeside(node) {
	if (!node || node.isInline()) return false;
	if ($isDecoratorNode(node)) return true;
	if ($isElementNode(node)) {
		if (node.isShadowRoot()) {
			const parent = node.getParent();
			return !($isElementNode(parent) && parent.isShadowRoot());
		}
		return !node.canBeEmpty();
	}
	return false;
}
function removeDOMBlockCursorElement(blockCursorElement, editor, rootElement) {
	rootElement.style.removeProperty("caret-color");
	editor._blockCursorElement = null;
	const parentElement = blockCursorElement.parentElement;
	if (parentElement !== null) parentElement.removeChild(blockCursorElement);
}
function $updateDOMBlockCursorElement(editor, rootElement, nextSelection) {
	let blockCursorElement = editor._blockCursorElement;
	if ($isRangeSelection(nextSelection) && nextSelection.isCollapsed() && nextSelection.anchor.type === "element" && rootElement.contains(getActiveElement(rootElement))) {
		const anchor = nextSelection.anchor;
		const elementNode = anchor.getNode();
		const offset = anchor.offset;
		const elementNodeSize = elementNode.getChildrenSize();
		let isBlockCursor = false;
		let insertBeforeElement = null;
		if (offset === elementNodeSize) {
			if ($needsBlockCursorBeside(elementNode.getChildAtIndex(offset - 1))) isBlockCursor = true;
		} else {
			const child = elementNode.getChildAtIndex(offset);
			if (child !== null && $needsBlockCursorBeside(child)) {
				isBlockCursor = true;
				insertBeforeElement = editor.getElementByKey(child.__key);
			}
		}
		if (isBlockCursor) {
			const elementDOM = $getDOMSlot(elementNode, editor.getElementByKey(elementNode.__key), editor).element;
			if (blockCursorElement === null) editor._blockCursorElement = blockCursorElement = $createBlockCursorElement(editor._config);
			rootElement.style.caretColor = "transparent";
			if (insertBeforeElement === null) elementDOM.appendChild(blockCursorElement);
			else elementDOM.insertBefore(blockCursorElement, insertBeforeElement);
			return;
		}
	}
	if (blockCursorElement !== null) removeDOMBlockCursorElement(blockCursorElement, editor, rootElement);
}
/**
* Returns the selection for the given window, or the global window if null.
* Will return null if {@link CAN_USE_DOM} is false.
*
* @param targetWindow The window to get the selection from
* @returns a Selection or null
*/
function getDOMSelection(targetWindow) {
	return !CAN_USE_DOM ? null : (targetWindow || window).getSelection();
}
/**
* Returns the selection for the defaultView of the ownerDocument of given EventTarget.
*
* @param eventTarget The node to get the selection from
* @returns a Selection or null
*/
function getDOMSelectionFromTarget(eventTarget) {
	const defaultView = getDefaultView(eventTarget);
	return defaultView ? defaultView.getSelection() : null;
}
/**
* @param node A value that may be a DOM ShadowRoot.
* @returns True if node is a DOM ShadowRoot (an open or closed shadow tree
*   root), false otherwise. A ShadowRoot is a DocumentFragment with a host.
*
* @experimental Shape may change as shadow DOM support stabilizes.
*/
function isDOMShadowRoot(node) {
	return isDocumentFragment(node) && "host" in node;
}
/**
* Collects the DOM ShadowRoots between `node` and its document, innermost
* first. Returns an empty array when `node` is in the light DOM (its root is
* the Document) or is detached.
*
* Uses the standard {@link https://developer.mozilla.org/docs/Web/API/Node/getRootNode | Node.getRootNode}
* and `ShadowRoot.host` platform APIs to walk out of any nested shadow trees.
*
* @param node The DOM node to start from (typically the editor root element).
* @returns The enclosing ShadowRoots, innermost first.
*
* @experimental Shape may change as shadow DOM support stabilizes.
*/
var EMPTY_SHADOW_ROOTS = [];
function getDOMShadowRoots(node) {
	const root = node.getRootNode();
	if (root === node || !isDOMShadowRoot(root)) return EMPTY_SHADOW_ROOTS;
	const shadowRoots = [root];
	let current = root.host;
	for (;;) {
		const nextRoot = current.getRootNode();
		if (nextRoot === current || !isDOMShadowRoot(nextRoot)) break;
		shadowRoots.push(nextRoot);
		current = nextRoot.host;
	}
	return shadowRoots;
}
/**
* Walks `root` and every open shadow root nested inside it, yielding each
* element that matches `selector`. `querySelectorAll` does not pierce
* shadow boundaries on its own; this descent does.
*
* @internal
*/
function* findAllLexicalElementsDeep(initialRoot) {
	const roots = [initialRoot];
	let root;
	while (root = roots.pop()) {
		yield* root.querySelectorAll("[data-lexical-editor=\"true\"]");
		const walker = (isDOMDocumentNode(root) ? root : root.ownerDocument).createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
		let el;
		while (el = walker.nextNode()) if (el.shadowRoot) roots.push(el.shadowRoot);
	}
}
/**
* Resolves the document that hosts an editor's root element, falling
* back to the global `document` when the editor isn't mounted. Use this
* over `editor.getRootElement()?.ownerDocument ?? document` so iframe /
* shadow-mounted editors land in the right realm.
*
* @internal
*/
function getRootOwnerDocument(rootElement) {
	return rootElement !== null ? rootElement.ownerDocument : document;
}
/**
* Returns the {@link Document} that owns the active editor's root element.
* Falls back to `globalThis.document` when there is no active editor (e.g.
* a node method such as `createDOM` / `exportDOM` is invoked headlessly,
* outside of `editor.update()` / `editor.read()`), or when the active
* editor has no root element (e.g. headless mode with
* {@link @lexical/headless!withDOM | withDOM}).
*
* Use this inside `createDOM`, `updateDOM`, and `exportDOM` instead of the
* bare `document` global so the node works correctly when the editor lives
* inside a Shadow DOM or a cross-origin `<iframe>`.
*
* Unlike most `$`-prefixed helpers, this does NOT require an ambient active
* editor: it must remain callable from `createDOM` / `exportDOM`, which are
* public methods that consumers may legitimately call while serializing
* nodes headlessly. Throwing here would silently break every node whose DOM
* methods were migrated off the bare `document` global.
*/
function $getDocument() {
	const editor = internalGetActiveEditor();
	return getRootOwnerDocument(editor !== null ? editor._rootElement : null);
}
/**
* Resolves a DOM Selection's range through any DOM ShadowRoots enclosing
* `rootElement`, using the standard
* {@link https://developer.mozilla.org/docs/Web/API/Selection/getComposedRanges | Selection.getComposedRanges}
* platform API.
*
* When a selection is inside a shadow tree the browser retargets
* `Selection.getRangeAt`/`anchorNode`/`focusNode` to the shadow host, which
* hides the real nodes Lexical needs to resolve. Passing the enclosing shadow
* roots to `getComposedRanges` returns the un-retargeted boundary points as a
* {@link https://developer.mozilla.org/docs/Web/API/StaticRange | StaticRange}
* (in tree order, i.e. start before end).
*
* @returns The composed StaticRange, or `null` when `rootElement` is in the
*   light DOM, the platform does not implement `getComposedRanges`, or there
*   is no selection.
*
* @experimental Shape may change as shadow DOM support stabilizes.
*/
function getComposedStaticRange(domSelection, rootElement) {
	if (rootElement === null || typeof domSelection.getComposedRanges !== "function") return null;
	const shadowRoots = getDOMShadowRoots(rootElement);
	if (shadowRoots.length === 0) return null;
	const getComposedRanges = domSelection.getComposedRanges;
	try {
		const dictRange = getComposedRanges.call(domSelection, { shadowRoots })[0];
		if (dictRange !== void 0) return dictRange;
	} catch (_error) {}
	try {
		const variadicRange = getComposedRanges.apply(domSelection, shadowRoots)[0];
		if (variadicRange !== void 0) return variadicRange;
	} catch (_error) {}
	return null;
}
/**
* Returns a live DOM Range for the Selection, resolved through any DOM
* ShadowRoots enclosing `rootElement`. Inside a shadow tree
* `Selection.getRangeAt(0)` is retargeted to the shadow host, so this builds a
* Range from the composed boundary points instead (see
* {@link getComposedStaticRange}); in the light DOM it returns
* `getRangeAt(0)` unchanged. Use this instead of `getRangeAt(0)` when the
* Range is needed for layout (e.g. `getBoundingClientRect`), which a
* StaticRange cannot provide.
*
* @returns A live Range, or null when the selection has no ranges.
*
* @experimental Shape may change as shadow DOM support stabilizes.
*/
function getDOMSelectionRange(domSelection, rootElement) {
	const staticRange = getComposedStaticRange(domSelection, rootElement);
	if (staticRange !== null) {
		const range = staticRangeToLiveRange(staticRange);
		if (range !== null) return range;
	}
	return domSelection.rangeCount > 0 ? domSelection.getRangeAt(0) : null;
}
/**
* Resolves a DOM Selection's anchor/focus boundary points through any DOM
* ShadowRoots enclosing `rootElement`. Inside a shadow tree the boundary
* points come from {@link getComposedStaticRange} mapped back onto
* anchor/focus with the standard
* {@link https://developer.mozilla.org/docs/Web/API/Selection/direction | Selection.direction};
* in the light DOM (or when `getComposedRanges` is unavailable) the Selection's
* own anchorNode/focusNode are already correct, so the Selection is returned
* as-is (it satisfies {@link DOMSelectionBoundaryPoints}).
*
* Use this instead of reading `Selection.anchorNode`/`focusNode` directly,
* which are retargeted to the shadow host inside a shadow tree.
*
* @remarks
* The two return paths have different read semantics:
* - light DOM: the return aliases `domSelection`, so subsequent reads
*   reflect any post-call selection changes. The aliasing is intentional;
*   each `Selection` property read forces a synchronous style/layout
*   recalculation, so `$updateDOMSelection` defers these reads until they
*   are actually needed.
* - shadow DOM: the return is a snapshot taken at call time, including
*   `direction`. If a future engine ships `getComposedRanges` without
*   `Selection.direction` (no current shipping configuration matches),
*   the snapshot's `direction` is `undefined` and anchor/focus default
*   to the StaticRange's tree order — a backward selection will appear
*   forward.
*
* Read the four points immediately after the call, or compare identity
* via `points === domSelection` to detect when the return aliases
* `domSelection`, rather than caching the returned reference across
* selection mutations.
*
* @experimental Shape may change as shadow DOM support stabilizes.
*/
function getDOMSelectionPoints(domSelection, rootElement) {
	const staticRange = getComposedStaticRange(domSelection, rootElement);
	if (staticRange === null) return domSelection;
	return staticRangeToPoints(staticRange, readDirection(domSelection));
}
/**
* Resolves the live DOM Range (for layout reads like `getBoundingClientRect`)
* and the anchor/focus boundary points in one pass, sharing a single
* {@link getComposedStaticRange} read rather than computing it twice as a
* call to {@link getDOMSelectionRange} followed by {@link getDOMSelectionPoints}
* would. Use this at sites that need both shapes from the same selection.
*
* @returns The composed Range plus the boundary points; the Range is null
*   when the selection has no ranges.
*
* @experimental Shape may change as shadow DOM support stabilizes.
*/
function getDOMSelectionRangeAndPoints(domSelection, rootElement) {
	const staticRange = getComposedStaticRange(domSelection, rootElement);
	if (staticRange === null) return {
		points: domSelection,
		range: domSelection.rangeCount > 0 ? domSelection.getRangeAt(0) : null
	};
	const range = staticRangeToLiveRange(staticRange) ?? (domSelection.rangeCount > 0 ? domSelection.getRangeAt(0) : null);
	return {
		points: staticRangeToPoints(staticRange, readDirection(domSelection)),
		range
	};
}
function staticRangeToLiveRange(staticRange) {
	const doc = staticRange.startContainer.ownerDocument;
	if (doc === null) return null;
	const range = doc.createRange();
	try {
		range.setStart(staticRange.startContainer, staticRange.startOffset);
		range.setEnd(staticRange.endContainer, staticRange.endOffset);
		return range;
	} catch (_error) {
		return null;
	}
}
function staticRangeToPoints(staticRange, direction) {
	const { startContainer, startOffset, endContainer, endOffset } = staticRange;
	return direction === "backward" ? {
		anchorNode: endContainer,
		anchorOffset: endOffset,
		direction,
		focusNode: startContainer,
		focusOffset: startOffset
	} : {
		anchorNode: startContainer,
		anchorOffset: startOffset,
		direction,
		focusNode: endContainer,
		focusOffset: endOffset
	};
}
function readDirection(domSelection) {
	return domSelection.direction;
}
/**
* Returns the focused element within the same Document or ShadowRoot as
* `node`, using the standard `DocumentOrShadowRoot.activeElement`.
*
* Unlike `document.activeElement` — which is retargeted to the outermost
* shadow host when focus is inside a shadow tree — this returns the focused
* element within `node`'s own tree (e.g. the editor's contentEditable when it
* lives inside a shadow root).
*
* @param node A node whose tree's active element is wanted.
* @returns The active element, or null.
*
* @experimental Shape may change as shadow DOM support stabilizes.
*/
function getActiveElement(node) {
	const root = node.getRootNode();
	return isDOMDocumentNode(root) || isDOMShadowRoot(root) ? root.activeElement : null;
}
/**
* Descends from `root.activeElement` through nested open ShadowRoots to the
* deepest focused element. `document.activeElement` only reports the outermost
* shadow host; this walks into the shadow trees via `ShadowRoot.activeElement`
* to find the element that actually has focus.
*
* @param root The Document or ShadowRoot to start from.
* @returns The deepest active element, or null.
*
* @experimental Shape may change as shadow DOM support stabilizes.
*/
function getActiveElementDeep(root) {
	let active = root.activeElement;
	while (active !== null && active.shadowRoot !== null) {
		const inner = active.shadowRoot.activeElement;
		if (inner === null) break;
		active = inner;
	}
	return active;
}
/**
* Returns the un-retargeted event target — the real element the user
* interacted with — for events observed by a listener above an enclosing
* DOM shadow root. `Event.target` is retargeted to the outermost shadow
* host in that case, hiding the actual element; `composedPath()[0]`
* returns the original target for `composed: true` events (most
* user-agent UI events: click, mousedown, pointerdown, focusin, etc.).
* Falls back to `event.target` when `composedPath` is unavailable or
* returns an empty array (e.g. the event has already finished
* dispatching).
*
* Pairs with the shadow-aware helpers above
* ({@link getDOMSelectionPoints}, {@link getActiveElement}) for the
* event side of the shadow boundary — useful when an
* `Element.contains(target)` check needs to test against an editor root
* inside a shadow tree.
*
* @param event The dispatched event.
* @returns The un-retargeted target, or null when the event has none.
*
* @experimental Shape may change as shadow DOM support stabilizes.
*/
function getComposedEventTarget(event) {
	const target = event.target;
	if (target !== null && isHTMLElement(target) && target.shadowRoot !== null && typeof event.composedPath === "function") {
		const path = event.composedPath();
		if (path.length > 0) return path[0];
	}
	return target;
}
/** Splits an ElementNode at the given child offset, returning [original, newCopy]. The original is mutated (children after offset moved out); the first element may be null per the return type contract. Recursively splits ancestors up to the nearest root or shadow root. */
function $splitNode(node, offset) {
	let startNode = node.getChildAtIndex(offset);
	if (startNode == null) startNode = node;
	invariant(!$isRootOrShadowRoot(node), "Can not call $splitNode() on root element");
	const recurse = (currentNode) => {
		const parent = currentNode.getParentOrThrow();
		const isParentRoot = $isRootOrShadowRoot(parent);
		const nodeToMove = currentNode === startNode && !isParentRoot ? currentNode : $copyNode(currentNode);
		if (isParentRoot) {
			invariant($isElementNode(currentNode) && $isElementNode(nodeToMove), "Children of a root must be ElementNode");
			currentNode.insertAfter(nodeToMove);
			return [
				currentNode,
				nodeToMove,
				nodeToMove
			];
		} else {
			const [leftTree, rightTree, newParent] = recurse(parent);
			const nextSiblings = currentNode.getNextSiblings();
			newParent.append(nodeToMove, ...nextSiblings);
			return [
				leftTree,
				rightTree,
				nodeToMove
			];
		}
	};
	const [leftTree, rightTree] = recurse(startNode);
	return [leftTree, rightTree];
}
/**
* @param x - The element being tested
* @returns Returns true if x is an HTML anchor tag, false otherwise
*/
function isHTMLAnchorElement(x) {
	return isHTMLElement(x) && x.tagName === "A";
}
/**
* @param x - The element being tested
* @returns Returns true if x is an HTML `<tr>` element, false otherwise
*/
function isHTMLTableRowElement(x) {
	return isHTMLElement(x) && x.tagName === "TR";
}
/**
* @param x - The element being tested
* @returns Returns true if x is an HTML `<td>` or `<th>` element, false
*   otherwise
*/
function isHTMLTableCellElement(x) {
	return isHTMLElement(x) && (x.tagName === "TD" || x.tagName === "TH");
}
/**
* @param x - The element being tested
* @returns Returns true if x is an HTML element, false otherwise.
*/
function isHTMLElement(x) {
	return isDOMNode(x) && x.nodeType === 1;
}
/**
* @param x - The element being tested
* @returns Returns true if x is a DOM Node, false otherwise.
*/
function isDOMNode(x) {
	return typeof x === "object" && x !== null && "nodeType" in x && typeof x.nodeType === "number";
}
/**
* @param x - The element being testing
* @returns Returns true if x is a document fragment, false otherwise.
*/
function isDocumentFragment(x) {
	return isDOMNode(x) && x.nodeType === 11;
}
var INLINE_TAG_RE = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|mark|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var|#text)$/i;
/**
*
* @param node - the Dom Node to check
* @returns if the Dom Node is an inline node
*/
function isInlineDomNode(node) {
	return isHTMLElement(node) && node.style.display.startsWith("inline") ? true : INLINE_TAG_RE.test(node.nodeName);
}
var BLOCK_TAG_RE = /^(address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|td|tfoot|ul|video)$/i;
/**
*
* @param node - the Dom Node to check
* @returns if the Dom Node is a block node
*/
function isBlockDomNode(node) {
	return isHTMLElement(node) && node.style.display.startsWith("inline") ? false : BLOCK_TAG_RE.test(node.nodeName);
}
/**
* @internal
*
* This function is for internal use of the library.
* Please do not use it as it may change in the future.
*
* This function returns true for a DecoratorNode that is not inline OR
* an ElementNode that is:
* - not a root or shadow root
* - not inline
* - can't be empty
* - has no children or an inline first child
*/
function INTERNAL_$isBlock(node) {
	if ($isDecoratorNode(node) && !node.isInline()) return true;
	if (!$isElementNode(node) || $isRootOrShadowRoot(node)) return false;
	const firstChild = node.getFirstChild();
	const isLeafElement = firstChild === null || $isLineBreakNode(firstChild) || $isTextNode(firstChild) || firstChild.isInline();
	return !node.isInline() && node.canBeEmpty() !== false && isLeafElement;
}
/**
* Utility function for accessing current active editor instance.
* @returns Current active editor
*/
function $getEditor() {
	return getActiveEditor();
}
/**
* @experimental
*
* Read the editor's `$getDOMSlot` configuration (defaulting to the base
* implementation when no override is registered via {@link DOMRenderExtension}).
* Cross-package consumers (`@lexical/utils`, `@lexical/react`) use this to
* route selection / DOM lookups through extension-configured slots.
*/
function $getEditorDOMRenderConfig(editor = $getEditor()) {
	return editor._config.dom || DEFAULT_EDITOR_DOM_CONFIG;
}
/**
* @experimental
*
* Resolve the DOM slot for a node through the configured `$getDOMSlot` hook,
* narrowing the return type via {@link DOMSlotForNode}: for an `ElementNode`
* the result is an {@link ElementDOMSlot} (with children-management methods),
* for non-Element nodes the base {@link DOMSlot} pointing at the keyed DOM.
*
* Invariants if an extension override returns a slot that doesn't match the
* expected narrow type for the node (extension contract violation).
*/
function $getDOMSlot(node, dom, editor = $getEditor()) {
	const slot = $getEditorDOMRenderConfig(editor).$getDOMSlot(node, dom, editor);
	if ($isElementNode(node)) invariant($isElementDOMSlot(slot), "$getDOMSlot: expected ElementDOMSlot for ElementNode (key %s type %s)", node.getKey(), node.getType());
	return slot;
}
/**
* @internal
*
* Returns the scaffolding container element that `host`'s named slot renders
* into, or null if the slot is empty or not yet rendered. The container is the
* parent of the slotted node's DOM, resolved by key so it is found wherever it
* sits — the reconciler parks it as a hidden placeholder in the host DOM, and
* an explicit mount ({@link mountSlotContainer}) may relocate it; this lookup
* still resolves it after that relocation. Editor-time analog of the
* reconciler's internal `$slotContainerForKey`, which resolves the same
* container from the reconcile-time DOM map instead of
* `editor.getElementByKey`.
*/
function $getSlotContainer(host, name, editor = $getEditor()) {
	const slot = $getSlot(host, name);
	if (slot === null) return null;
	const slotDom = editor.getElementByKey(slot.getKey());
	return slotDom !== null ? slotDom.parentElement : null;
}
/**
* @experimental
*
* Attach a host's named-slot container to `target` and make it visible.
* The reconciler renders every slot subtree synchronously into a hidden
* (`display: 'none'`) placeholder container parked slots-first in the host
* DOM; nothing is visible until the host explicitly attaches the container
* somewhere — mirroring how `getDOMSlot` gives an element control over where
* its linked-list children render. This helper moves the container into
* `target` (a no-op when it is already there, so mounting in place just
* reveals it) and clears the inline `display` so the container renders as a
* normal block that stylesheets may restyle. It deliberately does NOT use
* `display: 'contents'`: Chromium cannot reliably edit inside a boxless
* contenteditable subtree (caret hit-testing resolves clicks to a
* neighboring box and native text insertion is dropped).
*
* Idempotent and framework-independent: lexical-react's `useLexicalSlotRef`
* wraps it, and a node class or extension can call it directly (e.g. from a
* mutation listener) to control slot placement without React.
*
* @returns the container, or null when the slot (or its DOM) does not exist
* yet — e.g. before the host's first reconciliation.
*/
function mountSlotContainer(editor, nodeKey, slotName, target) {
	const container = editor.read("latest", () => {
		const host = $getNodeByKey(nodeKey);
		return host !== null ? $getSlotContainer(host, slotName, editor) : null;
	});
	if (container !== null) {
		if (container.parentElement !== target) target.appendChild(container);
		container.style.display = "";
	}
	return container;
}
/**
* @experimental
*
* Reverse of {@link mountSlotContainer}: hide `container` again and park it
* back in the host's DOM as the leading hidden placeholder, where the
* reconciler manages it. Call when the mount target goes away while the host
* remains (e.g. chrome unmount) so the slot subtree stays in the document
* instead of leaving with the detached target.
*/
function unmountSlotContainer(editor, nodeKey, container) {
	container.style.display = "none";
	const hostDom = editor.getElementByKey(nodeKey);
	if (hostDom !== null && container.parentElement !== hostDom) hostDom.insertBefore(container, hostDom.firstChild);
}
/**
* @experimental
*
* Type guard narrowing a {@link DOMSlot} to an {@link ElementDOMSlot}, which
* exposes children-management methods like `insertChild` and the managed
* line-break helpers.
*/
function $isElementDOMSlot(slot) {
	return slot instanceof ElementDOMSlot;
}
/**
* @experimental
*
* Resolve the actual text DOM (`Text`) for a `TextNode` through the
* configured `$getDOMSlot` hook. Unlike the plain {@link getDOMTextNode}
* which descends the first child chain from a raw element, this routes
* through the slot so an extension wrapping the text node's keyed DOM
* (e.g. one that injects a `contentEditable=false` sibling before the
* text) still points at the correct content element.
*/
function $getDOMTextNode(node, dom, editor = $getEditor()) {
	return getDOMTextNode($getDOMSlot(node, dom, editor).element);
}
/**
* @internal
* Compute a cached Map of node type to nodes for a frozen EditorState
*/
var cachedNodeMaps = /* @__PURE__ */ new WeakMap();
var EMPTY_TYPE_TO_NODE_MAP = /* @__PURE__ */ new Map();
function getCachedTypeToNodeMap(editorState) {
	if (!editorState._readOnly && editorState.isEmpty()) return EMPTY_TYPE_TO_NODE_MAP;
	invariant(editorState._readOnly, "getCachedTypeToNodeMap called with a writable EditorState");
	let typeToNodeMap = cachedNodeMaps.get(editorState);
	if (!typeToNodeMap) {
		typeToNodeMap = computeTypeToNodeMap(editorState);
		cachedNodeMaps.set(editorState, typeToNodeMap);
	}
	return typeToNodeMap;
}
/**
* @internal
* Compute a Map of node type to nodes for an EditorState
*/
function computeTypeToNodeMap(editorState) {
	const typeToNodeMap = /* @__PURE__ */ new Map();
	for (const [nodeKey, node] of editorState._nodeMap) {
		const nodeType = node.__type;
		let nodeMap = typeToNodeMap.get(nodeType);
		if (!nodeMap) {
			nodeMap = /* @__PURE__ */ new Map();
			typeToNodeMap.set(nodeType, nodeMap);
		}
		nodeMap.set(nodeKey, node);
	}
	return typeToNodeMap;
}
/**
* Returns a clone of a node using `node.constructor.clone()` followed by
* `clone.afterCloneFrom(node)`. The resulting clone must have the same key,
* parent/next/prev pointers, and other properties that are not set by
* `node.constructor.clone` (format, style, etc.). This is primarily used by
* {@link LexicalNode.getWritable} to create a writable version of an
* existing node. The clone is the same logical node as the original node,
* do not try and use this function to duplicate or copy an existing node.
*
* Does not mutate the EditorState.
* @param latestNode - The node to be cloned.
* @returns The clone of the node.
*/
function $cloneWithProperties(latestNode) {
	const mutableNode = latestNode.constructor.clone(latestNode, INTERNAL_SKIP_AFTER_CLONE_FROM);
	mutableNode.afterCloneFrom(latestNode);
	return mutableNode;
}
/**
* Returns a clone with {@link $cloneWithProperties} and then "detaches"
* it from the state by overriding its getLatest and getWritable to always
* return this. This node can not be added to an EditorState or become the
* parent, child, or sibling of another node. It is primarily only useful
* for making in-place temporary modifications to a TextNode when
* serializing a partial slice.
*
* Does not mutate the EditorState.
* @param latestNode - The node to be cloned.
* @returns The clone of the node.
*/
function $cloneWithPropertiesEphemeral(latestNode) {
	return $markEphemeral($cloneWithProperties(latestNode));
}
/** Reads the indent level from a DOM element's `data-lexical-indent` attribute or `paddingInlineStart` style, and applies it to the given ElementNode. */
function setNodeIndentFromDOM(elementDom, elementNode) {
	const indentAttr = elementDom.getAttribute("data-lexical-indent");
	if (indentAttr !== null) {
		const parsed = parseInt(indentAttr, 10);
		if (Number.isFinite(parsed) && parsed >= 0) {
			elementNode.setIndent(parsed);
			return;
		}
	}
	const indentSize = parseInt(elementDom.style.paddingInlineStart, 10) || 0;
	const indent = Math.round(indentSize / 40);
	elementNode.setIndent(indent);
}
/**
* Reads the `dir` attribute from a DOM element and applies it to the given
* ElementNode via {@link ElementNode.setDirection} when it is a valid direction
* value (`'ltr'` or `'rtl'`). Other values, including missing or empty `dir`,
* leave the node unchanged. Useful inside `importDOM` converters to preserve
* explicit text direction from imported HTML.
*
* @param node - The ElementNode to update.
* @param domNode - The source HTMLElement whose `dir` attribute is read.
* @returns The node, with its direction set when the source `dir` was valid.
*/
function $setDirectionFromDOM(node, domNode) {
	const dir = domNode.getAttribute("dir");
	return dir === "ltr" || dir === "rtl" ? node.setDirection(dir) : node;
}
/**
* Reads the `style` and CSS `textAlign` property from a DOM element
* and set format to the given ElementNode via {@link ElementNode.setFormat}
* when it is a valid alignment value {@link ElementFormatType}
* Other values, including missing or empty, leave the node unchanged.
* Useful inside `importDOM` converters to preserve explicit alignment from imported HTML.
*
* @param node - The ElementNode to update.
* @param domNode - The source HTMLElement whose `style` property is read.
* @returns The node, with its align format set when the source `style.textAlign` was valid.
*/
function $setFormatFromDOM(node, domNode) {
	const alignment = domNode.style.textAlign;
	return alignment && alignment in ELEMENT_TYPE_TO_FORMAT ? node.setFormat(alignment) : node;
}
/**
* Mark this DOM element as unmanaged by lexical's mutation observer (like
* decorator nodes are). Extensions that inject non-lexical decoration
* elements into a node's DOM should mark them so the mutation observer
* doesn't evict them as "unknown DOM children" during cleanup.
*
* Pass `{captureSelection: true}` to additionally treat the subtree's
* window selection as decorator-like, so resolution does not force-sync
* the caret out of unmanaged DOM (see {@link isDOMCapturingSelection}).
*
* @experimental
*/
function setDOMUnmanaged(elementDom, options) {
	elementDom.__lexicalUnmanaged = true;
	if (options && options.captureSelection !== void 0) elementDom.__lexicalCapturedSelection = options.captureSelection;
}
/**
* True if this DOM node was marked with {@link setDOMUnmanaged}.
*
* @experimental
*/
function isDOMUnmanaged(elementDom) {
	return elementDom.__lexicalUnmanaged === true;
}
/**
* Mark a DOM element as a named-slot editable island: set its `contentEditable`
* to follow the editor's editable state. A slot rendered inside a non-editable
* host (a decorator, or a `contentEditable=false` element shell) does not track
* the editor on its own, so its container carries an explicit `contentEditable`;
* {@link $fullReconcile} re-applies this when {@link LexicalEditor.setEditable}
* toggles. Call it for any other editable island an app attaches itself (e.g. a
* `getDOMSlot` children element rendered inside a `contentEditable=false` shell).
*
* @experimental
*/
function $markSlotEditable(element, editor = $getEditor()) {
	const editable = editor.isEditable();
	element.contentEditable = editable ? "true" : "false";
	if (editable) element.__lexicalEditor = editor;
	else delete element.__lexicalEditor;
}
/**
* True if the DOM node sits inside a subtree marked with
* `{captureSelection: true}` via {@link setDOMUnmanaged}. Walks ancestors
* so any descendant of a marked subtree (e.g. an `<input>` inside a marked
* `<div>`) reports as captured too.
*
* The walk aborts at the first DOM node that corresponds to a Lexical
* node in `editor` — that boundary is the implicit owner of the subtree's
* selection, so a captureSelection marker above it (in non-Lexical
* scaffolding around the editor) does not leak in.
*
* DecoratorNode DOM is marked with `setDOMUnmanaged({captureSelection:
* true})` by the reconciler, so decorator subtrees also report as
* captured here.
*
* @experimental
*/
function isDOMCapturingSelection(elementDom, editor) {
	let dom = elementDom;
	while (dom != null) {
		if (dom.__lexicalCapturedSelection === true) return true;
		if (isHTMLElement(dom) && dom.hasAttribute("data-lexical-slot")) return false;
		if (getNodeKeyFromDOMNode(dom, editor) !== void 0) return false;
		dom = getParentElement(dom);
	}
	return false;
}
/**
* @internal
*
* Object.hasOwn ponyfill
*/
/**
* @internal
*/
function hasOwnStaticMethod(klass, k) {
	return hasOwnKey(klass, k) && klass[k] !== LexicalNode[k];
}
/** @internal */
function isAbstractNodeClass(klass) {
	if (!(klass === LexicalNode || klass.prototype instanceof LexicalNode)) {
		let ownNodeType = "<unknown>";
		let version = "<unknown>";
		try {
			ownNodeType = klass.getType();
		} catch (_err) {}
		try {
			if (LexicalEditor.version) version = JSON.parse(LexicalEditor.version);
		} catch (_err) {}
		invariant(false, "%s (type %s) does not subclass LexicalNode from the lexical package used by this editor (version %s). All lexical and @lexical/* packages used by an editor must have identical versions. If you suspect the version does match, then the problem may be caused by multiple copies of the same lexical module (e.g. both esm and cjs, or included directly in multiple entrypoints).", klass.name, ownNodeType, version);
	}
	return klass === DecoratorNode || klass === ElementNode || klass === LexicalNode;
}
var NODE_CLASS_CACHE = /* @__PURE__ */ new WeakMap();
/**
* The cache record for a node class, building it (and injecting the class's
* synthesized statics) on first use.
*/
function getNodeClassRecord(klass) {
	const cached = NODE_CLASS_CACHE.get(klass);
	return cached !== void 0 ? cached : buildNodeClassRecord(klass);
}
/**
* A class's compiled tables. {@link buildNodeClassRecord} fills them before it
* returns, so the one way to find them missing is to serialize a node of the
* class from inside its own `$config()`.
*/
function getCompiled(record) {
	const { compiled } = record;
	invariant(compiled !== void 0, "%s is still being registered: a $config() must not serialize a node of its own class", record.config.klass.name);
	return compiled;
}
var SYNTHESIZED_GET_TYPE = Symbol("lexical.synthesizedGetType");
var EMPTY_SETTERS = [];
/**
* How `klass` reaches one direction of a serialized property: the
* {@link SchemaField} unchanged when the direct field access holds, and the
* name of the accessor it stands in for when it does not.
*
* A `SchemaField` that names a `method` is saying the two are equivalent *for
* the class that declared it*. A subclass that overrides that method has said
* otherwise, and it wins: before the property had a schema both JSON methods
* went through the accessor, so overriding one changed the node's
* serialization, and compiling the accessor away would silently take that back.
*
* The comparison resolves through each prototype chain, so it catches an
* override anywhere between the declaring class and this one.
*
* `conventional` is the `get<Prop>`/`set<Prop>` name for this direction, used
* when the field names no `method` of its own — which is the common case, and
* why nearly every declaration can leave it out. A class that has no such
* method defers to nothing, because both prototypes then resolve `undefined`
* and compare equal; there is no separate way to say "bypass the accessor",
* and deliberately so: a subclass that overrode one always meant to be asked.
*
* Shared with the codegen in `scripts/generate-node-json.mjs`, which has to
* make the identical choice or its literal would describe a different node.
*
* @internal
*/
function resolveSchemaField(klass, key, accessor, conventional) {
	const method = accessor.method === void 0 ? conventional : accessor.method;
	const declaringKlass = getComposedSchema(klass).declaredBy.get(key);
	if (declaringKlass === void 0) return accessor;
	const prototype = klass.prototype;
	const declared = declaringKlass.prototype;
	return isUnchangedFrom(prototype, declared, method) && isUnchangedFrom(prototype, declared, conventional) ? accessor : method;
}
/** Whether `klass` inherits `name` from the class that declared the property. */
function isUnchangedFrom(prototype, declared, name) {
	return prototype[name] === declared[name];
}
/**
* The default setter name for a serialized property, e.g. `foo` → `setFoo`.
*
* Exported for the same reason {@link resolveSchemaField} is: the codegen in
* `scripts/generate-node-json.mjs` has to derive the identical name, and a
* second copy of the rule is a second thing that can drift.
*
* @internal
*/
function defaultSetterName(key) {
	return `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}
/**
* The default getter name for a serialized property, e.g. `foo` → `getFoo`.
*
* @see {@link defaultSetterName}
* @internal
*/
function defaultGetterName(key) {
	return `get${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}
var EMPTY_COMPOSED_SCHEMA = {
	declaredBy: /* @__PURE__ */ new Map(),
	fields: /* @__PURE__ */ new Map(),
	fieldsBaseFirst: [],
	fieldsDerivedFirst: [],
	flatStates: []
};
function composeSchema(klass) {
	const fieldGroups = [];
	const groupKlasses = [];
	const stateGroups = [];
	for (const { klass: currentKlass, ownNodeConfig } of iterStaticNodeConfigChain(klass)) {
		const json = ownNodeConfig && ownNodeConfig.json;
		groupKlasses.push(currentKlass);
		fieldGroups.push(json && json.meta.kind === "node" ? Object.entries(json.meta.fields) : []);
		const flat = [];
		if (ownNodeConfig && ownNodeConfig.stateConfigs) {
			for (const required of ownNodeConfig.stateConfigs) if ("stateConfig" in required && required.flat) flat.push(required.stateConfig);
		}
		stateGroups.push(flat);
	}
	const derivedFirst = /* @__PURE__ */ new Map();
	for (let i = 0; i < fieldGroups.length; i++) for (const [key, schema] of fieldGroups[i]) if (!derivedFirst.has(key)) derivedFirst.set(key, schema);
	const baseFirst = /* @__PURE__ */ new Map();
	const declaredBy = /* @__PURE__ */ new Map();
	const flatStates = /* @__PURE__ */ new Map();
	for (let i = fieldGroups.length - 1; i >= 0; i--) {
		for (const [key, schema] of fieldGroups[i]) {
			const winner = derivedFirst.get(key);
			if (winner !== void 0 && !baseFirst.has(key)) baseFirst.set(key, winner);
			if (winner !== void 0 && schema === winner && !declaredBy.has(key)) declaredBy.set(key, groupKlasses[i]);
		}
		for (const stateConfig of stateGroups[i]) if (!flatStates.has(stateConfig.key)) flatStates.set(stateConfig.key, stateConfig);
	}
	return derivedFirst.size === 0 && flatStates.size === 0 ? EMPTY_COMPOSED_SCHEMA : {
		declaredBy,
		fields: baseFirst,
		fieldsBaseFirst: [...baseFirst],
		fieldsDerivedFirst: [...derivedFirst],
		flatStates: [...flatStates.values()]
	};
}
/**
* The composed serialization schema of a node class, compiled once per class.
*
* @internal
*/
function getComposedSchema(klass) {
	const record = getNodeClassRecord(klass);
	if (record.composed === void 0) record.composed = composeSchema(klass);
	return record.composed;
}
/**
* Every node-specific property of a class's serialized JSON — its composed
* serialization schema fields plus any flat NodeState whose value schema is
* introspectable — keyed by serialized property name.
*
* @internal
*/
function getComposedSchemaFields(klass) {
	const { fieldsDerivedFirst, flatStates } = getComposedSchema(klass);
	const fields = {};
	for (const stateConfig of flatStates) if (stateConfig.schema) fields[stateConfig.key] = stateConfig.schema;
	for (const [key, schema] of fieldsDerivedFirst) fields[key] = schema;
	return fields;
}
var EMPTY_GETTERS = [];
/**
* The accessor `klass` reads a serialized property through: `null` for a
* property declared import-only, the {@link SchemaGetterField} when the direct
* field access holds, and otherwise the name of the getter method.
*
* This is the whole of the export direction's resolution rule, in one place:
* {@link compileGetters} builds the walk's table from it, and the codegen in
* `scripts/generate-node-json.mjs` emits its literal from it, so the two
* cannot describe different nodes.
*
* @internal
*/
function resolveGetterAccessor(klass, key, schema) {
	const declared = schema.getter;
	if (declared === null) return null;
	const named = declared === void 0 ? defaultGetterName(key) : declared;
	return isSchemaField(named) ? resolveSchemaField(klass, key, named, defaultGetterName(key)) : named;
}
/**
* The setter mirror of {@link resolveGetterAccessor}.
*
* @internal
*/
function resolveSetterAccessor(klass, key, schema) {
	const declared = schema.setter;
	if (declared === null) return null;
	const named = declared === void 0 ? defaultSetterName(key) : declared;
	return isSchemaField(named) ? resolveSchemaField(klass, key, named, defaultSetterName(key)) : named;
}
function compileGetters(klass) {
	const prototype = klass.prototype;
	const fields = /* @__PURE__ */ new Map();
	for (const [key, schema] of getComposedSchema(klass).fieldsDerivedFirst) {
		const getter = resolveGetterAccessor(klass, key, schema);
		if (getter === null) continue;
		if (isSchemaField(getter)) {
			const getterName = getter.field;
			invariant(getterName !== "__proto__", "%s: serialization schema field \"%s\" cannot be read from __proto__", klass.name, key);
			const whenName = getter.when;
			let when;
			if (whenName !== void 0) {
				const predicate = prototype[whenName];
				invariant(typeof predicate === "function", "%s: serialization schema field \"%s\" names a predicate %s() that the node does not have", klass.name, key, whenName);
				when = predicate;
			}
			fields.set(key, {
				defaultValue: schema.defaultValue,
				derived: schema.setter === null,
				field: getterName,
				getterTable: getter.getterTable,
				isEqual: schema.isEqual,
				key,
				kind: "ownField",
				schema,
				when
			});
			continue;
		}
		const method = prototype[getter];
		invariant(typeof method === "function", "%s: serialization schema field \"%s\" has no getter %s(); name one with withAccessors({getter}) or declare {getter: null} if it is deliberately not exported", klass.name, key, getter);
		fields.set(key, {
			defaultValue: schema.defaultValue,
			derived: schema.setter === null,
			getter: method,
			isEqual: schema.isEqual,
			key,
			kind: "method",
			schema
		});
	}
	return fields.size === 0 ? EMPTY_GETTERS : [...fields.values()];
}
/**
* Read a node field by name. A node type has no index signature, so a dynamic
* property access needs the widening cast; keeping it in one named place
* leaves the call sites cast-free.
*/
function ownFieldRecord(node) {
	return node;
}
/**
* The body of {@link $writeJSONGetters}, over a table the caller has already
* resolved — which {@link $exportNodeJSONOnce} has, having just asked the same
* record whether the class carries generated code.
*/
function $writeCompiledGetters(node, getters, json, compact) {
	for (let i = 0; i < getters.length; i++) {
		const entry = getters[i];
		if (compact && entry.derived) continue;
		let value;
		if (entry.kind === "ownField") {
			const stored = ownFieldRecord(node)[entry.field];
			value = entry.getterTable === void 0 ? stored : hasOwnKey(entry.getterTable, stored) ? entry.getterTable[stored] : void 0;
		} else value = entry.getter.call(node);
		if (entry.kind === "ownField" && entry.when !== void 0) {
			if ($isCompactDefaultFor(entry, value) || !entry.when.call(node)) value = void 0;
		}
		if (compact && $isCompactDefaultFor(entry, value)) continue;
		json[entry.key] = value;
	}
}
/**
* The compact form's rule for one property: omit it when the value is what
* parsing would restore.
*
* Inline rather than `isSchemaDefault(rule.schema, value)`: this runs per
* property per node, and for a primitive domain — nearly every serialized
* property — the whole answer is the identity comparison, with the declared
* equality reached only for a value that is not already identical.
*
* The one rule, in one place, because two implementations write this form: the
* walk calls it per property, and a generated exporter calls it through
* {@link CompiledNodeClass.isCompactDefault} for the properties whose defaults
* it could not state as source. A second copy of these three comparisons is
* exactly the drift that would make the two forms disagree.
*/
function $isCompactDefaultFor(rule, value) {
	const { defaultValue, isEqual } = rule;
	return value === void 0 || value === defaultValue || isEqual !== void 0 && isEqual(value, defaultValue);
}
/**
* {@link CompiledNodeClass.isCompactDefault} for one class's getter table.
*
* The key index is built on first use rather than with the table: only a
* property whose default has no literal the generated code could compare
* against ever reaches this, which no built-in node has.
*/
function compactDefaultTest(getters) {
	let byKey;
	return (key, value) => {
		if (byKey === void 0) byKey = new Map(getters.map((entry) => [entry.key, entry]));
		const entry = byKey.get(key);
		return entry !== void 0 && $isCompactDefaultFor(entry, value);
	};
}
/**
* The stored form of a compiled property's schema default — what an `setterTable`
* table maps the default to, or the default itself where there is no table.
* A table always has the entry: {@link compileSetters} refuses one without
* it when the class is registered, as {@link verifyTableCoversDomain} refuses
* it for a generated class, because a default with no stored form left the
* raw default — a string, for a numeric field — as what a miss wrote.
*/
function setterDefault(entry) {
	const { setterTable, schema } = entry;
	const { defaultValue } = schema;
	return setterTable === void 0 ? defaultValue : setterTable[String(defaultValue)];
}
function compileSetters(klass) {
	const prototype = klass.prototype;
	const fields = /* @__PURE__ */ new Map();
	const { fieldsBaseFirst } = getComposedSchema(klass);
	for (const [key, schema] of fieldsBaseFirst) {
		const setter = resolveSetterAccessor(klass, key, schema);
		if (setter === null) continue;
		if (isSchemaField(setter)) {
			const setterName = setter.field;
			invariant(setterName !== "__proto__", "%s: serialization schema field \"%s\" cannot be applied to __proto__", klass.name, key);
			if (setter.setterTable !== void 0) {
				const { setterTable } = setter;
				const { meta } = schema;
				for (const value of meta.kind === "enum" ? meta.values : [schema.defaultValue]) invariant(hasOwnKey(setterTable, String(value)), "%s: serialization schema field \"%s\" has no setterTable entry for %s, which its schema can produce; a parsed value the table does not map is stored as the encoded default, so the table must map every value the schema produces", klass.name, key, JSON.stringify(value));
			}
			fields.set(key, {
				field: setterName,
				key,
				kind: "ownField",
				schema,
				setterTable: setter.setterTable
			});
			continue;
		}
		const method = prototype[setter];
		invariant(typeof method === "function", "%s: serialization schema field \"%s\" has no setter %s(); name one with withAccessors or declare {setter: null} if it is derived on import", klass.name, key, setter);
		fields.set(key, {
			key,
			kind: "field",
			schema,
			setter: method
		});
	}
	return fields.size === 0 ? EMPTY_SETTERS : [...fields.values()];
}
/**
* The generated JSON functions a node class runs, or `null` for a class the
* generated code does not describe.
*
* A class declares its own through `$config`, so the association is the same
* one its schema has. A subclass inherits them along with the schema, on one
* condition: that its compiled tables are the ones the code was generated from.
* Generated code reads the fields the declaring class resolved its properties
* to and calls the methods it resolved them to; a subclass that overrides an
* accessor a field stands in for, or declares a property of its own, resolves
* differently, and for it the code would be wrong. Comparing the two classes'
* tables entry for entry is what decides ({@link sameCompiledTables}) — they
* are the tables the walk would use, so what runs is always what the walk
* would have done. The declaring class is the most basal one in the chain that
* names the same functions, for the same reason `declaredBy` is.
*
* A `$config` of its own that names an ancestor's generated code is refused in
* DEV: inheriting is automatic where it applies, and where it does not, a
* declaration that silently ran the walk would leave the class believing it
* ships the code it named.
*/
function resolveGenerated(klass, ownNodeConfig, tables) {
	let declared;
	let declaringKlass = klass;
	for (const { klass: currentKlass, ownNodeConfig: config } of iterStaticNodeConfigChain(klass)) if (config && config.generated !== void 0) {
		if (declared === void 0) {
			declared = config.generated;
			declaringKlass = currentKlass;
		} else if (config.generated === declared) declaringKlass = currentKlass;
	}
	if (declared === void 0) return null;
	if (declaringKlass === klass) return declared;
	return sameCompiledTables(tables, getCompiled(getNodeClassRecord(declaringKlass))) ? declared : null;
}
/**
* Whether two classes' compiled tables would run the same generated code:
* every entry the same kind for the same key, reading or writing the same
* field through the same tables, against the same schema.
*
* The schema is compared by identity in both directions, and it is what makes
* this sound rather than a list of the details anyone remembered to compare.
* Generated code says more about a property than its kind and field: which
* accessor method it calls, which `when` predicate gates writing it, what its
* domain admits. All of that comes from the schema, none of it is on the
* compiled entry, and a class that re-declares a property declares a new
* schema — so identity separates a property inherited unchanged from one
* restated, possibly differently, and a class that restates anything takes the
* walk instead.
*
* Identity is not too strict for an *override*, which is the case inheritance
* exists for: a subclass that overrides an accessor or a predicate without
* re-declaring the property shares the schema object, and the emitted code
* calls both by name, so the override is honored the way the walk honors it.
*/
function sameCompiledTables(a, b) {
	if (a.getters.length !== b.getters.length || a.setters.length !== b.setters.length) return false;
	for (let i = 0; i < a.getters.length; i++) {
		const x = a.getters[i];
		const y = b.getters[i];
		if (x.kind !== y.kind || x.key !== y.key || x.schema !== y.schema || x.derived !== y.derived || x.isEqual !== y.isEqual || !Object.is(x.defaultValue, y.defaultValue) || x.kind === "ownField" && y.kind === "ownField" && (x.field !== y.field || x.getterTable === void 0 !== (y.getterTable === void 0))) return false;
	}
	for (let i = 0; i < a.setters.length; i++) {
		const x = a.setters[i];
		const y = b.setters[i];
		if (x.kind !== y.kind || x.key !== y.key || x.schema !== y.schema || x.kind === "ownField" && y.kind === "ownField" && (x.field !== y.field || x.setterTable === void 0 !== (y.setterTable === void 0))) return false;
	}
	return true;
}
/** {@link $walkExportJSON} over an already-resolved getter table. */
function $walkFromCompiled(node, getters, compact) {
	const json = compact ? { type: node.__type } : {};
	if ($isElementNode(node)) json.children = [];
	$writeCompiledGetters(node, getters, json, compact);
	if (!compact) {
		json.type = node.__type;
		json.version = 1;
	}
	return json;
}
/**
* What the generated exporter writes for `node` in the form asked for, or
* `undefined` when its class has no generated code for that form and the
* schema-driven walk has to run instead.
*
* A generated exporter is only ever right for the exact accessors its class
* resolves, which is what {@link resolveGenerated} settled at registration.
* Both forms are generated — which properties the compact one drops depends on
* a node's values, but the rule does not, so each form is its own
* straight-line function. NodeState is not part of either: what a node carries
* is not known when the code is generated, so {@link LexicalNode.exportJSON}
* appends it to this result and to the walk's alike.
*
* @internal
*/
/**
* What a node exports in the form asked for: the generated exporter where its
* class has one for that form, and the schema-driven walk otherwise.
*
* One function because both halves start by resolving the class record, and
* asking twice — once to find there is no generated code, once to walk —
* repeated a WeakMap read and, in DEV, the own-field validation, per node per
* export. That is the path every node whose class the generator could not
* compile takes, which is most nodes outside the core.
*
* @internal
*/
function $exportNodeJSONOnce(node, compact) {
	const compiled = getCompiled(getNodeClassRecord(node.constructor));
	const { generated, isCompactDefault } = compiled;
	const exporter = generated === null ? void 0 : compact ? generated.exportCompactJSON : generated.exportJSON;
	return exporter === void 0 ? $walkFromCompiled(node, compiled.getters, compact) : compact ? exporter(node, isCompactDefault) : exporter(node);
}
/**
* Apply a serialized node to one this update has just constructed, which is
* what {@link LexicalNode.importJSON} does after building the node.
*
* The difference from {@link LexicalNode.updateFromJSON} is the `getWritable()`
* that one opens with. It has to: it is public API and may be handed any node,
* from any version, at any point in an update. A node `importJSON` just built
* is none of those things — {@link $setNodeKey} put it in the node map, in the
* dirty set and in `_cloneNotNeeded` a moment earlier, so it already *is* the
* writable latest version and `getWritable()` can only re-derive what the
* constructor established: resolve the latest by key, re-mark a node that is
* already dirty, and walk parents it does not yet have.
*
* That cost is per node and the parse path pays it for every node in the
* document, which is why this exists rather than the caller simply chaining
* `updateFromJSON`. The node a replacement returns is fresh in the same sense —
* {@link $applyNodeReplacement} requires it to carry a key of its own — so it
* qualifies too.
*
* @internal
*/
function $applyImportJSON(node, serializedNode) {
	return $applyJSONSetters(node.__state || serializedNode["$"] !== void 0 ? $updateStateFromJSON(node, serializedNode) : node, serializedNode);
}
/**
* Apply a node's compiled serialization schema (see {@link compileSetters}),
* returning the (writable) node: flat NodeState first, then the schema's
* properties — through the class's generated parser when it has one, and
* otherwise by calling each property's setter with its parsed value. Used by
* the base {@link LexicalNode.updateFromJSON} so a node that declares a
* serialization schema needs no `updateFromJSON` boilerplate.
*
* @internal
*/
function $applyJSONSetters(node, serializedNode) {
	const { flatStates, generated, setters } = getCompiled(getNodeClassRecord(node.constructor));
	const self = $applyFlatStates(node, serializedNode, flatStates);
	if (generated !== null && generated.updateFromJSON !== void 0) return generated.updateFromJSON(self, serializedNode);
	return $walkSetters(self, serializedNode, setters);
}
/**
* Flat state first, matching the order in which $updateStateFromJSON ran
* before a node's own setters — and by the walk whether or not the class has a
* generated parser, which is handed the node with its state already applied.
* What a node carries in state is not known when code is generated; this is
* the mirror of exportJSON appending `__state.toJSON()` around the generated
* literal.
*/
function $applyFlatStates(node, serializedNode, flatStates) {
	let self = node;
	for (let i = 0; i < flatStates.length; i++) {
		const stateConfig = flatStates[i];
		const raw = serializedNode[stateConfig.key];
		if (raw !== void 0) {
			const parsed = stateConfig.parse(raw);
			self = $setState(self, stateConfig, () => parsed);
		}
	}
	return self;
}
/** The walk over a class's compiled setters: one property at a time. */
function $walkSetters(node, serializedNode, setters) {
	for (let i = 0; i < setters.length; i++) {
		const entry = setters[i];
		const parsed = entry.schema(serializedNode[entry.key]);
		if (entry.kind === "ownField") ownFieldRecord(node)[entry.field] = entry.setterTable === void 0 ? parsed : hasOwnKey(entry.setterTable, parsed) ? entry.setterTable[parsed] : setterDefault(entry);
		else entry.setter.call(node, parsed);
	}
	return node;
}
/** @internal */
function getStaticNodeConfig(klass) {
	return getNodeClassRecord(klass).config;
}
/**
* Derive everything this class needs once: read its `$config()`, inject the
* statics it did not declare, then compile its accessor tables.
*/
function buildNodeClassRecord(klass) {
	const nodeConfigRecord = klass.prototype != null && "$config" in klass.prototype ? klass.prototype[PROTOTYPE_CONFIG_METHOD]() : void 0;
	const isAbstract = isAbstractNodeClass(klass);
	const ownGetType = !isAbstract && hasOwnStaticMethod(klass, "getType") ? klass.getType : void 0;
	const nodeType = ownGetType && !(SYNTHESIZED_GET_TYPE in ownGetType) ? ownGetType.call(klass) : void 0;
	let ownNodeConfig;
	let ownNodeType = nodeType;
	if (nodeConfigRecord) {
		if (nodeType) ownNodeConfig = nodeConfigRecord[nodeType];
		else {
			for (const [k, v] of Object.entries(nodeConfigRecord)) {
				ownNodeType = k;
				ownNodeConfig = v;
			}
			if (!ownNodeConfig) for (const symbolKey of Object.getOwnPropertySymbols(nodeConfigRecord)) {
				const symbolConfig = nodeConfigRecord[symbolKey];
				if (symbolConfig) {
					ownNodeConfig = symbolConfig;
					break;
				}
			}
		}
	}
	const record = {
		compiled: void 0,
		composed: void 0,
		config: {
			declaresOwnConfig: hasOwnKey(klass.prototype, PROTOTYPE_CONFIG_METHOD),
			klass,
			ownNodeConfig,
			ownNodeType
		},
		ownFieldsValidated: false
	};
	NODE_CLASS_CACHE.set(klass, record);
	try {
		const setters = compileSetters(klass);
		const getters = compileGetters(klass);
		const composed = getComposedSchema(klass);
		const generated = resolveGenerated(klass, ownNodeConfig, {
			getters,
			setters
		});
		record.compiled = {
			flatStates: composed.flatStates,
			generated: generated === null ? null : generated(composed.fields),
			getters,
			isCompactDefault: compactDefaultTest(getters),
			setters
		};
		injectSynthesizedStatics(klass, isAbstract, ownNodeType, ownNodeConfig);
		injectSynthesizedAfterCloneFrom(klass);
	} catch (error) {
		NODE_CLASS_CACHE.delete(klass);
		throw error;
	}
	return record;
}
/**
* Give a concrete node class the statics it did not define for itself:
* `getType`, `clone`, `importJSON` and `importDOM`, each derived from what its
* `$config()` declared. A class that defines its own keeps it.
*/
function injectSynthesizedStatics(klass, isAbstract, ownNodeType, ownNodeConfig) {
	if (!isAbstract && ownNodeType) {
		if (!hasOwnStaticMethod(klass, "getType")) {
			const synthesizedForKlass = klass;
			const synthesizedGetType = function() {
				if (this !== synthesizedForKlass) return LexicalNode.getType.call(this);
				return ownNodeType;
			};
			synthesizedGetType[SYNTHESIZED_GET_TYPE] = true;
			klass.getType = synthesizedGetType;
		}
		if (!hasOwnStaticMethod(klass, "clone")) klass.clone = (prevNode, internalSkipAfterCloneFrom) => {
			setPendingNodeToClone(prevNode);
			const node = new klass();
			if (internalSkipAfterCloneFrom !== INTERNAL_SKIP_AFTER_CLONE_FROM) node.afterCloneFrom(prevNode);
			return node;
		};
		if (!hasOwnStaticMethod(klass, "importJSON")) klass.importJSON = ownNodeConfig && ownNodeConfig.$importJSON || synthesizeImportJSON(klass);
		if (!hasOwnStaticMethod(klass, "importDOM") && ownNodeConfig) {
			const { importDOM } = ownNodeConfig;
			if (importDOM) klass.importDOM = () => importDOM;
		}
	}
}
/**
* The node fields a schema names, in either direction.
*
* Both directions, and the *declared* field rather than the one
* {@link resolveGetterAccessor} resolves to: which accessor serialization uses
* is a question about this class's methods, and a subclass that overrides
* `getStyle()` still stores its value in `__style`. A clone carries storage, so
* it wants every field name the schema knows, whichever direction named it and
* whether or not an override sends the serialization through a method instead.
*
* A property with no `field` at all — declared through accessor methods on both
* sides — names no storage here, and is left to the class (see
* {@link injectSynthesizedAfterCloneFrom}).
*/
function schemaFieldNames(schema) {
	const names = [];
	for (const accessor of [schema.getter, schema.setter]) if (isSchemaField(accessor) && accessor.field !== "__proto__" && !names.includes(accessor.field)) names.push(accessor.field);
	return names;
}
/**
* Give each class in this one's chain the `afterCloneFrom` its schema implies,
* unless it wrote one for itself.
*
* A schema field is persisted state, so it has to survive
* {@link $cloneWithProperties} — the clone `getWritable()` makes on the first
* write of every update — or the node loses it on the next edit rather than
* failing anywhere. Declaring the field is already saying so, so the copy is
* derived from the same declaration `exportJSON` and `updateFromJSON` come
* from rather than written a third time.
*
* Per declaring class, not per registered class: each class copies the fields
* its own `$config` declared and delegates the rest to its superclass, which is
* what a hand-written `afterCloneFrom` does with its `super` call, and it means
* a base class shared by several subclasses is fixed up once. A field an
* ancestor declares too is left to that ancestor — see
* {@link ownSchemaFields} — so a class that only re-declares inherited
* properties gets no method of its own at all.
*
* A class that defines its own `afterCloneFrom` keeps it and is trusted with
* its own fields, the same rule the synthesized statics follow. That is what
* lets `ElementNode` — whose clone also has to carry `__first`/`__last`/`__size`
* and the slot bookkeeping, none of which any schema describes — keep a
* hand-written method, and it is why {@link $cloneWithProperties} still checks
* that an override called `super`.
*/
function injectSynthesizedAfterCloneFrom(klass) {
	for (const { klass: currentKlass, ownNodeConfig } of iterStaticNodeConfigChain(klass)) {
		const prototype = currentKlass.prototype;
		if (hasOwnKey(prototype, "afterCloneFrom")) continue;
		const fields = ownSchemaFields(currentKlass);
		if (fields.length === 0) continue;
		const superPrototype = Object.getPrototypeOf(prototype);
		const generated = ownNodeConfig && ownNodeConfig.generated !== void 0 ? getCompiled(getNodeClassRecord(currentKlass)).generated : null;
		const copyFields = generated !== null && generated.afterCloneFrom || ((node, prevNode) => {
			const self = node;
			const prev = prevNode;
			for (let i = 0; i < fields.length; i++) {
				const field = fields[i];
				self[field] = prev[field];
			}
		});
		prototype.afterCloneFrom = function(prevNode) {
			superPrototype.afterCloneFrom.call(this, prevNode);
			copyFields(this, prevNode);
		};
		prototype.afterCloneFrom[SYNTHESIZED_AFTER_CLONE_FROM] = true;
	}
}
/**
* The key marking an `afterCloneFrom` this module synthesized, as opposed to
* one the class wrote.
*
* A string rather than a symbol: a `Symbol()` call at module scope is a side
* effect no bundler will drop, and this module is one every editor imports.
*/
var SYNTHESIZED_AFTER_CLONE_FROM = "__lexicalSynthesizedAfterCloneFrom";
/**
* The node fields a class's own `$config` declares, deduplicated.
*
* Raw, in the sense that it says nothing about which class ends up carrying
* each one: {@link ownSchemaFields} is what answers that.
*/
function declaredSchemaFields(klass) {
	const { declaredBy, fieldsBaseFirst } = getComposedSchema(klass);
	const fields = [];
	for (const [key, schema] of fieldsBaseFirst) {
		if (declaredBy.get(key) !== klass) continue;
		for (const field of schemaFieldNames(schema)) if (!fields.includes(field)) fields.push(field);
	}
	return fields;
}
/**
* The node fields a class carries across a clone: the ones its own `$config`
* declares, less any an ancestor declares too.
*
* A class re-declares an inherited property to change how it is *serialized* —
* `TabNode` restates `text`, `detail` and `mode` for their accessors and
* narrower domains — which makes it the owner of that key in its own
* composition and in every subclass's. Where it is *stored* does not change,
* though, and the ancestor's `afterCloneFrom` already ran by then and is
* responsible for the fields it declares, so assigning them a second time
* writes the same values again for nothing.
*
* The ancestor's declarations are what is subtracted, not the fields it
* actually assigns, and the two are the same set transitively: an ancestor
* that skipped a field skipped it because *its* own ancestor declares it, and
* that class is in this chain too.
*
* Shared with the codegen in `scripts/shared/generateNodeJSON.mjs`, which emits
* the straight-line form of exactly this list, so the two cannot disagree about
* which class carries which field.
*
* @internal
*/
function ownSchemaFields(klass) {
	const declared = declaredSchemaFields(klass);
	if (declared.length === 0) return declared;
	const inherited = /* @__PURE__ */ new Set();
	for (const { klass: currentKlass } of iterStaticNodeConfigChain(klass)) if (currentKlass !== klass) for (const field of declaredSchemaFields(currentKlass)) inherited.add(field);
	return inherited.size === 0 ? declared : declared.filter((field) => !inherited.has(field));
}
/**
* The `importJSON` a class gets when it declares none: build the node, then
* apply the serialized properties to it. A generated parser, when the class
* has one, is reached through {@link $applyJSONSetters} the way every other
* path reaches it.
*
* {@link $applyImportJSON} is the base `updateFromJSON` minus a `getWritable()`
* the fresh node does not need, so it may only stand in for that method when
* the node has not overridden it. A class is free to declare a schema *and* an
* `updateFromJSON` — to migrate an older payload, or to apply something the
* schema cannot describe — and calling the schema directly would drop that work
* on the import path while leaving it in place everywhere else.
*
* The node `$create` returns is what is asked, not `klass`: a replacement
* registered for this type is a different class, with its own override or lack
* of one.
*/
function synthesizeImportJSON(klass) {
	return (serializedNode) => {
		const node = $create(klass);
		return node.updateFromJSON === LexicalNode.prototype.updateFromJSON ? $applyImportJSON(node, serializedNode) : node.updateFromJSON(serializedNode);
	};
}
/**
* Collect all configuration for this class and its superclasses
*
* @internal
*/
function* iterStaticNodeConfigChain(klass) {
	for (let current = klass; current && (current === LexicalNode || $isLexicalNode(current.prototype));) {
		const config = getStaticNodeConfig(current);
		const declared = config.declaresOwnConfig;
		yield declared ? config : {
			...config,
			ownNodeConfig: void 0
		};
		current = declared && config.ownNodeConfig && config.ownNodeConfig.extends || getSuperclassOf(current);
	}
}
/**
* Build a map from each registered node type to the set of registered node
* types that are it or extend it (including the type itself). For every node
* class in `nodes`, its prototype chain is walked and the class's own type is
* added to the bucket of each registered ancestor type it inherits from.
*
* The result lets callers expand a base node type to all of its registered
* subclass types up front, so a subclass instance can be matched by type
* without a runtime `instanceof`.
*
* @experimental
*/
function getRegisteredSubtypeMap(nodes) {
	const subtypes = /* @__PURE__ */ new Map();
	const klassByType = /* @__PURE__ */ new Map();
	for (const klass of nodes) {
		const { ownNodeType } = getStaticNodeConfig(klass);
		if (ownNodeType) {
			klassByType.set(ownNodeType, klass);
			subtypes.set(ownNodeType, /* @__PURE__ */ new Set());
		}
	}
	for (const [type, klass] of klassByType) for (const { ownNodeType } of iterStaticNodeConfigChain(klass)) {
		const bucket = ownNodeType && subtypes.get(ownNodeType);
		if (bucket) bucket.add(type);
	}
	return subtypes;
}
/**
* Create an node from its class.
*
* This directly constructs the final `withKlass` node type, skipping the
* intermediate steps where each replaced node would be created and then
* immediately discarded — once per configured replacement of that node.
*
* A deprecated `replace` given without a `withKlass` is the one case that
* cannot be resolved ahead of construction, since only its `with` function
* knows what to build. Such a replacement is still applied, the old way, to
* the node this constructs.
*
* This does not support any arguments to the constructor.
* Setters can be used to initialize your node, and they can
* be chained. You can of course write your own mutliple-argument functions
* to wrap that.
*
* @example
* ```ts
* function $createTokenText(text: string): TextNode {
*   return $create(TextNode).setTextContent(text).setMode('token');
* }
* ```
*/
function $create(klass) {
	const editor = $getEditor();
	errorOnReadOnly();
	const registeredNode = editor.resolveRegisteredNodeAfterReplacements(editor.getRegisteredNode(klass));
	const node = new registeredNode.klass();
	return registeredNode.replace === null ? node : $applyNodeReplacement(node);
}
/**
* Starts with a node and moves up the tree (toward the root node) to find a matching node based on
* the search parameters of the findFn. (Consider JavaScripts' .find() function where a testing function must be
* passed as an argument. eg. if( (node) => node.__type === 'div') ) return true; otherwise return false
* @param startingNode - The node where the search starts.
* @param findFn - A testing function that returns true if the current node satisfies the testing parameters.
* @returns `startingNode` or one of its ancestors that matches the `findFn` predicate and is not the `RootNode`, or `null` if no match was found.
*/
var $findMatchingParent = (startingNode, findFn) => {
	let curr = startingNode;
	while (curr != null && !$isRootNode(curr)) {
		if (findFn(curr)) return curr;
		curr = curr.getParent();
	}
	return null;
};
/** Builds an ordered array of child node keys for the given ElementNode by walking its linked-list pointers. */
function $createChildrenArray(element, nodeMap) {
	const children = [];
	let nodeKey = element.__first;
	while (nodeKey !== null) {
		const node = nodeMap === null ? $getNodeByKey(nodeKey) : nodeMap.get(nodeKey);
		if (node === null || node === void 0) invariant(false, "$createChildrenArray: node does not exist in nodeMap");
		children.push(nodeKey);
		nodeKey = node.__next;
	}
	return children;
}
/**
* Look up the superclass of this class, prefer
* {@link iterStaticNodeConfigChain} when implementing loops.
*
* @internal
*/
function getSuperclassOf(klass) {
	const viaStatic = Object.getPrototypeOf(klass);
	if (typeof viaStatic === "function" && viaStatic !== Function.prototype) return viaStatic;
	const parentProto = klass.prototype && Object.getPrototypeOf(klass.prototype);
	return parentProto ? parentProto.constructor : null;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/LexicalSlot.ts
/**
* Shared empty slot map. Reads coalesce here when a host's `__slots` is null
* (lazy allocation), so non-slot trees don't pay a per-node allocation cost.
*
* @internal
*/
var EMPTY_SLOTS = /* @__PURE__ */ new Map();
/**
* Shape predicate: true when `node` carries the host's `__slots` field — i.e.
* it is an {@link ElementNode} or a {@link DecoratorNode}. Narrows to
* {@link SlotHostNode} so the mutation helpers' compile-time host requirement
* is satisfied. This is a type guard only; the value-level invariant on what
* may actually be slotted is enforced by {@link $setSlot} (shadow-root
* ElementNode or non-inline DecoratorNode).
*
* @experimental
*/
function $isSlotHost(node) {
	return $isElementNode(node) || $isDecoratorNode(node);
}
/**
* Shape predicate: true when `node` carries the child's `__slotHost` field —
* i.e. it is an {@link ElementNode} or a {@link DecoratorNode}. Narrows to
* {@link SlotChildNode}. This is a type guard only; {@link $setSlot} rejects
* inline values at runtime. The slot link acts as a virtual shadow root, so
* any non-inline block — shadow root or not — can occupy a slot.
*
* @experimental
*/
function $isSlotChild(node) {
	return $isElementNode(node) || $isDecoratorNode(node);
}
/**
* Returns the key of the host this node is slotted into, or null when the node
* is not slotted. Accepts any node and narrows internally so generic callers
* (removal guard, up-walk, GC, caret) don't have to. Exposes a raw key, so it
* stays internal to the package; public callers use {@link $getSlotHost}.
*
* @internal
*/
function $getSlotHostKey(node) {
	const latest = node.getLatest();
	return $isSlotChild(latest) ? latest.__slotHost : null;
}
/**
* Returns the host element when this node occupies one of its named slots,
* or null if this node is not slotted. The up-link is kept separate from
* {@link LexicalNode.getParent} so the slot boundary behaves like a shadow
* root.
*
* @experimental
*/
function $getSlotHost(node) {
	const slotHostKey = $getSlotHostKey(node);
	if (slotHostKey === null) return null;
	const host = $getNodeByKey(slotHostKey);
	invariant($isElementNode(host) || $isDecoratorNode(host), "slotHost must be an ElementNode or a DecoratorNode");
	return host;
}
/**
* Returns the slot name this node occupies on its host, or null when the node
* is not a slot value. Mirrors {@link LexicalNode#getIndexWithinParent} for
* slot children — answers "which named slot does this node sit in?".
*
* @experimental
*/
function $getSlotNameWithinHost(slotChild) {
	const host = $getSlotHost(slotChild);
	if (host === null) return null;
	const childKey = slotChild.getLatest().__key;
	for (const [name, key] of $getSlotMap(host)) if (key === childKey) return name;
	return null;
}
/**
* Returns the slot value (the "slot frame") whose isolated subtree contains
* `node`, or `node` itself when it is a slot value, or null when the node is
* not inside any slot. The walk follows `getParent()` and naturally stops at a
* slot value because a slotted node's `__parent` is null. Non-slot trees have
* `__slotHost === null` everywhere, so this always returns null there.
*
* Selection-driven exporters use this to find the isolated subtree a
* RangeSelection lives in (a selection inside a slot never contains the host,
* so a root-children walk alone would miss it).
*
* @experimental
*/
function $getSlotFrame(node) {
	let current = node.getLatest();
	while (current !== null) {
		if ($getSlotHostKey(current) !== null) return current;
		current = current.getParent();
	}
	return null;
}
/**
* Returns the slot frame that `selection` lives in, or null when it is outside
* any slot (or there is no selection). Thin wrapper over {@link $getSlotFrame}
* that picks the node to anchor the walk on.
*
* Selection-driven exporters walk this frame instead of the root's children: a
* selection wholly inside a slot subtree never includes its host (slots are
* shadow-root isolated), so a root-children walk would miss the selected nodes
* entirely and produce an empty payload (cut = data loss).
*
* Every selection type participates. A RangeSelection anchors on its anchor
* point; anything else (NodeSelection, TableSelection, or an app-defined
* BaseSelection) anchors on the first node it reports, which is where a click
* that selects a decorator or a table nested in a slot is handled.
*
* `NodeSelection.getNodes()[0]` is the first node by insertion order (the
* internal `_nodes` Set's iteration order), not document order. For the common
* single-node case this is the only node and the frame is unambiguous. A
* multi-node selection that straddles a slot boundary is currently undefined —
* slots are shadow-isolated, so straddling is already invalid construction, and
* we pick the first node's frame rather than asserting.
*
* @experimental
*/
function $getSelectionSlotFrame(selection) {
	if (selection === null) return null;
	const anchorNode = $isRangeSelection(selection) ? selection.anchor.getNode() : selection.getNodes()[0] ?? null;
	return anchorNode === null ? null : $getSlotFrame(anchorNode);
}
/**
* Returns the latest slot map (name -> child key, insertion order). Exposes raw
* keys, so it stays internal to the package; public callers use
* {@link $getSlotNames} / {@link $getSlot}.
*
* @internal
*/
function $getSlotMap(node) {
	const latest = node.getLatest();
	return $isSlotHost(latest) && latest.__slots !== null ? latest.__slots : EMPTY_SLOTS;
}
/**
* Returns the names of this node's occupied slots, in insertion order. Empty
* when the node hosts no slots.
*
* @experimental
*/
function $getSlotNames(node) {
	return Array.from($getSlotMap(node).keys());
}
/**
* Returns the node occupying the named slot, or null if the slot is empty.
* Slots are a shadow-root-isolated channel kept separate from children; see
* {@link $getSlotHost} for the reverse up-link.
*
* @experimental
*/
function $getSlot(node, name) {
	const key = $getSlotMap(node).get(name);
	return key === void 0 ? null : $getNodeByKey(key);
}
var RESERVED_SLOT_NAMES = [
	"__proto__",
	"constructor",
	"prototype"
];
var SLOT_MAP_OWNER = Symbol("slotMapOwner");
function $getWritableSlots(writableHost) {
	let slots = writableHost.__slots;
	if (slots === null || slots[SLOT_MAP_OWNER] !== writableHost) {
		slots = new Map(slots);
		slots[SLOT_MAP_OWNER] = writableHost;
		writableHost.__slots = slots;
	}
	return slots;
}
var slotRankCache = /* @__PURE__ */ new WeakMap();
var EMPTY_DECLARED_SLOTS = [];
/**
* Returns the canonical slot declaration for a node class: the `slots` array
* from the nearest {@link StaticNodeConfigValue} in its prototype chain (a
* subclass redeclaration overrides its ancestors'), or an empty array when
* nothing is declared. The declaration is an ordering vocabulary, not a
* schema — occupied names outside it are still valid and sort after the
* declared names in code-unit order.
*
* @experimental named-slots
*/
function getDeclaredSlots(klass) {
	for (const { ownNodeConfig } of iterStaticNodeConfigChain(klass)) {
		const declared = ownNodeConfig && ownNodeConfig.slots;
		if (declared) return declared;
	}
	return EMPTY_DECLARED_SLOTS;
}
/**
* @internal
*
* Concatenated text of a node's named slots, read slots-first (in slot Map
* order). Shared by the getTextContent implementations so ElementNode and
* DecoratorNode hosts fold their slot text the same way; a node with no
* slots returns the empty string. A free function (not a LexicalNode method)
* so the framework-owned name cannot collide with a subclass's own members.
*/
function $getSlotsTextContent(node) {
	let textContent = "";
	for (const name of $getSlotNames(node)) {
		const slot = $getSlot(node, name);
		if (slot !== null) textContent += slot.getTextContent();
	}
	return textContent;
}
/**
* @internal
*
* Size counterpart to {@link $getSlotsTextContent}, summing each slot's
* getTextContentSize (which a slot subtree may override independently of its
* text length) slots-first.
*/
function $getSlotsTextContentSize(node) {
	let textContentSize = 0;
	for (const name of $getSlotNames(node)) {
		const slot = $getSlot(node, name);
		if (slot !== null) textContentSize += slot.getTextContentSize();
	}
	return textContentSize;
}
function getDeclaredSlotRank(klass) {
	let rank = slotRankCache.get(klass);
	if (rank === void 0) {
		const declared = getDeclaredSlots(klass);
		const built = /* @__PURE__ */ new Map();
		for (const name of declared) {
			invariant(!RESERVED_SLOT_NAMES.includes(name), "getDeclaredSlotRank: %s declares reserved slot name \"%s\"; __proto__, constructor, and prototype break the plain-object serialization of slots", klass.name, name);
			invariant(!built.has(name), "getDeclaredSlotRank: %s declares slot name \"%s\" more than once; the canonical order would be ambiguous", klass.name, name);
			built.set(name, built.size);
		}
		rank = built;
		slotRankCache.set(klass, rank);
	}
	return rank;
}
function compareSlotNames(a, b, rank) {
	const rankA = rank.get(a);
	const rankB = rank.get(b);
	if (rankA !== void 0) return rankB !== void 0 ? rankA - rankB : -1;
	if (rankB !== void 0) return 1;
	return a < b ? -1 : a > b ? 1 : 0;
}
function $canonicalizeSlotOrder(host) {
	const slots = host.__slots;
	if (slots === null || slots.size < 2) return;
	const rank = getDeclaredSlotRank(host.constructor);
	let previous = null;
	let sorted = true;
	for (const name of slots.keys()) {
		if (previous !== null && compareSlotNames(previous, name, rank) > 0) {
			sorted = false;
			break;
		}
		previous = name;
	}
	if (sorted) return;
	const entries = Array.from(slots).sort(([a], [b]) => compareSlotNames(a, b, rank));
	slots.clear();
	for (const [name, key] of entries) slots.set(name, key);
}
/**
* Places `node` into the named slot of `host`, replacing any existing value
* under that name. Move semantics, mirroring `ElementNode.append` /
* `insertBefore`: the value is detached from wherever it currently lives —
* a child of another element, or a slot on this or another host (a node's two
* up-links, `__parent` and `__slotHost`, are mutually exclusive, so it holds
* exactly one) — before linking, so re-slotting never requires an explicit
* remove first. The replaced value, if any, is detached.
*
* A slot value must be a non-inline {@link ElementNode} or a non-inline
* {@link DecoratorNode}: the slot link itself acts as a virtual shadow root
* between the host and the value, so the value does not need to be a shadow
* root — a plain block (e.g. a ParagraphNode subclass serving as a
* single-line field) is a valid slot value, and selection, traversal, and
* editing treat its slot boundary exactly like a shadow-root boundary.
*
* `host` is constrained to {@link SlotHostNode} so a non-host is rejected at
* compile time.
*
* @experimental
*/
function $setSlot(host, name, node) {
	invariant(name !== "__proto__" && name !== "constructor" && name !== "prototype", "$setSlot: \"%s\" is a reserved slot name; __proto__, constructor, and prototype break the plain-object serialization of slots", name);
	const latestHost = host.getLatest();
	if (latestHost.__slots !== null && latestHost.__slots.get(name) === node.getLatest().__key) return latestHost;
	invariant(($isElementNode(node) || $isDecoratorNode(node)) && !node.isInline(), "$setSlot: node %s is not a valid slot value; a slot value must be a non-inline ElementNode or DecoratorNode (the slot link itself is the shadow boundary).", node.__key);
	const writableSelf = host.getWritable();
	const slots = $getWritableSlots(writableSelf);
	const previousKey = slots.get(name);
	if (previousKey !== void 0) $detachSlottedNode(previousKey);
	const writableNode = node.getWritable();
	const previousHost = $getSlotHost(writableNode);
	if (previousHost !== null) {
		const previousName = $getSlotNameWithinHost(writableNode);
		if (previousName !== null) $getWritableSlots(previousHost.getWritable()).delete(previousName);
		writableNode.__slotHost = null;
	}
	$removeFromParent(writableNode);
	writableNode.__slotHost = writableSelf.__key;
	slots.set(name, writableNode.__key);
	$canonicalizeSlotOrder(writableSelf);
	$markSlotsUsed();
	return writableSelf;
}
/**
* Removes the named slot from `host`, detaching its value (its slot up-link is
* cleared). No-op if the slot is empty. `host` is constrained to
* {@link SlotHostNode} so a non-host is rejected at compile time.
*
* @experimental
*/
function $removeSlot(host, name) {
	const writableSelf = host.getWritable();
	if (writableSelf.__slots === null) return writableSelf;
	const previousKey = writableSelf.__slots.get(name);
	if (previousKey !== void 0) {
		$detachSlottedNode(previousKey);
		$getWritableSlots(writableSelf).delete(name);
	}
	return writableSelf;
}
function $detachSlottedNode(slotKey) {
	const previous = $getNodeByKey(slotKey);
	if (previous === null) return;
	const writablePrevious = previous.getWritable();
	invariant($isSlotChild(writablePrevious), "detach: slotted node %s must be an ElementNode or a DecoratorNode", slotKey);
	writablePrevious.__slotHost = null;
	writablePrevious.remove();
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/caret/LexicalCaret.ts
var FLIP_DIRECTION = {
	next: "previous",
	previous: "next"
};
var AbstractCaret = class {
	origin;
	constructor(origin) {
		this.origin = origin;
	}
	[Symbol.iterator]() {
		return makeStepwiseIterator({
			hasNext: $isSiblingCaret,
			initial: this.getAdjacentCaret(),
			map: (caret) => caret,
			step: (caret) => caret.getAdjacentCaret()
		});
	}
	getAdjacentCaret() {
		return $getSiblingCaret(this.getNodeAtCaret(), this.direction);
	}
	getSiblingCaret() {
		return $getSiblingCaret(this.origin, this.direction);
	}
	remove() {
		const node = this.getNodeAtCaret();
		if (node) node.remove();
		return this;
	}
	replaceOrInsert(node, includeChildren) {
		const target = this.getNodeAtCaret();
		if (node.is(this.origin) || node.is(target)) {} else if (target === null) this.insert(node);
		else target.replace(node, includeChildren);
		return this;
	}
	splice(deleteCount, nodes, nodesDirection = "next") {
		const nodeIter = nodesDirection === this.direction ? nodes : Array.from(nodes).reverse();
		let caret = this;
		const parent = this.getParentAtCaret();
		const nodesToRemove = /* @__PURE__ */ new Map();
		for (let removeCaret = caret.getAdjacentCaret(); removeCaret !== null && nodesToRemove.size < deleteCount; removeCaret = removeCaret.getAdjacentCaret()) {
			const writableNode = removeCaret.origin.getWritable();
			nodesToRemove.set(writableNode.getKey(), writableNode);
		}
		for (const node of nodeIter) {
			if (nodesToRemove.size > 0) {
				const target = caret.getNodeAtCaret();
				if (target) {
					nodesToRemove.delete(target.getKey());
					nodesToRemove.delete(node.getKey());
					if (target.is(node) || caret.origin.is(node)) {} else {
						const nodeParent = node.getParent();
						if (nodeParent && nodeParent.is(parent)) node.remove();
						target.replace(node);
					}
				} else invariant(target !== null, "NodeCaret.splice: Underflow of expected nodesToRemove during splice (keys: %s)", Array.from(nodesToRemove).join(" "));
			} else caret.insert(node);
			caret = $getSiblingCaret(node, this.direction);
		}
		for (const node of nodesToRemove.values()) node.remove();
		return this;
	}
};
var AbstractChildCaret = class AbstractChildCaret extends AbstractCaret {
	type = "child";
	getLatest() {
		const origin = this.origin.getLatest();
		return origin === this.origin ? this : $getChildCaret(origin, this.direction);
	}
	/**
	* Get the SiblingCaret from this origin in the same direction.
	*
	* @param mode 'root' to return null at the root, 'shadowRoot' to return null at the root or any shadow root
	* @returns A SiblingCaret with this origin, or null if origin is a root according to mode.
	*/
	getParentCaret(mode = "root") {
		return $getSiblingCaret($filterByMode(this.getParentAtCaret(), mode), this.direction);
	}
	getFlipped() {
		const dir = flipDirection(this.direction);
		return $getSiblingCaret(this.getNodeAtCaret(), dir) || $getChildCaret(this.origin, dir);
	}
	getParentAtCaret() {
		return this.origin;
	}
	getChildCaret() {
		return this;
	}
	isSameNodeCaret(other) {
		return other instanceof AbstractChildCaret && this.direction === other.direction && this.origin.is(other.origin);
	}
	isSamePointCaret(other) {
		return this.isSameNodeCaret(other);
	}
};
var ChildCaretFirst = class extends AbstractChildCaret {
	direction = "next";
	getNodeAtCaret() {
		return this.origin.getFirstChild();
	}
	insert(node) {
		this.origin.splice(0, 0, [node]);
		return this;
	}
};
var ChildCaretLast = class extends AbstractChildCaret {
	direction = "previous";
	getNodeAtCaret() {
		return this.origin.getLastChild();
	}
	insert(node) {
		this.origin.splice(this.origin.getChildrenSize(), 0, [node]);
		return this;
	}
};
var MODE_PREDICATE = {
	root: $isRootNode,
	shadowRoot: $isRootOrShadowRoot
};
/**
* Flip a direction ('next' -> 'previous'; 'previous' -> 'next').
*
* Note that TypeScript can't prove that FlipDirection is its own
* inverse (but if you have a concrete 'next' or 'previous' it will
* simplify accordingly).
*
* @param direction A direction
* @returns The opposite direction
*/
function flipDirection(direction) {
	return FLIP_DIRECTION[direction];
}
function $filterByMode(node, mode = "root") {
	if (node === null || MODE_PREDICATE[mode](node)) return null;
	return $getSlotHostKey(node) === null ? node : null;
}
var AbstractSiblingCaret = class AbstractSiblingCaret extends AbstractCaret {
	type = "sibling";
	getLatest() {
		const origin = this.origin.getLatest();
		return origin === this.origin ? this : $getSiblingCaret(origin, this.direction);
	}
	getSiblingCaret() {
		return this;
	}
	getParentAtCaret() {
		return this.origin.getParent();
	}
	getChildCaret() {
		return $isElementNode(this.origin) ? $getChildCaret(this.origin, this.direction) : null;
	}
	getParentCaret(mode = "root") {
		return $getSiblingCaret($filterByMode(this.getParentAtCaret(), mode), this.direction);
	}
	getFlipped() {
		const dir = flipDirection(this.direction);
		return $getSiblingCaret(this.getNodeAtCaret(), dir) || $getChildCaret(this.origin.getParentOrThrow(), dir);
	}
	isSamePointCaret(other) {
		return other instanceof AbstractSiblingCaret && this.direction === other.direction && this.origin.is(other.origin);
	}
	isSameNodeCaret(other) {
		return (other instanceof AbstractSiblingCaret || other instanceof AbstractTextPointCaret) && this.direction === other.direction && this.origin.is(other.origin);
	}
};
var AbstractTextPointCaret = class AbstractTextPointCaret extends AbstractCaret {
	type = "text";
	offset;
	constructor(origin, offset) {
		super(origin);
		this.offset = offset;
	}
	getLatest() {
		const origin = this.origin.getLatest();
		return origin === this.origin ? this : $getTextPointCaret(origin, this.direction, this.offset);
	}
	getParentAtCaret() {
		return this.origin.getParent();
	}
	getChildCaret() {
		return null;
	}
	getParentCaret(mode = "root") {
		return $getSiblingCaret($filterByMode(this.getParentAtCaret(), mode), this.direction);
	}
	getFlipped() {
		return $getTextPointCaret(this.origin, flipDirection(this.direction), this.offset);
	}
	isSamePointCaret(other) {
		return other instanceof AbstractTextPointCaret && this.direction === other.direction && this.origin.is(other.origin) && this.offset === other.offset;
	}
	isSameNodeCaret(other) {
		return (other instanceof AbstractSiblingCaret || other instanceof AbstractTextPointCaret) && this.direction === other.direction && this.origin.is(other.origin);
	}
	getSiblingCaret() {
		return $getSiblingCaret(this.origin, this.direction);
	}
};
/**
* Guard to check if the given caret is specifically a TextPointCaret
*
* @param caret Any caret
* @returns true if it is a TextPointCaret
*/
function $isTextPointCaret(caret) {
	return caret instanceof AbstractTextPointCaret;
}
/**
* Guard to check if the given argument is any type of caret
*
* @param caret
* @returns true if caret is any type of caret
*/
function $isNodeCaret(caret) {
	return caret instanceof AbstractCaret;
}
/**
* Guard to check if the given argument is specifically a SiblingCaret (or TextPointCaret)
*
* @param caret
* @returns true if caret is a SiblingCaret
*/
function $isSiblingCaret(caret) {
	return caret instanceof AbstractSiblingCaret;
}
/**
* Guard to check if the given argument is specifically a ChildCaret

* @param caret 
* @returns true if caret is a ChildCaret
*/
function $isChildCaret(caret) {
	return caret instanceof AbstractChildCaret;
}
var SiblingCaretNext = class extends AbstractSiblingCaret {
	direction = "next";
	getNodeAtCaret() {
		return this.origin.getNextSibling();
	}
	insert(node) {
		this.origin.insertAfter(node);
		return this;
	}
};
var SiblingCaretPrevious = class extends AbstractSiblingCaret {
	direction = "previous";
	getNodeAtCaret() {
		return this.origin.getPreviousSibling();
	}
	insert(node) {
		this.origin.insertBefore(node);
		return this;
	}
};
var TextPointCaretNext = class extends AbstractTextPointCaret {
	direction = "next";
	getNodeAtCaret() {
		return this.origin.getNextSibling();
	}
	insert(node) {
		this.origin.insertAfter(node);
		return this;
	}
};
var TextPointCaretPrevious = class extends AbstractTextPointCaret {
	direction = "previous";
	getNodeAtCaret() {
		return this.origin.getPreviousSibling();
	}
	insert(node) {
		this.origin.insertBefore(node);
		return this;
	}
};
var TEXT_CTOR = {
	next: TextPointCaretNext,
	previous: TextPointCaretPrevious
};
var SIBLING_CTOR = {
	next: SiblingCaretNext,
	previous: SiblingCaretPrevious
};
var CHILD_CTOR = {
	next: ChildCaretFirst,
	previous: ChildCaretLast
};
function $getSiblingCaret(origin, direction) {
	return origin ? new SIBLING_CTOR[direction](origin) : null;
}
function $getTextPointCaret(origin, direction, offset) {
	return origin ? new TEXT_CTOR[direction](origin, $getTextNodeOffset(origin, offset)) : null;
}
/**
* Get a normalized offset into a TextNode given a numeric offset or a
* direction for which end of the string to use. Throws in dev if the offset
* is not in the bounds of the text content size.
*
* @param origin a TextNode
* @param offset An absolute offset into the TextNode string, or a direction for which end to use as the offset
* @param mode If 'error' (the default) out of bounds offsets will be an error in dev. Otherwise it will clamp to a valid offset.
* @returns An absolute offset into the TextNode string
*/
function $getTextNodeOffset(origin, offset, mode = "error") {
	const size = origin.getTextContentSize();
	let numericOffset = offset === "next" ? size : offset === "previous" ? 0 : offset;
	if (numericOffset < 0 || numericOffset > size) {
		devInvariant(mode === "clamp", "$getTextNodeOffset: invalid offset %s for size %s at key %s", String(offset), String(size), origin.getKey());
		numericOffset = numericOffset < 0 ? 0 : size;
	}
	return numericOffset;
}
/**
* Construct a TextPointCaretSlice given a TextPointCaret and a signed distance. The
* distance should be negative to slice text before the caret's offset, and positive
* to slice text after the offset. The direction of the caret itself is not
* relevant to the string coordinates when working with a TextPointCaretSlice
* but mutation operations will preserve the direction.
*
* @param caret
* @param distance
* @returns TextPointCaretSlice
*/
function $getTextPointCaretSlice(caret, distance) {
	return new TextPointCaretSliceImpl(caret, distance);
}
function $getChildCaret(origin, direction) {
	return $isElementNode(origin) ? new CHILD_CTOR[direction](origin) : null;
}
/**
* Gets the ChildCaret if one is possible at this caret origin, otherwise return the caret
*/
function $getChildCaretOrSelf(caret) {
	return caret && caret.getChildCaret() || caret;
}
/**
* Gets the adjacent caret, if not-null and if the origin of the adjacent caret is an ElementNode, then return
* the ChildCaret. This can be used along with the getParentAdjacentCaret method to perform a full DFS
* style traversal of the tree.
*
* @param caret The caret to start at
*/
function $getAdjacentChildCaret(caret) {
	return caret && $getChildCaretOrSelf(caret.getAdjacentCaret());
}
var CaretRangeImpl = class CaretRangeImpl {
	type = "node-caret-range";
	direction;
	anchor;
	focus;
	constructor(anchor, focus, direction) {
		this.anchor = anchor;
		this.focus = focus;
		this.direction = direction;
	}
	getLatest() {
		const anchor = this.anchor.getLatest();
		const focus = this.focus.getLatest();
		return anchor === this.anchor && focus === this.focus ? this : new CaretRangeImpl(anchor, focus, this.direction);
	}
	isCollapsed() {
		return this.anchor.isSamePointCaret(this.focus);
	}
	getTextSlices() {
		const getSlice = (k) => {
			const caret = this[k].getLatest();
			return $isTextPointCaret(caret) ? $getSliceFromTextPointCaret(caret, k) : null;
		};
		const anchorSlice = getSlice("anchor");
		const focusSlice = getSlice("focus");
		if (anchorSlice && focusSlice) {
			const { caret: anchorCaret } = anchorSlice;
			const { caret: focusCaret } = focusSlice;
			if (anchorCaret.isSameNodeCaret(focusCaret)) return [$getTextPointCaretSlice(anchorCaret, focusCaret.offset - anchorCaret.offset), null];
		}
		return [anchorSlice, focusSlice];
	}
	iterNodeCarets(rootMode = "root") {
		const anchor = $isTextPointCaret(this.anchor) ? this.anchor.getSiblingCaret() : this.anchor.getLatest();
		const focus = this.focus.getLatest();
		const isTextFocus = $isTextPointCaret(focus);
		const step = (state) => state.isSameNodeCaret(focus) ? null : $getAdjacentChildCaret(state) || state.getParentCaret(rootMode);
		return makeStepwiseIterator({
			hasNext: (state) => state !== null && !(isTextFocus && focus.isSameNodeCaret(state)),
			initial: anchor.isSameNodeCaret(focus) ? null : step(anchor),
			map: (state) => state,
			step
		});
	}
	[Symbol.iterator]() {
		return this.iterNodeCarets("root");
	}
};
var TextPointCaretSliceImpl = class {
	type = "slice";
	caret;
	distance;
	constructor(caret, distance) {
		this.caret = caret;
		this.distance = distance;
	}
	getSliceIndices() {
		const { distance, caret: { offset } } = this;
		const offsetB = offset + distance;
		return offsetB < offset ? [offsetB, offset] : [offset, offsetB];
	}
	getTextContent() {
		const [startIndex, endIndex] = this.getSliceIndices();
		return this.caret.origin.getTextContent().slice(startIndex, endIndex);
	}
	getTextContentSize() {
		return Math.abs(this.distance);
	}
	removeTextSlice() {
		const { caret: { origin, direction } } = this;
		const [indexStart, indexEnd] = this.getSliceIndices();
		const text = origin.getTextContent();
		return $getTextPointCaret(origin.setTextContent(text.slice(0, indexStart) + text.slice(indexEnd)), direction, indexStart);
	}
};
function $getSliceFromTextPointCaret(caret, anchorOrFocus) {
	const { direction, origin } = caret;
	return $getTextPointCaretSlice(caret, $getTextNodeOffset(origin, anchorOrFocus === "focus" ? flipDirection(direction) : direction) - caret.offset);
}
/**
* Guard to check for a TextPointCaretSlice
*
* @param caretOrSlice A caret or slice
* @returns true if caretOrSlice is a TextPointCaretSlice
*/
function $isTextPointCaretSlice(caretOrSlice) {
	return caretOrSlice instanceof TextPointCaretSliceImpl;
}
/**
* Return the caret if it's in the given direction, otherwise return
* caret.getFlipped().
*
* @param caret Any PointCaret
* @param direction The desired direction
* @returns A PointCaret in direction
*/
function $getCaretInDirection(caret, direction) {
	return caret.direction === direction ? caret : caret.getFlipped();
}
/**
* Construct a CaretRange that starts at anchor and goes to the end of the
* document in the anchor caret's direction.
*/
function $extendCaretToRange(anchor) {
	return $getCaretRange(anchor, $getCaretInDirection($getChildCaret($getRoot(), flipDirection(anchor.direction)), anchor.direction));
}
/**
* Construct a collapsed CaretRange that starts and ends at anchor.
*/
function $getCollapsedCaretRange(anchor) {
	return $getCaretRange(anchor, anchor);
}
/**
* Construct a CaretRange from anchor and focus carets pointing in the
* same direction. In order to get the expected behavior,
* the anchor must point towards the focus or be the same point.
*
* In the 'next' direction the anchor should be at or before the
* focus in the document. In the 'previous' direction the anchor
* should be at or after the focus in the document
* (similar to a backwards RangeSelection).
*
* @param anchor
* @param focus
* @returns a CaretRange
*/
function $getCaretRange(anchor, focus) {
	invariant(anchor.direction === focus.direction, "$getCaretRange: anchor and focus must be in the same direction");
	return new CaretRangeImpl(anchor, focus, anchor.direction);
}
/**
* A generalized utility for creating a stepwise iterator
* based on:
*
* - an initial state
* - a stop guard that returns true if the iteration is over, this
*   is typically used to detect a sentinel value such as null or
*   undefined from the state but may return true for other conditions
*   as well
* - a step function that advances the state (this will be called
*   after map each time next() is called to prepare the next state)
* - a map function that will be called that may transform the state
*   before returning it. It will only be called once for each next()
*   call when stop(state) === false
*
* @param config
* @returns An IterableIterator
*/
function makeStepwiseIterator(config) {
	const { initial, hasNext, step, map } = config;
	let state = initial;
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			if (!hasNext(state)) return {
				done: true,
				value: void 0
			};
			const rval = {
				done: false,
				value: map(state)
			};
			state = step(state);
			return rval;
		}
	};
}
function compareNumber(a, b) {
	return Math.sign(a - b);
}
/**
* A total ordering for `PointCaret<'next'>`, based on
* the same order that a {@link CaretRange} would iterate
* them.
*
* For a given origin node:
* - ChildCaret comes before SiblingCaret
* - TextPointCaret comes before SiblingCaret
*
* An exception is thrown when a and b do not have any
* common ancestor.
*
* This ordering is a sort of mix of pre-order and post-order
* because each ElementNode will show up as a ChildCaret
* on 'enter' (pre-order) and a SiblingCaret on 'leave' (post-order).
*
* @param a
* @param b
* @returns -1 if a comes before b, 0 if a and b are the same, or 1 if a comes after b
*/
function $comparePointCaretNext(a, b) {
	const compare = $getCommonAncestor(a.origin, b.origin);
	invariant(compare !== null, "$comparePointCaretNext: a (key %s) and b (key %s) do not have a common ancestor", a.origin.getKey(), b.origin.getKey());
	switch (compare.type) {
		case "same": {
			const aIsText = a.type === "text";
			const bIsText = b.type === "text";
			return aIsText && bIsText ? compareNumber(a.offset, b.offset) : a.type === b.type ? 0 : aIsText ? -1 : bIsText ? 1 : a.type === "child" ? -1 : 1;
		}
		case "ancestor": return a.type === "child" ? -1 : 1;
		case "descendant": return b.type === "child" ? 1 : -1;
		case "branch": return $getCommonAncestorResultBranchOrder(compare);
	}
}
/**
* Return the ordering of siblings in a {@link CommonAncestorResultBranch}
* @param compare Returns -1 if a precedes b, 1 otherwise
*/
function $getCommonAncestorResultBranchOrder(compare) {
	const { a, b } = compare;
	const aKey = a.__key;
	const bKey = b.__key;
	let na = a;
	let nb = b;
	for (; na && nb; na = na.getNextSibling(), nb = nb.getNextSibling()) if (na.__key === bKey) return -1;
	else if (nb.__key === aKey) return 1;
	return na === null ? 1 : -1;
}
function $isSameNode(reference, other) {
	return other.is(reference);
}
function $initialElementTuple(node) {
	return $isElementNode(node) ? [node.getLatest(), null] : [node.getParent(), node.getLatest()];
}
/**
* Find a common ancestor of a and b and return a detailed result object,
* or null if there is no common ancestor between the two nodes.
*
* The result object will have a commonAncestor property, and the other
* properties can be used to quickly compare these positions in the tree.
*
* @param a A LexicalNode
* @param b A LexicalNode
* @returns A comparison result between the two nodes or null if they have no common ancestor
*/
function $getCommonAncestor(a, b) {
	if (a.is(b)) return {
		commonAncestor: a,
		type: "same"
	};
	const aMap = /* @__PURE__ */ new Map();
	for (let [parent, child] = $initialElementTuple(a); parent; child = parent, parent = parent.getParent()) aMap.set(parent, child);
	for (let [parent, child] = $initialElementTuple(b); parent; child = parent, parent = parent.getParent()) {
		const aChild = aMap.get(parent);
		if (aChild === void 0) {} else if (aChild === null) {
			invariant($isSameNode(a, parent), "$originComparison: ancestor logic error");
			return {
				commonAncestor: parent,
				type: "ancestor"
			};
		} else if (child === null) {
			invariant($isSameNode(b, parent), "$originComparison: descendant logic error");
			return {
				commonAncestor: parent,
				type: "descendant"
			};
		} else {
			invariant(($isElementNode(aChild) || $isSameNode(a, aChild)) && ($isElementNode(child) || $isSameNode(b, child)) && parent.is(aChild.getParent()) && parent.is(child.getParent()), "$originComparison: branch logic error");
			return {
				a: aChild,
				b: child,
				commonAncestor: parent,
				type: "branch"
			};
		}
	}
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/extension-core/defineExtension.ts
/**
* Define a LexicalExtension from the given object literal. TypeScript will
* infer Config and Name in most cases, but you may want to use
* {@link safeCast} for config if there are default fields or varying types.
*
* @param extension - The LexicalExtension
* @returns The unmodified extension argument (this is only an inference helper)
*
* @example
* Basic example
* ```ts
* export const MyExtension = defineExtension({
*   // Extension names must be unique in an editor
*   name: "my",
*   nodes: [MyNode],
* });
* ```
*
* @example
* Extension with optional configuration
* ```ts
* export interface ConfigurableConfig {
*   optional?: string;
*   required: number;
* }
* export const ConfigurableExtension = defineExtension({
*   name: "configurable",
*   // The Extension's config must satisfy the full config type,
*   // but using the Extension as a dependency never requires
*   // configuration and any partial of the config can be specified
*   config: safeCast<ConfigurableConfig>({ required: 1 }),
* });
* ```
*
* @__NO_SIDE_EFFECTS__
* @lexical-inline identity
*/
function defineExtension(extension) {
	return extension;
}
/**
* Override a partial of the configuration of an Extension, to be used
* in the dependencies array of another extension, or as
* an argument to {@link buildEditorFromExtensions}.
*
* Before building the editor, configurations will be merged using
* `extension.mergeConfig(extension, config)` or {@link shallowMergeConfig} if
* this is not directly implemented by the Extension.
*
* @param args - An extension followed by one or more config partials for that extension
* @returns `[extension, config, ...configs]`
*
* @example
* ```ts
* export const ReactDecoratorExtension = defineExtension({
*   name: "react-decorator",
*   dependencies: [
*     configExtension(ReactExtension, {
*       decorators: [<ReactDecorator />]
*     }),
*   ],
* });
* ```
*
* @__NO_SIDE_EFFECTS__
* @lexical-inline args
*/
function configExtension(...args) {
	return args;
}
/**
* Used to declare a peer dependency of an extension in a type-safe way,
* requires the type parameter. The most common use case for peer dependencies
* is to avoid a direct import dependency, so you would want to use a
* type import or the import type (shown in below examples).
*
* @param name - The extension's name
* @param config - An optional config override
* @returns NormalizedPeerDependency
*
* @example
* ```ts
* import type {FooExtension} from "foo";
*
* export const PeerExtension = defineExtension({
*   name: 'PeerExtension',
*   peerDependencies: [
*     declarePeerDependency<FooExtension>("foo"),
*     declarePeerDependency<typeof import("bar").BarExtension>("bar", {config: "bar"}),
*   ],
* });
* ```
*
* @__NO_SIDE_EFFECTS__
* @lexical-inline args
*/
function declarePeerDependency(...args) {
	return args;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/extension-core/safeCast.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Explicitly and safely cast a value to a specific type when inference or
* satisfies isn't going to work as expected (often useful for the config
* property with {@link defineExtension})
*
* @__NO_SIDE_EFFECTS__
* @lexical-inline identity
*/
function safeCast(value) {
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/extension-core/shallowMergeConfig.ts
/**
* The default merge strategy for extension configuration is a shallow merge.
*
* @param config - A full config
* @param overrides - A partial config of overrides
* @returns config if there are no overrides, otherwise `{...config, ...overrides}`
*/
function shallowMergeConfig(config, overrides) {
	if (!overrides || config === overrides) return config;
	for (const k in overrides) if (config[k] !== overrides[k]) return {
		...config,
		...overrides
	};
	return config;
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/utils/classNames.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/** @internal */
function normalizeClassNames(...classNames) {
	const rval = [];
	for (const className of classNames) if (className && typeof className === "string") for (const [s] of className.matchAll(/\S+/g)) rval.push(s);
	return rval;
}
/**
* Takes an HTML element and adds the classNames passed within an array,
* ignoring any non-string types. A space can be used to add multiple classes
* eg. addClassNamesToElement(element, ['element-inner active', true, null])
* will add both 'element-inner' and 'active' as classes to that element.
* @param element - The element in which the classes are added
* @param classNames - An array defining the class names to add to the element
*/
function addClassNamesToElement(element, ...classNames) {
	const classesToAdd = normalizeClassNames(...classNames);
	if (classesToAdd.length > 0) element.classList.add(...classesToAdd);
}
/**
* Takes an HTML element and removes the classNames passed within an array,
* ignoring any non-string types. A space can be used to remove multiple classes
* eg. removeClassNamesFromElement(element, ['active small', true, null])
* will remove both the 'active' and 'small' classes from that element.
* @param element - The element in which the classes are removed
* @param classNames - An array defining the class names to remove from the element
*/
function removeClassNamesFromElement(element, ...classNames) {
	const classesToRemove = normalizeClassNames(...classNames);
	if (classesToRemove.length > 0) element.classList.remove(...classesToRemove);
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/utils/mergeRegister.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Returns a function that will execute all functions passed when called. It is generally used
* to register multiple lexical listeners and then tear them down with a single function call, such
* as React's useEffect hook.
* @example
* ```ts
* useEffect(() => {
*   return mergeRegister(
*     editor.registerCommand(...registerCommand1 logic),
*     editor.registerCommand(...registerCommand2 logic),
*     editor.registerCommand(...registerCommand3 logic)
*   )
* }, [editor])
* ```
* In this case, useEffect is returning the function returned by mergeRegister as a cleanup
* function to be executed after either the useEffect runs again (due to one of its dependencies
* updating) or the component it resides in unmounts.
* Note the functions don't necessarily need to be in an array as all arguments
* are considered to be the func argument and spread from there.
* The order of cleanup is the reverse of the argument order. Generally it is
* expected that the first "acquire" will be "released" last (LIFO order),
* because a later step may have some dependency on an earlier one.
* @param func - An array of cleanup functions meant to be executed by the returned function.
* @returns the function which executes all the passed cleanup functions.
*/
function mergeRegister(...func) {
	return () => {
		for (let i = func.length - 1; i >= 0; i--) func[i]();
		func.length = 0;
	};
}
//#endregion
//#region ../../node_modules/.pnpm/lexical@0.52.0_@typescript+typescript6@6.0.2/node_modules/lexical/src/utils/registerEventListeners.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Add several event listeners to a single `target` and return one function
* that removes all of them.
*
* This is the batch form of {@link registerEventListener}: it takes a
* `{type: listener}` object (strongly typed per event type) and shares one
* `options` value across every listener. The returned dispose function removes
* the listeners in reverse registration order (via {@link mergeRegister}).
*
* Because `options` is shared, register listeners that need a different
* `options` value (e.g. a different `capture` flag) with a separate call and
* combine the results with `mergeRegister`.
*
* @example
* ```ts
* // All five listeners share {capture: true}
* return registerEventListeners(
*   window,
*   {
*     beforeinput: report,
*     cut: report,
*     keydown: report,
*     paste: report,
*     selectionchange: report,
*   },
*   {capture: true},
* );
* ```
*
* @param target - The {@link EventTarget} to subscribe to
* @param listeners - A map of event type to listener
* @param options - Options forwarded to `add`/`removeEventListener` for every
*   listener
* @returns A function that removes every listener when called
*/
function registerEventListeners(target, listeners, options) {
	return mergeRegister(...Object.entries(listeners).map(([type, listener]) => registerEventListener(target, type, listener, options)));
}
//#endregion
export { $getDOMTextNode as $, IS_ITALIC as $a, KEY_SPACE_COMMAND as $i, $rewindSiblingCaret as $n, CUT_TAG as $r, getTextDirection as $t, flipDirection as A, isSchemaField as Aa, DELETE_WORD_COMMAND as Ai, COMMAND_PRIORITY_BEFORE_LOW as An, $getSelection as Ar, INTERNAL_$isBlock as At, $removeSlot as B, transformValue as Ba, INSERT_LINE_BREAK_COMMAND as Bi, $createParagraphNode as Bn, $createTabNode as Br, getDOMSelectionPoints as Bt, $getTextPointCaret as C, aliasTableOf as Ca, COMPOSITION_END_COMMAND as Ci, setDOMUnmanaged as Cn, $createPoint as Cr, $removeFromParent as Ct, $isSiblingCaret as D, declaredAccepts as Da, CUT_COMMAND as Di, COMMAND_PRIORITY_BEFORE_CRITICAL as Dn, $generateNodesFromRawText as Dr, $setFormatFromDOM as Dt, $isNodeCaret as E, booleanValue as Ea, COPY_COMMAND as Ei, unmountSlotContainer as En, $formatText as Er, $setDirectionFromDOM as Et, $getSlotHost as F, optional as Fa, FOCUS_COMMAND as Fi, COMMAND_PRIORITY_LOW as Fn, $isRangeSelection as Fr, getComposedSchemaFields as Ft, $cloneWithProperties as G, $isCompactExport as Ga, KEY_ARROW_RIGHT_COMMAND as Gi, $getAdjacentSiblingOrParentSiblingCaret as Gn, $isTextNode as Gr, getEditorPropertyFromDOMNode as Gt, getDeclaredSlots as H, withAccessors as Ha, INSERT_TAB_COMMAND as Hi, ParagraphNode as Hn, TabNode as Hr, getDOMSelectionRangeAndPoints as Ht, $getSlotNameWithinHost as I, rawValue as Ia, FORMAT_ELEMENT_COMMAND as Ii, COMMAND_PRIORITY_NORMAL as In, $setTextFormat as Ir, getComposedStaticRange as It, $create as J, CONTROL_OR_OTHER_KEY as Ja, KEY_DELETE_COMMAND as Ji, $insertNodeToNearestRootAtCaret as Jn, setDOMStyleFromCSS as Jr, getRegisteredNode as Jt, $cloneWithPropertiesEphemeral as K, $withCompactExport as Ka, KEY_ARROW_UP_COMMAND as Ki, $getCaretRangeInDirection as Kn, TextNode as Kr, getNearestEditorFromDOMNode as Kt, $getSlotNames as L, setterDefaultOf as La, FORMAT_TEXT_COMMAND as Li, DEFAULT_EDITOR_DOM_CONFIG as Ln, $updateDOMSelection as Lr, getDOMOwnerDocument as Lt, $getSelectionSlotFrame as M, nullable as Ma, DRAGOVER_COMMAND as Mi, COMMAND_PRIORITY_CRITICAL as Mn, $insertNodes as Mr, getActiveElement as Mt, $getSlot as N, numberValue as Na, DRAGSTART_COMMAND as Ni, COMMAND_PRIORITY_EDITOR as Nn, $isBlockElementNode as Nr, getActiveElementDeep as Nt, $isTextPointCaret as O, enumValue as Oa, DELETE_CHARACTER_COMMAND as Oi, COMMAND_PRIORITY_BEFORE_EDITOR as On, $getCharacterOffsets as Or, $setSelection as Ot, $getSlotFrame as P, objectValue as Pa, DROP_COMMAND as Pi, COMMAND_PRIORITY_HIGH as Pn, $isNodeSelection as Pr, getComposedEventTarget as Pt, $getDOMSlot as Q, IS_HIGHLIGHT as Qa, KEY_MODIFIER_COMMAND as Qi, $removeTextFromCaretRange as Qn, COMPOSITION_START_TAG as Qr, getStaticNodeConfig as Qt, $isSlotChild as R, setterTableOf as Ra, INDENT_CONTENT_COMMAND as Ri, createEditor as Rn, INTERNAL_$expandSelectionToWholeDocument as Rr, getDOMSelection as Rt, $getTextNodeOffset as S, createState as Sa, CLICK_COMMAND as Si, resetRandomKey as Sn, $createNodeSelection as Sr, $onUpdate as St, $isChildCaret as T, arrayValue as Ta, CONTROLLED_TEXT_INSERTION_COMMAND as Ti, toggleTextFormatType as Tn, $createRangeSelectionFromDom as Tr, $setCompositionKey as Tt, $addUpdateTag as U, withField as Ua, KEY_ARROW_DOWN_COMMAND as Ui, $caretFromPoint as Un, $createTextNode as Ur, getDOMShadowRoots as Ut, $setSlot as V, unionValue as Va, INSERT_PARAGRAPH_COMMAND as Vi, $isParagraphNode as Vn, $isTabNode as Vr, getDOMSelectionRange as Vt, $applyNodeReplacement as W, $exportNodeJSON as Wa, KEY_ARROW_LEFT_COMMAND as Wi, $caretRangeFromSelection as Wn, $isInlineFormattable as Wr, getDOMTextNode as Wt, $findMatchingParent as X, IS_BOLD as Xa, KEY_ENTER_COMMAND as Xi, $isExtendableTextPointCaret as Xn, COLLABORATION_TAG as Xr, getRegisteredSubtypeMap as Xt, $createChildrenArray as Y, IS_ALL_FORMATTING as Ya, KEY_DOWN_COMMAND as Yi, $isBlockFullySelected as Yn, setDOMStyleObject as Yr, getRegisteredNodeOrThrow as Yt, $getAdjacentNode as Z, IS_CODE as Za, KEY_ESCAPE_COMMAND as Zi, $normalizeCaret as Zn, COMPOSITION_END_TAG as Zr, getRootOwnerDocument as Zt, $getChildCaretOrSelf as _, $getWritableNodeState as _a, BLUR_COMMAND as _i, isSelectionWithinEditor as _n, $assumeActiveEditor as _r, $isTokenOrSegmented as _t, removeClassNamesFromElement as a, REDO_COMMAND as aa, SKIP_DOM_SELECTION_TAG as ai, isDOMTextNode as an, TEXT_TYPE_TO_FORMAT as ao, $isLineBreakNode as ar, $getNodeByKey as at, $getCommonAncestorResultBranchOrder as b, NODE_STATE_LATEST as ba, CLEAR_EDITOR_COMMAND as bi, mountSlotContainer as bn, $parseSerializedNode as br, $needsBlockCursorBeside as bt, configExtension as c, SELECTION_INSERT_CLIPBOARD_NODES_COMMAND as ca, $isLexicalNode as ci, isExactShortcutMatch as cn, IS_ANDROID as co, isOnlyChildInBlockNode as cr, $getRoot as ct, $comparePointCaretNext as d, UNDO_COMMAND as da, registerEventListener as di, isHTMLTableCellElement as dn, IS_APPLE_WEBKIT as do, $isRootNode as dr, $isElementDOMSlot as dt, KEY_TAB_COMMAND as ea, HISTORIC_TAG as ei, isBlockDomNode as en, IS_STRIKETHROUGH as eo, $setPointFromCaret as er, $getDocument as et, $extendCaretToRange as f, createCommand as fa, createRefCountedRegistry as fi, isHTMLTableRowElement as fn, IS_CHROME as fo, RootNode as fr, $isInlineElementOrDecoratorNode as ft, $getChildCaret as g, $getStateChange as ga, BEFORE_INPUT_COMMAND as gi, isSelectionCapturedInDecoratorInput as gn, invariant as go, ElementNode as gr, $isShadowRootNode as gt, $getCaretRange as h, $getState as ha, compileKeyboardShortcuts as hi, isModifierMatch as hn, IS_SAFARI as ho, $isElementNode as hr, $isSelectionCapturedInDecoratorInput as ht, normalizeClassNames as i, PASTE_COMMAND as ia, SKIP_COLLAB_TAG as ii, isDOMShadowRoot as in, NODE_STATE_KEY as io, $createLineBreakNode as ir, $getNearestRootOrShadowRoot as it, makeStepwiseIterator as j, nodeSchema as ja, DRAGEND_COMMAND as ji, COMMAND_PRIORITY_BEFORE_NORMAL as jn, $getTextContent as jr, findAllLexicalElementsDeep as jt, $isTextPointCaretSlice as k, getterTableOf as ka, DELETE_LINE_COMMAND as ki, COMMAND_PRIORITY_BEFORE_HIGH as kn, $getPreviousSelection as kr, $splitNode as kt, declarePeerDependency as l, SELECT_ALL_COMMAND as la, buildImportMap as li, isHTMLAnchorElement as ln, IS_ANDROID_CHROME as lo, ArtificialNode__DO_NOT_USE as lr, $hasAncestor as lt, $getCaretInDirection as m, $normalizeSelection as ma, CONTROL_OR_META as mi, isLexicalEditor as mn, IS_IOS as mo, DecoratorNode as mr, $isRootOrShadowRoot as mt, mergeRegister as n, MOVE_TO_START as na, HISTORY_PUSH_TAG as ni, isDOMDocumentNode as nn, IS_SUPERSCRIPT as no, $splitAtPointCaretNext as nr, $getEditorDOMRenderConfig as nt, shallowMergeConfig as o, REMOVE_TEXT_COMMAND as oa, SKIP_SCROLL_INTO_VIEW_TAG as oi, isDOMUnmanaged as on, CAN_USE_BEFORE_INPUT as oo, LineBreakNode as or, $getNodeByKeyOrThrow as ot, $getAdjacentChildCaret as p, warnOnlyOnce as pa, CONTROL_OR_ALT as pi, isInlineDomNode as pn, IS_FIREFOX as po, $isDecoratorNode as pr, $isLeafNode as pt, $copyNode as q, LEXICAL_VERSION as qa, KEY_BACKSPACE_COMMAND as qi, $getChildCaretAtIndex as qn, getStyleObjectFromCSS as qr, getParentElement as qt, addClassNamesToElement as r, OUTDENT_CONTENT_COMMAND as ra, PASTE_TAG as ri, isDOMNode as rn, IS_UNDERLINE as ro, $updateRangeSelectionFromCaretRange as rr, $getNearestNodeFromDOMNode as rt, safeCast as s, SELECTION_CHANGE_COMMAND as sa, SKIP_SELECTION_FOCUS_TAG as si, isDocumentFragment as sn, CAN_USE_DOM as so, isLastChildInBlockNode as sr, $getNodeFromDOMNode as st, registerEventListeners as t, MOVE_TO_END as ta, HISTORY_MERGE_TAG as ti, isDOMCapturingSelection as tn, IS_SUBSCRIPT as to, $setSelectionFromCaretRange as tr, $getEditor as tt, defineExtension as u, SET_TEXT_FORMAT_COMMAND as ua, stopLexicalPropagation as ui, isHTMLElement as un, IS_APPLE as uo, $isEditorState as ur, $hasUpdateTag as ut, $getCollapsedCaretRange as v, $setState as va, CAN_REDO_COMMAND as vi, iterStaticNodeConfigChain as vn, $flushSyncAfterUpdate as vr, $isTokenOrTab as vt, $getTextPointCaretSlice as w, aliasedValue as wa, COMPOSITION_START_COMMAND as wi, setNodeIndentFromDOM as wn, $createRangeSelection as wr, $selectAll as wt, $getSiblingCaret as x, createSharedNodeState as xa, CLEAR_HISTORY_COMMAND as xi, removeFromParent as xn, isCurrentlyReadOnlyMode as xr, $nodesOfType as xt, $getCommonAncestor as y, NODE_STATE_DIRECT as ya, CAN_UNDO_COMMAND as yi, keyboardEventMaskForPlatform as yn, $fullReconcile as yr, $markSlotEditable as yt, $isSlotHost as z, stringValue as za, INPUT_COMMAND as zi, getTransformSetFromKlass as zn, tokenizeRawText as zr, getDOMSelectionFromTarget as zt };
