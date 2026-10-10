import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$3 } from "./VisuallyHidden-C7NN3VEP.DAKckTtZ.js";
import { t as _sfc_main$4 } from "./IconButton-BNQuz9W_.CvHMrKbO.js";
import { t as _sfc_main$5 } from "./Icon-B6qNgBP9.DVAnMRiH.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, nextTick, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, renderList, renderSlot, toDisplayString, unref, useAttrs, useId, useSSRContext, useTemplateRef, watch, withCtx, withModifiers } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/Code-D_m_YJhN.js
var _hoisted_1$2 = ["data-color", "data-size"];
var _sfc_main$2 = /*@__PURE__*/ defineComponent({
	name: "AstryxCode",
	__name: "Code",
	props: {
		color: { default: "primary" },
		size: {}
	},
	setup(__props, { expose: __expose }) {
		const root = useTemplateRef("root");
		__expose({ element: computed(() => root.value ?? null) });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("code", {
				ref_key: "root",
				ref: root,
				class: "astryx-code",
				"data-color": __props.color,
				"data-size": __props.size
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$2);
		};
	}
});
var describedTypes = /* @__PURE__ */ new Set([
	"keyword",
	"string",
	"comment",
	"number",
	"function",
	"type",
	"tag",
	"attribute",
	"property",
	"operator",
	"constant",
	"punctuation",
	"variable"
]);
var dynamicStyles = null;
/**
* A custom tokenizer can return any token type. Paint it with its own token
* variable, falling back to the code text color, by adding one rule for it.
*/
function describeTokenType(type) {
	if (describedTypes.has(type)) return;
	describedTypes.add(type);
	if (typeof document === "undefined") return;
	if (dynamicStyles == null) {
		dynamicStyles = document.createElement("style");
		dynamicStyles.setAttribute("data-astryx-code-token-styles", "");
		document.head.appendChild(dynamicStyles);
	}
	const name = CSS.escape(`astryx-${type}`);
	const color = `var(${CSS.escape(`--astryx-code-syntax-${type}`)}, currentColor)`;
	dynamicStyles.sheet?.insertRule(`.astryx-code-block code::highlight(${name}) { color: ${color}; }`);
}
function resolveHighlight(type) {
	if (typeof CSS === "undefined") return null;
	const highlights = CSS.highlights;
	if (highlights == null) return null;
	describeTokenType(type);
	const name = `astryx-${type}`;
	let highlight = highlights.get(name);
	if (highlight == null) {
		highlight = new Highlight();
		highlights.set(name, highlight);
	}
	return highlight;
}
/**
* The line's own text node. Conditional branches in a template can leave empty
* text nodes beside the content, so take the first one that carries text.
*/
function findLineTextNode(line) {
	for (const node of line.childNodes) if (node.nodeType === Node.TEXT_NODE && node.length > 0) return node;
	return null;
}
function addLineRanges(line, tokens, applied) {
	const text = findLineTextNode(line);
	if (text == null || tokens.length === 0) return;
	const length = text.length;
	for (const token of tokens) {
		if (token.start >= length || token.end <= 0) continue;
		const highlight = resolveHighlight(token.type);
		if (highlight == null) return;
		try {
			const range = new Range();
			range.setStart(text, Math.min(token.start, length));
			range.setEnd(text, Math.min(token.end, length));
			highlight.add(range);
			applied.push({
				highlight,
				range
			});
		} catch {}
	}
}
/**
* Paint syntax tokens with the CSS Custom Highlight API, which leaves the code
* text itself untouched. The returned function removes every range this call
* added.
*/
function applyHighlightRanges(codeElement, tokenLines) {
	const applied = [];
	const lines = codeElement.querySelectorAll("[data-line]");
	for (let i = 0; i < lines.length; i++) {
		const tokens = tokenLines[i];
		if (tokens != null && tokens.length > 0) addLineRanges(lines[i], tokens, applied);
	}
	return () => {
		for (const { highlight, range } of applied) highlight.delete(range);
	};
}
var _hoisted_1$1 = ["aria-label"];
var _hoisted_2$1 = [
	"data-numbered",
	"data-size",
	"data-wrapped"
];
var _hoisted_3$1 = ["data-line"];
var _hoisted_4$1 = {
	key: 0,
	class: "astryx-code-block__line-content"
};
var CHUNK_SIZE = 20;
var CHUNK_THRESHOLD = 100;
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxCodeBlockContent",
	__name: "CodeBlockContent",
	props: {
		hasLineNumbers: { type: Boolean },
		highlightSet: {},
		isCompact: { type: Boolean },
		isWrapped: { type: Boolean },
		lines: {},
		maxHeight: {},
		mode: {},
		scrollLabel: {},
		size: {},
		tokenLines: {}
	},
	setup(__props) {
		const props = __props;
		const code = useTemplateRef("code");
		const chunks = computed(() => {
			const lines = props.lines;
			if (lines.length < CHUNK_THRESHOLD) return [{
				start: 0,
				lines
			}];
			const result = [];
			for (let start = 0; start < lines.length; start += CHUNK_SIZE) result.push({
				start,
				lines: lines.slice(start, start + CHUNK_SIZE)
			});
			return result;
		});
		const isChunked = computed(() => chunks.value.length > 1);
		/** Token runs for one line, with the untouched text between them. */
		function buildParts(line, tokens) {
			if (tokens.length === 0) return [{
				text: line || "​",
				type: null
			}];
			const parts = [];
			let cursor = 0;
			for (const token of tokens) {
				if (token.start > cursor) parts.push({
					text: line.slice(cursor, token.start),
					type: null
				});
				const end = Math.min(token.end, line.length);
				parts.push({
					text: line.slice(token.start, end),
					type: token.type
				});
				cursor = end;
			}
			if (cursor < line.length) parts.push({
				text: line.slice(cursor),
				type: null
			});
			return parts.length > 0 ? parts : [{
				text: "​",
				type: null
			}];
		}
		const lineParts = computed(() => props.lines.map((line, index) => buildParts(line, props.tokenLines[index] ?? [])));
		const codeStyle = computed(() => {
			const style = {};
			if (props.hasLineNumbers) style["--astryx-code-block-gutter-width"] = `${String(props.lines.length).length}ch`;
			return style;
		});
		const scrollStyle = computed(() => props.maxHeight == null ? void 0 : { maxHeight: typeof props.maxHeight === "number" ? `${props.maxHeight}px` : props.maxHeight });
		function isHighlighted(index) {
			return props.highlightSet?.has(index + 1) ?? false;
		}
		let removeRanges = null;
		function paintRanges() {
			removeRanges?.();
			removeRanges = null;
			const element = code.value;
			if (props.mode !== "ranges" || element == null) return;
			removeRanges = applyHighlightRanges(element, props.tokenLines);
		}
		watch([
			() => props.mode,
			() => props.tokenLines,
			() => props.lines
		], () => paintRanges(), { flush: "post" });
		onMounted(() => {
			nextTick(paintRanges);
		});
		onBeforeUnmount(() => removeRanges?.());
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "astryx-code-block__scroll",
				role: "group",
				tabindex: "0",
				"aria-label": __props.scrollLabel,
				style: normalizeStyle(scrollStyle.value)
			}, [createElementVNode("div", { class: normalizeClass(["astryx-code-block__wrap", { "astryx-code-block__wrap--compact": __props.isCompact }]) }, [createElementVNode("code", {
				ref_key: "code",
				ref: code,
				class: "astryx-code-block__code",
				"data-numbered": __props.hasLineNumbers || void 0,
				"data-size": __props.size,
				"data-wrapped": __props.isWrapped || void 0,
				style: normalizeStyle(codeStyle.value)
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList(chunks.value, (chunk) => {
				return openBlock(), createElementBlock("div", {
					key: chunk.start,
					class: normalizeClass({ "astryx-code-block__chunk": isChunked.value }),
					style: normalizeStyle(isChunked.value ? { containIntrinsicBlockSize: `auto ${chunk.lines.length}lh` } : void 0)
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(chunk.lines, (line, offset) => {
					return openBlock(), createElementBlock("div", {
						key: chunk.start + offset,
						class: normalizeClass(["astryx-code-block__line", {
							"astryx-code-block__line--highlighted": isHighlighted(chunk.start + offset),
							"astryx-code-block__line--numbered": __props.hasLineNumbers
						}]),
						"data-line": chunk.start + offset + 1
					}, [__props.mode === "spans" ? (openBlock(), createElementBlock("span", _hoisted_4$1, [(openBlock(true), createElementBlock(Fragment, null, renderList(lineParts.value[chunk.start + offset], (part, index) => {
						return openBlock(), createElementBlock(Fragment, { key: index }, [part.type != null ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: normalizeClass(`astryx-token-${part.type}`)
						}, toDisplayString(part.text), 3)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(part.text), 1)], 64))], 64);
					}), 128))])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(line || "​"), 1)], 64))], 10, _hoisted_3$1);
				}), 128))], 6);
			}), 128))], 12, _hoisted_2$1)], 2)], 12, _hoisted_1$1);
		};
	}
});
var langCache = /* @__PURE__ */ new Map();
var JS_KEYWORDS = /\b(const|let|var|function|class|if|else|for|while|return|import|export|from|default|async|await|try|catch|throw|new|typeof|instanceof|interface|type|enum|extends|implements|switch|case|break|continue|do|in|of|void|null|undefined|true|false|this|super|yield|delete|static|public|private|protected|readonly|abstract|as|is|keyof|declare|module|namespace|require)\b/;
var PYTHON_KEYWORDS = /\b(def|class|if|elif|else|for|while|return|import|from|as|with|try|except|raise|True|False|None|and|or|not|in|is|lambda|yield|async|await|pass|break|continue|del|global|nonlocal|assert|finally|print|self|cls)\b/;
var BASH_KEYWORDS = /\b(if|then|else|elif|fi|for|do|done|while|until|case|esac|function|in|select|return|exit|local|export|source|alias|unalias|readonly|shift|eval|exec|set|unset|trap|wait|read|echo|printf|test|true|false)\b/;
var CSS_KEYWORDS = /\b(important|inherit|initial|unset|revert|auto|none)\b/;
var PHP_KEYWORDS = /\b(function|class|if|else|elseif|for|foreach|while|return|echo|public|private|protected|static|new|try|catch|throw|namespace|use|require|require_once|include|include_once|extends|implements|interface|abstract|final|const|var|true|false|null|array|isset|unset|empty|list|match|enum|switch|case|break|continue|do|yield|fn)\b/;
var HACK_KEYWORDS = /\b(function|class|if|else|for|foreach|while|return|echo|public|private|protected|static|new|try|catch|throw|namespace|use|require|include|extends|implements|interface|abstract|final|const|shape|vec|dict|keyset|async|await|concurrent|enum|type|newtype|tuple|inout)\b/;
function buildLanguagePatterns(lang) {
	switch (lang) {
		case "typescript":
		case "javascript":
		case "tsx":
		case "jsx":
		case "ts":
		case "js": return {
			defaultType: "variable",
			patterns: [
				{
					type: "comment",
					regex: /\/\*[\s\S]*?\*\//
				},
				{
					type: "comment",
					regex: /\/\/[^\n]*/
				},
				{
					type: "string",
					regex: /`(?:[^`\\]|\\.)*`/
				},
				{
					type: "string",
					regex: /"(?:[^"\\]|\\.)*"/
				},
				{
					type: "string",
					regex: /'(?:[^'\\]|\\.)*'/
				},
				{
					type: "constant",
					regex: /@\w+/
				},
				{
					type: "number",
					regex: /\b0x[0-9a-f_]+\b/i
				},
				{
					type: "number",
					regex: /\b0b[01_]+\b/i
				},
				{
					type: "number",
					regex: /\b0o[0-7_]+\b/i
				},
				{
					type: "number",
					regex: /\b\d[\d_]*(?:\.[\d_]*)?(?:e[+-]?\d+)?\b/i
				},
				{
					type: "keyword",
					regex: JS_KEYWORDS
				},
				{
					type: "function",
					regex: /\b[a-z_$][\w$]*(?=\s*\()/i
				},
				{
					type: "type",
					regex: /\b[A-Z]\w*\b/
				},
				{
					type: "operator",
					regex: /[+\-*/%=!<>&|^~?:]+/
				},
				{
					type: "punctuation",
					regex: /[{}()[\];,.]/
				},
				{
					type: "variable",
					regex: /\b[a-z_$][\w$]*\b/i
				}
			]
		};
		case "json": return {
			defaultType: "punctuation",
			patterns: [
				{
					type: "property",
					regex: /"(?:[^"\\]|\\.)*"(?=\s*:)/
				},
				{
					type: "string",
					regex: /"(?:[^"\\]|\\.)*"/
				},
				{
					type: "number",
					regex: /-?\b\d+(?:\.\d*)?(?:e[+-]?\d+)?\b/i
				},
				{
					type: "constant",
					regex: /\b(true|false|null)\b/
				},
				{
					type: "punctuation",
					regex: /[{}()[\]:,]/
				}
			]
		};
		case "html":
		case "xml":
		case "svg": return {
			defaultType: "variable",
			patterns: [
				{
					type: "comment",
					regex: /<!--[\s\S]*?-->/
				},
				{
					type: "keyword",
					regex: /<!DOCTYPE[^>]*>/i
				},
				{
					type: "tag",
					regex: /<\/[a-z][\w-]*\s*>/i
				},
				{
					type: "tag",
					regex: /<[a-z][\w-]*/i
				},
				{
					type: "tag",
					regex: /\/?>/
				},
				{
					type: "string",
					regex: /"(?:[^"\\]|\\.)*"/
				},
				{
					type: "string",
					regex: /'(?:[^'\\]|\\.)*'/
				},
				{
					type: "attribute",
					regex: /\b[a-z_:][\w:.-]*(?=\s*=)/i
				},
				{
					type: "operator",
					regex: /=/
				}
			]
		};
		case "css":
		case "scss":
		case "less": return {
			defaultType: "variable",
			patterns: [
				{
					type: "comment",
					regex: /\/\*[\s\S]*?\*\//
				},
				{
					type: "comment",
					regex: /\/\/[^\n]*/
				},
				{
					type: "string",
					regex: /"(?:[^"\\]|\\.)*"/
				},
				{
					type: "string",
					regex: /'(?:[^'\\]|\\.)*'/
				},
				{
					type: "variable",
					regex: /--[a-z_-][\w-]*/i
				},
				{
					type: "number",
					regex: /-?\b\d+(?:\.\d*)?(?:px|em|rem|%|vh|vw|vmin|vmax|ch|ex|deg|rad|turn|s|ms|fr)?\b/
				},
				{
					type: "constant",
					regex: /#[0-9a-f]{3,8}\b/i
				},
				{
					type: "keyword",
					regex: CSS_KEYWORDS
				},
				{
					type: "keyword",
					regex: /@[a-z][\w-]*/i
				},
				{
					type: "tag",
					regex: /[.#][a-z_-][\w-]*/i
				},
				{
					type: "keyword",
					regex: /::?[a-z][\w-]*/i
				},
				{
					type: "function",
					regex: /\b[a-z_-][\w-]*(?=\s*\()/i
				},
				{
					type: "property",
					regex: /[a-z_-][\w-]*(?=\s*:)/i
				},
				{
					type: "punctuation",
					regex: /[{}()[\];:,]/
				},
				{
					type: "operator",
					regex: /[+~>*=|^$]/
				}
			]
		};
		case "python":
		case "py": return {
			defaultType: "variable",
			patterns: [
				{
					type: "string",
					regex: /"""[\s\S]*?"""/
				},
				{
					type: "string",
					regex: /'''[\s\S]*?'''/
				},
				{
					type: "string",
					regex: /f"(?:[^"\\]|\\.)*"/
				},
				{
					type: "string",
					regex: /f'(?:[^'\\]|\\.)*'/
				},
				{
					type: "comment",
					regex: /#[^\n]*/
				},
				{
					type: "string",
					regex: /"(?:[^"\\]|\\.)*"/
				},
				{
					type: "string",
					regex: /'(?:[^'\\]|\\.)*'/
				},
				{
					type: "constant",
					regex: /@[\w.]+/
				},
				{
					type: "number",
					regex: /\b0x[0-9a-f_]+\b/i
				},
				{
					type: "number",
					regex: /\b0b[01_]+\b/i
				},
				{
					type: "number",
					regex: /\b0o[0-7_]+\b/i
				},
				{
					type: "number",
					regex: /\b\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?j?\b/
				},
				{
					type: "keyword",
					regex: PYTHON_KEYWORDS
				},
				{
					type: "function",
					regex: /\b[a-z_]\w*(?=\s*\()/i
				},
				{
					type: "type",
					regex: /\b[A-Z]\w*\b/
				},
				{
					type: "operator",
					regex: /[+\-*/%=!<>&|^~@:]+/
				},
				{
					type: "punctuation",
					regex: /[{}()[\];,.]/
				},
				{
					type: "variable",
					regex: /\b[a-z_]\w*\b/i
				}
			]
		};
		case "bash":
		case "sh":
		case "zsh":
		case "shell": return {
			defaultType: "variable",
			patterns: [
				{
					type: "comment",
					regex: /#[^\n]*/
				},
				{
					type: "string",
					regex: /"(?:[^"\\]|\\.)*"/
				},
				{
					type: "string",
					regex: /'[^']*'/
				},
				{
					type: "variable",
					regex: /\$\{[^}]+\}/
				},
				{
					type: "variable",
					regex: /\$[a-z_]\w*/i
				},
				{
					type: "variable",
					regex: /\$[0-9@#?*!$-]/
				},
				{
					type: "number",
					regex: /\b\d+\b/
				},
				{
					type: "keyword",
					regex: BASH_KEYWORDS
				},
				{
					type: "function",
					regex: /\b[a-z_]\w*(?=\s*\()/i
				},
				{
					type: "operator",
					regex: /[|&<>;!]+/
				},
				{
					type: "punctuation",
					regex: /[{}()[\]]/
				}
			]
		};
		case "php": return {
			defaultType: "variable",
			patterns: [
				{
					type: "comment",
					regex: /\/\*[\s\S]*?\*\//
				},
				{
					type: "comment",
					regex: /\/\/[^\n]*/
				},
				{
					type: "comment",
					regex: /#[^\n]*/
				},
				{
					type: "string",
					regex: /"(?:[^"\\]|\\.)*"/
				},
				{
					type: "string",
					regex: /'(?:[^'\\]|\\.)*'/
				},
				{
					type: "variable",
					regex: /\$[a-z_]\w*/i
				},
				{
					type: "number",
					regex: /\b0x[0-9a-f]+\b/i
				},
				{
					type: "number",
					regex: /\b\d+(?:\.\d*)?(?:e[+-]?\d+)?\b/i
				},
				{
					type: "keyword",
					regex: PHP_KEYWORDS
				},
				{
					type: "function",
					regex: /\b[a-z_]\w*(?=\s*\()/i
				},
				{
					type: "type",
					regex: /\b[A-Z]\w*\b/
				},
				{
					type: "operator",
					regex: /[+\-*/%=!<>&|^~?:.]+/
				},
				{
					type: "constant",
					regex: /@\w+/
				},
				{
					type: "punctuation",
					regex: /[{}()[\];,.]/
				}
			]
		};
		case "hack": return {
			defaultType: "variable",
			patterns: [
				{
					type: "comment",
					regex: /\/\*[\s\S]*?\*\//
				},
				{
					type: "comment",
					regex: /\/\/[^\n]*/
				},
				{
					type: "string",
					regex: /"(?:[^"\\]|\\.)*"/
				},
				{
					type: "string",
					regex: /'(?:[^'\\]|\\.)*'/
				},
				{
					type: "variable",
					regex: /\$[a-z_]\w*/i
				},
				{
					type: "number",
					regex: /\b0x[0-9a-f]+\b/i
				},
				{
					type: "number",
					regex: /\b\d+(?:\.\d*)?(?:e[+-]?\d+)?\b/i
				},
				{
					type: "keyword",
					regex: HACK_KEYWORDS
				},
				{
					type: "type",
					regex: /\b[A-Z]\w*\b/
				},
				{
					type: "function",
					regex: /\b[a-z_]\w*(?=\s*\()/i
				},
				{
					type: "property",
					regex: /(?<=->|::)[a-z_]\w*\b/i
				},
				{
					type: "operator",
					regex: /[+\-*/%=!<>&|^~?:.]+/
				},
				{
					type: "constant",
					regex: /<<\w+/
				},
				{
					type: "punctuation",
					regex: /[{}()[\];,.]/
				}
			]
		};
		case "yaml":
		case "yml": return {
			defaultType: "variable",
			patterns: [
				{
					type: "comment",
					regex: /#[^\n]*/
				},
				{
					type: "string",
					regex: /"(?:[^"\\]|\\.)*"/
				},
				{
					type: "string",
					regex: /'(?:[^'\\]|\\.)*'/
				},
				{
					type: "constant",
					regex: /\b(true|false|yes|no|on|off|null|~)\b/i
				},
				{
					type: "variable",
					regex: /[&*]\w+/
				},
				{
					type: "type",
					regex: /!!\w+/
				},
				{
					type: "number",
					regex: /\b-?\d+(?:\.\d*)?(?:e[+-]?\d+)?\b/i
				},
				{
					type: "property",
					regex: /^[ \t]*\w[\w./-]*(?:\s+[\w./-]+)*(?=\s*:)/m
				},
				{
					type: "keyword",
					regex: /---/
				},
				{
					type: "keyword",
					regex: /\.\.\./
				},
				{
					type: "operator",
					regex: /[:|>\-?]/
				},
				{
					type: "punctuation",
					regex: /[{}()[\],]/
				},
				{
					type: "variable",
					regex: /\b[a-z_]\w*\b/i
				}
			]
		};
		case "markdown":
		case "md": return {
			defaultType: "variable",
			patterns: [
				{
					type: "keyword",
					regex: /^```\w*$/m
				},
				{
					type: "keyword",
					regex: /^#{1,6}\s+.*/m
				},
				{
					type: "keyword",
					regex: /^---$/m
				},
				{
					type: "keyword",
					regex: /^\*\*\*$/m
				},
				{
					type: "string",
					regex: /\*\*(?:[^*]|\*(?!\*))+\*\*/
				},
				{
					type: "string",
					regex: /\*[^*]+\*/
				},
				{
					type: "constant",
					regex: /`[^`]+`/
				},
				{
					type: "function",
					regex: /\[[^\]]+\]\([^)]+\)/
				},
				{
					type: "comment",
					regex: /^>\s+.*/m
				},
				{
					type: "operator",
					regex: /^\s*[-*+]\s/m
				},
				{
					type: "number",
					regex: /^\s*\d+\.\s/m
				}
			]
		};
		default: return null;
	}
}
function buildLanguage(lang) {
	const cached = langCache.get(lang);
	if (cached !== void 0) return cached;
	const raw = buildLanguagePatterns(lang);
	const definition = raw == null ? null : {
		defaultType: raw.defaultType,
		patterns: raw.patterns.map((pattern) => ({
			...pattern,
			anchored: new RegExp(pattern.regex.source, `${pattern.regex.flags.replace(/[gy]/g, "")}y`)
		}))
	};
	langCache.set(lang, definition);
	return definition;
}
var ASYNC_CHUNK_SIZE = 800;
async function yieldToMain() {
	if (typeof scheduler !== "undefined" && typeof scheduler.yield === "function") return scheduler.yield();
	return new Promise((resolve) => setTimeout(resolve, 0));
}
/** Tokens matching the language's own text color are omitted. */
function tokenizeLine(code, definition, lineStart, lineEnd) {
	const tokens = [];
	const limit = Math.min(lineEnd, code.length);
	let position = lineStart;
	while (position < limit) {
		let matched = false;
		for (const pattern of definition.patterns) {
			pattern.anchored.lastIndex = position;
			const match = pattern.anchored.exec(code);
			if (match != null && match.index === position && match[0].length > 0) {
				if (pattern.type !== definition.defaultType) tokens.push({
					type: pattern.type,
					start: position - lineStart,
					end: position - lineStart + match[0].length
				});
				position += match[0].length;
				matched = true;
				break;
			}
		}
		if (!matched) position++;
	}
	return tokens;
}
/**
* Tokenize a code string into one token array per line, with offsets relative
* to the start of the line.
*/
function tokenize(code, language) {
	const definition = buildLanguage(language);
	if (definition == null) return [];
	const result = [];
	let lineStart = 0;
	for (let i = 0; i <= code.length; i++) if (i === code.length || code[i] === "\n") {
		result.push(tokenizeLine(code, definition, lineStart, i));
		lineStart = i + 1;
	}
	return result;
}
/**
* The same result as {@link tokenize}, but yielding to the main thread between
* chunks so a long file does not block rendering. An aborted signal stops the
* work and returns the lines tokenized so far.
*/
async function tokenizeAsync(code, language, signal) {
	const definition = buildLanguage(language);
	if (definition == null) return [];
	const result = [];
	let charsInChunk = 0;
	let lineStart = 0;
	for (let i = 0; i <= code.length; i++) if (i === code.length || code[i] === "\n") {
		result.push(tokenizeLine(code, definition, lineStart, i));
		charsInChunk += i - lineStart + 1;
		lineStart = i + 1;
		if (charsInChunk >= ASYNC_CHUNK_SIZE && i < code.length) {
			if (signal?.aborted === true) return result;
			charsInChunk = 0;
			await yieldToMain();
		}
	}
	return result;
}
/**
* Convert flat tokens with absolute offsets, as a custom tokenizer returns
* them, into one line-relative token array per line.
*/
function flatTokensToLines(tokens, code) {
	const lineStarts = [0];
	for (let i = 0; i < code.length; i++) if (code[i] === "\n") lineStarts.push(i + 1);
	const result = Array.from({ length: lineStarts.length }, () => []);
	let lineIndex = 0;
	for (const token of tokens) {
		while (lineIndex < lineStarts.length - 1 && token.start >= lineStarts[lineIndex + 1]) lineIndex++;
		const lineStart = lineStarts[lineIndex];
		result[lineIndex].push({
			type: token.type,
			start: token.start - lineStart,
			end: token.end - lineStart
		});
	}
	return result;
}
var DEFAULT_RESET_AFTER_MS = 2e3;
/**
* Copy-to-clipboard behavior with a transient copied flag. Re-copying restarts
* the reset timer, so a rapid second copy never shortens the confirmation.
*/
function useCopyToClipboard(options = {}) {
	const resetAfterMs = options.resetAfterMs ?? DEFAULT_RESET_AFTER_MS;
	const isCopied = ref(false);
	let resetTimer = null;
	async function copy(text) {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			return false;
		}
		isCopied.value = true;
		if (resetTimer != null) clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			resetTimer = null;
			isCopied.value = false;
		}, resetAfterMs);
		return true;
	}
	onBeforeUnmount(() => {
		if (resetTimer != null) clearTimeout(resetTimer);
	});
	return {
		copy,
		isCopied
	};
}
var _hoisted_1 = [
	"data-container",
	"data-language",
	"data-size"
];
var _hoisted_2 = [
	"data-container",
	"data-language",
	"data-size"
];
var _hoisted_3 = ["data-language", "data-size"];
var _hoisted_4 = {
	key: 0,
	class: "astryx-code-block__chevron"
};
var _hoisted_5 = ["inert"];
var _hoisted_6 = { class: "astryx-code-block__collapse-inner" };
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxCodeBlock",
	inheritAttrs: false,
	__name: "CodeBlock",
	props: {
		code: {},
		language: { default: "plaintext" },
		title: {},
		hasLanguageLabel: {
			type: Boolean,
			default: true
		},
		hasLineNumbers: {
			type: Boolean,
			default: false
		},
		highlightLines: {},
		hasCopyButton: {
			type: Boolean,
			default: true
		},
		isWrapped: {
			type: Boolean,
			default: false
		},
		maxHeight: {},
		isCollapsible: {
			type: Boolean,
			default: false
		},
		collapsibleThreshold: { default: 10 },
		size: { default: "md" },
		width: { default: "fit-content" },
		container: { default: "card" },
		tokenizer: {},
		highlightMode: { default: "auto" },
		copyLabel: { default: "Copy code" },
		copiedLabel: { default: "Copied" },
		codeLabel: { default: "Code" }
	},
	emits: ["copy"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const attrs = useAttrs();
		const root = useTemplateRef("root");
		__expose({ element: computed(() => root.value ?? null) });
		const lines = computed(() => {
			const split = props.code.split("\n");
			if (split.length > 1 && split[split.length - 1] === "") split.pop();
			return split;
		});
		const asyncTokens = ref(null);
		let pendingLoad = null;
		const syncTokenLines = computed(() => {
			if (props.tokenizer != null) return flatTokensToLines(props.tokenizer(props.code, props.language), props.code);
			if (props.code.length >= 2e3) return null;
			return tokenize(props.code, props.language);
		});
		const tokenLines = computed(() => {
			const sync = syncTokenLines.value;
			if (sync != null) return sync;
			const async = asyncTokens.value;
			if (async != null && async.code === props.code && async.language === props.language) return async.tokens;
			return [];
		});
		async function loadTokens() {
			if (props.tokenizer != null || props.code.length < 2e3) return;
			const code = props.code;
			const language = props.language;
			const controller = new AbortController();
			pendingLoad?.abort();
			pendingLoad = controller;
			try {
				const tokens = await tokenizeAsync(code, language, controller.signal);
				if (!controller.signal.aborted) asyncTokens.value = {
					code,
					language,
					tokens
				};
			} catch {
				if (!controller.signal.aborted) asyncTokens.value = {
					code,
					language,
					tokens: []
				};
			}
		}
		watch([
			() => props.code,
			() => props.language,
			() => props.tokenizer
		], () => {
			loadTokens();
		}, { immediate: true });
		onBeforeUnmount(() => pendingLoad?.abort());
		function supportsHighlightApi() {
			return typeof CSS !== "undefined" && "highlights" in CSS && typeof Highlight !== "undefined";
		}
		function isSafari() {
			if (typeof navigator === "undefined") return false;
			const agent = navigator.userAgent;
			return agent.includes("AppleWebKit") && !agent.includes("Chrome");
		}
		/** Safari ships the Highlight API objects but paints them unreliably in code. */
		const paintMode = computed(() => {
			if (props.highlightMode === "spans" || !supportsHighlightApi()) return "spans";
			if (props.highlightMode === "ranges") return "ranges";
			return isSafari() ? "spans" : "ranges";
		});
		const highlightSet = computed(() => props.highlightLines == null ? null : new Set(props.highlightLines));
		const languageLabel = computed(() => props.hasLanguageLabel && props.language !== "plaintext" ? props.language : null);
		/** `filename — language`, omitting whichever half is missing. */
		const headerText = computed(() => [props.title, languageLabel.value].filter((part) => part != null && part !== "").join(" — "));
		const showHeader = computed(() => headerText.value !== "");
		const canCollapse = computed(() => showHeader.value && props.isCollapsible && lines.value.length >= props.collapsibleThreshold);
		const isCollapsed = ref(false);
		watch(canCollapse, () => {
			isCollapsed.value = false;
		});
		const regionId = `astryx-code-block-${useId()}`;
		/** Only interactive when collapsing is available, as the disclosure control. */
		const titleControlAttrs = computed(() => {
			if (!canCollapse.value) return {};
			return {
				"role": "button",
				"tabindex": 0,
				"aria-expanded": !isCollapsed.value,
				"aria-controls": regionId,
				"aria-label": headerLabel()
			};
		});
		function headerLabel() {
			return !(props.title != null && props.title.trim() !== "") && languageLabel.value == null ? props.codeLabel : void 0;
		}
		function toggleCollapsed() {
			isCollapsed.value = !isCollapsed.value;
		}
		function onTitleKeydown(event) {
			if (!canCollapse.value) return;
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				toggleCollapsed();
			}
		}
		const { copy, isCopied } = useCopyToClipboard();
		const copyButtonLabel = computed(() => isCopied.value ? props.copiedLabel : props.copyLabel);
		async function onCopy() {
			if (await copy(props.code)) emit("copy");
		}
		const rootStyle = computed(() => {
			const style = { width: props.width };
			if (props.width === "fit-content") {
				style.minWidth = "min(100%, 400px)";
				style.maxWidth = "100%";
			}
			return [attrs.style, style];
		});
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("pre", mergeProps({
				ref_key: "root",
				ref: root
			}, forwardedAttrs.value, {
				class: ["astryx-code-block", unref(attrs).class],
				"data-container": __props.container,
				"data-language": __props.language,
				"data-size": __props.size,
				style: rootStyle.value
			}), [
				_cache[18] || (_cache[18] = createTextVNode("    ", -1)),
				showHeader.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass(["astryx-code-block__header astryx-code-block-header", { "astryx-code-block__header--divided": __props.hasLineNumbers }]),
					"data-container": __props.container,
					"data-language": __props.language,
					"data-size": __props.size
				}, [
					_cache[8] || (_cache[8] = createTextVNode("\n      ", -1)),
					createCommentVNode(" eslint-disable-next-line vue-a11y/no-static-element-interactions -- the interactive role, tabindex, and aria state are bound from `titleControlAttrs`, which the rule cannot see; it is the disclosure control when collapsing is available. "),
					_cache[9] || (_cache[9] = createTextVNode("\n      ", -1)),
					createElementVNode("div", mergeProps(titleControlAttrs.value, {
						class: ["astryx-code-block__title-control", { "astryx-code-block__title-control--collapsible": canCollapse.value }],
						onClick: _cache[0] || (_cache[0] = ($event) => canCollapse.value && toggleCollapsed()),
						onKeydown: onTitleKeydown
					}), [
						_cache[4] || (_cache[4] = createTextVNode("\n        ", -1)),
						createElementVNode("span", {
							class: "astryx-code-block__title astryx-code-block-title",
							"data-language": __props.language,
							"data-size": __props.size
						}, [
							_cache[3] || (_cache[3] = createTextVNode("\n          ", -1)),
							canCollapse.value ? (openBlock(), createElementBlock("span", _hoisted_4, [
								_cache[1] || (_cache[1] = createTextVNode("\n            ", -1)),
								createVNode(_sfc_main$5, {
									class: normalizeClass(["astryx-code-block__chevron-icon", { "astryx-code-block__chevron-icon--expanded": !isCollapsed.value }]),
									icon: "chevronRight",
									size: "xsm",
									color: "inherit"
								}, null, 8, ["class"]),
								_cache[2] || (_cache[2] = createTextVNode("\n          ", -1))
							])) : createCommentVNode("v-if", true),
							createTextVNode(toDisplayString(headerText.value) + "\n        ", 1)
						], 8, _hoisted_3),
						_cache[5] || (_cache[5] = createTextVNode("\n      ", -1))
					], 16),
					_cache[10] || (_cache[10] = createTextVNode("\n      ", -1)),
					__props.hasCopyButton ? (openBlock(), createBlock(_sfc_main$4, {
						key: 0,
						class: "astryx-code-block-copy-button",
						variant: "ghost",
						size: "sm",
						label: copyButtonLabel.value,
						tooltip: __props.copyLabel,
						onClick: withModifiers(onCopy, ["stop"])
					}, {
						default: withCtx(() => [
							_cache[6] || (_cache[6] = createTextVNode("\n        ", -1)),
							createVNode(_sfc_main$5, {
								icon: unref(isCopied) ? "check" : "copy",
								size: "sm",
								color: "inherit"
							}, null, 8, ["icon"]),
							_cache[7] || (_cache[7] = createTextVNode("\n      ", -1))
						]),
						_: 1
					}, 8, ["label", "tooltip"])) : createCommentVNode("v-if", true),
					_cache[11] || (_cache[11] = createTextVNode("\n    ", -1))
				], 10, _hoisted_2)) : createCommentVNode("v-if", true),
				_cache[19] || (_cache[19] = createTextVNode("\n    ", -1)),
				canCollapse.value ? (openBlock(), createElementBlock("div", {
					key: 1,
					id: regionId,
					class: normalizeClass(["astryx-code-block__collapse", { "astryx-code-block__collapse--collapsed": isCollapsed.value }]),
					inert: isCollapsed.value || void 0
				}, [
					_cache[14] || (_cache[14] = createTextVNode("\n      ", -1)),
					createElementVNode("div", _hoisted_6, [
						_cache[12] || (_cache[12] = createTextVNode("\n        ", -1)),
						createVNode(_sfc_main$1, {
							"has-line-numbers": __props.hasLineNumbers,
							"highlight-set": highlightSet.value,
							"is-compact": showHeader.value && !__props.hasLineNumbers,
							"is-wrapped": __props.isWrapped,
							lines: lines.value,
							"max-height": __props.maxHeight,
							mode: paintMode.value,
							"scroll-label": languageLabel.value ?? __props.codeLabel,
							size: __props.size,
							"token-lines": tokenLines.value
						}, null, 8, [
							"has-line-numbers",
							"highlight-set",
							"is-compact",
							"is-wrapped",
							"lines",
							"max-height",
							"mode",
							"scroll-label",
							"size",
							"token-lines"
						]),
						_cache[13] || (_cache[13] = createTextVNode("\n      ", -1))
					]),
					_cache[15] || (_cache[15] = createTextVNode("\n    ", -1))
				], 10, _hoisted_5)) : (openBlock(), createBlock(_sfc_main$1, {
					key: 2,
					"has-line-numbers": __props.hasLineNumbers,
					"highlight-set": highlightSet.value,
					"is-compact": showHeader.value && !__props.hasLineNumbers,
					"is-wrapped": __props.isWrapped,
					lines: lines.value,
					"max-height": __props.maxHeight,
					mode: paintMode.value,
					"scroll-label": languageLabel.value ?? __props.codeLabel,
					size: __props.size,
					"token-lines": tokenLines.value
				}, null, 8, [
					"has-line-numbers",
					"highlight-set",
					"is-compact",
					"is-wrapped",
					"lines",
					"max-height",
					"mode",
					"scroll-label",
					"size",
					"token-lines"
				])),
				_cache[20] || (_cache[20] = createTextVNode("\n    ", -1)),
				!showHeader.value && __props.hasCopyButton ? (openBlock(), createBlock(_sfc_main$4, {
					key: 3,
					class: "astryx-code-block-copy-button astryx-code-block-copy-button--floating",
					variant: "ghost",
					size: "sm",
					label: copyButtonLabel.value,
					tooltip: __props.copyLabel,
					onClick: withModifiers(onCopy, ["stop"])
				}, {
					default: withCtx(() => [
						_cache[16] || (_cache[16] = createTextVNode("\n      ", -1)),
						createVNode(_sfc_main$5, {
							icon: unref(isCopied) ? "check" : "copy",
							size: "sm",
							color: "inherit"
						}, null, 8, ["icon"]),
						_cache[17] || (_cache[17] = createTextVNode("\n    ", -1))
					]),
					_: 1
				}, 8, ["label", "tooltip"])) : createCommentVNode("v-if", true),
				_cache[21] || (_cache[21] = createTextVNode("\n  ", -1))
			], 16, _hoisted_1), createVNode(_sfc_main$3, {
				role: "status",
				"aria-live": "polite"
			}, {
				default: withCtx(() => [createTextVNode(toDisplayString(unref(isCopied) ? __props.copiedLabel : ""), 1)]),
				_: 1
			})], 64);
		};
	}
});
//#endregion
//#region components/demos/code/basic.vue?vue&type=script&setup=true&lang.ts
var snippet$2 = `type Shipment = {
  id: string
  weightKg: number
}

export function totalWeight(shipments: Shipment[]): number {
  return shipments.reduce((total, item) => total + item.weightKg, 0)
}`;
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "code-preview__stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				code: snippet$2,
				language: "typescript",
				title: "shipping.ts"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/code/basic.vue
var _sfc_setup$3 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/code/basic.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/code/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { CodeBlock } from '@astryx-vue/core/Code'\n\nconst snippet = `type Shipment = {\n  id: string\n  weightKg: number\n}\n\nexport function totalWeight(shipments: Shipment[]): number {\n  return shipments.reduce((total, item) => total + item.weightKg, 0)\n}`\n<\/script>\n\n<template>\n  <div class=\"code-preview__stack\">\n    <CodeBlock :code=\"snippet\" language=\"typescript\" title=\"shipping.ts\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CodeBlock } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Code'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> snippet</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> `type Shipment = {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  id: string</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  weightKg: number</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">export function totalWeight(shipments: Shipment[]): number {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  return shipments.reduce((total, item) => total + item.weightKg, 0)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}`</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"code-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CodeBlock</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">code</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">snippet</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> language</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"typescript\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"shipping.ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/code/collapsible.vue?vue&type=script&setup=true&lang.ts
var snippet$1 = `{
  "name": "@astryx-vue/core",
  "type": "module",
  "exports": {
    "./Code": {
      "source": "./src/Code/index.ts",
      "types": "./dist/Code/index.d.ts",
      "import": "./dist/Code/index.js"
    }
  },
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "tsdown",
    "typecheck": "vue-tsc --noEmit -p tsconfig.json"
  }
}`;
var collapsible_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "collapsible",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "code-preview__stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				code: snippet$1,
				language: "json",
				title: "package.json",
				"is-collapsible": "",
				"max-height": 196
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/code/collapsible.vue
var _sfc_setup$2 = collapsible_vue_vue_type_script_setup_true_lang_default.setup;
collapsible_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/code/collapsible.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var collapsible_default$1 = collapsible_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/code/collapsible.vue?raw&highlighted
var collapsible_default = {
	"source": "<script setup lang=\"ts\">\nimport { CodeBlock } from '@astryx-vue/core/Code'\n\nconst snippet = `{\n  \"name\": \"@astryx-vue/core\",\n  \"type\": \"module\",\n  \"exports\": {\n    \"./Code\": {\n      \"source\": \"./src/Code/index.ts\",\n      \"types\": \"./dist/Code/index.d.ts\",\n      \"import\": \"./dist/Code/index.js\"\n    }\n  },\n  \"sideEffects\": [\"**/*.css\"],\n  \"scripts\": {\n    \"build\": \"tsdown\",\n    \"typecheck\": \"vue-tsc --noEmit -p tsconfig.json\"\n  }\n}`\n<\/script>\n\n<template>\n  <div class=\"code-preview__stack\">\n    <CodeBlock :code=\"snippet\" language=\"json\" title=\"package.json\" is-collapsible :max-height=\"196\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CodeBlock } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Code'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> snippet</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> `{</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  \"name\": \"@astryx-vue/core\",</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  \"type\": \"module\",</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  \"exports\": {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">    \"./Code\": {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">      \"source\": \"./src/Code/index.ts\",</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">      \"types\": \"./dist/Code/index.d.ts\",</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">      \"import\": \"./dist/Code/index.js\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">    }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  \"sideEffects\": [\"**/*.css\"],</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  \"scripts\": {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">    \"build\": \"tsdown\",</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">    \"typecheck\": \"vue-tsc --noEmit -p tsconfig.json\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}`</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"code-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CodeBlock</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">code</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">snippet</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> language</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"json\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"package.json\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-collapsible</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">max-height</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">196</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/code/inline.vue?vue&type=script&setup=true&lang.ts
var inline_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "inline",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "code-preview__prose" }, _attrs))}><p class="code-preview__sentence"> Pass `);
			_push(ssrRenderComponent(unref(_sfc_main$2), null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`isLoading`);
					else return [createTextVNode("isLoading")];
				}),
				_: 1
			}, _parent));
			_push(` to keep the button busy until the promise settles. </p><p class="code-preview__sentence code-preview__sentence--large"> Run `);
			_push(ssrRenderComponent(unref(_sfc_main$2), { size: "inherit" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`npm run build:packages`);
					else return [createTextVNode("npm run build:packages")];
				}),
				_: 1
			}, _parent));
			_push(` before you publish. </p><p class="code-preview__sentence code-preview__sentence--muted"> The `);
			_push(ssrRenderComponent(unref(_sfc_main$2), { color: "secondary" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`variant`);
					else return [createTextVNode("variant")];
				}),
				_: 1
			}, _parent));
			_push(` prop selects the visual style. </p></div>`);
		};
	}
});
//#endregion
//#region components/demos/code/inline.vue
var _sfc_setup$1 = inline_vue_vue_type_script_setup_true_lang_default.setup;
inline_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/code/inline.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var inline_default$1 = inline_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/code/inline.vue?raw&highlighted
var inline_default = {
	"source": "<script setup lang=\"ts\">\nimport { Code } from '@astryx-vue/core/Code'\n<\/script>\n\n<template>\n  <div class=\"code-preview__prose\">\n    <p class=\"code-preview__sentence\">\n      Pass <Code>isLoading</Code> to keep the button busy until the promise settles.\n    </p>\n    <p class=\"code-preview__sentence code-preview__sentence--large\">\n      Run <Code size=\"inherit\">npm run build:packages</Code> before you publish.\n    </p>\n    <p class=\"code-preview__sentence code-preview__sentence--muted\">\n      The <Code color=\"secondary\">variant</Code> prop selects the visual style.\n    </p>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Code } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Code'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"code-preview__prose\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"code-preview__sentence\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Pass &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Code</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>isLoading&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Code</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">> to keep the button busy until the promise settles.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"code-preview__sentence code-preview__sentence--large\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Run &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Code</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"inherit\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>npm run build:packages&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Code</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">> before you publish.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"code-preview__sentence code-preview__sentence--muted\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      The &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Code</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>variant&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Code</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">> prop selects the visual style.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/code/line-numbers.vue?vue&type=script&setup=true&lang.ts
var snippet = `const queue = []

function enqueue(job) {
  queue.push(job)
  if (queue.length === 1) run()
}

function run() {
  const job = queue.shift()
  if (!job) return
  job().finally(run)
}`;
var line_numbers_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "line-numbers",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "code-preview__stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				code: snippet,
				language: "javascript",
				title: "queue.js",
				"has-line-numbers": "",
				"highlight-lines": [4, 5]
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/code/line-numbers.vue
var _sfc_setup = line_numbers_vue_vue_type_script_setup_true_lang_default.setup;
line_numbers_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/code/line-numbers.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var line_numbers_default$1 = line_numbers_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/code/line-numbers.vue?raw&highlighted
var line_numbers_default = {
	"source": "<script setup lang=\"ts\">\nimport { CodeBlock } from '@astryx-vue/core/Code'\n\nconst snippet = `const queue = []\n\nfunction enqueue(job) {\n  queue.push(job)\n  if (queue.length === 1) run()\n}\n\nfunction run() {\n  const job = queue.shift()\n  if (!job) return\n  job().finally(run)\n}`\n<\/script>\n\n<template>\n  <div class=\"code-preview__stack\">\n    <CodeBlock\n      :code=\"snippet\"\n      language=\"javascript\"\n      title=\"queue.js\"\n      has-line-numbers\n      :highlight-lines=\"[4, 5]\"\n    />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CodeBlock } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Code'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> snippet</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> `const queue = []</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">function enqueue(job) {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  queue.push(job)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  if (queue.length === 1) run()</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">function run() {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  const job = queue.shift()</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  if (!job) return</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">  job().finally(run)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}`</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"code-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CodeBlock</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">code</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">snippet</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      language</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"javascript\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"queue.js\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      has-line-numbers</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">highlight-lines</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">4</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/code/index.ts
var options = { className: "code-preview" };
var codeBasic = defineDemo(basic_default$1, basic_default, options);
var codeInline = defineDemo(inline_default$1, inline_default, options);
var codeLineNumbers = defineDemo(line_numbers_default$1, line_numbers_default, options);
var codeCollapsible = defineDemo(collapsible_default$1, collapsible_default, options);
//#endregion
export { codeLineNumbers as i, codeCollapsible as n, codeInline as r, codeBasic as t };
