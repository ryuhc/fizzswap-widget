/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_IS_LOCAL: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
