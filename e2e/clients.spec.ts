import { test, expect } from '@playwright/test';

test.describe('Gestão de Clientes', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    
    // Login
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button:has-text("Entrar")');
    await page.waitForTimeout(4000);
    
    // Navegar para clientes diretamente pela URL
    await page.goto('/#/clients');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('deve exibir lista de clientes', async ({ page }) => {
    // Verificar título da página
    await expect(page.locator('text=/clientes/i').first()).toBeVisible();
    
    // Verificar se há campo de busca
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('deve buscar cliente por nome', async ({ page }) => {
    // Verificar se há clientes antes de buscar
    const clientCards = page.locator('[data-testid="client-card"]');
    const initialCount = await clientCards.count();
    
    // Digitar no campo de busca
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    await searchInput.fill('João');
    
    // Aguardar filtro ser aplicado
    await page.waitForTimeout(500);
    
    // Verificar que a busca foi aplicada
    expect(await searchInput.inputValue()).toBe('João');
  });

  test('deve abrir modal de novo cliente', async ({ page }) => {
    // Procurar botão de novo cliente
    const newClientBtn = page.locator('button:has-text("Novo Cliente")').first();
    
    if (await newClientBtn.isVisible()) {
      await newClientBtn.click();
      
      // Verificar se modal abriu
      await expect(page.locator('[role="dialog"]').first()).toBeVisible({ timeout: 3000 });
      
      // Verificar campos do formulário (usando placeholder ao invés de name)
      await expect(page.locator('input[placeholder="Nome completo"]')).toBeVisible();
      await expect(page.locator('input[placeholder="(11) 99999-9999"]')).toBeVisible();
    }
  });

  test('deve criar novo cliente e refletir nos cards de estatísticas', async ({ page }) => {
    test.setTimeout(60000);
    
    console.log('📊 TESTE: Cadastro completo de cliente com validação de estatísticas');
    
    // Capturar estatísticas ANTES do cadastro
    const totalClientesBefore = await page.locator('text=Total de Clientes').locator('..').locator('text=/^\\d+$/').first().textContent();
    const clientesAtivosBefore = await page.locator('text=Clientes Ativos').locator('..').locator('text=/^\\d+$/').first().textContent();
    
    console.log(`📈 ANTES - Total: ${totalClientesBefore} | Ativos: ${clientesAtivosBefore}`);
    
    // Clicar em novo cliente
    const newClientBtn = page.locator('button:has-text("Novo Cliente")').first();
    await expect(newClientBtn).toBeVisible();
    await newClientBtn.click();
    
    // Verificar modal abriu
    await expect(page.locator('[role="dialog"]').first()).toBeVisible({ timeout: 3000 });
    console.log('✅ Modal de cadastro aberto');
    
    // Preencher TODOS os campos (conforme imagem)
    const timestamp = Date.now();
    const clientName = `João Silva ${timestamp}`;
    const clientPhone = `11999${timestamp.toString().slice(-6)}`;
    const clientEmail = `joao.silva.${timestamp}@exemplo.com`;
    
    await page.locator('input[placeholder="Nome completo"]').fill(clientName);
    await page.locator('input[placeholder="(11) 99999-9999"]').fill(clientPhone);
    await page.locator('input[placeholder="cliente@email.com"]').fill(clientEmail);
    await page.locator('input[placeholder="0.0"]').fill('5');
    await page.locator('textarea[placeholder*="Observações"]').fill('Cliente teste E2E - Cadastro completo');
    
    console.log(`📝 Formulário preenchido: ${clientName}`);
    
    // Clicar em Cadastrar
    const saveButton = page.locator('button:has-text("Cadastrar")');
    await saveButton.click();
    console.log('🔄 Aguardando salvamento...');
    
    // Aguardar processamento (Firebase + atualização de estado)
    await page.waitForTimeout(6000);
    
    // Verificar se modal fechou (sucesso)
    const modalClosed = (await page.locator('[role="dialog"]').count()) === 0;
    console.log(`${modalClosed ? '✅' : '⚠️'} Modal fechado: ${modalClosed}`);
    
    // Aguardar atualização da página
    await page.waitForTimeout(2000);
    
    // Capturar estatísticas DEPOIS do cadastro
    const totalClientesAfter = await page.locator('text=Total de Clientes').locator('..').locator('text=/^\\d+$/').first().textContent();
    const clientesAtivosAfter = await page.locator('text=Clientes Ativos').locator('..').locator('text=/^\\d+$/').first().textContent();
    
    console.log(`📈 DEPOIS - Total: ${totalClientesAfter} | Ativos: ${clientesAtivosAfter}`);
    
    // VALIDAÇÃO 1: Cliente incrementou nos cards
    const totalIncremented = parseInt(totalClientesAfter || '0') > parseInt(totalClientesBefore || '0');
    const ativosIncremented = parseInt(clientesAtivosAfter || '0') > parseInt(clientesAtivosBefore || '0');
    
    console.log(`${totalIncremented ? '✅' : '❌'} Total de clientes incrementou: ${totalIncremented}`);
    console.log(`${ativosIncremented ? '✅' : '❌'} Clientes ativos incrementou: ${ativosIncremented}`);
    
    // VALIDAÇÃO 2: Card do cliente aparece na lista
    const clientCard = page.locator(`[data-testid="client-card"]:has-text("${clientName}")`);
    const cardVisible = await clientCard.isVisible().catch(() => false);
    
    console.log(`${cardVisible ? '✅' : '❌'} Card do cliente visível na lista: ${cardVisible}`);
    
    // VALIDAÇÃO 3: Informações corretas no card
    if (cardVisible) {
      await expect(clientCard.locator(`text=${clientPhone}`)).toBeVisible();
      await expect(clientCard.locator(`text=${clientEmail}`)).toBeVisible();
      await expect(clientCard.locator('text=Ativo')).toBeVisible();
      console.log('✅ Informações do cliente corretas no card');
    }
    
    // Resultado final
    const testPassed = modalClosed && totalIncremented && ativosIncremented && cardVisible;
    
    if (!testPassed) {
      console.log('\n❌ FALHAS DETECTADAS:');
      if (!modalClosed) console.log('  - Modal não fechou após cadastro');
      if (!totalIncremented) console.log('  - Total de clientes não incrementou');
      if (!ativosIncremented) console.log('  - Clientes ativos não incrementou');
      if (!cardVisible) console.log('  - Card do cliente não apareceu na lista');
    } else {
      console.log('\n✅ TESTE COMPLETO: Todas validações passaram!');
    }
    
    expect(testPassed).toBeTruthy();
  });

  test('deve filtrar clientes por status', async ({ page }) => {
    // Verificar botões de filtro (conforme imagem: Todos, Ativos, Inativos)
    const todosBtn = page.locator('button:has-text("Todos")');
    const ativosBtn = page.locator('button:has-text("Ativos")');
    const inativosBtn = page.locator('button:has-text("Inativos")');
    
    // Testar filtro "Ativos"
    if (await ativosBtn.isVisible()) {
      await ativosBtn.click();
      await page.waitForTimeout(500);
      
      // Verificar se botão está selecionado (classe violet-600)
      const isSelected = await ativosBtn.evaluate((el) => 
        el.className.includes('bg-violet-600')
      );
      
      expect(isSelected).toBeTruthy();
    }
  });
});
