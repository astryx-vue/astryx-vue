import { $ as $getDOMTextNode, $n as $rewindSiblingCaret, Ar as $getSelection, Bn as $createParagraphNode, Bt as getDOMSelectionPoints, D as $isSiblingCaret, F as $getSlotHost, Fr as $isRangeSelection, G as $cloneWithProperties, Gn as $getAdjacentSiblingOrParentSiblingCaret, Gr as $isTextNode, Jn as $insertNodeToNearestRootAtCaret, Kn as $getCaretRangeInDirection, L as $getSlotNames, N as $getSlot, O as $isTextPointCaret, Ot as $setSelection, Q as $getDOMSlot, Qn as $removeTextFromCaretRange, T as $isChildCaret, Un as $caretFromPoint, Wn as $caretRangeFromSelection, Wt as getDOMTextNode, X as $findMatchingParent, Xn as $isExtendableTextPointCaret, Zn as $normalizeCaret, Zt as getRootOwnerDocument, _ as $getChildCaretOrSelf, ct as $getRoot, di as registerEventListener, g as $getChildCaret, go as invariant, h as $getCaretRange, ha as $getState, hr as $isElementNode, j as makeStepwiseIterator, kr as $getPreviousSelection, n as mergeRegister, nr as $splitAtPointCaretNext, p as $getAdjacentChildCaret, po as IS_FIREFOX, qt as getParentElement, so as CAN_USE_DOM, tr as $setSelectionFromCaretRange, un as isHTMLElement, v as $getCollapsedCaretRange, va as $setState, x as $getSiblingCaret, yr as $fullReconcile, z as $isSlotHost } from "./src-BWdqgNjM.js";
import { C as createRectsFromDOMRange, a as $isAtEdgeOfElement } from "./src-jZHBqyIl.js";
//#region ../../node_modules/.pnpm/@lexical+utils@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/utils/src/dedupeSelectionRects.ts
/**
* Dedupe a list of selection client-rects before they are drawn as fills.
*
* `Range.getClientRects()` can return rects that are duplicated or contained
* within another, and WebKit in particular emits a spurious wider rect alongside
* the real text rect on some blocks (balanced or letter-spaced headings are the
* reproducible case). Drawn as semi-transparent fills, duplicates read brighter
* than a single rect, and the wider rect paints the "extra empty selection area"
* reported in facebook/lexical#7106.
*
* This drops zero-area rects and any rect that contains another, keeping the
* smaller text-hugging one, with a 1px tolerance for sub-pixel jitter. The
* assumption is that genuine same-line rects are horizontally disjoint (one rect
* per visual row; inline boxes on a row tile side by side), so containment only
* holds for the duplicate or spurious-wider cases, never for a legitimate
* sub-fragment that should be kept.
*
* `positionNodeOnRange` uses a coverage-preserving duplicate filter instead:
* `createRectsFromDOMRange` already drops full-block-width spurious rects, and
* keeping only the smaller of two different overlapping rects can erase real
* selected text there. Raw `getClientRects()` consumers still use this helper
* to avoid the #7106 extra-area paint.
*
* Known limitation: the disjoint assumption holds for normal flow. Overlapping
* inline content — a negative margin, a transform, or a baseline-shifted inline
* decorator — can place a real sub-fragment inside a wider real-text rect on the
* same row; if a sub-pixel top offset also keeps the smaller rect from being
* strictly contained in the wider one, both survive `createRectsFromDOMRange`'s
* containment filter, and applying this keep-smaller helper afterward drops the
* wider rect and under-paints the glyphs it uniquely covered. There is no
* rect-only fix: that wider rect is geometrically indistinguishable from the
* spurious-wider (#7106) rect, so keeping it would re-introduce the extra-area
* paint. See the under-paint characterization browser test.
*
* Typed on the structural subset of `DOMRect` it reads, so it accepts a live
* `DOMRectList` from `getClientRects()` as well as the `DOMRect[]` returned by
* `createRectsFromDOMRange`, and is unit-testable without a DOM.
*/
function dedupeSelectionRects(rects) {
	const contains = (a, b) => b.left >= a.left - 1 && b.top >= a.top - 1 && b.right <= a.right + 1 && b.bottom <= a.bottom + 1;
	const kept = [];
	for (const rect of Array.from(rects)) {
		if (rect.width < .5 || rect.height < .5) continue;
		if (kept.some((keptRect) => contains(rect, keptRect))) continue;
		for (let i = kept.length - 1; i >= 0; i--) if (contains(kept[i], rect)) kept.splice(i, 1);
		kept.push(rect);
	}
	return kept;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+utils@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/utils/src/px.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function px(value) {
	return `${value}px`;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+utils@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/utils/src/positionNodeOnRange.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var mutationObserverConfig = {
	attributes: true,
	characterData: true,
	childList: true,
	subtree: true
};
function prependDOMNode(parent, node) {
	parent.insertBefore(node, parent.firstChild);
}
function dedupeHighlightRects(rects) {
	const kept = [];
	for (const rect of rects) {
		if (rect.width < .5 || rect.height < .5) continue;
		if (kept.some((prev) => Math.abs(prev.left - rect.left) <= 1 && Math.abs(prev.top - rect.top) <= 1 && Math.abs(prev.right - rect.right) <= 1 && Math.abs(prev.bottom - rect.bottom) <= 1)) continue;
		kept.push(rect);
	}
	return kept;
}
/**
* Place one or multiple newly created Nodes at the passed Range's position.
* Multiple nodes will only be created when the Range spans multiple lines (aka
* client rects).
*
* This function can come particularly useful to highlight particular parts of
* the text without interfering with the EditorState, that will often replicate
* the state across collab and clipboard.
*
* This function accounts for DOM updates which can modify the passed Range.
* Hence, the function return to remove the listener.
*/
function mlcPositionNodeOnRange(editor, range, onReposition) {
	let rootDOMNode = null;
	let parentDOMNode = null;
	let observer = null;
	let lastNodes = [];
	const wrapperNode = getRootOwnerDocument(editor.getRootElement()).createElement("div");
	wrapperNode.style.position = "relative";
	function position() {
		invariant(rootDOMNode !== null, "Unexpected null rootDOMNode");
		invariant(parentDOMNode !== null, "Unexpected null parentDOMNode");
		const { left: parentLeft, top: parentTop } = parentDOMNode.getBoundingClientRect();
		const rects = dedupeHighlightRects(createRectsFromDOMRange(editor, range));
		if (!wrapperNode.isConnected) prependDOMNode(parentDOMNode, wrapperNode);
		let hasRepositioned = false;
		for (let i = 0; i < rects.length; i++) {
			const rect = rects[i];
			const rectNode = lastNodes[i] || getRootOwnerDocument(rootDOMNode).createElement("div");
			const rectNodeStyle = rectNode.style;
			if (rectNodeStyle.position !== "absolute") {
				rectNodeStyle.position = "absolute";
				hasRepositioned = true;
			}
			const left = px(rect.left - parentLeft);
			if (rectNodeStyle.left !== left) {
				rectNodeStyle.left = left;
				hasRepositioned = true;
			}
			const top = px(rect.top - parentTop);
			if (rectNodeStyle.top !== top) {
				rectNode.style.top = top;
				hasRepositioned = true;
			}
			const width = px(rect.width);
			if (rectNodeStyle.width !== width) {
				rectNode.style.width = width;
				hasRepositioned = true;
			}
			const height = px(rect.height);
			if (rectNodeStyle.height !== height) {
				rectNode.style.height = height;
				hasRepositioned = true;
			}
			if (rectNode.parentNode !== wrapperNode) {
				wrapperNode.append(rectNode);
				hasRepositioned = true;
			}
			lastNodes[i] = rectNode;
		}
		while (lastNodes.length > rects.length) {
			const node = lastNodes.pop();
			if (node != null) {
				node.remove();
				hasRepositioned = true;
			}
		}
		if (hasRepositioned) onReposition(lastNodes);
	}
	function stop() {
		parentDOMNode = null;
		rootDOMNode = null;
		if (observer !== null) observer.disconnect();
		observer = null;
		wrapperNode.remove();
		for (const node of lastNodes) node.remove();
		lastNodes = [];
	}
	function restart() {
		const currentRootDOMNode = editor.getRootElement();
		if (currentRootDOMNode === null) return stop();
		const currentParentDOMNode = currentRootDOMNode.parentElement;
		if (!isHTMLElement(currentParentDOMNode)) return stop();
		stop();
		rootDOMNode = currentRootDOMNode;
		parentDOMNode = currentParentDOMNode;
		observer = new MutationObserver((mutations) => {
			const nextRootDOMNode = editor.getRootElement();
			const nextParentDOMNode = nextRootDOMNode && nextRootDOMNode.parentElement;
			if (nextRootDOMNode !== rootDOMNode || nextParentDOMNode !== parentDOMNode) return restart();
			for (const mutation of mutations) if (!wrapperNode.contains(mutation.target)) return position();
		});
		observer.observe(currentParentDOMNode, mutationObserverConfig);
		position();
	}
	const removeRootListener = editor.registerRootListener(() => {
		restart();
		return stop;
	});
	return () => {
		removeRootListener();
		stop();
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+utils@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/utils/src/markSelection.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $getOrderedSelectionPoints(selection) {
	const points = selection.getStartEndPoints();
	return selection.isBackward() ? [points[1], points[0]] : points;
}
function $rangeTargetFromPoint(editor, point, node, dom) {
	if (point.type === "text" || !$isElementNode(node)) return [($isTextNode(node) ? $getDOMTextNode(node, dom, editor) : getDOMTextNode(dom)) || dom, point.offset];
	else {
		const slot = $getDOMSlot(node, dom, editor);
		return [slot.element, slot.getFirstChildOffset() + point.offset];
	}
}
function $rangeFromPoints(editor, start, startNode, startDOM, end, endNode, endDOM) {
	const range = (editor._window ? editor._window.document : document).createRange();
	range.setStart(...$rangeTargetFromPoint(editor, start, startNode, startDOM));
	range.setEnd(...$rangeTargetFromPoint(editor, end, endNode, endDOM));
	return range;
}
function defaultOnReposition(domNodes) {
	for (const domNode of domNodes) {
		const domNodeStyle = domNode.style;
		if (domNodeStyle.background !== "Highlight") domNodeStyle.background = "Highlight";
		if (domNodeStyle.color !== "HighlightText") domNodeStyle.color = "HighlightText";
		if (domNodeStyle.marginTop !== px(-1.5)) domNodeStyle.marginTop = px(-1.5);
		if (domNodeStyle.paddingTop !== px(4)) domNodeStyle.paddingTop = px(4);
		if (domNodeStyle.paddingBottom !== px(0)) domNodeStyle.paddingBottom = px(0);
	}
}
/**
* Place one or multiple newly created Nodes at the current selection. Multiple
* nodes will only be created when the selection spans multiple lines (aka
* client rects).
*
* This function can come useful when you want to show the selection but the
* editor has been focused away.
*/
function markSelection(editor, onReposition = defaultOnReposition) {
	let previousAnchorNode = null;
	let previousAnchorNodeDOM = null;
	let previousAnchorOffset = null;
	let previousFocusNode = null;
	let previousFocusNodeDOM = null;
	let previousFocusOffset = null;
	let removeRangeListener = () => {};
	function compute(editorState) {
		editorState.read(() => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection)) {
				previousAnchorNode = null;
				previousAnchorOffset = null;
				previousFocusNode = null;
				previousFocusOffset = null;
				removeRangeListener();
				removeRangeListener = () => {};
				return;
			}
			const [start, end] = $getOrderedSelectionPoints(selection);
			const currentStartNode = start.getNode();
			const currentStartNodeKey = currentStartNode.getKey();
			const currentStartOffset = start.offset;
			const currentEndNode = end.getNode();
			const currentEndNodeKey = currentEndNode.getKey();
			const currentEndOffset = end.offset;
			const currentStartNodeDOM = editor.getElementByKey(currentStartNodeKey);
			const currentEndNodeDOM = editor.getElementByKey(currentEndNodeKey);
			const differentStartDOM = previousAnchorNode === null || currentStartNodeDOM !== previousAnchorNodeDOM || currentStartOffset !== previousAnchorOffset || currentStartNodeKey !== previousAnchorNode.getKey();
			const differentEndDOM = previousFocusNode === null || currentEndNodeDOM !== previousFocusNodeDOM || currentEndOffset !== previousFocusOffset || currentEndNodeKey !== previousFocusNode.getKey();
			if ((differentStartDOM || differentEndDOM) && currentStartNodeDOM !== null && currentEndNodeDOM !== null) {
				const range = $rangeFromPoints(editor, start, currentStartNode, currentStartNodeDOM, end, currentEndNode, currentEndNodeDOM);
				removeRangeListener();
				removeRangeListener = mlcPositionNodeOnRange(editor, range, onReposition);
			}
			previousAnchorNode = currentStartNode;
			previousAnchorNodeDOM = currentStartNodeDOM;
			previousAnchorOffset = currentStartOffset;
			previousFocusNode = currentEndNode;
			previousFocusNodeDOM = currentEndNodeDOM;
			previousFocusOffset = currentEndOffset;
		}, { editor });
	}
	compute(editor.getEditorState());
	return mergeRegister(editor.registerUpdateListener(({ editorState }) => compute(editorState)), () => {
		removeRangeListener();
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+utils@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/utils/src/selectionAlwaysOnDisplay.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function selectionAlwaysOnDisplay(editor, onReposition) {
	let removeSelectionMark = null;
	const onSelectionChange = () => {
		const editorRootElement = editor.getRootElement();
		const targetWindow = editorRootElement !== null ? editorRootElement.ownerDocument.defaultView : null;
		const domSelection = targetWindow !== null ? targetWindow.getSelection() : null;
		const domAnchorNode = domSelection !== null ? getDOMSelectionPoints(domSelection, editorRootElement).anchorNode : null;
		if (domAnchorNode !== null && editorRootElement !== null && editorRootElement.contains(domAnchorNode)) {
			if (removeSelectionMark !== null) {
				removeSelectionMark();
				removeSelectionMark = null;
			}
		} else if (removeSelectionMark === null) removeSelectionMark = markSelection(editor, onReposition);
	};
	return editor.registerRootListener((rootElement) => {
		if (rootElement) {
			const document = rootElement.ownerDocument;
			const cleanup = mergeRegister(registerEventListener(document, "selectionchange", onSelectionChange), () => {
				if (removeSelectionMark !== null) removeSelectionMark();
			});
			onSelectionChange();
			return cleanup;
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+utils@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/utils/src/getScrollParent.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Walks up from `element` and returns the nearest scrollable ancestor (or
* `ownerDocument.body` if none is found), used to keep the active typeahead
* option scrolled into view. Set `includeHidden` to also treat
* `overflow: hidden` ancestors as scroll parents.
*
* The walk crosses ShadowRoot→host (via `getParentElement`) so a
* shadow-mounted editor's scroll parent is found in the enclosing light-DOM
* ancestor chain, and the styles / body are resolved through the element's
* own realm so an iframe-mounted editor stays inside its document.
*/
function getScrollParent(element, includeHidden) {
	const ownerDocument = element.ownerDocument;
	const win = ownerDocument.defaultView || window;
	let style = win.getComputedStyle(element);
	const excludeStaticParent = style.position === "absolute";
	const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
	if (style.position === "fixed") return ownerDocument.body;
	for (let parent = element; parent = getParentElement(parent);) {
		style = win.getComputedStyle(parent);
		if (excludeStaticParent && style.position === "static") continue;
		if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
	}
	return ownerDocument.body;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+utils@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/utils/src/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Returns true if the file type matches the types passed within the acceptableMimeTypes array, false otherwise.
* The types passed must be strings and are CASE-SENSITIVE.
* eg. if file is of type 'text' and acceptableMimeTypes = ['TEXT', 'IMAGE'] the function will return false.
* @param file - The file you want to type check.
* @param acceptableMimeTypes - An array of strings of types which the file is checked against.
* @returns true if the file is an acceptable mime type, false otherwise.
*/
function isMimeType(file, acceptableMimeTypes) {
	for (const acceptableType of acceptableMimeTypes) if (file.type.startsWith(acceptableType)) return true;
	return false;
}
/**
* Lexical File Reader with:
*  1. MIME type support
*  2. batched results (HistoryPlugin compatibility)
*  3. Order aware (respects the order when multiple Files are passed)
*
* const filesResult = await mediaFileReader(files, ['image/']);
* filesResult.forEach(file => editor.dispatchCommand('INSERT_IMAGE', \\{
*   src: file.result,
* \\}));
*/
function mediaFileReader(files, acceptableMimeTypes) {
	const filesIterator = files[Symbol.iterator]();
	return new Promise((resolve, reject) => {
		const processed = [];
		const handleNextFile = () => {
			const { done, value: file } = filesIterator.next();
			if (done) return resolve(processed);
			const fileReader = new FileReader();
			fileReader.addEventListener("error", reject);
			fileReader.addEventListener("load", () => {
				const result = fileReader.result;
				if (typeof result === "string") processed.push({
					file,
					result
				});
				handleNextFile();
			});
			if (isMimeType(file, acceptableMimeTypes)) fileReader.readAsDataURL(file);
			else handleNextFile();
		};
		handleNextFile();
	});
}
/**
* "Depth-First Search" starts at the root/top node of a tree and goes as far as it can down a branch end
* before backtracking and finding a new path. Consider solving a maze by hugging either wall, moving down a
* branch until you hit a dead-end (leaf) and backtracking to find the nearest branching path and repeat.
* It will then return all the nodes found in the search in an array of objects.
* Preorder traversal is used, meaning that nodes are listed in the order of when they are FIRST encountered.
*
* Children-only spine: named slot subtrees are skipped. Use {@link $dfsWithSlots}
* when you need to descend into slots (e.g. character counting, slot-aware
* content extraction).
*
* @param startNode - The node to start the search (inclusive), if omitted, it will start at the root node.
* @param endNode - The node to end the search (inclusive), if omitted, it will find all descendants of the startingNode. If endNode
* is an ElementNode, it will stop before visiting any of its children.
* @returns An array of objects of all the nodes found by the search, including their depth into the tree.
* \\{depth: number, node: LexicalNode\\} It will always return at least 1 node (the start node).
*/
function $dfs(startNode, endNode) {
	return Array.from($dfsIterator(startNode, endNode));
}
/**
* Get the adjacent caret in the same direction
*
* @param caret A caret or null
* @returns `caret.getAdjacentCaret()` or `null`
*/
function $getAdjacentCaret(caret) {
	return caret ? caret.getAdjacentCaret() : null;
}
/**
* Right-to-left mirror of {@link $dfs}. It returns all the nodes found in the
* search in an array of objects.
* Preorder traversal is used, meaning that nodes are listed in the order of when they are FIRST encountered.
*
* Children-only spine: named slot subtrees are skipped. Use {@link $reverseDfsWithSlots}
* when you need to descend into slots (e.g. character counting, slot-aware
* content extraction).
*
* The whole traversal is materialized. Use {@link $reverseDfsIterator} to walk
* it on the fly with O(1) memory.
*
* @param startNode - The node to start the search (inclusive), if omitted, it will start at the root node.
* @param endNode - The node to end the search (inclusive), if omitted, it will find all descendants of the startingNode. If endNode
* is an ElementNode, it will stop before visiting any of its children.
* @returns An array of objects of all the nodes found by the search, including their depth into the tree.
* \\{depth: number, node: LexicalNode\\} It will always return at least 1 node (the start node).
*/
function $reverseDfs(startNode, endNode) {
	return Array.from($reverseDfsIterator(startNode, endNode));
}
/**
* $dfs iterator (left to right). Tree traversal is done on the fly as new values are requested with O(1) memory.
* Preorder traversal is used, meaning that nodes are iterated over in the order of when they are FIRST encountered.
*
* Children-only spine: named slot subtrees are skipped. Use {@link $dfsWithSlotsIterator}
* (or {@link $dfsWithSlots}) when you need to descend into slots — e.g. character
* counting, content extraction, or any cross-tree analysis where slotted content
* should be visited.
*
* @param startNode - The node to start the search (inclusive), if omitted, it will start at the root node.
* @param endNode - The node to end the search (inclusive), if omitted, it will find all descendants of the startingNode.
* If endNode is an ElementNode, the iterator will end as soon as it reaches the endNode (no children will be visited).
* @returns An iterator, each yielded value is a DFSNode. It will always return at least 1 node (the start node).
*/
function $dfsIterator(startNode, endNode) {
	return $dfsCaretIterator("next", startNode, endNode);
}
/**
* Like {@link $dfs}, but also descends into named slots. Slots are not on the
* linked-list spine, so each host's slot subtrees are emitted slots-first,
* right after the host node and before its linked-list children.
* @experimental
* @param startNode - The node to start the search (inclusive), defaults to the root node.
* @param endNode - The node to end the search (inclusive), defaults to all descendants of startNode.
* Like {@link $dfs}, reaching endNode stops the traversal before visiting any of its
* children — including its slot subtrees. An endNode strictly inside a slot subtree
* is never reached (slot subtrees are spliced in whole), so it does not truncate
* the traversal.
* @returns An array of DFSNodes. It will always return at least 1 node (the start node).
*/
function $dfsWithSlots(startNode, endNode) {
	return Array.from($dfsWithSlotsIterator(startNode, endNode));
}
/**
* Slot-aware {@link $dfsIterator}: a host's slot subtrees are emitted
* slots-first, right after the host node and before its linked-list children.
* The caret iterator drives the linked-list spine untouched.
* @experimental
* @param startNode - The node to start the search (inclusive), defaults to the root node.
* @param endNode - The node to end the search (inclusive), defaults to all descendants of startNode.
* Like {@link $dfs}, reaching endNode stops the traversal before visiting any of its
* children — including its slot subtrees. An endNode strictly inside a slot subtree
* is never reached (slot subtrees are spliced in whole), so it does not truncate
* the traversal.
* @returns An iterator, each yielded value is a DFSNode. It will always return at least 1 node (the start node).
*/
function* $dfsWithSlotsIterator(startNode, endNode) {
	for (const dfsNode of $dfsCaretIterator("next", startNode, endNode)) {
		yield dfsNode;
		const { node, depth } = dfsNode;
		if ($isSlotHost(node) && !node.is(endNode)) for (const name of $getSlotNames(node)) {
			const slot = $getSlot(node, name);
			if (slot !== null) yield* $dfsSubtreeIterator(slot, depth + 1);
		}
	}
}
/**
* Slots-first preorder traversal of a self-contained subtree (a slot node and
* everything it owns). Used to splice slot subtrees into $dfsWithSlotsIterator.
*/
function* $dfsSubtreeIterator(node, depth) {
	yield {
		depth,
		node
	};
	const childDepth = depth + 1;
	if ($isSlotHost(node)) for (const name of $getSlotNames(node)) {
		const slot = $getSlot(node, name);
		if (slot !== null) yield* $dfsSubtreeIterator(slot, childDepth);
	}
	if ($isElementNode(node)) for (const child of node.getChildren()) yield* $dfsSubtreeIterator(child, childDepth);
}
function $getEndCaret(startNode, direction) {
	const rval = $getAdjacentSiblingOrParentSiblingCaret($getSiblingCaret(startNode, direction));
	return rval && rval[0];
}
function $dfsCaretIterator(direction, startNode, endNode) {
	const root = $getRoot();
	const start = startNode || root;
	const startCaret = $isElementNode(start) ? $getChildCaret(start, direction) : $getSiblingCaret(start, direction);
	const startDepth = $getDepth(start);
	const endCaret = endNode ? $getAdjacentChildCaret($getChildCaretOrSelf($getSiblingCaret(endNode, direction))) || $getEndCaret(endNode, direction) : $getEndCaret(start, direction);
	let depth = startDepth;
	return makeStepwiseIterator({
		hasNext: (state) => state !== null,
		initial: startCaret,
		map: (state) => ({
			depth,
			node: state.origin
		}),
		step: (state) => {
			if (state.isSameNodeCaret(endCaret)) return null;
			if ($isChildCaret(state)) depth++;
			const rval = $getAdjacentSiblingOrParentSiblingCaret(state);
			if (!rval || rval[0].isSameNodeCaret(endCaret)) return null;
			depth += rval[1];
			return rval[0];
		}
	});
}
/**
* Returns the Node sibling when this exists, otherwise the closest parent sibling. For example
* R -> P -> T1, T2
*   -> P2
* returns T2 for node T1, P2 for node T2, and null for node P2.
* @param node LexicalNode.
* @returns An array (tuple) containing the found Lexical node and the depth difference, or null, if this node doesn't exist.
*/
function $getNextSiblingOrParentSibling(node) {
	const rval = $getAdjacentSiblingOrParentSiblingCaret($getSiblingCaret(node, "next"));
	return rval && [rval[0].origin, rval[1]];
}
function $getDepth(node) {
	let depth = -1;
	for (let innerNode = node; innerNode !== null; innerNode = innerNode.getParent() ?? $getSlotHost(innerNode)) depth++;
	return depth;
}
/**
* Performs a right-to-left preorder tree traversal.
* From the starting node it goes to the rightmost child, than backtracks to parent and finds new rightmost path.
* It will return the next node in traversal sequence after the startingNode.
* The traversal is similar to $dfs functions above, but the nodes are visited right-to-left, not left-to-right.
* @param startingNode - The node to start the search.
* @returns The next node in pre-order right to left traversal sequence or `null`, if the node does not exist
*/
function $getNextRightPreorderNode(startingNode) {
	const startCaret = $getChildCaretOrSelf($getSiblingCaret(startingNode, "previous"));
	const next = $getAdjacentSiblingOrParentSiblingCaret(startCaret, "root");
	return next && next[0].origin;
}
/**
* $dfs iterator (right to left). Tree traversal is done on the fly as new values are requested with O(1) memory.
* @param startNode - The node to start the search, if omitted, it will start at the root node.
* @param endNode - The node to end the search, if omitted, it will find all descendants of the startingNode.
* @returns An iterator, each yielded value is a DFSNode. It will always return at least 1 node (the start node).
*/
function $reverseDfsIterator(startNode, endNode) {
	return $dfsCaretIterator("previous", startNode, endNode);
}
/**
* Like {@link $reverseDfs}, but also descends into named slots. Mirror of
* {@link $dfsWithSlots}.
* @experimental
* @param startNode - The node to start the search (inclusive), defaults to the root node.
* @param endNode - The node to end the search (inclusive), defaults to all descendants of startNode.
* Mirroring {@link $dfsWithSlots}, reaching endNode stops the traversal without
* emitting its slot subtrees. An endNode strictly inside a slot subtree is never
* reached (slot subtrees are spliced in whole), so it does not truncate the
* traversal.
* @returns An array of DFSNodes. It will always return at least 1 node (the start node).
*/
function $reverseDfsWithSlots(startNode, endNode) {
	return Array.from($reverseDfsWithSlotsIterator(startNode, endNode));
}
/**
* Right-to-left mirror of {@link $dfsWithSlotsIterator}. Forward visits slots
* before children, so the mirror visits them last: a host's slot subtrees are
* emitted (in reverse slot order) only once its linked-list subtree is fully
* traversed. Because the caret spine streams nodes, "left the host subtree" is
* detected when a node at the host's depth or shallower arrives, flushing the
* host's pending slots. The caret iterator drives the spine untouched.
* @experimental
* @param startNode - The node to start the search (inclusive), defaults to the root node.
* @param endNode - The node to end the search (inclusive), defaults to all descendants of startNode.
* Mirroring {@link $dfsWithSlotsIterator}, reaching endNode stops the traversal
* without emitting its slot subtrees. An endNode strictly inside a slot subtree is
* never reached (slot subtrees are spliced in whole), so it does not truncate the
* traversal.
* @returns An iterator, each yielded value is a DFSNode. It will always return at least 1 node (the start node).
*/
function* $reverseDfsWithSlotsIterator(startNode, endNode) {
	const pending = [];
	for (const dfsNode of $dfsCaretIterator("previous", startNode, endNode)) {
		while (pending.length > 0 && dfsNode.depth <= pending[pending.length - 1].depth) {
			const host = pending.pop();
			yield* $reverseSlotsOf(host.node, host.depth + 1);
		}
		yield dfsNode;
		const { node, depth } = dfsNode;
		if ($isSlotHost(node) && $getSlotNames(node).length > 0 && !node.is(endNode)) pending.push({
			depth,
			node
		});
	}
	while (pending.length > 0) {
		const host = pending.pop();
		yield* $reverseSlotsOf(host.node, host.depth + 1);
	}
}
/** Emit a host's slot subtrees in reverse slot order (mirror of slots-first). */
function* $reverseSlotsOf(host, childDepth) {
	const names = $getSlotNames(host);
	for (let i = names.length - 1; i >= 0; i--) {
		const slot = $getSlot(host, names[i]);
		if (slot !== null) yield* $reverseDfsSubtreeIterator(slot, childDepth);
	}
}
/**
* Right-to-left slots-last preorder of a self-contained subtree: children in
* reverse order, then slots in reverse order. Mirror of $dfsSubtreeIterator.
*/
function* $reverseDfsSubtreeIterator(node, depth) {
	yield {
		depth,
		node
	};
	const childDepth = depth + 1;
	if ($isElementNode(node)) {
		const children = node.getChildren();
		for (let i = children.length - 1; i >= 0; i--) yield* $reverseDfsSubtreeIterator(children[i], childDepth);
	}
	if ($isSlotHost(node)) yield* $reverseSlotsOf(node, childDepth);
}
/**
* Takes a node and traverses up its ancestors (toward the root node)
* in order to find a specific type of node.
* @param node - the node to begin searching.
* @param klass - an instance of the type of node to look for.
* @returns the node of type klass that was passed, or null if none exist.
*/
function $getNearestNodeOfType(node, klass) {
	let parent = node;
	while (parent != null) {
		if (parent instanceof klass) return parent;
		parent = parent.getParent();
	}
	return null;
}
/**
* Returns the element node of the nearest ancestor, otherwise throws an error.
* @param startNode - The starting node of the search
* @returns The ancestor node found
*/
function $getNearestBlockElementAncestorOrThrow(startNode) {
	const blockNode = $findMatchingParent(startNode, (node) => $isElementNode(node) && !node.isInline());
	if (!$isElementNode(blockNode)) invariant(false, "Expected node %s to have closest block element node.", startNode.__key);
	return blockNode;
}
/**
* Attempts to resolve nested element nodes of the same type into a single node of that type.
* It is generally used for marks/commenting
* @param editor - The lexical editor
* @param targetNode - The target for the nested element to be extracted from.
* @param cloneNode - See {@link $createMarkNode}
* @param handleOverlap - Handles any overlap between the node to extract and the targetNode
* @returns The lexical editor
*/
function registerNestedElementResolver(editor, targetNode, cloneNode, handleOverlap) {
	const $isTargetNode = (node) => {
		return node instanceof targetNode;
	};
	const $findMatch = (node) => {
		const children = node.getChildren();
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if ($isTargetNode(child)) return null;
		}
		let parentNode = node;
		let childNode = node;
		while (parentNode !== null) {
			childNode = parentNode;
			parentNode = parentNode.getParent();
			if ($isTargetNode(parentNode)) return {
				child: childNode,
				parent: parentNode
			};
		}
		return null;
	};
	const $elementNodeTransform = (node) => {
		const match = $findMatch(node);
		if (match !== null) {
			const { child, parent } = match;
			if (child.is(node)) {
				handleOverlap(parent, node);
				const nextSiblings = child.getNextSiblings();
				const nextSiblingsLength = nextSiblings.length;
				parent.insertAfter(child);
				if (nextSiblingsLength !== 0) {
					const newParent = cloneNode(parent);
					child.insertAfter(newParent);
					for (let i = 0; i < nextSiblingsLength; i++) newParent.append(nextSiblings[i]);
				}
				if (!parent.canBeEmpty() && parent.getChildrenSize() === 0) parent.remove();
			}
		}
	};
	return editor.registerNodeTransform(targetNode, $elementNodeTransform);
}
/**
* Clones the editor and marks it as dirty to be reconciled. If there was a selection,
* it would be set back to its previous state, or null otherwise.
* @param editor - The lexical editor
* @param editorState - The editor's state
*/
function $restoreEditorState(editor, editorState) {
	const nodeMap = /* @__PURE__ */ new Map();
	const activeEditorState = editor._pendingEditorState;
	for (const [key, node] of editorState._nodeMap) nodeMap.set(key, $cloneWithProperties(node));
	if (activeEditorState) activeEditorState._nodeMap = nodeMap;
	$fullReconcile();
	const selection = editorState._selection;
	$setSelection(selection === null ? null : selection.clone());
}
/**
* Determine whether anything follows the given caret before the end of its
* nearest root (see {@link lexical!$isRootOrShadowRoot}).
*/
function $hasContentAfter(caret) {
	return $isExtendableTextPointCaret(caret) || $getAdjacentSiblingOrParentSiblingCaret($isTextPointCaret(caret) ? caret.getSiblingCaret() : caret, "shadowRoot") !== null;
}
/**
* If the selected insertion area is the root/shadow root node (see {@link lexical!$isRootOrShadowRoot}),
* the node will be appended there, otherwise, it will be inserted before the insertion area.
* If there is no selection where the node is to be inserted, it will be appended after any current nodes
* within the tree, as a child of the root node. A paragraph will then be added after the inserted node and selected.
* @param node - The node to be inserted
* @returns The node after its insertion
*/
function $insertNodeToNearestRoot(node) {
	const selection = $getSelection() || $getPreviousSelection();
	let initialCaret;
	if ($isRangeSelection(selection)) initialCaret = $caretFromPoint(selection.focus, "next");
	else {
		if (selection != null) {
			const nodes = selection.getNodes();
			const lastNode = nodes[nodes.length - 1];
			if (lastNode) initialCaret = $getSiblingCaret(lastNode, "next");
		}
		initialCaret = initialCaret || $getChildCaret($getRoot(), "previous").getFlipped().insert($createParagraphNode());
	}
	const insertCaret = $insertNodeToNearestRootAtCaret(node, initialCaret, $hasContentAfter(initialCaret) ? { $shouldSplit: (_node, edge) => edge !== "last" } : void 0);
	const adjacent = $getAdjacentChildCaret(insertCaret);
	const selectionCaret = $isChildCaret(adjacent) ? $normalizeCaret(adjacent) : insertCaret;
	$setSelectionFromCaretRange($getCollapsedCaretRange(selectionCaret));
	return node.getLatest();
}
/**
* Inserts a node into leaf — the deepest accessible node at the carriage position
* @param node - The node to be inserted
*/
function $insertNodeIntoLeaf(node) {
	const selection = $getSelection();
	if (!$isRangeSelection(selection)) {
		if (selection) selection.insertNodes([node]);
		return;
	}
	const caretRange = $caretRangeFromSelection(selection);
	let insertCaret = $getCaretRangeInDirection($removeTextFromCaretRange(caretRange), "next").anchor;
	if ($isTextPointCaret(insertCaret)) {
		const nextAnchor = $splitAtPointCaretNext(insertCaret);
		if (!nextAnchor) return;
		insertCaret = nextAnchor;
	}
	const focus = insertCaret.getFlipped();
	focus.insert(node);
	$setSelectionFromCaretRange($getCaretRange(focus, focus));
}
/**
* Wraps the node into another node created from a createElementNode function, eg. $createParagraphNode
* @param node - Node to be wrapped.
* @param createElementNode - Creates a new lexical element to wrap the to-be-wrapped node and returns it.
* @returns A new lexical element with the previous node appended within (as a child, including its children).
*/
function $wrapNodeInElement(node, createElementNode) {
	const elementNode = createElementNode();
	node.replace(elementNode);
	elementNode.append(node);
	return elementNode;
}
/**
* @param object = The instance of the type
* @param objectClass = The class of the type
* @returns Whether the object is has the same Klass of the objectClass, ignoring the difference across window (e.g. different iframes)
*/
function objectKlassEquals(object, objectClass) {
	if (object == null) return false;
	const prototype = Object.getPrototypeOf(object);
	if (prototype == null || prototype.constructor == null) return false;
	return prototype.constructor.name === objectClass.name;
}
function eventFiles(event) {
	let dataTransfer = null;
	if (objectKlassEquals(event, DragEvent)) dataTransfer = event.dataTransfer;
	else if (objectKlassEquals(event, ClipboardEvent)) dataTransfer = event.clipboardData;
	if (dataTransfer === null) return [
		false,
		[],
		false
	];
	const types = dataTransfer.types;
	const hasFiles = types.includes("Files");
	const hasContent = types.includes("text/html") || types.includes("text/plain");
	return [
		hasFiles,
		Array.from(dataTransfer.files),
		hasContent
	];
}
/**
* @deprecated Use Array filter or flatMap
*
* Filter the nodes
* @param nodes Array of nodes that needs to be filtered
* @param filterFn A filter function that returns node if the current node satisfies the condition otherwise null
* @returns Array of filtered nodes
*/
function $filter(nodes, filterFn) {
	const result = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = filterFn(nodes[i]);
		if (node !== null) result.push(node);
	}
	return result;
}
/**
* Applies the provided callback to each indentable block element in the Selection
*
* @param indentOrOutdent callback for performing the indent or outdent action
* on a given block element.
* @returns true if at least one block was handled, false otherwise.
*/
function $handleIndentAndOutdent(indentOrOutdent) {
	const selection = $getSelection();
	if (!$isRangeSelection(selection)) return false;
	const alreadyHandled = /* @__PURE__ */ new Set();
	const nodes = selection.getNodes();
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		const key = node.getKey();
		if (alreadyHandled.has(key)) continue;
		const parentBlock = $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline());
		if (parentBlock === null) continue;
		const parentKey = parentBlock.getKey();
		if (parentBlock.canIndent() && !alreadyHandled.has(parentKey)) {
			alreadyHandled.add(parentKey);
			indentOrOutdent(parentBlock);
		}
	}
	return alreadyHandled.size > 0;
}
/**
* Appends the node before the first child of the parent node
* @param parent A parent node
* @param node Node that needs to be appended
*/
function $insertFirst(parent, node) {
	$getChildCaret(parent, "next").insert(node);
}
var NEEDS_MANUAL_ZOOM = IS_FIREFOX || !CAN_USE_DOM ? false : void 0;
function needsManualZoom() {
	if (NEEDS_MANUAL_ZOOM === void 0) {
		const div = document.createElement("div");
		div.style.position = "absolute";
		div.style.opacity = "0";
		div.style.width = "100px";
		div.style.left = "-1000px";
		document.body.appendChild(div);
		const noZoom = div.getBoundingClientRect();
		div.style.setProperty("zoom", "2");
		NEEDS_MANUAL_ZOOM = div.getBoundingClientRect().width === noZoom.width;
		document.body.removeChild(div);
	}
	return NEEDS_MANUAL_ZOOM;
}
/**
* Calculates the zoom level of an element as a result of using
* css zoom property. For browsers that implement standardized CSS
* zoom (Firefox, Chrome >= 128), this will always return 1.
* @param element
* @param useManualZoom - If true, always use zoom level will be calculated manually, otherwise it will be calculated on as needed basis.
*/
function calculateZoomLevel(element, useManualZoom = false) {
	let zoom = 1;
	if (needsManualZoom() || useManualZoom) {
		const win = element && element.ownerDocument.defaultView || window;
		while (element) {
			zoom *= Number(win.getComputedStyle(element).getPropertyValue("zoom"));
			element = getParentElement(element);
		}
	}
	return zoom;
}
/**
* Checks if the editor is a nested editor created by LexicalNestedComposer
*/
function $isEditorIsNestedEditor(editor) {
	return editor._parentEditor !== null;
}
/**
* A depth first last-to-first traversal of root that stops at each node that matches
* $predicate and ensures that its parent is root. This is typically used to discard
* invalid or unsupported wrapping nodes. For example, a TableNode must only have
* TableRowNode as children, but an importer might add invalid nodes based on
* caption, tbody, thead, etc. and this will unwrap and discard those.
*
* @param root The root to start the traversal
* @param $predicate Should return true for nodes that are permitted to be children of root
* @returns true if this unwrapped or removed any nodes
*/
function $unwrapAndFilterDescendants(root, $predicate) {
	return $unwrapAndFilterDescendantsImpl(root, $predicate, null);
}
function $unwrapAndFilterDescendantsImpl(root, $predicate, $onSuccess) {
	let didMutate = false;
	for (const node of $lastToFirstIterator(root)) {
		if ($predicate(node)) {
			if ($onSuccess !== null) $onSuccess(node);
			continue;
		}
		didMutate = true;
		if ($isElementNode(node)) $unwrapAndFilterDescendantsImpl(node, $predicate, $onSuccess || ((child) => node.insertAfter(child)));
		node.remove();
	}
	return didMutate;
}
function $descendantsMatching(children, $predicate) {
	const result = [];
	const stack = Array.from(children).reverse();
	for (let child = stack.pop(); child !== void 0; child = stack.pop()) if ($predicate(child)) result.push(child);
	else if ($isElementNode(child)) for (const grandchild of $lastToFirstIterator(child)) stack.push(grandchild);
	return result;
}
/**
* Return an iterator that yields each child of node from first to last, taking
* care to preserve the next sibling before yielding the value in case the caller
* removes the yielded node.
*
* @param node The node whose children to iterate
* @returns An iterator of the node's children
*/
function $firstToLastIterator(node) {
	return $childIterator($getChildCaret(node, "next"));
}
/**
* Return an iterator that yields each child of node from last to first, taking
* care to preserve the previous sibling before yielding the value in case the caller
* removes the yielded node.
*
* @param node The node whose children to iterate
* @returns An iterator of the node's children
*/
function $lastToFirstIterator(node) {
	return $childIterator($getChildCaret(node, "previous"));
}
function $childIterator(startCaret) {
	return makeStepwiseIterator({
		hasNext: $isSiblingCaret,
		initial: startCaret.getAdjacentCaret(),
		map: (caret) => {
			return caret.origin.getLatest();
		},
		step: (caret) => caret.getAdjacentCaret()
	});
}
/**
* Replace this node with its children
*
* @param node The ElementNode to unwrap and remove
*/
function $unwrapNode(node) {
	$rewindSiblingCaret($getSiblingCaret(node, "next")).splice(1, node.getChildren());
}
/**
* EXPERIMENTAL
*
* A convenience interface for working with {@link $getState} and
* {@link $setState}.
*
* @param stateConfig The stateConfig to wrap with convenience functionality
* @returns a StateWrapper
*/
function makeStateWrapper(stateConfig) {
	const $get = (node) => $getState(node, stateConfig);
	const $set = (node, valueOrUpdater) => $setState(node, stateConfig, valueOrUpdater);
	return {
		$get,
		$set,
		accessors: [$get, $set],
		makeGetterMethod: () => function $getter() {
			return $get(this);
		},
		makeSetterMethod: () => function $setter(valueOrUpdater) {
			return $set(this, valueOrUpdater);
		},
		stateConfig
	};
}
/**
* Inserts a new paragraph before a container node when the cursor moves outside the container element
*
* Intended for use ArrowLeft/ArrowUp keyboard handlers to allow the user to break out
* of a container node by creating a new paragraph before it.
*
* A paragraph is inserted if that the cursor is positioned at the beginning inside the container,
* and the container itself is the first element in the document and has no preceding sibling
*
* When a paragraph is inserted the selection is moved to it and, if the
* triggering keyboard event is provided, its default action is prevented so
* the browser does not additionally move the selection. Relying on the native
* caret movement is not portable: Chromium moves into the freshly inserted
* paragraph while Firefox leaves the caret inside the container.
*
* @param $isContainerNode - Type guard identifying the container node type to escape from.
* @param event - The keyboard event that triggered the escape, if any. Its
*   default action is prevented when a paragraph is inserted.
* @returns `true` if a paragraph was inserted, `false` otherwise.
*/
function $onEscapeUp($isContainerNode, event) {
	const selection = $getSelection();
	if ($isRangeSelection(selection) && selection.isCollapsed()) {
		const containerNode = $findMatchingParent(selection.anchor.getNode(), $isContainerNode);
		if (containerNode) {
			const parent = containerNode.getParent();
			if (parent !== null && parent.getFirstChild() === containerNode && $isAtStartOfNode(selection.anchor, containerNode)) {
				containerNode.insertBefore($createParagraphNode()).selectEnd();
				if (event) event.preventDefault();
				return true;
			}
		}
	}
	return false;
}
/**
* Inserts a new paragraph after a container node when the cursor moves outside the container element
*
* Intended for use ArrowRight/ArrowDown keyboard handlers to allow the user to break out
* of a container node by creating a new paragraph after it.
*
* A paragraph is inserted if that the cursor is positioned at the ending inside the container,
* and the container itself is the last element in the document and has no next sibling
*
* When a paragraph is inserted the selection is moved to it and, if the
* triggering keyboard event is provided, its default action is prevented so
* the browser does not additionally move the selection. Relying on the native
* caret movement is not portable: Chromium moves into the freshly inserted
* paragraph while Firefox leaves the caret inside the container.
*
* @param $isContainerNode - Type guard identifying the container node type to escape from.
* @param event - The keyboard event that triggered the escape, if any. Its
*   default action is prevented when a paragraph is inserted.
* @returns `true` if a paragraph was inserted, `false` otherwise.
*/
function $onEscapeDown($isContainerNode, event) {
	const selection = $getSelection();
	if ($isRangeSelection(selection) && selection.isCollapsed()) {
		const containerNode = $findMatchingParent(selection.anchor.getNode(), $isContainerNode);
		if (containerNode) {
			const parent = containerNode.getParent();
			if (parent !== null && parent.getLastChild() === containerNode && $isAtEndOfNode(selection.anchor, containerNode)) {
				containerNode.insertAfter($createParagraphNode()).selectEnd();
				if (event) event.preventDefault();
				return true;
			}
		}
	}
	return false;
}
/**
* Whether the collapsed `point` sits at the very start of `node`'s content —
* on its first descendant (or on the empty node itself) at offset 0. Shared by
* {@link $onEscapeUp} and slot-aware variants so the "at the leading edge of a
* container" test stays in one place.
*/
function $isAtStartOfNode(point, node) {
	return $isAtEdgeOfElement(point, node, "previous");
}
/**
* Whether the collapsed `point` sits at the very end of `node`'s content — on
* its last descendant (or on the empty node itself) at that node's end. Shared
* by {@link $onEscapeDown} and slot-aware variants so the "at the trailing edge
* of a container" test stays in one place.
*/
function $isAtEndOfNode(point, node) {
	return $isAtEdgeOfElement(point, node, "next");
}
//#endregion
export { $unwrapNode as A, selectionAlwaysOnDisplay as B, $onEscapeUp as C, $reverseDfsWithSlots as D, $reverseDfsIterator as E, makeStateWrapper as F, mlcPositionNodeOnRange as H, mediaFileReader as I, objectKlassEquals as L, calculateZoomLevel as M, eventFiles as N, $reverseDfsWithSlotsIterator as O, isMimeType as P, registerNestedElementResolver as R, $onEscapeDown as S, $reverseDfs as T, dedupeSelectionRects as U, markSelection as V, $insertNodeToNearestRoot as _, $dfsWithSlotsIterator as a, $isEditorIsNestedEditor as b, $getAdjacentCaret as c, $getNearestNodeOfType as d, $getNextRightPreorderNode as f, $insertNodeIntoLeaf as g, $insertFirst as h, $dfsWithSlots as i, $wrapNodeInElement as j, $unwrapAndFilterDescendants as k, $getDepth as l, $handleIndentAndOutdent as m, $dfs as n, $filter as o, $getNextSiblingOrParentSibling as p, $dfsIterator as r, $firstToLastIterator as s, $descendantsMatching as t, $getNearestBlockElementAncestorOrThrow as u, $isAtEndOfNode as v, $restoreEditorState as w, $lastToFirstIterator as x, $isAtStartOfNode as y, getScrollParent as z };
