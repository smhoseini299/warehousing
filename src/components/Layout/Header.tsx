import React, { useState } from 'react';
import { 
  LogOut, 
  Bell, 
  Search, 
  User, 
  Settings, 
  Menu 
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile Menu Toggle & Logo */}
        <div className="flex items-center space-x-reverse space-x-4">
          <button 
            onClick={onToggleSidebar} 
            className="text-gray-600 hover:text-gray-900 focus:outline-none block lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 hidden lg:block">سیستم مدیریت انبار</h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <input 
              type="text" 
              placeholder="جستجو در سیستم..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </form>

        {/* User Actions */}
        <div className="flex items-center space-x-reverse space-x-4">
          {/* Notifications */}
          <button className="relative text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-reverse space-x-2 text-gray-600 hover:text-gray-900">
              <User className="h-5 w-5" />
              <span className="hidden md:block text-sm">{state.user?.username || 'کاربر'}</span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-1">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="h-4 w-4 ml-2" />
                  تنظیمات
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  خروج
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}