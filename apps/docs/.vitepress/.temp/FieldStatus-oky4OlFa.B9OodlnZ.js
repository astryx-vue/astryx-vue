import { t as _sfc_main$3 } from "./VisuallyHidden-C7NN3VEP.DAKckTtZ.js";
import { n as _sfc_main$4 } from "./eventHandlers-DUXzBWZy.C50IdnRl.js";
import { r as useButtonTooltip } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$5 } from "./field.DV8BOXNO.js";
import { t as _sfc_main$6 } from "./IconButton-BNQuz9W_.CvHMrKbO.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, nextTick, onMounted, onScopeDispose, openBlock, renderSlot, resolveDynamicComponent, shallowRef, toDisplayString, toRaw, unref, useId, useTemplateRef, watch, withCtx } from "vue";
//#region ../../packages/core/dist/FieldStatus-oky4OlFa.js
var _sfc_main$2 = /*@__PURE__*/ defineComponent({
	__name: "FieldInfoTip",
	props: {
		text: {},
		type: {}
	},
	setup(__props) {
		const props = __props;
		const button = useTemplateRef("button");
		const anchor = computed(() => button.value?.element ?? null);
		const id = `astryx-field-tooltip-${useId()}`;
		const tooltip = useButtonTooltip(computed(() => !!props.text));
		const pinned = shallowRef(false);
		function close() {
			pinned.value = false;
			tooltip.hideImmediately();
		}
		function toggle() {
			pinned.value = !pinned.value;
			if (pinned.value) tooltip.onTooltipPointerEnter();
			else close();
		}
		function leave() {
			if (!pinned.value) tooltip.onPointerLeave();
		}
		function dismiss(event) {
			if (event instanceof KeyboardEvent) {
				if (event.key === "Escape") close();
				return;
			}
			const target = event.target;
			if (target instanceof Node && !anchor.value?.contains(target) && !document.getElementById(id)?.contains(target)) close();
		}
		watch(tooltip.isOpen, (open) => {
			if (typeof document === "undefined") return;
			if (open) {
				document.addEventListener("pointerdown", dismiss);
				document.addEventListener("keydown", dismiss);
			} else {
				document.removeEventListener("pointerdown", dismiss);
				document.removeEventListener("keydown", dismiss);
			}
		});
		onScopeDispose(() => {
			if (typeof document !== "undefined") {
				document.removeEventListener("pointerdown", dismiss);
				document.removeEventListener("keydown", dismiss);
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createVNode(_sfc_main$6, {
				ref_key: "button",
				ref: button,
				class: "astryx-field-info-tip",
				variant: "ghost",
				size: "sm",
				label: __props.text,
				"aria-describedby": id,
				"data-status": __props.type,
				"aria-expanded": unref(tooltip).isOpen.value,
				onClick: toggle,
				onFocus: unref(tooltip).onTooltipPointerEnter,
				onBlur: close,
				onPointerenter: unref(tooltip).onPointerEnter,
				onPointerleave: leave
			}, {
				default: withCtx(() => [createVNode(_sfc_main$5, { type: __props.type ?? "info" }, null, 8, ["type"])]),
				_: 1
			}, 8, [
				"label",
				"data-status",
				"aria-expanded",
				"onFocus",
				"onPointerenter"
			]), createVNode(_sfc_main$4, {
				id,
				anchor: anchor.value,
				open: unref(tooltip).isOpen.value,
				text: __props.text,
				onPointerEnter: unref(tooltip).onTooltipPointerEnter,
				onPointerLeave: leave
			}, null, 8, [
				"anchor",
				"open",
				"text",
				"onPointerEnter"
			])], 64);
		};
	}
});
var _hoisted_1$1 = ["data-hidden", "data-disabled"];
var _hoisted_2 = { class: "astryx-field-label-row" };
var _hoisted_3 = {
	key: 0,
	class: "astryx-field-label-icon",
	"aria-hidden": "true"
};
var _hoisted_4 = {
	key: 0,
	class: "astryx-field-optionality",
	"aria-hidden": "true"
};
var _hoisted_5 = ["id"];
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxFieldLabel",
	__name: "FieldLabel",
	props: {
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
		optionalLabel: { default: "Optional" },
		requiredLabel: { default: "Required" }
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const element = useTemplateRef("label");
		__expose({ element });
		const labelId = computed(() => props.labelId ?? `${props.inputId}-label`);
		const descriptionId = computed(() => props.descriptionId ?? `${props.inputId}-description`);
		const icon = computed(() => props.labelIcon ? toRaw(props.labelIcon) : void 0);
		function focusFromDescription(event) {
			if (props.isGroupLabel || props.isDisabled) return;
			const target = event.target;
			if (target instanceof Element && target.closest("a,button,input,select,textarea,[role=\"button\"]")) return;
			if (element.value?.ownerDocument.getSelection()?.toString()) return;
			const control = element.value?.ownerDocument.getElementById(props.inputId);
			if (control instanceof HTMLInputElement && ["checkbox", "radio"].includes(control.type)) control.click();
			else control?.focus({ preventScroll: true });
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "astryx-field-label-group",
				"data-hidden": __props.isLabelHidden || void 0,
				"data-disabled": __props.isDisabled || void 0
			}, [createElementVNode("div", _hoisted_2, [
				(openBlock(), createBlock(resolveDynamicComponent(__props.isGroupLabel ? "span" : "label"), {
					id: labelId.value,
					ref: "label",
					class: "astryx-field-label",
					for: __props.isGroupLabel ? void 0 : __props.inputId
				}, {
					default: withCtx(() => [_ctx.$slots.labelIcon || icon.value ? (openBlock(), createElementBlock("span", _hoisted_3, [renderSlot(_ctx.$slots, "labelIcon", {}, () => [icon.value ? (openBlock(), createBlock(resolveDynamicComponent(icon.value), { key: 0 })) : createCommentVNode("v-if", true)])])) : createCommentVNode("v-if", true), createTextVNode(" " + toDisplayString(__props.label), 1)]),
					_: 3
				}, 8, ["id", "for"])),
				__props.isOptional || __props.isRequired ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(__props.isOptional ? __props.optionalLabel : __props.requiredLabel), 1)) : createCommentVNode("v-if", true),
				__props.labelTooltip ? (openBlock(), createBlock(_sfc_main$2, {
					key: 1,
					text: __props.labelTooltip
				}, null, 8, ["text"])) : createCommentVNode("v-if", true)
			]), __props.description ? (openBlock(), createElementBlock("span", {
				key: 0,
				id: descriptionId.value,
				class: "astryx-field-description",
				role: "presentation",
				onClick: focusFromDescription
			}, toDisplayString(__props.description), 9, _hoisted_5)) : createCommentVNode("v-if", true)], 8, _hoisted_1$1);
		};
	}
});
var _hoisted_1 = [
	"data-type",
	"data-variant",
	"data-hidden"
];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxFieldStatus",
	inheritAttrs: false,
	__name: "FieldStatus",
	props: {
		type: {},
		message: {},
		variant: { default: "attached" },
		isVisuallyHidden: { type: Boolean }
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		__expose({ element: useTemplateRef("message") });
		const assertive = shallowRef("");
		const polite = shallowRef("");
		let mounted = false;
		let revision = 0;
		async function announce() {
			const current = ++revision;
			assertive.value = "";
			polite.value = "";
			await nextTick();
			if (!mounted || current !== revision) return;
			if (props.type === "error") assertive.value = props.message;
			else polite.value = props.message;
		}
		onMounted(() => {
			mounted = true;
			announce();
		});
		watch(() => [props.type, props.message], () => {
			announce();
		});
		onScopeDispose(() => {
			mounted = false;
			revision += 1;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				__props.message ? (openBlock(), createElementBlock("div", mergeProps({ key: 0 }, _ctx.$attrs, {
					ref: "message",
					class: "astryx-field-status",
					"data-type": __props.type,
					"data-variant": __props.variant,
					"data-hidden": __props.isVisuallyHidden || void 0
				}), [__props.variant === "detached" ? (openBlock(), createBlock(_sfc_main$5, {
					key: 0,
					type: __props.type
				}, null, 8, ["type"])) : createCommentVNode("v-if", true), createElementVNode("span", null, toDisplayString(__props.message), 1)], 16, _hoisted_1)) : createCommentVNode("v-if", true),
				createVNode(_sfc_main$3, {
					"aria-live": "assertive",
					"aria-atomic": "true"
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(assertive.value), 1)]),
					_: 1
				}),
				createVNode(_sfc_main$3, {
					"aria-live": "polite",
					"aria-atomic": "true"
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(polite.value), 1)]),
					_: 1
				})
			], 64);
		};
	}
});
//#endregion
export { _sfc_main$1 as n, _sfc_main$2 as r, _sfc_main as t };
