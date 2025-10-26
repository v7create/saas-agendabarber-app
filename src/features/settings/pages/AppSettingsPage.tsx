/**
 * AppSettingsPage - Página de configurações do aplicativo
 * 
 * Página para configurações gerais do app:
 * - Tema (claro/escuro) - atualmente apenas escuro disponível
 * - Informações da conta (email, senha)
 * - Notificações (novos agendamentos, lembretes)
 * - Links diversos (privacidade, suporte, novidades)
 * 
 * Integração:
 * - Firebase Auth para email/senha
 * - UIStore para preferências
 * - NotificationsStore para configurações de notificações
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 12 (Configurações do App)
 * - DESCRICAO_FEATURES.md - Seção 11 (Configurações)
 * 
 * Features:
 * - Seletor de tema (UI apenas - dark mode fixo)
 * - Informações da conta
 * - Toggle de notificações
 * - Links de ajuda e suporte
 */

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useAuthStore } from '@/store/auth.store';
import { useUI } from '@/hooks/useUI';
import { auth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

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

// ===== Main Component =====

export const AppSettingsPage: React.FC = () => {
  // Hooks
  const { user } = useAuthStore();
  const { success, error: showError, openModal, closeModal, isModalOpen } = useUI();

  // State
  const [theme, setTheme] = useState('dark'); // Only dark theme available for now
  const [notifications, setNotifications] = useState({
    newAppointments: true,
    reminders: true
  });

  // Handlers
  const handleResetPassword = async () => {
    if (!user?.email) {
      showError('Email não encontrado');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);
      success('Email de redefinição enviado com sucesso! Confira sua caixa de entrada.');
    } catch (err) {
      showError('Erro ao enviar email de redefinição');
    }
  };

  const handleNotificationToggle = (key: 'newAppointments' | 'reminders', enabled: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: enabled }));
    // TODO: Save to Firestore or local storage
  };

  const handleOpenSupport = () => {
    window.open('https://wa.me/5511999999999?text=Olá, preciso de ajuda com o AgendaBarber', '_blank');
  };

  const handleOpenPrivacy = () => {
    // TODO: Open privacy policy page
    console.log('Open privacy policy');
  };

  const handleOpenWhatsNew = () => {
    openModal('whatsNew');
  };

  return (
    <>
      <div className="space-y-6 pb-6">
        {/* Appearance Section */}
        <Card>
          <h2 className="font-bold text-slate-100 text-lg mb-2">Aparência</h2>
          <SettingsItem icon="palette" label="Tema do Aplicativo">
            <div className="flex p-1 bg-slate-700 rounded-lg">
              <button
                onClick={() => setTheme('light')}
                disabled
                className={`px-4 py-1 text-sm font-semibold rounded ${
                  theme === 'light' ? 'bg-slate-500 text-white' : 'text-slate-400 opacity-50 cursor-not-allowed'
                }`}
              >
                Claro
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-1 text-sm font-semibold rounded ${
                  theme === 'dark' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                Escuro
              </button>
            </div>
          </SettingsItem>
          <p className="text-xs text-slate-500 mt-2 px-3">
            Tema claro em breve! Enquanto isso, aproveite o visual escuro.
          </p>
        </Card>

        {/* Account Section */}
        <Card>
          <h2 className="font-bold text-slate-100 text-lg mb-2">Conta</h2>
          <div className="divide-y divide-slate-700/50">
            <SettingsItem icon="user" label="Email" sublabel={user?.email || 'Não autenticado'} />
            <SettingsItem icon="key" label="Redefinir Senha" onClick={handleResetPassword} />
          </div>
        </Card>

        {/* Notifications Section */}
        <Card>
          <h2 className="font-bold text-slate-100 text-lg mb-2">Notificações</h2>
          <div className="divide-y divide-slate-700/50">
            <SettingsItem icon="calendar" label="Novos Agendamentos" sublabel="Notificações push">
              <ToggleSwitch
                enabled={notifications.newAppointments}
                onChange={(enabled) => handleNotificationToggle('newAppointments', enabled)}
              />
            </SettingsItem>
            <SettingsItem icon="bell" label="Lembretes de Agendamento" sublabel="1h antes do horário">
              <ToggleSwitch
                enabled={notifications.reminders}
                onChange={(enabled) => handleNotificationToggle('reminders', enabled)}
              />
            </SettingsItem>
          </div>
        </Card>

        {/* More Section */}
        <Card>
          <h2 className="font-bold text-slate-100 text-lg mb-2">Mais</h2>
          <div className="divide-y divide-slate-700/50">
            <SettingsItem icon="shield" label="Dados e Privacidade" onClick={handleOpenPrivacy} />
            <SettingsItem icon="help" label="Suporte" sublabel="Fale conosco via WhatsApp" onClick={handleOpenSupport} />
            <SettingsItem icon="gift" label="Novidades do App" onClick={handleOpenWhatsNew} />
          </div>
        </Card>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-slate-500 text-xs">AgendaBarber v1.0.0</p>
          <p className="text-slate-600 text-xs mt-1">Desenvolvido por WebMind AI.</p>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen('whatsNew')}
        onClose={() => closeModal('whatsNew')}
        title="Novidades do App 🎉"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-100 mb-2">Versão 1.0.0</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <span className="text-violet-400 mr-2">•</span>
                <span>Sistema completo de agendamentos com 3 visualizações (Timeline, Kanban, Calendar)</span>
              </li>
              <li className="flex items-start">
                <span className="text-violet-400 mr-2">•</span>
                <span>Gestão de clientes com histórico e avaliações</span>
              </li>
              <li className="flex items-start">
                <span className="text-violet-400 mr-2">•</span>
                <span>Controle financeiro com relatórios mensais/semanais/diários</span>
              </li>
              <li className="flex items-start">
                <span className="text-violet-400 mr-2">•</span>
                <span>Catálogo de serviços personalizável</span>
              </li>
              <li className="flex items-start">
                <span className="text-violet-400 mr-2">•</span>
                <span>Dashboard com visão geral do negócio</span>
              </li>
              <li className="flex items-start">
                <span className="text-violet-400 mr-2">•</span>
                <span>Integração com Firebase para dados em tempo real</span>
              </li>
            </ul>
          </div>
          <div className="pt-4">
            <h3 className="font-bold text-slate-100 mb-2">Em breve 🚀</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Tema claro</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Notificações push</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Relatórios em PDF</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>Integração com calendário do Google</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => closeModal('whatsNew')}
            className="w-full bg-violet-600 text-white font-bold py-2 rounded-lg hover:bg-violet-700 mt-4"
          >
            Entendi!
          </button>
        </div>
      </Modal>
    </>
  );
};
