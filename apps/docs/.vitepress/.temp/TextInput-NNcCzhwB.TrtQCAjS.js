import { t as _sfc_main$1 } from "./VisuallyHidden-C7NN3VEP.DAKckTtZ.js";
import { n as _sfc_main$2 } from "./eventHandlers-DUXzBWZy.C50IdnRl.js";
import { n as _sfc_main$1$1, r as useButtonTooltip } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$3 } from "./field.DV8BOXNO.js";
import { t as _sfc_main$4 } from "./IconButton-BNQuz9W_.CvHMrKbO.js";
import { r as _sfc_main$2$1 } from "./FieldStatus-oky4OlFa.B9OodlnZ.js";
import { t as _sfc_main$5 } from "./Field-C_z-m3_N.DzPNT5mn.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, nextTick, normalizeClass, normalizeStyle, onMounted, openBlock, renderSlot, resolveDynamicComponent, shallowRef, toDisplayString, toRaw, unref, useAttrs, useId, useModel, useTemplateRef, watch, withCtx } from "vue";
//#region ../../packages/core/dist/TextInput-NNcCzhwB.js
function useTextInputAction(options) {
	const optimistic = shallowRef(null);
	const pendingCount = shallowRef(0);
	let revision = 0;
	watch(options.model, () => {
		optimistic.value = null;
	});
	function commit(value, event) {
		const current = ++revision;
		const changeEvent = new CustomEvent("change", {
			cancelable: true,
			detail: {
				value,
				originalEvent: event
			}
		});
		if (event.defaultPrevented) changeEvent.preventDefault();
		optimistic.value = value;
		options.model.value = value;
		options.emitChange(value, changeEvent);
		const action = options.changeAction();
		if (!action || changeEvent.defaultPrevented) {
			optimistic.value = null;
			return;
		}
		pendingCount.value += 1;
		const finish = () => {
			pendingCount.value -= 1;
			if (current === revision) optimistic.value = null;
		};
		try {
			const result = action(value, changeEvent);
			if (result == null) {
				finish();
				return;
			}
			Promise.resolve(result).then(finish, (error) => {
				finish();
				options.emitError(error, value, changeEvent);
			});
		} catch (error) {
			finish();
			options.emitError(error, value, changeEvent);
		}
	}
	return {
		commit,
		value: computed(() => optimistic.value ?? options.model.value),
		isPending: computed(() => pendingCount.value > 0)
	};
}
var _hoisted_1 = [
	"data-size",
	"data-status",
	"data-disabled",
	"data-readonly"
];
var _hoisted_2 = {
	key: 0,
	class: "astryx-text-input-icon",
	"aria-hidden": "true"
};
var _hoisted_3 = [
	"id",
	"type",
	"value",
	"placeholder",
	"name",
	"autocomplete",
	"disabled",
	"readonly",
	"aria-disabled",
	"aria-busy",
	"aria-required",
	"aria-invalid",
	"aria-labelledby",
	"aria-describedby",
	"data-autofocus"
];
var _hoisted_4 = {
	key: 1,
	class: "astryx-text-input-end"
};
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxTextInput",
	inheritAttrs: false,
	__name: "TextInput",
	props: /*@__PURE__*/ mergeModels({
		id: {},
		type: { default: "text" },
		size: { default: "md" },
		isReadOnly: { type: Boolean },
		disabledMessage: {},
		startIcon: {},
		status: {},
		statusVariant: { default: "attached" },
		changeAction: {},
		isLoading: { type: Boolean },
		placeholder: {},
		width: {},
		hasClear: { type: Boolean },
		hasAutoFocus: { type: Boolean },
		htmlName: {},
		autoComplete: {},
		clearLabel: {},
		loadingLabel: { default: "Loading" },
		label: {},
		isLabelHidden: { type: Boolean },
		isDisabled: { type: Boolean },
		isOptional: { type: Boolean },
		isRequired: { type: Boolean },
		description: {},
		labelIcon: {},
		labelTooltip: {},
		optionalLabel: {},
		requiredLabel: {}
	}, {
		"modelValue": { required: true },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels([
		"change",
		"clear",
		"enter",
		"keydown",
		"actionError"
	], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		const attrs = useAttrs();
		const input = useTemplateRef("input");
		const container = useTemplateRef("container");
		const generatedId = `astryx-text-input-${useId()}`;
		const inputId = computed(() => props.id ?? generatedId);
		const isComposing = shallowRef(false);
		const disabledDescriptionId = `${generatedId}-disabled`;
		const disabledTooltipId = `${generatedId}-tooltip`;
		const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim());
		const disabledTooltip = useButtonTooltip(showsDisabledMessage);
		const icon = computed(() => props.startIcon ? toRaw(props.startIcon) : void 0);
		const action = useTextInputAction({
			model,
			changeAction: () => props.changeAction,
			emitChange: (value, event) => emit("change", value, event),
			emitError: (error, value, event) => emit("actionError", error, value, event)
		});
		const busy = computed(() => props.isLoading || action.isPending.value);
		const element = computed(() => input.value ?? null);
		function focus(options) {
			input.value?.focus(options);
		}
		function blur() {
			input.value?.blur();
		}
		function select() {
			input.value?.select();
		}
		__expose({
			element,
			focus,
			blur,
			select
		});
		const controlledAttrs = /* @__PURE__ */ new Set([
			"class",
			"style",
			"id",
			"value",
			"type",
			"disabled",
			"readonly",
			"autofocus",
			"aria-labelledby",
			"aria-describedby",
			"aria-required",
			"aria-busy",
			"aria-disabled"
		]);
		function inputAttrs() {
			return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)));
		}
		function describedBy(fieldIds) {
			return [
				attrs["aria-describedby"],
				fieldIds,
				showsDisabledMessage.value ? disabledDescriptionId : void 0
			].filter(Boolean).join(" ") || void 0;
		}
		function labelledBy(labelId) {
			return [labelId, attrs["aria-labelledby"]].filter(Boolean).join(" ");
		}
		function acceptInput(event) {
			if (props.isDisabled || props.isReadOnly) {
				if (input.value) input.value.value = action.value.value;
				return;
			}
			if (isComposing.value || event instanceof InputEvent && event.isComposing) return;
			const value = input.value?.value ?? "";
			if (value !== action.value.value) action.commit(value, event);
		}
		function compositionEnd(event) {
			isComposing.value = false;
			acceptInput(event);
		}
		function keydown(event) {
			emit("keydown", event);
			if (event.key === "Escape") disabledTooltip.hideImmediately();
			if (!props.isDisabled && !event.defaultPrevented && event.key === "Enter" && !isComposing.value && !event.isComposing && event.keyCode !== 229) emit("enter", event);
		}
		async function clear(event) {
			if (props.isDisabled || props.isReadOnly) return;
			action.commit("", event);
			emit("clear", event);
			await nextTick();
			focus({ preventScroll: true });
		}
		function focusFromContainer(event) {
			if (props.isDisabled) return;
			const target = event.target;
			if (target instanceof Element && target.closest("input,button,a,select,textarea,[role=\"button\"]")) return;
			if (input.value?.ownerDocument.getSelection()?.toString()) return;
			focus({ preventScroll: true });
		}
		onMounted(() => {
			if (props.hasAutoFocus) focus({ preventScroll: true });
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				createVNode(_sfc_main$5, {
					label: __props.label,
					"input-id": inputId.value,
					description: __props.description,
					width: __props.width,
					"is-label-hidden": __props.isLabelHidden,
					"is-disabled": __props.isDisabled,
					"is-optional": __props.isOptional,
					"is-required": __props.isRequired,
					"label-icon": __props.labelIcon,
					"label-tooltip": __props.labelTooltip,
					"optional-label": __props.optionalLabel,
					"required-label": __props.requiredLabel,
					status: __props.status,
					"status-variant": __props.statusVariant
				}, createSlots({
					default: withCtx((field) => [createElementVNode("div", {
						ref_key: "container",
						ref: container,
						class: normalizeClass(["astryx-text-input", unref(attrs).class]),
						style: normalizeStyle(unref(attrs).style),
						"data-size": __props.size,
						"data-status": __props.status?.type,
						"data-disabled": __props.isDisabled || void 0,
						"data-readonly": __props.isReadOnly || void 0,
						onPointerup: focusFromContainer,
						onPointerenter: _cache[3] || (_cache[3] = (...args) => unref(disabledTooltip).onPointerEnter && unref(disabledTooltip).onPointerEnter(...args)),
						onPointerleave: _cache[4] || (_cache[4] = (...args) => unref(disabledTooltip).onPointerLeave && unref(disabledTooltip).onPointerLeave(...args))
					}, [
						_ctx.$slots.icon || icon.value ? (openBlock(), createElementBlock("span", _hoisted_2, [renderSlot(_ctx.$slots, "icon", {}, () => [icon.value ? (openBlock(), createBlock(resolveDynamicComponent(icon.value), { key: 0 })) : createCommentVNode("v-if", true)])])) : createCommentVNode("v-if", true),
						createElementVNode("input", mergeProps(inputAttrs(), {
							id: inputId.value,
							ref_key: "input",
							ref: input,
							class: "astryx-text-input-control",
							type: __props.type,
							value: unref(action).value.value,
							placeholder: __props.placeholder,
							name: __props.isDisabled ? void 0 : __props.htmlName ?? inputAttrs().name,
							autocomplete: __props.autoComplete ?? inputAttrs().autocomplete,
							disabled: __props.isDisabled && !showsDisabledMessage.value,
							readonly: __props.isReadOnly || showsDisabledMessage.value,
							"aria-disabled": showsDisabledMessage.value || void 0,
							"aria-busy": busy.value || void 0,
							"aria-required": __props.isRequired && !__props.isOptional || void 0,
							"aria-invalid": __props.status?.type === "error" ? true : inputAttrs()["aria-invalid"],
							"aria-labelledby": labelledBy(field.labelId),
							"aria-describedby": describedBy(field.describedBy),
							"data-autofocus": __props.hasAutoFocus || void 0,
							onInput: acceptInput,
							onCompositionstart: _cache[0] || (_cache[0] = ($event) => isComposing.value = true),
							onCompositionend: compositionEnd,
							onKeydown: keydown,
							onFocus: _cache[1] || (_cache[1] = (...args) => unref(disabledTooltip).onTooltipPointerEnter && unref(disabledTooltip).onTooltipPointerEnter(...args)),
							onBlur: _cache[2] || (_cache[2] = (...args) => unref(disabledTooltip).onBlur && unref(disabledTooltip).onBlur(...args))
						}), null, 16, _hoisted_3),
						_ctx.$slots.end ? (openBlock(), createElementBlock("span", _hoisted_4, [renderSlot(_ctx.$slots, "end")])) : createCommentVNode("v-if", true),
						__props.hasClear && unref(action).value.value && !__props.isDisabled && !__props.isReadOnly ? (openBlock(), createBlock(_sfc_main$4, {
							key: 2,
							class: "astryx-input-clear-button",
							variant: "ghost",
							size: "sm",
							label: __props.clearLabel ?? `Clear ${__props.label}`,
							onClick: clear
						}, {
							default: withCtx(() => [createVNode(_sfc_main$3, { type: "clear" })]),
							_: 1
						}, 8, ["label"])) : createCommentVNode("v-if", true),
						busy.value ? (openBlock(), createBlock(_sfc_main$1$1, {
							key: 3,
							class: "astryx-text-input-spinner",
							label: __props.loadingLabel
						}, null, 8, ["label"])) : createCommentVNode("v-if", true),
						__props.status?.message && __props.statusVariant === "tooltip" ? (openBlock(), createBlock(_sfc_main$2$1, {
							key: 4,
							text: __props.status.message,
							type: __props.status.type
						}, null, 8, ["text", "type"])) : __props.status ? (openBlock(), createBlock(_sfc_main$3, {
							key: 5,
							type: __props.status.type
						}, null, 8, ["type"])) : createCommentVNode("v-if", true)
					], 46, _hoisted_1)]),
					_: 2
				}, [_ctx.$slots.labelIcon ? {
					name: "labelIcon",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "labelIcon")]),
					key: "0"
				} : void 0]), 1032, [
					"label",
					"input-id",
					"description",
					"width",
					"is-label-hidden",
					"is-disabled",
					"is-optional",
					"is-required",
					"label-icon",
					"label-tooltip",
					"optional-label",
					"required-label",
					"status",
					"status-variant"
				]),
				showsDisabledMessage.value ? (openBlock(), createBlock(_sfc_main$1, {
					key: 0,
					id: disabledDescriptionId
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.disabledMessage), 1)]),
					_: 1
				})) : createCommentVNode("v-if", true),
				showsDisabledMessage.value ? (openBlock(), createBlock(_sfc_main$2, {
					key: 1,
					id: disabledTooltipId,
					anchor: container.value,
					open: unref(disabledTooltip).isOpen.value,
					text: __props.disabledMessage ?? "",
					onPointerEnter: unref(disabledTooltip).onTooltipPointerEnter,
					onPointerLeave: unref(disabledTooltip).onTooltipPointerLeave
				}, null, 8, [
					"anchor",
					"open",
					"text",
					"onPointerEnter",
					"onPointerLeave"
				])) : createCommentVNode("v-if", true)
			], 64);
		};
	}
});
//#endregion
export { _sfc_main as t };
