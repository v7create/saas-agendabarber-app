/**
 * HistoryPage - Página de Histórico de Atendimentos
 * 
 * Features:
 * - Histórico completo de atendimentos realizados (status = Concluído)
 * - Exportação de relatórios (placeholder)
 * - Busca por cliente ou serviço
 * - Filtros por período (placeholder)
 * - Stats cards (serviços realizados, receita total, ticket médio)
 * - Timeline detalhada com notas
 * 
 * Integração:
 * - AppointmentsStore (para histórico real filtrado por Concluído)
 */

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentStatus } from '@/types';

/**
 * StatCard - Card de estatística reutilizável
 */
interface StatCardProps {
  icon: string;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <Card>
    <Icon name={icon} className="w-6 h-6 text-violet-400 mb-2" />
    <p className="text-2xl font-bold text-slate-100">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{title}</p>
  </Card>
);

/**
 * HistoryDetailCard - Card detalhado de atendimento no histórico
 */
interface HistoryDetailCardProps {
  clientName: string;
  services: string;
  date: string;
  time: string;
  duration: number;
  price?: number;
  notes?: string;
}

const HistoryDetailCard: React.FC<HistoryDetailCardProps> = ({
  clientName,
  services,
  date,
  time,
  duration,
  price,
  notes
}) => {
  return (
    <div className="flex space-x-4">
      {/* Data e Hora */}
      <div className="text-center">
        <p className="font-bold text-slate-100">{date}</p>
        <p className="text-sm text-slate-400">{time}</p>
      </div>

      {/* Separador vertical */}
      <div className="w-px bg-slate-700 h-auto"></div>

      {/* Detalhes do atendimento */}
      <Card className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-slate-300 flex items-center">
              <Icon name="user" className="w-4 h-4 mr-2" />
              {clientName}
            </p>
            <p className="font-bold text-slate-100 text-lg">{services}</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
            Concluído
          </span>
        </div>

        {/* Duração e Preço */}
        <div className="flex items-center justify-between text-sm text-slate-400 mt-3">
          <span>{duration}min</span>
          {price && (
            <span className="font-bold text-slate-100 text-base">
              R$ {price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Observações (se houver) */}
        {notes && (
          <p className="text-xs text-slate-500 italic mt-3 pt-3 border-t border-slate-700">
            "{notes}"
          </p>
        )}
      </Card>
    </div>
  );
};

/**
 * HistoryPage - Componente principal
 */
export const HistoryPage: React.FC = () => {
  const { appointments } = useAppointments({ autoFetch: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('30days');

  // Filtrar apenas agendamentos concluídos
  const completedAppointments = useMemo(() => {
    return appointments.filter(a => a.status === AppointmentStatus.Completed);
  }, [appointments]);

  const periodFilteredAppointments = useMemo(() => {
    const sorted = [...completedAppointments].sort((a, b) => {
      if (a.date === b.date) {
        return b.startTime.localeCompare(a.startTime);
      }
      return b.date.localeCompare(a.date);
    });

    if (periodFilter === 'all') {
      return sorted;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getIso = (date: Date) => date.toISOString().split('T')[0];

    let startDate: Date;
    let endDate: Date;

    switch (periodFilter) {
      case '7days': {
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        endDate = new Date(today);
        break;
      }
      case '30days': {
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 29);
        endDate = new Date(today);
        break;
      }
      case 'thisMonth': {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case 'lastMonth': {
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      default: {
        return sorted;
      }
    }

    const startIso = getIso(startDate);
    const endIso = getIso(endDate);

    return sorted.filter(app => app.date >= startIso && app.date <= endIso);
  }, [completedAppointments, periodFilter]);

  // Filtrar por busca
  const filteredAppointments = useMemo(() => {
    if (!searchQuery) return periodFilteredAppointments;
    const query = searchQuery.toLowerCase();
    return periodFilteredAppointments.filter(
      a =>
        a.clientName.toLowerCase().includes(query) ||
        a.services.some(s => s.toLowerCase().includes(query))
    );
  }, [periodFilteredAppointments, searchQuery]);

  // Calcular stats
  const stats = useMemo(() => {
    const servicesCount = filteredAppointments.length;
    const totalRevenue = filteredAppointments.reduce((sum, a) => sum + (a.price || 0), 0);
    const averageTicket = servicesCount > 0 ? totalRevenue / servicesCount : 0;

    return {
      servicesCount,
      totalRevenue,
      averageTicket
    };
  }, [filteredAppointments]);

  // Formatar datas para exibição
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('pt-BR', { month: '2-digit', day: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <p className="text-2xl font-bold">Histórico de Atendimentos</p>
        <p className="text-slate-400">Acompanhe todos os serviços realizados</p>
      </div>

      {/* Botão de Exportação */}
      <button className="w-full bg-slate-800/50 border border-slate-700 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors">
        <Icon name="download" className="w-5 h-5" />
        <span>Exportar Relatório</span>
      </button>

      {/* Campo de Busca */}
      <div className="relative">
        <Icon name="search" className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por cliente ou serviço..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Filtros de Período */}
      <div className="flex space-x-3">
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="flex-grow bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
          <option value="thisMonth">Este mês</option>
          <option value="lastMonth">Mês passado</option>
          <option value="all">Todos</option>
        </select>
        <button className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors">
          <Icon name="filter" className="w-5 h-5 text-slate-400" />
          <span className="font-semibold">Filtros</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon="scissors"
          title="Serviços Realizados"
          value={stats.servicesCount.toString()}
        />
        <StatCard
          icon="dollar"
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toFixed(0)}`}
        />
        <StatCard
          icon="clock"
          title="Ticket Médio"
          value={`R$ ${stats.averageTicket.toFixed(0)}`}
        />
        <StatCard
          icon="user"
          title="Clientes Atendidos"
          value={new Set(filteredAppointments.map(a => a.clientName)).size.toString()}
        />
      </div>

      {/* Histórico Detalhado */}
      <Card>
        <h3 className="font-bold text-slate-100 mb-2 flex items-center">
          <Icon name="history" className="w-5 h-5 mr-2 text-violet-400" />
          Histórico Detalhado
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Registro completo de todos os atendimentos realizados
        </p>
        <div className="space-y-5">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <HistoryDetailCard
                key={appointment.id}
                clientName={appointment.clientName}
                services={appointment.services.join(' + ')}
                date={formatDate(appointment.date)}
                time={appointment.startTime}
                duration={appointment.duration}
                price={appointment.price}
                notes={appointment.notes}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Icon name="history" className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Nenhum atendimento no histórico</p>
              <p className="text-sm text-slate-500">
                Os atendimentos concluídos aparecerão aqui
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
