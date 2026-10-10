import { n as listContextKey, r as useListContext, t as _sfc_main$2 } from "./Item-C1z6gXn8.BTlOygNj.js";
import { computed, createBlock, createElementBlock, createElementVNode, createSlots, createTextVNode, defineComponent, mergeProps, openBlock, provide, renderSlot, resolveDynamicComponent, toDisplayString, unref, useAttrs, useId, useSlots, useTemplateRef, withCtx } from "vue";
//#region ../../packages/core/dist/ListItem-pGxvn6QJ.js
var _hoisted_1$1 = {
	key: 0,
	class: "astryx-list-root"
};
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxList",
	inheritAttrs: false,
	__name: "List",
	props: {
		density: { default: "balanced" },
		hasDividers: {
			type: Boolean,
			default: false
		},
		edgeCompensation: {},
		listStyle: { default: "none" },
		start: { default: 1 },
		header: {}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const CONTROLLED_ATTRS = /* @__PURE__ */ new Set([
			"class",
			"style",
			"role",
			"start"
		]);
		const attrs = useAttrs();
		const slots = useSlots();
		const listElement = useTemplateRef("list");
		const headerId = `astryx-list-header-${useId()}`;
		const hasHeader = computed(() => slots.header != null || props.header != null);
		const tag = computed(() => props.listStyle === "decimal" ? "ol" : "ul");
		const hasStartAttribute = computed(() => props.listStyle === "decimal" && props.start !== 1);
		const counterStart = computed(() => hasStartAttribute.value ? `astryx-list ${props.start - 1}` : void 0);
		provide(listContextKey, {
			density: computed(() => props.density),
			edgeCompensation: computed(() => props.edgeCompensation),
			hasDividers: computed(() => props.hasDividers),
			listStyle: computed(() => props.listStyle)
		});
		const listStyleValue = computed(() => [attrs.style, counterStart.value == null ? void 0 : { counterReset: counterStart.value }]);
		const listAttrs = computed(() => {
			return {
				...Object.fromEntries(Object.entries(attrs).filter(([key]) => !CONTROLLED_ATTRS.has(key))),
				"role": "list",
				"start": hasStartAttribute.value ? props.start : void 0,
				"data-density": props.density,
				"data-dividers": props.hasDividers || void 0,
				"data-edge-compensation": props.edgeCompensation,
				"data-list-style": props.listStyle,
				...hasHeader.value ? { "aria-labelledby": headerId } : void 0
			};
		});
		__expose({ element: computed(() => listElement.value) });
		return (_ctx, _cache) => {
			return hasHeader.value ? (openBlock(), createElementBlock("div", _hoisted_1$1, [createElementVNode("div", {
				id: headerId,
				class: "astryx-list-header"
			}, [renderSlot(_ctx.$slots, "header", {}, () => [createTextVNode(toDisplayString(__props.header), 1)])]), (openBlock(), createBlock(resolveDynamicComponent(tag.value), mergeProps({ ref: "list" }, listAttrs.value, {
				class: ["astryx-list", unref(attrs).class],
				style: listStyleValue.value
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["class", "style"]))])) : (openBlock(), createBlock(resolveDynamicComponent(tag.value), mergeProps({
				key: 1,
				ref: "list"
			}, listAttrs.value, {
				class: ["astryx-list", unref(attrs).class],
				style: listStyleValue.value
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["class", "style"]));
		};
	}
});
var _hoisted_1 = {
	key: 0,
	class: "astryx-list-marker"
};
var _hoisted_2 = ["data-shape"];
var _hoisted_3 = ["data-style"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxListItem",
	__name: "ListItem",
	props: {
		label: {},
		description: {},
		density: {},
		onClick: { type: Function },
		interactiveRef: {},
		href: {},
		target: {},
		rel: {},
		isDisabled: { type: Boolean },
		isSelected: { type: Boolean }
	},
	setup(__props) {
		const props = __props;
		const list = useListContext();
		const density = computed(() => props.density ?? list?.density.value ?? "balanced");
		const marker = computed(() => {
			const listStyle = list?.listStyle.value ?? "none";
			return listStyle === "none" ? null : listStyle;
		});
		const isBullet = computed(() => marker.value === "disc" || marker.value === "circle");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(_sfc_main$2, {
				as: "li",
				class: "astryx-list-item",
				description: __props.description,
				density: density.value,
				href: __props.href,
				"interactive-ref": __props.interactiveRef,
				"is-disabled": __props.isDisabled,
				"is-selected": __props.isSelected,
				label: __props.label,
				"on-click": __props.onClick,
				rel: __props.rel,
				target: __props.target
			}, createSlots({ _: 2 }, [
				marker.value ? {
					name: "marker",
					fn: withCtx(() => [isBullet.value ? (openBlock(), createElementBlock("span", _hoisted_1, [createElementVNode("span", {
						class: "astryx-list-marker__glyph",
						"data-shape": marker.value
					}, null, 8, _hoisted_2)])) : (openBlock(), createElementBlock("span", {
						key: 1,
						class: "astryx-list-marker__number",
						"data-style": marker.value
					}, null, 8, _hoisted_3))]),
					key: "0"
				} : void 0,
				_ctx.$slots.startContent ? {
					name: "startContent",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "startContent")]),
					key: "1"
				} : void 0,
				_ctx.$slots.label ? {
					name: "label",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "label")]),
					key: "2"
				} : void 0,
				_ctx.$slots.description ? {
					name: "description",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "description")]),
					key: "3"
				} : void 0,
				_ctx.$slots.endContent ? {
					name: "endContent",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "endContent")]),
					key: "4"
				} : void 0
			]), 1032, [
				"description",
				"density",
				"href",
				"interactive-ref",
				"is-disabled",
				"is-selected",
				"label",
				"on-click",
				"rel",
				"target"
			]);
		};
	}
});
//#endregion
export { _sfc_main$1 as n, _sfc_main as t };
