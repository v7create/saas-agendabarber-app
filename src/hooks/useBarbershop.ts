/**
 * useBarbershop - Hook para gerenciar configurações da barbearia
 * 
 * Facilita o uso do BarbershopStore em componentes React.
 * 
 * Features:
 * - Acesso às configurações
 * - Gerenciamento de profissionais
 * - Configuração de horários
 * - Métodos de pagamento
 * - Informações da barbearia
 * - Auto-loading inicial (opcional)
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 10 (Configurações)
 * - DESCRICAO_FEATURES.md - Seção 7 (Perfil e Configurações)
 * 
 * Exemplo de uso:
 * ```typescript
 * function SettingsPage() {
 *   const { 
 *     barbers, 
 *     businessHours,
 *     addBarber,
 *     isOpen 
 *   } = useBarbershop({ autoFetch: true });
 * 
 *   const open = isOpen();
 * 
 *   return (
 *     <div>
 *       <p>Status: {open ? 'Aberto' : 'Fechado'}</p>
 *       {barbers.map(barber => (
 *         <div key={barber.id}>{barber.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

import { useEffect } from 'react';
import { useBarbershopStore } from '@/store/barbershop.store';
import { Barbershop, WorkingHours } from '@/types';

interface UseBarbershopOptions {
  /**
   * Busca automática ao montar
   */
  autoFetch?: boolean;
}

export function useBarbershop(options: UseBarbershopOptions = {}) {
  const { autoFetch = false } = options;

  // Estado do store
  const barbers = useBarbershopStore((state) => state.barbers);
  const businessHours = useBarbershopStore((state) => state.businessHours);
  const paymentMethods = useBarbershopStore((state) => state.paymentMethods);
  const shopInfo = useBarbershopStore((state) => state.shopInfo);
  const loading = useBarbershopStore((state) => state.loading);
  const error = useBarbershopStore((state) => state.error);

  // Ações
  const fetchSettings = useBarbershopStore((state) => state.fetchSettings);
  const updateSettings = useBarbershopStore((state) => state.updateSettings);
  const addBarber = useBarbershopStore((state) => state.addBarber);
  const updateBarber = useBarbershopStore((state) => state.updateBarber);
  const removeBarber = useBarbershopStore((state) => state.removeBarber);
  const updateBusinessHours = useBarbershopStore((state) => state.updateBusinessHours);
  const addPaymentMethod = useBarbershopStore((state) => state.addPaymentMethod);
  const removePaymentMethod = useBarbershopStore((state) => state.removePaymentMethod);
  const updateShopInfo = useBarbershopStore((state) => state.updateShopInfo);
  const clearError = useBarbershopStore((state) => state.clearError);

  // Auto-fetch ao montar
  useEffect(() => {
    if (autoFetch) {
      fetchSettings();
    }
  }, [autoFetch, fetchSettings]);

  // Helpers
  const helpers = {
    /**
     * Busca profissional por ID
     */
    getBarberById: (id: string) => {
      return barbers.find(b => b.id === id) || null;
    },

    /**
     * Busca profissional por nome
     */
    getBarberByName: (name: string) => {
      return barbers.find(b => 
        b.name.toLowerCase() === name.toLowerCase()
      ) || null;
    },

    /**
     * Verifica se barbearia está aberta agora
     */
    isOpen: () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0-6
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Encontra a configuração para o dia atual
      const todaySchedule = businessHours.schedule.find(s => s.dayOfWeek === currentDay);

      // Se não tem schedule ou não está aberto hoje
      if (!todaySchedule || !todaySchedule.isOpen) {
        return false;
      }

      // Se não tem horário definido, assume fechado
      if (!todaySchedule.startTime || !todaySchedule.endTime) {
        return false;
      }

      // Verifica horário
      return currentTime >= todaySchedule.startTime && currentTime <= todaySchedule.endTime;
    },

    /**
     * Verifica se barbearia abre em um dia específico
     */
    isOpenOnDay: (dayOfWeek: number) => {
      const schedule = businessHours.schedule.find(s => s.dayOfWeek === dayOfWeek);
      return schedule ? schedule.isOpen : false;
    },

    /**
     * Retorna horário formatado de hoje
     */
    getFormattedHours: () => {
      const now = new Date();
      const currentDay = now.getDay();
      const todaySchedule = businessHours.schedule.find(s => s.dayOfWeek === currentDay);

      if (!todaySchedule || !todaySchedule.isOpen || !todaySchedule.startTime || !todaySchedule.endTime) {
        return 'Fechado';
      }

      return `${todaySchedule.startTime} - ${todaySchedule.endTime}`;
    },

    /**
     * Retorna dias de funcionamento como texto
     */
    getWorkingDaysText: () => {
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return businessHours.schedule
        .filter(s => s.isOpen)
        .map(s => dayNames[s.dayOfWeek])
        .join(', ');
    },

    /**
     * Verifica se método de pagamento é aceito
     */
    acceptsPaymentMethod: (method: string) => {
      return paymentMethods.some(m => 
        m.toLowerCase() === method.toLowerCase()
      );
    },

    /**
     * Retorna estatísticas
     */
    getStats: () => {
      return {
        totalBarbers: barbers.length,
        totalPaymentMethods: paymentMethods.length,
        workingDays: businessHours.schedule.filter(s => s.isOpen).length,
        isConfigured: barbers.length > 0 && shopInfo.name.trim() !== '',
      };
    },

    /**
     * Valida se configurações estão completas
     */
    isConfigurationComplete: () => {
      return (
        barbers.length > 0 &&
        shopInfo.name.trim() !== '' &&
        shopInfo.phone.trim() !== '' &&
        paymentMethods.length > 0
      );
    },

    /**
     * Retorna lista de problemas de configuração
     */
    getConfigurationIssues: () => {
      const issues: string[] = [];

      if (barbers.length === 0) {
        issues.push('Nenhum profissional cadastrado');
      }
      if (!shopInfo.name.trim()) {
        issues.push('Nome da barbearia não configurado');
      }
      if (!shopInfo.phone.trim()) {
        issues.push('Telefone não configurado');
      }
      if (!shopInfo.address.trim()) {
        issues.push('Endereço não configurado');
      }
      if (paymentMethods.length === 0) {
        issues.push('Nenhum método de pagamento cadastrado');
      }
      if (businessHours.schedule.filter(s => s.isOpen).length === 0) {
        issues.push('Nenhum dia de funcionamento configurado');
      }

      return issues;
    },
  };

  return {
    // Estado
    barbers,
    businessHours,
    paymentMethods,
    shopInfo,
    loading,
    error,

    // Ações
    fetchSettings,
    updateSettings,
    addBarber,
    updateBarber,
    removeBarber,
    updateBusinessHours,
    addPaymentMethod,
    removePaymentMethod,
    updateShopInfo,
    clearError,

    // Helpers
    ...helpers,
  };
}
