import React from 'react';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  CogIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ShoppingCartIcon,
  ClipboardIcon,
  UsersIcon,
  CubeIcon,
  ArchiveBoxIcon,
  BuildingOfficeIcon,
  XMarkIcon // Add close icon
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const sidebarItems: SidebarItem[] = [
    { icon: HomeIcon, label: 'داشبورد', to: '/dashboard' },
    { icon: DocumentTextIcon, label: 'محصولات', to: '/products' },
    { icon: CubeIcon, label: 'مدیریت محصولات', to: '/product-management' },
    { icon: ShoppingCartIcon, label: 'تراکنش‌ها', to: '/transactions' },
    { icon: ChartBarIcon, label: 'گزارشات', to: '/reports' },
    { icon: ClipboardIcon, label: 'موجودی انبار', to: '/inventory' },
    { icon: ArchiveBoxIcon, label: 'مدیریت موجودی', to: '/inventory-management' },
    { icon: BuildingOfficeIcon, label: 'مدیریت انبارها', to: '/warehouse-management' },
    { icon: UsersIcon, label: 'مدیریت کاربران', to: '/users' },
    { icon: CogIcon, label: 'تنظیمات', to: '/settings' },
  ];

  return (
    <div 
      className={`
        bg-gray-800 text-white transition-all duration-300 ease-in-out
        fixed lg:sticky top-0 right-0 h-screen z-50
        ${isCollapsed ? 'w-16 lg:w-16' : 'w-64 lg:w-64'}
        ${isCollapsed ? 'mobile:hidden lg:block' : 'mobile:block lg:block'}
        flex flex-col
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <h2 className="text-xl font-bold">منو</h2>}
        
        {/* Mobile Close Button */}
        <button 
          onClick={onToggle} 
          className="hover:bg-gray-700 p-2 rounded-full transition mr-auto block lg:hidden"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Desktop Collapse/Expand Button */}
        <button 
          onClick={onToggle} 
          className="hover:bg-gray-700 p-2 rounded-full transition mr-auto hidden lg:block"
        >
          {isCollapsed ? (
            <ChevronLeftIcon className="h-6 w-6" />
          ) : (
            <ChevronRightIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <nav 
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.2) transparent'
        }}
      >
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
            <item.icon className={`h-6 w-6 ${!isCollapsed ? 'ml-2' : ''}`} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
