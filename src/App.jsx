import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute, SubscriberRoute, PublicRoute, LoadingSpinner } from './components/common/RouteGuards';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CharityDirectoryPage } from './pages/public/CharityDirectoryPage';
import { CharityDetailPage } from './pages/public/CharityDetailPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { DonatePage } from './pages/public/DonatePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// User Dashboard Pages
import { DashboardPage } from './pages/user/DashboardPage';
import { SubscriptionPage } from './pages/user/SubscriptionPage';
import { CharitySelectionPage } from './pages/user/CharitySelectionPage';
import { ScoresPage } from './pages/user/ScoresPage';
import { DrawsPage } from './pages/user/DrawsPage';
import { WinningsPage } from './pages/user/WinningsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Route Hierarchy */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/charities" element={<CharityDirectoryPage />} />
              <Route path="/charities/:slug" element={<CharityDetailPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Authenticated Subscriber Portal */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route
                path="/charity"
                element={
                  <SubscriberRoute>
                    <CharitySelectionPage />
                  </SubscriberRoute>
                }
              />
              <Route
                path="/scores"
                element={
                  <SubscriberRoute>
                    <ScoresPage />
                  </SubscriberRoute>
                }
              />
              <Route
                path="/draws"
                element={
                  <SubscriberRoute>
                    <DrawsPage />
                  </SubscriberRoute>
                }
              />
              <Route
                path="/winnings"
                element={
                  <SubscriberRoute>
                    <WinningsPage />
                  </SubscriberRoute>
                }
              />
            </Route>

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>404</h1>
                  <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Page Not Found</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you are looking for does not exist or has moved.</p>
                  <a href="/" className="btn btn-primary">Return to Home</a>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
