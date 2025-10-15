/**
 * ServicesStore - Store global de serviços usando Zustand
 * 
 * Gerencia o catálogo de serviços da barbearia em todo o aplicativo.
 * 
 * Estado:
 * - services: Lista de serviços disponíveis (cortes, barbas, etc.)
 * - loading: Indica se está carregando operação com serviços
 * - error: Mensagem de erro, se houver
 * 
 * Ações:
 * - fetchServices: Busca todos os serviços do Firestore
 * - createService: Cria um novo serviço
 * - updateService: Atualiza um serviço existente
 * - deleteService: Remove um serviço
 * - setLoading: Define estado de carregamento
 * - setError: Define mensagem de erro
 * - clearError: Limpa mensagem de erro
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 13 (Componentes Reutilizáveis)
 * - DESCRICAO_FEATURES.md - Seção 5.2 (Gestão de Serviços)
 * - ESTADOS_ESPECIAIS.md - Seção "Configurações > Serviços"
 * 
 * Padrão de uso:
 * ```typescript
 * const { services, loading, error, fetchServices } = useServicesStore();
 * 
 * useEffect(() => {
 *   fetchServices();
 * }, []);
 * ```
 */

import { create } from 'zustand';
import { Service } from '@/types';
import { BaseService } from '@/services/base.service';
import { orderBy } from 'firebase/firestore';

// Instância do serviço de Firestore
const servicesService = new BaseService<Service>('services');

// Tipos para criação/atualização (sem ID)
export type CreateServiceData = Omit<Service, 'id'>;
export type UpdateServiceData = Partial<Omit<Service, 'id'>>;

interface ServicesState {
  // Estado
  services: Service[];
  loading: boolean;
  error: string | null;

  // Ações de dados
  fetchServices: () => Promise<void>;
  createService: (data: CreateServiceData) => Promise<string>;
  updateService: (id: string, data: UpdateServiceData) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Ações de controle
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  // Estado inicial
  services: [],
  loading: false,
  error: null,

  // Busca todos os serviços do Firestore
  fetchServices: async () => {
    set({ loading: true, error: null });
    
    try {
      // Busca serviços ordenados por nome
      const services = await servicesService.getAll([
        orderBy('name', 'asc')
      ]);
      
      set({ 
        services, 
        loading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao carregar serviços';
      
      console.error('Erro ao buscar serviços:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
    }
  },

  // Cria um novo serviço
  createService: async (data: CreateServiceData) => {
    set({ loading: true, error: null });
    
    try {
      // Valida dados obrigatórios
      if (!data.name || !data.price || !data.duration) {
        throw new Error('Nome, preço e duração são obrigatórios');
      }

      if (data.price <= 0) {
        throw new Error('Preço deve ser maior que zero');
      }

      if (data.duration <= 0) {
        throw new Error('Duração deve ser maior que zero');
      }

      // Cria serviço no Firestore
      const id = await servicesService.create(data);
      
      // Atualiza estado local
      const newService: Service = {
        id,
        ...data,
      };
      
      set((state) => ({ 
        services: [...state.services, newService].sort((a, b) => 
          a.name.localeCompare(b.name)
        ),
        loading: false,
        error: null,
      }));

      return id;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao criar serviço';
      
      console.error('Erro ao criar serviço:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  },

  // Atualiza um serviço existente
  updateService: async (id: string, data: UpdateServiceData) => {
    set({ loading: true, error: null });
    
    try {
      // Valida se serviço existe
      const service = get().services.find(s => s.id === id);
      if (!service) {
        throw new Error('Serviço não encontrado');
      }

      // Valida dados se fornecidos
      if (data.price !== undefined && data.price <= 0) {
        throw new Error('Preço deve ser maior que zero');
      }

      if (data.duration !== undefined && data.duration <= 0) {
        throw new Error('Duração deve ser maior que zero');
      }

      // Atualiza no Firestore
      await servicesService.update(id, data);
      
      // Atualiza estado local
      set((state) => ({ 
        services: state.services
          .map(s => s.id === id ? { ...s, ...data } : s)
          .sort((a, b) => a.name.localeCompare(b.name)),
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao atualizar serviço';
      
      console.error('Erro ao atualizar serviço:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  },

  // Remove um serviço
  deleteService: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      // Valida se serviço existe
      const service = get().services.find(s => s.id === id);
      if (!service) {
        throw new Error('Serviço não encontrado');
      }

      // Remove do Firestore
      await servicesService.delete(id);
      
      // Remove do estado local
      set((state) => ({ 
        services: state.services.filter(s => s.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao excluir serviço';
      
      console.error('Erro ao excluir serviço:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  },

  // Ações de controle
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error, loading: false }),
  
  clearError: () => set({ error: null }),
}));
