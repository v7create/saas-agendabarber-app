/**
 * ServicesSettingsPage - Página de configurações de serviços
 * 
 * Página para gerenciar o catálogo de serviços:
 * - Lista de serviços cadastrados
 * - CRUD completo de serviços
 * - Nome, duração e preço
 * - Menu de ações (editar/excluir)
 * 
 * Integração com ServicesStore:
 * - Lista todos os serviços
 * - Criar novo serviço
 * - Editar serviço existente
 * - Remover serviço
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 11 (Configurações de Serviços)
 * - DESCRICAO_FEATURES.md - Seção 7 (Catálogo de Serviços)
 * 
 * Features:
 * - Cards de serviços com detalhes
 * - Modal de formulário inline
 * - Confirmação de exclusão
 * - Empty state
 */

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useServices } from '@/hooks/useServices';
import { useUI } from '@/hooks/useUI';
import { Service } from '@/types';
import { CreateServiceData } from '@/store/services.store';

// ===== Sub-Components =====

/**
 * ServiceForm - Formulário para criar/editar serviço
 */
interface ServiceFormProps {
  onClose: () => void;
  editingService?: Service | null;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onClose, editingService }) => {
  const { createService, updateService } = useServices();
  const { success, error: showError } = useUI();

  const [name, setName] = useState(editingService?.name || '');
  const [duration, setDuration] = useState(editingService?.duration || 60);
  const [price, setPrice] = useState(editingService?.price?.toString() || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      showError('Digite o nome do serviço');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      showError('Digite um preço válido');
      return;
    }
    if (duration < 15) {
      showError('A duração mínima é de 15 minutos');
      return;
    }

    setLoading(true);
    try {
      if (editingService) {
        await updateService(editingService.id, {
          name: name.trim(),
          duration,
          price: parseFloat(price)
        });
        success('Serviço atualizado com sucesso!');
      } else {
        const createData: CreateServiceData = {
          name: name.trim(),
          duration,
          price: parseFloat(price)
        };
        await createService(createData);
        success('Serviço adicionado com sucesso!');
      }
      onClose();
    } catch (err) {
      showError('Erro ao salvar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-400">Nome do Serviço *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Corte de Cabelo"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Duração (minutos) *</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
          min="15"
          step="15"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <p className="text-xs text-slate-500 mt-1">Duração estimada do serviço</p>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Preço (R$) *</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
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
          {loading ? 'Salvando...' : editingService ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>
    </div>
  );
};

// ===== Main Component =====

export const ServicesSettingsPage: React.FC = () => {
  // Hooks
  const { services, loading, deleteService } = useServices({ autoFetch: true });
  const { openModal, closeModal, isModalOpen, success, error: showError } = useUI();

  // State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Handlers
  const handleNewService = () => {
    setEditingService(null);
    openModal('serviceForm');
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setMenuOpenId(null);
    openModal('serviceForm');
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setMenuOpenId(null);
    openModal('confirmDelete');
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteService(deletingId);
      success('Serviço removido com sucesso!');
      closeModal('confirmDelete');
      setDeletingId(null);
    } catch (err) {
      showError('Erro ao remover serviço');
    }
  };

  const deletingService = deletingId ? services.find(s => s.id === deletingId) : null;

  return (
    <>
      <div className="space-y-6 pb-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-100 text-lg">Serviços Cadastrados</h2>
            <button
              onClick={handleNewService}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>Novo Serviço</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-400 text-sm mt-2">Carregando serviços...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="space-y-3">
              {services.map(service => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-slate-200">{service.name}</p>
                    <p className="text-sm text-slate-400">
                      {service.duration} min - R$ {service.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === service.id ? null : service.id)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Icon name="dots" className="w-5 h-5" />
                    </button>
                    {menuOpenId === service.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuOpenId(null)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-40 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-20">
                          <button
                            onClick={() => handleEditService(service)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 rounded-t-lg text-left"
                          >
                            <Icon name="edit" className="w-4 h-4 mr-2" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(service.id)}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-600 rounded-b-lg text-left"
                          >
                            <Icon name="trash" className="w-4 h-4 mr-2" />
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="scissors" className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-slate-500 text-sm mt-2">Nenhum serviço cadastrado ainda.</p>
              <button
                onClick={handleNewService}
                className="mt-4 px-6 py-2 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700"
              >
                Adicionar Primeiro Serviço
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen('serviceForm')}
        onClose={() => {
          closeModal('serviceForm');
          setEditingService(null);
        }}
        title={editingService ? 'Editar Serviço' : 'Novo Serviço'}
      >
        <ServiceForm
          onClose={() => {
            closeModal('serviceForm');
            setEditingService(null);
          }}
          editingService={editingService}
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
        {deletingService && (
          <div className="space-y-4">
            <p className="text-slate-300">
              Tem certeza que deseja remover o serviço <strong>{deletingService.name}</strong>?
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
