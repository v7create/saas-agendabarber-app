/**
 * AppointmentsStore - Store global de agendamentos usando Zustand
 * 
 * Gerencia todos os agendamentos da barbearia em tempo real.
 * 
 * Estado:
 * - appointments: Lista de agendamentos
 * - loading: Estado de carregamento
 * - error: Mensagem de erro
 * 
 * Ações:
 * - fetchAppointments: Busca todos os agendamentos
 * - fetchAppointmentsByDate: Busca agendamentos de uma data específica
 * - fetchUpcoming: Busca próximos agendamentos (hoje e futuros)
 * - createAppointment: Cria novo agendamento
 * - updateAppointment: Atualiza agendamento existente
 * - deleteAppointment: Remove agendamento
 * - updateStatus: Atualiza apenas o status de um agendamento
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 3 (Appointments), Seção 4 (Agenda)
 * - DESCRICAO_FEATURES.md - Seção 3 (Gestão de Agendamentos)
 * - ESTADOS_ESPECIAIS.md - Seção "Agendamentos"
 * 
 * Padrão de uso:
 * ```typescript
 * const { appointments, loading, fetchUpcoming } = useAppointmentsStore();
 * 
 * useEffect(() => {
 *   fetchUpcoming();
 * }, []);
 * ```
 */

import { create } from 'zustand';
import { Appointment, AppointmentStatus, TransactionType } from '@/types';
import { BaseService } from '@/services/base.service';
import { where, orderBy, Timestamp } from 'firebase/firestore';

// Instância do serviço de Firestore
const appointmentsService = new BaseService<Appointment>('appointments');

// Tipos para criação/atualização (sem ID)
export type CreateAppointmentData = Omit<Appointment, 'id'>;
export type UpdateAppointmentData = Partial<Omit<Appointment, 'id'>>;

interface AppointmentsState {
  // Estado
  appointments: Appointment[];
  loading: boolean;
  error: string | null;

  // Ações de dados
  fetchAppointments: () => Promise<void>;
  fetchAppointmentsByDate: (date: string) => Promise<void>;
  fetchUpcoming: () => Promise<void>;
  createAppointment: (data: CreateAppointmentData) => Promise<string>;
  updateAppointment: (id: string, data: UpdateAppointmentData) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  updateStatus: (id: string, status: AppointmentStatus) => Promise<void>;

  // Ações de controle
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  // Estado inicial
  appointments: [],
  loading: false,
  error: null,

  // Busca todos os agendamentos
  fetchAppointments: async () => {
    set({ loading: true, error: null });
    
    try {
      const appointments = await appointmentsService.getAll([
        orderBy('date', 'desc'),
        orderBy('startTime', 'asc')
      ]);
      
      set({ 
        appointments, 
        loading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao carregar agendamentos';
      
      console.error('Erro ao buscar agendamentos:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
    }
  },

  // Busca agendamentos de uma data específica
  fetchAppointmentsByDate: async (date: string) => {
    set({ loading: true, error: null });
    
    try {
      const appointments = await appointmentsService.getAll([
        where('date', '==', date),
        orderBy('startTime', 'asc')
      ]);
      
      set({ 
        appointments, 
        loading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao carregar agendamentos da data';
      
      console.error('Erro ao buscar agendamentos por data:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
    }
  },

  // Busca próximos agendamentos (hoje e futuros)
  fetchUpcoming: async () => {
    set({ loading: true, error: null });
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const appointments = await appointmentsService.getAll([
        where('date', '>=', today),
        orderBy('date', 'asc'),
        orderBy('startTime', 'asc')
      ]);
      
      set({ 
        appointments, 
        loading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao carregar próximos agendamentos';
      
      console.error('Erro ao buscar próximos agendamentos:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
    }
  },

  // Cria um novo agendamento
  createAppointment: async (data: CreateAppointmentData) => {
    set({ loading: true, error: null });
    
    try {
      // Validações
      if (!data.clientName || !data.date || !data.startTime) {
        throw new Error('Cliente, data e horário são obrigatórios');
      }

      if (!data.services || data.services.length === 0) {
        throw new Error('Selecione pelo menos um serviço');
      }

      if (data.duration && data.duration <= 0) {
        throw new Error('Duração deve ser maior que zero');
      }

      // Cria agendamento no Firestore
      const id = await appointmentsService.create({
        ...data,
        status: data.status || AppointmentStatus.Pending,
      });
      
      // Atualiza estado local
      const newAppointment: Appointment = {
        id,
        ...data,
        status: data.status || AppointmentStatus.Pending,
      };
      
      set((state) => ({ 
        appointments: [...state.appointments, newAppointment].sort((a, b) => {
          // Ordena por data e depois por horário
          if (a.date === b.date) {
            return a.startTime.localeCompare(b.startTime);
          }
          return b.date.localeCompare(a.date);
        }),
        loading: false,
        error: null,
      }));

      return id;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao criar agendamento';
      
      console.error('Erro ao criar agendamento:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  },

  // Atualiza um agendamento existente
  updateAppointment: async (id: string, data: UpdateAppointmentData) => {
    set({ loading: true, error: null });
    
    try {
      // Valida se agendamento existe
      const appointment = get().appointments.find(a => a.id === id);
      if (!appointment) {
        throw new Error('Agendamento não encontrado');
      }

      // Validações
      if (data.duration !== undefined && data.duration <= 0) {
        throw new Error('Duração deve ser maior que zero');
      }

      if (data.services !== undefined && data.services.length === 0) {
        throw new Error('Selecione pelo menos um serviço');
      }

      // Atualiza no Firestore
      await appointmentsService.update(id, data);
      
      // Atualiza estado local
      set((state) => ({ 
        appointments: state.appointments
          .map(a => a.id === id ? { ...a, ...data } : a)
          .sort((a, b) => {
            if (a.date === b.date) {
              return a.startTime.localeCompare(b.startTime);
            }
            return b.date.localeCompare(a.date);
          }),
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao atualizar agendamento';
      
      console.error('Erro ao atualizar agendamento:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  },

  // Remove um agendamento
  deleteAppointment: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      // Valida se agendamento existe
      const appointment = get().appointments.find(a => a.id === id);
      if (!appointment) {
        throw new Error('Agendamento não encontrado');
      }

      // Remove do Firestore
      await appointmentsService.delete(id);
      
      // Remove do estado local
      set((state) => ({ 
        appointments: state.appointments.filter(a => a.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao excluir agendamento';
      
      console.error('Erro ao excluir agendamento:', error);
      set({ 
        loading: false, 
        error: errorMessage 
      });
      
      throw error;
    }
  },

  // Atualiza apenas o status de um agendamento (helper convenience)
  updateStatus: async (id: string, status: AppointmentStatus) => {
    try {
      const appointment = get().appointments.find(a => a.id === id);
      if (!appointment) {
        throw new Error('Agendamento não encontrado');
      }

      // Atualiza o status
      await get().updateAppointment(id, { status });

      // Se status muda para COMPLETED e há preço, cria auto-transação
      if (status === AppointmentStatus.Completed && appointment.price && appointment.price > 0) {
        try {
          // Import dinâmico do financial store para evitar circular dependency
          const { useFinancialStore } = await import('./financial.store');
          const financialStore = useFinancialStore.getState();
          
          // Formatar data e hora para transação
          const today = new Date();
          const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
          const timeStr = today.toTimeString().substring(0, 5); // HH:MM
          
          // Criar transação de receita
          await financialStore.createTransaction({
            type: TransactionType.Income,
            description: `${appointment.clientName} - Agendamento Concluído`,
            category: appointment.services.join(' + '),
            amount: appointment.price,
            date: dateStr,
            time: timeStr,
            paymentMethod: 'Não especificado' // Será informado manualmente se necessário
          });
          
          console.log(`✅ Auto-transação criada: R$ ${appointment.price} para ${appointment.clientName}`);
        } catch (err) {
          // Log do erro mas não falha a operação principal
          console.warn('Aviso: Erro ao criar auto-transação:', err);
        }
      }
    } catch (error) {
      // Erro já tratado no updateAppointment
      throw error;
    }
  },

  // Ações de controle
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error, loading: false }),
  
  clearError: () => set({ error: null }),
}));
