import { $n as $rewindSiblingCaret, Ar as $getSelection, Br as $createTabNode, Bt as getDOMSelectionPoints, C as $getTextPointCaret, Ei as COPY_COMMAND, Fr as $isRangeSelection, Gr as $isTextNode, Gt as getEditorPropertyFromDOMNode, Kn as $getCaretRangeInDirection, L as $getSlotNames, M as $getSelectionSlotFrame, N as $getSlot, O as $isTextPointCaret, Ot as $setSelection, Pr as $isNodeSelection, Rt as getDOMSelection, T as $isChildCaret, Un as $caretFromPoint, Ut as getDOMShadowRoots, Wa as $exportNodeJSON, Wn as $caretRangeFromSelection, Zn as $normalizeCaret, Zt as getRootOwnerDocument, _n as isSelectionWithinEditor, br as $parseSerializedNode, c as configExtension, ca as SELECTION_INSERT_CLIPBOARD_NODES_COMMAND, ct as $getRoot, d as $comparePointCaretNext, g as $getChildCaret, go as invariant, h as $getCaretRange, hr as $isElementNode, in as isDOMShadowRoot, jt as findAllLexicalElementsDeep, mn as isLexicalEditor, nr as $splitAtPointCaretNext, o as shallowMergeConfig, qn as $getChildCaretAtIndex, qt as getParentElement, rt as $getNearestNodeFromDOMNode, s as safeCast, tr as $setSelectionFromCaretRange, tt as $getEditor, u as defineExtension, un as isHTMLElement, v as $getCollapsedCaretRange, x as $getSiblingCaret, zr as tokenizeRawText } from "./src-BWdqgNjM.js";
import { T as getPeerDependencyFromEditor, w as $getPeerDependency } from "./src-DjbHpMmC.js";
import { _ as $sliceSelectedTextNodeContent } from "./src-jZHBqyIl.js";
import { L as objectKlassEquals } from "./src-9-5QzbBl.js";
import { T as ImportSourceDataTransfer, a as $generateNodesFromDOM, i as $generateHtmlFromNodes, l as CoreImportExtension, q as contextValue, u as $generateNodesFromDOMViaExtension, w as ImportSource } from "./src-CAtUi_gH.js";
//#region ../../node_modules/.pnpm/@lexical+clipboard@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/clipboard/src/caretFromPoint.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function isWithinComposedTree(node, rootElement) {
	for (let current = node; current !== null;) {
		if (current === rootElement) return true;
		current = getParentElement(current);
	}
	return false;
}
function findTextOffsetAtPoint(x, y, container, doc) {
	const range = doc.createRange();
	const vDist = (r) => y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
	const hDist = (r) => x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
	const walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT);
	let bestNode = null;
	let bestV = Infinity;
	let bestH = Infinity;
	for (let n = walker.nextNode(); n; n = walker.nextNode()) {
		range.selectNodeContents(n);
		for (const r of range.getClientRects()) {
			const v = vDist(r);
			const h = hDist(r);
			if (v < bestV || v === bestV && h < bestH) {
				bestV = v;
				bestH = h;
				bestNode = n;
			}
		}
	}
	if (bestNode === null) return null;
	let bestOffset = 0;
	let offV = Infinity;
	let offH = Infinity;
	for (let i = 0; i <= bestNode.length; i++) {
		range.setStart(bestNode, i);
		range.collapse(true);
		const r = range.getBoundingClientRect();
		const v = vDist(r);
		const h = Math.abs(x - r.left);
		if (v < offV || v === offV && h < offH) {
			offV = v;
			offH = h;
			bestOffset = i;
		}
	}
	return {
		node: bestNode,
		offset: bestOffset
	};
}
/** @internal */
function caretFromPoint(x, y, rootElement = null) {
	const doc = getRootOwnerDocument(rootElement);
	const shadowRoots = rootElement ? getDOMShadowRoots(rootElement) : [];
	const hasShadow = rootElement !== null && shadowRoots.length > 0;
	if (hasShadow && typeof doc.caretPositionFromPoint === "function") {
		const caretPosition = doc.caretPositionFromPoint(x, y, { shadowRoots });
		if (caretPosition !== null && isWithinComposedTree(caretPosition.offsetNode, rootElement)) return {
			node: caretPosition.offsetNode,
			offset: caretPosition.offset
		};
	}
	if (hasShadow) {
		const rootNode = rootElement.getRootNode();
		if (isDOMShadowRoot(rootNode)) {
			const element = rootNode.elementFromPoint(x, y);
			if (element !== null && rootElement.contains(element)) {
				const result = findTextOffsetAtPoint(x, y, element, doc);
				if (result !== null) return result;
			}
		}
	}
	if (typeof doc.caretRangeFromPoint === "function") {
		const range = doc.caretRangeFromPoint(x, y);
		if (range === null) return null;
		return {
			node: range.startContainer,
			offset: range.startOffset
		};
	} else if (typeof doc.caretPositionFromPoint === "function") {
		const caretPosition = doc.caretPositionFromPoint(x, y);
		if (caretPosition === null) return null;
		return {
			node: caretPosition.offsetNode,
			offset: caretPosition.offset
		};
	}
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+clipboard@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/clipboard/src/ClipboardImportExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Default per-MIME-type weights reproducing the legacy
* `$insertDataTransferForRichText` ordering:
*
* `application/x-lexical-editor` (0) → `text/html` (10) →
* `text/plain` (20) → `text/uri-list` (30).
*
* Gaps between weights let third-party MIME types slot in (e.g. weight
* 5 to run between lexical and html). Apps can also override built-in
* weights to demote them.
*
* @experimental
*/
var DEFAULT_IMPORT_MIME_TYPE_PRIORITY = {
	"application/x-lexical-editor": 0,
	"text/html": 10,
	"text/plain": 20,
	"text/uri-list": 30
};
function trustHTML(html) {
	if (window.trustedTypes && window.trustedTypes.createPolicy) return window.trustedTypes.createPolicy("lexical", { createHTML: (input) => input }).createHTML(html);
	return html;
}
/**
* Default handler for `'application/x-lexical-editor'`: parse the JSON,
* verify the namespace, and insert the serialized nodes.
*/
var $defaultLexicalEditorImporter = (data, selection, $next) => {
	try {
		const editor = $getEditor();
		const payload = JSON.parse(data);
		if (payload && payload.namespace === editor._config.namespace && Array.isArray(payload.nodes)) {
			$insertGeneratedNodes(editor, $generateNodesFromSerializedNodes(payload.nodes), selection);
			return true;
		}
	} catch (error) {
		console.error(error);
	}
	return $next();
};
/**
* Default handler for `'text/html'`: parse the HTML and run the legacy
* `$generateNodesFromDOM`. Override (or stack a higher-priority handler
* on top) to route HTML pastes through {@link DOMImportExtension} or any
* custom pipeline. See {@link $generateNodesFromDOMViaExtension} for the
* built-in `DOMImportExtension` adapter.
*/
var $defaultHtmlImporter = (data, selection, $next) => {
	try {
		const editor = $getEditor();
		const dom = new DOMParser().parseFromString(trustHTML(data), "text/html");
		$insertGeneratedNodes(editor, $generateNodesFromDOM(editor, dom), selection);
		return true;
	} catch (error) {
		console.error(error);
		return $next();
	}
};
/**
* Default handler for `'text/plain'`. On a RangeSelection, drive the
* insertion off {@link tokenizeRawText} so each `\n` becomes a real
* paragraph break via `insertParagraph` (preserving current text
* format / style on the surrounding `insertText` calls). For other
* selection types, defer to the selection's own `insertRawText`.
*/
var $defaultPlainTextImporter = (data, selection) => {
	if (!$isRangeSelection(selection)) {
		selection.insertRawText(data);
		return true;
	}
	if (selection !== $getSelection()) $setSelection(selection);
	const withCurrentRange = (fn) => {
		const cur = $getSelection();
		if ($isRangeSelection(cur)) fn(cur);
	};
	tokenizeRawText(data, {
		linebreak: () => withCurrentRange((cur) => cur.insertParagraph()),
		tab: () => withCurrentRange((cur) => cur.insertNodes([$createTabNode()])),
		text: (part) => withCurrentRange((cur) => cur.insertText(part))
	});
	return true;
};
/**
* The default per-MIME-type handler stacks reproducing the legacy
* {@link $insertDataTransferForRichText} behavior exactly. Stacked
* extensions append on top of these.
*
* @experimental
*/
var DEFAULT_IMPORT_MIME_TYPE = {
	"application/x-lexical-editor": [$defaultLexicalEditorImporter],
	"text/html": [$defaultHtmlImporter],
	"text/plain": [$defaultPlainTextImporter],
	"text/uri-list": [$defaultPlainTextImporter]
};
function $callImportMimeTypeFunctionStack(fns, data, selection, dataTransfer) {
	if (!fns) return false;
	const callAt = (i) => fns[i] ? fns[i](data, selection, callAt.bind(null, i - 1), dataTransfer) : false;
	return callAt(fns.length - 1);
}
/**
* Sort the MIME types that have a registered handler stack by their
* configured priority weight (ascending). Types with no explicit weight
* sort after all weighted types, in lexical order, so unknown types
* remain reachable but never preempt a known one.
*/
function orderedMimeTypes(config) {
	return Object.keys(config.$importMimeType).filter((k) => config.$importMimeType[k] !== void 0).sort((a, b) => {
		const wa = config.priority[a];
		const wb = config.priority[b];
		if (wa === void 0 && wb === void 0) return a < b ? -1 : a > b ? 1 : 0;
		if (wa === void 0) return 1;
		if (wb === void 0) return -1;
		return wa - wb;
	});
}
function $runImport(config, dataTransfer, selection) {
	const plainString = dataTransfer.getData("text/plain");
	for (const mime of orderedMimeTypes(config)) {
		const data = dataTransfer.getData(mime);
		if (!data) continue;
		if (mime === "text/html" && data === plainString) continue;
		if ($callImportMimeTypeFunctionStack(config.$importMimeType[mime], data, selection, dataTransfer)) return true;
	}
	return false;
}
var DEFAULT_OUTPUT = {
	$importMimeType: DEFAULT_IMPORT_MIME_TYPE,
	$insertDataTransfer: (dataTransfer, selection) => $runImport({
		$importMimeType: DEFAULT_IMPORT_MIME_TYPE,
		priority: DEFAULT_IMPORT_MIME_TYPE_PRIORITY
	}, dataTransfer, selection),
	priority: DEFAULT_IMPORT_MIME_TYPE_PRIORITY
};
/**
* @internal
*
* Look up the {@link ClipboardImportOutput} on the active editor. Returns
* a static default-backed output when no {@link ClipboardImportExtension}
* is configured, so callers can always invoke `output.$insertDataTransfer`
* regardless of whether the editor opted in.
*/
function $getImportOutput() {
	const dep = $getPeerDependency(ClipboardImportExtension.name);
	return dep ? dep.output : DEFAULT_OUTPUT;
}
/**
* @experimental
*
* Mirror of {@link GetClipboardDataExtension} for the import direction.
* Holds a per-MIME-type stack of {@link ImportMimeTypeFunction}s.
*
* @example
* Route `text/html` pastes through {@link DOMImportExtension}, leaving the
* defaults for other MIME types untouched:
* ```ts
* import {configExtension, defineExtension, $getEditor} from 'lexical';
* import {
*   ClipboardImportExtension,
*   $insertGeneratedNodes,
* } from '@lexical/clipboard';
* import {
*   contextValue,
*   DOMImportExtension,
*   ImportSource,
*   ImportSourceDataTransfer,
*   $generateNodesFromDOMViaExtension,
* } from '@lexical/html';
*
* defineExtension({
*   name: 'app',
*   dependencies: [
*     DOMImportExtension,
*     configExtension(ClipboardImportExtension, {
*       $importMimeType: {
*         'text/html': [
*           (html, selection, _$next, dataTransfer) => {
*             const parser = new DOMParser();
*             const dom = parser.parseFromString(html, 'text/html');
*             const nodes = $generateNodesFromDOMViaExtension(dom, {
*               context: [
*                 contextValue(ImportSource, 'paste'),
*                 contextValue(ImportSourceDataTransfer, dataTransfer),
*               ],
*             });
*             $insertGeneratedNodes($getEditor(), nodes, selection);
*             return true;
*           },
*         ],
*       },
*     }),
*   ],
* });
* ```
*/
var ClipboardImportExtension = defineExtension({
	build: (_editor, config) => ({
		$importMimeType: config.$importMimeType,
		$insertDataTransfer: (dataTransfer, selection) => $runImport(config, dataTransfer, selection),
		priority: config.priority
	}),
	config: safeCast({
		$importMimeType: DEFAULT_IMPORT_MIME_TYPE,
		priority: DEFAULT_IMPORT_MIME_TYPE_PRIORITY
	}),
	mergeConfig(config, partial) {
		const merged = shallowMergeConfig(config, partial);
		if (partial.$importMimeType) {
			const $importMimeType = { ...config.$importMimeType };
			for (const [k, v] of Object.entries(partial.$importMimeType)) if (v) {
				const prev = $importMimeType[k];
				$importMimeType[k] = prev ? [...prev, ...v] : v;
			}
			merged.$importMimeType = $importMimeType;
		}
		if (partial.priority) merged.priority = {
			...config.priority,
			...partial.priority
		};
		return merged;
	},
	name: "@lexical/clipboard/Import"
});
defineExtension({
	dependencies: [CoreImportExtension, configExtension(ClipboardImportExtension, { $importMimeType: { "text/html": [(html, selection, _$next, dataTransfer) => {
		const dom = new DOMParser().parseFromString(trustHTML(html), "text/html");
		const nodes = $generateNodesFromDOMViaExtension(dom, { context: [contextValue(ImportSource, "paste"), contextValue(ImportSourceDataTransfer, dataTransfer)] });
		$insertGeneratedNodes($getEditor(), nodes, selection);
		return true;
	}] } })],
	name: "@lexical/clipboard/DOMImport"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+clipboard@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/clipboard/src/clipboard.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Returns the *currently selected* Lexical content as an HTML string, relying on the
* logic defined in the exportDOM methods on the LexicalNode classes. Note that
* this will not return the HTML content of the entire editor (unless all the content is included
* in the current selection).
*
* @param editor - LexicalEditor instance to get HTML content from
* @param selection - The selection to use (default is $getSelection())
* @returns a string of HTML content
*/
function $getHtmlContent(editor, selection = $getSelection()) {
	if (selection == null) invariant(false, "Expected valid LexicalSelection");
	if ($isRangeSelection(selection) && selection.isCollapsed() || selection.getNodes().length === 0) return "";
	return $generateHtmlFromNodes(editor, selection);
}
/**
* Returns the *currently selected* Lexical content as a JSON string, relying on the
* logic defined in the exportJSON methods on the LexicalNode classes. Note that
* this will not return the JSON content of the entire editor (unless all the content is included
* in the current selection).
*
* @param editor  - LexicalEditor instance to get the JSON content from
* @param selection - The selection to use (default is $getSelection())
* @returns
*/
function $getLexicalContent(editor, selection = $getSelection()) {
	if (selection == null) invariant(false, "Expected valid LexicalSelection");
	if ($isRangeSelection(selection) && selection.isCollapsed() || selection.getNodes().length === 0) return null;
	return JSON.stringify($generateJSONFromSelectedNodes(editor, selection));
}
/**
* Insert the contents of `dataTransfer` at `selection` using the rich-text
* import pipeline (`application/x-lexical-editor` → `text/html` → `text/plain`
* → `text/uri-list`, in descending order of priority).
*
* Every payload type leaves the editor's selection after the inserted content,
* so `selection` must be a live selection this update may write to — the one
* from `$getSelection()`, or one built with `$createRangeSelection()`. Passing
* a selection read out of an already-committed EditorState is not supported and
* raises an invariant in development builds.
*
* @param dataTransfer an object conforming to the [DataTransfer interface] (https://html.spec.whatwg.org/multipage/dnd.html#the-datatransfer-interface)
* @param selection the selection to use as the insertion point for the content in the DataTransfer object
* @param _editor unused; retained for backwards compatibility. Safe to
*   omit on new call sites.
*/
function $insertDataTransferForRichText(dataTransfer, selection, _editor) {
	$getImportOutput().$insertDataTransfer(dataTransfer, selection);
}
var LEXICAL_DRAG_MIME_TYPE = "application/x-lexical-drag";
/**
* Populate `dataTransfer` with a marker identifying the current editor as a
* drag source. Pair this with {@link $handleRichTextDrop} or
* {@link $handlePlainTextDrop} on the drop side to get cut-and-paste semantics
* for drags that end in a different editor.
*
* Only the source editor's key needs to round-trip — the source's
* RangeSelection itself is preserved on the source editor between drag start
* and drop (Lexical suppresses selectionchange during drag), so the drop
* handler reads it directly via `$getSelection()` on the resolved source
* editor.
*
* Callers typically invoke this from a DRAGSTART_COMMAND handler alongside
* {@link setLexicalClipboardDataTransfer} (so that the dragged content itself
* round-trips with full node fidelity).
*/
function $writeDragSourceToDataTransfer(dataTransfer, editor) {
	const marker = { editorKey: editor.getKey() };
	dataTransfer.setData(LEXICAL_DRAG_MIME_TYPE, JSON.stringify(marker));
}
function isLexicalDragMarker(value) {
	return value !== null && typeof value === "object" && "editorKey" in value && typeof value.editorKey === "string";
}
function readDragMarker(dataTransfer) {
	const raw = dataTransfer.getData(LEXICAL_DRAG_MIME_TYPE);
	if (!raw) return null;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	return isLexicalDragMarker(parsed) ? parsed : null;
}
function findEditorRootByKey(key, doc) {
	for (const el of findAllLexicalElementsDeep(doc)) {
		const editor = getEditorPropertyFromDOMNode(el);
		if (isLexicalEditor(editor) && editor.getKey() === key && isHTMLElement(el)) return el;
	}
	return null;
}
function $resolveDropPointCaret(event, editor) {
	const hit = caretFromPoint(event.clientX, event.clientY, editor.getRootElement());
	if (hit === null) return null;
	const node = $getNearestNodeFromDOMNode(hit.node);
	if (node === null) return null;
	if ($isTextNode(node)) return $getTextPointCaret(node, "next", hit.offset);
	if ($isElementNode(node)) return $getChildCaretAtIndex(node, hit.offset, "next");
	const parent = node.getParent();
	if (parent === null) return null;
	return $getChildCaretAtIndex(parent, node.getIndexWithinParent() + 1, "next");
}
function $normalizeDropBoundary(point) {
	let caret = point;
	if ($isTextPointCaret(caret)) {
		if (caret.offset === 0) caret = $rewindSiblingCaret(caret.getSiblingCaret());
		else if (caret.offset === caret.origin.getTextContentSize()) caret = caret.getSiblingCaret();
		else return caret;
	}
	for (;;) {
		const parent = caret.getParentAtCaret();
		if (parent === null || !parent.isInline() || parent.isShadowRoot()) return caret;
		if ($isChildCaret(caret)) caret = $rewindSiblingCaret($getSiblingCaret(parent, "next"));
		else if (caret.getNodeAtCaret() === null) caret = $getSiblingCaret(parent, "next");
		else return caret;
	}
}
function $isDropCaretInsideSelection(dropCaret, selection) {
	const { anchor: start, focus: end } = $getCaretRangeInDirection($caretRangeFromSelection(selection), "next");
	const drop = $normalizeDropBoundary(dropCaret);
	return $comparePointCaretNext($normalizeDropBoundary(start), drop) <= 0 && $comparePointCaretNext(drop, $normalizeDropBoundary(end)) <= 0;
}
function $doDrop(event, editor, $insertDataTransfer) {
	const dataTransfer = event.dataTransfer;
	if (dataTransfer === null) return false;
	const marker = readDragMarker(dataTransfer);
	if (marker === null) return false;
	const dropCaret = $resolveDropPointCaret(event, editor);
	if (dropCaret === null) return false;
	const isSameEditorDrag = marker.editorKey === editor.getKey();
	const currentSelection = $getSelection();
	if (isSameEditorDrag) {
		if (!$isRangeSelection(currentSelection) || currentSelection.isCollapsed()) return false;
		if ($isDropCaretInsideSelection(dropCaret, currentSelection)) {
			event.preventDefault();
			return true;
		}
	}
	const normalizedDropCaret = $normalizeCaret(dropCaret);
	const stableDropCaret = $isTextPointCaret(normalizedDropCaret) ? $splitAtPointCaretNext(normalizedDropCaret) : normalizedDropCaret;
	if (stableDropCaret === null) return false;
	const oppositeDropCaret = stableDropCaret.getFlipped();
	if (isSameEditorDrag && $isRangeSelection(currentSelection)) currentSelection.removeText();
	const insertCaret = stableDropCaret.origin.isAttached() ? stableDropCaret : oppositeDropCaret;
	invariant(insertCaret.origin.isAttached(), "$doDrop: drop position was removed by source deletion");
	$insertDataTransfer(dataTransfer, $setSelectionFromCaretRange($getCollapsedCaretRange(insertCaret)), editor);
	if (!isSameEditorDrag) {
		const rootElement = editor.getRootElement();
		const doc = rootElement ? rootElement.ownerDocument : null;
		const sourceRoot = doc ? findEditorRootByKey(marker.editorKey, doc) : null;
		if (sourceRoot !== null) sourceRoot.dispatchEvent(new InputEvent("beforeinput", {
			bubbles: true,
			cancelable: true,
			inputType: "deleteByDrag"
		}));
	}
	event.preventDefault();
	return true;
}
/**
* Drop handler for rich-text editors. Inserts the DataTransfer payload via
* {@link $insertDataTransferForRichText} at the drop caret and, when the drag
* originated from a Lexical editor (marked via
* {@link $writeDragSourceToDataTransfer} on DRAGSTART), removes the source
* range — producing cut-and-paste semantics whether the drop is in the same
* editor or a different one on the same page.
*/
function $handleRichTextDrop(event, editor) {
	return $doDrop(event, editor, $insertDataTransferForRichText);
}
/**
* Inserts Lexical nodes into the editor using different strategies depending on
* some simple selection-based heuristics. If you're looking for a generic way to
* to insert nodes into the editor at a specific selection point, you probably want
* {@link lexical.$insertNodes}
*
* @param editor LexicalEditor instance to insert the nodes into.
* @param nodes The nodes to insert.
* @param selection The selection to insert the nodes into.
*/
function $insertGeneratedNodes(editor, nodes, selection) {
	if (!editor.dispatchCommand(SELECTION_INSERT_CLIPBOARD_NODES_COMMAND, {
		nodes,
		selection
	})) {
		selection.insertNodes(nodes);
		$updateSelectionOnInsert(selection);
	}
}
function $updateSelectionOnInsert(selection) {
	if ($isRangeSelection(selection) && selection.isCollapsed()) {
		const anchor = selection.anchor;
		let nodeToInspect = null;
		const anchorCaret = $caretFromPoint(anchor, "previous");
		if (anchorCaret) {
			if ($isTextPointCaret(anchorCaret)) nodeToInspect = anchorCaret.origin;
			else {
				const range = $getCaretRange(anchorCaret, $getChildCaret($getRoot(), "next").getFlipped());
				for (const caret of range) if ($isTextNode(caret.origin)) {
					nodeToInspect = caret.origin;
					break;
				} else if ($isElementNode(caret.origin) && !caret.origin.isInline()) break;
			}
		}
		if (nodeToInspect && $isTextNode(nodeToInspect)) {
			const newFormat = nodeToInspect.getFormat();
			const newStyle = nodeToInspect.getStyle();
			if (selection.format !== newFormat || selection.style !== newStyle) {
				selection.format = newFormat;
				selection.style = newStyle;
				selection.dirty = true;
			}
		}
	}
}
function $appendNodesToJSON(editor, selection, currentNode, targetArray = []) {
	let shouldInclude = selection !== null ? currentNode.isSelected(selection) : true;
	const shouldExclude = $isElementNode(currentNode) && currentNode.excludeFromCopy("clone");
	let target = currentNode;
	if (selection !== null && $isTextNode(target)) target = $sliceSelectedTextNodeContent(selection, target, "clone");
	const serializedNode = $exportNodeJSON(target);
	const children = $isElementNode(target) ? target.getChildren() : [];
	const childTarget = serializedNode.children || [];
	if ($isTextNode(target) && target.getTextContentSize() === 0) shouldInclude = false;
	const childSelection = shouldInclude && $isNodeSelection(selection) && $isElementNode(currentNode) ? null : selection;
	for (let i = 0; i < children.length; i++) {
		const childNode = children[i];
		const shouldIncludeChild = $appendNodesToJSON(editor, childSelection, childNode, childTarget);
		if (!shouldInclude && $isElementNode(currentNode) && shouldIncludeChild && currentNode.extractWithChild(childNode, selection, "clone")) shouldInclude = true;
	}
	if (shouldInclude && !shouldExclude) {
		const slotNames = $getSlotNames(target);
		if (slotNames.length > 0) {
			const serializedSlots = {};
			for (const name of slotNames) {
				const slotNode = $getSlot(target, name);
				invariant(slotNode !== null, "LexicalNode: Node %s has slot \"%s\" but it resolved to no node during export.", target.constructor.name, name);
				const slotArray = [];
				$appendNodesToJSON(editor, null, slotNode, slotArray);
				invariant(slotArray.length === 1 && !($isElementNode(slotNode) && slotNode.excludeFromCopy("clone")), "LexicalNode: slot \"%s\" on %s did not serialize to exactly the slot value node (got %s nodes); a slot value must not be excluded from copy.", name, target.constructor.name, String(slotArray.length));
				serializedSlots[name] = slotArray[0];
			}
			serializedNode.$slots = serializedSlots;
		}
	}
	if (shouldInclude && !shouldExclude) targetArray.push(serializedNode);
	else for (let i = 0; i < childTarget.length; i++) targetArray.push(childTarget[i]);
	return shouldInclude;
}
/**
* Gets the Lexical JSON of the nodes inside the provided Selection.
*
* @param editor LexicalEditor to get the JSON content from.
* @param selection Selection to get the JSON content from.
* @returns an object with the editor namespace and a list of serializable nodes as JavaScript objects.
*/
function $generateJSONFromSelectedNodes(editor, selection) {
	const nodes = [];
	const root = $getRoot();
	const slotFrame = $getSelectionSlotFrame(selection);
	const topLevelChildren = ($isElementNode(slotFrame) ? slotFrame : root).getChildren();
	for (let i = 0; i < topLevelChildren.length; i++) {
		const topLevelNode = topLevelChildren[i];
		$appendNodesToJSON(editor, selection, topLevelNode, nodes);
	}
	return {
		namespace: editor._config.namespace,
		nodes
	};
}
/**
* This method takes an array of objects conforming to the BaseSerializedNode interface and returns
* an Array containing instances of the corresponding LexicalNode classes registered on the editor.
* Normally, you'd get an Array of BaseSerialized nodes from {@link $generateJSONFromSelectedNodes}
*
* @param serializedNodes an Array of objects conforming to the BaseSerializedNode interface.
* @returns an Array of Lexical Node objects.
*/
function $generateNodesFromSerializedNodes(serializedNodes) {
	const nodes = [];
	for (const serializedNode of serializedNodes) nodes.push($parseSerializedNode(serializedNode));
	return nodes;
}
var EVENT_LATENCY = 50;
var clipboardEventTimeout = null;
/**
* Copies the content of the current selection to the clipboard in
* text/plain, text/html, and application/x-lexical-editor (Lexical JSON)
* formats.
*
* @param editor the LexicalEditor instance to copy content from
* @param event the native browser ClipboardEvent to add the content to.
* @returns
*/
async function copyToClipboard(editor, event, data) {
	if (clipboardEventTimeout !== null) return false;
	if (event !== null) return new Promise((resolve, reject) => {
		editor.update(() => {
			resolve($copyToClipboardEvent(editor, event, data));
		});
	});
	const rootElement = editor.getRootElement();
	const editorWindow = editor._window || window;
	const windowDocument = editorWindow.document;
	const domSelection = getDOMSelection(editorWindow);
	if (rootElement === null || domSelection === null) return false;
	const element = windowDocument.createElement("span");
	element.style.position = "fixed";
	element.style.top = "-1000px";
	element.append(windowDocument.createTextNode("#"));
	rootElement.append(element);
	const range = windowDocument.createRange();
	range.setStart(element, 0);
	range.setEnd(element, 1);
	domSelection.removeAllRanges();
	domSelection.addRange(range);
	return new Promise((resolve, reject) => {
		const removeListener = editor.registerCommand(COPY_COMMAND, (secondEvent) => {
			if (objectKlassEquals(secondEvent, ClipboardEvent)) {
				removeListener();
				if (clipboardEventTimeout !== null) {
					editorWindow.clearTimeout(clipboardEventTimeout);
					clipboardEventTimeout = null;
				}
				resolve($copyToClipboardEvent(editor, secondEvent, data));
			}
			return true;
		}, 4);
		clipboardEventTimeout = editorWindow.setTimeout(() => {
			removeListener();
			clipboardEventTimeout = null;
			resolve(false);
		}, EVENT_LATENCY);
		windowDocument.execCommand("copy");
		element.remove();
	});
}
function $copyToClipboardEvent(editor, event, data) {
	if (data === void 0) {
		const domSelection = getDOMSelection(editor._window);
		const selection = $getSelection();
		if (!selection || selection.isCollapsed()) return false;
		if (!domSelection) return false;
		const points = getDOMSelectionPoints(domSelection, editor.getRootElement());
		const anchorDOM = points.anchorNode;
		const focusDOM = points.focusNode;
		if (anchorDOM !== null && focusDOM !== null && !isSelectionWithinEditor(editor, anchorDOM, focusDOM)) return false;
		data = $getClipboardDataFromSelection(selection);
	}
	event.preventDefault();
	const clipboardData = event.clipboardData;
	if (clipboardData === null) return false;
	setLexicalClipboardDataTransfer(clipboardData, data);
	return true;
}
var clipboardDataFunctions = [["text/html", $getHtmlContent], ["application/x-lexical-editor", $getLexicalContent]];
/**
* Serialize the content of the current selection to strings in
* text/plain, text/html, and application/x-lexical-editor (Lexical JSON)
* formats (as available).
*
* @param selection the selection to serialize (defaults to $getSelection())
* @returns LexicalClipboardData
*/
function $getClipboardDataFromSelection(selection = $getSelection()) {
	return $getClipboardDataWithConfigFromSelection($getExportConfig(), selection);
}
/**
* Call setData on the given clipboardData for each MIME type present
* in the given data (from {@link $getClipboardDataFromSelection})
*
* @param clipboardData the event.clipboardData to populate from data
* @param data The lexical data
*/
function setLexicalClipboardDataTransfer(clipboardData, data) {
	for (const [k] of clipboardDataFunctions) if (data[k] === void 0) clipboardData.setData(k, "");
	for (const k in data) {
		const v = data[k];
		if (v !== void 0) clipboardData.setData(k, v);
	}
}
function $getExportConfig(editor = $getEditor()) {
	const dep = getPeerDependencyFromEditor(editor, GetClipboardDataExtension.name);
	return dep ? dep.output : DEFAULT_EXPORT_MIME_TYPE;
}
var DEFAULT_EXPORT_MIME_TYPE = {
	"application/x-lexical-editor": [(sel, next) => sel ? $getLexicalContent($getEditor(), sel) : next()],
	"text/html": [(sel, next) => sel ? $getHtmlContent($getEditor(), sel) : next()],
	"text/plain": [(sel, next) => sel ? sel.getTextContent() : next()]
};
function $getClipboardDataWithConfigFromSelection($exportMimeType, selection) {
	const clipboardData = { "text/plain": "" };
	for (const [k, fns] of Object.entries($exportMimeType)) if (fns) {
		const v = callExportMimeTypeFunctionStack(fns, selection);
		if (v !== null) clipboardData[k] = v;
	}
	return clipboardData;
}
function callExportMimeTypeFunctionStack(fns, selection) {
	const callAt = (i) => fns[i] ? fns[i](selection, callAt.bind(null, i - 1)) : null;
	return callAt(fns.length - 1);
}
/**
* Lexical extension that controls how the current selection is serialized
* into clipboard MIME types when copying or dragging out of the editor.
*
* The extension's config holds an {@link ExportMimeTypeConfig} — a stack of
* {@link ExportMimeTypeFunction} per MIME type. Out of the box it provides
* fallback serializers for `'application/x-lexical-editor'`, `'text/html'`,
* and `'text/plain'` that defer to {@link $getLexicalContent},
* {@link $getHtmlContent}, and `selection.getTextContent()` respectively.
*
* Apps can layer additional handlers on top to customize an existing
* payload (delegating to the default via `next()`) or to register an
* entirely new MIME type. Functions provided through `mergeConfig` are
* appended to the existing stack for each MIME type, so a newly registered
* handler runs first and may fall through to the previously registered
* handlers via its `next` argument.
*
* The extension's `output` is the resolved {@link ExportMimeTypeConfig},
* which {@link $getClipboardDataFromSelection} and
* {@link $exportMimeTypeFromSelection} read via the editor's peer
* dependency lookup.
*
* @example
* ```ts
* import {configExtension, defineExtension} from '@lexical/extension';
* import {GetClipboardDataExtension} from '@lexical/clipboard';
*
* const MyClipboardExtension = defineExtension({
*   name: 'my-app/clipboard',
*   dependencies: [
*     configExtension(GetClipboardDataExtension, {
*       $exportMimeType: {
*         // Wrap the default HTML output with an app-specific marker.
*         'text/html': [
*           (selection, next) => {
*             const html = next();
*             return html ? wrapWithMyAppMarker(html) : html;
*           },
*         ],
*         // Add a brand-new MIME type.
*         'application/vnd.myapp+json': [
*           (selection) =>
*             selection ? exportMyAppFormat(selection) : null,
*         ],
*       },
*     }),
*   ],
* });
* ```
*/
var GetClipboardDataExtension = defineExtension({
	build(editor, config, state) {
		return config.$exportMimeType;
	},
	config: safeCast({ $exportMimeType: DEFAULT_EXPORT_MIME_TYPE }),
	mergeConfig(config, partial) {
		const merged = shallowMergeConfig(config, partial);
		if (partial.$exportMimeType) {
			const $exportMimeType = { ...config.$exportMimeType };
			for (const [k, v] of Object.entries(partial.$exportMimeType)) if (v) {
				const prev = $exportMimeType[k];
				$exportMimeType[k] = prev ? [...prev, ...v] : v;
			}
			merged.$exportMimeType = $exportMimeType;
		}
		return merged;
	},
	name: "@lexical/clipboard/GetClipboardData"
});
//#endregion
export { copyToClipboard as a, $writeDragSourceToDataTransfer as i, $handleRichTextDrop as n, setLexicalClipboardDataTransfer as o, $insertDataTransferForRichText as r, caretFromPoint as s, $getClipboardDataFromSelection as t };
