/**
 * AppointmentService - Serviço especializado para agendamentos
 * 
 * Estende o BaseService com métodos específicos para:
 * - Buscar agendamentos por data
 * - Buscar por período (range de datas)
 * - Filtrar por status
 * - Atualizar status do agendamento
 */

import { where, Timestamp, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { BaseService } from './base.service';
import { Appointment, AppointmentStatus, NotificationType } from '@/types';
import { db, auth } from '@/firebase';

export class AppointmentService extends BaseService<Appointment> {
  constructor() {
    super('appointments');
  }

  /**
   * Helper privado para criar notificação
   */
  private async createNotification(title: string, description: string, type: NotificationType) {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      await addDoc(collection(db, 'barbershops', user.uid, 'notifications'), {
        title,
        description,
        type,
        time,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao criar notificação automática:', error);
    }
  }

  /**
   * Busca agendamentos de uma data específica
   * @param date - Data no formato 'YYYY-MM-DD'
   */
  async getByDate(date: string): Promise<Appointment[]> {
    try {
      const constraints = [
        this.whereEqual('date', date),
        this.orderByField('startTime', 'asc'),
      ];
      
      return await this.getAll(constraints);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por data:', error);
      throw error;
    }
  }

  /**
   * Busca agendamentos em um período
   * @param startDate - Data inicial (formato 'YYYY-MM-DD')
   * @param endDate - Data final (formato 'YYYY-MM-DD')
   */
  async getByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    try {
      const constraints = [
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        this.orderByField('date', 'asc'),
        this.orderByField('startTime', 'asc'),
      ];
      
      return await this.getAll(constraints);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por período:', error);
      throw error;
    }
  }

  /**
   * Busca agendamentos por status
   * @param status - Status do agendamento
   */
  async getByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    try {
      const constraints = [
        this.whereEqual('status', status),
        this.orderByField('date', 'desc'),
        this.orderByField('startTime', 'desc'),
      ];
      
      return await this.getAll(constraints);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por status:', error);
      throw error;
    }
  }

  /**
   * Busca agendamentos de um cliente específico
   * @param clientId - ID do cliente
   */
  async getByClient(clientId: string): Promise<Appointment[]> {
    try {
      const constraints = [
        this.whereEqual('clientId', clientId),
        this.orderByField('date', 'desc'),
      ];
      
      return await this.getAll(constraints);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por cliente:', error);
      throw error;
    }
  }

  /**
   * Atualiza apenas o status de um agendamento
   * @param id - ID do agendamento
   * @param status - Novo status
   */
  async updateStatus(id: string, status: AppointmentStatus): Promise<void> {
    try {
      await this.update(id, { status });

      // Notificar sobre cancelamento
      if (status === AppointmentStatus.Cancelled) {
        // Tentar buscar detalhes do agendamento para mensagem mais rica
        try {
          const appointment = await this.getById(id);
          if (appointment) {
            await this.createNotification(
              'Agendamento Cancelado',
              `O agendamento de ${appointment.clientName} foi cancelado.`,
              NotificationType.NewAppointment // Usando tipo genérico por enquanto ou criar um específico
            );
          }
        } catch (e) {
          // Fallback se não conseguir buscar
          await this.createNotification(
            'Agendamento Cancelado',
            `Um agendamento foi marcado como cancelado.`,
            NotificationType.NewAppointment
          );
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      throw error;
    }
  }

  /**
   * Busca próximos agendamentos (a partir de hoje)
   * @param limitCount - Número máximo de resultados (padrão: 10)
   */
  async getUpcoming(limitCount: number = 10): Promise<Appointment[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const constraints = [
        where('date', '>=', today),
        where('status', '!=', AppointmentStatus.Cancelled),
        this.orderByField('date', 'asc'),
        this.orderByField('startTime', 'asc'),
        this.limitTo(limitCount),
      ];
      
      return await this.getAll(constraints);
    } catch (error) {
      console.error('Erro ao buscar próximos agendamentos:', error);
      throw error;
    }
  }

  /**
   * Verifica se existe conflito de horário
   * @param date - Data do agendamento
   * @param time - Horário do agendamento
   * @param excludeId - ID do agendamento a ser excluído da verificação (para edição)
   */
  async hasTimeConflict(date: string, time: string, excludeId?: string): Promise<boolean> {
    try {
      const appointments = await this.getByDate(date);
      
      const conflict = appointments.some(apt => 
        apt.startTime === time && 
        apt.id !== excludeId &&
        apt.status !== AppointmentStatus.Cancelled
      );
      
      return conflict;
    } catch (error) {
      console.error('Erro ao verificar conflito de horário:', error);
      throw error;
    }
  }
}

// Exporta instância singleton
export const appointmentService = new AppointmentService();
