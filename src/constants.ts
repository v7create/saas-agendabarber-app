import { Appointment, Client, Transaction, AppointmentStatus, ClientStatus, TransactionType, Service, Barber, Notification, NotificationType } from './types';

// Helper to format dates relative to today
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const dayAfter = new Date();
dayAfter.setDate(today.getDate() + 2);

const formatDate = (date: Date) => date.toISOString().split('T')[0];


export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', clientName: 'João Silva', services: ['Corte', 'Barba'], startTime: '14:30', duration: 60, status: AppointmentStatus.Confirmed, phone: '5511999999999', price: 65, notes: 'Cliente prefere corte mais baixo nas laterais', date: formatDate(today), barberName: 'André' },
  { id: 'a2', clientName: 'Pedro Santos', services: ['Corte Simples'], startTime: '16:00', duration: 30, status: AppointmentStatus.Confirmed, phone: '5511888888888', price: 35, date: formatDate(today), barberName: 'Bruno' },
  { id: 'a3', clientName: 'Carlos Lima', services: ['Barba Completa'], startTime: '17:00', duration: 45, status: AppointmentStatus.Pending, phone: '5511777777777', price: 30, notes: 'Primeira vez no salão', date: formatDate(today), barberName: 'André' },
  { id: 'a4', clientName: 'Roberto Costa', services: ['Corte', 'Barba', 'Sobrancelha'], startTime: '09:00', duration: 90, status: AppointmentStatus.Confirmed, phone: '5511666666666', price: 85, date: formatDate(tomorrow), barberName: 'Carlos' },
  { id: 'a5', clientName: 'Fernando Alves', services: ['Corte Simples'], startTime: '10:30', duration: 30, status: AppointmentStatus.Confirmed, phone: '5511555555555', price: 35, date: formatDate(tomorrow), barberName: 'Bruno' },
  { id: 'a6', clientName: 'Lucas Oliveira', services: ['Degradê + Barba'], startTime: '11:00', duration: 70, status: AppointmentStatus.Confirmed, phone: '5511444444444', price: 70, date: formatDate(tomorrow), barberName: 'André' },
  { id: 'a7', clientName: 'Mateus Pereira', services: ['Platinado'], startTime: '14:00', duration: 120, status: AppointmentStatus.Pending, phone: '5511333333333', price: 150, date: formatDate(dayAfter), barberName: 'Carlos' },
  { id: 'a8', clientName: 'Guilherme Souza', services: ['Luzes'], startTime: '16:30', duration: 90, status: AppointmentStatus.Confirmed, phone: '5511222222222', price: 120, date: formatDate(dayAfter), barberName: 'Bruno' },
];

export const MOCK_CLIENTS: Client[] = [
    { id: '1', name: 'João Silva', avatarInitials: 'JS', status: ClientStatus.Active, phone: '(11) 99999-9999', email: 'joao.silva@email.com', lastVisit: '24/09/2024', rating: 5.0, visits: 15, spent: 975, notes: 'Cliente fiel, prefere corte baixo nas laterais' },
    { id: '2', name: 'Pedro Santos', avatarInitials: 'PS', status: ClientStatus.Active, phone: '(11) 88888-8888', email: 'pedro.santos@email.com', lastVisit: '10/09/2024', rating: 4.5, visits: 8, spent: 320, notes: 'Gosta de conversar sobre futebol.' },
    { id: '3', name: 'Carlos Lima', avatarInitials: 'CL', status: ClientStatus.Active, phone: '(11) 77777-7777', email: 'carlos.lima@email.com', lastVisit: '22/09/2024', rating: 4.8, visits: 3, spent: 150, notes: 'Cliente novo, veio por indicação.' },
    { id: '4', name: 'Roberto Costa', avatarInitials: 'RC', status: ClientStatus.Inactive, phone: '(11) 66666-6666', email: 'roberto.costa@email.com', lastVisit: '05/03/2024', rating: 4.2, visits: 12, spent: 850, notes: '' },
    { id: '5', name: 'VIP Cliente', avatarInitials: 'VC', status: ClientStatus.Active, phone: '(11) 11111-1111', email: 'vip@email.com', lastVisit: '26/09/2024', rating: 5.0, visits: 25, spent: 2500, notes: 'Cliente VIP. Oferecer café.' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', type: TransactionType.Income, description: 'João Silva', category: 'Corte + Barba', amount: 65, date: '26/09/2024', time: '14:30', paymentMethod: 'PIX' },
    { id: '2', type: TransactionType.Income, description: 'Pedro Santos', category: 'Corte Simples', amount: 35, date: '26/09/2024', time: '13:00', paymentMethod: 'Dinheiro' },
    { id: '3', type: TransactionType.Expense, description: 'Produtos de Cabelo', category: 'Estoque', amount: 120, date: '25/09/2024', time: '10:00', paymentMethod: 'Cartão' },
    { id: '4', type: TransactionType.Income, description: 'Carlos Lima', category: 'Barba Completa', amount: 30, date: '25/09/2024', time: '16:30', paymentMethod: 'Cartão' },
    { id: '5', type: TransactionType.Expense, description: 'Conta de Luz', category: 'Despesas Fixas', amount: 180, date: '24/09/2024', time: '09:00', paymentMethod: 'Transferência' },
];

export const MOCK_HISTORY = [
    { id: '1', clientName: 'João Silva', services: 'Corte + Barba', date: '24/09', time: '14:30', duration: 60, price: 65, rating: 5, notes: 'Cliente satisfeito com o resultado' },
    { id: '2', clientName: 'Pedro Santos', services: 'Corte Simples', date: '23/09', time: '16:00', duration: 30, price: 35, rating: 4, notes: '' },
    { id: '3', clientName: 'Carlos Lima', services: 'Barba Completa', date: '22/09', time: '10:30', duration: 45, price: 30, rating: 5, notes: '' },
];

export const MOCK_SERVICES: Service[] = [
    // Serviços Básicos
    { id: 's1', name: 'Corte Simples', price: 40, duration: 30, icon: 'scissors', color: 'bg-blue-500/10 text-blue-400' },
    { id: 's2', name: 'Barba', price: 30, duration: 30, icon: 'face', color: 'bg-green-500/10 text-green-400' },
    { id: 's3', name: 'Sobrancelha', price: 20, duration: 15, icon: 'brush', color: 'bg-yellow-500/10 text-yellow-400' },
    
    // Serviços Combinados
    { id: 's7', name: 'Corte + Barba', price: 65, duration: 60, icon: 'layer', color: 'bg-indigo-500/10 text-indigo-400' },
    
    // Serviços Especializados
    { id: 's6', name: 'Corte Degradê', price: 50, duration: 40 },
    { id: 's8', name: 'Degradê + Barba', price: 75, duration: 70 },
    { id: 's10', name: 'Corte com Tratamento', price: 70, duration: 50 },
    { id: 's11', name: 'Design de Sobrancelha', price: 25, duration: 20 },
    
    // Serviços Premium
    { id: 's4', name: 'Platinado', price: 150, duration: 120 },
    { id: 's5', name: 'Coloração', price: 120, duration: 90 },
    { id: 's9', name: 'Pacote Premium (Corte + Barba + Sobrancelha)', price: 100, duration: 90 },
    { id: 's12', name: 'Luzes e Mechas', price: 140, duration: 120 },
    { id: 's13', name: 'Relaxamento Capilar', price: 180, duration: 150 },
];


export const MOCK_BARBERS: Barber[] = [
    { id: 'b1', name: 'André', avatarUrl: 'https://i.pravatar.cc/150?u=andre' },
    { id: 'b2', name: 'Bruno', avatarUrl: 'https://i.pravatar.cc/150?u=bruno' },
    { id: 'b3', name: 'Carlos', avatarUrl: 'https://i.pravatar.cc/150?u=carlos' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: NotificationType.NewAppointment, title: 'Novo Agendamento!', description: 'Carlos Lima agendou um Corte para 16:00.', time: '2 min atrás', read: false },
  { id: 'n2', type: NotificationType.GoalAchieved, title: 'Meta Diária Batida!', description: 'Você atingiu R$ 450 de receita hoje. Parabéns!', time: '1h atrás', read: false },
  { id: 'n3', type: NotificationType.NewAppointment, title: 'Novo Agendamento!', description: 'Roberto Costa agendou Corte + Barba para amanhã.', time: '3h atrás', read: true },
  { id: 'n4', type: NotificationType.GoalAchieved, title: 'Meta Semanal Quase Lá!', description: 'Faltam apenas R$ 200 para sua meta semanal.', time: 'ontem', read: true },
];