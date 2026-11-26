import { Nt as getActiveElementDeep, Pt as getComposedEventTarget, Yi as KEY_DOWN_COMMAND, aa as REDO_COMMAND, da as UNDO_COMMAND, di as registerEventListener, fi as createRefCountedRegistry, in as isDOMShadowRoot, n as mergeRegister, s as safeCast, u as defineExtension, un as isHTMLElement } from "./src-BWdqgNjM.js";
import { G as namedSignals, J as j, X as y, x as RootElementExtension } from "./src-DjbHpMmC.js";
//#region ../../node_modules/.pnpm/@lexical+a11y@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/a11y/src/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function applyVisuallyHidden(el) {
	const style = el.style;
	style.border = "0";
	style.clip = "rect(0 0 0 0)";
	style.height = "1px";
	style.margin = "-1px";
	style.overflow = "hidden";
	style.padding = "0";
	style.position = "absolute";
	style.whiteSpace = "nowrap";
	style.width = "1px";
}
/**
* Creates a visually hidden live-region element as a child of `owner` and
* returns it. WAI-ARIA status message pattern (WCAG 4.1.3). The caller owns
* the element's lifetime (removal) and applies the `aria-live` politeness and
* `textContent` reactively.
*/
function createLiveRegion(owner) {
	const region = owner.ownerDocument.createElement("div");
	region.setAttribute("aria-atomic", "true");
	region.setAttribute("role", "status");
	applyVisuallyHidden(region);
	owner.appendChild(region);
	return region;
}
var FOCUSABLE_SELECTOR = /* @__PURE__ */ [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=\"hidden\"])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])",
	"[contenteditable=\"true\"]"
].join(",");
function getFocusableElements(container) {
	return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}
function containsComposed(container, target) {
	let current = target;
	while (current !== null) {
		if (current === container) return true;
		if (isDOMShadowRoot(current)) current = current.host;
		else current = current.parentNode;
	}
	return false;
}
/**
* Traps Tab / Shift+Tab focus inside `container` and restores focus to
* the previously-focused element when the returned dispose runs.
* Intended for modal dialogs and other transient overlays.
*
* While active, *any* focus that lands outside the container is pulled
* back inside via a document-level `focusin` listener. This recovers
* from Safari's default Tab routing through the browser chrome, but it
* also means descendants that mount into a portal outside `container`
* (autocomplete panels, tooltips, toasts that auto-focus themselves)
* will be yanked back as soon as they take focus. Portal them inside
* `container`, or skip this helper for those dialogs. The pull-back
* always lands on the first focusable descendant (or the container as a
* fallback) — `initialFocus` only applies to the activation-time
* landing, not to subsequent escape recoveries. Only one trap should be
* mounted at a time — two active traps install competing document-level
* `focusin` listeners and will fight over focus.
*
* Escape is not intercepted — the owner handles close-key behavior.
*/
function registerFocusTrap(container, options = {}) {
	const initialFocus = options.initialFocus ?? "firstFocusable";
	const doc = container.ownerDocument;
	const deepActive = getActiveElementDeep(doc);
	const previouslyFocused = isHTMLElement(deepActive) ? deepActive : null;
	const focusable = getFocusableElements(container);
	if (initialFocus === "container" && container.hasAttribute("tabindex")) container.focus();
	else if (focusable.length > 0) focusable[0].focus();
	else if (container.hasAttribute("tabindex")) container.focus();
	const keydownHandler = (event) => {
		if (event.key !== "Tab") return;
		const currentFocusable = getFocusableElements(container);
		if (currentFocusable.length === 0) {
			event.preventDefault();
			return;
		}
		event.preventDefault();
		const first = currentFocusable[0];
		const last = currentFocusable[currentFocusable.length - 1];
		const active = getActiveElementDeep(doc);
		const activeIndex = isHTMLElement(active) && containsComposed(container, active) ? currentFocusable.indexOf(active) : -1;
		if (event.shiftKey) (activeIndex <= 0 ? last : currentFocusable[activeIndex - 1]).focus();
		else (activeIndex === -1 || activeIndex === currentFocusable.length - 1 ? first : currentFocusable[activeIndex + 1]).focus();
	};
	const focusinHandler = (event) => {
		const target = getComposedEventTarget(event);
		if (!isHTMLElement(target) || containsComposed(container, target)) return;
		if (options.allowOutside != null && options.allowOutside(target)) return;
		const currentFocusable = getFocusableElements(container);
		if (currentFocusable.length > 0) currentFocusable[0].focus();
		else if (container.hasAttribute("tabindex")) container.focus();
	};
	return mergeRegister(() => {
		if (previouslyFocused !== null && typeof previouslyFocused.focus === "function" && containsComposed(doc, previouslyFocused)) previouslyFocused.focus();
	}, registerEventListener(container, "keydown", keydownHandler), registerEventListener(doc, "focusin", focusinHandler));
}
var DEFAULT_ROVING_SELECTOR = ":scope > button:not([disabled])";
/**
* Implements the WAI-ARIA roving-tabindex pattern on `container`. One
* item carries `tabindex="0"` at a time; the rest are `-1`. Arrow keys
* move focus inside the group; Home / End jump to the ends. Tab leaves
* the group as a unit, matching the toolbar / menubar pattern.
*
* Items are queried lazily on every interaction so additions or
* removals during the lifetime of the group are picked up without
* extra wiring.
*/
function registerRovingTabIndex(container, options = {}) {
	const orientation = options.orientation ?? "horizontal";
	const selector = options.itemSelector ?? DEFAULT_ROVING_SELECTOR;
	const getItems = () => Array.from(container.querySelectorAll(selector));
	const applyTabIndex = (items, activeIndex) => {
		items.forEach((item, i) => {
			item.tabIndex = i === activeIndex ? 0 : -1;
		});
	};
	const init = () => {
		const items = getItems();
		if (items.length === 0) return;
		const active = getActiveElementDeep(container.ownerDocument);
		const activeIdx = items.findIndex((el) => el === active);
		applyTabIndex(items, activeIdx >= 0 ? activeIdx : 0);
	};
	init();
	const handler = (event) => {
		const items = getItems();
		if (items.length === 0) return;
		const active = getActiveElementDeep(container.ownerDocument);
		const currentIdx = items.findIndex((el) => el === active);
		if (currentIdx < 0) {
			if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
				event.preventDefault();
				applyTabIndex(items, 0);
				items[0].focus();
			}
			return;
		}
		const horizontal = orientation === "horizontal" || orientation === "both";
		const vertical = orientation === "vertical" || orientation === "both";
		let nextIdx = currentIdx;
		switch (event.key) {
			case "ArrowRight":
				if (!horizontal) return;
				nextIdx = currentIdx + 1;
				break;
			case "ArrowLeft":
				if (!horizontal) return;
				nextIdx = currentIdx - 1;
				break;
			case "ArrowDown":
				if (!vertical) return;
				nextIdx = currentIdx + 1;
				break;
			case "ArrowUp":
				if (!vertical) return;
				nextIdx = currentIdx - 1;
				break;
			case "Home":
				nextIdx = 0;
				break;
			case "End":
				nextIdx = items.length - 1;
				break;
			default: return;
		}
		event.preventDefault();
		nextIdx = (nextIdx + items.length) % items.length;
		applyTabIndex(items, nextIdx);
		items[nextIdx].focus();
	};
	return mergeRegister(registerEventListener(container, "keydown", handler), () => {
		getItems().forEach((item) => {
			item.tabIndex = 0;
		});
	});
}
var DEFAULT_TOOLBAR_FOCUSABLE_SELECTOR = ":scope > button:not([disabled]), :scope > [tabindex=\"0\"]";
/**
* Implements the editor-to-toolbar focus jump recommended by the
* WAI-ARIA APG editor menubar pattern: Alt+F10 inside the editor moves
* focus to the first focusable in `toolbar`, and Escape inside the
* toolbar returns focus to the editor.
*
* Wires the navigation only. Selection restoration relies on the
* editor's own focus handling; the editor's last selection is preserved
* across the jump so toolbar commands act on the same range.
*/
function registerFocusManager(editor, toolbar, options = {}) {
	const selector = options.toolbarItemSelector ?? DEFAULT_TOOLBAR_FOCUSABLE_SELECTOR;
	const handler = (event) => {
		if (event.key !== "Escape") return;
		const target = getComposedEventTarget(event);
		if (isHTMLElement(target)) {
			const items = toolbar.querySelectorAll(selector);
			let isRovingItem = false;
			for (const item of items) if (item === target || containsComposed(item, target)) {
				isRovingItem = true;
				break;
			}
			if (!isRovingItem) return;
		}
		const rootElement = editor.getRootElement();
		if (rootElement === null) return;
		event.preventDefault();
		event.stopPropagation();
		editor.focus();
		rootElement.focus();
	};
	return mergeRegister(editor.registerCommand(KEY_DOWN_COMMAND, (event) => {
		if (!event.altKey || event.key !== "F10") return false;
		const firstItem = toolbar.querySelector("[tabindex=\"0\"]") ?? toolbar.querySelector(selector);
		if (firstItem === null) return false;
		event.preventDefault();
		firstItem.focus();
		return true;
	}, 1), registerEventListener(toolbar, "keydown", handler));
}
/**
* Platform-independent extension that owns a single `aria-live` region for
* the editor and exposes a stable {@link AriaLiveRegion} sink as its output.
* Other a11y extensions (`HistoryAnnounceExtension`,
* `EditorModeAnnounceExtension`) depend on it and announce through
* `output.announce`.
*
* The sink writes to a private `message` signal created in `init`. The
* `politeness` / `owner` config are exposed as signals (via `namedSignals`).
* `register` tracks the editor's root element reactively and runs three
* effects: one creates / disposes the region element as the root document (or
* `owner`) changes, one applies the current `politeness` to the mounted region,
* and one mirrors the current message into it. Buffering through signals
* decouples the stable `announce` (from `build`) from the region element —
* which comes and goes with the root — and creates the region in the editor's
* own document (e.g. an iframe-portaled editor) rather than the top-level
* `document`.
*/
var AriaLiveRegionExtension = defineExtension({
	build(_editor, config, state) {
		const message = state.getInitResult();
		return {
			...namedSignals(config),
			announce(text) {
				message.value = text === message.peek() ? text + "​" : text;
			}
		};
	},
	config: safeCast({
		owner: null,
		politeness: "polite"
	}),
	dependencies: [RootElementExtension],
	init: () => y(""),
	name: "@lexical/a11y/AriaLiveRegion",
	register(_editor, _config, state) {
		const message = state.getInitResult();
		const { owner, politeness } = state.getOutput();
		const rootElement = state.getDependency(RootElementExtension).output;
		const region = y(null);
		return mergeRegister(j(() => {
			const ownerEl = owner.value;
			const root = ownerEl ? null : rootElement.value;
			const host = ownerEl ?? (root ? root.ownerDocument.body : null);
			if (!host) return;
			const el = createLiveRegion(host);
			region.value = el;
			return () => {
				el.remove();
				region.value = null;
			};
		}), j(() => {
			const el = region.value;
			if (el) el.setAttribute("aria-live", politeness.value);
		}), j(() => {
			const text = message.value;
			const el = region.peek();
			if (el) el.textContent = text;
		}));
	}
});
defineExtension({
	build: (_editor, config) => namedSignals(config),
	config: safeCast({
		disabled: false,
		redone: "Redone",
		undone: "Undone"
	}),
	dependencies: [AriaLiveRegionExtension],
	name: "@lexical/a11y/HistoryAnnounce",
	register(editor, _config, state) {
		const { disabled, redone, undone } = state.getOutput();
		const { announce } = state.getDependency(AriaLiveRegionExtension).output;
		return j(() => disabled.value ? void 0 : mergeRegister(editor.registerCommand(UNDO_COMMAND, () => {
			announce(undone.peek());
			return false;
		}, 1), editor.registerCommand(REDO_COMMAND, () => {
			announce(redone.peek());
			return false;
		}, 1)));
	}
});
defineExtension({
	build: (_editor, config) => namedSignals(config),
	config: safeCast({
		disabled: false,
		editable: "Editor is editable",
		readOnly: "Editor is read-only"
	}),
	dependencies: [AriaLiveRegionExtension],
	name: "@lexical/a11y/EditorModeAnnounce",
	register(editor, _config, state) {
		const { disabled, editable, readOnly } = state.getOutput();
		const { announce } = state.getDependency(AriaLiveRegionExtension).output;
		return j(() => disabled.value ? void 0 : editor.registerEditableListener((isEditable) => {
			announce(isEditable ? editable.peek() : readOnly.peek());
		}));
	}
});
defineExtension({
	build: () => createRefCountedRegistry(registerFocusTrap),
	name: "@lexical/a11y/FocusTrap",
	register: (_editor, _config, state) => () => state.getOutput().dispose()
});
defineExtension({
	build: () => createRefCountedRegistry(registerRovingTabIndex),
	name: "@lexical/a11y/RovingTabIndex",
	register: (_editor, _config, state) => () => state.getOutput().dispose()
});
defineExtension({
	build: (editor) => createRefCountedRegistry((toolbar, options) => registerFocusManager(editor, toolbar, options)),
	name: "@lexical/a11y/FocusManager",
	register: (_editor, _config, state) => () => state.getOutput().dispose()
});
//#endregion
export { AriaLiveRegionExtension as t };
