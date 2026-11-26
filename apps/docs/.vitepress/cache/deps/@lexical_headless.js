import { Rn as createEditor, go as invariant, u as defineExtension } from "./src-BWdqgNjM.js";
//#region ../../node_modules/.pnpm/@lexical+headless@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/headless/src/HeadlessExtension.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Marks an editor as headless. Use it with `buildEditorFromExtensions` for an
* editor that will never be attached to the DOM, for example on a server or
* in tests.
*
* An editor with no root element already skips reconciliation and DOM
* selection, so this extension is not required for that. What it adds:
*
* - `editor.setRootElement(element)` throws, so the editor cannot be attached
*   to the DOM by mistake. `setRootElement(null)` is still allowed, which is
*   what `editor.dispose()` calls.
* - Nested editors created with this editor as their `parentEditor` are
*   headless too.
* - Extensions that only do DOM work can check the flag and skip registering
*   it, as the code gutter in `@lexical/code-core` does.
*
* Unlike {@link createHeadlessEditor}, listener registration methods such as
* `registerRootListener` keep working, so extensions that register them can
* be used in a headless editor. Those listeners never see a root element.
*/
var HeadlessExtension = defineExtension({
	build: (editor) => {
		markEditorHeadless(editor);
	},
	name: "@lexical/headless/Headless"
});
function markEditorHeadless(editor) {
	editor._headless = true;
	const setRootElement = editor.setRootElement;
	editor.setRootElement = function(nextRootElement) {
		invariant(nextRootElement === null, "HeadlessExtension: setRootElement is not supported in headless mode");
		setRootElement.call(this, nextRootElement);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@lexical+headless@0.52.0_@typescript+typescript6@6.0.2/node_modules/@lexical/headless/src/index.ts
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
/**
* Generates a headless editor that allows lexical to be used without the need for a DOM, eg in Node.js.
* Throws an error when unsupported methods are used.
* @param editorConfig - The optional lexical editor configuration.
* @returns - The configured headless editor.
*/
function createHeadlessEditor(editorConfig) {
	const editor = createEditor(editorConfig);
	editor._headless = true;
	[
		"registerDecoratorListener",
		"registerRootListener",
		"registerMutationListener",
		"getRootElement",
		"setRootElement",
		"getElementByKey",
		"focus",
		"blur"
	].forEach((method) => {
		editor[method] = () => {
			invariant(false, "%s is not supported in headless mode", method);
		};
	});
	return editor;
}
//#endregion
export { HeadlessExtension, createHeadlessEditor };
