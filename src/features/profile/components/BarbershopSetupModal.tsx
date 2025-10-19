/**
 * BarbershopSetupModal - Modal de configuração inicial da barbearia
 * 
 * Exibido na primeira autenticação para coletar:
 * - Nome da barbearia
 * - WhatsApp
 * - Localização (com autocomplete)
 * - Redes sociais e website
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { useBarbershop } from '@/hooks/useBarbershop';

interface BarbershopSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
}

// Mock de cidades brasileiras para autocomplete
const BRAZILIAN_CITIES: { address: string; city: string; state: string }[] = [
  { address: 'Rua Ficticia', city: 'São Paulo', state: 'SP' },
  { address: 'Avenida Paulista', city: 'São Paulo', state: 'SP' },
  { address: 'Rua Augusta', city: 'São Paulo', state: 'SP' },
  { address: 'Rua Oscar Freire', city: 'São Paulo', state: 'SP' },
  { address: 'Rua Faria Lima', city: 'São Paulo', state: 'SP' },
  { address: 'Avenida Imigrantes', city: 'Rio de Janeiro', state: 'RJ' },
  { address: 'Avenida Copacabana', city: 'Rio de Janeiro', state: 'RJ' },
  { address: 'Rua Uruguaiana', city: 'Rio de Janeiro', state: 'RJ' },
  { address: 'Rua das Flores', city: 'Belo Horizonte', state: 'MG' },
];

export const BarbershopSetupModal: React.FC<BarbershopSetupModalProps> = ({ isOpen, onClose }) => {
  const { updateShopInfo } = useBarbershop();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    website: '',
  });
  const [suggestions, setSuggestions] = useState<typeof BRAZILIAN_CITIES>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filtrar sugestões de cidades
  const handleAddressChange = (value: string) => {
    setFormData(prev => ({ ...prev, address: value }));
    
    if (value.length > 1) {
      const filtered = BRAZILIAN_CITIES.filter(item =>
        item.address.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Selecionar sugestão
  const selectSuggestion = (suggestion: typeof BRAZILIAN_CITIES[0]) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.address,
      city: suggestion.city,
      state: suggestion.state,
    }));
    setShowSuggestions(false);
  };

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validar formulário
  const isValid = formData.name && formData.phone && formData.address && formData.city && formData.state;

  // Salvar dados
  const handleSave = async () => {
    if (!isValid) return;

    setLoading(true);
    try {
      await updateShopInfo({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        instagram: formData.instagram,
        facebook: formData.facebook,
        website: formData.website,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar dados da barbearia:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-800">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4">
          <h2 className="text-xl font-bold text-slate-100">Configure sua Barbearia</h2>
          <p className="text-sm text-slate-400 mt-1">
            Completa os dados para que seus clientes conheçam melhor seu negócio
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Nome da Barbearia */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Nome da Barbearia *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Barbearia do João"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              WhatsApp *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Ex: (11) 99999-8888"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Localização com Autocomplete */}
          <div className="relative" ref={suggestionsRef}>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Localização *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => formData.address && setShowSuggestions(true)}
              placeholder="Digite o nome da rua..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            {/* Sugestões */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-10">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <p className="font-medium">{suggestion.address}</p>
                    <p className="text-xs text-slate-500">{suggestion.city}, {suggestion.state}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cidade e Estado (read-only) */}
          {formData.city && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Cidade</label>
                <input
                  type="text"
                  value={formData.city}
                  disabled
                  className="w-full bg-slate-700/30 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Estado</label>
                <input
                  type="text"
                  value={formData.state}
                  disabled
                  className="w-full bg-slate-700/30 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Redes Sociais */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="font-medium text-slate-300 mb-3">Redes Sociais (opcional)</h3>

            {/* Instagram */}
            <div className="mb-3">
              <label className="text-sm font-medium text-slate-300 block mb-2 flex items-center gap-2">
                <Icon name="instagram" className="text-pink-500" />
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                placeholder="@seuinstagram"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Facebook */}
            <div className="mb-3">
              <label className="text-sm font-medium text-slate-300 block mb-2 flex items-center gap-2">
                <Icon name="facebook" className="text-blue-500" />
                Facebook
              </label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                placeholder="facebook.com/seu-perfil"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Website */}
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2 flex items-center gap-2">
                <Icon name="globe" className="text-green-500" />
                Site / TikTok
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://seu-site.com"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 font-medium hover:bg-slate-700 transition-colors"
          >
            Cadastrar Depois
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || loading}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              isValid && !loading
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};
