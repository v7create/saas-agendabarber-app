/**
 * ClientsPage - Página de gerenciamento de clientes
 * 
 * Página para gerenciar toda a base de clientes:
 * - Lista de clientes com cards expansíveis
 * - Busca por nome, telefone ou email
 * - Filtros por status (Ativo/Inativo) e avaliação
 * - Cards de estatísticas (total, ativos, VIP, receita)
 * - Ações CRUD (criar, editar, visualizar, deletar)
 * - Modais para formulários
 * 
 * Integração com ClientsStore:
 * - Auto-fetch de todos os clientes
 * - Busca e filtros em tempo real
 * - Estatísticas calculadas
 * - CRUD completo
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 5 (Clientes)
 * - DESCRICAO_FEATURES.md - Seção 4 (Gestão de Clientes)
 * - ESTADOS_ESPECIAIS.md - Loading, Empty, Error para clientes
 * 
 * Features:
 * - Cards com avatar (iniciais auto-geradas)
 * - Status visual (Ativo/Inativo)
 * - Avaliação com estrelas
 * - Última visita, total de visitas, gasto total
 * - Menu de ações (editar, deletar)
 * - Busca em tempo real
 * - Filtros múltiplos
 */

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useClients } from '@/hooks/useClients';
import { useUI } from '@/hooks/useUI';
import { Client, ClientStatus } from '@/types';
import { CreateClientData, UpdateClientData } from '@/store/clients.store';

// ===== Sub-Components =====

/**
 * StatCard - Card de estatística simples
 */
interface StatCardProps {
  icon: string;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <Card className="!p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-transparent rounded-lg">
        <Icon name={icon} className="w-5 h-5 text-violet-400" />
      </div>
    </div>
    <p className="text-slate-400 text-sm">{title}</p>
    <p className="text-2xl font-bold text-slate-100 mt-1">{value}</p>
  </Card>
);

/**
 * ClientCard - Card de cliente com menu de ações
 */
interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="relative" data-testid="client-card">
      {/* Status e Menu */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            client.status === ClientStatus.Active
              ? 'bg-violet-500/20 text-violet-400'
              : 'bg-slate-600 text-slate-300'
          }`}
        >
          {client.status}
        </span>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <Icon name="dots" className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(client);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 rounded-t-lg"
              >
                <Icon name="edit" className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(client);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-600 rounded-b-lg"
              >
                <Icon name="x" className="w-4 h-4 mr-2" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Informações do Cliente */}
      <div className="flex space-x-4">
        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-violet-300 text-xl">
          {client.avatarInitials}
        </div>
        <div>
          <p className="font-bold text-slate-100">{client.name}</p>
          <p className="text-sm text-slate-400">{client.phone}</p>
          <p className="text-sm text-slate-400">{client.email}</p>
        </div>
      </div>

      {/* Última Visita */}
      <div className="text-sm text-slate-400 mt-4 flex items-center">
        <Icon name="calendar" className="w-4 h-4 mr-2" />
        Última visita: {client.lastVisit || 'Nunca'}
      </div>

      {/* Avaliação */}
      <div className="flex items-center space-x-1 text-yellow-400 mt-2">
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name="star"
            className={`w-5 h-5 ${i < Math.round(client.rating) ? 'fill-current' : ''}`}
          />
        ))}
        <span className="text-slate-400 text-sm ml-1">({client.rating.toFixed(1)})</span>
      </div>

      {/* Estatísticas */}
      <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-400">Visitas</p>
          <p className="font-semibold text-slate-200">{client.visits}</p>
        </div>
        <div>
          <p className="text-slate-400">Gasto Total</p>
          <p className="font-semibold text-slate-200">R$ {client.spent.toFixed(2)}</p>
        </div>
      </div>

      {/* Notas */}
      {client.notes && (
        <p className="text-xs text-slate-500 italic mt-4 pt-4 border-t border-slate-700">
          "{client.notes}"
        </p>
      )}
    </Card>
  );
};

/**
 * ClientForm - Formulário inline para criar/editar cliente
 */
interface ClientFormProps {
  initialData?: Client | null;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onClose }) => {
  const { createClient, updateClient } = useClients();
  const { success, error: showError } = useUI();
  
  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      showError('Preencha todos os campos obrigatórios');
      return;
    }

    if (rating < 0 || rating > 5) {
      showError('Avaliação deve estar entre 0 e 5');
      return;
    }

    setLoading(true);
    try {
      if (initialData) {
        // Atualizar
        const updateData: UpdateClientData = {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          rating,
          notes: notes.trim()
        };
        await updateClient(initialData.id, updateData);
        success('Cliente atualizado com sucesso!');
      } else {
        // Criar
        const createData: CreateClientData = {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          rating,
          notes: notes.trim()
        };
        await createClient(createData);
        success('Cliente cadastrado com sucesso!');
      }
      onClose();
    } catch (err) {
      showError(initialData ? 'Erro ao atualizar cliente' : 'Erro ao cadastrar cliente');
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
      <div>
        <label className="text-sm font-medium text-slate-400">Avaliação (0-5)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
          placeholder="0.0"
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400">Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações sobre o cliente..."
          rows={3}
          className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
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
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </div>
  );
};

/**
 * ConfirmDeleteModal - Modal de confirmação de exclusão
 */
interface ConfirmDeleteModalProps {
  client: Client;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ client, onConfirm, onCancel }) => (
  <div className="space-y-4">
    <p className="text-slate-300">
      Tem certeza que deseja excluir o cliente <strong>{client.name}</strong>?
    </p>
    <p className="text-slate-400 text-sm">Esta ação não pode ser desfeita.</p>
    <div className="flex space-x-3">
      <button
        onClick={onCancel}
        className="flex-1 bg-slate-700 text-slate-200 font-bold py-2 rounded-lg hover:bg-slate-600"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700"
      >
        Excluir
      </button>
    </div>
  </div>
);

// ===== Main Component =====

export const ClientsPage: React.FC = () => {
  // Hooks
  const {
    clients,
    loading,
    searchClients,
    filterByStatus,
    getStats,
    deleteClient
  } = useClients({ autoFetch: true });
  
  const { openModal, closeModal, isModalOpen, success, error: showError } = useUI();
  
  // Estado local
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'all'>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Estatísticas
  const stats = getStats();
  const vipClients = clients.filter(c => c.rating >= 4.5).length;

  // Filtros aplicados
  const filteredClients = useMemo(() => {
    let result = clients;

    // Busca por texto
    if (searchQuery.trim()) {
      result = searchClients(searchQuery);
    }

    // Filtro por status
    if (filterStatus !== 'all') {
      result = result.filter(c => c.status === filterStatus);
    }

    return result;
  }, [clients, searchQuery, filterStatus, searchClients]);

  // Handlers
  const handleNewClient = () => {
    setSelectedClient(null);
    openModal('clientForm');
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    openModal('clientForm');
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    openModal('confirmDelete');
  };

  const handleConfirmDelete = async () => {
    if (!selectedClient) return;

    try {
      await deleteClient(selectedClient.id);
      success('Cliente excluído com sucesso!');
      closeModal('confirmDelete');
      setSelectedClient(null);
    } catch (err) {
      showError('Erro ao excluir cliente');
    }
  };

  return (
    <>
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div>
          <p className="text-2xl font-bold text-slate-100">Clientes</p>
          <p className="text-slate-400">Gerencie sua base de clientes</p>
        </div>

        {/* Novo Cliente Button */}
        <button
          onClick={handleNewClient}
          className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-colors"
        >
          <Icon name="plus" className="w-5 h-5" />
          <span>Novo Cliente</span>
        </button>

        {/* Busca */}
        <div className="relative">
          <Icon
            name="search"
            className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, telefone ou email..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Filtro de Status */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800/50 border border-slate-700 text-slate-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStatus(ClientStatus.Active)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === ClientStatus.Active
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800/50 border border-slate-700 text-slate-300'
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setFilterStatus(ClientStatus.Inactive)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === ClientStatus.Inactive
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800/50 border border-slate-700 text-slate-300'
            }`}
          >
            Inativos
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon="users" title="Total de Clientes" value={stats.total.toString()} />
          <StatCard icon="check" title="Clientes Ativos" value={stats.active.toString()} />
          <StatCard icon="star" title="Clientes VIP" value={vipClients.toString()} />
          <StatCard
            icon="dollar"
            title="Receita Total"
            value={`R$ ${stats.totalRevenue.toFixed(0)}`}
          />
        </div>

        {/* Lista de Clientes */}
        <Card>
          <h3 className="font-bold text-slate-100 mb-2 flex items-center">
            <Icon name="users" className="w-5 h-5 mr-2 text-violet-400" />
            Lista de Clientes
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado
            {filteredClients.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-400 text-sm mt-2">Carregando clientes...</p>
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onEdit={handleEditClient}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="users" className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-slate-500 text-sm mt-2">
                {searchQuery || filterStatus !== 'all'
                  ? 'Nenhum cliente encontrado com os filtros aplicados.'
                  : 'Nenhum cliente cadastrado ainda.'}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen('clientForm')}
        onClose={() => closeModal('clientForm')}
        title={selectedClient ? 'Editar Cliente' : 'Novo Cliente'}
      >
        <ClientForm
          initialData={selectedClient}
          onClose={() => closeModal('clientForm')}
        />
      </Modal>

      <Modal
        isOpen={isModalOpen('confirmDelete')}
        onClose={() => closeModal('confirmDelete')}
        title="Confirmar Exclusão"
      >
        {selectedClient && (
          <ConfirmDeleteModal
            client={selectedClient}
            onConfirm={handleConfirmDelete}
            onCancel={() => closeModal('confirmDelete')}
          />
        )}
      </Modal>
    </>
  );
};
