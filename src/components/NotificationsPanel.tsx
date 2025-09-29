
import React from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { Notification } from '../types';

interface NotificationsPanelProps {
    notifications: Notification[];
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
    const getIconInfo = (type: Notification['type']) => {
        switch (type) {
            case 'new_appointment':
                return { name: 'calendar', color: 'text-blue-400', bg: 'bg-blue-500/10' };
            case 'goal_achieved':
                return { name: 'trendUp', color: 'text-green-400', bg: 'bg-green-500/10' };
            default:
                return { name: 'bell', color: 'text-slate-400', bg: 'bg-slate-500/10' };
        }
    };
    
    return (
        <div className="absolute top-full right-0 mt-2 w-80 z-20 animate-fade-in-down-fast">
             <style>{`
                @keyframes fade-in-down-fast {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down-fast {
                    animation: fade-in-down-fast 0.2s ease-out forwards;
                }
             `}</style>
            <Card className="!p-0 overflow-hidden bg-slate-900 shadow-2xl shadow-violet-500/20">
                <div className="p-3 border-b border-slate-700">
                    <h3 className="font-bold text-slate-100">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(notif => {
                            const iconInfo = getIconInfo(notif.type);
                            return (
                                <div key={notif.id} className={`flex items-start space-x-3 p-3 border-b border-slate-700/50 hover:bg-slate-700/40 transition-colors duration-150 ${!notif.read ? 'bg-violet-500/5' : ''}`}>
                                    <div className={`flex-shrink-0 mt-1 p-2 rounded-lg ${iconInfo.bg}`}>
                                        <Icon name={iconInfo.name} className={`w-5 h-5 ${iconInfo.color}`} />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-slate-200 text-sm">{notif.title}</p>
                                        <p className="text-xs text-slate-400">{notif.description}</p>
                                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                                    </div>
                                    {!notif.read && <span className="w-2 h-2 mt-2 bg-violet-400 rounded-full flex-shrink-0"></span>}
                                </div>
                            );
                        })
                    ) : (
                        <p className="p-4 text-center text-sm text-slate-500">Nenhuma notificação nova.</p>
                    )}
                </div>
                <div className="p-2 bg-slate-800/50 text-center">
                    <button className="text-violet-400 font-semibold text-sm w-full hover:underline">
                        Marcar todas como lidas
                    </button>
                </div>
            </Card>
        </div>
    );
};