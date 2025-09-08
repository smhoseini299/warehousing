import React, { useState } from 'react';
import { Download, Calendar, Filter, BarChart3 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/UI/Card';

export default function ReportsPage() {
  const { state } = useApp();
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTransactions = state.transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    
    let dateMatch = true;
    if (dateFilter === 'today') {
      dateMatch = transactionDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateMatch = transactionDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateMatch = transactionDate >= monthAgo;
    }

    const typeMatch = typeFilter === 'all' || transaction.type === typeFilter;

    return dateMatch && typeMatch;
  });

  const totalIn = filteredTransactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.quantity, 0);

  const totalOut = filteredTransactions
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + t.quantity, 0);

  const exportToCSV = () => {
    const headers = ['نوع', 'کالا', 'مقدار', 'تاریخ', 'طرف تراکنش', 'یادداشت'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.type === 'in' ? 'ورود' : 'خروج',
        t.productName,
        t.quantity,
        new Date(t.date).toLocaleDateString('fa-IR'),
        t.supplier || t.customer || t.destination || '',
        t.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `warehouse-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">گزارش‌ها</h1>
            <p className="mt-2 text-gray-600">نمایش گزارش‌های تفصیلی تراکنش‌های انبار</p>
          </div>
          <button
            onClick={exportToCSV}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Download className="h-4 w-4 ml-2" />
            دانلود CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline h-4 w-4 ml-1" />
              بازه زمانی
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            >
              <option value="all">همه تاریخ‌ها</option>
              <option value="today">امروز</option>
              <option value="week">هفته گذشته</option>
              <option value="month">ماه گذشته</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="inline h-4 w-4 ml-1" />
              نوع تراکنش
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            >
              <option value="all">همه تراکنش‌ها</option>
              <option value="in">ورودی</option>
              <option value="out">خروجی</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center">
            <div className="bg-blue-600 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-blue-600">کل تراکنش‌ها</p>
              <p className="text-2xl font-bold text-blue-900">{filteredTransactions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center">
            <div className="bg-green-600 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-green-600">کل ورودی</p>
              <p className="text-2xl font-bold text-green-900">{totalIn}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100">
          <div className="flex items-center">
            <div className="bg-red-600 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-red-600">کل خروجی</p>
              <p className="text-2xl font-bold text-red-900">{totalOut}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">گزارش تفصیلی تراکنش‌ها</h3>
          <p className="text-sm text-gray-600">
            {filteredTransactions.length} تراکنش یافت شد
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  کالا
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مقدار
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  طرف تراکنش
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  یادداشت
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'in'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type === 'in' ? 'ورود' : 'خروج'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.supplier || transaction.customer || transaction.destination || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate">
                        {transaction.notes || '-'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    هیچ تراکنشی برای فیلتر انتخابی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}