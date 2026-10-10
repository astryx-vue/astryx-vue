import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$1 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$2 } from "./field.DV8BOXNO.js";
import { t as _sfc_main$3 } from "./IconButton-BNQuz9W_.CvHMrKbO.js";
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, openBlock, renderSlot, resolveDynamicComponent, shallowRef, toDisplayString, toRaw, unref, useId, useModel, useSSRContext, useSlots, useTemplateRef, watch, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/Banner-CJe9Im5a.js
var _hoisted_1 = [
	"role",
	"data-status",
	"data-container",
	"data-elevation",
	"data-expanded"
];
var _hoisted_2 = { class: "astryx-banner-header" };
var _hoisted_3 = {
	class: "astryx-banner-icon",
	"aria-hidden": "true"
};
var _hoisted_4 = ["data-has-actions"];
var _hoisted_5 = {
	key: 0,
	class: "astryx-banner-description"
};
var _hoisted_6 = {
	key: 0,
	class: "astryx-banner-actions"
};
var _hoisted_7 = ["data-expanded"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxBanner",
	__name: "Banner",
	props: /*@__PURE__*/ mergeModels({
		status: {},
		title: {},
		description: {},
		icon: {},
		isDismissable: { type: Boolean },
		dismissLabel: {},
		expandLabel: { default: "Expand details" },
		collapseLabel: { default: "Collapse details" },
		container: { default: "card" },
		elevation: { default: "none" },
		collapsible: {
			type: Boolean,
			default: true
		},
		defaultIsOpen: {
			type: Boolean,
			default: false
		}
	}, {
		"isOpen": {
			type: Boolean,
			default: void 0
		},
		"isOpenModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["dismiss"], ["update:isOpen"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const slots = useSlots();
		const openModel = useModel(__props, "isOpen");
		const localOpen = shallowRef(props.defaultIsOpen);
		const dismissed = shallowRef(false);
		const expanded = computed(() => !props.collapsible || (openModel.value ?? localOpen.value));
		const hasContent = computed(() => !!slots.default);
		const icon = computed(() => props.icon ? toRaw(props.icon) : void 0);
		const root = useTemplateRef("root");
		const content = useTemplateRef("content");
		const toggleButton = useTemplateRef("toggleButton");
		const titleId = `astryx-banner-${useId()}`;
		const contentId = `${titleId}-content`;
		__expose({ element: computed(() => root.value ?? null) });
		let focusOrigin = null;
		function remember(candidate) {
			if (candidate instanceof HTMLElement && candidate !== root.value?.ownerDocument.body && !root.value?.contains(candidate)) focusOrigin = candidate;
		}
		function focusin(event) {
			remember(event.relatedTarget);
		}
		function pointerdown() {
			remember(root.value?.ownerDocument.activeElement ?? null);
		}
		function toggle() {
			const value = !expanded.value;
			localOpen.value = value;
			openModel.value = value;
		}
		function dismiss() {
			if (root.value?.contains(root.value.ownerDocument.activeElement) && focusOrigin?.isConnected) focusOrigin.focus({ preventScroll: true });
			dismissed.value = true;
			emit("dismiss");
		}
		watch(expanded, (value) => {
			if (!value && content.value?.contains(content.value.ownerDocument.activeElement)) toggleButton.value?.element?.focus({ preventScroll: true });
		}, { flush: "pre" });
		return (_ctx, _cache) => {
			return !dismissed.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				ref_key: "root",
				ref: root,
				class: "astryx-banner",
				role: __props.status === "warning" || __props.status === "error" ? "alert" : "status",
				"data-status": __props.status,
				"data-container": __props.container,
				"data-elevation": __props.elevation,
				"data-expanded": hasContent.value && expanded.value || void 0,
				onFocusin: focusin,
				onPointerdownCapture: pointerdown
			}, [createElementVNode("div", _hoisted_2, [
				createElementVNode("span", _hoisted_3, [renderSlot(_ctx.$slots, "icon", {}, () => [icon.value ? (openBlock(), createBlock(resolveDynamicComponent(icon.value), { key: 0 })) : (openBlock(), createBlock(_sfc_main$2, {
					key: 1,
					type: __props.status
				}, null, 8, ["type"]))])]),
				createElementVNode("div", {
					class: "astryx-banner-message",
					"data-has-actions": !!_ctx.$slots.end || void 0
				}, [createElementVNode("div", {
					id: titleId,
					class: "astryx-banner-title"
				}, [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(__props.title), 1)])]), __props.description || _ctx.$slots.description ? (openBlock(), createElementBlock("div", _hoisted_5, [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(__props.description), 1)])])) : createCommentVNode("v-if", true)], 8, _hoisted_4),
				_ctx.$slots.end || __props.isDismissable || hasContent.value && __props.collapsible ? (openBlock(), createElementBlock("div", _hoisted_6, [
					renderSlot(_ctx.$slots, "end"),
					hasContent.value && __props.collapsible ? (openBlock(), createBlock(_sfc_main$3, {
						key: 0,
						ref_key: "toggleButton",
						ref: toggleButton,
						variant: "ghost",
						size: "sm",
						label: expanded.value ? __props.collapseLabel : __props.expandLabel,
						"aria-expanded": expanded.value,
						"aria-controls": expanded.value ? contentId : void 0,
						onClick: toggle
					}, {
						default: withCtx(() => [(openBlock(), createElementBlock("svg", {
							class: "astryx-banner-chevron",
							"data-expanded": expanded.value || void 0,
							viewBox: "0 0 16 16",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [..._cache[0] || (_cache[0] = [createElementVNode("path", { d: "m4 6 4 4 4-4" }, null, -1)])], 8, _hoisted_7))]),
						_: 1
					}, 8, [
						"label",
						"aria-expanded",
						"aria-controls"
					])) : createCommentVNode("v-if", true),
					__props.isDismissable ? (openBlock(), createBlock(_sfc_main$3, {
						key: 1,
						variant: "ghost",
						size: "sm",
						label: __props.dismissLabel ?? `Dismiss ${__props.title}`,
						onClick: dismiss
					}, {
						default: withCtx(() => [createVNode(_sfc_main$2, { type: "clear" })]),
						_: 1
					}, 8, ["label"])) : createCommentVNode("v-if", true)
				])) : createCommentVNode("v-if", true)
			]), hasContent.value && expanded.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				id: contentId,
				ref_key: "content",
				ref: content,
				class: "astryx-banner-content"
			}, [renderSlot(_ctx.$slots, "default")], 512)) : createCommentVNode("v-if", true)], 40, _hoisted_1)) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region components/demos/banner/actions.vue?vue&type=script&setup=true&lang.ts
var actions_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "actions",
	__ssrInlineRender: true,
	setup(__props) {
		const version = shallowRef(0);
		const visible = shallowRef(true);
		const saved = shallowRef(false);
		function restore() {
			version.value += 1;
			visible.value = true;
			saved.value = false;
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				label: "Show notification",
				variant: "secondary",
				onClick: restore
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				key: version.value,
				status: saved.value ? "success" : "error",
				title: saved.value ? "Changes saved" : "Save failed",
				description: saved.value ? "Your settings are up to date." : "Try saving your settings again.",
				"is-dismissable": "",
				onDismiss: ($event) => visible.value = false
			}, createSlots({ _: 2 }, [!saved.value ? {
				name: "end",
				fn: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(_sfc_main$1), {
						label: "Retry",
						variant: "ghost",
						size: "sm",
						onClick: ($event) => saved.value = true
					}, null, _parent, _scopeId));
					else return [createVNode(unref(_sfc_main$1), {
						label: "Retry",
						variant: "ghost",
						size: "sm",
						onClick: ($event) => saved.value = true
					}, null, 8, ["onClick"])];
				}),
				key: "0"
			} : void 0]), _parent));
			if (!visible.value) _push(`<p class="input-preview-note" role="status"> Notification dismissed. Use the button to show it again. </p>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/banner/actions.vue
var _sfc_setup$3 = actions_vue_vue_type_script_setup_true_lang_default.setup;
actions_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/banner/actions.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var actions_default$1 = actions_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/banner/actions.vue?raw&highlighted
var actions_default = {
	"source": "<script setup lang=\"ts\">\nimport { Banner } from '@astryx-vue/core/Banner'\nimport { Button } from '@astryx-vue/core/Button'\nimport { shallowRef } from 'vue'\n\nconst version = shallowRef(0)\nconst visible = shallowRef(true)\nconst saved = shallowRef(false)\nfunction restore(): void {\n  version.value += 1\n  visible.value = true\n  saved.value = false\n}\n<\/script>\n\n<template>\n  <div class=\"input-preview-stack\">\n    <Button label=\"Show notification\" variant=\"secondary\" @click=\"restore\" />\n    <Banner :key=\"version\" :status=\"saved ? 'success' : 'error'\" :title=\"saved ? 'Changes saved' : 'Save failed'\" :description=\"saved ? 'Your settings are up to date.' : 'Try saving your settings again.'\" is-dismissable @dismiss=\"visible = false\">\n      <template v-if=\"!saved\" #end>\n        <Button label=\"Retry\" variant=\"ghost\" size=\"sm\" @click=\"saved = true\" />\n      </template>\n    </Banner>\n    <p v-if=\"!visible\" class=\"input-preview-note\" role=\"status\">\n      Notification dismissed. Use the button to show it again.\n    </p>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Banner } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Banner'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> version</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">0</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> visible</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> saved</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> restore</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">()</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  version.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">+=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> 1</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  visible.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> true</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  saved.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> false</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Show notification\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"secondary\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">restore</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">key</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">version</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">saved </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'success'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> :</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'error'\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">saved </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Changes saved'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> :</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Save failed'\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">saved </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Your settings are up to date.'</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> :</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'Try saving your settings again.'\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-dismissable</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">dismiss</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">visible </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> v-if</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">!</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">saved</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">end</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Retry\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ghost\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">saved </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> true</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-if</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"!visible\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-note\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> role</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"status\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Notification dismissed. Use the button to show it again.</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/banner/containers.vue?vue&type=script&setup=true&lang.ts
var containers_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "containers",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "slider-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				status: "info",
				title: "Card notification",
				description: "Use a rounded card inside page content.",
				elevation: "low"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				status: "warning",
				title: "Scheduled maintenance",
				description: "The service will be unavailable during the maintenance window.",
				container: "section"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/banner/containers.vue
var _sfc_setup$2 = containers_vue_vue_type_script_setup_true_lang_default.setup;
containers_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/banner/containers.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var containers_default$1 = containers_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/banner/containers.vue?raw&highlighted
var containers_default = {
	"source": "<script setup lang=\"ts\">\nimport { Banner } from '@astryx-vue/core/Banner'\n<\/script>\n\n<template>\n  <div class=\"slider-preview-stack\">\n    <Banner status=\"info\" title=\"Card notification\" description=\"Use a rounded card inside page content.\" elevation=\"low\" />\n    <Banner status=\"warning\" title=\"Scheduled maintenance\" description=\"The service will be unavailable during the maintenance window.\" container=\"section\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Banner } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Banner'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"slider-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"info\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Card notification\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Use a rounded card inside page content.\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> elevation</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"low\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"warning\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Scheduled maintenance\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"The service will be unavailable during the maintenance window.\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> container</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"section\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/banner/details.vue?vue&type=script&setup=true&lang.ts
var details_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "details",
	__ssrInlineRender: true,
	setup(__props) {
		const open = shallowRef(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				"is-open": open.value,
				"onUpdate:isOpen": ($event) => open.value = $event,
				status: "info",
				title: "Two settings will change",
				description: "Expand the details before continuing."
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<ul class="banner-preview-list"${_scopeId}><li${_scopeId}>New members will receive a welcome email.</li><li${_scopeId}>Weekly summaries will arrive on Monday.</li></ul>`);
					else return [createVNode("ul", { class: "banner-preview-list" }, [createVNode("li", null, "New members will receive a welcome email."), createVNode("li", null, "Weekly summaries will arrive on Monday.")])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				status: "error",
				title: "Two fields need attention",
				collapsible: false
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<ul class="banner-preview-list"${_scopeId}><li${_scopeId}>Enter a valid email address.</li><li${_scopeId}>Choose at least one notification channel.</li></ul>`);
					else return [createVNode("ul", { class: "banner-preview-list" }, [createVNode("li", null, "Enter a valid email address."), createVNode("li", null, "Choose at least one notification channel.")])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/banner/details.vue
var _sfc_setup$1 = details_vue_vue_type_script_setup_true_lang_default.setup;
details_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/banner/details.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var details_default$1 = details_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/banner/details.vue?raw&highlighted
var details_default = {
	"source": "<script setup lang=\"ts\">\nimport { Banner } from '@astryx-vue/core/Banner'\nimport { shallowRef } from 'vue'\n\nconst open = shallowRef(false)\n<\/script>\n\n<template>\n  <div class=\"input-preview-stack\">\n    <Banner v-model:is-open=\"open\" status=\"info\" title=\"Two settings will change\" description=\"Expand the details before continuing.\">\n      <ul class=\"banner-preview-list\">\n        <li>New members will receive a welcome email.</li>\n        <li>Weekly summaries will arrive on Monday.</li>\n      </ul>\n    </Banner>\n    <Banner status=\"error\" title=\"Two fields need attention\" :collapsible=\"false\">\n      <ul class=\"banner-preview-list\">\n        <li>Enter a valid email address.</li>\n        <li>Choose at least one notification channel.</li>\n      </ul>\n    </Banner>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Banner } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Banner'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> open</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">is-open</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">open</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"info\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Two settings will change\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Expand the details before continuing.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ul</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"banner-preview-list\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">li</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>New members will receive a welcome email.&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">li</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">li</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Weekly summaries will arrive on Monday.&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">li</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ul</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"error\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Two fields need attention\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">collapsible</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ul</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"banner-preview-list\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">li</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Enter a valid email address.&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">li</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">li</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>Choose at least one notification channel.&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">li</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ul</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/banner/statuses.vue?vue&type=script&setup=true&lang.ts
var statuses_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "statuses",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				status: "info",
				title: "An update is available",
				description: "Restart the application to use the new version."
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				status: "success",
				title: "Changes saved",
				description: "Your team can now use the updated settings."
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				status: "warning",
				title: "Storage is nearly full",
				description: "Remove unused files before uploading more content."
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				status: "error",
				title: "Changes could not be saved",
				description: "Check your connection and try again."
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/banner/statuses.vue
var _sfc_setup = statuses_vue_vue_type_script_setup_true_lang_default.setup;
statuses_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/banner/statuses.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var statuses_default$1 = statuses_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/banner/statuses.vue?raw&highlighted
var statuses_default = {
	"source": "<script setup lang=\"ts\">\nimport { Banner } from '@astryx-vue/core/Banner'\n<\/script>\n\n<template>\n  <div class=\"input-preview-stack\">\n    <Banner status=\"info\" title=\"An update is available\" description=\"Restart the application to use the new version.\" />\n    <Banner status=\"success\" title=\"Changes saved\" description=\"Your team can now use the updated settings.\" />\n    <Banner status=\"warning\" title=\"Storage is nearly full\" description=\"Remove unused files before uploading more content.\" />\n    <Banner status=\"error\" title=\"Changes could not be saved\" description=\"Check your connection and try again.\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Banner } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Banner'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"info\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"An update is available\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Restart the application to use the new version.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"success\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Changes saved\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Your team can now use the updated settings.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"warning\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Storage is nearly full\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Remove unused files before uploading more content.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Banner</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"error\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> title</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Changes could not be saved\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Check your connection and try again.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/banner/index.ts
var options = { className: "input-preview-host" };
var bannerStatuses = defineDemo(statuses_default$1, statuses_default, options);
var bannerDetails = defineDemo(details_default$1, details_default, options);
var bannerActions = defineDemo(actions_default$1, actions_default, options);
var bannerContainers = defineDemo(containers_default$1, containers_default, options);
//#endregion
export { bannerStatuses as i, bannerContainers as n, bannerDetails as r, bannerActions as t };
