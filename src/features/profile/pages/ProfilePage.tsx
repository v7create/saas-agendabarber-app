/**
 * ProfilePage - Página de perfil da barbearia
 * 
 * Página pública do perfil da empresa:
 * - Imagem de capa e logo
 * - Informações da barbearia
 * - Descrição "Sobre Nós"
 * - Contato e localização
 * - Redes sociais
 * - Botão para editar perfil
 * 
 * Integração com BarbershopStore:
 * - Busca informações da barbearia
 * - Atualização de dados (futura feature)
 * 
 * Referências:
 * - ANALISE_COMPLETA_UI.md - Seção 9 (Perfil)
 * - DESCRICAO_FEATURES.md - Seção 9 (Perfil da Barbearia)
 * 
 * Features:
 * - Design de perfil social (capa + logo circular)
 * - Cards organizados com informações
 * - Links para redes sociais
 * - Localização e contato
 */

import React from 'react';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { useBarbershop } from '@/hooks/useBarbershop';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { BarbershopSetupModal } from '../components/BarbershopSetupModal';

// Helper para determinar saudação baseado na hora
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

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

// ===== Main Component =====

export const ProfilePage: React.FC = () => {
  // Hooks
  const { shopInfo, loading } = useBarbershop({ autoFetch: true });
  const { user } = useAuth();
  const { openModal } = useUI();
  const [showSetupModal, setShowSetupModal] = React.useState(false);

  // Extrair nome do usuário
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Profissional';

  const handleEditProfile = () => {
    openModal('editProfile');
  };

  const handleOpenLocation = () => {
    if (shopInfo?.address) {
      console.log('Open maps:', shopInfo.address);
    }
  };

  const handleOpenPhone = () => {
    if (shopInfo?.phone) {
      window.open(`https://wa.me/${shopInfo.phone.replace(/\D/g, '')}`, '_blank');
    }
  };

  const handleOpenSocialMedia = (platform: string) => {
    console.log('Open social media:', platform);
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-6">
        <div className="animate-pulse">
          <div className="h-48 bg-slate-700 rounded-lg"></div>
          <div className="h-24 w-24 bg-slate-700 rounded-full mt-[-3rem] ml-4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-violet-600/20 to-violet-700/20 border-b border-violet-500/30 px-4 py-3 mb-4">
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-violet-400">{getGreeting()}, {userName}!</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
      </div>

      <div className="-m-4">
        {/* Cover Image */}
        <div className="relative h-48">
          <img
            src={shopInfo?.coverImageUrl || 'https://images.unsplash.com/photo-1599351431202-1810c26a87c3?q=80&w=1974&auto=format&fit=crop'}
            alt="Capa da Barbearia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          <img
            src={shopInfo?.logoUrl || 'https://i.pravatar.cc/150?u=barbershop'}
            alt="Logo da Barbearia"
            className="absolute -bottom-12 left-4 w-24 h-24 rounded-full border-4 border-slate-900 object-cover"
          />
        </div>

        {/* Content */}
        <div className="pt-16 px-4 pb-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-100">
                {shopInfo?.name || 'Minha Barbearia'}
              </h1>
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 text-sm font-semibold bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Editar Perfil
              </button>
            </div>
            <p className="text-slate-400">
              @{shopInfo?.username || shopInfo?.name?.toLowerCase().replace(/\s+/g, '') || 'barbershop'}
            </p>
          </div>

          {/* About Section */}
          {shopInfo?.description && (
            <Card>
              <h2 className="font-bold text-slate-100 mb-2">Sobre Nós</h2>
              <p className="text-slate-300 text-sm">{shopInfo.description}</p>
            </Card>
          )}

          {/* Contact and Location */}
          {(shopInfo?.address || shopInfo?.phone) && (
            <Card>
              <h2 className="font-bold text-slate-100 mb-2">Contato e Localização</h2>
              <div className="divide-y divide-slate-700/50">
                {shopInfo.address && (
                  <SettingsItem
                    icon="map"
                    label={shopInfo.address}
                    sublabel={shopInfo.city && shopInfo.state ? `${shopInfo.city}, ${shopInfo.state}` : undefined}
                    onClick={handleOpenLocation}
                  />
                )}
                {shopInfo.phone && (
                  <SettingsItem
                    icon="phone"
                    label={shopInfo.phone}
                    sublabel="WhatsApp"
                    onClick={handleOpenPhone}
                  />
                )}
              </div>
            </Card>
          )}

          {/* Social Media */}
          {(shopInfo?.instagram || shopInfo?.facebook || shopInfo?.website) && (
            <Card>
              <h2 className="font-bold text-slate-100 mb-2">Nossas Redes</h2>
              <div className="divide-y divide-slate-700/50">
                {shopInfo.instagram && (
                  <SettingsItem
                    icon="instagram"
                    label="Instagram"
                    sublabel={`@${shopInfo.instagram}`}
                    onClick={() => handleOpenSocialMedia('instagram')}
                  />
                )}
                {shopInfo.facebook && (
                  <SettingsItem
                    icon="facebook"
                    label="Facebook"
                    onClick={() => handleOpenSocialMedia('facebook')}
                  />
                )}
                {shopInfo.website && (
                  <SettingsItem
                    icon="globe"
                    label="Nosso Site"
                    sublabel={shopInfo.website}
                    onClick={() => handleOpenSocialMedia('website')}
                  />
                )}
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!shopInfo?.address && !shopInfo?.phone && !shopInfo?.instagram && !shopInfo?.facebook && !shopInfo?.website && (
            <div className="text-center py-8">
              <Icon name="user" className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-slate-400 text-sm mt-4">
                Complete seu perfil para que seus clientes conheçam melhor sua barbearia.
              </p>
              <button
                onClick={() => setShowSetupModal(true)}
                className="mt-4 px-6 py-2 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700"
              >
                Completar Perfil
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Setup Modal */}
      <BarbershopSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
      />
    </>
  );
};
