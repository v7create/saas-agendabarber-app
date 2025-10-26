import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

const REQUIRED_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const MODE_ALIASES = {
  production: ['.env.production', '.env.local', '.env'],
  preview: ['.env.preview', '.env.production', '.env.local', '.env'],
  development: ['.env.local', '.env'],
};

const target = process.argv[2] ?? 'development';
const envSequence = MODE_ALIASES[target] ?? MODE_ALIASES.development;

const loadedFiles = [];
envSequence.forEach((relativePath) => {
  const absolutePath = resolve(process.cwd(), relativePath);
  if (!existsSync(absolutePath)) {
    return;
  }

  const buffer = readFileSync(absolutePath);
  if (!buffer.toString().trim()) {
    return;
  }

  dotenv.config({ path: absolutePath, override: true });
  loadedFiles.push(relativePath);
});

const missing = REQUIRED_ENV_VARS.filter((name) => {
  const value = process.env[name];
  return typeof value !== 'string' || value.trim() === '';
});

if (missing.length > 0) {
  console.error('\n❌ Variáveis de ambiente obrigatórias ausentes:');
  missing.forEach((key) => console.error(`   • ${key}`));
  console.error('\nℹ️  Crie um arquivo com as credenciais do Firebase.');
  console.error('   Exemplos aceitos (prioridade da esquerda para a direita):', envSequence.join(', '));
  console.error('   Utilize .env.example como referência e NÃO versione o arquivo com as chaves reais.');
  process.exit(1);
}

if (loadedFiles.length === 0) {
  console.warn('\n⚠️ Nenhum arquivo .env carregado automaticamente. Certifique-se de exportar as variáveis no ambiente.');
} else {
  console.log(`\n✅ Variáveis de ambiente carregadas de: ${loadedFiles.join(', ')}`);
}
