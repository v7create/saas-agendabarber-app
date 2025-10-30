import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    // FIX: Updated the type of the onClick prop to accept a mouse event. This
    // resolves a TypeScript error in `Modal.tsx` where an event handler that
    // needs to access the event object (e.g., for stopPropagation) was being passed.
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, onDoubleClick }) => {
    const interactive = Boolean(onClick || onDoubleClick);
    const cardClasses = `
        bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 shadow-lg
        shadow-violet-900/10 transition-all duration-300 hover:border-slate-600 hover:shadow-violet-900/20
        ${className}
        ${interactive ? 'cursor-pointer' : ''}
    `;
    return (
        <div className={cardClasses} onClick={onClick} onDoubleClick={onDoubleClick}>
            {children}
        </div>
    );
};