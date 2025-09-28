/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WEBSOCKET_URL: string
  readonly VITE_OUTLET_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}