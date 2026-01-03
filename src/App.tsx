import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage from './pages/public/HomePage';
import GalleryPage from './pages/public/GalleryPage';
import AnimationDetailPage from './pages/public/AnimationDetailPage';
import LegalPage from './pages/public/LegalPage';

import AdminGate from './components/admin/AdminGate';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAnimationsListPage from './pages/admin/AdminAnimationsListPage';
import AdminAnimationFormPage from './pages/admin/AdminAnimationFormPage';

const PublicShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentView = location.pathname.startsWith('/gallery')
    ? 'gallery'
    : location.pathname.startsWith('/animations/')
    ? 'detail'
    : 'home';

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col selection:bg-white selection:text-black">
      <Navbar currentView={currentView as any} onNavigate={(v) => navigate(v === 'gallery' ? '/gallery' : '/')} />
      {children}
      <Footer onNavigate={(v) => navigate(v === 'privacy' ? '/privacy' : '/terms')} />
    </div>
  );
};

const AdminAliasRedirect: React.FC = () => {
  const { pathname, search, hash } = useLocation();
  const rest = pathname.replace(/^\/admin(\/|$)/, '/');
  const targetPath = rest === '/' ? '/voidyx-admin/login' : `/voidyx-admin${rest}`;
  return <Navigate to={`${targetPath}${search}${hash}`} replace />;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Alias: redirect /admin -> hidden admin route */}
      <Route path="/admin" element={<Navigate to="/voidyx-admin/login" replace />} />
      <Route path="/admin/*" element={<AdminAliasRedirect />} />

      {/* Public mode */}
      <Route
        path="/"
        element={
          <PublicShell>
            <HomePage />
          </PublicShell>
        }
      />
      <Route
        path="/gallery"
        element={
          <PublicShell>
            <GalleryPage />
          </PublicShell>
        }
      />
      <Route
        path="/animations/:id"
        element={
          <PublicShell>
            <AnimationDetailPage />
          </PublicShell>
        }
      />
      <Route
        path="/privacy"
        element={
          <PublicShell>
            <LegalPage type="privacy" />
          </PublicShell>
        }
      />
      <Route
        path="/terms"
        element={
          <PublicShell>
            <LegalPage type="terms" />
          </PublicShell>
        }
      />

      {/* Hidden admin mode (no links in public UI) */}
      <Route path="/voidyx-admin/login" element={<AdminLoginPage />} />
      <Route
        path="/voidyx-admin"
        element={
          <AdminGate>
            <AdminLayout />
          </AdminGate>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="animations" element={<AdminAnimationsListPage />} />
        <Route path="animations/new" element={<AdminAnimationFormPage />} />
        <Route path="animations/:id/edit" element={<AdminAnimationFormPage />} />
      </Route>
    </Routes>
  );
};

export default App;