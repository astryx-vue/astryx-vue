import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { n as _sfc_main$1, t as _sfc_main$2 } from "./ListItem-pGxvn6QJ.Do9DWm4p.js";
import { Fragment, createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, mergeProps, openBlock, ref, renderList, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
//#region components/demos/list/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main$1), mergeProps({ header: "Inbox" }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$2), {
							label: "Mentions",
							description: "Comments that name you"
						}, {
							startContent: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon i-carbon-information" style="${ssrRenderStyle({ "color": "var(--astryx-icon-accent-foreground)" })}"${_scopeId}></span>`);
								else return [createVNode("span", {
									class: "css-icon i-carbon-information",
									style: { "color": "var(--astryx-icon-accent-foreground)" }
								})];
							}),
							endContent: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main), { variant: "info" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` 3 `);
										else return [createTextVNode(" 3 ")];
									}),
									_: 1
								}, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main), { variant: "info" }, {
									default: withCtx(() => [createTextVNode(" 3 ")]),
									_: 1
								})];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), {
							label: "Assigned to you",
							description: "Two issues are waiting for a review"
						}, {
							startContent: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon i-carbon-warning" style="${ssrRenderStyle({ "color": "var(--astryx-icon-warning-foreground)" })}"${_scopeId}></span>`);
								else return [createVNode("span", {
									class: "css-icon i-carbon-warning",
									style: { "color": "var(--astryx-icon-warning-foreground)" }
								})];
							}),
							endContent: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(_sfc_main), { variant: "warning" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` 2 `);
										else return [createTextVNode(" 2 ")];
									}),
									_: 1
								}, _parent, _scopeId));
								else return [createVNode(unref(_sfc_main), { variant: "warning" }, {
									default: withCtx(() => [createTextVNode(" 2 ")]),
									_: 1
								})];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), {
							label: "Build finished",
							description: "main passed every check"
						}, {
							startContent: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon i-carbon-checkmark-filled" style="${ssrRenderStyle({ "color": "var(--astryx-icon-success-foreground)" })}"${_scopeId}></span>`);
								else return [createVNode("span", {
									class: "css-icon i-carbon-checkmark-filled",
									style: { "color": "var(--astryx-icon-success-foreground)" }
								})];
							}),
							endContent: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="css-icon css-icon--sm i-carbon-chevron-right"${_scopeId}></span>`);
								else return [createVNode("span", { class: "css-icon css-icon--sm i-carbon-chevron-right" })];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$2), {
							label: "Mentions",
							description: "Comments that name you"
						}, {
							startContent: withCtx(() => [createVNode("span", {
								class: "css-icon i-carbon-information",
								style: { "color": "var(--astryx-icon-accent-foreground)" }
							})]),
							endContent: withCtx(() => [createVNode(unref(_sfc_main), { variant: "info" }, {
								default: withCtx(() => [createTextVNode(" 3 ")]),
								_: 1
							})]),
							_: 1
						}),
						createVNode(unref(_sfc_main$2), {
							label: "Assigned to you",
							description: "Two issues are waiting for a review"
						}, {
							startContent: withCtx(() => [createVNode("span", {
								class: "css-icon i-carbon-warning",
								style: { "color": "var(--astryx-icon-warning-foreground)" }
							})]),
							endContent: withCtx(() => [createVNode(unref(_sfc_main), { variant: "warning" }, {
								default: withCtx(() => [createTextVNode(" 2 ")]),
								_: 1
							})]),
							_: 1
						}),
						createVNode(unref(_sfc_main$2), {
							label: "Build finished",
							description: "main passed every check"
						}, {
							startContent: withCtx(() => [createVNode("span", {
								class: "css-icon i-carbon-checkmark-filled",
								style: { "color": "var(--astryx-icon-success-foreground)" }
							})]),
							endContent: withCtx(() => [createVNode("span", { class: "css-icon css-icon--sm i-carbon-chevron-right" })]),
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
//#region components/demos/list/basic.vue
var _sfc_setup$3 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/list/basic.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/list/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Badge } from '@astryx-vue/core/Badge'\nimport { List, ListItem } from '@astryx-vue/core/List'\n<\/script>\n\n<template>\n  <List header=\"Inbox\">\n    <ListItem label=\"Mentions\" description=\"Comments that name you\">\n      <template #startContent>\n        <span class=\"css-icon i-carbon-information\" style=\"color: var(--astryx-icon-accent-foreground)\" />\n      </template>\n      <template #endContent>\n        <Badge variant=\"info\">\n          3\n        </Badge>\n      </template>\n    </ListItem>\n    <ListItem label=\"Assigned to you\" description=\"Two issues are waiting for a review\">\n      <template #startContent>\n        <span class=\"css-icon i-carbon-warning\" style=\"color: var(--astryx-icon-warning-foreground)\" />\n      </template>\n      <template #endContent>\n        <Badge variant=\"warning\">\n          2\n        </Badge>\n      </template>\n    </ListItem>\n    <ListItem label=\"Build finished\" description=\"main passed every check\">\n      <template #startContent>\n        <span class=\"css-icon i-carbon-checkmark-filled\" style=\"color: var(--astryx-icon-success-foreground)\" />\n      </template>\n      <template #endContent>\n        <span class=\"css-icon css-icon--sm i-carbon-chevron-right\" />\n      </template>\n    </ListItem>\n  </List>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Badge } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Badge'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { List, ListItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/List'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> header</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Inbox\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Mentions\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Comments that name you\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">startContent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-information\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"color: var(--astryx-icon-accent-foreground)\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">endContent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Badge</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"info\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          3</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Badge</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Assigned to you\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Two issues are waiting for a review\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">startContent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-warning\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"color: var(--astryx-icon-warning-foreground)\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">endContent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Badge</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> variant</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"warning\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">          2</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Badge</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Build finished\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"main passed every check\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">startContent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-checkmark-filled\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"color: var(--astryx-icon-success-foreground)\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">endContent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon css-icon--sm i-carbon-chevron-right\"</span><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\"> /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/list/densities.vue?vue&type=script&setup=true&lang.ts
var densities_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "densities",
	__ssrInlineRender: true,
	setup(__props) {
		const densities = [
			{
				density: "compact",
				note: "compact — 4px of block padding, for dense menus"
			},
			{
				density: "balanced",
				note: "balanced — 8px, the default"
			},
			{
				density: "spacious",
				note: "spacious — 12px of block and inline padding"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "list-preview__stack" }, _attrs))}><!--[-->`);
			ssrRenderList(densities, (item) => {
				_push(`<section class="list-preview__section"><span class="list-preview__note">${ssrInterpolate(item.note)}</span>`);
				_push(ssrRenderComponent(unref(_sfc_main$1), {
					density: item.density,
					"has-dividers": ""
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(ssrRenderComponent(unref(_sfc_main$2), {
								label: "Design review",
								description: "Today at 14:00"
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(unref(_sfc_main$2), {
								label: "Release notes",
								description: "Draft shared with the team"
							}, null, _parent, _scopeId));
						} else return [createVNode(unref(_sfc_main$2), {
							label: "Design review",
							description: "Today at 14:00"
						}), createVNode(unref(_sfc_main$2), {
							label: "Release notes",
							description: "Draft shared with the team"
						})];
					}),
					_: 2
				}, _parent));
				_push(`</section>`);
			});
			_push(`<!--]--></div>`);
		};
	}
});
//#endregion
//#region components/demos/list/densities.vue
var _sfc_setup$2 = densities_vue_vue_type_script_setup_true_lang_default.setup;
densities_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/list/densities.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var densities_default$1 = densities_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/list/densities.vue?raw&highlighted
var densities_default = {
	"source": "<script setup lang=\"ts\">\nimport type { ListDensity } from '@astryx-vue/core/List'\nimport { List, ListItem } from '@astryx-vue/core/List'\n\nconst densities: { density: ListDensity, note: string }[] = [\n  { density: 'compact', note: 'compact — 4px of block padding, for dense menus' },\n  { density: 'balanced', note: 'balanced — 8px, the default' },\n  { density: 'spacious', note: 'spacious — 12px of block and inline padding' },\n]\n<\/script>\n\n<template>\n  <div class=\"list-preview__stack\">\n    <section v-for=\"item in densities\" :key=\"item.density\" class=\"list-preview__section\">\n      <span class=\"list-preview__note\">{{ item.note }}</span>\n      <List :density=\"item.density\" has-dividers>\n        <ListItem label=\"Design review\" description=\"Today at 14:00\" />\n        <ListItem label=\"Release notes\" description=\"Draft shared with the team\" />\n      </List>\n    </section>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ListDensity } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/List'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { List, ListItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/List'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> densities</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { </span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">density</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ListDensity</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">note</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> string</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }[] </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { density: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'compact'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, note: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'compact — 4px of block padding, for dense menus'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { density: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'balanced'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, note: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'balanced — 8px, the default'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { density: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'spacious'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, note: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'spacious — 12px of block and inline padding'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">section</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-for</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"item in densities\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> :key</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"item.density\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__section\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__note\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>{{ item.note }}&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">density</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">item.density</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> has-dividers</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Design review\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Today at 14:00\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Release notes\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Draft shared with the team\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">section</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/list/interactive.vue?vue&type=script&setup=true&lang.ts
var interactive_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "interactive",
	__ssrInlineRender: true,
	setup(__props) {
		const sections = [
			{
				id: "notifications",
				label: "Notifications",
				description: "Alerts, digests and reminders"
			},
			{
				id: "privacy",
				label: "Privacy",
				description: "Who can see your activity"
			},
			{
				id: "billing",
				label: "Billing",
				description: "Not available on this plan"
			}
		];
		const selected = ref("privacy");
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main$1), mergeProps({ "has-dividers": "" }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<!--[-->`);
						ssrRenderList(sections, (section) => {
							_push(ssrRenderComponent(unref(_sfc_main$2), {
								key: section.id,
								description: section.description,
								"is-disabled": section.id === "billing",
								"is-selected": selected.value === section.id,
								label: section.label,
								onClick: ($event) => selected.value = section.id
							}, {
								endContent: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										if (selected.value === section.id) _push(`<span class="css-icon i-carbon-checkmark" style="${ssrRenderStyle({ "color": "var(--astryx-icon-accent-foreground)" })}"${_scopeId}></span>`);
										else _push(`<!---->`);
									} else return [selected.value === section.id ? (openBlock(), createBlock("span", {
										key: 0,
										class: "css-icon i-carbon-checkmark",
										style: { "color": "var(--astryx-icon-accent-foreground)" }
									})) : createCommentVNode("", true)];
								}),
								_: 2
							}, _parent, _scopeId));
						});
						_push(`<!--]-->`);
					} else return [(openBlock(), createBlock(Fragment, null, renderList(sections, (section) => {
						return createVNode(unref(_sfc_main$2), {
							key: section.id,
							description: section.description,
							"is-disabled": section.id === "billing",
							"is-selected": selected.value === section.id,
							label: section.label,
							onClick: ($event) => selected.value = section.id
						}, {
							endContent: withCtx(() => [selected.value === section.id ? (openBlock(), createBlock("span", {
								key: 0,
								class: "css-icon i-carbon-checkmark",
								style: { "color": "var(--astryx-icon-accent-foreground)" }
							})) : createCommentVNode("", true)]),
							_: 2
						}, 1032, [
							"description",
							"is-disabled",
							"is-selected",
							"label",
							"onClick"
						]);
					}), 64))];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demos/list/interactive.vue
var _sfc_setup$1 = interactive_vue_vue_type_script_setup_true_lang_default.setup;
interactive_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/list/interactive.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var interactive_default$1 = interactive_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/list/interactive.vue?raw&highlighted
var interactive_default = {
	"source": "<script setup lang=\"ts\">\nimport { List, ListItem } from '@astryx-vue/core/List'\nimport { ref } from 'vue'\n\nconst sections = [\n  { id: 'notifications', label: 'Notifications', description: 'Alerts, digests and reminders' },\n  { id: 'privacy', label: 'Privacy', description: 'Who can see your activity' },\n  { id: 'billing', label: 'Billing', description: 'Not available on this plan' },\n]\n\nconst selected = ref('privacy')\n<\/script>\n\n<template>\n  <List has-dividers>\n    <ListItem\n      v-for=\"section in sections\"\n      :key=\"section.id\"\n      :description=\"section.description\"\n      :is-disabled=\"section.id === 'billing'\"\n      :is-selected=\"selected === section.id\"\n      :label=\"section.label\"\n      @click=\"selected = section.id\"\n    >\n      <template #endContent>\n        <span\n          v-if=\"selected === section.id\"\n          class=\"css-icon i-carbon-checkmark\"\n          style=\"color: var(--astryx-icon-accent-foreground)\"\n        />\n      </template>\n    </ListItem>\n  </List>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { List, ListItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/List'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ref } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> sections</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { id: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'notifications'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Notifications'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, description: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Alerts, digests and reminders'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { id: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'privacy'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Privacy'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, description: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Who can see your activity'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { id: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'billing'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Billing'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, description: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Not available on this plan'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> selected</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> ref</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'privacy'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> has-dividers</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">      v-for</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">section </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">in</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> sections</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">key</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">section.id</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">section.description</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">is-disabled</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">section.id </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">===</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'billing'\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">is-selected</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">selected </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">===</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> section.id</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">section.label</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">selected </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> section.id</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    ></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> #</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">endContent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          v-if</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"selected === section.id\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"css-icon i-carbon-checkmark\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">          style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"color: var(--astryx-icon-accent-foreground)\"</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic\">        /</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/list/markers.vue?vue&type=script&setup=true&lang.ts
var markers_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "markers",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "list-preview__row" }, _attrs))}><div class="list-preview__marker"><span class="list-preview__note">disc</span>`);
			_push(ssrRenderComponent(unref(_sfc_main$1), { "list-style": "disc" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$2), { label: "First point" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), { label: "Second point" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), { label: "Third point" }, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$2), { label: "First point" }),
						createVNode(unref(_sfc_main$2), { label: "Second point" }),
						createVNode(unref(_sfc_main$2), { label: "Third point" })
					];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="list-preview__marker"><span class="list-preview__note">circle</span>`);
			_push(ssrRenderComponent(unref(_sfc_main$1), { "list-style": "circle" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$2), { label: "Nested point" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), { label: "Nested point" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), { label: "Nested point" }, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$2), { label: "Nested point" }),
						createVNode(unref(_sfc_main$2), { label: "Nested point" }),
						createVNode(unref(_sfc_main$2), { label: "Nested point" })
					];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="list-preview__marker"><span class="list-preview__note">decimal, starting at 3</span>`);
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				"list-style": "decimal",
				start: 3
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$2), { label: "Third step" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), { label: "Fourth step" }, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), { label: "Fifth step" }, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$2), { label: "Third step" }),
						createVNode(unref(_sfc_main$2), { label: "Fourth step" }),
						createVNode(unref(_sfc_main$2), { label: "Fifth step" })
					];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region components/demos/list/markers.vue
var _sfc_setup = markers_vue_vue_type_script_setup_true_lang_default.setup;
markers_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/list/markers.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var markers_default$1 = markers_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/list/markers.vue?raw&highlighted
var markers_default = {
	"source": "<script setup lang=\"ts\">\nimport { List, ListItem } from '@astryx-vue/core/List'\n<\/script>\n\n<template>\n  <div class=\"list-preview__row\">\n    <div class=\"list-preview__marker\">\n      <span class=\"list-preview__note\">disc</span>\n      <List list-style=\"disc\">\n        <ListItem label=\"First point\" />\n        <ListItem label=\"Second point\" />\n        <ListItem label=\"Third point\" />\n      </List>\n    </div>\n    <div class=\"list-preview__marker\">\n      <span class=\"list-preview__note\">circle</span>\n      <List list-style=\"circle\">\n        <ListItem label=\"Nested point\" />\n        <ListItem label=\"Nested point\" />\n        <ListItem label=\"Nested point\" />\n      </List>\n    </div>\n    <div class=\"list-preview__marker\">\n      <span class=\"list-preview__note\">decimal, starting at 3</span>\n      <List list-style=\"decimal\" :start=\"3\">\n        <ListItem label=\"Third step\" />\n        <ListItem label=\"Fourth step\" />\n        <ListItem label=\"Fifth step\" />\n      </List>\n    </div>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { List, ListItem } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/List'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__row\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__marker\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__note\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>disc&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> list-style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"disc\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"First point\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Second point\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Third point\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__marker\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__note\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>circle&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> list-style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"circle\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Nested point\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Nested point\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Nested point\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__marker\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"list-preview__note\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">>decimal, starting at 3&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">span</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> list-style</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"decimal\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">start</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">3</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Third step\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Fourth step\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">        &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ListItem</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Fifth step\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">List</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/list/index.ts
var options = { className: "list-preview" };
var listBasic = defineDemo(basic_default$1, basic_default, options);
var listDensities = defineDemo(densities_default$1, densities_default, options);
var listMarkers = defineDemo(markers_default$1, markers_default, options);
var listInteractive = defineDemo(interactive_default$1, interactive_default, options);
//#endregion
export { listMarkers as i, listDensities as n, listInteractive as r, listBasic as t };
