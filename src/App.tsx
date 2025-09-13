import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ProductManagementPage from './pages/ProductManagementPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import InventoryPage from './pages/InventoryPage';
import InventoryManagementPage from './pages/InventoryManagementPage';
import WarehouseManagementPage from './pages/WarehouseManagementPage';
import UserManagementPage from './pages/UserManagementPage';

const App: React.FC = () => {
  // Simulated authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  // Toggle Sidebar
  const toggleSidebar = () => {
    // On mobile, fully toggle visibility
    if (window.innerWidth < 1024) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    } else {
      // On desktop, just collapse/expand
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <AppProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          {isAuthenticated && (
            <Sidebar 
              isCollapsed={isSidebarCollapsed} 
              onToggle={toggleSidebar} 
            />
          )}
          
          <main 
            className={`
              flex-1 transition-all duration-300 
              ${isAuthenticated ? 'lg:mr-0' : ''} 
              ${isSidebarCollapsed ? 'lg:mr-0' : 'lg:mr-0'}
            `}
          >
            {isAuthenticated && (
              <Header onToggleSidebar={toggleSidebar} />
            )}
            
            <div className="p-4">
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
                    <Route path="/product-management" element={<ProductManagementPage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/inventory-management" element={<InventoryManagementPage />} />
                    <Route path="/warehouse-management" element={<WarehouseManagementPage />} />
                    <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
                    <Route path="/users" element={<UserManagementPage />} />
                    
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
            </div>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;