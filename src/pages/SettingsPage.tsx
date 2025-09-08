import React from 'react';

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">تنظیمات</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">تنظیمات حساب کاربری</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">اطلاعات کاربری</h3>
              <p className="text-gray-600">نام کاربری: مدیر سیستم</p>
              <p className="text-gray-600">ایمیل: admin@warehousing.com</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">تنظیمات عمومی</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">زبان سیستم</span>
                <select className="border rounded px-2 py-1">
                  <option value="fa">فارسی</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">خروج از سیستم</h2>
          <button 
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            خروج از حساب کاربری
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
