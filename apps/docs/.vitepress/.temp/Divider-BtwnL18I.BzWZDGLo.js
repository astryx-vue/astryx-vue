import { computed, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, defineComponent, mergeProps, openBlock, renderSlot, toDisplayString, useAttrs, useId, useSlots } from "vue";
//#region ../../packages/core/dist/Divider-BtwnL18I.js
var _hoisted_1 = [
	"aria-orientation",
	"aria-labelledby",
	"data-orientation",
	"data-variant",
	"data-full-bleed"
];
var _hoisted_2 = {
	key: 1,
	class: "astryx-divider__rule"
};
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxDivider",
	inheritAttrs: false,
	__name: "Divider",
	props: {
		orientation: { default: "horizontal" },
		label: {},
		variant: { default: "subtle" },
		isFullBleed: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		const attrs = useAttrs();
		const slots = useSlots();
		const labelId = `astryx-divider-label-${useId()}`;
		const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label));
		const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "aria-labelledby")));
		const labelledBy = computed(() => {
			const explicit = attrs["aria-labelledby"];
			if (explicit) return explicit;
			return hasLabel.value && !attrs["aria-label"] ? labelId : void 0;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps(rootAttrs.value, {
				class: "astryx-divider",
				role: "separator",
				"aria-orientation": __props.orientation,
				"aria-labelledby": labelledBy.value,
				"data-orientation": __props.orientation,
				"data-variant": __props.variant,
				"data-full-bleed": __props.isFullBleed || void 0
			}), [
				_cache[0] || (_cache[0] = createElementVNode("div", { class: "astryx-divider__rule" }, null, -1)),
				hasLabel.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					id: labelId,
					class: "astryx-divider__label"
				}, [renderSlot(_ctx.$slots, "label", {}, () => [createTextVNode(toDisplayString(__props.label), 1)])])) : createCommentVNode("v-if", true),
				hasLabel.value ? (openBlock(), createElementBlock("div", _hoisted_2)) : createCommentVNode("v-if", true)
			], 16, _hoisted_1);
		};
	}
});
//#endregion
export { _sfc_main as t };
