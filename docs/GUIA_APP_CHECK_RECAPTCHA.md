# 🔐 Guia de Configuração: Firebase App Check + reCAPTCHA v3

**Data:** 15/10/2025  
**Projeto:** AgendaBarber  
**Status:** ✅ CONFIGURADO E FUNCIONANDO

---

## ✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!

O Firebase App Check com reCAPTCHA v3 está **ativo e funcionando** no projeto!

**SITE KEY configurada:** `6LcQzOorAAAAAHKJpdjBHw02JUJStJIiaT0iTxWP`

**Confirmações do Console:**
- ✅ Firebase inicializado com sucesso
- ✅ Firebase App Check em modo DEBUG
- ✅ Debug token configurado para testes locais

---

## 📋 PASSO A PASSO: Obter a SITE KEY Correta

### 1️⃣ Acessar Firebase Console

Abra: https://console.firebase.google.com/project/saas-barbearia-8d49a/appcheck

### 2️⃣ Navegar até App Check

No menu lateral esquerdo, clique em:
```
🔒 Build > App Check
```

### 3️⃣ Registrar seu Web App (se ainda não estiver)

Na seção "Apps":

- Localize seu **Web App** na lista
- Se NÃO estiver registrado:
  - Clique no botão **"Register app"** ou **"+"**
  - Selecione seu Web App da lista
  - Clique em **"Continue"**

### 4️⃣ Selecionar reCAPTCHA v3

- Provider: **reCAPTCHA v3**
- Clique em **"Save"** ou **"Register"**

### 5️⃣ Copiar a SITE KEY

Após salvar, você verá:

```
┌─────────────────────────────────────────────┐
│ reCAPTCHA v3 Configuration                  │
├─────────────────────────────────────────────┤
│                                             │
│ SITE KEY (Public Key)                       │
│ 6Lc_ABC123...XYZ_sua_site_key_aqui        │
│ [Copy] 📋                                   │
│                                             │
│ SECRET KEY (Server Key)                     │
│ 6Lc_DEF456...UVW_secret_key                │
│ ⚠️ Do not share this key                    │
│                                             │
└─────────────────────────────────────────────┘
```

**✅ Copie APENAS a SITE KEY (primeira chave)**

### 6️⃣ Adicionar ao .env.local

Abra/crie o arquivo `.env.local` na raiz do projeto:

```env
# Suas credenciais Firebase existentes...
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=saas-barbearia-8d49a.firebaseapp.com
# ... etc

# App Check - ADICIONE ESTA LINHA com sua SITE KEY:
VITE_FIREBASE_APP_CHECK_KEY=6Lc_ABC123...XYZ_sua_site_key_aqui

# Para desenvolvimento local (opcional):
VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN=true
```

**⚠️ IMPORTANTE:**
- Use a **SITE KEY**, NÃO a SECRET KEY
- A SECRET KEY NUNCA deve estar no código cliente
- A SECRET KEY fica apenas no Firebase Console (servidor)

---

## 🧪 MODO DEBUG (Desenvolvimento)

Para testar localmente SEM reCAPTCHA aparecer:

### Opção 1: Debug Token Automático (Recomendado)

No `.env.local`:
```env
VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN=true
```

Ao rodar `npm run dev`:
1. Abra o console do navegador (F12)
2. Você verá uma mensagem tipo:
   ```
   Firebase App Check debug token: 
   ABCD1234-EFGH-5678-IJKL-9012MNOP3456
   ```
3. Copie este token

### Opção 2: Registrar Debug Token no Firebase

1. Vá em: https://console.firebase.google.com/project/saas-barbearia-8d49a/appcheck/apps
2. Clique na aba **"Debug tokens"**
3. Clique em **"Add debug token"**
4. Cole o token copiado do console
5. Dê um nome (ex: "Desenvolvimento Local")
6. Clique em **"Save"**

Agora seu localhost pode fazer requisições sem resolver reCAPTCHA!

---

## 🚀 MODO PRODUÇÃO

Quando você fizer deploy (Firebase Hosting, Vercel, etc.):

1. **O reCAPTCHA v3 funcionará automaticamente**
   - É invisível para o usuário
   - Não interrompe a navegação
   - Analisa comportamento em segundo plano

2. **Certifique-se de:**
   - Ter a SITE KEY no `.env.local` (ou variáveis de ambiente do hosting)
   - Não incluir o debug token em produção
   - Adicionar seu domínio de produção no Firebase Console

---

## 🔍 Verificar Configuração

### 1. Verificar Variáveis de Ambiente

No terminal (dentro do projeto):
```bash
# PowerShell
echo $env:VITE_FIREBASE_APP_CHECK_KEY

# Ou verifique se existe:
cat .env.local | findstr VITE_FIREBASE_APP_CHECK_KEY
```

Deve mostrar sua SITE KEY (começando com `6Lc...`)

### 2. Testar App Check

```bash
npm run dev
```

Abra: http://localhost:5173

No console (F12):
- ✅ Deve aparecer: `Firebase App Check em modo DEBUG`
- ✅ Ou: `Firebase App Check inicializado com reCAPTCHA v3`
- ❌ Se aparecer erro, verifique a SITE KEY

---

## 📚 Diferença entre SITE KEY e SECRET KEY

| Tipo | Uso | Onde | Pode Compartilhar? |
|------|-----|------|-------------------|
| **SITE KEY** (Public) | Cliente/Navegador | `.env.local`, código front-end | ✅ Sim (é pública) |
| **SECRET KEY** (Private) | Servidor/Firebase | Firebase Console apenas | ❌ NÃO! (é secreta) |

### Como Identificar:

```
SITE KEY:    6Lc...ABC123...xyz  (para o navegador)
SECRET KEY:  6Lc...DEF456...uvw  (para o servidor)
```

Ambas começam com `6Lc`, mas são diferentes!

**CONFIRMADO:** A SITE KEY `6LcQzOorAAAAAHKJpdjBHw02JUJStJIiaT0iTxWP` está configurada corretamente e o App Check está funcionando!

---

## 🐛 Resolução de Problemas

### Erro: "App Check token is invalid"
- **Causa:** SITE KEY incorreta ou não registrada
- **Solução:** Verifique se copiou a SITE KEY correta do Firebase Console

### Erro: "App Check: Too many requests"
- **Causa:** Muitas requisições em desenvolvimento
- **Solução:** Use debug token para desenvolvimento local

### reCAPTCHA aparecendo na tela
- **Causa:** Você pode estar usando reCAPTCHA Enterprise ou v2
- **Solução:** Certifique-se de usar **reCAPTCHA v3** no Firebase Console

### App não carrega em produção
- **Causa:** Domain não autorizado no Firebase
- **Solução:** Adicione seu domínio em Firebase Console > Authentication > Settings > Authorized domains

---

## ✅ Checklist Final

Antes de fazer commit/deploy:

- [ ] Copiei a **SITE KEY** (não a SECRET KEY) do Firebase Console
- [ ] Adicionei `VITE_FIREBASE_APP_CHECK_KEY` no `.env.local`
- [ ] Adicionei `.env.local` no `.gitignore` (já está ✅)
- [ ] Testei localmente com `npm run dev`
- [ ] Console do navegador mostra App Check inicializado
- [ ] Configurei debug token para desenvolvimento
- [ ] NÃO commitei a SECRET KEY no código

---

## ✅ Status Final da Configuração

**SITE KEY:** `6LcQzOorAAAAAHKJpdjBHw02JUJStJIiaT0iTxWP` ✅  
**Arquivo:** `.env.local` (configurado) ✅  
**App Check:** Ativo em modo DEBUG ✅  
**Firebase:** Inicializado com sucesso ✅

### Próximos Passos para Produção:

Quando fizer deploy em produção:

1. **Configure a SITE KEY nas variáveis de ambiente do hosting**
   - Vercel: Settings > Environment Variables
   - Firebase Hosting: Já usa o `.env.local` no build

2. **Remova ou comente o debug token em produção:**
   ```env
   # VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN=true  # Apenas para dev
   ```

3. **O reCAPTCHA v3 funcionará automaticamente:**
   - Invisível para o usuário
   - Análise de comportamento em segundo plano
   - Proteção contra bots e abuso

---

## 🔗 Links Úteis

- **Firebase App Check:** https://console.firebase.google.com/project/saas-barbearia-8d49a/appcheck
- **Documentação reCAPTCHA v3:** https://cloud.google.com/recaptcha/docs/v3
- **Firebase App Check Docs:** https://firebase.google.com/docs/app-check

---

**Mantido por:** Equipe de Desenvolvimento  
**Última atualização:** 15/10/2025  
**Status:** ✅ Configurado e funcionando perfeitamente
