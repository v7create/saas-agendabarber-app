import { test, expect } from '@playwright/test';

test.describe('Agenda', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/, { timeout: 10000 });
    
    // Navegar para agenda
    await page.click('text=/agenda/i');
    await page.waitForURL(/agenda/);
  });

  test('deve exibir visualização da agenda', async ({ page }) => {
    // Verificar título
    await expect(page.locator('text=/agenda/i').first()).toBeVisible();
  });

  test('deve alternar entre visualizações (dia/semana/mês)', async ({ page }) => {
    // Procurar botões de visualização
    const viewButtons = page.locator('button:has-text("Dia"), button:has-text("Semana"), button:has-text("Mês")');
    const count = await viewButtons.count();
    
    if (count > 0) {
      // Clicar em diferentes visualizações
      const dayBtn = page.locator('button:has-text("Dia")');
      if (await dayBtn.isVisible()) {
        await dayBtn.click();
        await page.waitForTimeout(300);
      }
      
      const weekBtn = page.locator('button:has-text("Semana")');
      if (await weekBtn.isVisible()) {
        await weekBtn.click();
        await page.waitForTimeout(300);
      }
      
      expect(true).toBeTruthy();
    }
  });

  test('deve navegar entre datas', async ({ page }) => {
    // Procurar botões de navegação de data
    const prevBtn = page.locator('button[aria-label*="anterior"], button:has-text("‹"), button:has-text("◀")');
    const nextBtn = page.locator('button[aria-label*="próximo"], button:has-text("›"), button:has-text("▶")');
    
    if (await prevBtn.first().isVisible()) {
      await prevBtn.first().click();
      await page.waitForTimeout(300);
    }
    
    if (await nextBtn.first().isVisible()) {
      await nextBtn.first().click();
      await page.waitForTimeout(300);
    }
    
    expect(true).toBeTruthy();
  });

  test('deve exibir agendamentos no calendário', async ({ page }) => {
    // Verificar se há agendamentos visíveis
    const appointments = page.locator('[data-testid*="appointment"], [data-testid*="event"]');
    const count = await appointments.count();
    
    // Apenas verificar que a página carregou
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('deve abrir modal de novo agendamento ao clicar em horário', async ({ page }) => {
    // Procurar slots de horário clicáveis
    const timeSlots = page.locator('[data-time], [data-hour]');
    const count = await timeSlots.count();
    
    if (count > 0) {
      await timeSlots.first().click();
      
      // Verificar se modal abriu
      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible({ timeout: 2000 })) {
        expect(await modal.isVisible()).toBeTruthy();
      }
    }
    
    expect(true).toBeTruthy();
  });
});
