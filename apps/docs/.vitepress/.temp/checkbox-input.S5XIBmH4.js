import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$1 } from "./VisuallyHidden-C7NN3VEP.DAKckTtZ.js";
import { n as _sfc_main$2 } from "./eventHandlers-DUXzBWZy.C50IdnRl.js";
import { r as useButtonTooltip, t as _sfc_main$3 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$4 } from "./CheckboxIndicator-DdJmksHt.BUuwYzkQ.js";
import { n as _sfc_main$1$1, t as _sfc_main$5 } from "./FieldStatus-oky4OlFa.B9OodlnZ.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, nextTick, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, onUpdated, openBlock, renderSlot, shallowRef, toDisplayString, unref, useAttrs, useId, useModel, useSSRContext, useTemplateRef, watch, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/CheckboxInput-CbJiXq0X.js
function useCheckboxAction(options) {
	const optimistic = shallowRef(null);
	const isPending = shallowRef(false);
	watch(options.model, () => {
		optimistic.value = null;
	});
	function commit(value, originalEvent) {
		const event = new CustomEvent("change", {
			cancelable: true,
			detail: {
				value,
				originalEvent
			}
		});
		if (originalEvent.defaultPrevented) event.preventDefault();
		optimistic.value = value;
		options.model.value = value;
		options.emitChange(value, event);
		const action = options.changeAction();
		if (!action || event.defaultPrevented) {
			optimistic.value = null;
			return;
		}
		isPending.value = true;
		const finish = () => {
			isPending.value = false;
			optimistic.value = null;
		};
		try {
			const result = action(value, event);
			if (result == null) {
				finish();
				return;
			}
			Promise.resolve(result).then(finish, (error) => {
				finish();
				options.emitError(error, value, event);
			});
		} catch (error) {
			finish();
			options.emitError(error, value, event);
		}
	}
	return {
		value: computed(() => optimistic.value ?? options.model.value),
		isPending,
		commit
	};
}
var _hoisted_1 = [
	"data-size",
	"data-status",
	"data-blocked"
];
var _hoisted_2 = { class: "astryx-checkbox-control" };
var _hoisted_3 = [
	"id",
	"checked",
	"disabled",
	"name",
	"form",
	"required",
	"readonly",
	"aria-labelledby",
	"aria-describedby",
	"aria-disabled",
	"aria-readonly",
	"aria-busy",
	"aria-required",
	"aria-invalid"
];
var _hoisted_4 = {
	key: 0,
	class: "astryx-checkbox-spinner"
};
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxCheckboxInput",
	inheritAttrs: false,
	__name: "CheckboxInput",
	props: /*@__PURE__*/ mergeModels({
		id: {},
		size: { default: "md" },
		width: {},
		htmlName: {},
		isReadOnly: { type: Boolean },
		isLoading: { type: Boolean },
		disabledMessage: {},
		status: {},
		changeAction: {},
		hasAutoFocus: { type: Boolean },
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
		"modelValue": {
			type: [Boolean, String],
			required: true
		},
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["change", "actionError"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		const attrs = useAttrs();
		const input = useTemplateRef("input");
		const generatedId = `astryx-checkbox-${useId()}`;
		const inputId = computed(() => props.id ?? generatedId);
		const labelId = computed(() => `${inputId.value}-label`);
		const descriptionId = computed(() => props.description ? `${inputId.value}-description` : void 0);
		const statusId = computed(() => props.status?.message ? props.status.messageId ?? `${inputId.value}-status` : void 0);
		const disabledId = `${generatedId}-disabled`;
		const loadingId = `${generatedId}-loading`;
		const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim());
		const tooltip = useButtonTooltip(showsDisabledMessage);
		const action = useCheckboxAction({
			model,
			changeAction: () => props.changeAction,
			emitChange: (value, event) => emit("change", value, event),
			emitError: (error, value, event) => emit("actionError", error, value, event)
		});
		const busy = computed(() => !!props.isLoading || action.isPending.value);
		const blocked = computed(() => props.isDisabled || props.isReadOnly || busy.value);
		const state = computed(() => action.value.value === "indeterminate" ? "indeterminate" : action.value.value ? "checked" : "unchecked");
		const widthStyle = computed(() => ({ width: typeof props.width === "number" ? `${props.width}px` : props.width }));
		const element = computed(() => input.value ?? null);
		function focus(options) {
			input.value?.focus(options);
		}
		function blur() {
			input.value?.blur();
		}
		__expose({
			element,
			focus,
			blur
		});
		const controlledAttrs = /* @__PURE__ */ new Set([
			"class",
			"style",
			"id",
			"type",
			"checked",
			"indeterminate",
			"disabled",
			"readonly",
			"autofocus",
			"role",
			"aria-checked",
			"aria-labelledby",
			"aria-describedby",
			"aria-disabled",
			"aria-readonly",
			"aria-required",
			"aria-busy"
		]);
		function inputAttrs() {
			return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)));
		}
		function describedBy() {
			return [
				attrs["aria-describedby"],
				descriptionId.value,
				statusId.value,
				showsDisabledMessage.value ? disabledId : void 0,
				busy.value ? loadingId : void 0
			].filter(Boolean).join(" ") || void 0;
		}
		function syncNative() {
			if (input.value) {
				input.value.checked = action.value.value === true;
				input.value.indeterminate = action.value.value === "indeterminate";
			}
		}
		function click(event) {
			if (blocked.value) {
				event.preventDefault();
				nextTick(syncNative);
			}
		}
		function change(event) {
			if (!blocked.value && input.value) action.commit(input.value.checked, event);
			nextTick(syncNative);
		}
		function reset(event) {
			if (event.target === input.value?.form) nextTick(syncNative);
		}
		function keydown(event) {
			if (event.key === "Escape") tooltip.hideImmediately();
		}
		let ownerDocument;
		onMounted(() => {
			syncNative();
			ownerDocument = input.value?.ownerDocument;
			ownerDocument?.addEventListener("reset", reset, true);
			if (props.hasAutoFocus) focus({ preventScroll: true });
		});
		onUpdated(syncNative);
		onBeforeUnmount(() => ownerDocument?.removeEventListener("reset", reset, true));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("div", {
				class: normalizeClass(["astryx-checkbox-input", unref(attrs).class]),
				style: normalizeStyle([widthStyle.value, unref(attrs).style]),
				"data-size": __props.size,
				"data-status": __props.status?.type,
				"data-blocked": blocked.value || void 0
			}, [
				createElementVNode("div", {
					class: "astryx-checkbox-row",
					onPointerenter: _cache[2] || (_cache[2] = (...args) => unref(tooltip).onPointerEnter && unref(tooltip).onPointerEnter(...args)),
					onPointerleave: _cache[3] || (_cache[3] = (...args) => unref(tooltip).onPointerLeave && unref(tooltip).onPointerLeave(...args))
				}, [createElementVNode("span", _hoisted_2, [createElementVNode("input", mergeProps(inputAttrs(), {
					id: inputId.value,
					ref_key: "input",
					ref: input,
					class: "astryx-checkbox-native",
					type: "checkbox",
					checked: unref(action).value.value === true,
					disabled: __props.isDisabled && !showsDisabledMessage.value,
					name: __props.isDisabled ? void 0 : __props.htmlName ?? inputAttrs().name,
					form: showsDisabledMessage.value ? "" : inputAttrs().form,
					required: __props.isRequired && !__props.isOptional || inputAttrs().required,
					readonly: __props.isReadOnly || showsDisabledMessage.value,
					"aria-labelledby": [labelId.value, unref(attrs)["aria-labelledby"]].filter(Boolean).join(" "),
					"aria-describedby": describedBy(),
					"aria-disabled": showsDisabledMessage.value || void 0,
					"aria-readonly": __props.isReadOnly || void 0,
					"aria-busy": busy.value || void 0,
					"aria-required": __props.isRequired && !__props.isOptional || void 0,
					"aria-invalid": __props.status?.type === "error" ? true : inputAttrs()["aria-invalid"],
					onClick: click,
					onChange: change,
					onKeydown: keydown,
					onFocus: _cache[0] || (_cache[0] = (...args) => unref(tooltip).onFocus && unref(tooltip).onFocus(...args)),
					onBlur: _cache[1] || (_cache[1] = (...args) => unref(tooltip).onBlur && unref(tooltip).onBlur(...args))
				}), null, 16, _hoisted_3), createVNode(_sfc_main$4, {
					state: state.value,
					size: __props.size,
					"is-disabled": __props.isDisabled
				}, {
					default: withCtx(() => [busy.value ? (openBlock(), createElementBlock("span", _hoisted_4)) : createCommentVNode("v-if", true)]),
					_: 1
				}, 8, [
					"state",
					"size",
					"is-disabled"
				])]), createVNode(_sfc_main$1$1, {
					label: __props.label,
					"input-id": inputId.value,
					"label-id": labelId.value,
					description: __props.description,
					"description-id": descriptionId.value,
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
					"is-label-hidden",
					"is-disabled",
					"is-optional",
					"is-required",
					"label-icon",
					"label-tooltip",
					"optional-label",
					"required-label"
				])], 32),
				createVNode(_sfc_main$5, {
					id: statusId.value,
					type: __props.status?.type ?? "success",
					message: __props.status?.message ?? "",
					variant: "detached"
				}, null, 8, [
					"id",
					"type",
					"message"
				]),
				showsDisabledMessage.value ? (openBlock(), createBlock(_sfc_main$1, {
					key: 0,
					id: disabledId
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.disabledMessage), 1)]),
					_: 1
				})) : createCommentVNode("v-if", true),
				busy.value ? (openBlock(), createBlock(_sfc_main$1, {
					key: 1,
					id: loadingId,
					role: "status"
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.loadingLabel), 1)]),
					_: 1
				})) : createCommentVNode("v-if", true)
			], 14, _hoisted_1), showsDisabledMessage.value ? (openBlock(), createBlock(_sfc_main$2, {
				key: 0,
				id: `${generatedId}-tooltip`,
				anchor: input.value,
				open: unref(tooltip).isOpen.value,
				text: __props.disabledMessage ?? "",
				onPointerEnter: unref(tooltip).onTooltipPointerEnter,
				onPointerLeave: unref(tooltip).onTooltipPointerLeave
			}, null, 8, [
				"id",
				"anchor",
				"open",
				"text",
				"onPointerEnter",
				"onPointerLeave"
			])) : createCommentVNode("v-if", true)], 64);
		};
	}
});
//#endregion
//#region components/demos/checkbox-input/async.vue?vue&type=script&setup=true&lang.ts
var async_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "async",
	__ssrInlineRender: true,
	setup(__props) {
		const enabled = shallowRef(false);
		const failNext = shallowRef(false);
		const message = shallowRef("Changes take one second to save.");
		const hasError = shallowRef(false);
		async function save() {
			const shouldFail = failNext.value;
			hasError.value = false;
			message.value = "Saving…";
			await new Promise((resolve) => setTimeout(resolve, 1e3));
			if (shouldFail) throw new Error("Save failed. Change the selection to try again.");
			message.value = "Preferences saved.";
		}
		function failed(error) {
			hasError.value = true;
			message.value = error instanceof Error ? error.message : "Save failed. Try again.";
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: enabled.value,
				"onUpdate:modelValue": ($event) => enabled.value = $event,
				label: "Enable notifications",
				"change-action": save,
				status: {
					type: hasError.value ? "error" : "success",
					message: message.value
				},
				onActionError: failed
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: failNext.value,
				"onUpdate:modelValue": ($event) => failNext.value = $event,
				label: "Simulate a failed save",
				size: "sm"
			}, null, _parent));
			_push(`<p class="input-preview-note"> The selection stays visible if saving fails. Turn off the simulation and change the selection to retry. </p></div>`);
		};
	}
});
//#endregion
//#region components/demos/checkbox-input/async.vue
var _sfc_setup$5 = async_vue_vue_type_script_setup_true_lang_default.setup;
async_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/checkbox-input/async.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var async_default$1 = async_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/checkbox-input/async.vue?raw&highlighted
var async_default = {
	"source": "<script setup lang=\"ts\">\nimport { CheckboxInput } from '@astryx-vue/core/CheckboxInput'\nimport { shallowRef } from 'vue'\n\nconst enabled = shallowRef(false)\nconst failNext = shallowRef(false)\nconst message = shallowRef('Changes take one second to save.')\nconst hasError = shallowRef(false)\nasync function save(): Promise<void> {\n  const shouldFail = failNext.value\n  hasError.value = false\n  message.value = 'Saving…'\n  await new Promise(resolve => setTimeout(resolve, 1000))\n  if (shouldFail)\n    throw new Error('Save failed. Change the selection to try again.')\n  message.value = 'Preferences saved.'\n}\nfunction failed(error: unknown): void {\n  hasError.value = true\n  message.value = error instanceof Error ? error.message : 'Save failed. Try again.'\n}\n<\/script>\n\n<template>\n  <div class=\"input-preview-stack\">\n    <CheckboxInput v-model=\"enabled\" label=\"Enable notifications\" :change-action=\"save\" :status=\"{ type: hasError ? 'error' : 'success', message }\" @action-error=\"failed\" />\n    <CheckboxInput v-model=\"failNext\" label=\"Simulate a failed save\" size=\"sm\" />\n    <p class=\"input-preview-note\">\n      The selection stays visible if saving fails. Turn off the simulation and change the selection to retry.\n    </p>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CheckboxInput } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/CheckboxInput'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> enabled</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> failNext</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> message</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Changes take one second to save.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> hasError</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">async</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> save</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">()</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> Promise</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">  const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> shouldFail</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> failNext.value</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  hasError.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> false</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  message.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Saving…'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">  await</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> new</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> Promise</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">resolve</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =></span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setTimeout</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(resolve, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">1000</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">))</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">  if</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> (shouldFail)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">    throw</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> new</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> Error</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Save failed. Change the selection to try again.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  message.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Preferences saved.'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> failed</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">error</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> unknown</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  hasError.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> true</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  message.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> error </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">instanceof</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> Error</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> ?</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> error.message </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Save failed. Try again.'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">enabled</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Enable notifications\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">change-action</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">save</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">{ type: hasError </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'error'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> :</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'success'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, message }</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">action-error</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">failed</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">failNext</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Simulate a failed save\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-note\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      The selection stays visible if saving fails. Turn off the simulation and change the selection to retry.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/checkbox-input/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const updates = shallowRef(true);
		const tips = shallowRef(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: updates.value,
				"onUpdate:modelValue": ($event) => updates.value = $event,
				label: "Product updates",
				description: "Receive a monthly summary of new features."
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: tips.value,
				"onUpdate:modelValue": ($event) => tips.value = $event,
				label: "Tips and tutorials",
				description: "Learn new ways to use the product."
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/checkbox-input/basic.vue
var _sfc_setup$4 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/checkbox-input/basic.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/checkbox-input/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { CheckboxInput } from '@astryx-vue/core/CheckboxInput'\nimport { shallowRef } from 'vue'\n\nconst updates = shallowRef(true)\nconst tips = shallowRef(false)\n<\/script>\n\n<template>\n  <div class=\"input-preview-stack\">\n    <CheckboxInput v-model=\"updates\" label=\"Product updates\" description=\"Receive a monthly summary of new features.\" />\n    <CheckboxInput v-model=\"tips\" label=\"Tips and tutorials\" description=\"Learn new ways to use the product.\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CheckboxInput } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/CheckboxInput'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> updates</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> tips</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">updates</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Product updates\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Receive a monthly summary of new features.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">tips</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Tips and tutorials\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Learn new ways to use the product.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/checkbox-input/form.vue?vue&type=script&setup=true&lang.ts
var form_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "form",
	__ssrInlineRender: true,
	setup(__props) {
		const accepted = shallowRef(false);
		const result = shallowRef("");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<form${ssrRenderAttrs(mergeProps({ class: "input-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: accepted.value,
				"onUpdate:modelValue": ($event) => accepted.value = $event,
				label: "I accept the terms",
				"html-name": "terms",
				value: "accepted",
				"is-required": "",
				status: accepted.value ? {
					type: "success",
					message: "Ready to submit."
				} : {
					type: "error",
					message: "Accept the terms before you submit."
				}
			}, null, _parent));
			_push(`<div class="checkbox-preview-actions">`);
			_push(ssrRenderComponent(unref(_sfc_main$3), {
				type: "submit",
				label: "Submit"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$3), {
				type: "reset",
				variant: "secondary",
				label: "Reset"
			}, null, _parent));
			_push(`</div><p class="input-preview-note" role="status">${ssrInterpolate(result.value || "This example uses native form validation.")}</p></form>`);
		};
	}
});
//#endregion
//#region components/demos/checkbox-input/form.vue
var _sfc_setup$3 = form_vue_vue_type_script_setup_true_lang_default.setup;
form_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/checkbox-input/form.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var form_default$1 = form_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/checkbox-input/form.vue?raw&highlighted
var form_default = {
	"source": "<script setup lang=\"ts\">\nimport { Button } from '@astryx-vue/core/Button'\nimport { CheckboxInput } from '@astryx-vue/core/CheckboxInput'\nimport { shallowRef } from 'vue'\n\nconst accepted = shallowRef(false)\nconst result = shallowRef('')\nfunction submit(event: Event): void {\n  const data = new FormData(event.currentTarget as HTMLFormElement)\n  result.value = `Submitted: terms=${data.get('terms')}`\n}\nfunction reset(): void {\n  accepted.value = false\n  result.value = ''\n}\n<\/script>\n\n<template>\n  <form class=\"input-preview-stack\" @submit.prevent=\"submit\" @reset=\"reset\">\n    <CheckboxInput v-model=\"accepted\" label=\"I accept the terms\" html-name=\"terms\" value=\"accepted\" is-required :status=\"accepted ? { type: 'success', message: 'Ready to submit.' } : { type: 'error', message: 'Accept the terms before you submit.' }\" />\n    <div class=\"checkbox-preview-actions\">\n      <Button type=\"submit\" label=\"Submit\" />\n      <Button type=\"reset\" variant=\"secondary\" label=\"Reset\" />\n    </div>\n    <p class=\"input-preview-note\" role=\"status\">\n      {{ result || 'This example uses native form validation.' }}\n    </p>\n  </form>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CheckboxInput } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/CheckboxInput'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> accepted</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> result</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">''</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> submit</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">event</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> Event</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">  const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> data</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> new</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> FormData</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(event.currentTarget </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">as</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> HTMLFormElement</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  result.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> `Submitted: terms=${</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">data</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">.</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">get</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'terms'</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">)</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}`</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> reset</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">()</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  accepted.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> false</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  result.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> ''</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">form</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-stack\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> @submit.prevent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"submit\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> @reset</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"reset\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">accepted</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"I accept the terms\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> html-name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"terms\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"accepted\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-required</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">accepted </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'success'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, message: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Ready to submit.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'error'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, message: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Accept the terms before you submit.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"checkbox-preview-actions\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"submit\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Submit\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"reset\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Reset\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-note\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> role</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"status\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      {{ result || 'This example uses native form validation.' }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">form</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/checkbox-input/indeterminate.vue?vue&type=script&setup=true&lang.ts
var indeterminate_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "indeterminate",
	__ssrInlineRender: true,
	setup(__props) {
		const email = shallowRef(true);
		const push = shallowRef(false);
		const all = computed({
			get: () => email.value === push.value ? email.value : "indeterminate",
			set: (value) => {
				email.value = push.value = value === true;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: all.value,
				"onUpdate:modelValue": ($event) => all.value = $event,
				label: "All notifications",
				description: "Choose all channels or clear the selection."
			}, null, _parent));
			_push(`<div class="checkbox-preview-children">`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: email.value,
				"onUpdate:modelValue": ($event) => email.value = $event,
				label: "Email notifications"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: push.value,
				"onUpdate:modelValue": ($event) => push.value = $event,
				label: "Push notifications"
			}, null, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region components/demos/checkbox-input/indeterminate.vue
var _sfc_setup$2 = indeterminate_vue_vue_type_script_setup_true_lang_default.setup;
indeterminate_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/checkbox-input/indeterminate.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var indeterminate_default$1 = indeterminate_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/checkbox-input/indeterminate.vue?raw&highlighted
var indeterminate_default = {
	"source": "<script setup lang=\"ts\">\nimport type { CheckboxValue } from '@astryx-vue/core/CheckboxInput'\nimport { CheckboxInput } from '@astryx-vue/core/CheckboxInput'\nimport { computed, shallowRef } from 'vue'\n\nconst email = shallowRef(true)\nconst push = shallowRef(false)\nconst all = computed<CheckboxValue>({\n  get: () => email.value === push.value ? email.value : 'indeterminate',\n  set: (value) => { email.value = push.value = value === true },\n})\n<\/script>\n\n<template>\n  <div class=\"input-preview-stack\">\n    <CheckboxInput v-model=\"all\" label=\"All notifications\" description=\"Choose all channels or clear the selection.\" />\n    <div class=\"checkbox-preview-children\">\n      <CheckboxInput v-model=\"email\" label=\"Email notifications\" />\n      <CheckboxInput v-model=\"push\" label=\"Push notifications\" />\n    </div>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CheckboxValue } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/CheckboxInput'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CheckboxInput } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/CheckboxInput'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { computed, shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> email</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> push</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> all</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> computed</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">CheckboxValue</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>({</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">  get</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: () </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> email.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">===</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> push.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> email.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'indeterminate'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">  set</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">: (</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">) </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=></span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { email.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> push.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">===</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">})</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">all</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"All notifications\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Choose all channels or clear the selection.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"checkbox-preview-children\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">email</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Email notifications\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">push</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Push notifications\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/checkbox-input/sizes.vue?vue&type=script&setup=true&lang.ts
var sizes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "sizes",
	__ssrInlineRender: true,
	setup(__props) {
		const small = shallowRef(true);
		const medium = shallowRef(true);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: small.value,
				"onUpdate:modelValue": ($event) => small.value = $event,
				label: "Small · 20px",
				size: "sm"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: medium.value,
				"onUpdate:modelValue": ($event) => medium.value = $event,
				label: "Medium · 24px",
				size: "md"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/checkbox-input/sizes.vue
var _sfc_setup$1 = sizes_vue_vue_type_script_setup_true_lang_default.setup;
sizes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/checkbox-input/sizes.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var sizes_default$1 = sizes_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/checkbox-input/sizes.vue?raw&highlighted
var sizes_default = {
	"source": "<script setup lang=\"ts\">\nimport { CheckboxInput } from '@astryx-vue/core/CheckboxInput'\nimport { shallowRef } from 'vue'\n\nconst small = shallowRef(true)\nconst medium = shallowRef(true)\n<\/script>\n\n<template>\n  <div class=\"input-preview-stack\">\n    <CheckboxInput v-model=\"small\" label=\"Small · 20px\" size=\"sm\" />\n    <CheckboxInput v-model=\"medium\" label=\"Medium · 24px\" size=\"md\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CheckboxInput } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/CheckboxInput'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> small</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> medium</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">small</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Small · 20px\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">medium</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Medium · 24px\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"md\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/checkbox-input/states.vue?vue&type=script&setup=true&lang.ts
var states_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "states",
	__ssrInlineRender: true,
	setup(__props) {
		const checked = shallowRef(true);
		const unchecked = shallowRef(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: checked.value,
				"onUpdate:modelValue": ($event) => checked.value = $event,
				label: "Read-only selection",
				"is-read-only": ""
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: unchecked.value,
				"onUpdate:modelValue": ($event) => unchecked.value = $event,
				label: "Disabled option",
				"is-disabled": ""
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: checked.value,
				"onUpdate:modelValue": ($event) => checked.value = $event,
				label: "Managed by your team",
				"is-disabled": "",
				"disabled-message": "Contact your administrator to change this setting."
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: checked.value,
				"onUpdate:modelValue": ($event) => checked.value = $event,
				label: "Saving preferences",
				"is-loading": ""
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: unchecked.value,
				"onUpdate:modelValue": ($event) => unchecked.value = $event,
				label: "Email receipts",
				"label-tooltip": "We send a receipt after each payment.",
				"is-optional": ""
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/checkbox-input/states.vue
var _sfc_setup = states_vue_vue_type_script_setup_true_lang_default.setup;
states_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/checkbox-input/states.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var states_default$1 = states_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/checkbox-input/states.vue?raw&highlighted
var states_default = {
	"source": "<script setup lang=\"ts\">\nimport { CheckboxInput } from '@astryx-vue/core/CheckboxInput'\nimport { shallowRef } from 'vue'\n\nconst checked = shallowRef(true)\nconst unchecked = shallowRef(false)\n<\/script>\n\n<template>\n  <div class=\"input-preview-stack\">\n    <CheckboxInput v-model=\"checked\" label=\"Read-only selection\" is-read-only />\n    <CheckboxInput v-model=\"unchecked\" label=\"Disabled option\" is-disabled />\n    <CheckboxInput v-model=\"checked\" label=\"Managed by your team\" is-disabled disabled-message=\"Contact your administrator to change this setting.\" />\n    <CheckboxInput v-model=\"checked\" label=\"Saving preferences\" is-loading />\n    <CheckboxInput v-model=\"unchecked\" label=\"Email receipts\" label-tooltip=\"We send a receipt after each payment.\" is-optional />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { CheckboxInput } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/CheckboxInput'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> checked</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> unchecked</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">checked</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Read-only selection\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-read-only</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">unchecked</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Disabled option\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-disabled</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">checked</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Managed by your team\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-disabled</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> disabled-message</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Contact your administrator to change this setting.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">checked</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Saving preferences\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-loading</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">CheckboxInput</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">unchecked</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Email receipts\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label-tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"We send a receipt after each payment.\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-optional</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/checkbox-input/index.ts
var options = { className: "input-preview-host" };
var checkboxInputBasic = defineDemo(basic_default$1, basic_default, options);
var checkboxInputSizes = defineDemo(sizes_default$1, sizes_default, options);
var checkboxInputIndeterminate = defineDemo(indeterminate_default$1, indeterminate_default, options);
var checkboxInputStates = defineDemo(states_default$1, states_default, options);
var checkboxInputForm = defineDemo(form_default$1, form_default, options);
var checkboxInputAsync = defineDemo(async_default$1, async_default, options);
//#endregion
export { checkboxInputSizes as a, checkboxInputIndeterminate as i, checkboxInputBasic as n, checkboxInputStates as o, checkboxInputForm as r, checkboxInputAsync as t };
