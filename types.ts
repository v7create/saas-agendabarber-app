export enum AppointmentStatus {
  Confirmed = "Confirmado",
  Pending = "Pendente",
  Cancelled = "Cancelado",
  Completed = "Concluído",
}

export interface Appointment {
  id: string;
  clientName: string;
  services: string[];
  startTime: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  phone?: string;
  price?: number;
  notes?: string;
  date: string;
  barberName?: string;
}

export enum ClientStatus {
    Active = "Ativo",
    Inactive = "Inativo",
}

export interface Client {
    id: string;
    name: string;
    avatarInitials: string;
    status: ClientStatus;
    phone: string;
    email: string;
    lastVisit: string;
    rating: number;
    visits: number;
    spent: number;
    notes: string;
}

export enum TransactionType {
    Income = "income",
    Expense = "expense",
}

export interface Transaction {
    id: string;
    type: TransactionType;
    description: string;
    category: string;
    amount: number;
    date: string;
    time: string;
    paymentMethod: string;
}

export interface Service {
    id: string;
    name: string;
    price: number;
    duration: number; // in minutes
    icon?: string;
    color?: string;
}

export interface Barber {
    id: string;
    name: string;
    avatarUrl?: string;
}

export enum NotificationType {
    NewAppointment = "new_appointment",
    GoalAchieved = "goal_achieved",
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    time: string; 
    read: boolean;
}