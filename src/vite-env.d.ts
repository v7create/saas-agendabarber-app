/// <reference types="vite/client" />

// ============================================
// TIPOS DE VARIÁVEIS DE AMBIENTE DO VITE
// ============================================

interface ImportMetaEnv {
  // Firebase Configuration
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;

  // Firebase App Check (opcional)
  readonly VITE_FIREBASE_APP_CHECK_KEY?: string;
  readonly VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN?: string;

  // API Keys
  readonly VITE_GEMINI_API_KEY?: string;

  // App Configuration
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_WHATSAPP_BUSINESS_PHONE?: string;

  // Vite Built-in Variables
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
