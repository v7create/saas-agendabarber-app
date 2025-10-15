import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from '../firebase';

/**
 * Firebase App Check - Proteção contra abuso e tráfego não autorizado
 * 
 * CONFIGURAÇÃO DO reCAPTCHA v3:
 * 1. Acesse Firebase Console > App Check
 * 2. Registre seu app web
 * 3. Selecione "reCAPTCHA v3" como provider
 * 4. Copie a SITE KEY (chave pública) gerada
 * 5. Adicione ao .env.local: VITE_FIREBASE_APP_CHECK_KEY=<sua-site-key>
 * 
 * IMPORTANTE:
 * - Use SITE KEY (chave pública) no cliente, NÃO a SECRET KEY
 * - A SECRET KEY fica apenas no Firebase Console (servidor)
 * - Para desenvolvimento, use debug token
 * 
 * Documentação:
 * - Firebase App Check: https://firebase.google.com/docs/app-check
 * - reCAPTCHA v3: https://cloud.google.com/recaptcha/docs/v3
 */

// ============================================
// MODO DEBUG (DESENVOLVIMENTO)
// ============================================

if (import.meta.env.DEV) {
  // Debug token permite testes locais sem reCAPTCHA
  if (import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN) {
    // @ts-ignore - Debug token é definido globalmente
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN;
    console.log('🔧 Firebase App Check em modo DEBUG');
    console.log('📝 Debug token configurado para testes locais');
  } else {
    // Habilita modo debug automático (gera token no console)
    // @ts-ignore
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log('🔧 Firebase App Check em modo DEBUG AUTO');
    console.log('📝 Copie o debug token do console e adicione ao Firebase Console');
  }
}

// ============================================
// MODO PRODUÇÃO (reCAPTCHA v3)
// ============================================

if (import.meta.env.PROD) {
  const siteKey = import.meta.env.VITE_FIREBASE_APP_CHECK_KEY;
  
  if (!siteKey) {
    console.warn(
      '⚠️ Firebase App Check: SITE KEY não configurada!\n' +
      'Configure VITE_FIREBASE_APP_CHECK_KEY no .env.local\n' +
      'Seu app pode ter requisições bloqueadas sem App Check.'
    );
  } else {
    try {
      // Inicializa App Check com reCAPTCHA v3
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        
        // Auto-refresh: o SDK automaticamente renova tokens antes de expirar
        isTokenAutoRefreshEnabled: true,
      });

      console.log('✅ Firebase App Check inicializado com reCAPTCHA v3');
      console.log('🛡️ Proteção contra abuso ativada');
    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase App Check:', error);
      console.error('Verifique se a SITE KEY está correta e registrada no Firebase Console');
    }
  }
}

// ============================================
// INSTRUÇÕES PARA OBTER SITE KEY
// ============================================
/**
 * COMO OBTER A SITE KEY DO reCAPTCHA v3:
 * 
 * 1. Acesse: https://console.firebase.google.com/project/saas-barbearia-8d49a/appcheck
 * 
 * 2. Clique em "App Check" no menu lateral
 * 
 * 3. Na seção "Apps", encontre seu Web App
 * 
 * 4. Clique em "Registrar" ou "Editar" se já estiver registrado
 * 
 * 5. Selecione "reCAPTCHA v3" como provider
 * 
 * 6. Você verá duas chaves:
 *    - SITE KEY (chave pública) ← USE ESTA no .env.local
 *    - SECRET KEY (chave secreta) ← NÃO compartilhe, fica no Firebase
 * 
 * 7. Copie a SITE KEY e adicione ao .env.local:
 *    VITE_FIREBASE_APP_CHECK_KEY=6Lc...sua-site-key-aqui
 * 
 * 8. Para desenvolvimento local, adicione também:
 *    VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN=true
 *    (ou copie o token gerado no console e cole aqui)
 */

// Exporta o módulo para ser importado no App.tsx
export {};
