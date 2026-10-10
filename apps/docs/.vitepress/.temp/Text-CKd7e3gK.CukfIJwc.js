import { computed, createBlock, defineComponent, normalizeClass, normalizeStyle, openBlock, renderSlot, resolveDynamicComponent, withCtx } from "vue";
//#region ../../packages/core/dist/Text-CKd7e3gK.js
var _sfc_main = /*@__PURE__*/ defineComponent({
	__name: "Text",
	props: {
		type: { default: "body" },
		size: {},
		color: { default: "primary" },
		weight: {},
		display: { default: "inline" },
		as: { default: "span" },
		maxLines: { default: 0 }
	},
	setup(__props) {
		const props = __props;
		const classes = computed(() => [
			"astryx-text",
			`astryx-text--type-${props.type}`,
			props.size && `astryx-text--size-${props.size}`,
			`astryx-text--color-${props.color}`,
			props.weight && `astryx-text--weight-${props.weight}`,
			props.display === "block" && "astryx-text--block",
			props.maxLines === 1 && "astryx-text--truncate-single",
			props.maxLines > 1 && "astryx-text--truncate-multi"
		]);
		const style = computed(() => {
			if (props.maxLines > 1) return { WebkitLineClamp: props.maxLines };
			return {};
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.as), {
				class: normalizeClass(["astryx-text", classes.value]),
				style: normalizeStyle(style.value)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, ["class", "style"]);
		};
	}
});
//#endregion
export { _sfc_main as t };
