import { Bn as $createParagraphNode, Dr as $generateNodesFromRawText, Dt as $setFormatFromDOM, Et as $setDirectionFromDOM, Gr as $isTextNode, Ln as DEFAULT_EDITOR_DOM_CONFIG, M as $getSelectionSlotFrame, Nr as $isBlockElementNode, Pr as $isNodeSelection, Sa as createState, Ur as $createTextNode, Xt as getRegisteredSubtypeMap, _r as $assumeActiveEditor, an as isDOMTextNode, ao as TEXT_TYPE_TO_FORMAT, ar as $isLineBreakNode, c as configExtension, ci as $isLexicalNode, cr as isOnlyChildInBlockNode, ct as $getRoot, en as isBlockDomNode, et as $getDocument, fr as RootNode, go as invariant, hr as $isElementNode, ir as $createLineBreakNode, lr as ArtificialNode__DO_NOT_USE, mt as $isRootOrShadowRoot, nn as isDOMDocumentNode, nt as $getEditorDOMRenderConfig, o as shallowMergeConfig, pn as isInlineDomNode, pr as $isDecoratorNode, sn as isDocumentFragment, sr as isLastChildInBlockNode, tt as $getEditor, u as defineExtension, un as isHTMLElement, vn as iterStaticNodeConfigChain, wn as setNodeIndentFromDOM, yr as $fullReconcile } from "./src-BWdqgNjM.js";
import { C as $getExtensionOutput, T as getPeerDependencyFromEditor, g as HorizontalRuleNode, h as HorizontalRuleExtension, p as $createHorizontalRuleNode, z as getKnownTypesAndNodes } from "./src-DjbHpMmC.js";
import { _ as $sliceSelectedTextNodeContent } from "./src-jZHBqyIl.js";
import { L as objectKlassEquals } from "./src-9-5QzbBl.js";
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/ContextRecord.ts
var activeContext;
/**
* @experimental
*
* @param contextRecord The ContextRecord
* @param cfg The configuration
* @returns The value or defaultValue of cfg
*/
function getContextValue(contextRecord, cfg) {
	const { key } = cfg;
	return contextRecord && key in contextRecord ? contextRecord[key] : cfg.defaultValue;
}
function getEditorContext(editor) {
	return activeContext && activeContext.editor === editor ? activeContext : void 0;
}
/**
* @experimental
*
* @param sym The symbol for this ContextRecord (e.g. DOMRenderContextSymbol)
* @param editor The editor
* @returns The current context or undefined
*/
function getContextRecord(sym, editor) {
	const editorContext = getEditorContext(editor);
	return editorContext && editorContext[sym];
}
function toPair(contextRecord, pairOrUpdater) {
	if ("cfg" in pairOrUpdater) {
		const { cfg, updater } = pairOrUpdater;
		return [cfg, updater(getContextValue(contextRecord, cfg))];
	}
	return pairOrUpdater;
}
/**
* Construct a new context from a parent context and pairs
*
* @param pairs The pairs and updaters to build the context from
* @param parent The parent context
* @returns The new context
*/
function contextFromPairs(pairs, parent) {
	let rval = parent;
	for (const pairOrUpdater of pairs) {
		const [k, v] = toPair(rval, pairOrUpdater);
		const key = k.key;
		if (rval === parent && getContextValue(rval, k) === v) continue;
		const ctx = rval === parent || rval === void 0 ? createChildContext(parent) : rval;
		ctx[key] = v;
		rval = ctx;
	}
	return rval;
}
function createChildContext(parent) {
	return Object.create(parent || null);
}
/**
* Create a context config pair that sets a value in the render context.
* @experimental
*/
function contextValue(cfg, value) {
	return [cfg, value];
}
/**
* Create a context config updater that transforms a value in the render context.
* @experimental
*/
function contextUpdater(cfg, updater) {
	return {
		cfg,
		updater
	};
}
/**
* @internal
* @experimental
* @__NO_SIDE_EFFECTS__
*/
function $withFullContext(sym, contextRecord, f, editor = $getEditor()) {
	const prevDOMContext = activeContext;
	const parentEditorContext = getEditorContext(editor);
	try {
		activeContext = {
			...parentEditorContext,
			editor,
			[sym]: contextRecord
		};
		return f();
	} finally {
		activeContext = prevDOMContext;
	}
}
/**
* @internal
* @experimental
* @__NO_SIDE_EFFECTS__
*/
function $withContext(sym, $defaults = () => void 0) {
	return (cfg, editor = $getEditor()) => {
		return (f) => {
			const parentEditorContext = getEditorContext(editor);
			const parentContextRecord = parentEditorContext && parentEditorContext[sym];
			const contextRecord = contextFromPairs(cfg, parentContextRecord || $defaults(editor));
			if (!contextRecord || contextRecord === parentContextRecord) return f();
			return $withFullContext(sym, contextRecord, f, editor);
		};
	};
}
/**
* @experimental
* @internal
* @__NO_SIDE_EFFECTS__
*/
function createContextState(tag, name, getDefaultValue, isEqual) {
	return Object.assign(createState(Symbol(name), {
		isEqual,
		parse: getDefaultValue
	}), { [tag]: true });
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/inlineStylesFromStyleSheets.ts
/**
* Inlines CSS rules from `<style>` tags onto matching elements as inline
* styles.
*
* Used by apps like Excel that generate HTML where styles live in
* class-based `<style>` rules (e.g. `.xl65 { background: #FFFF00; color:
* blue; }`) rather than inline styles. Since Lexical's import converters
* read inline styles, we resolve stylesheet rules into inline styles
* before conversion.
*
* Mutates the DOM in-place. Original inline styles always take
* precedence over stylesheet rules (matching CSS specificity behavior).
*
* No-op for {@link ParentNode}s that are not {@link Document}s — only a
* full document carries `styleSheets` we can iterate.
*
* @experimental
*/
var $inlineStylesFromStyleSheets = (dom, _ctx, $next) => {
	$inlineStylesFromStyleSheetsDOM(dom);
	$next();
};
function $inlineStylesFromStyleSheetsDOM(dom) {
	if (!isDOMDocumentNode(dom)) return;
	const doc = dom;
	if (doc.querySelector("style") === null) return;
	const originalInlineStyles = /* @__PURE__ */ new Map();
	function getOriginalInlineProps(el) {
		let props = originalInlineStyles.get(el);
		if (props === void 0) {
			props = /* @__PURE__ */ new Set();
			for (let i = 0; i < el.style.length; i++) props.add(el.style[i]);
			originalInlineStyles.set(el, props);
		}
		return props;
	}
	try {
		for (const sheet of Array.from(doc.styleSheets)) {
			let rules;
			try {
				rules = sheet.cssRules;
			} catch {
				continue;
			}
			for (const rule of Array.from(rules)) {
				if (!objectKlassEquals(rule, CSSStyleRule)) continue;
				let elements;
				try {
					elements = doc.querySelectorAll(rule.selectorText);
				} catch {
					continue;
				}
				for (const el of Array.from(elements)) {
					if (!isHTMLElement(el)) continue;
					const originalProps = getOriginalInlineProps(el);
					for (let i = 0; i < rule.style.length; i++) {
						const prop = rule.style[i];
						if (!originalProps.has(prop)) el.style.setProperty(prop, rule.style.getPropertyValue(prop), rule.style.getPropertyPriority(prop));
					}
				}
			}
		}
	} catch {}
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/constants.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var DOMRenderExtensionName = "@lexical/html/DOM";
var DOMRenderContextSymbol = Symbol.for("@lexical/html/DOMExportContext");
var DOMImportExtensionName = "@lexical/html/DOMImport";
var DOMImportContextSymbol = Symbol.for("@lexical/html/DOMImportContext");
var ALWAYS_TRUE = () => true;
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/RenderContext.ts
/**
* Create a context state to be used during render.
*
* Note that to support the ValueOrUpdater pattern you can not use a
* function for V (but you may wrap it in an array or object).
*
* @experimental
* @__NO_SIDE_EFFECTS__
*/
function createRenderState(name, getDefaultValue, isEqual) {
	return createContextState(DOMRenderContextSymbol, name, getDefaultValue, isEqual);
}
/**
* Render context state that is true if the export was initiated from the root of the document.
* @experimental
*/
var RenderContextRoot = createRenderState("root", Boolean);
/**
* Render context state that is true if this is an export operation ($generateHtmlFromNodes).
* @experimental
*/
var RenderContextExport = createRenderState("isExport", Boolean);
function getDefaultRenderContext(editor) {
	const dep = getPeerDependencyFromEditor(editor, DOMRenderExtensionName);
	return dep ? dep.output.defaults : void 0;
}
function getRenderContext(editor) {
	return getContextRecord(DOMRenderContextSymbol, editor) || getDefaultRenderContext(editor);
}
/**
* Get a render context value during a DOM render or export operation.
* @experimental
*/
function $getRenderContextValue(cfg, editor = $getEditor()) {
	return getContextValue(getRenderContext(editor), cfg);
}
function getRuntime(editor) {
	const dep = getPeerDependencyFromEditor(editor, DOMRenderExtensionName);
	return dep ? dep.output.runtime : void 0;
}
/**
* Imperatively set a value in the persistent editor render context.
*
* Unlike {@link $withRenderContext} (which scopes values to a callback), this
* persists on the editor. If the change flips any override's
* `disabledForEditor` result, the resident render config is recompiled and the
* affected nodes are re-rendered. No-op if {@link DOMRenderExtension} is not
* installed.
*
* @experimental
*/
function $setRenderContextValue(cfg, value, editor = $getEditor()) {
	const runtime = getRuntime(editor);
	if (runtime) runtime.setContextValue(cfg, value);
}
/**
* Imperatively update a value in the persistent editor render context with an
* updater function. See {@link $setRenderContextValue}.
*
* @experimental
*/
function $updateRenderContextValue(cfg, updater, editor = $getEditor()) {
	const runtime = getRuntime(editor);
	if (runtime) runtime.setContextValue(cfg, updater(getContextValue(runtime.editorContext, cfg)));
}
/**
* Resolve the {@link EditorDOMRenderConfig} to use for the current
* export/generate session, applying any `disabledForSession` overrides against
* the active session context. Falls back to the editor's resident config when
* {@link DOMRenderExtension} is not installed.
*
* @experimental
*/
function $getSessionDOMRenderConfig(editor = $getEditor()) {
	const runtime = getRuntime(editor);
	return runtime ? runtime.getSessionConfig() : $getEditorDOMRenderConfig(editor);
}
/**
* Execute a callback within a render context with the given config pairs.
* @experimental
*/
var $withRenderContext = $withContext(DOMRenderContextSymbol, getDefaultRenderContext);
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/domOverride.ts
function domOverride(nodes, config, options) {
	return {
		...config,
		...options,
		nodes
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/compileDOMRenderConfigOverrides.ts
function buildNodePredicate(klass) {
	return (node) => node instanceof klass;
}
function getPredicate(subtypeMap, { nodes }) {
	if (nodes === "*") return ALWAYS_TRUE;
	let types = {};
	const predicates = [];
	for (const klassOrPredicate of nodes) if ("getType" in klassOrPredicate) {
		const type = klassOrPredicate.getType();
		if (types) {
			const subtypes = subtypeMap.get(type);
			invariant(subtypes !== void 0, "Node class %s with type %s not registered in editor", klassOrPredicate.name, type);
			for (const subtype of subtypes) types[subtype] = true;
		}
		predicates.push(buildNodePredicate(klassOrPredicate));
	} else {
		types = void 0;
		predicates.push(klassOrPredicate);
	}
	if (types) return types;
	else if (predicates.length === 1) return predicates[0];
	return (node) => {
		for (const predicate of predicates) if (predicate(node)) return true;
		return false;
	};
}
function makePrerender() {
	return {
		$createDOM: [],
		$decorateDOM: [],
		$exportDOM: [],
		$extractWithChild: [],
		$getDOMSlot: [],
		$getSlotTargetElement: [],
		$shouldExclude: [],
		$shouldInclude: [],
		$updateDOM: []
	};
}
function ignoreNext2(acc) {
	return (node, _$next, editor) => acc(node, editor);
}
function ignoreNext3(acc) {
	return (node, a, _$next, editor) => acc(node, a, editor);
}
function ignoreNext4(acc) {
	return (node, a, b, _$next, editor) => acc(node, a, b, editor);
}
function ignoreNext5(acc) {
	return (node, a, b, c, _$next, editor) => acc(node, a, b, c, editor);
}
function merge2($acc, $getOverride) {
	return (node, editor) => {
		const $next = () => $acc(node, editor);
		const $override = $getOverride(node);
		return $override ? $override(node, $next, editor) : $next();
	};
}
function merge3(acc, $getOverride) {
	return (node, a, editor) => {
		const $next = () => acc(node, a, editor);
		const $override = $getOverride(node);
		return $override ? $override(node, a, $next, editor) : $next();
	};
}
var merge3GetDOMSlot = merge3;
var ignoreNext3GetDOMSlot = ignoreNext3;
function merge4($acc, $getOverride) {
	return (node, a, b, editor) => {
		const $next = () => $acc(node, a, b, editor);
		const $override = $getOverride(node);
		return $override ? $override(node, a, b, $next, editor) : $next();
	};
}
function merge5(acc, $getOverride) {
	return (node, a, b, c, editor) => {
		const $next = () => acc(node, a, b, c, editor);
		const $override = $getOverride(node);
		return $override ? $override(node, a, b, c, $next, editor) : $next();
	};
}
function sequence4($acc, $getOverride) {
	return (node, a, b, editor) => {
		$acc(node, a, b, editor);
		const $override = $getOverride(node);
		if ($override) $override(node, a, b, editor);
	};
}
function compilePrerenderKey(prerender, k, defaults, mergeFunction, ignoreNextFunction) {
	let acc = defaults[k];
	for (const pair of prerender[k]) if (typeof pair[0] === "function") {
		const [$predicate, $override] = pair;
		acc = mergeFunction(acc, (node) => $predicate(node) && $override || void 0);
	} else {
		const typeOverrides = pair[1];
		const compiled = {};
		for (const type in typeOverrides) {
			const arr = typeOverrides[type];
			if (arr) compiled[type] = arr.reduce(($acc, $override) => mergeFunction($acc, () => $override), acc);
		}
		acc = mergeFunction(acc, (node) => {
			const f = compiled[node.getType()];
			return f && ignoreNextFunction(f);
		});
	}
	defaults[k] = acc;
}
function addOverride(prerender, k, predicateOrTypes, override) {
	if (!override) return;
	const arr = prerender[k];
	if (typeof predicateOrTypes === "function") arr.push([predicateOrTypes, override]);
	else {
		const last = arr[arr.length - 1];
		let types;
		if (last && last[0] === "types") types = last[1];
		else {
			types = {};
			arr.push(["types", types]);
		}
		for (const type in predicateOrTypes) {
			const typeArr = types[type] || [];
			types[type] = typeArr;
			typeArr.push(override);
		}
	}
}
function isWildcard(override) {
	return override.nodes === "*";
}
function sortedOverrides(overrides) {
	const byWildcard = [];
	const byPredicate = [];
	const byNode = [];
	for (const override of overrides) if (isWildcard(override)) byWildcard.push(override);
	else if (Array.isArray(override.nodes)) for (const klassOrPredicate of override.nodes) if ($isLexicalNode(klassOrPredicate.prototype)) byNode.push(override.nodes.length === 1 ? override : {
		...override,
		nodes: [klassOrPredicate]
	});
	else byPredicate.push(override.nodes.length === 1 ? override : {
		...override,
		nodes: [klassOrPredicate]
	});
	const depths = /* @__PURE__ */ new Map();
	const depthOf = (klass) => {
		let depth = depths.get(klass);
		if (depth === void 0) {
			depth = -1;
			for (const _ of iterStaticNodeConfigChain(klass)) depth++;
			depths.set(klass, depth);
		}
		return depth;
	};
	byNode.sort((a, b) => depthOf(a.nodes[0]) - depthOf(b.nodes[0]));
	return [
		...byNode,
		...byPredicate,
		...byWildcard
	];
}
function precompileDOMRenderConfigOverrides(editorConfig, overrides) {
	const subtypeMap = getRegisteredSubtypeMap(getKnownTypesAndNodes(editorConfig).nodes);
	const prerender = makePrerender();
	for (const override of sortedOverrides(overrides)) {
		const predicateOrTypes = getPredicate(subtypeMap, override);
		for (const k_ in prerender) {
			const k = k_;
			addOverride(prerender, k, predicateOrTypes, override[k]);
		}
	}
	return prerender;
}
function identity(v) {
	return v;
}
function compileDOMRenderConfigOverrides(editorConfig, { overrides }) {
	const prerender = precompileDOMRenderConfigOverrides(editorConfig, overrides);
	const dom = {
		...DEFAULT_EDITOR_DOM_CONFIG,
		...editorConfig.dom
	};
	compilePrerenderKey(prerender, "$createDOM", dom, merge2, ignoreNext2);
	compilePrerenderKey(prerender, "$exportDOM", dom, merge2, ignoreNext2);
	compilePrerenderKey(prerender, "$extractWithChild", dom, merge5, ignoreNext5);
	compilePrerenderKey(prerender, "$getDOMSlot", dom, merge3GetDOMSlot, ignoreNext3GetDOMSlot);
	compilePrerenderKey(prerender, "$shouldExclude", dom, merge3, ignoreNext3);
	compilePrerenderKey(prerender, "$shouldInclude", dom, merge3, ignoreNext3);
	compilePrerenderKey(prerender, "$getSlotTargetElement", dom, merge4, ignoreNext4);
	compilePrerenderKey(prerender, "$updateDOM", dom, merge4, ignoreNext4);
	compilePrerenderKey(prerender, "$decorateDOM", dom, sequence4, identity);
	return dom;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/DOMRenderRuntime.ts
function makeReader(record) {
	return { get(cfg) {
		return getContextValue(record, cfg);
	} };
}
/**
* The mutable, writable editor-level context record. Reads of a render state
* during reconciliation (and as the base layer of a session) fall through to
* this record, and it is the layer the `disabledForEditor` predicates read.
*
* @internal
*/
function createEditorContextRecord(contextDefaults) {
	const parent = Object.create(null);
	return contextFromPairs(contextDefaults, parent) || parent;
}
/**
* Filter the configured overrides down to those that are resident in the
* editor's render config, removing any whose `disabledForEditor` predicate
* returns `true` for the given editor context.
*
* @internal
*/
function filterEditorInstalled(overrides, record) {
	const reader = makeReader(record);
	return overrides.filter((o) => !(o.disabledForEditor && o.disabledForEditor(reader)));
}
function sameOverrides(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}
function symmetricDiff(prev, next) {
	const prevSet = new Set(prev);
	const nextSet = new Set(next);
	const changed = [];
	for (const o of prev) if (!nextSet.has(o)) changed.push(o);
	for (const o of next) if (!prevSet.has(o)) changed.push(o);
	return changed;
}
/**
* Build a predicate matching the nodes an override targets — `'*'` matches
* everything, a node class matches by `instanceof`, and a guard is used as-is.
*/
function nodeMatcher(o) {
	if (o.nodes === "*") return () => true;
	const matchers = o.nodes.map((match) => {
		const klass = match;
		return $isLexicalNode(klass.prototype) ? (node) => node instanceof klass : match;
	});
	return (node) => matchers.some((f) => f(node));
}
/**
* Build a predicate matching the nodes whose DOM must be recreated for the
* given override change, or `null` when no live re-render is needed.
*
* `$createDOM`/`$getDOMSlot` produce the element and slot, and `$decorateDOM`
* may add DOM that only a fresh `$createDOM` can revert — so toggling any of
* them recreates the affected nodes. `$updateDOM` is diff-driven and applies on
* the next node update, and export-only hooks ($exportDOM/$shouldInclude/…)
* don't touch the live DOM, so neither needs a re-render. Recreating every
* affected node is the simple, always-correct choice; toggles are rare, so the
* cost is acceptable and can be optimized later if needed.
*/
function recreatePredicate(changed) {
	const matchers = [];
	for (const o of changed) if (o.$createDOM || o.$getDOMSlot || o.$decorateDOM) matchers.push(nodeMatcher(o));
	return matchers.length === 0 ? null : (node) => matchers.some((f) => f(node));
}
/**
* Per-editor runtime backing {@link DOMRenderExtension}'s conditional
* overrides and imperative editor context. See {@link DOMRenderRuntime}.
*
* @internal
*/
var DOMRenderRuntimeImpl = class {
	editor;
	/**
	* The `nodes` and base `dom` captured at `init` (before `dom` was
	* overwritten with the compiled config) — the clean base for every recompile.
	*/
	initialEditorConfig;
	overrides;
	editorContext;
	hasSessionGates;
	installed;
	/** Memoized session configs keyed by the set of session-disabled overrides. */
	sessionCache = /* @__PURE__ */ new Map();
	constructor(editor, initialEditorConfig, overrides, editorContext) {
		this.editor = editor;
		this.initialEditorConfig = initialEditorConfig;
		this.overrides = overrides;
		this.editorContext = editorContext;
		this.installed = filterEditorInstalled(overrides, editorContext);
		this.hasSessionGates = overrides.some((o) => o.disabledForSession);
	}
	setContextValue(cfg, value) {
		const prev = this.installed;
		this.editorContext[cfg.key] = value;
		const next = filterEditorInstalled(this.overrides, this.editorContext);
		if (sameOverrides(prev, next)) return;
		const changed = symmetricDiff(prev, next);
		this.installed = next;
		this.sessionCache.clear();
		const dom = compileDOMRenderConfigOverrides(this.initialEditorConfig, { overrides: next });
		this.editor._config.dom = dom;
		const recreate = recreatePredicate(changed);
		if (!recreate) return;
		const base = dom.$updateDOM;
		dom.$updateDOM = (nextNode, prevNode, el, editor) => recreate(nextNode) ? true : base(nextNode, prevNode, el, editor);
		this.editor.update($fullReconcile, { discrete: true });
		dom.$updateDOM = base;
	}
	getSessionConfig() {
		const resident = this.editor._config.dom || DEFAULT_EDITOR_DOM_CONFIG;
		if (!this.hasSessionGates) return resident;
		const reader = makeReader(getContextRecord(DOMRenderContextSymbol, this.editor) || this.editorContext);
		const disabledKeys = [];
		const sessionSet = [];
		this.installed.forEach((o, i) => {
			if (o.disabledForSession && o.disabledForSession(reader)) disabledKeys.push(String(i));
			else sessionSet.push(o);
		});
		if (disabledKeys.length === 0) return resident;
		const key = disabledKeys.join(",");
		let cfg = this.sessionCache.get(key);
		if (!cfg) {
			cfg = compileDOMRenderConfigOverrides(this.initialEditorConfig, { overrides: sessionSet });
			this.sessionCache.set(key, cfg);
		}
		return cfg;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/DOMRenderExtension.ts
/**
* @experimental
*
* An extension that allows overriding the render and export behavior for an
* editor. This is highly experimental and subject to change from one version
* to the next.
**/
var DOMRenderExtension = defineExtension({
	build(editor, config, state) {
		const { initialEditorConfig } = state.getInitResult();
		const editorContext = createEditorContextRecord(config.contextDefaults);
		return {
			defaults: editorContext,
			runtime: new DOMRenderRuntimeImpl(editor, initialEditorConfig, config.overrides, editorContext)
		};
	},
	config: {
		contextDefaults: [],
		overrides: []
	},
	html: { export: /* @__PURE__ */ new Map([[RootNode, () => {
		const element = $getDocument().createElement("div");
		element.role = "textbox";
		return { element };
	}]]) },
	init(editorConfig, config) {
		const initialEditorConfig = {
			dom: editorConfig.dom,
			nodes: editorConfig.nodes
		};
		const editorContext = createEditorContextRecord(config.contextDefaults);
		editorConfig.dom = compileDOMRenderConfigOverrides(editorConfig, { overrides: filterEditorInstalled(config.overrides, editorContext) });
		return { initialEditorConfig };
	},
	mergeConfig(config, partial) {
		const merged = shallowMergeConfig(config, partial);
		for (const k of ["overrides", "contextDefaults"]) if (partial[k]) merged[k] = [...config[k], ...partial[k]];
		return merged;
	},
	name: DOMRenderExtensionName
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/sel.ts
var IMPL = Symbol.for("@lexical/html/SelectorImpl");
/** @internal */
function getSelectorImpl(sel) {
	const impl = sel[IMPL];
	invariant(impl !== void 0, "match must be a CompiledSelector produced by sel.* or sel.css(); received a raw object.");
	return impl;
}
function combinePredicates(preds) {
	if (preds.length === 0) return isHTMLElement;
	if (preds.length === 1) return preds[0];
	return (node, captures) => {
		for (const p of preds) if (!p(node, captures)) return false;
		return true;
	};
}
/**
* @internal
*
* Build a selector value from a tag set and a predicate list. Used by the
* combinator API and the CSS parser.
*/
function buildSelector(tags, predicates) {
	const impl = {
		kind: "element",
		predicate: combinePredicates(predicates),
		tags
	};
	const refine = (additional) => buildSelector(tags, [...predicates, additional]);
	return {
		[IMPL]: impl,
		attr: (name, value, options) => refine(buildAttrPredicate(name, value, options)),
		classAll: (...classes) => refine(buildClassAllPredicate(classes)),
		classAny: (...classes) => refine(buildClassAnyPredicate(classes)),
		styleAny: (prop, value, options) => refine(buildStylePredicate(prop, value, options))
	};
}
function normalizeClassList(classes) {
	const out = [];
	for (const c of classes) if (c) out.push(c);
	return out;
}
/** @internal */
function buildClassAllPredicate(classes) {
	const ns = normalizeClassList(classes);
	if (ns.length === 0) return () => true;
	return (node) => {
		if (!isHTMLElement(node)) return false;
		const cl = node.classList;
		for (const c of ns) if (!cl.contains(c)) return false;
		return true;
	};
}
/** @internal */
function buildClassAnyPredicate(classes) {
	const ns = normalizeClassList(classes);
	if (ns.length === 0) return () => false;
	return (node) => {
		if (!isHTMLElement(node)) return false;
		const cl = node.classList;
		for (const c of ns) if (cl.contains(c)) return true;
		return false;
	};
}
/** @internal */
function buildAttrPredicate(name, value, options) {
	if (value === true) return (node) => isHTMLElement(node) && node.hasAttribute(name);
	if (typeof value === "string") return (node) => isHTMLElement(node) && node.getAttribute(name) === value;
	if (value instanceof RegExp) {
		const capture = options && options.capture;
		const re = value;
		return (node, captures) => {
			if (!isHTMLElement(node)) return false;
			const v = node.getAttribute(name);
			if (v == null) return false;
			const m = v.match(re);
			if (m === null) return false;
			if (capture !== void 0) captures[capture] = m;
			return true;
		};
	}
	invariant(false, "sel.attr(%s, ...) requires true, a string, or a RegExp", JSON.stringify(name));
}
function buildStylePredicate(prop, value, options) {
	if (typeof value === "string") return (node) => isHTMLElement(node) && node.style.getPropertyValue(prop) === value;
	if (value instanceof RegExp) {
		const capture = options && options.capture;
		const re = value;
		return (node, captures) => {
			if (!isHTMLElement(node)) return false;
			const v = node.style.getPropertyValue(prop);
			if (!v) return false;
			const m = v.match(re);
			if (m === null) return false;
			if (capture !== void 0) captures[capture] = m;
			return true;
		};
	}
	invariant(false, "sel.styleAny(%s, ...) requires a string or a RegExp", JSON.stringify(prop));
}
var TEXT_SELECTOR_IMPL = {
	kind: "text",
	predicate: isDOMTextNode,
	tags: /* @__PURE__ */ new Set()
};
/**
* Wrap a {@link SelectorImpl} as an opaque {@link CompiledSelector}. The `as`
* cast is needed because `CompiledSelector` is an opaque branded interface —
* neither the object literal nor a typed const can declare the internal
* `IMPL` symbol without exposing it. A function declared side-effect free (so
* the build annotates the calls) rather than an object literal at module
* scope: a computed `[IMPL]` key there is a side effect to bundlers, which
* would pin the selector into every bundle that imports this module.
*
* @__NO_SIDE_EFFECTS__
*/
function compiledSelector(impl) {
	return { [IMPL]: impl };
}
var TEXT_SELECTOR = compiledSelector(TEXT_SELECTOR_IMPL);
var COMMENT_SELECTOR = compiledSelector({
	kind: "comment",
	predicate: (node) => node.nodeType === 8,
	tags: /* @__PURE__ */ new Set()
});
/**
* Match any {@link HTMLElement}.
*
* @internal Use `sel.any()`.
*/
function selAny() {
	return buildSelector(/* @__PURE__ */ new Set(), []);
}
/**
* Match DOM {@link Comment} nodes.
*
* @internal Use `sel.comment()`.
*/
function selComment() {
	return COMMENT_SELECTOR;
}
/**
* Match by tag name(s). With one literal tag the element type is narrowed
* (e.g. `'a' → HTMLAnchorElement`); with multiple, it is the union of
* their `HTMLElementTagNameMap` entries.
*
* @internal Use `sel.tag()`.
*/
function selTag(...tags) {
	invariant(tags.length > 0, "sel.tag() requires at least one tag name");
	const upper = /* @__PURE__ */ new Set();
	for (const t of tags) upper.add(t.toUpperCase());
	return buildSelector(upper, []);
}
/**
* Match DOM {@link Text} nodes.
*
* @internal Use `sel.text()`.
*/
function selText() {
	return TEXT_SELECTOR;
}
/**
* Combinator API for building {@link CompiledSelector}s. The public
* `sel` is augmented from this in `./index.ts` (where the CSS parser is
* available without a circular import); consumers outside `@lexical/html`
* should always import the public `sel` from the package root.
*
* Every method builds a selector and returns it; none of them touch anything
* outside their arguments, which is what the marker declares. The build
* annotates module-scope calls to them so an unused rule can be dropped.
*
* @internal
* @lexical-pure-namespace
*/
var selBase = {
	/** Match any {@link HTMLElement}. */
	any: selAny,
	/** Match DOM {@link Comment} nodes. */
	comment: selComment,
	/**
	* Match by tag name(s). With one literal tag the element type is narrowed
	* (e.g. `'a' → HTMLAnchorElement`); with multiple, it is the union of
	* their `HTMLElementTagNameMap` entries.
	*/
	tag: selTag,
	/** Match DOM {@link Text} nodes. */
	text: selText
};
/**
* Cross-frame-safe replacement for `node instanceof HTMLXxxElement`. Returns
* true when `node` is an HTMLElement whose `nodeName` equals `tag` (compared
* case-insensitively).
*
* @experimental
*/
function isElementOfTag(node, tag) {
	return isHTMLElement(node) && node.nodeName === tag.toUpperCase();
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/parseCss.ts
var IDENT_CHAR = /[A-Za-z0-9_-]/;
var Cursor = class {
	source;
	pos;
	constructor(source, pos) {
		this.source = source;
		this.pos = pos;
	}
	peek(offset = 0) {
		return this.source[this.pos + offset] || "";
	}
	consume() {
		return this.source[this.pos++] || "";
	}
	eof() {
		return this.pos >= this.source.length;
	}
	skipWhitespace() {
		while (!this.eof() && /\s/.test(this.peek())) this.pos++;
	}
	readIdent() {
		const start = this.pos;
		while (!this.eof() && IDENT_CHAR.test(this.peek())) this.pos++;
		return this.source.slice(start, this.pos);
	}
	readQuoted() {
		const quote = this.consume();
		this.assert(quote === "\"" || quote === "'", "expected quote");
		const start = this.pos;
		while (!this.eof() && this.peek() !== quote) if (this.peek() === "\\") this.pos += 2;
		else this.pos++;
		this.assert(!this.eof(), "unterminated string");
		const value = this.source.slice(start, this.pos);
		this.pos++;
		return value.replace(/\\(.)/g, "$1");
	}
	/**
	* `invariant(cond, fmt, …)`-flavored assertion that also surfaces the
	* cursor's position context. Use for parse-time errors so a malformed
	* CSS selector gets a useful, position-annotated message.
	*/
	assert(cond, msg) {
		invariant(cond, "invalid CSS selector at col %s: %s in %s", String(this.pos + 1), msg, this.source);
	}
};
function parseSimpleSelector(c) {
	const tags = /* @__PURE__ */ new Set();
	const predicates = [];
	const classes = [];
	let isUniversal = false;
	c.skipWhitespace();
	if (c.peek() === "*") {
		c.consume();
		isUniversal = true;
	} else if (IDENT_CHAR.test(c.peek())) {
		const tag = c.readIdent();
		if (tag) tags.add(tag.toUpperCase());
	}
	while (!c.eof()) {
		const ch = c.peek();
		if (ch === ".") {
			c.consume();
			const cls = c.readIdent();
			c.assert(cls !== "", "expected class name after \".\"");
			classes.push(cls);
		} else if (ch === "#") {
			c.consume();
			const id = c.readIdent();
			c.assert(id !== "", "expected id after \"#\"");
			predicates.push(buildAttrPredicate("id", id));
		} else if (ch === "[") {
			c.consume();
			c.skipWhitespace();
			const name = c.readIdent();
			c.assert(name !== "", "expected attribute name after \"[\"");
			c.skipWhitespace();
			let value = true;
			if (c.peek() === "=") {
				c.consume();
				c.skipWhitespace();
				const next = c.peek();
				if (next === "\"" || next === "'") value = c.readQuoted();
				else {
					value = c.readIdent();
					c.assert(value !== "", "expected attribute value");
				}
				c.skipWhitespace();
			}
			c.assert(c.peek() === "]", "expected \"]\"");
			c.consume();
			predicates.push(buildAttrPredicate(name, value));
		} else break;
	}
	if (classes.length > 0) predicates.push(buildClassAllPredicate(classes));
	c.assert(isUniversal || tags.size > 0 || predicates.length > 0, "expected a selector");
	return {
		predicates,
		tags
	};
}
/**
* Parse a reduced CSS-selector subset and return a {@link CompiledSelector}.
* Supported:
* - Tag (`p`), wildcard (`*`).
* - Tag list (`h1, h2, h3`).
* - Class (`.foo`, `.foo.bar`).
* - ID (`#foo`).
* - Attribute presence (`[name]`).
* - Attribute equality (`[name="value"]`, `[name=value]`).
*
* Anything outside the subset (regex attribute, inline-style match,
* combinators, pseudo-classes) is intentionally rejected — chain combinator
* methods off the returned builder instead.
*
* @experimental
*/
function parseSelector(source) {
	const c = new Cursor(source, 0);
	const groups = [];
	while (true) {
		groups.push(parseSimpleSelector(c));
		c.skipWhitespace();
		if (c.eof()) break;
		c.assert(c.peek() === ",", "expected \",\" (selector lists are the only supported combinator)");
		c.consume();
		c.skipWhitespace();
	}
	if (groups.length === 1) return buildSelector(groups[0].tags, groups[0].predicates);
	const tags = /* @__PURE__ */ new Set();
	if (groups.every((g) => g.tags.size > 0)) for (const g of groups) for (const t of g.tags) tags.add(t);
	const orPredicate = (node, captures) => {
		for (const g of groups) {
			const upper = node.nodeName;
			if (g.tags.size > 0 && !g.tags.has(upper)) continue;
			let ok = true;
			for (const p of g.predicates) if (!p(node, captures)) {
				ok = false;
				break;
			}
			if (ok) return true;
		}
		return false;
	};
	return buildSelector(tags, [orPredicate]);
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/defineImportRule.ts
/**
* Identity helper that infers a rule's matched node type and capture map
* from its `match` selector and threads them into the `$import` signature.
* Usage:
*
* ```ts
* defineImportRule({
*   name: '@lexical/list/li',
*   match: sel.tag('li'),
*   $import: (ctx, el, $next) => {
*     // el: HTMLLIElement
*     return [$createListItemNode()];
*   },
* });
* ```
*
* @experimental
* @__NO_SIDE_EFFECTS__
* @lexical-inline identity
*/
function defineImportRule(rule) {
	return rule;
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/ImportContext.ts
/**
* Create an import context state. The phantom symbol prevents accidental
* use of a render-context state in an import context (and vice versa).
*
* Note: to support the value-or-updater pattern, `V` cannot be a function
* type; wrap it in an array or object if needed.
*
* `getDefaultValue` is called **once at state creation** and the result is
* shared between every session that reads the state without first writing
* a value. Defaults must therefore be immutable (primitives, frozen
* objects, or read-only arrays / records). If your state needs mutable
* per-session storage, lazily initialize it inside your rule (e.g.
* `if (!ctx.session.has(cfg)) ctx.session.set(cfg, new …())`).
*
* @experimental
* @__NO_SIDE_EFFECTS__
*/
function createImportState(name, getDefaultValue, isEqual) {
	return createContextState(DOMImportContextSymbol, name, getDefaultValue, isEqual);
}
/**
* Built-in import-context state identifying how this import was initiated.
* Callers of `$generateNodesFromDOM` should set it via the `context` option.
*
* @experimental
*/
var ImportSource = createImportState("importSource", () => "unknown");
/**
* Built-in import-context state holding the {@link DataTransfer} the
* import was sourced from, if any. `null` outside paste/drop flows.
*
* The clipboard import pipeline passes the original `DataTransfer`
* through to its per-MIME-type handler stack (see
* {@link ImportMimeTypeFunction}); handlers that route HTML through
* the {@link DOMImportExtension} pipeline should forward it into the
* walk via `context: [contextValue(ImportSourceDataTransfer,
* dataTransfer)]` so rules and preprocessors can call
* `ctx.get(ImportSourceDataTransfer)` to inspect companion MIME types
* (e.g. an `'application/rtf'` alternative or an attached
* `'application/x-officedrawing'` payload), the file list, or any
* custom drag-and-drop slot.
*
* Use sparingly: the safer pattern is to decide *which* MIME-type
* payload to walk in the clipboard handler stack and hand a finalized
* DOM to the rules; only fall back to peeking at `ImportSourceDataTransfer`
* when the source-detection signal genuinely lives in a companion
* slot.
*
* @experimental
*/
var ImportSourceDataTransfer = createImportState("importSourceDataTransfer", () => null);
/**
* Built-in import-context state holding the bit-packed
* {@link TextFormatType} formats that should apply to {@link TextNode}s
* produced during the current subtree. Used by inline-format wrappers
* (`<b>`, `<i>`, `<u>`, …) to propagate formatting through the context
* record instead of via the legacy `forChild` chain.
*
* @experimental
*/
var ImportTextFormat = createImportState("textFormat", () => 0);
/**
* Built-in import-context state holding a parsed CSS-style record
* (the {@link getStyleObjectFromCSS} shape) that should apply to
* {@link TextNode}s produced during the current subtree. Mirrors the
* format-bit propagation in {@link ImportTextFormat} for properties
* that don't fit into the format bit mask — `color`, `font-family`,
* `font-size`, etc.
*
* Ancestor rules that contribute a style branch the context with a
* merged record; the core `#text` rule materializes the non-empty
* record to a CSS string and calls `setStyle` on the new TextNode.
* Once TextNode adopts a parsed style record, the materialization
* step will go away.
*
* @experimental
*/
var ImportTextStyle = createImportState("textStyle", () => ({}));
/**
* Default {@link WhitespaceImportConfig.preservesWhitespace}: matches
* `<pre>` and any element with `white-space: pre*`.
*
* @experimental
*/
function defaultPreservesWhitespace(node) {
	if (!isHTMLElement(node)) return false;
	if (node.nodeName === "PRE") return true;
	const ws = node.style.whiteSpace;
	return typeof ws === "string" && ws.startsWith("pre");
}
/**
* Default {@link WhitespaceImportConfig.isInline}: treats an element as
* inline iff its inline `display` style is `inline*` OR (no explicit
* non-inline display) its nodeName is a known inline tag (`isInlineDomNode`).
* Text nodes are always inline; comments and other non-elements are not.
*
* @experimental
*/
function defaultIsInline(node) {
	if (isDOMTextNode(node)) return true;
	if (!isHTMLElement(node)) return false;
	const display = node.style.display;
	if (display) return display.startsWith("inline");
	if (isBlockDomNode(node)) return false;
	return isInlineDomNode(node);
}
/**
* Built-in import-context state controlling text-node whitespace handling
* (collapse vs. preserve, what counts as an inline sibling). Override per
* editor via {@link DOMImportConfig.contextDefaults} or per call via
* {@link GenerateNodesFromDOMOptions.context}.
*
* @experimental
*/
var ImportWhitespaceConfig = createImportState("whitespaceConfig", () => ({
	isInline: defaultIsInline,
	preservesWhitespace: defaultPreservesWhitespace
}));
/**
* Built-in session slot for runtime overlay rules that should be in
* effect for the entire walk. A preprocessor writes here when it wants
* to conditionally install handling for a particular paste source
* (e.g. "if the Microsoft Word generator meta tag is present, push the
* Word-paste overlay"). Each entry contributes an overlay dispatcher
* to the runtime's overlay stack; later array entries are higher
* priority. Use `ctx.session.update(ImportOverlays, prev => […])` to
* append.
*
* This is the walk-wide counterpart to
* `$importChildren({rules: …})` (which scopes an overlay to one
* subtree): write to {@link ImportOverlays} when the overlay should
* apply for the whole document; use `$importChildren`'s `rules` when
* the overlay should only apply for a deeper region.
*
* @experimental
*/
var ImportOverlays = createImportState("importOverlays", () => []);
/**
* The session IS the root-layer {@link ContextRecord} of the walk. Reads
* fall through the prototype chain to the editor's `contextDefaults`,
* writes mutate the record's own properties, and any branch pushed by
* `$importChildren({context})` sits above this layer and can shadow
* (but does not overwrite) slots.
*
* @internal
*/
var ImportSessionImpl = class {
	record;
	constructor(record) {
		this.record = record;
	}
	get(cfg) {
		return getContextValue(this.record, cfg);
	}
	set(cfg, value) {
		this.record[cfg.key] = value;
	}
	update(cfg, updater) {
		this.record[cfg.key] = updater(getContextValue(this.record, cfg));
	}
	has(cfg) {
		return Object.prototype.hasOwnProperty.call(this.record, cfg.key);
	}
};
function getDefaultImportContext(editor) {
	const dep = getPeerDependencyFromEditor(editor, DOMImportExtensionName);
	return dep ? dep.output.defaults : void 0;
}
function getImportContext(editor) {
	return getContextRecord(DOMImportContextSymbol, editor) || getDefaultImportContext(editor);
}
/**
* Read an import context value during an import operation.
* @experimental
*/
function $getImportContextValue(cfg, editor = $getEditor()) {
	return getContextValue(getImportContext(editor), cfg);
}
/**
* Run `f` with the given context pairs applied on top of the editor's
* current import context.
*
* @experimental
*/
var $withImportContext = $withContext(DOMImportContextSymbol, getDefaultImportContext);
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/schemas.ts
/**
* True if the node fills a block slot at the root or inside another
* block — covers both ElementNode-style blocks (paragraph, heading,
* quote) and block-level DecoratorNodes (HorizontalRuleNode,
* ImageNode-as-block, etc.). Used by {@link BlockSchema},
* {@link RootSchema}, and {@link NestedBlockSchema}.
*
* @experimental
*/
function $isBlockLevel(node) {
	return $isBlockElementNode(node) || $isDecoratorNode(node) && !node.isInline();
}
/**
* Distribute an inline wrapper (`LinkNode`, `MarkNode`, …) across a
* heterogeneous run of children produced by `$importChildren`, lifting
* any block children to the top level while keeping the wrapper around
* the leaf inline content.
*
* Use from a rule whose DOM source is an inline element that the
* browser permitted to enclose block elements — the canonical case is
* `<a href="…"><h1>title</h1><div>body</div></a>`, which a link rule
* wants to surface as two block siblings (heading + paragraph), each
* with its own link wrapping the original inline content. Schemas
* can't express this because they reason about a parent's children
* only — they cannot lift the parent out of itself.
*
* For each top-level child:
* - **Inline children** are collected into runs; each run is wrapped
*   in a single fresh wrapper (from `$makeWrapper()`).
* - **Block children** are descended into: their own children are
*   recursively distributed with `$makeWrapper`, then re-attached so
*   the block keeps its position at the top level.
*
* The returned list will contain a mix of blocks and wrapped inline
* runs. The enclosing schema (typically {@link BlockSchema}) will
* then package those inline wrappers into paragraphs as usual.
*
* @experimental
*/
function $distributeInlineWrapper(children, $makeWrapper) {
	const out = [];
	let inlineRun = [];
	const flushInline = () => {
		if (inlineRun.length === 0) return;
		out.push($makeWrapper().splice(0, 0, inlineRun));
		inlineRun = [];
	};
	for (const child of children) if ($isBlockLevel(child)) {
		flushInline();
		if ($isElementNode(child)) {
			const wrapped = $distributeInlineWrapper(child.getChildren(), $makeWrapper);
			child.splice(0, child.getChildrenSize(), wrapped);
		}
		out.push(child);
	} else inlineRun.push(child);
	flushInline();
	return out;
}
/**
* Apply a {@link ChildSchema} to a flat list of children produced by
* `$importChildren`. Walks the list once, partitions into accepted vs.
* rejected runs, packages or drops rejected runs, then runs `$finalize`.
*
* @internal
*/
function $applySchema(schema, children, parent, domParent) {
	const out = [];
	let run = null;
	const flushRun = () => {
		if (run === null) return;
		const rejected = run;
		run = null;
		if (schema.$packageRun) {
			const packaged = schema.$packageRun(rejected, parent, domParent);
			if (packaged.length > 0) {
				for (const n of packaged) out.push(n);
				return;
			}
		}
		if (schema.onReject === "hoist") for (const n of rejected) out.push(n);
	};
	for (const child of children) if (schema.$accepts(child, parent)) {
		flushRun();
		out.push(child);
	} else {
		if (run === null) run = [];
		run.push(child);
	}
	flushRun();
	return schema.$finalize ? schema.$finalize(out, parent) : out;
}
/**
* Apply a parent DOM element's `text-align` (when set to one of the
* supported {@link ElementFormatType} values) to each block-level child
* Lexical node that does not yet have its own format.
*
* Mirrors the part of the legacy `wrapContinuousInlines` that wrote
* `node.setFormat(textAlign)` onto pre-existing block children when the
* DOM parent carried `style.textAlign`. Pair with
* {@link $paragraphPackageRun} (which carries the same propagation onto
* paragraphs synthesized around inline runs) to fully replicate the
* legacy behavior on a run of mixed children.
*
* @experimental
*/
function $propagateTextAlignToBlockChildren(children, domParent) {
	if (!isHTMLElement(domParent)) return children;
	const textAlign = domParent.style.textAlign;
	if (!isAlignmentValue(textAlign)) return children;
	for (const child of children) if ($isBlockElementNode(child) && child.getFormatType() === "") child.setFormat(textAlign);
	return children;
}
/**
* Wrap a run of inline lexical nodes in a fresh paragraph, propagating the
* `text-align` of `domParent` as the paragraph's format type (matching the
* legacy `wrapContinuousInlines` behavior).
*/
function $paragraphPackageRun(run, _parent, domParent) {
	if (run.length === 1 && $isLineBreakNode(run[0])) run = [];
	const paragraph = $createParagraphNode();
	if (isHTMLElement(domParent)) {
		const textAlign = domParent.style.textAlign;
		if (isAlignmentValue(textAlign)) paragraph.setFormat(textAlign);
	}
	return [paragraph.splice(0, 0, run)];
}
/**
* Default schema for block-level positions (root of the document, the body
* of a block element node). Accepts block lexical nodes; packages runs of
* inline children into fresh paragraph nodes.
*
* @experimental
*/
var BlockSchema = {
	$accepts: $isBlockLevel,
	$packageRun: $paragraphPackageRun,
	name: "BlockSchema"
};
/**
* Schema for inline-only positions (the body of an inline lexical node such
* as a link). Accepts non-block lexical nodes; runs of block children are
* dropped (`onReject: 'drop'` is the default).
*
* @experimental
*/
var InlineSchema = {
	$accepts: (child) => !$isBlockLevel(child),
	name: "InlineSchema"
};
/**
* Schema for nested block positions — the equivalent of the legacy
* `ArtificialNode__DO_NOT_USE` flow used when a block DOM element appears
* inside another block lexical ancestor. Accepts block nodes; runs of inline
* children are emitted with a line break between consecutive runs (instead
* of being wrapped in a paragraph, which would introduce an extra level of
* nesting).
*
* @experimental
*/
var NestedBlockSchema = {
	$accepts: $isBlockLevel,
	/**
	* Pass an inline run through unchanged. Because the schema iterator only
	* groups *maximal* rejected runs (each separated from the next by an
	* accepted block child), the legacy "linebreak between adjacent inline
	* groups" case never arises — adjacent inline siblings are already
	* coalesced into one run.
	*/
	$packageRun: (run) => run,
	name: "NestedBlockSchema"
};
/**
* Schema for the topmost level of `$generateNodesFromDOM`. Identical to
* {@link BlockSchema}; aliased for clarity at the entry point and so it can
* be overridden separately in the future (e.g. to synthesize a `ListNode`
* around runs of orphan `ListItemNode`s).
*
* @experimental
*/
var RootSchema = {
	$accepts: $isBlockLevel,
	$packageRun: $paragraphPackageRun,
	name: "RootSchema"
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/coreImportRules.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var sel$1 = selBase;
var ALIGNMENT_VALUES = /* @__PURE__ */ new Set([
	"center",
	"end",
	"justify",
	"left",
	"right",
	"start"
]);
/**
* True if `value` is a non-empty {@link ElementFormatType} (matches one of
* the supported `text-align` / legacy `align`-attribute values).
*
* @internal
*/
function isAlignmentValue(value) {
	return ALIGNMENT_VALUES.has(value);
}
/**
* Default style implied by each inline format tag. `<b>`/`<strong>` set
* font-weight, `<sub>` sets vertical-align, etc. Any of these can be
* overridden by the element's own inline `style` (so `<b
* style="font-weight: normal">` ends up with `fontWeight: 'normal'` in
* the effective style).
*/
var TAG_DEFAULT_STYLE = {
	B: { fontWeight: "bold" },
	EM: { fontStyle: "italic" },
	I: { fontStyle: "italic" },
	S: { textDecoration: "line-through" },
	STRONG: { fontWeight: "bold" },
	SUB: { verticalAlign: "sub" },
	SUP: { verticalAlign: "super" },
	U: { textDecoration: "underline" }
};
/**
* Tags whose effect on TextFormat has no CSS analog (so the style-merge
* path can't reach them). Applied as a pure "set" override.
*/
var TAG_ONLY_SET = {
	CODE: 16,
	MARK: 128
};
function readElementFormatStyle(el) {
	return {
		fontStyle: el.style.fontStyle,
		fontWeight: el.style.fontWeight,
		textDecoration: el.style.textDecoration,
		textTransform: el.style.textTransform,
		verticalAlign: el.style.verticalAlign
	};
}
function mergeStyles(defaults, override) {
	return {
		fontStyle: override.fontStyle || defaults.fontStyle,
		fontWeight: override.fontWeight || defaults.fontWeight,
		textDecoration: override.textDecoration || defaults.textDecoration,
		textTransform: override.textTransform || defaults.textTransform,
		verticalAlign: override.verticalAlign || defaults.verticalAlign
	};
}
/**
* The CSS property names {@link styleFormatOverride} reads — these are
* "owned" by {@link ImportTextFormat} (the bit mask). When the
* {@link ImportTextStyle} record is materialized onto a TextNode's
* inline style by {@link styleObjectToCSS}, these are skipped so the
* bit-mask side is the single source of truth and the same property
* doesn't end up in both places (where the inline-style version would
* shadow the format's themed CSS).
*/
var FORMAT_BIT_STYLE_PROPS = /* @__PURE__ */ new Set([
	"font-weight",
	"font-style",
	"text-decoration",
	"text-transform",
	"vertical-align"
]);
/**
* Translate a {@link FormatStyle} into a {@link FormatOverride}. Explicit
* "non-decorating" values (`font-weight: normal`, `text-decoration: none`,
* `vertical-align: baseline`) produce `clear` bits, so an inner element
* can remove a format inherited from its ancestors.
*/
function styleFormatOverride(style) {
	let set = 0;
	let clear = 0;
	const { fontWeight, fontStyle, textDecoration, textTransform, verticalAlign } = style;
	if (fontWeight === "700" || fontWeight === "bold") set |= 1;
	else if (fontWeight === "normal" || fontWeight === "400") clear |= 1;
	if (fontStyle === "italic") set |= 2;
	else if (fontStyle === "normal") clear |= 2;
	if (textDecoration) {
		const parts = textDecoration.split(" ");
		if (parts.includes("underline")) set |= 8;
		if (parts.includes("line-through")) set |= 4;
		if (parts.includes("none")) clear |= 12;
	}
	if (textTransform === "lowercase") {
		set |= TEXT_TYPE_TO_FORMAT.lowercase;
		clear |= TEXT_TYPE_TO_FORMAT.uppercase | TEXT_TYPE_TO_FORMAT.capitalize;
	} else if (textTransform === "uppercase") {
		set |= TEXT_TYPE_TO_FORMAT.uppercase;
		clear |= TEXT_TYPE_TO_FORMAT.lowercase | TEXT_TYPE_TO_FORMAT.capitalize;
	} else if (textTransform === "capitalize") {
		set |= TEXT_TYPE_TO_FORMAT.capitalize;
		clear |= TEXT_TYPE_TO_FORMAT.lowercase | TEXT_TYPE_TO_FORMAT.uppercase;
	} else if (textTransform === "none") clear |= TEXT_TYPE_TO_FORMAT.lowercase | TEXT_TYPE_TO_FORMAT.uppercase | TEXT_TYPE_TO_FORMAT.capitalize;
	if (verticalAlign === "sub") {
		set |= 32;
		clear |= 64;
	} else if (verticalAlign === "super") {
		set |= 64;
		clear |= 32;
	} else if (verticalAlign === "baseline") clear |= 96;
	return {
		clear,
		set
	};
}
function applyFormatOverride(format, ov) {
	return format & ~ov.clear | ov.set;
}
/**
* Unified rule for inline-format-bearing tags and `<span>`. The element's
* effective style is its tag's {@link TAG_DEFAULT_STYLE} merged with its
* inline `style` (element's own style wins for any property it sets), and
* the resulting style is translated into a {@link FormatOverride}. Tags
* with no CSS analog (`<code>`, `<mark>`) contribute their bit as a pure
* `set` override.
*
* This shape lets:
* - `<b style="font-weight: normal">` clear an inherited IS_BOLD.
* - `<sub><sup>x</sup></sub>` resolve to IS_SUPERSCRIPT only (sub/sup
*   mutex via the vertical-align clear logic).
* - `<span style="text-decoration: none">` strip inherited underline /
*   line-through.
*/
var InlineFormatRule = defineImportRule({
	$import: (ctx, el) => {
		const inherited = ctx.get(ImportTextFormat);
		const tagDefault = TAG_DEFAULT_STYLE[el.nodeName];
		const elStyle = readElementFormatStyle(el);
		let merged = applyFormatOverride(inherited, styleFormatOverride(tagDefault ? mergeStyles(tagDefault, elStyle) : elStyle));
		const tagOnly = TAG_ONLY_SET[el.nodeName];
		if (tagOnly) merged |= tagOnly;
		if (merged === inherited) return ctx.$importChildren(el);
		return ctx.$importChildren(el, { context: [contextValue(ImportTextFormat, merged)] });
	},
	match: sel$1.tag("b", "strong", "em", "i", "code", "mark", "s", "sub", "sup", "u", "span"),
	name: "@lexical/html/inline-format"
});
/**
* Walk up the DOM ancestor chain to determine whether `node` is inside an
* element whose whitespace should be preserved, per the supplied
* {@link WhitespaceImportConfig.preservesWhitespace} predicate. Pure
* ancestor walk, no caching.
*/
function isInsidePreserveWhitespace(node, wsConfig) {
	let current = node.parentNode;
	while (current !== null) {
		if (wsConfig.preservesWhitespace(current)) return true;
		current = current.parentNode;
	}
	return false;
}
function findAdjacentTextOnLine(text, forward, wsConfig) {
	let node = text;
	while (true) {
		let sibling = null;
		while ((sibling = forward ? node.nextSibling : node.previousSibling) === null) {
			const parent = node.parentNode;
			if (parent === null) return null;
			node = parent;
		}
		node = sibling;
		if (!wsConfig.isInline(node)) return null;
		let descendant = node;
		while ((descendant = forward ? node.firstChild : node.lastChild) !== null) node = descendant;
		if (isDOMTextNode(node)) return node;
		if (node.nodeName === "BR") return null;
	}
}
function collapseWhitespace(textNode, wsConfig) {
	let textContent = (textNode.textContent || "").replace(/\r/g, "").replace(/[ \t\n]+/g, " ");
	if (textContent.length === 0) return "";
	if (textContent[0] === " ") {
		let neighbor = textNode;
		let isStartOfLine = true;
		while (neighbor !== null && (neighbor = findAdjacentTextOnLine(neighbor, false, wsConfig)) !== null) {
			const neighborContent = neighbor.textContent || "";
			if (neighborContent.length > 0) {
				if (/[ \t\n]$/.test(neighborContent)) textContent = textContent.slice(1);
				isStartOfLine = false;
				break;
			}
		}
		if (isStartOfLine) textContent = textContent.slice(1);
	}
	if (textContent.length > 0 && textContent[textContent.length - 1] === " ") {
		let neighbor = textNode;
		let isEndOfLine = true;
		while (neighbor !== null && (neighbor = findAdjacentTextOnLine(neighbor, true, wsConfig)) !== null) if ((neighbor.textContent || "").replace(/^( |\t|\r?\n)+/, "").length > 0) {
			isEndOfLine = false;
			break;
		}
		if (isEndOfLine) textContent = textContent.slice(0, -1);
	}
	return textContent;
}
function $applyFormat(node, format) {
	return format !== 0 && $isTextNode(node) ? node.setFormat(format) : node;
}
/**
* Inverse of {@link getStyleObjectFromCSS}: serialize a parsed style
* record back into a CSS declaration string suitable for
* `TextNode.setStyle`. Returns the empty string for an empty record.
*/
function styleObjectToCSS(style) {
	let css = "";
	for (const prop in style) {
		if (FORMAT_BIT_STYLE_PROPS.has(prop)) continue;
		css += `${prop}: ${style[prop]}; `;
	}
	return css.trimEnd();
}
function $applyTextStyle(node, style) {
	if ($isTextNode(node)) {
		const css = styleObjectToCSS(style);
		if (css !== "") node.setStyle(css);
	}
	return node;
}
/**
* `#text` rule. Inside a `<pre>` ancestor, preserve whitespace and split
* on `\n` and `\t` into `LineBreakNode`/`TabNode` siblings. Otherwise
* collapse whitespace using the same neighbor-aware rules as the legacy
* `$convertTextDOMNode`.
*/
var TextRule = defineImportRule({
	$import: (ctx, el) => {
		const format = ctx.get(ImportTextFormat);
		const style = ctx.get(ImportTextStyle);
		const wsConfig = ctx.get(ImportWhitespaceConfig);
		if (isInsidePreserveWhitespace(el, wsConfig)) {
			const out = $generateNodesFromRawText(el.textContent || "");
			for (const node of out) {
				$applyFormat(node, format);
				$applyTextStyle(node, style);
			}
			return out;
		}
		const collapsed = collapseWhitespace(el, wsConfig);
		if (collapsed === "") return [];
		const text = $createTextNode(collapsed);
		$applyFormat(text, format);
		$applyTextStyle(text, style);
		return [text];
	},
	match: sel$1.text(),
	name: "@lexical/html/#text"
});
/**
* Drop `<style>` and `<script>` and skip descending into them — matches
* the legacy `IGNORE_TAGS` set, but as a regular rule so apps can register
* a higher-priority `<style>` rule to capture stylesheet text into the
* import session for later use.
*/
var IgnoreScriptStyleRule = defineImportRule({
	$import: () => [],
	match: sel$1.tag("script", "style"),
	name: "@lexical/html/script-style-ignore"
});
var LineBreakRule = defineImportRule({
	$import: (_ctx, el) => isOnlyChildInBlockNode(el) || isLastChildInBlockNode(el) ? [] : [$createLineBreakNode()],
	match: sel$1.tag("br"),
	name: "@lexical/html/br"
});
/**
* `<p>` rule. Re-applies format, indent, direction, and the legacy
* `align` attribute fallback.
*/
var ParagraphRule = defineImportRule({
	$import: (ctx, el) => {
		const p = $createParagraphNode();
		$setFormatFromDOM(p, el);
		setNodeIndentFromDOM(el, p);
		if (p.getFormatType() === "") {
			const align = el.getAttribute("align");
			if (align && isAlignmentValue(align)) p.setFormat(align);
		}
		$setDirectionFromDOM(p, el);
		return [p.splice(0, 0, ctx.$importChildren(el))];
	},
	match: sel$1.tag("p"),
	name: "@lexical/html/p"
});
/**
* `<hr>` rule, gated on {@link HorizontalRuleNode} registration so it
* mirrors the legacy `importDOM` contract (a node's conversions are only
* active when the node itself is registered). It lives here rather than
* next to `HorizontalRuleExtension` because `@lexical/extension`
* is upstream of `@lexical/html` in the package graph and cannot define
* import rules — this is the one node-providing extension whose import
* support cannot be implied by depending on it.
*
* Registered ahead of {@link TransparentBlockRule}: `<hr>` matches
* `isBlockDomNode`, so the wildcard block rule would otherwise consume
* it. When `HorizontalRuleNode` is not registered, `$next()` restores
* the old behavior (the childless element vanishes).
*
* @internal
*/
var HorizontalRuleRule = defineImportRule({
	$import: (_ctx, _el, $next) => $getEditor().hasNode(HorizontalRuleNode) ? [$createHorizontalRuleNode()] : $next(),
	match: sel$1.tag("hr"),
	name: "@lexical/html/hr"
});
/**
* Rules covering the {@link ParagraphNode}, {@link TextNode},
* {@link LineBreakNode}, and {@link TabNode} cases that the legacy
* `importDOM` machinery in `@lexical/lexical` handled, plus the
* registration-gated `<hr>` rule for {@link HorizontalRuleNode} (see
* {@link HorizontalRuleRule}). Intended to be registered as a dependency
* of every editor that uses {@link DOMImportExtension}.
*
* @experimental
*/
var CoreImportRules = [
	IgnoreScriptStyleRule,
	ParagraphRule,
	HorizontalRuleRule,
	defineImportRule({
		$import: (ctx, el, $next) => {
			if (!isBlockDomNode(el)) return $next();
			return $propagateTextAlignToBlockChildren(ctx.$importChildren(el, { schema: BlockSchema }), el);
		},
		match: sel$1.any(),
		name: "@lexical/html/transparent-block"
	}),
	TextRule,
	LineBreakRule,
	InlineFormatRule
];
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/compileImportRules.ts
function mergeSortedAsc(a, b) {
	const out = [];
	let i = 0;
	let j = 0;
	while (i < a.length && j < b.length) if (a[i] <= b[j]) out.push(a[i++]);
	else out.push(b[j++]);
	while (i < a.length) out.push(a[i++]);
	while (j < b.length) out.push(b[j++]);
	return out;
}
/**
* Compile an ordered list of {@link DOMImportRule}s into the dispatch tables
* used by the import runtime. Dispatch reads the list front to back, so the
* rule at index 0 is the highest-priority one. `DOMImportExtension.mergeConfig`
* prepends each contribution to the list, so the rules of the most dependent
* contributor occupy the lowest indices.
*
* @internal
*/
function compileImportRules(rules) {
	const compiled = [];
	const byTag = /* @__PURE__ */ new Map();
	const wildcardIndices = [];
	const textIndices = [];
	const commentIndices = [];
	const seenNames = /* @__PURE__ */ new Set();
	rules.forEach((rule, i) => {
		const sel = getSelectorImpl(rule.match);
		const name = rule.name || defaultRuleName(sel, i);
		if (rule.name) seenNames.add(rule.name);
		compiled.push({
			$import: rule.$import,
			name,
			predicate: sel.predicate
		});
		if (sel.kind === "text") textIndices.push(i);
		else if (sel.kind === "comment") commentIndices.push(i);
		else if (sel.tags.size === 0) wildcardIndices.push(i);
		else for (const tag of sel.tags) {
			let list = byTag.get(tag);
			if (!list) {
				list = [];
				byTag.set(tag, list);
			}
			list.push(i);
		}
	});
	const finalByTag = /* @__PURE__ */ new Map();
	if (wildcardIndices.length === 0) for (const [tag, list] of byTag) finalByTag.set(tag, list);
	else for (const [tag, list] of byTag) finalByTag.set(tag, mergeSortedAsc(list, wildcardIndices));
	return {
		byTag: finalByTag,
		commentIndices,
		rules: compiled,
		textIndices,
		wildcardIndices
	};
}
function defaultRuleName(sel, index) {
	if (sel.kind === "text") return `#text@${index}`;
	if (sel.kind === "comment") return `#comment@${index}`;
	if (sel.tags.size === 0) return `*@${index}`;
	return `${Array.from(sel.tags).join(",").toLowerCase()}@${index}`;
}
/**
* Look up the (already interleaved) rule indices relevant to `node`. Element
* nodes hit `byTag` (with wildcards merged in) or fall back to the wildcard
* bucket if no tag-specific rules exist; text and comment nodes use their
* own buckets.
*
* @internal
*/
function getDispatchIndices(dispatch, node) {
	if (isDOMTextNode(node)) return dispatch.textIndices;
	if (node.nodeType === 8) return dispatch.commentIndices;
	if (isHTMLElement(node)) return dispatch.byTag.get(node.nodeName) || dispatch.wildcardIndices;
	return EMPTY_INDICES;
}
var EMPTY_INDICES = /* @__PURE__ */ Object.freeze([]);
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/defineOverlayRules.ts
/** @internal */
function flattenRuleEntries(entries) {
	const out = [];
	for (const entry of entries) if (isCompiledOverlayRules(entry)) for (const r of entry.rules) out.push(r);
	else out.push(entry);
	return out;
}
function isCompiledOverlayRules(entry) {
	return typeof entry === "object" && entry !== null && "__type" in entry && entry.__type === "CompiledOverlayRules";
}
/**
* Pre-compile a set of {@link DOMImportRuleEntry}s into a
* {@link CompiledOverlayRules} handle that can be installed via
* `ctx.$importChildren(el, {rules: …})`.
*
* Entries can be raw {@link DOMImportRule}s or other
* {@link CompiledOverlayRules} (the latter are inlined at their
* position in the list, so the same call composes any number of
* overlays). The resulting list is dispatched front to back: earlier
* entries are higher priority, and a rule defers to the next matching
* entry by calling `$next()`. When the overlay is installed via
* `$importChildren({rules})` its whole list is tried before the rules
* from {@link DOMImportConfig.rules}.
*
* Overlay rules installed as a raw array would be re-compiled on every
* `$importChildren` call. For overlays that are reused (e.g. a GitHub
* code-table rule that wraps every matching table), call this once at
* module scope so the dispatch table is built up front.
*
* @experimental
* @__NO_SIDE_EFFECTS__
*/
function defineOverlayRules(entries) {
	const rules = flattenRuleEntries(entries);
	return {
		__type: "CompiledOverlayRules",
		dispatch: compileImportRules(rules),
		rules
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/runImport.ts
var NO_CAPTURES = /* @__PURE__ */ Object.freeze({});
function makeContext(runtime, captures) {
	return {
		$importChildren: (parent, opts) => $importChildrenInternal(runtime, parent, opts),
		$importOne: (node, opts) => $importOneInternal(runtime, node, opts),
		captures,
		get(cfg) {
			return $getImportContextValue(cfg, runtime.editor);
		},
		session: runtime.session
	};
}
function $importChildrenInternal(runtime, parent, opts) {
	const overlay = opts && opts.rules ? opts.rules.dispatch : void 0;
	if (overlay) runtime.overlays.push(overlay);
	try {
		const run = () => $importChildrenRun(runtime, parent, opts);
		return opts && opts.context ? $withImportContext(opts.context, runtime.editor)(run) : run();
	} finally {
		if (overlay) runtime.overlays.pop();
	}
}
function $importChildrenRun(runtime, parent, opts) {
	const onChild = opts && opts.$onChild;
	const collected = [];
	for (const child of Array.from(parent.childNodes)) {
		const produced = $importOneInternal(runtime, child, void 0);
		for (const lex of produced) {
			const result = onChild ? onChild(lex) : lex;
			if (result != null) collected.push(result);
		}
	}
	const afterApplied = opts && opts.$after ? opts.$after(collected) : collected;
	const schema = opts && opts.schema;
	if (!schema) return afterApplied;
	return $applySchema(schema, afterApplied, null, parent);
}
function $importOneInternal(runtime, node, opts) {
	const run = () => $dispatch(runtime, node);
	return opts && opts.context ? $withImportContext(opts.context, runtime.editor)(run) : run();
}
/**
* Build the candidate (dispatch, indices) list for `node`. Overlays are
* tried first in top-of-stack order; the main dispatcher comes last. The
* `$next()` chain walks through all of them in sequence — an overlay rule
* can defer to a lower overlay rule, or all the way through to a main
* rule, just by calling `$next()`.
*/
function getCandidates(runtime, node) {
	const candidates = [];
	for (let i = runtime.overlays.length - 1; i >= 0; i--) {
		const d = runtime.overlays[i];
		const idx = getDispatchIndices(d, node);
		if (idx.length > 0) candidates.push({
			dispatch: d,
			indices: idx
		});
	}
	const mainIdx = getDispatchIndices(runtime.dispatch, node);
	if (mainIdx.length > 0) candidates.push({
		dispatch: runtime.dispatch,
		indices: mainIdx
	});
	return candidates;
}
function $dispatch(runtime, node) {
	const candidates = getCandidates(runtime, node);
	if (candidates.length === 0) return $hoistChildrenOf(runtime, node);
	let groupCursor = 0;
	let ruleCursor = 0;
	const $next = () => {
		while (groupCursor < candidates.length) {
			const { dispatch, indices } = candidates[groupCursor];
			while (ruleCursor < indices.length) {
				const idx = indices[ruleCursor++];
				const rule = dispatch.rules[idx];
				const captures = {};
				if (rule.predicate(node, captures)) {
					const ctx = makeContext(runtime, Object.keys(captures).length === 0 ? NO_CAPTURES : captures);
					try {
						return rule.$import(ctx, node, $next);
					} catch (e) {
						throw e;
					}
				}
			}
			groupCursor++;
			ruleCursor = 0;
		}
		return $hoistChildrenOf(runtime, node);
	};
	return $next();
}
/**
* Fallback when no rule matched and `$next()` was called past the end of the
* chain: hoist the element's children to take its place, recursively. Pure
* elements with no rule become invisible, matching the legacy
* `$createNodesFromDOM` hoisting behavior.
*/
function $hoistChildrenOf(runtime, node) {
	if (node.childNodes.length === 0) return [];
	const collected = [];
	for (const child of Array.from(node.childNodes)) {
		const produced = $importOneInternal(runtime, child, void 0);
		for (const lex of produced) collected.push(lex);
	}
	return collected;
}
/**
* Top-level walker for a compiled dispatcher. Iterates the DOM children of
* `dom` (using the document body if a {@link Document} is passed) and
* applies `RootSchema` to the produced lexical nodes so runs of inlines are
* wrapped in paragraphs — same shape as the legacy `$generateNodesFromDOM`.
*
* @internal
*/
function $runImport(dispatch, editor, dom, session) {
	return $importChildrenRun({
		dispatch,
		editor,
		overlays: session.get(ImportOverlays).map((o) => o.dispatch),
		session
	}, isDOMDocumentNode(dom) ? dom.body : dom, { schema: RootSchema });
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/DOMImportExtension.ts
/**
* Drive a stack of {@link DOMPreprocessFn}s top-to-bottom: the highest-
* index fn runs first and may call `$next()` to defer to the next-lower
* one. Matches the export-side `callExportMimeTypeFunctionStack` shape.
*/
function $runPreprocessStack(stack, dom, ctx) {
	let i = stack.length - 1;
	const $next = () => {
		while (i >= 0) {
			const cur = stack[i--];
			cur(dom, ctx, $next);
			return;
		}
	};
	$next();
}
/**
* Catch-all rule used as the default `config.rules` entry for
* {@link DOMImportExtension}. Because every other contribution is
* prepended to the base config (see {@link DOMImportConfig.rules}), it
* sits at the end of the list and is the last rule tried: it descends
* into the element's children and returns whatever they produced. With
* no other matching rule, an element vanishes and its contents are
* inserted in its place — the legacy `$createNodesFromDOM` hoisting
* behavior, but now expressed as a regular rule that apps can override
* (e.g. with a `sel.any()` rule that captures and discards unknown
* elements).
*
* @experimental
*/
var DefaultHoistRule = defineImportRule({
	$import: (ctx, el) => ctx.$importChildren(el),
	match: selBase.any(),
	name: "@lexical/html/default-hoist"
});
/**
* @experimental
*
* Extension-based replacement for the legacy `importDOM` / `DOMConversion`
* machinery. Rules are contributed via configuration (see
* {@link DOMImportConfig.rules}), compiled into a tag-bucketed dispatcher at
* editor build time, and consumed via the extension's
* {@link DOMImportExtensionOutput.$generateNodesFromDOM} output.
*
* There is no numeric priority: rules are tried in the order they appear
* in `config.rules`, and that list is assembled so that an extension's
* own rules come ahead of the rules its dependencies contributed. See
* {@link DOMImportConfig.rules} for the exact composition order.
*
* The legacy `$generateNodesFromDOM` continues to work in parallel; the
* intent is to migrate node packages over to this extension incrementally.
*/
var DOMImportExtension = defineExtension({
	build(editor, config) {
		const dispatch = compileImportRules(flattenRuleEntries(config.rules));
		const defaults = contextFromPairs(config.contextDefaults, void 0);
		const configPreprocess = config.preprocess;
		return {
			$generateNodesFromDOM: (dom, options) => {
				const parentRecord = getContextRecord(DOMImportContextSymbol, editor) || defaults;
				const fromOpts = options && options.context ? contextFromPairs(options.context, parentRecord) : parentRecord;
				const sessionRecord = fromOpts !== void 0 && fromOpts !== parentRecord ? fromOpts : Object.create(parentRecord || null);
				const session = new ImportSessionImpl(sessionRecord);
				const preprocessCtx = { session };
				$runPreprocessStack(options && options.preprocess ? [...configPreprocess, ...options.preprocess] : configPreprocess, dom, preprocessCtx);
				return $withFullContext(DOMImportContextSymbol, sessionRecord, () => $runImport(dispatch, editor, dom, session), editor);
			},
			defaults
		};
	},
	config: {
		contextDefaults: [],
		preprocess: [$inlineStylesFromStyleSheets],
		rules: [DefaultHoistRule]
	},
	mergeConfig(config, partial) {
		return shallowMergeConfig(config, {
			...partial,
			...partial.contextDefaults && { contextDefaults: [...config.contextDefaults, ...partial.contextDefaults] },
			...partial.preprocess && { preprocess: [...config.preprocess, ...partial.preprocess] },
			...partial.rules && { rules: [...partial.rules, ...config.rules] }
		});
	},
	name: DOMImportExtensionName
});
/**
* Look up the editor's {@link DOMImportExtension} and run its
* `$generateNodesFromDOM`. Designed as a drop-in replacement for the
* legacy `$generateNodesFromDOM(editor, dom)` signature so it can be
* supplied to `ClipboardImportExtension.$generateNodesFromDOM` (or any
* other consumer that wants to route through the extension pipeline).
*
* Throws if the editor was not built with {@link DOMImportExtension} as a
* dependency.
*
* @experimental
*/
function $generateNodesFromDOMViaExtension(dom, options) {
	return $getExtensionOutput(DOMImportExtension).$generateNodesFromDOM(dom, options);
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/CoreImportExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Bundles {@link CoreImportRules} into a {@link DOMImportExtension}-aware
* extension. Node-providing extensions that contribute import rules
* (`RichTextExtension`, `ListExtension`, `LinkExtension`,
* `TableExtension`, `CodeExtension`, …) depend on this themselves, so
* most editors get it implicitly; depend on it directly to get the
* equivalent of the legacy core `importDOM` behavior for `<p>`,
* `<span>`, `<b>`, `<strong>`, `<em>`, `<i>`, `<code>`, `<mark>`,
* `<s>`, `<sub>`, `<sup>`, `<u>`, `<br>`, and `#text` (plus `<hr>`
* when `HorizontalRuleNode` is registered).
*
* @experimental
*/
var CoreImportExtension = defineExtension({
	dependencies: [configExtension(DOMImportExtension, { rules: CoreImportRules })],
	name: "@lexical/html/CoreImport"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/HorizontalRuleImportExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Import rules for {@link HorizontalRuleNode}. The `<hr>` rule is part of
* {@link CoreImportRules} (gated on `HorizontalRuleNode` registration), so
* this array exists only for backwards compatibility and introspection.
*
* @experimental
*/
var HorizontalRuleImportRules = [HorizontalRuleRule];
/**
* Bundles the runtime {@link HorizontalRuleExtension} together with
* {@link CoreImportExtension}, whose {@link CoreImportRules} include the
* registration-gated `<hr>` rule.
*
* @experimental
* @deprecated The `<hr>` import rule now ships with
* {@link CoreImportRules} and activates whenever `HorizontalRuleNode` is
* registered — depend on `HorizontalRuleExtension` (plus any extension
* that brings in `CoreImportExtension`) directly instead.
*/
var HorizontalRuleImportExtension = defineExtension({
	dependencies: [HorizontalRuleExtension, CoreImportExtension],
	name: "@lexical/html/HorizontalRuleImport"
});
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/import/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Combinator-and-parser-based builder for {@link CompiledSelector}s. The
* runtime shape returned by these factory methods is opaque; consumers
* should never inspect or construct selector objects directly.
*
* @experimental
* @lexical-pure-namespace
*/
var sel = {
	/** Match any {@link HTMLElement}. */
	any: selAny,
	/** Match DOM {@link Comment} nodes. */
	comment: selComment,
	/**
	* Parse a reduced CSS-selector subset and return a builder you can chain
	* combinator methods off of.
	*/
	css: parseSelector,
	/**
	* Match by tag name(s). With one literal tag the element type is narrowed
	* (e.g. `'a' → HTMLAnchorElement`); with multiple, it is the union of
	* their `HTMLElementTagNameMap` entries.
	*/
	tag: selTag,
	/** Match DOM {@link Text} nodes. */
	text: selText
};
//#endregion
//#region ../../node_modules/.pnpm/@lexical+html@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/html/src/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var IGNORE_TAGS = /* @__PURE__ */ new Set(["STYLE", "SCRIPT"]);
/**
* How you parse your html string to get a document is left up to you. In the browser you can use the native
* DOMParser API to generate a document (see clipboard.ts), but to use in a headless environment you can use JSDom
* or an equivalent library and pass in the document here.
*/
function $generateNodesFromDOM(editor, dom) {
	$inlineStylesFromStyleSheetsDOM(dom);
	const elements = isDOMDocumentNode(dom) ? dom.body.childNodes : dom.childNodes;
	const lexicalNodes = [];
	const allArtificialNodes = [];
	for (const element of elements) if (!IGNORE_TAGS.has(element.nodeName)) {
		const lexicalNode = $createNodesFromDOM(element, editor, allArtificialNodes, false);
		if (lexicalNode !== null) for (const node of lexicalNode) lexicalNodes.push(node);
	}
	$unwrapArtificialNodes(allArtificialNodes);
	return lexicalNodes;
}
/**
* Generate DOM nodes from the editor state into the given container element,
* using the editor's {@link EditorDOMRenderConfig}.
* @experimental
*/
function $generateDOMFromNodes(container, selection = null, editor = $getEditor()) {
	return $withRenderContext([contextValue(RenderContextExport, true)], editor)(() => {
		const root = $getRoot();
		const domConfig = $getSessionDOMRenderConfig(editor);
		const slotFrame = $getSelectionSlotFrame(selection);
		const parentElementAppend = container.append.bind(container);
		for (const topLevelNode of ($isElementNode(slotFrame) ? slotFrame : root).getChildren()) $appendNodesToHTML(editor, topLevelNode, parentElementAppend, selection, domConfig);
		return container;
	});
}
/**
* Generate DOM nodes from a root node into the given container element,
* including the root node itself. Uses the editor's {@link EditorDOMRenderConfig}.
* @experimental
*/
function $generateDOMFromRoot(container, root = $getRoot()) {
	const editor = $getEditor();
	return $withRenderContext([contextValue(RenderContextExport, true), contextValue(RenderContextRoot, true)], editor)(() => {
		const selection = null;
		const domConfig = $getSessionDOMRenderConfig(editor);
		const parentElementAppend = container.append.bind(container);
		$appendNodesToHTML(editor, root, parentElementAppend, selection, domConfig);
		return container;
	});
}
/**
* Generate an HTML string from the editor's current state (or `selection`
* if provided).
*
* Must be called inside an active editor scope — i.e. `editor.update(...)`,
* `editor.read(...)`, or `editor.getEditorState().read(callback, {editor})`.
* The legacy `editor.getEditorState().read(callback)` call (without the
* `{editor}` option) does not set an active editor and is not supported;
* `editor.read(...)` is the drop-in replacement.
*/
function $generateHtmlFromNodes(editor, selection = null) {
	if (typeof document === "undefined" || typeof window === "undefined" && typeof global.window === "undefined") invariant(false, "To use $generateHtmlFromNodes in headless mode please initialize a headless browser implementation such as JSDom or use withDOM from @lexical/headless/dom before calling this function.");
	$assumeActiveEditor(editor);
	return $generateDOMFromNodes($getDocument().createElement("div"), selection, editor).innerHTML;
}
/**
* A `<br>` that is the last (or only) child of a block element is not rendered
* by browsers, so both HTML importers drop it — see `isLastChildInBlockNode`
* and `isOnlyChildInBlockNode`. The reconciler works around that in the live
* DOM by appending a managed terminator `<br>` after a trailing LineBreakNode
* (`ElementDOMSlot.insertManagedLineBreak`); exported HTML had no equivalent,
* so `<p>a<br></p>` rendered as a single line and re-imported without the
* LineBreakNode at all.
*
* Emit the same terminator here, marked with the same
* `data-lexical-managed-linebreak` attribute the reconciler uses, so exported
* HTML and a scrape of the live DOM describe a trailing break identically and
* a consumer can tell the terminator apart from authored content. The
* importers drop it and keep the authored break, which makes the export/import
* round trip lossless without relaxing the rendering-faithful import rules —
* they match on position, so the marker is metadata rather than load-bearing
* and a sanitizer that strips it changes nothing.
*/
function $appendTerminatingLineBreak(element, lastIncludedChild) {
	const lastChild = element.lastChild;
	if ($isLineBreakNode(lastIncludedChild) && isHTMLElement(element) && isBlockDomNode(element) && lastChild !== null && lastChild.nodeName === "BR") {
		const br = $getDocument().createElement("br");
		br.setAttribute("data-lexical-managed-linebreak", "true");
		element.append(br);
	}
}
function $appendNodesToHTML(editor, currentNode, parentElementAppend, selection = null, domConfig = $getEditorDOMRenderConfig(editor)) {
	let shouldInclude = domConfig.$shouldInclude(currentNode, selection, editor);
	const shouldExclude = domConfig.$shouldExclude(currentNode, selection, editor);
	let target = currentNode;
	if (selection !== null && $isTextNode(currentNode)) target = $sliceSelectedTextNodeContent(selection, currentNode, "clone");
	const { element, after, append, $getChildNodes } = domConfig.$exportDOM(target, editor);
	if (!element) return false;
	const fragment = $getDocument().createDocumentFragment();
	const children = $getChildNodes ? $getChildNodes() : $isElementNode(target) ? target.getChildren() : [];
	const childSelection = shouldInclude && $isNodeSelection(selection) && $isElementNode(currentNode) ? null : selection;
	const fragmentAppend = fragment.append.bind(fragment);
	let lastIncludedChild = null;
	for (const childNode of children) {
		const shouldIncludeChild = $appendNodesToHTML(editor, childNode, fragmentAppend, childSelection, domConfig);
		if (shouldIncludeChild) lastIncludedChild = childNode;
		if (!shouldInclude && shouldIncludeChild && domConfig.$extractWithChild(currentNode, childNode, selection, "html", editor)) shouldInclude = true;
	}
	if (shouldInclude && !shouldExclude) {
		if (isHTMLElement(element) || isDocumentFragment(element)) {
			if (append) append(fragment);
			else element.append(fragment);
			$appendTerminatingLineBreak(element, lastIncludedChild);
		}
		if (isDocumentFragment(element)) {
			if (after) {
				const newElement = after.call(target, element);
				if (newElement) element.replaceChildren(newElement);
			}
			parentElementAppend(element);
		} else {
			parentElementAppend(element);
			if (after) {
				const newElement = after.call(target, element);
				if (newElement) element.replaceWith(newElement);
			}
		}
	} else parentElementAppend(fragment);
	return shouldInclude;
}
/**
* Serialize a single node (and its subtree) into `parentElement`, the same way
* the top-level HTML exporter serializes the nodes it walks. Slots are not part
* of any node's child list and — like {@link LexicalNode.exportJSON} vs
* `exportDOM` for NodeState — are intentionally NOT auto-serialized to HTML;
* a host node opts in by calling this from its own `exportDOM`, e.g. to render
* each slot value into a `data-lexical-slot` wrapper.
*
* @experimental
*/
function $appendNodeToHTML(editor, node, parentElement, selection = null) {
	return $appendNodesToHTML(editor, node, parentElement.append.bind(parentElement), selection, $getSessionDOMRenderConfig(editor));
}
function getConversionFunction(domNode, editor) {
	const { nodeName } = domNode;
	const cachedConversions = editor._htmlConversions.get(nodeName.toLowerCase());
	let currentConversion = null;
	if (cachedConversions !== void 0) for (const cachedConversion of cachedConversions) {
		const domConversion = cachedConversion(domNode);
		if (domConversion !== null && (currentConversion === null || (currentConversion.priority || 0) <= (domConversion.priority || 0))) currentConversion = domConversion;
	}
	return currentConversion !== null ? currentConversion.conversion : null;
}
function $createNodesFromDOM(node, editor, allArtificialNodes, hasBlockAncestorLexicalNode, forChildMap = /* @__PURE__ */ new Map(), parentLexicalNode) {
	const lexicalNodes = [];
	if (IGNORE_TAGS.has(node.nodeName)) return lexicalNodes;
	let currentLexicalNode = null;
	const transformFunction = getConversionFunction(node, editor);
	const transformOutput = transformFunction ? transformFunction(node) : null;
	let postTransform = null;
	if (transformOutput !== null) {
		postTransform = transformOutput.after;
		const transformNodes = transformOutput.node;
		currentLexicalNode = Array.isArray(transformNodes) ? transformNodes[transformNodes.length - 1] : transformNodes;
		if (currentLexicalNode !== null) {
			for (const [, forChildFunction] of forChildMap) {
				currentLexicalNode = forChildFunction(currentLexicalNode, parentLexicalNode);
				if (!currentLexicalNode) break;
			}
			if (currentLexicalNode) lexicalNodes.push(...Array.isArray(transformNodes) ? transformNodes : [currentLexicalNode]);
		}
		if (transformOutput.forChild != null) forChildMap.set(node.nodeName, transformOutput.forChild);
	}
	const children = node.childNodes;
	let childLexicalNodes = [];
	const hasBlockAncestorLexicalNodeForChildren = currentLexicalNode != null && $isRootOrShadowRoot(currentLexicalNode) ? false : currentLexicalNode != null && $isBlockElementNode(currentLexicalNode) || hasBlockAncestorLexicalNode;
	for (let i = 0; i < children.length; i++) childLexicalNodes.push(...$createNodesFromDOM(children[i], editor, allArtificialNodes, hasBlockAncestorLexicalNodeForChildren, new Map(forChildMap), currentLexicalNode));
	if (postTransform != null) childLexicalNodes = postTransform(childLexicalNodes);
	if (isBlockDomNode(node)) {
		if (!hasBlockAncestorLexicalNodeForChildren) childLexicalNodes = wrapContinuousInlines(node, childLexicalNodes, $createParagraphNode);
		else childLexicalNodes = wrapContinuousInlines(node, childLexicalNodes, () => {
			const artificialNode = new ArtificialNode__DO_NOT_USE();
			allArtificialNodes.push(artificialNode);
			return artificialNode;
		});
	}
	if (currentLexicalNode == null) {
		if (childLexicalNodes.length > 0) for (const childNode of childLexicalNodes) lexicalNodes.push(childNode);
		else if (isBlockDomNode(node) && isDomNodeBetweenTwoInlineNodes(node)) lexicalNodes.push($createLineBreakNode());
	} else if ($isElementNode(currentLexicalNode)) currentLexicalNode.append(...childLexicalNodes);
	return lexicalNodes;
}
function wrapContinuousInlines(domNode, nodes, createWrapperFn) {
	const textAlign = domNode.style.textAlign;
	const out = [];
	let continuousInlines = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if ($isBlockElementNode(node)) {
			if (textAlign && !node.getFormat()) node.setFormat(textAlign);
			out.push(node);
		} else {
			continuousInlines.push(node);
			if (i === nodes.length - 1 || i < nodes.length - 1 && $isBlockElementNode(nodes[i + 1])) {
				const wrapper = createWrapperFn();
				wrapper.setFormat(textAlign);
				wrapper.append(...continuousInlines);
				out.push(wrapper);
				continuousInlines = [];
			}
		}
	}
	return out;
}
function $unwrapArtificialNodes(allArtificialNodes) {
	for (const node of allArtificialNodes) if (node.getParent() && node.getNextSibling() instanceof ArtificialNode__DO_NOT_USE) node.insertAfter($createLineBreakNode());
	for (const node of allArtificialNodes) {
		const parent = node.getParent();
		if (parent) parent.splice(node.getIndexWithinParent(), 1, node.getChildren());
	}
}
function isDomNodeBetweenTwoInlineNodes(node) {
	if (node.nextSibling == null || node.previousSibling == null) return false;
	return isInlineDomNode(node.nextSibling) && isInlineDomNode(node.previousSibling);
}
//#endregion
export { defaultIsInline as A, $updateRenderContextValue as B, ImportOverlays as C, ImportTextStyle as D, ImportTextFormat as E, DOMRenderExtension as F, $inlineStylesFromStyleSheets as G, RenderContextExport as H, domOverride as I, contextUpdater as K, $getRenderContextValue as L, defineImportRule as M, parseSelector as N, ImportWhitespaceConfig as O, isElementOfTag as P, $getSessionDOMRenderConfig as R, $withImportContext as S, ImportSourceDataTransfer as T, RenderContextRoot as U, $withRenderContext as V, createRenderState as W, BlockSchema as _, $generateNodesFromDOM as a, RootSchema as b, HorizontalRuleImportRules as c, DOMImportExtension as d, defineOverlayRules as f, $propagateTextAlignToBlockChildren as g, $isBlockLevel as h, $generateHtmlFromNodes as i, defaultPreservesWhitespace as j, createImportState as k, CoreImportExtension as l, $distributeInlineWrapper as m, $generateDOMFromNodes as n, sel as o, CoreImportRules as p, contextValue as q, $generateDOMFromRoot as r, HorizontalRuleImportExtension as s, $appendNodeToHTML as t, $generateNodesFromDOMViaExtension as u, InlineSchema as v, ImportSource as w, $getImportContextValue as x, NestedBlockSchema as y, $setRenderContextValue as z };
