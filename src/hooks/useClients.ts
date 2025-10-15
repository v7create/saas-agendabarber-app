/**
 * useClients - Hook para gerenciar clientes
 * 
 * Facilita o uso do ClientsStore em componentes React.
 * 
 * Features:
 * - Acesso ao estado de clientes
 * - Métodos CRUD completos
 * - Filtros por status, avaliação
 * - Busca por nome/email/telefone
 * - Estatísticas de clientes
 * - Auto-loading inicial (opcional)
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 5 (Clientes)
 * - DESCRICAO_FEATURES.md - Seção 4 (Gestão de Clientes)
 * 
 * Exemplo de uso:
 * ```typescript
 * function ClientsPage() {
 *   const { 
 *     clients, 
 *     loading,
 *     searchClients,
 *     getTopClients 
 *   } = useClients({ autoFetch: true });
 * 
 *   const topClients = getTopClients(10);
 * 
 *   return (
 *     <div>
 *       {loading && <p>Carregando...</p>}
 *       {clients.map(client => (
 *         <ClientCard key={client.id} client={client} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

import { useEffect } from 'react';
import { 
  useClientsStore, 
  CreateClientData, 
  UpdateClientData 
} from '@/store/clients.store';
import { ClientStatus } from '@/types';

interface UseClientsOptions {
  /**
   * Busca automática ao montar
   */
  autoFetch?: boolean;
}

export function useClients(options: UseClientsOptions = {}) {
  const { autoFetch = false } = options;

  // Estado do store
  const clients = useClientsStore((state) => state.clients);
  const loading = useClientsStore((state) => state.loading);
  const error = useClientsStore((state) => state.error);

  // Ações
  const fetchClients = useClientsStore((state) => state.fetchClients);
  const createClient = useClientsStore((state) => state.createClient);
  const updateClient = useClientsStore((state) => state.updateClient);
  const deleteClient = useClientsStore((state) => state.deleteClient);
  const updateStatus = useClientsStore((state) => state.updateStatus);
  const clearError = useClientsStore((state) => state.clearError);

  // Auto-fetch ao montar
  useEffect(() => {
    if (autoFetch) {
      fetchClients();
    }
  }, [autoFetch, fetchClients]);

  // Helpers
  const helpers = {
    /**
     * Busca cliente por ID
     */
    getClientById: (id: string) => {
      return clients.find(c => c.id === id) || null;
    },

    /**
     * Busca clientes por nome, email ou telefone
     */
    searchClients: (query: string) => {
      const lowerQuery = query.toLowerCase();
      return clients.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.phone.includes(query)
      );
    },

    /**
     * Filtra clientes por status
     */
    filterByStatus: (status: ClientStatus) => {
      return clients.filter(c => c.status === status);
    },

    /**
     * Filtra clientes por avaliação mínima
     */
    filterByRating: (minRating: number) => {
      return clients.filter(c => c.rating >= minRating);
    },

    /**
     * Retorna clientes ativos
     */
    getActiveClients: () => {
      return clients.filter(c => c.status === ClientStatus.Active);
    },

    /**
     * Retorna clientes inativos
     */
    getInactiveClients: () => {
      return clients.filter(c => c.status === ClientStatus.Inactive);
    },

    /**
     * Retorna top clientes por gasto
     */
    getTopClients: (limit: number = 10) => {
      return [...clients]
        .sort((a, b) => b.spent - a.spent)
        .slice(0, limit);
    },

    /**
     * Retorna clientes frequentes (mais visitas)
     */
    getFrequentClients: (limit: number = 10) => {
      return [...clients]
        .sort((a, b) => b.visits - a.visits)
        .slice(0, limit);
    },

    /**
     * Retorna clientes com melhor avaliação
     */
    getTopRatedClients: (limit: number = 10) => {
      return [...clients]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    },

    /**
     * Retorna clientes recentes (última visita)
     */
    getRecentClients: (limit: number = 10) => {
      return [...clients]
        .filter(c => c.lastVisit)
        .sort((a, b) => b.lastVisit.localeCompare(a.lastVisit))
        .slice(0, limit);
    },

    /**
     * Retorna estatísticas dos clientes
     */
    getStats: () => {
      const total = clients.length;
      const active = clients.filter(c => c.status === ClientStatus.Active).length;
      const inactive = clients.filter(c => c.status === ClientStatus.Inactive).length;
      
      const totalVisits = clients.reduce((sum, c) => sum + c.visits, 0);
      const totalRevenue = clients.reduce((sum, c) => sum + c.spent, 0);
      
      const averageVisits = total > 0 ? totalVisits / total : 0;
      const averageSpent = total > 0 ? totalRevenue / total : 0;
      
      const averageRating = total > 0 
        ? clients.reduce((sum, c) => sum + c.rating, 0) / total 
        : 0;

      return {
        total,
        active,
        inactive,
        totalVisits,
        totalRevenue,
        averageVisits,
        averageSpent,
        averageRating,
      };
    },

    /**
     * Valida se email já está em uso
     */
    isEmailDuplicate: (email: string, excludeId?: string) => {
      return clients.some(c => 
        c.email.toLowerCase() === email.toLowerCase() && 
        c.id !== excludeId
      );
    },

    /**
     * Valida se telefone já está em uso
     */
    isPhoneDuplicate: (phone: string, excludeId?: string) => {
      return clients.some(c => 
        c.phone === phone && 
        c.id !== excludeId
      );
    },
  };

  return {
    // Estado
    clients,
    loading,
    error,

    // Ações
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    updateStatus,
    clearError,

    // Helpers
    ...helpers,
  };
}
