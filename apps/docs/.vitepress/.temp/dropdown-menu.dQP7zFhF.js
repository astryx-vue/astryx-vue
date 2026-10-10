import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$5 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$6 } from "./IconButton-BNQuz9W_.CvHMrKbO.js";
import { t as _sfc_main$7 } from "./Item-C1z6gXn8.BTlOygNj.js";
import { t as _sfc_main$8 } from "./Divider-BtwnL18I.BzWZDGLo.js";
import { t as _sfc_main$9 } from "./Icon-B6qNgBP9.DVAnMRiH.js";
import { t as usePositionedLayer } from "./usePositionedLayer-C1NBOsVT.CqLwBJaO.js";
import { t as _sfc_main$10 } from "./Kbd-DGEjoy3N.fM7MNY7v.js";
import { Fragment, Teleport, Transition, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, guardReactiveProps, h, inject, mergeModels, mergeProps, nextTick, normalizeProps, onBeforeUnmount, onMounted, onScopeDispose, openBlock, provide, ref, renderSlot, shallowRef, toDisplayString, unref, useAttrs, useId, useModel, useSSRContext, useSlots, vShow, watch, withCtx, withDirectives } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/DropdownMenu-DtvjPnkG.js
var dropdownMenuContextKey = Symbol("astryx-dropdown-menu-context");
/** The surrounding menu, or `undefined` when a row stands alone. */
function useDropdownMenuContext() {
	return inject(dropdownMenuContextKey, void 0);
}
/**
* Rows a menu's roving focus, typeahead, and keyboard activation all agree on.
*/
var MENU_ITEM_ROLES = /* @__PURE__ */ new Set([
	"menuitem",
	"menuitemradio",
	"menuitemcheckbox"
]);
/** Rows the arrow keys may land on: enabled menu items, in DOM order. */
var MENU_ITEM_SELECTOR = [...MENU_ITEM_ROLES].map((role) => `[role="${role}"]:not([aria-disabled="true"])`).join(",");
/** Scopes item collection and key handling to one menu level. */
var MENU_BOUNDARY_SELECTOR = "[role=\"menu\"]";
/**
* Whether a click carries a modifier or a non-primary button: on a row that is
* a link the browser gives it a meaning of its own, which the row leaves alone.
*/
function isModifiedClick(event) {
	return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}
/**
* Activate a row from the keyboard: a synthesized click that carries the key's
* modifiers, so a ⌘-Enter on a link row opens it the way a ⌘-click would.
* `detail` stays 0, the mark of a non-pointer activation.
*/
function activateMenuItem(row, key) {
	row.dispatchEvent(new MouseEvent("click", {
		altKey: key.altKey,
		bubbles: true,
		cancelable: true,
		composed: true,
		ctrlKey: key.ctrlKey,
		metaKey: key.metaKey,
		shiftKey: key.shiftKey
	}));
}
var _sfc_main$4 = /*@__PURE__*/ defineComponent({
	name: "AstryxDropdownMenuDivider",
	__name: "DropdownMenuDivider",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(_sfc_main$8, { class: "astryx-dropdown-menu-divider" });
		};
	}
});
var _hoisted_1$3 = { class: "astryx-dropdown-menu-section-heading" };
var _sfc_main$3 = /*@__PURE__*/ defineComponent({
	name: "AstryxDropdownMenuSectionHeading",
	__name: "DropdownMenuSectionHeading",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$3, [renderSlot(_ctx.$slots, "default")]);
		};
	}
});
var _hoisted_1$2 = ["aria-labelledby"];
var _sfc_main$2 = /*@__PURE__*/ defineComponent({
	name: "AstryxDropdownMenuGroup",
	__name: "DropdownMenuGroup",
	props: { title: {} },
	setup(__props) {
		const props = __props;
		const headingId = `astryx-dropdown-menu-group-${useId()}`;
		const hasTitle = computed(() => props.title != null && props.title !== "");
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "astryx-dropdown-menu-group",
				role: "group",
				"aria-labelledby": hasTitle.value ? headingId : void 0
			}, [hasTitle.value || _ctx.$slots.title ? (openBlock(), createBlock(_sfc_main$3, {
				key: 0,
				id: headingId
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(__props.title), 1)])]),
				_: 3
			})) : createCommentVNode("v-if", true), renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$2);
		};
	}
});
var _hoisted_1$1 = [
	"aria-disabled",
	"data-density",
	"data-disabled",
	"data-menu-size",
	"data-variant",
	"href",
	"rel",
	"tabindex",
	"target"
];
var _hoisted_2$1 = {
	key: 0,
	class: "astryx-item__start"
};
var _hoisted_3 = { class: "astryx-item__content" };
var _hoisted_4 = {
	key: 0,
	class: "astryx-item__label"
};
var _hoisted_5 = {
	key: 1,
	class: "astryx-item__description"
};
var _hoisted_6 = {
	key: 1,
	class: "astryx-item__end"
};
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxDropdownMenuItem",
	inheritAttrs: false,
	__name: "DropdownMenuItem",
	props: {
		label: {},
		description: {},
		icon: {},
		isDisabled: {
			type: Boolean,
			default: false
		},
		variant: { default: "default" },
		hasCloseOnSelect: {
			type: Boolean,
			default: true
		},
		href: {},
		target: {},
		rel: {},
		onClick: {}
	},
	emits: ["click"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const attrs = useAttrs();
		const slots = useSlots();
		const menu = useDropdownMenuContext();
		const menuSize = computed(() => menu?.menuSize.value ?? "md");
		const density = computed(() => menuSize.value === "sm" ? "compact" : "balanced");
		const isDestructive = computed(() => props.variant === "destructive");
		const isLink = computed(() => props.href != null);
		const iconColor = computed(() => isDestructive.value ? "inherit" : "secondary");
		const hasStart = computed(() => slots.icon != null || props.icon != null);
		const hasLabel = computed(() => slots.label != null || props.label != null);
		const hasDescription = computed(() => slots.description != null || props.description != null);
		const hasEnd = computed(() => slots.endContent != null);
		const resolvedRel = computed(() => {
			const tokens = new Set((props.rel ?? "").split(/\s+/).filter(Boolean));
			if (props.target === "_blank") {
				tokens.add("noopener");
				tokens.add("noreferrer");
			}
			return tokens.size > 0 ? [...tokens].join(" ") : void 0;
		});
		/** The anchor carries the row itself, so it is never given an unset address. */
		const linkHref = computed(() => props.isDisabled ? void 0 : props.href);
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
		function handleClick(event) {
			if (props.isDisabled) {
				event.preventDefault();
				return;
			}
			if (!(isLink.value && isModifiedClick(event))) emit("click", event);
			if (props.hasCloseOnSelect) menu?.closeMenu();
		}
		function handleAuxClick(event) {
			if (props.isDisabled) {
				event.preventDefault();
				return;
			}
			if (props.href == null || event.button !== 1) return;
			if (props.hasCloseOnSelect) menu?.closeMenu();
		}
		/** Hover moves DOM focus, so exactly one row is ever highlighted. */
		function handlePointerMove(event) {
			if (props.isDisabled || event.pointerType !== "mouse") return;
			const row = event.currentTarget;
			if (row instanceof HTMLElement && row !== row.ownerDocument.activeElement) row.focus({ preventScroll: true });
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createCommentVNode("\n    A row that navigates is the link itself. `Item` gives its root an inner\n    anchor instead when a `role` is set, which would put two controls in one\n    row, so the link row renders the same markup with the anchor as its root.\n  "), isLink.value ? (openBlock(), createElementBlock("a", mergeProps({ key: 0 }, forwardedAttrs.value, {
				class: ["astryx-item astryx-dropdown-menu-item", unref(attrs).class],
				role: "menuitem",
				"aria-disabled": __props.isDisabled || void 0,
				"data-align": "center",
				"data-density": density.value,
				"data-disabled": __props.isDisabled || void 0,
				"data-interactive": true,
				"data-menu-size": menuSize.value,
				"data-variant": __props.variant,
				href: linkHref.value,
				rel: resolvedRel.value,
				style: unref(attrs).style,
				tabindex: __props.isDisabled ? void 0 : -1,
				target: __props.target,
				onAuxclick: handleAuxClick,
				onClick: handleClick,
				onPointermove: handlePointerMove
			}), [
				hasStart.value ? (openBlock(), createElementBlock("span", _hoisted_2$1, [renderSlot(_ctx.$slots, "icon", {}, () => [createVNode(_sfc_main$9, {
					color: iconColor.value,
					icon: __props.icon,
					size: "sm"
				}, null, 8, ["color", "icon"])])])) : createCommentVNode("v-if", true),
				createElementVNode("span", _hoisted_3, [hasLabel.value ? (openBlock(), createElementBlock("span", _hoisted_4, [renderSlot(_ctx.$slots, "label", {}, () => [createTextVNode(toDisplayString(__props.label), 1)])])) : createCommentVNode("v-if", true), hasDescription.value ? (openBlock(), createElementBlock("span", _hoisted_5, [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(__props.description), 1)])])) : createCommentVNode("v-if", true)]),
				hasEnd.value ? (openBlock(), createElementBlock("span", _hoisted_6, [renderSlot(_ctx.$slots, "endContent")])) : createCommentVNode("v-if", true)
			], 16, _hoisted_1$1)) : (openBlock(), createBlock(_sfc_main$7, mergeProps({ key: 1 }, unref(attrs), {
				class: "astryx-dropdown-menu-item",
				role: "menuitem",
				"data-menu-size": menuSize.value,
				"data-variant": __props.variant,
				description: __props.description,
				density: density.value,
				"is-disabled": __props.isDisabled,
				label: __props.label,
				"on-click": handleClick,
				tabindex: __props.isDisabled ? void 0 : -1,
				onAuxclick: handleAuxClick,
				onPointermove: handlePointerMove
			}), createSlots({ _: 2 }, [
				hasStart.value ? {
					name: "startContent",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "icon", {}, () => [createVNode(_sfc_main$9, {
						color: iconColor.value,
						icon: __props.icon,
						size: "sm"
					}, null, 8, ["color", "icon"])])]),
					key: "0"
				} : void 0,
				unref(slots).label ? {
					name: "label",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "label")]),
					key: "1"
				} : void 0,
				unref(slots).description ? {
					name: "description",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "description")]),
					key: "2"
				} : void 0,
				hasEnd.value ? {
					name: "endContent",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "endContent")]),
					key: "3"
				} : void 0
			]), 1040, [
				"data-menu-size",
				"data-variant",
				"description",
				"density",
				"is-disabled",
				"label",
				"tabindex"
			]))], 2112);
		};
	}
});
/**
* Renders one data-mode entry. A section renders through `DropdownMenuGroup`,
* so both modes produce one `role="group"` named by its visible heading.
*/
function renderOption(option, index) {
	if ("type" in option) {
		if (option.type === "divider") return h(_sfc_main$4, { key: `divider-${index}` });
		return h(_sfc_main$2, {
			key: option.id ?? `section-${index}`,
			title: option.title
		}, { default: () => option.items.map((item, itemIndex) => renderItem(item, itemIndex)) });
	}
	return renderItem(option, index);
}
function renderItem(item, index) {
	const { endContent, id, ...itemProps } = item;
	return h(_sfc_main$1, {
		key: id ?? `item-${index}`,
		...itemProps
	}, endContent == null ? void 0 : { endContent: () => endContent });
}
/** Data-mode content of a `DropdownMenu`, as a component so the template stays flat. */
var DropdownMenuItems = defineComponent({
	name: "AstryxDropdownMenuItems",
	inheritAttrs: false,
	props: { items: {
		type: Array,
		required: true
	} },
	setup(props) {
		return () => props.items.map((option, index) => renderOption(option, index));
	}
});
function isDisabled(el) {
	return el.getAttribute("aria-disabled") === "true" || el.hasAttribute("disabled");
}
/**
* Roving focus over a menu's rows.
*
* Rows are `tabindex="-1"`, so the menu keeps the single tab stop and the arrow
* keys move DOM focus from row to row; DOM focus is also the only highlight
* source, so hover and the keyboard can never light two rows at once.
*/
function useMenuFocus(options) {
	const { list } = options;
	function belongsHere(el, listEl) {
		return el.closest(MENU_BOUNDARY_SELECTOR) === listEl;
	}
	function getItems() {
		const listEl = list.value;
		if (listEl == null) return [];
		return Array.from(listEl.querySelectorAll(MENU_ITEM_SELECTOR)).filter((el) => belongsHere(el, listEl) && !isDisabled(el));
	}
	function getCurrentIndex() {
		const active = document.activeElement;
		return getItems().findIndex((el) => el === active || el.contains(active));
	}
	function focusIndex(items, index) {
		items[index]?.focus({ preventScroll: true });
	}
	/** The next enabled row from `start`, wrapping. -1 when there is none. */
	function findEnabledIndex(items, start, step) {
		const count = items.length;
		if (count === 0) return -1;
		let index = start;
		for (let i = 0; i < count; i++) {
			index = (index % count + count) % count;
			const item = items[index];
			if (item != null && !isDisabled(item)) return index;
			index += step;
		}
		return -1;
	}
	function focusItem(index) {
		const items = getItems();
		if (items.length === 0) return;
		focusIndex(items, Math.max(0, Math.min(index, items.length - 1)));
	}
	function focusFirst() {
		const items = getItems();
		const index = findEnabledIndex(items, 0, 1);
		if (index === -1) return false;
		focusIndex(items, index);
		return true;
	}
	function focusLast() {
		const items = getItems();
		const index = findEnabledIndex(items, items.length - 1, -1);
		if (index === -1) return false;
		focusIndex(items, index);
		return true;
	}
	/**
	* PageDown/PageUp: the last/first row fully visible in the surface, and one
	* viewport further when pressed again there. A menu whose rows all fit pages
	* straight to its last/first row. Never wraps.
	*/
	function focusPage(direction) {
		const container = list.value;
		const items = getItems();
		if (container == null || items.length === 0) return;
		const currentIndex = getCurrentIndex();
		if (currentIndex === -1 && direction === -1) {
			focusFirst();
			return;
		}
		function visibleIndices() {
			const bounds = container.getBoundingClientRect();
			return items.map((item, index) => ({
				index,
				rect: item.getBoundingClientRect()
			})).filter(({ rect }) => rect.height > 0 && rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1).map(({ index }) => index);
		}
		function isAhead(index) {
			return currentIndex === -1 || (direction === 1 ? index > currentIndex : index < currentIndex);
		}
		function edgeOf(visible) {
			if (visible.length === 0) return -1;
			return direction === 1 ? visible[visible.length - 1] : visible[0];
		}
		let visible = visibleIndices();
		let target = edgeOf(visible);
		if (target === -1 || !isAhead(target)) {
			container.scrollTop += direction * container.clientHeight;
			visible = visibleIndices();
			target = edgeOf(visible);
		}
		if (target === -1 || !isAhead(target)) {
			const pageSize = Math.max(1, visible.length);
			const from = currentIndex === -1 ? direction === 1 ? -1 : items.length : currentIndex;
			target = Math.max(0, Math.min(items.length - 1, from + direction * pageSize));
		}
		if (target !== -1 && target !== currentIndex) focusIndex(items, target);
	}
	function ownsEvent(event) {
		const listEl = list.value;
		const target = event.target;
		if (listEl == null || !(target instanceof HTMLElement)) return true;
		return belongsHere(target, listEl);
	}
	function handleKeyDown(event) {
		if (event.ctrlKey || event.metaKey || event.altKey) return;
		if (!ownsEvent(event)) return;
		const items = getItems();
		const currentIndex = getCurrentIndex();
		if (event.key === "ArrowDown") {
			const next = findEnabledIndex(items, currentIndex === -1 ? 0 : currentIndex + 1, 1);
			if (next !== -1) focusIndex(items, next);
		} else if (event.key === "ArrowUp") {
			const prev = findEnabledIndex(items, currentIndex === -1 ? items.length - 1 : currentIndex - 1, -1);
			if (prev !== -1) focusIndex(items, prev);
		} else if (event.key === "Home") focusFirst();
		else if (event.key === "End") focusLast();
		else if (event.key === "PageDown") focusPage(1);
		else if (event.key === "PageUp") focusPage(-1);
		else return;
		event.preventDefault();
	}
	return {
		focusFirst,
		focusItem,
		focusLast,
		getItems,
		handleKeyDown
	};
}
var DEFAULT_RESET_MS = 750;
function isComposing(event) {
	return event.isComposing === true;
}
/**
* First-character ("type-ahead") search over a menu's rows.
*
* Pressing the same letter repeatedly cycles through the matching rows instead
* of refining the query, so a menu with two rows starting with "d" can be
* walked with "d", "d". Space is reserved for activation and only extends a
* query that is already underway.
*/
function useMenuTypeahead(options) {
	const { getItemLabels, onMatch, getCurrentIndex, resetMs = DEFAULT_RESET_MS } = options;
	const buffer = ref("");
	let timer;
	function reset() {
		buffer.value = "";
		if (timer !== void 0) {
			clearTimeout(timer);
			timer = void 0;
		}
	}
	function scheduleReset() {
		if (timer !== void 0) clearTimeout(timer);
		timer = setTimeout(reset, resetMs);
	}
	function onKeyDown(event) {
		const extendsQuery = event.key === " " && !event.ctrlKey && !event.metaKey && !isComposing(event) && buffer.value.length > 0;
		if (!(event.key.length === 1 && !event.ctrlKey && !event.metaKey && !isComposing(event) && event.key !== " ") && !extendsQuery) return false;
		const labels = getItemLabels();
		if (labels.length === 0) return false;
		const char = event.key.toLowerCase();
		const next = buffer.value.length > 0 && [...buffer.value].every((c) => c === char) ? char : buffer.value + char;
		buffer.value = next;
		scheduleReset();
		const current = getCurrentIndex?.() ?? -1;
		const count = labels.length;
		const hasCurrent = current >= 0;
		const start = hasCurrent ? current : 0;
		const offset = hasCurrent && next.length === 1 ? 1 : 0;
		for (let i = 0; i < count; i++) {
			const index = (start + offset + i + count) % count;
			const label = labels[index];
			if (label != null && label.trim().toLowerCase().startsWith(next)) {
				onMatch(index);
				return true;
			}
		}
		return true;
	}
	onScopeDispose(reset);
	return {
		onKeyDown,
		reset
	};
}
var _hoisted_1 = ["data-open"];
var _hoisted_2 = [
	"id",
	"aria-labelledby",
	"aria-label",
	"data-placement"
];
var GAP = 4;
var DEFAULT_MAX_WIDTH = 320;
var DEFAULT_MAX_HEIGHT = "300px";
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxDropdownMenu",
	inheritAttrs: false,
	__name: "DropdownMenu",
	props: /*@__PURE__*/ mergeModels({
		button: { default: () => ({ label: "Menu" }) },
		items: {},
		isMenuOpen: { type: Boolean },
		menuWidth: {},
		menuMaxHeight: {},
		placement: { default: "below" },
		alignment: { default: "start" },
		hasChevron: {
			type: Boolean,
			default: true
		}
	}, {
		"isMenuOpen": {
			type: Boolean,
			default: void 0
		},
		"isMenuOpenModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels([
		"update:isMenuOpen",
		"openChange",
		"click"
	], ["update:isMenuOpen"]),
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const attrs = useAttrs();
		const slots = useSlots();
		const INTRINSIC_SIZE = /^(?:auto|min-content|max-content|fit-content|fit-content\(.*\)|inherit|initial|unset|revert|revert-layer)$/i;
		const open = useModel(__props, "isMenuOpen");
		const localIsOpen = shallowRef(false);
		const isOpen = computed(() => open.value ?? localIsOpen.value);
		const uid = useId();
		const menuId = `astryx-dropdown-menu-${uid}`;
		const triggerId = `astryx-dropdown-menu-trigger-${uid}`;
		const anchorRef = ref(null);
		const surfaceRef = ref(null);
		const anchorWidth = ref(0);
		const shouldFocusOnOpen = shallowRef(false);
		const focusLastOnOpen = shallowRef(false);
		let openModality = "keyboard";
		let armedTriggerClickGuard = false;
		const buttonProps = computed(() => props.button ?? {});
		const menuSize = computed(() => buttonProps.value.size ?? "md");
		const isIconOnly = computed(() => buttonProps.value.isIconOnly === true);
		const hasChevron = computed(() => props.hasChevron && !isIconOnly.value);
		const surfaceId = computed(() => {
			const provided = attrs.id;
			return typeof provided === "string" && provided.length > 0 ? provided : menuId;
		});
		const menuAriaLabel = computed(() => {
			const explicit = attrs["aria-label"];
			if (typeof explicit === "string") return explicit;
			if (slots.trigger != null) return void 0;
			return typeof buttonProps.value.label === "string" ? buttonProps.value.label : void 0;
		});
		const menuAriaLabelledBy = computed(() => {
			const explicit = attrs["aria-labelledby"];
			if (typeof explicit === "string") return explicit;
			if (menuAriaLabel.value != null) return void 0;
			return slots.trigger != null ? triggerId : void 0;
		});
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => ![
			"class",
			"style",
			"id",
			"aria-label",
			"aria-labelledby"
		].includes(key))));
		/**
		* The layer tracks its own open state so a menu that mounts already open still
		* gets one open transition: the layer's own watcher only reacts to a change,
		* and a controlled menu renders open from the first frame.
		*/
		const layerIsOpen = ref(false);
		const { position, detach: detachPosition } = usePositionedLayer({
			anchor: anchorRef,
			layer: surfaceRef,
			isOpen: layerIsOpen,
			placement: computed(() => props.placement),
			alignment: computed(() => props.alignment),
			gap: GAP
		});
		watch(isOpen, (nowOpen) => {
			layerIsOpen.value = nowOpen;
		});
		const surfaceStyle = computed(() => {
			const style = {
				"top": `${position.value.top}px`,
				"left": `${position.value.left}px`,
				"--_dropdown-menu-max-block": `min(${props.menuMaxHeight == null ? DEFAULT_MAX_HEIGHT : `${props.menuMaxHeight}px`}, calc(100dvh - 16px))`,
				"maxWidth": props.menuWidth == null ? `min(${DEFAULT_MAX_WIDTH}px, calc(100vw - 16px))` : "calc(100vw - 16px)"
			};
			if (props.menuWidth == null) {
				style.minWidth = `min(${anchorWidth.value}px, ${DEFAULT_MAX_WIDTH}px)`;
				return style;
			}
			const width = (typeof props.menuWidth === "number" ? `${props.menuWidth}px` : props.menuWidth).trim();
			if (INTRINSIC_SIZE.test(width)) style.width = width;
			else style.minWidth = `min(${width}, calc(100vw - 16px))`;
			return style;
		});
		const focusNav = useMenuFocus({ list: surfaceRef });
		const typeahead = useMenuTypeahead({
			getItemLabels: () => focusNav.getItems().map((row) => {
				return row.querySelector(".astryx-item__label")?.textContent ?? row.textContent ?? "";
			}),
			getCurrentIndex: () => {
				const active = document.activeElement;
				return focusNav.getItems().findIndex((row) => row === active || row.contains(active));
			},
			onMatch: (index) => focusNav.focusItem(index)
		});
		function emitOpenChange(next) {
			localIsOpen.value = next;
			open.value = next;
			emit("openChange", next);
		}
		function focusSurface() {
			surfaceRef.value?.focus({ preventScroll: true });
		}
		function openMenu(modality) {
			if (isOpen.value) return;
			openModality = modality;
			shouldFocusOnOpen.value = true;
			emitOpenChange(true);
		}
		function closeMenu() {
			if (!isOpen.value) return;
			emitOpenChange(false);
		}
		function getTriggerControl() {
			const anchor = anchorRef.value;
			if (anchor == null) return null;
			if (anchor.matches("button, a[href], [role=\"button\"], [tabindex]")) return anchor;
			return anchor.querySelector("button, a[href], [role=\"button\"], [tabindex]");
		}
		function onDocumentPointerDown(event) {
			if (!isOpen.value) return;
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (surfaceRef.value?.contains(target) || anchorRef.value?.contains(target)) return;
			closeMenu();
		}
		function onDocumentKeydown(event) {
			if (!isOpen.value || event.key !== "Escape") return;
			event.preventDefault();
			closeMenu();
		}
		function attachDismissListeners() {
			anchorWidth.value = anchorRef.value?.getBoundingClientRect().width ?? 0;
			document.addEventListener("pointerdown", onDocumentPointerDown, true);
			document.addEventListener("keydown", onDocumentKeydown);
		}
		function detachDismissListeners() {
			document.removeEventListener("pointerdown", onDocumentPointerDown, true);
			document.removeEventListener("keydown", onDocumentKeydown);
		}
		watch(isOpen, async (nowOpen) => {
			if (nowOpen) {
				attachDismissListeners();
				await nextTick();
				if (!shouldFocusOnOpen.value) return;
				shouldFocusOnOpen.value = false;
				const hasFocusedRow = focusLastOnOpen.value ? focusNav.focusLast() : focusNav.focusFirst();
				focusLastOnOpen.value = false;
				if (openModality === "pointer" || !hasFocusedRow) focusSurface();
				openModality = "keyboard";
				return;
			}
			detachDismissListeners();
			typeahead.reset();
			const active = document.activeElement;
			const surface = surfaceRef.value;
			if (active == null || active === document.body || surface != null && surface.contains(active)) getTriggerControl()?.focus({ preventScroll: true });
		});
		function onSurfaceKeydown(event) {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				if (event.repeat) return;
				const focused = document.activeElement;
				if (focused instanceof HTMLElement && MENU_ITEM_ROLES.has(focused.getAttribute("role") ?? "")) activateMenuItem(focused, event);
				return;
			}
			if (event.key === "Tab") {
				closeMenu();
				return;
			}
			if (typeahead.onKeyDown(event)) {
				event.preventDefault();
				return;
			}
			focusNav.handleKeyDown(event);
		}
		function onTriggerClick(event) {
			if (armedTriggerClickGuard) {
				armedTriggerClickGuard = false;
				return;
			}
			if (isOpen.value) {
				emit("click");
				closeMenu();
				return;
			}
			openMenu(event.detail === 0 ? "keyboard" : "pointer");
			emit("click");
		}
		function onTriggerKeydown(event) {
			if (!isOpen.value) {
				if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Enter" && event.key !== " ") return;
				event.preventDefault();
				if (event.repeat) return;
				if (event.key === "Enter" || event.key === " ") {
					armedTriggerClickGuard = true;
					setTimeout(() => {
						armedTriggerClickGuard = false;
					}, 0);
				}
				focusLastOnOpen.value = event.key === "ArrowUp";
				openMenu("keyboard");
				return;
			}
			if (event.key === "ArrowDown") {
				event.preventDefault();
				if (!focusNav.focusFirst()) focusSurface();
			}
		}
		const triggerProps = computed(() => ({
			"id": triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": isOpen.value,
			"aria-controls": surfaceId.value,
			"onClick": onTriggerClick,
			"onKeyDown": onTriggerKeydown
		}));
		provide(dropdownMenuContextKey, {
			closeMenu,
			menuSize
		});
		onMounted(() => {
			if (!isOpen.value) return;
			layerIsOpen.value = true;
			attachDismissListeners();
		});
		onBeforeUnmount(() => {
			detachDismissListeners();
			detachPosition();
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("span", {
				ref_key: "anchorRef",
				ref: anchorRef,
				class: "astryx-dropdown-menu-trigger",
				"data-open": isOpen.value ? "true" : void 0
			}, [unref(slots).trigger ? renderSlot(_ctx.$slots, "trigger", normalizeProps(guardReactiveProps(triggerProps.value)), void 0, void 0, 0) : (openBlock(), createBlock(_sfc_main$5, mergeProps({ key: 1 }, buttonProps.value, {
				id: triggerId,
				"aria-controls": surfaceId.value,
				"aria-expanded": isOpen.value,
				"aria-haspopup": "menu",
				tooltip: isOpen.value ? void 0 : buttonProps.value.tooltip,
				onClick: onTriggerClick,
				onKeydown: onTriggerKeydown
			}), createSlots({ _: 2 }, [hasChevron.value ? {
				name: "end",
				fn: withCtx(() => [createVNode(_sfc_main$9, {
					color: "inherit",
					icon: "chevronDown",
					size: "sm"
				})]),
				key: "0"
			} : void 0]), 1040, [
				"aria-controls",
				"aria-expanded",
				"tooltip"
			]))], 8, _hoisted_1), (openBlock(), createBlock(Teleport, { to: "body" }, [createVNode(Transition, {
				name: "astryx-dropdown-menu",
				persisted: ""
			}, {
				default: withCtx(() => [withDirectives(createElementVNode("div", mergeProps({
					id: surfaceId.value,
					ref_key: "surfaceRef",
					ref: surfaceRef
				}, forwardedAttrs.value, {
					"aria-labelledby": menuAriaLabelledBy.value,
					"aria-label": menuAriaLabel.value,
					class: ["astryx-dropdown-menu", unref(attrs).class],
					"data-placement": unref(position).placement,
					role: "menu",
					style: [surfaceStyle.value, unref(attrs).style],
					tabindex: "-1",
					onKeydown: onSurfaceKeydown
				}), [__props.items != null ? (openBlock(), createBlock(unref(DropdownMenuItems), {
					key: 0,
					items: __props.items
				}, null, 8, ["items"])) : renderSlot(_ctx.$slots, "default", {}, void 0, void 0, 1)], 16, _hoisted_2), [[vShow, isOpen.value]])]),
				_: 3
			})]))], 64);
		};
	}
});
//#endregion
//#region components/demos/dropdown-menu/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const lastAction = ref("No action yet");
		const items = [
			{
				label: "Edit project",
				onClick: () => {
					lastAction.value = "Edit project";
				}
			},
			{
				label: "Duplicate project",
				onClick: () => {
					lastAction.value = "Duplicate project";
				}
			},
			{
				label: "Move to archive",
				onClick: () => {
					lastAction.value = "Move to archive";
				}
			},
			{
				label: "Delete project",
				variant: "destructive",
				onClick: () => {
					lastAction.value = "Delete project";
				}
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "dropdown-menu-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				button: { label: "Actions" },
				items
			}, null, _parent));
			_push(`<p class="dropdown-menu-preview__note"> Last action: ${ssrInterpolate(lastAction.value)}</p></div>`);
		};
	}
});
//#endregion
//#region components/demos/dropdown-menu/basic.vue
var _sfc_setup$3 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/dropdown-menu/basic.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/dropdown-menu/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport type { DropdownMenuOption } from '@astryx-vue/core/DropdownMenu'\nimport { DropdownMenu } from '@astryx-vue/core/DropdownMenu'\nimport { ref } from 'vue'\n\nconst lastAction = ref('No action yet')\n\nconst items: DropdownMenuOption[] = [\n  { label: 'Edit project', onClick: () => { lastAction.value = 'Edit project' } },\n  { label: 'Duplicate project', onClick: () => { lastAction.value = 'Duplicate project' } },\n  { label: 'Move to archive', onClick: () => { lastAction.value = 'Move to archive' } },\n  { label: 'Delete project', variant: 'destructive', onClick: () => { lastAction.value = 'Delete project' } },\n]\n<\/script>\n\n<template>\n  <div class=\"dropdown-menu-preview\">\n    <DropdownMenu :button=\"{ label: 'Actions' }\" :items=\"items\" />\n    <p class=\"dropdown-menu-preview__note\">\n      Last action: {{ lastAction }}\n    </p>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { DropdownMenuOption } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/DropdownMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { DropdownMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/DropdownMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> lastAction</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'No action yet'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> items</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> DropdownMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Edit project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">onClick</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { lastAction.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Edit project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> } },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Duplicate project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">onClick</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { lastAction.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Duplicate project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> } },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Move to archive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">onClick</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { lastAction.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Move to archive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> } },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Delete project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, variant: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'destructive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">onClick</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { lastAction.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Delete project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> } },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"dropdown-menu-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">{ label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Actions'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"dropdown-menu-preview__note\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Last action: {{ lastAction }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/dropdown-menu/overview.vue?vue&type=script&setup=true&lang.ts
var overview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "overview",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "dropdown-menu-preview" }, _attrs))}><span class="astryx-dropdown-menu-trigger dropdown-menu-preview__trigger" data-open="true">`);
			_push(ssrRenderComponent(unref(_sfc_main$5), {
				label: "Actions",
				variant: "secondary"
			}, {
				end: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-chevron-down"${_scopeId}></span>`);
					else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-chevron-down" })];
				}),
				_: 1
			}, _parent));
			_push(`</span><div aria-label="Actions" class="astryx-dropdown-menu dropdown-menu-preview__surface" role="menu">`);
			_push(ssrRenderComponent(unref(_sfc_main$2), { title: "Project" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), {
							class: "dropdown-menu-preview__highlight",
							description: "Rename, move, or change the cover",
							label: "Edit project"
						}, {
							icon: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-tools"${_scopeId}></span>`);
								else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-tools" })];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { label: "Duplicate project" }, {
							icon: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-copy"${_scopeId}></span>`);
								else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-copy" })];
							}),
							endContent: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main$10), { keys: "mod+d" }, null, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main$10), { keys: "mod+d" })];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(unref(_sfc_main$1), {
						class: "dropdown-menu-preview__highlight",
						description: "Rename, move, or change the cover",
						label: "Edit project"
					}, {
						icon: withCtx(() => [createVNode("span", { class: "css-icon css-icon--sm i-carbon-tools" })]),
						_: 1
					}), createVNode(unref(_sfc_main$1), { label: "Duplicate project" }, {
						icon: withCtx(() => [createVNode("span", { class: "css-icon css-icon--sm i-carbon-copy" })]),
						endContent: withCtx(() => [createVNode(unref(_sfc_main$10), { keys: "mod+d" })]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$4), null, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				description: "Only you will see it again",
				label: "Move to archive"
			}, {
				icon: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-view-off"${_scopeId}></span>`);
					else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-view-off" })];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				label: "Delete project",
				variant: "destructive"
			}, {
				icon: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-trash-can"${_scopeId}></span>`);
					else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-trash-can" })];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region components/demos/dropdown-menu/overview.vue
var _sfc_setup$2 = overview_vue_vue_type_script_setup_true_lang_default.setup;
overview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/dropdown-menu/overview.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var overview_default$1 = overview_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/dropdown-menu/overview.vue?raw&highlighted
var overview_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { DropdownMenuDivider, DropdownMenuGroup, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'\nimport { Kbd } from '@astryx-vue/core/Kbd'\n<\/script>\n\n<template>\n  <div class=\"dropdown-menu-preview\">\n    <span class=\"astryx-dropdown-menu-trigger dropdown-menu-preview__trigger\" data-open=\"true\">\n      <Button label=\"Actions\" variant=\"secondary\">\n        <template #end>\n          <span class=\"css-icon css-icon--sm i-carbon-chevron-down\" />\n        </template>\n      </Button>\n    </span>\n\n    <div aria-label=\"Actions\" class=\"astryx-dropdown-menu dropdown-menu-preview__surface\" role=\"menu\">\n      <DropdownMenuGroup title=\"Project\">\n        <DropdownMenuItem\n          class=\"dropdown-menu-preview__highlight\"\n          description=\"Rename, move, or change the cover\"\n          label=\"Edit project\"\n        >\n          <template #icon>\n            <span class=\"css-icon css-icon--sm i-carbon-tools\" />\n          </template>\n        </DropdownMenuItem>\n        <DropdownMenuItem label=\"Duplicate project\">\n          <template #icon>\n            <span class=\"css-icon css-icon--sm i-carbon-copy\" />\n          </template>\n          <template #endContent>\n            <Kbd keys=\"mod+d\" />\n          </template>\n        </DropdownMenuItem>\n      </DropdownMenuGroup>\n\n      <DropdownMenuDivider />\n\n      <DropdownMenuItem\n        description=\"Only you will see it again\"\n        label=\"Move to archive\"\n      >\n        <template #icon>\n          <span class=\"css-icon css-icon--sm i-carbon-view-off\" />\n        </template>\n      </DropdownMenuItem>\n      <DropdownMenuItem label=\"Delete project\" variant=\"destructive\">\n        <template #icon>\n          <span class=\"css-icon css-icon--sm i-carbon-trash-can\" />\n        </template>\n      </DropdownMenuItem>\n    </div>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { DropdownMenuDivider, DropdownMenuGroup, DropdownMenuItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/DropdownMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Kbd } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Kbd'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"dropdown-menu-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"astryx-dropdown-menu-trigger dropdown-menu-preview__trigger\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> data-open</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"true\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Actions\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">end</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-chevron-down\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> aria-label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Actions\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"astryx-dropdown-menu dropdown-menu-preview__surface\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> role</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"menu\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Project\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"dropdown-menu-preview__highlight\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Rename, move, or change the cover\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Edit project\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-tools\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Duplicate project\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-copy\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">endContent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Kbd</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> keys</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"mod+d\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuGroup</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuDivider</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Only you will see it again\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Move to archive\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-view-off\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Delete project\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"destructive\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-trash-can\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/dropdown-menu/sections.vue?vue&type=script&setup=true&lang.ts
var sections_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "sections",
	__ssrInlineRender: true,
	setup(__props) {
		const lastAction = ref("No action yet");
		function run(label) {
			return () => {
				lastAction.value = label;
			};
		}
		const items = [
			{
				type: "section",
				title: "This project",
				items: [{
					label: "Edit project",
					icon: "css-icon css-icon--sm i-carbon-tools",
					onClick: run("Edit project")
				}, {
					label: "Duplicate project",
					icon: "css-icon css-icon--sm i-carbon-copy",
					onClick: run("Duplicate project")
				}]
			},
			{ type: "divider" },
			{
				type: "section",
				title: "Danger zone",
				items: [{
					label: "Move to archive",
					description: "Hidden from everyone else",
					icon: "css-icon css-icon--sm i-carbon-view-off",
					onClick: run("Move to archive")
				}, {
					label: "Delete project",
					icon: "css-icon css-icon--sm i-carbon-trash-can",
					variant: "destructive",
					onClick: run("Delete project")
				}]
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "dropdown-menu-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				button: { label: "Project actions" },
				items
			}, null, _parent));
			_push(`<p class="dropdown-menu-preview__note"> Last action: ${ssrInterpolate(lastAction.value)}</p></div>`);
		};
	}
});
//#endregion
//#region components/demos/dropdown-menu/sections.vue
var _sfc_setup$1 = sections_vue_vue_type_script_setup_true_lang_default.setup;
sections_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/dropdown-menu/sections.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var sections_default$1 = sections_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/dropdown-menu/sections.vue?raw&highlighted
var sections_default = {
	"source": "<script setup lang=\"ts\">\nimport type { DropdownMenuOption } from '@astryx-vue/core/DropdownMenu'\nimport { DropdownMenu } from '@astryx-vue/core/DropdownMenu'\nimport { ref } from 'vue'\n\nconst lastAction = ref('No action yet')\n\nfunction run(label: string): () => void {\n  return () => {\n    lastAction.value = label\n  }\n}\n\nconst items: DropdownMenuOption[] = [\n  {\n    type: 'section',\n    title: 'This project',\n    items: [\n      { label: 'Edit project', icon: 'css-icon css-icon--sm i-carbon-tools', onClick: run('Edit project') },\n      { label: 'Duplicate project', icon: 'css-icon css-icon--sm i-carbon-copy', onClick: run('Duplicate project') },\n    ],\n  },\n  { type: 'divider' },\n  {\n    type: 'section',\n    title: 'Danger zone',\n    items: [\n      {\n        label: 'Move to archive',\n        description: 'Hidden from everyone else',\n        icon: 'css-icon css-icon--sm i-carbon-view-off',\n        onClick: run('Move to archive'),\n      },\n      { label: 'Delete project', icon: 'css-icon css-icon--sm i-carbon-trash-can', variant: 'destructive', onClick: run('Delete project') },\n    ],\n  },\n]\n<\/script>\n\n<template>\n  <div class=\"dropdown-menu-preview\">\n    <DropdownMenu :button=\"{ label: 'Project actions' }\" :items=\"items\" />\n    <p class=\"dropdown-menu-preview__note\">\n      Last action: {{ lastAction }}\n    </p>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { DropdownMenuOption } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/DropdownMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { DropdownMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/DropdownMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> lastAction</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'No action yet'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> run</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">label</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> string</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">  return</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    lastAction.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> label</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> items</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> DropdownMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'section'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    title: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'This project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    items: [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Edit project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-tools'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, onClick: </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">run</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Edit project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">) },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Duplicate project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-copy'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, onClick: </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">run</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Duplicate project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">) },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    ],</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'divider'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'section'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    title: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Danger zone'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    items: [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Move to archive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        description: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Hidden from everyone else'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-view-off'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        onClick: </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">run</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Move to archive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">),</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Delete project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-trash-can'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, variant: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'destructive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, onClick: </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">run</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Delete project'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">) },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    ],</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"dropdown-menu-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">{ label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Project actions'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"dropdown-menu-preview__note\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Last action: {{ lastAction }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/dropdown-menu/shortcuts.vue?vue&type=script&setup=true&lang.ts
var shortcuts_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "shortcuts",
	__ssrInlineRender: true,
	setup(__props) {
		const lastAction = ref("No action yet");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "dropdown-menu-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), null, {
				trigger: withCtx((triggerProps, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$6), mergeProps(triggerProps, {
						icon: "i-carbon-overflow-menu-horizontal",
						label: "More actions",
						variant: "ghost"
					}), null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$6), mergeProps(triggerProps, {
						icon: "i-carbon-overflow-menu-horizontal",
						label: "More actions",
						variant: "ghost"
					}), null, 16)];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), {
							description: "Rename, move, or change the cover",
							label: "Edit project",
							onClick: ($event) => lastAction.value = "Edit project"
						}, {
							icon: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-tools"${_scopeId}></span>`);
								else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-tools" })];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), {
							label: "Duplicate project",
							onClick: ($event) => lastAction.value = "Duplicate project"
						}, {
							icon: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-copy"${_scopeId}></span>`);
								else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-copy" })];
							}),
							endContent: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main$10), { keys: "mod+d" }, null, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main$10), { keys: "mod+d" })];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$4), null, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), {
							description: "This cannot be undone",
							label: "Delete project",
							variant: "destructive",
							onClick: ($event) => lastAction.value = "Delete project"
						}, {
							icon: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-trash-can"${_scopeId}></span>`);
								else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-trash-can" })];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1), {
							description: "Rename, move, or change the cover",
							label: "Edit project",
							onClick: ($event) => lastAction.value = "Edit project"
						}, {
							icon: withCtx(() => [createVNode("span", { class: "css-icon css-icon--sm i-carbon-tools" })]),
							_: 1
						}, 8, ["onClick"]),
						createVNode(unref(_sfc_main$1), {
							label: "Duplicate project",
							onClick: ($event) => lastAction.value = "Duplicate project"
						}, {
							icon: withCtx(() => [createVNode("span", { class: "css-icon css-icon--sm i-carbon-copy" })]),
							endContent: withCtx(() => [createVNode(unref(_sfc_main$10), { keys: "mod+d" })]),
							_: 1
						}, 8, ["onClick"]),
						createVNode(unref(_sfc_main$4)),
						createVNode(unref(_sfc_main$1), {
							description: "This cannot be undone",
							label: "Delete project",
							variant: "destructive",
							onClick: ($event) => lastAction.value = "Delete project"
						}, {
							icon: withCtx(() => [createVNode("span", { class: "css-icon css-icon--sm i-carbon-trash-can" })]),
							_: 1
						}, 8, ["onClick"])
					];
				}),
				_: 1
			}, _parent));
			_push(`<p class="dropdown-menu-preview__note"> Last action: ${ssrInterpolate(lastAction.value)}</p></div>`);
		};
	}
});
//#endregion
//#region components/demos/dropdown-menu/shortcuts.vue
var _sfc_setup = shortcuts_vue_vue_type_script_setup_true_lang_default.setup;
shortcuts_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/dropdown-menu/shortcuts.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var shortcuts_default$1 = shortcuts_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/dropdown-menu/shortcuts.vue?raw&highlighted
var shortcuts_default = {
	"source": "<script setup lang=\"ts\">\nimport { DropdownMenu, DropdownMenuDivider, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'\nimport { IconButton } from '@astryx-vue/core/IconButton'\nimport { Kbd } from '@astryx-vue/core/Kbd'\nimport { ref } from 'vue'\n\nconst lastAction = ref('No action yet')\n<\/script>\n\n<template>\n  <div class=\"dropdown-menu-preview\">\n    <DropdownMenu>\n      <template #trigger=\"triggerProps\">\n        <IconButton v-bind=\"triggerProps\" icon=\"i-carbon-overflow-menu-horizontal\" label=\"More actions\" variant=\"ghost\" />\n      </template>\n\n      <DropdownMenuItem\n        description=\"Rename, move, or change the cover\"\n        label=\"Edit project\"\n        @click=\"lastAction = 'Edit project'\"\n      >\n        <template #icon>\n          <span class=\"css-icon css-icon--sm i-carbon-tools\" />\n        </template>\n      </DropdownMenuItem>\n      <DropdownMenuItem label=\"Duplicate project\" @click=\"lastAction = 'Duplicate project'\">\n        <template #icon>\n          <span class=\"css-icon css-icon--sm i-carbon-copy\" />\n        </template>\n        <template #endContent>\n          <Kbd keys=\"mod+d\" />\n        </template>\n      </DropdownMenuItem>\n      <DropdownMenuDivider />\n      <DropdownMenuItem\n        description=\"This cannot be undone\"\n        label=\"Delete project\"\n        variant=\"destructive\"\n        @click=\"lastAction = 'Delete project'\"\n      >\n        <template #icon>\n          <span class=\"css-icon css-icon--sm i-carbon-trash-can\" />\n        </template>\n      </DropdownMenuItem>\n    </DropdownMenu>\n\n    <p class=\"dropdown-menu-preview__note\">\n      Last action: {{ lastAction }}\n    </p>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { DropdownMenu, DropdownMenuDivider, DropdownMenuItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/DropdownMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { IconButton } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/IconButton'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Kbd } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Kbd'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> lastAction</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'No action yet'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"dropdown-menu-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">trigger</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">triggerProps</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">IconButton</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-bind</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">triggerProps</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"i-carbon-overflow-menu-horizontal\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"More actions\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ghost\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Rename, move, or change the cover\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Edit project\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">lastAction </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Edit project'\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-tools\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Duplicate project\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">lastAction </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Duplicate project'\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-copy\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">endContent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Kbd</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> keys</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"mod+d\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuDivider</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"This cannot be undone\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Delete project\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"destructive\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">lastAction </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Delete project'\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-trash-can\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">DropdownMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"dropdown-menu-preview__note\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Last action: {{ lastAction }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/dropdown-menu/index.ts
var options = { className: "dropdown-menu-preview-host" };
var dropdownMenuOverview = defineDemo(overview_default$1, overview_default, options);
var dropdownMenuBasic = defineDemo(basic_default$1, basic_default, options);
var dropdownMenuSections = defineDemo(sections_default$1, sections_default, options);
var dropdownMenuShortcuts = defineDemo(shortcuts_default$1, shortcuts_default, options);
//#endregion
export { dropdownMenuShortcuts as i, dropdownMenuOverview as n, dropdownMenuSections as r, dropdownMenuBasic as t };
