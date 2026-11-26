import { $i as KEY_SPACE_COMMAND, $n as $rewindSiblingCaret, Ar as $getSelection, Bn as $createParagraphNode, Ca as aliasTableOf, Dt as $setFormatFromDOM, Ea as booleanValue, Et as $setDirectionFromDOM, F as $getSlotHost, Fa as optional, Fr as $isRangeSelection, Gr as $isTextNode, Ha as withAccessors, Jn as $insertNodeToNearestRootAtCaret, Jr as setDOMStyleFromCSS, Ki as KEY_ARROW_UP_COMMAND, Kr as TextNode, Kt as getNearestEditorFromDOMNode, La as setterDefaultOf, Mt as getActiveElement, Na as numberValue, Oa as enumValue, Ra as setterTableOf, U as $addUpdateTag, Ua as withField, Ui as KEY_ARROW_DOWN_COMMAND, Vi as INSERT_PARAGRAPH_COMMAND, Vn as $isParagraphNode, W as $applyNodeReplacement, Wi as KEY_ARROW_LEFT_COMMAND, X as $findMatchingParent, Zi as KEY_ESCAPE_COMMAND, Zn as $normalizeCaret, a as removeClassNamesFromElement, ai as SKIP_DOM_SELECTION_TAG, at as $getNodeByKey, c as configExtension, di as registerEventListener, er as $setPointFromCaret, et as $getDocument, fa as createCommand, g as $getChildCaret, go as invariant, gr as ElementNode, hr as $isElementNode, i as normalizeClassNames, ir as $createLineBreakNode, ja as nodeSchema, ka as getterTableOf, li as buildImportMap, mt as $isRootOrShadowRoot, n as mergeRegister, po as IS_FIREFOX, pt as $isLeafNode, q as $copyNode, qi as KEY_BACKSPACE_COMMAND, qr as getStyleObjectFromCSS, r as addClassNamesToElement, rt as $getNearestNodeFromDOMNode, s as safeCast, si as SKIP_SELECTION_FOCUS_TAG, t as registerEventListeners, u as defineExtension, un as isHTMLElement, wa as aliasedValue, x as $getSiblingCaret } from "./src-BWdqgNjM.js";
import { G as namedSignals, J as j } from "./src-DjbHpMmC.js";
import { M as calculateZoomLevel, d as $getNearestNodeOfType } from "./src-9-5QzbBl.js";
import { C as ImportOverlays, M as defineImportRule, P as isElementOfTag, d as DOMImportExtension, f as defineOverlayRules, g as $propagateTextAlignToBlockChildren, h as $isBlockLevel, k as createImportState, l as CoreImportExtension, o as sel, v as InlineSchema } from "./src-CAtUi_gH.js";
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/utils.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Checks the depth of listNode from the root node.
* @param listNode - The ListNode to be checked.
* @returns The depth of the ListNode.
*/
function $getListDepth(listNode) {
	let depth = 1;
	let parent = listNode.getParent();
	while (parent != null) {
		if ($isListItemNode(parent)) {
			const parentList = parent.getParent();
			if ($isListNode(parentList)) {
				depth++;
				parent = parentList.getParent();
				continue;
			}
			invariant(false, "A ListItemNode must have a ListNode for a parent.");
		}
		return depth;
	}
	return depth;
}
/**
* Finds the nearest ancestral ListNode and returns it, throws an invariant if listItem is not a ListItemNode.
* @param listItem - The node to be checked.
* @returns The ListNode found.
*/
function $getTopListNode(listItem) {
	const parentList = listItem.getParent();
	if (!$isListNode(parentList)) invariant(false, "A ListItemNode must have a ListNode for a parent.");
	let list = parentList;
	let parent = parentList;
	while (parent !== null) {
		parent = parent.getParent();
		if ($isListNode(parent)) list = parent;
	}
	return list;
}
/**
* A recursive Depth-First Search (Postorder Traversal) that finds all of a node's children
* that are of type ListItemNode and returns them in an array.
* @param node - The ListNode to start the search.
* @returns An array containing all nodes of type ListItemNode found.
*/
function $getAllListItems(node) {
	let listItemNodes = [];
	const listChildren = node.getChildren().filter($isListItemNode);
	for (let i = 0; i < listChildren.length; i++) {
		const listItemNode = listChildren[i];
		const firstChild = listItemNode.getFirstChild();
		if ($isListNode(firstChild)) listItemNodes = listItemNodes.concat($getAllListItems(firstChild));
		else listItemNodes.push(listItemNode);
	}
	return listItemNodes;
}
/**
* Checks to see if the passed node is a ListItemNode and has a ListNode as a child.
* @param node - The node to be checked.
* @returns true if the node is a ListItemNode and has a ListNode child, false otherwise.
*/
function $isNestedListNode(node) {
	return $isListItemNode(node) && $isListNode(node.getFirstChild());
}
/**
* Takes a deeply nested ListNode or ListItemNode and traverses up the branch to delete the first
* ancestral ListNode (which could be the root ListNode) or ListItemNode with siblings, essentially
* bringing the deeply nested node up the branch once. Would remove sublist if it has siblings.
* Should not break ListItem -> List -> ListItem chain as empty List/ItemNodes should be removed on .remove().
* @param sublist - The nested ListNode or ListItemNode to be brought up the branch.
*/
function $removeHighestEmptyListParent(sublist) {
	let emptyListPtr = sublist;
	while (emptyListPtr.getNextSibling() == null && emptyListPtr.getPreviousSibling() == null) {
		const parent = emptyListPtr.getParent();
		if (parent == null || !($isListItemNode(parent) || $isListNode(parent))) break;
		emptyListPtr = parent;
	}
	emptyListPtr.remove();
}
/**
* Calculates the start value for a new list created by splitting an existing list.
*/
function $getNewListStart(list, listItem) {
	return listItem.getValue();
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/formatList.ts
function $isSelectingEmptyListItem(anchorNode, nodes) {
	return $isListItemNode(anchorNode) && (nodes.length === 0 || nodes.length === 1 && anchorNode.is(nodes[0]) && anchorNode.getChildrenSize() === 0);
}
/**
* Build the ListNode that replaces `list` when its type is changed. The
* replacement stands in for the same list, so it is a copy — carrying the
* direction, format, style, indent and start the original was given — rather
* than a default-constructed ListNode. Every other place a ListNode is
* replaced by an equivalent one ({@link $handleIndent},
* {@link $handleOutdent}, {@link ListItemNode.replace}, …) uses `$copyNode`
* for the same reason.
*/
function $newListFrom(list, listType) {
	return $isListNode(list) ? $copyNode(list).setListType(listType) : $createListNode(listType);
}
/**
* Inserts a new ListNode. If the selection's anchor node is an empty ListItemNode and is a child of
* the root/shadow root, it will replace the ListItemNode with a ListNode and the old ListItemNode.
* Otherwise it will replace its parent with a new ListNode and re-insert the ListItemNode and any previous children.
* If the selection's anchor node is not an empty ListItemNode, it will add a new ListNode or merge an existing ListNode,
* unless the node is a leaf node, in which case it will attempt to find a ListNode up the branch and replace it with
* a new ListNode, or create a new ListNode at the nearest root/shadow root.
* @param listType - The type of list, "number" | "bullet" | "check".
*/
function $insertList(listType) {
	const selection = $getSelection();
	if (selection !== null) {
		let nodes = selection.getNodes();
		if ($isRangeSelection(selection)) {
			const [anchor] = selection.getStartEndPoints();
			const anchorNode = anchor.getNode();
			const anchorNodeParent = anchorNode.getParent();
			if ($isRootOrShadowRoot(anchorNode)) {
				const firstChild = anchorNode.getFirstChild();
				if (firstChild) nodes = firstChild.selectStart().getNodes();
				else {
					const paragraph = $createParagraphNode();
					anchorNode.append(paragraph);
					nodes = paragraph.select().getNodes();
				}
			} else if ($isSelectingEmptyListItem(anchorNode, nodes)) {
				if ($isRootOrShadowRoot(anchorNodeParent)) {
					const list = $createListNode(listType);
					anchorNode.replace(list);
					const listItem = $createListItemNode();
					if ($isElementNode(anchorNode)) {
						listItem.setFormat(anchorNode.getFormatType());
						listItem.setIndent(anchorNode.getIndent());
					}
					list.append(listItem);
				} else if ($isListItemNode(anchorNode)) {
					const parent = anchorNode.getParentOrThrow();
					if ($getSlotHost(parent) === null) {
						const list = $newListFrom(parent, listType);
						append(list, parent.getChildren());
						parent.replace(list);
					}
				}
				return;
			}
		}
		const handled = /* @__PURE__ */ new Set();
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if ($isElementNode(node) && node.isEmpty() && !$isListItemNode(node) && $getSlotHost(node) === null && !handled.has(node.getKey())) {
				$createListOrMerge(node, listType);
				continue;
			}
			let parent = $isLeafNode(node) ? node.getParent() : $isListItemNode(node) && node.isEmpty() ? node : null;
			while (parent != null) {
				const parentKey = parent.getKey();
				if ($isListNode(parent)) {
					if (!handled.has(parentKey) && $getSlotHost(parent) === null) {
						const newListNode = $newListFrom(parent, listType);
						append(newListNode, parent.getChildren());
						parent.replace(newListNode);
						handled.add(parentKey);
					}
					break;
				} else {
					const nextParent = parent.getParent();
					if ($isRootOrShadowRoot(nextParent) && !handled.has(parentKey)) {
						handled.add(parentKey);
						$createListOrMerge(parent, listType);
						break;
					}
					parent = nextParent;
				}
			}
		}
	}
}
function append(node, nodesToAppend) {
	node.splice(node.getChildrenSize(), 0, nodesToAppend);
}
function $createListOrMerge(node, listType) {
	if ($isListNode(node)) return node;
	const previousSibling = node.getPreviousSibling();
	const nextSibling = node.getNextSibling();
	const listItem = $createListItemNode();
	append(listItem, node.getChildren());
	let targetList;
	if ($isListNode(previousSibling) && listType === previousSibling.getListType()) {
		previousSibling.append(listItem);
		if ($isListNode(nextSibling) && listType === nextSibling.getListType()) {
			append(previousSibling, nextSibling.getChildren());
			nextSibling.remove();
		}
		targetList = previousSibling;
	} else if ($isListNode(nextSibling) && listType === nextSibling.getListType()) {
		nextSibling.getFirstChildOrThrow().insertBefore(listItem);
		targetList = nextSibling;
	} else {
		const list = $createListNode(listType);
		list.append(listItem);
		node.replace(list);
		targetList = list;
	}
	listItem.setFormat(node.getFormatType());
	listItem.setIndent(node.getIndent());
	const selection = $getSelection();
	if ($isRangeSelection(selection)) {
		if (targetList.getKey() === selection.anchor.key) selection.anchor.set(listItem.getKey(), selection.anchor.offset, "element");
		if (targetList.getKey() === selection.focus.key) selection.focus.set(listItem.getKey(), selection.focus.offset, "element");
	}
	node.remove();
	return targetList;
}
/**
* A recursive function that goes through each list and their children, including nested lists,
* appending list2 children after list1 children and updating ListItemNode values.
* @param list1 - The first list to be merged.
* @param list2 - The second list to be merged.
*/
function mergeLists(list1, list2) {
	const listItem1 = list1.getLastChild();
	const listItem2 = list2.getFirstChild();
	if (listItem1 && listItem2 && $isNestedListNode(listItem1) && $isNestedListNode(listItem2) && listItem1.getFirstChild().getListType() === listItem2.getFirstChild().getListType()) {
		mergeLists(listItem1.getFirstChild(), listItem2.getFirstChild());
		listItem2.remove();
	}
	const toMerge = list2.getChildren();
	if (toMerge.length > 0) list1.append(...toMerge);
	list2.remove();
}
/**
* Searches for the nearest ancestral ListNode and removes it. If selection is an empty ListItemNode
* it will remove the whole list, including the ListItemNode. For each ListItemNode in the ListNode,
* removeList will also generate new ParagraphNodes in the removed ListNode's place. Any child node
* inside a ListItemNode will be appended to the new ParagraphNodes.
*/
function $removeList() {
	const selection = $getSelection();
	if ($isRangeSelection(selection)) {
		const listNodes = /* @__PURE__ */ new Set();
		const nodes = selection.getNodes();
		const anchorNode = selection.anchor.getNode();
		if ($isSelectingEmptyListItem(anchorNode, nodes)) listNodes.add($getTopListNode(anchorNode));
		else for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if ($isLeafNode(node)) {
				const listItemNode = $getNearestNodeOfType(node, ListItemNode);
				if (listItemNode != null) listNodes.add($getTopListNode(listItemNode));
			}
		}
		for (const listNode of listNodes) {
			if ($getSlotHost(listNode) !== null) continue;
			let insertionPoint = listNode;
			const listItems = $getAllListItems(listNode);
			for (const listItemNode of listItems) {
				const paragraph = $createParagraphNode().setTextStyle(selection.style).setTextFormat(selection.format);
				paragraph.setFormat(listItemNode.getFormatType()).setIndent(listItemNode.getIndent()).setDirection(listItemNode.getDirection()).setStyle(listItemNode.getStyle());
				append(paragraph, listItemNode.getChildren());
				insertionPoint.insertAfter(paragraph);
				insertionPoint = paragraph;
				if (listItemNode.__key === selection.anchor.key) $setPointFromCaret(selection.anchor, $normalizeCaret($getChildCaret(paragraph, "next")));
				if (listItemNode.__key === selection.focus.key) $setPointFromCaret(selection.focus, $normalizeCaret($getChildCaret(paragraph, "next")));
				listItemNode.remove();
			}
			listNode.remove();
		}
	}
}
/**
* Takes the value of a child ListItemNode and makes it the value the ListItemNode
* should be if it isn't already. Also ensures that checked is undefined if the
* parent does not have a list type of 'check'.
* @param list - The list whose children are updated.
*/
function updateChildrenListItemValue(list) {
	const isNotChecklist = list.getListType() !== "check";
	let value = list.getStart();
	for (const child of list.getChildren()) if ($isListItemNode(child)) {
		if (child.getValue() !== value) child.setValue(value);
		if (isNotChecklist && child.getLatest().__checked != null) child.setChecked(void 0);
		if (!$isListNode(child.getFirstChild())) value++;
	}
}
/**
* Merge the next sibling list if same type.
* <ul> will merge with <ul>, but NOT <ul> with <ol>.
* @param list - The list whose next sibling should be potentially merged
*/
function mergeNextSiblingListIfSameType(list) {
	const nextSibling = list.getNextSibling();
	if ($isListNode(nextSibling) && list.getListType() === nextSibling.getListType()) mergeLists(list, nextSibling);
}
/**
* Adds an empty ListNode/ListItemNode chain at listItemNode, so as to
* create an indent effect. Won't indent ListItemNodes that have a ListNode as
* a child, but does merge sibling ListItemNodes if one has a nested ListNode.
* @param listItemNode - The ListItemNode to be indented.
*/
function $handleIndent(listItemNode) {
	const removed = /* @__PURE__ */ new Set();
	if ($isNestedListNode(listItemNode) || removed.has(listItemNode.getKey())) return;
	const parent = listItemNode.getParent();
	const nextSibling = listItemNode.getNextSibling();
	const previousSibling = listItemNode.getPreviousSibling();
	if ($isNestedListNode(nextSibling) && $isNestedListNode(previousSibling)) {
		const innerList = previousSibling.getFirstChild();
		if ($isListNode(innerList)) {
			innerList.append(listItemNode);
			const nextInnerList = nextSibling.getFirstChild();
			if ($isListNode(nextInnerList) && innerList.getListType() === nextInnerList.getListType()) {
				append(innerList, nextInnerList.getChildren());
				nextSibling.remove();
				removed.add(nextSibling.getKey());
			}
		}
	} else if ($isNestedListNode(nextSibling)) {
		const innerList = nextSibling.getFirstChild();
		if ($isListNode(innerList)) {
			const firstChild = innerList.getFirstChild();
			if (firstChild !== null) firstChild.insertBefore(listItemNode);
		}
	} else if ($isNestedListNode(previousSibling)) {
		const innerList = previousSibling.getFirstChild();
		if ($isListNode(innerList)) innerList.append(listItemNode);
	} else if ($isListNode(parent)) {
		const newListItem = $copyNode(listItemNode);
		const newList = $copyNode(parent);
		newListItem.append(newList);
		newList.append(listItemNode);
		if (previousSibling) previousSibling.insertAfter(newListItem);
		else if (nextSibling) nextSibling.insertBefore(newListItem);
		else parent.append(newListItem);
	}
}
/**
* Removes an indent by removing an empty ListNode/ListItemNode chain. An indented ListItemNode
* has a great grandparent node of type ListNode, which is where the ListItemNode will reside
* within as a child.
* @param listItemNode - The ListItemNode to remove the indent (outdent).
*/
function $handleOutdent(listItemNode) {
	if ($isNestedListNode(listItemNode)) return;
	const parentList = listItemNode.getParent();
	const grandparentListItem = parentList ? parentList.getParent() : void 0;
	if ($isListNode(grandparentListItem ? grandparentListItem.getParent() : void 0) && $isListItemNode(grandparentListItem) && $isListNode(parentList)) {
		const firstChild = parentList ? parentList.getFirstChild() : void 0;
		const lastChild = parentList ? parentList.getLastChild() : void 0;
		if (listItemNode.is(firstChild)) {
			grandparentListItem.insertBefore(listItemNode);
			if (parentList.isEmpty()) grandparentListItem.remove();
		} else if (listItemNode.is(lastChild)) {
			grandparentListItem.insertAfter(listItemNode);
			if (parentList.isEmpty()) grandparentListItem.remove();
		} else {
			const previousSiblingsListItem = $copyNode(listItemNode);
			const previousSiblingsList = $copyNode(parentList);
			previousSiblingsListItem.append(previousSiblingsList);
			listItemNode.getPreviousSiblings().forEach((sibling) => previousSiblingsList.append(sibling));
			const nextSiblingsListItem = $copyNode(listItemNode);
			const nextSiblingsList = $copyNode(parentList);
			nextSiblingsListItem.append(nextSiblingsList);
			append(nextSiblingsList, listItemNode.getNextSiblings());
			grandparentListItem.insertBefore(previousSiblingsListItem);
			grandparentListItem.insertAfter(nextSiblingsListItem);
			grandparentListItem.replace(listItemNode);
		}
	}
}
/**
* Attempts to insert a ParagraphNode at selection and selects the new node. The selection must contain a ListItemNode
* or a node that does not already contain text. If its grandparent is the root/shadow root, it will get the ListNode
* (which should be the parent node) and insert the ParagraphNode as a sibling to the ListNode. If the ListNode is
* nested in a ListItemNode instead, it will add the ParagraphNode after the grandparent ListItemNode.
* Throws an invariant if the selection is not a child of a ListNode.
* @returns true if a ParagraphNode was inserted successfully, false if there is no selection
* or the selection does not contain a ListItemNode or the node already holds text.
*/
function $handleListInsertParagraph(restoreNumbering = false) {
	const selection = $getSelection();
	if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;
	const anchor = selection.anchor.getNode();
	let listItem = null;
	if ($isListItemNode(anchor) && anchor.getChildrenSize() === 0) listItem = anchor;
	else if ($isTextNode(anchor)) {
		const parentListItem = anchor.getParent();
		if ($isListItemNode(parentListItem) && parentListItem.getChildren().every((node) => $isTextNode(node) && node.getTextContent().trim() === "")) listItem = parentListItem;
	}
	if (listItem === null) return false;
	const topListNode = $getTopListNode(listItem);
	const parent = listItem.getParent();
	invariant($isListNode(parent), "A ListItemNode must have a ListNode for a parent.");
	const grandparent = parent.getParent();
	let replacementNode;
	if ($isRootOrShadowRoot(grandparent)) {
		replacementNode = $createParagraphNode();
		topListNode.insertAfter(replacementNode);
	} else if ($isListItemNode(grandparent)) {
		replacementNode = $copyNode(grandparent);
		grandparent.insertAfter(replacementNode);
	} else return false;
	replacementNode.setTextStyle(selection.style).setTextFormat(selection.format).select();
	const nextSiblings = listItem.getNextSiblings();
	if (nextSiblings.length > 0) {
		const newStart = restoreNumbering ? $getNewListStart(parent, listItem) : 1;
		const newList = $copyNode(parent).setStart(newStart);
		if ($isListItemNode(replacementNode)) {
			const newListItem = $copyNode(replacementNode);
			newListItem.append(newList);
			replacementNode.insertAfter(newListItem);
		} else replacementNode.insertAfter(newList);
		newList.append(...nextSiblings);
	}
	$removeHighestEmptyListParent(listItem);
	return true;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/LexicalListGeneratedJSON.ts
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
function numK(v, d, min, max, integer) {
	const n = num(v, NaN);
	if (!Number.isFinite(n) || integer && !Number.isInteger(n)) return d;
	return n < min ? min : n > max ? max : n;
}
/**
* ListNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneListNode(node, prevNode) {
	node.__listType = prevNode.__listType;
	node.__start = prevNode.__start;
	node.__tag = prevNode.__tag;
}
/** ListNode's generated implementations, for its `$config`. @internal */
var GENERATED_LIST = (fields) => {
	const LIST_FORMAT_GETTER = getterTableOf(fields, "format");
	const LIST_FORMAT_SETTER = setterTableOf(fields, "format");
	const LIST_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	const LIST_LISTTYPE_ALIAS = aliasTableOf(fields, "listType", 0);
	/** Generated from ListNode's serialization schema. Do not edit by hand. */
	function exportListNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			listType: node.__listType,
			start: node.__start,
			tag: node.__tag,
			direction: node.__dir,
			format: LIST_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from ListNode's serialization schema. Do not edit by hand. */
	function exportCompactListNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const listType = node.__listType;
		if (listType !== void 0 && listType !== "number") json.listType = listType;
		const start = node.__start;
		if (start !== void 0 && start !== 1) json.start = start;
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = LIST_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from ListNode's serialization schema. Do not edit by hand. */
	function updateListNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in LIST_FORMAT_SETTER ? LIST_FORMAT_SETTER[format] : LIST_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		const listType = json.listType;
		node.setListType(typeof listType === "string" && listType in LIST_LISTTYPE_ALIAS ? LIST_LISTTYPE_ALIAS[listType] : listType === "number" || listType === "bullet" || listType === "check" ? listType : "number");
		node.__start = num(json.start, 1);
		return node;
	}
	return {
		exportJSON: exportListNode,
		exportCompactJSON: exportCompactListNode,
		updateFromJSON: updateListNode,
		afterCloneFrom: afterCloneListNode
	};
};
/**
* ListItemNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneListItemNode(node, prevNode) {
	node.__checked = prevNode.__checked;
	node.__value = prevNode.__value;
}
/** ListItemNode's generated implementations, for its `$config`. @internal */
var GENERATED_LISTITEM = (fields) => {
	const LISTITEM_FORMAT_GETTER = getterTableOf(fields, "format");
	const LISTITEM_FORMAT_SETTER = setterTableOf(fields, "format");
	const LISTITEM_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from ListItemNode's serialization schema. Do not edit by hand. */
	function exportListItemNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			checked: node.getChecked(),
			indent: node.getIndent(),
			value: node.__value,
			direction: node.__dir,
			format: LISTITEM_FORMAT_GETTER[node.__format],
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from ListItemNode's serialization schema. Do not edit by hand. */
	function exportCompactListItemNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const checked = node.getChecked();
		if (checked !== void 0) json.checked = checked;
		const indent = node.getIndent();
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		const value = node.__value;
		if (value !== void 0 && value !== 1) json.value = value;
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = LISTITEM_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from ListItemNode's serialization schema. Do not edit by hand. */
	function updateListItemNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in LISTITEM_FORMAT_SETTER ? LISTITEM_FORMAT_SETTER[format] : LISTITEM_FORMAT_SETTER_DEFAULT;
		node.setIndent(numK(json.indent, 0, 0, 128, true));
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		const checked = json.checked;
		node.__checked = checked === void 0 ? void 0 : typeof checked === "boolean" ? checked : false;
		node.__value = num(json.value, 1);
		return node;
	}
	return {
		exportJSON: exportListItemNode,
		exportCompactJSON: exportCompactListItemNode,
		updateFromJSON: updateListItemNode,
		afterCloneFrom: afterCloneListItemNode
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/LexicalListItemNode.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var listItemNodeSchema = nodeSchema()({
	checked: withAccessors(optional(booleanValue()), { setter: { field: "__checked" } }),
	indent: numberValue(0, {
		clamp: true,
		integer: true,
		max: 128,
		min: 0
	}),
	value: withField(numberValue(1), { field: "__value" })
});
function applyMarkerStyles(dom, node, prevNode) {
	const nextTextStyle = node.__textStyle;
	const prevTextStyle = prevNode ? prevNode.__textStyle : "";
	if (prevNode !== null && prevTextStyle === nextTextStyle) return;
	const styles = getStyleObjectFromCSS(nextTextStyle);
	for (const k in styles) dom.style.setProperty(`--listitem-marker-${k}`, styles[k]);
	if (prevTextStyle !== "") {
		for (const k in getStyleObjectFromCSS(prevTextStyle)) if (!(k in styles)) dom.style.removeProperty(`--listitem-marker-${k}`);
	}
}
/** @noInheritDoc */
var ListItemNode = class extends ElementNode {
	/** @internal */
	__value;
	/** @internal */
	__checked;
	/** @internal */
	$config() {
		return this.config("listitem", {
			$transform: (node) => {
				const parent = node.getParent();
				if ($isListNode(parent)) {
					if (parent.getListType() !== "check" && node.getChecked() != null) node.setChecked(void 0);
				} else if (parent) {
					const newParent = node.createParentElementNode();
					invariant($isListNode(newParent), "ListItemNode.createParentElementNode() must return a ListNode");
					const children = [node];
					for (const dir of ["previous", "next"]) {
						children.reverse();
						for (const { origin } of $getSiblingCaret(node, dir)) {
							if (!$isListItemNode(origin)) break;
							children.push(origin);
						}
					}
					node.insertBefore(newParent);
					newParent.splice(0, 0, children);
					if (!$isRootOrShadowRoot(parent)) {
						$insertNodeToNearestRootAtCaret(newParent, $rewindSiblingCaret($getSiblingCaret(newParent, "next")), {
							$shouldSplit: () => false,
							removeEmptyDestination: true
						});
						if (parent.isEmpty() && parent.isAttached()) parent.remove();
					}
				}
			},
			extends: ElementNode,
			generated: GENERATED_LISTITEM,
			importDOM: buildImportMap({ li: () => ({
				conversion: $convertListItemElement,
				priority: 0
			}) }),
			json: listItemNodeSchema
		});
	}
	constructor(value = 1, checked = void 0, key) {
		super(key);
		this.__value = value === void 0 ? 1 : value;
		this.__checked = checked;
	}
	createDOM(config) {
		const element = $getDocument().createElement("li");
		this.updateListItemDOM(null, element, config);
		return element;
	}
	updateListItemDOM(prevNode, dom, config) {
		updateListItemChecked(dom, this, prevNode);
		dom.value = this.__value;
		$setListItemThemeClassNames(dom, config.theme, this);
		const prevStyle = prevNode ? prevNode.__style : "";
		const nextStyle = this.__style;
		if (prevStyle !== nextStyle) setDOMStyleFromCSS(dom.style, nextStyle, prevStyle);
		applyMarkerStyles(dom, this, prevNode);
	}
	updateDOM(prevNode, dom, config) {
		const element = dom;
		this.updateListItemDOM(prevNode, element, config);
		return false;
	}
	exportDOM(editor) {
		const element = this.createDOM(editor._config);
		const formatType = this.getFormatType();
		if (formatType) element.style.textAlign = formatType;
		const direction = this.getDirection();
		if (direction) element.dir = direction;
		if ($isNestedListNode(this)) return {
			after(containerElement) {
				if (isHTMLElement(containerElement)) {
					const prevSibling = containerElement.previousElementSibling;
					if (isHTMLElement(prevSibling) && prevSibling.nodeName === "LI") {
						while (containerElement.firstChild) prevSibling.append(containerElement.firstChild);
						containerElement.remove();
					}
				}
				return containerElement;
			},
			element
		};
		return { element };
	}
	append(...nodes) {
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if ($isElementNode(node) && this.canMergeWith(node)) {
				const children = node.getChildren();
				this.append(...children);
				node.remove();
			} else super.append(node);
		}
		return this;
	}
	replace(replaceWithNode, includeChildren) {
		if ($isListItemNode(replaceWithNode)) return super.replace(replaceWithNode);
		this.setIndent(0);
		const list = this.getParentOrThrow();
		if (!$isListNode(list)) return replaceWithNode;
		if (list.__first === this.getKey()) list.insertBefore(replaceWithNode);
		else if (list.__last === this.getKey()) list.insertAfter(replaceWithNode);
		else {
			const newList = $copyNode(list);
			let nextSibling = this.getNextSibling();
			while (nextSibling) {
				const nodeToAppend = nextSibling;
				nextSibling = nextSibling.getNextSibling();
				newList.append(nodeToAppend);
			}
			list.insertAfter(replaceWithNode);
			replaceWithNode.insertAfter(newList);
		}
		const toReplaceKey = this.__key;
		let prevSizeBeforeChildrenTransfer = 0;
		if (includeChildren) {
			invariant($isElementNode(replaceWithNode), "includeChildren should only be true for ElementNodes");
			prevSizeBeforeChildrenTransfer = replaceWithNode.getChildrenSize();
			replaceWithNode.splice(prevSizeBeforeChildrenTransfer, 0, this.getChildren());
		}
		if (includeChildren && $isElementNode(replaceWithNode)) {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				for (const point of selection.getStartEndPoints()) if (point.key === toReplaceKey && point.type === "element") point.set(replaceWithNode.getKey(), prevSizeBeforeChildrenTransfer + point.offset, "element");
			}
		}
		this.remove();
		if (list.getChildrenSize() === 0) list.remove();
		return replaceWithNode;
	}
	insertAfter(node, restoreSelection = true) {
		const listNode = this.getParentOrThrow();
		if (!$isListNode(listNode)) invariant(false, "insertAfter: list node is not parent of list item node");
		if ($isListItemNode(node)) return super.insertAfter(node, restoreSelection);
		const siblings = this.getNextSiblings();
		listNode.insertAfter(node, restoreSelection);
		if (siblings.length !== 0) {
			const newListNode = $copyNode(listNode);
			const firstSibling = siblings[0];
			if (newListNode.getListType() === "number" && $isListItemNode(firstSibling)) newListNode.setStart($getNewListStart(listNode, firstSibling));
			siblings.forEach((sibling) => newListNode.append(sibling));
			node.insertAfter(newListNode, restoreSelection);
		}
		return node;
	}
	remove(preserveEmptyParent) {
		const prevSibling = this.getPreviousSibling();
		const nextSibling = this.getNextSibling();
		super.remove(preserveEmptyParent);
		if (prevSibling && nextSibling && $isNestedListNode(prevSibling) && $isNestedListNode(nextSibling) && prevSibling.getFirstChild().getListType() === nextSibling.getFirstChild().getListType()) {
			mergeLists(prevSibling.getFirstChild(), nextSibling.getFirstChild());
			nextSibling.remove();
		}
	}
	resetOnCopyNodeFrom(original) {
		super.resetOnCopyNodeFrom(original);
		if (original.getChecked()) this.setChecked(false);
	}
	insertNewAfter(_, restoreSelection = true) {
		const newElement = $copyNode(this);
		this.insertAfter(newElement, restoreSelection);
		return newElement;
	}
	collapseAtStart(selection) {
		if ($isNestedListNode(this)) return false;
		const listNode = this.getParentOrThrow();
		if ($isListItemNode(listNode.getParentOrThrow())) {
			$handleOutdent(this);
			return true;
		}
		const paragraph = $createParagraphNode().append(...this.getChildren());
		const nextSiblings = this.getNextSiblings();
		if (nextSiblings.length > 0) {
			const newList = $copyNode(listNode);
			newList.append(...nextSiblings);
			listNode.insertAfter(newList);
		}
		listNode.insertAfter(paragraph);
		this.remove();
		if (listNode.getChildrenSize() === 0) listNode.remove();
		paragraph.selectStart();
		return true;
	}
	getValue() {
		return this.getLatest().__value;
	}
	setValue(value) {
		const self = this.getWritable();
		self.__value = value;
		return self;
	}
	getChecked() {
		const self = this.getLatest();
		let listType;
		const parent = this.getParent();
		if ($isListNode(parent)) listType = parent.getListType();
		return listType === "check" ? Boolean(self.__checked) : void 0;
	}
	setChecked(checked) {
		const self = this.getWritable();
		self.__checked = checked;
		return self;
	}
	toggleChecked() {
		const self = this.getWritable();
		return self.setChecked(!self.__checked);
	}
	getIndent() {
		const parent = this.getParent();
		if (parent === null || !this.isAttached()) return this.getLatest().__indent;
		let listNodeParent = parent.getParentOrThrow();
		let indentLevel = 0;
		while ($isListItemNode(listNodeParent)) {
			listNodeParent = listNodeParent.getParentOrThrow().getParentOrThrow();
			indentLevel++;
		}
		return indentLevel;
	}
	setIndent(indent) {
		invariant(typeof indent === "number", "Invalid indent value.");
		indent = Math.floor(indent);
		invariant(indent >= 0, "Indent value must be non-negative.");
		const target = indent;
		let currentIndent = this.getIndent();
		while (currentIndent !== target) if (currentIndent < target) {
			$handleIndent(this);
			currentIndent++;
		} else {
			$handleOutdent(this);
			currentIndent--;
		}
		return this;
	}
	/** @deprecated @internal */
	canInsertAfter(node) {
		return $isListItemNode(node);
	}
	/** @deprecated @internal */
	canReplaceWith(replacement) {
		return $isListItemNode(replacement);
	}
	canMergeWith(node) {
		return $isListItemNode(node) || $isParagraphNode(node);
	}
	extractWithChild(child, selection) {
		if (!$isRangeSelection(selection)) return false;
		const anchorNode = selection.anchor.getNode();
		const focusNode = selection.focus.getNode();
		return this.isParentOf(anchorNode) && this.isParentOf(focusNode) && this.getTextContent().length === selection.getTextContent().length;
	}
	isParentRequired() {
		return true;
	}
	createParentElementNode() {
		return $createListNode("bullet");
	}
	canMergeWhenEmpty() {
		return true;
	}
};
function $setListItemThemeClassNames(dom, editorThemeClasses, node) {
	const listTheme = editorThemeClasses.list;
	if (!listTheme) return;
	const listItemClassName = listTheme.listitem;
	const nestedListItemClassName = listTheme.nested && listTheme.nested.listitem;
	const parentNode = node.getParent();
	const isCheckList = $isListNode(parentNode) && parentNode.getListType() === "check";
	const checked = node.getChecked();
	const isNested = node.getChildren().some((child) => $isListNode(child));
	const classesToRemove = [];
	if (listTheme.listitemChecked !== void 0) classesToRemove.push(listTheme.listitemChecked);
	if (listTheme.listitemUnchecked !== void 0) classesToRemove.push(listTheme.listitemUnchecked);
	if (nestedListItemClassName !== void 0) classesToRemove.push(...normalizeClassNames(nestedListItemClassName));
	if (classesToRemove.length > 0) removeClassNamesFromElement(dom, ...classesToRemove);
	const classesToAdd = [];
	if (listItemClassName !== void 0) classesToAdd.push(...normalizeClassNames(listItemClassName));
	if (isCheckList) {
		const checkClassName = checked ? listTheme.listitemChecked : listTheme.listitemUnchecked;
		if (checkClassName !== void 0) classesToAdd.push(checkClassName);
	}
	if (nestedListItemClassName !== void 0 && isNested) classesToAdd.push(...normalizeClassNames(nestedListItemClassName));
	if (classesToAdd.length > 0) addClassNamesToElement(dom, ...classesToAdd);
}
function updateListItemChecked(dom, listItemNode, prevListItemNode) {
	const parent = listItemNode.getParent();
	if (!($isListNode(parent) && parent.getListType() === "check" && !$isListNode(listItemNode.getFirstChild()))) {
		dom.removeAttribute("role");
		dom.removeAttribute("tabIndex");
		dom.removeAttribute("aria-checked");
	} else {
		dom.setAttribute("role", "checkbox");
		dom.setAttribute("tabIndex", "-1");
		dom.setAttribute("aria-checked", listItemNode.getChecked() ? "true" : "false");
	}
}
function $convertListItemElement(domNode) {
	if (domNode.classList.contains("task-list-item")) {
		for (const child of domNode.children) if (child.tagName === "INPUT") return $convertCheckboxInput(child);
	}
	if (domNode.classList.contains("joplin-checkbox")) {
		for (const child of domNode.children) if (child.classList.contains("checkbox-wrapper") && child.children.length > 0 && child.children[0].tagName === "INPUT") return $convertCheckboxInput(child.children[0]);
	}
	const ariaCheckedAttr = domNode.getAttribute("aria-checked");
	const node = $createListItemNode(ariaCheckedAttr === "true" ? true : ariaCheckedAttr === "false" ? false : void 0);
	$setFormatFromDOM(node, domNode);
	return {
		after: setFormatFromChildren.bind(null, node),
		node: $setDirectionFromDOM(node, domNode)
	};
}
function $convertCheckboxInput(domNode) {
	if (!(domNode.getAttribute("type") === "checkbox")) return { node: null };
	const node = $createListItemNode(domNode.hasAttribute("checked"));
	return {
		after: setFormatFromChildren.bind(null, node),
		node
	};
}
function setFormatFromChildren(listItemNode, children) {
	const firstChild = children[0];
	if (children.length === 1 && $isParagraphNode(firstChild) && !listItemNode.getFormatType() && firstChild.getFormatType()) {
		listItemNode.setFormat(firstChild.getFormatType());
		return firstChild.getChildren();
	}
	return children;
}
/**
* Creates a new List Item node, passing true/false will convert it to a checkbox input.
* @param checked - Is the List Item a checkbox and, if so, is it checked? undefined/null: not a checkbox, true/false is a checkbox and checked/unchecked, respectively.
* @returns The new List Item.
*/
function $createListItemNode(checked) {
	return $applyNodeReplacement(new ListItemNode(void 0, checked));
}
/**
* Checks to see if the node is a ListItemNode.
* @param node - The node to be checked.
* @returns true if the node is a ListItemNode, false otherwise.
*/
function $isListItemNode(node) {
	return node instanceof ListItemNode;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/LexicalListNode.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var TAG_TO_LIST_TYPE = {
	ol: "number",
	ul: "bullet"
};
var listNodeSchema = nodeSchema()({
	listType: withAccessors(aliasedValue(enumValue([
		"number",
		"bullet",
		"check"
	]), TAG_TO_LIST_TYPE), { getter: { field: "__listType" } }),
	start: withField(numberValue(1), { field: "__start" }),
	tag: withAccessors(enumValue(["ul", "ol"]), {
		getter: { field: "__tag" },
		setter: null
	})
});
/** @noInheritDoc */
var ListNode = class extends ElementNode {
	/** @internal */
	__tag;
	/** @internal */
	__start;
	/** @internal */
	__listType;
	/** @internal */
	$config() {
		return this.config("list", {
			$transform: (node) => {
				mergeNextSiblingListIfSameType(node);
				updateChildrenListItemValue(node);
			},
			extends: ElementNode,
			generated: GENERATED_LIST,
			importDOM: buildImportMap({
				ol: () => ({
					conversion: $convertListNode,
					priority: 0
				}),
				ul: () => ({
					conversion: $convertListNode,
					priority: 0
				})
			}),
			json: listNodeSchema
		});
	}
	constructor(listType = "number", start = 1, key) {
		super(key);
		const _listType = TAG_TO_LIST_TYPE[listType] || listType;
		this.__listType = _listType;
		this.__tag = _listType === "number" ? "ol" : "ul";
		this.__start = start;
	}
	getTag() {
		return this.getLatest().__tag;
	}
	setListType(type) {
		const writable = this.getWritable();
		writable.__listType = type;
		writable.__tag = type === "number" ? "ol" : "ul";
		return writable;
	}
	getListType() {
		return this.getLatest().__listType;
	}
	getStart() {
		return this.getLatest().__start;
	}
	setStart(start) {
		const self = this.getWritable();
		self.__start = start;
		return self;
	}
	createDOM(config, _editor) {
		const tag = this.__tag;
		const dom = $getDocument().createElement(tag);
		if (this.__start !== 1) dom.setAttribute("start", String(this.__start));
		dom.__lexicalListType = this.__listType;
		$setListThemeClassNames(dom, config.theme, this);
		return dom;
	}
	updateDOM(prevNode, dom, config) {
		if (prevNode.__tag !== this.__tag || prevNode.__listType !== this.__listType) return true;
		$setListThemeClassNames(dom, config.theme, this);
		if (prevNode.__start !== this.__start) dom.setAttribute("start", String(this.__start));
		return false;
	}
	exportDOM(editor) {
		const element = this.createDOM(editor._config, editor);
		if (isHTMLElement(element)) {
			if (this.__start !== 1) element.setAttribute("start", String(this.__start));
			if (this.__listType === "check") element.setAttribute("__lexicalListType", "check");
			const direction = this.getDirection();
			if (direction) element.dir = direction;
		}
		return { element };
	}
	canBeEmpty() {
		return false;
	}
	canIndent() {
		return false;
	}
	splice(start, deleteCount, nodesToInsert) {
		let listItemNodesToInsert = nodesToInsert;
		for (let i = 0; i < nodesToInsert.length; i++) {
			const node = nodesToInsert[i];
			if (!$isListItemNode(node)) {
				if (listItemNodesToInsert === nodesToInsert) listItemNodesToInsert = [...nodesToInsert];
				const listItem = this.createListItemNode();
				if ($isElementNode(node) && !($isListNode(node) || node.isInline())) listItem.append(...node.getChildren());
				else listItem.append(node);
				listItemNodesToInsert[i] = listItem;
			}
		}
		return super.splice(start, deleteCount, listItemNodesToInsert);
	}
	extractWithChild(child) {
		return $isListItemNode(child);
	}
	/**
	* Create an appropriate ListItemNode to be a child of this ListNode,
	* {@link $createListItemNode} is the default implementation.
	*
	* @returns A new ListItemNode.
	*/
	createListItemNode() {
		return $createListItemNode();
	}
};
function $setListThemeClassNames(dom, editorThemeClasses, node) {
	const classesToAdd = [];
	const classesToRemove = [];
	const listTheme = editorThemeClasses.list;
	if (listTheme !== void 0) {
		const listLevelsClassNames = listTheme[`${node.__tag}Depth`] || [];
		const listDepth = $getListDepth(node) - 1;
		const normalizedListDepth = listDepth % listLevelsClassNames.length;
		const listLevelClassName = listLevelsClassNames[normalizedListDepth];
		const listClassName = listTheme[node.__tag];
		let nestedListClassName;
		const nestedListTheme = listTheme.nested;
		const checklistClassName = listTheme.checklist;
		if (nestedListTheme !== void 0 && nestedListTheme.list) nestedListClassName = nestedListTheme.list;
		if (listClassName !== void 0) classesToAdd.push(listClassName);
		if (checklistClassName !== void 0 && node.__listType === "check") classesToAdd.push(checklistClassName);
		if (listLevelClassName !== void 0) {
			classesToAdd.push(...normalizeClassNames(listLevelClassName));
			for (let i = 0; i < listLevelsClassNames.length; i++) if (i !== normalizedListDepth) classesToRemove.push(...normalizeClassNames(listLevelsClassNames[i]));
		}
		if (nestedListClassName !== void 0) {
			const nestedListItemClasses = normalizeClassNames(nestedListClassName);
			if (listDepth > 1) classesToAdd.push(...nestedListItemClasses);
			else classesToRemove.push(...nestedListItemClasses);
		}
	}
	if (classesToRemove.length > 0) removeClassNamesFromElement(dom, ...classesToRemove);
	if (classesToAdd.length > 0) addClassNamesToElement(dom, ...classesToAdd);
}
function $normalizeChildren(nodes, listNode) {
	const $createWrapperItem = listNode.createListItemNode.bind(listNode);
	const normalizedListItems = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if ($isListItemNode(node)) {
			normalizedListItems.push(node);
			const children = node.getChildren();
			if (children.length > 1) children.forEach((child) => {
				if ($isListNode(child)) normalizedListItems.push($createWrapperItem().append(child));
			});
		} else normalizedListItems.push($createWrapperItem().append(node));
	}
	return normalizedListItems;
}
function isDomChecklist$1(domNode) {
	if (domNode.getAttribute("__lexicallisttype") === "check" || domNode.classList.contains("contains-task-list") || domNode.getAttribute("data-is-checklist") === "1") return true;
	for (const child of domNode.childNodes) if (isHTMLElement(child) && child.hasAttribute("aria-checked")) return true;
	return false;
}
function isHTMLOListElement(node) {
	return isHTMLElement(node) && node.nodeName.toLowerCase() === "ol";
}
function $convertListNode(domNode) {
	let node;
	if (isHTMLOListElement(domNode)) {
		const start = domNode.start;
		node = $createListNode("number", start);
	} else if (isDomChecklist$1(domNode)) node = $createListNode("check");
	else node = $createListNode("bullet");
	$setDirectionFromDOM(node, domNode);
	return {
		after: (children) => $normalizeChildren(children, node),
		node
	};
}
/**
* Creates a ListNode of listType.
* @param listType - The type of list to be created. Can be 'number', 'bullet', or 'check'.
* @param start - Where an ordered list starts its count, start = 1 if left undefined.
* @returns The new ListNode
*/
function $createListNode(listType = "number", start = 1) {
	return $applyNodeReplacement(new ListNode(listType, start));
}
/**
* Checks to see if the node is a ListNode.
* @param node - The node to be checked.
* @returns true if the node is a ListNode, false otherwise.
*/
function $isListNode(node) {
	return node instanceof ListNode;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/checkList.ts
var CHECKBOX_KEYS = /* @__PURE__ */ new Set([
	" ",
	"Alt",
	"ArrowDown",
	"ArrowLeft",
	"ArrowUp",
	"CapsLock",
	"Control",
	"Escape",
	"Meta",
	"Shift"
]);
var INSERT_CHECK_LIST_COMMAND = createCommand("INSERT_CHECK_LIST_COMMAND");
/**
* Registers the checklist plugin with the editor.
* @param editor The LexicalEditor instance.
* @param options Optional configuration.
*   - disableTakeFocusOnClick: If true, clicking a checklist item will not focus the editor (useful for mobile).
*/
function registerCheckList(editor, options) {
	const disableTakeFocusOnClick = options && options.disableTakeFocusOnClick || false;
	const peekDisableTakeFocusOnClick = typeof disableTakeFocusOnClick === "boolean" ? () => disableTakeFocusOnClick : disableTakeFocusOnClick.peek.bind(disableTakeFocusOnClick);
	const DEDUP_WINDOW_MS = 500;
	const isWithinDedupWindow = (event) => {
		const target = event.target;
		if (!isHTMLElement(target)) return false;
		const last = target.__lexicalCheckListLastHandled;
		return last !== void 0 && event.timeStamp - last < DEDUP_WINDOW_MS;
	};
	const recordHandled = (event) => {
		const target = event.target;
		if (isHTMLElement(target)) target.__lexicalCheckListLastHandled = event.timeStamp;
	};
	const configHandleClick = (event) => {
		if (isWithinDedupWindow(event)) return;
		handleClick(event, peekDisableTakeFocusOnClick());
	};
	const configHandlePointerUp = (event) => {
		if (event.pointerType !== "touch") return;
		if (isWithinDedupWindow(event)) return;
		recordHandled(event);
		handleClick(event, peekDisableTakeFocusOnClick());
	};
	let lastPress = "none";
	const configHandleSelectDefaults = (event) => {
		lastPress = handleSelectDefaults(event, peekDisableTakeFocusOnClick()) ? "checkMark" : "content";
	};
	const returnFocusAfterPress = () => {
		if (lastPress === "content") returnFocusToRoot(editor);
		lastPress = "none";
	};
	return mergeRegister(editor.registerCommand(INSERT_CHECK_LIST_COMMAND, () => {
		$insertList("check");
		return true;
	}, 1), editor.registerCommand(KEY_ARROW_DOWN_COMMAND, (event) => {
		return handleArrowUpOrDown(event, editor, false);
	}, 1), editor.registerCommand(KEY_ARROW_UP_COMMAND, (event) => {
		return handleArrowUpOrDown(event, editor, true);
	}, 1), editor.registerCommand(KEY_ESCAPE_COMMAND, () => {
		if (getActiveCheckListItem(editor) != null) {
			const rootElement = editor.getRootElement();
			if (rootElement != null) rootElement.focus();
			return true;
		}
		return false;
	}, 1), editor.registerCommand(KEY_SPACE_COMMAND, (event) => {
		const activeItem = getActiveCheckListItem(editor);
		if (activeItem != null && editor.isEditable()) {
			editor.update(() => {
				const listItemNode = $getNearestNodeFromDOMNode(activeItem);
				if ($isListItemNode(listItemNode)) {
					event.preventDefault();
					listItemNode.toggleChecked();
				}
			});
			return true;
		}
		return false;
	}, 1), editor.registerCommand(KEY_ARROW_LEFT_COMMAND, (event) => {
		if (getActiveCheckListItem(editor) !== null) {
			returnFocusToRoot(editor);
			return false;
		}
		return editor.read("latest", () => {
			const selection = $getSelection();
			if ($isRangeSelection(selection) && selection.isCollapsed()) {
				const { anchor } = selection;
				const isElement = anchor.type === "element";
				if (isElement || anchor.offset === 0) {
					const anchorNode = anchor.getNode();
					const elementNode = $findMatchingParent(anchorNode, (node) => $isElementNode(node) && !node.isInline());
					if ($isListItemNode(elementNode)) {
						const parent = elementNode.getParent();
						if ($isListNode(parent) && parent.getListType() === "check" && (isElement || elementNode.getFirstDescendant() === anchorNode)) {
							const domNode = editor.getElementByKey(elementNode.__key);
							if (domNode != null && getActiveElement(domNode) !== domNode) {
								domNode.focus();
								event.preventDefault();
								return true;
							}
						}
					}
				}
			}
			return false;
		});
	}, 1), editor.registerRootListener((rootElement) => {
		if (rootElement !== null) return mergeRegister(registerEventListeners(rootElement, {
			click: (event) => {
				returnFocusAfterPress();
				configHandleClick(event);
			},
			pointerup: (event) => {
				returnFocusAfterPress();
				configHandlePointerUp(event);
			}
		}), registerEventListeners(rootElement, {
			beforeinput: () => returnFocusToRoot(editor),
			focusin: () => {
				if (IS_FIREFOX && lastPress === "content") returnFocusToRoot(editor);
			},
			keydown: (event) => {
				if (!CHECKBOX_KEYS.has(event.key)) returnFocusToRoot(editor);
			},
			mousedown: configHandleSelectDefaults,
			pointerdown: configHandleSelectDefaults
		}, { capture: true }), registerEventListener(rootElement, "touchstart", configHandleSelectDefaults, {
			capture: true,
			passive: false
		}));
	}));
}
function handleCheckItemEvent(event, callback) {
	const target = event.target;
	if (!isHTMLElement(target)) return;
	const firstChild = target.firstChild;
	if (isHTMLElement(firstChild) && (firstChild.tagName === "UL" || firstChild.tagName === "OL")) return;
	const parentNode = target.parentNode;
	if (!parentNode || parentNode.__lexicalListType !== "check") return;
	let clientX = null;
	let pointerType = null;
	if ("clientX" in event) clientX = event.clientX;
	else if ("touches" in event) {
		const touches = event.touches;
		if (touches.length > 0) {
			clientX = touches[0].clientX;
			pointerType = "touch";
		}
	}
	if (clientX == null) return;
	const rect = target.getBoundingClientRect();
	const zoom = calculateZoomLevel(target);
	const clientXInPixels = clientX / zoom;
	const targetView = target.ownerDocument.defaultView;
	const beforeStyles = targetView ? targetView.getComputedStyle(target, "::before") : { width: "0px" };
	const beforeWidthInPixels = parseFloat(beforeStyles.width);
	const clickAreaPadding = pointerType === "touch" || "pointerType" in event && event.pointerType === "touch" ? 32 : 0;
	if (target.dir === "rtl" ? clientXInPixels < rect.right + clickAreaPadding && clientXInPixels > rect.right - beforeWidthInPixels - clickAreaPadding : clientXInPixels > rect.left - clickAreaPadding && clientXInPixels < rect.left + beforeWidthInPixels + clickAreaPadding) callback();
}
function handleClick(event, disableFocusOnClick) {
	handleCheckItemEvent(event, () => {
		if (isHTMLElement(event.target)) {
			const domNode = event.target;
			const editor = getNearestEditorFromDOMNode(domNode);
			if (editor != null && editor.isEditable()) editor.update(() => {
				const node = $getNearestNodeFromDOMNode(domNode);
				if ($isListItemNode(node)) {
					if (disableFocusOnClick) {
						$addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
						$addUpdateTag(SKIP_DOM_SELECTION_TAG);
					} else domNode.focus();
					node.toggleChecked();
				}
			});
		}
	});
}
/**
* Prevents default focus switch behavior
*
* @param event might be of type PointerEvent, MouseEvent, or TouchEvent, hence the generic Event type
*
*/
function handleSelectDefaults(event, disableTakeFocusOnClick) {
	let isCheckMarkPress = false;
	handleCheckItemEvent(event, () => {
		isCheckMarkPress = true;
		event.preventDefault();
		if (disableTakeFocusOnClick) event.stopPropagation();
	});
	return isCheckMarkPress;
}
function returnFocusToRoot(editor) {
	const rootElement = editor.getRootElement();
	const activeElement = rootElement ? getActiveElement(rootElement) : null;
	if (rootElement !== null && isHTMLElement(activeElement) && isCheckListItem(activeElement)) rootElement.focus({ preventScroll: true });
}
function isCheckListItem(dom) {
	const parentNode = dom.parentNode;
	return dom.tagName === "LI" && parentNode != null && parentNode.__lexicalListType === "check";
}
function getActiveCheckListItem(editor) {
	const rootElement = editor.getRootElement();
	const activeElement = rootElement ? getActiveElement(rootElement) : null;
	return isHTMLElement(activeElement) && isCheckListItem(activeElement) ? activeElement : null;
}
function findCheckListItemSibling(node, backward) {
	let sibling = backward ? node.getPreviousSibling() : node.getNextSibling();
	let parent = node;
	while (sibling == null && $isListItemNode(parent)) {
		parent = parent.getParentOrThrow().getParent();
		if (parent != null) sibling = backward ? parent.getPreviousSibling() : parent.getNextSibling();
	}
	while ($isListItemNode(sibling)) {
		const firstChild = backward ? sibling.getLastChild() : sibling.getFirstChild();
		if (!$isListNode(firstChild)) return sibling;
		sibling = backward ? firstChild.getLastChild() : firstChild.getFirstChild();
	}
	return null;
}
function handleArrowUpOrDown(event, editor, backward) {
	const activeItem = getActiveCheckListItem(editor);
	if (activeItem != null) {
		let nextItemKey = null;
		editor.update(() => {
			const listItem = $getNearestNodeFromDOMNode(activeItem);
			if (!$isListItemNode(listItem)) return;
			const nextListItem = findCheckListItemSibling(listItem, backward);
			if (nextListItem != null) {
				nextListItem.selectStart();
				if (editor.getElementByKey(nextListItem.__key) != null) {
					event.preventDefault();
					nextItemKey = nextListItem.__key;
				}
			}
		}, { onUpdate: () => {
			const dom = nextItemKey === null ? null : editor.getElementByKey(nextItemKey);
			if (dom != null) dom.focus();
		} });
	}
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/ListImportExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Mirrors the legacy `isDomChecklist` heuristic from
* `@lexical/list`.
*/
function isDomChecklist(domNode) {
	return domNode.matches("[__lexicallisttype=\"check\"], .contains-task-list, [data-is-checklist=\"1\"]") || domNode.querySelector(":scope > [aria-checked]") !== null;
}
/**
* Lift nested `ListNode`s out of `ListItemNode`s into sibling
* `ListItemNode`s (the legacy `$normalizeChildren` shape). Also wraps any
* non-`ListItemNode` children in a new `ListItemNode`.
*
* The wrapper items come from `listNode.createListItemNode()` — the same
* subclass hook the legacy `$normalizeChildren` uses — so a `ListNode`
* subclass gets its own item type here too.
*/
function $normalizeListChildren(children, listNode) {
	const out = [];
	for (const child of children) if ($isListItemNode(child)) {
		out.push(child);
		const innerChildren = child.getChildren();
		if (innerChildren.length > 1) {
			for (const inner of innerChildren) if ($isListNode(inner)) out.push(listNode.createListItemNode().append(inner));
		}
	} else out.push(listNode.createListItemNode().append(child));
	return out;
}
var ListRule = defineImportRule({
	$import: (ctx, el) => {
		let node;
		if (isElementOfTag(el, "ol")) node = $createListNode("number", el.start);
		else if (isDomChecklist(el)) node = $createListNode("check");
		else node = $createListNode("bullet");
		$setDirectionFromDOM(node, el);
		return [node.splice(0, 0, $propagateTextAlignToBlockChildren($normalizeListChildren(ctx.$importChildren(el), node), el))];
	},
	match: sel.tag("ol", "ul"),
	name: "@lexical/list/list"
});
/**
* Apply formatting from the first child paragraph of `<li>` to the list
* item itself, then unwrap that paragraph (Google Docs sets the alignment
* of the `<p>` inside the `<li>`). Mirrors the legacy
* `setFormatFromChildren`.
*/
function $liftFormatFromSingleParagraph(listItemNode, children) {
	if (children.length !== 1) return children;
	const firstChild = children[0];
	if ($isParagraphNode(firstChild) && !listItemNode.getFormatType() && firstChild.getFormatType()) {
		listItemNode.setFormat(firstChild.getFormatType());
		return firstChild.getChildren();
	}
	return children;
}
/**
* Collapse block children of a `<li>` into inline-with-line-break form: a
* `ListItemNode` is an inline-level container, so any block child marks a
* boundary. Contiguous inline siblings are kept together as a single run and
* one {@link $createLineBreakNode} is inserted between runs — reproducing the
* legacy `wrapContinuousInlines` + `$unwrapArtificialNodes` shape
* (`<li>1<div>2</div>3</li>` → `1<br>2<br>3`) without the
* `ArtificialNode__DO_NOT_USE` marker.
*
* Boundaries are detected with {@link $isBlockLevel}, NOT `$isParagraphNode`:
* the `<div>`/`<section>`/… `TransparentBlockRule` happens to emit
* `ParagraphNode`s, but a `<blockquote>` (`QuoteNode`), heading
* (`HeadingNode`), or block decorator (`HorizontalRuleNode`, …) is just as
* much a block boundary and must not be silently spliced into the list item
* as-is. A nested `ListNode` is the one deliberate exception — it is a valid
* list-item child that {@link $normalizeListChildren} lifts into a sibling,
* so it is preserved here rather than unwrapped.
*/
function $flattenListItemBlocks(children) {
	const $isBoundary = (node) => $isBlockLevel(node) && !$isListNode(node);
	if (!children.some($isBoundary)) return children;
	const segments = [];
	let inlineRun = [];
	const flushInlineRun = () => {
		if (inlineRun.length > 0) {
			segments.push(inlineRun);
			inlineRun = [];
		}
	};
	for (const child of children) if ($isBoundary(child)) {
		flushInlineRun();
		segments.push($isElementNode(child) ? child.getChildren() : [child]);
	} else inlineRun.push(child);
	flushInlineRun();
	const out = [];
	for (const segment of segments) {
		if (out.length > 0) out.push($createLineBreakNode());
		out.push(...segment);
	}
	return out;
}
var ListItemRule = defineImportRule({
	$import: (ctx, el) => {
		const ariaChecked = el.getAttribute("aria-checked");
		const node = $createListItemNode(ariaChecked === "true" ? true : ariaChecked === "false" ? false : void 0);
		$setFormatFromDOM(node, el);
		$setDirectionFromDOM(node, el);
		return [node.splice(0, 0, $flattenListItemBlocks($liftFormatFromSingleParagraph(node, ctx.$importChildren(el))))];
	},
	match: sel.tag("li"),
	name: "@lexical/list/li"
});
function $buildChecklistItem(ctx, el, checkboxOwner) {
	const checkboxInput = isElementOfTag(checkboxOwner, "input") ? checkboxOwner : checkboxOwner.querySelector("input[type=\"checkbox\"]");
	if (!checkboxInput || checkboxInput.getAttribute("type") !== "checkbox") return [];
	const node = $createListItemNode(checkboxInput.hasAttribute("checked"));
	$setFormatFromDOM(node, el);
	$setDirectionFromDOM(node, el);
	return [node.splice(0, 0, $flattenListItemBlocks($liftFormatFromSingleParagraph(node, ctx.$importChildren(el))))];
}
var TaskListItemRule = defineImportRule({
	$import: (ctx, el, $next) => {
		const input = el.querySelector(":scope > input[type=\"checkbox\"]");
		if (!input) return $next();
		return $buildChecklistItem(ctx, el, input);
	},
	match: sel.tag("li").classAll("task-list-item"),
	name: "@lexical/list/li-task-list-item"
});
var JoplinChecklistItemRule = defineImportRule({
	$import: (ctx, el, $next) => {
		const wrapper = el.querySelector(":scope > .checkbox-wrapper");
		if (!wrapper) return $next();
		const input = wrapper.querySelector(":scope > input[type=\"checkbox\"]");
		if (!input) return $next();
		return $buildChecklistItem(ctx, el, input);
	},
	match: sel.tag("li").classAll("joplin-checkbox"),
	name: "@lexical/list/li-joplin-checkbox"
});
/**
* A {@link ChildSchema} that enforces ListNode invariants: only
* `ListItemNode` and (immediately-nested) `ListNode` children are
* accepted; runs of other children get wrapped in a fresh
* `ListItemNode`.
*
* @experimental
*/
var ListSchema = {
	$accepts: (child) => $isListItemNode(child) || $isListNode(child),
	$packageRun: (run) => [$createListItemNode().splice(0, 0, run)],
	name: "ListSchema"
};
/**
* Import rules for {@link ListNode} and {@link ListItemNode}, including
* GitHub task-list and Joplin checkbox heuristics.
*
* Registered by {@link ListExtension} itself (together with
* `CoreImportExtension`), so any editor that uses the list extension can
* import these tags through the `DOMImportExtension` pipeline without
* further configuration.
*
* @experimental
*/
var ListImportRules = [
	TaskListItemRule,
	JoplinChecklistItemRule,
	ListRule,
	ListItemRule
];
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/registerList.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var UPDATE_LIST_START_COMMAND = createCommand("UPDATE_LIST_START_COMMAND");
var INSERT_UNORDERED_LIST_COMMAND = createCommand("INSERT_UNORDERED_LIST_COMMAND");
var INSERT_ORDERED_LIST_COMMAND = createCommand("INSERT_ORDERED_LIST_COMMAND");
var REMOVE_LIST_COMMAND = createCommand("REMOVE_LIST_COMMAND");
function registerList(editor, options) {
	return mergeRegister(editor.registerCommand(INSERT_ORDERED_LIST_COMMAND, () => {
		$insertList("number");
		return true;
	}, 1), editor.registerCommand(UPDATE_LIST_START_COMMAND, (payload) => {
		const { listNodeKey, newStart } = payload;
		const listNode = $getNodeByKey(listNodeKey);
		if (!$isListNode(listNode)) return false;
		if (listNode.getListType() === "number") {
			listNode.setStart(newStart);
			updateChildrenListItemValue(listNode);
		}
		return true;
	}, 1), editor.registerCommand(INSERT_UNORDERED_LIST_COMMAND, () => {
		$insertList("bullet");
		return true;
	}, 1), editor.registerCommand(REMOVE_LIST_COMMAND, () => {
		$removeList();
		return true;
	}, 1), editor.registerCommand(INSERT_PARAGRAPH_COMMAND, () => {
		return $handleListInsertParagraph(!!(options && options.restoreNumbering));
	}, 1), editor.registerCommand(KEY_BACKSPACE_COMMAND, (event) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;
		const { anchor } = selection;
		if (anchor.offset !== 0) return false;
		let current = anchor.getNode();
		while (!$isListItemNode(current)) {
			if (current.getPreviousSibling() !== null) return false;
			const parent = current.getParent();
			if (parent === null) return false;
			current = parent;
		}
		if ($isListItemNode(current) && current.collapseAtStart(selection)) {
			event.preventDefault();
			return true;
		}
		return false;
	}, -8), editor.registerNodeTransform(ListItemNode, (node) => {
		const firstChild = node.getFirstChild();
		if (firstChild) {
			if ($isTextNode(firstChild)) {
				const style = firstChild.getStyle();
				const format = firstChild.getFormat();
				if (node.getTextStyle() !== style) node.setTextStyle(style);
				if (node.getTextFormat() !== format) node.setTextFormat(format);
			}
		} else {
			const selection = $getSelection();
			if ($isRangeSelection(selection) && (selection.style !== node.getTextStyle() || selection.format !== node.getTextFormat()) && selection.isCollapsed() && node.is(selection.anchor.getNode())) node.setTextStyle(selection.style).setTextFormat(selection.format);
		}
	}), editor.registerNodeTransform(TextNode, (node) => {
		const listItemParentNode = node.getParent();
		if ($isListItemNode(listItemParentNode) && node.is(listItemParentNode.getFirstChild())) {
			const style = node.getStyle();
			const format = node.getFormat();
			if (style !== listItemParentNode.getTextStyle() || format !== listItemParentNode.getTextFormat()) listItemParentNode.setTextStyle(style).setTextFormat(format);
		}
	}));
}
function registerListStrictIndentTransform(editor) {
	const $formatListIndentStrict = (listItemNode) => {
		const listNode = listItemNode.getParent();
		if ($isListNode(listItemNode.getFirstChild()) || !$isListNode(listNode)) return;
		const startingListItemNode = $findMatchingParent(listItemNode, (node) => $isListItemNode(node) && $isListNode(node.getParent()) && $isListItemNode(node.getPreviousSibling()));
		if (startingListItemNode === null && listItemNode.getIndent() > 0) listItemNode.setIndent(0);
		else if ($isListItemNode(startingListItemNode)) {
			const prevListItemNode = startingListItemNode.getPreviousSibling();
			if ($isListItemNode(prevListItemNode)) {
				const endListNode = $findChildrenEndListItemNode(prevListItemNode).getParent();
				if ($isListNode(endListNode)) {
					const prevDepth = $getListDepth(endListNode);
					const depth = $getListDepth(listNode);
					if (prevDepth + 1 < depth) listItemNode.setIndent(prevDepth);
				}
			}
		}
	};
	const $processListWithStrictIndent = (listNode) => {
		const queue = [listNode];
		while (queue.length > 0) {
			const node = queue.shift();
			if (!$isListNode(node)) continue;
			for (const child of node.getChildren()) if ($isListItemNode(child)) {
				$formatListIndentStrict(child);
				const firstChild = child.getFirstChild();
				if ($isListNode(firstChild)) queue.push(firstChild);
			}
		}
	};
	return editor.registerNodeTransform(ListNode, $processListWithStrictIndent);
}
function $findChildrenEndListItemNode(listItemNode) {
	let current = listItemNode;
	let firstChild = current.getFirstChild();
	while ($isListNode(firstChild)) {
		const lastChild = firstChild.getLastChild();
		if ($isListItemNode(lastChild)) {
			current = lastChild;
			firstChild = current.getFirstChild();
		} else break;
	}
	return current;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/LexicalListExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Configures {@link ListNode}, {@link ListItemNode} and registers
* the strict indent transform if `hasStrictIndent` is true (default false).
*/
var ListExtension = defineExtension({
	build(editor, config, state) {
		return namedSignals(config);
	},
	config: safeCast({
		hasStrictIndent: false,
		shouldPreserveNumbering: false
	}),
	dependencies: [CoreImportExtension, configExtension(DOMImportExtension, { rules: ListImportRules })],
	name: "@lexical/list/List",
	nodes: () => [ListNode, ListItemNode],
	register(editor, config, state) {
		const stores = state.getOutput();
		return mergeRegister(j(() => {
			return registerList(editor, { restoreNumbering: stores.shouldPreserveNumbering.value });
		}), j(() => stores.hasStrictIndent.value ? registerListStrictIndentTransform(editor) : void 0));
	}
});
/**
* Registers checklist functionality for {@link ListNode} and
* {@link ListItemNode} with a `INSERT_CHECK_LIST_COMMAND` listener and
* the expected keyboard and mouse interactions for checkboxes.
*/
var CheckListExtension = defineExtension({
	build: (editor, config) => namedSignals(config),
	config: safeCast({ disableTakeFocusOnClick: false }),
	dependencies: [ListExtension],
	name: "@lexical/list/CheckList",
	register: (editor, config, state) => registerCheckList(editor, state.getOutput())
});
/**
* Bundles {@link ListImportRules} together with the runtime
* {@link ListExtension}.
*
* @experimental
* @deprecated {@link ListExtension} now registers
* {@link ListImportRules} (and `CoreImportExtension`) itself — depend on
* it directly instead.
*/
var ListImportExtension = defineExtension({
	dependencies: [ListExtension],
	name: "@lexical/list/Import"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/WordListImportExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var WORD_LIST_CLASS_RE = /^MsoListParagraph(CxSp(First|Middle|Last))?$/;
var WORD_NUMBERED_RE = /^[A-Za-z0-9]+[.)]/;
var WORD_GENERATOR_RE = /Microsoft Word/i;
/**
* `mso-list` is a Microsoft non-standard CSS property, so neither
* browsers nor JSDOM surface it through `el.style`. Worse, the default
* `$inlineStylesFromStyleSheets` preprocess writes each element's
* inline style through `CSSStyleDeclaration.setProperty`, which
* re-serializes the `style` attribute and drops the unknown property
* altogether. {@link $installWordListPasteOverlay} runs first (it is
* pushed onto the preprocess stack, so it sits on top) and snapshots
* `mso-list` onto this `data-*` attribute, which survives the later
* stylesheet-inlining pass.
*/
var MSO_LIST_DATA_ATTR = "data-mso-list";
function readWordListLevel(el) {
	const m = (el.getAttribute(MSO_LIST_DATA_ATTR) || "").match(/level(\d+)/);
	return m ? parseInt(m[1], 10) : 1;
}
function findMarkerSpan(el) {
	return el.querySelector(`span[${MSO_LIST_DATA_ATTR}="Ignore"]`);
}
function readWordMarker(el) {
	const span = findMarkerSpan(el);
	return span ? (span.textContent || "").trim() : "";
}
function classifyWordListType(marker) {
	return WORD_NUMBERED_RE.test(marker) ? "number" : "bullet";
}
function stripWordMarker(el) {
	const inner = findMarkerSpan(el);
	if (!inner) return;
	let outer = inner;
	while (outer.parentElement && outer.parentElement !== el && outer.parentElement.nodeName === "SPAN") outer = outer.parentElement;
	outer.remove();
}
function isWordListParagraph(node) {
	return isHTMLElement(node) && WORD_LIST_CLASS_RE.test(node.className);
}
function $buildWordListTree(ctx, items) {
	const root = $createListNode(classifyWordListType(items[0].marker));
	const stack = [{
		level: items[0].level,
		list: root
	}];
	for (const item of items) {
		while (stack.length > 1 && stack[stack.length - 1].level > item.level) stack.pop();
		if (item.level > stack[stack.length - 1].level) {
			const sub = $createListNode(classifyWordListType(item.marker));
			stack[stack.length - 1].list.append($createListItemNode().append(sub));
			stack.push({
				level: item.level,
				list: sub
			});
		}
		stripWordMarker(item.el);
		stack[stack.length - 1].list.append($createListItemNode().splice(0, 0, ctx.$importChildren(item.el, { schema: InlineSchema })));
	}
	return root;
}
/**
* Per-import session WeakSet tracking `<p class="MsoListParagraph*">`
* elements already absorbed by an earlier sibling's list-construction
* pass, so the framework's normal child iteration treats them as
* no-ops. The default is `null` and the rule lazily installs a fresh
* WeakSet per session, because `createImportState`'s default factory
* runs once at state creation and its result is shared across sessions.
*/
var WordListConsumed = createImportState("@lexical/list/word-consumed-list-items", () => null);
var WordListParagraphRule = defineImportRule({
	$import: (ctx, el) => {
		let consumed = ctx.session.get(WordListConsumed);
		if (consumed === null) {
			consumed = /* @__PURE__ */ new WeakSet();
			ctx.session.set(WordListConsumed, consumed);
		}
		if (consumed.has(el)) return [];
		const items = [];
		let cur = el;
		while (cur && isWordListParagraph(cur)) {
			consumed.add(cur);
			items.push({
				el: cur,
				level: readWordListLevel(cur),
				marker: readWordMarker(cur)
			});
			if (cur.classList.contains("MsoListParagraphCxSpLast") || cur.className === "MsoListParagraph") break;
			cur = cur.nextElementSibling;
		}
		return [$buildWordListTree(ctx, items)];
	},
	match: sel.tag("p").classAny("MsoListParagraph", "MsoListParagraphCxSpFirst", "MsoListParagraphCxSpMiddle", "MsoListParagraphCxSpLast"),
	name: "@lexical/list/word-list-paragraph"
});
var WordOfficeParagraphRule = defineImportRule({
	$import: () => [],
	match: sel.tag("o:p"),
	name: "@lexical/list/word-o-p"
});
var WordListPasteOverlay = defineOverlayRules([WordOfficeParagraphRule, WordListParagraphRule]);
/**
* MS Word pastes have no `<ol>`/`<ul>`/`<li>` at all: a list is a flat
* run of `<p class="MsoListParagraph*">` siblings whose marker ("1.",
* "·", "a)") lives in a nested `<span style="mso-list:Ignore">`, with
* `style="mso-list:l<N> level<M> lfo<X>"` on the paragraph naming the
* list and its nesting depth.
*
* This preprocess looks once for
* `<meta name="Generator" content="Microsoft Word…">` and, only when it
* matches, snapshots the `mso-list` declarations (see
* {@link MSO_LIST_DATA_ATTR}) and pushes a Word-specific overlay onto
* {@link ImportOverlays}. The overlay's rule walks forward through
* siblings to collect a complete run and rebuilds it as a nested
* {@link ListNode} tree. Pastes from other sources pay only the
* detection cost.
*
* Installed by {@link WordListImportExtension}.
*/
var $installWordListPasteOverlay = (dom, ctx, $next) => {
	const meta = dom.querySelector("meta[name=\"Generator\"]");
	if (meta && WORD_GENERATOR_RE.test(meta.getAttribute("content") || "")) {
		for (const el of Array.from(dom.querySelectorAll("[style*=\"mso-list\"]"))) {
			const msoList = getStyleObjectFromCSS(el.getAttribute("style") || "")["mso-list"];
			if (msoList) el.setAttribute(MSO_LIST_DATA_ATTR, msoList);
		}
		ctx.session.update(ImportOverlays, (prev) => [...prev, WordListPasteOverlay]);
	}
	$next();
};
/**
* Word list paste support for {@link ListNode}: opt in by adding this to
* an editor's dependencies. {@link ListExtension} does not depend on it,
* so an editor that never pastes from Word does not bundle any of it.
*
* ```ts
* defineExtension({
*   dependencies: [WordListImportExtension],
*   name: 'my-editor',
* });
* ```
*
* @experimental
*/
var WordListImportExtension = defineExtension({
	dependencies: [ListExtension, configExtension(DOMImportExtension, { preprocess: [$installWordListPasteOverlay] })],
	name: "@lexical/list/WordListImport"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+list@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/list/src/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
//#endregion
export { $removeList as C, $insertList as S, ListNode as _, INSERT_ORDERED_LIST_COMMAND as a, ListItemNode as b, UPDATE_LIST_START_COMMAND as c, ListImportRules as d, ListSchema as f, $isListNode as g, $createListNode as h, ListImportExtension as i, registerList as l, registerCheckList as m, CheckListExtension as n, INSERT_UNORDERED_LIST_COMMAND as o, INSERT_CHECK_LIST_COMMAND as p, ListExtension as r, REMOVE_LIST_COMMAND as s, WordListImportExtension as t, registerListStrictIndentTransform as u, $createListItemNode as v, $getListDepth as w, $handleListInsertParagraph as x, $isListItemNode as y };
