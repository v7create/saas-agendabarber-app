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
    baseURL: 'http://localhost:3000',
    
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
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
