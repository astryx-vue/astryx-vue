import { computed, createBlock, createCommentVNode, createElementBlock, createTextVNode, defineComponent, inject, mergeProps, normalizeClass, normalizeStyle, openBlock, provide, renderSlot, resolveDynamicComponent, toDisplayString, toValue, unref, useAttrs, useId, useSlots, useTemplateRef, withCtx } from "vue";
//#region ../../packages/core/dist/Item-C1z6gXn8.js
var listContextKey = Symbol("astryx-list-context");
/** The surrounding list, or `undefined` when the row stands alone. */
function useListContext() {
	return inject(listContextKey, void 0);
}
var itemDescriptionContextKey = Symbol("astryx-item-description");
var _hoisted_1 = {
	key: 0,
	class: "astryx-item__start"
};
var _hoisted_2 = {
	key: 1,
	class: "astryx-item__end"
};
var NATIVE_CONTROL_SELECTOR = "button, a, input, select, textarea";
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxItem",
	inheritAttrs: false,
	__name: "Item",
	props: {
		as: { default: "div" },
		align: { default: "center" },
		layout: { default: "stacked" },
		labelLines: {},
		descriptionLines: {},
		isHighlighted: {
			type: Boolean,
			default: false
		},
		label: {},
		description: {},
		density: { default: "balanced" },
		onClick: {},
		interactiveRef: {},
		href: {},
		target: {},
		rel: {},
		isDisabled: {
			type: Boolean,
			default: false
		},
		isSelected: {
			type: Boolean,
			default: false
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const ARIA_SELECTED_ROLES = /* @__PURE__ */ new Set([
			"option",
			"tab",
			"row",
			"gridcell",
			"columnheader",
			"rowheader",
			"treeitem"
		]);
		const INTERACTIVE_SELECTOR = [
			"button",
			"a",
			"input",
			"select",
			"textarea",
			"[role=\"button\"]",
			"[role=\"link\"]",
			"[role=\"checkbox\"]",
			"[role=\"radio\"]",
			"[role=\"switch\"]",
			"[role=\"tab\"]",
			"[role=\"menuitem\"]",
			"[role=\"option\"]",
			"[role=\"combobox\"]",
			"[role=\"listbox\"]",
			"[role=\"slider\"]",
			"[role=\"spinbutton\"]"
		].join(",");
		const CONTROLLED_ATTRS = /* @__PURE__ */ new Set([
			"class",
			"style",
			"role",
			"aria-current",
			"aria-disabled",
			"aria-selected"
		]);
		const attrs = useAttrs();
		const slots = useSlots();
		const root = useTemplateRef("root");
		function isRenderable(value) {
			return value != null && value !== "";
		}
		function isInteractiveElement(element) {
			return element.matches(INTERACTIVE_SELECTOR) && !element.matches("[aria-readonly=\"true\"]");
		}
		function toElement(value) {
			if (value == null) return null;
			if (value instanceof HTMLElement) return value;
			return value.$el instanceof HTMLElement ? value.$el : null;
		}
		const element = computed(() => toElement(root.value));
		const descriptionIdBase = `astryx-item-description-${useId()}`;
		const hasDescription = computed(() => slots.description != null || isRenderable(props.description));
		const hasLabel = computed(() => slots.label != null || isRenderable(props.label));
		provide(itemDescriptionContextKey, computed(() => hasDescription.value ? descriptionIdBase : null));
		const role = computed(() => attrs.role);
		const hasParentRole = computed(() => role.value != null);
		const allowsAriaSelected = computed(() => role.value != null && ARIA_SELECTED_ROLES.has(role.value));
		const ariaCurrent = computed(() => attrs["aria-current"] ?? (props.isSelected && !allowsAriaSelected.value ? true : void 0));
		const isDelegate = computed(() => props.interactiveRef != null);
		const isInteractive = computed(() => props.onClick != null || props.href != null || isDelegate.value);
		const isLinkRoot = computed(() => typeof props.as !== "string" && props.href != null);
		const resolvedTarget = computed(() => props.target);
		const resolvedRel = computed(() => {
			const tokens = new Set((props.rel ?? "").split(/\s+/).filter(Boolean));
			if (resolvedTarget.value === "_blank") {
				tokens.add("noopener");
				tokens.add("noreferrer");
			}
			return tokens.size > 0 ? [...tokens].join(" ") : void 0;
		});
		const isInline = computed(() => props.layout === "inline" && hasDescription.value);
		function clampClass(lines) {
			if (lines === 1) return "astryx-item__ellipsis";
			return lines > 1 ? "astryx-item__clamp" : void 0;
		}
		function clampStyle(lines) {
			return lines > 1 ? { "--astryx-item-clamp-lines": String(lines) } : void 0;
		}
		const labelClamp = computed(() => props.labelLines ?? (typeof props.label === "string" ? 1 : 0));
		const descriptionClamp = computed(() => {
			if (props.descriptionLines != null) return props.descriptionLines;
			return typeof props.description === "string" || isInline.value ? 1 : 0;
		});
		const labelClasses = computed(() => clampClass(labelClamp.value));
		const labelStyle = computed(() => clampStyle(labelClamp.value));
		const descriptionClasses = computed(() => clampClass(descriptionClamp.value));
		const descriptionStyle = computed(() => clampStyle(descriptionClamp.value));
		const contentTag = computed(() => {
			if (hasParentRole.value || isDelegate.value) return "span";
			if (props.href != null && !isLinkRoot.value) return "a";
			return props.onClick != null ? "button" : "span";
		});
		function handleContentClick(event) {
			props.onClick?.(event);
		}
		const contentAttrs = computed(() => {
			if (contentTag.value === "a") return {
				"href": props.href,
				"rel": resolvedRel.value,
				"target": resolvedTarget.value,
				"aria-disabled": props.isDisabled || void 0,
				"tabindex": props.isDisabled ? -1 : void 0
			};
			if (contentTag.value === "button") return {
				type: "button",
				disabled: props.isDisabled,
				onClick: handleContentClick
			};
			return {};
		});
		function hasTextSelection(node) {
			const selection = node.ownerDocument.getSelection?.();
			return selection != null && !selection.isCollapsed && selection.anchorNode != null && node.contains(selection.anchorNode);
		}
		function hasInteractiveAncestor(target, container) {
			let current = target;
			while (current != null && current !== container && current !== container.ownerDocument.body) {
				if (isInteractiveElement(current)) return true;
				current = current.parentElement;
			}
			return false;
		}
		function handleContainerClick(event) {
			if (props.isDisabled) return;
			const target = event.target;
			if (target instanceof HTMLElement && target.closest(NATIVE_CONTROL_SELECTOR) != null) return;
			props.onClick?.(event);
		}
		function handleDelegatedClick(event) {
			if (props.isDisabled) return;
			const container = element.value;
			const target = event.target;
			if (container == null || !(target instanceof HTMLElement)) return;
			if (hasTextSelection(container)) return;
			if (target !== event.currentTarget && hasInteractiveAncestor(target, container)) return;
			const control = toValue(props.interactiveRef);
			if (control == null) return;
			control.dispatchEvent(new MouseEvent("click", {
				altKey: event.altKey,
				bubbles: event.bubbles,
				button: event.button,
				cancelable: event.cancelable,
				ctrlKey: event.ctrlKey,
				metaKey: event.metaKey,
				shiftKey: event.shiftKey
			}));
			event.stopPropagation();
		}
		const rootClick = computed(() => {
			if (isDelegate.value) return handleDelegatedClick;
			if (hasParentRole.value) return props.onClick;
			return isInteractive.value ? handleContainerClick : void 0;
		});
		const rootClass = computed(() => ["astryx-item", attrs.class]);
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !CONTROLLED_ATTRS.has(key))));
		function focus(options) {
			(element.value?.querySelector("a[href], button:not([disabled])"))?.focus(options);
		}
		function blur() {
			const active = element.value?.ownerDocument.activeElement;
			if (active instanceof HTMLElement && element.value?.contains(active)) active.blur();
		}
		__expose({
			element,
			focus,
			blur
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.as), mergeProps({
				ref_key: "root",
				ref: root
			}, forwardedAttrs.value, {
				"aria-current": ariaCurrent.value,
				"aria-disabled": __props.isDisabled || void 0,
				"aria-selected": allowsAriaSelected.value && __props.isSelected ? true : void 0,
				class: rootClass.value,
				"data-align": __props.align,
				"data-density": __props.density,
				"data-disabled": __props.isDisabled || void 0,
				"data-highlighted": __props.isHighlighted || void 0,
				"data-inert": __props.isDisabled && !hasParentRole.value ? true : void 0,
				"data-interactive": isInteractive.value || void 0,
				"data-selected": __props.isSelected || void 0,
				role: role.value,
				style: unref(attrs).style,
				onClick: rootClick.value
			}), {
				default: withCtx(() => [
					renderSlot(_ctx.$slots, "marker"),
					_ctx.$slots.startContent ? (openBlock(), createElementBlock("span", _hoisted_1, [renderSlot(_ctx.$slots, "startContent")])) : createCommentVNode("v-if", true),
					(openBlock(), createBlock(resolveDynamicComponent(contentTag.value), mergeProps(contentAttrs.value, { class: ["astryx-item__content", { "astryx-item__content--inline": isInline.value }] }), {
						default: withCtx(() => [hasLabel.value ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: normalizeClass(["astryx-item__label", labelClasses.value]),
							style: normalizeStyle(labelStyle.value)
						}, [renderSlot(_ctx.$slots, "label", {}, () => [createTextVNode(toDisplayString(__props.label), 1)])], 6)) : createCommentVNode("v-if", true), hasDescription.value ? (openBlock(), createElementBlock("span", {
							key: 1,
							id: descriptionIdBase,
							class: normalizeClass(["astryx-item__description", descriptionClasses.value]),
							style: normalizeStyle(descriptionStyle.value)
						}, [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(__props.description), 1)])], 6)) : createCommentVNode("v-if", true)]),
						_: 3
					}, 16, ["class"])),
					_ctx.$slots.endContent ? (openBlock(), createElementBlock("span", _hoisted_2, [renderSlot(_ctx.$slots, "endContent")])) : createCommentVNode("v-if", true)
				]),
				_: 3
			}, 16, [
				"aria-current",
				"aria-disabled",
				"aria-selected",
				"class",
				"data-align",
				"data-density",
				"data-disabled",
				"data-highlighted",
				"data-inert",
				"data-interactive",
				"data-selected",
				"role",
				"style",
				"onClick"
			]);
		};
	}
});
//#endregion
export { listContextKey as n, useListContext as r, _sfc_main as t };
