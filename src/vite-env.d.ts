/// <reference types="vite/client" />

declare module '*.rb?raw' {
  const content: string
  export default content
}
