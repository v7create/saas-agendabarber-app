# ✅ Checklist de Ações Imediatas - AgendaBarber

## 🚨 PRIORIDADE MÁXIMA - FAZER HOJE

### 1. Segurança das Credenciais Firebase (30 min)

- [ ] Criar arquivo `.env.local` na raiz do projeto
- [ ] Copiar template do `.env.example` fornecido
- [ ] Mover credenciais Firebase do `src/firebase.ts` para `.env.local`
- [ ] Atualizar `src/firebase.ts` para usar variáveis de ambiente
- [ ] Adicionar `.env` ao `.gitignore` (se ainda não estiver)
- [ ] Verificar que `.env.local` NÃO está commitado no Git:
  ```bash
  git status
  # Se aparecer .env.local, adicione ao .gitignore imediatamente
  ```
- [ ] Se já foi commitado, remova do histórico Git:
  ```bash
  git rm --cached .env.local
  git commit -m "chore: remove env file from tracking"
  ```

**⚠️ ATENÇÃO**: Se as credenciais já foram expostas publicamente, REGENERE as chaves no Firebase Console!

### 2. Firestore Security Rules (1 hora)

- [ ] Criar arquivo `firestore.rules` na raiz do projeto
- [ ] Copiar as rules fornecidas do `IMPLEMENTATION_PLAN.md`
- [ ] Personalizar regras se necessário para seu caso de uso
- [ ] Testar rules localmente com Firebase Emulator (opcional mas recomendado)
- [ ] Fazer deploy das rules:
  ```bash
  firebase deploy --only firestore:rules
  ```
- [ ] Verificar no Firebase Console que as rules foram aplicadas
- [ ] Testar acesso autenticado e não autenticado na aplicação

### 3. Adicionar Validação Básica (2 horas)

- [ ] Instalar Zod:
  ```bash
  npm install zod
  ```
- [ ] Criar arquivo `src/lib/validations.ts`
- [ ] Copiar schemas básicos do `IMPLEMENTATION_PLAN.md`
- [ ] Aplicar validação no LoginPage:
  - [ ] Validar email
  - [ ] Validar senha mínima 6 caracteres
  - [ ] Mostrar erros de validação

---

## 📋 ESTA SEMANA - Configurações Essenciais

### 4. TypeScript Strict Mode (30 min)

- [ ] Atualizar `tsconfig.json` com configurações do `CONFIGURATIONS.md`
- [ ] Rodar `npm run type-check` e corrigir erros (pode ter muitos inicialmente)
- [ ] Adicionar script ao `package.json`:
  ```json
  "type-check": "tsc --noEmit"
  ```

### 5. ESLint + Prettier (1 hora)

- [ ] Instalar dependências:
  ```bash
  npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks prettier
  ```
- [ ] Copiar `.eslintrc.cjs` do `CONFIGURATIONS.md`
- [ ] Copiar `.prettierrc.cjs` do `CONFIGURATIONS.md`
- [ ] Adicionar scripts ao `package.json`:
  ```json
  "lint": "eslint . --ext ts,tsx",
  "lint:fix": "eslint . --ext ts,tsx --fix",
  "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md,json}\""
  ```
- [ ] Rodar `npm run lint:fix` para corrigir problemas automáticos
- [ ] Rodar `npm run format` para formatar código

### 6. Gitignore Atualizado (5 min)

- [ ] Atualizar `.gitignore` com versão do `IMPLEMENTATION_PLAN.md`
- [ ] Verificar que todos os arquivos sensíveis estão protegidos:
  - [ ] `.env*` files
  - [ ] `firebase-debug.log`
  - [ ] `firestore-debug.log`
  - [ ] `.firebase/` directory

---

## 🏗️ PRÓXIMA SEMANA - Arquitetura

### 7. Criar Estrutura de Pastas (2 horas)

- [ ] Criar estrutura conforme `IMPLEMENTATION_PLAN.md`:
  ```bash
  mkdir -p src/{features,hooks,services,lib,store}
  mkdir -p src/components/{common,forms,layout}
  ```
- [ ] Preparar para migration gradual

### 8. Camada de Serviços (4 horas)

- [ ] Criar `src/services/base.service.ts`
- [ ] Criar `src/services/appointment.service.ts`
- [ ] Testar serviços com dados mock primeiro
- [ ] Integrar com Firestore

### 9. Custom Hooks Principais (4 horas)

- [ ] Criar `src/hooks/useAuth.ts`
- [ ] Criar `src/hooks/useAppointments.ts`
- [ ] Refatorar LoginPage para usar `useAuth`

---

## ✅ EM 2 SEMANAS - Testes

### 10. Configurar Vitest (1 hora)

- [ ] Instalar dependências:
  ```bash
  npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
  ```
- [ ] Copiar `vitest.config.ts` do `CONFIGURATIONS.md`
- [ ] Criar `src/test/setup.ts`
- [ ] Adicionar scripts ao `package.json`

### 11. Primeiros Testes (3 horas)

- [ ] Escrever testes para `useAuth` hook
- [ ] Escrever testes para componentes Button/Input
- [ ] Configurar coverage mínima de 50% para começar

---

## 🚀 EM 3 SEMANAS - CI/CD

### 12. GitHub Actions (2 horas)

- [ ] Criar `.github/workflows/ci.yml`
- [ ] Copiar workflow do `CONFIGURATIONS.md`
- [ ] Adicionar secrets no GitHub:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] (todas as outras variáveis)

### 13. Deploy Automático (1 hora)

- [ ] Criar `.github/workflows/deploy.yml`
- [ ] Adicionar `FIREBASE_SERVICE_ACCOUNT` secret
- [ ] Testar deploy automático em branch de teste

---

## 📊 MÉTRICAS DE PROGRESSO

### Fase 1: Segurança (Completar HOJE)
- [ ] ✅ 0/3 tarefas concluídas
- [ ] Tempo estimado: 3.5 horas
- [ ] Bloqueador para: TODAS as outras fases

### Fase 2: Configurações (Completar ESTA SEMANA)
- [ ] ✅ 0/3 tarefas concluídas
- [ ] Tempo estimado: 2.5 horas
- [ ] Dependências: Fase 1 completa

### Fase 3: Arquitetura (Completar PRÓXIMA SEMANA)
- [ ] ✅ 0/3 tarefas concluídas
- [ ] Tempo estimado: 10 horas
- [ ] Dependências: Fase 2 completa

### Fase 4: Testes (Completar EM 2 SEMANAS)
- [ ] ✅ 0/2 tarefas concluídas
- [ ] Tempo estimado: 4 horas
- [ ] Dependências: Fase 3 completa

### Fase 5: CI/CD (Completar EM 3 SEMANAS)
- [ ] ✅ 0/2 tarefas concluídas
- [ ] Tempo estimado: 3 horas
- [ ] Dependências: Fase 4 completa

---

## 🎯 OBJETIVOS SMART

### Objetivo 1: Segurança
- **Específico**: Proteger credenciais Firebase e implementar rules
- **Mensurável**: 3 tarefas concluídas, 0 credenciais expostas
- **Atingível**: 3.5 horas de trabalho focado
- **Relevante**: Crítico para segurança da aplicação
- **Temporal**: Completar HOJE (14/10/2025)

### Objetivo 2: Qualidade de Código
- **Específico**: Configurar TypeScript strict + ESLint + Prettier
- **Mensurável**: 0 erros de lint, 0 erros de type
- **Atingível**: 2.5 horas de trabalho
- **Relevante**: Base para código maintainável
- **Temporal**: Completar até 18/10/2025

### Objetivo 3: Arquitetura Escalável
- **Específico**: Refatorar para serviços + hooks
- **Mensurável**: 3 serviços, 2 hooks implementados
- **Atingível**: 10 horas de trabalho
- **Relevante**: Facilita crescimento do projeto
- **Temporal**: Completar até 25/10/2025

---

## 🔄 PROCESSO DE REVISÃO

### Daily Check
- [ ] Marcar tasks concluídas neste checklist
- [ ] Commitar progresso no Git
- [ ] Atualizar documentação se necessário

### Weekly Review (Toda Sexta)
- [ ] Revisar métricas de progresso
- [ ] Ajustar estimativas se necessário
- [ ] Planejar próxima semana
- [ ] Fazer backup do projeto

### Monthly Retrospective (Fim do Mês)
- [ ] Documentar lições aprendidas
- [ ] Atualizar roadmap
- [ ] Revisar security rules
- [ ] Analisar métricas de performance

---

## 📝 NOTAS E OBSERVAÇÕES

### Decisões Tomadas
- Data: 14/10/2025
- Decisão: Priorizar segurança antes de features
- Justificativa: Credenciais expostas são risco crítico

### Impedimentos
- [ ] Nenhum no momento

### Riscos Identificados
- [ ] Refatoração pode introduzir bugs → Mitigar com testes
- [ ] Tempo de implementação pode estourar → Buffer de 20% adicionado

---

## 🆘 AJUDA E SUPORTE

### Se Encontrar Problemas

1. **Erro nas Security Rules**
   - Verifique sintaxe no [Firebase Rules Playground](https://firebase.google.com/docs/rules/simulator)
   - Teste localmente com Firebase Emulator

2. **Erros TypeScript após Strict Mode**
   - Normal ter muitos erros inicialmente
   - Corrija gradualmente, começando pelos críticos
   - Use `// @ts-ignore` temporariamente se bloqueado (mas documente!)

3. **Testes Falhando**
   - Verifique mocks do Firebase em `src/test/setup.ts`
   - Console.log para debug
   - Use `test.only()` para focar em um teste

4. **Deploy Falhando**
   - Verifique secrets do GitHub
   - Confirme que build local funciona: `npm run build`
   - Revise logs do GitHub Actions

---

## ✅ COMO USAR ESTE CHECKLIST

1. **Imprima ou mantenha aberto** em segunda tela
2. **Marque tasks** conforme completa (substitua `[ ]` por `[x]`)
3. **Commit este arquivo** quando atualizar para rastrear progresso
4. **Revise diariamente** para manter foco
5. **Celebre vitórias** pequenas! 🎉

---

## 🎉 CELEBRAÇÕES E MARCOS

- [ ] 🔒 **Fase 1 Completa** - Segurança implementada! (Pedir review de colega)
- [ ] 🧹 **Código Limpo** - ESLint + Prettier configurados! (Fazer commit "clean code")
- [ ] 🏗️ **Arquitetura Sólida** - Serviços + Hooks funcionando! (Documentar decisões)
- [ ] ✅ **Testes Passando** - Coverage >50%! (Compartilhar relatório)
- [ ] 🚀 **CI/CD Ativo** - Deploy automático! (Compartilhar link da app)

---

**Data de Criação**: 14 de Outubro de 2025  
**Última Atualização**: 14 de Outubro de 2025  
**Responsável**: [Seu Nome]  
**Status**: 🔴 Fase 1 Pendente - INICIAR AGORA!

---

**👉 PRÓXIMA AÇÃO**: Começar com item #1 - Segurança das Credenciais Firebase
