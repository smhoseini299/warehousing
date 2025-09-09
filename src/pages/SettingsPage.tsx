import React, { useState } from 'react';
import { User, Lock, Bell, Eye, Globe, Palette, Shield, Download, Trash2, Save, Edit2, Check, X } from 'lucide-react';

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    lowStock: true,
    systemUpdates: false
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('fa');
  const [userInfo, setUserInfo] = useState({
    fullName: 'مدیر سیستم',
    email: 'admin@warehousing.com',
    phone: '09123456789',
    department: 'مدیریت انبار'
  });
  const [tempUserInfo, setTempUserInfo] = useState(userInfo);

  const tabs = [
    { id: 'profile', label: 'پروفایل', icon: User },
    { id: 'security', label: 'امنیت', icon: Shield },
    { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
    { id: 'appearance', label: 'ظاهر', icon: Palette },
    { id: 'privacy', label: 'حریم خصوصی', icon: Eye },
    { id: 'data', label: 'داده‌ها', icon: Download }
  ];

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveProfile = () => {
    setUserInfo(tempUserInfo);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempUserInfo(userInfo);
    setIsEditing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">اطلاعات پروفایل</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 size={16} />
                  ویرایش
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check size={16} />
                    ذخیره
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    انصراف
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام کامل</label>
                  <input
                    type="text"
                    value={isEditing ? tempUserInfo.fullName : userInfo.fullName}
                    onChange={(e) => setTempUserInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                  <input
                    type="email"
                    value={isEditing ? tempUserInfo.email : userInfo.email}
                    onChange={(e) => setTempUserInfo(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن</label>
                  <input
                    type="tel"
                    value={isEditing ? tempUserInfo.phone : userInfo.phone}
                    onChange={(e) => setTempUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">بخش</label>
                  <input
                    type="text"
                    value={isEditing ? tempUserInfo.department : userInfo.department}
                    onChange={(e) => setTempUserInfo(prev => ({ ...prev, department: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">آخرین فعالیت</h3>
              <p className="text-blue-700 text-sm">آخرین ورود: امروز، ساعت 09:30</p>
              <p className="text-blue-700 text-sm">IP آخرین ورود: 192.168.1.100</p>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">تنظیمات امنیتی</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">تغییر رمز عبور</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور فعلی</label>
                    <input
                      type="password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور جدید</label>
                    <input
                      type="password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تکرار رمز عبور جدید</label>
                    <input
                      type="password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    تغییر رمز عبور
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">احراز هویت دو مرحله‌ای</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">افزایش امنیت حساب با فعال‌سازی احراز هویت دو مرحله‌ای</p>
                    <p className="text-sm text-gray-500 mt-1">وضعیت: غیرفعال</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    فعال‌سازی
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">جلسات فعال</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">مرورگر فعلی</p>
                      <p className="text-sm text-gray-600">Chrome - Windows</p>
                      <p className="text-xs text-gray-500">IP: 192.168.1.100</p>
                    </div>
                    <span className="text-green-600 text-sm font-medium">فعال</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">موبایل</p>
                      <p className="text-sm text-gray-600">Safari - iOS</p>
                      <p className="text-xs text-gray-500">آخرین فعالیت: 2 ساعت پیش</p>
                    </div>
                    <button className="text-red-600 text-sm hover:underline">خروج</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">تنظیمات اعلان‌ها</h2>
            
            <div className="space-y-4">
              {Object.entries({
                email: 'اعلان‌های ایمیل',
                push: 'اعلان‌های push',
                sms: 'اعلان‌های پیامکی',
                lowStock: 'اعلان موجودی پایین',
                systemUpdates: 'به‌روزرسانی‌های سیستم'
              }).map(([key, label]) => (
                <div key={key} className="bg-white p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{label}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        دریافت اعلان‌های مربوط به {label.toLowerCase()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications[key as keyof typeof notifications]}
                        onChange={() => handleNotificationChange(key)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">تنظیمات ظاهر</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">تم رنگی</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'light', name: 'روشن', preview: 'bg-white border-2' },
                    { id: 'dark', name: 'تیره', preview: 'bg-gray-800 border-2' },
                    { id: 'auto', name: 'خودکار', preview: 'bg-gradient-to-r from-white to-gray-800 border-2' }
                  ].map(({ id, name, preview }) => (
                    <button
                      key={id}
                      onClick={() => setTheme(id)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === id ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <div className={`h-16 rounded ${preview} mb-2`}></div>
                      <p className="text-sm font-medium">{name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">زبان سیستم</h3>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fa">فارسی</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">تنظیمات حریم خصوصی</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">مشاهده پروفایل</h3>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>عمومی</option>
                  <option>فقط همکاران</option>
                  <option>خصوصی</option>
                </select>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">ردیابی فعالیت</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>ذخیره تاریخچه فعالیت‌ها</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>اشتراک‌گذاری داده‌های کاربری برای بهبود سیستم</span>
                  </label>
                </div>
              </div>

              <div className="bg-red-50 p-6 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-4">حذف حساب کاربری</h3>
                <p className="text-red-700 text-sm mb-4">
                  با حذف حساب کاربری، تمام داده‌های شما به‌طور دائم حذف خواهد شد.
                </p>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  درخواست حذف حساب
                </button>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">مدیریت داده‌ها</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">دانلود داده‌ها</h3>
                <p className="text-gray-600 mb-4">
                  فایل‌های زیر حاوی تمام داده‌های حساب شما می‌باشند:
                </p>
                <div className="space-y-2">
                  <button className="flex items-center gap-2 w-full p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                    <Download size={16} />
                    دانلود اطلاعات کاربری (JSON)
                  </button>
                  <button className="flex items-center gap-2 w-full p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                    <Download size={16} />
                    دانلود تاریخچه فعالیت‌ها (CSV)
                  </button>
                  <button className="flex items-center gap-2 w-full p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                    <Download size={16} />
                    دانلود گزارش کامل (PDF)
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-4">پاک‌سازی داده‌ها</h3>
                <p className="text-yellow-700 text-sm mb-4">
                  حذف داده‌های موقت و کش برای بهبود عملکرد سیستم
                </p>
                <div className="space-y-2">
                  <button className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                    <Trash2 size={16} />
                    پاک‌سازی کش
                  </button>
                  <button className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                    <Trash2 size={16} />
                    حذف فایل‌های موقت
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">تنظیمات</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <nav className="space-y-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg text-right transition-colors ${
                      activeTab === id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-3 w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Lock size={20} />
                  خروج از حساب
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;