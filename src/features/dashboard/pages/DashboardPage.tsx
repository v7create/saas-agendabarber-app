/**
 * DashboardPage - Página principal do dashboard
 * 
 * Página inicial após login que exibe:
 * - Cards de estatísticas com dados reais (agendamentos, receita, clientes, próximo)
 * - Ações rápidas (novo agendamento, cliente, pagamento, ver agenda)
 * - Lista de próximos agendamentos (scrollable, max-height)
 * - Modais para criação de entidades
 * 
 * Integração com 4 Stores:
 * - AppointmentsStore: Estatísticas e lista de agendamentos
 * - ClientsStore: Total de clientes
 * - FinancialStore: Receita do dia/período
 * - ServicesStore: Disponível para seleção em forms
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 2 (Dashboard)
 * - DESCRICAO_FEATURES.md - Seção 1 (Visão Geral)
 * - ESTADOS_ESPECIAIS.md - Loading, Empty, Error states
 * 
 * Features:
 * - Data formatada em português (ex: "quinta-feira, 27 de setembro de 2025")
 * - Cards de estatísticas com trends
 * - Ações rápidas com navegação
 * - Lista de agendamentos com ações (editar, remover, concluir)
 * - Modais inline para criação/edição
 * - Auto-fetch de dados ao montar
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useAppointments } from '@/hooks/useAppointments';
import { useClients } from '@/hooks/useClients';
import { useFinancial } from '@/hooks/useFinancial';
import { useServices } from '@/hooks/useServices';
import { useUI } from '@/hooks/useUI';
import { CreateClientData } from '@/store/clients.store';
import { CreateTransactionData } from '@/store/financial.store';
import { 
  Appointment, 
  AppointmentStatus,
  TransactionType,
  Service 
} from '@/types';

// ===== Sub-Components =====

/**
 * StatCard - Card de estatística com ícone, valor e trend
 */
interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend, trendUp }) => (
  <Card className="!p-4">
    <div className="flex items-start justify-between mb-2">
      <div className="p-2 bg-violet-500/20 rounded-lg">
        <Icon name={icon} className="w-5 h-5 text-violet-400" />
      </div>
    </div>
    <p className="text-slate-400 text-sm">{title}</p>
    <p className="text-2xl font-bold text-slate-100 mt-1">{value}</p>
    {trend && (
      <p className={`text-xs mt-2 flex items-center ${trendUp ? 'text-green-400' : 'text-slate-400'}`}>
        {trendUp && <Icon name="trending-up" className="w-3 h-3 mr-1" />}
        {trend}
      </p>
    )}
  </Card>
);

/**
 * QuickActionButton - Botão de ação rápida
 */
interface QuickActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-slate-700/50 transition-colors"
  >
    <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center mb-2">
      <Icon name={icon} className="w-5 h-5 text-violet-400" />
    </div>
    <span className="text-sm font-medium text-slate-200 text-center">{label}</span>
  </button>
);

/**
 * UpcomingAppointmentItem - Item de agendamento na lista
 */
interface UpcomingAppointmentItemProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onRemove: (appointment: Appointment) => void;
  onComplete: (appointment: Appointment) => void;
}

const UpcomingAppointmentItem: React.FC<UpcomingAppointmentItemProps> = ({
  appointment,
  onEdit,
  onRemove,
  onComplete
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusColor =
    appointment.status === AppointmentStatus.Confirmed
      ? 'bg-violet-500/20 text-violet-400'
      : appointment.status === AppointmentStatus.Pending
      ? 'bg-yellow-500/20 text-yellow-400'
      : appointment.status === AppointmentStatus.Cancelled
      ? 'bg-red-500/20 text-red-400'
      : 'bg-green-500/20 text-green-400';

  const dateFormatted = new Date(appointment.date + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });

  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <p className="font-bold text-slate-100">{appointment.clientName}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
              {appointment.status}
            </span>
          </div>
          <p className="text-sm text-slate-300">{appointment.services.join(' + ')}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <Icon name="dots" className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(appointment);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 rounded-t-lg"
              >
                <Icon name="edit" className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onComplete(appointment);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-green-400 hover:bg-slate-600"
              >
                <Icon name="check" className="w-4 h-4 mr-2" />
                Concluir
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRemove(appointment);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-600 rounded-b-lg"
              >
                <Icon name="x" className="w-4 h-4 mr-2" />
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span className="flex items-center">
          <Icon name="calendar" className="w-4 h-4 mr-1" />
          {dateFormatted} • {appointment.startTime}
        </span>
        <span className="font-bold text-slate-100">R$ {appointment.price.toFixed(2)}</span>
      </div>
    </div>
  );
};

/**
 * ConfirmationModalContent - Conteúdo de modal de confirmação
 */
interface ConfirmationModalContentProps {
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModalContent: React.FC<ConfirmationModalContentProps> = ({
  message,
  confirmText,
  onConfirm,
  onCancel
}) => (
  <div className="space-y-4">
    <p className="text-slate-300">{message}</p>
    <div className="flex space-x-3">
      <button
        onClick={onCancel}
        className="flex-1 bg-slate-700 text-slate-200 font-bold py-2 rounded-lg hover:bg-slate-600"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 bg-violet-600 text-white font-bold py-2 rounded-lg hover:bg-violet-700"
      >
        {confirmText}
      </button>
    </div>
  </div>
);

/**
 * NewAppointmentForm - Formulário inline para criar agendamento
 */
interface NewAppointmentFormProps {
  onClose: () => void;
}

const NewAppointmentForm: React.FC<NewAppointmentFormProps> = ({ onClose }) => {
  const { createAppointment } = useAppointments();
  const { clients } = useClients({ autoFetch: true });
  const { services } = useServices({ autoFetch: true });
  const { success, error: showError } = useUI();

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPrice = selectedServices.reduce((sum, serviceName) => {
    const service = services.find(s => s.name === serviceName);
    return sum + (service?.price || 0);
  }, 0);

  const handleSubmit = async () => {
    if (!clientName.trim() || !phone.trim() || selectedServices.length === 0 || !date || !startTime) {
      showError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await createAppointment({
        clientName: clientName.trim(),
        clientPhone: phone.trim(),
        date,
        startTime,
        status: AppointmentStatus.Pending,
        // Campos opcionais (não validados pelas regras, mas salvos)
        duration,
        price: totalPrice,
        services: selectedServices,
        notes: notes.trim()
      });
      success('Agendamento criado com sucesso!');
      onClose();
    } catch (err) {
      showError('Erro ao criar agendamento');
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <label className="text-sm font-medium text-slate-400">Cliente *</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nome do cliente"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Telefone *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(00) 00000-0000"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400 mb-2 block">
          Serviços * (R$ {totalPrice.toFixed(2)})
        </label>
        <div className="space-y-2 max-h-32 overflow-y-auto border border-slate-600 rounded-lg p-3 bg-slate-700/30">
          {services.length === 0 ? (
            <p className="text-slate-400 text-sm">Nenhum serviço disponível</p>
          ) : (
            services.map(service => (
              <label key={service.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.name)}
                  onChange={() => toggleService(service.name)}
                  className="w-4 h-4 text-violet-600 bg-slate-700 border-slate-600 rounded focus:ring-2 focus:ring-violet-500"
                />
                <span className="text-slate-200 text-sm">
                  {service.name} - R$ {service.price.toFixed(2)}
                </span>
              </label>
            ))
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-slate-400">Data *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-400">Horário *</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Duração (minutos)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          min="15"
          step="15"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações sobre o agendamento..."
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          rows={2}
        />
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 bg-slate-700 text-slate-200 font-bold py-2 rounded-lg hover:bg-slate-600 disabled:bg-slate-800"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-violet-600 text-white font-bold py-2 rounded-lg hover:bg-violet-700 disabled:bg-slate-500"
        >
          {loading ? 'Salvando...' : 'Agendar'}
        </button>
      </div>
    </div>
  );
};

/**
 * NewClientForm - Formulário inline para criar cliente
 */
interface NewClientFormProps {
  onClose: () => void;
}

const NewClientForm: React.FC<NewClientFormProps> = ({ onClose }) => {
  const { createClient } = useClients();
  const { success, error: showError } = useUI();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      showError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await createClient({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        rating: 0,
        notes: ''
      });
      success('Cliente cadastrado com sucesso!');
      onClose();
    } catch (err) {
      showError('Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-400">Nome *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Telefone *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(11) 99999-9999"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="cliente@email.com"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 bg-slate-700 text-slate-200 font-bold py-2 rounded-lg hover:bg-slate-600 disabled:bg-slate-800"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-violet-600 text-white font-bold py-2 rounded-lg hover:bg-violet-700 disabled:bg-slate-500"
        >
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>
      </div>
    </div>
  );
};

/**
 * NewPaymentForm - Formulário inline para registrar transação
 */
interface NewPaymentFormProps {
  onClose: () => void;
}

const NewPaymentForm: React.FC<NewPaymentFormProps> = ({ onClose }) => {
  const { createTransaction } = useFinancial();
  const { success, error: showError } = useUI();
  const [type, setType] = useState<TransactionType>(TransactionType.Income);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Serviços');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      showError('Preencha todos os campos corretamente');
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      await createTransaction({
        type,
        description: description.trim(),
        category,
        amount: parseFloat(amount),
        date,
        time,
        paymentMethod
      });
      success('Transação registrada com sucesso!');
      onClose();
    } catch (err) {
      showError('Erro ao registrar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-400">Tipo *</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value={TransactionType.Income}>Receita</option>
          <option value={TransactionType.Expense}>Despesa</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Descrição *</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Corte de cabelo - João Silva"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Valor (R$) *</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Categoria *</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Ex: Serviços, Produtos"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Método de Pagamento *</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão">Cartão</option>
          <option value="Pix">Pix</option>
        </select>
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 bg-slate-700 text-slate-200 font-bold py-2 rounded-lg hover:bg-slate-600 disabled:bg-slate-800"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-violet-600 text-white font-bold py-2 rounded-lg hover:bg-violet-700 disabled:bg-slate-500"
        >
          {loading ? 'Salvando...' : 'Registrar'}
        </button>
      </div>
    </div>
  );
};

// ===== Main Component =====

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Hooks
  const { 
    appointments, 
    loading: appointmentsLoading,
    getTodayAppointments,
    getFutureAppointments,
    getStats: getAppointmentStats,
    updateStatus,
    deleteAppointment
  } = useAppointments({ autoFetch: 'upcoming' });
  
  const { 
    clients,
    getStats: getClientStats
  } = useClients({ autoFetch: true });
  
  const { 
    getTodayTransactions,
    getMonthlyStats
  } = useFinancial({ autoFetch: 'current-month' });
  
  const { openModal, closeModal, isModalOpen, success, error: showError } = useUI();
  
  // Estado local
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Data formatada
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(today);

  // Estatísticas - Otimizado com useMemo
  const { todayAppointments, futureAppointments, appointmentStats, nextAppointment, todayRevenue, todayTransactionsCount } = useMemo(() => {
    const today = getTodayAppointments();
    const future = getFutureAppointments().slice(0, 5);
    const stats = getAppointmentStats();
    const transactions = getTodayTransactions()
      .filter(t => t.type === TransactionType.Income);
    const revenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const next = future[0] || null;

    return {
      todayAppointments: today,
      futureAppointments: future,
      appointmentStats: stats,
      nextAppointment: next,
      todayRevenue: revenue,
      todayTransactionsCount: transactions.length
    };
  }, [getTodayAppointments, getFutureAppointments, getAppointmentStats, getTodayTransactions]);

  const clientStats = useMemo(() => getClientStats(), [getClientStats]);

  // Handlers
  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    openModal('editAppointment', appointment);
  };

  const handleRemoveClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    openModal('confirmRemove', appointment);
  };

  const handleCompleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    openModal('confirmComplete', appointment);
  };

  const handleConfirmRemove = async () => {
    if (!selectedAppointment) return;
    
    try {
      await updateStatus(selectedAppointment.id, AppointmentStatus.Cancelled);
      success('Agendamento cancelado com sucesso!');
      closeModal('confirmRemove');
      setSelectedAppointment(null);
    } catch (err) {
      showError('Erro ao cancelar agendamento');
    }
  };

  const handleConfirmComplete = async () => {
    if (!selectedAppointment) return;
    
    try {
      await updateStatus(selectedAppointment.id, AppointmentStatus.Completed);
      success('Agendamento concluído com sucesso!');
      closeModal('confirmComplete');
      setSelectedAppointment(null);
    } catch (err) {
      showError('Erro ao concluir agendamento');
    }
  };

  return (
    <>
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div>
          <p className="text-2xl font-bold text-slate-100">Dashboard</p>
          <p className="text-slate-400 capitalize">{formattedDate}</p>
        </div>

        {/* Novo Agendamento Button */}
        <button
          onClick={() => {
            setSelectedAppointment(null);
            openModal('newAppointment');
          }}
          className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-colors"
        >
          <Icon name="plus" className="w-5 h-5" />
          <span>Novo Agendamento</span>
        </button>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon="calendar"
            title="Agendamentos Hoje"
            value={todayAppointments.length.toString()}
            trend={`${appointmentStats.confirmed} confirmados`}
          />
          <StatCard
            icon="dollar"
            title="Receita Hoje"
            value={`R$ ${todayRevenue.toFixed(0)}`}
            trend={`${todayTransactionsCount} transações`}
          />
          <StatCard
            icon="users"
            title="Total de Clientes"
            value={clientStats.total.toString()}
            trend={`${clientStats.active} ativos`}
          />
          <StatCard
            icon="clock"
            title="Próximo Cliente"
            value={nextAppointment?.startTime || '--:--'}
            trend={nextAppointment?.clientName || 'Nenhum agendamento'}
          />
        </div>

        {/* Ações Rápidas */}
        <Card>
          <h3 className="font-bold text-slate-100 mb-4 flex items-center">
            <Icon name="scissors" className="w-5 h-5 mr-2 text-violet-400" />
            Ações Rápidas
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Acesso rápido às funcionalidades principais
          </p>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton
              icon="calendar"
              label="Novo Agendamento"
              onClick={() => openModal('newAppointment')}
            />
            <QuickActionButton
              icon="users"
              label="Cadastrar Cliente"
              onClick={() => openModal('newClient')}
            />
            <QuickActionButton
              icon="payment"
              label="Registrar Pagamento"
              onClick={() => openModal('newPayment')}
            />
            <QuickActionButton
              icon="clock"
              label="Ver Agenda"
              onClick={() => navigate('/agenda')}
            />
          </div>
        </Card>

        {/* Próximos Agendamentos */}
        <Card>
          <h3 className="font-bold text-slate-100 mb-1">Próximos Agendamentos</h3>
          <p className="text-sm text-slate-400 mb-4">Seus próximos compromissos</p>
          
          {appointmentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-400 text-sm mt-2">Carregando...</p>
            </div>
          ) : futureAppointments.length > 0 ? (
            <>
              <div
                className="relative max-h-96 overflow-y-auto space-y-3 pr-2 -mr-2"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)'
                }}
              >
                {futureAppointments.map((app) => (
                  <UpcomingAppointmentItem
                    key={app.id}
                    appointment={app}
                    onEdit={handleEditClick}
                    onRemove={handleRemoveClick}
                    onComplete={handleCompleteClick}
                  />
                ))}
              </div>
              <button
                onClick={() => navigate('/agenda')}
                className="w-full mt-6 text-center text-violet-400 font-semibold text-sm hover:underline"
              >
                Ver Todos os Agendamentos
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <Icon name="calendar" className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-slate-500 text-sm mt-2">Nenhum agendamento futuro.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen('confirmRemove')}
        onClose={() => closeModal('confirmRemove')}
        title="Confirmar Cancelamento"
      >
        <ConfirmationModalContent
          message="Tem certeza que deseja cancelar este agendamento?"
          confirmText="Cancelar Agendamento"
          onConfirm={handleConfirmRemove}
          onCancel={() => closeModal('confirmRemove')}
        />
      </Modal>

      <Modal
        isOpen={isModalOpen('confirmComplete')}
        onClose={() => closeModal('confirmComplete')}
        title="Confirmar Conclusão"
      >
        <ConfirmationModalContent
          message="Deseja marcar este agendamento como concluído?"
          confirmText="Concluir"
          onConfirm={handleConfirmComplete}
          onCancel={() => closeModal('confirmComplete')}
        />
      </Modal>

      <Modal
        isOpen={isModalOpen('newAppointment')}
        onClose={() => closeModal('newAppointment')}
        title="Novo Agendamento"
      >
        <NewAppointmentForm onClose={() => closeModal('newAppointment')} />
      </Modal>

      <Modal
        isOpen={isModalOpen('newClient')}
        onClose={() => closeModal('newClient')}
        title="Cadastrar Novo Cliente"
      >
        <NewClientForm onClose={() => closeModal('newClient')} />
      </Modal>

      <Modal
        isOpen={isModalOpen('newPayment')}
        onClose={() => closeModal('newPayment')}
        title="Registrar Transação"
      >
        <NewPaymentForm onClose={() => closeModal('newPayment')} />
      </Modal>
    </>
  );
};
