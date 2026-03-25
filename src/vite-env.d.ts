/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_GEMINI_API_KEY: string
  readonly VITE_APP_GAS_WEBHOOK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
