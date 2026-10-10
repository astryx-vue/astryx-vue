import { t as _sfc_main$1 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { computed, createBlock, defineComponent, mergeProps, openBlock, renderSlot, unref, useAttrs, useTemplateRef, withCtx } from "vue";
//#region ../../packages/core/dist/IconButton-BNQuz9W_.js
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "IconButton",
	inheritAttrs: false,
	__name: "IconButton",
	props: {
		as: {},
		clickAction: { type: Function },
		elevation: {},
		form: {},
		href: {},
		isDisabled: { type: Boolean },
		isInterruptible: { type: Boolean },
		isLoading: { type: Boolean },
		label: {},
		loadingLabel: {},
		name: {},
		rel: {},
		size: {},
		target: {},
		tooltip: {},
		type: {},
		value: {},
		variant: {},
		width: {}
	},
	emits: ["click"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const emit = __emit;
		const attrs = useAttrs();
		const button = useTemplateRef("button");
		__expose({ element: computed(() => button.value?.element ?? null) });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(_sfc_main$1, mergeProps({
				ref_key: "button",
				ref: button
			}, unref(attrs), {
				as: __props.as,
				"click-action": __props.clickAction,
				elevation: __props.elevation,
				form: __props.form,
				href: __props.href,
				"is-disabled": __props.isDisabled,
				"is-icon-only": "",
				"is-interruptible": __props.isInterruptible,
				"is-loading": __props.isLoading,
				label: __props.label,
				"loading-label": __props.loadingLabel,
				name: __props.name,
				rel: __props.rel,
				size: __props.size,
				target: __props.target,
				tooltip: __props.tooltip,
				type: __props.type,
				value: __props.value,
				variant: __props.variant,
				width: __props.width,
				onClick: _cache[0] || (_cache[0] = ($event) => emit("click", $event))
			}), {
				icon: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as",
				"click-action",
				"elevation",
				"form",
				"href",
				"is-disabled",
				"is-interruptible",
				"is-loading",
				"label",
				"loading-label",
				"name",
				"rel",
				"size",
				"target",
				"tooltip",
				"type",
				"value",
				"variant",
				"width"
			]);
		};
	}
});
//#endregion
export { _sfc_main as t };
