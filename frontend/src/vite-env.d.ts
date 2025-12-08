/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URL: string;
  readonly VITE_ENV: 'development' | 'production' | 'test';
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
