/**
 * useNotifications - Hook para gerenciar notificações em tempo real
 * 
 * Facilita o uso do NotificationsStore em componentes React.
 * 
 * Features:
 * - Acesso às notificações em tempo real
 * - Filtros por tipo e status (lida/não lida)
 * - Marcar como lida/não lida
 * - Contagem de não lidas
 * - Auto-start listener (opcional)
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 3 (Header com sino)
 * - ESTADOS_ESPECIAIS.md - Notificações
 * 
 * Exemplo de uso:
 * ```typescript
 * function NotificationsPanel() {
 *   const { 
 *     notifications, 
 *     unreadCount,
 *     markAsRead,
 *     unreadNotifications 
 *   } = useNotifications({ autoStart: true });
 * 
 *   return (
 *     <div>
 *       <h3>Notificações ({unreadCount})</h3>
 *       {notifications.map(notif => (
 *         <div 
 *           key={notif.id} 
 *           onClick={() => markAsRead(notif.id)}
 *         >
 *           {notif.title}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

import { useEffect } from 'react';
import { useNotificationsStore, CreateNotificationData } from '@/store/notifications.store';
import { NotificationType } from '@/types';

interface UseNotificationsOptions {
  /**
   * Inicia listener automaticamente ao montar
   */
  autoStart?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { autoStart = false } = options;

  // Estado do store
  const notifications = useNotificationsStore((state) => state.notifications);
  const loading = useNotificationsStore((state) => state.loading);
  const error = useNotificationsStore((state) => state.error);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);

  // Ações
  const startListening = useNotificationsStore((state) => state.startListening);
  const stopListening = useNotificationsStore((state) => state.stopListening);
  const createNotification = useNotificationsStore((state) => state.createNotification);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAsUnread = useNotificationsStore((state) => state.markAsUnread);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const deleteNotification = useNotificationsStore((state) => state.deleteNotification);
  const clearAll = useNotificationsStore((state) => state.clearAll);
  const clearError = useNotificationsStore((state) => state.clearError);

  // Auto-start listener
  useEffect(() => {
    if (autoStart) {
      startListening();
    }

    // Cleanup: para o listener ao desmontar
    return () => {
      if (autoStart) {
        stopListening();
      }
    };
  }, [autoStart, startListening, stopListening]);

  // Helpers
  const helpers = {
    /**
     * Busca notificação por ID
     */
    getNotificationById: (id: string) => {
      return notifications.find(n => n.id === id) || null;
    },

    /**
     * Filtra notificações por tipo
     */
    filterByType: (type: NotificationType) => {
      return notifications.filter(n => n.type === type);
    },

    /**
     * Retorna notificações não lidas
     */
    getUnreadNotifications: () => {
      return notifications.filter(n => !n.read);
    },

    /**
     * Retorna notificações lidas
     */
    getReadNotifications: () => {
      return notifications.filter(n => n.read);
    },

    /**
     * Retorna notificações de novos agendamentos
     */
    getNewAppointmentNotifications: () => {
      return notifications.filter(n => 
        n.type === NotificationType.NewAppointment
      );
    },

    /**
     * Retorna notificações de metas atingidas
     */
    getGoalAchievedNotifications: () => {
      return notifications.filter(n => 
        n.type === NotificationType.GoalAchieved
      );
    },

    /**
     * Retorna notificações recentes (últimas N)
     */
    getRecentNotifications: (limit: number = 10) => {
      return notifications.slice(0, limit);
    },

    /**
     * Verifica se há notificações não lidas
     */
    hasUnread: () => {
      return unreadCount > 0;
    },

    /**
     * Retorna estatísticas
     */
    getStats: () => {
      const total = notifications.length;
      const read = notifications.filter(n => n.read).length;
      const unread = notifications.filter(n => !n.read).length;
      
      const byType = {
        newAppointment: notifications.filter(n => 
          n.type === NotificationType.NewAppointment
        ).length,
        goalAchieved: notifications.filter(n => 
          n.type === NotificationType.GoalAchieved
        ).length,
      };

      return {
        total,
        read,
        unread,
        byType,
      };
    },

    /**
     * Atalho para notificações não lidas
     */
    get unreadNotifications() {
      return this.getUnreadNotifications();
    },

    /**
     * Atalho para notificações lidas
     */
    get readNotifications() {
      return this.getReadNotifications();
    },
  };

  return {
    // Estado
    notifications,
    loading,
    error,
    unreadCount,

    // Ações
    startListening,
    stopListening,
    createNotification,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAll,
    clearError,

    // Helpers
    ...helpers,
  };
}
