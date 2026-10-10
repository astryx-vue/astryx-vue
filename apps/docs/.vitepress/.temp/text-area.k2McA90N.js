import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$1 } from "./VisuallyHidden-C7NN3VEP.DAKckTtZ.js";
import { n as _sfc_main$2 } from "./eventHandlers-DUXzBWZy.C50IdnRl.js";
import { n as _sfc_main$1$1, r as useButtonTooltip } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$3 } from "./field.DV8BOXNO.js";
import { t as _sfc_main$4 } from "./IconButton-BNQuz9W_.CvHMrKbO.js";
import { r as _sfc_main$2$1 } from "./FieldStatus-oky4OlFa.B9OodlnZ.js";
import { t as _sfc_main$5 } from "./Field-C_z-m3_N.DzPNT5mn.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, nextTick, normalizeClass, normalizeStyle, onMounted, openBlock, renderSlot, resolveDynamicComponent, shallowRef, toDisplayString, toRaw, unref, useAttrs, useId, useModel, useSSRContext, useTemplateRef, watch, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/TextArea-B6M6RWCc.js
function useTextAreaAction(options) {
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
	class: "astryx-text-area-icon",
	"aria-hidden": "true"
};
var _hoisted_3 = [
	"id",
	"value",
	"placeholder",
	"name",
	"rows",
	"cols",
	"minlength",
	"maxlength",
	"wrap",
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
	class: "astryx-text-area-end"
};
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxTextArea",
	inheritAttrs: false,
	__name: "TextArea",
	props: /*@__PURE__*/ mergeModels({
		id: {},
		size: { default: "md" },
		isReadOnly: { type: Boolean },
		disabledMessage: {},
		startIcon: {},
		status: {},
		statusVariant: { default: "detached" },
		changeAction: {},
		isLoading: { type: Boolean },
		placeholder: {},
		width: {},
		rows: {},
		cols: {},
		minlength: {},
		maxlength: {},
		wrap: {},
		resize: { default: "vertical" },
		hasClear: { type: Boolean },
		hasAutoFocus: { type: Boolean },
		htmlName: {},
		form: {},
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
		const generatedId = `astryx-text-area-${useId()}`;
		const inputId = computed(() => props.id ?? generatedId);
		const isComposing = shallowRef(false);
		const disabledDescriptionId = `${generatedId}-disabled`;
		const disabledTooltipId = `${generatedId}-tooltip`;
		const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim());
		const disabledTooltip = useButtonTooltip(showsDisabledMessage);
		const icon = computed(() => props.startIcon ? toRaw(props.startIcon) : void 0);
		const action = useTextAreaAction({
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
			"rows",
			"cols",
			"disabled",
			"readonly",
			"autofocus",
			"minlength",
			"maxlength",
			"wrap",
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
			if (target instanceof Element && target.closest("input,textarea,button,a,select,[role=\"button\"]")) return;
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
						class: normalizeClass(["astryx-text-area", unref(attrs).class]),
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
						createElementVNode("textarea", mergeProps(inputAttrs(), {
							id: inputId.value,
							ref_key: "input",
							ref: input,
							class: "astryx-text-area-control",
							value: unref(action).value.value,
							placeholder: __props.placeholder,
							name: __props.isDisabled ? void 0 : __props.htmlName ?? inputAttrs().name,
							style: { "--astryx-text-area-resize": __props.resize },
							rows: __props.rows,
							cols: __props.cols,
							minlength: __props.minlength,
							maxlength: __props.maxlength,
							wrap: __props.wrap,
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
							class: "astryx-text-area-clear-button",
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
							class: "astryx-text-area-spinner",
							label: __props.loadingLabel
						}, null, 8, ["label"])) : createCommentVNode("v-if", true),
						__props.status?.message && __props.statusVariant === "tooltip" ? (openBlock(), createBlock(_sfc_main$2$1, {
							key: 4,
							text: __props.status.message,
							type: __props.status.type
						}, null, 8, ["text", "type"])) : createCommentVNode("v-if", true)
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
//#region components/demos/text-area/async.vue?vue&type=script&setup=true&lang.ts
var async_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "async",
	__ssrInlineRender: true,
	setup(__props) {
		const content = shallowRef("Type here to simulate an async save.");
		async function save(value) {
			await new Promise((resolve) => setTimeout(resolve, 800));
			console.log("saved", value);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: content.value,
				"onUpdate:modelValue": ($event) => content.value = $event,
				label: "Content",
				"change-action": save
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/text-area/async.vue
var _sfc_setup$5 = async_vue_vue_type_script_setup_true_lang_default.setup;
async_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/text-area/async.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var async_default$1 = async_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/text-area/async.vue?raw&highlighted
var async_default = {
	"source": "<script setup lang=\"ts\">\nimport { TextArea } from '@astryx-vue/core/TextArea'\nimport { shallowRef } from 'vue'\n\nconst content = shallowRef('Type here to simulate an async save.')\n\nasync function save(value: string): Promise<void> {\n  await new Promise(resolve => setTimeout(resolve, 800))\n  // eslint-disable-next-line no-console\n  console.log('saved', value)\n}\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <TextArea v-model=\"content\" label=\"Content\" :change-action=\"save\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { TextArea } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TextArea'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> content</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Type here to simulate an async save.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">async</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> save</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> string</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> Promise</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">  await</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> new</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> Promise</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">resolve</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =></span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setTimeout</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(resolve, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">800</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">))</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#62687b;--shiki-dark:#818e99\">  // eslint-disable-next-line no-console</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  console.</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">log</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'saved'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, value)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">content</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Content\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">change-action</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">save</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/text-area/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const bio = shallowRef("Ada Lovelace is widely considered the first computer programmer.");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: bio.value,
				"onUpdate:modelValue": ($event) => bio.value = $event,
				label: "Bio",
				description: "A short introduction.",
				"is-required": "",
				"required-label": "Required",
				"html-name": "bio"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/text-area/basic.vue
var _sfc_setup$4 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/text-area/basic.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/text-area/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { TextArea } from '@astryx-vue/core/TextArea'\nimport { shallowRef } from 'vue'\n\nconst bio = shallowRef('Ada Lovelace is widely considered the first computer programmer.')\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <TextArea v-model=\"bio\" label=\"Bio\" description=\"A short introduction.\" is-required required-label=\"Required\" html-name=\"bio\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { TextArea } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TextArea'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> bio</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Ada Lovelace is widely considered the first computer programmer.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">bio</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Bio\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"A short introduction.\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-required</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> required-label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Required\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> html-name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"bio\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/text-area/rows.vue?vue&type=script&setup=true&lang.ts
var rows_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "rows",
	__ssrInlineRender: true,
	setup(__props) {
		const reply = shallowRef("");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: reply.value,
				"onUpdate:modelValue": ($event) => reply.value = $event,
				label: "Reply",
				rows: 4,
				cols: 40,
				maxlength: 140,
				description: "Maximum 140 characters."
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/text-area/rows.vue
var _sfc_setup$3 = rows_vue_vue_type_script_setup_true_lang_default.setup;
rows_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/text-area/rows.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var rows_default$1 = rows_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/text-area/rows.vue?raw&highlighted
var rows_default = {
	"source": "<script setup lang=\"ts\">\nimport { TextArea } from '@astryx-vue/core/TextArea'\nimport { shallowRef } from 'vue'\n\nconst reply = shallowRef('')\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <TextArea v-model=\"reply\" label=\"Reply\" :rows=\"4\" :cols=\"40\" :maxlength=\"140\" description=\"Maximum 140 characters.\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { TextArea } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TextArea'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> reply</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">''</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">reply</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Reply\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">rows</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">4</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">cols</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">40</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">maxlength</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">140</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Maximum 140 characters.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/text-area/sizes.vue?vue&type=script&setup=true&lang.ts
var sizes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "sizes",
	__ssrInlineRender: true,
	setup(__props) {
		const sm = shallowRef("Small size.");
		const md = shallowRef("Medium size.");
		const lg = shallowRef("Large size.");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: sm.value,
				"onUpdate:modelValue": ($event) => sm.value = $event,
				label: "Small",
				size: "sm"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: md.value,
				"onUpdate:modelValue": ($event) => md.value = $event,
				label: "Medium",
				size: "md"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: lg.value,
				"onUpdate:modelValue": ($event) => lg.value = $event,
				label: "Large",
				size: "lg"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/text-area/sizes.vue
var _sfc_setup$2 = sizes_vue_vue_type_script_setup_true_lang_default.setup;
sizes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/text-area/sizes.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var sizes_default$1 = sizes_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/text-area/sizes.vue?raw&highlighted
var sizes_default = {
	"source": "<script setup lang=\"ts\">\nimport { TextArea } from '@astryx-vue/core/TextArea'\nimport { shallowRef } from 'vue'\n\nconst sm = shallowRef('Small size.')\nconst md = shallowRef('Medium size.')\nconst lg = shallowRef('Large size.')\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <TextArea v-model=\"sm\" label=\"Small\" size=\"sm\" />\n    <TextArea v-model=\"md\" label=\"Medium\" size=\"md\" />\n    <TextArea v-model=\"lg\" label=\"Large\" size=\"lg\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { TextArea } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TextArea'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> sm</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Small size.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> md</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Medium size.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> lg</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Large size.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">sm</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Small\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">md</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Medium\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"md\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">lg</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Large\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"lg\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/text-area/states.vue?vue&type=script&setup=true&lang.ts
var states_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "states",
	__ssrInlineRender: true,
	setup(__props) {
		const disabled = shallowRef("Unavailable");
		const readOnly = shallowRef("This value is read-only.");
		const locked = shallowRef("Only editors can edit this.");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: disabled.value,
				"onUpdate:modelValue": ($event) => disabled.value = $event,
				label: "Disabled",
				"is-disabled": "",
				"has-clear": ""
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: readOnly.value,
				"onUpdate:modelValue": ($event) => readOnly.value = $event,
				label: "Read-only",
				"is-read-only": "",
				"html-name": "notes",
				description: "This value is still included in form submission."
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: locked.value,
				"onUpdate:modelValue": ($event) => locked.value = $event,
				label: "Locked",
				"is-disabled": "",
				"disabled-message": "You need the Editor role to edit this field."
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/text-area/states.vue
var _sfc_setup$1 = states_vue_vue_type_script_setup_true_lang_default.setup;
states_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/text-area/states.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var states_default$1 = states_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/text-area/states.vue?raw&highlighted
var states_default = {
	"source": "<script setup lang=\"ts\">\nimport { TextArea } from '@astryx-vue/core/TextArea'\nimport { shallowRef } from 'vue'\n\nconst disabled = shallowRef('Unavailable')\nconst readOnly = shallowRef('This value is read-only.')\nconst locked = shallowRef('Only editors can edit this.')\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <TextArea v-model=\"disabled\" label=\"Disabled\" is-disabled has-clear />\n    <TextArea v-model=\"readOnly\" label=\"Read-only\" is-read-only html-name=\"notes\" description=\"This value is still included in form submission.\" />\n    <TextArea v-model=\"locked\" label=\"Locked\" is-disabled disabled-message=\"You need the Editor role to edit this field.\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { TextArea } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TextArea'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> disabled</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Unavailable'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> readOnly</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'This value is read-only.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> locked</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Only editors can edit this.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">disabled</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Disabled\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-disabled</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> has-clear</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">readOnly</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Read-only\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-read-only</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> html-name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"notes\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"This value is still included in form submission.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">locked</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Locked\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-disabled</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> disabled-message</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"You need the Editor role to edit this field.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/text-area/validation.vue?vue&type=script&setup=true&lang.ts
var validation_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "validation",
	__ssrInlineRender: true,
	setup(__props) {
		const summary = shallowRef("");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: summary.value,
				"onUpdate:modelValue": ($event) => summary.value = $event,
				label: "Summary",
				status: {
					type: "error",
					message: "Summary must be at least 20 characters."
				}
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/text-area/validation.vue
var _sfc_setup = validation_vue_vue_type_script_setup_true_lang_default.setup;
validation_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/text-area/validation.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var validation_default$1 = validation_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/text-area/validation.vue?raw&highlighted
var validation_default = {
	"source": "<script setup lang=\"ts\">\nimport { TextArea } from '@astryx-vue/core/TextArea'\nimport { shallowRef } from 'vue'\n\nconst summary = shallowRef('')\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <TextArea v-model=\"summary\" label=\"Summary\" :status=\"{ type: 'error', message: 'Summary must be at least 20 characters.' }\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { TextArea } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TextArea'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> summary</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">''</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TextArea</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">summary</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Summary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">{ type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'error'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, message: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Summary must be at least 20 characters.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/text-area/index.ts
var options = { className: "input-preview-host" };
var textAreaBasic = defineDemo(basic_default$1, basic_default, options);
var textAreaSizes = defineDemo(sizes_default$1, sizes_default, options);
var textAreaRows = defineDemo(rows_default$1, rows_default, options);
var textAreaStates = defineDemo(states_default$1, states_default, options);
var textAreaValidation = defineDemo(validation_default$1, validation_default, options);
var textAreaAsync = defineDemo(async_default$1, async_default, options);
//#endregion
export { textAreaStates as a, textAreaSizes as i, textAreaBasic as n, textAreaValidation as o, textAreaRows as r, textAreaAsync as t };
