import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { n as getFocusables, t as focusElement } from "./focus-CpficIgf.CTu7RTTj.js";
import { t as _sfc_main$5 } from "./Heading-Dugosn6j.Cm6J24eA.js";
import { t as _sfc_main$6 } from "./Text-CKd7e3gK.CukfIJwc.js";
import { t as _sfc_main$7 } from "./IconButton-BNQuz9W_.CvHMrKbO.js";
import { t as _sfc_main$8 } from "./Stack-iv52y_Jv.C5zk9p8n.js";
import { n as _sfc_main$1$10, t as _sfc_main$9 } from "./ListItem-pGxvn6QJ.Do9DWm4p.js";
import { t as _sfc_main$11 } from "./Divider-BtwnL18I.BzWZDGLo.js";
import { t as _sfc_main$10 } from "./Icon-B6qNgBP9.DVAnMRiH.js";
import { t as usePositionedLayer } from "./usePositionedLayer-C1NBOsVT.CqLwBJaO.js";
import { Fragment, Teleport, Transition, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, inject, mergeModels, mergeProps, nextTick, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, openBlock, provide, ref, renderList, renderSlot, resolveComponent, resolveDynamicComponent, shallowRef, toDisplayString, unref, useId, useModel, useSSRContext, useTemplateRef, watch, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region ../../packages/core/dist/MoreMenu-BNVmWbvU.js
var moreMenuContextKey = Symbol("astryx-more-menu");
/** The surrounding menu, or `undefined` when a row stands alone. */
function useMoreMenuContext() {
	return inject(moreMenuContextKey, void 0);
}
/** The row density of the surrounding menu, or the menu default. */
function useMoreMenuSize() {
	const menu = useMoreMenuContext();
	return computed(() => menu?.menuSize.value ?? "md");
}
var moreMenuLevelKey = Symbol("astryx-more-menu-level");
/** The level a row is rendered in, or `undefined` when a row stands alone. */
function useMoreMenuLevel() {
	return inject(moreMenuLevelKey, void 0);
}
/** Whether an option is a hairline between groups of rows. */
function isDividerOption(option) {
	return "type" in option && option.type === "divider";
}
/** Whether an option is a titled group of rows. */
function isSectionOption(option) {
	return "type" in option && option.type === "section";
}
/** Whether a row reveals a flyout of its own instead of acting. */
function isSubmenuItem(item) {
	return item.items != null && item.items.length > 0;
}
/** Selector for the activatable rows of one menu level. */
var MENU_ITEM_SELECTOR = [.../* @__PURE__ */ new Set([
	"menuitem",
	"menuitemradio",
	"menuitemcheckbox"
])].map((role) => `[role="${role}"]:not([aria-disabled="true"])`).join(",");
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
/** Whether the element or one of its ancestors flows right to left. */
function isRtl(element) {
	if (element == null) return false;
	return element.ownerDocument.defaultView?.getComputedStyle(element).direction === "rtl";
}
var TYPEAHEAD_RESET_MS = 750;
/**
* Roving focus, typeahead, and activation for one menu level.
*
* Every level of a menu owns one of these, so a nested flyout keeps its own
* highlight, its own typeahead buffer, and its own keys without coordinating
* with the level that opened it.
*/
function useMenuNav(options) {
	const { menuRef, onClose } = options;
	let typeaheadBuffer = "";
	let typeaheadTimer;
	function getItems() {
		const menu = menuRef.value;
		if (menu == null) return [];
		return Array.from(menu.querySelectorAll(MENU_ITEM_SELECTOR));
	}
	function focusedIndex(items) {
		const active = menuRef.value?.ownerDocument.activeElement;
		return items.findIndex((row) => row === active);
	}
	function focusItem(index) {
		const items = getItems();
		if (items.length === 0) return false;
		const row = items[(index + items.length) % items.length];
		return row != null && focusElement(row);
	}
	function focusFirst() {
		return focusItem(0);
	}
	function focusLast() {
		return focusItem(-1);
	}
	function focusContainer() {
		const menu = menuRef.value;
		if (menu != null) focusElement(menu);
	}
	function resetTypeahead() {
		typeaheadBuffer = "";
		if (typeaheadTimer != null) {
			clearTimeout(typeaheadTimer);
			typeaheadTimer = void 0;
		}
	}
	function step(direction) {
		const index = focusedIndex(getItems());
		if (index === -1) {
			if (direction === 1) focusFirst();
			else focusLast();
			return;
		}
		focusItem(index + direction);
	}
	/** Focus the next row whose label starts with the typed text. */
	function typeahead(event) {
		const match = (needle) => {
			const items = getItems();
			if (items.length === 0) return false;
			const index = focusedIndex(items);
			for (let offset = 1; offset <= items.length; offset++) {
				const row = items[(index + offset + items.length) % items.length];
				if ((row?.querySelector(`[data-astryx-menu-label]`)?.textContent ?? row?.textContent ?? "").trim().toLowerCase().startsWith(needle)) {
					focusElement(row);
					return true;
				}
			}
			return false;
		};
		typeaheadBuffer += event.key.toLowerCase();
		if (typeaheadTimer != null) clearTimeout(typeaheadTimer);
		typeaheadTimer = setTimeout(resetTypeahead, TYPEAHEAD_RESET_MS);
		if (match(typeaheadBuffer)) return;
		typeaheadBuffer = event.key.toLowerCase();
		match(typeaheadBuffer);
	}
	function handleKeyDown(event) {
		if (event.altKey || event.ctrlKey || event.metaKey) return;
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				step(1);
				return;
			case "ArrowUp":
				event.preventDefault();
				step(-1);
				return;
			case "Home":
				event.preventDefault();
				focusFirst();
				return;
			case "End":
				event.preventDefault();
				focusLast();
				return;
			case "Enter":
			case " ": {
				event.preventDefault();
				if (event.repeat) return;
				const items = getItems();
				const index = focusedIndex(items);
				const row = index === -1 ? null : items[index];
				if (row != null) activateMenuItem(row, event);
				return;
			}
			case "Escape":
				event.preventDefault();
				onClose("escape");
				return;
			case "Tab":
				onClose("tab");
				return;
		}
		if (event.key.length === 1) typeahead(event);
	}
	return {
		focusContainer,
		focusFirst,
		focusLast,
		getItems,
		handleKeyDown,
		resetTypeahead
	};
}
var _hoisted_1$4 = {
	key: 0,
	class: "astryx-more-menu__item-start"
};
var _hoisted_2$2 = { class: "astryx-more-menu__item-content" };
var _hoisted_3$2 = {
	class: "astryx-more-menu__item-label",
	"data-astryx-menu-label": ""
};
var _hoisted_4$2 = {
	key: 0,
	class: "astryx-more-menu__item-description"
};
var _hoisted_5$1 = {
	key: 1,
	class: "astryx-more-menu__item-end"
};
var _hoisted_6$1 = {
	key: 2,
	class: "astryx-more-menu__item-end"
};
var _hoisted_7$1 = { class: "astryx-more-menu__item-hint" };
var HOVER_OPEN_DELAY = 150;
var _sfc_main$4 = /*@__PURE__*/ defineComponent({
	name: "AstryxMoreMenuRow",
	__name: "MoreMenuRow",
	props: {
		item: {},
		rowKey: {},
		rowId: {}
	},
	setup(__props) {
		const props = __props;
		const menu = useMoreMenuContext();
		const level = useMoreMenuLevel();
		const root = useTemplateRef("root");
		const item = computed(() => props.item);
		const isDestructive = computed(() => item.value.variant === "destructive");
		const isSubmenu = computed(() => item.value.items != null && item.value.items.length > 0);
		const isLink = computed(() => item.value.href != null && !item.value.isDisabled);
		const iconColor = computed(() => isDestructive.value ? "error" : "secondary");
		const isFlyoutOpen = computed(() => isSubmenu.value && level?.openRowKey.value === props.rowKey);
		const resolvedRel = computed(() => {
			const tokens = new Set((item.value.rel ?? "").split(/\s+/).filter(Boolean));
			if (item.value.target === "_blank") {
				tokens.add("noopener");
				tokens.add("noreferrer");
			}
			return tokens.size > 0 ? [...tokens].join(" ") : void 0;
		});
		let hoverTimer;
		function clearHoverTimer() {
			clearTimeout(hoverTimer);
			hoverTimer = void 0;
		}
		function openFlyout(focusFirst) {
			if (item.value.isDisabled || !isSubmenu.value) return;
			level?.openFlyout(props.rowKey, { focusFirst });
		}
		function closeFlyout(restoreFocus) {
			if (!isFlyoutOpen.value) return;
			level?.closeFlyout({ restoreFocus });
		}
		function handleClick(event) {
			if (item.value.isDisabled) {
				event.preventDefault();
				return;
			}
			if (isSubmenu.value) {
				if (isFlyoutOpen.value) {
					if (event.detail !== 0) closeFlyout(true);
					return;
				}
				openFlyout(event.detail === 0);
				return;
			}
			if (!(item.value.href != null && isModifiedClick(event))) item.value.onClick?.(event);
			if (item.value.hasCloseOnSelect !== false) menu?.closeMenu();
		}
		function handleAuxClick(event) {
			if (item.value.isDisabled) {
				event.preventDefault();
				return;
			}
			if (item.value.href == null || event.button !== 1) return;
			if (item.value.hasCloseOnSelect !== false) menu?.closeMenu();
		}
		function handleKeydown(event) {
			if (item.value.isDisabled || !isSubmenu.value) return;
			const openKey = isRtl(root.value) ? "ArrowLeft" : "ArrowRight";
			const closeKey = isRtl(root.value) ? "ArrowRight" : "ArrowLeft";
			if (event.key === openKey || event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				event.stopPropagation();
				if (!event.repeat) openFlyout(true);
				return;
			}
			if (event.key === closeKey && isFlyoutOpen.value) {
				event.preventDefault();
				event.stopPropagation();
				closeFlyout(false);
			}
		}
		function handlePointerEnter(event) {
			if (event.pointerType !== "mouse" || item.value.isDisabled || !isSubmenu.value) return;
			clearHoverTimer();
			level?.holdFlyout();
			if (isFlyoutOpen.value) return;
			hoverTimer = setTimeout(openFlyout, HOVER_OPEN_DELAY, false);
		}
		function handlePointerLeave() {
			clearHoverTimer();
			if (isFlyoutOpen.value) level?.releaseFlyout();
		}
		watch(root, (element) => {
			if (element != null) level?.registerRow(props.rowKey, element);
		});
		onBeforeUnmount(() => {
			clearHoverTimer();
			level?.registerRow(props.rowKey, null);
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(isLink.value ? "a" : "div"), {
				id: __props.rowId,
				ref_key: "root",
				ref: root,
				"aria-disabled": item.value.isDisabled || void 0,
				"aria-expanded": isSubmenu.value ? isFlyoutOpen.value : void 0,
				"aria-haspopup": isSubmenu.value ? "menu" : void 0,
				class: normalizeClass(["astryx-more-menu__item", { "astryx-more-menu__item--destructive": isDestructive.value }]),
				"data-astryx-menu-row": __props.rowKey,
				"data-disabled": item.value.isDisabled || void 0,
				"data-submenu": isSubmenu.value || void 0,
				href: isLink.value ? item.value.href : void 0,
				rel: isLink.value ? resolvedRel.value : void 0,
				role: "menuitem",
				tabindex: item.value.isDisabled ? void 0 : -1,
				target: isLink.value ? item.value.target : void 0,
				onAuxclick: handleAuxClick,
				onClick: handleClick,
				onKeydown: handleKeydown,
				onPointerenter: handlePointerEnter,
				onPointerleave: handlePointerLeave
			}, {
				default: withCtx(() => [
					item.value.icon != null ? (openBlock(), createElementBlock("span", _hoisted_1$4, [createVNode(_sfc_main$10, {
						color: iconColor.value,
						icon: item.value.icon,
						size: "sm"
					}, null, 8, ["color", "icon"])])) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_2$2, [createElementVNode("span", _hoisted_3$2, toDisplayString(item.value.label), 1), item.value.description != null ? (openBlock(), createElementBlock("span", _hoisted_4$2, toDisplayString(item.value.description), 1)) : createCommentVNode("v-if", true)]),
					isSubmenu.value ? (openBlock(), createElementBlock("span", _hoisted_5$1, [createVNode(_sfc_main$10, {
						class: "astryx-more-menu__caret",
						icon: "chevronRight",
						size: "sm"
					})])) : item.value.endContent != null ? (openBlock(), createElementBlock("span", _hoisted_6$1, [createElementVNode("span", _hoisted_7$1, toDisplayString(item.value.endContent), 1)])) : createCommentVNode("v-if", true)
				]),
				_: 1
			}, 40, [
				"id",
				"aria-disabled",
				"aria-expanded",
				"aria-haspopup",
				"class",
				"data-astryx-menu-row",
				"data-disabled",
				"data-submenu",
				"href",
				"rel",
				"tabindex",
				"target"
			]);
		};
	}
});
var _hoisted_1$3 = ["data-level", "data-placement"];
var _hoisted_2$1 = [
	"id",
	"data-size",
	"aria-label",
	"aria-labelledby"
];
var _hoisted_3$1 = ["aria-label"];
var _hoisted_4$1 = {
	key: 0,
	"aria-hidden": "true",
	class: "astryx-more-menu__heading"
};
var GAP = 4;
var HOVER_CLOSE_DELAY = 250;
var _sfc_main$3 = /*@__PURE__*/ defineComponent({
	name: "AstryxMoreMenuPanel",
	__name: "MoreMenuPanel",
	props: {
		items: {},
		isOpen: { type: Boolean },
		anchor: { default: null },
		placement: { default: "below" },
		alignment: { default: "start" },
		label: { default: void 0 },
		ariaLabelledby: { default: void 0 },
		id: { default: void 0 },
		isNested: {
			type: Boolean,
			default: false
		},
		level: { default: 0 },
		isInline: {
			type: Boolean,
			default: false
		},
		initialFocus: { default: "none" }
	},
	emits: [
		"close",
		"closeLevel",
		"settled"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const size = useMoreMenuSize();
		const parentLevel = useMoreMenuLevel();
		const generatedId = `astryx-more-menu-panel-${useId()}`;
		const menuId = computed(() => props.id ?? generatedId);
		const layer = useTemplateRef("layer");
		const panel = useTemplateRef("panel");
		const openRowKey = ref(null);
		const renderedRowKey = ref(null);
		const flyoutFocus = ref("none");
		const flyoutPlacement = ref("end");
		const rowElements = /* @__PURE__ */ new Map();
		/** A row as it is rendered: its data plus the identity it keeps while open. */
		const entries = computed(() => {
			let position = 0;
			function toRow(item, index, prefix) {
				const key = `${prefix}${item.id ?? index}`;
				position += 1;
				return {
					item,
					key,
					rowId: `${menuId.value}-row-${position}`
				};
			}
			return props.items.map((option, index) => {
				if (isDividerOption(option)) return {
					key: `divider-${index}`,
					kind: "divider"
				};
				if (isSectionOption(option)) {
					const key = `section-${option.id ?? index}`;
					return {
						key,
						kind: "section",
						section: option,
						rows: option.items.map((item, itemIndex) => toRow(item, itemIndex, `${key}:`))
					};
				}
				return {
					key: `item-${option.id ?? index}`,
					kind: "row",
					row: toRow(option, index, "item-")
				};
			});
		});
		const renderedRow = computed(() => {
			for (const entry of entries.value) {
				if (entry.kind === "row" && entry.row.key === renderedRowKey.value) return entry.row;
				if (entry.kind === "section") {
					const row = entry.rows.find((candidate) => candidate.key === renderedRowKey.value);
					if (row != null) return row;
				}
			}
			return null;
		});
		const isFlyoutOpen = computed(() => openRowKey.value != null && openRowKey.value === renderedRowKey.value);
		let closeTimer;
		function clearCloseTimer() {
			clearTimeout(closeTimer);
			closeTimer = void 0;
		}
		function registerRow(key, element) {
			if (element != null) rowElements.set(key, element);
			else rowElements.delete(key);
		}
		function openFlyout(key, options = {}) {
			clearCloseTimer();
			flyoutFocus.value = options.focusFirst === true ? "first" : "none";
			flyoutPlacement.value = isRtl(rowElements.get(key) ?? null) ? "start" : "end";
			renderedRowKey.value = key;
			openRowKey.value = key;
		}
		function closeFlyout(options = {}) {
			const key = openRowKey.value;
			if (key == null) return;
			clearCloseTimer();
			openRowKey.value = null;
			if (options.restoreFocus === true) nextTick(() => {
				const element = rowElements.get(key);
				if (element != null) element.focus({ preventScroll: true });
			});
		}
		function holdFlyout() {
			clearCloseTimer();
		}
		function releaseFlyout() {
			clearCloseTimer();
			closeTimer = setTimeout(closeFlyout, HOVER_CLOSE_DELAY);
		}
		function onFlyoutSettled() {
			if (openRowKey.value == null) renderedRowKey.value = null;
		}
		provide(moreMenuLevelKey, {
			closeFlyout,
			holdFlyout,
			openFlyout,
			openRowKey,
			registerRow,
			releaseFlyout
		});
		const nav = useMenuNav({
			menuRef: panel,
			onClose: (reason) => {
				if (reason === "tab" || !props.isNested) emit("close");
				else emit("closeLevel");
			}
		});
		watch(openRowKey, (key) => {
			if (key != null) renderedRowKey.value = key;
		});
		watch(() => props.isOpen, async (isOpen) => {
			if (!isOpen) {
				nav.resetTypeahead();
				openRowKey.value = null;
				renderedRowKey.value = null;
				return;
			}
			const focus = props.initialFocus;
			await nextTick();
			applyInitialFocus(focus);
		}, { immediate: true });
		function applyInitialFocus(focus) {
			if (focus === "none") return;
			if (focus === "first" && nav.focusFirst()) return;
			if (focus === "last" && nav.focusLast()) return;
			nav.focusContainer();
		}
		const anchor = computed(() => props.isInline ? null : props.anchor ?? null);
		const isLayerActive = ref(false);
		const anchorWidth = ref(0);
		const { position, detach } = usePositionedLayer({
			anchor,
			layer,
			isOpen: isLayerActive,
			placement: computed(() => props.placement),
			alignment: computed(() => props.alignment),
			gap: GAP
		});
		const layerStyle = computed(() => {
			const style = { "--astryx-more-menu-level": String(props.level) };
			if (props.isInline) return style;
			style.top = `${position.value.top}px`;
			style.left = `${position.value.left}px`;
			style["--_more-menu-anchor-inline-size"] = `${anchorWidth.value}px`;
			return style;
		});
		const resolvedPlacement = computed(() => props.isInline ? void 0 : position.value.placement);
		watch(() => props.isOpen, (isOpen) => {
			isLayerActive.value = isOpen;
		});
		onMounted(() => {
			if (props.isOpen) nextTick(() => {
				isLayerActive.value = true;
			});
		});
		function syncAnchorWidth() {
			anchorWidth.value = props.isInline ? 0 : props.anchor?.getBoundingClientRect().width ?? 0;
		}
		watch(() => [props.isOpen, props.anchor], async ([isOpen]) => {
			if (!isOpen) return;
			await nextTick();
			syncAnchorWidth();
		}, { immediate: true });
		onBeforeUnmount(() => {
			clearCloseTimer();
			detach();
		});
		function onKeydown(event) {
			if (props.isNested === true) {
				const closeKey = isRtl(panel.value) ? "ArrowRight" : "ArrowLeft";
				if (event.key === "Escape" || event.key === closeKey) {
					event.preventDefault();
					event.stopPropagation();
					emit("closeLevel");
					return;
				}
			}
			nav.handleKeyDown(event);
		}
		function onPointerMove(event) {
			if (event.pointerType !== "mouse") return;
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;
			const row = target.closest("[data-astryx-menu-row]");
			if (row == null || panel.value?.contains(row) !== true || row.dataset.disabled != null) return;
			if (row !== document.activeElement) row.focus({ preventScroll: true });
			if (openRowKey.value != null && openRowKey.value !== row.dataset.astryxMenuRow) closeFlyout();
		}
		__expose({
			focusContainer: nav.focusContainer,
			focusFirst: nav.focusFirst,
			focusLast: nav.focusLast
		});
		return (_ctx, _cache) => {
			const _component_MoreMenuPanel = resolveComponent("MoreMenuPanel", true);
			return openBlock(), createBlock(Teleport, {
				disabled: __props.isInline,
				to: "body"
			}, [createVNode(Transition, {
				appear: "",
				name: "astryx-more-menu",
				onAfterLeave: _cache[4] || (_cache[4] = ($event) => emit("settled"))
			}, {
				default: withCtx(() => [__props.isOpen ? (openBlock(), createElementBlock("div", {
					key: 0,
					ref_key: "layer",
					ref: layer,
					class: normalizeClass(["astryx-more-menu__layer", { "astryx-more-menu__layer--inline": __props.isInline }]),
					"data-level": __props.level,
					"data-placement": resolvedPlacement.value,
					style: normalizeStyle(layerStyle.value),
					onPointerenter: _cache[2] || (_cache[2] = ($event) => unref(parentLevel)?.holdFlyout()),
					onPointerleave: _cache[3] || (_cache[3] = ($event) => unref(parentLevel)?.releaseFlyout())
				}, [createElementVNode("div", {
					id: menuId.value,
					ref_key: "panel",
					ref: panel,
					class: "astryx-more-menu__panel",
					"data-astryx-more-menu-surface": "",
					"data-size": unref(size),
					"aria-label": __props.ariaLabelledby == null ? __props.label : void 0,
					"aria-labelledby": __props.ariaLabelledby,
					role: "menu",
					tabindex: "-1",
					onKeydown,
					onPointermove: onPointerMove
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(entries.value, (entry) => {
					return openBlock(), createElementBlock(Fragment, { key: entry.key }, [entry.kind === "divider" ? (openBlock(), createBlock(_sfc_main$11, {
						key: 0,
						class: "astryx-more-menu__divider"
					})) : entry.kind === "section" ? (openBlock(), createElementBlock("div", {
						key: 1,
						"aria-label": entry.section.title,
						class: "astryx-more-menu__group",
						role: "group"
					}, [entry.section.title != null && entry.section.title !== "" ? (openBlock(), createElementBlock("div", _hoisted_4$1, toDisplayString(entry.section.title), 1)) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList(entry.rows, (row) => {
						return openBlock(), createBlock(_sfc_main$4, {
							key: row.key,
							item: row.item,
							"row-id": row.rowId,
							"row-key": row.key
						}, null, 8, [
							"item",
							"row-id",
							"row-key"
						]);
					}), 128))], 8, _hoisted_3$1)) : (openBlock(), createBlock(_sfc_main$4, {
						key: 2,
						item: entry.row.item,
						"row-id": entry.row.rowId,
						"row-key": entry.row.key
					}, null, 8, [
						"item",
						"row-id",
						"row-key"
					]))], 64);
				}), 128))], 40, _hoisted_2$1), (openBlock(), createBlock(Teleport, { to: "body" }, [renderedRow.value != null && renderedRow.value.item.items != null ? (openBlock(), createBlock(_component_MoreMenuPanel, {
					key: 0,
					id: `${menuId.value}-flyout`,
					alignment: "start",
					anchor: unref(rowElements).get(renderedRow.value.key) ?? null,
					"aria-labelledby": renderedRow.value.rowId,
					"initial-focus": flyoutFocus.value,
					"is-nested": true,
					"is-open": isFlyoutOpen.value,
					items: renderedRow.value.item.items,
					level: __props.level + 1,
					placement: flyoutPlacement.value,
					onClose: _cache[0] || (_cache[0] = ($event) => emit("close")),
					onCloseLevel: _cache[1] || (_cache[1] = ($event) => closeFlyout({ restoreFocus: true })),
					onSettled: onFlyoutSettled
				}, null, 8, [
					"id",
					"anchor",
					"aria-labelledby",
					"initial-focus",
					"is-open",
					"items",
					"level",
					"placement"
				])) : createCommentVNode("v-if", true)]))], 46, _hoisted_1$3)) : createCommentVNode("v-if", true)]),
				_: 1
			})], 8, ["disabled"]);
		};
	}
});
var _hoisted_1$2 = { class: "astryx-more-menu__item-hint" };
var _sfc_main$2 = /*@__PURE__*/ defineComponent({
	name: "AstryxMoreMenuSheetRow",
	__name: "MoreMenuSheetRow",
	props: {
		item: {},
		rowId: {}
	},
	emits: ["select", "drillIn"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const item = computed(() => props.item);
		const isDestructive = computed(() => item.value.variant === "destructive");
		const isSubmenu = computed(() => isSubmenuItem(item.value));
		const isLink = computed(() => item.value.href != null && !item.value.isDisabled);
		const iconColor = computed(() => isDestructive.value ? "error" : "secondary");
		const rowProps = computed(() => ({
			description: item.value.description,
			href: isLink.value ? item.value.href : void 0,
			isDisabled: item.value.isDisabled,
			label: item.value.label,
			rel: isLink.value ? item.value.rel : void 0,
			target: isLink.value ? item.value.target : void 0
		}));
		function activate(event) {
			if (item.value.isDisabled) {
				event.preventDefault();
				return;
			}
			if (isSubmenu.value) {
				emit("drillIn", item.value, props.rowId);
				return;
			}
			if (isLink.value && isModifiedClick(event)) {
				emit("select", {
					...item.value,
					onClick: void 0
				}, event);
				return;
			}
			emit("select", item.value, event);
		}
		function handleClick(event) {
			activate(event);
		}
		function handleClickCapture(event) {
			if (isLink.value) activate(event);
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(_sfc_main$9, mergeProps({
				class: { "astryx-more-menu__sheet-item--destructive": isDestructive.value },
				"data-astryx-sheet-row": __props.rowId,
				density: "spacious",
				"on-click": isLink.value ? void 0 : handleClick
			}, rowProps.value, { onClickCapture: handleClickCapture }), createSlots({ _: 2 }, [item.value.icon != null ? {
				name: "startContent",
				fn: withCtx(() => [createVNode(_sfc_main$10, {
					color: iconColor.value,
					icon: item.value.icon,
					size: "sm"
				}, null, 8, ["color", "icon"])]),
				key: "0"
			} : void 0, isSubmenu.value ? {
				name: "endContent",
				fn: withCtx(() => [createVNode(_sfc_main$10, {
					class: "astryx-more-menu__caret",
					icon: "chevronRight",
					size: "sm"
				})]),
				key: "1"
			} : item.value.endContent != null ? {
				name: "endContent",
				fn: withCtx(() => [createElementVNode("span", _hoisted_1$2, toDisplayString(item.value.endContent), 1)]),
				key: "2"
			} : void 0]), 1040, [
				"class",
				"data-astryx-sheet-row",
				"on-click"
			]);
		};
	}
});
var _hoisted_1$1 = {
	key: 0,
	class: "astryx-more-menu__sheet-layer"
};
var _hoisted_2 = ["id", "aria-label"];
var _hoisted_3 = { class: "astryx-more-menu__sheet-header" };
var _hoisted_4 = { class: "astryx-more-menu__sheet-body" };
var _hoisted_5 = {
	key: 0,
	class: "astryx-more-menu__sheet-divider",
	role: "presentation"
};
var _hoisted_6 = {
	key: 1,
	class: "astryx-more-menu__sheet-group",
	role: "presentation"
};
var _hoisted_7 = ["aria-label"];
var ROW_CONTROL_SELECTOR = "a[href], button:not([disabled])";
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxMoreMenuSheet",
	__name: "MoreMenuSheet",
	props: {
		items: {},
		isOpen: { type: Boolean },
		label: {},
		backLabel: { default: "Back" },
		id: { default: void 0 },
		initialFocus: { default: "none" }
	},
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const sheet = useTemplateRef("sheet");
		const path = ref([]);
		const drilledRowIds = ref([]);
		const currentItems = computed(() => path.value.at(-1)?.items ?? props.items);
		const title = computed(() => {
			const view = path.value.at(-1);
			return view != null && view.label !== "" ? view.label : props.label;
		});
		const entries = computed(() => {
			const view = path.value.length;
			function toRow(item, index, prefix) {
				const key = `${prefix}${item.id ?? index}`;
				return {
					item,
					key,
					rowId: `view-${view}-${key}`
				};
			}
			return currentItems.value.map((option, index) => {
				if (isDividerOption(option)) return {
					key: `divider-${index}`,
					kind: "divider"
				};
				if (isSectionOption(option)) {
					const key = `section-${option.id ?? index}`;
					return {
						key,
						kind: "section",
						section: option,
						rows: option.items.map((item, itemIndex) => toRow(item, itemIndex, `${key}:`))
					};
				}
				return {
					key: `item-${option.id ?? index}`,
					kind: "row",
					row: toRow(option, index, "item-")
				};
			});
		});
		function rowControls() {
			const element = sheet.value;
			if (element == null) return [];
			return Array.from(element.querySelectorAll(`.astryx-more-menu__sheet-list ${ROW_CONTROL_SELECTOR}`));
		}
		function focusHeading() {
			const heading = sheet.value?.querySelector(".astryx-more-menu__sheet-title");
			if (heading != null) focusElement(heading);
		}
		function applyInitialFocus(focus) {
			if (focus === "none") return;
			if (focus !== "container") {
				const controls = rowControls();
				const control = focus === "last" ? controls[controls.length - 1] : controls[0];
				if (control != null && focusElement(control)) return;
			}
			if (sheet.value != null) focusElement(sheet.value);
		}
		watch(() => props.isOpen, async (isOpen) => {
			if (!isOpen) {
				path.value = [];
				drilledRowIds.value = [];
				return;
			}
			const focus = props.initialFocus;
			await nextTick();
			applyInitialFocus(focus);
		}, { immediate: true });
		function pushView(item, rowId) {
			drilledRowIds.value = [...drilledRowIds.value, rowId];
			path.value = [...path.value, item];
			nextTick(focusHeading);
		}
		function popView() {
			const rowId = drilledRowIds.value.at(-1);
			drilledRowIds.value = drilledRowIds.value.slice(0, -1);
			path.value = path.value.slice(0, -1);
			if (rowId == null) {
				nextTick(focusHeading);
				return;
			}
			nextTick(() => {
				const control = (sheet.value?.querySelector(`[data-astryx-sheet-row="${rowId}"]`))?.querySelector(ROW_CONTROL_SELECTOR);
				if (control != null && focusElement(control)) return;
				focusHeading();
			});
		}
		function onSelect(item, event) {
			if (item.isDisabled) return;
			item.onClick?.(event);
			if (item.hasCloseOnSelect !== false) emit("close");
		}
		function onScrimClick() {
			emit("close");
		}
		function onKeydown(event) {
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopPropagation();
				if (path.value.length > 0) popView();
				else emit("close");
				return;
			}
			if (event.key !== "Tab") return;
			const element = sheet.value;
			if (element == null) return;
			const focusables = getFocusables(element);
			if (focusables.length === 0) {
				event.preventDefault();
				return;
			}
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			const active = element.ownerDocument.activeElement;
			if (active == null || !element.contains(active)) {
				event.preventDefault();
				focusElement(event.shiftKey ? last : first);
				return;
			}
			if (event.shiftKey && (active === first || active === element)) {
				event.preventDefault();
				focusElement(last);
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				focusElement(first);
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Teleport, { to: "body" }, [createVNode(Transition, {
				appear: "",
				name: "astryx-more-menu-sheet"
			}, {
				default: withCtx(() => [__props.isOpen ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
					createCommentVNode(" eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 按下遮罩关闭是纯指针的快捷方式；键盘用户走对话框自身的 Escape 路径。 "),
					createElementVNode("div", {
						class: "astryx-more-menu__scrim",
						onClick: onScrimClick
					}),
					createCommentVNode(" eslint-disable-next-line vue-a11y/no-static-element-interactions -- 对话框面板自己处理 Escape 与焦点循环；面板本身不参与读屏的交互控件序列。 "),
					createElementVNode("div", {
						id: __props.id,
						ref_key: "sheet",
						ref: sheet,
						"aria-modal": "true",
						class: "astryx-more-menu__sheet",
						"data-astryx-more-menu-surface": "",
						role: "dialog",
						"aria-label": title.value,
						tabindex: -1,
						onKeydown
					}, [createElementVNode("div", _hoisted_3, [path.value.length > 0 ? (openBlock(), createBlock(_sfc_main$7, {
						key: 0,
						class: "astryx-more-menu__sheet-back",
						label: __props.backLabel,
						size: "sm",
						variant: "ghost",
						onClick: popView
					}, {
						default: withCtx(() => [createVNode(_sfc_main$10, {
							class: "astryx-more-menu__sheet-back-icon",
							icon: "chevronLeft",
							size: "sm"
						})]),
						_: 1
					}, 8, ["label"])) : createCommentVNode("v-if", true), createVNode(_sfc_main$5, {
						class: "astryx-more-menu__sheet-title",
						level: 3,
						tabindex: -1
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(title.value), 1)]),
						_: 1
					})]), createElementVNode("div", _hoisted_4, [createVNode(_sfc_main$1$10, {
						class: "astryx-more-menu__sheet-list",
						density: "spacious"
					}, {
						default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(entries.value, (entry) => {
							return openBlock(), createElementBlock(Fragment, { key: entry.key }, [entry.kind === "divider" ? (openBlock(), createElementBlock("li", _hoisted_5, [createVNode(_sfc_main$11)])) : entry.kind === "section" ? (openBlock(), createElementBlock("li", _hoisted_6, [createElementVNode("div", {
								"aria-label": entry.section.title,
								role: "group"
							}, [entry.section.title != null && entry.section.title !== "" ? (openBlock(), createBlock(_sfc_main$5, {
								key: 0,
								class: "astryx-more-menu__sheet-heading",
								level: 4
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(entry.section.title), 1)]),
								_: 2
							}, 1024)) : createCommentVNode("v-if", true), createVNode(_sfc_main$1$10, { density: "spacious" }, {
								default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(entry.rows, (row) => {
									return openBlock(), createBlock(_sfc_main$2, {
										key: row.key,
										item: row.item,
										"row-id": row.rowId,
										onDrillIn: pushView,
										onSelect
									}, null, 8, ["item", "row-id"]);
								}), 128))]),
								_: 2
							}, 1024)], 8, _hoisted_7)])) : (openBlock(), createBlock(_sfc_main$2, {
								key: 2,
								item: entry.row.item,
								"row-id": entry.row.rowId,
								onDrillIn: pushView,
								onSelect
							}, null, 8, ["item", "row-id"]))], 64);
						}), 128))]),
						_: 1
					})])], 40, _hoisted_2)
				])) : createCommentVNode("v-if", true)]),
				_: 1
			})]);
		};
	}
});
var _hoisted_1 = [
	"data-disabled",
	"data-open",
	"data-presentation",
	"data-size",
	"data-variant"
];
var ADAPTIVE_QUERY = "(max-width: 768px) and (pointer: coarse)";
var SURFACE_SELECTOR = "[data-astryx-more-menu-surface]";
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxMoreMenu",
	__name: "MoreMenu",
	props: /*@__PURE__*/ mergeModels({
		items: {},
		label: { default: "More options" },
		variant: { default: "ghost" },
		size: { default: "md" },
		isDisabled: {
			type: Boolean,
			default: false
		},
		placement: { default: "below" },
		alignment: { default: "start" },
		presentation: { default: "popover" },
		isInline: {
			type: Boolean,
			default: false
		}
	}, {
		"isMenuOpen": {
			type: Boolean,
			default: void 0
		},
		"isMenuOpenModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["openChange"], ["update:isMenuOpen"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const openModel = useModel(__props, "isMenuOpen");
		const root = useTemplateRef("root");
		const trigger = useTemplateRef("trigger");
		const panel = useTemplateRef("panel");
		const menuId = `astryx-more-menu-${useId()}`;
		const sheetId = `${menuId}-sheet`;
		const localIsOpen = shallowRef(false);
		const pendingFocus = shallowRef("none");
		const isCompactTouch = shallowRef(false);
		const isControlled = openModel.value !== void 0;
		const isOpen = computed(() => isControlled ? openModel.value === true : localIsOpen.value);
		const triggerElement = computed(() => trigger.value?.element ?? null);
		const resolvedPresentation = computed(() => {
			if (props.isInline) return "popover";
			if (props.presentation === "adaptive") return isCompactTouch.value ? "bottom-sheet" : "popover";
			return props.presentation === "bottom-sheet" ? "bottom-sheet" : "popover";
		});
		const isSheet = computed(() => resolvedPresentation.value === "bottom-sheet");
		const isInlinePreview = computed(() => props.isInline && isOpen.value);
		function setOpen(next) {
			if (isOpen.value === next) return;
			if (isControlled) {
				openModel.value = next;
				nextTick(() => {
					if (isOpen.value !== next) pendingFocus.value = "none";
				});
			} else localIsOpen.value = next;
			emit("openChange", next);
		}
		function isInsideSurface(target) {
			return target instanceof Element && target.closest(SURFACE_SELECTOR) != null;
		}
		function isOnTrigger(target) {
			const element = root.value;
			return element != null && target instanceof Node && element.contains(target);
		}
		function closeMenu(options = {}) {
			const { restoreFocus = true } = options;
			if (!isOpen.value) return;
			const active = document.activeElement;
			const focusLandedElsewhere = active instanceof HTMLElement && active !== document.body && active !== triggerElement.value && !isInsideSurface(active);
			setOpen(false);
			pendingFocus.value = "none";
			if (restoreFocus && !focusLandedElsewhere) triggerElement.value?.focus({ preventScroll: true });
		}
		function openMenu(options) {
			if (props.isDisabled || isOpen.value) return;
			pendingFocus.value = options.modality === "pointer" ? "container" : options.focusLast === true ? "last" : "first";
			setOpen(true);
		}
		function onTriggerClick(event) {
			if (props.isDisabled) return;
			if (isOpen.value) {
				closeMenu();
				return;
			}
			openMenu({ modality: event.detail === 0 ? "keyboard" : "pointer" });
		}
		function onTriggerKeydown(event) {
			if (props.isDisabled) return;
			if (!isOpen.value) {
				if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Enter" && event.key !== " ") return;
				event.preventDefault();
				if (event.repeat) return;
				openMenu({
					modality: "keyboard",
					focusLast: event.key === "ArrowUp"
				});
				return;
			}
			if (event.key === "ArrowDown") {
				event.preventDefault();
				if (panel.value?.focusFirst() !== true) panel.value?.focusContainer();
			}
		}
		function onDocumentPointerUp(event) {
			if (event.pointerType !== "mouse") return;
			dismissFromPointer(event.target);
		}
		function onDocumentClick(event) {
			dismissFromPointer(event.target);
		}
		function dismissFromPointer(target) {
			if (!isOpen.value || isInsideSurface(target) || isOnTrigger(target)) return;
			closeMenu({ restoreFocus: false });
		}
		function onDocumentKeydown(event) {
			if (event.key !== "Escape" || !isOpen.value) return;
			if (isInsideSurface(event.target)) return;
			closeMenu();
		}
		function addDocumentListeners() {
			document.addEventListener("pointerup", onDocumentPointerUp);
			document.addEventListener("click", onDocumentClick);
			document.addEventListener("keydown", onDocumentKeydown);
		}
		function removeDocumentListeners() {
			document.removeEventListener("pointerup", onDocumentPointerUp);
			document.removeEventListener("click", onDocumentClick);
			document.removeEventListener("keydown", onDocumentKeydown);
		}
		watch(isOpen, (open) => {
			removeDocumentListeners();
			if (!open) {
				pendingFocus.value = "none";
				return;
			}
			if (!isSheet.value) addDocumentListeners();
		});
		watch(openModel, (open, previous) => {
			if (open !== true || previous === true) return;
			if (pendingFocus.value === "none" && !isInlinePreview.value) pendingFocus.value = "first";
		});
		provide(moreMenuContextKey, {
			closeMenu,
			menuSize: computed(() => props.size)
		});
		let query = null;
		function syncCompactTouch(event) {
			isCompactTouch.value = event?.matches ?? query?.matches ?? false;
		}
		onMounted(() => {
			if (typeof window.matchMedia !== "function") return;
			query = window.matchMedia(ADAPTIVE_QUERY);
			syncCompactTouch();
			query.addEventListener?.("change", syncCompactTouch);
		});
		onBeforeUnmount(() => {
			query?.removeEventListener?.("change", syncCompactTouch);
			removeDocumentListeners();
		});
		function focus(options) {
			triggerElement.value?.focus(options);
		}
		function blur() {
			triggerElement.value?.blur();
		}
		__expose({
			blur,
			element: triggerElement,
			focus
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				ref_key: "root",
				ref: root,
				class: normalizeClass(["astryx-more-menu", { "astryx-more-menu--inline": __props.isInline }]),
				"data-disabled": __props.isDisabled || void 0,
				"data-open": isOpen.value || void 0,
				"data-presentation": resolvedPresentation.value,
				"data-size": __props.size,
				"data-variant": __props.variant
			}, [createVNode(_sfc_main$7, {
				ref_key: "trigger",
				ref: trigger,
				"aria-controls": isSheet.value ? sheetId : menuId,
				"aria-expanded": isOpen.value,
				"aria-haspopup": isSheet.value ? "dialog" : "menu",
				"is-disabled": __props.isDisabled,
				label: __props.label,
				size: __props.size,
				tooltip: isOpen.value ? void 0 : __props.label,
				variant: __props.variant,
				onClick: onTriggerClick,
				onKeydown: onTriggerKeydown
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "icon", {}, () => [createVNode(_sfc_main$10, { icon: "moreHorizontal" })])]),
				_: 3
			}, 8, [
				"aria-controls",
				"aria-expanded",
				"aria-haspopup",
				"is-disabled",
				"label",
				"size",
				"tooltip",
				"variant"
			]), !isSheet.value ? (openBlock(), createBlock(_sfc_main$3, {
				key: 0,
				id: menuId,
				ref_key: "panel",
				ref: panel,
				alignment: __props.alignment,
				anchor: triggerElement.value,
				"initial-focus": pendingFocus.value,
				"is-inline": __props.isInline,
				"is-open": isOpen.value,
				items: __props.items,
				label: __props.label,
				placement: __props.placement,
				onClose: _cache[0] || (_cache[0] = ($event) => closeMenu())
			}, null, 8, [
				"alignment",
				"anchor",
				"initial-focus",
				"is-inline",
				"is-open",
				"items",
				"label",
				"placement"
			])) : (openBlock(), createBlock(_sfc_main$1, {
				key: 1,
				id: sheetId,
				"initial-focus": pendingFocus.value,
				"is-open": isOpen.value,
				items: __props.items,
				label: __props.label,
				onClose: _cache[1] || (_cache[1] = ($event) => closeMenu())
			}, null, 8, [
				"initial-focus",
				"is-open",
				"items",
				"label"
			]))], 10, _hoisted_1);
		};
	}
});
//#endregion
//#region components/demos/more-menu/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const lastAction = ref("Nothing yet");
		function record(label) {
			lastAction.value = label;
		}
		const items = [
			{
				label: "Open in new tab",
				onClick: () => record("Open in new tab")
			},
			{
				label: "Copy link",
				onClick: () => record("Copy link")
			},
			{
				label: "Rename",
				onClick: () => record("Rename")
			},
			{ type: "divider" },
			{
				label: "Move to trash",
				variant: "destructive",
				onClick: () => record("Move to trash")
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "more-menu-preview__stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$8), {
				"h-align": "start",
				gap: 3
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main), {
							items,
							label: "More options"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$6), {
							type: "body",
							color: "secondary"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Last action: ${ssrInterpolate(lastAction.value)}`);
								else return [createTextVNode(" Last action: " + toDisplayString(lastAction.value), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(unref(_sfc_main), {
						items,
						label: "More options"
					}), createVNode(unref(_sfc_main$6), {
						type: "body",
						color: "secondary"
					}, {
						default: withCtx(() => [createTextVNode(" Last action: " + toDisplayString(lastAction.value), 1)]),
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
//#region components/demos/more-menu/basic.vue
var _sfc_setup$4 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/more-menu/basic.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/more-menu/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'\nimport { MoreMenu } from '@astryx-vue/core/MoreMenu'\nimport { VStack } from '@astryx-vue/core/Stack'\nimport { Text } from '@astryx-vue/core/Text'\nimport { ref } from 'vue'\n\nconst lastAction = ref('Nothing yet')\n\nfunction record(label: string): void {\n  lastAction.value = label\n}\n\nconst items: MoreMenuOption[] = [\n  { label: 'Open in new tab', onClick: () => record('Open in new tab') },\n  { label: 'Copy link', onClick: () => record('Copy link') },\n  { label: 'Rename', onClick: () => record('Rename') },\n  { type: 'divider' },\n  { label: 'Move to trash', variant: 'destructive', onClick: () => record('Move to trash') },\n]\n<\/script>\n\n<template>\n  <div class=\"more-menu-preview__stack\">\n    <VStack h-align=\"start\" :gap=\"3\">\n      <MoreMenu :items=\"items\" label=\"More options\" />\n      <Text type=\"body\" color=\"secondary\">\n        Last action: {{ lastAction }}\n      </Text>\n    </VStack>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenuOption } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { VStack } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Stack'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Text } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Text'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> lastAction</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Nothing yet'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> record</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">label</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> string</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  lastAction.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> label</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> items</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> MoreMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Open in new tab'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">onClick</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> record</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Open in new tab'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">) },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Copy link'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">onClick</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> record</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Copy link'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">) },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Rename'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">onClick</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> record</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Rename'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">) },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'divider'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Move to trash'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, variant: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'destructive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">onClick</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> record</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Move to trash'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">) },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"more-menu-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> h-align</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"start\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">gap</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"More options\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"body\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> color</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        Last action: {{ lastAction }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Text</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">VStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/more-menu/overview.vue?vue&type=script&setup=true&lang.ts
var overview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "overview",
	__ssrInlineRender: true,
	setup(__props) {
		const items = [
			{ label: "Edit" },
			{ label: "Duplicate" },
			{
				label: "Share",
				icon: "css-icon css-icon--sm i-carbon-upload"
			},
			{ type: "divider" },
			{
				label: "Delete",
				variant: "destructive"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "more-menu-preview__inline" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				"is-inline": "",
				"is-menu-open": "",
				label: "Project actions"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/more-menu/overview.vue
var _sfc_setup$3 = overview_vue_vue_type_script_setup_true_lang_default.setup;
overview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/more-menu/overview.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var overview_default$1 = overview_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/more-menu/overview.vue?raw&highlighted
var overview_default = {
	"source": "<script setup lang=\"ts\">\nimport type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'\nimport { MoreMenu } from '@astryx-vue/core/MoreMenu'\n\nconst items: MoreMenuOption[] = [\n  { label: 'Edit' },\n  { label: 'Duplicate' },\n  { label: 'Share', icon: 'css-icon css-icon--sm i-carbon-upload' },\n  { type: 'divider' },\n  { label: 'Delete', variant: 'destructive' },\n]\n<\/script>\n\n<template>\n  <div class=\"more-menu-preview__inline\">\n    <MoreMenu\n      :items=\"items\"\n      is-inline\n      is-menu-open\n      label=\"Project actions\"\n    />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenuOption } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> items</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> MoreMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Edit'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Duplicate'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Share'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-upload'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'divider'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Delete'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, variant: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'destructive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"more-menu-preview__inline\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      is-inline</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      is-menu-open</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">      label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Project actions\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/more-menu/sections.vue?vue&type=script&setup=true&lang.ts
var sections_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "sections",
	__ssrInlineRender: true,
	setup(__props) {
		const items = [
			{
				label: "Rename",
				icon: "css-icon css-icon--sm i-carbon-tools",
				endContent: "⌘R"
			},
			{
				label: "Duplicate",
				icon: "css-icon css-icon--sm i-carbon-copy",
				endContent: "⌘D"
			},
			{ type: "divider" },
			{
				type: "section",
				id: "share",
				title: "Share",
				items: [{
					label: "Copy link",
					icon: "css-icon css-icon--sm i-carbon-copy"
				}, {
					label: "Publish to the web",
					description: "Available on the team plan",
					isDisabled: true
				}]
			},
			{ type: "divider" },
			{
				label: "Move to trash",
				variant: "destructive"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "more-menu-preview__stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				label: "File actions"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/more-menu/sections.vue
var _sfc_setup$2 = sections_vue_vue_type_script_setup_true_lang_default.setup;
sections_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/more-menu/sections.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var sections_default$1 = sections_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/more-menu/sections.vue?raw&highlighted
var sections_default = {
	"source": "<script setup lang=\"ts\">\nimport type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'\nimport { MoreMenu } from '@astryx-vue/core/MoreMenu'\n\nconst items: MoreMenuOption[] = [\n  { label: 'Rename', icon: 'css-icon css-icon--sm i-carbon-tools', endContent: '⌘R' },\n  { label: 'Duplicate', icon: 'css-icon css-icon--sm i-carbon-copy', endContent: '⌘D' },\n  { type: 'divider' },\n  {\n    type: 'section',\n    id: 'share',\n    title: 'Share',\n    items: [\n      { label: 'Copy link', icon: 'css-icon css-icon--sm i-carbon-copy' },\n      { label: 'Publish to the web', description: 'Available on the team plan', isDisabled: true },\n    ],\n  },\n  { type: 'divider' },\n  { label: 'Move to trash', variant: 'destructive' },\n]\n<\/script>\n\n<template>\n  <div class=\"more-menu-preview__stack\">\n    <MoreMenu :items=\"items\" label=\"File actions\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenuOption } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> items</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> MoreMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Rename'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-tools'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, endContent: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'⌘R'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Duplicate'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-copy'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, endContent: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'⌘D'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'divider'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'section'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    id: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'share'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    title: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Share'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    items: [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Copy link'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, icon: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'css-icon css-icon--sm i-carbon-copy'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Publish to the web'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, description: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Available on the team plan'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, isDisabled: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    ],</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'divider'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Move to trash'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, variant: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'destructive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"more-menu-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"File actions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/more-menu/sizes.vue?vue&type=script&setup=true&lang.ts
var sizes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "sizes",
	__ssrInlineRender: true,
	setup(__props) {
		const items = [
			{ label: "Edit" },
			{ label: "Duplicate" },
			{
				label: "Delete",
				variant: "destructive"
			}
		];
		const sizes = [
			{
				label: "sm",
				size: "sm"
			},
			{
				label: "md",
				size: "md"
			},
			{
				label: "lg",
				size: "lg"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "more-menu-preview__sizes" }, _attrs))}><!--[-->`);
			ssrRenderList(sizes, (item) => {
				_push(`<div class="more-menu-preview__size"><span class="more-menu-preview__size-label">${ssrInterpolate(item.label)}</span>`);
				_push(ssrRenderComponent(unref(_sfc_main), {
					items,
					"is-inline": "",
					"is-menu-open": "",
					label: `${item.label} menu`,
					size: item.size
				}, null, _parent));
				_push(`</div>`);
			});
			_push(`<!--]--></div>`);
		};
	}
});
//#endregion
//#region components/demos/more-menu/sizes.vue
var _sfc_setup$1 = sizes_vue_vue_type_script_setup_true_lang_default.setup;
sizes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/more-menu/sizes.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var sizes_default$1 = sizes_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/more-menu/sizes.vue?raw&highlighted
var sizes_default = {
	"source": "<script setup lang=\"ts\">\nimport type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'\nimport { MoreMenu } from '@astryx-vue/core/MoreMenu'\n\nconst items: MoreMenuOption[] = [\n  { label: 'Edit' },\n  { label: 'Duplicate' },\n  { label: 'Delete', variant: 'destructive' },\n]\n\nconst sizes = [\n  { label: 'sm', size: 'sm' as const },\n  { label: 'md', size: 'md' as const },\n  { label: 'lg', size: 'lg' as const },\n]\n<\/script>\n\n<template>\n  <div class=\"more-menu-preview__sizes\">\n    <div v-for=\"item in sizes\" :key=\"item.size\" class=\"more-menu-preview__size\">\n      <span class=\"more-menu-preview__size-label\">{{ item.label }}</span>\n      <MoreMenu\n        :items=\"items\"\n        is-inline\n        is-menu-open\n        :label=\"`${item.label} menu`\"\n        :size=\"item.size\"\n      />\n    </div>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenuOption } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> items</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> MoreMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Edit'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Duplicate'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Delete'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, variant: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'destructive'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> sizes</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'sm'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, size: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'sm'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> as</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> const</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'md'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, size: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'md'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> as</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> const</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'lg'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, size: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'lg'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> as</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> const</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"more-menu-preview__sizes\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-for</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"item in sizes\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> :key</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"item.size\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"more-menu-preview__size\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"more-menu-preview__size-label\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>{{ item.label }}&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        is-inline</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">        is-menu-open</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"`${</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">item</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">.</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">label</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">} menu`\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">item.size</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/more-menu/triggers.vue?vue&type=script&setup=true&lang.ts
var triggers_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "triggers",
	__ssrInlineRender: true,
	setup(__props) {
		const items = [{ label: "Edit" }, { label: "Duplicate" }];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "more-menu-preview__row" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				label: "Small",
				size: "sm"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				label: "Medium",
				size: "md"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				label: "Large",
				size: "lg"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				label: "Outlined trigger",
				variant: "secondary"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				disabled: "",
				label: "Unavailable actions"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				label: "Filter actions"
			}, {
				icon: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="css-icon i-carbon-filter"${_scopeId}></span>`);
					else return [createVNode("span", { class: "css-icon i-carbon-filter" })];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				items,
				label: "Touch actions",
				presentation: "adaptive"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/more-menu/triggers.vue
var _sfc_setup = triggers_vue_vue_type_script_setup_true_lang_default.setup;
triggers_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/more-menu/triggers.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var triggers_default$1 = triggers_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/more-menu/triggers.vue?raw&highlighted
var triggers_default = {
	"source": "<script setup lang=\"ts\">\nimport type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'\nimport { MoreMenu } from '@astryx-vue/core/MoreMenu'\n\nconst items: MoreMenuOption[] = [\n  { label: 'Edit' },\n  { label: 'Duplicate' },\n]\n<\/script>\n\n<template>\n  <div class=\"more-menu-preview__row\">\n    <MoreMenu :items=\"items\" label=\"Small\" size=\"sm\" />\n    <MoreMenu :items=\"items\" label=\"Medium\" size=\"md\" />\n    <MoreMenu :items=\"items\" label=\"Large\" size=\"lg\" />\n    <MoreMenu :items=\"items\" label=\"Outlined trigger\" variant=\"secondary\" />\n    <MoreMenu :items=\"items\" disabled label=\"Unavailable actions\" />\n    <MoreMenu :items=\"items\" label=\"Filter actions\">\n      <template #icon>\n        <span class=\"css-icon i-carbon-filter\" />\n      </template>\n    </MoreMenu>\n    <MoreMenu :items=\"items\" label=\"Touch actions\" presentation=\"adaptive\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenuOption } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { MoreMenu } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/MoreMenu'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> items</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> MoreMenuOption</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Edit'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Duplicate'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"more-menu-preview__row\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Small\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Medium\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"md\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Large\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"lg\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Outlined trigger\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> disabled</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Unavailable actions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Filter actions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">icon</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-filter\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">MoreMenu</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">items</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">items</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Touch actions\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> presentation</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"adaptive\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/more-menu/index.ts
var options = { className: "more-menu-preview" };
var moreMenuOverview = defineDemo(overview_default$1, overview_default, options);
var moreMenuBasic = defineDemo(basic_default$1, basic_default, options);
var moreMenuSections = defineDemo(sections_default$1, sections_default, options);
var moreMenuSizes = defineDemo(sizes_default$1, sizes_default, options);
var moreMenuTriggers = defineDemo(triggers_default$1, triggers_default, options);
//#endregion
export { moreMenuTriggers as a, moreMenuSizes as i, moreMenuOverview as n, moreMenuSections as r, moreMenuBasic as t };
