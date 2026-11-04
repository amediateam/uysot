/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_TOLGEE_API_URL: string;
  readonly VITE_TOLGEE_API_KEY: string;
  readonly VITE_TOLGEE_PROJECT_ID: string;
  readonly VITE_TOLGEE_BACKEND_FETCH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
