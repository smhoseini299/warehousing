import React, { useState } from 'react';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  CogIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ShoppingCartIcon,
  ClipboardListIcon
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { icon: HomeIcon, label: 'داشبورد', to: '/dashboard' },
    { icon: DocumentTextIcon, label: 'محصولات', to: '/products' },
    { icon: ShoppingCartIcon, label: 'تراکنش‌ها', to: '/transactions' },
    { icon: ChartBarIcon, label: 'گزارشات', to: '/reports' },
    { icon: ClipboardListIcon, label: 'موجودی انبار', to: '/inventory' },
    { icon: CogIcon, label: 'تنظیمات', to: '/settings' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`
        bg-gray-800 text-white h-screen transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        fixed right-0 top-0 flex flex-col z-50
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <h2 className="text-xl font-bold">منو</h2>}
        <button 
          onClick={toggleSidebar} 
          className="hover:bg-gray-700 p-2 rounded-full transition"
        >
          {isCollapsed ? (
            <ChevronLeftIcon className="h-6 w-6" />
          ) : (
            <ChevronRightIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => `
              flex items-center p-4 transition
              ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon className="h-6 w-6 ml-2" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
