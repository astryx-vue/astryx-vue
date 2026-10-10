import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { i as alertDialogOverview } from "./alert-dialog.DdwxJYU2.js";
import { r as avatarSizes } from "./avatar.D4xFQzNA.js";
import { t as avatarGroupBasic } from "./avatar-group.ksmEUJdH.js";
import { t as badgeColors } from "./badge.C9i3VqFc.js";
import { i as bannerStatuses } from "./banner.5CtNyqni.js";
import { t as blockquoteCite } from "./blockquote.Bw6PLvv8.js";
import { n as bottomSheetOverview } from "./bottom-sheet.ODiRk8HJ.js";
import { t as breadcrumbsBasic } from "./breadcrumbs.CgxOwGVP.js";
import { i as buttonVariants } from "./button.DTbcsyvO.js";
import { t as buttonGroupBasic } from "./button-group.xAKRmKui.js";
import { t as cardBasic } from "./card.CBgvL628.js";
import { n as centerBasic } from "./center.DVGLov6n.js";
import { t as checkboxIndicatorOverview } from "./checkbox-indicator.dxTpw0An.js";
import { n as checkboxInputBasic } from "./checkbox-input.S5XIBmH4.js";
import { t as codeBasic } from "./code.Cp_9Oito.js";
import { t as collapsibleBasic } from "./collapsible.yL2AHl5e.js";
import { r as contextMenuOverview } from "./context-menu.Dskgh_Vh.js";
import { a as dialogOverview } from "./dialog.BqZPH5K4.js";
import { r as dividerOverview } from "./divider.EoVx6WmH.js";
import { n as dropdownMenuOverview } from "./dropdown-menu.dQP7zFhF.js";
import { t as emptyStateBasic } from "./empty-state.CzeGIp3h.js";
import { t as fieldCustom } from "./field.XXz3s2SY.js";
import { n as gridBasic } from "./grid.C-LGN9A4.js";
import { n as headingLevels } from "./heading.CXNxRvC2.js";
import { r as hoverCardOverview } from "./hover-card.BAemcCQr.js";
import { t as iconButtonActionBar } from "./icon-button.KkUfB_zo.js";
import { t as kbdBasic } from "./kbd.BnYqzceS.js";
import { t as linkColors } from "./link.DFY8e4Tk.js";
import { t as listBasic } from "./list.B0l083G0.js";
import { n as moreMenuOverview } from "./more-menu.DYHmlBsQ.js";
import { t as overlayBasic } from "./overlay.Dk5d5ibP.js";
import { i as popoverOverview } from "./popover.BLWqk_l6.js";
import { t as progressBarBasic } from "./progress-bar.ULGQpBeZ.js";
import { n as radioList, t as radioBasic } from "./radio.CEZXIcoK.js";
import { t as segmentedControlBasic } from "./segmented-control.DF3bdWlY.js";
import { t as skeletonProfile } from "./skeleton.RIfE8Ujy.js";
import { t as sliderBasic } from "./slider._HYq_JV4.js";
import { t as spinnerBasic } from "./spinner.Cc53_t4S.js";
import { t as stackDirections } from "./stack.DcO91TxY.js";
import { n as statusDotVariants } from "./status-dot.CJ5rz9pr.js";
import { t as switchBasic } from "./switch.DAmJOwxZ.js";
import { t as tabListBasic } from "./tab-list.B_4DFFMi.js";
import { n as textTypes } from "./text.CYOZIA--.js";
import { n as textAreaBasic } from "./text-area.k2McA90N.js";
import { n as textInputBasic } from "./text-input.B8olMcNe.js";
import { n as toastPreview } from "./toast.Drekl2TJ.js";
import { t as toggleButtonBasic } from "./toggle-button.MKqDJDLJ.js";
import { r as tooltipOverview } from "./tooltip.Cxta4seC.js";
import { t as visuallyHiddenContext } from "./visually-hidden.fJ9sIkBG.js";
import { Fragment, computed, createBlock, createCommentVNode, createSSRApp, createTextVNode, createVNode, customRef, defineAsyncComponent, defineComponent, getCurrentInstance, getCurrentScope, h, hasInjectionContext, inject, isRef, markRaw, mergeProps, nextTick, onBeforeUnmount, onMounted, onScopeDispose, onUnmounted, onUpdated, openBlock, provide, reactive, readonly, ref, renderList, renderSlot, resolveComponent, resolveDynamicComponent, shallowReadonly, shallowRef, toDisplayString, toRef, toValue, unref, useId, useSSRContext, useSlots, useTemplateRef, watch, watchEffect, watchPostEffect, withCtx, withModifiers } from "vue";
import { renderToString, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/components/ClientOnly.js
var ClientOnly = defineComponent({ setup(_, { slots }) {
	const show = ref(false);
	onMounted(() => {
		show.value = true;
	});
	return () => show.value && slots.default ? slots.default() : null;
} });
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/shared.js
var EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;
var APPEARANCE_KEY = "vitepress-theme-appearance";
var iconNameRE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/**
* Parses a fully qualified `collection:name` icon name, corresponding to
* the `vpi-<collection>-<name>` class. Returns null for anything else,
* keeping malformed input out of generated selectors and class attributes.
*/
function parseIconName(name) {
	const colon = name.indexOf(":");
	if (colon === -1) return null;
	const collection = name.slice(0, colon);
	const icon = name.slice(colon + 1);
	if (!iconNameRE.test(collection) || !iconNameRE.test(icon)) return null;
	return {
		collection,
		icon
	};
}
/**
* Placeholder prepended to SSR-emitted URLs when base is relative, later
* replaced with each page's `../` prefix back to the site root.
*/
var RELATIVE_BASE_SENTINEL = "/__VP_BASE__/";
function isRelativeBase(base) {
	return base === "./";
}
/**
* Join two paths, collapsing slash collisions but keeping the `//` that
* follows a protocol.
*/
function joinPath(base, path) {
	const protocol = /^(?:[a-z]+:)?\/\//i.exec(base)?.[0] ?? "";
	return protocol + `${base.slice(protocol.length)}${path}`.replace(/\/+/g, "/");
}
var UnpackStackView = Symbol("stack-view:unpack");
var HASH_WITHOUT_FRAGMENT_RE = /#.*?(?=:~:|$)/;
var HASH_OR_QUERY_RE = /[?#].*$/;
var INDEX_OR_EXT_RE = /(?:(^|\/)index)?(?:\.(?:md|html))?$/;
var INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
var DRIVE_LETTER_REGEX = /^[a-z]:/i;
var KNOWN_EXTENSIONS = /* @__PURE__ */ new Set();
var shellLangs = [
	"shellscript",
	"shell",
	"bash",
	"sh",
	"zsh"
];
var inBrowser = typeof document !== "undefined";
var notFoundPageData = {
	relativePath: "404.md",
	filePath: "",
	title: "404",
	description: "Not Found",
	headers: [],
	frontmatter: {
		sidebar: false,
		layout: "page"
	},
	lastUpdated: 0,
	isNotFound: true
};
function isActive(currentPath, currentHash, matchPath, asRegex = false, skipHashCheck = false) {
	currentPath = normalize(`/${currentPath}`);
	if (asRegex) return new RegExp(matchPath).test(currentPath);
	if (normalize(matchPath) !== currentPath) return false;
	if (skipHashCheck) return true;
	const hashMatch = matchPath.match(HASH_WITHOUT_FRAGMENT_RE);
	if (hashMatch) return currentHash === hashMatch[0];
	return true;
}
function normalize(path) {
	return decodeURI(path).replace(HASH_OR_QUERY_RE, "").replace(INDEX_OR_EXT_RE, "$1");
}
function isExternal(path) {
	return EXTERNAL_URL_RE.test(path);
}
function getLocaleForPath(siteData, relativePath) {
	return Object.keys(siteData?.locales || {}).find((key) => key !== "root" && !isExternal(key) && isActive(relativePath, "", `^/${key}/`, true)) || "root";
}
/**
* Resolves the site data for a route, layering the matched locale and
* additional configs over the root config.
*/
function resolveSiteDataByRoute(siteData, relativePath, filePath) {
	const localeIndex = getLocaleForPath(siteData, relativePath);
	const { label, link, markdown, ...localeConfig } = siteData.locales[localeIndex] ?? {};
	Object.assign(localeConfig, { localeIndex });
	const additionalConfigs = resolveAdditionalConfig(siteData, filePath || relativePath);
	return stackView({ head: mergeHead(siteData.head ?? [], localeConfig.head ?? [], ...additionalConfigs.map((data) => data.head ?? []).reverse()) }, ...additionalConfigs, localeConfig, siteData);
}
/**
* Create the page title string based on config.
*/
function createTitle(siteData, pageData) {
	const title = pageData.title || siteData.title;
	const template = pageData.titleTemplate ?? siteData.titleTemplate;
	if (typeof template === "string" && template.includes(":title")) return template.replace(/:title/g, title);
	const templateString = createTitleTemplate(siteData.title, template);
	if (title === templateString.slice(3)) return title;
	return `${title}${templateString}`;
}
function createTitleTemplate(siteTitle, template) {
	if (template === false) return "";
	if (template === true || template === void 0) return ` | ${siteTitle}`;
	if (siteTitle === template) return "";
	return ` | ${template}`;
}
function mergeHead(...headArrays) {
	const merged = [];
	const keyMap = /* @__PURE__ */ new Map();
	for (const current of headArrays) for (const tag of current) {
		const key = getHeadKey(tag);
		if (key == null) {
			merged.push(tag);
			continue;
		}
		const existingIndex = keyMap.get(key);
		if (existingIndex != null) merged[existingIndex] = tag;
		else {
			keyMap.set(key, merged.length);
			merged.push(tag);
		}
	}
	return merged;
}
function getHeadKey([type, attrs]) {
	if (attrs.id) return `id=${attrs.id}`;
	if (type !== "meta") return;
	for (const name in attrs) if (name !== "content") return `${name}=${attrs[name]}`;
}
function sanitizeFileName(name) {
	const match = DRIVE_LETTER_REGEX.exec(name);
	const driveLetter = match ? match[0] : "";
	return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "_").replace(/(^|\/)_+(?=[^/]*$)/, "$1");
}
function treatAsHtml(filename) {
	if (KNOWN_EXTENSIONS.size === 0) {
		const extraExts = globalThis.process?.env?.VITE_EXTRA_EXTENSIONS || "";
		("3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,yaml,yml,zip" + (extraExts && typeof extraExts === "string" ? "," + extraExts : "")).split(",").forEach((ext) => KNOWN_EXTENSIONS.add(ext));
	}
	const ext = filename.split(".").pop();
	return ext == null || !KNOWN_EXTENSIONS.has(ext.toLowerCase());
}
function escapeRegExp(str) {
	return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function resolveAdditionalConfig({ additionalConfig }, path) {
	if (additionalConfig === void 0) return [];
	if (typeof additionalConfig === "function") return additionalConfig(path) ?? [];
	const configs = [];
	const segments = path.split("/").slice(0, -1);
	while (segments.length) {
		const key = `/${segments.join("/")}/`;
		configs.push(additionalConfig[key]);
		segments.pop();
	}
	configs.push(additionalConfig["/"]);
	return configs.filter((config) => config !== void 0);
}
/**
* Creates a readonly proxy behaving like a deep merge of the given layers,
* without mutating them. Earlier layers take precedence.
*/
function stackView(..._layers) {
	const layers = _layers.filter((layer) => isObject$1(layer));
	if (layers.length <= 1) return _layers[0];
	const allKeys = new Set(layers.flatMap((layer) => Reflect.ownKeys(layer)));
	const allKeysArray = [...allKeys];
	return new Proxy({}, {
		get(_, prop) {
			if (prop === UnpackStackView) return layers;
			return stackView(...layers.map((layer) => layer[prop]).filter((v) => v !== void 0));
		},
		set() {
			throw new Error("StackView is read-only and cannot be mutated.");
		},
		has(_, prop) {
			return allKeys.has(prop);
		},
		ownKeys() {
			return allKeysArray;
		},
		getOwnPropertyDescriptor(_, prop) {
			for (const layer of layers) {
				const descriptor = Object.getOwnPropertyDescriptor(layer, prop);
				if (descriptor) return descriptor;
			}
		}
	});
}
stackView.unpack = function(obj) {
	return obj?.[UnpackStackView];
};
function isObject$1(value) {
	return Object.prototype.toString.call(value) === "[object Object]";
}
function isShell(lang) {
	return shellLangs.includes(lang);
}
//#endregion
//#region ../../node_modules/.pnpm/@vueuse+shared@14.4.0_vue@3.5.43_@typescript+typescript6@6.0.2_/node_modules/@vueuse/shared/dist/index.js
/**
* Call onScopeDispose() if it's inside an effect scope lifecycle, if not, do nothing
*
* @param fn
*/
function tryOnScopeDispose(fn, failSilently) {
	if (getCurrentScope()) {
		onScopeDispose(fn, failSilently);
		return true;
	}
	return false;
}
var localProvidedStateMap = /* @__PURE__ */ new WeakMap();
/**
* On the basis of `inject`, it is allowed to directly call inject to obtain the value after call provide in the same component.
*
* @example
* ```ts
* injectLocal('MyInjectionKey', 1)
* const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
* ```
*
* @__NO_SIDE_EFFECTS__
*/
var injectLocal = (...args) => {
	var _getCurrentInstance;
	const key = args[0];
	const instance = (_getCurrentInstance = getCurrentInstance()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.proxy;
	const owner = instance !== null && instance !== void 0 ? instance : getCurrentScope();
	if (owner == null && !hasInjectionContext()) throw new Error("injectLocal must be called in setup");
	if (owner && localProvidedStateMap.has(owner) && key in localProvidedStateMap.get(owner)) return localProvidedStateMap.get(owner)[key];
	return inject(...args);
};
var isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var notNullish = (val) => val != null;
var toString = Object.prototype.toString;
var isObject = (val) => toString.call(val) === "[object Object]";
var noop = () => {};
function toRef$1(...args) {
	if (args.length !== 1) return toRef(...args);
	const r = args[0];
	return typeof r === "function" ? readonly(customRef(() => ({
		get: r,
		set: noop
	}))) : ref(r);
}
function createFilterWrapper(filter, fn) {
	function wrapper(...args) {
		return new Promise((resolve, reject) => {
			Promise.resolve(filter(() => fn.apply(this, args), {
				fn,
				thisArg: this,
				args
			})).then(resolve).catch(reject);
		});
	}
	if ("cancel" in filter) Object.assign(wrapper, {
		cancel: filter.cancel,
		flush: filter.flush,
		isPending: filter.isPending
	});
	return wrapper;
}
var bypassFilter = (invoke) => {
	return invoke();
};
/**
* Create an EventFilter that debounce the events
*/
function debounceFilter(ms, options = {}) {
	let timer;
	let maxTimer;
	let lastRejector = noop;
	let lastResolve = noop;
	const _pending = shallowRef(false);
	const _clearTimeout = (timer) => {
		clearTimeout(timer);
		lastRejector();
		lastRejector = noop;
	};
	let lastInvoker;
	const handler = (invoke) => {
		const duration = toValue(ms);
		const maxDuration = toValue(options.maxWait);
		if (timer) _clearTimeout(timer);
		if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
			if (maxTimer) {
				_clearTimeout(maxTimer);
				maxTimer = void 0;
			}
			_pending.value = false;
			return Promise.resolve(invoke());
		}
		_pending.value = true;
		return new Promise((resolve, reject) => {
			lastRejector = options.rejectOnCancel ? reject : resolve;
			lastResolve = resolve;
			lastInvoker = invoke;
			if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
				if (timer) _clearTimeout(timer);
				maxTimer = void 0;
				_pending.value = false;
				resolve(lastInvoker());
			}, maxDuration);
			timer = setTimeout(() => {
				if (maxTimer) _clearTimeout(maxTimer);
				maxTimer = void 0;
				_pending.value = false;
				resolve(invoke());
			}, duration);
		});
	};
	return Object.assign(handler, {
		cancel: () => {
			if (timer) {
				_clearTimeout(timer);
				timer = void 0;
			}
			if (maxTimer) {
				_clearTimeout(maxTimer);
				maxTimer = void 0;
			}
			_pending.value = false;
			lastResolve = noop;
		},
		flush: () => {
			if (_pending.value) {
				if (timer) {
					clearTimeout(timer);
					timer = void 0;
				}
				if (maxTimer) {
					clearTimeout(maxTimer);
					maxTimer = void 0;
				}
				_pending.value = false;
				const resolve = lastResolve;
				lastRejector = noop;
				lastResolve = noop;
				resolve(lastInvoker());
			}
		},
		isPending: shallowReadonly(_pending)
	});
}
function throttleFilter(...args) {
	let lastExec = 0;
	let timer;
	let isLeading = true;
	let lastRejector = noop;
	let lastValue;
	let ms;
	let trailing;
	let leading;
	let rejectOnCancel;
	if (!isRef(args[0]) && typeof args[0] === "object") ({delay: ms, trailing = true, leading = true, rejectOnCancel = false} = args[0]);
	else [ms, trailing = true, leading = true, rejectOnCancel = false] = args;
	const clear = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
			lastRejector();
			lastRejector = noop;
		}
	};
	const filter = (_invoke) => {
		const duration = toValue(ms);
		const elapsed = Date.now() - lastExec;
		const invoke = () => {
			return lastValue = _invoke();
		};
		clear();
		if (duration <= 0) {
			lastExec = Date.now();
			return invoke();
		}
		if (elapsed > duration) {
			lastExec = Date.now();
			if (leading || !isLeading) invoke();
		} else if (trailing) lastValue = new Promise((resolve, reject) => {
			lastRejector = rejectOnCancel ? reject : resolve;
			timer = setTimeout(() => {
				lastExec = Date.now();
				isLeading = true;
				resolve(invoke());
				clear();
			}, Math.max(0, duration - elapsed));
		});
		if (!leading && !timer) timer = setTimeout(() => isLeading = true, duration);
		isLeading = false;
		return lastValue;
	};
	return filter;
}
/**
* EventFilter that gives extra controls to pause and resume the filter
*
* @param extendFilter  Extra filter to apply when the PausableFilter is active, default to none
* @param options Options to configure the filter
*/
function pausableFilter(extendFilter = bypassFilter, options = {}) {
	const { initialState = "active" } = options;
	const isActive = toRef$1(initialState === "active");
	function pause() {
		isActive.value = false;
	}
	function resume() {
		isActive.value = true;
	}
	const eventFilter = (...args) => {
		if (isActive.value) extendFilter(...args);
	};
	return {
		isActive: shallowReadonly(isActive),
		pause,
		resume,
		eventFilter
	};
}
/**
* Get a px value for SSR use, do not rely on this method outside of SSR as REM unit is assumed at 16px, which might not be the case on the client
*/
function pxValue(px) {
	return px.endsWith("rem") ? Number.parseFloat(px) * 16 : Number.parseFloat(px);
}
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
function getLifeCycleTarget(target) {
	return target || getCurrentInstance();
}
/**
* Debounce execution of a function.
*
* @see https://vueuse.org/useDebounceFn
* @param  fn          A function to be executed after delay milliseconds debounced.
* @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
* @param  options     Options
*
* @return A new, debounced, function with isPending, cancel, and flush properties.
*/
function useDebounceFn(fn, ms = 200, options = {}) {
	return createFilterWrapper(debounceFilter(ms, options), fn);
}
/**
* Throttle execution of a function. Especially useful for rate limiting
* execution of handlers on events like resize and scroll.
*
* @param   fn             A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
*                                    to `callback` when the throttled-function is executed.
* @param   ms             A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
*                                    (default value: 200)
*
* @param [trailing] if true, call fn again after the time is up (default value: false)
*
* @param [leading] if true, call fn on the leading edge of the ms timeout (default value: true)
*
* @param [rejectOnCancel] if true, reject the last call if it's been cancel (default value: false)
*
* @return  A new, throttled, function.
*
* @__NO_SIDE_EFFECTS__
*/
function useThrottleFn(fn, ms = 200, trailing = false, leading = true, rejectOnCancel = false) {
	return createFilterWrapper(throttleFilter(ms, trailing, leading, rejectOnCancel), fn);
}
function watchWithFilter(source, cb, options = {}) {
	const { eventFilter = bypassFilter, ...watchOptions } = options;
	return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
function watchPausable(source, cb, options = {}) {
	const { eventFilter: filter, initialState = "active", ...watchOptions } = options;
	const { eventFilter, pause, resume, isActive } = pausableFilter(filter, { initialState });
	return {
		stop: watchWithFilter(source, cb, {
			...watchOptions,
			eventFilter
		}),
		pause,
		resume,
		isActive
	};
}
/**
* Call onMounted() if it's inside a component lifecycle, if not, just call the function
*
* @param fn
* @param sync if set to false, it will run in the nextTick() of Vue
* @param target
*/
function tryOnMounted(fn, sync = true, target) {
	if (getLifeCycleTarget(target)) onMounted(fn, target);
	else if (sync) fn();
	else nextTick(fn);
}
/**
* Call onUnmounted() if it's inside a component lifecycle, if not, do nothing
*
* @param fn
* @param target
*/
function tryOnUnmounted(fn, target) {
	if (getLifeCycleTarget(target)) onUnmounted(fn, target);
}
function watchDebounced(source, cb, options = {}) {
	const { debounce = 0, maxWait = void 0, ...watchOptions } = options;
	return watchWithFilter(source, cb, {
		...watchOptions,
		eventFilter: debounceFilter(debounce, { maxWait })
	});
}
/**
* Shorthand for watching value with {immediate: true}
*
* @see https://vueuse.org/watchImmediate
*/
function watchImmediate(source, cb, options) {
	return watch(source, cb, {
		...options,
		immediate: true
	});
}
function whenever(source, cb, options) {
	const stop = watch(source, (v, ov, onInvalidate) => {
		if (v) {
			if (options === null || options === void 0 ? void 0 : options.once) nextTick(() => stop());
			cb(v, ov, onInvalidate);
		}
	}, {
		...options,
		once: false
	});
	return stop;
}
//#endregion
//#region ../../node_modules/.pnpm/@vueuse+core@14.4.0_vue@3.5.43_@typescript+typescript6@6.0.2_/node_modules/@vueuse/core/dist/index.js
function computedAsync(evaluationCallback, initialState, optionsOrRef) {
	var _globalThis$reportErr;
	let options;
	if (isRef(optionsOrRef)) options = { evaluating: optionsOrRef };
	else options = optionsOrRef || {};
	const { lazy = false, flush = "sync", evaluating = void 0, shallow = true, onError = (_globalThis$reportErr = globalThis.reportError) !== null && _globalThis$reportErr !== void 0 ? _globalThis$reportErr : noop } = options;
	const started = shallowRef(!lazy);
	const current = shallow ? shallowRef(initialState) : ref(initialState);
	let counter = 0;
	watchEffect(async (onInvalidate) => {
		if (!started.value) return;
		counter++;
		const counterAtBeginning = counter;
		let hasFinished = false;
		if (evaluating) Promise.resolve().then(() => {
			evaluating.value = true;
		});
		try {
			const result = await evaluationCallback((cancelCallback) => {
				onInvalidate(() => {
					if (evaluating) evaluating.value = false;
					if (!hasFinished) cancelCallback();
				});
			});
			if (counterAtBeginning === counter) current.value = result;
		} catch (e) {
			onError(e);
		} finally {
			if (evaluating && counterAtBeginning === counter) evaluating.value = false;
			hasFinished = true;
		}
	}, { flush });
	if (lazy) return computed(() => {
		started.value = true;
		return current.value;
	});
	else return current;
}
var defaultWindow = isClient ? window : void 0;
isClient && window.document;
isClient && window.navigator;
isClient && window.location;
/**
* Get the dom element of a ref of element or Vue component instance
*
* @param elRef
*/
function unrefElement(elRef) {
	var _$el;
	const plain = toValue(elRef);
	return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
function useEventListener(...args) {
	const register = (el, event, listener, options) => {
		el.addEventListener(event, listener, options);
		return () => el.removeEventListener(event, listener, options);
	};
	const firstParamTargets = computed(() => {
		const test = toArray(toValue(args[0])).filter((e) => e != null);
		return test.every((e) => typeof e !== "string") ? test : void 0;
	});
	return watchImmediate(() => {
		var _firstParamTargets$va, _firstParamTargets$va2;
		return [
			(_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
			toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
			toArray(unref(firstParamTargets.value ? args[2] : args[1])),
			toValue(firstParamTargets.value ? args[3] : args[2])
		];
	}, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
		if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
		const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
		const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
		onCleanup(() => {
			cleanups.forEach((fn) => fn());
		});
	}, { flush: "post" });
}
/**
* Mounted state in ref.
*
* @see https://vueuse.org/useMounted
*
* @__NO_SIDE_EFFECTS__
*/
function useMounted() {
	const isMounted = shallowRef(false);
	const instance = getCurrentInstance();
	if (instance) onMounted(() => {
		isMounted.value = true;
	}, instance);
	return isMounted;
}
/* @__NO_SIDE_EFFECTS__ */
function useSupported(callback) {
	const isMounted = useMounted();
	return computed(() => {
		isMounted.value;
		return Boolean(callback());
	});
}
/**
* Watch for changes being made to the DOM tree.
*
* @see https://vueuse.org/useMutationObserver
* @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
* @param target
* @param callback
* @param options
*/
function useMutationObserver(target, callback, options = {}) {
	const { window = defaultWindow, ...mutationOptions } = options;
	let observer;
	const isSupported = /* @__PURE__ */ useSupported(() => window && "MutationObserver" in window);
	const cleanup = () => {
		if (observer) {
			observer.disconnect();
			observer = void 0;
		}
	};
	const stopWatch = watch(computed(() => {
		const items = toArray(toValue(target)).map(unrefElement).filter(notNullish);
		return new Set(items);
	}), (newTargets) => {
		cleanup();
		if (isSupported.value && newTargets.size) {
			observer = new MutationObserver(callback);
			newTargets.forEach((el) => observer.observe(el, mutationOptions));
		}
	}, {
		immediate: true,
		flush: "post"
	});
	const takeRecords = () => {
		return observer === null || observer === void 0 ? void 0 : observer.takeRecords();
	};
	const stop = () => {
		stopWatch();
		cleanup();
	};
	tryOnScopeDispose(stop);
	return {
		isSupported,
		stop,
		takeRecords
	};
}
function createKeyPredicate(keyFilter) {
	if (typeof keyFilter === "function") return keyFilter;
	else if (typeof keyFilter === "string") return (event) => event.key === keyFilter;
	else if (Array.isArray(keyFilter)) return (event) => keyFilter.includes(event.key);
	return () => true;
}
function onKeyStroke(...args) {
	let key;
	let handler;
	let options = {};
	if (args.length === 3) {
		key = args[0];
		handler = args[1];
		options = args[2];
	} else if (args.length === 2) if (typeof args[1] === "object") {
		key = true;
		handler = args[0];
		options = args[1];
	} else {
		key = args[0];
		handler = args[1];
	}
	else {
		key = true;
		handler = args[0];
	}
	const { target = defaultWindow, eventName = "keydown", passive = false, dedupe = false } = options;
	const predicate = createKeyPredicate(key);
	const listener = (e) => {
		if (e.repeat && toValue(dedupe)) return;
		if (predicate(e)) handler(e);
	};
	return useEventListener(target, eventName, listener, passive);
}
var ssrWidthSymbol = Symbol("vueuse-ssr-width");
/* @__NO_SIDE_EFFECTS__ */
function useSSRWidth() {
	const ssrWidth = hasInjectionContext() ? injectLocal(ssrWidthSymbol, null) : null;
	return typeof ssrWidth === "number" ? ssrWidth : void 0;
}
/**
* Reactive Media Query.
*
* @see https://vueuse.org/useMediaQuery
* @param query
* @param options
*/
function useMediaQuery(query, options = {}) {
	const { window = defaultWindow, ssrWidth = /* @__PURE__ */ useSSRWidth() } = options;
	const isSupported = /* @__PURE__ */ useSupported(() => window && "matchMedia" in window && typeof window.matchMedia === "function");
	const ssrSupport = shallowRef(typeof ssrWidth === "number");
	const mediaQuery = shallowRef();
	const matches = shallowRef(false);
	const handler = (event) => {
		matches.value = event.matches;
	};
	watchEffect(() => {
		if (ssrSupport.value) {
			ssrSupport.value = !isSupported.value;
			const queryStrings = toValue(query).split(",");
			matches.value = queryStrings.some((queryString) => {
				const not = queryString.includes("not all");
				const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
				const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
				let res = Boolean(minWidth || maxWidth);
				if (minWidth && res) res = ssrWidth >= pxValue(minWidth[1]);
				if (maxWidth && res) res = ssrWidth <= pxValue(maxWidth[1]);
				return not ? !res : res;
			});
			return;
		}
		if (!isSupported.value) return;
		mediaQuery.value = window.matchMedia(toValue(query));
		matches.value = mediaQuery.value.matches;
	});
	useEventListener(mediaQuery, "change", handler, { passive: true });
	return computed(() => matches.value);
}
var _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var globalKey = "__vueuse_ssr_handlers__";
var handlers = /* #__PURE__ */ getHandlers();
function getHandlers() {
	if (!(globalKey in _global)) _global[globalKey] = _global[globalKey] || {};
	return _global[globalKey];
}
function getSSRHandler(key, fallback) {
	return handlers[key] || fallback;
}
/**
* Reactive dark theme preference.
*
* @see https://vueuse.org/usePreferredDark
* @param [options]
*
* @__NO_SIDE_EFFECTS__
*/
function usePreferredDark(options) {
	return useMediaQuery("(prefers-color-scheme: dark)", options);
}
function guessSerializerType(rawInit) {
	return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
var StorageSerializers = {
	boolean: {
		read: (v) => v === "true",
		write: (v) => String(v)
	},
	object: {
		read: (v) => JSON.parse(v),
		write: (v) => JSON.stringify(v)
	},
	number: {
		read: (v) => Number.parseFloat(v),
		write: (v) => String(v)
	},
	any: {
		read: (v) => v,
		write: (v) => String(v)
	},
	string: {
		read: (v) => v,
		write: (v) => String(v)
	},
	map: {
		read: (v) => new Map(JSON.parse(v)),
		write: (v) => JSON.stringify(Array.from(v.entries()))
	},
	set: {
		read: (v) => new Set(JSON.parse(v)),
		write: (v) => JSON.stringify(Array.from(v))
	},
	date: {
		read: (v) => new Date(v),
		write: (v) => v.toISOString()
	}
};
var customStorageEventName = "vueuse-storage";
/**
* Reactive LocalStorage/SessionStorage.
*
* @see https://vueuse.org/useStorage
*/
function useStorage(key, defaults, storage, options = {}) {
	var _options$serializer;
	const { flush = "pre", deep = true, listenToStorageChanges = true, writeDefaults = true, mergeDefaults = false, shallow, window = defaultWindow, eventFilter, onError = (e) => {
		console.error(e);
	}, initOnMounted } = options;
	const data = (shallow ? shallowRef : ref)(typeof defaults === "function" ? defaults() : defaults);
	const keyComputed = computed(() => toValue(key));
	if (!storage) try {
		storage = getSSRHandler("getDefaultStorage", () => defaultWindow === null || defaultWindow === void 0 ? void 0 : defaultWindow.localStorage)();
	} catch (e) {
		onError(e);
	}
	if (!storage) return data;
	const rawInit = toValue(defaults);
	const type = guessSerializerType(rawInit);
	const serializer = (_options$serializer = options.serializer) !== null && _options$serializer !== void 0 ? _options$serializer : StorageSerializers[type];
	const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, (newValue) => write(newValue), {
		flush,
		deep,
		eventFilter
	});
	watch(keyComputed, () => update(), { flush });
	let firstMounted = false;
	const onStorageEvent = (ev) => {
		if (initOnMounted && !firstMounted) return;
		update(ev);
	};
	const onStorageCustomEvent = (ev) => {
		if (initOnMounted && !firstMounted) return;
		updateFromCustomEvent(ev);
	};
	/**
	* The custom event is needed for same-document syncing when using custom
	* storage backends, but it doesn't work across different documents.
	*
	* TODO: Consider implementing a BroadcastChannel-based solution that fixes this.
	*/
	if (window && listenToStorageChanges) if (storage instanceof Storage) useEventListener(window, "storage", onStorageEvent, { passive: true });
	else useEventListener(window, customStorageEventName, onStorageCustomEvent);
	if (initOnMounted) tryOnMounted(() => {
		firstMounted = true;
		update();
	});
	else update();
	function dispatchWriteEvent(oldValue, newValue) {
		if (window) {
			const payload = {
				key: keyComputed.value,
				oldValue,
				newValue,
				storageArea: storage
			};
			window.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, { detail: payload }));
		}
	}
	function write(v) {
		try {
			const oldValue = storage.getItem(keyComputed.value);
			if (v == null) {
				dispatchWriteEvent(oldValue, null);
				storage.removeItem(keyComputed.value);
			} else {
				const serialized = serializer.write(v);
				if (oldValue !== serialized) {
					storage.setItem(keyComputed.value, serialized);
					dispatchWriteEvent(oldValue, serialized);
				}
			}
		} catch (e) {
			onError(e);
		}
	}
	function read(event) {
		const rawValue = event ? event.newValue : storage.getItem(keyComputed.value);
		if (rawValue == null) {
			if (writeDefaults && rawInit != null) storage.setItem(keyComputed.value, serializer.write(rawInit));
			return rawInit;
		} else if (!event && mergeDefaults) {
			const value = serializer.read(rawValue);
			if (typeof mergeDefaults === "function") return mergeDefaults(value, rawInit);
			else if (type === "object" && !Array.isArray(value)) return {
				...rawInit,
				...value
			};
			return value;
		} else if (typeof rawValue !== "string") return rawValue;
		else return serializer.read(rawValue);
	}
	function update(event) {
		if (event && event.storageArea !== storage) return;
		if (event && event.key == null) {
			data.value = rawInit;
			return;
		}
		if (event && event.key !== keyComputed.value) return;
		pauseWatch();
		try {
			const serializedData = serializer.write(data.value);
			if (event === void 0 || (event === null || event === void 0 ? void 0 : event.newValue) !== serializedData) data.value = read(event);
		} catch (e) {
			onError(e);
		} finally {
			if (event) nextTick(resumeWatch);
			else resumeWatch();
		}
	}
	function updateFromCustomEvent(event) {
		update(event.detail);
	}
	return data;
}
var CSS_DISABLE_TRANS = "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}";
/**
* Reactive color mode with auto data persistence.
*
* @see https://vueuse.org/useColorMode
* @param options
*/
function useColorMode(options = {}) {
	const { selector = "html", attribute = "class", initialValue = "auto", window = defaultWindow, storage, storageKey = "vueuse-color-scheme", listenToStorageChanges = true, storageRef, emitAuto, disableTransition = true } = options;
	const modes = {
		auto: "",
		light: "light",
		dark: "dark",
		...options.modes || {}
	};
	const preferredDark = usePreferredDark({ window });
	const system = computed(() => preferredDark.value ? "dark" : "light");
	const store = storageRef || (storageKey == null ? toRef$1(initialValue) : useStorage(storageKey, initialValue, storage, {
		window,
		listenToStorageChanges
	}));
	const state = computed(() => store.value === "auto" ? system.value : store.value);
	const updateHTMLAttrs = getSSRHandler("updateHTMLAttrs", (selector, attribute, value) => {
		const el = typeof selector === "string" ? window === null || window === void 0 ? void 0 : window.document.querySelector(selector) : unrefElement(selector);
		if (!el) return;
		const classesToAdd = /* @__PURE__ */ new Set();
		const classesToRemove = /* @__PURE__ */ new Set();
		let attributeToChange = null;
		if (attribute === "class") {
			const current = value.split(/\s/g);
			Object.values(modes).flatMap((i) => (i || "").split(/\s/g)).filter(Boolean).forEach((v) => {
				if (current.includes(v)) classesToAdd.add(v);
				else classesToRemove.add(v);
			});
		} else attributeToChange = {
			key: attribute,
			value
		};
		if (classesToAdd.size === 0 && classesToRemove.size === 0 && attributeToChange === null) return;
		let style;
		if (disableTransition) {
			style = window.document.createElement("style");
			style.appendChild(document.createTextNode(CSS_DISABLE_TRANS));
			window.document.head.appendChild(style);
		}
		for (const c of classesToAdd) el.classList.add(c);
		for (const c of classesToRemove) el.classList.remove(c);
		if (attributeToChange) el.setAttribute(attributeToChange.key, attributeToChange.value);
		if (disableTransition) {
			window.getComputedStyle(style).opacity;
			document.head.removeChild(style);
		}
	});
	function defaultOnChanged(mode) {
		var _modes$mode;
		updateHTMLAttrs(selector, attribute, (_modes$mode = modes[mode]) !== null && _modes$mode !== void 0 ? _modes$mode : mode);
	}
	function onChanged(mode) {
		if (options.onChanged) options.onChanged(mode, defaultOnChanged);
		else defaultOnChanged(mode);
	}
	watch(state, onChanged, {
		flush: "post",
		immediate: true
	});
	tryOnMounted(() => onChanged(state.value));
	const auto = computed({
		get() {
			return emitAuto ? store.value : state.value;
		},
		set(v) {
			store.value = v;
		}
	});
	return Object.assign(auto, {
		store,
		system,
		state
	});
}
/**
* Reactive dark mode with auto data persistence.
*
* @see https://vueuse.org/useDark
* @param options
*/
function useDark(options = {}) {
	const { valueDark = "dark", valueLight = "" } = options;
	const mode = useColorMode({
		...options,
		onChanged: (mode, defaultHandler) => {
			var _options$onChanged;
			if (options.onChanged) (_options$onChanged = options.onChanged) === null || _options$onChanged === void 0 || _options$onChanged.call(options, mode === "dark", defaultHandler, mode);
			else defaultHandler(mode);
		},
		modes: {
			dark: valueDark,
			light: valueLight
		}
	});
	const system = computed(() => mode.system.value);
	return computed({
		get() {
			return mode.value === "dark";
		},
		set(v) {
			const modeVal = v ? "dark" : "light";
			if (system.value === modeVal) mode.value = "auto";
			else mode.value = modeVal;
		}
	});
}
/**
* We have to check if the scroll amount is close enough to some threshold in order to
* more accurately calculate arrivedState. This is because scrollTop/scrollLeft are non-rounded
* numbers, while scrollHeight/scrollWidth and clientHeight/clientWidth are rounded.
* https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
*/
var ARRIVED_STATE_THRESHOLD_PIXELS = 1;
/**
* Reactive scroll.
*
* @see https://vueuse.org/useScroll
* @param element
* @param options
*/
function useScroll(element, options = {}) {
	const { throttle = 0, idle = 200, onStop = noop, onScroll = noop, offset = {
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	}, observe: _observe = { mutation: false }, eventListenerOptions = {
		capture: false,
		passive: true
	}, behavior = "auto", window = defaultWindow, onError = (e) => {
		console.error(e);
	} } = options;
	const observe = typeof _observe === "boolean" ? { mutation: _observe } : _observe;
	const internalX = shallowRef(0);
	const internalY = shallowRef(0);
	const x = computed({
		get() {
			return internalX.value;
		},
		set(x) {
			scrollTo(x, void 0);
		}
	});
	const y = computed({
		get() {
			return internalY.value;
		},
		set(y) {
			scrollTo(void 0, y);
		}
	});
	function scrollTo(_x, _y) {
		var _ref, _toValue, _toValue2, _document;
		if (!window) return;
		const _element = toValue(element);
		if (!_element) return;
		(_ref = _element instanceof Document ? window.document.body : _element) === null || _ref === void 0 || _ref.scrollTo({
			top: (_toValue = toValue(_y)) !== null && _toValue !== void 0 ? _toValue : y.value,
			left: (_toValue2 = toValue(_x)) !== null && _toValue2 !== void 0 ? _toValue2 : x.value,
			behavior: toValue(behavior)
		});
		const scrollContainer = (_element === null || _element === void 0 || (_document = _element.document) === null || _document === void 0 ? void 0 : _document.documentElement) || (_element === null || _element === void 0 ? void 0 : _element.documentElement) || _element;
		if (x != null) internalX.value = scrollContainer.scrollLeft;
		if (y != null) internalY.value = scrollContainer.scrollTop;
	}
	const isScrolling = shallowRef(false);
	const arrivedState = reactive({
		left: true,
		right: false,
		top: true,
		bottom: false
	});
	const directions = reactive({
		left: false,
		right: false,
		top: false,
		bottom: false
	});
	const onScrollEnd = (e) => {
		if (!isScrolling.value) return;
		isScrolling.value = false;
		directions.left = false;
		directions.right = false;
		directions.top = false;
		directions.bottom = false;
		onStop(e);
	};
	const onScrollEndDebounced = useDebounceFn(onScrollEnd, throttle + idle);
	const setArrivedState = (target) => {
		var _document2;
		if (!window) return;
		const el = (target === null || target === void 0 || (_document2 = target.document) === null || _document2 === void 0 ? void 0 : _document2.documentElement) || (target === null || target === void 0 ? void 0 : target.documentElement) || unrefElement(target);
		const { display, flexDirection, direction } = window.getComputedStyle(el);
		const directionMultipler = direction === "rtl" ? -1 : 1;
		const scrollLeft = el.scrollLeft;
		directions.left = scrollLeft < internalX.value;
		directions.right = scrollLeft > internalX.value;
		const left = Math.abs(scrollLeft * directionMultipler) <= (offset.left || 0);
		const right = Math.abs(scrollLeft * directionMultipler) + el.clientWidth >= el.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
		if (display === "flex" && flexDirection === "row-reverse") {
			arrivedState.left = right;
			arrivedState.right = left;
		} else {
			arrivedState.left = left;
			arrivedState.right = right;
		}
		internalX.value = scrollLeft;
		let scrollTop = el.scrollTop;
		if (target === window.document && !scrollTop) scrollTop = window.document.body.scrollTop;
		directions.top = scrollTop < internalY.value;
		directions.bottom = scrollTop > internalY.value;
		const top = Math.abs(scrollTop) <= (offset.top || 0);
		const bottom = Math.abs(scrollTop) + el.clientHeight >= el.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
		/**
		* reverse columns and rows behave exactly the other way around,
		* bottom is treated as top and top is treated as the negative version of bottom
		*/
		if (display === "flex" && flexDirection === "column-reverse") {
			arrivedState.top = bottom;
			arrivedState.bottom = top;
		} else {
			arrivedState.top = top;
			arrivedState.bottom = bottom;
		}
		internalY.value = scrollTop;
	};
	const onScrollHandler = (e) => {
		var _documentElement;
		if (!window) return;
		const eventTarget = (_documentElement = e.target.documentElement) !== null && _documentElement !== void 0 ? _documentElement : e.target;
		setArrivedState(eventTarget);
		isScrolling.value = true;
		onScrollEndDebounced(e);
		onScroll(e);
	};
	useEventListener(element, "scroll", throttle ? useThrottleFn(onScrollHandler, throttle, true, false) : onScrollHandler, eventListenerOptions);
	tryOnMounted(() => {
		try {
			const _element = toValue(element);
			if (!_element) return;
			setArrivedState(_element);
		} catch (e) {
			onError(e);
		}
	});
	if ((observe === null || observe === void 0 ? void 0 : observe.mutation) && element != null && element !== window && element !== document) useMutationObserver(element, () => {
		const _element = toValue(element);
		if (!_element) return;
		setArrivedState(_element);
	}, {
		attributes: true,
		childList: true,
		subtree: true
	});
	useEventListener(element, "scrollend", onScrollEnd, eventListenerOptions);
	return {
		x,
		y,
		isScrolling,
		arrivedState,
		directions,
		measure() {
			const _element = toValue(element);
			if (window && _element) setArrivedState(_element);
		}
	};
}
/**
* Reactive LocalStorage.
*
* @see https://vueuse.org/useLocalStorage
* @param key
* @param initialValue
* @param options
*/
function useLocalStorage(key, initialValue, options = {}) {
	const { window = defaultWindow } = options;
	return useStorage(key, initialValue, window === null || window === void 0 ? void 0 : window.localStorage, options);
}
/**
*
* Reactive useNavigatorLanguage
*
* Detects the currently selected user language and returns a reactive language
* @see https://vueuse.org/useNavigatorLanguage
*
* @__NO_SIDE_EFFECTS__
*/
function useNavigatorLanguage(options = {}) {
	const { window = defaultWindow } = options;
	const navigator = window === null || window === void 0 ? void 0 : window.navigator;
	const isSupported = /* @__PURE__ */ useSupported(() => navigator && "language" in navigator);
	const language = shallowRef(navigator === null || navigator === void 0 ? void 0 : navigator.language);
	useEventListener(window, "languagechange", () => {
		if (navigator) language.value = navigator.language;
	}, { passive: true });
	return {
		isSupported,
		language
	};
}
/**
* Reactive SessionStorage.
*
* @see https://vueuse.org/useSessionStorage
* @param key
* @param initialValue
* @param options
*/
function useSessionStorage(key, initialValue, options = {}) {
	const { window = defaultWindow } = options;
	return useStorage(key, initialValue, window === null || window === void 0 ? void 0 : window.sessionStorage, options);
}
/**
* Reactive window scroll.
*
* @see https://vueuse.org/useWindowScroll
* @param options
*/
function useWindowScroll(options = {}) {
	const { window = defaultWindow, ...rest } = options;
	return useScroll(window, rest);
}
//#endregion
//#region ../../../@siteData
var _siteData_default = JSON.parse("{\"lang\":\"en-US\",\"dir\":\"ltr\",\"title\":\"astryx-vue\",\"description\":\"面向 Vue 3 的 Astryx 设计系统社区实现。\",\"base\":\"/\",\"head\":[],\"router\":{\"prefetchLinks\":true},\"appearance\":\"dark\",\"themeConfig\":{\"logo\":\"/icon-logo.svg\",\"search\":{\"provider\":\"local\"}},\"locales\":{\"root\":{\"label\":\"简体中文\",\"lang\":\"zh-CN\",\"themeConfig\":{\"nav\":[{\"text\":\"文档\",\"link\":\"/guide/getting-started\"},{\"text\":\"组件\",\"link\":\"/components/\"},{\"text\":\"演练场\",\"link\":\"/playground/\"},{\"text\":\"主题\",\"link\":\"/themes/\"}]}},\"en\":{\"label\":\"English\",\"lang\":\"en\",\"description\":\"A community Vue 3 implementation of the Astryx design system.\",\"themeConfig\":{\"nav\":[{\"text\":\"Docs\",\"link\":\"/en/guide/getting-started\"},{\"text\":\"Components\",\"link\":\"/en/components/\"},{\"text\":\"Playground\",\"link\":\"/en/playground/\"},{\"text\":\"Themes\",\"link\":\"/en/themes/\"}]}}},\"cleanUrls\":true,\"additionalConfig\":{}}");
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/data.js
var dataSymbol = Symbol();
var siteDataRef = shallowRef(readonly(_siteData_default));
function initData(route) {
	const site = computed(() => resolveSiteDataByRoute(siteDataRef.value, route.data.relativePath, route.data.filePath));
	const appearance = site.value.appearance;
	const isDark = appearance === "force-dark" ? ref(true) : appearance === "force-auto" ? usePreferredDark() : appearance ? useDark({
		storageKey: APPEARANCE_KEY,
		initialValue: () => appearance === "dark" ? "dark" : "auto",
		...typeof appearance === "object" ? appearance : {}
	}) : ref(false);
	return {
		site,
		theme: computed(() => site.value.themeConfig),
		page: computed(() => route.data),
		frontmatter: computed(() => route.data.frontmatter),
		params: computed(() => route.data.params),
		lang: computed(() => site.value.lang),
		dir: computed(() => route.data.frontmatter.dir || site.value.dir),
		localeIndex: computed(() => site.value.localeIndex || "root"),
		title: computed(() => createTitle(site.value, route.data)),
		description: computed(() => route.data.description || site.value.description),
		isDark
	};
}
function useData$1() {
	const data = inject(dataSymbol);
	if (!data) throw new Error("vitepress data not properly injected in app");
	return data;
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/utils.js
var resolvedBase;
/**
* Runtime base path used by the app.
*
* Usually this is the configured site base.
*
* For a relative base (`'./'`), the mount point is unknown at build time, so:
* - SSR: uses `RELATIVE_BASE_SENTINEL` (for per-page URL relativization)
* - dev browser: uses `'/'` (dev server always mounts at root)
* - prod browser: resolves from the page's `__VP_SITE_ROOT__`
*/
function runtimeBase() {
	if (resolvedBase === void 0) {
		const base = siteDataRef.value.base;
		if (!isRelativeBase(base)) return resolvedBase = base;
		if (!inBrowser) return resolvedBase = RELATIVE_BASE_SENTINEL;
		const root = window.__VP_SITE_ROOT__;
		resolvedBase = root ? decodeURIComponent(new URL(root, location.href).pathname) : "/";
	}
	return resolvedBase;
}
/**
* Prepend base to internal (non-relative) urls
*/
function withBase(path) {
	return EXTERNAL_URL_RE.test(path) || !path.startsWith("/") ? path : joinPath(runtimeBase(), path);
}
/**
* Converts a url path to the corresponding js chunk filename.
*/
function pathToFile(path) {
	let pagePath = path.replace(/\.html$/, "");
	pagePath = decodeURIComponent(pagePath);
	pagePath = pagePath.replace(/\/$/, "/index");
	if (inBrowser) {
		const base = runtimeBase();
		if (pagePath + "/" === base) pagePath = base;
		if (!pagePath.startsWith(base)) return null;
		pagePath = sanitizeFileName(pagePath.slice(base.length).replace(/\//g, "_") || "index") + ".md";
		let pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
		if (!pageHash) {
			pagePath = pagePath.endsWith("_index.md") ? pagePath.slice(0, -9) + ".md" : pagePath.slice(0, -3) + "_index.md";
			pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
		}
		if (!pageHash) return null;
		pagePath = `${base}assets/${pagePath}.${pageHash}.js`;
	} else pagePath = `./${sanitizeFileName(pagePath.slice(1).replace(/\//g, "_"))}.md.js`;
	return pagePath;
}
var contentUpdatedCallbacks = [];
/**
* Register callback that is called every time the markdown content is updated
* in the DOM.
*/
function onContentUpdated(fn) {
	contentUpdatedCallbacks.push(fn);
	tryOnUnmounted(() => {
		contentUpdatedCallbacks = contentUpdatedCallbacks.filter((f) => f !== fn);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/composables/icon.js
/**
* Resolves an icon name (`collection:name`, e.g. `simple-icons:github`) to
* its `vpi-<collection>-<name>` class. During SSR the name is registered so
* the build emits its CSS rule; in dev the SVG is served on demand and
* applied to `el` inline.
*/
function useIcon(icon, el) {
	const parsed = computed(() => {
		const value = toValue(icon);
		return typeof value === "string" ? parseIconName(value) : null;
	});
	const iconClass = computed(() => parsed.value ? `vpi-${parsed.value.collection}-${parsed.value.icon}` : void 0);
	{
		const ctx = useSSRContext();
		const value = toValue(icon);
		if (typeof value === "string") ctx?.vpIcons.add(value);
	}
	return iconClass;
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/router.js
var RouterSymbol = Symbol();
var fakeHost = "http://a.com";
var getDefaultRoute = () => ({
	path: "/",
	hash: "",
	query: "",
	component: null,
	data: notFoundPageData
});
function createRouter(loadPageModule, fallbackComponent) {
	const route = reactive(getDefaultRoute());
	const router = {
		route,
		async go(href, options) {
			const { hash } = new URL(href, fakeHost);
			const hasTextFragment = inBrowser && document.fragmentDirective && hash.includes(":~:");
			href = normalizeHref(href);
			if (await router.onBeforeRouteChange?.(href) === false) return;
			if (!inBrowser || await changeRoute(href, {
				...options,
				hasTextFragment
			})) await loadPage(href, { initialLoad: !!options?.initialLoad });
			if (hasTextFragment) location.hash = hash;
			syncRouteQueryAndHash();
			await router.onAfterRouteChange?.(href);
		}
	};
	let latestPendingPath = null;
	async function loadPage(href, { scrollPosition = 0, isRetry = false, initialLoad = false } = {}) {
		if (await router.onBeforePageLoad?.(href) === false) return;
		const targetLoc = new URL(href, fakeHost);
		const pendingPath = latestPendingPath = targetLoc.pathname;
		try {
			let page = await loadPageModule(pendingPath);
			if (!page) throw new Error(`Page not found: ${pendingPath}`);
			if (latestPendingPath === pendingPath) {
				latestPendingPath = null;
				const { default: comp, __pageData } = page;
				if (!comp) throw new Error(`Invalid route component: ${comp}`);
				await router.onAfterPageLoad?.(href);
				route.path = inBrowser ? pendingPath : withBase(pendingPath);
				route.component = markRaw(comp);
				route.data = markRaw(__pageData);
				syncRouteQueryAndHash(targetLoc);
				if (inBrowser) nextTick(() => {
					let actualPathname = runtimeBase() + __pageData.relativePath.replace(/(?:(^|\/)index)?\.md$/, "$1");
					if (!siteDataRef.value.cleanUrls && !actualPathname.endsWith("/")) actualPathname += ".html";
					if (actualPathname !== targetLoc.pathname) {
						targetLoc.pathname = actualPathname;
						href = actualPathname + targetLoc.search + targetLoc.hash;
						history.replaceState({}, "", href);
					}
					if (!initialLoad) scrollTo(targetLoc.hash, scrollPosition);
				});
			}
		} catch (err) {
			if (!/fetch|Page not found/.test(err.message) && !/^\/404(\.html|\/)?$/.test(href)) console.error(err);
			if (!isRetry) try {
				const res = await fetch(runtimeBase() + "hashmap.json");
				window.__VP_HASH_MAP__ = await res.json();
				await loadPage(href, {
					scrollPosition,
					isRetry: true,
					initialLoad
				});
				return;
			} catch (e) {}
			if (latestPendingPath === pendingPath) {
				latestPendingPath = null;
				route.path = inBrowser ? pendingPath : withBase(pendingPath);
				route.component = fallbackComponent ? markRaw(fallbackComponent) : null;
				const relativePath = inBrowser ? route.path.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md").slice(runtimeBase().length) : "404.md";
				route.data = {
					...notFoundPageData,
					relativePath
				};
				syncRouteQueryAndHash(targetLoc);
			}
		}
	}
	function syncRouteQueryAndHash(loc = inBrowser ? location : {
		search: "",
		hash: ""
	}) {
		route.query = loc.search;
		route.hash = decodeURIComponent(loc.hash);
	}
	if (inBrowser) {
		if (history.state === null) history.replaceState({}, "");
		window.addEventListener("click", (e) => {
			if (e.defaultPrevented || !(e.target instanceof Element) || e.target.closest("button") || e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
			const link = e.target.closest("a");
			if (!link || link.closest(".vp-raw") || link.hasAttribute("download") || link.hasAttribute("target")) return;
			const linkHref = link.getAttribute("href") ?? (link instanceof SVGAElement ? link.getAttribute("xlink:href") : null);
			if (linkHref == null) return;
			const { href, origin, pathname } = new URL(linkHref, link.baseURI);
			if (origin === new URL(location.href).origin && treatAsHtml(pathname)) {
				e.preventDefault();
				router.go(href);
			}
		}, { capture: true });
		window.addEventListener("popstate", async (e) => {
			if (e.state === null) return;
			const href = normalizeHref(location.href);
			await loadPage(href, { scrollPosition: e.state.scrollPosition || 0 });
			syncRouteQueryAndHash();
			await router.onAfterRouteChange?.(href);
		});
		window.addEventListener("hashchange", (e) => {
			e.preventDefault();
			syncRouteQueryAndHash();
		});
	}
	return router;
}
function useRouter() {
	const router = inject(RouterSymbol);
	if (!router) throw new Error("useRouter() is called without provider.");
	return router;
}
function useRoute() {
	return useRouter().route;
}
function scrollTo(hash, scrollPosition = 0) {
	if (!hash || scrollPosition) {
		window.scrollTo(0, scrollPosition);
		return;
	}
	let target = null;
	try {
		target = document.getElementById(decodeURIComponent(hash).slice(1));
	} catch (e) {
		console.warn(e);
	}
	if (!target) return;
	const scrollToTarget = () => {
		target.scrollIntoView({ block: "start" });
		target.focus({ preventScroll: true });
		if (document.activeElement === target) return;
		if (target.hasAttribute("tabindex")) return;
		const restoreTabindex = () => {
			target.removeAttribute("tabindex");
			target.removeEventListener("blur", restoreTabindex);
		};
		target.setAttribute("tabindex", "-1");
		target.addEventListener("blur", restoreTabindex);
		target.focus({ preventScroll: true });
		if (document.activeElement !== target) restoreTabindex();
	};
	requestAnimationFrame(scrollToTarget);
}
function normalizeHref(href) {
	const url = new URL(href, fakeHost);
	url.pathname = url.pathname.replace(/(^|\/)index(\.html)?$/, "$1");
	if (siteDataRef.value.cleanUrls) url.pathname = url.pathname.replace(/\.html$/, "");
	else if (!url.pathname.endsWith("/") && !url.pathname.endsWith(".html")) url.pathname += ".html";
	return url.pathname + url.search + url.hash.split(":~:")[0];
}
async function changeRoute(href, { initialLoad = false, replace = false, hasTextFragment = false } = {}) {
	const loc = normalizeHref(location.href);
	const nextUrl = new URL(href, location.origin);
	const currentUrl = new URL(loc, location.origin);
	if (href === loc) {
		if (!initialLoad) {
			if (!hasTextFragment) scrollTo(nextUrl.hash);
			return false;
		}
	} else {
		if (replace) history.replaceState({}, "", href);
		else {
			history.replaceState({ scrollPosition: window.scrollY }, "");
			history.pushState({}, "", href);
		}
		if (nextUrl.pathname === currentUrl.pathname) {
			if (nextUrl.hash !== currentUrl.hash) {
				window.dispatchEvent(new HashChangeEvent("hashchange", {
					oldURL: currentUrl.href,
					newURL: nextUrl.href
				}));
				if (!hasTextFragment) scrollTo(nextUrl.hash);
			}
			return false;
		}
	}
	return true;
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/components/Content.js
var runCbs = () => contentUpdatedCallbacks.forEach((fn) => fn());
var Content = defineComponent({
	name: "VitePressContent",
	props: { as: {
		type: [Object, String],
		default: "div"
	} },
	setup(props) {
		const { frontmatter, site } = useData$1();
		const route = useRoute();
		watch(frontmatter, runCbs, {
			deep: true,
			flush: "post"
		});
		return () => h(props.as, site.value.contentProps ?? { style: { position: "relative" } }, [route.component ? h(route.component, {
			onVnodeMounted: runCbs,
			onVnodeUpdated: runCbs,
			onVnodeUnmounted: runCbs
		}) : "404 Page Not Found"]);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/composables/codeGroups.js
function useCodeGroups() {
	if (inBrowser) window.addEventListener("click", (e) => {
		const el = e.target;
		if (el.matches(".vp-code-group input")) {
			const group = el.parentElement?.parentElement;
			if (!group) return;
			const i = Array.from(group.querySelectorAll("input")).indexOf(el);
			if (i < 0) return;
			const blocks = group.querySelector(".blocks");
			if (!blocks) return;
			const current = Array.from(blocks.children).find((child) => child.classList.contains("active"));
			if (!current) return;
			const next = blocks.children[i];
			if (!next || current === next) return;
			current.classList.remove("active");
			activate(next);
			(group?.querySelector(`label[for="${el.id}"]`))?.scrollIntoView({ block: "nearest" });
		}
	});
}
function activate(el) {
	el.classList.add("active");
	window.dispatchEvent(new CustomEvent("vitepress:codeGroupTabActivate", { detail: el }));
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/composables/copyCode.js
var ignoredNodes = [".vp-copy-ignore", ".diff.remove"].join(", ");
function useCopyCode() {
	if (inBrowser) {
		const timeoutIdMap = /* @__PURE__ */ new WeakMap();
		window.addEventListener("click", (e) => {
			const el = e.target;
			if (el.matches("div[class*=\"language-\"] > button.copy")) {
				const parent = el.parentElement;
				const sibling = el.nextElementSibling?.nextElementSibling;
				if (!parent || !sibling) return;
				const clone = sibling.cloneNode(true);
				clone.querySelectorAll(ignoredNodes).forEach((node) => node.remove());
				clone.innerHTML = clone.innerHTML.replace(/\n+/g, "\n");
				let text = clone.textContent || "";
				if (isShell(/language-(\w+)/.exec(parent.className)?.[1] || "")) text = text.replace(/^ *(\$|>) /gm, "").trim();
				copyToClipboard(text).then(() => {
					el.classList.add("copied");
					clearTimeout(timeoutIdMap.get(el));
					const timeoutId = window.setTimeout(() => {
						el.classList.remove("copied");
						el.blur();
						timeoutIdMap.delete(el);
					}, 2e3);
					timeoutIdMap.set(el, timeoutId);
				});
			}
		});
	}
}
async function copyToClipboard(text) {
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		const element = document.createElement("textarea");
		const previouslyFocusedElement = document.activeElement;
		element.value = text;
		element.setAttribute("readonly", "");
		element.style.contain = "strict";
		element.style.position = "absolute";
		element.style.left = "-9999px";
		element.style.fontSize = "12pt";
		const selection = document.getSelection();
		const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null;
		document.body.appendChild(element);
		element.select();
		element.selectionStart = 0;
		element.selectionEnd = text.length;
		document.execCommand("copy");
		document.body.removeChild(element);
		if (originalRange) {
			selection.removeAllRanges();
			selection.addRange(originalRange);
		}
		if (previouslyFocusedElement) previouslyFocusedElement.focus();
	}
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/composables/head.js
function useUpdateHead(route, siteDataByRouteRef) {
	let isFirstUpdate = true;
	let managedHeadElements = [];
	const updateHeadTags = (newTags) => {
		if (isFirstUpdate) {
			isFirstUpdate = false;
			newTags.forEach((tag) => {
				const headEl = createHeadElement(tag);
				for (const el of document.head.children) if (el.isEqualNode(headEl)) {
					managedHeadElements.push(el);
					return;
				}
			});
			return;
		}
		const newElements = newTags.map(createHeadElement);
		managedHeadElements.forEach((oldEl, oldIndex) => {
			const matchedIndex = newElements.findIndex((newEl) => newEl?.isEqualNode(oldEl ?? null));
			if (matchedIndex !== -1) delete newElements[matchedIndex];
			else {
				oldEl?.remove();
				delete managedHeadElements[oldIndex];
			}
		});
		newElements.forEach((el) => el && document.head.appendChild(el));
		managedHeadElements = [...managedHeadElements, ...newElements].filter(Boolean);
	};
	watchEffect(() => {
		const pageData = route.data;
		const siteData = siteDataByRouteRef.value;
		const pageDescription = pageData && pageData.description;
		const frontmatterHead = pageData && pageData.frontmatter.head || [];
		const title = createTitle(siteData, pageData);
		if (title !== document.title) document.title = title;
		const description = pageDescription || siteData.description;
		let metaDescriptionElement = document.querySelector(`meta[name=description]`);
		if (metaDescriptionElement) {
			if (metaDescriptionElement.getAttribute("content") !== description) metaDescriptionElement.setAttribute("content", description);
		} else createHeadElement(["meta", {
			name: "description",
			content: description
		}]);
		updateHeadTags(mergeHead(siteData.head, filterOutHeadDescription(frontmatterHead)));
	});
}
function createHeadElement([tag, attrs, innerHTML]) {
	const el = document.createElement(tag);
	for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
	if (innerHTML) el.innerHTML = innerHTML;
	if (tag === "script" && attrs.async == null) el.async = false;
	return el;
}
function isMetaDescription(headConfig) {
	return headConfig[0] === "meta" && headConfig[1] && headConfig[1].name === "description";
}
function filterOutHeadDescription(head) {
	return head.filter((h) => !isMetaDescription(h));
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/composables/preFetch.js
var hasFetched = /* @__PURE__ */ new Set();
var createLink = () => document.createElement("link");
var viaDOM = (url) => {
	const link = createLink();
	link.rel = `prefetch`;
	if (EXTERNAL_URL_RE.test(url)) link.crossOrigin = "";
	link.href = url;
	document.head.appendChild(link);
};
var viaXHR = (url) => {
	const req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.withCredentials = !EXTERNAL_URL_RE.test(url);
	req.send();
};
var link;
var doFetch = inBrowser && (link = createLink()) && link.relList && link.relList.supports && link.relList.supports("prefetch") ? viaDOM : viaXHR;
function usePrefetch() {
	if (!inBrowser) return;
	if (!window.IntersectionObserver) return;
	let conn;
	if ((conn = navigator.connection) && (conn.saveData || /2g/.test(conn.effectiveType))) return;
	const rIC = window.requestIdleCallback || setTimeout;
	let observer = null;
	const observeLinks = () => {
		if (observer) observer.disconnect();
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const link = entry.target;
					observer.unobserve(link);
					const { pathname } = link;
					if (!hasFetched.has(pathname)) {
						hasFetched.add(pathname);
						const pageChunkPath = pathToFile(pathname);
						if (pageChunkPath) doFetch(pageChunkPath);
					}
				}
			});
		});
		rIC(() => {
			document.querySelectorAll("#app a").forEach((link) => {
				const { hostname, pathname } = new URL(link.href instanceof SVGAnimatedString ? link.href.animVal : link.href, link.baseURI);
				const extMatch = pathname.match(/\.\w+$/);
				if (extMatch && extMatch[0] !== ".html") return;
				if (link.target !== "_blank" && hostname === location.hostname) {
					if (pathname !== location.pathname) observer.observe(link);
					else hasFetched.add(pathname);
				}
			});
		});
	};
	onMounted(observeLinks);
	const route = useRoute();
	watch(() => route.path, observeLinks);
	onUnmounted(() => {
		observer && observer.disconnect();
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/data.js
var useData = useData$1;
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/support/utils.js
function throttleAndDebounce(fn, delay) {
	let timeoutId;
	let called = false;
	return () => {
		if (timeoutId) clearTimeout(timeoutId);
		if (!called) {
			fn();
			(called = true) && window.setTimeout(() => called = false, delay);
		} else timeoutId = window.setTimeout(fn, delay);
	};
}
function ensureStartingSlash(path) {
	return path.startsWith("/") ? path : `/${path}`;
}
function isLinkExternal(href, target, external) {
	if (external !== void 0) return external;
	return !!href && isExternal(href) || target === "_blank";
}
function normalizeLink$1(url) {
	const { pathname, search, hash, protocol } = new URL(url, "http://a.com");
	if (isExternal(url) || url.startsWith("#") || !protocol.startsWith("http") || !treatAsHtml(pathname)) return url;
	const { site } = useData();
	let normalizedPath = pathname.endsWith("/") || pathname.endsWith(".html") ? url : url.replace(/(?:(^\.+)\/)?.*$/, `$1${pathname.replace(/(\.md)?$/, site.value.cleanUrls ? "" : ".html")}${search}${hash}`);
	if (isRelativeBase(site.value.base) && !site.value.cleanUrls) {
		const pathPart = normalizedPath.replace(/[?#].*$/, "");
		if (pathPart.endsWith("/")) normalizedPath = pathPart + "index.html" + normalizedPath.slice(pathPart.length);
	}
	return withBase(normalizedPath);
}
function uniqBy(array, keyFn) {
	const seen = /* @__PURE__ */ new Set();
	return array.filter((item) => {
		const k = keyFn(item);
		return seen.has(k) ? false : seen.add(k);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/support/sidebar.js
/**
* Get the `Sidebar` from sidebar option. This method will ensure to get correct
* sidebar config from `MultiSideBarConfig` with various path combinations such
* as matching `guide/` and `/guide/`. If no matching config was found, it will
* return empty array.
*/
function getSidebar(_sidebar, path) {
	if (Array.isArray(_sidebar)) return addBase(_sidebar);
	if (_sidebar == null) return [];
	path = ensureStartingSlash(path);
	const dir = Object.keys(_sidebar).sort((a, b) => {
		return b.split("/").length - a.split("/").length;
	}).find((dir) => {
		return path.startsWith(ensureStartingSlash(dir));
	});
	const sidebar = dir ? _sidebar[dir] ?? [] : [];
	return Array.isArray(sidebar) ? addBase(sidebar) : addBase(sidebar.items, sidebar.base);
}
/**
* Get or generate sidebar group from the given sidebar items.
*/
function getSidebarGroups(sidebar) {
	const groups = [];
	let lastGroupIndex = 0;
	for (const item of sidebar) {
		if (item.items) {
			lastGroupIndex = groups.push(item);
			continue;
		}
		let group = groups[lastGroupIndex];
		if (!group) {
			group = { items: [] };
			groups.push(group);
		}
		group.items?.push(item);
	}
	return groups;
}
function getFlatSideBarLinks(sidebar) {
	const links = [];
	function recursivelyExtractLinks(items) {
		for (const item of items) {
			if (item.text && item.link) links.push({
				text: item.text,
				link: item.link,
				docFooterText: item.docFooterText,
				rel: item.rel,
				target: item.target
			});
			if (item.items) recursivelyExtractLinks(item.items);
		}
	}
	recursivelyExtractLinks(sidebar);
	return links;
}
/**
* Check if the given sidebar item contains any active link.
*/
function hasActiveLink(path, hash, items, skipHashCheck = false) {
	if (Array.isArray(items)) return items.some((item) => hasActiveLink(path, hash, item, skipHashCheck));
	if (items.link && isActive(path, hash, items.link, false, skipHashCheck)) return true;
	if (items.items) return hasActiveLink(path, hash, items.items, skipHashCheck);
	return false;
}
function addBase(items, _base) {
	return [...items].map((_item) => {
		const item = { ..._item };
		const base = item.base || _base;
		if (base && item.link && !isExternal(item.link)) item.link = base + item.link.replace(/^\//, base.endsWith("/") ? "" : "/");
		if (item.items) item.items = addBase(item.items, base);
		return item;
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/outline.js
var ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/;
var resolvedHeaders = [];
function resolveTitle(theme) {
	return typeof theme.outline === "object" && !Array.isArray(theme.outline) && theme.outline.label || "On this page";
}
function getHeaders(range) {
	return resolveHeaders([...document.querySelectorAll(".VPDoc h1, .VPDoc h2, .VPDoc h3, .VPDoc h4, .VPDoc h5, .VPDoc h6")].filter((el) => el.id && el.hasChildNodes()).map((el) => {
		const level = Number(el.tagName[1]);
		return {
			element: el,
			title: serializeHeader(el),
			link: "#" + el.id,
			level
		};
	}), range);
}
function serializeHeader(h) {
	let ret = "";
	for (const node of h.childNodes) if (node.nodeType === 1) {
		if (ignoreRE.test(node.className)) continue;
		ret += node.textContent;
	} else if (node.nodeType === 3) ret += node.textContent;
	return ret.trim();
}
function resolveHeaders(headers, range) {
	if (range === false) return [];
	const levelsRange = (typeof range === "object" && !Array.isArray(range) ? range.level : range) || 2;
	const [high, low] = typeof levelsRange === "number" ? [levelsRange, levelsRange] : levelsRange === "deep" ? [2, 6] : levelsRange;
	return buildTree(headers, high, low);
}
function useActiveAnchor(container, marker) {
	const isAsideVisible = useMediaQuery("(min-width: 80rem)");
	const onScroll = throttleAndDebounce(setActiveLink, 100);
	let prevActiveLink = null;
	let ignoreScrollOnce = false;
	onMounted(() => {
		requestAnimationFrame(setActiveLink);
		window.addEventListener("scroll", onScroll);
		container.value?.addEventListener("click", onClick);
	});
	onUpdated(() => {
		activateLink(location.hash);
	});
	onUnmounted(() => {
		window.removeEventListener("scroll", onScroll);
	});
	function onClick(e) {
		if (!isAsideVisible.value) return;
		const hash = e.target instanceof Element ? e.target.closest("a")?.hash : null;
		if (hash) {
			ignoreScrollOnce = true;
			activateLink(hash);
		}
	}
	function setActiveLink() {
		if (!isAsideVisible.value) return;
		if (ignoreScrollOnce) {
			ignoreScrollOnce = false;
			return;
		}
		const scrollY = window.scrollY;
		const innerHeight = window.innerHeight;
		const offsetHeight = document.body.offsetHeight;
		const isBottom = scrollY + innerHeight - offsetHeight >= 0;
		const headers = resolvedHeaders.map(({ element, link }) => ({
			link,
			top: getAbsoluteTop(element),
			scrollMarginTop: Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0
		})).filter(({ top }) => !Number.isNaN(top)).sort((a, b) => a.top - b.top);
		if (!headers.length) {
			activateLink(null);
			return;
		}
		if (scrollY < 1) {
			activateLink(null);
			return;
		}
		if (isBottom) {
			activateLink(headers.at(-1)?.link ?? null);
			return;
		}
		let activeLink = null;
		for (const { link, top, scrollMarginTop } of headers) {
			if (top > scrollY + scrollMarginTop + 4) break;
			activeLink = link;
		}
		activateLink(activeLink);
	}
	function activateLink(hash) {
		const activeLink = hash != null ? container.value?.querySelector(`a[href$="${decodeURIComponent(hash)}"]`) ?? null : null;
		if (activeLink === prevActiveLink) return;
		prevActiveLink?.classList.remove("active");
		prevActiveLink = activeLink;
		if (activeLink) {
			activeLink.classList.add("active");
			if (marker.value) {
				marker.value.style.top = activeLink.offsetTop + (activeLink.offsetParent?.offsetTop ?? 0) + (activeLink.offsetHeight - marker.value.offsetHeight) / 2 + "px";
				marker.value.style.opacity = "1";
			}
			activeLink.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			});
		} else if (marker.value) {
			marker.value.style.top = "";
			marker.value.style.opacity = "0";
		}
	}
}
function getAbsoluteTop(element) {
	let offsetTop = 0;
	while (element !== document.body) {
		if (element === null) return NaN;
		offsetTop += element.offsetTop;
		element = element.offsetParent;
	}
	return offsetTop;
}
function buildTree(data, min, max) {
	resolvedHeaders.length = 0;
	const result = [];
	const stack = [];
	data.forEach((item) => {
		const node = {
			...item,
			children: []
		};
		let parent = stack[stack.length - 1];
		while (parent && parent.level >= node.level) {
			stack.pop();
			parent = stack[stack.length - 1];
		}
		if (node.element.classList.contains("ignore-header") || parent && "shouldIgnore" in parent) {
			stack.push({
				level: node.level,
				shouldIgnore: true
			});
			return;
		}
		if (node.level > max || node.level < min) return;
		resolvedHeaders.push({
			element: node.element,
			link: node.link
		});
		if (parent) parent.children.push(node);
		else result.push(node);
		stack.push(node);
	});
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/sidebar.js
var isOpen = ref(false);
/**
* a11y: cache the element that opened the Sidebar (the menu button) then
* focus that button again when Menu is closed with Escape key.
*/
function useCloseSidebarOnEscape(close) {
	let triggerElement;
	watchEffect(() => {
		triggerElement = isOpen.value ? document.activeElement : void 0;
	});
	onMounted(() => {
		window.addEventListener("keyup", onEscape);
	});
	onUnmounted(() => {
		window.removeEventListener("keyup", onEscape);
	});
	function onEscape(e) {
		if (e.key === "Escape" && isOpen.value) {
			close();
			triggerElement?.focus();
		}
	}
}
function useSidebarControl() {
	function open() {
		isOpen.value = true;
	}
	function close() {
		isOpen.value = false;
	}
	function toggle() {
		isOpen.value ? close() : open();
	}
	return {
		isOpen,
		open,
		close,
		toggle
	};
}
function useSidebarItemControl(item) {
	const route = useRoute();
	const collapsed = ref(false);
	const collapsible = computed(() => {
		return item.value.collapsed != null;
	});
	const isLink = computed(() => {
		return !!item.value.link;
	});
	const isActiveLink = ref(false);
	const hasActiveLink$1 = ref(false);
	function updateActiveLink(skipHashCheck = false) {
		if (item.value.link) isActiveLink.value = isActive(route.data.relativePath, route.hash, item.value.link, false, skipHashCheck);
		else isActiveLink.value = false;
		if (isActiveLink.value) {
			hasActiveLink$1.value = true;
			nextTick(() => collapsed.value = false);
			return;
		}
		if (!item.value.items) {
			hasActiveLink$1.value = false;
			return;
		}
		hasActiveLink$1.value = hasActiveLink(route.data.relativePath, route.hash, item.value.items, skipHashCheck);
		if (hasActiveLink$1.value) nextTick(() => collapsed.value = false);
	}
	updateActiveLink(true);
	watch([item, route], () => updateActiveLink());
	onMounted(() => updateActiveLink());
	const isCurrentLink = computed(() => {
		return item.value.link ? isActive(route.data.relativePath, route.hash, item.value.link) : false;
	});
	const hasChildren = computed(() => {
		return !!(item.value.items && item.value.items.length);
	});
	watchEffect(() => {
		collapsed.value = !!(collapsible.value && item.value.collapsed);
	});
	function toggle() {
		if (collapsible.value) collapsed.value = !collapsed.value;
	}
	return {
		collapsed,
		collapsible,
		isLink,
		isActiveLink,
		isCurrentLink,
		hasActiveLink: hasActiveLink$1,
		hasChildren,
		toggle
	};
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/layout.js
var headers = shallowRef([]);
var sidebar = shallowRef([]);
var isDesktop = useMediaQuery("(min-width: 60rem)");
function useLayout() {
	const { frontmatter, theme } = useData();
	const isHome = computed(() => {
		return !!(frontmatter.value.isHome ?? frontmatter.value.layout === "home");
	});
	const hasSidebar = computed(() => {
		return frontmatter.value.sidebar !== false && sidebar.value.length > 0 && !isHome.value;
	});
	const isSidebarEnabled = computed(() => hasSidebar.value && isDesktop.value);
	const sidebarGroups = computed(() => {
		return hasSidebar.value ? getSidebarGroups(sidebar.value) : [];
	});
	const hasAside = computed(() => {
		if (isHome.value) return false;
		if (frontmatter.value.aside != null) return !!frontmatter.value.aside;
		return theme.value.aside !== false;
	});
	const leftAside = computed(() => {
		if (!hasAside.value) return false;
		return frontmatter.value.aside == null ? theme.value.aside === "left" : frontmatter.value.aside === "left";
	});
	const hasLocalNav = computed(() => {
		return headers.value.length > 0;
	});
	return {
		isHome,
		sidebar: shallowReadonly(sidebar),
		sidebarGroups,
		hasSidebar,
		isSidebarEnabled,
		hasAside,
		leftAside,
		headers: shallowReadonly(headers),
		hasLocalNav
	};
}
function registerWatchers({ closeSidebar }) {
	const { theme, page, frontmatter } = useData();
	watch(() => [page.value.relativePath, theme.value.sidebar], ([relativePath, sidebarConfig]) => {
		const newSidebar = sidebarConfig ? getSidebar(sidebarConfig, relativePath) : [];
		if (JSON.stringify(newSidebar) !== JSON.stringify(sidebar.value)) sidebar.value = newSidebar;
	}, {
		immediate: true,
		deep: true,
		flush: "sync"
	});
	onContentUpdated(() => {
		headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline);
	});
	const route = useRoute();
	watch(() => route.path, closeSidebar);
	watch(isDesktop, closeSidebar);
	useCloseSidebarOnEscape(closeSidebar);
}
var layoutInfoInjectionKey = Symbol("layout-info");
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue
var _sfc_main$62 = {
	__name: "VPBadge",
	__ssrInlineRender: true,
	props: {
		text: {
			type: String,
			required: false
		},
		type: {
			type: String,
			required: false,
			default: "tip"
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({ class: ["VPBadge", __props.type] }, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, () => {
				_push(`${ssrInterpolate(__props.text)}`);
			}, _push, _parent);
			_push(`</span>`);
		};
	}
};
var _sfc_setup$68 = _sfc_main$62.setup;
_sfc_main$62.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue");
	return _sfc_setup$68 ? _sfc_setup$68(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPBackdrop.vue
var _sfc_main$61 = {
	__name: "VPBackdrop",
	__ssrInlineRender: true,
	props: { show: {
		type: Boolean,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.show) _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPBackdrop" }, _attrs))} data-v-aeadf8b6></div>`);
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$67 = _sfc_main$61.setup;
_sfc_main$61.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPBackdrop.vue");
	return _sfc_setup$67 ? _sfc_setup$67(props, ctx) : void 0;
};
var VPBackdrop_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$61, [["__scopeId", "data-v-aeadf8b6"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/langs.js
function useLangs({ linkToCorrespondingPage = false } = {}) {
	const data = useData();
	const route = useRoute();
	const { site, localeIndex } = data;
	const currentLang = computed(() => ({
		label: site.value.locales[localeIndex.value]?.label,
		link: site.value.locales[localeIndex.value]?.link || (localeIndex.value === "root" ? "/" : `/${localeIndex.value}/`)
	}));
	return {
		currentLang,
		localeLinks: computed(() => Object.entries(site.value.locales).flatMap(([key, value]) => currentLang.value.label === value.label ? [] : {
			text: value.label,
			link: resolveLocaleLink(data, route, {
				targetLocale: key,
				targetLocaleLink: value.link || (key === "root" ? "/" : `/${key}/`),
				currentLocaleLink: currentLang.value.link,
				linkToCorrespondingPage
			}),
			lang: value.lang,
			dir: value.dir
		}))
	};
}
/**
* Resolves the link used for switching from the current page to
* `targetLocale`. Without `linkToCorrespondingPage`, this is simply the home
* of the target locale. With it, the current page's path is rewritten into
* the target locale (honoring `cleanUrls`) — unless
* `themeConfig.i18nRouting` is `false` (the locale home is used instead) or
* a function (which then fully controls the resolution).
*
* The current query and hash are carried over, except when a custom
* `i18nRouting` function is used.
*/
function resolveLocaleLink(data, route, { targetLocale, targetLocaleLink, currentLocaleLink, linkToCorrespondingPage }) {
	const { site, theme } = data;
	const i18nRouting = theme.value.i18nRouting;
	if (linkToCorrespondingPage && typeof i18nRouting === "function") return i18nRouting(data, route, targetLocale);
	return normalizeLink(targetLocaleLink, i18nRouting !== false && linkToCorrespondingPage, route.data.relativePath.slice(currentLocaleLink.length - 1), !site.value.cleanUrls) + route.query + route.hash;
}
function normalizeLink(localeLink, appendPagePath, pagePath, addHtmlExt) {
	return appendPagePath ? localeLink.replace(/\/$/, "") + ensureStartingSlash(pagePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, addHtmlExt ? ".html" : "")) : localeLink;
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/NotFound.vue
var _sfc_main$60 = {
	__name: "NotFound",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme } = useData();
		const { currentLang } = useLangs();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "NotFound" }, _attrs))} data-v-ef24a294><p class="code" data-v-ef24a294>${ssrInterpolate(unref(theme).notFound?.code ?? "404")}</p><h1 class="title" data-v-ef24a294>${ssrInterpolate(unref(theme).notFound?.title ?? "PAGE NOT FOUND")}</h1><div class="divider" data-v-ef24a294></div><blockquote class="quote" data-v-ef24a294>${ssrInterpolate(unref(theme).notFound?.quote ?? "But if you don't change your direction, and if you keep looking, you may end up where you are heading.")}</blockquote><div class="action" data-v-ef24a294><a class="link"${ssrRenderAttr("href", unref(withBase)(unref(theme).notFound?.link ?? unref(currentLang).link))}${ssrRenderAttr("aria-label", unref(theme).notFound?.linkLabel ?? "go to home")} data-v-ef24a294>${ssrInterpolate(unref(theme).notFound?.linkText ?? "Take me home")}</a></div></div>`);
		};
	}
};
var _sfc_setup$66 = _sfc_main$60.setup;
_sfc_main$60.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/NotFound.vue");
	return _sfc_setup$66 ? _sfc_setup$66(props, ctx) : void 0;
};
var NotFound_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$60, [["__scopeId", "data-v-ef24a294"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocAsideCarbonAds.vue
var _sfc_main$59 = {
	__name: "VPDocAsideCarbonAds",
	__ssrInlineRender: true,
	props: { carbonAds: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const VPCarbonAds = () => null;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAsideCarbonAds" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(VPCarbonAds), { "carbon-ads": __props.carbonAds }, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$65 = _sfc_main$59.setup;
_sfc_main$59.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocAsideCarbonAds.vue");
	return _sfc_setup$65 ? _sfc_setup$65(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocOutlineItem.vue
var _sfc_main$58 = {
	__name: "VPDocOutlineItem",
	__ssrInlineRender: true,
	props: {
		headers: {
			type: Array,
			required: true
		},
		root: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_VPDocOutlineItem = resolveComponent("VPDocOutlineItem", true);
			_push(`<ul${ssrRenderAttrs(mergeProps({ class: ["VPDocOutlineItem", __props.root ? "root" : "nested"] }, _attrs))} data-v-f2c5a71d><!--[-->`);
			ssrRenderList(__props.headers, ({ children, link, title }) => {
				_push(`<li data-v-f2c5a71d><a class="outline-link"${ssrRenderAttr("href", link)}${ssrRenderAttr("title", title)} data-v-f2c5a71d>${ssrInterpolate(title)}</a>`);
				if (children?.length) _push(ssrRenderComponent(_component_VPDocOutlineItem, { headers: children }, null, _parent));
				else _push(`<!---->`);
				_push(`</li>`);
			});
			_push(`<!--]--></ul>`);
		};
	}
};
var _sfc_setup$64 = _sfc_main$58.setup;
_sfc_main$58.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocOutlineItem.vue");
	return _sfc_setup$64 ? _sfc_setup$64(props, ctx) : void 0;
};
var VPDocOutlineItem_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$58, [["__scopeId", "data-v-f2c5a71d"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue
var _sfc_main$57 = {
	__name: "VPDocAsideOutline",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme } = useData();
		const container = useTemplateRef("container");
		const marker = useTemplateRef("marker");
		const { headers, hasLocalNav } = useLayout();
		useActiveAnchor(container, marker);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<nav${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "doc-outline-aria-label",
				class: ["VPDocAsideOutline", { "has-outline": unref(hasLocalNav) }],
				ref_key: "container",
				ref: container
			}, _attrs))} data-v-945dd48e><div class="content" data-v-945dd48e><div class="outline-marker" data-v-945dd48e></div><div aria-level="2" class="outline-title" id="doc-outline-aria-label" role="heading" data-v-945dd48e>${ssrInterpolate(unref(resolveTitle)(unref(theme)))}</div>`);
			_push(ssrRenderComponent(VPDocOutlineItem_default, {
				headers: unref(headers),
				root: true
			}, null, _parent));
			_push(`</div></nav>`);
		};
	}
};
var _sfc_setup$63 = _sfc_main$57.setup;
_sfc_main$57.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue");
	return _sfc_setup$63 ? _sfc_setup$63(props, ctx) : void 0;
};
var VPDocAsideOutline_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$57, [["__scopeId", "data-v-945dd48e"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocAside.vue
var _sfc_main$56 = {
	__name: "VPDocAside",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme } = useData();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAside" }, _attrs))} data-v-8b635d36>`);
			ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent);
			_push(ssrRenderComponent(VPDocAsideOutline_default, null, null, _parent));
			ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent);
			_push(`<div class="spacer" data-v-8b635d36></div>`);
			ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent);
			if (unref(theme).carbonAds) _push(ssrRenderComponent(_sfc_main$59, { "carbon-ads": unref(theme).carbonAds }, null, _parent));
			else _push(`<!---->`);
			ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$62 = _sfc_main$56.setup;
_sfc_main$56.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocAside.vue");
	return _sfc_setup$62 ? _sfc_setup$62(props, ctx) : void 0;
};
var VPDocAside_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$56, [["__scopeId", "data-v-8b635d36"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/edit-link.js
function useEditLink() {
	const { theme, page } = useData();
	return computed(() => {
		const { text = "Edit this page", pattern = "" } = theme.value.editLink || {};
		let url;
		if (typeof pattern === "function") url = pattern(page.value);
		else url = pattern.replace(/:path/g, page.value.filePath);
		return {
			url,
			text
		};
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/prev-next.js
function usePrevNext() {
	const { theme, page, frontmatter } = useData();
	return computed(() => {
		const candidates = uniqBy(getFlatSideBarLinks(getSidebar(theme.value.sidebar, page.value.relativePath)), (link) => normalize(link.link));
		const index = candidates.findIndex((link) => {
			return isActive(page.value.relativePath, "", link.link, false, true);
		});
		const hidePrev = theme.value.docFooter?.prev === false && !frontmatter.value.prev || frontmatter.value.prev === false;
		const hideNext = theme.value.docFooter?.next === false && !frontmatter.value.next || frontmatter.value.next === false;
		return {
			prev: hidePrev ? void 0 : {
				text: (typeof frontmatter.value.prev === "string" ? frontmatter.value.prev : typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.text : void 0) ?? candidates[index - 1]?.docFooterText ?? candidates[index - 1]?.text,
				link: (typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.link : void 0) ?? candidates[index - 1]?.link,
				target: (typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.target : void 0) ?? candidates[index - 1]?.target,
				rel: (typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.rel : void 0) ?? candidates[index - 1]?.rel
			},
			next: hideNext ? void 0 : {
				text: (typeof frontmatter.value.next === "string" ? frontmatter.value.next : typeof frontmatter.value.next === "object" ? frontmatter.value.next.text : void 0) ?? candidates[index + 1]?.docFooterText ?? candidates[index + 1]?.text,
				link: (typeof frontmatter.value.next === "object" ? frontmatter.value.next.link : void 0) ?? candidates[index + 1]?.link,
				target: (typeof frontmatter.value.next === "object" ? frontmatter.value.next.target : void 0) ?? candidates[index + 1]?.target,
				rel: (typeof frontmatter.value.next === "object" ? frontmatter.value.next.rel : void 0) ?? candidates[index + 1]?.rel
			}
		};
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue
var _sfc_main$55 = {
	__name: "VPDocFooterLastUpdated",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme, page, lang: pageLang } = useData();
		const { language: browserLang } = useNavigatorLanguage();
		const timeRef = useTemplateRef("timeRef");
		const date = computed(() => new Date(page.value.lastUpdated));
		const isoDatetime = computed(() => date.value.toISOString());
		const datetime = shallowRef("");
		onMounted(() => {
			watchEffect(() => {
				const lang = theme.value.lastUpdated?.formatOptions?.forceLocale ? pageLang.value : browserLang.value;
				datetime.value = new Intl.DateTimeFormat(lang, theme.value.lastUpdated?.formatOptions ?? {
					dateStyle: "medium",
					timeStyle: "medium"
				}).format(date.value);
				if (lang && pageLang.value !== lang) timeRef.value?.setAttribute("lang", lang);
				else timeRef.value?.removeAttribute("lang");
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<p${ssrRenderAttrs(mergeProps({ class: "VPLastUpdated" }, _attrs))} data-v-6e04499f>${ssrInterpolate(unref(theme).lastUpdated?.text || "Last updated")}: <time${ssrRenderAttr("datetime", isoDatetime.value)} data-v-6e04499f>${ssrInterpolate(datetime.value)}</time></p>`);
		};
	}
};
var _sfc_setup$61 = _sfc_main$55.setup;
_sfc_main$55.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue");
	return _sfc_setup$61 ? _sfc_setup$61(props, ctx) : void 0;
};
var VPDocFooterLastUpdated_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$55, [["__scopeId", "data-v-6e04499f"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPLink.vue
var _sfc_main$54 = {
	__name: "VPLink",
	__ssrInlineRender: true,
	props: {
		tag: {
			type: String,
			required: false
		},
		href: {
			type: String,
			required: false
		},
		noIcon: {
			type: Boolean,
			required: false
		},
		external: {
			type: Boolean,
			required: false,
			default: void 0
		},
		target: {
			type: String,
			required: false
		},
		rel: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const tag = computed(() => props.tag ?? (props.href ? "a" : "span"));
		const isExternal = computed(() => isLinkExternal(props.href, props.target, props.external));
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tag.value), mergeProps({
				class: ["VPLink", {
					link: __props.href,
					"vp-external-link-icon": isExternal.value,
					"no-icon": __props.noIcon
				}],
				href: __props.href ? unref(normalizeLink$1)(__props.href) : void 0,
				target: __props.target ?? (isExternal.value ? "_blank" : void 0),
				rel: __props.rel ?? (isExternal.value ? "noreferrer" : void 0)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}), _parent);
		};
	}
};
var _sfc_setup$60 = _sfc_main$54.setup;
_sfc_main$54.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPLink.vue");
	return _sfc_setup$60 ? _sfc_setup$60(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocFooter.vue
var _sfc_main$53 = {
	__name: "VPDocFooter",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme, page, frontmatter } = useData();
		const editLink = useEditLink();
		const control = usePrevNext();
		const hasEditLink = computed(() => theme.value.editLink && frontmatter.value.editLink !== false);
		const hasLastUpdated = computed(() => page.value.lastUpdated);
		const showFooter = computed(() => hasEditLink.value || hasLastUpdated.value || control.value.prev || control.value.next);
		return (_ctx, _push, _parent, _attrs) => {
			if (showFooter.value) {
				_push(`<footer${ssrRenderAttrs(mergeProps({ class: "VPDocFooter" }, _attrs))} data-v-395a5329>`);
				ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent);
				if (hasEditLink.value || hasLastUpdated.value) {
					_push(`<div class="edit-info" data-v-395a5329>`);
					if (hasEditLink.value) {
						_push(`<div class="edit-link" data-v-395a5329>`);
						_push(ssrRenderComponent(_sfc_main$54, {
							class: "edit-link-button",
							href: unref(editLink).url,
							"no-icon": true
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="vpi-square-pen edit-link-icon" data-v-395a5329${_scopeId}></span> ${ssrInterpolate(unref(editLink).text)}`);
								else return [createVNode("span", { class: "vpi-square-pen edit-link-icon" }), createTextVNode(" " + toDisplayString(unref(editLink).text), 1)];
							}),
							_: 1
						}, _parent));
						_push(`</div>`);
					} else _push(`<!---->`);
					if (hasLastUpdated.value) {
						_push(`<div class="last-updated" data-v-395a5329>`);
						_push(ssrRenderComponent(VPDocFooterLastUpdated_default, null, null, _parent));
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (unref(control).prev?.link || unref(control).next?.link) {
					_push(`<nav class="prev-next" aria-labelledby="doc-footer-aria-label" data-v-395a5329><span class="visually-hidden" id="doc-footer-aria-label" data-v-395a5329>Pager</span><div class="pager" data-v-395a5329>`);
					if (unref(control).prev?.link) _push(ssrRenderComponent(_sfc_main$54, {
						class: "pager-link prev",
						href: unref(control).prev.link,
						target: unref(control).prev.target,
						rel: unref(control).prev.rel
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<span class="desc" data-v-395a5329${_scopeId}>${(unref(theme).docFooter?.prev || "Previous page") ?? ""}</span><span class="title" data-v-395a5329${_scopeId}>${unref(control).prev.text ?? ""}</span>`);
							else return [createVNode("span", {
								class: "desc",
								innerHTML: unref(theme).docFooter?.prev || "Previous page"
							}, null, 8, ["innerHTML"]), createVNode("span", {
								class: "title",
								innerHTML: unref(control).prev.text
							}, null, 8, ["innerHTML"])];
						}),
						_: 1
					}, _parent));
					else _push(`<!---->`);
					_push(`</div><div class="pager" data-v-395a5329>`);
					if (unref(control).next?.link) _push(ssrRenderComponent(_sfc_main$54, {
						class: "pager-link next",
						href: unref(control).next.link,
						target: unref(control).next.target,
						rel: unref(control).next.rel
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<span class="desc" data-v-395a5329${_scopeId}>${(unref(theme).docFooter?.next || "Next page") ?? ""}</span><span class="title" data-v-395a5329${_scopeId}>${unref(control).next.text ?? ""}</span>`);
							else return [createVNode("span", {
								class: "desc",
								innerHTML: unref(theme).docFooter?.next || "Next page"
							}, null, 8, ["innerHTML"]), createVNode("span", {
								class: "title",
								innerHTML: unref(control).next.text
							}, null, 8, ["innerHTML"])];
						}),
						_: 1
					}, _parent));
					else _push(`<!---->`);
					_push(`</div></nav>`);
				} else _push(`<!---->`);
				_push(`</footer>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$59 = _sfc_main$53.setup;
_sfc_main$53.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocFooter.vue");
	return _sfc_setup$59 ? _sfc_setup$59(props, ctx) : void 0;
};
var VPDocFooter_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$53, [["__scopeId", "data-v-395a5329"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDoc.vue
var _sfc_main$52 = {
	__name: "VPDoc",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme, site } = useData();
		const route = useRoute();
		const { hasSidebar, hasAside, leftAside } = useLayout();
		const pageName = computed(() => {
			return (isRelativeBase(site.value.base) ? "/" + route.path.slice(runtimeBase().length) : route.path).replace(/[./]+/g, "_").replace(/_html$/, "");
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Content = resolveComponent("Content");
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPDoc", {
				"has-sidebar": unref(hasSidebar),
				"has-aside": unref(hasAside)
			}] }, _attrs))} data-v-3874eae8>`);
			ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push, _parent);
			_push(`<div class="container" data-v-3874eae8>`);
			if (unref(hasAside)) {
				_push(`<div class="${ssrRenderClass([{ "left-aside": unref(leftAside) }, "aside"])}" data-v-3874eae8><div class="aside-curtain" data-v-3874eae8></div><div class="aside-container" data-v-3874eae8><div class="aside-content" data-v-3874eae8>`);
				_push(ssrRenderComponent(VPDocAside_default, null, {
					"aside-top": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)];
					}),
					"aside-bottom": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)];
					}),
					"aside-outline-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)];
					}),
					"aside-outline-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)];
					}),
					"aside-ads-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)];
					}),
					"aside-ads-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(`</div></div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="content" data-v-3874eae8><div class="content-container" data-v-3874eae8>`);
			ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push, _parent);
			_push(`<main class="main" data-v-3874eae8>`);
			_push(ssrRenderComponent(_component_Content, { class: ["vp-doc", [pageName.value, unref(theme).externalLinkIcon && "external-link-icon-enabled"]] }, null, _parent));
			_push(`</main>`);
			_push(ssrRenderComponent(VPDocFooter_default, null, {
				"doc-footer-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push, _parent);
			_push(`</div></div></div>`);
			ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push, _parent);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$58 = _sfc_main$52.setup;
_sfc_main$52.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDoc.vue");
	return _sfc_setup$58 ? _sfc_setup$58(props, ctx) : void 0;
};
var VPDoc_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$52, [["__scopeId", "data-v-3874eae8"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHomeContent.vue
var _sfc_main$51 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPHomeContent vp-doc container" }, _attrs))} data-v-e14fdaa4>`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</div>`);
}
var _sfc_setup$57 = _sfc_main$51.setup;
_sfc_main$51.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHomeContent.vue");
	return _sfc_setup$57 ? _sfc_setup$57(props, ctx) : void 0;
};
var VPHomeContent_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$51, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-e14fdaa4"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPImage.vue
var _sfc_main$50 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "VPImage",
	__ssrInlineRender: true,
	props: {
		image: {
			type: [String, Object],
			required: true
		},
		alt: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_VPImage = resolveComponent("VPImage", true);
			if (__props.image) {
				_push(`<!--[-->`);
				if (typeof __props.image === "string" || "src" in __props.image) _push(`<img${ssrRenderAttrs(mergeProps({ class: "VPImage" }, typeof __props.image === "string" ? _ctx.$attrs : {
					...__props.image,
					..._ctx.$attrs
				}, {
					src: unref(withBase)(typeof __props.image === "string" ? __props.image : __props.image.src),
					alt: __props.alt ?? (typeof __props.image === "string" ? "" : __props.image.alt || "")
				}))} data-v-7d966839>`);
				else {
					_push(`<!--[-->`);
					_push(ssrRenderComponent(_component_VPImage, mergeProps({
						class: "dark",
						image: __props.image.dark,
						alt: __props.image.alt
					}, _ctx.$attrs), null, _parent));
					_push(ssrRenderComponent(_component_VPImage, mergeProps({
						class: "light",
						image: __props.image.light,
						alt: __props.image.alt
					}, _ctx.$attrs), null, _parent));
					_push(`<!--]-->`);
				}
				_push(`<!--]-->`);
			} else _push(`<!---->`);
		};
	}
});
var _sfc_setup$56 = _sfc_main$50.setup;
_sfc_main$50.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPImage.vue");
	return _sfc_setup$56 ? _sfc_setup$56(props, ctx) : void 0;
};
var VPImage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$50, [["__scopeId", "data-v-7d966839"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPFeature.vue
var _sfc_main$49 = {
	__name: "VPFeature",
	__ssrInlineRender: true,
	props: {
		icon: {
			type: [String, Object],
			required: false
		},
		title: {
			type: String,
			required: true
		},
		details: {
			type: String,
			required: false
		},
		link: {
			type: String,
			required: false
		},
		linkText: {
			type: String,
			required: false
		},
		rel: {
			type: String,
			required: false
		},
		target: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$54, mergeProps({
				class: "VPFeature",
				href: __props.link,
				rel: __props.rel,
				target: __props.target,
				"no-icon": true,
				tag: __props.link ? "a" : "div"
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<article class="box" data-v-6279023e${_scopeId}>`);
						if (typeof __props.icon === "object" && __props.icon.wrap) {
							_push(`<div class="icon" data-v-6279023e${_scopeId}>`);
							_push(ssrRenderComponent(VPImage_default, {
								image: __props.icon,
								alt: __props.icon.alt,
								height: __props.icon.height || 48,
								width: __props.icon.width || 48
							}, null, _parent, _scopeId));
							_push(`</div>`);
						} else if (typeof __props.icon === "object") _push(ssrRenderComponent(VPImage_default, {
							image: __props.icon,
							alt: __props.icon.alt,
							height: __props.icon.height || 48,
							width: __props.icon.width || 48
						}, null, _parent, _scopeId));
						else if (__props.icon) _push(`<div class="icon" data-v-6279023e${_scopeId}>${__props.icon ?? ""}</div>`);
						else _push(`<!---->`);
						_push(`<h2 class="title" data-v-6279023e${_scopeId}>${__props.title ?? ""}</h2>`);
						if (Array.isArray(__props.details)) {
							_push(`<ul class="details" data-v-6279023e${_scopeId}><!--[-->`);
							ssrRenderList(__props.details, (item) => {
								_push(`<li data-v-6279023e${_scopeId}>${item ?? ""}</li>`);
							});
							_push(`<!--]--></ul>`);
						} else if (__props.details) _push(`<p class="details" data-v-6279023e${_scopeId}>${__props.details ?? ""}</p>`);
						else _push(`<!---->`);
						if (__props.linkText) _push(`<div class="link-text" data-v-6279023e${_scopeId}><p class="link-text-value" data-v-6279023e${_scopeId}>${ssrInterpolate(__props.linkText)} <span class="vpi-arrow-right link-text-icon" data-v-6279023e${_scopeId}></span></p></div>`);
						else _push(`<!---->`);
						_push(`</article>`);
					} else return [createVNode("article", { class: "box" }, [
						typeof __props.icon === "object" && __props.icon.wrap ? (openBlock(), createBlock("div", {
							key: 0,
							class: "icon"
						}, [createVNode(VPImage_default, {
							image: __props.icon,
							alt: __props.icon.alt,
							height: __props.icon.height || 48,
							width: __props.icon.width || 48
						}, null, 8, [
							"image",
							"alt",
							"height",
							"width"
						])])) : typeof __props.icon === "object" ? (openBlock(), createBlock(VPImage_default, {
							key: 1,
							image: __props.icon,
							alt: __props.icon.alt,
							height: __props.icon.height || 48,
							width: __props.icon.width || 48
						}, null, 8, [
							"image",
							"alt",
							"height",
							"width"
						])) : __props.icon ? (openBlock(), createBlock("div", {
							key: 2,
							class: "icon",
							innerHTML: __props.icon
						}, null, 8, ["innerHTML"])) : createCommentVNode("", true),
						createVNode("h2", {
							class: "title",
							innerHTML: __props.title
						}, null, 8, ["innerHTML"]),
						Array.isArray(__props.details) ? (openBlock(), createBlock("ul", {
							key: 3,
							class: "details"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(__props.details, (item) => {
							return openBlock(), createBlock("li", {
								key: item,
								innerHTML: item
							}, null, 8, ["innerHTML"]);
						}), 128))])) : __props.details ? (openBlock(), createBlock("p", {
							key: 4,
							class: "details",
							innerHTML: __props.details
						}, null, 8, ["innerHTML"])) : createCommentVNode("", true),
						__props.linkText ? (openBlock(), createBlock("div", {
							key: 5,
							class: "link-text"
						}, [createVNode("p", { class: "link-text-value" }, [createTextVNode(toDisplayString(__props.linkText) + " ", 1), createVNode("span", { class: "vpi-arrow-right link-text-icon" })])])) : createCommentVNode("", true)
					])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$55 = _sfc_main$49.setup;
_sfc_main$49.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPFeature.vue");
	return _sfc_setup$55 ? _sfc_setup$55(props, ctx) : void 0;
};
var VPFeature_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$49, [["__scopeId", "data-v-6279023e"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPFeatures.vue
var _sfc_main$48 = {
	__name: "VPFeatures",
	__ssrInlineRender: true,
	props: { features: {
		type: Array,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const grid = computed(() => {
			const length = props.features.length;
			if (!length) return;
			else if (length === 2) return "grid-2";
			else if (length === 3) return "grid-3";
			else if (length % 3 === 0) return "grid-6";
			else if (length > 3) return "grid-4";
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.features) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPFeatures" }, _attrs))} data-v-d82d5b6c><div class="container" data-v-d82d5b6c><ul class="items" data-v-d82d5b6c><!--[-->`);
				ssrRenderList(__props.features, (feature) => {
					_push(`<li class="${ssrRenderClass([[grid.value], "item"])}" data-v-d82d5b6c>`);
					_push(ssrRenderComponent(VPFeature_default, {
						icon: feature.icon,
						title: feature.title,
						details: feature.details,
						link: feature.link,
						"link-text": feature.linkText,
						rel: feature.rel,
						target: feature.target
					}, null, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul></div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$54 = _sfc_main$48.setup;
_sfc_main$48.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPFeatures.vue");
	return _sfc_setup$54 ? _sfc_setup$54(props, ctx) : void 0;
};
var VPFeatures_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$48, [["__scopeId", "data-v-d82d5b6c"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue
var _sfc_main$47 = {
	__name: "VPHomeFeatures",
	__ssrInlineRender: true,
	setup(__props) {
		const { frontmatter: fm } = useData();
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(fm).features) _push(ssrRenderComponent(VPFeatures_default, mergeProps({
				class: "VPHomeFeatures",
				features: unref(fm).features
			}, _attrs), null, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$53 = _sfc_main$47.setup;
_sfc_main$47.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue");
	return _sfc_setup$53 ? _sfc_setup$53(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPButton.vue
var _sfc_main$46 = {
	__name: "VPButton",
	__ssrInlineRender: true,
	props: {
		tag: {
			type: String,
			required: false
		},
		size: {
			type: String,
			required: false,
			default: "medium"
		},
		theme: {
			type: String,
			required: false,
			default: "brand"
		},
		text: {
			type: String,
			required: false
		},
		href: {
			type: String,
			required: false
		},
		target: {
			type: String,
			required: false
		},
		rel: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const isExternal = computed(() => props.href && EXTERNAL_URL_RE.test(props.href));
		const component = computed(() => {
			return props.tag || (props.href ? "a" : "button");
		});
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(component.value), mergeProps({
				class: ["VPButton no-icon", [__props.size, __props.theme]],
				href: __props.href ? unref(normalizeLink$1)(__props.href) : void 0,
				target: props.target ?? (isExternal.value ? "_blank" : void 0),
				rel: props.rel ?? (isExternal.value ? "noreferrer" : void 0)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, () => {
						_push(`${ssrInterpolate(__props.text)}`);
					}, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(__props.text), 1)], true)];
				}),
				_: 3
			}), _parent);
		};
	}
};
var _sfc_setup$52 = _sfc_main$46.setup;
_sfc_main$46.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPButton.vue");
	return _sfc_setup$52 ? _sfc_setup$52(props, ctx) : void 0;
};
var VPButton_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$46, [["__scopeId", "data-v-831dbcc0"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHero.vue
var _sfc_main$45 = {
	__name: "VPHero",
	__ssrInlineRender: true,
	props: {
		name: {
			type: String,
			required: false
		},
		text: {
			type: String,
			required: false
		},
		tagline: {
			type: String,
			required: false
		},
		image: {
			type: [String, Object],
			required: false
		},
		actions: {
			type: Array,
			required: false
		}
	},
	setup(__props) {
		const { heroImageSlotExists } = inject(layoutInfoInjectionKey, { heroImageSlotExists: computed(() => false) });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPHero", { "has-image": __props.image || unref(heroImageSlotExists) }] }, _attrs))} data-v-14a30d33><div class="container" data-v-14a30d33><div class="main" data-v-14a30d33>`);
			ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, () => {
				_push(`<h1 class="heading" data-v-14a30d33>`);
				if (__props.name) _push(`<span class="name clip" data-v-14a30d33>${__props.name ?? ""}</span>`);
				else _push(`<!---->`);
				if (__props.text) _push(`<span class="text" data-v-14a30d33>${__props.text ?? ""}</span>`);
				else _push(`<!---->`);
				_push(`</h1>`);
				if (__props.tagline) _push(`<p class="tagline" data-v-14a30d33>${__props.tagline ?? ""}</p>`);
				else _push(`<!---->`);
			}, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent);
			if (__props.actions) {
				_push(`<div class="actions" data-v-14a30d33>`);
				ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent);
				_push(`<!--[-->`);
				ssrRenderList(__props.actions, (action) => {
					_push(`<div class="action" data-v-14a30d33>`);
					_push(ssrRenderComponent(VPButton_default, {
						tag: "a",
						size: "medium",
						theme: action.theme,
						text: action.text,
						href: action.link,
						target: action.target,
						rel: action.rel
					}, null, _parent));
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent);
			_push(`</div>`);
			if (__props.image || unref(heroImageSlotExists)) {
				_push(`<div class="image" data-v-14a30d33><div class="image-container" data-v-14a30d33><div class="image-bg" data-v-14a30d33></div>`);
				ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, () => {
					if (__props.image) _push(ssrRenderComponent(VPImage_default, {
						class: "image-src",
						image: __props.image
					}, null, _parent));
					else _push(`<!---->`);
				}, _push, _parent);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$51 = _sfc_main$45.setup;
_sfc_main$45.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHero.vue");
	return _sfc_setup$51 ? _sfc_setup$51(props, ctx) : void 0;
};
var VPHero_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$45, [["__scopeId", "data-v-14a30d33"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue
var _sfc_main$44 = {
	__name: "VPHomeHero",
	__ssrInlineRender: true,
	setup(__props) {
		const { frontmatter: fm } = useData();
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(fm).hero) _push(ssrRenderComponent(VPHero_default, mergeProps({
				class: "VPHomeHero",
				name: unref(fm).hero.name,
				text: unref(fm).hero.text,
				tagline: unref(fm).hero.tagline,
				image: unref(fm).hero.image,
				actions: unref(fm).hero.actions
			}, _attrs), {
				"home-hero-info-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-before")];
				}),
				"home-hero-info": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info")];
				}),
				"home-hero-info-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-after")];
				}),
				"home-hero-actions-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-after")];
				}),
				"home-hero-actions-before-actions": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-before-actions")];
				}),
				"home-hero-image": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-image")];
				}),
				_: 3
			}, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$50 = _sfc_main$44.setup;
_sfc_main$44.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue");
	return _sfc_setup$50 ? _sfc_setup$50(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHome.vue
var _sfc_main$43 = {
	__name: "VPHome",
	__ssrInlineRender: true,
	setup(__props) {
		const { frontmatter, theme } = useData();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Content = resolveComponent("Content");
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPHome", { "external-link-icon-enabled": unref(theme).externalLinkIcon }] }, _attrs))} data-v-7653d09d>`);
			ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push, _parent);
			_push(ssrRenderComponent(_sfc_main$44, null, {
				"home-hero-info-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)];
				}),
				"home-hero-info": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)];
				}),
				"home-hero-info-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)];
				}),
				"home-hero-actions-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)];
				}),
				"home-hero-actions-before-actions": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, void 0, true)];
				}),
				"home-hero-image": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push, _parent);
			_push(ssrRenderComponent(_sfc_main$47, null, null, _parent));
			ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push, _parent);
			if (unref(frontmatter).markdownStyles !== false) _push(ssrRenderComponent(VPHomeContent_default, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_Content, null, null, _parent, _scopeId));
					else return [createVNode(_component_Content)];
				}),
				_: 1
			}, _parent));
			else _push(ssrRenderComponent(_component_Content, null, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$49 = _sfc_main$43.setup;
_sfc_main$43.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHome.vue");
	return _sfc_setup$49 ? _sfc_setup$49(props, ctx) : void 0;
};
var VPHome_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$43, [["__scopeId", "data-v-7653d09d"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPPage.vue
var _sfc_main$42 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
	const _component_Content = resolveComponent("Content");
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPPage" }, _attrs))}>`);
	ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push, _parent);
	_push(ssrRenderComponent(_component_Content, null, null, _parent));
	ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push, _parent);
	_push(`</div>`);
}
var _sfc_setup$48 = _sfc_main$42.setup;
_sfc_main$42.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPPage.vue");
	return _sfc_setup$48 ? _sfc_setup$48(props, ctx) : void 0;
};
var VPPage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$42, [["ssrRender", _sfc_ssrRender$2]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPContent.vue
var _sfc_main$41 = {
	__name: "VPContent",
	__ssrInlineRender: true,
	setup(__props) {
		const { page, frontmatter } = useData();
		const { isHome, hasSidebar } = useLayout();
		function isRegistered(component) {
			return typeof resolveDynamicComponent(component) !== "string";
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: ["VPContent", {
					"has-sidebar": unref(hasSidebar),
					"is-home": unref(isHome)
				}],
				id: "VPContent"
			}, _attrs))} data-v-23305df8>`);
			if (unref(page).isNotFound) ssrRenderSlot(_ctx.$slots, "not-found", {}, () => {
				_push(ssrRenderComponent(NotFound_default, null, null, _parent));
			}, _push, _parent);
			else if (unref(frontmatter).layout === "page" && !isRegistered("page")) _push(ssrRenderComponent(VPPage_default, null, {
				"page-top": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "page-top", {}, void 0, true)];
				}),
				"page-bottom": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "page-bottom", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			else if (unref(frontmatter).layout === "home" && !isRegistered("home")) _push(ssrRenderComponent(VPHome_default, null, {
				"home-hero-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-before", {}, void 0, true)];
				}),
				"home-hero-info-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)];
				}),
				"home-hero-info": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)];
				}),
				"home-hero-info-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)];
				}),
				"home-hero-actions-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)];
				}),
				"home-hero-actions-before-actions": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, void 0, true)];
				}),
				"home-hero-image": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)];
				}),
				"home-hero-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-after", {}, void 0, true)];
				}),
				"home-features-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-features-before", {}, void 0, true)];
				}),
				"home-features-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-features-after", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			else if ((!unref(frontmatter).layout || unref(frontmatter).layout === "doc") && !isRegistered("doc")) _push(ssrRenderComponent(VPDoc_default, null, {
				"doc-top": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-top", {}, void 0, true)];
				}),
				"doc-bottom": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-bottom", {}, void 0, true)];
				}),
				"doc-footer-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)];
				}),
				"doc-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-before", {}, void 0, true)];
				}),
				"doc-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-after", {}, void 0, true)];
				}),
				"aside-top": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)];
				}),
				"aside-outline-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)];
				}),
				"aside-outline-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)];
				}),
				"aside-ads-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)];
				}),
				"aside-ads-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)];
				}),
				"aside-bottom": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			else ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(frontmatter).layout || "doc"), null, null), _parent);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$47 = _sfc_main$41.setup;
_sfc_main$41.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPContent.vue");
	return _sfc_setup$47 ? _sfc_setup$47(props, ctx) : void 0;
};
var VPContent_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$41, [["__scopeId", "data-v-23305df8"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue
var _sfc_main$40 = {
	__name: "VPFooter",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme, frontmatter } = useData();
		const { hasSidebar } = useLayout();
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(theme).footer && unref(frontmatter).footer !== false) {
				_push(`<footer${ssrRenderAttrs(mergeProps({ class: ["VPFooter", { "has-sidebar": unref(hasSidebar) }] }, _attrs))} data-v-9b1337d0><div class="container" data-v-9b1337d0>`);
				if (unref(theme).footer.message) _push(`<p class="message" data-v-9b1337d0>${unref(theme).footer.message ?? ""}</p>`);
				else _push(`<!---->`);
				if (unref(theme).footer.copyright) _push(`<p class="copyright" data-v-9b1337d0>${unref(theme).footer.copyright ?? ""}</p>`);
				else _push(`<!---->`);
				_push(`</div></footer>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$46 = _sfc_main$40.setup;
_sfc_main$40.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue");
	return _sfc_setup$46 ? _sfc_setup$46(props, ctx) : void 0;
};
var VPFooter_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$40, [["__scopeId", "data-v-9b1337d0"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/scroll-lock.js
var isIOS = inBrowser && (/iP(?:ad|hone|od)/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
var scrollKeys = /* @__PURE__ */ new Set([
	" ",
	"PageUp",
	"PageDown",
	"Home",
	"End",
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
var listenerOptions = {
	capture: true,
	passive: false
};
function isScrollable(target) {
	let el = target instanceof Element ? target : null;
	while (el && el !== document.body) {
		const { overflowX, overflowY } = getComputedStyle(el);
		if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight || (overflowX === "auto" || overflowX === "scroll") && el.scrollWidth > el.clientWidth) return true;
		el = el.parentElement;
	}
	return false;
}
function blockScroll(e) {
	if ("touches" in e && e.touches.length > 1) return;
	if (!isScrollable(e.target)) e.preventDefault();
}
function blockScrollKeys(e) {
	if (e.metaKey || e.ctrlKey || e.altKey || !scrollKeys.has(e.key)) return;
	const el = e.target;
	if (el instanceof HTMLElement && (el.isContentEditable || el.matches("input, textarea, select"))) return;
	blockScroll(e);
}
var overflowLockCount = 0;
var eventLockCount = 0;
var initialOverflow;
var initialGutter;
function lockOverflow() {
	if (++overflowLockCount > 1) return;
	const html = document.documentElement;
	if (!getComputedStyle(html).scrollbarGutter.includes("stable")) {
		initialGutter = html.style.scrollbarGutter;
		html.style.scrollbarGutter = "stable";
	}
	initialOverflow = document.body.style.overflow;
	document.body.style.overflow = "hidden";
	if (isIOS) document.addEventListener("touchmove", blockScroll, listenerOptions);
}
function unlockOverflow() {
	if (--overflowLockCount > 0) return;
	if (isIOS) document.removeEventListener("touchmove", blockScroll, listenerOptions);
	document.body.style.overflow = initialOverflow ?? "";
	if (initialGutter !== void 0) document.documentElement.style.scrollbarGutter = initialGutter;
	initialOverflow = initialGutter = void 0;
}
function lockEvents() {
	if (++eventLockCount > 1) return;
	document.addEventListener("wheel", blockScroll, listenerOptions);
	document.addEventListener("touchmove", blockScroll, listenerOptions);
	document.addEventListener("keydown", blockScrollKeys, listenerOptions);
}
function unlockEvents() {
	if (--eventLockCount > 0) return;
	document.removeEventListener("wheel", blockScroll, listenerOptions);
	document.removeEventListener("touchmove", blockScroll, listenerOptions);
	document.removeEventListener("keydown", blockScrollKeys, listenerOptions);
}
/**
* Locks page scrolling behind an overlay.
*
* Prefer `scrollbar-gutter: stable` + `overflow: hidden` so layout width
* stays stable when the scrollbar is hidden. If unsupported, fall back to
* blocking scroll events while still allowing events inside scrollable
* elements.
*/
function useBodyScrollLock() {
	const isLocked = shallowRef(false);
	let useEvents = false;
	function lock() {
		if (isLocked.value) return;
		useEvents = window.innerWidth > document.documentElement.clientWidth && !CSS.supports("scrollbar-gutter", "stable");
		useEvents ? lockEvents() : lockOverflow();
		isLocked.value = true;
	}
	function unlock() {
		if (!isLocked.value) return;
		useEvents ? unlockEvents() : unlockOverflow();
		isLocked.value = false;
	}
	onScopeDispose(unlock);
	return computed({
		get: () => isLocked.value,
		set: (value) => value ? lock() : unlock()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue
var _sfc_main$39 = {
	__name: "VPLocalNavOutlineDropdown",
	__ssrInlineRender: true,
	props: {
		headers: {
			type: Array,
			required: true
		},
		navHeight: {
			type: Number,
			required: true
		}
	},
	setup(__props) {
		const { theme } = useData();
		const open = ref(false);
		const vh = ref(0);
		const main = useTemplateRef("main");
		useTemplateRef("items");
		const itemsId = useId();
		const isLocked = useBodyScrollLock();
		function closeOnClickOutside(e) {
			if (!main.value?.contains(e.target)) open.value = false;
		}
		watch(open, (value) => {
			isLocked.value = value;
			if (value) {
				document.addEventListener("click", closeOnClickOutside);
				return;
			}
			document.removeEventListener("click", closeOnClickOutside);
		});
		onKeyStroke("Escape", () => {
			open.value = false;
		});
		onContentUpdated(() => {
			open.value = false;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				ref_key: "main",
				ref: main,
				class: "VPLocalNavOutlineDropdown",
				style: { "--vp-vh": vh.value + "px" },
				"data-allow-mismatch": "style"
			}, _attrs))} data-v-d997208b>`);
			if (__props.headers.length > 0) _push(`<button type="button"${ssrRenderAttr("aria-expanded", open.value)}${ssrRenderAttr("aria-controls", unref(itemsId))} class="${ssrRenderClass({ open: open.value })}" data-v-d997208b><span class="menu-text" data-v-d997208b>${ssrInterpolate(unref(resolveTitle)(unref(theme)))}</span><span class="vpi-chevron-right icon" aria-hidden="true" data-v-d997208b></span></button>`);
			else _push(`<button type="button" data-v-d997208b>${ssrInterpolate(unref(theme).returnToTopLabel || "Return to top")}</button>`);
			if (open.value) {
				_push(`<div${ssrRenderAttr("id", unref(itemsId))} class="items" data-v-d997208b><div class="header" data-v-d997208b><a class="top-link" href="#" data-v-d997208b>${ssrInterpolate(unref(theme).returnToTopLabel || "Return to top")}</a></div><div class="outline" data-v-d997208b>`);
				_push(ssrRenderComponent(VPDocOutlineItem_default, { headers: __props.headers }, null, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$45 = _sfc_main$39.setup;
_sfc_main$39.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue");
	return _sfc_setup$45 ? _sfc_setup$45(props, ctx) : void 0;
};
var VPLocalNavOutlineDropdown_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$39, [["__scopeId", "data-v-d997208b"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPLocalNav.vue
var _sfc_main$38 = {
	__name: "VPLocalNav",
	__ssrInlineRender: true,
	props: { open: {
		type: Boolean,
		required: true
	} },
	emits: ["open-menu"],
	setup(__props) {
		const { theme } = useData();
		const { isHome, hasSidebar, headers, hasLocalNav } = useLayout();
		const { y } = useWindowScroll();
		const navHeight = ref(0);
		onMounted(() => {
			const probe = document.createElement("div");
			probe.style.cssText = "position: absolute; visibility: hidden; height: var(--vp-nav-height)";
			document.body.appendChild(probe);
			navHeight.value = probe.offsetHeight;
			probe.remove();
		});
		const isScrolled = computed(() => y.value >= navHeight.value);
		return (_ctx, _push, _parent, _attrs) => {
			if (!unref(isHome) && (unref(hasLocalNav) || unref(hasSidebar) || isScrolled.value)) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPLocalNav", {
					"has-sidebar": unref(hasSidebar),
					"empty": !unref(hasLocalNav),
					"fixed": !unref(hasLocalNav) && !unref(hasSidebar)
				}] }, _attrs))} data-v-a8f93490><div class="container" data-v-a8f93490>`);
				if (unref(hasSidebar)) _push(`<button type="button" class="menu"${ssrRenderAttr("aria-expanded", __props.open)} aria-controls="VPSidebarNav" data-v-a8f93490><span class="vpi-align-left menu-icon" aria-hidden="true" data-v-a8f93490></span><span class="menu-text" data-v-a8f93490>${ssrInterpolate(unref(theme).sidebarMenuLabel || "Menu")}</span></button>`);
				else _push(`<!---->`);
				_push(ssrRenderComponent(VPLocalNavOutlineDropdown_default, {
					headers: unref(headers),
					navHeight: navHeight.value
				}, null, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$44 = _sfc_main$38.setup;
_sfc_main$38.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPLocalNav.vue");
	return _sfc_setup$44 ? _sfc_setup$44(props, ctx) : void 0;
};
var VPLocalNav_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$38, [["__scopeId", "data-v-a8f93490"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/nav.js
var isScreenOpen = ref(false);
var screenTriggerEl = shallowRef(null);
function openScreen() {
	isScreenOpen.value = true;
}
function closeScreen() {
	isScreenOpen.value = false;
}
function toggleScreen() {
	isScreenOpen.value ? closeScreen() : openScreen();
}
var watchersRegistered = false;
function useNav() {
	if (inBrowser && !watchersRegistered) {
		watchersRegistered = true;
		whenever(useMediaQuery("(min-width: 48rem)"), closeScreen);
		const route = useRoute();
		watch(() => route.path, closeScreen);
	}
	return {
		isScreenOpen,
		screenTriggerEl,
		openScreen,
		closeScreen,
		toggleScreen
	};
}
function useAppearanceSwitch() {
	const { site } = useData();
	return computed(() => !!site.value.appearance && site.value.appearance !== "force-dark" && site.value.appearance !== "force-auto");
}
function useNavItemLink(item) {
	const route = useRoute();
	const href = computed(() => {
		const { link } = toValue(item);
		return typeof link === "function" ? link(route.data) : link;
	});
	return {
		href,
		isActiveLink: computed(() => {
			const { activeMatch } = toValue(item);
			return isActive(route.data.relativePath, route.hash, activeMatch || href.value, !!activeMatch);
		}),
		isCurrentLink: computed(() => {
			return isActive(route.data.relativePath, route.hash, href.value);
		})
	};
}
var navInjectionKey = Symbol("nav");
var navScreenInjectionKey = Symbol("nav-screen");
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/nav-overflow.js
/**
* Priority+ overflow for the navbar (#1271, #2842).
*
* Collapse order under space pressure: social links → appearance switch →
* translations → menu items right-to-left. Collapsed units move into the
* `⋯` flyout (VPNavBarExtra) instead of being clipped, so nothing ever
* becomes unreachable.
*
* Collapsed units stay mounted but hidden (visibility: hidden + absolute,
* which also removes them from the a11y tree and tab order), so their
* natural widths remain measurable and observed — re-expanding never works
* from stale data.
*/
var navClusterUnits = [
	"translations",
	"appearance",
	"socialLinks"
];
var allVisible = {
	visibleItemCount: Infinity,
	translations: true,
	appearance: true,
	socialLinks: true
};
function computeNavFit(input) {
	const { itemWidths, available, extraWidth } = input;
	const itemsTotal = itemWidths.reduce((sum, w) => sum + w, 0);
	if (itemsTotal + ((input.translations ?? 0) + (input.appearance ?? 0) + (input.socialLinks ?? 0)) <= available) return allVisible;
	const budget = available - extraWidth;
	if (itemsTotal > budget) {
		let used = 0;
		let visibleItemCount = 0;
		for (const width of itemWidths) {
			if (used + width > budget) break;
			used += width;
			visibleItemCount++;
		}
		return {
			visibleItemCount,
			translations: input.translations == null,
			appearance: input.appearance == null,
			socialLinks: input.socialLinks == null
		};
	}
	const result = { ...allVisible };
	let used = itemsTotal;
	let dropRest = false;
	for (const unit of navClusterUnits) {
		const width = input[unit];
		if (width == null) continue;
		if (dropRest || used + width > budget) {
			dropRest = true;
			result[unit] = false;
		} else used += width;
	}
	return result;
}
/** headroom against sub-pixel rounding and the inter-unit dividers */
var SLACK = 24;
/** used until the real `⋯` button has been measured once */
var EXTRA_WIDTH_ESTIMATE = 48;
var navOverflowKey = Symbol("nav-overflow");
function useNavOverflow() {
	return inject(navOverflowKey, null);
}
function provideNavOverflow(options) {
	const state = reactive({ ...allVisible });
	const itemEls = /* @__PURE__ */ new Map();
	const clusterEls = /* @__PURE__ */ new Map();
	let containerEl = null;
	let menuEl = null;
	let extraEl = null;
	let extraWidth = EXTRA_WIDTH_ESTIMATE;
	let observer = null;
	const observed = /* @__PURE__ */ new Set();
	let scheduled = false;
	function observe(el) {
		if (!inBrowser || !(el instanceof Element) || observed.has(el)) return;
		observed.add(el);
		(observer ??= new ResizeObserver(schedule)).observe(el);
	}
	function schedule() {
		if (!inBrowser || scheduled) return;
		scheduled = true;
		requestAnimationFrame(() => {
			scheduled = false;
			recompute();
		});
	}
	const controller = {
		state,
		hasCollapsed: () => state.visibleItemCount !== Infinity || !state.translations || !state.appearance || !state.socialLinks,
		setContainerEl(el) {
			containerEl = el;
			observe(el);
			schedule();
		},
		setMenuEl(el) {
			menuEl = el;
			observe(el);
			schedule();
		},
		setExtraEl(el) {
			extraEl = el;
			observe(el);
			schedule();
		},
		setItemEl(index, el) {
			el ? itemEls.set(index, el) : itemEls.delete(index);
			observe(el);
			schedule();
		},
		setClusterEl(unit, el) {
			el ? clusterEls.set(unit, el) : clusterEls.delete(unit);
			observe(el);
			schedule();
		}
	};
	provide(navOverflowKey, controller);
	if (!inBrowser) return controller;
	const isEngineActive = useMediaQuery("(min-width: 48rem)");
	function measureUnit(el) {
		return Math.max(el.offsetWidth, el.scrollWidth);
	}
	function recompute() {
		if (!isEngineActive.value) return applyResult(allVisible);
		if (!containerEl) return;
		if (extraEl && extraEl.offsetWidth > 0) extraWidth = extraEl.offsetWidth;
		let fixed = 0;
		for (const child of Array.from(containerEl.children)) {
			if (!(child instanceof HTMLElement)) continue;
			if (child === menuEl || child === extraEl) continue;
			let isCluster = false;
			for (const el of clusterEls.values()) if (el === child) {
				isCluster = true;
				break;
			}
			if (isCluster) continue;
			fixed += child.offsetWidth;
		}
		const itemWidths = [];
		for (let i = 0; i < itemEls.size; i++) {
			const el = itemEls.get(i);
			if (!el) return;
			itemWidths.push(measureUnit(el));
		}
		const clusterWidth = (unit) => {
			const el = clusterEls.get(unit);
			return el ? measureUnit(el) : null;
		};
		applyResult(computeNavFit({
			itemWidths,
			translations: clusterWidth("translations"),
			appearance: clusterWidth("appearance"),
			socialLinks: clusterWidth("socialLinks"),
			available: containerEl.clientWidth - fixed - SLACK,
			extraWidth
		}));
	}
	function applyResult(result) {
		if (state.visibleItemCount !== result.visibleItemCount) state.visibleItemCount = result.visibleItemCount;
		for (const unit of navClusterUnits) if (state[unit] !== result[unit]) state[unit] = result[unit];
	}
	watch(isEngineActive, schedule);
	watch(() => toValue(options.itemsKey), schedule);
	if (document.fonts?.ready) document.fonts.ready.then(schedule).catch(() => {});
	onScopeDispose(() => {
		observer?.disconnect();
		observer = null;
		observed.clear();
	});
	return controller;
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSwitch.vue
var _sfc_main$37 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
	_push(`<button${ssrRenderAttrs(mergeProps({
		class: "VPSwitch",
		type: "button",
		role: "switch"
	}, _attrs))} data-v-2185e261><span class="check" data-v-2185e261>`);
	if (_ctx.$slots.default) {
		_push(`<span class="icon" data-v-2185e261>`);
		ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
		_push(`</span>`);
	} else _push(`<!---->`);
	_push(`</span></button>`);
}
var _sfc_setup$43 = _sfc_main$37.setup;
_sfc_main$37.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSwitch.vue");
	return _sfc_setup$43 ? _sfc_setup$43(props, ctx) : void 0;
};
var VPSwitch_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$37, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-2185e261"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue
var _sfc_main$36 = {
	__name: "VPSwitchAppearance",
	__ssrInlineRender: true,
	setup(__props) {
		const { isDark, theme } = useData();
		const toggleAppearance = inject("toggle-appearance", () => {
			isDark.value = !isDark.value;
		});
		const switchTitle = ref("");
		watchPostEffect(() => {
			switchTitle.value = isDark.value ? theme.value.lightModeSwitchTitle || "Switch to light theme" : theme.value.darkModeSwitchTitle || "Switch to dark theme";
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(VPSwitch_default, mergeProps({
				title: switchTitle.value,
				class: "VPSwitchAppearance",
				"aria-label": unref(theme).darkModeSwitchLabel || "Appearance",
				"aria-checked": unref(isDark),
				onClick: unref(toggleAppearance)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="vpi-sun sun" aria-hidden="true" data-v-c7f8cc90${_scopeId}></span><span class="vpi-moon moon" aria-hidden="true" data-v-c7f8cc90${_scopeId}></span>`);
					else return [createVNode("span", {
						class: "vpi-sun sun",
						"aria-hidden": "true"
					}), createVNode("span", {
						class: "vpi-moon moon",
						"aria-hidden": "true"
					})];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$42 = _sfc_main$36.setup;
_sfc_main$36.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue");
	return _sfc_setup$42 ? _sfc_setup$42(props, ctx) : void 0;
};
var VPSwitchAppearance_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$36, [["__scopeId", "data-v-c7f8cc90"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavAppearance.vue
var _sfc_main$35 = {
	__name: "VPNavAppearance",
	__ssrInlineRender: true,
	props: {
		row: {
			type: Boolean,
			required: false
		},
		screen: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { theme } = useData();
		const show = useAppearanceSwitch();
		const overflow = props.row ? null : useNavOverflow();
		const isCollapsed = computed(() => !!overflow && !overflow.state.appearance);
		const labelId = useId();
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(show)) {
				_push(`<div${ssrRenderAttrs(mergeProps({
					class: ["VPNavAppearance", [__props.row ? __props.screen ? "VPNavScreenAppearance" : "menu-appearance" : "VPNavBarAppearance", { collapsed: isCollapsed.value }]],
					ref: (el) => unref(overflow)?.setClusterEl("appearance", el)
				}, _attrs))} data-v-b3a0817f>`);
				if (__props.row) _push(`<p${ssrRenderAttr("id", unref(labelId))} class="text" data-v-b3a0817f>${ssrInterpolate(unref(theme).darkModeSwitchLabel || "Appearance")}</p>`);
				else _push(`<!---->`);
				_push(ssrRenderComponent(VPSwitchAppearance_default, { "aria-labelledby": __props.row ? unref(labelId) : void 0 }, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$41 = _sfc_main$35.setup;
_sfc_main$35.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavAppearance.vue");
	return _sfc_setup$41 ? _sfc_setup$41(props, ctx) : void 0;
};
var VPNavAppearance_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$35, [["__scopeId", "data-v-b3a0817f"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/flyout.js
var focusedElement = ref();
var active = false;
var listeners = 0;
function useFlyout(options) {
	const focus = ref(false);
	if (inBrowser) {
		!active && activateFocusTracking();
		listeners++;
		const unwatch = watch(focusedElement, (el) => {
			if (el === options.el.value || options.el.value?.contains(el)) {
				focus.value = true;
				options.onFocus?.();
			} else {
				focus.value = false;
				options.onBlur?.();
			}
		});
		onUnmounted(() => {
			unwatch();
			listeners--;
			if (!listeners) deactivateFocusTracking();
		});
	}
	return readonly(focus);
}
function activateFocusTracking() {
	document.addEventListener("focusin", handleFocusIn);
	active = true;
	focusedElement.value = document.activeElement;
}
function deactivateFocusTracking() {
	document.removeEventListener("focusin", handleFocusIn);
	active = false;
}
function handleFocusIn() {
	focusedElement.value = document.activeElement;
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPMenuLink.vue
var _sfc_main$34 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "VPMenuLink",
	__ssrInlineRender: true,
	props: {
		item: {
			type: null,
			required: true
		},
		rel: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { href, isActiveLink, isCurrentLink } = useNavItemLink(() => props.item);
		const screen = inject(navScreenInjectionKey, false);
		const nav = inject(navInjectionKey, null);
		function onClick() {
			if (screen) nav?.closeScreen();
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<li${ssrRenderAttrs(mergeProps({ class: "VPMenuLink" }, _attrs))} data-v-294a8706>`);
			_push(ssrRenderComponent(_sfc_main$54, mergeProps(_ctx.$attrs, {
				class: {
					active: unref(isActiveLink),
					VPNavScreenMenuGroupLink: unref(screen)
				},
				"aria-current": unref(isCurrentLink) ? "page" : void 0,
				href: unref(href),
				target: __props.item.target,
				rel: props.rel ?? __props.item.rel,
				"no-icon": __props.item.noIcon,
				onClick
			}), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span data-v-294a8706${_scopeId}>${__props.item.text ?? ""}</span>`);
					else return [createVNode("span", { innerHTML: __props.item.text }, null, 8, ["innerHTML"])];
				}),
				_: 1
			}, _parent));
			_push(`</li>`);
		};
	}
});
var _sfc_setup$40 = _sfc_main$34.setup;
_sfc_main$34.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPMenuLink.vue");
	return _sfc_setup$40 ? _sfc_setup$40(props, ctx) : void 0;
};
var VPMenuLink_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$34, [["__scopeId", "data-v-294a8706"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPMenuGroup.vue
var _sfc_main$33 = {
	__name: "VPMenuGroup",
	__ssrInlineRender: true,
	props: {
		text: {
			type: String,
			required: false
		},
		items: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const screen = inject(navScreenInjectionKey, false);
		const hasSubGroups = computed(() => props.items.some((item) => !("link" in item) && !("component" in item)));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_VPMenuGroup = resolveComponent("VPMenuGroup", true);
			_push(`<li${ssrRenderAttrs(mergeProps({ class: ["VPMenuGroup", { VPNavScreenMenuGroupSection: unref(screen) }] }, _attrs))} data-v-cd07edf1>`);
			if (__props.text) _push(`<p class="title" data-v-cd07edf1>${ssrInterpolate(__props.text)}</p>`);
			else _push(`<!---->`);
			_push(`<ul class="${ssrRenderClass({ "sub-groups": hasSubGroups.value })}" data-v-cd07edf1><!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(`<!--[-->`);
				if ("link" in item) _push(ssrRenderComponent(VPMenuLink_default, { item }, null, _parent));
				else if ("component" in item) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, {
					"screen-menu": unref(screen) || void 0,
					menu: !unref(screen) || void 0
				}), null), _parent);
				else _push(ssrRenderComponent(_component_VPMenuGroup, {
					text: item.text,
					items: item.items
				}, null, _parent));
				_push(`<!--]-->`);
			});
			_push(`<!--]--></ul></li>`);
		};
	}
};
var _sfc_setup$39 = _sfc_main$33.setup;
_sfc_main$33.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPMenuGroup.vue");
	return _sfc_setup$39 ? _sfc_setup$39(props, ctx) : void 0;
};
var VPMenuGroup_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$33, [["__scopeId", "data-v-cd07edf1"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPMenu.vue
var _sfc_main$32 = {
	__name: "VPMenu",
	__ssrInlineRender: true,
	props: { items: {
		type: Array,
		required: false
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenu" }, _attrs))} data-v-6eb2ab25>`);
			if (__props.items) {
				_push(`<ul class="items" data-v-6eb2ab25><!--[-->`);
				ssrRenderList(__props.items, (item) => {
					_push(`<!--[-->`);
					if ("link" in item) _push(ssrRenderComponent(VPMenuLink_default, { item }, null, _parent));
					else if ("component" in item) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { menu: "" }), null), _parent);
					else _push(ssrRenderComponent(VPMenuGroup_default, {
						text: item.text,
						items: item.items
					}, null, _parent));
					_push(`<!--]-->`);
				});
				_push(`<!--]--></ul>`);
			} else _push(`<!---->`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$38 = _sfc_main$32.setup;
_sfc_main$32.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPMenu.vue");
	return _sfc_setup$38 ? _sfc_setup$38(props, ctx) : void 0;
};
var VPMenu_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$32, [["__scopeId", "data-v-6eb2ab25"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPFlyout.vue
var _sfc_main$31 = {
	__name: "VPFlyout",
	__ssrInlineRender: true,
	props: {
		icon: {
			type: String,
			required: false
		},
		button: {
			type: String,
			required: false
		},
		label: {
			type: String,
			required: false
		},
		items: {
			type: Array,
			required: false
		}
	},
	setup(__props) {
		const open = ref(false);
		const el = useTemplateRef("el");
		useTemplateRef("buttonEl");
		useTemplateRef("menuEl");
		const menuId = useId();
		useFlyout({
			el,
			onBlur: close
		});
		const route = useRoute();
		watch(() => route.path, close);
		function close() {
			open.value = false;
		}
		onKeyStroke("Escape", () => {
			if (!open.value) return;
			const restoreFocus = el.value?.contains(document.activeElement);
			close();
			if (restoreFocus) el.value?.querySelector("button")?.focus();
		});
		useEventListener("pointerdown", (e) => {
			if (open.value && el.value && !el.value.contains(e.target)) close();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "VPFlyout",
				ref_key: "el",
				ref: el
			}, _attrs))} data-v-c92ef70a><button type="button" class="button"${ssrRenderAttr("aria-expanded", open.value)}${ssrRenderAttr("aria-controls", unref(menuId))}${ssrRenderAttr("aria-label", __props.label)} data-v-c92ef70a>`);
			if (__props.button || __props.icon) {
				_push(`<span class="text" data-v-c92ef70a>`);
				if (__props.icon) _push(`<span class="${ssrRenderClass([__props.icon, "option-icon"])}" aria-hidden="true" data-v-c92ef70a></span>`);
				else _push(`<!---->`);
				if (__props.button) _push(`<span data-v-c92ef70a>${__props.button ?? ""}</span>`);
				else _push(`<!---->`);
				_push(`<span class="vpi-chevron-down text-icon" aria-hidden="true" data-v-c92ef70a></span></span>`);
			} else _push(`<span class="vpi-more-horizontal icon" aria-hidden="true" data-v-c92ef70a></span>`);
			_push(`</button><div class="menu"${ssrRenderAttr("id", unref(menuId))} data-v-c92ef70a>`);
			_push(ssrRenderComponent(VPMenu_default, { items: __props.items }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$37 = _sfc_main$31.setup;
_sfc_main$31.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPFlyout.vue");
	return _sfc_setup$37 ? _sfc_setup$37(props, ctx) : void 0;
};
var VPFlyout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$31, [["__scopeId", "data-v-c92ef70a"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavTranslations.vue
var _sfc_main$30 = {
	__name: "VPNavTranslations",
	__ssrInlineRender: true,
	props: {
		screen: {
			type: Boolean,
			required: false
		},
		menu: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { theme } = useData();
		const { localeLinks, currentLang } = useLangs({ linkToCorrespondingPage: true });
		const show = computed(() => !!(localeLinks.value.length && currentLang.value.label));
		const overflow = props.screen || props.menu ? null : useNavOverflow();
		const isCollapsed = computed(() => !!overflow && !overflow.state.translations);
		const isOpen = ref(false);
		const listId = useId();
		const localeProps = (locale) => ({
			lang: locale.lang,
			hreflang: locale.lang,
			rel: "alternate",
			dir: locale.dir,
			"data-allow-mismatch": "attribute"
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.screen && show.value) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPNavTranslations VPNavScreenTranslations", { open: isOpen.value }] }, _attrs))} data-v-2871c967><button type="button" class="title"${ssrRenderAttr("aria-expanded", isOpen.value)}${ssrRenderAttr("aria-controls", unref(listId))} data-v-2871c967><span class="vpi-languages icon lang" aria-hidden="true" data-v-2871c967></span> ${ssrInterpolate(unref(currentLang).label)} <span class="vpi-chevron-down icon chevron" aria-hidden="true" data-v-2871c967></span></button><ul${ssrRenderAttr("id", unref(listId))} class="list" style="${ssrRenderStyle(isOpen.value ? null : { display: "none" })}" data-v-2871c967><!--[-->`);
				ssrRenderList(unref(localeLinks), (locale) => {
					_push(`<li class="item" data-v-2871c967>`);
					_push(ssrRenderComponent(_sfc_main$54, mergeProps({
						class: "link",
						href: locale.link,
						external: false
					}, { ref_for: true }, localeProps(locale)), {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(locale.text)}`);
							else return [createTextVNode(toDisplayString(locale.text), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul></div>`);
			} else if (__props.menu && show.value) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavTranslations group translations" }, _attrs))} data-v-2871c967><p class="title" data-v-2871c967>${ssrInterpolate(unref(currentLang).label)}</p><ul data-v-2871c967><!--[-->`);
				ssrRenderList(unref(localeLinks), (locale) => {
					_push(ssrRenderComponent(VPMenuLink_default, mergeProps({
						item: locale,
						external: false
					}, { ref_for: true }, localeProps(locale)), null, _parent));
				});
				_push(`<!--]--></ul></div>`);
			} else if (!__props.menu && show.value) _push(ssrRenderComponent(VPFlyout_default, mergeProps({
				class: ["VPNavTranslations VPNavBarTranslations", { collapsed: isCollapsed.value }],
				icon: "vpi-languages",
				label: unref(theme).langMenuLabel || "Change language",
				ref: (inst) => unref(overflow)?.setClusterEl("translations", inst?.$el ?? null)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="title" data-v-2871c967${_scopeId}>${ssrInterpolate(unref(currentLang).label)}</p><ul class="items" data-v-2871c967${_scopeId}><!--[-->`);
						ssrRenderList(unref(localeLinks), (locale) => {
							_push(ssrRenderComponent(VPMenuLink_default, mergeProps({
								item: locale,
								external: false
							}, { ref_for: true }, localeProps(locale)), null, _parent, _scopeId));
						});
						_push(`<!--]--></ul>`);
					} else return [createVNode("p", { class: "title" }, toDisplayString(unref(currentLang).label), 1), createVNode("ul", { class: "items" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(localeLinks), (locale) => {
						return openBlock(), createBlock(VPMenuLink_default, mergeProps({
							key: locale.link,
							item: locale,
							external: false
						}, { ref_for: true }, localeProps(locale)), null, 16, ["item"]);
					}), 128))])];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$36 = _sfc_main$30.setup;
_sfc_main$30.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavTranslations.vue");
	return _sfc_setup$36 ? _sfc_setup$36(props, ctx) : void 0;
};
var VPNavTranslations_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$30, [["__scopeId", "data-v-2871c967"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPIcon.vue
var _sfc_main$29 = {
	__name: "VPIcon",
	__ssrInlineRender: true,
	props: { icon: {
		type: [String, Object],
		required: true
	} },
	setup(__props) {
		const props = __props;
		const el = useTemplateRef("el");
		const iconClass = useIcon(() => props.icon, el);
		return (_ctx, _push, _parent, _attrs) => {
			if (typeof __props.icon === "object") _push(`<span${ssrRenderAttrs(mergeProps({ class: "VPIcon" }, _attrs))} data-v-2fe0015c>${__props.icon.svg ?? ""}</span>`);
			else _push(`<span${ssrRenderAttrs(mergeProps({
				ref_key: "el",
				ref: el,
				class: unref(iconClass)
			}, _attrs))} data-v-2fe0015c></span>`);
		};
	}
};
var _sfc_setup$35 = _sfc_main$29.setup;
_sfc_main$29.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPIcon.vue");
	return _sfc_setup$35 ? _sfc_setup$35(props, ctx) : void 0;
};
var VPIcon_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$29, [["__scopeId", "data-v-2fe0015c"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSocialLink.vue
var _sfc_main$28 = {
	__name: "VPSocialLink",
	__ssrInlineRender: true,
	props: {
		icon: {
			type: [String, Object],
			required: true
		},
		link: {
			type: String,
			required: true
		},
		ariaLabel: {
			type: String,
			required: false
		},
		target: {
			type: String,
			required: false
		},
		me: {
			type: Boolean,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const qualifiedIcon = computed(() => typeof props.icon === "string" && !props.icon.includes(":") ? `simple-icons:${props.icon}` : props.icon);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<a${ssrRenderAttrs(mergeProps({
				class: "VPSocialLink no-icon",
				href: __props.link,
				"aria-label": __props.ariaLabel ?? (typeof __props.icon === "string" ? __props.icon : ""),
				target: __props.target ?? (unref(isExternal)(__props.link) ? "_blank" : void 0),
				rel: __props.me ? "me noopener" : "noopener"
			}, _attrs))} data-v-61a38ed5>`);
			_push(ssrRenderComponent(VPIcon_default, { icon: qualifiedIcon.value }, null, _parent));
			_push(`</a>`);
		};
	}
};
var _sfc_setup$34 = _sfc_main$28.setup;
_sfc_main$28.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSocialLink.vue");
	return _sfc_setup$34 ? _sfc_setup$34(props, ctx) : void 0;
};
var VPSocialLink_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$28, [["__scopeId", "data-v-61a38ed5"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSocialLinks.vue
var _sfc_main$27 = {
	__name: "VPSocialLinks",
	__ssrInlineRender: true,
	props: {
		links: {
			type: Array,
			required: true
		},
		me: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<ul${ssrRenderAttrs(mergeProps({ class: "VPSocialLinks" }, _attrs))} data-v-dc42a845><!--[-->`);
			ssrRenderList(__props.links, ({ link, icon, ariaLabel, target }) => {
				_push(`<li data-v-dc42a845>`);
				_push(ssrRenderComponent(VPSocialLink_default, {
					icon,
					link,
					ariaLabel,
					target,
					me: __props.me
				}, null, _parent));
				_push(`</li>`);
			});
			_push(`<!--]--></ul>`);
		};
	}
};
var _sfc_setup$33 = _sfc_main$27.setup;
_sfc_main$27.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSocialLinks.vue");
	return _sfc_setup$33 ? _sfc_setup$33(props, ctx) : void 0;
};
var VPSocialLinks_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$27, [["__scopeId", "data-v-dc42a845"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarExtra.vue
var _sfc_main$26 = {
	__name: "VPNavBarExtra",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme } = useData();
		const { localeLinks, currentLang } = useLangs({ linkToCorrespondingPage: true });
		const hasAppearanceSwitch = useAppearanceSwitch();
		const overflow = useNavOverflow();
		const overflowItems = computed(() => {
			const count = overflow?.state.visibleItemCount ?? Infinity;
			if (count === Infinity || !theme.value.nav) return [];
			return theme.value.nav.slice(count);
		});
		const showTranslations = computed(() => !!(localeLinks.value.length && currentLang.value.label) && !(overflow?.state.translations ?? true));
		const showAppearance = computed(() => hasAppearanceSwitch.value && !(overflow?.state.appearance ?? true));
		const showSocialLinks = computed(() => !!theme.value.socialLinks && !(overflow?.state.socialLinks ?? true));
		const hasContent = computed(() => overflowItems.value.length > 0 || showTranslations.value || showAppearance.value || showSocialLinks.value);
		return (_ctx, _push, _parent, _attrs) => {
			if (hasContent.value) _push(ssrRenderComponent(VPFlyout_default, mergeProps({
				class: "VPNavBarExtra",
				label: unref(theme).extraMenuLabel || "More options",
				ref: (inst) => unref(overflow)?.setExtraEl(inst?.$el ?? null)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (overflowItems.value.length) {
							_push(`<ul class="group overflow-items" data-v-c32aa68e${_scopeId}><!--[-->`);
							ssrRenderList(overflowItems.value, (item) => {
								_push(`<!--[-->`);
								if ("link" in item) _push(ssrRenderComponent(VPMenuLink_default, { item }, null, _parent, _scopeId));
								else if ("component" in item) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { menu: "" }), null), _parent, _scopeId);
								else _push(ssrRenderComponent(VPMenuGroup_default, {
									text: item.text,
									items: item.items
								}, null, _parent, _scopeId));
								_push(`<!--]-->`);
							});
							_push(`<!--]--></ul>`);
						} else _push(`<!---->`);
						if (showTranslations.value) _push(ssrRenderComponent(VPNavTranslations_default, { menu: "" }, null, _parent, _scopeId));
						else _push(`<!---->`);
						if (showAppearance.value) {
							_push(`<div class="group" data-v-c32aa68e${_scopeId}>`);
							_push(ssrRenderComponent(VPNavAppearance_default, { row: "" }, null, _parent, _scopeId));
							_push(`</div>`);
						} else _push(`<!---->`);
						if (showSocialLinks.value) {
							_push(`<div class="group" data-v-c32aa68e${_scopeId}><div class="item social-links" data-v-c32aa68e${_scopeId}>`);
							_push(ssrRenderComponent(VPSocialLinks_default, {
								class: "social-links-list",
								links: unref(theme).socialLinks
							}, null, _parent, _scopeId));
							_push(`</div></div>`);
						} else _push(`<!---->`);
					} else return [
						overflowItems.value.length ? (openBlock(), createBlock("ul", {
							key: 0,
							class: "group overflow-items"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(overflowItems.value, (item) => {
							return openBlock(), createBlock(Fragment, { key: JSON.stringify(item) }, ["link" in item ? (openBlock(), createBlock(VPMenuLink_default, {
								key: 0,
								item
							}, null, 8, ["item"])) : "component" in item ? (openBlock(), createBlock(resolveDynamicComponent(item.component), mergeProps({
								key: 1,
								ref_for: true
							}, item.props, { menu: "" }), null, 16)) : (openBlock(), createBlock(VPMenuGroup_default, {
								key: 2,
								text: item.text,
								items: item.items
							}, null, 8, ["text", "items"]))], 64);
						}), 128))])) : createCommentVNode("", true),
						showTranslations.value ? (openBlock(), createBlock(VPNavTranslations_default, {
							key: 1,
							menu: ""
						})) : createCommentVNode("", true),
						showAppearance.value ? (openBlock(), createBlock("div", {
							key: 2,
							class: "group"
						}, [createVNode(VPNavAppearance_default, { row: "" })])) : createCommentVNode("", true),
						showSocialLinks.value ? (openBlock(), createBlock("div", {
							key: 3,
							class: "group"
						}, [createVNode("div", { class: "item social-links" }, [createVNode(VPSocialLinks_default, {
							class: "social-links-list",
							links: unref(theme).socialLinks
						}, null, 8, ["links"])])])) : createCommentVNode("", true)
					];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$32 = _sfc_main$26.setup;
_sfc_main$26.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarExtra.vue");
	return _sfc_setup$32 ? _sfc_setup$32(props, ctx) : void 0;
};
var VPNavBarExtra_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$26, [["__scopeId", "data-v-c32aa68e"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue
var _sfc_main$25 = {
	__name: "VPNavBarHamburger",
	__ssrInlineRender: true,
	props: { active: {
		type: Boolean,
		required: true
	} },
	emits: ["click"],
	setup(__props) {
		const { theme } = useData();
		const el = useTemplateRef("el");
		const { screenTriggerEl } = useNav();
		watchEffect(() => {
			screenTriggerEl.value = el.value;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({
				ref_key: "el",
				ref: el,
				type: "button",
				class: ["VPNavBarHamburger", { active: __props.active }],
				"aria-label": unref(theme).mobileMenuLabel || "Menu",
				"aria-expanded": __props.active
			}, _attrs))} data-v-8e326f03><span class="container" aria-hidden="true" data-v-8e326f03><span class="top" data-v-8e326f03></span><span class="middle" data-v-8e326f03></span><span class="bottom" data-v-8e326f03></span></span></button>`);
		};
	}
};
var _sfc_setup$31 = _sfc_main$25.setup;
_sfc_main$25.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue");
	return _sfc_setup$31 ? _sfc_setup$31(props, ctx) : void 0;
};
var VPNavBarHamburger_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$25, [["__scopeId", "data-v-8e326f03"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/support/docsearch.js
/**
* Resolves the effective mode based on config and available features.
*
* - 'auto': infer hybrid vs sidePanel-only from provided config
* - 'sidePanel': force sidePanel-only even if keyword search is configured
* - 'hybrid': force hybrid (error if keyword search is not configured)
* - 'modal': force modal even if sidePanel is configured
*/
function resolveMode(options) {
	const mode = options.mode ?? "auto";
	const hasKeyword = hasKeywordSearch(options);
	const askAi = options.askAi;
	const hasSidePanelConfig = Boolean(askAi && typeof askAi === "object" && askAi.sidePanel);
	switch (mode) {
		case "sidePanel": return {
			mode,
			showKeywordSearch: false,
			useSidePanel: true
		};
		case "hybrid":
			if (!hasKeyword) console.error("[vitepress] mode: \"hybrid\" requires keyword search credentials (appId, apiKey, indexName).");
			return {
				mode,
				showKeywordSearch: hasKeyword,
				useSidePanel: true
			};
		case "modal": return {
			mode,
			showKeywordSearch: hasKeyword,
			useSidePanel: false
		};
		default: return {
			mode: "auto",
			showKeywordSearch: hasKeyword,
			useSidePanel: hasSidePanelConfig
		};
	}
}
function hasKeywordSearch(options) {
	return Boolean(options.appId && options.apiKey && options.indexName);
}
/**
* Removes existing `lang:` filters and appends `lang:${lang}`.
* Handles both flat arrays and nested arrays (for OR conditions).
*/
function mergeLangFacetFilters(rawFacetFilters, lang) {
	return [...(Array.isArray(rawFacetFilters) ? rawFacetFilters : rawFacetFilters ? [rawFacetFilters] : []).map((filter) => {
		if (Array.isArray(filter)) return filter.filter((f) => typeof f === "string" && !f.startsWith("lang:"));
		return filter;
	}).filter((filter) => {
		if (typeof filter === "string") return !filter.startsWith("lang:");
		return Array.isArray(filter) && filter.length > 0;
	}), `lang:${lang}`];
}
/**
* Builds Ask AI configuration from various input formats.
*/
function buildAskAiConfig(askAiProp, options, lang) {
	const isAskAiString = typeof askAiProp === "string";
	const askAiSearchParameters = !isAskAiString && askAiProp.searchParameters ? { ...askAiProp.searchParameters } : void 0;
	const isAgentStudio = !isAskAiString && askAiProp.agentStudio === true;
	const askAiFacetFilters = mergeLangFacetFilters(askAiSearchParameters?.facetFilters ?? options.searchParameters?.facetFilters, lang);
	const mergedAskAiSearchParameters = isAgentStudio ? askAiSearchParameters : {
		...askAiSearchParameters,
		facetFilters: askAiFacetFilters.length ? askAiFacetFilters : void 0
	};
	const result = {
		...isAskAiString ? {} : askAiProp,
		indexName: isAskAiString ? options.indexName : askAiProp.indexName,
		apiKey: isAskAiString ? options.apiKey : askAiProp.apiKey,
		appId: isAskAiString ? options.appId : askAiProp.appId,
		assistantId: isAskAiString ? askAiProp : askAiProp.assistantId
	};
	if (mergedAskAiSearchParameters && Object.values(mergedAskAiSearchParameters).some((v) => v != null)) result.searchParameters = mergedAskAiSearchParameters;
	return result;
}
/**
* Resolves Algolia search options for the given language,
* merging in locale-specific overrides and language facet filters.
*/
function resolveOptionsForLanguage(options, localeIndex, lang) {
	options = deepMerge(options, options.locales?.[localeIndex] || {});
	const facetFilters = mergeLangFacetFilters(options.searchParameters?.facetFilters, lang);
	const askAi = options.askAi ? buildAskAiConfig(options.askAi, options, lang) : void 0;
	return {
		...options,
		searchParameters: {
			...options.searchParameters,
			facetFilters
		},
		askAi
	};
}
function deepMerge(target, source) {
	const result = { ...target };
	for (const key in source) {
		const value = source[key];
		if (value === void 0) continue;
		if (key === "searchParameters") {
			result[key] = value;
			continue;
		}
		if (isObject$1(value) && isObject$1(result[key])) result[key] = deepMerge(result[key], value);
		else result[key] = value;
	}
	delete result.locales;
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/support/reactivity.js
function smartComputed(getter, comparator = (newValue, oldValue) => JSON.stringify(newValue) === JSON.stringify(oldValue)) {
	return computed((oldValue) => {
		const newValue = getter();
		return oldValue === void 0 || !comparator(newValue, oldValue) ? newValue : oldValue;
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarAskAiButton.vue
var _sfc_main$24 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<button${ssrRenderAttrs(mergeProps({
		type: "button",
		class: "VPNavBarAskAiButton"
	}, _attrs))} data-v-f9872166><span class="vpi-sparkles" aria-hidden="true" data-v-f9872166></span></button>`);
}
var _sfc_setup$30 = _sfc_main$24.setup;
_sfc_main$24.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarAskAiButton.vue");
	return _sfc_setup$30 ? _sfc_setup$30(props, ctx) : void 0;
};
var VPNavBarAskAiButton_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$24, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-f9872166"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue
var _sfc_main$23 = {
	__name: "VPNavBarSearchButton",
	__ssrInlineRender: true,
	props: { text: {
		type: String,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({
				type: "button",
				class: "VPNavBarSearchButton"
			}, _attrs))} data-v-8f3032e2><span class="vpi-search" aria-hidden="true" data-v-8f3032e2></span><span class="text" data-v-8f3032e2>${ssrInterpolate(__props.text)}</span><span class="keys" aria-hidden="true" data-v-8f3032e2><kbd class="key-mod" data-v-8f3032e2></kbd><kbd class="key-k" data-v-8f3032e2></kbd></span></button>`);
		};
	}
};
var _sfc_setup$29 = _sfc_main$23.setup;
_sfc_main$23.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue");
	return _sfc_setup$29 ? _sfc_setup$29(props, ctx) : void 0;
};
var VPNavBarSearchButton_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$23, [["__scopeId", "data-v-8f3032e2"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearch.vue
var _sfc_main$22 = {
	__name: "VPNavBarSearch",
	__ssrInlineRender: true,
	setup(__props) {
		const VPLocalSearchBox = defineAsyncComponent(() => import("./VPLocalSearchBox.uJwFj5sY.js"));
		const VPAlgoliaSearchBox = () => null;
		const { theme, localeIndex, lang } = useData();
		const provider = "local";
		const algoliaOptions = smartComputed(() => {
			return resolveOptionsForLanguage(theme.value.search?.options || {}, localeIndex.value, lang.value);
		});
		const resolvedMode = computed(() => resolveMode(algoliaOptions.value));
		const askAiSidePanelConfig = computed(() => {
			if (!resolvedMode.value.useSidePanel) return null;
			const askAi = algoliaOptions.value.askAi;
			if (!askAi || typeof askAi === "string") return null;
			if (!askAi.sidePanel) return null;
			return askAi.sidePanel === true ? {} : askAi.sidePanel;
		});
		const askAiShortcutEnabled = computed(() => {
			return askAiSidePanelConfig.value?.keyboardShortcuts?.["Ctrl/Cmd+I"] !== false;
		});
		const openRequest = ref(null);
		let openNonce = 0;
		const loaded = ref(false);
		const actuallyLoaded = ref(false);
		onMounted(() => {});
		function loadAndOpen(target) {
			if (!loaded.value) loaded.value = true;
			openRequest.value = {
				target,
				nonce: ++openNonce
			};
		}
		const showSearch = ref(false);
		onKeyStroke("k", (event) => {
			if (event.ctrlKey || event.metaKey) {
				event.preventDefault();
				showSearch.value = true;
			}
		});
		onKeyStroke("/", (event) => {
			if (!isEditingContent(event)) {
				event.preventDefault();
				showSearch.value = true;
			}
		});
		function isEditingContent(event) {
			const element = event.target;
			const tagName = element.tagName;
			return element.isContentEditable || tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA";
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavBarSearch" }, _attrs))} data-v-28aa6e37>`);
			if (unref(provider) === "algolia") {
				_push(`<!--[-->`);
				if (resolvedMode.value.showKeywordSearch) _push(ssrRenderComponent(VPNavBarSearchButton_default, {
					text: unref(algoliaOptions).translations?.button?.buttonText || "Search",
					"aria-label": unref(algoliaOptions).translations?.button?.buttonAriaLabel || "Search",
					"aria-keyshortcuts": "/ control+k meta+k",
					onClick: ($event) => loadAndOpen("search")
				}, null, _parent));
				else _push(`<!---->`);
				if (askAiSidePanelConfig.value) _push(ssrRenderComponent(VPNavBarAskAiButton_default, {
					"aria-label": askAiSidePanelConfig.value.button?.translations?.buttonAriaLabel || "Ask AI",
					"aria-keyshortcuts": askAiShortcutEnabled.value ? "control+i meta+i" : void 0,
					onClick: ($event) => actuallyLoaded.value ? loadAndOpen("toggleAskAi") : loadAndOpen("askAi")
				}, null, _parent));
				else _push(`<!---->`);
				if (loaded.value) _push(ssrRenderComponent(unref(VPAlgoliaSearchBox), {
					"algolia-options": unref(algoliaOptions),
					"open-request": openRequest.value,
					onVnodeBeforeMount: ($event) => actuallyLoaded.value = true
				}, null, _parent));
				else _push(`<!---->`);
				_push(`<!--]-->`);
			} else if (unref(provider) === "local") {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(VPNavBarSearchButton_default, {
					text: unref(algoliaOptions).translations?.button?.buttonText || "Search",
					"aria-label": unref(algoliaOptions).translations?.button?.buttonAriaLabel || "Search",
					"aria-keyshortcuts": "/ control+k meta+k",
					onClick: ($event) => showSearch.value = true
				}, null, _parent));
				if (showSearch.value) _push(ssrRenderComponent(unref(VPLocalSearchBox), { onClose: ($event) => showSearch.value = false }, null, _parent));
				else _push(`<!---->`);
				_push(`<!--]-->`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$28 = _sfc_main$22.setup;
_sfc_main$22.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearch.vue");
	return _sfc_setup$28 ? _sfc_setup$28(props, ctx) : void 0;
};
var VPNavBarSearch_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$22, [["__scopeId", "data-v-28aa6e37"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarTitle.vue
var _sfc_main$21 = {
	__name: "VPNavBarTitle",
	__ssrInlineRender: true,
	setup(__props) {
		const { site, theme } = useData();
		const { hasSidebar } = useLayout();
		const { currentLang } = useLangs();
		const link = computed(() => typeof theme.value.logoLink === "string" ? theme.value.logoLink : theme.value.logoLink?.link);
		const rel = computed(() => typeof theme.value.logoLink === "string" ? void 0 : theme.value.logoLink?.rel);
		const target = computed(() => typeof theme.value.logoLink === "string" ? void 0 : theme.value.logoLink?.target);
		const textTitle = computed(() => {
			if (theme.value.siteTitle === false) return void 0;
			return (theme.value.siteTitle ?? site.value.title).replace(/<[^>]+>/g, "").trim() || void 0;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPNavBarTitle", { "has-sidebar": unref(hasSidebar) }] }, _attrs))} data-v-3c8fee14><a class="title"${ssrRenderAttr("href", link.value ?? unref(normalizeLink$1)(unref(currentLang).link))}${ssrRenderAttr("rel", rel.value)}${ssrRenderAttr("target", target.value)}${ssrRenderAttr("title", textTitle.value)} data-v-3c8fee14>`);
			ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent);
			if (unref(theme).logo) _push(ssrRenderComponent(VPImage_default, {
				class: "logo",
				image: unref(theme).logo
			}, null, _parent));
			else _push(`<!---->`);
			if (unref(theme).siteTitle) _push(`<span data-v-3c8fee14>${unref(theme).siteTitle ?? ""}</span>`);
			else if (unref(theme).siteTitle === void 0) _push(`<span data-v-3c8fee14>${ssrInterpolate(unref(site).title)}</span>`);
			else _push(`<!---->`);
			ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent);
			_push(`</a></div>`);
		};
	}
};
var _sfc_setup$27 = _sfc_main$21.setup;
_sfc_main$21.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBarTitle.vue");
	return _sfc_setup$27 ? _sfc_setup$27(props, ctx) : void 0;
};
var VPNavBarTitle_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$21, [["__scopeId", "data-v-3c8fee14"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavMenuGroup.vue
var _sfc_main$20 = {
	__name: "VPNavMenuGroup",
	__ssrInlineRender: true,
	props: {
		item: {
			type: Object,
			required: true
		},
		screen: {
			type: Boolean,
			required: false
		},
		menu: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const route = useRoute();
		const isActiveGroup = computed(() => {
			if (props.item.activeMatch) return isActive(route.data.relativePath, route.hash, props.item.activeMatch, true);
			return isChildActive(props.item);
		});
		function isChildActive(navItem) {
			if ("component" in navItem) return false;
			if ("link" in navItem) {
				const href = typeof navItem.link === "function" ? navItem.link(route.data) : navItem.link;
				return isActive(route.data.relativePath, route.hash, navItem.activeMatch || href, !!navItem.activeMatch);
			}
			return navItem.items.some(isChildActive);
		}
		const isOpen = ref(false);
		const groupId = useId();
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.menu) _push(ssrRenderComponent(VPMenuGroup_default, mergeProps({
				class: "VPNavMenuGroup",
				text: __props.item.text,
				items: __props.item.items
			}, _attrs), null, _parent));
			else if (!__props.screen) _push(ssrRenderComponent(VPFlyout_default, mergeProps({
				class: {
					VPNavMenuGroup: true,
					VPNavBarMenuGroup: true,
					active: isActiveGroup.value
				},
				button: __props.item.text,
				items: __props.item.items
			}, _attrs), null, _parent));
			else {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPNavMenuGroup VPNavScreenMenuGroup", {
					open: isOpen.value,
					active: isActiveGroup.value
				}] }, _attrs))} data-v-6eb63ead><button type="button" class="button"${ssrRenderAttr("aria-expanded", isOpen.value)}${ssrRenderAttr("aria-controls", unref(groupId))} data-v-6eb63ead><span class="button-text" data-v-6eb63ead>${__props.item.text ?? ""}</span><span class="vpi-plus button-icon" aria-hidden="true" data-v-6eb63ead></span></button><ul${ssrRenderAttr("id", unref(groupId))} class="items" style="${ssrRenderStyle(isOpen.value ? null : { display: "none" })}" data-v-6eb63ead><!--[-->`);
				ssrRenderList(__props.item.items, (child) => {
					_push(`<!--[-->`);
					if ("link" in child) _push(ssrRenderComponent(VPMenuLink_default, { item: child }, null, _parent));
					else if ("component" in child) {
						_push(`<li data-v-6eb63ead>`);
						ssrRenderVNode(_push, createVNode(resolveDynamicComponent(child.component), mergeProps({ ref_for: true }, child.props, { "screen-menu": "" }), null), _parent);
						_push(`</li>`);
					} else _push(ssrRenderComponent(VPMenuGroup_default, {
						text: child.text,
						items: child.items
					}, null, _parent));
					_push(`<!--]-->`);
				});
				_push(`<!--]--></ul></div>`);
			}
		};
	}
};
var _sfc_setup$26 = _sfc_main$20.setup;
_sfc_main$20.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavMenuGroup.vue");
	return _sfc_setup$26 ? _sfc_setup$26(props, ctx) : void 0;
};
var VPNavMenuGroup_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$20, [["__scopeId", "data-v-6eb63ead"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavMenuLink.vue
var _sfc_main$19 = {
	__name: "VPNavMenuLink",
	__ssrInlineRender: true,
	props: {
		item: {
			type: Object,
			required: true
		},
		screen: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { href, isActiveLink, isCurrentLink } = useNavItemLink(() => props.item);
		const nav = inject(navInjectionKey, null);
		function onClick() {
			if (props.screen) nav?.closeScreen();
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$54, mergeProps({
				class: ["VPNavMenuLink", {
					VPNavBarMenuLink: !__props.screen,
					VPNavScreenMenuLink: __props.screen,
					active: unref(isActiveLink)
				}],
				"aria-current": unref(isCurrentLink) ? "page" : void 0,
				href: unref(href),
				target: __props.item.target,
				rel: __props.item.rel,
				"no-icon": __props.item.noIcon,
				onClick
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span data-v-656fa862${_scopeId}>${__props.item.text ?? ""}</span>`);
					else return [createVNode("span", { innerHTML: __props.item.text }, null, 8, ["innerHTML"])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$25 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavMenuLink.vue");
	return _sfc_setup$25 ? _sfc_setup$25(props, ctx) : void 0;
};
var VPNavMenuLink_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$19, [["__scopeId", "data-v-656fa862"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavMenu.vue
var _sfc_main$18 = {
	__name: "VPNavMenu",
	__ssrInlineRender: true,
	props: { screen: {
		type: Boolean,
		required: false
	} },
	setup(__props) {
		const props = __props;
		const { theme } = useData();
		const overflow = props.screen ? null : useNavOverflow();
		function isVisible(index) {
			return !overflow || index < overflow.state.visibleItemCount;
		}
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(theme).nav) {
				_push(`<nav${ssrRenderAttrs(mergeProps({
					"aria-label": unref(theme).navMenuLabel || "Main Navigation",
					class: ["VPNavMenu", __props.screen ? "VPNavScreenMenu" : "VPNavBarMenu"],
					ref: (el) => unref(overflow)?.setMenuEl(el)
				}, _attrs))} data-v-9dd26e1c><ul class="list" data-v-9dd26e1c><!--[-->`);
				ssrRenderList(unref(theme).nav, (item, index) => {
					_push(`<li class="${ssrRenderClass({ collapsed: !isVisible(index) })}" data-v-9dd26e1c>`);
					if ("link" in item) _push(ssrRenderComponent(VPNavMenuLink_default, {
						item,
						screen: __props.screen
					}, null, _parent));
					else if ("component" in item) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { "screen-menu": __props.screen || void 0 }), null), _parent);
					else _push(ssrRenderComponent(VPNavMenuGroup_default, {
						item,
						screen: __props.screen
					}, null, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul></nav>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$24 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavMenu.vue");
	return _sfc_setup$24 ? _sfc_setup$24(props, ctx) : void 0;
};
var VPNavMenu_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$18, [["__scopeId", "data-v-9dd26e1c"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavSocialLinks.vue
var _sfc_main$17 = {
	__name: "VPNavSocialLinks",
	__ssrInlineRender: true,
	props: { screen: {
		type: Boolean,
		required: false
	} },
	setup(__props) {
		const props = __props;
		const { theme } = useData();
		const overflow = props.screen ? null : useNavOverflow();
		const isCollapsed = computed(() => !!overflow && !overflow.state.socialLinks);
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(theme).socialLinks) _push(ssrRenderComponent(VPSocialLinks_default, mergeProps({
				class: ["VPNavSocialLinks", [__props.screen ? "VPNavScreenSocialLinks" : "VPNavBarSocialLinks", { collapsed: isCollapsed.value }]],
				links: unref(theme).socialLinks,
				ref: (inst) => unref(overflow)?.setClusterEl("socialLinks", inst?.$el ?? null)
			}, _attrs), null, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$23 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavSocialLinks.vue");
	return _sfc_setup$23 ? _sfc_setup$23(props, ctx) : void 0;
};
var VPNavSocialLinks_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$17, [["__scopeId", "data-v-2e755ee4"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBar.vue
var _sfc_main$16 = {
	__name: "VPNavBar",
	__ssrInlineRender: true,
	props: { isScreenOpen: {
		type: Boolean,
		required: true
	} },
	emits: ["toggle-screen"],
	setup(__props) {
		const { theme } = useData();
		const { isHome, hasSidebar, hasLocalNav } = useLayout();
		const { y } = useWindowScroll();
		const isTop = computed(() => y.value <= 0);
		provideNavOverflow({ itemsKey: () => JSON.stringify(theme.value.nav ?? null) });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPNavBar", {
				"has-sidebar": unref(hasSidebar),
				"has-local-nav": !unref(isHome) && unref(hasLocalNav),
				"home": unref(isHome),
				"top": isTop.value,
				"screen-open": __props.isScreenOpen
			}] }, _attrs))} data-v-fccb47fe><div class="wrapper" data-v-fccb47fe><div class="container" data-v-fccb47fe><div class="title" data-v-fccb47fe>`);
			_push(ssrRenderComponent(VPNavBarTitle_default, null, {
				"nav-bar-title-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)];
				}),
				"nav-bar-title-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			_push(`</div><div class="content" data-v-fccb47fe><div class="content-body" data-v-fccb47fe>`);
			ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push, _parent);
			_push(ssrRenderComponent(VPNavBarSearch_default, { class: "search" }, null, _parent));
			_push(ssrRenderComponent(VPNavMenu_default, { class: "menu" }, null, _parent));
			_push(ssrRenderComponent(VPNavTranslations_default, { class: "translations" }, null, _parent));
			_push(ssrRenderComponent(VPNavAppearance_default, { class: "appearance" }, null, _parent));
			_push(ssrRenderComponent(VPNavSocialLinks_default, { class: "social-links" }, null, _parent));
			_push(ssrRenderComponent(VPNavBarExtra_default, { class: "extra" }, null, _parent));
			ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push, _parent);
			_push(ssrRenderComponent(VPNavBarHamburger_default, {
				class: "hamburger",
				active: __props.isScreenOpen,
				onClick: ($event) => _ctx.$emit("toggle-screen")
			}, null, _parent));
			_push(`</div></div></div></div><div class="divider" data-v-fccb47fe><div class="divider-line" data-v-fccb47fe></div></div></div>`);
		};
	}
};
var _sfc_setup$22 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavBar.vue");
	return _sfc_setup$22 ? _sfc_setup$22(props, ctx) : void 0;
};
var VPNavBar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$16, [["__scopeId", "data-v-fccb47fe"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavScreen.vue
var _sfc_main$15 = {
	__name: "VPNavScreen",
	__ssrInlineRender: true,
	props: { open: {
		type: Boolean,
		required: true
	} },
	setup(__props) {
		const props = __props;
		useBodyScrollLock();
		provide(navScreenInjectionKey, true);
		const { closeScreen, screenTriggerEl } = useNav();
		onKeyStroke("Escape", () => {
			if (!props.open) return;
			closeScreen();
			screenTriggerEl.value?.focus();
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.open) {
				_push(`<div${ssrRenderAttrs(mergeProps({
					class: "VPNavScreen",
					id: "VPNavScreen"
				}, _attrs))} data-v-8ce02e3d><div class="container" data-v-8ce02e3d>`);
				ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push, _parent);
				_push(ssrRenderComponent(VPNavMenu_default, {
					screen: "",
					class: "menu"
				}, null, _parent));
				_push(ssrRenderComponent(VPNavTranslations_default, {
					screen: "",
					class: "translations"
				}, null, _parent));
				_push(ssrRenderComponent(VPNavAppearance_default, {
					row: "",
					screen: "",
					class: "appearance"
				}, null, _parent));
				_push(ssrRenderComponent(VPNavSocialLinks_default, {
					screen: "",
					class: "social-links"
				}, null, _parent));
				ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push, _parent);
				_push(`</div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$21 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNavScreen.vue");
	return _sfc_setup$21 ? _sfc_setup$21(props, ctx) : void 0;
};
var VPNavScreen_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$15, [["__scopeId", "data-v-8ce02e3d"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNav.vue
var _sfc_main$14 = {
	__name: "VPNav",
	__ssrInlineRender: true,
	setup(__props) {
		const { isScreenOpen, closeScreen, toggleScreen } = useNav();
		const { frontmatter } = useData();
		const hasNavbar = computed(() => {
			return frontmatter.value.navbar !== false;
		});
		provide(navInjectionKey, { closeScreen });
		watchEffect(() => {
			if (inBrowser) document.documentElement.classList.toggle("hide-nav", !hasNavbar.value);
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (hasNavbar.value) {
				_push(`<header${ssrRenderAttrs(mergeProps({ class: "VPNav" }, _attrs))} data-v-29c00ffc>`);
				_push(ssrRenderComponent(VPNavBar_default, {
					"is-screen-open": unref(isScreenOpen),
					onToggleScreen: unref(toggleScreen)
				}, {
					"nav-bar-title-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)];
					}),
					"nav-bar-title-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)];
					}),
					"nav-bar-content-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-content-before", {}, void 0, true)];
					}),
					"nav-bar-content-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-content-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(ssrRenderComponent(VPNavScreen_default, { open: unref(isScreenOpen) }, {
					"nav-screen-content-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-screen-content-before", {}, void 0, true)];
					}),
					"nav-screen-content-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-screen-content-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(`</header>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$20 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPNav.vue");
	return _sfc_setup$20 ? _sfc_setup$20(props, ctx) : void 0;
};
var VPNav_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$14, [["__scopeId", "data-v-29c00ffc"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSidebarItem.vue
var _sfc_main$13 = {
	__name: "VPSidebarItem",
	__ssrInlineRender: true,
	props: {
		item: {
			type: Object,
			required: true
		},
		depth: {
			type: Number,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const { collapsed, collapsible, isLink, isActiveLink, isCurrentLink, hasActiveLink, hasChildren, toggle } = useSidebarItemControl(computed(() => props.item));
		const linkTag = computed(() => isLink.value ? "a" : "div");
		const textTag = computed(() => hasChildren.value && props.depth < 5 ? `h${props.depth + 2}` : "p");
		const sectionTag = computed(() => props.item.text && textTag.value !== "p" ? "section" : "div");
		function onItemClick() {
			!props.item.link && toggle();
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_VPSidebarItem = resolveComponent("VPSidebarItem", true);
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(sectionTag.value), mergeProps({ class: ["VPSidebarItem", [`level-${__props.depth}`, {
				collapsible: unref(collapsible),
				collapsed: unref(collapsed),
				"is-link": unref(isLink),
				"is-active": unref(isActiveLink),
				"has-active": unref(hasActiveLink)
			}]] }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.item.text) {
							_push(`<div class="item" data-v-a3f50340${_scopeId}><div class="indicator" data-v-a3f50340${_scopeId}></div>`);
							if (__props.item.link) _push(ssrRenderComponent(_sfc_main$54, {
								tag: linkTag.value,
								class: "link",
								"aria-current": unref(isCurrentLink) ? "page" : void 0,
								href: __props.item.link,
								rel: __props.item.rel,
								target: __props.item.target
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(textTag.value), { class: "text" }, null), _parent, _scopeId);
									else return [(openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
										class: "text",
										innerHTML: __props.item.text
									}, null, 8, ["innerHTML"]))];
								}),
								_: 1
							}, _parent, _scopeId));
							else ssrRenderVNode(_push, createVNode(resolveDynamicComponent(textTag.value), { class: "text" }, null), _parent, _scopeId);
							if (__props.item.collapsed != null && __props.item.items && __props.item.items.length) _push(`<button type="button" class="caret" aria-label="toggle section"${ssrRenderAttr("aria-expanded", !unref(collapsed))} data-v-a3f50340${_scopeId}><span class="vpi-chevron-right caret-icon" data-v-a3f50340${_scopeId}></span></button>`);
							else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
						if (__props.item.items && __props.item.items.length) {
							_push(`<ul class="items" data-v-a3f50340${_scopeId}>`);
							if (__props.depth < 5) {
								_push(`<li data-v-a3f50340${_scopeId}><!--[-->`);
								ssrRenderList(__props.item.items, (i) => {
									_push(ssrRenderComponent(_component_VPSidebarItem, {
										key: i.text,
										item: i,
										depth: __props.depth + 1
									}, null, _parent, _scopeId));
								});
								_push(`<!--]--></li>`);
							} else _push(`<!---->`);
							_push(`</ul>`);
						} else _push(`<!---->`);
					} else return [__props.item.text ? (openBlock(), createBlock("div", {
						key: 0,
						class: "item",
						onClick: onItemClick
					}, [
						createVNode("div", { class: "indicator" }),
						__props.item.link ? (openBlock(), createBlock(_sfc_main$54, {
							key: 0,
							tag: linkTag.value,
							class: "link",
							"aria-current": unref(isCurrentLink) ? "page" : void 0,
							href: __props.item.link,
							rel: __props.item.rel,
							target: __props.item.target
						}, {
							default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
								class: "text",
								innerHTML: __props.item.text
							}, null, 8, ["innerHTML"]))]),
							_: 1
						}, 8, [
							"tag",
							"aria-current",
							"href",
							"rel",
							"target"
						])) : (openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
							key: 1,
							class: "text",
							innerHTML: __props.item.text
						}, null, 8, ["innerHTML"])),
						__props.item.collapsed != null && __props.item.items && __props.item.items.length ? (openBlock(), createBlock("button", {
							key: 2,
							type: "button",
							class: "caret",
							"aria-label": "toggle section",
							"aria-expanded": !unref(collapsed),
							onClick: withModifiers(unref(toggle), ["stop"])
						}, [createVNode("span", { class: "vpi-chevron-right caret-icon" })], 8, ["aria-expanded", "onClick"])) : createCommentVNode("", true)
					])) : createCommentVNode("", true), __props.item.items && __props.item.items.length ? (openBlock(), createBlock("ul", {
						key: 1,
						class: "items"
					}, [__props.depth < 5 ? (openBlock(), createBlock("li", { key: 0 }, [(openBlock(true), createBlock(Fragment, null, renderList(__props.item.items, (i) => {
						return openBlock(), createBlock(_component_VPSidebarItem, {
							key: i.text,
							item: i,
							depth: __props.depth + 1
						}, null, 8, ["item", "depth"]);
					}), 128))])) : createCommentVNode("", true)])) : createCommentVNode("", true)];
				}),
				_: 1
			}), _parent);
		};
	}
};
var _sfc_setup$19 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSidebarItem.vue");
	return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
var VPSidebarItem_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$13, [["__scopeId", "data-v-a3f50340"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSidebarGroup.vue
var _sfc_main$12 = {
	__name: "VPSidebarGroup",
	__ssrInlineRender: true,
	props: { items: {
		type: Array,
		required: true
	} },
	setup(__props) {
		const disableTransition = ref(true);
		let timer = null;
		onMounted(() => {
			timer = setTimeout(() => {
				timer = null;
				disableTransition.value = false;
			}, 300);
		});
		onBeforeUnmount(() => {
			if (timer != null) {
				clearTimeout(timer);
				timer = null;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(`<div class="${ssrRenderClass([{ "no-transition": disableTransition.value }, "group"])}" data-v-922e8e1a>`);
				_push(ssrRenderComponent(VPSidebarItem_default, {
					item,
					depth: 0
				}, null, _parent));
				_push(`</div>`);
			});
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$18 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSidebarGroup.vue");
	return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
var VPSidebarGroup_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$12, [["__scopeId", "data-v-922e8e1a"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSidebar.vue
var _sfc_main$11 = {
	__name: "VPSidebar",
	__ssrInlineRender: true,
	props: { open: {
		type: Boolean,
		required: true
	} },
	setup(__props) {
		const { sidebarGroups, hasSidebar } = useLayout();
		const props = __props;
		const navEl = useTemplateRef("navEl");
		const isLocked = useBodyScrollLock();
		watch([() => props.open, navEl], () => {
			if (props.open) {
				isLocked.value = true;
				navEl.value?.focus();
			} else isLocked.value = false;
		}, {
			immediate: true,
			flush: "post"
		});
		const key = ref(0);
		watch(sidebarGroups, () => {
			key.value += 1;
		}, { deep: true });
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(hasSidebar)) {
				_push(`<aside${ssrRenderAttrs(mergeProps({
					class: ["VPSidebar", { open: __props.open }],
					ref_key: "navEl",
					ref: navEl
				}, _attrs))} data-v-5ab2591c><div class="curtain" data-v-5ab2591c></div><nav class="nav" id="VPSidebarNav" aria-labelledby="sidebar-aria-label" tabindex="-1" data-v-5ab2591c><span class="visually-hidden" id="sidebar-aria-label" data-v-5ab2591c> Sidebar Navigation </span>`);
				ssrRenderSlot(_ctx.$slots, "sidebar-nav-before", {}, null, _push, _parent);
				_push(ssrRenderComponent(VPSidebarGroup_default, {
					items: unref(sidebarGroups),
					key: key.value
				}, null, _parent));
				ssrRenderSlot(_ctx.$slots, "sidebar-nav-after", {}, null, _push, _parent);
				_push(`</nav></aside>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$17 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSidebar.vue");
	return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
var VPSidebar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$11, [["__scopeId", "data-v-5ab2591c"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSkipLink.vue
var _sfc_main$10 = {
	__name: "VPSkipLink",
	__ssrInlineRender: true,
	props: { inert: {
		type: Boolean,
		required: false
	} },
	setup(__props) {
		const { theme } = useData();
		const route = useRoute();
		const backToTop = useTemplateRef("backToTop");
		watch(() => route.path, () => backToTop.value?.focus());
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><span tabindex="-1" data-v-a344c18b></span><a href="#VPContent" class="VPSkipLink visually-hidden"${ssrIncludeBooleanAttr(__props.inert) ? " inert" : ""} data-v-a344c18b>${ssrInterpolate(unref(theme).skipToContentLabel || "Skip to content")}</a><!--]-->`);
		};
	}
};
var _sfc_setup$16 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSkipLink.vue");
	return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
var VPSkipLink_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$10, [["__scopeId", "data-v-a344c18b"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/Layout.vue
var _sfc_main$9 = {
	__name: "Layout",
	__ssrInlineRender: true,
	setup(__props) {
		const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebarControl();
		const { isScreenOpen } = useNav();
		registerWatchers({ closeSidebar });
		const { frontmatter, theme } = useData();
		const slots = useSlots();
		const heroImageSlotExists = computed(() => !!slots["home-hero-image"]);
		provide(layoutInfoInjectionKey, { heroImageSlotExists });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Content = resolveComponent("Content");
			if (unref(frontmatter).layout !== false) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: ["Layout", [unref(frontmatter).pageClass, unref(theme).gradedContainers && "vp-graded-containers"]] }, _attrs))} data-v-9f9594e0>`);
				ssrRenderSlot(_ctx.$slots, "layout-top", {}, null, _push, _parent);
				_push(ssrRenderComponent(VPSkipLink_default, { inert: unref(isScreenOpen) }, null, _parent));
				_push(ssrRenderComponent(VPBackdrop_default, {
					class: "backdrop",
					show: unref(isSidebarOpen),
					onClick: unref(closeSidebar)
				}, null, _parent));
				_push(ssrRenderComponent(VPNav_default, null, {
					"nav-bar-title-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)];
					}),
					"nav-bar-title-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)];
					}),
					"nav-bar-content-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-content-before", {}, void 0, true)];
					}),
					"nav-bar-content-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-content-after", {}, void 0, true)];
					}),
					"nav-screen-content-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-screen-content-before", {}, void 0, true)];
					}),
					"nav-screen-content-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-screen-content-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(ssrRenderComponent(VPLocalNav_default, {
					open: unref(isSidebarOpen),
					onOpenMenu: unref(openSidebar),
					inert: unref(isScreenOpen)
				}, null, _parent));
				_push(ssrRenderComponent(VPSidebar_default, {
					open: unref(isSidebarOpen),
					inert: unref(isScreenOpen)
				}, {
					"sidebar-nav-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "sidebar-nav-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "sidebar-nav-before", {}, void 0, true)];
					}),
					"sidebar-nav-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "sidebar-nav-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "sidebar-nav-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(ssrRenderComponent(VPContent_default, { inert: unref(isScreenOpen) }, {
					"page-top": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "page-top", {}, void 0, true)];
					}),
					"page-bottom": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "page-bottom", {}, void 0, true)];
					}),
					"not-found": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "not-found", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "not-found", {}, void 0, true)];
					}),
					"home-hero-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-before", {}, void 0, true)];
					}),
					"home-hero-info-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)];
					}),
					"home-hero-info": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)];
					}),
					"home-hero-info-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)];
					}),
					"home-hero-actions-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)];
					}),
					"home-hero-actions-before-actions": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, void 0, true)];
					}),
					"home-hero-image": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)];
					}),
					"home-hero-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-after", {}, void 0, true)];
					}),
					"home-features-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-features-before", {}, void 0, true)];
					}),
					"home-features-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-features-after", {}, void 0, true)];
					}),
					"doc-footer-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)];
					}),
					"doc-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-before", {}, void 0, true)];
					}),
					"doc-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-after", {}, void 0, true)];
					}),
					"doc-top": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-top", {}, void 0, true)];
					}),
					"doc-bottom": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-bottom", {}, void 0, true)];
					}),
					"aside-top": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)];
					}),
					"aside-bottom": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)];
					}),
					"aside-outline-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)];
					}),
					"aside-outline-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)];
					}),
					"aside-ads-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)];
					}),
					"aside-ads-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(ssrRenderComponent(VPFooter_default, { inert: unref(isScreenOpen) }, null, _parent));
				ssrRenderSlot(_ctx.$slots, "layout-bottom", {}, null, _push, _parent);
				_push(`</div>`);
			} else _push(ssrRenderComponent(_component_Content, _attrs, null, _parent));
		};
	}
};
var _sfc_setup$15 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/Layout.vue");
	return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
var Layout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$9, [["__scopeId", "data-v-9f9594e0"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/composables/sponsor-grid.js
/**
* Defines grid configuration for each sponsor size in tuple.
*
* [Screen width (rem), Column size]
*
* It sets grid size on matching screen size. For example, `[48, 5]` will
* set 5 columns when the screen is at least 48rem wide.
*
* Column will set only when item size is bigger than the column size. For
* example, even we define 5 columns, if we only have 1 sponsor yet, we would
* like to show it in 1 column to make it stand out.
*/
var GridSettings = {
	xmini: [[0, 2]],
	mini: [],
	small: [
		[57.5, 6],
		[48, 5],
		[40, 4],
		[30, 3],
		[0, 2]
	],
	medium: [
		[60, 5],
		[52, 4],
		[40, 3],
		[30, 2]
	],
	big: [[52, 3], [40, 2]]
};
function useSponsorsGrid({ el, size = "medium" }) {
	const onResize = throttleAndDebounce(manage, 100);
	onMounted(() => {
		manage();
		window.addEventListener("resize", onResize);
	});
	onUnmounted(() => {
		window.removeEventListener("resize", onResize);
	});
	function manage() {
		if (el.value) adjustSlots(el.value, size);
	}
}
function adjustSlots(el, size) {
	const tsize = el.children.length;
	const asize = el.querySelectorAll(".vp-sponsor-grid-item:not(.empty)").length;
	manageSlots(el, setGrid(el, size, asize), tsize, asize);
}
function setGrid(el, size, items) {
	const settings = GridSettings[size];
	let grid = 1;
	settings.some(([breakpoint, value]) => {
		if (window.matchMedia(`(min-width: ${breakpoint}rem)`).matches) {
			grid = items < value ? items : value;
			return true;
		}
	});
	setGridData(el, grid);
	return grid;
}
function setGridData(el, value) {
	el.dataset.vpGrid = String(value);
}
function manageSlots(el, grid, tsize, asize) {
	const diff = tsize - asize;
	const rem = asize % grid;
	neutralizeSlots(el, (rem === 0 ? rem : grid - rem) - diff);
}
function neutralizeSlots(el, count) {
	if (count === 0) return;
	count > 0 ? addSlots(el, count) : removeSlots(el, count * -1);
}
function addSlots(el, count) {
	for (let i = 0; i < count; i++) {
		const slot = document.createElement("div");
		slot.classList.add("vp-sponsor-grid-item", "empty");
		el.append(slot);
	}
}
function removeSlots(el, count) {
	for (let i = 0; i < count; i++) el.removeChild(el.lastElementChild);
}
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSponsorsGrid.vue
var _sfc_main$8 = {
	__name: "VPSponsorsGrid",
	__ssrInlineRender: true,
	props: {
		size: {
			type: String,
			required: false,
			default: "medium"
		},
		data: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const el = useTemplateRef("el");
		useSponsorsGrid({
			el,
			size: props.size
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<ul${ssrRenderAttrs(mergeProps({
				class: ["VPSponsorsGrid vp-sponsor-grid", [__props.size]],
				ref_key: "el",
				ref: el
			}, _attrs))}><!--[-->`);
			ssrRenderList(__props.data, (sponsor) => {
				_push(`<li class="vp-sponsor-grid-item"><a class="vp-sponsor-grid-link"${ssrRenderAttr("href", sponsor.url)} target="_blank" rel="sponsored noopener"><article class="vp-sponsor-grid-box"><img class="vp-sponsor-grid-image"${ssrRenderAttr("src", sponsor.img)}${ssrRenderAttr("alt", sponsor.name)}></article></a></li>`);
			});
			_push(`<!--]--></ul>`);
		};
	}
};
var _sfc_setup$14 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSponsorsGrid.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSponsors.vue
var _sfc_main$7 = {
	__name: "VPSponsors",
	__ssrInlineRender: true,
	props: {
		mode: {
			type: String,
			required: false,
			default: "normal"
		},
		tier: {
			type: String,
			required: false
		},
		size: {
			type: String,
			required: false
		},
		data: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const sponsors = computed(() => {
			if (props.data.some((s) => {
				return "items" in s;
			})) return props.data;
			return [{
				tier: props.tier,
				size: props.size,
				items: props.data
			}];
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPSponsors vp-sponsor", [__props.mode]] }, _attrs))}><!--[-->`);
			ssrRenderList(sponsors.value, (sponsor, index) => {
				_push(`<section class="vp-sponsor-section">`);
				if (sponsor.tier) _push(`<h3 class="vp-sponsor-tier">${ssrInterpolate(sponsor.tier)}</h3>`);
				else _push(`<!---->`);
				_push(ssrRenderComponent(_sfc_main$8, {
					size: sponsor.size,
					data: sponsor.items
				}, null, _parent));
				_push(`</section>`);
			});
			_push(`<!--]--></div>`);
		};
	}
};
var _sfc_setup$13 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPSponsors.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue
var _sfc_main$6 = {
	__name: "VPDocAsideSponsors",
	__ssrInlineRender: true,
	props: {
		tier: {
			type: String,
			required: false
		},
		size: {
			type: String,
			required: false
		},
		data: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAsideSponsors" }, _attrs))}>`);
			_push(ssrRenderComponent(_sfc_main$7, {
				mode: "aside",
				tier: __props.tier,
				size: __props.size,
				data: __props.data
			}, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$12 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue
var _sfc_main$5 = {
	__name: "VPHomeSponsors",
	__ssrInlineRender: true,
	props: {
		message: {
			type: String,
			required: false
		},
		actionText: {
			type: String,
			required: false,
			default: "Become a sponsor"
		},
		actionLink: {
			type: String,
			required: false
		},
		data: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "VPHomeSponsors" }, _attrs))} data-v-e00fa16b><div class="container" data-v-e00fa16b><div class="header" data-v-e00fa16b><div class="love" data-v-e00fa16b><span class="vpi-heart icon" data-v-e00fa16b></span></div>`);
			if (__props.message) _push(`<h2 class="message" data-v-e00fa16b>${ssrInterpolate(__props.message)}</h2>`);
			else _push(`<!---->`);
			_push(`</div><div class="sponsors" data-v-e00fa16b>`);
			_push(ssrRenderComponent(_sfc_main$7, { data: __props.data }, null, _parent));
			_push(`</div>`);
			if (__props.actionLink) {
				_push(`<div class="action" data-v-e00fa16b>`);
				_push(ssrRenderComponent(VPButton_default, {
					theme: "sponsor",
					text: __props.actionText,
					href: __props.actionLink
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></section>`);
		};
	}
};
var _sfc_setup$11 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamMembersItem.vue
var _sfc_main$4 = {
	__name: "VPTeamMembersItem",
	__ssrInlineRender: true,
	props: {
		size: {
			type: String,
			required: false,
			default: "medium"
		},
		member: {
			type: Object,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<article${ssrRenderAttrs(mergeProps({ class: ["VPTeamMembersItem", [__props.size]] }, _attrs))} data-v-c827aa75><div class="profile" data-v-c827aa75><figure class="avatar" data-v-c827aa75><img class="avatar-img"${ssrRenderAttr("src", __props.member.avatar)}${ssrRenderAttr("alt", __props.member.name)} data-v-c827aa75></figure><div class="data" data-v-c827aa75><h1 class="name" data-v-c827aa75>${ssrInterpolate(__props.member.name)}</h1>`);
			if (__props.member.title || __props.member.org) {
				_push(`<p class="affiliation" data-v-c827aa75>`);
				if (__props.member.title) _push(`<span class="title" data-v-c827aa75>${ssrInterpolate(__props.member.title)}</span>`);
				else _push(`<!---->`);
				if (__props.member.title && __props.member.org) _push(`<span class="at" data-v-c827aa75> @ </span>`);
				else _push(`<!---->`);
				if (__props.member.org) _push(ssrRenderComponent(_sfc_main$54, {
					class: ["org", { link: __props.member.orgLink }],
					href: __props.member.orgLink,
					"no-icon": ""
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(__props.member.org)}`);
						else return [createTextVNode(toDisplayString(__props.member.org), 1)];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				_push(`</p>`);
			} else _push(`<!---->`);
			if (__props.member.desc) _push(`<p class="desc" data-v-c827aa75>${__props.member.desc ?? ""}</p>`);
			else _push(`<!---->`);
			if (__props.member.links) {
				_push(`<div class="links" data-v-c827aa75>`);
				_push(ssrRenderComponent(VPSocialLinks_default, {
					links: __props.member.links,
					me: false
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
			if (__props.member.sponsor) {
				_push(`<div class="sp" data-v-c827aa75>`);
				_push(ssrRenderComponent(_sfc_main$54, {
					class: "sp-link",
					href: __props.member.sponsor,
					"no-icon": ""
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span class="vpi-heart sp-icon" data-v-c827aa75${_scopeId}></span> ${ssrInterpolate(__props.member.actionText || "Sponsor")}`);
						else return [createVNode("span", { class: "vpi-heart sp-icon" }), createTextVNode(" " + toDisplayString(__props.member.actionText || "Sponsor"), 1)];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</article>`);
		};
	}
};
var _sfc_setup$10 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamMembersItem.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var VPTeamMembersItem_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-c827aa75"]]);
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue
var _sfc_main$3 = {
	__name: "VPTeamMembers",
	__ssrInlineRender: true,
	props: {
		size: {
			type: String,
			required: false,
			default: "medium"
		},
		members: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPTeamMembers", [__props.size, `count-${__props.members.length}`]] }, _attrs))} data-v-c5ce60bf><ul class="container" data-v-c5ce60bf><!--[-->`);
			ssrRenderList(__props.members, (member) => {
				_push(`<li class="item" data-v-c5ce60bf>`);
				_push(ssrRenderComponent(VPTeamMembersItem_default, {
					size: __props.size,
					member
				}, null, _parent));
				_push(`</li>`);
			});
			_push(`<!--]--></ul></div>`);
		};
	}
};
var _sfc_setup$9 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue
var _sfc_main$2 = {};
var _sfc_setup$8 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue
var _sfc_main$1 = {};
var _sfc_setup$7 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue
var _sfc_main = {};
var _sfc_setup$6 = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/theme-default/without-fonts.js
var theme = {
	Layout: Layout_default,
	enhanceApp: ({ app }) => {
		app.component("Badge", _sfc_main$62);
	}
};
//#endregion
//#region components/demos/registry.ts
/**
* The demo shown on the catalog card for each component. Typing this as a
* complete record means a component added to the catalog cannot silently miss
* its preview.
*/
var componentDemos = {
	"avatar": avatarSizes,
	"avatar-group": avatarGroupBasic,
	"badge": badgeColors,
	"banner": bannerStatuses,
	"blockquote": blockquoteCite,
	"breadcrumbs": breadcrumbsBasic,
	"button": buttonVariants,
	"button-group": buttonGroupBasic,
	"context-menu": contextMenuOverview,
	"dropdown-menu": dropdownMenuOverview,
	"more-menu": moreMenuOverview,
	"toggle-button": toggleButtonBasic,
	"card": cardBasic,
	"center": centerBasic,
	"code": codeBasic,
	"collapsible": collapsibleBasic,
	"checkbox-indicator": checkboxIndicatorOverview,
	"checkbox-input": checkboxInputBasic,
	"dialog": dialogOverview,
	"divider": dividerOverview,
	"empty-state": emptyStateBasic,
	"field": fieldCustom,
	"segmented-control": segmentedControlBasic,
	"grid": gridBasic,
	"overlay": overlayBasic,
	"heading": headingLevels,
	"icon-button": iconButtonActionBar,
	"kbd": kbdBasic,
	"link": linkColors,
	"list": listBasic,
	"popover": popoverOverview,
	"progress-bar": progressBarBasic,
	"radio": radioBasic,
	"radio-group": radioBasic,
	"radio-list": radioList,
	"skeleton": skeletonProfile,
	"slider": sliderBasic,
	"spinner": spinnerBasic,
	"stack": stackDirections,
	"status-dot": statusDotVariants,
	"hover-card": hoverCardOverview,
	"switch": switchBasic,
	"tab-list": tabListBasic,
	"text": textTypes,
	"text-area": textAreaBasic,
	"text-input": textInputBasic,
	"toast": toastPreview,
	"alert-dialog": alertDialogOverview,
	"bottom-sheet": bottomSheetOverview,
	"tooltip": tooltipOverview,
	"visually-hidden": visuallyHiddenContext
};
//#endregion
//#region components/demo-infra/componentCatalog.ts
/**
* The order groups appear in, both in the component sidebar and on the catalog
* page.
*/
var COMPONENT_GROUPS = [
	"action",
	"form",
	"layout",
	"content",
	"navigation",
	"feedback",
	"overlays",
	"utilities"
];
var GROUP_TITLES = {
	en: {
		action: "Action",
		form: "Form controls",
		layout: "Layout",
		content: "Content",
		navigation: "Component navigation",
		feedback: "Feedback & Status",
		overlays: "Overlays",
		utilities: "Utilities"
	},
	zh: {
		action: "操作",
		form: "表单",
		layout: "布局",
		content: "内容",
		navigation: "组件导航",
		feedback: "反馈与状态",
		overlays: "浮层",
		utilities: "工具"
	}
};
/**
* Every documented component. This is the single source of truth for the
* sidebar, the catalog page, and the route parser, so a new component only has
* to be added here once.
*/
var COMPONENT_CATALOG = [
	{
		slug: "button",
		group: "action",
		en: "Button",
		zh: "按钮"
	},
	{
		slug: "button-group",
		group: "action",
		en: "Button Group",
		zh: "按钮组"
	},
	{
		slug: "icon-button",
		group: "action",
		en: "Icon Button",
		zh: "纯图标按钮"
	},
	{
		slug: "dropdown-menu",
		group: "action",
		en: "Dropdown Menu",
		zh: "下拉菜单"
	},
	{
		slug: "context-menu",
		group: "action",
		en: "Context Menu",
		zh: "上下文菜单"
	},
	{
		slug: "more-menu",
		group: "action",
		en: "More Menu",
		zh: "更多菜单"
	},
	{
		slug: "toggle-button",
		group: "action",
		en: "Toggle Button",
		zh: "切换按钮"
	},
	{
		slug: "text-input",
		group: "form",
		en: "Text Input",
		zh: "文本输入框"
	},
	{
		slug: "text-area",
		group: "form",
		en: "Text Area",
		zh: "文本域"
	},
	{
		slug: "checkbox-input",
		group: "form",
		en: "Checkbox Input",
		zh: "复选框"
	},
	{
		slug: "checkbox-indicator",
		group: "form",
		en: "Checkbox Indicator",
		zh: "复选指示器"
	},
	{
		slug: "progress-bar",
		group: "form",
		en: "Progress Bar",
		zh: "进度条"
	},
	{
		slug: "radio",
		group: "form",
		en: "Radio",
		zh: "单选按钮"
	},
	{
		slug: "radio-group",
		group: "form",
		en: "Radio Group",
		zh: "单选组"
	},
	{
		slug: "radio-list",
		group: "form",
		en: "Radio List",
		zh: "单选列表"
	},
	{
		slug: "switch",
		group: "form",
		en: "Switch",
		zh: "开关"
	},
	{
		slug: "slider",
		group: "form",
		en: "Slider",
		zh: "滑块"
	},
	{
		slug: "field",
		group: "form",
		en: "Field",
		zh: "表单字段"
	},
	{
		slug: "segmented-control",
		group: "form",
		en: "Segmented Control",
		zh: "分段控件"
	},
	{
		slug: "stack",
		group: "layout",
		en: "Stack",
		zh: "堆叠布局"
	},
	{
		slug: "divider",
		group: "layout",
		en: "Divider",
		zh: "分隔线"
	},
	{
		slug: "center",
		group: "layout",
		en: "Center",
		zh: "居中容器"
	},
	{
		slug: "grid",
		group: "layout",
		en: "Grid",
		zh: "网格布局"
	},
	{
		slug: "card",
		group: "layout",
		en: "Card",
		zh: "卡片"
	},
	{
		slug: "overlay",
		group: "layout",
		en: "Overlay",
		zh: "覆盖层"
	},
	{
		slug: "avatar",
		group: "content",
		en: "Avatar",
		zh: "头像"
	},
	{
		slug: "avatar-group",
		group: "content",
		en: "Avatar Group",
		zh: "头像组"
	},
	{
		slug: "blockquote",
		group: "content",
		en: "Blockquote",
		zh: "引用"
	},
	{
		slug: "heading",
		group: "content",
		en: "Heading",
		zh: "标题"
	},
	{
		slug: "text",
		group: "content",
		en: "Text",
		zh: "文本"
	},
	{
		slug: "kbd",
		group: "content",
		en: "Kbd",
		zh: "快捷键"
	},
	{
		slug: "list",
		group: "content",
		en: "List",
		zh: "列表"
	},
	{
		slug: "code",
		group: "content",
		en: "Code",
		zh: "代码"
	},
	{
		slug: "collapsible",
		group: "content",
		en: "Collapsible",
		zh: "折叠面板"
	},
	{
		slug: "link",
		group: "navigation",
		en: "Link",
		zh: "链接"
	},
	{
		slug: "breadcrumbs",
		group: "navigation",
		en: "Breadcrumbs",
		zh: "面包屑"
	},
	{
		slug: "tab-list",
		group: "navigation",
		en: "Tab List",
		zh: "标签列表"
	},
	{
		slug: "banner",
		group: "feedback",
		en: "Banner",
		zh: "提示条"
	},
	{
		slug: "badge",
		group: "feedback",
		en: "Badge",
		zh: "标签"
	},
	{
		slug: "skeleton",
		group: "feedback",
		en: "Skeleton",
		zh: "骨架屏"
	},
	{
		slug: "spinner",
		group: "feedback",
		en: "Spinner",
		zh: "加载态"
	},
	{
		slug: "status-dot",
		group: "feedback",
		en: "Status Dot",
		zh: "状态点"
	},
	{
		slug: "empty-state",
		group: "feedback",
		en: "Empty State",
		zh: "空状态"
	},
	{
		slug: "tooltip",
		group: "overlays",
		en: "Tooltip",
		zh: "提示框"
	},
	{
		slug: "popover",
		group: "overlays",
		en: "Popover",
		zh: "弹出层"
	},
	{
		slug: "dialog",
		group: "overlays",
		en: "Dialog",
		zh: "对话框"
	},
	{
		slug: "toast",
		group: "overlays",
		en: "Toast",
		zh: "轻提示"
	},
	{
		slug: "hover-card",
		group: "overlays",
		en: "Hover Card",
		zh: "悬浮卡片"
	},
	{
		slug: "alert-dialog",
		group: "overlays",
		en: "Alert Dialog",
		zh: "警告对话框"
	},
	{
		slug: "bottom-sheet",
		group: "overlays",
		en: "Bottom Sheet",
		zh: "底部弹窗"
	},
	{
		slug: "visually-hidden",
		group: "utilities",
		en: "Visually Hidden",
		zh: "视觉隐藏"
	}
];
var COMPONENT_SLUGS = COMPONENT_CATALOG.map((entry) => entry.slug);
function isComponentSlug(value) {
	return COMPONENT_SLUGS.includes(value);
}
function componentName(locale, slug) {
	const entry = COMPONENT_CATALOG.find((item) => item.slug === slug);
	return entry === void 0 ? slug : entry[locale];
}
/**
* The catalog split into the groups it displays, in display order. Empty groups
* are dropped.
*/
function catalogGroups(locale) {
	return COMPONENT_GROUPS.map((group) => ({
		title: GROUP_TITLES[locale][group],
		entries: COMPONENT_CATALOG.filter((entry) => entry.group === group)
	})).filter((group) => group.entries.length > 0);
}
//#endregion
//#region components/demo-infra/docs-i18n.ts
function localePath(locale, path) {
	return locale === "en" ? `/en${path}` : path;
}
//#endregion
//#region components/demo-infra/VueDemoHost.vue?vue&type=script&setup=true&lang.ts
var VueDemoHost_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "VueDemoHost",
	__ssrInlineRender: true,
	props: {
		className: {},
		component: {},
		dataKind: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: __props.className,
				"data-kind": __props.dataKind
			}, _attrs))}>`);
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.component), null, null), _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demo-infra/VueDemoHost.vue
var _sfc_setup$5 = VueDemoHost_vue_vue_type_script_setup_true_lang_default.setup;
VueDemoHost_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demo-infra/VueDemoHost.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var VueDemoHost_default = VueDemoHost_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demo-infra/ComponentsOverview.vue?vue&type=script&setup=true&lang.ts
var ComponentsOverview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ComponentsOverview",
	__ssrInlineRender: true,
	props: { locale: {} },
	setup(__props) {
		const props = __props;
		const groups = computed(() => catalogGroups(props.locale).map((group) => ({
			title: group.title,
			cards: group.entries.map((entry) => ({
				demo: componentDemos[entry.slug],
				name: entry[props.locale],
				slug: entry.slug
			}))
		})));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "component-overview__content" }, _attrs))}><header class="component-overview__header"><h1>${ssrInterpolate(__props.locale === "en" ? "Browse components" : "浏览组件库")}</h1><p>${ssrInterpolate(__props.locale === "en" ? "Find astryx-vue components by purpose and explore their states and variants." : "按用途查找 astryx-vue 组件，并查看各个状态与变体。")}</p></header><!--[-->`);
			ssrRenderList(groups.value, (group, index) => {
				_push(`<section class="component-overview__catalog"${ssrRenderAttr("aria-labelledby", `${__props.locale}-group-${index}`)}><h2${ssrRenderAttr("id", `${__props.locale}-group-${index}`)}>${ssrInterpolate(group.title)}</h2><div class="component-overview__grid"><!--[-->`);
				ssrRenderList(group.cards, (card) => {
					_push(`<article class="component-card"><div aria-hidden="true" class="component-card__preview" inert>`);
					_push(ssrRenderComponent(VueDemoHost_default, {
						"class-name": card.demo.className,
						component: card.demo.component,
						"data-kind": card.demo.dataKind
					}, null, _parent));
					_push(`</div><a class="component-card__name"${ssrRenderAttr("href", unref(localePath)(__props.locale, `/components/${card.slug}`))}>${ssrInterpolate(card.name)}</a></article>`);
				});
				_push(`<!--]--></div></section>`);
			});
			_push(`<!--]--></div>`);
		};
	}
});
//#endregion
//#region components/demo-infra/ComponentsOverview.vue
var _sfc_setup$4 = ComponentsOverview_vue_vue_type_script_setup_true_lang_default.setup;
ComponentsOverview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demo-infra/ComponentsOverview.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var ComponentsOverview_default = ComponentsOverview_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demo-infra/ComponentExample.vue?vue&type=script&setup=true&lang.ts
var ComponentExample_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ComponentExample",
	__ssrInlineRender: true,
	props: {
		codeHtml: {},
		description: {},
		locale: {},
		title: {}
	},
	setup(__props) {
		const props = __props;
		const activeTab = ref("description");
		const panelId = useId();
		const text = computed(() => props.locale === "en" ? {
			code: "Code",
			description: "Description",
			exampleContent: "example content"
		} : {
			code: "代码",
			description: "描述",
			exampleContent: "示例内容"
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "component-example" }, _attrs))}><h3>${ssrInterpolate(__props.title)}</h3><div class="component-example__preview">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div><div class="component-example__details"><div class="component-example__tabs" role="tablist"${ssrRenderAttr("aria-label", `${__props.title} ${text.value.exampleContent}`)}><button${ssrRenderAttr("id", `${unref(panelId)}-description`)}${ssrRenderAttr("aria-controls", unref(panelId))}${ssrRenderAttr("aria-selected", activeTab.value === "description")} role="tab" type="button">${ssrInterpolate(text.value.description)}</button><button${ssrRenderAttr("id", `${unref(panelId)}-code`)}${ssrRenderAttr("aria-controls", unref(panelId))}${ssrRenderAttr("aria-selected", activeTab.value === "code")} role="tab" type="button">${ssrInterpolate(text.value.code)}</button></div><div${ssrRenderAttr("id", unref(panelId))} class="component-example__panel" role="tabpanel"${ssrRenderAttr("aria-labelledby", `${unref(panelId)}-${activeTab.value}`)}>`);
			if (activeTab.value === "description") _push(`<p>${ssrInterpolate(__props.description)}</p>`);
			else _push(`<div class="component-example__codeblock">${__props.codeHtml ?? ""}</div>`);
			_push(`</div></div></section>`);
		};
	}
});
//#endregion
//#region components/demo-infra/ComponentExample.vue
var _sfc_setup$3 = ComponentExample_vue_vue_type_script_setup_true_lang_default.setup;
ComponentExample_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demo-infra/ComponentExample.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var ComponentExample_default = ComponentExample_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demo-infra/DemoExample.vue?vue&type=script&setup=true&lang.ts
var DemoExample_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "DemoExample",
	__ssrInlineRender: true,
	props: {
		demo: {},
		description: {},
		locale: {},
		title: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(ComponentExample_default, mergeProps({
				"code-html": __props.demo.sourceHtml,
				description: __props.description,
				locale: __props.locale,
				title: __props.title
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(VueDemoHost_default, {
						"class-name": __props.demo.className,
						component: __props.demo.component,
						"data-kind": __props.demo.dataKind
					}, null, _parent, _scopeId));
					else return [createVNode(VueDemoHost_default, {
						"class-name": __props.demo.className,
						component: __props.demo.component,
						"data-kind": __props.demo.dataKind
					}, null, 8, [
						"class-name",
						"component",
						"data-kind"
					])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/demo-infra/DemoExample.vue
var _sfc_setup$2 = DemoExample_vue_vue_type_script_setup_true_lang_default.setup;
DemoExample_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demo-infra/DemoExample.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var DemoExample_default = DemoExample_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demo-infra/componentDocsRoute.ts
var componentDocsCopy = {
	en: {
		catalogTitle: "Components",
		documentation: "documentation",
		navigation: "Component navigation",
		overview: "Overview",
		props: "Props"
	},
	zh: {
		catalogTitle: "组件",
		documentation: "文档",
		navigation: "组件导航",
		overview: "总览",
		props: "属性"
	}
};
function normalizeDocsPathname(pathname) {
	return pathname.replace(/\.html$/i, "").replace(/\/index$/i, "").replace(/\/+$/, "") || "/";
}
function parseComponentDocsRoute(pathname) {
	const trimmed = normalizeDocsPathname(pathname);
	let locale = "zh";
	let path = trimmed;
	if (path === "/en" || path.startsWith("/en/")) {
		locale = "en";
		path = path.slice(3) || "/";
	}
	if (path === "/components") return {
		kind: "catalog",
		locale
	};
	const segments = path.split("/").filter(Boolean);
	if (segments[0] !== "components" || segments.length < 2 || segments.length > 3) return null;
	const slug = segments[1];
	if (!isComponentSlug(slug)) return null;
	if (segments.length === 3 && segments[2] !== "props") return null;
	return {
		kind: "detail",
		locale,
		name: componentName(locale, slug),
		slug,
		tab: segments.length === 3 ? "props" : "overview"
	};
}
//#endregion
//#region components/demo-infra/ComponentDocsShell.vue?vue&type=script&setup=true&lang.ts
var ComponentDocsShell_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ComponentDocsShell",
	__ssrInlineRender: true,
	props: { route: {} },
	setup(__props) {
		const props = __props;
		const text = computed(() => componentDocsCopy[props.route.locale]);
		const groups = computed(() => catalogGroups(props.route.locale).map((group) => ({
			title: group.title,
			slugs: group.entries.map((entry) => entry.slug)
		})));
		const names = computed(() => Object.fromEntries(COMPONENT_CATALOG.map((entry) => [entry.slug, entry[props.route.locale]])));
		function path(value) {
			return localePath(props.route.locale, value);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<main${ssrRenderAttrs(mergeProps({ class: ["component-overview", [{ "component-detail": __props.route.kind === "detail" }]] }, _attrs))}><aside class="component-overview__sidebar"${ssrRenderAttr("aria-label", text.value.navigation)}><nav class="component-overview__nav"${ssrRenderAttr("aria-label", text.value.navigation)}><a${ssrRenderAttr("aria-current", __props.route.kind === "catalog" ? "page" : void 0)}${ssrRenderAttr("href", path("/components/"))}>${ssrInterpolate(text.value.overview)}</a><!--[-->`);
			ssrRenderList(groups.value, (group) => {
				_push(`<!--[--><p>${ssrInterpolate(group.title)}</p><!--[-->`);
				ssrRenderList(group.slugs, (slug) => {
					_push(`<a${ssrRenderAttr("href", path(`/components/${slug}`))}${ssrRenderAttr("aria-current", __props.route.kind === "detail" && __props.route.slug === slug ? "page" : void 0)}>${ssrInterpolate(names.value[slug])}</a>`);
				});
				_push(`<!--]--><!--]-->`);
			});
			_push(`<!--]--></nav></aside>`);
			if (__props.route.kind === "catalog") ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			else {
				_push(`<article class="component-detail__content"><header class="component-detail__header"><h1>${ssrInterpolate(__props.route.name)}</h1></header><nav class="component-detail__tabs"${ssrRenderAttr("aria-label", `${__props.route.name} ${text.value.documentation}`)}><a${ssrRenderAttr("href", path(`/components/${__props.route.slug}`))}${ssrRenderAttr("aria-current", __props.route.tab === "overview" ? "page" : void 0)}>${ssrInterpolate(text.value.overview)}</a><a${ssrRenderAttr("href", path(`/components/${__props.route.slug}/props`))}${ssrRenderAttr("aria-current", __props.route.tab === "props" ? "page" : void 0)}>${ssrInterpolate(text.value.props)}</a></nav><div class="component-detail__body vp-doc">`);
				ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
				_push(`</div></article>`);
			}
			_push(`</main>`);
		};
	}
});
//#endregion
//#region components/demo-infra/ComponentDocsShell.vue
var _sfc_setup$1 = ComponentDocsShell_vue_vue_type_script_setup_true_lang_default.setup;
ComponentDocsShell_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demo-infra/ComponentDocsShell.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ComponentDocsShell_default = ComponentDocsShell_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region .vitepress/theme/ComponentDocsPage.vue?vue&type=script&setup=true&lang.ts
var ComponentDocsPage_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ComponentDocsPage",
	__ssrInlineRender: true,
	setup(__props) {
		const { page } = useData$1();
		const componentRoute = computed(() => parseComponentDocsRoute(`/${page.value.relativePath.replace(/\.md$/, "")}`));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Content = resolveComponent("Content");
			if (componentRoute.value) _push(ssrRenderComponent(ComponentDocsShell_default, mergeProps({ route: componentRoute.value }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_Content, null, null, _parent, _scopeId));
					else return [createVNode(_component_Content)];
				}),
				_: 1
			}, _parent));
			else _push(ssrRenderComponent(_component_Content, _attrs, null, _parent));
		};
	}
});
//#endregion
//#region .vitepress/theme/ComponentDocsPage.vue
var _sfc_setup = ComponentDocsPage_vue_vue_type_script_setup_true_lang_default.setup;
ComponentDocsPage_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../.vitepress/theme/ComponentDocsPage.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ComponentDocsPage_default = ComponentDocsPage_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region .vitepress/theme/index.ts
var theme_default = {
	extends: theme,
	enhanceApp({ app }) {
		app.component("component-docs", ComponentDocsPage_default);
		app.component("DemoExample", DemoExample_default);
		app.component("ComponentsOverview", ComponentsOverview_default);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/index.js
function resolveThemeExtends(theme) {
	if (theme.extends) {
		const base = resolveThemeExtends(theme.extends);
		return {
			...base,
			...theme,
			async enhanceApp(ctx) {
				await base.enhanceApp?.(ctx);
				await theme.enhanceApp?.(ctx);
			},
			setup() {
				base.setup?.();
				theme.setup?.();
			}
		};
	}
	return theme;
}
var Theme = resolveThemeExtends(theme_default);
var VitePressApp = defineComponent({
	name: "VitePressApp",
	setup() {
		const { site, lang, dir } = useData$1();
		onMounted(() => {
			watchEffect(() => {
				document.documentElement.lang = lang.value;
				document.documentElement.dir = dir.value;
			});
		});
		if (site.value.router.prefetchLinks) usePrefetch();
		useCopyCode();
		useCodeGroups();
		if (Theme.setup) Theme.setup();
		return () => h(Theme.Layout);
	}
});
async function createApp$1() {
	globalThis.__VITEPRESS__ = true;
	const router = newRouter();
	const app = newApp();
	app.provide(RouterSymbol, router);
	const data = initData(router.route);
	app.provide(dataSymbol, data);
	app.component("Content", Content);
	app.component("ClientOnly", ClientOnly);
	Object.defineProperties(app.config.globalProperties, {
		$frontmatter: { get() {
			return data.frontmatter.value;
		} },
		$params: { get() {
			return data.page.value.params;
		} }
	});
	app.config.throwUnhandledErrorInProduction = true;
	if (Theme.enhanceApp) await Theme.enhanceApp({
		app,
		router,
		siteData: siteDataRef
	});
	return {
		app,
		router,
		data
	};
}
function newApp() {
	return createSSRApp(VitePressApp);
}
function newRouter() {
	let isInitialPageLoad = inBrowser;
	return createRouter((path) => {
		let pageFilePath = pathToFile(path);
		let pageModule = null;
		if (pageFilePath) {
			if (isInitialPageLoad) pageFilePath = pageFilePath.replace(/\.js$/, ".lean.js");
			pageModule = import(
				/*@vite-ignore*/
				pageFilePath
);
		}
		if (inBrowser) isInitialPageLoad = false;
		return pageModule;
	}, Theme.NotFound);
}
if (inBrowser) createApp$1().then(({ app, router, data }) => {
	router.go(location.href, { initialLoad: true }).then(() => {
		useUpdateHead(router.route, data.site);
		app.mount("#app");
	});
});
//#endregion
//#region ../../node_modules/.pnpm/vitepress@2.0.0-alpha.20_@types+node@26.6.4_@typescript+typescript6@6.0.2_change-case@5_62e51735a1a2d9b1ea7e483986b17558/node_modules/vitepress/dist/client/app/ssr.js
async function render(path) {
	const { app, router } = await createApp$1();
	await router.go(path);
	const ctx = {
		content: "",
		vpIcons: /* @__PURE__ */ new Set()
	};
	ctx.content = await renderToString(app, ctx);
	return ctx;
}
//#endregion
export { escapeRegExp as _, withBase as a, onKeyStroke as c, useLocalStorage as d, useSessionStorage as f, watchDebounced as g, tryOnScopeDispose as h, pathToFile as i, unrefElement as l, toArray as m, useData as n, dataSymbol as o, notNullish as p, useRouter as r, render, computedAsync as s, useBodyScrollLock as t, useEventListener as u };
