import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Lock, 
  Unlock 
} from 'lucide-react';
import { User, UserRole, RolePermissions } from '../types';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/UI/Modal';

const UserManagementPage: React.FC = () => {
  const { } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | ''>('');

  // Mock users for demonstration
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin_user',
      email: 'admin@example.com',
      role: 'ADMIN',
      firstName: 'محمد',
      lastName: 'رضایی',
      lastLogin: new Date(),
      isActive: true
    },
    {
      id: '2',
      username: 'staff_user',
      email: 'staff@example.com',
      role: 'STAFF',
      firstName: 'علی',
      lastName: 'احمدی',
      lastLogin: new Date(),
      isActive: true
    },
    {
      id: '3',
      username: 'viewer_user',
      email: 'viewer@example.com',
      role: 'VIEWER',
      firstName: 'فاطمه',
      lastName: 'کریمی',
      lastLogin: new Date(),
      isActive: false
    }
  ];

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => 
      (filterRole ? user.role === filterRole : true) &&
      (searchTerm 
        ? user.username.includes(searchTerm) || 
          user.email.includes(searchTerm) || 
          `${user.firstName} ${user.lastName}`.includes(searchTerm)
        : true)
    );
  }, [mockUsers, filterRole, searchTerm]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      // TODO: Implement actual delete logic
      console.log(`Deleting user with ID: ${userId}`);
    }
  };

  const handleToggleUserStatus = (user: User) => {
    // TODO: Implement toggle user active/inactive status
    console.log(`Toggling user status for: ${user.username}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">مدیریت کاربران</h1>
        <button 
          onClick={handleAddUser}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus className="w-5 h-5 ml-2" />
          افزودن کاربر جدید
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-wrap justify-end items-center gap-4">
          <input
            type="text"
            placeholder="جستجو کاربران..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow md:flex-grow-0 md:w-64 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right"
          />
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | '')}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right"
          >
            <option value="">همه نقش‌ها</option>
            <option value="ADMIN">مدیر</option>
            <option value="STAFF">کارمند</option>
            <option value="VIEWER">مشاهده‌کننده</option>
          </select>
        </div>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                  ${user.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 
                    user.role === 'STAFF' ? 'bg-blue-100 text-blue-600' : 
                    'bg-green-100 text-green-600'}`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 reverse-space-x">
                <button 
                  onClick={() => handleEditUser(user)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between items-center">
                <span>نقش:</span>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 
                      user.role === 'STAFF' ? 'bg-blue-100 text-blue-600' : 
                      'bg-green-100 text-green-600'}`}
                >
                  {user.role === 'ADMIN' ? 'مدیر' : 
                   user.role === 'STAFF' ? 'کارمند' : 
                   'مشاهده‌کننده'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>وضعیت:</span>
                <button 
                  onClick={() => handleToggleUserStatus(user)}
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center
                    ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {user.isActive ? (
                    <>
                      <Unlock className="w-4 h-4 ml-1" />
                      فعال
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 ml-1" />
                      غیرفعال
                    </>
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>آخرین ورود:</span>
                <span>{user.lastLogin?.toLocaleDateString('fa-IR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={selectedUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
        >
          <UserForm 
            initialUser={selectedUser} 
            onSubmit={(user) => {
              // TODO: Implement add/edit user logic
              console.log(user);
              setIsModalOpen(false);
            }} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

interface UserFormProps {
  initialUser?: User | null;
  onSubmit: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialUser, onSubmit, onCancel }) => {
  const [user, setUser] = useState<Partial<User>>({
    id: initialUser?.id || '',
    username: initialUser?.username || '',
    email: initialUser?.email || '',
    role: initialUser?.role || 'VIEWER',
    firstName: initialUser?.firstName || '',
    lastName: initialUser?.lastName || '',
    isActive: initialUser?.isActive ?? true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(user as User);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">نام</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">نام خانوادگی</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">نام کاربری</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">ایمیل</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">نقش</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="ADMIN">مدیر</option>
            <option value="STAFF">کارمند</option>
            <option value="VIEWER">مشاهده‌کننده</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">وضعیت</label>
          <select
            name="isActive"
            value={user.isActive ? 'true' : 'false'}
            onChange={(e) => setUser(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="true">فعال</option>
            <option value="false">غیرفعال</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 reverse-space-x">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          انصراف
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ذخیره
        </button>
      </div>
    </form>
  );
};

export default UserManagementPage;
