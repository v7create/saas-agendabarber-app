/**
 * AuthStore - Store global de autenticação usando Zustand
 * 
 * Gerencia o estado de autenticação em todo o aplicativo:
 * - user: Usuário autenticado (null se não autenticado)
 * - loading: Indica se está carregando operação de autenticação
 * - error: Mensagem de erro, se houver
 * 
 * Ações disponíveis:
 * - setUser: Define o usuário autenticado
 * - setLoading: Define estado de carregamento
 * - setError: Define mensagem de erro
 * - clearError: Limpa mensagem de erro
 * - logout: Desloga o usuário
 */

import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  // Estado
  user: User | null;
  loading: boolean;
  error: string | null;

  // Ações
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Estado inicial
  user: null,
  loading: true, // Começa como true para detectar estado inicial
  error: null,

  // Ações
  setUser: (user) => set({ user, loading: false }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error, loading: false }),
  
  clearError: () => set({ error: null }),
  
  logout: () => set({ 
    user: null, 
    loading: false, 
    error: null 
  }),
}));
