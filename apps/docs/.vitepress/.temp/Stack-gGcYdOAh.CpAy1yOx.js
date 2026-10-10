import { computed, createBlock, defineComponent, mergeProps, openBlock, renderSlot, resolveDynamicComponent, useAttrs, withCtx } from "vue";
//#region ../../packages/core/dist/Stack-gGcYdOAh.js
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "Stack",
	inheritAttrs: false,
	__name: "Stack",
	props: {
		align: {},
		as: { default: "div" },
		direction: { default: "vertical" },
		gap: {},
		height: {},
		hAlign: {},
		isScrollable: {
			type: Boolean,
			default: false
		},
		justify: {},
		maxWidth: {},
		minHeight: {},
		padding: {},
		paddingBlock: {},
		paddingInline: {},
		vAlign: {},
		width: {},
		wrap: { default: "nowrap" }
	},
	setup(__props) {
		const props = __props;
		const attrs = useAttrs();
		const spacingVariables = {
			0: "var(--astryx-spacing-0, 0px)",
			.5: "var(--astryx-spacing-0-5, 2px)",
			1: "var(--astryx-spacing-1, 4px)",
			1.5: "var(--astryx-spacing-1-5, 6px)",
			2: "var(--astryx-spacing-2, 8px)",
			3: "var(--astryx-spacing-3, 12px)",
			4: "var(--astryx-spacing-4, 16px)",
			5: "var(--astryx-spacing-5, 20px)",
			6: "var(--astryx-spacing-6, 24px)",
			8: "var(--astryx-spacing-8, 32px)",
			10: "var(--astryx-spacing-10, 40px)"
		};
		function formatSize(value) {
			if (value == null) return void 0;
			return typeof value === "number" ? `${value}px` : value;
		}
		const resolvedHAlign = computed(() => props.hAlign ?? (props.direction === "horizontal" ? props.justify : props.align));
		const resolvedVAlign = computed(() => props.vAlign ?? (props.direction === "horizontal" ? props.align : props.justify));
		const mainAlign = computed(() => props.direction === "horizontal" ? resolvedHAlign.value : resolvedVAlign.value);
		const crossAlign = computed(() => props.direction === "horizontal" ? resolvedVAlign.value : resolvedHAlign.value);
		const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
		const rootClass = computed(() => ["astryx-stack", attrs.class]);
		const rootStyle = computed(() => {
			const paddingInline = props.paddingInline ?? props.padding;
			const paddingBlock = props.paddingBlock ?? props.padding;
			const stackStyle = {
				height: formatSize(props.height),
				maxWidth: formatSize(props.maxWidth),
				minHeight: formatSize(props.minHeight),
				width: formatSize(props.width)
			};
			stackStyle["--astryx-stack-gap"] = props.gap == null ? void 0 : spacingVariables[props.gap];
			stackStyle["--astryx-stack-padding-block"] = paddingBlock == null ? void 0 : spacingVariables[paddingBlock];
			stackStyle["--astryx-stack-padding-inline"] = paddingInline == null ? void 0 : spacingVariables[paddingInline];
			return [attrs.style, stackStyle];
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.as), mergeProps(forwardedAttrs.value, {
				class: rootClass.value,
				"data-cross-align": crossAlign.value,
				"data-direction": __props.direction,
				"data-main-align": mainAlign.value,
				"data-scrollable": __props.isScrollable || void 0,
				"data-wrap": __props.wrap,
				style: rootStyle.value
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"class",
				"data-cross-align",
				"data-direction",
				"data-main-align",
				"data-scrollable",
				"data-wrap",
				"style"
			]);
		};
	}
});
//#endregion
export { _sfc_main as t };
