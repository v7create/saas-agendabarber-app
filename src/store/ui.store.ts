/**
 * UIStore - Store Zustand para estado transiente da UI
 * 
 * Gerencia estado local da interface:
 * - Modais (abrir/fechar com dados)
 * - Toasts (4 tipos: success, error, warning, info)
 * - Sidebar (aberto/fechado)
 * - Loading overlays globais
 * - Confirmações
 * 
 * Nota: Este store NÃO persiste no Firebase - é apenas estado local.
 * 
 * Referências:
 * - ESTADOS_ESPECIAIS.md - Toast types e animações
 * - ANALISE_COMPLETA_UI.md - Sidebar e Modais
 * 
 * Exemplo de uso:
 * ```typescript
 * const { showToast, openModal, sidebarOpen } = useUIStore();
 * 
 * // Mostrar toast de sucesso
 * showToast('Cliente salvo com sucesso!', 'success');
 * 
 * // Abrir modal
 * openModal('edit-service', { serviceId: '123' });
 * 
 * // Toggle sidebar
 * toggleSidebar();
 * ```
 */

import { create } from 'zustand';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ms (default: 3000)
}

// Modal types
export interface Modal {
  id: string;
  data?: any;
}

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;

  // Modals
  modals: Modal[];
  openModal: (id: string, data?: any) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isModalOpen: (id: string) => boolean;
  getModalData: <T = any>(id: string) => T | null;

  // Loading overlay
  loadingOverlay: boolean;
  loadingMessage: string | null;
  showLoading: (message?: string) => void;
  hideLoading: () => void;

  // Confirmação
  confirmDialog: {
    open: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
  };
  showConfirm: (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void
  ) => void;
  hideConfirm: () => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>((set, get) => ({
  // Sidebar
  sidebarOpen: false,

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  openSidebar: () => {
    set({ sidebarOpen: true });
  },

  closeSidebar: () => {
    set({ sidebarOpen: false });
  },

  // Toasts
  toasts: [],

  showToast: (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = `toast-${Date.now()}-${toastCounter++}`;
    
    const toast: Toast = {
      id,
      message,
      type,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-hide após duration
    if (duration > 0) {
      setTimeout(() => {
        get().hideToast(id);
      }, duration);
    }

    return id;
  },

  hideToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Modals
  modals: [],

  openModal: (id: string, data?: any) => {
    // Se modal já está aberto, atualiza os dados
    const existing = get().modals.find(m => m.id === id);
    if (existing) {
      set((state) => ({
        modals: state.modals.map(m => 
          m.id === id ? { ...m, data } : m
        ),
      }));
      return;
    }

    // Senão, adiciona novo modal
    set((state) => ({
      modals: [...state.modals, { id, data }],
    }));
  },

  closeModal: (id: string) => {
    set((state) => ({
      modals: state.modals.filter(m => m.id !== id),
    }));
  },

  closeAllModals: () => {
    set({ modals: [] });
  },

  isModalOpen: (id: string) => {
    return get().modals.some(m => m.id === id);
  },

  getModalData: <T = any>(id: string): T | null => {
    const modal = get().modals.find(m => m.id === id);
    return modal?.data || null;
  },

  // Loading overlay
  loadingOverlay: false,
  loadingMessage: null,

  showLoading: (message?: string) => {
    set({ 
      loadingOverlay: true, 
      loadingMessage: message || null 
    });
  },

  hideLoading: () => {
    set({ 
      loadingOverlay: false, 
      loadingMessage: null 
    });
  },

  // Confirmação
  confirmDialog: {
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  },

  showConfirm: (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void
  ) => {
    set({
      confirmDialog: {
        open: true,
        title,
        message,
        onConfirm,
        onCancel: onCancel || null,
      },
    });
  },

  hideConfirm: () => {
    set({
      confirmDialog: {
        open: false,
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
      },
    });
  },
}));
