/**
 * ClientsStore - Store global de clientes usando Zustand
 * 
 * Gerencia a base de clientes da barbearia.
 * 
 * Estado:
 * - clients: Lista de clientes
 * - loading: Estado de carregamento
 * - error: Mensagem de erro
 * 
 * Ações:
 * - fetchClients: Busca todos os clientes
 * - createClient: Cria novo cliente
 * - updateClient: Atualiza cliente existente
 * - deleteClient: Remove cliente
 * - updateStatus: Atualiza status do cliente (Ativo/Inativo)
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 5 (Clientes)
 * - DESCRICAO_FEATURES.md - Seção 4 (Gestão de Clientes)
 * - ESTADOS_ESPECIAIS.md - Seção "Clientes"
 * 
 * Padrão de uso:
 * ```typescript
 * const { clients, loading, fetchClients } = useClientsStore();
 * 
 * useEffect(() => {
 *   fetchClients();
 * }, []);
 * ```
 */

import { create } from 'zustand';
import { Client, ClientStatus } from '@/types';
import { BaseService } from '@/services/base.service';
import { orderBy } from 'firebase/firestore';

// Instância do serviço de Firestore
const clientsService = new BaseService<Client>('clients');

// Tipos para criação/atualização (sem ID)
export type CreateClientData = Omit<Client, 'id' | 'visits' | 'spent' | 'lastVisit' | 'avatarInitials' | 'status'> & {
  visits?: number;
  spent?: number;
  lastVisit?: string;
  avatarInitials?: string; // Opcional - será gerado se não fornecido
  status?: ClientStatus; // Opcional - default Active
};
export type UpdateClientData = Partial<Omit<Client, 'id'>>;

interface ClientsState {
  // Estado
  clients: Client[];
  loading: boolean;
  error: string | null;

  // Ações de dados
  fetchClients: () => Promise<void>;
  createClient: (data: CreateClientData) => Promise<string>;
  updateClient: (id: string, data: UpdateClientData) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  updateStatus: (id: string, status: ClientStatus) => Promise<void>;

  // Ações de controle
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  // Estado inicial
  clients: [],
  loading: false,
  error: null,

  // Busca todos os clientes
  fetchClients: async () => {
    set({ loading: true, error: null });
    
    try {
      const clients = await clientsService.getAll([
        orderBy('name', 'asc')
      ]);
      
      set({ 
        clients, 
        loading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao carregar clientes';
      
      console.error('Erro ao buscar clientes:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
    }
  },

  // Cria um novo cliente
  createClient: async (data: CreateClientData) => {
    set({ loading: true, error: null });
    
    try {
      // Validações
      if (!data.name) {
        throw new Error('Nome é obrigatório');
      }

      if (!data.phone) {
        throw new Error('Telefone é obrigatório');
      }

      if (!data.email) {
        throw new Error('Email é obrigatório');
      }

      // Gera iniciais do avatar
      const avatarInitials = data.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

      // Cria cliente no Firestore
      const id = await clientsService.create({
        ...data,
        avatarInitials,
        visits: data.visits || 0,
        spent: data.spent || 0,
        lastVisit: data.lastVisit || '',
        status: data.status || ClientStatus.Active,
      });
      
      // Atualiza estado local
      const newClient: Client = {
        id,
        ...data,
        avatarInitials,
        visits: data.visits || 0,
        spent: data.spent || 0,
        lastVisit: data.lastVisit || '',
        status: data.status || ClientStatus.Active,
      };
      
      set((state) => ({ 
        clients: [...state.clients, newClient].sort((a, b) => 
          a.name.localeCompare(b.name)
        ),
        loading: false,
        error: null,
      }));

      return id;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao criar cliente';
      
      console.error('Erro ao criar cliente:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  },

  // Atualiza um cliente existente
  updateClient: async (id: string, data: UpdateClientData) => {
    set({ loading: true, error: null });
    
    try {
      // Valida se cliente existe
      const client = get().clients.find(c => c.id === id);
      if (!client) {
        throw new Error('Cliente não encontrado');
      }

      // Validações
      // Nenhuma validação adicional necessária no momento

      // Atualiza iniciais se nome mudou
      let updateData = { ...data };
      if (data.name) {
        const avatarInitials = data.name
          .split(' ')
          .map(word => word[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        updateData = { ...updateData, avatarInitials };
      }

      // Atualiza no Firestore
      await clientsService.update(id, updateData);
      
      // Atualiza estado local
      set((state) => ({ 
        clients: state.clients
          .map(c => c.id === id ? { ...c, ...updateData } : c)
          .sort((a, b) => a.name.localeCompare(b.name)),
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao atualizar cliente';
      
      console.error('Erro ao atualizar cliente:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  },

  // Remove um cliente
  deleteClient: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      // Valida se cliente existe
      const client = get().clients.find(c => c.id === id);
      if (!client) {
        throw new Error('Cliente não encontrado');
      }

      // Remove do Firestore
      await clientsService.delete(id);
      
      // Remove do estado local
      set((state) => ({ 
        clients: state.clients.filter(c => c.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao excluir cliente';
      
      console.error('Erro ao excluir cliente:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  },

  // Atualiza apenas o status (helper convenience)
  updateStatus: async (id: string, status: ClientStatus) => {
    try {
      await get().updateClient(id, { status });
    } catch (error) {
      throw error;
    }
  },

  // Ações de controle
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error, loading: false }),
  
  clearError: () => set({ error: null }),
}));
