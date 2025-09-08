import React from 'react';
import { LogOut, Package, BarChart3, Plus, ArrowRightLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function Header() {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const navItems = [
    { id: 'dashboard', label: 'داشبورد', icon: BarChart3 },
    { id: 'products', label: 'مدیریت کالاها', icon: Package },
    { id: 'transactions', label: 'ورود/خروج', icon: ArrowRightLeft },
    { id: 'reports', label: 'گزارش‌ها', icon: Plus }
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-reverse space-x-4">
            <h1 className="text-xl font-bold text-gray-900">سیستم مدیریت انبار</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-reverse space-x-8">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
                  className={`flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    state.currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-reverse space-x-4">
            <span className="text-sm text-gray-600">
              خوش آمدید، {state.user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-reverse space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-50 px-4 py-2">
        <div className="flex space-x-reverse space-x-2 overflow-x-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
                className={`flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  state.currentPage === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}