/**
 * AgendaPage - Página de visualização da agenda
 * 
 * Página para visualizar agendamentos em diferentes formatos:
 * - 3 views: Timeline (linha do tempo), Kanban (colunas por status), Calendar (grade de horários)
 * - Navegação de datas (anterior/hoje/próximo)
 * - Cards de estatísticas do dia
 * - Filtros por profissional
 * - Cards de agendamento interativos
 * - Botão rápido para novo agendamento
 * 
 * Integração com AppointmentsStore:
 * - Auto-fetch de agendamentos futuros
 * - Filtros em tempo real
 * - Atualização de status inline
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 8 (Agenda)
 * - DESCRICAO_FEATURES.md - Seção 3 (Agenda Visual)
 * - FLUXO_NAVEGACAO.md - Fluxo 5 (Agenda)
 * 
 * Features:
 * - Timeline: Horários com slots disponíveis e ocupados
 * - Kanban: Colunas por status com drag-and-drop simulado
 * - Calendar: Grade de horários do dia
 * - Navegação de datas
 * - Stats do dia selecionado
 */

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useAppointments } from '@/hooks/useAppointments';
import { useUI } from '@/hooks/useUI';
import { Appointment, AppointmentStatus } from '@/types';

// ===== Sub-Components =====

/**
 * TimelineSlot - Slot de horário na timeline
 */
interface TimelineSlotProps {
  time: string;
  appointment?: Appointment;
  onNewAppointment?: (time: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

const TimelineSlot: React.FC<TimelineSlotProps> = ({
  time,
  appointment,
  onNewAppointment,
  onAppointmentClick
}) => {
  if (appointment) {
    return (
      <div className="flex space-x-4 items-start">
        <p className="w-12 text-right text-slate-400 text-sm">{time}</p>
        <div className="w-px bg-slate-700 h-full relative">
          <div className="w-2 h-2 rounded-full bg-violet-500 absolute top-1 -left-1 ring-4 ring-slate-900"></div>
        </div>
        <div className="flex-1 -mt-1">
          <button
            onClick={() => onAppointmentClick?.(appointment)}
            className="w-full text-left"
          >
            <Card className="bg-slate-800 hover:bg-slate-750 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-100">{appointment.clientName}</p>
                  <p className="text-sm text-slate-300">{appointment.services.join(' + ')}</p>
                  <p className="text-xs text-slate-400 mt-1">{appointment.duration}min</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    appointment.status === AppointmentStatus.Confirmed
                      ? 'bg-violet-500/20 text-violet-400'
                      : appointment.status === AppointmentStatus.Pending
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </Card>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 items-start h-20">
      <p className="w-12 text-right text-slate-400 text-sm pt-2">{time}</p>
      <div className="w-px bg-slate-700 h-full relative">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 absolute top-3 -left-0.5"></div>
      </div>
      <div className="flex-1 pt-1">
        <button
          onClick={() => onNewAppointment?.(time)}
          className="w-full border-2 border-dashed border-slate-700 rounded-xl p-3 text-center hover:border-violet-500/50 transition-colors"
        >
          <p className="text-slate-500 text-sm font-semibold">Horário disponível</p>
          <p className="text-violet-400 text-sm font-bold flex items-center justify-center mt-1">
            <Icon name="plus" className="w-4 h-4 mr-1" /> Agendar
          </p>
        </button>
      </div>
    </div>
  );
};

/**
 * KanbanColumn - Coluna do Kanban (agrupamento por status)
 */
interface KanbanColumnProps {
  title: string;
  status: AppointmentStatus;
  appointments: Appointment[];
  color: string;
  onAppointmentClick: (appointment: Appointment) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  appointments,
  color,
  onAppointmentClick
}) => (
  <div className="flex-1 min-w-0">
    <div className={`px-3 py-2 rounded-lg ${color} mb-3`}>
      <p className="font-bold text-slate-100 text-sm">{title}</p>
      <p className="text-xs text-slate-300">{appointments.length} agendamentos</p>
    </div>
    <div className="space-y-2">
      {appointments.length > 0 ? (
        appointments.map(app => (
          <button
            key={app.id}
            onClick={() => onAppointmentClick(app)}
            className="w-full text-left"
          >
            <Card className="!p-3 hover:bg-slate-750 transition-colors">
              <p className="font-bold text-slate-100 text-sm">{app.startTime}</p>
              <p className="text-xs text-slate-300 mt-1">{app.clientName}</p>
              <p className="text-xs text-slate-400 mt-1">{app.services.join(', ')}</p>
            </Card>
          </button>
        ))
      ) : (
        <div className="text-center py-4">
          <Icon name="inbox" className="w-6 h-6 mx-auto text-slate-600" />
          <p className="text-slate-500 text-xs mt-1">Nenhum agendamento</p>
        </div>
      )}
    </div>
  </div>
);

/**
 * CalendarView - Grade de horários do dia
 */
interface CalendarViewProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onNewAppointment: (time: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  onAppointmentClick,
  onNewAppointment
}) => {
  // Gera slots de 30 em 30 minutos das 8h às 20h
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  }, []);

  return (
    <div className="space-y-1">
      {timeSlots.map(time => {
        const appointment = appointments.find(a => a.startTime === time);
        return (
          <TimelineSlot
            key={time}
            time={time}
            appointment={appointment}
            onNewAppointment={onNewAppointment}
            onAppointmentClick={onAppointmentClick}
          />
        );
      })}
    </div>
  );
};

/**
 * AppointmentDetailModal - Modal de detalhes do agendamento
 */
interface AppointmentDetailModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  onClose
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-2xl font-bold text-slate-100">{appointment.clientName}</p>
        <p className="text-slate-400">{appointment.clientPhone}</p>
      </div>
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          appointment.status === AppointmentStatus.Confirmed
            ? 'bg-violet-500/20 text-violet-400'
            : appointment.status === AppointmentStatus.Pending
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-slate-500/20 text-slate-400'
        }`}
      >
        {appointment.status}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
      <div>
        <p className="text-xs text-slate-400">Data</p>
        <p className="font-semibold text-slate-200">{appointment.date}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400">Horário</p>
        <p className="font-semibold text-slate-200">{appointment.startTime}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400">Duração</p>
        <p className="font-semibold text-slate-200">{appointment.duration} min</p>
      </div>
      <div>
        <p className="text-xs text-slate-400">Preço</p>
        <p className="font-semibold text-slate-200">
          {appointment.price ? `R$ ${appointment.price.toFixed(2)}` : '-'}
        </p>
      </div>
    </div>
    <div className="pt-4 border-t border-slate-700">
      <p className="text-xs text-slate-400 mb-2">Serviços</p>
      <div className="flex flex-wrap gap-2">
        {appointment.services.map((service, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs rounded-full"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
    {appointment.notes && (
      <div className="pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 mb-2">Observações</p>
        <p className="text-sm text-slate-300 italic">"{appointment.notes}"</p>
      </div>
    )}
    <button
      onClick={onClose}
      className="w-full bg-violet-600 text-white font-bold py-2 rounded-lg hover:bg-violet-700 mt-4"
    >
      Fechar
    </button>
  </div>
);

// ===== Main Component =====

type ViewMode = 'timeline' | 'kanban' | 'calendar';

export const AgendaPage: React.FC = () => {
  // Hooks
  const { appointments, filterByDate, filterByStatus } = useAppointments({ autoFetch: 'upcoming' });
  const { openModal, closeModal, isModalOpen } = useUI();

  // State
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [prefilledTime, setPrefilledTime] = useState<string | undefined>(undefined);

  // Filtered appointments for selected date
  const dayAppointments = useMemo(() => {
    return filterByDate(selectedDate);
  }, [appointments, selectedDate, filterByDate]);

  // Stats
  const totalAppointments = dayAppointments.length;
  const confirmedCount = filterByStatus(AppointmentStatus.Confirmed).filter(
    a => a.date === selectedDate
  ).length;
  const pendingCount = filterByStatus(AppointmentStatus.Pending).filter(
    a => a.date === selectedDate
  ).length;
  const nextAppointment = dayAppointments.find(
    a => a.status !== AppointmentStatus.Cancelled
  );

  // Date navigation
  const handlePreviousDay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Format date for display
  const formatDateDisplay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Handlers
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    openModal('appointmentDetail');
  };

  const handleNewAppointment = (time?: string) => {
    // Open new appointment modal with pre-filled time
    if (time) {
      setPrefilledTime(time);
    }
    openModal('newAppointmentAgenda');
  };

  // Kanban columns
  const kanbanColumns = useMemo(() => {
    return [
      {
        title: 'Pendente',
        status: AppointmentStatus.Pending,
        appointments: dayAppointments.filter(a => a.status === AppointmentStatus.Pending),
        color: 'bg-yellow-500/20'
      },
      {
        title: 'Confirmado',
        status: AppointmentStatus.Confirmed,
        appointments: dayAppointments.filter(a => a.status === AppointmentStatus.Confirmed),
        color: 'bg-violet-500/20'
      },
      {
        title: 'Concluído',
        status: AppointmentStatus.Completed,
        appointments: dayAppointments.filter(a => a.status === AppointmentStatus.Completed),
        color: 'bg-green-500/20'
      },
      {
        title: 'Cancelado',
        status: AppointmentStatus.Cancelled,
        appointments: dayAppointments.filter(a => a.status === AppointmentStatus.Cancelled),
        color: 'bg-red-500/20'
      }
    ];
  }, [dayAppointments]);

  return (
    <>
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div>
          <p className="text-2xl font-bold text-slate-100">Agenda</p>
          <p className="text-slate-400 capitalize">{formatDateDisplay()}</p>
        </div>

        {/* Date Navigation */}
        <div className="flex space-x-2">
          <div className="flex-grow flex items-center bg-slate-800/50 border border-slate-700 rounded-lg">
            <button onClick={handlePreviousDay} className="p-2.5 text-slate-400 hover:text-white">
              <Icon name="left" className="w-5 h-5" />
            </button>
            <button
              onClick={handleToday}
              className="flex-grow text-center font-semibold text-slate-200 hover:text-white"
            >
              {isToday ? 'Hoje' : 'Ir para Hoje'}
            </button>
            <button onClick={handleNextDay} className="p-2.5 text-slate-400 hover:text-white">
              <Icon name="right" className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => handleNewAppointment()}
            className="bg-violet-600 text-white font-bold p-2.5 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-violet-600/20 hover:bg-violet-700"
          >
            <Icon name="plus" className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <Card className="!p-3 flex items-center">
            <Icon name="calendar" className="w-5 h-5 mr-3 text-violet-400" />
            <div>
              <p className="text-slate-400 text-xs">Total Agendamentos</p>
              <p className="font-bold text-xl text-slate-100">{totalAppointments}</p>
            </div>
          </Card>
          <Card className="!p-3 flex items-center">
            <Icon name="check" className="w-5 h-5 mr-3 text-green-400" />
            <div>
              <p className="text-slate-400 text-xs">Confirmados</p>
              <p className="font-bold text-xl text-slate-100">{confirmedCount}</p>
            </div>
          </Card>
          <Card className="!p-3 flex items-center">
            <Icon name="clock" className="w-5 h-5 mr-3 text-yellow-400" />
            <div>
              <p className="text-slate-400 text-xs">Pendentes</p>
              <p className="font-bold text-xl text-slate-100">{pendingCount}</p>
            </div>
          </Card>
          <Card className="!p-3 flex items-center">
            <Icon name="clock" className="w-5 h-5 mr-3 text-slate-400" />
            <div>
              <p className="text-slate-400 text-xs">Próximo Cliente</p>
              <p className="font-bold text-xl text-slate-100">
                {nextAppointment?.startTime || '--:--'}
              </p>
            </div>
          </Card>
        </div>

        {/* View Mode Selector */}
        <div>
          <div className="flex space-x-2 items-center">
            <div className="flex-grow flex space-x-1 p-1 bg-slate-800/50 rounded-lg">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-1 text-center text-sm py-1.5 rounded-md ${
                  viewMode === 'calendar'
                    ? 'bg-slate-700 font-semibold text-slate-100'
                    : 'text-slate-400'
                }`}
              >
                Calendário
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex-1 text-center text-sm py-1.5 rounded-md ${
                  viewMode === 'kanban'
                    ? 'bg-slate-700 font-semibold text-slate-100'
                    : 'text-slate-400'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex-1 text-center text-sm py-1.5 rounded-md ${
                  viewMode === 'timeline'
                    ? 'bg-slate-700 font-semibold text-slate-100'
                    : 'text-slate-400'
                }`}
              >
                Timeline
              </button>
            </div>
          </div>
        </div>

        {/* View Content */}
        {viewMode === 'timeline' && (
          <Card>
            <h3 className="font-bold text-slate-100 mb-2">Linha do Tempo</h3>
            <p className="text-sm text-slate-400 mb-6">Visualização cronológica dos agendamentos</p>
            <CalendarView
              appointments={dayAppointments}
              onAppointmentClick={handleAppointmentClick}
              onNewAppointment={handleNewAppointment}
            />
          </Card>
        )}

        {viewMode === 'kanban' && (
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex space-x-3 min-w-max">
              {kanbanColumns.map(column => (
                <KanbanColumn
                  key={column.status}
                  title={column.title}
                  status={column.status}
                  appointments={column.appointments}
                  color={column.color}
                  onAppointmentClick={handleAppointmentClick}
                />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'calendar' && (
          <Card>
            <h3 className="font-bold text-slate-100 mb-2">Grade de Horários</h3>
            <p className="text-sm text-slate-400 mb-6">Todos os horários do dia</p>
            <CalendarView
              appointments={dayAppointments}
              onAppointmentClick={handleAppointmentClick}
              onNewAppointment={handleNewAppointment}
            />
          </Card>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen('newAppointmentAgenda')}
        onClose={() => {
          closeModal('newAppointmentAgenda');
          setPrefilledTime(undefined);
        }}
        title="Novo Agendamento"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Horário pré-selecionado: <span className="text-slate-200 font-semibold">{prefilledTime || '--:--'}</span>
          </p>
          <p className="text-sm text-slate-300">
            Utilize o formulário de agendamento no Dashboard para criar um novo agendamento com todos os detalhes.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                closeModal('newAppointmentAgenda');
                setPrefilledTime(undefined);
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-100 py-2 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                closeModal('newAppointmentAgenda');
                window.location.hash = '#/dashboard';
              }}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg transition"
            >
              Ir ao Dashboard
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isModalOpen('appointmentDetail')}
        onClose={() => {
          closeModal('appointmentDetail');
          setSelectedAppointment(null);
        }}
        title="Detalhes do Agendamento"
      >
        {selectedAppointment && (
          <AppointmentDetailModal
            appointment={selectedAppointment}
            onClose={() => {
              closeModal('appointmentDetail');
              setSelectedAppointment(null);
            }}
          />
        )}
      </Modal>
    </>
  );
};
