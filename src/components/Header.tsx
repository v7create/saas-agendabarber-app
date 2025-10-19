
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { MOCK_NOTIFICATIONS } from '../constants';
import { NotificationsPanel } from './NotificationsPanel';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
    title: string;
    onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();

    const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

    // Close notifications and profile panel on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-slate-800">
            <button className="p-2 -ml-2" onClick={onMenuClick}>
                 <Icon name="menu" className="w-6 h-6 text-slate-400" />
            </button>
            <h1 className="text-lg font-bold text-slate-100 truncate">{title}</h1>
            <div className="flex items-center space-x-4">
                 <div className="relative" ref={notificationsRef}>
                    <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2">
                        <Icon name="bell" className="w-6 h-6 text-slate-400" />
                        {unreadCount > 0 && (
                             <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                                {unreadCount}
                             </span>
                        )}
                    </button>
                    {isNotificationsOpen && <NotificationsPanel notifications={MOCK_NOTIFICATIONS} />}
                 </div>

                 {/* Profile Menu */}
                 <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center font-bold text-white hover:bg-violet-700 transition-colors cursor-pointer"
                        title="Menu de Perfil"
                    >
                        AB
                    </button>
                    
                    {/* Profile Menu Popup */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl shadow-black/50 border border-slate-700 overflow-hidden z-30">
                            {/* Header do Menu */}
                            <div className="px-4 py-3 border-b border-slate-700 bg-slate-900">
                                <p className="text-sm text-slate-400">André Barber</p>
                                <p className="text-xs text-slate-500">teste@barberia.com</p>
                            </div>
                            
                            {/* Menu Items */}
                            <div className="py-2">
                                {/* Perfil da Empresa */}
                                <button
                                    onClick={() => {
                                        window.location.hash = '#/profile';
                                        setIsProfileOpen(false);
                                    }}
                                    className="w-full px-4 py-2 flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
                                >
                                    <Icon name="user" className="text-lg" />
                                    <div className="text-left">
                                        <p className="font-medium">Perfil da Empresa</p>
                                        <p className="text-xs text-slate-500">Editar dados da barbearia</p>
                                    </div>
                                </button>
                                
                                {/* Configurações da Barbearia */}
                                <button
                                    onClick={() => {
                                        window.location.hash = '#/settings-shop';
                                        setIsProfileOpen(false);
                                    }}
                                    className="w-full px-4 py-2 flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
                                >
                                    <Icon name="settings" className="text-lg" />
                                    <div className="text-left">
                                        <p className="font-medium">Config. da Barbearia</p>
                                        <p className="text-xs text-slate-500">Horários, serviços, equipe</p>
                                    </div>
                                </button>
                                
                                {/* Configurações */}
                                <button
                                    onClick={() => {
                                        window.location.hash = '#/settings-app';
                                        setIsProfileOpen(false);
                                    }}
                                    className="w-full px-4 py-2 flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
                                >
                                    <Icon name="shield" className="text-lg" />
                                    <div className="text-left">
                                        <p className="font-medium">Configurações</p>
                                        <p className="text-xs text-slate-500">Segurança, privacidade</p>
                                    </div>
                                </button>
                                
                                {/* Divider */}
                                <div className="my-2 border-t border-slate-700"></div>
                                
                                {/* Logout */}
                                <button
                                    onClick={async () => {
                                        setIsProfileOpen(false);
                                        try {
                                            await logout();
                                        } catch (err) {
                                            console.error('Erro ao fazer logout:', err);
                                        }
                                    }}
                                    className="w-full px-4 py-2 flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm"
                                >
                                    <Icon name="logout" className="text-lg" />
                                    <p className="font-medium">Sair</p>
                                </button>
                            </div>
                        </div>
                    )}
                 </div>
            </div>
        </header>
    );
};