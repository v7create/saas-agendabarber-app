/**
 * FinancialStore - Store Zustand para gerenciar transações financeiras
 * 
 * Gerencia todas as transações (receitas e despesas) com:
 * - CRUD completo de transações
 * - Filtragem por período (dia, semana, mês)
 * - Cálculo de saldo e estatísticas
 * - Categorização de transações
 * - Integração com Firebase Firestore
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 6 (Financeiro)
 * - DESCRICAO_FEATURES.md - Seção 5 (Controle Financeiro)
 * - ESTADOS_ESPECIAIS.md - Estados de loading/error/empty para Financeiro
 * 
 * Exemplo de uso:
 * ```typescript
 * const { transactions, fetchByDateRange, createTransaction } = useFinancialStore();
 * 
 * // Buscar transações do mês
 * await fetchByDateRange('2024-01-01', '2024-01-31');
 * 
 * // Criar receita
 * await createTransaction({
 *   type: TransactionType.Income,
 *   description: 'Corte de cabelo - João Silva',
 *   category: 'Serviços',
 *   amount: 50,
 *   date: '2024-01-15',
 *   time: '10:30',
 *   paymentMethod: 'Dinheiro'
 * });
 * ```
 */

import { create } from 'zustand';
import { Transaction, TransactionType } from '@/types';
import { BaseService } from '@/services/base.service';

const transactionsService = new BaseService<Transaction>('transactions');

// Types para criação/atualização
export type CreateTransactionData = Omit<Transaction, 'id'>;
export type UpdateTransactionData = Partial<CreateTransactionData>;

interface FinancialState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchTransactions: () => Promise<void>;
  fetchByDateRange: (startDate: string, endDate: string) => Promise<void>;
  fetchByMonth: (year: number, month: number) => Promise<void>;
  createTransaction: (data: CreateTransactionData) => Promise<string>;
  updateTransaction: (id: string, data: UpdateTransactionData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  /**
   * Busca todas as transações
   * Ordenadas por data (decrescente) e hora (decrescente)
   */
  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await transactionsService.getAll();
      
      // Ordenar por data (mais recente primeiro), depois por hora
      const sorted = data.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      });

      set({ transactions: sorted, loading: false });
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      set({ 
        error: 'Erro ao carregar transações', 
        loading: false 
      });
    }
  },

  /**
   * Busca transações em um período específico
   */
  fetchByDateRange: async (startDate: string, endDate: string) => {
    set({ loading: true, error: null });
    try {
      const allTransactions = await transactionsService.getAll();
      
      // Filtrar por intervalo de datas
      const filtered = allTransactions.filter(t => 
        t.date >= startDate && t.date <= endDate
      );

      // Ordenar por data e hora
      const sorted = filtered.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      });

      set({ transactions: sorted, loading: false });
    } catch (err) {
      console.error('Erro ao buscar transações por período:', err);
      set({ 
        error: 'Erro ao carregar transações do período', 
        loading: false 
      });
    }
  },

  /**
   * Busca transações de um mês específico
   */
  fetchByMonth: async (year: number, month: number) => {
    // Calcular primeiro e último dia do mês
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];

    return get().fetchByDateRange(startDate, endDate);
  },

  /**
   * Cria uma nova transação
   */
  createTransaction: async (data: CreateTransactionData) => {
    set({ loading: true, error: null });
    try {
      // Validações
      if (!data.description.trim()) {
        throw new Error('Descrição é obrigatória');
      }
      if (!data.category.trim()) {
        throw new Error('Categoria é obrigatória');
      }
      if (data.amount <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      if (!data.date) {
        throw new Error('Data é obrigatória');
      }
      if (!data.time) {
        throw new Error('Hora é obrigatória');
      }
      if (!data.paymentMethod.trim()) {
        throw new Error('Método de pagamento é obrigatório');
      }

      // Criar transação
      const id = await transactionsService.create(data);

      // Adicionar ao estado local
      const newTransaction: Transaction = { ...data, id };
      const updated = [...get().transactions, newTransaction].sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      });

      set({ 
        transactions: updated, 
        loading: false 
      });

      return id;
    } catch (err) {
      console.error('Erro ao criar transação:', err);
      const message = err instanceof Error ? err.message : 'Erro ao criar transação';
      set({ error: message, loading: false });
      throw err;
    }
  },

  /**
   * Atualiza uma transação existente
   */
  updateTransaction: async (id: string, data: UpdateTransactionData) => {
    set({ loading: true, error: null });
    try {
      // Buscar transação atual
      const current = get().transactions.find(t => t.id === id);
      if (!current) {
        throw new Error('Transação não encontrada');
      }

      // Validações (se campos fornecidos)
      if (data.description !== undefined && !data.description.trim()) {
        throw new Error('Descrição não pode ser vazia');
      }
      if (data.category !== undefined && !data.category.trim()) {
        throw new Error('Categoria não pode ser vazia');
      }
      if (data.amount !== undefined && data.amount <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      if (data.paymentMethod !== undefined && !data.paymentMethod.trim()) {
        throw new Error('Método de pagamento não pode ser vazio');
      }

      // Atualizar no Firestore
      await transactionsService.update(id, data);

      // Atualizar estado local
      const updated = get().transactions.map(t =>
        t.id === id ? { ...t, ...data } : t
      ).sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      });

      set({ 
        transactions: updated, 
        loading: false 
      });
    } catch (err) {
      console.error('Erro ao atualizar transação:', err);
      const message = err instanceof Error ? err.message : 'Erro ao atualizar transação';
      set({ error: message, loading: false });
      throw err;
    }
  },

  /**
   * Remove uma transação
   */
  deleteTransaction: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Remover do Firestore
      await transactionsService.delete(id);

      // Remover do estado local
      const updated = get().transactions.filter(t => t.id !== id);
      set({ 
        transactions: updated, 
        loading: false 
      });
    } catch (err) {
      console.error('Erro ao remover transação:', err);
      set({ 
        error: 'Erro ao remover transação', 
        loading: false 
      });
      throw err;
    }
  },

  /**
   * Limpa mensagem de erro
   */
  clearError: () => {
    set({ error: null });
  },
}));
