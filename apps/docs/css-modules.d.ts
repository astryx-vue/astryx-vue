declare module '*.css' {
  const stylesheet: string
  export default stylesheet
}

declare module '*.vue?raw&highlighted' {
  const source: import('./components/demo-infra/types').DemoSource
  export default source
}
