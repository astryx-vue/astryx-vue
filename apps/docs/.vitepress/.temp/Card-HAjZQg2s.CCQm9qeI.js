import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock, renderSlot, useTemplateRef } from "vue";
//#region ../../packages/core/dist/Card-HAjZQg2s.js
var _hoisted_1 = [
	"data-elevation",
	"data-padding",
	"data-scrollable",
	"data-variant"
];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxCard",
	__name: "Card",
	props: {
		height: {},
		maxWidth: {},
		minHeight: {},
		padding: {},
		variant: { default: "default" },
		elevation: { default: "none" },
		width: {}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const element = useTemplateRef("element");
		const hasFixedHeight = computed(() => props.height != null && props.height !== "auto");
		function formatSize(value) {
			if (value == null) return void 0;
			return typeof value === "number" ? `${value}px` : value;
		}
		const rootStyle = computed(() => ({
			height: formatSize(props.height),
			maxWidth: formatSize(props.maxWidth),
			minHeight: formatSize(props.minHeight),
			width: formatSize(props.width)
		}));
		__expose({ element });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "element",
				ref: element,
				class: "astryx-card",
				"data-elevation": __props.elevation,
				"data-padding": __props.padding,
				"data-scrollable": hasFixedHeight.value || void 0,
				"data-variant": __props.variant,
				style: normalizeStyle(rootStyle.value)
			}, [renderSlot(_ctx.$slots, "default")], 12, _hoisted_1);
		};
	}
});
//#endregion
export { _sfc_main as t };
