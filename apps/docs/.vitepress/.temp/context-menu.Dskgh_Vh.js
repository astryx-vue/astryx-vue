import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$6 } from "./Text-CKd7e3gK.CukfIJwc.js";
import { t as _sfc_main$7 } from "./Card-HAjZQg2s.CCQm9qeI.js";
import { t as _sfc_main$8 } from "./Divider-BtwnL18I.BzWZDGLo.js";
import { t as _sfc_main$9 } from "./Icon-B6qNgBP9.DVAnMRiH.js";
import { t as usePositionedLayer } from "./usePositionedLayer-C1NBOsVT.CqLwBJaO.js";
import { Fragment, Teleport, Transition, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, inject, mergeModels, mergeProps, nextTick, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, openBlock, provide, ref, renderList, renderSlot, resolveComponent, resolveDynamicComponent, toDisplayString, toValue, unref, useAttrs, useId, useModel, useSSRContext, useTemplateRef, vShow, watch, withCtx, withDirectives, withModifiers } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/ContextMenu-D6gg91jF.js
var contextMenuContextKey = Symbol("astryx-context-menu");
/** The surrounding menu, or `undefined` when the row stands alone. */
function useContextMenu() {
	return inject(contextMenuContextKey, void 0);
}
/** The row density of the surrounding menu, or the menu default. */
function useContextMenuSize() {
	const menu = useContextMenu();
	return computed(() => menu?.menuSize.value ?? "md");
}
var _sfc_main$5 = /*@__PURE__*/ defineComponent({
	name: "AstryxContextMenuDivider",
	__name: "ContextMenuDivider",
	props: { variant: { default: "subtle" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(_sfc_main$8, {
				class: "astryx-context-menu-divider",
				variant: __props.variant
			}, null, 8, ["variant"]);
		};
	}
});
var _hoisted_1$3 = ["aria-labelledby"];
var _sfc_main$4 = /*@__PURE__*/ defineComponent({
	name: "AstryxContextMenuGroup",
	__name: "ContextMenuGroup",
	props: { title: {} },
	setup(__props) {
		const props = __props;
		const headingId = `astryx-context-menu-group-${useId()}`;
		const hasTitle = computed(() => props.title != null && props.title !== "");
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "astryx-context-menu-group",
				role: "group",
				"aria-labelledby": hasTitle.value ? headingId : void 0
			}, [hasTitle.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				id: headingId,
				class: "astryx-context-menu-group__heading"
			}, toDisplayString(__props.title), 1)) : createCommentVNode("v-if", true), renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$3);
		};
	}
});
/**
* Roles a menu row can carry. The selectable roles sit alongside the plain
* one so every row is reachable by arrow keys, typeahead, and Enter/Space.
*/
var MENU_ITEM_ROLES = /* @__PURE__ */ new Set([
	"menuitem",
	"menuitemradio",
	"menuitemcheckbox"
]);
/** Selector for the activatable rows of one menu level. */
var MENU_ITEM_SELECTOR = [...MENU_ITEM_ROLES].map((role) => `[role="${role}"]:not([aria-disabled="true"])`).join(",");
/** Selector for any menu level, used to scope a level's rows and key events. */
var MENU_BOUNDARY_SELECTOR = "[role=\"menu\"]";
/**
* Whether a click carries a modifier or a non-primary button. On a row that is
* a link the browser gives such a click a meaning of its own, which the row
* must leave alone.
*/
function isModifiedClick(event) {
	return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (event.button ?? 0) !== 0;
}
/**
* Activate a row from the keyboard: a synthesized click that carries the key's
* modifiers, so a modified Enter on a link row opens the way a modified click
* would. `detail` stays 0, the mark of a non-pointer activation.
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
function isDisabledRow(row) {
	return row.getAttribute("aria-disabled") === "true" || row.hasAttribute("disabled");
}
function isHiddenWithin(row, container) {
	let current = row;
	while (current != null && current !== container) {
		if (current.hidden || current.getAttribute("aria-hidden") === "true") return true;
		current = current.parentElement;
	}
	return false;
}
var TYPEAHEAD_RESET_MS = 750;
/**
* Roving focus, typeahead, and activation for one menu level.
*
* Both the menu panel and every submenu flyout own one of these, so a nested
* level keeps its own highlight, its own typeahead buffer, and its own keys
* without coordinating with its parent.
*/
function useMenuNav(options) {
	const { menuRef, onClose } = options;
	let typeaheadBuffer = "";
	let typeaheadTimer;
	function resetTypeahead() {
		typeaheadBuffer = "";
		if (typeaheadTimer != null) {
			clearTimeout(typeaheadTimer);
			typeaheadTimer = void 0;
		}
	}
	function getItems() {
		const menu = menuRef.value;
		if (menu == null) return [];
		return Array.from(menu.querySelectorAll(MENU_ITEM_SELECTOR)).filter((row) => !isHiddenWithin(row, menu)).filter((row) => row.closest(MENU_BOUNDARY_SELECTOR) === menu);
	}
	function ownsEvent(event) {
		const menu = menuRef.value;
		const target = event.target;
		if (menu == null || !(target instanceof Element)) return true;
		return target.closest(MENU_BOUNDARY_SELECTOR) === menu;
	}
	function getCurrentIndex(items) {
		const active = menuRef.value?.ownerDocument.activeElement ?? null;
		return items.findIndex((row) => row === active || row.contains(active));
	}
	function findEnabledIndex(items, start, step, wrap) {
		const count = items.length;
		if (count === 0) return -1;
		let index = start;
		for (let i = 0; i < count; i++) {
			if (index < 0 || index >= count) {
				if (!wrap) return -1;
				index = (index + count) % count;
			}
			const row = items[index];
			if (row != null && !isDisabledRow(row)) return index;
			index += step;
		}
		return -1;
	}
	function focusIndex(items, index) {
		const row = items[index];
		if (row == null) return false;
		row.focus();
		return true;
	}
	function focusFirst() {
		const items = getItems();
		return focusIndex(items, findEnabledIndex(items, 0, 1, false));
	}
	function focusLast() {
		const items = getItems();
		return focusIndex(items, findEnabledIndex(items, items.length - 1, -1, false));
	}
	function moveBy(direction) {
		const items = getItems();
		if (items.length === 0) return false;
		const current = getCurrentIndex(items);
		return focusIndex(items, findEnabledIndex(items, current === -1 ? direction === 1 ? 0 : items.length - 1 : current + direction, direction, true));
	}
	/**
	* PageDown / PageUp move by the rows a viewport shows, never wrapping; in a
	* menu that does not scroll they act as End and Home.
	*/
	function focusPage(direction) {
		const menu = menuRef.value;
		const all = getItems();
		const active = all.map((row, index) => isDisabledRow(row) ? -1 : index).filter((index) => index !== -1);
		if (menu == null || active.length === 0) return false;
		if (menu.clientHeight === 0 || menu.scrollHeight <= menu.clientHeight) return direction === 1 ? focusLast() : focusFirst();
		const rowHeight = all[active[0]]?.getBoundingClientRect().height ?? 0;
		const perPage = rowHeight > 0 ? Math.max(1, Math.floor(menu.clientHeight / rowHeight)) : active.length;
		const position = active.indexOf(getCurrentIndex(all));
		const from = position === -1 ? direction === 1 ? -1 : active.length : position;
		return focusIndex(all, active[Math.max(0, Math.min(active.length - 1, from + direction * perPage))]);
	}
	/**
	* Typeahead over the rows' label elements. Repeated presses of the same
	* character cycle through the matches instead of filtering deeper.
	*/
	function handleTypeahead(event) {
		const isSpaceMidType = event.key === " " && typeaheadBuffer.length > 0;
		if (!(event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== " ") && !isSpaceMidType) return false;
		const items = getItems();
		const labels = items.map((row) => row.querySelector(`[data-menu-item-label]`)?.textContent ?? row.textContent);
		if (labels.length === 0) return false;
		const char = event.key.toLowerCase();
		const nextBuffer = typeaheadBuffer.length > 0 && [...typeaheadBuffer].every((entry) => entry === char) ? char : typeaheadBuffer + char;
		typeaheadBuffer = nextBuffer;
		if (typeaheadTimer != null) clearTimeout(typeaheadTimer);
		typeaheadTimer = setTimeout(resetTypeahead, TYPEAHEAD_RESET_MS);
		const current = getCurrentIndex(items);
		const hasCurrent = current >= 0;
		const start = hasCurrent ? current : 0;
		const offset = hasCurrent && nextBuffer.length === 1 ? 1 : 0;
		for (let i = 0; i < labels.length; i++) {
			const index = (start + offset + i + labels.length) % labels.length;
			if (isDisabledRow(items[index])) continue;
			const label = labels[index];
			if (label != null && label.trim().toLowerCase().startsWith(nextBuffer)) {
				focusIndex(items, index);
				return true;
			}
		}
		return true;
	}
	function handleKeyDown(event) {
		if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
		if (!ownsEvent(event)) return;
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			if (event.repeat) return;
			const active = menuRef.value?.ownerDocument.activeElement;
			if (active instanceof HTMLElement && MENU_ITEM_ROLES.has(active.getAttribute("role") ?? "")) activateMenuItem(active, event);
			return;
		}
		if (event.key === "Tab") {
			onClose("tab");
			return;
		}
		if (event.key === "Escape") {
			event.preventDefault();
			onClose("escape");
			return;
		}
		if (handleTypeahead(event)) {
			event.preventDefault();
			return;
		}
		if (event.key === "ArrowDown" && moveBy(1)) {
			event.preventDefault();
			return;
		}
		if (event.key === "ArrowUp" && moveBy(-1)) {
			event.preventDefault();
			return;
		}
		if (event.key === "Home" && focusFirst()) {
			event.preventDefault();
			return;
		}
		if (event.key === "End" && focusLast()) {
			event.preventDefault();
			return;
		}
		if (event.key === "PageDown" && focusPage(1)) {
			event.preventDefault();
			return;
		}
		if (event.key === "PageUp" && focusPage(-1)) event.preventDefault();
	}
	return {
		focusFirst,
		handleKeyDown,
		resetTypeahead
	};
}
var _hoisted_1$2 = {
	key: 0,
	class: "astryx-context-menu-item__start"
};
var _hoisted_2$1 = { class: "astryx-context-menu-item__content" };
var _hoisted_3$1 = {
	class: "astryx-context-menu-item__label",
	"data-menu-item-label": ""
};
var _hoisted_4$1 = {
	key: 0,
	class: "astryx-context-menu-item__description"
};
var _hoisted_5$1 = {
	key: 1,
	class: "astryx-context-menu-item__end"
};
var _sfc_main$3 = /*@__PURE__*/ defineComponent({
	name: "AstryxContextMenuItem",
	__name: "ContextMenuItem",
	props: {
		icon: {},
		label: {},
		description: {},
		endContent: {},
		href: {},
		target: {},
		rel: {},
		isDisabled: {
			type: Boolean,
			default: false
		},
		hasCloseOnSelect: {
			type: Boolean,
			default: true
		},
		variant: { default: "default" }
	},
	emits: ["click"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const menu = useContextMenu();
		const size = useContextMenuSize();
		const root = useTemplateRef("root");
		const isDestructive = computed(() => props.variant === "destructive");
		const iconColor = computed(() => isDestructive.value ? "error" : "secondary");
		function handleClick(event) {
			if (props.isDisabled) {
				event.preventDefault();
				return;
			}
			if (!(props.href != null && isModifiedClick(event))) emit("click", event);
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
		function handlePointerMove(event) {
			if (props.isDisabled || event.pointerType !== "mouse") return;
			const element = root.value;
			if (element == null || element === element.ownerDocument.activeElement) return;
			element.focus({ preventScroll: true });
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.href != null ? "a" : "div"), {
				ref_key: "root",
				ref: root,
				"aria-disabled": __props.isDisabled || void 0,
				class: normalizeClass(["astryx-context-menu-item", { "astryx-context-menu-item--destructive": isDestructive.value }]),
				"data-disabled": __props.isDisabled || void 0,
				"data-size": unref(size),
				"data-variant": __props.variant,
				href: __props.href,
				rel: __props.rel,
				role: "menuitem",
				tabindex: __props.isDisabled ? void 0 : -1,
				target: __props.target,
				onAuxclick: handleAuxClick,
				onClick: handleClick,
				onPointermove: handlePointerMove
			}, {
				default: withCtx(() => [
					__props.icon != null || _ctx.$slots.icon ? (openBlock(), createElementBlock("span", _hoisted_1$2, [renderSlot(_ctx.$slots, "icon", {}, () => [createVNode(_sfc_main$9, {
						color: iconColor.value,
						icon: __props.icon,
						size: "sm"
					}, null, 8, ["color", "icon"])])])) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_2$1, [createElementVNode("span", _hoisted_3$1, [renderSlot(_ctx.$slots, "label", {}, () => [createTextVNode(toDisplayString(__props.label), 1)])]), __props.description != null || _ctx.$slots.description ? (openBlock(), createElementBlock("span", _hoisted_4$1, [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(__props.description), 1)])])) : createCommentVNode("v-if", true)]),
					__props.endContent != null || _ctx.$slots.endContent ? (openBlock(), createElementBlock("span", _hoisted_5$1, [renderSlot(_ctx.$slots, "endContent", {}, () => [createTextVNode(toDisplayString(__props.endContent), 1)])])) : createCommentVNode("v-if", true)
				]),
				_: 3
			}, 40, [
				"aria-disabled",
				"class",
				"data-disabled",
				"data-size",
				"data-variant",
				"href",
				"rel",
				"tabindex",
				"target"
			]);
		};
	}
});
/**
* Whether a menu panel's content is taller than the panel.
*
* A menu that scrolls has to hand vertical panning to the browser so a finger
* can scroll its rows; a menu that does not scroll keeps the gesture, so the
* press model can follow the finger across rows instead of the page.
*/
function useMenuOverflow(panel, isOpen) {
	const hasOverflow = ref(false);
	let observer = null;
	function update() {
		const element = panel.value;
		hasOverflow.value = element != null && isOpen.value && element.scrollHeight > element.clientHeight;
	}
	onMounted(() => {
		if (typeof ResizeObserver === "undefined") return;
		observer = new ResizeObserver(update);
		if (panel.value != null) observer.observe(panel.value);
	});
	onBeforeUnmount(() => {
		observer?.disconnect();
		observer = null;
	});
	watch(isOpen, (open) => {
		if (open) {
			nextTick(update);
			return;
		}
		hasOverflow.value = false;
	});
	return hasOverflow;
}
var _hoisted_1$1 = [
	"aria-disabled",
	"aria-expanded",
	"data-disabled",
	"data-size",
	"tabindex"
];
var _hoisted_2 = {
	key: 0,
	class: "astryx-context-menu-item__start"
};
var _hoisted_3 = { class: "astryx-context-menu-item__content" };
var _hoisted_4 = {
	class: "astryx-context-menu-item__label",
	"data-menu-item-label": ""
};
var _hoisted_5 = {
	key: 0,
	class: "astryx-context-menu-item__description"
};
var _hoisted_6 = { class: "astryx-context-menu-item__end" };
var _hoisted_7 = [
	"aria-label",
	"data-overflow",
	"data-placement",
	"data-size"
];
var GAP$1 = 4;
var _sfc_main$2 = /*@__PURE__*/ defineComponent({
	name: "AstryxContextMenuSubMenu",
	inheritAttrs: false,
	__name: "ContextMenuSubMenu",
	props: {
		icon: {},
		label: {},
		description: {},
		isDisabled: {
			type: Boolean,
			default: false
		},
		items: {}
	},
	emits: ["openChange", "select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const attrs = useAttrs();
		const menu = useContextMenu();
		const size = useContextMenuSize();
		const row = useTemplateRef("row");
		const flyout = useTemplateRef("flyout");
		const isOpen = ref(false);
		const flyoutId = `astryx-context-menu-submenu-${useId()}`;
		const flyoutLabel = computed(() => typeof props.label === "string" ? props.label : menu?.menuLabel.value ?? "Submenu");
		const showsFlyout = computed(() => isOpen.value && (menu?.isOpen.value ?? true));
		const { position } = usePositionedLayer({
			anchor: row,
			layer: flyout,
			isOpen: showsFlyout,
			placement: computed(() => "end"),
			alignment: computed(() => "start"),
			gap: GAP$1
		});
		const flyoutStyle = computed(() => ({
			left: `${position.value.left}px`,
			top: `${position.value.top}px`
		}));
		const hasOverflow = useMenuOverflow(flyout, showsFlyout);
		const nav = useMenuNav({
			menuRef: flyout,
			onClose: (reason) => {
				if (reason === "escape") close(true);
				else menu?.closeMenu({ restoreFocus: true });
			}
		});
		function open(focusFirstRow) {
			if (props.isDisabled) return;
			if (isOpen.value) {
				if (focusFirstRow) nav.focusFirst();
				return;
			}
			isOpen.value = true;
			emit("openChange", true);
			if (focusFirstRow) nextTick(() => nav.focusFirst());
		}
		function close(focusRow) {
			if (!isOpen.value) return;
			isOpen.value = false;
			nav.resetTypeahead();
			emit("openChange", false);
			if (focusRow) row.value?.focus();
		}
		function onRowKeyDown(event) {
			if (props.isDisabled || event.isComposing) return;
			if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
				event.preventDefault();
				open(true);
				return;
			}
			close(false);
		}
		function onRowFocusOut() {
			if (!isOpen.value) return;
			nextTick(() => {
				const active = row.value?.ownerDocument.activeElement;
				if (!(active instanceof Node && (row.value?.contains(active) === true || flyout.value?.contains(active) === true))) close(false);
			});
		}
		function onFlyoutKeyDown(event) {
			if (event.isComposing) return;
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				close(true);
				return;
			}
			nav.handleKeyDown(event);
		}
		function onNestedSelect(item, event) {
			emit("select", item, event);
		}
		function onRowPointerEnter(event) {
			if (event.pointerType !== "mouse") return;
			open(false);
		}
		watch(() => menu?.isOpen.value, (open) => {
			if (open === false) close(false);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				createCommentVNode(" eslint-disable-next-line vue-a11y/interactive-supports-focus -- The dynamic tabindex is -1 while enabled, the only state that is focusable, and is removed while disabled. "),
				createElementVNode("div", mergeProps({
					ref_key: "row",
					ref: row
				}, unref(attrs), {
					"aria-controls": flyoutId,
					"aria-disabled": __props.isDisabled || void 0,
					"aria-expanded": showsFlyout.value,
					"aria-haspopup": "menu",
					class: ["astryx-context-menu-item astryx-context-menu-item--submenu", unref(attrs).class],
					"data-disabled": __props.isDisabled || void 0,
					"data-size": unref(size),
					role: "menuitem",
					style: unref(attrs).style,
					tabindex: __props.isDisabled ? void 0 : -1,
					onClick: _cache[0] || (_cache[0] = ($event) => open(false)),
					onFocusout: onRowFocusOut,
					onKeydown: onRowKeyDown,
					onPointerenter: onRowPointerEnter
				}), [
					__props.icon != null || _ctx.$slots.icon ? (openBlock(), createElementBlock("span", _hoisted_2, [renderSlot(_ctx.$slots, "icon", {}, () => [createVNode(_sfc_main$9, {
						icon: __props.icon,
						color: "secondary",
						size: "sm"
					}, null, 8, ["icon"])])])) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_3, [createElementVNode("span", _hoisted_4, [renderSlot(_ctx.$slots, "label", {}, () => [createTextVNode(toDisplayString(__props.label), 1)])]), __props.description != null || _ctx.$slots.description ? (openBlock(), createElementBlock("span", _hoisted_5, [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(__props.description), 1)])])) : createCommentVNode("v-if", true)]),
					createElementVNode("span", _hoisted_6, [renderSlot(_ctx.$slots, "endContent", {}, () => [createVNode(_sfc_main$9, {
						class: "astryx-context-menu-item__chevron",
						icon: "chevronRight",
						color: "secondary",
						size: "sm"
					})])])
				], 16, _hoisted_1$1),
				(openBlock(), createBlock(Teleport, { to: "body" }, [createVNode(Transition, {
					name: "astryx-context-menu-flyout",
					persisted: ""
				}, {
					default: withCtx(() => [withDirectives(createElementVNode("div", {
						id: flyoutId,
						ref_key: "flyout",
						ref: flyout,
						"aria-label": flyoutLabel.value,
						class: "astryx-context-menu astryx-context-menu--flyout",
						"data-overflow": unref(hasOverflow) || void 0,
						"data-placement": unref(position).placement,
						"data-size": unref(size),
						role: "menu",
						style: normalizeStyle(flyoutStyle.value),
						tabindex: "-1",
						onContextmenu: _cache[1] || (_cache[1] = withModifiers(() => {}, ["prevent"])),
						onKeydown: onFlyoutKeyDown
					}, [renderSlot(_ctx.$slots, "default", {}, () => [createVNode(_sfc_main$1, {
						items: __props.items ?? [],
						onSelect: onNestedSelect
					}, null, 8, ["items"])])], 44, _hoisted_7), [[vShow, showsFlyout.value]])]),
					_: 3
				})]))
			], 64);
		};
	}
});
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxContextMenuItems",
	__name: "ContextMenuItems",
	props: { items: {} },
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		function isDivider(option) {
			return option.type === "divider";
		}
		function isSection(option) {
			return option.type === "section";
		}
		function isSubMenu(option) {
			return option.type === void 0 && option.items != null && option.items.length > 0;
		}
		/**
		* The props a leaf row receives. `items` selects the submenu shape, `id` is
		* identity for the key rather than something the row renders, and `onClick`
		* is delivered through the row's `click` event so it runs once; everything
		* else is a row prop by construction, so the data API cannot silently drop a
		* field it advertises.
		*/
		function itemProps(option) {
			const { id: _id, items: _items, onClick: _onClick, ...rest } = option;
			return rest;
		}
		function keyOf(option, index) {
			if (option.type === "divider") return `divider-${index}`;
			if (option.type === "section") return `section-${option.id ?? index}`;
			return `item-${option.id ?? index}`;
		}
		function onRowClick(option, event) {
			if (option.type !== void 0) return;
			option.onClick?.(event);
			emit("select", option, event);
		}
		function onNestedSelect(item, event) {
			emit("select", item, event);
		}
		return (_ctx, _cache) => {
			const _component_ContextMenuItems = resolveComponent("ContextMenuItems", true);
			return openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (option, index) => {
				return openBlock(), createElementBlock(Fragment, { key: keyOf(option, index) }, [isDivider(option) ? (openBlock(), createBlock(_sfc_main$5, { key: 0 })) : isSection(option) ? (openBlock(), createBlock(_sfc_main$4, {
					key: 1,
					title: option.title
				}, {
					default: withCtx(() => [createVNode(_component_ContextMenuItems, {
						items: option.items,
						onSelect: onNestedSelect
					}, null, 8, ["items"])]),
					_: 2
				}, 1032, ["title"])) : isSubMenu(option) ? (openBlock(), createBlock(_sfc_main$2, {
					key: 2,
					icon: option.icon,
					"is-disabled": option.isDisabled,
					items: option.items,
					label: option.label,
					onSelect: onNestedSelect
				}, null, 8, [
					"icon",
					"is-disabled",
					"items",
					"label"
				])) : (openBlock(), createBlock(_sfc_main$3, mergeProps({
					key: 3,
					ref_for: true
				}, itemProps(option), { onClick: ($event) => onRowClick(option, $event) }), null, 16, ["onClick"]))], 64);
			}), 128);
		};
	}
});
var DEFAULT_DELAY_MS = 500;
var DEFAULT_MOVE_CANCEL_PX = 10;
/**
* Detect a single-finger long press.
*
* iOS Safari never synthesizes a `contextmenu` event for a held finger, so a
* long press is the only touch affordance that can open a cursor-positioned
* surface. The press is cancelled when the finger travels past the tolerance,
* lifts, or the touch is cancelled.
*/
function useLongPress(options) {
	const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
	const moveCancelPx = options.moveCancelPx ?? DEFAULT_MOVE_CANCEL_PX;
	let timer = null;
	let origin = null;
	function cancel() {
		if (timer != null) {
			clearTimeout(timer);
			timer = null;
		}
		origin = null;
	}
	function start(point) {
		if (toValue(options.isDisabled)) return;
		cancel();
		origin = {
			x: point.x,
			y: point.y
		};
		timer = setTimeout(() => {
			const from = origin;
			timer = null;
			if (from == null) return;
			options.onLongPress({
				x: from.x,
				y: from.y
			});
		}, delayMs);
	}
	function moveTo(point) {
		if (origin == null) return false;
		if (Math.abs(point.x - origin.x) > moveCancelPx || Math.abs(point.y - origin.y) > moveCancelPx) {
			cancel();
			return false;
		}
		return true;
	}
	onBeforeUnmount(cancel);
	return {
		cancel,
		moveTo,
		start
	};
}
/** How long after a tracked release the browser's own click is still swallowed. */
var STRAY_CLICK_MS = 400;
var swallower = null;
function disarmStrayClick() {
	if (swallower == null) return;
	swallower.isArmed = false;
	if (swallower.timer != null) {
		clearTimeout(swallower.timer);
		swallower.timer = null;
	}
}
function onWindowClickCapture(event) {
	if (swallower == null || !swallower.isArmed) return;
	if (event.detail === 0) return;
	event.preventDefault();
	event.stopImmediatePropagation();
	disarmStrayClick();
}
/**
* Swallow the browser's compatibility click for a gesture the press model
* already acted on. The listener sits on the window in the capture phase, so
* it runs ahead of any listener the application or the row itself installed.
*/
function armStrayClick(doc) {
	const view = doc.defaultView;
	if (view == null) return;
	if (swallower == null || swallower.doc !== doc) {
		if (swallower != null) {
			swallower.doc.defaultView?.removeEventListener("click", onWindowClickCapture, true);
			swallower.doc.removeEventListener("pointerdown", disarmStrayClick, true);
		}
		view.addEventListener("click", onWindowClickCapture, true);
		doc.addEventListener("pointerdown", disarmStrayClick, true);
		swallower = {
			doc,
			isArmed: false,
			timer: null
		};
	}
	disarmStrayClick();
	swallower.isArmed = true;
	swallower.timer = setTimeout(disarmStrayClick, STRAY_CLICK_MS);
}
/** Forget an armed swallower. Called when a surface unmounts and in tests. */
function resetMenuPress() {
	disarmStrayClick();
}
/**
* The press model of a painted menu surface.
*
* A finger's pointer events stay with the element it landed on, so the gesture
* is tracked at the document level by `pointerId`:
*
* - The highlight follows the finger.
* - The row under the RELEASE acts, the way its own click would, carrying the
*   release's modifiers; the browser's own click for that gesture is swallowed
*   so the row never acts twice.
* - A finger released outside leaves the menu open; a mouse released outside
*   dismisses it.
* - `pointercancel` and a second pointer end the gesture with nothing acting.
*/
function useMenuPress(options) {
	const { menuRef, isEnabled, onDismiss } = options;
	let trackedId = null;
	let trackedIsMouse = false;
	let highlighted = null;
	let doc = null;
	function isRowInsideMenu(row) {
		const menu = menuRef.value;
		return row instanceof HTMLElement && menu != null && menu.contains(row) && row.closest("[role=\"menu\"]") === menu;
	}
	function rowFromEvent(event) {
		const hit = doc?.elementFromPoint?.(event.clientX, event.clientY) ?? null;
		const fromPoint = hit instanceof Element ? hit.closest(MENU_ITEM_SELECTOR) : null;
		if (fromPoint != null && isRowInsideMenu(fromPoint)) return fromPoint;
		const target = event.target;
		const fromTarget = target instanceof Element ? target.closest(MENU_ITEM_SELECTOR) : null;
		return fromTarget != null && isRowInsideMenu(fromTarget) ? fromTarget : null;
	}
	function isEventInsideMenu(event) {
		const menu = menuRef.value;
		if (menu == null) return false;
		const hit = doc?.elementFromPoint?.(event.clientX, event.clientY) ?? null;
		if (hit instanceof Node && menu.contains(hit)) return true;
		const target = event.target;
		return target instanceof Node && menu.contains(target);
	}
	function highlight(row) {
		if (row === highlighted) return;
		highlighted = row;
		row?.focus({ preventScroll: true });
	}
	function onDocumentPointerMove(event) {
		if (event.pointerId !== trackedId) return;
		const row = rowFromEvent(event);
		if (row != null) highlight(row);
	}
	function onDocumentPointerUp(event) {
		if (event.pointerId !== trackedId) return;
		const row = rowFromEvent(event);
		endGesture();
		if (row == null) return;
		if (doc != null) armStrayClick(doc);
		activateMenuItem(row, event);
	}
	function onDocumentPointerCancel(event) {
		if (event.pointerId !== trackedId) return;
		endGesture();
	}
	function onDocumentMouseUp(event) {
		const isInside = isEventInsideMenu(event);
		endGesture();
		if (!isInside) onDismiss();
	}
	function endGesture() {
		const current = doc;
		if (current != null) {
			current.removeEventListener("pointermove", onDocumentPointerMove, true);
			current.removeEventListener("pointerup", onDocumentPointerUp, true);
			current.removeEventListener("pointercancel", onDocumentPointerCancel, true);
			current.removeEventListener("mouseup", onDocumentMouseUp, true);
		}
		trackedId = null;
		trackedIsMouse = false;
		highlighted = null;
	}
	function onPointerDown(event) {
		if (!isEnabled()) return;
		if (trackedId != null) endGesture();
		const target = event.target;
		const row = target instanceof Element ? target.closest(MENU_ITEM_SELECTOR) : null;
		if (row == null || !isRowInsideMenu(row)) return;
		highlighted = row;
		trackedId = event.pointerId;
		trackedIsMouse = event.pointerType === "mouse";
		doc = menuRef.value?.ownerDocument ?? null;
		if (trackedIsMouse) {
			doc?.addEventListener("mouseup", onDocumentMouseUp, true);
			return;
		}
		doc?.addEventListener("pointermove", onDocumentPointerMove, true);
		doc?.addEventListener("pointerup", onDocumentPointerUp, true);
		doc?.addEventListener("pointercancel", onDocumentPointerCancel, true);
	}
	onBeforeUnmount(endGesture);
	return { onPointerDown };
}
var _hoisted_1 = [
	"aria-label",
	"data-overflow",
	"data-placement",
	"data-size",
	"data-width"
];
var GAP = 0;
var DEFAULT_MIN_WIDTH = 160;
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxContextMenu",
	inheritAttrs: false,
	__name: "ContextMenu",
	props: /*@__PURE__*/ mergeModels({
		items: {},
		menuWidth: {},
		size: { default: "md" },
		label: { default: "Context menu" },
		isDisabled: {
			type: Boolean,
			default: false
		},
		triggerAs: { default: "div" },
		isOpen: { type: Boolean }
	}, {
		"isOpen": {
			type: Boolean,
			default: void 0
		},
		"isOpenModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels([
		"openChange",
		"select",
		"update:isOpen"
	], ["update:isOpen"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const attrs = useAttrs();
		/**
		* `class` and `style` describe the painted menu surface, the way upstream's
		* `className`/`style` do; everything else describes the trigger area.
		*/
		const triggerAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
		/** Where the menu's own corner sits relative to the cursor point. */
		const openModel = useModel(__props, "isOpen");
		const localIsOpen = ref(false);
		const isOpen = computed(() => openModel.value ?? localIsOpen.value);
		const menuId = `astryx-context-menu-${useId()}`;
		const trigger = useTemplateRef("trigger");
		const cursorAnchor = useTemplateRef("cursorAnchor");
		const panel = useTemplateRef("panel");
		const cursorPoint = ref({
			x: 0,
			y: 0
		});
		let previouslyFocused = null;
		const { position, update: updatePosition } = usePositionedLayer({
			anchor: cursorAnchor,
			layer: panel,
			isOpen,
			placement: computed(() => "below"),
			alignment: computed(() => "start"),
			gap: GAP
		});
		const nav = useMenuNav({
			menuRef: panel,
			onClose: () => closeMenu({ restoreFocus: true })
		});
		const hasOverflow = useMenuOverflow(panel, isOpen);
		const menuPress = useMenuPress({
			menuRef: panel,
			isEnabled: () => isOpen.value,
			onDismiss: () => closeMenu()
		});
		const longPress = useLongPress({
			isDisabled: () => props.isDisabled,
			onLongPress: (point) => {
				const rect = trigger.value?.getBoundingClientRect();
				openAt(rect == null ? point.x : point.x - rect.left, rect == null ? point.y : point.y - rect.top);
			}
		});
		function formatSize(value) {
			return typeof value === "number" ? `${value}px` : value;
		}
		const panelStyle = computed(() => {
			const style = {
				"left": `${position.value.left}px`,
				"top": `${position.value.top}px`,
				"--_context-menu-min-width": formatSize(props.menuWidth ?? DEFAULT_MIN_WIDTH)
			};
			if (props.menuWidth != null) style["--_context-menu-width"] = formatSize(props.menuWidth);
			return style;
		});
		function restoreFocus() {
			const target = previouslyFocused;
			previouslyFocused = null;
			if (target != null && target.isConnected) target.focus();
		}
		function focusPanelOrFirstRow() {
			if (!nav.focusFirst()) panel.value?.focus({ preventScroll: true });
		}
		function attachDismissListeners() {
			const doc = panel.value?.ownerDocument;
			doc?.addEventListener("mousedown", onDocumentMouseDown);
			doc?.addEventListener("keydown", onDocumentKeydown);
		}
		function detachDismissListeners() {
			const doc = panel.value?.ownerDocument;
			doc?.removeEventListener("mousedown", onDocumentMouseDown);
			doc?.removeEventListener("keydown", onDocumentKeydown);
		}
		function setOpen(next) {
			if (isOpen.value === next) return;
			openModel.value = next;
			localIsOpen.value = next;
			emit("openChange", next);
		}
		/** Close the menu, optionally handing focus back to where it was before. */
		function closeMenu(options = {}) {
			if (!isOpen.value) return;
			const active = panel.value?.ownerDocument.activeElement;
			const hadFocus = active != null && panel.value?.contains(active) === true;
			setOpen(false);
			if (options.restoreFocus === true || hadFocus) restoreFocus();
		}
		/**
		* Place the zero-size cursor anchor at a point in the trigger's local space and
		* open the menu there. Anchoring inside the trigger, rather than storing
		* viewport coordinates on the panel, is what makes the menu follow its content
		* on scroll and flip against the viewport edges.
		*/
		function openAt(localX, localY) {
			cursorPoint.value = {
				x: localX,
				y: localY
			};
			previouslyFocused = trigger.value?.ownerDocument.activeElement instanceof HTMLElement ? trigger.value.ownerDocument.activeElement : null;
			setOpen(true);
		}
		function onTriggerContextMenu(event) {
			if (props.isDisabled) return;
			event.preventDefault();
			const rect = trigger.value?.getBoundingClientRect();
			const isKeyboardInvoked = event.clientX === 0 && event.clientY === 0 && event.detail === 0;
			openAt(isKeyboardInvoked || rect == null ? 0 : event.clientX - rect.left, isKeyboardInvoked || rect == null ? rect?.height ?? 0 : event.clientY - rect.top);
		}
		function onTriggerPointerDown(event) {
			if (event.pointerType === "mouse") return;
			longPress.start({
				x: event.clientX,
				y: event.clientY
			});
		}
		function onTriggerPointerMove(event) {
			if (event.pointerType === "mouse") return;
			longPress.moveTo({
				x: event.clientX,
				y: event.clientY
			});
		}
		function onDocumentMouseDown(event) {
			const target = event.target;
			if (panel.value != null && target instanceof Node && panel.value.contains(target)) return;
			closeMenu();
		}
		function onDocumentKeydown(event) {
			if (event.key !== "Escape" || event.isComposing || !isOpen.value) return;
			const target = event.target;
			if (target instanceof Element) {
				const owner = target.closest(MENU_BOUNDARY_SELECTOR);
				if (owner != null && owner !== panel.value) return;
			}
			event.preventDefault();
			closeMenu({ restoreFocus: true });
		}
		function onSelect(item, event) {
			emit("select", item, event);
		}
		provide(contextMenuContextKey, {
			closeMenu,
			isOpen,
			menuLabel: computed(() => props.label),
			menuSize: computed(() => props.size)
		});
		function applyOpenState(next) {
			if (next) {
				attachDismissListeners();
				updatePosition();
				nextTick(focusPanelOrFirstRow);
				return;
			}
			detachDismissListeners();
			nav.resetTypeahead();
		}
		watch(isOpen, applyOpenState);
		onMounted(() => {
			if (isOpen.value) applyOpenState(true);
		});
		watch(() => props.isDisabled, (isDisabled) => {
			if (isDisabled) closeMenu();
		});
		onBeforeUnmount(() => {
			detachDismissListeners();
			resetMenuPress();
		});
		__expose({
			blur: () => trigger.value?.blur(),
			close: () => closeMenu({ restoreFocus: true }),
			element: computed(() => trigger.value ?? null),
			focus: () => trigger.value?.focus(),
			open: () => openAt(0, 0)
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [(openBlock(), createBlock(resolveDynamicComponent(__props.triggerAs === "span" ? "span" : "div"), mergeProps({
				ref_key: "trigger",
				ref: trigger
			}, triggerAttrs.value, {
				class: "astryx-context-menu-trigger",
				"data-disabled": __props.isDisabled || void 0,
				"data-open": isOpen.value ? "open" : void 0,
				onContextmenu: onTriggerContextMenu,
				onPointercancel: unref(longPress).cancel,
				onPointerdown: onTriggerPointerDown,
				onPointermove: onTriggerPointerMove,
				onPointerup: unref(longPress).cancel
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default"), createElementVNode("span", {
					ref_key: "cursorAnchor",
					ref: cursorAnchor,
					"aria-hidden": "true",
					class: "astryx-context-menu-anchor",
					style: normalizeStyle({
						left: `${cursorPoint.value.x}px`,
						top: `${cursorPoint.value.y}px`
					})
				}, null, 4)]),
				_: 3
			}, 16, [
				"data-disabled",
				"data-open",
				"onPointercancel",
				"onPointerup"
			])), (openBlock(), createBlock(Teleport, { to: "body" }, [createVNode(Transition, {
				name: "astryx-context-menu",
				persisted: ""
			}, {
				default: withCtx(() => [withDirectives(createElementVNode("div", {
					id: menuId,
					ref_key: "panel",
					ref: panel,
					"aria-label": __props.label,
					class: normalizeClass(["astryx-context-menu", unref(attrs).class]),
					"data-overflow": unref(hasOverflow) || void 0,
					"data-placement": unref(position).placement,
					"data-size": __props.size,
					"data-width": __props.menuWidth != null ? "custom" : void 0,
					"data-astryx-menu-press": "",
					role: "menu",
					style: normalizeStyle([panelStyle.value, unref(attrs).style]),
					tabindex: "-1",
					onContextmenu: _cache[0] || (_cache[0] = withModifiers(() => {}, ["prevent"])),
					onKeydown: _cache[1] || (_cache[1] = (...args) => unref(nav).handleKeyDown && unref(nav).handleKeyDown(...args)),
					onPointerdown: _cache[2] || (_cache[2] = (...args) => unref(menuPress).onPointerDown && unref(menuPress).onPointerDown(...args))
				}, [__props.items != null ? (openBlock(), createBlock(_sfc_main$1, {
					key: 0,
					items: __props.items,
					onSelect
				}, null, 8, ["items"])) : renderSlot(_ctx.$slots, "content", {}, void 0, void 0, 1)], 46, _hoisted_1), [[vShow, isOpen.value]])]),
				_: 3
			})]))], 64);
		};
	}
});
//#endregion
//#region components/demos/context-menu/basic.vue?vue&type=script&setup=true&lang.ts
var LAST_ACTION_NONE = "No action yet";
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const lastAction = ref(LAST_ACTION_NONE);
		const items = [
			{
				label: "Cut",
				icon: "css-icon css-icon--sm i-carbon-cut"
			},
			{
				label: "Copy",
				icon: "css-icon css-icon--sm i-carbon-copy"
			},
			{
				label: "Paste",
				isDisabled: true
			},
			{ type: "divider" },
			{
				type: "section",
				title: "Share",
				items: [{ label: "Copy link" }, { label: "Email" }]
			},
			{ type: "divider" },
			{
				label: "Delete",
				variant: "destructive"
			}
		];
		function onSelect(item) {
			if (item.type === void 0) lastAction.value = item.label;
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "context-menu-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				label: "Clipboard actions",
				onSelect
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$7), { padding: 6 }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(unref(_sfc_main$6), {
								as: "div",
								color: "secondary"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Right-click this card. `);
									else return [createTextVNode(" Right-click this card. ")];
								}),
								_: 1
							}, _parent, _scopeId));
							else return [createVNode(unref(_sfc_main$6), {
								as: "div",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Right-click this card. ")]),
								_: 1
							})];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$7), { padding: 6 }, {
						default: withCtx(() => [createVNode(unref(_sfc_main$6), {
							as: "div",
							color: "secondary"
						}, {
							default: withCtx(() => [createTextVNode(" Right-click this card. ")]),
							_: 1
						})]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`<p class="context-menu-preview__result"> Last action: ${ssrInterpolate(lastAction.value)}</p></div>`);
		};
	}
});
//#endregion
//#region components/demos/context-menu/basic.vue
var _sfc_setup$3 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/context-menu/basic.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/context-menu/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport type { ContextMenuOption } from '@astryx-vue/core/ContextMenu'\nimport { Card } from '@astryx-vue/core/Card'\nimport { ContextMenu } from '@astryx-vue/core/ContextMenu'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst LAST_ACTION_NONE = 'No action yet'\n\nconst lastAction = ref(LAST_ACTION_NONE)\n\nconst items: ContextMenuOption[] = [\n  { label: 'Cut', icon: 'css-icon css-icon--sm i-carbon-cut' },\n  { label: 'Copy', icon: 'css-icon css-icon--sm i-carbon-copy' },\n  { label: 'Paste', isDisabled: true },\n  { type: 'divider' },\n  { type: 'section', title: 'Share', items: [{ label: 'Copy link' }, { label: 'Email' }] },\n  { type: 'divider' },\n  { label: 'Delete', variant: 'destructive' },\n]\n\nfunction onSelect(item: ContextMenuOption): void {\n  if (item.type === undefined)\n    lastAction.value = item.label\n}\n<\/script>\n\n<template>\n  <div class=\"context-menu-preview\">\n    <ContextMenu :items=\"items\" label=\"Clipboard actions\" @select=\"onSelect\">\n      <Card :padding=\"6\">\n        <Text as=\"div\" color=\"secondary\">\n          Right-click this card.\n        </Text>\n      </Card>\n    </ContextMenu>\n    <p class=\"context-menu-preview__result\">\n      Last action: {{ lastAction }}\n    </p>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ContextMenuOption } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/ContextMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Card } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Card'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ContextMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/ContextMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> LAST_ACTION_NONE</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'No action yet'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> lastAction</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">LAST_ACTION_NONE</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> items</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ContextMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Cut'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-cut'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Copy'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-copy'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Paste'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, isDisabled: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'divider'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'section'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, title: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Share'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, items: [{ label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Copy link'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }, { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Email'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }] },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'divider'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Delete'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, variant: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'destructive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> onSelect</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">item</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ContextMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">  if</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> (item.type </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">===</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> undefined</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    lastAction.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> item.label</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"context-menu-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Clipboard actions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">select</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">onSelect</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Card</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">6</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> as</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"div\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Right-click this card.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Card</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"context-menu-preview__result\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Last action: {{ lastAction }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/context-menu/compound.vue?vue&type=script&setup=true&lang.ts
var compound_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "compound",
	__ssrInlineRender: true,
	setup(__props) {
		const copied = ref(false);
		function copyLink() {
			copied.value = true;
			window.setTimeout(() => {
				copied.value = false;
			}, 2e3);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "context-menu-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), { label: "Item actions" }, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$3), { label: "Rename" }, {
							icon: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-tools"${_scopeId}></span>`);
								else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-tools" })];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$3), {
							label: "Copy link",
							"end-content": copied.value ? "Copied" : void 0,
							"has-close-on-select": false,
							onClick: copyLink
						}, {
							icon: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-copy"${_scopeId}></span>`);
								else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-copy" })];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$5), null, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$4), { title: "Version history" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main$2), { label: "Versions" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(ssrRenderComponent(unref(_sfc_main$3), { label: "Restore this version" }, null, _parent, _scopeId));
											_push(ssrRenderComponent(unref(_sfc_main$3), { label: "Compare with current" }, null, _parent, _scopeId));
										} else return [createVNode(unref(_sfc_main$3), { label: "Restore this version" }), createVNode(unref(_sfc_main$3), { label: "Compare with current" })];
									}),
									_: 1
								}, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main$2), { label: "Versions" }, {
									default: withCtx(() => [createVNode(unref(_sfc_main$3), { label: "Restore this version" }), createVNode(unref(_sfc_main$3), { label: "Compare with current" })]),
									_: 1
								})];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$5), null, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$3), {
							label: "Delete",
							variant: "destructive"
						}, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$3), { label: "Rename" }, {
							icon: withCtx(() => [createVNode("span", { class: "css-icon css-icon--sm i-carbon-tools" })]),
							_: 1
						}),
						createVNode(unref(_sfc_main$3), {
							label: "Copy link",
							"end-content": copied.value ? "Copied" : void 0,
							"has-close-on-select": false,
							onClick: copyLink
						}, {
							icon: withCtx(() => [createVNode("span", { class: "css-icon css-icon--sm i-carbon-copy" })]),
							_: 1
						}, 8, ["end-content"]),
						createVNode(unref(_sfc_main$5)),
						createVNode(unref(_sfc_main$4), { title: "Version history" }, {
							default: withCtx(() => [createVNode(unref(_sfc_main$2), { label: "Versions" }, {
								default: withCtx(() => [createVNode(unref(_sfc_main$3), { label: "Restore this version" }), createVNode(unref(_sfc_main$3), { label: "Compare with current" })]),
								_: 1
							})]),
							_: 1
						}),
						createVNode(unref(_sfc_main$5)),
						createVNode(unref(_sfc_main$3), {
							label: "Delete",
							variant: "destructive"
						})
					];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$7), { padding: 6 }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(unref(_sfc_main$6), {
								as: "div",
								color: "secondary"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Right-click this card for a menu composed from menu components. `);
									else return [createTextVNode(" Right-click this card for a menu composed from menu components. ")];
								}),
								_: 1
							}, _parent, _scopeId));
							else return [createVNode(unref(_sfc_main$6), {
								as: "div",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Right-click this card for a menu composed from menu components. ")]),
								_: 1
							})];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$7), { padding: 6 }, {
						default: withCtx(() => [createVNode(unref(_sfc_main$6), {
							as: "div",
							color: "secondary"
						}, {
							default: withCtx(() => [createTextVNode(" Right-click this card for a menu composed from menu components. ")]),
							_: 1
						})]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/context-menu/compound.vue
var _sfc_setup$2 = compound_vue_vue_type_script_setup_true_lang_default.setup;
compound_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/context-menu/compound.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var compound_default$1 = compound_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/context-menu/compound.vue?raw&highlighted
var compound_default = {
	"source": "<script setup lang=\"ts\">\nimport { Card } from '@astryx-vue/core/Card'\nimport { ContextMenu, ContextMenuDivider, ContextMenuGroup, ContextMenuItem, ContextMenuSubMenu } from '@astryx-vue/core/ContextMenu'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst copied = ref(false)\n\nfunction copyLink(): void {\n  copied.value = true\n  window.setTimeout(() => {\n    copied.value = false\n  }, 2000)\n}\n<\/script>\n\n<template>\n  <div class=\"context-menu-preview\">\n    <ContextMenu label=\"Item actions\">\n      <Card :padding=\"6\">\n        <Text as=\"div\" color=\"secondary\">\n          Right-click this card for a menu composed from menu components.\n        </Text>\n      </Card>\n      <template #content>\n        <ContextMenuItem label=\"Rename\">\n          <template #icon>\n            <span class=\"css-icon css-icon--sm i-carbon-tools\" />\n          </template>\n        </ContextMenuItem>\n        <ContextMenuItem\n          label=\"Copy link\"\n          :end-content=\"copied ? 'Copied' : undefined\"\n          :has-close-on-select=\"false\"\n          @click=\"copyLink\"\n        >\n          <template #icon>\n            <span class=\"css-icon css-icon--sm i-carbon-copy\" />\n          </template>\n        </ContextMenuItem>\n        <ContextMenuDivider />\n        <ContextMenuGroup title=\"Version history\">\n          <ContextMenuSubMenu label=\"Versions\">\n            <ContextMenuItem label=\"Restore this version\" />\n            <ContextMenuItem label=\"Compare with current\" />\n          </ContextMenuSubMenu>\n        </ContextMenuGroup>\n        <ContextMenuDivider />\n        <ContextMenuItem label=\"Delete\" variant=\"destructive\" />\n      </template>\n    </ContextMenu>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Card } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Card'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ContextMenu, ContextMenuDivider, ContextMenuGroup, ContextMenuItem, ContextMenuSubMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/ContextMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> copied</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> copyLink</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">()</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  copied.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> true</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  window.</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">setTimeout</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(() </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    copied.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> false</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  }, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2000</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"context-menu-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenu</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Item actions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Card</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">6</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> as</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"div\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Right-click this card for a menu composed from menu components.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Card</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Rename\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-tools\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Copy link\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">end-content</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">copied </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Copied'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> :</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> undefined</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">has-close-on-select</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">copyLink</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-copy\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuDivider</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Version history\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuSubMenu</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Versions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Restore this version\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Compare with current\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuSubMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuGroup</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuDivider</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Delete\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"destructive\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/context-menu/overview.vue?vue&type=script&setup=true&lang.ts
var overview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "overview",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "context-menu-preview" }, _attrs))}><div class="context-menu-preview__stage"><div aria-label="Context menu" class="astryx-context-menu context-menu-preview__surface" role="menu">`);
			_push(ssrRenderComponent(unref(_sfc_main$3), {
				description: "Open this row in the editor",
				label: "Edit"
			}, {
				icon: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-tools"${_scopeId}></span>`);
					else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-tools" })];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$3), { label: "Duplicate" }, {
				icon: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-copy"${_scopeId}></span>`);
					else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-copy" })];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$5), null, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$3), {
				label: "Delete",
				variant: "destructive"
			}, null, _parent));
			_push(`</div><p class="context-menu-preview__hint"> The panel opens at the pointer, right where the action is needed: on a right-click, on the context-menu key, or on a long press. </p></div></div>`);
		};
	}
});
//#endregion
//#region components/demos/context-menu/overview.vue
var _sfc_setup$1 = overview_vue_vue_type_script_setup_true_lang_default.setup;
overview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/context-menu/overview.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var overview_default$1 = overview_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/context-menu/overview.vue?raw&highlighted
var overview_default = {
	"source": "<script setup lang=\"ts\">\nimport { ContextMenuDivider, ContextMenuItem } from '@astryx-vue/core/ContextMenu'\n<\/script>\n\n<template>\n  <div class=\"context-menu-preview\">\n    <div class=\"context-menu-preview__stage\">\n      <div\n        aria-label=\"Context menu\"\n        class=\"astryx-context-menu context-menu-preview__surface\"\n        role=\"menu\"\n      >\n        <ContextMenuItem description=\"Open this row in the editor\" label=\"Edit\">\n          <template #icon>\n            <span class=\"css-icon css-icon--sm i-carbon-tools\" />\n          </template>\n        </ContextMenuItem>\n        <ContextMenuItem label=\"Duplicate\">\n          <template #icon>\n            <span class=\"css-icon css-icon--sm i-carbon-copy\" />\n          </template>\n        </ContextMenuItem>\n        <ContextMenuDivider />\n        <ContextMenuItem label=\"Delete\" variant=\"destructive\" />\n      </div>\n      <p class=\"context-menu-preview__hint\">\n        The panel opens at the pointer, right where the action is needed: on a right-click, on the\n        context-menu key, or on a long press.\n      </p>\n    </div>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ContextMenuDivider, ContextMenuItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/ContextMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"context-menu-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"context-menu-preview__stage\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        aria-label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Context menu\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"astryx-context-menu context-menu-preview__surface\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        role</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"menu\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Open this row in the editor\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Edit\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-tools\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Duplicate\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">            &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-copy\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuDivider</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenuItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Delete\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"destructive\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"context-menu-preview__hint\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        The panel opens at the pointer, right where the action is needed: on a right-click, on the</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        context-menu key, or on a long press.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/context-menu/submenu.vue?vue&type=script&setup=true&lang.ts
var submenu_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "submenu",
	__ssrInlineRender: true,
	setup(__props) {
		const items = [
			{
				label: "Open",
				icon: "css-icon css-icon--sm i-carbon-launch"
			},
			{
				label: "Copy address",
				icon: "css-icon css-icon--sm i-carbon-copy"
			},
			{ type: "divider" },
			{
				label: "Move to",
				items: [
					{ label: "Inbox" },
					{ label: "Archive" },
					{
						label: "Later",
						items: [{ label: "Tomorrow" }, { label: "Next week" }]
					}
				]
			},
			{
				label: "Labels",
				items: [{ label: "Design" }, { label: "Engineering" }]
			}
		];
		const lastMove = ref("Nowhere yet");
		function onSelect(item) {
			if (item.type === void 0) lastMove.value = item.label;
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "context-menu-preview" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				label: "Message actions",
				onSelect
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$7), { padding: 6 }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(unref(_sfc_main$6), {
								as: "div",
								color: "secondary"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Right-click this card, then open a nested menu with the arrow keys or by hovering it. `);
									else return [createTextVNode(" Right-click this card, then open a nested menu with the arrow keys or by hovering it. ")];
								}),
								_: 1
							}, _parent, _scopeId));
							else return [createVNode(unref(_sfc_main$6), {
								as: "div",
								color: "secondary"
							}, {
								default: withCtx(() => [createTextVNode(" Right-click this card, then open a nested menu with the arrow keys or by hovering it. ")]),
								_: 1
							})];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$7), { padding: 6 }, {
						default: withCtx(() => [createVNode(unref(_sfc_main$6), {
							as: "div",
							color: "secondary"
						}, {
							default: withCtx(() => [createTextVNode(" Right-click this card, then open a nested menu with the arrow keys or by hovering it. ")]),
							_: 1
						})]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`<p class="context-menu-preview__result"> Last action: ${ssrInterpolate(lastMove.value)}</p></div>`);
		};
	}
});
//#endregion
//#region components/demos/context-menu/submenu.vue
var _sfc_setup = submenu_vue_vue_type_script_setup_true_lang_default.setup;
submenu_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/context-menu/submenu.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var submenu_default$1 = submenu_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/context-menu/submenu.vue?raw&highlighted
var submenu_default = {
	"source": "<script setup lang=\"ts\">\nimport type { ContextMenuOption } from '@astryx-vue/core/ContextMenu'\nimport { Card } from '@astryx-vue/core/Card'\nimport { ContextMenu } from '@astryx-vue/core/ContextMenu'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst items: ContextMenuOption[] = [\n  { label: 'Open', icon: 'css-icon css-icon--sm i-carbon-launch' },\n  { label: 'Copy address', icon: 'css-icon css-icon--sm i-carbon-copy' },\n  { type: 'divider' },\n  {\n    label: 'Move to',\n    items: [\n      { label: 'Inbox' },\n      { label: 'Archive' },\n      { label: 'Later', items: [{ label: 'Tomorrow' }, { label: 'Next week' }] },\n    ],\n  },\n  { label: 'Labels', items: [{ label: 'Design' }, { label: 'Engineering' }] },\n]\n\nconst lastMove = ref('Nowhere yet')\n\nfunction onSelect(item: ContextMenuOption): void {\n  if (item.type === undefined)\n    lastMove.value = item.label\n}\n<\/script>\n\n<template>\n  <div class=\"context-menu-preview\">\n    <ContextMenu :items=\"items\" label=\"Message actions\" @select=\"onSelect\">\n      <Card :padding=\"6\">\n        <Text as=\"div\" color=\"secondary\">\n          Right-click this card, then open a nested menu with the arrow keys or by hovering it.\n        </Text>\n      </Card>\n    </ContextMenu>\n    <p class=\"context-menu-preview__result\">\n      Last action: {{ lastMove }}\n    </p>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ContextMenuOption } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/ContextMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Card } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Card'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ContextMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/ContextMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> items</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ContextMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Open'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-launch'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Copy address'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-copy'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'divider'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Move to'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    items: [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Inbox'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Archive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Later'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, items: [{ label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Tomorrow'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }, { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Next week'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }] },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    ],</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Labels'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, items: [{ label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Design'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }, { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Engineering'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }] },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> lastMove</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Nowhere yet'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> onSelect</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">item</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ContextMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">  if</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> (item.type </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">===</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> undefined</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    lastMove.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> item.label</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"context-menu-preview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Message actions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">select</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">onSelect</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Card</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">padding</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">6</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> as</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"div\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          Right-click this card, then open a nested menu with the arrow keys or by hovering it.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Card</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ContextMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"context-menu-preview__result\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Last action: {{ lastMove }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/context-menu/index.ts
var options = { className: "context-menu-preview" };
var contextMenuOverview = defineDemo(overview_default$1, overview_default, options);
var contextMenuBasic = defineDemo(basic_default$1, basic_default, options);
var contextMenuCompound = defineDemo(compound_default$1, compound_default, options);
var contextMenuSubmenu = defineDemo(submenu_default$1, submenu_default, options);
//#endregion
export { contextMenuSubmenu as i, contextMenuCompound as n, contextMenuOverview as r, contextMenuBasic as t };
