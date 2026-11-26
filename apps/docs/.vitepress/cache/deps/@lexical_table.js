import { Ai as DELETE_WORD_COMMAND, Ar as $getSelection, Bn as $createParagraphNode, Bt as getDOMSelectionPoints, Cn as setDOMUnmanaged, Cr as $createPoint, D as $isSiblingCaret, Di as CUT_COMMAND, Ea as booleanValue, Ei as COPY_COMMAND, Et as $setDirectionFromDOM, Fa as optional, Fi as FOCUS_COMMAND, Fr as $isRangeSelection, Gi as KEY_ARROW_RIGHT_COMMAND, Gr as $isTextNode, Ha as withAccessors, Ii as FORMAT_ELEMENT_COMMAND, Ji as KEY_DELETE_COMMAND, Jr as setDOMStyleFromCSS, Ki as KEY_ARROW_UP_COMMAND, La as setterDefaultOf, Li as FORMAT_TEXT_COMMAND, Ma as nullable, Mt as getActiveElement, Na as numberValue, Oa as enumValue, Oi as DELETE_CHARACTER_COMMAND, Ot as $setSelection, Pt as getComposedEventTarget, Ra as setterTableOf, Rt as getDOMSelection, Si as CLICK_COMMAND, T as $isChildCaret, Ta as arrayValue, Ti as CONTROLLED_TEXT_INSERTION_COMMAND, Tr as $createRangeSelectionFromDom, Ua as withField, Ui as KEY_ARROW_DOWN_COMMAND, Un as $caretFromPoint, Ur as $createTextNode, Vi as INSERT_PARAGRAPH_COMMAND, Vn as $isParagraphNode, Vt as getDOMSelectionRange, W as $applyNodeReplacement, Wi as KEY_ARROW_LEFT_COMMAND, X as $findMatchingParent, Xn as $isExtendableTextPointCaret, Zi as KEY_ESCAPE_COMMAND, Zn as $normalizeCaret, a as removeClassNamesFromElement, ao as TEXT_TYPE_TO_FORMAT, ar as $isLineBreakNode, at as $getNodeByKey, c as configExtension, ca as SELECTION_INSERT_CLIPBOARD_NODES_COMMAND, ct as $getRoot, d as $comparePointCaretNext, di as registerEventListener, dr as $isRootNode, ea as KEY_TAB_COMMAND, er as $setPointFromCaret, et as $getDocument, f as $extendCaretToRange, fa as createCommand, fn as isHTMLTableRowElement, ft as $isInlineElementOrDecoratorNode, g as $getChildCaret, go as invariant, gr as ElementNode, hr as $isElementNode, ia as PASTE_COMMAND, in as isDOMShadowRoot, ja as nodeSchema, ka as getterTableOf, ki as DELETE_LINE_COMMAND, kr as $getPreviousSelection, la as SELECT_ALL_COMMAND, ma as $normalizeSelection, mt as $isRootOrShadowRoot, n as mergeRegister, nn as isDOMDocumentNode, ot as $getNodeByKeyOrThrow, p as $getAdjacentChildCaret, po as IS_FIREFOX, q as $copyNode, qi as KEY_BACKSPACE_COMMAND, r as addClassNamesToElement, rn as isDOMNode, rt as $getNearestNodeFromDOMNode, s as safeCast, sa as SELECTION_CHANGE_COMMAND, t as registerEventListeners, tt as $getEditor, u as defineExtension, un as isHTMLElement, wr as $createRangeSelection, x as $getSiblingCaret, xr as isCurrentlyReadOnlyMode, y as $getCommonAncestor, yr as $fullReconcile, za as stringValue } from "./src-BWdqgNjM.js";
import { a as copyToClipboard, t as $getClipboardDataFromSelection } from "./clipboard-BFpJXOcv.js";
import { G as namedSignals, J as j, T as getPeerDependencyFromEditor, X as y } from "./src-DjbHpMmC.js";
import { L as objectKlassEquals, _ as $insertNodeToNearestRoot, h as $insertFirst$1, k as $unwrapAndFilterDescendants, n as $dfs, t as $descendantsMatching } from "./src-9-5QzbBl.js";
import { D as ImportTextStyle, E as ImportTextFormat, M as defineImportRule, d as DOMImportExtension, g as $propagateTextAlignToBlockChildren, l as CoreImportExtension, o as sel, q as contextValue } from "./src-CAtUi_gH.js";
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/constants.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var PIXEL_VALUE_REG_EXP = /^(\d+(?:\.\d+)?)px$/;
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableGeneratedJSON.ts
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
* TableNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneTableNode(node, prevNode) {
	node.__colWidths = prevNode.__colWidths;
	node.__frozenColumnCount = prevNode.__frozenColumnCount;
	node.__frozenRowCount = prevNode.__frozenRowCount;
	node.__rowStriping = prevNode.__rowStriping;
}
/** TableNode's generated implementations, for its `$config`. @internal */
var GENERATED_TABLE = (fields) => {
	const TABLE_FORMAT_GETTER = getterTableOf(fields, "format");
	const TABLE_FORMAT_SETTER = setterTableOf(fields, "format");
	const TABLE_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from TableNode's serialization schema. Do not edit by hand. */
	function exportTableNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			colWidths: node.__colWidths,
			frozenColumnCount: node.getSerializedFrozenColumnCount(),
			frozenRowCount: node.getSerializedFrozenRowCount(),
			rowStriping: node.getSerializedRowStriping(),
			direction: node.__dir,
			format: TABLE_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from TableNode's serialization schema. Do not edit by hand. */
	function exportCompactTableNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const colWidths = node.__colWidths;
		if (colWidths !== void 0) json.colWidths = colWidths;
		const frozenColumnCount = node.getSerializedFrozenColumnCount();
		if (frozenColumnCount !== void 0 && frozenColumnCount !== 0) json.frozenColumnCount = frozenColumnCount;
		const frozenRowCount = node.getSerializedFrozenRowCount();
		if (frozenRowCount !== void 0 && frozenRowCount !== 0) json.frozenRowCount = frozenRowCount;
		const rowStriping = node.getSerializedRowStriping();
		if (rowStriping !== void 0 && rowStriping !== false) json.rowStriping = rowStriping;
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = TABLE_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from TableNode's serialization schema. Do not edit by hand. */
	function updateTableNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in TABLE_FORMAT_SETTER ? TABLE_FORMAT_SETTER[format] : TABLE_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		const colWidths = json.colWidths;
		node.setColWidths(colWidths === void 0 ? void 0 : Array.isArray(colWidths) ? Array.from(colWidths, (e0) => num(e0, 0)) : []);
		node.__frozenColumnCount = num(json.frozenColumnCount, 0);
		node.__frozenRowCount = num(json.frozenRowCount, 0);
		const rowStriping = json.rowStriping;
		node.__rowStriping = typeof rowStriping === "boolean" ? rowStriping : false;
		return node;
	}
	return {
		exportJSON: exportTableNode,
		exportCompactJSON: exportCompactTableNode,
		updateFromJSON: updateTableNode,
		afterCloneFrom: afterCloneTableNode
	};
};
/**
* TableRowNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneTableRowNode(node, prevNode) {
	node.__height = prevNode.__height;
}
/** TableRowNode's generated implementations, for its `$config`. @internal */
var GENERATED_TABLEROW = (fields) => {
	const TABLEROW_FORMAT_GETTER = getterTableOf(fields, "format");
	const TABLEROW_FORMAT_SETTER = setterTableOf(fields, "format");
	const TABLEROW_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from TableRowNode's serialization schema. Do not edit by hand. */
	function exportTableRowNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			height: node.__height,
			direction: node.__dir,
			format: TABLEROW_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from TableRowNode's serialization schema. Do not edit by hand. */
	function exportCompactTableRowNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const height = node.__height;
		if (height !== void 0) json.height = height;
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = TABLEROW_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from TableRowNode's serialization schema. Do not edit by hand. */
	function updateTableRowNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in TABLEROW_FORMAT_SETTER ? TABLEROW_FORMAT_SETTER[format] : TABLEROW_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		const height = json.height;
		node.__height = height === void 0 ? void 0 : num(height, 0);
		return node;
	}
	return {
		exportJSON: exportTableRowNode,
		exportCompactJSON: exportCompactTableRowNode,
		updateFromJSON: updateTableRowNode,
		afterCloneFrom: afterCloneTableRowNode
	};
};
/**
* TableCellNode's schema-declared fields, for a clone. Generated from that
* schema; do not edit by hand.
*
* @internal
*/
function afterCloneTableCellNode(node, prevNode) {
	node.__backgroundColor = prevNode.__backgroundColor;
	node.__colSpan = prevNode.__colSpan;
	node.__headerState = prevNode.__headerState;
	node.__rowSpan = prevNode.__rowSpan;
	node.__verticalAlign = prevNode.__verticalAlign;
	node.__width = prevNode.__width;
}
/** TableCellNode's generated implementations, for its `$config`. @internal */
var GENERATED_TABLECELL = (fields) => {
	const TABLECELL_FORMAT_GETTER = getterTableOf(fields, "format");
	const TABLECELL_FORMAT_SETTER = setterTableOf(fields, "format");
	const TABLECELL_FORMAT_SETTER_DEFAULT = setterDefaultOf(fields, "format");
	/** Generated from TableCellNode's serialization schema. Do not edit by hand. */
	function exportTableCellNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		return {
			children: [],
			backgroundColor: node.__backgroundColor,
			colSpan: node.__colSpan,
			headerState: node.__headerState,
			rowSpan: node.__rowSpan,
			verticalAlign: node.getSerializedVerticalAlign(),
			width: node.__width,
			direction: node.__dir,
			format: TABLECELL_FORMAT_GETTER[node.__format],
			indent: node.__indent,
			textFormat: textFormat !== 0 && shouldSerializeTextStyles ? textFormat : void 0,
			textStyle: textStyle !== "" && shouldSerializeTextStyles ? textStyle : void 0,
			type: node.__type,
			version: 1
		};
	}
	/** Generated from TableCellNode's serialization schema. Do not edit by hand. */
	function exportCompactTableCellNode(node) {
		const textFormat = node.__textFormat;
		const textStyle = node.__textStyle;
		const shouldSerializeTextStyles = (textFormat !== 0 || textStyle !== "") && node.shouldSerializeTextStyles();
		const json = {
			type: node.__type,
			children: []
		};
		const backgroundColor = node.__backgroundColor;
		if (backgroundColor != null) json.backgroundColor = backgroundColor;
		const colSpan = node.__colSpan;
		if (colSpan !== void 0 && colSpan !== 1) json.colSpan = colSpan;
		const headerState = node.__headerState;
		if (headerState !== void 0 && headerState !== 0) json.headerState = headerState;
		const rowSpan = node.__rowSpan;
		if (rowSpan !== void 0 && rowSpan !== 1) json.rowSpan = rowSpan;
		const verticalAlign = node.getSerializedVerticalAlign();
		if (verticalAlign !== void 0) json.verticalAlign = verticalAlign;
		const width = node.__width;
		if (width !== void 0) json.width = width;
		const direction = node.__dir;
		if (direction != null) json.direction = direction;
		const format = TABLECELL_FORMAT_GETTER[node.__format];
		if (format !== void 0 && format !== "") json.format = format;
		const indent = node.__indent;
		if (indent !== void 0 && indent !== 0) json.indent = indent;
		if (textFormat !== void 0 && textFormat !== 0 && shouldSerializeTextStyles) json.textFormat = textFormat;
		if (textStyle !== void 0 && textStyle !== "" && shouldSerializeTextStyles) json.textStyle = textStyle;
		return json;
	}
	/** Generated from TableCellNode's serialization schema. Do not edit by hand. */
	function updateTableCellNode(node, json) {
		const direction = json.direction;
		node.__dir = direction === null || direction === "ltr" || direction === "rtl" ? direction : null;
		const format = json.format;
		node.__format = typeof format === "string" && format in TABLECELL_FORMAT_SETTER ? TABLECELL_FORMAT_SETTER[format] : TABLECELL_FORMAT_SETTER_DEFAULT;
		node.__indent = numC(json.indent, 0, 0, Infinity, true);
		node.__textFormat = num(json.textFormat, 0);
		const textStyle = json.textStyle;
		node.__textStyle = typeof textStyle === "string" ? textStyle : "";
		const backgroundColor = json.backgroundColor;
		node.__backgroundColor = typeof backgroundColor === "string" && backgroundColor !== "" ? backgroundColor : null;
		node.__colSpan = numC(json.colSpan, 1, 1, Infinity, true);
		node.setHeaderStyles(num(json.headerState, 0));
		node.__rowSpan = numC(json.rowSpan, 1, 1, Infinity, true);
		const verticalAlign = json.verticalAlign;
		node.__verticalAlign = verticalAlign === "middle" || verticalAlign === "bottom" ? verticalAlign : void 0;
		const width = json.width;
		node.__width = width === void 0 || num(width, 0) === 0 ? void 0 : num(width, 0);
		return node;
	}
	return {
		exportJSON: exportTableCellNode,
		exportCompactJSON: exportCompactTableCellNode,
		updateFromJSON: updateTableCellNode,
		afterCloneFrom: afterCloneTableCellNode
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableCellNode.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var NO_STATUS = 0;
var TableCellHeaderStates = {
	BOTH: 3,
	COLUMN: 2,
	NO_STATUS,
	ROW: 1
};
var tableCellNodeSchema = nodeSchema()({
	backgroundColor: withField(nullable(stringValue(), { defaultAsNull: true }), { field: "__backgroundColor" }),
	colSpan: withField(numberValue(1, {
		integer: true,
		min: 1
	}), { field: "__colSpan" }),
	headerState: withAccessors(numberValue(NO_STATUS), {
		getter: {
			field: "__headerState",
			method: "getHeaderStyles"
		},
		setter: "setHeaderStyles"
	}),
	rowSpan: withField(numberValue(1, {
		integer: true,
		min: 1
	}), { field: "__rowSpan" }),
	verticalAlign: withAccessors(enumValue([
		void 0,
		"middle",
		"bottom"
	]), {
		getter: "getSerializedVerticalAlign",
		setter: { field: "__verticalAlign" }
	}),
	width: withField(optional(numberValue(), { omitDefault: true }), { field: "__width" })
});
/** @noInheritDoc */
var TableCellNode = class extends ElementNode {
	/** @internal */
	__colSpan;
	/** @internal */
	__rowSpan;
	/** @internal */
	__headerState;
	/** @internal */
	__width;
	/** @internal */
	__backgroundColor;
	/** @internal */
	__verticalAlign;
	$config() {
		return this.config("tablecell", {
			extends: ElementNode,
			generated: GENERATED_TABLECELL,
			importDOM: {
				td: () => ({
					conversion: $convertTableCellNodeElement,
					priority: 0
				}),
				th: () => ({
					conversion: $convertTableCellNodeElement,
					priority: 0
				})
			},
			json: tableCellNodeSchema
		});
	}
	constructor(headerState = TableCellHeaderStates.NO_STATUS, colSpan = 1, width, key) {
		super(key);
		this.__colSpan = colSpan;
		this.__rowSpan = 1;
		this.__headerState = headerState;
		this.__width = width;
		this.__backgroundColor = null;
		this.__verticalAlign = void 0;
	}
	createDOM(config) {
		const element = $getDocument().createElement(this.getTag());
		if (this.__width) element.style.width = `${this.__width}px`;
		if (this.__colSpan > 1) element.colSpan = this.__colSpan;
		if (this.__rowSpan > 1) element.rowSpan = this.__rowSpan;
		if (this.__backgroundColor !== null) element.style.backgroundColor = this.__backgroundColor;
		if (isValidVerticalAlign$1(this.__verticalAlign)) element.style.verticalAlign = this.__verticalAlign;
		addClassNamesToElement(element, config.theme.tableCell, this.hasHeader() && config.theme.tableCellHeader);
		return element;
	}
	exportDOM(editor) {
		const output = super.exportDOM(editor);
		if (isHTMLElement(output.element)) {
			const element = output.element;
			element.setAttribute("data-temporary-table-cell-lexical-key", this.getKey());
			element.style.border = "1px solid black";
			if (this.__colSpan > 1) element.colSpan = this.__colSpan;
			if (this.__rowSpan > 1) element.rowSpan = this.__rowSpan;
			element.style.width = `${this.getWidth() || 75}px`;
			element.style.verticalAlign = this.getVerticalAlign() || "top";
			element.style.textAlign = "start";
			if (this.__backgroundColor === null && this.hasHeader()) element.style.backgroundColor = "#f2f3f5";
		}
		return output;
	}
	getColSpan() {
		return this.getLatest().__colSpan;
	}
	setColSpan(colSpan) {
		const self = this.getWritable();
		self.__colSpan = colSpan;
		return self;
	}
	getRowSpan() {
		return this.getLatest().__rowSpan;
	}
	setRowSpan(rowSpan) {
		const self = this.getWritable();
		self.__rowSpan = rowSpan;
		return self;
	}
	getTag() {
		return this.hasHeader() ? "th" : "td";
	}
	setHeaderStyles(headerState, mask = TableCellHeaderStates.BOTH) {
		const self = this.getWritable();
		self.__headerState = headerState & mask | self.__headerState & ~mask;
		return self;
	}
	getHeaderStyles() {
		return this.getLatest().__headerState;
	}
	setWidth(width) {
		const self = this.getWritable();
		self.__width = width;
		return self;
	}
	getWidth() {
		return this.getLatest().__width;
	}
	/** @internal Serialized `verticalAlign`, or undefined to omit it. */
	getSerializedVerticalAlign() {
		const verticalAlign = this.getLatest().__verticalAlign;
		return isValidVerticalAlign$1(verticalAlign) ? verticalAlign : void 0;
	}
	getBackgroundColor() {
		return this.getLatest().__backgroundColor;
	}
	setBackgroundColor(newBackgroundColor) {
		const self = this.getWritable();
		self.__backgroundColor = newBackgroundColor;
		return self;
	}
	getVerticalAlign() {
		return this.getLatest().__verticalAlign;
	}
	setVerticalAlign(newVerticalAlign) {
		const self = this.getWritable();
		self.__verticalAlign = newVerticalAlign || void 0;
		return self;
	}
	toggleHeaderStyle(headerStateToToggle) {
		const self = this.getWritable();
		if ((self.__headerState & headerStateToToggle) === headerStateToToggle) self.__headerState &= ~headerStateToToggle;
		else self.__headerState |= headerStateToToggle;
		return self;
	}
	hasHeaderState(headerState) {
		return (this.getHeaderStyles() & headerState) === headerState;
	}
	hasHeader() {
		return this.getLatest().__headerState !== TableCellHeaderStates.NO_STATUS;
	}
	updateDOM(prevNode) {
		return prevNode.__headerState !== this.__headerState || prevNode.__width !== this.__width || prevNode.__colSpan !== this.__colSpan || prevNode.__rowSpan !== this.__rowSpan || prevNode.__backgroundColor !== this.__backgroundColor || prevNode.__verticalAlign !== this.__verticalAlign;
	}
	isShadowRoot() {
		return true;
	}
	collapseAtStart() {
		return true;
	}
	canBeEmpty() {
		return false;
	}
	canIndent() {
		return false;
	}
};
function isValidVerticalAlign$1(verticalAlign) {
	return verticalAlign === "middle" || verticalAlign === "bottom";
}
function $convertTableCellNodeElement(domNode) {
	const domNode_ = domNode;
	const nodeName = domNode.nodeName.toLowerCase();
	let width = void 0;
	if (PIXEL_VALUE_REG_EXP.test(domNode_.style.width)) width = parseFloat(domNode_.style.width);
	let headerState = TableCellHeaderStates.NO_STATUS;
	if (nodeName === "th") {
		const scope = domNode_.getAttribute("scope");
		if (scope === "col") headerState = TableCellHeaderStates.COLUMN;
		else if (scope === "row") headerState = TableCellHeaderStates.ROW;
		else {
			const parentRow = domNode_.parentElement;
			const isInHeaderRow = isHTMLElement(parentRow) && parentRow.nodeName.toLowerCase() === "tr" && isHTMLElement(parentRow.parentElement) && (parentRow.parentElement.nodeName.toLowerCase() === "thead" || parentRow.rowIndex === 0);
			const isFirstColumn = domNode_.cellIndex === 0;
			if (isInHeaderRow) headerState |= TableCellHeaderStates.ROW;
			if (isFirstColumn) headerState |= TableCellHeaderStates.COLUMN;
			if (headerState === TableCellHeaderStates.NO_STATUS) headerState = TableCellHeaderStates.ROW;
		}
	}
	const tableCellNode = $createTableCellNode(headerState, domNode_.colSpan, width);
	tableCellNode.__rowSpan = domNode_.rowSpan;
	const backgroundColor = domNode_.style.backgroundColor;
	if (backgroundColor !== "") tableCellNode.__backgroundColor = backgroundColor;
	const verticalAlign = domNode_.style.verticalAlign;
	if (isValidVerticalAlign$1(verticalAlign)) tableCellNode.__verticalAlign = verticalAlign;
	$setDirectionFromDOM(tableCellNode, domNode_);
	const style = domNode_.style;
	const textDecoration = (style && style.textDecoration || "").split(" ");
	const hasBoldFontWeight = style.fontWeight === "700" || style.fontWeight === "bold";
	const hasLinethroughTextDecoration = textDecoration.includes("line-through");
	const hasItalicFontStyle = style.fontStyle === "italic";
	const hasUnderlineTextDecoration = textDecoration.includes("underline");
	const color = style.color;
	return {
		after: (childLexicalNodes) => {
			const result = [];
			let paragraphNode = null;
			const removeSingleLineBreakNode = () => {
				if (paragraphNode) {
					const firstChild = paragraphNode.getFirstChild();
					if ($isLineBreakNode(firstChild) && paragraphNode.getChildrenSize() === 1) firstChild.remove();
				}
			};
			for (const child of childLexicalNodes) if ($isInlineElementOrDecoratorNode(child) || $isTextNode(child) || $isLineBreakNode(child)) {
				if ($isTextNode(child)) {
					if (hasBoldFontWeight) child.toggleFormat("bold");
					if (hasLinethroughTextDecoration) child.toggleFormat("strikethrough");
					if (hasItalicFontStyle) child.toggleFormat("italic");
					if (hasUnderlineTextDecoration) child.toggleFormat("underline");
					if (color) {
						const existingStyle = child.getStyle();
						if (!existingStyle.includes("color:")) child.setStyle(existingStyle + `color: ${color};`);
					}
				}
				if (paragraphNode) paragraphNode.append(child);
				else {
					paragraphNode = $createParagraphNode().append(child);
					result.push(paragraphNode);
				}
			} else {
				result.push(child);
				removeSingleLineBreakNode();
				paragraphNode = null;
			}
			removeSingleLineBreakNode();
			if (result.length === 0) result.push($createParagraphNode());
			return result;
		},
		node: tableCellNode
	};
}
function $createTableCellNode(headerState = TableCellHeaderStates.NO_STATUS, colSpan = 1, width) {
	return $applyNodeReplacement(new TableCellNode(headerState, colSpan, width));
}
function $isTableCellNode(node) {
	return node instanceof TableCellNode;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableCommands.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var INSERT_TABLE_COMMAND = createCommand("INSERT_TABLE_COMMAND");
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableRowNode.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var tableRowNodeSchema = nodeSchema()({ height: withField(optional(numberValue()), { field: "__height" }) });
/** @noInheritDoc */
var TableRowNode = class extends ElementNode {
	/** @internal */
	__height;
	$config() {
		return this.config("tablerow", {
			extends: ElementNode,
			generated: GENERATED_TABLEROW,
			importDOM: { tr: () => ({
				conversion: $convertTableRowElement,
				priority: 0
			}) },
			json: tableRowNodeSchema
		});
	}
	constructor(height = void 0, key) {
		super(key);
		this.__height = height;
	}
	createDOM(config) {
		const element = $getDocument().createElement("tr");
		if (this.__height) element.style.height = `${this.__height}px`;
		addClassNamesToElement(element, config.theme.tableRow);
		return element;
	}
	extractWithChild(child, selection, destination) {
		return destination === "html";
	}
	isShadowRoot() {
		return true;
	}
	setHeight(height) {
		const self = this.getWritable();
		self.__height = height;
		return self;
	}
	getHeight() {
		return this.getLatest().__height;
	}
	updateDOM(prevNode) {
		return prevNode.__height !== this.__height;
	}
	canBeEmpty() {
		return false;
	}
	canIndent() {
		return false;
	}
};
function $convertTableRowElement(domNode) {
	const domNode_ = domNode;
	let height = void 0;
	if (PIXEL_VALUE_REG_EXP.test(domNode_.style.height)) height = parseFloat(domNode_.style.height);
	return {
		after: (children) => $descendantsMatching(children, $isTableCellNode),
		node: $setDirectionFromDOM($createTableRowNode(height), domNode_)
	};
}
function $createTableRowNode(height) {
	return $applyNodeReplacement(new TableRowNode(height));
}
function $isTableRowNode(node) {
	return node instanceof TableRowNode;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableUtils.ts
function $createTableNodeWithDimensions(rowCount, columnCount, includeHeaders = true) {
	const tableNode = $createTableNode();
	for (let iRow = 0; iRow < rowCount; iRow++) {
		const tableRowNode = $createTableRowNode();
		for (let iColumn = 0; iColumn < columnCount; iColumn++) {
			let headerState = TableCellHeaderStates.NO_STATUS;
			if (typeof includeHeaders === "object") {
				if (iRow === 0 && includeHeaders.rows) headerState |= TableCellHeaderStates.ROW;
				if (iColumn === 0 && includeHeaders.columns) headerState |= TableCellHeaderStates.COLUMN;
			} else if (includeHeaders) {
				if (iRow === 0) headerState |= TableCellHeaderStates.ROW;
				if (iColumn === 0) headerState |= TableCellHeaderStates.COLUMN;
			}
			const tableCellNode = $createTableCellNode(headerState);
			const paragraphNode = $createParagraphNode();
			paragraphNode.append($createTextNode());
			tableCellNode.append(paragraphNode);
			tableRowNode.append(tableCellNode);
		}
		tableNode.append(tableRowNode);
	}
	return tableNode;
}
function $getTableCellNodeFromLexicalNode(startingNode) {
	const node = $findMatchingParent(startingNode, (n) => $isTableCellNode(n));
	if ($isTableCellNode(node)) return node;
	return null;
}
function $getTableRowNodeFromTableCellNodeOrThrow(startingNode) {
	const node = $findMatchingParent(startingNode, (n) => $isTableRowNode(n));
	if ($isTableRowNode(node)) return node;
	throw new Error("Expected table cell to be inside of table row.");
}
function $getTableNodeFromLexicalNodeOrThrow(startingNode) {
	const node = $findMatchingParent(startingNode, (n) => $isTableNode(n));
	if ($isTableNode(node)) return node;
	throw new Error("Expected table cell to be inside of table.");
}
function $getTableRowIndexFromTableCellNode(tableCellNode) {
	const tableRowNode = $getTableRowNodeFromTableCellNodeOrThrow(tableCellNode);
	return $getTableNodeFromLexicalNodeOrThrow(tableRowNode).getChildren().findIndex((n) => n.is(tableRowNode));
}
function $getTableColumnIndexFromTableCellNode(tableCellNode) {
	return $getTableRowNodeFromTableCellNodeOrThrow(tableCellNode).getChildren().findIndex((n) => n.is(tableCellNode));
}
function $getTableCellSiblingsFromTableCellNode(tableCellNode, table) {
	const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
	const { x, y } = tableNode.getCordsFromCellNode(tableCellNode, table);
	return {
		above: tableNode.getCellNodeFromCords(x, y - 1, table),
		below: tableNode.getCellNodeFromCords(x, y + 1, table),
		left: tableNode.getCellNodeFromCords(x - 1, y, table),
		right: tableNode.getCellNodeFromCords(x + 1, y, table)
	};
}
function $removeTableRowAtIndex(tableNode, indexToDelete) {
	const tableRows = tableNode.getChildren();
	if (indexToDelete >= tableRows.length || indexToDelete < 0) throw new Error("Expected table cell to be inside of table row.");
	tableRows[indexToDelete].remove();
	return tableNode;
}
/**
* @deprecated This function does not support merged cells. Use {@link $insertTableRowAtSelection} or {@link $insertTableRowAtNode} instead.
*/
function $insertTableRow(tableNode, targetIndex, shouldInsertAfter = true, rowCount, table) {
	const tableRows = tableNode.getChildren();
	if (targetIndex >= tableRows.length || targetIndex < 0) throw new Error("Table row target index out of range");
	const targetRowNode = tableRows[targetIndex];
	if ($isTableRowNode(targetRowNode)) for (let r = 0; r < rowCount; r++) {
		const tableRowCells = targetRowNode.getChildren();
		const tableColumnCount = tableRowCells.length;
		const newTableRowNode = $createTableRowNode();
		for (let c = 0; c < tableColumnCount; c++) {
			const tableCellFromTargetRow = tableRowCells[c];
			invariant($isTableCellNode(tableCellFromTargetRow), "Expected table cell");
			const { above, below } = $getTableCellSiblingsFromTableCellNode(tableCellFromTargetRow, table);
			let headerState = TableCellHeaderStates.NO_STATUS;
			const width = above && above.getWidth() || below && below.getWidth() || void 0;
			if (above && above.hasHeaderState(TableCellHeaderStates.COLUMN) || below && below.hasHeaderState(TableCellHeaderStates.COLUMN)) headerState |= TableCellHeaderStates.COLUMN;
			const tableCellNode = $createTableCellNode(headerState, 1, width);
			tableCellNode.append($createParagraphNode());
			newTableRowNode.append(tableCellNode);
		}
		if (shouldInsertAfter) targetRowNode.insertAfter(newTableRowNode);
		else targetRowNode.insertBefore(newTableRowNode);
	}
	else throw new Error("Row before insertion index does not exist.");
	return tableNode;
}
var getHeaderState = (currentState, possibleState) => {
	if (currentState === TableCellHeaderStates.BOTH || currentState === possibleState) return possibleState;
	return TableCellHeaderStates.NO_STATUS;
};
/**
* Inserts a table row before or after the current focus cell node,
* taking into account any spans. If successful, returns the
* inserted table row node.
*/
function $insertTableRowAtSelection(insertAfter = true) {
	const selection = $getSelection();
	invariant($isRangeSelection(selection) || $isTableSelection(selection), "Expected a RangeSelection or TableSelection");
	const anchor = selection.anchor.getNode();
	const focus = selection.focus.getNode();
	const [anchorCell] = $getNodeTriplet(anchor);
	const [focusCell, , grid] = $getNodeTriplet(focus);
	const [, focusCellMap, anchorCellMap] = $computeTableMap(grid, focusCell, anchorCell);
	const { startRow: anchorStartRow } = anchorCellMap;
	const { startRow: focusStartRow } = focusCellMap;
	if (insertAfter) return $insertTableRowAtNode(anchorStartRow + anchorCell.__rowSpan > focusStartRow + focusCell.__rowSpan ? anchorCell : focusCell, true);
	else return $insertTableRowAtNode(focusStartRow < anchorStartRow ? focusCell : anchorCell, false);
}
/**
* @deprecated renamed to {@link $insertTableRowAtSelection}
*/
var $insertTableRow__EXPERIMENTAL = $insertTableRowAtSelection;
/**
* Inserts a table row before or after the given cell node,
* taking into account any spans. If successful, returns the
* inserted table row node.
*/
function $insertTableRowAtNode(cellNode, insertAfter = true) {
	const [, , grid] = $getNodeTriplet(cellNode);
	const [gridMap, cellMap] = $computeTableMap(grid, cellNode, cellNode);
	const columnCount = gridMap[0].length;
	const { startRow: cellStartRow } = cellMap;
	let insertedRow = null;
	if (insertAfter) {
		const insertAfterEndRow = cellStartRow + cellNode.__rowSpan - 1;
		const insertAfterEndRowMap = gridMap[insertAfterEndRow];
		const newRow = $createTableRowNode();
		for (let i = 0; i < columnCount; i++) {
			const { cell, startRow } = insertAfterEndRowMap[i];
			if (startRow + cell.__rowSpan - 1 <= insertAfterEndRow) {
				const currentCellHeaderState = insertAfterEndRowMap[i].cell.__headerState;
				const headerState = getHeaderState(currentCellHeaderState, TableCellHeaderStates.COLUMN);
				newRow.append($createTableCellNode(headerState).append($createParagraphNode()));
			} else cell.setRowSpan(cell.__rowSpan + 1);
		}
		const insertAfterEndRowNode = grid.getChildAtIndex(insertAfterEndRow);
		invariant($isTableRowNode(insertAfterEndRowNode), "insertAfterEndRow is not a TableRowNode");
		insertAfterEndRowNode.insertAfter(newRow);
		insertedRow = newRow;
	} else {
		const insertBeforeStartRow = cellStartRow;
		const insertBeforeStartRowMap = gridMap[insertBeforeStartRow];
		const newRow = $createTableRowNode();
		for (let i = 0; i < columnCount; i++) {
			const { cell, startRow } = insertBeforeStartRowMap[i];
			if (startRow === insertBeforeStartRow) {
				const currentCellHeaderState = insertBeforeStartRowMap[i].cell.__headerState;
				const headerState = getHeaderState(currentCellHeaderState, TableCellHeaderStates.COLUMN);
				newRow.append($createTableCellNode(headerState).append($createParagraphNode()));
			} else cell.setRowSpan(cell.__rowSpan + 1);
		}
		const insertBeforeStartRowNode = grid.getChildAtIndex(insertBeforeStartRow);
		invariant($isTableRowNode(insertBeforeStartRowNode), "insertBeforeStartRow is not a TableRowNode");
		insertBeforeStartRowNode.insertBefore(newRow);
		insertedRow = newRow;
	}
	return insertedRow;
}
/**
* @deprecated This function does not support merged cells. Use {@link $insertTableColumnAtSelection} or {@link $insertTableColumnAtNode} instead.
*/
function $insertTableColumn(tableNode, targetIndex, shouldInsertAfter = true, columnCount, table) {
	const tableRows = tableNode.getChildren();
	const tableCellsToBeInserted = [];
	for (let r = 0; r < tableRows.length; r++) {
		const currentTableRowNode = tableRows[r];
		if ($isTableRowNode(currentTableRowNode)) for (let c = 0; c < columnCount; c++) {
			const tableRowChildren = currentTableRowNode.getChildren();
			if (targetIndex >= tableRowChildren.length || targetIndex < 0) throw new Error("Table column target index out of range");
			const targetCell = tableRowChildren[targetIndex];
			invariant($isTableCellNode(targetCell), "Expected table cell");
			const { left, right } = $getTableCellSiblingsFromTableCellNode(targetCell, table);
			let headerState = TableCellHeaderStates.NO_STATUS;
			if (left && left.hasHeaderState(TableCellHeaderStates.ROW) || right && right.hasHeaderState(TableCellHeaderStates.ROW)) headerState |= TableCellHeaderStates.ROW;
			const newTableCell = $createTableCellNode(headerState);
			newTableCell.append($createParagraphNode());
			tableCellsToBeInserted.push({
				newTableCell,
				targetCell
			});
		}
	}
	tableCellsToBeInserted.forEach(({ newTableCell, targetCell }) => {
		if (shouldInsertAfter) targetCell.insertAfter(newTableCell);
		else targetCell.insertBefore(newTableCell);
	});
	return tableNode;
}
/**
* Inserts a column before or after the current focus cell node,
* taking into account any spans. If successful, returns the
* first inserted cell node.
*/
function $insertTableColumnAtSelection(insertAfter = true) {
	const selection = $getSelection();
	invariant($isRangeSelection(selection) || $isTableSelection(selection), "Expected a RangeSelection or TableSelection");
	const anchor = selection.anchor.getNode();
	const focus = selection.focus.getNode();
	const [anchorCell] = $getNodeTriplet(anchor);
	const [focusCell, , grid] = $getNodeTriplet(focus);
	const [, focusCellMap, anchorCellMap] = $computeTableMap(grid, focusCell, anchorCell);
	const { startColumn: anchorStartColumn } = anchorCellMap;
	const { startColumn: focusStartColumn } = focusCellMap;
	if (insertAfter) return $insertTableColumnAtNode(anchorStartColumn + anchorCell.__colSpan > focusStartColumn + focusCell.__colSpan ? anchorCell : focusCell, true);
	else return $insertTableColumnAtNode(focusStartColumn < anchorStartColumn ? focusCell : anchorCell, false);
}
/**
* @deprecated renamed to {@link $insertTableColumnAtSelection}
*/
var $insertTableColumn__EXPERIMENTAL = $insertTableColumnAtSelection;
/**
* Inserts a column before or after the given cell node,
* taking into account any spans. If successful, returns the
* first inserted cell node.
*/
function $insertTableColumnAtNode(cellNode, insertAfter = true, shouldSetSelection = true) {
	const [, , grid] = $getNodeTriplet(cellNode);
	const [gridMap, cellMap] = $computeTableMap(grid, cellNode, cellNode);
	const rowCount = gridMap.length;
	const { startColumn } = cellMap;
	const insertAfterColumn = insertAfter ? startColumn + cellNode.__colSpan - 1 : startColumn - 1;
	const gridFirstChild = grid.getFirstChild();
	invariant($isTableRowNode(gridFirstChild), "Expected firstTable child to be a row");
	let firstInsertedCell = null;
	function $createTableCellNodeForInsertTableColumn(headerState = TableCellHeaderStates.NO_STATUS) {
		const cell = $createTableCellNode(headerState).append($createParagraphNode());
		if (firstInsertedCell === null) firstInsertedCell = cell;
		return cell;
	}
	let loopRow = gridFirstChild;
	for (let i = 0; i < rowCount; i++) {
		if (i !== 0) {
			const currentRow = loopRow.getNextSibling();
			invariant($isTableRowNode(currentRow), "Expected row nextSibling to be a row");
			loopRow = currentRow;
		}
		const rowMap = gridMap[i];
		const currentCellHeaderState = rowMap[insertAfterColumn < 0 ? 0 : insertAfterColumn].cell.__headerState;
		const headerState = getHeaderState(currentCellHeaderState, TableCellHeaderStates.ROW);
		if (insertAfterColumn < 0) {
			$insertFirst(loopRow, $createTableCellNodeForInsertTableColumn(headerState));
			continue;
		}
		const { cell: currentCell, startColumn: currentStartColumn } = rowMap[insertAfterColumn];
		if (currentStartColumn + currentCell.__colSpan - 1 <= insertAfterColumn) {
			let insertAfterCell = null;
			for (let column = 0; column <= insertAfterColumn; column++) {
				const currentCellMap = rowMap[column];
				if (currentCellMap.startRow === i) insertAfterCell = currentCellMap.cell;
				if (currentCellMap.cell.__colSpan > 1) column += currentCellMap.cell.__colSpan - 1;
			}
			if (insertAfterCell === null) $insertFirst(loopRow, $createTableCellNodeForInsertTableColumn(headerState));
			else insertAfterCell.insertAfter($createTableCellNodeForInsertTableColumn(headerState));
		} else currentCell.setColSpan(currentCell.__colSpan + 1);
	}
	if (firstInsertedCell !== null && shouldSetSelection) $moveSelectionToCell(firstInsertedCell);
	const colWidths = grid.getColWidths();
	if (colWidths) {
		const newColWidths = [...colWidths];
		const columnIndex = insertAfterColumn < 0 ? 0 : insertAfterColumn;
		const newWidth = newColWidths[columnIndex];
		newColWidths.splice(columnIndex, 0, newWidth);
		grid.setColWidths(newColWidths);
	}
	return firstInsertedCell;
}
/**
* @deprecated This function does not support merged cells. Use {@link $deleteTableColumnAtSelection} instead.
*/
function $deleteTableColumn(tableNode, targetIndex) {
	const tableRows = tableNode.getChildren();
	for (let i = 0; i < tableRows.length; i++) {
		const currentTableRowNode = tableRows[i];
		if ($isTableRowNode(currentTableRowNode)) {
			const tableRowChildren = currentTableRowNode.getChildren();
			if (targetIndex >= tableRowChildren.length || targetIndex < 0) throw new Error("Table column target index out of range");
			tableRowChildren[targetIndex].remove();
		}
	}
	return tableNode;
}
function $deleteTableRowAtSelection() {
	const selection = $getSelection();
	invariant($isRangeSelection(selection) || $isTableSelection(selection), "Expected a RangeSelection or TableSelection");
	const [anchor, focus] = selection.isBackward() ? [selection.focus.getNode(), selection.anchor.getNode()] : [selection.anchor.getNode(), selection.focus.getNode()];
	const [anchorCell, , grid] = $getNodeTriplet(anchor);
	const [focusCell] = $getNodeTriplet(focus);
	const [gridMap, anchorCellMap, focusCellMap] = $computeTableMap(grid, anchorCell, focusCell);
	const { startRow: anchorStartRow } = anchorCellMap;
	const { startRow: focusStartRow } = focusCellMap;
	const focusEndRow = focusStartRow + focusCell.__rowSpan - 1;
	if (gridMap.length === focusEndRow - anchorStartRow + 1) {
		grid.selectPrevious();
		grid.remove();
		return;
	}
	const columnCount = gridMap[0].length;
	const nextRow = gridMap[focusEndRow + 1];
	const nextRowNode = grid.getChildAtIndex(focusEndRow + 1);
	for (let row = focusEndRow; row >= anchorStartRow; row--) {
		for (let column = columnCount - 1; column >= 0; column--) {
			const { cell, startRow: cellStartRow, startColumn: cellStartColumn } = gridMap[row][column];
			if (cellStartColumn !== column) continue;
			if (cellStartRow < anchorStartRow || cellStartRow + cell.__rowSpan - 1 > focusEndRow) {
				const intersectionStart = Math.max(cellStartRow, anchorStartRow);
				const intersectionEnd = Math.min(cell.__rowSpan + cellStartRow - 1, focusEndRow);
				const overflowRowsCount = intersectionStart <= intersectionEnd ? intersectionEnd - intersectionStart + 1 : 0;
				cell.setRowSpan(cell.__rowSpan - overflowRowsCount);
			}
			if (cellStartRow >= anchorStartRow && cellStartRow + cell.__rowSpan - 1 > focusEndRow && row === focusEndRow) {
				invariant($isTableRowNode(nextRowNode), "Expected a TableRowNode");
				let insertAfterCell = null;
				for (let columnIndex = 0; columnIndex < column; columnIndex++) {
					const currentCellMap = nextRow[columnIndex];
					const currentCell = currentCellMap.cell;
					if (currentCellMap.startRow === row + 1) insertAfterCell = currentCell;
					if (currentCell.__colSpan > 1) columnIndex += currentCell.__colSpan - 1;
				}
				if (insertAfterCell === null) $insertFirst(nextRowNode, cell);
				else insertAfterCell.insertAfter(cell);
			}
		}
		const rowNode = grid.getChildAtIndex(row);
		invariant($isTableRowNode(rowNode), "Expected TableNode childAtIndex(%s) to be RowNode", String(row));
		rowNode.remove();
	}
	if (nextRow !== void 0) {
		const { cell } = nextRow[0];
		$moveSelectionToCell(cell);
	} else {
		const { cell } = gridMap[anchorStartRow - 1][0];
		$moveSelectionToCell(cell);
	}
}
/**
* @deprecated renamed to {@link $deleteTableRowAtSelection}
*/
var $deleteTableRow__EXPERIMENTAL = $deleteTableRowAtSelection;
function $deleteTableColumnAtSelection() {
	const selection = $getSelection();
	invariant($isRangeSelection(selection) || $isTableSelection(selection), "Expected a RangeSelection or TableSelection");
	const anchor = selection.anchor.getNode();
	const focus = selection.focus.getNode();
	const [anchorCell, , grid] = $getNodeTriplet(anchor);
	const [focusCell] = $getNodeTriplet(focus);
	const [gridMap, anchorCellMap, focusCellMap] = $computeTableMap(grid, anchorCell, focusCell);
	const { startColumn: anchorStartColumn } = anchorCellMap;
	const { startRow: focusStartRow, startColumn: focusStartColumn } = focusCellMap;
	const startColumn = Math.min(anchorStartColumn, focusStartColumn);
	const endColumn = Math.max(anchorStartColumn + anchorCell.__colSpan - 1, focusStartColumn + focusCell.__colSpan - 1);
	const selectedColumnCount = endColumn - startColumn + 1;
	if (gridMap[0].length === endColumn - startColumn + 1) {
		grid.selectPrevious();
		grid.remove();
		return;
	}
	const rowCount = gridMap.length;
	for (let row = 0; row < rowCount; row++) for (let column = startColumn; column <= endColumn; column++) {
		const { cell, startColumn: cellStartColumn } = gridMap[row][column];
		if (cellStartColumn < startColumn) {
			if (column === startColumn) {
				const overflowLeft = startColumn - cellStartColumn;
				cell.setColSpan(cell.__colSpan - Math.min(selectedColumnCount, cell.__colSpan - overflowLeft));
			}
		} else if (cellStartColumn + cell.__colSpan - 1 > endColumn) {
			if (column === endColumn) {
				const inSelectedArea = endColumn - cellStartColumn + 1;
				cell.setColSpan(cell.__colSpan - inSelectedArea);
			}
		} else cell.remove();
	}
	const focusRowMap = gridMap[focusStartRow];
	const nextColumn = anchorStartColumn > focusStartColumn ? focusRowMap[anchorStartColumn + anchorCell.__colSpan] : focusRowMap[focusStartColumn + focusCell.__colSpan];
	if (nextColumn !== void 0) {
		const { cell } = nextColumn;
		$moveSelectionToCell(cell);
	} else {
		const { cell } = focusStartColumn < anchorStartColumn ? focusRowMap[focusStartColumn - 1] : focusRowMap[anchorStartColumn - 1];
		$moveSelectionToCell(cell);
	}
	const colWidths = grid.getColWidths();
	if (colWidths) {
		const newColWidths = [...colWidths];
		newColWidths.splice(startColumn, selectedColumnCount);
		grid.setColWidths(newColWidths);
	}
}
/**
* @deprecated renamed to {@link $deleteTableColumnAtSelection}
*/
var $deleteTableColumn__EXPERIMENTAL = $deleteTableColumnAtSelection;
function $moveSelectionToCell(cell) {
	const firstDescendant = cell.getFirstDescendant();
	if (firstDescendant == null) cell.selectStart();
	else firstDescendant.getParentOrThrow().selectStart();
}
function $insertFirst(parent, node) {
	const firstChild = parent.getFirstChild();
	if (firstChild !== null) firstChild.insertBefore(node);
	else parent.append(node);
}
function $mergeCells(cellNodes) {
	if (cellNodes.length === 0) return null;
	const [gridMap] = $computeTableMapSkipCellCheck($getTableNodeFromLexicalNodeOrThrow(cellNodes[0]), null, null);
	let minRow = Infinity;
	let maxRow = -Infinity;
	let minCol = Infinity;
	let maxCol = -Infinity;
	const processedCells = /* @__PURE__ */ new Set();
	for (const row of gridMap) for (const mapCell of row) {
		if (!mapCell || !mapCell.cell) continue;
		const cellKey = mapCell.cell.getKey();
		if (processedCells.has(cellKey)) continue;
		if (cellNodes.some((cell) => cell.is(mapCell.cell))) {
			processedCells.add(cellKey);
			const cellStartRow = mapCell.startRow;
			const cellStartCol = mapCell.startColumn;
			const cellRowSpan = mapCell.cell.__rowSpan || 1;
			const cellColSpan = mapCell.cell.__colSpan || 1;
			minRow = Math.min(minRow, cellStartRow);
			maxRow = Math.max(maxRow, cellStartRow + cellRowSpan - 1);
			minCol = Math.min(minCol, cellStartCol);
			maxCol = Math.max(maxCol, cellStartCol + cellColSpan - 1);
		}
	}
	if (minRow === Infinity || minCol === Infinity) return null;
	const totalRowSpan = maxRow - minRow + 1;
	const totalColSpan = maxCol - minCol + 1;
	const targetCellMap = gridMap[minRow][minCol];
	if (!targetCellMap.cell) return null;
	const targetCell = targetCellMap.cell;
	targetCell.setColSpan(totalColSpan);
	targetCell.setRowSpan(totalRowSpan);
	const seenCells = /* @__PURE__ */ new Set([targetCell.getKey()]);
	for (let row = minRow; row <= maxRow; row++) for (let col = minCol; col <= maxCol; col++) {
		const mapCell = gridMap[row][col];
		if (!mapCell.cell) continue;
		const currentCell = mapCell.cell;
		const key = currentCell.getKey();
		if (!seenCells.has(key)) {
			seenCells.add(key);
			if (!$cellContainsEmptyParagraph(currentCell)) {
				if ($cellContainsEmptyParagraph(targetCell)) targetCell.clear();
				targetCell.append(...currentCell.getChildren());
			}
			currentCell.remove();
		}
	}
	if (targetCell.getChildrenSize() === 0) targetCell.append($createParagraphNode());
	return targetCell;
}
function $cellContainsEmptyParagraph(cell) {
	if (cell.getChildrenSize() !== 1) return false;
	const firstChild = cell.getFirstChildOrThrow();
	if (!$isParagraphNode(firstChild) || !firstChild.isEmpty()) return false;
	return true;
}
function $unmergeCell() {
	const selection = $getSelection();
	invariant($isRangeSelection(selection) || $isTableSelection(selection), "Expected a RangeSelection or TableSelection");
	const anchor = selection.anchor.getNode();
	const cellNode = $findMatchingParent(anchor, $isTableCellNode);
	invariant($isTableCellNode(cellNode), "Expected to find a parent TableCellNode");
	return $unmergeCellNode(cellNode);
}
/**
* Unmerges the given cell, splitting it back into individual cells.
* Unlike {@link $unmergeCell}, this does not depend on the current
* selection. No-op if the cell is not merged.
*
* @param cellNode The merged cell to split.
*/
function $unmergeCellNode(cellNode) {
	const [cell, row, grid] = $getNodeTriplet(cellNode);
	const colSpan = cell.__colSpan;
	const rowSpan = cell.__rowSpan;
	if (colSpan === 1 && rowSpan === 1) return;
	const [map, cellMap] = $computeTableMap(grid, cell, cell);
	const { startColumn, startRow } = cellMap;
	const baseColStyle = cell.__headerState & TableCellHeaderStates.COLUMN;
	const colStyles = Array.from({ length: colSpan }, (_v, i) => {
		let colStyle = baseColStyle;
		for (let rowIdx = 0; colStyle !== 0 && rowIdx < map.length; rowIdx++) colStyle &= map[rowIdx][i + startColumn].cell.__headerState;
		return colStyle;
	});
	const baseRowStyle = cell.__headerState & TableCellHeaderStates.ROW;
	const rowStyles = Array.from({ length: rowSpan }, (_v, i) => {
		let rowStyle = baseRowStyle;
		for (let colIdx = 0; rowStyle !== 0 && colIdx < map[0].length; colIdx++) rowStyle &= map[i + startRow][colIdx].cell.__headerState;
		return rowStyle;
	});
	const $createSplitCell = (headerState) => $copyNode(cell).setColSpan(1).setRowSpan(1).setHeaderStyles(headerState).setWidth(void 0).append($createParagraphNode());
	if (colSpan > 1) {
		for (let i = 1; i < colSpan; i++) cell.insertAfter($createSplitCell(colStyles[i] | rowStyles[0]));
		cell.setColSpan(1);
	}
	if (rowSpan > 1) {
		let currentRowNode;
		for (let i = 1; i < rowSpan; i++) {
			const currentRow = startRow + i;
			const currentRowMap = map[currentRow];
			currentRowNode = (currentRowNode || row).getNextSibling();
			invariant($isTableRowNode(currentRowNode), "Expected row next sibling to be a row");
			let insertAfterCell = null;
			for (let column = 0; column < startColumn; column++) {
				const currentCellMap = currentRowMap[column];
				const currentCell = currentCellMap.cell;
				if (currentCellMap.startRow === currentRow) insertAfterCell = currentCell;
				if (currentCell.__colSpan > 1) column += currentCell.__colSpan - 1;
			}
			if (insertAfterCell === null) for (let j = colSpan - 1; j >= 0; j--) $insertFirst(currentRowNode, $createSplitCell(colStyles[j] | rowStyles[i]));
			else for (let j = colSpan - 1; j >= 0; j--) insertAfterCell.insertAfter($createSplitCell(colStyles[j] | rowStyles[i]));
		}
		cell.setRowSpan(1);
	}
}
function $computeTableMap(tableNode, cellA, cellB) {
	const [tableMap, cellAValue, cellBValue] = $computeTableMapSkipCellCheck(tableNode, cellA, cellB);
	invariant(cellAValue !== null, "Anchor not found in Table");
	invariant(cellBValue !== null, "Focus not found in Table");
	return [
		tableMap,
		cellAValue,
		cellBValue
	];
}
function $computeTableMapSkipCellCheck(tableNode, cellA, cellB) {
	const tableMap = [];
	let cellAValue = null;
	let cellBValue = null;
	function getMapRow(i) {
		let row = tableMap[i];
		if (row === void 0) tableMap[i] = row = [];
		return row;
	}
	const gridChildren = tableNode.getChildren();
	for (let rowIdx = 0; rowIdx < gridChildren.length; rowIdx++) {
		const row = gridChildren[rowIdx];
		invariant($isTableRowNode(row), "Expected TableNode children to be TableRowNode");
		const startMapRow = getMapRow(rowIdx);
		for (let cell = row.getFirstChild(), colIdx = 0; cell != null; cell = cell.getNextSibling()) {
			invariant($isTableCellNode(cell), "Expected TableRowNode children to be TableCellNode");
			while (startMapRow[colIdx] !== void 0) colIdx++;
			const value = {
				cell,
				startColumn: colIdx,
				startRow: rowIdx
			};
			const { __rowSpan: rowSpan, __colSpan: colSpan } = cell;
			for (let j = 0; j < rowSpan; j++) {
				if (rowIdx + j >= gridChildren.length) break;
				const mapRow = getMapRow(rowIdx + j);
				for (let i = 0; i < colSpan; i++) mapRow[colIdx + i] = value;
			}
			if (cellA !== null && cellAValue === null && cellA.is(cell)) cellAValue = value;
			if (cellB !== null && cellBValue === null && cellB.is(cell)) cellBValue = value;
		}
	}
	return [
		tableMap,
		cellAValue,
		cellBValue
	];
}
function $getNodeTriplet(source) {
	let cell;
	if (source instanceof TableCellNode) cell = source;
	else if ("__type" in source) {
		const cell_ = $findMatchingParent(source, $isTableCellNode);
		invariant($isTableCellNode(cell_), "Expected to find a parent TableCellNode");
		cell = cell_;
	} else {
		const cell_ = $findMatchingParent(source.getNode(), $isTableCellNode);
		invariant($isTableCellNode(cell_), "Expected to find a parent TableCellNode");
		cell = cell_;
	}
	const row = cell.getParent();
	invariant($isTableRowNode(row), "Expected TableCellNode to have a parent TableRowNode");
	const grid = row.getParent();
	invariant($isTableNode(grid), "Expected TableRowNode to have a parent TableNode");
	return [
		cell,
		row,
		grid
	];
}
function $computeTableCellRectSpans(map, boundary) {
	const { minColumn, maxColumn, minRow, maxRow } = boundary;
	let topSpan = 1;
	let leftSpan = 1;
	let rightSpan = 1;
	let bottomSpan = 1;
	const topRow = map[minRow];
	const bottomRow = map[maxRow];
	for (let col = minColumn; col <= maxColumn; col++) {
		topSpan = Math.max(topSpan, topRow[col].cell.__rowSpan);
		bottomSpan = Math.max(bottomSpan, bottomRow[col].cell.__rowSpan);
	}
	for (let row = minRow; row <= maxRow; row++) {
		leftSpan = Math.max(leftSpan, map[row][minColumn].cell.__colSpan);
		rightSpan = Math.max(rightSpan, map[row][maxColumn].cell.__colSpan);
	}
	return {
		bottomSpan,
		leftSpan,
		rightSpan,
		topSpan
	};
}
/**
* Compute the bounding rectangle of two table cells in a table map,
* expanding iteratively to include any merged cells that overlap the boundary.
*/
function $computeTableCellRectBoundary(map, cellAMap, cellBMap) {
	let minColumn = Math.min(cellAMap.startColumn, cellBMap.startColumn);
	let minRow = Math.min(cellAMap.startRow, cellBMap.startRow);
	let maxColumn = Math.max(cellAMap.startColumn + cellAMap.cell.__colSpan - 1, cellBMap.startColumn + cellBMap.cell.__colSpan - 1);
	let maxRow = Math.max(cellAMap.startRow + cellAMap.cell.__rowSpan - 1, cellBMap.startRow + cellBMap.cell.__rowSpan - 1);
	let hasChanges;
	do {
		hasChanges = false;
		for (let row = 0; row < map.length; row++) for (let col = 0; col < map[0].length; col++) {
			const cell = map[row][col];
			if (!cell) continue;
			const cellEndCol = cell.startColumn + cell.cell.__colSpan - 1;
			const cellEndRow = cell.startRow + cell.cell.__rowSpan - 1;
			const intersectsHorizontally = cell.startColumn <= maxColumn && cellEndCol >= minColumn;
			const intersectsVertically = cell.startRow <= maxRow && cellEndRow >= minRow;
			if (intersectsHorizontally && intersectsVertically) {
				const newMinColumn = Math.min(minColumn, cell.startColumn);
				const newMaxColumn = Math.max(maxColumn, cellEndCol);
				const newMinRow = Math.min(minRow, cell.startRow);
				const newMaxRow = Math.max(maxRow, cellEndRow);
				if (newMinColumn !== minColumn || newMaxColumn !== maxColumn || newMinRow !== minRow || newMaxRow !== maxRow) {
					minColumn = newMinColumn;
					maxColumn = newMaxColumn;
					minRow = newMinRow;
					maxRow = newMaxRow;
					hasChanges = true;
				}
			}
		}
	} while (hasChanges);
	return {
		maxColumn,
		maxRow,
		minColumn,
		minRow
	};
}
/**
* Checks if the table does not have any merged cells.
*
* @param table Table to check for if it has any merged cells.
* @returns True if the table does not have any merged cells, false otherwise.
*/
function $isSimpleTable(table) {
	const rows = table.getChildren();
	let columns = null;
	for (const row of rows) {
		if (!$isTableRowNode(row)) return false;
		if (columns === null) columns = row.getChildrenSize();
		if (row.getChildrenSize() !== columns) return false;
		const cells = row.getChildren();
		for (const cell of cells) if (!$isTableCellNode(cell) || cell.getRowSpan() !== 1 || cell.getColSpan() !== 1) return false;
	}
	return (columns || 0) > 0;
}
/**
* Moves a column from one position to another within a simple (non-merged) table.
*
* @param tableNode The table node to modify.
* @param originColumn The index of the column to move.
* @param targetColumn The index to move the column to.
*/
function $moveTableColumn(tableNode, originColumn, targetColumn) {
	if (originColumn === targetColumn) return;
	const columnCount = tableNode.getColumnCount();
	if (originColumn < 0 || originColumn >= columnCount || targetColumn < 0 || targetColumn >= columnCount) return;
	if (!$isSimpleTable(tableNode)) return;
	tableNode.getChildren().filter($isTableRowNode).forEach((row) => {
		const cells = row.getChildren();
		const [moved] = cells.splice(originColumn, 1);
		cells.splice(targetColumn, 0, moved);
		row.splice(0, cells.length, cells);
	});
	const colWidths = tableNode.getColWidths();
	if (colWidths && colWidths.length === columnCount) {
		const newWidths = [...colWidths];
		const [movedWidth] = newWidths.splice(originColumn, 1);
		newWidths.splice(targetColumn, 0, movedWidth);
		tableNode.setColWidths(newWidths);
	}
}
/**
* Moves a row from one position to another within a simple (non-merged) table.
*
* @param tableNode The table node to modify.
* @param originRow The index of the row to move.
* @param targetRow The index to move the row to.
*/
function $moveTableRow(tableNode, originRow, targetRow) {
	if (originRow === targetRow) return;
	const rows = tableNode.getChildren().filter($isTableRowNode);
	const rowCount = rows.length;
	if (originRow < 0 || originRow >= rowCount || targetRow < 0 || targetRow >= rowCount) return;
	if (!$isSimpleTable(tableNode)) return;
	const originRowNode = rows[originRow];
	const targetRowNode = rows[targetRow];
	if (targetRow > originRow) targetRowNode.insertAfter(originRowNode);
	else targetRowNode.insertBefore(originRowNode);
}
function $getTableCellNodeRect(tableCellNode) {
	const [cellNode, , gridNode] = $getNodeTriplet(tableCellNode);
	const rows = gridNode.getChildren().filter($isTableRowNode);
	const rowCount = rows.length;
	const columnCount = rows[0].getChildren().length;
	const cellMatrix = new Array(rowCount);
	for (let i = 0; i < rowCount; i++) cellMatrix[i] = new Array(columnCount);
	for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		const cells = rows[rowIndex].getChildren().filter($isTableCellNode);
		let columnIndex = 0;
		for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
			while (cellMatrix[rowIndex][columnIndex]) columnIndex++;
			const cell = cells[cellIndex];
			const rowSpan = cell.__rowSpan || 1;
			const colSpan = cell.__colSpan || 1;
			for (let i = 0; i < rowSpan; i++) for (let j = 0; j < colSpan; j++) cellMatrix[rowIndex + i][columnIndex + j] = cell;
			if (cellNode === cell) return {
				colSpan,
				columnIndex,
				rowIndex,
				rowSpan
			};
			columnIndex += colSpan;
		}
	}
	return null;
}
function $insertTableIntoGrid(tableNode, selection) {
	const anchorAndFocus = selection.getStartEndPoints();
	const isTableSel = $isTableSelection(selection);
	if (anchorAndFocus === null) return false;
	const [anchor, focus] = anchorAndFocus;
	const [anchorCellNode, anchorRowNode, gridNode] = $getNodeTriplet(anchor);
	const focusCellNode = $findMatchingParent(focus.getNode(), (n) => $isTableCellNode(n));
	if (!$isTableCellNode(anchorCellNode) || !$isTableCellNode(focusCellNode) || !$isTableRowNode(anchorRowNode) || !$isTableNode(gridNode)) return false;
	const [initialGridMap, anchorCellMap, focusCellMap] = $computeTableMap(gridNode, anchorCellNode, focusCellNode);
	const [templateGridMap] = $computeTableMapSkipCellCheck(tableNode, null, null);
	const initialRowCount = initialGridMap.length;
	const initialColCount = initialRowCount > 0 ? initialGridMap[0].length : 0;
	let startRow = anchorCellMap.startRow;
	let startCol = anchorCellMap.startColumn;
	let affectedRowCount = templateGridMap.length;
	let affectedColCount = affectedRowCount > 0 ? templateGridMap[0].length : 0;
	if (isTableSel) {
		const selectionBoundary = $computeTableCellRectBoundary(initialGridMap, anchorCellMap, focusCellMap);
		const selectionRowCount = selectionBoundary.maxRow - selectionBoundary.minRow + 1;
		const selectionColCount = selectionBoundary.maxColumn - selectionBoundary.minColumn + 1;
		startRow = selectionBoundary.minRow;
		startCol = selectionBoundary.minColumn;
		affectedRowCount = Math.min(affectedRowCount, selectionRowCount);
		affectedColCount = Math.min(affectedColCount, selectionColCount);
	}
	let didPerformMergeOperations = false;
	const lastRowForUnmerge = Math.min(initialRowCount, startRow + affectedRowCount) - 1;
	const lastColForUnmerge = Math.min(initialColCount, startCol + affectedColCount) - 1;
	const unmergedKeys = /* @__PURE__ */ new Set();
	for (let row = startRow; row <= lastRowForUnmerge; row++) for (let col = startCol; col <= lastColForUnmerge; col++) {
		const cellMap = initialGridMap[row][col];
		if (unmergedKeys.has(cellMap.cell.getKey())) continue;
		if (cellMap.cell.__rowSpan === 1 && cellMap.cell.__colSpan === 1) continue;
		$unmergeCellNode(cellMap.cell);
		unmergedKeys.add(cellMap.cell.getKey());
		didPerformMergeOperations = true;
	}
	let [interimGridMap] = $computeTableMapSkipCellCheck(gridNode.getWritable(), null, null);
	const rowsToInsert = affectedRowCount - initialRowCount + startRow;
	for (let i = 0; i < rowsToInsert; i++) {
		const cellMap = interimGridMap[initialRowCount - 1][0];
		$insertTableRowAtNode(cellMap.cell);
	}
	const colsToInsert = affectedColCount - initialColCount + startCol;
	for (let i = 0; i < colsToInsert; i++) {
		const cellMap = interimGridMap[0][initialColCount - 1];
		$insertTableColumnAtNode(cellMap.cell, true, false);
	}
	[interimGridMap] = $computeTableMapSkipCellCheck(gridNode.getWritable(), null, null);
	for (let row = startRow; row < startRow + affectedRowCount; row++) for (let col = startCol; col < startCol + affectedColCount; col++) {
		const templateRow = row - startRow;
		const templateCol = col - startCol;
		const templateCellMap = templateGridMap[templateRow][templateCol];
		if (templateCellMap.startRow !== templateRow || templateCellMap.startColumn !== templateCol) continue;
		const templateCell = templateCellMap.cell;
		if (templateCell.__rowSpan !== 1 || templateCell.__colSpan !== 1) {
			const cellsToMerge = [];
			const lastRowForMerge = Math.min(row + templateCell.__rowSpan, startRow + affectedRowCount) - 1;
			const lastColForMerge = Math.min(col + templateCell.__colSpan, startCol + affectedColCount) - 1;
			for (let r = row; r <= lastRowForMerge; r++) for (let c = col; c <= lastColForMerge; c++) {
				const cellMap = interimGridMap[r][c];
				cellsToMerge.push(cellMap.cell);
			}
			$mergeCells(cellsToMerge);
			didPerformMergeOperations = true;
		}
		const { cell } = interimGridMap[row][col];
		const backgroundColor = templateCell.getBackgroundColor();
		if (backgroundColor !== null && backgroundColor !== void 0) cell.setBackgroundColor(backgroundColor);
		const verticalAlign = templateCell.getVerticalAlign();
		if (verticalAlign !== void 0) cell.setVerticalAlign(verticalAlign);
		const originalChildren = cell.getChildren();
		templateCell.getChildren().forEach((child) => {
			if ($isTextNode(child)) {
				$createParagraphNode().append(child);
				cell.append(child);
			} else cell.append(child);
		});
		originalChildren.forEach((n) => n.remove());
	}
	if (isTableSel && didPerformMergeOperations) {
		const [finalGridMap] = $computeTableMapSkipCellCheck(gridNode.getWritable(), null, null);
		finalGridMap[anchorCellMap.startRow][anchorCellMap.startColumn].cell.selectEnd();
	}
	return true;
}
function $setTableRowIsHeader(tableNode, rowIndex, isHeader) {
	const [gridMap] = $computeTableMapSkipCellCheck(tableNode, null, null);
	invariant(rowIndex >= 0 && rowIndex < gridMap.length, "Table row index %s out of range", String(rowIndex));
	const rowMap = gridMap[rowIndex];
	const headerState = isHeader ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS;
	const visited = /* @__PURE__ */ new Set();
	for (let col = 0; col < rowMap.length; col++) {
		const mapCell = rowMap[col];
		if (mapCell == null) continue;
		if (!visited.has(mapCell.cell)) {
			visited.add(mapCell.cell);
			mapCell.cell.setHeaderStyles(headerState, TableCellHeaderStates.ROW);
		}
	}
}
function $setTableColumnIsHeader(tableNode, columnIndex, isHeader) {
	const [gridMap] = $computeTableMapSkipCellCheck(tableNode, null, null);
	invariant(gridMap.length > 0 && columnIndex >= 0 && columnIndex < gridMap[0].length, "Table column index %s out of range", String(columnIndex));
	const headerState = isHeader ? TableCellHeaderStates.COLUMN : TableCellHeaderStates.NO_STATUS;
	const visited = /* @__PURE__ */ new Set();
	for (let row = 0; row < gridMap.length; row++) {
		const mapCell = gridMap[row][columnIndex];
		if (mapCell == null) continue;
		if (!visited.has(mapCell.cell)) {
			visited.add(mapCell.cell);
			mapCell.cell.setHeaderStyles(headerState, TableCellHeaderStates.COLUMN);
		}
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableSelection.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $getCellNodes(tableSelection) {
	const [[anchorNode, anchorCell, anchorRow, anchorTable], [focusNode, focusCell, focusRow, focusTable]] = ["anchor", "focus"].map((k) => {
		const node = tableSelection[k].getNode();
		const cellNode = $findMatchingParent(node, $isTableCellNode);
		invariant($isTableCellNode(cellNode), "Expected TableSelection %s to be (or a child of) TableCellNode, got key %s of type %s", k, node.getKey(), node.getType());
		const rowNode = cellNode.getParent();
		invariant($isTableRowNode(rowNode), "Expected TableSelection %s cell parent to be a TableRowNode", k);
		const tableNode = rowNode.getParent();
		invariant($isTableNode(tableNode), "Expected TableSelection %s row parent to be a TableNode", k);
		return [
			node,
			cellNode,
			rowNode,
			tableNode
		];
	});
	invariant(anchorTable.is(focusTable), "Expected TableSelection anchor and focus to be in the same table");
	return {
		anchorCell,
		anchorNode,
		anchorRow,
		anchorTable,
		focusCell,
		focusNode,
		focusRow,
		focusTable
	};
}
var TableSelection = class TableSelection {
	tableKey;
	anchor;
	focus;
	_cachedNodes;
	dirty;
	constructor(tableKey, anchor, focus) {
		this.anchor = anchor;
		this.focus = focus;
		anchor._selection = this;
		focus._selection = this;
		this._cachedNodes = null;
		this.dirty = false;
		this.tableKey = tableKey;
	}
	getStartEndPoints() {
		return [this.anchor, this.focus];
	}
	/**
	* {@link $createTableSelection} unfortunately makes it very easy to create
	* nonsense selections, so we have a method to see if the selection probably
	* makes sense.
	*
	* @returns true if the TableSelection is (probably) valid
	*/
	isValid() {
		if (this.tableKey === "root" || this.anchor.key === "root" || this.anchor.type !== "element" || this.focus.key === "root" || this.focus.type !== "element") return false;
		const tableNode = $getNodeByKey(this.tableKey);
		const anchorNode = $getNodeByKey(this.anchor.key);
		const focusNode = $getNodeByKey(this.focus.key);
		return tableNode !== null && anchorNode !== null && focusNode !== null;
	}
	/**
	* Returns whether the Selection is "backwards", meaning the focus
	* logically precedes the anchor in the EditorState.
	* @returns true if the Selection is backwards, false otherwise.
	*/
	isBackward() {
		return this.focus.isBefore(this.anchor);
	}
	getCachedNodes() {
		return this._cachedNodes;
	}
	setCachedNodes(nodes) {
		this._cachedNodes = nodes;
	}
	is(selection) {
		return $isTableSelection(selection) && this.tableKey === selection.tableKey && this.anchor.is(selection.anchor) && this.focus.is(selection.focus);
	}
	set(tableKey, anchorCellKey, focusCellKey) {
		this.dirty = this.dirty || tableKey !== this.tableKey || anchorCellKey !== this.anchor.key || focusCellKey !== this.focus.key;
		this.tableKey = tableKey;
		this.anchor.key = anchorCellKey;
		this.focus.key = focusCellKey;
		this._cachedNodes = null;
	}
	clone() {
		return new TableSelection(this.tableKey, $createPoint(this.anchor.key, this.anchor.offset, this.anchor.type), $createPoint(this.focus.key, this.focus.offset, this.focus.type));
	}
	isCollapsed() {
		return false;
	}
	extract() {
		return this.getNodes();
	}
	insertRawText(text) {
		if (text === "") return;
		const tsvGrid = (text.endsWith("\n") ? text.slice(0, -1) : text).split("\n").map((line) => line.split("	"));
		const tableNode = $createTableNode();
		for (const row of tsvGrid) {
			const rowNode = $createTableRowNode();
			for (const cellText of row) {
				const cellNode = $createTableCellNode(TableCellHeaderStates.NO_STATUS);
				const paragraph = $createParagraphNode();
				if (cellText) paragraph.append($createTextNode(cellText));
				cellNode.append(paragraph);
				rowNode.append(cellNode);
			}
			tableNode.append(rowNode);
		}
		const { anchorCell } = $getCellNodes(this);
		$insertTableIntoGrid(tableNode, anchorCell.select(0, anchorCell.getChildrenSize()));
	}
	insertText() {}
	/**
	* Returns whether the provided TextFormatType is present on the Selection.
	* This will be true if any paragraph in table cells has the specified format.
	*
	* @param type the TextFormatType to check for.
	* @returns true if the provided format is currently toggled on the Selection, false otherwise.
	*/
	hasFormat(type) {
		let format = 0;
		this.getNodes().filter($isTableCellNode).forEach((cellNode) => {
			const paragraph = cellNode.getFirstChild();
			if ($isParagraphNode(paragraph)) format |= paragraph.getTextFormat();
		});
		const formatFlag = TEXT_TYPE_TO_FORMAT[type];
		return (format & formatFlag) !== 0;
	}
	insertNodes(nodes) {
		const focusNode = this.focus.getNode();
		invariant($isElementNode(focusNode), "Expected TableSelection focus to be an ElementNode");
		$normalizeSelection(focusNode.select(0, focusNode.getChildrenSize())).insertNodes(nodes);
	}
	/** @deprecated Use {@link $computeTableMap} and {@link $computeTableCellRectBoundary} directly. */
	getShape() {
		const { anchorCell, focusCell } = $getCellNodes(this);
		const anchorCellNodeRect = $getTableCellNodeRect(anchorCell);
		invariant(anchorCellNodeRect !== null, "getCellRect: expected to find AnchorNode");
		const focusCellNodeRect = $getTableCellNodeRect(focusCell);
		invariant(focusCellNodeRect !== null, "getCellRect: expected to find focusCellNode");
		const startX = Math.min(anchorCellNodeRect.columnIndex, focusCellNodeRect.columnIndex);
		const stopX = Math.max(anchorCellNodeRect.columnIndex + anchorCellNodeRect.colSpan - 1, focusCellNodeRect.columnIndex + focusCellNodeRect.colSpan - 1);
		const startY = Math.min(anchorCellNodeRect.rowIndex, focusCellNodeRect.rowIndex);
		const stopY = Math.max(anchorCellNodeRect.rowIndex + anchorCellNodeRect.rowSpan - 1, focusCellNodeRect.rowIndex + focusCellNodeRect.rowSpan - 1);
		return {
			fromX: Math.min(startX, stopX),
			fromY: Math.min(startY, stopY),
			toX: Math.max(startX, stopX),
			toY: Math.max(startY, stopY)
		};
	}
	getNodes() {
		if (!this.isValid()) return [];
		const cachedNodes = this._cachedNodes;
		if (cachedNodes !== null) return cachedNodes;
		const { anchorTable: tableNode, anchorCell, focusCell } = $getCellNodes(this);
		const focusCellGrid = focusCell.getParents()[1];
		if (focusCellGrid !== tableNode) {
			if (!tableNode.isParentOf(focusCell)) {
				const gridParent = tableNode.getParent();
				invariant(gridParent != null, "Expected gridParent to have a parent");
				this.set(this.tableKey, gridParent.getKey(), focusCell.getKey());
			} else {
				const focusCellParent = focusCellGrid.getParent();
				invariant(focusCellParent != null, "Expected focusCellParent to have a parent");
				this.set(this.tableKey, focusCell.getKey(), focusCellParent.getKey());
			}
			return this.getNodes();
		}
		const [map, cellAMap, cellBMap] = $computeTableMap(tableNode, anchorCell, focusCell);
		const { minColumn, maxColumn, minRow, maxRow } = $computeTableCellRectBoundary(map, cellAMap, cellBMap);
		const nodeMap = /* @__PURE__ */ new Map([[tableNode.getKey(), tableNode]]);
		let lastRow = null;
		for (let i = minRow; i <= maxRow; i++) for (let j = minColumn; j <= maxColumn; j++) {
			const { cell } = map[i][j];
			const currentRow = cell.getParent();
			invariant($isTableRowNode(currentRow), "Expected TableCellNode parent to be a TableRowNode");
			if (currentRow !== lastRow) {
				nodeMap.set(currentRow.getKey(), currentRow);
				lastRow = currentRow;
			}
			if (!nodeMap.has(cell.getKey())) $visitRecursively(cell, (childNode) => {
				nodeMap.set(childNode.getKey(), childNode);
			});
		}
		const nodes = Array.from(nodeMap.values());
		if (!isCurrentlyReadOnlyMode()) this._cachedNodes = nodes;
		return nodes;
	}
	getTextContent() {
		const nodes = this.getNodes().filter((node) => $isTableCellNode(node));
		let textContent = "";
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			const row = node.__parent;
			const nextRow = (nodes[i + 1] || {}).__parent;
			textContent += node.getTextContent() + (nextRow !== row ? "\n" : "	");
		}
		return textContent;
	}
};
/** Type guard for {@link TableSelection}. */
function $isTableSelection(x) {
	return x instanceof TableSelection;
}
/** @deprecated Use {@link $createTableSelectionFrom} instead. */
function $createTableSelection() {
	return new TableSelection("root", $createPoint("root", 0, "element"), $createPoint("root", 0, "element"));
}
/**
* Creates a {@link TableSelection} spanning from `anchorCell` to `focusCell`
* within `tableNode`. In `__DEV__` mode, validates that both cells belong to
* the given table and that the table is attached to the editor state.
*
* If the current selection is already a TableSelection, it clones and
* re-targets it (preserving identity for dirty-checking); otherwise it
* constructs a fresh one.
*/
function $createTableSelectionFrom(tableNode, anchorCell, focusCell) {
	tableNode.getKey();
	anchorCell.getKey();
	focusCell.getKey();
	const prevSelection = $getSelection();
	const nextSelection = $isTableSelection(prevSelection) ? prevSelection.clone() : new TableSelection("root", $createPoint("root", 0, "element"), $createPoint("root", 0, "element"));
	nextSelection.set(tableNode.getKey(), anchorCell.getKey(), focusCell.getKey());
	return nextSelection;
}
/**
* Depth first visitor
* @param node The starting node
* @param $visit The function to call for each node. If the function returns false, then children of this node will not be explored
*/
function $visitRecursively(node, $visit) {
	const stack = [[node]];
	for (let currentArray = stack.at(-1); currentArray !== void 0 && stack.length > 0; currentArray = stack.at(-1)) {
		const currentNode = currentArray.pop();
		if (currentNode === void 0) stack.pop();
		else if ($visit(currentNode) !== false && $isElementNode(currentNode)) stack.push(currentNode.getChildren());
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableObserver.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $getTableAndElementByKey(tableNodeKey, editor = $getEditor()) {
	const tableNode = $getNodeByKey(tableNodeKey);
	invariant($isTableNode(tableNode), "TableObserver: Expected tableNodeKey %s to be a TableNode", tableNodeKey);
	const tableElement = getTableElement(tableNode, editor.getElementByKey(tableNodeKey));
	invariant(tableElement !== null, "TableObserver: Expected to find TableElement in DOM for key %s", tableNodeKey);
	return {
		tableElement,
		tableNode
	};
}
/**
* Tracks table selection state that sits across all tables.
*/
var TableObservers = class {
	observers;
	nextFocus;
	shouldCheckSelectionForTable;
	constructor() {
		this.observers = /* @__PURE__ */ new Map();
		this.nextFocus = null;
		this.shouldCheckSelectionForTable = null;
	}
	/**
	* @internal
	* When handling mousemove events we track what the focus cell should be, but
	* the DOM selection may end up somewhere else entirely. We don't have an elegant
	* way to handle this after the DOM selection has been resolved in a
	* SELECTION_CHANGE_COMMAND callback.
	*/
	setNextFocus(nextFocus) {
		this.nextFocus = nextFocus;
	}
	/** @internal */
	getAndClearNextFocus() {
		const { nextFocus } = this;
		if (nextFocus !== null) this.nextFocus = null;
		return nextFocus;
	}
	/**
	* @internal
	* Firefox has a strange behavior where pressing the down arrow key from
	* above the table will move the caret after the table and then lexical
	* will select the last cell instead of the first.
	* We do still want to let the browser handle caret movement but we will
	* use this property to "tag" the update so that we can recheck the
	* selection after the event is processed.
	*/
	setShouldCheckSelectionForTable(tableKey) {
		this.shouldCheckSelectionForTable = tableKey;
	}
	/**
	* @internal
	*/
	getAndClearShouldCheckSelectionForTable() {
		const { shouldCheckSelectionForTable } = this;
		if (shouldCheckSelectionForTable) {
			this.shouldCheckSelectionForTable = null;
			return shouldCheckSelectionForTable;
		}
		return null;
	}
	/**
	* @internal
	* Remove the observer for tableKey from the registry and unregister all
	* of its listeners, e.g. because the table was removed from the document
	* or its DOM was recreated.
	*
	* @returns true if an observer was registered for tableKey
	*/
	removeObserver(tableKey) {
		const observerAndElement = this.observers.get(tableKey);
		if (observerAndElement === void 0) return false;
		observerAndElement[0].removeListeners();
		this.observers.delete(tableKey);
		return true;
	}
	/**
	* @internal
	* Remove all observers from the registry and unregister their listeners,
	* e.g. because the table selection observer is being unregistered.
	*/
	removeAllObservers() {
		for (const tableKey of Array.from(this.observers.keys())) this.removeObserver(tableKey);
	}
	/**
	* @internal
	* Get a snapshot of the registry as [TableNode, TableObserver] pairs for
	* the current editor state. A table's destroyed mutation can be missed
	* entirely (e.g. when it is removed during an update while the editor's
	* root element is detached), so any entry whose table no longer exists
	* is removed from the registry instead of being returned, otherwise such
	* an entry would poison the registry and break every subsequent
	* selection change.
	*
	* Must be called within an editor read or update.
	*/
	$getTableNodesAndObservers() {
		const tableNodesAndObservers = [];
		for (const [tableKey, [tableObserver]] of Array.from(this.observers.entries())) {
			const tableNode = $getNodeByKey(tableKey);
			if ($isTableNode(tableNode)) tableNodesAndObservers.push([tableNode, tableObserver]);
			else this.removeObserver(tableKey);
		}
		return tableNodesAndObservers;
	}
};
var TableObserver = class {
	focusX;
	focusY;
	listenersToRemove;
	table;
	isHighlightingCells;
	anchorX;
	anchorY;
	tableNodeKey;
	anchorCell;
	focusCell;
	anchorCellNodeKey;
	focusCellNodeKey;
	editor;
	tableSelection;
	hasHijackedSelectionStyles;
	isSelecting;
	/**
	* Whether the pointer gesture currently in progress has travelled beyond
	* the tap slop box, i.e. it is a drag rather than a tap. Only a drag may
	* start a table selection from touch input. Set by the pointermove handler
	* and reset whenever the gesture ends.
	*/
	isPointerDrag;
	/**
	* The cell the pointer gesture currently in progress started on, null when
	* no gesture is in progress. A drag that never leaves this cell is
	* selecting text within it, not selecting cells.
	*/
	pointerStartCell;
	pointerType;
	abortController;
	listenerOptions;
	constructor(editor, tableNodeKey) {
		this.isHighlightingCells = false;
		this.anchorX = -1;
		this.anchorY = -1;
		this.focusX = -1;
		this.focusY = -1;
		this.listenersToRemove = /* @__PURE__ */ new Set();
		this.tableNodeKey = tableNodeKey;
		this.editor = editor;
		this.table = {
			columns: 0,
			domRows: [],
			rows: 0
		};
		this.tableSelection = null;
		this.anchorCellNodeKey = null;
		this.focusCellNodeKey = null;
		this.anchorCell = null;
		this.focusCell = null;
		this.hasHijackedSelectionStyles = false;
		this.isSelecting = false;
		this.isPointerDrag = false;
		this.pointerStartCell = null;
		this.pointerType = null;
		this.abortController = new AbortController();
		this.listenerOptions = { signal: this.abortController.signal };
		this.trackTable();
	}
	getTable() {
		return this.table;
	}
	removeListeners() {
		this.abortController.abort("removeListeners");
		Array.from(this.listenersToRemove).forEach((removeListener) => removeListener());
		this.listenersToRemove.clear();
	}
	$lookup() {
		return $getTableAndElementByKey(this.tableNodeKey, this.editor);
	}
	trackTable() {
		const observer = new MutationObserver((records) => {
			this.editor.read("latest", () => {
				let gridNeedsRedraw = false;
				for (let i = 0; i < records.length; i++) {
					const nodeName = records[i].target.nodeName;
					if (nodeName === "TABLE" || nodeName === "TBODY" || nodeName === "THEAD" || nodeName === "TR") {
						gridNeedsRedraw = true;
						break;
					}
				}
				if (!gridNeedsRedraw) return;
				const { tableNode, tableElement } = this.$lookup();
				this.table = getTable(tableNode, tableElement);
			});
		});
		this.listenersToRemove.add(() => observer.disconnect());
		this.editor.read("latest", () => {
			const { tableNode, tableElement } = this.$lookup();
			this.table = getTable(tableNode, tableElement);
			observer.observe(tableElement, {
				attributes: true,
				childList: true,
				subtree: true
			});
		});
	}
	$clearHighlight(setEmptySelection = true) {
		const editor = this.editor;
		this.isHighlightingCells = false;
		this.anchorX = -1;
		this.anchorY = -1;
		this.focusX = -1;
		this.focusY = -1;
		this.tableSelection = null;
		this.anchorCellNodeKey = null;
		this.focusCellNodeKey = null;
		this.anchorCell = null;
		this.focusCell = null;
		this.hasHijackedSelectionStyles = false;
		this.$enableHighlightStyle();
		const { tableNode, tableElement } = this.$lookup();
		$updateDOMForSelection(editor, getTable(tableNode, tableElement), null);
		if (setEmptySelection && $getSelection() !== null) {
			$setSelection(null);
			editor.dispatchCommand(SELECTION_CHANGE_COMMAND);
		}
	}
	$enableHighlightStyle() {
		const editor = this.editor;
		const { tableElement } = this.$lookup();
		removeClassNamesFromElement(tableElement, editor._config.theme.tableSelection);
		tableElement.classList.remove("disable-selection");
		this.hasHijackedSelectionStyles = false;
	}
	$disableHighlightStyle() {
		const { tableElement } = this.$lookup();
		addClassNamesToElement(tableElement, this.editor._config.theme.tableSelection);
		this.hasHijackedSelectionStyles = true;
	}
	$updateTableTableSelection(selection) {
		if (selection !== null) {
			invariant(selection.tableKey === this.tableNodeKey, "TableObserver.$updateTableTableSelection: selection.tableKey !== this.tableNodeKey ('%s' !== '%s')", selection.tableKey, this.tableNodeKey);
			const editor = this.editor;
			this.tableSelection = selection;
			this.isHighlightingCells = true;
			this.$disableHighlightStyle();
			this.updateDOMSelection();
			$updateDOMForSelection(editor, this.table, this.tableSelection);
		} else this.$clearHighlight();
	}
	/** @internal */
	updateDOMSelection() {
		if (this.anchorCell !== null && this.focusCell !== null) {
			const domSelection = getDOMSelection(this.editor._window);
			if (domSelection && domSelection.rangeCount > 0) domSelection.removeAllRanges();
		}
	}
	$setFocusCellForSelection(cell, ignoreStart = false) {
		const editor = this.editor;
		const { tableNode } = this.$lookup();
		const cellX = cell.x;
		const cellY = cell.y;
		this.focusCell = cell;
		if (!this.isHighlightingCells) {
			if (ignoreStart || this.anchorX !== cellX || this.anchorY !== cellY || this.tableSelection != null && this.anchorCellNodeKey != null) {
				this.isHighlightingCells = true;
				this.$disableHighlightStyle();
			}
		}
		if (this.focusX !== -1 && this.focusY !== -1 && cellX === this.focusX && cellY === this.focusY) return false;
		this.focusX = cellX;
		this.focusY = cellY;
		if (this.isHighlightingCells) {
			const focusTableCellNode = $getNearestTableCellInTableFromDOMNode(tableNode, cell.elem);
			if (this.tableSelection != null && this.anchorCellNodeKey != null) {
				let targetCellNode = focusTableCellNode;
				if (targetCellNode === null && ignoreStart) targetCellNode = tableNode.getCellNodeFromCords(cellX, cellY, this.table);
				if (targetCellNode !== null) {
					const anchorTableCell = this.$getAnchorTableCellOrThrow();
					this.focusCellNodeKey = targetCellNode.getKey();
					this.tableSelection = $createTableSelectionFrom(tableNode, anchorTableCell, targetCellNode);
					$setSelection(this.tableSelection);
					editor.dispatchCommand(SELECTION_CHANGE_COMMAND);
					$updateDOMForSelection(editor, this.table, this.tableSelection);
					return true;
				}
			}
		}
		return false;
	}
	$getAnchorTableCell() {
		const node = this.anchorCellNodeKey ? $getNodeByKey(this.anchorCellNodeKey) : null;
		return $isTableCellNode(node) ? node : null;
	}
	$getAnchorTableCellOrThrow() {
		const anchorTableCell = this.$getAnchorTableCell();
		invariant(anchorTableCell !== null, "TableObserver anchorTableCell is null");
		return anchorTableCell;
	}
	$getFocusTableCell() {
		const node = this.focusCellNodeKey ? $getNodeByKey(this.focusCellNodeKey) : null;
		return $isTableCellNode(node) ? node : null;
	}
	$getFocusTableCellOrThrow() {
		const focusTableCell = this.$getFocusTableCell();
		invariant(focusTableCell !== null, "TableObserver focusTableCell is null");
		return focusTableCell;
	}
	$setAnchorCellForSelection(cell) {
		this.isHighlightingCells = false;
		this.anchorCell = cell;
		this.anchorX = cell.x;
		this.anchorY = cell.y;
		this.focusX = -1;
		this.focusY = -1;
		this.focusCell = null;
		this.focusCellNodeKey = null;
		const { tableNode } = this.$lookup();
		const anchorTableCellNode = $getNearestTableCellInTableFromDOMNode(tableNode, cell.elem);
		if (anchorTableCellNode !== null) {
			const anchorNodeKey = anchorTableCellNode.getKey();
			if (this.tableSelection != null) {
				this.tableSelection = this.tableSelection.clone();
				this.tableSelection.set(tableNode.getKey(), anchorNodeKey, anchorNodeKey);
			} else this.tableSelection = $createTableSelectionFrom(tableNode, anchorTableCellNode, anchorTableCellNode);
			this.anchorCellNodeKey = anchorNodeKey;
		}
	}
	$formatCells(type) {
		const selection = $getSelection();
		invariant($isTableSelection(selection), "Expected Table selection");
		const formatSelection = $createRangeSelection();
		const anchor = formatSelection.anchor;
		const focus = formatSelection.focus;
		const cellNodes = selection.getNodes().filter($isTableCellNode);
		invariant(cellNodes.length > 0, "No table cells present");
		const paragraph = cellNodes[0].getFirstChild();
		const alignFormatWith = $isParagraphNode(paragraph) ? paragraph.getFormatFlags(type, null) : null;
		cellNodes.forEach((cellNode) => {
			anchor.set(cellNode.getKey(), 0, "element");
			focus.set(cellNode.getKey(), cellNode.getChildrenSize(), "element");
			formatSelection.formatText(type, alignFormatWith);
		});
		$setSelection(selection);
		this.editor.dispatchCommand(SELECTION_CHANGE_COMMAND);
	}
	$clearText() {
		const { editor } = this;
		const tableNode = $getNodeByKey(this.tableNodeKey);
		if (!$isTableNode(tableNode)) throw new Error("Expected TableNode.");
		const selection = $getSelection();
		invariant($isTableSelection(selection), "Expected TableSelection");
		const selectedNodes = selection.getNodes().filter($isTableCellNode);
		const firstRow = tableNode.getFirstChild();
		const lastRow = tableNode.getLastChild();
		if (selectedNodes.length > 0 && firstRow !== null && lastRow !== null && $isTableRowNode(firstRow) && $isTableRowNode(lastRow) && selectedNodes[0] === firstRow.getFirstChild() && selectedNodes[selectedNodes.length - 1] === lastRow.getLastChild()) {
			tableNode.selectPrevious();
			const parent = tableNode.getParent();
			tableNode.remove();
			if ($isRootNode(parent) && parent.isEmpty()) editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND);
			return;
		}
		selectedNodes.forEach((cellNode) => {
			if ($isElementNode(cellNode)) {
				const firstChild = cellNode.getFirstChild();
				const paragraphNode = $isParagraphNode(firstChild) ? $copyNode(firstChild) : $createParagraphNode();
				const textNode = $createTextNode();
				paragraphNode.append(textNode);
				cellNode.append(paragraphNode);
				cellNode.getChildren().forEach((child) => {
					if (child !== paragraphNode) child.remove();
				});
			}
		});
		$updateDOMForSelection(editor, this.table, null);
		$setSelection(null);
		editor.dispatchCommand(SELECTION_CHANGE_COMMAND);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableSelectionHelpers.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var LEXICAL_ELEMENT_KEY = "__lexicalTableSelection";
function $getTableNodeByKeyOrThrow(key) {
	const tableNode = $getNodeByKeyOrThrow(key);
	invariant($isTableNode(tableNode), "Expected TableNode for key %s", key);
	return tableNode;
}
var isPointerDownOnEvent = (event) => {
	return (event.buttons & 1) === 1;
};
var TAP_SLOP = 10;
var AUTO_SCROLL_EDGE_ZONE = 40;
var AUTO_SCROLL_MAX_STEP = 18;
function autoScrollStep(pos, start, end) {
	const speed = (depth) => Math.max(1, Math.ceil(Math.min(AUTO_SCROLL_EDGE_ZONE, depth) / AUTO_SCROLL_EDGE_ZONE * AUTO_SCROLL_MAX_STEP));
	if (pos <= start + AUTO_SCROLL_EDGE_ZONE) return -speed(start + AUTO_SCROLL_EDGE_ZONE - pos);
	if (pos >= end - AUTO_SCROLL_EDGE_ZONE) return speed(pos - (end - AUTO_SCROLL_EDGE_ZONE));
	return 0;
}
function isHTMLTableElement(el) {
	return isHTMLElement(el) && el.nodeName === "TABLE";
}
function getTableElement(tableNode, dom) {
	if (!dom) return dom;
	const element = isHTMLTableElement(dom) ? dom : dom.querySelector("table");
	invariant(isHTMLTableElement(element), "getTableElement: Expecting table in DOM node for %s of type %s with key %s, not %s", tableNode.constructor.name, tableNode.getType(), tableNode.getKey(), dom.nodeName);
	return element;
}
function getEditorWindow(editor) {
	return editor._window;
}
function $findParentTableCellNodeInTable(tableNode, node) {
	for (let currentNode = node, lastTableCellNode = null; currentNode !== null; currentNode = currentNode.getParent()) if (tableNode.is(currentNode)) return lastTableCellNode;
	else if ($isTableCellNode(currentNode)) lastTableCellNode = currentNode;
	return null;
}
var ARROW_KEY_COMMANDS_WITH_DIRECTION = [
	[KEY_ARROW_DOWN_COMMAND, "down"],
	[KEY_ARROW_UP_COMMAND, "up"],
	[KEY_ARROW_LEFT_COMMAND, "backward"],
	[KEY_ARROW_RIGHT_COMMAND, "forward"]
];
var DELETE_TEXT_COMMANDS = [
	DELETE_WORD_COMMAND,
	DELETE_LINE_COMMAND,
	DELETE_CHARACTER_COMMAND
];
var DELETE_KEY_COMMANDS = [KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND];
function registerTableWindowHandlers(editor, tableObservers) {
	return editor.registerRootListener((rootElement) => {
		if (rootElement === null) return;
		const editorWindow = editor._window;
		if (editorWindow === null) return;
		const pointerDownCallback = (event) => {
			const target = getComposedEventTarget(event);
			if (event.button !== 0 || !isDOMNode(target) || !rootElement.contains(target)) return;
			const selectionInfo = getTableObserverFromCellNode(target);
			editor.update(() => {
				if ($isTableSelection($getSelection())) {
					for (const [observer] of tableObservers.observers.values()) observer.$clearHighlight(false);
					$setSelection(null);
					editor.dispatchCommand(SELECTION_CHANGE_COMMAND);
				}
				if (!selectionInfo) return;
				const { tableObserver, tableElement, cellElement } = selectionInfo;
				$handleTableClick(editor, event, cellElement, tableElement, tableObserver, tableObservers);
			});
		};
		return registerEventListener(editorWindow, "pointerdown", pointerDownCallback);
	});
}
function $handleTableClick(editor, event, selectedDOMCell, tableElement, tableObserver, tableObservers) {
	const editorWindow = editor._window;
	if (!editorWindow) return;
	const createPointerHandlers = (startingCell) => {
		if (tableObserver.isSelecting) return;
		tableObserver.isSelecting = true;
		tableObserver.isPointerDrag = false;
		tableObserver.pointerStartCell = startingCell;
		const isTouch = event.pointerType === "touch";
		const gesturePointerId = event.pointerId;
		const startClientX = event.clientX;
		const startClientY = event.clientY;
		let hasAnchorForGesture = !isTouch;
		if (!isTouch && tableObserver.anchorCell === null) editor.update(() => {
			tableObserver.$setAnchorCellForSelection(startingCell);
		});
		let lastClientX = event.clientX;
		let lastClientY = event.clientY;
		let autoScrollRafId = null;
		let removeGestureListeners = null;
		const isGesturePointer = (pointerEvent) => pointerEvent.pointerId === gesturePointerId;
		const isBeyondTapSlop = (clientX, clientY) => !(Math.abs(clientX - startClientX) <= TAP_SLOP && Math.abs(clientY - startClientY) <= TAP_SLOP);
		const stopSelecting = () => {
			tableObserver.isSelecting = false;
			tableObserver.isPointerDrag = false;
			tableObserver.pointerStartCell = null;
			if (autoScrollRafId !== null) {
				editorWindow.cancelAnimationFrame(autoScrollRafId);
				autoScrollRafId = null;
			}
			if (removeGestureListeners !== null) {
				removeGestureListeners();
				removeGestureListeners = null;
			}
		};
		const resolveFocusCellFromPoint = (clientX, clientY) => {
			const tableRoot = tableElement.getRootNode();
			if (!isDOMDocumentNode(tableRoot) && !isDOMShadowRoot(tableRoot)) return null;
			for (const el of tableRoot.elementsFromPoint(clientX, clientY)) {
				const cell = getDOMCellInTableFromTarget(tableElement, el);
				if (cell) return cell;
			}
			return null;
		};
		const applyFocusCell = (focusCell, override) => {
			if (!hasAnchorForGesture && (!tableObserver.isPointerDrag || focusCell.elem === startingCell.elem)) return;
			if (tableObserver.anchorCell === null || !hasAnchorForGesture) {
				const anchorCell = hasAnchorForGesture ? focusCell : startingCell;
				editor.update(() => {
					tableObserver.$setAnchorCellForSelection(anchorCell);
				});
			}
			hasAnchorForGesture = true;
			if (tableObserver.focusCell === null || focusCell.elem !== tableObserver.focusCell.elem) {
				tableObservers.setNextFocus({
					focusCell,
					override,
					tableKey: tableObserver.tableNodeKey
				});
				editor.dispatchCommand(SELECTION_CHANGE_COMMAND);
			}
		};
		const findScrollContainer = (axis) => {
			for (let el = tableElement.parentElement; el; el = el.parentElement) if (axis === "x" ? el.scrollWidth > el.clientWidth : el.scrollHeight > el.clientHeight) {
				const style = editorWindow.getComputedStyle(el);
				const overflow = axis === "x" ? style.overflowX : style.overflowY;
				if (overflow === "auto" || overflow === "scroll") return el;
			}
			return null;
		};
		const scrollAxis = (container, pos, axis) => {
			let start;
			let end;
			if (container === null) {
				start = 0;
				end = axis === "x" ? editorWindow.innerWidth : editorWindow.innerHeight;
			} else {
				const rect = container.getBoundingClientRect();
				start = axis === "x" ? rect.left : rect.top;
				end = axis === "x" ? rect.right : rect.bottom;
			}
			const step = autoScrollStep(pos, start, end);
			if (step === 0) return false;
			if (container === null) {
				const before = axis === "x" ? editorWindow.scrollX : editorWindow.scrollY;
				editorWindow.scrollBy(axis === "x" ? step : 0, axis === "x" ? 0 : step);
				return (axis === "x" ? editorWindow.scrollX : editorWindow.scrollY) !== before;
			}
			if (axis === "x") {
				const before = container.scrollLeft;
				container.scrollLeft += step;
				return container.scrollLeft !== before;
			}
			const before = container.scrollTop;
			container.scrollTop += step;
			return container.scrollTop !== before;
		};
		const clampHitPoint = (hContainer, vContainer) => {
			let x = lastClientX;
			let y = lastClientY;
			if (hContainer === null) x = Math.min(Math.max(x, 1), editorWindow.innerWidth - 1);
			else {
				const rect = hContainer.getBoundingClientRect();
				x = Math.min(Math.max(x, rect.left + 1), rect.right - 1);
			}
			if (vContainer === null) y = Math.min(Math.max(y, 1), editorWindow.innerHeight - 1);
			else {
				const rect = vContainer.getBoundingClientRect();
				y = Math.min(Math.max(y, rect.top + 1), rect.bottom - 1);
			}
			return [x, y];
		};
		const isNearScrollEdge = () => {
			const hContainer = findScrollContainer("x");
			if (hContainer !== null) {
				const rect = hContainer.getBoundingClientRect();
				if (autoScrollStep(lastClientX, rect.left, rect.right) !== 0) return true;
			}
			const vContainer = findScrollContainer("y");
			const vStart = vContainer === null ? 0 : vContainer.getBoundingClientRect().top;
			const vEnd = vContainer === null ? editorWindow.innerHeight : vContainer.getBoundingClientRect().bottom;
			return autoScrollStep(lastClientY, vStart, vEnd) !== 0;
		};
		const tickAutoScroll = () => {
			autoScrollRafId = null;
			if (!tableObserver.isSelecting) return;
			const hContainer = findScrollContainer("x");
			const vContainer = findScrollContainer("y");
			const scrolledX = hContainer !== null && scrollAxis(hContainer, lastClientX, "x");
			const scrolledY = scrollAxis(vContainer, lastClientY, "y");
			if (scrolledX || scrolledY) {
				const [hitX, hitY] = clampHitPoint(hContainer, vContainer);
				const focusCell = resolveFocusCellFromPoint(hitX, hitY);
				if (focusCell) applyFocusCell(focusCell, false);
				autoScrollRafId = editorWindow.requestAnimationFrame(tickAutoScroll);
			}
		};
		const maybeStartAutoScroll = () => {
			if (autoScrollRafId !== null || isTouch && !tableObserver.isPointerDrag || !isNearScrollEdge()) return;
			autoScrollRafId = editorWindow.requestAnimationFrame(tickAutoScroll);
		};
		const onPointerUp = (upEvent) => {
			if (isGesturePointer(upEvent)) stopSelecting();
		};
		const onPointerGestureEnd = (endEvent) => {
			if (isGesturePointer(endEvent)) stopSelecting();
		};
		const onPointerMove = (moveEvent) => {
			if (!isGesturePointer(moveEvent)) return;
			if (!isPointerDownOnEvent(moveEvent) && tableObserver.isSelecting) {
				stopSelecting();
				return;
			}
			const moveTarget = getComposedEventTarget(moveEvent);
			if (!isDOMNode(moveTarget)) return;
			lastClientX = moveEvent.clientX;
			lastClientY = moveEvent.clientY;
			if (!tableObserver.isPointerDrag && isBeyondTapSlop(lastClientX, lastClientY)) tableObserver.isPointerDrag = true;
			let focusCell = null;
			const override = !(IS_FIREFOX || tableElement.contains(moveTarget));
			if (override) focusCell = getDOMCellInTableFromTarget(tableElement, moveTarget);
			else focusCell = resolveFocusCellFromPoint(moveEvent.clientX, moveEvent.clientY);
			if (focusCell) applyFocusCell(focusCell, override);
			maybeStartAutoScroll();
		};
		removeGestureListeners = registerEventListeners(editorWindow, {
			lostpointercapture: onPointerGestureEnd,
			pointercancel: onPointerGestureEnd,
			pointermove: onPointerMove,
			pointerup: onPointerUp
		}, tableObserver.listenerOptions);
	};
	tableObserver.pointerType = event.pointerType;
	const tableNode = $getTableNodeByKeyOrThrow(tableObserver.tableNodeKey);
	const prevSelection = $getPreviousSelection();
	const prevAnchorNestedCell = $isRangeSelection(prevSelection) || $isTableSelection(prevSelection) ? $findCellNode(prevSelection.anchor.getNode()) : null;
	const isShiftClickIntoNestedTable = prevAnchorNestedCell !== null && prevAnchorNestedCell.isParentOf(tableNode);
	if (IS_FIREFOX && event.shiftKey && ($isRangeSelection(prevSelection) || $isTableSelection(prevSelection)) && ($isSelectionInTable(prevSelection, tableNode) || isShiftClickIntoNestedTable)) {
		const prevAnchorNode = prevSelection.anchor.getNode();
		const prevAnchorCell = $findParentTableCellNodeInTable(tableNode, prevSelection.anchor.getNode());
		if (prevAnchorCell) {
			const prevAnchorDOMCell = $getObserverCellFromCellNodeOrThrow(tableObserver, prevAnchorCell);
			if (prevAnchorDOMCell.elem !== selectedDOMCell.elem) {
				tableObserver.$setAnchorCellForSelection(prevAnchorDOMCell);
				tableObserver.$setFocusCellForSelection(selectedDOMCell);
				stopEvent(event);
			} else if (event.pointerType !== "touch") tableObserver.$setAnchorCellForSelection(selectedDOMCell);
		} else {
			(tableNode.isBefore(prevAnchorNode) ? tableNode.selectStart() : tableNode.selectEnd()).anchor.set(prevSelection.anchor.key, prevSelection.anchor.offset, prevSelection.anchor.type);
			stopEvent(event);
		}
	} else if (event.pointerType !== "touch") tableObserver.$setAnchorCellForSelection(selectedDOMCell);
	createPointerHandlers(selectedDOMCell);
}
function applyTableHandlers(tableNode, element, editor, hasTabHandler, tableObservers) {
	const rootElement = editor.getRootElement();
	const editorWindow = getEditorWindow(editor);
	invariant(rootElement !== null && editorWindow !== null, "applyTableHandlers: editor has no root element set");
	const tableObserver = new TableObserver(editor, tableNode.getKey());
	const tableElement = getTableElement(tableNode, element);
	attachTableObserverToTableElement(tableElement, tableObserver);
	tableObserver.listenersToRemove.add(() => detachTableObserverFromTableElement(tableElement, tableObserver));
	const onTripleClick = (event) => {
		const target = getComposedEventTarget(event);
		if (event.detail >= 3 && isDOMNode(target)) {
			if (getDOMCellFromTarget(target) !== null) event.preventDefault();
		}
	};
	tableObserver.listenersToRemove.add(registerEventListener(tableElement, "mousedown", onTripleClick, tableObserver.listenerOptions));
	for (const [command, direction] of ARROW_KEY_COMMANDS_WITH_DIRECTION) tableObserver.listenersToRemove.add(editor.registerCommand(command, (event) => $handleArrowKey(editor, event, direction, tableNode, tableObserver, tableObservers), 3));
	tableObserver.listenersToRemove.add(editor.registerCommand(KEY_ESCAPE_COMMAND, (event) => {
		const selection = $getSelection();
		if ($isTableSelection(selection)) {
			const focusCellNode = $findParentTableCellNodeInTable(tableNode, selection.focus.getNode());
			if (focusCellNode !== null) {
				stopEvent(event);
				focusCellNode.selectEnd();
				return true;
			}
		}
		return false;
	}, 3));
	const $deleteTextHandler = () => {
		const selection = $getSelection();
		if (!$isSelectionInTable(selection, tableNode)) return false;
		if ($isTableSelection(selection)) {
			tableObserver.$clearText();
			return true;
		}
		return false;
	};
	for (const command of DELETE_TEXT_COMMANDS) tableObserver.listenersToRemove.add(editor.registerCommand(command, $deleteTextHandler, 3));
	const $deleteCellHandler = (event) => {
		const selection = $getSelection();
		if (!($isTableSelection(selection) || $isRangeSelection(selection))) return false;
		const isAnchorInside = tableNode.isParentOf(selection.anchor.getNode());
		if (isAnchorInside !== tableNode.isParentOf(selection.focus.getNode())) {
			const tablePoint = isAnchorInside ? "anchor" : "focus";
			const outerPoint = isAnchorInside ? "focus" : "anchor";
			const { key, offset, type } = selection[outerPoint];
			tableNode[selection[tablePoint].isBefore(selection[outerPoint]) ? "selectPrevious" : "selectNext"]()[outerPoint].set(key, offset, type);
			return false;
		}
		if (!$isSelectionInTable(selection, tableNode)) return false;
		if ($isTableSelection(selection)) {
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			tableObserver.$clearText();
			return true;
		}
		return false;
	};
	for (const command of DELETE_KEY_COMMANDS) tableObserver.listenersToRemove.add(editor.registerCommand(command, $deleteCellHandler, 3));
	tableObserver.listenersToRemove.add(editor.registerCommand(CUT_COMMAND, (event) => {
		const selection = $getSelection();
		if (selection) {
			if (!($isTableSelection(selection) || $isRangeSelection(selection))) return false;
			copyToClipboard(editor, objectKlassEquals(event, ClipboardEvent) ? event : null, $getClipboardDataFromSelection(selection));
			const intercepted = $deleteCellHandler(event);
			if ($isRangeSelection(selection)) {
				selection.removeText();
				return true;
			}
			return intercepted;
		}
		return false;
	}, 3));
	const doc = rootElement.ownerDocument;
	tableObserver.listenersToRemove.add(registerEventListener(doc, "paste", (event) => {
		if (event.defaultPrevented) return;
		if (editor.read("latest", () => {
			const selection = $getSelection();
			return rootElement.contains(doc.activeElement) && $isTableSelection(selection) && $isSelectionInTable(selection, tableNode);
		})) {
			event.preventDefault();
			editor.dispatchCommand(PASTE_COMMAND, event);
		}
	}));
	tableObserver.listenersToRemove.add(registerEventListener(doc, "copy", (event) => {
		if (event.defaultPrevented) return;
		const target = getComposedEventTarget(event);
		if (target === rootElement || isDOMNode(target) && rootElement.contains(target)) return;
		if (editor.read("latest", () => {
			const selection = $getSelection();
			return rootElement.contains(getActiveElement(rootElement)) && $isTableSelection(selection) && $isSelectionInTable(selection, tableNode);
		})) {
			event.preventDefault();
			editor.dispatchCommand(COPY_COMMAND, event);
		}
	}));
	tableObserver.listenersToRemove.add(editor.registerCommand(FORMAT_TEXT_COMMAND, (payload) => {
		const selection = $getSelection();
		if (!$isSelectionInTable(selection, tableNode)) return false;
		if ($isTableSelection(selection)) {
			tableObserver.$formatCells(payload);
			return true;
		}
		return false;
	}, 3));
	tableObserver.listenersToRemove.add(editor.registerCommand(FORMAT_ELEMENT_COMMAND, (formatType) => {
		const selection = $getSelection();
		if (!$isTableSelection(selection) || !$isSelectionInTable(selection, tableNode)) return false;
		const anchorNode = selection.anchor.getNode();
		const focusNode = selection.focus.getNode();
		if (!$isTableCellNode(anchorNode) || !$isTableCellNode(focusNode)) return false;
		const [tableMap, anchorCell, focusCell] = $computeTableMap(tableNode, anchorNode, focusNode);
		const { minColumn, maxColumn, minRow, maxRow } = $computeTableCellRectBoundary(tableMap, anchorCell, focusCell);
		if (minRow === 0 && minColumn === 0 && maxRow === tableMap.length - 1 && maxColumn === tableMap[0].length - 1) {
			tableNode.setFormat(formatType);
			return true;
		}
		const visited = /* @__PURE__ */ new Set();
		for (let i = minRow; i <= maxRow; i++) for (let j = minColumn; j <= maxColumn; j++) {
			const cell = tableMap[i][j].cell;
			if (visited.has(cell)) continue;
			visited.add(cell);
			cell.setFormat(formatType);
			const cellChildren = cell.getChildren();
			for (let k = 0; k < cellChildren.length; k++) {
				const child = cellChildren[k];
				if ($isElementNode(child) && !child.isInline()) child.setFormat(formatType);
			}
		}
		return true;
	}, 3));
	tableObserver.listenersToRemove.add(editor.registerCommand(CONTROLLED_TEXT_INSERTION_COMMAND, (payload) => {
		const selection = $getSelection();
		if (!$isSelectionInTable(selection, tableNode)) return false;
		if ($isTableSelection(selection)) {
			tableObserver.$clearHighlight();
			return false;
		} else if ($isRangeSelection(selection)) {
			if (!$isTableCellNode($findMatchingParent(selection.anchor.getNode(), (n) => $isTableCellNode(n)))) return false;
			if (typeof payload === "string") {
				const edgePosition = $getTableEdgeCursorPosition(editor, selection, tableNode);
				if (edgePosition) {
					$insertParagraphAtTableEdge(edgePosition, tableNode, [$createTextNode(payload)]);
					return true;
				}
			}
		}
		return false;
	}, 3));
	if (hasTabHandler) tableObserver.listenersToRemove.add(editor.registerCommand(KEY_TAB_COMMAND, (event) => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection) || !selection.isCollapsed() || !$isSelectionInTable(selection, tableNode)) return false;
		const tableCellNode = $findCellNode(selection.anchor.getNode());
		if (tableCellNode === null || !tableNode.is($findTableNode(tableCellNode))) return false;
		stopEvent(event);
		$selectAdjacentCell(tableCellNode, event.shiftKey ? "previous" : "next");
		return true;
	}, 3));
	tableObserver.listenersToRemove.add(editor.registerCommand(FOCUS_COMMAND, (payload) => {
		return tableNode.isSelected();
	}, 3));
	tableObserver.listenersToRemove.add(editor.registerCommand(INSERT_PARAGRAPH_COMMAND, () => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection) || !selection.isCollapsed() || !$isSelectionInTable(selection, tableNode)) return false;
		const edgePosition = $getTableEdgeCursorPosition(editor, selection, tableNode);
		if (edgePosition) {
			$insertParagraphAtTableEdge(edgePosition, tableNode);
			return true;
		}
		return false;
	}, 3));
	return tableObserver;
}
/** @internal */
function $handleTableSelectionChangeCommand(tableObservers, editor) {
	const selection = $getSelection();
	const prevSelection = $getPreviousSelection();
	const nextFocus = tableObservers.getAndClearNextFocus();
	if (nextFocus !== null && $isTableNode($getNodeByKey(nextFocus.tableKey))) {
		const { tableKey, focusCell } = nextFocus;
		const observerAndTable = tableObservers.observers.get(tableKey);
		invariant(!!observerAndTable, "tableObserver not found for tableKey: %s", tableKey);
		const [tableObserver] = observerAndTable;
		if ($isTableSelection(selection) && selection.tableKey === tableObserver.tableNodeKey) {
			if (focusCell.x === tableObserver.focusX && focusCell.y === tableObserver.focusY) return false;
			else {
				tableObserver.$setFocusCellForSelection(focusCell);
				return true;
			}
		} else if (tableObserver.anchorCell !== null && tableObserver.anchorCellNodeKey !== null && focusCell.elem !== tableObserver.anchorCell.elem && tableObserver.tableSelection !== null) {
			tableObserver.$setFocusCellForSelection(focusCell, true);
			return true;
		}
	}
	const shouldCheckSelectionForTable = tableObservers.getAndClearShouldCheckSelectionForTable();
	if (!!shouldCheckSelectionForTable && $isRangeSelection(prevSelection) && $isRangeSelection(selection) && selection.isCollapsed()) {
		const tableNode = $getNodeByKey(shouldCheckSelectionForTable);
		if ($isTableNode(tableNode)) {
			const anchor = selection.anchor.getNode();
			const firstRow = tableNode.getFirstChild();
			const anchorCell = $findCellNode(anchor);
			if (anchorCell !== null && $isTableRowNode(firstRow)) {
				const firstCell = firstRow.getFirstChild();
				if ($isTableCellNode(firstCell) && tableNode.is($findMatchingParent(anchorCell, (node) => node.is(tableNode) || node.is(firstCell)))) {
					firstCell.selectStart();
					return true;
				}
			}
		}
	}
	if ($isTableSelection(selection)) $fixTableSelectionForSelectedTable(editor, selection);
	if ($isRangeSelection(selection)) $fixRangeSelectionForSelectedTable(selection, tableObservers);
	return false;
}
/** Synchronize selection UI after table DOM and mutation listeners are ready. */
function $syncTableSelectionObservers(tableObservers, editor) {
	for (const [tableNode, tableObserver] of tableObservers.$getTableNodesAndObservers()) $syncTableSelectionState(editor, tableNode, tableObserver);
}
/**
* Handles cases where range selections cross into, out of, or within tables.
*/
function $fixRangeSelectionForSelectedTable(selection, tableObservers) {
	const prevSelection = $getPreviousSelection();
	const { anchor, focus } = selection;
	const anchorNode = anchor.getNode();
	const focusNode = focus.getNode();
	const anchorCellNode = $findCellNode(anchorNode);
	const focusCellNode = $findCellNode(focusNode);
	const anchorCellTable = anchorCellNode ? $findTableNode(anchorCellNode) : null;
	const focusCellTable = focusCellNode ? $findTableNode(focusCellNode) : null;
	const isBackward = selection.isBackward();
	const isSameTable = anchorCellNode && focusCellNode && anchorCellTable && focusCellTable && anchorCellTable.is(focusCellTable);
	const shouldMoveFocus = focusCellTable && (!anchorCellTable || anchorCellTable.isParentOf(focusCellTable));
	const shouldMoveAnchor = anchorCellTable && (!focusCellTable || focusCellTable.isParentOf(anchorCellTable));
	if (shouldMoveFocus) {
		const newSelection = selection.clone();
		const [tableMap] = $computeTableMap(focusCellTable, focusCellNode, focusCellNode);
		const firstCell = tableMap[0][0].cell;
		const lastCell = tableMap[tableMap.length - 1].at(-1).cell;
		newSelection.focus.set(isBackward ? firstCell.getKey() : lastCell.getKey(), isBackward ? 0 : lastCell.getChildrenSize(), "element");
		$setSelection(newSelection);
	} else if (shouldMoveAnchor) {
		const newSelection = selection.clone();
		const [tableMap] = $computeTableMap(anchorCellTable, anchorCellNode, anchorCellNode);
		const firstCell = tableMap[0][0].cell;
		const lastCell = tableMap[tableMap.length - 1].at(-1).cell;
		newSelection.anchor.set(isBackward ? lastCell.getKey() : firstCell.getKey(), isBackward ? lastCell.getChildrenSize() : 0, "element");
		$setSelection(newSelection);
	} else if (isSameTable) {
		if (!anchorCellNode.is(focusCellNode)) {
			$setSelection($createTableSelectionFrom(anchorCellTable, anchorCellNode, focusCellNode));
			return;
		}
		const observerInfo = tableObservers.observers.get(anchorCellTable.getKey());
		if (observerInfo === void 0) return;
		const [tableObserver] = observerInfo;
		if (tableObserver.pointerType === "touch" && tableObserver.isSelecting && tableObserver.isPointerDrag && selection.isCollapsed() && $isRangeSelection(prevSelection) && prevSelection.isCollapsed()) {
			const prevAnchorNode = $getNodeByKey(prevSelection.anchor.key);
			const prevAnchorCellNode = prevAnchorNode && $findCellNode(prevAnchorNode);
			const { pointerStartCell } = tableObserver;
			const pointerStartNode = pointerStartCell && $getNearestNodeFromDOMNode(pointerStartCell.elem);
			if (pointerStartNode !== null && !pointerStartNode.is(focusCellNode) && prevAnchorCellNode && anchorCellTable.is($findTableNode(prevAnchorCellNode)) && !prevAnchorCellNode.is(focusCellNode)) {
				$setSelection($createTableSelectionFrom(anchorCellTable, prevAnchorCellNode, focusCellNode));
				tableObserver.pointerType = null;
			}
		}
	}
}
/**
* Ensures that a TableSelection is automatically changed to a RangeSelection when the selection goes outside of the table.
*/
function $fixTableSelectionForSelectedTable(editor, selection) {
	const editorWindow = getEditorWindow(editor);
	const prevSelection = $getPreviousSelection();
	if (!selection.is(prevSelection)) return;
	const tableNode = $getTableNodeByKeyOrThrow(selection.tableKey);
	const domSelection = getDOMSelection(editorWindow);
	const points = domSelection && getDOMSelectionPoints(domSelection, editor.getRootElement());
	if (domSelection && points && points.anchorNode && points.focusNode) {
		const focusNode = $getNearestNodeFromDOMNode(points.focusNode);
		const isFocusOutside = focusNode && !tableNode.isParentOf(focusNode);
		const anchorNode = $getNearestNodeFromDOMNode(points.anchorNode);
		const isAnchorInside = anchorNode && tableNode.isParentOf(anchorNode);
		if (isFocusOutside && isAnchorInside && domSelection.rangeCount > 0) {
			const newSelection = $createRangeSelectionFromDom(domSelection, editor);
			if (newSelection) {
				newSelection.anchor.set(tableNode.getKey(), selection.isBackward() ? tableNode.getChildrenSize() : 0, "element");
				domSelection.removeAllRanges();
				$setSelection(newSelection);
			}
		}
	}
}
function $syncTableSelectionState(editor, tableNode, tableObserver) {
	const selection = $getSelection();
	const isSelected = tableNode.isSelected();
	if (!($isTableSelection(selection) && selection.tableKey === tableNode.getKey()) && !tableObserver.isHighlightingCells && !tableObserver.hasHijackedSelectionStyles && !isSelected) return;
	const { tableElement } = tableObserver.$lookup();
	tableObserver.table = getTable(tableNode, tableElement);
	if ($isTableSelection(selection) && selection.tableKey === tableNode.getKey()) {
		const anchor = $getNodeByKey(selection.anchor.key);
		const focus = $getNodeByKey(selection.focus.key);
		if ($isTableCellNode(anchor) && $isTableCellNode(focus)) {
			const anchorCell = $getObserverCellFromCellNodeOrThrow(tableObserver, anchor);
			const focusCell = $getObserverCellFromCellNodeOrThrow(tableObserver, focus);
			tableObserver.anchorCell = anchorCell;
			tableObserver.anchorCellNodeKey = anchor.getKey();
			tableObserver.anchorX = anchorCell.x;
			tableObserver.anchorY = anchorCell.y;
			tableObserver.focusCell = focusCell;
			tableObserver.focusCellNodeKey = focus.getKey();
			tableObserver.focusX = focusCell.x;
			tableObserver.focusY = focusCell.y;
		}
		tableObserver.$updateTableTableSelection(selection);
	} else if (tableObserver.isHighlightingCells) tableObserver.$clearHighlight(false);
	if (tableObserver.hasHijackedSelectionStyles && !isSelected) $removeHighlightStyleToTable(editor, tableObserver);
	else if (!tableObserver.hasHijackedSelectionStyles && isSelected) $addHighlightStyleToTable(editor, tableObserver);
}
function detachTableObserverFromTableElement(tableElement, tableObserver) {
	if (getTableObserverFromTableElement(tableElement) === tableObserver) delete tableElement[LEXICAL_ELEMENT_KEY];
}
function attachTableObserverToTableElement(tableElement, tableObserver) {
	invariant(getTableObserverFromTableElement(tableElement) === null, "tableElement already has an attached TableObserver");
	tableElement[LEXICAL_ELEMENT_KEY] = tableObserver;
}
function getTableObserverFromTableElement(tableElement) {
	return tableElement[LEXICAL_ELEMENT_KEY] || null;
}
function getTableObserverFromCellNode(node) {
	const cellNode = getDOMCellFromTarget(node);
	if (cellNode === null) return null;
	let currentNode = cellNode.elem;
	while (currentNode != null) {
		if (currentNode.nodeName === "TABLE" && LEXICAL_ELEMENT_KEY in currentNode && !!currentNode[LEXICAL_ELEMENT_KEY]) return {
			cellElement: cellNode,
			tableElement: currentNode,
			tableObserver: currentNode[LEXICAL_ELEMENT_KEY]
		};
		currentNode = currentNode.parentNode;
	}
	return null;
}
function getDOMCellFromTarget(node) {
	let currentNode = node;
	while (currentNode != null) {
		const nodeName = currentNode.nodeName;
		if (nodeName === "TD" || nodeName === "TH") {
			const cell = currentNode._cell;
			if (cell === void 0) return null;
			return cell;
		}
		currentNode = currentNode.parentNode;
	}
	return null;
}
function getDOMCellInTableFromTarget(table, node) {
	if (!table.contains(node)) return null;
	let cell = null;
	for (let currentNode = node; currentNode != null; currentNode = currentNode.parentNode) {
		if (currentNode === table) return cell;
		const nodeName = currentNode.nodeName;
		if (nodeName === "TD" || nodeName === "TH") cell = currentNode._cell || null;
	}
	return null;
}
function getTable(tableNode, dom) {
	const tableElement = getTableElement(tableNode, dom);
	const domRows = [];
	const grid = {
		columns: 0,
		domRows,
		rows: 0
	};
	let currentNode = tableElement.querySelector("tr");
	let x = 0;
	let y = 0;
	domRows.length = 0;
	while (currentNode != null) {
		const nodeMame = currentNode.nodeName;
		if (nodeMame === "TD" || nodeMame === "TH") {
			const elem = currentNode;
			const cell = {
				elem,
				hasBackgroundColor: elem.style.backgroundColor !== "",
				highlighted: false,
				x,
				y
			};
			currentNode._cell = cell;
			let row = domRows[y];
			if (row === void 0) row = domRows[y] = [];
			row[x] = cell;
		} else {
			const child = currentNode.firstChild;
			if (child != null) {
				currentNode = child;
				continue;
			}
		}
		const sibling = currentNode.nextSibling;
		if (sibling != null) {
			x++;
			currentNode = sibling;
			continue;
		}
		const parent = currentNode.parentNode;
		if (parent != null) {
			const parentSibling = parent.nextSibling;
			if (parentSibling == null) break;
			y++;
			x = 0;
			currentNode = parentSibling;
		}
	}
	grid.columns = x + 1;
	grid.rows = y + 1;
	return grid;
}
function $updateDOMForSelection(editor, table, selection) {
	const selectedCellNodes = new Set(selection ? selection.getNodes() : []);
	$forEachTableCell(table, (cell, lexicalNode) => {
		const elem = cell.elem;
		if (selectedCellNodes.has(lexicalNode)) {
			cell.highlighted = true;
			$addHighlightToDOM(editor, cell);
		} else {
			cell.highlighted = false;
			$removeHighlightFromDOM(editor, cell);
			if (!elem.getAttribute("style")) elem.removeAttribute("style");
		}
	});
}
function $forEachTableCell(grid, cb) {
	const { domRows } = grid;
	for (let y = 0; y < domRows.length; y++) {
		const row = domRows[y];
		if (!row) continue;
		for (let x = 0; x < row.length; x++) {
			const cell = row[x];
			if (!cell) continue;
			const lexicalNode = $getNearestNodeFromDOMNode(cell.elem);
			if (lexicalNode !== null) cb(cell, lexicalNode, {
				x,
				y
			});
		}
	}
}
function $addHighlightStyleToTable(editor, tableSelection) {
	tableSelection.$disableHighlightStyle();
	$forEachTableCell(tableSelection.table, (cell) => {
		cell.highlighted = true;
		$addHighlightToDOM(editor, cell);
	});
}
function $removeHighlightStyleToTable(editor, tableObserver) {
	tableObserver.$enableHighlightStyle();
	$forEachTableCell(tableObserver.table, (cell) => {
		const elem = cell.elem;
		cell.highlighted = false;
		$removeHighlightFromDOM(editor, cell);
		if (!elem.getAttribute("style")) elem.removeAttribute("style");
	});
}
function $selectAdjacentCell(tableCellNode, direction) {
	const siblingMethod = direction === "next" ? "getNextSibling" : "getPreviousSibling";
	const childMethod = direction === "next" ? "getFirstChild" : "getLastChild";
	const sibling = tableCellNode[siblingMethod]();
	if ($isElementNode(sibling)) return sibling.selectEnd();
	const parentRow = $findMatchingParent(tableCellNode, $isTableRowNode);
	invariant(parentRow !== null, "selectAdjacentCell: Cell not in table row");
	for (let nextRow = parentRow[siblingMethod](); $isTableRowNode(nextRow); nextRow = nextRow[siblingMethod]()) {
		const child = nextRow[childMethod]();
		if ($isElementNode(child)) return child.selectEnd();
	}
	const parentTable = $findMatchingParent(parentRow, $isTableNode);
	invariant(parentTable !== null, "selectAdjacentCell: Row not in table");
	return direction === "next" ? parentTable.selectNext() : parentTable.selectPrevious();
}
var selectTableNodeInDirection = (tableObserver, tableNode, x, y, direction) => {
	const isForward = direction === "forward";
	switch (direction) {
		case "backward":
		case "forward":
			if (x !== (isForward ? tableObserver.table.columns - 1 : 0)) selectTableCellNode(tableNode.getCellNodeFromCordsOrThrow(x + (isForward ? 1 : -1), y, tableObserver.table), isForward);
			else if (y !== (isForward ? tableObserver.table.rows - 1 : 0)) selectTableCellNode(tableNode.getCellNodeFromCordsOrThrow(isForward ? 0 : tableObserver.table.columns - 1, y + (isForward ? 1 : -1), tableObserver.table), isForward);
			else if (!isForward) tableNode.selectPrevious();
			else tableNode.selectNext();
			return true;
		case "up":
			if (y !== 0) selectTableCellNode(tableNode.getCellNodeFromCordsOrThrow(x, y - 1, tableObserver.table), false);
			else tableNode.selectPrevious();
			return true;
		case "down":
			if (y !== tableObserver.table.rows - 1) selectTableCellNode(tableNode.getCellNodeFromCordsOrThrow(x, y + 1, tableObserver.table), true);
			else tableNode.selectNext();
			return true;
		default: return false;
	}
};
function getCorner(rect, cellValue) {
	let colName;
	let rowName;
	if (cellValue.startColumn === rect.minColumn) colName = "minColumn";
	else if (cellValue.startColumn + cellValue.cell.__colSpan - 1 === rect.maxColumn) colName = "maxColumn";
	else return null;
	if (cellValue.startRow === rect.minRow) rowName = "minRow";
	else if (cellValue.startRow + cellValue.cell.__rowSpan - 1 === rect.maxRow) rowName = "maxRow";
	else return null;
	return [colName, rowName];
}
/**
* Resolve the corner of `rect` that the anchor sits on.
*
* `$computeTableCellRectBoundary` grows the rect until it contains every
* merged cell that straddles an edge, so the anchor is not guaranteed to be at
* a corner of the result — a cell merged across the rect's edge pushes that
* edge past the anchor. Fall back to the corner opposite the focus, and when
* the focus is not at a corner either, to the top-left.
*
* TODO the last fallback doesn't have to be arbitrary, use the closest corner
* instead.
*/
function getAnchorCorner(rect, anchorCellValue, focusCellValue) {
	const anchorCorner = getCorner(rect, anchorCellValue);
	if (anchorCorner) return anchorCorner;
	const focusCorner = getCorner(rect, focusCellValue);
	if (focusCorner) return oppositeCorner(focusCorner);
	return ["minColumn", "minRow"];
}
function oppositeCorner([colName, rowName]) {
	return [colName === "minColumn" ? "maxColumn" : "minColumn", rowName === "minRow" ? "maxRow" : "minRow"];
}
function cellAtCornerOrThrow(tableMap, rect, [colName, rowName]) {
	const rowNum = rect[rowName];
	const rowMap = tableMap[rowNum];
	invariant(rowMap !== void 0, "cellAtCornerOrThrow: %s = %s missing in tableMap", rowName, String(rowNum));
	const colNum = rect[colName];
	const cell = rowMap[colNum];
	invariant(cell !== void 0, "cellAtCornerOrThrow: %s = %s missing in tableMap", colName, String(colNum));
	return cell;
}
function $extractRectCorners(tableMap, anchorCellValue, newFocusCellValue) {
	const rect = $computeTableCellRectBoundary(tableMap, anchorCellValue, newFocusCellValue);
	const anchorCorner = getAnchorCorner(rect, anchorCellValue, newFocusCellValue);
	return [cellAtCornerOrThrow(tableMap, rect, anchorCorner), cellAtCornerOrThrow(tableMap, rect, oppositeCorner(anchorCorner))];
}
function $adjustFocusInDirection(tableObserver, tableMap, anchorCellValue, focusCellValue, direction) {
	const rect = $computeTableCellRectBoundary(tableMap, anchorCellValue, focusCellValue);
	const { topSpan, leftSpan, bottomSpan, rightSpan } = $computeTableCellRectSpans(tableMap, rect);
	const [focusColumn, focusRow] = oppositeCorner(getAnchorCorner(rect, anchorCellValue, focusCellValue));
	let fCol = rect[focusColumn];
	let fRow = rect[focusRow];
	if (direction === "forward") fCol += focusColumn === "maxColumn" ? 1 : leftSpan;
	else if (direction === "backward") fCol -= focusColumn === "minColumn" ? 1 : rightSpan;
	else if (direction === "down") fRow += focusRow === "maxRow" ? 1 : topSpan;
	else if (direction === "up") fRow -= focusRow === "minRow" ? 1 : bottomSpan;
	const targetRowMap = tableMap[fRow];
	if (targetRowMap === void 0) return false;
	const newFocusCellValue = targetRowMap[fCol];
	if (newFocusCellValue === void 0) return false;
	const [finalAnchorCell, finalFocusCell] = $extractRectCorners(tableMap, anchorCellValue, newFocusCellValue);
	const anchorDOM = $getObserverCellFromCellNodeOrThrow(tableObserver, finalAnchorCell.cell);
	const focusDOM = $getObserverCellFromCellNodeOrThrow(tableObserver, finalFocusCell.cell);
	tableObserver.$setAnchorCellForSelection(anchorDOM);
	tableObserver.$setFocusCellForSelection(focusDOM, true);
	return true;
}
function $isSelectionInTable(selection, tableNode) {
	if ($isRangeSelection(selection) || $isTableSelection(selection)) {
		const isAnchorInside = tableNode.isParentOf(selection.anchor.getNode());
		const isFocusInside = tableNode.isParentOf(selection.focus.getNode());
		return isAnchorInside && isFocusInside;
	}
	return false;
}
function selectTableCellNode(tableCell, fromStart) {
	if (fromStart) tableCell.selectStart();
	else tableCell.selectEnd();
}
function $addHighlightToDOM(editor, cell) {
	const element = cell.elem;
	const editorThemeClasses = editor._config.theme;
	const node = $getNearestNodeFromDOMNode(element);
	invariant($isTableCellNode(node), "Expected to find LexicalNode from Table Cell DOMNode");
	addClassNamesToElement(element, editorThemeClasses.tableCellSelected);
}
function $removeHighlightFromDOM(editor, cell) {
	const element = cell.elem;
	const node = $getNearestNodeFromDOMNode(element);
	invariant($isTableCellNode(node), "Expected to find LexicalNode from Table Cell DOMNode");
	const editorThemeClasses = editor._config.theme;
	removeClassNamesFromElement(element, editorThemeClasses.tableCellSelected);
}
function $findCellNode(node) {
	const cellNode = $findMatchingParent(node, $isTableCellNode);
	return $isTableCellNode(cellNode) ? cellNode : null;
}
function $findTableNode(node) {
	const tableNode = $findMatchingParent(node, $isTableNode);
	return $isTableNode(tableNode) ? tableNode : null;
}
function $getBlockParentIfFirstNode(node) {
	for (let prevNode = node, currentNode = node; currentNode !== null; prevNode = currentNode, currentNode = currentNode.getParent()) if ($isElementNode(currentNode)) {
		if (currentNode !== prevNode && currentNode.getFirstChild() !== prevNode) return null;
		else if (!currentNode.isInline()) return currentNode;
	}
	return null;
}
function $handleHorizontalArrowKeyRangeSelection(editor, event, selection, alter, isBackward, tableNode, tableObserver) {
	const initialFocus = $caretFromPoint(selection.focus, isBackward ? "previous" : "next");
	if ($isExtendableTextPointCaret(initialFocus)) return false;
	let lastCaret = initialFocus;
	for (const nextCaret of $extendCaretToRange(initialFocus).iterNodeCarets("shadowRoot")) {
		if (!($isSiblingCaret(nextCaret) && $isElementNode(nextCaret.origin))) return false;
		lastCaret = nextCaret;
	}
	const lastCaretParent = lastCaret.getParentAtCaret();
	if (!$isTableCellNode(lastCaretParent)) return false;
	const anchorCell = lastCaretParent;
	const focusCaret = $findNextTableCell($getSiblingCaret(anchorCell, lastCaret.direction));
	const anchorCellTable = $findMatchingParent(anchorCell, $isTableNode);
	if (!(anchorCellTable && anchorCellTable.is(tableNode))) return false;
	const anchorCellDOM = editor.getElementByKey(anchorCell.getKey());
	const anchorDOMCell = getDOMCellFromTarget(anchorCellDOM);
	if (!anchorCellDOM || !anchorDOMCell) return false;
	tableObserver.table = $getElementForTableNode(editor, anchorCellTable);
	if (!focusCaret) {
		if (alter === "extend") {
			tableObserver.$setAnchorCellForSelection(anchorDOMCell);
			tableObserver.$setFocusCellForSelection(anchorDOMCell, true);
		} else {
			const outerFocusCaret = $getTableExitCaret($getSiblingCaret(anchorCellTable, initialFocus.direction));
			$setPointFromCaret(selection.anchor, outerFocusCaret);
			$setPointFromCaret(selection.focus, outerFocusCaret);
		}
	} else if (alter === "extend") {
		const focusDOMCell = getDOMCellFromTarget(editor.getElementByKey(focusCaret.origin.getKey()));
		if (!focusDOMCell) return false;
		tableObserver.$setAnchorCellForSelection(anchorDOMCell);
		tableObserver.$setFocusCellForSelection(focusDOMCell, true);
	} else {
		const innerFocusCaret = $normalizeCaret(focusCaret);
		$setPointFromCaret(selection.anchor, innerFocusCaret);
		$setPointFromCaret(selection.focus, innerFocusCaret);
	}
	stopEvent(event);
	return true;
}
function $getTableExitCaret(initialCaret) {
	const adjacent = $getAdjacentChildCaret(initialCaret);
	return $isChildCaret(adjacent) ? $normalizeCaret(adjacent) : initialCaret;
}
function $findNextTableCell(initialCaret) {
	for (const nextCaret of $extendCaretToRange(initialCaret).iterNodeCarets("root")) {
		const { origin } = nextCaret;
		if ($isTableCellNode(origin)) {
			if ($isChildCaret(nextCaret)) return $getChildCaret(origin, initialCaret.direction);
		} else if (!$isTableRowNode(origin)) break;
	}
	return null;
}
/**
* True when the selection focus sits before `tableNode` in document order —
* the only side an ArrowDown can move the caret into the table from.
*/
function $isSelectionBeforeTable(selection, tableNode) {
	if (!$isRangeSelection(selection)) return false;
	const focusCaret = $caretFromPoint(selection.focus, "next");
	const tableCaret = $getChildCaret(tableNode, "next");
	return $getCommonAncestor(focusCaret.origin, tableCaret.origin) !== null && $comparePointCaretNext(focusCaret, tableCaret) < 0;
}
function $handleArrowKey(editor, event, direction, tableNode, tableObserver, tableObservers) {
	if ((direction === "up" || direction === "down") && isTypeaheadMenuInView(editor)) return false;
	const selection = $getSelection();
	if (!$isSelectionInTable(selection, tableNode)) {
		if ($isRangeSelection(selection)) {
			if (direction === "backward") {
				if (selection.focus.offset > 0) return false;
				const parentNode = $getBlockParentIfFirstNode(selection.focus.getNode());
				if (!parentNode) return false;
				const siblingNode = parentNode.getPreviousSibling();
				if (!$isTableNode(siblingNode)) return false;
				stopEvent(event);
				if (event.shiftKey) selection.focus.set(siblingNode.getParentOrThrow().getKey(), siblingNode.getIndexWithinParent(), "element");
				else siblingNode.selectEnd();
				return true;
			} else if (event.shiftKey && (direction === "up" || direction === "down")) {
				const focusNode = selection.focus.getNode();
				if (!selection.isCollapsed() && (direction === "up" && !selection.isBackward() || direction === "down" && selection.isBackward())) {
					let focusParentNode = $findMatchingParent(focusNode, (n) => $isTableNode(n));
					if ($isTableCellNode(focusParentNode)) focusParentNode = $findMatchingParent(focusParentNode, $isTableNode);
					if (focusParentNode !== tableNode) return false;
					if (!focusParentNode) return false;
					const sibling = direction === "down" ? focusParentNode.getNextSibling() : focusParentNode.getPreviousSibling();
					if (!sibling) return false;
					let newOffset = 0;
					if (direction === "up") {
						if ($isElementNode(sibling)) newOffset = sibling.getChildrenSize();
					}
					let newFocusNode = sibling;
					if (direction === "up") {
						if ($isElementNode(sibling)) {
							const lastCell = sibling.getLastChild();
							newFocusNode = lastCell ? lastCell : sibling;
							newOffset = $isTextNode(newFocusNode) ? newFocusNode.getTextContentSize() : 0;
						}
					}
					const newSelection = selection.clone();
					newSelection.focus.set(newFocusNode.getKey(), newOffset, $isTextNode(newFocusNode) ? "text" : "element");
					$setSelection(newSelection);
					stopEvent(event);
					return true;
				} else if ($isRootOrShadowRoot(focusNode)) {
					const selectedNode = direction === "up" ? selection.getNodes()[selection.getNodes().length - 1] : selection.getNodes()[0];
					if (selectedNode) {
						if ($findParentTableCellNodeInTable(tableNode, selectedNode) !== null) {
							const firstDescendant = tableNode.getFirstDescendant();
							const lastDescendant = tableNode.getLastDescendant();
							if (!firstDescendant || !lastDescendant) return false;
							const [firstCellNode] = $getNodeTriplet(firstDescendant);
							const [lastCellNode] = $getNodeTriplet(lastDescendant);
							const firstCellCoords = tableNode.getCordsFromCellNode(firstCellNode, tableObserver.table);
							const lastCellCoords = tableNode.getCordsFromCellNode(lastCellNode, tableObserver.table);
							const firstCellDOM = tableNode.getDOMCellFromCordsOrThrow(firstCellCoords.x, firstCellCoords.y, tableObserver.table);
							const lastCellDOM = tableNode.getDOMCellFromCordsOrThrow(lastCellCoords.x, lastCellCoords.y, tableObserver.table);
							tableObserver.$setAnchorCellForSelection(firstCellDOM);
							tableObserver.$setFocusCellForSelection(lastCellDOM, true);
							return true;
						}
					}
					return false;
				} else {
					let focusParentNode = $findMatchingParent(focusNode, (n) => $isElementNode(n) && !n.isInline());
					if ($isTableCellNode(focusParentNode)) focusParentNode = $findMatchingParent(focusParentNode, $isTableNode);
					if (!focusParentNode) return false;
					const sibling = direction === "down" ? focusParentNode.getNextSibling() : focusParentNode.getPreviousSibling();
					if ($isTableNode(sibling) && tableObserver.tableNodeKey === sibling.getKey()) {
						const firstDescendant = sibling.getFirstDescendant();
						const lastDescendant = sibling.getLastDescendant();
						if (!firstDescendant || !lastDescendant) return false;
						const [firstCellNode] = $getNodeTriplet(firstDescendant);
						const [lastCellNode] = $getNodeTriplet(lastDescendant);
						const newSelection = selection.clone();
						newSelection.focus.set((direction === "up" ? firstCellNode : lastCellNode).getKey(), direction === "up" ? 0 : lastCellNode.getChildrenSize(), "element");
						stopEvent(event);
						$setSelection(newSelection);
						return true;
					}
				}
			}
		}
		if (direction === "down" && $isScrollableTablesActive(editor) && $isSelectionBeforeTable(selection, tableNode)) tableObservers.setShouldCheckSelectionForTable(tableNode.getKey());
		return false;
	}
	if ($isRangeSelection(selection)) {
		if (direction === "backward" || direction === "forward") return $handleHorizontalArrowKeyRangeSelection(editor, event, selection, event.shiftKey ? "extend" : "move", direction === "backward", tableNode, tableObserver);
		if (selection.isCollapsed()) {
			const { anchor, focus } = selection;
			const anchorCellNode = $findMatchingParent(anchor.getNode(), $isTableCellNode);
			const focusCellNode = $findMatchingParent(focus.getNode(), $isTableCellNode);
			if (!$isTableCellNode(anchorCellNode) || !anchorCellNode.is(focusCellNode)) return false;
			const anchorCellTable = $findTableNode(anchorCellNode);
			if (anchorCellTable !== tableNode && anchorCellTable != null) {
				const anchorCellTableElement = getTableElement(anchorCellTable, editor.getElementByKey(anchorCellTable.getKey()));
				if (anchorCellTableElement != null) {
					tableObserver.table = getTable(anchorCellTable, anchorCellTableElement);
					return $handleArrowKey(editor, event, direction, anchorCellTable, tableObserver, tableObservers);
				}
			}
			const anchorCellDom = editor.getElementByKey(anchorCellNode.__key);
			const anchorDOM = editor.getElementByKey(anchor.key);
			if (anchorDOM == null || anchorCellDom == null) return false;
			let edgeSelectionRect;
			if (anchor.type === "element") edgeSelectionRect = anchorDOM.getBoundingClientRect();
			else {
				const domSelection = getDOMSelection(getEditorWindow(editor));
				if (domSelection === null || domSelection.rangeCount === 0) return false;
				const range = getDOMSelectionRange(domSelection, editor.getRootElement());
				if (range === null) return false;
				edgeSelectionRect = range.getBoundingClientRect();
			}
			const edgeChild = direction === "up" ? anchorCellNode.getFirstChild() : anchorCellNode.getLastChild();
			if (edgeChild == null) return false;
			const edgeChildDOM = editor.getElementByKey(edgeChild.__key);
			if (edgeChildDOM == null) return false;
			const edgeRect = edgeChildDOM.getBoundingClientRect();
			if (direction === "up" ? edgeRect.top > edgeSelectionRect.top - edgeSelectionRect.height : edgeSelectionRect.bottom + edgeSelectionRect.height > edgeRect.bottom) {
				stopEvent(event);
				const cords = tableNode.getCordsFromCellNode(anchorCellNode, tableObserver.table);
				if (event.shiftKey) {
					const cell = tableNode.getDOMCellFromCordsOrThrow(cords.x, cords.y, tableObserver.table);
					tableObserver.$setAnchorCellForSelection(cell);
					tableObserver.$setFocusCellForSelection(cell, true);
				} else return selectTableNodeInDirection(tableObserver, tableNode, cords.x, cords.y, direction);
				return true;
			}
		}
	} else if ($isTableSelection(selection)) {
		const { anchor, focus, tableKey } = selection;
		if (tableKey !== tableNode.getKey()) return false;
		const anchorCellNode = $findMatchingParent(anchor.getNode(), $isTableCellNode);
		const focusCellNode = $findMatchingParent(focus.getNode(), $isTableCellNode);
		const [tableNodeFromSelection] = selection.getNodes();
		invariant($isTableNode(tableNodeFromSelection), "$handleArrowKey: TableSelection.getNodes()[0] expected to be TableNode");
		const tableElement = getTableElement(tableNodeFromSelection, editor.getElementByKey(tableNodeFromSelection.getKey()));
		if (!$isTableCellNode(anchorCellNode) || !$isTableCellNode(focusCellNode) || !$isTableNode(tableNodeFromSelection) || tableElement == null) return false;
		tableObserver.$updateTableTableSelection(selection);
		const grid = getTable(tableNodeFromSelection, tableElement);
		const cordsAnchor = tableNode.getCordsFromCellNode(anchorCellNode, grid);
		const anchorCell = tableNode.getDOMCellFromCordsOrThrow(cordsAnchor.x, cordsAnchor.y, grid);
		tableObserver.$setAnchorCellForSelection(anchorCell);
		stopEvent(event);
		if (event.shiftKey) {
			const [tableMap, anchorValue, focusValue] = $computeTableMap(tableNode, anchorCellNode, focusCellNode);
			return $adjustFocusInDirection(tableObserver, tableMap, anchorValue, focusValue, direction);
		} else focusCellNode.selectEnd();
		return true;
	}
	return false;
}
function stopEvent(event) {
	event.preventDefault();
	event.stopImmediatePropagation();
	event.stopPropagation();
}
function isTypeaheadMenuInView(editor) {
	const root = editor.getRootElement();
	if (!root) return false;
	return root.hasAttribute("aria-controls") && root.getAttribute("aria-controls") === "typeahead-menu";
}
function $insertParagraphAtTableEdge(edgePosition, tableNode, children) {
	const paragraphNode = $createParagraphNode();
	if (edgePosition === "first") tableNode.insertBefore(paragraphNode);
	else tableNode.insertAfter(paragraphNode);
	paragraphNode.append(...children || []);
	paragraphNode.selectEnd();
}
function $getTableEdgeCursorPosition(editor, selection, tableNode) {
	const tableNodeParent = tableNode.getParent();
	if (!tableNodeParent) return;
	const domSelection = getDOMSelection(getEditorWindow(editor));
	if (!domSelection) return;
	const domAnchorNode = getDOMSelectionPoints(domSelection, editor.getRootElement()).anchorNode;
	const tableNodeParentDOM = editor.getElementByKey(tableNodeParent.getKey());
	const tableElement = getTableElement(tableNode, editor.getElementByKey(tableNode.getKey()));
	if (!domAnchorNode || !tableNodeParentDOM || !tableElement || !tableNodeParentDOM.contains(domAnchorNode) || tableElement.contains(domAnchorNode)) return;
	const anchorCellNode = $findMatchingParent(selection.anchor.getNode(), (n) => $isTableCellNode(n));
	if (!anchorCellNode) return;
	const parentTable = $findMatchingParent(anchorCellNode, (n) => $isTableNode(n));
	if (!$isTableNode(parentTable) || !parentTable.is(tableNode)) return;
	const [tableMap, cellValue] = $computeTableMap(tableNode, anchorCellNode, anchorCellNode);
	const firstCell = tableMap[0][0];
	const lastCell = tableMap[tableMap.length - 1][tableMap[0].length - 1];
	const { startRow, startColumn } = cellValue;
	const isAtFirstCell = startRow === firstCell.startRow && startColumn === firstCell.startColumn;
	const isAtLastCell = startRow === lastCell.startRow && startColumn === lastCell.startColumn;
	if (isAtFirstCell) return "first";
	else if (isAtLastCell) return "last";
	else return;
}
function $getObserverCellFromCellNodeOrThrow(tableObserver, tableCellNode) {
	const { tableNode } = tableObserver.$lookup();
	const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableObserver.table);
	return tableNode.getDOMCellFromCordsOrThrow(currentCords.x, currentCords.y, tableObserver.table);
}
function $getNearestTableCellInTableFromDOMNode(tableNode, startingDOM, editorState) {
	return $findParentTableCellNodeInTable(tableNode, $getNearestNodeFromDOMNode(startingDOM, editorState));
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableNode.ts
function isHTMLDivElement(element) {
	return isHTMLElement(element) && element.nodeName === "DIV";
}
var tableNodeSchema = nodeSchema()({
	colWidths: withAccessors(optional(arrayValue(numberValue())), { getter: { field: "__colWidths" } }),
	frozenColumnCount: withAccessors(numberValue(), {
		getter: "getSerializedFrozenColumnCount",
		setter: {
			field: "__frozenColumnCount",
			method: "setFrozenColumns"
		}
	}),
	frozenRowCount: withAccessors(numberValue(), {
		getter: "getSerializedFrozenRowCount",
		setter: {
			field: "__frozenRowCount",
			method: "setFrozenRows"
		}
	}),
	rowStriping: withAccessors(booleanValue(), {
		getter: "getSerializedRowStriping",
		setter: { field: "__rowStriping" }
	})
});
function $updateColgroup(dom, colCount, colWidths) {
	let colGroup = dom.querySelector(":scope > colgroup");
	if (!colWidths) {
		if (colGroup) colGroup.remove();
		return;
	}
	if (!colGroup) {
		colGroup = $getDocument().createElement("colgroup");
		setDOMUnmanaged(colGroup);
		dom.insertBefore(colGroup, dom.firstChild);
	}
	const cols = [];
	for (let i = 0; i < colCount; i++) {
		const col = $getDocument().createElement("col");
		const width = colWidths[i];
		if (width) col.style.width = `${width}px`;
		cols.push(col);
	}
	colGroup.replaceChildren(...cols);
}
function setRowStriping(dom, config, rowStriping) {
	if (rowStriping) {
		addClassNamesToElement(dom, config.theme.tableRowStriping);
		dom.setAttribute("data-lexical-row-striping", "true");
	} else {
		removeClassNamesFromElement(dom, config.theme.tableRowStriping);
		dom.removeAttribute("data-lexical-row-striping");
	}
}
function setFrozenColumns(dom, tableElement, config, frozenColumnCount) {
	if (frozenColumnCount > 0) {
		addClassNamesToElement(dom, config.theme.tableFrozenColumn);
		tableElement.setAttribute("data-lexical-frozen-column", "true");
	} else {
		removeClassNamesFromElement(dom, config.theme.tableFrozenColumn);
		tableElement.removeAttribute("data-lexical-frozen-column");
	}
}
function setFrozenRows(dom, tableElement, config, frozenRowCount) {
	if (frozenRowCount > 0) {
		addClassNamesToElement(dom, config.theme.tableFrozenRow);
		tableElement.setAttribute("data-lexical-frozen-row", "true");
	} else {
		removeClassNamesFromElement(dom, config.theme.tableFrozenRow);
		tableElement.removeAttribute("data-lexical-frozen-row");
	}
}
function alignTableElement(dom, config, formatType) {
	if (!config.theme.tableAlignment) return;
	const removeClasses = [];
	const addClasses = [];
	for (const format of ["center", "right"]) {
		const classes = config.theme.tableAlignment[format];
		if (!classes) continue;
		(format === formatType ? addClasses : removeClasses).push(classes);
	}
	removeClassNamesFromElement(dom, ...removeClasses);
	addClassNamesToElement(dom, ...addClasses);
}
function $createScrollableWrapper(tableElement, config, hideNativeScrollbar) {
	const wrapper = $getDocument().createElement("div");
	const classes = config.theme.tableScrollableWrapper;
	if (classes) addClassNamesToElement(wrapper, classes);
	else wrapper.style.overflowX = "auto";
	if (hideNativeScrollbar) wrapper.style.scrollbarWidth = "none";
	wrapper.appendChild(tableElement);
	return wrapper;
}
function $createStickyScrollbar(config) {
	const doc = $getDocument();
	const scrollbar = doc.createElement("div");
	const classes = config.theme.tableStickyScrollbar;
	if (classes) addClassNamesToElement(scrollbar, classes);
	else {
		scrollbar.style.position = "sticky";
		scrollbar.style.bottom = "0";
		scrollbar.style.overflowX = "scroll";
		scrollbar.style.overflowY = "hidden";
	}
	scrollbar.style.display = "none";
	scrollbar.setAttribute("aria-hidden", "true");
	scrollbar.tabIndex = -1;
	const spacer = doc.createElement("div");
	spacer.style.height = "1px";
	spacer.style.width = "0px";
	scrollbar.appendChild(spacer);
	return scrollbar;
}
var overlayStickyScrollbars = /* @__PURE__ */ new WeakSet();
function measureScrollbarThickness(scrollbar) {
	const prevDisplay = scrollbar.style.display;
	scrollbar.style.display = "";
	const thickness = scrollbar.offsetHeight - scrollbar.clientHeight;
	scrollbar.style.display = prevDisplay;
	return thickness;
}
function attachStickyScrollbarListeners(elements) {
	const { scrollable, scrollbar, tableElement } = elements;
	if (scrollbar.classList.length === 0 && measureScrollbarThickness(scrollbar) === 0) {
		overlayStickyScrollbars.add(scrollbar);
		scrollbar.style.display = "none";
		scrollable.style.scrollbarWidth = "auto";
		return () => {};
	}
	const onWrapperScroll = () => {
		if (scrollbar.scrollLeft !== scrollable.scrollLeft) scrollbar.scrollLeft = scrollable.scrollLeft;
	};
	const onScrollbarScroll = () => {
		if (scrollable.scrollLeft !== scrollbar.scrollLeft) scrollable.scrollLeft = scrollbar.scrollLeft;
	};
	scrollable.addEventListener("scroll", onWrapperScroll, { passive: true });
	scrollbar.addEventListener("scroll", onScrollbarScroll, { passive: true });
	let resizeObserver = null;
	if (typeof ResizeObserver !== "undefined") {
		resizeObserver = new ResizeObserver(() => {
			syncStickyScrollbar(scrollable, scrollbar);
		});
		resizeObserver.observe(scrollable);
		resizeObserver.observe(tableElement);
	}
	const cleanup = () => {
		scrollable.removeEventListener("scroll", onWrapperScroll);
		scrollbar.removeEventListener("scroll", onScrollbarScroll);
		if (resizeObserver) resizeObserver.disconnect();
	};
	syncStickyScrollbar(scrollable, scrollbar);
	return cleanup;
}
function syncStickyScrollbar(scrollable, scrollbar) {
	if (overlayStickyScrollbars.has(scrollbar)) return;
	const spacer = scrollbar.firstElementChild;
	if (!spacer || !isHTMLElement(spacer) || !scrollable.isConnected) return;
	const view = scrollable.ownerDocument.defaultView;
	if (!view) {
		scrollbar.style.display = "none";
		return;
	}
	const overflowX = view.getComputedStyle(scrollable).overflowX;
	const isScrollable = overflowX === "auto" || overflowX === "scroll";
	const scrollWidth = scrollable.scrollWidth;
	const clientWidth = scrollable.clientWidth;
	const spacerWidth = scrollWidth + "px";
	if (spacer.style.width !== spacerWidth) spacer.style.width = spacerWidth;
	const hasOverflow = isScrollable && scrollWidth > clientWidth;
	scrollbar.style.display = hasOverflow ? "" : "none";
}
function findStickyScrollbarElements(dom) {
	if (!dom.hasAttribute("data-lexical-sticky-scrollbar")) return null;
	const firstChild = dom.firstElementChild;
	if (!isHTMLDivElement(firstChild)) return null;
	const tableElement = firstChild.querySelector(":scope > table");
	if (!isHTMLTableElement(tableElement)) return null;
	const scrollbar = firstChild.nextElementSibling;
	if (!isHTMLDivElement(scrollbar)) return null;
	return {
		scrollable: firstChild,
		scrollbar,
		tableElement
	};
}
var scrollableEditors = /* @__PURE__ */ new WeakSet();
function $isScrollableTablesActive(editor = $getEditor()) {
	return scrollableEditors.has(editor);
}
function $isStickyScrollbarActive(editor = $getEditor()) {
	const dep = getPeerDependencyFromEditor(editor, "@lexical/table/Table");
	return dep ? dep.output.hasStickyScrollbar.peek() && dep.output.hasHorizontalScroll.peek() : false;
}
function setScrollableTablesActive(editor, active) {
	if (active) scrollableEditors.add(editor);
	else scrollableEditors.delete(editor);
}
/** @noInheritDoc */
var TableNode = class extends ElementNode {
	/** @internal */
	__rowStriping = false;
	__frozenColumnCount = 0;
	__frozenRowCount = 0;
	__colWidths = void 0;
	$config() {
		return this.config("table", {
			extends: ElementNode,
			generated: GENERATED_TABLE,
			importDOM: { table: () => ({
				conversion: $convertTableElement,
				priority: 1
			}) },
			json: tableNodeSchema
		});
	}
	/** @internal These three are omitted from the JSON when falsy. */
	getSerializedFrozenColumnCount() {
		return this.getLatest().__frozenColumnCount || void 0;
	}
	/** @internal */
	getSerializedFrozenRowCount() {
		return this.getLatest().__frozenRowCount || void 0;
	}
	/** @internal */
	getSerializedRowStriping() {
		return this.getLatest().__rowStriping || void 0;
	}
	getColWidths() {
		return this.getLatest().__colWidths;
	}
	setColWidths(colWidths) {
		const self = this.getWritable();
		self.__colWidths = colWidths;
		return self;
	}
	extractWithChild(child, selection, destination) {
		return destination === "html";
	}
	getDOMSlot(element) {
		const tableElement = !isHTMLTableElement(element) ? element.querySelector("table") : element;
		invariant(isHTMLTableElement(tableElement), "TableNode.getDOMSlot: createDOM() did not return a table");
		return super.getDOMSlot(element).withElement(tableElement).withAfter(tableElement.querySelector(":scope > colgroup"));
	}
	createDOM(config, editor) {
		const tableElement = $getDocument().createElement("table");
		if (this.__style) setDOMStyleFromCSS(tableElement.style, this.__style);
		if (this.getColWidths()) {
			const colGroup = $getDocument().createElement("colgroup");
			tableElement.appendChild(colGroup);
			setDOMUnmanaged(colGroup);
		}
		addClassNamesToElement(tableElement, config.theme.table);
		this.updateTableElement(null, tableElement, config);
		if ($isScrollableTablesActive(editor)) {
			const hasStickyScrollbar = $isStickyScrollbarActive(editor);
			const scrollableWrapper = $createScrollableWrapper(tableElement, config, hasStickyScrollbar);
			this.updateTableWrapper(null, scrollableWrapper, tableElement, config);
			if (hasStickyScrollbar) {
				const stickyScrollbar = $createStickyScrollbar(config);
				const outerWrapper = $getDocument().createElement("div");
				outerWrapper.setAttribute("data-lexical-sticky-scrollbar", "true");
				outerWrapper.appendChild(scrollableWrapper);
				outerWrapper.appendChild(stickyScrollbar);
				setDOMUnmanaged(stickyScrollbar);
				return outerWrapper;
			}
			return scrollableWrapper;
		}
		return tableElement;
	}
	updateTableWrapper(prevNode, tableWrapper, tableElement, config) {
		if (this.__frozenColumnCount !== (prevNode ? prevNode.__frozenColumnCount : 0)) setFrozenColumns(tableWrapper, tableElement, config, this.__frozenColumnCount);
		if (this.__frozenRowCount !== (prevNode ? prevNode.__frozenRowCount : 0)) setFrozenRows(tableWrapper, tableElement, config, this.__frozenRowCount);
	}
	updateTableElement(prevNode, tableElement, config) {
		if (this.__style !== (prevNode ? prevNode.__style : "")) setDOMStyleFromCSS(tableElement.style, this.__style, prevNode ? prevNode.__style : "");
		if (this.__rowStriping !== (prevNode ? prevNode.__rowStriping : false)) setRowStriping(tableElement, config, this.__rowStriping);
		const prevColCount = prevNode ? prevNode.getColumnCount() : 0;
		const prevColWidths = prevNode ? prevNode.__colWidths : void 0;
		if (this.getColumnCount() !== prevColCount || this.getColWidths() !== prevColWidths) $updateColgroup(tableElement, this.getColumnCount(), this.getColWidths());
		alignTableElement(tableElement, config, this.getFormatType());
	}
	updateDOM(prevNode, dom, config) {
		const tableElement = getTableElement(this, dom);
		if (dom === tableElement === $isScrollableTablesActive()) return true;
		if (isHTMLDivElement(dom)) {
			if (dom.hasAttribute("data-lexical-sticky-scrollbar") !== $isStickyScrollbarActive()) return true;
			const scrollable = tableElement.parentElement;
			if (isHTMLDivElement(scrollable)) this.updateTableWrapper(prevNode, scrollable, tableElement, config);
		}
		this.updateTableElement(prevNode, tableElement, config);
		return false;
	}
	scaleDOMColWidths(dom, scale) {
		const colWidths = this.getColWidths();
		if (!colWidths) return;
		$updateColgroup(getTableElement(this, dom), this.getColumnCount(), colWidths.map((width) => width * scale));
	}
	exportDOM(editor) {
		const superExport = super.exportDOM(editor);
		const { element } = superExport;
		const exportedElement = !isHTMLTableElement(element) && isHTMLElement(element) ? element.querySelector("table") : element;
		if (isHTMLElement(element) && isHTMLTableElement(exportedElement) && exportedElement !== element) {
			if (element.dir) exportedElement.dir = element.dir;
			const { paddingInlineStart } = element.style;
			if (paddingInlineStart) exportedElement.style.paddingInlineStart = paddingInlineStart;
			const indent = element.getAttribute("data-lexical-indent");
			if (indent !== null) exportedElement.setAttribute("data-lexical-indent", indent);
		}
		return {
			after: (tableElement) => {
				if (superExport.after) tableElement = superExport.after(tableElement);
				if (!isHTMLTableElement(tableElement) && isHTMLElement(tableElement)) tableElement = tableElement.querySelector("table");
				if (!isHTMLTableElement(tableElement)) return null;
				alignTableElement(tableElement, editor._config, this.getFormatType());
				const [tableMap] = $computeTableMapSkipCellCheck(this, null, null);
				const cellValues = /* @__PURE__ */ new Map();
				for (const mapRow of tableMap) for (const mapValue of mapRow) {
					const key = mapValue.cell.getKey();
					if (!cellValues.has(key)) cellValues.set(key, {
						colSpan: mapValue.cell.getColSpan(),
						startColumn: mapValue.startColumn
					});
				}
				const knownColumns = /* @__PURE__ */ new Set();
				for (const cellDOM of tableElement.querySelectorAll(":scope > tr > [data-temporary-table-cell-lexical-key]")) {
					const key = cellDOM.getAttribute("data-temporary-table-cell-lexical-key");
					if (key) {
						const cellSpan = cellValues.get(key);
						cellDOM.removeAttribute("data-temporary-table-cell-lexical-key");
						if (cellSpan) {
							cellValues.delete(key);
							for (let i = 0; i < cellSpan.colSpan; i++) knownColumns.add(i + cellSpan.startColumn);
						}
					}
				}
				const colGroup = tableElement.querySelector(":scope > colgroup");
				if (colGroup) {
					const cols = Array.from(tableElement.querySelectorAll(":scope > colgroup > col")).filter((dom, i) => knownColumns.has(i));
					colGroup.replaceChildren(...cols);
				}
				const rows = tableElement.querySelectorAll(":scope > tr");
				if (rows.length > 0) {
					const tBody = $getDocument().createElement("tbody");
					for (const row of rows) tBody.appendChild(row);
					tableElement.append(tBody);
				}
				return tableElement;
			},
			element: exportedElement
		};
	}
	canBeEmpty() {
		return false;
	}
	isShadowRoot() {
		return true;
	}
	getCordsFromCellNode(tableCellNode, table) {
		const { rows, domRows } = table;
		for (let y = 0; y < rows; y++) {
			const row = domRows[y];
			if (row == null) continue;
			for (let x = 0; x < row.length; x++) {
				const cell = row[x];
				if (cell == null) continue;
				const { elem } = cell;
				const cellNode = $getNearestTableCellInTableFromDOMNode(this, elem);
				if (cellNode !== null && tableCellNode.is(cellNode)) return {
					x,
					y
				};
			}
		}
		throw new Error("Cell not found in table.");
	}
	getDOMCellFromCords(x, y, table) {
		const { domRows } = table;
		const row = domRows[y];
		if (row == null) return null;
		const cell = row[x < row.length ? x : row.length - 1];
		if (cell == null) return null;
		return cell;
	}
	getDOMCellFromCordsOrThrow(x, y, table) {
		const cell = this.getDOMCellFromCords(x, y, table);
		if (!cell) throw new Error("Cell not found at cords.");
		return cell;
	}
	getCellNodeFromCords(x, y, table) {
		const cell = this.getDOMCellFromCords(x, y, table);
		if (cell == null) return null;
		const node = $getNearestNodeFromDOMNode(cell.elem);
		if ($isTableCellNode(node)) return node;
		return null;
	}
	getCellNodeFromCordsOrThrow(x, y, table) {
		const node = this.getCellNodeFromCords(x, y, table);
		if (!node) throw new Error("Node at cords not TableCellNode.");
		return node;
	}
	getRowStriping() {
		return Boolean(this.getLatest().__rowStriping);
	}
	setRowStriping(newRowStriping) {
		const self = this.getWritable();
		self.__rowStriping = newRowStriping;
		return self;
	}
	setFrozenColumns(columnCount) {
		const self = this.getWritable();
		self.__frozenColumnCount = columnCount;
		return self;
	}
	getFrozenColumns() {
		return this.getLatest().__frozenColumnCount;
	}
	setFrozenRows(rowCount) {
		const self = this.getWritable();
		self.__frozenRowCount = rowCount;
		return self;
	}
	getFrozenRows() {
		return this.getLatest().__frozenRowCount;
	}
	canSelectBefore() {
		return true;
	}
	canIndent() {
		return false;
	}
	getColumnCount() {
		const firstRow = this.getFirstChild();
		if (!$isTableRowNode(firstRow)) return 0;
		let columnCount = 0;
		firstRow.getChildren().forEach((cell) => {
			if ($isTableCellNode(cell)) columnCount += cell.getColSpan();
		});
		return columnCount;
	}
};
function $getElementForTableNode(editor, tableNode) {
	const tableElement = editor.getElementByKey(tableNode.getKey());
	invariant(tableElement !== null, "$getElementForTableNode: Table Element Not Found");
	return getTable(tableNode, tableElement);
}
function $convertTableElement(domNode) {
	const tableNode = $createTableNode();
	if (domNode.hasAttribute("data-lexical-row-striping")) tableNode.setRowStriping(true);
	if (domNode.hasAttribute("data-lexical-frozen-column")) tableNode.setFrozenColumns(1);
	if (domNode.hasAttribute("data-lexical-frozen-row")) tableNode.setFrozenRows(1);
	const colGroup = domNode.querySelector(":scope > colgroup");
	if (colGroup) {
		let columns = [];
		for (const col of colGroup.querySelectorAll(":scope > col")) {
			let width = col.style.width || "";
			if (!PIXEL_VALUE_REG_EXP.test(width)) {
				width = col.getAttribute("width") || "";
				if (!/^\d+$/.test(width)) {
					columns = void 0;
					break;
				}
			}
			columns.push(parseFloat(width));
		}
		if (columns) tableNode.setColWidths(columns);
	}
	$setDirectionFromDOM(tableNode, domNode);
	return {
		after: (children) => $descendantsMatching(children, $isTableRowNode),
		node: tableNode
	};
}
function $createTableNode() {
	return $applyNodeReplacement(new TableNode());
}
function $isTableNode(node) {
	return node instanceof TableNode;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTablePluginHelpers.ts
function $insertTable({ rows, columns, includeHeaders }, hasNestedTables) {
	const selection = $getSelection() || $getPreviousSelection();
	if (!selection || !$isRangeSelection(selection)) return false;
	if (!hasNestedTables && $findTableNode(selection.anchor.getNode())) return false;
	const tableNode = $createTableNodeWithDimensions(Number(rows), Number(columns), includeHeaders);
	$insertNodeToNearestRoot(tableNode);
	const firstDescendant = tableNode.getFirstDescendant();
	if ($isTextNode(firstDescendant)) firstDescendant.select();
	return true;
}
function $tableCellTransform(node) {
	if (!$isTableRowNode(node.getParent())) node.remove();
	else if (node.isEmpty()) node.append($createParagraphNode());
}
function $tableRowTransform(node) {
	if (!$isTableNode(node.getParent())) node.remove();
	else $unwrapAndFilterDescendants(node, $isTableCellNode);
}
function $tableTransform(node) {
	$unwrapAndFilterDescendants(node, $isTableRowNode);
	const [gridMap] = $computeTableMapSkipCellCheck(node, null, null);
	const maxRowLength = gridMap.reduce((curLength, row) => {
		return Math.max(curLength, row.length);
	}, 0);
	const rowNodes = node.getChildren();
	for (let i = 0; i < gridMap.length; ++i) {
		const rowNode = rowNodes[i];
		if (!rowNode) continue;
		invariant($isTableRowNode(rowNode), "TablePlugin: Expecting all children of TableNode to be TableRowNode, found %s (type %s)", rowNode.constructor.name, rowNode.getType());
		const rowLength = gridMap[i].reduce((acc, cell) => cell ? 1 + acc : acc, 0);
		if (rowLength === maxRowLength) continue;
		const lastCell = rowNode.getLastChild();
		const headerState = $isTableCellNode(lastCell) ? lastCell.getHeaderStyles() & TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS;
		for (let j = rowLength; j < maxRowLength; ++j) {
			const newCell = $createTableCellNode(headerState);
			newCell.append($createParagraphNode());
			rowNode.append(newCell);
		}
	}
	const colWidths = node.getColWidths();
	const columnCount = node.getColumnCount();
	if (colWidths && colWidths.length !== columnCount) {
		let newColWidths = void 0;
		if (columnCount < colWidths.length) newColWidths = colWidths.slice(0, columnCount);
		else if (colWidths.length > 0) {
			const fillWidth = colWidths[colWidths.length - 1];
			newColWidths = [...colWidths, ...Array(columnCount - colWidths.length).fill(fillWidth)];
		}
		node.setColWidths(newColWidths);
	}
}
function $tableClickCommand(event) {
	if (event.detail < 3 || !isDOMNode(event.target)) return false;
	const startNode = $getNearestNodeFromDOMNode(event.target);
	if (startNode === null) return false;
	const blockNode = $findMatchingParent(startNode, (node) => $isElementNode(node) && !node.isInline());
	if (blockNode === null) return false;
	if (!$isTableCellNode(blockNode.getParent())) return false;
	blockNode.select(0);
	return true;
}
function $tableSelectAllCommand() {
	const selection = $getSelection();
	if (!$isRangeSelection(selection)) return false;
	const tableNode = $findTableNode(selection.anchor.getNode());
	if (tableNode === null) return false;
	const root = $getRoot();
	if (!root.is(tableNode.getParent()) || root.getChildrenSize() !== 1) return false;
	const [tableMap] = $computeTableMapSkipCellCheck(tableNode, null, null);
	if (tableMap.length === 0 || tableMap[0].length === 0) return false;
	const firstCellMap = tableMap[0][0];
	if (!firstCellMap || !firstCellMap.cell) return false;
	const lastRow = tableMap[tableMap.length - 1];
	const lastCellMap = lastRow[lastRow.length - 1];
	if (!lastCellMap || !lastCellMap.cell) return false;
	const tableSelection = $createTableSelectionFrom(tableNode, firstCellMap.cell, lastCellMap.cell);
	$setSelection(tableSelection);
	return true;
}
/**
* Register a transform to ensure that all TableCellNode have a colSpan and rowSpan of 1.
* This should only be registered when you do not want to support merged cells.
*
* @param editor The editor
* @returns An unregister callback
*/
function registerTableCellUnmergeTransform(editor) {
	return editor.registerNodeTransform(TableCellNode, (node) => {
		if (node.getColSpan() > 1 || node.getRowSpan() > 1) {
			const [, , gridNode] = $getNodeTriplet(node);
			const [gridMap] = $computeTableMap(gridNode, node, node);
			const rowsCount = gridMap.length;
			const columnsCount = gridMap[0].length;
			let row = gridNode.getFirstChild();
			invariant($isTableRowNode(row), "Expected TableNode first child to be a RowNode");
			const unmerged = [];
			for (let i = 0; i < rowsCount; i++) {
				if (i !== 0) {
					row = row.getNextSibling();
					invariant($isTableRowNode(row), "Expected TableNode first child to be a RowNode");
				}
				let lastRowCell = null;
				for (let j = 0; j < columnsCount; j++) {
					const cellMap = gridMap[i][j];
					const cell = cellMap.cell;
					if (cellMap.startRow === i && cellMap.startColumn === j) {
						lastRowCell = cell;
						unmerged.push(cell);
					} else if (cell.getColSpan() > 1 || cell.getRowSpan() > 1) {
						invariant($isTableCellNode(cell), "Expected TableNode cell to be a TableCellNode");
						const newCell = $createTableCellNode(cell.__headerState);
						if (lastRowCell !== null) lastRowCell.insertAfter(newCell);
						else $insertFirst$1(row, newCell);
					}
				}
			}
			for (const cell of unmerged) {
				cell.setColSpan(1);
				cell.setRowSpan(1);
			}
		}
	});
}
function registerTableSelectionObserver(editor, hasTabHandler = true) {
	const tableObservers = new TableObservers();
	let selectionNeedsSync = false;
	const initializeTableNode = (tableNode, nodeKey, dom) => {
		const tableElement = getTableElement(tableNode, dom);
		const tableSelection = applyTableHandlers(tableNode, tableElement, editor, hasTabHandler, tableObservers);
		tableObservers.observers.set(nodeKey, [tableSelection, tableElement]);
	};
	return mergeRegister(registerTableWindowHandlers(editor, tableObservers), editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
		if (editor.getRootElement() === null) return false;
		selectionNeedsSync = true;
		return $handleTableSelectionChangeCommand(tableObservers, editor);
	}, 3), editor.registerUpdateListener(({ dirtyElements }) => {
		if (!selectionNeedsSync) {
			for (const key of dirtyElements.keys()) if (tableObservers.observers.has(key)) {
				selectionNeedsSync = true;
				break;
			}
		}
		if (selectionNeedsSync) {
			selectionNeedsSync = false;
			if (editor.getRootElement() !== null) editor.read("latest", () => {
				$syncTableSelectionObservers(tableObservers, editor);
			});
		}
	}), editor.registerMutationListener(TableNode, (nodeMutations) => {
		selectionNeedsSync = true;
		editor.read("latest", () => {
			for (const [nodeKey, mutation] of nodeMutations) {
				const tableSelection = tableObservers.observers.get(nodeKey);
				if (mutation === "created" || mutation === "updated") {
					const { tableNode, tableElement } = $getTableAndElementByKey(nodeKey);
					if (tableSelection === void 0) initializeTableNode(tableNode, nodeKey, tableElement);
					else if (tableElement !== tableSelection[1]) {
						tableObservers.removeObserver(nodeKey);
						initializeTableNode(tableNode, nodeKey, tableElement);
					}
				} else if (mutation === "destroyed") tableObservers.removeObserver(nodeKey);
			}
		});
	}, { skipInitialization: false }), () => {
		tableObservers.removeAllObservers();
	});
}
/**
* Register table command listeners and the table integrity transforms. The
* table selection observer should be registered separately after this with
* {@link registerTableSelectionObserver}.
*
* @param editor The editor
* @returns An unregister callback
*/
function registerTablePlugin(editor, options) {
	if (!editor.hasNodes([TableNode])) invariant(false, "TablePlugin: TableNode is not registered on editor");
	const { hasNestedTables = y(false) } = options ?? {};
	return mergeRegister(editor.registerCommand(INSERT_TABLE_COMMAND, (payload) => {
		return $insertTable(payload, hasNestedTables.peek());
	}, 0), editor.registerCommand(SELECTION_INSERT_CLIPBOARD_NODES_COMMAND, (payload, dispatchEditor) => {
		if (editor !== dispatchEditor) return false;
		return $tableSelectionInsertClipboardNodesCommand(payload, hasNestedTables);
	}, 0), editor.registerCommand(SELECT_ALL_COMMAND, $tableSelectAllCommand, 1), editor.registerCommand(CLICK_COMMAND, $tableClickCommand, 0), editor.registerNodeTransform(TableNode, $tableTransform), editor.registerNodeTransform(TableRowNode, $tableRowTransform), editor.registerNodeTransform(TableCellNode, $tableCellTransform));
}
function $tableSelectionInsertClipboardNodesCommand(selectionPayload, hasNestedTables) {
	const { nodes, selection } = selectionPayload;
	if (!nodes.some((n) => $isTableNode(n) || $dfs(n).some((d) => $isTableNode(d.node)))) {
		if ($isTableSelection(selection)) {
			let text = "";
			let lastWasBlock = false;
			for (const node of nodes) {
				const isBlock = $isElementNode(node) && !node.isInline();
				if (text.length > 0 && (isBlock || lastWasBlock)) text += "\n";
				text += node.getTextContent();
				lastWasBlock = isBlock;
			}
			selection.insertRawText(text);
			return true;
		}
		return false;
	}
	const isTableSelection = $isTableSelection(selection);
	const isRangeSelection = $isRangeSelection(selection);
	if (!(isRangeSelection && $findMatchingParent(selection.anchor.getNode(), (n) => $isTableCellNode(n)) !== null && $findMatchingParent(selection.focus.getNode(), (n) => $isTableCellNode(n)) !== null || isTableSelection)) return false;
	if (nodes.length === 1 && $isTableNode(nodes[0])) return $insertTableIntoGrid(nodes[0], selection);
	if (isRangeSelection && hasNestedTables.peek() && !$isMultiCellTableSelection(selection)) return false;
	return true;
}
function $isMultiCellTableSelection(selection) {
	if ($isTableSelection(selection) && !selection.focus.getNode().is(selection.anchor.getNode())) return true;
	if ($isRangeSelection(selection) && $isTableCellNode(selection.anchor.getNode()) && !selection.anchor.getNode().is(selection.focus.getNode())) return true;
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/TableImportExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function isValidVerticalAlign(verticalAlign) {
	return verticalAlign === "middle" || verticalAlign === "bottom";
}
/**
* Bitmask of TextNode format bits implied by a `<th>` / `<td>`'s
* inline styles (`font-weight: bold`, `font-style: italic`, and
* `underline` / `line-through` in `text-decoration`).
*/
function cellTextFormatMask(style) {
	let mask = 0;
	const fontWeight = style.fontWeight;
	if (fontWeight === "700" || fontWeight === "bold") mask |= 1;
	if (style.fontStyle === "italic") mask |= 2;
	const decoration = (style.textDecoration || "").split(" ");
	if (decoration.includes("underline")) mask |= 8;
	if (decoration.includes("line-through")) mask |= 4;
	return mask;
}
/**
* Coalesce inline + line-break runs inside a `<td>`/`<th>` into their own
* `ParagraphNode`s, leaving any pre-existing `ParagraphNode` children
* (real `<p>` elements, or the `ParagraphNode` stand-ins that
* {@link TransparentBlockRule} lowers `<div>`/`<section>`/… to) in
* place as their own paragraph siblings. Mirrors the legacy `<td>`
* importer where a bare `<td>789<div>000</div></td>` ended up as two
* paragraphs (`<p>789</p><p>000</p>`), and also drops a sole leading
* `<br>` that the legacy `removeSingleLineBreakNode` cleanup would have
* removed.
*/
function $packageCellChildren(children) {
	const result = [];
	let paragraph = null;
	const flushSingleLineBreak = () => {
		if (paragraph !== null) {
			const first = paragraph.getFirstChild();
			if ($isLineBreakNode(first) && paragraph.getChildrenSize() === 1) first.remove();
		}
	};
	for (const child of children) if ($isInlineElementOrDecoratorNode(child) || $isTextNode(child) || $isLineBreakNode(child)) {
		if (paragraph !== null) paragraph.append(child);
		else {
			paragraph = $createParagraphNode().append(child);
			result.push(paragraph);
		}
	} else {
		flushSingleLineBreak();
		paragraph = null;
		result.push(child);
	}
	flushSingleLineBreak();
	if (result.length === 0) result.push($createParagraphNode());
	return result;
}
var TableRule = defineImportRule({
	$import: (ctx, el) => {
		const node = $createTableNode();
		if (el.hasAttribute("data-lexical-row-striping")) node.setRowStriping(true);
		if (el.hasAttribute("data-lexical-frozen-column")) node.setFrozenColumns(1);
		if (el.hasAttribute("data-lexical-frozen-row")) node.setFrozenRows(1);
		const colGroup = el.querySelector(":scope > colgroup");
		if (colGroup) {
			let columns = [];
			for (const col of colGroup.querySelectorAll(":scope > col")) {
				let width = col.style.width || "";
				if (!PIXEL_VALUE_REG_EXP.test(width)) {
					width = col.getAttribute("width") || "";
					if (!/^\d+$/.test(width)) {
						columns = void 0;
						break;
					}
				}
				columns.push(parseFloat(width));
			}
			if (columns) node.setColWidths(columns);
		}
		return [node.splice(0, 0, $descendantsMatching(ctx.$importChildren(el), $isTableRowNode))];
	},
	match: sel.tag("table"),
	name: "@lexical/table/table"
});
var TableRowRule = defineImportRule({
	$import: (ctx, el) => {
		return [$createTableRowNode(PIXEL_VALUE_REG_EXP.test(el.style.height) ? parseFloat(el.style.height) : void 0).splice(0, 0, $descendantsMatching(ctx.$importChildren(el), $isTableCellNode))];
	},
	match: sel.tag("tr"),
	name: "@lexical/table/tr"
});
var TableCellRule = defineImportRule({
	$import: (ctx, el) => {
		const isHeader = el.nodeName === "TH";
		const width = PIXEL_VALUE_REG_EXP.test(el.style.width) ? parseFloat(el.style.width) : void 0;
		let headerState = TableCellHeaderStates.NO_STATUS;
		if (isHeader) {
			const scope = el.getAttribute("scope");
			if (scope === "col") headerState = TableCellHeaderStates.COLUMN;
			else if (scope === "row") headerState = TableCellHeaderStates.ROW;
			else {
				const parentRow = el.parentElement;
				const isInHeaderRow = isHTMLTableRowElement(parentRow) && (parentRow.parentElement && parentRow.parentElement.nodeName === "THEAD" || parentRow.rowIndex === 0);
				const isFirstColumn = el.cellIndex === 0;
				if (isInHeaderRow) headerState |= TableCellHeaderStates.ROW;
				if (isFirstColumn) headerState |= TableCellHeaderStates.COLUMN;
				if (headerState === TableCellHeaderStates.NO_STATUS) headerState = TableCellHeaderStates.ROW;
			}
		}
		const cell = $createTableCellNode(headerState, el.colSpan, width);
		cell.__rowSpan = el.rowSpan;
		const backgroundColor = el.style.backgroundColor;
		if (backgroundColor !== "") cell.__backgroundColor = backgroundColor;
		const verticalAlign = el.style.verticalAlign;
		if (isValidVerticalAlign(verticalAlign)) cell.__verticalAlign = verticalAlign;
		const inheritedFormat = ctx.get(ImportTextFormat);
		const cellFormat = inheritedFormat | cellTextFormatMask(el.style);
		const inheritedStyle = ctx.get(ImportTextStyle);
		const color = el.style.color;
		const cellStyle = color ? {
			...inheritedStyle,
			color
		} : inheritedStyle;
		const branchContext = [];
		if (cellFormat !== inheritedFormat) branchContext.push(contextValue(ImportTextFormat, cellFormat));
		if (cellStyle !== inheritedStyle) branchContext.push(contextValue(ImportTextStyle, cellStyle));
		const packaged = $packageCellChildren(ctx.$importChildren(el, { context: branchContext }));
		const children = isHeader ? packaged : $propagateTextAlignToBlockChildren(packaged, el);
		return [cell.splice(0, 0, children)];
	},
	match: sel.tag("td", "th"),
	name: "@lexical/table/cell"
});
/**
* A {@link ChildSchema} that enforces TableNode invariants: only
* `TableRowNode` children are accepted; orphan `TableCellNode` runs are
* wrapped in a synthesized row.
*
* @experimental
*/
var TableSchema = {
	$accepts: $isTableRowNode,
	$packageRun: (run) => run.every($isTableCellNode) ? [$createTableRowNode().splice(0, 0, run)] : [],
	name: "TableSchema"
};
/**
* A {@link ChildSchema} that enforces TableRowNode invariants: only
* `TableCellNode` children are accepted; non-cell children are dropped
* (the legacy converter does the same via `$descendantsMatching`).
*
* @experimental
*/
var TableRowSchema = {
	$accepts: $isTableCellNode,
	name: "TableRowSchema"
};
/**
* Import rules for {@link TableNode}, {@link TableRowNode}, and
* {@link TableCellNode}.
*
* Registered by {@link TableExtension} itself (together with
* `CoreImportExtension`), so any editor that uses the table extension can
* import these tags through the `DOMImportExtension` pipeline without
* further configuration.
*
* @experimental
*/
var TableImportRules = [
	TableRule,
	TableRowRule,
	TableCellRule
];
//#endregion
//#region ../../node_modules/.pnpm/@lexical+table@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/table/src/LexicalTableExtension.ts
function registerStickyScrollbar(editor) {
	const attached = /* @__PURE__ */ new Map();
	const detachAll = () => {
		for (const { cleanup } of attached.values()) cleanup();
		attached.clear();
	};
	return mergeRegister(detachAll, editor.registerMutationListener(TableNode, (nodeMutations) => {
		for (const [nodeKey, mutation] of nodeMutations) {
			const prev = attached.get(nodeKey);
			if (mutation === "destroyed") {
				if (prev) {
					prev.cleanup();
					attached.delete(nodeKey);
				}
				continue;
			}
			const dom = editor.getElementByKey(nodeKey);
			const parts = dom && isHTMLElement(dom) ? findStickyScrollbarElements(dom) : null;
			if (prev && parts && prev.parts.scrollable === parts.scrollable && prev.parts.scrollbar === parts.scrollbar && prev.parts.tableElement === parts.tableElement) {
				syncStickyScrollbar(parts.scrollable, parts.scrollbar);
				continue;
			}
			if (prev) {
				prev.cleanup();
				attached.delete(nodeKey);
			}
			if (parts) attached.set(nodeKey, {
				cleanup: attachStickyScrollbarListeners(parts),
				parts
			});
		}
	}, { skipInitialization: false }));
}
/**
* Configures {@link TableNode}, {@link TableRowNode}, {@link TableCellNode} and
* registers table behaviors (see {@link TableConfig})
*/
var TableExtension = defineExtension({
	build(editor, config, state) {
		return namedSignals(config);
	},
	config: safeCast({
		hasCellBackgroundColor: true,
		hasCellMerge: true,
		hasHorizontalScroll: true,
		hasNestedTables: false,
		hasStickyScrollbar: false,
		hasTabHandler: true
	}),
	dependencies: [CoreImportExtension, configExtension(DOMImportExtension, { rules: TableImportRules })],
	name: "@lexical/table/Table",
	nodes: () => [
		TableNode,
		TableRowNode,
		TableCellNode
	],
	register(editor, config, state) {
		const stores = state.getOutput();
		let prevStickyScrollbar = false;
		return mergeRegister(j(() => {
			const hasHorizontalScroll = stores.hasHorizontalScroll.value;
			const hasStickyScrollbar = stores.hasStickyScrollbar.value && hasHorizontalScroll;
			const hadHorizontalScroll = $isScrollableTablesActive(editor);
			if (hadHorizontalScroll !== hasHorizontalScroll) setScrollableTablesActive(editor, hasHorizontalScroll);
			if (hadHorizontalScroll !== hasHorizontalScroll || prevStickyScrollbar !== hasStickyScrollbar) editor.update($fullReconcile);
			prevStickyScrollbar = hasStickyScrollbar;
		}), registerTablePlugin(editor, stores), j(() => registerTableSelectionObserver(editor, stores.hasTabHandler.value)), j(() => {
			if (stores.hasStickyScrollbar.value && stores.hasHorizontalScroll.value) return editor.registerRootListener((rootElement) => {
				if (rootElement) return registerStickyScrollbar(editor);
			});
		}), j(() => stores.hasCellMerge.value ? void 0 : registerTableCellUnmergeTransform(editor)), j(() => stores.hasCellBackgroundColor.value ? void 0 : editor.registerNodeTransform(TableCellNode, (node) => {
			if (node.getBackgroundColor() !== null) node.setBackgroundColor(null);
		})));
	}
});
/**
* Bundles {@link TableImportRules} together with the runtime
* {@link TableExtension}.
*
* @experimental
* @deprecated {@link TableExtension} now registers
* {@link TableImportRules} (and `CoreImportExtension`) itself — depend on
* it directly instead.
*/
var TableImportExtension = defineExtension({
	dependencies: [TableExtension],
	name: "@lexical/table/Import"
});
//#endregion
export { $computeTableCellRectBoundary, $computeTableMap, $computeTableMapSkipCellCheck, $createTableCellNode, $createTableNode, $createTableNodeWithDimensions, $createTableRowNode, $createTableSelection, $createTableSelectionFrom, $deleteTableColumn, $deleteTableColumnAtSelection, $deleteTableColumn__EXPERIMENTAL, $deleteTableRowAtSelection, $deleteTableRow__EXPERIMENTAL, $findCellNode, $findTableNode, $getElementForTableNode, $getNodeTriplet, $getTableAndElementByKey, $getTableCellNodeFromLexicalNode, $getTableCellNodeRect, $getTableColumnIndexFromTableCellNode, $getTableNodeFromLexicalNodeOrThrow, $getTableRowIndexFromTableCellNode, $getTableRowNodeFromTableCellNodeOrThrow, $insertTableColumn, $insertTableColumnAtNode, $insertTableColumnAtSelection, $insertTableColumn__EXPERIMENTAL, $insertTableRow, $insertTableRowAtNode, $insertTableRowAtSelection, $insertTableRow__EXPERIMENTAL, $isScrollableTablesActive, $isSimpleTable, $isStickyScrollbarActive, $isTableCellNode, $isTableNode, $isTableRowNode, $isTableSelection, $mergeCells, $moveTableColumn, $moveTableRow, $removeTableRowAtIndex, $setTableColumnIsHeader, $setTableRowIsHeader, $unmergeCell, $unmergeCellNode, INSERT_TABLE_COMMAND, TableCellHeaderStates, TableCellNode, TableExtension, TableImportExtension, TableImportRules, TableNode, TableObserver, TableRowNode, TableRowSchema, TableSchema, applyTableHandlers, getDOMCellFromTarget, getTableElement, getTableObserverFromTableElement, registerTableCellUnmergeTransform, registerTablePlugin, registerTableSelectionObserver, setScrollableTablesActive };
