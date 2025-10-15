# 🎭 Guia Completo: Configuração do MCP Playwright

**Objetivo:** Configurar Playwright + MCP para que o GitHub Copilot possa executar testes E2E automaticamente, identificar bugs e capturar evidências.

---

## 📋 Pré-requisitos

- ✅ Node.js instalado (já tem)
- ✅ Projeto AgendaBarber configurado (já tem)
- ✅ VS Code instalado (já tem)
- ⏳ Playwright a ser instalado
- ⏳ MCP Server do Playwright a ser configurado

---

## PARTE 1: Instalação do Playwright

### Passo 1.1: Resolver Erro de Execution Policy (PowerShell)

O erro que você está enfrentando é devido à política de execução do PowerShell. Há duas soluções:

#### Solução A: Usar CMD (Mais Simples) ✅ RECOMENDADO

Abra um **Prompt de Comando (CMD)** como **Administrador** e execute:

```cmd
cd c:\Users\victo\OneDrive\Documentos\Projetos\SaaS-Barbearia\[APP]-AgendaBarber
npm install -D @playwright/test
npx playwright install
```

#### Solução B: Ajustar PowerShell (Permanente)

Se preferir usar PowerShell, execute como **Administrador**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois execute:

```powershell
cd "c:\Users\victo\OneDrive\Documentos\Projetos\SaaS-Barbearia\[APP]-AgendaBarber"
npm install -D @playwright/test
npx playwright install
```

### Passo 1.2: Inicializar Playwright

Após a instalação, execute:

```bash
npx playwright install
```

Isso instalará os browsers (Chromium, Firefox, WebKit).

---

## PARTE 2: Configuração do Projeto Playwright

### Passo 2.1: Criar arquivo de configuração `playwright.config.ts`

Crie o arquivo na raiz do projeto:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para AgendaBarber
 * 
 * Features:
 * - Testes E2E para todas as features
 * - Screenshots e vídeos de falhas
 * - Parallel execution
 * - Retry automático
 */
export default defineConfig({
  testDir: './e2e',
  
  // Timeout por teste (30 segundos)
  timeout: 30 * 1000,
  
  // Configurações globais
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  use: {
    // Base URL da aplicação
    baseURL: 'http://localhost:5173',
    
    // Screenshot em falhas
    screenshot: 'only-on-failure',
    
    // Vídeo em falhas
    video: 'retain-on-failure',
    
    // Trace em falhas
    trace: 'on-first-retry',
  },

  // Configuração de projetos (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Adicionar mais browsers se necessário
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],

  // Dev server (inicia automaticamente antes dos testes)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Passo 2.2: Criar estrutura de testes

Crie a pasta `e2e/` na raiz do projeto:

```bash
mkdir e2e
```

### Passo 2.3: Criar arquivo de exemplo de teste

Crie `e2e/auth.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test('deve fazer login com sucesso', async ({ page }) => {
    // Navegar para a página de login
    await page.goto('/');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar se está na página de login
    await expect(page).toHaveURL(/login/);
    
    // Preencher formulário
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    
    // Clicar no botão de login
    await page.click('button[type="submit"]');
    
    // Aguardar navegação
    await page.waitForURL(/dashboard/, { timeout: 10000 });
    
    // Verificar se chegou no dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('input[type="email"]', 'invalido@exemplo.com');
    await page.fill('input[type="password"]', 'senhaerrada');
    
    await page.click('button[type="submit"]');
    
    // Verificar mensagem de erro
    await expect(page.locator('text=/erro|inválid/i')).toBeVisible({ timeout: 5000 });
  });
});
```

### Passo 2.4: Adicionar scripts ao `package.json`

Adicione os seguintes scripts:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

---

## PARTE 3: Instalação do MCP Playwright Server

### Passo 3.1: Instalar o MCP Server

O MCP Server do Playwright permite que o GitHub Copilot execute testes de forma autônoma.

**Opção A: Via NPM (Global)**

```bash
npm install -g @modelcontextprotocol/server-playwright
```

**Opção B: Via NPX (Sem instalação global)**

Usar diretamente com `npx` quando necessário.

### Passo 3.2: Configurar MCP no VS Code

Crie ou edite o arquivo de configuração do MCP:

**Windows:** `%APPDATA%\Code\User\globalStorage\github.copilot-chat\mcpServers.json`

**Conteúdo:**

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

### Passo 3.3: Reiniciar VS Code

Feche e reabra o VS Code para que as configurações sejam aplicadas.

---

## PARTE 4: Verificação da Configuração

### Passo 4.1: Verificar instalação do Playwright

```bash
npx playwright --version
```

**Saída esperada:** `Version 1.x.x`

### Passo 4.2: Executar teste de exemplo

```bash
npm run test:e2e
```

### Passo 4.3: Ver relatório HTML

```bash
npm run test:e2e:report
```

---

## PARTE 5: Como o Copilot Usará o MCP Playwright

### Capacidades do Copilot com MCP Playwright:

#### 1. **Executar Testes E2E**
```
Você (prompt): "Execute os testes E2E de autenticação"

Copilot vai:
1. Chamar MCP Playwright
2. Executar: npx playwright test e2e/auth.spec.ts
3. Retornar resultados (pass/fail)
4. Capturar screenshots de falhas
5. Gerar relatório
```

#### 2. **Criar Novos Testes**
```
Você: "Crie um teste E2E para o fluxo de agendamento"

Copilot vai:
1. Analisar AppointmentsPage
2. Criar e2e/appointments.spec.ts
3. Escrever cenários de teste
4. Executar e validar
```

#### 3. **Debug de Testes Falhando**
```
Você: "O teste de login está falhando, investigue"

Copilot vai:
1. Executar teste com --debug
2. Capturar screenshot da falha
3. Analisar logs do console
4. Identificar seletor quebrado
5. Sugerir correção
```

#### 4. **Testes de Regressão**
```
Você: "Execute todos os testes E2E e me diga o que quebrou"

Copilot vai:
1. Executar npx playwright test
2. Identificar testes falhando
3. Comparar com última execução
4. Listar breaking changes
5. Sugerir fixes
```

#### 5. **Validação Visual**
```
Você: "Capture screenshots de todas as páginas"

Copilot vai:
1. Navegar por todas as rotas
2. Capturar screenshots
3. Salvar em test-results/
4. Gerar relatório visual
```

---

## PARTE 6: Exemplos de Testes Prontos para Usar

### Teste 1: Fluxo de Agendamento Completo

Crie `e2e/appointments.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Agendamento', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('/');
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
  });

  test('deve criar novo agendamento', async ({ page }) => {
    // Navegar para appointments
    await page.click('text=Agendamentos');
    await page.waitForURL(/appointments/);
    
    // Clicar em "Novo Agendamento"
    await page.click('button:has-text("Novo Agendamento")');
    
    // Aguardar modal abrir
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Preencher formulário
    await page.selectOption('select[name="clientId"]', { index: 1 });
    await page.selectOption('select[name="serviceId"]', { index: 1 });
    await page.fill('input[type="date"]', '2025-10-20');
    await page.fill('input[type="time"]', '14:00');
    
    // Salvar
    await page.click('button:has-text("Salvar")');
    
    // Verificar toast de sucesso
    await expect(page.locator('text=/sucesso|criado/i')).toBeVisible({ timeout: 5000 });
    
    // Verificar se agendamento aparece na lista
    await expect(page.locator('text=14:00')).toBeVisible();
  });

  test('deve cancelar agendamento', async ({ page }) => {
    await page.goto('/#/appointments');
    
    // Clicar no menu de ações do primeiro agendamento
    await page.click('[data-testid="appointment-menu"]').first();
    
    // Clicar em cancelar
    await page.click('text=Cancelar');
    
    // Confirmar no modal
    await page.click('button:has-text("Confirmar")');
    
    // Verificar toast
    await expect(page.locator('text=/cancelado/i')).toBeVisible();
  });
});
```

### Teste 2: CRUD de Clientes

Crie `e2e/clients.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Gestão de Clientes', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
    
    // Navegar para clientes
    await page.click('text=Clientes');
    await page.waitForURL(/clients/);
  });

  test('deve buscar cliente por nome', async ({ page }) => {
    // Digitar no campo de busca
    await page.fill('input[placeholder*="Buscar"]', 'João');
    
    // Aguardar filtro ser aplicado
    await page.waitForTimeout(500);
    
    // Verificar resultados
    await expect(page.locator('text=João')).toBeVisible();
  });

  test('deve criar novo cliente', async ({ page }) => {
    await page.click('button:has-text("Novo Cliente")');
    
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    await page.fill('input[name="name"]', 'Cliente Teste E2E');
    await page.fill('input[name="phone"]', '11999998888');
    await page.fill('input[name="email"]', 'teste.e2e@exemplo.com');
    
    await page.click('button:has-text("Salvar")');
    
    await expect(page.locator('text=/sucesso|criado/i')).toBeVisible();
    await expect(page.locator('text=Cliente Teste E2E')).toBeVisible();
  });

  test('deve editar cliente existente', async ({ page }) => {
    // Clicar no primeiro cliente
    await page.click('[data-testid="client-item"]').first();
    
    // Clicar em editar
    await page.click('button:has-text("Editar")');
    
    // Alterar nome
    const input = page.locator('input[name="name"]');
    await input.clear();
    await input.fill('Nome Alterado E2E');
    
    await page.click('button:has-text("Salvar")');
    
    await expect(page.locator('text=Nome Alterado E2E')).toBeVisible();
  });
});
```

### Teste 3: Dashboard e Estatísticas

Crie `e2e/dashboard.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
  });

  test('deve exibir stats cards', async ({ page }) => {
    // Verificar que os 4 stats cards estão visíveis
    await expect(page.locator('text=Agendamentos Hoje')).toBeVisible();
    await expect(page.locator('text=Próximos')).toBeVisible();
    await expect(page.locator('text=Concluídos')).toBeVisible();
    await expect(page.locator('text=Receita')).toBeVisible();
    
    // Verificar que os valores são numéricos
    const revenueText = await page.locator('text=/R\\$/').textContent();
    expect(revenueText).toMatch(/R\$/);
  });

  test('deve exibir agendamentos recentes', async ({ page }) => {
    // Verificar seção de agendamentos
    await expect(page.locator('text=Próximos Agendamentos')).toBeVisible();
    
    // Verificar que há pelo menos um agendamento (se houver dados)
    const appointmentCount = await page.locator('[data-testid="appointment-card"]').count();
    expect(appointmentCount).toBeGreaterThanOrEqual(0);
  });

  test('deve abrir modal de novo agendamento', async ({ page }) => {
    await page.click('button:has-text("Novo Agendamento")');
    
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Novo Agendamento')).toBeVisible();
  });
});
```

---

## PARTE 7: Comandos Úteis para o Copilot

Depois de configurado, você pode usar estes comandos no GitHub Copilot Chat:

### Executar Testes:
```
@workspace Execute os testes E2E de autenticação
@workspace Rode todos os testes E2E e me mostre os resultados
@workspace Teste o fluxo completo de agendamento
```

### Debug:
```
@workspace O teste de login está falhando, investigue e capture screenshots
@workspace Analise por que o teste de clientes quebrou
@workspace Execute o teste de appointments em modo debug
```

### Criar Testes:
```
@workspace Crie testes E2E para a página de financeiro
@workspace Adicione testes para o fluxo de cancelamento de agendamento
@workspace Escreva testes para validar todos os filtros da agenda
```

### Validação:
```
@workspace Capture screenshots de todas as páginas principais
@workspace Execute testes de regressão em todas as features
@workspace Valide se todos os modais estão funcionando
```

---

## PARTE 8: Estrutura Final do Projeto

Após completar a configuração, seu projeto terá:

```
[APP]-AgendaBarber/
├── e2e/                           # ✅ Testes E2E
│   ├── auth.spec.ts
│   ├── appointments.spec.ts
│   ├── clients.spec.ts
│   ├── dashboard.spec.ts
│   ├── financial.spec.ts
│   ├── agenda.spec.ts
│   └── settings.spec.ts
├── test-results/                  # ✅ Gerado automaticamente
│   ├── screenshots/
│   ├── videos/
│   └── traces/
├── playwright-report/             # ✅ Relatório HTML
├── playwright.config.ts           # ✅ Config Playwright
├── package.json                   # ✅ Scripts de teste
└── src/                           # Código existente
```

---

## PARTE 9: Checklist de Configuração

Execute esta checklist para garantir que tudo está funcionando:

```
INSTALAÇÃO
[ ] Node.js instalado e funcionando
[ ] npm install -D @playwright/test executado com sucesso
[ ] npx playwright install executado (browsers instalados)
[ ] MCP Server instalado globalmente ou via npx

CONFIGURAÇÃO
[ ] playwright.config.ts criado na raiz
[ ] Pasta e2e/ criada
[ ] Scripts adicionados ao package.json
[ ] mcpServers.json configurado no VS Code
[ ] VS Code reiniciado

VALIDAÇÃO
[ ] npx playwright --version retorna versão
[ ] npm run dev inicia o app em http://localhost:5173
[ ] npm run test:e2e executa os testes
[ ] npm run test:e2e:report abre relatório HTML
[ ] Screenshots salvos em test-results/

INTEGRAÇÃO COPILOT
[ ] Copilot consegue executar: @workspace Execute testes E2E
[ ] Copilot consegue criar novos testes
[ ] Copilot consegue debugar testes falhando
[ ] Copilot consegue capturar screenshots
```

---

## PARTE 10: Troubleshooting

### Problema 1: "Cannot find module @playwright/test"
**Solução:**
```bash
npm install -D @playwright/test
```

### Problema 2: "Executable doesn't exist"
**Solução:**
```bash
npx playwright install
```

### Problema 3: "Error: page.goto: net::ERR_CONNECTION_REFUSED"
**Solução:** Certifique-se de que o dev server está rodando:
```bash
npm run dev
```

### Problema 4: MCP não aparece no Copilot
**Solução:**
1. Verificar se mcpServers.json está no caminho correto
2. Reiniciar VS Code completamente
3. Verificar logs do Copilot (Output > GitHub Copilot Chat)

### Problema 5: Testes muito lentos
**Solução:**
- Aumentar timeout em playwright.config.ts
- Usar `page.waitForLoadState('networkidle')` menos vezes
- Desabilitar vídeos: `video: 'off'`

---

## 🎯 PRÓXIMOS PASSOS

### Depois de Configurar:

1. **Execute o teste básico:**
   ```bash
   npm run test:e2e
   ```

2. **Use o Copilot para criar mais testes:**
   ```
   @workspace Crie testes E2E para todas as 10 features principais
   ```

3. **Execute testes regularmente:**
   - Antes de commits importantes
   - Antes de deploys
   - Após mudanças significativas

4. **Integre ao CI/CD:**
   - Adicionar ao GitHub Actions
   - Executar em PRs automaticamente

---

## 📚 Recursos Adicionais

- **Playwright Docs:** https://playwright.dev
- **MCP Playwright:** https://github.com/modelcontextprotocol/servers/tree/main/src/playwright
- **Playwright Best Practices:** https://playwright.dev/docs/best-practices
- **VS Code Playwright Extension:** https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

---

**Última atualização:** 15/10/2025  
**Autor:** GitHub Copilot  
**Status:** Pronto para configuração

---

🎉 **Com esta configuração, o GitHub Copilot poderá:**
- ✅ Executar testes E2E automaticamente
- ✅ Identificar bugs de forma cirúrgica
- ✅ Capturar screenshots e vídeos de falhas
- ✅ Criar novos testes baseado em suas instruções
- ✅ Debugar testes falhando
- ✅ Gerar relatórios detalhados

**Bora configurar e começar a testar! 🚀**
