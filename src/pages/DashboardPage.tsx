import React from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/UI/Card';

export default function DashboardPage() {
  const { getDashboardStats, state } = useApp();
  const stats = getDashboardStats();

  const lowStockProducts = state.products.filter(p => p.currentStock <= p.minStock);
  const recentTransactions = state.transactions.slice(0, 5);

  const statsCards = [
    {
      title: 'تعداد کل کالاها',
      value: stats.totalProducts,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'ورودی امروز',
      value: stats.todayIn,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'خروجی امروز',
      value: stats.todayOut,
      icon: TrendingDown,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'هشدار موجودی کم',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">داشبورد مدیریت انبار</h1>
        <p className="mt-2 text-gray-600">نمای کلی از وضعیت انبار و آمار روزانه</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alert */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">هشدار موجودی کم</h3>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">کد: {product.code}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-red-600">موجودی: {product.currentStock}</p>
                    <p className="text-xs text-gray-500">حداقل: {product.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">هیچ کالایی با موجودی کم وجود ندارد</p>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">آخرین تراکنش‌ها</h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.productName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <div className="text-left">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'in'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type === 'in' ? 'ورود' : 'خروج'}: {transaction.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">هیچ تراکنشی ثبت نشده است</p>
          )}
        </Card>
      </div>
    </div>
  );
}