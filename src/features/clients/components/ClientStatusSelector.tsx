/**
 * ClientStatusSelector - Componente de seleção de status de cliente
 * 
 * Dropdown interativo para alterar o status do cliente (Ativo/Inativo).
 * Reutilizável em diferentes contextos (cards, modals, etc).
 * 
 * Features:
 * - Badge colorido indicando status atual
 * - Dropdown com opções de status
 * - Visual consistente com StatusSelector
 * - Click outside to close
 * 
 * Props:
 * - currentStatus: Status atual do cliente
 * - onStatusChange: Callback ao alterar status
 * - disabled: Desabilita interação
 * 
 * Exemplo de uso:
 * ```tsx
 * <ClientStatusSelector
 *   currentStatus={client.status}
 *   onStatusChange={(newStatus) => updateStatus(client.id, newStatus)}
 * />
 * ```
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ClientStatus } from '@/types';
import { Icon } from '@/components/Icon';

interface ClientStatusSelectorProps {
  currentStatus: ClientStatus;
  onStatusChange: (status: ClientStatus) => void;
  disabled?: boolean;
}

export const ClientStatusSelector: React.FC<ClientStatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusConfig = {
    [ClientStatus.Active]: {
      label: 'Ativo',
      bgClass: 'bg-violet-500/20 text-violet-400',
      icon: 'check',
    },
    [ClientStatus.Inactive]: {
      label: 'Inativo',
      bgClass: 'bg-slate-600 text-slate-300',
      icon: 'x',
    },
  };

  const handleToggle = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleStatusClick = useCallback((status: ClientStatus, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onStatusChange(status);
    setIsOpen(false);
  }, [onStatusChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const currentConfig = statusConfig[currentStatus];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 transition ${
          currentConfig.bgClass
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{currentConfig.label}</span>
        <Icon name="down" className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20">
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              type="button"
              onClick={(e) => handleStatusClick(status as ClientStatus, e)}
              className={`w-full flex items-center px-3 py-2 text-sm transition ${
                status === currentStatus
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              } ${
                status === ClientStatus.Active ? 'rounded-t-lg' : 'rounded-b-lg'
              }`}
            >
              <Icon name={config.icon} className="w-4 h-4 mr-2" />
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
