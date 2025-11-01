/**
 * StatusSelector - Componente de seleção de status de agendamento
 * 
 * Dropdown clicável que permite alterar o status do agendamento
 * com feedback visual através de cores e ícone de chevron (estilo Notion)
 */

import React, { useState } from 'react';
import { Icon } from './Icon';
import { AppointmentStatus } from '@/types';

interface StatusSelectorProps {
  currentStatus: AppointmentStatus;
  onStatusChange: (newStatus: AppointmentStatus) => void;
  disabled?: boolean;
}

const statusConfig = {
  [AppointmentStatus.Pending]: {
    label: 'Pendente',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hoverColor: 'hover:bg-yellow-500/30'
  },
  [AppointmentStatus.Confirmed]: {
    label: 'Confirmado',
    color: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    hoverColor: 'hover:bg-violet-500/30'
  },
  [AppointmentStatus.Completed]: {
    label: 'Concluído',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    hoverColor: 'hover:bg-green-500/30'
  },
  [AppointmentStatus.Cancelled]: {
    label: 'Cancelado',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    hoverColor: 'hover:bg-red-500/30'
  }
};

const allStatuses = [
  AppointmentStatus.Pending,
  AppointmentStatus.Confirmed,
  AppointmentStatus.Completed,
  AppointmentStatus.Cancelled
];

export const StatusSelector: React.FC<StatusSelectorProps> = ({ 
  currentStatus, 
  onStatusChange,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusSelect = (status: AppointmentStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  if (disabled) {
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statusConfig[currentStatus].color}`}>
        {statusConfig[currentStatus].label}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-xs font-semibold px-2 py-1 rounded-full border flex items-center gap-1 transition-colors ${statusConfig[currentStatus].color} ${statusConfig[currentStatus].hoverColor}`}
      >
        {statusConfig[currentStatus].label}
        <Icon name="chevronDown" className="w-3 h-3" />
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-1 w-32 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-20 overflow-hidden">
            {allStatuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  status === currentStatus
                    ? 'bg-slate-600 font-semibold'
                    : 'hover:bg-slate-600'
                } ${statusConfig[status].color.split(' ')[1]}`}
              >
                {statusConfig[status].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
