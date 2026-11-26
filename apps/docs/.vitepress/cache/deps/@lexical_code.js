import { Ar as $getSelection, Br as $createTabNode, C as $getTextPointCaret, Cr as $createPoint, Dr as $generateNodesFromRawText, Fr as $isRangeSelection, Gi as KEY_ARROW_RIGHT_COMMAND, Hi as INSERT_TAB_COMMAND, Hr as TabNode, Ki as KEY_ARROW_UP_COMMAND, Kn as $getCaretRangeInDirection, Mr as $insertNodes, Ri as INDENT_CONTENT_COMMAND, Ui as KEY_ARROW_DOWN_COMMAND, Vr as $isTabNode, Wi as KEY_ARROW_LEFT_COMMAND, Xi as KEY_ENTER_COMMAND, Zn as $normalizeCaret, an as isDOMTextNode, ar as $isLineBreakNode, c as configExtension, ea as KEY_TAB_COMMAND, go as invariant, h as $getCaretRange, ir as $createLineBreakNode, n as mergeRegister, na as MOVE_TO_START, nn as isDOMDocumentNode, ra as OUTDENT_CONTENT_COMMAND, s as safeCast, ta as MOVE_TO_END, tr as $setSelectionFromCaretRange, u as defineExtension, un as isHTMLElement, x as $getSiblingCaret } from "./src-BWdqgNjM.js";
import { G as namedSignals, J as j } from "./src-DjbHpMmC.js";
import { C as $onEscapeUp, S as $onEscapeDown } from "./src-9-5QzbBl.js";
import { C as ImportOverlays, M as defineImportRule, d as DOMImportExtension, f as defineOverlayRules, l as CoreImportExtension, o as sel } from "./src-CAtUi_gH.js";
import { a as $exitCodeNodeOnEnter, c as DEFAULT_CODE_LANGUAGE, d as $getEndOfCodeInLine, f as $getFirstCodeNodeOfLine, h as $outdentLeadingSpaces, i as $createCodeNode, l as getDefaultCodeLanguage, m as $getStartOfCodeInLine, n as $isCodeHighlightNode, o as $isCodeNode, p as $getLastCodeNodeOfLine, r as CodeHighlightNode, s as CodeNode, t as $createCodeHighlightNode, u as $getCodeLineDirection } from "./CodeHighlightNode-rGhHA2oF.js";
//#region ../../node_modules/.pnpm/@lexical+code-core@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/code-core/src/CodeImportExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var LANGUAGE_DATA_ATTRIBUTE = "data-language";
var THEME_DATA_ATTRIBUTE = "data-theme";
/**
* True for elements whose `font-family` mentions `monospace` — the
* heuristic the legacy `<div>` rule uses to spot copy-pasted code blocks
* (e.g. Google Docs serializes a code block as a styled `<div>`).
*/
function isMonospaceElement(el) {
	return el.style.fontFamily.match("monospace") !== null;
}
function isMonospaceDescendant(node) {
	let parent = node.parentElement;
	while (parent !== null) {
		if (isMonospaceElement(parent)) return true;
		parent = parent.parentElement;
	}
	return false;
}
/**
* Overlay rules active only while {@link GitHubCodeTableRule} is
* processing its children. Inside the code-table subtree, every `<tr>`
* and `<td>` unwraps unconditionally — they never become table-row /
* table-cell nodes (even when `@lexical/table` registers its rules for
* those tags). Outside the subtree, this overlay isn't installed, so
* the cost of these rules is never paid against unrelated `<tr>` /
* `<td>` pastes.
*/
var GitHubCodeTableOverlayRules = defineOverlayRules([defineImportRule({
	$import: (ctx, el) => ctx.$importChildren(el),
	match: sel.tag("tr", "td"),
	name: "@lexical/code/github-code-table/unwrap"
})]);
var PreRule = defineImportRule({
	$import: (ctx, el) => [$createCodeNode(el.getAttribute(LANGUAGE_DATA_ATTRIBUTE), el.getAttribute(THEME_DATA_ATTRIBUTE)).splice(0, 0, ctx.$importChildren(el))],
	match: sel.tag("pre"),
	name: "@lexical/code/pre"
});
/**
* Multi-line `<code>` (containing newlines or `<br>`) is treated as a
* block code element — mirrors the legacy behavior. Single-line `<code>`
* defers to the inline-format rule from `CoreImportExtension` so it
* becomes a TextNode with IS_CODE.
*/
var MultilineCodeRule = defineImportRule({
	$import: (ctx, el, $next) => {
		const text = el.textContent || "";
		if (!(/\r?\n/.test(text) || el.querySelector("br") !== null)) return $next();
		return [$createCodeNode(el.getAttribute(LANGUAGE_DATA_ATTRIBUTE), el.getAttribute(THEME_DATA_ATTRIBUTE)).splice(0, 0, ctx.$importChildren(el))];
	},
	match: sel.tag("code"),
	name: "@lexical/code/code-multiline"
});
/**
* True for elements carrying BOTH `font-family: …monospace…` and
* `white-space: pre*` inline — the shape VS Code uses for every line
* of a copied code block (on every per-line `<div>` on Safari, on
* the single outer wrapper on Chrome).
*/
function isMonospacePreElement(el) {
	if (!isHTMLElement(el)) return false;
	const ff = el.style.fontFamily;
	const ws = el.style.whiteSpace;
	return typeof ff === "string" && /monospace/i.test(ff) && typeof ws === "string" && ws.startsWith("pre");
}
/**
* Split a monospace-pre wrapper element into logical code lines:
* `<div>` children contribute their text content as one line,
* `<br>` children contribute an empty line, inline children (spans
* and bare text) accumulate into the current line until the next
* block child.
*
* Returns `null` if `el` has no block children (i.e. it's a leaf
* line, not a wrapper) so the caller can leave it to the
* sibling-run pass.
*/
function splitMonospaceWrapperLines(el) {
	let hasBlockChild = false;
	const lines = [];
	let acc = "";
	let hasAcc = false;
	const flush = () => {
		if (hasAcc) {
			lines.push(acc);
			acc = "";
			hasAcc = false;
		}
	};
	for (const child of Array.from(el.childNodes)) if (isHTMLElement(child)) {
		if (child.tagName === "DIV") {
			flush();
			lines.push(child.textContent || "");
			hasBlockChild = true;
		} else if (child.tagName === "BR") {
			flush();
			lines.push("");
			hasBlockChild = true;
		} else {
			acc += child.textContent || "";
			hasAcc = true;
		}
	} else if (isDOMTextNode(child)) {
		const t = child.textContent || "";
		if (t.length > 0) {
			acc += t;
			hasAcc = true;
		}
	}
	flush();
	return hasBlockChild ? lines : null;
}
/**
* Returns `true` if `root` contains the structural signature of a
* VS Code code-block paste:
*
*  - a monospace+pre `<div>` wrapper with at least one block (`<div>` /
*    `<br>`) child — the Chrome shape, or
*  - two or more consecutive monospace+pre siblings — the Safari shape.
*
* Walked once in preprocess; the matching overlay is only installed
* when this returns `true` so an unrelated paste doesn't pay for the
* detection or rule cost.
*/
function looksLikeVscodePaste(root) {
	for (const child of Array.from(root.children)) {
		if (isHTMLElement(child) && isMonospacePreElement(child)) {
			if (splitMonospaceWrapperLines(child) !== null) return true;
			const next = child.nextElementSibling;
			if (next && isMonospacePreElement(next)) return true;
			continue;
		}
		if (looksLikeVscodePaste(child)) return true;
	}
	return false;
}
/**
* Match a monospace+pre `<div>` whose direct children include block
* (`<div>` / `<br>`) elements — the Chrome shape, one outer wrapper
* around per-line `<div>`s and `<br>`s. Emits a single CodeNode whose
* text is the wrapper's lines joined by `\n`.
*/
var VscodeWrapperRule = defineImportRule({
	$import: (_ctx, el, $next) => {
		if (!isMonospacePreElement(el) || isMonospaceDescendant(el)) return $next();
		const lines = splitMonospaceWrapperLines(el);
		if (lines === null || lines.length === 0) return $next();
		return [$createCodeNode().splice(0, 0, $generateNodesFromRawText(lines.join("\n")))];
	},
	match: sel.tag("div"),
	name: "@lexical/code/vscode-wrapper"
});
/**
* Match the first of a run of consecutive monospace+pre `<div>` /
* `<br>` siblings (the Safari shape) and emit one CodeNode for the
* whole run. When the framework's per-child dispatch lands on a
* subsequent sibling in the same run, the prev-sibling check below
* returns `[]` so the run is only emitted once.
*/
var VscodeLineRunRule = defineImportRule({
	$import: (_ctx, el, $next) => {
		if (!isMonospacePreElement(el) || isMonospaceDescendant(el)) return $next();
		const prev = el.previousElementSibling;
		if (prev && isMonospacePreElement(prev)) return [];
		const lines = [];
		let cur = el;
		while (cur && isMonospacePreElement(cur)) {
			lines.push(cur.tagName === "BR" ? "" : cur.textContent || "");
			cur = cur.nextElementSibling;
		}
		if (lines.length < 2) return $next();
		return [$createCodeNode().splice(0, 0, $generateNodesFromRawText(lines.join("\n")))];
	},
	match: sel.tag("div", "br"),
	name: "@lexical/code/vscode-line-run"
});
var VscodeCodePasteOverlay = defineOverlayRules([VscodeWrapperRule, VscodeLineRunRule]);
/**
* VS Code → browser code-block pastes ship the block as either:
*
*  - **Chrome**: one outer
*    `<div style="font-family: …monospace…; white-space: pre">…</div>`
*    wrapping per-line `<div>`s and `<br>`s.
*  - **Safari**: a flat run of sibling
*    `<div style="…monospace…; white-space: pre">…</div>` and
*    `<br style="…monospace…; …">` elements with no wrapping
*    monospace ancestor (the styles are duplicated onto every
*    element).
*
* The legacy `<div>` rule (and {@link DivRule}) produces one CodeNode
* per `<div>` on Safari and concatenates inner divs without
* separating `\n`s on Chrome. This preprocess scans once for the
* structural signature and, only when it matches, pushes
* {@link VscodeCodePasteOverlay} onto {@link ImportOverlays} so the
* VS Code-specific rules participate in the walk. Pastes from other
* sources pay only the detection cost.
*
* @experimental
*/
var $installVscodeCodePasteOverlay = (dom, ctx, $next) => {
	if (looksLikeVscodePaste(isDOMDocumentNode(dom) ? dom.body : dom)) ctx.session.update(ImportOverlays, (prev) => [...prev, VscodeCodePasteOverlay]);
	$next();
};
/**
* A `<div style="font-family: …monospace…">` (Google-Docs-style code
* block) creates a CodeNode. Descendant elements inside a monospace
* wrapper just unwrap so their text content flows into the surrounding
* CodeNode.
*/
var DivRule = defineImportRule({
	$import: (ctx, el, $next) => {
		if (isMonospaceElement(el)) return [$createCodeNode().splice(0, 0, ctx.$importChildren(el))];
		if (isMonospaceDescendant(el)) return ctx.$importChildren(el);
		return $next();
	},
	match: sel.tag("div"),
	name: "@lexical/code/div"
});
/**
* Import rules for {@link CodeNode}.
*
* Specific class-restricted rules (GitHub raw-file-view detectors) are
* registered before the generic `<table>` / `<tr>` / `<td>` rules so
* they win dispatch.
*
* Registered by {@link CodeExtension} itself (together with
* `CoreImportExtension` and the {@link $installVscodeCodePasteOverlay}
* preprocess), so any editor that uses the code extension can import
* these shapes through the `DOMImportExtension` pipeline without further
* configuration.
*
* @experimental
*/
var CodeImportRules = [
	defineImportRule({
		$import: (ctx, el) => [$createCodeNode().splice(0, 0, ctx.$importChildren(el, { rules: GitHubCodeTableOverlayRules }))],
		match: sel.tag("table").classAll("js-file-line-container"),
		name: "@lexical/code/github-code-table"
	}),
	defineImportRule({
		$import: (ctx, el) => ctx.$importChildren(el),
		match: sel.tag("td").classAll("js-file-line"),
		name: "@lexical/code/github-code-cell-by-class"
	}),
	MultilineCodeRule,
	PreRule,
	DivRule
];
//#endregion
//#region ../../node_modules/.pnpm/@lexical+code-core@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/code-core/src/CodeExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Add code blocks to the editor (syntax highlighting provided separately)
*/
var CodeExtension = defineExtension({
	dependencies: [CoreImportExtension, configExtension(DOMImportExtension, {
		preprocess: [$installVscodeCodePasteOverlay],
		rules: CodeImportRules
	})],
	name: "@lexical/code",
	nodes: () => [CodeNode, CodeHighlightNode],
	register(editor) {
		return mergeRegister(editor.registerCommand(KEY_ENTER_COMMAND, (event) => {
			const selection = $getSelection();
			if ($isRangeSelection(selection) && $exitCodeNodeOnEnter(selection)) {
				if (event !== null) event.preventDefault();
				return true;
			}
			return false;
		}, 1), editor.registerNodeTransform(TabNode, (node) => {
			if (node.getFormat() !== 0 && $isCodeNode(node.getParent())) node.setFormat(0);
		}));
	}
});
defineExtension({
	dependencies: [CodeExtension],
	name: "@lexical/code/Import"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+code-core@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/code-core/src/CodeIndentation.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $isSelectionInCode(selection) {
	if (!$isRangeSelection(selection)) return false;
	const anchorNode = selection.anchor.getNode();
	const maybeAnchorCodeNode = $isCodeNode(anchorNode) ? anchorNode : anchorNode.getParent();
	const focusNode = selection.focus.getNode();
	const maybeFocusCodeNode = $isCodeNode(focusNode) ? focusNode : focusNode.getParent();
	return $isCodeNode(maybeAnchorCodeNode) && maybeAnchorCodeNode.is(maybeFocusCodeNode);
}
/**
* Returns an Array of code lines
* Take the sequence of LineBreakNode | TabNode | CodeHighlightNode forming
* the selection and split it by LineBreakNode.
* If the selection ends at the start of the last line, it is considered empty.
* Empty lines are discarded.
*/
function $getCodeLines(selection) {
	const nodes = selection.getNodes();
	const lines = [];
	if (nodes.length === 1 && $isCodeNode(nodes[0])) return lines;
	let lastLine = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		invariant($isCodeHighlightNode(node) || $isTabNode(node) || $isLineBreakNode(node), "Expected selection to be inside CodeBlock and consisting of CodeHighlightNode, TabNode and LineBreakNode");
		if ($isLineBreakNode(node)) {
			if (lastLine.length > 0) {
				lines.push(lastLine);
				lastLine = [];
			}
		} else lastLine.push(node);
	}
	if (lastLine.length > 0) {
		const selectionEnd = selection.isBackward() ? selection.anchor : selection.focus;
		const lastPoint = $createPoint(lastLine[0].getKey(), 0, "text");
		if (!selectionEnd.is(lastPoint)) lines.push(lastLine);
	}
	return lines;
}
function $handleTab(shiftKey) {
	const selection = $getSelection();
	if (!$isRangeSelection(selection) || !$isSelectionInCode(selection)) return null;
	const indentOrOutdent = !shiftKey ? INDENT_CONTENT_COMMAND : OUTDENT_CONTENT_COMMAND;
	const tabOrOutdent = !shiftKey ? INSERT_TAB_COMMAND : OUTDENT_CONTENT_COMMAND;
	const anchor = selection.anchor;
	const focus = selection.focus;
	if (anchor.is(focus)) return tabOrOutdent;
	const codeLines = $getCodeLines(selection);
	if (codeLines.length !== 1) return indentOrOutdent;
	const codeLine = codeLines[0];
	const codeLineLength = codeLine.length;
	invariant(codeLineLength !== 0, "$getCodeLines only extracts non-empty lines");
	let selectionFirst;
	let selectionLast;
	if (selection.isBackward()) {
		selectionFirst = focus;
		selectionLast = anchor;
	} else {
		selectionFirst = anchor;
		selectionLast = focus;
	}
	const firstOfLine = $getFirstCodeNodeOfLine(codeLine[0]);
	const lastOfLine = $getLastCodeNodeOfLine(codeLine[0]);
	const anchorOfLine = $createPoint(firstOfLine.getKey(), 0, "text");
	const focusOfLine = $createPoint(lastOfLine.getKey(), lastOfLine.getTextContentSize(), "text");
	if (selectionFirst.isBefore(anchorOfLine)) return indentOrOutdent;
	if (focusOfLine.isBefore(selectionLast)) return indentOrOutdent;
	if (anchorOfLine.isBefore(selectionFirst) || selectionLast.isBefore(focusOfLine)) return tabOrOutdent;
	return indentOrOutdent;
}
/**
* Outdent the single line the collapsed caret sits on.
*
* `$getCodeLines` drops a trailing line when the selection ends exactly at its
* start — for a collapsed caret that is always true, so the caret's own line
* never reaches the outdent loop and the line has to be resolved from the
* anchor here. Applies the same rule as that loop: strip a leading TabNode, or
* `tabSize` leading spaces when the extension is configured for them.
*/
function $outdentLineAtCaret(selection, tabSize) {
	const anchorNode = selection.anchor.getNode();
	if (!$isCodeHighlightNode(anchorNode) && !$isTabNode(anchorNode)) return;
	const firstOfLine = $getFirstCodeNodeOfLine(anchorNode);
	if ($isTabNode(firstOfLine)) firstOfLine.remove();
	else if (tabSize !== void 0 && $isCodeHighlightNode(firstOfLine)) $outdentLeadingSpaces(firstOfLine, tabSize, selection);
}
function $handleMultilineIndent(type, tabSize) {
	const selection = $getSelection();
	if (!$isRangeSelection(selection) || !$isSelectionInCode(selection)) return false;
	const codeLines = $getCodeLines(selection);
	const codeLinesLength = codeLines.length;
	if (codeLinesLength === 0 && selection.isCollapsed()) {
		if (type === INDENT_CONTENT_COMMAND) selection.insertNodes([$createTabNode()]);
		else $outdentLineAtCaret(selection, tabSize);
		return true;
	}
	if (codeLinesLength === 0 && type === INDENT_CONTENT_COMMAND && selection.getTextContent() === "\n") {
		const tabNode = $createTabNode();
		const lineBreakNode = $createLineBreakNode();
		const direction = selection.isBackward() ? "previous" : "next";
		selection.insertNodes([tabNode, lineBreakNode]);
		$setSelectionFromCaretRange($getCaretRangeInDirection($getCaretRange($getTextPointCaret(tabNode, "next", 0), $normalizeCaret($getSiblingCaret(lineBreakNode, "next"))), direction));
		return true;
	}
	for (let i = 0; i < codeLinesLength; i++) {
		const line = codeLines[i];
		if (line.length > 0) {
			let firstOfLine = line[0];
			if (i === 0) firstOfLine = $getFirstCodeNodeOfLine(firstOfLine);
			if (type === INDENT_CONTENT_COMMAND) {
				const tabNode = $createTabNode();
				firstOfLine.insertBefore(tabNode);
				if (i === 0) {
					const anchorKey = selection.isBackward() ? "focus" : "anchor";
					const anchorLine = $createPoint(firstOfLine.getKey(), 0, "text");
					if (selection[anchorKey].is(anchorLine)) selection[anchorKey].set(tabNode.getKey(), 0, "text");
				}
			} else if ($isTabNode(firstOfLine)) firstOfLine.remove();
			else if (tabSize !== void 0 && $isCodeHighlightNode(firstOfLine)) $outdentLeadingSpaces(firstOfLine, tabSize, selection);
		}
	}
	return true;
}
function $handleShiftLines(type, event) {
	const selection = $getSelection();
	if (!$isRangeSelection(selection)) return false;
	const { anchor, focus } = selection;
	const anchorOffset = anchor.offset;
	const focusOffset = focus.offset;
	const anchorNode = anchor.getNode();
	const focusNode = focus.getNode();
	const arrowIsUp = type === KEY_ARROW_UP_COMMAND;
	if (!$isSelectionInCode(selection) || !($isCodeHighlightNode(anchorNode) || $isTabNode(anchorNode)) || !($isCodeHighlightNode(focusNode) || $isTabNode(focusNode))) return false;
	if (!event.altKey) {
		if (selection.isCollapsed()) {
			const codeNode = anchorNode.getParentOrThrow();
			if (arrowIsUp && anchorOffset === 0 && anchorNode.getPreviousSibling() === null) {
				if (codeNode.getPreviousSibling() === null) {
					codeNode.selectPrevious();
					event.preventDefault();
					return false;
				}
			} else if (!arrowIsUp && anchorOffset === anchorNode.getTextContentSize() && anchorNode.getNextSibling() === null) {
				if (codeNode.getNextSibling() === null) {
					codeNode.selectNext();
					event.preventDefault();
					return false;
				}
			}
		}
		return false;
	}
	let start;
	let end;
	if (anchorNode.isBefore(focusNode)) {
		start = $getFirstCodeNodeOfLine(anchorNode);
		end = $getLastCodeNodeOfLine(focusNode);
	} else {
		start = $getFirstCodeNodeOfLine(focusNode);
		end = $getLastCodeNodeOfLine(anchorNode);
	}
	if (start == null || end == null) return false;
	const range = start.getNodesBetween(end);
	for (let i = 0; i < range.length; i++) {
		const node = range[i];
		if (!$isCodeHighlightNode(node) && !$isTabNode(node) && !$isLineBreakNode(node)) return false;
	}
	event.preventDefault();
	event.stopPropagation();
	const linebreak = arrowIsUp ? start.getPreviousSibling() : end.getNextSibling();
	if (!$isLineBreakNode(linebreak)) return true;
	const sibling = arrowIsUp ? linebreak.getPreviousSibling() : linebreak.getNextSibling();
	if (sibling == null) return true;
	const adjacentLineIsBlank = $isLineBreakNode(sibling);
	const maybeInsertionPoint = !adjacentLineIsBlank && ($isCodeHighlightNode(sibling) || $isTabNode(sibling)) ? arrowIsUp ? $getFirstCodeNodeOfLine(sibling) : $getLastCodeNodeOfLine(sibling) : null;
	let insertionPoint = maybeInsertionPoint != null ? maybeInsertionPoint : sibling;
	linebreak.remove();
	range.forEach((node) => node.remove());
	if (adjacentLineIsBlank) {
		range.forEach((node) => {
			insertionPoint.insertAfter(node);
			insertionPoint = node;
		});
		insertionPoint.insertAfter(linebreak);
	} else if (type === KEY_ARROW_UP_COMMAND) {
		range.forEach((node) => insertionPoint.insertBefore(node));
		insertionPoint.insertBefore(linebreak);
	} else {
		insertionPoint.insertAfter(linebreak);
		insertionPoint = linebreak;
		range.forEach((node) => {
			insertionPoint.insertAfter(node);
			insertionPoint = node;
		});
	}
	selection.setTextNodeRange(anchorNode, anchorOffset, focusNode, focusOffset);
	return true;
}
function $handleMoveTo(type, event) {
	const selection = $getSelection();
	if (!$isRangeSelection(selection)) return false;
	const { anchor, focus } = selection;
	const anchorNode = anchor.getNode();
	const focusNode = focus.getNode();
	const isMoveToStart = type === MOVE_TO_START;
	if (!$isSelectionInCode(selection) || !($isCodeHighlightNode(anchorNode) || $isTabNode(anchorNode)) || !($isCodeHighlightNode(focusNode) || $isTabNode(focusNode))) return false;
	const focusLineNode = focusNode;
	const moveToStart = $getCodeLineDirection(focusLineNode) === "rtl" ? !isMoveToStart : isMoveToStart;
	const originalAnchorKey = anchor.key;
	const originalAnchorOffset = anchor.offset;
	const originalAnchorType = anchor.type;
	if (moveToStart) {
		const start = $getStartOfCodeInLine(focusLineNode, focus.offset);
		if (start !== null) {
			const { node, offset } = start;
			if ($isLineBreakNode(node)) node.selectNext(0, 0);
			else selection.setTextNodeRange(node, offset, node, offset);
		} else focusLineNode.getParentOrThrow().selectStart();
	} else $getEndOfCodeInLine(focusLineNode).select();
	if (event.shiftKey) selection.anchor.set(originalAnchorKey, originalAnchorOffset, originalAnchorType);
	event.preventDefault();
	event.stopPropagation();
	return true;
}
/**
* @internal
* Register the keyboard and command handlers that drive code-block
* indentation: Tab / Shift+Tab, INDENT/OUTDENT_CONTENT_COMMAND,
* INSERT_TAB_COMMAND, alt+arrow line shifting, and Home/End movement.
*
* Both `@lexical/code-shiki` and `@lexical/code-prism` use this via
* {@link CodeIndentExtension}; callers using `registerCodeHighlighting`
* will implicitly call this with tabSize of `undefined`.
*
* @param editor The editor to register on.
* @param tabSize When set, OUTDENT_CONTENT_COMMAND (Shift+Tab) also strips
*   up to that many leading spaces from a code line. See
*   {@link $outdentLeadingSpaces}.
*/
function registerCodeIndentation(editor, tabSize, escapeWithArrows) {
	return mergeRegister(...escapeWithArrows ? [
		editor.registerCommand(KEY_ARROW_DOWN_COMMAND, (event) => event.altKey ? false : $onEscapeDown($isCodeNode, event), 1),
		editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, (event) => $onEscapeDown($isCodeNode, event), 1),
		editor.registerCommand(KEY_ARROW_UP_COMMAND, (event) => event.altKey ? false : $onEscapeUp($isCodeNode, event), 1),
		editor.registerCommand(KEY_ARROW_LEFT_COMMAND, (event) => $onEscapeUp($isCodeNode, event), 1)
	] : [], editor.registerCommand(KEY_TAB_COMMAND, (event) => {
		const command = $handleTab(event.shiftKey);
		if (command === null) return false;
		event.preventDefault();
		editor.dispatchCommand(command);
		return true;
	}, 1), editor.registerCommand(INSERT_TAB_COMMAND, () => {
		if (!$isSelectionInCode($getSelection())) return false;
		$insertNodes([$createTabNode()]);
		return true;
	}, 1), editor.registerCommand(INDENT_CONTENT_COMMAND, () => $handleMultilineIndent(INDENT_CONTENT_COMMAND), 1), editor.registerCommand(OUTDENT_CONTENT_COMMAND, () => $handleMultilineIndent(OUTDENT_CONTENT_COMMAND, tabSize), 1), editor.registerCommand(KEY_ARROW_UP_COMMAND, (event) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		const { anchor } = selection;
		const anchorNode = anchor.getNode();
		if (!$isSelectionInCode(selection)) return false;
		const parent = anchorNode.getParent();
		if (selection.isCollapsed() && anchor.offset === 0 && anchorNode.getPreviousSibling() === null && $isCodeNode(parent) && parent.getPreviousSibling() === null) {
			event.preventDefault();
			return true;
		}
		return $handleShiftLines(KEY_ARROW_UP_COMMAND, event);
	}, 1), editor.registerCommand(KEY_ARROW_DOWN_COMMAND, (event) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return false;
		const { anchor } = selection;
		const anchorNode = anchor.getNode();
		if (!$isSelectionInCode(selection)) return false;
		if (selection.isCollapsed() && anchor.offset === anchorNode.getTextContentSize() && anchorNode.getNextSibling() === null && $isCodeNode(anchorNode.getParentOrThrow()) && anchorNode.getParentOrThrow().getNextSibling() === null) {
			event.preventDefault();
			return true;
		}
		return $handleShiftLines(KEY_ARROW_DOWN_COMMAND, event);
	}, 1), editor.registerCommand(MOVE_TO_START, (event) => $handleMoveTo(MOVE_TO_START, event), 1), editor.registerCommand(MOVE_TO_END, (event) => $handleMoveTo(MOVE_TO_END, event), 1));
}
/**
* Adds keyboard-driven indentation to code blocks (Tab / Shift+Tab,
* alt+arrow line shifts, Home/End within a line). Both
* {@link "@lexical/code-shiki".CodeShikiExtension} and
* {@link "@lexical/code-prism".CodePrismExtension} declare this as a
* dependency, so it is activated automatically alongside either
* highlighter.
*
* Code blocks without syntax highlighting can use this extension on its
* own.
*/
var CodeIndentExtension = defineExtension({
	build: (editor, config) => namedSignals(config),
	config: safeCast({
		disabled: false,
		escapeWithArrows: false,
		tabSize: void 0
	}),
	dependencies: [CodeExtension],
	name: "@lexical/code-indent",
	register: (editor, config, state) => {
		const stores = state.getOutput();
		return j(() => {
			if (stores.disabled.value) return;
			return registerCodeIndentation(editor, stores.tabSize.value, stores.escapeWithArrows.value);
		});
	}
});
//#endregion
export { $createCodeHighlightNode, $createCodeNode, $getCodeLineDirection, $getEndOfCodeInLine, $getFirstCodeNodeOfLine, $getLastCodeNodeOfLine, $getStartOfCodeInLine, $isCodeHighlightNode, $isCodeNode, $outdentLeadingSpaces, CodeExtension, CodeHighlightNode, CodeIndentExtension, CodeNode, DEFAULT_CODE_LANGUAGE, getDefaultCodeLanguage };
