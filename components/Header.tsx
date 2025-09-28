
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { MOCK_NOTIFICATIONS } from '../constants';
import { NotificationsPanel } from './NotificationsPanel';

interface HeaderProps {
    title: string;
    onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);

    const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

    // Close notifications panel on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
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
                 <div className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center font-bold text-white">
                     AB
                 </div>
            </div>
        </header>
    );
};