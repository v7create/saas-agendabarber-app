/**
 * ShopSettingsPage - Página de configurações da barbearia
 * 
 * Página para gerenciar configurações operacionais:
 * - Lista de profissionais (barbeiros/cabeleireiros)
 * - Horários de funcionamento
 * - Formas de pagamento aceitas
 * - CRUD de profissionais
 * 
 * Integração com BarbershopStore:
 * - Gestão de profissionais
 * - Configuração de horários
 * - Métodos de pagamento
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 10 (Configurações da Barbearia)
 * - DESCRICAO_FEATURES.md - Seção 10 (Configurações)
 * 
 * Features:
 * - Lista de profissionais com avatar
 * - Adicionar/Editar/Remover profissionais
 * - Horários semanais
 * - Toggle de métodos de pagamento
 */

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useBarbershop } from '@/hooks/useBarbershop';
import { useUI } from '@/hooks/useUI';
import { Barber } from '@/types';

// ===== Sub-Components =====

/**
 * SettingsItem - Item de configuração reutilizável
 */
interface SettingsItemProps {
  icon: string;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, sublabel, onClick, children }) => {
  const content = (
    <div className="flex items-center justify-between w-full py-3">
      <div className="flex items-center space-x-4">
        <Icon name={icon} className="w-6 h-6 text-slate-400" />
        <div>
          <p className="font-semibold text-slate-200">{label}</p>
          {sublabel && <p className="text-sm text-slate-500">{sublabel}</p>}
        </div>
      </div>
      <div>{children ? children : onClick && <Icon name="right" className="w-5 h-5 text-slate-500" />}</div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left hover:bg-slate-700/30 transition-colors">
        {content}
      </button>
    );
  }
  return <div className="w-full">{content}</div>;
};

/**
 * ToggleSwitch - Switch toggle reutilizável
 */
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${
      enabled ? 'bg-violet-600' : 'bg-slate-600'
    }`}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

/**
 * ProfessionalForm - Formulário para criar/editar profissional
 */
interface ProfessionalFormProps {
  onClose: () => void;
  editingBarber?: Barber | null;
}

const ProfessionalForm: React.FC<ProfessionalFormProps> = ({ onClose, editingBarber }) => {
  const { addBarber, updateBarber } = useBarbershop();
  const { success, error: showError } = useUI();

  const [name, setName] = useState(editingBarber?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(editingBarber?.avatarUrl || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      showError('Digite o nome do profissional');
      return;
    }

    setLoading(true);
    try {
      if (editingBarber) {
        await updateBarber(editingBarber.id, {
          name: name.trim(),
          avatarUrl: avatarUrl.trim() || undefined
        });
        success('Profissional atualizado com sucesso!');
      } else {
        const createData: Omit<Barber, 'id'> = {
          name: name.trim(),
          avatarUrl: avatarUrl.trim() || undefined
        };
        await addBarber(createData);
        success('Profissional adicionado com sucesso!');
      }
      onClose();
    } catch (err) {
      showError('Erro ao salvar profissional');
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
          placeholder="Nome do profissional"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">URL do Avatar (opcional)</label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://exemplo.com/avatar.jpg"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Se não fornecido, será usado um avatar padrão
        </p>
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
          {loading ? 'Salvando...' : editingBarber ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>
    </div>
  );
};

// ===== Main Component =====

export const ShopSettingsPage: React.FC = () => {
  // Hooks
  const {
    shopInfo,
    barbers,
    businessHours,
    paymentMethods,
    loading,
    removeBarber,
    addPaymentMethod,
    removePaymentMethod
  } = useBarbershop({ autoFetch: true });

  const { openModal, closeModal, isModalOpen, success, error: showError } = useUI();

  // State
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Payment methods state (initialized from barbershop data)
  const [localPaymentMethods, setLocalPaymentMethods] = useState({
    pix: paymentMethods.includes('Pix'),
    cash: paymentMethods.includes('Dinheiro'),
    card: paymentMethods.includes('Cartão')
  });

  // Handlers
  const handleNewProfessional = () => {
    setEditingBarber(null);
    openModal('professionalForm');
  };

  const handleEditProfessional = (barber: Barber) => {
    setEditingBarber(barber);
    openModal('professionalForm');
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    openModal('confirmDelete');
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await removeBarber(deletingId);
      success('Profissional removido com sucesso!');
      closeModal('confirmDelete');
      setDeletingId(null);
    } catch (err) {
      showError('Erro ao remover profissional');
    }
  };

  const handlePaymentMethodToggle = async (method: 'pix' | 'cash' | 'card', enabled: boolean) => {
    const methodName = method === 'pix' ? 'Pix' : method === 'cash' ? 'Dinheiro' : 'Cartão';
    
    try {
      if (enabled) {
        await addPaymentMethod(methodName);
      } else {
        await removePaymentMethod(methodName);
      }
      setLocalPaymentMethods(prev => ({ ...prev, [method]: enabled }));
    } catch (err) {
      showError('Erro ao atualizar formas de pagamento');
    }
  };

  const deletingBarber = deletingId
    ? barbers.find(p => p.id === deletingId)
    : null;

  return (
    <>
      <div className="space-y-6 pb-6">
        {/* Professionals Section */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-100 text-lg">Profissionais</h2>
            <button
              onClick={handleNewProfessional}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>Adicionar Novo</span>
            </button>
          </div>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-4 border-violet-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : barbers.length > 0 ? (
            <div className="space-y-3">
              {barbers.map(barber => (
                <div
                  key={barber.id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={barber.avatarUrl || `https://i.pravatar.cc/150?u=${barber.id}`}
                      alt={barber.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="font-semibold text-slate-200">{barber.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProfessional(barber)}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    >
                      <Icon name="edit" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(barber.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Icon name="trash" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Icon name="users" className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-slate-500 text-sm mt-2">Nenhum profissional cadastrado ainda.</p>
            </div>
          )}
        </Card>

        {/* Opening Hours Section */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-100 text-lg">Horários de Funcionamento</h2>
            <button className="px-3 py-1.5 text-sm font-semibold bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600">
              Editar
            </button>
          </div>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between">
              <span className="text-slate-400">Segunda a Sexta:</span>
              <span className="font-semibold text-slate-200">
                {businessHours?.opening && businessHours?.closing
                  ? `${businessHours.opening} - ${businessHours.closing}`
                  : '09:00 - 19:00'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Sábado:</span>
              <span className="font-semibold text-slate-200">
                {businessHours?.daysOfWeek?.includes(6)
                  ? `${businessHours.opening} - ${businessHours.closing}`
                  : 'Fechado'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Domingo:</span>
              <span className="font-semibold text-red-400">
                {businessHours?.daysOfWeek?.includes(0)
                  ? `${businessHours.opening} - ${businessHours.closing}`
                  : 'Fechado'}
              </span>
            </li>
          </ul>
        </Card>

        {/* Payment Methods Section */}
        <Card>
          <h2 className="font-bold text-slate-100 text-lg mb-2">Formas de Pagamento</h2>
          <div className="divide-y divide-slate-700/50">
            <SettingsItem icon="receipt" label="PIX">
              <ToggleSwitch
                enabled={paymentMethods.includes('Pix')}
                onChange={(enabled) => handlePaymentMethodToggle('pix', enabled)}
              />
            </SettingsItem>
            <SettingsItem icon="cash" label="Dinheiro">
              <ToggleSwitch
                enabled={paymentMethods.includes('Dinheiro')}
                onChange={(enabled) => handlePaymentMethodToggle('cash', enabled)}
              />
            </SettingsItem>
            <SettingsItem icon="creditCard" label="Cartão de Crédito/Débito">
              <ToggleSwitch
                enabled={paymentMethods.includes('Cartão')}
                onChange={(enabled) => handlePaymentMethodToggle('card', enabled)}
              />
            </SettingsItem>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen('professionalForm')}
        onClose={() => {
          closeModal('professionalForm');
          setEditingBarber(null);
        }}
        title={editingBarber ? 'Editar Profissional' : 'Novo Profissional'}
      >
        <ProfessionalForm
          onClose={() => {
            closeModal('professionalForm');
            setEditingBarber(null);
          }}
          editingBarber={editingBarber}
        />
      </Modal>

      <Modal
        isOpen={isModalOpen('confirmDelete')}
        onClose={() => {
          closeModal('confirmDelete');
          setDeletingId(null);
        }}
        title="Confirmar Exclusão"
      >
        {deletingBarber && (
          <div className="space-y-4">
            <p className="text-slate-300">
              Tem certeza que deseja remover <strong>{deletingBarber.name}</strong>?
            </p>
            <p className="text-sm text-slate-400">Esta ação não pode ser desfeita.</p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => {
                  closeModal('confirmDelete');
                  setDeletingId(null);
                }}
                className="flex-1 bg-slate-700 text-slate-200 font-bold py-2 rounded-lg hover:bg-slate-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700"
              >
                Sim, remover
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
