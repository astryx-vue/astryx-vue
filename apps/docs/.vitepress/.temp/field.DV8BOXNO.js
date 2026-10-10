import { Fragment, createElementBlock, createElementVNode, defineComponent, openBlock } from "vue";
//#region ../../packages/core/dist/FieldIcon--NTgW5IU.js
var _hoisted_1 = {
	class: "astryx-field-icon",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.5",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true",
	focusable: "false"
};
var _hoisted_2 = {
	key: 0,
	d: "m4 4 8 8M12 4l-8 8"
};
var _hoisted_3 = {
	key: 0,
	d: "m5 8 2 2 4-4"
};
var _hoisted_4 = {
	key: 1,
	d: "M8 4.5v4m0 3v.1"
};
var _hoisted_5 = {
	key: 2,
	d: "M8 7v4m0-7v.1"
};
var _sfc_main = /*@__PURE__*/ defineComponent({
	__name: "FieldIcon",
	props: { type: {} },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", _hoisted_1, [__props.type === "clear" ? (openBlock(), createElementBlock("path", _hoisted_2)) : __props.type === "warning" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [_cache[0] || (_cache[0] = createElementVNode("path", { d: "M8 2 1.5 13h13L8 2Z" }, null, -1)), _cache[1] || (_cache[1] = createElementVNode("path", { d: "M8 6v3m0 2v.1" }, null, -1))], 64)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [_cache[2] || (_cache[2] = createElementVNode("circle", {
				cx: "8",
				cy: "8",
				r: "6"
			}, null, -1)), __props.type === "success" ? (openBlock(), createElementBlock("path", _hoisted_3)) : __props.type === "error" ? (openBlock(), createElementBlock("path", _hoisted_4)) : (openBlock(), createElementBlock("path", _hoisted_5))], 64))]);
		};
	}
});
//#endregion
export { _sfc_main as t };
