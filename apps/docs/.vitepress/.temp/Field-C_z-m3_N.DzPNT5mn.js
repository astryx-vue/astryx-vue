import "./field.DV8BOXNO.js";
import { n as _sfc_main$1, t as _sfc_main$2 } from "./FieldStatus-oky4OlFa.B9OodlnZ.js";
import { computed, createElementBlock, createElementVNode, createSlots, createVNode, defineComponent, guardReactiveProps, normalizeProps, normalizeStyle, openBlock, renderSlot, useTemplateRef, withCtx } from "vue";
//#region ../../packages/core/dist/Field-C_z-m3_N.js
var _hoisted_1 = ["data-status-variant", "data-group-label"];
var _hoisted_2 = { class: "astryx-field-control" };
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxField",
	__name: "Field",
	props: {
		status: {},
		statusVariant: { default: "attached" },
		width: {},
		label: {},
		inputId: {},
		labelId: {},
		isGroupLabel: { type: Boolean },
		isLabelHidden: { type: Boolean },
		isDisabled: { type: Boolean },
		isOptional: { type: Boolean },
		isRequired: { type: Boolean },
		description: {},
		descriptionId: {},
		labelIcon: {},
		labelTooltip: {},
		optionalLabel: {},
		requiredLabel: {}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		__expose({ element: useTemplateRef("field") });
		const slotProps = computed(() => {
			const descriptionId = props.description ? props.descriptionId ?? `${props.inputId}-description` : void 0;
			const statusId = props.status?.message ? props.status.messageId ?? `${props.inputId}-status` : void 0;
			return {
				inputId: props.inputId,
				labelId: props.labelId ?? `${props.inputId}-label`,
				descriptionId,
				statusId,
				describedBy: [descriptionId, statusId].filter(Boolean).join(" ") || void 0
			};
		});
		const style = computed(() => ({ "--astryx-field-width": typeof props.width === "number" ? `${props.width}px` : props.width }));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref: "field",
				class: "astryx-field",
				style: normalizeStyle(style.value),
				"data-status-variant": __props.statusVariant,
				"data-group-label": __props.isGroupLabel || void 0
			}, [createVNode(_sfc_main$1, {
				label: __props.label,
				"input-id": __props.inputId,
				"label-id": slotProps.value.labelId,
				description: __props.description,
				"description-id": slotProps.value.descriptionId,
				"is-group-label": __props.isGroupLabel,
				"is-label-hidden": __props.isLabelHidden,
				"is-disabled": __props.isDisabled,
				"is-optional": __props.isOptional,
				"is-required": __props.isRequired,
				"label-icon": __props.labelIcon,
				"label-tooltip": __props.labelTooltip,
				"optional-label": __props.optionalLabel,
				"required-label": __props.requiredLabel
			}, createSlots({ _: 2 }, [_ctx.$slots.labelIcon ? {
				name: "labelIcon",
				fn: withCtx(() => [renderSlot(_ctx.$slots, "labelIcon")]),
				key: "0"
			} : void 0]), 1032, [
				"label",
				"input-id",
				"label-id",
				"description",
				"description-id",
				"is-group-label",
				"is-label-hidden",
				"is-disabled",
				"is-optional",
				"is-required",
				"label-icon",
				"label-tooltip",
				"optional-label",
				"required-label"
			]), createElementVNode("div", _hoisted_2, [renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(slotProps.value))), createVNode(_sfc_main$2, {
				id: slotProps.value.statusId,
				type: __props.status?.type ?? "success",
				message: __props.status?.message ?? "",
				variant: __props.statusVariant === "tooltip" ? "attached" : __props.statusVariant,
				"is-visually-hidden": __props.statusVariant === "tooltip"
			}, null, 8, [
				"id",
				"type",
				"message",
				"variant",
				"is-visually-hidden"
			])])], 12, _hoisted_1);
		};
	}
});
//#endregion
export { _sfc_main as t };
