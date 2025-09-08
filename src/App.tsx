import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import InventoryPage from './pages/InventoryPage';

const App: React.FC = () => {
  // Simulated authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Simulated login function (to be replaced with real authentication)
  const handleLogin = (username: string, password: string) => {
    // TODO: Replace with real authentication logic
    if (username === 'admin' && password === '123456') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  // Simulated logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {isAuthenticated && <Sidebar />}
        
        <main className={`flex-1 ${isAuthenticated ? 'mr-16' : ''} transition-all duration-300`}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <LoginPage onLogin={handleLogin} />
              } 
            />
            
            {/* Protected Routes */}
            {isAuthenticated ? (
              <>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
                
                {/* Redirect to dashboard by default */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Catch-all route for undefined paths */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            ) : (
              // Redirect to login if not authenticated
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;