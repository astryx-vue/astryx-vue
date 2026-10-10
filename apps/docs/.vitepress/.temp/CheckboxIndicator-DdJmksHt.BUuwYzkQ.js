import { createElementBlock, createElementVNode, defineComponent, mergeProps, openBlock, renderSlot, useAttrs, useTemplateRef } from "vue";
//#region ../../packages/core/dist/CheckboxIndicator-DdJmksHt.js
var _hoisted_1 = [
	"data-state",
	"data-size",
	"data-disabled"
];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxCheckboxIndicator",
	inheritAttrs: false,
	__name: "CheckboxIndicator",
	props: {
		state: {},
		size: { default: "md" },
		isDisabled: { type: Boolean }
	},
	setup(__props, { expose: __expose }) {
		const attrs = useAttrs();
		__expose({ element: useTemplateRef("indicator") });
		function decorativeAttrs() {
			return Object.fromEntries(Object.entries(attrs).filter(([key]) => !key.startsWith("aria-") && ![
				"role",
				"tabindex",
				"contenteditable"
			].includes(key)));
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", mergeProps(decorativeAttrs(), {
				ref: "indicator",
				class: "astryx-checkbox-indicator",
				"aria-hidden": "true",
				"data-state": __props.state,
				"data-size": __props.size,
				"data-disabled": __props.isDisabled || void 0
			}), [renderSlot(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = createElementVNode("svg", {
				class: "astryx-checkbox-indicator-check",
				viewBox: "0 0 10 10",
				focusable: "false"
			}, [createElementVNode("path", {
				d: "M8.5 2.5L4 7.5L1.5 5",
				stroke: "currentColor",
				"stroke-width": "1.5",
				fill: "none",
				"stroke-linecap": "round",
				"stroke-linejoin": "round"
			})], -1)), _cache[1] || (_cache[1] = createElementVNode("span", { class: "astryx-checkbox-indicator-dash" }, null, -1))])], 16, _hoisted_1);
		};
	}
});
//#endregion
export { _sfc_main as t };
