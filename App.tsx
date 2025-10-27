
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAuth } from './contexts/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CustomerChatPage from './pages/CustomerChatPage';
import SupportDashboardPage from './pages/SupportDashboardPage';
import ThemeToggle from './components/ThemeToggle';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { authState } = useAuth();
  if (authState.isAuthenticated && authState.user?.role === 'agent') {
    return children;
  }
  return <Navigate to="/login/agent" replace />;
};

function App() {
  return (
    <AppProvider>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:role" element={<LoginPage />} />
          <Route path="/customer-chat" element={<CustomerChatPage />} />
          <Route
            path="/support-dashboard"
            element={
              <ProtectedRoute>
                <SupportDashboardPage />
              </ProtectedRoute>
            }
          />
           <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
