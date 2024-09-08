/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_SENTRY_DSN?: string;
  readonly VITE_APP_SENTRY_ENVIRONMENT?: string;
  readonly VITE_APP_GIT_SHA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
