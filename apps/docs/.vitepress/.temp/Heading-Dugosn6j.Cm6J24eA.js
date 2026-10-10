import { computed, createBlock, defineComponent, normalizeClass, normalizeStyle, openBlock, renderSlot, resolveDynamicComponent, withCtx } from "vue";
//#region ../../packages/core/dist/Heading-Dugosn6j.js
var _sfc_main = /*@__PURE__*/ defineComponent({
	__name: "Heading",
	props: {
		level: {},
		type: {},
		color: { default: "primary" },
		weight: {},
		display: { default: "block" },
		maxLines: { default: 0 }
	},
	setup(__props) {
		const props = __props;
		const tag = computed(() => `h${props.level}`);
		const classes = computed(() => [
			"astryx-heading",
			`astryx-heading--level-${props.level}`,
			props.type && `astryx-heading--type-${props.type}`,
			`astryx-heading--color-${props.color}`,
			props.weight && `astryx-heading--weight-${props.weight}`,
			props.display === "inline" && "astryx-heading--inline",
			props.maxLines === 1 && "astryx-heading--truncate-single",
			props.maxLines > 1 && "astryx-heading--truncate-multi"
		]);
		const style = computed(() => {
			if (props.maxLines > 1) return { WebkitLineClamp: props.maxLines };
			return {};
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(tag.value), {
				class: normalizeClass(["astryx-heading", classes.value]),
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
