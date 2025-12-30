import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Modo de execução (padrão: development)
const mode = process.argv[2] || 'development';

console.log(`🔄 Gerando Service Worker para ambiente: ${mode}...`);

// Ordem de prioridade de carregamento dos arquivos .env
const envFiles = [
    `.env.${mode}.local`,
    `.env.${mode}`,
    '.env.local',
    '.env'
];

// Carrega as variáveis de ambiente
let envVarsLoaded = false;
for (const file of envFiles) {
    const envPath = path.join(projectRoot, file);
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        envVarsLoaded = true;
    }
}

if (!envVarsLoaded) {
    console.warn('⚠️ Nenhum arquivo .env encontrado. As variáveis podem estar indefinidas.');
}

// Ler o template
const templatePath = path.join(projectRoot, 'src', 'firebase-messaging-sw.tpl.js');
if (!fs.existsSync(templatePath)) {
    console.error('❌ Template do Service Worker não encontrado em:', templatePath);
    process.exit(1);
}

let content = fs.readFileSync(templatePath, 'utf-8');

// Variáveis para substituir
const vars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

// Substituição
let missingVars = [];
vars.forEach(v => {
    const value = process.env[v];
    if (!value) {
        missingVars.push(v);
    }
    // Substitui todas as ocorrências
    content = content.replace(new RegExp(`{{${v}}}`, 'g'), value || '');
});

if (missingVars.length > 0) {
    console.warn(`⚠️ Aviso: As seguintes variáveis não foram encontradas no .env: ${missingVars.join(', ')}`);
}

// Escrever no diretório public
const publicDir = path.join(projectRoot, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

const destPath = path.join(publicDir, 'firebase-messaging-sw.js');
fs.writeFileSync(destPath, content);

console.log(`✅ Service Worker gerado com sucesso em: ${destPath}`);
