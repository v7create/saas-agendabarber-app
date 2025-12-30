import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/firebase';
import { Appointment, AppointmentStatus, NotificationType } from '@/types';

export const publicAppointmentService = {
  /**
   * Busca agendamentos de uma data específica para verificação de disponibilidade
   */
  async getAppointmentsByDate(ownerId: string, date: string): Promise<Appointment[]> {
    try {
      const colRef = collection(db, 'barbershops', ownerId, 'appointments');
      const q = query(
        colRef, 
        where('date', '==', date),
        where('status', '!=', AppointmentStatus.Cancelled)
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  },

  /**
   * Cria um agendamento público
   */
  async createAppointment(ownerId: string, data: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const colRef = collection(db, 'barbershops', ownerId, 'appointments');
      
      const docRef = await addDoc(colRef, {
        ...data,
        status: AppointmentStatus.Confirmed,
        createdAt: serverTimestamp(),
        // Campos extras para controle
        origin: 'public_site'
      });

      // Cria notificação para o barbeiro
      await this.createNotification(ownerId, data);

      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  /**
   * Helper privado para notificar o barbeiro
   */
  async createNotification(ownerId: string, appointment: any) {
    try {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const [year, month, day] = appointment.date.split('-');
      const formattedDate = `${day}/${month}`;

      await addDoc(collection(db, 'barbershops', ownerId, 'notifications'), {
        title: 'Novo Agendamento pelo Site',
        description: `Cliente ${appointment.clientName} agendou para ${formattedDate} às ${appointment.startTime}`,
        type: NotificationType.NewAppointment,
        time,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao notificar barbeiro:', error);
      // Não falha o agendamento se a notificação falhar
    }
  }
};
