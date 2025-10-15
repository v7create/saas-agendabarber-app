# 🎯 Guia Rápido: Usando Copilot com Playwright

**IMPORTANTE:** Para usar os comandos abaixo, você precisa configurar o MCP Server primeiro.

---

## 🔧 Configuração do MCP Server (1x - Uma Vez)

### Passo 1: Criar arquivo de configuração

**Windows:** Crie/edite este arquivo:
```
%APPDATA%\Code\User\globalStorage\github.copilot-chat\mcpServers.json
```

**Como chegar lá:**
1. Pressione `Win + R`
2. Digite: `%APPDATA%\Code\User\globalStorage\github.copilot-chat`
3. Se a pasta não existir, crie-a
4. Crie o arquivo `mcpServers.json`

### Passo 2: Conteúdo do arquivo

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ],
      "env": {
        "PLAYWRIGHT_CONFIG": "playwright.config.ts"
      }
    }
  }
}
```

### Passo 3: Reiniciar VS Code

Feche e reabra o VS Code **completamente** (não apenas a janela).

### Passo 4: Verificar se funcionou

No GitHub Copilot Chat, digite:
```
@workspace Você tem acesso ao Playwright MCP?
```

Se responder que sim, está configurado! 🎉

---

## 🚀 Comandos que Você Pode Usar

### 1. Executar Testes

```
@workspace Execute os testes E2E de autenticação
```

```
@workspace Rode todos os testes E2E e me diga os resultados
```

```
@workspace Execute apenas o teste de dashboard
```

```
@workspace Teste o fluxo completo de agendamento
```

### 2. Debug de Testes Falhando

```
@workspace O teste de login está falhando, investigue e me mostre screenshots
```

```
@workspace Por que o teste de clientes quebrou?
```

```
@workspace Analise as falhas nos testes de appointments
```

```
@workspace Execute os testes em modo debug e me diga o que encontrou
```

### 3. Criar Novos Testes

```
@workspace Crie testes E2E para a página de financeiro
```

```
@workspace Adicione testes para o fluxo de cancelamento de agendamento
```

```
@workspace Escreva testes para validar todos os filtros da agenda
```

```
@workspace Crie testes para as 3 páginas de settings
```

```
@workspace Adicione testes para a página de histórico
```

### 4. Validação e Screenshots

```
@workspace Capture screenshots de todas as páginas principais
```

```
@workspace Execute testes de regressão em todas as features
```

```
@workspace Valide se todos os modais estão funcionando
```

```
@workspace Tire screenshots de todos os estados de loading e error
```

### 5. Análise de Cobertura

```
@workspace Quais features ainda não têm testes E2E?
```

```
@workspace Me dê um relatório de cobertura dos testes
```

```
@workspace Quantos cenários de teste temos por feature?
```

### 6. Refatoração de Testes

```
@workspace Os testes de auth estão muito repetitivos, refatore usando fixtures
```

```
@workspace Crie helpers reutilizáveis para os testes de formulários
```

```
@workspace Extraia a lógica de login para um helper
```

---

## 🎭 Exemplos de Workflows Completos

### Workflow 1: Testar Feature Nova

```
@workspace Acabei de criar a página de relatórios financeiros. 
Crie testes E2E completos para:
- Visualizar relatórios
- Filtrar por período
- Exportar PDF
- Exportar Excel
```

### Workflow 2: Debug de Bug Reportado

```
@workspace Um usuário reportou que não consegue criar agendamento.
Execute os testes de appointments em modo headed e capture screenshots.
Se falhar, investigue o erro e sugira correção.
```

### Workflow 3: Validação Pré-Deploy

```
@workspace Vou fazer deploy. Execute todos os testes E2E e me dê um relatório:
- Quantos testes passaram
- Quantos falharam
- Screenshots das falhas
- Sugestões de fix para as falhas
```

### Workflow 4: Criar Suite de Testes

```
@workspace Crie uma suite completa de testes E2E para a feature de clientes:
1. CRUD completo
2. Busca e filtros
3. Validações de formulário
4. Estados de loading e error
5. Integração com Firebase
```

### Workflow 5: Visual Regression

```
@workspace Capture screenshots de referência de todas as páginas no estado atual.
Depois, execute os mesmos testes e compare se houve mudanças visuais.
```

---

## 💡 Dicas Pro

### 1. Seja Específico

❌ Ruim: "Execute testes"  
✅ Bom: "Execute os testes E2E de autenticação e me mostre screenshots das falhas"

### 2. Use Contexto

❌ Ruim: "Crie testes"  
✅ Bom: "Crie testes E2E para a página de clientes, incluindo CRUD, busca e filtros"

### 3. Peça Análise

❌ Ruim: "Tem erro?"  
✅ Bom: "Execute todos os testes, me diga quais falharam e analise os screenshots para identificar a causa"

### 4. Itere

```
1º: "Execute os testes de appointments"
2º: "O teste de criar agendamento falhou, investigue"
3º: "Sugira uma correção para o seletor quebrado"
4º: "Aplique a correção e execute novamente"
```

### 5. Contextualize com Firebase

```
@workspace Execute os testes de appointments. 
Note que estamos usando Firebase Firestore com a collection structure:
barbershops/{userId}/appointments

Se falhar por dados ausentes, me diga que dados de teste preciso criar.
```

---

## 📊 Relatórios Úteis

### Relatório de Status Geral

```
@workspace Me dê um status completo dos testes E2E:
- Total de features testadas
- Total de cenários
- Taxa de sucesso
- Features sem testes
- Próximos testes prioritários
```

### Relatório de Cobertura

```
@workspace Analise a cobertura dos testes E2E:
- Quais páginas têm testes completos
- Quais estão parcialmente testadas
- Quais não têm testes
- Sugira prioridades
```

### Relatório de Performance

```
@workspace Execute todos os testes e me diga:
- Tempo total de execução
- Testes mais lentos
- Sugestões de otimização
```

---

## 🐛 Troubleshooting

### "Não consigo executar testes"

```
@workspace Verifique se:
1. Playwright está instalado (npx playwright --version)
2. O dev server está rodando (npm run dev)
3. A configuração está correta (playwright.config.ts)
Se algum item falhar, me diga como corrigir
```

### "Testes estão falhando por timeout"

```
@workspace Os testes estão falhando por timeout. 
Aumente o timeout em playwright.config.ts e execute novamente.
```

### "Seletores quebrados"

```
@workspace Os seletores dos testes estão quebrados após refatoração.
Analise a página [nome] e atualize os seletores em [teste].spec.ts
```

---

## 🎯 Checklist de Uso Diário

Use este checklist toda vez que for fazer mudanças importantes:

```
✅ ANTES de fazer mudanças:
   @workspace Capture screenshots de referência das páginas que vou alterar

✅ DURANTE o desenvolvimento:
   @workspace Execute os testes relacionados à feature que estou alterando

✅ DEPOIS das mudanças:
   @workspace Execute todos os testes e compare com os screenshots de referência

✅ ANTES de commitar:
   @workspace Execute suite completa de testes e me dê um relatório final
```

---

## 🚦 Semáforo de Testes

### 🟢 Verde (Pode fazer deploy)
```
@workspace Todos os testes passaram
```

### 🟡 Amarelo (Revisar antes de deploy)
```
@workspace Alguns testes falharam, mas não são críticos
```

### 🔴 Vermelho (NÃO fazer deploy)
```
@workspace Testes críticos falhando (auth, appointments, payments)
```

---

## 🎓 Próximos Passos

Depois de dominar o básico, você pode:

1. **Criar testes para as 6 features restantes:**
   ```
   @workspace Crie testes E2E para todas as features que ainda não têm testes
   ```

2. **Adicionar testes de API:**
   ```
   @workspace Crie testes que validam diretamente as operações do Firebase
   ```

3. **Implementar CI/CD:**
   ```
   @workspace Configure GitHub Actions para executar os testes automaticamente em PRs
   ```

4. **Visual Regression:**
   ```
   @workspace Configure Playwright para fazer visual regression testing
   ```

5. **Performance Testing:**
   ```
   @workspace Adicione testes de performance e lighthouse audit
   ```

---

## 📚 Comandos Avançados

### Executar em Paralelo
```
@workspace Execute todos os testes em paralelo e me dê um relatório consolidado
```

### Retry Automático
```
@workspace Configure os testes para fazer retry automático em falhas intermitentes
```

### Teste Cross-Browser
```
@workspace Execute os testes em Chromium, Firefox e WebKit e compare os resultados
```

### Teste Mobile
```
@workspace Configure os testes para simular dispositivos móveis (iPhone, Android)
```

---

## 🎉 Resultado

Com esta configuração, você tem:

✅ Playwright instalado e funcionando  
✅ 23 cenários de teste prontos  
✅ Comandos do Copilot documentados  
✅ Workflows para diferentes situações  
✅ Troubleshooting para problemas comuns  

**Basta configurar o MCP Server e começar a usar! 🚀**

---

**Criado por:** GitHub Copilot  
**Data:** 15/10/2025  
**Versão:** 1.0
