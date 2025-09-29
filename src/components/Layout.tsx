
import React from 'react';

interface LayoutProps {
  header: React.ReactNode;
  bottomNav: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, children, bottomNav, sidebar }) => {
  return (
    <div className="max-w-md mx-auto bg-slate-900 shadow-2xl shadow-violet-900/50 min-h-screen flex flex-col relative">
      {sidebar}
      {header}
      <main className="flex-grow p-4 space-y-6 overflow-y-auto">
        {children}
      </main>
      {bottomNav}
    </div>
  );
};