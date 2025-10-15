/**
 * HistoryPage - Página de Histórico de Atendimentos
 * 
 * Features:
 * - Histórico completo de atendimentos realizados
 * - Exportação de relatórios
 * - Busca por cliente ou serviço
 * - Filtros por período
 * - Stats cards (serviços realizados, receita, avaliação, ticket médio)
 * - Timeline detalhada com avaliações
 * 
 * Integração:
 * - AppointmentsStore (futuramente para histórico real)
 * - FinancialStore (futuramente para stats reais)
 * - ClientsStore (futuramente para busca)
 * 
 * TODO: Implementar integração com stores reais
 */

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { MOCK_HISTORY } from '@/constants';

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
  item: typeof MOCK_HISTORY[0];
}

const HistoryDetailCard: React.FC<HistoryDetailCardProps> = ({ item }) => {
  return (
    <div className="flex space-x-4">
      {/* Data e Hora */}
      <div className="text-center">
        <p className="font-bold text-slate-100">{item.date}</p>
        <p className="text-sm text-slate-400">{item.time}</p>
      </div>

      {/* Separador vertical */}
      <div className="w-px bg-slate-700 h-auto"></div>

      {/* Detalhes do atendimento */}
      <Card className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-slate-300 flex items-center">
              <Icon name="user" className="w-4 h-4 mr-2" />
              {item.clientName}
            </p>
            <p className="font-bold text-slate-100 text-lg">{item.services}</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400">
            Concluído
          </span>
        </div>

        {/* Duração e Preço */}
        <div className="flex items-center justify-between text-sm text-slate-400 mt-3">
          <span>{item.duration}min</span>
          <span className="font-bold text-slate-100 text-base">R$ {item.price}</span>
        </div>

        {/* Avaliação */}
        <div className="flex items-center space-x-1 text-yellow-400 mt-3">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="star"
              className={`w-5 h-5 ${i < item.rating ? 'fill-current' : ''}`}
            />
          ))}
        </div>

        {/* Observações (se houver) */}
        {item.notes && (
          <p className="text-xs text-slate-500 italic mt-3 pt-3 border-t border-slate-700">
            "{item.notes}"
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
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('30days');

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
        <StatCard icon="scissors" title="Serviços Realizados" value="4" />
        <StatCard icon="dollar" title="Receita Total" value="R$ 215" />
        <StatCard icon="star" title="Avaliação Média" value="4.8" />
        <StatCard icon="clock" title="Ticket Médio" value="R$ 54" />
      </div>

      {/* Histórico Detalhado */}
      <Card>
        <h3 className="font-bold text-slate-100 mb-2 flex items-center">
          <Icon name="history" className="w-5 h-5 mr-2 text-violet-400" />
          Histórico Detalhado
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Registro completo de todos os atendimentos
        </p>
        <div className="space-y-5">
          {MOCK_HISTORY.map((item) => (
            <HistoryDetailCard key={item.id} item={item} />
          ))}
        </div>

        {/* Empty State (quando não houver histórico) */}
        {MOCK_HISTORY.length === 0 && (
          <div className="text-center py-12">
            <Icon name="history" className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Nenhum atendimento no histórico</p>
            <p className="text-sm text-slate-500">
              Os atendimentos concluídos aparecerão aqui
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
