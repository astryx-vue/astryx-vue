//#region components/demo-infra/defineDemo.ts
function defineDemo(component, source, options = {}) {
	return {
		className: options.className,
		component,
		dataKind: options.dataKind,
		source: source.source,
		sourceHtml: source.html
	};
}
//#endregion
export { defineDemo as t };
