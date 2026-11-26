import { Ar as $getSelection, Bn as $createParagraphNode, Br as $createTabNode, Fr as $isRangeSelection, Gr as $isTextNode, Ot as $setSelection, Sa as createState, U as $addUpdateTag, Ur as $createTextNode, Vn as $isParagraphNode, Vr as $isTabNode, X as $findMatchingParent, Xi as KEY_ENTER_COMMAND, Zr as COMPOSITION_END_TAG, ao as TEXT_TYPE_TO_FORMAT, ar as $isLineBreakNode, ct as $getRoot, go as invariant, ha as $getState, hr as $isElementNode, ir as $createLineBreakNode, lr as ArtificialNode__DO_NOT_USE, mt as $isRootOrShadowRoot, n as mergeRegister, ni as HISTORY_PUSH_TAG, pr as $isDecoratorNode, va as $setState, wr as $createRangeSelection } from "./src-BWdqgNjM.js";
import { _ as $sliceSelectedTextNodeContent } from "./src-jZHBqyIl.js";
import { i as $isQuoteNode, n as $createQuoteNode, o as HeadingNode, r as $isHeadingNode, s as QuoteNode, t as $createHeadingNode } from "./src-D0kObIUC.js";
import { _ as ListNode, b as ListItemNode, g as $isListNode, h as $createListNode, v as $createListItemNode, y as $isListItemNode } from "./src-Cv-PZQO9.js";
import { g as $isLinkNode, h as $isAutoLinkNode, m as $createLinkNode, y as LinkNode } from "./src-OFDuYYGF.js";
import { i as $createCodeNode, o as $isCodeNode, s as CodeNode } from "./CodeHighlightNode-rGhHA2oF.js";
//#region ../../node_modules/.pnpm/@lexical+markdown@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/markdown/src/utils.ts
function indexBy(list, callback) {
	const index = {};
	for (const item of list) {
		const key = callback(item);
		if (!key) continue;
		if (index[key]) index[key].push(item);
		else index[key] = [item];
	}
	return index;
}
function transformersByType(transformers) {
	const byType = indexBy(transformers, (t) => t.type);
	return {
		element: byType.element || [],
		multilineElement: byType["multiline-element"] || [],
		textFormat: byType["text-format"] || [],
		textMatch: byType["text-match"] || []
	};
}
var PUNCTUATION_OR_SPACE = /[!-/:-@[-`{-~\s]/;
var WHITESPACE = /\s/;
var PUNCTUATION = /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/;
var MARKDOWN_EMPTY_LINE_REG_EXP = /^\s{0,3}$/;
function isEmptyParagraph(node) {
	if (!$isParagraphNode(node)) return false;
	const firstChild = node.getFirstChild();
	return firstChild == null || node.getChildrenSize() === 1 && $isTextNode(firstChild) && MARKDOWN_EMPTY_LINE_REG_EXP.test(firstChild.getTextContent());
}
function unescapeText(value) {
	return value.replace(/\\([!-/:-@[-`{-~])/g, "$1").replace(/&#(\d+);/g, (_, codePoint) => String.fromCodePoint(Number(codePoint)));
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+markdown@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/markdown/src/MarkdownTransformers.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var ORDERED_LIST_REGEX = /^(\s*)(\d{1,})\.\s/;
var UNORDERED_LIST_REGEX = /^(\s*)[-*+]\s/;
var CHECK_LIST_REGEX = /^(\s*)(?:[-*+]\s)?\s?(\[(\s|x)?\])\s/i;
var HEADING_REGEX = /^(#{1,6})\s/;
var QUOTE_REGEX = /^>\s/;
var CODE_START_REGEX = /^([ \t]*`{3,})([\w-]+)?[ \t]?/;
var CODE_END_REGEX = /^[ \t]*`{3,}$/;
var CODE_SINGLE_LINE_REGEX = /^[ \t]*```[^`]+(?:(?:`{1,2}|`{4,})[^`]+)*```(?:[^`]|$)/;
var TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/;
/**
* Whether `line` is a Markdown table delimiter row such as `| --- | :--: |`.
*
* This is the linear-time equivalent of `/^(\| ?:?-*:? ?)+\|\s?$/`. That
* pattern nests `-*` inside a `(...)+` group, a shape that backtracking regexp
* engines (e.g. Safari/JavaScriptCore) may run in super-linear time. A manual
* scan is guaranteed O(n).
*/
function isTableRowDivider(line) {
	if (line[0] !== "|") return false;
	const { length } = line;
	let i = 1;
	let cells = 0;
	while (i < length) {
		let j = i;
		if (line[j] === " ") j++;
		if (line[j] === ":") j++;
		while (line[j] === "-") j++;
		if (line[j] === ":") j++;
		if (line[j] === " ") j++;
		if (line[j] !== "|") break;
		cells++;
		i = j + 1;
	}
	return cells > 0 && (i === length || i === length - 1 && /\s/.test(line[i]));
}
var TAG_START_REGEX = /^<[a-z_][\w-]*(?:\s[^<>]*)?\/?>/i;
var TAG_END_REGEX = /^<\/[a-z_][\w-]*\s*>/i;
var ENDS_WITH = (regex) => new RegExp(`(?:${regex.source})$`, regex.flags);
var listMarkerState = createState("mdListMarker", {
	parse: (v) => typeof v === "string" && /^[-*+]$/.test(v) ? v : "-",
	resetOnCopyNode: true
});
var codeFenceState = createState("mdCodeFence", {
	parse: (val) => {
		if (typeof val === "string" && /^`{3,}$/.test(val)) return val;
		return "```";
	},
	resetOnCopyNode: true
});
/**
* The info-string tail after a fenced code block's language (e.g. `title="x"`
* in ```` ```js title="x" ````). `CodeNode` models only the language, so the
* rest is kept here to survive the round trip.
*/
var codeMetaState = createState("mdCodeMeta", {
	parse: (val) => typeof val === "string" ? val : "",
	resetOnCopyNode: true
});
var hardLineBreakState = createState("mdHardLineBreak", {
	parse: (val) => {
		if (typeof val === "string" && /^(\\| {2,})$/.test(val)) return val;
		return "";
	},
	resetOnCopyNode: true
});
function parseMarkdownHardLineBreak(line) {
	if (line.endsWith("\\")) {
		let backslashes = 0;
		for (let i = line.length - 1; i >= 0 && line[i] === "\\"; i--) backslashes++;
		return backslashes % 2 === 1 ? [line.slice(0, -1), "\\"] : null;
	}
	const spaces = line.match(/^(.*?\S)( {2,})$/);
	return spaces ? [spaces[1], spaces[2]] : null;
}
function hasNonWhitespaceContentOnLine(children, endIndex) {
	for (let i = endIndex - 1; i >= 0; i--) {
		if ($isLineBreakNode(children[i])) return false;
		if (/\S/.test(children[i].getTextContent())) return true;
	}
	return false;
}
function $extractMarkdownHardLineBreakMarker(previousNode) {
	const children = previousNode.getChildren();
	const lastChildIndex = children.length - 1;
	const lastChild = children[lastChildIndex];
	if (!$isTextNode(lastChild)) return null;
	const lastText = lastChild.getTextContent();
	const hardLineBreak = parseMarkdownHardLineBreak(lastText);
	if (hardLineBreak !== null) {
		const [text, marker] = hardLineBreak;
		lastChild.setTextContent(text);
		return marker;
	}
	if (/^ {2,}$/.test(lastText) && hasNonWhitespaceContentOnLine(children, lastChildIndex)) {
		lastChild.setTextContent("");
		return lastText;
	}
	return null;
}
function $createMarkdownLineBreakNode(previousNode) {
	const lineBreakNode = $createLineBreakNode();
	const hardLineBreak = $extractMarkdownHardLineBreakMarker(previousNode);
	if (hardLineBreak !== null) $setState(lineBreakNode, hardLineBreakState, hardLineBreak);
	return lineBreakNode;
}
/**
* Block-level shortcuts convert by replacing the enclosing block, which
* discards it. A QuoteNode holds inline content, so there is nowhere to nest
* the new block and the quote would simply be lost. Import already refuses:
* `$convertFromMarkdownString('> # x')` keeps the quote and leaves `# x` as
* literal text, so the shortcut declines too rather than dropping the quote
* out from under the caret. See #7407.
*/
function $isUnreplaceableBlock(parentNode) {
	return $isQuoteNode(parentNode);
}
/**
* CommonMark: "If the leading code fence is indented N spaces, then up to N
* spaces of indentation are removed from each line of the content (if
* present)." https://spec.commonmark.org/0.31.2/#fenced-code-blocks
*/
function stripFenceIndent(line, indent) {
	let index = 0;
	while (index < indent && (line[index] === " " || line[index] === "	")) index++;
	return line.slice(index);
}
/**
* Attaches the opening fence's info-string tail to the `CodeNode` that
* `CODE.replace` just appended. `replace` takes the match rather than the
* source line, so the tail is applied here, where the line is in hand.
*/
function $setCodeMeta(parentNode, meta) {
	const codeNode = parentNode.getLastChild();
	if (meta && $isCodeNode(codeNode)) $setState(codeNode, codeMetaState, meta);
}
/** @__NO_SIDE_EFFECTS__ */
var createBlockNode = (createNode) => {
	return (parentNode, children, match, isImport) => {
		const node = createNode(match);
		node.append(...children);
		parentNode.replace(node);
		if (!isImport) node.select(0, 0);
	};
};
var LIST_INDENT_SIZE = 4;
function getIndent(whitespaces) {
	const tabs = whitespaces.match(/\t/g);
	const spaces = whitespaces.match(/ /g);
	let indent = 0;
	if (tabs) indent += tabs.length;
	if (spaces) indent += Math.floor(spaces.length / LIST_INDENT_SIZE);
	return indent;
}
/**
* The column the text after `whitespaces` starts at, expanding a tab to the
* next multiple of `LIST_INDENT_SIZE` the way CommonMark does.
*/
function getColumn(whitespaces) {
	let column = 0;
	for (const char of whitespaces) column += char === "	" ? LIST_INDENT_SIZE - column % LIST_INDENT_SIZE : 1;
	return column;
}
/**
* The content columns of the list levels the lines placed so far have left
* open, outermost first, or null outside a markdown import.
*
* A sublist is measured against the column where its parent item's content
* begins rather than against a fixed number of spaces: that is what lets
* `1. a` take a three-space sublist while `- a` takes a two-space one, and
* what keeps two items written at the same column siblings even when that
* column is deep enough to have opened a level.
*
* Only the line that opened a level knows the column it was written at, and
* nothing in the tree records it afterwards, so the columns are carried from
* line to line for the length of one import. A shortcut typed into an editor
* is a line on its own with no such run behind it and keeps reading its indent
* as a fixed `LIST_INDENT_SIZE` per level, which is the step `$listExport`
* writes and the one the toolbar and Tab indent by.
*/
var importListColumns = null;
var importJoinsLooseLists = false;
/**
* Run `fn` with the columns of a single markdown import tracked across the
* lines it places. Restores whatever was being tracked around it, so an import
* that runs inside another one does not disturb it.
*
* `joinLooseLists` reads a blank line between list lines as making the list
* loose rather than ending it. An import that preserves new lines keeps blank
* paragraphs as content, so there a blank line closes the list like any other
* block.
*
* @internal
*/
function withListIndentColumns(joinLooseLists, fn) {
	const previousColumns = importListColumns;
	const previousJoins = importJoinsLooseLists;
	importListColumns = [];
	importJoinsLooseLists = joinLooseLists;
	try {
		return fn();
	} finally {
		importListColumns = previousColumns;
		importJoinsLooseLists = previousJoins;
	}
}
/**
* The indent `whitespaces` names given the levels open above it: the innermost
* level whose content column it reaches, or 0 when it reaches none of them.
*/
function getColumnIndent(columns, whitespaces) {
	const column = getColumn(whitespaces);
	for (let i = columns.length - 1; i >= 0; i--) if (column >= columns[i]) return i + 1;
	return 0;
}
/**
* The column this line opens its content at: where the matched marker ends,
* with tabs expanded, so `-\ta` opens at the tab stop and not two columns in.
* A check list item is marked by its bullet — the `[ ]` is content — so
* `- [ ] a` opens where `- a` does. Capped one `LIST_INDENT_SIZE` past the
* marker so that the indent `$listExport` writes always nests: a sublist of
* `100. ` is exported with four spaces, short of that marker's real content
* column.
*/
function getContentColumn(match, listType) {
	let prefix = match[0];
	if (listType === "check") {
		const bullet = prefix.slice(match[1].length).match(/^[-*+]\s/);
		if (bullet) prefix = match[1] + bullet[0];
	}
	return Math.min(getColumn(prefix), getColumn(match[1]) + LIST_INDENT_SIZE);
}
/**
* Record the content column that this line leaves open for the lines below it,
* closing the levels it stepped back out of.
*/
function setOpenColumn(columns, indent, match, listType) {
	for (let i = columns.length; i < indent; i++) columns[i] = (i + 1) * LIST_INDENT_SIZE;
	columns.length = indent;
	columns[indent] = getContentColumn(match, listType);
}
/** @__NO_SIDE_EFFECTS__ */
var listReplace = (listType) => {
	return (parentNode, children, match, isImport) => {
		if ($isHeadingNode(parentNode) || !isImport && $isUnreplaceableBlock(parentNode)) return false;
		const previousNode = parentNode.getPreviousSibling();
		const nextNode = parentNode.getNextSibling();
		const listItem = $createListItemNode(listType === "check" ? /^x$/i.test(match[3] || "") : void 0);
		const firstMatchChar = match[0].trim()[0];
		const listMarker = (listType === "bullet" || listType === "check") && firstMatchChar === listMarkerState.parse(firstMatchChar) ? firstMatchChar : void 0;
		const columns = importListColumns;
		let precedingBlock = previousNode;
		if (columns !== null) {
			if (importJoinsLooseLists) while (precedingBlock !== null && isEmptyParagraph(precedingBlock)) precedingBlock = precedingBlock.getPreviousSibling();
			if (!$isListNode(precedingBlock)) columns.length = 0;
		}
		const indent = columns === null || columns.length === 0 ? getIndent(match[1]) : getColumnIndent(columns, match[1]);
		if ($isListNode(nextNode) && nextNode.getListType() === listType) {
			const firstChild = nextNode.getFirstChild();
			if (firstChild !== null) firstChild.insertBefore(listItem);
			else nextNode.append(listItem);
			if (listType === "number" && indent === 0) nextNode.setStart(Number(match[2]));
			parentNode.remove();
		} else if ($isListNode(precedingBlock) && (precedingBlock.getListType() === listType || indent > 0)) {
			precedingBlock.append(listItem);
			parentNode.remove();
		} else {
			const list = $createListNode(listType, listType === "number" ? Number(match[2]) : void 0);
			list.append(listItem);
			parentNode.replace(list);
		}
		listItem.append(...children);
		if (!isImport) listItem.select(0, 0);
		if (indent) {
			listItem.setIndent(indent);
			$retypeNestedList(listItem, listType, match);
		}
		const listNode = listItem.getParent();
		if (listMarker && $isListNode(listNode)) $setState(listNode, listMarkerState, listMarker);
		if (columns !== null) setOpenColumn(columns, indent, match, listType);
	};
};
/**
* `setIndent` nests an item by copying the list it is in, so an item whose
* type differs from the list above it lands in a nested list of the wrong
* type. Split it out into a list of its own type, in place, so that a sublist
* can change type the way CommonMark lets it — `1. a` may be followed by an
* indented `- b`, and that by an indented `- [ ] c`.
*/
function $retypeNestedList(listItem, listType, match) {
	const nestedList = listItem.getParent();
	if (!$isListNode(nestedList) || nestedList.getListType() === listType) return;
	const wrapper = nestedList.getParent();
	if (!$isListItemNode(wrapper)) return;
	const retypedList = $createListNode(listType, listType === "number" ? Number(match[2]) : void 0);
	const isFirst = listItem.getPreviousSibling() === null;
	retypedList.append(listItem);
	const retypedWrapper = $createListItemNode();
	retypedWrapper.append(retypedList);
	if (isFirst) wrapper.insertBefore(retypedWrapper);
	else wrapper.insertAfter(retypedWrapper);
	if (nestedList.getChildrenSize() === 0) wrapper.remove();
}
var $listExport = (listNode, exportChildren, depth, selection) => {
	const output = [];
	const children = listNode.getChildren();
	let index = 0;
	for (const listItemNode of children) if ($isListItemNode(listItemNode)) {
		if (listItemNode.getChildrenSize() === 1) {
			const firstChild = listItemNode.getFirstChild();
			if ($isListNode(firstChild)) {
				const nestedResult = $listExport(firstChild, exportChildren, depth + 1, selection);
				if (nestedResult) output.push(nestedResult);
				continue;
			}
		}
		if (selection && !listItemNode.getChildren().some((child) => child.isSelected(selection))) continue;
		const indent = " ".repeat(depth * LIST_INDENT_SIZE);
		const listType = listNode.getListType();
		const listMarker = $getState(listNode, listMarkerState);
		const prefix = listType === "number" ? `${listNode.getStart() + index}. ` : listType === "check" ? `${listMarker} [${listItemNode.getChecked() ? "x" : " "}] ` : listMarker + " ";
		let childrenText = exportChildren(listItemNode);
		if (listType !== "number") childrenText = childrenText.replace(/^(\s{0,3}\d+)(\.\s)/, "$1\\$2");
		output.push(indent + prefix + childrenText);
		index++;
	}
	return output.join("\n");
};
var $replaceWithHeading = createBlockNode((match) => {
	const tag = "h" + match[1].length;
	return $createHeadingNode(tag);
});
var HEADING = {
	dependencies: [HeadingNode],
	export: (node, exportChildren) => {
		if (!$isHeadingNode(node)) return null;
		const level = Number(node.getTag().slice(1));
		return "#".repeat(level) + " " + exportChildren(node);
	},
	regExp: HEADING_REGEX,
	replace: (parentNode, children, match, isImport) => {
		if (!isImport && $isUnreplaceableBlock(parentNode)) return false;
		return $replaceWithHeading(parentNode, children, match, isImport);
	},
	triggerOnEnter: true,
	type: "element"
};
var QUOTE = {
	dependencies: [QuoteNode],
	export: (node, exportChildren) => {
		if (!$isQuoteNode(node)) return null;
		const lines = exportChildren(node).split("\n");
		const output = [];
		for (const line of lines) output.push("> " + line);
		return output.join("\n");
	},
	regExp: QUOTE_REGEX,
	replace: (parentNode, children, _match, isImport) => {
		if (isImport) {
			const previousNode = parentNode.getPreviousSibling();
			if ($isQuoteNode(previousNode)) {
				previousNode.splice(previousNode.getChildrenSize(), 0, [$createMarkdownLineBreakNode(previousNode), ...children]);
				parentNode.remove();
				return;
			}
		}
		const node = $createQuoteNode();
		node.append(...children);
		parentNode.replace(node);
		if (!isImport) node.select(0, 0);
	},
	triggerOnEnter: true,
	type: "element"
};
var CODE = {
	dependencies: [CodeNode],
	export: (node) => {
		if (!$isCodeNode(node)) return null;
		const textContent = node.getTextContent();
		let fence = $getState(node, codeFenceState);
		if (textContent.indexOf(fence) > -1) {
			const backticks = textContent.match(/`{3,}/g);
			if (backticks) {
				const maxLength = Math.max(...backticks.map((b) => b.length));
				fence = "`".repeat(maxLength + 1);
			}
		}
		const language = node.getLanguage() || "";
		const meta = language ? $getState(node, codeMetaState) : "";
		return fence + language + (meta ? " " + meta : "") + (textContent ? "\n" + textContent : "") + "\n" + fence;
	},
	handleImportAfterStartMatch: ({ lines, rootNode, startLineIndex, startMatch }) => {
		const fence = startMatch[1];
		const fenceLength = fence.trim().length;
		const currentLine = lines[startLineIndex];
		const afterFenceIndex = startMatch.index + fence.length;
		const afterFence = currentLine.slice(afterFenceIndex);
		const singleLineEndRegex = new RegExp(`\`{${fenceLength},}$`);
		if (singleLineEndRegex.test(afterFence)) {
			const endMatch = afterFence.match(singleLineEndRegex);
			const content = afterFence.slice(0, afterFence.lastIndexOf(endMatch[0]));
			const fakeStartMatch = [...startMatch];
			fakeStartMatch[2] = "";
			CODE.replace(rootNode, null, fakeStartMatch, endMatch, [content], true);
			return [true, startLineIndex];
		}
		const multilineEndRegex = new RegExp(`^[ \\t]*\`{${fenceLength},}$`);
		for (let i = startLineIndex + 1; i < lines.length; i++) {
			const line = lines[i];
			if (multilineEndRegex.test(line)) {
				const endMatch = line.match(multilineEndRegex);
				const linesInBetween = lines.slice(startLineIndex + 1, i);
				const meta = startMatch[2] ? currentLine.slice(startMatch[0].length).trim() : "";
				linesInBetween.unshift(meta ? "" : currentLine.slice(startMatch[0].length));
				CODE.replace(rootNode, null, startMatch, endMatch, linesInBetween, true);
				$setCodeMeta(rootNode, meta);
				return [true, i];
			}
		}
		const linesInBetween = lines.slice(startLineIndex + 1);
		linesInBetween.unshift(currentLine.slice(startMatch[0].length));
		CODE.replace(rootNode, null, startMatch, null, linesInBetween, true);
		return [true, lines.length - 1];
	},
	regExpEnd: {
		optional: true,
		regExp: CODE_END_REGEX
	},
	regExpStart: CODE_START_REGEX,
	replace: (rootNode, children, startMatch, endMatch, linesInBetween, isImport) => {
		let codeBlockNode;
		let code;
		const fence = startMatch[1] ? startMatch[1].trim() : "```";
		const language = startMatch[2] || void 0;
		const fenceIndent = startMatch[1] ? startMatch[1].length - startMatch[1].trimStart().length : 0;
		if (!children && linesInBetween) {
			if (linesInBetween.length === 1) {
				if (endMatch) {
					codeBlockNode = $createCodeNode(language);
					code = stripFenceIndent(linesInBetween[0], fenceIndent);
				} else {
					codeBlockNode = $createCodeNode(language);
					code = linesInBetween[0].startsWith(" ") ? linesInBetween[0].slice(1) : linesInBetween[0];
				}
			} else {
				codeBlockNode = $createCodeNode(language);
				if (linesInBetween.length > 0) {
					if (linesInBetween[0].trim().length === 0) linesInBetween.shift();
					else if (linesInBetween[0].startsWith(" ")) linesInBetween[0] = linesInBetween[0].slice(1);
				}
				while (linesInBetween.length > 0 && !linesInBetween[linesInBetween.length - 1].length) linesInBetween.pop();
				code = linesInBetween.map((line) => stripFenceIndent(line, fenceIndent)).join("\n");
			}
			$setState(codeBlockNode, codeFenceState, fence);
			const textNode = $createTextNode(code);
			codeBlockNode.append(textNode);
			rootNode.append(codeBlockNode);
		} else if (children) {
			if (!isImport && $isUnreplaceableBlock(rootNode)) return false;
			createBlockNode((match) => {
				return $createCodeNode(match ? match[2] : void 0);
			})(rootNode, children, startMatch, isImport);
		}
	},
	type: "multiline-element"
};
var UNORDERED_LIST = {
	dependencies: [ListNode, ListItemNode],
	export: (node, exportChildren, selection) => {
		return $isListNode(node) ? $listExport(node, exportChildren, 0, selection) : null;
	},
	regExp: UNORDERED_LIST_REGEX,
	replace: listReplace("bullet"),
	triggerOnEnter: true,
	type: "element"
};
var CHECK_LIST = {
	dependencies: [ListNode, ListItemNode],
	export: (node, exportChildren, selection) => {
		return $isListNode(node) ? $listExport(node, exportChildren, 0, selection) : null;
	},
	regExp: CHECK_LIST_REGEX,
	replace: listReplace("check"),
	triggerOnEnter: true,
	type: "element"
};
var ORDERED_LIST = {
	dependencies: [ListNode, ListItemNode],
	export: (node, exportChildren, selection) => {
		return $isListNode(node) ? $listExport(node, exportChildren, 0, selection) : null;
	},
	regExp: ORDERED_LIST_REGEX,
	replace: listReplace("number"),
	triggerOnEnter: true,
	type: "element"
};
var INLINE_CODE = {
	format: ["code"],
	tag: "`",
	type: "text-format"
};
function getCodeSpanDelimiter(content) {
	const backtickRuns = content.match(/`+/g);
	const longestRun = backtickRuns ? Math.max(...backtickRuns.map((run) => run.length)) : 0;
	return {
		fence: "`".repeat(longestRun + 1),
		padded: content.length === 0 || content.includes("`") || /^\s/.test(content) && /\s$/.test(content) ? ` ${content} ` : content
	};
}
var HIGHLIGHT = {
	format: ["highlight"],
	tag: "==",
	type: "text-format"
};
var BOLD_ITALIC_STAR = {
	format: ["bold", "italic"],
	tag: "***",
	type: "text-format"
};
var BOLD_ITALIC_UNDERSCORE = {
	format: ["bold", "italic"],
	intraword: false,
	tag: "___",
	type: "text-format"
};
var BOLD_STAR = {
	format: ["bold"],
	tag: "**",
	type: "text-format"
};
var BOLD_UNDERSCORE = {
	format: ["bold"],
	intraword: false,
	tag: "__",
	type: "text-format"
};
var STRIKETHROUGH = {
	format: ["strikethrough"],
	tag: "~~",
	type: "text-format"
};
var ITALIC_STAR = {
	format: ["italic"],
	tag: "*",
	type: "text-format"
};
var ITALIC_UNDERSCORE = {
	format: ["italic"],
	intraword: false,
	tag: "_",
	type: "text-format"
};
function escapeCharacterReferences(value) {
	return value.replace(/&(?=#\d+;|#[Xx][\dA-Fa-f]+;|[A-Za-z][\dA-Za-z]*;)/g, "&#38;");
}
var LINK = {
	dependencies: [LinkNode],
	export: (node, exportChildren, exportFormat) => {
		if (!$isLinkNode(node) || $isAutoLinkNode(node)) return null;
		const textContent = exportChildren(node);
		let title = node.getTitle();
		if (title != null) title = escapeCharacterReferences(title).replace(/([\\"])/g, "\\$1");
		const rawUrl = node.getURL();
		const escapedUrl = escapeCharacterReferences(rawUrl);
		const url = rawUrl === "" || /\s/.test(rawUrl) ? `<${escapedUrl.replace(/([\\<>])/g, "\\$1").replace(/\r/g, "&#13;").replace(/\n/g, "&#10;")}>` : escapedUrl.replace(/([\\()])/g, "\\$1").replace(/^</, "\\<");
		return title ? `[${textContent}](${url} "${title}")` : `[${textContent}](${url})`;
	},
	importRegExp: /(?:\[(.+?)\])(?:\(\s*(?:(?:<((?:\\.|[^<>\n\\])*)>|((?!<)(?:\\[^\s]|\\(?=\s)|\((?:\\[^\s]|[^\s()\\]|\((?:\\[^\s]|[^\s()\\]|\((?:\\[^\s]|[^\s()\\])*\))*\))*\)|[^\s()\\])+))(?:\s+(?:"((?:[^"]*\\")*[^"]*)"|'((?:[^']*\\')*[^']*)'|\(((?:\\.|[^()\\])*)\)))?\s*)?\))/,
	regExp: /(?:\[([^[\]]*(?:\[[^[\]]*\][^[\]]*)*)\])(?:\(\s*(?:(?:<((?:\\.|[^<>\n\\])*)>|((?!<)(?:\\[^\s]|\\(?=\s)|\((?:\\[^\s]|[^\s()\\]|\((?:\\[^\s]|[^\s()\\]|\((?:\\[^\s]|[^\s()\\])*\))*\))*\)|[^\s()\\])+))(?:\s+(?:"((?:[^"]*\\")*[^"]*)"|'((?:[^']*\\')*[^']*)'|\(((?:\\.|[^()\\])*)\)))?\s*)?\))$/,
	replace: (textNode, match) => {
		if ($findMatchingParent(textNode, $isLinkNode)) return;
		const [, linkText, pointyLinkUrl, rawLinkUrl, quotedTitle, apostrophedTitle, parenthesizedTitle] = match;
		const linkUrl = unescapeText(pointyLinkUrl ?? rawLinkUrl ?? "");
		const rawLinkTitle = quotedTitle ?? apostrophedTitle ?? parenthesizedTitle;
		const linkTitle = rawLinkTitle != null ? unescapeText(rawLinkTitle) : void 0;
		const linkNode = $createLinkNode(linkUrl, { title: linkTitle });
		const openBracketAmount = linkText.split("[").length - 1;
		const closeBracketAmount = linkText.split("]").length - 1;
		let parsedLinkText = linkText;
		let outsideLinkText = "";
		if (openBracketAmount < closeBracketAmount) return;
		else if (openBracketAmount > closeBracketAmount) {
			const linkTextParts = linkText.split("[");
			outsideLinkText = "[" + linkTextParts[0];
			parsedLinkText = linkTextParts.slice(1).join("[");
		}
		const format = textNode.getFormat();
		const linkTextNode = $createTextNode(parsedLinkText);
		linkTextNode.setFormat(format);
		linkNode.append(linkTextNode);
		textNode.replace(linkNode);
		if (outsideLinkText) linkNode.insertBefore($createTextNode(outsideLinkText).setFormat(format));
		return linkTextNode;
	},
	trigger: ")",
	type: "text-match"
};
var ELEMENT_TRANSFORMERS = [
	HEADING,
	QUOTE,
	UNORDERED_LIST,
	ORDERED_LIST
];
var MULTILINE_ELEMENT_TRANSFORMERS = [CODE];
var TEXT_FORMAT_TRANSFORMERS = [
	INLINE_CODE,
	BOLD_ITALIC_STAR,
	BOLD_ITALIC_UNDERSCORE,
	BOLD_STAR,
	BOLD_UNDERSCORE,
	HIGHLIGHT,
	ITALIC_STAR,
	ITALIC_UNDERSCORE,
	STRIKETHROUGH
];
var TEXT_MATCH_TRANSFORMERS = [LINK];
/**
* Concatenate transformer lists. A function declared side-effect free (so the
* build annotates the call) rather than an array spread at module scope,
* which is a side effect to bundlers and would pin every transformer into
* every bundle that imports this module.
*
* @__NO_SIDE_EFFECTS__
*/
function concatTransformers(...lists) {
	return lists.flat();
}
var TRANSFORMERS = concatTransformers(ELEMENT_TRANSFORMERS, MULTILINE_ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS);
function normalizeMarkdown(input, shouldMergeAdjacentLines = false) {
	const lines = input.split("\n");
	let codeBlockFenceLength = 0;
	const sanitizedLines = [];
	for (let i = 0; i < lines.length; i++) {
		const rawLine = lines[i];
		const line = rawLine.trimEnd();
		const lastLine = sanitizedLines[sanitizedLines.length - 1];
		const hardLineBreak = i < lines.length - 1 ? parseMarkdownHardLineBreak(rawLine) : null;
		const lastLineHasHardLineBreak = lastLine !== void 0 && parseMarkdownHardLineBreak(lastLine) !== null;
		if (CODE_SINGLE_LINE_REGEX.test(line)) {
			sanitizedLines.push(line);
			continue;
		}
		if (codeBlockFenceLength === 0) {
			const openMatch = line.match(CODE_START_REGEX);
			if (openMatch) {
				codeBlockFenceLength = openMatch[1].trim().length;
				sanitizedLines.push(line);
				continue;
			}
		} else {
			if (CODE_END_REGEX.test(line) && line.trim().length >= codeBlockFenceLength) {
				codeBlockFenceLength = 0;
				sanitizedLines.push(line);
				continue;
			}
			sanitizedLines.push(rawLine);
			continue;
		}
		if (line === "" || lastLine === "" || !lastLine || HEADING_REGEX.test(lastLine) || HEADING_REGEX.test(line) || QUOTE_REGEX.test(line) || ORDERED_LIST_REGEX.test(line) || UNORDERED_LIST_REGEX.test(line) || CHECK_LIST_REGEX.test(line) || TABLE_ROW_REG_EXP.test(line) || isTableRowDivider(line) || lastLineHasHardLineBreak || !shouldMergeAdjacentLines || TAG_START_REGEX.test(line) || TAG_END_REGEX.test(line) || ENDS_WITH(TAG_END_REGEX).test(lastLine) || ENDS_WITH(TAG_START_REGEX).test(lastLine) || CODE_END_REGEX.test(lastLine)) sanitizedLines.push(!shouldMergeAdjacentLines && line !== "" || hardLineBreak !== null ? rawLine : line);
		else sanitizedLines[sanitizedLines.length - 1] = lastLine + " " + (hardLineBreak === null ? line : rawLine).trimStart();
	}
	return sanitizedLines.join("\n");
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+markdown@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/markdown/src/MarkdownExport.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Renders string from markdown. The selection is moved to the start after the operation.
*/
function createMarkdownExport(transformers, shouldPreserveNewLines = false) {
	const byType = transformersByType(transformers);
	const elementTransformers = [...byType.multilineElement, ...byType.element];
	const isNewlineDelimited = !shouldPreserveNewLines;
	const textFormatTransformers = byType.textFormat.filter((transformer) => transformer.format.length === 1).sort((a, b) => {
		return Number(a.format.includes("code")) - Number(b.format.includes("code"));
	});
	return (node) => {
		const output = [];
		const children = (node || $getRoot()).getChildren();
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const result = $exportTopLevelElements(child, elementTransformers, textFormatTransformers, byType.textMatch, shouldPreserveNewLines);
			if (result != null) output.push(isNewlineDelimited && i > 0 && !isEmptyParagraph(child) && !isEmptyParagraph(children[i - 1]) ? "\n".concat(result) : result);
		}
		return output.join("\n");
	};
}
/**
* Creates a markdown export function that only exports selected content.
* Uses a recursive structure similar to $appendNodesToHTML to support
* extractWithChild for proper handling of partial selections within
* inline elements like links.
*/
function createSelectionMarkdownExport(transformers, shouldPreserveNewLines = false) {
	const byType = transformersByType(transformers);
	const elementTransformers = [...byType.multilineElement, ...byType.element];
	const isNewlineDelimited = !shouldPreserveNewLines;
	const textFormatTransformers = byType.textFormat.filter((transformer) => transformer.format.length === 1).sort((a, b) => {
		return Number(a.format.includes("code")) - Number(b.format.includes("code"));
	});
	return (selection) => {
		const output = [];
		let previousExported = null;
		for (const child of $getRoot().getChildren()) {
			const { shouldInclude, markdown } = $processNodeForSelection(child, selection, elementTransformers, textFormatTransformers, byType.textMatch, shouldPreserveNewLines);
			if (shouldInclude && markdown != null) {
				output.push(isNewlineDelimited && previousExported !== null && !isEmptyParagraph(child) && !isEmptyParagraph(previousExported) ? "\n".concat(markdown) : markdown);
				previousExported = child;
			}
		}
		return output.join("\n");
	};
}
function $processNodeForSelection(node, selection, elementTransformers, textFormatTransformers, textMatchTransformers, shouldPreserveNewLines) {
	let shouldInclude = node.isSelected(selection);
	for (const transformer of elementTransformers) {
		if (!transformer.export) continue;
		const result = transformer.export(node, (node_) => $exportChildrenForSelection(node_, selection, textFormatTransformers, textMatchTransformers, shouldPreserveNewLines).markdown, selection);
		if (result != null) {
			if (!shouldInclude) {
				if ($isElementNode(node)) {
					if ($exportChildrenForSelection(node, selection, textFormatTransformers, textMatchTransformers, shouldPreserveNewLines).shouldInclude) shouldInclude = true;
				}
			}
			return {
				markdown: result,
				shouldInclude
			};
		}
	}
	if ($isElementNode(node)) {
		const childResult = $exportChildrenForSelection(node, selection, textFormatTransformers, textMatchTransformers, shouldPreserveNewLines);
		return {
			markdown: childResult.markdown,
			shouldInclude: shouldInclude || childResult.shouldInclude
		};
	} else if ($isDecoratorNode(node)) return {
		markdown: node.getTextContent(),
		shouldInclude
	};
	else return {
		markdown: null,
		shouldInclude
	};
}
function $exportChildrenForSelection(node, selection, textFormatTransformers, textMatchTransformers, shouldPreserveNewLines, unclosedTags, unclosableTags) {
	const output = [];
	const children = node.getChildren();
	let anyChildIncluded = false;
	if (!unclosedTags) unclosedTags = [];
	if (!unclosableTags) unclosableTags = [];
	mainLoop: for (const child of children) {
		let childIncluded = child.isSelected(selection);
		for (const transformer of textMatchTransformers) {
			if (!transformer.export) continue;
			const result = transformer.export(child, (parentNode) => $exportChildrenForSelection(parentNode, selection, textFormatTransformers, textMatchTransformers, shouldPreserveNewLines, unclosedTags, [...unclosableTags, ...unclosedTags]).markdown, (textNode, textContent) => {
				return exportTextFormat(textNode, $sliceSelectedTextNodeContent(selection, textNode, "clone").getTextContent(), textFormatTransformers, unclosedTags, unclosableTags, shouldPreserveNewLines);
			});
			if (result != null) {
				if (!childIncluded && $isElementNode(child) && child.getChildren().some((c) => c.isSelected(selection)) && child.extractWithChild(child, selection, "html")) childIncluded = true;
				if (childIncluded) {
					output.push(result);
					anyChildIncluded = true;
				}
				continue mainLoop;
			}
		}
		if ($isLineBreakNode(child)) {
			if (childIncluded) {
				output.push($exportLineBreak(child));
				anyChildIncluded = true;
			}
		} else if ($isTextNode(child)) {
			if (childIncluded) {
				const target = $sliceSelectedTextNodeContent(selection, child, "clone");
				output.push(exportTextFormat(child, target.getTextContent(), textFormatTransformers, unclosedTags, unclosableTags, shouldPreserveNewLines));
				anyChildIncluded = true;
			}
		} else if ($isElementNode(child)) {
			const childResult = $exportChildrenForSelection(child, selection, textFormatTransformers, textMatchTransformers, shouldPreserveNewLines, unclosedTags, unclosableTags);
			if (!childIncluded && childResult.shouldInclude && child.extractWithChild(child, selection, "html")) childIncluded = true;
			if (childIncluded || childResult.shouldInclude) {
				output.push(childResult.markdown);
				anyChildIncluded = true;
			}
		} else if ($isDecoratorNode(child)) {
			if (childIncluded) {
				output.push(child.getTextContent());
				anyChildIncluded = true;
			}
		}
	}
	return {
		markdown: output.join(""),
		shouldInclude: anyChildIncluded
	};
}
function $exportTopLevelElements(node, elementTransformers, textTransformersIndex, textMatchTransformers, shouldPreserveNewLines) {
	for (const transformer of elementTransformers) {
		if (!transformer.export) continue;
		const result = transformer.export(node, (_node) => $exportChildren(_node, textTransformersIndex, textMatchTransformers, void 0, void 0, shouldPreserveNewLines));
		if (result != null) return result;
	}
	if ($isElementNode(node)) return $exportChildren(node, textTransformersIndex, textMatchTransformers, void 0, void 0, shouldPreserveNewLines);
	else if ($isDecoratorNode(node)) return node.getTextContent();
	else return null;
}
function $exportChildren(node, textTransformersIndex, textMatchTransformers, unclosedTags, unclosableTags, shouldPreserveNewLines = false) {
	const output = [];
	const children = node.getChildren();
	if (!unclosedTags) unclosedTags = [];
	if (!unclosableTags) unclosableTags = [];
	mainLoop: for (const child of children) {
		for (const transformer of textMatchTransformers) {
			if (!transformer.export) continue;
			const result = transformer.export(child, (parentNode) => $exportChildren(parentNode, textTransformersIndex, textMatchTransformers, unclosedTags, [...unclosableTags, ...unclosedTags], shouldPreserveNewLines), (textNode, textContent) => exportTextFormat(textNode, textContent, textTransformersIndex, unclosedTags, unclosableTags, shouldPreserveNewLines));
			if (result != null) {
				output.push(result);
				continue mainLoop;
			}
		}
		if ($isLineBreakNode(child)) output.push($exportLineBreak(child));
		else if ($isTextNode(child)) output.push(exportTextFormat(child, child.getTextContent(), textTransformersIndex, unclosedTags, unclosableTags, shouldPreserveNewLines));
		else if ($isElementNode(child)) output.push($exportChildren(child, textTransformersIndex, textMatchTransformers, unclosedTags, unclosableTags, shouldPreserveNewLines));
		else if ($isDecoratorNode(child)) output.push(child.getTextContent());
	}
	return output.join("");
}
function $exportLineBreak(node) {
	return $getState(node, hardLineBreakState) + "\n";
}
function exportTextFormat(node, textContent, textTransformers, unclosedTags, unclosableTags, shouldPreserveNewLines = false) {
	const isCode = node.hasFormat("code");
	let output = textContent;
	if (!isCode) output = shouldPreserveNewLines ? output.replace(/([*_`~])/g, "\\$1") : output.replace(/([*_`~\\])/g, "\\$1");
	let leadingSpace;
	let trimmedOutput;
	let trailingSpace;
	let isWhitespaceOnly;
	if (isCode) {
		const { fence, padded } = getCodeSpanDelimiter(textContent);
		leadingSpace = "";
		trailingSpace = "";
		trimmedOutput = fence + padded + fence;
		isWhitespaceOnly = false;
	} else {
		const match = output.match(/^(\s*)(.*?)(\s*)$/s) || [
			"",
			"",
			output,
			""
		];
		leadingSpace = match[1];
		trimmedOutput = match[2];
		trailingSpace = match[3];
		isWhitespaceOnly = trimmedOutput === "";
	}
	let openingTags = "";
	let closingTagsBefore = "";
	let closingTagsAfter = "";
	const prevNode = getTextSibling(node, true);
	const nextNode = getTextSibling(node, false);
	const applied = /* @__PURE__ */ new Set();
	for (const transformer of textTransformers) {
		const format = transformer.format[0];
		const tag = transformer.tag;
		if (format === "code") continue;
		if (!isWhitespaceOnly && checkHasFormat(node, format) && !applied.has(format)) {
			applied.add(format);
			if (!checkHasFormat(prevNode, format) || !unclosedTags.find((element) => element.tag === tag)) {
				unclosedTags.push({
					format,
					tag
				});
				openingTags += tag;
			}
		}
	}
	for (let i = 0; i < unclosedTags.length; i++) {
		const nodeHasFormat = hasFormat(node, unclosedTags[i].format);
		const nextNodeHasFormat = hasFormat(nextNode, unclosedTags[i].format);
		if (nodeHasFormat && nextNodeHasFormat) continue;
		const unhandledUnclosedTags = [...unclosedTags];
		while (unhandledUnclosedTags.length > i) {
			const unclosedTag = unhandledUnclosedTags.pop();
			if (unclosableTags && unclosedTag && unclosableTags.find((element) => element.tag === unclosedTag.tag)) continue;
			if (unclosedTag && typeof unclosedTag.tag === "string") {
				if (!nodeHasFormat) closingTagsBefore += unclosedTag.tag;
				else if (!nextNodeHasFormat) closingTagsAfter += unclosedTag.tag;
			}
			unclosedTags.pop();
		}
		break;
	}
	if (isWhitespaceOnly && !node.hasFormat("code")) return closingTagsBefore + output;
	return closingTagsBefore + leadingSpace + openingTags + trimmedOutput + closingTagsAfter + trailingSpace;
}
function getTextSibling(node, backward) {
	const sibling = backward ? node.getPreviousSibling() : node.getNextSibling();
	if ($isTextNode(sibling)) return sibling;
	return null;
}
function hasFormat(node, format) {
	return $isTextNode(node) && node.hasFormat(format);
}
function checkHasFormat(n, f) {
	if (!hasFormat(n, f)) return false;
	if (f === "code") return true;
	if (n && /^\s*$/.test(n.getTextContent())) return false;
	return true;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+markdown@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/markdown/src/importTextFormatTransformer.ts
function findOutermostTextFormatTransformer(textNode, textFormatTransformersIndex) {
	const textContent = textNode.getTextContent();
	const codeTransformer = textFormatTransformersIndex.transformersByTag["`"];
	const excludeRanges = [];
	let codeMatch = null;
	if (codeTransformer) {
		const codeSpans = scanCodeSpans(textContent);
		for (const span of codeSpans) {
			if (!codeMatch) codeMatch = {
				content: span.content,
				endIndex: span.endIndex,
				startIndex: span.startIndex,
				tag: "`"
			};
			excludeRanges.push({
				end: span.endIndex,
				start: span.startIndex
			});
		}
	}
	const delimiters = scanDelimiters(textContent, textFormatTransformersIndex, excludeRanges);
	const emphasisMatch = delimiters.length > 0 ? processEmphasis(textContent, delimiters, textFormatTransformersIndex) : null;
	let resultMatch = null;
	let resultTransformer = null;
	if (codeMatch && emphasisMatch) {
		if (emphasisMatch.startIndex <= codeMatch.startIndex && emphasisMatch.endIndex >= codeMatch.endIndex) {
			resultMatch = emphasisMatch;
			resultTransformer = textFormatTransformersIndex.transformersByTag[emphasisMatch.tag];
		} else {
			resultMatch = codeMatch;
			resultTransformer = codeTransformer;
		}
	} else if (codeMatch) {
		resultMatch = codeMatch;
		resultTransformer = codeTransformer;
	} else if (emphasisMatch) {
		resultMatch = emphasisMatch;
		resultTransformer = textFormatTransformersIndex.transformersByTag[emphasisMatch.tag];
	}
	if (!resultMatch || !resultTransformer) return null;
	const regexMatch = [
		textContent.slice(resultMatch.startIndex, resultMatch.endIndex),
		resultMatch.tag,
		resultMatch.content
	];
	regexMatch.index = resultMatch.startIndex;
	regexMatch.input = textContent;
	return {
		endIndex: resultMatch.endIndex,
		isCodeSpan: resultTransformer === codeTransformer,
		match: regexMatch,
		startIndex: resultMatch.startIndex,
		transformer: resultTransformer
	};
}
function scanCodeSpans(text) {
	const isEscaped = (index) => {
		let count = 0;
		for (let i = index - 1; i >= 0 && text[i] === "\\"; i--) count++;
		return count % 2 === 1;
	};
	const runs = [];
	let i = 0;
	while (i < text.length) if (text[i] === "`") {
		let length = 1;
		while (i + length < text.length && text[i + length] === "`") length++;
		runs.push({
			index: i,
			length
		});
		i += length;
	} else i++;
	const spans = [];
	let openIdx = 0;
	while (openIdx < runs.length) {
		const opener = runs[openIdx];
		if (isEscaped(opener.index)) {
			openIdx++;
			continue;
		}
		let closeIdx = -1;
		for (let c = openIdx + 1; c < runs.length; c++) if (runs[c].length === opener.length) {
			closeIdx = c;
			break;
		}
		if (closeIdx === -1) {
			openIdx++;
			continue;
		}
		const closer = runs[closeIdx];
		let content = text.slice(opener.index + opener.length, closer.index);
		if (content.length >= 2 && content.startsWith(" ") && content.endsWith(" ") && /[^ ]/.test(content)) content = content.slice(1, -1);
		spans.push({
			content,
			endIndex: closer.index + closer.length,
			startIndex: opener.index
		});
		openIdx = closeIdx + 1;
	}
	return spans;
}
function scanDelimiters(text, transformersIndex, excludeRanges = []) {
	const delimiters = [];
	const delimiterChars = new Set(Object.keys(transformersIndex.transformersByTag).filter((tag) => tag[0] !== "`").map((tag) => tag[0]));
	const isEscaped = (index) => {
		let count = 0;
		for (let i = index - 1; i >= 0 && text[i] === "\\"; i--) count++;
		return count % 2 === 1;
	};
	const isInExcludedRange = (index) => {
		return excludeRanges.some((range) => index >= range.start && index < range.end);
	};
	let i = 0;
	while (i < text.length) {
		const char = text[i];
		if (!delimiterChars.has(char) || isEscaped(i) || isInExcludedRange(i)) {
			i++;
			continue;
		}
		let len = 1;
		while (i + len < text.length && text[i + len] === char) len++;
		const canOpen = canEmphasis(char, text, i, len, true);
		const canClose = canEmphasis(char, text, i, len, false);
		if (canOpen || canClose) delimiters.push({
			active: true,
			canClose,
			canOpen,
			char,
			index: i,
			length: len
		});
		i += len;
	}
	return delimiters;
}
function processEmphasis(text, delimiters, transformersIndex) {
	const openersBottom = {};
	let currentPos = 0;
	let result = null;
	while (currentPos < delimiters.length) {
		const closer = delimiters[currentPos];
		if (!closer.active || !closer.canClose || closer.length === 0) {
			currentPos++;
			continue;
		}
		const bottomKey = `${closer.char}${closer.canOpen}${closer.length % 3}`;
		const bottom = openersBottom[bottomKey] ?? -1;
		let foundOpener = false;
		for (let openIdx = currentPos - 1; openIdx > bottom; openIdx--) {
			const opener = delimiters[openIdx];
			if (!opener.active || !opener.canOpen || opener.length === 0 || opener.char !== closer.char) continue;
			if (opener.canClose || closer.canOpen) {
				if ((opener.length + closer.length) % 3 === 0 && opener.length % 3 !== 0 && closer.length % 3 !== 0) continue;
			}
			const maxLen = Math.min(opener.length, closer.length);
			const matchedTag = Object.keys(transformersIndex.transformersByTag).filter((t) => t[0] === opener.char && t.length <= maxLen).sort((a, b) => b.length - a.length)[0];
			if (!matchedTag) continue;
			foundOpener = true;
			const matchLen = matchedTag.length;
			const match = {
				content: text.slice(opener.index + opener.length, closer.index),
				endIndex: closer.index + matchLen,
				startIndex: opener.index + (opener.length - matchLen),
				tag: matchedTag
			};
			if (!result || match.startIndex < result.startIndex || match.startIndex === result.startIndex && match.endIndex > result.endIndex) result = match;
			for (let j = openIdx + 1; j < currentPos; j++) delimiters[j].active = false;
			opener.length -= matchLen;
			closer.length -= matchLen;
			opener.active = opener.length > 0;
			if (closer.length > 0) closer.index += matchLen;
			else {
				closer.active = false;
				currentPos++;
			}
			break;
		}
		if (!foundOpener) {
			openersBottom[bottomKey] = currentPos - 1;
			if (!closer.canOpen) closer.active = false;
			currentPos++;
		}
	}
	return result;
}
function canEmphasis(char, text, index, length, isOpen) {
	if (!isFlanking(text, index, length, isOpen)) return false;
	if (char === "*") return true;
	if (char === "_") {
		if (!isFlanking(text, index, length, !isOpen)) return true;
		const adjacentChar = isOpen ? text[index - 1] : text[index + length];
		return adjacentChar !== void 0 && PUNCTUATION.test(adjacentChar);
	}
	return true;
}
function isFlanking(text, index, length, isLeft) {
	const charBefore = text[index - 1];
	const charAfter = text[index + length];
	const [primary, secondary] = isLeft ? [charAfter, charBefore] : [charBefore, charAfter];
	if (primary === void 0 || WHITESPACE.test(primary)) return false;
	if (!PUNCTUATION.test(primary)) return true;
	return secondary === void 0 || WHITESPACE.test(secondary) || PUNCTUATION.test(secondary);
}
function importTextFormatTransformer(textNode, startIndex, endIndex, transformer, match) {
	const textContent = textNode.getTextContent();
	let transformedNode, nodeAfter, nodeBefore;
	if (match[0] === textContent) transformedNode = textNode;
	else if (startIndex === 0) [transformedNode, nodeAfter] = textNode.splitText(endIndex);
	else [nodeBefore, transformedNode, nodeAfter] = textNode.splitText(startIndex, endIndex);
	transformedNode.setTextContent(match[2]);
	if (transformer) {
		for (const format of transformer.format) if (!transformedNode.hasFormat(format)) transformedNode.toggleFormat(format);
	}
	return {
		nodeAfter,
		nodeBefore,
		transformedNode
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+markdown@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/markdown/src/importTextMatchTransformer.ts
function findOutermostTextMatchTransformer(textNode_, textMatchTransformers) {
	const textNode = textNode_;
	let foundMatchStartIndex = void 0;
	let foundMatchEndIndex = void 0;
	let foundMatchTransformer = void 0;
	let foundMatch = void 0;
	for (const transformer of textMatchTransformers) {
		if (!transformer.replace || !transformer.importRegExp) continue;
		const match = textNode.getTextContent().match(transformer.importRegExp);
		if (!match) continue;
		const startIndex = match.index || 0;
		const endIndex = transformer.getEndIndex ? transformer.getEndIndex(textNode, match) : startIndex + match[0].length;
		if (endIndex === false) continue;
		if (foundMatchStartIndex === void 0 || foundMatchEndIndex === void 0 || startIndex < foundMatchStartIndex && (endIndex > foundMatchEndIndex || endIndex <= foundMatchStartIndex)) {
			foundMatchStartIndex = startIndex;
			foundMatchEndIndex = endIndex;
			foundMatchTransformer = transformer;
			foundMatch = match;
		}
	}
	if (foundMatchStartIndex === void 0 || foundMatchEndIndex === void 0 || foundMatchTransformer === void 0 || foundMatch === void 0) return null;
	return {
		endIndex: foundMatchEndIndex,
		match: foundMatch,
		startIndex: foundMatchStartIndex,
		transformer: foundMatchTransformer
	};
}
function importFoundTextMatchTransformer(textNode, startIndex, endIndex, transformer, match) {
	let transformedNode, nodeAfter, nodeBefore;
	if (startIndex === 0) [transformedNode, nodeAfter] = textNode.splitText(endIndex);
	else [nodeBefore, transformedNode, nodeAfter] = textNode.splitText(startIndex, endIndex);
	if (!transformer.replace) return null;
	const potentialTransformedNode = transformer.replace(transformedNode, match);
	return {
		nodeAfter,
		nodeBefore,
		transformedNode: potentialTransformedNode || void 0
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+markdown@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/markdown/src/importTextTransformers.ts
/**
* Returns true if the node can contain transformable markdown.
* Code nodes cannot contain transformable markdown.
* For example, `code **bold**` should not be transformed to
* <code>code <strong>bold</strong></code>.
*/
function canContainTransformableMarkdown(node) {
	return $isTextNode(node) && !node.hasFormat("code");
}
/**
* Handles applying both text format and text match transformers.
* It finds the outermost text format or text match and applies it,
* then recursively calls itself to apply the next outermost transformer,
* until there are no more transformers to apply.
*/
function importTextTransformers(textNode, textFormatTransformersIndex, textMatchTransformers) {
	let foundTextFormat = findOutermostTextFormatTransformer(textNode, textFormatTransformersIndex);
	let foundTextMatch = findOutermostTextMatchTransformer(textNode, textMatchTransformers);
	if (foundTextFormat && foundTextMatch) {
		if (foundTextFormat.isCodeSpan) {
			if (foundTextMatch.startIndex <= foundTextFormat.startIndex && foundTextMatch.endIndex >= foundTextFormat.endIndex) foundTextFormat = null;
			else foundTextMatch = null;
		} else if (foundTextFormat.startIndex <= foundTextMatch.startIndex && foundTextFormat.endIndex >= foundTextMatch.endIndex || foundTextMatch.startIndex > foundTextFormat.endIndex) foundTextMatch = null;
		else foundTextFormat = null;
	}
	if (foundTextFormat) {
		const result = importTextFormatTransformer(textNode, foundTextFormat.startIndex, foundTextFormat.endIndex, foundTextFormat.transformer, foundTextFormat.match);
		if (canContainTransformableMarkdown(result.nodeAfter)) importTextTransformers(result.nodeAfter, textFormatTransformersIndex, textMatchTransformers);
		if (canContainTransformableMarkdown(result.nodeBefore)) importTextTransformers(result.nodeBefore, textFormatTransformersIndex, textMatchTransformers);
		if (canContainTransformableMarkdown(result.transformedNode)) importTextTransformers(result.transformedNode, textFormatTransformersIndex, textMatchTransformers);
	} else if (foundTextMatch) {
		const result = importFoundTextMatchTransformer(textNode, foundTextMatch.startIndex, foundTextMatch.endIndex, foundTextMatch.transformer, foundTextMatch.match);
		if (!result) return;
		if (canContainTransformableMarkdown(result.nodeAfter)) importTextTransformers(result.nodeAfter, textFormatTransformersIndex, textMatchTransformers);
		if (canContainTransformableMarkdown(result.nodeBefore)) importTextTransformers(result.nodeBefore, textFormatTransformersIndex, textMatchTransformers);
		if (canContainTransformableMarkdown(result.transformedNode)) importTextTransformers(result.transformedNode, textFormatTransformersIndex, textMatchTransformers);
	}
	const unescapedText = unescapeText(textNode.getTextContent());
	textNode.setTextContent(unescapedText);
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+markdown@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/markdown/src/MarkdownImport.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Parses a markdown string and appends the resulting nodes to `container`.
* Does not clear the container or touch the selection — callers handle that.
*/
function $importMarkdownNodes(markdownString, container, transformers, shouldPreserveNewLines = false) {
	const byType = transformersByType(transformers);
	const textFormatTransformersIndex = createTextFormatTransformersIndex(byType.textFormat);
	const lines = markdownString.split("\n");
	const linesLength = lines.length;
	withListIndentColumns(!shouldPreserveNewLines, () => {
		for (let i = 0; i < linesLength; i++) {
			const lineText = lines[i];
			const [imported, shiftedIndex] = $importMultiline(lines, i, byType.multilineElement, container);
			if (imported) {
				i = shiftedIndex;
				continue;
			}
			$importBlocks(lineText, container, byType.element, textFormatTransformersIndex, byType.textMatch, shouldPreserveNewLines);
		}
	});
	const children = container.getChildren();
	for (const child of children) {
		if (!shouldPreserveNewLines && isEmptyParagraph(child) && container.getChildrenSize() > 1) {
			child.remove();
			continue;
		}
		if ($isElementNode(child)) for (const textNode of child.getAllTextNodes()) $normalizeMarkdownTextNode(textNode);
	}
}
/**
*
* @returns first element of the returned tuple is a boolean indicating if a multiline element was imported. The second element is the index of the last line that was processed.
*/
function $importMultiline(lines, startLineIndex, multilineElementTransformers, rootNode) {
	for (const transformer of multilineElementTransformers) {
		const { handleImportAfterStartMatch, regExpEnd, regExpStart, replace } = transformer;
		const startMatch = lines[startLineIndex].match(regExpStart);
		if (!startMatch) continue;
		if (handleImportAfterStartMatch) {
			const result = handleImportAfterStartMatch({
				lines,
				rootNode,
				startLineIndex,
				startMatch,
				transformer
			});
			if (result === null) continue;
			else if (result) return result;
		}
		const regexpEndRegex = typeof regExpEnd === "object" && "regExp" in regExpEnd ? regExpEnd.regExp : regExpEnd;
		const isEndOptional = regExpEnd && typeof regExpEnd === "object" && "optional" in regExpEnd ? regExpEnd.optional : !regExpEnd;
		let endLineIndex = startLineIndex;
		const linesLength = lines.length;
		while (endLineIndex < linesLength) {
			const endMatch = regexpEndRegex ? lines[endLineIndex].match(regexpEndRegex) : null;
			if (!endMatch) {
				if (!isEndOptional || isEndOptional && endLineIndex < linesLength - 1) {
					endLineIndex++;
					continue;
				}
			}
			if (endMatch && startLineIndex === endLineIndex && endMatch.index === startMatch.index) {
				endLineIndex++;
				continue;
			}
			const linesInBetween = [];
			if (endMatch && startLineIndex === endLineIndex) linesInBetween.push(lines[startLineIndex].slice(startMatch[0].length, -endMatch[0].length));
			else for (let i = startLineIndex; i <= endLineIndex; i++) if (i === startLineIndex) {
				const text = lines[i].slice(startMatch[0].length);
				linesInBetween.push(text);
			} else if (i === endLineIndex && endMatch) {
				const text = lines[i].slice(0, -endMatch[0].length);
				linesInBetween.push(text);
			} else linesInBetween.push(lines[i]);
			if (replace(rootNode, null, startMatch, endMatch, linesInBetween, true) !== false) return [true, endLineIndex];
			break;
		}
	}
	return [false, startLineIndex];
}
function $importBlocks(lineText, rootNode, elementTransformers, textFormatTransformersIndex, textMatchTransformers, shouldPreserveNewLines) {
	const textNode = $createTextNode(lineText);
	const elementNode = $createParagraphNode();
	elementNode.append(textNode);
	rootNode.append(elementNode);
	for (const { regExp, replace } of elementTransformers) {
		const match = lineText.match(regExp);
		if (match) {
			textNode.setTextContent(lineText.slice(match[0].length));
			if (replace(elementNode, [textNode], match, true) !== false) break;
		}
	}
	importTextTransformers(textNode, textFormatTransformersIndex, textMatchTransformers);
	if (elementNode.getParent() !== null && lineText.length > 0) {
		const previousNode = elementNode.getPreviousSibling();
		if (!shouldPreserveNewLines && ($isParagraphNode(previousNode) || $isQuoteNode(previousNode) || $isListNode(previousNode))) {
			let targetNode = previousNode;
			if ($isListNode(previousNode)) {
				const lastDescendant = previousNode.getLastDescendant();
				if (lastDescendant == null) targetNode = null;
				else targetNode = $findMatchingParent(lastDescendant, $isListItemNode);
			}
			if (targetNode != null && targetNode.getTextContentSize() > 0) {
				targetNode.splice(targetNode.getChildrenSize(), 0, [$createMarkdownLineBreakNode(targetNode), ...elementNode.getChildren()]);
				elementNode.remove();
			}
		}
	}
}
function $normalizeMarkdownTextNode(textNode) {
	if ($isTabNode(textNode)) return;
	const text = textNode.getTextContent();
	if (!text.includes("	")) return;
	const format = textNode.getFormat();
	const style = textNode.getStyle();
	const nodes = [];
	let start = 0;
	for (let index = text.indexOf("	"); index !== -1; index = text.indexOf("	", index + 1)) {
		if (index > start) nodes.push($createTextNode(text.slice(start, index)).setFormat(format).setStyle(style));
		nodes.push($createTabNode());
		start = index + 1;
	}
	if (start < text.length) nodes.push($createTextNode(text.slice(start)).setFormat(format).setStyle(style));
	textNode.getParentOrThrow().splice(textNode.getIndexWithinParent(), 1, nodes);
}
function createTextFormatTransformersIndex(textTransformers) {
	const transformersByTag = {};
	const fullMatchRegExpByTag = {};
	const openTagsRegExp = [];
	for (const transformer of textTransformers) {
		const { tag } = transformer;
		transformersByTag[tag] = transformer;
		const tagRegExp = tag.replace(/(\*|\^|\+)/g, "\\$1");
		openTagsRegExp.push(tagRegExp);
		if (tag.length === 1) {
			if (tag === "`") fullMatchRegExpByTag[tag] = new RegExp(`(^|[^\\\\\`])(\`)((?:\\\\\`|[^\`])+?)(\`)(?!\`)`);
			else fullMatchRegExpByTag[tag] = new RegExp(`(^|[^\\\\${tagRegExp}])(${tagRegExp})((\\\\${tagRegExp})?.*?[^${tagRegExp}\\s](\\\\${tagRegExp})?)(${tagRegExp})(?![\\\\${tagRegExp}])`);
		} else fullMatchRegExpByTag[tag] = new RegExp(`(^|[^\\\\])(${tagRegExp})((\\\\${tagRegExp})?.*?[^\\s](\\\\${tagRegExp})?)(${tagRegExp})(?!\\\\)`);
	}
	return {
		fullMatchRegExpByTag,
		openTagsRegExp: new RegExp(`(${openTagsRegExp.join("|")})`, "g"),
		transformersByTag
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+markdown@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/markdown/src/MarkdownShortcuts.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function runElementTransformers(parentNode, anchorNode, anchorOffset, elementTransformers, triggerOnEnter) {
	const grandParentNode = parentNode.getParent();
	if (!$isRootOrShadowRoot(grandParentNode) || parentNode.getFirstChild() !== anchorNode) return false;
	const textContent = anchorNode.getTextContent();
	if (!triggerOnEnter) {
		if (textContent[anchorOffset - 1] !== " ") return false;
	}
	for (const { regExp, replace } of elementTransformers) {
		const match = textContent.match(regExp);
		const expectedMatchLength = triggerOnEnter || match && match[0].endsWith(" ") ? anchorOffset : anchorOffset - 1;
		if (match && match[0].length === expectedMatchLength) {
			const nextSiblings = anchorNode.getNextSiblings();
			const [leadingNode, remainderNode] = anchorNode.splitText(anchorOffset);
			if (replace(parentNode, remainderNode ? [remainderNode, ...nextSiblings] : nextSiblings, match, false) !== false) {
				leadingNode.remove();
				return true;
			}
		}
	}
	return false;
}
function runMultilineElementTransformers(parentNode, anchorNode, anchorOffset, elementTransformers, triggerOnEnter) {
	const grandParentNode = parentNode.getParent();
	if (!$isRootOrShadowRoot(grandParentNode) || parentNode.getFirstChild() !== anchorNode) return false;
	const textContent = anchorNode.getTextContent();
	if (!triggerOnEnter) {
		if (textContent[anchorOffset - 1] !== " ") return false;
	}
	for (const { regExpStart, replace, regExpEnd } of elementTransformers) {
		if (regExpEnd && !("optional" in regExpEnd) || regExpEnd && "optional" in regExpEnd && !regExpEnd.optional) continue;
		const match = textContent.match(regExpStart);
		if (match) {
			const matchLength = triggerOnEnter || match[0].endsWith(" ") ? anchorOffset : anchorOffset - 1;
			if (match[0].length !== matchLength) continue;
			const nextSiblings = anchorNode.getNextSiblings();
			const [leadingNode, remainderNode] = anchorNode.splitText(anchorOffset);
			if (replace(parentNode, remainderNode ? [remainderNode, ...nextSiblings] : nextSiblings, match, null, null, false) !== false) {
				leadingNode.remove();
				return true;
			}
		}
	}
	return false;
}
function runTextMatchTransformers(anchorNode, anchorOffset, transformersByTrigger) {
	let textContent = anchorNode.getTextContent();
	const transformers = transformersByTrigger[textContent[anchorOffset - 1]];
	if (transformers == null) return false;
	if (anchorOffset < textContent.length) textContent = textContent.slice(0, anchorOffset);
	for (const transformer of transformers) {
		if (!transformer.replace || !transformer.regExp) continue;
		const match = textContent.match(transformer.regExp);
		if (match === null) continue;
		const startIndex = match.index || 0;
		const endIndex = startIndex + match[0].length;
		let replaceNode;
		if (startIndex === 0) [replaceNode] = anchorNode.splitText(endIndex);
		else [, replaceNode] = anchorNode.splitText(startIndex, endIndex);
		replaceNode.selectNext(0, 0);
		transformer.replace(replaceNode, match);
		return true;
	}
	return false;
}
function $runTextFormatTransformers(anchorNode, anchorOffset, textFormatTransformers) {
	const textContent = anchorNode.getTextContent();
	const closeTagEndIndex = anchorOffset - 1;
	const closeChar = textContent[closeTagEndIndex];
	const matchers = textFormatTransformers[closeChar];
	if (!matchers) return false;
	for (const matcher of matchers) {
		const { tag } = matcher;
		const tagLength = tag.length;
		const closeTagStartIndex = closeTagEndIndex - tagLength + 1;
		if (tagLength > 1) {
			if (!isEqualSubString(textContent, closeTagStartIndex, tag, 0, tagLength)) continue;
		}
		if (textContent[closeTagStartIndex - 1] === " ") continue;
		const afterCloseTagChar = textContent[closeTagEndIndex + 1];
		if (matcher.intraword === false && afterCloseTagChar && !PUNCTUATION_OR_SPACE.test(afterCloseTagChar)) continue;
		const closeNode = anchorNode;
		let openNode = closeNode;
		let openTagStartIndex = getOpenTagStartIndex(textContent, closeTagStartIndex, tag);
		let sibling = openNode;
		while (openTagStartIndex < 0 && (sibling = sibling.getPreviousSibling())) {
			if ($isLineBreakNode(sibling)) break;
			if ($isTextNode(sibling)) {
				if (sibling.hasFormat("code")) continue;
				const siblingTextContent = sibling.getTextContent();
				openNode = sibling;
				openTagStartIndex = getOpenTagStartIndex(siblingTextContent, siblingTextContent.length, tag);
			}
		}
		if (openTagStartIndex < 0) continue;
		if (openNode === closeNode && openTagStartIndex + tagLength === closeTagStartIndex) continue;
		const prevOpenNodeText = openNode.getTextContent();
		if (openTagStartIndex > 0 && prevOpenNodeText[openTagStartIndex - 1] === closeChar) continue;
		const beforeOpenTagChar = prevOpenNodeText[openTagStartIndex - 1];
		if (matcher.intraword === false && beforeOpenTagChar && !PUNCTUATION_OR_SPACE.test(beforeOpenTagChar)) continue;
		if (!matcher.format.includes("code") && $isInsideUnclosedCodeSpan(openNode, openTagStartIndex)) continue;
		const prevCloseNodeText = closeNode.getTextContent();
		const closeNodeText = prevCloseNodeText.slice(0, closeTagStartIndex) + prevCloseNodeText.slice(closeTagEndIndex + 1);
		closeNode.setTextContent(closeNodeText);
		const openNodeText = openNode === closeNode ? closeNodeText : prevOpenNodeText;
		openNode.setTextContent(openNodeText.slice(0, openTagStartIndex) + openNodeText.slice(openTagStartIndex + tagLength));
		const selection = $getSelection();
		const nextSelection = $createRangeSelection();
		$setSelection(nextSelection);
		const newOffset = closeTagEndIndex - tagLength * (openNode === closeNode ? 2 : 1) + 1;
		nextSelection.anchor.set(openNode.__key, openTagStartIndex, "text");
		nextSelection.focus.set(closeNode.__key, newOffset, "text");
		for (const format of matcher.format) nextSelection.formatText(format, TEXT_TYPE_TO_FORMAT[format]);
		nextSelection.anchor.set(nextSelection.focus.key, nextSelection.focus.offset, nextSelection.focus.type);
		for (const format of matcher.format) if (nextSelection.hasFormat(format)) nextSelection.toggleFormat(format);
		if ($isRangeSelection(selection)) nextSelection.format = selection.format;
		return true;
	}
	return false;
}
function $isInsideUnclosedCodeSpan(node, offset) {
	let backtickCount = 0;
	const text = node.getTextContent();
	for (let i = 0; i < offset; i++) if (text[i] === "`") backtickCount++;
	return backtickCount % 2 !== 0;
}
function getOpenTagStartIndex(string, maxIndex, tag) {
	const tagLength = tag.length;
	for (let i = maxIndex; i >= tagLength; i--) {
		const startIndex = i - tagLength;
		if (isEqualSubString(string, startIndex, tag, 0, tagLength) && string[startIndex + tagLength] !== " ") return startIndex;
	}
	return -1;
}
/**
* Text coordinate of a point, measured in characters from the start of its
* parent element rather than from the start of its own node.
*
* The "did the user type exactly one character?" heuristic compares the anchor
* offset before and after an update, but node transforms (hashtags, autolinks,
* ...) can split or merge the leaves around the caret within that same update.
* The anchor then lands in a different node and the two raw offsets are no
* longer comparable, so a single typed character can look like a large jump and
* the shortcut is skipped (#5366). Rebasing both offsets on the parent element
* keeps them comparable; when the leaves around the caret are unchanged this is
* the previous offset plus a constant on both sides, so the comparison is
* unaffected.
*/
function $getOffsetInParent(point) {
	const node = point.getNode();
	let offset = 0;
	if ($isTextNode(node)) offset = point.offset;
	else if ($isElementNode(node)) for (const child of node.getChildren().slice(0, point.offset)) offset += child.getTextContentSize();
	for (let sibling = node.getPreviousSibling(); sibling !== null; sibling = sibling.getPreviousSibling()) offset += sibling.getTextContentSize();
	return offset;
}
function isEqualSubString(stringA, aStart, stringB, bStart, length) {
	for (let i = 0; i < length; i++) if (stringA[aStart + i] !== stringB[bStart + i]) return false;
	return true;
}
function registerMarkdownShortcuts(editor, transformers = TRANSFORMERS) {
	const byType = transformersByType(transformers);
	const elementTransformersForEnter = byType.element.filter((t) => t.triggerOnEnter);
	const textFormatTransformersByTrigger = indexBy(byType.textFormat, ({ tag }) => tag[tag.length - 1]);
	const textMatchTransformersByTrigger = indexBy(byType.textMatch, ({ trigger }) => trigger);
	const compositionEndTriggerChars = /* @__PURE__ */ new Set([" "]);
	for (const t of byType.textFormat) compositionEndTriggerChars.add(t.tag.slice(-1));
	for (const t of byType.textMatch) if (t.trigger !== void 0) compositionEndTriggerChars.add(t.trigger);
	for (const transformer of transformers) {
		const type = transformer.type;
		if (type === "element" || type === "text-match" || type === "multiline-element") {
			const dependencies = transformer.dependencies;
			for (const node of dependencies) if (!editor.hasNode(node)) invariant(false, "MarkdownShortcuts: missing dependency %s for transformer. Ensure node dependency is included in editor initial config.", node.getType());
		}
	}
	const $transform = (parentNode, anchorNode, anchorOffset) => {
		if (runElementTransformers(parentNode, anchorNode, anchorOffset, byType.element)) return true;
		if (runMultilineElementTransformers(parentNode, anchorNode, anchorOffset, byType.multilineElement)) return true;
		if (runTextMatchTransformers(anchorNode, anchorOffset, textMatchTransformersByTrigger)) return true;
		if ($runTextFormatTransformers(anchorNode, anchorOffset, textFormatTransformersByTrigger)) return true;
		return false;
	};
	return mergeRegister(editor.registerUpdateListener(({ tags, dirtyLeaves, editorState, prevEditorState }) => {
		if (tags.has("collaboration") || tags.has("historic")) return;
		if (editor.isComposing()) return;
		const isCompositionEnd = tags.has(COMPOSITION_END_TAG);
		const selection = editorState.read($getSelection);
		const prevSelection = prevEditorState.read($getSelection);
		if (!$isRangeSelection(prevSelection) || !$isRangeSelection(selection) || !selection.isCollapsed() || selection.is(prevSelection) && !isCompositionEnd) return;
		const anchorKey = selection.anchor.key;
		const anchorOffset = selection.anchor.offset;
		const anchorNode = editorState._nodeMap.get(anchorKey);
		if (!$isTextNode(anchorNode) || !dirtyLeaves.has(anchorKey)) return;
		if (!isCompositionEnd && anchorOffset !== 1 && editorState.read(() => $getOffsetInParent(selection.anchor)) > prevEditorState.read(() => $getOffsetInParent(prevSelection.anchor)) + 1) return;
		if (isCompositionEnd) {
			const closeChar = editorState.read(() => anchorNode.getTextContent())[anchorOffset - 1];
			if (!compositionEndTriggerChars.has(closeChar)) return;
		}
		editor.update(() => {
			if (!canContainTransformableMarkdown(anchorNode)) return;
			const parentNode = anchorNode.getParent();
			if (parentNode === null || $isCodeNode(parentNode)) return;
			if ($transform(parentNode, anchorNode, selection.anchor.offset)) $addUpdateTag(HISTORY_PUSH_TAG);
		});
	}), editor.registerCommand(KEY_ENTER_COMMAND, (event) => {
		if (event !== null && event.shiftKey) return false;
		const selection = $getSelection();
		if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;
		const anchorOffset = selection.anchor.offset;
		const anchorNode = selection.anchor.getNode();
		if (!$isTextNode(anchorNode) || !canContainTransformableMarkdown(anchorNode)) return false;
		const parentNode = anchorNode.getParent();
		if (parentNode === null || $isCodeNode(parentNode)) return false;
		if (anchorOffset !== anchorNode.getTextContent().length) return false;
		if (runMultilineElementTransformers(parentNode, anchorNode, anchorOffset, byType.multilineElement, true) || runElementTransformers(parentNode, anchorNode, anchorOffset, elementTransformersForEnter, true)) {
			if (event !== null) event.preventDefault();
			return true;
		}
		return false;
	}, 1));
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+markdown@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/markdown/src/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Renders markdown from a string. The selection is moved to the start after the operation.
*
*  @param {boolean} [shouldPreserveNewLines] By setting this to true, new lines will be preserved between conversions
*  @param {boolean} [shouldMergeAdjacentLines] By setting this to true, adjacent non empty lines will be merged according to commonmark spec: https://spec.commonmark.org/0.24/#example-177. Not applicable if shouldPreserveNewLines = true.
*/
function $convertFromMarkdownString(markdown, transformers = TRANSFORMERS, node, shouldPreserveNewLines = false, shouldMergeAdjacentLines = false) {
	const sanitizedMarkdown = shouldPreserveNewLines ? markdown : normalizeMarkdown(markdown, shouldMergeAdjacentLines);
	const root = node || $getRoot();
	root.clear();
	$importMarkdownNodes(sanitizedMarkdown, root, transformers, shouldPreserveNewLines);
	if ($getSelection() !== null) root.selectStart();
}
/**
* Parses a markdown string and returns the resulting nodes as an array,
* without modifying the document tree or selection. The returned nodes can be
* inserted at an arbitrary position via `selection.insertNodes()`.
*
*  @param {boolean} [shouldPreserveNewLines] By setting this to true, new lines will be preserved between conversions
*  @param {boolean} [shouldMergeAdjacentLines] By setting this to true, adjacent non empty lines will be merged according to commonmark spec: https://spec.commonmark.org/0.24/#example-177. Not applicable if shouldPreserveNewLines = true.
*/
function $generateNodesFromMarkdownString(markdown, transformers = TRANSFORMERS, shouldPreserveNewLines = false, shouldMergeAdjacentLines = false) {
	const sanitizedMarkdown = shouldPreserveNewLines ? markdown : normalizeMarkdown(markdown, shouldMergeAdjacentLines);
	const container = new ArtificialNode__DO_NOT_USE();
	$importMarkdownNodes(sanitizedMarkdown, container, transformers, shouldPreserveNewLines);
	return container.getChildren();
}
/**
* Renders string from markdown. The selection is moved to the start after the operation.
*/
function $convertToMarkdownString(transformers = TRANSFORMERS, node, shouldPreserveNewLines = false) {
	return createMarkdownExport(transformers, shouldPreserveNewLines)(node);
}
/**
* Converts the selected content to a markdown string.
*/
function $convertSelectionToMarkdownString(transformers = TRANSFORMERS, selection, shouldPreserveNewLines = false) {
	if (!selection || $isRangeSelection(selection) && selection.isCollapsed()) return "";
	return createSelectionMarkdownExport(transformers, shouldPreserveNewLines)(selection);
}
//#endregion
export { $convertFromMarkdownString, $convertSelectionToMarkdownString, $convertToMarkdownString, $generateNodesFromMarkdownString, BOLD_ITALIC_STAR, BOLD_ITALIC_UNDERSCORE, BOLD_STAR, BOLD_UNDERSCORE, CHECK_LIST, CODE, ELEMENT_TRANSFORMERS, HEADING, HIGHLIGHT, INLINE_CODE, ITALIC_STAR, ITALIC_UNDERSCORE, LINK, MULTILINE_ELEMENT_TRANSFORMERS, ORDERED_LIST, QUOTE, STRIKETHROUGH, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS, TRANSFORMERS, UNORDERED_LIST, isTableRowDivider, registerMarkdownShortcuts };
