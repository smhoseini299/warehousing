import { useState } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign, Eye, Calendar, Bell, Settings } from 'lucide-react';

interface InventoryDataItem {
  name: string;
  value: number;
  color: string;
}

const DashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [notifications, setNotifications] = useState(3);

  // Sample data for charts
  const salesData = [
    { month: 'فروردین', sales: 4500, orders: 45 },
    { month: 'اردیبهشت', sales: 5200, orders: 52 },
    { month: 'خرداد', sales: 4800, orders: 48 },
    { month: 'تیر', sales: 6100, orders: 61 },
    { month: 'مرداد', sales: 5600, orders: 56 },
    { month: 'شهریور', sales: 7200, orders: 72 }
  ];

  const inventoryData: InventoryDataItem[] = [
    { name: 'موجود', value: 65, color: '#10B981' },
    { name: 'کم موجود', value: 25, color: '#F59E0B' },
    { name: 'ناموجود', value: 10, color: '#EF4444' }
  ];

  const topProducts = [
    { name: 'محصول A', sales: 1250, trend: 'up' },
    { name: 'محصول B', sales: 980, trend: 'up' },
    { name: 'محصول C', sales: 750, trend: 'down' },
    { name: 'محصول D', sales: 650, trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">داشبورد مدیریت</h1>
          <p className="text-gray-600">خوش آمدید، نمای کلی فروشگاه شما</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">هفتگی</option>
            <option value="month">ماهانه</option>
            <option value="year">سالانه</option>
          </select>
          {/* <button className="relative p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Settings className="w-5 h-5 text-gray-600" />
          </button> */}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">موجودی انبار</p>
              <p className="text-3xl font-bold">۱۲۳۴</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 ml-1" />
                <span className="text-sm">+۸.۲%</span>
              </div>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">فروش ماهانه</p>
              <p className="text-3xl font-bold">۴.۵M</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 ml-1" />
                <span className="text-sm">+۱۵.۳%</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">سفارشات جدید</p>
              <p className="text-3xl font-bold">۲۳</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 ml-1" />
                <span className="text-sm">+۵.۷%</span>
              </div>
            </div>
            <ShoppingCart className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">مشتریان فعال</p>
              <p className="text-3xl font-bold">۱۵۶</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 ml-1" />
                <span className="text-sm">+۱۲.۱%</span>
              </div>
            </div>
            <Users className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">روند فروش</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              <Eye className="w-4 h-4 ml-1" />
              مشاهده جزئیات
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Status */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">وضعیت موجودی</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              <Eye className="w-4 h-4 ml-1" />
              مدیریت انبار
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }: InventoryDataItem) => `${name}: ${value}%`}
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        generateLabels: (chart) => {
                          return inventoryData.map((item, index) => ({
                            text: `${item.name}: ${item.value}%`,
                            fillStyle: item.color,
                            index,
                          }));
                        }
                      }
                    }
                  }
                }}
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">پرفروش‌ترین محصولات</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} فروش</p>
                </div>
                <div className={`p-2 rounded-full ${product.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {product.trend === 'up' ? 
                    <TrendingUp className="w-4 h-4 text-green-600" /> : 
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">فعالیت‌های اخیر</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-800">سفارش جدید از مشتری احمد رضایی</p>
                <p className="text-xs text-gray-500">۲ دقیقه پیش</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-800">محصول جدید به انبار اضافه شد</p>
                <p className="text-xs text-gray-500">۱۰ دقیقه پیش</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-800">هشدار: موجودی محصول A کم است</p>
                <p className="text-xs text-gray-500">۳۰ دقیقه پیش</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-800">مشتری جدید ثبت نام کرد</p>
                <p className="text-xs text-gray-500">۱ ساعت پیش</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">اقدامات سریع</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800">افزودن محصول</p>
            </button>
            <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <ShoppingCart className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800">سفارش جدید</p>
            </button>
            <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-purple-800">مشتری جدید</p>
            </button>
            <button className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-orange-800">گزارش‌گیری</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;