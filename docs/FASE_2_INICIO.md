# 🚀 Fase 2: Arquitetura - Guia de Implementação

**Data de início:** 15/10/2025  
**Status:** 🔄 Em progresso  
**Duração estimada:** 3-5 dias

---

## 📋 Passo 1: Instalar Zustand

### Execute no terminal (como Administrador):

```powershell
npm install zustand
```

**Versão esperada:** `^4.5.0` ou superior

### Verificar instalação:

Após instalar, verifique se aparece no `package.json`:

```json
"dependencies": {
  "zustand": "^4.5.0"
}
```

---

## 🏗️ Passo 2: Criar Estrutura de Pastas

Execute estes comandos no PowerShell (dentro do projeto):

```powershell
# Navegar até o projeto
cd "C:\Users\victo\OneDrive\Documentos\Projetos\SaaS-Barbearia\[APP]-AgendaBarber"

# Criar estrutura de features
mkdir src\features\auth\components
mkdir src\features\auth\hooks
mkdir src\features\auth\pages
mkdir src\features\auth\services

mkdir src\features\appointments\components
mkdir src\features\appointments\hooks
mkdir src\features\appointments\pages

mkdir src\features\clients\components
mkdir src\features\clients\hooks
mkdir src\features\clients\pages

mkdir src\features\financial\components
mkdir src\features\financial\hooks
mkdir src\features\financial\pages

mkdir src\features\settings\components
mkdir src\features\settings\hooks
mkdir src\features\settings\pages

# Criar diretórios globais
mkdir src\services
mkdir src\hooks
mkdir src\store

# Criar diretórios de componentes
mkdir src\components\common
mkdir src\components\forms
mkdir src\components\layout
```

### Estrutura resultante:

```
src/
├── components/
│   ├── common/           # Button, Input, Card, etc
│   ├── forms/            # FormField, FormInput, etc
│   ├── layout/           # Layout, Header, BottomNav
│   ├── BottomNav.tsx    # (existente)
│   ├── Card.tsx         # (existente)
│   └── ...
├── features/
│   ├── auth/
│   │   ├── components/  # LoginForm, RegisterForm
│   │   ├── hooks/       # useAuth, useLogin
│   │   ├── pages/       # LoginPage
│   │   └── services/    # auth.service.ts
│   ├── appointments/
│   ├── clients/
│   ├── financial/
│   └── settings/
├── hooks/               # Custom hooks globais
├── lib/                 # (existente)
├── pages/               # (manter pages.tsx temporariamente)
├── services/            # BaseService, serviços específicos
├── store/               # Zustand stores
└── types.ts            # (existente)
```

---

## 📝 Após instalar o Zustand e criar as pastas

**Responda:** "Pronto, Zustand instalado e pastas criadas"

Então continuarei com:
1. Criação do BaseService
2. Implementação do AuthStore
3. Hook useAuth
4. Separação da primeira página (LoginPage)

---

**Status:** Aguardando instalação do Zustand e criação de pastas  
**Próximo passo:** Implementar BaseService e serviços
