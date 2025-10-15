/**
 * useUI - Hook para gerenciar estado transiente da UI
 * 
 * Facilita o uso do UIStore em componentes React.
 * 
 * Features:
 * - Controle de sidebar
 * - Sistema de toasts (4 tipos)
 * - Gerenciamento de modais
 * - Loading overlay global
 * - Diálogos de confirmação
 * 
 * Referências:
 * - ESTADOS_ESPECIAIS.md - Toast types e animações
 * - ANALISE_COMPLETA_UI.md - Sidebar e Modais
 * 
 * Exemplo de uso:
 * ```typescript
 * function MyComponent() {
 *   const { 
 *     showToast, 
 *     openModal,
 *     showConfirm 
 *   } = useUI();
 * 
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       showToast('Dados salvos!', 'success');
 *     } catch (error) {
 *       showToast('Erro ao salvar', 'error');
 *     }
 *   };
 * 
 *   const handleDelete = () => {
 *     showConfirm(
 *       'Confirmar exclusão',
 *       'Tem certeza que deseja excluir?',
 *       () => {
 *         deleteItem();
 *         showToast('Item excluído', 'success');
 *       }
 *     );
 *   };
 * 
 *   return (
 *     <button onClick={() => openModal('edit-form', { id: 123 })}>
 *       Editar
 *     </button>
 *   );
 * }
 * ```
 */

import { useUIStore, ToastType } from '@/store/ui.store';

export function useUI() {
  // Sidebar
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const openSidebar = useUIStore((state) => state.openSidebar);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  // Toasts
  const toasts = useUIStore((state) => state.toasts);
  const showToast = useUIStore((state) => state.showToast);
  const hideToast = useUIStore((state) => state.hideToast);
  const clearToasts = useUIStore((state) => state.clearToasts);

  // Modals
  const modals = useUIStore((state) => state.modals);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeAllModals = useUIStore((state) => state.closeAllModals);
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const getModalData = useUIStore((state) => state.getModalData);

  // Loading
  const loadingOverlay = useUIStore((state) => state.loadingOverlay);
  const loadingMessage = useUIStore((state) => state.loadingMessage);
  const showLoading = useUIStore((state) => state.showLoading);
  const hideLoading = useUIStore((state) => state.hideLoading);

  // Confirmação
  const confirmDialog = useUIStore((state) => state.confirmDialog);
  const showConfirm = useUIStore((state) => state.showConfirm);
  const hideConfirm = useUIStore((state) => state.hideConfirm);

  // Helpers
  const helpers = {
    /**
     * Atalhos para tipos de toast
     */
    success: (message: string, duration?: number) => {
      return showToast(message, 'success', duration);
    },

    error: (message: string, duration?: number) => {
      return showToast(message, 'error', duration);
    },

    warning: (message: string, duration?: number) => {
      return showToast(message, 'warning', duration);
    },

    info: (message: string, duration?: number) => {
      return showToast(message, 'info', duration);
    },

    /**
     * Verifica se há toasts visíveis
     */
    hasToasts: () => {
      return toasts.length > 0;
    },

    /**
     * Retorna todos os modais abertos
     */
    getOpenModals: () => {
      return modals;
    },

    /**
     * Verifica se há modais abertos
     */
    hasOpenModals: () => {
      return modals.length > 0;
    },

    /**
     * Conta modais abertos
     */
    getOpenModalsCount: () => {
      return modals.length;
    },

    /**
     * Helper para mostrar loading com Promise
     * Útil para operações assíncronas
     */
    withLoading: async <T>(
      promise: Promise<T>, 
      message?: string
    ): Promise<T> => {
      showLoading(message);
      try {
        const result = await promise;
        hideLoading();
        return result;
      } catch (error) {
        hideLoading();
        throw error;
      }
    },

    /**
     * Helper para confirmar antes de executar ação
     */
    confirmAction: (
      title: string,
      message: string,
      action: () => void | Promise<void>
    ) => {
      showConfirm(
        title,
        message,
        async () => {
          hideConfirm();
          await action();
        },
        () => {
          hideConfirm();
        }
      );
    },

    /**
     * Helper para confirmar exclusão
     */
    confirmDelete: (
      itemName: string,
      onConfirm: () => void | Promise<void>
    ) => {
      showConfirm(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`,
        async () => {
          hideConfirm();
          await onConfirm();
        },
        () => {
          hideConfirm();
        }
      );
    },
  };

  return {
    // Sidebar
    sidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,

    // Toasts
    toasts,
    showToast,
    hideToast,
    clearToasts,

    // Modals
    modals,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    getModalData,

    // Loading
    loadingOverlay,
    loadingMessage,
    showLoading,
    hideLoading,

    // Confirmação
    confirmDialog,
    showConfirm,
    hideConfirm,

    // Helpers
    ...helpers,
  };
}
