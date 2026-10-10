import { computed, createBlock, defineComponent, mergeProps, openBlock, renderSlot, resolveDynamicComponent, useAttrs, useTemplateRef, withCtx } from "vue";
//#region ../../packages/core/dist/VisuallyHidden-C7NN3VEP.js
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "VisuallyHidden",
	inheritAttrs: false,
	__name: "VisuallyHidden",
	props: { as: { default: "span" } },
	setup(__props, { expose: __expose }) {
		const attrs = useAttrs();
		const renderedRoot = useTemplateRef("root");
		const element = computed(() => {
			const root = renderedRoot.value;
			if (typeof HTMLElement === "undefined" || root == null) return null;
			if (root instanceof HTMLElement) return root;
			return root.$el instanceof HTMLElement ? root.$el : null;
		});
		function getForwardedAttrs() {
			return Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style"));
		}
		__expose({ element });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.as), mergeProps({
				ref: "root",
				class: "astryx-visually-hidden"
			}, getForwardedAttrs()), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
export { _sfc_main as t };
