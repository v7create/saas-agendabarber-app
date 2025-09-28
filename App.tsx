

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LoginPage, DashboardPage, AppointmentsPage, AgendaPage, ClientsPage, FinancialPage, HistoryPage, BookingPage, ProfilePage, ShopSettingsPage, ServicesSettingsPage, AppSettingsPage } from './pages/pages';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// alteração para testar novo commit

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/appointments': 'Agendamentos',
  '/agenda': 'Agenda',
  '/clients': 'Clientes',
  '/financial': 'Financeiro',
  '/history': 'Histórico',
  '/profile': 'Perfil da Empresa',
  '/settings-shop': 'Configurações da Barbearia',
  '/settings-services': 'Serviços',
  '/settings-app': 'Configurações',
};

const AppContent = () => {
  const location = useLocation();
  const [title, setTitle] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setTitle(pageTitles[location.pathname] || 'AgendaBarber');
  }, [location]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <Layout
      header={<Header title={title} onMenuClick={() => setIsSidebarOpen(true)} />}
      bottomNav={<BottomNav />}
      sidebar={<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
    >
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/financial" element={<FinancialPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings-shop" element={<ShopSettingsPage />} />
        <Route path="/settings-services" element={<ServicesSettingsPage />} />
        <Route path="/settings-app" element={<AppSettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
};


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginToast, setShowLoginToast] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);


  const handleLoginSuccess = () => {
    setShowLoginToast(true);
    setTimeout(() => setShowLoginToast(false), 3000);
  };

  if (loading) {
    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center">
            <p>Carregando...</p>
        </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
       {showLoginToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg shadow-2xl shadow-violet-500/20 animate-fade-in-down">
          <p className="font-bold">Login realizado!</p>
          <p className="text-sm text-slate-400">Bem-vindo de volta!</p>
        </div>
      )}
      <HashRouter>
        <Routes>
          <Route path="/login" element={ user ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} /> } />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/*" element={ user ? <AppContent /> : <Navigate to="/login" /> } />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;