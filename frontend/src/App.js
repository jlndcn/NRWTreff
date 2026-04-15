import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

// Public pages
import ComicHomePage from './pages/ComicHomePage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CityPage from './pages/CityPage';
import RegionPage from './pages/RegionPage';
import CategoryPage from './pages/CategoryPage';
import ApplicationPage from './pages/ApplicationPage';
import KontaktPage from './pages/KontaktPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfiles from './pages/admin/AdminProfiles';
import AdminProfileEdit from './pages/admin/AdminProfileEdit';
import AdminApplications from './pages/admin/AdminApplications';
import AdminCities from './pages/admin/AdminCities';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<ComicHomePage />} />
          <Route path="/browse" element={<HomePage />} />
          <Route path="/profile/:slug" element={<ProfilePage />} />
          <Route path="/stadte/:slug" element={<CityPage />} />
          <Route path="/regionen/:slug" element={<RegionPage />} />
          <Route path="/kategorien/:slug" element={<CategoryPage />} />
          <Route path="/bewerben" element={<ApplicationPage />} />
          <Route path="/kontakt" element={<KontaktPage />} />

          {/* Legal pages */}
          <Route path="/impressum" element={<LegalPage />} />
          <Route path="/datenschutz" element={<LegalPage />} />
          <Route path="/agb" element={<LegalPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfiles />} />
          <Route path="/admin/profile/:id" element={<AdminProfileEdit />} />
          <Route path="/admin/bewerbungen" element={<AdminApplications />} />
          <Route path="/admin/staedte" element={<AdminCities />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster richColors theme="dark" position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
