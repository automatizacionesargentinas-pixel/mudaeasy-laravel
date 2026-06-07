import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RolePage from './pages/RolePage';
import DashboardPage from './pages/DashboardPage';
import QuoteWizardPage from './pages/QuoteWizardPage';
import CompaniesPage from './pages/CompaniesPage';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginPage />;
  if (!user.role) return <RolePage />;

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/quotes/new" element={<QuoteWizardPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
