import { createElementBlock, defineComponent, openBlock, renderSlot } from "vue";
//#region ../../packages/core/dist/Badge-Ba0EwsTj.js
var _hoisted_1 = ["data-variant"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "Badge",
	__name: "Badge",
	props: { variant: { default: "neutral" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				class: "astryx-badge",
				"data-variant": __props.variant
			}, [renderSlot(_ctx.$slots, "icon"), renderSlot(_ctx.$slots, "default")], 8, _hoisted_1);
		};
	}
});
//#endregion
export { _sfc_main as t };
