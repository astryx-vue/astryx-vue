/** 源码里 `import '../styles/x.css'` 这类样式引入的类型，所有包和文档站共用。 */
declare module '*.css' {
  const stylesheet: string
  export default stylesheet
}
