import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { computed, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, inject, mergeProps, normalizeClass, onMounted, onUnmounted, openBlock, provide, reactive, ref, renderSlot, unref, useSSRContext, watch, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/TabList-LV1U4ZD6.js
var tabListContextKey = Symbol("tabListContext");
var _hoisted_1$1 = [
	"id",
	"aria-selected",
	"aria-controls",
	"tabindex",
	"disabled"
];
var _hoisted_2 = { class: "astryx-tab__label" };
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	__name: "Tab",
	props: {
		value: {},
		panelId: {},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		const context = inject(tabListContextKey);
		const rootRef = ref();
		const isSelected = computed(() => context?.value.value === props.value);
		const tabIndex = computed(() => isSelected.value && !props.disabled ? 0 : -1);
		const classes = computed(() => [
			"astryx-tab",
			`astryx-tab--size-${context?.size.value ?? "md"}`,
			isSelected.value && "astryx-tab--selected",
			props.disabled && "astryx-tab--disabled"
		]);
		function handleClick() {
			if (props.disabled || !context) return;
			context.selectTab(props.value);
		}
		function handleKeydown(event) {
			if (props.disabled || !context) return;
			switch (event.key) {
				case "ArrowRight":
				case "ArrowDown":
					event.preventDefault();
					context.moveFocus("next", props.value);
					break;
				case "ArrowLeft":
				case "ArrowUp":
					event.preventDefault();
					context.moveFocus("prev", props.value);
					break;
				case "Home":
					event.preventDefault();
					context.moveFocus("first", props.value);
					break;
				case "End":
					event.preventDefault();
					context.moveFocus("last", props.value);
			}
		}
		onMounted(() => {
			if (!context || !rootRef.value) return;
			context.registerTab({
				value: props.value,
				disabled: props.disabled,
				el: rootRef.value
			});
		});
		onUnmounted(() => {
			context?.unregisterTab(props.value);
		});
		watch(() => props.disabled, (disabled) => {
			if (!context || !rootRef.value) return;
			context.registerTab({
				value: props.value,
				disabled,
				el: rootRef.value
			});
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", {
				id: `astryx-tab-${__props.value}`,
				ref_key: "rootRef",
				ref: rootRef,
				type: "button",
				role: "tab",
				class: normalizeClass(classes.value),
				"aria-selected": isSelected.value,
				"aria-controls": __props.panelId,
				tabindex: tabIndex.value,
				disabled: __props.disabled,
				onClick: handleClick,
				onKeydown: handleKeydown
			}, [createElementVNode("span", _hoisted_2, [renderSlot(_ctx.$slots, "default")])], 42, _hoisted_1$1);
		};
	}
});
var _hoisted_1 = { class: "astryx-tab-list__strip" };
var _sfc_main = /*@__PURE__*/ defineComponent({
	__name: "TabList",
	props: {
		value: {},
		size: { default: "md" },
		layout: { default: "hug" },
		hasDivider: {
			type: Boolean,
			default: false
		}
	},
	emits: ["update:value", "change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const tabs = reactive([]);
		const focusedValue = ref(props.value);
		const enabledTabs = computed(() => tabs.filter((tab) => !tab.disabled));
		function selectTab(value) {
			if (value === props.value) return;
			emit("update:value", value);
			emit("change", value);
			focusedValue.value = value;
		}
		function moveFocus(direction, value) {
			const stops = enabledTabs.value;
			if (stops.length === 0) return;
			const index = stops.findIndex((tab) => tab.value === value);
			let nextIndex = index;
			switch (direction) {
				case "next":
					nextIndex = index >= 0 ? (index + 1) % stops.length : 0;
					break;
				case "prev":
					nextIndex = index >= 0 ? (index - 1 + stops.length) % stops.length : stops.length - 1;
					break;
				case "first":
					nextIndex = 0;
					break;
				case "last": nextIndex = stops.length - 1;
			}
			const next = stops[nextIndex];
			if (!next) return;
			focusedValue.value = next.value;
			selectTab(next.value);
			next.el.focus();
		}
		function registerTab(tab) {
			const existingIndex = tabs.findIndex((t) => t.value === tab.value);
			if (existingIndex >= 0) tabs.splice(existingIndex, 1, tab);
			else tabs.push(tab);
		}
		function unregisterTab(value) {
			const index = tabs.findIndex((t) => t.value === value);
			if (index >= 0) tabs.splice(index, 1);
		}
		provide(tabListContextKey, {
			value: computed(() => props.value),
			size: computed(() => props.size),
			layout: computed(() => props.layout),
			hasDivider: computed(() => props.hasDivider),
			tabs,
			focusedValue,
			registerTab,
			unregisterTab,
			selectTab,
			moveFocus
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["astryx-tab-list", [
					`astryx-tab-list--size-${__props.size}`,
					`astryx-tab-list--layout-${__props.layout}`,
					__props.hasDivider && "astryx-tab-list--has-divider"
				]]),
				role: "tablist"
			}, [createElementVNode("div", _hoisted_1, [renderSlot(_ctx.$slots, "default")])], 2);
		};
	}
});
//#endregion
//#region components/demos/tab-list/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const value = ref("overview");
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), mergeProps({
				value: value.value,
				"onUpdate:value": ($event) => value.value = $event
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), { value: "overview" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Overview `);
								else return [createTextVNode(" Overview ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { value: "props" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Props `);
								else return [createTextVNode(" Props ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { value: "examples" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Examples `);
								else return [createTextVNode(" Examples ")];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1), { value: "overview" }, {
							default: withCtx(() => [createTextVNode(" Overview ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { value: "props" }, {
							default: withCtx(() => [createTextVNode(" Props ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { value: "examples" }, {
							default: withCtx(() => [createTextVNode(" Examples ")]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/tab-list/basic.vue
var _sfc_setup$2 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/tab-list/basic.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/tab-list/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Tab, TabList } from '@astryx-vue/core/TabList'\nimport { ref } from 'vue'\n\nconst value = ref('overview')\n<\/script>\n\n<template>\n  <TabList v-model:value=\"value\">\n    <Tab value=\"overview\">\n      Overview\n    </Tab>\n    <Tab value=\"props\">\n      Props\n    </Tab>\n    <Tab value=\"examples\">\n      Examples\n    </Tab>\n  </TabList>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Tab, TabList } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TabList'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'overview'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TabList</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"overview\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Overview</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"props\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Props</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"examples\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Examples</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TabList</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/tab-list/divider.vue?vue&type=script&setup=true&lang.ts
var divider_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "divider",
	__ssrInlineRender: true,
	setup(__props) {
		const value = ref("account");
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), mergeProps({
				value: value.value,
				"onUpdate:value": ($event) => value.value = $event,
				"has-divider": ""
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), { value: "account" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Account `);
								else return [createTextVNode(" Account ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { value: "security" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Security `);
								else return [createTextVNode(" Security ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { value: "notifications" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Notifications `);
								else return [createTextVNode(" Notifications ")];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1), { value: "account" }, {
							default: withCtx(() => [createTextVNode(" Account ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { value: "security" }, {
							default: withCtx(() => [createTextVNode(" Security ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { value: "notifications" }, {
							default: withCtx(() => [createTextVNode(" Notifications ")]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/tab-list/divider.vue
var _sfc_setup$1 = divider_vue_vue_type_script_setup_true_lang_default.setup;
divider_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/tab-list/divider.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var divider_default$1 = divider_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/tab-list/divider.vue?raw&highlighted
var divider_default = {
	"source": "<script setup lang=\"ts\">\nimport { Tab, TabList } from '@astryx-vue/core/TabList'\nimport { ref } from 'vue'\n\nconst value = ref('account')\n<\/script>\n\n<template>\n  <TabList v-model:value=\"value\" has-divider>\n    <Tab value=\"account\">\n      Account\n    </Tab>\n    <Tab value=\"security\">\n      Security\n    </Tab>\n    <Tab value=\"notifications\">\n      Notifications\n    </Tab>\n  </TabList>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Tab, TabList } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TabList'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'account'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TabList</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> has-divider</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"account\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Account</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"security\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Security</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"notifications\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Notifications</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TabList</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/tab-list/sizes.vue?vue&type=script&setup=true&lang.ts
var sizes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "sizes",
	__ssrInlineRender: true,
	setup(__props) {
		const value = ref("md");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "tab-list-preview__stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				value: value.value,
				"onUpdate:value": ($event) => value.value = $event,
				size: "sm"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$1), { value: "sm" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Small `);
								else return [createTextVNode(" Small ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { value: "md" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Medium `);
								else return [createTextVNode(" Medium ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$1), { value: "lg" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Large `);
								else return [createTextVNode(" Large ")];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$1), { value: "sm" }, {
							default: withCtx(() => [createTextVNode(" Small ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { value: "md" }, {
							default: withCtx(() => [createTextVNode(" Medium ")]),
							_: 1
						}),
						createVNode(unref(_sfc_main$1), { value: "lg" }, {
							default: withCtx(() => [createTextVNode(" Large ")]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/tab-list/sizes.vue
var _sfc_setup = sizes_vue_vue_type_script_setup_true_lang_default.setup;
sizes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/tab-list/sizes.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var sizes_default$1 = sizes_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/tab-list/sizes.vue?raw&highlighted
var sizes_default = {
	"source": "<script setup lang=\"ts\">\nimport { Tab, TabList } from '@astryx-vue/core/TabList'\nimport { ref } from 'vue'\n\nconst value = ref('md')\n<\/script>\n\n<template>\n  <div class=\"tab-list-preview__stack\">\n    <TabList v-model:value=\"value\" size=\"sm\">\n      <Tab value=\"sm\">\n        Small\n      </Tab>\n      <Tab value=\"md\">\n        Medium\n      </Tab>\n      <Tab value=\"lg\">\n        Large\n      </Tab>\n    </TabList>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Tab, TabList } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/TabList'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'md'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"tab-list-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TabList</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        Small</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"md\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        Medium</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"lg\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        Large</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Tab</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">TabList</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/tab-list/index.ts
var tabListBasic = defineDemo(basic_default$1, basic_default, { className: "tab-list-preview" });
var tabListSizes = defineDemo(sizes_default$1, sizes_default, { className: "tab-list-preview" });
var tabListDivider = defineDemo(divider_default$1, divider_default, { className: "tab-list-preview" });
//#endregion
export { tabListDivider as n, tabListSizes as r, tabListBasic as t };
