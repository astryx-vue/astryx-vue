import { t as _sfc_main$3 } from "./Stack-gGcYdOAh.CpAy1yOx.js";
import { computed, createBlock, defineComponent, mergeProps, openBlock, renderSlot, resolveDynamicComponent, useAttrs, withCtx } from "vue";
//#region ../../packages/core/dist/Stack-iv52y_Jv.js
var _sfc_main$2 = /*@__PURE__*/ defineComponent({
	name: "HStack",
	__name: "HStack",
	props: {
		hAlign: {},
		vAlign: {},
		align: {},
		as: {},
		gap: {},
		height: {},
		isScrollable: { type: Boolean },
		justify: {},
		maxWidth: {},
		minHeight: {},
		padding: {},
		paddingBlock: {},
		paddingInline: {},
		width: {},
		wrap: {}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(_sfc_main$3, mergeProps(props, { direction: "horizontal" }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "StackItem",
	inheritAttrs: false,
	__name: "StackItem",
	props: {
		as: { default: "div" },
		crossAlignSelf: {},
		isScrollable: {
			type: Boolean,
			default: false
		},
		size: { default: "static" }
	},
	setup(__props) {
		const attrs = useAttrs();
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
		const rootClass = computed(() => ["astryx-stack-item", attrs.class]);
		const rootStyle = computed(() => attrs.style);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.as), mergeProps(forwardedAttrs.value, {
				class: rootClass.value,
				"data-cross-align-self": __props.crossAlignSelf,
				"data-scrollable": __props.isScrollable || void 0,
				"data-size": __props.size,
				style: rootStyle.value
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"class",
				"data-cross-align-self",
				"data-scrollable",
				"data-size",
				"style"
			]);
		};
	}
});
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "VStack",
	__name: "VStack",
	props: {
		hAlign: {},
		vAlign: {},
		align: {},
		as: {},
		gap: {},
		height: {},
		isScrollable: { type: Boolean },
		justify: {},
		maxWidth: {},
		minHeight: {},
		padding: {},
		paddingBlock: {},
		paddingInline: {},
		width: {},
		wrap: {}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(_sfc_main$3, mergeProps(props, { direction: "vertical" }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { _sfc_main$1 as n, _sfc_main$2 as r, _sfc_main as t };
